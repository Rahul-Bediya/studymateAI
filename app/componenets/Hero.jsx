// "use client";

// import React from 'react'
// import { motion } from "framer-motion";
// const Hero = () => {
//   return (
//     <section className="flex flex-col md:flex-row items-center px-8 py-16 bg-gradient-to-b from-white to-indigo-50">
//       <div className="md:w-1/2 space-y-6">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-5xl font-bold text-gray-800"
//         >
//           Simplify Your <span className="text-indigo-600">Student Life</span>
//         </motion.h1>
//         <p className="text-lg text-gray-600">
//           Boost productivity, master your studies, and accelerate your career with AI-powered student tools.
//         </p>
//         <div className="flex gap-4">
//           <button className="bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700 transition">
//             Start Learning Free
//           </button>
//           <button className="flex items-center gap-2 text-indigo-600 font-medium">
//             ▶ Watch Demo
//           </button>
//         </div>
//         <p className="text-sm text-gray-500 mt-2">
//           ✅ Free to start  &nbsp; • &nbsp; ❌ No credit card required
//         </p>
//       </div>
//       <motion.img
//         src="/hero.jpg"
//         alt="Student working"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ delay: 0.3, duration: 0.7 }}
//         className="md:w-1/2 mt-10 md:mt-0 rounded-lg shadow-lg"
//       />
//     </section>
//   )
// }

// export default Hero
"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  BookOpenCheck,
  GraduationCap,
  Code,
  Group,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative px-4 md:px-16 pt-32 pb-20 grid md:grid-cols-2 gap-10 items-center overflow-hidden">
      {/* Blurred Blue Background Blob */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-sm text-blue-600 font-medium mb-2">
          #1 AI Study Platform
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight relative z-10">
          <span className="relative inline-block">
            Your AI-Powered <br />
            <span className="text-blue-600">Study</span>{" "}
            <span className="text-orange-500">Companion</span>
            <span className="absolute -inset-2 bg-blue-100 opacity-30 rounded-2xl blur-2xl -z-10"></span>
          </span>
        </h1>

        <p className="text-gray-600 mb-6 text-2xl">
          Your all-in-one AI-powered study companion. Get instant doubt solutions, smart notes, personalized study plans, and career guidance and AI Interview Practise with real time feedback.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium shadow"
          >
            Start Learning Free
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-md text-sm font-medium"
          >
            Watch Demo
          </motion.button>
        </div>

        {/* Features Tags */}
        {/* Features Tags as Buttons */}
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full shadow-sm hover:bg-blue-200 transition">
            <Lightbulb size={14} /> Doubt Solver
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full shadow-sm hover:bg-orange-200 transition">
            <BookOpenCheck size={14} /> Smart Notes
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full shadow-sm hover:bg-indigo-200 transition">
            <GraduationCap size={14} /> Career Guide
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full shadow-sm hover:bg-yellow-200 transition">
            <Code size={14} /> Code Debugger
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-lime-100 text-lime-800 rounded-full shadow-sm hover:bg-lime-200 transition">
            <Group size={14} /> Study Groups
          </span>
        </div>

      </motion.div>

      {/* Hero Image */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <img
          src="/hero.jpg"
          alt="AI Illustration"
          className="max-w-full h-auto rounded-xl shadow-md"
        />
      </motion.div>
    </section>
  );
}
