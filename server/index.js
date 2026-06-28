import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Server for Azure App Service: serves the built SPA from dist/ and hosts the
// API. App Service provides PORT. The /api/tts route is a Google Cloud
// Text-to-Speech proxy that keeps the API key server-side and is only used as a
// live fallback for words that don't have a committed clip yet.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");
const port = process.env.PORT || 3000;

// ---- Google TTS config (server-side only; never shipped to the client) ----
const GOOGLE_TTS_KEY =
  process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_API_KEY || "";
const TTS_ENABLED = Boolean(GOOGLE_TTS_KEY);
// Allowlist of Google voice names we permit. Keep in sync with
// GOOGLE_VOICE_PACKS in src/data/voicePacks.js (can't import src/ here — it is
// not shipped in the deploy package).
const TTS_VOICES = new Set([
  "en-US-Neural2-A",
  "en-US-Neural2-C",
  "en-US-Neural2-D",
  "en-US-Neural2-F",
  "en-US-Studio-O",
  "en-US-Wavenet-F",
]);
const DEFAULT_TTS_VOICE = "en-US-Neural2-F";
const TTS_LANGUAGE = "en-US";
const TTS_MAX_LEN = 200;

// Cache synthesized audio in memory so repeated words cost one upstream call.
const ttsCache = new Map(); // `${voice}|${text}` -> Buffer
const TTS_CACHE_MAX = 500;

// Simple fixed-window per-IP rate limit (defense-in-depth on a paid endpoint).
const RL_MAX = 120;
const RL_WINDOW_MS = 10 * 60 * 1000;
const rlHits = new Map(); // ip -> { count, reset }
const rateLimited = (ip) => {
  const now = Date.now();
  if (rlHits.size > 5000) rlHits.clear(); // crude prune; this app is tiny
  let entry = rlHits.get(ip);
  if (!entry || now > entry.reset) {
    entry = { count: 0, reset: now + RL_WINDOW_MS };
    rlHits.set(ip, entry);
  }
  entry.count += 1;
  return entry.count > RL_MAX;
};

const app = express();
app.set("trust proxy", true); // so req.ip is the client IP behind Azure's proxy

// ---- API routes ----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", tts: TTS_ENABLED });
});

// Live Google TTS fallback. GET /api/tts?text=...&voice=en-US-Neural2-F
app.get("/api/tts", async (req, res) => {
  if (!TTS_ENABLED) return res.status(503).json({ error: "tts_disabled" });
  if (rateLimited(req.ip)) return res.status(429).json({ error: "rate_limited" });

  const text = String(req.query.text ?? "")
    .slice(0, TTS_MAX_LEN)
    .trim();
  if (!text) return res.status(400).json({ error: "missing_text" });

  let voice = String(req.query.voice ?? "");
  if (!TTS_VOICES.has(voice)) voice = DEFAULT_TTS_VOICE;

  const cacheKey = `${voice}|${text}`;
  const cached = ttsCache.get(cacheKey);
  if (cached) {
    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(cached);
  }

  try {
    const upstream = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(
        GOOGLE_TTS_KEY,
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: TTS_LANGUAGE, name: voice },
          audioConfig: { audioEncoding: "MP3" },
        }),
      },
    );

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("Google TTS upstream error", upstream.status, detail);
      return res.status(502).json({ error: "tts_upstream" });
    }

    const data = await upstream.json();
    if (!data.audioContent)
      return res.status(502).json({ error: "tts_empty" });

    const buffer = Buffer.from(data.audioContent, "base64");
    if (ttsCache.size >= TTS_CACHE_MAX)
      ttsCache.delete(ttsCache.keys().next().value); // evict oldest
    ttsCache.set(cacheKey, buffer);

    res.set("Content-Type", "audio/mpeg");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(buffer);
  } catch (err) {
    console.error("Google TTS request failed", err);
    res.status(502).json({ error: "tts_failed" });
  }
});

// ---- Static SPA + client-side routing fallback ----
app.use(express.static(distDir));
app.use((req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, () => {
  console.log(`FirstStepReading server listening on port ${port}`);
  console.log(`Google TTS proxy: ${TTS_ENABLED ? "enabled" : "disabled"}`);
});
