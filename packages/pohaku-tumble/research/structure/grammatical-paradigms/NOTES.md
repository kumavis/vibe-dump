# Hawaiian closed grammatical paradigms: a structural analysis

Research note for the Pōhaku Tumble investigation, level **grammatical paradigms**.
This is research only. It proposes no change to the design, and nothing here is decided.
The owner approves design changes. The design currently leaves grammatical words out of
the word list. They are analysed here anyway, as the task asked.

Date: 2026-10-04. Directory:
`structure/grammatical-paradigms/`

Every number below comes from a script in this directory (see **Files**). Claims taken
from a grammar are cited. Analyses that are my own are marked *(my analysis)*. Anything
I could not check is marked *unverified*. Two kinds of evidence are kept apart:

- **attested in the data**: the local Wiktionary dump, POLLEX (Pukui & Elbert spellings),
  Andrews–Parker 1922, and the Hawaiian Wikipedia;
- **described in grammars**: Andrews 1854, Alexander 1864/1920, Wilson 1980, Baker 2012,
  Lyon 2018, and Elbert & Pukui 1979 as quoted by Lyon.

---

## 0. The question and the short answer

**The question.** Where does Hawaiian grammar have **proportional** oppositions? That
means a series in which the same expression difference carries the same content
difference (a : b :: c : d). A substitution inside a frame is then meaningful, not
arbitrary. How large, productive, attested and verifiable is each series?

**Short answer.**

1. **The closed paradigms are where Hawaiian is most proportional.** This holds inside
   words and in two-slot phrases. Every series below passes Hjelmslev's commutation test
   on both planes: change the expression and the content changes, in the same way across
   the series.
2. **The two series that are most usable and best attested are phrasal, not word-internal.**
   - **(a) The directional slot, V + mai/aku.** Commuting mai ↔ aku turns "toward the
     speaker" into "away from the speaker" across verbs. The pairs are lexically striking:
     - *hele mai/aku* "come/go"
     - *lawe mai/aku* "bring/take away"
     - *kūʻai mai/aku* "buy/sell"
     - *lilo mai/aku* "obtain/be lost"
     - *hiki mai/aku* "come to/go to"
     - *hoʻi mai/aku* "come back/go back"

     Ten such pairs are glossed explicitly in primary sources, and *hō mai/aku* is listed
     (Andrews–Parker 1922; Andrews 1854). Up to 50 verbs are attested with both in the
     data.
   - **(b) The possessive class slot, a/o.** Commuting a ↔ o turns "relation the
     possessor initiated or controls" into "relation not under the possessor's control".
     Examples:
     - *kāna kiʻi* "the picture he made" / *kona kiʻi* "his portrait"
     - *ka hale a Keawe* "the house Keawe built" / *ka hale o Keawe* "the house Keawe
       lives in"

     The class is predictable from the relation for **89.5%** of 1,504 coded Wikipedia
     tokens, and for **93–96%** in two 19th-century sources. Another 44 tokens go against
     the noun's usual class because the sense or the possessor is different. Those are
     genuine commutations in running text.
3. **Inside words there are three small, dense grids.** In each, sub-word pieces are signs
   that recombine freely. Within their core cells the commutations are 100% proportional:
   - **dual/plural pronouns**: {kā- incl., mā- excl., lā- 3rd} × {-ua dual, -kou plural},
     6 cells. The 2nd person (ʻolua/ʻoukou) has its own stems.
   - **singular possessives**: {Ø, k, n} × {a, o} × {-ʻu 1sg, -u 2sg, -na 3sg}, 18 cells.
   - **deixis**: {kē-, pē-} × {-ia near me, -nā near you, -lā far, -hea which/how}.
     The near-addressee column is obsolete or rare in Hawaiian (Lyon 2018; corpus:
     *kēnā* 1 token against *kēia* 1,109).
4. **The ʻokina and the kahakō are significant only inside these closed sets.** Examples:
   - *koʻu* "my" : *kou* "your" :: *noʻu* : *nou*;
   - *kāu* : *kou* (a- vs o-class "your");
   - *wahine* : *wāhine* (singular : plural, about 11 person nouns).

   This agrees with the owner's point and narrows it. Outside these sets a mark switch is
   distinctive but not significant (see the phonology note). Inside them the mark is
   proportional, but the words are grammatical. In the 19th-century spelling, without
   ʻokina or kahakō, *koʻu* and *kou* were the same written word.
5. **Some alternations at this level are distinctive in form but not significant.**
   - *ka/ke* is conditioned allomorphy: the KEAO rule fits 91.3%, and each word's own
     majority article fits 95.5%.
   - *i/iā* is conditioned by the class of the following noun.
   - *au/wau*, *lā/ala*, *ko/kō* vary freely or orthographically.
   - DIR + *lā* fuses (*akula*).

   Each of these fails commutation on the content plane.

---

## 1. Data, sources and the corpus problem

| source | used for | size / note |
|---|---|---|
| Wiktionary (kaikki dump, local) | grammatical senses, etymologies that segment forms | 4,142 entries. 35 pron, 21 det, 6 article, 31 particle, 17 prep |
| POLLEX (local crawl; 98% cited to Pukui & Elbert 1986) | P&E spelling + Proto-Polynesian etyma of grammatical forms | 2,258 rows |
| Andrews–Parker 1922 (archive.org OCR, local) | 19th-c. headwords and citations. Glossed V+mai/aku pairs | no ʻokina/kahakō. OCR damages some headwords (*Pela* appears as "Peia (pe'-la')", *Penei* as "Penel") |
| Hawaiian Wikipedia dump (local) | frequencies, collocations, a/o by noun, V+DIR | see below |
| Andrews 1854, *Grammar of the Hawaiian Language* | pronouns §§120–122, demonstratives §152, directives §§233–241 | archive.org `cu31924026915888`, djvu text in `src/` |
| Alexander 1864/1920, *Short Synopsis* | a/o §§15–19, articles §§22–25, pronouns §§34–42, demonstratives §43, directives §52 | OCR from the phonology sibling's `src/` |
| Wilson 1980, PhD diss. UH | a/o control theory, Hawaiian minimal pairs (ex. 2.1–2.44) | ScholarSpace PDF, text in phonology `src/` |
| Baker 2012, PhD diss. UH (abstract) | a/o markedness in genitive subjects | ScholarSpace abstract |
| Lyon 2018, *Palapala* 2 | 2nd-person deixis *nā*, *pēnā*; quotes Elbert & Pukui 1979 and Pukui & Elbert 1986 | ScholarSpace PDF, `src/lyon_demonstratives.*` |
| Iwasaki (Tokyo), Shionoya 2008 (Muroran) | directional subgroups; directionals in comparatives | abstracts only |
| Wikipedia "Hawaiian grammar" | secondary summary of Elbert & Pukui | `src/wp_hawaiian_grammar.wiki` |

Not consulted: Elbert & Pukui 1979 and Pukui & Elbert 1986 directly (no open copy; I used
them only as quoted by Lyon 2018 and via POLLEX). Also not consulted: the forbidden
dictionary sites, and hawaiian-grammar.org, which answers with a bot challenge that I
did not work around.

### 1.1 The Hawaiian Wikipedia contains word salad, and it inflates earlier counts

While checking *kona hele aku* (404 hits), I found that about 480 of the 3,019 articles
carry long paragraphs of machine-made pseudo-Hawaiian. One example: "mea paʻakikī kona
hele aku uaʻlanahai meakanu ka hakakā inā pahuhopu…". The salad reuses real function
words, so it inflates exactly the forms this level measures. Before cleaning, *aku* was
779 tokens and after it 307; *kona* went from 2,770 to 1,547; *oʻu* from 41 to 0; *kela*
from 497 to 6.

The filter is in `common.build_corpus`. It has three passes:

1. Drop a paragraph if a token has an ʻokina before a consonant (impossible in Hawaiian)
   or is a recurring salad form. This removed 1,374 paragraphs, 83,962 tokens.
2. Drop a paragraph with two or more salad-only bigrams (266 marker bigrams). This
   removed 127 paragraphs, 8,201 tokens.
3. Drop sentences by a naive-Bayes salad score, re-estimated three times. This removed
   1,225 sentences, 9,802 tokens.

**Kept: 310,077 tokens in 49,694 sentence chunks.** A random sample of 60 kept sentences
(`tables/salad_sample60.txt`) has 2 that are still non-text, about 3%.

The Wikipedia figures in the sibling notes (phonology, derivation) were computed before
this filter. Their counts of function words are inflated. Their proportions may be less
affected. That is *unverified*.

The cleaned corpus is still encyclopedic and 3rd-person heavy, and partly learner- or
machine-written. It holds almost no dialogue, so 1st/2nd-person and deictic forms are
rare in it.

---

## 2. Units and oppositions at this level (overview)

The units are **grammatical morphemes**, signs with a closed membership. Many have an
expression of one or two phonemes. They sit in **fixed syntagmatic slots** of the phrase:

```
noun phrase:  [prep] [DET: ka/ke | nā | he | kekahi | kēia… | k-possessive] [mau] N [modifiers] [o/a + possessor] [nei/lā]
verb phrase:  [TAM: ua | e | ke | i | mai(prohib.)] V [adverbs] [ʻia] [DIR: mai | aku | aʻe | iho] [nei | lā | ana | ai] [nō]
```

The verb phrase order follows Alexander 1920: 19. The Wikipedia summary of Elbert &
Pukui gives the same order.

Paradigms (the sets of commutable members of one slot) and their categories:

| paradigm | members | categories | kind of opposition |
|---|---|---|---|
| personal pronouns | au, ʻoe, ia; kāua, māua, ʻolua, lāua; kākou, mākou, ʻoukou, lākou | person (1 incl., 1 excl., 2, 3) × number (sg, du, pl) | multidimensional. Clusivity is bilateral and equipollent. Number du:pl is equipollent and proportional |
| singular possessives | {aʻu āu āna oʻu ou ona} {kaʻu kāu kāna koʻu kou kona} {naʻu nāu nāna noʻu nou nona} + kuʻu, kō | onset (bare / determiner / benefactive-predicative) × class (a/o) × person (1/2/3) | three crossing proportional series. kuʻu and kō neutralise a/o |
| possessive particles | a/o, kā/ko, na/no | onset × class | the same a/o series with nouns, names and non-singular pronouns |
| deixis | kēia kēnā kēlā; pēia/penei pēnā pēlā pehea; nei (nā) lā/ala; ʻaneʻi (ʻanā) ʻō; eia aia; laila; ia; ua…nei/lā | series (determiner, manner, postposed, locative, presentative) × column (near me, near you, far, which/how, anaphoric) | person-based ternary that has become functionally binary (near/far) |
| directionals | mai, aku, aʻe, iho (+lā: maila, akula, aʻela, ihola) | axis (deictic vs absolute) × pole | two binary equipollent oppositions, privative against Ø. Deictic mai:aku is proportional over verbs |
| articles / number | ka~ke, nā, he, kekahi, (mau), ia, ua | definiteness × number | ka~ke is one morpheme (allomorphs). Singular:plural is equipollent in the article (ka/nā) and privative elsewhere (Ø/mau). Plural lengthening is privative |

---

## 3. Personal pronouns

### 3.1 Feature matrix and attestation

Wikipedia counts are exact spellings in the cleaned corpus. POLLEX gives the P&E spelling
and the etymon.

| | singular | dual | plural |
|---|---|---|---|
| **1 inclusive** [+spk +adr] | — | **kāua** (WP 6; POLLEX \*taa-ua) | **kākou** (51; \*taa-tou) |
| **1 exclusive** [+spk −adr] | **au** / wau (103 / 16; not in POLLEX as a pronoun) | **māua** (5; \*maa-ua) | **mākou** (53; \*maa-tou) |
| **2** [−spk +adr] | **ʻoe** (61; \*koe) | **ʻolua** (0; not in POLLEX crawl; A–P headword "Olua, second person of the dual") | **ʻoukou** (5; \*kou-tou) |
| **3** [−spk −adr] | **ia** (ʻo ia 2,416; \*ia "this, that, aforementioned") | **lāua** (306; \*laa-ua) | **lākou** (604; \*laa-tou) |

- All 12 forms carry a grammatical sense in Wiktionary.
- 9 of 12 are in POLLEX (P&E). The three missing are au, wau and ʻolua.
- All 11 pronouns are in Andrews 1854 §122. Clusivity is described there: "Kaua, we two,
  including myself and the person addressed… Makou… excluding the persons addressed"
  (OCR misprints *Laua* as "Lakou, they two"). Also in Alexander §36.

### 3.2 Segmentation (expression plane)

The nonsingular forms are **stem + number suffix** *(my analysis)*:

- **stems**: kā- (1 incl.), mā- (1 excl.), lā- (3), ʻo-/ʻou- (2);
- **suffixes**: -ua (dual), -kou (plural).

Support:

- Alexander §35: "The dual was formed by compounding the root of the pronoun with 'lua,'
  two, and the plural… by adding 'kolu,' three… these plurals were originally trinals".
- Wiktionary: *kāua* "kā (inclusive prefix) + lua (two)"; *kākou* "kā- + kolu (three)";
  *mākou* "mā- + kolu".
- POLLEX hyphenates every nonsingular etymon: \*taa-ua, \*maa-tou, \*laa-ua, \*kou-tou.

So the number suffixes are reduced numerals, *lua* "two" and *kolu* "three". The
singulars are unsegmentable (suppletive).

### 3.3 Commutation results (`grids.py`)

| sub-grid | one-feature pairs | pairs with the modal expression difference |
|---|---|---|
| {kā, mā, lā} × {ua, kou}: 6 cells | 9 | **9 (100%)**: clusivity k~m (2), person k~l (2), m~l (2), number ua~kou (3) |
| + 2nd person (8 non-singular cells) | 16 | 12 (75%). ʻo-lua / ʻou-kou breaks the pattern: stem changes with number |
| all 11 | 23 | 16 (70%). Singulars are suppletive |

### 3.4 Opposition types

- **Clusivity kāua : māua :: kākou : mākou**: equipollent (k vs m), **bilateral**
  (only these two share [+speaker, non-singular]) and proportional (2 pairs). Content:
  addressee included vs excluded (Alexander §36; Andrews 1854 §122).
- **Number du : pl**: equipollent (-ua vs -kou), proportional over 3 stems (4 with
  irregular 2nd person).
  - Markedness by frequency: plural is the unmarked term. Dual 317 tokens vs plural 713
    in Wikipedia; kāua 6 / kākou 51; māua 5 / mākou 53.
  - Singular vs non-singular is not segmental (suppletion).
- **Person among stems**: equipollent, multilateral (4 terms). Componentially:
  - kā = [+spk +adr]
  - mā = [+spk −adr]
  - ʻo(u) = [−spk +adr]
  - lā = [−spk −adr]

  The expression is the stem consonant in three of four (k/m/l). The 2nd person differs
  because PPN \*k > ʻ (POLLEX \*kou-tou, \*koe; Alexander §36: "the Hawaiian has dropped
  initial k").
- **Paradigmatic asymmetry**: the singular has fused possessive forms (§4), while the
  dual and plural use analytic *kā/ko + pronoun*. Wikipedia: *ko lākou* 187, *kā lākou*
  108, *ko lāua* 45, *kā lāua* 15, *ko kākou* 20. Alexander §37: the affixed forms -ʻu,
  -u, -na exist "in the singular number" only.

---

## 4. Possessives and the a/o distinction

### 4.1 The singular grid: attestation

Counts are Wikipedia (cleaned). POLLEX etyma are P&E reflexes.

| onset \ class·person | a 1sg | a 2sg | a 3sg | o 1sg | o 2sg | o 3sg |
|---|---|---|---|---|---|---|
| **Ø-** (after prepositions: *a, o, i, ma, mai…*) | aʻu 8 | āu 2 | āna 124 | oʻu 0 | ou 8 | ona 33 |
| **k-** (determiner, "my/your/his") | kaʻu 5 | kāu 2 | kāna 913 | koʻu 20 | kou 31 | kona 1,547 |
| **n-** ("for/by me"; predicate *Naʻu ke kaʻa*) | naʻu 0 | nāu 3 | nāna 78 | noʻu 1 | nou 1 | nona 46 |
| neutral (a/o syncretism) | kuʻu 23 | kō 57 | — | | | |

Attestation by source:

- **Wiktionary**: 20/20 cells.
- **POLLEX**:
  - the 6 k-forms, each with segmented etyma: \*te-qa-ku, \*te-qa-u, \*te-qa-na,
    \*te-o-ku, \*te-o-u, \*te-o-na;
  - kuʻu \*taku and kō \*too ("2nd person singular neutral possessive");
  - the Ø-forms through the suffix etyma \*-ku, \*-u, \*-na;
  - the n-forms are absent (0/6).
- **Andrews–Parker**: has the Ø- and k-forms and 5 of the 6 n-forms as pronoun
  headwords (*nāna* was not found, possibly OCR). Parker marks the glottal stop with an
  apostrophe in exactly the 1sg forms *A'u, Ka'u, Na'u, No'u, O'u*. He does not mark it
  in *koʻu*, which shares one headword "Kou" with *kou*, with two senses, "Your" and "My".
- **19th-century spelling**: undiacritised, the 1sg/2sg contrast vanishes in writing. In
  A–P, *kau* (= kaʻu, kāu, kau) has 644 hits and *kou* (= koʻu, kou) 136 (`tables/pronouns.txt`).

### 4.2 Morphological analysis

The k- row is **the definite article fused with the genitive**:

- Alexander §18: *ka, ko* "compounded of the definite article ka and the prepositions a
  and o"; *ko ke aliʻi hale* = *ka hale o ke aliʻi*.
- POLLEX: \*te-qa-ku, with \*te the singular article.
- Wilson 1980 §3.5.4: k-a-ʻu.

Hence the k-forms fill the determiner slot. They cannot co-occur with *ka/nā*, and they
pluralise with *mau*: *kāna mau* 227, *kona mau* 153 in Wikipedia.

The person suffix shows a morphophonemic interplay *(my analysis, consistent with the
POLLEX etyma)*:

| | 1sg (-ʻu < \*-ku) | 2sg (-u) | 3sg (-na) |
|---|---|---|---|
| a-class | a + ʻu → **aʻu** (short) | a + u → **āu** (long) | a + na → **āna** (long) |
| o-class | o + ʻu → **oʻu** | o + u → **ou** | o + na → **ona** |

So the 1sg/2sg contrast is expressed **by the ʻokina alone** in the o-class
(koʻu/kou, noʻu/nou, oʻu/ou). In the a-class it is expressed by ʻokina against length
(kaʻu/kāu).

### 4.3 Commutation results (`grids.py`)

| feature | one-feature pairs | modal expression difference |
|---|---|---|
| onset Ø:k, Ø:n, k:n | 18 | **18 (100%)**: k~Ø, n~Ø, k~n |
| class a:o | 9 | 9 in vowel quality a~o. Length co-varies (ā~o in 2sg/3sg, 6; a~o in 1sg, 3) |
| person 2:3 | 6 | **6 (100%)**: u~na |
| person 1:2, 1:3 | 12 | ʻu~u / ʻu~na in all 12. In the a-class the vowel length changes too |
| **total (18 cells)** | 45 | 36 counting length as part of the difference (80%). 45/45 in quality and consonants |

### 4.4 What governs a vs o (described in grammars)

**Alexander 1920 §15–17.**

- "O" implies a passive or intransitive relation, "a" an active and transitive one.
- With *a* the thing possessed "is his to make or act upon, or is subject to his will".
  With *o* it "is his merely to possess or use, to receive or be affected by".
- Minimal pairs: *ka hale a Keawe* "the house which Keawe built" vs *ka hale o Keawe*
  "the house which Keawe lives in"; *ka wahine a Keawe* "wife" vs *o Keawe*
  "maid-servant"; *ke keiki a Keawe* "own child" vs *o Keawe* "errand boy".
- a-class words (§17): ʻai, ʻoihana, ʻōlelo, haumāna, hana, kauoha, kauwā, kāne, keiki,
  moʻopuna, palapala, pule, wānana, wahine, buke.
- o-class (§16): "parents, brothers and sisters, our ancestors, rulers, and friends…
  clothing, canoes… all of the parts of the body, and the faculties of the mind…
  [and] that of a part to a whole".

**Wilson 1980 §2.2.2–2.3.1 (Initial Control Theory).** "The possessor's control over the
initiation of the possessive relationship is the determining factor."

- **o**: name, titles, honours, images of the possessor (*kona inoa, kona kiʻi* "picture
  of him", *kona lūʻau* "feast in his honour"); body, siblings, parents, ancestors.
- **a**: creations (*kāna kiʻi* "picture he painted", *kāna lūʻau* "feast he prepared");
  offspring; spouse, formal friend, workman, student; property (*kāna hoe, kāna ʻīlio*).
- Inanimate possessors take o (*ka ʻīlio o ka hale*), unless the inanimate is an agent:
  - *ka wela o ka lā* "the sun's own heat" vs *ka wela a ka lā* "heat in a thing caused
    by the sun";
  - the same for *melemele o/a ka ʻōlena*.
- An Eastern Polynesian exception class takes o for "spatial use": house, canoe, shirt,
  chair, bed (ex. 2.40–2.44).
- Minimal pair: *koʻu inoa* "my name (that represents me)" vs *kaʻu inoa* "my name (that
  I bestow on someone)".
- "It is, in fact, difficult to find nouns that cannot be used with both A and O given
  the proper context."

**Markedness.** o is unmarked.

- Clark 1976 as quoted by Wilson: "\*o … covering all relations not included in \*a".
- Baker 2012 (abstract): "O-class is the unmarked category since it occurs in every
  subject category. A-class is the marked category… a-class is used only with agentive
  subjects".
- Corpus agrees: o-tokens 1,502 vs a-tokens 882. For the genitive subjects of
  nominalised verbs (*kona hele ʻana*) it is o 189 vs a 46.

So the a/o opposition is **privative** (a = +control/initiation; o = unmarked),
**bilateral**, and **proportional**. It recurs through the whole grid and through a/o,
kā/ko and na/no. It is neutralised in *kuʻu* and *kō*. Alexander §42: kuʻu "is used for
both kaʻu and koʻu; and kō… for either kāu or kou"; Trubetzkoy's archiphoneme, here an
"archimorpheme".

### 4.5 Measured on the corpus (`possessives.py`, `code_minority.py`, `poss_ap1922.py`)

Extraction: the noun after kaʻu/kāu/kāna/koʻu/kou/kona (lowercase) and after kā/ko + a
non-singular pronoun. *mau* is skipped, and diacritic variants are merged. The result is
2,384 tokens, 370 noun types. I hand-coded 94 noun types (1,504 tokens) into the
grammars' categories and compared them with the predicted class.

| category (predicted class) | types | tokens | in predicted class |
|---|---|---|---|
| ascending/same-generation kin (o) | 12 | 303 | 97.4% |
| life, time, death, age (o) | 5 | 184 | 95.7% |
| name, title, honour (o) | 5 | 94 | 90.4% |
| body, mind, faculties (o) | 27 | 269 | 89.2% |
| descendants (a) | 5 | 70 | 88.6% |
| spouse (a) | 4 | 45 | 86.7% |
| subordinates (a) | 2 | 14 | 85.7% |
| works, products, acts (a) | 16 | 401 | 84.0% |
| house, land, vehicle, clothing (o) | 11 | 98 | 83.7% |
| property (a) | 4 | 15 | 53.3% |
| **all coded** | **94** | **1,504** | **89.5%** (83/94 types by majority) |

**Nineteenth-century cross-check.** Only the 3sg pair is testable without diacritics:
*kana* vs *kona* + noun, same categories.

- Andrews–Parker 1922 citations: 53/57 = **93.0%**.
- Andrews 1854 examples: 25/26 = **96.2%**.

**The 158 tokens against prediction** (`tables/minority_coded.tsv`, hand-coded by me):

- **44 meaningful (M)**: the choice follows the control rule once the actual sense or
  possessor is considered. These are real commutations in running text:
  - *kona moʻolelo* "his life story, backstory" vs *kāna moʻolelo* "the story he
    wrote" (10)
  - *kāna kūlana* "the (acting) role he took on" vs *kona kūlana* "his status" (7)
  - *kāna ʻano* "his style/method of doing" vs *kona ʻano* "his nature" (7)
  - *kona waiwai* "its value" vs *kāna waiwai* "his property" (6)
  - *kona kiʻi* "his image / its imagery" vs *kāna kiʻi* "his picture/film" (4)
  - *kāna aloha mua* "his first love (a person)" (3)
  - *kāna hale ʻai / hale paʻi* "his restaurant / printing house": business premises
    are not "spatial use" (3)
  - and others
- **33 apparent errors (E)**: the sense is the one the grammars name, and the class is
  the other one. Examples: *kāna mau kaikuaʻana*, *kāna lima*, *kona kāne* ×4,
  *kona puke*.
- **81 unclear (U)**: the sense is undecidable from the snippet, or it is a homograph
  (*pule* "week"), or an English compound (*home run*).

So **at least 92.4%** ((1,346 + 44) / 1,504) of coded tokens fit the described rule, and
**about 2.2%** clearly contradict it.

**Productivity of the commutation.**

- Of 97 possessum nouns with at least 5 tokens, 69 (71%) occur with both classes.
- Most of the minority tokens are unclear or errors, not contrasts, so the corpus does
  not by itself show 71% of nouns *contrasting*.
- What is verified: Wilson's claim (most nouns can take both, given context) plus about
  10 nouns where corpus and grammar show the contrast: hale, wahine, keiki (Alexander);
  inoa, kiʻi, lūʻau, wela, melemele (Wilson); moʻolelo, kūlana, ʻano, waiwai, ʻōlelo,
  hoa (corpus).
  - ʻōlelo: *ko lākou ʻōlelo makuahine* "their mother tongue" (o) vs *kāna ʻōlelo
    kaulana* "his famous saying" (a).
  - hoa: *kona mau hoa palena* "its neighbouring countries" (o) vs *kāna hoa Pikachu*
    "his companion" (a).

**Nominalised verbs.** The genitive subject of V *ʻana* is o 189 / a 46. o goes with
intransitives: make 21, komo 10, haʻalele 9, puka 9, hoʻomaka 8, hānau 5, noho 5, hele 4.
a appears with agentive verbs: alakaʻi 4, hana 4, aʻo 3. This is consistent with Baker's
"a-class is used only with agentive subjects".

---

## 5. Demonstratives and deixis

### 5.1 The grid and its attestation

| series \ column | 1: near speaker | 2: near addressee | 3: distal | Q: which/how/where |
|---|---|---|---|---|
| **kē-** determiner | **kēia** (WP 1,109; POLLEX \*tee-ia; A–P *keia* 117) | **kēnā** (WP **1**; \*tee-hena "near the person addressed"; A–P "Kena, pron. [Variant of kela.]") | **kēlā** (240; \*tee-laa) | — (no \*kēhea) |
| **pē-** manner "like —" | **pēia** (0; \*pee-ia), **penei** (7; \*pee-heni) | **pēnā** (0; \*pee-hena "(Rare)"; Lyon n.8: P&E 1986 "rare", E&P 1979 §8.3 "obsolete") | **pēlā** (23; \*pee-laa) | **pehea** "how?" (19; \*pee-fea) |
| postposed particle | **nei** (277; \*nei) | **nā** (E&P 1979: 112 "probably obsolete"; Lyon: four examples in all the literature, one Malo passage) | **lā / ala** (\*raa "there"; ala is the variant) | **hea** (14; \*fea "where?") |
| locative noun | **ʻaneʻi** (12), Niʻihau **ʻoneʻi** (1; \*ko-nei) | **ʻanā** (0); **ʻonā** only in Nakuina 1902 *ko ʻonā* "your side" (Lyon n.7) | **ʻō** "yonder" (homographs; *ma ʻō* 7) | *i hea / ma hea* (0 / 4) |
| presentative | **eia** "here is" (78; \*e-ia) | — | **aia** "there is" (511; \*a-ia) | — |
| anaphoric | **ia** N (\*ia "aforementioned"); **ua** N **nei** (6) | — | **ua** N **lā** (15); **laila** "there (aforementioned)" (196; \*reira) | |

Wiktionary covers only 11 of the 24 deictic forms. It also mis-glosses *kēnā* as "that
(close to the speaker)". POLLEX (P&E) covers 18 of 24 after manual correction (*ʻō* has
no locative row).

### 5.2 Structural reading

- **kē- : pē- is proportional.** It holds in 3 columns (kēia/pēia, kēnā/pēnā, kēlā/pēlā;
  3/3 in `grids.py`). Content: determiner "this/that" vs manner "like this/that".
- **The column contrast is proportional across series.**
  - ia ~ nā ~ lā, in 2 pairs each.
  - nā ~ lā holds 3/3: kēnā/kēlā, pēnā/pēlā, nā/lā.
  - The Q column adds **pehea : pēlā :: hea : lā** ("how? : like that :: where? : there").
- **The second-person column is defective.**
  - Lyon (2018: 36): "the second-person analog (-nā) has almost entirely disappeared, not
    only in the post-directional distance marking slot, but also in compounds". He gives
    *pēnā* as unattested; no *ia nā*, no *ua … nā*, no *ma ou nā*.
  - Andrews 1854 §152 lists only keia/neia/ua–nei ("this") and kela/ia/ua–la ("that").
  - Alexander §43 lists ia, keia, kela, neia, ua–nei, ua–la, with no *kēnā*.
  - Andrews–Parker calls *kēnā* a "variant of kela".
  - Corpus: kēia 1,109 : kēnā 1 : kēlā 240.
  - So the person-based ternary system (POLLEX \*tee-ia / \*tee-hena / \*tee-laa, still
    complete in Māori tēnei/tēnā/tērā) has become **functionally binary** in written
    Hawaiian: near (ia/nei) vs far (lā).
- **Type.**
  - The reconstructed ternary system is equipollent and multilateral (person-oriented).
    It could also be read as gradual in distance *(both readings are in use; I do not
    decide)*.
  - The living binary nei : lā is described by Alexander §52 as "opposed to each other in
    meaning": nei = "present in place and time, here and now"; lā = "distance in place,
    but not necessarily in time".
- **Functional load in the verb phrase.** In the TAM frame *ke* V *nei* (present
  progressive) vs *ke* V *lā*, Wikipedia has nei 101 against lā 3. *i hala aku nei* "ago"
  appears 5 times. DIR + nei: *mai nei* 11, *aku nei* 14.
- **Lexicalised.**
  - *kēlā me kēia* "every" (literally "that and this"; WP 137; Alexander §43 "kela mea
    keia mea, everything").
  - *eia / aia* (e- vs a- on the root ia; POLLEX \*e-ia / \*a-ia). This is an isolated
    pair: the proximity sits in the prefix, not in the root.

---

## 6. Directionals (verbal directives)

### 6.1 The system (described in grammars)

Andrews 1854 §§233–234: "Verbs generally, in Hawaiian, are supposed to have a motion or
tendency in some direction… The motion is either towards the speaker or agent, or from
him, up or down or sideways".

- Mai implies motion towards the speaker or agent;
- Aku, motion from the speaker;
- Iho, motion downward;
- Ae, ascending… frequently used for any sideways or oblique motion.

Alexander §52 gives the same four, and adds:

- "In narration, iho means 'thereupon', 'immediately after'";
- aku and aʻe are "also used of time, as kela la aku… the next day";
- aʻe and aku form the comparative (§28).

Iwasaki (Tokyo, abstract) proposes two subgroups: **deictic** aku/mai (relative to the
speaker) and **absolute** iho/aʻe (vertical axis).

Structure *(my analysis on these sources)*:

- **two binary, equipollent, bilateral oppositions**: mai:aku on the deictic axis, aʻe:iho
  on the vertical axis;
- each is **privative against Ø** (a verb without a directional is unmarked for
  direction);
- the four directionals fill one slot, so they are mutually exclusive.

### 6.2 The proportional series V + mai : V + aku, glossed in primary sources

| verb | + mai | + aku | source | WP mai/aku | A–P mai/aku |
|---|---|---|---|---|---|
| hele "go, move" | "to come" | "to go off, go from one" | A–P s.v. *Aku*; Andrews 1854 §234 | 29/12 | 12/9 |
| haele (du./pl. subject) | "to come" | "to go" | A–P s.v. *Haele* | 0/0 | 1/1 |
| lawe "carry, take" | "brought this way" | "took away" | Andrews 1854 §§235–236 (paradigm) | 29/4 | 1/2 |
| hali "carry" | "to bring" | "to take or carry away" | A–P s.v. *Hali* ("Hall" in OCR) | – | – |
| hiki "reach" | "to come to" | "to go to" | A–P s.v. *Hiki* ("The meaning is dependent on the words mai and aku") | 71/3 | 6/4 |
| hoʻi "return" | "come back" | "go back" | A–P s.v. *Hoi* | (not counted: homograph of the particle hoʻi) | |
| kūʻai "barter" | "to buy" | "to sell" | A–P s.v. *Kuai* ("kuai lilo mai… to buy, and kuai lilo aku, to sell… contracted into kuai mai… kuai aku") | 5/27 | 1/1 |
| lilo "pass to another" | "to obtain; to possess" | "to be lost; to perish" | A–P s.v. *Lilo* | – | – |
| unu "push" | "push back" | "push forward" (+ *unu ae* "push aside") | A–P s.v. *Unu* | – | – |
| mao (A–P spelling) | "from over there this way" | "beyond" | A–P s.v. *Mao* | – | – |
| hō "give" | *hō mai* | *hō aku* (+ *hō ae*) | A–P s.v. *Ho* (listed, not separately glossed) | 1/4 | 3/1 |

That is **10 pairs with explicit glosses, plus *hō* listed** (11), in public-domain primary sources. They show
the same content difference (toward : away from the deictic centre) under one expression
difference (mai : aku). Several pairs read as lexical antonyms in English: come/go,
bring/take, buy/sell, obtain/lose. In Hawaiian it is the directional sign that carries
the difference.

### 6.3 Size in the data (`directionals.py`, `dir_pairs.py`)

| measure | Wikipedia (cleaned) | Andrews–Parker 1922 citations |
|---|---|---|
| directional tokens after a content-word host | 2,190 | 499 |
| hosts that Wiktionary lists as verbs: directional tokens | 1,326 (mai 686, aku 239, aʻe 377, iho 24) | – |
| verb hosts with both mai and aku (≥1 each) | 33 (16 with ≥2 each) | 32 hosts (any lexicon word) |
| hosts with both aʻe and iho | 2 verb hosts (5 any host) | 7 |
| hosts with all four | 1 | 1 |
| union of verbs with both mai and aku (`tables/dir_pairs.tsv`) | **50** (12 in both corpora) | |

Corpus-attested pairs beyond §6.2 include hāʻawi 5/6, aʻo 13/7, neʻe 4/7, nānā 4/3, holo
2/3, kiʻi 8/2, puka 13/2, ʻike 7/1, ʻōlelo 3/1, haʻi, pale 3/15 and pane (A–P 2/2).
Their glosses would be "give to me / give away", "come out toward / go out away" and so
on. These glosses are *my readings*, not checked against P&E.

### 6.4 Regularity: a random sample, hand-coded (`code_dir_sample.py`)

The sample is drawn from tokens whose host is a Wiktionary verb.

| directional | n | spatial/deictic (D) | other functions |
|---|---|---|---|
| mai | 50 | **20** | 23 preposition "from" (*mai X mai*), 3 salad, 4 unclear |
| aku | 40 | **20** | 17 comparative (*ʻoi aku* "more"), 3 temporal (*i hala aku nei* "ago") |
| aʻe | 30 | **0** | 27 lexicalised *ʻē aʻe* "other", 3 comparative (*hou aʻe* "more") |
| iho | 24 | **2** (*huki ʻia iho* "pulled down") | 7 narrative "thereupon" (*ihola*), 4 reflexive "own/self", 4 comparative "less", 7 unclear |

- **Within the D tokens**, all 20 mai fit "toward the deictic centre" and all 20 aku fit
  "away" (my reading). The deictic series is semantically regular where it applies.
- **The same forms are polyfunctional.** mai is homonymous with the preposition "from"
  and the prohibitive. aku and aʻe are also comparatives and temporals. iho is largely
  grammaticalised: Andrews 1854 §239 note: "Iho is the favorite directive in historical
  or narrative language, in which circumstances it often loses its accustomed meaning of
  downward motion". In A–P, glossed *iho* collocations are mostly reflexive: *iaʻu iho*
  "within myself", *muli iho* "younger child".
- **So the vertical series aʻe : iho is weak as a proportional series in modern text.**
  Spatially it is attested mainly in the grammars' examples (*hāpai aʻe* "lift up",
  *hāʻule iho* "fall down", Andrews 1854 §§234, 237).

### 6.5 A second proportional series: directionals in comparison

Shionoya (2008, Muroran Inst. Tech., English abstract): in Hawaiian, "towards the
speaker" and "downwards" express "A is smaller than B"; the other two express "larger".

| host | mai | aku | aʻe | iho |
|---|---|---|---|---|
| ʻoi "exceed" (→ more) | 0 | **85** | **19** | 0 |
| emi "decrease" (→ less) | **4** | 0 | 0 | **2** |

This is consistent with Shionoya: {aku, aʻe} = more, {mai, iho} = less. It is small
(2 hosts in the data) but it is a second proportional mapping of the same four signs:
**aku : mai :: aʻe : iho :: more : less**.

---

## 7. Articles and number

### 7.1 ka ~ ke: allomorphs, not signs (`articles.py`)

- **Rules described.** Alexander §23–25: ke before k, before "a few beginning with p",
  and many with a or o. §24: "Use ke before a short [a], and ka before a long", e.g.
  *ke awa* "harbour" vs *ka ʻawa*. The Wikipedia summary calls the exceptions *nā
  kūʻēlula* (e.g. *ke ʻano*).
- **Measured** on 23,061 ka/ke tokens before a native-spelled content word:
  - KEAO rule correct for **91.3%**;
  - each word's own majority article correct for **95.5%**;
  - largest exception *ke ʻano* 734 vs *ka ʻano* 21.
- **Remaining "both" cases** are mostly the homonymous TAM particle *ke* before verbs
  (*ke hana nei*), not a ka/ke contrast.
- **Commutation.** Swapping ka ↔ ke never changes the content. It is conditioned
  allomorphy: one morpheme \*te (POLLEX), **non-significant**.

### 7.2 Number: ka/ke : nā (and Ø : mau)

| | singular | plural |
|---|---|---|
| definite | ka/ke | **nā** |
| indefinite | he | he **mau** (216) |
| specific indefinite | kekahi | kekahi **mau** (203) |
| demonstrative | kēia, kēlā | kēia **mau** (129), kēlā **mau** (18) |
| possessive | kāna, kona | kāna **mau** (227), kona **mau** (153) |
| anaphoric | ia, ua … nei/lā | ia mau, ua mau … nei/lā |

- **Opposition types.** In the definite article it is equipollent/suppletive (ka : nā;
  nā < PPN \*ŋaa, POLLEX). Everywhere else it is privative (Ø : mau). The unmarked term
  is singular. Wikipedia sg articles 23,061 vs nā 8,812 before content words; Alexander
  §22 notes "he" is "used only in the singular", with *mau* explained as a collective
  noun.
- **Productivity.** 596 noun types occur after both ka/ke and nā (182 with ≥5 tokens
  under each). The frame [ART __] is fully productive and regular, and semantically flat
  (sg/pl).

### 7.3 Plural vowel lengthening in person nouns: where the kahakō is significant

The pairs are kanaka/kānaka, wahine/wāhine, makua/mākua, kupuna/kūpuna, kahuna/kāhuna,
kaikamahine/kaikamāhine and others. Alexander §13 says plural is marked "by prolonging
and accenting the first syllable"; POLLEX \*maatuqa, \*tuupuna, \*faafine.

| | short + singular article | long + plural article | short + plural | long + singular |
|---|---|---|---|---|
| kanaka/kānaka | 109 | 252 | 20 | 4 |
| wahine/wāhine | 61 | 25 | **27** | 0 |
| makua/mākua | 12 | 49 | 5 | 0 |
| kupuna/kūpuna | 5 | 27 | 2 | 0 |
| kaikamahine/-māhine | 47 | 5 | **18** | 1 |
| all 13 pairs | | | | |

- Agreement with the article is **88.5% (651/736)**.
- So the kahakō is a **privative, proportional, closed** mark of plural (about 11 nouns;
  see the phonology note §6.1).
- It is largely **redundant** with *nā/mau*. Modern Wikipedia writers often omit it
  (*nā wahine* 27 vs *nā wāhine* 25).

### 7.4 i ~ iā, ʻo: conditioned by noun class

| | before a pronoun | before a capitalised (proper) noun | before an article or common noun |
|---|---|---|---|
| i | 34 | 625 (mostly place names) | 15,027 |
| iā | 481 | 505 (mostly persons) | 20 |

Alexander §20: *ia* "before pronouns and proper names". The selection is by the class of
the following noun (person/pronoun vs other), so i/iā is **non-significant** as a sign
contrast. It is grammatical class-marking, like ka/ke.

---

## 8. Summary of the proportional series at this level

| series | expression | content | type | size (method) | regularity | attestation |
|---|---|---|---|---|---|---|
| V + mai : V + aku | mai ~ aku in the post-verbal slot | toward ~ away from the deictic centre | equipollent, bilateral, proportional; privative vs Ø | 10 pairs glossed + 1 listed in A–P 1922 / Andrews 1854. 33 verbs with both in WP, 32 hosts in A–P, 50 in the union | 20/20 D-tokens each way fit, but only 40% of sampled V+mai and 50% of V+aku tokens are directional | POLLEX \*mai "towards speaker", \*atu "away from speaker". Grammars: Andrews §§233–241, Alexander §52 |
| aʻe : iho | aʻe ~ iho | up ~ down | equipollent, bilateral | 2 verb hosts with both (WP), 7 (A–P) | 0/30 aʻe and 2/24 iho spatial in the WP sample | POLLEX \*hake, \*hifo |
| {aku, aʻe} : {mai, iho} in comparison | directional after degree verbs | more ~ less | equipollent | 2 hosts (ʻoi 104 / emi 6) | 110/110 tokens consistent | Shionoya 2008 (abstract); Alexander §28 |
| a : o (possession) | a ~ o (+ length in 2/3sg) in a/o, kā/ko, na/no and 18 fused forms | possessor initiates/controls ~ does not | privative (o unmarked), bilateral, proportional | 9 pairs in the grid, 3 particle pairs, any possessed noun. 69/97 frequent nouns attested with both | 89.5% of 1,504 coded tokens in the predicted class (≥92.4% with sense shifts). 93.0% / 96.2% in 19th-c. sources | POLLEX \*qa "dominant" / \*o. Alexander §15–17. Wilson 1980 |
| onset Ø : k : n | Ø ~ k ~ n | bare genitive ~ article+genitive ("my") ~ benefactive ("for me") | equipollent, multilateral | 6 triples in the grid + 3 particle pairs | 18/18 | POLLEX k-forms. A–P n-forms. Alexander §37–38 |
| person -ʻu : -u : -na | ʻu ~ u ~ na (+ ʻ vs length) | 1sg ~ 2sg ~ 3sg | equipollent, multilateral; ʻ privative in expression | 6 sets | 18/18 in consonants. The ʻokina alone carries 1sg:2sg in o-class | POLLEX \*-ku, \*-u, \*-na |
| clusivity k : m | kā- ~ mā- | addressee included ~ excluded | equipollent, bilateral | 2 pairs | 2/2 | POLLEX \*taa-/\*maa-; Andrews §122; Alexander §36 |
| number -ua : -kou | ua ~ kou | dual ~ plural | equipollent (plural unmarked by frequency) | 3 regular + 1 irregular | 3/4 | POLLEX; Alexander §35 |
| person stem k/m/l | kā ~ mā ~ lā | 1 incl. ~ 1 excl. ~ 3 | equipollent, multilateral | 6 pairs | 6/6 | POLLEX |
| deixis kē- : pē- | kē ~ pē | determiner ~ manner | equipollent | 3 pairs (2 alive: kēia/pēia~penei, kēlā/pēlā) | 3/3 in form | POLLEX all six |
| deixis column ia/nei : (nā) : lā (: hea) | root | near me ~ near you ~ far (~ which/how/where) | ternary person-based → binary near/far | 3 series wide (kē, pē, postposed) + Q | proportional in form. The 2nd-person column is defective (kēnā 1 token, pēnā 0) | POLLEX. Lyon 2018. Alexander §43, §52 |
| plural lengthening | V ~ Vː in the antepenult | sg ~ pl (person nouns) | privative, closed | about 11 nouns | 88.5% agreement with the article | Alexander §13; POLLEX 3 plurals |
| article number | ka/ke ~ nā; Ø ~ mau | sg ~ pl | equipollent / privative | 596 nouns with both | regular | POLLEX \*te, \*ŋaa |

---

## 9. Non-significant oppositions at this level

| alternation | status | measurement / source |
|---|---|---|
| ka ~ ke | conditioned allomorphy (KEAO + lexical list) | 91.3% by rule, 95.5% by word majority, 23,061 tokens. *ke ʻano* 734. Alexander §23–25 |
| i ~ iā | conditioned by the following noun's class | iā + pronoun 481 vs i + pronoun 34. i + article 10,610 vs iā + article 4 |
| au ~ wau | variant (Andrews 1854 §122: "Au, wau, or with the o emphatic o au, o wau") | 103 / 16 |
| lā ~ ala (postposed) | variant | 696 / 161 (both with homographs) |
| ko ~ kō before pronouns | orthographic variation | *ko lākou* 187 vs *kō lākou* 4 |
| DIR + lā → maila, akula, aʻela, ihola | morphophonemic fusion | 14 / 12 / 8 / 9 tokens |
| kēnā ~ kēlā in Andrews–Parker | treated as variants ("Kena… [Variant of kela.]") | A–P headword. Corpus kēnā 1 |
| phoneme differences *between* paradigms | distinctive, isolated, arbitrary | nā (plural article) / na (for, by) / nā (obsolete demonstrative), ka (article) / kā (a-class genitive), kona (his) / Kona (district), kou (your) / kou (tree). None recurs in a series |
| homonymy of directionals | not an opposition but a confound for any frame | mai = directional / preposition "from" / prohibitive / "almost" (Wiktionary 3 senses, POLLEX 4 etyma). aku/aʻe also comparative and temporal |

---

## 10. Frame assessment (options only, nothing proposed)

Could any series here act as a two-slot (or n-slot) frame in which commuting one sign is
meaningful, as in Jukugo Tumble?

1. **V + DIR**: a phrasal two-slot frame.
   - Commuting the directional block is meaningful and proportional: *hele mai → hele
     aku* "come → go", *lawe mai → lawe aku*, *kūʻai mai → kūʻai aku* "buy → sell",
     *lilo mai → lilo aku* "obtain → be lost".
   - A line between two blocks showing *mai* would be a true statement: both mean "toward
     the speaker".
   - **Size**: 10 pairs fully glossed in primary sources (11 with *hō*); about 15–20 more corpus-attested
     with transparent readings that still need checking; 50 at most.
   - **Density**: each verb has 2 directional states in practice (4 in the grammars). A
     directional block pairs with many verbs (mai with 194 verb types in WP).
   - **Sensitivity**: low. The directionals carry nothing sensitive, and the verbs can be
     chosen.
   - **How it reads**: concrete and spatial. The turned block points toward or away.
   - **Caveats**:
     - the pieces are written as separate words;
     - mai has a homonym "from", and modern text uses aku/aʻe mostly in comparatives
       and *ʻē aʻe*;
     - the design currently excludes grammatical words.
2. **POSS (a/o) + N**: a phrasal two-slot frame.
   - Turning a ↔ o flips "made, chosen or controlled by" against "of, about, or inherent
     to". Examples: *kāna kiʻi* "his painting" / *kona kiʻi* "his portrait";
     *kāna moʻolelo* "the story he wrote" / *kona moʻolelo* "his life story";
     *ka hale a Keawe* / *ka hale o Keawe*.
   - **Size**: about 10–15 nouns with a contrast verified in grammar and/or corpus.
     Grammatically any noun.
   - **Regularity**: high (89.5–96%).
   - **Reads**: as relationships, not pictures.
   - **Sensitivity**: depends on the noun (body and kin nouns). Wilson's own list includes
     *kona mimi*.
3. **ART + N** (*ka hale → nā hale*). Fully productive (596 nouns), regular, but flat:
   every turn means just "one → many". With person nouns the kahakō co-varies
   (*ke kanaka → nā kānaka*).
4. **Word-internal grids**: the only Hawaiian words whose sub-parts are free-recombining
   signs, as in Jukugo.
   - pronouns {kā, mā, lā} × {ua, kou}: 6/6 cells real, 9/9 commutations proportional;
   - possessives {Ø, k, n} × {a, o} × {ʻu, u, na}: 18/18 real;
   - deixis {kē, pē} × {ia, lā, (nā)} + *pehea*: about 6 live cells.

   They are perfectly dense but **tiny**, and the meanings are grammatical (person,
   number, class, distance). They would read as a grammar lesson rather than an image.
   Option only.
5. **Single-mark turns** (ʻokina/kahakō). These are meaningful only inside the grids:
   *koʻu → kou* "my → your"; *wahine → wāhine* "woman → women". Elsewhere they are
   arbitrary, as the owner said.

---

## 11. Open doubts

1. **No direct use of Elbert & Pukui 1979 or Pukui & Elbert 1986.** They appear only
   through Lyon's quotations and POLLEX. The a/o categories rest on Alexander, Wilson and
   the Wikipedia summary.
2. **The hand coding is mine.** That covers the noun categories (94 types), the 158
   minority tokens and the 144-token directional sample. No speaker checked it. The
   category boundaries could be drawn differently: Alexander puts "friends" in o, while
   Wilson and Wikipedia put spouse and formal friends in a. The corpus *hoa* is 14 a /
   35 o, *hoaloha* 3/13.
3. **Corpus quality.** The salad filter leaves about 3% non-text. Learner and machine
   Hawaiian may produce some of the "errors" counted against the a/o rule. Narrative and
   dialogue forms (iho, kēnā, 1st/2nd person) are scarce in an encyclopedia.
4. **Glosses of V+DIR pairs beyond §6.2 are my readings.** The prepositional *mai*
   confound means the corpus count of 33–50 verbs overstates the verified series.
5. **The deixis typology.** Gradual (distance) vs equipollent (person) for the old
   ternary system is a matter of analysis. I give both.
6. **The sibling notes' Wikipedia counts** (phonology §6.2 grid counts, e.g. oʻu 41)
   include word salad. The cleaned counts are in `tables/pronouns.txt`. Whether their
   proportions change is *unverified*.
7. **Andrews–Parker OCR** loses or garbles some headwords (*Pela*, *Penei*, *Laila* were
   found only by hand). Absence from the A–P column is weak evidence.
8. **Segmentations** (-ua/-kou, k-a-ʻu, kē-/pē- + root) are supported by etymology
   (POLLEX, Wiktionary, Alexander, Wilson). Whether speakers analyse them synchronically
   is *unverified*. The deictic roots ia/nei/neʻi vary in a way I have not explained.
9. **āhea "when (future)" / ināhea "when (past)"** (POLLEX \*qaa-fea / \*ina-fea) suggests
   a further tense series in interrogatives. I did not pursue it. WP has 1 / 0 tokens.

---

## 12. Sources

Grammars and papers:

- Andrews, Lorrin. 1854. *Grammar of the Hawaiian Language*. Honolulu: Mission Press.
  https://archive.org/details/cu31924026915888 (djvu text: `src/andrews1854.txt`)
- Alexander, W. D. 1920 [1864]. *A Short Synopsis of the Most Essential Points in Hawaiian
  Grammar*. https://archive.org/details/shortsynopsisofm00alexrich (OCR in the phonology
  sibling's `src/alexander1920.txt`)
- Wilson, William H. 1980. *Proto-Polynesian Possessive Marking*. PhD diss., University of
  Hawaiʻi. https://scholarspace.manoa.hawaii.edu/items/8509ed2c-b4c0-4f8c-a05c-fee725cbfcd0
  (text in the phonology sibling's `src/wilson1980.txt`)
- Baker, C. M. Kaliko. 2012. *A-class genitive subject effect…*. PhD diss., UH.
  https://scholarspace.manoa.hawaii.edu/items/97c9cee2-83ac-4187-acd3-c8d15feb8665
  (abstract)
- Lyon, Jeffrey "Kapali". 2018. "Some Thoughts on Demonstrative and Locative Nā and the
  Loss of /ŋ/ in Hawaiian." *Palapala* 2: 34–50.
  https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/ff927473-6c97-450d-b08e-5cf030727896/content
  (`src/lyon_demonstratives.*`). Quotes Elbert & Pukui 1979: 111–115 and Pukui & Elbert
  1986: 257, 324.
- Iwasaki, Kanae. "'Directional' in Eastern-Polynesian Languages: From the Standpoint of
  the Description of Hawaiian Directional." University of Tokyo repository, abstract.
  https://repository.dl.itc.u-tokyo.ac.jp/records/27479
- Shionoya, Toru. 2008. "Directionals in Polynesian Comparative Expressions." *Memoirs of
  the Muroran Institute of Technology* 57. English abstract.
  https://muroran-it.repo.nii.ac.jp/records/8433 (`src/muroran57-2.pdf`)
- Wikipedia, "Hawaiian grammar" (secondary summary of Elbert & Pukui 1979 and the *New
  Pocket Hawaiian Dictionary* grammar). https://en.wikipedia.org/wiki/Hawaiian_grammar
- Named, not read: Elbert & Pukui 1979 *Hawaiian Grammar*; Pukui & Elbert 1986 *Hawaiian
  Dictionary*; Wilson & Kamanā 2012 *Nā Kai ʻEwalu*; Schütz et al. 2005 *Pocket Hawaiian
  Grammar*.

Local data (read-only):

- POLLEX Hawaiian reflexes: `…/roots/.cache/pollex/hawaiian-reflexes.json`
- Wiktionary (kaikki): `…/roots/.cache/kaikki-haw.jsonl`
- Andrews–Parker 1922 OCR: `…/roots/.cache/andrews-parker1922.txt`
- Hawaiian Wikipedia dump: `…/roots/.cache/hawwiki.xml`

Method background (named, not re-read): Saussure *Cours* (syntagmatic vs associative);
Trubetzkoy 1939 (privative/gradual/equipollent; bilateral/multilateral;
proportional/isolated; neutralisation); Jakobson 1932/1957 (markedness in morphology);
Hjelmslev 1943 (commutation, syncretism); Bloomfield 1933 and Harris 1951 (distribution,
allomorphy).

---

## Files (all in this directory)

| file | what |
|---|---|
| `common.py` | loaders, normalisation, Andrews–Parker headword matcher, Wikipedia corpus with the three-pass salad filter (cached in `corpus.pkl`) |
| `paradigms.py` | the paradigms as data (forms + features) |
| `attest.py` → `tables/attestation.{tsv,md}`; `coverage.py` → `tables/coverage.txt` | per-cell attestation in Wiktionary, POLLEX, A–P, Andrews 1854, Wikipedia. Manual corrections to the POLLEX keyword screen: *au* and *ʻō* have no grammatical row |
| `grids.py` → `tables/grids.txt` | commutation analysis inside the pronoun, possessive and deixis grids |
| `pronouns.py` → `tables/pronouns.txt` | pronoun and possessive frequencies; analytic kā/ko + pronoun |
| `possessives.py` → `tables/poss_nouns.tsv`, `poss_summary.txt`, `poss_mixed.txt` | a/o by possessed noun; category agreement; nominalisations |
| `minority.py` → `tables/minority_raw.tsv`; `code_minority.py` → `tables/minority_coded.tsv` | tokens against prediction and my M/E/U coding |
| `poss_ap1922.py` → `tables/poss_ap1922.txt` | 19th-century kana/kona cross-check |
| `deixis.py` → `tables/deixis.txt` | deictic frequencies and collocations (WP, A–P) |
| `directionals.py` → `tables/dir_hosts.tsv`, `dir_verb_hosts.tsv`, `dir_ap1922.tsv`, `dir_summary.txt`, `dir_sample.txt` | V + DIR counts in both corpora; comparatives; random sample |
| `dir_pairs.py` → `tables/dir_pairs.tsv` | the 50 verbs with both mai and aku |
| `code_dir_sample.py` → `tables/dir_sample_coded.tsv` | my coding of the directional sample |
| `articles.py` → `tables/articles.txt` | ka/ke, number frame, plural-lengthening agreement, mau, i/iā |
| `tables/salad_sample60.txt` | residual-salad check |
| `src/` | Andrews 1854 text, Lyon 2018 PDF/text, Shionoya 2008 PDF, Wikipedia grammar wikitext |
