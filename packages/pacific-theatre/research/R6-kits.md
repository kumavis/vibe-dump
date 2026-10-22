# R6: the kits — reference data for the procedural ships, aircraft and the sim

Written 2026-10-22 by researcher R6 for the Pacific diorama's design pass.
Scope: the numbers and silhouettes behind `kits/ships.json` and
`kits/aircraft.json` (DATA.md §8), and the damage calibration the sim needs
(ENGINEERING.md §5, `damage.js`). Every number carries a source id (§2).
Disagreements are marked **≠**. Anything I did not open is *verify*.
Estimates of my own are marked **E** and are not facts.

## 0. Headline findings

1. **The recognition manuals give the silhouettes, not the numbers.** ONI
   41-42 (Nov 1942, pages dated to Aug 1943) has a profile, a plan, a height
   scale and a data block for most Japanese classes. Its data are wartime US
   estimates and often wrong: Nagato 32,720 t standard (actual 39,130 t
   after refit), Kongō "29,300 t", Shōkaku "15,000 t, based on incomplete
   information". Use the manuals for block positions and shapes; use
   post-war figures for the sim (§3.1, decision D1).
2. **I measured block positions off the manual drawings.** For 21 classes I
   laid a 0.05-step ruler (fraction of length from the bow) over the
   archive.org page images and read turret, mast, funnel, island and
   catapult positions to about ±0.02 (±0.03 on the small silhouette charts).
   The crops with rulers are kept in `research/downloads/R6/img/` so anyone
   can check a reading (§3.7).
3. **No public-domain plate of Yamato, Agano or the late-war US classes was
   reached.** ONI 41-42 predates them, ONI 222-J (Aug 1945) leaves out sunk
   ships, FM 30-50 (Oct 1941) predates US war construction and draws North
   Carolina from pre-completion plans. Yamato, Iowa, Essex, South Dakota,
   Casablanca and John C. Butler rows are **E** until a person reads a print
   plan (§11).
4. **The 16-inch time of flight checks out.** NavWeaps' range table for the
   16"/45 Mark 6 gives 6.83 s at 5,000 yd and 14.45 s at 10,000 yd, so about
   12.0 s at 8,400 yd, as ENGINEERING.md assumes. Washington opened on
   Kirishima at about 5,800 yd (Kirishima TROM), about 8 s.
5. **The record's hits on Kirishima range from 9 to about 20 16-inch.** The
   TROM's note: USSBS and Lee's report give nine (Lee eight) 16-inch and
   about 40 5-inch; Lundgren's analysis of Ikeda's sketch gives about 20
   major-calibre and 17 smaller. She capsized at 03:25, about 3 h 20 min
   after the first hit. South Dakota took "at least 26" hits (1 × 14-inch,
   18 × 8-inch, 6 × 6-inch, 1 × 5-inch) and was never in danger of sinking
   (BuShips WDR). Both numbers bound the battleship damage model (§4).
6. **A carrier's fatal threshold depends on what is in its hangar, not on
   its armour.** One 1,000-lb bomb sank Akagi. Three sank Sōryū, four sank
   Kaga and Hiryū. Yorktown took three bombs and two Type 91 torpedoes and
   was still afloat two days later. A single small bomb set off St. Lo's
   hangar ordnance, and she sank in about 30 minutes (BuShips CVE report).
   One scalar `fatal` per kit cannot produce that. The sim needs a
   hangar-state factor (decision D3).
7. **AP shells over-penetrated thin hulls at Samar.** Hoel took about 40
   hits before sinking. Gambier Bay's fatal hit flooded her forward engine
   room: US reports call it an 8-inch shell, Japanese records an 18.1-inch
   AP that did not burst (≠, Wikipedia citing Lundgren). The damage model
   needs a shell-type × armour rule, or the record's destroyer and escort
   carrier losses cannot be reproduced (decision D4).
8. **Primary handling data exist for the US types.** NACA flight tests (PD,
   on archive.org) give the F4F-3's best roll rate, 58°/s at 190 mph IAS
   with a 30-lb stick force, too heavy above about 200 mph. They also cover
   the F6F-3's ailerons, the SBD-1's perforated dive flaps (kept because
   they "eliminat[e] tail buffeting") and SBD dives at 45°, 60° and 75°. For
   the Zero only secondary sources were reached: "ailerons froze up at
   speeds above 200 knots" (US test pilot, quoted on Wikipedia). The brief
   says 250 kn (≠).
9. **The Pearl Harbor damage is on record in a primary table.** BuShips'
   *Summary of War Damage* gives Arizona 8 bombs and 1 torpedo, Oklahoma
   about 5 torpedoes, West Virginia 7 torpedoes (one in the rudder) and 2
   dud bombs, California 2 torpedoes and 2 bombs (she sank from open
   manholes), Nevada 1 torpedo and 5 bombs, and Utah 2 torpedoes
   (Wikipedia). All are in §4.
10. **Torpedo envelopes, with sources.** The Type 91 was designed to drop at
    180 kn from 20 m (Wikipedia). In 1941 the Mod 2 got the roll-control
    and wooden-fin shallow-water fit for Pearl Harbor. The Mod 3 (Midway)
    carried a 240-kg warhead, 2,000 m at 41–43 kn. The early Mark 13 was
    dropped "low and slow – typically 50 feet and 110 knots". In a mid-1943
    analysis only 31 % of drops above 150 kn gave a satisfactory run. The
    TBD could not release above 115 mph (NavWeaps, Wikipedia).
11. **US national-insignia dates, as needed for `colours[].from/to`.** The
    red centre was removed on 15 May 1942. The bars with a red outline came
    on 28 June 1943, the blue outline on 14 August 1943 (AN-I-9, field
    order of 24 Sept 1943). Navy rudder stripes ended in May 1942
    (Wikipedia, citing Bell and Doll; tertiary).
12. **ONI 41-42 contains wartime slurs and a racist caricature** (leaf 27,
    the carrier chart). Use its geometry only. Never reproduce its pages,
    captions or images in the app (for R8).

## 1. Method, and how to read the tables

- **Opened and read**: ONI 41-42, ONI 222-J, FM 30-50 and TAIC Manual No. 1,
  as archive.org full texts split by scan leaf, with the page images I
  measured. Five BuShips War Damage Reports came as HyperWar PDF text
  layers. Four NACA wartime reports came as archive.org full texts. There
  were 33 NavWeaps gun and torpedo pages (secondary) and 104 Wikipedia
  articles as `action=raw` wikitext (tertiary). The combinedfleet.com TROM
  for Kirishima was downloaded by R5. R4's file covers the Midway hit
  counts.
- **Leaf numbers**: "leaf n34" is the archive.org page index, so a page
  image is `https://archive.org/download/<item>/page/n34_w1200.jpg`. ONI
  41-42 has no printed page numbers; its plates are cited by leaf, title
  and the plate's own date.
- **Units** follow DATA.md §8: metres, knots, tonnes and kilograms. Long
  tons are converted at 1.016. Feet and inches are converted at 0.3048 m.
  Originals are kept in the notes.
- **Block grammar** (Table S7), so a script can parse a cell. Blocks are
  separated by `;`. Each block is `kind(shape)@from[-to][>s|<p][^height]`:
  `>s` is starboard, `<p` port, and `^` the top in metres above the
  waterline. `sf` after a turret means superfiring. Example:
  `turret(twin)@0.29 sf; pagoda(short)@0.35-0.41^41; funnel(round)@0.47`.
  `at` is the fraction of length overall from the bow, as in DATA.md.
- **Confidence**: **M** = measured on a manual plate (±0.02). **Mc** =
  measured on a small silhouette chart (±0.03). **E** = my estimate from
  general knowledge, not to be shipped without a person's check.
- **One row per class**, the ships named. Where a ship differed from her
  class at the battle's date, the notes say so.

## 2. Source ids

| id | work | where | kind | opened |
| --- | --- | --- | --- | --- |
| oni-4142 | ONI 41-42, *Japanese Naval Vessels* (Nov 1942; loose-leaf plates dated Oct 1942–Aug 1943) | archive.org `oni-4142` (`ONI4142_djvu.txt`, page images) | primary (US intelligence; PD) | yes |
| oni-222j | ONI 222-J, *The Japanese Navy* (9 Aug 1945) | archive.org `ONI222JTheJapaneseNavy` | primary (PD) | yes (text; plates downloaded, not all measured) |
| fm-30-50 | FM 30-50, *Identification of United States Naval Vessels* (11 Oct 1941) | archive.org `Fm30-50` | primary (PD) | yes |
| taic-1 | TAIC Manual No. 1, *Japanese Aircraft Performance and Characteristics* (June 1945; pages dated Dec 1944–May 1945) | archive.org `japanese-aircraft-performance-characteristics-taic-manual` | primary (US intelligence; PD) | yes |
| bs-wds42 | BuShips, *Summary of War Damage to U.S. Battleships, Carriers, Cruisers and Destroyers, 17 Oct 1941 to 7 Dec 1942* (NAVSHIPS A(374)) | HyperWar `USN/rep/WDR/` | primary (PD) | yes |
| bs-wdr-cv5 | BuShips War Damage Report, *Yorktown (CV-5), bomb and torpedo damage, Midway, 4–7 June 1942* | HyperWar `USN/rep/WDR/` | primary | yes |
| bs-wdr-bb57 | BuShips War Damage Report, *South Dakota (BB-57), gunfire damage, 14–15 Nov 1942* | HyperWar | primary | yes |
| bs-wdr-cve | BuShips, *Escort Carriers: gunfire, bomb and kamikaze damage and loss* (HyperWar copy holds Section IV on) | HyperWar | primary (partial) | yes |
| bs-wdr-51 | BuShips War Damage Report No. 51, *Destroyer Report* (25 Jan 1947) | HyperWar (plates and photographs only) | primary (partial) | yes (Johnston plate V not legible as text) |
| naca-f4f3 | Kleckner, *Flight Measurements of the Aileron Characteristics of a Grumman F4F-3 Airplane*, NACA ACR (Sept 1942) | archive.org `NASA_NTRS_Archive_20090019131` | primary | yes |
| naca-f6f3 | *Flight Measurements of the Flying Qualities of an F6F-3 Airplane (BuAer 04776) II: Lateral and Directional*, NACA MR L5B13a (1945) | archive.org `NASA_NTRS_Archive_19930092601` | primary | yes |
| naca-sbd1 | Root, *The Development of Satisfactory Flying Qualities on the Douglas Dive Bomber, Model SBD-1*, NACA ACR W-81 (May 1942) | archive.org `NASA_NTRS_Archive_19930092599` | primary | yes |
| naca-sbd-dive | Johnson, *Determination of Flight Paths of an SBD-1 Airplane in Simulated Diving Attacks*, NACA ACR (Mar 1943) | archive.org `NASA_NTRS_Archive_20090016689` | primary | yes (tables garbled in OCR) |
| nw-&lt;page&gt; | NavWeaps (Tony DiGiulian), gun and torpedo pages, e.g. `nw-WNJAP_18-45_t94` | `http://www.navweaps.com/Weapons/<page>.php` | **secondary**; cites USNTMJ O-series, OP 1188, Campbell, Lacroix and Wells | yes |
| nw-tjp, nw-tus | NavWeaps, *Japanese Torpedoes of WWII*, *USA Torpedoes of WWII* | `WTJAP_WWII.php`, `WTUS_WWII.php` | secondary | yes |
| cf-kirishima | combinedfleet.com, Kirishima TROM (Hackett, Kingsepp, Tully) | `combinedfleet.com/Kirishima.htm` (R5's download) | secondary | yes |
| r4 | R4-air-battles.md (sister file): Midway hits from Nagumo's report, NWC 1948, TROMs | `research/R4-air-battles.md` §3.9, §5.3 | (compiled) | yes |
| wp-&lt;article&gt; | English Wikipedia, `action=raw` (e.g. `wp-Japanese_aircraft_carrier_Kaga`) | `en.wikipedia.org` | **tertiary**; infoboxes cite Lacroix and Wells, Jentschura, Friedman, Garzke and Dulin, Francillon | yes |
| print-ll | Lacroix and Wells, *Japanese Cruisers of the Pacific War* (1997) | print | — | no, *verify* |
| print-gd | Garzke and Dulin, *Battleships: Allied Battleships* (1980) and *Axis and Neutral Battleships* (1985) | print | — | no, *verify* |
| print-fr | Friedman, *U.S. Battleships*, *U.S. Aircraft Carriers*, *U.S. Destroyers* (1983–2004) | print | — | no, *verify* |
| print-pt | Parshall and Tully, *Shattered Sword* (2005) (carrier plans, deck markings, hangar state at Midway) | print | — | no, *verify* |
| print-fr79 | Francillon, *Japanese Aircraft of the Pacific War* (1979) | print | — | no, *verify* |
| print-dj | Doll, Jackson and Riley, *Navy Air Colors* vol. 1 (1983); Bell, *Air Force Colors* (1995–97) | print | — | no, *verify* |
| ships-2 | BuShips, *SHIPS-2 Camouflage Instructions* (1941; rev. 1942, 1943) | not reached (shipcamouflage.com's copy sits behind a JS challenge) | primary | no, *verify* |

