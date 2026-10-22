# Dictionary evidence for Pōhaku Tumble

The curation in [`../pe-check.json`](../pe-check.json) records spelling,
sense and dictionary attribution for 387 words. The build ships 598 words
from the full review: 589 clear and 9 circled, with 436 stones.

## Sources and scope

Pukui & Elbert (1986) is the spelling and sense authority. Andrews (1836,
1865), Parker (1922), Māmaka Kaiao, Kent and the Combined Hawaiian Dictionary
(2020) supply additional attested senses. Direct entry links in
`source_urls` point to [wehewehe.org](https://www.wehewehe.org/).

The 166 correction, status and held-ruling records and the 19 stone records
were checked directly against the website on 22 October 2026. This scope
covers those records, not a fresh verification of the 221 confirmation-only
records. [`REVIEW.md`](./REVIEW.md) gives the worksheet and
[`LETTER.md`](./LETTER.md) provides the editorial reading. The list has
not been read by a fluent speaker.

## What the build applies

- `confirmed` and `fix` clear the circle when no `ruling` is open.
- `spelling` and `gloss` set the chosen written form and sense.
- `unconfirmed` keeps the circle; `unattested` excludes an entry.
- `ruling` keeps the circle and holds the spelling; a supplied gloss applies.
- Stone glosses apply only when the root sense has supporting evidence.
- `wordlist.tsv` records the final gloss and field used by `src/data/words.js`.

The curation has no entries marked `unattested`. **Hoakipa** is attested as
visitor/guest in the Combined Hawaiian Dictionary (2020), with hoa + kipa.
**Heiheinalu** is attested in Parker (1922), with both surfing and racing on
surfboards. Both ship with their cited senses.

**Hākō** uses the sugar-cane-leaf sense attested by Andrews and Parker;
Parker explicitly supplies the leaf + sugar-cane analysis. PE also records
a pathway-carving sense, which does not establish that same root analysis.
**Kōkō** uses PE's pregnancy/fulfillment senses, matching its kō stones.
The carrying-net sense is a separate choice with different ancestral evidence.

**Hale malu** is in PE. **Hoalawaiʻa** is in Andrews (1865), and
**lāhuikaua** is in Andrews (1865) and Parker (1922); neither depends on an
1836 entry alone. **Wai ea** has both purification-water and small-house
senses in PE; the chosen card gloss is the house sense.

## Open decisions

**Pekupeku** keeps its circle because the shipped repeated-kicking gloss
needs evidence beyond PE's flicking-out sense. Eight root or spelling rulings
also remain open: ʻahuao, ʻōpūhue, aʻa koko, pakakahi, kūemi, kālāʻau,
hāipu and hoaaloha. Their dictionary alternatives and shared-stone
constraints are recorded on each curation entry.

The isolated stones for **poi** in hiʻipoi, **ʻau** in ʻauwai, **paʻi** in
paʻi aʻa and **ʻolo** in ʻolokaʻa have no asserted gloss. PE's covering
headword is poʻi; its current/flow headword is au without an initial ʻokina.
A whole-word gloss or a similarly spelled root is insufficient to settle
those compound analyses.

Common nouns appear in lower case under DESIGN §4.4. Dictionary capitalization
of proper names is recorded separately in the curation notes. Cultural
context and the invitation for a fluent reader remain in `REVIEW.md` and
[`SOURCES.md`](../../../SOURCES.md).
