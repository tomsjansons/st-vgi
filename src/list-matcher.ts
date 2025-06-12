import type { PosibleSplit } from "./word-splitter.ts";
import type { entryMatcher } from "./entry-matcher.ts";
import type { wordsMatchLevel } from "./word-matcher.ts";

type ListEntry = {
  firstOrig: string;
  firstWordSplits: string[][];
  possibleMatchesOrig: string[];
  wordSplits: string[][];
};

export function listMatcher(
  inputListWordSplit: PosibleSplit[],
  entryMatche: typeof entryMatcher,
  isCommonWord: (w: string) => boolean,
  wordsMatcher: typeof wordsMatchLevel,
): ListEntry[] {
  const matchedList = inputListWordSplit.reduce((list, entryPossibleSplit) => {
    const matchEntryIdx = list.findIndex((listEntry) =>
      listEntry.firstWordSplits.some((wordSplits) =>
        entryPossibleSplit.splits.some((wordSplitsOther) =>
          ["exact", "some"].includes(
            entryMatche(wordSplits, wordSplitsOther, wordsMatcher, (w) =>
              isCommonWord(w),
            ).match,
          ),
        ),
      ),
    );
    if (matchEntryIdx !== -1) {
      const oldListEntry = list[matchEntryIdx]!;
      oldListEntry.possibleMatchesOrig.push(entryPossibleSplit.orig);
      oldListEntry.wordSplits.push(...entryPossibleSplit.splits);
    } else {
      list.push({
        firstOrig: entryPossibleSplit.orig,
        firstWordSplits: entryPossibleSplit.splits,
        possibleMatchesOrig: [],
        wordSplits: [],
      });
    }
    return list;
  }, [] as ListEntry[]);

  return matchedList;
}
