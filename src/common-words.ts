import type { wordsMatchLevel } from "./word-matcher.ts";

export class CommonWords {
  static build(
    input: string[][],
    wordMatcher: typeof wordsMatchLevel,
  ): CommonWords {
    const commonWords: [string, number][] = [];
    input.flat().forEach((word) => {
      const idx = commonWords.findIndex(
        ([cw]) =>
          Number.isNaN(Number(word)) &&
          ["exact", "some"].includes(wordMatcher(word, cw).match),
      );
      if (idx != -1) {
        commonWords[idx]![1] += 1;
      } else {
        commonWords.push([word, 1]);
      }
    });
    commonWords.sort((a, b) => b[1] - a[1]);
    return new CommonWords(commonWords, wordMatcher);
  }

  constructor(
    readonly commonWords: [string, number][],
    private readonly wordMatcher: typeof wordsMatchLevel,
  ) {}

  public isCommonWord(word: string): boolean {
    const top = this.commonWords.slice(0, 10);
    return top.some(([cw]) =>
      ["exact", "some"].includes(this.wordMatcher(word, cw).match),
    );
  }

  public getWordRecurrenceCount(word: string): number {
    const cw = this.commonWords.find(([cw]) => cw === word);
    return cw ? cw[1] : 0;
  }
}
