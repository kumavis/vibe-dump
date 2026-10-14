# Historical structure: what Hawaiian's past leaves in its present system

Level: **historical / comparative structure**. Research only. Nothing here changes or recommends a change to
the Pōhaku Tumble design. Where a frame is mentioned it is an *option*, for the owner to judge.

Everything below is one of:
- **measured**: by a script in this folder, and the count says how;
- **cited**: a source with a URL;
- **unverified**: labelled as such.

"Attested in the data" means local data: POLLEX (98% cited to Pukui & Elbert 1986), Wiktionary (kaikki dump),
Andrews–Parker 1922, Hawaiian Wikipedia. "Described" means a grammar, paper or database note says so.

Spelling: ʻokina is U+02BB and kahakō vowels are precomposed. POLLEX's ʔ and doubled vowels are converted.

---

## 0. The answer in brief

1. **Sound correspondences are very regular, and they explain the homograph problem.**
   - 90.1% of aligned Hawaiian reflexes are fully regular.
   - Hawaiian has merged more Proto-Polynesian (PPN) consonants than any of the four comparison languages:
     13 PPN onsets become 9 Hawaiian outcome classes, against 10 for Māori and 12 for Tongan.
   - Those mergers made **at least 81 POLLEX-attested homonyms**: *lua* "two"/"pit", *ao* "day"/"cloud",
     *hala* "pandanus"/"sin", *kuli* "deaf"/"knee", *mana* "branch"/"power"…
   - This is the structural cause of the "pervasive root homographs" that ROOTS.md found.
2. **The owner's hypothesis is confirmed historically, with one exception.**
   - Of **89 ʻokina minimal pairs** among POLLEX-attested words, **85 join unrelated etyma**. The ʻ member
     goes back to PPN \*k and the Ø member to \*q, \*h or nothing.
   - Of **58 kahakō pairs**, at least **50 join unrelated etyma**.
   - The exceptions are where an old *morpheme* has shrunk to one mark:
     - **The 1sg possessive \*-ku** survives only as the ʻokina of *koʻu, oʻu, noʻu, kaʻu, aʻu, naʻu*. So
       *koʻu* "my" : *kou* "your" :: *oʻu* : *ou* :: *noʻu* : *nou* is a proportional, significant ʻokina
       switch.
     - **PPN-level plural lengthening** (\*maatuqa, \*faafine) survives as *makua* : *mākua* ::
       *wahine* : *wāhine* (about 10 pairs).
   - These are closed grammatical series, not lexicon.
3. **History left several small, perfectly proportional grids inside words.** All are closed classes:
   - possessives, 3 × 2 × 3 = 18 cells, < \*te-qa-ku etc.;
   - dual/plural pronouns, 4 × 2 = 8 cells. The number endings come from the numerals: dual < \*rua "two",
     plural < \*-tou << \*-utolu "three", per POLLEX's notes;
   - demonstratives, 3 × 3 = 9 cells;
   - numerals with ʻe-, 1–9.
   - The causative *hoʻo-* (< \*faka-) is the one large series. It is historically layered: irregular,
     productive *hoʻo-* sits beside a regular fossil *haʻa-*, and *hō-* is conditioned by bases that began
     with old \*k.
4. **Inherited compounds are a real but thin subset.**
   - **155** POLLEX root+root rows (146 distinct proto pairs). In **78** of them every part survives free in
     Hawaiian as the same etymon.
   - Waimaka < PCE \*wai-mata, waiū, kahakai, paʻakai, alanui and makapō are among them. The piece's own
     name, *pōhaku*, is < PCE \*poo-fatu.
   - As a frame they are as thin as the attested 128: mean degree 2.15, **zero** a:b::c:d rectangles.
   - Only **13** of the 128 attested candidates are inherited.
5. **A cross-language "tumble" (maka ↔ mata) would be a correspondence, not a commutation.**
   - Expression changes regularly (67% of Hawaiian–Māori pairs) while content is supposed to stay
     constant. But it often doesn't: a crude gloss check finds no shared content word for about 45% of
     pairs.
   - It also means putting Māori, Tahitian, Samoan and Tongan words in front of their communities.
     §6 lists the care questions.

---

## 1. Regular sound correspondences (Hawaiian : Māori : Tahitian : Samoan : Tongan)

**Method** (`correspondences.py`, `correspondences2.py`):
- For each of the 2,258 POLLEX Hawaiian rows, align the protoform (`proto_ng`, hyphens removed) with each
  reflex: Hawaiian `haw_raw`, plus every cognate listed for the four languages.
- Only *strict* forms are used: the language's own letters, no "/" (POLLEX's mark for non-cognate material),
  no brackets or accents (which drops 18th–19th-century spellings such as Tongan *foccatoó*), no clusters.
- Each form is tokenised into (C)V units. A pair is kept only if it has as many vowel units as the
  protoform; long vowels count as 2 units.
- Onsets and vowels are then aligned position by position, counting each (entry, language, form) once.
- Pairs used: Hawaiian 1,602, Māori 1,282, Tahitian 1,091, Samoan 775, Tongan 767. Unequal length or
  non-strict pairs were skipped: 682 / 672 / 588 / 374 / 709.

**Table 1. Modal reflex of each proto onset.** Count = modal / aligned, with the next reflexes in brackets.
All protoform levels are included.

| proto | Hawaiian | Māori | Tahitian | Samoan | Tongan |
|---|---|---|---|---|---|
| \*p | p 302/304 (99%) | p 273/278 (98%) | p 199/199 (100%) | p 116/116 (100%) | p 109/109 (100%) |
| \*t | **k** 530/534 (99%) | t 456/458 (100%) | t 377/380 (99%) | t 243/247 (98%) | t 223/250 (89%) [s 21] |
| \*k | **ʻ** 488/512 (95%) [Ø 19, k 4] | k 410/417 (98%) | ʻ 256/374 (68%) [Ø 117]¹ | ʻ 207/214 (97%) | k 203/209 (97%) |
| \*q | Ø 166/176 (94%) [ʻ 7] | Ø 143/143 (100%) | Ø 127/133 (95%) | Ø 135/138 (98%) | ʻ 133/153 (87%) [Ø 19] |
| \*m | m 303/307 (99%) | m 235/236 (100%) | m 193/195 (99%) | m 173/174 (99%) | m 166/166 (100%) |
| \*n | n 209/217 (96%) [l 4] | n 160/165 (97%) | n 123/126 (98%) | n 91/97 (94%) | n 77/78 (99%) |
| \*ŋ | **n** 171/176 (97%) [l 3] | ŋ 132/139 (95%) | ʻ 72/115 (63%) [Ø 43]¹ | ŋ 81/83 (98%) | ŋ 74/76 (97%) |
| \*f | **h** 290/294 (99%) | h 119/228 (52%) [f 105]² | h 131/213 (62%) [f 78]² | f 135/136 (99%) | f 136/140 (97%) |
| \*s | **h** 148/152 (97%) | h 114/118 (97%) | h 92/96 (96%) | s 73/75 (97%) | h 77/81 (95%) |
| \*h | Ø 54/103 [h 46]³ | Ø 47/77 [h 26]³ | Ø 45/68 [h 22]³ | Ø 36/47 [s 8] | h 49/52 (94%) |
| \*w | w 114/117 (97%) | w 86/89 (97%) | v 71/72 (99%) | v 55/56 (98%) | v 51/53 (96%) |
| \*l | l 332/342 (97%) [n 6] | r 287/291 (99%) | r 236/241 (98%) | l 225/227 (99%) | l 212/218 (97%) |
| \*r | **l** 247/251 (98%) [n 3] | r 171/173 (99%) | r 170/176 (97%) | l 38/41 (93%) | Ø 43/51 (84%) [l 5] |
| no onset | Ø 848/861 (98%) [ʻ 7] | Ø 730/738 (99%) | Ø 532/548 (97%) | Ø 315/318 (99%) | Ø 266/273 (97%) |

Notes on Table 1:
1. Tahitian \*k/\*ŋ → Ø is probably orthographic: many Tahitian sources in POLLEX don't write the glottal
   stop. Unverified per item.
2. Māori and Tahitian \*f split by the following vowel (PPN/PNP rows only):
   - Māori: wh before *a* 52 : h 20; before *e* 13 : 9; before *i* 8 : h 14; before *o* 0 : h 20; before
     *u* 0 : h 27.
   - Tahitian: before *a* f 48 : h 17; before *o* 0 : 18; before *u* 0 : 30.
   - Hawaiian is h almost everywhere (203 of 206). The exception is *wāhine/wahine* < \*fafine, \*f → w.
3. At PCE level and below POLLEX writes \*h for the merger of PPN \*s and \*h. Restricted to PPN/PNP rows,
   Hawaiian \*h → Ø is 53/58 (91%) and \*s → h is 104/108 (96%).

**Table 2. Correspondence sets.** Only positions where all five languages align (Haw : Mao : Tah : Sam : Ton).

| proto | n | modal set | share |
|---|---|---|---|
| p | 24 | p : p : p : p : p | 100% |
| t | 82 | k : t : t : t : t | 88% |
| k | 58 | ʻ : k : ʻ : ʻ : k | 78% |
| q | 52 | Ø : Ø : Ø : Ø : ʻ | 94% |
| ŋ | 26 | n : ŋ : ʻ : ŋ : ŋ | 69% |
| f | 47 | h : h : h : f : f | 53% (next h : f : f : f : f, 17) |
| s | 15 | h : h : h : s : h | 93% |
| h | 23 | Ø : Ø : Ø : Ø : h | 83% |
| w | 10 | w : w : v : v : v | 90% |
| l | 69 | l : r : r : l : l | 94% |
| r | 13 | l : r : r : l : Ø | 77% |

**Vowels** are almost invariant: the proto vowel equals the reflex vowel in Hawaiian 96.9% of the time
(4,211/4,347), Māori 97.9%, Tahitian 98.1%, Samoan 99.3% and Tongan 96.1%.

**Whole-word regularity, Hawaiian.**
- **1,443 of 1,602** aligned reflexes (90.1%) are fully regular: every onset is the textbook reflex and
  every vowel is identical.
- The commonest irregularity is *a > o* (71 tokens in 44 rows). **28 of those 44 rows are \*faka- → hoʻo-**
  (§2.6).
- Next come *a > e* (19), \*k → Ø (19), Ø → ʻ (7, e.g. ʻae, ʻē "yes") and l ~ n (6).
- The list is in `hawaiian_irregulars.json`.

**System view: mergers and their functional load.** Distinct onset outcomes from the 13 PPN onsets (from
Table 1):

| language | outcome classes | mergers |
|---|---|---|
| Hawaiian | **9** | \*q=\*h=Ø, \*n=\*ŋ, \*f=\*s, \*l=\*r |
| Tahitian | 9 | \*q=\*h=Ø, \*k=\*ŋ (ʻ), \*f=\*s (h, partly), \*l=\*r |
| Māori | 10 | \*q=\*h=Ø, \*f=\*s (h, partly), \*l=\*r |
| Samoan | 11 | \*q=\*h=Ø, \*l=\*r |
| Tongan | 12 | \*s=\*h, \*r=Ø |

**Merger homonyms (measured).** Script: `doublets_mergers.py` §B. It finds the smallest set of Hawaiian
mergers that makes two etyma identical.
- **276 of 1,694** distinct Hawaiian forms in POLLEX reflect two or more POLLEX entries.
- **129** of those involve identical proto strings: homonymy already present in PPN, e.g. \*mata "eye" and
  \*mata "raw".
- **81 forms** have at least one pair of etyma made identical only by a Hawaiian merger. Counts overlap:

| merger | forms |
|---|---|
| \*q,\*h → Ø | 40 |
| \*r/\*l | 25 |
| \*ŋ/\*n | 15 |
| \*s/\*f | 14 |

Examples, with forms the roots work cares about:
- *lua* < \*rua "two" / \*lua "pit";
- *ao* < \*qaho "day" / \*qao "cloud";
- *hao* < \*faqo "peg" / \*faqao "rob" / \*saqo "draw a net" / \*fao (tree);
- *hala* < \*fara "pandanus" / \*sala "error, sin";
- *hua* < \*fua "fruit" / \*sua;
- *hulu* < \*fulu "feathers" / \*sulu;
- *kuli* < \*tuli "deaf" / \*turi "knee";
- *mana* < \*maŋa "branch" / \*mana "power";
- *manu* < \*manu "bird" / \*maŋu "dried up";
- *malama* < \*marama "light" / \*malama "moon";
- *kula* < \*tuqula "perch" / \*tula / \*tura;
- *lau* < \*lau "leaf" / \*rau "hundred, net";
- *kau*, *koa*, *kua*, *mea*, *pā*, *pū*, *uli*, *wai*.

Structural reading: Hawaiian's small consonant inventory comes from mergers, and mergers raise homonymy.
The *lua* "two"/"pit" problem in ROOTS.md is therefore systemic, not incidental. The full table is in
`doublets_mergers.md`.

**Doublets** (one POLLEX entry → two or more Hawaiian forms): 112 entries.
- **61** are reduplicated or affixed variants.
- **8** are l ~ n: *aliali/aniani* < \*qali, *kūlou/kūnou*, *lānahu/nānahu*, *melehune/menehune*,
  *uluhe/unuhe*, *koʻala/koʻana*, *lonalona/nonanona*, *kulou/kunou*.
- **3** are k ~ ʻ: *hākuʻe/hāʻuke*, *pūkākā/pūʻāʻā*, *kekahi/ʻekahi*.
- **9** differ in vowel quality: *imu/umu*, *ʻalele/ʻelele*, *pahole/pohole*…
- **3** differ in length only: *huna/hūnā*, *ʻaumakua/ʻaumākua*, *heʻi/hēʻī*.
- **1** differs in ʻokina only: *auaneʻi/aʻuaneʻi*.
- 20 are "other" and 7 have three or more forms.

The l ~ n and k ~ ʻ doublets are free or dialectal variation: same meaning, different expression. That is the
opposite of a significant opposition.

---

## 2. Structure history left inside words

### 2.1 ʻokina and kahakō minimal pairs, checked against their etyma (`minimal_pairs_hist.py`)

A pair is two distinct POLLEX-attested Hawaiian forms that differ by exactly one ʻokina, or exactly one vowel
length. They count as *related* only if:
- the proto strings are identical, or
- they share a hyphen-delimited morpheme (one form must be segmented), or
- both are pronominal suffixes.

| pairs | n | related etyma | unrelated |
|---|---|---|---|
| ʻ vs Ø | 89 | **4**: *koʻu/kou* (\*te-o-ku/\*te-o-u), *oʻu/ou* (\*-ku/\*-u), *auaneʻi/aʻuaneʻi* (spelling variant), *ʻao/ʻaʻo* (POLLEX assigns both to \*kao) | **85 (96%)** |
| V̄ vs V | 58 | ≤ **8**: *ʻaumakua/ʻaumākua* (plural), *ka/kā* (article / a-class particle, both with \*te), *malama/mālama* (\*ma-rama, sense drift), and coincidences such as *kahi/kāhi*, *nono/nonō* | **≥ 50 (86%)** |

- The unrelated ʻ:Ø pairs are lexical: *ahi* < \*afi "fire" : *ʻahi* < \*kasi "tuna"; *alo* < \*qaro "front" :
  *ʻalo* < \*kalo "dodge"; *ako* < \*qato "thatch" : *ʻako* < \*kato "pluck".
- They inherit the PPN contrast \*k : \*q/\*h/Ø, which was itself lexically arbitrary.
- **Verdict:** for phonemic ʻokina and kahakō switches, the owner's hypothesis holds historically too.
  - They are *distinctive, not significant*: the expression difference has no constant content difference.
  - The exceptions are exactly where a morpheme (\*-ku, the plural length) has been reduced to a single mark.

### 2.2 Possessive pronouns: the ʻokina as a fossil morpheme (`paradigms_hist.py`)

POLLEX segments the protoforms:

| Hawaiian | protoform | segments |
|---|---|---|
| *kaʻu* | \*te-qa-ku | article + a-class + 1sg |
| *koʻu* | \*te-o-ku | article + o-class + 1sg |
| *kāu* | \*te-qa-u | article + a-class + 2sg |
| *kou* | \*te-o-u | article + o-class + 2sg |
| *kāna* | \*te-qa-na | article + a-class + 3sg |
| *kona* | \*te-o-na | article + o-class + 3sg |

The suffixes and particles have their own entries:
- \*-ku [AN] "first person singular possessive suffix". POLLEX notes PEO \*-ku and PAN \*aku "1s".
- \*-u [PN] "second person singular". POLLEX notes POc \*-mu.
- \*-na, the third person singular.
- \*qa (a-class, "dominant") and \*o (o-class, "subordinate").

The regular change \*k → ʻ turned the 1sg suffix into a bare ʻokina.

| | 1sg (-ʻu < \*-ku) | 2sg (-u < \*-u) | 3sg (-na) |
|---|---|---|---|
| k-, a-class | kaʻu | kāu | kāna |
| k-, o-class | koʻu | kou | kona |
| Ø-, a-class | aʻu | āu | āna |
| Ø-, o-class | oʻu | ou | ona |
| n-, a-class | naʻu | nāu | nāna |
| n-, o-class | noʻu | nou | nona |

Attestation:
- 18/18 cells are Wiktionary heads with the expected possessive gloss.
- 14 match a POLLEX/P&E form. Some of those matches are unrelated homographs: *kou* also < \*tou (a tree),
  *kona* < \*toŋa "leeward", *aʻu* < \*haku "swordfish", *nou* < \*nou "throw".
- In the o-class rows, 1sg and 2sg differ **only by the ʻokina**.
- In the a-class rows they differ by ʻokina plus length: *kaʻu* : *kāu*.

Corpus frequency (hawwiki tokens): kaʻu 15, kāu 16, koʻu 36, kou 75, kāna 1,045, kona 2,803.

Described in the literature:
- Wilson, W. H. (1976), "The o/a distinction in Hawaiian possessives", *Oceanic Linguistics* 15:39–50.
  Located by search, not read.
- Wilson, W. H. (1980), *Proto-Polynesian possessive marking*, PhD dissertation, University of Hawaiʻi
  (abstract read): <https://scholarspace.manoa.hawaii.edu/items/8509ed2c-b4c0-4f8c-a05c-fee725cbfcd0>.
- The phonology sibling reports reading Wilson 1980's segmentation *k-a-ʻu*.

### 2.3 Dual and plural pronouns: numerals inside pronouns

| | dual | plural |
|---|---|---|
| 1 inclusive | kāua < \*taa-ua | kākou < \*taa-tou |
| 1 exclusive | māua < \*maa-ua | mākou < \*maa-tou |
| 2 | ʻolua (POLLEX: ʻŌlua < \*koo-lua) | ʻoukou < \*kou-tou |
| 3 | lāua < \*laa-ua | lākou < \*laa-tou |

Attestation: 8/8 Wiktionary, 7/8 POLLEX. Hawaiian Wikipedia tokens: lākou 952, lāua 333, mākou 86, kākou 63,
ʻoukou 9, kāua 8, māua 6, ʻolua 0.

**Does -kou relate to \*tolu "three", and -ua/-lua to lua "two"?** Yes, according to POLLEX's own
etymological notes (local cache of the entry pages):

| POLLEX entry | note |
|---|---|
| TAA-UA | << PN \*ki-taa-rua |
| MAA-UA | << \*ki-maa-rua |
| LAA-UA | << \*ki-laa-rua |
| KOO-LUA | << \*kimo-rua |
| TAA-TOU | << \*taa-utolu |
| MAA-TOU | << PPN \*maa-utolu |
| LAA-TOU | << \*ki-laa-utolu |
| KOU-TOU | << \*kimo-utolu |

- PN \*(ki)taa-utolu is still reflected as Tongan *kitautolu*, Niue *tautolu*, and **Fijian *kedatou*
  "1st person *trial* inclusive"**: <https://pollex.eva.mpg.de/entry/taa-utolu/>.
- So the Polynesian plural was once a trial.
- The suffixing of \*rua and \*tolu for dual and trial is described as beginning in Proto-Eastern Oceanic
  (Lynch, Ross & Crowley 2002, *The Oceanic Languages*). That is known **via a search-result summary only;
  not read**.

Wiktionary's etymologies (kākou = kā- + *kolu*, ʻolua = ʻoe + *lua*) are folk-style segmentations. They match
the history in outline but not in detail: the Hawaiian -kou is from \*-tou, not from *kolu*.

**Synchronic transparency** (Saussure: the speaker does not see diachrony):
- Only *ʻolua* contains the live word *lua* "two", which has 201 hawwiki tokens.
- In *kāua, māua, lāua* the -ua has no free counterpart.
- -kou ≠ *kolu* "three" for any speaker without the history.
- So the number grid is synchronically a real 4 × 2 proportional matrix, but its numeral origin is invisible.

### 2.4 Demonstratives

| | near speaker | near addressee | distant |
|---|---|---|---|
| kē- (te + deictic) | kēia < \*tee-ia | kēnā < \*tee-hena | kēlā < \*tee-laa |
| pe-/pē- "like" (\*pee-) | penei < \*pee-heni | pēnā < \*pee-hena | pēlā < \*pee-laa |
| bare particle | nei < \*nei | nā < \*naa | lā < \*raa |

- All 9 cells match POLLEX (P&E). Wiktionary has 5 as heads and Andrews 4.
- POLLEX notes: TEE-IA << PN \*te "article" + \*ia "this, that"; PEE-HENA << PN \*pee- "be like".
- The opposition is gradual (person-anchored distance: near me / near you / yonder) and multilateral.

### 2.5 Numerals and their prefixes

- **Roots**: kahi < \*tasi, lua < \*rua, kolu < \*tolu, hā < \*faa, lima < \*lima, ono < \*ono, hiku < \*fitu,
  walu < \*walu, iwa < \*hiwa.
  - All are PPN, and most are Austronesian per POLLEX notes (PAN \*duSa, \*telu, \*Sepat, \*lima, \*enem,
    \*pitu, \*walu).
- **ʻumi** "ten" < PPN \*kumi "ten-fathom measure".
- **anahulu** "ten days" < \*haŋafulu "ten".
- **lau** "400" < \*rau "hundred".
- **mano** "4,000" < \*mano "thousand". The counting base moved; the words stayed.

**Prefix × root (Wiktionary heads; hawwiki tokens):**

| prefix | origin | cells | corpus |
|---|---|---|---|
| ʻe- | PN \*e "numeral particle", POLLEX E.1B, written ʻĒ- | 9/9 Wiktionary | ʻelua 283, ʻekolu 156, ʻehā 125, ʻelima 75, ʻeono 55, ʻehiku 45, ʻewalu 42, ʻekahi 33, ʻeiwa 19 |
| ʻa- | EP \*ka(a)- "counting particle", POLLEX KA-.1; ʻakahi < PCE \*kaa-tasi | 9/9 Wiktionary | 0–1 tokens each |
| hoʻo- | \*faka- | 2: hoʻokahi < \*faka-tasi (216 tokens), hoʻolua < \*faka-rua | |
| pā- (distributive) | | 3: pālua and pālima (Wiktionary), pākolu (Andrews only) | pākahi has 15 hawwiki tokens but is in neither dictionary source |
| kau- | PN \*tau- "prefix to numerals" | kaukahi < \*tau-tasa, kaulua < \*tau-lua, kaukolu | |
| kua- | \*tuqa- | kuakahi | |

On the ʻe- prefix:
- Its **ʻ is unexplained** by the regular correspondences: \*e has no consonant, and Ø → ʻ is a 7-token
  irregularity class.
- POLLEX separately puts *ʻekahi* under NP \*te-tasi "a certain one", beside *kekahi*, flagged
  *Problematic*.
- POLLEX writes the prefix long (ʻĒ-) where Wiktionary writes ʻe-. Unresolved: P&E not consulted.
- Only the ʻe- row is full in use. The prefix slot is not a proportional series: its cells are missing or
  near-zero.
- The meaningful commutation is the root slot (ʻelua → ʻekolu). But a numeral is a grammatical word: the
  "content difference" is a number.

### 2.6 Causative: \*faka- → hoʻo- / hō- / hoʻ- / haʻa- (`causative.py`)

- **Two layers.**
  - *haʻa-* is the *regular* reflex of \*faka- (\*f → h, \*k → ʻ, a → a). It is fossil: 4 Wiktionary
    derivations (haʻalele, haʻaheo, haʻahaʻa, haʻalulu) and 3 POLLEX rows (haʻalele < \*faka-lele).
  - *hoʻo-* shows the *irregular* a > o twice, yet is productive: 117+ Wiktionary derivations and 26 POLLEX
    \*faka- rows.
  - POLLEX lists the Hawaiian reflex of FAKA-.1 as "Haʔa-, hoʔo-". No explanation of the o-vowels was found
    in the sources reachable here. **Unverified**: any assimilation account.
- **Allomorphy conditioned by an old \*k** (Wiktionary heads where both the derived word and its base are
  heads):

| allomorph | before | count |
|---|---|---|
| hō- | ʻ-initial bases | **20 of 21** (the 21st, *hōkū* "star" < \*fetuqu, is not a causative) |
| hoʻo- | consonant-initial bases | 117 |
| hoʻo- | i/u-initial bases | 5 |
| hoʻo- | ʻ-initial bases | 2 (hoʻoʻino, hoʻoʻulaʻula) |
| hoʻ- + long vowel | a/e/o-initial bases (hoʻāla, hoʻōla, hoʻēmi…) | 17 heads begin hoʻ- but not hoʻo-; 3 of them are not causatives (*hoʻi*, *hoʻihoʻi* "return", and the prefix entry *hoʻ-*) |

  - Historically, ʻ-initial bases are PPN \*k-initial bases. POLLEX: *hōʻike* < \*faka-kite,
    *hōʻā* < \*faka-kaa, *hōʻoi* < \*faka-koi.
  - So **the hō- allomorph is conditioned by the reflex of \*k**. Synchronically that is morphophonemics;
    the diachronic source is the \*k.
- **Structure:** a privative, proportional series (X : hoʻo-X "make X"). It is large (Wiktionary has 158
  hoʻo- analyses).
  - ROOTS.md already measured what it does to a board: a single morpheme on 115 stones, with lines meaning
    only "both causative".
  - That is the derivation sibling's level, so no further measurement here.

### 2.7 Plural by vowel length: an inherited kahakō that means something

Wiktionary "plural of" glosses give **10 pairs**, plus 2 variants.

| plural | singular | POLLEX (plural) | hawwiki pl / sg |
|---|---|---|---|
| kānaka | kanaka | — | 1455 / 1622 |
| wāhine | wahine | \*faafine [OC] "women" | 37 / 372 |
| mākua | makua | **\*maatuqa [PPN] "plural of matuqa"** | 137 / 91 |
| kūpuna | kupuna | \*tuupuna [CE] "plural of tupuna" | 40 / 40 |
| ʻaumākua | ʻaumakua | (\*kau-matua) | 0 / 1 |
| kāhuna | kahuna | — | 4 / 29 |
| kaikamāhine | kaikamahine | — | 10 / 135 |
| luāhine | luahine | — | 0 / 3 |
| ʻelemākule | ʻelemakule | — | 0 / 3 |
| kāhiko | kahiko | — | 5 / 379 |

- The lengthened vowel is always the antepenult (3rd from the end) in all 10.
- Māori reflexes in POLLEX show the same: Māori *waahine* "women", *maatua*, *tuupuna* "plural of tupuna".
- POLLEX notes PUK (Pukapuka) *tuupuna* as probably borrowed.
- So this is **inherited morphology**, reconstructed by POLLEX at PPN (\*maatuqa) and Oceanic level
  (\*faafine).
- Described: Wikipedia "Hawaiian grammar", citing Alexander's grammar:
  <https://en.wikipedia.org/wiki/Hawaiian_grammar>.
- Structure: a privative opposition (length marked = plural), proportional, closed (human nouns only,
  mostly kin and age terms).

---

## 3. Inherited compounds (`inherited_compounds.py` → `inherited_compounds.tsv`)

**Method:**
- Start from POLLEX rows whose protoform has an internal hyphen: 566 rows, giving **564 distinct
  (entry × Hawaiian form)**, 535 entries.
- Classify each with the first rule that fires:

| class | rule | rows |
|---|---|---|
| grammatical | pronoun, possessive or demonstrative | 30 |
| reduplication | identical parts, or a CV(V) copy | 96 |
| affixed | a part is a POLLEX affix (\*faka-, \*faa-, \*fia-, \*ka-, \*ma-, \*pee-, \*soo-, \*toko-, \*taki-, \*tuqa-, \*ŋa-…), or a suffix such as \*-ŋa/\*-ŋaa, \*-a, \*-ia | 156 |
| prefix-like | first part is a CV(V) element POLLEX also uses as a prefix (\*koo-, \*paa-, \*poo-, \*tii-, \*tuu-, \*taa-, \*maa-, \*tau-, \*saa-, \*kau-, \*pa-) | 127 |
| **compound** | every part is a lexical-looking root | **155** |

- Heuristic. The *prefix-like* class mixes real prefixes with roots. *pōhaku* < \*poo-fatu falls here:
  POLLEX POO-FATU.1\* [CE] "general term for stone or rock" << PN \*fatu.
- For each compound part, two survival tests:
  - **form**: is the part's regular Hawaiian reflex an attested Hawaiian word? This one is loose: it also
    accepts homographs, e.g. \*hui → *ui* "ask".
  - **etymon**: is the part's proto string itself a POLLEX protoform whose Hawaiian reflex is that form?
    This one is strict.

**Counts (compound class, 155 rows):**

| measure | count |
|---|---|
| level | PPN 65, PCE 49, PNP 26, PMQ 5, PEP 4, other 6 |
| every part's reflex is an attested word (form test) | 123 |
| **every part is the same etymon surviving free (strict)** | **78** |
| at least one part survives free (strict) | 144 |
| written as two words in P&E (POLLEX form contains a space) | 22, e.g. *wai puna, maka mua, pale kai, lau hala, make wai, mea ʻai, ake loa* |
| in `compounds.tsv` | **37** (31 candidate, 4 screened-out, 2 prefix-led) |
| reviewed in the 905 | 31: keep 17 (+1 adjudicated keep), keep-pending 5 (+1), doubtful 4, drop 3 |

Cross-reference the other way:
- Of the **128 attested candidates** (W, W+A, A), **13** are inherited (compound or prefix-like): waimaka,
  waiū, paʻakai, alanui, ʻaumakua, kūlana, kūʻē, lauhala, kahakai, kōkala, aumoe, pākū, alakaʻi.
- Of the **166 "keep"** reviews, **24** are inherited.

**The strict 78**, in P&E spelling via POLLEX:
- Akalau, Ake loa, Alakaʻi, Anuhea, Hana-loa, Hoa aliʻi, Hulikua, Hulumanu, Ināhea, Iwilei
- Kahakai, Kahakō, Kai piʻi, Kaiao, Kaikea, Kalakupua, Kamaiki, Kamaliʻi, Kapuahi, Kaʻapuni, Kinilau,
  Kiʻilau, Konohiki, Kuakea, Kuaʻana, Kulu au moe, Kumulani, Kuʻemaka, Kākalaioa, Kōkala, Kōkuli, Kūkaʻi,
  Kūmau, Kūʻē
- Lau ʻawa, Lau-papa, Lauoho, Lihilihi, Limu kala, Limu-kala-wai, Lūʻau
- Maiʻao, Maka koa, Maka mua, Makapō, Makaʻala, Make wai, Make ʻai, Malihini, Manawa-nui, Manawai,
  Maʻalili, Mea ʻai, Muliwai, Māiʻuʻu, Mūheʻe
- Naupaka, Nuʻao, Palakū, Pale kai, Paʻakai, Paʻi-uma, Paʻiaʻa, Poʻohiwi, Punalua
- Uahi, Uaʻu, Wai puna, Waikahe, Wailua, Waimaka, Waiʻeli, Wao akua, ʻAlamihi, ʻAwapuhi, ʻAʻo, ʻElelū,
  ʻUku papa

Caveats on the 78:
- Names and fauna/flora are frequent.
- Some carry sensitive senses:
  - *Kōkuli* "earwax" < \*taqe-tuli, where *kae* is "excrement";
  - *ʻUku papa* "crab louse";
  - *Wailua* "spirit, ghost";
  - *Wao akua* (realm of gods; POLLEX maps it to \*wao-matuqa, an odd match);
  - *ʻaumakua* (family god), which is prefix-like here.
- A few are irregular: *Malihini* < \*manu-firi.

The design's own examples:
- *waimaka* < PCE \*wai-mata. POLLEX note: "<< PN \*wai 'water', \*mata 'eye'; \*wai(R) ni mata 'tears'
  (LPO V:197)". The "eye-water" construction is far older than Polynesian.
- *waiū* < PNP \*wai-uu.
- *kahakai* < PNP \*tafa-tai.
- *alanui* < PCE \*ara-nui.

**Families** (shared first or last proto part, 2 or more distinct Hawaiian words; `inherited_families.json`):
- First part:
  - \*mata- 9 (maka-…);
  - \*tuqu- 7 (kū-…);
  - \*wai- 7 (wai puna, waikahe, wailua, waimaka, wainohia, waiū, waiʻeli);
  - \*rau- 4;
  - 22 families of 2–3.
- Last part: -\*wai 5, -\*kau 4, -\*tea, -\*kai, -\*kao, -\*tai, -\*mata 3 each, and 21 families of 2.

**Frame density** (`frame_density.py`). A rectangle is A1B1, A1B2, A2B1 and A2B2 all attested: a true
a:b::c:d inside the compound frame.

| set | compounds | mean degree | ≥5 turns | 0 turns | rectangles |
|---|---|---|---|---|---|
| inherited compounds (proto parts) | 146 | **2.15** | 24 | 42 | **0** |
| inherited + prefix-like | 264 | 7.10 | 139 | 38 | 3 (all \*koo-/\*taa- × kiri/peka/piri) |
| compounds.tsv attested (W, W+A, A) | 128 | 2.25 | 21 | 27 | 0 |
| compounds.tsv core 905 (spelling-level parts) | 905 | 11.77 | 706 | 14 | 143 |

Assessment: *inherited* is a well-grounded, P&E-attested **label** on a subset, but not a frame of its own.
- It is as sparse as the attested 128 and has no internal proportions.
- Its value would be provenance on a card (the parts row could show PPN etyma). It does not add turns.

---

## 4. Proportional series found at this level

| series | expression | content | type | size | attested |
|---|---|---|---|---|---|
| possessive person | -ʻu : -u : -na | 1sg : 2sg : 3sg | equipollent, multilateral; the 1sg/2sg expression difference is privative (ʻ vs Ø) | 6 stems × 3 = 18 | W 18/18; POLLEX 14 (some homographs); \*-ku/\*-u/\*-na |
| possessive class | a(ā) : o | dominant : subordinate possession | equipollent, bilateral | 9 pairs (+ kā : ko) | W 18; POLLEX \*qa/\*o; Wilson 1976/1980 |
| pronoun number | -ua/-lua : -kou | dual : plural | equipollent, bilateral | 4 persons × 2 = 8 | W 8, POLLEX 7; << \*-rua / \*-utolu |
| demonstrative deixis | -ia/nei : -nā : -lā | near me : near you : yonder | gradual, multilateral | 3 bases × 3 = 9 | POLLEX 9/9 |
| plural length | V : V̄ (antepenult) | sg : pl (human nouns) | privative | ~10 pairs | W 10; POLLEX 3–4 plural etyma at PPN/OC/CE |
| numeral root in ʻe-X | kahi…iwa | 1…9 | multilateral (ordered) | 9 | W 9/9; corpus 19–283 each |
| causative | Ø : hoʻo-/hō-/hoʻ- | X : make X | privative | 158 Wiktionary analyses | POLLEX 30+ \*faka- rows |
| cross-language correspondence | Haw k : Mao t; Haw ʻ : Mao k… | Hawaiian : Māori (language, not meaning) | between systems; not an opposition within one | ~700 PPN/PNP etyma per language pair | POLLEX |

---

## 5. Non-significant oppositions at this level

- **ʻ : Ø and V̄ : V in the lexicon.**
  - 85/89 and at least 50/58 POLLEX minimal pairs join unrelated etyma (§2.1).
  - Historically they reflect PPN \*k : \*q/\*h/Ø and PPN length, which were lexically arbitrary there too.
  - That is the owner's point, confirmed with a historical measurement.
- **l ~ n, k ~ ʻ, w ~ v, a ~ e/u doublets** (8 + 3 + 0 + 9 POLLEX entries). Same meaning, different form:
  free or dialect variation.
- **Allomorph choice** (hoʻo-/hō-/hoʻ-): conditioned by the base's first sound, so it carries no content.
  - Reduplicant shape is also non-significant per the derivation sibling (citing A&M).
- **Mergers** erased PPN oppositions (\*r/\*l, \*ŋ/\*n, \*s/\*f, \*q/\*h/Ø). In 81 measured cases the
  merged forms became homonyms. The opposition is gone from the system, so a stone can't tell them apart
  by form.

---

## 6. A cross-language "inherited structure" frame, and the care it needs

**What it would be (option only).**
- A stone shows a Hawaiian word and tumbles to its cognate: *maka* → Māori *mata* → Samoan *mata* →
  Tongan *mata*.
- A line between stones means "same ancestor".
- In Hjelmslev's terms this is **not a commutation**. The expression difference (k : t) is not an invariant of
  either system: within Hawaiian, k never contrasts with t. The two are correspondences between two
  expression systems.
- Weinreich's term for this is a *diasystem*. Cited from memory: "Is a structural dialectology possible?",
  *Word* 10, 1954. Not re-checked this session.
- Its proportionality is real: Haw k : Mao t :: Haw ʻ : Mao k (Tables 1–2). But its content difference is
  "which language", not a meaning.

**Measured behaviour** (`cognate_frame.py`). PPN/PNP etyma only, strict forms. Gloss overlap is crude: an
English content word of 4+ letters shared by the two glosses.

| pair | etyma | identical form | regular difference | irregular | gloss overlap |
|---|---|---|---|---|---|
| Haw–Māori | 715 | 23% | 67% | 11% | 55% |
| Haw–Tahitian | 597 | 32% | 57% | 11% | 22%* |
| Haw–Samoan | 598 | 38% | 52% | 10% | 56% |
| Haw–Tongan | 586 | 17% | 63% | 19% | 52% |

\*Tahitian glosses are often French, so the overlap measure fails there.

- A quarter to a third of turns would show **no change at all** (identical forms).
- Meaning drifts often: POLLEX itself flags 57 Hawaiian rows "Uncertain Semantic Connection" and 120
  "Problematic".
- A line saying "same word" would often be false on the content plane.

**Cultural-care questions** (for the owner; not decided here):
1. **Whose words?**
   - Each language belongs to its people. For te reo Māori this is law: the Waitangi Tribunal's Te Reo
     Māori claim (Wai 11, 1986) found the language a *taonga* the Crown must actively protect. The Māori
     Language Act 1987 followed.
     <https://nzhistory.govt.nz/culture/maori-language-week/waitangi-tribunal-claim>
   - Showing Māori, Tahitian, Samoan or Tongan words would need speakers from each community to review.
     A Hawaiian reader can't vet them.
2. **Orthography.**
   - POLLEX writes doubled vowels and ʔ, and keeps 18th–19th-century spellings (Tongan *foccatoó*,
     Tahitian *Abua*).
   - Each community has its own standard: macrons in Māori; the ʻeta and macron in Tahitian; ʻ and macron
     in Samoan; fakauʻa and toloi in Tongan.
   - Displaying POLLEX forms as-is would misrepresent the languages.
3. **Reconstructions are hypotheses.**
   - Asterisked protoforms and arrows imply an ancestry narrative.
   - Several cognate sets touch the sacred or political: \*qatua → *akua* "god", \*tapu → *kapu*,
     \*mana, \*qariki → *aliʻi*, \*kau-matua → *ʻaumakua* "family god", *Wailua* "spirit".
   - Homeland names (Hawaiʻi / Havaiki) belong here too. Unverified as POLLEX entries; not checked.
4. **Hierarchy.** A pairwise "tumble" can read as "Hawaiian is Māori with k". Any design would have to avoid
   ranking languages, or presenting one as the original.
5. **Licence.** POLLEX states no open licence (ROOTS.md keeps its data out of git). A public piece built
   on its cognate sets would need permission and attribution: Greenhill & Clark 2011, *Oceanic
   Linguistics* 50(2):551–559.
6. **Subject.** The piece is about Hawaiian. A cognate frame makes Polynesia the subject. Changing the
   subject is a design decision for the owner.

---

## 7. What kinds of piece these frames could support (options only, not proposals)

- **Small closed grids**: possessives (18), pronouns (8), demonstratives (9).
  - Every tumble is a true proportional commutation.
  - The possessive grid holds the **one significant ʻokina switch**, *koʻu* ↔ *kou*.
  - But the vocabulary is tiny and grammatical, so a board would cycle quickly.
- **Provenance layer**: mark inherited compounds (78 strict, 155 total) and show their PPN etyma as a quiet
  annotation, without changing the frame.
- **Correspondence piece**: Hawaiian ↔ cognates, with meaning held constant (§6). It needs multi-community
  consent, standard orthographies, and a different subject.

---

## 8. Open doubts

- POLLEX writes *ʻŌlua* and *ʻĒ-* (long vowels) where Wiktionary writes *ʻolua* and *ʻe-*. Not resolved:
  Pukui & Elbert was not consulted.
- The ʻ of the numeral prefix ʻe- is irregular. POLLEX assigns *ʻekahi* to \*te-tasi with a "Problematic"
  flag. No source found that explains it.
- The o-vowels of *hoʻo-* (vs regular *haʻa-*) are unexplained in the sources reached.
- The pronoun-numeral derivations rest on POLLEX's notes (Clark). The Oceanic background (Lynch, Ross &
  Crowley 2002; Pawley 1972) was seen only as a search summary.
- Plural lengthening is described via Wikipedia (citing Alexander). Elbert & Pukui 1979 was not read.
- The inherited-compound classes are heuristic.
  - The affix and prefix-like lists decide 283 rows.
  - The strict etymon test depends on POLLEX coverage: a root POLLEX lacks counts as "not free".
  - Hand review is needed before any use.
- The gloss-overlap proxy is crude and fails for French glosses.
- Tahitian \*k/\*ŋ → Ø counts mix phonology with source orthography.
- Wiktionary's possessive and pronoun heads are crowd-edited. POLLEX/P&E confirm 14/18 and 7/8, minus the
  homograph caveats noted.

## Files

| file | contents |
|---|---|
| `common.py` | loaders, tokeniser, POLLEX → modern spelling |
| `correspondences.py` → `correspondences.md`/`.tsv`, `correspondence_examples.json` | §1 Tables 1–2 |
| `correspondences2.py` → `correspondences2.md`, `hawaiian_irregulars.json` | PPN-only \*h/\*s, \*f conditioning, regularity |
| `doublets_mergers.py` → `doublets_mergers.md` | doublets; merger homonyms |
| `minimal_pairs_hist.py` → `minimal_pairs_hist.json` | §2.1 |
| `hawwiki_counts.py` → `hawwiki_freq.json` | corpus tokens (729,721 tokens, 4,880 pages) |
| `paradigms_hist.py` → `paradigms.md` | §2.2–2.5, 2.7 |
| `causative.py` | §2.6 |
| `inherited_compounds.py` → `inherited_compounds.tsv`, `inherited_families.json` | §3 |
| `frame_density.py` | §3 frame density and overlap |
| `cognate_frame.py` → `cognate_frame.json` | §6 |

## Sources

- POLLEX-Online: Greenhill, S. J. & Clark, R. (2011), *Oceanic Linguistics* 50(2):551–559.
  - Local crawl of the Hawaiian reflexes and their entry pages.
  - Entries cited by ID; online example: <https://pollex.eva.mpg.de/entry/taa-utolu/>,
    <https://pollex.eva.mpg.de/entry/e1b/>.
- Wilson, W. H. (1980), *Proto-Polynesian possessive marking*, UH PhD dissertation:
  <https://scholarspace.manoa.hawaii.edu/items/8509ed2c-b4c0-4f8c-a05c-fee725cbfcd0> (abstract).
- Wilson, W. H. (1976), "The o/a distinction in Hawaiian possessives", *Oceanic Linguistics* 15:39–50. Not
  read.
- Lynch, J., Ross, M. & Crowley, T. (2002), *The Oceanic Languages*, Curzon. Search summary only.
- Wikipedia, "Hawaiian grammar": <https://en.wikipedia.org/wiki/Hawaiian_grammar> (secondary).
- NZ History, "Waitangi Tribunal claim" (Te Reo Māori, Wai 11):
  <https://nzhistory.govt.nz/culture/maori-language-week/waitangi-tribunal-claim>.
- Elbert, S. H. & Pukui, M. K. (1979), *Hawaiian Grammar*, UH Press (glottolog
  <https://glottolog.org/resource/reference/id/137036>). Not consulted directly.
- Local data: Wiktionary (kaikki, CC BY-SA), Andrews–Parker 1922 OCR, Hawaiian Wikipedia dump,
  `compounds.tsv`, and the 905 reviews with adjudications.
