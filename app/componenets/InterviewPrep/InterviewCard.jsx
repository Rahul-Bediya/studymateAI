/**
 * Interview Card Component - Production Level Implementation
 * Displays interview preparation feature card on main page
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, Brain, TrendingUp, ArrowRight, Clock, Target } from 'lucide-react';

const InterviewCard = () => {
  const features = [
    {
      icon: Video,
      title: 'Camera Recording',
      description: 'Practice with video recording for realistic interview experience'
    },
    {
      icon: Mic,
      title: 'Voice Interaction',
      description: 'Speak naturally with AI-powered voice recognition'
    },
    {
      icon: Brain,
      title: 'AI-Powered Questions',
      description: 'Personalized questions based on your resume and job role'
    },
    {
      icon: TrendingUp,
      title: 'Detailed Feedback',
      description: 'Comprehensive analysis with improvement recommendations'
    }
  ];

  const stats = [
    { label: 'Questions Generated', value: '10K+', icon: Target },
    { label: 'Success Rate', value: '85%', icon: TrendingUp },
    { label: 'Avg. Session Time', value: '25 min', icon: Clock }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">AI Interview Preparation</h3>
            <p className="text-indigo-100 text-lg">
              Practice interviews with AI and get personalized feedback
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Video className="w-8 h-8" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
            >
              <feature.icon className="w-6 h-6 mb-2 text-indigo-200" />
              <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
              <p className="text-sm text-indigo-100">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-1">
                <stat.icon className="w-4 h-4 mr-1 text-indigo-200" />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-xs text-indigo-100">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.href = '/interview-prep/setup'}
          className="w-full bg-white text-indigo-600 rounded-lg py-3 px-6 font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center group"
        >
          Start Interview Practice
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Trust Indicators */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-center space-x-6 text-xs text-indigo-100">
            <span>✓ Resume-based questions</span>
            <span>✓ Real-time feedback</span>
            <span>✓ Multiple difficulty levels</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewCard;
