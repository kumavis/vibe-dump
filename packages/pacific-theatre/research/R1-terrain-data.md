# R1: the terrain and bathymetry data pipeline

Researcher R1, 2026-10-22. Topic: how an offline bake (Node 22 plus curl, no
native dependencies) gets the relief for the table and for each battle box, the
coastlines and labels, the projection, and the PNG budget. I proved every
source below by fetching a small real sample from this container through the
proxy. Bytes, times and values are what came back. Anything I did not open is
marked *verify*.

Scripts are in two places, both outside the repository:

- The proof of concept, one file:
  `/tmp/claude-0/-home-user-vibe-dump/2e5146ca-4f91-535f-8583-82396d698b48/scratchpad/research/downloads/R1/poc-script/poc-box.mjs`
  (its own `package.json` with `geotiff@2.1.3`; output in `downloads/R1/poc-out/`).
- The research helpers:
  `/tmp/claude-0/-home-user-vibe-dump/2e5146ca-4f91-535f-8583-82396d698b48/scratchpad/research/r1-scripts/`.
  `dods.mjs` (DAP2 reader), `nc3.mjs` (netCDF-3 reader), `curlclient.mjs` (geotiff range client
  through curl), `cogwindow.mjs`, `cogov.mjs`, `tifland.mjs`, `terrarium.mjs`, `boxtiles.mjs`,
  `nestat.mjs`, `nepip.mjs`, `nenear.mjs`, `nesize.mjs`, `proj.mjs`, `proj2.mjs`, `png16.mjs`,
  `tablebudget.mjs`, `preview.mjs`.

## 0. Summary

| need | recommended source | access that worked | reader in Node | fallback |
| --- | --- | --- | --- | --- |
| table relief | ETOPO 2022 60″ surface | NGDC THREDDS OPeNDAP `.dods`, index subsets with stride | 30-line DAP2 parser, no dependencies | THREDDS WCS `GeoTIFF_Float` (geotiff package); ERDDAP ETOPO1 |
| box land | Copernicus GLO-30 (COG on S3) | HTTP range reads through curl | geotiff package with a custom curl client | none needed in the tested boxes |
| box sea | GMRT GridServer (multibeam with GEBCO fill), as in Holo i ke Au | ESRI ASCII, `resolution=high` (61 m) | text parser (the Hawaiian bake already has one) | ETOPO 2022 15″ tiles over OPeNDAP |
| coastlines | Natural Earth 10 m land, coastline, minor islands, reefs | naciscdn.org zips | `shapefile` package (pure JS) | GeoJSON on raw.githubusercontent.com (nvkelso) |
| sea names | Natural Earth geography_marine_polys | as above | as above | gazetteer by hand |
| table projection | azimuthal equidistant, centred on the theatre's middle | — | 10 lines of maths | Lambert azimuthal equal-area |

The proof of concept bakes the Ironbottom Sound box (99 × 89 km, Savo to Nggela)
into a 1024 × 916 height PNG in the Hawaiian format in **14 s** wall time,
reading 16.5 MB of GLO-30 by 10 range requests and 0.18 MB of ETOPO 2022 15″.

## 1. The whole table's relief

### 1.1 ETOPO 2022 on the NGDC THREDDS server

The catalog (`https://www.ngdc.noaa.gov/thredds/catalog/global/ETOPO2022/catalog.xml`,
200, 3,176 B, 0.48 s) offers three resolutions. Its services are OPeNDAP, HTTP
file server, WCS, WMS, NcML, UDDC and ISO. The catalog does not list NCSS, but
`/thredds/ncss/grid/...` answers.

| dataset | file(s) | size | grid |
| --- | --- | --- | --- |
| 60″ surface | `60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc` | 478.2 MB | 10800 × 21600, Float32 |
| 30″ surface | `30s/30s_surface_elev_netcdf/ETOPO_2022_v1_30s_N90W180_surface.nc` | 1.642 GB | 21600 × 43200, Float32 |
| 15″ surface | `15s/15s_surface_elev_netcdf/ETOPO_2022_v1_15s_<NW corner>_surface.nc`, 288 tiles | — | 3600 × 3600 per 15° tile |

What the DAS says (60″, read in full): `z` is Float32 metres, `_FillValue
-99999`, vertical datum EGM2008. `GDAL_AREA_OR_POINT "Area"` and `node_offset 1`
mean the grid is **cell-registered**. `GeoTransform -180 0.01667 0 90 0
-0.01667`. The netCDF `lat` axis **ascends from the south** (`lat[0] =
-89.99167`), so in OPeNDAP index space row `i` is centred on `lat = -90 + (i +
0.5)/60` and column `j` on `lon = -180 + (j + 0.5)/60`. The 15″ tiles are named
by their **north-west corner**: `N00E150` holds 15°S–0°, 150–165°E (I checked
its first and last `lat`/`lon`: −14.9979…−0.0021, 150.0021…164.9979). Inside a
tile, `lat` also ascends.

Samples (all HTTP 200 through the proxy):

| request | bytes | time | result |
| --- | --- | --- | --- |
| 60″ `.dds` | 327 | 0.27 s | dimensions as above |
| 60″ Midway `z[7080:1:7109][144:1:167]` `.ascii` | 9,866 | 0.43 s | text table |
| same, `.dods` (binary) | 3,582 | 0.55 s | 30 × 24; min −4372.4, **max 5.1 m at 28.2083 N 177.3750 W**, mean −2184.7, 2 cells above 0 |
| 60″ theatre east, stride 30, `z[3015:30:8699][16215:30:21599]` | 140,034 | 1.14 s | 190 × 180; min −9828.7, max 5724.7 (28.26 N 90.26 E), land 28.36 % |
| 60″ theatre west of 180, stride 30, `z[3015:30:8699][15:30:1499]` | 40,192 | 0.81 s | 190 × 50; min −10701.9, max 2248.6, land 0.17 % |
| 60″ theatre east, stride 6 | 3,435,074 | 1.81 s (**1.9 MB/s**) | 950 × 900; min −10550.8, max 6990.9 (28.06 N 90.46 E), land 28.37 % |
| 60″ theatre west, stride 6 | 959,874 | 1.01 s | 950 × 250; min −10701.9, max 3629.3 (19.46 N 155.54 W, the slope of Mauna Loa) |
| 30″ Guadalcanal `z[9600:1:9743][40728:1:40871]` | 85,522 | 0.45 s | 144 × 144; min −4989.4, max 2214.1 (9.704 S 160.063 E), land 30.74 % |
| 15″ Guadalcanal, tile `N00E150`, `z[1200:1:1487][2256:1:2543]` | 336,658 | 0.41 s | 288 × 288; min −5013.2, max 2256.1 (9.702 S 160.060 E), land 30.95 % |
| WCS 1.0 `GetCoverage&format=GeoTIFF_Float&bbox=-177.6,28,-177.2,28.5` | 3,805 | 0.31 s | 25 × 31 Float32 big-endian TIFF; same maximum, same cell |
| WCS, 15° × 15° box (150–165 E, 15 S–0) | 3,254,869 | 1.04 s | 901 × 901 |
| WCS with `resx/resy` or `width/height` (asking it to subsample) | 200 B | 0.3–0.5 s | **HTTP 400, "Unknown problem"** |
| NCSS grid, Midway, `accept=netcdf` | 5,288 | 0.63 s | netCDF-3 |
| NCSS grid, `accept=netcdf4` or `geotiff` | 53 | 0.25 s | 400, "Format geotiff is not supported for Grid data request" |
| NCSS grid, theatre bbox, stride 30 | 6,802 | 0.2–0.3 s | **HTTP 500**, Java `AssertionError: -39.89999999999999 should be <= -39.9` |
| WMS GetCapabilities | 16,477 | — | 200 (pictures only) |
| HTTP fileServer, 100-byte range | 100 | — | 206 (the whole 478 MB file can be ranged, but netCDF-4/HDF5 needs a reader we do not have) |

What I learned:

- **OPeNDAP `.dods` is the robust path.** Subsets are given in index space
  (`[start:stride:stop]`), so they are exact and never trip over
  floating-point bounds. The binary is DAP2: the DDS text, then `\nData:\n`,
  then XDR big-endian (`[n][n]`, n values, then each map as `[n][n]` Float64).
  `r1-scripts/dods.mjs` reads it in about 30 lines with no dependencies. It
  reads Float32 from THREDDS and Int16 from ERDDAP. (DAP2 sends an Int16 as a
  4-byte integer.) Remember `curl -g`, or curl treats the brackets as a glob.
- **WCS works but only at native resolution.** The GeoTIFF reads with the
  `geotiff` package that Holo i ke Au already depends on. But it cannot
  subsample, it adds one extra row and column, and it writes a **bogus
  `GDAL_NODATA` tag** (−4448.96 on the Midway sample, a value that is not
  missing data). A bake must ignore that tag. I did not test how large a request WCS
  allows (*verify* before relying on it for a 100 MB pull).
- **NCSS is unusable** for this: netCDF-3 only, and a server assertion error
  on theatre-sized boxes.
- **The antimeridian means two requests.** The grid runs from −180 to 180.
  `r1-scripts/tablebudget.mjs` fetches the east piece (90–180 E) and the west
  piece (180–155 W), adds 360 to the west piece's longitudes, and stitches them
  into one continuous 1150 × 950 grid (90.06…204.96).

### 1.2 ETOPO1 through ERDDAP (`etopo180`, `etopo360`)

`https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.das` and
`etopo360.das` both answered 200. The grid is `altitude`, **Int16**,
`_FillValue 32767`, 10801 × 21601. That makes it **grid-registered**: nodes
fall on whole minutes and both poles are included. `etopo360` runs 0–360, so
**one request crosses the antimeridian.**

| request | bytes | time | result |
| --- | --- | --- | --- |
| `etopo180.geotif?altitude[(28.0):1:(28.5)][(-177.6):1:(-177.2)]` | 1,423 | 0.51 s | **8-bit greyscale picture** (values 1–255). ERDDAP's docs call `.geotif` "a grayscale GeoTIFF". **Not heights.** |
| `etopo180.json`, same box | 38,422 | 0.57 s | rows `[lat, lon, altitude]` |
| `etopo180.esriAscii`, same box | 4,445 | 0.65 s | ESRI ASCII, north row first |
| `etopo360.nc?altitude[(-40):30:(55)][(90):30:(205)]` | 95,984 | 1.34 s | netCDF-3, 191 × 231 Int16; min −9971, max 5530, land 22.21 % |
| `etopo360.dods`, same | 180,094 | 0.65 s | DAP2; Int16 sent as 4 bytes, so twice the `.nc` size |
| `etopo360.nc`, theatre, stride 6 | 2,210,380 | 1.55 s (**1.4 MB/s**) | 951 × 1151; min −10714, max 6422, land 22.22 % |
| `etopo360.dods`, Midway at full resolution | 3,778 | 0.43 s | 31 × 25; **max 28 m at 28.30 N 177.37 W, land 2.45 %**: an atoll smeared into a blob |
| `etopo360.dods`, Guadalcanal | 22,714 | 0.51 s | 73 × 73; max 2082, land 30.55 % |

`r1-scripts/nc3.mjs` reads ERDDAP's netCDF-3 in about 40 lines. NCEI's
product page lists ETOPO1 (2009) under "Older Versions" of ETOPO 2022. Cite
ETOPO1 as doi:10.7289/V5C8276M; cite ETOPO 2022 as doi:10.25921/fd45-gt74
(both read on `https://www.ncei.noaa.gov/products/etopo-global-relief-model`).

### 1.3 GEBCO (2026 is the current grid, not 2024)

`download.gebco.net` is a JavaScript app. Its own bundles call a small JSON
API. I read `/api/grids` and `/api/formats` (both 200). The latest grid is
`gebco_2026_global`, "published April 2026", 15″, with `maximum_area: 14400`
(units not stated; probably square degrees, *verify*) and `x_max: 360`.
Formats: `netcdf`, `geotiff`, `ascii`, and pictures.

Scripted subset, proved end to end:

```
POST https://download.gebco.net/api/queue          (201) {"basketId":"GEBCO_22_Oct_2026_582ca4694353"}
  body {"id":"0","email":null,"submission_date":"…","processing_status":"new",
        "items":[{"id":0,"grid_id":1,"data_source_ids":[1],"formats":[2],
                  "left":-177.6,"right":-177.2,"top":28.5,"bottom":28.0}]}
GET  /api/queue/status/<basketId>                  (200) {"status":"finished"}  (first poll)
GET  /api/queue/download/<basketId>                (200) 443,246 B zip, 1.25 s
```

The zip holds `gebco_2026_n28.5_s28.0_w-177.6_e-177.2_geotiff.tif` (30,888 B,
96 × 120 Int16, nodata −32767, pixel-centre registered), the documentation PDF
and the terms. Midway: **max 17 m at 28.2104 N 177.3854 W**, 26 cells above
0 (0.23 %).

The terms PDF (read): "The GEBCO Grid is placed in the public domain and may be
used free of charge". Users must acknowledge the source. Citation: *GEBCO
Compilation Group (2026) GEBCO 2026 Grid (doi:10.5285/4f68d5c7-45eb-f999e063-7086abc036fa)*.

The API is **undocumented**. It is the app's own back end. I would use it for
spot checks, not as a bake dependency.

### 1.4 Which reader is simplest in Node without native dependencies?

| path | reader | dependency | crosses 180 in one call | subsample on the server | notes |
| --- | --- | --- | --- | --- | --- |
| THREDDS OPeNDAP `.dods` (ETOPO 2022) | ~30-line DAP2 parser | none | no (2 calls) | yes (index stride) | **recommended**; Float32, 4 B/value |
| THREDDS WCS `GeoTIFF_Float` | `geotiff` (already in Holo i ke Au) | existing | no | **no** | bogus nodata tag; +1 row/column |
| ERDDAP `etopo360.nc` (ETOPO1) | ~40-line netCDF-3 parser, or `netcdfjs` (*verify* it reads v3) | none / new | **yes** | yes | Int16, 2 B/value; superseded 2009 model |
| ERDDAP `.dods` | the same DAP2 parser | none | yes | yes | 4 B/value for Int16 |
| ERDDAP `.geotif` | — | — | — | — | **8-bit picture, unusable** |
| THREDDS NCSS | netCDF-3 parser | none | — | — | **server errors on large boxes** |
| GEBCO app API | `geotiff` + `unzip` | existing | yes (`x_max` 360) | no | undocumented |

**Recommendation: ETOPO 2022 60″ through THREDDS OPeNDAP `.dods`.** It is the
newest model and cell-registered, its subsets are exact, and the reader has no
dependencies. Do not use ETOPO1. It is older and grid-registered, and it smears
atolls into land blobs (§3.3).

## 2. Each battle box's land: Copernicus GLO-30

### 2.1 Naming, registration, licence (all read)

- **Bucket:** `https://copernicus-dem-30m.s3.amazonaws.com/`. Public, no auth;
  HEAD gives 200, ranges give 206. `tileList.txt` is 1,110,900 B and names
  **26,450 tiles**, with CRLF line ends.
- **Name:** `Copernicus_DSM_COG_10_{N|S}{lat:02}_00_{E|W}{lon:03}_00_DEM/Copernicus_DSM_COG_10_…_DEM.tif`,
  where `lat` and `lon` are the floor of the tile's south-west corner. The tile
  spans lat…lat+1 and lon…lon+1. At the antimeridian, lon −180 is `W180` and
  179 is `E179`. Proved: `N28_00_W178_00` is −178…−177, 28…29 and holds
  Midway; `S10_00_E159_00` holds Savo at 9.13 S.
- **Registration:** the GeoKeys say `GTRasterTypeGeoKey = 2`, i.e.
  **PixelIsPoint**. The tiepoint (−178, 29) is the *centre* of pixel (0, 0).
  The bucket readme agrees: in AWS's files the easting is the centre of the
  left-most pixels, and the bottom row was trimmed. geotiff.js's
  `getBoundingBox()` ignores this and reports −178…−177. A bake must put cell
  edges half a cell (1/7200°, about 15 m) west of and north of the tiepoint.
  The POC does this.
- **Format:** 3600 × 3600 below 50° of latitude (2400 wide from 50° to 60°, so
  the Aleutian tiles are 2400 × 3600). Float32 metres on EGM2008, DEFLATE with
  predictor 3, 1024² internal tiles, and **three overviews** (1800, 900, 450,
  made by averaging). "Ocean areas do not have tiles, there one can assume
  height values equal to zero."
- **What it is:** a **DSM**, i.e. a surface model "including buildings,
  infrastructure and vegetation" (readme and the CDSE page). The tiles are
  dated 9 May 2022 (Last-Modified). Newer releases (2022_1 to 2024_1) are on
  CDSE behind registration. (Which release the AWS copy is: *verify*.)
- **Licence** (CDSE COP-DEM page, read): free. Anyone distributing it must
  show "© DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018
  provided under COPERNICUS by the European Union and ESA; all rights
  reserved". Adapted data must say "produced using Copernicus WorldDEM-30 ©
  DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided
  under COPERNICUS by the European Union and ESA; all rights reserved". Each
  box's `sources` entry must carry that notice.

### 2.2 Coverage at every place the task names

Small tiles were downloaded whole (0.1–1 MB, 0.7–1.2 s each). The others were
read as windows by HTTP range through curl (`r1-scripts/cogwindow.mjs`, a
geotiff.js `BaseClient` that runs `curl -D - -o -` and skips the proxy's
`Connection established` block). Land is a value above 0. Area is cells times
cell area.

| place | tile(s) | how read | land | highest cell (GLO-30) | expected (*verify*) |
| --- | --- | --- | --- | --- | --- |
| Midway (28.2 N 177.4 W) | N28_00_W178_00 (129 KB) | whole | **5.80 km²** | 30.1 m at 177.3854 W 28.2087 N (trees/buildings: DSM) | Sand + Eastern Islands ≈ 6 km² *verify*; natural height ≈ 12 m *verify* |
| Kure, Pearl and Hermes (same box) | N28_00_W179_00, N27_00_W176_00 | whole | 0.84 km², 0.23 km² | 6.0 m, 4.3 m | — |
| Savo (9.13 S 159.81 E) | S10_00_E159_00 | window, 2 requests, 0.33 MB, 2.3 s | 29.3 km² | **483.6 m** at 159.8162 E 9.1307 S | ≈ 485 m *verify* |
| Nggela (Florida), south | S10_00_E160_00 | window, 1.38 MB, 1.9 s | 347.8 km² in window | 394.5 m | — |
| Guadalcanal NW (Cape Esperance) | S10_00_E159_00 | window, 6.23 MB, 2.6 s | 1910.5 km² in window | 1965 m at 159.994 E 9.739 S | — |
| Samar east coast (11–11.8 N 125.4–126 E) | N11_00_E125_00 (22.8 MB tile) | window, 5 requests, 8.54 MB, 3.4 s | 1191.9 km² | 450.2 m | — |
| Homonhon, Suluan | N10_00_E125_00 | window, 0.79 MB | 106.8 km² | 378.6 m | — |
| Okinawa, south and centre | N26_00_E127_00 | window, 3.30 MB | 778.7 km² | 452.0 m at 127.9285 E 26.6354 N | Katsuu-dake 452 m *verify* (Yonaha-dake 503 m lies east of this window) |
| Southern Kyushu (Satsuma, Kagoshima Bay) | N31_00_E130_00 | window, 11.3 MB | 1508.7 km² | 1234 m at 130.8193 E 31.4860 N | Takakuma-yama ≈ 1236 m *verify* |
| Iwo Jima (24.78 N 141.32 E) | N24_00_E141_00 (219 KB) | whole | **22.94 km²** | **162.0 m** at 141.2890 E 24.7504 N | Suribachi ≈ 161–169 m *verify*; island larger now than in 1945 *verify* |
| Saipan and north Tinian | N15_00_E145_00 (952 KB) | whole | 181.3 km² | 464.8 m at 145.7438 E 15.1862 N | Tapochau ≈ 474 m *verify* |
| South Tinian, Aguijan | N14_00_E145_00 | window, 0.26 MB | 42.1 km² | 188.5 m | — |
| Guam | N13_00_E144_00 | window, 1.94 MB | 543.5 km² | 399.3 m at 144.6657 E 13.3399 N | Lamlam ≈ 406 m *verify* |
| Tarawa (1.4 N 173 E) | N01_00_E172_00, N01_00_E173_00 | whole (261 KB, 393 KB) | 21.2 + 43.2 km² (tiles include Abaiang and part of Marakei) | 21.9 m (trees) | atoll land ≈ 32 km² *verify* |
| Wake (19.3 N 166.6 E) | N19_00_E166_00 (141 KB) | whole | **7.31 km²** | 15.6 m | ≈ 6.5–7.4 km² *verify* |
| Rabaul (4.2 S 152.2 E) | S05_00_E152_00 (24.5 MB tile) | window, 4.72 MB | 661.1 km² | 668.5 m at 152.2121 E 4.2124 S | The Mother (Kombiu) ≈ 688 m *verify* |
| Oʻahu, east of 158 W | N21_00_W158_00 | window, 3.15 MB | 813.4 km² | 956.7 m at 157.7887 W 21.3576 N | Kōnāhuanui ≈ 960 m *verify* (Kaʻala is in tile W159) |

**Every island the v1 and later battles need is present.** Small atolls are
complete too: Midway, Wake, Tarawa, Kure, Pearl and Hermes. A wider probe of
tiny islands (`downloads/R1/glo30-tiny/`) found French Frigate Shoals (0.27
km²), Johnston (2.76), Howland and Baker (3.41), Laysan (3.04), Marcus
(Minamitorishima, 1.28), Kapingamarangi (1.13) and Nukuoro (2.46). The known
weakness is **pinnacles and rocks**. **Sōfu-gan** (Lot's Wife, 29.79 N
140.34 E) has **no tile at all**. **La Perouse Pinnacle** at French Frigate
Shoals comes out 1.4 m high (9 cells), though it is a famous steep rock about
37 m tall (*verify* height). The editing of water and coastline flattens such
features. None of the v1 boxes depends on one.

`r1-scripts/boxtiles.mjs` lists the 1° tiles for indicative boxes (R3 sets the
real ones). Where a tile is absent, I checked ETOPO 2022 60″ for land there:

| box (indicative) | tiles present | absent | land in absent tiles per ETOPO 2022 |
| --- | --- | --- | --- |
| midway 27–33 N, 180.5–174 W | N27_W176, N28_W179, N28_W178 | 39 | one cell **+19.1 m at 27.0083 N 176.475 W**: **Salmon Bank**, a submerged bank (ETOPO1 says +17 m there too). Phantom land; see §3.3 |
| guadalcanal 10–8.5 S, 159–160.6 E | S10_E159, S10_E160, S09_E159, S09_E160 | 0 | — |
| samar 10.5–13 N, 125–127 E | N10_E125, N10_E126, N11_E125, N12_E125 | 2 | none |
| okinawa 25.5–27.5 N, 126.5–129 E | 5 | 4 | none |
| tengo 29.5–32 N, 127–131.5 E | 8 | 7 | none |
| iwo, marianas, tarawa, wake, rabaul, pearl, surigao | all needed | — | none |

**Overviews cut big boxes' downloads.** `r1-scripts/cogov.mjs` read the whole
of N11_00_E125_00 (Samar):

| level | size | cell | land | bytes | time |
| --- | --- | --- | --- | --- | --- |
| overview 3 | 450² | 242 m | 44.18 % | 0.33 MB | 1.9 s |
| overview 2 | 900² | 121 m | 43.75 % | 1.31 MB | 1.6 s |
| overview 1 | 1800² | 61 m | 43.51 % | 4.52 MB | 2.2 s |
| full | 3600² | 30 m | — | 22.8 MB | — |

Overviews average land with the 0 m sea, so "above 0" overstates land a little
at coarse levels (44.18 % against 43.51 %). A bake should pick the level whose
cell is at most half a texel, and treat coast cells with a small threshold.

### 2.3 The fallback, AWS terrain tiles, is worse

`https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png`
(Web Mercator, 256 px, decoded as `R·256 + G + B/256 − 32768`) and
`/geotiff/{z}/{x}/{y}.tif` (512 px, Int16, EPSG:3857) both answered 200.
`r1-scripts/terrarium.mjs` read 3 × 3 tiles around each place (2–3 s, 30 KB–1
MB):

| place | zoom | land | max | verdict |
| --- | --- | --- | --- | --- |
| Midway | 12 | 41.8 km² | 88 m | lagoon filled as land (GLO-30: 5.8 km²) |
| Wake | 12 | 17.7 km² | 15 m | lagoon partly land |
| Iwo Jima | 12 | 32.3 km² | **2207 m** | spike |
| Tarawa | 12 | 58.6 km² | 38 m | blobby |
| Saipan / Tinian | 11 | 295 km² | **2005 m** | spike |
| Okinawa | 10 | — | 859 m | wrong (highest peak ≈ 503 m *verify*) |
| Kyushu south | 10 | — | 1880 m at 130.18 E 31.74 N | spike or error |
| Guam | 11 | — | 395.7 m at 144.6656 E 13.3392 N | agrees with GLO-30 |
| Oʻahu | 10 | — | 1233 m at 158.142 W 21.507 N (Kaʻala) | fine on a big island |

They are fine on large SRTM islands. They are **not usable for atolls or small
volcanic islands**, which is exactly where the Pacific battles are. Nothing in
this pipeline needs them.

### 2.4 Bare earth (FABDEM): not recommended

FABDEM, the Copernicus DEM with forests and buildings removed, is reachable at
`https://data.bris.ac.uk/datasets/s5hqmjcdj8yo2ibzi9b4ew3sn/`. It comes as 10°
zips (S10E150 is 158 MB, ranges allowed). Its `license.txt` is **CC BY-NC-SA
4.0**, and share-alike would bind the committed packs. GLO-30's canopy (20–40
m of jungle on Guadalcanal and Samar, by my estimate *verify*) reads as
terrain at diorama scale. The DSM's buildings in modern towns (Naha, Honolulu,
Garapan) are the real cost, and they are a "patches" problem anyway (§8).

## 3. Each box's sea depth

### 3.1 GMRT: the Hawaiian app's source works for the Pacific

`https://www.gmrt.org/services/GridServer?west=…&east=…&south=…&north=…&layer=topo&format=esriascii&resolution=high`
answered 200 for three boxes, with cells of 5.49e-4° (about 61 m).
`layer=topo-mask` returns only the high-resolution cells (multibeam, plus
GMRT's land):

| box | `topo` bytes / time | grid | `topo-mask` valid | notes |
| --- | --- | --- | --- | --- |
| Midway (177.6–177.15 W, 28–28.45 N) | 5,795,930 B, 5.7 s | 822 × 820 | 83.9 % | max 45 m |
| Ironbottom Sound (159.55–160.45 E, 9.65–8.85 S) | 17,677,470 B, 15.5 s | 1640 × 1456 | 67.6 % (52 % of that is land), so about half the sea has multibeam | GMRT's land max 2670 m is implausible next to GLO-30's 1826 m in the same box. Never take land from GMRT |
| Tarawa (172.75–173.25 E, 1.15–1.6 N) | 6,288,011 B, 5.4 s | 912 × 821 | 31.9 % | — |

Licence: CC BY 4.0, with citation (`https://www.gmrt.org/about/terms_of_use.php`,
read). The Hawaiian `DATA.md` records GMRT 4.5.0 and a GeoTIFF output that
"sometimes answers with an empty body", so its bake asks for ESRI ASCII. Keep
that.

### 3.2 ETOPO 2022 15″ as the fallback; ETOPO1 not needed

ETOPO 2022's 15″ tiles (about 460 m) cover every box and cost almost nothing:
0.05–0.34 MB per box over OPeNDAP. Use them where GMRT fails or for big
open-ocean boxes, where the floor only colours the water. ETOPO1 (1′) adds
nothing over them.

### 3.3 ETOPO paints shoals and reef flats as land

- **Salmon Bank** (27.0 N 176.47 W, near the Midway box): +19.1 m in ETOPO
  2022 60″ and +17 m in ETOPO1. GLO-30 has no tile there. It is a submerged
  bank.
- **Tarawa** (POC box): ETOPO 15″ alone calls **4.45 %** of the box land. GLO-30
  says **1.19 %**. The reef flat and lagoon come out as land or near zero.
- **Midway** (ETOPO1): 2.45 % land with a 28 m top **off** the islands.

So the rule must be the Hawaiian one, applied strictly. In a box, **land comes
only from GLO-30**. At the table, a texel is land only where Natural Earth's
land and minor-island polygons cover at least half of it; ETOPO supplies the
height there, and never decides land on its own. The sea from ETOPO or GMRT is
**clamped to ≤ −1 m**. The POC clamped 12,529 texels in
Ironbottom Sound, 1,665 at Midway and 37,696 at Tarawa.

The atoll lagoons and reef edges are not well resolved by any open grid I
reached (ETOPO 15″ is blocky; GMRT has multibeam over about a third of
Tarawa). At Tarawa the reef *is* the story, so that box needs a reef source:
the Allen Coral Atlas (the host answers 200; download needs a login, *verify*),
or the reef edge digitised by hand from period charts. This matters for Tarawa,
a later battle, not for v1.

## 4. Coastlines and labels: Natural Earth 10 m

Every layer below answered HEAD 200 at `https://naciscdn.org/naturalearth/10m/{physical|cultural}/<name>.zip`.

| layer | zip size | version | features (touching the theatre) | fields of note |
| --- | --- | --- | --- | --- |
| `ne_10m_land` | 3,269,070 | 5.1.1 | 10 multipolygons; 152,272 of 446,175 vertices in the table envelope | — |
| `ne_10m_coastline` | 3,069,451 | (not opened) | — | lines; use for strokes |
| `ne_10m_minor_islands` | 314,932 | 4.1.0 | 2795 (1215 in the theatre), 35,512 vertices | `featurecla, min_zoom, scalerank`; **no names** |
| `ne_10m_minor_islands_coastline` | 310,455 | (not opened) | — | — |
| `ne_10m_reefs` | 178,301 | 4.1.0 | 1043 (778 in the theatre) | no names |
| `ne_10m_geography_marine_polys` | 940,563 | 5.1.0 | 306 (80 in the theatre) | `name`, `name_ja`, `name_zh`, `name_ko`, … `wikidataid` |
| `ne_10m_geography_regions_polys` | 2,038,519 | 5.0.0 | 1047 (328 in the theatre) | `NAME`, `NAME_JA`, … |
| `ne_10m_geography_regions_points` | 87,372 | (not opened) | — | — |
| `ne_10m_populated_places` | 2,811,199 | (not opened) | — | — |
| `ne_10m_populated_places_simple` | 652,145 | 5.1.2 | 7342 (1338 in the theatre) | `name, namealt, adm0name, scalerank, pop_max, …` |
| `ne_10m_ocean`, `ne_10m_bathymetry_all`, `ne_10m_admin_0_countries` | 3.2 MB, 15.6 MB, 4.9 MB | — | — | not needed |

**Format.** Each zip holds `.shp/.shx/.dbf/.prj/.cpg` (UTF-8). The pure-JS
`shapefile` package (0.6.6) reads geometry and attributes. Marine polygons
took 226 ms, minor islands 69 ms, populated places 1.2 s. It has no native
code. **GeoJSON mirrors** answered 200 on raw.githubusercontent.com:

- `nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson` (10.2 MB),
  `…/ne_10m_minor_islands.geojson` (1.3 MB),
  `…/ne_10m_geography_marine_polys.geojson` (1.7 MB). This is the official
  repo.
- `martynafford/natural-earth-geojson/master/10m/physical/ne_10m_land.json`
  (18.3 MB) and `…/ne_10m_minor_islands.json` (2.0 MB).

`api.github.com` answered **403** (the proxy policy), so I could not read repo
metadata. The zips from naciscdn are the canonical source; the bake does not
need GitHub. NE's terms (read): "All versions of Natural Earth raster + vector
map data found on this website are in the public domain."

What NE does and does not hold (`r1-scripts/nepip.mjs`, `nenear.mjs`):

- **Small islands are blobs.** Midway is 2 polygons of 6 and 9 vertices (0.53
  and 2.97 km²). Wake is 1 polygon of 9 vertices (3.91 km²). Tarawa is 2
  polygons (13.1 and 18.6 km²). Iwo Jima is 15 vertices (26.15 km²). Truk
  (Chuuk) has 3. Kure has 1 (0.84 km²). They are good enough to place a glyph
  on the table and nothing more.
- **Oʻahu is one 149-vertex polygon** (1566 km²). Pearl Harbor's lochs and
  Ford Island are not cut out.
- **Marine names in the theatre** include Philippine Sea, Coral Sea, Solomon
  Sea, Bismarck Sea, Celebes, Sulu, Java, Banda, Molucca, East China, Yellow
  and South China Seas, Sea of Japan, Leyte Gulf, Surigao Strait, Samar Sea,
  Sibuyan Sea, Torres Strait, Luzon Strait and Makassar Strait, among others.
  They carry `name_ja`. "Ironbottom Sound", "The Slot" and "Sealark Channel"
  are **absent**. They belong in the gazetteer.
- **Spellings are not ours.** Region names write Ū/Ō as **Ü/Ö** (`KYÜSHÜ`,
  `HONSHÜ`, `HOKKAIDÖ`) and Lānaʻi as `Läna‘i`. **The bake must never put NE
  name strings on screen.** The gazetteer owns every label (the brief's
  macron and kanji rule).
- **Names and boundaries are modern.** Populated places give `Ho Chi Minh
  City`, `Jakarta`, `Yangon`, `Chennai`, `Mumbai`, `Busan (alt Pusan)` and
  `Honiara` (a town that grew up after the war, *verify*). Truk, Tulagi and
  Rabaul's wartime neighbours are missing. Countries are post-1945 throughout.
  Use NE for **positions and coastlines only.**
- **Antimeridian.** In the table envelope, 11 land rings, 14 marine-polygon
  rings and 2 reef rings touch ±180. NE splits polygons there. After wrapping
  longitudes around the projection centre the halves meet again. But coast
  strokes drawn from polygon rings would show a false meridian along the cut
  (Fiji, for one). Draw strokes from `ne_10m_coastline` (lines), or drop ring
  edges lying on ±180.
- **Size.** Inside the envelope: land 152k vertices (about 3.3 MB of raw
  GeoJSON), minor islands 20k (0.4 MB), reefs 10k (0.2 MB), marine polygons
  18k (0.4 MB). Simplified to about 1.5 km for a 6 km texel table, all of it
  should come to well under 1 MB (*verify* once simplified).

For period coastlines and names, the U.S. Army Map Service series at UT
Austin's PCL are reachable (`https://maps.lib.utexas.edu/maps/ams/`, 200).
The index lists Buka and Bougainville 1:250,000 (1942), Central Japan
1:250,000 (1943–), Central Philippines 1:25,000 (1944–), Borneo 1:250,000
(1945–), Chishima-retto and others. That belongs to the map researcher, but it
is where 1940s shorelines would come from (§8).

## 5. Projection for the table

### 5.1 Formulas (sphere, R = 6,371,008.8 m; φ latitude, λ longitude, centre φ0, λ0; Δλ = wrap(λ − λ0) into [−π, π))

**Equirectangular** (standard parallel φ1):
`x = R·cos φ1·Δλ`, `y = R·φ`. The inverse is immediate.

**Azimuthal equidistant (AEQD):**
`cos c = sin φ0 sin φ + cos φ0 cos φ cos Δλ`, `k′ = c / sin c` (1 at c = 0),
`x = R k′ cos φ sin Δλ`, `y = R k′ (cos φ0 sin φ − sin φ0 cos φ cos Δλ)`.
Inverse: `ρ = √(x² + y²)`, `c = ρ / R`,
`φ = asin(cos c sin φ0 + y sin c cos φ0 / ρ)`,
`λ = λ0 + atan2(x sin c, ρ cos φ0 cos c − y sin φ0 sin c)`.

**Lambert azimuthal equal-area (LAEA):**
`k′ = √(2 / (1 + sin φ0 sin φ + cos φ0 cos φ cos Δλ))`, with x and y as in
AEQD. Inverse: `c = 2·asin(ρ / 2R)`; φ and λ as in AEQD.

These are the standard spherical forms from Snyder, *Map Projections: A
Working Manual* (USGS PP 1395). The PDF answered 200 (22.5 MB); I did not
download it, so page numbers are *verify*. I checked the formulas
numerically instead. A forward then inverse round trip over the whole theatre
errs by at most 1.3e-8 m. The AEQD radius to Pearl Harbor equals the great
circle (6041.4 km). Scale factors, areal scale, maximum angular distortion ω
and grid convergence γ (true north relative to the table's up) are computed
numerically (`r1-scripts/proj.mjs`, `proj2.mjs`).

### 5.2 Distortion, centre at the brief's 10 N 160 E

Box 90 E – 155 W, 55 N – 40 S. Angular distances from the centre: Attu 44°,
Dutch Harbor 51°, Rangoon 62°, Imphal 64°, Sydney 45°, Pearl Harbor 42°,
corners 57–82°.

| place | equirect φ1 = 10 N: area, ω | AEQD: area, ω, γ | LAEA: area, ω, γ |
| --- | --- | --- | --- |
| Attu (Aleutians) | 1.63, 27.8° | 1.11, 5.8°, −9° | 1.00, 8.7°, −10° |
| Dutch Harbor | 1.67, 29.1° | 1.15, 7.9°, −23° | 1.00, 11.9°, −25° |
| Rangoon | 1.03, 1.6° | 1.23, 11.7°, +16° | 1.00, 17.7°, +16° |
| Imphal | 1.09, 4.7° | 1.25, 12.5°, +22° | 1.00, 18.9°, +22° |
| Sydney | 1.19, 9.8° | 1.11, 5.9°, −3° | 1.00, 8.9°, −4° |
| Pearl Harbor | 1.06, 3.2° | 1.10, 5.2°, −13° | 1.00, 7.8°, −13° |
| corner 90 E 55 N | 1.72, 30.6° | 1.30, 15.2°, +47° | 1.00, 23.0°, +48° |
| corner 90 E 40 S | 1.29, 14.4° | 1.44, 20.8°, −29° | 1.00, 31.5°, −31° |

The brief's centre is off-centre for its own box. Burma sits 62–64° out
while Pearl Harbor is 42°. **Centring on the box's middle (7.5 N 147.5 E)**
balances it:

| place | AEQD (7.5 N 147.5 E): h, k, area, ω, γ | LAEA (7.5 N 147.5 E): area, ω, γ |
| --- | --- | --- |
| Attu | 1.05, 1.10, 1.14, 7.5°, −18° | 1.00, 11.2°, −20° |
| Dutch Harbor | 1.14, 1.07, 1.20, 10.6°, −31° | 1.00, 16.0°, −34° |
| Rangoon | 1.14, 1.00, 1.15, 7.7°, +12° | 1.00, 11.7°, +12° |
| Imphal | 1.16, 1.00, 1.16, 8.7°, +18° | 1.00, 13.2°, +18° |
| Sydney | 1.00, 1.09, 1.09, 5.1°, +1° | 1.00, 7.7°, +2° |
| Pearl Harbor | 1.17, 1.00, 1.17, 8.9°, −16° | 1.00, 13.4°, −16° |
| Tokyo | 1.00, 1.04, 1.04, 2.5°, +4° | 1.00, 3.7°, +4° |
| **Midway** | 1.07, 1.02, 1.08, 4.5°, **−13°** | 1.00, 6.8°, −14° |
| **Guadalcanal** | 1.01, 1.02, 1.02, 1.3°, **+1°** | 1.00, 1.9°, +1° |
| **Samar** | 1.02, 1.00, 1.02, 1.4°, **+4°** | 1.00, 2.0°, +4° |
| corners (N / S) | area 1.26 / 1.31, ω 13.1° / 15.5° | ω 19.8° / 23.5° |

Equirectangular (φ1 = 10 N) has γ = 0 everywhere and ω ≈ 0 at the v1 sites.
It stretches east–west by **1.6–1.7×** at the Aleutians and 1.2× at Tokyo and
Sydney, so a box's local square would need a 12 % squash at Midway to meet it.
φ1 = 25° trades that for a 7–8 % squash at Guadalcanal and Samar.

Extent and fill (centre 10 N 160 E, 2048 texels across):

| projection | extent | aspect | theatre box fills | texel | height |
| --- | --- | --- | --- | --- | --- |
| equirect φ1 = 10 N | 12,593 × 10,564 km | 1.19 | 100 % | 6.15 km | 1718 |
| AEQD | 12,877 × 12,643 km | 1.02 | 81 % | 6.29 km | 2011 |
| LAEA | 12,240 × 11,734 km | 1.04 | 83 % | 5.98 km | 1963 |
| AEQD at 7.5 N 147.5 E | 12,838 × 11,958 km | 1.07 | 85 % | 6.27 km | 1908 |
| LAEA at 7.5 N 147.5 E | 12,289 × 11,263 km | 1.09 | 86 % | 6.00 km | 1877 |

An azimuthal table is a rectangle in projected space. Its corners reach beyond
the lat/lon box, and since the relief is global they fill with real terrain,
not blank wedges. For the AEQD at 10 N 160 E the rectangle's corners are 60.6
E 38.4 N, 124.3 W 52.4 N, 77.9 E 37.7 S and 145.9 W 42.4 S. Calcutta,
Chungking, Peking, Vladivostok, Petropavlovsk, Hobart, Wellington and Hilo are
inside. Seattle, San Francisco, San Diego and Colombo are just outside. The
bake must therefore fetch the rectangle's lon/lat envelope: **63.9 E – 128.9 W
(231.1 E), 44.4 S – 63.1 N** for the 7.5 N 147.5 E centre. That is 64.7 M cells
at 60″: 259 MB as Float32 at full resolution, **65 MB at stride 2**, 29 MB at
stride 3. My first preview fetched only the lat/lon box and shows clamped
streaks in the corners (`downloads/R1/table_aeqd_2048.png`); that is what a
too-small fetch looks like.

### 5.3 Recommendation

**Azimuthal equidistant, centred on the middle of R3's final theatre box**
(7.5 N 147.5 E for the brief's box).

- It looks like an ocean map of the period, with curved parallels and
  meridians converging north. That reads as "the Pacific on a table" better
  than a stretched plate carrée.
- It has the smallest worst-case shape error of the three: ω ≤ 9° at every
  place anyone fights over, ≤ 15.5° in the empty corners. Area is within
  1.17× at Burma, Pearl Harbor and the Aleutians.
- Distances from the centre are true. That is a small gift for "how far is
  everything" cards, and nothing else depends on it.
- Locally it is nearly a rotation plus a uniform scale. So a box built in its
  own north-up tangent frame drops onto the table by rotating through γ
  (Midway −13°, Guadalcanal +1°, Samar +4°) and scaling by 1.0–1.08. Better:
  the bake writes the projection's 2 × 2 Jacobian at each box centre, which
  is exact to first order across a few hundred kilometres.

Choose LAEA instead only if equal area matters more than shape (its ω is
about 1.5× AEQD's). Choose equirectangular only if north-up boxes everywhere
outweigh a 1.7× stretched Aleutian chain.

### 5.4 Longitude wrap and precision in the bake

- **One wrap function.** `Δλ = ((λ − λ0 + 540) mod 360) − 180` everywhere a
  longitude is projected. Data stay in [−180, 180] as the Hawaiian contract
  has them.
- **ETOPO through THREDDS:** two OPeNDAP pieces (east and west of the cut),
  stitched with the west piece shifted +360 (done in
  `r1-scripts/tablebudget.mjs`). ERDDAP's `etopo360` would need no stitch, but
  it is ETOPO1.
- **GLO-30 tile names:** wrap the tile's longitude before naming. In a box
  that runs past 180, add the 360 offset back when placing cells (the POC
  does both).
- **Box bounds:** allow a continuous longitude range (`east` may exceed 180,
  e.g. `[179, 27, 184, 33]` for a Midway box reaching 176 W). Say so in the
  new `DATA.md`; the Hawaiian contract never met the case.
- **Natural Earth:** wrap, then project. Drop ring edges on ±180 when drawing
  strokes (§4).
- **Float32 precision.** The table spans about 12,800 km. At the Hawaiian
  world unit of 100 m that is ±64,000 units, where float32 resolves about
  0.4 m. That is fine for the table. Inside a box, an aircraft at table
  coordinates 4,000–6,000 km from the origin would jitter at about 0.25–0.5 m.
  **Each box renders in its own frame with its origin at the box centre** (a
  floating origin). Its placement on the table is the transform the manifest
  stores.

## 6. Budget for `public/data` (~40 MB)

Measured by encoding real data in the Hawaiian format (8-bit RGB, `value =
R·256 + G`, `B = 0`, per-row adaptive filters, zlib 9; `r1-scripts/png16.mjs`):

| pack | texels | step | PNG | bytes/texel |
| --- | --- | --- | --- | --- |
| table, native ETOPO 2022 6′ grid (1150 × 950) | 1.09 M | 0.25 / 0.5 / 1 / 2 m | 1978 / 1838 / 1698 / 1548 KB | 1.85 / 1.72 / 1.59 / 1.45 |
| table AEQD 2048 × 2011 (bilinear from the 6′ grid, so smoother than a real bake) | 4.12 M | 0.5 / 1 m | 5.95 / 5.34 MB | 1.44 / 1.30 |
| table LAEA 2048 × 1963 | 4.02 M | 0.5 / 1 m | 5.86 / 5.27 MB | 1.46 / 1.31 |
| table equirect 2048 × 1718 | 3.52 M | 0.5 / 1 m | 5.30 / 4.79 MB | 1.51 / 1.36 |
| box Ironbottom Sound 1024 × 916 (97 m) | 0.94 M | 0.25 / 0.5 m | 921 / 766 KB | 1.01 / 0.84 |
| box Ironbottom Sound 2048 × 1832 (48 m) | 3.75 M | 0.25 / 0.5 m | 2897 / 2366 KB | 0.79 / 0.65 |
| box Midway 908 × 1024 (49 m) | 0.93 M | 0.25 / 0.5 m | 682 / 510 KB | 0.75 / 0.56 |
| box Tarawa 1024 × 916 (54 m) | 0.94 M | 0.25 / 0.5 m | 628 / 475 KB | 0.69 / 0.52 |
| *calibration:* Holo i ke Au archipelago 2048 × 1332 (279 m) | 2.73 M | 0.25 m | 3.45 MB | 1.26 |
| *calibration:* Holo i ke Au Oʻahu 1024 × 801 (68 m) | 0.82 M | 0.25 m | 0.88 MB | 1.08 |
| *calibration:* Holo i ke Au Nuʻuanu 2035 × 2048 (6 m) | 4.17 M | 0.25 m | 2.48 MB | 0.60 |

The low byte (G) is close to noise at coarse texels. That is why bytes per
texel rise as texels grow, and why the table costs most. Holo i ke Au's whole
`public/data` is 19.6 MB in 175 files.

Estimates:

| scenario | table | boxes | total heights |
| --- | --- | --- | --- |
| table 2048 + 8 boxes at 1024 | 5.5–7 MB | 8 × 0.5–1.0 MB | **≈ 10–15 MB** |
| table 2048 + 3 v1 boxes at 2048 + 5 at 1024 | 5.5–7 MB | 3 × 2.4–3.3 + 5 × 0.5–1.0 MB | **≈ 15–21 MB** |
| table 2048 + 8 boxes at 2048 | 5.5–7 MB | 8 × 2.2–3.3 MB | **≈ 23–33 MB** (too tight once vectors, companions and fonts are added) |
| table 1536 instead of 2048 | 3.2–3.8 MB | — | saves about 2.5 MB |

Heights are not everything. NE vectors simplified for the table come to about
0.5–1.5 MB (*verify*). A table land mask, if wanted, is about 0.3–0.5 MB
(*verify*). Box companion images (colour or cover) are unknown until designed.

Recommendations:

- **Box packs at 1024 by default.** Open-ocean boxes (Midway, Samar's sea)
  can be coarser still, with a finer **island inset** pack where an island
  matters. That is the Hawaiian archipelago-plus-island pattern, one level
  down. A v1 box goes to 2048 only where the sortie flies low over land
  (Guadalcanal).
- **Height encoding:** the table uses `scale 0.5, offset −11000` (−11,000 to
  +21,767 m). The rectangle reaches the Himalaya and the Pamirs, and the
  Mariana Trench is −10.9 km (*verify*), so 0.25 m steps cannot span it.
  **Boxes use `scale 0.25, offset −11000`** (−11,000 to +5,383.75 m). That
  covers the trench beside the Marianas and every island summit in the
  theatre. One encoding for all boxes; the manifest still carries it.

## 7. The proof of concept

`/tmp/claude-0/-home-user-vibe-dump/2e5146ca-4f91-535f-8583-82396d698b48/scratchpad/research/downloads/R1/poc-script/poc-box.mjs`
is one file, about 170 lines. Its only dependency is `geotiff@2.1.3`, and all
network traffic goes through `child_process` curl. It:

1. Lays a lon/lat-regular grid with square texels in the local tangent metres
   of Holo i ke Au's projection, row 0 north.
2. Reads `tileList.txt`, then for each 1° GLO-30 tile the box touches, opens
   the COG through a geotiff.js `BaseClient` that issues range requests
   through curl. It shifts by half a cell for PixelIsPoint, reads the window
   and bins 30 m cells into texels.
3. Fetches the ETOPO 2022 15″ subset over OPeNDAP `.dods` and parses DAP2.
4. Fuses by the Hawaiian rule. A texel is land where at least half of it is
   GLO-30 land, holding the land mean (at least 0.25 m). Otherwise it is
   ETOPO sea, clamped to ≤ −1 m.
5. Writes `height-<w>x<h>-step<scale>.png` at two encodings and prints the
   statistics.

Run from its directory: `node poc-box.mjs [--box W,S,E,N] [--size 1024] [--out DIR]`.

| box | grid | GLO-30 | ETOPO 15″ | min / max (at) / mean | land | wall time |
| --- | --- | --- | --- | --- | --- | --- |
| Ironbottom Sound 159.55–160.45 E, 9.65–8.85 S (default) | 1024 × 916, 97 m | 4 tiles, 10 range requests, 16.46 MB | 197 × 221, 0.18 MB | −1957.6 / **1824.8 m** (159.9758 E 9.6461 S) / −273.6 m | **35.67 %** (ETOPO alone 36.74 %) | **14.0 s** |
| same at `--size 2048` (earlier copy of the script, same logic) | 2048 × 1832, 48 m | same | same | −1958.5 / 1829.2 / −273.7 | 35.70 % | 20.9 s |
| Midway 177.6–177.15 W, 28–28.45 N | 908 × 1024, 49 m | 1 tile, 2 requests, 0.13 MB | 113 × 113, 0.05 MB | −4170.0 / 29.5 m (177.3857 W 28.2090 N) / −2134.3 | 0.27 % (ETOPO 0.31 %) | 5.1 s |
| Tarawa 172.75–173.25 E, 1.15–1.6 N | 1024 × 916, 54 m | 2 tiles, 4 requests, 0.46 MB | 113 × 125, 0.06 MB | −4062.1 / 20.5 m / −1942.0 | 1.19 % (ETOPO 4.45 %) | 6.6 s |

A hillshaded preview (`downloads/R1/poc-out/preview-ironbottom.png`) puts
Savo, Nggela, Cape Esperance and the Lunga coast where they belong, north up.
The cusps along the Lunga coast look like river deltas (*verify* against a
chart). The Tarawa preview shows the atoll and Betio. The ETOPO lagoon comes
out as a flat −1 m reef plate with blocky edges (§3.3).

## 8. A bake outline the evidence supports

`tools/bake-table.mjs`:

1. From R3's bounds, set the AEQD centre and the rectangle (2048 across).
   Compute the lon/lat envelope and split it at ±180.
2. Fetch ETOPO 2022 60″ over OPeNDAP in bands of at most about 20 MB, stride
   2 by default and 1 optionally, logged in a Hawaiian-style ledger. That is
   about 65 MB and 35 s at the measured 1.9 MB/s.
3. Forward-bin each source cell into its texel, weighted by cos φ (true
   area), keeping land and sea apart (the half-land rule). Rasterise NE land
   on the same grid and let it overrule ETOPO's phantom shoal land.
4. Write `table/height.png` (0.5 m, −11000), the stats and the sources.
5. Clip NE land, coastline, minor islands, reefs and marine polygons to the
   envelope. Simplify them (the Hawaiian `simplify.mjs`) and write lon/lat
   GeoJSON; the app projects it. Keep NE names out of user-facing fields.

`tools/bake-boxes.mjs`, per box:

1. Lay a lon/lat grid in the box's tangent frame. 1024 by default; east may
   exceed 180.
2. Land from GLO-30 by range reads through curl. Use the overview level whose
   cell is at most half a texel. Apply the PixelIsPoint shift and the
   half-land rule.
3. Sea from GMRT `topo` at about texel resolution (ESRI ASCII, spaced
   retries, as in Holo i ke Au). Fall back to ETOPO 2022 15″. Clamp to
   ≤ −1 m.
4. Write `boxes/<id>/height.png` (0.25 m, −11000), plus the placement on the
   table: the centre in table metres and the 2 × 2 Jacobian (or γ and k). Add
   the stats and sources, including the GLO-30 notice verbatim.
5. Check: named summits at their coordinates and heights (the measured maxima
   in §2.2 are the candidates, with heights still to be verified), every named
   island in the box has land, sea ≤ −1 m, land > 0.

The downloads for a v1 set (3 boxes of 100–300 km) come to about 20–60 MB of
GLO-30 (less with overviews), 10–40 MB of GMRT ASCII and under 1 MB of ETOPO
15″. With the table's 65 MB, that is the same order as Holo i ke Au's 160 MB.

## 9. Modern ground against 1940s ground (flagged, not solved)

Every DEM here is a 2010s–2020s snapshot. Holo i ke Au's patches mechanism
(`DATA.md`, "Patches, on any pack") applies. Candidates, all *verify*:

- **Iwo Jima**: volcanic uplift since 1945. The 1945 beaches now lie inland,
  and GLO-30's 22.9 km² is probably larger than the island in 1945.
- **Betio (Tarawa)**: reclamation and causeways.
- **Midway's Sand Island**: enlarged by dredge fill.
- **Naha, Kadena, Garapan, Apra Harbor, Honolulu**: modern fill and DSM
  buildings.
- **Rabaul**: changed by the eruptions of 1994. Vulcan itself dates from 1937,
  so it is right for the war.

The v1 boxes (Midway's waters, Ironbottom Sound and Samar's east coast) are
mostly natural shore, so the risk to v1 is low.

## 10. What could not be reached

| host or work | status | what I did instead |
| --- | --- | --- |
| `api.github.com` (repo metadata for the NE mirrors) | **403**: "GitHub access to this repository is not enabled for this session" | raw.githubusercontent.com answered 200 for the files |
| `data.bris.ac.uk/data/dataset/s5hqmjcdj8yo2ibzi9b4ew3sn` (FABDEM landing page) | **timeout (000)** after 30 s | `data.bris.ac.uk/datasets/s5hqmjcdj8yo2ibzi9b4ew3sn/` listing and `license.txt` answered 200 |
| THREDDS NCSS for theatre-sized boxes | **500** (server `AssertionError`); `netcdf4` and `geotiff` give **400** | used OPeNDAP |
| THREDDS WCS with `resx/resy` or `width/height` | **400** "Unknown problem" | native-resolution WCS works; OPeNDAP stride instead |
| ERDDAP `.geotif` as heights | 200, but an 8-bit greyscale picture | `.nc` and `.dods` |
| Snyder, USGS PP 1395 (`https://pubs.usgs.gov/pp/1395/report.pdf`) | HEAD 200 (22.5 MB), **not downloaded** (size rule) | formulas checked numerically; page numbers *verify* |
| Allen Coral Atlas downloads | host 200; downloads **not attempted** (login expected, *verify*) | — |
| ETOPO 2022 User Guide, GEBCO cookbook, Copernicus DEM validation report | not opened | — |
| `history.navy.mil`, HathiTrust, usmcu.edu (from the brief) | not needed for this topic | — |

## 11. Still needs a person

- **R3's final theatre and box bounds.** The projection centre, the envelope,
  the tile lists and the budget all follow from them. The scripts take them
  as parameters.
- **Look at the table in each projection** at the same exaggeration (the
  preview tool exists) and choose by eye. The numbers favour AEQD; the eye
  decides.
- **Summit heights for the bake check:** Suribachi, Tapochau, Lamlam, Savo,
  Popomanaseu, Mt Austen, Yonaha-dake, Katsuu-dake, the Mother (Rabaul),
  Kōnāhuanui, Takakuma-yama. Take them from a charted source, not from
  memory.
- **1940s coastlines** where a box needs them (Iwo Jima's uplift, Betio,
  Midway's Sand Island in 1942, Naha), from the AMS series or JICPOA maps.
  This is a later-battle problem.
- **Tarawa's reef edge and lagoon depths**: get Allen Coral Atlas access, or
  digitise by hand.
- **Licences.** The repository has no LICENSE file. The GLO-30 notice says
  "all rights reserved" while the licence allows free redistribution with that
  notice. Someone should read the ESA licence text itself and confirm that
  committing derived packs to a public Pages site with the notice is fine.
  The licence page is
  `https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM`.
- **Whether `maximum_area: 14400` in the GEBCO API is in square degrees**,
  and whether GEBCO minds scripted use of its app's back end, if anyone wants
  it beyond spot checks.

## 12. URLs opened

ETOPO 2022 and NCEI:
- https://www.ngdc.noaa.gov/thredds/catalog/global/ETOPO2022/catalog.xml (and `60s/`, `30s/`, `15s/` and their `*_surface_elev_netcdf/catalog.xml`)
- https://www.ngdc.noaa.gov/thredds/dodsC/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc (`.dds`, `.das`, `.ascii`, `.dods`)
- https://www.ngdc.noaa.gov/thredds/dodsC/global/ETOPO2022/30s/30s_surface_elev_netcdf/ETOPO_2022_v1_30s_N90W180_surface.nc (`.dds`, `.dods`)
- https://www.ngdc.noaa.gov/thredds/dodsC/global/ETOPO2022/15s/15s_surface_elev_netcdf/ETOPO_2022_v1_15s_N00E150_surface.nc, `…_N30W180_…`, `…_N15E165_…` (`.dds`, `.ascii`, `.dods`)
- https://www.ngdc.noaa.gov/thredds/wcs/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc (GetCapabilities, DescribeCoverage, GetCoverage)
- https://www.ngdc.noaa.gov/thredds/ncss/grid/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc (`dataset.html` and subsets)
- https://www.ngdc.noaa.gov/thredds/wms/… (GetCapabilities), https://www.ngdc.noaa.gov/thredds/fileServer/… (range)
- https://www.ncei.noaa.gov/products/etopo-global-relief-model

ERDDAP:
- https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.das, `etopo360.das`, `etopo360.dds`
- https://coastwatch.pfeg.noaa.gov/erddap/griddap/etopo180.geotif, `.json`, `.esriAscii`, `.csv`; `etopo360.nc`, `.dods` (subsets as in §1.2)
- https://coastwatch.pfeg.noaa.gov/erddap/griddap/documentation.html

GEBCO:
- https://download.gebco.net/ and its `/_next/static/chunks/*.js`
- https://download.gebco.net/api/grids, `/api/formats`, `/api/queue` (POST), `/api/queue/status/GEBCO_22_Oct_2026_582ca4694353`, `/api/queue/download/GEBCO_22_Oct_2026_582ca4694353`

Copernicus GLO-30:
- https://copernicus-dem-30m.s3.amazonaws.com/tileList.txt, `/readme.html`, the bucket listing
- https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_<tile>_DEM/Copernicus_DSM_COG_10_<tile>_DEM.tif for the tiles in §2.2
- https://registry.opendata.aws/copernicus-dem/
- https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM

AWS terrain tiles:
- https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{10,11,12}/{x}/{y}.png (3 × 3 around each place), `/geotiff/12/3655/1756.tif`, the bucket listing

GMRT:
- https://www.gmrt.org/services/GridServer?…&layer=topo|topo-mask&format=esriascii&resolution=high (three boxes)
- https://www.gmrt.org/about/terms_of_use.php

Natural Earth:
- https://naciscdn.org/naturalearth/10m/physical/ne_10m_{land,minor_islands,reefs,coastline,minor_islands_coastline,geography_marine_polys,geography_regions_polys,geography_regions_points,ocean,bathymetry_all}.zip (HEAD; downloaded: land, minor_islands, reefs, geography_marine_polys, geography_regions_polys)
- https://naciscdn.org/naturalearth/10m/cultural/ne_10m_{populated_places,populated_places_simple,admin_0_countries}.zip (HEAD; downloaded: populated_places_simple)
- https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_{land,minor_islands,geography_marine_polys}.geojson (HEAD)
- https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/10m/physical/ne_10m_{land,minor_islands}.json (HEAD)
- https://www.naturalearthdata.com/about/terms-of-use/

Other:
- https://data.bris.ac.uk/datasets/s5hqmjcdj8yo2ibzi9b4ew3sn/ and `…/license.txt` (FABDEM)
- https://maps.lib.utexas.edu/maps/ams/
- https://allencoralatlas.org/ (home page only)
- https://pubs.usgs.gov/pp/1395/report.pdf (HEAD only)
- https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetCapabilities (200, 5.3 MB, 8.5 s; not used further)
- Holo i ke Au, read from `origin/claude/funny-cannon-vy1pyf` with `git show`: `tools/lib/{fetch,png,raster,geo}.mjs`, `public/data/manifest.json`, `public/data/districts/manifest.json`, `package.json`; and `hawaiian-docs/DATA.md` §1–2, "How to bake", "District packs", `FONTS.md`.
