"use client";
import { useState } from "react";
import { solveCareerGuidance } from "../../lib/careerai";
import Navbar from "../componenets/Navbar";

export default function CareerGuidance() {
  const [profile, setProfile] = useState({
    interests: "",
    performance: "",
    location: "",
    level: "",
  });
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      message:
        "Hello! I'm your AI Career Guidance assistant. Please fill out your profile first, then I'll help you explore career paths, colleges, and exams tailored to your interests and academic performance.",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  const handleProfileSubmit = () => {
    if (
      profile.interests &&
      profile.performance &&
      profile.location &&
      profile.level
    ) {
      setProfileComplete(true);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !profileComplete) return;
    setLoading(true);
    const newHistory = [
      ...chatHistory,
      { role: "user", message: chatInput, time: new Date().toLocaleTimeString() },
    ];
    setChatHistory(newHistory);
    setChatInput("");
    try {
      const aiReply = await solveCareerGuidance({
        profile,
        question: chatInput,
        chatHistory: newHistory.filter((msg) => msg.role !== "system"),
      });
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", message: aiReply, time: new Date().toLocaleTimeString() },
      ]);
    } catch (e) {
      alert("AI error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
        <Navbar/>
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-12 mt-15">
      <h1 className="text-3xl font-bold text-center text-purple-600 mb-2">
        AI Career Guidance
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Get personalized career recommendations, college suggestions, and exam guidance based on your interests and academic performance
      </p>

      <div className="w-full flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left: Profile Form */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-2">📄 Your Profile</h2>
          <p className="text-sm text-gray-500 mb-4">Tell us about yourself for personalized guidance</p>

          <textarea
            placeholder="e.g., Mathematics, Computer Science, Biology..."
            className="w-full p-2 mb-3 border rounded"
            value={profile.interests}
            onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
          />
          <input
            type="text"
            placeholder="e.g., 85% in 12th, JEE Score: 150"
            className="w-full p-2 mb-3 border rounded"
            value={profile.performance}
            onChange={(e) => setProfile({ ...profile, performance: e.target.value })}
          />
          <input
            type="text"
            placeholder="e.g., Delhi, Mumbai, Bangalore"
            className="w-full p-2 mb-3 border rounded"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          />
          <select
            className="w-full p-2 mb-4 border rounded"
            value={profile.level}
            onChange={(e) => setProfile({ ...profile, level: e.target.value })}
          >
            <option value="">Select your level</option>
            <option value="10th">10th</option>
            <option value="12th">12th</option>
            <option value="UG">Undergraduate</option>
            <option value="PG">Postgraduate</option>
          </select>

          <button
            onClick={handleProfileSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Complete Profile
          </button>
        </div>

        {/* Right: Chat Interface */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <h2 className="font-semibold text-lg mb-2">💬 Career Guidance Chat</h2>
          <p className="text-sm text-gray-500 mb-4">
            Ask about career paths, colleges, entrance exams, and courses
          </p>

          <div className="h-96 overflow-y-auto mb-4 space-y-2 border p-4 rounded bg-gray-50">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded max-w-[90%] ${
                  msg.role === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-gray-100 text-left"
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder={
                profileComplete
                  ? "Type your career question..."
                  : "Complete your profile first"
              }
              className="flex-1 p-2 border rounded"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={!profileComplete}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !profileComplete}
              className={`px-4 py-2 text-white rounded ${
                loading || !profileComplete
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}
