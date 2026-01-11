/**
 * Interview Setup Page - Production Level Implementation
 * Handles resume upload and interview configuration
 */

'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Settings, ArrowRight, Check, AlertCircle, Loader2, Camera, Mic, BookOpen } from 'lucide-react';
import ResumeParser from '../../../lib/resumeParser';
import InterviewAI from '../../../lib/interviewai';

const InterviewSetup = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedResume, setParsedResume] = useState(null);
  const [interviewConfig, setInterviewConfig] = useState({
    languages: [],
    interviewType: 'technical',
    difficulty: 'moderate',
    numberOfQuestions: 5,
    jobRole: '',
    resumeData: null
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);

  // Available options
  const languageOptions = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 
    'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'TypeScript',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django',
    'Spring', 'Laravel', 'MongoDB', 'PostgreSQL', 'MySQL'
  ];

  const interviewTypes = [
    { value: 'technical', label: 'Technical', icon: '💻', description: 'Coding, algorithms, system design' },
    { value: 'hr', label: 'HR & Behavioral', icon: '👥', description: 'Behavioral questions, cultural fit' },
    { value: 'mixed', label: 'Mixed', icon: '🔄', description: 'Combination of technical and HR' }
  ];

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', description: 'Fundamental concepts', color: 'green' },
    { value: 'moderate', label: 'Moderate', description: 'Intermediate problems', color: 'yellow' },
    { value: 'hard', label: 'Hard', description: 'Advanced concepts', color: 'red' }
  ];

  const questionCounts = [3, 5, 8, 10, 15];

  const jobRoles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 
    'Full Stack Developer', 'DevOps Engineer', 'Data Scientist',
    'Machine Learning Engineer', 'Product Manager', 'UI/UX Designer',
    'Mobile Developer', 'QA Engineer', 'Technical Lead'
  ];

  // Handle resume upload
  const handleResumeUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setErrors({});

    try {
      const parser = new ResumeParser();
      const result = await parser.parseResume(file);

      if (result.success) {
        setParsedResume(result.data);
        setInterviewConfig(prev => ({
          ...prev,
          resumeData: result.data,
          languages: result.data.skills.programing?.slice(0, 5) || result.data.skills.programming?.slice(0, 5) || ['JavaScript', 'Python', 'React'] // Auto-select top 5 skills
        }));
        setCurrentStep(2);
      } else {
        setErrors({ upload: result.error });
      }
    } catch (error) {
      setErrors({ upload: 'Failed to parse resume. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  }, []);

  // Handle language selection
  const toggleLanguage = (language) => {
    setInterviewConfig(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(lang => lang !== language)
        : [...prev.languages, language]
    }));
  };

  // Validate configuration
  const validateConfig = () => {
    const newErrors = {};

    if (!parsedResume) {
      newErrors.resume = 'Please upload your resume';
    }

    if (interviewConfig.languages.length === 0) {
      newErrors.languages = 'Please select at least one language/skill';
    }

    if (!interviewConfig.jobRole) {
      newErrors.jobRole = 'Please select your target job role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generate interview questions and start session
  const startInterview = async () => {
    if (!validateConfig()) return;

    setIsGenerating(true);
    try {
      console.log('Starting interview with config:', interviewConfig);
      const interviewAI = new InterviewAI();
      const questions = await interviewAI.generateInterviewQuestions(interviewConfig);
      
      console.log('Generated questions:', questions);
      console.log('Questions length:', questions.length);

      // Ensure we have questions
      if (!questions || questions.length === 0) {
        throw new Error('No questions were generated');
      }

      // Store interview data in session storage
      const interviewSession = {
        config: interviewConfig,
        questions: questions,
        startTime: new Date().toISOString(),
        sessionId: Date.now().toString()
      };

      console.log('Storing session data:', interviewSession);
      sessionStorage.setItem('interviewSession', JSON.stringify(interviewSession));
      
      // Verify the session was stored correctly
      const storedSession = sessionStorage.getItem('interviewSession');
      console.log('Verification - stored session:', storedSession);
      
      if (!storedSession) {
        throw new Error('Failed to store session data');
      }
      
      // Redirect to interview session page
      console.log('Redirecting to interview session...');
      router.push('/interview-prep/session');
    } catch (error) {
      console.error('Error in startInterview:', error);
      setErrors({ generation: 'Failed to generate interview questions. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Interview Preparation
          </h1>
          <p className="text-lg text-gray-600">
            Practice interviews with AI and get personalized feedback
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {currentStep > step ? <Check size={20} /> : step}
                </motion.div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Resume Upload */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Upload Your Resume
                </h2>
                <p className="text-gray-600">
                  We'll extract your skills and experience to personalize the interview
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FileText className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-700 mb-2">
                    {isUploading ? 'Processing...' : 'Click to upload or drag and drop'}
                  </span>
                  <span className="text-sm text-gray-500">
                    PDF, DOC, DOCX (MAX. 10MB)
                  </span>
                  {isUploading && (
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mt-4" />
                  )}
                </label>
              </div>

              {errors.upload && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{errors.upload}</span>
                </motion.div>
              )}

              {parsedResume && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">
                      Resume processed successfully! Found {parsedResume.skills.programming.length} technical skills.
                    </span>
                  </div>
                  <p className="text-green-700 text-sm mt-2">
                    You can customize your skills and preferences in the next step.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 2: Interview Configuration */}
        <AnimatePresence mode="wait">
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Configure Your Interview
                </h2>
                <p className="text-gray-600">
                  Customize the interview based on your preferences
                </p>
              </div>

              <div className="space-y-6">
                {/* Job Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Job Role
                  </label>
                  <select
                    value={interviewConfig.jobRole}
                    onChange={(e) => setInterviewConfig(prev => ({ ...prev, jobRole: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a job role</option>
                    {jobRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.jobRole && (
                    <p className="mt-1 text-sm text-red-600">{errors.jobRole}</p>
                  )}
                </div>

                {/* Languages/Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages & Skills
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                    {languageOptions.map(language => (
                      <label
                        key={language}
                        className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={interviewConfig.languages.includes(language)}
                          onChange={() => toggleLanguage(language)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                  {errors.languages && (
                    <p className="mt-1 text-sm text-red-600">{errors.languages}</p>
                  )}
                </div>

                {/* Interview Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {interviewTypes.map(type => (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInterviewConfig(prev => ({ ...prev, interviewType: type.value }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          interviewConfig.interviewType === type.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {difficultyLevels.map(level => (
                      <motion.button
                        key={level.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInterviewConfig(prev => ({ ...prev, difficulty: level.value }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          interviewConfig.difficulty === level.value
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-${level.color}-500 mb-2 mx-auto`} />
                        <div className="font-medium text-gray-900">{level.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <div className="flex space-x-3">
                    {questionCounts.map(count => (
                      <motion.button
                        key={count}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setInterviewConfig(prev => ({ ...prev, numberOfQuestions: count }))}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          interviewConfig.numberOfQuestions === count
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {count}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
                >
                  Review Configuration
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Review and Start */}
        <AnimatePresence mode="wait">
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ready to Start Your Interview
                </h2>
                <p className="text-gray-600">
                  Review your configuration and start when ready
                </p>
              </div>

              {/* Configuration Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Interview Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Job Role:</span>
                    <p className="font-medium text-gray-900">{interviewConfig.jobRole}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Interview Type:</span>
                    <p className="font-medium text-gray-900 capitalize">{interviewConfig.interviewType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Difficulty:</span>
                    <p className="font-medium text-gray-900 capitalize">{interviewConfig.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Questions:</span>
                    <p className="font-medium text-gray-900">{interviewConfig.numberOfQuestions}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">Skills:</span>
                    <p className="font-medium text-gray-900">{interviewConfig.languages.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Camera className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Camera Recording</span>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Mic className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Voice Interaction</span>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">AI Feedback</span>
                </div>
              </div>

              {errors.generation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{errors.generation}</span>
                </motion.div>
              )}

              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startInterview}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 flex items-center disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      Start Interview
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewSetup;
