/**
 * Interview Session Page - Production Level Implementation
 * Handles live interview with camera, voice, and AI interaction
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  User, 
  Clock, 
  Send, 
  SkipForward, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Volume2,
  MessageCircle,
  Square,
  Play
} from 'lucide-react';
import VideoCapture from '../../componenets/InterviewPrep/VideoCapture';
import VoiceRecorder from '../../componenets/InterviewPrep/VoiceRecorder';
import InterviewAI from '../../../lib/interviewai';

const InterviewSession = () => {
  const router = useRouter();
  const [interviewSession, setInterviewSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [error, setError] = useState(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [showSubmitInterview, setShowSubmitInterview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const interviewAIRef = useRef(null);
  const timerRef = useRef(null);
  const sessionTimerRef = useRef(null);

  // Session timer
  const startSessionTimer = () => {
    sessionTimerRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  // Question timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanup = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
  };

  // Question timer effect
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    timerRef.current = setTimeout(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining]);

  // Calculate current question and progress
  const currentQuestion = interviewSession ? interviewSession.questions[currentQuestionIndex] : null;
  const progress = interviewSession ? ((currentQuestionIndex + 1) / interviewSession.questions.length) * 100 : 0;

  // Load interview session on mount
  useEffect(() => {
    const sessionData = sessionStorage.getItem('interviewSession');
    console.log('Raw session data from storage:', sessionData);
    
    // Create fallback session function
    const createFallbackSession = () => {
      const fallbackSession = {
        config: {
          languages: ['JavaScript', 'React'],
          interviewType: 'technical',
          difficulty: 'moderate',
          numberOfQuestions: 3,
          jobRole: 'Software Developer'
        },
        questions: [
          {
            id: 1,
            type: "technical",
            category: "JavaScript",
            question: "Explain the concept of variables and data types in programming.",
            expectedPoints: ["Clear definition", "Correct syntax", "Practical usage"],
            difficulty: "moderate",
            timeLimit: 300
          },
          {
            id: 2,
            type: "technical",
            category: "React",
            question: "How would you implement a simple React component with state management?",
            expectedPoints: ["Component structure", "State management", "React best practices"],
            difficulty: "moderate",
            timeLimit: 300
          },
          {
            id: 3,
            type: "behavioral",
            category: "General",
            question: "Tell me about a time when you faced a technical challenge and how you overcame it.",
            expectedPoints: ["Problem description", "Solution approach", "Learning outcome"],
            difficulty: "moderate",
            timeLimit: 300
          }
        ],
        startTime: new Date().toISOString(),
        sessionId: Date.now().toString()
      };
      
      setInterviewSession(fallbackSession);
      setIsLoading(false);
      
      // Initialize interview AI
      interviewAIRef.current = new InterviewAI();
      
      // Start session timer
      startSessionTimer();
      
      // Set time for first question
      setTimeRemaining(300);
      
      console.log('Created fallback session');
      return fallbackSession;
    };
    
    // Check for invalid session data
    if (!sessionData || sessionData === 'null' || sessionData === 'undefined' || sessionData.trim() === '{}' || sessionData.trim() === '') {
      console.log('No or empty session data found, creating fallback session');
      createFallbackSession();
      return;
    }

    // Try to parse session data
    let session;
    try {
      session = JSON.parse(sessionData);
      console.log('Parsed session data:', session);
    } catch (error) {
      console.error('Error parsing session data:', error);
      console.log('Session data was:', sessionData);
      console.log('Creating fallback session due to parsing error');
      createFallbackSession();
      return;
    }
    
    // Validate session structure
    if (!session || !session.questions || !Array.isArray(session.questions) || session.questions.length === 0) {
      console.error('Invalid session structure, creating fallback session');
      createFallbackSession();
      return;
    }
    
    // Session is valid, use it
    setInterviewSession(session);
    setIsLoading(false);
    
    // Initialize interview AI
    interviewAIRef.current = new InterviewAI();
    
    // Start session timer
    startSessionTimer();
    
    // Set time for first question
    if (session.questions && session.questions.length > 0) {
      setTimeRemaining(session.questions[0].timeLimit || 300);
    }

    return () => {
      cleanup();
    };
  }, [router]);

  // Text-to-speech for AI questions
  const speakQuestion = (text) => {
    // Don't speak if user is recording, has typed anything, or is already speaking
    if ('speechSynthesis' in window && !isRecording && !currentAnswer && !isAISpeaking) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setIsAISpeaking(true);
      utterance.onend = () => setIsAISpeaking(false);
      utterance.onerror = () => setIsAISpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop all speech immediately
  const stopAllSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAISpeaking(false);
  };

  // Handle text input changes - stop speech when user starts typing
  const handleTextChange = (e) => {
    const value = e.target.value;
    setCurrentAnswer(value);
    
    // Stop speech immediately when user starts typing
    if (value && value.length > 0) {
      stopAllSpeech();
    }
  };

  // Manual replay question
  const replayQuestion = () => {
    if (currentQuestion && !isRecording && !currentAnswer) {
      speakQuestion(currentQuestion.question);
    }
  };

  // Speak question when it changes
  useEffect(() => {
    if (currentQuestion && !isAISpeaking && interviewSession && !isRecording && !currentAnswer) {
      // Delay speaking to allow UI to update
      setTimeout(() => {
        speakQuestion(currentQuestion.question);
      }, 1000);
    }
  }, [currentQuestionIndex]);

  const handleRecordingStart = () => {
    setIsRecording(true);
    setError(null);
    
    // Stop any ongoing AI speech immediately when user starts recording
    stopAllSpeech();
  };

  const handleRecordingStop = (transcript) => {
    setIsRecording(false);
    setCurrentAnswer(transcript);
  };

  const handleTranscript = (transcript) => {
    console.log('Voice transcript received:', transcript);
    setCurrentAnswer(transcript);
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setError('Please provide an answer before submitting');
      return;
    }

    // Stop all speech when submitting answer
    stopAllSpeech();
    setIsAIResponding(true);
    setError(null);

    try {
      const currentQuestion = interviewSession.questions[currentQuestionIndex];
      
      // Evaluate the answer
      const evaluation = await interviewAIRef.current.evaluateAnswer(
        currentQuestion,
        currentAnswer,
        currentQuestion
      );

      // Save answer and evaluation
      const newAnswers = [...answers, {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: currentAnswer,
        timestamp: new Date().toISOString()
      }];

      const newEvaluations = [...evaluations, evaluation];
      
      setAnswers(newAnswers);
      setEvaluations(newEvaluations);
      setCurrentAnswer('');

      // Check if this is the last question
      if (currentQuestionIndex >= interviewSession.questions.length - 1) {
        setShowSubmitInterview(true);
      } else {
        // Move to next question
        nextQuestion();
      }
    } catch (err) {
      setError('Failed to evaluate answer. Please try again.');
    } finally {
      setIsAIResponding(false);
    }
  };

  const skipQuestion = () => {
    // Stop all speech when skipping question
    stopAllSpeech();
    
    const skippedAnswer = {
      questionId: interviewSession.questions[currentQuestionIndex].id,
      question: interviewSession.questions[currentQuestionIndex].question,
      answer: '[SKIPPED]',
      timestamp: new Date().toISOString()
    };

    const newAnswers = [...answers, skippedAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < interviewSession.questions.length - 1) {
      nextQuestion();
    } else {
      completeSession(newAnswers, evaluations);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setTimeRemaining(interviewSession.questions[nextIndex].timeLimit || 300);
    setCurrentAnswer('');
  };

  const completeSession = async (finalAnswers, finalEvaluations) => {
    setIsSessionComplete(true);
    setIsGeneratingFeedback(true);

    try {
      const feedback = await interviewAIRef.current.generateInterviewFeedback({
        questions: interviewSession.questions,
        answers: finalAnswers,
        evaluations: finalEvaluations,
        totalTime: sessionTime,
        jobRole: interviewSession.config.jobRole
      });

      // Store complete session data
      const completeSessionData = {
        ...interviewSession,
        answers: finalAnswers,
        evaluations: finalEvaluations,
        feedback: feedback,
        sessionTime: sessionTime,
        completedAt: new Date().toISOString()
      };

      sessionStorage.setItem('completedInterview', JSON.stringify(completeSessionData));
      
      // Redirect to feedback page
      setTimeout(() => {
        router.push('/interview-prep/feedback');
      }, 2000);
    } catch (err) {
      setError('Failed to generate feedback. Redirecting to feedback page...');
      setTimeout(() => {
        router.push('/interview-prep/feedback');
      }, 2000);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const endSessionEarly = () => {
    if (confirm('Are you sure you want to end the interview early?')) {
      completeSession(answers, evaluations);
    }
  };

  if (!interviewSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">AI Interview Session</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(sessionTime)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {interviewSession.questions.length}
              </div>
              <button
                onClick={endSessionEarly}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Question {currentQuestionIndex + 1} of {interviewSession.questions.length}
            </h3>
            <div className="flex items-center space-x-2">
              {isAISpeaking && (
                <span className="text-sm text-blue-600 flex items-center">
                  <Volume2 className="w-4 h-4 mr-1 animate-pulse" />
                  Speaking...
                </span>
              )}
              <button
                onClick={replayQuestion}
                disabled={isRecording || isAISpeaking}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Replay Question
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Video & Question */}
          <div className="space-y-6">
            {/* Video Capture */}
            <VideoCapture
              isRecording={isRecording}
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
              className="rounded-xl shadow-lg"
            />

            {/* Question Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">AI Interviewer</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      currentQuestion.type === 'technical' ? 'bg-blue-100 text-blue-700' :
                      currentQuestion.type === 'behavioral' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {currentQuestion.type}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      currentQuestion.difficulty === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-800 text-lg">{currentQuestion.question}</p>
                </div>
              </div>

              {/* Timer */}
              <div className={`mt-4 p-3 rounded-lg ${
                timeRemaining <= 30 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Time Remaining</span>
                  <span className={`text-lg font-mono font-bold ${
                    timeRemaining <= 30 ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Voice Recorder & Controls */}
          <div className="space-y-6">
            {/* Voice Recorder */}
            <VoiceRecorder
              onTranscript={handleTranscript}
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
              isAIResponding={isAIResponding}
              className="rounded-xl shadow-lg"
            />

            {/* Text Answer Input */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type your answer (or use voice recorder above)
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={handleTextChange}
                  placeholder="Type your answer here..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  rows={4}
                  disabled={isAIResponding}
                />
                <div className="mt-2 text-sm text-gray-500">
                  {currentAnswer.length} characters
                </div>
              </div>
            </div>

            {/* Answer Display */}
            {currentAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">You</span>
                      <span className="text-sm text-gray-500">
                        {currentAnswer.length} characters
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">{currentAnswer}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={skipQuestion}
                disabled={isAIResponding}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <SkipForward className="w-5 h-5 mr-2" />
                Skip Question
              </motion.button>

              {showSubmitInterview ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => completeSession(answers, evaluations)}
                  disabled={isGeneratingFeedback}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGeneratingFeedback ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Feedback...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Interview
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim() || isAIResponding}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isAIResponding ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Answer
                    </>
                  )}
                </motion.button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Session Complete Modal */}
      <AnimatePresence>
        {isSessionComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Interview Complete!
                </h2>
                <p className="text-gray-600 mb-6">
                  {isGeneratingFeedback ? 'Generating your personalized feedback...' : 'Redirecting to feedback...'}
                </p>
                {isGeneratingFeedback && (
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewSession;
