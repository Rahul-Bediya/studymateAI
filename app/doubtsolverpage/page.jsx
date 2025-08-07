// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import Navbar from "../componenets/Navbar";

// export default function DoubtSolverPage() {
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const prompt = `You are an expert AI tutor. Given the student's academic question below, provide a clear and detailed explanation in the form of 3 to 6 concise bullet points. Be accurate, step-by-step, and easy to understand.

// Question: ${input}

// Answer:`;

//       const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "llama3-70b-8192",
//           messages: [{ role: "user", content: prompt }],
//         }),
//       });

//       const data = await response.json();
//       const responseText = data.choices?.[0]?.message?.content || "";
//       setOutput(responseText.trim());
//     } catch (err) {
//       console.error("Groq API Error:", err);
//       alert("Groq API error: Check your key, input, or model.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 pt-24">
//       <Navbar />
//       <div className="max-w-6xl mx-auto px-4 md:px-16 py-10">
//         <div className="text-center mb-10">
//           <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-lg">
//             🧠
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
//             AI Doubt Solver
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Get instant, step-by-step solutions to your academic questions.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           {/* Input Section */}
//           <div className="bg-white rounded-xl border shadow-md p-6">
//             <h2 className="text-lg font-semibold text-blue-600 mb-3">💡 Ask Your Question</h2>
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               rows={6}
//               placeholder="Type your question here..."
//               className="w-full border rounded-md p-3 text-sm text-gray-700 mb-4"
//             />
//             <div className="flex gap-3">
//               <button
//                 onClick={handleGenerate}
//                 disabled={loading || input.trim() === ""}
//                 className={`flex-1 py-2 rounded-md text-sm font-medium text-white ${
//                   loading || input.trim() === ""
//                     ? "bg-blue-300 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }`}
//               >
//                 {loading ? "Solving..." : "🧠 Solve Question"}
//               </button>
//               <button
//                 onClick={() => {
//                   setInput("");
//                   setOutput("");
//                 }}
//                 className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>

//           {/* Output Section */}
//           <motion.div
//             className="bg-white rounded-xl border shadow-md p-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             <h2 className="text-lg font-semibold text-orange-600 mb-3">📘 AI Solution</h2>
//             {output ? (
//               <p className="text-sm text-gray-700 whitespace-pre-wrap font-medium leading-relaxed">
//                 {output}
//               </p>
//             ) : (
//               <p className="text-sm text-gray-400 italic">Enter a question and click \"Solve Question\" to begin.</p>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../componenets/Navbar";
import { solveAcademicQuestion } from '../../lib/doubtai';


export default function DoubtSolverPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const prompt = `You are an expert AI tutor. Given the student's academic question below, provide a clear and detailed explanation in the form of 3 to 6 concise bullet points. Be accurate, step-by-step, and easy to understand.

// Question: ${input}

// Answer:`;

//       const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: "llama3-70b-8192",
//           messages: [{ role: "user", content: prompt }],
//         }),
//       });

//       const data = await response.json();
//       const responseText = data.choices?.[0]?.message?.content || "";
//       setOutput(responseText.trim());
//     } catch (err) {
//       console.error("Groq API Error:", err);
//       alert("Groq API error: Check your key, input, or model.");
//     } finally {
//       setLoading(false);
//     }
//   };


const handleGenerate = async () => {
  setLoading(true);
  try {
    const responseText = await solveAcademicQuestion(input);
    setOutput(responseText);
  } catch (err) {
    alert("Error: Could not fetch answer.");
  } finally {
    setLoading(false);
  }
};


  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = (e) => console.error("Speech error:", e);
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🤖 AI Doubt Solver
          </h1>
          <p className="text-gray-500">
            Ask anything academic and get a clear, step-by-step answer.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Chat Interface */}
          <div className="bg-gray-50 rounded-xl border p-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              placeholder="Ask your question here..."
              className="w-full bg-white border border-gray-300 rounded-md p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handleVoiceInput}
                  className="px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                >
                  🎤 Speak
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
                >
                  📷 Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => alert("Image input not yet connected to OCR.")}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading || input.trim() === ""}
                  className={`px-5 py-2 text-sm font-medium rounded-md transition text-white ${
                    loading || input.trim() === ""
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Solving..." : "Submit"}
                </button>
                <button
                  onClick={() => {
                    setInput("");
                    setOutput("");
                  }}
                  className="text-sm text-gray-500 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* AI Response */}
          {output && (
            <motion.div
              className="bg-white border rounded-xl p-6 shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-blue-600 mb-2">Answer:</h2>
              <div className="text-gray-700 text-base whitespace-pre-wrap leading-relaxed">
                {output}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
