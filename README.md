# Plan and Log

## Pre game plan with assumptions

This section is written before any investigation so some assumptions will be incorrect and some considerations not needed, will review and amend

### Individual components

#### Word normalisation

- Create a word normalisation process that matches words by ignoring small inconsistencies
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
- Common word identification needs to be run through word normalisation
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
  - Second pass all entries and match by stripping common words and applying normalisation
