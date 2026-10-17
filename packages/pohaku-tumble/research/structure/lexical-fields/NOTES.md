# Hawaiian lexical fields: componential structure, and where a one-feature substitution is meaningful

Structural-linguistics research note for the Pōhaku Tumble investigation, level **lexical fields**.
This is **research only**. It proposes no change to DESIGN.md and treats nothing as decided. The
owner approves design changes. Where a frame could support a piece, that is noted briefly as an
option (§12), not as a recommendation.

Date: 2026-10-04. Directory:
`structure/lexical-fields/`.
Every count below comes from a script in `scripts/`, which writes its table to `tables/`. A claim
taken from a grammar or description is cited. A claim I could not check is marked *unverified*.
"Attested in the data" means found in a local source (W, P, A, C below). "Described" means stated
in a grammar or description.

---

## 0. The question, and the short answer

**The question at this level.** A lexical field is a set of words that share a general meaning
(Saussure's associative series; Trier/Coseriu's field; the shared part is the *archisememe*). Inside
the field, the words are told apart by a few semantic components. Kinship terms differ in
generation, sex and relative age. Spatial terms differ in axis and pole.

A Jukugo-style tumble needs **two things at once**:

- **On the content plane:** the substitution changes one component and leaves the rest alone. In
  Trubetzkoy's terms the opposition is bilateral and proportional on the content side.
- **On the expression plane:** the substitution swaps one *sign* (one block) and leaves the other
  block standing. The same expression difference then recurs across the series (a : b :: c : d).

**Short answer.**

1. **Hawaiian lexical fields are cleanly componential on the content plane, but their words are
   mostly suppletive on the expression plane.**
   - *luna* : *lalo* (above : below) and *loko* : *waho* (inside : outside) each differ in exactly
     one component, the pole of their axis. They share no formal difference with each other.
   - The same holds for *kaikuaʻana* : *kaikaina* (older : younger same-sex sibling) and for
     *ʻulaʻula* : *ʻeleʻele* (red : black).
   - Substituting one whole word for another in a slot is meaningful. Commuting *part* of a word
     is not: it gives no recurring content difference.
2. **Within the fields, phonemic minimal pairs are arbitrary.** Six fields, 157 terms and 2,062
   term pairs contain only **4** minimal pairs (alo/lalo, kua/mua, hua/huna, mele/ʻele). None
   instantiates a recurring feature. *kua* : *mua* (back : front) happens to be an antonym pair,
   but the k/m difference never recurs. (`field_minpairs.py`)
   - The one exception is vowel length as plural in a closed set of human nouns. **7 of the 11**
     length-plural pairs in Wiktionary are kin or age terms: *kupuna* : *kūpuna*,
     *makua* : *mākua*, *wahine* : *wāhine*, *kaikamahine* : *kaikamāhine* …
   - This confirms the owner's point at this level and matches the phonology study.
3. **The proportional series at this level are phrasal frames, not word-internal ones.** Hawaiian
   is analytic. What Japanese builds inside a two-kanji word, Hawaiian builds as a two-word phrase.
   Each frame below has two slots, and commuting either slot changes one component with a constant
   expression difference.

   | frame | slots | attested cells | where attested |
   |---|---|---|---|
   | kinship GEN × SEX | {kupuna, makua, keiki, moʻopuna} × {kāne, wahine} | 8/8 | hawwiki; one cell suppletive (*kaikamahine*), as Andrews 1922 itself remarks |
   | orientation PREP × LOC | {i, ma, mai, no, o} × {luna, lalo, loko, waho, mua, hope, uka, kai, …} | 44/65 (28/40 core) | hawwiki |
   | traditional counting NUM × UNIT | multiplier × {kāuna 4, kaʻau 40, lau 400, mano 4,000, kini 40,000, lehu 400,000} | — | grammars and 19th-c. texts; ≈0 in modern text |
   | moon nights PHASE × ORDINAL | {Kū, ʻOle (Kū), Lāʻau (Kū), Kāloa (Kū)} × {kahi, lua, kolu, pau} | 17 of the 30 nights | POLLEX (P&E) and Andrews 1922 |
   | limb homologues PART × LIMB | {manamana, kuʻekuʻe, poho, kupeʻe} × {lima, wāwae} (finger : toe, elbow : heel, palm : sole, bracelet : anklet) | 4 pairs | Andrews 1922 |
   | modern compass PLACE × DIRECTION | toponym × {ʻĀkau, Hema, Hikina, Komohana} | 48 places with ≥2 directions | hawwiki |
   | digit frames | {kana- tens, ʻumi kūmā-, ʻe-, ʻa-, hapa- fractions, pā- multiplicatives, Pōʻa- weekdays, kau- canoes} × digit | — | see §5.3 |

   The kinship frame also carries a grammatical correlate. The possessor is o-class with ascending
   and same-generation kin (0–20% a-class) and a-class with descending kin and spouse (86–96%
   a-class). (`kinship.py`)
4. **Polysemy networks are not commutations.** Body-part terms extend to landscape, artifacts,
   people and mind: 24 of 31 coded terms have at least one extension. *lae* is "forehead" and
   "cape"; *poʻo* is "head" and "summit". The direction of extension is regular (body → world, as in
   Heine's body-part model). But the expression does not change, and each term's mapping is
   idiosyncratic. These are content variants of one sign, not oppositions between signs.

---

## 1. Data, method, conventions

| code | source | what it gives | caveat |
|---|---|---|---|
| **W** | Wiktionary Hawaiian, kaikki.org wiktextract dump (`.cache/kaikki-haw.jsonl`), all senses | modern spelling, senses, some etymologies | crowd-edited, secondary |
| **P** | POLLEX-Online Hawaiian reflexes (`.cache/pollex/hawaiian-reflexes.json`), 2,258 rows, 98% cited to Pukui & Elbert 1986 | P&E spelling and gloss for inherited words, protoforms | covers inherited vocabulary only, so innovations (*hikina*, *komohana*, *makuahine*) are absent by construction |
| **A** | Andrews, *Dictionary of the Hawaiian Language*, rev. Parker 1922 (OCR, public domain) | headwords, senses, Hawaiian example phrases | no ʻokina or kahakō; looked up by stripped spelling |
| **C** | Hawaiian Wikipedia dump: 3,019 articles, 31,937 sentences, 410,971 tokens (`lex.py corpus()`) | modern running text: counts, n-grams, KWIC | encyclopedic genre, so motion verbs, *uka*/*kai*, the traditional count and moon nights are rare |

Grammars and descriptions read (all reachable, none forbidden):

- W. D. Alexander, *A Short Synopsis of the Most Essential Points in Hawaiian Grammar* (1864;
  rev. ed. Honolulu: Thrum, 1920), archive.org `shortsynopsisofm00alexrich`.
- L. Andrews, *Grammar of the Hawaiian Language* (Honolulu, 1854), archive.org `cu31924026915888`.
- D. Malo, *Hawaiian Antiquities (Moolelo Hawaii)*, tr. N. B. Emerson (Honolulu, 1903),
  archive.org `hawaiianantiquit00malouoft`.
- T. Shionoya 塩谷亨, "Hawaiian Traditional Numerals Denoting Four and Multiples of Four"
  (4と4の倍数を表わすハワイ語の伝統的数詞), *Hokkaido Gengo Bunka Kenkyū* 8: 73–83 (2010),
  http://hdl.handle.net/10258/701. It cites Elbert & Pukui, *Hawaiian Grammar* (1979) by page, and
  Beckwith 1932: 113.
- Polynesian Voyaging Society, "Hawaiian Lunar Month" and "The Star Compass" (Nainoa Thompson).
- Wikipedia, "Hawaiian kinship" (on Morgan 1871) and "Hawaiian grammar".

Downloaded texts are in `src/`.

Not used: wehewehe.org and its mirrors, Ulukau dictionaries, baibala.org, trussel2. Some web-search
result snippets came from wehe.* mirrors, and I did not use them. I also left aside two P&E-derived
PDFs that earlier agents had saved in `lang/`, `kaua.txt` and `soest.txt`: they reproduce dictionary
entries.

Method, per field:

1. List candidate terms from the descriptions.
2. Verify each in W, P, A and C (`lex.py evidence()`).
3. Write the componential matrix.
4. Find every pair that differs in one component, and ask whether the expression difference
   recurs. If it recurs, the series is proportional. If not, the opposition is isolated on the
   expression plane.
5. For frames, count which cells are attested and in which spelling, spaced or fused.

Normalisation: NFC, ʻokina U+02BB, precomposed kahakō, lowercase.

---

## 2. Units and oppositions at this level

- **Unit.** The lexical sign, word or fixed phrase, inside a field, with its semantic components
  (figurae of content in Hjelmslev's sense: "male", "+1 generation", "upper pole").
- **Paradigmatic oppositions** between terms of a field:
  - **Equipollent bilateral:** *luna* : *lalo*, *kāne* : *wahine*, *ʻākau* : *hema*.
  - **Gradual:** the generation scale *kupuna* > *makua* > (sibling terms) > *keiki* > *moʻopuna*;
    the unit chain *kāuna* < *kaʻau* < *lau* < *mano* < *kini* < *lehu*; the vertical forest belts
    in Malo.
  - **Privative with neutralisation:** relative age (older/younger) is distinguished only between
    same-sex siblings. Between cross-sex siblings it is neutralised (§3.2).
  - **Multilateral equipollent:** the colour terms, and the body-part terms.
- **Syntagmatic frames.** Two-slot phrases in which both slots commute. These are where proportional
  series on both planes live.
- **Three structural types found:**

  | type | content plane | expression plane | examples | tumble-relevant? |
  |---|---|---|---|---|
  | A. componential but suppletive | proportional (one feature) | isolated (whole-word change) | luna/lalo, loko/waho, kaikuaʻana/kaikaina, ʻulaʻula/ʻeleʻele | only if a block = a whole word |
  | B. phrasal frame | proportional | proportional (one slot changes) | GEN×SEX, PREP×LOC, NUM×UNIT, PHASE×ORD, PART×LIMB, PLACE×DIR | yes, structurally |
  | C. polysemy network | variants of one sign | no change | maka eye/face/bud/mesh/point; poʻo head/summit/director; mua/hope across 4 domains | no (nothing commutes) |

---

## 3. Kinship

Script `kinship.py`; tables `kinship_matrix.tsv`, `kinship_gen_sex.tsv`, `kinship_ao.tsv`.

### 3.1 Components and matrix

**Described** (Morgan 1871, via Wikipedia "Hawaiian kinship"): the *Hawaiian system* is the
generational type. Relatives are distinguished by generation and sex only. Cousins are classed with
siblings, and parents' siblings with parents. Wiktionary's glosses agree:

- *makuahine*: "mother; any female relative of the parents' generation"
- *kaikunāne*: "brother or male cousin"
- *moʻopuna*: "grandchild, grandniece, grandnephew"

| term | GEN | SEX (referent) | RSEX (vs ego) | AGE (vs ego) | W | P (P&E) | A | C |
|---|---|---|---|---|---|---|---|---|
| kupuna | +2 | ± | · | · | 1 | 1 (PPN \*tupuna) | 1 | 40 |
| makua | +1 | ± | · | · | 1 | 1 (PPN \*matuqa) | 4 | 86 |
| makuahine | +1 | F | · | · | 1 | 0 | 1 | 189 |
| kaikuaʻana | 0 | = ego | parallel | older | 1 | (kuaʻana: PPN \*tua-kana) | 1 | 199 |
| kaikaina | 0 | = ego | parallel | younger | 1 | 1 (PPN \*tahina) | 1 | 45 |
| kaikunāne | 0 | M | cross | neutralised | 1 | (kunāne: PCE \*tugaane) | 1 | 8 |
| kaikuahine | 0 | F | cross | neutralised | 1 | 1 (PCE \*tua-fine) | 1 | 26 |
| kaikoʻeke | 0 affine | = ego | parallel | · | 1 | 1 (PMQ \*tokete) | 1 | 1 |
| keiki | −1 | ± | · | · | 1 | 1 (PCE \*ta-iti) | 2 | 372 |
| kaikamahine | −1 | F | · | · | 1 | 1 | 1 | 125 |
| moʻopuna | −2 | ± | · | · | 1 | 1 (PPN \*mokopuna) | 1 | 21 |

### 3.2 The sibling quadrant: privative opposition with neutralisation

Generation 0 has four terms on two crossed features, RSEX and AGE. AGE operates only under
parallel sex.

|  | older | younger |
|---|---|---|
| same sex as ego | kaikuaʻana | kaikaina |
| opposite sex (male referent) | kaikunāne | (same) |
| opposite sex (female referent) | kaikuahine | (same) |

Andrews–Parker 1922, s.v. *Kaikuaana* (attested in A), says: "used by a brother when speaking of
a brother, or by a sister when speaking of a sister; but when a brother speaks of an elder sister,
it is kaikuwahine. When a sister speaks of an elder brother it is kaikunane."

This is Trubetzkoyan neutralisation in a lexical field. Under cross-sex, the older/younger
opposition is suspended, and the cross-sex term acts as the archilexeme. Under cross-sex, sex of
referent is predictable from sex of ego, so RSEX and SEX are not independent there.

On the expression plane, all four share *kai-* (Wiktionary: "kinship prefix"). The second parts
(*kuaʻana*, *kaina*, *kunāne*, *kuahine*) are **suppletive**. Each continues its own protoform
(PPN \*tua-kana, \*tahina; PCE \*tugaane, \*tua-fine). The *-hine*/*-nāne* endings carry a
historical sex contrast (PCE \*-fine "female", \*-(t)aane "male"), but no other sibling pair
repeats them synchronically.

Verdict: **componentially proportional, expressively isolated.** Commuting *kaikuaʻana* →
*kaikaina* changes exactly one feature, but only by swapping a whole stem. The *kai-* paradigm has
6 Wiktionary members: kaikuaʻana, kaikaina, kaikunāne, kaikuahine, kaikoʻeke, kaikamahine.
Wiktionary analyses the last as kai- + *kamahine* "girl".

### 3.3 The GEN × SEX frame: the one proportional series in kinship

Sex of referent is marked by **N + kāne / N + wahine**. On the expression plane this is
proportional: a constant second word with a constant feature.

Counts are from hawwiki (spaced / fused spelling) and Andrews–Parker 1922 headwords.

| GEN noun | + kāne | + wahine | Andrews 1922 |
|---|---|---|---|
| kupuna (+2) | kupuna kāne 9 / kupunakāne 3 | kupuna wahine 12 / kupunawahine 4 / kupunahine 3 | *Kupuna kane* "[Kupuna, grandparent, and kane, male.] A grandfather"; *Kupunawahine* "A grandmother" |
| makua (+1) | makua kāne 18 / makuakāne 105 | **makuahine 189** (makua wahine 1) | *Makuakane* "The male parent; a father"; *Makuahine* "[Makua, parent, and wahine, female.] A mother" |
| keiki (−1) | keiki kāne 23 / keikikāne 21 | keiki wahine **1**, against **kaikamahine 125** | *Keikikane* "A son"; *Kaikamahine*: "(According to analogy this word for daughter should be keikiwahine, after the analogy of keikikane, but Hawaiians do not use it so.)" |
| moʻopuna (−2) | moʻopuna kāne 1 | moʻopuna wahine 1 | — |

- **Size:** a 4 × 2 grid. All 8 cells are attested in C, counting *kaikamahine* for (−1, F).
  - 6 cells use the transparent formula N + kāne/wahine.
  - 1 uses a reduced, fused allomorph (*makua-hine*).
  - 1 is suppletive (*kaikamahine*, 99% of the (−1, F) tokens). A grammarian noticed the gap in
    1922.
- **Extension:** Andrews notes that *kaikoʻeke* is "generally further designated by the word,
  kane or wahine". *Unverified:* how far N + kāne/wahine extends to animals and other human nouns
  in P&E.
- **Commutation on both planes:**
  - kupuna kāne → kupuna wahine changes only SEX.
  - kupuna kāne → makua kāne changes only GEN.
  - Lines between blocks would state true facts: two terms share a generation, or share a sex.
- **Spelling is non-significant.** Spaced and fused spellings coexist with no content difference
  (makua kāne 18 vs makuakāne 105). Modern P&E-style spelling separates them (*unverified* per
  cell). Older texts fuse them.

### 3.4 A grammatical correlate: a- vs o-class possession follows generation

**Described** (Wikipedia, "Hawaiian grammar", on *kino ʻō*/*kino ʻā*): ego's own and previous
generations take o-class; descending generations take a-class.

Measured in C, counting possessors *kāna/kaʻu/kāu/kā* against *kona/koʻu/kou/ko*, with or without
*mau*:

| kin term | a-class | o-class | share a |
|---|---|---|---|
| kupuna / kūpuna | 0 / 1 | 14 / 4 | 0.00 / 0.20 |
| makua / mākua / makuahine / makuakāne | 0 | 15 / 47 / 65 / 74 | 0.00 |
| kaikuaʻana / kaikaina / kaikunāne / kaikuahine | 5\* / 0 / 0 / 1 | 50 / 16 / 2 / 4 | 0.09 / 0 / 0 / 0.20 |
| ʻohana | 1 | 51 | 0.02 |
| **keiki** | **41** | 4 | **0.91** |
| **kaikamahine** | **15** | 1 | **0.94** |
| **moʻopuna** | **6** | 1 | **0.86** |
| **wahine** (wife) | **27** | 1 | **0.96** |
| kāne (husband/male) | 7 | 4 | 0.64 |

\*All 5 are *kāna mau kaikuaʻana*, from one narrative (KWIC).

So the a/o split is ≥80% regular along the GEN axis: GEN ≥ 0 → o; GEN < 0 and spouse → a. It is
**agreement**, not free commutation. The kin noun selects the possessive. In a frame
[POSS][KIN], commuting the possessive's a/o against a fixed kin term gives an unexpected form,
not a new meaning. Whether a/o can contrast meaningfully on one noun (the classic *kona kiʻi* vs
*kāna kiʻi*) belongs to the grammatical-paradigms level.

### 3.5 Vowel length as plural: a phoneme commuting meaningfully, in this field only

`field_minpairs.py` lists Wiktionary's "plural of" entries that differ from their base by
lengthening one vowel. There are 11, and **7** are kin or age terms:

| singular | plural | C | C plural |
|---|---|---|---|
| kupuna | kūpuna | 40 | 39 |
| makua | mākua | 86 | 135 |
| makuahine | mākuahine | 189 | 0 |
| wahine | wāhine | 324 | 33 |
| kaikamahine | kaikamāhine | 125 | 10 |
| luahine | luāhine | 3 | 0 |
| ʻelemakule | ʻelemākule | 3 | 0 |

The 4 non-kin pairs are kanaka/kānaka, kahuna/kāhuna, kahiko/kāhiko and ʻaumakua/ʻaumākua.
*ʻaumakua*, "family god", is sensitive.

This is a proportional series (V : Vː = sg : pl) with a phonological expression. It is closed,
about 11 members, and confined to human nouns (cf. phonology NOTES §6.1). It is the only place in
these fields where the owner's "one mark" changes meaning systematically.

### 3.6 Sensitivity

Everyday words, so sensitivity is low. Exceptions:

- *kupuna* also means "ancestor", and genealogy (moʻokūʻauhau) is sensitive in use.
- *ʻaumakua*: family god.
- *punalua* (co-spouses; P has it, PCE \*puna-rua): avoid.
- *hānai* (adoption) is culturally loaded but not sensitive as a word.

---

## 4. Orientation and space

Scripts `space.py`, `andrews_corpus.py`; tables `space_terms.tsv`, `space_prep_loc.tsv`,
`space_verb_loc*.tsv`.

### 4.1 Components: six axes, two poles, several reference frames

| axis | + pole | − pole | middle | W / P / A (both poles) | C (+/−) | origin |
|---|---|---|---|---|---|---|
| vertical | luna "above, top" | lalo "below" | waena | 1/1/1 | 567 / 197 | PPN \*luŋa, \*lalo |
| containment | loko "inside" | waho "outside" | — | W lacks waho; P 1/1; A 1/1 | 618 / 397 | PPN \*loto; PCE \*waho |
| sagittal / temporal | mua "front, before" | hope "back, after" (also muli) | waena | 1/1/1 | 1424 / 809 | PPN \*muqa; PEP \*sope "buttocks" |
| island-radial | uka "inland" | kai "sea" | — | 1/1/1 | 10 / 229 | PPN \*quta, \*tahi |
| lateral → N–S | ʻākau "right; north" | hema "left; south" | — | 1/1/1 | 289 / 316 | PCE \*katau, PPN \*sema |
| sun path → E–W | hikina "east" | komohana "west" | — | W 1/1, P 0/0, A 1/1 | 149 / 478 | Haw. hiki "arrive" + -na; komo "enter" + -hana (Alexander 1920 §58; Emerson's note in Malo 1903) |

- The poles of each axis are an **equipollent bilateral** opposition.
- With *waena* "middle" (C 369), the vertical and sagittal axes become **gradual and ternary**.
  Alexander §55 lists waena with the locatives.
- The axes are related to one another **multilaterally**.
- **Expression is suppletive** across the whole field. No two axes share an expression difference.
  The exception is a coincidence: *kua* : *mua* (back : front) is a minimal pair. It is
  inherited (PPN \*tuqa : \*muqa) but isolated.

**Reference frames are relational, not absolute.** All the evidence below is described in sources,
or attested in A.

- **Malo (1903, ch. on the points of the compass, §3–§7).** On the western side of an island,
  east is *uka* and west is *kai*. On the eastern side, west is *uka* and east is *kai*. There,
  "he would term South *akau*, because his right hand pointed in that direction, and north he
  would term *hema*". Also: "north … is also spoken of as *luna* … and south … as *lalo*",
  because of the prevailing wind. This matches P (P&E): *lalo* "South" (< PPN \*lalo "West").
- **Andrews–Parker 1922, s.v. *Akau*:** "In geography, the person is supposed to stand with his
  face to the west; hence the right hand is towards the north." The PVS Star Compass says the
  same.
- **Malo §11:** east and west also as *ka lā hiki* "the sun arrived" and *ka lā kau* "the sun
  lodged": "O Hawaii ka la hiki, o Kauai ka la kau".
- **Emerson's note:** uka/kai "had sole reference to position on or tendency towards land or sea,
  towards or away from the centre of the island". Wiktionary *mauka*: "inland … shoreward (if at
  sea)".
- **Wind-quarter names (P).** *koʻolau* "windward NE" < PPN \*tokelau "northerly quarter";
  *kona* "leeward S/SW" < PPN \*toga "SE quarter"; *hoʻolua* < PCE \*faka-rua; *malanai* < PCE
  \*maragai. The bearing of the "same" sign has rotated across Polynesia, which shows again that
  the signified is relational. PVS: Koʻolau NE, Malanai SE, Kona SW, Hoʻolua NW.

**Structural consequence.** These are polysemous signs that map onto several axes, each mapping
proportional on the content plane:

- ʻākau : hema :: right : left :: north : south
- luna : lalo :: up : down :: north : south :: windward : leeward
- alo : kua :: front : back. Andrews: "Antonym: kua". P: *alo* "leeward"; W: *kua* adv.
  "windward".

The polysemy is shared in parallel by both poles, so it is **bilateral and proportional on the
content plane**. But it is polysemy: commuting nothing changes the meaning.

### 4.2 mua : hope across four domains (polysemy measured)

Wiktionary senses (W), with P&E glosses via POLLEX in brackets:

| domain | mua | hope | corpus (C) |
|---|---|---|---|
| space | front, ahead, forward | back, rear, aft | i mua 21 / i hope 5 |
| time | before, previously, former | subsequent, next, after | ma mua o 251 / ma hope o 399; ka wā ma mua "the past" 10 / ka wā ma hope "later times" 6 |
| order | first, foremost | last | mua loa 136 / hope loa 88 |
| kinship | oldest, older sibling, senior branch | younger | hānau mua 2, keiki mua 2 |
| (P&E) | "Before (space, time), ahead, front" (PPN \*muqa) | "Buttocks, behind, after, posterior" (PEP \*sope) | — |

- **Four parallel domains, shared by both poles**, plus *muli* "after, behind, younger, last" as a
  near-synonym of *hope*. The month names *Māhoe mua* and *Māhoe hope*, "first twin / second twin"
  (A: both headwords; 0 in C), put mua : hope inside a two-slot frame.
- *hope* < PEP \*sope "buttocks" is a body-part → space grammaticalisation (Heine's body-part
  model).

### 4.3 The PREP × LOC frame: proportional on both planes

Alexander (1920 §55) says the locatives "are really nouns with the article omitted, [which] when
preceded by either of the simple prepositions, serve as adverbs of place or time". Andrews–Parker
1922 on *luna*: "found only in the compounds a, i, o, ko, no, ma, and mai".

Counts are hawwiki, spaced / fused:

| loc | i | ma | mai | no | o | cells attested |
|---|---|---|---|---|---|---|
| luna | 54/2 | 237/66 | 5/0 | 0/0 | 1/0 | 4 |
| lalo | 29/0 | 156/3 | 0 | 0 | 0 | 2 |
| loko | 498/73 | 64/3 | 8/0 | 1/0 | 5/0 | 5 |
| waho | 147/0 | 55/7 | 4/0 | 2/0 | 0 | 4 |
| mua | 21/20 | 487/19 | 5/0 | 0 | 1/0 | 4 |
| hope | 5/0 | 643/24 | 0 | 0 | 1/0 | 3 |
| uka | 2/0 | 1/2 (mauka) | 0 | 0 | 1/0 | 3 |
| kai | 0 | 0/8 (makai) | 0/10 | 0 | 1/0 | 3 |
| waena, muli, ʻō, laila, ʻaneʻi | | | | | | 3, 3, 3, 5, 2 |

- **Size:** 44 of 65 cells attested in C (28 of 40 for the 8 core locatives). The genre limits
  this: *uka*/*kai* and *mai*/*no* phrases are rare in encyclopedic text.
- **Regularity:** compositional. The preposition carries the relation (to/at · at/along · from ·
  of/for) and the locative carries the place. KWIC check (`space.py`): *mai luna mai* "from above",
  *no loko mai o ka mokuʻāina* "from within the state", *i waho* "outward".
- Each tumble changes one component:
  - *i luna* → *mai luna*: relation changes, place stays.
  - *i luna* → *i lalo*: pole changes, axis stays.
  - *i luna* → *i loko*: axis changes.
- **Orthography:** only 8.8% of PREP + LOC tokens in C are fused (300 of 3,424). *mauka* and
  *makai* are the exceptions: they stay fused (C: mauka 2 vs ma uka 1; makai 8 vs ma kai 0). In
  A, fused spellings are normal: iuka 6, mauka 12, makai 15, iluna 23, maluna 28, iloko 40.
- **Homographs:** *makai* is also "policeman / guard / to inspect" (A: 4 entries), and
  *mauka* is also a game (*maika*). *mua* is also "men's eating house (kapu to women)" and "a
  bottle-necked calabash" (A).

### 4.4 Motion verbs and the axes

Is uka : kai aligned with luna : lalo? Malo §3 says yes: "he had to ascend a height in going
inland, uka, and descend … in going to the sea". Alexander §55: *E iho i kai* "descend to the
sea".

Measured, the evidence is thin. In old text (A plus the two grammars), *piʻi* "ascend" + uka 2,
*iho* "descend" + kai 1, and the reverse pairings 0 (`space_verb_loc_oldtext.tsv`). In C, every
cell is ≤ 2 except *komo i loko* "enter inside" (53). Treat the alignment as **described, not
measured**.

### 4.5 Modern compass frame: PLACE × DIRECTION, and intercardinals

- In C, **48** toponyms occur with at least two different compass words:
  - *ʻAmelika ʻĀkau* 41 / *Hema* 29
  - *Kōlea Hema* 31 / *ʻĀkau* 3
  - *ʻApelika ʻĀkau* 7, *Hema* 12, *Komohana* 3, *Hikina* 1
  - *ʻEulopa* (all four), *Polenekia* …
- **Intercardinals compose E/W + N/S**, a 2 × 2 grid:

  |  | ʻākau (N) | hema (S) |
  |---|---|---|
  | komohana (W) | komohana ʻākau 119 | komohana hema 77 |
  | hikina (E) | hikina ʻākau 5 | hikina hema 26 |

  Reversed order is rare: ʻākau hikina 6, ʻākau komohana 4, hema hikina 5. The PVS quadrant names
  (Koʻolau, Malanai, Kona, Hoʻolua) express the same four meanings suppletively.
- The frame is proportional and productive, but it is a calque of European toponymy.

### 4.6 Sensitivity

Low. *mua*, "men's eating house", and *kua* in A, "the woman's house", belong to the old kapu
domestic system. *wao akua*, "realm of the gods" (§7.3), is mildly sensitive.

---

## 5. Counting: the traditional system in fours and forties, and the digit frames

Script `numbers_time.py`; tables `num4_units.tsv`, `num_frames.tsv`.

### 5.1 The units (verified)

| unit | value | attestation |
|---|---|---|
| kāuna | 4 | P (P&E): "Four (formerly tubers were counted by fours)" < PMQ \*taau-ga "pair"; A: "Four; the composite number four"; Alexander §30: "A four taken collectively is called a kauna"; C 1 |
| kaʻau | 40 | A: "Hawaiian numeral meaning the number forty: hookahi kaau"; Alexander §30: "ka'au, used in counting fish"; Shionoya 2010 cites E&P 1979: 159 (fish). W 0, P 0, C 0 |
| kanahā | 40 | W "forty"; Alexander §29; Andrews 1854: "Umi kauna, ten fours — 1 kanaha, 40". Also the general decimal 40 |
| ʻiako | 40 | Alexander §30: "used in counting tapas and canoes"; E&P 1979: 162 via Shionoya, "rarely". In P only as "outrigger boom" |
| lau | 400 | W "four hundred"; P "Many, numerous, four hundred" (PPN \*lau "indefinite large number"); A "3. The number 400"; Alexander |
| mano | 4,000 | W; P "Four thousand, many, multitude" (PPN \*mano "a thousand"); A: "He umi lau ua like ia me ka mano, Ten lau equals a mano" |
| kini | 40,000 | W; P "Multitude, many, forty thousand" (PEP \*tini); A |
| lehu | 400,000 | A: "2. The number 400,000, the highest in the Hawaiian series of numbers"; Alexander. P has only "ashes", "grey". W has only "ash; grey" |
| nalowale | 4,000,000 | Beckwith 1932: 113 (via Shionoya). **Disputed:** A says "Nalowale has been supposed to be one of the highest of a series of numbers … but nalowale signifies only" "lost". Treat as unverified |

**Structure.** Each unit is ten times the previous (Andrews 1854: "Umi kauna … Umi kanaha … Umi
lau … Umi mano … Umi kini"). It is a **gradual** series whose expression is fully suppletive.

The multiplier frame **NUM1 × NUM4** is proportional and arithmetic. Shionoya's examples, from
E&P 1979 and old texts:

- *ʻekolu kāuna* = 12 (E&P 1979: 162)
- *ʻelua kaʻau ʻanae* = 80 mullet (Kahāʻulelio)
- *ʻekolu lau* = 1,200 people (Fornander)
- *hoʻokahi kaʻau me nā kāuna ʻekolu* = 52
- *pā-kāuna* "by fours", *pā-kaʻau* "by forties" (E&P 1979: 160)

Kanepuu (*Ke Au Okoa*, 21 Jan 1867, via Bishop Museum's Nūpepa blog): "One lau and nine kaʻau" =
760 fish; "Three lau and two kaʻau with five kauna" = 1,300 taro. Shionoya also finds that NUM4
units behave like nouns (they take *mau*, *nā*, and k-possessives) and **have no ordinal use**.

**Attestation in modern text: ≈0.** None of *ʻelua kāuna*, *ʻelua kaʻau* or *ʻekolu lau*
occurs in C, and *kāuna* occurs once. **Homography:** *lau* "leaf", *mano* "multitude"
(*manō* "shark" differs by kahakō), *kini* "multitude, king, kin, gin, tin", *lehu* "ash",
*nalowale* "lost". Commuting units is meaningful arithmetically, but a block reading *lau* will be
read as "leaf".

### 5.2 Decimal history

- Alexander §29: *kanalima … kanaiwa*, *haneri*, *tausani* "have been introduced by the American
  missionaries". "Formerly 100 would have been expressed thus, 'elua kanaha me ka iwakalua'"
  (2 × 40 + 20).
- Andrews 1854 §116: "It is a modern improvement that the word kana has been prefixed to lima,
  ono, hiku, &c."
- So the *kana-* + digit series (§5.3) was built in the 19th century **by proportional analogy**
  from kanakolu 30 and kanahā 40.

### 5.3 Digit frames: where commuting the digit is meaningful

Each cell reads "W" if Wiktionary has a headword, then the hawwiki token count. Table
`num_frames.tsv`.

| frame | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | W cells | C>0 cells |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ʻe- (cardinal) | W30 | W274 | W150 | W119 | W74 | W54 | W43 | W39 | W17 | 9 | 9 |
| ʻumi kūmā- (11–19) | W9 | W17 | W2 | W6 | W2 | W4 | W5 | W4 | W1 | 9 | 9 |
| ʻa- (serial "N times") | W1 | W0 | W0 | W0 | W0 | W0 | W0 | W0 | W0 | 9 | 1 |
| kana- (tens) | – | –1 | W5 | W1 | W11 | W2 | W3 | W1 | W2 | 7 | 8 |
| Pōʻa- (weekday N: Mon–Sat) | W2 | W2 | W1 | W1 | W5 | W1 | – | – | – | 6 | 6 |
| hapa- (1/N) | – | W20 | W4 | W3 | –1 | – | – | – | – | 3 | 4 |
| pā- (N-fold, by N) | –14 | W6 | –1 | – | W0 | – | – | – | – | 2 | 3 |
| kau- (N-hulled canoe) | –2 | –14 | – | – | – | – | – | – | – | 0 (P: 2) | 2 |

- Andrews 1922 confirms the members by etymology: *Hapalua* "[Hapa, part, and lua, two.]
  One-half"; *Hapakolu*; *Hapaha*; *Pakolu* "To do three by three"; *Paha* "Four times; by fours";
  *Poakahi* "[Po, night, and kahi, one, first.] Monday"; *Kaukahi* "[Kau, canoe, and kahi, one.] A
  single canoe"; *Kaulua* "Double … waa kaulua, double canoe".
- **Pōʻa-N:** pō "night" (P&E: pō "formerly the period of 24 hours beginning with nightfall") +
  ʻa- + digit. The weeks count nights.
- **Regularity:** every attested cell has the compositional meaning. Commuting the digit changes
  the number and nothing else. These are the most regular proportional series in this study, but
  the content is arithmetic, not lexical-semantic. The digit roots also overlap other words:
  *lua* "pit", *lima* "hand", *hā* "breath", *kolu*?, *hiku*?, *iwa* "frigatebird". *Unverified*
  for the two marked "?".

### 5.4 Sensitivity

Low. The homographs are the issue (§5.1).

---

## 6. Time: day/night, the moon nights, seasons, months

Script `numbers_time.py`.

### 6.1 Binary oppositions (isolated, suppletive)

| opposition | terms | attestation |
|---|---|---|
| light : dark | ao "daylight, day, dawn; world" : pō "night; 24-h day (formerly); realm of the gods" | W, P (PPN \*qaho, \*poo); C 143 / 277; *pō a ao* 13. *ao* has a homograph, "cloud" (PPN \*qao) |
| dry : wet season | kau (*kau wela* 8) : hoʻoilo "winter, rainy season" (*kau hoʻoilo* 5) | W (hoʻoilo); P only for *kau* "period of time, season" |
| times of day | kakahiaka morning, awakea noon (PCE \*awatea), ʻauinalā afternoon, ahiahi evening (PPN \*afiafi), aumoe midnight (PPN \*aqu-mohe) | W; partly P; C small |

*pō* also names the cosmogonic darkness (Kumulipo) and the realm of the gods (P: PCE \*poo "The
Underworld"). That is moderately sensitive in some uses.

### 6.2 The moon-night frame: PHASE × ORDINAL (proportional, inherited, attested)

PVS "Hawaiian Lunar Month" (citing Kamakau, Malo, Handy & Pukui, Andrews, Pukui-Elbert):

1. Hilo
2. Hoaka
3. Kūkahi
4. Kūlua
5. Kūkolu
6. Kūpau
7. ʻOle Kūkahi
8. ʻOle Kūlua
9. ʻOle Kūkolu
10. ʻOle Kūpau
11. Huna
12. Mōhalu
13. Hua
14. Akua
15. Hoku
16. Māhealani
17. Kulua
18. Lāʻau Kūkahi
19. Lāʻau Kūlua
20. Lāʻau Kūpau
21. ʻOle Kūkahi
22. ʻOle Kūlua
23. ʻOle Kūpau
24. Kāloa Kūkahi
25. Kāloa Kūlua
26. Kāloa Pau
27. Kāne
28. Lono
29. Mauli
30. Muku

|  | kahi (1st) | lua (2nd) | kolu (3rd) | pau (last) |
|---|---|---|---|---|
| Kū | 3 | 4 | 5 | 6 |
| ʻOle (Kū), first set | 7 | 8 | 9 | 10 |
| Lāʻau (Kū) | 18 | 19 | — | 20 |
| ʻOle (Kū), second set | 21 | 22 | — | 23 |
| Kāloa (Kū) | 24 | 25 | — | 26 |

- **Size:** 17 of the 30 nights fall in a 4-phase × 4-ordinal frame. The phases are Kū, ʻOle,
  Lāʻau and Kāloa; ʻOle recurs. *pau*, "finished", is the **last** ordinal whatever the count.
  That makes the ordinal slot relative (first, second, …, last), not cardinal.
- **Attested in P (P&E):**
  - *kū* "Name for the third, fourth, fifth and sixth days of the month (Kuu kahi, Kuu lua, Kuu
    kolu, Kuu pau)" < PCE \*tuu
  - *lāʻau-* "(Laa'au Kuu Kahi, Laa'au Kuu Lua, Laa'au Pau)" < PEP \*raakau
  - *kāloa* "Kaaloa Kuu Kahi, Kaaloa Kuu Lua, Kaaloa Pau … sacred to the god Kanaloa" < PCE
    \*tagaroa
  - *Nā ʻOle* "Nights of the moon (7–10, 21–22)" < PEP \*kore-kore

  P also has 10 more night names with protoforms: hilo, hoaka, huna, mōhalu, hua, akua, hoku,
  kāne, lono, mauli, muku.
- **Attested in A:** 13 frame members as headwords. Kukahi, Kulua, Kukolu, Kupau, Olekulua,
  Olekukolu, Olepau, Laaukukahi, Laaukulua, Laaupau, Kaloakukahi, Kaloakulua, Kaloapau. Each is
  defined by its day number. Andrews counts days from Hilo, so his numbers run one off from the
  PVS night numbers.
- **In C:** a calendar list (*kū kahi* 6, *ʻole kū kahi* 2, *lāʻau kū kahi* 1, *kāloa kū kahi*
  1). Spelling varies, spaced or fused (*kūkahi*).
- **Regularity:** commuting the ordinal always means "next night in the same phase". Commuting the
  phase always means "same rank in another phase" (Kū kahi : Kū lua :: Lāʻau kahi : Lāʻau lua).
  One trap:
  - **Kulua** (night 17) looks like Kū + lua but P derives it from PCE \*turu. It is a homograph,
    a **pseudo-member**.
  - Andrews also gives *Kulua* "a pair of twins".
- **Variation:** P says month and night names vary by island ("Hilina Mā … eleventh month
  (Moloka'i), eighth (Kaua'i)"). The night sequence also varies (*unverified* in detail).
- **Sensitivity: moderate.** Kū, Kāloa (= Kanaloa), Kāne, Lono and Akua are deity names, and the
  Kū/Kāloa/Kāne/Lono nights were kapu nights (A: *Kupau* "the last of the Ku-tabu"; *Kaloakukahi*
  "one of the days of the Kanaloa tabu"). The *kaulana mahina* calendar is a living practice
  taught publicly, but tumbling deity names is a choice the owner would have to weigh.

### 6.3 Months

The traditional month names are suppletive, star- or season-based and regional (P: *welehu*,
*welo*, *hinaiaʻeleʻele*, *kaulua*, *makaliʻi* "Pleiades; … the six summer months collectively").
They contain one mua/hope pair: **Māhoe mua / Māhoe hope**, "first/second twin" (A: both;
*māhoe* "twins"). *kaulua* is a homograph: month, Sirius, and "double canoe".

---

## 7. Colour

Script `colour.py`; table `colour_terms.tsv`.

### 7.1 The terms

Wiktionary has 37 headwords with a colour gloss, many of them plant or fish names. The core terms:

| term | shape | root | root's other senses (W / P) | C (term / root) | P for term or root |
|---|---|---|---|---|---|
| keʻokeʻo white | RR | keʻo | P (P&E): "White, clear, bleach" (PMQ \*teko); also "Clitoris" (PCE \*teo) | 47 / 0 | root |
| ʻeleʻele black, dark | RR | ʻele | W "dark, black" | 52 / 3 | — |
| ʻulaʻula red | RR | ʻula | "red; sacredness; sacred, regal, royal; blood" (PPN \*kula) | 56 / 6 | root |
| uliuli dark: blue, green, black | RR | uli | "any dark color … black and blue"; homograph "to steer, steersman" (PPN \*quli) | 20 / 0 | root |
| melemele light yellow | RR | mele | homograph "chant, song" (PNP \*umele), C 1,000 | 24 / 1,000 | term (star name) |
| lenalena orange-yellow | RR | lena | "turmeric"; homograph "stretch, draw taut" (PPN \*lena) | 2 / 1 | root |
| ʻōmaʻomaʻo green | ʻō- + RR | maʻo | "green; Hawaiian cotton" (PPN \*mako "tree sp.") | 20 / 1 | root |
| ʻāhinahina grey | ʻā- + RR | hina | "grey hair; to fall; a goddess" (PPN \*sina "grey-haired"; \*siga "fall") | 4 / 21 | root |
| lehu grey, ash | simple | — | "ash"; also 400,000 (§5.1) | 3 | yes |
| kea white | simple | — | PPN \*tea "white" | 9 | yes |
| mākuʻe brown | simple | — | P (P&E): "Dark brown; any dark colour" (PMQ \*maatuke) | 0 | yes |
| poni purple | simple | — | "to anoint, consecrate" homograph; P: "Purple; dark varieties of taro…" | 7 | yes |
| ʻākala pink | simple | — | "Hawaiian raspberry" | 2 | yes |
| polū blue, ʻalani orange | simple | — | loans | 6 / 5 | — |

### 7.2 Structure

- **Expression:** 6 of the 7 inherited core terms are full reduplications of a CVCV root (RR), and
  the seventh, *ʻōmaʻomaʻo*, is ʻō- + RR. So **root : RR** is a proportional expression series of
  about 7 members.
  - On the content plane its effect is roughly constant: RR is the colour adjective.
  - But the bare roots are **homograph-laden**: *mele* "song", *uli* "steer", *ʻula*
    "sacred/royal; blood", *hina* "fall; goddess", *lena* "stretch", *maʻo* "cotton plant". *keʻo*
    has a sensitive P&E sense.
  - So "root ↔ RR" is not a clean sign-for-sign commutation. General reduplication belongs to the
    derivation-reduplication study.
- **Content:** the core colour terms form a **multilateral equipollent** set.
  - *uliuli* covers dark blue, green and black. P: PN \*qusi "dark-coloured, including dark blues
    and greens", https://pollex.eva.mpg.de/entry/qusi/.
  - So uliuli overlaps *ʻeleʻele* on "black". This is a grue/dark category.
  - A Berlin–Kay stage assignment is *unverified*: I found no peer-reviewed study of Hawaiian colour
    terms.
- **No proportional expression differences between terms.** *mele*/*ʻele* is a minimal pair
  (m/ʻ) and arbitrary.
- **Frame N + COLOUR** (lole ʻulaʻula → lole ʻeleʻele, "red cloth" → "black cloth") is
  productive. Commuting the colour changes one feature of the phrase. In C it is sparse, with ≤ 2
  tokens per combination (`colour.py` §3).

### 7.3 Sensitivity

Low to moderate:

- *ʻula*: sacredness and royalty, and blood.
- the bare root *keʻo* (sensitive P&E sense).
- *hina*: a goddess name.

---

## 8. Body parts and their extensions

Script `body.py`; tables `body_extensions.tsv`, `body_limb_frame.tsv`.

### 8.1 The extension network (coded from W and P senses)

I coded the non-body senses of 31 body terms by domain. 24 of the 31 have at least one extension,
and 7 have an unrelated homograph that is a separate etymon in P.

Domain counts (a term can hit several):

| domain | terms | examples |
|---|---|---|
| artifact | 8 | maka mesh of net, blade; ihu prow; alo upper surface of a bowl; kino hull; piko end of rope; ʻili leather |
| space | 8 | alo front/presence; kua rear; waha opening; ʻili surface; manamana rays; kapuaʻi footprint; hope rear |
| person / social | 7 | poʻo director; maka beloved one; hulu "esteemed older relative"; ʻiʻo relative; kino person, self; piko relation |
| plant | 7 | maka bud; ʻili bark; iwi pandanus core; manamana branches; pepeiao cotyledon |
| land | 6 | poʻo summit; lae headland, cape (P: CC \*laqe "promontory"); kua ridge (Malo: kua-hiwi, kua-lono); piko summit, border; nuku mouth of harbour; ʻili land division |
| animal | 6 | ihu snout, beak; niho tusk; hulu feather; kapuaʻi paw |
| mind | 6 | naʻau mind, heart, feelings; ʻōpū disposition; ake yearn; alelo language |
| orientation | 2 | alo leeward; kua windward |
| number / measure | 2 | lima five (PPN \*lima "hand" and "five"); kapuaʻi foot (unit) |

Malo (1903) names the island's zones partly with *kua-* "back":

- *kua-hiwi* "back-bone" (P: PPN \*tuqa-siwi "ridge of a mountain; backbone")
- *kua-lono* (ridges)
- *kua-mauna* (mountainside)
- *kua-hea*
- *kua-lapa* (ridge)
- *kua-moʻo* "lizard-back", meaning the road

The vertical forest belts are *wao*, *wao-eiwa*, *wao-maukele*, *wao-akua* and *wao-kanaka*.
*wao akua* : *wao kanaka* contrasts "realm of gods" with "realm of people". It is attested in A,
not in C.

**Structural reading.** This is a radial polysemy network, the **content variants of one sign**,
not an opposition. The direction is regular (body → artifact, land, person, mind), and the land
cases support a "body of the island" reading, but the mapping is idiosyncratic per term:

- *lae* goes to "cape", not "brow of a hill".
- *poʻo* goes to "summit", but so does *piko*.
- *kua* goes to "ridge" and to "windward".

Nothing on the expression plane changes, so there is nothing to commute. A frame like "X o ka
mauna / X o ke kanaka" would rest on these polysemies. In C, "X o ka mauna" phrases are too rare
to measure. *Unverified.*

### 8.2 The limb frame: PART × LIMB (proportional on both planes, small)

Andrews–Parker 1922, s.v. *Kapuai*: "The Hawaiians have no word for foot in distinction from
wawae, leg; … so lima signifies arm including the hand". Parts of the limbs are named
**[generic part] + [limb]**:

| part | + lima | + wāwae | Andrews 1922 | C | P (part) |
|---|---|---|---|---|---|
| manamana "branch" | finger | toes | *Manamanalima* "[Manamana, to branch, and lima, hand or arm.] … the finger"; *Manamanawawae* "The toes" | manamana lima 1 | "Finger, toe" (PEC \*maga-maga) |
| kuʻekuʻe "joint, protuberance" | elbow | heel; ankle joints | *Kuekuelima* "The elbow"; *Kuekuewawae* "1. The heel. 2. The ankle joints" | 0 | "Elbow, joint, knuckle" (PPN \*tuke) |
| poho "hollow" | palm | hollow of the foot | *Poholima* "The hollow of the hand"; s.v. *Poho*: "poho lima … poho wawae, hollow of the foot, opposite of piko o ke poo" | 0 | (other sense) |
| kupeʻe "ornament, fetter" | bracelet | anklet | s.v. *Kupee*: "A bracelet; kupee lima"; "anklets, or bracelets" | kupeʻe lima 1 / kupeʻe wāwae 1 | — |

- **Size:** 4 homologous pairs, 8 cells.
- **Regularity:** commuting the limb always maps the part to its homologue on the other limb.
  Commuting the part moves along the limb. Both planes are proportional (finger : toe :: elbow :
  heel :: palm : sole). It is the cleanest **two-slot meaningful commutation** in the body field.
- **Weakness:** modern attestation is 3 tokens in C, and modern spelling (spaced or fused,
  ʻokina) is *unverified* for each cell. POLLEX's single *manamana* "finger, toe" shows that the
  limb word is often omitted: finger and toe are neutralised unless specified.

### 8.3 Sensitivity

Moderate to high, so the field would need curation:

- genital and anal terms: P *lehelehe* "labia"; W *ʻōkole*.
- *piko*: navel, umbilical cord, genitals. The umbilical-cord rites are sacred: Malo on *ʻoki piko*.
- *iwi*: bones. *Iwi kūpuna*, ancestral remains, are highly sensitive. *Unverified* in these
  sources, but widely documented.
- *naʻau*: the seat of feeling and knowledge. It is culturally weighty, not taboo.

---

## 9. The owner's point at this level: phonemic minimal pairs inside fields

`field_minpairs.py`, `tables/field_minpairs.txt`:

| field | terms | term pairs | minimal pairs | systematic |
|---|---|---|---|---|
| kinship | 22 | 231 | 0 | — |
| space | 25 | 300 | 2 (alo/lalo; kua/mua) | 0 (kua : mua is antonymous but unique) |
| counting | 19 | 171 | 0 | — |
| time | 31 | 465 | 1 (hua/huna, nights 13/11) | 0 |
| colour | 25 | 300 | 1 (mele/ʻele) | 0 |
| body | 35 | 595 | 0 | — |
| **total** | 157 | 2,062 | **4** | **0** |

Inside closed fields, a one-segment difference (ʻokina, length or a consonant) almost never
separates two terms. When it does, the difference does not recur.

The exception is the closed plural-by-length series (§3.5): 11 pairs, 7 of them kin or age terms.
It is not a field-internal opposition between terms but a grammatical number contrast on each
term.

---

## 10. Summary of series

"P coverage" counts the member forms present in POLLEX, which gives P&E spelling and gloss
(`coverage.py`, `series_coverage.tsv`).

| series | type | size | regularity | attestation | P coverage | sensitivity |
|---|---|---|---|---|---|---|
| Kin GEN × SEX | B, proportional, equipollent SEX × gradual GEN | 4 × 2 = 8 cells | 6/8 transparent, 1 reduced allomorph, 1 suppletive (99% of tokens) | C 8/8; A 5 headwords; W 4 | slot fillers 6/6; whole cells 1/8 | low |
| Sibling quadrant | A, privative with neutralisation | 4 (+ kaikoʻeke) | suppletive stems under constant kai- | W 9/9, A 8/9, C 6/9 | 5/9 (bare stems in P) | low |
| Kin plural by length | phonological, proportional | 7 kin/age of 11 | 100% (defined by W gloss) | W 7, C 4 | 3/7 | low (ʻaumākua: high) |
| a/o possession × GEN | grammatical agreement | 19 kin nouns | ≥80% (0–20% a vs 86–96% a) | C | — | low |
| Axis poles (6 axes) | A, equipollent bilateral, multilateral across axes | 12 terms (+ waena) | suppletive | W 9/12 non-locatives | locatives 12/13; directional terms 8/12 | low |
| PREP × LOC | B | 5 × 13 = 65 cells (40 core) | compositional | C 44/65 (28/40) | 12/13 locatives, 5/5 preps | low |
| mua : hope polysemy | C, bilateral proportional on content | 4 domains | both poles in all 4 | W, P, C | 2/2 | low |
| PLACE × compass, intercardinals | B (calque) | 48 places; 2 × 2 | compositional | C | — | low |
| NUM × traditional unit | B, arithmetic; units gradual & suppletive | 9 × 6 | compositional | grammars + 19th-c. texts; C ≈0 | units 6/8 | low (homographs) |
| Digit frames (kana-, ʻumi kūmā-, ʻe-, ʻa-, hapa-, pā-, Pōʻa-, kau-) | B, arithmetic | 8 frames × up to 9 digits | compositional | W 45 cells | 0 for kana-, hapa-, pā-, Pōʻa- (innovations); kau- 2/2 (PCE \*tau-rua "double canoe", PPN \*tau-tasa) | low |
| Moon PHASE × ORDINAL | B, inherited | 17 of 30 nights (4 × ≤4) | regular; 1 pseudo-member (Kulua 17) | P, A 13, C (one list) | phases 4/4 | moderate (deities, kapu) |
| Colour root : RR | expression proportional, content weakly constant | ~7 | RR = colour adjective; roots homographic | W 7/7, C 7/7 | terms 1/7; roots 6/7 | low–moderate |
| Colour terms among themselves | multilateral equipollent | ~12 core | — | W | — | low |
| Limb PART × LIMB | B | 4 × 2 | 100% within the 4 | A; C 3 tokens | parts 4/6 | low (but the field around it is sensitive) |
| Body-part extensions | C, radial polysemy | 24/31 terms | direction regular, mapping idiosyncratic | W, P | 7/7 for land-sense terms | moderate–high |

---

## 11. Non-significant oppositions at this level (distinctive or variant, no systematic meaning)

- **Phonemic minimal pairs between field terms:** 4 in 2,062 pairs, none systematic (§9).
- **Spaced vs fused spelling of frames:** *ma luna* / *maluna*, *makua kāne* / *makuakāne*,
  *kū kahi* / *kūkahi*.
  - No content difference.
  - Measured: 8.8% of PREP + LOC tokens in C are fused. *makuakāne* outnumbers *makua kāne*
    105 : 18.
- **Allomorphs of "female":** *wahine* ~ *-hine* (*makuahine*, *kupunahine* 3 vs *kupuna
  wahine* 12). The difference is conditioned by lexicalisation, not by meaning.
- **Bare vs prefixed sibling stems:** *kuaʻana* ~ *kaikuaʻana*, *kunāne* ~ *kaikunāne*. Wiktionary
  calls the bare forms "term of address". This is a register difference, not a field feature.
- **Synonyms and near-synonyms:**
  - *hope* ~ *muli* (after, behind, younger)
  - *melemele* ~ *lenalena* (yellow)
  - *uliuli* ~ *ʻeleʻele* (overlap on black)
  - *kanahā* ~ *kaʻau* ~ *ʻiako* (40). These differ only in the class of object counted:
    general, fish, tapa/canoes. That is a collocational (classifier-like) difference, not a
    referential one.
- **Island and source variation** in moon-night and month names and sequences.
- **Pseudo-members:** *Kulua* (night 17) beside *Kūlua* (night 4); *kaulua* "double canoe" /
  month / Sirius; *makai* "seaward" / "policeman". The shapes coincide, the content does not.

---

## 12. Frame assessment (options only, not proposals)

**Which series could act as a two-slot (or n-slot) frame where commuting one sign is meaningful?**
Structurally, the type-B frames. For each, a short reading:

- **PREP × LOC** (*i luna*, *mai lalo*, *ma loko*, *no waho* …):
  - Size: about 40 core phrases, 28 attested in modern text, all compositional.
  - Commuting the preposition changes the relation; commuting the locative changes the place.
  - A line between two blocks showing *luna* states a truth: both phrases are about "above".
  - Low sensitivity, inherited vocabulary (P 12/13).
  - Weaknesses: it is a phrase, written as two words, except the fused *mauka*/*makai*. It is
    abstract, small, and repeats few blocks. *makai* also means "policeman".
- **Kin GEN × SEX** (*kupuna kāne* → *kupuna wahine* → *makuahine* …):
  - A 4 × 2 board. Every move changes exactly one feature, and the content reads instantly.
  - One cell is the famous gap (*kaikamahine*, not *keiki wahine*), and one is fused
    (*makuahine*).
  - Too small for a Jukugo-sized board on its own. It could sit inside a wider kinship set with
    the sibling quadrant, whose moves are one-feature but swap a whole stem.
- **Moon PHASE × ORDINAL**:
  - 17 cells, inherited, attested in P&E and Andrews. The moves read as "next night" and "same
    night of another phase".
  - Deity names and kapu nights call for the owner's judgement and probably community review.
- **Traditional NUM × UNIT and the digit frames** (*ʻekolu kāuna* = 12; *hapa-kolu* = ⅓;
  *Pōʻa-lima* = Friday):
  - The most regular series, but the meaning change is arithmetic.
  - The traditional units are homographs of common words (*lau* leaf, *lehu* ash) and are
    essentially absent from modern text.
- **Limb PART × LIMB** (*manamana lima* / *manamana wāwae* …):
  - A clean 4 × 2 homology, but tiny and attested mainly in a 1922 dictionary.
  - It sits next to sensitive body vocabulary.
- **Kinds of piece these support** (options only):
  - A small **grid** piece, where each block is a whole word and one slot is the "feature" axis.
    This is closer to a combination lock than to Jukugo's open network.
  - A **phrase** piece in which the stones are two words (preposition + place, kin noun + sex),
    not two roots of one word.

The type-A fields (axis poles, sibling terms, colours) support **word-level substitutions**: one
block carries a whole word, and turning it swaps it for its opposite. The type-C networks
(body → land, mua/hope) carry meaning but give no commutable expression difference.

---

## 13. Open doubts

- **Modern spelling of the phrasal cells.** Spaced vs fused and ʻokina are unverified against
  Pukui & Elbert for: kupuna kāne / kupuna wahine, keiki kāne, the moon-night names (*Kūkahi* vs
  *Kū kahi*), manamana lima, kuʻekuʻe wāwae, poho lima. I did not consult P&E.
- **Genre bias in C.** Hawaiian Wikipedia is encyclopedic. Counts for *uka*/*kai*, motion verbs,
  the traditional count and possessive a/o are low or skewed. A narrative corpus (nūpepa,
  moʻolelo) would change the absolute numbers. Shionoya's examples suggest the NUM4 units are
  common there.
- **Unchecked facts:**
  - The uka : kai :: luna : lalo alignment of motion verbs is described (Malo, Alexander) but not
    measured. The counts are ≤ 2.
  - The sexes of cross-sex siblings-in-law, and whether *kāne*/*wahine* marking extends to
    animals, are unverified.
  - The Berlin–Kay stage of the colour system is unverified; I found no peer-reviewed source.
  - The night sequence across islands, and how Andrews' day numbers align with PVS night numbers,
    are not reconciled.
  - *nalowale* as 4,000,000 is disputed by Andrews–Parker.
- **Coding.** The coding of body-part extensions is mine, from W and P glosses. A second coder
  could split domains differently. The counts are indicative.
- **Untested literature.** Handy & Pukui, *The Polynesian Family System in Kaʻū* (1958), is cited
  only through descriptions. Its finer distinctions (e.g., *hiapo* "first-born", *pōkiʻi*) were not
  tested.

---

## 14. Sources

- Alexander, W. D. *A Short Synopsis of the Most Essential Points in Hawaiian Grammar.* Honolulu:
  Thrum, 1920 (1864). https://archive.org/details/shortsynopsisofm00alexrich (§29–32 numerals; §55
  locatives; §58 derivation of *komohana*).
- Andrews, L. *Grammar of the Hawaiian Language.* Honolulu, 1854.
  https://archive.org/details/cu31924026915888 (§116 ancient numeration table).
- Andrews, L., rev. H. H. Parker. *A Dictionary of the Hawaiian Language.* 1922. Local OCR
  `.cache/andrews-parker1922.txt`.
- Malo, D. *Hawaiian Antiquities (Moolelo Hawaii)*, tr. N. B. Emerson. Honolulu, 1903.
  https://archive.org/details/hawaiianantiquit00malouoft (chapters on the points of the compass
  and the divisions of the land).
- Shionoya, T. 2010. "Hawaiian Traditional Numerals Denoting Four and Multiples of Four." *Hokkaido
  Gengo Bunka Kenkyū* 8: 73–83. http://hdl.handle.net/10258/701. Cites Elbert & Pukui, *Hawaiian
  Grammar* (1979) pp. 158–162, and Beckwith, *Kepelino's Traditions of Hawaii* (1932) p. 113.
- Kanepuu, J. H. "Ka Helu Hawaii." *Ke Au Okoa*, 21 Jan 1867, via Bishop Museum Nūpepa blog.
  https://blog.bishopmuseum.org/nupepa/j-h-kanepuu-on-traditional-counting/
- Polynesian Voyaging Society. "Hawaiian Lunar Month."
  https://learningcenter.hokulea.com/education-at-sea/polynesian-navigation/polynesian-non-instrument-wayfinding/hawaiian-lunar-month/
- Thompson, N. "The Star Compass." Polynesian Voyaging Society.
  https://worldwidevoyage.hokulea.com/?p=12241
- Wikipedia, "Hawaiian kinship" (Morgan 1871). https://en.wikipedia.org/wiki/Hawaiian_kinship
- Wikipedia, "Hawaiian grammar" (a/o possession; directionals).
  https://en.wikipedia.org/wiki/Hawaiian_grammar
- POLLEX-Online (Greenhill & Clark 2011), Hawaiian reflexes, mostly from Pukui & Elbert 1986.
  PN \*qusi: https://pollex.eva.mpg.de/entry/qusi/
- Wiktionary via kaikki.org (CC BY-SA). Hawaiian Wikipedia dump (dumps.wikimedia.org).
- Sibling studies in this workflow: `../phonology/NOTES.md` (minimal pairs; plural by
  lengthening; possessive, pronoun and deictic grids); `../derivation-reduplication/NOTES.md`.

## 15. Files

| file | purpose |
|---|---|
| `scripts/lex.py` | lookup helpers for W, P, A and C; builds `tables/hawwiki_tokens.pkl` |
| `scripts/kinship.py` | matrix, GEN × SEX frame, kai- paradigm, a/o counts → `kinship_*.tsv`, `kinship_report.txt` |
| `scripts/space.py` | axis terms, PREP × LOC, motion verbs, compass frame, mua/hope → `space_*.tsv`, `space_report.txt` |
| `scripts/andrews_corpus.py` | motion verb × locative in old texts → `space_verb_loc_oldtext.tsv`, `space_oldtext_report.txt` |
| `scripts/numbers_time.py` | NUM4 units, digit frames, moon frame, time pairs → `num4_units.tsv`, `num_frames.tsv`, `numbers_time_report.txt` |
| `scripts/colour.py` | colour headwords, RR analysis → `colour_terms.tsv`, `colour_report.txt` |
| `scripts/body.py` | extension coding, limb frame, kua-/wao- → `body_*.tsv`, `body_report.txt` |
| `scripts/field_minpairs.py` | minimal pairs inside fields; plural by length → `field_minpairs.txt` |
| `scripts/coverage.py` | per-series W/P/A/C coverage → `series_coverage.tsv` |
| `src/` | downloaded public-domain grammars (Alexander 1920, Andrews 1854, Malo 1903), Shionoya 2010 PDF and text, KSBE cardinal-points PDF (not relied on: its right/left account is inconsistent) |
