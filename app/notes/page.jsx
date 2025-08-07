
// "use client";

// import { useState } from "react";
// import Navbar from "../componenets/Navbar";

// export default function NotesPage() {
//   const [input, setInput] = useState("");
//   const [activeTab, setActiveTab] = useState("summary");
//   const [output, setOutput] = useState({
//     summary: "",
//     keypoints: "",
//     definitions: ""
//   });
//   const [loading, setLoading] = useState(false);

//   const sampleNote = `In today’s lecture on quantum computing, we covered the fundamental principles of superposition and entanglement...`;

//  const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const prompt = `You are an AI assistant. Given the lecture notes below, respond ONLY in this exact format:

// Summary:
// <summary content>

// Key Points:
// - <key point 1>
// - <key point 2>
// - <key point 3>
// - <key point 4>
// - <key point 5>

// Definitions:
// <term>: <definition>
// <term>: <definition>

// Lecture Notes:
// ${input}`;

//       const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
//         },
//         body: JSON.stringify({
//           model: "llama-3.3-70b-versatile",
//           messages: [
//             {
//               role: "user",
//               content: prompt
//             }
//           ]
//         })
//       });

//       const data = await response.json();
//       const responseText = data.choices?.[0]?.message?.content || "";

//       console.log("=== Groq Response ===", responseText);

//       const summaryMatch = responseText.match(/Summary:\s*([\s\S]*?)(?:Key Points:|$)/i);
//       const keypointsMatch = responseText.match(/Key Points:\s*([\s\S]*?)(?:Definitions:|$)/i);
//       const definitionsMatch = responseText.match(/Definitions:\s*([\s\S]*)$/i);

//       const summary = summaryMatch?.[1]?.trim() || "⚠️ Summary not found.";
//       const keypoints = keypointsMatch?.[1]?.trim() || "⚠️ Key points not found.";
//       const definitions = definitionsMatch?.[1]?.trim() || "⚠️ Definitions not found.";

//       setOutput({ summary, keypoints, definitions });
//     } catch (err) {
//       console.error("Groq API Error:", err);
//       alert("Groq API error: Check your key, input, or model.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handlePDFUpload = async (e) => {
//     if (typeof window === "undefined") return;

//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = async () => {
//       try {
//         const { getDocument, GlobalWorkerOptions, version } = await import("pdfjs-dist/legacy/build/pdf");
//         GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

//         const typedArray = new Uint8Array(reader.result);
//         const pdf = await getDocument({ data: typedArray }).promise;

//         let text = "";
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const content = await page.getTextContent();
//           const pageText = content.items.map((item) => item.str).join(" ");
//           text += pageText + "\n";
//         }

//         setInput(text);
//       } catch (err) {
//         console.error("PDF parsing error:", err);
//         alert("Failed to extract text from PDF.");
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
//       <Navbar />
//       <div className="px-4 md:px-16 py-12">
//         <div className="text-center mb-10">
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
//             Smart <span className="text-indigo-600">Note-Taking</span> Made Easy
//           </h1>
//           <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
//             Qwikish uses AI to summarize lectures, extract key insights, and define terms from your notes or PDFs.
//           </p>
//         </div>

//         {/* Feature Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
//           {[
//             {
//               title: "Smart Summarization",
//               desc: "Distill complex lectures into structured summaries."
//             },
//             {
//               title: "PDF Upload",
//               desc: "Drop in a PDF and let the AI do the rest."
//             },
//             {
//               title: "Key Insight Extraction",
//               desc: "Get key points and definitions instantly."
//             }
//           ].map((f, idx) => (
//             <div key={idx} className="bg-white border p-6 rounded-xl text-center shadow-sm">
//               <h3 className="text-indigo-600 font-semibold mb-1">{f.title}</h3>
//               <p className="text-sm text-gray-600">{f.desc}</p>
//             </div>
//           ))}
//         </div>

//         {/* Input + Output Panel */}
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Input */}
//           <div className="bg-white p-6 rounded-xl shadow border">
//             <h4 className="font-semibold text-gray-800 mb-2">📥 Your Raw Notes or PDF</h4>
//             <textarea
//               rows={10}
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Paste or type your lecture notes here..."
//               className="w-full border p-4 rounded-md text-sm resize-none focus:ring-2 focus:ring-indigo-400"
//             />
//             <div className="flex items-center justify-between mt-4 gap-2">
//               <button
//                 onClick={() => setInput(sampleNote)}
//                 className="text-sm text-indigo-500 hover:underline"
//               >
//                 Use Sample Text
//               </button>
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={handlePDFUpload}
//                 className="text-sm text-gray-600"
//               />
//               <button
//                 onClick={handleGenerate}
//                 disabled={loading || input.trim().length === 0}
//                 className={`px-4 py-2 rounded-lg text-white transition ${
//                   loading || input.trim().length === 0
//                     ? "bg-indigo-300 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700"
//                 }`}
//               >
//                 {loading ? "Generating..." : "🚀 Process with AI"}
//               </button>
//             </div>
//           </div>

//           {/* Output */}
//           <div className="bg-white p-6 rounded-xl shadow border">
//             <h4 className="font-semibold text-gray-800 mb-2">✨ AI-Enhanced Results</h4>
//             <div className="flex space-x-3 mb-4">
//               {["summary", "keypoints", "definitions"].map((tab) => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab)}
//                   className={`text-sm px-4 py-1 rounded-full ${
//                     activeTab === tab
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-100 text-gray-700"
//                   }`}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))}
//             </div>
//             <div className="text-sm whitespace-pre-wrap text-gray-700 min-h-[250px]">
//               {activeTab === "summary" && output.summary}
//               {activeTab === "keypoints" && output.keypoints}
//               {activeTab === "definitions" && output.definitions}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


/////

// "use client";

// import { useState } from "react";
// import Navbar from "../componenets/Navbar";

// export default function NotesPage() {
//   const [input, setInput] = useState("");
//   const [activeTab, setActiveTab] = useState("summary");
//   const [output, setOutput] = useState({
//     summary: "",
//     keypoints: "",
//     definitions: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [isFlipped, setIsFlipped] = useState(false);


//   const sampleNote = `In today’s lecture on quantum computing, we covered the fundamental principles of superposition and entanglement...`;

//   const [flashcards, setFlashcards] = useState([]);
//   const [currentFlashcard, setCurrentFlashcard] = useState(0);

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const prompt = `You are an AI assistant. Given the lecture notes below, respond ONLY in this exact format:

// Summary:
// <summary content>

// Key Points:
// - <key point 1>
// - <key point 2>
// - <key point 3>
// - <key point 4>
// - <key point 5>

// Definitions:
// <term>: <definition>
// <term>: <definition>

// Lecture Notes:
// ${input}`;

//       const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
//         },
//         body: JSON.stringify({
//           model: "llama-3.3-70b-versatile",
//           messages: [{ role: "user", content: prompt }]
//         })
//       });

//       const data = await response.json();
//       const responseText = data.choices?.[0]?.message?.content || "";

//       const summaryMatch = responseText.match(/Summary:\s*([\s\S]*?)(?:Key Points:|$)/i);
//       const keypointsMatch = responseText.match(/Key Points:\s*([\s\S]*?)(?:Definitions:|$)/i);
//       const definitionsMatch = responseText.match(/Definitions:\s*([\s\S]*)$/i);

//       const summary = summaryMatch?.[1]?.trim() || "⚠️ Summary not found.";
//       const keypoints = keypointsMatch?.[1]?.trim() || "⚠️ Key points not found.";
//       const definitions = definitionsMatch?.[1]?.trim() || "⚠️ Definitions not found.";

//       // Create flashcards
//       const cards = [];
//       if (definitions) {
//         const lines = definitions.split("\n").filter(Boolean);
//         lines.forEach((line) => {
//           const [term, def] = line.split(":");
//           if (term && def) {
//             cards.push({
//               question: `What is ${term.trim()}?`,
//               answer: def.trim()
//             });
//           }
//         });
//       }

//       setOutput({ summary, keypoints, definitions });
//       setFlashcards(cards);
//       setShowResults(true);
//     } catch (err) {
//       console.error("Groq API Error:", err);
//       alert("Groq API error: Check your key, input, or model.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePDFUpload = async (e) => {
//     if (typeof window === "undefined") return;

//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploadedFile(file);
//     setUploadSuccess(false);

//     const reader = new FileReader();
//     reader.onload = async () => {
//       try {
//         const { getDocument, GlobalWorkerOptions, version } = await import("pdfjs-dist/legacy/build/pdf");
//         GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

//         const typedArray = new Uint8Array(reader.result);
//         const pdf = await getDocument({ data: typedArray }).promise;

//         let text = "";
//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i);
//           const content = await page.getTextContent();
//           const pageText = content.items.map((item) => item.str).join(" ");
//           text += pageText + "\n";
//         }

//         setInput(text);
//         setUploadSuccess(true);
//       } catch (err) {
//         console.error("PDF parsing error:", err);
//         alert("Failed to extract text from PDF.");
//       }
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleReset = () => {
//     setInput("");
//     setOutput({ summary: "", keypoints: "", definitions: "" });
//     setUploadedFile(null);
//     setUploadSuccess(false);
//     setShowResults(false);
//     setFlashcards([]);
//     setCurrentFlashcard(0);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
//       <Navbar />

//       <div className="px-4 md:px-16 py-12 max-w-6xl mx-auto">
//         <div className="text-center mb-10">
//           <div className="text-5xl text-white w-16 h-16 bg-orange-500 mx-auto rounded-2xl flex items-center justify-center mb-4">
//             📖
//           </div>
//           <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Smart Notes Generator</h1>
//           <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
//             Transform PDFs, videos, and lectures into comprehensive study notes with AI-generated summaries and interactive flashcards.
//           </p>
//         </div>

//         {/* Show Results */}
//         {showResults ? (
//           <>
//             {/* Action buttons */}
//             <div className="flex justify-end gap-2 mb-6">
//               <button className="px-4 py-2 border rounded-md text-sm">📥 Download PDF</button>
//               <button className="px-4 py-2 border rounded-md text-sm">🔗 Share</button>
//               <button className="px-4 py-2 border rounded-md text-sm">💾 Save to Library</button>
//               <button
//                 onClick={handleReset}
//                 className="px-4 py-2 border rounded-md text-sm bg-gray-50 hover:bg-gray-100"
//               >
//                 ➕ New Document
//               </button>
//             </div>

//             <div className="grid md:grid-cols-3 gap-6">
//               {/* Left Column */}
//               <div className="md:col-span-2 space-y-6">
//                 {/* Summary */}
//                 <div className="bg-white p-5 rounded-xl shadow-sm border">
//                   <h2 className="text-md font-bold text-blue-600 mb-2">📘 AI Summary</h2>
//                   <p className="text-sm text-gray-700 whitespace-pre-wrap">{output.summary}</p>
//                 </div>

//                 {/* Key Points */}
//                 <div className="bg-white p-5 rounded-xl shadow-sm border">
//                   <h2 className="text-md font-bold text-green-600 mb-2">⚡ Key Learning Points</h2>
//                   <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
//                     {output.keypoints.split("\n").map((point, idx) => (
//                       <li key={idx}>{point.replace(/^[-•]\s*/, "")}</li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Key Definitions */}
//                 <div className="bg-white p-5 rounded-xl shadow-sm border">
//                   <h2 className="text-md font-bold text-orange-600 mb-2">📕 Key Definitions</h2>
//                   <ul className="text-sm text-gray-700 space-y-2">
//                     {output.definitions.split("\n").map((line, idx) => {
//                       const [term, def] = line.split(":");
//                       return (
//                         term && def && (
//                           <li key={idx}>
//                             <strong className="text-gray-800">{term.trim()}:</strong> {def.trim()}
//                           </li>
//                         )
//                       );
//                     })}
//                   </ul>
//                 </div>
//               </div>

//               {/* Flashcards */}
//               <div className="bg-white p-5 rounded-xl shadow-sm border h-fit">
//                 <h2 className="text-md font-bold text-indigo-600 mb-2">📚 Interactive Flashcards</h2>
//                 {flashcards.length > 0 ? (
//                   <div className="space-y-4">
//                     <p className="text-sm font-semibold">
//                       {flashcards[currentFlashcard].question}
//                     </p>
//                     <p className="text-sm text-gray-700">{flashcards[currentFlashcard].answer}</p>
//                     <div className="flex justify-between items-center mt-4 text-sm">
//                       <button
//                         disabled={currentFlashcard === 0}
//                         onClick={() => setCurrentFlashcard((p) => p - 1)}
//                         className="text-indigo-600 disabled:text-gray-400"
//                       >
//                         Previous
//                       </button>
//                       <span className="text-gray-500">
//                         {currentFlashcard + 1} of {flashcards.length}
//                       </span>
//                       <button
//                         disabled={currentFlashcard === flashcards.length - 1}
//                         onClick={() => setCurrentFlashcard((p) => p + 1)}
//                         className="text-indigo-600 disabled:text-gray-400"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No flashcards found.</p>
//                 )}
//               </div>
             

//             </div>

//             {/* Success Toast */}
//             <div className="fixed bottom-4 right-4 bg-white border shadow-md rounded-xl px-4 py-3 text-sm text-gray-800 z-50">
//               <p className="font-semibold text-green-600">Processing complete!</p>
//               <p className="text-xs text-gray-500 mt-1">Your notes, flashcards, and summary are ready</p>
//             </div>
//           </>
//         ) : (
//           // Upload/Input UI (same as before)
//           <div className="bg-white border rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold mb-4">⚡ Upload Your Content</h2>
//             <div className="flex space-x-2 mb-4">
//               <button className="bg-gray-200 text-sm font-medium px-4 py-2 rounded-md">📄 PDF Documents</button>
//               <button className="text-sm font-medium text-gray-400 px-4 py-2 rounded-md cursor-not-allowed">
//                 🎥 Video Content
//               </button>
//             </div>

//             <div className="border-2 border-dashed border-orange-400 rounded-xl py-12 text-center mb-6 bg-orange-50/20">
//               <label className="cursor-pointer block">
//                 <div className="text-2xl text-gray-400 mb-2">⬆️</div>
//                 <p className="text-sm text-gray-600 font-medium">Click to upload PDF documents</p>
//                 <p className="text-xs text-gray-400 mt-1">Supports lecture notes, textbooks, research papers</p>
//                 <input type="file" accept="application/pdf" onChange={handlePDFUpload} className="hidden" />
//               </label>
//             </div>

//             {uploadedFile && (
//               <div className="flex items-center justify-between border border-gray-200 rounded-md p-3 bg-gray-50 mb-4">
//                 <div>
//                   <p className="text-sm font-medium text-gray-800">{uploadedFile.name}</p>
//                   <p className="text-xs text-gray-500">
//                     {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
//                   </p>
//                 </div>
//                 {uploadSuccess && <div className="text-green-500 text-xl">✅</div>}
//               </div>
//             )}

//             <div className="flex justify-between items-center gap-4">
//               <button
//                 onClick={handleGenerate}
//                 disabled={loading || input.trim().length === 0}
//                 className={`w-full py-3 text-sm text-white font-semibold rounded-lg ${loading || input.trim().length === 0
//                     ? "bg-orange-300 cursor-not-allowed"
//                     : "bg-orange-500 hover:bg-orange-600"
//                   }`}
//               >
//                 {loading ? "Generating..." : "⚡ Generate Smart Notes"}
//               </button>
//               <button
//                 onClick={handleReset}
//                 className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-100"
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../componenets/Navbar";
import FlashcardViewer from "../componenets/FlashcardViewer";

export default function NotesPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState({
    summary: "",
    keypoints: "",
    definitions: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [flashcards, setFlashcards] = useState([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = `You are an AI assistant. Given the lecture notes below, respond ONLY in this exact format:

Summary:
<summary content>

Key Points:
- <key point 1>
- <key point 2>
- <key point 3>
- <key point 4>
- <key point 5>

Definitions:
<term>: <definition>
<term>: <definition>

Flashcards:
Q: <question 1>
A: <answer 1>

Q: <question 2>
A: <answer 2>

Q: <question 3>
A: <answer 3>
Q: <question 4>
A: <answer 4>

Q: <question 5>
A: <answer 5>

Q: <question 5>
A: <answer 5>

Lecture Notes:
${input}`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
          }),
        }
      );

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || "";

      const summaryMatch = responseText.match(
        /Summary:\s*([\s\S]*?)(?:Key Points:|$)/i
      );
      const keypointsMatch = responseText.match(
        /Key Points:\s*([\s\S]*?)(?:Definitions:|$)/i
      );
      const definitionsMatch = responseText.match(
        /Definitions:\s*([\s\S]*?)(?:Flashcards:|$)/i
      );
      const flashcardMatch = responseText.match(/Flashcards:\s*([\s\S]*)$/i);

      const summary = summaryMatch?.[1]?.trim() || "⚠️ Summary not found.";
      const keypoints = keypointsMatch?.[1]?.trim() || "⚠️ Key points not found.";
      const definitions = definitionsMatch?.[1]?.trim() || "⚠️ Definitions not found.";

      const flashcardSection = flashcardMatch?.[1]?.trim();
      const cards = [];

      if (flashcardSection) {
        const lines = flashcardSection.split("\n").filter(Boolean);
        for (let i = 0; i < lines.length; i += 2) {
          const questionLine = lines[i];
          const answerLine = lines[i + 1];
          if (questionLine.startsWith("Q:") && answerLine?.startsWith("A:")) {
            const question = questionLine.slice(2).trim();
            const answer = answerLine.slice(2).trim();
            cards.push({ question, answer });
          }
        }
      }

      setOutput({ summary, keypoints, definitions });
      setFlashcards(cards);
      setShowResults(true);
    } catch (err) {
      console.error("Groq API Error:", err);
      alert("Groq API error: Check your key, input, or model.");
    } finally {
      setLoading(false);
    }
  };

  const handlePDFUpload = async (e) => {
    if (typeof window === "undefined") return;

    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadSuccess(false);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const { getDocument, GlobalWorkerOptions, version } = await import(
          "pdfjs-dist/legacy/build/pdf"
        );
        GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

        const typedArray = new Uint8Array(reader.result);
        const pdf = await getDocument({ data: typedArray }).promise;

        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          text += pageText + "\n";
        }

        setInput(text);
        setUploadSuccess(true);
      } catch (err) {
        console.error("PDF parsing error:", err);
        alert("Failed to extract text from PDF.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleReset = () => {
    setInput("");
    setOutput({ summary: "", keypoints: "", definitions: "" });
    setUploadedFile(null);
    setUploadSuccess(false);
    setShowResults(false);
    setFlashcards([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 pt-24">
      <Navbar />
      <div className="px-4 md:px-16 py-12 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-5xl text-white w-16 h-16 bg-orange-500 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-200">
            📖
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 font-sans tracking-tight drop-shadow-sm">
            Smart Notes Generator
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base font-medium">
            Transform PDFs, videos, and lectures into comprehensive study notes
            with AI-generated summaries and interactive flashcards.
          </p>
        </div>

        {showResults ? (
          <>
            <div className="flex justify-end gap-2 mb-6">
              <button className="px-4 py-2 border rounded-md text-sm bg-white shadow hover:shadow-md transition">
                📥 Download PDF
              </button>
              <button className="px-4 py-2 border rounded-md text-sm bg-white shadow hover:shadow-md transition">
                🔗 Share
              </button>
              <button className="px-4 py-2 border rounded-md text-sm bg-white shadow hover:shadow-md transition">
                💾 Save to Library
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 border rounded-md text-sm bg-gray-50 hover:bg-gray-100"
              >
                ➕ New Document
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Summary */}
                <motion.div
                  className="bg-white p-5 rounded-xl border shadow-lg shadow-blue-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-md font-bold text-blue-600 mb-2">
                    📘 AI Summary
                  </h2>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap font-medium leading-relaxed">
                    {output.summary}
                  </p>
                </motion.div>

                {/* Key Points */}
                <motion.div
                  className="bg-white p-5 rounded-xl border shadow-lg shadow-green-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <h2 className="text-md font-bold text-green-600 mb-2">
                    ⚡ Key Learning Points
                  </h2>
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 font-medium">
                    {output.keypoints.split("\n").map((point, idx) => (
                      <li key={idx}>{point.replace(/^[-•]\s*/, "")}</li>
                    ))}
                  </ul>
                </motion.div>

                {/* Definitions */}
                <motion.div
                  className="bg-white p-5 rounded-xl border shadow-lg shadow-orange-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <h2 className="text-md font-bold text-orange-600 mb-2">
                    📕 Key Definitions
                  </h2>
                  <ul className="text-sm text-gray-700 space-y-2 font-medium">
                    {output.definitions.split("\n").map((line, idx) => {
                      const [term, def] = line.split(":");
                      return term && def ? (
                        <li key={idx}>
                          <strong className="text-gray-800">{term.trim()}:</strong>{" "}
                          {def.trim()}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </motion.div>
              </div>

              {/* Flashcards */}
              <FlashcardViewer flashcards={flashcards} />
            </div>
          </>
        ) : (
          <motion.div
            className="bg-white border rounded-xl shadow-lg shadow-indigo-100 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-lg font-semibold mb-4">⚡ Upload Your Content</h2>
            <div className="border-2 border-dashed border-orange-400 rounded-xl py-12 text-center mb-6 bg-orange-50/30 transition hover:scale-[1.01]">
              <label className="cursor-pointer block">
                <div className="text-2xl text-gray-400 mb-2">⬆️</div>
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload PDF documents
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePDFUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploadedFile && (
              <div className="flex items-center justify-between border border-gray-200 rounded-md p-3 bg-gray-50 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {uploadSuccess && (
                  <div className="text-green-500 text-xl">✅</div>
                )}
              </div>
            )}

            <div className="flex justify-between items-center gap-4">
              <button
                onClick={handleGenerate}
                disabled={loading || input.trim().length === 0}
                className={`w-full py-3 text-sm text-white font-semibold rounded-lg transition ${
                  loading || input.trim().length === 0
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {loading ? "Generating..." : "⚡ Generate Smart Notes"}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-700 border rounded-md hover:bg-gray-100"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}