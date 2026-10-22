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

- `name`: the division's name with diacritics as the layer gives it
- `island`: the island name
- `moku`: for an ahupuaʻa, its moku name
- `gisId`: the layer's own object id, for traceability

The app draws these as lines and uses the moku polygons to colour the polity
overlay. **Moku names are the join key** between the boundary file and
`polities.json`, so keep them exactly as the layer spells them, and keep the
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
  "stops": [ { "text": "...", "place": "puiwa", "zoom": "near", "year": 1795 } ],   // camera details are added by the app later
  "sources": [ { "id": "kamakau-ruling-chiefs", "where": "ch. 12" } ],
  "confidence": { "date": "firm", "place": "firm", "numbers": "soft" },
  "view": "land",                   // optional: the far view the tour shows for this event (land | chiefdoms); by default the tour picks by kind
  "tellings": [ { "source": "fornander-v2", "says": "..." } ] }
```

`sources.json`:

```jsonc
{ "id": "kamakau-ruling-chiefs", "title": "Ruling Chiefs of Hawaiʻi", "author": "Samuel Mānaiakalani Kamakau",
  "year": 1961, "url": "https://...", "access": "open | print | paywalled", "opened": true,
  "note": "revised edition 1992; Hawaiian originals in Ka Nupepa Kuokoa 1866–71" }
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
- a source with `"opened": false` is marked `verify` in the card

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
properties and valid, non-crossing rings. It lists every file under
`public/data/` and fails over 40 MB.

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
layer: 8 islands, 88 masks, about 4.9 MB with the manifest.

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
| `contact` | 1778 | cultivation, settlement, forest | voyaging (with the growth note), mailikukahi, umi, alapai, kalaniopuu |
| `mahele` | 1853 | cultivation, settlement | none exactly; kahekili to kauikeaouli and kamehameha-iv-v to liliuokalani interpolate through it |
| `kingdom` | 1896 | cultivation, settlement, forest | none exactly; liliuokalani sits at t = 0.98 toward it |
| `now` | 2020 | cultivation, settlement, forest | coda |

`mahele` has no forest: nothing maps the forest of the 1850s, so forest
interpolates from `contact` to `kingdom` across it. The `eras` object in the
manifest gives, for every era in `eras.json` and every layer, either
`{ keyframe }` or `{ from, to, t }` with `t` linear in years. It is computed
from `eras.json` at bake time, so re-bake (or recompute from the keyframe
years) if the eras move.

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
Nuʻuanu to the pali, with Kalihi and Mānoa at the edges.

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

### How to bake a district

`tools/bake-district.mjs` writes `public/data/districts/manifest.json` and, per
district, `height.png`, `rain.png`, the patches and their supporting files. It
never writes `features.json`, which is hand-written.

```bash
node packages/holo-i-ke-au/tools/bake-district.mjs --all                    # download (~1.5 GB), bake, check, delete the downloads (~6 min)
node packages/holo-i-ke-au/tools/bake-district.mjs --preview /tmp/district  # relief, lines, streams, breaches, patches, the 1881 shore
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

Beyond the contract the manifest carries `parent`, `files` (supporting files),
`breaches`, `streams` (the check's findings), `stats`, and a `source` and
`note` on each patch.

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
  "nuuanu"` and a `file` relative to `public/data/`, not in the district
  manifest: its check holds the patches listed there to the first district's
  rules (a single kind, 0 or 255, over today's land, each inside the last).
  The district's own `contact` and `kingdom` patches stay as they were (with
  `kind: "lower"` and `depth: -1` now written out) and overlap the dated
  lowers there; both lower to −1 m, so applying both is the same as applying
  either.
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
(1911) and the cuts beside the Reef Runway (1977); lower the Honolulu
waterfront (1900, the district's kingdom patch), the airport's fill on Keʻehi
lagoon (1944), the Reef Runway (1977), Ford Island's edges (1940) and Kuahua
(1943).

Not done: inside Pearl Harbor the lochs and their wartime mooring dredging
are left as today's (natural deep water in 1881 within a few metres), as are
the Navy Yard's piers and the airport's ground west of Keʻehi lagoon, which
the 1881 sheet shows as land and ponds. Kāneʻohe Bay's seaplane runways
(1939–42) were cleared through patch reefs in a naturally deep lagoon, and
telling them from the lagoon floor needs a chart from before 1939; Haleʻiwa,
Waiʻanae, Barbers Point (cut into the land in the 1980s), Ko Olina and
Hawaiʻi Kai's Kuapā pond are not patched either. The ENC's dredged areas
outside every zone are listed by the bake.

The check (`--check`) reads every mask back on its pack: a greyscale image of
the stated size; raise weights only over today's sea and only where today is
deeper than `depth`, lower weights only over today's land and only where it
stands above `depth`; no raise texel touching a passage; weights of one kind
on one pack never over one; every patch with a note and sourced date, every
source with its URL, date and licence; and `public/data/patches/` under 1 MB.
It prints, per raise patch, the median depth of its ground today and in 1795.
