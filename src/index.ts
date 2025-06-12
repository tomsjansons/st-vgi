import type { WorkerData, WorkerMessage } from "./worker.ts";
import { type ListEntry } from "./list-matcher.ts";
import { Worker } from "worker_threads";
import { getPossibleSplits } from "./word-splitter.ts";
import { join } from "path";

const fileUrl = process.argv[2];

if (!fileUrl) {
  throw new Error("Expected input file url as the first param");
}

const inputContents = await fetch(fileUrl);

const inputList = (await inputContents.text()).split("\n");
console.log("Read successful, received ", inputList.length);

const inputListWordSplit = inputList.map((entry) => getPossibleSplits(entry));

console.log("Word split list", inputListWordSplit.length);

// the processing takes ages so all the work is split into
// chunks of 2000 and processed in parallel
// there are two main steps
// - build up common word list
// - match entries
// each of those is done in a separate loop and later the results
// are stiched together
const CHUNK_SIZE = 2000;
const workerLoc = join(process.cwd(), "./src/worker.js");

const commonWordPromisses: Promise<[string, number][]>[] = [];
for (
  let chunkStart = 0;
  chunkStart <= inputListWordSplit.length;
  chunkStart += CHUNK_SIZE
) {
  console.log("Common words worker with offset", chunkStart);

  const workerData: WorkerData = {
    type: "start-common-words",
    inputListWordSplit: inputListWordSplit.slice(
      chunkStart,
      chunkStart + CHUNK_SIZE,
    ),
  };
  const worker = new Worker(workerLoc, {
    workerData,
  });
  commonWordPromisses.push(
    new Promise<[string, number][]>((resolve, reject) =>
      worker.on("message", (message: WorkerMessage) => {
        if (message.type !== "common-words-done") {
          reject(new Error("Unexpected"));
          return;
        }
        console.log("Common words worker with offset done", chunkStart);
        resolve(message.commonWords);
      }),
    ),
  );
}

const commonWordsCunks = await Promise.all(commonWordPromisses);
const commonWords: [string, number][] = [];
for (const chunk of commonWordsCunks) {
  for (const [word, count] of chunk) {
    const idx = commonWords.findIndex(([cw]) => cw === word);
    if (idx !== -1) {
      commonWords[idx]![1] += count;
    } else {
      commonWords.push([word, count]);
    }
  }
}

console.log("common words stiched", commonWords.length);

const resultPromisses: Promise<Map<string, ListEntry>>[] = [];
for (
  let chunkStart = 0;
  chunkStart <= inputListWordSplit.length;
  chunkStart += CHUNK_SIZE
) {
  console.log("Worker with offset", chunkStart);

  const workerData: WorkerData = {
    type: "start-chunks",
    inputListWordSplit: inputListWordSplit.slice(
      chunkStart,
      chunkStart + CHUNK_SIZE,
    ),
    commonWords,
  };
  const worker = new Worker(workerLoc, {
    workerData,
  });
  resultPromisses.push(
    new Promise<Map<string, ListEntry>>((resolve, reject) =>
      worker.on("message", (message: WorkerMessage) => {
        if (message.type !== "chunk-done") {
          reject(new Error("Unexpected"));
          return;
        }
        console.log("Worker with offset done", chunkStart);
        resolve(message.listChunk);
      }),
    ),
  );
}

const allChunks = await Promise.all(resultPromisses);

const allChunksCombined = new Map<string, ListEntry>();
for (const chunk of allChunks) {
  for (const entry of chunk) {
    if (
      entry[1].possibleMatchesOrig.every(
        (possibleEntry) => !allChunksCombined.has(possibleEntry),
      )
    ) {
      allChunksCombined.set(...entry);
    }
  }
}

console.log("Map entries", allChunksCombined.size);

const dedupedList = [...allChunksCombined.values()].filter(
  (entry) => entry.possibleMatchesOrig.length > 0,
);

dedupedList.forEach((entry) => {
  console.log(entry.firstOrig, entry.possibleMatchesOrig);
});
console.log(dedupedList.length);
