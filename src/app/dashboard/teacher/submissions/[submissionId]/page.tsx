'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock submission data
const MOCK_SUBMISSIONS = {
  's1': {
    id: 's1',
    examId: '1',
    examTitle: 'Science - Forces and Motion',
    studentName: 'Alice Johnson',
    studentId: '101',
    submittedOn: '2025-04-25T14:30:00',
    score: 38,
    totalPossible: 56,
    percentage: 68,
    answers: [
      {
        questionId: '1-1',
        question: 'What force pulls objects toward the center of the Earth?',
        type: 'single-word',
        answer: 'gravity',
        marks: 2,
        possibleMarks: 2,
        feedback: 'Correct! Gravity is the force that pulls objects toward the center of the Earth.'
      },
      {
        questionId: '1-2',
        question: 'Explain the difference between mass and weight.',
        type: 'short-answer',
        answer: 'Mass is the amount of matter in an object and doesn\'t change. Weight is the force of gravity on an object and can change depending on location.',
        marks: 4,
        possibleMarks: 5,
        feedback: 'Good explanation of the basic difference. You correctly identified that mass doesn\'t change while weight can vary. For full marks, you could have mentioned that weight is calculated as mass × gravitational acceleration (W = mg).'
      },
      {
        questionId: '1-3',
        question: 'Describe Newton\'s Three Laws of Motion and give one example for each law.',
        type: 'long-answer',
        answer: 'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. For example, a book on a table stays there until someone moves it.\n\nNewton\'s Second Law states that force equals mass times acceleration (F = ma). For example, pushing a shopping cart with more force makes it accelerate faster.\n\nNewton\'s Third Law states that for every action, there is an equal and opposite reaction. For example, when a bird pushes air down with its wings, the air pushes the bird up.',
        marks: 8,
        possibleMarks: 10,
        feedback: 'You have correctly described all three laws of motion and provided appropriate examples. For Newton\'s First Law, your example of a book on a table is good, but you could have also explained an example of objects in motion (like a moving car stopping when brakes are applied). Your Second Law explanation and example are excellent. For the Third Law, your bird example is good, but a more detailed explanation of the forces involved would have earned full marks.'
      }
    ],
    overallFeedback: 'Alice demonstrated a good understanding of basic concepts in forces and motion. Her explanations of Newton\'s laws were accurate, though some examples lacked detail. She should focus on improving her explanations of friction and gravity\'s effect on motion.',
    strengthAreas: [
      'Strong grasp of Newton\'s First and Second Laws',
      'Good understanding of the difference between mass and weight',
      'Clear explanations of basic force concepts'
    ],
    improvementAreas: [
      'More detailed explanations needed for Newton\'s Third Law',
      'Deeper analysis of friction and its effects',
      'Better examples needed to illustrate concepts'
    ]
  }
};

export default function SubmissionDetails({ params }: { params: { submissionId: string } }) {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherFeedback, setTeacherFeedback] = useState('');
  
  useEffect(() => {
    // In a real app, fetch submission details from API
    const fetchSubmission = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if submission exists in our mock data
        if (MOCK_SUBMISSIONS[params.submissionId]) {
          setSubmission(MOCK_SUBMISSIONS[params.submissionId]);
        } else {
          setError('Submission not found');
        }
      } catch (err) {
        setError('Failed to load submission details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmission();
  }, [params.submissionId]);
  
  const handleAddFeedback = () => {
    // In a real app, send API request to save teacher feedback
    console.log('Submitting teacher feedback:', teacherFeedback);
    alert('Feedback added successfully');
    // Optionally clear the input
    // setTeacherFeedback('');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full card text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Submission not found'}</p>
          <Link href="/dashboard/teacher" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Submission Details</h1>
          <Link 
            href={`/dashboard/teacher/exam/${submission.examId}`} 
            className="text-primary-600 hover:text-primary-800"
          >
            Back to Exam
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Submission overview */}
        <div className="card mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{submission.examTitle}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <span className="font-medium mr-2">Student:</span>
                <span>{submission.studentName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Submitted:</span>
                <span>{new Date(submission.submittedOn).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Score:</span>
                <span>{submission.score} / {submission.totalPossible}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Percentage:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  submission.percentage >= 80 ? 'bg-green-100 text-green-800' :
                  submission.percentage >= 60 ? 'bg-blue-100 text-blue-800' :
                  submission.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {submission.percentage}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="text-lg font-medium text-green-600 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {submission.strengthAreas.map((strength, index) => (
                    <li key={index} className="flex">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-red-600 mb-3">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {submission.improvementAreas.map((area, index) => (
                    <li key={index} className="flex">
                      <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">AI Feedback</h3>
              <div className="bg-blue-50 p-4 rounded-md text-gray-700">
                {submission.overallFeedback}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Teacher Feedback</h3>
            <textarea
              value={teacherFeedback}
              onChange={(e) => setTeacherFeedback(e.target.value)}
              className="input-field h-32 mb-4"
              placeholder="Add your feedback for the student here..."
            ></textarea>
            <button 
              onClick={handleAddFeedback}
              className="btn-primary"
              disabled={!teacherFeedback.trim()}
            >
              Add Feedback
            </button>
          </div>
        </div>
        
        {/* Detailed question results */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Question Details</h3>
          
          <div className="space-y-8">
            {submission.answers.map((answer, index) => (
              <div key={answer.questionId} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    Question {index + 1}: {answer.question}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    answer.marks === answer.possibleMarks ? 'bg-green-100 text-green-800' :
                    answer.marks > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {answer.marks} / {answer.possibleMarks}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">Student's Answer:</h5>
                  <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-line">
                    {answer.answer}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">AI Feedback:</h5>
                  <p className="text-gray-700">{answer.feedback}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link 
              href={`/dashboard/teacher/student/${submission.studentId}`}
              className="btn-primary"
            >
              View Student Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
