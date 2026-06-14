export const DEFAULT_VOICE_PACK_ID = "elevenlabs-alice";

export const BASE_VOICE_PACKS = [
  {
    id: "video",
    label: "Original video clips",
    provider: "local",
    prefix: "",
  },
];

export const ELEVENLABS_VOICE_PACKS = [
  {
    id: "elevenlabs-alice",
    label: "Alice - Clear, Engaging Educator",
    provider: "elevenlabs",
    prefix: "elevenlabs/alice",
    voiceId: "Xb7hH8MSUJpSbSDYk0k2",
  },
  {
    id: "elevenlabs-matilda",
    label: "Matilda - Knowledgable, Professional",
    provider: "elevenlabs",
    prefix: "elevenlabs/matilda",
    voiceId: "XrExE9yKIg1WjnnlVkGX",
  },
  {
    id: "elevenlabs-bella",
    label: "Bella - Professional, Bright, Warm",
    provider: "elevenlabs",
    prefix: "elevenlabs/bella",
    voiceId: "hpp4J3VqNfWAUOO0d1Us",
  },
  {
    id: "elevenlabs-jessica",
    label: "Jessica - Playful, Bright, Warm",
    provider: "elevenlabs",
    prefix: "elevenlabs/jessica",
    voiceId: "cgSgspJ2msm6clMCkdW9",
  },
  {
    id: "elevenlabs-sarah",
    label: "Sarah - Mature, Reassuring, Confident",
    provider: "elevenlabs",
    prefix: "elevenlabs/sarah",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
  },
  {
    id: "elevenlabs-george",
    label: "George - Warm, Captivating Storyteller",
    provider: "elevenlabs",
    prefix: "elevenlabs/george",
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
  },
];

export const VOICE_PACKS = [...BASE_VOICE_PACKS, ...ELEVENLABS_VOICE_PACKS];

export const voicePackById = (id) =>
  VOICE_PACKS.find((pack) => pack.id === id) ||
  VOICE_PACKS.find((pack) => pack.id === DEFAULT_VOICE_PACK_ID);
