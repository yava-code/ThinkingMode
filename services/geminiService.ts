import { GoogleGenAI } from "@google/genai";

let dynamicApiKey: string | null = null;

export const setDynamicApiKey = (key: string) => {
  dynamicApiKey = key;
};

// Initialize the API client
const getAiClient = () => {
  // Use import.meta.env for Vite compatibility
  const apiKey = dynamicApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key not found.");
    throw new Error("API Key is missing. Please provide a valid API key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFastResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // Using flash model for speed, representing the "impulsive" brain
    // No thinkingConfig here as gemini-1.5-flash doesn't support it
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{
        role: 'user',
        parts: [{ text: `Answer the following question as quickly as possible. Do not explain your reasoning. Just provide the final answer. Question: ${prompt}` }]
      }]
    });
    return response.text || "Error: No response generated.";
  } catch (error: any) {
    console.error("Fast response error:", error);
    throw error;
  }
};

export const generateThinkingResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // Using pro model with reasoning instructions
    // No thinkingConfig here as gemini-1.5-pro doesn't support it in this SDK version
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: [{
        role: 'user',
        parts: [{ text: `Please solve the following problem. Show your step-by-step reasoning clearly before providing the final answer. Treat this as a complex logic puzzle. Question: ${prompt}` }]
      }]
    });
    return response.text || "Error: No response generated.";
  } catch (error: any) {
    console.error("Thinking response error:", error);
    throw error;
  }
};
