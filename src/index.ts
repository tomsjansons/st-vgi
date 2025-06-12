import { CommonWords } from "./common-words.ts";
import { entryMatcher } from "./entry-matcher.ts";
import { getPossibleSplits } from "./word-splitter.ts";
import { listMatcher } from "./list-matcher.ts";
import { wordsMatchLevel } from "./word-matcher.ts";

const fileUrl = process.argv[2];

if (!fileUrl) {
  throw new Error("Expected input file url as the first param");
}

const inputContents = await fetch(fileUrl);

const inputList = (await inputContents.text()).split("\n");
console.log("Read successful, received ", inputList.length);

const inputListWordSplit = inputList.map((entry) => getPossibleSplits(entry));

console.log("Word split list", inputListWordSplit.length);

const commonWords = new CommonWords(
  inputListWordSplit.map((ws) => ws.splits).flat(),
  wordsMatchLevel,
);

const matchedList = listMatcher(
  inputListWordSplit,
  entryMatcher,
  (w) => commonWords.isCommonWord(w),
  wordsMatchLevel,
);

const dedupedList = matchedList.filter(
  (entry) => entry.possibleMatchesOrig.length > 1,
);

console.log(dedupedList);
console.log(dedupedList.length);
