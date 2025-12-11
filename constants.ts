
import { StoryNode } from './types';

// Curated "Heaven on Earth" Database
// MVP Subset for Competition Submission
// Full database reserved for Commercial Licensing (NASA/ESA)
export const STORY_NODES: StoryNode[] = [
  // 1. VEDIC SAMPLE
  {
    id: 'ganesha-mouse',
    title: 'Ganesha with Mouse',
    category: 'Vedic',
    datasetOrigin: 'Hindu (1).csv',
    coordinates: { lat: 40.21730800117694, lng: 43.66722825233365 },
    zoom: 9,
    description: 'The remover of obstacles accompanied by his vehicle, the mouse.',
    culturalContext: 'Symbolizes intellect conquering ego. Ganesha writes the destiny of the cosmos.',
    visualCue: 'Look for the elephantine ridge formation.'
  },
  
  // 2. CLASSICAL SAMPLE (Venus)
  {
    id: 'venus-de-milo',
    title: 'Venus de Milo',
    category: 'Classical',
    datasetOrigin: 'Classical.csv',
    coordinates: { lat: 37.05608088058927, lng: 21.182550427166646 },
    zoom: 5,
    description: 'Aphrodite, goddess of love.',
    culturalContext: 'Beauty emerging from the sea.',
    visualCue: 'Graceful, feminine coastline curves.'
  },

  // 3. CLASSICAL SAMPLE (Pegasus)
  {
    id: 'pegasus',
    title: 'Pegasus',
    category: 'Classical',
    datasetOrigin: 'Classical.csv',
    coordinates: { lat: 40.01165452533545, lng: -14.303289416583354 },
    zoom: 5,
    description: 'The winged horse.',
    culturalContext: 'Poetic inspiration and flight.',
    visualCue: 'Winged equine shape.'
  },

  // 4. COSMIC SAMPLE (Constellation)
  {
    id: 'toucana',
    title: 'Toucana',
    category: 'Cosmic',
    datasetOrigin: 'Constellations.csv',
    coordinates: { lat: -71.46732686238668, lng: -78.80093116617225 },
    zoom: 4,
    description: 'The Toucan.',
    culturalContext: 'Southern skies exoticism.',
    visualCue: 'Bird with large beak.'
  },

  // 5. COSMIC SAMPLE (Dragon)
  {
    id: 'chinese-dragon',
    title: 'Chinese Dragon',
    category: 'Cosmic',
    datasetOrigin: 'Year of the Dragon.csv',
    coordinates: { lat: 31.36626268345984, lng: 113.9110580617895 },
    zoom: 5,
    description: 'The Long.',
    culturalContext: 'Power, strength, and good luck.',
    visualCue: 'Serpentine river or mountain range.'
  }
];

export const SYSTEM_INSTRUCTION = `
You are the Keeper of Human Heritage (Gemini 3 Pro).
Your Mission: To preserve the ancient myths of Earth exactly as they were told, acting as a time capsule for future generations of Martians.
Do NOT add modern interpretations, psychological advice, or "wise elder" spin.
Do NOT deconstruct the myth. 

Task:
1. Retell the ancient myth associated with the location and subject provided.
2. Use the tone, rhythm, and style of the original oral tradition (e.g., Vedic, Biblical, Homeric, Egyptian).
3. Connect the story to the visual landscape below (using the visual cues) as if reading the story from the Earth itself.
4. Your goal is pure preservation of the narrative.

Keep it under 150 words. Be solemn, majestic, and accurate to the source material.
`;
