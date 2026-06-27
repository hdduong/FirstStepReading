import { describe, expect, it } from "vitest";
import { C } from "../theme.js";
import { familyForWord, familyRimeColor } from "./familyColors.js";

describe("family colors", () => {
  it("keeps -an and -at visually distinct", () => {
    expect(familyRimeColor("an")).toBe(C.red);
    expect(familyRimeColor("at")).toBe(C.green);
  });

  it("falls back to -at when a word appears inside the -an lesson", () => {
    expect(familyForWord("rat", "an")).toBe("at");
  });

  it("does not fall back to -at outside the explicit -an/-at color lessons", () => {
    expect(familyForWord("Mat", "am")).toBeUndefined();
  });
});
