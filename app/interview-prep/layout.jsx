/**
 * Interview Prep Layout - Production Level Implementation
 * Provides consistent layout for interview preparation pages
 */

import React from 'react';

const InterviewPrepLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a 
              href="/"
              className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              StudyMate AI
            </a>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
              <a href="/interview-prep/setup" className="text-gray-600 hover:text-gray-900 transition-colors">
                Interview Prep
              </a>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 StudyMate AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default InterviewPrepLayout;
