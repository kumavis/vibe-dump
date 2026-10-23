# Content, second round: the prologue front and the first doors

The content-2 workflow of ROUND-2.md §9: six front keyframes before the eve of
the war, so the table moves through the prologue; a first door in each battle
file, the briefing's *Start here*; and the checks that hold both. Its files:
`tools/fronts/{build,lines}.py`, `public/data/fronts/` (six new keyframes and
the manifest), `public/data/chapters.json` (the prologue's keyframe and two
sources), `public/data/sources.json` (four sources added, none changed),
`public/data/boxes/*/battle.json` (`firstDoor` only), `tools/check/fronts.mjs`
and the `firstDoor` rules of `tools/check/battle.mjs`.

## 1. What was read

- **Japanese Monograph 144**, *Political Strategy Prior to Outbreak of War*,
  Part I (1952; HyperWar/PHA HTML), preface and chs. I–IV: the rights Japan
  held in Manchuria in 1931 (the Kwantung "concessions and neutral zones", the
  South Manchuria Railway and its zones, troops in the zones); the chronologies
  of 1931–1939 (Mukden, Changchun and Kirin on 18 September 1931, Harbin on 4
  February 1932, Manchukuo on 1 March 1932, Hailar and Manchouli on 5 December
  1932, Jehol from 2 January to March 1933; Peiping on 8 August 1937, the
  Shanghai–Nanking–Hangchow towns from November to 24 December 1937; Tsingtao,
  Hsuchow, Kaifeng, Hankow, Canton and Yochow in 1938; Hainan, Nanchang, Swatow
  and Nanning in 1939); and, on p. 42, **the front at the end of 1938**, which
  the 1938-12-31 keyframe follows word for word. Some dates in ch. I are the
  editor's insertions from Langer's encyclopedia, marked as such in the text.
- **Japanese Monograph 70**, *China Area Operations Record (Revised), July
  1937 – November 1941* (1957; HyperWar PDF, OCR'd): the contents, the
  operations of 1937–1938, north Kiangsu (p. 47: "no Japanese forces east of
  Tungshan to the coast" until February 1939), Nanning (pp. 62–65: the 22d
  Army in the Chinhsien–Nanning area until IGHQ orders it back in November
  1940), the advance into northern French Indo-China (p. 64), Chekiang in April
  1941 (pp. 66–68 and Map 3: Chuchi, Ningpo, Yuyao, Linhai, Yungchia) and the
  advance into southern French Indo-China (p. 69); and its **General Reference
  Maps I and II** (the operations in north China, July 1937 – June 1938, and in
  central and south China, August 1937 – March 1939, with the dates of each
  advance), viewed, which date the 1937 extent: Kalgan late August, Tatung mid
  September, Paotow mid October, Taiyuan 8 November, Shihchiachuang 9 October,
  Anyang late October, Tsinan late December, Nanking 13 December, Hangchow 24
  December.
- **Peace and War: United States Foreign Policy, 1931–1941** (Department of
  State, 1943; PHA HTML with the book's pages), the narrative: ch. II on
  Manchuria (pp. 4–8: "by the end of 1931 Japan had destroyed the last
  remaining administrative authority of the Government of the Chinese Republic
  in South Manchuria"; Jehol "early in January 1933"); p. 96 on the agreement
  of 22 September 1940 (three airdromes, the transit of troops); p. 123 on
  southern Indochina ("about July 22 ... the right to maintain troops and
  establish air and naval bases in southern Indochina").
- **Morton, *Strategy and Command***, chs. I–II and IV (already in the
  ledger, read in the first round) for the order of events, "the right to
  occupy Tonkin Province", "in southern Indochina, where there were no Japanese
  troops", and the move south in July 1941; Map 1 (*The Japanese Plan for War*)
  viewed again for the colonies.
- **Romanus and Sunderland, *Stilwell's Mission to China*, Map 1**, viewed:
  its title is *Japanese Plan, December 1941* (after Imperial GHQ Army Order No.
  575, 3 December 1941), not "The Japanese in China, 1941" as ROUND-2.md §7
  names it; it draws the areas Japan meant to hold (north China from
  Hsisunitewangfu and Anpei to the Yellow River, Hofei, Nanking and Shanghai;
  the Yangtze from Ichang to Nanchang; Canton to Swatow; Hainan), which agree
  with the Atlas's first page that the eve's keyframe already uses.
- **The Lytton Report** (League of Nations C.663.M.320.1932.VII): the World
  Digital Library's scan on archive.org, the list of maps and ch. IV. Its
  fourteen maps ("inserted in the pocket of the cover"), among them *Military
  situation in Manchuria before September 18th, 1931* and *about May 1st,
  1932*, are in neither scan reached (that one, and Chūō Kōron's Japanese
  translation of 1932, `archive.org/details/lytton-report`, whose 181 leaves
  were looked through); the League's copy at UN Geneva answers with a challenge
  page. The front is therefore not traced from it, and since its licence is not
  settled here (`unknown` in the ledger) it is cited only on the prologue
  chapter, never on a front feature (the front check takes public-domain
  sources only).
- Wikipedia was used only to find these.

## 2. How the six keyframes are built

`tools/fronts/build.py` writes all fourteen keyframes; the six new ones are
schematic, by the hand-region method of 1942 (research/content.md §3):

- **The holders by date** (`default_state`): Japan, Korea, Taiwan and Karafuto
  held throughout; Manchukuo's territory held from 1932-03-01 and China's
  ("China") before; French Indochina `neutral` until Japan's troops come in
  (the colony was at war with no one, as Thailand is drawn on the eve), then
  `garrisoned`; everything else as the eve's keyframe has it (China, the
  colonial powers' territories, the United States and the Philippines
  `allied`; Thailand, Mongolia, Tibet, Portuguese Timor `neutral`; the Soviet
  Union `soviet`), so the cross-fade into 1941-12-06 is quiet. China is named
  "China" to 1937 and "Free China" after, as on the eve.
- **Hand regions** (`PROLOGUE`), each restricted to a territory and carrying
  its own sources: the Kwantung Leased Territory (every prologue keyframe), the
  South Manchuria Railway zone (1931), Jehol (1932, China's), occupied China
  (1937 on), the Nanning area and Tonkin (1940).
- **Occupied China is cut from the eve's extent.** The eve draws occupied
  China from the Atlas's first page (1 July 1943). The 1937 and 1938 regions
  are intersected with that page's Japanese cells (`occupied()`), so the
  hatch grows into the eve's and never draws past it, and its outer edges
  (the Mongolian frontier, the Yellow River in Shansi) are the page's own.
  1940 and 1941 take the page's extent less what is demonstrably later (below).
- Every prologue feature is `schematic`, cites a source beyond Natural Earth,
  and every prologue keyframe's note says "Schematic".

| keyframe | what it shows | on what |
| --- | --- | --- |
| 1931-09-18 | Japan, Korea, Taiwan, Karafuto held; the Kwantung Leased Territory (the Liaotung tip south of Pulandian and Pikou) held; the South Manchuria Railway zone, Dairen to Changchun with the Port Arthur, Yingkou and Fushun branches and the Antung–Mukden line, held as points and lines (a strip of a texel or two each side, since the zone itself is under the grid); Manchuria China's; the Mandate's islands Japanese (places.json, from 1914) | JM-144 ch. I; Morton ch. II; Peace and War ch. II |
| 1932-03-01 | Manchukuo proclaimed: the Manchukuo territory held less Jehol, which stays China's (occupied from January to March 1933; held from the next keyframe, as ROUND-2.md allows) | JM-144 ch. I; Peace and War ch. II; Morton ch. II |
| 1937-12-31 | Manchukuo with Jehol; occupied China: the Hopeh plain to Anyang and Shantung north of the Yellow River to Tsinan; Chahar and Suiyuan to Paotow (the Mongolian Federal Autonomous Government of 28 October); the Peiping–Kalgan line; the railways of northern Shansi to Taiyuan and Pingyao and the Shihchiachuang–Taiyuan line; the Shanghai–Nanking–Hangchow corridor with Wuhu, Yangchow and Chuhsien. The Wutai and Taihang mountains between the railways are left out, a hole in the hatch | JM-70 General Reference Maps I and II; JM-144 ch. II; the Atlas p. 4 for the outer edge |
| 1938-12-31 | JM-144's front at the end of 1938: from west of Anpei down the Yellow River to Tungkwan, east to Kaifeng, south along the Peiping–Hankow railway (Hsinyang) to Yochow, east by Yungsiu (Nanchang, March 1939, left out) to Hangchow; the arc round Canton from Samshui north of Huahsien and Tsunghua to the Pinghai peninsula; Shantung whole; northern Kiangsu east of the Tientsin–Pukow railway left out until February 1939; Hainan China's until February 1939 | JM-144 ch. III p. 42; JM-70 maps and p. 47; the Atlas p. 4 |
| 1940-09-30 | Tonkin `garrisoned` (Vietnam north of Annam, less Laos), the rest of French Indochina `neutral`; occupied China as the eve, less western Yunnan and less Chekiang and Fukien south of the Ch'ien-t'ang (taken in April 1941); the Nanning area, Chinhsien to Nanning and on to the frontier at Chennankuan, held | Peace and War p. 96; Morton ch. II; JM-70 pp. 62–68; the Atlas p. 4; Romanus and Sunderland Map 1 |
| 1941-07-31 | all French Indochina `garrisoned`; occupied China as the eve, less western Yunnan | Peace and War p. 123; Morton ch. IV; JM-70 pp. 66–69; the Atlas p. 4; Romanus and Sunderland Map 1 |

The eight existing keyframes rebuild byte for byte (`cmp` against the
committed files, before and after the change); `lines.geojson` too.

## 3. What is schematic, and why

- Every polygon of the six. No public-domain *map* of the prologue's fronts
  was reached at a usable size: the Lytton maps are not in the scans, Morton's
  Map 1 draws the plan of December 1941, JM-70's two reference maps draw
  arrows and dates rather than areas. The regions are drawn from the dates and
  the named places, then cut from the 1943 page's extent.
- The Kwantung Leased Territory's northern line (about 39.55° N, north of
  Pulandian and Pikou, south of Wafangtien) and the railway zone's width (the
  real zone was a few hundred metres either side of the track and its towns;
  the strip is about 25 km wide so the table, at 14 km a texel, can show it).
- Jehol's boundary with Fengtien and the Hsingan provinces, and Tonkin's with
  Annam (the line north of Thanh Hoa), from today's provincial lines by eye.
- The 1937 and 1938 regions' inner edges between the named places.
- Manchuria on 1932-03-01 is drawn as the state claimed it; JM-144 has the
  north-west (Hailar, Manchouli) taken only on 5 December 1932, and the
  Kwantung Army fighting in the north through 1932.

## 4. What could not be settled

- **Inherited from the eve's keyframe**, which ROUND-2 freezes byte for byte
  and which the 1940 and 1941 extents follow so the cross-fade stays quiet:
  the 1943 page's thin hatch along the coasts of Fukien, Kwangtung and Kwangsi
  and along China's border with Tonkin and Yunnan's (the page's line work and
  white sea read as enemy-held; Japan held points on that coast, not the
  coast), and the Chekiang lobe south of Hangchow taken in April 1941 (right
  for 1941-07-31, left out of 1940-09-30). Western Yunnan, taken from Burma in
  May 1942, is on the eve's keyframe but left out of 1940 and 1941; so from
  August to December 1941 the cross-fade shows it coming in. Whoever reworks
  the eve's China should take it out there, and look at the coastal strip.
- The road from Nanning to the frontier at Chennankuan, held in September
  1940, is inferred: JM-70 names the Chinhsien–Nanning area and the advance
  into Tonkin, not the road.
- Mengchiang's northern and western limits are the 1943 page's, for 1937 as
  for 1941; the Japanese-backed Mongol government held the Chahar and Suiyuan
  leagues from 1937, but its edge in the grasslands is not drawn anywhere
  reached.
- The east Hopeh demilitarised zone of 1933 and the East Hopeh regime of
  1935–1937, Chahar's north in 1935–1936, and Shanghai's settlement fighting of
  1932 fall between keyframes the ids freeze; the cross-fade from 1932 to 1937
  draws the north China gains coming in over five years.
- Thailand's annexations of 1941 in Laos and Cambodia (today's borders stand,
  as research/content.md §3 says for the whole front); Kwangchowan, the French
  lease beside Leichow, is under the grid.

## 5. The first doors

`firstDoor` in each battle file (ROUND-2.md §1.2 and §7), the moment's
existing role and time where one stands:

| box | role | station | t | why this one |
| --- | --- | --- | --- | --- |
| Pearl Harbor | aircraft `welch-taylor` (a P-40B from Haleʻiwa) | pilot | 08:31 | a minute after the pair's take-off at 08:30; the group carries `namedCrews`, so the door flies a spare, and carries a `start` (from the Haleʻiwa site, 2.5 km at 175°, 600 m, 75 m/s, heading 175°, toward ʻEwa as the route goes) |
| Midway | aircraft `vf-3-cap-noon` (a Wildcat of Yorktown's combat air patrol) | pilot | 11:59 | Yorktown's radar has had Hiryū's strike since 11:52; the CAP met it well out; the group has twelve, so a member is taken where the record has it |
| Ironbottom Sound | ship `gwin` | helm | 23:24 | as the bookmark `gwin-van`: fourth in the destroyer column below Savo, before the action opens |
| Samar | ship `johnston` | helm | 07:10 | as the bookmark `johnston-kumano`: she has turned out of the screen toward the cruisers |

Each title and text is in the stops' voice and says what is asked and that
nothing need be released (or fired, or launched). The roles carry `kit`,
`side` and a descriptive `name` as the moments' roles do, beyond §7's
`{ kind, unit | group, station }`.

## 6. The checks

- `tools/check/fronts.mjs`: the fourteen frozen keyframes in their order; the
  prologue's six schematic, each feature and keyframe citing a source beyond
  the coast, each note saying "Schematic"; Korea, Taiwan, Karafuto and the
  Kwantung Leased Territory held on every keyframe (a General Order No. 1 zone
  on the last); Manchuria held from 1932-03-01 and not before (Kirin, Harbin,
  Tsitsihar; Changchun is the railway's end and held in 1931); Jehol from
  1937-12-31; Tonkin garrisoned from 1940-09-30 and the south from 1941-07-31
  to the coup, neither before; the Mandate's islands Japanese in places.json
  from before the first keyframe. **Departure:** §8 says "the Mandates held on
  every keyframe"; the record takes Kwajalein, Saipan and the rest in 1944, so
  the check holds each island from before 1931 to its own interval's end,
  which is what places.json draws. The garrison test is unchanged.
- `tools/check/battle.mjs`: `firstDoor` present (a warning on the fixtures);
  its role takeable by §2 at its t from the file's flags (fixed, hospital,
  tokkō, a fixed fate's cause, parked, not yet airborne, landed, past its fate,
  index 0) and `namedCrews` (a spare; its `start` held as a moment's, a warning
  if a spare has none); the station in the vocabulary and one the kit offers by
  §3's rule (`stationsOf`, exported, `kit.stations` overriding); title and text
  through the voice rules and free of game words.
- Spoiled copies of the data (a fixed unit as the door, a game word, a door
  before the launch and on the leader, past a fate, a station the kit lacks;
  keyframes out of order, a mapped prologue feature, Korea Allied, Manchukuo
  not held, Indochina garrisoned early, a Mandate island Japanese only from
  1941) each trip their rule.

## 7. For the integrator, and what needs a person

- **DATA.md §6**: the prologue's keyframe is 1931-09-18 and the front has
  fourteen keyframes; **§9**: `firstDoor` as above, with the optional `start`
  for a spare and the role's `kit`, `side`, `name`. **DESIGN.md §3.1**: the
  prologue is drawn with its own front now, not the eve's; its table of
  chapters keeps 1931-09-18 as the prologue's keyframe.
- **engine-2**: `takeControl({ kind: 'aircraft', group: 'welch-taylor', station:
  'pilot' })` at 08:31 allocates a spare (the group's crews are named); place it
  at `firstDoor.start` (as `applyStart` does for a moment) when the door is
  taken, or it has no position.
- **ui-2**: *Start here* reads `firstDoor.title` and `.text`; the tour opens
  the prologue on 1931-09-18 now (its keyframe).
- **Outside my files**: `src/table/states.js` labels `allied` "held by the
  Allies", which reads oddly over China and the colonial powers in 1931–1941
  (the eve already has it); a prologue legend word ("not held by Japan") is a
  table change. `public/data/table/labels.json` letters MANCHUKUO and Hsinking
  on the table in 1931, before the state; labels carry no dates. The ledger's
  `romanus-1953` still says `read: "title"` though its Map 1 is now viewed
  (sources.json additions only, so left). `tools/fake-battle.mjs` (engine-2's)
  writes no `firstDoor` into the fixture, so the check warns there.
- **A person**: the regions against a period map each (the Lytton maps, if
  someone can reach the League's copy; the Japanese army's own situation maps
  in the Senshi Sōsho, cite-only); the Kwantung line; Mengchiang's edge; the
  inherited coastal strip of the eve.

## 8. Rebuilding

```bash
FRONTS_DOWNLOADS=/path/to/downloads python3 -I tools/fronts/build.py      # all fourteen
FRONTS_ONLY=1937-12-31,1938-12-31 FRONTS_DOWNLOADS=... python3 -I tools/fronts/build.py   # some
python3 -I tools/fronts/lines.py
python3 -I tools/fronts/preview.py 1931-09-18 1932-03-01 1937-12-31 1938-12-31 1940-09-30 1941-07-31 --bbox=100,18,135,50 --k=14 --cols=3
```

(`FRONTS_PYLIB` as in research/content.md §3.) The prologue's regions read
nothing beyond the first round's downloads: the 1943 page (leaf 8) and Natural
Earth.
