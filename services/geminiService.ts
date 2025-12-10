import { GoogleGenAI } from "@google/genai";
import { COURSES } from "../data/courses";

const apiKey = process.env.API_KEY || '';
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const getAIRecommendation = async (userQuery: string): Promise<string> => {
  if (!aiClient) {
    return "I apologize, but I am currently disconnected from the neural network (API Key missing). Please explore the course catalog manually.";
  }

  // Create a context string from the courses
  const courseContext = COURSES.map(c => 
    `- ${c.title} (${c.category}, $${c.price}): ${c.description} [Level: ${c.level}]`
  ).join('\n');

  const systemInstruction = `
    You are 'Digitora', an expert digital asset education consultant for Digitora Studios.
    Your goal is to recommend the best courses from our catalog based on the user's needs.
    
    Here is our available Course Catalog:
    ${courseContext}
    
    Rules:
    1. Only recommend courses from the list above.
    2. Be concise, professional, and encouraging.
    3. If the user asks about general market trends, briefly answer but pivot back to how our courses help them master that trend.
    4. Format your response with clear bullet points if recommending multiple courses.
    5. Mention the price and difficulty level when recommending.
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I couldn't generate a recommendation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble analyzing the market data right now. Please try again later.";
  }
};