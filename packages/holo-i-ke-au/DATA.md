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
