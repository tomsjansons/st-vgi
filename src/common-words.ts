import type { wordsMatchLevel } from "./word-matcher.ts";

export class CommonWords {
  private readonly commonWords: [string, number][] = [];
  constructor(input: string[][], wordMatcher: typeof wordsMatchLevel) {
    input.flat().forEach((word) => {
      const idx = this.commonWords.findIndex(
        ([cw]) =>
          Number.isNaN(Number(word)) &&
          ["exact", "some"].includes(wordMatcher(word, cw).match),
      );
      if (idx != -1) {
        this.commonWords[idx]![1] += 1;
      } else {
        this.commonWords.push([word, 1]);
      }
    });
    this.commonWords.sort((a, b) => b[1] - a[1]);
  }

  public isCommonWord(word: string): boolean {
    return this.commonWords.toSpliced(10).some(([cw]) => cw == word);
  }

  public getWordRecurrenceCount(word: string): number {
    const cw = this.commonWords.find(([cw]) => cw === word);
    return cw ? cw[1] : 0;
  }
}
