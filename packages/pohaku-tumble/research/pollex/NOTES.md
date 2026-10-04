> The crawler lives here; its fetched pages and built tables (`hawaiian-reflexes.json`, `sources.json`, `raw/`) are written to `../roots/.cache/pollex/` (or `$POLLEX_DATA`) and are not committed: POLLEX states no open licence. Run `python3 fetch.py`-based crawls only if the cache is missing — `build.py` rebuilds offline from it.

# POLLEX-Online: Hawaiian reflexes, collection notes

Crawled 2026-10-04 (04:40 to 05:29 UTC) from https://pollex.eva.mpg.de/.
Requests were sequential, at least 1.2 s apart, with User-Agent
`vibe-dump-research/1.0 (aaron@kumavis.me)`. There were 2182 cached fetches plus
about 10 manual probes. Every response was HTTP 200: no 403, 407 or 429, no bot
check, and no retries were needed. No other host was contacted.

## Outputs

| file | what |
| --- | --- |
| `hawaiian-reflexes.json` | 2258 objects, one per Hawaiian reflex row in POLLEX |
| `sources.json` | the 13 POLLEX sources cited for Hawaiian, with full citations and row counts |
| `raw/cache/` | every fetched HTML page, so `build.py` reruns offline |
| `raw/haw_rows_raw.json` | the parsed language-page rows, before normalisation |
| `raw/stats.json`, `raw/spotcheck.json` | counts, the parser cross-check, and spot-check results |
| `fetch.py`, `crawl_language.py`, `crawl_entries.py`, `build.py`, `spotcheck.py` | the pipeline, run in that order |

## Counts

- Hawaiian language page: **2258 rows** ("2258 entries found"), over 46 pages.
- **2122 distinct protoform entries** (entry URLs). All were fetched and none
  returned 404. They collapse to 1782 distinct `proto` strings, because
  homonyms such as `MATA.1A`, `MATA.1B` and `MATA.1C` all become `*mata`.
- The task's ~2500 cap was not reached, so **0 protoforms were skipped**.
- Entries by level (distinct entries): PPN 1145, PCE 479, PNP 246, PEP 119,
  PMQ 47, PEC 32, PTA 17, PSO 6. Raw codes with no proto-language: CC 12, CK 6,
  ?? 4, XE 4, RO 3, XW 1, TO 1.
- Rows by level: PPN 1215, PCE 518, PNP 259, PEP 125, PMQ 50, PEC 36, PTA 18,
  CC 12, CK 6, PSO 6, ?? 4, XE 4, RO 3, XW 1, TO 1.
- Rows with at least one cognate, per language: Maori 1758, Marquesas 1460,
  Tahitian 1451, Samoan 1053, Tongan 1029, Easter Island 871. 24 rows have none
  in any of the six. 2098 of the 2122 entries have at least one.
- Hawaiian rows with POLLEX flags: Problematic 120, Uncertain Semantic
  Connection 57, Phonologically Irregular 37 (214 rows flagged in all).
- 2072 rows have a single-token `haw` (letters, ʻokina and macrons only). 28
  rows hold more than one form (`haw_forms`).

## How the site is structured

- **Language listing**: `/language/hawaii/`, then `?page=2` to `?page=46`, 50
  rows per page in a single `<table>`. Each row has four cells:
  1. a protoform link `<a href="/entry/<slug>/" title="Entries for <ID> [<CODE>] <gloss>[: *variant]">CODE.ID</a>`
  2. `<td class="item">`: the reflex
  3. the gloss, plus optional `<span class="flag">` flags
  4. `(<a href="/source/<n>/" title="<short citation>">CODE</a>)`
- **Entry page** (`/entry/<slug>/`): an `<h1>` of the form
  `Protoform: <ID> [<CODE>] <gloss>`, then a small table with Description,
  Reconstruction ("Reconstructs to CODE: Subgroup name") and Notes (the `*0`
  to `*8` fields), then one table of every reflex with columns Language, Reflex,
  Description and Source. None of the 2122 pages was paginated: all reflexes
  are on one page.
- **Source page** (`/source/<n>/`): `<p class="ref">` holds the full citation,
  followed by a paginated list of every row from that source.
- `/level/` lists the distribution codes. `/about/` explains them.
- Entry pages offer "Download: Pollex-Text / XML" links under `/api/...`.
  **robots.txt disallows `/api/`** (and `/history/`), so those links were not
  used.
- Slugs are not derivable from IDs: `afi1/` vs `qafa.1/`, `laqaaa/` for
  `LAQAA.A`. Use the links on the page, as this crawl did.

## Orthography POLLEX uses for Hawaiian

- **Glottal stop is `ʔ` (U+0294 LATIN LETTER GLOTTAL STOP)**: 870 occurrences.
  One row uses `’` (U+2019) instead: `No’u` under `*noku`. No U+02BB ʻokina,
  ASCII `'` or `‘` appears in any Hawaiian item.
- **No macrons. Long vowels are written doubled**: `Aahea` is āhea, `Poo` is
  pō, `Laa` is lā, `ʔAaina` is ʻāina.
- The **first letter of every item is capitalised** (`ʔAe`, `Maka`). This is
  mechanical, not a sign of a proper name.
- `/` marks morpheme segmentation or the cognate part: `H/aha/`, `Ahe/ahe`,
  `ʔOo/lani`, `Kai /lalo/`. Parentheses mark optional material: `Amu(amu)`,
  `(ʔA)poopoo`. A comma, `;` or `~` separates alternative forms. A trailing
  parenthesis after a space is commentary: `Kilo (pass. kilo/hia)`,
  `ʔOhe hano ihu (also hano)`, `(Niʔihau) (StJ)`.
- Protoforms use Biggs' notation: `g` = ŋ, `q` = PPN glottal stop. IDs are
  upper-case with homonym or sense suffixes (`MATA.1A`, `LAQAA.A`, `QAU-AFI.*`,
  `KOI.2*.`).

## Field definitions (`hawaiian-reflexes.json`)

| field | meaning |
| --- | --- |
| `haw` | the first form, in modern spelling: lower-cased first letter (left alone when the form has other capitals, which marks a likely proper name such as `Naa ʔOle` or `Hilina Maa`), `ʔ`/`’` → `ʻ` (U+02BB), doubled vowels → macron vowel, `/` removed. Parentheses, hyphens and spaces are kept as POLLEX wrote them. NFC. |
| `haw_raw` | the item exactly as POLLEX shows it (whitespace-trimmed) |
| `haw_okina` | `haw_raw` with only the glottal-stop character swapped to U+02BB |
| `haw_forms` | every alternative form, each normalised as in `haw` |
| `haw_notes` | commentary taken out of the item, or the warning below |
| `haw_gloss`, `haw_flags` | the Hawaiian gloss and POLLEX flags |
| `proto` | protoform from the POLLEX ID: lower-cased, sense suffix stripped, POLLEX letters kept (`*lagi`, `*laqaa`) |
| `proto_ng` | the same with `g` → `ŋ` (`*laŋi`) |
| `proto_variant` | fuller reconstruction when POLLEX gives one in the description (`*a(a)e`). 265 rows. |
| `pollex_id` | the raw ID, e.g. `MATA.1A` |
| `level` | proto-language label: PN, AN, MP, OC, EO, CP and FJ → **PPN** (per /about/, a code above Polynesian still means the head form is PPN); NP → PNP, EP → PEP, CE → PCE, TA → PTA, MQ → PMQ, SO → PSO, EC → PEC. Other codes (XE, XW, ??, CC, CK, RO, TO) are kept raw: they are distribution labels, not proto-languages, and /level/ gives no expansion for CC, CK, RO or TO. |
| `level_code`, `level_name` | the raw code, and the entry page's "Reconstructs to" text |
| `proto_gloss`, `proto_url` | the entry's description, minus any `*variant`, and its URL |
| `source`, `source_code`, `source_url` | the short citation, the POLLEX code, and the /source/ page |
| `cognates` | for Maori ("New Zealand Maori" in POLLEX), Samoan, Tahitian, Tongan, Easter Island and Marquesas: a list of `[form, gloss]`. Forms are as POLLEX writes them (`ʔ`, doubled vowels, `/`, dialect tags such as `(MQS)`) except the mechanical first capital is lower-cased. Any POLLEX flag is appended to the gloss in square brackets. Glosses are verbatim, so some Tahitian and Marquesan ones are in French and some carry inline source tags such as `(Dln)`. An empty list means POLLEX has no reflex in that language for that entry. |

## Rows that could not be parsed cleanly

Every row parsed: all 2258 rows have a protoform link, an item and a source.
For every row, its Hawaiian item also appears on its entry page (0 mismatches).
The six-language cognate counts were re-checked against the raw HTML of every
entry, with 0 mismatches. Items worth knowing about:

- **Probable POLLEX typos** (kept as-is, marked in `haw_anomalous_chars`):
  `Iqi` (the `q` is not Hawaiian), `Polo/lei, polo/loiS` (stray `S`). Also
  kept: `Veo` (v for w) and `Taa ia` (t, a vestigial form).
- **Identical vowels across a `/` boundary**, which were not merged into a
  macron and are marked in `haw_notes`: `E/ewe/`, `ʔAna/aʔanaa`,
  `Paahaʔa/aʔa`, `Pui/ia`, `Aka/akalani`, `Hoʔa/alahia`. Whether these are
  long vowels in standard spelling has to be checked against Pukui & Elbert by
  hand.
- **Commentary inside the item**, moved to `haw_notes`: `Kilo (pass. kilo/hia)`,
  `Kuni (passive-imperative *kuni/a*)`, `ʔOhe hano ihu (also hano)`,
  `Kaunaʔoa pehu, kaunaʔoa uka. Kaunoʔa (Niʔihau) (StJ).`
- **Non-words**: affixes and discontinuous particles (`Ma-`, `Hoʔo-`, `-na`,
  `E...ana`, `Ke...nei`) and multi-word phrases (`No ka mea`, `Ma ke kua`) are
  kept as written.
- **Probably mis-attributed sources**: two Hawaiian rows cite *Elbert 1975-81*,
  the Rennell-Bellona dictionary: `(ʔOo)peʔa-peʔa` and `Kulikuli`. One cites
  *Ranby 1980*, a Nanumea lexicon: `Puupuu`. The code `Ebt` is shared by
  "Pukui 1986" (source 110) and "Elbert 1975-81" (source 22). Source 110 has
  the same citation text as Pukui & Elbert 1986.

## Licence and citation terms shown on the site

- Footer: "© POLLEX-Online 2010. Simon J Greenhill, Ross Clark & Bruce Biggs."
  Links: Contact, and the Max Planck EVA Imprint.
- /about/ and the home page say: "If you use the POLLEX-Online database, please
  cite: Greenhill SJ & Clark R (2011). POLLEX-Online: The Polynesian Lexicon
  Project Online. *Oceanic Linguistics*, 50(2), 551-559."
- **No open licence (Creative Commons or similar) is stated anywhere on the
  site.** The home, about and contact pages, and the footer of every page, were
  checked. Treat the data as copyrighted, and cite it as above when you use it.
  Each Hawaiian reflex also comes from a cited dictionary, mainly Pukui &
  Elbert 1986, which should be credited too.
- robots.txt: `Allow: /`, `Disallow: /api/`, `Disallow: /history/`. Both
  disallowed paths were respected.

## Hawaiian sources cited by POLLEX

See `sources.json`. 2217 of the 2258 rows (98%) are **Pki = Pukui, M. K. and
S. H. Elbert (1986). Hawaiian Dictionary. Honolulu, University of Hawaii
Press.** Another 20 are "Pukui 1986" (Ebt, source 110), with the same citation.
The other 21 come from 11 more sources: Pawley 1970 (5), Hooper 1994 (3),
St.John 1982 (3), Elbert 1975-81 (2), Beckwith 1940 (2), Pukui, Elbert &
Mookini 1974 (1), Johnson, Mahelona & Ruggles 2015 (1), Handy 1927/1932 (1),
Makemson 1941 (1), Bengt Danielsson pers. comm. (1), Ranby 1980 (1).

## Spot check (`spotcheck.py`)

Every expected pairing that POLLEX has came out right:

- maka ← *mata (MATA.1A, eye/face; also 1B mesh, 1C blade, 2A raw)
- wai ← *wai (WAI.1; also *hai "who?" and *qai "place")
- kai ← *tahi (TAHI.1, sea)
- ahi ← *afi
- moku ← *motu (A, severed; B, island)
- ala ← *hala (road; also *qara "awake")
- lani ← *lagi = *laŋi (LAGI.2, sky; LAGI.5, high chief)
- ao ← *qaho (day) and *qao (cloud)
- pō ← *poo (1A night, 1B 24-hour day, 1C underworld [PCE])
- lā ← *laqaa (A, sun [PPN]; B, day [PNP]); also *laa "sail" and *raa "there"
- one ← *qone
- kino ← *tino
- paʻa ← *paka (PAKA.1A "dried, scorched", Hawaiian "firm, solid")
- hale ← *fale
- waʻa ← *waka
- iʻa ← *ika
- puaʻa ← *puaka
- **ʻāina is in POLLEX**, under PPN *kaaiga (*kaaiŋa) "place of residence,
  home" (KAAIGA.A, code PN). Cognates include Maori kaainga and Samoan ʔaaiga.
