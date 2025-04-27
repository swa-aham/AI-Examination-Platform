'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock exam results data until we connect to the backend
const MOCK_RESULTS = {
  '1': {
    examId: '1',
    examTitle: 'Science - Forces and Motion',
    subject: 'Science',
    totalMarks: 38,
    totalPossibleMarks: 56,
    percentage: 68,
    submittedOn: '2025-04-27T12:30:45',
    overallFeedback: 'You demonstrated a good understanding of basic concepts in forces and motion. Your explanations of Newton\'s laws were accurate, though some examples lacked detail. You should focus on improving your explanations of friction and gravity\'s effect on motion.',
    strengthAreas: [
      'Strong grasp of Newton\'s First and Second Laws',
      'Good understanding of the difference between mass and weight',
      'Clear explanations of basic force concepts'
    ],
    improvementAreas: [
      'More detailed explanations needed for Newton\'s Third Law',
      'Deeper analysis of friction and its effects',
      'Better examples needed to illustrate concepts'
    ],
    questionResults: [
      {
        id: '1-1',
        question: 'What force pulls objects toward the center of the Earth?',
        type: 'single-word',
        answer: 'gravity',
        marks: 2,
        possibleMarks: 2,
        feedback: 'Correct! Gravity is the force that pulls objects toward the center of the Earth.'
      },
      {
        id: '1-2',
        question: 'Explain the difference between mass and weight.',
        type: 'short-answer',
        answer: 'Mass is the amount of matter in an object and doesn\'t change. Weight is the force of gravity on an object and can change depending on location.',
        marks: 4,
        possibleMarks: 5,
        feedback: 'Good explanation of the basic difference. You correctly identified that mass doesn\'t change while weight can vary. For full marks, you could have mentioned that weight is calculated as mass × gravitational acceleration (W = mg).'
      },
      {
        id: '1-3',
        question: 'Describe Newton\'s Three Laws of Motion and give one example for each law.',
        type: 'long-answer',
        answer: 'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. For example, a book on a table stays there until someone moves it.\n\nNewton\'s Second Law states that force equals mass times acceleration (F = ma). For example, pushing a shopping cart with more force makes it accelerate faster.\n\nNewton\'s Third Law states that for every action, there is an equal and opposite reaction. For example, when a bird pushes air down with its wings, the air pushes the bird up.',
        marks: 8,
        possibleMarks: 10,
        feedback: 'You have correctly described all three laws of motion and provided appropriate examples. For Newton\'s First Law, your example of a book on a table is good, but you could have also explained an example of objects in motion (like a moving car stopping when brakes are applied). Your Second Law explanation and example are excellent. For the Third Law, your bird example is good, but a more detailed explanation of the forces involved would have earned full marks.'
      }
    ]
  }
};

export default function ExamResults({ params }: { params: { examId: string } }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // In a real app, fetch results from API
    const fetchResults = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if results exist in our mock data
        if (MOCK_RESULTS[params.examId]) {
          setResults(MOCK_RESULTS[params.examId]);
        } else {
          setError('Results not found');
        }
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [params.examId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full card text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Results not found'}</p>
          <Link href="/dashboard/student" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with summary */}
        <div className="card mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{results.examTitle} - Results</h1>
            <div className="text-gray-600 mb-4">
              <span>Submitted on {new Date(results.submittedOn).toLocaleString()}</span>
            </div>
            
            <div className="inline-flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={`${
                      results.percentage >= 80 ? 'text-green-500' :
                      results.percentage >= 60 ? 'text-primary-500' :
                      results.percentage >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={`${results.percentage * 2.83} 283`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                  {results.percentage}%
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-center">
              <p className="font-semibold text-lg">
                {results.totalMarks} / {results.totalPossibleMarks} marks
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Feedback</h2>
            <p className="text-gray-700 mb-6">{results.overallFeedback}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-green-600 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {results.strengthAreas.map((strength, index) => (
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
                  {results.improvementAreas.map((area, index) => (
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
          </div>
        </div>
        
        {/* Detailed question results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Question Details</h2>
          
          <div className="space-y-8">
            {results.questionResults.map((result, index) => (
              <div key={result.id} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Question {index + 1}: {result.question}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.marks === result.possibleMarks ? 'bg-green-100 text-green-800' :
                    result.marks > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.marks} / {result.possibleMarks}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Your Answer:</h4>
                  <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-line">
                    {result.answer}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h4>
                  <p className="text-gray-700">{result.feedback}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard/student" className="btn-primary">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
