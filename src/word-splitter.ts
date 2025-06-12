export function getPossibleSplits(input: string): string[][] {
  const possibleSplits: string[][] = [];

  const charSplit = input
    .split(/[^a-zA-Z0-9]/)
    .map((word) => word.trim())
    .filter((word) => !!word);

  possibleSplits.push(charSplit);

  const capitalisationSplit = charSplit
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
    !capitalisationSplit.every((word, wordIdx) => word === charSplit[wordIdx])
  ) {
    possibleSplits.push(capitalisationSplit);
  }

  return possibleSplits;
}
