import { useState, useEffect, useRef } from "react";
import { clipUrl, resolveClip } from "./audio.js";
import {
  DEFAULT_VOICE_PACK_ID,
  VOICE_PACKS,
  voicePackById,
} from "../data/voicePacks.js";
import { wordToken, soundOutTokens, spellTokens, vowelIntroTokens } from "./phonics.js";

export const SPEEDS = [
  ["Slow", 0.85],
  ["Normal", 1],
];

const wordWeight = (word) =>
  Math.max(1, String(word).replace(/[^A-Za-z0-9]+/g, "").length);

const progressWordIndex = (words, progress) => {
  if (!words.length) return 0;
  const safeProgress = Number.isFinite(progress)
    ? Math.max(0, Math.min(1, progress))
    : 0;
  const total = words.reduce((sum, word) => sum + wordWeight(word), 0);
  let target = total * safeProgress;
  for (let i = 0; i < words.length; i++) {
    target -= wordWeight(words[i]);
    if (target <= 0) return i;
  }
  return words.length - 1;
};

const wordRanges = (words) => {
  let cursor = 0;
  return words.map((word) => {
    const source = String(word);
    const first = source.search(/[A-Za-z0-9]/);
    const last = source.search(/[A-Za-z0-9][^A-Za-z0-9]*$/);
    const start = cursor + (first === -1 ? 0 : first);
    const end = cursor + (last === -1 ? source.length : last + 1);
    cursor += source.length + 1;
    return { start, end };
  });
};

const wordIndexForChar = (ranges, charIndex) => {
  if (!ranges.length) return 0;
  const exact = ranges.findIndex(
    ({ start, end }) => charIndex >= start && charIndex < end,
  );
  if (exact !== -1) return exact;
  const next = ranges.findIndex(({ end }) => charIndex < end);
  return next === -1 ? ranges.length - 1 : next;
};

// Owns all audio: prefers a recorded clip per token, falls back to the
// device's speech synthesis. Tokens and phrases can report progress so the
// Read tab can highlight each word as it plays.
export function useSpeech() {
  const [voiceList, setVoiceList] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [voicePackId, setVoicePackId] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_VOICE_PACK_ID;
    return (
      window.localStorage.getItem("firststepreading.voicePackId") ||
      DEFAULT_VOICE_PACK_ID
    );
  });
  const [speed, setSpeed] = useState(1);
  const [speakingKey, setSpeakingKey] = useState(null);
  const voiceRef = useRef(null);
  const activeVoicePack = voicePackById(voicePackId);
  const voicePackRef = useRef(activeVoicePack);
  const speedRef = useRef(1);
  const audioRef = useRef(null);
  const runRef = useRef(0); // bumped on cancel to abort an in-flight sequence
  const ttsRef = useRef({ enabled: false }); // server-side Google TTS proxy

  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    voicePackRef.current = activeVoicePack;
    if (typeof window !== "undefined")
      window.localStorage.setItem(
        "firststepreading.voicePackId",
        activeVoicePack.id,
      );
  }, [activeVoicePack]);

  // Ask the server once whether the Google TTS proxy is available. When it is,
  // unclipped words synthesize live via /api/tts; otherwise we never call it
  // (and fall straight back to the device voice).
  useEffect(() => {
    if (typeof window === "undefined") return;
    let alive = true;
    fetch("/api/health")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data) ttsRef.current.enabled = Boolean(data.tts);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!canSpeak) return;
    const synth = window.speechSynthesis;
    const load = () => {
      const all = synth.getVoices();
      let vs = all.filter((v) => /en[-_]us/i.test(v.lang));
      if (!vs.length) vs = all.filter((v) => /^en/i.test(v.lang));
      setVoiceList(vs);
      if (!voiceRef.current && vs.length) {
        const pickDefault =
          // Prefer modern neural / "Natural" voices when the device exposes them
          vs.find((v) => /natural|neural|online/i.test(v.name)) ||
          vs.find((v) => /aria|jenny|ava\b|emma|michelle|nova|sara/i.test(v.name)) ||
          vs.find((v) =>
            /samantha|allison|susan|joanna|salli|kimberly|kendra|ivy|female|woman/i.test(
              v.name,
            ),
          ) ||
          vs.find((v) => /zira/i.test(v.name)) ||
          vs[0];
        voiceRef.current = pickDefault;
        setVoiceName(pickDefault.name);
      }
    };
    load();
    if (synth.addEventListener) synth.addEventListener("voiceschanged", load);
    else synth.onvoiceschanged = load;
    return () => {
      if (synth.removeEventListener)
        synth.removeEventListener("voiceschanged", load);
      else synth.onvoiceschanged = null;
    };
  }, [canSpeak]);

  const cancel = () => {
    runRef.current++;
    if (canSpeak) window.speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.onplay = null;
      audioRef.current.onloadedmetadata = null;
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeakingKey(null);
  };

  const speakText = (text, rate, opts, done) => {
    if (!canSpeak || !text) return done();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = opts.pitch ?? 1.15;
    u.lang = (voiceRef.current && voiceRef.current.lang) || "en-US";
    if (voiceRef.current) u.voice = voiceRef.current;
    u.onend = done;
    u.onerror = done;
    window.speechSynthesis.speak(u);
  };

  const speakPhraseText = (phrase, words, rate, opts, cbs, done) => {
    if (!canSpeak || !phrase?.say) return done();
    const ranges = wordRanges(words);
    const u = new SpeechSynthesisUtterance(phrase.say);
    let lastIndex = -1;
    const highlight = (index) => {
      if (index === lastIndex) return;
      lastIndex = index;
      cbs.onStart && cbs.onStart(index);
    };
    u.rate = rate;
    u.pitch = opts.pitch ?? 1.08;
    u.lang = (voiceRef.current && voiceRef.current.lang) || "en-US";
    if (voiceRef.current) u.voice = voiceRef.current;
    u.onstart = () => highlight(0);
    u.onboundary = (event) => {
      if (typeof event.charIndex === "number")
        highlight(wordIndexForChar(ranges, event.charIndex));
    };
    u.onend = done;
    u.onerror = done;
    window.speechSynthesis.speak(u);
  };

  // Build the Google TTS proxy URL. A Google voice pack passes its exact voice;
  // any other pack lets the server pick its default voice.
  const ttsUrl = (text, pack) => {
    const params = new URLSearchParams({ text: String(text) });
    if (pack?.provider === "google" && pack.voiceName)
      params.set("voice", pack.voiceName);
    return `/api/tts?${params.toString()}`;
  };

  // Fallback for a token with no recorded clip: try the Google TTS proxy (when
  // available), then the device voice. `done` already guards against a stale run.
  const speakFallback = (text, rate, opts, done) => {
    if (ttsRef.current.enabled && text) {
      const a = new Audio(ttsUrl(text, voicePackRef.current));
      a.playbackRate = Math.max(0.5, Math.min(1.2, speedRef.current));
      audioRef.current = a;
      a.onended = done;
      a.onerror = () => speakText(text, rate, opts, done);
      a.play().catch(() => speakText(text, rate, opts, done));
    } else {
      speakText(text, rate, opts, done);
    }
  };

  // Speak an array of { say, clip } tokens. `opts.rate` is the base synthesis
  // rate (multiplied by the chosen speed). cbs.onStart(i)/onEnd fire per token
  // and at the end, used for highlighting.
  const speak = (tokens, key, opts = {}, cbs = {}) => {
    cancel();
    const run = runRef.current;
    if (key !== undefined) setSpeakingKey(key);
    const rate = Math.max(0.1, (opts.rate ?? 0.8) * speedRef.current);
    const clipRate = Math.max(0.5, Math.min(1.2, speedRef.current));
    let i = 0;
    const finish = () => {
      setSpeakingKey((k) => (k === key ? null : k));
      cbs.onEnd && cbs.onEnd();
    };
    const next = () => {
      if (run !== runRef.current) return; // cancelled
      if (i >= tokens.length) return finish();
      const t = tokens[i];
      cbs.onStart && cbs.onStart(i);
      const done = () => {
        if (run !== runRef.current) return;
        i++;
        next();
      };
      const resolvedClip = resolveClip(t.clip, voicePackRef.current);
      if (resolvedClip) {
        const a = new Audio(clipUrl(resolvedClip));
        a.playbackRate = clipRate;
        audioRef.current = a;
        a.onended = done;
        a.onerror = () => speakFallback(t.say, rate, opts, done);
        a.play().catch(() => speakFallback(t.say, rate, opts, done));
      } else {
        speakFallback(t.say, rate, opts, done);
      }
    };
    // A short delay lets speechSynthesis.cancel() settle on some browsers.
    setTimeout(() => {
      if (run === runRef.current) next();
    }, 60);
  };

  const speakPhrase = (phrase, words, key, opts = {}, cbs = {}) => {
    cancel();
    const run = runRef.current;
    if (key !== undefined) setSpeakingKey(key);
    const rate = Math.max(0.1, (opts.rate ?? 0.78) * speedRef.current);
    const clipRate = Math.max(0.5, Math.min(1.2, speedRef.current));
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setSpeakingKey((k) => (k === key ? null : k));
      cbs.onEnd && cbs.onEnd();
    };
    const deviceFallback = () => {
      if (run !== runRef.current) return;
      speakPhraseText(phrase, words, rate, opts, cbs, () => {
        if (run === runRef.current) finish();
      });
    };
    const highlight = (index) => {
      if (run === runRef.current) cbs.onStart && cbs.onStart(index);
    };
    // Google TTS proxy (with progress highlighting) before the device voice.
    const fallback = () => {
      if (run !== runRef.current) return;
      if (!ttsRef.current.enabled || !phrase?.say) return deviceFallback();
      const a = new Audio(ttsUrl(phrase.say, voicePackRef.current));
      audioRef.current = a;
      a.playbackRate = clipRate;
      a.onplay = () => highlight(0);
      a.onloadedmetadata = () => highlight(0);
      a.ontimeupdate = () => {
        if (!Number.isFinite(a.duration) || a.duration <= 0) return;
        highlight(progressWordIndex(words, a.currentTime / a.duration));
      };
      a.onended = () => {
        if (run === runRef.current) finish();
      };
      a.onerror = deviceFallback;
      a.play().catch(deviceFallback);
    };
    setTimeout(() => {
      if (run !== runRef.current) return;
      const resolvedClip = resolveClip(phrase.clip, voicePackRef.current);
      if (!resolvedClip) return fallback();
      const a = new Audio(clipUrl(resolvedClip));
      audioRef.current = a;
      a.playbackRate = clipRate;
      a.onplay = () => highlight(0);
      a.onloadedmetadata = () => highlight(0);
      a.ontimeupdate = () => {
        if (!Number.isFinite(a.duration) || a.duration <= 0) return;
        highlight(progressWordIndex(words, a.currentTime / a.duration));
      };
      a.onended = () => {
        if (run === runRef.current) finish();
      };
      a.onerror = fallback;
      a.play().catch(fallback);
    }, 60);
  };

  // ---- High-level actions ----
  const sayWord = (word, key) => speak([wordToken(word)], key ?? `w-${word}`);
  const soundOut = (word, family) =>
    speak(soundOutTokens(word, family), `w-${word}`, { rate: 0.72 });
  const spellWord = (word) => speak(spellTokens(word), `s-${word}`, { rate: 0.85 });
  const playVowelIntro = (family) =>
    speak(vowelIntroTokens(family), "aa", { rate: 0.72 });
  const testVoice = () =>
    speak([wordToken("Hello"), wordToken("Mat"), wordToken("is"), wordToken("a"), wordToken("rat")], "test", {
      rate: 0.85,
    });

  const pickVoice = (name) => {
    setVoiceName(name);
    const v = voiceList.find((x) => x.name === name);
    if (v) voiceRef.current = v;
  };
  const pickVoicePack = (id) => {
    const pack = voicePackById(id);
    voicePackRef.current = pack;
    setVoicePackId(pack.id);
  };
  const changeSpeed = (v) => {
    setSpeed(v);
    speedRef.current = v;
  };

  return {
    canSpeak,
    voicePacks: VOICE_PACKS,
    voicePackId: activeVoicePack.id,
    activeVoicePack,
    voiceList,
    voiceName,
    speed,
    speakingKey,
    SPEEDS,
    speak,
    speakPhrase,
    sayWord,
    soundOut,
    spellWord,
    playVowelIntro,
    testVoice,
    pickVoicePack,
    pickVoice,
    changeSpeed,
    cancel,
  };
}
