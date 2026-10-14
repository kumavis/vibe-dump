# Hawaiian at the phonological level: oppositions, functional load, and where a sound carries meaning

Structural-linguistics research note for the Pōhaku Tumble investigation. This is
**research only**. It proposes no change to the design, and nothing here is decided.
The owner approves design changes.

Date: 2026-10-04. Directory:
`structure/phonology/`.
Every number below is produced by a script in this directory (see **Files** at the end).
Where a claim comes from a grammar rather than from the data, it is cited. Anything I
could not check is marked *unverified*.

---

## 0. The question and the short answer

**The owner's question.** Is a tumble that changes one sound (kai → kaʻi → kā) arbitrary?
In structural terms: in Hawaiian, does commuting one phoneme in a word ever produce a
*proportional* opposition? That would mean a series where the same expression difference
carries the same content difference (a : b :: c : d).

**Short answer.**

1. **In the open lexicon the owner is right, and now it is measured.** The data hold
   2,224 minimal pairs among 1,721 Wiktionary content words.
   - Only **11 (0.5%)** instantiate a recurring content difference. All of them are
     one series: plural of human nouns by vowel lengthening (*kanaka* : *kānaka*).
   - **27 (1.2%)** are variants or doublets. In these the sound change carries *no*
     content difference, which is the opposite of significance (*hākiʻi* ~ *nākiʻi*,
     both "to tie").
   - The remainder share a gloss word with the other member no more often than random
     pairs of the same lengths do: 1.57% against ≈1.3%, binomial p = 0.16.
   - **ʻokina vs Ø: 53 lexical minimal pairs, 0 systematic.**
   - **Vowel length: 36 pairs.** Eleven are the plural series and the other 25 are
     arbitrary.
   - A cross-check on 3,938 minimal pairs in POLLEX (Pukui & Elbert spellings) gives
     the same picture.
2. **The exceptions sit in the closed grammatical paradigms.** There, single phonemes
   have become signs. These are three small grids of Hawaiian function words:
   - the **possessive grid**: {Ø, k, n} × {a, o} × {1sg -ʻu, 2sg -u, 3sg -na}, 18 cells,
     all attested;
   - the **dual/plural pronoun grid**: {k incl., m excl., l 3rd} × {-ua dual, -kou plural};
   - the **deictic grid**: {kē-, pē-, Ø} × {ia/nei near speaker, nā near addressee,
     lā distal}.

   Inside these grids, **43 of the 46 minimal pairs (93%)** differ in exactly one
   paradigm dimension, so each is a proportional commutation. In content words the
   share is 0.5%.

   This is also **the one place where the ʻokina is significant**: *koʻu* "my" : *kou*
   "your" :: *noʻu* "for me" : *nou* "for you" :: *oʻu* : *ou*. The ʻ is the reflex of
   the PPN 1sg suffix \*-ku (POLLEX).
3. **Several famous alternations are distinctive but not significant**: the article
   *ka/ke* (conditioned allomorphy), causative *hoʻo-/hō-* (conditioned), long and short
   prefix variants (*ma-/mā-*, *pa-/pā-*), [k~t], [l~ɾ], [w~v], and dialect *l/n* and
   *k/t*.
4. **Sound symbolism**: none found as a system. There are about 14 onomatopoeic
   Wiktionary entries, a null exploratory test of size–vowel symbolism, and no published
   Hawaiian study located.

---

## 1. Data and method

| source | what was used | n |
|---|---|---|
| Wiktionary Hawaiian (kaikki.org dump, local) | headwords, POS, glosses, etymology templates, plural forms, alt-of/form-of links | 4,142 entries → 3,013 distinct spellings → 2,471 spelled only with native letters → **1,721 native, non-loan content forms** (noun/verb/adj/adv with a real gloss; "alternative form of…", dialect "X form of…" and letter-name senses removed) |
| POLLEX Hawaiian reflexes (local crawl) | Pukui & Elbert 1986 spellings (98% of rows), POLLEX etymon id, protoform | 2,258 rows → **1,691 distinct native single-word forms** |
| Hawaiian Wikipedia dump (local) | running text, token frequencies, bigrams | 3,019 articles, 349,387 kept tokens (native letters + (C)V phonotactics), 6,659 types |
| Alexander 1920 [1864] grammar (archive.org OCR) | 19th-century description: sounds, plural, a/o, ka/ke | §§1–4, 13, 15–19, 23–25 |
| Wilson 1980 (UH dissertation, ScholarSpace PDF) | a/o possessive, segmentation k-a-ʻu | ex. (1.1)–(1.2), (2.1)–(2.2), §2.2.2, §3.5.4 |
| Parker Jones 2018 (JIPA *Illustrations of the IPA: Hawaiian*) | inventory, allophony, stress, ʻ status | via the Cambridge core-reader |

**Normalisation** (`lex.py`). Spellings are converted to NFC. Every ʻokina look-alike
(' ‘ ’ ʼ) becomes U+02BB, and text is lowercased. A long vowel is one segment, so *kā*
has two segments.

**Minimal pair** (`minpairs.py`) means one of two things:
- **SUB**: same number of segments, differing in exactly one, e.g. *kala/kapa*, *ka/kā*;
- **DEL**: one extra segment, e.g. *kai/kaʻi* (ʻ vs Ø), *ahi/kahi* (k vs Ø).

*kai/kā* is not a minimal pair under this definition: the diphthong and the long vowel
differ in segment count.

**Semantic relatedness of a pair.** The same measures are applied to minimal pairs and
to the baselines.
- *gloss*: the two forms' English gloss stem sets share at least one stem, after a
  stoplist that also drops generic words such as kind, plant, fish, make (`semantics.py`).
- *cos*: tf-idf cosine of the gloss profiles.
- *POS*: the two forms share a content POS.
- *shared POLLEX etymon*: same POLLEX id.
- *Wiktionary link*: one entry names the other (form-of, alt-of, plural form, Hawaiian
  etymology link).

**Baselines.**
- **Matched random**: for each minimal pair (a, b), a random pair (a′, b′) with the same
  segment lengths that is not itself a minimal pair. 300 replicates; p = share of
  replicates ≥ the observed value.
- **Hamming-2**: all same-length pairs differing in exactly two segments.
- **Unmatched random**: 20,000 random pairs.

---

## 2. Inventory and distinctive features

### 2.1 Phonemes

| | labial | coronal | dorsal | laryngeal |
|---|---|---|---|---|
| stop | p | | k [k~t] | ʔ (ʻokina) |
| nasal | m | n | | |
| continuant | w [w~v] | l [l~ɾ] | | h |

Vowels: /i e a o u/, short and long (ā ē ī ō ū).

- **Parker Jones (2018)** lists eight contrastive consonants /h k l m n p v ʔ/, writing
  /v/ for ⟨w⟩. He gives five short and five long vowels. Long and short vowels differ in
  quality as well as duration. "Long vowels are always stressed."
- **Diphthongs.** Parker Jones gives fifteen (short + short, long + short) and says they
  are "not 'unit phonemes'". The evidence is reduplication: *hehei* from *hei*.
- **The ʻokina is a full consonant phoneme.** His minimal pair is *ʻaka* "laugh" vs *aka*
  "shadow". Word-medially it tends to be realised as creaky voice.
- **Alexander (1920 [1864], §1, §4)** counted "twelve letters" for all native sounds and
  described the glottal stop as a "guttural break". The missionary alphabet did not
  write it.

### 2.2 The consonant oppositions in Trubetzkoy's terms

This is my classification, from the feature table above. *W* is the number of
Wiktionary content minimal pairs (§4).

| opposition | basis of comparison shared only by these two? | logical type | proportional? | W pairs |
|---|---|---|---|---|
| p : m | yes (labial non-continuants) → **bilateral** | privative (nasality) | **isolated**: no t : n or k : ŋ in Hawaiian (PPN \*ŋ merged with n) | 30 |
| n : l | yes (coronals) → bilateral | privative (nasality) | **proportional** to m : w (nasal vs oral sonorant) | 46 |
| m : w | no (p is labial too) → multilateral | privative | proportional with n : l | 13 |
| ʔ : h | yes (laryngeals) → bilateral | privative (continuancy) | isolated | 54 |
| p : k : ʔ | stops → multilateral | equipollent (place) | none | 46 / 63 / 42 |
| ʔ : Ø, h : Ø | presence vs absence of an onset | privative | the ʻ/Ø pattern repeats across all onsets, but only as distinctiveness | 53 / 47 |

Vowels:
- **Height is a gradual opposition**: i : e : a and u : o : a.
- **Proportional series on the expression plane**: i : e :: u : o (high/mid) and
  i : u :: e : o (front/back).
- **Quantity is a privative correlation.** Long is the marked term, and it is
  proportional across all five qualities: a/ā, e/ē, i/ī, o/ō, u/ū.

So the vowel-length correlation is **the most proportional opposition on the expression
plane**, and §5 shows it is almost empty on the content plane.

### 2.3 Phonotactics and prosody (measured, `phon.py`)

| measurement | value | how |
|---|---|---|
| consonant clusters / word-final consonants | **0 / 0** in 2,064 native single-word forms | segment scan |
| spellings with non-native letters (t r s b d g …) | 180 forms: 122 names, 133 flagged as loans or names | letters outside p k ʻ h m n l w a e i o u + kahakō |
| identical short vowels adjacent (aa, ii) | 6, all across a morpheme boundary (*akaaka*, *haʻiinoa*, *makaaniani*) | VV scan; within a morpheme, length is written with a kahakō |
| content forms by mora count | 2: 482 · 3: 268 · 4: 757 · 5: 133 · 6: 189 · ≥7: 37 | short V = 1, long V = 2 |
| monomoraic content words | **0**. All 12 monomoraic forms are function words (a, e, he, ka, ke, ko, ma, me, na, no, o, ʻo) | → a bimoraic minimal word for lexical items |
| syllable nuclei with an onset | 85% (5,242 of 6,164) | content forms |
| word-initial ʻ / vowel / other C | 15.3% / 7.2% / 77.5% | 1,866 content forms incl. loans |
| VV sequences | 39 types; falling sonority 396, level 93, rising 271 tokens | rising sequences are heterosyllabic (Parker Jones: diphthongs are falling) |
| consonant share of segments | 46.0% types / 42.9% tokens | |
| long vowels among vowels | 11.7% types / 8.3% tokens; ē is the rarest segment (0.22% / 0.21%) | |

The ban on clusters and final consonants is also stated categorically by Alexander
(§3): "Every word and syllable must end in a vowel … To this rule there is no exception."

### 2.4 Segment frequencies

| seg | types (content forms) | % | tokens (hawwiki) | % |
|---|---|---|---|---|
| a | 1945 | 17.05 | 280514 | 21.88 |
| i | 1038 | 9.10 | 129363 | 10.09 |
| k | 971 | 8.51 | 138162 | 10.78 |
| o | 979 | 8.58 | 103558 | 8.08 |
| ʻ | 921 | 8.07 | 77220 | 6.02 |
| l | 822 | 7.21 | 65244 | 5.09 |
| h | 796 | 6.98 | 71013 | 5.54 |
| e | 736 | 6.45 | 93174 | 7.27 |
| u | 745 | 6.53 | 64180 | 5.01 |
| n | 654 | 5.73 | 81312 | 6.34 |
| p | 507 | 4.45 | 34076 | 2.66 |
| m | 416 | 3.65 | 70750 | 5.52 |
| ā | 359 | 3.15 | 40106 | 3.13 |
| ō | 167 | 1.46 | 7312 | 0.57 |
| w | 155 | 1.36 | 12622 | 0.98 |
| ū | 102 | 0.89 | 7158 | 0.56 |
| ī | 68 | 0.60 | 3344 | 0.26 |
| ē | 25 | 0.22 | 2693 | 0.21 |

---

## 3. Functional load

Two measures, computed for each opposition:

- **W / P**: lexical minimal pairs among Wiktionary content words and among POLLEX
  (Pukui & Elbert) forms.
- **Hockett FL**: the entropy-based functional load on Hawaiian Wikipedia tokens,
  (H − H_merged)/H, over word types (`fl.py`, `fl_joint.py`).

The W and P counts agree: Spearman ρ = **0.958** over 52 oppositions.

| opposition | W pairs | W pairs sharing a gloss stem | P pairs | FL all tokens | FL content tokens |
|---|---|---|---|---|---|
| vowel vs Ø (V insertion) | 118 | 2 | 316 | – | – |
| a/o (quality) | 102 | 3 | 156 | 1.74% | 0.42% |
| a/i | 99 | 5 | 143 | 1.85% | 0.72% |
| a/u | 82 | 1 | 127 | 0.55% | 0.57% |
| k/l | 77 | 2 | 110 | 0.44% | 0.20% |
| l/ʻ | 71 | 4 | 97 | 0.21% | 0.42% |
| k/ʻ | 63 | **0** | 94 | 0.29% | 0.30% |
| a/e | 55 | 2 | 120 | 3.01%* | 0.48% |
| h/k | 60 | 1 | 92 | 0.81% | 0.31% |
| o/u | 60 | 3 | 92 | 0.30% | 0.40% |
| i/o | 60 | 0 | 107 | 1.41% | 0.23% |
| h/ʻ | 54 | 4 | 93 | 0.31% | 0.14% |
| h/l | 55 | 1 | 90 | 0.27% | 0.28% |
| k vs Ø | 54 | 1 | 84 | – | – |
| i/u | 54 | 3 | 84 | 0.86% | 0.31% |
| **ʻ vs Ø** | **53** | **3** | **89** | **1.74%** | **0.14%** |
| l vs Ø | 53 | 0 | 100 | – | – |
| e/i | 49 | 1 | 84 | 1.02% | 0.21% |
| k/n | 48 | 1 | 67 | 0.47% | 0.33% |
| h vs Ø | 47 | 0 | 93 | 0.97% | 0.91% |
| l/n | 46 | 1 | 93 | 0.42% | 0.27% |
| k/p | 46 | 5 | 72 | 0.25% | 0.34% |
| k/m | 42 | 1 | 65 | 2.37%* | 0.14% |
| n/ʻ | 42 | 1 | 77 | 0.49% | 0.10% |
| p/ʻ | 42 | 0 | 58 | 0.13% | 0.22% |
| h/m | 41 | 0 | 58 | 0.85% | 0.82% |
| e/o | 39 | 0 | 80 | 0.98% | 0.16% |
| h/p | 38 | 2 | 71 | 0.19% | 0.31% |
| n vs Ø | 38 | 0 | 83 | – | – |
| l/p | 37 | 2 | 63 | 0.14% | 0.16% |
| e/u | 36 | 0 | 83 | 0.60% | 1.18% |
| p vs Ø | 36 | 1 | 65 | – | – |
| h/n | 35 | 4 | 67 | 0.32% | 0.66% |
| l/m | 33 | 0 | 55 | 0.32% | 0.18% |
| m vs Ø | 32 | 0 | 61 | – | – |
| m/ʻ | 32 | 2 | 44 | 0.20% | 0.04% |
| m/p | 30 | 1 | 36 | 0.22% | 0.23% |
| **a/ā (length)** | **27** | **0** | **36** | 0.81% | 0.53% |
| m/n | 24 | 0 | 45 | 0.20% | 0.07% |
| n/p | 23 | 2 | 45 | 0.16% | 0.07% |
| w/ʻ | 18 | 0 | 33 | 0.03% | 0.04% |
| k/w | 16 | 1 | 25 | 0.17% | 0.05% |
| l/w | 15 | 0 | 28 | 0.10% | 0.02% |
| h/w | 15 | 0 | 26 | 0.06% | 0.03% |
| p/w | 14 | 0 | 20 | 0.09% | 0.07% |
| m/w | 13 | 2 | 18 | 0.11% | 0.05% |
| n/w | 13 | 0 | 26 | 0.16% | 0.03% |
| w vs Ø | 12 | 1 | 23 | – | – |
| o/ō | 3 | 0 | 9 | 0.12% | 0.00% |
| u/ū | 4 | 0 | 5 | 0.04% | 0.01% |
| i/ī | 2 | 1 | 4 | 0.02% | 0.00% |
| e/ē | 0 | 0 | 4 | 0.04% | 0.00% |
| **length, all five** | **36** | 1 | **58** | 1.07% | 0.56% |
| **ʻ + length together (19th-c. spelling)** | | | | 2.97% | 0.73% |

\* The all-token FL of a/e and k/m is inflated by single function-word pairs: merging
*ka* with *ke* (article allomorphs) and *ka* with *ma*. The content-token column is the
better guide to the lexicon. All content FLs are ≤ 1.2%.

What the table says:

- **In the lexicon, the ʻokina's load is middling.**
  - 53 W pairs ranks 17th of 52 oppositions; k/ʻ is 7th and h/ʻ 13th.
  - In tokens its load is high (1.74%, 6th), almost entirely from grammatical words:
    *ʻo*/*o*, *ʻia*/*ia*, *ʻana*/*ana*.
- **Vowel length is low-load except for a/ā**: 27 of the 36 length pairs. ē/e has zero
  content minimal pairs.
- **Orthographic load.** Writing without ʻokina and kahakō, as in Andrews 1865/1922 and
  most 19th-century print:
  - it merges **227 of 1,721** content forms (13%) with another form;
  - **72.5%** of Wikipedia tokens fall into spellings that would then be ambiguous,
    mostly *ka/kā*, *o/ʻo*, *na/nā*, *ia/ʻia/iā*, *ana/ʻana/āna*;
  - so the marks matter most in the closed grammatical words, which is where §6 finds
    the significant cases.

---

## 4. The owner's point, tested: are minimal pairs semantically related more often than random pairs?

### 4.1 Wiktionary content words (1,721 forms, 2,224 minimal pairs; 886 forms have at least one neighbour; mean 2.58 neighbours)

| opposition family | pairs | share a gloss stem | matched random | p | tf-idf cos ≥ .25 | random | p | same POS | random | shared POLLEX etymon (n evaluable) | Wiktionary-linked |
|---|---|---|---|---|---|---|---|---|---|---|---|
| consonant substitution | 1043 | 3.5% | 1.3% | <0.003 | 0.9% | 0.1% | <0.003 | 89.3% | 84.7% | 0.1% (732) | 0.5% |
| vowel quality | 636 | 2.8% | 1.3% | <0.003 | 0.6% | 0.1% | 0.007 | 87.9% | 85.1% | 0.0% (445) | 0.8% |
| other C vs Ø | 272 | 1.1% | 1.4% | 0.751 | 0.0% | 0.1% | 1.000 | 90.1% | 87.6% | 0.4% (225) | 0.4% |
| vowel vs Ø | 118 | 1.7% | 0.8% | 0.236 | 0.8% | 0.1% | 0.090 | 91.5% | 80.2% | 0.0% (60) | 3.4% |
| **ʻokina vs Ø** | 53 | 5.7% | 1.3% | 0.060 | 3.8% | 0.1% | 0.010 | 94.3% | 86.8% | 0.0% (40) | 0.0% |
| **vowel length** | 36 | 2.8% | 0.7% | 0.233 | 2.8% | 0.1% | 0.023 | 83.3% | 79.3% | 5.6% (18) | **33.3%** |
| C~V | 33 | 0.0% | 1.3% | 1.000 | 0.0% | 0.1% | 1.000 | 87.9% | 83.8% | 0.0% (18) | 0.0% |
| vowel quality+length | 33 | 0.0% | 1.0% | 1.000 | 0.0% | 0.1% | 1.000 | 81.8% | 82.7% | 0.0% (8) | 0.0% |
| **all minimal pairs** | 2224 | **2.9%** | **1.3%** | 0.005 | 0.8% | 0.1% | 0.005 | 89.0% | 84.9% | 0.2% (1546) | 1.2% |
| same-length pairs differing in 2 segments | 12105 | 1.5% | | | 0.2% | | | 86.5% | | 0.0% (7542) | 0.0% |
| unmatched random pairs | 20000 | 0.6% | | | 0.1% | | | 76.6% | | 0.0% (3817) | 0.1% |

Including loans (1,866 forms, 2,408 pairs) changes nothing material: 2.7% vs 1.2%
(`minpairs_summary_loans.json`).

**Reading.** Minimal pairs are slightly more related than random: about 2.2× on gloss
overlap, and significant. But **97% of them share no gloss word at all**. Being
phonologically close in general does not explain the excess: pairs two segments apart
sit at the random level (1.5%). So the question is what the excess consists of.

### 4.2 What the "related" minimal pairs actually are (hand classification, `classify_related.py`)

Every pair flagged by any measure (88 of 2,224) was read and classified from its glosses
and Wiktionary or POLLEX etymologies.

| family | all pairs | flagged | PROP (proportional morphology) | LEN1 (one-off lengthening) | AFFIX (affix/compound/clip, prefix variant) | VAR (variant/doublet: same meaning) | SPLIT (one etymon, meanings diverged) | FIELD (chance / same lexical field) | DATA (artefact) | unrelated |
|---|---|---|---|---|---|---|---|---|---|---|
| consonant substitution | 1043 | 40 | 0 | 0 | 4 | 14 | 0 | 21 | 1 | 1003 |
| vowel quality | 636 | 22 | 0 | 0 | 1 | 10 | 2 | 9 | 0 | 614 |
| other C vs Ø | 272 | 5 | 0 | 0 | 0 | 0 | 1 | 3 | 1 | 267 |
| vowel vs Ø | 118 | 5 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | 113 |
| **ʻokina vs Ø** | 53 | 3 | **0** | 0 | 0 | 2 | 0 | 1 | 0 | 50 |
| **vowel length** | 36 | 13 | **11** | 1 | 0 | 1 | 0 | 0 | 0 | 23 |
| C~V | 33 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 33 |
| vowel quality+length | 33 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 33 |
| **all** | 2224 | 88 | **11** | 1 | 10 | **27** | 3 | 34 | 2 | 2136 |

The categories:

- **PROP** (11): *kanaka/kānaka, wahine/wāhine, kahuna/kāhuna, makua/mākua,
  kupuna/kūpuna, luahine/luāhine, ʻelemakule/ʻelemākule, kaikamahine/kaikamāhine,
  makuahine/mākuahine, ʻaumakua/ʻaumākua, kahiko/kāhiko*. All of them are singular :
  plural (§6.1).
- **LEN1**: *nauki/nāuki*. Wiktionary calls it the "emphatic form".
- **VAR** (27): families of synonyms that differ in one segment.
  - *hākiʻi, nākiʻi, hīkiʻi, nīkiʻi, mūkiʻi, pūkiʻi* (all "to tie")
  - *pōhai/pōʻai/kōʻai* "circle"
  - *kāʻai/kāʻei/kāhei* "sash"
  - *huaʻi/puaʻi/luaʻi* "bubble up / vomit"
  - *ʻali/ʻeli* "dig" (PPN \*kali/\*keli)
  - *lomi/lumi*, *moku/muku*, *walu/waʻu*, *nene/neʻe*, *lawe/ʻawe*, *kaha/kahi*
  - *henua/honua* (both PPN \*fenua), *lehu/ʻehu*
  - *ākala/ʻākala*, *alani/ʻalani*

  Here the commutation **fails on the content plane**: the expression changes and the
  meaning does not. In Hjelmslev's terms these are variants, not invariants.
- **AFFIX** (10): *kuhi/kuhia* (passive), *niho/nihoa*, *wai/waiū*, *aliʻi/liʻi*. Also
  synonymous prefix variants *kāʻalo/māʻalo*, *mālualua/ʻālualua*,
  *ʻāpikipiki/ʻōpikipiki*.
- **ʻokina vs Ø, all 53 pairs read.** None is systematic. Examples: *ahi* fire / *ʻahi*
  tuna, *ala* path / *ʻala* fragrance, *kai* sea / *kaʻi* lead, *koa* warrior / *koʻa*
  coral, *moa* chicken / *moʻa* cooked, *makau* fishhook / *makaʻu* fear, *ulu* grow /
  *ʻulu* breadfruit. The two "related" pairs are spelling variants of one word
  (*ākala/ʻākala*, *alani/ʻalani*).

**Residual test.** Remove PROP, LEN1, AFFIX, VAR, SPLIT and DATA. The remaining 2,170
pairs share a gloss stem in 34 cases, **1.57%**, against ≈1.3% for matched random pairs:
binomial P(X ≥ 34) = **0.16**. **Once morphology and free variation are taken out,
lexical minimal pairs are semantically indistinguishable from random pairs.** The
owner's claim holds, measured.

### 4.3 Cross-check on POLLEX (Pukui & Elbert spellings; `pollex_mp.py`)

1,691 forms give 3,938 minimal pairs.

| family | pairs | same POLLEX etymon | matched random | share gloss stem | matched random | p |
|---|---|---|---|---|---|---|
| ALL | 3938 | 0.8% | 0.0% | 3.3% | 1.2% | 0.003 |
| consonant substitution | 1668 | 0.7% | 0.0% | 3.2% | 1.0% | 0.003 |
| vowel quality | 1076 | 0.9% | 0.0% | 3.2% | 1.1% | 0.003 |
| other C vs Ø | 509 | 0.2% | 0.0% | 3.5% | 1.3% | 0.003 |
| vowel vs Ø | 316 | 1.3% | 0.0% | 4.4% | 1.4% | 0.003 |
| **ʻokina vs Ø** | 89 | 1.1% | 0.0% | **2.2%** | 1.1% | **0.223** (n.s.) |
| **vowel length** | 58 | 1.7% | 0.0% | **10.3%** | 1.5% | 0.003 |

The 31 pairs sharing a POLLEX etymon fall into these groups:

- **dialect l~n**: *kūlou/kūnou, lānahu/nānahu, menehune/melehune, uluhe/unuhe,
  ulana/unana, koʻala/koʻana*;
- **vowel doublets**: *laumaki/laumeki, ʻalele/ʻelele, imu/umu, laila/leila/lila*;
- **suffixation**: *huki/hukia*;
- **the article allomorphs** *ka/ke* (both PPN \*te);
- **the possessive paradigm itself**: *aʻu/oʻu* (\*-ku), *āna/ona* (\*-na), *āu/ou*
  (\*-u).

Among gloss-sharing pairs the grids reappear: *kāua/māua*, *kēlā/kēnā*, *pēlā/pēnā*,
*kou/ou*, *kāna/āna*. POLLEX files the lengthened plurals under separate PPN etyma:
\*maatuqa "plural of parent", \*tuupuna, \*faafine "women". That is itself evidence the
plural lengthening is inherited.

---

## 5. Non-significant oppositions (distinctive, or variant, but carrying no systematic meaning)

| alternation | status | measurement / source |
|---|---|---|
| article *ka / ke* | **conditioned allomorphy**. *ke* goes before k-, e-, a-, o- and a lexical list; Alexander §23–24: "ke awa, the harbor, and ka ʻawa", i.e. *ka* before the lost Polynesian \*k = ʻ | Wikipedia bigrams, 34,030 tokens. The KEAO rule predicts **93.1%**, the following word's majority choice **96.2%**. Choice entropy 0.81 bits → 0.32 given the initial segment → **0.16** given the word. Exceptions are lexical: *ke ʻano* 778. Commuting *ka*↔*ke* never yields a different sign. |
| causative *hoʻo- / hō-* | **conditioned**: *hō-* before ʻ-initial stems | Wiktionary analyses: *hō-* 19 of 20 with ʻ-initial stems (*hōʻike < ʻike*); *hoʻo-* 131 of 134 with other stems |
| *hoʻo-* + vowel-initial stem | morphophonemic coalescence with lengthening | 7 of 11 (*hoʻōla < ola, hoʻāhu < ahu, hoʻēmi < emi, hoʻīli < ili*); u-initial stems keep *hoʻo-* (0 of 3) |
| prefix length/quality: *ma-/mā-/mō-/na-/nā-*, *pa-/pā-*, *ʻa-/ʻā-/ʻō-/pū-*, *hoʻo-/hō-/hoʻ-/haʻa-/ho-* | free/allomorphic variation | Wiktionary prefix entries: "alternative form of", "synonym of hoʻo-" |
| directional + *lā* shortening (*aku+lā → akula*, *maila, ihola, aʻela*) | morphophonemic | Wiktionary etymologies: "with loss of vowel length" |
| [k~t], [l~ɾ~d], [w~v] (and p~b) | allophony / free variation | Alexander §2: "No distinction was formerly made between the sounds of k and t or between those of l and r"; w "in the middle of words … approaches … v". Parker Jones 2018. |
| dialect **k → t** (Niʻihau) | same sign, different expression | Wiktionary: 31 "Niʻihau form of" entries, 24 of them t for k (*teia = kēia, tou = kou, makahiti = makahiki*) |
| dialect **l → n** (Lānaʻi) | same sign, different expression | Wiktionary: 8 "Lānaʻi form of" entries, 7 n for l (*kūnou = kūlou, nihi = lihi, nānahu = lānahu*); POLLEX: 9 l/n pairs under one etymon |
| lexical doublets (VAR) | expression varies, content constant | 27 of 2,224 content minimal pairs (§4.2) |
| ʻ vs Ø and V vs Vː in the open lexicon | distinctive, not significant | 0 of 53 and 11 of 36 (all plural) systematic (§4.2) |

---

## 6. The exceptions: where a phonological difference has been morphologized into a proportional opposition

Inside the three closed grids below there are 36 forms (`paradigm_pairs.py`). Among them
are **46 minimal pairs, and 43 (93%) differ in exactly one paradigm dimension.**
Wiktionary has 91 function-word forms with 145 minimal pairs, and 43 of those 145 lie
inside the grids. The contrast with the content lexicon (0.5%) is the main structural
finding at this level: **in Hawaiian, phoneme-sized signs exist, but only in closed
grammatical paradigms.**

### 6.1 Plural of human nouns by vowel lengthening (V : Vː = singular : plural)

| singular | plural | gloss | corpus sg / pl | POLLEX plural |
|---|---|---|---|---|
| kanaka | kānaka | person | 1545 / 1412 | – |
| wahine | wāhine | woman | 335 / 33 | \*faafine "Women" |
| makua | mākua | parent | 87 / 135 | \*maatuqa "Plural of matuqa, parent" |
| kupuna | kūpuna | grandparent, ancestor | 40 / 39 | \*tuupuna "Plural of tupuna" |
| kahuna | kāhuna | priest, expert | 27 / 4 | – |
| kaikamahine | kaikamāhine | girl | 125 / 10 | – |
| makuahine | mākuahine | mother | 190 / 0 | – |
| luahine | luāhine | old woman | 3 / 0 | – |
| ʻelemakule | ʻelemākule | old man | 3 / 0 | – |
| ʻaumakua | ʻaumākua | family god | 1 / 0 | \*kau-matua (P&E: "Plural form of ʻaumakua") |
| kahiko | kāhiko | old (person) | 364 / 5 | – |
| (makua kāne) | (mākua kāne) | father | 0 / 0 | – |

- **Size.** 11 single-word pairs in Wiktionary, plus one two-word pair. POLLEX (P&E)
  attests four plurals. Alexander §13: "A few words … distinguish the plural by
  prolonging and accenting the first syllable. Thus kanaka … wahine … and a few others."
- **Regularity.** All 11 are human or kin nouns. In all 11 the lengthened vowel is the
  antepenultimate vowel of the (first) stem; it is the 5th from the end only in the
  compound *makuahine*.
- **Not general.** Of the 36 length minimal pairs in content words, only these 11 (31%)
  are plurals. Length means "plural" only inside this frame.
- **Type.** Privative: plural is the marked term, length is the mark. Proportional (11
  members). Closed, not productive (*unverified* whether speakers extend it).
- **Secondary description.** Wikipedia's *Hawaiian grammar* page summarises Elbert &
  Pukui 1979 as lengthening "in the third syllable from the end". The book itself was
  not consulted.

### 6.2 The possessive grid: {Ø, k, n} × {a, o} × {1sg, 2sg, 3sg}

| | a-class 1sg | a-class 2sg | a-class 3sg | o-class 1sg | o-class 2sg | o-class 3sg |
|---|---|---|---|---|---|---|
| **Ø-** (after prepositions; "of me") | aʻu (9) | āu (2) | āna (144) | oʻu (41) | ou (21) | ona (74) |
| **k-** (determiner; "my") | kaʻu (7) | kāu (9) | kāna (1026) | koʻu (27) | kou (58) | kona (2770) |
| **n-** ("for / by me") | naʻu (1) | nāu (6) | nāna (94) | noʻu (1) | nou (1) | nona (52) |

Parentheses give Hawaiian Wikipedia token counts; the corpus is encyclopedic, hence the
heavy 3rd person. Neutral 1sg *kuʻu* (23) and neutral 2sg *kō* (72) are extra cells.

- **Attestation.**
  - Wiktionary: 18 of 18 cells.
  - POLLEX (P&E): all six k-forms with segmented PPN etyma: *kaʻu* \*te-qa-ku, *koʻu*
    \*te-o-ku, *kāu* \*te-qa-u, *kou* \*te-o-u, *kāna* \*te-qa-na, *kona* \*te-o-na.
    The Ø-forms appear via the suffix etyma \*-ku (1sg), \*-u (2sg), \*-na (3sg). The
    particles: *a* \*qa "of (dominant)" / *o* \*o "of (subordinate)", *na* \*na / *no*
    \*no, *kā* \*te-qa / *ko* \*t-oo.
  - The n-forms are not in the POLLEX crawl.
- **Morphological analysis** (Wilson 1980, §3.5.4): *k-a-ʻu / k-o-ʻu* (article +
  possessive marker + 1sg) < PEP \*t-aqa-ku / \*t-oqo-ku, and *k-u-ʻu* < \*t-a-ku.
  Alexander §18: *ka*, *ko* "are undoubtedly compounded of the definite article ka and
  the prepositions a and o".

Three proportional series run through the grid:

1. **a : o (the vowel slot), 9 pairs plus the particles a/o, kā/ko, na/no.**
   - Expression: a vs o; in 2sg and 3sg the a-forms also have length (ā vs o).
   - Content: the possessor initiated or controls the relation (a) vs not (o). Wilson's
     "Initial Control Theory": "Presence of control requires A. Absence of control
     requires O" (Wilson 1980, §2.2.2).
   - Minimal pairs in a frame: *koʻu inoa* "my name (that represents me)" vs *kaʻu
     inoa* "my name (that I bestow on someone)" (Wilson 1980, ex. 2.1–2.2). Also *he
     papale a-na* "a hat of hers (she made it)" vs *o-na* "(she wears it)" (ex.
     1.1–1.2). Alexander §15: *ka hale a Keawe* "the house which Keawe built" vs *ka
     hale o Keawe* "the house which Keawe lives in"; *ka wahine a Keawe* "wife" vs *o
     Keawe* "maid-servant"; *ke keiki a Keawe* "own child" vs *o Keawe* "errand boy".
   - Wilson: such minimal pairs are "extremely common … it is, in fact, difficult to
     find nouns that cannot be used with both A and O". So the frame is **syntactically
     productive**: any noun.
   - Type: privative (o is the unmarked term: Wilson 1980, §2.2.2, "\*o … covering all
     relations not included in \*a"; Baker 2012 abstract: "O-class is the unmarked
     category … A-class is the marked category"). Bilateral, or a 3-term multilateral
     a/o/u in preposed 1sg (*kaʻu/koʻu/kuʻu*).
2. **Ø : k : n (the onset slot), 6 triples.**
   - Expression: zero vs k vs n onset.
   - Content: plain "of" vs definite determiner "my" vs benefactive/agentive "for/by".
     Alexander §19: na/no "right or possession … for".
   - Type: equipollent, multilateral.
   - Note: in the open lexicon, k vs Ø (54 pairs) and k/n (48 pairs) are arbitrary.
3. **-ʻu : -u (person), 6 pairs.**
   - Pure ʻ vs Ø in three of them: *koʻu : kou :: noʻu : nou :: oʻu : ou* ("my" : "your").
   - In the a-class the ʻ alternates with length: *kaʻu : kāu :: naʻu : nāu :: aʻu : āu*.
   - Historically the ʻ is PPN \*k of \*-ku (POLLEX -KU.1: "First person singular
     possessive suffix") against \*-u (POLLEX -U).
   - **This is the one series in which the ʻokina itself is significant.**
   - Type: privative in expression (1sg carries the ʻ), equipollent in content (person).

### 6.3 Dual and plural pronouns: {k- incl, m- excl, l- 3rd, ʻo- 2nd} × {-ua dual, -kou plural}

| | dual | plural |
|---|---|---|
| 1 inclusive | kāua (8) \*taa-ua | kākou (58) \*taa-tou |
| 1 exclusive | māua (6) \*maa-ua | mākou (82) \*maa-tou |
| 3 | lāua (325) \*laa-ua | lākou (843) \*laa-tou |
| 2 | ʻolua (0), not in POLLEX | ʻoukou (5) \*kou-tou |

- **Attestation**: Wiktionary 8 of 8; POLLEX (P&E) 7 of 8.
- **Wiktionary segmentation**: *kā-* "forms inclusive pronouns"; *kāua* "from kā +
  lua (two)"; *kākou* "kā- + kolu (three)".
- **k : m : l, the onset slot.** It is meaningful in 6 one-slot commutations: kāua/māua,
  kākou/mākou (clusivity), kāua/lāua, kākou/lākou, lāua/māua, lākou/mākou.
  - Type: equipollent, multilateral (3 terms).
  - In the lexicon, k/m (42), k/l (77) and l/m (33) pairs are arbitrary.
- **-ua : -kou (number), 4 pairs.** The expression difference is longer than one
  phoneme, so this is morphology rather than phonology.

### 6.4 Deixis: {kē-, pē-, postposed Ø} × {near speaker, near addressee, distal}

| | near speaker | near addressee | distal |
|---|---|---|---|
| kē- (determiner) | kēia (1367) \*tee-ia | kēnā (4) \*tee-hena | kēlā (285) \*tee-laa |
| pē- (manner, "like …") | penei (7) \*pee-heni | pēnā (0) \*pee-hena | pēlā (27) \*pee-laa |
| postposed | nei (466) \*nei | nā \*naa "near addressee" | lā (885) \*raa "there, yonder (not near speaker)" |

- **Attestation**: POLLEX (P&E) 9 of 9 cells; Wiktionary 5 of 9.
- **n : l (near addressee : distal)** is proportional across 3 pairs: kēnā/kēlā,
  pēnā/pēlā, nā/lā.
  - The near-speaker column is formally irregular (*ia / nei*), so the series is two
    columns wide.
  - Type: equipollent (a person-based three-term system), multilateral.
  - In the lexicon, n/l (46 pairs) is arbitrary.
- **k : p (determiner : manner)**: 2 pairs, kēlā/pēlā and kēnā/pēnā.
- **Caveat.** Lānaʻi dialect replaces l with n (§5). Whether that neutralises kēlā/kēnā
  there is *unverified*.

### 6.5 Other lengthening

- *nāuki* "vexation" from *nauki* "irritable": Wiktionary "emphatic form". One case.
  Whether this is productive is *unverified*.
- Alexander's "prolonging and accenting" ties length to stress. Parker Jones: long
  vowels are always stressed.

---

## 7. Sound symbolism (cautious)

- **Onomatopoeia.** Wiktionary marks about 14 Hawaiian entries as onomatopoeic or
  imitative, e.g. *nēnē* (goose, "imitative of the bird's call"), *ʻōʻō* (honeyeater),
  *pio* "peep", *umō* "moo", *ʻowau* "meow", *paka* "sound of raindrops", *kio*
  "chirp". This is isolated iconicity, not an opposition.
- **Literature.** A web search found no study of Hawaiian phonaesthemes or sound
  symbolism. Absence of a study is not evidence of absence.
- **Exploratory magnitude test** (`size_symbolism.py`, Sapir/Ultan-style). Content words
  glossed small/tiny/little (15 words, 43 vowels) have an /i/ share of 0.256. Words
  glossed big/large/great (8 words, 24 vowels) have 0.292. The lexicon share is 0.179,
  and the permutation p for small > big is 0.62. **No effect**, and n is tiny.
- **Out of scope here.** Reduplication's iconicity (plural, repetitive) belongs to the
  morphology level.

---

## 8. Frame assessment (options only, not proposals)

Could any of these series serve as a two-slot or n-slot frame where commuting one sign
is meaningful, as in Jukugo Tumble?

- **Possessive grid.** This is the only true multi-slot frame at this level.
  - Three slots: onset Ø/k/n, vowel a/o, person ʻu/u/na. All 18 cells exist.
  - Every one-slot change gives a real word with a predictable meaning change. Examples:
    *koʻu* → *kou* "my → your"; *koʻu* → *kaʻu* "my (inherent) → my (made/acquired)";
    *kona* → *nona* "his → for him".
  - Lines between cells would be true statements, e.g. "both are a-class", "both 1sg".
  - Small (18 forms), dense (every cell filled, 43 of 46 internal minimal pairs
    proportional), zero sensitive content.
  - The meanings are grammatical, so each piece reads as "my / your / for him",
    not as a picture.
  - The a/o slot also works in an open frame, *ka hale __ Keawe* with *a* or *o*. With
    any noun it gives meaning pairs such as "the house he built / the house he lives
    in" and "wife / maid-servant" (Alexander §15).
  - One option is a piece where one block is the possessive marker and the other a noun
    or person. Turning a/o would flip "made by" against "belonging to". Option only.
- **Plural lengthening.** A one-slot frame (a kahakō on or off) over 11 human nouns:
  *kanaka* → *kānaka*, *kupuna* → *kūpuna*.
  - Concrete and culturally resonant, but tiny and a single dimension.
  - Some members carry religious senses that call for care: *kahuna* (incl. "sorcerer"),
    *ʻaumakua* (family god).
- **Pronoun and deixis grids.** 2×3 and 3×3 frames. They work, but they are smaller and
  more abstract. The deixis grid has an irregular column.
- **Open lexicon, single-phoneme turns.** No viable frame. 0.5% of minimal pairs are
  systematic, and the systematic ones are all the plural series. The owner's rejection
  is borne out.

---

## 9. Open doubts

1. **No direct Pukui & Elbert check.** It was out of scope or unreachable. POLLEX covers
   only 754 of the 1,721 Wiktionary content forms. Wiktionary is crowd-edited.
2. **The gloss-overlap measure is crude.** It uses English gloss stems. It misses
   synonyms glossed with different words and catches chance overlaps. The hand
   classification of the 88 flagged pairs is mine.
3. **Coverage.** Wiktionary's 1,721 forms are a fraction of Pukui & Elbert's roughly
   30k entries. Absolute pair counts will scale up. The proportions held on POLLEX's
   1,691 forms.
4. **The corpus.** Hawaiian Wikipedia is encyclopedic and partly learner- or
   bot-written, and its diacritic use is inconsistent (*kēlā* 285 vs *kela* 497). Token
   FL values are approximate.
5. **Grammars not read directly.** Elbert & Pukui 1979 and Schütz 1981 were not
   consulted. The plural description rests on Alexander and Wikipedia's summary; the
   a/o semantics on Wilson 1980, Alexander and Baker 2012; the inventory on Parker
   Jones 2018.
6. **My own analysis.** The synchronic segmentation of person as -ʻu / -u / -na, and
   reading the ʻ as a 1sg marker, are mine. They are consistent with Wilson's k-a-ʻu and
   POLLEX's \*-ku / \*-u, but a grammar may analyse them as unsegmentable portmanteaus.
7. **Markedness of a/o.** Treating it as privative (o unmarked) follows Wilson and Baker.
   Other analyses treat it as equipollent (*unverified*).
8. **Level boundaries.** The paradigm grids are, strictly, morphology: phoneme-sized
   morphs. They are reported here because the task asked where phonological differences
   have been morphologized.

---

## 10. Sources

- Parker Jones, ʻŌiwi. 2018. "Hawaiian." *Journal of the International Phonetic
  Association* 48(1): 103–115. doi:10.1017/S0025100316000438.
  https://www.cambridge.org/core/product/9F2B300BCF6EE97EA7E4437C5FCECB57/core-reader
- Alexander, W. D. 1920 [1864]. *A Short Synopsis of the Most Essential Points in
  Hawaiian Grammar*. Honolulu: Thrum. https://archive.org/details/shortsynopsisofm00alexrich
  (local OCR: `src/alexander1920.txt`)
- Wilson, William H. 1980. *Proto-Polynesian Possessive Marking*. PhD dissertation,
  University of Hawaiʻi at Mānoa. https://scholarspace.manoa.hawaii.edu/items/8509ed2c-b4c0-4f8c-a05c-fee725cbfcd0
  (local PDF/text: `src/wilson1980.*`)
- Baker, Christopher M. 2012. *A-class genitive subject effect: a pragmatic and discourse
  grammar approach to A- and O-class genitive subject selection in Hawaiian*. PhD
  dissertation, UH Mānoa. https://scholarspace.manoa.hawaii.edu/items/97c9cee2-83ac-4187-acd3-c8d15feb8665
  (abstract only)
- Schütz, Albert J. 1981. "A reanalysis of the Hawaiian vowel system." *Oceanic
  Linguistics* 20(1): 1–43. doi:10.2307/3622840. Cited, not read.
- Elbert, Samuel H. & Mary Kawena Pukui. 1979. *Hawaiian Grammar*. UH Press. Not read;
  known via Wikipedia's summary.
- Wikipedia, "Hawaiian grammar" and "Hawaiian phonology" (secondary).
  https://en.wikipedia.org/wiki/Hawaiian_grammar · https://en.wikipedia.org/wiki/Hawaiian_phonology
- POLLEX-Online (Greenhill & Clark 2011), local crawl:
  `roots/.cache/pollex/hawaiian-reflexes.json`
- Wiktionary via kaikki.org, local: `…/roots/.cache/kaikki-haw.jsonl`. Hawaiian
  Wikipedia dump, local: `…/roots/.cache/hawwiki.xml`.
- Method background, named but not re-read: Trubetzkoy 1939 *Grundzüge der Phonologie*;
  Hjelmslev 1943 *Omkring sprogteoriens grundlæggelse*; Hockett 1967 on functional load;
  Surendran & Niyogi 2006 (entropy-based functional load); Sapir 1929 and Ultan 1978
  (magnitude symbolism).

---

## Files (all in this directory)

| file | what |
|---|---|
| `lex.py` → `lexicon.json`, `pollex_forms.json` | normalised Wiktionary lexicon with POLLEX attached |
| `corpus.py` → `corpus_counts.json`, `corpus_bigrams.json`, `corpus_stats.json` | Hawaiian Wikipedia tokens and bigrams |
| `phon.py` → `phon_stats.json`, `phon_run.txt` | inventory, phonotactics, moras, frequencies |
| `semantics.py` | gloss tokeniser, stoplist, tf-idf |
| `minpairs.py` → `minpairs.tsv`, `minpairs_summary.json` (and `_loans`) | minimal pairs and the semantic test |
| `report_mp.py` → `report_mp.md` | tables of §4.1 and the per-class counts |
| `classify_related.py` → `related_pairs_classified.tsv`, `related_table.md` | hand classification (§4.2) |
| `pollex_mp.py` → `pollex_minpairs.tsv`, `pollex_mp.json`, `pollex_mp_table.md` | P&E cross-check (§4.3) |
| `fl.py` → `fl.json`, `fl_table.md`; `fl_joint.py` → `fl_joint.md` | functional load (§3) |
| `morph_checks.py` → `morph_checks.json`, `morph_checks.txt` | plurals, grids, ka/ke, hoʻo-/hō- (§5–6) |
| `paradigm_pairs.py` → `paradigm_pairs.txt` | minimal pairs inside the grids (§6) |
| `size_symbolism.py` → `size_symbolism.txt` | exploratory sound-symbolism test (§7) |
| `src/` | downloaded Alexander 1920 OCR and Wilson 1980 PDF/text |
