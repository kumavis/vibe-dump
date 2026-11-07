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

**Before 1450.** The eras before contact use `contact` itself; the app thins
it for the years before 1450 by a population curve (`EARLY` in
`src/config.js`, read by the land overlay's shader and by the settlements),
after Dye, "Population Trends in Hawai'i Before 1778", *Hawaiian Journal of
History* 28 (1994), opened and read in full at
<http://www.pelagicos.net/BIOL3010/readings/Dye_1994.pdf>, whose fig. 1 is
Dye and Komori's curve (*New Zealand Journal of Archaeology* 14, 1992; wanted:
the eVols copy sits behind a browser check) from 599 radiocarbon dates: about
20,000 people in 1150, a Growth Phase to a prehistoric maximum of 140,000–
200,000 by 1450, and an Equilibrium Phase to 1778, ending at 110,000–150,000.
So from 1150 to 1450 the settlement grows exponentially, a straight line in
its log bytes, from 20,000 / 130,000 of the 1778 layer (130,000 the middle of
Dye's 1778 range; 0.185 of 255 bytes taken off at 1150) to the whole of it,
the leeward dryland fields growing in over the same years; from 1450 the
1778 layers stand whole, so 1480 (Māʻilikūkahi's era) holds the share 1.0 of
1778, as Dye's curve has it at its maximum. Dye's curve rests on the long
chronology of settlement from about 400; with settlement now put about
1000–1200, the growth may have run later, and Kirch's "Like Shoals of Fish"
(in Kirch and Rallu, eds., *The Growth and Collapse of Pacific Island
Societies*, 2007) is wanted for a curve on the short chronology. Two local
records point the same way: Kahikinui's dryland settlement began about 1400
and peaked in 1700–1800 (Kirch and others, PNAS 2004, the abstract), and
Kōloa's irrigated field system was begun about 1450 and in place by the
mid-1500s (Hammatt, as P. T. Young gives it).

**Counts by ahupuaʻa.** Where the earliest counts are by land, they set how
many each ahupuaʻa holds in `contact`, and the rule only where within it
(`AHUPUAA_COUNTS` in `tools/lib/layers-model.mjs`; the manifest repeats it as
`methods.contact.settlement.countsByAhupuaa`). Kauaʻi: the 23 lands Ke Kumu
Hawaii counted in 1835 (23 Dec. 1835 p. 204, Kona from Nuʻuolo to Hanapēpē;
14 Oct. 1835 p. 164, Keālia to Kalalau; read in the nupepa-hawaii.com
transcriptions) each take their count's share of the island's 1778 people,
and every land the lists leave out (the plain from Kapaʻa to Kōloa, east
Kona, three Nāpali lands) takes together what the 1836 total of 8,934
(Thrum) leaves: 37%. The 324 people of listed names no boundary has
(Kekupua, Homaikawaʻa, Betelehema) are shared over all. A land name must be
in `boundaries/ahupuaa.geojson`, or the bake stops. Niʻihau is one ahupuaʻa
there and its counts are of the whole island, so the rule alone places its
people. The shares are of 1835, after half a century of uneven decline.

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
| contact 1778 | modelled: the Kurashima–Kirch traditional agriculture zones, a valley-floor loʻi rule read from the pack, the 1848–1855 kuleana parcels, a fishpond-shore rule | modelled: fields, shore and kuleana, and a floor that thins inland, scaled per island to King's 1779 estimate (Niʻihau and Kahoʻolawe back-cast from 1832); on Kauaʻi each ahupuaʻa's share from the 1835 counts | modelled: rain, elevation and lava age, cleared below 460–760 m after Kirch, never less than the native forest standing now |
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
Bay and Mōkapu, Kailua and Waimānalo. The third is `honolua`, on Maui: Honolua
Bay and its headlands, from Kapalua to Honokōhau, for the departure of
Hōkūleʻa in 1976 (DESIGN.md §14).

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
- **A fishpond's type.** A fishpond may carry `pond`, its kind in Kikuchi's
  typology (1973, Appendix A): `kuapa`, a loko kuapā, the shore pond walled
  in stone or coral on the side or sides facing the sea; `puuone`, a loko
  puʻuone, a shore pond behind a barrier beach, joined to the sea by a
  ditch; `wai`, a loko wai, an inland fresh-water pond, a natural lake or
  marsh. Unset is `kuapa`. The app walls a loko kuapā in stacked stone along
  its whole outline; a loko puʻuone or a loko wai keeps the banks its outline
  gives it, the sand, the marsh or the foot of the hills, since a wall
  somewhere on it (a dividing wall, a ditch's mākāhā) is not the outline.
  Kawainui and Kaʻelepulu are `wai`, as Kikuchi lists them (pp. 238, 242),
  and Cobb's "fresh-water pond" of about 1900 is Kaʻelepulu too.

### How to bake a district

`tools/bake-district.mjs` writes `public/data/districts/manifest.json` and, per
district, `height.png`, `rain.png`, the patches and their supporting files. It
never writes `features.json`, which is hand-written.

```bash
node packages/holo-i-ke-au/tools/bake-district.mjs --all                        # nuuanu: download (~1.5 GB), bake, check, delete the downloads (~6 min)
node packages/holo-i-ke-au/tools/bake-district.mjs --all --district koolaupoko  # koolaupoko: ~3.6 GB, about 25 min (1,419 lidar tiles)
node packages/holo-i-ke-au/tools/bake-district.mjs --all --district honolua     # honolua: ~1.2 GB, about 2 min (99 lidar tiles)
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

What `honolua` rests on (RESEARCH.md §18):

- **Box**: Honolua Bay with Līpoa Point and the point toward Mokulēʻia, from
  Kapalua Bay and Hāwea Point to Honokōhau Bay and its stream mouth, and 2 km
  of sea off the bay for the canoe's course out (156.674–156.600 W,
  20.996–21.040 N): 1270 × 801 at 6.08 m, `parent: "maui"`, `moku:
  "Kāʻanapali"`, listed after the two Oʻahu districts. It overlaps no other
  district.
- **Heights**: the same lidar, `HI_NOAAMauiOahu_2020_B20`, whose Maui part
  (99 tiles, flown January to July 2023) sits on the same zero: less 0.72 m it
  stands −0.01 m over the CUDEM, so the shift is kept, declared on the
  district (`lidarShift` in `district-sources.mjs`, 0.72 m unless a district
  says otherwise). Every square with no tile is open sea; no land texel comes
  from the CUDEM. No walls, no islets.
- **Sea**: the CUDEM's two tiles; the stream mouths it holds as land are a
  flat −1 m.
- **Rain**: as for `nuuanu`.
- **Patches**: none (`patches: false`). The geologic map's fill unit has no
  polygon in the box, and nothing read shows made ground in the bay by 1976;
  the Government Survey sheets the State serves are Oʻahu's, so none is
  exported (`maps: []`).
- **Streams**: routed by the app with no breach; the check follows Honokahua,
  Honolua and Honokōhau streams to tidewater, each 100% on the State's lines.
- **Features**: the departure of Hōkūleʻa on 1 May 1976 as vessels and crowds
  (below, "Vessels and crowds, in a district"), with labels and the three
  streams.

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
  was filled. Natural channels through the reef (Māmala, the Kalihi
  entrance, the Pearl Harbor entrance as it was before 1900, the Kāneʻohe
  Bay channels) stay open: a patch must not invent a reef where the old
  surveys show a passage.
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
- **Accepted extensions (the shore before the harbour, ISSUES.md 4).**
  - A lower mask's weights may carry relief as a raise's do: `depth` is then
    the *deepest* point of the surface, and each texel's weight what takes
    today's height to its own point of it under the same mix. The island
    pack's lowers are baked so, at the reef round them; a district reads
    its lower masks as whole or nothing (≥ 128) and lays the reef itself
    (below), so a district's lower masks keep 255 over their whole.
  - A raise's surface may stand above the sea where the water was cut into
    the land since (a slip, the head of a basin): `depth` is then that
    land's height, and the weights of the texels that go back to reef are
    under one.
  - A district lays a lower patch's texels at the reef round them where
    that is deeper than the patch's `depth` (reef only: a `depth` at or
    above 0 is laid as given): the sea of the patched years outside the
    patch, between −6 m and the tide, carried over it (district-decode.js
    `reefLevel`), so a fill's straight edges leave no step in the reef.
  - Of two lower patches on one district texel, both in force, the deeper
    `depth` holds (a pier in the harbour goes to its floor though the fill
    beside it goes to the reef).
  - The sea draws a patch's reef flat as it draws the natural reef beside
    it, by its depth alone (ocean.glsl.js); `patchReef` only keeps the swash
    to the real shore.

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
| the old shore, passages, bars | the State's georeferenced 1881 Government Survey sheet; the 1899 sheet for the Pearl Harbor bar | traced by hand: the 1881 sea from Keʻehi to Waikīkī (the district's `shoreline-1881.geojson` carried west along Keʻehi lagoon), Ford Island and Kuahua, Quarantine Island, the Māmala, Kalihi and Pearl Harbor passages and their bars |
| Sand Island in 1938 | the State's georeferenced 1938 topographic map | traced by hand: the island before its wartime fill |
| the shore before the harbour | Malden's plan of the harbour (1825, the University of Hawaiʻi's scan); Queen Street (OpenStreetMap) as “the water's edge”; the 1943 and 2000 sheets over Keʻehi | the reef in front of the town before the Esplanade (1856–60); the cay Quarantine Island grew round; what stood in Keʻehi lagoon before its dredging (RESEARCH.md, “Honolulu's shore before the harbour”) |
| dates | the harbours' own histories, each named in its patch's `sources` with what it says | `until`, and the note |

How a mask is made:

- **Raise.** Cut ground is the CUDEM inside a work's zone deeper than the
  group's `cut`, outside the passages, and not natural deep water: what stays
  of the water deeper than the cut once everything narrower than 500 m is
  opened away, where it reaches 20 m depth (the fore-reef), unless the chart
  keeps it dredged. On each pack the texels it touches, grown by about 20 m
  (two texels on the island pack, where GMRT smooths a channel into its
  sides), make the footprint; it is laid back at the reef that rims it, a
  smooth surface held at the reef's depth on the rim (the CUDEM's on a
  district; on the island pack the pack's own, which is what is drawn
  beside it) and free where it meets land, a passage or deep natural water,
  so the old reef edge stays sharp against a passage. Water cut into the
  land since, inside the 1881 shore and off the reef the Esplanade was made
  on (`OLD_LAND`), goes back to land at +0.5 m, as the Ala Wai does, not to
  an inlet of reef. Over a bar it is never shallower than the bar's
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
  `depth`. On the island pack a reef lower (`level` under 0, not `flat`) is
  laid at the reef round it: the year's sea beside the footprint (today's,
  the raises laid back), between −6 m and the work's level, spread over it
  as a raise's rim is; `depth` is the deepest of that surface and the
  weights carry its relief. A district's lower masks stay whole, at the
  work's level; the district lays the reef round them itself. `flat` works
  keep their level: the piers in the harbour at Kou, laid at its floor
  (−6 m), and Ford Island and Kuahua, in the lochs' deep water.
- Within one pack no texel's raise weights, nor its lower weights, add up to
  more than one: groups and works claim their texels in turn (a lower by its
  share before the relief), and `honolulu-waterfront` takes only what the
  dated works leave.

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

The shore before the harbour (RESEARCH.md, "Honolulu's shore before the
harbour"), on every pack where the work lies, listed after the others in
the manifest (`appended` in `patch-works.mjs`): lower the Esplanade and the
wharves at Kou to the reef along the town, Queen Street its shore (1856);
the piers in the harbour at Kou to its floor (1896); the piers and wharves on
the reef of Iwilei and Kapālama that the fill unit misses (1900); the islets,
dike and fills in Keʻehi lagoon (1944); the made ground either side of the
harbour's mouth, back to the reef Malden draws there (1900); and Quarantine
Island, as the 1881 sheet draws it, to the reef round a cay of about two
hectares (1869).

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
stands above `depth`; no raise texel touching a passage (on the island pack,
whose texels are wider than the Kalihi entrance, none at least half in one);
weights of one kind on one pack never over one; every patch with a note and sourced date, every
source with its URL, date and licence; and `public/data/patches/` under 1 MB.
It prints, per raise patch, the median depth of its ground today and in 1795.

### Accepted extensions (restore)

The island packs' restores are baked and listed but not laid: with them the
island programs bound eighteen samplers once an island's crop map was in,
two over the sixteen texture units common GPUs give a fragment shader, and
the island went white or vanished as the map came and went; at 68 m a texel
they read as little more than texture anyway. The district's, at 6 m, are
laid (`RESTORE_ISLANDS` in `config.js`).

A raise or a lower lays its texels at one depth, which is right for a reef
flat and wrong for a hillside: the ground a highway was cut into, and the
fill it was raised on, has to go back to a surface that runs with the valley's
sides. So a third kind, `restore`, carries the surface itself. It lives in the
same `patches/manifest.json`, its entries together at the end of the list
(`bake-patches.mjs` keeps them there when it writes the rest).

```jsonc
{ "id": "nuuanu-road-pali-highway", "pack": "nuuanu",   // an island pack id or a district id
  "kind": "restore",
  "until": 1952,                                       // the patch applies to years before this
  "file": "patches/roads/nuuanu-road-pali-highway.png",
  "box": [691, 279, 1076, 976],                        // i0, j0, width, height: the texels of the pack the image covers
  "delta": { "scale": 0.01, "offset": -327.68 },       // change metres = (R·256 + G)·scale + offset
  "works": "pali-highway",                             // the works' road section it undoes
  "name": "...", "note": "...", "sources": [ ... ], "stats": { ... } }
```

- **The image.** An 8-bit RGB PNG over `box`, registered on the pack's grid
  as the pack's heights are. R and G carry the change from today's height to
  the ground as it was, split as the heights are (DATA.md §2, so it decodes
  exactly); B is the weight, 0 outside the patch, 255 in it. The laid-back
  height is `h + change · B/255 · k`, `k` the patch's weight in the year (1
  before `until`, eased over a couple of seconds as the year crosses it, as
  the other kinds are). A cut is a positive change (ground taken away comes
  back), a fill a negative one. The change, not the surface, is stored, so
  the app needs no heights to lay it and a centimetre is kept; the surface is
  today's height plus it. Like every mask it is made against its pack's bake:
  a re-baked pack needs its restores baked again.
- **Order.** Restores first, on today's heights, then the raises and the
  lowers, as before.
- **One per texel.** On one pack no texel is in two restores, so the app
  keeps one change and one patch index per texel. Where two roads meet, a
  texel goes to the nearer.
- **Where they lie.** Only on today's land, never laid back below the sea,
  never under a harbour patch of the same pack, and not over a tunnel away
  from its portals: the ground over a tunnel is untouched, only its portals
  were cut.
- **The app.** `render/restores.js` reads the restore entries (and
  `data/patches.js` leaves them out of the others' list), cuts every pack's
  grid into 16-texel squares and keeps only those a restore reaches, in one
  float atlas with an index per pack; the island slots and the district read
  their own squares (`common.glsl.js` `restoreSlot`, `distRestore`). The
  normal maps are today's ground, so the island shader adds the change's own
  slope to them (`restoreSlotG`), and the district's takes it from its texels
  as it does a patch's beach. `world.metresAt` and the district's `metresAt`
  carry the same on the CPU. Up to 96 restores (`config.js RESTORES`).

### How to bake the restores

`tools/bake-roads.mjs --bake` (about a minute; nothing to download) writes
`patches/roads/` and the restore entries; `--check` reads them back; `--all`
does both. It reads the packs' heights and the works' highways
(`works/oahu.geojson`), and bakes onto the `oahu` island pack and every Oʻahu
district (`nuuanu`, `koolaupoko`). Run it after the pack, district, patch and
works bakes. The code is `tools/lib/roads-bake.mjs` and `roads-check.mjs`.

The rule, per pack:

1. **The roads.** Every highway `road` of the works, its line and its drawn
   width (DATA.md "Works", Widths). Tunnels are not roads here: the works cut
   the road at the portals, so the ground over a tunnel is never in a road's
   reach. An *interchange* is where an end of one road lies within 60 m of
   another (not at a tunnel's portal); within 320 m of one, the ramps the works
   do not draw widen the search.
2. **How wide the ground was disturbed**, from the terrain itself. Each road
   is cut into stretches of about 200 m, and each side of each stretch is
   read on its own: the mean of the ground's curvature (|∇²h|) at each
   distance from the road's edge, in texel-wide bins out to 90 m (200 m at an
   interchange), against its mean over the 50 m beyond. The breaks of slope at
   the top of a cut and the toe of a fill run along the road, so they stand
   out of the mean at their distance; gullies and spurs crossing the road
   average out. The disturbed width on that side is the last bin whose mean
   passes 1.5 times the ground's own and 0.004 /m, before three quiet bins in
   a row; a stretch takes the median of its own and its neighbours' widths.
   At least the road's own strip and 8 m of shoulder. On the island pack
   (68 m texels, a road narrower than one) the strip alone, at least
   three-quarters of a texel's diagonal from the line.
3. **Kept off** today's sea and 15 m of shore (two texels at the least), so
   the sea floor never pulls on the surface, and off the pack's harbour
   patches.
4. **The surface.** A thin plate (∇⁴u = 0) over the disturbed texels, held to
   today's ground round them, solved by conjugate gradients from a membrane's
   guess (∇²u = 0): it carries the valley sides' slope and curvature in across
   the corridor and meets today's ground at the edge with no step. Where the
   plate would leave the range of the undisturbed ground within 150 m (a sag
   below the lowest of it or a bulge above the highest), the membrane, which
   cannot, is taken there. On the island pack the membrane alone: at 68 m a
   plate carries a valley's V below its floor.
5. **By road.** Each texel goes to the nearest road; a road's texels on a
   pack are its patch. A texel laid at the shore (0.5 m or lower), and a patch
   under 2,500 m² or nowhere changing the ground by 3 m, go back to today's
   ground, and the surface is laid again without them, so no kept texel leans
   on one that is not laid back.
6. **The date.** Each patch's `until` is its road section's own in the works:
   the start of its `built` where the works give one earlier than `from`
   (the grading began then; the road itself is drawn in across those years
   from that start), else `from`. So the Pali Highway's patches end in 1952
   (opened 1957, finished 1961), H-1's Lunalilo Freeway in 1953 (opened
   1969), Hālawa–Kahauiki in 1971 (finished 1986), H-2 in 1971 (opened 1974–77);
   H-3's Hālawa and windward sections in 1997, its Kāneʻohe section in 1987
   and the Mōkapu piece in 1977, because the works record no start of their
   building (H-3's grading began about a decade before it opened; the works
   would have to say so first). Likelike 1960, Kahekili 1972, the
   Nuʻuanu Pali Road of 1898, Kamehameha Highway 1921, Kalanianaʻole Highway
   1924–1931 and Farrington Highway 1934–1937, each `by` or `year` as the works
   date it.
7. **The entry**: `box`, `delta`, `works`, a note saying how the patch was
   found, its road's own sources from `sources.json` and the pack's height
   source, and `stats` (`texels`, `km2`, `meanWidthMetres`, the cut and fill
   texels and their mean and greatest change).

The check (`--check`) holds the entries whole and sourced, each `until` to its
works section's; each image an RGB PNG of its `box` inside its pack; on each
pack no texel in two restores, none on today's sea, laid back below it, or
under a harbour patch, and nothing laid back over a tunnel more than 120 m
from its portals; no texel laid back outside the range of the undisturbed
ground within 150 m of it; the restore entries together at the end of the
list; and `patches/roads/` under 768 kB (with the harbours, `patches/` stays
under 1 MB). It prints how many texels at a restore's edge climb more than
2 m past the slope of the ground beyond them, which is where the edge meets a
pali's foot or brow, and each patch's size and greatest cut and fill.

Not done: the Moanalua Freeway (H-201) has no road in the works, so its cuts
and its interchange with H-1 at Hālawa stand at every date until the works
carry it; and the works give a road as one line, so where its two
carriageways part farther than the search reaches, the cut of the one the
line does not follow stays.

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
- How many of the lots the zoning allows a tower on carry one in a year is
  the towers' record's ("Towers, dated" below), not the zoning's.
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
- **The settlements** keep their lots off a `land`, `range` or `field` and
  the building drawn for a `block` (its footprint's box, or its kit's size
  where it is a point) from its `from` (or the start of its `built`) through
  its `to`, and off a `runway`, `road`, rail `line`, `pier` or `breakwater`
  as a strip of its drawn width in the same years: the contract's rule, with
  the roads and the rail added, since a house standing on a highway's
  ribbon reads as a fault.
- **A block's `use`.** Optional, from the OSM tags: `hangar`, `barracks`,
  `hospital`, `warehouse`, `industrial`, `office`, `school`, `church`,
  `residential`, `tower` (anything else, or none, as none). The app picks a
  block's building by its use first: a hangar; barracks of two storeys, or
  three from three up; a hospital, an office or a school a concrete block of
  its storeys (where `storeys` is absent, a hospital 6, an office 4, a
  school 2); a tower the town's tower (12 storeys where absent); a warehouse
  or an industrial building a low block; a church the town's church; a
  residential building the town's house. Without a use, by `storeys` and
  size as before: 4 and up a concrete block, 3 or 2 barracks, 1 a hangar
  over 900 m² and a low block under it, none a hangar over 2,500 m² and
  barracks of two under it. A block given as a point keeps the ground of
  the building drawn for it.
- **The trees.** No tree stands on a `block`, `runway`, `field`, `pier` or
  `breakwater` in its years (the district's trees and the crop trees on an
  island or a district alike); the land, a range, the roads and the rail
  keep theirs.
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

## Landmarks, dated: named buildings at their footprints

The buildings the town is known by, each drawn at its own footprint from the
year it stood finished to the year it went, so ʻIolani Palace stands on its
ground from 1882 and the first palace stood there before it, and the town's
modelled lots (DESIGN.md §5.4) yield to them as they yield to a loʻi. One
file, `public/data/landmarks.json`, a GeoJSON FeatureCollection in lon/lat:

```jsonc
{ "about": "...", "baked": "2026-11-06",
  "types": ["palace", "hall", "church", "house", "villa", "statue", "hotel", "tower", "block"],
  "sources": [ { "id": "osm-landmark-footprints", "title": "...", "url": "...", "licence": "...", "fetched": "..." } ],
  "type": "FeatureCollection",
  "features": [ { "type": "Feature", "geometry": { "type": "Polygon", "coordinates": [...] }, "properties": {
    "id": "iolani-palace", "name": "ʻIolani Palace", "type": "palace", "group": "iolani-palace", "place": "iolani-palace",
    "island": "oahu", "from": 1882, "to": null, "built": [1879, 1882], "datePrecision": "year",
    "precision": "exact", "storeys": 2, "layer": { "source": "osm-landmark-footprints", "key": "way/67136074" },
    "listed": "nrhp-hawaii-capital-historic-district",
    "sources": ["nrhp-hawaii-capital-historic-district", "osm-landmark-footprints", "wikipedia-iolani-palace"],
    "note": "..." } } ] }
```

| field | values |
| --- | --- |
| `id` | kebab-case ASCII, unique |
| `name`, `alt` | with the standard ʻokina and kahakō, no other apostrophe (the Cathedral of St. Andrew) |
| `type` | the kit it is drawn with, one of the file's `types`; `look` a kit's variant (a hall `italianate`, `mission`, `stone` or `barracks`; a church `coral` or `gothic`; a house `lanai` or `mission`; a hotel `colonial` or `moorish`; a block `theatre`) |
| `group` | the building, where it has several forms (the first palace and the second; the Moana before and after its wings) |
| `place` | optional: its id in places.json |
| `island` | its island pack |
| `from`, `to` | the years it stands whole; `to` null while it stands; `built: [start, end]` optional, the years of building, ending by `from` |
| `datePrecision` | `year` · `decade` · `by` (with `by`, the opened source that first shows it) |
| `precision` | `exact` (a mapped outline) · `mapped` (a mapped point, its `size` drawn) · `inferred` (another entry's ground, at a size or share its note gives) |
| `layer` | where the footprint came from: `{ source, key }` (a source of the file's own and the element) or `{ source: "inferred", from }` (the entry whose ground it takes) |
| `storeys` | whole storeys above the ground |
| `listed` | a source among its own, opened, showing the building, or the ground it stood on, is a listed public site (a National Register nomination, a State register entry): the gazetteer's landmark rule (§4) |
| `sources` | ids in sources.json, at least one opened |
| `note` | what it is and what the sources could not settle |

Any other kind of building with a place and dates (a school, a mill) goes in
the same file with a `type` of its own: the app draws a type it has no kit
for as a hall of its `storeys`, and a kit of that name in
`src/features/landmarks.js` is all it takes to give it its own form.

**What the app draws.** The district's scatter (`features/settlements.js`,
`features/landmarks.js`) draws each building whose footprint lies inside its
own lots, whole from `from` through `to` (fading in over the half year
before and out over the half year after), on the highest ground under it in
its first year. Its
footprint is turned and boxed to its outline's tightest rectangle and drawn
at 1.9 times life, as the town's buildings are drawn larger than life,
unless that would reach another named building standing in the same years,
when both are drawn smaller, down to life. Each type is a kit in the house's
low-polygon manner (a palace with its lanai and towers, a hall with its
tower, a coral or a stone church, a house with a lanai or a small mission
house, a villa with colonnades, a statue on its pedestal, a hotel with its
verandas or its pink towers, the harbour's clock tower, a block), fitted to
the footprint's length and width and as tall as its length's scale allows.
The lots keep off its drawn footprint from `from` until the year after `to`,
and across a gap of up to ten years between two forms of one `group` on the
same ground, as at any break in their years (a lot's building fades out
before the half year ahead of the break and the next fades in after it), so
a lot's building is gone before a named one fades in and comes back only
after it has gone; the scatter's own
modelled landmarks keep off the ground of every named building in any year,
and a named church standing in 1842 (Kawaiahaʻo) and a named tower in 1926
(Aloha Tower) stand for the modelled ones. The trees stand back from them
as from the town. Nothing names them on the screen yet: a card that does
will cite what its `sources` say was read.

**Accepted.** The rules `tools/check-data.mjs` enforces: the vocabularies
above; `from` ≤ `to` and both within 1778–2026; `built` in order and ending
by `from`; a `by` date naming an opened source among its own; an inferred
footprint naming an entry that exists; every ring closed and inside its
island pack; `listed` present and opened; names and notes Hawaiian-checked
and held to the copy rule; the file under 200 KB; and no two buildings
standing in the same years on one ground (their outlines, at life, neither
crossing nor holding a corner of the other).

### How to bake the landmarks

The table is hand-written in `tools/lib/landmarks-table.mjs` (its header
lists the `geom` forms: an OSM way, relation or point, several ways built
wall to wall, or another entry's ground); the bake fetches each footprint
from the OSM API by element id and writes only `public/data/landmarks.json`.

```bash
node packages/holo-i-ke-au/tools/bake-landmarks.mjs --all        # download, bake, check, delete the downloads (under a minute)
```

or `--download` (a call every 1.5 s, a few KB each), `--bake`, `--check`
(runs `tools/check-data.mjs`), `--clean`. `--downloads DIR` (or
`$HOLO_LANDMARKS_DOWNLOADS`) moves the downloads from
`<os tmpdir>/holo-i-ke-au-bake/landmarks-downloads`; keep them outside the
repo. Node 22 and `curl`. A re-bake from the same downloads is
byte-identical but for `baked`; OSM's outlines move as they are edited.

**What it rests on.** The buildings of the Hawaiʻi Capital Historic District
(the palace and the first palace, Aliʻiōlani Hale, Kawaiahaʻo and the Mission
Houses, Washington Place, the Cathedral of St. Andrew, the statue, ʻIolani
Barracks, Honolulu Hale) are dated and listed by the district's National
Register nomination of 1978, read in its text (the inventory and the
history); the others (the Post Office, Aloha Tower, the Hawaiʻi Theatre,
Hawaiian Hall, the Moana and the Royal Hawaiian) by their encyclopaedia
pages, read as finding aids and marked tertiary. The outlines of the
buildings standing are OpenStreetMap's; the first palace stands on the
present palace's ground at a size no source read gives, and the Moana of
1901 is drawn as the middle of today's H, both `inferred`. Not yet here, for
want of an outline or a date read: the Fort (Kekuanohu, 1816–1857), the
courthouse of 1852 on Queen Street, the barracks' first site, Kaumakapili
(1888–1900 at Smith and Beretania; 1911 at Pālama), the Hawaiian Hotel of
1872 on Hotel Street, Queen's Hospital's building of 1860, the Oʻahu Railway
terminal of 1925, the Seamen's Bethel and the Customs House, the bandstands
of the palace and Kapiʻolani Park; the Sanborn sheets of 1914 and 1927
(Library of Congress) and the Government Survey's town sheets would place
most of them. The Royal Mausoleum is a burial ground and is not placed (§4).
## Schools, dated

Every school the record dates and places, standing from the year it opened
to the year it closed or moved (ISSUES.md 11): today's public and charter
schools, the private and mission schools, the colleges and the university,
and the schools of the kingdom and the territory where a source gives the
site. Each is a dated landmark of `kind: "school"`, the shape the named
buildings share (a kind, a place and grounds where they are known, years,
sources), so a palace and a school can be read by one reader. One file,
`public/data/schools.json`, a GeoJSON FeatureCollection in lon/lat (WGS84),
under 1.2 MB.

```jsonc
{ "type": "FeatureCollection",
  "about": "...", "baked": "2026-11-06", "tolerance": 4,       // metres the grounds were simplified to
  "layers": [ { "id": "hawaii-gis-public-schools", "layer": "https://...", "fetched": "2026-11-06", "features": 292 } ],
  "sources": [ /* the records the years and sites were read from, in sources.json's shape (§4) */ ],
  "unplaced": [ { "name": "...", "type": "mission", "island": "oahu", "from": 1864, "to": 1907, "sources": [ ... ], "note": "..." } ],
  "stats": { "oahu": { "schools": 263, "grounds": 175, "standing": 255, "by": 97, "types": { ... } } },
  "features": [ { "type": "Feature", "geometry": { "type": "Polygon", ... }, "properties": { ... } } ] }
```

Every feature's `properties`:

| field | values |
| --- | --- |
| `id` | kebab-case ASCII, unique (`lahainaluna-high`) |
| `kind` | `school` |
| `name` | as the school writes it, with the standard ʻokina and kahakō; the name of the placement's years where it changed (`Chiefs’ Children’s School`), `alt` for others |
| `label` | optional: the name the app shows across all the placement's years, where the name changed in a year the record read does not give (Lahainaluna, a seminary before it was a high school) |
| `type` | `public` · `charter` · `private` · `mission` · `government` (the kingdom's and the territory's schools now gone) · `college` · `university`: what it is today, or was when it closed; `opened_as` where it began otherwise (Lahainaluna: `mission`) |
| `island` | the island pack's id |
| `at` | `[lon, lat]`, the school's point (the State's layer, or the site a source gives) |
| `from`, `to` | the years it stood here: `from` the year it opened or came to this site, `to` the last year here (`null` while it stands) |
| `datePrecision` | `year` · `decade` · `by` (the first record that shows it, named in `by`; the true year is earlier) |
| `precision` | of the place: `exact` (a surveyed layer) · `mapped` (a source's own coordinates or a mapped building) · `inferred` (a site a source describes: beside a named building, a street, a village) |
| `group` | the placements of one school that moved, or one institution's campuses (`saint-louis-school`: Kamakela 1883–1927, Kalaepōhaku from 1928) |
| `grades`, `pupils` | `pupils: { year, n, source }`, the size the kit is chosen by |
| `look` | optional: `[{ kit, variant, from }]`, what stood there by year where the record says more than the eras would (Lahainaluna's thatched beginning) |
| `layer` | `{ source, key }`: where the point came from (a layer's object id, an OSM element, a source's coordinates) |
| `grounds` | on a Polygon: `{ source, key, area }`, the OSM way the grounds were taken from, and its area in m² |
| `sources` | `[{ id, where }]`, ids in the file's own `sources` or in sources.json, at least one opened |
| `note` | what the record says of the school, in its plain words; years and days only, no figures |

The geometry is the school's grounds (a Polygon, the campus as
OpenStreetMap draws it) where one holds its point, else the Point. A
school that moved is a feature per site; where it stood between two sites
that the record does not give, it is in `unplaced` for those years, with its
sources and why.

Rules, enforced by `tools/check-data.mjs`: ids unique; vocabularies as
above; the point on its island's land (a moku polygon of that island, or
within 150 m of its coast) and inside its pack; the grounds a closed ring
holding the point or within 250 m of it, inside the pack; `from` a year from
1820 to the bake's, `to` null or from `from` on; `by` among the sources and
opened; every citation's id in the file's sources or sources.json, one of
them opened; the file's own sources under §4's rules (`read`, `opened`,
`wanted`), none repeating an id of sources.json; `look` within the years; the
names Hawaiian-checked; notes under the copy rule (DESIGN.md §7.4) and
carrying no figure but years and days; `unplaced` dated and sourced; the
stats as the features have them.

**What the app draws** (features/schools.js, data/schools.js): every school
on an island in its slot, from the near zoom out to the island zoom as the
works' buildings are (BLOCK_RIG), in the kit of its era (buildings.js
schoolKits, in the town's manner and scale): the frame schoolhouse of one
room, a porch and a bell for the kingdom's and the plantations' schools, of
two rooms with a yard for the larger, and the mission's two-storey hall of
coral and plaster for the mission's schools and the large private ones; from
about 1910 (each school in a year of its own between 1903 and 1917) the
territory's two-storey block of tall windows before a yard, an L of two for
a large school; from about 1955 (1950–64) the campus of low wings with
covered walks and a field, three, four or six wings by size. A college or a
university is a block before 1946 and a campus after. A school's size is its
pupils where the file has them (under 200, under 900, more), else its
grounds' area, else its kind; a school on grounds is turned to their long
axis and fitted inside them. The eras cross over on one window, dithered
over complementary pixels. The names show at the near zoom while the school
stands. The settlements (the district's and every island's) keep their lots
off the building drawn in its years, and from the campus on off the whole of
its grounds; the trees keep off the building: features/works.js joins the
schools' polys to the works' exclusion, so every reader of the works' ground
reads them. The schools' years after 1899 are not among the settlements' sampled years (the works' are, and the schools' before 1900, few, where the town's landmarks are placed by their year): a school keeps the lots off from four years before it opens to four after it closes (data/schools.js KEEP_SLACK), so the lot is refused at the last sample before it and comes back at the first after. A data set without `schools.json` has no schools; `?schools=<base>`
reads them from another base.

### How to bake the schools

```bash
node packages/holo-i-ke-au/tools/bake-schools.mjs --all        # download (about 1 MB), bake, check, delete the downloads
```

or `--download` (the State's three school layers and the OSM grounds the
table names, by id, through the Overpass API), `--bake` (joins, simplifies
the grounds to 4 m, winds them, writes `public/data/schools.json`; stops on
any row that does not join, a point off its pack, a point more than 250 m
from its grounds, or the budget), `--check` (runs `tools/check-data.mjs`),
`--clean`. `--downloads DIR` (or `$HOLO_SCHOOLS_DOWNLOADS`) moves the
downloads from `<os tmpdir>/holo-i-ke-au-bake/schools-downloads`. Node 22 and
`curl`. A re-bake from the same downloads is byte-identical but for `baked`.

**Where things live.** `tools/lib/schools-table.json` is the hand table:
one row per placement with its name, type, island, years and their
precision, sources, note and group, joined to its point by `at: { layer,
key }` (the State layer and its `objectid`) or given one (`at: { lonlat,
precision, source, key }`), and to its grounds by `footprint` (an OSM `way/`
or `relation/` id, or null); with the sources the rows cite and the schools
dated but not placed. The table was written from the research below; the
bake does not read the reports themselves.

**What it rests on**:

| what | source |
| --- | --- |
| public and charter schools' places | the State's Public Schools layer (Infrastructure MapServer 7, the Department of Education's of November 2024), its `objectid` per school |
| private schools' places | the State's Private Schools layer (MapServer 8, the Hawaiʻi Association of Independent Schools' members of November 2021) |
| colleges' places | the State's Postsecondary Institutions layer (MapServer 27, April 2017), the institutions with campuses |
| grounds | OpenStreetMap's `amenity=school`, `college` and `university` areas: the area holding the school's point whose name shares a word with the school's, else a named one within 350 m, else an unnamed one under 20 ha holding the point; one wrong match (Mililani High, given its neighbour's) set to none by hand |
| public schools' years | the Department's School Status and Improvement Reports (SY 1999–2000, 2004–05, 2009–10, 2014–15, 2018–19, 2024–25): the year each school's description says it was founded, established, opened or built, read by hand where a description gave another year (a programme's, a building's, an award's) or a move; where none says, `by` the first report that has the school |
| names | the Department's own titles of SY 2024–25 and the Hawaiian words of its reports, the Charter School Commission's names for the charter schools, by hand where the layers abbreviate |
| private schools' and colleges' years, moves and earlier sites | Wikipedia's articles on each (tertiary, read for their dates, moves and the sites they describe) and Wikidata's inception dates as a finding aid; where neither, `by` the State's layer of 2021 or 2017 |
| sites now gone | the place a source names, as OpenStreetMap draws it: the Chiefs' Children's School where ʻIolani Barracks stand, the Kamehameha School for Boys on the Bishop Museum's grounds, St. Louis College beside Washington Place and at College Walk, the convent school beside the Cathedral of Our Lady of Peace, Hawaii Baptist Academy on Heulu Street, Maui High School at Hāmākuapoko |

The kingdom's Board of Education reports, the Government Survey's Honolulu
sheet of 1887, Sanborn's maps and the mission's station reports would give
the government and station schools of the 1840s–1890s and their sites; none
was opened in this pass, and each is in the file's sources with its
`wanted`.

## Streets, dated

The towns' streets as they ran in a year, so the settlements lay their lots
along real streets from the time a street is known, and the modelled grid
(DESIGN.md §5.4) holds only outside them. Under `public/data/streets/`: a
`manifest.json` and one GeoJSON per town, `streets/<town>.geojson`, in
lon/lat (WGS84), simplified to 2 m, the whole directory under 5 MB.

The streets are today's: each county's own centrelines as the State GIS
serves them, cut to the town's box (a segment whose middle point lies in
it). Each segment (a stretch between crossings, as the county draws it) is
dated by the oldest sheet over the town that draws it, found on the sheet by
its line (the bake, below): the sheets the State serves georeferenced, and
the Government Survey's registered maps of the towns, placed here on
today's streets. A street a dated directory lists by name is dated by the
directory, on the stretches a map of its years shows (below, "How the
directories date a street"). A street's segments of one date
are then joined end to end where no third of them meets the joint, so a
feature is a run of one street of one date. A street known only from today's layer is dated by the
layer's year. So every date is a `by`: the street was there by then, and
the sheet before it (`after`) does not draw it. A street that was closed or
built over before today is not in today's layer and not here; `to` is in
the contract for it, and stays null in this bake.

```jsonc
// streets/manifest.json
{ "about": "...", "rule": "the finding and dating rule written out", "baked": "2026-11-06", "tool": "tools/bake-streets.mjs",
  "centrelines": { "oahu": { "id": "state-gis-oahu-roads", "url": "...", "fields": "...", "asOf": 2024, "licence": "...", "fetched": "...", "note": "..." } },
  "directories": [ { "source": "bennett-1869-honolulu-directory", "town": "honolulu", "year": 1869, "within": 20,
                     "streets": { "Nuuanu Street": ["NUUANU AVE"], … }, "lost": ["Emma Street", …] } ],
  "towns": [ { "id": "honolulu", "name": "Honolulu", "island": "oahu", "bounds": [west, south, east, north],
               "file": "honolulu.geojson", "centrelines": "state-gis-oahu-roads",
               "sheets": [ { "year": 1881, "source": "hgs-1881-oahu", "service": "...", "old": true,
                             "shift": [east, north],              // metres the sheet was moved over the town
                             "cells": [ { "cell": [i, j], "shift": [east, north] } ], "cellsOwn": 79, "cellMetres": 1200,
                             "found": 0.12 },                     // share of the town's pieces the sheet draws
                           { "year": 1881, "key": "rm867", "source": "hgs-rm-867", "service": "https://kipukadatabase.com/…",
                             "placed": { "registeredMap": 867, "scale": 6000, "transform": [a, b, c, d, e, f],   // map pixel (u, v) → grid pixel: (a u + b v + c, d u + e v + f)
                                         "turn": 0.04, "metresPerPixel": 0.972, "printed": 1.003, "score": 0.36, "mask": [] }, … } ],
               "stats": { "segments": 7411, "km": 1043.2, "kmBy": { "1881": 40.1, … } } } ] }
```

Every feature's `properties`:

| field | values |
| --- | --- |
| `id` | kebab-case ASCII, unique across the towns (`honolulu-412`) |
| `town` | the town's id in the manifest |
| `layerName` | the county layer's own name for the street, verbatim (`NUUANU AVE`); read by nothing in the app, kept for tracing |
| `class` | `arterial` (the county's highways and main roads) · `street` |
| `from` | the year of the sheet that first draws it, or the layer's year |
| `to` | `null` while it stands; a year where a street was closed or built over |
| `datePrecision` | `by`, always |
| `by` | the id in `sources.json` of that sheet (or of the layer); opened |
| `after` | the id of the last sheet before `by` that covers the street and does not draw it; `null` where none does |
| `seen` | per sheet of the town, in the manifest's order: the share of the street's length the sheet draws, or `null` where the sheet does not cover it |
| `shownBy` | where `by` is a directory: the sheet that shows the stretch (its date pushed back to the directory's) |
| `sources` | the layer, `by`, `after` and `shownBy` |

Rules, enforced by `tools/check-data.mjs`: ids unique and kebab-case;
`town` the town's; `class` from the two; `from` a year from 1778 to the
bake, the year of its `by` sheet where `by` is a sheet; `to` null or not
before `from`; `datePrecision` `by`, `by` among the sources and opened,
`after` one of the town's sheets; `seen` one share per sheet; each street a
LineString meeting its town's box; the towns' boxes inside
their island packs and overlapping no other; each sheet's source in
`sources.json` and opened, the sheets in order of year; every file listed;
the directory within its budget; the town's name Hawaiian-checked.

**What the app does with them** (`src/data/streets.js`,
`src/features/streets.js`, `src/features/settlements.js` `lotsOf`):

- **The lots.** Along both sides of every street a lot of the grid's size
  (36 m along the street, 40 m deep), its front 7 m back from the street's
  strip (as far as a building's front may reach past its lot on the grid), laid oldest street first so an older street keeps its
  corners; none on another street's strip or over another lot, in any year.
  A lot stands in its street's years (`from` to `to`), coming in over the
  three years before `from` so that it stands whole in the sheet's year
  (the street was there by then); its rank is a golden
  sequence along the street, scaled by how much closer than the grid's the
  lots stand about it (within a half and a double), so the fill builds as
  many houses on an area as the grid would.
- **The grid gives way.** A grid lot within 85 m of a street standing in a
  year is gone in that year, so the grid holds only outside the network; the
  years a street comes or goes are breaks for the scatter, so a grid lot
  goes and a street's lot comes at the year itself and never fade across
  each other. The district's scatter and every island's (towns.js) both do
  this, from the same network; the grid's own streets are not drawn where
  the network covers the ground.
- **The streets drawn.** Each street a ribbon on the ground of the moment
  (ribbons.js), 9 m wide (an arterial 14 m), packed earth until 1910, a
  macadam grey to 1950, asphalt after, crossfading at the turns; it comes in
  over the year before its `from`. Drawn near in only (from about 16 km of
  camera distance in), on an island in its slot.
- A data set without `streets/manifest.json` has no streets, and its towns
  keep the grid everywhere.

### How to bake the streets

```bash
node packages/holo-i-ke-au/tools/bake-streets.mjs --all                   # download, bake, check, delete the downloads
node packages/holo-i-ke-au/tools/bake-streets.mjs --sheets /tmp/streets   # bake, drawing each town over each sheet: found green, not found red, not covered blue
```

or `--download` (about 400 MB: the centrelines over each town and each
sheet exported over its box at 2.5 m a pixel, in tiles), `--bake`,
`--check` (prints what each sheet found and runs `check-data.mjs`),
`--clean`; `--town ID` (repeatable) bakes only those towns and keeps the
others' entries. `--downloads DIR` (or `$HOLO_STREETS_DOWNLOADS`) moves the
downloads from `<os tmpdir>/holo-i-ke-au-bake/streets-downloads`; keep them
outside the repo. Node 22 and `curl`, as for the other bakes. The bake is
slow on Honolulu (each sheet is searched for its shift over the whole town,
a few minutes a sheet on a quiet machine); nothing in it is random, so a
re-bake from the same downloads gives the same files but for the `baked`
date.

**Where things live.** `tools/lib/streets-sources.mjs` holds the towns and
their boxes, the centreline layers (which segments are streets: named ones,
not the freeways and their ramps, which the works draw) and the sheets of
each island; `tools/lib/streets-bake.mjs` reads the sheets, registers them,
finds and dates the streets and writes; `tools/lib/streets-check.mjs` prints
what each sheet found.

**How a street is found on a sheet.** A pixel darker than 0.65 of the
sheet's paper (its 80th percentile of brightness over the export tile) is
ink: dark enough that the contours, printed brown, are not, for a
subdivision on a hillside follows them; Oʻahu's quadrangles of 1927, a grey
scan whose contours are a lighter grey than its streets, take 0.45, and
the quadrangles of 1910 to 1924 on the other islands, scanned light, 0.8 (a
sheet's `ink` in the manifest). Lahaina lies across the neat line of the
Mala and Launiupoko sheets of 1924, and Wailuku and Kahului across the
Wailuku and Pāʻia sheets', where the State's mosaic lays one sheet's margin
over the next: those are read sheet by sheet, each inside its own neat line
(a sheet's `quads`).
Each segment is cut into pieces of about 80 m, sampled every 2.5 m, 7 m
short of its ends (where a drawn street's lines break for the one across).
A piece is found where, at some offset within 15 m of it, at least 62% of
its samples are ink or within a pixel of ink (the street's casing, band or
line, whatever the sheet's symbol), and at some offset within 10 m, at
least 60% are paper (the street's own open ground): open paper fails the
first, a block of buildings, hachures or lettering one or the other. On the
Government Survey's island maps (1881 to 1903, at about 1:60,000, their
streets small among hachures, stippled reefs and lettering) the line must be
75% ink without the pixel's grace and the ground 65% paper, and where two or
more of them cover a street, a second must find it too.

**How a sheet is registered.** The State georeferenced each sheet whole;
over a town an old one stands off by up to a few hundred metres. Each sheet
is moved over the town by the shift that finds the most pieces (within 300
m for the Government Survey's island maps, 80 m for the quadrangles, by 20
m, then 5 m, then a pixel), then over each 1.2 km cell with at least 40
pieces by its own shift within 75 m (20 m) of that. A move costs a little,
with its square (at the edge of a search, as many pieces as 5% of those
searched), so a sheet stays where the State placed it unless the streets
say otherwise. The manifest keeps the shifts.

**The registered maps.** The Government Survey's maps of a town, as the
Office of Hawaiian Affairs' Kīpuka database serves them (a 1-bit scan at
400 dpi in a PDF), are fetched and rendered with pdftoppm at about a metre
a pixel (never under 100 dpi), and placed on the town's grid by an affine
transform. A map starts either from a few street corners read off it by
hand (`seed` in `tools/lib/streets-registered.mjs`: the map pixel, the
corner's name and today's lon and lat) or from a search over its turn (12°
either way) and scale (8% either way of its printed scale) whose shift comes
from a cross-correlation by FFT of its lines with today's centrelines at 16
m a pixel (its textures left out: a cell's ink less the mean about it,
nothing where that mean passes 8%). Either way it is then refined on a
distance map of today's centrelines at 4 m, by turns of shift and of turn and
scale, finer each round, scoring a sample of its ink by its nearness to a
street. The bake then warps it onto the town's grid (each grid pixel the
darkest of the map's pixels under it, so a fine line is kept), reads a patch
of it whose ink passes a share (`texture`; 22% unless the map says, none on
a map without hachures) as no sheet, and finds and dates the streets on it
as on any sheet, its shifts and cells included. The manifest keeps each
map's `placed` transform.

**How the directories date a street.** A directory gives a street's name in
a year, not its stretch: today's King Street runs to Kaimukī, the King
Street of 1869 did not. So a directory (`tools/lib/streets-directories.mjs`:
its year, the names it prints with today's for each, read off its pages)
dates a run of a street it lists only where a map drawn within `within`
years after it already shows that run: the run's date moves back to the
directory's, `by` the directory, with the map kept as `shownBy`. A stretch
first shown later keeps the later map's date. A name the directory prints
that today's layer lacks, or has under a name no source read resolves, is
listed as `lost`, a candidate for a street closed or renamed.

**How a street is dated.** A piece is dated by the oldest sheet that finds
it, provided at least half the later sheets that cover it find it too
(counting, after a larger sheet, only the larger later ones: an island map
at 1:60,000 that does not draw a street says little); a
segment by the year by which half its dated length is dated, where at least
30% of its length is dated at all (a piece under a label or a symbol is found
on no sheet, and says nothing either way); any other segment by the layer's
year.

**The sheets read** (the State GIS image services; each in `sources.json`):

| island | sheets |
| --- | --- |
| Oʻahu | Government Survey 1881 and 1899 (`Historic_Maps/Oahu_1881`, `Oahu_1899`), Donn's of 1902 (`islands_1900s`, raster 8); the USGS quadrangles of 1927 (`SoH_Maps/oahu_topo_1927`), the 1938 sheet (`Historic_Maps/Oahu_1938`), the 1943 sheet (`SoH_Maps/Oahu_1943`), the quadrangles of about 2000 (`USGS_topos_2000`); over Honolulu, the Survey's registered maps 867 (J. F. Brown, 1881, 1:6,000) and 1397 (F. S. Dodge, 1888, 1:1,200), each placed from four street corners, and Bennett's directory of 1869 |
| Maui | Donn's of 1903 (raster 5); the 1924 quadrangles; about 2000; over Lahaina, the Survey's registered map 1137 (S. E. Bishop, 1883, 1:6,000), placed by its search alone |
| Molokaʻi | Dodge's of 1897 (raster 6); the 1922 quadrangles; about 2000 |
| Hawaiʻi | Donn's of 1901 (raster 1); the quadrangle over the town (Waiākea 1912 for Hilo, Kalaoa 1924 for Kailua); about 2000 |
| Kauaʻi | Donn's of 1903 (raster 3); the 1910 and 1963 quadrangles; about 2000 |

**What it cannot do.** The island maps of 1881 to 1903 are at about
1:60,000 and draw a town's streets small and generalized; few of their
streets are found, and those are often the main roads, so a town no
registered map is read for is on its streets from the first quadrangle
(1910 to 1927) far more than before it, and before the earliest sheet it is
on the grid. Of the towns' registered maps, Honolulu's of 1881 and 1888 and
Lahaina's of 1883 are read; Monsarrat's Honolulu of 1897 (RM 1910) and
Baldwin's Hilo of 1891 (RM 1561) were opened but neither the search nor any
corners read so far place them (their lot lines, lettering and hachures
outweigh their streets in the search, and Hilo's streets bear names today's
layer has changed), so Hilo in the 1890s and Honolulu beyond the 1888 map's
downtown in the 1890s stand on the sheets of 1881 and of 1899 to 1912. Of the
directories, only Bennett's of 1869 was found with its text; Bowser's of
1880 and Husted's from 1890 were not, and are wanted. Between the 1940s and
about 2000 Oʻahu has no sheet read here, nor any island between its
quadrangle and about 2000 but Kauaʻi (1963), so a street built in those
years is dated by the next sheet. Streets closed or built over (Chinatown's
lanes, Kakaʻako's before the fill, what the freeways took) are not in
today's layer. The sheets that would close those gaps are in
`sources.json` as wanted: the Sanborn fire insurance maps of Honolulu
(1899, 1906, 1914, 1927), Hilo, Lahaina and Wailuku; the Government
Survey's registered maps of Honolulu; and the USGS 1:24,000 quadrangles of
Honolulu of 1953, 1959, 1969 and 1983.

## Towers, dated

The zoning says where a tower may stand (classes 3, 5 and 7: "Zoning, for
the settlements"), the density and the value which lots raise one; this
record says how many stand in a year. `public/data/towers.json`, written by
`tools/bake-towers.mjs`, gives for each area today's count of buildings of
ten storeys or 30 m and over and the share of them standing by each year,
and for each island the share alone, for its towers outside the areas. The
towers that the record names (the tallest, with their years and sites) are
the historic buildings' to place as landmarks; this record is the count.

```jsonc
{ "about": "...", "rule": "how the counts and shares were made, written out",
  "tower": { "storeys": 10, "metres": 30 },       // what is counted
  "first": 1955,                                   // the record's first year: no tower before it
  "areas": [ { "id": "waikiki", "name": "Waikīkī", "island": "oahu",
               "ring": [[-157.8445, 21.288], ...],        // [lon, lat], one ring, unclosed
               "count": 176,                              // today's towers in the ring
               "counted": { "by": "cch-building-footprints", "fetched": "2026-11-07", "footprints": 173, "laterFromCtbuh": 3 },
               "share": [[1955, 0], [1960, 0.028], [1970, 0.21], [1980, 0.717], ..., [2023, 1]],
               "shareFrom": "survey and dated",           // survey | survey and dated | island
               "units50": 9606, "dated": 43,              // what the share was read from
               "sources": ["cch-building-footprints", "acs-2023-b25127", ...] } ],
  "islands": { "oahu": { "share": [...], "units50": 20918, "tracts": 267, "sources": [...] } },
  "sources": [...], "wanted": [...],               // ids in sources.json; wanted ones not opened
  "baked": { "tool": "tools/bake-towers.mjs", "fetched": { ... } } }
```

- **A share** is `[year, share]` points, the years rising from `first`, the
  shares never falling, from 0 at `first` to 1 at the last point; between
  points it is linear, before the first 0, after the last 1. A year's
  towers in an area are `count × share(year)`, rounded down.
- **Areas** do not overlap (neighbours share edges); a point in no area
  takes its island's share, with no count. An island with neither has no
  record, and its towers stand as the zoning, the density and the value
  give them.

**What the app does with it** (features/settlements.js `rankTowers`,
`towerSeats`, `towerKind`, for the district's scatter and every island's
alike). In each area the `m` lots that carry a tower in the timeline's last
year, as the model has it, are ranked by how strongly they call for one:
the value with the density. In a sample year the first `n` of them carry a
tower, whatever the era's turn would have put there, `n` read from the
share of the sample before (every four years, so a tower stands within four
years of the record's year and never before it); any other lot the model
would raise a tower on takes the walk-up, or downtown the mid-rise, that
stood before the towers.

- Where the scatter holds the whole area (the district), `n` is the share ×
  the fewer of `m` and the count, rounded down: an area with fewer lots that
  could carry one than the record has towers keeps the record's timing at
  the lots' scale.
- An island's scatter works tile by tile and never holds a whole area, so
  the area's count is shared out over its tiles as seats, one at a time to
  the tile with the most ground in classes 3, 5 and 7 (every texel, where
  the island has no zoning) per seat it already holds; a tile's `n` is its
  seats among the year's first count × share, so a tile never loses a seat
  as the years go on, and the seats of a year sum to the year's count. A
  tile with fewer lots than seats leaves the rest empty.
- With no count (an island's own share), `n` is the share × `m`.

So a year never holds more towers in an area than the record gives it, and
the lots worth most rise first. Honolulu's areas lie inside the Nuʻuanu
district's inner box, Salt Lake and Pearlridge wholly outside it, so no
area is split between the two scatters.

**What each part rests on.** Today's count on Oʻahu is the City's building
footprints (HoLIS) of 30 m and over, the height the NGA lidar's of 2005
and 2009 or, in the urban core, the City's own later one; footprints whose
centres lie within 30 m of a taller one's are one building; to them are
added the towers CTBUH lists as completed from 2010 on that no footprint
stands within 40 m of. On the other islands it is OpenStreetMap's
buildings tagged ten levels or 30 m and over, over boxes round each town,
since the counties publish no heights. The share is the Census Bureau's
ACS 2019–2023 five-year B25127: occupied units in structures of 50 or more
by the year the structure was built, by tract (each tract in the area its
internal point falls in, by the 2023 Gazetteer), the bands split into
decades by the same tracts' B25034, linear within a decade. Where CTBUH
dates fifteen or more of an area's towers (downtown, Waikīkī, Kakaʻako),
the share is the mean of the survey's and the share of CTBUH's towers
completed by the year: the survey counts homes and sees neither offices
nor hotels, and the apartments of the boom came early; CTBUH lists the
tallest, which came late. An area with fewer than a hundred such units
(Kāʻanapali) takes its island's share; an island's is its county's tracts
outside the areas.

| area | today | 1960 | 1970 | 1978 | 1990 | 2000 | share from |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Downtown and Chinatown | 77 | 2 | 10 | 28 | 55 | 69 | survey and dated |
| Kakaʻako and Ala Moana | 68 | 1 | 5 | 9 | 13 | 21 | survey and dated |
| Waikīkī | 176 | 4 | 36 | 108 | 141 | 150 | survey and dated |
| Makiki, Punchbowl and Pāwaʻa | 123 | 6 | 39 | 79 | 106 | 117 | survey |
| McCully and Mōʻiliʻili | 43 | 2 | 15 | 29 | 39 | 41 | survey |
| Salt Lake | 23 | 0 | 3 | 10 | 18 | 20 | survey |
| ʻAiea and Pearlridge | 20 | 0 | 2 | 9 | 17 | 19 | survey |
| Hilo | 3 | 0 | 1 | 2 | 2 | 2 | survey |
| Kailua-Kona; Kahului and Wailuku; Kīhei and Wailea | 0 | | | | | | survey |
| Kāʻanapali | 9 | 0 | 1 | 3 | 5 | 7 | island |

What it cannot tell: the survey's units stand for towers, and a structure
of 50 units may be a walk-up of five storeys; the vacant (much of
Waikīkī's) are not in it; it counts what stands today, not what stood and
was pulled down. The footprints have no year built, and CTBUH lists only
the towers over about 40 m. OpenStreetMap's levels are tagged on one
building in ten or fewer in the neighbour islands' towns. The City's
permit records from 2005 (`honolulu-building-permits-2005`, `wanted`)
would check the later towers; SkyscraperPage and the 1980 and 1990
censuses would date the earlier ones (ACCESS.md).

### How to bake the towers

```bash
node packages/holo-i-ke-au/tools/bake-towers.mjs --all         # download, bake, check, delete the downloads (a few minutes)
```

or `--download` (about 210 MB, nearly all of it the two ACS tables:
the footprints of 30 m and over in pages of a thousand, CTBUH's Honolulu
page, B25127 and B25034, the tract Gazetteer, and OpenStreetMap's map calls
over each neighbour-island town, a call every 1.5 s), `--bake` (a few
seconds; prints each area's count by year), `--check` (runs
`tools/check-data.mjs`), `--clean`. `--downloads DIR` (or
`$HOLO_TOWERS_DOWNLOADS`) moves the downloads from
`<os tmpdir>/holo-i-ke-au-bake/towers-downloads`; keep them outside the
repo. Node 22 and `curl`, as for the other bakes. The areas are drawn by
hand in the bake's `AREAS`; it reads nothing of `public/data` and writes
only `towers.json`. A re-bake from the same downloads is byte-identical;
a fresh download moves the counts as the City, CTBUH and OpenStreetMap
edit theirs.

**What the check covers** (`tools/check-data.mjs`): the shape above; ids
unique and kebab-case; names Hawaiian-checked; each ring over the islands
and no two overlapping; `count` a whole number and `counted.by` an opened
source among the area's own; every share as the contract says, beginning
at `[first, 0]` and ending at 1; every source in `sources.json` and one of
each list opened; `wanted` not opened. It prints today's towers and the
record's 1978.

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

## Geology: the making of the islands

A prologue before the first chapter, on a time scale of its own: the islands
rising over the hotspot, carried north-west, worn down and sinking; the shapes
they had; the great landslides that took their flanks into the sea. Under
`public/data/geology/`, read only while the tour is in the prologue (and by the
far view's geology toggle), never at the island or district zoom.

```
geology/manifest.json             what is here, with sources, methods and the hotspot track
geology/seafloor/height.png       the sea floor and the islands over a wider box, split-byte like a pack
geology/stages/<stage>/height.png the reconstructed islands at a stage, on the seafloor pack's grid
geology/landslides.geojson        the debris fields and their blocks
geology/volcanoes.json            each volcano: ages, stage, summit, caldera, status
geology/chapters.json             the prologue's chapters and their steps (its events)
```

- **The seafloor pack**: like an island pack (DATA.md §2: split-byte RGB,
  `value = R·256 + G`, metres `= value·0.25 − 6000`), at most 2048 on the
  long side, over a box wide enough to hold every debris field named below
  (the Nuʻuanu field reaches about 230 km north-east of Oʻahu onto the
  Hawaiian Arch; the Kaʻena and Waiʻanae fields west; the ʻĀlika fields
  south-west of Hawaiʻi): about 17.5°–24.5° N, 162°–153° W. From the GMRT
  synthesis the pack bake already fetches (its 100 m multibeam where the
  Hawaiian surveys exist, else its gridded fill), with the islands' land from
  the 3DEP tiles, never shallower than −1 m at sea and the land ≥ 0.2 m.
  Registered in `manifest.json` as `seafloor: { bounds, size, metresPerTexel,
  height, stats, sources }`.
- **Stages**: a reconstructed height image per stage on the seafloor grid,
  each listed in the manifest with `id`, `age` (millions of years before
  present, `Ma`), `agePrecision` (± Ma), `method` (`modelled`), the `rule`
  written out, `confidence` (`firm | soft | sketch`), `sources`, and `stats`.
  The stages, from the record as the research reads it: the Kauaʻi and
  Niʻihau shields complete and alone; Waiʻanae grown beside them; the Koʻolau
  shield whole, its caldera at Kāneʻohe and its north-east flank still
  standing; after the Nuʻuanu avalanche, the flank gone and the pali new;
  Maui Nui, the four islands and Penguin Bank one island; Maui Nui parting as
  the sea rises and the land sinks; Hawaiʻi's shields rising; the present.
  The rule for a shield is a profile (slope by distance from the summit, as
  the living shields show) fitted to the volcano's summit and base in
  `volcanoes.json`, less the subsidence since (the islands sink; the rate per
  island in the manifest), cut by the shoreline of the stage; a scar is
  refilled to the profile before its slide and left after. Every stage is a
  model and says so; nothing in it is a survey.
- **The drift**: the manifest's `hotspot` gives the hotspot's position today
  (under Kīlauea and Kamaʻehuakanaloa), the plate's speed and azimuth (about
  9.5 cm a year toward about N 65° W, with its source), so the app can place a
  stage's islands where they stood over the hotspot: a stage at age `A` is
  drawn displaced south-east by `A × speed` along the azimuth, and the islands
  slide north-west as the age runs down.
- **`landslides.geojson`**: each field a Polygon (the debris spread on the
  sea floor) with `id`, `name`, `volcano`, `kind` (`avalanche` for a debris
  avalanche, `slump` for a slow slump), `age` and `agePrecision` (Ma), `runout`
  (km), `volume` (km³, in a telling if a user-facing card shows it), `scar`
  (a Polygon on the island where the flank was, where the record gives one),
  `blocks` (Points with `name` and `height` m for the great blocks, Tuscaloosa
  Seamount among them), `precision` (`mapped | traced | sketch`), `sources`,
  `note`. Nuʻuanu, Wailau, Kaʻena, Waiʻanae, Clark, Pololū, ʻĀlika 1 and 2,
  South Kona, Hilina, Kāʻohe, and whatever else the record maps.
- **`volcanoes.json`**: `id`, `name`, `island`, `summit` (lon, lat, height m
  today), `caldera` (a Polygon or a Point with radius, where known), `shield`
  (`from`, `to` in Ma: the main shield building), `postshield`, `rejuvenated`
  (ages, where known), `status` (`extinct | dormant | active | submarine`),
  `lastEruption` (year or Ma), `subsidence` (mm a year, where measured),
  `sources`, `note`. Niʻihau, Kauaʻi, Waiʻanae, Koʻolau, West Molokaʻi, East
  Molokaʻi, Lānaʻi, Kahoʻolawe, West Maui, Haleakalā, Kohala, Mauna Kea,
  Hualālai, Mauna Loa, Kīlauea, Kamaʻehuakanaloa (Lōʻihi), and Penguin Bank
  and the Kaʻula and Kaʻena stages if the record names them.
- **`chapters.json`**: the prologue's chapters, each with `id`, `label`
  ("when the islands were made", or as the research writes it), `age` and
  `ageSpan` in Ma, `note`, `sources`, and `steps`: its events, each with
  `id`, `title`, `gloss`, `summary`, `age`, `agePrecision`, `kind`
  (`birth | slide | join | part | subsidence | eruption | now`), `stage` (the
  stage it is drawn on), `places` (ids in `places.json`: a volcano's summit or
  caldera, a debris field, a seamount; new kinds `volcano`, `caldera`,
  `seamount`, `landslide`, at `island` or `sea` precision), `landslides`
  (ids to light), `tellings` with sources, and `stops` with `zoom: "far"` and
  a `camera`. Copy follows §4's rules: numbers only in tellings; the copy
  rule of DESIGN §7.4.
- **One order of age**: the chapters in the file's order, each chapter's
  `age` and then its steps and their stops, read as one walk, never go
  back in age (a later card at the same age or younger), and the stages
  the steps are drawn on never go back to an older one. A step belongs to
  the chapter whose stretch of the walk its age falls in, even where its
  subject is another chapter's island (Oʻahu's late vents, about 0.8 to
  0.04 Ma, stand among Hawaiʻi's rising); where a step's own span reaches
  across a neighbour's, its `age` is the dated moment it shows, with that
  date's own precision (Molokaʻi's two shields at East Molokaʻi's oldest
  age, 1.75 ± 0.14 Ma, after the Koʻolau pali's 1.8). A chapter's `ageSpan`
  is what it covers and may reach back before its first card.
- **Time**: the prologue's timeline runs in millions of years on a log
  scale from the oldest stage to now (and on into the future for
  Kamaʻehuakanaloa, if a step says so); `age` is the only clock. The main
  timeline (years) is not used in the prologue, and no event of the main
  chapters has an `age`.
- **Checks**: `check-data.mjs` holds the manifest's shape; every stage and
  field cites opened sources; ages positive and in order per chapter; places
  exist; the seafloor and stage images on their grid with the stated `stats`;
  the whole directory under 12 MB.

### Accepted extensions (geology)

What the app (data/geology.js, ui/tour.js, render/geology.js) reads beyond
the list above, and how it reads what the list leaves open:

- **The manifest's shape**: `seafloor` as above; `stages`, each with its
  `height` `{ file, scale, offset }` on the seafloor grid, and an optional
  `name` the card uses for the shape a step is drawn on (without one the card
  says "the islands modelled as they stood about … years ago"; the `rule` is
  its tooltip). A stage whose `height.file` is the seafloor's own (`present`)
  is drawn from the seafloor pack, with no second image read; with no stage
  `present` listed, one is implied at age 0.
- **A stage is the whole ground of the box** at its age (sea floor and
  islands), in today's coordinates; the app carries the whole image by the
  drift. Where a stage is only today's floor smoothed (within a few hundred
  metres of the seafloor pack) the app draws the seafloor pack's detail, so
  crossfades move only what the stages change.
- **The hotspot**: from the manifest, else from `volcanoes.json`'s `hotspot`
  (that file may be an object with `volcanoes` and `hotspot`); its point as
  `position: [lon, lat]` or `lon` and `lat`; `speed` in cm a year and
  `azimuth` the compass bearing the plate moves toward. The drift at age A
  is `A × speed × 10` km toward `azimuth + 180°`.
- **Chapters**: `short` (optional) names a chapter in the pill as an era's
  does; `ageSpan` is `[oldest, youngest]` and may overlap the next chapter's
  (the clock names the chapter with a step nearest the age). Steps keep their
  file order, which is the walk's (one order of age, above); a step's `sources` (else its chapter's) are its
  card's Sources, and its `confidence` its chips, with the stage's
  `confidence` as `shape`.
- **Far stops**: `camera` `{ target: [lon, lat] today, distance, bearing,
  pitch }`, each optional (without a target the stop's place; without the
  rest the far zoom and the chain view's turn); a stop's `age` sets the
  clock, and everything framed is carried by the drift to that age.
- **A slide's run**: a step of kind `slide` runs the mass along the first
  field it lights that the step before did not, from the field's `scar`
  (else its volcano) out through the far edge of its polygon. The stages
  crossfade during the run from the step before's stage to the step's own
  only when that field has a `scar` and the two stages differ; a step may
  name the stage to run from outright with `from`. Otherwise the run is laid
  on the step's own stage. Blocks are named on the floor by their `name`.

### How to bake the geology

How `geology/manifest.json`, the seafloor pack and the stage images are made.
`volcanoes.json`, `landslides.geojson` and `chapters.json` are the research's,
hand-written; the bake only reads them, and keeps any key of the manifest it
does not own. Like the other bakes, a by-hand step whose output is committed.

```bash
node packages/holo-i-ke-au/tools/bake-geology.mjs --all        # download, bake, check, delete the downloads
```

or step by step:

```bash
node packages/holo-i-ke-au/tools/bake-geology.mjs --download   # ~200 MB: 14 DEM tiles and one GMRT grid, a minute or two
node packages/holo-i-ke-au/tools/bake-geology.mjs --bake       # the seafloor pack, then the stages; about 3 minutes
node packages/holo-i-ke-au/tools/bake-geology.mjs --stages     # the stages alone, from the committed seafloor pack (no downloads); about 80 s
node packages/holo-i-ke-au/tools/bake-geology.mjs --check      # read geology/ back
node packages/holo-i-ke-au/tools/bake-geology.mjs --preview /tmp/holo-geology   # each stage as shaded relief beside today's
node packages/holo-i-ke-au/tools/bake-geology.mjs --clean      # delete the downloads
```

`--downloads DIR` (or `$HOLO_GEOLOGY_DOWNLOADS`) moves the downloads from
`<os tmpdir>/holo-i-ke-au-bake/geology-downloads`; keep it outside the repo.
The ledger (`fetched.json` there) records each file's URL, date, size and
SHA-256, as the pack bake's does. `--subsidence rule` draws the stages with
the research's stated subsidence rule instead of the fitted curve (below). A
re-bake from the same downloads gives the same bytes.

**The seafloor pack.** 2048 × 1690 texels of 458.2 m over 162°–153° W and
17.498°–24.502° N (the contract's box, its short side rounded up to whole
texels). The land and sea rules are the island packs' (§2, "What the app can
rely on"): the 3DEP 1 arc-second tiles (all 14 the USGS publishes in the box;
every other one-degree cell is asked for and answers 404, Nihoa's n24w162
among them, so Nihoa is sea here) decide land at half a texel's area and give
its mean; the sea is GMRT's synthesis (version 4.5.0, one request over the box
at `mresolution` 458, which GMRT serves from its 244.6 m level: multibeam
where the surveys exist, GEBCO under it), area-weighted, never shallower than
−1 m, cells deeper than 6,000 m treated as gaps. The GMRT entry in `sources`
carries the citation its CC BY 4.0 terms ask for (Ryan et al. 2009, with the
version). Land 16,633 km², −5,908.5 m to 4,136 m (Mauna Kea's summit texel).

**The stages.** Their ids, ages, precisions and confidence are
`volcanoes.json`'s `stagesProposed`; each stage keeps the research's text as
`proposed` beside the bake's own `rule`, which names every standing volcano's
state and height and every slide's. Each stage is modelled on the seafloor
grid from the seafloor pack alone:

- *The base*: the sea floor with the volcanoes taken off. Today's floor where
  it is deeper than −4,000 m and more than 12 km from anything shallower (a
  quarter-percentile over 3.7 km cells), carried under the ridge by a harmonic
  fill. Where a volcano is not yet born, or a debris field not yet laid, the
  stage is the base.
- *Ownership*: each texel standing 100 m above the base belongs to the volcano
  whose summit (`volcanoes.json`) is nearest, the distance divided by the
  volcano's relief, within 130 km.
- *The profile*, fitted to the living shields on the seafloor pack (`profile`
  in the manifest: Mauna Loa's south-west and west flanks, 200°–280°, and
  Kīlauea's south flank, 145°–215°, the median height per kilometre of
  distance): 5.9° above sea level through the summit, then a slope per 500 m
  of depth, 8.3° near the shore easing to about 5° at 2,500 m, 2.6° at
  4,000 m and 1.2° at the toe (the bands are made never to steepen with
  depth). Each volcano gets it at its own summit, stretched by direction so
  that it crosses −2,000 m (lifted by the subsidence since) where the
  volcano's own flank crosses −2,000 m today, outside its scars, held within
  0.6–1.6 times its median reach and smoothed over ±16°: the rift zones keep
  their reach and the islands their outline.
- *Subsidence* (`subsidence`): a volcano sinks at r0 while its shield builds
  and at r0·exp(−τ/τ0) after, τ the time since its shield ended, fitted to the
  rates `volcanoes.json` measures (Hawaiʻi's 2.6 mm a year, Lānaʻi's 0.15):
  r0 2.6 mm a year, τ0 0.53 Ma, about 1.4 km in all after a shield ends;
  Oʻahu's uplift (0.022 mm a year over 0.4 Ma) is taken off. At a stage the
  ground stands higher than today by what it has sunk since, a field that
  blends the standing volcanoes over about 30 km and tapers to nothing over
  the 2.5 km above the base. The research's stated rule (2.6 mm a year for
  1 Ma after a shield, then 0.01) lifts every young shield 2.6 km and in this
  model joins Oʻahu to Penguin Bank and Molokaʻi from 2 Ma and Maui Nui to
  Oʻahu at 1.2 Ma; the manifest says so (`ruleNotUsed`) and uses the fit.
- *A complete shield*, or one within 15% of its full height (the cube root of
  the share of its shield time built): below −2,600 m today the sea floor as
  it is now, lifted; above −2,000 m the profile at its summit (its height
  today plus the lift, or less the height still to grow), blended toward
  today's lifted surface as its erosion runs, by (A / shield end)²; a blend
  between. Toward ground that is not there yet the surface eases into the
  profile over 8 km, so no cliff stands where a younger neighbour will grow.
- *A shield still building*: the profile alone, its height above the base the
  cube root of the share of its shield time built.
- *Slides* (`landslides.geojson`): before its age a slide's scar (where the
  file gives one) is refilled to the profile and its debris below −3,000 m is
  the base; after, both are today's. The scars are the file's polygons, not
  the pali: the Nuʻuanu head lies about 15 km offshore.
- *The shoreline*: today's sea level, 0 m on the modelled surface.
- *Smoothing and steps*: what the model knows is coarser than a texel, so a
  stage is smoothed over about 0.7 km on the islands and their flanks above
  −2,500 m and about 5 km on the deep floor (where it is today's floor and the
  model sets nothing), and rounded to 4 m (8 m below −2,500 m), in the pack
  encoding (0.25 m, −6,000 m). That is what keeps the images under the 12 MB
  budget. `present` is the seafloor pack itself (`height.file` is
  `seafloor/height.png`, `method` `survey`).

Each stage's `stats` are read off the encoded image: `landKm2`,
`landFraction`, `minMetres`, `maxMetres`, and `islands` (each connected piece
of land over 5 km², the volcanoes whose summits stand on it, its area and its
highest texel).

**The drift** (`hotspot`): `volcanoes.json`'s hotspot as it gives it (the
midpoint of Kīlauea's and Kamaʻehuakanaloa's summits, 10 cm a year, azimuth
305°, which the research derived from the chain's bearings rather than read
from a source), with `displacement` written out: a stage at age A moves
A × 100 km toward bearing 125°, `x += 81,915·A` and `z += 57,358·A` metres in
the shared projection (z grows south). The whole image moves as one.

**What the check covers.** The manifest's shape and the GMRT attribution;
every image read back: on the seafloor grid, RGB with B = 0, nothing between
−1 m and 0.2 m, no land on the box's edge, `stats` as the image has them; the
seafloor's deepest point and five summits at their heights; ages falling in
order, `method`, `rule`, `confidence`, `sources`; the hotspot inside the box
with its speed, azimuth and formula; the directory under 12 MB. Then notes,
not failures, where a stage does not show what it is named for.

**What each stage rests on, and where it falls short of its rule.**

| stage | Ma | rests on | short of the rule |
| --- | --- | --- | --- |
| `kauai-alone` | 4.2 | Niʻihau's shield ended (4.3 Ma); Kauaʻi 95% grown (its shield to 4.0), its profile at 2,484 m; Waiʻanae not begun | Kaʻula (4.2–3.8) begins at 4.2 exactly, so is not drawn |
| `waianae` | 3.0 | Waiʻanae's shield just ended (3.06), 2,352 m; the Kaʻena and Waiʻanae slides fallen; Kauaʻi and Niʻihau sunk by the curve | Koʻolau begins at 3.0 exactly, so is not drawn even barely at the sea |
| `koolau-whole` | 2.0 | Koʻolau 94% grown (its shield ends at 1.8 in `volcanoes.json`), the Nuʻuanu scar refilled; Penguin Bank complete, West Molokaʻi 87% grown | Penguin Bank, lifted 1.35 km, joins Oʻahu across the Kaiwi channel; the profile is centred on the summit the file gives (Konahuanui), not the Kailua caldera |
| `koolau-after-nuuanu` | 1.8 | Koʻolau complete, the Nuʻuanu scar open and its field on the floor | Oʻahu, Penguin Bank and West Molokaʻi one island |
| `maui-nui` | 1.2 | West and East Molokaʻi, Lānaʻi, West Maui and Kahoʻolawe complete, Haleakalā growing: Maui Nui 8,875 km², 2,644 m | Penguin Bank a separate 336 km² island; the whole smaller than Hawaiʻi is now |
| `maui-nui-parting` | 0.6 | the same sinking, at today's sea level | still one island at 0.6 (in the model Molokaʻi parts between 0.6 and 0.3) |
| `hawaii-rising` | 0.3 | Kohala, Mauna Kea and Hualālai near their full heights, in today's shapes lowered; Mauna Loa 83% grown, the profile alone; Kīlauea not begun; Māhukona sunk | — |
| `present` | 0 | the seafloor pack | — |

## Vessels and crowds, in a district

For a scene on the water with people on the shore (the departure of
Hōkūleʻa, 1976; a fleet's landing), two more feature kinds in a district's
`features.json`, under the "District packs" contract:

- **`vessel`**: a LineString track in lon/lat with `id`, `name`, `design`
  (`waa-kaulua`, a double-hulled voyaging canoe; `waa`, a single-hulled
  outrigger; `motor`, a motor vessel; `ship`), `length` (m), `beam` (m,
  optional), `sails` (count, for a canoe), `masts`, `behaviour` (`moored |
  paddle | tow | sail | anchor`, one per segment allowed as a list), `when`
  (an ISO date or datetime for the start of the track; `until` for its end),
  `stop` (as forces: the stop index or indexes at which it shows), `escort`
  (the id of the vessel it escorts or tows), `crew` and `aboard` only in a
  telling, `precision`, `sources`, `note`. The app builds the design
  procedurally (the kit's waʻa for `waa`; for `waa-kaulua` two hulls with
  ʻiako and a deck, two masts with crab-claw sails that are furled while
  `tow` or `paddle` and set while `sail`, a hale on the deck), moves it along
  the track between its `when` and `until` at the stop that names it,
  heading along the track, and draws its wake.
- **`crowd`**: a Polygon on the shore with `id`, `name`, `count` or
  `density` (people per m², the count in a telling), `behaviour` (`gather |
  wave | chant | procession | watch`), `dress` (`1970s | kingdom | precontact`,
  what the sprites wear), `facing` (`sea` or a bearing), `when`, `until`,
  `stop`, `precision`, `sources`, `note`. The app draws the crowd as the same
  billboarded pixel-art figures as the forces, in the dress named, facing the
  sea, with the behaviour as a quiet animation (waving arms, a conch raised,
  a procession walking its polygon's long axis), and never a figure in the
  water or on a building.
- A scene's stops carry `camera` as before; `text` names what the sources
  describe and nothing the app does not draw.
- **From the first scene (Honolua, 1976).** A vessel's or a crowd's `when`
  and `until` may be datetimes with a zone (`1976-05-01T15:00-10:00`, Hawaiʻi
  standard time); a date alone is the whole day. A vessel that does
  different things at different stops is one feature per stop (the canoe at
  anchor, under sail across the bay, rounding the point, standing out), each
  with its own track, times and `stop`, rather than one long track; a crowd
  likewise, when its behaviour changes. `behaviour` as a list has exactly one
  entry per segment of the track. `escort` names the id of another vessel in
  the same district. A crowd with no number in the record carries `density`
  and a telling of what the sources say of its size; `count` is for a crowd
  some source numbers. `masts` and `sails` on a `motor` vessel are its rig
  (Meotai, a ketch with an engine: two masts, no sail set). `check-data.mjs`
  holds all of this, and holds a track to the water (every vertex and every
  segment's middle on the district's sea) and a crowd to the land (at most a
  tenth of its texels sea); `crew`, `aboard` and `people` as fields fail, for
  who was aboard goes in a telling.
- **Accepted extensions** (from the first build: `src/features/vessels.js`,
  `crowd.js`, `people.js`; `check-data.mjs` holds them):
  - Every `vessel` and `crowd` names its `event` and shows at the stops its
    `stop` names (an index or a list; the app also reads a stop's place, as
    for the forces, but the checker holds the data to indexes). Off the tour a scene does not show: it is a
    moment, not a year. `from` and `to` stay years (or null), as on every
    feature; `when` and `until` are ISO dates or datetimes with their offset
    (`1976-05-01T10:00:00-10:00`).
  - A vessel's `times`: one ISO datetime for each position of its track, the
    first its `when` and the last its `until`. Without them the moments are
    shared out between `when` and `until` over the segments by their lengths
    at each behaviour's pace (paddle 1.6, tow 2.4, sail and under way 3.0
    m/s), a `moored` or `anchor` segment taking what is left over (with
    none, the pace stretched to reach `until`).
  - A `moored` or `anchor` segment holds the vessel at its start (the checker
    fails one longer than 50 m); the vessel heads the way its next moving
    segment goes. One more behaviour, `under-way`, for a vessel moving under
    power without towing (an escort alongside). The tow line is drawn from
    the stern of the vessel whose `escort` names another to that one's bow,
    while both are on a `tow` segment.
  - A vessel's `colours`: `{ hull, sail, deck, trim }` as `#rrggbb`, with the
    `note` saying what in the record they rest on; without them, dark hulls
    and a plain cream sail. A vessel's `dress` dresses its crew as a crowd's
    (default `1970s`).
  - A stop's `when`: the moment (an ISO datetime in the stop's `year`) its
    vessels and crowds stand at. A stop without one takes it from the
    principal vessel of the stop (the waʻa kaulua the others escort, else
    the first that escorts nothing). A principal that is a feature of its own
    for the stop (one feature per stop, as at Honolua) is taken at its
    `when` if it only holds; one that moves is taken under way, from its
    first moving segment on, a sixth of the loop before it passes nearest
    the stop's camera `target` (else its place); one track shown at several stops is taken, at its k-th stop, at
    the start of its k-th run of segments of one behaviour (its first stop
    its first run, `moored`; its second the next, `tow`; and so on). From
    that moment the scene runs at twice life for 45 seconds, or to the
    next stop's moment, and begins again.
  - A crowd's `behaviour` may be a list (equal shares) or shares
    (`{ "gather": 0.6, "wave": 0.4 }`); `facing` is `sea` (each figure toward
    the nearest water) or a compass bearing; a crowd may be a MultiPolygon;
    `count` is drawn up to 8,000.
  - The people of a scene stand at the scene's own scale, the vessels'
    (a person of 1.7 m beside an 18.9 m hull), not at the battles' readable
    floor: each figure is as tall on the screen as its distance makes it, a
    small or a tiny figure where that is less than a whole sprite, and gone
    under about three pixels. Drawn larger than life on ground of its true
    size, one figure stands for as many people as it is times taller than
    life.
  - A near stop's camera may stand as close as 1 world unit (100 m); the
    rig's floor follows it while the tour is on that stop (`ui/tour.js`
    `closeFloor`).
