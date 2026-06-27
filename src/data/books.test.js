import { describe, it, expect } from "vitest";
import { BOOKS } from "./index.js";
import { vowelOf, cleanWord } from "../lib/phonics.js";
import { familyForWord } from "../lib/familyColors.js";

// Content invariants: these guard the lesson data as Books 2 & 3 get filled in,
// catching transcription mistakes (a word that doesn't match its family, a
// duplicate page, a missing picture, etc.) automatically.

describe("BOOKS", () => {
  it("has the three FirstStepReading books with stable ids", () => {
    expect(BOOKS.map((b) => b.id)).toEqual(["book1", "book2", "book3"]);
  });

  it("each book has a theme", () => {
    for (const b of BOOKS) expect(b.theme).toBeTruthy();
  });
});

const playable = BOOKS.filter((b) => b.lessons.length > 0);

describe.each(playable)("$id — $theme", (book) => {
  it("has unique lesson ids", () => {
    const ids = book.lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every family is a short-vowel rime (vowel-first, 2+ letters)", () => {
    for (const l of book.lessons) {
      expect(l.family.length).toBeGreaterThanOrEqual(2);
      expect("aeiou").toContain(vowelOf(l.family));
    }
  });

  it("every word ends in its family (so sound-out & coloring stay correct)", () => {
    const bad = [];
    for (const l of book.lessons) {
      for (const w of l.words) {
        const fam = w.family || l.family;
        if (!cleanWord(w.word).toLowerCase().endsWith(fam)) {
          bad.push(`${l.id}: "${w.word}" should end in -${fam}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it("every word has a non-empty picture", () => {
    for (const l of book.lessons) {
      for (const w of l.words) expect(w.pic).toBeTruthy();
    }
  });

  it("every lesson has at least one sight word", () => {
    for (const l of book.lessons) expect(l.sight.length).toBeGreaterThan(0);
  });

  it("every sentence has a numeric page and at least one word", () => {
    for (const l of book.lessons) {
      for (const s of l.sentences) {
        expect(typeof s.page).toBe("number");
        expect(s.words.length).toBeGreaterThan(0);
      }
    }
  });

  it("has no duplicate sentence pages", () => {
    const pages = book.lessons.flatMap((l) => l.sentences.map((s) => s.page));
    expect(new Set(pages).size).toBe(pages.length);
  });
});

describe("Book 1 text fixes", () => {
  it("uses singular rat on the -an story page 10", () => {
    const book1 = BOOKS.find((b) => b.id === "book1");
    const anLesson = book1.lessons.find((l) => l.id === "an");
    const page10 = anLesson.sentences.find((s) => s.page === 10);

    expect(page10.words).toEqual([
      "Dan",
      "has",
      "a",
      "pan.",
      "Dan",
      "said,",
      "“Not",
      "rat!”",
    ]);
  });

  it("uses Dad on the Dad's Bag page 18 so -ad colors correctly", () => {
    const book1 = BOOKS.find((b) => b.id === "book1");
    const dadsBagLesson = book1.lessons.find((l) => l.id === "dadsbag");
    const page18 = dadsBagLesson.sentences.find((s) => s.page === 18);

    expect(page18.words).toEqual(["Mat", "has", "Dad", "bag.", "Mat", "wags."]);
    expect(familyForWord("Dad", dadsBagLesson.family)).toBe("ad");
  });
});
