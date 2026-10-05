# Derivation and reduplication in Hawaiian: a structural analysis

Level: **morphology, derivation and reduplication** (Bloomfield and Harris for distribution and allomorphy; Saussure, Hjelmslev and Trubetzkoy for signs, commutation and oppositions).
Status: research only. Nothing here proposes or decides a design change.

All counts come from the scripts in `scripts/`, and every table in `tables/` can be regenerated. "Attested pair" means **both** forms appear as headwords in Wiktionary (kaikki dump) or POLLEX, which gives 2,897 single-word forms in all. POLLEX Hawaiian glosses are Pukui and Elbert 1986 (P&E). I separate three kinds of claim throughout: what the **data attest**, what **grammars describe** (cited), and what I **judged by hand** (the coding files are in `tables/codes_*.tsv`). Anything I could not check is labelled *unverified*.

---

## 0. The question in structural terms

In Jukugo Tumble, a turn is a **commutation**. One sign in a two-slot syntagm is swapped, and the change on the expression plane brings a change on the content plane. The owner is right about one-mark tumbles (kai → kaʻi → kā). Swapping a *figura* such as the ʻokina or vowel length is **distinctive** but not **significant**: the content changes, but not *systematically*. The two contents share no component.

At the morphological level, the question becomes: **where does Hawaiian have proportional oppositions?** These are series in which the *same* expression difference carries the *same* content difference:

  a : b :: c : d (for example nui : hoʻonui :: make : hoʻomake, "X : cause to be X")

In such a series the changed element is itself a sign, such as an affix, a reduplicant or a replacive. A substitution inside the frame is then meaningful rather than arbitrary. For each process I measure:

1. **size**: how many attested base/derived pairs there are;
2. **regularity**: the share of pairs in which the content difference equals the process's described value. This is coded by hand on seeded random samples.
3. **productivity**: Baayen's P = n1/N in Hawaiian Wikipedia, plus the share of types absent from the 1922 dictionary;
4. **verifiability**: which sources attest both members.

---

## 1. Sources

**Data (local).**
- Wiktionary: `kaikki-haw.jsonl` and `wiktionary.json`.
- POLLEX Hawaiian reflexes: 2,258 forms, glossed from P&E 1986.
- Andrews–Parker 1922 (OCR). The parser recovers 9,843 headword types and 14,373 entries. The spelling has no ʻokina or kahakō.
- Hawaiian Wikipedia: 3,019 content pages, 369,697 tokens and 7,860 word types after markup stripping (`scripts/corpus.py`).

**Descriptions (cited).**
- **Alderete, J. & MacMillan, K.** "Reduplication in Hawaiian: Variations on a theme of minimal word." *Natural Language and Linguistic Theory* (2015). Preprint ROA 1318: https://roa.rutgers.edu/article/view/1318.html (PDF in `src/`). A database of 1,632 P&E reduplications. It reports E&P 1979's semantic categories and a cross-tabulation of shape against meaning.
- **Brittain, M.** *Hawaiian Causative-Simulative Prefixes as Transitivity and Semantic Conversion Affixes.* MA Plan B paper, University of Hawaiʻi at Mānoa, 1993. http://hdl.handle.net/10125/21147 (text in `src/`). It quotes P&E 1986 p. 80 on hoʻo-, quotes Makanani 1973, and describes the allomorph distribution.
- **Medeiros, D. J.** "Hawaiian Nominalization." GLOW 43 abstract, 2020: https://glowlinguistics.org/43/wp-content/uploads/sites/5/2020/02/GLOW_43Remarks_paper_21-Medeiros.pdf (in `src/`). It covers -na against ʻana and hoʻo-/haʻa- as allomorphs, citing E&P 1979.
- **Andrews–Parker 1922**, entry "Hoo" (in the cache). It defines the causative and states that hoʻo- coalesces with a following vowel "particularly before a, e and o".
- **Wikipedia, "Hawaiian grammar"**: https://en.wikipedia.org/wiki/Hawaiian_grammar. It covers plural vowel lengthening (uncited there) and gives reduplication and causative examples, citing Schütz, *All About Hawaiian* (1995) pp. 23–24.
- Elbert & Pukui, *Hawaiian Grammar* (1979), and Pukui & Elbert, *Hawaiian Dictionary* (1986), are cited **only through the works above**. I did not read either directly.

---

## 2. Units and oppositions at this level

- **Roots** (bases) are lexical signs.
- **Derivational affixes** are signs with *categorial or grammatical* content: hoʻo- (and its allomorphs hō-, hoʻ-), haʻa-/hā-, kā-, pā-, mā-/ma-, ʻō-/ʻā-, pō-, pū-, ʻū-, ʻe-, ʻa-, kai-, -na/-kana/-lana, -a and others.
- **Reduplication** is a *process sign*. Its signifier is a copying operation, not a fixed segment string. It has several shape-allomorphs (whole, foot prefix or suffix, CV prefix or infix).
- **Replacives** (Bloomfield) appear in two closed sets: plural vowel lengthening in person nouns, and the possessive -ʻu/-u in pronouns.

The oppositions are mostly **privative**: ∅ against an affix, the affixed term being marked. They are **bilateral**: one base, one derived. Across a series they are **proportional** to the degree measured below. There is one **multilateral** system: the numeral prefixes ∅/ʻe-/ʻa-/pā-/hoʻo-/kua- on the same base.

---

## 3. hoʻo- (causative and simulative)

### 3.1 Size

| measure | value | how |
| --- | --- | --- |
| lexicon forms with a hoʻo-/hō-/hoʻV- shape | 210 | `hoo.py`, string shape |
| … with an attested base (pairs) | 206 pairs, 192 distinct derived forms | formal stripping plus Wiktionary analyses |
| … Wiktionary-analysed (curated) pairs, base attested | 150 | etymology templates |
| … formal-only pairs | 56 (29% spurious in the sample, see 3.3) | |
| both forms in POLLEX (P&E) | 43 | |
| estimated genuine attested pairs | **≈190** | 150×1.00 + 56×0.71 (`stats.py`) |
| Andrews 1922 hoo- headwords | 984, which is ~10% of parsed headword types | `andrews_counts.py` |
| … whose entry names the base, "[Hoo and X" | 762; X is itself a headword in 647 | |
| POLLEX reflexes of reconstructed \*faka-X / \*faa-X | 37 / 8 | `pollex_inherited.py`. Examples: hoʻomake < \*faka-mate, hoʻokele < \*faka-tele, hoʻomaka < \*faka-mata |
| Hawaiian Wikipedia hoʻo-X types (glued ʻia/ʻana tokens removed) | 328 types, 9,256 tokens; 225 types whose X is also a corpus type | `productivity.py` |

### 3.2 Allomorphy is non-significant and phonologically conditioned

The 167 curated or sample-confirmed pairs are cross-tabulated by the base's initial segment (`allomorphy.py`, `tables/hoo_allomorphy.tsv`):

| base begins with | hoʻo- | hō- (ʻ kept) | hoʻ- + lengthened V | hoʻ- (ʻ lost) | hōʻ- | n |
| --- | --- | --- | --- | --- | --- | --- |
| consonant other than ʻ | **127** | 0 | 0 | 0 | 0 | 127 |
| a / e / o | 0 | 0 | **8** | 0 | 1 | 9 |
| i / u | **4** | 0 | 1 | 0 | 0 | 5 |
| ʻ + short V | 2 | **19** | 0 | 0 | 0 | 21 |
| ʻ + long V | 0 | 2 | 0 | 2 | 0 | 4 |
| long V | 0 | 0 | 0 | 0 | 1 | 1 |

Examples: noho → hoʻonoho; ala → hoʻāla, ola → hoʻōla (/o/ coalesces and the vowel lengthens); ʻike → hōʻike, ʻai → hōʻai; ulu → hoʻoulu.

The distribution is close to complementary (161/167 = 96% follow the modal cell for their row). It matches Andrews 1922 ("coalesces … particularly before a, e and o") and Brittain 1993 (hō- "before words with a glottal stop and short vowel … as hōʻike, from ʻike").

In structural terms, hoʻo-, hō- and hoʻ- are **allomorphs of one sign**. Their mutual differences are **neither distinctive nor significant**: they are automatic morphophonemics, and the ʻokina and kahakō in them are conditioned, not chosen. The doublet hōʻino ~ hoʻoʻino (both attested) shows residual free variation.

Medeiros (2020), citing E&P, argues that **haʻa-** is a *syntactically* conditioned allomorph of the same valency morpheme: the inner one, as in hoʻo-haʻa-nui. Andrews 1922 calls haʻa- "very seldom" used. The data agree that it is rare: 7 attested pairs, 13 Wikipedia types.

### 3.3 Semantic regularity, hand-coded

Sample: 80 pairs drawn at random (seed 20261004) from the 206. The codes and reasons are in `tables/codes_hoo.tsv` and the tallies in `tables/stats.txt`. The coding scheme follows P&E 1986 p. 80 as quoted by Brittain: (1) causation and transitivisation, (2) pretence, (3) similarity, (4) no meaning, plus idiosyncratic cases. It also follows E&P 1979's "deliberate agency" with transitive bases.

| | share | 95% Wilson |
| --- | --- | --- |
| spurious pair: wrong homograph base or not a derivation (hōkū "star" < \*fetuqu; hoʻouna "send" < \*uga, not una "turtle shell") | 7/80 = 9% (curated 0/56; formal-only 7/24 = 29%) | 4–17% |
| **causative**: "make/cause (to be) X", including factitive from a noun (hoʻopōhaku "petrify") | **50/73 = 68%** | 57–78% |
| … causative with a direct paraphrase fit | 47/73 = 64% | 53–74% |
| **simulative/pretence** ("act like X, feign X") | **13/73 = 18%** (4 of these are also causative) | 11–28% |
| deliberate (hoʻolohe "listen" ← lohe "hear") | 3/73 = 4% | |
| no change (hoʻomaopopo = maopopo "understand") | 4/73 = 5% | |
| other related, or opaque (hoʻomaka "begin" ← maka "eye, bud") | 6/73 = 8% | |
| **any P&E value with a direct fit** | **59/73 = 81%** | 70–88% |

**Base class conditions the value.** All 6/6 *human-noun* bases give SIM: kamaliʻi, kāne, makua, malihini, lani and the loan mikanele. Only 7/67 other bases do, and those are human conditions such as kuli "deaf", maʻi "sick" and naʻaupō "ignorant". In componential terms, [+human, noun] → "behave as X"; [state or process] → "cause X". So hoʻo- is one signifier with **two content values distributed by the semantic class of the base**. That is closer to two homonymous series than to one ambiguous sign.

There is a large-n cross-check that is heuristic and gives a lower bound (`andrews_hoo_heur.py`). Of 703 Andrews entries that analyse themselves as [Hoo and X], **59%** carry an explicit causative keyword in the first sense ("to cause", "to make", "to render"…). In a hand check of 21 of the remaining entries (`codes_andrews_hoo_neither.tsv`), 8 were causatives glossed with a plain verb ("to collect", "to wring", "to hush"), 8 were "to be X" or behaviour (simulative-like) and 5 were other intransitives. That gives roughly **¾ causative**, in line with the sample.

### 3.4 Proportional series, verified members

All members below are attested pairs and hand-coded R (direct fit) in `codes_hoo.tsv`.

- **Causative ∅ : hoʻo- = "X : cause X"**: make "die" : hoʻomake "kill" :: hina "fall" : hoʻohina "knock over" :: noho "sit" : hoʻonoho "seat, install" :: kū "stand" : hoʻokū "set up" :: pau "finished" : hoʻopau "finish" :: ʻike "see" : hōʻike "show" :: ala "awake" : hoʻāla "awaken" :: ʻā "burn" : hōʻā "ignite" :: heʻe "flee" : hoʻoheʻe "put to flight" :: luʻu "dive" : hoʻoluʻu "dip (something)" :: mālie "calm" : hoʻomālie "soothe" :: momona "fat" : hoʻomomona "fatten" :: māmā "light" : hoʻomāmā "lighten" :: ikaika "strong" : hoʻoikaika "strengthen" :: ʻoi "sharp" : hōʻoi "sharpen" :: ʻulaʻula "red" : hoʻoʻulaʻula "redden" :: naʻauao "enlightened" : hoʻonaʻauao "educate" :: kani "sound" : hoʻokani "play (instrument)" :: oki "stop" : hoʻōki "terminate" :: laka "tame" : hoʻolaka "tame (tr.)" … The estimated size among attested pairs is **≈120**. Andrews suggests several hundred.
- **Factitive from noun = "N : make into, put in N"**: pōhaku "stone" : hoʻopōhaku "petrify" :: papa "layer" : hoʻopapa "put in layers" :: lā "sun" : hoʻolā "put in the sun" :: okaoka "bits" : hoʻōkaoka "pulverise" :: lua "two" : hoʻolua "do twice".
- **Simulative = "X : act as, like X"**: kāne : hoʻokāne :: makua : hoʻomakua :: malihini : hoʻomalihini :: kamaliʻi : hoʻokamaliʻi :: lani : hoʻolani :: mikanele : hoʻomikanele :: kuli "deaf" : hoʻokuli "feign deafness" :: mākonā : hoʻomākonā. The estimate is **≈30** among attested pairs.

### 3.5 Productivity

In Hawaiian Wikipedia, hoʻo-X has P = n1/N = **0.016** (148 hapax types out of 9,256 tokens); see the table in §6. **105 of 328 types (32%) are absent from the full Andrews 1922 text.** Examples are hoʻonaʻauao, hoʻopanalāʻau, hoʻokamaʻāina and hoʻomokulele (on the modern compound mokulele "aeroplane"). This is an upper bound on novelty: OCR line-break hyphenation hides some old words, such as hoʻololi. Brittain (1993) calls the prefixes "very productive … may be used with almost any word except articles and other grammatical items". hoʻo- also takes loan bases (mikanele "missionary").

**Verdict.** hoʻo- is the one *large, productive, semantically consistent* derivational series. It is proportional in about two pairs out of three (causative), with a second, base-conditioned value (simulative). It is still a **grammatical** sign: its content is a relation ("cause"), not a lexical meaning.

---

## 4. Other affixes

All curated pairs were coded (`codes_affix.tsv`, `affix_regularity.tsv`). "R" means the derived form shows the affix's described value. The values come from the Wiktionary prefix headwords, A&M §2, Brittain and Medeiros.

| affix | described value | pairs | genuine | R | R share |
| --- | --- | --- | --- | --- | --- |
| **-na** | nominaliser: act, result, place, instrument, agent | 35 | 34 | 26 | **76%** [60–88] |
| ʻō- | simulative "-ish" | 16 | 15 | 6 | 40% |
| pā- | "in the nature of"; distributive with numerals | 15 | 15 | 6 (3 are numerals) | 40% |
| kā- | causative | 11 | 9 | 3 | 33% |
| mā- | quality, state | 11 | 9 | 3 | 33% |
| ma- | quality, state; locative | 10 | 10 | 4 | 40% |
| **ʻe-** | cardinal numeral prefix (1–9) | 11 | 9 | 9 | **100%** |
| **ʻa-** | numeral "-times"; attenuative | 9 | 8 | 7 | 88% |
| haʻa- | causative (also "-ish", acting) | 7 | 6 | 3 (each of a *different* value) | 50% |
| pō- | stative | 7 | 7 | 3 | 43% |
| **kai-** | kinship term of reference | 5 | 5 | 5 | **100%** |
| pū- | simulative | 5 | 5 | 0 | 0% |
| **ʻū-** | instrument | 3 | 3 | 3 | 100% |
| everything except -na, pooled | | 157 | 141 | 65 | **46%** [38–54] |

Observations:

- **-na** is the second real series. Examples: hulina, kōina, nohona, moena "bed" ← moe "lie down", ʻaina "meal" ← ʻai "eat", ʻikena, piʻina, ʻālina "scar" ← ʻali. Medeiros calls -na R(eferential)-nominals with idiosyncratic readings: hikina "east" ← hiki "arrive", kuhina "minister" ← kuhi "point", holoholona "animal". There is a lovely isolated pair, hiki : hikina "east" :: komo : komohana "west" ("arrive" : "east" :: "enter" : "west").

  The content value is broad ("nominal of the act"). It is a proportion of **category** more than of lexical meaning. Length alternations under -na (hānau → hanauna, ʻali → ʻālina, koi → kōina) are morphophonemic and non-significant (Medeiros 2020).
- The **small prefixes are mostly fossils**. POLLEX shows them reconstructed: \*taa- (kā-) 19 reflexes, \*paa- (pā-) 13, \*ma- 37, \*maa- 11, \*koo- (ʻō-) 34. They hold few transparent pairs today and their meanings drift (pākaukau "table", kāmaʻa "sandal", pāhoehoe). Formal string matches overgenerate heavily: kā- matches 60 lexicon pairs by string, of which 11 are curated.
- **Closed series with perfect regularity**: ʻe- + numerals (ʻekahi … ʻeiwa, 9/9); ʻa- + numerals (ʻakahi … ʻaono); pā- distributive (pālua, pālima, pāʻumi); kai- kin terms (kaikuahine, kaikunāne, kaikuaʻana, kaikaina, kaikamahine). These are proportional, but small, closed and grammatical. The ʻū- instrument set (ʻūheheʻe "solvent", ʻūhōloʻa "dispenser", ʻūhili "racquet") looks like a modern coinage pattern. *Unverified*: I could not check its provenance without a forbidden dictionary.
- **Numeral paradigm** (`closed_series.py`). This is a multilateral two-slot system, [prefix][numeral]. With nine numerals (plus ʻumi for pā-, hoʻo- and kua-), the cells attested in the lexicon or Wikipedia are: ʻe- 9/9, ʻa- 9/9, pā- 5/10, hoʻo- 2/10, kua- 3/10. Only ∅ and ʻe- are frequent in modern text: ʻelua 279 tokens, ʻekolu 153.
- **Homonymous suffix**: -a gives both a passive (kuhia ← kuhi) and "having N" (nihoa "serrated" ← niho "tooth"). It is one signifier with two values and n = 2.

---

## 5. Reduplication

### 5.1 Size and shapes

| measure | value | how |
| --- | --- | --- |
| attested pairs (reduplicated form with an attested base, any pattern) | 383 | `redup.py` |
| … base named by Wiktionary ({{redup}} etc.) | 153 | |
| … Wiktionary category "Hawaiian reduplications" | 150 of the 383 (160 in lexicon) | |
| patterns detected (formal) | FULL 218, CV-PREFIX 77, σ-SUFFIX 37, FOOT-SUFFIX 29, FOOT-PREFIX 9, other curated 13 | |
| both forms in POLLEX | 192 | |
| POLLEX: Hawaiian XX reflexes / of which the protoform is already XX | 189 / 98 | `pollex_inherited.py` (ahiahi < \*afiafi, halahala < \*fala-fala) |
| Andrews 1922: XX headwords / with X a headword | 581 / 517 | `andrews_counts.py` |
| Andrews entries analysed as "Freq./Intens./Redup. of X" | 278 (X a headword in 219). Label occurrences overall: Freq. 289, Intens. 47, Redup. 23 | |
| A&M 2015 database (P&E "Redup" tag) | 1,632 words. Foot-sized reduplicant 80%; whole 576, prefix 445, infix 78, suffix 519 | cited |

### 5.2 Semantic regularity

**Described value.** E&P 1979 (via A&M): "frequentative, increased action, and plural action" are the most common. A&M add, after comparing glosses, diminutives, intensives, N↔V conversion and semantic narrowing, and note that "the meanings of reduplicated words can be quite subtle". Wikipedia/Schütz gives ʻau "swim" → ʻauʻau "bathe", haʻi → haʻihaʻi "speak back and forth", maʻi → maʻimaʻi "chronically sick".

**Sample A** is 100 attested pairs drawn at random (seed 20261004); see `codes_redup.tsv`:

| | share |
| --- | --- |
| spurious or parse error: homograph or function-word "base" (koko "blood" ← ko "of"; uaua "tough" ← ua "rain"; mamao < \*mamao, not mao) | 25/100. Curated 2/40 = **5%**; formal-only 23/60 = **38%** |
| genuine and glossed | 74 |
| E&P core value (iterative, intensive, plural) | **8/74 = 11%** [6–20]; direct fit 5/74 = 7% |
| any A&M-listed value (adds attenuative, quality-from-noun, conversion, narrowing) | **24/74 = 32%** [23–44]; direct fit 17/74 = 23% |
| **no glossed difference** (maʻomaʻo = maʻo "green"; wikiwiki = wiki "quick"; uliuli = uli "dark") | **23/74 = 31%** [22–42]. Among curated pairs, **20/40** |
| opaque, or a plant or animal name (naonao "ant" ← nao "ripple"; ʻoʻopu "goby") | 22/74 = 30% |

**Sample B** draws on the 1922 dictionary's own labels: 40 random Andrews entries marked "Freq./Intens. of X" (`codes_andrews_freq.tsv`). 35 were usable.

- Iterative 11 (ʻaki-type: pekupeku "kick frequently", ninaninau "ask repeatedly", huhuki "pull repeatedly").
- Intensive 4 (maʻamaʻalea "very cunning", maholahola "spread out extensively").
- Plural or distributive 2 (hoʻopuʻupuʻu "collect in many little heaps").
- So **E&P core values come to 17/35 = 49%**, but **no difference in 14/35 = 40%**. Andrews often adds "more generally used than" the base, as in hoʻohiluhilu and lealea.
- The label "Freq." works as an expression-plane tag. Andrews applies it to honuhonu, a game "crawling like turtles".

**What the shapes signify.** A&M "found no correlations between any of the major subcategories, reduplicant sizes, or meanings that we coded for". The **shape allomorphs of reduplication are therefore non-significant**. Only the presence of copying could carry content, and in the attested lexicon that content is plural-valued (iterative / intensive / attenuative / "N-y" quality / plural) or null.

**Proportional subseries that do hold** (attested, R-coded):

- *iterative*: ʻaki : ʻakiʻaki :: lele : lelele :: hene : henehene :: ʻai : ʻaʻai "eating away (sore)";
- *quality "full of / like N"*: hulu "hair" : huluhulu "hairy" :: puʻu "lump" : puʻupuʻu "lumpy" :: hinu "oil" : hinuhinu "glossy" :: lolo "marrow" : lololo "rich" :: puka "hole" : pukapuka "full of holes";
- *attenuative / diminutive*: miko "salted" : mikomiko "lightly salted" :: ʻaha "needlefish" : ʻahaʻaha "young needlefish".

Each holds for a handful of attested pairs. None approaches the hoʻo- causative series in size or consistency.

### 5.3 Productivity

In Hawaiian Wikipedia, full XX types have P = **0.009** (50 hapaxes out of 5,432 tokens), against 0.016 for hoʻo-. Only **6 of 165 XX types (4%)** are absent from the Andrews text, compared with 32% for hoʻo-. In modern writing, reduplication is almost entirely **reuse of stored, lexicalised forms**. Roughly half the POLLEX reduplications were already reduplicated in the proto-language.

**Verdict.** Reduplication is *pervasive* (A&M: 1,632 entries) but **not a proportional series in the attested lexicon**. The content difference is plural-valued or absent, and a third of base/derived pairs show no glossed difference at all. It is lexically idiosyncratic, with small regular islands.

---

## 6. Phrasal derivations (for comparison): ʻana and ʻia

These are written as separate words. They are syntactic particles, not affixes. E&P call ʻana a particle (Medeiros), and Wikipedia calls ʻia a passive particle. They are the most productive and the most constant in value:

| process | host types | tokens | hapax hosts | P |
| --- | --- | --- | --- | --- |
| host + ʻana (nominaliser, "the V-ing") | 424 | 2,977 | 194 | **0.065** |
| host + ʻia (passive) | 416 | 5,330 | 200 | 0.038 |
| hoʻo-X (word-internal) | 328 | 9,256 | 148 | 0.016 |
| full reduplication XX | 165 | 5,432 | 50 | 0.009 |
| all words (baseline) | 7,860 | 369,697 | 4,210 | 0.011 |

Their content difference is uniform, which makes them proportional in the strongest sense. But a two-slot frame [V][ʻana] has a constant second slot, so it carries nothing.

---

## 7. Where one diacritic *is* significant: two closed grammatical series

This bears directly on the owner's rejection of one-mark tumbles (`mark_pairs.py`, `closed_series.py`).

**In the open lexicon the owner is right, and measurably so.** The attested lexicon has 109 one-kahakō minimal pairs.

- 11 belong to the plural series below.
- 17 share some gloss content, but on inspection 14 are **spelling variants of one word** (kūlou/kulou, nānā/nanā, puhi/pūhi, ʻopihi/ʻōpihi; often POLLEX and Wiktionary spelling the same word differently) and 3 are function-word homographs (ko/kō, na/nā, a/ā). None is a morphological relation.
- 81 share nothing.

There are also 110 one-ʻokina pairs: 103 share nothing, and 7 share gloss content (variants such as aʻuaneʻi/auaneʻi, or the pronoun series below). Outside the two series below, a one-mark switch is distinctive without being significant.

**(a) Plural by lengthening in person nouns (a replacive morpheme).** Wiktionary has 11 single-word pairs, all human nouns, all lengthening the antepenultimate vowel of the stem:

> kanaka : kānaka :: wahine : wāhine :: makua : mākua :: kupuna : kūpuna :: kahuna : kāhuna :: kaikamahine : kaikamāhine :: luahine : luāhine :: ʻelemakule : ʻelemākule :: ʻaumakua : ʻaumākua :: makuahine : mākuahine :: kahiko : kāhiko

Wikipedia describes the rule, without citation. POLLEX (P&E) lists the plural form itself for 4 of the 11: kūpuna, mākua, wāhine, ʻaumākua.

Distribution in Hawaiian Wikipedia: the long form follows nā/mau (plural determiners) in **1,419 of 1,459 determiner contexts (97%)**. The short form does so in **85 of 672 (13%)**. Even without kanaka/kānaka the figures are 97% and 14%.

Here the kahakō is a **significant** opposition (singular : plural), proportional and fully regular, but closed: about 11 attested pairs, and no new members.

**(b) The singular possessive pronouns: ʻokina = 1st person.** The three slots are k-/n-/∅-, o/a, and person. All 18 forms are in the lexicon, and POLLEX reconstructs \*te-o-ku → koʻu and \*te-o-u → kou.

| | 1sg | 2sg | 3sg |
| --- | --- | --- | --- |
| k-, o-class | koʻu | kou | kona |
| k-, a-class | kaʻu | kāu | kāna |
| n-, o-class | noʻu | nou | nona |
| n-, a-class | naʻu | nāu | nāna |
| ∅, o-class | oʻu | ou | ona |
| ∅, a-class | aʻu | āu | āna |

Here koʻu "my" : kou "your" :: noʻu : nou :: oʻu : ou. The ʻokina is the reflex of 1sg \*-ku, and it is **significant**. In the a-class the switch is ʻ ↔ macron: **kaʻu "my" ↔ kāu "your"**. That is exactly the shape of the rejected kai → kaʻi → kā tumble, but here it means something.

This belongs mainly to the pronoun level and is noted here because it answers the one-mark question. It is a perfect proportional system, but tiny: 6 pairs, 18 forms, all grammatical words.

---

## 8. Non-significant oppositions at this level

- **hoʻo- / hō- / hoʻ- (+ length) / hōʻ-**: conditioned by the base's initial segment, with 96% in the modal cell (§3.2). Their ʻokina and kahakō differences are automatic.
- **haʻa- / hoʻo-**: syntactically conditioned (Medeiros), or lexically fixed and rare. There is a little free variation (hoʻonui ~ haʻanui per Andrews 1922, though they mean different things today: haʻanui "brag").
- **Reduplicant shape** (whole, foot, CV; prefix, suffix, infix) and its σ1 lengthening or shortening: no correlation with meaning in 1,632 words (A&M).
- **Vowel-length alternations under -na** (hānau → hanauna, koi → kōina): morphophonemic (Medeiros).
- **The reduplication opposition itself, in about a third of attested pairs**: base and reduplicated form are synonyms in the glosses, a neutralisation on the content plane. Examples: maʻo/maʻomaʻo, kiʻe/kiʻekiʻe, wiki/wikiwiki; and in Andrews, hoʻohene/hoʻohenehene, nakii/nakiikii.

---

## 9. Families and crossings (n-slot structure)

These are from `families.py`.

**Marked lexicon.** Bases are counted by how many of {hoʻo-, RED, -na, hoʻo-+RED} are attested with them, by string match (so including spurious matches, §3.3/§5.2): 345 bases have 1, 86 have 2, 18 have 3, 3 have 4. There are only **7 proportional squares** X : hoʻo-X :: XX : hoʻo-XX (hala, kū, lā, holo, ʻike, ʻaka, ʻona), and 15 bases have hoʻo-, RED and -na all attested.

**Andrews 1922** (unmarked spelling, so an upper bound): 771 hoo-X with X a headword; 517 XX; 265 X-na; **115 squares** X : hooX :: XX : hooXX; 202 bases with both hoo-X and XX.

The derivational network is real but sparse in the modern attested data.

---

## 10. Frame assessment (options only, no recommendation)

**A [prefix][base] frame with the prefix slot ∅ ↔ hoʻo-.** A turn of the prefix block is a *significant* commutation: X → "cause X". The difference is constant across ~120 attested causative pairs, so a line between two HOʻO blocks would be a true statement.

But the content is one grammatical relation, which is 1 bit of information. ROOTS.md's simulation (243 words, "hoʻo- as a stone") found that it links 90% of words with lines meaning "both causative". Structurally that is the expected behaviour of a high-frequency *grammatical* morpheme, not a defect in the data.

The simulative value (≈30 pairs, human-noun bases) gives a second reading, so the same HOʻO block would sometimes mean "act like". That is a polysemy the reader would have to track.

**The same frame with the base slot turning under a constant hoʻo-** (hoʻonui → hoʻoulu). This keeps the jukugo property: the unmoved block keeps its value, and the root block carries lexical meaning. It inherits the root homograph problem documented in ROOTS.md (lua, kala, hala).

**An "operator" frame: one root, several grammatical operations**: ʻike / hōʻike / ʻikena / ʻikeʻike / hōʻikeʻike. Every turn is a proportional commutation of a grammatical sign. But the marked lexicon has only ~21 bases with ≥3 operations and 7 full squares (Andrews: 115 squares, with reconstruction of marks needed).

**Closed paradigms** suit a small piece: perfect proportionality, tiny inventories.
- numerals × {ʻe-, ʻa-, pā-}: 28 cells, 23 attested;
- kai- kin terms: 5;
- plural lengthening: 11 pairs;
- possessive pronouns: 18 forms, where the ʻokina or macron tumble *is* meaningful.

**Reduplication as a doubling block** ([X] ↔ [X][X]). The content change is not constant: iterative, intensive, quality, attenuative or null, and null in about a third of cases. A further 25–38% of string-level pairs are spurious. As a frame it would read as arbitrary as often as it reads as meaningful.

---

## 11. Open doubts

- **Gloss-based coding under-detects subtle values.** A&M say reduplicative meanings "can be quite subtle", and P&E leave many "Redup." entries unglossed with a default freq./intensive meaning (A&M). Some of the 31% "no difference" may be nuances that English glosses lose. Wiktionary sometimes copies glosses.
- One coder (me), with no second rater. The reasons are written beside each code so they can be audited. Borderline calls are marked P.
- The lexicon is small (2,897 forms). P&E has about 29,000 entries (A&M fn. 1). Absolute sizes here are lower bounds, and Andrews is an unmarked-spelling proxy for scale.
- The Andrews OCR parse misses some headwords. About 83% of the 60 most frequent hoʻo- words in Wikipedia were found as headwords, and "absent from Andrews text" overstates novelty (hoʻololi).
- Wikipedia's Hawaiian is modern and partly learner-written, with coinages, so productivity figures describe written modern usage.
- The modern-coinage status of ʻū- words and of some hoʻo- words (hoʻomohala, hoʻonaʻauao) is *unverified*.
- I did not read E&P 1979 or P&E 1986 directly. Their claims are cited through Brittain 1993, A&M 2015 and Medeiros 2020.

---

## 12. Files

- `scripts/common.py`: loaders and normalisation (ʻ U+02BB, NFC).
- `scripts/hoo.py`, `allomorphy.py`, `affixes.py`, `redup.py`, `closed_series.py`, `mark_pairs.py`, `families.py`, `pollex_inherited.py`: extraction and measurement.
- `scripts/corpus.py`, `productivity.py`: Hawaiian Wikipedia frequency table and Baayen P.
- `scripts/andrews_counts.py`, `andrews_freq_sample.py`, `andrews_hoo_heur.py`: Andrews 1922 measures.
- `scripts/sample.py`, `stats.py`: seeded samples and the tallies with Wilson intervals (`tables/stats.txt`).
- `tables/*_pairs.tsv`: all attested pairs. `tables/codes_*.tsv`: hand codes with reasons. `tables/sample_*.txt`: what the coder saw.
- `src/`: the cited papers (Alderete & MacMillan, Brittain, Medeiros).
