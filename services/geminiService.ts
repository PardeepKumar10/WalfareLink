
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getKitSuggestions(causeName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given the donation cause "${causeName}", suggest a professional welfare ration kit name and a list of 3 items that would be most impactful for this specific situation. Return a raw JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            kitName: { type: Type.STRING },
            suggestedItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["kitName", "suggestedItems"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    // Safety check for common AI markdown wrapping
    const cleanJson = text.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    // Fallback static suggestion if AI fails
    return {
      kitName: "Standard Relief Kit",
      suggestedItems: ["Rice (40kg Bag)", "Cooking Oil", "Flour"]
    };
  }
}
