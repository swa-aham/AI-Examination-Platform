'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock exam data
const MOCK_EXAMS = {
  '1': {
    id: '1',
    title: 'Science - Forces and Motion',
    subject: 'Science',
    grade: '7',
    questionCount: 15,
    timeLimit: 45,
    submissions: [
      {
        id: 's1',
        studentName: 'Alice Johnson',
        submittedOn: '2025-04-25T14:30:00',
        score: 38,
        totalPossible: 56,
        percentage: 68
      },
      {
        id: 's2',
        studentName: 'Bob Smith',
        submittedOn: '2025-04-26T10:15:00',
        score: 42,
        totalPossible: 56,
        percentage: 75
      },
      {
        id: 's3',
        studentName: 'Charlie Brown',
        submittedOn: '2025-04-27T09:45:00',
        score: 50,
        totalPossible: 56,
        percentage: 89
      }
    ],
    questions: [
      { id: '1-1', text: 'What force pulls objects toward the center of the Earth?', type: 'single-word', marks: 2 },
      { id: '1-2', text: 'Explain the difference between mass and weight.', type: 'short-answer', marks: 5 },
      { id: '1-3', text: 'Describe Newton\'s Three Laws of Motion and give one example for each law.', type: 'long-answer', marks: 10 }
    ]
  }
};

export default function ExamDetails({ params }: { params: { examId: string } }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // In a real app, fetch exam details from API
    const fetchExam = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if exam exists in our mock data
        if (MOCK_EXAMS[params.examId]) {
          setExam(MOCK_EXAMS[params.examId]);
        } else {
          setError('Exam not found');
        }
      } catch (err) {
        setError('Failed to load exam details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExam();
  }, [params.examId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full card text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Exam not found'}</p>
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
          <h1 className="text-2xl font-bold text-primary-700">Exam Details</h1>
          <Link href="/dashboard/teacher" className="text-primary-600 hover:text-primary-800">
            Back to Dashboard
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Exam details */}
        <div className="card mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium mr-2">Subject:</span>
                <span>{exam.subject}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Grade:</span>
                <span>{exam.grade}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Questions:</span>
                <span>{exam.questionCount}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Time Limit:</span>
                <span>{exam.timeLimit} minutes</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Submissions:</span>
                <span>{exam.submissions.length}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
            <div className="space-y-4">
              {exam.questions.map((question, index) => (
                <div key={question.id} className="p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">
                      {index + 1}. {question.text}
                    </h4>
                    <div className="ml-4 flex-shrink-0 flex items-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800">
                        {question.type}
                      </span>
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        {question.marks} marks
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Student Submissions */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Student Submissions</h3>
          
          {exam.submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exam.submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.studentName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(submission.submittedOn).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {submission.score} / {submission.totalPossible}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          submission.percentage >= 80 ? 'bg-green-100 text-green-800' :
                          submission.percentage >= 60 ? 'bg-blue-100 text-blue-800' :
                          submission.percentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {submission.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/dashboard/teacher/submissions/${submission.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No submissions yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
