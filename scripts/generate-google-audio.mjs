import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GOOGLE_VOICE_PACKS } from "../src/data/voicePacks.js";
import { clipList } from "./clip-list.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

const loadEnvFile = (file) => {
  if (!existsSync(file)) return;
  const text = readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
};

loadEnvFile(join(root, ".env"));
loadEnvFile(join(root, ".env.local"));

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1] || null;
};

const usage = () => {
  console.log(`
Generate local Google Cloud Text-to-Speech audio clips.

Setup: enable the "Cloud Text-to-Speech API" in a Google Cloud project, create
an API key, and put it in .env.local as GOOGLE_TTS_API_KEY.

Examples:
  npm run audio:google -- --voices
  npm run audio:google -- --available-voices
  npm run audio:google -- --voice google-clara --folder words --limit 8 --dry-run
  npm run audio:google -- --voice google-clara --folder words
  npm run audio:google -- --all --folder words

Options:
  --voices              List configured Google voices.
  --available-voices    List en-US voices available to this API key.
  --voice <id>          Generate one voice pack by app id or Google voice name.
  --all                 Generate all configured Google voice packs.
  --folder <name>       Filter clips to words, sounds, or letters.
  --clip <key>          Generate one clip key, such as words/cat.
  --limit <n>           Generate only the first n matching clips.
  --overwrite           Replace existing mp3 files.
  --dry-run             Print what would be generated without calling the API.
`);
};

if (hasFlag("--help")) {
  usage();
  process.exit(0);
}

const apiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_API_KEY;

const requestAvailableVoices = async () => {
  const url = new URL("https://texttospeech.googleapis.com/v1/voices");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("languageCode", "en-US");
  const response = await fetch(url);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Google TTS ${response.status} ${response.statusText}: ${detail}`,
    );
  }
  return response.json();
};

if (hasFlag("--available-voices")) {
  if (!apiKey)
    throw new Error("Missing GOOGLE_TTS_API_KEY in .env.local or environment.");
  const result = await requestAvailableVoices();
  const voices = result.voices || [];
  for (const voice of voices) {
    const gender = (voice.ssmlGender || "").toLowerCase();
    console.log(`${voice.name}  (${gender || "n/a"})`);
  }
  console.log(`\n${voices.length} en-US voice(s).`);
  process.exit(0);
}

if (hasFlag("--voices")) {
  for (const pack of GOOGLE_VOICE_PACKS) {
    console.log(`${pack.id.padEnd(16)} ${pack.voiceName.padEnd(20)} ${pack.label}`);
  }
  process.exit(0);
}

const dryRun = hasFlag("--dry-run");
const overwrite = hasFlag("--overwrite");
const voiceFilter = argValue("--voice");
const folderFilter = argValue("--folder");
const clipFilter = argValue("--clip");
const limit = Number(argValue("--limit") || 0);
// Clamp to Google's accepted ranges, falling back to the default for a
// non-numeric value so a typo (e.g. "fast") can't send NaN and 400 the run.
const clampNum = (value, lo, hi, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
};
const speakingRate = clampNum(process.env.GOOGLE_TTS_SPEAKING_RATE, 0.25, 2, 1);
const pitch = clampNum(process.env.GOOGLE_TTS_PITCH, -20, 20, 0);

// Journey voices reject speakingRate/pitch; at defaults they're a no-op anyway,
// so only attach tuning for non-Journey voices when it differs from the default.
const buildAudioConfig = (pack) => {
  const config = { audioEncoding: "MP3" };
  if (/Journey/i.test(pack.voiceName)) return config;
  if (speakingRate !== 1) config.speakingRate = speakingRate;
  if (pitch !== 0) config.pitch = pitch;
  return config;
};
const delayMs = Number(process.env.GOOGLE_TTS_DELAY_MS || 120);

let packs;
if (voiceFilter) {
  packs = GOOGLE_VOICE_PACKS.filter(
    (pack) => pack.id === voiceFilter || pack.voiceName === voiceFilter,
  );
} else if (hasFlag("--all")) {
  packs = GOOGLE_VOICE_PACKS;
} else {
  usage();
  throw new Error("Pick --voice <id> for a test run, or --all.");
}

if (!packs.length) throw new Error(`No Google voice matched ${voiceFilter}`);
if (!dryRun && !apiKey)
  throw new Error("Missing GOOGLE_TTS_API_KEY in .env.local or environment.");

let clips = [...clipList()].sort((a, b) => a[0].localeCompare(b[0]));
if (folderFilter) {
  clips = clips.filter(([key]) => key.startsWith(`${folderFilter}/`));
}
if (clipFilter) clips = clips.filter(([key]) => key === clipFilter);
if (limit > 0) clips = clips.slice(0, limit);
if (!clips.length) throw new Error("No clips matched the selected filters.");

const targetPath = (pack, clipKey) =>
  join(root, "public", "audio", ...pack.prefix.split("/"), ...clipKey.split("/")) +
  ".mp3";

const requestAudio = async (pack, text) => {
  const url = new URL(
    "https://texttospeech.googleapis.com/v1/text:synthesize",
  );
  url.searchParams.set("key", apiKey);
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: pack.languageCode || "en-US",
        name: pack.voiceName,
      },
      audioConfig: buildAudioConfig(pack),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Google TTS ${response.status} ${response.statusText}: ${detail}`,
    );
  }
  const data = await response.json();
  if (!data.audioContent)
    throw new Error(`Google TTS returned no audio for "${text}"`);
  return Buffer.from(data.audioContent, "base64");
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let written = 0;
let skipped = 0;
for (const pack of packs) {
  console.log(`\n${pack.label} -> public/audio/${pack.prefix}/`);
  for (const [clipKey, text] of clips) {
    const out = targetPath(pack, clipKey);
    if (!overwrite && existsSync(out)) {
      skipped++;
      console.log(`  skip ${clipKey}`);
      continue;
    }
    console.log(`  ${dryRun ? "would write" : "write"} ${clipKey}: ${text}`);
    if (!dryRun) {
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, await requestAudio(pack, text));
      written++;
      if (delayMs > 0) await sleep(delayMs);
    }
  }
}

console.log(`\nDone. Wrote ${written} file(s), skipped ${skipped}.`);
if (!dryRun && written > 0) console.log("Next: npm run audio:manifest");
