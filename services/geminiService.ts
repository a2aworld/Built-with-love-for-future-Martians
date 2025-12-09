
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { StoryNode, AgentResponse } from "../types";

/**
 * Service singleton for the Google Gemini API client.
 * In Production/Public mode, this relies on the environment variable being set
 * in the deployment platform (e.g., Google Cloud Run, Vercel).
 */
let client: GoogleGenAI | null = null;

/**
 * Initializes the Gemini API client using the environment's injected API key.
 * 
 * @returns {boolean} True if initialization was successful, false otherwise.
 */
export const initializeGemini = (): boolean => {
  try {
    // In a deployed environment, process.env.API_KEY must be defined
    // in the build settings or runtime environment variables.
    if (process.env.API_KEY) {
      client = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return true;
    }
    
    console.warn("Gemini API Key is missing. Please check your deployment environment variables.");
    return false;
  } catch (e) {
    console.error("Failed to initialize Gemini client", e);
    return false;
  }
};

/**
 * Generates the narrative text for a specific story node.
 * Uses Gemini 3 Pro to weave the ancient myth.
 * 
 * @param {StoryNode} node - The selected geographical/mythological node.
 * @returns {Promise<string>} The generated narrative text.
 */
const generateText = async (node: StoryNode): Promise<string> => {
    if (!client) {
       const success = initializeGemini();
       if (!success) return "Connection Lost. Please contact Mission Control (Check API_KEY configuration).";
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
          model: 'gemini-3-pro-preview', // User requested Gemini 3 Pro
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
 * Generates a high-fidelity visualization of the myth.
 * Uses Gemini 3 Pro Image to create "Artistic Masterpieces".
 * 
 * @param {StoryNode} node - The selected geographical/mythological node.
 * @returns {Promise<string | undefined>} Base64 encoded image string or undefined if generation fails.
 */
const generateImage = async (node: StoryNode): Promise<string | undefined> => {
    if (!client) return undefined;

    // Prompt Engineering: Focus on "Artistic Masterpiece" / "Iconography".
    // Instruction ensures the AI acts as a 'Cosmic Iconographer'.
    const prompt = `
    Create a stunning, intricate, high-fidelity artistic masterpiece of: ${node.title}.
    Context: Ancient mythology encoded into the Earth at Latitude: ${node.coordinates.lat}, Longitude: ${node.coordinates.lng}.
    
    Visual Style: 
    - A magnificent, museum-quality iconographic drawing or painting.
    - Vivid, rich colors appropriate to the culture and subject (e.g., Lapis Lazuli for Egyptian, vibrant Ochre/Red for Vedic, Fresco styles for Classical).
    - Intricate linework, divine proportions, majestic composition.
    - Visually stunning work of art that correlates to the subject matter (${node.visualCue}).
    - NOT a map overlay. A standalone artifact of the "Galactic Storybook".
    
    Aspect Ratio: 16:9.
    Quality: 8k resolution style, cinematic, majestic.
    `;

    try {
        // @ts-ignore
        const response = await client.models.generateContent({
            model: 'gemini-3-pro-image-preview', // High quality image generation
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

        // Extract image data from the response parts
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
 * Orchestrates the full agent response (Text + Image).
 * Runs generation in parallel for "Vibe Coding" speed.
 * 
 * @param {StoryNode} node - The selected node.
 * @returns {Promise<AgentResponse>} The combined response object.
 */
export const generateStoryResponse = async (node: StoryNode): Promise<AgentResponse> => {
  if (!client) {
    const success = initializeGemini();
    if (!success) {
        return {
            text: "System Alert: API Key not detected in environment variables. Please configure the satellite uplink.",
            emotionalTone: 'Analytical'
        };
    }
  }

  // Parallel execution to minimize latency
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
