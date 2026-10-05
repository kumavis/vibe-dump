# Pōhaku Tumble — design

A Hawaiian cut of [Jukugo Tumble](../jukugo-tumble). The same machine: a field of
two-block words, one block at a time tumbling over so the word becomes another
word, with lines re-wiring between blocks that share something. Everything that
machine sits on changes:

| Jukugo Tumble | Pōhaku Tumble |
| --- | --- |
| white blocks | stones cut from basalt, letters pecked into them |
| kanji, one per block | Hawaiian roots (recommended) or syllables, one per block — see §2 |
| a white technical drafting sheet with eight diagrams | a hand-drawn map of an island divided into ahupuaʻa, with eight places on it |
| kana + romaji reading on the card | the root glosses, the Proto-Polynesian ancestor, cognates across Polynesia |

**Tone.** Warm, but stoic, and shown rather than said. Nothing on the page
claims respect for anything. The respect is in what is drawn correctly and in
what is left out: the spelling, the order of the star compass houses, the ahu
standing where each boundary crosses the trail, the summit left unmarked. If
someone who knows this material looks closely, they should find nothing careless.
If someone who doesn't looks, they should simply find it beautiful.

Status: **built** with option B (§2), which the owner chose. The rest of this
document is the design as written. What the build decided where the design left
a choice open, and where it departs from the design, is in
[`BUILD-NOTES.md`](./BUILD-NOTES.md). Research material is in
[`research/`](./research). Whether option B (§2) has enough words is measured in
[`research/ROOTS.md`](./research/ROOTS.md).
Every Hawaiian term on the map and compass is checked in
[`research/TERMS.md`](./research/TERMS.md).

---

## 1. What carries over unchanged

The Jukugo Tumble architecture is right and stays:

- `Board` (layout, dealing, `chooseTurn` weighting toward ~half the words linked,
  MST links per shared unit, field links for the unlinked) — with one fix: the
  deal's pick loop has no exit, and hangs the page if fewer words can turn five
  ways than there are pairs. It needs a guard, or a board sized from the list,
- the `turns`/`degree`/shared-unit lookups, keyed by root *sense* rather than
  spelling under option B (§2),
- `Director` (background pulse + slower beat for noted words, capacity by width),
- `LinkStore` (octilinear routes, draw-on/let-go animation, ports),
- `Notes` (screen-space cards, corner placement with hysteresis, scramble text,
  fixed heights so cards don't jump),
- `Scene3D` (orthographic camera, floor affine shared with the 2D canvases, the
  quarter-roll forward that leaves the previous unit as a ghost on the front face),
- the canvas stack (floor canvas under GL, HUD canvas over it), the 1200 ms / DPR 2
  thumbnail contract, `?slow=` and `?seed=`.

Changed: data, the floor painter, the block material and glyphs, the card
template, the chrome, the palette, the fonts. One structural change: **all words
run left to right.** Jukugo had ~30% vertical words because Japanese is written
top-to-bottom; Hawaiian is not, so `layoutPairs` drops the `'v'` direction.

---

## 2. The unit on a block — the main open decision

A jukugo is two meaningful characters fused into a word (火 fire + 山 mountain =
火山 volcano). Three ways to carry that into Hawaiian:

### A. One syllable per block, two-syllable words — *where this started*

Each block is one mora: an optional consonant (h k l m n p w ʻ) plus a vowel
(a e i o u ā ē ī ō ū). Words are two morae: MA·KA *eye* → MA·NA *power* → MA·LU *shelter*.

- **For:** plenty of data (563 candidates from Wiktionary in
  `research/two-mora-candidates.json`); every turn lands on a real word; the
  inventory is small (~90 units) and teaches the orthography by behaviour — MA,
  MĀ and ʻA are different stones and never link to each other.
- **Against:** words are short (2–4 letters). Syllables carry no meaning, so the
  two things that made Jukugo *mean* something go hollow: a line between two
  stones only says "both contain KA", and the card's parts row (火 fire, 山
  mountain) has nothing to say. ~90 units over ~130 blocks also means links
  everywhere.

### B. One root per block, two-root compounds — **recommended**

Each block is a root (a morpheme of 1–3 morae). Words are compounds of two roots,
written as Pukui & Elbert write them — one word (*waimaka*) or two (*hale pule*):

- WAI·MAKA *tears* (water + eye) → WAI·Ū *milk* (water + breast) → WAI·WAI *rich*
- KAHA·KAI *beach* → KAHA·WAI *stream* → KAHA·ONE *sandy beach*
- NAʻAU·AO *enlightened* ("daylight gut") ↔ NAʻAU·PŌ *ignorant* ("night gut")
- ʻAUINA·LĀ *afternoon* (the sun declining) ↔ ʻAUINA·PŌ *late night* (the night declining)
- KINO·PAʻA *solid* ↔ KINO·WAI *liquid* ↔ KINO·EA *gas* (body + firm / water / air)
- ALA·LOA *highway* (long road) → ALA·NUI *road, street*; MOKU·PUNI *island* → MOKU·ʻĀINA *island; district*

This is the true analogue of a jukugo, and it fixes A's two problems at once:

- a shared-root line means something (two words that both hold *wai*, water);
- the card's parts row comes back (WAI water · MAKA eye), and the turned root is
  the one that's highlighted, exactly as in Jukugo;
- the tumble itself carries meaning — one stone turning *ao* to *pō* turns
  wisdom into ignorance;
- words are 5–9 letters, answering "too short".

**Data — measured.** The full study is in [`research/ROOTS.md`](./research/ROOTS.md).
Wiktionary analyses 144 single words as root + root. Andrews' dictionary,
revised by Parker (1922), attests about 930 more. After the exclusion screen
(§4.3) and dropping prefix-built words, two groups are left:

- **128 attested:** in Wiktionary, or in Andrews–Parker with a modern spelling
  Wiktionary confirms.
- **777 Andrews-only:** spelling pieced together from the roots, so the ʻokina,
  kahakō and word break are unconfirmed.

**Connectivity decides it.**

- The deal draws its opening words from those that can turn at least five ways
  (`degree(e) >= 5` in `board.js`; three only for a word picked to match a
  neighbour), one per pair. The attested 128 have 21 such words, so they cannot
  deal a full board.
- Run on Jukugo's real `Board`:
  - ~900 confirmed compounds gives a board almost as lively as Jukugo's (3% of
    turns stall, 12% repeat a recent word);
  - ~600 is livable (8% / 18%);
  - under ~400 is not worth it.
- So option B stands or falls on a person checking the Andrews candidates
  against Pukui & Elbert. wehewehe.org refuses automated access. The worksheet
  is [`research/roots/compounds.tsv`](./research/roots/compounds.tsv).

The measurements changed three things in the first draft of this section:

- **Two-word compounds are in from the start.** Modern spelling splits many
  compounds older writing joined (*hale pule*, *makua kāne*, *kiʻi pōhaku*),
  and each is still two roots on two stones.
- ***hoʻo-* is not a root.** As a stone it deals easily, but it ties 90% of the
  board together with lines that only mean "both causative". The same goes for
  pā-, kā-, pō-, haʻa- and the other prefixes, wherever they are prefixes rather
  than roots (*pō* night, *pā* enclosure).
- **A stone is a root in sense, not in spelling.**
  - 126 of the 476 roots have unrelated homographs: *lua* is "two" and "pit",
    *ao* "daylight" and "cloud".
  - Two stones link, and a stone stays put through a turn, only when they are
    the same root.
  - This costs little: five-turn words go from 706 to 669.
  - It means the data has to record which sense each compound uses
    (`lua¹`, `lua²`), which the parts row needs anyway.

**Geometry.** Roots differ in length (Ū … KANAKA). The roll is about the X axis,
so a block's width never enters the roll: stones become slabs `1.5 × 1 × 1`
instead of cubes, one width for all, wide enough for a 4–5 letter root at a good
size. Longer roots are set slightly condensed rather than smaller. Horizontal
pairs are `1.5 + gap + 1.5 ≈ 3.1` wide, inside the 4.67-unit column.

The reviewed two-mora list from A feeds B's **root glossary** — most Hawaiian
roots are one or two morae. But B also needs one-syllable roots (*lā*, *pō*, *ū*)
and longer ones (*ʻāina*, *naʻau*, *ʻauina*). [`research/roots/roots.tsv`](./research/roots/roots.tsv)
lists the 476 the candidates use.

### C. One phoneme per block, longer words

Each stone is one letter (13 letters + 5 long vowels = 18 units); words are 3–6
stones. A tumble changes one phoneme: maka → make → … With 18 units, "shares a
unit" links everything to everything, so links would have to be redefined as
*one tumble apart* (a word ladder drawn on the floor). Interesting, but it
abandons Jukugo's grammar (pairs, shared characters, parts) rather than
translating it, and variable-length rows complicate layout, dealing and picking.
Not recommended; noted as the most literal reading of "phonemes".

---

## 3. The floor — an island divided into ahupuaʻa

The white sheet becomes a map, drawn in ink on warm paper, printed on the floor
plane so the stones sit on it and their shadows fall across its lines.

### 3.1 A real island, or a made one?

**Recommended: a made island, generated from the physics of the real ones, and
named only with words that belong to every island.** Reasons: an ahupuaʻa
boundary is a fact about a real place; drawing real boundaries at this scale,
half under stones and drifting past, risks getting them wrong and treats named
land as backdrop. A made island invents no place names. It uses only generic
terms that occur on many islands: **Koʻolau** (windward) on the northeast coast,
**Kona** (leeward) on the southwest, *mauka* and *makai*.

The alternative (a real island from the State of Hawaiʻi Office of Planning GIS
ahupuaʻa layer, reachable from here at `geodata.hawaii.gov`) is the most
"homework done" option and stays open — but it needs its licence and attribution
checked, and a fluent reader to check every name. See §10.

### 3.2 Geography (generated once, deterministic from `seed`)

- **Shield.** One main summit slightly off-centre and a lower, older shoulder,
  so the island isn't a cone. Height = sum of two shields − radial valley
  erosion + low-frequency noise.
- **Valleys.** Radial valleys cut from mid-slope to the sea. Windward (NE)
  valleys are more numerous, deeper and wetter; the leeward (SW) side is drier,
  broad *kula* slope with fewer, shallower gulches. The coast indents where
  valleys meet the sea.
- **Ahupuaʻa.** Boundaries run along the ridges *between* valleys, from the
  summit ridge down to the shore, and continue out to the reef — each ahupuaʻa
  is a watershed with its own stream, from forest to fishing grounds. ~20–26 of
  them, grouped into two moku (Koʻolau, Kona) whose boundary is drawn heavier.
  Ahupuaʻa are left unnamed.
- **Ala loa.** A dotted trail circles the island just inland of the shore.
  Where each ahupuaʻa boundary crosses it, an **ahu** — a small stacked-stone
  cairn — is drawn. Unlabelled. (The cairn is what the ahupuaʻa is named for.)
- **Streams.** One per ahupuaʻa, down the valley floor to a stream mouth.
- **Reef.** A dotted fringing reef offshore on parts of the coast, with surf
  marks where swell breaks on it.
- **The upland.** Above the forest people use (*wao kanaka*) lies *wao akua*,
  the forest belt that belongs to the gods, and above it the summit zones. All
  of it is drawn with contours and nothing else. No symbol, no label, no stone
  caption reaches into it. It is left alone. (*Wao akua* is a forest zone, not
  the bare summit — [TERMS.md](./research/TERMS.md#wao-akua).)

### 3.3 Drawing it

The conventions of a careful 19th-century survey sheet, nothing technical:
elevation contours (fine, warm grey; every fifth heavier); *waterlining*: 6–8 lines
following the coast offshore, spaced wider and fainter outward; land labels in
spaced roman capitals; water features in italic.

Performance: all static geometry (coast, contours, waterlines, boundaries,
trail, streams) is built once as world-space `Path2D`s. Each frame it is
re-projected with `new Path2D().addPath(world, DOMMatrix(floorAffine × dpr))` and
stroked under the plain screen transform, which keeps Jukugo's trick of
hairlines that stay one pixel wide under the oblique floor transform without
rebuilding paths each frame.

Opening: the coast draws itself first, then waterlines and contours fade up,
then the boundaries run down from the summit to the sea, then the stones fall.

### 3.4 Swell and stars

- **Swell.** Long, faint, dashed crests come in from the northeast (the trade
  swell, from the Koʻolau quarter), bend around the island and fade in its lee.
  They advance very slowly. This is the sea as a wayfinder reads it.
- **Star compass.** In open water off one corner, a star compass ring: 32 houses
  of 11.25°, the cardinal names, and the house names around the rim in small
  caps. One star rises in a house on the east side and travels a faint arc to
  set in the house **of the same name** on the west side, over about a minute.
  That rule is the compass's central idea, and it is shown, not captioned.
  Names, confirmed against the Polynesian Voyaging Society's material
  ([TERMS.md](./research/TERMS.md) has all 32 houses with bearings):
  - **cardinals:** **ʻĀkau** (N), **Hikina** (E), **Hema** (S), **Komohana**
    (W). These are houses too: 4 × 7 + 4 = 32.
  - **houses, from each east/west point toward north or south:** **Lā, ʻĀina,
    Noio, Manu, Nālani, Nā Leo, Haka**.
    - *Nālani* is one word in every PVS source; *Nā Leo* is two.
    - The order is mirrored, not rotated, between quadrants: Lā always sits
      next to Hikina or Komohana, Haka next to ʻĀkau or Hema.
  - **quadrants:** **Koʻolau** (NE), **Malanai** (SE), **Kona** (SW),
    **Hoʻolua** (NW). Malanai and Hoʻolua are wind names that PVS gave to
    quadrants, so don't caption them as winds from those directions.
  - The house names are Nainoa Thompson's (PVS), not ancient. The compass
    carries a small credit line to PVS / Nainoa Thompson.

  Map north is away from the viewer, so the compass and the island agree: the
  swell comes from the compass's Koʻolau quarter onto the island's Koʻolau
  coast.

Every Hawaiian term used on the map — *ala loa*, *ahu*, *kuapā*, *mākāhā*,
*ʻauwai*, *loʻi kalo*, *kauhale*, *hālau waʻa*, *wao akua*, the lava types — has
been checked in [TERMS.md](./research/TERMS.md). All are confirmed in the
spellings used here.

- *Ala loa*, as the trail around an island, is the National Park Service's
  usage; dictionaries have *alaloa*, "highway".
- *Kula* is the open, dry country between the shore and the forest, not
  upland.
- Pukui & Elbert itself was not read (wehewehe.org refuses automated access).
  So these terms still go past the fluent reader with the word list.

### 3.5 The eight fields as places on the map

Jukugo printed eight abstract diagrams, one per semantic field, and an unlinked
word ran a dashed line to its field's diagram. Here each field is a place:

| field | covers | drawn as | quiet motion |
| --- | --- | --- | --- |
| **lani** · sky | sky, weather, light, stars, birds | the star compass, at sea | the rising/setting star |
| **kai** · sea | ocean, reef, fish, shore | a **loko iʻa** (fishpond): a curved stone wall (*kuapā*) on a sheltered shore with sluice gates (*mākāhā*) | rings inside the pond |
| **ʻāina** · land | stone, lava, mountains, cliffs, fresh water | a recent lava flow down one flank to the sea: smooth *pāhoehoe* lobes with rope lines, stippled *ʻaʻā* | none |
| **ulu** · growth | plants, crops, food | **loʻi kalo** terraces stepping down a windward valley, fed by an *ʻauwai* off the stream and draining back into it | water moving along the ʻauwai |
| **kanaka** · people | people, kin, the body | a **kauhale**: a few house platforms and thatched hale near the shore | none |
| **hana** · craft | work, tools, canoes, houses, cloth | a **hālau waʻa** (canoe house) with a double-hulled canoe drawn in plan on the sand before it | none |
| **naʻau** · mind | thought, feeling, voice, song, spirit, values | the **cloud cap** over the summit: a band of fine hatching around (not inside) the unmarked upland | the cloud band drifting |
| **hele** · motion | going, turning, time, number | the largest **stream**, summit to sea, with its mouth | flow dashes running downstream |

Field labels on the floor: the Hawaiian word large and pale in the italic, with a
small caps line beneath, `KAI · SEA — 03`, the count of words currently linked to it
(the Jukugo idiom). `featureAnchor` gains a polyline case so field lines can land
on the stream and the lava front, not only on circles and rectangles.

---

## 4. The words — source, review, and what is never shown

### 4.1 Source

The authority is Pukui & Elbert's *Hawaiian Dictionary* (University of Hawaiʻi
Press), with *Māmaka Kaiao* for modern coinages. Both are online at
wehewehe.org, which answers automated requests with a Cloudflare bot challenge.
So they are checked by a person, not by tools — see
[`research/ROOTS.md`](./research/ROOTS.md#the-pukui--elbert-check). What tools
can reach:

- Wiktionary's Hawaiian entries (crowd-edited, secondary);
- Andrews' dictionary as revised by Parker (1922, public domain), which
  attests words and their parts but writes no ʻokina or kahakō;
- POLLEX-Online for Proto-Polynesian etyma;
- Hawaiian Wikipedia, to see whether a spelling is in use.

For option A, `research/fetch-lemmas.py` pulls *Category:Hawaiian
lemmas* (3,089 pages); `research/fetch-definitions.py` keeps the two-mora words
and boils each page down to senses, Proto-Polynesian etymon (281 have one) and
cognates (287 have some — Māori, Sāmoan, Tahitian, Tongan, Rapa Nui…). Four words meant to be
added by hand (ʻalā basalt, koʻi adze, moi threadfin, lāʻī ti leaf) never made it
into the file. None is in Wiktionary, and Andrews–Parker attests all four. Option
B's candidates come from Wiktionary's root + root analyses and Andrews–Parker's
bracketed etymologies (`research/roots/`).

### 4.2 Review

Every word passes through three reads before it can appear:

1. **curate** — include/exclude, choose the gloss and up to three other senses,
   assign the field;
2. **source fidelity** — every sense shown must be in the source; no borrowed
   senses; spelling exactly as the headword;
3. **cultural sensitivity** — read as a kumu would: drop, reword, or restore.

A first pass of these over the 563 two-mora candidates was started but its
output never landed in `research/`. For option B, the Pukui & Elbert check of
`research/roots/compounds.tsv` comes first: the three reads only make sense on
words that are confirmed to exist as spelled. Then, before the app is marked
`done` in the gallery, **the list is read by a fluent speaker.**
Until that has happened the package stays `"status": "wip"`.

### 4.3 Exclusion rules

A word never appears if:

- the sense shown would be a borrowing (kope, pepa, hipa). A word with a native
  sense too (kula: *plain, open country* vs *school*) may stay, showing only the
  native sense;
- **any** of its senses is a slur, sexual, genital, or excretory — the whole
  word goes, even if other senses are innocent, because a reader may know the
  other sense;
- it is grammatical (articles, pronouns, demonstratives, particles,
  interjections);
- it is mainly a proper name — a deity, person or place. A common noun that
  shares a deity's name (*pele*, lava) is fine as the common noun. **Open:** star
  names (Hōkūpaʻa, Hōkūloa) are proper names but are the substance of
  navigation; proposed to allow star names and nothing else;
- it belongs to sorcery or death-prayer;
- its only gloss would teach nothing.

### 4.4 Orthography

- ʻokina is always **U+02BB** (ʻ), never an apostrophe or a left quote.
  `verify`-style check in the package: fail the build on `'`, `‘`, `’` or `ʼ`
  (U+02BC) inside the word data.
- kahakō vowels are precomposed (ā ē ī ō ū, NFC).
- Long and short vowels, and ʻokina vs none, are different units. MA, MĀ and ʻA
  are three different stones and never link.
- Stones are set in capitals (ʻĀINA); captions, cards and labels in lowercase as
  Hawaiian is written.

### 4.5 Data format

Same shape as Jukugo's `words.js`, one per line, a `·` marking the block split:

```
wai·maka  noun  tears  |  n  |  ʻāina
```

plus a root glossary (`roots.js`, the successor of `kanji.js`):

```
wai   water            *wai     Māori wai · Tahitian vai · Sāmoan vai
maka  eye; face; bud   *mata    Māori mata · Tahitian mata
```

A spelling with unrelated homographs gets one glossary line per root, and the
word list names which one it uses, so two stones only link when they are the
same root:

```
lua¹  two              *rua     Māori rua · Sāmoan lua
lua²  pit, hole        *lua     Māori rua
luapō  noun  the grave  |  lua²·pō  |  ʻāina
```

Attribution: Wiktionary text is CC BY-SA. Glosses are short paraphrases, but the
package still carries a `SOURCES.md` crediting Wiktionary and Pukui & Elbert, and
the page carries one quiet line in the stats footer.

---

## 5. The stones

- **Form.** Slabs of basalt, squared but hand-cut: `RoundedBoxGeometry` with a
  small bevel, vertices displaced by low-amplitude 3D noise. Six variants, so
  neighbours don't match.
- **Material.** `MeshStandardMaterial` extended in `onBeforeCompile`, everything
  computed in the block's *object* space so the texture rolls with the stone:
  dark warm grey with slow tonal variation; **vesicles** (gas bubbles, a Worley
  threshold) as small dark pits with a faint rim; rare **olivine** flecks, tiny
  olive-green glints, as Hawaiian basalt has; roughness ~0.9 with a bump term.
  One cloned material per stone with its own seed uniform (same program, so no
  extra compile cost).
- **Letters.** Not printed: **pecked**, the way kiʻi pōhaku are made — lighter
  grey where the dark skin has been broken, with a stipple of peck marks inside
  the letterform and a thin inner shadow on the side away from the light. The
  sun moves lower than in Jukugo (raking light) so the stone texture and the
  carving read. Petroglyph *figures* are not used anywhere — only the technique.
- **Turn.** As in Jukugo: the new root is pecked on the back face before the
  roll; the old one ends upright on the front face, dimmed, as a weathered ghost.
- **Shadows.** Warm brown, soft, on the paper.

---

## 6. Palette and type

| token | value | |
| --- | --- | --- |
| paper | `#e8dcc3` | warm, like beaten bark cloth or old survey paper |
| paper-2 | `#efe6d3` | card stock |
| ink | `#2a211b` | kukui-soot brown-black |
| ink-2 / ink-3 | `#5a4c40` / `#8d7d6c` | secondary text, contours |
| ochre | `#9c3f24` | ʻalaea red: ahupuaʻa boundaries, the moku line, the active field line |
| stone | `#33302c` → `#b3aca1` | basalt body → pecked letter |

No teal, no coral, no neon. One accent colour, used for boundaries only.

**Type.** Drop the mono and the Mincho: no "technical" face anywhere. Fonts must
carry the ʻokina and kahakō; `research/type-specimen.png` sets the candidates as
carved syllables. Jost and Fraunces are out (no U+02BB). Recommended: **Alegreya**
(regular, italic, semibold) for everything — warm, literary, with an italic
suited to water labels — with **Source Serif 4** as the fallback if Alegreya
reads too lively pecked into stone. Decide by looking at it carved under the
raking light. `tools/build-fonts.py` changes from "every CJK character in src/"
to "Latin + ʻ + kahakō vowels + whatever the word list uses".

---

## 7. Cards, captions, chrome

**Card** (same frame and behaviour as Jukugo's):

```
No. 042 ────────────── ʻĀINA · land
wai·maka                          ← large; the turned root flips
noun · tears
also  —                           ← up to three other senses
─────────────────────────────────
WAI water  *wai     MAKA eye  *mata   ← parts, with each root's Proto-Polynesian ancestor; turned root highlighted
Māori wai · Tahitian vai · Sāmoan vai ← cognates of the turned root, one line
was  waiū  milk
```

The Proto-Polynesian forms and cognates are the quiet carrier of the voyaging
history: the words themselves crossed the Pacific, and each card shows the
route without saying so.

**Floor caption** under each pair: the word in small caps (`WAIMAKA`) and the gloss
beneath, typed in after a turn as in Jukugo. **Shared-root marker**: the ring at
a link's midpoint becomes a small rounded capsule (roots are longer than one
glyph).

**Chrome.** Title plate: **Pōhaku Tumble**, and one plain sentence — "Two-root
words cut in stone. A stone turns over to another root, and the word turns into
another word." Legend: *shared root · field · note*. Stats: turns · links · words.
No sentence anywhere about culture, history, respect, or meaning.

---

## 8. What we leave out

Hibiscus, plumeria, tiki, surfboards, lei borders, palm silhouettes; teal/coral
tourist palettes; "aloha" as decoration; faux-Polynesian display fonts; kapa
patterns or petroglyph figures used as ornament; deity imagery, sacred chant
text, hula imagery; "ancient", "mystical", "sacred wisdom" copy; invented place
names or invented Hawaiian; an apostrophe standing in for an ʻokina; any word
spelled without its kahakō.

---

## 9. Plan

1. **Decide the unit** (§2) and the island question (§3.1).
2. **Lexicon.** If B:
   - a person checks `research/roots/compounds.tsv` against Pukui & Elbert,
     most connective rows first, recording spelling, one or two words, and the
     "Lit." reading;
   - go / no-go at about 600 confirmed core words (`research/ROOTS.md`);
   - then annotate each compound's root senses, run the three reads, and do the
     fluent-speaker read.

   If A: land the reviewed two-mora list, then the three reads and the
   fluent-speaker read.
3. **Scaffold** `packages/pohaku-tumble` from Jukugo (package.json with
   `gallery` metadata, `vite.config.js` re-export, horizontal-only layout,
   slab stones).
4. **Stones:** basalt shader, chipped variants, pecked letters, raking light.
5. **Map:** island generator, contours and waterlining, ahupuaʻa and moku,
   ala loa and ahu, streams and reef, the eight places, compass, swell, reveal.
6. **Cards, captions, chrome.**
7. **Fonts** (re-subset), `SOURCES.md`, thumbnail (`waitFor: body.ready`,
   settle long enough for the map reveal), `npm run build`, `npm run verify`,
   commit `dist/`.

Each step is checked by eye with Playwright screenshots at the gallery's
1280×800, DPR 2, and at 390×844.

---

## 10. Open questions

1. **Unit:** root pairs (B) or syllable pairs (A)?
   - B is still the better piece.
   - Its data does not exist yet in confirmed form: 128 attested compounds
     against the ~600 a livable board needs (`research/ROOTS.md`).
   - So B means committing to the Pukui & Elbert check first. A can start now.
2. **Island:** made (recommended) or real (State GIS ahupuaʻa layer)?
3. **Star names** as the one allowed class of proper noun?
4. **Name:** *Pōhaku Tumble* (slug `pohaku-tumble`)? *huaʻōlelo* ("word" —
   confirmed on Wiktionary) is the natural parallel to 熟語 for the Hawaiian on
   the title plate.
5. **Fluent reader:** who reviews the word list before it ships as `done`?
6. **The Pukui & Elbert check:** who does it? Or do we ask Ulukau / Hale
   Kuamoʻo (UH Hilo) for permission or a data export for a non-commercial piece
   that credits the dictionary?
7. **Which compounds count?**
   - two-word compounds (recommended: yes);
   - reduplications like *waiwai*;
   - opaque compounds whose parts don't add up to the meaning (*kūlolo*): drop
     them, or show them without the parts row;
   - modern coinages like *kinoea*: allowed, or marked as modern?
