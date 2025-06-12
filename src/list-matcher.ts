import type { entryMatcher } from "./entry-matcher.ts";
import type { wordsMatchLevel } from "./word-matcher.ts";

export function listMatcher(
  inputListWordSplit: string[][],
  entryMatche: typeof entryMatcher,
  isCommonWord: (w: string) => boolean,
  wordsMatcher: typeof wordsMatchLevel,
) {
  const matchedList = inputListWordSplit.reduce(
    (list, entryWords) => {
      const matchEntryIdx = list.findIndex((listEntry) =>
        ["exact", "some"].includes(
          entryMatche(listEntry[0]!, entryWords, wordsMatcher, (w) =>
            isCommonWord(w),
          ).match,
        ),
      );
      if (matchEntryIdx !== -1) {
        const oldListEntry = list[matchEntryIdx]!;
        oldListEntry.push(entryWords);
      } else {
        list.push([entryWords]);
      }
      return list;
    },
    [] as string[][][],
  );

  return matchedList;
}
