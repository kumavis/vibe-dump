# Hawaiian at the phrase level: head + modifier syntagms as a two-slot frame

Research only. Nothing here changes or proposes changes to the Pōhaku Tumble design;
the owner approves design changes. Where a frame could support a kind of piece, that is
noted briefly as an option, nothing more.

Level: **the phrase syntagm** — the noun phrase `(DET) HEAD MODIFIER…`, compared with the
one-word compound. Every number below comes from a script in `scripts/` (outputs in
`tables/`), or is cited, or is labelled *unverified*. "Attested in the data" (measured
here) is kept apart from "described in grammars" (cited).

---

## 0. The question and the short answer

The Jukugo tumble works because each block is a sign and the word is a two-slot syntagm
in which commuting one sign changes the content in a way the remaining sign helps you
read (Hjelmslev's commutation on both planes). The question for this level: does the
Hawaiian **head + modifier phrase** (hale pule "house [for] prayer") give a truer and
denser two-slot syntagm than one-word compounds, and how much of it can be verified?

Short answer, measured:

1. **The phrase frame is real and strictly head-initial.** In the corpus, a stative
   modifier follows its head 657 times and precedes it 4 times (99.4%) (`order.py`);
   WALS codes Hawaiian Noun–Adjective, Noun–Genitive, VSO, citing Elbert & Pukui 1979.
   In a random sample of 40 of Wiktionary's two-word noun units, 37 are head-initial
   endocentric (`tables/wikt_headinitial_sample.tsv`, hand-coded, §3.1).
2. **It is more transparent than the compound frame, so lines between identical blocks
   are truer.** Of reviewed compounds whose modern spelling is known, units written as
   two words are 90% transparent (127/141), units written as one word 56% (134/241). Opaque
   or partly opaque units are written as one word with 7.2× the odds of transparent ones
   (χ² = 48.8, 1 df) (`ortho.py`). The Hawaiian Lexicon Committee's own guidelines draw
   the same line: descriptive terms whose meaning "should be rather easily grasped" are
   phrases (ala mōlehu, uila māhu pele); combinations whose meaning "will probably not be
   immediately apparent" are single words (hamulau, poelele) (Kimura & Counceller 2009,
   guidelines 5 and 6).
3. **It is much denser.** For 46 common heads, the Hawaiian Wikipedia corpus gives 565
   head + modifier pairs seen at least twice on at least two pages, forming **1,717
   formal proportional squares** (h1m1 : h1m2 :: h2m1 : h2m2, all four attested); 61% of those
   pairs sit in at least one square. The one-word compound frame has **0 squares** among
   its 106 Wiktionary-attested candidates, 45 among the 506 reviewed keep/keep-pending
   candidates and 143 among all 905 (`grid.py`, `compound_grid.py`).
4. **But the squares are only partly proportional in content.** A hand check of 40 random
   squares (KWIC evidence for every pair): **18 truly proportional** (both the row
   difference and the column difference are constant), **10 loosely proportional** (the
   relation between head and modifier shifts), **12 broken** (6 spurious or
   non-constituent pairs from the automatic extraction, 5 polysemous heads, 1 modifier
   sense shift) (`tables/square_sample_coding.tsv`). The relation between head and modifier is
   **not marked in the expression** (no linker), so agent, patient, purpose, possessor,
   quality and so on all share one slot: mea kākau "writer" (agent), mea ʻai "food"
   (patient), mea kaua "weapon" (instrument), mea koʻikoʻi "important thing" (quality).
5. **It is weakly verifiable in dictionary terms.** Only 5.7% of the 1,960 observed pairs
   (23% of the 70 most frequent) are attested in Wiktionary, POLLEX, Andrews 1922 or the
   roots-study reviews (`attest_summary.py`). Free phrases are not dictionary entries by
   nature; what verifies them is attested use plus the grammar. Pukui & Elbert *do* list
   many two-word phrases as headwords (hale kuke, hale kula, hale holoholona: Hosoda
   2019, §2.5.3) but could not be consulted. The best dictionary-backed phrase rows in
   the local data are Wiktionary's derived lists: **palapala + X** (117 forms, e.g.
   palapala hānau, palapala hoʻolimalima) and **kahu + X** (44 forms, e.g. kahu hipa,
   kahu maʻi), given as forms without glosses.
6. **The written word boundary is not a linguistic unit at this level.** Andrews 1922
   writes every compound solid (0 genuine two-word headwords among ~15,900 headword
   lines); modern writing splits transparent ones. In Hawaiian Wikipedia, 149 lexical
   pairs occur both spaced and solid; of the 95 with ≥ 5 tokens, 32 are genuinely mixed
   (20–80% solid) (kiʻi ʻoniʻoni 381 spaced : 206 solid; keiki kāne 20 : 21; kaha kiʻi
   28 : 25). The space-versus-solid opposition is a gradual, unstable orthographic correlate
   of lexicalisation, not a distinctive opposition of the language (§4, §10).

So yes: as a commutation frame the phrase syntagm is truer (its signs keep their meanings)
and far denser than one-word compounds. Its weaknesses are different ones: the relation is
unmarked, some heads are polysemous (kumu, papa, mea), and dictionary-grade verification
is thin. Where the paradigm lives also depends on the semantic field. For artefacts and
institutions (hale, papa, puke, luna, ʻōlelo, kiʻi) it lives in **syntax** (spaced
phrases). For nature and body words (wai, lau, maka, ala, kai, pō) it lives in the
**lexicon** (solid compounds); in this corpus those heads have almost no phrasal paradigm
(§5.3, §4.2c).

---

## 1. Data, method, conventions

| source | what it gives here | file |
|---|---|---|
| Hawaiian Wikipedia dump (local) | running modern text: 310,077 tokens, 49,694 sentences, 2,931 article pages after filtering | `scripts/corpus_pages.py` → `corpus_pages.pkl` |
| Wiktionary (kaikki-haw.jsonl) | headwords with spaces (322), their POS/glosses; derived/related lists (650 two-word forms in all) | `scripts/lex.py`, `inv01_wiktionary.py`, `wikt_grid.py` |
| POLLEX Hawaiian reflexes (98% cited to Pukui & Elbert 1986) | P&E spellings of inherited items, incl. reconstructed compounds | `inv02_pollex.py` |
| Andrews–Parker 1922 OCR | 10,459 distinct headwords (14,879 entries) parsed; etymology brackets | `lex.andrews()`, `andrews_joined.py` |
| roots study: 905 compound reviews | verdict, transparency, attested word break | `lex.reviews()`, `ortho.py`, `compound_grid.py` |
| grammars / guides (web) | head-initial order, word division conventions | §14 |

**Corpus filter.** Copied from the sibling grammatical-paradigms study (credited in
`scripts/common.py`): a three-pass filter for machine-made pseudo-Hawaiian that drops
101,965 tokens (83,962 + 8,201 + 9,802). Measured bias that remains: **1,202 of the 2,931
kept pages (41%) are bot stubs on Spanish municipalities**. They hold 22,369 tokens (7%)
and contribute 1,242 of the 8,528 head + modifier tokens, 1,198 of them a single pair
(aupuni kiwikā "municipality"); otherwise their effect is negligible. Hawaiian Wikipedia
is encyclopedic, so biographies, institutions and media are over-represented and
nature/traditional vocabulary is under-represented. The tokeniser drops digits, so
"ka lā 4 Iulai" yields a spurious adjacency lā Iulai (month names are excluded from the
grid as proper names anyway).

**The frame.** `DET HEAD X` where DET ∈ {ka, ke, nā, he, kēia, kēlā, kēnā, ia, kekahi,
mau, kona, kāna, koʻu, kaʻu, kou, kāu, ko, kā, kō}. The determiner marks HEAD as a noun,
which matters for heads like ala (also the demonstrative "that"), lā (also the
particle) and luna (also "above"). X must be a native-spelled word (CV
phonotactics) not in a stoplist of particles, pronouns and possessive forms. A closed
class of grammatical modifiers (ʻole, loa, hou, mua, hope, like, ʻē, nui, iki, liʻiliʻi,
ponoʻī, numerals) is kept but flagged `gram` and left out of paradigm and grid counts.
Modifiers capitalised in more than half their uses (mostly names and ethnonyms: ʻōlelo
Hawaiʻi, lā Iulai) are counted separately (§7.4).

**Measures.** f = tokens in the DET frame; df = distinct pages; PMI = log2(f_bigram·N /
f_head·f_x) over the whole corpus; G² = log-likelihood ratio of the 2×2 table (≥10.83 ≈
p < .001). "Stable" = f ≥ 2 and df ≥ 2. "Assoc" = stable and PMI ≥ 3 and G² ≥ 10.83.
Attestation codes: W2/W1 Wiktionary written as two words / one word; P2/P1 POLLEX; A1
Andrews 1922 headword (always solid); R:verdict a roots-study review.

**Heads.** The 11 requested (hale, wai, lau, kumu, hua, ala, mea, kanaka, wahi, lā, pō)
plus 43 other frequent nouns, 54 in all (`colloc.py HEADS`). 46 of them yield at least
one stable lexical pair.

---

## 2. Units and oppositions at this level

**The syntagm.** NP = (DET) N₁ (N₂ | V | stative)* (DEM / POSS phrase). Modification follows
the head (described: Elbert & Pukui 1979 via WALS 87A/86A; measured: 657 : 4). The phrase
is endocentric and determinative: the modifier narrows the class the head names (hale →
hale pule). Hawaiian content words are largely multifunctional. Of the 645 stable
head–modifier types, the modifier has both noun and verb entries in Wiktionary in 283,
verb only in 106 and noun only in 68; 188 lack Wiktionary POS (`paradigm_summary.tsv`). So
the slot is defined by **position**, not word class: nouns, active verbs and statives all
fill it.

**The two slots are asymmetric** (unlike a jukugo, whose two kanji are formally equal):

| slot | paradigm | measured size (stable pairs, 46 heads) |
|---|---|---|
| head | relatively closed: common nouns of place, person, thing, artefact, group | a modifier occurs with 2.6 other heads on average; 378/565 pairs have ≥1 head alternative |
| modifier | open: any noun, verb or stative | a head occurs with 45 other modifiers on average (mea alone has 131); 557/565 pairs have ≥1 modifier alternative |

**Oppositions at this level, in Trubetzkoy's terms:**

- **Head : head under a constant modifier** (hale noho : wahi noho "dwelling house :
  dwelling place"). Equipollent lexical oppositions. They are proportional across a
  modifier column wherever the relation stays the same (§7).
- **Modifier : modifier under a constant head** (hale pule : hale kūʻai : hale ʻaina).
  Saussure's associative series in the strict sense: a paradigm defined by one shared
  sign and one shared relation ("house for X-ing"). Equipollent and multilateral.
- **Relation types are not opposed in the expression.** Agent, patient, instrument,
  purpose, possessor, material, quality, origin and time all occupy the same slot with no
  marker. In Hjelmslev's terms there is a content distinction with no expression
  correlate: syncretism. The reader resolves it from the two signs (mea kākau = agent;
  mea ʻai = patient). That is why some squares are only loosely proportional (§7.2).
- **Spaced : solid** (hale pule : halepule; kumu kūʻai : kumukūʻai). This opposition is
  orthographic only. It correlates statistically with opacity but is inconsistent within
  one corpus and has flipped historically (§4). It is treated in §10 as non-significant
  at the level of the language system. Whether stress distinguishes compound from phrase
  is not established here (*unverified*; Schütz 2010 argues accent measures are aligned
  with morphemes; see §13).

---

## 3. How many two-word lexical units are there? (attested in the data)

### 3.1 Wiktionary

`inv01_wiktionary.py`, `tables/wikt_multiword.tsv`.

| class | count |
|---|---|
| multiword headword strings (normalised) | 322 |
| two-word common units | 212 (195 with a noun sense, 17 verb-only) |
| proper names | 55 |
| 3+ word units | 28 |
| phrases / function sequences (a me, pehea ʻoe…) | 26 |
| for comparison: one-word root + root compounds Wiktionary analyses (compound2) | 406 |
| two-word forms incl. those listed only under derived/related | 650 |

- Of the 195 noun units: the head is a Wiktionary noun in 190. The modifier is a noun +
  verb word in 101, verb only in 28, noun only in 41, other in 10, not a headword in 15.
- Heads with ≥ 3 two-word headwords: palapala 11, hōkū 7, hoʻokae 6, mea 5, hale 5,
  hua 4, kaha 4, kau 4, ʻaha 4.
- Derived lists make the rows far larger: **palapala 117** (palapala hānau, palapala
  hōʻoia, palapala kūʻai, palapala hoʻolimalima…), **kahu 44** (kahu hipa, kahu kula, kahu
  maʻi, kahu pipi, kahu lio, kahu ʻāina…), mea 13, hale 11, kaha 11, ʻau 9.
- Head-initial check (hand-coded, random sample of 40 noun units, seed 7): 37 head-initial
  endocentric; 3 not (poʻo lua, pau hana, pani hakahaka: exocentric or verb + object).
- Only 9 two-word units also exist as a solid Wiktionary headword (heʻe nalu, hua ʻōlelo,
  nalo meli, hōkū hele, maka keleawe, kahua paʻa, ʻaha mele, pā wai, kula nui).

### 3.2 POLLEX (Pukui & Elbert spellings)

`inv02_pollex.py`, `tables/pollex_*.tsv`.

- 52 reflex rows (51 forms) are written as two or more words: ake loa, hua kāhi, hōkū
  ahiahi, kai piʻi, kai make, lau hala, lau ʻawa, limu kala, make ʻai, make wai, mea ʻai,
  wai puna, wao akua, ʻuku papa…
- 567 reflex rows have a protoform with an internal hyphen. 80 are reduplications and 487 have several parts.
  Restricted to root + root (both parts ≥ 3 letters, no PPN formatives such as \*faka-,
  \*koo-, \*kaa-) **and** both Hawaiian parts still existing as POLLEX Hawaiian forms, there
  are **150** reflex rows of inherited, still-analysable compounds. P&E writes **120 as one word, 11
  hyphenated, 19 as two words (13%)**.
- The 19 written apart are all transparent N + modifier or V + modifier: lau hala
  (\*lau-fala), wai puna (\*wai-puna), make wai (\*mate-wai), mea ʻai (\*meqa-kai), hōkū
  ahiahi (\*fetuqu-afiafi), kai piʻi (\*tai-pii). Inherited age does not decide the
  spelling: \*wai-mata → waimaka (solid) but \*wai-puna → wai puna (apart).

### 3.3 Andrews–Parker 1922: joined forms

`andrews_joined.py`, `tables/andrews_joined.tsv`.

- Andrews writes compounds **solid** (Halepule, Halekula). Among ~15,900 headword lines,
  only 16 match "Word word (pron)", and all are OCR splits or Parker's place names. A few
  are hyphenated (Kahua-pahee, Kokio-ula). There are effectively **no two-word headwords**.
- Formal joined forms (headword = HEAD + another headword, syllable break after HEAD):
  951 for the 54 heads. Precision proxy: of those with an etymology bracket, the bracket
  names HEAD as first part in 280/387. Precision is ~0.9 for hale (32/35), wai (19/21), lau
  (22/25), kumu (8/9), kai (24/27) and poor for short heads (lā 4/19, wā 2/13, pua 2/8),
  which pick up chance matches.
- **hale** in Andrews: 51 joined forms, 32 of them confirmed by a bracket naming hale
  first. Classifying the second part of all 34 entries whose bracket begins with Hale
  (`tables/andrews_hale_relations.tsv`, hand classification) gives: purpose 16 (eating,
  meeting, lodging, school, sleep, play, prayer, tapa-beating, war, corpse, menstrual
  seclusion); material 5 (hau timber, wood, branches, mud, cloth); quality or manner 7
  (shady, floating, swinging, arched, frail, temporary); possessor 1 (aliʻi); other 5.
- Only **13 of the 51** hale joined forms occur in Hawaiian Wikipedia at all. The
  historical dictionary paradigm and the modern encyclopedic paradigm overlap little.

### 3.4 Totals at a glance

| inventory | units |
|---|---|
| Wiktionary two-word headwords (common nouns/verbs) | 212 |
| Wiktionary two-word forms incl. derived lists | 650 |
| POLLEX reflexes written as two words | 51 |
| Andrews 1922 two-word headwords | ~0 |
| one-word compounds, roots study candidates (Andrews/Wiktionary) | 905 |
| head + modifier pairs in hawwiki, stable (46 heads) | 565 |
| … any frequency (54 heads) | 1,960 |

---

## 4. When does Hawaiian write a compound as one word vs two?

### 4.1 Described (sources)

- **Hawaiian Lexicon Committee (Māmaka Kaiao)**, as quoted in Kimura & Counceller 2009:
  guideline 1 lists "join or separate parts of a word or term" among the commonest
  *minor changes* to dictionary words ("terms like a pau (all) and me he (as if) have been
  written as two words instead of one"). Guideline 5: explain a meaning by Hawaiian words,
  so that "its meaning should be rather easily grasped" (ala mōlehu, uila māhu pele,
  kuhihewa o ka maka): these are written as **phrases**. Guideline 6: combine words into a
  **new word** where "the meaning will probably not be immediately apparent… even when
  recognizing the separate parts" (hamulau, kaʻaʻike, kōpia, poelele). The committee's own
  practice ties solid spelling to non-transparency.
- **Pukui & Elbert** list many two-word phrases as headwords (hale kuke, hale kula, hale
  holoholona) (Hosoda 2019, §2.5.3, describing P&E 1986). The US Department of the Interior's
  draft policy takes "the Hawaiian Dictionary (Pukui & Elbert, 2003)" as its "baseline
  standard… for spelling and the use of spaces, diacriticals, hyphens" (513 DM 3, §3.6).
  In practice, word division follows the dictionary entry by entry, not a rule.
- **Elbert & Pukui 1979, p. 124** (quoted by Hosoda 2019, §4.2.2.1): the ligature ā forms compounds
  whose "total meaning is usually somewhat different from the meaning of the parts".
  Non-compositional meaning is again the criterion for compound status.
- **Wilson 1981**, "Developing a Standardized Hawaiian Orthography" (*Pacific Studies* 4:2),
  discusses word division as one of five approaches in Hawaiian spelling history
  ("Anglophile" and "nativistic" approaches "have to do with word divisions") and
  says "the basic problem is to distinguish compounds…". A search-engine summary of the
  article says the 1978 ʻAhahui ʻŌlelo Hawaiʻi recommendations conflict on whether place
  names are written as one word, but agree on writing compounds as one word with few
  exceptions such as Mauna Loa and Mauna Kea. *The full text could not be retrieved*
  (Cloudflare / connection failure), so these points are **unverified** beyond the
  snippets. The Hawaiʻi Board on Geographic Names "generally followed conventions
  developed by ʻAhahui ʻŌlelo Hawaiʻi in 1978" (513 DM 3, §3.9).
- Historical writing had fluid boundaries (Papahānaumokuākea also written Papahānau
  Mokuākea and Papahānaumoku ākea: Hosoda 2019, §5.1).

### 4.2 Measured

`ortho.py`, `tables/ortho.txt`, `tables/ortho_both_spellings.tsv`.

**(a) Transparency × attested word break** (905 reviews; transparency coded by the roots
study's reviewers, word break from attested modern spellings):

| transparency | one word | two words | either | one-word share of known |
|---|---|---|---|---|
| transparent | 134 | 127 | 44 | 0.44 |
| partial | 87 | 12 | 8 | 0.81 |
| opaque | 20 | 2 | 1 | 0.87 |

Transparent vs not × one vs two words: χ² = 48.8 (1 df), odds ratio 7.2. Read the other
way: two-word units are 90% transparent (127/141), one-word units 56% (134/241).

**(b) Same pair, both spellings, same corpus.** 149 lexical pairs occur both spaced and
solid in the filtered Hawaiian Wikipedia corpus (reduplications and prefixes excluded).
That is 1,972 spaced and 2,198 solid tokens. Of the 95 pairs with ≥ 5 tokens: 30 mostly
solid (≥ 80%), 33 mostly spaced (≤ 20% solid), **32 mixed**.

| pair | spaced | solid | note |
|---|---|---|---|
| kiʻi ʻoniʻoni "movie" | 381 | 206 | mixed |
| kula nui "university" | 20 | 217 | Wiktionary headword is spaced |
| papa hana "programme" | 17 | 217 | |
| kumu hana "topic" | 1 | 74 | lexicalised meaning |
| kumu kūʻai "price" | 4 | 32 | lexicalised meaning |
| kumu kānāwai "constitution" | 2 | 19 | |
| mea ʻai "food" | 12 | 61 | other mea + X almost always spaced |
| mea hana | 234 | 1 | |
| mea pāʻani | 103 | 2 | |
| hale pule "church" | 39 | 3 | |
| hale ʻaina "restaurant" | 16 | 7 | |
| makua kāne "father" | 14 | 83 | |
| keiki kāne "boy" | 20 | 21 | mixed |
| kaha kiʻi "drawing" | 28 | 25 | mixed |
| pae ʻāina "archipelago" | 61 | 6 | |
| hōkū hele "planet" | 23 | 1 | |

**(c) Andrews joined forms in modern text, by head.** Of Andrews' solid forms that turn up
in hawwiki at all, they appear (spaced only / solid only / both):
hale 9/1/3 and papa 6/3/1 (mostly spaced); wai 2/5/1, lau 1/7/0, ala 0/6/2 and maka 3/10/0
(mostly solid); kai 5/8/0 and kumu 1/1/1 (split).

### 4.3 What this amounts to

- The written space is a **lexicographic and editorial convention**. It was introduced
  after Andrews (who joined everything), is applied by the dictionary entry by entry, and
  can be changed by the Lexicon Committee as a "minor change". It correlates with
  **transparency/compositionality** (measured, 7.2× odds; described, Māmaka Kaiao
  guidelines 5 vs 6; Elbert & Pukui on ā).
- Within one modern corpus, a third of the common variable pairs are written both ways.
- Across fields, institution and artefact heads (hale, papa, ʻōlelo, kiʻi, luna) run
  spaced, while body and nature heads (maka, lau, wai, ala) run solid.
- For a two-slot piece this means the one-word vs two-word distinction should not be
  treated as a property of the language. "One word" selects the more opaque, lexicalised
  part of a single continuum of N + modifier syntagms.

---

## 5. Head + modifier collocations in modern text

`colloc.py` → `tables/colloc_<head>.tsv`, `colloc_all.tsv`, `paradigm_summary.tsv`,
`top_collocations.md`.

### 5.1 Paradigm size and shape for the requested heads

Modifier counts exclude the closed grammatical class; "stable" = f ≥ 2 on ≥ 2 pages
(this column still includes name-like modifiers such as month names); "assoc" = stable
with PMI ≥ 3 and G² ≥ 10.83; entropy is normalised to 0–1 (1 = evenly spread); "attested"
= attested in W/P/A/R.

| head | f | f after DET | modifier tokens | types | stable | assoc | top-10 share | norm. entropy | attested / stable |
|---|---|---|---|---|---|---|---|---|---|
| hale "house" | 527 | 422 | 339 | 80 | 26 | 19 | 0.64 | 0.78 | 8 / 26 |
| wai "water" | 115 | 45 | 21 | 19 | 1 | 0 | 0.57 | 0.99 | 1 / 1 |
| lau "leaf" | 26 | 11 | 3 | 2 | 0 | 0 | – | – | – |
| kumu "base, teacher" | 340 | 226 | 118 | 54 | 17 | 12 | 0.54 | 0.89 | 4 / 17 |
| hua "fruit, egg, word" | 89 | 58 | 41 | 17 | 6 | 3 | 0.83 | 0.83 | 4 / 6 |
| ala "path" | 161 | 74 | 36 | 17 | 4 | 3 | 0.81 | 0.84 | 0 / 4 |
| mea "thing, one" | 2,861 | 2,163 | 1,528 | 324 | 131 | 48 | 0.41 | 0.79 | 9 / 131 |
| kanaka "person" | 529 | 233 | 147 | 83 | 25 | 12 | 0.35 | 0.94 | 0 / 25 |
| wahi "place" | 343 | 240 | 125 | 82 | 19 | 10 | 0.34 | 0.95 | 0 / 19 |
| lā "day, sun" | 696 | 503 | 348 | 34 | 18 | 16 | 0.81 | 0.80 | 1 / 18 (12 are month names) |
| pō "night" | 44 | 13 | 3 | 3 | 0 | 0 | – | – | – |

The largest paradigms among the other heads (stable types): hana 54, ʻōlelo 41, poʻe 38,
hui 36, papa 22, kiʻi 18, luna 17, mele 17, puke 13, kahua 13, wā 13, ʻoihana 12.

### 5.2 Strongest collocations (ranked by G²; f, df, PMI, G², attestation)

| head | collocations |
|---|---|
| hale | hōʻikeʻike (52, 21, 8.1, 537, W2); pule (35, 23, 8.0, 381, W2 A1 R:keep; solid 3); aliʻi (40, 18, 6.4, 313, A1); kūʻai (30, 14, 5.9, 189, W2); paʻahao (13, 9, 8.7, 167, W2 A1); ʻaina (14, 10, 8.3, 162, W2 A1; solid 7); kahiko (7, 6, 3.9, 33) |
| wai | ola (2, 2, 4.0, 7.5, W1 waiola; solid 7) |
| kumu | hula (14, 4, 6.5, 101); hoʻohālike (6, 5, 7.9, 84); aʻo (9, 8, 5.4, 83); kula (8, 7, 4.5, 40); ʻike (9, 8, 3.7, 29); waiwai (5, 4, 4.7, 28; solid 13); ikehu (3, 2, 7.0, 23) |
| hua | moa "egg" (12, 2, 11.0, 184, A1 R:keep); manu (8, 3, 8.3, 108); palapala "letter" (3, 2, 7.1, 32, W2; solid 14); ʻōlelo "word" (2, 2, 3.2, 8, W2 W1 A1; solid 97) |
| ala | hana "career path" (11, 7, 3.3, 31); kūpono (2, 2, 5.5, 12); ʻoihana (2, 2, 3.7, 7) |
| mea | hana (208, 131, 3.6, 761); kākau (91, 64, 5.1, 641); hoʻohana (81, 27, 4.3, 465); pāʻani (90, 50, 3.6, 338, W2); hoʻokani (43, 29, 5.5, 313); kanu (22, 15, 5.8, 186, W1); pena (21, 17, 5.9, 166) |
| kanaka | kilokilo (5, 2, 7.1, 65); hoʻokano (4, 3, 7.7, 37); ʻepekema (6, 5, 4.7, 28); kālaiʻāina (5, 5, 5.3, 28); hoihoi; hakaka; akamai; ʻōpio |
| wahi | pana (5, 4, 8.5, 62); kaulana (9, 7, 4.0, 37); kapu (4, 3, 5.9, 25); noho; koʻikoʻi; kuaʻāina; kokoke; paʻa |
| lā | hoʻomaha "holiday" (7, 4, 6.3, 48); ʻapōpō (2, 2, 8.8, 24); hoʻomanaʻo (3, 3, 4.7, 19); hānau "birthday" (5, 5, 2.7, 14, W2) |

### 5.3 What the table shows

- **Paradigms are large for general and institutional heads and nil for nature heads in
  this corpus.** mea, hale, kumu, kanaka and wahi have 17–131 stable modifiers. wai, lau
  and pō have 0–1. For lau, wai and pō the associative series lives in the lexicon (Andrews
  lau- 64 joined forms, wai- 38, pō- 90, though the pō count is noisy) and is mostly written
  solid today (§4.2c). In running modern Hawaiian these heads barely take free modifiers.
  The phrase frame and the compound frame are therefore **complementary by semantic
  field**, not two versions of the same paradigm.
- **Lexicalisation vs freedom.** The top pairs of hale are dictionary items (W/A). Those of
  kanaka and wahi are all free (0 attested), and those of mea and kumu almost all free.
  Collocation strength and attestation agree at the top: 7 of hale's 19 assoc pairs are
  attested, 0 of kanaka's 12.
- **Concentration.** Low top-10 share and high entropy (kanaka 0.35/0.94, wahi 0.34/0.95)
  mean an open, evenly spread series of the kind free syntax produces. High top-10 share
  (hua 0.83, lā 0.81) means a few fixed units.

---

## 6. How coherent is each head's associative series?

A paradigm counts as coherent in the structural sense when one sign stays constant and
one relation holds throughout, so the series is a set of proportional oppositions
(X : Y :: hale X : hale Y). Hand-coded from KWIC lines (`tables/relation_coding.tsv`;
analyst coding, not checked against Pukui & Elbert):

| head | pairs coded | relations | dominant relation | head senses in use |
|---|---|---|---|---|
| hale | 26 | purpose 20, possessor 3, quality 2, unclear 1 | **purpose 0.77** ("house for X-ing") | 1 (house) |
| mea | 43 (top by f) | agent 32, quality 6, instrument 3, patient 2 | **agent 0.74** ("one who Vs") | 2 (one/person 33, thing 10) |
| kanaka | 25 | agent 13, quality 11, origin 1 | agent 0.52 | 1 |
| wahi | 19 | quality 9, purpose 5, location 5 | quality 0.47 | 1 |
| kumu | 17 | purpose-like 13, agent 2, other 2 | — | **4**: teacher 7, source/base 8, background 1, trunk 1 |
| papa | 22 | content 10, purpose 9, material 2, ordinal 1 | — | **6**: class 6, board 6, list 4, programme 3, group 2, grade 1 |

- **hale** is the model associative series: one head sense, one dominant relation. Andrews'
  older hale- series (§3.3) adds material and quality relations, so it is less uniform.
- **mea + V** is the largest proportional series in the corpus: mea kākau : mea pena ::
  kākau : pena (writer : painter :: write : paint). It works almost like a derivational
  frame (an agent noun). It is not uniform, though: mea ʻai "food" and mea kanu "plant"
  are patients, mea kaua "weapon" and mea kani "sound device" are instruments, mea
  koʻikoʻi "important thing" is a quality. Wiktionary glosses mea pāʻani as "plaything,
  toy" (instrument), while the corpus mostly uses it for "player" (agent).
- **kumu and papa** are **polysemous heads**. The block stays the same while its content
  changes with the modifier: kumu hula "hula teacher" vs kumu waiwai "resource" vs kumu
  lāʻau "tree trunk". A line joining two kumu blocks would assert one shared sign where the
  reader sees two meanings (§9).

---

## 7. The grid: proportional series across heads and modifiers

`grid.py`, `compound_grid.py`, `sample_squares.py`; `tables/grid_summary.json`,
`squares_*.tsv`, `columns_*.tsv`, `compound_vs_phrase_grid.txt`.

### 7.1 Formal density (names and grammatical modifiers excluded)

| frame | units | slot-1 types | slot-2 types | squares | units in a square | mean alternatives, slot 1 / slot 2 |
|---|---|---|---|---|---|---|
| compounds: Wiktionary-attested candidates (W, W+A) | 106 | 66 | 84 | **0** | 0% | 0.64 / 1.21 |
| compounds: reviews keep + keep-pending | 506 | 178 | 234 | 45 | 20% | 3.48 / 4.79 |
| compounds: all 905 candidates | 905 | 275 | 362 | 143 | 29% | 4.46 / 7.32 |
| phrases: assoc collocations | 268 | 44 | 201 | 20 | 20% | 0.70 / 14.6 |
| phrases: stable pairs | 565 | 46 | 299 | **1,717** | **61%** | 2.56 / 45.1 |
| phrases: any pair (f ≥ 1) | 1,960 | 54 | 855 | 25,104 | 73% | 3.98 / 100.7 |
| phrases: dictionary-attested pairs only | 137 | 38 | 102 | 5 | 13% | 0.85 / 5.82 |

Slot 1 is the head in the phrase frame and the first root in compounds. The phrase frame's
density is concentrated in the modifier slot (mea alone has 131 stable modifiers). The
head slot is about as dense as the first-root slot of the 905 compound candidates (2.6
vs 4.5 alternatives). Restricted to dictionary-attested pairs, the phrase frame is as thin
as the compound frame.

**Modifier columns** (one modifier, many heads; stable): hana takes 15 heads, mele 12,
kahiko 10, kaulana 10, kūʻai 9, kiʻi 8, waiwai 7, koʻikoʻi 7, pāʻani 7, hōʻike/kiʻekiʻe/aʻo/
ʻōlelo/ʻepekema/hoʻolaha 6. 112 modifiers occur with ≥ 2 heads, 59 with ≥ 3. The largest
head overlaps are hana∩mea (29 shared modifiers), mea∩poʻe (18), kanaka∩mea (16) and
hana∩hui (13).

### 7.2 Are the formal squares proportional in content? (hand check, 40 squares)

Squares were drawn with seed 20261004: 20 from all stable squares (A) and 20 from squares
whose heads are neither mea nor hana (B). Every pair was read in context.
**P** = row difference and column difference both constant; **L** = the relation between
head and modifier shifts between rows or columns, so the square is only analogical;
**X** = broken.

| sample | P | L | X |
|---|---|---|---|
| A (all) | 8 | 5 | 7 |
| B (no mea/hana heads) | 10 | 5 | 5 |
| total | **18 (45%)** | **10 (25%)** | **12 (30%)** |

Causes of X: 6 pairs are not head + modifier constituents (hana hana, kiʻi kiʻi ʻana,
mele mele, puke paʻi ʻia; or the modifier begins a longer phrase, as in mea + [hana keaka]).
That is extraction noise; a curated list would remove it. 5 are head polysemy (mea "thing"
vs "person" vs the patient reading in mea aloha; papa "programme" vs "board" vs "group").
1 is a modifier sense shift (holo "operate" vs "travel").

Examples of P:
- hale noho : hale kahiko :: wahi noho : wahi kahiko (dwelling vs old × house vs place)
- kanaka kūʻai : kanaka noho :: wahi kūʻai : wahi noho (trader : resident :: shopping
  place : residence)
- hui kākoʻo : hui noiʻi :: poʻe kākoʻo : poʻe noiʻi (support vs research × group vs people)
- hui aupuni : hui hana :: luna aupuni : luna hana

Examples of L: hui keiki "boy band" (members) vs puke keiki "children's book" (audience).
hui pāʻani "games company" (product) vs kanaka pāʻani "player" (activity).

### 7.3 Dictionary-attested proportional grids (Wiktionary two-word forms)

`wikt_grid.py`: 41 squares among 650 Wiktionary two-word forms. They are of four kinds:

- **{ʻaina, aloha} × {kakahiaka, awakea, ahiahi}**: ʻaina kakahiaka "breakfast", ʻaina
  awakea "lunch", ʻaina ahiahi "dinner"; aloha kakahiaka/awakea/ahiahi "good
  morning/midday/evening". Six cells all attested, giving 3 squares that are proportional
  on both planes (meal : greeting × morning : noon : evening). aloha ʻauinalā "good
  afternoon" has no ʻaina partner.
- **X hema : X ʻākau** over Kakoka, Kalolaina, Kōlea, ʻAmelika, wēlau, lima, kōʻai (21
  squares). hema/ʻākau mean "south/north" with places and "left/right" with lima
  (hand) and kōʻai (stirring direction). The column holds across rows only if the reader
  accepts that polysemy. (The lexical-fields study treats this axis.)
- possessive grammar {ko, kā} × pronouns (6 squares: grammatical, not lexical).
- 11 small or accidental ones, not all proportional: {keiki, makua} × {kāne, papakema};
  {hoʻokae, tūtū} × {kāne, wahine}; {hua, mea} × {ʻai, ʻala}; {hale, palapala} × {hōʻaiʻē,
  kūʻai}; {mea, palapala} × {kūʻai, noi}; {lā, palapala} × {hoʻomaikaʻi, hānau}; {holoholo,
  kahu} × {kaʻa, lio, wale} (3); {hiʻona, kahu} × {wai, ʻāina}; {kānāwai, poʻo} × {kumu, lua}.
  So 3 + 21 + 6 + 11 = 41.

### 7.4 The proper-name column (ethnonyms, places)

`names_grid.py`. 32 name modifiers occur with ≥ 2 heads (94 squares at any frequency).
**Hawaiʻi** modifies 18 heads: ʻōlelo Hawaiʻi 88, mele Hawaiʻi 25, poʻe Hawaiʻi 17, aupuni
Hawaiʻi 14, lāhui Hawaiʻi 10. ʻAmelika modifies 8 heads, Polenekia 5. The series
ʻōlelo X : poʻe X (language of X : people of X) is cleanly proportional; 8 name modifiers
occur with both heads (Hawaiʻi, Polenekia, ʻEulopa, Niʻihau, ʻAlapia, Pinilana, ʻUkelena, Iāpana). It is also the most sensitive part
of the grid: it includes Pākē and Iukaio, and Wiktionary has maʻi Pākē "leprosy",
literally "Chinese sickness".

---

## 8. Proportional series found at this level

| series | expression difference | content difference | members (verified) | size | regularity | verifiability |
|---|---|---|---|---|---|---|
| hale + purpose | modifier X in hale X | "house for X-ing" | hale pule, hale kūʻai, hale ʻaina, hale paʻahao, hale hōʻikeʻike, hale kiaʻi, hale hoʻokipa, hale noho, hale keaka, hale kope… | 26 stable pairs in hawwiki; 51 Andrews joined forms; 11 Wiktionary | 20/26 purpose (0.77) | 8/26 dictionary-attested; Andrews 32 bracket-confirmed |
| mea + V (agent noun) | V in mea V | "one who Vs" | mea kākau, mea pena, mea haku [mele], mea hoʻokani, mea noiʻi, mea kākoʻo, mea hoʻolaha… | 131 stable mea pairs | 32/43 agent (0.74); patient/instrument/quality exceptions | 9/131 attested (mea ʻai, mea pāʻani, mea kanu…) |
| kanaka/poʻe/mea + X (person nouns × modifier) | head person/people/one | singular person vs people vs "one" | kanaka hakakā / mea hakakā; poʻe noiʻi / mea noiʻi; kanaka ʻōpio / poʻe ʻōpio | mea∩poʻe 18, kanaka∩mea 16 shared stable modifiers | near-synonymous heads (A7) | corpus only |
| head × hana column | head in H hana | the head's kind of relation to work | mea, hale, wahi, kanaka, poʻe, luna, papa, hui, ala, kumu, ʻoihana… + hana | 15 heads (stable) | relation shifts (agent / place / programme / group) | corpus; ala hana, papa hana partly lexicalised |
| quality column | stative S in H S | the head's class × the quality | hale kahiko / wahi kahiko / poʻe kahiko / mele kahiko / kiʻi kahiko… | kahiko 10 heads, kaulana 10, kiʻekiʻe 6 | relation constant (quality) for every head | corpus only |
| palapala + X | X | document for/of X | palapala hānau, palapala hōʻoia, palapala hoʻolimalima, palapala kūʻai, palapala kākoʻo, palapala hopu | 117 Wiktionary derived forms; 11 headwords; 5 stable in hawwiki | constant (document for X) on the glossed headwords | Wiktionary (forms, few glosses) |
| kahu + X | X (the ward) | custodian of X | kahu hipa, kahu pipi, kahu lio, kahu maʻi, kahu kula, kahu ʻāina, kahu waiwai | 44 Wiktionary derived forms | constant by its form | forms only; glosses unverified |
| ʻaina/aloha × time of day | time word | meal vs greeting × morning/noon/evening | ʻaina kakahiaka/awakea/ahiahi; aloha kakahiaka/awakea/ahiahi | 2 × 3, all six in Wiktionary | constant | Wiktionary headwords |
| ʻōlelo X : poʻe X | ethnonym | language vs people of X | ʻōlelo Hawaiʻi / poʻe Hawaiʻi; ʻōlelo Polenekia / poʻe Polenekia; ʻōlelo ʻAlapia / poʻe ʻAlapia | 8 names occur with both heads; 32 names with ≥2 heads | constant | corpus; sensitive |
| kau + season | season word | "season of X" | kau wela, kau hoʻoila (sic, Wiktionary; the corpus has wā hoʻoilo 4×), kau kupulau, kau hāʻulelau | 4 (closed) | constant | Wiktionary |

---

## 9. Homography and polysemy: will a line between identical blocks tell the truth?

`homography.py`, `tables/homography.tsv`.

- **Heads:** 23 of 54 have ≥ 2 Wiktionary etymologies or reflect ≥ 2 POLLEX protoforms:
  wai (3 etymologies, 3 protoforms), lau, ala (4), mea, lā (6), kula (4), ua, papa (6),
  luna, pae and others. Mean 4.8 senses per head.
- **Modifier columns** (≥ 3 heads): 6 of 59 have homographs (hana "work"/"warm", mele
  "song"/"yellow", kiʻi "image"/"fetch", huna, koa, maʻi).
- The DET frame removes the particle readings (ala, lā, luna). Inside a phrase the
  modifier also picks the head's sense (kumu hula = teacher). That helps reading but
  hurts the "line = same sign" claim. Measured on kumu and papa (§6), 4 and 6 senses are in
  live use. In the 40-square check, 5 of 12 breaks were head polysemy.
- **Compared with the compound frame:** the compound frame's problem was homographs among
  isolated roots (lua "two"/"pit"). The phrase frame has the same homographs. Its heads are
  disambiguated by the partner, but polysemy remains.

---

## 10. Non-significant oppositions at this level

| opposition | why non-significant | measurement |
|---|---|---|
| spaced vs solid spelling (hale pule ~ halepule) | orthographic convention: varies within one corpus and was reversed historically (Andrews solid → modern spaced); it correlates with lexicalisation but does not encode it | 149 pairs in hawwiki written both ways; 32/95 common ones mixed; Andrews ~0 two-word headwords vs Wiktionary 212 |
| hyphen vs space vs solid in P&E-cited forms (hauhele-ʻula, ao-lani) | the same compound type is written three ways | of 150 strict inherited root + root: 120 solid, 11 hyphen, 19 spaced |
| head synonymy kanaka X ~ mea X (person who) | the expressions differ; the content difference is close to nil | 16 shared stable modifiers; square A7 |
| ʻokina / kahakō inside a phrase (e.g. corpus misspelling oʻaukake for ʻaukake) | phonemic, so distinctive, but commuting it does not run through a series of phrases | phonology study; no proportional case at this level |
| position of the modifier | not free (head-initial), so there is nothing to commute | 657 : 4 |
| relation type (agent / patient / purpose / quality…) | a content distinction with **no** expression correlate: syncretism, the converse of non-significance | §6, §7.2 |

---

## 11. Frame assessment

**Could the phrase syntagm act as a two-slot (or n-slot) frame where commuting one sign is
meaningful?** Yes, more than the one-word compound can, with conditions.

- **Truth of the commutation.** In a transparent N + modifier phrase both blocks keep
  their meanings: hale stays "house" in hale pule, hale kūʻai, hale ʻaina. Turning the
  modifier block gives a new phrase whose meaning follows from its parts. Two-word units
  are 90% transparent against 56% for one-word units (§4.2). So the phrase frame is the
  truer Hjelmslevian commutation. Lines between identical head blocks are true statements
  for single-sense heads (hale, wahi, kanaka, poʻe, hui, luna). They are misleading for
  polysemous heads (kumu, papa, mea).
- **Density.** 1,717 formal squares among 565 stable corpus pairs, against 0 to 143 in the
  compound frame. The modifier slot is open and dense; the head slot is closer to
  compound density (2.6 alternatives per pair). In a two-slot tumble the head block
  would have few turns and the modifier block very many.
- **Proportionality.** About 45% of formal squares are proportional on both planes and
  another 25% analogical (§7.2). Curating out the extraction noise (§7.2) and polysemous
  heads would raise the clean share.
- **Asymmetry.** Unlike a jukugo, the two slots are not interchangeable: the head comes
  first and the modifier second (99.4%). A block cannot change role by changing place.
  hale kūʻai is "store"; kūʻai hale would be the verb phrase "buy a house" (*unverified*,
  grammar-based reading; not measured).
- **Verifiability.** Dictionary attestation is thin: 5.7% of pairs, 23% of the most
  frequent. A curated set would rest on attested use (corpus frequency and page spread)
  plus compositional grammar. The dictionary-backed exceptions are Wiktionary's rows
  (palapala, kahu, mea, hale, hōkū, kaha, kau) and P&E's phrase headwords, which a person
  would have to check.
- **Field split.** Nature and body vocabulary (wai, lau, pō, maka, kai) is not phrasal in
  modern text. It lives in solid compounds, so a phrase frame leans towards artefacts,
  institutions, people and places.
- **Sensitivity.** The name column carries ethnonyms (Pākē, Iukaio, maʻi Pākē). Wiktionary
  units include hoʻokae ʻili "racism" and kohe lemu (vulgar). Andrews' hale series includes
  halepea "menstrual house" and halekupapau "tomb". A curated list would need the same
  screening the roots study applied.

**Options only, not proposals:** such a frame could support (a) a **head-fixed tumble**:
one block stays as a single-sense head (hale, wahi, poʻe, hui, palapala, kahu) and the
modifier block tumbles through its associative series, with lines joining shared
modifiers across heads (the hana and kahiko columns); (b) a **grid piece** built on
proportional squares such as {ʻaina, aloha} × {kakahiaka, awakea, ahiahi} or {hale, wahi} ×
{noho, kūʻai, kahiko}; (c) an **n-slot chain** using the recursion the phrase allows
(hale kūʻai mea ʻai "grocery store" = [hale kūʻai] + [mea ʻai], Wiktionary). The owner
decides; nothing here is decided.

---

## 12. Measurements (summary)

| metric | value | how |
|---|---|---|
| head-initial order | 657 post-head vs 4 pre-head statives (99.4%) | `order.py` |
| Wiktionary two-word headwords | 212 common + 55 names + 28 longer + 26 phrases (322) | `inv01_wiktionary.py` |
| Wiktionary two-word forms incl. derived lists | 650 | `wikt_grid.py` |
| head-initial endocentric share, Wiktionary sample | 37/40 | hand-coded sample |
| POLLEX reflexes written as two words | 52 rows / 51 forms | `inv02_pollex.py` |
| inherited root + root compounds, P&E spelling | 150: 120 solid, 11 hyphen, 19 spaced (13%) | `inv02_pollex.py` strict |
| Andrews 1922 two-word headwords | ~0 (16 matches, all OCR/place names) | grep in OCR |
| Andrews joined forms, 54 heads | 951 formal; bracket precision 280/387 | `andrews_joined.py` |
| transparency vs word break | one-word share 0.44 / 0.81 / 0.87 (transparent / partial / opaque); χ² 48.8; OR 7.2 | `ortho.py` |
| pairs with both spellings in hawwiki | 149; of 95 with ≥5 tokens: 30 solid, 33 spaced, 32 mixed | `ortho.py` |
| stable head + modifier pairs (46 heads) | 565 (1,960 at any frequency) | `colloc.py` |
| formal squares, phrase frame | 1,717 stable (61% of pairs in a square); 25,104 any | `grid.py` |
| formal squares, compound frame | 0 (106 W-attested) / 45 (506 kept) / 143 (905) | `compound_grid.py` |
| content check of squares | 18 P / 10 L / 12 X of 40 | `square_sample_coding.tsv` |
| dictionary attestation of pairs | 112/1,960 (5.7%); 16/70 (23%) for f ≥ 10, df ≥ 5 | `attest_summary.py` |
| paradigm coherence (dominant relation) | hale 0.77, mea 0.74, kanaka 0.52, wahi 0.47 | `relation_coding.tsv` |
| polysemous heads in use | kumu 4 senses / 17 pairs; papa 6 / 22 | `relation_coding.tsv` |
| heads with homographs | 23/54 | `homography.py` |
| corpus | 310,077 tokens; 41% of pages are bot stubs (7% of tokens) | `corpus_pages.py` |

---

## 13. Open doubts

1. **Pukui & Elbert not consulted.** P&E's phrase headwords would be the best verifier of
   the phrase frame and could change every "attested" share here. Its word-division policy
   is described only second-hand.
2. **Wilson 1981 not read in full.** The ʻAhahui ʻŌlelo Hawaiʻi 1978 word-division
   recommendations are known only from search snippets.
3. **Prosody.** Whether a compound and the matching phrase differ in stress or accent
   grouping (Schütz 2010, "Measures and morphemes", Pacific Linguistics) was not checked.
   If they do, space vs solid would have a phonological correlate and §10 would need
   revising.
4. **Corpus register.** Hawaiian Wikipedia is encyclopedic, partly learner-written and
   41% bot stubs by page. Traditional collocations (lau hala, wai puna, pō mahina) are
   rare or absent. A newspaper or Bible corpus might give very different paradigms (not
   used; baibala.org is forbidden).
5. **Hand coding.** The relation codes, square verdicts, Andrews bracket classes and
   head-initial sample are one analyst's readings from glosses and KWIC lines. They are
   unverified against native-speaker judgement or P&E.
6. **Review coding circularity.** The roots study's transparency and word-break codes may
   not be independent: a reviewer may judge a solid word more opaque. The χ² overstates
   certainty if so.
7. **Extraction noise.** About 15% of sampled squares (6/40) rest on non-constituent
   pairs. Automatic counts of squares and columns are upper bounds.
8. **mea pāʻani / mea kūʻai** readings (agent vs instrument vs goods) depend on context.
   Wiktionary and the corpus disagree for mea pāʻani.

---

## 14. Sources

Described (cited):

- Kimura, Larry & April G. L. Counceller. 2009. "Indigenous New Words Creation:
  Perspectives from Alaska and Hawaiʻi." In J. Reyhner & L. Lockard (eds.), *Indigenous
  Language Revitalization: Encouragement, Guidance & Lessons Learned*, 121–140. Flagstaff:
  Northern Arizona University. https://jan.ucc.nau.edu/~jar/ILR/ILR-10.pdf. Quotes the
  Hawaiian Lexicon Committee's guidelines from *Māmaka Kaiao*.
- Hosoda, Kelsea Kanohokuahiwi. 2019. *Hawaiian Morphemes: Identification, Usage, and
  Application in Information Retrieval.* PhD dissertation, University of Hawaiʻi at Mānoa.
  https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/599f4a69-15e7-455a-b6b6-a590a9695731/content
  (§2.5.3 on P&E phrase headwords; §4.2.2.1 quoting Elbert & Pukui 1979:124; §5.1 on
  fluid boundaries).
- U.S. Department of the Interior. Draft 513 DM 3, "Use of the Hawaiian Language, ʻŌlelo
  Hawaiʻi" (§3.6, §3.9).
  https://www.doi.gov/sites/default/files/513-dm-3-olelo-hawaii-oes-508-clean-draft-for-consultation.pdf
- Dryer, Matthew S. WALS Online, features 87A (Noun–Adjective), 86A (Noun–Genitive), 81A
  (VSO) for Hawaiian, citing Elbert & Pukui 1979. https://wals.info/datapoint/87A/wals_code_haw
  (and …/86A/…, …/81A/…).
- Wilson, William H. 1981. "Developing a Standardized Hawaiian Orthography." *Pacific
  Studies* 4(2). https://digitalcollections.byuh.edu/pacific-studies-journal/vol4/iss2/6.
  Metadata verified; content only from search snippets (**unverified**).
- Parker Jones, ʻŌiwi. 2018. "Hawaiian." *Journal of the International Phonetic
  Association* 48(1), Illustrations of the IPA. doi:10.1017/S0025100316000438 (cites
  Schütz 2010, "Measures and morphemes: a functional approach to Hawaiian accent").
- Elbert, Samuel H. & Mary Kawena Pukui. 1979. *Hawaiian Grammar.* University of Hawaiʻi
  Press. Cited only via WALS and Hosoda; not consulted directly.

Data (local, read-only): Wiktionary/kaikki Hawaiian extract; POLLEX Hawaiian reflexes;
Andrews–Parker 1922 OCR; Hawaiian Wikipedia dump; roots-study reviews and compounds.tsv.

Not used (forbidden): wehewehe.org and mirrors, ulukau.org dictionary/e-book collections
(a hawaiian-grammar.org PDF of *The Voices of Eden* carries Ulukau headers and was
skipped), puke.ulukau.org, baibala.org, trussel2.com, the en.wiktionary.org API.
hawaiian-grammar.org's own grammar PDFs were behind a captcha and were not read.

---

## 15. Files

`scripts/`
- `common.py`: copied loaders and word-salad filter (from grammatical-paradigms)
- `corpus_pages.py`: filtered corpus with page ids
- `lex.py`: Wiktionary, POLLEX, Andrews and review loaders
- `inv01_wiktionary.py`, `inv02_pollex.py`, `andrews_joined.py`: inventories
- `colloc.py`: DET-frame collocations, paradigm measures
- `top_table.py`: the §5.2 table
- `grid.py`, `compound_grid.py`, `wikt_grid.py`, `names_grid.py`: squares and columns
- `sample_squares.py`: the 40-square sample with KWIC
- `kwic.py`: KWIC for one head
- `ortho.py`: word-division measurements
- `order.py`: head-initial check
- `attest_summary.py`: dictionary attestation by frequency band
- `homography.py`

`tables/`: every output named above, plus `*.txt` run logs. Hand codings:
`square_sample_coding.tsv`, `relation_coding.tsv`, `wikt_headinitial_sample.tsv`,
`andrews_hale_relations.tsv`.

`src/`: downloaded sources (ilr10, parkerjones_ipa, doi513, haw_morphemes_thesis, WALS
pages, acl2025_ortho).
