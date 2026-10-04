# Research — work in progress

See [`../DESIGN.md`](../DESIGN.md) for what this material is for.

Raw material for the Hawaiian cut of Jukugo Tumble. Not an app yet: there is
no `package.json` here, so the gallery build skips this directory.

## Findings

- [`ROOTS.md`](./ROOTS.md) — can two-root compounds (option B) carry the piece?
  The sources, the candidate list, a simulation on Jukugo's real `Board`, what
  it means for the design, and how to run the Pukui & Elbert check that decides
  it.
- [`TERMS.md`](./TERMS.md) / [`terms.json`](./terms.json) — every Hawaiian term
  on the map and star compass, checked against the Polynesian Voyaging
  Society's material, National Park Service and UH sources, Wiktionary and
  Andrews–Parker. Includes all 32 star-compass houses with bearings.

- [`STRUCTURE.md`](./STRUCTURE.md): a structural-linguistics analysis of Hawaiian.
  It asks where a form difference carries a systematic meaning difference, so that
  swapping one unit in a slot means something, as a kanji tumble does. It confirms
  that ʻokina or kahakō switches are arbitrary in the open vocabulary. It maps the
  frames that do work: head + modifier (compounds and phrases), and the closed
  grammatical grids. Working notes are in [`structure/`](./structure). Research
  only.
- [`review/`](./review): the word-by-word review of the 905 candidate compounds,
  with verdicts, spellings, root senses and glosses. It includes a blind second
  reading (90% agreement on which words survive) and the list of decisions it
  raised for the owner and a kumu ([`review/DECISIONS.md`](./review/DECISIONS.md)).

## Option B: roots

- [`roots/compounds.tsv`](./roots/compounds.tsv) — 1,112 candidate compounds
  with evidence, flags, root senses, Andrews–Parker's etymology, and blank
  columns for the Pukui & Elbert check.
- [`roots/roots.tsv`](./roots/roots.tsv) — the 476 roots the candidates use,
  with their homographs, Proto-Polynesian protoforms, and a spelling check
  against Pukui & Elbert via POLLEX.
- [`roots/viability.tsv`](./roots/viability.tsv) — the simulation results.
- `roots/*.py`, `roots/fetch_sources.sh`, `roots/sim/` — rebuild all of it
  (see ROOTS.md, "Rebuilding").
- [`pollex/`](./pollex) — the POLLEX-Online crawler (2,258 Hawaiian reflexes,
  98% cited to Pukui & Elbert). Its data stays in `roots/.cache/pollex/` (no
  open licence). It gives `pe_via_pollex` in both tables.

## Option A: syllables

- `fetch-lemmas.py` — pulls every page in Wiktionary's *Category:Hawaiian
  lemmas* (3,089 at the time of writing) into `lemmas.json`.
- `fetch-definitions.py` — fetches each two-mora headword's Hawaiian section and
  boils it down to senses, Proto-Polynesian etymon, cognates and borrowing
  notes. It reads a `two.json` (the lemmas filtered to
  `[hklmnpwʻ]?[aeiouāēīōū]` × 2) that no committed script writes. The step from
  its `compact.json` to the file below wasn't committed either.
- `two-mora-candidates.json` — the result: 563 candidates. Unreviewed — it
  still contains loanwords, grammatical words and a few words that must never
  be shown. The four words meant to be added by hand (ʻalā, koʻi, moi, lāʻī)
  are not in it.
- `type-specimen.png` — Alegreya, Alegreya Sans, Source Serif 4, Spectral and
  Gentium Book Plus set as carved syllables. These are flat glyphs, not pecked
  under raking light, so the font question is still open. Jost and Fraunces
  were dropped: neither has the ʻokina (U+02BB).
