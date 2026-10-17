# Native forest spec: ahupuaʻa island, c. 1700

This is the research behind the app's forest: which native and Polynesian-introduced trees grow where on a windward/leeward high island before Western contact, what they look like, and how that maps onto what the app can see (elevation, rain, riparian, slope, landform, the farmed band). It was put together from sourced research and an adversarial fact-check (sources in §9), and written as the spec for replacing the old generic round "blob" forest. Where the research reports and the fact-check disagreed, it follows the fact-check. Line numbers and code excerpts refer to the code as it stood when it was written.

**How to read the colour tags**
- **(S)**: a colour sampled from real photographs. These are on-screen sRGB values, so treat them as ±15%.
- **(E)**: an estimate made from published colour words.

**Where the island numbers come from.** Every number about the island itself was measured by generating the default seed (20261004) in node; `node tools/island-stats.mjs [seed…]` reports them (rain by elevation band, the share of land in each class below, where the sites stand). `node tools/audit-forest.mjs [seed…]` checks the forest the app grows against this spec: each species' share per zone next to the placement rules and the zone table, range breaches, clumping, the planted trees, and the corrections the research asked for.

---

## 1. What the research found (for the user)

### ʻŌhiʻa: you are half right. Here is exactly which half.

- **ʻŌhiʻa lehua is mainly a wet-forest tree, not a dry-area tree.**
  - Little & Skolmen (USDA, 1989) call ʻōhiʻa lehua (*Metrosideros polymorpha*) "the most common and most widespread large tree of Hawaii's wet forests". They say it grows "from sea level to timber line … through wet to dry forests".
  - Friday & Herbert (2006) say it grows best with 1,000–3,000 mm of rain a year. They call it "dominant in cloud forests and most rainforests above 400 m".
  - Stacy et al. (2014) say it occurs continuously wherever rain exceeds about 500 mm a year.
  - On this island, that puts it in the windward uplands, on the upper valley walls and valley heads, and in the summit cloud forest.

- **It does grow in dry places too, so that part of your memory is real.**
  - Cuddihy & Stone (1990, p. 13) say most of the native dry and mesic lowland forest that survives is dominated by either lama or ʻōhiʻa. The US Forest Service fire synthesis (FEIS) says the same.
  - In dry places ʻōhiʻa grows as scattered, shorter trees, and the dry-site form often has hairy, greyer leaves (Stacy et al. 2014, 2016).
  - So "from drier areas" is not wrong, just incomplete. Its tallest, closed-canopy stands are in the wet forest.

- **You are right that ʻōhiʻa did not grow on the inhabited valley floors in the 1700s, though not because it prefers dry ground.**
  - By then, "in nearly every valley with a permanent stream, the natural vegetation was replaced with irrigated taro" and with plants Hawaiians had brought (Cuddihy & Stone, ch. 15).
  - Walking up Nuʻuanu in 1825, Macrae met kukui and mountain apple first. He saw native ʻōhiʻa only in the upper valley.
  - So: no ʻōhiʻa lehua on the farmed valley floor. ʻŌhiʻa belongs on the ridges, the upper walls and the valley heads.
  - Even before people arrived, streamside forest at the bottom of a valley seems to have been a different mix: pāpala kēpau (*Pisonia*), *Charpentiera* and māmaki. That comes from a US vegetation classification and is an inference, so call it likely, not proven.

- **"ʻŌhiʻa" names two trees.** Pukui & Elbert define the word as "two kinds of trees: see ʻōhiʻa ʻai and ʻōhiʻa lehua".
  - ʻŌhiʻa ʻai is the mountain apple (*Syzygium malaccense*). Polynesian voyagers brought it, and it belongs to a different genus from ʻōhiʻa lehua.
  - It really does fill windward valleys and gorges. Little & Skolmen say it forms "almost pure stands to about 1800 ft", about 550 m.
  - It looks nothing like ʻōhiʻa lehua. It has big glossy leaves, a dark narrow cone of a crown, and magenta flowers growing straight out of the trunk.

- **One exception.** A streamside variety of ʻōhiʻa lehua (var. *newellii*) does exist. It grows only along windward streams on Hawaiʻi Island, as a shrub or small tree, so it does not change this island.

### What else changes how the forest should look

- **The summit is the wettest place on the island, not an alpine zone.**
  - In the model the summit stands about 1,660 m high and gets about 9,700 mm of rain a year.
  - Islands like this (Kauaʻi, West Maui, Molokaʻi, Kohala) carry low, wind-stunted, mossy ʻōhiʻa and ʻōlapa cloud forest on their summits, with small bogs.
  - There should be no māmane–naio subalpine belt, because that needs mountains above about 2,000 m.

- **Below about 460 m, the land was mostly farmed or burned by about 1700.** Native forest was "essentially untouched" only above about 760 m (Kirch, cited by Cuddihy & Stone).

- **Windward lowlands should show a mosaic, not a forest:**
  - loʻi on the valley floors;
  - pale silvery kukui filling the gulches and steep lower slopes;
  - hau thickets along the streams;
  - groves of mountain apple;
  - hala on the coast and the gulch sides;
  - ʻulu, niu, maiʻa and kī around the houses.

- **Leeward lowlands:**
  - pili grass kept open by fire, and the kula field walls;
  - scattered wiliwili, ʻaʻaliʻi, lama and dry-form ʻōhiʻa on rocky ground and in gulches;
  - mesic forest of koa and ʻōhiʻa higher up.

- **The biggest visual fixes, largest first:**
  1. ʻŌhiʻa should be an olive-grey, clumpy crown you can see through, on forked limbs. It should not be an emerald sphere.
  2. Lehua flower clusters are only 5–8 cm across, so they read as a sparse red speckle, and only on some trees at a time. They should not look like big red balls.
  3. Kukui should be the palest tree in the landscape.
  4. Bright hāpuʻu tree ferns belong under the ʻōhiʻa, and bright uluhe fern on the ridges.
  5. Mountain apple is a dark, narrow cone.
  6. Hala is a spiky candelabra standing on prop roots.
  7. Hau is a low, flat tangle along the streams.

---

## 2. What the code can see

### 2.1 Variables

| Name in this spec | Source in code | Meaning | Notes |
|---|---|---|---|
| `m` | `terrain.metresAt(x, z)` | True elevation in metres, with no exaggeration | The summit is 1,662 m and the old shield peaks at 1,104 m. |
| `r` | `landAt().rain`, the `uLand.r` channel | `ln(mm/300) / ln(40)`, from 0 to 1 | The land minimum is 520 mm (r = 0.149) and the maximum is 10,555 mm. See §2.2. |
| `L.rip` | `landAt().rip`, `uLand.b` | Rain-weighted drainage area (log scale), blurred over 2 cells and multiplied by 1.6 | 0 on ridges and open slopes. It approaches 1 on valley floors and big gulches. Before blurring, it is above 0 on 15% of land and above 0.5 on 5%. |
| `L.sand` | `uLand.g` | Beach sand | |
| `L.field` | `uLand.a` | The kula field-system mask | Covers 2.9% of land. Elevation p10 / p50 / p90: 85 / 208 / 675 m. |
| `ny` | `terrain.normalAt(x, z).y` | Normal in world units, with the ×1.3 vertical exaggeration | Below 0.35 is pali (the current code thins trees there). |
| `slope` | shader `1.0 - n.y` | The same quantity, taken from the normal map | |
| `isCleared` | `Vegetation.cleared` | Paddies, houses, heiau, villages, ahu and koʻa | |
| `sites` | `app.island.meta.sites` | 26 villages, 130 houses, loʻi (564 paddies), ponds, heiau | Loʻi paddies sit at 25–78 m (median 25 m) and get 1,182–1,604+ mm. Villages sit at 5–25 m and get 520–1,068 mm. |
| `season` / `doy` | `app.season`, `app.clock.doy` | `kau` (doy 121–304) or `hooilo` | The season buttons jump to doy 172 and doy 355. |
| **new** `tpi` | Built once from `island.data.height1024` | `m` minus the mean of `m` sampled on a 250 m ring | Positive is a ridge or spur, negative a hollow or valley. p05 / p25 / p50 / p75 / p95 = −120 / −25 / +3 / +36 / +95 m. |
| **new** `dCult` | `distanceTransform(N, c => cleared[c])` × 35.2 m | Distance in metres to the nearest cleared ground | Used for the farmed fringe and for wild maiʻa and kī. |
| **new** `grove` | `makeSimplex(seed + 5151)` at about 40 m | Patch noise | Makes kukui, mountain apple and hala come in groves rather than salt-and-pepper. |
| **new** `windward` | `r − (0.22 + 0.00043·m)` | Rain relative to the island's median for that height | Above 0 means windward for its height. Below 0 means leeward. |

**Fallbacks if `tpi` is not built:**
- ridge ≈ `L.rip < 0.05 && 0.6 < ny < 0.92`;
- valley floor ≈ `L.rip > 0.6 && ny > 0.85`.

The shader has no `tpi`. There, `rip`, `slope` and `nMid` do the job.

### 2.2 Rain thresholds in channel units

| mm/yr | 520 (land min) | 750 | 1,000 | 1,075 | 1,250 | 1,500 | 1,900 | 2,500 | 3,600 | 4,000 | 5,000 | 8,000 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `r` | 0.149 | 0.248 | 0.326 | 0.346 | **0.387** | 0.436 | 0.500 | **0.575** | 0.674 | 0.702 | 0.763 | 0.890 |

- Dry is below 1,250 mm, mesic is 1,250–2,500 mm and wet is above 2,500 mm. These are the Cuddihy & Stone classes.
- USFWS 2012 sets its cut-offs at 1,300 and 1,900 mm instead (r = 0.40 and 0.50). The spec uses the Cuddihy & Stone values.

### 2.3 How rain varies with elevation on this island (seed 20261004)

| band (m) | median mm (r) | leeward p05–p25 | windward p75–p95 |
|---|---|---|---|
| 0–50 | 682 (0.22) | 520–535 | 857–1,325 |
| 150–300 | 1,216 (0.38) | 536–635 | 1,861–2,889 |
| 450–600 | 1,689 (0.47) | 684–921 | 2,892–4,329 |
| 760–900 | 2,801 (0.61) | 1,069–1,829 | 4,168–6,906 |
| 1,050–1,200 | 4,346 (0.72) | 1,825–2,611 | 7,342–9,302 |
| 1,350–1,500 | 7,357 (0.87) | 3,945–5,425 | 9,491–10,233 |
| 1,500–1,662 | 9,696 (0.94) | — | — |

What this means for the vegetation:
- **Rain peaks at the summit,** which matches a mountain whose top sits below the inversion (climate.js puts the inversion at 2,100 m).
- **The leeward side turns mesic around 750–900 m and wet above about 1,200 m.** That fits Cuddihy & Stone: on Kauaʻi, Oʻahu and Molokaʻi, "dry and mesic leeward communities begin … below the summit rain forests".
- **Even the windward coast is fairly dry.** It gets about 850–1,300 mm, so the coastal strip falls in the dry class on both sides. The `windward` index is what tells a windward coast apart from a leeward one.

### 2.4 Where the tour stops sit

- **Nahele stop.** `trunkAtHeight(520)` lands on the last point of the model stream, at about **400 m**, on a windward valley floor with about **4,300 mm** of rain (r ≈ 0.72). The valley walls rise to about 860 m within 300 m.
- **Akua stop.** About **300 m** on the same valley floor, with about 3,700 mm (r ≈ 0.68). The stop looks up the walls into the cloud, or at the hero waterfall.
- **Loʻi stop.** 25–78 m. **Kauhale, kahakai and koʻa stops:** 5–25 m. **Kula stop:** on the field mask.

### 2.5 Share of land in each zone (seed 20261004, using §3's thresholds)

| Zone | Share of land |
|---|---|
| Leeward dry lowland (r < 0.387, below 600 m) | 39% |
| Dry above 600 m | 3.5% |
| Mesic below 460 m (mostly the windward lower slopes) | 16.5% |
| Mesic 460–1,000 m | 9.3% |
| Mesic above 1,000 m | 1.6% |
| Wet below 460 m | 5.0% |
| Wet 460–760 m | 6.4% |
| Wet 760–1,250 m | 11.9% |
| Above 1,250 m | 6.6% |

Bog candidates (above 1,300 m with slope under 0.12) are only about 3% of the summit area, so the bogs will be small patches.

---

## 3. Zone table

**Reading the table:**
- "Density" is the probability that a forest candidate becomes a tree. There is one candidate every 16.7 m, as now.
- Species mixes are by tree count and are rough.
- ʻŌlapa uses the stunted ʻōhiʻa geometry with a different tint (§4.2).

| # | Zone | In app terms | Trees (by count) | Density | Understorey and ground |
|---|---|---|---|---|---|
| A | **Kahakai (strand), windward** | `m < 15`, sand or the shore-trail band, `r ≥ 0.28` (≥ 850 mm) or `windward > 0.03`. Placed in `placeFixed`. | hala 40, niu 25 (beaches, villages), hau 15 (stream mouths, pond edges), milo 15, kou 5 | Fixed | Naupaka on the sand; pōhuehue, ʻakiʻaki, ʻilima, pāʻū o Hiʻiaka (shader: sand plus a low green fringe) |
| A′ | **Kahakai, leeward** | as above with `r < 0.28` | niu 35 (only within about 60 m of a village), kou 30, milo 10, ʻaʻaliʻi 25 (shrub) | Fixed | Naupaka dominant on the sand, ʻilima, bare rock |
| B | **Leeward dry lowland and kula** | `r < 0.387` and `windward < 0.03`, any height below the cloud forest (mostly 15–750 m). Fields where `field > 0.3` get no trees. | Below 600 m: ʻaʻaliʻi 35, wiliwili 25, lama 25, ʻōhiʻa dry form 15. Above 600 m: ʻōhiʻa dry form 35, lama 35, ʻaʻaliʻi 20, koa 10 (only where r > 0.33). | 0.07 on open slopes; up to 0.45 in gulches and on rocky steep ground | Pili grass, straw in kau and blue-green in hoʻoilo, kept by fire; ʻilima, ʻākia; red earth on steep ground; crops and stone walls on the field mask |
| C | **Leeward and edge mesic forest** (the wao kanaka edge, then mesic forest) | `0.387 ≤ r < 0.575` above the farmed band, mostly leeward 600–1,200 m | ʻōhiʻa 45 (tint goes from dry to wet as r rises), koa 30 (`m > 300`), lama 15 (standing in for lama, olopua, naio and ʻiliahi), ʻaʻaliʻi 5, kukui 5 (gulches below 670 m only) | 0.55 below 760 m; 0.85 above | Pūkiawe and ʻaʻaliʻi shrubs; few tree ferns (hāpuʻu p ≤ 0.15, only where r > 0.5); at the lower edge, fixed clusters of wild maiʻa, kī and ʻamaʻu |
| D1 | **Windward farmed lowland: valley floor** | `r ≥ 0.387` (or the windward coast), inside the farmed band (`cult`, about 460 m fading to 760 m), `floor > 0.5` | ʻōhiʻa ʻai 40 (below 550 m, in groves), hau 30 (`rip > 0.5`, below 450 m), kukui 25 (edges, below about 4,000 mm), hala 5. **No ʻōhiʻa lehua.** | 0.55, outside the cleared loʻi | Loʻi (cleared); kī, maiʻa and kō on the banks (fixed); ʻulu near houses |
| D2 | **Windward farmed lowland: gulches, hollows, steep lower walls** | as D1 with `gulch > 0.4` or `ny < 0.75` | kukui 70, hala 15, ʻōhiʻa ʻai 10, ʻōhiʻa 5 (crest edges). Above about 4,000 mm kukui drops out (Kahana): ʻōhiʻa 50, ʻōhiʻa ʻai 25, hala 15, stunted ʻōhiʻa 10. | 0.85 | Pale kukui streaks follow every gulch; fern and ʻamaʻu on the steep ground |
| D3 | **Windward farmed lowland: interfluves (fallow)** | as D1, everything else | kukui 45 (groves), hala 35, ʻōhiʻa ʻai 10, hau 10 (beside streams), ʻōhiʻa 10 (ridge crests above 150 m only), koa 10 (above 250 m, ridges) | 0.30 | Fallow grass and fern (grass-green ground with uluhe and ʻamaʻu tint) |
| E | **Windward transition** | where `cult` fades out, 460–760 m (this falls out of the rules rather than being coded separately) | ʻōhiʻa 55, koa 15, kukui 15 (gulches, below 670 m, fading out), ʻōhiʻa ʻai 5 (gorges below 550 m), hala 5 (below 610 m), stunted ʻōhiʻa 5 (ridges) | 0.8 | Hāpuʻu p ≈ 0.3; uluhe on ridges; loulu on cliffs (fixed) |
| F | **Wet montane forest** | `r ≥ 0.575` above the farmed band, below about 1,150–1,300 m | ʻōhiʻa 78, koa 10 (only where `r < 0.763` and `ny > 0.8`), ʻōlapa 10 (subcanopy), kukui 2 (gulches below 670 m). **Ridges and steep ground:** stunted ʻōhiʻa 50, ʻōhiʻa 50. | 0.95; 0.6 on ridges | Hāpuʻu dense (p 0.3–0.65); uluhe on ridges, steep faces and gaps (shader); kōpiko, kāwaʻu and ʻieʻie are not modelled |
| G | **Cloud forest** | `m > 1150 + 150·hash` (r is about 0.6 or more there) | stunted ʻōhiʻa 65, ʻōlapa 28, tall ʻōhiʻa 7 (hollows only, `tpi < −20`) | 0.95 | Moss on the limbs; hāpuʻu p 0.25 up to 1,600 m; sedge and moss ground |
| G′ | **Summit bog** | `m > 1350`, `ny > 0.97`, `r > 0.85` | stunted ʻōhiʻa only, knee- to waist-high (scale 0.3–0.45) | 0.10 | Sedges, grasses and moss (shader bog colour) |
| P | **Pali** | `ny < 0.35` | 70% of candidates skipped, as now. Wet side: stunted ʻōhiʻa (scale about 0.5). Dry side: ʻaʻaliʻi. Loulu on wet cliffs at 300–900 m (fixed). | — | Wet side: fern velvet of uluhe and ʻamaʻu. Dry side: kāwelu grass and dry shrubs. |

**What the zones mean for each tour stop:**
- **Nahele (about 400 m, 4,300 mm):** zone D/E on the floor, with ʻōhiʻa ʻai and hau and very little kukui because rain is near its 4,000 mm limit; zone F on the walls; koa on the better-drained slopes.
- **Akua:** kukui is pale in the lower gulches; ʻōhiʻa, uluhe and hāpuʻu cover the walls above about 460 m; cloud forest begins above about 1,200 m.
- **Loʻi:** zone D1.
- **Kauhale and kahakai:** zone A.
- **Kula:** zone B.

**Labels.** The zone labels in `maps.js` (wao nahele from 380–600 m) do not need to change for these rules. The vegetation uses its own bands. The research notes that the lower edge of the app's "wao nahele" was still farmed or kukui-dominated c. 1700. Raising that edge to about 460 m (wet) and 600 m (dry) is optional.

---

## 4. Species modelling sheets

### 4.0 Shared conventions

**Units and scale**
- Model space is metres, with the trunk base at the origin and y up.
- Instances are scaled by `S · (0.75 + 0.6·h2)`, with `S = 0.016`, so trees are drawn about 1.6× life size.
- The dimensions below are typical real-world sizes. Relative size between species matters most: koa is taller than ʻōhiʻa; ʻōhiʻa is taller than kukui and ʻulu; those are taller than ʻōhiʻa ʻai, then wiliwili and hala, then hau and hāpuʻu.

**Colours**
- The hex value given as **albedo** is what goes into `col(hex, var, rand)`, which linearises it.
- The **sunlit** and **shade** values are targets to check a screenshot against. They are not values to author.

**Accent materials.** Accents are new material codes, `MAT.accent0`–`MAT.accent7` (9–16).
- In the object vertex shader, an accent vertex collapses onto the instance origin unless that instance's hash is below `uAccent[g]`. Zero-area triangles are never drawn. This gives per-tree flowering and seasons from a single geometry.

```glsl
// objectVertex, AFTER the sway block. If it ran before, the sway (which bends by each vertex's
// local height) would pull the collapsed vertices apart into visible slivers.
uniform float uAccent[8];
...
if (aMat > 8.5) {
  int g = int(aMat - 9.0 + 0.5);
  float hs = fract(sin(dot(floor(origin.xz * 4096.0), vec2(12.9898, 78.233))) * 43758.5453);
  if (g == 2) hs = 1.0 - hs;          // group 2 is the complement of group 3 (see wiliwili)
  if (hs >= uAccent[g]) wp.xyz = origin;
}
```

- In the fragment shader, shade `m >= 9` as leaf (`m == 3`), with the noise and the translucency. Let it flutter too (extend the `aMat` 2.5–3.5 test).
- Accent groups and their per-season fractions. `uAccent` is set from `app.clock.doy` every frame, with a smooth ramp of about 20 days.

| g | What | hoʻoilo (doy 355) | kau (doy 172) | Basis |
|---|---|---|---|---|
| 0 | Lehua | 0.15 | 0.35 | Flowers all year, peaking spring–summer after the leaf flush (TTI) |
| 1 | Liko (new-leaf flush) | 0.20 | 0.25 | Leaves often reddish when young (L&S) |
| 2 | Wiliwili bare crown and flowers | 0.10 | 0.85 | Leafless while flowering, early spring to July (L&S, NPH). CTAHR OF-10 disagrees. |
| 3 | Wiliwili leaves | 0.90 | 0.15 | Complement of group 2 |
| 4 | ʻŌhiʻa ʻai flowers and ground carpet | 0 (0.8 at doy 60–120) | 0 | Flowers March–April (TTI) |
| 5 | ʻŌhiʻa ʻai fruit | 0 | 0.6 (doy 150–330) | Fruits June–November |
| 6 | Other flowers: koa (winter), kukui (spring), hau and kou (all year) | 0.30 | 0.25 | L&S, TTI |
| 7 | ʻAʻaliʻi capsules | 0.45 | 0.45 | Only female plants bear them, and they persist |

**Speck helper.** A tiny closed tetrahedron (4 triangles) for flowers, fruit and capsules. Never use a 20- or 80-triangle blob for an accent.

```js
function speck(B, x, y, z, s, c, mat) { // check the winding with the face audit (uObjDebug 5)
  const a = [x, y + s, z], b = [x - s, y - s * 0.5, z - s * 0.6], d = [x + s, y - s * 0.5, z - s * 0.6], e = [x, y - s * 0.5, z + s]
  B.tri(a, d, b, c, mat); B.tri(a, e, d, c, mat); B.tri(a, b, e, c, mat); B.tri(b, d, e, c, mat)
}
```

**Sheet geometry.** Fronds, strap leaves, fans and twig cards are single sheets.
- Add `this.forestMatDS = objectMaterial(app.shared, { fade: FOREST_LOD, close: 0.3, sway: 1, doubleSide: true })` and use it for the near meshes of `hapuu` and `hala`.
- Blob crowns stay on the single-sided `forestMat`.

**Per-instance tints.** Each tint is an RGB multiplier on the instance colour:

```js
colr = [c * t[0], c * (0.96 + 0.08 * v) * t[1], c * t[2]]
```

| Tint | RGB multiplier (linear) | Used for |
|---|---|---|
| `OHIA_WET` | 0.68, 0.71, 0.55 | Smooth-leaved wet ʻōhiʻa: olive. Bark becomes #6F6D63. |
| `OHIA_DRY` | 1.48, 1.41, 1.80 | Hairy dry-site ʻōhiʻa: grey-olive. Bark becomes #9F94A9, close to the sampled #A29C9F. |
| `mixTint(r)` | Log-space interpolation from `OHIA_DRY` at r ≤ 0.40 to `OHIA_WET` at r ≥ 0.58 | Mesic ʻōhiʻa |
| `OHIA_K` | 0.67, 0.60, 0.75 | Stunted cloud-forest ʻōhiʻa |
| `OLAPA` | 1.50, 1.66, 1.33 | ʻŌlapa on the stunted geometry: bright yellow-green |

**Budget per species**

| kind | Placement | near tris | far tris | near cap | far cap |
|---|---|---|---|---|---|
| ohia | streamed | ≤ 750 (about today's) | ≤ 50 | 3,000 | 12,000 |
| ohiaKrumm | streamed | ≤ 420 | 20 | 2,500 | 8,000 |
| koa | streamed | ≤ 650 | 26 | 1,500 | 5,000 |
| kukui | streamed + fixed | ≤ 550 | 26 | 2,000 | 6,000 |
| ohiaai | streamed + fixed | ≤ 400 | 26 | 1,200 | 4,000 |
| hau | streamed + fixed | ≤ 460 | 20 | 1,000 | 3,000 |
| hala | streamed (DS) + fixed | ≤ 420 | 26 | 1,500 | 4,000 |
| wiliwili | streamed | ≤ 420 | 46 | 800 | 3,000 |
| lama | streamed | ≤ 350 | 26 | 1,500 | 5,000 |
| aalii | streamed + fixed | ≤ 280 | 20 | 1,500 | 4,000 |
| hapuu | streamed, near only (DS) | ≤ 240 | — | 3,000 | — |
| loulu | fixed (rare) | ≤ 220 | — | — | — |
| milo, kou | fixed | ≤ 420 | — | — | — |
| niu, ulu, maia, ki, naupaka | fixed (existing) | as now | — | — | — |

Draw calls go from about 22 to about 34: 10 streamed species × 2, plus hāpuʻu near-only, plus about 13 fixed meshes. Triangles per near ʻōhiʻa stay about where they are now.

**Priority if the budget bites**
1. ohia, kukui, hapuu, ohiaai, ohiaKrumm, hala, hau, wiliwili, koa, lama, aalii.
2. loulu, milo/kou.
3. A separate ʻōlapa geometry, and a second ʻōhiʻa variant.

---

### 4.1 ʻŌhiʻa lehua (*Metrosideros polymorpha*), `ohia`. Endemic. Streamed. Priority 1.

**Silhouette**
- A crooked grey trunk, often standing on stilt roots, forking at mid-height into a few spreading limbs.
- The crown is a loose cluster of 5–7 separate, flattened leaf clumps.
- The top is irregular, with gaps that show limbs and sky.
- The crown is broader than it is deep. It is not a sphere.

**Dimensions:** 13–15 m tall; crown 9–10 m wide and 4–5 m deep; fork at about 6 m.
- The real forest tree is 20–24 m (TTI). L&S call the crown "compact to irregular", and a TTI caption notes a "sparse crown".
- Wet forest: scale 0.85–1.35. Mesic: 0.7–1.1. Dry: 0.55–0.85 (scattered and shorter).

**Recipe** (this is the template for the others):

```js
function ohia(rand) {
  const B = new Builder()
  const bark = col('#857F81', 0.12, rand) // light grey, scaly; the instance tint greys or darkens it
  // stilt roots: it often germinates on logs or hāpuʻu trunks
  for (let k = 0; k < 4; k++) {
    const a = k * 1.57 + rand() * 0.6
    B.cyl([Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1], [Math.cos(a) * 0.25, 1.5, Math.sin(a) * 0.25], 0.12, 0.17, bark, MAT.wood, 4)
  }
  // crooked bole, forking at mid-height
  const p1 = [0.4, 2.6, 0.1], p2 = [-0.3, 4.8, 0.3], fork = [0.1, 6.2, 0]
  B.cyl([0, 1.2, 0], p1, 0.45, 0.4, bark, MAT.wood, 5)
  B.cyl(p1, p2, 0.4, 0.33, bark, MAT.wood, 5)
  B.cyl(p2, fork, 0.33, 0.28, bark, MAT.wood, 5)
  // 3 limbs at 30–50° above horizontal, each forking once: 6 tips
  const tips = []
  for (let l = 0; l < 3; l++) {
    const a = (l / 3) * 6.28 + (rand() - 0.5) * 0.9, el = 0.55 + rand() * 0.3, len = 3 + rand()
    const mid = [fork[0] + Math.cos(a) * Math.cos(el) * len * 0.6, fork[1] + Math.sin(el) * len * 0.6, fork[2] + Math.sin(a) * Math.cos(el) * len * 0.6]
    B.cyl(fork, mid, 0.22, 0.16, bark, MAT.wood, 4)
    for (const side of [-1, 1]) {
      const b = a + side * 0.45, e = el + (rand() - 0.5) * 0.3, L2 = 1.5 + rand() * 0.6
      const tip = [mid[0] + Math.cos(b) * Math.cos(e) * L2, mid[1] + Math.sin(e) * L2, mid[2] + Math.sin(b) * Math.cos(e) * L2]
      B.cyl(mid, tip, 0.14, 0.08, bark, MAT.wood, 3)
      tips.push(tip)
    }
  }
  // 6 flattened clumps, one per tip, kept apart so limbs and sky show between them
  const clumps = tips.map((t) => [t[0], t[1] + 0.4 + (rand() - 0.5), t[2], 1.8 + rand() * 0.6, 1.0 + rand() * 0.3])
  clumps.forEach((c, k) => B.blob(c[0], c[1], c[2], c[3], c[4], c[3] * 0.9, col('#5C603F', 0.18, rand), MAT.leaf, k + rand()))
  // liko (accent 1): a flush cap on two clumps
  for (const k of [1, 4]) {
    const c = clumps[k]
    B.blob(c[0], c[1] + c[4] * 0.55, c[2], c[3] * 0.6, c[4] * 0.35, c[3] * 0.55, col(rand() < 0.6 ? '#9E3A2C' : '#B8683A', 0.15, rand), MAT.accent1, k, true, 0)
  }
  // lehua (accent 0): 24 tiny specks on the upper outer surface. A speckle, not balls.
  for (let k = 0; k < 24; k++) {
    const c = clumps[Math.floor(rand() * clumps.length)]
    const a = rand() * 6.28, up = 0.25 + rand() * 0.7, ring = Math.sqrt(1 - up * up)
    const hue = rand()
    speck(B, c[0] + Math.cos(a) * ring * c[3], c[1] + up * c[4], c[2] + Math.sin(a) * ring * c[3], 0.14 + rand() * 0.06,
      col(hue < 0.7 ? '#C8323A' : hue < 0.95 ? '#E0552E' : '#F0386A', 0.15, rand), MAT.accent0)
  }
  return B.geometry()
}
```

**Colours**

| Part | Albedo to author | Sunlit target | Shade target |
|---|---|---|---|
| Leaf base (tinted per instance) | #5C603F | — | — |
| Wet form (after tint) | #4D5230 | #6E7449 (S) | #2A2E1B (S) |
| Dry or hairy form (after tint) | #6E7052 | #858664 (S) | #424E2F (S) |
| Leaf undersides (dry form) | — | #B4C4B6 (S) | — |
| Bark | #857F81 | #A29C9F (S) | crevice #5A5354 (S) |
| Liko | #9E3A2C, #B8683A (E) | | |
| Lehua | #C8323A, #E0552E (S) | | |

- Misty cloud-forest crowns read about #656853 mid and #373A25 shade (S). That flattening comes from the fog, so do not bake it into the albedo.
- Liko can also be yellow, orange, pink or magenta (NPH).
- Lehua is sometimes salmon, pink or yellow. The pink-red shade is #F0386A.

**Far LOD**
- A stick: `cyl([0,0,0],[0.3,6.5,0.1], 0.4, 0.25, bark, MAT.wood, 3)`.
- Two overlapping detail-0 blobs:
  - main: `rx 4.6, ry 2.4` at `(0.3, 9.0, 0)`;
  - side: `rx 3.0, ry 1.8` at `(2.2, 8.2, 1.0)`.
- Colour the blobs #5C603F × 0.95.
- This keeps the flat-topped, lopsided, broader-than-deep read for about 46 triangles.

**Optional second variant.** Make "B" compact, with no stilt roots and 5 tighter clumps, and pick between the variants by hash. This costs 2 more draw calls.

**Do not:**
- make it a sphere or one smooth blob, or give it a straight pole trunk;
- use emerald green (today's #3a5e2c is too saturated and too blue). It is olive to grey-green;
- use big red balls, or dot red evenly over every tree. Lehua clusters are 5–8 cm at the branch tips, and only some trees bloom at once;
- put it on the farmed valley floor or the coastal plain;
- make it tall on exposed summit ridges. Use §4.2 there.

---

### 4.2 ʻŌhiʻa lehua, stunted cloud-forest, ridge and bog form, `ohiaKrumm`. Also carries ʻōlapa (*Cheirodendron*) by tint. Streamed. Priority 1.

**Silhouette:** short, gnarled, leaning, often with several stems. The crown is flat-topped, wind-shorn and wider than tall. The limbs carry moss.

**Basis:**
- On exposed ridges, steep slopes and poorly drained sites ʻōhiʻa "may be reduced to dwarf shrub stature" (TTI).
- ʻŌlapa "is often co-dominant with ʻōhiʻa in low-statured, wind-stunted forests of peaks and ridges", which have "gnarled trees, abundant epiphytes (particularly mosses and liverworts)" (Cuddihy & Stone p. 9).

**Dimensions**

| Form | Height | Scale |
|---|---|---|
| Cloud forest | 4–6 m, crown 5–6 m wide | 0.8–1.15 |
| Ridge shrub | 1.5–3 m | 0.45–0.7 |
| Bog | knee- to waist-high | 0.3–0.45 |

**Recipe**
- **Stems:**
  - stem 1 runs from the origin to `(0.6,1.6,0.2)` to `(1.1,2.8,0)`;
  - stem 2 runs from the origin to `(−0.5,1.4,0.4)` to `(−1.2,2.4,0.6)`;
  - both use radius 0.25 to 0.12, `seg 4`, bark #6E6862;
  - lean the whole tree about 10° toward +x. The instance rotation scatters the direction; it should ideally follow the wind.
- **Moss:** 3 detail-0 blobs hugging the stems at y 0.8–2.0, r 0.25–0.35, colour #5C6B3A (E).
- **Crown:** 4 flat blobs, rx 1.6–2.0 and ry 0.7–0.9, with tops at 3.6–4.4 m, offset along the lean. Colour #596537 (var 0.18). The instance tint `OHIA_K` gives #4A5030.
- **Accents:** 10 lehua specks (accent 0) and 1 liko cap (accent 1).

**Colours**
- ʻŌhiʻa: sunlit about #6A7048, shade #2C3119 (E, from the ʻōhiʻa samples).
- ʻŌlapa, via the `OLAPA` tint: about #6B7F3E, sunlit about #8EA052, shade about #34401C (all E; the research did not sample ʻōlapa).
- Under `OLAPA` the bark lifts to #84836F. That is acceptable.

**Option.** If the budget allows, give ʻōlapa its own geometry. Real ʻōlapa is an upright tree to about 12 m with fluttery compound leaves: a slender 6–8 m trunk and a small rounded crown of 3 blobs.

**Far LOD:** no stick. One flattened blob, `rx 2.6, ry 1.1` at y 3.6, offset 0.5 m along the lean.

**Do not:**
- put tall forest ʻōhiʻa on the summit ridges;
- add a māmane or naio subalpine belt. The island tops out at about 1,660 m, below the 2,000 m where subalpine starts. Māmane is "rare on Kauai, Oahu, and Molokai" (L&S);
- make the bog a forest.

---

### 4.3 Hāpuʻu tree ferns (*Cibotium* spp.), `hapuu`. Endemic. Streamed understorey, near only. Priority 1.

**Silhouette:** a dark, unbranched, fibrous trunk under a shuttlecock of arching lacy fronds. A brown skirt of dead fronds hangs below.

**Basis:**
- L&S: a "characteristic understory plant in ʻōhiʻa forests and with other treeferns often forms dense undergrowth".
- Range about 250–1,700 m in mesic to wet forest. Sources disagree on the upper limit; the fact-check has the detail.

**Dimensions:** trunk 1.5–4 m (*C. menziesii* rarely reaches 7 m); fronds 2–3 m long; crown 4–5 m across. Scale 0.7–1.2.

**Recipe**
- **Trunk:** `cyl([0,0,0],[0.1,2.6,0.05], 0.32, 0.22, '#2A241E', MAT.wood, 5)`, near-black with matted roots.
- **Base flare:** blob `rx 0.5, ry 0.35`, colour #2A241E.
- **Pulu** (golden wool of *C. glaucum*): 1 detail-0 blob of r 0.3 at the crown, colour #B07A3A.
- **Live fronds:** 10, spaced evenly in azimuth with jitter.
  - Each is a 4-segment arched ribbon, built like the `palm()` fronds: two quads per segment in a shallow V.
  - The rachis rises 0.6 m over its first third, then arches down to a tip 0.4 m below the crown. Length 2.6 m.
  - Width runs from 0.15 at the base to 0.55 at 40% of the length to 0.10 at the tip.
  - Colour the inner segments #6E8E4E and the tips #8DA965.
  - On 3 fronds, colour the underside glaucous #A9B8B0 (*C. glaucum*).
- **Dead skirt:** 3 fronds hanging at −70° from the crown, 1.6 m long, colour #6B5034 (E).

**Colours:** sunlit #8DA965, mid #729452, shade #596D35 (S, *C. menziesii*). *C. glaucum*: #90AE62, #6D8E47 and #4A642B (S).

**Far LOD:** none. It dithers out over the near band at 3.6–4.6 units, under the canopy; the terrain canopy colour carries it.

**Do not:**
- give it a palm-like ringed trunk;
- put it in the dry leeward, at the coast, below about 250 m or above about 1,700 m;
- stand it in the open. It is an understorey plant under ʻōhiʻa.

---

### 4.4 Koa (*Acacia koa*), `koa`. Endemic. Streamed. Priority 1.

**Silhouette**
- A large, broad, umbrella-like crown, often wider than tall.
- It sits on a short, crooked or leaning bole that forks low into big sinuous limbs.
- The crown texture is coarse, wispy and grey-green. Koa stands above the ʻōhiʻa.

**Dimensions:** 15–18 m tall; spread 12–16 m; fork at 3–5 m.
- L&S: "Only Hawaii and Kauai have tall straight-stemmed koa…; the trees on other islands have short crooked stems". On a composite island, use the crooked form.

**Recipe**
- **Bole:** from the origin to `(0.5,2.2,0.2)` to `(0.2,4.0,−0.3)`, radius 0.7 to 0.5, `seg 6`. Bark #5A504B with var 0.15, which ranges between the furrows (#2D2D2B) and the ridges (#8E7872).
- **Limbs:** 3–4 big limbs from y 3.5–4.5, rising at 30–45°.
  - Each is 2 segments with a kink, 5–7 m long, radius 0.4 to 0.18.
  - Each forks into 2, giving 6–8 tips at y 9–13 and 4.5–6.5 m out from the axis.
- **Crown:** at each tip a flattened blob, rx 2.6–3.2 and ry 1.1–1.4 (ry/rx ≈ 0.42), colour #5E6A3C (var 0.15).
  - Colour 25% of the clumps grey-green #7A8260, for the sheen of the phyllodes.
  - Add 1–2 smaller lower clumps for depth.
- **Flowers (accent 6):** 20 pale-yellow specks, #E8DC7A, as winter flowers.

**Colours:** sunlit #7E8F48, shade #333D19 (S); grey-green phyllodes #8C956F, fresh #5F944D (S); flowers #E8DC7A (E); bark ridges #8E7872, mid #5A504B, furrows #2D2D2B (S).

**Far LOD:** a stick, radius 0.5 to 0.3 and 4.5 m tall, plus one wide blob `rx 6.6, ry 2.6` at y 10.5, colour #5E6A3C.

**Do not:**
- make it a tall cylinder of foliage, or a straight pole bole;
- put it on the dry leeward coast or the wet windward valley floor;
- let it dominate. It mixes with ʻōhiʻa, which "predominates" (TTI);
- put it in the farmed lowland below about 250 m. Its pre-contact lower limit was once lower (TTI: it "once thrived as low as 90 m"), but in 1700 that land was farmed. Ridge remnants only.

---

### 4.5 Kukui (*Aleurites moluccanus*), `kukui`. Polynesian introduction. Streamed and fixed. Priority 1.

**Silhouette**
- A big, billowing, irregular dome, about as wide as it is tall.
- Long spreading side branches droop at the ends; trees at the edge of a grove keep foliage low.
- It is distinctly pale silvery grey-green: the one tree that reads as "light" from far away.

**Basis:**
- L&S: "recognized from a distance by its silvery green or grayish foliage".
- TTI: "very conspicuous along stream valleys and ravines".

**Dimensions:** 10–14 m tall and 10–13 m wide. Scale it up (1.1–1.35) on narrow valley floors, where L&S say it grows largest.

**Recipe**
- **Trunk:** from the origin to `(0.3,3.5,0.1)`, radius 0.45 to 0.35, `seg 5`. Bark #A8A49A: smooth, light grey, pale with lichen.
- **Limbs:** 4–5 long limbs from y 3–4, running from nearly horizontal to 30° up, 4–5.5 m long.
  - Each has 2 segments, the second dipping 10° (drooping), radius 0.25 to 0.1.
- **Crown:** 6–7 blobs.
  - 1 central blob, rx 3.2 and ry 2.4, at y 8.
  - The others at the limb ends: rx 2.4–3.0, ry 1.8–2.2, at y 5.5–8. Some sit low, so the edge of the grove has foliage near the ground.
  - Colour #84835E (var 0.15). Colour the 2–3 topmost and outermost blobs pale floury #A3A07E (the silvery young leaves).
- **Flowers (accent 6):** 16 cream specks, #E8E4CC, as spring flowers.

**Colours:**
- Highlights #A3975F–#B0AA88, mid #5C552A, deep shade #2C2C18 (S).
- At valley distance a kukui patch reads about #B0AF98 against a forest at about #636761 (S, Waipiʻo photo). About 3.3× brighter in linear terms, so keep that contrast.
- Flowers #E8E4CC (E); bark #A8A49A (E).

**Far LOD:** a stick plus one big blob `rx 6.2, ry 4.0` at y 7.2, colour #8E8C69 (the mixed pale).

**Do not:**
- make it dark green (today's #6f8a5c is too green and too dark);
- put it above about 670 m (90% of mapped trees are below 547 m), or where rain exceeds about 4,000 mm (Kahana);
- put it in leeward dry scrub;
- treat it as a native forest tree. It belongs in gulches, on steep lower slopes, on valley sides, and around kauhale.

---

### 4.6 ʻŌhiʻa ʻai, mountain apple (*Syzygium malaccense*), `ohiaai`. Polynesian introduction. Streamed and fixed. Priority 1.

**Silhouette**
- A dense, narrow, conical-to-columnar, almost black-green crown on a short, often fluted trunk.
- It grows in pure groves.
- In spring, magenta flower puffs grow on the bare trunk and limbs, and a magenta carpet spreads beneath.

**Basis:** L&S describe a "dense conical or columnar crown of dark green foliage". The purplish-red flowers drop "to form a purplish red carpet".

**Dimensions:** 9–12 m tall; crown 4.5–6 m wide.

**Recipe**
- **Trunk:** `cyl([0,0,0],[0,2.2,0], 0.35, 0.3, '#8A7458', MAT.wood, 6)`. The 6 sides suggest fluting. The colour is an estimate for light-brown bark.
- **Crown:** 4 blobs stacked on the axis, narrowing upward into a cone. Colour #3E5428 (var 0.12).

  | Blob | y (m) | rx | ry |
  |---|---|---|---|
  | 1 | 3.6 | 2.8 | 1.8 |
  | 2 | 5.6 | 2.4 | 1.8 |
  | 3 | 7.4 | 1.8 | 1.6 |
  | 4 | 9.0 | 1.1 | 1.2 |

- **Flowers (accent 4):** 12 magenta specks, #C8204E, on the trunk at 1.2–2.2 m and on the inner limbs.
- **Ground carpet (accent 4):** a flat 10-triangle disc of r 2.4 at y 0.03, colour #A8264E.
- **Fruit (accent 5):** 12 red specks, #B5122E, just inside the crown surface.

**Colours:** sunlit #6F8D46–#8BA268, mid #344B22–#506240, shade #222D1C (S); flowers #C8204E and fruit #B5122E (E).

**Far LOD:** a stick plus a tall ellipsoid `rx 2.4, ry 3.6` at y 6.0, colour #3A5026.

**Do not:**
- scatter it through the upland forest;
- put it above about 550 m or on the dry side;
- give it lehua pompoms or small leaves. It is not ʻōhiʻa lehua.

---

### 4.7 Hau (*Hibiscus tiliaceus*), `hau`. Indigenous or Polynesian introduction (status disputed). Streamed and fixed. Priority 1.

**Silhouette**
- A low, flat-topped, sprawling tangle much wider than tall.
- Crooked limbs arch to the ground, where they take root.
- Bright yellow-green. It forms continuous thickets along streams, estuaries and pond edges.

**Basis:** TTI: "usually the canopy is much wider than the height of the tree", forming "an impenetrable thicket". In Kahana, hau covers old loʻi, the stream and the estuary.

**Dimensions:** 4–7 m tall; 8–12 m wide.

**Recipe**
- **Stems:** 4 crooked limbs splaying out from the base at 20–35°.
  - Each has 2–3 segments and ends 3.5–5 m out and 2.5–4.5 m high.
  - Two of them arch back down to touch the ground 5–6 m out.
  - Radius 0.22 to 0.1, `seg 4`, colour #7E7466 (E).
- **Crown:** 5–6 flat blobs, rx 2.2–2.8 and ry 0.9–1.2, with tops at 3.5–5 m, spread over a 10 m footprint. Colour #6E8A3E (var 0.15).
- **Undersides (optional):** a few pale quads at the crown edge, colour #B8BFA8.
- **Flowers (accent 6):** 16 yellow specks, #F2D53C. Make a quarter of them #D9622E, for flowers fading the same day.

**Colours:** sunlit #8BA94E, shade #2F4419; undersides #B8BFA8; flowers #F2D53C with a maroon eye #6A1E24 (all E).

**Far LOD:** no stick. One flat blob `rx 5.0, ry 2.0` at y 3.0.

**Do not:**
- put it above about 450 m (L&S give about 457 m);
- make it a tall upright tree;
- put it on dry slopes away from water.

---

### 4.8 Hala (*Pandanus tectorius*), `hala`. Indigenous. Streamed (windward lowland) and fixed (shore, kauhale). Priority 1. Rework of the existing model.

**Silhouette**
- A candelabra of forked, leaning stems on a cone of prop roots.
- Each branch ends in a spiral tuft of long, drooping strap leaves.
- Brown dead leaves hang below the tufts; the fruit looks like a pineapple.

**Dimensions:** 5–9 m tall; crown 5–8 m wide. The prop roots spring from the lowest 1–1.5 m.

**Recipe**
- **Prop roots:** 5–6 cylinders from 1.2 m out at ground level to the trunk at y 1.3. Radius 0.08 to 0.11, colour #9A907E.
- **Trunk:** from `(0,1.0,0)` to `(0.3,3.4,0)`, radius 0.22 to 0.18, in 4 short segments that alternate #A9A69C and #8F8B80 (ring scars).
- **Branches:** 2 near-equal forks at y 3.4, 60–80° apart, each forking again at about 5 m. That gives 4–6 tips at y 5.5–7, 1.6–2.8 m out.
- **Tufts:** 10–12 leaves per tip, arranged in a spiral.
  - Each leaf is a 2-segment strap. It rises 0.5 m over its first 0.9 m, then droops to 0.6 m below its base at the tip.
  - Length 1.8–2.2 m, width 0.12 m, made of two quads folded into a V.
  - Colour #5E7E43 (var 0.12), tips #6D914E.
- **Dead leaves:** 3 per tuft, hanging straight down from below it, 1.4 m long, colour #8A6E48.
- **Fruit:** 1 blob of r 0.3 under 2 of the tufts, colour #E8A030 (or #D8582A).

**Colours:** shade #3B5025, mid #6D914E, sunlit #8FB06A, sheen #A8C495 (S); dead leaves #8A6E48 (E); trunk #A9A69C (E).

**Far LOD:** a short stick plus a squat dome `rx 3.6, ry 1.8` at y 6.0, colour #5E7E43.

**Do not:**
- give it a single trunk with a round crown;
- make the leaves fronds. They are long straps;
- put it above about 610 m, or along the dry leeward coast (except planted near houses);
- keep today's brown trunk (#6b5a45). The trunk is light grey.

---

### 4.9 Wiliwili (*Erythrina sandwicensis*), `wiliwili`. Endemic. Streamed. Priority 1.

**Silhouette**
- A short, stout, gnarled trunk with an orange tinge.
- Stiff, near-horizontal branches carry a broad, thin crown that is wider than tall.
- It is deciduous: a bare grey-orange skeleton with orange flowers in kau, and in leaf in hoʻoilo.

**Basis:** L&S describe a "broad thin crown becoming wider than high". It flowers "from early spring to July, while the trees are leafless". CTAHR OF-10 disagrees on the timing; see the sources.

**Dimensions:** 6–9 m tall; crown 8–11 m wide; trunk 0.5–0.8 m across.

**Recipe**
- **Trunk:** from the origin to `(0.3,1.6,0.1)` to `(0,2.6,0.2)`, radius 0.45 to 0.35, `seg 5`. Bark #B07A4A. Sources describe the bark as reddish-brown, grey-white or orange, so this is a compromise.
- **Limbs:** 5 stiff limbs from 2.4–3.0 m, rising 10–25° above horizontal, 3.5–5 m long.
  - Each ends in 2 short horizontal twigs.
  - Radius 0.2 to 0.06, colour #A07050.
- **Leaves (accent 3):** 4 thin blobs, rx 2.4–3.0 and ry 0.7–0.9, at y 4.2–5.2 over the limb ends. Colour #788C4A.
- **Bare twigs:** always present. Thin cylinders and twig cards at the limb ends, so the bare tree reads as a skeleton.
- **Flowers (accent 2):** 30 orange specks, #E07A2E, at the twig tips. Make 5% #E8C83A and 5% salmon.

**Colours:** in leaf, sunlit #8FA65A and shade #3E4F24 (E). Bare and in flower, the crown reads tan-orange-grey #94724F–#AE916B (S). Flowers #E07A2E (E).

**Far LOD:** a short stick (2.6 m) plus two coincident thin flat blobs, `rx 4.8, ry 1.3` at y 4.6:
- one is accent 3, coloured #788C4A (in leaf);
- one is accent 2, coloured #9C7C58 (bare).

Groups 2 and 3 are complementary, so exactly one shows.

**Do not:**
- put it on windward or wet ground, or above about 600 m;
- make it a round ball. Today's tan ball has the colour right for the bare tree but the wrong silhouette;
- plant it as dense forest. It grows in open savanna spacing.

---

### 4.10 Lama (*Diospyros sandwicensis*), `lama`. The dry and mesic forest tree. Endemic. Streamed. Priority 1.

It also stands in for olopua, naio and ʻiliahi.

**Silhouette:** a small, compact, dense, rounded crown of dark glossy leaves on a slender dark trunk. With ʻōhiʻa, it makes up the dark matrix of the dry and mesic forest that survives.

**Basis:** Cuddihy & Stone p. 13 say the remnant dry and mesic lowland forests are dominated by lama or ʻōhiʻa.

**Dimensions:** 6–10 m tall; crown 4–6 m wide.

**Recipe**
- **Trunk:** from the origin to `(0.2,2.8,0.1)`, radius 0.25 to 0.18. Bark #3E3A36, dark (E).
- **Limbs:** 3 short limbs at 45°.
- **Crown:** 4 compact blobs, rx 1.6–2.0 and ry 1.3–1.6, centred at y 4.5–6.5. They overlap densely, with few gaps. Colour #4C5E2E (var 0.15).

**Colours:**
- Lama itself was not sampled; dark glossy green, about #3F5228 (E).
- Naio was sampled: shade #34471B, mid #54692C, lit #738A48 (S).
- The albedo #4C5E2E is a blend of the two.

**ʻIliahi tint (optional, 10% of instances):** multiply by (1.1, 1.0, 1.2) × 1.4. That gives a drooping grey-olive, about #7E8A55 (E).

**Far LOD:** a stick plus 1 blob `rx 2.6, ry 2.0` at y 5.4.

**Do not:** put it in wet windward forest, or make it tall.

---

### 4.11 ʻAʻaliʻi (*Dodonaea viscosa*), `aalii`. Indigenous. Streamed and fixed. Priority 1. Recolour and accent the existing shrub.

**Silhouette**
- A rounded, much-branched shrub 1.5–3 m tall, occasionally a small tree.
- Yellow-green, sticky, shiny leaves.
- Female plants carry papery winged capsules that give the plant a red-bronze cast.

**Recipe**
- 2–3 short stems.
- 3–4 blobs, rx 0.9–1.2 and ry 0.7–0.9, with tops at 1.6–2.4 m. Colour #6F8A4E (var 0.2).
- **Capsules (accent 7):** 20 specks on the crown top: 50% brick #B8443A, 30% maroon #8A2E3A, 20% straw #D8C890.

**Colours:** shade #49693D, mid #6A9757, lit #8BB769 (S).

**Far LOD:** `shrubFar` in colour #6F8A4E.

**Do not:** keep today's tan-brown #8b7c4a, or put it under closed wet forest.

---

### 4.12 Loulu (*Pritchardia* spp.), `loulu`. Endemic fan palm. Fixed, rare. Priority 2.

**Silhouette:** a straight, slender pole topped by a round pom-pom of stiff fan leaves, with a skirt of hanging dead fans. The leaves flash silver when the wind flips them.

**Dimensions:** trunk 5–8 m; crown radius 2–2.5 m.

**Recipe**
- **Trunk:** `cyl` from the origin to `(0,7,0)`, radius 0.18 to 0.15, `seg 6`, in 7 segments alternating #8E8A80 and #77736A (E): grey with ring scars.
- **Fans:** 16–18 leaves.
  - Each has a 0.9 m petiole running out from the top, at elevations spread from −20° to +60°, so the crown forms a ball.
  - The blade is a pleated 6-triangle fan of radius 0.9 m spanning about 140°, with vertex heights alternating ±0.06 m.
  - Colour the upper side #4F6440. On the lower, drooping half of the fans, use the silvery underside #A5B4A6.
- **Dead skirt:** 5 fans hanging against the trunk below the crown, colour #7A6A4E (E).

**Colours:** lit #789360, mid #455838, shade #222C1A; underside #A5B4A6 (S).

**Placement:** fixed. See §5.3.

**Do not:**
- make it a feather palm like niu;
- plant beach groves of it;
- make it common. Lowland loulu forests collapsed around AD 1000–1200. By 1700 they survived mainly on cliffs, ridges and in upper wet forest.

---

### 4.13 Milo (*Thespesia populnea*) and kou (*Cordia subcordata*), `milo` and `kou`. Coastal shade trees. Fixed. Priority 2.

Status differs by source: milo may be a Polynesian introduction or indigenous; kou is indigenous and was also a canoe plant. Build both from one builder with options, as two fixed meshes.

**Silhouette:** a dense, rounded, dark glossy dome on a short trunk, with long, low, near-horizontal lower limbs. A shade tree by the houses and the shore.

**Dimensions:** milo 6–9 m tall and 7–10 m wide; kou up to about 7 m, with a broad crown.

**Recipe**
- **Trunk:** from the origin to `(0.2,2.2,0)`, radius 0.35 to 0.28. Bark #8A8070 (E).
- **Lower limbs:** 3 near-horizontal limbs at 1.8–2.2 m, each 3–4 m long.
- **Crown:** 5 dense blobs.
  - centre: rx 3.0, ry 2.2, at y 4.8;
  - 4 around it: rx 2.2, ry 1.6, at y 3.6–4.4 (a low skirt);
  - colour #4A6426 for milo and #4C6630 for kou (var 0.12).
- **Accents (group 6):**
  - kou: 20 orange specks #F07A1E, plus 10 yellow-leaf specks #D8B83A (its leaves "turn bright yellow … before falling");
  - milo: 12 pale-yellow specks #EDE08A (E).

**Colours:**
- Milo: sunlit #708D3F–#97B05D, mid #445F1E, shade #172B07 (S).
- Kou: sunlit #6F8D45–#98AB5A, mid #455E29, shade #121B0F (S).

**Do not:** put them inland, upland, or in the forest.

---

### 4.14 Existing cultivated models: keep them, with these fixes

| kind | Change | Colours |
|---|---|---|
| `niu` | Leaflets are "shiny yellow green" (L&S). Add 2 dead fronds hanging against the trunk. Keep it slender and leaning: the pre-European variety was slender. Plant it only at villages and beaches. | Leaf albedo #6E7A3E (now #4c7a2c); sunlit #9AA05A and shade #3C4428 (S/E); tips #8F9A43 (keep); dead fronds #7C6440 (E) |
| `ulu` | Coarser crown: 3 bigger blobs, or `smooth=false` facets, to suggest the giant lobed leaves. Add yellow-green fruit specks (#A8C050). Plant only where `r > 0.30` (about 900 mm or more), or in sheltered gulches near villages, below about 300 m. | Albedo #3B5F24; sunlit #5E8A32, shade #1E3510 (E) |
| `maia` | Split each leaf into 2–3 strips: wind shreds them. Add 1–2 dead leaves hanging down. It needs water: loʻi banks, windward villages, gulches, and the forest edge. Not at dry leeward villages. | Leaf #6E9440 (now #6aa538, too bright); lit #949E6B, mid #4E5C3E (S); fresh sunlit #7DA346 (E); dead leaves #8A7048 (E) |
| `ki` | Keep. | #3F7D32 (sunlit #5E9A3A, shade #22401A, E) |
| `kiRed` | **Unverified: check before keeping.** None of the research covered the leaf colour of pre-contact kī. Red-leaved cultivars are often said to have come later. Until a source confirms them, hold `kiRed` to 5% or less, or make it green. | — |
| `naupaka` | Keep. Naupaka kahakai is the dominant strand cover on sand (Cuddihy & Stone p. 7). | #5F8A42; could be lightened to about #78994A (E, not sampled) |

---

## 5. Placement rules

### 5.1 Built once, in the `Vegetation` constructor

```js
import { distanceTransform } from '../gen/grid.js'
import { makeSimplex, smoothstep as sm } from '../gen/noise.js'

const N = HYDRO_RES, cellM = (WORLD / N) * 100       // about 35 m per cell
const H1 = app.island.data.height1024
// topographic position: + ridge or spur, − hollow or valley (metres), on a ring of about 250 m
this.tpi = new Float32Array(N * N)
for (let j = 7; j < N - 7; j++) for (let i = 7; i < N - 7; i++) {
  let s = 0
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4
    s += H1[Math.round(j + 7 * Math.sin(a)) * N + Math.round(i + 7 * Math.cos(a))]
  }
  this.tpi[j * N + i] = H1[j * N + i] - s / 8
}
this.dCult = distanceTransform(N, (c) => this.cleared[c] === 1) // cells; × cellM gives metres
this.groveN = makeSimplex(app.island.meta.seed + 5151)
// tpiAt / dCultAt: nearest-cell lookups like landAt
```

**Constants and helpers**

```js
const R1000 = 0.326, R1075 = 0.346, R1250 = 0.387, R1500 = 0.436, R1900 = 0.500, R2500 = 0.575, R4000 = 0.702, R5000 = 0.763
const OK = (b) => (b ? 1 : 0)
// weighted choice; weights ≤ 0 are skipped; returns null if none are left
const choose = (u, opts) => {
  let t = 0
  for (const [, w] of opts) t += Math.max(0, w)
  if (t <= 0) return null
  u *= t
  for (const [k, w] of opts) if (w > 0 && (u -= w) < 0) return k
  return opts.filter(([, w]) => w > 0).pop()[0]
}
```

`FOREST_KINDS` becomes:

```js
['ohia', 'ohiaKrumm', 'koa', 'kukui', 'ohiaai', 'hau', 'hala', 'wiliwili', 'lama', 'aalii', 'hapuu']
```

`hapuu` gets a near mesh only (on `forestMatDS`).

### 5.2 The streamed forest (`buildTile`, per candidate)

```js
// gates as now
const L = this.landAt(x, z)
if (!L || L.sand > 0.2 || L.field > 0.3 || this.isCleared(x, z)) continue
const m = terrain.metresAt(x, z); if (m < 3) continue
const ny = terrain.normalAt(x, z).y
const H = (k) => hash2(gi, gj, k)
const r = L.rain + (H(3) - 0.5) * 0.12                  // as now
const tpi = this.tpiAt(x, z)
const grove = 0.5 + 0.5 * this.groveN(x * 2.5, z * 2.5)  // patches of about 40 m
const windward = r - (0.22 + 0.00043 * m)
// landform
const floor = sm(0.55, 0.8, L.rip) * sm(0.82, 0.92, ny) * (1 - sm(-5, 15, tpi))   // valley floor
const gulch = Math.max(sm(0.1, 0.3, L.rip) * (1 - floor), sm(25, 60, -tpi))       // gulch, hollow, lower wall
const ridge = sm(20, 60, tpi) * (1 - sm(0.05, 0.2, L.rip))
const steep = 1 - sm(0.55, 0.75, ny)
// the farmed lowland c. 1700: ≥ 460 m altered, untouched only above about 760 m (Kirch, via Cuddihy & Stone)
const cult = 1 - sm(420, 760, m + (H(20) - 0.5) * 120)
// species range limits (sources in §4)
const kuk = OK(m < 670 && r > R1075 && r < R4000 + 0.03) * (1 - sm(450, 670, m)) // kukui fades out by 670 m and 4,000 mm
const hal = OK(m < 610 && (windward > -0.05 || m < 150))                           // hala: windward lowland to 610 m
const ai = OK(m < 550 && r > R1500)                                                // ʻōhiʻa ʻai: moist valleys to 550 m
const hau = OK(m < 450 && L.rip > 0.5)                                             // hau: streams below about 450 m
const kca = OK(m > 250)                                                            // koa: off the coastal plain
const roll = H(13), pick = H(7)
let kind = null, s = 1, tint = null, p = 0, opts = null

if (m > 1150 + 150 * H(21)) {
  // G: cloud forest and summit bogs
  const bog = m > 1350 && ny > 0.97 && r > 0.85
  if (bog) { p = 0.10; opts = [['ohiaKrumm', 1]]; s = 0.3 + 0.15 * H(14) }
  else {
    p = 0.95
    opts = [['ohiaKrumm', 65], ['olapa', 28], ['ohia', 7 * OK(tpi < -20)]]
    s = ridge > 0.5 || steep > 0.5 ? 0.45 + 0.25 * H(14) : 0.8 + 0.35 * H(14)
  }
} else if (r < R1250 && windward < 0.03) {
  // B: leeward dry lowland; trees on rocky ground and in gulches, pili between
  p = (0.07 + 0.35 * gulch + 0.25 * steep) * (1 - L.field)
  opts = m < 600
    ? [['aalii', 35], ['wiliwili', 25 * OK(windward < 0)], ['lama', 25], ['ohiaDry', 15]]
    : [['ohiaDry', 35], ['lama', 35], ['aalii', 20], ['koa', 10 * OK(r > R1000)]]
} else if (cult > H(22)) {
  // D: the farmed lowland (windward, the windward coast, and moist leeward ground below the forest)
  if (floor > 0.5) {
    p = 0.55
    opts = [['ohiaai', 40 * ai * (grove > 0.4 ? 1.5 : 0.3)], ['hau', 30 * hau], ['kukui', 25 * kuk], ['hala', 5 * hal]]
  } else if (gulch > 0.4 || steep > 0.4) {
    p = 0.85
    opts = [['kukui', 70 * kuk], ['hala', 15 * hal], ['ohiaai', 10 * ai], ['lama', 15 * OK(r < R1500)],
            ['ohia', (5 + 45 * (1 - kuk)) * OK(m > 150)], ['ohiaKrumm', 10 * (1 - kuk) * steep]]
  } else {
    p = 0.30 // fallow grass and fern, with groves
    opts = ridge > 0.5
      ? [['ohia', 60 * OK(m > 150)], ['koa', 20 * kca], ['hala', 20 * hal]]
      : [['kukui', 45 * kuk * (grove > 0.4 ? 1 : 0.3)], ['hala', 35 * hal], ['ohiaai', 10 * ai],
         ['hau', 10 * hau], ['ohia', 10 * OK(m > 150)], ['koa', 10 * kca]]
  }
} else if (r < R2500) {
  // C: mesic forest above the farmed band
  p = m < 760 ? 0.55 : 0.85
  opts = [['ohia', 45], ['koa', 30 * OK(m > 300)], ['lama', 15], ['aalii', 5], ['kukui', 10 * kuk * OK(gulch > 0.5)]]
} else if (ridge > 0.5 || steep > 0.5) {
  // F: wet forest, ridges and steep faces: open stunted ʻōhiʻa over uluhe
  p = 0.6; opts = [['ohiaKrumm', 50], ['ohia', 50]]; s = 0.5 + 0.3 * H(14)
} else {
  // F: wet forest, closed canopy
  p = 0.95
  opts = [['ohia', 78], ['koa', 10 * OK(r < R5000 && ny > 0.8)], ['olapa', 10], ['kukui', 2 * kuk * OK(gulch > 0.5)]]
}
if (roll < p) kind = choose(pick, opts)

// pseudo-kinds map onto geometries and tints
if (kind === 'ohiaDry') { kind = 'ohia'; tint = OHIA_DRY; s = 0.55 + 0.3 * H(14) }
else if (kind === 'olapa') { kind = 'ohiaKrumm'; tint = OLAPA; s = Math.max(s, 0.6 + 0.2 * H(14)) }
else if (kind === 'ohia') tint = tint || (r >= R2500 ? OHIA_WET : mixTint(r))
else if (kind === 'ohiaKrumm') tint = OHIA_K
if (kind === 'kukui' && floor > 0.5) s = 1.15 + 0.2 * H(14) // tallest in narrow valleys (L&S)
// pali: keep the current thinning, and swap tall ʻōhiʻa for the stunted form on the steepest ground
if (kind && ny < 0.35 && H(5) < 0.7) kind = null
if (kind === 'ohia' && ny < 0.5) { kind = 'ohiaKrumm'; tint = OHIA_K; s = 0.5 }
if (kind) emit(kind, x, z, s, tint) // tint multiplies the instance colour (§4.0)

// understorey: hāpuʻu between the canopy trees (mesic–wet, 250–1,700 m, out of the farmed band)
if (r >= R1500 && m > 250 && m < 1700 && cult < 0.5 && (kind === 'ohia' || kind === 'koa' || kind === 'ohiaKrumm')) {
  const ph = Math.min(0.65, 0.15 + 0.5 * sm(R1900, R4000, r)) * (1 - 0.7 * ridge) * (m > 1500 ? 0.4 : 1)
  const hx = x + (H(31) - 0.5) * step, hz = z + (H(32) - 0.5) * step
  if (H(30) < ph && !this.isCleared(hx, hz)) emit('hapuu', hx, hz, 0.7 + 0.5 * H(33), null)
}
```

### 5.3 The fixed cultivated planting (`placeFixed`)

`choose()` and `OK()` are the helpers from §5.1. Each `kind` needs a geometry in `this.geoms` and an entry in `KINDS`, so add `ohiaai`, `hau`, `milo`, `kou` and `loulu`.

```js
// around each kauhale (same ring as now, 12–80 m out)
const Lv = this.landAt(v.x, v.z), wetV = !!Lv && Lv.rain > 0.30 // windward or moist village (about 900 mm or more)
// per tree:
const L = this.landAt(x, z)
const kind = L && L.sand > 0.3
  ? choose(rand(), [['niu', 70], ['hala', 15 * OK(wetV)], ['milo', 15 * OK(wetV)], ['kou', 15 * OK(!wetV)]])
  : wetV
    ? choose(rand(), [['niu', 25], ['ulu', 20], ['maia', 15], ['hala', 10], ['kukui', 10], ['milo', 10], ['ohiaai', 5], ['hau', 5]])
    : choose(rand(), [['niu', 35], ['kou', 25], ['milo', 10], ['hala', 5], ['ulu', 5 * OK(L && L.rain > 0.25)], ['aalii', 10], ['ki', 10]])
// kī beside houses: as now (kī planted around dwellings: Handy 1940); kiRed ≤ 5% until verified (§4.14)

// loʻi banks: the current loop, reweighted (kī, maiʻa and kō on terrace banks: Handy; talus gardens: Terry 1988)
//   r < 0.30 maia · < 0.55 ki · < 0.70 kukui (outer bank, as now) · < 0.85 ohiaai (0.1–0.2 units out, toward
//   the valley side, never on a paddy) · < 0.95 ulu (only where L.rain > 0.30) · else hau (only within 0.05
//   units of an ʻauwai or the stream)

// the shore trail (the current loop, retuned)
//   L.sand > 0.4                → naupaka (50%), as now
//   else if L.rain > 0.28       → choose: hala 45, niu 30, milo 15, hau 10 * OK(L.rip > 0.4)   (was L.rain > 0.42)
//   else                        → choose: niu 30 * OK(within 0.6 units of a village), kou 25, aalii 30, naupaka 15

// stream mouths and fishponds: hau thickets (Kahana estuary) and milo at the brackish edges
//   for each pond:   4–8 hau and 2–4 milo along the landward wall, 0.05–0.15 units back from the water
//   for each stream mouth (meta.streams[k].mouth) with L.rain > 0.25: 5–10 hau within 0.3 units, off sand

// the forest margin (wao kanaka): wild maiʻa and kī, ʻamaʻu clearings
//   scan every 0.5 units where 420 < m < 800, r > R1500, not cleared: 4% chance of a cluster of
//   3–6 maia and 2–4 ki within 0.1 units (maiʻa in the upper, partly forested ʻamaʻu zone: Kelly via Cuddihy & Stone;
//   kī "runs wild" at the forest margin: Handy)

// loulu, rare: wet cliffs and ridges, plus a few at the foot of windward sea cliffs
//   scan every 0.25 units: r > 0.55, 300 < m < 900, 0.35 < ny < 0.7 → 3% chance of a cluster of 3–7 within
//   0.15 units (skip ny < 0.3); and m < 80, ny < 0.6, r > 0.30 near the coast → 1%. Target 150–400 in all.
```

---

## 6. Far canopy colours for `terrain.glsl.js`

### 6.1 How the values were derived

- **Each canopy constant is the linear-light average of the albedos of the trees that dominate there,** weighted by the §3 mix. The mixes are in `mix.mjs`.
- **The shader already darkens the canopy by 16%** (`crown` averages 0.84), standing in for a crown's self-shadowing. So the constants equal the tree albedos, with no extra compensation.
- **How to check:** compare `uDebug = 1` (terrain albedo × 2) with `uObjDebug = 1` (object albedo × 3) across the hand-over ring at `FOREST_R` (13.5 units). Then compare lit screenshots at 1.0–1.5 km.
- **Brightness changes mostly in hue.** The wet forest moves from emerald (#265221, luminance 0.063) to olive (#566237, about 0.11). Kukui at #8E8C69 (0.26) is about 3× brighter than the ʻōhiʻa olive in linear terms, which matches the photo ratio.

| Constant | Old | New (sRGB, as in the shader) | Hex | Mix |
|---|---|---|---|---|
| `shrub` (hoʻoilo) | (0.42, 0.45, 0.25) | (0.41, 0.48, 0.28) | #697B48 | ʻaʻaliʻi 35, ʻōhiʻa dry 25, lama 25, wiliwili in leaf 15 |
| `shrub` (kau) | — | (0.44, 0.47, 0.29) | #70784A | the same, with wiliwili bare |
| `mesic` | (0.26, 0.41, 0.17) | (0.37, 0.41, 0.25) | #5D683F | ʻōhiʻa dry 20, ʻōhiʻa wet 25, koa 30, lama 15, ʻaʻaliʻi 10 |
| `wet` | (0.15, 0.32, 0.13) | (0.33, 0.37, 0.21) | #545E36 | ʻōhiʻa wet 78, hāpuʻu 7, koa 5, ʻōlapa 5, uluhe 5 (computed #566237, nudged darker) |
| `cloudF` | (0.17, 0.30, 0.18) | (0.33, 0.38, 0.22) | #546138 | stunted ʻōhiʻa 55, ʻōlapa 25, moss 20 |
| `kukuiC` (replaces the riparian tint) | (0.52, 0.60, 0.42) | (0.56, 0.55, 0.41) | #8E8C69 | kukui 70, floury tops 30 |
| `floorC` (new) | — | (0.33, 0.43, 0.20) | #556E32 | ʻōhiʻa ʻai 60, hau 40 |
| `uluheC` (new) | — | (0.49, 0.62, 0.31) | #7E9F4E | uluhe |
| `bogC` (new) | — | (0.43, 0.44, 0.27) | #6D7146 | sedge 60, moss 25, stunted ʻōhiʻa 15 |
| lehua speck | (0.62, 0.12, 0.08) | (0.72, 0.20, 0.16) | #B8322A | the crimson end of lehua |
| liko tint (new) | — | (0.62, 0.23, 0.17) | #9E3A2C | the red flush |
| `grassDry` (pili) | (0.70, 0.60, 0.38) | keep | #B39961 | Pili dry tussocks sample #A19266–#C7B594 (S) |
| `grassGreen` | (0.47, 0.55, 0.28) | keep; optionally, in hoʻoilo, shift leeward ground 30% toward (0.54, 0.62, 0.50) | #8A9E80 | Pili's "pale bluish-green" (E) |

### 6.2 Code: replaces lines 324–369 (the canopy part of the "vegetation by rainfall" block)

This needs two new shared uniforms, both set from `app.clock.doy`:
- `uKau`: 0 in hoʻoilo, 1 in kau;
- `uLehua`: the same ramp as `uAccent[0]`, normalised to 1 in kau.

```glsl
// canopy albedos, sRGB 0..1 (srgb() linearises): linear mixes of the trees that grow there
vec3 shrub  = srgb(mix(vec3(0.41, 0.48, 0.28), vec3(0.44, 0.47, 0.29), uKau)); // ʻaʻaliʻi, lama, dry ʻōhiʻa, wiliwili (bare in kau)
vec3 mesic  = srgb(vec3(0.37, 0.41, 0.25));   // ʻōhiʻa (partly hairy), koa, lama
vec3 wet    = srgb(vec3(0.33, 0.37, 0.21));   // ʻōhiʻa olive over a little hāpuʻu and ʻōlapa
vec3 cloudF = srgb(vec3(0.33, 0.38, 0.22));   // stunted ʻōhiʻa, ʻōlapa, moss
vec3 kukuiC = srgb(vec3(0.56, 0.55, 0.41));   // kukui's pale silvery grey-green
vec3 floorC = srgb(vec3(0.33, 0.43, 0.20));   // ʻōhiʻa ʻai (near-black green) and hau (bright)
vec3 uluheC = srgb(vec3(0.49, 0.62, 0.31));   // uluhe: matte yellow-green fern
vec3 bogC   = srgb(vec3(0.43, 0.44, 0.27));   // summit bog: sedge, moss, knee-high ʻōhiʻa
// (grassDry, grassGreen, soil, rock, lava, sandC as now)
...
if (steep < 1.0) {
  nMid = fbm2(xz * 2.1 + 5.0);
  vec3 ground = mix(grassDry, grassGreen, smoothstep(0.18, 0.42, r + nMid * 0.08));
  float forest = smoothstep(0.30, 0.52, r + (nMid - 0.5) * 0.2);
  // c. 1700: the lowland below about 460 m was farmed and burned; native forest only above about 760 m
  float cult = 1.0 - smoothstep(420.0, 760.0, metres + (nBig - 0.5) * 120.0);
  float gul = smoothstep(0.08, 0.3, rip);
  float moistLow = cult * smoothstep(0.30, 0.40, r);               // the windward / moist farmed lowland
  forest *= mix(1.0, 0.35 + 0.65 * max(gul, smoothstep(0.2, 0.3, slope)), moistLow); // open fallow on interfluves
  forest = max(forest, gul * 0.45 * (1.0 - smoothstep(0.30, 0.40, r)));              // dry-side gulch woodland
  vec3 canopyC = mix(shrub, mesic, smoothstep(0.36, 0.46, r));
  canopyC = mix(canopyC, wet, smoothstep(0.54, 0.64, r));
  canopyC = mix(canopyC, cloudF, smoothstep(1150.0, 1450.0, metres));

  float crownFade = 1.0 - smoothstep(0.02, 0.07, px);
  if (crownFade > 0.0) {
    vec2 vc = crowns(xz * 6.0);
    float dome = sqrt(max(0.0, 1.0 - vc.x * vc.x * 1.6));
    vec2 toC = (xz * 6.0 - (floor(xz * 6.0) + 0.5));
    float lightSide = dot(normalize(vec3(-toC.x, 0.6, -toC.y)), uSunDir) * 0.5 + 0.5;
    float crown = mix(0.84, (0.62 + 0.45 * dome) * (0.78 + 0.4 * lightSide), crownFade);
    // neighbouring ʻōhiʻa differ from glossy green to hairy grey (TTI): olive-to-grey, not green-to-yellow
    vec3 tint = mix(vec3(0.92, 0.96, 0.90), vec3(1.10, 1.06, 1.00), vc.y);
    canopyC *= mix(vec3(1.0), tint, crownFade * 0.7) * crown;
    // ʻōhiʻa country only: lehua as a sparse speck on some crowns, more in kau; liko flush on others
    float ohiaShare = smoothstep(0.38, 0.5, r) * smoothstep(380.0, 700.0, metres);
    float lehua = step(1.0 - 0.035 * uLehua, hash12(floor(xz * 6.0) + 0.3)) * ohiaShare * crownFade;
    canopyC = mix(canopyC, srgb(vec3(0.72, 0.20, 0.16)), lehua * 0.28 * smoothstep(0.2, 0.6, dome));
    float liko = step(0.9, hash12(floor(xz * 6.0) + 7.1)) * ohiaShare * crownFade;
    canopyC = mix(canopyC, srgb(vec3(0.62, 0.23, 0.17)), liko * 0.15 * smoothstep(0.4, 0.9, dome));
  } else canopyC *= 0.84;

  // kukui: gulches and steep lower slopes of the moist lowland; gone above about 680 m and about 4,000 mm
  float kuk = max(gul * (1.0 - smoothstep(0.55, 0.85, rip)), smoothstep(0.15, 0.3, slope) * step(0.5, nMid))
            * (1.0 - smoothstep(450.0, 680.0, metres)) * smoothstep(0.32, 0.40, r) * (1.0 - smoothstep(0.66, 0.74, r));
  canopyC = mix(canopyC, kukuiC * (0.9 + 0.2 * nMid) * 0.84, kuk * 0.8);
  // valley floors: ʻōhiʻa ʻai groves and hau along the stream (the loʻi themselves are clearings)
  float flo = smoothstep(0.55, 0.85, rip) * (1.0 - smoothstep(0.10, 0.22, slope))
            * (1.0 - smoothstep(450.0, 560.0, metres)) * smoothstep(0.40, 0.46, r);
  canopyC = mix(canopyC, floorC * 0.84, flo * 0.7);

  // grass (as now) ...
  col = mix(ground, canopyC, forest);

  // uluhe: matte yellow-green over wet ridges, slopes and gaps, lowland to low montane
  float ulu = smoothstep(0.55, 0.65, r) * smoothstep(0.10, 0.28, slope) * smoothstep(120.0, 300.0, metres)
            * (1.0 - smoothstep(1000.0, 1300.0, metres)) * smoothstep(0.45, 0.65, nMid);
  col = mix(col, uluheC * (0.85 + 0.3 * gN), ulu * 0.7);
  // summit bogs: flat, very wet ground near the top
  float bog = smoothstep(1320.0, 1420.0, metres) * (1.0 - smoothstep(0.03, 0.08, slope)) * smoothstep(0.80, 0.88, r);
  col = mix(col, bogC * (0.85 + 0.3 * nMid), bog * 0.85);
  // kula field system and bare red earth: as now
}
```

### 6.3 Optional: the steep-ground fern on the windward pali

- Windward pali carry uluhe, ʻamaʻu and stunted ʻōhiʻa (Cuddihy & Stone p. 10; FWS wet-cliff list). Today's velvet (#264F1B–#4A6C2A) is darker and bluer than uluhe.
- Option: lift it to `mix(srgb(vec3(0.26, 0.38, 0.16)), srgb(vec3(0.42, 0.54, 0.24)), grain)`, and keep the darker moss on the rock and in the spray for contrast.
- The headwall and fall look was tuned in earlier rounds. Re-shoot the hero falls before keeping this.

### 6.4 Keeping streamed trees and canopy in agreement

| Region | Streamed trees (§5) | Canopy in the shader (§6.2) |
|---|---|---|
| Dry leeward | density 0.07 open, 0.45 in gulches | `forest` ≈ 0 open, 0.45 · `gul` |
| Windward farmed interfluve | 0.30 | `forest` × 0.35 |
| Windward gulch | 0.85, kukui | `forest` × 1, `kuk` tint |
| Valley floor | 0.55, ʻōhiʻa ʻai and hau | `flo` tint |
| Wet forest | 0.95, ʻōhiʻa | `forest` ≈ 1, `wet` |

**Far LOD colours.** Make each species' far-LOD colour equal the area-weighted average of its near leaf colours:
- ʻōhiʻa #5C603F × instance tint;
- kukui #8E8C69;
- koa #5E6A3C;
- ʻōhiʻa ʻai #3A5026;
- hau #6E8A3E;
- hala #5E7E43;
- wiliwili #788C4A or #9C7C58;
- lama #4C5E2E;
- ʻaʻaliʻi #6F8A4E;
- stunted ʻōhiʻa #596537 × tint.

---

## 7. Tour copy in `content.js`

**No tour text names a tree wrongly.** Two texts are incomplete in ways the research can fix, and two more are worth a caveat. Keep the texts short, as the file header asks.

### 7.1 Recommended

**`nahele`, first paragraph.** The stop stands at about 400 m in a windward valley with about 4,300 mm of rain. There, ʻōhiʻa with hāpuʻu dominates the wet forest (Cuddihy & Stone p. 9; L&S), koa grows where the ground drains well (TTI koa: mixed forest "where ʻōhiʻa predominates"), and the planted kukui and mountain apple of the valley below are what the user asked about.

- Current: "Below the clouds grow koa and ʻōhiʻa. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, …"
- Proposed: "Below the clouds grows the forest of ʻōhiʻa lehua, with hāpuʻu tree ferns beneath and koa where the ground drains well. In the valley below, kukui and ʻōhiʻa ʻai (mountain apple) mark land people planted. A kahuna kālai waʻa, a master canoe builder, chose a koa tree here, …" (the rest unchanged)

**`akua`, second paragraph.** Summit cloud forest on islands like this is low, wind-stunted ʻōhiʻa with ʻōlapa, "abundant epiphytes (particularly mosses and liverworts)" (Cuddihy & Stone p. 9).

- Current: "… mist and rain combed from the clouds by mossy ʻōhiʻa forest feed every spring and stream below."
- Proposed: "… mist and rain combed from the clouds by low, mossy ʻōhiʻa and ʻōlapa forest feed every spring and stream below."

### 7.2 Optional

- **`kauhale`.** Pili was the first choice for thatch, but where it was scarce people used lau hala, kō leaves, ʻamaʻu or kī (Handy 1940; Cuddihy & Stone ch. 8).
  - Current: "… thatched with pili grass, on a raised stone paepae."
  - Proposed: "… thatched with pili grass (in wetter places, lau hala or kī leaves), on a raised stone paepae."
- **`kula`**, add one sentence: "Between the fields, pili grass is kept open by fire and cut for thatch; wiliwili and ʻaʻaliʻi hold the rocky gulches." (Cuddihy & Stone ch. 7–8; NRCS.)
- **`loi`**, add one sentence: "Kī, maiʻa and kō grow on the banks." (Handy 1940.)
- **`surf`**: keep as is. Wiliwili was used for surfboards and ama floats (NPH).
- **Zone order (not about trees).** Malo, Kamakau and the NPS place wao akua below the wet maʻukele forest and just above wao kanaka. The app follows a simplified modern scheme (Minerbi) that puts a cloud-forest wao akua at the top. If you want to acknowledge this, the `akua` text could open with "In one widely taught scheme, …".

### 7.3 Code comments to fix alongside

- **`vegetation.js` header:** "The native forest is too big for that" should become "The wild forest is too big for that". Kukui and ʻōhiʻa ʻai are Polynesian introductions that went wild.
- **The `broadleaf()` lehua comment:** replace it with the speck approach.
- **`terrain.glsl.js`:** "riparian strips: kukui's pale silvery green along the gulches" becomes the `kuk` and `flo` rules.

---

## 8. Open points and confidence

- **High confidence:**
  - the ʻōhiʻa habitat statements;
  - the 1700 lowland land use (Cuddihy & Stone, Kirch);
  - no subalpine zone at 1,660 m;
  - the kukui, hala, ʻōhiʻa ʻai and hau ranges (L&S).
- **Medium confidence:**
  - Kukui statistics (Lincoln et al. 2020) include spread after contact.
  - The trade-wind inversion height is given as 1,525–2,135 m by Cuddihy & Stone but about 2,200 m by the Rainfall Atlas. The island sits below both.
  - L&S's Waiʻaleʻale figure of 11,684 mm is an old gauge value. The 2011 Atlas maximum is 10,271 mm.
  - The USFWS genus lists are partial (unit-specific).
  - L&S's Hāna-road and Nā Pali observations describe the 20th-century "guava type", so do not use them as a pre-contact template.
- **Low confidence:** that native forest on pre-human valley floors was riparian rather than ʻōhiʻa. This is an inference consistent with USNVC G398 (seen only through a search index) and with the Kahana zonation.
- **Disputed:**
  - wiliwili's leafless season (L&S and NPH versus CTAHR OF-10);
  - wiliwili bark colour;
  - the native status of hau, milo, niu, kou and pili. Placement is unaffected.
- **Estimated, not sampled:** ʻōlapa, lama, naupaka and bog colours, and all accent colours marked (E).
- **Unverified:** whether red-leaved kī existed before contact (`kiRed`).
- **Could not be checked:** Gon's Kohala coast-to-summit progression (the site was down). Its general shape matches Cuddihy & Stone.

---

## 9. Sources

### Primary botanical references

- **Little, E. L. & Skolmen, R. G. (1989).** *Common Forest Trees of Hawaii.* USDA Agriculture Handbook 679.
  - Full text: https://www.fs.usda.gov/psw/publications/documents/misc/ah679.pdf
  - Species PDFs: https://www3.ctahr.hawaii.edu/gsp/doc/Forestry/Little_Skolmen_CFT/, including `CFT_Metrosideros_polymorpha.pdf`, `CFT_Eugenia_malaccensis.pdf`, `CFT_Acacia_koa.pdf`, `CFT_Aleurites_moluccana.pdf`, `CFT_Pandanus_tectorius.pdf`, `CFT_Hibiscus_tiliaceus.pdf`, `CFT_Erythrina_sandwicensis.pdf`, `CFT_Cibotium_chamissoi.pdf`, `CFT_Pritchardia_spp.pdf`, `CFT_Sophora_chrysophylla.pdf`, `CFT_Cocos_nucifera.pdf`, `CFT_Artocarpus_altilis.pdf`, `CFT_Cordyline_fruticosa.pdf`, `CFT_Thespesia_populnea.pdf` and `CFT_Cordia_subcordata.pdf`.
  - Text mirror: https://hawaii.wildflowersearch.org/forest/
- **Cuddihy, L. W. & Stone, C. P. (1990).** *Alteration of Native Hawaiian Vegetation.* UH CPSU / NPS.
  - Ch. 7, vegetation zones: https://pcsuhawaii.org/files/book/1990_chap/07.pdf
  - Ch. 8, aboriginal effects: https://pcsuhawaii.org/files/book/1990_chap/08.pdf
  - Ch. 15, summary: https://pcsuhawaii.org/files/book/1990_chap/15.pdf

### Species profiles and plant databases

- **Traditional Tree Initiative profiles** (agroforestry.org):
  - Friday & Herbert 2006, ʻōhiʻa: https://agroforestry.org/images/pdfs/Metrosideros-ohia.pdf
  - koa: https://agroforestry.org/images/pdfs/Acacia-koa.pdf
  - kukui: https://agroforestry.org/images/pdfs/Aleurites-kukui.pdf
  - Malay apple: https://agroforestry.org/images/pdfs/Syzygium-Malayapple.pdf
  - hau: https://agroforestry.org/images/pdfs/H.tiliaceus-beach-hibiscus.pdf
  - pandanus: https://agroforestry.org/images/pdfs/P.tectorius-pandanus.pdf
  - breadfruit: https://agroforestry.org/images/pdfs/A.altilis-breadfruit.pdf
  - sandalwood: https://agroforestry.org/images/pdfs/Santalum-Haw-sandalwood.pdf
  - coral tree: https://agroforestry.org/images/pdfs/Erythrina-coraltree.pdf
  - banana: https://agroforestry.org/images/pdfs/Musa-banana-plantain.pdf
  - banana overview: https://agroforestry.org/images/pdfs/Banana-plantain-overview.pdf
  - milo: https://agroforestry.org/images/pdfs/Thespesia-milo.pdf
  - kou: https://agroforestry.org/images/pdfs/Cordia-kou.pdf
  - coconut: https://agroforestry.org/images/pdfs/Cocos-coconut.pdf
- **Native Plants Hawaiʻi (UH)**, https://nativeplants.hawaii.edu/plants/ (pages listed by slug):
  - metrosideros-polymorpha, syzygium-sandwicense, acacia-koa;
  - cibotium-glaucum, cibotium-menziesii, cibotium-chamissoi;
  - erythrina-sandwicensis, dodonaea-viscosa, diospyros-sandwicensis;
  - myoporum-sandwicense, santalum-ellipticum, sophora-chrysophylla;
  - pritchardia-martii, pritchardia-hillebrandii;
  - pandanus-tectorius, thespesia-populnea, cordia-subcordata, cocos-nucifera;
  - heteropogon-contortus, pisonia-umbellifera, pipturus-albidus, sadleria-cyatheoides.
- **Allen, J. A.** *Metrosideros polymorpha.* USDA FS Tropical Tree Seed Manual: https://npn.rngr.net/publications/ttsm/species/PDF.2004-03-15.2731/at_download/file
- **CTAHR OF-10, Wiliwili** (Rauch & Hensley 1997): https://www.ctahr.hawaii.edu/oc/freepubs/pdf/OF-10.pdf
- **NRCS / CTAHR, Kahoʻolawe Germplasm piligrass:** https://www.nrcs.usda.gov/plantmaterials/hipmcrn14338.pdf
- **DLNR DOFAW:** uluhe https://dlnr.hawaii.gov/forestry/plants/uluhe/ and hāpuʻu https://dlnr.hawaii.gov/forestry/plants/hapuu/
- **Bishop Museum HBS, uluhe:** https://hbs.bishopmuseum.org/good-bad/uluhe.html
- **Pukui & Elbert, "ʻōhiʻa"**, via Wehewehe: https://wehe.hilo.hawaii.edu/?q=%CA%BB%C5%8Dhi%CA%BBa

### Ecology and genetics

- **Stacy, E. A. et al. (2014).** *Heredity* 113: 334: https://pmc.ncbi.nlm.nih.gov/articles/PMC4181069/
- **Stacy, E. A. et al. (2016).** https://pmc.ncbi.nlm.nih.gov/articles/PMC4981685
- **Jacobi, J. D. et al. (2024).** ʻŌhiʻa lehua, USGS / *Pacific Science*: https://www.usgs.gov/publications/ohia-lehua-metrosideros-polymorpha-a-most-resilient-and-persistent-foundation-species
- **USFS FEIS, Hawaiʻi fire regimes** (Abrahamson 2013): https://www.fs.usda.gov/database/feis/fire_regimes/Hawaii/all.html
- **USFWS (2012).** 77 FR 34464, Maui Nui proposed rule (ecosystem definitions): https://www.govinfo.gov/content/pkg/FR-2012-06-11/html/2012-11484.htm
- **USNVC G398,** *Pipturus–Pisonia–Charpentiera* riparian forest and scrub: https://www1.usgs.gov/csas/nvcs/unitDetails/860726 (seen only through the search index)
- **Mueller-Dombois, D. & Wirawan, N. (2005).** Kahana Valley, *Pacific Science* 59: 293: https://scholarspace.manoa.hawaii.edu/server/api/core/bitstreams/47ce3a4e-b644-401a-80db-fd738a16f3e5/content
- **Lincoln, N., Zhang, Q. & Chen, Q. (2020).** "State of the State Tree" (kukui), *Pacific Science* 74(4): https://par.nsf.gov/servlets/purl/10221587
- **Follett, P. A. et al. (2003).** Uluhe, *Pacific Science* 57(4): https://scholarspace.manoa.hawaii.edu/items/982abb35-b418-4d31-b50f-51f1644054d7

### Land use and history

- **Terry, J. P. (1988).** Kohala windward valleys (LSU dissertation): https://repository.lsu.edu/gradschool_disstheses/4543
- **Handy, E. S. C. (1940).** *The Hawaiian Planter*, Bishop Museum Bulletin 161: https://hbs.bishopmuseum.org/pubs-online/pdf/bull161.pdf
- **Malo, D.** *Hawaiian Antiquities* (Emerson translation), Bishop Museum SP2: https://hbs.bishopmuseum.org/pubs-online/pdf/sp2.pdf
- **Athens, J. S. et al. (2002).** ʻEwa Plains: https://www.drylandforest.org/wp-content/uploads/2019/01/Athens_et_al_2002_Arch_EwaPlains.pdf
- **Lee & Lincoln (2023).** *Ecology & Society* 28(4): 21: https://www.ecologyandsociety.org/vol28/iss4/art21
- **Rainfall Atlas of Hawaiʻi:** https://rainfall.geography.hawaii.edu/

### From this repo

- `packages/ahupuaa/src/gen/island.js` (shield heights)
- `src/gen/climate.js` (LCL 650 m, inversion 2,100 m)
- `src/gen/maps.js` (zones)
- `src/gen/sites.js` (field mask)
- `src/app.js` (`makeLandTexture`)
- `src/features/vegetation.js`
- `src/features/kit.js`
- `src/render/shaders/terrain.glsl.js`
- `src/ui/content.js`
- `src/ui/views.js` (stop placement)
