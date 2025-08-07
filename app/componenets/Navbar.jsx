// import React from 'react'

// const Navbar = () => {
//   return (
//      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
//       <div className="text-2xl font-bold text-indigo-600">scholarspace</div>
//       <div className="hidden md:flex gap-6 text-gray-600 font-medium">
//         <a href="#">Features</a>
//         <a href="#">About</a>
//         <a href="#">Pricing</a>
//       </div>
//       <div className="flex gap-3">
//         <button className="text-indigo-600 font-medium">Sign In</button>
//         <button className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 transition">Get Started</button>
//       </div>
//     </nav>
//   )
// }

// export default Navbar

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/40 border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo with link to Home */}
        <a href="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-400 text-transparent bg-clip-text drop-shadow">
          StudyMate<span className="text-gray-800">AI</span>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="/featuresection" className="text-gray-700 hover:text-blue-600 transition duration-300">
            Features
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition duration-300">
            About
          </a>
          <a href="#" className="text-gray-700 hover:text-blue-600 transition duration-300">
            Pricing
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition">
            Login
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md shadow">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}


// 'use client';

// import { useRouter } from 'next/navigation';

// export default function Navbar() {
//   const router = useRouter();

//   return (
//     <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/40 border-b border-white/30 shadow-lg">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
//         <a href="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-400 text-transparent bg-clip-text drop-shadow">
//           StudyMate<span className="text-gray-800">AI</span>
//         </a>

//         <nav className="hidden md:flex space-x-6 text-sm font-medium">
//           <a href="/featuresection" className="text-gray-700 hover:text-blue-600 transition duration-300">
//             Features
//           </a>
//           <a href="#" className="text-gray-700 hover:text-blue-600 transition duration-300">
//             About
//           </a>
//           <a href="#" className="text-gray-700 hover:text-blue-600 transition duration-300">
//             Pricing
//           </a>
//         </nav>

//         <div className="space-x-3">
//           <button
//             onClick={() => router.push("/auth/signin")}
//             className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition"
//           >
//             Login
//           </button>
//           <button
//             onClick={() => router.push("/auth/signup")}
//             className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md shadow"
//           >
//             Get Started
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }
