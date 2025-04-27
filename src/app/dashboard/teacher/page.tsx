'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data for teacher dashboard
const MOCK_EXAMS = [
  {
    id: '1',
    title: 'Science - Forces and Motion',
    subject: 'Science',
    grade: '7',
    questionCount: 15,
    createdAt: '2025-04-15',
    submissions: 12,
  },
  {
    id: '2',
    title: 'Social Science - Ancient Civilizations',
    subject: 'Social Science',
    grade: '7',
    questionCount: 20,
    createdAt: '2025-04-20',
    submissions: 8,
  },
  {
    id: '3',
    title: 'English - Comprehension and Grammar',
    subject: 'English',
    grade: '7',
    questionCount: 25,
    createdAt: '2025-04-22',
    submissions: 15,
  },
];

const MOCK_STUDENTS = [
  {
    id: '101',
    name: 'Alice Johnson',
    grade: '7',
    examsCompleted: 2,
    averageScore: 85,
  },
  {
    id: '102',
    name: 'Bob Smith',
    grade: '7',
    examsCompleted: 3,
    averageScore: 78,
  },
  {
    id: '103',
    name: 'Charlie Brown',
    grade: '7',
    examsCompleted: 1,
    averageScore: 92,
  },
  {
    id: '104',
    name: 'Diana Miller',
    grade: '7',
    examsCompleted: 3,
    averageScore: 88,
  },
  {
    id: '105',
    name: 'Edward Wilson',
    grade: '7',
    examsCompleted: 2,
    averageScore: 76,
  },
];

export default function TeacherDashboard() {
  // For a real app, we would fetch user data from API/auth
  const [user, setUser] = useState({
    id: '456',
    name: 'Ms. Jane Smith',
    email: 'jane@example.com',
  });
  
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exams'); // 'exams' or 'students'
  
  useEffect(() => {
    // Simulate API calls to fetch data
    const fetchData = async () => {
      try {
        // In a real app, we would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExams(MOCK_EXAMS);
        setStudents(MOCK_STUDENTS);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with user info */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">Teacher Dashboard</h1>
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
        {/* Action buttons */}
        <div className="flex justify-end mb-6">
          <Link 
            href="/dashboard/teacher/create-exam"
            className="btn-primary"
          >
            Create New Exam
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex">
            <button
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'exams'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('exams')}
            >
              Exams
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('students')}
            >
              Students
            </button>
          </nav>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : activeTab === 'exams' ? (
          /* Exams Tab */
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Exams</h2>
            {exams.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submissions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {exams.map((exam) => (
                      <tr key={exam.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{exam.subject}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{exam.grade}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{exam.questionCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{exam.submissions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{new Date(exam.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/dashboard/teacher/exam/${exam.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                            View
                          </Link>
                          <Link href={`/dashboard/teacher/exam/${exam.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Edit
                          </Link>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">You haven't created any exams yet.</p>
              </div>
            )}
          </div>
        ) : (
          /* Students Tab */
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Students</h2>
            {students.length > 0 ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exams Completed
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.grade}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.examsCompleted}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{student.averageScore}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/dashboard/teacher/student/${student.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                            View Progress
                          </Link>
                          <Link href={`/dashboard/teacher/student/${student.id}/report`} className="text-indigo-600 hover:text-indigo-900">
                            Generate Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">No students found.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
