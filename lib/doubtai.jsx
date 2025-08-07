export async function solveAcademicQuestion(question) {
  const prompt = `You are an expert AI tutor. Given the student's academic question below, provide a clear and detailed explanation in the form of 3 to 6 concise bullet points. Be accurate, step-by-step, and easy to understand.\n\nQuestion: ${question}\n\nAnswer:`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "No answer returned.";
  } catch (error) {
    console.error("AI API Error:", error);
    throw new Error("Something went wrong with the AI response.");
  }
}