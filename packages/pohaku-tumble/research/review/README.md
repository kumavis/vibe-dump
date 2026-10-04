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
