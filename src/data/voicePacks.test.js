import { describe, it, expect } from "vitest";
import {
  VOICE_PACKS,
  GOOGLE_VOICE_PACKS,
  DEFAULT_VOICE_PACK_ID,
  voicePackById,
} from "./voicePacks.js";

describe("voice packs", () => {
  it("has a default pack that exists", () => {
    expect(VOICE_PACKS.some((p) => p.id === DEFAULT_VOICE_PACK_ID)).toBe(true);
  });

  it("has unique ids and prefixes", () => {
    const ids = VOICE_PACKS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const prefixes = VOICE_PACKS.map((p) => p.prefix);
    expect(new Set(prefixes).size).toBe(prefixes.length);
  });

  it("voicePackById falls back to the default for an unknown id", () => {
    expect(voicePackById("does-not-exist").id).toBe(DEFAULT_VOICE_PACK_ID);
  });

  it("every Google pack is well-formed", () => {
    expect(GOOGLE_VOICE_PACKS.length).toBeGreaterThan(0);
    for (const pack of GOOGLE_VOICE_PACKS) {
      expect(pack.provider).toBe("google");
      expect(pack.prefix.startsWith("google/")).toBe(true);
      expect(pack.languageCode).toBe("en-US");
      expect(pack.voiceName).toMatch(/^en-US-/);
    }
  });
});
