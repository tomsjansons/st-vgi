import { expect, suite, test } from "vitest";
import { listMatcher } from "./list-matcher.ts";

function eeqMatcher(e1: string[], e2: string[]) {
  if (e1[0] === e2[0]) {
    return {
      match: "exact",
    } as const;
  }
  return {
    match: "none",
  } as const;
}

function weqMatcher(w1: string, w2: string) {
  if (w1 === w2) {
    return {
      match: "exact",
    } as const;
  }
  return {
    match: "none",
  } as const;
}

suite("Deduper", () => {
  test("should dedupe", () => {
    const result = listMatcher(
      [
        { orig: "some entry", splits: [["some", "entry"]] },
        { orig: "another entry", splits: [["another", "entry"]] },
        { orig: "some other", splits: [["some", "other"]] },
        { orig: "third entry", splits: [["third", "entry"]] },
      ],
      eeqMatcher,
      () => false,
      weqMatcher,
    );
    expect(result).toEqual([
      {
        firstOrig: "some entry",
        firstWordSplits: [["some", "entry"]],
        possibleMatchesOrig: ["some other"],
        wordSplits: [["some", "other"]],
      },
      {
        firstOrig: "another entry",
        firstWordSplits: [["another", "entry"]],
        possibleMatchesOrig: [],
        wordSplits: [],
      },
      {
        firstOrig: "third entry",
        firstWordSplits: [["third", "entry"]],
        possibleMatchesOrig: [],
        wordSplits: [],
      },
    ]);
  });
  test("should dedupe more variants", () => {
    const result = listMatcher(
      [
        { orig: "some entry", splits: [["some", "entry"]] },
        { orig: "another entry", splits: [["another", "entry"]] },
        { orig: "some other", splits: [["some", "other"]] },
        { orig: "third entry", splits: [["third", "entry"]] },
        { orig: "third other", splits: [["third", "other"]] },
        { orig: "some other other", splits: [["some", "other", "other"]] },
      ],
      eeqMatcher,
      () => false,
      weqMatcher,
    );
    expect(result).toEqual([
      {
        firstOrig: "some entry",
        firstWordSplits: [["some", "entry"]],
        possibleMatchesOrig: ["some other", "some other other"],
        wordSplits: [["some", "other"], ["some", "other", "other"]],
      },
      {
        firstOrig: "another entry",
        firstWordSplits: [["another", "entry"]],
        possibleMatchesOrig: [],
        wordSplits: [],
      },
      {
        firstOrig: "third entry",
        firstWordSplits: [["third", "entry"]],
        possibleMatchesOrig: ["third other"],
        wordSplits: [["third", "other"]],
      },
    ]);
  });
});
