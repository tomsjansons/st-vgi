import { parentPort, workerData } from "node:worker_threads";
import { CommonWords } from "./common-words.ts";
import type { ListEntry } from "./list-matcher.ts";
import type { PosibleSplit } from "./word-splitter.ts";
import { entryMatcher } from "./entry-matcher.ts";
import { listMatcher } from "./list-matcher.ts";
import { wordsMatchLevel } from "./word-matcher.ts";

export type WorkerData =
  | {
      type: "start-common-words";
      inputListWordSplit: PosibleSplit[];
    }
  | {
      type: "start-chunks";
      commonWords: [string, number][];
      inputListWordSplit: PosibleSplit[];
    };

export type WorkerMessage =
  | {
      type: "common-words-done";
      commonWords: [string, number][];
    }
  | {
      type: "chunk-done";
      listChunk: Map<string, ListEntry>;
    };

function runChunk(
  inputListWordSplit: PosibleSplit[],
  commonWords: CommonWords,
): Map<string, ListEntry> {
  const matchedList = listMatcher(
    inputListWordSplit,
    entryMatcher,
    (w) => commonWords.isCommonWord(w),
    wordsMatchLevel,
  );

  return matchedList.reduce(
    (map, entry) => map.set(entry.firstOrig, entry),
    new Map<string, ListEntry>(),
  );
}

const wData: WorkerData = workerData;
if (wData.type === "start-common-words") {
  const resp: WorkerMessage = {
    type: "common-words-done",
    commonWords: CommonWords.build(
      wData.inputListWordSplit.map((ws) => ws.splits).flat(),
      wordsMatchLevel,
    ).commonWords,
  };
  parentPort?.postMessage(resp);
}
if (wData.type === "start-chunks") {
  const resp: WorkerMessage = {
    type: "chunk-done",
    listChunk: runChunk(
      wData.inputListWordSplit,
      new CommonWords(wData.commonWords, wordsMatchLevel),
    ),
  };
  parentPort?.postMessage(resp);
}
