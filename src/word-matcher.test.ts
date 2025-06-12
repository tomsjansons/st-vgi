import { expect, suite, test } from "vitest";
import { wordsMatchLevel } from "./word-matcher.ts";

suite("Word matcher", () => {
  test("Should not match if length is off by more than 2", () => {
    const result = wordsMatchLevel("donot", "matchatall");
    expect(result).toEqual({ match: "none" });
  });

  test("Should not match different words", () => {
    let result = wordsMatchLevel("myths", "tchotchkes");
    expect(result).toEqual({ match: "none" });

    result = wordsMatchLevel("Venture", "Averrum");
    expect(result).toEqual({ match: "none" });
  });

  test("Should match if identical", () => {
    const result = wordsMatchLevel("word", "word");
    expect(result).toEqual({ match: "exact" });
  });

  test("Should match case", () => {
    const result = wordsMatchLevel("word", "Word");
    expect(result).toEqual({ match: "some", level: 1 });
  });

  test("Should match mixed letters", () => {
    let result = wordsMatchLevel("wrod", "word");
    expect(result).toEqual({ match: "some", level: 2 });

    result = wordsMatchLevel("wrod", "Word");
    expect(result).toEqual({ match: "some", level: 2 });

    result = wordsMatchLevel("space", "casep");
    expect(result).toEqual({ match: "none" });
  });

  test("Should not match anagram", () => {
    const result = wordsMatchLevel("space", "casep");
    expect(result).toEqual({ match: "none" });
  });

  test("Should match numbers exactly", () => {
    const result = wordsMatchLevel("404", "4040");
    expect(result).toEqual({ match: "none" });
  });

  // test("Should match wrong letters", () => {
  //   let result = wordsMatchLevel("wotd", "word");
  //   expect(result).toEqual({ match: "some", level: 4 });
  //
  //   result = wordsMatchLevel("wotd", "Word");
  //   expect(result).toEqual({ match: "some", level: 4 });
  // });
});
