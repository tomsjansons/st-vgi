import { CommonWords } from "./common-words.ts";
import { expect, suite, test } from "vitest";

suite("Common words", () => {
  test("Should count words", () => {
    const input = [
      ["apple", "banana", "cherry"],
      ["dog", "cat", "bird"],
      ["red", "blue", "green"],
      ["apple", "orange", "grape"],
      ["car", "bike", "train"],
      ["book", "moon", "star"],
      ["dog", "fish", "rabbit"],
      ["book", "pen", "paper"],
      ["apple", "cherry", "leaf"],
      ["green", "bird", "earth"],
      ["cat", "mouse", "cheese"],
      ["phone", "computer", "tablet"],
      ["red", "blue", "purple"],
      ["house", "door", "bird"],
      ["dog", "green", "park"],
      ["red", "dance", "cherry"],
      ["apple", "banana", "sweet"],
      ["ocean", "wave", "banana"],
      ["cat", "yarn", "play"],
      ["book", "blue", "read"],
    ];
    const commonWords = new CommonWords(input, (w1, w2) => {
      if (w1 === w2) {
        return {
          match: "exact",
        };
      }
      return {
        match: "none",
      };
    });

    expect(commonWords.isCommonWord("apple")).toBe(true);
    expect(commonWords.isCommonWord("dog")).toBe(true);
    expect(commonWords.isCommonWord("cat")).toBe(true);
    expect(commonWords.isCommonWord("red")).toBe(true);
    expect(commonWords.isCommonWord("book")).toBe(true);
    expect(commonWords.isCommonWord("play")).toBe(false);

    expect(commonWords.getWordRecurrenceCount("apple")).toBe(4);
    expect(commonWords.getWordRecurrenceCount("dog")).toBe(3);
    expect(commonWords.getWordRecurrenceCount("cat")).toBe(3);
    expect(commonWords.getWordRecurrenceCount("red")).toBe(3);
    expect(commonWords.getWordRecurrenceCount("book")).toBe(3);
    expect(commonWords.getWordRecurrenceCount("play")).toBe(1);
    expect(commonWords.getWordRecurrenceCount("noooo")).toBe(0);
  });
});
