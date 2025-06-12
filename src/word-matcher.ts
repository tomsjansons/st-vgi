const MAX_WORD_LEN_DIFF = 2;
const MAX_CHAR_INDEX_DIFF = 2;
const MAX_WRONG_CHARS = 2;

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
  if (word1.length - word2.length > MAX_WORD_LEN_DIFF) {
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

  const nonMatchCharsWord1 = lcWord1Arr.filter(
    (char) => !lcWord2Arr.includes(char),
  );
  const nonMatchCharsWord2 = lcWord2Arr.filter(
    (char) => !lcWord1Arr.includes(char),
  );

  // covers typos
  if (
    (nonMatchCharsWord1.length || nonMatchCharsWord2.length) &&
    nonMatchCharsWord1.length <= MAX_WRONG_CHARS &&
    nonMatchCharsWord2.length <= MAX_WRONG_CHARS
  ) {
    return {
      match: "some",
      level: 4,
    };
  }

  return {
    match: "none",
  };
}
