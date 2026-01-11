// "use client";

// import React from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";

// const features = [
//   { title: "AI-Powered Notes", desc: "Summarize and structure ideas with intelligent note-taking.", icon: "📝", link: "/notes" },
//   { title: "Smart Flashcards", desc: "SRS-based decks for smarter revision.", icon: "📚",link: "/flashcards"  },
//   { title: "AI Quizzes", desc: "Generate quizzes to test your knowledge.", icon: "❓",link: "/quizzes" },
//   { title: "Time & Task Tracker", desc: "Stay productive with Pomodoro and reports.", icon: "⏱️",link: "/tasks"  },
//   { title: "Skill Roadmaps", desc: "Learn with structured paths.", icon: "🛤️" ,link: "/roadmaps" },
//   { title: "Productivity Boost", desc: "Organize all your tools in one place.", icon: "🚀" },
// ];

// const FeatureGrid = () => {
//   return (
//     <section className="px-8 py-16 bg-white">
//       <div className="text-center mb-12">
//         <h2 className="text-4xl font-bold text-gray-800">
//           Everything You Need to <span className="text-indigo-600">Excel</span>
//         </h2>
//         <p className="mt-4 text-gray-600">
//           All-in-one AI tools to help you study smarter, not harder.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {features.map((f, i) => {
//           const Card = (
//             <motion.div
//               whileHover={{ y: -10, scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//               transition={{ type: "spring", stiffness: 300 }}
//               className="p-6 bg-indigo-50 rounded-xl shadow-xl hover:shadow-2xl transition duration-300"
//             >
//               <div className="text-3xl mb-4">{f.icon}</div>
//               <h3 className="text-xl font-semibold mb-2 text-gray-800">{f.title}</h3>
//               <p className="text-gray-600">{f.desc}</p>
//             </motion.div>
//           );

//           return f.link ? (
//             <Link href={f.link} key={i}>
//               {Card}
//             </Link>
//           ) : (
//             <div key={i}>{Card}</div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default FeatureGrid;


import FeatureCard from "./FeatureCard";
import InterviewCard from "./InterviewPrep/InterviewCard";
import {
  Lightbulb,
  BookOpenCheck,
  CheckCircle,
  GraduationCap,
  Code,
  Group
} from "lucide-react";

const features = [
  {
    icon: <Lightbulb className="text-blue-500" size={32} />,
    title: "AI Doubt Solver",
    desc: "Upload any question image or type your doubt. Get step-by-step solutions.",
    features: ["OCR Text Recognition", "Step-by-step Solutions", "Multiple Subject Support"],
    link: "/doubtsolverpage"
  },
  {
    icon: <BookOpenCheck className="text-orange-500" size={32} />,
    title: "Smart Notes Generator",
    desc: "Transform PDFs, videos into summarized notes with flashcards.",
    features: ["PDF Summarize", "AI Summarization", "Flashcard Generation"],
    link: "/notes"
  },
  {
    icon: <CheckCircle className="text-green-500" size={32} />,
    title: "AI Study Planner",
    desc: "Personalized study schedules based on subjects and exams.",
    features: ["Smart Scheduling", "Progress Tracking"],
    link: "/studyplanner"
  },
  {
    icon: <GraduationCap className="text-indigo-500" size={32} />,
    title: "Career Guidance",
    desc: "Get AI-powered career suggestions based on interests.",
    features: ["College Suggestions", "Exam Guidance"],
    link: "/career"
  },
  {
    icon: <Code className="text-yellow-600" size={32} />,
    title: "Code Debugger",
    desc: "Paste buggy code and get fixes with explanation.",
    features: ["Multi-language Support", "Bug Detection"],
    link: "/code-debugger"
  },
  {
    icon: <Group className="text-lime-600" size={32} />,
    title: "Study Groups",
    desc: "Join chatrooms with real-time collaboration and AI help.",
    features: ["AI Assistant", "Subject Organization"],
    link: "/groups"
  }
];

export default function FeaturesSection() {
  return (
    <div>
      <section className="px-4 md:px-16 py-20 bg-gradient-to-b from-gray-100 to-indigo-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
            <span className="block">Powerful AI Tools</span>
          
            <span className="block text-orange-500">for Academic Excellence</span>
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Everything you need to accelerate your learning journey <br className="hidden md:block" />
            with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>

        {/* Interview Preparation Section */}
        <div className="mt-16">
          <InterviewCard />
        </div>
      </section>
      <section className="py-20 bg-gradient-to-b from-white via-indigo-50 to-white text-center">
        <div className="bg-white rounded-2xl shadow-xl p-10 md:p-16 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-full mb-4">
            🎓 Join 1000+ Students
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-snug">
            Ready to Transform Your <br />
            <span className="text-blue-600">Learning</span>{" "}
            <span className="text-orange-500">Experience?</span>
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Start using StudyMate AI today and experience the future of personalized learning.
            No commitment, no risk — just smarter studying.
          </p>

          <ul className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-8">
            <li className="flex items-center gap-2">
              ✅ Free forever plan
            </li>
            <li className="flex items-center gap-2">
              🤖 AI-powered study tools
            </li>
            <li className="flex items-center gap-2">
              💳 No credit card required
            </li>
            <li className="flex items-center gap-2">
              ⏰ 24/7 learning support
            </li>
          </ul>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">
              Get Started Free →
            </button>
            <button className="px-6 py-3 border border-gray-300 hover:bg-gray-100 rounded-lg text-sm font-medium">
              Schedule Demo
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Trusted by students from 50+ universities worldwide
          </p>
        </div>
      </section>
    </div>
  );
}

