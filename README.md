# Plan and Log

## Pre game plan with assumptions

This section is written before any investigation so some assumptions will be incorrect and some considerations not needed, will review and amend

### Individual components

#### Word matching

- Create a word matching process that matches words by ignoring small inconsistencies
  - Capitalisation (Letter vs letter)
  - Typos
    - Mixed letters (Lettre)
    - Missing letter typos (Leter)
    - Replaced letters (Lstter)
  - Punctuations (Srl vs S.r.l.)
  - Singular/plurals (Letter vs Letters)
  - Possibly other variations after manual review

#### Common word identifier

- Identify common words by examining all words in the input and picking top X num of words or words about recurrence of X times
- Words like Studio, GmbH, Ltd need to be identified and their absence/presence ignored
- Common word list needs to be reviewed manually and exceptions identified and marked - Ubisoft is a significant word that might be recurring multiple times but can't be ignored
- Common word identification needs to be run through word matching
- Consider how to handle geographic location names if time allows

#### Word Identifier

- Identify words by splitting input
  - By space (Split Company Ltd)
  - By capitalisation (SplitCompany Ltd)
  - By non alphanumeric symbols (Split-Company Ltd)

### File read

- Without knowing the size of the input, first attempt naive approach without any perf optimisations
  - Read in the whole file
  - First pass find common words, warn for any new common words that aren't marked as exceptions
  - Second pass all entries and match by stripping common words and applying matching

## Post game

Run with `pnpm run dev https://url-to-file`

### TODOs

- Examine output to identify more improvements. There are a quite a few levers to use in the different matchers to get an acceptable balance but longer investigation would be required
- Improve performance. It can definitely be improved but I like the mantra "make it work, make it right, make it fast". Now when all the edge cases and oddities are understood, the next iteration can be faster
- Manually review and better define the common word list (apparently Aaron is a popular word to use in game studio names in my dev data subset)
- Write more tests - the last fixes are not covered by tests at the moment
