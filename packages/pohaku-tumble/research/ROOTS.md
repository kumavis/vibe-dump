# Roots — can two-root words carry Pōhaku Tumble?

Research for [DESIGN.md](../DESIGN.md) §2, option B (one root per stone, words
that are compounds of two roots). Done 2026-10-04. The data and the scripts
that rebuild every number below are in [`roots/`](./roots).

## The answer

**Not on what can be confirmed today, and probably yes once Pukui & Elbert is
checked.**

- **Confirmed today: too few words.** Only **128** two-root compounds are
  attested with a modern spelling *and* survive the exclusion screen. Jukugo's
  board deals its opening words from those with at least five possible turns,
  and needs one per pair (~65). This list has **21**. It cannot deal a full
  board. On a 22-pair board, half the attempted turns find nowhere to go, and
  four in ten turns return to a word the pair showed moments ago.
- **Probably in Pukui & Elbert: enough.** Andrews' dictionary as revised by
  Parker (1922) analyses another **777** words as root + root, after screening
  and dropping prefix-built ones. If they all hold up, the board behaves almost
  like Jukugo's: 3% of attempted turns stall, 12% repeat. If 60% hold up, it
  is livable (8% / 18%). At 35% it is poor (17% / 25%).
- **Deciding it takes a person.** The dictionary that settles it — Pukui &
  Elbert's *Hawaiian Dictionary* (University of Hawaiʻi Press) on wehewehe.org
  — refuses automated access, so it was not consulted. The deciding step is a
  person looking words up there.
  [`roots/compounds.tsv`](./roots/compounds.tsv) is the worksheet, most useful
  words first. See **The Pukui & Elbert check** below.

Nothing in `roots/` should be treated as checked against Pukui & Elbert.

## Sources

| source | what it gives | used? |
| --- | --- | --- |
| Pukui & Elbert, *Hawaiian Dictionary* (UH Press, 1986), on wehewehe.org | the authority: headword spelling, senses, "Lit." readings of compounds, PPN etyma | **no** — wehewehe.org answers automated requests with a Cloudflare bot challenge, and that was respected rather than worked around. The archive.org copy is lending-only; its search-inside also refuses. |
| *Māmaka Kaiao* (Kōmike Hua Hōʻoia; UH Press), on wehewehe.org | modern coinages (kinoea, kinowai, kinopaʻa are probably from here) | **no** — same site |
| Wehi ʻŌlelo (wehiolelo.org, UH Hilo / Ulukau, beta) | an all-Hawaiian dictionary | reachable, but still small (no entry for *waimaka*) |
| puke.ulukau.org, baibala.org (Ulukau's books and the Hawaiian Bible) | text in modern spelling | **no** — same bot challenge |
| Wiktionary, via kaikki.org's wiktextract dump (CC BY-SA 4.0) | modern spelling, glosses, root + root analyses, homographs | yes: the only modern-spelling source reachable in bulk. Crowd-edited, so secondary. |
| Lorrin Andrews, *A Dictionary of the Hawaiian Language*, revised by Henry H. Parker (1922), archive.org OCR (public domain) | about 15,000 entries, often with the parts in brackets: *Waimaka … [Wai, water, and maka, eyes.]* | yes: attests a word, its parts and its meaning. It writes no ʻokina or kahakō, and some of its etymologies are guesses ("Po, intensive", "Ka, the"). |
| POLLEX-Online (Greenhill & Clark 2011), crawled with [`pollex/`](./pollex) | Proto-Polynesian etyma and cognates for 2,258 Hawaiian reflexes — **98% of them cited to Pukui & Elbert 1986**, so where a word is in POLLEX its spelling there is Pukui & Elbert's (POLLEX writes ʔ and doubled vowels; converted) | yes: the one indirect Pukui & Elbert check available. It confirms the homograph cases below (*lua* "pit" < PPN \*lua, *lua* "two" < PPN \*rua; *ao* "day" < \*qaho, *ao* "cloud" < \*qao). Data kept out of git: no open licence is stated. |
| Hawaiian Wikipedia (dumps.wikimedia.org) | whether a spelling is used in running modern text, as one word or two | yes, counts only |

## Method

1. **Wiktionary.** Every Hawaiian entry whose etymology splits it into parts:
   406 two-part analyses. 144 are single words whose two parts spell the word
   exactly (*wai + maka = waimaka*).
2. **Andrews–Parker.** 2,378 entries with a bracketed "X, …, and Y, …"
   etymology. 1,848 spell the headword exactly, and 341 more do after
   repairing OCR (*kialiia* → *kialua*). Each part is then matched to a
   Wiktionary content word by comparing Andrews' gloss of the part with the
   word's senses. That gives the modern spelling of each root. 1,031 compounds
   map cleanly. 1,158 do not, because a part is a particle, a prefix
   (*hoo*, *ka*), or a root Wiktionary lacks.
3. **Evidence codes.**
   - `W`: Wiktionary analyses the word as root + root.
   - `A`: Andrews–Parker does, and the compound is itself a Wiktionary
     headword, so its modern spelling is attested.
   - `A*`: Andrews–Parker only. The spelling is pieced together from the
     roots', so the ʻokina, kahakō and word break are unconfirmed.

   Merged: 100 `W`, 44 `W+A`, 39 `A`, 929 `A*`, 1,112 in all.
4. **Exclusion screen.** An automated first pass of DESIGN §4.3. It drops a
   compound if the compound or either root has any sense touching sex,
   genitals, excretion, venereal disease, slurs or sorcery, or if either is a
   loan or grammatical: 112 out. It is deliberately over-eager. It is a
   stand-in for the three reads in §4.2, not one of them.
5. **Prefixes are not roots.** Wiktionary also lists pā-, kā-, pō-, kai-,
   haʻa-, pū-, hō-, hoʻo- … as prefixes. A compound whose first part is one of
   these counts as prefix-built unless a source glosses that part with a
   content sense of the root ("Kai, sea" stays; "Po, intensive" goes): 95 out.
6. **The board.** Jukugo Tumble's real `Board` (deal, `chooseTurn`,
   `desiredLinks`) runs against each candidate list. The layout is the
   Pōhaku one: horizontal only, 1.5-wide slabs. Each tick turns one random
   pair that hasn't turned in the last three ticks. 1,500 ticks per run, ten
   seeds per row. `roots/sim/` patches only what the test needs: the lexicon,
   the grid, a guard on the deal loop.

7. **Pukui & Elbert via POLLEX.** `pe_via_pollex` in both tables compares a
   spelling with POLLEX's (Pukui & Elbert-sourced) form, ignoring ʻokina,
   kahakō and spaces.
   - **Roots:** 394 of the 476 core roots are in POLLEX, and 380 match. The 14
     that differ are mostly my mapping picking the wrong homograph (*ʻahā*
     "four" for *ʻaha*, *aina* for *ʻaina*).
   - **Compounds:** 58 core candidates are in POLLEX, and 37 match. The 21 that
     differ are the two failure modes `A*` was warned for:
     - Pukui & Elbert writes two words where Andrews wrote one: *wai puna*,
       *maka mua*, *pale kai*, *lau hala*, *make wai*, *lima kuhi*;
     - the pieced-together ʻokina or kahakō is wrong: *makaʻala*, *makapōuli*,
       *uahi*, *kupua*, *keʻahakahaka*.
   - `roots.tsv`'s `protoforms` column lists every POLLEX row for that spelling,
     whatever the sense. *kū* shows a night name and "to cut", not "to stand".

What survives steps 4–5 is the **core**: 905 candidates (70 `W`, 36 `W+A`,
22 `A`, 777 `A*`) over 476 roots.

## The board

Full board (9 × 8 grid, ~65 pairs); fuller matrix in
[`roots/viability.tsv`](./roots/viability.tsv).

- *five-turn words*: how many words can turn at least five ways (the deal's
  bar).
- *stalls*: share of attempted turns with nowhere legal to go. The director
  then skips that beat, and a noted word retires early.
- *repeats*: share of turns that land on a word that pair showed in its last
  six.
- *linked*: share of words tied to another word (Jukugo steers for about half).

| lexicon | words | five-turn words | deals? | stalls | repeats | linked |
| --- | --- | --- | --- | --- | --- | --- |
| Jukugo Tumble (reference) | 1,649 | 1,539 | yes | 0.1% | 10% | 51% |
| attested, Wiktionary (`W`) | 106 | 11 | **never**, at any size tried | — | — | — |
| attested (`W` + `A`) | 128 | 21 | only at 22 pairs | 49% | 42% | 36% |
| attested + *hoʻo-* as a stone | 243 | 138 | yes | 4% | 7% | **90%** |
| core, if 35% pass Pukui & Elbert | 399 | ~175 | yes | 17% | 25% | 55% |
| core, if 60% pass | 594 | ~358 | yes | 8% | 18% | 57% |
| core, if all pass | 905 | 669 | yes | 3% | 12% | 58% |

The partial-pass rows keep every attested word plus a random draw of the
`A*` candidates, two draws each. A real review will not cut at random: it
will tend to keep the common, well-attested families. So these rows are, if
anything, pessimistic.

What else was tried:

- **Smaller boards don't rescue a small list.** At a fixed floor size the
  pairs only spread out. The stall rate stays the same or rises, and a short
  list still deals only on the smallest grids.
- **Allowing a word twice on the board** (copies at least 14 units apart)
  trims stalls by about 15%. It barely moves repeats. The bottleneck is
  how few turns most words have, not the no-duplicates rule.
- **hoʻo- as a stone** (DESIGN §2 mitigation 2) deals easily, but HOʻO is one
  morpheme on 115 stones. It ties nine words in ten to each other with lines
  that mean only "both are causative".

## What this means for the design

1. **Two-word compounds belong in from the start, not last.**
   - Modern spelling splits many compounds that 19th-century writing joined.
     In Hawaiian Wikipedia, 145 core candidates appear as two words and 155 as
     one. Examples: *hale pule*, *hale kula*, *haku mele*, *luna kānāwai*,
     *makua kāne*, *lima ʻākau*, *kiʻi pōhaku*.
   - A Pukui & Elbert two-word headword is still two roots on two stones. It
     tumbles the same way.
   - Requiring one-word spelling (§2, "written as one word") would throw away
     a large share of the pool.
   - Recommend: admit any compound Pukui & Elbert lists as a headword or
     sub-entry, and write its caption exactly as Pukui & Elbert does,
     including the space.
2. **One stone is one root: link by meaning, not by spelling.**
   - 126 of the 476 core roots have two or more unrelated Wiktionary
     etymologies. *lua* is "two" (PPN \*rua) in some compounds and "pit"
     (PPN \*lua) in others. *ao* is "daylight" and "cloud", *hao* "iron" and
     "to rob", *maka* "eye" and "raw".
   - A line between two LUA stones, or a LUA stone that stays put while its
     word changes from "two-masted" to "the grave", would contradict the
     cards, which print each root's ancestor.
   - So stones should share an identity, link, and survive a turn only when
     they are the same root in sense, not just in letters.
   - In the simulation this costs little: five-turn words in the full core go
     from 706 to 669, and stalls stay near 3%.
   - It needs each compound annotated with which sense of each root it uses.
     The card's parts row needs that anyway. Where the sources didn't say,
     `compounds.tsv` flags *homograph root: sense unresolved* (228 core rows).
3. **Opaque compounds need a rule.**
   - Some splits are etymology, not meaning. *kūlolo*, a taro pudding, is
     analysed *kū + lolo* ("stand" + "brain"), and its parts row would read as
     nonsense.
   - Pukui & Elbert's "Lit." readings separate the transparent compounds
     (*kahakai*, "sea place") from the opaque.
   - Suggested: transparent compounds only, or opaque ones shown without a
     parts row.
4. **Modern coinages are a choice to make.** *kinopaʻa* "solid", *kinowai*
   "liquid" and *kinoea* "gas" are in Wiktionary but not in Andrews. They are
   20th-century scientific terms, probably from Māmaka Kaiao. They are good
   Hawaiian, but they sit differently on a card whose quiet subject is words
   that crossed the Pacific.
5. **Drop mitigation 2** (*hoʻo-* as a root), for the reason above. Other
   prefix-built words (*pāpale*, *kāhili*, *haʻalele*) are excluded the same
   way.
6. **The deal threshold is five turns, and the deal can hang.**
   - DESIGN §2 says the deal needs `degree(e) >= 3`. In `board.js` the opening
     pool is `degree(e) >= 5`; three is only for a word picked to match a
     neighbour.
   - The pick loop has no exit, so a list with fewer five-turn words than
     pairs freezes the page on load. The simulation guards this. The app must
     too, or size the board from the list.

### The design's own examples

| word | split | Wiktionary | Andrews–Parker 1922 | note |
| --- | --- | --- | --- | --- |
| waimaka *tears* | wai·maka | ✓ compound | ✓ [wai, water + maka, eyes] | |
| waiū *milk* | wai·ū | ✓ compound | ✓ [wai + u, the breast] "Lit. Breast water" | |
| waiwai *rich* | wai·wai | headword, no analysis | headword ("goods; property") | a reduplication, not two roots — decide whether those count |
| kahakai *beach* | kaha·kai | headword, no analysis | ✓ [kaha, mark + kai, sea] | Andrews glosses *kaha* "mark", the design "place": homograph |
| kahawai *stream* | kaha·wai | ✓ compound | ✓ [kaha, cut + wai, water] | same |
| kahaone *sandy beach* | kaha·one | ✓ compound | — | |
| naʻauao / naʻaupō *enlightened / ignorant* | naʻau·ao / naʻau·pō | ✓ compound | ✓ [naau, mind + ao, clear / po, night] | *ao* is a homograph ("daylight" / "cloud") |
| ʻauinalā / ʻauinapō *afternoon / late night* | ʻauina·lā / ʻauina·pō | ✓ compound | — | |
| kinopaʻa / kinowai / kinoea *solid / liquid / gas* | kino·… | ✓ compound | — | modern coinages (see 4) |
| alaloa *highway*, alanui *road* | ala·loa, ala·nui | ✓ compound | ✓ [ala, path + loa, long / nui, large] | |
| mokupuni *island* | moku·puni | ✓ compound | ✓ [moku, island + puni, to surround] | |
| mokuʻāina *island; district; state* | moku·ʻāina | ✓ compound | — | |
| hoʻoulu, hoʻokele | hoʻo·… | hoʻoulu ✓ (prefixed); hoʻokele absent | hoʻokele ✓ [hoo + kele, to slide] | prefix-built; drop with mitigation 2 |
| loko iʻa *fishpond* | loko iʻa | absent | absent | two-word; needs Pukui & Elbert |
| ahupuaʻa | ahu·puaʻa | ✓ compound | ✓ [ahu, collection + puaa, hog] | |
| huaʻōlelo *word* | hua·ʻōlelo | ✓ compound | headword ("a single word") | |

### Other loose ends

- **The four hand-added two-syllable words** (ʻalā basalt, koʻi adze, moi
  threadfin, lāʻī ti leaf) were described as added by hand, but they are not
  in `two-mora-candidates.json`. None of them is in Wiktionary either.
  Andrews–Parker attests all four: *Ala* "a round, smooth [stone]", *Koi*
  "ax; adze", *Moi* "a fish", *Lai* "[contraction of lau kī]". Their modern
  spellings come from memory and need the same Pukui & Elbert check.
- **The syllable list can't be rebuilt.** `fetch-definitions.py` reads a
  `two.json` that nothing in the repository produces, and the step that turns
  `compact.json` into `two-mora-candidates.json` was never committed.

## The Pukui & Elbert check

Use [`roots/compounds.tsv`](./roots/compounds.tsv). One row per candidate:

- `status`: `candidate` (core), `prefix-led` or `screened-out`.
- `flags`: why a row was screened out, plus "Wiktionary writes it as two
  words" and "homograph root: sense unresolved".
- `degree`: possible turns in the core.
- `hawwiki_1w` / `hawwiki_2w`: how often Hawaiian Wikipedia writes it as one
  word or two.
- `root_a` / `root_b`: the sense of each root, from Wiktionary; `?` means
  unresolved.
- `andrews_1922`: Andrews–Parker's headword and bracket.

Candidates come first, attested before `A*`, then most connective first. Each
lookup there buys the most board.

For each row, look the word up at wehewehe.org (Pukui & Elbert, plus Māmaka
Kaiao for coinages) and fill in:

| column | what to write |
| --- | --- |
| `pe_found` | `y` / `n` |
| `pe_spelling` | the headword exactly as printed: ʻokina, kahakō, and a space if it is two words |
| `pe_one_or_two_words` | `1` / `2` |
| `pe_meaning_ok` | `y` if Pukui & Elbert's sense and its "Lit." reading agree with the split and the root senses; otherwise what they say |
| `review_note` | anything else, e.g. "opaque", "archaic", "biblical coinage" |

Stop rules from the table above:

- ~600 confirmed core words makes a livable board.
- ~900 makes one as lively as Jukugo's.
- Under ~400, option B is not worth it.

Then the word list goes through the three reads (DESIGN §4.2), with the
"Lit." readings becoming the cards' parts rows. Last, the fluent-speaker read.

A faster route, if it can be had: ask Ulukau / Hale Kuamoʻo (UH Hilo) for
permission or a data export, for a non-commercial art piece that credits the
dictionary.

## Rebuilding

```bash
cd packages/pohaku-tumble/research/roots
./fetch_sources.sh            # Wiktionary dump, Andrews–Parker OCR, Hawaiian Wikipedia → .cache/
python3 extract_wiktionary.py # → .cache/wiktionary.json
python3 extract_andrews.py    # → .cache/andrews.json
(cd ../pollex && python3 crawl_language.py && python3 crawl_entries.py && python3 build.py)  # POLLEX, ~45 min at 1 req/s
python3 build_lexicon.py      # → compounds.tsv, roots.tsv, .cache/tiers/
python3 build_curves.py       # → .cache/tiers/curve-*.json
python3 build_dossiers.py     # → .cache/dossiers/ (per-word evidence for review)
./sim/run.sh                  # → viability.tsv (Node; reads ../../../jukugo-tumble/src)
```

Simulation rows vary by a point or two between runs: `chooseTurn` uses
`Math.random`.

## Credits

- Wiktionary contributors (CC BY-SA 4.0), via kaikki.org / wiktextract
  (Tatu Ylonen). `compounds.tsv` and `roots.tsv` carry short Wiktionary
  glosses under that licence.
- Lorrin Andrews and Henry H. Parker, *A Dictionary of the Hawaiian
  Language* (1922), public domain; OCR from the Internet Archive.
- POLLEX-Online: Greenhill, S.J. & Clark, R. (2011). *Oceanic Linguistics*
  50(2), 551–559.
- Hawaiian Wikipedia contributors (CC BY-SA 4.0); only word counts are kept.
