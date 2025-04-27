'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApiTestPage() {
  const [apiEndpoint, setApiEndpoint] = useState('/api/exams/grade');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    examId: '1',
    studentId: '123',
    answers: {
      '1-1': 'gravity',
      '1-2': 'Mass is the amount of matter in an object and doesn\'t change. Weight is the force of gravity on an object and can change depending on location.',
      '1-3': 'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. For example, a book on a table stays there until someone moves it.\n\nNewton\'s Second Law states that force equals mass times acceleration (F = ma). For example, pushing a shopping cart with more force makes it accelerate faster.\n\nNewton\'s Third Law states that for every action, there is an equal and opposite reaction. For example, when a bird pushes air down with its wings, the air pushes the bird up.'
    },
    startTime: new Date().toISOString()
  }, null, 2));
  
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const apiExamples = {
    '/api/exams/grade': JSON.stringify({
      examId: '1',
      studentId: '123',
      answers: {
        '1-1': 'gravity',
        '1-2': 'Mass is the amount of matter in an object and doesn\'t change. Weight is the force of gravity on an object and can change depending on location.',
        '1-3': 'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force. For example, a book on a table stays there until someone moves it.\n\nNewton\'s Second Law states that force equals mass times acceleration (F = ma). For example, pushing a shopping cart with more force makes it accelerate faster.\n\nNewton\'s Third Law states that for every action, there is an equal and opposite reaction. For example, when a bird pushes air down with its wings, the air pushes the bird up.'
      },
      startTime: new Date().toISOString()
    }, null, 2),
    '/api/reports/monthly': JSON.stringify({
      studentId: '123',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    }, null, 2)
  };
  
  const handleApiEndpointChange = (e) => {
    const endpoint = e.target.value;
    setApiEndpoint(endpoint);
    if (apiExamples[endpoint]) {
      setRequestBody(apiExamples[endpoint]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">API Test Page</h1>
          <p className="mt-2 text-gray-600">
            Test the exam platform APIs directly from this page
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Request</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-700 mb-1">
                  API Endpoint
                </label>
                <select
                  id="apiEndpoint"
                  value={apiEndpoint}
                  onChange={handleApiEndpointChange}
                  className="input-field"
                >
                  <option value="/api/exams/grade">Grade Exam</option>
                  <option value="/api/reports/monthly">Generate Monthly Report</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="requestBody" className="block text-sm font-medium text-gray-700 mb-1">
                  Request Body (JSON)
                </label>
                <textarea
                  id="requestBody"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="input-field font-mono h-96 text-sm"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </form>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Response</h2>
            
            {loading && (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {response && (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm h-[500px]">
                {response}
              </pre>
            )}
            
            {!loading && !error && !response && (
              <div className="bg-blue-50 p-4 rounded-md text-gray-700">
                <p>Send a request to view the response here.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-primary-600 hover:text-primary-800">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
