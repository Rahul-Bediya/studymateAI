// export async function solveAcademicQuestion(question) {
//   const prompt = `You are an expert AI tutor. Given the student's academic question below, provide a clear and detailed explanation in the form of 3 to 6 concise bullet points. Be accurate, step-by-step, and easy to understand.\n\nQuestion: ${question}\n\nAnswer:`;

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
//     return data.choices?.[0]?.message?.content?.trim() || "No answer returned.";
//   } catch (error) {
//     console.error("AI API Error:", error);
//     throw new Error("Something went wrong with the AI response.");
//   }

  
// }


export async function solveAcademicQuestion(question) {
  const prompt = `You are an expert AI tutor. Given the student's academic question below, provide a clear and detailed explanation in the form of 3 to 6 concise bullet points. Be accurate, step-by-step, and easy to understand.

Question: ${question}

Answer:`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // ✅ correct model name
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7, // optional: makes answers a bit more natural
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API Error ${response.status}: ${errorDetails}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "⚠️ No answer returned.";
  } catch (error) {
    console.error("AI API Error:", error);
    throw new Error("Something went wrong with the AI response.");
  }
}
