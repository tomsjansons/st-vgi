import { CommonWords } from "./common-words.ts";
import { wordsMatchLevel } from "./word-matcher.ts";
import { getPossibleSplits } from "./word-splitter.ts";

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

console.log(commonWords.isCommonWord("company"));
