// export async function generateStudySchedule(dailyHours, subjects) {
//   const subjectDetails = subjects
//     .map((s, index) => `${index + 1}. ${s.name} - Exam: ${s.date} - Priority: ${s.priority}`)
//     .join("\n");

//   const prompt = `
// You are an expert AI study planner.

// Create a personalized study schedule for the student with:
// - Daily Study Hours: ${dailyHours}
// - Subjects:
// ${subjectDetails}

// Instructions:
// - Allocate more time to high-priority subjects and those with nearer exams.
// - Spread time effectively over the days.
// - Format like:
//   - Aug 7: 3h Math, 2h Science
//   - Aug 8: ...
// Return a practical 7–14 day plan.
// `;

//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "llama3-70b-8192",
//         messages: [{ role: "user", content: prompt }],
//       }),
//     });

//     const data = await response.json();
//     return data.choices?.[0]?.message?.content?.trim() || "No schedule returned.";
//   } catch (error) {
//     console.error("AI API Error:", error);
//     throw new Error("Something went wrong while generating the AI schedule.");
//   }
// }





export async function generateStudySchedule(dailyHours, subjects) {
  const subjectDetails = subjects
    .map(
      (s, index) =>
        `${index + 1}. ${s.name} - Exam: ${s.date} - Priority: ${s.priority}`
    )
    .join("\n");

  const prompt = `
You are an expert AI study planner.

Create a personalized study schedule for the student with:
- Daily Study Hours: ${dailyHours}
- Subjects:
${subjectDetails}

Instructions:
- Allocate more time to high-priority subjects and those with nearer exams.
- Spread time effectively over the days.
- Format like:
  - Aug 7: 3h Math, 2h Science
  - Aug 8: ...
Return a practical 7–14 day plan.
`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // ✅ correct model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6, // ✅ makes plans more structured and less random
        }),
      }
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API Error ${response.status}: ${errorDetails}`);
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content?.trim() ||
      "⚠️ No schedule returned."
    );
  } catch (error) {
    console.error("AI API Error:", error);
    throw new Error("Something went wrong while generating the AI schedule.");
  }
}
