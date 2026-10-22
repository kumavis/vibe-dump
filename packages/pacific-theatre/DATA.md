# Data contract

What the bake tools produce, what is hand-written, and what the app consumes.
`DESIGN.md` says why; this file says exactly what. Everything below lives
under `packages/pacific-theatre/public/data/` so Vite copies it into `dist/`
untouched and the app fetches it with relative URLs (`./data/manifest.json`).
It is committed, like every other built input in this repo, produced by hand
with the tools under `tools/`, and nothing is fetched from the network at
runtime.

The contract borrows the Hawaiian app's (`../holo-i-ke-au/DATA.md`) wherever
it fits, so that its decoder, pack format, gazetteer rules and audit carry
over by copying. Where this file is silent, that one holds.

## 0. Files

```
public/data/
  manifest.json              the table pack, its projection, its sources
  table/height.png           the table's relief (land and sea floor), §2
  table/coast.json           coastlines and small islands, §3
  table/labels.json          names on the table, §3
  chapters.json              the eight keyframes (the Hawaiian app's eras.json), §4
  clocks.json                every clock the record uses, by id, §4
  places.json                the gazetteer, with each island's holders by date, §4
  events.json                every pin, §4
  sources.json               the ledger, §4
  routes.json                fleet tracks and lanes, §5
  fronts/manifest.json       the front by keyframe, §6
  fronts/<keyframe>.geojson  land held, by state; the island groups' dashed perimeters
  fronts/lines.geojson       the declared lines: the 1941 perimeter, the Absolute National Defence Zone, General Order No. 1
  kits/ships.json            the ship classes, §8
  kits/aircraft.json         the aircraft types, §8
  boxes/manifest.json        every battle box's pack, §7
  boxes/<id>/height.png
  boxes/<id>/battle.json     the record of one battle: units, tracks, events, groups, stops, moments, §9
```

Hand-written: everything but `manifest.json`, the `height.png`s and
`coast.json`, which the bakes write. `labels.json` is seeded by the bake from
Natural Earth and finished by hand. `tools/check-data.mjs` checks all of it
(§10).

## 1. Projections

Two, with one interface (ENGINEERING.md §3). Every module that turns a
coordinate into a position calls `proj.toWorld([lon, lat]) → [x, z]` (an
array, as every Hawaiian caller destructures it) and `proj.toLonLat(x, z) →
[lon, lat]`, and asks `proj.unit` (metres per world unit), `proj.scaleAt([lon,
lat])` (the local scale factor, 1 where the projection is true) and
`proj.convergenceAt([lon, lat])` (grid north to true north, degrees) when it
needs them. Nothing else knows which projection it is under.

**The table** is one projection over the whole theatre: **azimuthal
equidistant on the sphere (R = 6,371,008.8 m), centred on the middle of the
theatre box** (R1 §5; RESEARCH.md §1). The manifest names it, and `geo.js`
also implements `laea` and `equirect` so the manifest could switch without
code:

```jsonc
"projection": { "kind": "aeqd", "lon0": 141.5, "lat0": 7.0, "unit": 1000 }
```

The centre is the middle of the theatre box R3 chose, 78°E to 155°W and 42°S
to 56°N (RESEARCH.md §3 D3), between Yap and Woleai.

The forward and inverse are Snyder's spherical forms (R1 §5.1 gives them in
full; a round trip over the theatre errs by under 1e-7 m). World units on the
table are **kilometres** (`unit: 1000`); x grows east and z grows south, as
in the Hawaiian app, so a map reads north-up with +z toward the viewer when
the camera looks north. Longitudes are normalised with one wrap,
`Δλ = ((λ − λ0 + 540) mod 360) − 180`, before projecting, which puts the
antimeridian in the middle of the table and the seam far off its west and
east edges; the bake splits nothing at 180° and merges Natural Earth's own
splits there (§3). Grid convergence is real in this projection (true north
leans 13° at Midway, 1° at Guadalcanal); labels and box placements take it
from `proj.convergenceAt([lon, lat])`.

**A box on the table.** Each box is rendered in its own frame (metres, origin
at its centre) and placed on the table by the manifest's `placement`: the
centre in table units and the projection's 2 × 2 Jacobian there (world km
per box metre, east and south), which is exact to first order over a few
hundred kilometres. The fly-down matches the two rigs through it.

**A box** is the Hawaiian app's local tangent plane, in **metres**
(`unit: 1`):

```
x = (lon − lon0) · cos(lat0) · 111320
z = −(lat − lat0) · 110574
```

with `lon0`, `lat0` at the box's centre, in the box's manifest entry. Over
400 km the error is under the stylisation of a diorama and under the
precision of any track in the record.

Heights stay in metres in every pack; the table applies a vertical
exaggeration of its own (a relief map's, tuned by looking: the Marianas
Trench and Fuji should both read), a box applies 1.0 to 1.3.

## 2. Packs

A pack is one raster footprint with a height image. The format is the
Hawaiian app's §2 exactly: an 8-bit **RGB** PNG, non-interlaced, `value = R *
256 + G`, `B = 0`, `metres = value * scale + offset`, decoded on the CPU into
a `Float32Array` and never sampled as a filtered GPU texture. Row 0 is the
north edge. `tools/lib/png.mjs` writes it.

`public/data/manifest.json`:

```jsonc
{
  "projection": { "kind": "aeqd", "lon0": 141.5, "lat0": 7.0, "unit": 1000 },
  "table": {
    "id": "table", "name": "The Pacific theatre",
    "bounds": [78, -42, 205, 56],                  // the theatre box in degrees, WGS84; east may exceed 180 (205 = 155°W)
    "envelope": [w, s, e, n],                      // the lon/lat the projected rectangle's corners reach, computed and fetched by the bake
    "size": [2048, 1830],                          // texels, on the PROJECTED grid: row 0 north, col 0 west (14,170 × 12,660 km at 6.9 km)
    "extent": [x0, z0, x1, z1],                    // the projected rectangle the texels cover, in world units (km)
    "height": { "file": "table/height.png", "scale": 0.5, "offset": -11000 },   // 0.5 m steps from −11000 m: the trench to the Himalaya in the corner
    "coast": "table/coast.json", "labels": "table/labels.json",
    "sources": [ { "id": "etopo-2022-60s", "title": "ETOPO 2022 60 arc-second surface", "doi": "10.25921/fd45-gt74", "url": "...", "fetched": "2026-10-22", "licence": "public domain" } ]
  }
}
```

- **The table's grid is regular in projected space**, not in lon/lat, because
  the table is drawn flat in projected space and a lon/lat grid would stretch
  across it. The bake forward-bins every ETOPO cell of the envelope into its
  projected texel, weighted by cos φ (true area), keeping land and sea apart.
- **Land is decided by Natural Earth, never by ETOPO.** A texel is land only
  where the land and minor-island polygons cover at least half of it; ETOPO
  supplies the height there. Elsewhere the texel is sea at ETOPO's depth,
  clamped to −1 m or deeper. ETOPO paints shoals as land (Salmon Bank, Tarawa's
  reef flat; R1 §3.3) and a rule that trusted it would put phantom islands on
  the table.
- Sea texels carry **real bathymetry**. The table's picture is mostly sea
  floor.
- **Sizes**: the table 2048 on the long side (5.5 to 7 MB measured); a box
  1024 by default (0.5 to 1 MB), 2048 only where a sortie flies low over
  land (Ironbottom Sound; about 3 MB). Keep the whole of `public/data/` under
  about 40 MB; v1 should land near 12 to 15 MB.
- **Encodings**: the table `scale 0.5, offset −11000` (−11,000 to
  +21,767 m: the projected rectangle's corners reach the Himalaya); every box
  `scale 0.25, offset −11000` (−11,000 to +5,383 m: the trench beside the
  Marianas and every island summit in the theatre). The manifest carries
  them regardless.
- A box pack (§7) has the same fields, in lon/lat bounds (a continuous range
  whose `east` may exceed 180, e.g. `[179, 27, 184, 33]`) with its own
  tangent-plane projection, regular in lon/lat as the Hawaiian island packs
  are (the difference from the table is in the projection kind, which the
  decoder does not care about).

## 3. Coastlines and labels

`table/coast.json`: a GeoJSON FeatureCollection in WGS84 lon/lat of land
polygons from Natural Earth 10 m `land`, `minor_islands` and `reefs`, clipped
to the table's envelope, with Natural Earth's antimeridian splits merged back
into whole polygons (longitudes may exceed 180 in this file, which is the
point), simplified to about 1.5 km for the table (the texel is 6 km; the
data's own resolution is about 500 m) and carrying:

- `kind`: `land | island | reef`
- `ne`: the Natural Earth feature id, for traceability
- `area`: km², so the app can drop the smallest polygons at the far zoom and
  draw an atoll as a dot

The strokes come from a second collection in the same file, `strokes`, built
from `ne_10m_coastline` and `ne_10m_minor_islands_coastline` (lines), so that
no false meridian is drawn along a merged split (R1 §4). The app draws the
polygons as a flat fill a hair above the sea where the relief pack has no
land texel (atolls, islets) and the strokes as ink everywhere (`lines.js`,
screen-space width, thinned by zoom). **No Natural Earth name string ever
reaches the screen**: its names are modern and its diacritics are wrong
(`KYÜSHÜ`); labels are the gazetteer's.

`table/labels.json`: an array of names the table draws, written by hand
from the gazetteer (the bake does not seed it, so no Natural Earth string
can slip through) in the **names the record uses** (1940s names; today's
name goes on the card, §4), positioned from Natural Earth's marine and
region polygons where they help:

```jsonc
{ "text": "Formosa", "today": "Taiwan", "ja": "台湾", "lonlat": [121, 23.7], "kind": "island", "rank": 2 }
```

- `kind`: `sea | group | island | strait | base | city | region | line` (the
  date line and the equator are `line` labels)
- `rank`: 1 (always shown) to 4 (only when zoomed on it); the app thins
  labels that collide, lowest rank first
- `ja`: the Japanese name when the record uses one (*verify* until R2's
  reading)

## 4. Gazetteer and events

The Hawaiian app's §4 with these differences. Coordinates are `[lon, lat]`;
longitudes may be written either side of 180 and are normalised on load. Ids
are kebab-case ASCII.

`chapters.json`, an ordered list of the eight keyframes (the Hawaiian
`eras.json` renamed, because these are months, not reigns; R3 §2 drafts
them: the prologue keyed to 1941-12-06, then 1942-05-08, 1942-09-15,
1943-11-01, 1944-08-15, 1945-01-15, 1945-07-01, 1945-09-02):

```jsonc
{ "id": "turn", "label": "the turn", "short": "The turn",
  "from": "1942-06-01", "to": "1943-02-09",          // the chapter's span; chapters abut and cover the whole span
  "keyframe": "1942-09-15",                          // the date the chapter's front shows; a key into fronts/manifest.json
  "note": "one paragraph, present tense", "sources": ["..."] }
```

`clocks.json`, every clock the record uses (R3 §7.4), so a time can name its
clock by id and the app can format by arithmetic (never by IANA zone names,
whose 1940s Pacific history is approximate):

```jsonc
{ "id": "usn-z+12", "offset": "-12:00", "name": "zone plus 12, Midway time", "side": "us", "used": "CINCPAC and the shore forces at Midway; the Naval War College analysis" }
// also: jst (+09:00), usn-z+10 (−10:00, the carriers at Midway), usn-z-11 (+11:00, Guadalcanal), usn-z-12 (+12:00, ONI's battleship action),
// usn-item (+09:00, Samar), hst-1941 (−10:30), hwt (−09:30), malaya-1941 (+07:30), ...
```

`places.json`:

```jsonc
{ "id": "midway", "name": "Midway Atoll", "ja": { "kanji": "ミッドウェー島", "romaji": "Middowē-tō" }, "alt": ["Midway Islands"],
  "kind": "atoll",                    // island | atoll | group | sea | strait | gulf | harbour | base | airfield | city | point | reef | region | sea-area | other
  "today": null,                      // today's name where it differs ("Chuuk" for Truk)
  "geometry": { "type": "Point", "coordinates": [-177.37, 28.2] },        // Point, LineString or Polygon
  "placePrecision": "ex",             // ex (3 km) | loc (25 km) | isl (an island or atoll) | reg (a province or archipelago) | sea (a sea area) | off (off the table: drawn as an edge marker pointing the way)
  "held": [ { "by": "jp", "from": "1942-06-06", "to": "1943-07-29", "cutOff": null } ],   // for islands and atolls: who held it, from when; the table computes the front's islands from these (§6)
  "sources": ["..."] }
```

`events.json`:

```jsonc
{ "id": "midway-1942", "title": "The Battle of Midway", "gloss": "four carriers in one day",
  "ja": { "kanji": "ミッドウェー海戦", "romaji": "Middowē kaisen" },
  "when": { "from": "1942-06-04T04:30-12:00", "to": "1942-06-07T05:01-12:00", "precision": "minute", "clock": "usn-z+12",
            "zoneNote": "the US Navy's zone plus 12 is UTC−12 (ISO offset −12:00); Japanese reports keep Tokyo time, 21 hours ahead, so their date is 5 June" },
  "chapter": "turn",
  "where": [ { "place": "midway", "role": "near" }, { "place": "midway-sea-kido-butai", "role": "fleet" } ],
  "kind": "battle",                   // battle | campaign | landing | raid | siege | sinking | occupation | surrender | political | bombing | atrocity | captivity | people | other (R3 §2.1)
  "flag": "box",                      // box (a battle box with sortie candidates) | view (a box the record plays, no sortie) | cards (pins and cards only); bombing, atrocity, captivity and people are always cards
  "tier": 1,                          // 1 core, 2 optional depth
  "sides": ["jp", "us"],              // jp | us | uk | in | au | nz | ca | nl | cn | ph | th | fr | su | mn | ina | mk, and the peoples' codes (chamorro, nauruan, banaban, okinawan, unangax, japanese-am, ...), each a key into a names table the app carries
  "zoom": ["table", "box"],           // table: a pin; box: it has a battle box
  "box": "midway",                    // the box id, or null
  "summary": "one paragraph, present tense, no counts",
  "stops": [ { "text": "...", "place": "midway", "zoom": "table" },
             { "text": "...", "zoom": "box", "t": "10:22", "camera": { "target": "kaga", "bearing": 200, "pitch": 0.45, "distance": 4000 } } ],
  "sources": [ { "id": "ussbs-campaigns", "where": "pp. 60–71" } ],
  "confidence": { "date": "firm", "place": "firm", "numbers": "soft" },
  "tellings": [ { "source": "...", "says": "..." } ],
  "routes": ["kido-butai-midway", "tf16-tf17-midway"] }
```

- **`when`** is ISO 8601 with an offset on every instant that has one.
  `precision` is `minute | hour | day | month`. `zone` is the clock the card
  shows, which is the record's clock for that event (R2 D1, R3's rule,
  RESEARCH.md §§2–3): local civil time of the place for things ashore; the
  battle's named clock for things at sea (Midway: zone +12; Guadalcanal: zone
  −11; Samar: Item, which is also Tokyo time; Pearl Harbor: Hawaiian time,
  UTC−10:30), with `zoneNote` where the two sides' clocks differ. **Any timed
  thing taken from a source keeps the source's own reading beside the
  absolute instant**: `{ "t": "...", "sourceClock": "0722", "sourceZone":
  "+09:00", "sourceDate": "1942-06-05", "source": "nagumo-1947" }`, so a
  conversion can be checked. The app stores UTC internally and shows the
  card's zone. `check-data` refuses an instant without an offset.
- A `box` event's stops with `zoom: "box"` carry `t`, a battle-clock time in
  the box's zone, and a `camera` in the box's terms (a `target` unit id or
  `[lon, lat]`, a compass `bearing`, a `pitch` 0..1 as the Hawaiian stops, a
  `distance` in metres).
- `kind: bombing | atrocity | captivity | people` events are always `flag:
  cards`: never a box, never a stop below `table` (§10 enforces). An event
  with no single honest place (the comfort system) has no pin and opens from
  its chapter's list (R3 D13).
- `when.from` and `when.to` are written in the civil date of the place, as
  the record kept there writes it; `when.alt` may give the other side's date
  where it differs (`[{ "clock": "jst", "from": "1942-06-05" }]`).
- The no-numbers rule holds: summaries and stops carry dates and times, never
  a count of ships, aircraft, people or tons; those live in `tellings`, as
  ranges, with sources.

`sources.json`: the Hawaiian entry plus `language`, `licence`, `ref` and a
`lending` access value (R2 §14, D9):

```jsonc
{ "id": "ussbs-campaigns", "title": "The Campaigns of the Pacific War", "author": "United States Strategic Bombing Survey (Pacific), Naval Analysis Division",
  "year": 1946, "url": "https://www.ibiblio.org/hyperwar/AAF/USSBS/PTO-Campaigns/index.html",
  "access": "open",                   // open | lending | print | paywalled
  "opened": true, "read": "part",     // read: full | part | title
  "language": "en",                   // en | ja | en (tr. from ja) | fr | nl
  "licence": "pd-us-gov",             // pd-us-gov | pdm | cc-by | cc-by-nc | cc-by-sa | nids-permission | copyright-cite-only | unknown
  "ref": "OPNAV-P-03-100",            // the archive's own reference: a JACAR RefCode, a NAVPERS/OPNAV number, a CINCPAC serial, a DOI
  "tertiary": false,
  "note": "..." }
```

- A source with `licence: copyright-cite-only` (Morison, the TROMs, the print
  syntheses) is read for facts and cited; its text, maps and charts are never
  reproduced and its unlicensed uploads are never linked (`url` may be `"—"`).
- A source with `licence: nids-permission` (JACAR's NIDS-held images, the
  Senshi Sōsho charts) is cited by RefCode; no scan, crop or tracing ships.
- Only `pd-us-gov` and `pdm` sources may stand behind an image or a traced
  layer (a front, a track chart); `check-data` enforces it through `fronts`
  and `routes` sources.

## 5. Routes

The Hawaiian "Routes" section holds, with these vocabularies:

- `kind`: `fleet` (a force's track), `strike` (an air strike's route out and
  back), `air` (an air route flown again and again: the B-29 lanes, the
  Hump), `convoy`, `lane` (a sea route used again and again: the submarine
  patrol areas, the Tokyo Express), `campaign` (the schematic arrow of a
  drive: the Central Pacific, the island hops), `schematic`.
- `pointPrecision`: `report` (noon positions or fixes from an action report
  or a war diary), `chart` (read off a published public-domain track chart,
  named: the Nagumo report's track chart, the USSBS *Campaigns* plates, the
  Naval War College diagrams), `orders` (the planned positions of an
  operation order, which are not logged positions: the Pearl Harbor standby
  and approach points from Japanese Monograph 97), `narrative`, `schematic`.
  A `report` route has dated waypoints. No route is drawn for the atomic
  missions (R3 D8).
- `side`: as events' `sides`, one value.
- Waypoints carry ISO instants with offsets.
- The sea rule: a `fleet`, `strike`, `convoy` or `lane` route keeps to the sea
  against `table/coast.json` except within 10 km of its ends and except a
  `strike` or `lane` in the air (`medium: "air"`), which may cross land. A
  `drive` is schematic and may cross anything.
- Every `fleet` route of a battle that has a box must also appear, at finer
  resolution, as a unit track in that box's `battle.json`; the check compares
  the two at the battle's start.

## 6. The front

The Green Books' own convention, as R3 §5.1 reads it: land held is a filled
area, islands are dated intervals, island groups get a dashed perimeter, the
sea is not filled, declared lines are their own layer.

`fronts/manifest.json`:

```jsonc
{ "keyframes": [
  { "id": "1942-09-15", "date": "1942-09-15", "file": "fronts/1942-09-15.geojson",
    "sources": [ { "id": "green-book-morton-strategy", "where": "Map 9, limit of Japanese advance 1942" } ], "note": "..." } ],
  "lines": "fronts/lines.geojson" }
```

Each keyframe file is a FeatureCollection in lon/lat (longitudes either side
of 180) with two kinds of feature:

- **Land**, polygons with `state`: `held | garrisoned | allied-with-japan |
  contested | allied | neutral | soviet`; `name` (what it stands for);
  `precision`: `mapped` (traced from the named public-domain map) or
  `schematic`; `pointsAndLines: true` where control was cities and railways
  (occupied China), which the app hatches instead of filling; `sources`.
- **Perimeters**, LineStrings with `kind: "perimeter"`: the dashed line the
  Green Books draw round the island area Japan controlled.

**Islands** are not in these files: each island or atoll in `places.json`
carries `held` intervals (`by`, `from`, `to`, `cutOff` from the date it was
bypassed), and the table computes which islands are Japanese on any date,
drawing a cut-off garrison in the old colour with a mark. The keyframe's
sources cover the islands too.

`fronts/lines.geojson`: the declared lines, dashed, labelled and dated, each
a LineString with `name`, `ja`, `from`, `to`, `sources`: Japan's planned
perimeter of 1941, the Absolute National Defence Zone (絶対国防圏) of
September 1943, General Order No. 1's lines at 16°N and 38°N.

Rules: every chapter names a keyframe that exists (the prologue's is
1941-12-06; the last, 1945-09-02, holds General Order No. 1's zones as
`state` values of their own: `zone-cks`, `zone-soviet`, `zone-seac`,
`zone-cincpac`, `zone-swpa`); polygons are valid and inside the table's
envelope; every keyframe's sources are public domain (§4). The app
cross-fades land between the keyframes either side of the date, switches
islands on their own dates, and hatches `contested` and `pointsAndLines`.
The sea is never filled.

## 7. Battle boxes

`boxes/manifest.json`:

```jsonc
{ "boxes": [ {
    "id": "midway", "name": "Midway", "event": "midway-1942",
    "bounds": [west, south, east, north], "size": [W, H], "metresPerTexel": [mx, mz],   // east may exceed 180
    "projection": { "kind": "tangent", "lon0": 181.0, "lat0": 30.0, "unit": 1 },
    "placement": { "centre": [x, z], "jacobian": [[a, b], [c, d]], "convergenceDeg": -13 },   // on the table, §1
    "height": { "file": "boxes/midway/height.png", "scale": 0.25, "offset": -11000 },
    "exaggeration": 1.0,                           // one constant for the renderer and the sim alike; never varies with the camera
    "sea": "gmrt",                                 // gmrt | etopo15: which supplied the sea floor
    "battle": "boxes/midway/battle.json",
    "sources": [ { "id": "glo-30", "title": "Copernicus DEM GLO-30", "url": "https://copernicus-dem-30m.s3.amazonaws.com/", "fetched": "...", "licence": "attribution",
                   "notice": "produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved",
                   "liability": "The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30" },
                 { "id": "gmrt", "title": "Global Multi-Resolution Topography synthesis (Ryan et al. 2009)", "url": "https://www.gmrt.org/", "licence": "cc-by-4.0", "credit": "GMRT, CC BY 4.0, resampled and clamped" } ],
    "credit": "Terrain produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved. Sea floor: GMRT (Ryan et al. 2009), CC BY 4.0, resampled." } ] }
```

The same strings live in the package's `NOTICE.md` and in the app's
Sources and credits panel (ENGINEERING.md §11), so the notice travels with
a fork or a download of the data.

```jsonc
```

- **A box's land comes only from Copernicus GLO-30** (every island the v1 and
  later battles need is present in it, Midway, Wake and Tarawa included; R1
  §2.2), read as a window of the COG at the overview whose cell is at most
  half a texel, shifted half a cell for its PixelIsPoint registration, and
  area-averaged into texels by the half-land rule (a texel is land where at
  least half of it is GLO-30 land, and holds the land mean, at least
  0.25 m). GLO-30 is a surface model: canopy and buildings read as terrain,
  which is right at diorama scale. Its notice goes verbatim into every box's
  `sources`.
- **A box's sea comes from GMRT** (`topo`, ESRI ASCII, as the Hawaiian bake
  fetches it, with its retries) at about texel resolution, or from ETOPO 2022
  15″ where GMRT fails or the box is open ocean; never shallower than −1 m at
  a sea texel, and never land (GMRT's land is wrong by hundreds of metres;
  R1 §3.1).
- Oʻahu's box (`pearl-harbor`) is the Hawaiian app's Oʻahu pack's footprint
  at its native 68 m (copied, with its sources), with GMRT for the sea a few
  tens of kilometres out; the carriers 200 nautical miles north stay off the
  box and the strikes enter at its edge (R9 E7).
- Every v1 box is sized so that every coast seen from the action lies
  inside it (Ironbottom Sound holds Guadalcanal's north coast and Savo's
  surroundings; Samar's box holds the island's east coast), because beyond
  a box's pack the ground is a flat deep sea.
- Boxes are listed in `tools/check/ids.json` with their `lon0`, `lat0`,
  bounds and size before the bake runs; the bake may refine bounds by less
  than a texel's worth and reports it.
- The box's size is set by the record: it must hold every unit's track from
  the battle clock's `from` to `to` with 10 km to spare; the check enforces
  it.
## 8. Kits

`kits/ships.json` and `kits/aircraft.json`: arrays, hand-written from R6's
tables (RESEARCH.md §6), every number with a source id in `sources`. The app
builds the models from these alone (`src/battle/kits/`). Units name a kit by
its `id`; a unit may override `name`, `ja`, `hull`, `colour` and `aa`.

A ship kit:

```jsonc
{ "id": "kaga", "class": "Kaga", "type": "cv",                 // bb | cv | cvl | cve | ca | cl | dd | de | ss | ap | pt
  "nation": "japan", "ships": ["Kaga 加賀"],
  "loa": 247.6, "beam": 32.5, "draught": 9.5, "displacement": { "standard": 38200, "full": 42500 },
  "speedKn": 28, "turn": { "tacticalDiameterM": 900, "rudderS": 12 },     // tacticalDiameterM: at speed; rudderS: seconds hard-over to hard-over
  "hull": { "bow": "straight", "sheer": 0.5, "freeboard": [14, 11], "stern": "cruiser" },
  "blocks": [                                                 // the silhouette, bow to stern; `at` is the fraction of loa from the bow, `side` for off-centre blocks
    { "kind": "flight-deck", "at": [0.02, 1.0], "w": 30.5, "h": 1.2 },
    { "kind": "island", "at": 0.45, "side": "starboard", "w": 6, "l": 18, "h": 10 },
    { "kind": "funnel", "shape": "downturned", "at": 0.5, "side": "starboard", "h": 8 } ],
  "guns": [ { "role": "main", "calibreMm": 200, "turrets": 0, "mounts": 10, "barrels": 1, "at": [0.55, 0.6, 0.65, 0.7, 0.75], "side": "both",
              "rangeM": 26700, "rofRpm": 3, "shellKg": 110, "mvMs": 835, "traverseDegS": 4, "elevationDeg": [-5, 25] } ],
  "aa": [ { "kind": "127mm", "mounts": 8, "barrels": 2 }, { "kind": "25mm", "mounts": 11, "barrels": 2 } ],   // as of the battle's date; a unit may override
  "torpedoes": null,                                          // or { "tubes": 2, "barrels": 4, "type": "type-93" }
  "armour": { "beltMm": 152, "deckMm": 38 },
  "fatal": 0.8,                                               // the damage (0..1) at which the ship is lost; calibrated so the record's hits sink what the record sank
  "aircraft": 72,
  "colour": { "hull": "ijn-kure-grey", "deck": "wood", "measure": null, "deckMarking": "hinomaru-forward" },
  "silhouette": { "source": "oni-41-42", "where": "p. ..." },  // the recognition manual the blocks were drawn from
  "sources": [ { "id": "oni-41-42", "where": "p. ..." } ], "notes": "..." }
```

- Block `kind` vocabulary (the generator knows these and nothing else):
  `hull-extension | flight-deck | island | bridge | pagoda | tower | cage-mast |
  tripod-mast | pole-mast | funnel | turret | casemate | hangar | deckhouse |
  crane | catapult | boat-deck | director`. `shape` refines a few: funnels
  `round | trunked | downturned | raked`, turrets `twin | triple | single`,
  pagoda `tall | short`.
- Turret positions are explicit in `guns[].at` so Yamato's two forward and
  one aft, Fusō's six along the length and Nelson-style layouts all come from
  data.
- Speeds are knots, dimensions metres, masses tonnes and kilograms as named;
  the app converts.

An aircraft kit:

```jsonc
{ "id": "sbd-3", "name": "Douglas SBD-3 Dauntless", "ja": null, "type": "dive",   // fighter | dive | torpedo | level | patrol | bomber
  "nation": "usa", "crew": 2,
  "span": 12.66, "length": 10.09, "height": 4.14, "weightKg": { "empty": 2905, "loaded": 4245 },
  "engine": { "kind": "radial", "hp": 1000 },
  "speedKmh": { "max": 402, "atAltM": 4900, "seaLevel": 365, "cruise": 298, "stall": 125, "diveLimit": 560 },
  "climbMs": 6.5, "ceilingM": 7780, "rangeKm": 1790, "enduranceS": 1800,   // enduranceS: how long a sortie may run before fuel ends it (sortie time, not the real endurance)
  "fatal": 1.0,
  "handling": { "rollDegS": 60, "turnS": 24, "note": "perforated dive flaps hold a 70° dive near 450 km/h" },
  "guns": [ { "calibreMm": 12.7, "count": 2, "position": "nose", "rounds": 360 }, { "calibreMm": 7.62, "count": 2, "position": "rear", "rounds": 2000 } ],
  "payload": [ { "kind": "bomb", "massKg": 454, "count": 1 }, { "kind": "bomb", "massKg": 45, "count": 2 } ],
  "torpedo": null,                                            // or { "type": "type-91", "dropSpeedKn": 160, "dropAltM": 50, "armRunM": 200 }
  "shape": { "wing": "low", "tail": "single", "canopy": "long-frame", "gear": "retract", "cowl": "radial", "dihedral": 8 },
  "colours": [ { "from": "1942-01", "to": "1943-02", "upper": "blue-grey", "lower": "light-grey", "insignia": "star-no-red" } ],
  "sources": [ { "id": "sac-sbd-3", "where": "..." } ] }
```

- Insignia vocabulary: `hinomaru | hinomaru-white-surround | star-red-centre
  | star-no-red | star-bar-red-outline | star-bar-blue | roundel-raaf |
  roundel-rnzaf`, dated by `colours[].from/to`; the check rejects a unit
  flying an insignia outside its dates.

## 9. The record of a battle: `boxes/<id>/battle.json`

The scenario file. Everything the box plays, and everything a moment needs.
The record's beats are data; the sim fills in between them.

```jsonc
{ "id": "midway", "event": "midway-1942", "title": "Midway, 4 June 1942", "ja": { "kanji": "ミッドウェー海戦", "romaji": "Middowē kaisen" },
  "clock": { "zone": "-12:00", "name": "Midway time (zone +12)", "from": "1942-06-04T04:00-12:00", "to": "1942-06-04T18:00-12:00",
             "others": [ { "name": "Tokyo time", "zone": "+09:00", "rule": "add 3 hours and take a day off the Japanese reports" },
                         { "name": "the US carriers' clocks (zone +10)", "zone": "-10:00", "rule": "take 2 hours off the carrier reports" } ],
             "note": "Zone +12 (UTC−12), as CINCPAC and the Naval War College use it; the Nagumo report keeps Tokyo time and the Tokyo date; the carriers kept zone +10" },
  "weather": { "wind": { "fromDeg": 135, "kn": 7 }, "sea": 2, "swellM": 1,
               "cloud": { "baseM": 600, "topsM": 1500, "cover": 0.3 }, "visibilityM": 40000,
               "squalls": [ { "from": "07:00", "to": "09:30", "polygon": [ ... ] } ] },
  "sides": { "japan": { "name": "Imperial Japanese Navy", "ja": "大日本帝国海軍" }, "usa": { "name": "United States Navy" } },

  "units": [
    { "id": "kaga", "kit": "kaga", "side": "japan", "name": "Kaga", "ja": "加賀", "group": "cardiv-1",
      "track": [ { "t": "07:00", "lonlat": [-179.69, 30.19], "courseDeg": 135, "speedKn": 28, "precision": "report", "source": "nwc-midway-1948", "sourceClock": "0400", "sourceZone": "+09:00", "sourceDate": "1942-06-05", "sourceNote": "Nagumo's chart: 315°, 170 miles from Midway" },
                 { "t": "10:00", "lonlat": [-179.0, 30.0], "courseDeg": 30, "speedKn": 24, "precision": "report", "source": "nagumo-1947", "sourceClock": "0700", "sourceZone": "+09:00", "sourceDate": "1942-06-05" },
                 { "t": "10:22", "lonlat": [-179.02, 30.13], "courseDeg": 300, "speedKn": 28, "precision": "chart", "source": "nwc-midway-1948", "sourceNote": "diagram D-3, read by eye, ±5′" } ],
      "events": [ { "t": "10:24", "kind": "hit", "by": "vb-6", "count": [4, 5], "where": "amidships", "sources": [ ... ],
                    "tellings": [ { "source": "parshall-tully-2005", "says": "..." } ] },
                  { "t": "10:25", "kind": "fire" },
                  { "t": "19:25", "kind": "sinks", "sources": [ ... ] } ],
      "fate": { "kind": "sunk", "t": "19:25" } },
    { "id": "dd-nowaki", "kit": "kagero", "side": "japan", "name": "Nowaki", "ja": "野分",
      "station": { "guide": "akagi", "bearingDeg": 45, "rangeM": 2500 } } ],

  "groups": [
    { "id": "vb-6", "kit": "sbd-3", "side": "usa", "name": "Bombing Six", "count": 15, "from": "enterprise",
      "launch": "07:06", "altM": 5800,
      "route": [ { "t": "07:45", "lonlat": [...], "altM": 5800 }, { "t": "09:55", "lonlat": [...], "altM": 5800 } ],
      "attack": { "t": "10:22", "target": "kaga", "profile": "dive", "fromDeg": 200, "pushOverM": 4500, "releaseM": 600 },
      "losses": [ [7, 9] ], "recover": { "t": "11:50", "to": "enterprise" }, "sources": [ ... ] },
    { "id": "cap-akagi-1020", "kit": "a6m2", "side": "japan", "count": 12, "from": "akagi", "launch": "09:50",
      "attack": { "t": "10:15", "profile": "cap", "altM": 300, "target": "vt-3" } } ],

  "stops": [ { "t": "10:20", "text": "...", "camera": { "target": "kaga", "bearingDeg": 200, "pitch": 0.5, "distanceM": 6000 } } ],

  "moments": [
    { "id": "vb6-kaga", "title": "Bombing Six pushes over on Kaga", "ja": null,
      "role": { "kind": "aircraft", "kit": "sbd-3", "side": "usa", "group": "vb-6", "name": "a Dauntless of Bombing Six" },
      "t": "10:21:30", "durationS": 180, "timeScale": 1,
      "start": { "from": "kaga", "bearingDeg": 200, "rangeM": 3000, "altM": 4500, "speedMs": 70, "headingDeg": 20 },
      "objective": { "kind": "dive", "target": "kaga", "text": "Put a thousand-pound bomb on Kaga's flight deck." },
      "beats": [ { "t": "10:22:00", "text": "The first section pushes over." }, { "t": "10:24:00", "text": "Kaga is burning from the island aft." } ],
      "record": { "hits": [ { "unit": "kaga", "count": [4, 5], "window": ["10:22", "10:26"] } ] },
      "after": { "text": "...", "sources": [ ... ], "tellings": [ ... ] } },
    { "id": "washington-kirishima", "role": { "kind": "ship", "unit": "washington", "side": "usa" },
      "t": "23:58", "durationS": 720, "timeScale": 2, "objective": { "kind": "gunnery", "target": "kirishima", "text": "..." }, "...": "..." } ],

  "sources": [ { "id": "nagumo-report", "where": "..." } ] }
```

Rules:

- Every `t` is a battle-clock time `HH:MM` or `HH:MM:SS` in `clock.zone`, on
  the clock's date unless it carries a full ISO instant (a battle that crosses
  midnight, as Guadalcanal's does, writes `"t": "1942-11-15T00:07+11:00"` or
  the clock's `from` is set the evening before and times after midnight are
  written `24:07`; the check accepts both and the app normalises). A `t`
  taken from a source whose clock differs from the battle's carries
  `sourceClock`, `sourceZone` and, where the date differs, `sourceDate`, as
  §4 says, so the conversion can be audited; the check recomputes it.
- A unit's `track` has two or more fixes each with a `precision` (`report |
  chart | narrative | schematic`); between fixes the sim steers a smooth
  course at the fix's speed. A unit with a `station` and no `track` keeps
  station on its `guide`. A unit may have both (station until a track fix
  takes over).
- A unit may carry `fixed: true` (its record fate happens in every run and
  no player role may be the cause of its events: Arizona, Oklahoma and Utah
  at Pearl Harbor), `hospital: true` with `target: false` (Solace), or
  `tokko: true` (a tokkō aircraft or unit, never a player role; its attack
  is drawn as the record's track and hit). A unit past its kit's `fatal`
  is never a target (ENGINEERING.md §5).
- Event `kind` vocabulary: `hit | torpedo-hit | near-miss | fire | flood |
  list | dead-in-water | explodes | sinks | scuttled | launches | recovers |
  turns | opens-fire | ceases-fire | smoke | searchlight | starshell | signal |
  sighted | withdraws | aground | other`. A `hit`, `torpedo-hit`,
  `near-miss`, `opens-fire`, `launches` or `scuttled` carries `by` (a group
  or unit id): the cause the sim checks before it fires the event
  (ENGINEERING.md §5, the authority rule). A `hit` carries `count` as a
  range, `where`, `damage` (the share of the target's `fatal` it does, so the
  record's hits sink what the record sank), sources and tellings where the
  tellings differ. A `sinks`, `explodes` or `dead-in-water` carries nothing
  but its time and sources: whether it happens is the damage model's call.
- A group's `attack.profile`: `dive | torpedo | level | strafe | cap |
  escort | search`. `losses` are ranges. A group with no `route` flies a
  straight line from its `from` unit's position at `launch` to its attack.
- A moment's `role` names a `kit` that exists and either a `unit` (a ship)
  or a `group` (an aircraft within it), never a person (no `pilot` or
  `name`: "an SBD of Bombing Six"), never a `tokko` unit, never the first
  wave's high-level bombers at Pearl Harbor, and never a unit whose events
  are another unit's `fixed` fate. Its `t` and `t + durationS * timeScale`
  fall inside the clock; `durationS` is the checkpoint, and the sortie may
  run on to the clock's `to`. The Samar box's clock ends before the
  Shikishima unit's attack on St. Lo (about 10:50), which is a closing card. `start` for an aircraft is a
  position relative to a unit; for a ship it is the unit's own track at `t`.
  `record` lists what the record gives the player's unit or group
  (`hits`, with a window), for the after-card's comparison (DESIGN.md §5.7).
  `after` has text and at least one opened source, and its text speaks of
  the record only; the outcome of the player's battle is computed, never
  written.
- `timeScale` is 1 for aircraft moments; ship moments may use 2 or 3
  (DESIGN.md §5.5); nothing else.
- The copy rules of §4 hold for every text field.

## 10. What the check covers

`tools/check-data.mjs`, a runner over the modules in `tools/check/`
(`packs`, `gazetteer`, `routes`, `fronts`, `kits`, `battle`; `common.mjs`
and the frozen `ids.json`), no dependencies beyond `tools/lib/png.mjs`,
exits 1 with a list of problems:

- every id unique and kebab-case; every reference (`chapter`, `place`, `box`,
  `kit`, `unit`, `group`, `source`, `route`, `event`, `keyframe`) resolves;
- every date and instant parses, carries a precision and a zone where the
  schema asks, and falls inside its container (an event in its chapter's
  span with a warning if not; a track inside its clock; a moment inside its
  clock);
- every card-bearing thing (event, route, box, moment) cites at least one
  source that was opened; `read: "title"` sources are cited only beside an
  opened one;
- numbers appear only in tellings and in the typed fields (`count`, `losses`,
  kits): a summary, stop, beat, note or after-text containing a count of
  ships, aircraft, people or tons fails (the Hawaiian app's regexes, extended
  for "aircraft", "planes", "men", "sailors", "crew", "tons", "sorties");
- the copy rule: no user-facing text says what the app does not draw, show or
  offer (the Hawaiian phrases plus "not depicted", "not shown", "we do not",
  "never shown");
- the voice rules (R8 §5.5): no slur, in either language, outside a `quote`
  field; no glory word in the app's voice (英霊, 散華, "gave their lives",
  "ultimate sacrifice", "heroes"); "internment" only inside quotes or for
  the Justice Department camps; "kamikaze" never without "tokkō" on the
  same card; "saved", "what if" and "victory" nowhere in an after-card; a
  Japanese personal name in the app's voice written family name first;
- scores: no moment's `objective` or `after` names a score in people; a
  score field is one of hits, torpedoes, aircraft, returned, time; an
  after-card's "your battle" lines carry no number beside men, crew, lives,
  dead, killed, died, people, 人, 名 or 命;
- fates and targets: a `fixed` unit's events name no cause a player role
  could be; a `hospital` unit has `target: false`; no moment's role is a
  `tokko` unit or a person; the Samar clock ends before the St. Lo beat;
- credits: every box manifest that uses GLO-30 carries the licence's
  "produced using" notice and its liability sentence verbatim, and every
  one that uses GMRT its citation and "resampled" (DESIGN.md §13, R8 §6.6);
- `kind: massacre | internment | bombing` events have no `box` and no stop
  below `table`; no moment's `role` is on a `kamikaze` or `tokko` group
  (`attack.profile` has no such value, and a group named so fails);
- routes keep to the sea as §5; fronts are valid polygons inside the table
  (§6); each box holds its tracks (§7); every kit cited; every insignia
  dated (§8);
- the table pack decodes and its land fraction is plausible (between 10 and
  20 per cent of the texels over the theatre); each box pack decodes and its
  coastline agrees with `coast.json` within two texels at the box's edge.

Warnings (printed, not failing): an event with no `ja` whose `sides` include
Japan; a unit with a `schematic` track in a moment's window; a source with
`opened: true` and no `read`.

## 11. How to bake

```bash
node packages/pacific-theatre/tools/bake-table.mjs --all        # download (ETOPO 2022 60″ over OPeNDAP in two pieces, ~65 MB at stride 2; Natural Earth zips), bake table/, check, clean
node packages/pacific-theatre/tools/bake-box.mjs midway --all   # download (GLO-30 windows by range, GMRT or ETOPO 15″), bake boxes/midway/, check
node packages/pacific-theatre/tools/check-data.mjs              # the hand-written files against §§4–10
node packages/pacific-theatre/tools/smoke.mjs                   # the built app in headless Chromium: the table, a box, a moment
```

or `--download`, `--bake`, `--check`, `--clean`, `--preview DIR` as the
Hawaiian bakes. `--downloads DIR` (or `$PACIFIC_THEATRE_DOWNLOADS`) moves the
downloads, which stay outside the repo. Every download is recorded in the
ledger (`fetched.json`) with URL, date, size and SHA-256, and the manifests
take their `fetched` dates from it. Downloads go through `curl` (the
Hawaiian `tools/lib/fetch.mjs`), never Node's `fetch`, which ignores the
proxy; OPeNDAP URLs need `curl -g` so the brackets are not globbed. The
readers are small and dependency-free (a DAP2 reader for `.dods`; R1's
`dods.mjs` is the model) except the COG windows, which use the `geotiff`
package through a curl-backed client, and the shapefiles, which use the
pure-JS `shapefile` package; both are devDependencies.

## 12. What the app can rely on beyond the contract

- `coast.json` polygons are oriented (outer rings counter-clockwise) and
  non-self-intersecting after the merge at 180°; the app triangulates them
  with earcut-style code without checking.
- Every box's `battle.json` `units` are listed in formation order within a
  group (the guide first), so a renderer that draws a column can.
- Kits are complete: no field in §8 is optional except `torpedoes`,
  `aircraft`, `ja`, `catapult` blocks and `notes`; a kit missing a field fails
  the check rather than the generator.
- `labels.json` is sorted by rank then by text.
