# Bake: the table, the coast and the four v1 boxes

The bake workflow's notes, 2026-10-22 (ENGINEERING.md §13). What was
fetched, what each pack rests on, the shore of 1941 at Pearl Harbor, the
measured statistics, what could not be settled and what needs a person. Every
number below was printed by the bakes or measured on the committed packs;
the scripts are `tools/bake-table.mjs`, `tools/bake-box.mjs` and
`tools/check/packs.mjs`. The downloads stayed outside the repository
(`/tmp/claude-0/-home-user-vibe-dump/2e5146ca-4f91-535f-8583-82396d698b48/scratchpad/bake-downloads`)
and were deleted by `--clean`.

## 0. Summary

| pack | grid | texel | land | min .. max | file | rests on |
| --- | --- | --- | --- | --- | --- | --- |
| `table/height.png` | 2048 × 1830, AEQD at 141.5° E 7° N | 6,918.9 m | 24.76 % | −10,615.5 .. +7,086.5 m | 6.00 MB | ETOPO 2022 60″ (heights), Natural Earth 10 m (land) |
| `table/coast.json` | 3,574 polygons, 2,726 strokes, 986 reef lines | — | — | — | 2.63 MB | Natural Earth 10 m |
| `boxes/midway` | 1502 × 2048 | 237.56 m | 0.004 % (6.9 km²: Midway and Kure) | −5,878 .. +17.25 m | 1.87 MB | GLO-30 (overview 1), GMRT 4.5.0 |
| `boxes/pearl-harbor` | 2048 × 1970 | 50.54 m | 14.79 % | −4,748 .. +1,220.5 m | 2.58 MB | CUDEM 1/9″ (harbour and south shore), GLO-30 (full), GMRT 4.5.0; shore of 1941 |
| `boxes/ironbottom-sound` | 2048 × 1384 | 59.93 m | 24.36 % | −2,188 .. +1,053 m | 1.93 MB | GLO-30 (full), GMRT 4.5.0 |
| `boxes/samar` | 1024 × 750 | 159.77 m | 11.06 % | −9,344 .. +719 m | 0.69 MB | GLO-30 (overview 1), GMRT 4.5.0 |

All of `public/data/` after this workflow: 15.7 MB (the bake's eight files;
the other workflows' JSON comes on top). The gate: `node tools/bake-table.mjs
--all` (54 s) and `node tools/bake-box.mjs --all` (258 s) from an empty
downloads directory, each ending with its check (`tools/check-data.mjs --only
packs`, clean) and its clean; the second run rebaked every pack byte for
byte. The first run stopped at Pearl Harbor: THREDDS answered the 15″ subset
with 200 and only its header (250 bytes), which curl's `--fail` cannot see;
every `.dods` and GMRT grid is now read back after fetching and fetched again
until whole (it was on the second try).

## 1. What was fetched

All on 2026-10-22, through `curl` (the agent proxy), recorded in the ledger
(`fetched.json`) with URL, date, size and SHA-256 and deleted afterwards.

| source | what | how | size |
| --- | --- | --- | --- |
| ETOPO 2022 60″ surface (doi:10.25921/fd45-gt74) | the table's envelope, 49.472° E – 233.528° E, 48.026° S – 65.844° N, every second cell | OPeNDAP `.dods` on `https://www.ngdc.noaa.gov/thredds/dodsC/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc`, five index-space bands (`z[2514:2:5064][13764:2:21599]` and so on; two pieces either side of 180°, stitched with the eastern piece's columns counted on from 21600) | 75.8 MB, 5,527 × 3,421 cells |
| Natural Earth 10 m | `ne_10m_land`, `ne_10m_minor_islands`, `ne_10m_reefs`, `ne_10m_coastline`, `ne_10m_minor_islands_coastline` | `https://naciscdn.org/naturalearth/10m/physical/<name>.zip`, unzipped beside | 3,269,070 + 314,932 + 178,301 + 3,069,451 + 310,455 B |
| Copernicus GLO-30 | `tileList.txt` (26,450 tiles) and windows of 12 tiles | HTTP range reads of the COGs on `https://copernicus-dem-30m.s3.amazonaws.com/` through a curl-backed geotiff 2.1.3 client; each window cached as Float32 with its header | Midway well under 1 MB (2 tiles, Kure and Midway, read inside their headers' first blocks; R1: 129 KB whole), Pearl Harbor 5.4 MB (N21 W158, W159), Ironbottom Sound 16.2 MB (S09/S10 E159/E160), Samar 7.1 MB (N10 E125, E126; N11 E125; N12 E125) |
| GMRT GridServer, `topo`, ESRI ASCII | one grid per box at about its texel | `https://www.gmrt.org/services/GridServer?minlongitude=…&maxlongitude=…&minlatitude=…&maxlatitude=…&layer=topo&format=esriascii&mresolution=<texel m>`, padded by three texels; Midway in two requests either side of 180°; the `/metadata` request for the version | Midway 23.3 + 98.9 MB (served at 121 m though 238 was asked), Pearl Harbor 24.7 MB (61 m), Ironbottom Sound 21.5 MB (61 m), Samar 11.6 MB (121 m) |
| ETOPO 2022 15″ tiles | each box's subset, the fallback behind GMRT | OPeNDAP `.dods` on the 15″ tiles named for their north-west corner (`N30E165`, `N30W180`, `N45E165`, `N45W180` at Midway; `N30W165` at Pearl Harbor; `N00E150` at Ironbottom Sound; `N15E120` at Samar) | under 1 MB in all; no texel used it (GMRT answered every box) |
| NOAA NCEI CUDEM 1/9″, Hawaiʻi (2021v1) | `ncei19_n21x50_w158x00_2021v1.tif` and `ncei19_n21x50_w158x25_2021v1.tif` | whole files from `https://noaa-nos-coastal-lidar-pds.s3.amazonaws.com/dem/NCEI_ninth_Topobathy_Hawaii_9428/tiles/`, after its `urllist9428.txt` | 158.9 + 143.5 MB |

What the files turned out to be, beyond R1:

- **GLO-30's sea is exactly 0 m** in every window (4.0 M of the 5.0 M cells
  of N21 W158 are 0.000). Land is a cell above 0 m, as R1 had it. But Oʻahu's
  tiles hold 54,000 cells **below** 0 m (−1 to −12 m): the water of the lochs
  and fishponds, which GLO-30 does not flatten to the sea's 0, and the low
  ground of the Kahuku and Waialua flats. At Pearl Harbor GLO-30 is used only
  outside the CUDEM tiles, so this touches only the Kahuku and Kāneʻohe
  shores, where a few ponds come out as sea at −1 m. Midway and Samar have no
  negative cells; Ironbottom Sound 433 (river mouths).
- **The CUDEM tiles are tiled GeoTIFFs** (256 × 256 internal tiles, DEFLATE
  with the floating-point predictor), 8112 × 8112 Float32 cells of 1/9″,
  PixelIsArea, nodata −9999, on mean sea level; read in strips without loading
  a whole tile. A 50.54 m texel holds 14 or 15 cells a side as the grids beat,
  so a texel is judged covered against its own count (the first bake used the
  mean count and left a lattice of one-texel gaps where the coverage fell to
  196 of 218 cells; it is gone).
- **GMRT serves finer than asked** where it has multibeam (121 m for a 238 m
  request at Midway and Samar), and its grids carry the seams of their
  sources. One is a straight north–south step near 159.996° E in Ironbottom
  Sound, 15 to 75 m high, which runs the length of the grid (−187 to −114 m
  across one node at 8.996° S); it is in GMRT's own grid, not in the
  resampling, and it stays (it lies under hundreds of metres of water, which
  the box draws opaque). Lone one-node spikes deeper than 50 m (1,294 at
  Midway, 479 at Pearl Harbor, 221 in Ironbottom Sound, 75 at Samar) are taken
  out by a 3 × 3 median; the shallows are left alone, where a coral head is
  real.

## 2. The table

The grid is DATA.md §§1–2's: the bounding rectangle of the projected theatre
box (78° E – 155° W, 42° S – 56° N), 2048 texels across, square texels of
6,918.9 m, 1830 rows; extent −7,084.9896 .. 7,084.9896 km east,
−6,543.1097 .. 6,118.5417 km south; the envelope its edges reach,
49.472° E – 233.528° E (126.472° W), 48.026° S – 65.844° N, rounded outward to a
thousandth of a degree.

- **Land is Natural Earth's.** The land and minor-island polygons are
  scan-converted on 4 × 4 samples a texel (even-odd per layer, ORed), and a
  texel is land where at least 8 of its 16 samples are. ETOPO decides nothing:
  22,644 ETOPO cells above −1 m fall where Natural Earth has sea (shoals,
  reef flats, a coarse coast) and were clamped. **Salmon Bank** (27.0° N
  176.47° W) reads −394.5 m.
- **Heights are ETOPO's**, every second 60″ cell (13,697,859 of them in the
  rectangle) binned into the texel its centre projects to, weighted by cos φ,
  each cell land or sea by the Natural Earth sample at its centre. A land
  texel is the mean of its land cells (each no lower than 0 m, the texel no
  lower than 0.5 m, so nothing below sea level reads as land: the Turpan
  depression and any lake bed come out at 0.5 m); a sea texel the mean of its
  sea cells, each clamped to −1 m or deeper. 117 land and 59 sea texels that
  no cell of their kind reached took ETOPO bilinearly at their centre.
- **Encoding** `scale 0.5, offset −11000`; the file is 6.00 MB, inside the
  5.5–7 MB band.
- **What I looked at** (the previews of `--preview DIR`): the whole table
  north-up with the coast drawn; Japan, the Philippines, New Guinea, the north
  of Australia, Kamchatka, the Aleutians from Attu to the Alaska Peninsula with
  Bowers Ridge, the Hawaiian chain from Hawaiʻi to Kure, the Solomons from
  Bougainville to Makira with Savo between Guadalcanal and Nggela, Tasmania
  and New Zealand's North Island, the Himalaya and the Tibetan plateau in the
  north-west corner. No phantom islands: the Hawaiian chain west of Kauaʻi is
  shoals and pinnacles under water, and Midway's texel is −6.5 m (its islets
  are 5 km² of a 48 km² texel, and the app draws them from coast.json).

## 3. The coast

`table/coast.json`, a FeatureCollection in WGS 84 lon/lat with longitudes
continuous past 180 (49.47 to 233.53):

- **Polygons** (3,574): kind `land` (1,901 from `ne_10m_land`), `island`
  (1,527 from `ne_10m_minor_islands`) and `reef` (146), each with `ne` (the
  layer, record and part, e.g. `ne_10m_land:7.230`; joined with `+` where a
  polygon was merged at 180°) and `area` in km² on the sphere, measured before
  simplification. Rings wind counter-clockwise outside and clockwise inside,
  none crosses itself or a sibling, and none keeps an edge on the meridian.
- **1,504 of the 1,527 minor islands are also in `ne_10m_land`** (identical
  rings). Each is kept once, as kind `island`, so a small island is not drawn
  twice.
- **`ne_10m_reefs` is a line layer**, not polygons as DATA.md §3 has it: 1,043
  lines, 151 of them closed. The closed rings in the envelope (146) are the
  `reef` polygons (an atoll's closed reef line encloses its lagoon, so the
  polygon is the atoll's whole footprint: right for a dot at the far zoom).
  Every reef line in the envelope, open or closed (986), is also in a third
  collection, `reefs`, which the contract does not ask for and the app may
  ignore.
- **Clipping**: the polygons are clipped to the envelope by four half-planes;
  where a ring is cut, the crossings along the cut are paired in order and
  the ring re-closed along the edge, so no piece keeps a zero-width bridge.
  Eurasia and North America are the large cuts. Long edges (the cut along
  the envelope) are densified to 50 km so the app does not draw a chord
  across the azimuthal table.
- **The merge at 180°**: four polygons met another across the meridian
  (Taveuni and its neighbours in Fiji, and Chukotka); their edges on 180° were
  taken out and the boundary along it kept only where land lies on one side.
  The coastline strokes' halves at 180° do not quite meet in Natural Earth
  (an end at 179.99998939° beside one at 180°, 0.0014° apart in latitude at
  Taveuni); four were joined within 0.005°.
- **Simplification**: Douglas–Peucker at 1,500 m (the texel is 6.9 km),
  with each line's metric from its own latitude; a polygon that collapses,
  crosses itself or turns over (a thin islet simplified to a triangle can) is
  done again at half the tolerance down to the source's vertices. Coordinates
  are written to 0.001° (110 m), and to 0.0001° for islets under 50 km².
- **Size: 2.63 MB.** R1 guessed "well under 1 MB". The polygons and the
  strokes are the same coast twice (56,634 and 39,509 vertices), as DATA.md §3
  asks; the reef lines add 0.18 MB. GitHub Pages serves it compressed (about
  a third). If the integrator needs it smaller, the knobs are `COAST_TOL` and
  the `reefs` collection in `tools/bake-table.mjs`.
- **No Natural Earth name string** is written: each feature's properties are
  `kind`, `ne` and `area` only, and the check enforces it.

## 4. The boxes

Each box is the frozen box of `tools/check/ids.json`, squared in its tangent
plane at the frozen `lat0` with the frozen long side (`packGrid`), which
reproduces the frozen size exactly; the bounds widen by less than half a
texel, on the short axis: Midway west and east by 0.242 texel (to 179.299403
.. 183.000597), Pearl Harbor south and north by 0.436 (21.1498005 ..
22.0501995), Ironbottom Sound by 0.152 (−9.5830823 .. −8.8329177), Samar by
0.238 (10.9996568 .. 12.0833432). Each entry's `stats.boundsWidenedTexels`
repeats it, and core's check warns of it as it should.

- **Land: GLO-30**, read at the coarsest overview whose cell is at most half
  a texel: overview 1 (61 m) at Midway (238 m texels) and Samar (160 m), the
  full 30 m at Ironbottom Sound and Pearl Harbor, where no level is that fine.
  Cell edges half a cell west and north of the tiepoint (PixelIsPoint).
  Cells are area-weighted into texels (separable box weights, a cell split
  between texels by its overlap), a missing tile counts as ocean, and a texel
  is land where half its area is GLO-30 land, holding the land cells' mean
  (at least 0.25 m). At the overviews a coast cell is an average with the sea's
  0, so "above 0" overstates land by up to half an overview cell along the
  shore (about 30 m), a fraction of a texel.
- **Sea: GMRT** at about the texel, area-weighted into sea texels only, never
  shallower than −1 m (189 sea texels clamped at Midway, 18,999 at Pearl
  Harbor, 71,831 in Ironbottom Sound, 5,571 at Samar: GMRT's land and its
  smoothed shore under GLO-30's sea). ETOPO 15″ stood behind it and was not
  needed.
- **The deep floor in coarser steps.** A sea texel deeper than 1,000 m is
  stored to 2 m, deeper than 50 m to 1 m, shallower to the encoding's 0.25 m.
  The encoding is unchanged (`scale 0.25, offset −11000`); the low byte of a
  deep, smoothly resampled floor is noise to the compressor, and this halves
  Midway's file (3.23 MB at 0.25 m everywhere, 1.87 MB so) without a visible
  change: the box draws water over it.
- **Placement** from `tools/lib/geo.mjs`'s `placement` against the frozen
  table projection: Midway centre (3,887.0, −2,919.1) km, convergence
  −15.3266°; Pearl Harbor (6,231.1, −2,384.3), −17.2735°; Ironbottom Sound
  (2,046.8, 1,792.2), +1.2247°; Samar (−1,681.2, −538.5), +2.6863°. Core's
  check recomputes each from `src/geo.js`'s rules and they agree.
- **What I looked at**: Midway's two islets inside the atoll's platform with
  Kure to the west and the seamounts of the chain; Savo north-west of the
  sound, Cape Esperance and the Lunga coast along the south, Nggela and Tulagi
  to the north-east, the Russells at the west edge, all north-up; Samar's east
  coast down the west edge with the Philippine Trench to the east; Oʻahu
  whole, the lochs and Ford Island, the entrance channel, Kāneʻohe Bay, the
  Waiʻanae and Koʻolau ranges. And in the app itself (`npm run build -w
  @vibe-dump/pacific-theatre`, then `DATA=real node tools/shoot.mjs` under
  SwiftShader): the table draws the real relief with the coast's ink, the Pearl
  Harbor outline sits over Oʻahu at its placement, and the Ironbottom Sound box
  draws Savo, Guadalcanal and Nggela north-up in the box scene. (The console's
  404s there are the other workflows' files: battle.json, kits, chapters.)

## 5. Pearl Harbor, set back to 7 December 1941

**What the pack rests on.** CUDEM 1/9″ over the two tiles' extent
(158.25° W – 157.75° W, 21.25° N – 21.5° N: the harbour, Hickam, Honolulu,
Waikīkī to Diamond Head, and the Koʻolau crest behind), every cell binned
into its texel (562,725 texels, 14 % of the box), land and harbour floor
alike by the half-land rule; GLO-30 and GMRT outside. The highest texel is
Kaʻala, 1,220.5 m at 158.1425° W 21.5079° N.

**What was taken out.** Every work in Holo i ke Au's dated record of Oʻahu's
harbours (`tools/lib/oahu-1941.mjs`, copied from its
`tools/lib/patch-works.mjs` with the authors' shapes, dates, sources and
notes) whose date is after 1941, undone at the texel by the half rule on
4 × 4 samples, and the drydocks R10 found the record lacks:

| work | built | undone how | texels | on whose word |
| --- | --- | --- | --- | --- |
| Kuahua's extension (`kuahua`) | to December 1943 | land outside Kuahua's 1881 outline, inside the work's region, back to −1 m | 71 | *Building the Navy's Bases in World War II* (1947), vol. II ch. XXII: Kuahua "extended with the spoil from 47 acres to a 116-acre peninsula"; the outline from the 1881 Government Survey sheet (State GIS scan), traced by the Hawaiian authors |
| Sand Island's later fill (`sand-island-later`) | 1943–44 | land in the 1881 sea outside Sand Island's 1938 outline, back to −1 m | 624 | *Building the Navy's Bases*; Hawaiʻi DOT, *HNL: the first 80 years*; the 1938 USGS sheet |
| The airport's Keʻehi fill (`keehi-airport-fill`) | 1943–44 | land in the 1881 sea in the work's region, back to −1 m | 689 | *Building the Navy's Bases* (the seaplane runways' spoil "raised the land to a 10-foot elevation"); Hawaiʻi DOT |
| The Reef Runway (`reef-runway`) | 1977 | land in its region back to −1 m | 1,212 | Hawaiʻi DOT airports history ("In 1977, Runway 8R/26L or the Reef Runway was constructed") |
| Magic Island (`magic-island`) | 1964 | land in the 1881 sea in its region back to −1 m | 59 | Images of Old Hawaiʻi, Ala Wai posts ("a 30-acre peninsula", 1964) |
| The Keʻehi seaplane runways (`keehi-seaplane`) | 1943–44 | sea deeper than −1.8 m in the zone back to the reef round it | 1,314 | *Building the Navy's Bases*; Hawaiʻi DOT |
| Kalihi Channel (`kalihi-channel`) | 1943–44 | deeper than −4 m back to the reef | 527 | as above (dated with the runways it served) |
| The cuts beside the Reef Runway (`reef-runway-cuts`) | 1977 | deeper than −1.8 m back to the reef | 783 | Hawaiʻi DOT (dated with the runway) |
| The Ala Wai harbour entrance (`ala-wai-entrance`) | 1951 | deeper than −2.2 m back to the reef | 47 | Images of Old Hawaiʻi ("in 1951, a channel was dredged directly out to sea") |
| Drydock No. 2 (`pearl-drydock-2`) | 1942 | the basin filled to the yard's ground | 5 | R10 §7.2 and §11.4: OpenStreetMap's start date 1942; R10 reads it as under construction on the day ("the new drydock", Train) |
| Drydock No. 3 (`pearl-drydock-3`) | 1942 | as above | 1 | R10 §7.2: OpenStreetMap, 1942 |
| Drydock No. 4 (`pearl-drydock-4`) | 1943 | as above | 4 | R10 §7.2: OpenStreetMap, 1943 |

The drydocks were identified at R10's points and traced on the CUDEM at its
3.4 m cells (the three parallel slips of the Navy Yard opening north-west on
the channel: No. 3 the short western one, about 140 × 30 m, No. 2 the middle
one, about 290 × 45 m, No. 1 of 1919 the eastern one, which stays; No. 4 the
diagonal basin north of Hospital Point, about 330 × 47 m). Each is a strip
along the dock's axis ending at the waterfront, so the channel is not
touched. At 50 m most of a dock is under half a texel and was land already;
the counts are the texels the docks had made sea.

**What was kept.** Ford Island's 1930s fill (`ford-island`, until 1940) is in
the pack, as it was in 1941; so are the entrance channel (1911), Honolulu
Harbour (1908), Kapālama (1935), Kewalo (1926), the Ala Moana channel (1928),
the Ala Wai harbour and canal (1928–35), Ala Moana Park (1934), the Waikīkī
wetland fill (1928) and Sand Island as the 1938 map draws it (1908).

**What was not there to take out.**

- **The Ford Island bridge** (the Admiral Clarey pontoon bridge, 1998) is
  not in CUDEM, which is bare earth: across the 1.4 km from Ford Island to
  Halawa there is open water, and the only trace is a mole about 10 m wide
  and 140 m long at Ford Island's north-east corner, under a texel.
- **The post-war piers** on Ford Island's south-east shore (F-5 rebuilt in
  1944 and 1992, "F3.5" and S382 of 1943; R10 §11.4) are on piles and not in
  CUDEM: the shore along Battleship Row is smooth sand and quay line, as it
  was. Neither are the 1941 quays.
- The Navy Yard's and the Naval Station's piers that are solid fill (the
  fingers south and east of Kuahua) stay as CUDEM has them, one or two
  texels wide: the record read gives no dates to separate them.

**How it differs from the Hawaiian patches.** Those were masks the app
mixed by year; here the year is fixed, so the work is done once, at the
texel. Simplifications, each a person may want to revisit:

- The Hawaiian lower works also asked for the State geologic map's fill unit
  (`fill: true`: the waterfront, Ala Moana Park, Magic Island, the airport's
  Keʻehi fill). It is not downloaded here; the work's region and the 1881
  sea stand in for it. For the airport this is the place it matters: the
  Hawaiian authors left John Rodgers Airport (1927), which stood on the 1881
  sheet's land west of Keʻehi lagoon, alone, and their record dates the
  made ground east of the lagoon's 1881 shore to the 1943–44 spoil.
- Raised sea goes back to the median of the zone's sea texels that are not
  cut (the reef round it), not the Hawaiian smooth surface held on the rim;
  natural deep water is told from a cut by depth alone (deeper than 20 m is
  left), not by the Hawaiian 500 m opening.
- Lowered land goes to the work's own `level` (−1 m), as the Hawaiian app has
  it, even where the loch beside it is deeper (Kuahua).

## 6. The check, and the measured statistics

`node tools/check-data.mjs` runs core and `tools/check/packs.mjs` clean
(warnings only: the bounds refinements, the battles not yet here, and the
coast agreement below). What the packs module measured:

| box | R1's GLO-30 maximum | the pack | land against coast.json, off by more than two texels |
| --- | --- | --- | --- |
| Ironbottom Sound | Savo 483.6 m at 159.8162° E 9.1307° S | 472 m at 159.8165° E 9.1302° S, the island's highest texel, under a texel from R1's point | 1.76 % of the box, 0.44 % of its edge |
| Pearl Harbor | Kōnāhuanui 956.7 m at 157.7887° W 21.3576° N | 947.75 m within two texels (CUDEM there); Kaʻala 1,220.5 m, the box's highest | 0.69 %, edge 0 % |
| Samar | 450.2 m in 11–11.8° N, 125.4–126° E | 430.5 m, the window's highest texel | 1.19 %, edge 0.78 % |
| Midway | 30.1 m (trees and buildings, a DSM) | Sand Island 17.25 m, Eastern Island 4.5 m, Kure 3 m | 0 % |

The coast agreement is Natural Earth's coarseness, not a misplaced pack:
Oʻahu is one 149-vertex polygon with the lochs filled, and the Solomons'
small islands are blobs. The check fails at 5 %, where a box flipped or
shifted would land.

## 7. Departures from the contract, and why

- **Midway is 1502 × 2048**, as `ids.json` freezes it (and DATA.md §7's
  table), not the 1024 the task named; the frozen ids win.
- **Reefs** are lines in Natural Earth 10 m; the reef polygons are their
  closed rings, and all reef lines are in an extra `reefs` collection (§3).
- **The deep sea floor is stored to 1–2 m** in the boxes (§4), within the
  frozen encoding.
- **coast.json is 2.63 MB**, above R1's estimate (§3).
- Pearl Harbor's **CUDEM supplies the harbour floor** as well as the land
  inside its tiles (DATA.md §7 names it as the land source there; GMRT's 61 m
  floor is smoothed in the lochs, R10 §11.2), and its `sea` stays `gmrt`, which
  supplies every sea texel outside the tiles.
- The fill unit of the Hawaiian lower works is not read (§5).

## 8. What could not be settled

- Whether GMRT's step near 159.996° E is a survey edge that a smoother
  should feather: left as GMRT has it.
- The lochs' depths in 1941: CUDEM is today's floor, with the wartime mooring
  dredging in it (R10 §11.4; the Hawaiian DATA.md "not done"). Not patched.
- The entrance channel's later widenings are not separated from its 1911 cut
  (the Hawaiian record says so).
- Drydock No. 2's state on the day: R10 reads "the new drydock" as under
  construction; whether its basin was dug and open to the channel is not in
  what was read. It is filled here.
- The 1941 shore of Midway's Sand Island (enlarged by later dredge fill, R1
  §9) and the DSM's buildings and trees there: not patched; at 238 m texels
  the islet is 4.6 km² of land.

## 9. What needs a person

- **Look at the airport.** A 1941 map (the 1938 USGS sheet the Hawaiian
  authors traced on) against `box-pearl-harbor-honolulu.png` from
  `node tools/bake-box.mjs pearl-harbor --preview DIR`: is the ground east of
  Keʻehi lagoon's 1881 shore that the bake takes out really the 1943–44 fill,
  with none of John Rodgers Airport on it?
- **Drydock No. 2 on 7 December 1941**: dug and flooded, or still behind a
  cofferdam? The answer decides whether its five texels are water.
- **The GLO-30 licence** for committed derived packs on a public site (R1
  §11): the notice is in every box's `sources` and `credit` and in NOTICE.md;
  someone should read the ESA licence text itself.
- **Summit heights from a charted source** (R1 §11): the check holds the
  packs to R1's GLO-30 maxima, which are a surface model's.
- **Whether coast.json should shrink** (§3) once the whole of `public/data`
  is known.
