import type { wordsMatchLevel } from "./word-matcher.ts";

const MAX_MISSING_WORDS = 1;

type EntryMatchLevel =
  | {
      match: "none";
    }
  | {
      match: "some";
      level: number;
    }
  | {
      match: "exact";
    };

export function entryMatcher(
  entry1: string[],
  entry2: string[],
  wordMatcherLevel: typeof wordsMatchLevel,
  isCommonWord: (w: string) => boolean,
): EntryMatchLevel {
  const wordsMatch = (w1: string, w2: string): boolean =>
    ["some", "exact"].includes(wordMatcherLevel(w1, w2).match);

  if (entry1.every((word, idx) => entry2[idx] === word)) {
    return {
      match: "exact",
    };
  }

  if (
    entry1.every((word, idx) => entry2[idx] && wordsMatch(word, entry2[idx]))
  ) {
    return {
      match: "some",
      level: 1,
    };
  }

  const entry1NoCommon = entry1.filter((w) => !isCommonWord(w));
  const entry2NoCommon = entry2.filter((w) => !isCommonWord(w));

  if (
    entry1NoCommon.length === entry2NoCommon.length &&
    entry1NoCommon.every((word) =>
      entry2NoCommon.find((word2) => wordsMatch(word, word2)),
    )
  ) {
    return {
      match: "some",
      level: 2,
    };
  }

  if (
    Math.abs(entry1NoCommon.length - entry2NoCommon.length) <=
      MAX_MISSING_WORDS &&
    (entry1NoCommon.every((word) =>
      entry2NoCommon.find((word2) => wordsMatch(word, word2)),
    ) ||
      entry2NoCommon.every((word) =>
        entry1NoCommon.find((word2) => wordsMatch(word, word2)),
      ))
  ) {
    return {
      match: "some",
      level: 3,
    };
  }

  return {
    match: "none",
  };
}
