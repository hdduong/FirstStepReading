import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../data/index.js";
import { bookPageImageSrc } from "./bookPageImages.js";

const book1 = BOOKS.find((book) => book.id === "book1");

function imagePathFromSrc(src) {
  return fileURLToPath(new URL(`../../public${src}`, import.meta.url));
}

describe("bookPageImageSrc", () => {
  it("maps Book 1 sentence pages to the next PDF artwork page", () => {
    expect(bookPageImageSrc("book1", 2)).toBe(
      "/images/book1/pages/page-003.webp",
    );
    expect(bookPageImageSrc("book1", 3)).toBe(
      "/images/book1/pages/page-004.webp",
    );
    expect(bookPageImageSrc("book1", 4)).toBe(
      "/images/book1/pages/page-005.webp",
    );
    expect(bookPageImageSrc("book1", 5)).toBe(
      "/images/book1/pages/page-006.webp",
    );
    expect(bookPageImageSrc("book1", 6)).toBe(
      "/images/book1/pages/page-007.webp",
    );
  });

  it("has artwork for every Book 1 read sentence except the final end card", () => {
    const missing = [];
    const duplicateImages = [];
    const seen = new Set();

    for (const lesson of book1.lessons) {
      for (const sentence of lesson.sentences) {
        const src = bookPageImageSrc(book1.id, sentence.page);

        if (sentence.page === 92) {
          expect(src).toBeNull();
          continue;
        }

        const expectedSrc = `/images/book1/pages/page-${String(
          sentence.page + 1,
        ).padStart(3, "0")}.webp`;

        expect(src).toBe(expectedSrc);

        if (!existsSync(imagePathFromSrc(src))) {
          missing.push(`${lesson.id} page ${sentence.page}: ${src}`);
        }
        if (seen.has(src)) duplicateImages.push(src);
        seen.add(src);
      }
    }

    expect(missing).toEqual([]);
    expect(duplicateImages).toEqual([]);
  });
});
