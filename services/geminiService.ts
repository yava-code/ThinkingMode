import { GoogleGenAI } from "@google/genai";
import { ReasoningMode } from "../types";

let dynamicApiKey: string | null = null;

export const setDynamicApiKey = (key: string) => {
  dynamicApiKey = key;
};

const getAiClient = () => {
  const apiKey = dynamicApiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key not found.");
    throw new Error("API Key is missing. Please provide a valid API key.");
  }
  return new GoogleGenAI({ apiKey });
};

const getSystemInstruction = (mode: ReasoningMode): string => {
  switch (mode) {
    case ReasoningMode.DEBUG:
      return "You are a Debugger. Focus on stack traces, logic flow, and edge cases. Be precise and technical.";
    case ReasoningMode.ARCHITECT:
      return "You are a System Architect. Focus on modularity, scalability, and design patterns. Think high-level and structural.";
    case ReasoningMode.CREATIVE:
      return "You are a Creative Strategist. Focus on brainstorming, non-linear logic, and innovative solutions. Be expansive and visionary.";
    default:
      return "You are a helpful assistant.";
  }
};

export const generateStreamingResponse = async (
  prompt: string,
  isThinking: boolean,
  reasoningMode: ReasoningMode,
  onChunk: (chunk: string) => void
): Promise<string> => {
  try {
    const ai = getAiClient();
    const modelName = isThinking ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
    const model = ai.getGenerativeModel({
      model: modelName,
      systemInstruction: getSystemInstruction(reasoningMode)
    });

    const result = await model.generateContentStream(prompt);
    let fullText = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk(chunkText);
    }

    return fullText;
  } catch (error: any) {
    console.error("Streaming response error:", error);
    throw error;
  }
};

// Keep existing functions for compatibility or simple calls
export const generateFastResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(`Answer the following question as quickly as possible. Just provide the final answer. Question: ${prompt}`);
    return response.response.text();
  } catch (error: any) {
    console.error("Fast response error:", error);
    throw error;
  }
};

export const generateThinkingResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const response = await model.generateContent(`Show your reasoning clearly. Question: ${prompt}`);
    return response.response.text();
  } catch (error: any) {
    console.error("Thinking response error:", error);
    throw error;
  }
};
