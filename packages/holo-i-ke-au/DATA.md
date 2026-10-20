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
{ "id": "nuuanu-1795", "title": "Kaleleakaʻanae", "gloss": "the battle of Nuʻuanu",
  "when": { "from": "1795-04", "to": "1795-05", "precision": "month" },   // precision: day | month | year | decade | generation | century
  "era": "kamehameha",              // the era keyframe it belongs to
  "where": [ { "place": "waikiki", "role": "landing" }, { "place": "nuuanu", "role": "battle" } ],
  "zoom": ["far", "island", "near"],
  "kind": "battle",                 // arrival | battle | founding | construction | eruption | epidemic | law | treaty | voyage | death | protest | restoration | other
  "summary": "one paragraph",
  "stops": [ { "text": "...", "place": "puiwa", "zoom": "near", "year": 1795 } ],   // camera details are added by the app later
  "sources": [ { "id": "kamakau-ruling-chiefs", "where": "ch. 12" } ],
  "confidence": { "date": "firm", "place": "firm", "numbers": "soft" },
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
