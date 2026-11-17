# 02 — Alloy, original appearance, corrosion & patina (shader reference)

Scope: late Shang, Anyang/Yinxu (c. 1250–1046 BC) ritual bronzes. Written for the
engineers building (a) the metal BRDF, (b) a layered patina shader, (c) presets.

Conventions in this file

- Colours are given as **sRGB hex** (display-referred, what you'd pick in a colour
  picker) **and linear RGB 0–1** (what goes into the shader as `baseColor` /
  `F0`). Linear values were computed with the exact sRGB EOTF.
- Metal colours are **F0 (normal-incidence specular reflectance)** for a metallic
  workflow (`metalness = 1`, `baseColor = F0`). Corrosion products are dielectrics
  (`metalness = 0`, `baseColor = diffuse albedo`, F0 ≈ 0.04–0.08).
- Roughness = perceptual GGX roughness as used by three.js `MeshPhysicalMaterial`.
- Confidence tags: **[firm]** = well established in the literature;
  **[est]** = engineering estimate consistent with the literature but not a
  measured value; **[uncertain]** = contested or from memory with low confidence.

---

## 0. The one thing to get right

**Shang bronzes were made to be bright, golden, metallic objects.** Every green,
blue, black or olive surface seen in museums is 3,000 years of burial corrosion
(and sometimes later cleaning / waxing). A freshly cast and finished Anyang
vessel with ~12–16 % tin was a warm gold-to-pale-gold metal, close to polished
brass in hue, darkening quickly to a brownish gold in use (handling, smoke,
offerings). The decor read through **relief + light** (sharp sunken lines catch
shadow), probably helped by a dark filling in some lines (§4.1). [firm]

Shader consequence: the patina system must be an **overlay on a real metal
BRDF**, never a baked green albedo. The "As cast" preset (all patina weights = 0)
must look like gold-bronze, and every other preset is a function of masks over it.

---

## 1. Alloy

### 1.1 Composition of Anyang ritual vessels

Shang ritual bronzes are ternary **Cu–Sn–Pb** alloys, cast in sectional clay
(piece) moulds. Arsenic, Zn are trace only (Zn essentially absent — no brass).

| Object / group | Cu % | Sn % | Pb % | Notes |
|---|---|---|---|---|
| Houmuwu (Simuwu) *fangding*, Yinxu, ~875 kg | 84.8 | 11.6 | 2.8 | Classic published figure (1950s–80s analysis), [firm] as a cited number |
| Fu Hao tomb (M5) vessels, Yinxu Phase II, typical range | ~75–90 | ~10–20 | ~0–10 | Majority are tin-rich and lead-poor; a subset leaded. [firm range, exact per-object values est] |
| Fu Hao M5 "high-tin, low-lead" core group | ~80–85 | ~15–19 | <2 | Pale-gold metal. [est] |
| Yinxu Phase I–II elite vessels generally | 80–88 | 10–17 | 1–6 | [est] |
| Yinxu Phase III–IV (later, non-royal & many royal) | 70–85 | 5–15 | 5–20+ | Clear trend to **more lead, less tin** over time. [firm trend; values est] |
| Weapons/tools (not vessels) | 80–90 | 8–15 | variable | Same alloys, not our focus |
| Mirrors (rare at Anyang; later periods) | 65–75 | 20–28 | low | Silvery "speculum"; useful as upper bound only |

Physical facts that matter for rendering:

- **Lead is immiscible** in Cu–Sn: it solidifies last as discrete globules
  (µm–100 µm) dispersed through the metal. On a corroded surface these become
  white–grey lead-carbonate specks (§2.8). In a high-lead later Yinxu vessel, a
  faint white speckle in the patina is plausible; on Houmuwu-type low-lead
  vessels it is negligible.
- Above ~10–12 % Sn the as-cast structure is α-solid solution dendrites + hard,
  pale **α+δ eutectoid** in the interdendritic spaces. The δ phase is
  silver-white and brittle; it is the reason high-tin metal looks paler and
  more "silvery" and why tin-rich corrosion (§2.5) is so stable.
- Tin and lead both lower the melting point and improve fluidity — the reason
  for crisp casting of 1 mm-wide sunken lines. Not a shader concern, but it is
  why the decor edges are **sharp** (edge radius ~0.1–0.3 mm when fresh).
- Density: ~8.6–9.0 g/cm³ (rises with Pb). Irrelevant to shading.

### 1.2 Metal colour vs tin content (F0)

These are **engineering estimates** [est] interpolated from published
reflectance/colour data for copper and Cu–Sn alloys (pure Cu F0 is the
standard measured value (0.955, 0.638, 0.538)). The hue walk is correct; the
exact numbers are ±0.03.

| Sn wt% | Visual description | F0 sRGB hex | F0 sRGB (0–255) | F0 linear RGB |
|---|---|---|---|---|
| 0 | copper-pink / salmon | `#FAD1C2` | 250, 209, 194 | 0.955, 0.638, 0.538 |
| 5 | red-gold, coppery | `#F8D4BC` | 248, 212, 188 | 0.940, 0.660, 0.500 |
| 10 | warm gold (Houmuwu ~11.6 %) | `#F5DAB6` | 245, 218, 182 | 0.910, 0.700, 0.470 |
| 15 | pale gold / yellow (Fu Hao core) | `#EFDDBD` | 239, 221, 189 | 0.860, 0.725, 0.510 |
| 20 | pale yellow-white | `#E7DFCA` | 231, 223, 202 | 0.800, 0.735, 0.590 |
| 25 | silvery white with warm cast | `#DFDDD4` | 223, 221, 212 | 0.740, 0.720, 0.655 |
| 30 | speculum, near-neutral silver | `#DAD8D4` | 218, 216, 212 | 0.700, 0.690, 0.660 |

Notes for the shader:

- F0 colour of metals looks **much more saturated in renders** than these
  hex chips suggest, because reflections multiply it with the environment and
  Fresnel goes to white only at grazing angles. Expect the 10–15 % rows to read
  clearly "gold" on screen.
- Implement as a 1D lookup: `F0 = mix_table(tin)` with linear interpolation
  between rows, tin uniform 0–0.30.
- **Lead effect** [est]: each 1 % Pb desaturates and darkens slightly. Use
  `F0 = mix(F0, vec3(luma(F0)) * 0.92, clamp(lead * 2.0, 0.0, 0.5))` with
  `lead` as a 0–0.25 fraction. At 3 % Pb the effect is invisible; at 15–20 %
  Pb the metal is visibly greyer and duller.
- **Tarnish** (a few nm–100 nm of Cu₂O/oxide film, the "aged but not
  corroded" look of any handled bronze) shifts F0 to brown-gold and lowers its
  value. Model as `F0 *= mix(vec3(1), vec3(0.78, 0.60, 0.45), tarnish)`. A
  ritual vessel in use for a generation sits at tarnish ≈ 0.3–0.5.
- Recommended default for an Anyang showpiece: **tin = 0.14, lead = 0.03**.

### 1.3 Roughness of metal surfaces

| Surface state | GGX roughness | Notes |
|---|---|---|
| Freshly polished with abrasives (sand, stone, leather) | 0.12–0.22 | Shang finishing was abrasion; not mirror-polished. Faint directional scratches. [est] |
| As-cast "casting skin" (not abraded) | 0.40–0.55 | Replicates the clay mould surface: fine stipple ~20–100 µm. Recesses of the decor stay like this. [est] |
| Worn by handling (high points of heirloom) | 0.20–0.32 | Burnished, smooth, warm. [est] |
| Lightly tarnished, waxed museum metal | 0.30–0.40 | |
| Bare metal exposed by modern mechanical cleaning | 0.35–0.50 | Micro-pitted from removal of corrosion. |

Key point: on a finished vessel, **flat fields and raised relief tops were
abraded smooth, but the bottoms of sunken lines and the narrow spaces of the
leiwen (雷纹) ground were not reachable** → recesses remain as-cast rough and
slightly darker even when new. Drive this with the cavity mask (§3).

Anisotropy is optional: polishing marks follow the circumference on vessel
bodies. If supported, anisotropy 0.2–0.3 tangential to the rotational axis.

---

## 2. Corrosion products

Each entry: chemistry · colours (dark / mid / light; sRGB hex + linear) ·
finish & roughness · thickness · morphology/scale · where it forms.
All corrosion products are dielectric: `metalness = 0`, specular F0 ≈ 0.04
unless stated; malachite and cuprite have higher refractive index (n ≈ 1.65–1.9
and ≈ 2.7 respectively) → F0 ≈ 0.06–0.09 for malachite, **≈ 0.21 for cuprite**
(cuprite has a strong, almost sub-metallic sheen when smooth).

### 2.1 Cuprite — Cu₂O [firm]

| | sRGB | linear |
|---|---|---|
| dark (brown-purple, "liver") | `#4A1C14` | 0.068, 0.012, 0.007 |
| mid (brick/oxblood red) | `#7E3424` | 0.209, 0.034, 0.018 |
| light (orange-red, thin films / crystals) | `#A9573C` | 0.397, 0.095, 0.045 |

- Finish: compact layer is waxy to sub-metallic; roughness 0.35–0.55
  (compact), 0.6–0.8 (granular). F0 ≈ 0.18–0.22, neutral.
- Thickness: 10 µm – 1 mm (typ. 50–300 µm). Grows inward, replacing metal
  ("original surface" marker lies within/above it).
- Morphology: continuous layer directly on metal; often visible as red
  flecks, a red rim at the edge of a broken green crust, or as red
  "show-through" where malachite is thin. Occasional ruby crystals in voids.
- Where: **everywhere, under everything**. Becomes visible (a) on worn high
  points and rims where the green has been abraded or cleaned off, (b) in
  scratches / chips in the crust, (c) as rims around pits. On cleaned museum
  pieces, cuprite shows through as a reddish-brown undertone on relief tops.

### 2.2 Tenorite — CuO [firm]

| | sRGB | linear |
|---|---|---|
| dark | `#171513` | 0.009, 0.007, 0.007 |
| mid | `#29241F` | 0.022, 0.018, 0.014 |
| light (brown-black) | `#3D3631` | 0.047, 0.037, 0.031 |

- Finish: matte to dull, roughness 0.6–0.8.
- Thickness: thin, µm–tens of µm.
- Where: minor in burial; mostly from **heating** (fire, ritual use near
  heat — interior/underside of ding, tripod legs exposed to fire, soot). Use
  as a darkening of the lower body/legs exterior on ding and *li*: a vertical
  gradient from the base upward, 0–30 % of height. Often mixed with soot
  (carbon, same colours, roughness 0.9).

### 2.3 Malachite — Cu₂CO₃(OH)₂ [firm]

The dominant green of excavated Chinese bronzes.

| | sRGB | linear |
|---|---|---|
| dark (deep, compact, wet-looking) | `#1E5A3C` | 0.013, 0.102, 0.045 |
| mid (typical) | `#3D8A5C` | 0.047, 0.254, 0.107 |
| light (bright, crystalline) | `#7DB892` | 0.205, 0.479, 0.287 |
| pale crust variants (earthy, dusty) | `#5E8F6E` / `#8AB59A` / `#B3D3BD` | 0.112,0.275,0.156 / 0.254,0.462,0.323 / 0.451,0.651,0.509 |

- Finish: compact banded malachite is **waxy-silky** (roughness 0.35–0.5,
  slight sheen on bumps); earthy/powdery crust 0.75–0.95. Most excavated
  surfaces read 0.6–0.8.
- Thickness: 0.1–3 mm; local warty mounds to 5–10 mm on heavily corroded
  pieces (the crust *does* blur the decor — sunken lines partly filled).
- Morphology: **botryoidal** (grape-like) mounds 0.5–5 mm diameter; banded
  in section; "mottled" territories with colour variation of dark/mid/light
  on a **5–40 mm** scale; edges of territories show the red cuprite rim.
  Crust surface has warty bumps → use a positive height/normal perturbation,
  Worley/cellular noise at 1–4 mm cell size.
- Where: everywhere exposed to carbonated groundwater; **thickest in
  recesses and on surfaces in contact with soil** (up-facing shoulders,
  inside of the bowl if soil-filled), thinner on convex high points and
  rims. Can pseudomorph textiles/mats (wrapping silk/hemp weave preserved as
  green replica: ~0.3–1 mm thread spacing, patches of a few cm, usually on
  one side — the side that lay on/under wrapping).

### 2.4 Azurite — Cu₃(CO₃)₂(OH)₂ [firm]

| | sRGB | linear |
|---|---|---|
| dark (deep blue) | `#1C3570` | 0.012, 0.036, 0.162 |
| mid (azure) | `#2D58A8` | 0.026, 0.098, 0.392 |
| light (powdery sky-blue) | `#6A92D0` | 0.144, 0.287, 0.631 |

- Finish: crystalline crusts glassy-glittering (roughness 0.3–0.45 + sparkle),
  earthy spots matte 0.8.
- Thickness: 0.1–2 mm.
- Morphology: **discrete patches** 3–30 mm, crystal clusters, often on top
  of or among malachite; covers typically 0–15 % of surface, rarely more.
  Azurite is metastable and converts to malachite → blue islands in green.
- Where: no strong geometric preference; slight preference for sheltered
  areas and interiors. Drive with a thresholded low-frequency noise
  (few large blobs), *not* cavity.

### 2.5 Tin-oxide-rich "noble"/"water" patina (SnO₂·nH₂O + Cu/Fe/Si) [firm phenomenon]

Chinese terms: 水银古 *shuiyingu* (silvery/"mercury" ancient, grey-silver),
黑漆古 *heiqigu* ("black lacquer ancient", black glossy), 绿漆古 (green lacquer),
"water patina" in English dealer usage. Forms by selective dissolution of Cu
from the surface, leaving a hydrated tin oxide that keeps the **original
surface shape** ("marker of the original surface"). Common on high-tin
objects (mirrors) and on many bronzes from waterlogged/southern soils; on
Anyang vessels it occurs as olive-grey smooth areas, often mixed with
malachite. [firm phenomenon; prevalence on Anyang vessels est]

| Variant | dark | mid | light |
|---|---|---|---|
| black (*heiqigu*) | `#121412` 0.006,0.007,0.006 | `#1F231D` 0.014,0.017,0.012 | `#30362B` 0.030,0.037,0.024 |
| olive / green-grey | `#39402F` 0.041,0.051,0.028 | `#5C6448` 0.107,0.127,0.065 | `#838B6A` 0.227,0.258,0.144 |
| grey / silvery-grey (*shuiyingu*) | `#4E5550` 0.076,0.091,0.080 | `#6E7570` 0.156,0.178,0.162 | `#9AA09A` 0.323,0.352,0.323 |

- Finish: **smooth, lustrous, glassy/enamel-like**; roughness 0.12–0.3.
  Specular F0 ≈ 0.06–0.10 (SnO₂ n ≈ 2.0). This is the patina that looks
  "lacquered".
- Thickness: 10–200 µm, conformal. **Does not blur detail** — cast
  lines stay knife-sharp. No height displacement.
- Morphology: continuous sheet; subtle mottling at 10–50 mm; can have
  green malachite spots/pustules (1–5 mm) breaking through it.
- Where: whole surface or large territories; often **better developed on
  exterior** than interior; edges and high points can show through to
  red cuprite/gold metal on heirloom-handled pieces.

### 2.6 Chlorides — nantokite CuCl, atacamite / paratacamite / clinoatacamite Cu₂(OH)₃Cl ("bronze disease") [firm]

| | sRGB | linear |
|---|---|---|
| paratacamite / atacamite dark (bluish green) | `#6FAE86` | 0.159, 0.423, 0.238 |
| mid (pale apple green) | `#98CBA6` | 0.314, 0.597, 0.381 |
| light (powdery, almost white-green) | `#C3E2CB` | 0.546, 0.761, 0.597 |
| nantokite (waxy grey, under the spot; rarely seen) | `#7A7766` / `#9E9A84` / `#C2BEA8` | 0.195,0.184,0.133 / 0.342,0.323,0.231 / 0.539,0.515,0.392 |

(Atacamite proper is a deeper emerald-green crystal, ~`#3F8A5E`; the
active "disease" powder is paler and more bluish than malachite.)

- Finish: **powdery, loose, very matte** — roughness 0.9–1.0, no sheen.
  Slightly raised (0.1–1 mm) over a pit.
- Morphology: **spots 0.5–5 mm**, clustered; each spot sits on a **pit**
  (pit depth 0.2–2 mm) with a waxy grey nantokite core under the powder;
  often a dark/red cuprite ring around it. Distribution is clustered
  (Poisson clusters), not uniform.
- Where: anywhere chloride reached the metal: breaks in the patina,
  seams, porosity, repairs, around chaplets, base and feet (soil contact).
  Active spots after excavation when RH > ~40 %. The Robbiola Type II
  structure (§3.1).

### 2.7 Copper / mixed sulfides (chalcocite Cu₂S, covellite CuS, djurleite) [firm, minor]

| dark `#141416` 0.007,0.007,0.008 | mid `#25252A` 0.019,0.019,0.023 | light (blue-black, covellite sheen) `#38383E` 0.040,0.040,0.048 |

- Finish: dull black, roughness 0.5–0.7; covellite has an indigo iridescent
  sheen (optional: tint specular toward `#3A4A8A`).
- Where: anaerobic, organic-rich or waterlogged burial; in contact with
  decaying organics (food residue in interiors!). Use as an interior/bottom
  darkening, and as a component of the black-patina preset.

### 2.8 Lead corrosion — cerussite PbCO₃, hydrocerussite, (minor PbO, anglesite) [firm]

| dark (grey) `#B5B1A6` 0.462,0.440,0.381 | mid `#D3CFC4` 0.651,0.624,0.552 | light (white) `#EEEBE3` 0.855,0.831,0.768 |

- Finish: chalky, roughness 0.85–0.95.
- Morphology: **specks 0.05–0.5 mm** (corroded lead globules), sparse;
  occasional white crusty patches a few mm where lead segregated.
- Where: uniformly speckled, density ∝ lead content; more on undersides and
  thick sections (lead segregates by gravity in the mould — the bottom of
  the pour). Turn on only for lead > ~0.06.

### 2.9 Burial soil accretions [firm]

| | dark | mid | light |
|---|---|---|---|
| loess (Anyang yellow-brown) | `#8F7048` 0.275,0.162,0.065 | `#B39368` 0.451,0.292,0.138 | `#D2BD95` 0.644,0.509,0.301 |
| calcareous crust (calcite, whitish) | `#BDB5A2` 0.509,0.462,0.361 | `#D9D2C1` 0.694,0.644,0.533 | `#EEE9DC` 0.855,0.815,0.716 |
| iron-stained (rust-ochre) | `#6E4122` 0.156,0.053,0.016 | `#975C30` 0.309,0.107,0.030 | `#BF8550` 0.521,0.235,0.080 |

- Finish: matte, roughness 0.9–1.0; earth is slightly raised and lumpy;
  calcareous crust is hard, granular, slightly glittery.
- Thickness: films 0.05 mm to lumps of several mm filling recesses.
- Where: **packed into recesses** (sunken lines, leiwen ground, the inner
  angle between flange and body, under handles, between legs, under the
  rim lip), **on the underside/base** and inside the vessel bottom. On
  excavated-but-not-fully-cleaned pieces (Yinxu site museum look), earth
  fills the decor lines so they read lighter (ochre) than the green
  relief — an important inversion of the "dark lines" look.
- Burial orientation: one side typically has more earth/crust (the side
  that lay down). Implement as a directional bias vector `burialDir`.

### 2.10 Quick table for the shader

| Layer | Default colour (linear) | Roughness | Height (mm) | F0 |
|---|---|---|---|---|
| metal | from tin table | 0.18–0.5 | 0 | F0 table (metallic) |
| cuprite | 0.209, 0.034, 0.018 | 0.45 | 0 | 0.20 |
| tenorite/soot | 0.022, 0.018, 0.014 | 0.75 | 0 | 0.04 |
| Sn-patina | 0.107, 0.127, 0.065 (olive) | 0.22 | 0 | 0.08 |
| malachite | 0.047, 0.254, 0.107 | 0.65 | 0.2–3 | 0.06 |
| azurite | 0.026, 0.098, 0.392 | 0.55 | 0.2–2 | 0.06 |
| chloride | 0.314, 0.597, 0.381 | 0.95 | 0.1–1 (over a pit) | 0.04 |
| cerussite | 0.651, 0.624, 0.552 | 0.9 | 0 | 0.04 |
| soil | 0.451, 0.292, 0.138 | 0.95 | 0.2–5 | 0.04 |
| calcite | 0.694, 0.644, 0.533 | 0.85 | 0.2–2 | 0.04 |

---

## 3. Stratigraphy and the mask model

### 3.1 What the science says

Generic burial section of a Shang bronze (outermost first) [firm]:

```
  soil / calcite / iron-stained earth (accretion, outside original surface)
  azurite islands (optional)                          ┐
  malachite, botryoidal / banded                      │ "outer" products,
  ...  original surface (decor shape) lies about here ┘ above original surface
  cuprite, compact red (often with Sn-rich zones)     ┐ "inner" products,
  [nantokite CuCl at the metal interface if chlorides]│ below original surface
  metal (with internally corroded α+δ, Pb globules)   ┘
```

**Robbiola, Blengino & Fiaud (1998)** classify bronze corrosion structures:

- **Type I — "noble" / passivating patina.** Thin (tens of µm), even,
  smooth, conformal. Inner layer Sn-enriched, Cu-depleted (Cu leached out by
  "decuprification"), with soil elements (Si, Fe, P) incorporated. Keeps the
  original surface exactly. Colours: olive, grey-green, brown-black, blue-grey
  green; glossy. → our "water patina" / heiqigu / olive museum looks.
- **Type II — "coarse" / "vulgar" patina.** Thick, irregular, multilayer;
  driven by chloride; Cu₂O + Cl-rich internal layer, outer malachite with
  cuprite; pitting; **the original surface is disrupted** (warty crust,
  decor blurred). → "Anyang excavated green" and "bronze disease".

A single vessel commonly shows **both**: Type I territories with Type II
"pustules" breaking through.

### 3.2 Layer stack for the shader (back-to-front compositing)

Evaluate bottom-up, each layer with coverage `a_i ∈ [0,1]` and composite with
over-operator on all PBR channels (`baseColor`, `metalness`, `roughness`,
`F0`, `normal`, `height`):

```
L0  metal          (tin/lead F0, polish roughness, tarnish)
L1  cuprite        (red, sub-metallic)
L2  Sn-patina      (Type I sheet: olive/black/grey, glossy, no height)
L3  tenorite/soot  (heat / vertical gradient)
L4  malachite      (Type II crust, height)
L5  azurite        (islands on/among L4)
L6  chloride spots (pits + powder)
L7  cerussite      (lead specks)
L8  soil/calcite   (recess fill, burial side)
-- then wear/cleaning is applied as an ERASE that removes top layers first
```

`metalness` after compositing = `(1 - Σcoverage of dielectric layers above L0)`;
i.e. any dielectric layer with coverage 1 kills metalness.

### 3.3 Per-pixel inputs required

| Input | How to get it | Range | Used by |
|---|---|---|---|
| `cavity` (ambient occlusion / concavity) | baked per-vertex/texture AO with short radius (2–8 mm), or derive from the generator's relief height: `cavity = saturate((blur(h, r) - h) * k)` | 0 open → 1 deep recess | soil, malachite thickness, as-cast roughness, dirt |
| `convexity` / curvature | mean curvature from mesh or from relief height Laplacian; `convex = saturate((h - blur(h,r)) * k)` | 0 → 1 sharp edge / high point | wear, cuprite show-through, Sn-patina burn-through |
| `edgeWear` | convexity × handling probability (rims, handles, flange tips, ear tops) | 0–1 | erase mask |
| `up` | `dot(N_world, vec3(0,1,0))` (vessel-local up) | -1…1 | soil on shoulders, malachite thickness, dust |
| `burial` | `dot(N_world, burialDir)` | -1…1 | one-sided crust, textile pseudomorph |
| `heightAboveBase` | `(P.y - base)/(top - base)` in object space | 0–1 | soot/tenorite, lead gradient, tide lines |
| `interior` | flag/attribute (inside surface of bowl) | 0/1 | sulfide, soil fill, less wear |
| `P_obj` | object-space position (mm) | | all noise — **object space** so patina sticks to the vessel when it rotates |
| `seam` | distance to mould-seam/flange lines (from generator) | mm | chloride, fins, preferential corrosion |
| `reliefHeight` | from the taotie design system (the decor heightfield) | 0–1 | cavity/convexity if not baked; patina fill of sunken lines |

### 3.4 Mask recipes (all in object space, units mm)

Notation: `n(p, f)` = 3D simplex/fbm with base frequency f (cycles/mm);
`w(p, s)` = Worley F1 with cell size s mm; `ss(a,b,x)` = smoothstep.

1. **Territories (low-frequency)** — which patina "wins" where:
   `T = fbm(P * 1/60mm, 4 octaves)` → split into zones by thresholds.
   - Sn-patina territory: `ss(snThresh-0.1, snThresh+0.1, T)`.
   - Malachite territory: complement, with mottling `fbm(P/15mm)`.
   - Azurite islands: `ss(1-azurite-0.05, 1-azurite+0.05, fbm(P/35mm + offset))`.
   Scales: territories 30–150 mm, mottle 5–40 mm.

2. **Malachite coverage & thickness**:
   `mal = malachite * ss(0.2, 0.6, T_mal + 0.5*cavity + 0.25*max(up,0) + 0.2*burialSide - 0.4*convex)`
   `malThick = mal * (0.3 + 0.7*cavity) * (0.6 + 0.4*w(P, 2mm))` → height
   offset `malThick * malHeight` (0–3 mm). Botryoidal normal from
   `w(P, 1.5mm)` inverted (domes) at amplitude ∝ crustiness.
   Colour: `mix(dark, mid, n(P/8))` then `mix(…, light, ss(.6,.9,n(P/3)))`.
   **Cavity bias is the single most important term** — green collects in the
   lines and the ground; relief tops are thinner and redder.

3. **Cuprite show-through**: `cup = cuprite * ss(0.3, 0.8, convex + 0.3*n(P/4))` applied
   where malachite is thin (`1 - malThick`) — red-brown appears on ridges,
   rim, flange edges, and as 0.5–2 mm rims around malachite islands
   (compute `rim = ss(0.0,0.05, mal) - ss(0.05,0.15, mal)` and add it).

4. **Soil/calcite fill**: `soil = soilAmt * ss(0.35, 0.75, cavity + 0.3*max(up,0) + 0.3*burialSide + 0.2*n(P/20))`.
   Lumps: height `soil * w(P, 3mm) * 2mm`. Underside and interior:
   `+ 0.5*interior + 0.4*max(-up,0)*ss(0,0.15,heightAboveBase)`.
   Calcite = same mask with a different noise seed, thresholded higher
   (white specks and crusts within the earth).

5. **Chloride spots (high-frequency)**: Poisson clusters:
   `c = disease * clusterNoise(P/25mm) * ss(0.92, 0.97, 1 - w(P, 3mm))` →
   spots ~0.5–3 mm. Boost near `seam < 4mm`, at feet, near repairs. Each
   spot: depth –0.3…–1 mm pit in height, powder raised +0.2 mm, cuprite ring
   at radius 1.2× spot.

6. **Lead specks**: `pb = ss(0.985, 0.995, hash3D(floor(P/0.3mm)) )` × lead
   factor; only where not under soil.

7. **Soot/tenorite**: `soot = sootAmt * (1 - ss(0.0, 0.35, heightAboveBase)) * (1-interior)`;
   plus underside of the bowl (`-up` on exterior bottom) for ding/li.

8. **Tide lines / water level**: optional horizontal bands where groundwater
   stood: `tide = ss(w0, w0+2mm, P.y) - ss(w0+2mm, w0+6mm, P.y)` with
   `w0` perturbed ±5 mm by noise; colour = darker malachite or iron stain.
   Use sparingly (0–2 lines).

9. **Wear / cleaning erase (applied last)**:
   `wear = wearAmt * ss(0.3, 0.9, convex*handling + 0.3*n(P/2mm))`.
   Erase order (removes from top down): soil → azurite/malachite → Sn-patina
   → cuprite → metal exposed. Implement as thresholds on one scalar:
   ```
   e = wear
   soil     *= 1 - ss(0.00, 0.15, e)
   malachite*= 1 - ss(0.10, 0.40, e)
   azurite  *= 1 - ss(0.10, 0.40, e)
   snPatina *= 1 - ss(0.35, 0.65, e)
   cuprite  *= 1 - ss(0.60, 0.90, e)     // e>0.9 → bare (burnished) metal
   metal roughness = mix(asCastR, burnishedR, ss(0.6,1.0,e))
   ```
   Result: on a worn ridge you see **green → red-brown → warm gold** in
   ~1–3 mm bands, which is exactly the heirloom/handled look.

10. **Recess darkening for clean pieces** (dirt + wax + residual corrosion):
    `dark = recessDirt * cavity^1.5` → multiply albedo/F0 by `1 - 0.7*dark`,
    roughness += 0.3*dark.

### 3.5 Occlusion rules (summary)

- Soil occludes everything; it is only visible in cavities/underside unless
  `soilAmt > 0.6`.
- Malachite occludes Sn-patina and cuprite; azurite sits on/in malachite.
- Sn-patina (Type I) and malachite crust (Type II) are **alternatives per
  territory**, not stacked; a pustule of malachite may sit on Sn-patina.
- Cuprite is never on top of malachite (except as rims/edges) — it appears
  only through thinning or wear.
- Chloride spots punch through any layer (they originate at the metal).
- Bare metal appears only via wear/cleaning, never via thin patina.

---

## 4. Museum appearance archetypes (presets)

Parameter names refer to §6. Values are starting points [est]; tune on the
model under the gallery lighting.

### 4.1 "As cast, c.1200 BC"

Bright gold-bronze, freshly finished, slight tarnish; optional dark inlay.

```
tin 0.14  lead 0.03  tarnish 0.15  polishRough 0.18  asCastRough 0.45
cuprite 0  snPatina 0  malachite 0  azurite 0  disease 0  soil 0  soot 0
wear 0  recessDirt 0.15
inlay 0.0..0.8  inlayColor #141210 (lin 0.007,0.006,0.005)  inlayRough 0.6
```

**Inlay evidence.** On many Anyang bronzes the sunken lines of the decor (and
the leiwen ground) contain a black material, and it has long been argued
(e.g. by Bagley, and in Chinese literature on 填漆/黑色填料) that the
recessed ground was originally filled with a dark paste to make the
raised taotie read against a dark ground. The evidence is (a) black residues
in recesses on some excavated pieces that are not corrosion products, (b)
the clearly two-level design logic (figure vs. ground), (c) parallels with
inlaid decor on lacquered wood and bone of the same period. Analyses of
the material are few; it has been variously described as lacquer-, carbon-
or resin-based paste. **[uncertain]**: it is not established that most
vessels were so filled, and much "black in the lines" in museums is soil,
sulfide or wax. Red (cinnabar) is attested in Shang contexts (inscriptions
on bone, burial chambers) but red fill in bronze decor is **[uncertain /
probably rare]**. Implement as an optional `inlay` (0 = none, 1 = recess
fully filled, flush), driven by `reliefHeight < groundLevel` (i.e. the
design system's "ground" class), colour black, roughness 0.5–0.7, dielectric.
Default **off** with a UI toggle; good default when on: 0.8 coverage.

### 4.2 "Anyang excavated green" (Houmuwu / Fu Hao, site-museum look)

Thick mottled malachite over cuprite, earth in crevices, decor partly blurred.

```
tin 0.13  lead 0.04  tarnish 0.6
cuprite 0.9  snPatina 0.15 (snVariant=olive)  malachite 0.9  malCrust 0.7
malHeight 1.5mm  azurite 0.06  disease 0.15  lead specks on
soil 0.55 (loess)  calcite 0.2  iron 0.15  burialSide 0.4
soot 0.1  wear 0.15 (rims only)  recessDirt 0.3
colours: malachite mid #3D8A5C, light #7DB892 used 30 %, dark #1E5A3C in recesses
```

Reads as: green body with lighter blotches 1–4 cm, red-brown flecks on
edges/flanges, ochre earth packed in the leiwen ground, whitish calcite
specks. Houmuwu itself is today predominantly dark green-grey with brown
and black areas — between this preset and §4.4. [est]

### 4.3 "Black water patina / 黑漆古"

Type I noble patina, glossy black, perfectly preserved detail.

```
tin 0.16  lead 0.02
snPatina 1.0 (snVariant=black, #1F231D)  snRough 0.15  snF0 0.08
cuprite 0.2 (edges only)  malachite 0.08 (pustules 1-4 mm, no crust)
azurite 0  disease 0.03  soil 0.05 (deep recesses only)  wear 0.15
```

Looks like black lacquer with sharp specular highlights tracing every line.
Small green spots break through. More typical of southern/waterlogged finds
and mirrors than Anyang vessels, but present in collections. [firm look;
Anyang prevalence uncertain]

### 4.4 "Olive-grey smooth museum patina" (Freer / Met / British Museum cleaned)

The commonest look of Shang vessels in Western collections: mechanically
cleaned decades ago, waxed; smooth grey-green to olive with green and red
spots, dark recesses.

```
tin 0.14  lead 0.05
snPatina 0.8 (snVariant=olive, mid #5C6448, light #838B6A on high points)
snRough 0.3  malachite 0.35 (thin, malHeight 0.2mm, mottled, mostly in recesses)
cuprite 0.35 (show-through on relief tops)  azurite 0.03  disease 0.02
soil 0.1  recessDirt 0.55  wax 0.6 (roughness → 0.3, slight sheen everywhere)
wear 0.2
```

Key cue: relief tops slightly lighter/warmer and smoother; recesses darker
green-black (cavity darkening), whole thing has a soft waxy sheen.

### 4.5 "Azurite bloom"

```
as 4.2 but: azurite 0.35 (islands 5-30 mm, mid #2D58A8, light #6A92D0)
malachite 0.85  malLight share 0.4  soil 0.25  snPatina 0.0
```

Use for display variety; blue covering >25 % is unusual. Keep islands
distinct, not a blended teal (never mix blue and green in the same pixel —
threshold between them).

### 4.6 "Bronze disease"

Active chloride corrosion, pale powdery green, pitted.

```
base: 4.2 or 4.4
disease 0.7  diseaseScale 2mm  clusterScale 25mm
chloride colour mid #98CBA6, light #C3E2CB; roughness 0.98
pitDepth 0.8mm  seamBoost 2.0  footBoost 1.5
```

Visual signature: **light, chalky, slightly bluish green dots** sitting in
small craters with dark/red rims, clustering along seams, flange bases and
feet — distinctly paler and dustier than the stable malachite around them.

### 4.7 "Heirloom, hand-polished"

A vessel kept above ground (or re-polished by a later collector): warm metal
on high points, dark in recesses.

```
tin 0.13  lead 0.04  tarnish 0.7 (brown-gold)
cuprite 0.6  snPatina 0.4 (black/brown)  malachite 0.1 (recesses only)
soil 0  recessDirt 0.8  wear 0.75  handling bias: rims, handles, flange tips, legs' knees
burnishedRough 0.22
```

Visual: gold-brown metal glinting on every raised line of the taotie,
red-brown halo around worn areas, near-black recesses → maximum legibility of
the decor. Good "hero" preset for showing the design system.

---

## 5. Micro-surface features (what matters at 20 cm)

At 20 cm, one screen pixel ≈ 0.1–0.2 mm on a 1080p view of a 30 cm vessel.
Features ≥ 0.3 mm are visible; ≥ 1 mm are prominent.

| Feature | Real size | Visible at 20 cm? | Implementation |
|---|---|---|---|
| **Mould seams / flanges** | Piece-mould joins run vertically (typ. 3–4 or 6–8 per vessel, at the quarter points), often **masked by the notched vertical flanges** (扉棱) that sit on the seam. Where no flange: a ridge/fin 0.2–1 mm high, 0.5–2 mm wide, often filed down | **Yes** | Geometry ridge along seam lines from the generator; also a horizontal seam at the body/foot ring junction and under the base (tripod: Y- or triangle-shaped seam on the bottom). Corrosion & chloride preference near seams |
| Casting skin | stipple 20–100 µm | as roughness only | roughness + fine normal noise (0.05 mm), stronger in recesses |
| **Porosity** | gas pores 0.2–2 mm, on upper parts (as poured) & thick sections; shrinkage porosity at legs/handle junctions | **Yes**, a few | sparse dark pits: `ss(0.995,1, hash)` × top-of-pour bias; often with corrosion inside |
| **Spacers (chaplets/垫片)** | squarish/irregular patches 5–20 mm, mainly on **base, lower body, and under handles**; slightly different colour/corrosion than surrounding metal (often visible as a rectangle outline in patina) | **Yes**, on underside | rectangles with 0.3 mm outline groove, patina colour offset ±10 %, sometimes the decor runs across them uninterrupted, sometimes interrupted. Visible on base and occasionally on the vessel wall of Anyang *gui*/*zun* [firm presence; exact placement varies] |
| **Casting-on joins** | handles, legs, ears sometimes cast first and cast-on (or the reverse) → visible lap/overlap ridges 1–3 mm at junctions | Yes, close up | small irregular collar at handle roots |
| **Repairs (ancient)** | cast-on patches (irregular blobs 10–40 mm) fixing miscasts, often on the lower body | Yes | rare; optional feature |
| **Repairs (modern)** | fills of resin/plaster painted to match, slightly flatter and more uniform colour, different gloss | Yes, if present | optional "restored zone" with patina noise frequency removed and roughness 0.5 |
| Inscriptions (铭文) | intaglio characters 5–20 mm, cast in, usually **inside** the bowl or under a handle/lid | Yes | sunken text; fills with soil/corrosion first (high cavity) |
| Decor edge sharpness | sunken lines 0.5–1.5 mm wide, 0.5–2 mm deep; walls nearly vertical; flat-topped relief | **Critical** | sharp normals; don't over-blur the cavity; Type II crust rounds edges by `malHeight` |
| Tool / scratch marks | abrasion scratches µm–0.1 mm | only as anisotropic sheen | anisotropy on metal presets |
| Textile pseudomorphs | weave 0.3–1 mm, patches 2–10 cm | Yes | tileable weave normal map masked by burial side |

Priority for v1: seams/flanges (geometry), cavity-driven patina, edge wear,
chaplet rectangles on base, sparse porosity, inscription inside. Skip
textile, modern repairs, casting-on collars until later.

---

## 6. Shader parameter list

All uniforms float unless noted. "Coverage" params are 0–1 global gains on
the mask in §3.4. Units mm in object space (scale the generator so 1 unit =
1 mm, or pass `mmPerUnit`).

### 6.1 Metal

| Uniform | Range | Default | Physical meaning |
|---|---|---|---|
| `uTin` | 0–0.30 | 0.14 | Sn fraction → F0 table §1.2 |
| `uLead` | 0–0.25 | 0.03 | Pb fraction → desaturation, lead specks |
| `uTarnish` | 0–1 | 0.3 | thin oxide film; browns & darkens F0 |
| `uPolishRough` | 0.08–0.4 | 0.18 | roughness of abraded fields/relief tops |
| `uAsCastRough` | 0.3–0.7 | 0.45 | roughness of unabraded recesses |
| `uAniso` | 0–0.5 | 0.0 | circumferential polishing anisotropy |

### 6.2 Patina layers

| Uniform | Range | Default | Meaning |
|---|---|---|---|
| `uCuprite` | 0–1 | 0.7 | cuprite availability (show-through, rims) |
| `uCupriteColor` vec3 | | (0.209,0.034,0.018) | |
| `uSnPatina` | 0–1 | 0.3 | Type I territory coverage |
| `uSnVariant` | 0–2 | 1 | 0 black, 1 olive, 2 grey (interpolate palettes) |
| `uSnRough` | 0.1–0.4 | 0.22 | gloss of noble patina |
| `uMalachite` | 0–1 | 0.7 | Type II crust coverage |
| `uMalHeight` | 0–4 mm | 1.0 | crust thickness → displacement/normal |
| `uMalCrust` | 0–1 | 0.5 | botryoidal bumpiness & matte-ness |
| `uMalPalette` 3×vec3 | | §2.3 dark/mid/light | |
| `uAzurite` | 0–0.5 | 0.05 | island coverage |
| `uDisease` | 0–1 | 0.05 | chloride spot density |
| `uDiseaseScale` | 0.5–5 mm | 2 | spot size |
| `uPitDepth` | 0–2 mm | 0.6 | pit depth under spots |
| `uSoot` | 0–1 | 0.0 | tenorite/soot on lower exterior |
| `uLeadSpecks` | 0–1 | auto = ss(0.06,0.15,uLead) | cerussite specks |
| `uSoil` | 0–1 | 0.3 | earth fill in cavities/underside |
| `uSoilColor` vec3 | | loess mid | |
| `uCalcite` | 0–1 | 0.1 | white crust share within soil |
| `uIron` | 0–1 | 0.1 | ochre staining share |
| `uBurialDir` vec3 | unit | (0.3,-0.2,0.93) | side that lay down |
| `uBurialSide` | 0–1 | 0.3 | one-sidedness of crust & soil |
| `uTideLevel` / `uTide` | mm / 0–1 | – / 0 | optional water line |

### 6.3 Global modifiers

| Uniform | Range | Default | Meaning |
|---|---|---|---|
| `uWear` | 0–1 | 0.15 | erase stack on convex/handled areas |
| `uHandling` | 0–1 | 0.5 | weight of rims/handles/flange tips in wear |
| `uRecessDirt` | 0–1 | 0.3 | darkening of cavities (dirt, wax, residue) |
| `uWax` | 0–1 | 0 | museum wax: roughness → lerp to 0.3, +0.02 F0 |
| `uInlay` | 0–1 | 0 | black paste fill of ground (As-cast preset) |
| `uInlayColor` vec3 | | (0.007,0.006,0.005) | |
| `uTerritoryScale` | 20–200 mm | 60 | low-freq noise scale |
| `uMottleScale` | 3–40 mm | 12 | mid-freq colour variation |
| `uSeed` | int | 0 | per-vessel variation |
| `uCavityGain`, `uConvexGain` | 0–4 | 1 | rescale baked masks |
| `uMmPerUnit` | | 1 | unit conversion |

### 6.4 Per-pixel inputs (attributes / textures)

- `aCavity` (0–1) and `aConvexity` (0–1) — preferably baked by the generator
  from the relief heightfield at two radii (fine 1–2 mm for decor lines,
  coarse 10–20 mm for flange/body angles), packed in one RG texture or vertex
  colour. Without these the shader cannot do patina correctly.
- `vPosObj` (object space, mm), `vNormalWorld` and object-space normal (for
  `up` and `burial`).
- `aHeightNorm` — height above base 0–1.
- `aInterior` flag, `aSeamDist` (mm), `aGroundMask` (design-system class:
  1 = recessed ground/leiwen, 0 = raised figure) for inlay and soil fill.
- Optional `aHandling` painted weight (rims, handles, legs).

Implementation notes:

- Use `onBeforeCompile` on `MeshPhysicalMaterial` (or TSL nodes) so the
  layers feed the standard three.js lighting: write `diffuseColor`,
  `metalnessFactor`, `roughnessFactor`, `specularColor`, and perturb
  `normal` from the summed layer height via screen-space derivatives
  (`dFdx/dFdy` of height) or by evaluating the noise gradient analytically.
- For cuprite and Sn-patina use `MeshPhysicalMaterial.specularIntensity /
  specularColor` to get F0 0.08–0.2 on a dielectric.
- Use `clearcoat` (0.3–0.6, roughness 0.2) for `uWax` instead of faking it.
- Keep all noise in object space and deterministic from `uSeed` so the patina
  is stable on rotation and across reloads (thumbnail determinism).
- Environment: a warm, soft museum-light HDR; metal presets look dead under
  a flat grey env. A dim neutral-dark background with 1–2 soft key lights
  shows the gold best.

---

## 7. Sources (annotated)

- **Gettens, R. J. (1969). *The Freer Chinese Bronzes, Vol. II: Technical
  Studies*.** Smithsonian. The foundational technical study: alloy analyses,
  piece-mould casting evidence (seams, spacers, casting-on), and a full
  catalogue of corrosion products on Chinese bronzes with colour descriptions
  (malachite, azurite, cuprite, cassiterite "water patina", chlorides,
  cerussite). Primary basis for §2 and §5.
- **Chase, W. T. (1991). *Ancient Chinese Bronze Art: Casting the
  Precious Sacral Vessel*;** and Chase & Franklin papers on Chinese bronze
  patinas/tin-rich surfaces. Casting technology and the nature of the
  "black/water" patinas.
- **Scott, D. A. (2002). *Copper and Bronze in Art: Corrosion, Colorants,
  Conservation*.** Getty. The reference for corrosion mineralogy, colours,
  stratigraphy, "original surface" concept, bronze disease (nantokite →
  paratacamite cycle), and surface treatments. Basis for §2–3.
- **Robbiola, L., Blengino, J.-M., Fiaud, C. (1998). "Morphology and
  mechanisms of formation of natural patinas on archaeological Cu–Sn
  alloys." *Corrosion Science* 40(12).** Type I (noble, decuprified
  Sn-rich, preserves surface) vs Type II (coarse, chloride-driven) model —
  basis of §3.1.
- **Bagley, R. W. (1987). *Shang Ritual Bronzes in the Arthur M. Sackler
  Collections*;** and Bagley in *Cambridge History of Ancient China* (1999).
  Piece-mould technology, flanges on seams, decor logic (figure vs ground),
  discussion of dark fill of the ground [inlay claim: uncertain, §4.1].
- **Rawson, J. (1990). *Western Zhou Ritual Bronzes from the Arthur M.
  Sackler Collections*;** Rawson, *Chinese Bronzes: Art and Ritual* (1987).
  Use-life, heirlooms, appearance.
- **Institute of Archaeology, CASS (1980). *Yinxu Fu Hao mu* 殷墟妇好墓**
  (excavation report, with alloy analyses appendix), and related Yinxu
  metallurgical studies (e.g. 李敏生 et al., 殷墟金属器物成分测定). Fu Hao
  compositions in §1.1 (ranges; exact per-object values not reproduced
  here [est]).
- Houmuwu *fangding* composition (Cu 84.77 / Sn 11.64 / Pb 2.79 %) as
  widely cited from the National Museum of China / 1950s analysis.
- **Loehr, M. (1953/1968)** — Anyang style sequence (Styles I–V); relevant to
  dating presets, not chemistry.
- **Ma Chengyuan 马承源, *Zhongguo qingtongqi* 中国青铜器** — Chinese
  terminology for patina types (黑漆古, 水银古, 绿锈, 红斑) and casting
  marks.
- Pure copper F0 (0.955, 0.638, 0.538): standard measured value used in
  physically based rendering references (e.g. Naty Hoffman / Real-Time
  Rendering metal tables). Cu–Sn F0 rows are interpolated [est].
