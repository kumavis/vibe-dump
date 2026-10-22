# The table workflow's notes

The table workflow (ENGINEERING.md §13), 22 October 2026: the relief, the
ink, the names, the front, the routes and pins, the clock and the
interface, the Japanese font subset and the table's harnesses, built on
Stage 0's core and run on Stage 0's fixtures (`test-data/`, from
`tools/fake-data.mjs`). The real table pack, coast, labels, gazetteer and
fronts are the bake's and the content's, being built in parallel; nothing
here has yet been seen on them.

What I read, line by line unless noted:

- `ENGINEERING.md` §§0–4, 7, 9–13 (and §§5–8 for what the engine will hand
  the interface); `DATA.md` §§0–7, 9 (the moment and stop fields the
  briefing will be fed from), 10, 12; `DESIGN.md` §§3.5, 5.2, 5.4–5.6, 5.9,
  5.10, 7.3, 7.4, 8;
- `research/R9-reuse.md` §§2.3–2.11, 2.14, 2.15, 4.8–4.11; `R3-timeline.md`
  §2 and §5.1; `R8-tone.md` §5.1, §6.6–6.8, §7.4; `R7-game-design.md` §4.11
  and §4.13;
- `NOTICE.md`, `FONTS.md`, `tools/check/ids.json`, and every file of Stage
  0's core this workflow builds on (`app.js`, `config.js`, `geo.js`,
  `time.js`, `data/load.js`, `render/**`, the table and UI copies).

What I ran: the Stage 0 harnesses (`check-data`, `test-geo`, `test-time`,
`test-sky`, `fake-data`, `smoke`) before and after every step;
`tools/shoot.mjs` for every view below, each read as an image; a frame-time
breakdown under SwiftShader (below); `tools/subset-font.mjs` against the
fixtures, which fetched Noto Sans JP's TTF from Google Fonts into the
scratchpad's downloads directory.

---

## 1. Decisions

### D1. The sea is a chart's: a log ramp of depth and six isobaths

The floor is drawn where it lies and coloured by its depth on a log scale
(`relief.js` `bathymetric`): a pale sea-glass on the shelf, a clear blue
down the slope, a quiet slate blue on the abyssal plain, near ink in the
trenches. The first look at Stage 0's ramp had the plain a bright mid blue
that flattened the whole theatre view, so the deep end was taken down about
a third; the shelf and the trench now read against it (the fixtures'
Sunda-like shelf at −90 m and their trench to −10,000 m are the test). The
chart's isobaths are drawn at 200 m (a little stronger: the shelf's edge),
1,000, 2,000, 4,000, 6,000 and 8,000 m, as hairlines a pixel wide from the
depth's screen derivative, each fading out where lines that far apart
would come closer than a few pixels, so the far view keeps the shelf edge
and the trenches and the near view gains the slopes. *To retune on the real
pack*: ETOPO's real shelves and slopes have far more structure than the
fixtures' domes; the ramp's knots (0.06, 0.34, 0.66, 0.86, 0.92 of the log
depth) and the isobaths' strength (0.2) are the two knobs.

### D2. The ink in three sizes, and the small islands filled

`coast.js` sorts the strokes by what they outline (the polygon's `area`
through its `ne` id, else the stroke's own span) into three line sets:
large (≥ 3,000 km² or 120 km) inked at every distance; middling (≥ 60 km²
or 15 km) coming in from 17,000 to 11,000 km; small coming in from 6,500 to
3,500 km, where 15 km is about five pixels. The pen thins with distance,
0.75 px over the whole theatre to 1.5 px over an island group. Every coast
polygon with no land texel in the pack (tested at its vertices, its
centroid and points halfway to it) is triangulated once and drawn flat at
0.2 km: islands in the relief's lowland tint, reefs in a pale sand, so an
atoll reads as a reef ring with its islets (the fixtures' Test Atoll). A
polygon the pack does show is left to the relief, which has its height.

### D3. The grid, the equator, and the 180th meridian for the date line

`graticule.js` draws meridians and parallels every ten degrees (quieter over
the whole theatre, where they crowd), the equator a little stronger, and
the 180th meridian dashed, which the labels' "International Date Line"
names. The real date line bent round the Aleutians and the Fijian, Tongan
and Kiribati groups; those bends are not drawn. *Needs a person or the
content*: if the bends matter (the Gilberts sit on both sides of 180°), a
LineString in `fronts/lines.geojson` or a contract addition would carry
them.

### D4. Names: rank against distance, collision in the pins' loop

Rank 1 always; rank 2 within 9,000 km; rank 3 within 3,200 km; rank 4 within
1,000 km ("zoomed on it"); at most ninety on screen; placed in rank order,
each one that would overlap a pin, a cluster or a name already placed is
hidden. The UI calls `labels.update(pinRects)` right after the pins, so the
two share one frame. An island's name stands just above its point so the
front's mark of who holds it shows beneath; bases and cities stand beside a
mark (a square, a dot); a `line` label turns along its line on the screen
(on the equator or the 180th meridian; any other is drawn level and the
check warns). The kanji come through `lang="ja"`.

### D5. The front: two masks a keyframe, cross-faded, and a line where Japan's side ends

Each keyframe's land polygons are rasterised once, when a date first needs
them, into two textures 1,024 texels wide over the table's rectangle (about
13.8 km a texel; the polygons are schematic or traced from 1:10M-class maps,
so a sharper mask would claim a precision they lack): a fill (the state's
colour premultiplied by coverage) and marks (hatch, strength, Japan's
side). Four keyframes' textures are kept, the least recently used let go.
The relief samples the pair `WarClock.frontPair` gives and cross-fades them
by a smoothstep of its `t`, never a morph. The colour lies on land only, as
a tint at the relief's own brightness so the hillshade survives; the hatch
(`contested`, `pointsAndLines`) is diagonal hairlines in world space at a
power-of-two spacing near seven pixels, fading to the next spacing as the
camera moves, so it holds still; the front's line is the 0.5 contour of
each keyframe's Japanese-side coverage, a pixel and a half wide, cross-faded
as the fills are. The colours (`src/table/states.js`) are a brick red for
Japan's side in the Green Books' manner, a slate blue for the Allies, a
quiet colour of its own for each surrender zone; none is a flag's.

Perimeters are a dashed line set per keyframe in the front's red, faded with
its share of the cross-fade and labelled at the middle of their length;
declared lines are long amber dashes shown inside their own `from`–`to`,
labelled with `name` and `ja`. Islands with `held` intervals are instanced
marks in the holder's colour (Japan's red, the Allies' blue-white); from its
`cutOff` a garrison keeps the old colour inside a dashed ink ring on a pale
rim (Appleman's March 1945 map draws the bypassed garrisons as specks in a
dashed ring, R3 §5.1; the pale rim keeps it legible on a pale shelf, where a
first pale-only ring vanished).

### D6. The hand-over fade is the table's own

ENGINEERING §9 step 2 fades the overlays over the last third of the
fly-down. Rather than wait for the integrator to drive it, the table
computes it: while a box's outline is up (the stub and, presumably, the real
`Battle` raise it before flying), the overlays' strength eases from three
times the box's hand-over distance down to just above it, and the
exaggeration's near value becomes the box's, so the ridges do not jump at
the cut. It comes back as the camera climbs away or the outline goes.
`table.fadeOverride` (a number) lets the integrator take it over.

### D7. The clock reads in the event's own zone

The table's date is a UTC day (ENGINEERING §9's `#date`), but a Tokyo-time
day starts the UTC day before: the fixtures' July 1937 event, on Tokyo time,
showed "30 June 1937" on the clock beside a card saying "July 1937". While
the tour stands on an event the clock now reads the date in that event's
zone, as its card does; elsewhere it reads UTC. The instant is unchanged.

### D8. The tour

Chapters open on their card at their keyframe's date (the date their front
shows: the prologue opens on 6 December 1941, the empire on the eve), framed
round their events beside the card (never closer than 2,600 km of ground,
the whole table when the events are few). Events open at their place's
precision (650 km for an exact place, 800 for a locality, 900 for an island,
a polygon framed), a box event framed at about four times its box's size
with its routes on. Only `table` stops are walked; a box's stops are the
box's. A chapter's tick opens that chapter's card (the Hawaiian tick only
eased the year), which is what the thumbnail's click wants. A date set from
outside the tour and the slider (`#date`, the tools) leaves the tour, as the
slider does.

### D9. The cards

The event card shows the time on its own clock with the clock's name and
the other side's date (`when.alt`) and `zoneNote`; today's name beside each
place where it differs; the sides by name; the routes it draws; each source
with its access (lending, print, paywalled), its licence and its archive
reference, "verify" where not yet opened. A box event's footer gives *Enter
the battle* a row of its own. The briefing and the after-card are templates
fed by plain objects (`briefing.js` and `after.js` give the shapes), so the
engine and the integrator only hand them data. The after-card's four parts
carry both languages (あなたの出撃, あなたの戦い, 記録, その後) and keep its rules
whatever it is handed: a line in *Your sortie* or *Your battle* that sets a
number beside men, crew, lives, the dead, 人, 名 or 命 is left out and said in
the console, and "saved", "what if" and "victory" never appear (DATA §10's
own matchers). The credits panel is `NOTICE.md` itself, read into the
bundle at build time, then each box's `credit` and the table pack's
sources; the boot screen's footer opens it before any data has loaded.

### D10. SwiftShader

Under SwiftShader at 1280×800 a frame of the table took 0.95 to 1.35 s with
the interface up. A breakdown (scene drawn or not, multisampling on or off,
each layer hidden in turn; the machine shared with four other workflows, so
±20 %): the JavaScript of a frame is about 2 ms; the 4× half-float target's
resolve about half of the rest; the relief, the grid and the front the
remainder in roughly that order, with a floor near 0.4 s for the composite
and the page. So under a software renderer App turns multisampling off
(`?msaa` keeps it), the table's flights and the clock's easing run on the
wall clock (the frame loop clamps dt to 0.1 s, which made a 2.5 s flight
take 25 frames, half a minute), the grid's segments are 120 km, and
`app.settle()` skips the names' and pins' fades for two frames so the tools'
screenshots catch no fade. Measured in the smoke test's perf block after
these: **0.65 s a frame over the whole theatre (17 draw calls, 45,000
triangles), 0.44 s over an island group (14 calls, 20,000 triangles); the JS
heap 6.0 MB with 2.6 MB of buffers, unchanged across the run.** On a real GPU
none of this applies.

### D11. The Japanese face

`tools/subset-font.mjs` cut Noto Sans JP 400 to the 78 CJK characters the
fixtures and the app's own strings use (14.4 KB, 190 bytes a character),
and writes the list beside the font (`noto-sans-jp-subset.chars.txt`), which
`tools/check/table.mjs` holds the data against: a name the subset lacks is
a warning before it ships. The integrator reruns it on `public/data/`.

---

## 2. What I could not settle

- **How the table looks on the real data.** Every tint, every distance at
  which a rank or a size class comes in, the hatch's spacing over occupied
  China, the isobaths' density on ETOPO's real slopes, and the front's
  colours on the real keyframes were tuned on four made-up islands. The
  integrator should shoot `tools/shoot.mjs … gate` on the real data first
  and retune `relief.js`'s ramp, `labels.js`'s RANK_RANGE, `coast.js`'s size
  classes and `states.js`'s strengths by eye.
- **Frame time on a real integrated GPU.** Not measured here (SwiftShader
  only). The relief's fragment shader now carries six isobaths and the
  front's four samples and hatch; if an integrated GPU struggles, the
  isobaths can be dropped at far zoom (`uIso`).
- **The date line's bends** (D3).
- **Labels that collide with the front's own labels.** Perimeter and
  declared-line labels take part in the same collision pass at ranks 3 and
  2; on the real data, with several declared lines in 1945, a rank may need
  to change.

## 3. What needs a person

- The front's colours and words (`states.js`): a historian's and the
  designer's eye on "held by the Allies", "surrender to Chiang Kai-shek" and
  the zone colours, and on whether Allied-held land should be tinted at all
  (the Green Books leave much of it white; the legend would then say so).
- The Japanese headings of the after-card (ENGINEERING §11's wording) and
  the boot screen's second Japanese line (R8 §7.4 asks a native reader to
  choose among 砂盤 and ジオラマ phrasings).
- The prologue's mark on its card (a fleuron, ❧, where the chapters have a
  numeral).
