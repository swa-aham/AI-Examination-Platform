import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
// In production, store this in an environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || 'YOUR_API_KEY');

// Function to grade single-word answers
export async function gradeSingleWordAnswer(
  studentAnswer: string,
  correctAnswer: string
): Promise<{ marks: number; feedback: string }> {
  // For single-word answers, we'll use a simple string comparison
  // but also allow for minor spelling variations using Gemini

  const prompt = `
    Grade this single-word answer based on the following criteria:
    - 2 points for a fully correct answer (exact match or very minor spelling error)
    - 1 point for a partially correct answer (conceptually correct but incorrect form)
    - 0 points for an incorrect answer

    Correct answer: "${correctAnswer}"
    Student answer: "${studentAnswer}"

    Return the grade (0, 1, or 2) and brief feedback explaining why the answer is correct or incorrect.
    Format your response exactly as follows:
    MARKS: [number]
    FEEDBACK: [text]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response
    const marksMatch = response.match(/MARKS: (\d+)/);
    const feedbackMatch = response.match(/FEEDBACK: (.*?)($|$)/s);
    
    const marks = marksMatch ? parseInt(marksMatch[1], 10) : 0;
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No feedback provided';
    
    return { marks, feedback };
  } catch (error) {
    console.error('Error grading single-word answer:', error);
    return { marks: 0, feedback: 'Error during grading. Please review manually.' };
  }
}

// Function to grade short answers (1-2 sentences)
export async function gradeShortAnswer(
  studentAnswer: string,
  question: string,
  rubric: { accuracy: number; clarity: number; completeness: number }
): Promise<{ marks: { accuracy: number; clarity: number; completeness: number; total: number }; feedback: string }> {
  const prompt = `
    Grade this short answer (1-2 sentences) based on the following rubric:
    1) Accuracy: 0-${rubric.accuracy} points (correctness of information)
    2) Clarity: 0-${rubric.clarity} points (clarity and conciseness of the answer)
    3) Completeness: 0-${rubric.completeness} points (whether the answer covers all required aspects)

    Question: "${question}"
    Student Answer: "${studentAnswer}"

    Provide a detailed assessment for each criterion and overall feedback.
    Format your response exactly as follows:
    ACCURACY: [number]
    CLARITY: [number]
    COMPLETENESS: [number]
    FEEDBACK: [text]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response
    const accuracyMatch = response.match(/ACCURACY: (\d+)/);
    const clarityMatch = response.match(/CLARITY: (\d+)/);
    const completenessMatch = response.match(/COMPLETENESS: (\d+)/);
    const feedbackMatch = response.match(/FEEDBACK: (.*?)($|$)/s);
    
    const accuracy = accuracyMatch ? parseInt(accuracyMatch[1], 10) : 0;
    const clarity = clarityMatch ? parseInt(clarityMatch[1], 10) : 0;
    const completeness = completenessMatch ? parseInt(completenessMatch[1], 10) : 0;
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No feedback provided';
    
    return { 
      marks: { 
        accuracy, 
        clarity, 
        completeness, 
        total: accuracy + clarity + completeness 
      }, 
      feedback 
    };
  } catch (error) {
    console.error('Error grading short answer:', error);
    return { 
      marks: { accuracy: 0, clarity: 0, completeness: 0, total: 0 }, 
      feedback: 'Error during grading. Please review manually.' 
    };
  }
}

// Function to grade long answers and essays
export async function gradeLongAnswer(
  studentAnswer: string,
  question: string,
  rubric: { 
    contentAccuracy: number; 
    clarityStructure: number; 
    grammarLanguage: number; 
    depthExplanation: number;
  }
): Promise<{ 
  marks: { 
    contentAccuracy: number; 
    clarityStructure: number; 
    grammarLanguage: number; 
    depthExplanation: number;
    total: number;
  }; 
  feedback: string 
}> {
  const prompt = `
    Grade this long answer or essay response based on the following rubric:
    1) Content Accuracy: 0-${rubric.contentAccuracy} points (correctness of facts and concepts)
    2) Clarity & Structure: 0-${rubric.clarityStructure} points (organization and logical flow)
    3) Grammar & Language: 0-${rubric.grammarLanguage} points (proper grammar, spelling, and academic tone)
    4) Depth of Explanation: 0-${rubric.depthExplanation} points (thorough exploration of concepts with examples)

    Question: "${question}"
    Student Answer: "${studentAnswer}"

    Provide a detailed assessment for each criterion and overall feedback with specific suggestions for improvement.
    Format your response exactly as follows:
    CONTENT_ACCURACY: [number]
    CLARITY_STRUCTURE: [number]
    GRAMMAR_LANGUAGE: [number]
    DEPTH_EXPLANATION: [number]
    FEEDBACK: [text]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response
    const contentMatch = response.match(/CONTENT_ACCURACY: (\d+)/);
    const clarityMatch = response.match(/CLARITY_STRUCTURE: (\d+)/);
    const grammarMatch = response.match(/GRAMMAR_LANGUAGE: (\d+)/);
    const depthMatch = response.match(/DEPTH_EXPLANATION: (\d+)/);
    const feedbackMatch = response.match(/FEEDBACK: (.*?)($|$)/s);
    
    const contentAccuracy = contentMatch ? parseInt(contentMatch[1], 10) : 0;
    const clarityStructure = clarityMatch ? parseInt(clarityMatch[1], 10) : 0;
    const grammarLanguage = grammarMatch ? parseInt(grammarMatch[1], 10) : 0;
    const depthExplanation = depthMatch ? parseInt(depthMatch[1], 10) : 0;
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'No feedback provided';
    
    return { 
      marks: { 
        contentAccuracy, 
        clarityStructure, 
        grammarLanguage, 
        depthExplanation,
        total: contentAccuracy + clarityStructure + grammarLanguage + depthExplanation
      }, 
      feedback 
    };
  } catch (error) {
    console.error('Error grading long answer:', error);
    return { 
      marks: { 
        contentAccuracy: 0, 
        clarityStructure: 0, 
        grammarLanguage: 0, 
        depthExplanation: 0,
        total: 0
      }, 
      feedback: 'Error during grading. Please review manually.' 
    };
  }
}

// Generate a summary report for the entire exam
export async function generateExamSummary(
  studentName: string,
  examTitle: string,
  questions: Array<{
    id: string;
    text: string;
    marks: number;
    type: string;
  }>,
  answers: Array<{
    questionId: string;
    answer: string;
    marks: number;
    feedback: string;
  }>
): Promise<{
  overallFeedback: string;
  strengthAreas: string[];
  improvementAreas: string[];
  totalMarks: number;
  totalPossible: number;
  percentage: number;
}> {
  // Calculate total marks
  const totalMarks = answers.reduce((sum, ans) => sum + ans.marks, 0);
  const totalPossible = questions.reduce((sum, q) => sum + q.marks, 0);
  const percentage = Math.round((totalMarks / totalPossible) * 100);

  // Create a prompt for Gemini to analyze the exam performance
  const prompt = `
    Generate a comprehensive exam summary for the following student's performance:
    
    Student: ${studentName}
    Exam: ${examTitle}
    Score: ${totalMarks}/${totalPossible} (${percentage}%)
    
    Question and Answer Details:
    ${answers.map((ans, idx) => {
      const question = questions.find(q => q.id === ans.questionId);
      return `
      Question ${idx + 1}: ${question?.text}
      Type: ${question?.type}
      Marks: ${ans.marks}/${question?.marks}
      Answer: "${ans.answer}"
      Feedback: "${ans.feedback}"
      `;
    }).join('\n')}
    
    Based on the above information, please provide:
    1. Overall performance assessment (3-4 sentences)
    2. Three specific areas of strength (bullet points)
    3. Three specific areas for improvement (bullet points)
    
    Format your response exactly as follows:
    OVERALL_FEEDBACK: [text]
    STRENGTH_AREAS: [bullet point 1]; [bullet point 2]; [bullet point 3]
    IMPROVEMENT_AREAS: [bullet point 1]; [bullet point 2]; [bullet point 3]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response
    const overallMatch = response.match(/OVERALL_FEEDBACK: (.*?)(?=STRENGTH_AREAS:|$)/s);
    const strengthMatch = response.match(/STRENGTH_AREAS: (.*?)(?=IMPROVEMENT_AREAS:|$)/s);
    const improvementMatch = response.match(/IMPROVEMENT_AREAS: (.*?)(?=$)/s);
    
    const overallFeedback = overallMatch ? overallMatch[1].trim() : 'No overall feedback provided.';
    const strengthAreas = strengthMatch 
      ? strengthMatch[1].split(';').map(item => item.trim()).filter(Boolean)
      : [];
    const improvementAreas = improvementMatch
      ? improvementMatch[1].split(';').map(item => item.trim()).filter(Boolean)
      : [];
    
    return {
      overallFeedback,
      strengthAreas,
      improvementAreas,
      totalMarks,
      totalPossible,
      percentage
    };
  } catch (error) {
    console.error('Error generating exam summary:', error);
    return {
      overallFeedback: 'Error generating summary. Please review manually.',
      strengthAreas: [],
      improvementAreas: [],
      totalMarks,
      totalPossible,
      percentage
    };
  }
}

// Generate a monthly progress report for a student
export async function generateMonthlyProgressReport(
  studentName: string,
  studentGrade: string,
  examResults: Array<{
    examId: string;
    examTitle: string;
    subject: string;
    date: string;
    marks: number;
    totalPossible: number;
    percentage: number;
    strengths: string[];
    weaknesses: string[];
  }>,
  previousMonthPercentage?: number
): Promise<{
  monthlyAssessment: string;
  subjectWiseAnalysis: Record<string, string>;
  overallProgress: string;
  recommendedActions: string[];
  improvementPercentage?: number;
}> {
  // Calculate average percentage
  const currentMonthPercentage = 
    examResults.reduce((sum, result) => sum + result.percentage, 0) / examResults.length;
  
  // Calculate improvement if previous month data is available
  const improvementPercentage = previousMonthPercentage 
    ? currentMonthPercentage - previousMonthPercentage
    : undefined;
  
  // Create a prompt for Gemini to generate the monthly report
  const prompt = `
    Generate a comprehensive monthly progress report for the following student:
    
    Student: ${studentName}
    Grade: ${studentGrade}
    Month: ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
    
    Exam Results:
    ${examResults.map(result => `
    Exam: ${result.examTitle}
    Subject: ${result.subject}
    Date: ${result.date}
    Score: ${result.marks}/${result.totalPossible} (${result.percentage}%)
    Strengths: ${result.strengths.join(', ')}
    Areas for Improvement: ${result.weaknesses.join(', ')}
    `).join('\n')}
    
    Average Percentage: ${currentMonthPercentage.toFixed(2)}%
    ${improvementPercentage !== undefined 
      ? `Improvement from Previous Month: ${improvementPercentage > 0 ? '+' : ''}${improvementPercentage.toFixed(2)}%` 
      : 'No previous month data available for comparison'}
    
    Based on the above information, please provide:
    1. Monthly assessment (3-4 sentences summarizing overall performance)
    2. Subject-wise analysis (one paragraph per subject)
    3. Overall progress evaluation (considering improvement or decline)
    4. Recommended actions for further improvement (3-4 specific, actionable suggestions)
    
    Format your response exactly as follows:
    MONTHLY_ASSESSMENT: [text]
    SUBJECT_ANALYSIS: [Subject1]:[analysis1]; [Subject2]:[analysis2]; [Subject3]:[analysis3]
    OVERALL_PROGRESS: [text]
    RECOMMENDED_ACTIONS: [action1]; [action2]; [action3]; [action4]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Parse the response
    const monthlyMatch = response.match(/MONTHLY_ASSESSMENT: (.*?)(?=SUBJECT_ANALYSIS:|$)/s);
    const subjectMatch = response.match(/SUBJECT_ANALYSIS: (.*?)(?=OVERALL_PROGRESS:|$)/s);
    const progressMatch = response.match(/OVERALL_PROGRESS: (.*?)(?=RECOMMENDED_ACTIONS:|$)/s);
    const actionsMatch = response.match(/RECOMMENDED_ACTIONS: (.*?)(?=$)/s);
    
    const monthlyAssessment = monthlyMatch ? monthlyMatch[1].trim() : 'No monthly assessment provided.';
    
    // Parse subject-wise analysis
    const subjectWiseAnalysis: Record<string, string> = {};
    if (subjectMatch) {
      const subjectEntries = subjectMatch[1].split(';').map(item => item.trim()).filter(Boolean);
      subjectEntries.forEach(entry => {
        const [subject, analysis] = entry.split(':').map(item => item.trim());
        if (subject && analysis) {
          subjectWiseAnalysis[subject] = analysis;
        }
      });
    }
    
    const overallProgress = progressMatch ? progressMatch[1].trim() : 'No overall progress evaluation provided.';
    const recommendedActions = actionsMatch 
      ? actionsMatch[1].split(';').map(item => item.trim()).filter(Boolean)
      : [];
    
    return {
      monthlyAssessment,
      subjectWiseAnalysis,
      overallProgress,
      recommendedActions,
      improvementPercentage
    };
  } catch (error) {
    console.error('Error generating monthly progress report:', error);
    return {
      monthlyAssessment: 'Error generating monthly assessment. Please review manually.',
      subjectWiseAnalysis: {},
      overallProgress: 'Error generating overall progress evaluation.',
      recommendedActions: [],
      improvementPercentage
    };
  }
}
