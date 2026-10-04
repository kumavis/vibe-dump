# Research — work in progress

See [`../DESIGN.md`](../DESIGN.md) for what this material is for.

Raw material for the Hawaiian cut of Jukugo Tumble. Not an app yet: there is
no `package.json` here, so the gallery build skips this directory.

- `fetch-lemmas.py` — pulls every page in Wiktionary's *Category:Hawaiian
  lemmas* (3,089 at the time of writing) into `lemmas.json`.
- `fetch-definitions.py` — keeps the lowercase headwords that split into
  exactly two morae (`[hklmnpwʻ]?[aeiouāēīōū]` × 2), fetches each page's
  Hawaiian section and boils it down to senses, Proto-Polynesian etymon,
  cognates and borrowing notes.
- `two-mora-candidates.json` — the result: 563 candidates (plus four added by
  hand and marked as such). Unreviewed — it still contains loanwords,
  grammatical words and a few words that must never be shown.
- `type-specimen.png` — Alegreya, Alegreya Sans, Source Serif 4, Spectral and
  Gentium Book Plus set as carved syllables. Jost and Fraunces were dropped:
  neither has the ʻokina (U+02BB).
