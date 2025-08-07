"use client";
import { useState } from "react";
import { generateStudySchedule } from "../../lib/studyplannerai"; // adjust path as needed
import Navbar from "../componenets/Navbar";

export default function StudyPlanner() {
  const [dailyHours, setDailyHours] = useState(8);
  const [subject, setSubject] = useState({ name: "", date: "", priority: "Medium" });
  const [subjects, setSubjects] = useState([]);
  const [generatedSchedule, setGeneratedSchedule] = useState("");
  const [loading, setLoading] = useState(false);
//   const [scheduleData, setScheduleData] = useState([]);


  const handleAddSubject = () => {
    if (subject.name && subject.date && subject.priority) {
      setSubjects([...subjects, subject]);
      setSubject({ name: "", date: "", priority: "Medium" });
    }
  };

  const handleGenerateSchedule = async () => {
    if (!subjects.length) {
      alert("Please add at least one subject.");
      return;
    }

    try {
      setLoading(true);
      const result = await generateStudySchedule(dailyHours, subjects);
      setGeneratedSchedule(result);
    

    } catch (err) {
      alert("Failed to generate schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
        <Navbar/>
    
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10 mt-15">
      {/* Header */}
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-purple-600">AI Study Planner</h1>
        <p className="text-gray-600 mt-2">Let AI create the perfect study schedule based on your subjects, exam dates, and available time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Daily Study Hours */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <span className="text-blue-500">🕒</span> Daily Study Hours
          </h2>
          <p className="text-sm text-gray-500 mb-3">How many hours can you study each day?</p>
          <input
            type="number"
            value={dailyHours}
            onChange={(e) => setDailyHours(e.target.value)}
            className="w-full border rounded px-4 py-2"
          />
        </div>

        {/* Your Subjects */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-indigo-500">📚</span> Your Subjects ({subjects.length})
          </h2>
          {subjects.map((s, i) => (
            <div
              key={i}
              className={`mb-2 p-3 rounded border ${
                s.priority === "High" ? "border-red-300 bg-red-50" :
                s.priority === "Medium" ? "border-yellow-300 bg-yellow-50" :
                "border-green-300 bg-green-50"
              }`}
            >
              <strong>{s.name}</strong>
              <p className="text-sm">Exam: {s.date}</p>
              <span className="text-xs font-semibold">{s.priority.toLowerCase()} priority</span>
            </div>
          ))}
        </div>

        {/* Add Subjects */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-blue-500">➕</span> Add Subjects
          </h2>
          <input
            type="text"
            placeholder="e.g. Mathematics"
            value={subject.name}
            onChange={(e) => setSubject({ ...subject, name: e.target.value })}
            className="w-full border rounded px-4 py-2 mb-3"
          />
          <input
            type="date"
            value={subject.date}
            onChange={(e) => setSubject({ ...subject, date: e.target.value })}
            className="w-full border rounded px-4 py-2 mb-3"
          />
          <select
            value={subject.priority}
            onChange={(e) => setSubject({ ...subject, priority: e.target.value })}
            className="w-full border rounded px-4 py-2 mb-3"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button
            onClick={handleAddSubject}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            + Add Subject
          </button>
        </div>

        {/* Generate Schedule */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-purple-500">⚙️</span> Generate Schedule
          </h2>
          <button
            onClick={handleGenerateSchedule}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-yellow-400 text-white py-2 rounded font-semibold hover:opacity-90"
          >
            {loading ? "Generating..." : "Generate AI Schedule"}
          </button>
          <p className="text-sm text-center mt-2 text-gray-500">
            Connect Supabase for full AI functionality and calendar integration
          </p>
        </div>

        {/* Calendar Preview */}
        <div className="bg-white p-6 rounded shadow col-span-full">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <span className="text-blue-400">🗓️</span> Calendar Preview
          </h2>
          {generatedSchedule ? (
            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{generatedSchedule}</pre>
          ) : (
            <div className="border border-dashed p-6 mt-2 text-center text-gray-400 rounded">
              Calendar integration coming soon <br />
              <span className="text-xs">Connect Supabase to enable</span>
            </div>
          )}
        </div>

        {/* Calendar Preview */}
{/* Calendar Preview */}



      </div>
    </div>
    </section>
  );
}
