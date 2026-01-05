
import { GoogleGenAI, Type } from "@google/genai";

export async function getKitSuggestions(causeName: string) {
  // Always create instance right before call for reliability
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    
    const cleanJson = text.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return {
      kitName: "Standard Relief Kit",
      suggestedItems: ["Rice (40kg Bag)", "Cooking Oil", "Flour"]
    };
  }
}
