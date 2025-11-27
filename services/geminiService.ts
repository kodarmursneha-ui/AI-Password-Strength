import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey });

// Define the response schema using the GenAI Type enum
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "A security score from 0 to 100",
    },
    label: {
      type: Type.STRING,
      description: "One of: Weak, Moderate, Strong, Very Strong",
    },
    crackTimeDisplay: {
      type: Type.STRING,
      description: "Human readable time estimate to crack, e.g., '2 minutes', '300 centuries'",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of positive aspects of the password",
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of vulnerabilities found",
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable tips to improve the password",
    },
  },
  required: ["score", "label", "crackTimeDisplay", "strengths", "weaknesses", "suggestions"],
};

export const analyzePasswordWithGemini = async (password: string): Promise<AnalysisResult> => {
  if (!password || !apiKey) {
    throw new Error("Missing password or API Key");
  }

  const prompt = `
    Analyze the security strength of the following password: "${password}".
    
    Consider these factors:
    1. Length (short passwords are weak).
    2. Complexity (mix of uppercase, lowercase, numbers, symbols).
    3. Common patterns (sequences, keyboard walks, common words).
    4. Predictability.

    Be strict.
    - If it's less than 8 chars, score should be low.
    - If it's a common word, score should be very low.
    - Calculate a rough time to crack based on entropy.

    Return the result in JSON format matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback or re-throw depending on app needs, here we re-throw to handle in UI
    throw error;
  }
};