# The Pukui & Elbert check

`SOURCES.md` says it plainly: the authority for Hawaiian spelling and sense is Pukui & Elbert's
*Hawaiian Dictionary* (1986), its online home refuses automated access, that was respected, and so
**370 of the 598 shipped words carry an open circle** — *awaiting dictionary check*.

This is that check. Every one of the 370 was looked up, one at a time, plus a spot check of the 228
that were already clear. It was done by **LEILANI**, the ʻŌlelo Hawaiʻi reviewer of Shaka
Leikaumaka's Taurus ʻohana of agents, on 6 October 2026, as a gift back for building the piece the
honest way — with the not-knowing marked in the artwork itself.

Read it in this order:

| file | what |
| --- | --- |
| [`LETTER.md`](./LETTER.md) | her letter: what she found before what to fix, and the ten corrections that matter most |
| [`REVIEW.md`](./REVIEW.md) | the full worksheet — all 370 rows by field, then sections A–G |
| [`../pe-check.json`](../pe-check.json) | the same thing merge-ready, read by `build_words.py` |

## How it was read

`wehewehe.org` sits behind the same bot challenge `SOURCES.md` describes, so the lookups went
through **<https://wehe.hilo.hawaii.edu/>** (Wehe²wiki², University of Hawaiʻi at Hilo / Ulukau),
which serves the same corpus with per-entry attribution and was not challenged. Each word was
queried in up to six forms — as the list spells it, without diacritics, spaced, unspaced, and as
*root a* + *root b* — against thirteen dictionaries: Pukui & Elbert (1986), Māmaka Kaiao, Andrews
1836 and 1865, Parker 1922, Hitchcock, Judd/Pukui/Stokes, Kent, Place Names of Hawaiʻi, Hawaiʻi
Place Names, and Hawaiian Legal Land-Terms. Of the 370: **347 are in Pukui & Elbert**, 2 more in
Māmaka Kaiao, 19 in older dictionaries only, and 2 appear nowhere at all.

Every entry in `pe-check.json` carries its own `source` line — *PE s.v. kōkō* — so any one of them
can be re-checked without taking the result on trust.

**What this is not.** It is a dictionary check by a Hawaiian-language reviewer agent, not a kumu's
reading. `SOURCES.md`'s standing request for a fluent speaker still stands, and the last line of the
letter is hers, not a certificate.

## What it found

| verdict | count | |
| --- | ---: | --- |
| ✅ correct as glossed | **313** | 85% of the pending set |
| ✏️ needs a fix | **52** | 14% |
| ❓ could not confirm | **2** | |
| ❌ not an attested word, or the wrong word for the gloss | **3** | |

Separately, 129 of the 370 carry a spelling correction, and **106 of those are one pattern**:
Andrews (1865) and Parker (1922) ran compounds together — *halekaua*, *kiakolu*, *panipuka* — and
Pukui & Elbert separated them. The list was built from Andrews–Parker, consistently and with the
sources named, so it inherited their convention. Her framing, and it is the right one: that is a
date stamp, not a hundred mistakes. The glosses in that list are fine; only the spelling moves.

## What the build now does with it

`build_words.py` reads `../pe-check.json` after the curation, in about twenty lines:

- a word marked `confirmed` or `fix` **loses its circle** — 370 pending becomes 11;
- `fix` applies the corrected `spelling` and `gloss`, with the old gloss kept as `was` so the diff reads;
- `unattested` **never ships**: *hoakipa* and *heiheinalu* are gone (see below);
- `unconfirmed` **keeps its circle**: *hoalawaiʻa* and *lāhui kaua*, attested only in Andrews 1836,
  and *pekupeku*, which was never circled but whose gloss PE does not support;
- `stones` fills the **nineteen stones that were shipping an empty gloss** (the card read
  `holo =  + waʻa = canoe`), and respells one;
- an entry carrying a `ruling` applies **nothing but its gloss and keeps its circle** — see below.

Nothing was hand-edited in `src/data/`. `wordlist.tsv` gains a `pe_check` column.

Result: **596 words** (585 clear, 11 circled), 434 stones, 422 playable. `tools/sim.mjs` still
rates the board **jukugo-like** on desktop and on the phone, both ways round, and the deal check
passes on every cut-down list.

If you would rather the circle mean *read by a human kumu* rather than *checked against the
dictionary*, that is **one line** in `build_words.py` — the `ev` ternary — and everything else here
still lands.

## The two that no longer ship

- **`hoakipa`** "visitor" — in none of the thirteen dictionaries. Both roots are real (*hoa*,
  companion; *kipa*, to visit) and the formation is not ungrammatical, but it is not an attested
  word. The living word for visitor is *malihini*. If you want the stone back, *hoa hele*,
  *hoa kaua*, *hoa ʻōlelo* and *hoa hanauna* are all solid and all already on the board.
- **`heiheinalu`** "to race on surfboards" — also unattested, and it reads as *wave race*. The word
  for surfing is **`heʻe nalu`**, which belongs on a board like this anyway. That is the one
  addition she asked for, and it is left for you: it is a new word, not a correction.

A third ❌, **`hākō`** "sugar-cane leaf", stays — because the word is attested and it was the gloss
that was wrong. PE's `hā.kō` is *to carve out a pathway, as a passage through coral or as a water
course*, which on a wayfinding map is a better stone than the one it replaces. (The sugar-cane leaf
is `lau kō`, already on the board.)

## The eight calls left to the owner

These apply their gloss and keep their circle, because each would respell a stone that other words
share, or split a root:

| word | PE | why it waits |
| --- | --- | --- |
| `ʻahuao` | `ahu ʻao` | *ahu* (mat) + *ʻao* (young leaf), not *ʻahu* (garment) — and the ʻahu stone is shared with `ʻahu ʻula` |
| `ʻōpūhue` | `ōpūhue` | no opening ʻokina, and the root is *ōpū* (clump), not *ʻōpū* (belly) — shared with `ʻōpūao` |
| `aʻa koko` | `ʻaʻa koko` | the aʻa stone is shared with `aʻalele`, `aʻalolo`, `paʻiaʻa`, and she read *aʻalolo* as correct |
| `pakakahi` | `pākakahi` | the paka stone is shared with `pakapaka`, which she did not flag |
| `kūemi` | `kuemi` | `kūemi` with the kahakō is MK's modern *recessive*; the kū stone is shared by seventeen words |
| `kālāʻau` | `kālaʻau` | one kahakō fewer — though MK allows the shipped form as a variant, so this may be no error at all |
| `hāipu` | `hāʻipu` | *ipu* the gourd carries no ʻokina of its own: the ʻokina belongs to the compound, so no stone can hold it |
| `hoaaloha` | `hoaloha` | PE's headword drops a letter the two stones carry |

Four more are recorded in `pe-check.json`'s `notes` and change nothing: the root-parse readings of
`monakō` and of the *kau* in `kaukahi`/`kaulua`; the `pōuli`/`pouli` root headword, which ships only
inside `makapōuli` where PE writes *maka.pō.uli* anyway; and `makaʻala`, where `fixes.json`'s B10
reasoning and her reading of PE's *maka.ʻala* are both defensible — so the stone is left exactly as
it was.

Capitals are a decision you already made: PE capitalises *Hōkūao*, *Hōkūloa*, *Mahiʻai*, *Pōʻaono*
and *Hakamoa* (a constellation — literally chicken roost, so a star has been sitting in the kanaka
field), and DESIGN §4.4 writes common nouns lower case on a stone pair. Recorded, not changed.

## Five that look wrong and are right

`ʻonaʻona` · `akaaka` · `huʻihuʻi` · `auau` · `piopio` — and `papa ʻaina` with its short *a*, kept
clear of `ʻāina`, the land. Someone will come along and try to fix all of them. Please don't let
them. Section A of the worksheet says why, one by one.

## The cultural read

Section D of the worksheet, and her first line on it: **nothing on this board is desecration.** No
removals are asked for. The glosses that needed the culture rather than the dictionary are already
applied here — *makamaka* leads with the intimate friend, *moʻo kanaka* is a tax roll and not a
genealogy, *kuapaʻa*'s PE sense 1 is recorded, *moʻo lele* says *a Bible word*, and `leo paʻa` is
now *a person who cannot speak* instead of PE's 1986 English.

One request is not code, so it is left here: some of the words now tumbling — `ʻaumakua`,
`ʻai kapu`, `kahu akua`, `pahu kapu`, `wai ea`, `pī kai`, `kino wailua`, `hana mana`, `kumupaʻa` —
belong to religious practice, some of it living. One line in the colophon acknowledging that would
mean a visitor does not meet them only as a turning stone.

## And a gift for the compass

PE's entry for **`alaula`** — already on the board, *dawn light; sunset glow* — carries the line
***Ke alaula a Kāne***, the flaming path of Kāne, meaning the eastern sky.

Its exact partner is on the board too, in the ʻāina field: **`maʻawe ʻula`**, and PE gives
***Ke alanui maʻawe ʻula a Kanaloa***, the red track pathway of Kanaloa, meaning the western sky.

East and west. Both named as roads. On a wayfinding map made of stones, those two belong facing
each other.
