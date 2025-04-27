'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // For demo purposes, we'll just simulate a login
      // In a real app, you would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate successful login
      // Redirect based on role
      if (role === 'student') {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard/teacher');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-6">
      <div className="max-w-md w-full space-y-8 card">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-700">
            {role === 'student' ? 'Student Login' : 'Teacher Login'}
          </h2>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input-field"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full flex justify-center"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          
          <div className="text-center text-sm">
            <p>
              Don't have an account?{' '}
              <Link href={`/auth/register?role=${role}`} className="text-primary-600 hover:text-primary-500">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
