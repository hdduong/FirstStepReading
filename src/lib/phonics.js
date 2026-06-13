import { wordKey, letterKey, soundKey } from "./audio.js";

// Onset (beginning) consonant sounds, e.g. C says "kuh".
export const ONSET_SOUND = {
  B: "buh",
  C: "kuh",
  D: "duh",
  F: "fuh",
  H: "huh",
  J: "juh",
  M: "muh",
  P: "puh",
  R: "ruh",
  S: "suh",
  V: "vuh",
  Y: "yuh",
  Th: "thuh",
};

// The ending consonant sound each word family lands on.
export const FAMILY_END = { at: "tuh", an: "nuh", am: "muh" };
const FAMILY_END_ID = { at: "t", an: "n", am: "m" };

export const cleanWord = (w) => w.replace(/[^A-Za-z']/g, "");

export const shuffle = (arr) =>
  arr
    .map((v) => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map((x) => x[1]);

// ---- Spoken tokens ----
// A token is { say, clip }: `say` is the text the browser voice reads as a
// fallback; `clip` is the recorded-clip key to prefer when that clip exists.

export const wordToken = (word) => ({ say: cleanWord(word), clip: wordKey(word) });

// Sound a word into [onset, rime, whole word] — e.g. Cat -> "kuh", "at", "Cat".
// A base family word (at/an/am) is sounded as [short-a, ending, word].
export const soundOutTokens = (word, family) => {
  const lower = cleanWord(word).toLowerCase();
  const whole = wordToken(word);
  if (lower === family) {
    return [
      { say: "ah", clip: soundKey("vowel", "a") },
      { say: FAMILY_END[family], clip: soundKey("end", FAMILY_END_ID[family]) },
      whole,
    ];
  }
  const isTh = lower.startsWith("th");
  const onset = isTh ? "Th" : lower[0].toUpperCase();
  const onsetId = isTh ? "th" : onset;
  return [
    { say: ONSET_SOUND[onset] || onset, clip: soundKey("onset", onsetId) },
    { say: family, clip: soundKey("rime", family) },
    whole,
  ];
};

// Spell a word: each letter name, then the whole word.
export const spellTokens = (word) => {
  const clean = cleanWord(word);
  return [
    ...clean
      .toUpperCase()
      .split("")
      .map((ch) => ({ say: ch, clip: letterKey(ch) })),
    { say: clean, clip: wordKey(word) },
  ];
};

// Short-A intro played from the Words tab header.
export const vowelIntroTokens = (family) => [
  { say: "ah", clip: soundKey("vowel", "a") },
  { say: "ah", clip: soundKey("vowel", "a") },
  { say: "apple", clip: wordKey("apple") },
  { say: family, clip: soundKey("rime", family) },
];
