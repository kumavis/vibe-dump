# 03 — Vessel form (3D geometry) and piece-mould foundry consequences

Late Shang, Anyang / Yinxu period (Yinxu II–IV, c. 1250–1046 BC; the bulk of the
"classic" taotie bronzes are Yinxu II–III, 13th–12th c. BC).

Audience: engineers writing the three.js generators. Conventions used everywhere below:

- **Units**: real sizes in cm (mm for thicknesses); profiles normalised so that
  **total height H = 1.0** (excluding handles/posts unless stated) and **radius r**
  is also in units of H. Multiply by a real height (e.g. 0.28 m for a gu) to build.
- **Lathed profiles** are listed bottom → top as `(r, y)` control points on the
  *outer* surface. Each point has a join flag:
  - `C` = **sharp carination / step** (a crease: duplicate the vertex, split normals;
    also usually a **register boundary** and a horizontal mould break),
  - `S` = smooth (Catmull-Rom / Bézier through it),
  - `L` = lip/rim detail point.
- **Certainty tags**: `[firm]` = published, widely repeated figure; `[approx]` =
  my reading of typical examples, good to ±10–15 %; `[uncertain]` = plausible but
  not verified — treat as a tunable default.
- Met accession numbers and dimensions below were checked against the Met
  Collection API (Nov 2026). Other figures are from the standard literature
  (see source list) and memory, tagged accordingly.

---

## 0. Global rules that apply to every type

1. **Everything is designed around the piece mould.** The surface is divided into
   *sectors* (vertical mould sections, 2/3/4/8 around) and *registers* (horizontal
   bands). Décor is a 2D panel per sector×register. Flanges sit on vertical
   section boundaries and/or on the symmetry axis of a taotie face. This is the
   single most important structural rule for the kit (see §3, §6).
2. **Symmetry**: round vessels are 3-fold (tripods: ding, jia, jue-legs, li-ding),
   or 4-fold (gu, zun, pou, lei, gui with flanges), occasionally 2-fold (you, hu
   oval bodies, gui without flanges = 2 taotie). Box (fang) vessels are 4-sided
   with mirror symmetry on each face.
3. **Wall thickness** `[approx]`: ordinary Anyang vessels 2–5 mm in the walls,
   3–8 mm at rims (rims are thickened), feet/ring-feet 2–4 mm, solid legs of small
   tripods 8–20 mm diameter solid. Large (>50 cm) vessels 6–15 mm. The Houmuwu
   ding is far thicker (walls reported in the several-cm range `[uncertain]`).
   Wall is **not** uniform: the décor is cast in relief on the *outside* while the
   *inside* is smooth (core surface), so wall = base wall + local relief height.
   Model: `inner = smooth offset of outer base surface`, relief added outside only.
4. **Relief heights** `[approx]` (for displacement scale, at real size):
   - fine ground spirals (leiwen 雷纹): 0.2–0.6 mm deep grooves, 1.5–3 mm pitch;
   - main taotie elements in "Loehr Style V" (classic Anyang): raised 1–5 mm above
     ground, flat-topped with incised secondary spirals on top;
   - high-relief horns / animal heads at shoulders: 10–40 mm;
   - flanges: projection 5–15 mm (vessels 20–40 cm), up to 25–40 mm on large
     fang vessels; thickness 3–8 mm.
5. **Rims are level in design** but cast slightly out of level (see §5).
6. **Bases**: round tripods have shallow **convex-down** bellies (sagging round
   bottom); jue/jia bottoms round (early) or flat-ish (later); fang vessels flat
   floors; vessels on ring feet have a slightly convex floor visible inside.

---

## 1. Geometry recipes by type

### 1.1 Fangding 方鼎 (rectangular cauldron, 4 legs, 2 upright handles)

```
        ||                ||          <- li er 立耳 handles (rise from rim, on SHORT sides)
   _____||________________||_____     <- thickened, everted flat rim (rim overhang)
   \  |  :  [taotie]  :  |   /        <- body: inverted truncated pyramid, slight taper
    \ |  :  [taotie]  :  |  /            corner flanges + mid-face flanges
     \|__:____________:__|_/          <- flat floor
      ||                ||
      ||  (legs)        ||           <- columnar legs, slight entasis, taotie mask at top
      ||                ||
     /__\              /__\          <- slight foot swelling / flat foot
```

| Parameter | Value | Notes |
|---|---|---|
| Plan aspect (long:short) at rim | 1.33–1.45 : 1 | Houmuwu 110×79 → 1.39 `[firm]`; Si Mu Xin 64×48 → 1.33 `[firm]` |
| Body (box) height / total H | 0.40–0.48 | `[approx]` |
| Leg height (floor to ground) / total H | 0.30–0.38 | `[approx]` |
| Handle height above rim / total H | 0.16–0.22 | Handles counted in total H for Houmuwu (133 cm incl. handles) |
| Wall taper | 3–7° inward from vertical going down (box narrower at floor) | floor ≈ 0.85–0.92 × rim dims `[approx]` |
| Rim | flat, thickened square section, everted 2–5 % of width (overhang), top flat | rim thickness ≈ 2–3× wall |
| Corners | **sharp arris covered by a full-height flange** (classic Anyang) | early/Erligang fangding: rounded corners, no flange |
| Floor | flat; underside flat with mould seams; legs join at corners | |
| Legs | 4, columnar, circular section, diameter ≈ 0.10–0.14 × rim long side; slight entasis (max dia at ~0.7 of leg height from ground, +3–6 %) then a slight swelling foot; taotie mask in relief on upper 1/3 of the leg, with a flange down the outward-facing axis (on the diagonal) | large legs **hollow** with core open at the top/underside `[approx]`; small legs solid |
| Handles | 2, on the **short** sides, rising from the rim top, set slightly inboard of rim outer edge; inverted-U loop; outward lean 3–8°; section rectangular, outer face often with a groove (channelled) or relief (Houmuwu handles carry tigers flanking a human head on outer edge) | handle width ≈ 0.30–0.40 × short side; aperture ≈ 0.55 × handle width |

Décor layout on each face (classic Anyang): a **frame** — a band of décor along top
and both sides of each face (often rows of bosses/nipples 乳钉 in a U-frame on
Erligang/early Anyang fangding; on Houmuwu a border band of kui dragons framing a
plain central field `[firm]`), or a **single large taotie** centred on the face with
the mid-face flange as its nose ridge (Si Mu Xin type: taotie on upper band,
plain or bossed field below `[approx]`).

Named examples:
- **Houmuwu ding 后母戊鼎** (formerly read Simuwu), Wuguancun, Anyang, found 1939;
  National Museum of China. H 133 cm (with handles), rim 110 × 79 cm (often given
  112 × 79.2), 832.84 kg (older figure 875 kg) `[firm]`. Body cast in one with
  legs; handles reportedly cast on afterwards; one handle is a modern restoration
  `[approx — the restoration is well documented, the cast-on sequence is the
  usual reading]`. Inscription 后母戊 cast on interior wall `[firm]`.
- **Si Mu Xin fangding 司母辛方鼎** pair, Fu Hao tomb (Yinxu M5), c. 1200 BC.
  H 80.1 cm, rim 64 × 48 cm, ~117.5 kg (one of pair) `[firm-ish]`.
- **Fu Hao fangding** (inscribed 妇好), smaller pairs ~42 cm `[uncertain]`.
- **Niu fangding / Lu fangding 牛方鼎/鹿方鼎** from HPKM 1004, Xibeigang (Academia
  Sinica, Taipei): bovine and deer heads as mid-face reliefs; ~73 cm / ~60 cm
  `[approx]`.

### 1.2 Round ding 圆鼎 and li-ding 鬲鼎 (lobed)

Round ding profile (Anyang, deep-bellied, columnar legs). Bowl is a lathe; legs and
handles are separate parts.

```
   ||          ||
  _||__________||_      rim: thickened, slightly everted, flat top
  \              /      upper body: décor band (3 taotie, flanges)
   \            /
    \__________/        round convex bottom
     |   |    |         3 columnar legs, slight entasis
     |   |    |
```

| # | r | y | join | note |
|---|---|---|---|---|
| 0 | 0.00 | 0.40 | S | centre of convex bottom (bottom sag ~0.04 H) |
| 1 | 0.22 | 0.42 | S | |
| 2 | 0.36 | 0.48 | S | lower belly, where legs attach (leg tops at r≈0.30–0.34) |
| 3 | 0.43 | 0.62 | S | max diameter (usually just below décor band) |
| 4 | 0.44 | 0.76 | C | **lower edge of décor band** (often a small step/fillet) |
| 5 | 0.45 | 0.94 | S | upper body, near-vertical, slight flare |
| 6 | 0.47 | 0.98 | L | neck under rim (often slight constriction) |
| 7 | 0.49 | 1.00 | L | rim outer edge, flat top, rim width ≈ 0.025 |

- Legs: 3, at 120°, height ≈ 0.38–0.45 H (floor-to-ground), diameter ≈ 0.08–0.10 H,
  slight outward splay 2–5°. Late Anyang (Yinxu III–IV) legs taller and thinner;
  Yinxu II legs stout, sometimes with taotie mask at the top.
- Handles: 2, on the rim on a diameter, so one handle is **above a leg** and the other is
  **between the other two legs**. This "one-over-a-leg" arrangement is the classic
  Shang/Western Zhou tripod rule `[firm — often noted as a diagnostic]`; it makes
  the vessel visually asymmetric front-to-back. Handle height ≈ 0.18–0.22 H.
- Décor: 3 taotie in the upper band, each **centred over a leg**, flange (or nose
  ridge) on that axis `[approx — the common Anyang arrangement]`; a second
  register of hanging blades (蕉叶) or a plain belly is common; small tripods have
  just one band.
- Proportions: total H (with handles) : rim diameter ≈ 1.15–1.35 : 1.
- Example: **Met 49.135.10** ritual tripod cauldron (Ding), 12th–11th c. BC: H incl.
  handles 25.4 cm, H 20 cm, diam 21.6 cm, rim 20 cm `[firm, Met API]`.

**Li-ding 鬲鼎 / fendang ding 分裆鼎** (lobed): the bowl is three lobes, each lobe a
bag that tapers down into a leg; the crotch between lobes is a sharp groove
(fendang). Build as **3 lobes**: for each lobe, a lathe-like surface around the
leg axis (axis offset from centre by ≈ 0.22 rim radius, tilted 5–8° outward),
blended into a common cylindrical neck. Each lobe carries **one taotie centred on
the lobe**, its nose flange running down into the leg. Legs short columnar
(≈ 0.20–0.25 H) under the lobe. Neck: straight, ≈ 0.18 H, with a narrow kui
band. `[approx]`

### 1.3 Gu 觚 (trumpet beaker)

Three sections: flaring trumpet mouth, slim waist/middle section, flared foot.
Anyang gu are **slender**: H / rim diameter ≈ 1.6–2.0.

```
 \_________________/   rim (thin, slightly thickened lip)
  \               /    trumpet: rising blades 蕉叶 + snakes/kui at base
   \             /
    \___________/
     |  :   :  |  C    waist band: 2 taotie, 4 flanges, 2 raised bowstring rings
     |__:___:__|  C    (fillet rings at both ends of the middle section)
     /  :   :  \       foot: 2 taotie, 4 flanges, cruciform holes at top
    /___:___:___\      vertical foot rim (short cylindrical step)
```

| # | r | y | join | note |
|---|---|---|---|---|
| 0 | 0.150 | 0.000 | C | foot bottom edge |
| 1 | 0.150 | 0.020 | C | top of vertical foot "step" (low cylindrical base band 0.02–0.04) |
| 2 | 0.120 | 0.110 | S | foot flare (concave) |
| 3 | 0.085 | 0.255 | C | foot top; **cruciform holes** at y≈0.24, 2 (or 4) |
| 4 | 0.085 | 0.270 | C | raised ring (弦纹) ×2 |
| 5 | 0.082 | 0.300 | S | middle section bottom, slight bulge |
| 6 | 0.088 | 0.380 | S | middle section max (slight swelling, Yinxu II) |
| 7 | 0.080 | 0.450 | C | middle section top; raised rings ×2 |
| 8 | 0.075 | 0.480 | S | waist minimum |
| 9 | 0.150 | 0.780 | S | trumpet (concave flare) |
| 10 | 0.270 | 0.980 | S | |
| 11 | 0.285 | 1.000 | L | rim, lip ~1.5–2× wall |

- Flanges: 4 on middle and foot (at 0°, 90°, 180°, 270°), aligned with mould seams;
  the trumpet usually has none, or later gu (Yinxu III) have flanges continuing
  up the trumpet between blades. Flange projection 4–10 mm at real size.
- Cruciform openings: 2 opposing (sometimes 4), at the top of the foot, cross arms
  ≈ 0.04 H long, 2–3 mm wide, **on the flange/seam axis or midway — vary by
  example; default: on the axis perpendicular to the seams** `[uncertain]`. They
  are through-holes into the hollow foot (core-support voids, §3).
- Inside: the cup is a deep cylinder bored into the middle section; its floor
  sits around y ≈ 0.30–0.35 (the foot is hollow below, separated by a solid
  diaphragm). The underside view up the foot shows the floor; **inscriptions are
  often cast on the inner foot wall or the underside of that diaphragm** `[approx]`.
- Examples `[firm, Met API]`: **Met 49.135.11** gu, 13th c. BC: H 26.4, rim 15.2,
  foot 7.9 cm. **Met 1978.526.1**: H 28.3, rim 14.9, foot 8.6. **Met 1985.214.4**:
  H 31.1, diam 17.0. Fu Hao tomb: 53 gu `[approx count]`, typical H 26–32 cm.

### 1.4 Jue 爵 (tripod pouring cup)

Not lathe-symmetric. Build from an oval-ish lathe body + lofted spout/tail.

```
   post  post                         2 posts with mushroom/umbrella caps
   T     T                            at the spout root
 ___|___|_______
 \  spout      /  tail \               rim: long spout (流) one end, pointed tail (尾)
  \_____________________/
    | body |=handle                   deep cylindrical-ovoid body, round bottom
    |______|                          handle (鋬) on one side, 90° from spout axis
    /  |   \                          3 blade legs (triangular section), splayed
```

| Parameter | Value |
|---|---|
| Total H (ground to rim/tail top; posts excluded) | 18–25 cm typical; posts add 2–4 cm |
| Body (cup) | near-cylindrical, slight belly, diameter ≈ 0.30–0.35 H, depth ≈ 0.40 H; Anyang bottoms **round**, earlier flat `[approx]` |
| Rim length (spout tip → tail tip) | ≈ 0.85–1.0 × H |
| Spout | long U-section channel, ≈ 0.35 rim length, rising 10–15° |
| Tail | pointed, triangular, shorter (≈ 0.25 rim length), rising 15–20° |
| Posts (柱) | 2, standing on the rim at the spout root (one each side of spout), H ≈ 0.12–0.18 total H; stem round/rectangular; caps "mushroom" or "umbrella" with whorl (涡纹) on top, cap dia ≈ 2–2.5× stem |
| Handle | vertical loop on body, perpendicular to spout axis, opposite a leg; often animal-head at top |
| Legs | 3, **triangular (blade) section**, outer face sharp edge, splay outward 10–20°, length ≈ 0.40–0.45 H; one leg under the handle, two under the spout side |
| Décor | 1–2 bands on body: taotie centred **opposite the handle** and a second half-taotie arrangement; 2–3 short flanges on body (one under spout axis, one under tail) |

- Inscription location: on the body wall **inside the handle** (behind the
  handle) is the classic place `[firm]`; or on a post.
- Mould: three vertical sections running down the three legs; base piece.
- Example: Met 12.134.32 jue, Shang, H 11.4, L 17.8 cm (small) `[firm, Met API]`.
  Fu Hao tomb: ~40 jue `[approx]`.

### 1.5 Jia 斝 (tripod / tetrapod wine warmer)

Like a big jue without spout/tail: wide flared mouth, two capped posts, handle,
3 (round jia) or 4 (fangjia) legs.

Round jia (Anyang "fen-duan" two-register body):

| # | r | y | join | note |
|---|---|---|---|---|
| 0 | 0.00 | 0.36 | S | bottom centre (round, sag 0.03) |
| 1 | 0.26 | 0.40 | S | |
| 2 | 0.30 | 0.50 | S | lower belly max |
| 3 | 0.28 | 0.58 | C | **carination** between lower belly and upper neck |
| 4 | 0.27 | 0.62 | S | waist |
| 5 | 0.31 | 0.88 | S | flaring neck |
| 6 | 0.34 | 0.94 | L | rim, posts stand here |

- Posts: 2, standing on the rim symmetrically about the handle plane, on the side
  away from the handle, ~70–110° apart `[approx / uncertain spacing]`. Posts tall: 0.15–0.25 H, caps
  umbrella/conical; total height with posts ≈ 1.2 H.
- Legs: 3 (T-section or triangular-blade or columnar in late Anyang), H ≈ 0.36,
  splay 5–12°. Handle above one leg.
- Real sizes: 25–45 cm; Met 24.72.7 (Western Zhou, Duanfang altar set) H to posts
  33 cm, for comparison `[firm, Met API]`.

**Fangjia 方斝**: rectangular body in two registers (lower bulging box, upper
flaring box), 4 legs (blade or columnar), flanges at all corners and face
midlines, hipped-roof lid on some (Fu Hao fangjia) `[uncertain on lid detail]`.
Fu Hao fangjia ~ 66 cm H `[uncertain]`.

### 1.6 Zun 尊 (round and square)

**Round "trumpet" zun (觚形尊)** — a stout gu: 3 sections, H / rim dia ≈ 1.1–1.3.

| # | r | y | join | note |
|---|---|---|---|---|
| 0 | 0.24 | 0.00 | C | foot edge |
| 1 | 0.24 | 0.03 | C | foot step |
| 2 | 0.20 | 0.12 | S | foot flare |
| 3 | 0.17 | 0.26 | C | foot top, cruciform holes ×2–4, raised rings |
| 4 | 0.21 | 0.40 | S | **belly**, bulging middle section, 2 taotie, 4 flanges |
| 5 | 0.18 | 0.52 | C | belly top, raised rings |
| 6 | 0.17 | 0.56 | S | waist |
| 7 | 0.38 | 0.97 | S | trumpet, rising blades |
| 8 | 0.40 | 1.00 | L | rim |

**Shouldered round zun (有肩尊)** — wide mouth, horizontal shoulder with 3 animal
heads in high relief, bulging belly, high ring foot:

| # | r | y | join | note |
|---|---|---|---|---|
| 0 | 0.30 | 0.00 | C | foot edge |
| 1 | 0.29 | 0.16 | C | foot top (cruciform holes, 3) |
| 2 | 0.40 | 0.32 | S | belly |
| 3 | 0.45 | 0.55 | S | belly max |
| 4 | 0.44 | 0.62 | C | **shoulder carination** |
| 5 | 0.30 | 0.68 | C | shoulder-to-neck join (shoulder slopes 15–25°) |
| 6 | 0.28 | 0.72 | S | neck base |
| 7 | 0.40 | 1.00 | L | flared mouth |

Animal heads (bovine/ram) on shoulder: 3 (tripartite flange layout) or 4; each
centred on a flange axis, projecting 0.06–0.10 H.

**Fangzun 方尊**: square-section version of the shouldered zun. Plan square
(1:1). Sections: flaring square mouth (trumpet with flat faces, the faces curve in
profile while corners are arrises), square shoulder with **animal heads at the
4 shoulder midlines and/or rising from the 4 corners** (Siyang fangzun: 4 rams at
the corners, their bodies forming the belly corners), square belly, square ring
foot. Flanges at all 4 corners and 4 face midlines, running continuously across
foot, belly and neck with gaps at the shoulder. Proportion H : rim side ≈ 1.1.
- Example: **Siyang fangzun 四羊方尊** (Ningxiang, Hunan — southern, contemporary,
  not Anyang): H 58.3 cm, rim side 52.4 cm, 34.5 kg `[firm]`.
- Met **1985.214.6** zun, 13th–10th c. BC, H 24.4, D 19.5 `[firm, Met API]`.

### 1.7 Lei 罍 and fanglei 方罍

Round lei: tall jar, narrow neck, high broad shoulder, tapering body, short ring
foot. Two loop handles on the shoulder (often animal heads with rings), plus a
**third lug low on one side** (at ~0.25 H) for tipping.

| # | r | y | join | note |
|---|---|---|---|---|
| 0 | 0.24 | 0.00 | C | foot edge |
| 1 | 0.24 | 0.05 | C | foot top (short ring foot, small cruciform holes or none) |
| 2 | 0.25 | 0.07 | C | body base |
| 3 | 0.38 | 0.45 | S | body tapering outwards |
| 4 | 0.42 | 0.68 | C | **shoulder carination** (sharp on Anyang lei) |
| 5 | 0.22 | 0.82 | C | shoulder-neck join (shoulder slopes ~25°) |
| 6 | 0.19 | 0.92 | S | neck |
| 7 | 0.22 | 1.00 | L | everted rim |

- Shoulder handles at 90° to the low lug. Six whorl bosses (圆涡纹) on the
  shoulder alternating with handles/heads is a common Anyang lei shoulder `[approx]`.
- Met **59.194** lei, 12th–10th c. BC: H 44.5, W 38.1 cm `[firm, Met API]`.

**Fanglei**: rectangular plan (aspect 1.05–1.2), same profile with flat faces
and arrises, flanges on corners and midlines, hipped-roof lid like fangyi, animal
heads at shoulder midlines; low lug on one short side. Typical H 45–60 cm.

### 1.8 Pou 瓿

Wide, squat jar: low wide shoulder, short neck, high ring foot. H : max dia ≈ 0.9–1.0.

| # | r | y | join | note |
|---|---|---|---|---|
| 0 | 0.34 | 0.00 | C | foot edge |
| 1 | 0.33 | 0.20 | C | high ring foot top; 3 large cruciform/square openings |
| 2 | 0.40 | 0.28 | S | lower body |
| 3 | 0.50 | 0.55 | S | body max (main taotie band, 3 taotie, 3 flanges) |
| 4 | 0.48 | 0.68 | C | shoulder carination |
| 5 | 0.32 | 0.82 | C | shoulder-neck join |
| 6 | 0.31 | 0.92 | S | short straight neck (2 raised rings) |
| 7 | 0.33 | 1.00 | L | rim |

- Met **14.24.1** pou, 14th–13th c. BC: H 29.2, diam 29.8, rim 19.1, foot 20.3 cm
  `[firm, Met API]`. Note foot dia ≈ 0.68 of max diameter on this example.
- Shoulder: 3 animal heads (on flange axes) on later pou.

### 1.9 You 卣 (lidded bucket with swing handle)

Oval-section, pear-shaped body, lid with knob, **swing (bail) handle** pivoting in
two lugs on the narrow ends of the oval `[approx — standard for late Shang/early
Zhou oval you]`, ring foot.

- Plan: ellipse, major : minor ≈ 1.25–1.35 (generate by non-uniform scaling a lathe
  in x, *before* applying relief so the décor is not stretched — or map décor in
  arc-length, §6).
- Profile (normalised to body+lid height, handle excluded):

| # | r (major) | y | join | note |
|---|---|---|---|---|
| 0 | 0.30 | 0.00 | C | foot edge |
| 1 | 0.30 | 0.08 | C | foot top |
| 2 | 0.38 | 0.30 | S | lower belly max (pear-shaped, belly low) |
| 3 | 0.30 | 0.62 | S | neck taper |
| 4 | 0.26 | 0.70 | C | neck band, lugs here |
| 5 | 0.27 | 0.74 | L | rim, lid seats inside/over |
| 6 | 0.28 | 0.76 | C | lid edge (lid overhangs as a cap, flange-like skirt) |
| 7 | 0.20 | 0.92 | S | domed lid |
| 8 | 0.05 | 0.95 | C | knob base |
| 9 | 0.07 | 1.00 | L | knob (mushroom / bud) |

- Handle: rope-twist or rectangular section strap, ends in animal heads at lugs,
  arches to ≈ 1.25–1.4 × body height.
- Typical H 25–40 cm. Owl-pair and tiger-you are zoomorphic variants — skip.

### 1.10 Fangyi 方彝 (rectangular box with hipped-roof lid)

```
            _/\_             knob: miniature hipped roof on a short neck
          /      \
        /__________\         lid: hipped roof (4 sloping planes, ridge along long axis)
       |  :  ::  :  |        lid skirt overlaps body rim
       |  :  ::  :  |        body: slightly flaring or straight box, flanges at
       |__:__::__:__|        corners + face midlines
       |  :__/\__:  |        ring foot: rectangular, ARCHED NOTCH centred on each side
```

| Parameter | Value |
|---|---|
| Plan aspect | 1.0–1.25 (Met 1974.268.2: 15.2 × 11.4 → 1.33; Met 49.135.4: 14.1 × 12.9 → 1.09) `[firm]` |
| Body height / total H | 0.45–0.52 |
| Lid height (incl. knob) / total H | 0.33–0.40; knob ≈ 0.10–0.12 |
| Foot height / total H | 0.10–0.14, foot plan ≈ 0.85–0.92 × body |
| Body walls | near-vertical or flaring up 2–4°; Yinxu III–IV bodies slightly bulging/curved in profile |
| Lid | hipped roof: ridge length ≈ 0.35–0.5 × lid length; slopes 30–40° from horizontal; eaves slightly concave; lid skirt (vertical band 0.05 H) sits over body rim |
| Knob | miniature hipped roof, ≈ 0.25 × lid width, on a waisted neck |
| Foot notch | one per side, centred, arched/rectangular cutout, width ≈ 0.25–0.35 × side, height ≈ 0.6 × foot height |
| Flanges | 8 on body (4 corners + 4 midlines), continue on lid (corners = hip ridges, midlines on slopes) and on foot; on knob as small notched ridges |
| Décor | body: one large taotie per face (midline flange = nose), kui frieze at top; lid: inverted taotie per slope (reads right way up when lid is upside down / when seen from above); foot: kui pairs |

- Examples `[firm, Met API]`: **Met 49.135.4a, b** fangyi, 13th–11th c. BC, H 22.9,
  W 12.9, D 14.1 cm. **Met 1974.268.2a, b**, 12th c. BC, H 25.4, W 15.2, D 11.4.
  **Met 1985.214.2**, H 26.7, W 15.6.
- **Fu Hao ou fangyi 偶方彝** ("twin" fangyi): a double-width fangyi with a long
  hipped lid with 2 knobs, 7 square notches (beam-ends) along each long rim imitating
  roof beams: H 60 cm, L 88.2 cm, 71 kg `[firm-ish]`. Fu Hao fangyi (single)
  H ≈ 36.6 cm `[uncertain]`.

### 1.11 Gui 簋 (food bowl on ring foot)

Anyang gui: deep round bowl, everted rim, high ring foot, **usually handle-less**
in Yinxu II–III; **two handles with animal heads and pendant lugs (珥)** appear in
late Anyang and become standard in Western Zhou.

| # | r | y | join | note |
|---|---|---|---|---|
| 0 | 0.36 | 0.00 | C | foot edge |
| 1 | 0.36 | 0.04 | C | foot step |
| 2 | 0.34 | 0.24 | C | foot top (cruciform holes ×3–4 on early examples) |
| 3 | 0.40 | 0.30 | S | bowl bottom |
| 4 | 0.50 | 0.55 | S | belly max (main band: taotie or whorl/kui, or 'nipple-and-lozenge' 乳钉雷纹) |
| 5 | 0.48 | 0.75 | C | belly-neck step |
| 6 | 0.48 | 0.92 | S | neck (narrow band, small animal heads at 2 or 4 points) |
| 7 | 0.58 | 1.00 | L | strongly everted rim |

- Handles (when present): C-shaped vertical loop on belly, animal head at the top
  (horned), pendant lug hanging below as a flat rectangular/hooked tab ≈ 0.15 H.
- H 13–20 cm; rim dia ≈ 1.6–1.8 × H.

### 1.12 Hu 壶 (flask)

Anyang hu: **oval section** (major:minor ≈ 1.25–1.4), pear-shaped, long neck,
**tubular lugs (贯耳)** on the neck on the narrow sides, low ring foot, cap-lid.

| # | r (major) | y | join | note |
|---|---|---|---|---|
| 0 | 0.24 | 0.00 | C | foot edge |
| 1 | 0.24 | 0.06 | C | foot top |
| 2 | 0.32 | 0.25 | S | belly max (low) |
| 3 | 0.22 | 0.62 | S | neck |
| 4 | 0.19 | 0.82 | S | narrowest |
| 5 | 0.21 | 0.95 | L | mouth |

- Tubular lugs: vertical tubes at y≈0.70–0.85 on the narrow sides, diameter ≈ 0.05.
- Décor bands are narrow (neck band, belly band); fewer flanges.
- H 30–45 cm `[approx]`.

---

## 2. Proportion cheat sheet (normalised; real ranges in cm)

| Type | Real H (cm) | H : W : D | Leg/foot frac. | Handle/post frac. | Rim overhang |
|---|---|---|---|---|---|
| Fangding (monumental) | 80–133 | 1.21 : 1 : 0.72 (Houmuwu, H incl. handles) | legs 0.30–0.38 | handles 0.16–0.22 | 2–5 % of width |
| Fangding (normal) | 20–45 | 1.3 : 1 : 0.75 | 0.30–0.38 | 0.18–0.22 | 2–4 % |
| Round ding | 18–80 | 1.2 : 1 : 1 | 0.38–0.45 of body H | 0.18–0.22 | 2–3 % |
| Gu | 25–33 | 1.8 : 1 (H : rim dia) | foot 0.25 | — | trumpet lip |
| Jue | 18–25 (+posts) | 1 : 0.9 (H : rim length) | legs 0.40–0.45 | posts 0.12–0.18 | — |
| Jia | 25–45 | 1.5 : 1 | legs 0.36 | posts 0.15–0.25 | — |
| Zun (round) | 25–45 | 1.15 : 1 | foot 0.16–0.26 | — | — |
| Lei | 40–55 | 1.2 : 1 | foot 0.05 | — | — |
| Pou | 25–35 | 0.95 : 1 | foot 0.20 | — | — |
| Fangyi | 20–40 (Fu Hao ou: 60) | 1.7 : 1 : 0.85 | foot 0.10–0.14 | knob 0.10–0.12 | lid skirt |
| Gui | 13–20 | 0.6 : 1 | foot 0.24 | — | strongly everted |
| Hu | 30–45 | 1.6 : 1 : 0.75 | foot 0.06 | — | — |

---

## 3. Piece-mould casting — what it does to the geometry

Process (Bagley, Gettens, Chase): clay **model** → clay **mould sections** taken off
the model (décor mostly carved/stamped *into the mould* at Anyang, or modelled on
the model and refined in the mould) → **core** made by shaving down the model (or
separately) by the wall thickness → sections reassembled around the core, held
apart by **spacers** → poured upside-down (mouth down) through runners at the
foot/legs → mould broken off. No lost-wax in Shang.

### 3.1 How mould sections set the décor layout

- **Vertical sections**: round vessels are moulded in 2, 3 or 4 vertical sections
  (tripods: 3, one per leg; gu/zun/pou/lei: 3 or 4; you/hu oval: 2 or 4). Fang
  vessels: 4 (one per face, seams at corners) or 8 (seams also at face midlines).
- **Seam positions**: at corners of fang vessels; on round vessels along the
  flange axes. A taotie is **mirror-symmetric about its nose**; on many vessels the
  vertical seam runs **through the nose axis**, each section carrying half of two
  adjacent faces, and the flange hides/celebrates the seam. On others the seam
  falls *between* faces and the nose flange is non-structural. **Kit rule**:
  every sector boundary may carry a flange; every taotie axis carries a nose
  ridge or flange; for 3- and 4-fold round vessels put flanges on both the seam
  axes and the face axes so the vessel has 6 or 8 flanges (common on Yinxu II–III
  "flanged" style); minimal vessels have only seam-axis flanges or none.
- **Horizontal breaks**: the mould is also divided horizontally at **register
  boundaries** — typically at the carinations and raised rings (bowstring 弦纹)
  marked `C` in the tables. Expect a horizontal hairline, a small step, or a
  0.2–0.5 mm offset there. The raised ring pairs on gu/zun are where a horizontal
  joint is plausibly hidden.
- **Bottom/foot piece**: a separate base section; on tripods, seams run from each
  leg inward across the underside, so the underside shows a **3-armed (Y / triangle)
  seam pattern** joining the legs `[approx]`.
- Décor is therefore **repeated per section**: identical panels per sector (with
  mirror symmetry), slight carving differences between sections (hand-carved),
  occasional mismatch where a motif crosses a seam.

### 3.2 Seam fins and mismatch

- Fins: thin bronze fins (0.3–1.5 mm high) along seams where clay sections gaped;
  mostly filed off in antiquity on visible surfaces, **left on undersides,
  inside feet, inside handles and between leg and body**.
- Mismatch: lateral offset between adjacent sections 0.2–1.0 mm (small vessels)
  up to 2–3 mm on large ones; décor lines across a seam don't perfectly meet.
- Implementation: add a per-seam random offset (normal displacement step
  `±0.3 mm`, tangential décor shift `0–0.8 mm`) and an optional fin (sharp ridge
  0.5 mm high, 0.5 mm wide) where the seam isn't covered by a flange.

### 3.3 Core, spacers, through-holes

- Core supports: the inner core must be held to the outer mould. Ring-foot
  vessels: the core of the foot interior connects to the body core through
  openings — the **cruciform holes in gu/zun/pou/gui feet are voids left by core
  extensions** `[firm — standard interpretation]`. Place them on the foot, near the
  top, 2–4 around.
- Spacers (chaplets): bronze scraps or clay spacers between mould and core to keep
  wall thickness; on Anyang vessels mostly **invisible on décor surfaces**,
  sometimes seen as small rectangular patches (5–15 mm) in plain zones, on floors
  and lids, visible in X-ray `[approx]`. Kit: optional 0–4 subtle rectangular
  patches with slightly different patina/normal on plain areas and floors.
- Hollow legs: large ding/fangding legs contain clay core, with the leg cavity open
  to the vessel underside (Houmuwu legs hollow) `[approx]`; small tripods solid
  legs. Hollow-leg interiors seen from below are dark voids with residual core.

### 3.4 Pre-cast parts and casting-on

- Parts sometimes cast first and locked into the main mould ("precasting"), or
  cast onto the finished vessel afterwards ("casting-on"), mechanically locked:
  - handles of large fangding (Houmuwu, reportedly cast on) `[approx]`;
  - **projecting animal heads** on zun/lei/pou shoulders — frequently cast
    separately (often first) and locked in; visible as a slight joint line or
    metal overlap around the head base `[firm — Bagley; Gettens]`;
  - swing handles of you (cast with interlocked loops), rings on lei handles.
  - Legs of tripods are normally **integral** with the body (one pour).
- Geometry consequence: a 1–3 mm **collar/overlap** ring around cast-on parts on
  the inside or outside, slight colour/surface difference.

### 3.5 Legs, handles and where décor sits on them

- Leg–body junction: the leg top flares slightly into the body (fillet radius ≈
  0.15–0.3 leg diameter); on round ding the leg tops sit under the belly at
  ≈ 0.70–0.78 of rim radius. Fangding legs at the 4 corners, inset ≈ 0.05–0.08 of
  side length from the corner.
- Taotie on legs: a mask in relief on the **upper third** of the leg, facing
  outward (fangding: facing out along the corner diagonal; round ding: radially),
  with a short flange down the axis; lower leg plain with 2–3 raised rings or plain.
  Some late Anyang legs have **cicada blades** (蝉纹 hanging blades) instead.
- Handles: upright loop handles are plain, or with a groove along the outer face
  (channelled), or kui/tiger relief on the outer edge (Houmuwu).

### 3.6 Inscriptions

- Cast in **intaglio** (sunk) from a raised-character clay panel set into the core.
  Hence always on surfaces formed by the core: interiors, and undersides inside
  ring feet. Typical size: characters 5–20 mm; 1–6 characters in Yinxu II–III
  (clan sign, e.g. 亚 cartouche, or name 妇好), longer only in Yinxu IV.
- Locations: ding/fangding — **interior wall, just below the rim**, one side;
  gu — inside the foot (under the floor) or on the interior foot wall; jue — on
  the body **behind the handle**; jia — behind handle or on a post; fangyi — on
  **lid interior and body floor/inner wall** (matching pair); gui/zun/pou —
  interior floor or inner wall. Inscription panel often sits in a very slightly
  sunk rectangular area (outline of the core panel, 0.1–0.3 mm step).

### 3.7 Interior and underside appearance

- Interior: smooth, undecorated, softer contours (core surface), with occasional
  casting pits/porosity, sometimes faint marks of the core shaving.
- Undersides of tripods: plain, convex, with mould seam lines (Y-pattern), and on
  some Anyang ding raised **ribs** connecting legs or criss-crossing the bottom —
  reported, not universal `[uncertain — treat as optional]`.
- **Sooting**: cooking vessels (ding, li-ding, jia, jue) can carry black carbon
  deposits on the underside and lower leg inner faces from use over fire; burial
  patina usually overrides, but a darker gradient under the belly is defensible.
- Ring-foot interiors: rough, sometimes core clay remnants (beige-grey earth).

---

## 4. Flanges (扉棱) as geometry

### 4.1 Cross-section

```
 top view (cut perpendicular to flange path)

     <--- t (3-8 mm) --->
     ┌────────────────┐   flat or slightly rounded crest
     │                │
     │  incised lines │   flange faces carry incised grooves (0.5 mm),
     │  on both faces │   following the notch outline (T and L motifs)
     │                │
 ────┘                └────  vessel surface (fillet radius 0.5-1 mm)
         projection p = 5-15 mm (20-40 cm vessel)
```

- Profile perpendicular to the vessel: near-rectangular slab, faces parallel or
  tapering 2–5° toward the crest, crest flat. Base fillet small.
- Thickness t ≈ 0.012–0.020 × vessel H (min 3 mm); projection p ≈ 0.03–0.05 × H.

### 4.2 Notch / hook rhythm (side outline along the flange path)

The outer edge is **cut into segments** separated by notches; each segment carries
a hooked outline. The classic Anyang rhythm alternates two segment types:

```
 side view of a flange (vessel surface on the left, crest on the right)

   |████▌        <- T-shaped segment (crossbar at crest)
   |██          notch: depth ≈ 0.4-0.6 p, width ≈ 0.3-0.5 seg
   |████████
   |████▐   ┐    <- L/hook segment (hook turns down)
   |██      ┘
   |████▌
```

Parameterise as a sequence along arc-length s:
- segment length `L_seg ≈ 1.2–2.0 × p` (≈ 10–25 mm real),
- notch width `w ≈ 0.25–0.4 × L_seg`, notch depth `d ≈ 0.4–0.6 × p`,
- segment types `T`, `L`, `Lmirror`, `T`... → default pattern `[T, L, T, J]`,
- incised groove 0.6 mm wide, 0.4 mm deep, inset 1.5 mm from outline, on both faces.
- Distribution: integer number of segments per register span, starting and ending
  with a full segment; notches align roughly with the décor's horizontal features
  (horn tips, eye line) `[approx]`.

### 4.3 Where flanges start/stop and how they cross registers

- On round vessels flanges run **within a register** and stop 1–3 mm short of
  raised rings/carinations, then **restart** in the next register on the same
  axis; on gu/zun they span middle and foot sections, interrupted by the
  bowstring rings. On fang vessels flanges are often **continuous** across
  registers along corners (Houmuwu-type framing excepted, where corners are
  plain arrises with décor bands).
- Top ends: flanges often terminate below the rim with a **step-out "hook" that
  protrudes above the profile** (on fangyi/fanglei/gu tops the flange end can
  rise above the rim by 0.5–1 p).
- Echo on lids: fangyi/fanglei lid flanges lie on the hip ridges (corner
  flanges) and slope midlines, aligned exactly with the body flanges below;
  the knob carries miniature flanges. Ring feet repeat body flanges (same axes,
  shorter, smaller p).
- Under shoulder heads: flange stops below the animal head; the head sits on the
  flange axis.

### 4.4 Small sculptural additions

- **Shoulder animal heads** (bovine with C-curved horns, ram with spiral horns):
  on zun/lei/pou/fangzun shoulders on flange axes; size ≈ 0.10–0.15 H wide,
  projecting 0.06–0.10 H; horn tips free-standing. Low-relief animal heads also
  sit at the centre of neck bands of gui/zun (projecting 3–8 mm).
- **Posts with caps** on jue/jia: stem round (dia 0.025–0.035 H) or square,
  cap umbrella/mushroom/conical, cap dia 2–2.5× stem, whorl on top.
- **Animal-head loop handles**: gui/jue/jia handle = vertical loop, top with an
  animal head (horns over the handle top), and on gui a **pendant lug** (flat
  rectangular tab with hooked lower corner) hanging below the loop.
- **Knobs**: fangyi/fanglei — miniature hipped roof; you — mushroom/bud with ridged
  cap; lids of pou/lei — mushroom or loop.

---

## 5. Tolerances and irregularities (make it feel cast, not CAD)

| Effect | Suggested magnitude (fraction of H unless stated) | Notes |
|---|---|---|
| Rim not level | 0.3–1.0 % of H peak-to-peak, low-frequency (1–2 cycles) | handles follow rim |
| Body ellipticity of "round" vessels | 0.5–1.5 % radius | random axis |
| Lean of whole body vs. legs | 0.5–1.5° | |
| Leg splay variance | ±1–2° per leg; leg length ±0.5 % | lowest leg defines tilt |
| Leg angular placement | ±1–3° around axis | |
| Handle lean variance | ±2° per handle; height ±1 % | |
| Wall thickness variation | ±20–30 % of nominal, low frequency | core shift; thicker toward bottom |
| Fang body corner squareness | ±0.5–1° | box faces slightly bowed outward (sag 0.2–0.5 % of face width) |
| Flange thickness / projection | ±10 % along length, small waviness | hand-carved |
| Seam mismatch | 0.2–1 mm (small vessels), 1–3 mm (large) | see §3.2 |
| Décor panel variation between sections | 1–3 % scale, ±0.5 mm line positions | per-section random seed |
| Surface waviness of "flat" planes | 0.1–0.3 mm amplitude, 20–60 mm wavelength | gives highlights character |
| Edge softening (corrosion + wear) | all arrises fillet 0.3–1 mm; décor crests 0.2–0.5 mm | rim top and handle tops more worn |
| Casting flaws | 0–5 small pits (1–4 mm) on plain zones, 0–1 old repair patches | optional |

Do **not** add random noise to symmetry of the décor itself beyond the above — the
taotie must still read as rigorously bilateral.

---

## 6. Recommended engineering decomposition (three.js kit)

### 6.1 Primitives

1. **`LatheShell(profile, opts)`**
   - `profile`: array of `{r, y, join: 'C'|'S'|'L'}` (outer surface, normalised).
   - `wall`: thickness function `t(y)` (mm → normalised), `rimThickness`,
     `floorY` (inner floor height; for gu/zun the cup floor is not at the base).
   - `segments` (radial, ≥ 256 for relief; displacement needs ≥ 1 vertex per
     0.5 mm at the final scale — use a shader/normal map for leiwen and only
     geometry-displace the main relief, see 6.3).
   - `ellipse: {sx, sz}` for oval you/hu.
   - Builds outer surface, lip (rounded or flat top from outer to inner), inner
     surface (offset), floor. Splits normals at `C` points. Emits **register
     boundaries** = list of `C` heights.
2. **`FangBody({wRim, dRim, wBase, dBase, h, bulge, cornerRadius, rimEverted, rimT})`**
   - 4 faces, each a bilinear/bicubic patch: taper from rim to base, `bulge`
     (outward sag at mid-height, 0–4 % of width) for later Anyang curved fang
     bodies; `cornerRadius` 0 (arris + flange) or small (early). Multiple
     stacked `FangBody` sections reproduce fangzun/fangjia/fanglei profiles
     (each section = one register).
3. **`ColumnLeg({h, r0, rTop, entasis, entasisPos, footFlare, hollow, splay, taotieMaskZone:[y0,y1]})`**
   - lathe around its own axis; outward splay rotation; top blends into body
     with a fillet.
4. **`BladeLeg({h, chord, thickness, splay})`** for jue/jia: triangular section,
   tapering, sharp outer edge.
5. **`UprightHandle({w, h, t, depth, sectionGroove, lean, aperture})`** — inverted
   U swept along a path with rectangular section, optional channel; base merges
   into rim top.
6. **`LoopHandle({path, section, animalHead, pendantLug})`** for gui/jue/jia/lei.
7. **`SwingHandle({span, height, section:'rect'|'rope', endHeads})`** for you.
8. **`FlangeStrip({path, p, t, segments:[...], startCap, endCap})`**
   - extrudes a 2D outline (generated from the notch rhythm in §4.2) along a
     surface curve: path = vertical curve on the shell (lathe profile at angle θ)
     or a fang corner/midline edge; orient the slab in the plane containing the
     surface normal and the path tangent. Incised grooves via normal map.
9. **`HippedLid({w, d, ridgeFrac, slopeDeg, skirtH, eaveCurve})`** + **`Knob`**
   (hipped mini roof / mushroom / bud).
10. **`RingFoot`** = a `LatheShell` (or `FangBody`) section with `holes: [{type:'cross', angle, y, arm, width}]`
    or `notches: [{side, width, height, shape:'arch'|'rect'}]` (fangyi).
11. **`SpoutTail`** for jue: lofted from U-sections along a rising curve.
12. **`AnimalHeadAttachment`** — imported/sculpted mesh or SDF placed at
    `(sector axis, y)` with a collar.

### 6.2 Sector/register grid (the core abstraction)

Every vessel exposes a **décor grid**:
```
registers: [{y0, y1, kind:'taotie'|'kui'|'blades'|'whorl'|'plain'|'rings'}]
sectors:   [{θ0, θ1}]  (round; θ measured from the "front" axis, which is the
                        axis of a leg on tripods and the face centre on fang)
seams:     [θ_i]       (subset of sector boundaries carrying flanges/fins)
faceAxes:  [θ_j]       (taotie nose axes)
```
Panels are authored per `(register, sectorKind)` as a **2D height field**
(+ optional 2D vector source) for **one half** of a taotie, mirrored about the
face axis. Each panel's u spans exactly one sector, v spans one register.

### 6.3 UV conventions

- **Lathe surfaces**: `u = arc-length around (θ / 2π scaled by local radius)`
  normalised **per sector** — i.e. u ∈ [0,1] across one sector at every height;
  `v = arc-length along the profile` (not y!) normalised per register, so that the
  carved décor keeps its proportions over curved bellies/flaring trumpets. Store
  per-vertex `sectorId`, `registerId`, and the local `(u, v)` as a second UV set;
  keep a global cylindrical UV in uv0 for patina noise.
  - Because a flaring trumpet's circumference changes with height, either
    (a) let the panel stretch horizontally (the Shang carvers did exactly this —
    rising blades widen upward) — **preferred for blades and trumpets**, or (b)
    use constant-width panels padded with leiwen ground — preferred for taotie
    bands on near-cylindrical registers.
- **Fang faces**: planar `(u,v)` per face-register, u ∈ [0,1] corner to corner,
  face axis at u = 0.5; v by arc-length up the face (handles bulge).
- **Lids**: hipped-roof slopes are trapezoids/triangles; map the panel with
  u across the slope base, v from eave (v=0) to ridge (v=1); décor on lids is
  **inverted** relative to the body (the taotie's forehead at the eave).
- **Legs**: per-leg cylindrical UV, u = 0.5 facing outward; mask zone in upper third.
- **Displacement**: two levels —
  1. **Geometric displacement** (vertex) for main relief (1–5 mm), flange bases,
     and high-relief masks, sampled from the panel height field at adequate
     tessellation (adaptive: subdivide only within décor registers).
  2. **Normal/parallax map** for leiwen ground spirals and incised lines on
     raised elements (0.2–0.6 mm).
  Displace along the base-surface normal, **outward only**; inner surface is
  untouched (§0.3).
- **Seam data**: write a vertex attribute `seamDist` (distance to nearest seam,
  mm) for the patina shader (fins/edges corrode differently) and for injecting
  mismatch offsets.
- **Curvature/cavity**: precompute an AO/cavity attribute from the height fields
  (deep grooves collect green/earth encrustation — see 02-patina-and-alloy.md).

### 6.4 Assembly order (per vessel)

1. Build base surface (lathe / fang stack), apply ellipse/ irregularities of §5
   as a smooth low-frequency deformation **before** décor.
2. Define registers from `C` points and sectors/seams from type rules.
3. Fill panels from the design system (taotie/kui/blades/whorls).
4. Displace outer surface; generate inner surface from undisplaced base.
5. Add flanges (on seams/face axes, per register rules), legs, handles, posts,
   heads, lid, knob, foot holes/notches.
6. Add foundry marks: fins on uncovered seams, mismatch, spacer patches,
   inscription panel inside, casting-on collars.
7. Weld/fillet junctions (leg tops, handle roots) with small fillets; compute
   normals with angle threshold ~35° so carinations stay crisp.

---

## 7. Annotated sources

- **Robert W. Bagley, *Shang Ritual Bronzes in the Arthur M. Sackler Collections*
  (1987)** — the essential text for how piece-mould sections dictate décor,
  flange placement, casting-on of appendages; typology by vessel type.
- **Bagley, "Shang Archaeology" in *Cambridge History of Ancient China* (1999)** —
  chronology (Erligang → Anyang), foundry practice summary.
- **Max Loehr, "The Bronze Styles of the Anyang Period" (1953)** — Styles I–V;
  use Style V (high relief, flanges) as the default target.
- **Rutherford J. Gettens, *The Freer Chinese Bronzes, vol. II: Technical Studies*
  (1969)** — X-radiography of mould marks, spacers, casting-on; wall-thickness
  observations.
- **W. T. Chase, *Ancient Chinese Bronze Art: Casting the Precious Sacral Vessel*
  (1991)** — piece-mould process with illustrations of mould sections and cores.
- **Jessica Rawson, *Chinese Bronzes: Art and Ritual* (1987); *Western Zhou Ritual
  Bronzes from the Arthur M. Sackler Collections* (1990)** — vessel-set functions,
  handle and lug development.
- **中国社会科学院考古研究所, 《殷墟妇好墓》 (1980)** — Fu Hao (M5) report:
  dimensions of Si Mu Xin fangding, ou fangyi, gu/jue sets.
- **Ma Chengyuan 马承源, 《中国青铜器》** and **Chen Mengjia 陈梦家** typology of
  Shang–Zhou vessels — naming conventions (立耳, 扉棱, 分裆, 贯耳).
- **Sarah Allan, *The Shape of the Turtle* / essays on taotie meaning** — skip for
  geometry; useful only for décor semantics.
- **Metropolitan Museum Collection API** (checked Nov 2026): 49.135.10 ding,
  49.135.11 / 1978.526.1 / 1985.214.4 gu, 12.134.32 jue, 49.135.4 / 1974.268.2 /
  1985.214.2 fangyi, 14.24.1 pou, 59.194 lei, 1985.214.6 zun; 24.72.x (Duanfang
  altar set, Western Zhou) for later comparison.
- Wikipedia (en/zh) entries for 后母戊鼎, 四羊方尊, 妇好墓 — dimensions and weights
  repeated from the excavation literature; figures cross-checked between versions
  where they differ (Houmuwu weight 832.84 kg vs older 875 kg).

Uncertain items to verify before relying on them: Fu Hao fangjia and single
fangyi heights; exact cruciform-hole axis placement on gu; prevalence of underside
ribs on Anyang ding; Houmuwu wall thickness; whether specific Met shoulder heads
are cast-on.
