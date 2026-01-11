/**
 * Interview Feedback Page - Production Level Implementation
 * Displays comprehensive interview performance analysis and recommendations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Download, Share2, RefreshCw } from 'lucide-react';
import FeedbackReport from '../../componenets/InterviewPrep/FeedbackReport';

const InterviewFeedback = () => {
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const completedInterview = sessionStorage.getItem('completedInterview');
    
    if (!completedInterview) {
      router.push('/interview-prep/setup');
      return;
    }

    try {
      const data = JSON.parse(completedInterview);
      setInterviewData(data);
    } catch (err) {
      setError('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleRetakeInterview = () => {
    sessionStorage.removeItem('completedInterview');
    sessionStorage.removeItem('interviewSession');
    router.push('/interview-prep/setup');
  };

  const handleShareResults = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Interview Performance Results',
          text: `I scored ${interviewData.feedback.overallScore}% in my ${interviewData.config.jobRole} interview practice!`,
          url: window.location.href
        });
      } else {
        // Fallback: Copy to clipboard
        const text = `I scored ${interviewData.feedback.overallScore}% in my ${interviewData.config.jobRole} interview practice!`;
        await navigator.clipboard.writeText(text);
        alert('Results copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing results:', err);
    }
  };

  const handleExportResults = () => {
    const dataStr = JSON.stringify(interviewData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-feedback-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/interview-prep/setup')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Start New Interview
          </button>
        </div>
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
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Interview Feedback
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportResults}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Export Results"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={handleShareResults}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share Results"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={handleRetakeInterview}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FeedbackReport
            interviewData={interviewData}
            onRetakeInterview={handleRetakeInterview}
            onShareResults={handleShareResults}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Practice Again</h3>
            <p className="text-sm text-gray-600 mb-4">
              Improve your skills with another practice session
            </p>
            <button
              onClick={handleRetakeInterview}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start New Interview
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Explore More</h3>
            <p className="text-sm text-gray-600 mb-4">
              Check out other learning resources and tools
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Back to Home
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Save Progress</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download your detailed performance report
            </p>
            <button
              onClick={handleExportResults}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Download Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
