'use client';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon, title, desc, features, link }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 12px 24px rgba(137, 207, 240, 0.4), 0px 8px 16px rgba(255, 192, 203, 0.2)"
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl border border-gray-200 p-6 text-left shadow-sm transition-all duration-300"
    >
      <div className="space-y-4">
        <div className="text-3xl">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 tracking-tight leading-snug">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed font-[500]">
          {desc}
        </p>
        <ul className="list-disc list-inside text-gray-500 text-sm pl-2 space-y-1 font-[500]">
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
        <a
          href={link}
          className="inline-block mt-3 px-4 py-2 text-sm text-white bg-gradient-to-r from-sky-400 to-pink-400 rounded-lg shadow hover:shadow-md hover:from-sky-500 hover:to-pink-500 transition-all"
        >
          🚀 Try Now →
        </a>
      </div>
    </motion.div>
  );
}
