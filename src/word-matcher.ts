const MAX_WORD_LEN_DIFF = 2;
const MIN_WORD_MATCHING_LEN = 5;
const MAX_CHAR_INDEX_DIFF = 2;

type WordMatchLevel =
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
export function wordsMatchLevel(word1: string, word2: string): WordMatchLevel {
  if (Math.abs(word1.length - word2.length) > MAX_WORD_LEN_DIFF) {
    return {
      match: "none",
    };
  }
  if (word1 === word2) {
    return {
      match: "exact",
    };
  }

  const lcWord1 = word1.toLocaleLowerCase();
  const lcWord2 = word2.toLocaleLowerCase();
  if (lcWord1 === lcWord2) {
    return {
      match: "some",
      level: 1,
    };
  }

  if (!Number.isNaN(Number(word1)) || !Number.isNaN(Number(word2))) {
    return {
      match: "none",
    };
  }

  if (
    word1.length <= MIN_WORD_MATCHING_LEN ||
    word2.length <= MIN_WORD_MATCHING_LEN
  ) {
    return {
      match: "none",
    };
  }

  const lcWord1Arr = lcWord1.split("");
  const lcWord2Arr = lcWord2.split("");

  // covers missed or extra characters
  // covers switched characters
  // covers plurals
  // checking index diff to avoid false positive for anagrams
  if (
    lcWord1Arr.every((char1, idx1) =>
      lcWord2Arr.find(
        (char2, idx2) =>
          char1 === char2 && Math.abs(idx1 - idx2) <= MAX_CHAR_INDEX_DIFF,
      ),
    ) ||
    lcWord2Arr.every((char2, idx2) =>
      lcWord1Arr.find(
        (char1, idx1) =>
          char1 === char2 && Math.abs(idx1 - idx2) <= MAX_CHAR_INDEX_DIFF,
      ),
    )
  ) {
    return {
      match: "some",
      level: lcWord1.length === lcWord2.length ? 2 : 3,
    };
  }

  return {
    match: "none",
  };
}
