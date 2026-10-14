# critic-completeness: scripts and outputs

Critic pass on ../STRUCTURE.md. Findings are returned to the orchestrator, not written here.
This file only indexes the three measurements so they can be re-run.

| script | output | what it measures |
|---|---|---|
| `jukugo_squares.py` | `jukugo_squares.txt` | formal a:b::c:d squares and slot symmetry in Jukugo Tumble's own 1,649-word list (baseline the synthesis lacked) |
| `antonym_columns.py` | `antonym_columns.txt` | polar modifier columns (nui, liʻiliʻi, hou, mua, hope …) that the phrase study set aside as "grammatical" |
| `polar_pairs.py` | `polar_pairs.txt` | one-slot polar-antonym commutations (naʻau·ao : naʻau·pō) in compounds.tsv, the attested 128, and the phrase tier |

Inputs are read-only: `packages/jukugo-tumble/src/data/words.js`,
`roots/compounds.tsv`, `roots/.cache/tiers/attested-WA.json`, `../phrase-syntagm/tables/colloc_all.tsv`.
Also checked by hand: `../synthesis/scripts/frames_lexicons.py` (tiers keyed by spelling, no §4.3 screen),
`../synthesis/sim/lex/*.json` contents, `../synthesis/tables/frames_sim.jsonl` (no per-slot turn data).
