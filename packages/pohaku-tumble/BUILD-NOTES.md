# Pōhaku Tumble — build notes

The owner approved the root-pair design (DESIGN §2 option B): two-root words, one
word or two, full repeats included. This file records what the build decided
where DESIGN or the research left a choice open, and where the build departs
from DESIGN. **None of it changes DESIGN.md.** Every item is a default, and the
owner can reverse any of them.

How the code fits together is in [ARCHITECTURE.md](./ARCHITECTURE.md). How the
word list is made is in [research/review/README.md](./research/review/README.md).

## The words

- **598 words, 436 stones.** 228 words are confirmed, by two independent sources
  or by Pukui & Elbert through POLLEX. 370 still await the Pukui & Elbert check;
  each of these carries a ◦ on its card, explained in the legend. 129 of the
  words are full repeats (ʻELE·ʻELE). 423 words are playable, meaning they sit in
  the 2-core of the turn graph.
- **One stone is one root in one sense, by etymon.** POLLEX sets decide what
  counts as one root; lettered sub-sets of one set are one root (DECISIONS B8/B9,
  option 1). So *hua* "fruit" and *hua* "word" are two stones, and *lā* "sun" and
  *lā* "day" are one. 31 stones are unresolved, because the sources disagree on
  which root the word uses. Each is a stone of its own that never links. Its
  card shows "—" unless a curator gave a reading.
- **Rulings.** DECISIONS.md's recommendations are applied as **defaults**
  (`research/review/overrides.json`). Every entry is marked "Default ruling
  (owner has not ruled)". The owner and a kumu decide A1–A17, B1–B12, C1–C7,
  D1–D3, E1–E4 and F1–F5. The two that move the most words:
  - A3, A4, A10 and A13 clear the root-level flags on LĀʻAU, PIʻI, HUNA and KAPA,
    because the sensitive sense is a different etymon and is never printed;
  - B6, one form per word: a word that ships as a doubled pair (ʻELE·ʻELE) is
    never also a single stone in another word, so *waiʻeleʻele* gives way. This
    drops 21 words.
- **Never an opening word.** 100 words are never dealt at the start, but can
  still be reached by a turn:
  - E1 death, burial, disease and disability words;
  - E3 war words;
  - (build default) the 19th- and 20th-century coinages for introduced things.
    The first view is then the older vocabulary, and "garage" arrives only by a
    turn.
- **Checks the build enforces** (`research/roots/build_words.py`):
  - the two stones must spell the word;
  - no apostrophe of any kind, and no non-NFC text, in any field: words, stone
    spellings, glosses, ancestors or cognates. Eleven English glosses were
    rephrased to avoid an English ’ beside an ʻokina;
  - no English from the F1 banned list in any gloss;
  - ancestors only at the levels Hawaiian descends from: PPN, PNP, PCE, PEP, PMQ.
    POLLEX's EC is Ellicean, so five stones print no ancestor.

## DESIGN's own examples that the evidence overturns (F4)

DESIGN §2 and §4.5 use two chains that the curated data does not support:

- *waiwai* "wealth" is WAI "keep, retain" (PPN *qai) doubled, not WAI "water".
  So WAI·MAKA → WAI·WAI joins two different roots.
- *kahawai* "stream" no longer shares a stone with *kahakai*, because the KAHA of
  *kahawai* is unsettled ("place" or "cut"). So KAHA·KAI → KAHA·WAI is not a
  turn.

Proposed replacements, all confirmed words in the shipped list (owner to choose):

- WAI·MAKA "tears" → WAI·Ū "milk" → WAI·LELE "waterfall": one stone stays put
  while the other turns.
- KAHA·KAI "seashore" → PAʻA·KAI "salt" → PAʻA·NAʻAU "known by heart": the stone
  that stays switches sides each turn.
- PŌ·ʻELE "dark night" → ʻELE·ʻELE "black": a turn into a full repeat.

## Where the build departs from DESIGN

<!-- filled from the polish workflow's owner decisions -->

## Open for the owner

- The Pukui & Elbert check. It decides the 370 pending words and many stone
  senses. `research/engine/lexicon-structure/bridges.tsv` orders it by how much
  each word matters to the board.
- A kumu or fluent reader. They should hear the default rulings, the
  unresolved stones, and the words DECISIONS sends to them (E2, D1, the A gates).
- DESIGN's status line and its broken examples (above).
