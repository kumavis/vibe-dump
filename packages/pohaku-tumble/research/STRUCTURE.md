# Hawaiian structurally: where a tumble can mean something

Research for the Pōhaku Tumble investigation. **This is research only.** It does not change or
propose changes to DESIGN.md, and nothing in it is decided. The owner approves design changes.
Where a frame could support a kind of piece, that is noted briefly as an option.

Date: 2026-10-04. This synthesis combines six level studies (phonology, derivation and
reduplication, grammatical paradigms, lexical fields, the phrase syntagm, historical structure).
It re-runs the figures that looked wrong and adds three measurements of its own. Working notes,
scripts and tables are in [`structure/synthesis/`](./structure/synthesis). Each level study's notes are in `structure/<level>/NOTES.md`.

Conventions:
- Every number is **measured** (by a named script), **cited** (a grammar or paper), or labelled
  *unverified*.
- "Attested in the data" means found in a local source:
  - Wiktionary (kaikki dump);
  - POLLEX, whose Hawaiian rows are 98% cited to Pukui & Elbert 1986;
  - Andrews–Parker 1922;
  - Hawaiian Wikipedia.
- "Described" means stated in a grammar.
- Pukui & Elbert's dictionary and Elbert & Pukui's *Hawaiian Grammar* were **not consulted
  directly** by any study. They reach this report only through POLLEX and through authors who quote
  them.

---

## 0. The answer

**The owner is right about the ʻokina and the kahakō, and it is now measured three independent
ways.**

- **Relatedness (phonology study).** Among 1,721 Wiktionary content words there are 2,224
  one-segment minimal pairs.
  - Only 11 (0.5%) carry a recurring content difference, and all 11 are one closed series: plural
    of human nouns by vowel length (*kanaka* : *kānaka*).
  - The remaining pairs share meaning no more often than random pairs (1.57% vs ≈1.3%, p = 0.16).
  - **0 of the 53 ʻokina pairs** is systematic.
- **Proportionality (this synthesis, a new test).** For each pair, is there another pair with the
  same expression difference *and* the same content difference (a : b :: c : d)?
  - 10 of 2,224 pairs have such a partner, all in the plural series.
  - 0 of 53 ʻokina pairs do, and 0 of 1,043 consonant substitutions. The random baseline is 0%.
- **History (historical study).** 85 of 89 ʻokina minimal pairs in Pukui & Elbert spelling join
  *unrelated* Proto-Polynesian etyma: the ʻ reflects \*k, the Ø reflects \*q, \*h or nothing.
  - The four exceptions are two variant pairs (*auaneʻi/aʻuaneʻi*, *ʻao/ʻaʻo*) and two possessive
    pairs (*koʻu/kou*, *oʻu/ou*). Those are the one place an old morpheme shrank to a single mark:
    the 1sg possessive \*-ku, now the ʻ of *koʻu* "my" against *kou* "your".

**The "something else"** is where Hawaiian does put meaning-bearing units (signs) in commutable
slots. There are two kinds, and they behave differently.

1. **Lexical commutation in the head + modifier syntagm.** This is the kind Jukugo has.
   - Each block is a lexical sign that keeps its meaning wherever it stands.
   - The current two-root compounds are **one end of this syntagm**: the lexicalised end, written
     solid and more often opaque. Spaced phrases (*hale pule* "church", *hale kūʻai* "store", *hale
     ʻaina* "restaurant") are the same construction.
   - The phrases are **more transparent**: two-word units are 90% transparent against 56% for
     one-word units.
   - They are **much denser**. On Jukugo's real `Board`, the 565 corpus-stable phrases on 46 heads
     deal a full board with 0% stalled turns and 6% repeats. The 216 attested-or-corpus-stable
     compounds stall on 25% of turns.
   - But the phrases are **corpus-attested, not dictionary-verified**: 5.7% are in a dictionary
     source. A few heads also dominate the links.
2. **Proportional commutation in closed grammatical paradigms.** This is a different kind of piece.
   - Here a turn flips one grammatical feature, and the *same* content difference recurs across the
     whole series:
     - possessives: *koʻu* "my" → *kou* "your" → *kaʻu* "my (made or acquired)";
     - pronouns: *kāua* "we two, incl." → *māua* "we two, excl." → *lāua* "they two";
     - directionals: *hele mai* "come" → *hele aku* "go"; *kūʻai mai* "buy" → *kūʻai aku* "sell";
     - possessive class: *kāna kiʻi* "the picture he made" → *kona kiʻi* "his portrait".
   - This is **the only place an ʻokina or kahakō tumble is meaningful**.
   - The sets are small and grammatical, and the current design excludes grammatical words
     (DESIGN §4.3).

Every frame below is an option for the owner. None is a recommendation.

---

## 1. The question in structural terms

**What a Jukugo turn is.** A jukugo is a two-slot syntagm of two signs (Saussure: each a signifier
joined to a signified). A turn replaces one sign with another in the same slot. The change on the
expression plane brings a change on the content plane, and that is Hjelmslev's commutation test
passed by an invariant. The remaining block keeps its value, and a line between two identical
blocks asserts that two words share a sign.

**Why the ʻokina switch fails.** The ʻokina is a phoneme, a *figura* of expression in Hjelmslev's
sense. It is **distinctive**: *kai* "sea" ≠ *kaʻi* "lead". It is not **significant**: the content
difference it brings is different in every pair and shares no component across pairs. Trubetzkoy
would call ʻ : Ø a correlation that is proportional on the expression plane only. Nothing on the
content plane recurs.

**Two ways a commutation can be meaningful.** The owner's question needs this distinction.

| | (a) lexical commutation | (b) proportional (grammatical) commutation |
|---|---|---|
| what turns | a lexical sign from an open set (*wai*, *maka*, *pule*, *kūʻai*) | a grammatical sign from a closed paradigm (*a/o*, *mai/aku*, *-ʻu/-u*) |
| what stays constant | the turned block means the same thing in every word it enters (sign constancy) | the content *difference* is the same in every frame it enters (a : b :: c : d) |
| what a line between blocks says | "these two words share a meaning" (*wai* = water) | "these two words share a grammatical feature" (both a-class) |
| example | *hale pule* → *hale kūʻai* (house for prayer → house for trade) | *kona* → *kāna* (his, not controlled → his, made or controlled) |
| the ʻokina in this role | never: it is a figura, not a lexical sign | only where it *is* the whole expression of a sign (*koʻu* : *kou*) |

Jukugo is type (a). Its compounds are not strictly proportional either. The relation between two
kanji is unmarked (modifier–head, verb–object, coordination), just like the Hawaiian head–modifier
relation (§3.5). *(General description of Sino-Japanese compounding, not measured here.)*

What makes a Jukugo turn meaningful is that each block is the **same sign** wherever it appears.
Type (b) frames are perfectly proportional, but each turn says only one grammatical thing.

**Criteria used to rank frames** (§5), from DESIGN §1–2 and ROOTS.md:

- **J1** Both blocks are signs, so the card's parts row can gloss them.
- **J2** A turn lands on an attested word or phrase.
- **J3** A line between identical blocks tells the truth (no homographs, no polysemy hidden behind
  one spelling).
- **J4** It is dense enough for a full board: words with ≥ 5 turns, low stalls and repeats, and
  about half the words linked, as in Jukugo.
- **J5** It is verifiable against a dictionary or grammar.
- **J6** Sensitivity is low, and it fits DESIGN §4.3 (no grammatical words, no deity names, no
  sexual, excretory or sorcery senses).

---

## 2. What this synthesis re-checked

| issue | finding (re-run) | consequence |
|---|---|---|
| Four studies counted on the **uncleaned** Hawaiian Wikipedia. About 102k tokens of it are machine-made word salad (found by the grammatical-paradigms study). | Recounted on the cleaned corpus (`synthesis/scripts/recheck_corpus.py`). *kānaka* **1,430 → 372** tokens; *kona* 2,774 → 1,547; *lākou* 843 → 604. | Counts change, but no qualitative claim does. The derivation study's "long plural after nā/mau 97%" becomes **93.1%** (362/389). Read the other way, only **82.1%** of plural-determiner contexts write the long form. Kin GEN × SEX is still 8/8 cells. The a/o pattern by kin term is unchanged. *hoʻo-* productivity holds: P = 0.026 against a 0.012 baseline. |
| *ʻolua*: "not in POLLEX" (phonology, grammatical paradigms) vs "7/8 pronouns in POLLEX" (historical) | POLLEX has **ʻōlua** < \*koo-lua (long ō, P&E-sourced). | Non-singular pronouns are **8/8** in POLLEX. The *ʻolua*/*ʻōlua* spelling needs P&E. |
| *kaikuāhine* listed as a plural (grammatical paradigms) | Not in Wiktionary or POLLEX; 0 corpus tokens. | Not attested in the local data. The series is **11** single-word pairs. |
| "Hawaiian merged more PPN consonants than any of the four comparison languages" (historical §0) | Its own Table 1 gives Tahitian **9** classes too. | Hawaiian **ties** with Tahitian for the fewest outcome classes (9; Māori 10, Samoan 11, Tongan 12). |
| `roots/compounds.tsv` corpus columns (roots study) | Counted on the uncleaned corpus. Recount: candidates with any token **256 → 237**; *kūlana* 591 → 164; *huamele* (two-word) 23 → 3. | Relevant to the worksheet ordering only. |
| Andrews–Parker glosses of V + mai/aku (grammatical paradigms) | Verified in the OCR: "kuai mai, to buy, and kuai aku, to sell"; "e hele aku, to go off … the opposite of e hele mai"; "unu aku, push forward; unu mai, push back". | Confirmed. |

Details: `synthesis/NOTES.md` §1.

---

## 3. A structural map of Hawaiian

### 3.1 Overview

| level | units | main oppositions (Trubetzkoy / Hjelmslev) | significant? | proportional on both planes? |
|---|---|---|---|---|
| **phonemes** (figurae of expression) | 8 C: /p k ʔ h m n l w/; 5 V × short/long; (C)V syllables only; bimoraic minimal content word | p:m privative, isolated; **n:l ∥ m:w** proportional (the only proportional consonant correlation); ʔ:h isolated; p:k:ʔ multilateral equipollent; height gradual; **length** privative, proportional across 5 vowels | **no**, except where a morpheme has shrunk to one phoneme | expression only. Content: 10/2,224 pairs, all plural length |
| **morphemes** | roots (open, short, many homonyms); affixes *hoʻo-*, *-na*, fossil *kā-, pā-, mā-, ʻō-, pō-, pū-*; numeral and kin prefixes *ʻe-, ʻa-, pā-, kai-*; replacives (plural length, 1sg *-ʻu*); reduplication as a process sign | base : derived, privative | *hoʻo-* yes (68% causative); *-na* yes (76%); fossils weakly (46%); reduplication weakly (11% core value, 31% no difference) | *hoʻo-*, *-na*, and the closed numeral and kin series |
| **closed grammatical paradigms** (inside words) | possessives {Ø,k,n} × {a,o} × {-ʻu,-u,-na}; pronouns {kā,mā,lā} × {-ua,-kou}; deixis {kē,pē,Ø} × {ia/nei, nā, lā} | equipollent multilateral slots; a/o privative (o unmarked); neutralised in *kuʻu*/*kō* | **yes** | **yes**: 43 of 46 minimal pairs inside the grids (93%) differ in exactly one paradigm dimension |
| **words** | compounds (lexicalised N + modifier, mostly solid); inherited compounds (155 POLLEX rows, 78 strict) | two signs in a syntagm; transparency varies | yes, where transparent | weakly: 0–5 squares in confirmable compound sets |
| **phrase** | NP = (DET) head + modifier…; VP = (TAM) V … (DIR) (nei/lā); function-word slots | head + modifier: lexical, open; DET ka~ke (allomorphs), number ka/nā, Ø/mau; POSS a/o; DIR mai/aku, aʻe/iho; PREP × LOC | **yes** | head + modifier: 45% of squares fully, 25% loosely. a/o, mai/aku and ka/nā fully proportional |
| **lexical fields** | field terms with content components (generation, sex, axis, pole …) | content: equipollent, gradual, privative with neutralisation (sibling age). Expression: suppletive | whole-word substitutions, yes | content yes, expression no. Exception: two-word frames (GEN × SEX, PREP × LOC, PART × LIMB, PHASE × ORDINAL) |
| **diachrony** | PPN → Hawaiian correspondences | regular (90.1% of aligned reflexes); mergers \*q=\*h=Ø, \*ŋ=n, \*f=\*s, \*l=\*r | — | between systems only; not commutation inside Hawaiian |

### 3.2 Phonemes: distinctive everywhere, significant almost nowhere

The phonology study (phonology/NOTES.md §2–6) supplies the following figures.

- **Inventory and phonotactics.**
  - 0 consonant clusters and 0 final consonants in 2,064 native forms.
  - 0 monomoraic content words: all 12 monomoraic forms are function words.
  - Parker Jones 2018 (JIPA) gives eight consonants, with [k~t], [l~ɾ] and [w~v] as free variants.
- **Dense neighbourhoods.**
  - 886 of 1,721 content forms have at least one minimal-pair neighbour (mean 2.58).
  - 276 of 1,694 POLLEX Hawaiian forms reflect two or more etyma. In 81, the homonymy was created by
    Hawaiian's own mergers (*lua* "two" < \*rua / "pit" < \*lua; *ao* "day" / "cloud"; *hala*
    "pandanus" / "sin"; *kuli* "deaf" / "knee").
  - This is why a one-mark tumble almost always lands on *some* real word. It is also why what it
    lands on is arbitrary. A small inventory, short words and mergers make the lexicon dense in
    expression and leave the expression-plane neighbours unrelated in content.
- **Functional load.** No opposition carries more than 1.2% of the entropy of content tokens.
  - ʻ/Ø has 53 lexical pairs, ranked about 16th–17th of 52 oppositions.
  - Its token load (1.74%) comes almost entirely from function words (*o*/*ʻo*, *ia*/*ʻia*,
    *ana*/*ʻana*).
  - Vowel length has 36 content pairs, 27 of them a/ā. *e*/*ē* has none.
  - Writing without ʻokina and kahakō merges 13% of content forms.
- **Non-significant alternations** (each fails commutation on the content plane):
  - article *ka/ke*: the KEAO rule predicts 91–93%; each word's own majority predicts 95–96%;
  - *hoʻo-/hō-*: *hō-* before ʻ-initial bases in 19 or 20 of 20–21;
  - long and short prefix variants;
  - allophones;
  - Niʻihau t-for-k and Lānaʻi n-for-l;
  - 27 lexical doublets that keep one meaning (six verbs "to tie": *hākiʻi, nākiʻi, hīkiʻi, nīkiʻi,
    mūkiʻi, pūkiʻi*).
- **Sound symbolism.** None found as a system: about 14 onomatopoeic entries, and a null
  size–vowel test (p = 0.62, small n).

### 3.3 Where single phonemes *are* signs: four closed series

| series | expression | content | size | evidence |
|---|---|---|---|---|
| plural of person nouns | short : long antepenult vowel (*kanaka* : *kānaka*) | singular : plural | 11 pairs (7 kin or age terms) | Wiktionary 11/11. POLLEX reconstructs \*maatuqa (PPN), \*faafine, \*tuupuna. Alexander 1920 §13. Cleaned corpus: the long form occurs in plural contexts 93% of the time, but only 82% of plural contexts write it, so the mark is partly redundant with *nā* / *mau* |
| possessive person | *-ʻu* : *-u* (*koʻu* : *kou*, *noʻu* : *nou*, *oʻu* : *ou*). In the a-class, ʻ against length (*kaʻu* : *kāu*) | 1sg : 2sg | 6 pairs | Wiktionary 6/6. POLLEX \*te-o-ku / \*te-o-u, suffix \*-ku "1sg possessive". Andrews–Parker writes *Kou* as one headword "Your; My", so in 19th-century spelling the contrast was not written |
| possessive onset | Ø : k : n | bare genitive : determiner "my" : benefactive "for me" | 6 triples | Wiktionary 18/18. POLLEX has the k-forms |
| pronoun stem | k : m : l (*kāua* : *māua* : *lāua*) | 1 incl. : 1 excl. : 3 | 6 one-slot pairs | POLLEX 8/8 non-singular, \*taa-ua, \*maa-tou … |

The same consonant and length contrasts are arbitrary in the open lexicon: k/m 42 pairs, k/l 77,
n/l 46, length 25 non-plural pairs. **The sign lives in the paradigm, not in the sound.**

### 3.4 Morphology

| process | size (attested pairs) | regularity of the content difference | productivity | status as a series |
|---|---|---|---|---|
| *hoʻo-* (allomorphs *hō-*, *hoʻ-* + V̄) | ≈190 genuine; Andrews has 984 *hoo-* headwords | causative 68% [57–78]; simulative 18%, conditioned by the base (human-noun bases 6/6); any P&E value 81% | high: P = 0.016 raw, 0.026 cleaned, against a ≈0.012 baseline; 32–39% of modern types are not in Andrews 1922 | **proportional**, but its content is one relation ("cause") |
| *-na* nominaliser | 34 | 76% "nominal of V" | — | proportional by category |
| fossil prefixes (*kā-, pā-, mā-, ma-, ʻō-, pō-, pū-, haʻa-*) | 99 curated | 46% pooled | low (POLLEX reconstructs them) | weak, mostly isolated |
| closed prefixes *ʻe-* (cardinal), *ʻa-*, *pā-* (distributive), *kai-* (kin reference) | 9, 9, 5, 5 | 88–100% | closed | proportional, tiny, grammatical |
| reduplication | 383 by string (25% spurious) | E&P core value 11%; any A&M value 32%; **no glossed difference 31%**; opaque 30% | low in modern text (4% of types new) | **not proportional**. Shape allomorphs are non-significant (A&M 2015, 1,632 words) |

Sources: derivation-reduplication/NOTES.md; Brittain 1993; Alderete & MacMillan 2015; Medeiros
2020.

### 3.5 The phrase: Hawaiian builds as a phrase what Japanese builds inside a word

- **Head-initial, fixed order.** In the corpus, statives follow their head 657 times and precede it
  4 times. WALS codes Hawaiian Noun–Adjective, citing Elbert & Pukui 1979.
- **The head + modifier frame is endocentric**, and the modifier slot is defined by position:
  nouns, verbs and statives all fill it.
- **The relation is unmarked**, a syncretism on the content plane with no expression correlate:
  - *mea kākau* "writer" is an agent;
  - *mea ʻai* "food" is a patient;
  - *mea kaua* "weapon" is an instrument.
- **The slots are asymmetric.**
  - Heads are few: 2.6 alternatives per pair.
  - Modifiers are many: 45 alternatives per pair.
- **Spaced vs solid spelling is not a linguistic opposition.**
  - 149 pairs occur both ways in one corpus, and 32 of the 95 common ones are genuinely mixed.
  - Andrews 1922 joined everything.
  - The Lexicon Committee lists joining or separating as a "minor change" (Kimura & Counceller
    2009).
  - Spelling correlates with opacity: one-word units are 56% transparent, two-word units 90%; odds
    ratio 7.2.
- **Function-word slots carry proportional oppositions:**
  - POSS **a/o** "possessor initiates or controls : does not". It fits 89.5% of 1,504 coded tokens,
    and 93–96% in 19th-century texts. Wilson 1980 says it is "difficult to find nouns that cannot be
    used with both A and O".
  - **mai/aku** "toward : away from the deictic centre". 10 pairs are glossed in public-domain
    sources. All 20 sampled directional tokens each way fit. But only 40–50% of V + mai / aku
    tokens are directional; the rest are prepositional *mai* "from" and comparative *ʻoi aku*.
  - **ka/nā** "singular : plural". 596 nouns occur with both.
- **aʻe/iho** is barely spatial in modern text: 0 of 30 sampled *aʻe* and 2 of 24 *iho* tokens.

Sources: phrase-syntagm/NOTES.md; grammatical-paradigms/NOTES.md.

### 3.6 Lexical fields: componential content, suppletive expression

- *luna* : *lalo* (above : below), *loko* : *waho* (inside : outside), *kaikuaʻana* : *kaikaina*
  (older : younger same-sex sibling) and *ʻulaʻula* : *ʻeleʻele* (red : black) each differ in one
  content component. No expression difference recurs across them.
- Across 6 fields (157 terms, 2,062 term pairs) there are **4** minimal pairs, and 0 of them are
  systematic.
- Relative age is a **privative opposition with neutralisation**. It is distinguished only between
  same-sex siblings; Andrews–Parker states the rule.
- Proportional series on both planes exist only as **two-word frames**:
  - kin GEN × SEX: {kupuna, makua, keiki, moʻopuna} × {kāne, wahine}. 8/8 cells, one suppletive
    (*kaikamahine*, which Andrews 1922 notes);
  - PREP × LOC: 27/40 core cells in the cleaned corpus;
  - PART × LIMB: *manamana lima* "finger" : *manamana wāwae* "toes" :: *kuʻekuʻe lima* "elbow" :
    *kuʻekuʻe wāwae* "heel". 4 pairs, Andrews 1922;
  - moon PHASE × ORDINAL: 17 of 30 nights, in POLLEX/P&E;
  - the digit frames: *ʻe-*, *Pōʻa-*, *hapa-*, *kana-*.
- Body-part extensions (*lae* "forehead / cape", *poʻo* "head / summit") are polysemy. Nothing
  commutes.

Source: lexical-fields/NOTES.md.

### 3.7 History

- Correspondences are regular: 90.1% of 1,602 aligned Hawaiian reflexes.
- Mergers erased four PPN oppositions and left 81 merger homonyms. That is the systemic cause of
  ROOTS.md's homograph problem.
- The ʻ : Ø contrast inherits PPN \*k : \*q/\*h/Ø, which was lexically arbitrary there too.
- The meaningful single marks are reduced morphemes:
  - \*-ku → ʻ;
  - plural length, reconstructed at PPN in \*maatuqa.
- The pronoun number suffixes come from numerals: dual < \*rua "two", plural < \*-tou << \*-utolu
  "three", which is still a trial in Fijian *kedatou*. That origin is invisible synchronically,
  except in *ʻolua* ~ *lua*.
- Inherited compounds:
  - 155 POLLEX root + root rows, 78 strict;
  - mean degree 2.15, 0 rectangles;
  - only 13 of the 128 attested candidates.
- A cross-language "tumble" (*maka* → Māori *mata*) is a **correspondence between systems, not a
  commutation**. k never contrasts with t inside Hawaiian.

Source: historical-structure/NOTES.md.

---

## 4. The owner's point, three ways

| measure | ʻokina vs Ø | vowel length | all minimal pairs | baseline | source |
|---|---|---|---|---|---|
| systematic share (hand classification of 88 flagged pairs) | 0/53 | 11/36 (all plural) | 11/2,224 (0.5%) | — | phonology §4.2 |
| gloss overlap with the partner | 5.7% (2 of 3 are spelling variants) | 2.8% | 2.9%; 1.57% once morphology and variants are removed | ≈1.3% random (p = 0.16 residual) | phonology §4.1 |
| **proportional partner (a : b :: c : d), offset cosine ≥ 0.5** | **0/53** | **10/36 (all plural)** | **10/2,224 (0.4%)** | **0%** | synthesis §2.1 |
| same POLLEX etymon (P&E spellings) | 4/89 related (2 are the possessive 1sg/2sg) | ≤ 8/58 | — | — | historical §2.1 |
| in closed grids | the ʻ is significant (*koʻu* : *kou*) | — | 43/46 grid pairs proportional; pronoun grid 6/6 by the offset test | — | phonology §6; synthesis §2.1 |

Four studies used different data (Wiktionary, POLLEX/P&E), different measures (gloss overlap,
offset consistency, etymology) and different coders. They agree. In Hawaiian's open lexicon a
one-mark or one-sound tumble is **distinctive and arbitrary**. It becomes meaningful only where a
grammatical morpheme has been reduced to that mark.

---

## 5. Sign-level frames where commutation is meaningful, ranked

Frames are ranked by how well they carry a Jukugo-like tumble (J1–J6, §1). Nothing here is decided.

### 5.1 Ranking at a glance

| rank | frame | type | size | regularity | verifiable | sensitivity | board (simulated) |
|---|---|---|---|---|---|---|---|
| 1 | **head + modifier syntagm**, spaced or solid (compounds ∪ phrases) | (a) lexical | 804 corpus- or dictionary-attested units (565 stable phrases + 216 compounds + 112 dictionary phrases, deduplicated) | 45% of phrase squares fully proportional, 25% loosely, 30% broken | weak: 5.7% of phrases and 128 compounds are dictionary-attested | low–moderate | deals; 0.8% stalls, 7% repeats, 74% linked |
| 2 | **kin GEN × SEX** (with the sibling quadrant) | lexical, fully proportional | 8 cells (+4 sibling terms) | 6/8 transparent, 1 fused, 1 suppletive | high (Andrews, POLLEX for fillers) | low | too small alone; a sub-family of rank 1 |
| 3 | **possessive a/o + N** | (b) operator | 9 pronoun pairs + particles; any noun in principle; ≈15 nouns with a verified contrast | 89.5% (1,504 tokens); 93–96% (19th c.) | grammars (Alexander, Wilson); corpus | depends on the noun | predicted to over-link like *hoʻo-* (inference) |
| 4 | **V + mai/aku** | (b) operator | 10 glossed pairs (11 with *hō*); ≤ 50 verbs | 20/20 directional tokens each way; but mai is often "from" | Andrews–Parker 1922, Andrews 1854 | low | same prediction |
| 5 | **word-internal grids**: possessive, pronoun, deixis | (b), fully proportional | 18 + 6 (+2) + about 6 live cells | 93% of internal minimal pairs | Wiktionary, POLLEX (8/8 pronouns, 6/6 k-possessives, 9/9 deixis) | none | far too small for a board |
| 6 | **plural lengthening** (kahakō on/off) | (b), one slot | 11 nouns | 11/11; written in 82% of plural contexts | Wiktionary 11, POLLEX 4 | *kahuna* ("sorcerer" among its senses), *ʻaumakua* | one-dimensional |
| 7 | **PREP × LOC** | lexical place + grammatical relation | 5 × 8 core, 27 attested | compositional | Alexander §55, Andrews 1922 | low (*makai* also "policeman") | small |
| 8 | **moon PHASE × ORDINAL** | lexical, inherited | 17 nights | regular; 1 pseudo-member (*Kulua*) | POLLEX/P&E, Andrews 1922 | **moderate**: deity names, kapu nights; DESIGN §4.3 excludes deity names | small |
| 9 | **numeral and digit frames** (*ʻe-*, *Pōʻa-*, *hapa-*, *kana-*; traditional NUM × UNIT) | arithmetic | 45 Wiktionary cells; 6 units | 100% compositional | Wiktionary, Andrews, Shionoya 2010 | low; homographs (*lau* leaf, *lehu* ash, *lua* pit) | content is a number |
| 10 | **limb PART × LIMB** | lexical | 4 pairs | 100% | Andrews 1922 only; 3 corpus tokens | next to sensitive body vocabulary | tiny |
| 11 | ***hoʻo-* + base** | (b) operator | ≈190 pairs | 68% causative | Wiktionary, Andrews, POLLEX | low | measured in ROOTS.md: deals, but 90% of words linked by "both causative" |

**Not frames** (the commutation is not meaningful, or is not a commutation):

| | why not |
|---|---|
| one ʻokina, kahakō or sound in the open lexicon | measured arbitrary: 0/53, 0/1,043 … (§4) |
| reduplication | 31% no difference, 11% core value |
| fossil prefixes | 46% |
| cognates (*maka* → *mata*) | a correspondence between systems, not a commutation; the subject becomes Polynesia; each community would need to review its own words |
| spaced vs solid | orthographic |
| *ka/ke*, *hoʻo-/hō-*, *i/iā* | conditioned allomorphy |

### 5.2 Board simulation (Jukugo's real `Board`, ROOTS.md settings; `synthesis/sim/`)

| lexicon | words | ≥5 turns | deals 9×8 | stalls | repeats | linked | most frequent unit |
|---|---|---|---|---|---|---|---|
| Jukugo (reference, ROOTS.md) | 1,649 | 1,539 | 10/10 | 0.1% | 10% | 51% | — |
| compounds attested (ROOTS.md 128) | 128 | 21 | 0/10 | — | — | — | *paʻa* in 8% |
| compounds stable in the cleaned corpus | 148 | 36 | 0/10 | — | — | — | *kū* 7% |
| compounds attested or corpus-stable | 216 | 72 | 10/10 | 25% | 31% | 57% | *paʻa* 6% |
| phrases, dictionary-attested | 112 | 64 | 8/10 | 38% | 34% | 79% | *hale* 14% |
| **phrases, corpus-stable** | 565 | 530 | 10/10 | **0.0%** | **6%** | 79% | ***mea* 23%** |
| stable phrases without the polysemous heads *mea, kumu, papa, hana* | 345 | 306 | 10/10 | 0.4% | 12% | 76% | *hui* 10% |
| **N + modifier union** | 804 | 674 | 10/10 | 0.8% | 7% | 74% | *mea* 17% |
| union without *mea, kumu, papa, hana* | 569 | 430 | 10/10 | 2.2% | 11% | 68% | *hui* 7% |

Reading:

1. On anything confirmable today, compounds alone do not make a board. ROOTS.md found this too.
   It stays true even counting corpus attestation: 148 corpus-stable compounds across all 905
   candidates, against 565 stable phrases on only 46 heads.
2. The phrase end of the same syntagm fills the board easily.
3. It over-links: 68–79% of words are linked, against Jukugo's 51%. The head slot is small and a
   few heads recur. This is a milder form of the *hoʻo-* effect.
4. The density rests on **corpus** attestation in an encyclopedic, partly learner-written corpus.
   On dictionary attestation alone, phrases stall as badly as compounds.

### 5.3 The frames in detail

**1. Head + modifier syntagm, spaced or solid (lexical commutation).**

- **Slots and what a turn means.** [head N][modifier N/V/stative].
  - Turning the modifier keeps the class and changes the kind: *hale pule* → *hale kūʻai* → *hale
    ʻaina* (church → store → restaurant).
  - Turning the head keeps the kind and changes the class: *hale noho* → *wahi noho* (dwelling
    house → dwelling place).
  - A line between two HALE blocks says "both are houses".
- **Regularity.**
  - *hale* + purpose: 20 of 26 pairs (0.77).
  - *mea* + V as agent: 32 of 43 (0.74).
  - Fully proportional squares include *hale noho : hale kahiko :: wahi noho : wahi kahiko*,
    *hui kākoʻo : hui noiʻi :: poʻe kākoʻo : poʻe noiʻi*, and the dictionary grid *ʻaina* /
    *aloha* × *kakahiaka* / *awakea* / *ahiahi* (breakfast, lunch, dinner; good morning, midday,
    evening).
- **Line truth (J3)** fails for polysemous heads:
  - *kumu* has 4 senses in use, *papa* 6;
  - *mea* is "thing" or "person";
  - 5 of the 12 broken squares were head polysemy.
- **The field split.**
  - Artefacts, institutions and people (*hale, papa, puke, ʻōlelo, kiʻi, luna*) form spaced phrase
    paradigms.
  - Nature and body words (*wai, lau, maka, pō, kai*) have almost no phrasal paradigm in modern
    text. Theirs is in solid compounds.
  - So the compound frame and the phrase frame **complement each other by semantic field**.
- **Sensitivity.**
  - An ethnonym column (*Pākē*, *maʻi Pākē*).
  - *hoʻokae ʻili*.
  - Andrews' *halepea*.
  - The same screen ROOTS.md applied would be needed.

**2. Kin GEN × SEX (lexical, fully proportional).**

- *kupuna kāne* → *kupuna wahine* changes only sex; *kupuna kāne* → *makua kāne* changes only
  generation.
- All 8 cells are attested in the cleaned corpus.
- The (−1, F) cell is *kaikamahine*, not *keiki wahine*: 120 tokens against 1. Andrews 1922: "should
  be keikiwahine … but Hawaiians do not use it so".
- These are themselves head + modifier phrases, so structurally they are a sub-family of frame 1.
- The a/o possessor agrees with generation (ascending kin o-class, ≥ 98%; descending kin and spouse
  a-class, 86–96%). That is agreement, not free commutation.

**3. Possessive a/o + N (proportional operator).**

- One block is the class marker (*kāna/kona*, *a/o*); the other is a noun.
- Turning a ↔ o flips "made, chosen or controlled by" against "of, about, inherent to":
  - *kāna kiʻi* "picture he painted" / *kona kiʻi* "picture of him";
  - *kāna moʻolelo* "story he wrote" / *kona moʻolelo* "his life story";
  - *ka hale a Keawe* "house Keawe built" / *ka hale o Keawe* "house Keawe lives in" (Alexander
    §15);
  - *koʻu inoa* "my name" / *kaʻu inoa* "the name I bestow" (Wilson 1980).
- Every turn of the marker carries one bit, so lines between marker blocks would say "both a-class",
  as HOʻO lines said "both causative" (inference by analogy with ROOTS.md's measurement).
- The design excludes grammatical words (§4.3).

**4. V + mai/aku (proportional operator).**

- *hele mai* "come" / *hele aku* "go"; *lawe mai* "bring" / *lawe aku* "take away"; *kūʻai mai*
  "buy" / *kūʻai aku* "sell"; *lilo mai* "obtain" / *lilo aku* "be lost"; *hiki mai/aku*; *hoʻi
  mai/aku*; *hali mai/aku*; *unu mai/aku*; *mao mai/aku*; *haele mai/aku*.
- These read as lexical antonyms in English. In Hawaiian, the directional sign carries the
  difference.
- Caveats:
  - written as separate words;
  - *mai* is also "from" and the prohibitive;
  - modern *aku* is often comparative;
  - glosses for verbs beyond the 10 are one analyst's readings;
  - the design excludes grammatical words.

**5. Word-internal grids (perfectly proportional, tiny).**

- These are the only Hawaiian words whose sub-parts recombine freely as signs, as kanji do.
- They are the home of the one meaningful ʻokina switch (*koʻu* ↔ *kou*) and of a meaningful
  ʻokina-to-kahakō alternation (*kaʻu* ↔ *kāu*).
- Deixis has a defective column: *kēnā* has 1 token against *kēia* 1,109; Lyon 2018 calls the
  second-person forms obsolete or rare.

**6–11** are summarised in the table. Their limits:

- *plural lengthening*: one dimension, 11 nouns, partly redundant, sensitive members;
- *PREP × LOC*: small, and one slot is grammatical;
- *moon nights*: deity names and kapu nights call for community review;
- *numerals*: the content is arithmetic;
- *limbs*: 4 pairs;
- *hoʻo-*: already measured in ROOTS.md.

---

## 6. The compound frame and the work already done, in this light

1. **The compound frame is the right construction, cut at its least favourable end.**
   - A two-root compound is a head + modifier syntagm of two lexical signs. That is the correct
     Hawaiian analogue of a jukugo in kind.
   - But "written as one word" selects the lexicalised end of that syntagm. That end is where
     opacity concentrates (56% transparent against 90% for spaced units) and where much of the
     material is 19th-century (Andrews joined everything; modern spelling splits transparent units).
   - It is thin for structural reasons. Hawaiian is analytic and does most of its free
     sign-combining in the phrase. This is not only because Pukui & Elbert could not be reached.
2. **ROOTS.md's recommendations line up with structural principles.**
   - **Admit two-word compounds.** Spaced vs solid is orthographic (149 pairs written both ways),
     not a linguistic opposition.
   - **A stone is a root in sense.** A block must be *one sign*. Homonyms are two signs sharing a
     signifier, and their frequency is systemic: 81 POLLEX homonyms made by mergers alone.
   - **Reject *hoʻo-* as a stone.** A grammatical sign gives perfectly regular but one-bit lines.
     The a/o and mai/aku frames share that property.
3. **What the structural view adds.**
   - The two-word decision is larger than a spelling allowance. The phrase end supplies the density
     that the compound end lacks (§5.2).
   - It also brings two problems the compound list did not have in this form:
     - **asymmetric slots**: few heads, many modifiers, so heads over-link;
     - **corpus-only attestation**.
   - It changes which fields the board shows. Spaced phrases lean towards institutions and
     artefacts; solid compounds hold nature and body vocabulary.
4. **The Pukui & Elbert check stays decisive, and it covers both ends.**
   - Pukui & Elbert list two-word headwords (*hale kuke*, *hale kula*, *hale holoholona*, via Hosoda
     2019). The same lookup that settles the 777 Andrews-only compounds could verify phrase units.
   - The worksheet's corpus columns were counted on the uncleaned Wikipedia. Recounted: 237 of 905
     candidates have any token, not 256.
5. **Inherited compounds** (155 POLLEX rows, 78 strict) are well grounded. They suit provenance on a
   card but add no turns: mean degree 2.15, 0 rectangles.
6. **The rejected one-mark tumble** is confirmed as arbitrary by every measure available. It is
   meaningful only inside the closed grammatical sets (§3.3).

---

## 7. Options for the owner (research-level options only; nothing decided)

1. **Treat compounds and phrases as one frame, for research purposes.**
   - Have the Pukui & Elbert check record two-word headwords alongside the 905 compounds.
   - Measure how many single-sense heads and attested phrase units survive.
2. **Curate a phrase sample and test line truth.**
   - Restrict to single-sense heads (*hale, wahi, poʻe, hui, palapala, kahu*).
   - Code each pair's relation.
   - Re-simulate to see whether linking falls towards Jukugo's 51%.
3. **Look at a small closed-grid piece as a separate idea**: possessives, pronouns, kin GEN × SEX,
   or the *ʻaina/aloha* × time-of-day grid.
   - This is where an ʻokina or kahakō tumble would be meaningful (*koʻu* ↔ *kou*, *kanaka* ↔
     *kānaka*).
   - It conflicts with the current exclusion of grammatical words (DESIGN §4.3). That is the
     owner's call.
4. **Examine operator frames** (a/o + N, V + mai/aku) as a different kind of piece: one grammatical
   block and one lexical block, with lines that mean a grammatical feature. Expect over-linking like
   *hoʻo-*.
5. **Get a fluent-speaker or narrative-corpus check** of the corpus-based findings: a/o choices,
   mai/aku readings, phrase units. Hawaiian Wikipedia is encyclopedic and partly learner- or
   machine-written. A nūpepa corpus would test the frames on traditional prose.
6. **Keep inherited-compound provenance** as an annotation layer to study, independent of the frame
   choice.
7. **Leave lexical one-mark tumbles closed**, as the owner decided. Measurement supports that.

---

## 8. Open questions

- **Pukui & Elbert.**
  - Which phrase units does it list as headwords?
  - How does it spell *ʻolua* / *ʻōlua*, *ʻe-* / *ʻē-* and the moon-night names?
- **Line truth in the phrase frame.** How many heads are single-sense in use? Polysemy (*kumu*,
  *papa*, *mea*) broke 5 of 40 sampled squares.
- **Prosody.** Do compound and phrase differ in stress or accent grouping (Schütz 2010)? If they do,
  spaced vs solid has a phonological correlate.
- **Productivity for speakers.** Are plural lengthening and the a/o contrast productive for
  speakers, and how do they read mai/aku beyond the 10 glossed verbs?
- **Synchronic segmentation.** Do speakers analyse *k-a-ʻu* and *kā-ua* this way, or as unanalysed
  forms? Reading the ʻ as a 1sg marker is an etymologically supported analysis, not a measured one.
- **Markedness of a/o.** Privative with o unmarked (Wilson, Baker) or equipollent (*unverified*)?
- **Corpus effects.** Would a narrative corpus change the field split, which puts nature words in
  compounds and institutions in phrases?
- **Over-linking.** How far could a curated phrase list reduce it, and would any operator frame
  avoid the one-bit-line problem?
- **Lānaʻi n-for-l.** Does it neutralise *kēlā* / *kēnā*? *Unverified.*

---

## 9. Sources

**Grammars, papers and descriptions** (cited by the level studies; read in full unless noted):

- Alexander, W. D. 1920 [1864]. *A Short Synopsis of the Most Essential Points in Hawaiian
  Grammar*. Honolulu: Thrum. https://archive.org/details/shortsynopsisofm00alexrich
- Andrews, Lorrin. 1854. *Grammar of the Hawaiian Language*. Honolulu: Mission Press.
  https://archive.org/details/cu31924026915888
- Andrews, Lorrin, rev. Henry H. Parker. 1922. *A Dictionary of the Hawaiian Language*. Public
  domain; local OCR.
- Parker Jones, ʻŌiwi. 2018. "Hawaiian." *Journal of the International Phonetic Association*
  48(1): 103–115. doi:10.1017/S0025100316000438
- Wilson, William H. 1980. *Proto-Polynesian Possessive Marking*. PhD diss., University of Hawaiʻi.
  https://scholarspace.manoa.hawaii.edu/items/8509ed2c-b4c0-4f8c-a05c-fee725cbfcd0
- Baker, C. M. Kaliko. 2012. *A-class genitive subject effect …* PhD diss., University of Hawaiʻi
  (abstract only). https://scholarspace.manoa.hawaii.edu/items/97c9cee2-83ac-4187-acd3-c8d15feb8665
- Lyon, Jeffrey "Kapali". 2018. "Some Thoughts on Demonstrative and Locative Nā and the Loss of /ŋ/
  in Hawaiian." *Palapala* 2: 34–50.
  https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/ff927473-6c97-450d-b08e-5cf030727896/content
- Alderete, John & Kayleigh MacMillan. 2015. "Reduplication in Hawaiian: Variations on a theme of
  minimal word." *Natural Language and Linguistic Theory*. Preprint ROA 1318:
  https://roa.rutgers.edu/article/view/1318.html
- Brittain, M. 1993. *Hawaiian Causative-Simulative Prefixes as Transitivity and Semantic Conversion
  Affixes*. MA Plan B paper, University of Hawaiʻi. http://hdl.handle.net/10125/21147
- Medeiros, D. J. 2020. "Hawaiian Nominalization." GLOW 43 abstract.
  https://glowlinguistics.org/43/wp-content/uploads/sites/5/2020/02/GLOW_43Remarks_paper_21-Medeiros.pdf
- Shionoya, Toru. 2008. "Directionals in Polynesian Comparative Expressions." *Memoirs of the
  Muroran Institute of Technology* 57 (English abstract). https://muroran-it.repo.nii.ac.jp/records/8433
- Shionoya, Toru. 2010. "Hawaiian Traditional Numerals Denoting Four and Multiples of Four."
  *Hokkaido Gengo Bunka Kenkyū* 8: 73–83. http://hdl.handle.net/10258/701
- Iwasaki, Kanae. "'Directional' in Eastern-Polynesian Languages." University of Tokyo repository,
  abstract. https://repository.dl.itc.u-tokyo.ac.jp/records/27479
- Kimura, Larry & April G. L. Counceller. 2009. "Indigenous New Words Creation: Perspectives from
  Alaska and Hawaiʻi." In *Indigenous Language Revitalization*, 121–140.
  https://jan.ucc.nau.edu/~jar/ILR/ILR-10.pdf
- Hosoda, Kelsea Kanohokuahiwi. 2019. *Hawaiian Morphemes: Identification, Usage, and Application in
  Information Retrieval*. PhD diss., University of Hawaiʻi.
  https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/599f4a69-15e7-455a-b6b6-a590a9695731/content
- Malo, David. 1903. *Hawaiian Antiquities*, tr. N. B. Emerson.
  https://archive.org/details/hawaiianantiquit00malouoft
- Dryer, Matthew S. WALS Online, Hawaiian datapoints 87A, 86A, 81A (citing Elbert & Pukui 1979).
  https://wals.info/datapoint/87A/wals_code_haw
- Polynesian Voyaging Society. "Hawaiian Lunar Month."
  https://learningcenter.hokulea.com/education-at-sea/polynesian-navigation/polynesian-non-instrument-wayfinding/hawaiian-lunar-month/
- Kanepuu, J. H. 1867. "Ka Helu Hawaii." *Ke Au Okoa*, via Bishop Museum Nūpepa blog.
  https://blog.bishopmuseum.org/nupepa/j-h-kanepuu-on-traditional-counting/
- Greenhill, S. J. & R. Clark. 2011. "POLLEX-Online." *Oceanic Linguistics* 50(2): 551–559.
  https://pollex.eva.mpg.de (local crawl; no open licence stated).
- Wikipedia, "Hawaiian grammar" (secondary summary of Elbert & Pukui 1979).
  https://en.wikipedia.org/wiki/Hawaiian_grammar
- Wilson, William H. 1981. "Developing a Standardized Hawaiian Orthography." *Pacific Studies* 4(2).
  Search snippets only, *unverified*.
- **Not consulted directly:** Elbert & Pukui 1979, *Hawaiian Grammar*; Pukui & Elbert 1986,
  *Hawaiian Dictionary*; Schütz 1981, 1994 and 2010.
- **Forbidden and not used:** wehewehe.org and mirrors, Ulukau dictionary collections,
  puke.ulukau.org, baibala.org, trussel2.com, the en.wiktionary.org API.

**Method background** (named, not re-read): Saussure, *Cours* (syntagmatic vs associative; the
sign); Trubetzkoy 1939 (privative, gradual, equipollent; bilateral, multilateral; proportional,
isolated; neutralisation); Jakobson (markedness); Hjelmslev 1943 (commutation, figurae, syncretism);
Bloomfield 1933 and Harris 1951 (distribution, allomorphy); Hockett 1967 (functional load);
Weinreich 1954 (diasystem).

**Local data** (read-only): `roots/.cache/kaikki-haw.jsonl`, `wiktionary.json`,
`pollex/hawaiian-reflexes.json`, `andrews-parker1922.txt`, `hawwiki.xml`; `roots/compounds.tsv`,
`roots.tsv`; the 905 compound reviews.

---

## 10. Files

| path | what |
|---|---|
| `synthesis/NOTES.md` | re-runs, corrections, new measurements |
| `synthesis/scripts/recheck_corpus.py`, `recheck_compounds_counts.py` | cleaned-corpus recounts |
| `synthesis/scripts/prop_test.py` → `tables/prop_test.txt`, `prop_partners.tsv` | proportionality (offset) test |
| `synthesis/scripts/frames_lexicons.py`, `synthesis/sim/` → `tables/frames_sim.jsonl` | frame lexicons and board simulation |
| `synthesis/scripts/compound_squares.py` → `tables/compound_squares.tsv` | squares in the compound tiers |
| `phonology/`, `derivation-reduplication/`, `grammatical-paradigms/`, `lexical-fields/`, `phrase-syntagm/`, `historical-structure/` | the six level studies, each with NOTES.md, scripts and tables |


---

## Verification

Two independent verifiers read this report and the analysts' notes and re-ran measurements. Both rated it **sound with fixes**. Their issues are listed here unedited in substance; the report above has not been rewritten to absorb them, so read the two together.

### Fact-check (linguistics) — sound-with-fixes

- **[major] STRUCTURE §5.1 ranks 11 frames "by how well they carry a Jukugo-like tumble (J1–J6)", with the head + modifier union first, a/o and mai/aku 3rd and 4th, and hoʻo- last (11th).** — The order cannot be derived from J1–J6, and over-linking is judged differently from one frame to the next. hoʻo- is ranked last for linking 90% of words, yet the union ranks first at 74–79% linked. a/o and mai/aku are "predicted to over-link like hoʻo-" (an inference, never simulated) and are excluded by DESIGN §4.3, yet they rank 3rd and 4th. Frames of 4 pairs (limbs) and 17 nights (moon) rank above hoʻo-, which has ≈190 attested pairs and is the best on J2 and J5. Kin GEN × SEX (2nd) is called "a sub-family of rank 1" in the same table. The ranking orders frames by kind (lexical before grammatical), not by the criteria it cites. *Fix:* Replace the single rank with a scorecard: one row per frame, one column per criterion J1–J6, each cell measured or marked unverified. Split it into three groups: frames that can fill a board on their own (only the union, the phrase tiers and hoʻo-), sub-families of the head + modifier syntagm (kin, limbs, ʻaina/aloha × time of day), and closed or grammatical grids. If any rank stays, state the weighting.
- **[major] Rank-1 board figures: the union deals with 0.8% stalls, 7% repeats and 74% linked, and its sensitivity is "low–moderate" (§5.1, §5.2).** — The lexicon behind these figures is not built to the standard DESIGN sets, and it is held to a weaker standard than the compound tier it is compared with. (1) `synthesis/scripts/frames_lexicons.py` keys every unit by spelling. DESIGN §2B requires a stone to be a root in sense, yet 23 of 54 heads and 6 of 59 modifier columns have homographs (phrase-syntagm §9). Links and turns through homographs are counted as true. (2) No DESIGN §4.3 screen was applied, although the compound tier of 128 was screened. `sim/lex/phr_stable.json` contains *hale kope* and *hui pepa*, and DESIGN §4.3 names kope and pepa as excluded borrowings. It also contains 13 *puke* X units (Wiktionary: borrowed from English "book"), *papa kamepiula*, *kanaka/wahine/hana kilokilo* (Andrews–Parker: "magical … an enchantment"), *kiʻi akua* and *aupuni kiwikā* (from the bot stubs). The union adds *hale kupapaʻu* and *ʻaumakua*. (3) About 15% of sampled squares (6 of 40) rest on extraction noise, pairs that are not constituents. These were left in. *Fix:* Rebuild the phrase and union tiers to the compound tier's standard. Remove borrowings and §4.3 items, split homographs into senses (lua¹/lua²) and drop non-constituent pairs. Then simulate again. Until that is done, label the rank-1 row "unscreened, spelling-keyed, upper bound" and its sensitivity "not screened".
- **[major] The analysis maps two kinds of meaningful commutation: (a) lexical signs, open, sign-constant; and (b) closed grammatical paradigms, proportional. Head + modifier squares are 45% P, 25% L, 30% X.** — It misses a third kind, which sits between the two and is the closest analogue of the jukugo 大/小, 新/古, 前/後 columns. These are lexical polar modifiers that flip one content component under a constant head. `phrase-syntagm/scripts/colloc.py` sets nui, iki, liʻiliʻi, hou, mua, hope, loa and ʻole aside as "grammatical" (GRAM), but keeps kahiko. DESIGN's own examples treat LOA and NUI as roots (ALA·LOA → ALA·NUI). Measured here (`critic-completeness/antonym_columns.py`, stable pairs): nui takes 25 heads, mua 18, hou 13, liʻiliʻi 10 and kahiko 10. Heads attested with both members of a pair: nui/liʻiliʻi 6, hou/kahiko 5, mua/hope 5. In compounds (`polar_pairs.py`), DESIGN's flagship meaningful tumbles (naʻauao ↔ naʻaupō, ʻauinalā ↔ ʻauinapō, kinopaʻa ↔ kinowai) are 3 of the only 3 polar pairs among the 128 attested compounds. There are 15 among the 905 candidates, and paʻa·kai : wai·kai is spurious. So the examples that make the design feel meaningful are nearly the whole attested supply. The synthesis never measures this. *Fix:* Add the polar-modifier class to §1 and §3.5. Report how many of a frame's turns flip a single component (polar or componential) and how many change only the kind. Put polar columns back into the phrase tiers as a separate variant, since they will also over-link: a NUI block sits on 25 heads. State the 3-of-128 figure beside DESIGN's examples, as an observation and not a proposal.
- **[major] §0 and §3.5: "The phrases are more transparent: two-word units are 90% transparent against 56% for one-word units." The same figure is used to support line truth in the rank-1 frame.** — The 90% vs 56% was measured on the roots study's 905 reviewed compound candidates, split by their attested modern spelling (phrase-syntagm §4.2a). It was not measured on the 565 corpus-stable free phrases that drive the rank-1 simulation. For those phrases the only content measure is the square check: 45% P, 25% L, 30% X. STRUCTURE also drops the phrase study's own caveat that the transparency coding may be circular, because reviewers may judge a word written solid as more opaque (§13.6). *Fix:* Say that 90% describes dictionary or reviewed two-word compounds. Cite the 18/10/12 square check for corpus phrases. Restore the circularity caveat.
- **[major] §5.3 frame 1 and §6.3: compounds and phrases "complement each other by semantic field", and admitting phrases "changes which fields the board shows. Spaced phrases lean towards institutions and artefacts; solid compounds hold nature and body vocabulary."** — This is stated as a fact about Hawaiian, but it rests on one encyclopedic corpus (41% of pages are bot stubs) and a head list chosen by frequency in that corpus. Other local evidence points the other way. The P&E spellings that POLLEX carries write nature terms as two words: *lau hala*, *wai puna*, *kai piʻi*, *make wai*, *limu kala*, *hōkū ahiahi*. Wiktionary has 7 two-word *hōkū* headwords. Nobody measured how the 804-unit union spreads across DESIGN §3.5's eight fields (lani, kai, ʻāina, ulu, kanaka, hana, naʻau, hele). Its top heads are mea 17%, then hana, hui, poʻe and papa: modern institutional vocabulary. That bears directly on whether rank 1 suits the approved tone and map. §8 lists this as an open question, but §5–§6 already state it as settled. *Fix:* Reword it as a hypothesis specific to this corpus. Code the union by DESIGN's eight fields and report the shares beside Jukugo's field shares. Add fit to the eight fields as a measured column, not as a design choice.
- **[minor] §0 and §4: the owner's point is "now measured three independent ways", and the offset test is "a new test" with a random baseline of 0%.** — Relatedness (the phonology study) and proportionality (the synthesis) use the same Wiktionary glosses and the same kind of tf-idf, so they are not independent. The offset test has demonstrably low power. It finds only pairs whose glosses follow a template ("plural of X"): it misses *kupuna : kūpuna*, finds 12 of 30 known possessive proportions, and its 0-against-0 comparisons carry no statistical information. The conclusion still holds, because it rests on reading all 53 ʻokina pairs and on the POLLEX etymologies (85 of 89 pairs unrelated). *Fix:* Say "two largely independent lines (a hand reading of every pair, and POLLEX etymology), plus a gloss-based check". Calibrate the offset test in the text: it recovers 10 of 11 known plurals and 12 of 30 known possessive proportions, so a 0 elsewhere rules out only template-glossed series.
- **[minor] §3.2: a small inventory and dense neighbourhoods are "why a one-mark tumble almost always lands on *some* real word".** — Measured, only 886 of 1,721 content forms (51%) have any one-segment neighbour. ʻokina and length neighbours are far rarer: 53 and 36 pairs. Also, the owner's own example kai → kā (diphthong to long vowel) falls outside the minimal-pair definition (phonology §1). STRUCTURE never says this. *Fix:* Write "about half of content forms have a one-segment neighbour, and few have an ʻokina or length neighbour". Add one line noting that kai ↔ kā-type changes were not counted, and why the conclusion still extends to them, or label it unverified.
- **[minor] §6.3 "The two-word decision is larger than a spelling allowance. The phrase end supplies the density…"; §6.1 "The compound frame is the right construction, cut at its least favourable end"; §7.1 "Have the Pukui & Elbert check record two-word headwords alongside the 905 compounds."** — These lines drift toward reinterpreting decisions the owner has already approved. DESIGN §2B admits two-word units "written as Pukui & Elbert write them", and §4.1 makes P&E the authority. Reading that allowance as covering corpus-attested free phrases widens an approved scope. §7.1 changes the protocol of the P&E check in DESIGN §9. "The right construction" is a design verdict. The header disclaimer does not neutralise any of this, given the owner's instruction not to change the design without approval. *Fix:* Rephrase each line as an observation with its evidence ("P&E headwords and corpus phrases are the same construction; corpus phrases are denser but not P&E-attested"). Turn §7.1 into a question for the owner ("would the owner want the P&E check to note two-word headwords?"). Drop "right construction".
- **[minor] STRUCTURE is silent on kaona, punning and Jakobson's poetic function. A grep of all seven notes finds no "kaona", "pun" or "poetic".** — There is no overclaim, which is good. But the owner's "maybe there's something else" invites the obvious objection that Hawaiian tradition does exploit near-homophones: homonyms are "enjoyed in puns and word play" and carry kaona, according to the publisher's description of Elbert & Mahoe 1970, *Nā Mele o Hawaiʻi Nei* (https://uhpress.hawaii.edu/title/na-mele-o-hawaii-nei-101-hawaiian-songs/; not read). Kamehameha Schools' Kaʻiwakīloumoku also publishes kaona essays (https://kaiwakiloumoku.ksbe.edu/article/moolelo-ke-mele-a-me-ke-kaona-aloha-ka-uka). In structural terms this is Jakobson's poetic function ("Linguistics and Poetics", 1960): equivalence in sound becomes meaningful in parole, in a given text, without being a proportional opposition in langue. Leaving it out lets a reader think the analysis did not consider it. Including it carelessly would overclaim. *Fix:* Add a short, bounded paragraph. Wordplay and kaona are contextual and not proportional. They cannot be measured from dictionaries or Wikipedia, and they need a fluent cultural reader. They do not reopen the lexical one-mark tumble in structural terms. Name no specific pun. Say that whether sound-play matters artistically is a separate question for the owner.
- **[minor] §1: Jukugo's compounds "are not strictly proportional either" (labelled not measured). §5.2 compares the frames with Jukugo only on stalls, repeats and links.** — Jukugo's word list is local, so the baseline could have been measured. `critic-completeness/jukugo_squares.py` finds 1,649 words, 411 formal squares and 42% of words in at least one square, with slots that are close to symmetric (8.4 and 5.5 alternatives). The phrase frame has 61% of pairs in squares but asymmetric slots (2.6 and 45). Jukugo's squares are mixed in content. By my unverified reading, 天文/天気/本文/本気 and 地形/地点/原形/原点 are not proportional, while 南国/南極/北国/北極 and 夏場/夏至/冬場/冬至 are. So "45% fully proportional" has no reference point. The simulation also never records how turns split between the two slots. In the phrase frame nearly all turns will be modifier turns, and the lines will gather on a few heads, which is a different feel from Jukugo, where both stones turn. *Fix:* Hand-code 40 Jukugo squares with the same P/L/X scheme. Report the share of turns by slot for each tier.
- **[minor] Inherited compounds: "155 POLLEX root + root rows, 78 strict" (§3.7, §6.5).** — The phrase study counts 150 inherited, still-analysable compounds (120 solid, 11 hyphenated, 19 spaced). The historical study counts 155, 22 of them two-word. STRUCTURE uses one set of figures and does not reconcile the two. A further point: 88 of the 148 corpus-stable compounds are A* (Andrews-only spellings reconstructed from the parts). They are promoted by a corpus bigram match, with no constituency check, so they carry the same extraction-noise risk as the phrases. *Fix:* Reconcile 150 and 155 (different filters) in §2. Note how many of the 148 corpus-stable compounds are A* and that their bigram attestation was not checked by hand.

Not covered:

- Polar or antonymic lexical modifiers as a third kind of commutation, between lexical and grammatical (nui/liʻiliʻi, hou/kahiko, mua/hope, ao/pō, lā/pō, paʻa/wai), and the share of turns in any frame that flip a single component
- A Jukugo baseline measured with the same tools: P/L/X coding of Jukugo squares, slot symmetry, and turns by slot in the simulation
- How the rank-1 union spreads across DESIGN §3.5's eight fields, and whether the board would read as modern institutional vocabulary (mea, hana, hui, papa, aupuni)
- A sense-keyed, §4.3-screened and noise-filtered rebuild of the phrase and union tiers before any board comparison
- Saussure's relative motivation (arbitraire relatif) as the governing concept: transparency is a measure of relative motivation, and opaque compounds are absolutely arbitrary signs
- Jakobson's poetic function and kaona or punning, as a bounded note on parole-level sound-play that does not reopen the lexical one-mark tumble
- Onomastics: place names are the densest transparent two-root compound system (Wai-, Kai- …); they are excluded by DESIGN §3.1 and §4.3, but the report should say they were left out on purpose
- The hōkū + modifier paradigm (hōkū hele, hōkū paʻa, hōkū ahiahi < *fetuqu-afiafi; 7 two-word Wiktionary headwords) as a nature-field phrase series that bears on DESIGN open question 3 (star names), noted as research only
- The closed TAM paradigm (ua V, e V ana, ke V nei) and the privative modifier ʻole, as further proportional slots in the verb and noun phrase, even if grammatical
- Sources: Schütz 1981 'A reanalysis of the Hawaiian vowel system' (relevant to kai vs kā), Wilson 1976 on o/a, a nūpepa corpus (Papakilo) to test the corpus-based field split, Kamehameha Schools / Kumukahi materials; Elbert & Pukui 1979 remains unconsulted

### Completeness and judgement critic — sound-with-fixes

- **[major] STRUCTURE §5.3(5): 'Deixis has a defective column: kēnā has 1 token against kēia 1,109; Lyon 2018 calls the second-person forms obsolete or rare.' Also grammatical-paradigms §0.3 ('the near-addressee column is obsolete or rare', Lyon 2018), §5.2 ('functionally binary in written Hawaiian') and STRUCTURE's 'about 6 live cells' for the deixis grid.** — This misreports the source. Lyon 2018 (src/lyon_demonstratives.txt, lines 116–151 and 316–322) says postposed nā, pēnā, demonstrative nā and ua…nā have almost disappeared. He also quotes Elbert & Pukui 1979:111–12 that 'kēnā is equally suitable and more common', and says 'kēnā seems to have largely replaced demonstrative nā'. In that source kēnā is the living second-person form. The 1-token count (re-run: kēnā 1 + undiacritised kena 2) comes from an encyclopedic corpus that has almost no addressee. The other support is 19th-century: Andrews–Parker calls kēnā a 'variant of kela', and Alexander §43 and Andrews 1854 §152 leave it out. Even so, the A–P entry's own example uses kena ('e like me kena olelo'). *Fix:* Restate the grid: the second-person column is lost in the postposed slot (nā), the pē- series (pēnā) and the anaphoric slot (ua…nā). Determiner kēnā survives and is 'more common' than demonstrative nā (E&P 1979 via Lyon). Its rarity in hawwiki is a genre effect. Count kēnā as a live cell (7, not 6). Drop 'functionally binary' or limit it to the postposed and manner slots. Mark the Andrews and Alexander evidence as 19th-century.
- **[minor] STRUCTURE §0 History: 'The four exceptions are two variant pairs (auaneʻi/aʻuaneʻi, ʻao/ʻaʻo) and two possessive pairs'. Historical §2.1: ʻao/ʻaʻo 'POLLEX assigns both to *kao'.** — Re-run (factcheck/scripts/mark_pairs.py) reproduces 89 pairs with 4 'related', but ʻao/ʻaʻo is a false positive of the same-proto-string rule. POLLEX has ʻao 'new shoot' < *kao (PEP) and 'dried taro' < *kao (PNP), against ʻaʻo 'Newell's shearwater' < *kao 'green heron' (level code OC). These are different entries that share a string, the same trap as *mata 'eye'/'raw'. Wiktionary derives ʻaʻo from *fuakoo. They are not variants of one word. *Fix:* Report 86/89 unrelated and 3 related: one spelling variant (auaneʻi/aʻuaneʻi) and two possessive pairs. Change the relatedness rule to require the same POLLEX entry, not the same proto string.
- **[minor] STRUCTURE §3.3: 'Andrews–Parker writes Kou as one headword "Your; My", so in 19th-century spelling the contrast was not written'. Grammatical-paradigms §0.4: 'koʻu and kou were the same written word'.** — A–P has two separate pronoun entries spelled 'Kou' (lines 48251 and 48255), not one headword. Alexander 1864/1920 §4 also says the glottal stop 'is represented by an apostrophe, in a few common words, to distinguish their meaning, as ko'u, my, kou, thy'. Parker writes A'u, Ka'u, Na'u, No'u, O'u. So 19th-century writers did sometimes mark exactly this ʻokina. *Fix:* Correct the wording. Add Alexander §4 as independent evidence: the one significant ʻokina is the one missionary-era writers chose to mark. This supports the report's main point.
- **[minor] V + mai/aku: '10 pairs glossed in public-domain sources', including 'mao mai/aku' (STRUCTURE §5.3(4), grammatical-paradigms §6.2).** — A–P line 65224 has 'Mao (ma'-o'), adv. There; over there; at that place; yonder … mao aku, beyond; mao mai, from over there this way'. This is the locative ma ʻō in unmarked spelling, not a verb. *Fix:* Report 9 glossed verb pairs (+ hō listed). Move mao (= ma ʻō) + DIR to PREP × LOC, where it still shows toward/away.
- **[minor] STRUCTURE §5.1 rank 7 and lexical-fields §4.3/§11: 'makai also "policeman"' (sensitivity / homograph).** — Wiktionary has makai 'seaward' and mākaʻi 'police officer; to inspect' as different words. They are homographs only in Andrews' unmarked spelling. *Fix:* Drop this as a homograph in modern spelling, or state that it applies only to unmarked 19th-century text.
- **[minor] Moon PHASE × ORDINAL: '1 pseudo-member (Kulua 17)', which 'looks like Kū + lua but P derives it from PCE *turu'.** — The PVS page spells night 17 'Kulua' but notes that Handy & Pukui give 'Kulu'. Kulu is the regular reflex of PCE *turu ('a night after the full moon'; Tahitian turu '17th night', Marquesan tuu '17e jour'). The POLLEX row is the P&E form 'Kū lua', glossed as both the 4th day (a frame member) and the 17th. So the *turu row does not separate a pseudo-member from the frame. *Fix:* Report night 17 as Kulu (Handy & Pukui; Kulua in PVS) < PCE *turu, outside the Kū × ordinal frame. Note that POLLEX/P&E run it together with Kūlua (night 4). Also report that POLLEX reconstructs the night names themselves as night names at PCE/PEP (kū, lāʻau-, kāloa, ʻole, hoku, mauli, muku…). The frame's names are inherited more firmly than the report says.
- **[minor] STRUCTURE §3.6/rank 9: 'the digit frames: ʻe-, Pōʻa-, hapa-, kana-', 100% compositional (origin not stated). Lexical-fields: ʻa- 'serial "N times"'.** — hapa is 'introduced into the Hawaiian language' from English half (Alexander §33; Wiktionary 'Borrowed from English half'). kana- for 50–90 was 'introduced by the American missionaries' (Alexander §29; Andrews 1854: 'a modern improvement'). Pōʻa- weekdays are post-contact. Only ʻe-/ʻa- (and kana- in 30 and 40) are traditional. Alexander §31 and Andrews 1854 describe ʻa- as the counting prefix, with ʻa-/ʻe- chosen to match the question word (ʻahia → ʻalua, ʻehia → ʻelua). 'N times' is only one Wiktionary sense. *Fix:* Label hapa-, kana-50–90 and Pōʻa- as 19th-century coinages (hapa a loan). Describe ʻa- as the counting prefix, with question-word agreement per Andrews 1854.
- **[minor] Grammatical-paradigms §3.1: 'au / wau … not in POLLEX as a pronoun', '9 of 12 are in POLLEX. The three missing are au, wau and ʻolua'. Historical §2.5: 'hoʻokahi < *faka-tasi (216 tokens)'. Lexical-fields 'lau 400 (PPN *lau)' vs historical 'lau "400" < *rau "hundred"'.** — POLLEX has '(W)au' < *au 'First person singular pronoun'. The parenthesis defeated the matcher; the synthesis fixed ʻōlua but not au. POLLEX gives the numeral prefix 'Hoʔo- prefixed to the numeral one, except when counting' < *soko- (PNP); *faka-tasi is hoʻokahi 'together, unite', so the 216 tokens of numeral 'one' are counted under the wrong etymon. lau 'four hundred' has two POLLEX rows, *lau 'indefinite large number' and *rau 'hundred', and each study cites one. *Fix:* Say all 12 pronouns are in POLLEX. Put the numeral hoʻo- under *soko-. Give both POLLEX assignments for lau.
- **[minor] STRUCTURE §3.2: 'Parker Jones 2018 (JIPA) gives eight consonants, with [k~t], [l~ɾ] and [w~v] as free variants.'** — According to the Cambridge article page, Parker Jones calls [w]/[v] free variation and treats [l]/[ɾ] as possibly free. For [k]/[t] he says Hawaiian 'lacks a contrast', ties it to a historical T-dialect/K-dialect split (Niʻihau keeps t), and notes that tapa/kapa are both acceptable. He also writes the labial phoneme /v/, not /w/. *Fix:* Say: no contrast; [k]~[t] dialectal/lexical (T vs K dialects, Niʻihau); [w]~[v] free; [l]~[ɾ] variable.
- **[minor] Synthesis correction: 'Hawaiian ties with Tahitian for the fewest outcome classes (9; Māori 10, Samoan 11, Tongan 12)'.** — The tie holds only when the modal reflex counts as a merger. In Table 1 Tahitian *f>h is 62% (f kept before a/e/i) and Māori 52%, against Hawaiian 99%. Counting distinct reflex phonemes gives Tahitian 10 and Māori 11. The original claim was defensible and the 'correction' depends on the counting rule. *Fix:* State the rule: 'by modal reflex, Hawaiian and Tahitian 9; counting conditioned splits, Hawaiian alone has 9, and its four mergers are each ≥95% complete.'
- **[minor] STRUCTURE §3.4: closed prefix 'kai- (kin reference)', 5 pairs, 100% regular.** — The pairs and the value both come from Wiktionary etymologies and its prefix gloss ('to form terms of reference'; the bare kuaʻana and kuahine are glossed 'term of address'), so 100% is circular. The bases kamahine and koʻeke are not Wiktionary headwords. A–P has no matching bare-stem address entries apart from Kuahine. POLLEX marks kai- with '/' (Kai/kaina) as material outside the cognate. *Fix:* Label kai- = reference vs bare = address as a Wiktionary description, not checked against a grammar. Report regularity as 'defined by the source'.
- **[minor] STRUCTURE §3.5: 'aʻe/iho is barely spatial in modern text: 0 of 30 sampled aʻe'.** — 27 of the 30 sampled aʻe tokens are lexicalised ʻē aʻe 'other'. In the cleaned corpus, 297 of 425 aʻe tokens follow ʻē. So the sample holds only 3 other tokens. Re-run hosts include ulu aʻe 11 and piʻi aʻe 3, which are arguably upward. *Fix:* Report it as: 'aʻe is dominated by ʻē aʻe (70% of tokens); spatial uses are a small minority (≈3–4% of tokens, e.g. ulu/piʻi aʻe).'
- **[minor] STRUCTURE §3.1 morphemes row: 'replacives (plural length, 1sg -ʻu)'. §1: 'Trubetzkoy would call ʻ : Ø a correlation'.** — -ʻu : -u is two additive suffixes (or ʻ added), not a replacive in Bloomfield's sense; plural lengthening is the replacive. Trubetzkoy's 'correlation' is a series of privative oppositions between phoneme pairs that share a mark (vowel quantity is one). Presence against absence of /ʔ/ is not an opposition between two phonemes. *Fix:* Call -ʻu/-u a suffix pair (portmanteau with the a/o vowel), and keep 'replacive' for plural length. Say 'ʻ vs Ø recurs only as distinctiveness', and keep 'correlation' for quantity.
- **[minor] Kin GEN × SEX: 'All 8 cells are attested in the cleaned corpus'. Plural series: 'Wiktionary 11/11'.** — Re-run (kin_frame.py) confirms 8/8, but moʻopuna kāne and moʻopuna wahine are 1 token each. In the plural series, mākuahine (0 corpus tokens, no POLLEX) and kāhiko (5 tokens, no POLLEX) rest on Wiktionary 'plural of' glosses alone. *Fix:* Give the per-cell n. Mark mākuahine and kāhiko as Wiktionary-only until P&E is checked.
- **[minor] STRUCTURE §3.4: fossil prefixes have 'low' productivity '(POLLEX reconstructs them)'. §3.5: 'Wilson 1980 says it is "difficult to find nouns that cannot be used with both A and O"'.** — Being reconstructed says nothing about productivity: hoʻo- < *faka- is reconstructed and productive. Wilson's sentence is about 'Polynesian languages' in general, illustrated with a Hawaiian pair (koʻu/kaʻu inoa). The quote itself is verbatim (wilson1980.txt line 1579). *Fix:* Give a measured basis for low productivity (types, hapaxes), or drop the parenthesis. Cite Wilson as a Polynesian-wide generalisation.

Not covered:

- Kēnā as the living second-person determiner (E&P 1979:111–12 via Lyon) is absent; the deixis grid and its 'defective column' reading need restating.
- Independent 19th-century evidence for the significant ʻokina is not used: Alexander §4 says the apostrophe was written precisely to distinguish koʻu 'my' from kou 'thy', and Parker writes A'u/Ka'u/Na'u/No'u/O'u.
- The numeral prefix paradigm leaves out Andrews 1854's agreement fact (ʻahia → ʻalua…, ʻehia → ʻelua…). It also leaves out the cardinal hoʻo- before kahi (Alexander §31; POLLEX *soko-) as a third member of the prefix slot.
- The moon frame understates its inheritance: POLLEX reconstructs the night names as night names (PCE/PEP) with Māori, Tahitian and Marquesan cognates. Night 17 is Kulu < *turu (Tahitian turu '17th night').
- Origin of the digit frames: hapa (English half), kana- 50–90 (missionary analogy from kanakolu/kanahā) and Pōʻa- weekdays are post-contact, and the report should say so wherever 'inherited' is discussed.
- Still unchecked against Pukui & Elbert 1986 / Elbert & Pukui 1979 (no study consulted them): ʻolua vs ʻōlua, the ʻe- vs ʻē- prefix, kāhiko and mākuahine as plurals, phrase headwords, moon-night spellings.
- Closed paradigms not examined for proportionality: TAM particles (ua / e … ana / ke … nei), interrogatives (āhea 'when, future' / ināhea 'when, past', POLLEX *qaa-fea / *ina-fea), object/agent markers (i/iā, e).
- All hand codings (94 a/o noun types, 158 minority tokens, 144 directional tokens, 88 flagged minimal pairs, 40 phrase squares) are single-coder with no speaker check. The report says so, but the frame ranking leans on them.

