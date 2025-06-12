import { expect, suite, test } from "vitest";
import { entryMatcher } from "./entry-matcher.ts";
import { wordsMatchLevel } from "./word-matcher.ts";

suite("E2E", () => {
  test("Should match", () => {
    const result = entryMatcher(
      ["ABG"],
      ["abigfluffyyak"],
      wordsMatchLevel,
      () => false,
    );
    expect(result).toEqual({
      match: "none",
    });
  });
  test("Should match", () => {
    const result = wordsMatchLevel("ABG", "abigfluffyyak");
    expect(result).toEqual({
      match: "none",
    });
  });
});
