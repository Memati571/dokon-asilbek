
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIFoodRecommendation = async (userMood: string, availableItems: MenuItem[]) => {
  const menuSummary = availableItems.map(item => `${item.name} (${item.description}) - ${item.price} so'm`).join(', ');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Foydalanuvchi holati: "${userMood}". Menyudagi taomlar: ${menuSummary}. 
    Iltimos, foydalanuvchining kayfiyatiga mos keladigan 2 ta eng yaxshi taomni tanlang va nima uchun tavsiya qilayotganingizni qisqa (o'zbek tilida) tushuntiring.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                itemName: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["itemName", "reason"]
            }
          }
        },
        required: ["recommendations"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("JSON parsing error:", e);
    return { recommendations: [] };
  }
};
