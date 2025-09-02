"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import router
import { auth } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // ✅ initialize router

  // Email/Password Signup
  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // ✅ redirect after signup
    } catch (err) {
      alert(err.message);
    }
  };

  // Email/Password Login
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // ✅ redirect after login
    } catch (err) {
      alert(err.message);
    }
  };

  // Google Sign-In
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/"); // ✅ redirect after google login
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        {/* Email Input */}
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        {/* Password Input */}
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        {/* Buttons */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={signup}
            className="w-1/2 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
          <button
            onClick={login}
            className="w-1/2 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            Login
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign-In */}
        <button
          onClick={googleSignIn}
          className="w-full flex items-center justify-center space-x-2 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            fill="currentColor"
          >
            <path d="M488 261.8c0-17.8-1.5-35.6-4.7-52.9H249v99.9h135.7c-5.8 31.4-23.1 57.9-49.4 75.6l79.9 62.2c46.6-43 72.8-106.1 72.8-184.8zM249 492c66.3 0 122-21.8 162.7-59.2l-79.9-62.2c-22.2 15-50.6 23.9-82.8 23.9-63.6 0-117.6-42.8-136.9-100.4l-83.2 64.2C78.4 447.1 157.2 492 249 492zM112.1 293.1c-7.8-23.4-7.8-48.7 0-72.1V157h-83.2C4.2 184.6 0 216.5 0 249s4.2 64.4 28.9 92h83.2v-47.9z" />
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
