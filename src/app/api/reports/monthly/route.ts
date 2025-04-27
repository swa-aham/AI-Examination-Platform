import { NextRequest, NextResponse } from 'next/server';
import { generateMonthlyProgressReport } from '@/lib/gemini';
import dbConnect from '@/lib/mongodb';
import StudentAnswer from '@/models/StudentAnswer';
import User from '@/models/User';
import Exam from '@/models/Exam';
import MonthlyReport from '@/models/MonthlyReport';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data = await req.json();
    const { studentId, month, year } = data;

    if (!studentId || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
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

    // Check if monthly report already exists
    const existingReport = await MonthlyReport.findOne({
      student: studentId,
      month,
      year
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'Monthly report already exists', reportId: existingReport._id },
        { status: 409 }
      );
    }

    // Get all exams taken by the student in the specified month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const studentAnswers = await StudentAnswer.find({
      student: studentId,
      submissionTime: { $gte: startDate, $lte: endDate }
    }).populate({
      path: 'exam',
      select: 'title subject grade'
    });

    if (studentAnswers.length === 0) {
      return NextResponse.json(
        { error: 'No exam results found for the specified month' },
        { status: 404 }
      );
    }

    // Get previous month's report for comparison if available
    let previousMonthPercentage = undefined;
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;
    
    const previousReport = await MonthlyReport.findOne({
      student: studentId,
      month: previousMonth,
      year: previousYear
    });

    if (previousReport) {
      previousMonthPercentage = previousReport.overallPercentage;
    }

    // Organize exam results by subject
    const subjectResults = {};
    const examResultsForAI = [];

    let totalScore = 0;
    let totalPossible = 0;

    for (const answer of studentAnswers) {
      const exam = answer.exam;
      const subject = exam.subject;
      
      if (!subjectResults[subject]) {
        subjectResults[subject] = {
          subject,
          examCount: 0,
          totalScore: 0,
          totalPossible: 0,
          strengths: [],
          weaknesses: []
        };
      }
      
      subjectResults[subject].examCount += 1;
      subjectResults[subject].totalScore += answer.totalMarks;
      subjectResults[subject].totalPossible += answer.totalPossibleMarks;
      
      // Add strengths and weaknesses from each exam
      subjectResults[subject].strengths = [
        ...subjectResults[subject].strengths,
        ...(answer.overallFeedback?.strengthAreas || []).slice(0, 2)
      ];
      
      subjectResults[subject].weaknesses = [
        ...subjectResults[subject].weaknesses,
        ...(answer.overallFeedback?.improvementAreas || []).slice(0, 2)
      ];
      
      totalScore += answer.totalMarks;
      totalPossible += answer.totalPossibleMarks;
      
      // Prepare data for Gemini AI
      examResultsForAI.push({
        examId: exam._id,
        examTitle: exam.title,
        subject: exam.subject,
        date: answer.submissionTime.toISOString().split('T')[0],
        marks: answer.totalMarks,
        totalPossible: answer.totalPossibleMarks,
        percentage: Math.round((answer.totalMarks / answer.totalPossibleMarks) * 100),
        strengths: answer.overallFeedback?.strengthAreas || [],
        weaknesses: answer.overallFeedback?.improvementAreas || []
      });
    }
    
    // Calculate overall percentage
    const overallPercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    
    // Convert subject results to the format needed for database
    const subjectProgress = Object.values(subjectResults).map(subject => {
      const avgScore = Math.round((subject.totalScore / subject.totalPossible) * 100);
      
      // Remove duplicate strengths/weaknesses
      const uniqueStrengths = [...new Set(subject.strengths)];
      const uniqueWeaknesses = [...new Set(subject.weaknesses)];
      
      return {
        subject: subject.subject,
        examCount: subject.examCount,
        averageScore: avgScore,
        strengths: uniqueStrengths.slice(0, 3), // Limit to top 3
        weaknesses: uniqueWeaknesses.slice(0, 3), // Limit to top 3
        analysis: '' // Will be filled by Gemini AI
      };
    });
    
    // Generate AI report
    const aiReport = await generateMonthlyProgressReport(
      student.name,
      student.grade,
      examResultsForAI,
      previousMonthPercentage
    );
    
    // Update subject analyses from AI
    for (const subject of subjectProgress) {
      if (aiReport.subjectWiseAnalysis[subject.subject]) {
        subject.analysis = aiReport.subjectWiseAnalysis[subject.subject];
      } else {
        subject.analysis = `No specific analysis available for ${subject.subject}`;
      }
    }
    
    // Create monthly report
    const monthlyReport = new MonthlyReport({
      student: studentId,
      month,
      year,
      examResults: studentAnswers.map(a => a._id),
      subjectProgress,
      overallScore: totalScore,
      overallPercentage,
      monthlyAssessment: aiReport.monthlyAssessment,
      progressEvaluation: aiReport.overallProgress,
      recommendedActions: aiReport.recommendedActions,
      improvementFromPreviousMonth: aiReport.improvementPercentage
    });
    
    await monthlyReport.save();
    
    return NextResponse.json({
      success: true,
      reportId: monthlyReport._id,
      overallPercentage,
      monthlyAssessment: aiReport.monthlyAssessment,
      progressEvaluation: aiReport.overallProgress,
      recommendedActions: aiReport.recommendedActions,
      improvementPercentage: aiReport.improvementPercentage,
      subjectProgress
    });
  } catch (error) {
    console.error('Error generating monthly report:', error);
    return NextResponse.json(
      { error: 'Failed to generate monthly report' },
      { status: 500 }
    );
  }
}
