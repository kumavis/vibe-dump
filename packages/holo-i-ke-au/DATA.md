# Data contract

What the bake tools produce and the app consumes. `DESIGN.md` says why; this
file says exactly what. Everything below lives under
`packages/holo-i-ke-au/public/data/` so Vite copies it into `dist/` untouched and
the app fetches it with relative URLs (`./data/manifest.json`). It is committed,
like every other built input in this repo, and produced by hand with the tools
under `tools/`. Nothing is fetched from the network at runtime.

This is the phase-2 contract (the archipelago and whole-island views). Lidar
district tiles come later and will extend it, not change it.

## 1. Projection

One shared local projection, so every pack, boundary and pin lands in one world:

```
lat0 = 20.5      lon0 = -157.5                 (near the middle of the main islands)
x metres =  (lon - lon0) * cos(lat0) * 111320
z metres = -(lat - lat0) * 110574              (z grows south, as in the ahupuaʻa app)
```

Equirectangular on a sphere. Over 600 km the distortion is well under the
stylization of a diorama. The app's world unit is 100 m, as in `ahupuaʻa`
(`x_world = x_metres / 100`). Heights stay in metres in the data; the app
applies its own vertical exaggeration, which varies with zoom.

## 2. Packs

A pack is one raster footprint with a height image and optional companion
images on the same grid. `public/data/manifest.json`:

```jsonc
{
  "projection": { "lat0": 20.5, "lon0": -157.5 },
  "packs": [
    {
      "id": "archipelago",                     // or an island id below
      "kind": "archipelago",                   // "archipelago" | "island"
      "name": "Ka Pae ʻĀina",                  // display name, with diacritics
      "bounds": [west, south, east, north],    // degrees, WGS84
      "size": [W, H],                          // texels; row 0 is the NORTH edge
      "metresPerTexel": [mx, mz],
      "height": { "file": "archipelago/height.png", "scale": 0.25, "offset": -6000 },
      "rain":   { "file": "archipelago/rain.png" },      // optional
      "sources": [                                       // provenance, inline
        { "id": "usgs-3dep-1as", "title": "USGS 3DEP 1 arc-second DEM", "url": "https://...", "fetched": "2026-10-20", "licence": "public domain" }
      ]
    }
  ]
}
```

- **Island ids**: `hawaii`, `maui`, `kahoolawe`, `lanai`, `molokai`, `oahu`,
  `kauai`, `niihau`. Bounds pad each island with about 2 km of sea.
- **Sizes for this phase**: the archipelago pack is 2048 wide; island packs are
  at most 1024 on the long side. Packs need not be square. Keep the whole of
  `public/data/` under about 40 MB.
- **Height image**: an 8-bit **RGB** PNG, non-interlaced, carrying a 16-bit
  value split across two channels: `value = R * 256 + G`, `B = 0` (reserved).
  `metres = value * scale + offset`. The defaults above give 0.25 m steps from
  -6000 m to +10383 m, which covers the channels and Mauna Kea; a bake may
  choose others and must write them into the manifest. Sea texels are ≤ 0 m:
  real bathymetry if a source was available, otherwise a flat -1 m. Land is
  `metres > 0`. The app never assumes a value, it reads scale and offset.

  Why split bytes and not a 16-bit grey PNG: browsers decode 16-bit PNGs to
  8 bits, so the app could not read them losslessly without its own decoder.
  An 8-bit RGB PNG decodes exactly. The app must decode it on the CPU
  (`createImageBitmap` with `colorSpaceConversion: 'none'` and
  `premultiplyAlpha: 'none'`, then `getImageData`) and rebuild a `Float32Array`
  of metres, as the ahupuaʻa app already does with its generated heights; it
  must never sample the split bytes as a filtered GPU texture, because linear
  filtering across the high and low bytes gives garbage. The existing
  `ahupuaa/tools/png.mjs` writes exactly this kind of PNG.
- **Rain image**: 8-bit greyscale PNG on the same grid, `r = ln(mm_per_year /
  300) / ln(40)` clamped to 0..1, the encoding the ahupuaʻa shaders already
  read. Sea texels are 0.
- **Provenance**: every pack lists its sources inline in the manifest (id,
  title, URL, date fetched, licence). The boundary files carry the same in a
  top-level `sources` property. `sources.json` (§4) belongs to the gazetteer
  and holds the historical sources, not the data sources.

## 3. Boundaries

`public/data/boundaries/moku.geojson` and `ahupuaa.geojson`: GeoJSON
FeatureCollections in WGS84 lon/lat, simplified to roughly 50 m tolerance,
from the State GIS historic land division layers. Properties, kept verbatim from
the layer where they exist, plus:

- `name`: the division's name in the standard spelling: the ʻokina as U+02BB
  and the kahakō as a macron. (The layer writes fifteen names, most on
  Molokaʻi, with a turned comma or with Ï for Ī; its own fields keep those
  glyphs, `name`, `island` and `mokuKey` do not, and `check-data` rejects any
  other glyph there.)
- `island`: the island name
- `moku`: for an ahupuaʻa, its moku name
- `gisId`: the layer's own object id, for traceability

The app draws these as lines and uses the moku polygons to colour the polity
overlay. **Moku names are the join key** between the boundary file and
`polities.json`, so keep them exactly as `name` spells them, and keep the
island name beside them, because moku names repeat across islands (there is a
Kona on four islands).

## 4. Gazetteer and events

Four JSON files, the schema sketched in `DESIGN.md` §6, made precise here.
Coordinates are `[lon, lat]` (GeoJSON order). Ids are kebab-case ASCII.

`eras.json`, an ordered list of keyframes:

```jsonc
{ "id": "umi", "label": "in the time of ʻUmi", "year": 1600, "yearPrecision": 50,
  "note": "...", "sources": ["kamakau-ruling-chiefs"] }
```

`places.json`:

```jsonc
{ "id": "nuuanu", "name": "Nuʻuanu", "alt": ["Nuuanu"],
  "kind": "valley",                 // valley | bay | beach | heiau | puuhonua | fishpond | peak | pali | town | ahupuaa | moku | island | channel | sea | landmark | other
  "island": "oahu", "moku": "Kona", "ahupuaa": "Honolulu",
  "geometry": { "type": "Point", "coordinates": [-157.84, 21.35] },   // Point, LineString or Polygon
  "placePrecision": "exact",        // exact | ahupuaa | moku | island | sea
  "sources": ["pukui-elbert-mookini-1974"] }
```

`events.json`:

```jsonc
{ "id": "nuuanu-1795", "title": "Kalelekaʻanae", "gloss": "the battle of Nuʻuanu",
  "when": { "from": "1795-04", "to": "1795-05", "precision": "month" },   // precision: day | month | year | decade | generation | century
  "era": "kamehameha",              // the era keyframe it belongs to
  "where": [ { "place": "waikiki", "role": "landing" }, { "place": "nuuanu", "role": "battle" } ],
  "zoom": ["far", "island", "near"],
  "kind": "battle",                 // arrival | battle | founding | construction | eruption | epidemic | law | treaty | voyage | death | protest | restoration | other
  "summary": "one paragraph",
  "stops": [ { "text": "...", "place": "puiwa", "zoom": "near", "year": 1795 } ],   // a near stop may add "camera" (District packs) with an optional "target": [lon, lat] the view centres on while the pin stays at the place
  "sources": [ { "id": "kamakau-ruling-chiefs", "where": "ch. 12" } ],
  "confidence": { "date": "firm", "place": "firm", "numbers": "soft" },
  "view": "land",                   // optional: the far view the tour shows for this event (land | chiefdoms | mahele); by default the tour picks by kind
  "tellings": [ { "source": "fornander-v2", "says": "..." } ] }
```

`sources.json`:

```jsonc
{ "id": "kamakau-ruling-chiefs", "title": "Ruling Chiefs of Hawaiʻi", "author": "Samuel Mānaiakalani Kamakau",
  "year": 1961, "url": "https://...", "access": "open | print | paywalled", "opened": true,
  "read": "full | part | title",   // how much was read; title means not opened, and the app cites only full and part
  "note": "revised edition 1992; Hawaiian originals in Ka Nupepa Kuokoa 1866–71",
  "wanted": "what to look for in it" } // while opened is false (required), or read is part: the pages, figures
                                       // and names to bring back and the entries they would fill, for whoever opens it
```

`polities.json`, the far-view overlay, keyed by era then by `island:moku` using
the exact moku names from `moku.geojson`:

```jsonc
{ "polities": [ { "id": "hawaii-kingdom", "name": "Hawaiʻi", "colour": "#f0a35e" } ],
  "byEra": { "umi": { "hawaii:Kohala": "hawaii-kingdom", "maui:Hāna": "maui-kingdom" } } }
```

Rules, enforced by `tools/check-data.mjs`:

- every date has a precision; every place has a `placePrecision`
- every event and every place cites at least one source id that exists
- every place referenced by an event exists; every era referenced exists
- a place of kind `heiau`, `puuhonua`, `burial` or `shrine` may be `exact` only
  if it carries `"landmark": true` with a source showing it is an established
  public site (a national or state park, a listed historic site); otherwise it
  must be `ahupuaa` or coarser. Burials are never placed at all.
- numbers appear only inside `tellings`, each with its source, never as a single
  figure in `summary`
- a source with `"opened": false` is marked `verify` in the card, and carries
  `wanted`: the record of what to look for in it, so that whoever opens it
  knows what to bring back (ACCESS.md keeps the same for the sources no entry
  cites yet, and for the hosts and datasets that are not sources)

The first dataset found places where this schema ran short; RESEARCH.md §6
lists them. The additions it made are accepted as part of the contract: a
`note` on a place, `about`, `notes` and per-era `sources` in `polities.json`,
the confidence vocabulary `firm | soft | contested`, an `all-islands` place
for archipelago-wide events and a `kahiki` sea marker for arrivals from off
the map, and `tertiary: true` on a source that is only a finding aid.
`tools/check-data.mjs` is the enforcement and reads the moku keys from
`boundaries/moku.geojson`.

## How to bake

How `manifest.json`, the packs and `boundaries/` (§1–3) are made. The gazetteer
files (§4) are hand-written and the bake never touches them. Like
`npm run thumbnails`, this is a by-hand step whose output is committed.

```bash
node packages/holo-i-ke-au/tools/bake.mjs --all        # download, bake, check, delete the downloads
```

or step by step:

```bash
node packages/holo-i-ke-au/tools/bake.mjs --download   # ~160 MB (~450 MB on disk unpacked), a few minutes
node packages/holo-i-ke-au/tools/bake.mjs --bake       # writes public/data/, about 75 s and 1 GB of memory
node packages/holo-i-ke-au/tools/bake.mjs --check      # = node packages/holo-i-ke-au/tools/bake-check.mjs
node packages/holo-i-ke-au/tools/bake-preview.mjs /tmp/holo-preview   # shaded relief + lines, rain, per pack
node packages/holo-i-ke-au/tools/bake.mjs --clean      # delete the downloads
```

`--downloads DIR` (or `$HOLO_BAKE_DOWNLOADS`) puts the raw downloads somewhere
other than `<os tmpdir>/holo-i-ke-au-bake/downloads`; keep it outside the repo.
`--bake --only oahu,maui` re-bakes some packs and keeps the others' manifest
entries. The bake needs Node 22, `curl` (it honours the machine's proxy, which
Node's own fetch does not) and `unzip`, plus the `geotiff` devDependency. A
re-bake from the same downloads is byte-identical; only the `fetched` dates
move when the sources are fetched again.

GMRT builds each grid on request. Its GeoTIFF output sometimes answers with an
empty body for many minutes while the same request as ESRI ASCII works, so the
bake asks for ASCII. The download spaces and retries those requests, and if one
still fails it stops rather than let a pack quietly lose its sea floor. Run
`--download` again: finished files are kept and only the missing ones are
fetched. `--flat-sea-ok` accepts a flat −1 m sea for those packs instead. GMRT
cells deeper than 6,000 m are spikes (the archipelago grid has two near
−10,000 m, and nothing here is deeper than about 5,800 m). They are treated as
gaps.

### Sources

| data | source | licence |
| --- | --- | --- |
| land heights | USGS 3DEP 1 arc-second DEM, 1° tiles from `prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1/TIFF/current/`. 14 tiles hold the islands; n19w155, n19w157, n21w155 and n22w156 are published neither in `current/` nor `historical/` because they hold no land. | public domain |
| sea depths | GMRT synthesis 4.5.0 (multibeam with GEBCO fill), one GridServer request per pack at about its texel size (61 m nodes for most islands), as ESRI ASCII | CC BY 4.0, cite Ryan et al. 2009 |
| rain | Rainfall Atlas of Hawaiʻi, `StateASCIIGrids_mm.zip`, file `rfgrid_mm_state_ann.txt` (0.00225° cells, WGS84) | free with citation, Giambelluca et al. 2013 |
| boundaries | State GIS `HistoricCultural/MapServer` layer 1 (Ahupuaa, 727 features) and layer 3 (Moku, 33 features), as GeoJSON in EPSG:4326, paged 100 at a time | State GIS open data; not legal boundaries |

Each pack and each boundary file names its own sources inline, with the exact
URL and the date fetched.

### What the app can rely on beyond §1–3

- **Texel registration.** `bounds` are the outer edges of the grid. Texel
  `(i, j)` covers lon `west + i·dLon … west + (i+1)·dLon` and lat
  `north − j·dLat … north − (j+1)·dLat`, with `dLon = (east − west)/W` and
  `dLat = (north − south)/H`; its centre is at `i + 0.5`, `j + 0.5`.
- **Island boxes** are the island's ahupuaʻa extent plus 2 km of sea, so a
  neighbour that falls inside one is baked too (the Maui pack holds the north of
  Kahoʻolawe, and Molokini).
- **Land and sea.** A texel is land when at least half its area is land in the
  DEM, and then holds the area-weighted mean of the land part (never below
  0.25 m). Otherwise it is sea, from GMRT, never shallower than −1 m. (GMRT
  shows stair-stepped edges where its multibeam swaths meet the coarser GEBCO
  fill; they are in the source, not made by the bake.) Averaging
  the two classes apart keeps the coastline where it is: a plain average would
  push cliffs out to sea and drown low coasts. The DEM is a 2010s–2020s
  snapshot, so modern fill (the Honolulu reef runway, for one) is land and lies
  outside the historic boundaries.
- **Rain.** The atlas has no grid over Niʻihau, so the `niihau` pack has no rain
  image and the archipelago's rain is 0 there, which its `rain.note` says.
- **Extra manifest fields.** `boundaries` (the two file paths), per pack
  `stats` (`landFraction`, `minMetres`, `maxMetres`, `rainCoverage`), an
  optional `rain.note`, and a `note` on each source.
- **Boundary properties.** Besides `name`, `island`, `moku` and `gisId`, every
  feature has `islandId` (a pack id) and `mokuKey`, which is `islandId:name` of
  its moku and is exactly the key `polities.json` uses (`oahu:Koʻolaupoko`).
  The layers' own fields stay verbatim beside them.
- **Spellings.** A moku's `name` is the spelling its ahupuaʻa carry in layer 1,
  which is the SHPD-corrected one. Layer 3 differs for three moku (`Halele'a`,
  `Ko'olaupoko`, `Kipahulu`, still in its verbatim `moku` field) and writes
  every `mokupuni` with an ASCII apostrophe; `island` uses layer 1's `Hawaiʻi`.
- **Honuaʻula** (Maui) holds Kahoʻolawe and Molokini, as the layer has it, so no
  moku has `islandId` `kahoolawe`, and the moku layer's `mokupuni` for it reads
  `Molokini`. Select lines for a pack by its bounds, not by `islandId`. The
  Kahoʻolawe and Molokini ahupuaʻa are named `N/A` in the layer and have
  `name: null`.
- **Lines coincide.** Both files are simplified together (shared arcs,
  Douglas–Peucker at 50 m, finer where a ring would otherwise cross itself), so
  neighbours share identical edges and every moku vertex is an ahupuaʻa vertex.
  Rings are wound per RFC 7946.

The moku keys: `niihau:Kona`; `kauai:Koʻolau`, `kauai:Haleleʻa`,
`kauai:Nāpali`, `kauai:Kona`, `kauai:Puna`; `oahu:Koʻolauloa`, `oahu:Waialua`,
`oahu:Waiʻanae`, `oahu:Koʻolaupoko`, `oahu:ʻEwa`, `oahu:Kona`;
`molokai:Kona`, `molokai:Koʻolau`; `lanai:Lāhainā`; `maui:Honuaʻula`,
`maui:Kāʻanapali`, `maui:Pūʻali Komohana`, `maui:Hāmākualoa`,
`maui:Hāmākuapoko`, `maui:Lāhainā`, `maui:Koʻolau`, `maui:Kula`, `maui:Hāna`,
`maui:Kīpahulu`, `maui:Kahikinui`, `maui:Kaupō`; `hawaii:Hilo`, `hawaii:Puna`,
`hawaii:Hāmākua`, `hawaii:Kohala`, `hawaii:Kona`, `hawaii:Kaʻū`.

### What the check covers

`bake-check.mjs` reads everything back. It checks the manifest's shape and
provenance and each image's format, size and `B = 0`. Sea must be ≤ −1 m and
land > 0. It finds ten summits at their real coordinates and heights (Mauna Kea,
Mauna Loa, Haleakalā, Puʻu Kukui, Kaʻala, Waiʻaleʻale, Kamakou, Lānaʻihale,
Puʻu Moaulanui, Paniʻau), which also proves north is up and east is right. Each
pack's land must match the ahupuaʻa polygons (IoU 0.98–0.999). Rain must be wet
and dry in the right places, and every boundary feature must have its
properties and valid, non-crossing rings, its `name` the layer's own spelling made
standard (the ʻokina as U+02BB, the kahakō as a macron) and nothing else. It
lists every file under `public/data/` and fails over 40 MB.

## Routes

`public/data/routes.json`: the lines the far view draws over the sea, the
"voyaging and fleet routes, ship tracks" of `DESIGN.md` §2. An array of routes,
hand-written like the gazetteer (§4), checked by `tools/check-data.mjs` and drawn
by `src/render/routes.js`. RESEARCH.md "Routes" says what each one rests on.

```jsonc
{ "id": "cook-1778-kauai",                  // kebab-case ASCII, unique
  "title": "Cook at Kauaʻi and Niʻihau",
  "gloss": "the ships’ track from the journal, January 1778",
  "kind": "ship",                            // voyage | fleet | ship | trade | schematic
  "when": { "from": "1778-01-18", "to": "1778-02-02", "precision": "day" },   // as events (§4)
  "era": "kalaniopuu",                       // an era in eras.json
  "event": "cook-waimea-1778",               // an event in events.json, or null
  "from": null, "to": null,                  // the places its two ends stand for; null is the open sea
  "points": [[-158.594, 18.95], [-159.3167, 21.2], [-159.33, 21.82]],   // [lon, lat], three or more
  "pointPrecision": "journal",               // journal | narrative | schematic
  "direction": "oneway",                     // oneway | return
  "schematicSegments": [0, 14],              // optional: stretches that are only a bearing; 0 is points 0 → 1
  "waypoints": [ { "at": 1, "date": "1778-01-18", "note": "noon, as printed; Oʻahu and Kauaʻi in sight" } ],
  "summary": "one paragraph",
  "sources": [ { "id": "cook-1784-v2", "where": "bk. III, chs. XI–XII, pp. 191–221" } ],
  "confidence": { "date": "firm", "place": "firm", "course": "firm" },
  "tellings": [ { "source": "cook-1784-v2", "says": "Noon, 18 January: “latitude … 21° 12′ North; and longitude 200° 41′ East” …" } ] }
```

- **kind** says what moved. `voyage`: canoes of the voyaging traditions;
  `fleet`: a war fleet; `ship`: a foreign ship; `trade`: a lane that ships
  used again and again; `schematic`: a line standing for many voyages that were
  never recorded one by one (the first arrivals). A `schematic` kind always has
  schematic points.
- **pointPrecision** says how the points are known, and the renderer draws by it.
  - `journal`: positions written down at sea by someone aboard. A point is the
    day's noon latitude and longitude where the journal prints them, and is
    otherwise fixed from the bearings and distances of land it gives that day.
    The straight lines between points are joins, not the tacks the ship made.
    Drawn solid.
  - `narrative`: the places a narrative names, in its order, joined over open
    water a few kilometres off the coasts. A narrative point stands for a named
    shore, not a position. Drawn solid and finer.
  - `schematic`: a bearing, or a link between places; the line says only which
    way, or that the places were connected. The summary must say so, and the
    line is drawn dashed.
- **schematicSegments**, inside a journal or narrative route, marks the
  stretches that are only a bearing: an approach from off the map, or a
  departure from a place the sources do not name. They are drawn dashed.
- **direction**: `oneway` is travelled from the first point to the last;
  `return` is travelled out along the line and back along it, as the fleet that
  turned back in the Kaʻieʻiewaho channel. A round trip whose two legs differ is
  one `oneway` line that comes back.
- **from / to** name the place each end stands for, or `null` for the open sea.
  A named end must lie within a radius set by the place's precision: exact
  3 km, ahupuaʻa 10 km (the shore of a long ahupuaʻa like Wailua lies 8 km from
  its centroid), moku 30, island 90, sea 60. A `null` end must lie at sea.
- **waypoints** date and annotate single points; on a journal route they are
  the days. `at` indexes `points`, in order. Notes are provenance for the card,
  and like summaries carry no numbers: printed positions, bearings and counts
  go in `tellings`.
- **confidence** keys are `date`, `place` and `course`, each `firm | soft |
  contested`. A schematic course is never firm.
- **events** may list their routes in `routes: [ids]`; each listed route must
  exist and name that event back.

Rules, enforced by `tools/check-data.mjs`:

- ids, kinds, precisions and directions as above; `when` as for events (a
  precision for every date, the date written to that precision, from before to);
  `era` exists, with a warning when the dates fall outside it; `event` exists or
  is `null`.
- at least three points, every one inside the archipelago box (18.5–22.5° N,
  161–154.5° W), which also holds the `kahiki` marker; no point repeats the one
  before it.
- the line keeps to the sea: it is sampled every 250 m against the moku polygons
  of `boundaries/moku.geojson`. Land is allowed within 1.5 km of either end (a
  landing, a harbour) and up to 200 m inside the simplified coast elsewhere.
- the ends as above. A route with an `event` must meet it: an end names one of
  the event's places, or the line passes through one, or a named end lies
  within 20 km of one (a landing for a battle fought inland, as at Kakanilua).
- `schematicSegments` are segment indices; waypoint dates parse and fall within
  `when`. A journal route has at least three dated waypoints and cites an
  opened source that is not tertiary.
- the summary keeps the Hawaiian spelling and the no-numbers rule of §4; a
  schematic route says "schematic" in it; only a journal route may call itself a
  journal track in its gloss.
- every source exists and at least one was opened; tellings cite sources.

Places added for the routes, which they name as ends: `hawaii-island`,
`kohala-hawaii`, `upolu-point`, `kualoa`, `kalaeokailio`, `mokulau`,
`kiheipukoa`, `koolau-maui`.

`src/render/routes.js` draws the routes whose dates overlap the stretch of years
around the chosen one (the same half-an-era window as the pins), over the sea and
draped on the land at their ends, fading in as the view widens past a single
island. Its header says how `src/app.js` constructs and calls it.

## Era layers

The cultivation, settlement and forest overlays of `DESIGN.md` §2 and §5.5, per
island and keyframe, under `public/data/layers/`. Written by
`tools/bake-layers.mjs` from the island packs above and from the open sources
named in its manifest; nothing else writes there. RESEARCH.md §9
says what each source turned out to be and what is modelled.

### Files

`layers/<island>/<keyframe>-<layer>.png`, one per island pack, keyframe and
layer: 8 islands, 88 masks, about 4.9 MB with the manifest. Beside them stand
the zoning rasters and the crop classes (`<keyframe>-crop.png`, "Crops, on
the era layers" below), each with its own key in the manifest.

- **Registration.** Each mask has exactly the `bounds` and `size` of its island
  pack in `manifest.json`, so texel `(i, j)` is the same ground as in that
  pack's `height.png` (texel registration above). Nothing is resampled or
  halved. A pack holds the slivers of neighbours that fall in its box (north
  Kahoʻolawe and Molokini in Maui's), and the masks cover them too.
- **Format.** 8-bit greyscale PNG, non-interlaced, as `lib/png.mjs` writes it.
  0 everywhere the pack is sea (height ≤ 0). Unlike the height image, a mask
  is one byte per value, so the app may sample it as a filtered texture.
- **cultivation** and **forest**: `value / 255` is the share of the texel
  cultivated (loʻi, dryland fields, crops; a fishpond counts with the shore it
  sits on) or under native forest canopy.
- **settlement**: people per km² on a log scale,
  `d = d0 × (exp(value / 255 × ln(1 + dMax / d0)) − 1)` with `d0 = 2` and
  `dMax = 50000`. So 1 ≈ 0.08, 45 ≈ 10, 99 ≈ 100, 157 ≈ 1,000 and 214 ≈ 10,000
  people per km²; 255 is 50,000 or more. Blending bytes linearly between
  keyframes blends density geometrically, which suits a population that fell by
  halves. Each island's masks sum to its figure for the keyframe, within the
  rounding of the log steps (a few per cent where a few hundred people are
  spread over a whole island).

### Keyframes

| id | year | layers | eras that use it directly |
| --- | --- | --- | --- |
| `contact` | 1778 | cultivation, settlement, forest | voyaging (with the growth note), mailikukahi, umi, kakuhihewa, alapai, kalaniopuu |
| `mahele` | 1853 | cultivation, settlement | none exactly; kahekili to kauikeaouli and kauikeaouli to liliuokalani interpolate through it (the era `kamehameha-iv-v` was dissolved into `kauikeaouli`, 1834–1872) |
| `kingdom` | 1896 | cultivation, settlement, forest | none exactly; liliuokalani sits at t = 0.98 toward it |
| `now` | 2020 | cultivation, settlement, forest | coda |

`mahele` has no forest: nothing maps the forest of the 1850s, so forest
interpolates from `contact` to `kingdom` across it. The `eras` object in the
manifest gives, for every era in `eras.json` and every layer, either
`{ keyframe }` or `{ from, to, t }` with `t` linear in years. It is computed
from `eras.json` at bake time, so re-bake (or recompute from the keyframe
years) if the eras move. The coda stands at `now` whole: the timeline runs
on past the coda's own year to the present ("District packs" below), and
the layers hold at `now` all the way.

### `layers/manifest.json`

```jsonc
{
  "about": "...",
  "encoding": { "cultivation": "...", "forest": "...", "settlement": { "kind": "log density", "d0": 2, "dMax": 50000, "decode": "..." } },
  "keyframes": [ { "id": "contact", "year": 1778, "yearPrecision": 30, "label": "on the eve of contact, c. 1778",
                   "layers": ["cultivation", "settlement", "forest"], "note": "..." } ],
  "eras": { "kamehameha": { "year": 1807, "cultivation": { "from": "contact", "to": "mahele", "t": 0.387 }, "forest": { ... } } },
  "methods": {                       // per keyframe and layer, the same for every island
    "contact": { "cultivation": { "method": "modelled", "rule": "the rule written out", "sources": [ { "id", "title", "url", "fetched", "licence", "note" } ] } },
    "kingdom": { "settlement": { "method": "mixed", "rule": "...", "districts": [ ... ], "towns": [ ... ], "sources": [ ... ] } }
  },
  "islands": {
    "oahu": { "pack": "oahu", "size": [1024, 801], "bounds": [...],
              "layers": { "contact": { "cultivation": { "file": "oahu/contact-cultivation.png", "method": "modelled",
                                                        "stats": { "landFraction": 0.139, "overHalf": 0.19, "areaKm2": 218.3 } } } } }
  },
  "stats": { "files": 88, "bytes": 5011149 },
  "baked": { "tool": "tools/bake-layers.mjs", "calibration": { "oahu": { "kuleanaKm2": 19.65, "kuleanaInEither": 0.74, ... } } }
}
```

- **`method`** is `mapped` (read from a dataset of that time), `modelled` (a rule
  applied to the land; `rule` writes it out) or `mixed` (both; `rule` says which
  part is which). The app labels anything not `mapped`.
- **`stats`** per mask, over the pack's land: `landFraction` (mean value as a
  share; for settlement the mean byte), `overHalf` and `areaKm2` for
  cultivation and forest, and `people`, `peakPerKm2` and `over10PerKm2` for
  settlement.
- **Sources** sit inline in each `methods` entry, with the URL, the date the
  ledger recorded and the licence, as the pack manifest does. The population
  figures are in `methods.<keyframe>.settlement.populations` (or `districts`
  and `towns` for 1896).

| keyframe | cultivation | settlement | forest |
| --- | --- | --- | --- |
| contact 1778 | modelled: the Kurashima–Kirch traditional agriculture zones, a valley-floor loʻi rule read from the pack, the 1848–1855 kuleana parcels, a fishpond-shore rule | modelled: fields, coast and kuleana, scaled per island to King's 1779 estimate | modelled: rain, elevation and lava age, cleared below 460–760 m after Kirch, never less than the native forest standing now |
| mahele 1853 | mixed: kuleana parcels mapped, the contact zones kept at reduced weight | mixed: the 1853 census by island, spread by kuleana parcels and the contact weights | none (interpolate) |
| kingdom 1896 | mixed: 1900 cane and pineapple mapped, loʻi kept at 0.3–0.7 | mixed: the 1896 census by district, towns, cane camps, kuleana | mixed: between the contact forest less cane and new lava, and the forest standing now; forest reserves keep more |
| now 2020 | mapped: 2020 agricultural baseline crops | mapped: 2020 census block groups spread over CAH developed land | mapped: CAH native forest classes |

### How to bake the layers

Run the pack bake first; this reads `manifest.json`, each island's
`height.png` and `rain.png`, `boundaries/` and `eras.json`, and writes only
`public/data/layers/`.

```bash
node packages/holo-i-ke-au/tools/bake-layers.mjs --all                  # download, bake, check, delete the downloads (~1.5 min)
node packages/holo-i-ke-au/tools/bake-layers.mjs --preview /tmp/layers  # tinted previews, per island and keyframe
```

or `--download` (~490 MB, nearly all of it the 30 m CAH GeoTIFF), `--bake`
(about 50 s), `--check`, `--clean`. `--downloads DIR` (or
`$HOLO_LAYERS_DOWNLOADS`) moves the downloads from
`<os tmpdir>/holo-i-ke-au-bake/layers-downloads`; keep them outside the repo.
Same needs as the pack bake: Node 22, `curl`, the `geotiff` devDependency. A
re-bake from the same downloads gives the same masks; only `fetched` dates move.

The preview writes, per island, `<island>-<keyframe>.png` (forest green,
cultivation amber, settlement red over shaded relief, moku lines),
`<island>.png` (the keyframes side by side) and `<island>-layers.png` (a row per
keyframe, a column per layer).

### What the layers check covers

`--check` reads every mask back: greyscale, the pack's exact size, nothing over
sea, and `stats` equal to what the image holds. Every keyframe layer must have
a method from the three, a written rule unless mapped, and sources with title,
URL and licence; every era must map to a keyframe for each layer. It prints
coverage and people per island and keyframe, and fails if `public/data/layers/`
passes 8 MB.

## District packs

The close-up of one district (DESIGN.md §3.3, §3.4, §8): a finer pack that
takes over from its island pack as the camera comes down, with the patches
and features that let one valley be drawn in a chosen year. Under
`public/data/districts/`, with its own `manifest.json` (bake.mjs never
touches it). The first district is `nuuanu`: Honolulu's harbour and plain,
Nuʻuanu to the pali, with Kalihi and Mānoa at the edges. The second is
`koolaupoko`: the whole windward moku from Kualoa to Makapuʻu, with Kāneʻohe
Bay and Mōkapu, Kailua and Waimānalo.

```jsonc
// public/data/districts/manifest.json
{ "districts": [ {
    "id": "nuuanu", "name": "Nuʻuanu", "island": "oahu",
    "bounds": [west, south, east, north], "size": [W, H], "metresPerTexel": [mx, mz],
    "height": { "file": "nuuanu/height.png", "scale": 0.25, "offset": -6000 },   // as §2, split bytes
    "rain":   { "file": "nuuanu/rain.png" },                                      // as §2
    "patches": [ { "keyframe": "contact", "until": 1850, "file": "nuuanu/patch-contact.png" } ],
    "features": "nuuanu/features.json",
    "sources": [ ... ] } ] }
```

- **Grid**: regular in lon/lat like an island pack, at most 2048 on the long
  side, from the finest open elevation (the 2022–23 lidar for Oʻahu, else
  3DEP 1/3 arc-second), area-averaged down; the same land and sea rules as
  the islands. Bounds are outer texel edges.
- **Patches**: an 8-bit greyscale mask on the pack's grid, 255 where a texel
  that is land today was sea or reef flat in the keyframe's year (modern fill:
  the harbour, Sand Island, Kakaʻako, the Ala Wai, the reef runway). The app
  lowers those texels to a shallow reef flat when the chosen year is before
  `until`. Source the fill from the State geologic units' fill polygons and
  the georeferenced Government Survey maps; say which in `sources`.
- **Features** (`features.json`): a GeoJSON FeatureCollection in lon/lat of
  what stood in the district, each with `properties`:
  `kind` (`loi | fishpond | village | heiau | trail | stream | force | line | label`),
  `name` (with diacritics, or null), `from` and `to` (years the feature
  applies; open ends null), `precision` (`exact | mapped | inferred | schematic`),
  `role` (for `force`: `oahu | hawaii`; for `line`: `advance | stand | retreat`),
  `sources` (ids in `sources.json`) and an optional `note`. Loʻi and fishponds
  are polygons; the village is a polygon or a point with a `households`
  estimate in a telling, never a figure in `note`; a `force` is a polyline
  with a `when` (ISO date or month) so the battle can be shown moving step
  by step (DESIGN.md §8 says how), a `behaviour` from `march | run | stand |
  engage | surround | leap` (march walks the line; run is a retreat or a
  pursuit; stand is a post; engage fights along a `line`; surround closes on
  the line's end from all sides; leap goes over the edge at the line's end),
  and `arms`, shares that sum to one plus a `cannon` count, e.g.
  `{ "spear": 0.55, "club": 0.2, "sling": 0.1, "dagger": 0.05, "musket": 0.1, "cannon": 2 }`,
  so the renderer draws what the sources say each side carried; a `heiau` obeys §4's precision rule
  (ahupuaʻa precision unless an established public landmark).
- **Stops** for an event in this district carry, besides `place`, `zoom` and
  `year`, an optional `camera`: `{ "bearing": compass degrees the camera
  looks toward, "pitch": 0..1, "distance": world units }`, so the walk can
  frame the valley the way the text reads it. `pitch` is a fraction of a
  right angle: 0 looks along the horizon, 1 straight down; the app converts
  to the rig's radians. `distance` is in world units (1 unit = 100 m).
- **Accepted extensions from the first district.** A `force` role may also be
  `maui` (Kahekili's columns in 1783). Features may carry `id`, `event`,
  `when`, `step`, `side`, `place` and `site`, and a heiau carries
  `placePrecision` and `ahupuaa`; a feature's `to` year is the last year a
  source read shows it, not a sourced end. The district manifest may carry
  `projection`, `parent`, `files`, `breaches`, `streams`, `stats`, and a
  `source` and `note` on each patch. Two patches may share one mask when the
  sources cannot separate their years. A `shoreline-<year>.geojson` traced
  from a survey sheet is listed under `files`.
- **After the first render.** Every `force` and `line` carries `stop`: the
  0-based index of the stop of its `event` at which it shows (an array for a
  front shown at several stops); the app prefers it to any inference. A
  `stream` feature carries its `name` and `role: "reference"`: the app routes
  water from the heights and uses these for names and checks. A loʻi outline
  stays on the floor: `check-data.mjs` fails it above 10% of its texels over
  15% slope on the district heights and warns above 5%. And the copy rule of
  DESIGN.md §7.4 is enforced: no user-facing field says what the app does not
  show, place or draw; the checker fails on the phrases it looks for.
- **From the second district.** A district's own `patches` may be dated works
  as `patches/manifest.json` has them: an `id` and a `name` in place of
  `keyframe`, with `kind`, `depth`, `until`, `file`, `source`, `note`, `dates`
  (the ids among the district's `sources` that date it) and `stats`; no
  texel's weights of one kind over the dated works pass one. Two district
  boxes may overlap (Koʻolaupoko's holds about 70% of Nuʻuanu's, for the moku
  runs north-west to south-east): the manifest lists the districts in
  declaration order and each carries its `moku` (the boundary file's name);
  which district a point goes to is the app's rule, written under "District
  packs" ("Accepted for the second district"), with list order only as the
  last tie-break. A district's texel may run to 13.5 m where the district is
  large (Koʻolaupoko's is 12.98 m), and each district's directory stays under
  4 MB.
- **Accepted for the second district (Koʻolaupoko).** The manifest may list
  any number of districts; the app streams the one the camera comes down
  into, decodes it while the one before eases out, and draws one at a time.
  Which one: during the tour, the stop's place decides (or the event's
  first place, for its own view), for the flight the tour sends and while
  the camera stays where it landed; otherwise the point under a flight's
  landing, or the point the camera looks at, never the camera's own
  position (which may hang over the other district's box). Two districts'
  boxes may overlap (Koʻolaupoko's holds about 70% of Nuʻuanu's, Honolulu
  harbour and the pali among it): a point in both goes to the district
  whose moku it lies in, by the place's own `moku` in places.json for a
  stop, else by `moku.geojson` wherever no other moku comes within 500 m;
  a district's moku is its manifest entry's optional `moku` (the moku's
  `name`), else the moku that holds most of its box. On a moku's edge (the
  pali's notch) the one already down keeps the point, and with neither
  down the first listed takes it. A point in neither box but within reach
  of both (Kona west of both, as at the airport terminal) goes to the
  district whose moku it lies in, else to the nearer box. Manifest order
  is only that last tie-break among boxes that hold the point: not
  alphabetical order, nearest centre or smallest box. So `nuuanu` names
  `"moku": "Kona"` and stays first, `koolaupoko` names
  `"moku": "Koʻolaupoko"` (its box holds nearly as much Kona as
  Koʻolaupoko), and Kou, Puʻowaina, Kaheiki, Puʻiwa, Lāʻimi and the pali
  stay Nuʻuanu's while Kailua, Kāneʻohe, Heʻeia and Waimānalo are
  Koʻolaupoko's.
  A district drawn at several years needs nothing beyond the contract: each
  feature's `from` and `to` and each
  patch's `until` place it in time, and no `keyframes` list is read (the
  years a district was drawn at are its features' own). The ground has
  room for 22 loʻi, 23 fishponds and 16 villages each in years of their
  own; past that (Koʻolaupoko's 40 loʻi), those of one kind with the same
  `from` and `to` are drawn as one in time, so what counts is how many
  different spans of years a kind has, not how many features. A feature's or a
  stop's year may lie after the last era's year: where the last era's span
  (`year` plus `yearPrecision`) reaches the present, as the coda's does, the
  timeline runs on past that era's tick to this year (`src/time.js`), so a
  loʻi laid again in 2010 or a stop of 2017 stands at its own year. At the
  timeline's end no patch whose `until` has passed applies, the shore is the
  pack's own, and the settlements take their kinds from the zoning; the
  district layer assumes no year of its own.

### How to bake a district

`tools/bake-district.mjs` writes `public/data/districts/manifest.json` and, per
district, `height.png`, `rain.png`, the patches and their supporting files. It
never writes `features.json`, which is hand-written.

```bash
node packages/holo-i-ke-au/tools/bake-district.mjs --all                        # nuuanu: download (~1.5 GB), bake, check, delete the downloads (~6 min)
node packages/holo-i-ke-au/tools/bake-district.mjs --all --district koolaupoko  # koolaupoko: ~3.6 GB, about 25 min (1,419 lidar tiles)
node packages/holo-i-ke-au/tools/bake-district.mjs --preview /tmp/district      # every district: relief, lines, streams, breaches, patches, the old shores
```

or `--download`, `--bake`, `--check`, `--find-breaches` (the pits left on the
stream trunks, as breach entries), `--clean`. `--downloads DIR` (or
`$HOLO_DISTRICT_DOWNLOADS`) moves the downloads, as for the other bakes;
`--breach "lon,lat lon,lat;…"` carves other breaches than the district's own.

What `nuuanu` rests on (the manifest says it all again, per source):

- **Heights**: the USGS 3DEP lidar `HI_NOAAMauiOahu_2020_B20` (Oʻahu flown
  August 2022 to July 2023), bare earth at 0.5 m, 564 tiles, area-averaged to
  6.05 m. Its zero lies 0.72 m below mean sea level (measured against the
  CUDEM) and is moved to it. Water inside the coast is flattened in the survey
  to the level of the day, so a cell counts as land above +0.2 m; otherwise the
  island packs' rules hold. The windward face of the pali has no lidar tile:
  there (5.8% of the pack) the heights are the CUDEM's land, corrected to meet
  the lidar along the seam.
- **Sea**: NOAA's 1/9 arc-second CUDEM, never shallower than −1 m; water inside
  the coast the CUDEM holds as land (the Ala Wai, tidal stream reaches) is a
  flat −1 m. The Ala Wai and the dredged basins are today's sea, so no patch
  can raise them for 1795.
- **Patches**: land that the State geologic map calls fill and the 1881
  Government Survey map shows as sea or reef flat (the shore traced by hand,
  `shoreline-1881.geojson`). The 1899 sheet shows the same waterfront, so
  `contact` and `kingdom` are the same mask.
- **Streams**: routed by the app. Twenty `breaches` cut the reservoir in upper
  Nuʻuanu and the crossings the bare earth keeps; the check follows Nuʻuanu,
  Kapālama, Kalihi and Mānoa from their mapped main stems to tidewater against
  the State's stream lines.

What `koolaupoko` rests on:

- **Box**: the whole moku, from the crest behind Waikāne to 650 m of sea past
  Makapuʻu Point and from 700 m south of the point to 300 m past Kualoa
  (157.898–157.643 W, 21.302–21.538 N): 2048 × 2010 at 12.98 m, inside the 13
  m that lets Kahaluʻu, Waiāhole and Kualoa in with the rest (a box padded 700
  m all round would be 13.5 m). The moku lies north-west to south-east, so the
  box also holds the leeward side behind the crest and Honolulu's harbour at
  its south-west corner: about 70% of the `nuuanu` box. The manifest lists
  the districts in declaration order and each carries its `moku` (`Kona` for
  `nuuanu`, `Koʻolaupoko` here); which district a point goes to is the app's
  rule ("District packs", "Accepted for the second district"), with list
  order only as the last tie-break.
- **Heights**: the same lidar, 1,419 tiles, area-averaged to 12.98 m, with the
  same datum shift (measured again here: residual −0.07 m) and the same rules,
  and two more that this district asks for (`walls` and `islets` in
  `district-sources.mjs`). A line of texels a tenth to a half land, one or two
  texels across with water on both sides, stays land (670 texels): the
  fishpond walls of Heʻeia, Moliʻi and Kahouna, a few metres wide, which the
  half-land rule would sink, and the causeways and spits. The islets the
  survey left out (Mokumanu, Kekepa, Mokolea, Kapapa, the Mokulua islands,
  Mānana and Kāohikaipu), pieces of the CUDEM's land standing at least 2 m
  that no lidar cell reaches, are the CUDEM's land (2,634 texels in ten
  pieces, two of them the breakwater of the pier at Makapuʻu, which the bare
  earth leaves out as a structure). The windward face of the Koʻolau above
  Kahaluʻu and Waiāhole and under the Nuʻuanu pali has no lidar tile: there
  (11.6% of the pack) the heights are the CUDEM's land, corrected to meet the
  lidar along the seam.
- **Sea**: the CUDEM's three tiles (the fourth, north-east of Mōkapu, is open
  sea and not published) and GMRT past them (275,954 texels of the deep sea);
  water inside the coast that the CUDEM holds as land (stream mouths, canals,
  the open water of the ponds and marshes) is a flat −1 m. Kāneʻohe Bay's reef
  flats and patch reefs are the CUDEM's topobathymetric lidar, never shallower
  than −1 m: shallow sea, not land (the check holds the barrier reef flat, a
  patch reef and the flat west of Mōkapu between −1 and −4 m); ʻAhu o Laka's
  sand bar is sea.
- **Rain**: as for `nuuanu`.
- **Patches**: five dated works in the district's own list, each dated from
  its own history (the air station's of 1965 and the Navy's of 1947, DLNR's
  for Heʻeia Kea, a tertiary one for Moku o Loʻe). The bay and its shores
  before the works: G. E. G. Jackson's
  survey of August 1882 (Registered Map 1140, 1:12,000, soundings in fathoms
  at low water), read in F. W. Thrum's reduction of 1892 (RM 1848) as Kīpuka
  serves it, registered here on eight fixed points to 42 m rms over the south
  bay and Mōkapu; its reefs found on the sheet, its shores traced
  (`shoreline-1882.geojson`). The USGS sheets of 1927 and 1938 draw Mōkapu,
  Moku o Loʻe and Lae o Kealohi where Jackson does, within about 30 m. Where
  the works lie: the fill unit, and NOAA's chart of today (the seaplane
  landing area, the fairways to the air station, the dredged areas). Raise
  `kaneohe-bay-dredging` (until 1943): Jackson's reefs inside the seaplane
  area, the fairways and the Crashboat Channel where today's floor is deeper
  than 3 m, back at −1 m (0.92 km²). Lower `mokapu-air-station-fill`
  (1943): the fill unit seaward of Jackson's shore, the airfield's ground west
  of Pali Kilo and the strip along Mōkapu's south shore (1.11 km²; 280
  acres, 1.13 km², by the station's history). Lower `moku-o-loe-fill` (1936),
  outside the island Jackson draws. Raise `heeia-kea-harbour` and lower
  `heeia-kea-fill` (1950). The sources do not separate the stages of each work
  (the runways from their channels, Holmes's fill from the Navy's and the
  laboratory's, the harbour of 1950 from its enlargement of 1963–68), and each
  note says so. Kailua's and Waimānalo's shores lie on today's within about 30
  m on the 1902 and 1938 sheets and take no patch. Fill over the ponds stays
  land, as in `nuuanu`, for the features draw the ponds: the causeways across
  Nuʻupia, Halekou and Kaluapuhi, the fill over Kāneʻohe's shore ponds,
  Moliʻi's wall, and the houses round Kaʻelepulu, which the fill unit does not
  map. The small fill of 1969 fronting ʻŌpaʻapaʻa (RM 4148) is not in the fill
  unit and was not read here. The fairway from the north passage is left as
  today's: north of Kapapa the chart's registration is too loose to read its
  reefs (ACCESS.md). Honolulu's waterfront in the south-west corner is the patch
  bake's: its works reach this pack when `bake-patches.mjs` is run again (it
  bakes onto every Oʻahu district in the manifest), which has not been done.
- **Streams**: routed by the app. Twenty-six `breaches` cut the crossings the
  bare earth keeps over the windward trunks, and the lower Waiāhole, narrower
  than a texel behind the coastal road. The check follows Kāneʻohe, Heʻeia,
  Kahaluʻu, Waiāhole, Waikāne, Maunawili, Kaʻelepulu and Waimānalo streams to
  tidewater, holding a trunk to six texels (78 m) of the State's lines where
  the texel passes 10 m, and Maunawili, which ends in the open water of
  Kawainui at the Hāmākua canal, to 100 m.

Beyond the contract the manifest carries `parent`, `moku`, `files`
(supporting files), `breaches`, `streams` (the check's findings), `stats`,
and a `source` and `note` on each patch.

## Patches, on any pack

The first district showed that one kind of patch is not enough: modern fill
has to be lowered, but modern dredging has to be raised, and each cut and
each fill has its own date. So patches generalize. They live in
`public/data/patches/manifest.json` (bake.mjs never touches it), and a
district's own manifest may still list patches for its pack as before; the
app reads both.

```jsonc
{ "patches": [ {
    "id": "oahu-pearl-channel", "pack": "oahu",      // an island pack id or a district id
    "kind": "raise",                                  // "lower": today's land becomes reef flat; "raise": today's sea becomes reef flat
    "depth": -2,                                      // metres, the reef flat the patched texels become
    "until": 1911,                                    // the patch applies to years before this
    "file": "patches/oahu-pearl-channel.png",         // 8-bit mask on the pack's grid; 255 is full, soft edges are weights
    "size": [512, 400],                               // optional: a mask may be at a lower resolution than its pack, same bounds
    "note": "...", "sources": [ { "id": "...", "url": "...", "fetched": "...", "licence": "..." } ] } ] }
```

- One pack may carry many patches; the app applies every patch whose
  `until` is after the chosen year, raises before lowers, and eases each
  over about two seconds when the year crosses its `until`.
- A `raise` patch marks water that was reef flat, lagoon or shore before it
  was dredged: harbour channels and basins, seaplane runways, boat harbours,
  the Ala Wai. A `lower` patch marks land that was water or reef before it
  was filled. Natural channels through the reef (Māmala, the Pearl Harbor
  entrance as it was before 1900, the Kāneʻohe Bay channels) stay open: a
  patch must not invent a reef where the old surveys show a passage.
- The mask carries the shape; the manifest carries the date and the
  provenance. A mask value is the weight the app blends with: the patched
  height is `mix(h, depth, w)`, toward `max(h, depth)` for a raise and
  `min(h, depth)` for a lower, so a bake may write into the weights the
  relief of the reef it rebuilds, not only a soft edge, and `depth` is then
  the shallowest point of that surface. A depth above sea level makes land. Dates come from the harbour's own history (the surveys and the
  works records), never from the present chart.
- Districts: the district's `patches` entries gain the same `kind` and
  `depth` fields (`kind` defaults to `lower`, `depth` to -1 for the entries
  already baked).

### How to bake patches

`tools/bake-patches.mjs` writes `public/data/patches/` (the manifest, the
island masks and `passages.geojson`) and the district masks beside their
pack (`districts/nuuanu/patch-<work>.png`). The works themselves, what was
cut or filled, where, when and on whose word, are hand-written in
`tools/lib/patch-works.mjs`; the bake never touches the packs, the district
manifest or `features.json`.

```bash
node packages/holo-i-ke-au/tools/bake-patches.mjs --all                  # download (~170 MB), bake, check, delete the downloads (~1 min)
node packages/holo-i-ke-au/tools/bake-patches.mjs --preview /tmp/patches # today, 1795, 1930 and 1950 side by side, per harbour and pack
node packages/holo-i-ke-au/tools/bake-patches.mjs --sheets /tmp/sheets   # the 1881 and 1938 maps with the traced shapes over them
```

or `--download`, `--bake` (about 20 s), `--check`, `--clean`. `--downloads
DIR` (or `$HOLO_PATCHES_DOWNLOADS`) moves the downloads, as for the other
bakes; `--sheets` needs them. Run the pack and district bakes first: the
patches are made against their heights, so a re-baked pack needs its patches
baked again.

What the patches rest on:

| data | source | use |
| --- | --- | --- |
| sea floor | NOAA CUDEM 1/9″, tile `ncei19_n21x50_w158x00` (the district bake's) | where the ground is cut: flat floors and straight walls below the reef flat |
| charted channels | NOAA ENC Direct, harbour-scale `Dredged_Area` over Oʻahu | ground inside them counts as cut; the bake reports how much of them the patches cover |
| made ground | State geologic map, fill unit (`Qf`) over Oʻahu | where the fill lies |
| the old shore, passages, bars | the State's georeferenced 1881 Government Survey sheet; the 1899 sheet for the Pearl Harbor bar | traced by hand: the 1881 sea from Keʻehi to Waikīkī (the district's `shoreline-1881.geojson` carried west along Keʻehi lagoon), Ford Island and Kuahua, the Māmala and Pearl Harbor passages and their bars |
| Sand Island in 1938 | the State's georeferenced 1938 topographic map | traced by hand: the island before its wartime fill |
| dates | the harbours' own histories, each named in its patch's `sources` with what it says | `until`, and the note |

How a mask is made:

- **Raise.** Cut ground is the CUDEM inside a work's zone deeper than the
  group's `cut`, outside the passages, and not natural deep water: what stays
  of the water deeper than the cut once everything narrower than 500 m is
  opened away, where it reaches 20 m depth (the fore-reef), unless the chart
  keeps it dredged. On each pack the texels it touches, grown by about 20 m
  (two texels on the island pack, where GMRT smooths a channel into its
  sides), make the footprint; it is laid back at the reef that rims it, a
  smooth surface held at the CUDEM's reef depth on the rim and free where it
  meets land, a passage or deep natural water, so the old reef edge stays
  sharp against a passage. Over a bar it is never shallower than the bar's
  surveyed depth, and the fore-reef beside the bar holds it down too, so the
  passage runs out over its bar onto the fore-reef rather than ending at a
  wall. The manifest's `depth` is the shallowest of that surface,
  and a texel's weight is what takes today's height to the surface under the
  app's mix, `(t − h)/(depth − h)`: a raise mask's weights carry the reef's
  relief as well as its soft edges, and they fade in over about 30 m (two
  island texels) where a zone ends across open water.
- **Lower.** Today's land inside the work's shapes (the 1881 sea, an old
  island's outline, the fill unit, the work's region), with the low land
  between it and today's water that the fill polygons stop short of, and a
  feathered edge of a texel or two; only where today's ground stands above
  `depth`.
- Within one pack no texel's raise weights, nor its lower weights, add up to
  more than one: groups and works claim their texels in turn, and
  `honolulu-waterfront` takes only what the dated works leave.

What the app can rely on beyond the contract:

- The district's masks are listed in `patches/manifest.json` with `pack:
  "nuuanu"` (or `"koolaupoko"`) and a `file` relative to `public/data/`, not
  in the district manifest: its check holds the keyframe patches listed
  there to the first district's rules (a single kind, 0 or 255, over today's
  land, each inside the last), and a district's own dated works
  (`koolaupoko`'s) to these: each on its own side of the coast, weights of
  one kind never over one. An island entry carried from a district has
  `stats.carriedFrom`. `nuuanu`'s own `contact` and `kingdom` patches stay
  as they were (with `kind: "lower"` and `depth: -1` now written out) and
  overlap the dated lowers there; both lower to −1 m, so applying both is the
  same as applying either.
- Every mask is at its pack's full size, and `size` says so.
- Two depths are above the sea: the Ala Wai Canal is raised to +0.5 m, the
  wetland it was dug through, and the Ala Wai's fill on the Waikīkī wetland
  is lowered to +0.6 m and stays land. A raise whose `depth` is above 0 makes
  land of today's water.
- Each entry also carries `name` and `stats` (`texels`, `km2`, and
  `meanRaiseMetres` or `meanLowerMetres`); the manifest carries `about`,
  `passages` (the file) and `baked`. `passages.geojson` holds the passages as
  Polygons and, under `bars`, the bars with their depths.

The patches, by pack (`until` in brackets): on both `oahu` and `nuuanu` where
the work lies in the district, raise Honolulu's bar cut (1892), harbour
(1908), Kapālama (1935), Kalihi Channel and the Keʻehi seaplane runways
(1944), Kewalo (1926), the Ala Moana channel (1928), the Ala Wai boat harbour
(1935) and its entrance (1951), the Ala Wai Canal (1928, district only: on the
island it is land); lower Sand Island's first fill (1908) and its later fill
(1944), Ala Moana Park (1934), Magic Island (1964) and the Waikīkī wetland
fill (1928). On `oahu` only: raise the Pearl Harbor entrance channel and bar
(1911) and the cuts beside the Reef Runway (1977); lower the airport's fill on
Keʻehi lagoon (1944), the Reef Runway (1977), Ford Island's edges (1940) and
Kuahua (1943). On `oahu` and `koolaupoko` but not `nuuanu`, whose kingdom
patch it is: lower the Honolulu waterfront (1900). On `koolaupoko` too, whose
south-west corner holds Honolulu's harbour, the shared works that lie in its
box: raise the harbour (1908), Kapālama (1935), Kalihi Channel and the Keʻehi
seaplane runways (1944); lower Sand Island's first fill (1908) and its later
fill (1944).

Carried from `koolaupoko` onto `oahu` (`CARRIED_WORKS` in `patch-works.mjs`):
the district reads Kāneʻohe Bay's works at its own scale and from its own
sources ("What `koolaupoko` rests on"), and the island takes the district's
masks, each island texel weighted by the share of it the district's patch
covers, on the island's own coast, so the two agree across the takeover.
Raise the bay's dredging (1943; 0.91 km² weighted) and the Heʻeia Kea
harbour (1950; 0.036 km²); lower the air station's fill on Mōkapu (1943; 1.09
km²), Moku o Loʻe (1936; 0.032 km²) and Heʻeia Kea's moles (1950; 0.011 km²).
A carried work under a texel's worth at the island's resolution is left to
the district; none of these is. They are baked after every other work on
the pack, so they change none of the others' masks, and the district must be
baked before them.

Not done: inside Pearl Harbor the lochs and their wartime mooring dredging
are left as today's (natural deep water in 1881 within a few metres), as are
the Navy Yard's piers and the airport's ground west of Keʻehi lagoon, which
the 1881 sheet shows as land and ponds. Kāneʻohe Bay's seaplane runways
(1939–43) were cleared through patch reefs in a naturally deep lagoon: the
`koolaupoko` district reads them off Jackson's chart of 1882 and the island
carries them from it (above); Haleʻiwa, Waiʻanae, Barbers Point (cut into the
land in the 1980s), Ko Olina and Hawaiʻi Kai's Kuapā pond are not patched
either. The ENC's dredged areas
outside every zone are listed by the bake.

The check (`--check`) reads every mask back on its pack: a greyscale image of
the stated size; raise weights only over today's sea and only where today is
deeper than `depth`, lower weights only over today's land and only where it
stands above `depth`; no raise texel touching a passage; weights of one kind
on one pack never over one; every patch with a note and sourced date, every
source with its URL, date and licence; and `public/data/patches/` under 1 MB.
It prints, per raise patch, the median depth of its ground today and in 1795.

## The Māhele, by ahupuaʻa

`public/data/mahele.json`: the class of every State ahupuaʻa unit after the
division of 1848, joined to `boundaries/ahupuaa.geojson` by `gisId`, for a
land-division view at and after the Māhele. Classed where an opened source
says so, `unknown` otherwise; never guessed from a name.

```jsonc
{ "about": "…", "method": "…", "fetched": "2026-10-22", "sources": ["oha-kipuka-ahupuaa", "…"],
  "counts": { "class": { "crown": 70, "government": 245, "konohiki": 178, "mixed": 42, "unknown": 192 }, "disputed": 27, "withAwardee": 206 },
  "ahupuaa": [ {
    "gisId": 38, "name": "Makaweli", "islandId": "kauai",       // as the boundary file has them
    "class": "konohiki",             // crown | government | konohiki | mixed | unknown
    "precision": "whole",            // whole | combined (a State unit joining several ahupuaʻa) | part | none
    "awardee": "Victoria Kamamalu",  // konohiki or mixed only, spelt as the record spells it
    "parts": [ { "class": "konohiki", "share": 0.99, "awardee": "…", "how": "…" } ],
    "how": "surrendered in lieu of commutation",
    "later": [ { "class": "crown", "year": 1890, "how": "…" } ],      // a status given after 1848
    "disputed": [ { "class": "government", "source": "oha-kipuka-ahupuaa" } ],
    "note": "…", "sources": ["oha-kipuka-crown-lands"], "refs": ["Buke Māhele pp. 1, 2, 5"] } ] }
```

Rules `check-data.mjs` enforces: every gisId in the boundary file appears
once and every boundary unit has an entry; vocabularies; `unknown` has
precision `none`; `mixed` lists two or more classes in `parts`; an awardee
only on konohiki or mixed land; a recorded class cites at least one opened
source. Personal names keep the records' spelling; ʻokina and kahakō are
added only to place names, from the State layer. RESEARCH.md §12 says what
each source covered and where they disagree.


## Zoning, for the settlements

Density says how many; zoning says what kind. For the present-day keyframe
the settlements draw their building mix from zoning class rasters on each
island pack's grid, under `public/data/layers/<island>/`, listed in
`layers/manifest.json` under a `zoning` entry per island with sources and
the fetch date.

- `now-zoning.png`: 8-bit, one class per texel, the county's zoning
  generalized to this vocabulary (0 none or water; 1 residential, houses;
  2 residential, low-rise apartments; 3 residential, high-rise apartments;
  4 commercial or business; 5 mixed-use downtown; 6 industrial; 7 resort;
  8 agricultural; 9 conservation or preservation; 10 military or federal;
  11 public or institutional; 12 parks and open space). The manifest records
  the county's own class names that fed each number.
- `lud.png`: 8-bit, the State Land Use District (1 urban, 2 rural,
  3 agricultural, 4 conservation), in force since 1961 and applied by the app
  only to years from 1964 on.
- A texel's class is the class covering most of its area; a mask may be at
  half the pack's resolution with `size` stated. Where a county layer is
  unreachable the island's `now-zoning.png` is absent and the app falls back
  to density and value alone.
- The settlements use zoning only for the keyframes it applies to. Earlier
  eras keep density and value, and the 1900 cane and pineapple lands already
  baked into cultivation stand in for land use then.

### How to bake zoning

Run the pack bake first; this reads `manifest.json` and each island's
`height.png` (for the grid and the land), and writes only
`layers/<island>/now-zoning.png`, `layers/<island>/lud.png` and the top-level
`zoning` key of `layers/manifest.json`, leaving every other key of that file
as it stands.

```bash
node packages/holo-i-ke-au/tools/bake-zoning.mjs --all                  # download, bake, check, delete the downloads (about a minute)
node packages/holo-i-ke-au/tools/bake-zoning.mjs --preview /tmp/zoning  # each island tinted by class over shaded relief, with a legend
```

or `--download` (about 22 MB of GeoJSON), `--bake` (about 12 s), `--check`,
`--clean`. `--downloads DIR` (or `$HOLO_ZONING_DOWNLOADS`) moves the downloads
from `<os tmpdir>/holo-i-ke-au-bake/zoning-downloads`; keep them outside the
repo. Same needs as the other bakes: Node 22 and `curl`. A re-bake from the
same downloads is byte-identical; the counties edit their layers often, so a
fresh download moves a texel here and there as well as the `fetched` dates.

`tools/bake-layers.mjs` writes `layers/manifest.json` afresh, so after it runs,
run this bake again (or carry the `zoning` key across) to put the entry back.

**Sources.** Each county's own layer, which its planning department keeps
current, rather than the State GIS mirrors of them (ParcelsZoning layers 2, 3,
29 and 33, snapshots of 2023 to 2025); the districts from the State GIS.

| layer | service | class field |
| --- | --- | --- |
| City and County of Honolulu zoning | `services.arcgis.com/tNJpAOha4mODLkXz/…/Zoning_Reg/FeatureServer/0` (HOLIS) | `zone_class`, named by `zoning_description` |
| Honolulu zoning map height limit | the same service, layer 2 | `height_label` (feet) |
| County of Maui zoning | `services3.arcgis.com/fsrDo0QMPlK9CkZD/…/Maui_County_Zoning_Districts/FeatureServer/0` | `ZONE_CLASS`, a code named by the layer's domain |
| County of Hawaiʻi zoning | `services1.arcgis.com/C2LPusZs5OXNGFDn/…/Zoning_COH/FeatureServer/9` | `ZONE` |
| County of Kauaʻi zoning | `services1.arcgis.com/0DaVqrPt2eyXUS9g/…/Zoning/FeatureServer/0` (Kauaʻi GIS) | `ZONING`, named by `DESCRIPTION` |
| State Land Use Districts | `geodata.hawaii.gov/…/ParcelsZoning/MapServer/20` | `ludcode` (U, R, A, C) |

Kahoʻolawe and Niʻihau have no county zoning in these layers, so their packs
have `lud.png` only, and `zoning: null` with a `zoningNote` saying why. The
Maui pack's slivers of Kahoʻolawe and Molokini are 0 for the same reason.

**The manifest entry.** `zoning.encoding` names the classes of both rasters;
`zoning.rule` writes out how a texel is classed; `zoning.sources.<layer>` gives
each layer's URL, its name and the fields read, its ArcGIS Online item, the
date its data was last edited, the date fetched, the publisher's terms and the
credit; `zoning.mapping.<county>.classes` lists, under each class number, every
class of that county's layer that fed it, as
`"code (name), when a rule chose: km² of pack land"`, with 0 listing what
counts as no class, and `zoning.mapping.<county>.rules` the reasons where the
choice is not plain. Per pack, `zoning.islands.<island>` has `zoning` and `lud`,
each with `file`, `size`, `source`, `fetched` and `stats` (`classed` and `none`
as shares of the pack's land, and `share`, by class number); the zoning also
names its `mapping` and any layer it `alsoReads`.

**The generalization** (`tools/lib/zoning-classes.mjs` holds every rule, and
the bake stops on a county code no rule matches). Classes follow building
form: Waikīkī's Resort Mixed Use precinct and every hotel district are resort,
its Apartment precincts high-rise; Honolulu's A-2 and AMX-2 are high-rise where
the zoning map's height limit is 100 ft or more, low-rise below; BMX-4,
Kakaʻako, Aloha Tower, Hilo's CDH, Wailuku's redevelopment core, Kapaʻa's
special planning area and Lahaina's historic districts are mixed-use downtown;
airports are industrial (Honolulu zones its own I-2); P-1, forest reserves and
national parks are conservation; F-1 is military; P-2, Open and park districts
are parks and open space. Maui County's Interim district takes its class from
the State district beneath it (urban or rural as houses, agricultural,
conservation), and its project districts are resort in West Maui, on Lānaʻi and
at Mākena, houses elsewhere. Kauaʻi's overlays (`/ST-P`, `/P-D`) defer to the
district before the slash. Roads, streams, drainage and land marked not zoned
(Kalaupapa; the Kukuiʻula area Kauaʻi's layer leaves to its planning
department) are no class.

**What the check covers.** `--check` reads every raster back: greyscale, the
pack's exact grid (the contract allows half, but this bake writes full size,
and the rasters still come to under 200 KB), values inside the vocabulary,
nothing over sea, `stats` equal to what the image holds, every class on a
raster fed by something in its mapping, and every source with its URL, layer,
fields, terms and date. It prints coverage per island and a sanity table, the
commonest class within a few hundred metres of places whose zoning is known:
Waikīkī resort and high-rise, downtown Honolulu mixed-use, Kalihi Kai and Sand
Island industrial, Mililani and Kāneʻohe houses, the Koʻolau crest
conservation, Kāʻanapali resort, Lahaina's historic core, Kahului business and
industrial, Haleakalā conservation, Kailua-Kona business, downtown Hilo
mixed-use, Līhuʻe business, and the State district at several of them. It
fails if the zoning rasters pass 1 MB or `layers/` its 8 MB.

## Works, dated: military land, airports, highways, rail, harbours

What was built on the land and when, so that a base, a runway or a road
appears at its construction and goes when it was closed or returned. Military
land is drawn as **control** (the area the military holds, as a wash with its
boundary and name) and **installations** only where they stand (a runway, a
pier, hangars, housing, a range), because a reservation is mostly land with
nothing on it. Under `public/data/works/`: a `manifest.json` and one GeoJSON
per island pack, `works/<island>.geojson`, in lon/lat (WGS84), simplified to
about 10 m, the whole directory under 1.5 MB.

```jsonc
// works/manifest.json
{ "about": "...", "files": ["oahu.geojson", ...], "kinds": { ... the vocabulary below ... },
  "sources": [ { "id": "...", "title": "...", "url": "...", "licence": "...", "fetched": "..." } ],
  "stats": { "oahu": { "military": 12, "airport": 4, ... } } }
```

Every feature's `properties`:

| field | values |
| --- | --- |
| `id` | kebab-case ASCII, unique across all islands (`pearl-harbor-naval-station`) |
| `kind` | `military` · `airport` · `highway` · `rail` · `harbour` |
| `part` | military: `land` (Polygon, the held area) · `runway` · `pier` · `block` · `range`; airport: `field` (Polygon) · `runway` · `block`; highway: `road` · `tunnel`; rail: `line`; harbour: `breakwater` · `pier` |
| `group` | the work the part belongs to (`pearl-harbor`, `h-3`), so a base's land and its installations go together |
| `name` | with the standard ʻokina and kahakō; the name of the day it opened, `alt` for later names |
| `owner` | `Army` · `Navy` · `Marines` · `Air Force` · `Coast Guard` · `territory` · `State` · `county` · `federal` · `private` (a company's name in `note`) |
| `from` | the year it opened or the land was taken; `built: [start, end]` optional, the years of construction |
| `to` | the year it closed, was returned or lifted; `null` while it stands (Kahoʻolawe's range 1941–1994, Barbers Point 1942–1999, the OR&L 1889–1947) |
| `datePrecision` | `year` · `decade` · `by` (the earliest sheet or record that shows it; the true date is earlier) |
| `precision` | `exact` (a surveyed layer) · `mapped` (traced from a sheet) · `inferred` |
| `width` | metres, for a LineString `runway`, `pier`, `breakwater`, `road`, `line` |
| `class` | for a `road`: `interstate` · `state` · `county`; `lanes` optional |
| `storeys` | for a `block`, optional (hangars 1, barracks 2–3, a tower more) |
| `sources` | ids in `sources.json`, at least one opened |
| `note` | what it is and what the sources could not separate; no figures that belong in a telling |

Rules, enforced by `tools/check-data.mjs`: ids unique; vocabularies as above;
`from` ≤ `to`; every `part` other than `land`, `field`, `road`, `line` lies
inside its `group`'s `land` or `field` where one exists; geometry within its
island pack's bounds; a `land` or `field` is a Polygon or MultiPolygon, a
`runway`, `pier`, `breakwater`, `road`, `tunnel`, `line` a LineString with
`width`; names Hawaiian-checked; the copy rule. A base whose land changed
(returned in part, enlarged) is several `land` features of one `group`, each
with its own years.

What the app draws, by year (DESIGN §2): at island zoom, military land as a
translucent wash with a dashed boundary and its name, from `from` (growing in
across `built` if given) to `to`; runways and aprons as flat paved strips,
piers and breakwaters as stone ribbons on the water, blocks as buildings in
the structures' kit by their `storeys`, ranges as a fainter wash; airports'
fields as a lighter wash with their runways; highways as paved ribbons draped
on the ground by class (an interstate wider than a state road; a tunnel is
not drawn, the road reappears beyond it); rail as a thin dark line with ties
at near zoom; harbour works as stone. At district zoom the same geometry on
the district ground. At the far view the Land legend may carry military land
for the keyframes it applies to; nothing else of the works shows there. The
settlements do not build on military land after `from`, nor on a field or a
runway.

Where the record gives the land but not the installations (most bases), the
base is `land` alone. Where a sheet shows a runway but no record gives its
year, `datePrecision: "by"` with the sheet's year. Sources: the State GIS
military reservations and federal lands layers, the State DOT roads and the
airports layer for geometry; the USGS 1927–28, 1938, 1950s sheets for what
stood when; installation histories, HDOT and FAA records, Thrum's Annual and
the newspapers for dates; Wikipedia only as a tertiary source, marked. The
`wanted` rule for sources holds.

**Accepted extensions (from the first render).** Built against the test
works `tools/fake-data.mjs` writes; the bake may rely on these.

- **Geometry the table leaves open.** A `block` is a Point (one building), a
  MultiPoint (several alike), or a Polygon or MultiPolygon (a footprint: the
  app fits one building to it, along its longer axis); a `range` is a Polygon
  or MultiPolygon, like a `land`. A block without a footprint stands along the
  nearest `runway` of its `group`, if one is within 800 m.
- **What a block is for.** A `block` may carry `use`, from the tags of the
  building it was made from: `hangar` (OSM `building=hangar` or
  `aeroway=hangar`), `barracks` (`building=barracks` or `dormitory`,
  `military=barracks`), `hospital` (`building=hospital`, `amenity=hospital`),
  `warehouse` (`building=warehouse` or `shed`), `industrial`, `office`,
  `school` (`school`, `college`, `university`, `kindergarten`), `church`
  (`church`, `chapel`, `cathedral`), `residential` (`residential`, `house`,
  `apartments`, `detached`, `semidetached_house`, `terrace`), `tower`; none
  where the tags say only "building". It lets the app tell a hangar from a
  large shop or a hospital of the same size where neither has `storeys`.
  `check-data` holds it to this list and to blocks.
- **The years.** A work is whole in its `from` and still stands in its `to`
  (it fades in over the year before `from` and out over the year after `to`,
  as a district feature's `to` is its last year). With `built: [start, end]`
  it comes in across those years instead (from the earlier of `start` and
  `from`): land's wash by its strength, a road or a runway along its length
  from its first coordinate to its last, a work's blocks each in a year of
  their own within the span.
- **Tunnels.** A `road` may run through its `tunnel` or stop at the portals
  (as the bake cuts it): the app leaves out whatever stretch of a road lies
  within the width of a `tunnel` of the same `group` (or of no group).
- **On the water.** A `land` over water (Pearl Harbor's lochs in 1887) is
  washed over the sea as over the land; only a `field` and a `range` keep to
  the land. The works are drawn whether they come in one feature or in pieces
  of one `group`.
- **Widths.** A road is drawn at its `width`, else at its `lanes` × 3.6 m +
  2 m (as the bake reckons a width), else at its `class`'s (interstate 24 m,
  state 12 m, county 8 m); a rail `line` is drawn at least 3 m wide. A
  runway, pier or breakwater without a `width` is drawn at 45, 15 and 12 m.
- **Names.** The app names a `land`, a `field` and a named `road` at the
  island zoom, by `name`; of several features with one name standing in a
  year, the largest. `alt` is read by nothing yet.
- **Files.** `manifest.files` lists `<island>.geojson` by the island pack's
  id; an island with no file has no works, and a data set with no
  `works/manifest.json` has none at all. `?works=<base>` reads the works from
  another base (the tools' test works).
- **The settlements** keep their lots off a `land`, `range` or `field` and a
  `block`'s footprint from its `from` (or the start of its `built`) through
  its `to`, and off a `runway`, `road`, rail `line`, `pier` or `breakwater`
  as a strip of its drawn width in the same years: the contract's rule, with
  the roads and the rail added, since a house standing on a highway's
  ribbon reads as a fault.
- **The far view.** Nothing of the works is drawn at the whole chain; the
  Land legend adds "Military land" while any of it stands on the island in
  view at the island zoom.

### How to bake the works

The bake reads `manifest.json` for the island packs' bounds and
`boundaries/moku.geojson` for the land, and writes only `works/`.

```bash
node packages/holo-i-ke-au/tools/bake-works.mjs --all               # download, bake, check, delete the downloads (about two minutes)
node packages/holo-i-ke-au/tools/bake-works.mjs --sheets /tmp/works # each traced shape and carving zone drawn over the sheet it was read from
```

or `--download` (about 120 MB, three or four minutes: 3 MB of GeoJSON from the
State GIS, the Corps of Engineers, the FAA and NOAA; OpenStreetMap's buildings
over seven bases; the 1943 and 2000 sheets over the same boxes), `--bake`
(about two minutes, most of it dating the blocks), `--check` (reads `works/`
back, lists the blocks and ranges and every feature dated only `by`, says
which layer each kind rests on, and runs `tools/check-data.mjs`), `--clean`. `--downloads DIR` (or
`$HOLO_WORKS_DOWNLOADS`) moves the downloads from
`<os tmpdir>/holo-i-ke-au-bake/works-downloads`; keep them outside the repo.
Node 22 and `curl`, as for the other bakes. A re-bake from the same downloads
is byte-identical but for the `baked` date.

**Where things live.** `tools/lib/works-dates.mjs` is the hand-written table:
one entry per feature with its name, owner, years, precision, sources and
note, and a `geom` that joins it to its geometry by the layer's own name or id;
the header of that file lists the `geom` forms. `tools/lib/works-sources.mjs`
names the layers and fetches them; `tools/lib/works-traced.mjs` holds what was
traced by hand (the railways, the old Kona runway, Fort Armstrong) and the
zones that carve one base out of a layer polygon that merges several, each with
the sheet it was read from; `tools/lib/works-bake.mjs` joins, carves (on a 4 m
grid), simplifies to 10 m, clips to the pack and writes. The bake stops on any
entry that does not join, on a tunnel that does not fall on its road, and over
the 1.5 MB budget.

**Blocks.** `BLOCKS` in `works-dates.mjs` names, per base, the land a
block may stand on, how many to keep, the owners by year and the sources;
`tools/lib/works-osm.mjs` fetches OpenStreetMap's buildings over each base's
box through the OSM API (in tiles of 0.02°, a call every 1.5 s) and the 1943
and 2000 sheets over the same box. The bake keeps the largest footprints whose
centre lies on the named land and whose corners lie within 20 m of it,
simplified to 5 m, and dates each: it registers each sheet to the base's
three hundred largest buildings (the shift, within 45 m for 1943 and 20 m for
2000, that makes them stand out darkest from the ground round them), then
takes the first sheet on which the ground within 20 m of the footprint is
built up (15% in building black, or on the 2000 sheet, which tints built-up
ground, half in black or tint), else the year the map was fetched, as
`datePrecision: "by"` with `by` naming it; where the land was taken after
that year the block begins with the taking (`datePrecision: "year"`), and a
block first seen after its land was given up is dropped. It ends when the last
land holding it was given up. `storeys` is OSM's `building:levels` where
mapped, and 1 for a hangar. The 1938 sheet is not used for blocks: it
generalizes its buildings and sits off today's map unevenly by up to 60 m.

**Ranges.** A `range` is drawn where a layer itself sets one apart: the Corps
of Engineers' former sites whose own description makes them a firing range or
target area, and the Defense lands layer's Schofield East Range. The impact
areas of Kahoʻolawe, Pōhakuloa and Mākua and the Kahuku training area are not
told apart from their reservations by any layer read, so they stay `land`.

**What the contract gained** (all checked by `check-data`):

- `by` on a feature dated `by`: the id in `sources.json` of the sheet or record
  that first shows it. It must be among the feature's sources and opened.
- `layer` on every feature: where its geometry came from, as `{ source, key }`
  (`source` a layer id in the manifest's `sources`, `key` the layer's own name
  or id joined on); `within` / `outside` name the hand-drawn zones a layer
  polygon was carved by; a traced shape has `source: "traced"` and the `sheet`
  it was read from; a harbour's waters drawn as a zone less the land also name
  the `minus` file.
- `lanes` on a road and its tunnels, the commonest through-lane count of its
  HPMS segments; its `width` is then lanes × 3.6 m + 2 m unless the table gives
  one.
- A `tunnel` carries its road's `class`, `lanes` and `width`, its own `name`,
  `from` and `note`, and is cut out of the road at the portals the 2000 sheet
  draws; the road either side keeps the road's id, with `-2`, `-3` on further
  pieces (a road the layer gives in several pieces is numbered the same way).
- In the manifest: `about`; `baked` (the date); `tolerance` (metres);
  `tracedFrom` (the sheets the traced shapes cite); per source its `item`,
  `metadata`, `fields`, `credit` and `note` where the layer has them (and, for
  `osm-buildings`, the `boxes` fetched and the sheets each was dated by); per
  island in `stats`, `blocks` and `ranges` where there are any, `datedBy`
  (features dated only `by`) and `bytes`.

**What each kind rests on** (RESEARCH §15 has the reading behind it):

| kind | geometry | dates |
| --- | --- | --- |
| military | the State's Department of Defense Lands (2025, from the 2021 land use plan) for land held today, carved by zones read off the 1927, 1943 and 2000 sheets where one polygon holds two bases; the Corps of Engineers' former sites for land given up; Kalaeloa's district for Barbers Point; Kahoʻolawe's own outline; FAA runways; OpenStreetMap's building footprints for the blocks | installation histories (the State's aviation history pages, FortWiki and Wikipedia as finding aids), the Corps' site descriptions, the land use plan's lease tables; otherwise `by` the first sheet or record that shows it; blocks `by` the 1943 or 2000 sheet, or the map |
| airport | the State's airports layer for the field, carved at the Reef Runway; FAA runways as centrelines at their published width; the old Kona strip traced from the 2000 sheet | the State's aviation history page for each field |
| highway | the State DOT's HPMS centrelines by route and milepost; the Pali road of 1898 from the City's street centrelines | the State's historic bridge inventory report, the Hawaii Highways route lists, Wikipedia as a finding aid; otherwise `by` the oldest bridge the National Bridge Inventory lists on the stretch |
| rail | traced from the 1938 Oʻahu sheet (the Oahu Railway and Land Company), the 1924 Maui sheet (the Kahului Railroad) and the 1911–1930 Hawaiʻi sheets (the Hilo Railroad's Olaʻa line) | the companies' histories as Wikipedia gives them |
| harbour | NOAA's charted breakwaters and piers, joined by harbour box, category and charted name | Wikipedia for Hilo and Kawaihae; otherwise `by` the first sheet that draws the work |

The State's commercial-harbours layer is downloaded for the harbours' names
and extents, which set the boxes; no feature takes its geometry from it.

## Crops, on the era layers

The cultivation mask says how much of a texel is cultivated; the crop class
says what grows there, so the ground can draw rice where there was rice and
pasture where cattle grazed, not taro everywhere. Per island pack and
keyframe, beside the other masks: `layers/<island>/<keyframe>-crop.png`,
8-bit, one class per texel, registered like the other masks, listed in
`layers/manifest.json` under `crops` with its classes, sources, methods and
`stats` per island and keyframe, as the zoning entry is.

| class | what | first appears |
| --- | --- | --- |
| 0 | nothing, or cultivation of no known kind | |
| 1 | loʻi: wet taro | contact |
| 2 | dryland fields: sweet potato, dry taro, the leeward field systems | contact |
| 3 | rice, in old loʻi and marsh | kingdom (1896) at its height; none at mahele, since rice growing began in 1858 |
| 4 | sugar cane | mahele (Kōloa 1835, Līhuʻe, Hāna, Lāhainā), kingdom, gone by now |
| 5 | pineapple | kingdom (1900s), now where it remains |
| 6 | pasture, ranch land | mahele (Parker 1847, Kualoa 1850, Torbertsville at ʻUlupalakua), kingdom, now |
| 7 | orchard, coffee, macadamia, truck crops | kingdom (Kona and Olaʻa coffee), now |
| 8 | lawn: parks, golf, open grounds | now |

A texel with cultivation > 0 and class 0 is drawn as the era's default (taro
on a floor, dryland on a slope). Pasture (6) and lawn (8) may stand where the
cultivation mask is 0, since grazing is not cultivation. Keyframes are the
layers' own: contact, mahele, kingdom, now; the `eras` map in the manifest
says which keyframe an era takes, as for the other layers. The app blends
classes by nearest keyframe, not by mixing bytes. Sources: the 1900 cane and
pineapple lands already baked, the USGS 1927–28 sheets' rice and cane
symbols, the Territorial land-use surveys of the 1930s, the State GIS
Agricultural Land Use layers (1978–80, 2015) for now and for pasture read
back, the ranch histories for 1853 and 1896; each keyframe's method recorded
as the other layers' are, mapped or modelled. A district feature of kind
`loi` may carry `crop` (`taro` · `rice`) with its own years, which overrides
the class there.

A loʻi with no `crop` is taro. Where the record has rice in a loʻi that is
already drawn, the rice is a second `loi` feature on the same outline, with
`crop: "rice"` and years of its own, and the taro feature's years end where
the rice's begin: two loʻi on one outline never hold in the same year, so the
ground can keep one loʻi a texel and pick by the year. A rice loʻi may also
have an outline of its own where the rice lay off the drawn loʻi (Heʻeia's
rice land of 1882). `check-data.mjs` fails a `crop` other than `taro` or
`rice`, a `crop` on anything but a `loi`, a rice loʻi without a `from` year,
and two loʻi on one outline whose years overlap; rice before 1850 warns.
Koʻolaupoko's rice is in RESEARCH.md §14.

**What the bake settled beyond the table** (accepted extensions, all in the
manifest's `crops` entry):

- **Rice starts at kingdom.** The table first had rice at Honolulu in 1853.
  The record has it as an experiment of the Royal Hawaiian Agricultural Society
  from 1858, taken up by Chinese planters in the 1860s (Glick), so `mahele`
  draws no rice and says why in `record.leftOut`.
- **Two more classes may stand where the cultivation mask is 0**, besides
  pasture and lawn: cane (4) at `mahele`, because the 1853 cultivation mask has
  no cane in it, and orchard (7) at `kingdom`, because the 1896 mask leaves
  coffee out (its rule says so). `encoding.uncultivated` lists all four with
  the reason; everywhere else a class other than 0 stands only on cultivated
  texels.
- **The fishpond shore is class 0.** Where the shore rule is the largest term
  of the cultivation mask the texel is a pond's shore, not a field, so the app
  draws its default there.
- **Eras take the nearest keyframe** (`crops.eras`): voyaging to kamehameha
  take contact, kaahumanu and kauikeaouli mahele, kalakaua and liliuokalani
  kingdom, the coda now.
- **Whole-island ranges.** Lānaʻi, Niʻihau and Kahoʻolawe in 1896 are pasture
  wherever the land is neither forest nor field, since each was stocked end to
  end and the 1978–80 map cannot give their grazing back.

### `crops` in `layers/manifest.json`

```jsonc
"crops": {
  "about": "...",
  "encoding": { "file": "<island>/<keyframe>-crop.png", "classes": { "0": "...", "8": "..." }, "keys": { "1": "loi", ... },
                "uncultivated": { "6": "...", "8": "...", "7": "...", "4": "..." }, "sample": "nearest" },
  "keyframes": ["contact", "mahele", "kingdom", "now"],
  "eras": { "kamehameha": { "year": 1807, "keyframe": "contact" } },
  "methods": { "kingdom": { "method": "mixed", "rule": "the rule written out", "classes": [1, 2, 3, 4, 5, 6, 7],
                            "limits": "what the rule cannot know", "sources": ["thrum-annual-1902", "hawaii-gis-alum-1980", ...] } },
  "record": { "plantations1853": {...}, "ranches1853": [...], "ranches1896": {...}, "rice1896": {...}, "coffee1896": {...}, "leftOut": [...] },
  "mapping": { "now": { "field": "crops_2020", "classes": { "Pasture": 6, ... } }, "alum": {...}, "cah": {...} },
  "rules": { ...the modelling constants },
  "sources": { "<id>": { "id", "title", "url", "licence", "fetched", "note", "sourcesJson": true, "opened": true } },
  "islands": { "oahu": { "pack": "oahu", "size": [1024, 801], "bounds": [...],
                         "layers": { "kingdom": { "file": "oahu/kingdom-crop.png", "method": "mixed",
                                                  "stats": { "landTexels": 335807, "classedTexels": 128204,
                                                             "texels": { "1": 12496, ... }, "km2": { "1": 58.27, ... } } } } } },
  "stats": { "files": 32, "bytes": 326436 },
  "baked": { "tool": "tools/bake-crops.mjs", ... }
}
```

- **`methods`** per keyframe, as the layers' own: `method` (`mapped`,
  `modelled` or `mixed`), `rule` written out, `classes` (the only classes its
  rasters may hold), `limits`, and `sources` as ids of `crops.sources`.
- **`record`** is the history the rules draw, as drawn: each 1853 plantation
  with its mill, sources and the acres it came to; each ranch with its bounds
  (ahupuaʻa by `gisId` and name, moku by key, or the whole island) and the km²
  of pasture drawn; each rice district with its 1892 figure where known, the
  acres on the rule and the acres drawn; the coffee lands; and `leftOut`,
  everything the brief or the record names that the bake does not draw, with
  why.
- **`sources`** are keyed by id. The data layers carry the date the ledger
  recorded; the historical sources are the entries of `sources.json`
  (`sourcesJson: true`), with the date they were read for this bake and the
  terms they are used under. Sources not opened (`opened: false`) are cited
  for what they would settle, and check-data holds every id to `sources.json`.
- **`stats`** per raster, over the pack's land: `landTexels`, `classedTexels`,
  and per class its `texels` and `km2` (texels times the pack's
  `metresPerTexel` squared). A pack holds the slivers of neighbours in its box,
  so islands' figures overlap there.
- No pack is absent; if one ever is, `islands.<id>.absent` gives the reason
  (or `absent.<keyframe>` for one keyframe), which the checks accept in place
  of the raster.

### How to bake the crops

Run the pack bake, the layers bake and the zoning bake first; this reads
`manifest.json`, each island's `height.png` and `rain.png`, `boundaries/`,
`eras.json`, `sources.json`, the era layers' cultivation and forest masks and
the zoning rasters, and writes only `layers/<island>/<keyframe>-crop.png` and
the top-level `crops` key of `layers/manifest.json`, leaving every other key
of that file as it stands.

```bash
node packages/holo-i-ke-au/tools/bake-crops.mjs --all                  # download, bake, check, delete the downloads (about two minutes)
node packages/holo-i-ke-au/tools/bake-crops.mjs --preview /tmp/crops   # each island's four keyframes side by side, by class over shaded relief, with km²
```

or `--download` (about 500 MB, nearly all of it the 30 m CAH GeoTIFF the
layers bake also fetches), `--bake` (about 50 s), `--check`, `--clean`.
`--downloads DIR` (or `$HOLO_CROPS_DOWNLOADS`) moves the downloads from
`<os tmpdir>/holo-i-ke-au-bake/crops-downloads`; keep them outside the repo.
Same needs as the other bakes: Node 22, `curl`, the `geotiff` devDependency.
A re-bake from the same downloads is byte-identical; only `fetched` dates
move.

It fetches the field layers exactly as the layers bake does (the
Traditional Agriculture zones, the geologic units, the Land Commission
Awards, the 1900 cane and pineapple, the 2020 baseline), so the terms that
name a texel's field are the cultivation masks' own (`fieldInputs` and
`cultivationTerms` in `lib/layers-model.mjs`, shared with the layers bake),
and adds the 1978–80 Agricultural Land Use Maps (LandUseLandCover layer 5:
grazing and coffee, read back to 1896), the golf courses (Infrastructure
layer 14, points) and the CAH land cover (its class 43, developed open
space). The history it draws is `lib/crops-history.mjs`, the rules
`lib/crops-model.mjs`, the check and preview `lib/crops-check.mjs`.

`tools/bake-layers.mjs` rewrites `layers/manifest.json` but carries `zoning`
and `crops` across. The crop classes read the cultivation masks, so after a
layers bake that changes them, bake the crops again.

### What the crops check covers

`--check` reads every raster back: greyscale, its pack's exact grid, values
0–8, nothing over sea, `stats` equal to what the image holds, only the
classes its keyframe's method lists, and a cultivated class only where that
keyframe's cultivation mask is above 0 (the four of `encoding.uncultivated`
excepted). Every keyframe needs a method, a rule, its limits and sources;
every source a title, URL and licence (a source not opened may lack its URL)
and, unless it is the project's own bake or unopened, a date; every era a
keyframe; the historical sources must match `sources.json`. It prints km² by
class per island and keyframe and a sanity table (Waipiʻo and Hanalei in
loʻi and the Kohala field system and Kula in dryland at contact; cane at
Kōloa and pasture at Waimea and Kualoa in 1853; rice at Hanalei and Waikāne,
cane on the ʻEwa plain, coffee in Kona and at Olaʻa, pasture at Waimea, on
Niʻihau and on Kahoʻolawe in 1896; Kapiʻolani Park lawn, the pineapple by
Wahiawā, Kona coffee and Waimea pasture now), and fails if
`public/data/layers/` passes 8 MB. `tools/check-data.mjs` holds the same
contract without the bake's libraries: classes 0–8, the pack's grid, nothing
over sea, stats, every pack and keyframe present or its absence recorded,
methods with rules and sources, eras in `eras.json`, and every historical
source in `sources.json`.

**How the app reads them** (accepted extensions):

- **The entry.** Each mask from `crops.islands.<island>.layers.<keyframe>`
  (`file`), as baked; the app also takes the entry straight under the
  island (`crops.islands.<island>.<keyframe>`), a bare file name in place of
  the entry, or a `crop` beside `cultivation` in the island's era layer
  entry. An island with no crop mask, or a keyframe without one, is drawn as
  before there were crops; nothing is inferred from cultivation alone. A
  value above 8 is read as 0. A mask the pack's size is read texel for
  texel, one of another size by nearest texel across the pack's bounds.
- **The eras.** `crops.eras.<era>.keyframe` places each era; without it the
  app takes the layers' own `eras.<era>.crop`, else `cultivation`. Between
  two eras the year moves on the keyframes as the other layers' does, and
  the year shows the keyframe nearest it: the change from one keyframe to
  the next falls half way between the two in those terms.
- **Share and class.** The cultivation mask of the same keyframe gives a
  texel's planted share (a keyframe without cultivation takes the nearest
  that has it), and a field of a class is planted at least half whatever
  that share is; where the share is 0 under a class (`encoding.uncultivated`:
  pasture, lawn, cane at `mahele`, orchard at `kingdom`) the class covers its
  fields whole. So the bake need not raise cultivation where it writes a
  class, and should not write one where the crop is a minor share of the
  texel. A cultivated texel of class 0 (the fishpond shore among them) is the
  era's default.
- **The legend.** The Land view names the cultivated classes (not pasture or
  lawn) a keyframe's masks hold, from `stats.km2` (else `texels`, or a
  `share`) summed over the islands, largest first; without stats it names
  none.
- **A district loʻi's `crop`** holds for the feature's own `from` and `to`;
  with none it is taro, whatever the island's mask says there. Loʻi whose
  outlines are one (their boxes overlap by more than 60%) in years that never
  meet are one loʻi a texel: one aux index, standing while any of them holds
  the year and drawn as the one that does; where their outlines differ a
  little, the texels of either stand in the years of both. Two loʻi of the
  same years but different crops never share an index.
