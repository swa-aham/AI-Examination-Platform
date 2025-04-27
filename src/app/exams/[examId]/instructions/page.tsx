'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock exam data
const MOCK_EXAMS = {
  '1': {
    id: '1',
    title: 'Science - Forces and Motion',
    subject: 'Science',
    grade: '7',
    questionCount: 15,
    timeLimit: 45, // in minutes
    instructions: [
      'Read all questions carefully before answering.',
      'You have 45 minutes to complete this exam.',
      'All questions must be attempted.',
      'Short answer questions should be 1-2 sentences.',
      'Long answer questions should be 5-6 sentences with proper explanation.',
      'Your progress will be automatically saved.',
      'Once submitted, you cannot return to the exam.'
    ]
  },
  '2': {
    id: '2',
    title: 'Social Science - Ancient Civilizations',
    subject: 'Social Science',
    grade: '7',
    questionCount: 20,
    timeLimit: 60,
    instructions: [
      'Read all questions carefully before answering.',
      'You have 60 minutes to complete this exam.',
      'All questions must be attempted.',
      'Your progress will be automatically saved.',
      'Once submitted, you cannot return to the exam.'
    ]
  }
};

export default function ExamInstructions({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // In a real app, fetch exam data from API
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
        setError('Failed to load exam');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExam();
  }, [params.examId]);
  
  const handleStartExam = () => {
    // In a real app, we would initialize the exam session in the backend
    router.push(`/exams/${params.examId}/take`);
  };
  
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
          <Link href="/dashboard/student" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
            <div className="text-gray-600">
              <span className="mr-4">Grade {exam.grade}</span>
              <span className="mr-4">{exam.subject}</span>
              <span>{exam.questionCount} Questions</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Exam Instructions</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="font-medium text-blue-700">Time Limit: {exam.timeLimit} minutes</p>
            </div>
            <ul className="space-y-2">
              {exam.instructions.map((instruction, index) => (
                <li key={index} className="flex">
                  <svg className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
            <Link 
              href="/dashboard/student" 
              className="text-primary-600 hover:text-primary-800"
            >
              Return to Dashboard
            </Link>
            <button 
              onClick={handleStartExam}
              className="btn-primary"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
