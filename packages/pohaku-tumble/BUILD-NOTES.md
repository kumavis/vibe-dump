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
  - no English from the F1 banned list in any gloss, and one (US) spelling
    across all glosses;
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

These are the build reviews' choices. Each one is measured in `tools/sim.mjs`
or in Chromium screenshots.

**Board and engine** (DESIGN §1 carries Jukugo's machine over unchanged; these
are additions on top of it):

- **The upland and the compass are kept clear.** No stone, caption or line
  enters the upland (DESIGN §3.2 asks this of the drawing). Words keep 1.12 × r
  from the compass centre. Words round a small place may hide at most 15% of
  it (20% of the lava). The result is about 40 words on an 8 × 7 grid: 28% of
  cells stay empty, against Jukugo's 8%. The board is sparser than Jukugo's.
- **Fewer repeats of one root.** At most 3 stones show one root in the opening.
  Turns avoid putting a root on a 5th stone when another turn exists
  (`FACES {deal: 3, turn: 4}`). This is only a preference among legal turns.
  Full repeats are capped at 1 pair in 16 in the opening, and never side by
  side.
- **The rest before a return is 60 s per pair.** ENGINE.md recommended 6 s and
  its critic 20–30 s. The background beat slows on small screens
  (`CROWD = 10`): about 35 turns a minute on a phone, against Jukugo's pace.
  Set CROWD to 0 for Jukugo's absolute pace.
- **Notes.** A pair that cannot turn twice gets no card.
- **Sim rating.** `tools/sim.mjs` rates every view JUKUGO-LIKE: harness,
  1280 × 800, 390 × 844 and 844 × 390. In-view linked share is about .47, a
  little under Jukugo's .50, which is the cost of the variety rules.

**Camera and chrome:**

- **The camera loops instead of drifting round the middle.** Its centre goes
  round a rounded rectangle clockwise from the north, past the compass first,
  with Jukugo's drift on top at 0.4 of its size. A lap takes 330 s or more,
  with speed capped at 0.35 units/s. Every place comes into view within about
  4 minutes on every screen; before this, phones never saw the compass. Bare
  table shows past the sheet's border at the loop's corners.
- **At laptop height (521–919 px tall) the title plate lies flat.** The
  sentence sits beside the name, and the legend splits into two columns, so the
  plates stay out of the band the engine treats as in view. Phones drop the
  sentence and the cards' "was" line, as in Jukugo. Their legend reads
  "awaiting check".

**Cards** (DESIGN §1 carries Jukugo's scramble over):

- **Ancestors and cognates fade out and back instead of scrambling.** No
  false form such as "*afu" shows, even for a frame. English glosses flicker
  only through a–z, and Hawaiian words only through Hawaiian letters.
- **A fresh card marks the stone likely to turn first** and shows its
  cognates.
- **Empty slots.** An empty sense or cognate line shows "—". A fresh card
  reads "was —".
- **Placement.** Each card has six possible places: the four corners, plus
  level with its word on either side.

**Stones and floor:**

- **The sun.** It is 42° up, from the west and 12° toward the north. One light
  draws the stones, the letters' inner shadows and the floor shadows (DESIGN
  §5 "raking"; Jukugo's sun is about 57°). For more rake, 38° is the fallback;
  35° ran shadows across whole gaps.
- **Map line weights.** The coast is drawn in ink-2 at 1.2 px, so it doesn't
  read as a shared-root line. Dashed half-interval contours sit inside the
  upland, so it reads as a summit rather than a lake. These are still contours
  only (§3.2).

**Gallery:** the thumbnail waits for `body.opened`, meaning every opening line
is in and the first card is open, then settles for 3 s. DESIGN §9 named
`body.ready`.

**Data:**

- **Cognates withheld.** Four cognates are not printed because the same form,
  in POLLEX's own data for that language, carries an excretory or genital
  sense: Māori tē and tā, Māori aro, Tongan ʻao and Tongan fulu. Sensitive
  forms can sit beside an innocent stone this way, so the kumu read should
  cover the cognates too.
- **LOLE joins "cloth" and "reversed"** on a hedged Wiktionary etymology. It
  stays one stone until Pukui & Elbert show whether these are two entries.

## Open for the owner

- The Pukui & Elbert check. It decides the 370 pending words and many stone
  senses. `research/engine/lexicon-structure/bridges.tsv` orders it by how much
  each word matters to the board.
- A kumu or fluent reader. They should hear the default rulings, the
  unresolved stones, and the words DECISIONS sends to them (E2, D1, the A gates).
- DESIGN's status line and its broken examples (above).
