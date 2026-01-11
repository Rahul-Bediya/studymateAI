/**
 * Feedback Report Component - Production Level Implementation
 * Displays comprehensive interview performance analysis
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target, 
  BookOpen, 
  Download,
  Share2,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Star,
  RefreshCw
} from 'lucide-react';

const FeedbackReport = ({ interviewData, onRetakeInterview, onShareResults }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState(null);

  // Calculate derived metrics
  const metrics = useMemo(() => {
    if (!interviewData) return null;

    const { feedback, evaluations, answers, sessionTime } = interviewData;
    
    const averageScore = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) / evaluations.length;
    const answeredQuestions = answers.filter(a => a.answer !== '[SKIPPED]').length;
    const skippedQuestions = answers.length - answeredQuestions;
    
    return {
      overallScore: feedback.overallScore,
      averageScore: Math.round(averageScore),
      categoryScores: feedback.categoryScores,
      answeredQuestions,
      skippedQuestions,
      totalQuestions: answers.length,
      sessionTime,
      readinessLevel: feedback.readinessLevel
    };
  }, [interviewData]);

  const getReadinessColor = (level) => {
    switch (level) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-100';
      case 'significant_practice_needed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(interviewData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-feedback-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Interview Performance Report</h2>
            <p className="text-indigo-100">
              {interviewData.config.jobRole} • {formatTime(metrics.sessionTime)} • {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{metrics.overallScore}%</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReadinessColor(metrics.readinessLevel)}`}>
              {metrics.readinessLevel.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportResults}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShareResults}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Results
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetakeInterview}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake Interview
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'detailed', 'recommendations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Score Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                  {metrics.overallScore}%
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Overall Score</h3>
              <p className="text-sm text-gray-500 mt-1">Complete performance</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {metrics.answeredQuestions}/{metrics.totalQuestions}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Questions Answered</h3>
              <p className="text-sm text-gray-500 mt-1">
                {metrics.skippedQuestions > 0 ? `${metrics.skippedQuestions} skipped` : 'All answered'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {formatTime(metrics.sessionTime)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Session Duration</h3>
              <p className="text-sm text-gray-500 mt-1">Total interview time</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(metrics.averageScore)}%
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Average Score</h3>
              <p className="text-sm text-gray-500 mt-1">Per question average</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'detailed' && (
          <motion.div
            key="detailed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
              <div className="space-y-4">
                {Object.entries(metrics.categoryScores).map(([category, score]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        category === 'technical' ? 'bg-blue-100' :
                        category === 'behavioral' ? 'bg-green-100' :
                        category === 'communication' ? 'bg-purple-100' :
                        'bg-yellow-100'
                      }`}>
                        <PieChart className={`w-5 h-5 ${
                          category === 'technical' ? 'text-blue-600' :
                          category === 'behavioral' ? 'text-green-600' :
                          category === 'communication' ? 'text-purple-600' :
                          'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{category}</p>
                        <p className="text-sm text-gray-500">
                          {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            score >= 80 ? 'bg-green-500' :
                            score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                      <span className={`font-bold ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question-wise Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question-wise Analysis</h3>
              <div className="space-y-4">
                {interviewData.answers.map((answer, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">Q{index + 1}</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            answer.answer === '[SKIPPED]' 
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {answer.answer === '[SKIPPED]' ? 'Skipped' : 'Answered'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{answer.question}</p>
                        {answer.answer !== '[SKIPPED]' && interviewData.evaluations[index] && (
                          <div className="flex items-center space-x-4 text-sm">
                            <span className={`font-medium ${getScoreColor(interviewData.evaluations[index].score)}`}>
                              Score: {interviewData.evaluations[index].score}%
                            </span>
                            <span className="text-gray-500">
                              Technical: {interviewData.evaluations[index].technicalAccuracy}%
                            </span>
                            <span className="text-gray-500">
                              Communication: {interviewData.evaluations[index].communicationClarity}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Strengths */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Your Strengths</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interviewData.feedback.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-green-800">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interviewData.feedback.areasForImprovement.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <span className="text-yellow-800">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h3>
              </div>
              <div className="space-y-3">
                {interviewData.feedback.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-blue-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Next Steps</h3>
              </div>
              <div className="space-y-3">
                {interviewData.feedback.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-purple-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackReport;
