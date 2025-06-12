import { CommonWords } from "./common-words.ts";
import { getPossibleSplits } from "./word-splitter.ts";
import { wordsMatchLevel } from "./word-matcher.ts";
import { entryMatcher } from "./entry-matcher.ts";
import { listMatcher } from "./list-matcher.ts";

const fileUrl = process.argv[2];

if (!fileUrl) {
  throw new Error("Expected input file url as the first param");
}

const inputContents = await fetch(fileUrl);

const inputList = (await inputContents.text()).split("\n");
console.log("Read successful, received ", inputList.length);

const inputListWordSplit = inputList
  .map((entry) => getPossibleSplits(entry))
  .flat(1);

const commonWords = new CommonWords(inputListWordSplit, wordsMatchLevel);

const matchedList = listMatcher(
  inputListWordSplit,
  entryMatcher,
  (w) => commonWords.isCommonWord(w),
  wordsMatchLevel,
).filter((entry) => entry.length > 1);

const dedupedList = matchedList; //.filter((e) => e.length > 1);

console.log(dedupedList);
console.log(dedupedList.length);
