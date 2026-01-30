import { GoogleGenAI } from "@google/genai";

let dynamicApiKey: string | null = null;

export const setDynamicApiKey = (key: string) => {
  dynamicApiKey = key;
};

// Initialize the API client
const getAiClient = () => {
  const apiKey = dynamicApiKey || process.env.API_KEY;
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
    // We explicitly ask it to be brief to simulate the "no thinking" risk
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Updated to supported flash model
      contents: `Answer the following question as quickly as possible. Do not explain your reasoning. Just provide the final answer. Question: ${prompt}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking to simulate impulse
      }
    });
    return response.text || "Error: No response generated.";
  } catch (error: unknown) {
    console.error("Fast response error:", error);
    if (error instanceof Error && error.message?.includes('API key')) {
        return "Error: Invalid API Key. Please check your credentials.";
    }
    if (error instanceof Error && (error.message?.includes('not found') || ('status' in error && (error as any).status === 404))) {
        return "Error: Model not available. The experimental model may be geo-restricted or deprecated.";
    }
    return "Fatal Error: The system crashed while attempting a rapid response.";
  }
};

export const generateThinkingResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    // Using pro model with high thinking budget for reasoning tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Updated to supported pro model
      contents: `Please solve the following problem. Show your step-by-step reasoning clearly before providing the final answer. Treat this as a complex logic puzzle. Question: ${prompt}`,
      config: {
        thinkingConfig: { thinkingBudget: 2048 } // Budget for reasoning
      }
    });
    return response.text || "Error: No response generated.";
  } catch (error: unknown) {
    console.error("Thinking response error:", error);
    if (error instanceof Error && error.message?.includes('API key')) {
        return "Error: Invalid API Key. Please check your credentials.";
    }
    if (error instanceof Error && (error.message?.includes('not found') || ('status' in error && (error as any).status === 404))) {
        return "Error: Model not available. The experimental model may be geo-restricted or deprecated.";
    }
    return "Error: Unable to complete the reasoning process.";
  }
};