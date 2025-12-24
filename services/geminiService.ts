
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { StoryNode, AgentResponse } from "../types";

/**
 * Service singleton for the Google Gemini API client.
 */
let client: GoogleGenAI | null = null;

/**
 * Initializes the Gemini API client using the environment's injected API key.
 */
export const initializeGemini = (): boolean => {
  try {
    if (typeof window !== 'undefined' && window.env && window.env.API_KEY) {
        if (window.env.API_KEY.includes('your_google_gemini_api_key')) {
            return false;
        }
        client = new GoogleGenAI({ apiKey: window.env.API_KEY });
        return true;
    }

    if (process.env.API_KEY) {
      client = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return true;
    }
    
    return false;
  } catch (e) {
    return false;
  }
};

/**
 * Generates the narrative text for a specific story node.
 */
const generateText = async (node: StoryNode): Promise<string> => {
    if (!client) {
       const success = initializeGemini();
       if (!success) return "Connection Lost. Please contact Mission Control.";
    }
    
    const prompt = `
    Target: ${node.title}
    Location: ${node.coordinates.lat}, ${node.coordinates.lng}
    Myth: ${node.description}
    Meaning: ${node.culturalContext}
    Visual: ${node.visualCue}
    
    Recite the ancient tale. Preserve the heritage.
    `;

    try {
        // @ts-ignore
        const response = await client.models.generateContent({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7, 
          },
          contents: prompt,
        });
        
        return response.text || "The Archives are silent.";
    } catch (e) {
        console.error("Text Generation Error:", e);
        return "Transmission Interrupted.";
    }
};

/**
 * Generates a high-fidelity visualization of the myth using Chronoscope parameters.
 */
const generateImage = async (node: StoryNode): Promise<string | undefined> => {
    if (!client) return undefined;

    // Prompt Engineering: Focus on Sacred Iconography and traditional depictions.
    const prompt = `
    Create a stunning, intricate, high-fidelity traditional iconographic masterpiece of: ${node.title}.
    Context: Ancient mythology encoded into the Earth. This is a sacred artifact for the "Galactic Storybook".
    
    Visual Style: 
    - Authentic traditional iconography (e.g., Vedic Thangka or Murti style, Byzantine fresco, Egyptian papyrus).
    - Capture the specific mythological moment: ${node.visualCue}.
    - If the subject is Narasimha, depict the traditional iconographic scene with total accuracy: the lion-headed avatar with the demon king Hiranyakashipu across his lap, being slain at the threshold. This is a sacred, symbolic act of protection and dharma.
    - Vivid, rich colors (Lapis, Gold, Ochre, Crimson).
    - Intricate patterns, divine geometry, and majestic composition.
    - Museum-quality, dignified, and majestic.
    - DO NOT MORPH WITH A MOUNTAIN. This must be a clean, traditional work of art.
    
    Aspect Ratio: 16:9.
    Quality: 8k resolution style, cinematic lighting, profound textures.
    `;

    try {
        // @ts-ignore
        const response = await client.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "16:9",
                    imageSize: "1K"
                }
            }
        });

        // @ts-ignore
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    } catch (e) {
        console.warn("Image generation failed", e);
        return undefined;
    }
    return undefined;
};

/**
 * Orchestrates the full agent response.
 */
export const generateStoryResponse = async (node: StoryNode): Promise<AgentResponse> => {
  if (!client) {
    initializeGemini();
  }

  const [text, imageUrl] = await Promise.all([
      generateText(node),
      generateImage(node)
  ]);

  return {
      text,
      imageUrl,
      emotionalTone: 'Wondrous'
  };
};
