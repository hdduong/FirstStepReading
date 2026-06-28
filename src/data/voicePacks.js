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

// Google Cloud Text-to-Speech voices. `voiceName`/`languageCode` are the exact
// Google voice ids — used both by scripts/generate-google-audio.mjs (to write
// committed clips under public/audio/google/<short>/) and by the live
// /api/tts proxy when a word has no committed clip yet. Keep the voiceName list
// in sync with the allowlist in server/index.js.
export const GOOGLE_VOICE_PACKS = [
  {
    id: "google-clara",
    label: "Clara - Google Neural2",
    provider: "google",
    prefix: "google/clara",
    voiceName: "en-US-Neural2-F",
    languageCode: "en-US",
  },
  {
    id: "google-nina",
    label: "Nina - Google Neural2",
    provider: "google",
    prefix: "google/nina",
    voiceName: "en-US-Neural2-C",
    languageCode: "en-US",
  },
  {
    id: "google-leo",
    label: "Leo - Google Neural2",
    provider: "google",
    prefix: "google/leo",
    voiceName: "en-US-Neural2-D",
    languageCode: "en-US",
  },
  {
    id: "google-ruth",
    label: "Ruth - Google Studio",
    provider: "google",
    prefix: "google/ruth",
    voiceName: "en-US-Studio-O",
    languageCode: "en-US",
  },
];

export const VOICE_PACKS = [
  ...BASE_VOICE_PACKS,
  ...ELEVENLABS_VOICE_PACKS,
  ...GOOGLE_VOICE_PACKS,
];

export const voicePackById = (id) =>
  VOICE_PACKS.find((pack) => pack.id === id) ||
  VOICE_PACKS.find((pack) => pack.id === DEFAULT_VOICE_PACK_ID);
