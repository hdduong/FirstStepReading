// Google Cloud TTS voice names the /api/tts proxy is allowed to synthesize.
// This lives in server/ (not src/) because the deploy package ships server/ but
// not src/. It mirrors the voiceName values in src/data/voicePacks.js
// (GOOGLE_VOICE_PACKS); src/data/voicePacks.test.js fails if the two drift.
export const TTS_VOICE_NAMES = [
  "en-US-Journey-F",
  "en-US-Neural2-C",
  "en-US-Neural2-D",
  "en-US-Neural2-F",
  "en-US-Studio-O",
];

export const DEFAULT_TTS_VOICE = "en-US-Neural2-F";
