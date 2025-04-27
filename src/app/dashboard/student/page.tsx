'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock exam data until we connect to backend
const MOCK_EXAMS = [
  {
    id: '1',
    title: 'Science - Forces and Motion',
    subject: 'Science',
    grade: '7',
    questionCount: 15,
    timeLimit: 45, // in minutes
    availableUntil: '2025-05-15',
  },
  {
    id: '2',
    title: 'Social Science - Ancient Civilizations',
    subject: 'Social Science',
    grade: '7',
    questionCount: 20,
    timeLimit: 60,
    availableUntil: '2025-05-20',
  },
  {
    id: '3',
    title: 'English - Comprehension and Grammar',
    subject: 'English',
    grade: '7',
    questionCount: 25,
    timeLimit: 90,
    availableUntil: '2025-05-25',
  },
  {
    id: '4',
    title: 'General Knowledge - Current Affairs',
    subject: 'General Knowledge',
    grade: '7',
    questionCount: 30,
    timeLimit: 30,
    availableUntil: '2025-05-10',
  },
];

export default function StudentDashboard() {
  // For a real app, we would fetch user data from API/auth
  const [user, setUser] = useState({
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    grade: '7',
  });
  
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch exams
    const fetchExams = async () => {
      try {
        // In a real app, we would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExams(MOCK_EXAMS);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExams();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Student Dashboard</h1>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">Hello, {user.name}</span>
            <Link href="/" className="text-primary-600 hover:text-primary-800">
              Logout
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Available Exams</h2>
            <div className="text-sm text-gray-600">
              Grade: {user.grade}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <div key={exam.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 
                        ${exam.subject === 'Science' ? 'bg-green-100 text-green-800' : 
                          exam.subject === 'Social Science' ? 'bg-blue-100 text-blue-800' :
                          exam.subject === 'English' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'}`}>
                        {exam.subject}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Grade {exam.grade}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{exam.questionCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Limit:</span>
                      <span className="font-medium">{exam.timeLimit} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available Until:</span>
                      <span className="font-medium">{new Date(exam.availableUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/exams/${exam.id}/instructions`}
                    className="btn-primary block text-center"
                  >
                    Start Exam
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600">No exams available for your grade at the moment.</p>
            </div>
          )}
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Results</h2>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">You haven't taken any exams yet.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
