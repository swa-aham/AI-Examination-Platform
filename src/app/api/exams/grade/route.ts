import { NextRequest, NextResponse } from 'next/server';
import { gradeSingleWordAnswer, gradeShortAnswer, gradeLongAnswer, generateExamSummary } from '@/lib/gemini';
import dbConnect from '@/lib/mongodb';
import Exam from '@/models/Exam';
import StudentAnswer from '@/models/StudentAnswer';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data = await req.json();
    const { examId, studentId, answers, startTime } = data;

    if (!examId || !studentId || !answers || !startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Retrieve exam details
    const exam = await Exam.findById(examId);
    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if student has already submitted this exam
    const existingSubmission = await StudentAnswer.findOne({
      student: studentId,
      exam: examId
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted this exam' },
        { status: 409 }
      );
    }

    // Grade each answer using Gemini AI
    const gradedAnswers = [];
    const totalPossibleMarks = exam.questions.reduce((sum, q) => sum + q.marks, 0);
    let totalMarks = 0;

    for (const question of exam.questions) {
      const studentAnswer = answers[question.id] || '';
      let marks = 0;
      let feedback = '';
      let gradingDetails = {};

      // Grade based on question type
      if (question.type === 'single-word' && question.correctAnswer) {
        const result = await gradeSingleWordAnswer(studentAnswer, question.correctAnswer);
        marks = result.marks;
        feedback = result.feedback;
        gradingDetails = result;
      } else if (question.type === 'short-answer') {
        const result = await gradeShortAnswer(studentAnswer, question.text, {
          accuracy: 5,
          clarity: 3,
          completeness: 2
        });
        marks = result.marks.total;
        feedback = result.feedback;
        gradingDetails = result.marks;
      } else if (question.type === 'long-answer') {
        const result = await gradeLongAnswer(studentAnswer, question.text, {
          contentAccuracy: 5,
          clarityStructure: 3,
          grammarLanguage: 2,
          depthExplanation: 5
        });
        marks = result.marks.total;
        feedback = result.feedback;
        gradingDetails = result.marks;
      }

      // Cap marks to question's maximum
      marks = Math.min(marks, question.marks);
      totalMarks += marks;

      gradedAnswers.push({
        questionId: question.id,
        answer: studentAnswer,
        marks,
        possibleMarks: question.marks,
        feedback,
        graded: true,
        gradingDetails
      });
    }

    // Generate overall exam summary
    const questionsForSummary = exam.questions.map(q => ({
      id: q.id,
      text: q.text,
      marks: q.marks,
      type: q.type
    }));

    const answersForSummary = gradedAnswers.map(a => ({
      questionId: a.questionId,
      answer: a.answer,
      marks: a.marks,
      feedback: a.feedback
    }));

    const summary = await generateExamSummary(
      student.name,
      exam.title,
      questionsForSummary,
      answersForSummary
    );

    // Create student answer record
    const studentAnswer = new StudentAnswer({
      student: studentId,
      exam: examId,
      answers: gradedAnswers,
      startTime: new Date(startTime),
      submissionTime: new Date(),
      totalMarks,
      totalPossibleMarks,
      feedback: summary.overallFeedback,
      overallFeedback: {
        strengthAreas: summary.strengthAreas,
        improvementAreas: summary.improvementAreas
      }
    });

    await studentAnswer.save();

    return NextResponse.json({
      success: true,
      studentAnswerId: studentAnswer._id,
      totalMarks,
      totalPossibleMarks,
      percentage: summary.percentage,
      overallFeedback: summary.overallFeedback,
      strengthAreas: summary.strengthAreas,
      improvementAreas: summary.improvementAreas
    });
  } catch (error) {
    console.error('Error grading exam:', error);
    return NextResponse.json(
      { error: 'Failed to grade exam' },
      { status: 500 }
    );
  }
}
