import { describe, it, expect } from "vitest";
import {
  vowelOf,
  cleanWord,
  soundOutTokens,
  spellTokens,
  vowelIntroTokens,
  sentenceText,
  sentenceToken,
  VOWEL_INFO,
} from "./phonics.js";

// Tokens are { say, clip }; the tests assert on the spoken `say` sequence.
const says = (tokens) => tokens.map((t) => t.say);

describe("vowelOf / cleanWord", () => {
  it("takes the vowel from the start of the family", () => {
    expect(vowelOf("at")).toBe("a");
    expect(vowelOf("og")).toBe("o");
    expect(vowelOf("ug")).toBe("u");
  });

  it("strips surrounding punctuation but keeps apostrophes", () => {
    expect(cleanWord("rat.")).toBe("rat");
    expect(cleanWord("Jim's")).toBe("Jim's");
    expect(cleanWord("“Lox.”")).toBe("Lox");
  });
});

describe("soundOutTokens", () => {
  it("splits a simple CVC word into onset, rime, whole word", () => {
    expect(says(soundOutTokens("Cat", "at"))).toEqual(["kuh", "at", "Cat"]);
  });

  it("sounds each letter of a consonant cluster onset", () => {
    expect(says(soundOutTokens("Glad", "ad"))).toEqual([
      "guh",
      "luh",
      "ad",
      "Glad",
    ]);
  });

  it("treats a digraph onset as a single sound", () => {
    expect(says(soundOutTokens("That", "at"))).toEqual(["thuh", "at", "That"]);
  });

  it("sounds a bare family word as vowel + ending + word", () => {
    expect(says(soundOutTokens("At", "at"))).toEqual([
      VOWEL_INFO.a.say,
      "tuh",
      "At",
    ]);
  });
});

describe("spellTokens", () => {
  it("names each letter then says the whole word", () => {
    expect(says(spellTokens("Cat"))).toEqual(["C", "A", "T", "Cat"]);
  });
});

describe("vowelIntroTokens", () => {
  it("plays the vowel sound twice, the keyword, then the rime", () => {
    const info = VOWEL_INFO.a;
    expect(says(vowelIntroTokens("at"))).toEqual([
      info.say,
      info.say,
      info.word,
      "at",
    ]);
  });
});

describe("sentenceToken", () => {
  it("keeps sentence punctuation and builds a sentence clip key", () => {
    const sentence = { page: 8, words: ["Dan", "is", "a", "man."] };
    expect(sentenceText(sentence.words)).toBe("Dan is a man.");
    expect(sentenceToken("book1", "an", sentence)).toEqual({
      say: "Dan is a man.",
      clip: "sentences/book1-an-page-8",
    });
  });
});
