import { describe, expect, it } from "vitest";
import { C } from "../theme.js";
import { familyForWord, familyRimeColor } from "./familyColors.js";

describe("family colors", () => {
  it("keeps -an and normal -at rimes in their original color", () => {
    expect(familyRimeColor("an")).toBe(C.red);
    expect(familyRimeColor("at", "at")).toBe(C.red);
  });

  it("uses green for -at only when it appears inside the -an lesson", () => {
    expect(familyRimeColor("at", "an")).toBe(C.green);
  });

  it("falls back to -at when a word appears inside the -an lesson", () => {
    expect(familyForWord("rat", "an")).toBe("at");
  });

  it("does not fall back to -at outside the explicit -an/-at color lessons", () => {
    expect(familyForWord("Mat", "am")).toBeUndefined();
  });
});
