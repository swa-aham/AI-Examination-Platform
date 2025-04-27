'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock monthly report data
const MOCK_REPORTS = {
  '1': {
    reportId: '1',
    studentName: 'John Doe',
    month: 4, // April
    year: 2025,
    overallPercentage: 76,
    monthlyAssessment: 'John has shown consistent performance this month with notable improvement in Science. His understanding of core concepts is strong, but there's room for improvement in detailed explanations and application of concepts to complex problems.',
    progressEvaluation: 'Overall, John has improved by 5% compared to last month. His grasp of fundamental concepts is solid, but he needs to focus on more detailed explanations and complex problem-solving.',
    improvementPercentage: 5,
    recommendedActions: [
      'Spend more time on practice questions related to Newton\'s Third Law and friction',
      'Work on providing more detailed explanations with specific examples',
      'Review and practice questions on ancient Mesopotamian civilization',
      'Continue the strong performance in English comprehension'
    ],
    subjectProgress: [
      {
        subject: 'Science',
        examCount: 2,
        averageScore: 82,
        strengths: ['Understanding of Newton\'s First and Second Laws', 'Explanation of basic force concepts'],
        weaknesses: ['Detailed examples of Newton\'s Third Law', 'Application of concepts to real-world scenarios'],
        analysis: 'John demonstrates a strong grasp of fundamental physics concepts, particularly Newton\'s First and Second Laws. His explanations of basic force concepts are clear and accurate. To improve, he should focus on providing more detailed examples for Newton\'s Third Law and better applying these concepts to real-world scenarios.'
      },
      {
        subject: 'Social Science',
        examCount: 1,
        averageScore: 68,
        strengths: ['Knowledge of major ancient civilizations', 'Understanding of basic historical timelines'],
        weaknesses: ['Details about Mesopotamian civilization', 'Analysis of historical significance'],
        analysis: 'John has a good overview of major ancient civilizations and their timelines. However, his knowledge of specific details about Mesopotamian civilization needs improvement. He should also work on analyzing the historical significance of key events and developments.'
      },
      {
        subject: 'English',
        examCount: 1,
        averageScore: 85,
        strengths: ['Reading comprehension', 'Vocabulary usage'],
        weaknesses: ['Complex grammar structures', 'Essay organization'],
        analysis: 'John excels in reading comprehension and has a strong vocabulary. His grammar is generally good, but he sometimes struggles with more complex structures. His essays would benefit from better organization and more cohesive paragraph transitions.'
      }
    ]
  }
};

export default function MonthlyReport({ params }: { params: { reportId: string } }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    // In a real app, fetch report from API
    const fetchReport = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if report exists in our mock data
        if (MOCK_REPORTS[params.reportId]) {
          setReport(MOCK_REPORTS[params.reportId]);
        } else {
          setError('Report not found');
        }
      } catch (err) {
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [params.reportId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full card text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Report not found'}</p>
          <Link href="/dashboard/student" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Format month name
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthNames[report.month - 1];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Monthly Progress Report
            </h1>
            <div className="text-gray-600 mb-4">
              <span>{monthName} {report.year}</span>
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
                      report.overallPercentage >= 80 ? 'text-green-500' :
                      report.overallPercentage >= 60 ? 'text-primary-500' :
                      report.overallPercentage >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}
                    strokeWidth="8"
                    strokeDasharray={`${report.overallPercentage * 2.83} 283`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                  {report.overallPercentage}%
                </div>
              </div>
            </div>
            
            {report.improvementPercentage !== undefined && (
              <div className="mt-2 text-center">
                <p className={`font-medium ${
                  report.improvementPercentage > 0 ? 'text-green-600' : 
                  report.improvementPercentage < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {report.improvementPercentage > 0 ? '+' : ''}
                  {report.improvementPercentage}% from last month
                </p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Assessment</h2>
            <p className="text-gray-700 mb-6">{report.monthlyAssessment}</p>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Progress</h2>
            <p className="text-gray-700 mb-6">{report.progressEvaluation}</p>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Actions</h2>
            <ul className="space-y-2 mb-6">
              {report.recommendedActions.map((action, index) => (
                <li key={index} className="flex">
                  <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Subject Progress */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Subject Progress</h2>
          
          <div className="space-y-10">
            {report.subjectProgress.map((subject) => (
              <div key={subject.subject} className="pb-8 border-b border-gray-200 last:border-b-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">
                    {subject.subject}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-4">
                      {subject.examCount} {subject.examCount === 1 ? 'exam' : 'exams'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subject.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                      subject.averageScore >= 60 ? 'bg-primary-100 text-primary-800' :
                      subject.averageScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {subject.averageScore}%
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{subject.analysis}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {subject.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {subject.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-700">• {weakness}</li>
                      ))}
                    </ul>
                  </div>
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
