# Word-by-word review of the 905 candidate compounds

Research for DESIGN §2 option B. Nothing here is decided. The design owner, then a kumu, make the calls listed in [`DECISIONS.md`](./DECISIONS.md).

## What was done

1. **First reading.** Agents reviewed every candidate in `../roots/compounds.tsv` that survived the automated screen: 905 words, in 46 batches of about 20. Each read the word's evidence dossier (`../roots/build_dossiers.py`):
   - Wiktionary entries for the compound and both roots, with homograph ids;
   - Andrews–Parker 1922 entries;
   - POLLEX (Pukui & Elbert-sourced) reflexes;
   - Hawaiian Wikipedia sentences.

   Where doubt remained, they also searched reputable web sources: UH, Kamehameha Schools, OHA, PVS, NPS, State agencies. wehewehe.org and every mirror of its dictionaries were off limits and were not opened.

   For each word they recorded:
   - whether it is a real compound of those two roots;
   - its modern spelling and word break;
   - which sense of each root it uses;
   - transparency, a literal reading and a card gloss, each with its source;
   - field and register;
   - DESIGN §4.3 exclusion flags and sensitivity notes;
   - a verdict, and what a person should confirm in Pukui & Elbert.
2. **Blind second reading** of a 1-in-6 sample (every sixth word alphabetically: 151 words). The second readers used stricter definitions:
   - "attested" means a printed dictionary headword (Wiktionary, Pukui & Elbert via POLLEX, or a published reproduction of Pukui & Elbert entries); usage alone counts only as corroborated;
   - a sense id is assigned only when the sources agree.
3. **Adjudication** of disagreements from the first comparison, a **consistency critic** ([`CRITIC.md`](./CRITIC.md)), and a **policy collator** ([`DECISIONS.md`](./DECISIONS.md)), which turned the reviewers' recurring questions into about 50 decisions to make once instead of word by word.

## Results (first reading)

| verdict | words |
| --- | --- |
| keep | 166 |
| keep-pending (needs Pukui & Elbert) | 340 |
| doubtful | 212 |
| drop | 187 |

The critic found that 52 of the keeps rest on modern usage alone. Under the stricter definition about 80 keeps stand with no open caveat. No word should be treated as final until the root-level exclusion questions (DECISIONS A1–A17) are ruled on, and until the Pukui & Elbert check is done.

## Reliability: first vs blind second reading, true sample of 151

| measure | agreement |
| --- | --- |
| survives or not (keep/keep-pending vs doubtful/drop) | 137/151 (90%) |
| exclusion flag | 136/151 (90%) |
| spelling, ignoring spaces | 140/151 (92%) |
| spelling, exact | 123/151 (81%) |
| field | 129/151 (85%) |
| root senses | 111/151 (73%) |
| exact verdict | 108/151 (71%) |

The exact-verdict and sense figures are lower partly by design: the second readers worked to the stricter definitions, so keep → keep-pending and sense → "unresolved". Of the 14 survive-or-not splits:
- most are borderline Andrews-only words (doubtful vs keep-pending);
- two turn on the unsettled *hua* ruling (DECISIONS A2).

## Known faults

- **Pipeline errors**, catalogued in DECISIONS P1–P19:
  - the OCR "repair" invented words Andrews never printed (*kaʻalewa* for *Kaalelewa*);
  - Andrews' bracket was trusted over his headword (*papaone* for *Papaono*);
  - *X·ana* rows are really -na nouns (*huiana* = *huina*);
  - two-word Wiktionary headwords were missed;
  - homograph lists left out particles;
  - POLLEX glosses were never screened.

  None has been fixed in `../roots/` yet. The reviews flag the affected words.
- **Web search ran out.** The session's search budget was used up partway through. 20 of the 46 batches had no web corroboration, and 309 live words rest on local sources alone.
- **The first sampling attempt was botched.** The orchestrator typed the second-read sample by hand instead of copying the generated list, so about half the words sent weren't candidates. 72 valid comparisons came out of that pass (shown as off-sample here). The corrected pass second-read the remaining 127 true-sample words, with agents reading the generated list directly. The table above is computed on the true sample only.

## Files

- `review.tsv`: one row per candidate with all first-reading fields, `in_sample`, the second reading's verdict and form, and any adjudication.
- `DECISIONS.md`: the decisions, with affected words, options, a recommendation, and who decides.
- `CRITIC.md`: the consistency critic's report.
- `reviewer_notes.md`: each batch reviewer's notes. This is where most pipeline faults and policy questions were first raised.
- `overrides.json`: the DECISIONS.md recommendations applied as **default rulings**. The owner has not ruled on any of them; every reason starts "Default ruling (owner has not ruled)" and names its decision. 96 words: 19 restored where a ruling clears a root-level sense (LĀʻAU, KAPA, PIʻI, HUNA, HUA, star names), 15 removed (B1, B6, C2, C5, E3 epithets, P1 phantoms), and 35 never dealt as an opening word (E1 death, burial, disease and disability; E3 war).
- `glossary.json`: the curated stones, one per root in one sense, keyed by etymon (POLLEX set; lettered sub-sets of one set are one root, B8/B9). Each has its spelling, card gloss, Proto-Polynesian ancestor and up to three cognates, with the source and a one-line etymon note. Two passes: the first over the stones of the reviewed list, the second over the stones it never saw (restored words, the bases of full repeats). `renames` records the splits and merges (hua / hua#word, moʻo / moʻo#line, koa tree / brave, ʻau handle / group / swim, ʻawa kava / bitter; lā sun + day, papa, kahu, kūkulu, lae).
- `repeats.tsv`: 266 candidate full repeats (waiwai = WAI·WAI), reviewed because the owner wants them in (overriding B7(a)). A repeat ships only as its base doubled in a sense the base keeps. 70 keep, 61 pending, 21 doubtful, 114 drop.
- `wordlist.tsv`: what ships, with its stone ids and provenance. Written by `../roots/build_words.py`.

## How the shipped list is made

`../roots/merge_curation.py <curation dir>` folds the curators' outputs into the three files above; `../roots/build_words.py` turns them and `review.tsv` into `src/data/words.js` and `src/data/roots.js`. The build drops a word when:
- its final verdict is not keep or keep-pending, or it carries a §4.3 exclusion, or it is opaque;
- a stone would be over 8 letters (B11);
- one of its stones is itself a shipped repeat (B6, one form per word: *waiʻeleʻele* gives way to ʻELE·ʻELE);
- its two stones do not spell it (*alaula* would have printed ALA·ʻULA until the ʻula stone was respelled).

It fails outright on an apostrophe or non-NFC letter in a Hawaiian field (§4.4) and on any gloss containing English from the F1 banned list.

Result: 598 words (228 confirmed by two sources or P&E via POLLEX, 370 awaiting the Pukui & Elbert check, shown with ◦), 129 of them repeats; 436 stones, of which 30 are unresolved senses that never link. 423 words are playable (the 2-core of the turn graph); `../../tools/sim.mjs` rates the board Jukugo-like on desktop and phone.

Changes the curation forces on DESIGN's own examples (F4): *waiwai* is WAI "keep, retain" (PPN *qai) doubled, not water, so WAI·MAKA → WAI·WAI is not a chain; and *kahawai* no longer shares a stone with *kahakai*, so KAHA·KAI → KAHA·WAI is not either.
