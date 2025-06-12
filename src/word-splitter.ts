function cleanup(input: string): string {
  let output = input.replaceAll(". ", " ");
  output = input.replaceAll("&amp;", "&");
  output = input.replaceAll(",", " ");
  output = input.replaceAll(".", "");
  return output;
}

export type PosibleSplit = {
  orig: string;
  splits: string[][];
};
export function getPossibleSplits(orig: string): PosibleSplit {
  const possibleSplits: string[][] = [];
  const input = cleanup(orig);

  const spaceSplit = input
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => !!word);

  possibleSplits.push(spaceSplit);

  const capitalisationSplit = spaceSplit
    .map((word) => {
      let wordsRemain = word;
      const wordSplits: string[] = [];

      const oneCapLetterAfterLowLetter = /(?<=[a-z])[A-Z](?![A-Z])/;

      for (
        let splitAtIdx = wordsRemain.search(oneCapLetterAfterLowLetter);
        splitAtIdx != -1;
        splitAtIdx = wordsRemain.search(oneCapLetterAfterLowLetter)
      ) {
        wordSplits.push(wordsRemain.slice(0, splitAtIdx));
        wordsRemain = wordsRemain.slice(splitAtIdx);
      }
      wordSplits.push(wordsRemain);
      return wordSplits;
    })
    .flat();

  if (
    !capitalisationSplit.every((word, wordIdx) => word === spaceSplit[wordIdx])
  ) {
    possibleSplits.push(capitalisationSplit);
  }

  return {
    orig,
    splits: possibleSplits,
  };
}
