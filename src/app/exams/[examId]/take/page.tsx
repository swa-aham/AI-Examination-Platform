'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock exam data with questions
const MOCK_EXAMS = {
  '1': {
    id: '1',
    title: 'Science - Forces and Motion',
    subject: 'Science',
    grade: '7',
    timeLimit: 45, // in minutes
    questions: [
      {
        id: '1-1',
        type: 'single-word',
        text: 'What force pulls objects toward the center of the Earth?',
        marks: 2,
      },
      {
        id: '1-2',
        type: 'short-answer',
        text: 'Explain the difference between mass and weight.',
        marks: 5,
      },
      {
        id: '1-3',
        type: 'long-answer',
        text: 'Describe Newton\'s Three Laws of Motion and give one example for each law.',
        marks: 10,
      },
      {
        id: '1-4',
        type: 'single-word',
        text: 'What is the SI unit of force?',
        marks: 2,
      },
      {
        id: '1-5',
        type: 'short-answer',
        text: 'Explain what friction is and how it affects motion.',
        marks: 5,
      },
      {
        id: '1-6',
        type: 'long-answer',
        text: 'Describe how a rocket uses Newton\'s Third Law to move. Include details about thrust and propulsion in your answer.',
        marks: 10,
      },
      {
        id: '1-7',
        type: 'short-answer',
        text: 'What happens to an object\'s acceleration when you increase the force applied to it?',
        marks: 5,
      },
      {
        id: '1-8',
        type: 'single-word',
        text: 'What is the name of the force that resists motion between two surfaces that are in contact?',
        marks: 2,
      },
      {
        id: '1-9',
        type: 'short-answer',
        text: 'Explain what happens to the speed of an object when there is no net force acting on it.',
        marks: 5,
      },
      {
        id: '1-10',
        type: 'long-answer',
        text: 'Describe how gravity affects the motion of a ball thrown into the air. Include details about velocity and acceleration in your answer.',
        marks: 10,
      }
    ]
  }
};

export default function ExamPage({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Refs for autosave
  const autoSaveTimerRef = useRef(null);
  const lastSavedRef = useRef({});
  
  useEffect(() => {
    // In a real app, fetch exam data from API
    const fetchExam = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if exam exists in our mock data
        if (MOCK_EXAMS[params.examId]) {
          const examData = MOCK_EXAMS[params.examId];
          setExam(examData);
          setRemainingTime(examData.timeLimit * 60); // Convert minutes to seconds
          
          // Initialize answers object
          const initialAnswers = {};
          examData.questions.forEach(q => {
            initialAnswers[q.id] = '';
          });
          
          // Check for saved answers in localStorage
          const savedAnswers = localStorage.getItem(`exam_${params.examId}_answers`);
          if (savedAnswers) {
            const parsed = JSON.parse(savedAnswers);
            setAnswers(parsed);
            lastSavedRef.current = parsed;
          } else {
            setAnswers(initialAnswers);
            lastSavedRef.current = initialAnswers;
          }
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
    
    // Cleanup function
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [params.examId]);
  
  // Set up timer
  useEffect(() => {
    if (!exam || loading) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit when time runs out
          return 0;
        }
        
        // Show warning when 5 minutes remaining
        if (prev === 300) {
          setShowTimeWarning(true);
          setTimeout(() => setShowTimeWarning(false), 10000); // Hide after 10 seconds
        }
        
        return prev - 1;
      });
    }, 1000);
    
    // Setup autosave every 30 seconds
    autoSaveTimerRef.current = setInterval(() => {
      // Only save if answers have changed
      if (JSON.stringify(answers) !== JSON.stringify(lastSavedRef.current)) {
        localStorage.setItem(`exam_${params.examId}_answers`, JSON.stringify(answers));
        lastSavedRef.current = { ...answers };
        console.log('Auto-saved answers');
      }
    }, 30000);
    
    return () => {
      clearInterval(timer);
      clearInterval(autoSaveTimerRef.current);
    };
  }, [exam, loading, params.examId, answers]);
  
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };
  
  const handleSubmit = async (isAutoSubmit = false) => {
    if (submitting) return;
    
    setSubmitting(true);
    
    // Save answers one last time
    localStorage.setItem(`exam_${params.examId}_answers`, JSON.stringify(answers));
    
    try {
      // In a real app, send answers to backend for grading
      console.log('Submitting answers:', answers);
      
      // Simulate API call for grading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved answers from localStorage
      localStorage.removeItem(`exam_${params.examId}_answers`);
      
      // Redirect to results page
      router.push(`/exams/${params.examId}/results`);
    } catch (err) {
      console.error('Error submitting exam:', err);
      setSubmitting(false);
    }
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
  
  const currentQuestion = exam.questions[currentQuestionIndex];
  
  // Format time remaining
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">{exam.title}</h1>
          <div className={`font-mono text-lg font-bold ${remainingTime < 300 ? 'text-red-600' : 'text-gray-700'}`}>
            Time Remaining: {formattedTime}
          </div>
        </div>
      </header>
      
      {/* Time warning notification */}
      {showTimeWarning && (
        <div className="fixed top-16 right-4 timer-warning p-4 z-20">
          <p className="font-bold">⚠️ 5 minutes remaining</p>
        </div>
      )}
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* Question navigation sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Questions</h2>
            <div className="question-navigation">
              {exam.questions.map((question, index) => {
                const isAttempted = answers[question.id] && answers[question.id].trim() !== '';
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <button
                    key={question.id}
                    onClick={() => navigateToQuestion(index)}
                    className={`question-nav-item ${isAttempted ? 'attempted' : 'pending'} ${isCurrent ? 'current' : ''}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => handleSubmit()}
                className="btn-primary w-full"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Question and answer area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-gray-900">
                Question {currentQuestionIndex + 1} of {exam.questions.length}
              </h2>
              <span className="text-primary-700 font-medium">
                {currentQuestion.marks} marks
              </span>
            </div>
            
            <div className="mb-6">
              <p className="text-lg text-gray-800">{currentQuestion.text}</p>
            </div>
            
            <div className="mb-6">
              {currentQuestion.type === 'single-word' && (
                <input
                  type="text"
                  className="input-field"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Enter your answer"
                />
              )}
              
              {currentQuestion.type === 'short-answer' && (
                <textarea
                  className="input-field h-24"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Write a short answer (1-2 sentences)"
                />
              )}
              
              {currentQuestion.type === 'long-answer' && (
                <textarea
                  className="input-field h-64"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Write a detailed answer (5-6 sentences)"
                />
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                onClick={() => navigateToQuestion(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === exam.questions.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
