import { wordKey, letterKey, soundKey } from "./audio.js";

// ---- Phonics sound tables ----
// Short-vowel info drives both the spoken intro and the Words-tab header.
// `say` is the fallback text the device voice reads; `word`/`emoji` are the
// standard keyword for that vowel (short A → "apple" 🍎). These are phonics
// keywords, not book content, so every book reuses them.
export const VOWEL_INFO = {
  a: { sound: "a", say: "ah", word: "apple", emoji: "🍎" },
  e: { sound: "e", say: "eh", word: "egg", emoji: "🥚" },
  i: { sound: "i", say: "ih", word: "igloo", emoji: "🧊" },
  o: { sound: "o", say: "awe", word: "octopus", emoji: "🐙" },
  u: { sound: "u", say: "uh", word: "umbrella", emoji: "☂️" },
};

// Single-consonant sounds, e.g. C says "kuh". Used for both onsets and endings.
export const CONSONANT_SOUND = {
  b: "buh", c: "kuh", d: "duh", f: "fuh", g: "guh", h: "huh", j: "juh",
  k: "kuh", l: "luh", m: "muh", n: "nuh", p: "puh", q: "kwuh", r: "ruh",
  s: "suh", t: "tuh", v: "vuh", w: "wuh", x: "ksuh", y: "yuh", z: "zuh",
};

// Two letters that make one sound (digraphs + the common -ck/-ng endings).
export const DIGRAPH_SOUND = {
  th: "thuh", sh: "shuh", ch: "chuh", wh: "wuh", ph: "fuh", ck: "kuh", ng: "ng",
};
const DIGRAPHS = Object.keys(DIGRAPH_SOUND);

// The short vowel a family is built on: "at"/"an" → "a", "et" → "e", "ig" → "i".
export const vowelOf = (family) => family[0].toLowerCase();

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

// Sound a consonant cluster left to right, treating digraphs as one sound and
// keying each piece under `kind` (onset/end): "c" → [kuh], "th" → [thuh],
// "fl" → [fuh, luh]. Doubled letters (ll/ss) collapse to a single sound.
const clusterTokens = (cluster, kind) => {
  if (cluster.length === 2 && cluster[0] === cluster[1]) {
    const ch = cluster[0];
    return [{ say: CONSONANT_SOUND[ch] || ch, clip: soundKey(kind, cluster) }];
  }
  const tokens = [];
  let rest = cluster;
  while (rest) {
    const dg = DIGRAPHS.find((d) => rest.startsWith(d));
    if (dg) {
      tokens.push({ say: DIGRAPH_SOUND[dg], clip: soundKey(kind, dg) });
      rest = rest.slice(dg.length);
    } else {
      const ch = rest[0];
      tokens.push({ say: CONSONANT_SOUND[ch] || ch, clip: soundKey(kind, ch) });
      rest = rest.slice(1);
    }
  }
  return tokens;
};

// Sound a word into [onset…, rime, whole word] — e.g. Cat → "kuh", "at", "Cat".
// A bare family word (at/et/ig…) is sounded as [short vowel, ending…, word].
export const soundOutTokens = (word, family) => {
  const lower = cleanWord(word).toLowerCase();
  const whole = wordToken(word);
  if (lower === family) {
    const v = vowelOf(family);
    return [
      { say: VOWEL_INFO[v]?.say ?? v, clip: soundKey("vowel", v) },
      ...clusterTokens(family.slice(1), "end"),
      whole,
    ];
  }
  const onset = lower.endsWith(family)
    ? lower.slice(0, lower.length - family.length)
    : lower.slice(0, 1);
  return [
    ...clusterTokens(onset, "onset"),
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

// Short-vowel intro played from the Words tab header: the vowel sound twice,
// the keyword for that vowel, then the family rime.
export const vowelIntroTokens = (family) => {
  const v = vowelOf(family);
  const info = VOWEL_INFO[v] ?? { say: v, word: v };
  return [
    { say: info.say, clip: soundKey("vowel", v) },
    { say: info.say, clip: soundKey("vowel", v) },
    { say: info.word, clip: wordKey(info.word) },
    { say: family, clip: soundKey("rime", family) },
  ];
};
