# Synthesis: working notes

The full report is `../STRUCTURE.md`. This file records what the synthesis checked again, what it
measured that the six level studies had not, and which of their figures it corrects. Research only:
nothing here proposes or decides a design change.

Date: 2026-10-04. Directory:
`structure/synthesis/`

## 1. Re-runs and corrections

| # | what looked off | re-run | result | effect |
|---|---|---|---|---|
| 1 | Phonology, derivation, lexical-fields and historical-structure counted on the **uncleaned** Hawaiian Wikipedia. The grammatical-paradigms study found that about 102k tokens of it are machine-made word salad. | `scripts/recheck_corpus.py` recounts on the cleaned corpus (`grammatical-paradigms/corpus.pkl`, 310,077 tokens). | *kānaka* **1,430 → 372** tokens. The derivation study's "long plural after nā/mau in 97% (1,419/1,459)" becomes **93.1% (362/389)**. Measured the other way round, **82.1% (362/441)** of plural-determiner contexts write the long form, so the kahakō plural is left out in about 1 in 5. Other changes: *kona* 2,774 → 1,547, *lākou* 843 → 604, *mākou* 82 → 53. | Counts change; no qualitative claim changes. Kin GEN × SEX is still 8/8 cells. The a/o split by kin term is the same (*keiki* a-share 0.89 vs 0.91). PREP × LOC core is 27/40 (was 28/40). *hoʻo-* productivity holds: P = 0.026 against a 0.012 baseline for native words, and ≈39% of types are absent from the Andrews text by a crude string test. |
| 2 | *ʻolua*. Phonology and grammatical-paradigms say it is not in POLLEX; historical-structure says the non-singular pronouns are 7/8 in POLLEX. | Direct lookup in `hawaiian-reflexes.json`. | POLLEX has **ʻōlua** (P&E-sourced, long ō) < \*koo-lua "Second person dual pronoun". All **8/8** non-singular pronouns are in POLLEX. | Correction. The spelling (Wiktionary *ʻolua* vs POLLEX *ʻōlua*) is unresolved without P&E. |
| 3 | Grammatical-paradigms lists *kaikuahine : kaikuāhine* among the plural-lengthening pairs ("13 pairs"). | Lookup in Wiktionary, POLLEX and the cleaned corpus. | *kaikuāhine* is in neither dictionary source and has 0 corpus tokens. | Not attested in the local data. The series stays at **11** single-word pairs (10 in historical-structure, which leaves out *makuahine*). |
| 4 | Historical-structure §0 says Hawaiian merged more PPN consonants "than any of the four comparison languages". | Its own Table 1. | Tahitian also has **9** outcome classes (partly an orthographic artefact). | Restated as: Hawaiian ties with Tahitian for the fewest classes (9, against Māori 10, Samoan 11, Tongan 12). |
| 5 | `roots/compounds.tsv` columns `hawwiki_1w/2w` (roots study) come from the uncleaned corpus. | `scripts/recheck_compounds_counts.py` | Candidates with any token: **256 → 237** (19 lose all attestation). One-word tokens 6,490 → 4,220; two-word 1,682 → 1,160. Large drops: *kūlana* 591 → 164, *huamele* (2w) 23 → 3. | Worth knowing for the P&E worksheet ordering. Nothing in ROOTS.md's conclusions depends on it. |
| 6 | Phrase study: "dictionary-attested pairs 137". | `scripts/frames_lexicons.py` | **112** lexical pairs once name-majority modifiers are excluded, as in its other tiers. | Minor. |
| 7 | Andrews–Parker V + mai/aku glosses (grammatical-paradigms §6.2). | Whitespace-normalised search of the OCR. | Confirmed verbatim: "kuai mai, to buy, and kuai aku, to sell"; "e hele aku, to go off … the opposite of e hele mai"; "unu aku, push forward; unu mai, push back; unu ae, push aside". | Verified. |

## 2. New measurements

### 2.1 Proportionality, measured directly (`scripts/prop_test.py` → `tables/prop_test.txt`, `tables/prop_partners.tsv`)

The siblings measured **relatedness**: whether the two members of a pair share meaning. A
proportional opposition needs something else: the **same content difference recurring** across
pairs with the same expression difference (a : b :: c : d). The test:

- Each Wiktionary form is a tf-idf vector of its English gloss tokens. "plural of X" and similar
  glosses expand to a tag plus X's tokens; "alternative form of X" expands to X's tokens.
- A pair's offset is v(b) − v(a), oriented by its expression difference (x→y, Ø→c).
- A pair has a **proportional partner** if another pair with the same expression difference, sharing
  no form with it and not a derived copy of it, has offset cosine ≥ 0.5.
- Derived copies are excluded. *kaʻa : kala :: hoʻokaʻa : hoʻokala* repeats one lexical difference
  through *hoʻo-* and is not a second instance of k/l.
- Baseline: the same number of random same-length non-minimal pairs per opposition, 25 replicates.

| family | pairs | with a proportional partner | random |
|---|---|---|---|
| consonant substitution | 1,043 | **0** | 0.0% |
| vowel quality (± length) | 669 | **0** | 0.0% |
| other C vs Ø | 272 | **0** | 0.0% |
| vowel vs Ø | 118 | **0** | 0.0% |
| C~V | 33 | 0 | 0.0% |
| **ʻokina vs Ø** | **53** | **0** | 0.0% |
| **vowel length** | 36 | **10**, all plural (*kanaka : kānaka* …) | 0.0% |
| all | 2,224 | **10 (0.4%)** | 0.0% |

The 11th plural, *kupuna : kūpuna*, is missed because Wiktionary glosses *kūpuna* without "plural
of".

**Closed grids, same test:**
- pronoun grid: 6/6 pairs have a partner (*kāua : māua :: kākou : mākou*, cos 1.00);
- possessive grid: 12/30;
- deixis grid: 3 of 6 forms glossed, so it cannot be tested.

The possessive figure is a **lower bound**. English glosses neutralise a/o (*kaʻu* and *koʻu* are
both "my"), and the bare forms' glosses are inconsistent. The method cannot see a content difference
that English does not mark.

### 2.2 Frame density on Jukugo's real Board (`scripts/frames_lexicons.py`, `sim/` → `tables/frames_sim.jsonl`)

The roots study's simulator (`roots/sim/`, its patched Jukugo `board.js` / `field.js`) was copied
into `sim/build/`, and none of the originals were touched. Settings are those of ROOTS.md:
horizontal pairs only, 1.5-wide slabs, 10 seeds, 1,500 ticks. Compounds are corpus-attested when
the solid form plus the spaced bigram reach f ≥ 2 and df ≥ 2 in the cleaned corpus, the same bar
the phrase study used for phrases. Tiers are deduplicated by parts, so *hale pule* and *halepule*
count once.

| lexicon | words | ≥5 turns | deals 9×8 | stalls | repeats | linked | top unit share |
|---|---|---|---|---|---|---|---|
| Jukugo (ROOTS.md reference) | 1,649 | 1,539 | 10/10 | 0.1% | 10% | 51% | — |
| compounds attested W/W+A/A (ROOTS 128) | 128 | 21 | 0/10 | — | — | — | paʻa 8% |
| compounds stable in cleaned corpus | 148 | 36 | 0/10 (7/10 at 8×6: 37% stalls) | — | — | — | kū 7% |
| compounds attested **or** corpus-stable | 216 | 72 | 10/10 | 25% | 31% | 57% | paʻa 6% |
| phrases, dictionary-attested | 112 | 64 | 8/10 | 38% | 34% | 79% | hale 14% |
| phrases, stable (phrase study, 46 heads) | 565 | 530 | 10/10 | **0.0%** | **6%** | 79% | **mea 23%** |
| stable phrases without mea/kumu/papa/hana heads | 345 | 306 | 10/10 | 0.4% | 12% | 76% | hui 10% |
| N + modifier union (compounds attested or stable + phrases stable or dictionary) | 804 | 674 | 10/10 | 0.8% | 7% | 74% | mea 17% |
| union without mea/kumu/papa/hana heads | 569 | 430 | 10/10 | 2.2% | 11% | 68% | hui 7% |

Reading:

- Phrases fill the board.
- Compounds alone, on anything confirmable today, do not.
- The phrase frame over-links: 68–79% against Jukugo's 51%. The head slot is small (42–46 heads)
  and a few heads (mea, hana, hui) recur. This is a milder form of the *hoʻo-* problem: 90% linked in
  ROOTS.md.
- The density comes from **corpus** attestation (Hawaiian Wikipedia). On dictionary attestation
  alone, phrases stall as badly as compounds.

### 2.3 Squares in the compound tiers (`scripts/compound_squares.py` → `tables/compound_squares.tsv`)

Squares found: 0 among the 128 attested compounds, 4 among the 148 corpus-stable, and 5 among the 216
in the union. Hand-coded with the phrase study's P/L/X scheme:

- **P**, 1: *huamele* "musical notes" : *huaʻōlelo* "word" :: *ʻahamele* "concert" :
  *ʻahaʻōlelo* "legislature", i.e. unit vs gathering × song vs speech;
- **L**, 3: *hakumele* / *hakuʻōlelo* "compose poetry / slander"; *kūlana* / *kūpaʻa* ::
  *manaʻolana* / *manaʻopaʻa*;
- **X**, 1: *kōkala* / *kōpaʻa* :: *kūkala* / *kūpaʻa*, which is opaque and rests on homographs.

For comparison, the phrase study's 40 phrase squares came out 18 P / 10 L / 12 X.

## 3. Files

| file | what |
|---|---|
| `scripts/recheck_corpus.py` → `tables/recheck_corpus.txt` | cleaned-corpus recounts (plural lengthening, *hoʻo-* productivity, kin GEN × SEX, a/o by kin term, PREP × LOC, pronouns) |
| `scripts/recheck_compounds_counts.py` → `tables/recheck_compounds_counts.txt` | compounds.tsv corpus columns recounted |
| `scripts/prop_test.py` → `tables/prop_test.txt`, `tables/prop_partners.tsv` | offset-consistency proportionality test |
| `scripts/frames_lexicons.py` → `tables/frames_lexicons.txt`, `sim/lex/*.json` | frame lexicons on one attestation standard |
| `sim/sim.mjs`, `sim/build/` | copy of the roots study's Jukugo Board simulator |
| `tables/frames_sim.jsonl` | simulation output |
| `scripts/compound_squares.py` → `tables/compound_squares.tsv` | squares in the compound tiers |
