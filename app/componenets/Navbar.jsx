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
// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/40 border-b border-white/30 shadow-lg">
//       <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
//         {/* Logo with link to Home */}
//         <a href="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-400 text-transparent bg-clip-text drop-shadow">
//           StudyMate<span className="text-gray-800">AI</span>
//         </a>

//         {/* Nav Links */}
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

//         {/* Auth Buttons */}
//         <div className="space-x-3">
//           <Link href="/auth">
//           <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition">
//             Login
//           </button>
//           </Link>
//           <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md shadow">
//             Get Started
//           </button>
//         </div>
//       </div>
      
//     </header>
//   );
// }
"use client";
import Link from "next/link";
import { useAuth } from "./../context/AuthContext";
import { useState } from "react";
import { UserCircle, LogOut, Settings } from "lucide-react"; // 👈 icons

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/40 border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-400 text-transparent bg-clip-text drop-shadow"
        >
          StudyMate<span className="text-gray-800">AI</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition duration-300">
            Features
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
            About
          </Link>
          {/* <Link href="/pricing" className="text-gray-700 hover:text-blue-600 transition duration-300">
            Pricing
          </Link> */}
        </nav>

        {/* Auth Section */}
        <div className="relative">
          {!user ? (
            <div className="space-x-3">
              <Link href="/auth">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition">
                  Login
                </button>
              </Link>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-md shadow">
                Get Started
              </button>
            </div>
          ) : (
            <div className="relative">
              {/* Always show Profile Icon */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <UserCircle className="w-8 h-8 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-3 animate-fadeIn">
                  <div className="px-4 py-2 text-gray-800 font-medium">
                    {user.displayName || user.email}
                  </div>
                  <hr className="my-2" />

                

                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
