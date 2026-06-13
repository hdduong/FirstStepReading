// Prints the exact "cut list" of audio clips the app will look for, derived
// from the book data + phonics rules. This is your checklist for splitting the
// FirstStepReading video: each line is one file to produce in public/audio/.
//
//   npm run audio:list
//
import { BOOKS } from "../src/data/index.js";
import {
  wordToken,
  soundOutTokens,
  spellTokens,
  vowelIntroTokens,
} from "../src/lib/phonics.js";

const byClip = new Map(); // clip key -> human label of what to record
const add = (t) => {
  if (t && t.clip && !byClip.has(t.clip)) byClip.set(t.clip, t.say);
};

for (const book of BOOKS) {
  for (const L of book.lessons) {
    vowelIntroTokens(L.family).forEach(add);
    for (const w of L.words) {
      add(wordToken(w.word));
      soundOutTokens(w.word, L.family).forEach(add);
    }
    for (const s of L.sight) {
      add(wordToken(s));
      spellTokens(s).forEach(add);
    }
    for (const sent of L.sentences) {
      sent.words.forEach((word) => add(wordToken(word)));
    }
  }
}

const folders = { sounds: [], words: [], letters: [] };
for (const [clip, say] of [...byClip].sort((a, b) => a[0].localeCompare(b[0]))) {
  const [folder, name] = clip.split("/");
  (folders[folder] ||= []).push({ name, say });
}

const labelFor = (folder, say) =>
  folder === "letters" ? `letter name "${say}"` : `“${say}”`;

console.log(`\nFirstStepReading audio cut list — ${byClip.size} clips total`);
console.log(`Save each as public/audio/<folder>/<name>.mp3\n`);
for (const folder of ["sounds", "letters", "words"]) {
  const items = folders[folder] || [];
  if (!items.length) continue;
  console.log(`public/audio/${folder}/  (${items.length})`);
  for (const { name, say } of items) {
    console.log(`  ${(name + ".mp3").padEnd(16)} ← ${labelFor(folder, say)}`);
  }
  console.log("");
}
