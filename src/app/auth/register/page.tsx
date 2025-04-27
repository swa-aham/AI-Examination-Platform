'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '7',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // For demo purposes, we'll just simulate registration
      // In a real app, you would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful registration
      // Redirect to login page
      router.push(`/auth/login?role=${role}`);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-6">
      <div className="max-w-md w-full space-y-8 card">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-700">
            {role === 'student' ? 'Student Registration' : 'Teacher Registration'}
          </h2>
          <p className="mt-2 text-gray-600">
            Create a new account to get started
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="input-field"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          {role === 'student' && (
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <select
                id="grade"
                name="grade"
                required
                className="input-field"
                value={formData.grade}
                onChange={handleChange}
              >
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
              </select>
            </div>
          )}
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="input-field"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full flex justify-center"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          
          <div className="text-center text-sm">
            <p>
              Already have an account?{' '}
              <Link href={`/auth/login?role=${role}`} className="text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
