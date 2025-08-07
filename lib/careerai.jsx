export async function solveCareerGuidance(profile, chatHistory = []) {
  const prompt = `You are an expert AI Career Counselor. Based on the student's details below, guide them towards suitable career paths and preparation tips.

Student Details:
- Interests: ${profile.interests}
- Academic Performance: ${profile.performance}
- Location: ${profile.location}
- Education Level: ${profile.level}

If there's any prior conversation history, continue the discussion helpfully. Respond like a warm and helpful mentor.`;

  const messages = [
    {
      role: "system",
      content:
        "You are a helpful and experienced AI career guidance counselor. Your job is to help students discover suitable career paths based on their background.",
    },
    {
      role: "user",
      content: prompt,
    },
    ...chatHistory?.map((msg) => ({
      role: msg.sender === "AI" ? "assistant" : "user",
      content: msg.text,
    })) ?? [],
  ];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "No response from AI.";
  } catch (error) {
    console.error("Career Guidance API Error:", error);
    throw new Error("Failed to get AI response.");
  }
}


// File: lib/solveCareerGuidance.js

// export async function solveCareerGuidance(profile, chatHistory) {
//   const messages = [
//     {
//       role: "system",
//       content:
//         "You are a friendly and professional career guidance counselor. Your job is to assist users based on their profile (interests, academic performance, location, and level) and ongoing chat. Offer suggestions about career paths, degrees, job options, or upskilling based on inputs. Keep your tone supportive, informative, and engaging.",
//     },
//     {
//       role: "user",
//       content: `My interests are: ${profile.interests}. My academic performance is: ${profile.performance}. I live in ${profile.location}. I am currently at the ${profile.level} level.`,
//     },
//     ...chatHistory.map((msg) => ({
//       role: msg.sender === "AI" ? "assistant" : "user",
//       content: msg.text,
//     })),
//   ];

//   try {
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "llama3-70b-8192",
//         messages,
//       }),
//     });

//     const data = await response.json();
//     return data.choices?.[0]?.message?.content?.trim() || "No response from AI.";
//   } catch (error) {
//     console.error("Career AI Error:", error);
//     throw new Error("Something went wrong with the career guidance AI.");
//   }
// }
