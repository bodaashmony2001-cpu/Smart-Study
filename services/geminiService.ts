
import { GoogleGenAI, Type } from "@google/genai";
import { AcademicAsset, Language, VisualForgeData } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robust JSON cleaner to handle potential model artifacts or truncation.
 */
const cleanAndParseJSON = (text: string) => {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Basic structural check: find the first { and the last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Critical JSON Parse Error:", e, "Raw Text snippet:", text.slice(0, 100));
    throw new Error("The synthesis engine generated a malformed response. Please try with a smaller section of the material.");
  }
};

/**
 * Ultra-high-speed academic synthesis.
 * Optimized for 'gemini-3-flash-preview' for sub-10s response times.
 */
export const generateAcademicAsset = async (text: string, lang: Language): Promise<AcademicAsset> => {
  const ai = getAI();
  
  const systemInstruction = `You are "Smart Study Pro", an AI academic engine. 
GOAL: High-speed, high-resolution academic synthesis.

STRICT CONSTRAINTS:
1. OUTPUT ONLY VALID JSON. No preamble. No markdown blocks.
2. BE CONCISE. Keep text short to prevent response truncation.
3. LANGUAGE: Detect the language of the input or use the requested language '${lang}'.
   - If 'ar', use Academic Arabic.
   - Otherwise, use English.

DATA MAPPING:
- meta: topic, duration, level.
- summary: {content: "2 tight paragraphs in the target language", english_keywords: ["4 tags"]}
- flashcards: 5 items {id, front_text, back_text, type} (in target language)
- mind_map_data: {root_node, branches: 4 items (title, icon, color_code, key_points)} (in target language)
- visual_forge: {concepts: 6 items (importance 1-10, shapes: circle, hexagon, star, rect, label, description), connections: 4 items}
- chatbot_persona_context: 1-sentence persona.

If you cannot process everything, focus on the most important academic concepts.`;

  // Reduced window to 30k for absolute stability and speed
  const optimizedInput = text.slice(0, 30000); 

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: optimizedInput, 
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      // Enforcing schema reduces halluncinations and ensures structure
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          meta: { type: Type.OBJECT, properties: { topic_title: { type: Type.STRING }, reading_time: { type: Type.STRING }, difficulty_level: { type: Type.STRING } }, required: ["topic_title", "reading_time", "difficulty_level"] },
          summary: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, english_keywords: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["content", "english_keywords"] },
          flashcards: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, front_text: { type: Type.STRING }, back_text: { type: Type.STRING }, type: { type: Type.STRING } }, required: ["id", "front_text", "back_text", "type"] } },
          mind_map_data: { type: Type.OBJECT, properties: { root_node: { type: Type.STRING }, branches: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, icon: { type: Type.STRING }, color_code: { type: Type.STRING }, key_points: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["title", "icon", "color_code", "key_points"] } } }, required: ["root_node", "branches"] },
          spaced_repetition_schedule: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { day_offset: { type: Type.NUMBER }, notification_title: { type: Type.STRING }, activity_type: { type: Type.STRING }, question: { type: Type.STRING } }, required: ["day_offset", "notification_title", "activity_type", "question"] } },
          visual_forge: { 
            type: Type.OBJECT, 
            properties: { 
              concepts: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.NUMBER }, label: { type: Type.STRING }, description: { type: Type.STRING }, shape: { type: Type.STRING }, importance: { type: Type.NUMBER }, color: { type: Type.STRING } }, required: ["id", "label", "description", "shape", "importance", "color"] } },
              connections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { from: { type: Type.NUMBER }, to: { type: Type.NUMBER } }, required: ["from", "to"] } }
            },
            required: ["concepts", "connections"]
          },
          chatbot_persona_context: { type: Type.STRING }
        },
        required: ["meta", "summary", "flashcards", "mind_map_data", "spaced_repetition_schedule", "visual_forge", "chatbot_persona_context"]
      }
    },
  });

  return cleanAndParseJSON(response.text || '{}');
};

export const chatWithMaterial = async (
  query: string, 
  context: string, 
  history: { role: 'user' | 'model', text: string }[],
  lang: Language
): Promise<string> => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { 
      systemInstruction: `You are the specific material tutor. Context: ${context}. 
      Give immediate, efficient, and precise answers. Language: ${lang}.` 
    }
  });
  const response = await chat.sendMessage({ message: query });
  return response.text || "Neural connection interrupted.";
};
