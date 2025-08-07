// import React from 'react'

// const Footer = () => {
//   return (
//      <footer className="bg-gray-900 text-white px-8 py-12 mt-16">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Brand */}
//         <div>
//           <h2 className="text-2xl font-bold text-indigo-500">Scholarspace</h2>
//           <p className="mt-2 text-sm text-gray-400">
//             Simplifying student life with AI tools and smart productivity.
//           </p>
//         </div>

//         {/* Navigation */}
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
//           <ul className="space-y-1 text-gray-400">
//             <li><a href="#" className="hover:text-white">Home</a></li>
//             <li><a href="#" className="hover:text-white">Features</a></li>
//             <li><a href="#" className="hover:text-white">Pricing</a></li>
//             <li><a href="#" className="hover:text-white">About</a></li>
//           </ul>
//         </div>

//         {/* Social */}
//         <div>
//           <h3 className="text-lg font-semibold mb-2">Connect</h3>
//           <div className="flex space-x-4 text-gray-400">
//             <a href="#" className="hover:text-white">🐦</a>
//             <a href="#" className="hover:text-white">💼</a>
//             <a href="#" className="hover:text-white">📘</a>
//             <a href="#" className="hover:text-white">📸</a>
//           </div>
//         </div>
//       </div>

//       {/* Bottom */}
//       <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
//         © {new Date().getFullYear()} Qwikish. All rights reserved.
//       </div>
//       </footer>
//   )
// }

// export default Footer


export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-100 to-indigo-50 border-t py-8 px-6 text-sm text-gray-500">
      <div className="flex flex-wrap justify-between items-start gap-10 max-w-7xl mx-auto">
        <div>
          <div className="text-xl font-bold text-blue-700">StudyMate<span className="text-gray-700">AI</span></div>
          <p className="mt-2 text-xs max-w-xs">Empowering students worldwide with AI-driven learning tools for academic excellence.</p>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-gray-700">Product</div>
          <ul className="space-y-1">
            <li>Doubt Solver</li>
            <li>Notes Generator</li>
            <li>Study Planner</li>
            <li>Career Guidance</li>
          </ul>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-gray-700">Resources</div>
          <ul className="space-y-1">
            <li>Help Center</li>
            <li>Tutorials</li>
            <li>Blog</li>
            <li>Community</li>
          </ul>
        </div>
        <div className="space-y-2">
          <div className="font-semibold text-gray-700">Company</div>
          <ul className="space-y-1">
            <li>About</li>
            <li>Privacy</li>
            <li>Terms</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-10 text-xs">© 2025 StudyMate AI. All rights reserved.</div>
    </footer>
  );
}
