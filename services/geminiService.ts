import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const explainSolution = async (title: string, currentIdea: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Error: API Key missing.";

  try {
    const prompt = `
      You are a senior algorithm engineer and teacher.
      Explain the solution for the LeetCode problem: "${title}".
      
      Context/Current Approach Idea: ${currentIdea}

      Please provide:
      1. A clear, intuitive explanation of the algorithm (The "Why").
      2. Step-by-step logic (The "How") without writing full code, just pseudo-code or logic steps.
      3. Why this approach is optimal (Time/Space complexity reasoning).
      
      Keep it concise, strictly formatted in Markdown.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't fetch the explanation right now.";
  }
};
