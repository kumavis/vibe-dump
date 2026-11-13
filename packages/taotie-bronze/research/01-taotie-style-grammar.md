# 01 — Taotie style grammar (Anyang / Yinxu, 13th–12th c. BC)

Implementation-oriented grammar of the late-Shang taotie (饕餮纹 / 兽面纹) and its
companion motifs, written for the people coding the decor generators.

Confidence markers used throughout:

- **[firm]**: standard and well attested in the literature and in excavated pieces.
- **[est]**: an engineering estimate drawn from photographs, published sections and
  handling experience as reported in the literature. Use it as a default and expose it
  as a parameter.
- **[uncertain]**: the literature disagrees, or this is my reconstruction. Do not hard-code it.

All dimensions are in millimetres unless noted. "Vessel H" means overall height.

---

## 0. TL;DR for engineers

1. Late Shang décor is **piece-mould décor**. Every motif lives in a rectangular or
   trapezoidal panel bounded by mould seams, which are usually hidden under flanges
   (扉棱). A panel holds one bilaterally symmetric composition centred on a seam or flange.
2. The taotie is **two profile creatures mirrored about a vertical axis** that share one
   frontal face. Build a **half-mask** (right half), then mirror it. Never build a
   "frontal face" as a single symmetric shape.
3. Use **three depth layers** (三层花) for Style V: a ground of fine square spirals
   (leiwen), a raised flat motif plateau, and secondary sunken lines cut into the
   plateau. On top sit optional high-relief pieces: eye bosses, horn tips, and sculpted
   heads on the shoulder.
4. Line weight is constant. Leiwen lines and grooves are about 0.4–0.8 mm wide, with a
   line:gap ratio of about 1:1. Everything is band-based: motif parts are **bands of
   constant width with squared-round ends that terminate in spirals or hooks**.
5. Empty space is forbidden inside a décor zone. Leiwen packs every leftover area. Large
   plain zones do exist *between* zones, separated by bowstring ribs (弦纹).

---

## 1. Chronology and style frame

### 1.1 Absolute and relative dates [firm, with conventional uncertainty]

| Phase | Approx. date BC | Kings (Yinxu oracle-bone periodisation) | Bronze-style horizon |
|---|---|---|---|
| Erligang lower/upper | c.1600–1400 | — | Loehr I–III |
| "Transitional" / middle Shang (Huanbei, Taixi, Xiaoshuangqiao) | c.1400–1250 | — | Loehr III, early IV |
| **Yinxu I** | c.1250–1200 | Pan Geng – Xiao Yi, early Wu Ding | III/IV; dense flat décor |
| **Yinxu II** | c.1200–1150 | Wu Ding (late) – Zu Geng, Zu Jia | **IV and V together**. Fu Hao tomb M5 (c.1200), Huayuanzhuang East M54 |
| **Yinxu III** | c.1150–1090 | Lin Xin – Wen Ding | **V dominant**, flanges get heavier, dissolved taotie common |
| Yinxu IV | c.1090–1046 | Di Yi, Di Xin | V continues; "smooth" plateau faces and hooked flanges appear, leading into early Western Zhou |

The target horizon for "13th–12th c. BC" is **Yinxu II–III**. The Fu Hao assemblage
(468 bronzes, including ritual vessels) is the single best reference set. It contains
Style IV and Style V pieces side by side, so **both styles are period-correct** and
the generator should support both.

### 1.2 Loehr's five styles: visual definitions for rendering

Max Loehr (1953) described five styles as a sequence. Bagley later showed that the sequence is
largely valid typologically but overlaps chronologically.

| Style | Surface | How to render |
|---|---|---|
| I | thin raised **threads** forming lightweight band-shaped motifs on plain ground | single raised lines about 1 mm wide, no ground pattern |
| II | **ribbon** bands, flat, sunk-cut (intaglio) into the surface | broad flat bands (2–4 mm) with incised contours, plain ground |
| III | dense, **curvilinear**, the whole zone covered in fine flat ornament; motif barely legible | uniform-density flat engraving, no hierarchy |
| **IV** | motif and spirals **flush at the same surface level**; the motif reads by being made of **broader flat bands** and the ground by **finer, denser spirals** | one height level. The motif uses wider bands (line width w_m ≈ 1.5–2.5 × the leiwen line w_g). The ground is fine leiwen. Contrast comes from **line density only** |
| **V** | motif **raised in relief** above a leiwen ground; the motif surface carries its own sunken lines; in the developed form there are 3 layers (三层花) | ground leiwen at level 0, motif plateau at +h_m, secondary grooves cut into the plateau, plus optional high-relief bosses |

Variants within Style V:

- **V-a "carved plateau"** (Yinxu II–III, the most common): plateau densely
  grooved with lines that follow the contour, ending in hooks and small spirals.
- **V-b "smooth plateau"** (Yinxu III–IV, more common later): plateau mostly smooth
  and rounded, with only a few grooves (eye ring, horn spiral). It reads sculptural. [firm]
- **V-c "dissolved"** (Yinxu II–IV): components are raised separately and float on
  the leiwen with no connecting outline. See §2.12.

### 1.3 Relief heights

These are not systematically published, so treat them as defaults and make them parameters. They are
consistent with published sections, technical studies (Gettens 1969; Bagley 1987 on
mould carving), and the visible shadowing in photographs. **[est]**

| Feature | Vessel 20–40 cm | Monumental (fangding 80–133 cm, large zun/lei 50–80 cm) |
|---|---|---|
| Leiwen groove depth (below ground surface) | 0.3–0.6 | 0.6–1.2 |
| Leiwen line width / groove width | 0.4–0.8 / 0.4–0.8 | 0.8–1.5 / 0.8–1.5 |
| Leiwen pitch (centre-to-centre of adjacent lines) | 0.8–1.6 | 1.6–3.0 |
| Style IV motif bands (flush) | 0 above ground, band width 1.2–2.5 | 0, band 2.5–5 |
| Style V motif plateau above ground | 1.0–2.5 (typical 1.5) | 3–6 |
| Sunken lines on plateau, depth | 0.3–0.6 | 0.6–1.2 |
| Eye boss (pupil) above plateau | +1.5–4 (total 3–6 above ground) | +4–10 |
| High-relief horn tips / ears ("sculpted" Style V-b) | 3–8 above ground | 10–25 |
| Sculpted 3D animal heads (shoulder of lei/zun, neck of you/gui) | 10–30 | 40–80 |
| Flange projection (see §6) | 5–15 | 15–40 |
| Bowstring rib (弦纹) height / width | 0.5–1 / 1–2 | 1–2 / 2–4 |

Heuristic for parameters: `h_motif ≈ 0.005 × vessel_H` (clamp 1–6 mm),
`leiwen_pitch ≈ 0.004 × vessel_H` (clamp 0.8–3 mm). Plateau **edges are near-vertical**
(draft angle 5–15°, softened by a 0.2–0.4 mm fillet from casting and wear), not bevelled.
The plateau top is flat in V-a and slightly domed in V-b (crown of 0.2–0.5 × h_motif).

---

## 2. Taotie anatomy as a parametric construction

### 2.1 Coordinate system

Build the **right half-mask** (the viewer's right). Mirror it about x = 0 for the left half.

```
 y=1 ┌──────────────────────────────────────────────┐  panel top (register edge / bowstring)
     │  horn ............                           │
     │  ◇ shield    eyebrow   ear   body→  ↑tail    │
     │  │           ◉ eye          quills           │
     │  │ nose                       leg            │
     │  ╰ snout scroll    lip──╮     │              │
     │      fang          fang ╯     claw           │
 y=0 └──────────────────────────────────────────────┘  panel bottom
     x=0 (central axis / flange / mould seam)        x=1 (panel edge or next seam)
```

- `x ∈ [0,1]`: normalised by the **half-panel width** W/2.
- `y ∈ [0,1]`: normalised by the **panel height** H_p.
- The half-panel aspect `A = (W/2)/H_p` is typically **1.0–1.4** on belly registers of
  round vessels (a full mask is 2.0–2.8 × H_p wide) and **0.7–1.0** on fangyi/fangding
  faces and gu feet. All radii below are in **H_p units** unless they are written as x/y
  coordinates. Convert x to H_p units with `x * A`.
- In the half-mask, the creature **faces the axis**: its snout is at x ≈ 0 and its tail
  is at x ≈ 1. Viewed alone, each half is a profile creature facing left.

### 2.2 Primitive vocabulary (implement these first)

Every part is a combination of five primitives. All of them produce **closed outlines**
for the plateau (Style V) or **stroke bands** (Style IV).

| Primitive | Definition |
|---|---|
| `Band(path, w, capStart, capEnd)` | constant-width band along a polyline centreline. Corners are filleted with radius `r = 0.5–1.0 × w`, never sharp and never circular-smooth. Caps: `flat`, `round`, `hook`, `spiral`, `point` |
| `SqSpiral(c, size, turns, dir, rCorner)` | rectilinear spiral. Segment lengths are `p·(1,1,2,2,3,3,…)`. Turns 1.5–3.5. `rCorner = 0.2–0.5 × p`. 0 gives angular 雷纹, 0.5 gives rounded 云纹 |
| `Hook(base, len, dir, curl)` | short tapered band (taper 1.0→0.4 × w) that ends in a quarter- to half-turn curl. Used for quills, fangs and claw toes |
| `CScroll(c, R, sweep, dir)` | C-volute: an arc of 200–300° with a band width that shrinks inward by 10–20 % per quarter turn. Used for snout, horn and ear ends |
| `Blade(base, height, apexOffset)` | isosceles or skewed triangle with slightly concave sides (sagitta 3–6 % of height) |

Shape character rules:

- The **default corner** is a "squared-round" corner: a straight segment, a short fillet,
  then a straight segment. True circular arcs appear only in the pupil, the boss eye,
  whorl circles and the inner turns of C-scrolls.
- **Terminals are almost always curled** (a spiral or hook) or end at another
  element. A free band end with a flat cut is rare, except at panel edges.
- **Interior negative spaces between motif parts are filled with leiwen**, not left
  plain (all of Style IV/V-a). In V-b, small plain gaps (< 2 × pitch) are acceptable.

### 2.3 Nose ridge / central flange (鼻梁 / 中脊)

- Placement: `x ∈ [0, 0.05–0.08]`, `y ∈ [0.15–0.25, 0.70–0.85]`.
- Shape: a vertical band of full width `2 × 0.06` (shared by both halves). Its top merges into
  the forehead shield (§2.11). Its bottom flares into the snout (§2.4). On flanged
  vessels, a flange (§6) sits on top of the ridge and replaces its upper 60–100 %.
- Surface: in V-a, one or two vertical grooves run parallel to the edges, sometimes with
  short horizontal ticks ("ladder"). In V-b it is smooth and slightly ridged (a triangular
  cross-section with a 120–150° apex).
- On some Yinxu II faces the ridge is a **stack of small hooked units** reading like an
  inverted cicada or a small inverted kui pair. [firm]

### 2.4 Nostrils / snout scrolls (鼻翼 / 鼻头)

- Placement: centre at `(0.10–0.14, 0.18–0.28)`.
- Construction: from the bottom of the nose ridge, a band runs outward horizontally
  to x ≈ 0.18. It then turns **up and back toward the axis** into a `CScroll` of radius
  0.05–0.07 H_p and sweep 240°, curling **clockwise in the right half** (toward the axis
  at the top). The result is a pair of "snout volutes", like a stylised nose seen
  from the front.
- Variant "bulbous snout" (V-b): a raised oval boss `0.12 × 0.08` with a down-hooked
  lower edge at each side.
- Variant "trunk": the snout band continues downward in an S that ends in an outward curl
  (more common on kui, §4.1).

### 2.5 Upper jaw / lip line (上唇 / 口)

- Line: from the snout base `(0.06, 0.14)`, run horizontally outward at y ≈ 0.10–0.16
  to `x_m = 0.32–0.42` (the mouth corner). It then **turns down and back toward the axis**
  in a hook that curls inward (嘴角内卷). Hook radius ≈ 0.04–0.06 H_p, curl 180–270°.
- The **upper lip often curls outward** above the mouth corner as well, which gives a
  double curl: a small up-scroll above and the main inward hook below.
- Width: 0.05–0.08 H_p (about the same as the nose band).
- The mouth is rendered as the **gap below the lip band**, filled with leiwen. The mask is
  usually **open-mouthed with no visible lower jaw**. The bottom of the panel cuts the face.

### 2.6 Fangs (牙)

- Count per half: **1–2** (rarely 3).
  - Inner fang: at `x ≈ 0.10–0.16`, hanging from the lip, pointing **down**, with its tip curving
    slightly toward the axis. Length 0.08–0.12 H_p, base width 0.04.
  - Outer fang / canine: at the mouth corner `x ≈ 0.28–0.38`, larger and pointing **down**
    or **down-and-outward**. Length 0.12–0.18 H_p. On masks with a lower jaw a matching
    **upward** fang rises from the jaw.
- Construction: `Hook` with taper 1.0→0.15 and curl 30–60°. The tip is never a perfect cone.

### 2.7 Lower jaw (下颌) — optional

- Present on perhaps 20–30 % of Anyang masks **[est]**. It is more frequent on masks with a
  body (§2.12) and on gu/zun feet, where the panel is taller.
- Band at `y ≈ 0.02–0.08` from x = 0.05 to 0.30, ending in an upward hook. It may carry
  an upward fang. Usually the bottom panel edge simply truncates the mask, and the generator
  should default to **no lower jaw**.

### 2.8 Eyes (目)

Two families. Pick one per mask.

**(a) 臣-shaped eye (臣字目)** — the most common in Yinxu II–III. **[firm]**

```
        outer canthus tail ───────────────╮
   ╭───────────────────────────────╮      │   (upper lid line extends outward)
  ╭╯  ╭─────────────╮              ╰──────╯
  │   │   ( ●━━ )   │  pupil boss w/ slit
  ╰╮  ╰─────────────╯
   ╰─╮   inner canthus hooks DOWN toward nose
     ╰──╯
```

- Eye centre: `(x_e, y_e) = (0.20–0.28, 0.48–0.58)`.
- Overall eye length (inner canthus tip to outer tail): **0.32–0.45 in x** (in half-mask x
  units). Eye height: **0.12–0.16 H_p**.
- Construction (right half, a single closed plateau outline):
  1. Draw the **almond** (eye opening) as a lens of length `L_a = 0.22 x-units` and height
     `0.11 H_p`, built from two arcs, or as a rounded rectangle with corner radius 0.5 × height.
     The almond's long axis is horizontal or tilted **5–12° up toward the outside**.
  2. The **inner canthus** extends from the almond's inner end as a band that runs toward the
     axis and then **hooks down** (90–150°), ending at about `(0.08, 0.40)`. This is the
     "臣" hook. It is the most diagnostic stroke.
  3. The **outer canthus** extends from the outer end as a **straight horizontal tail**
     0.06–0.12 long. It often ends in a small down-hook or merges with the ear or body.
  4. The **pupil** is a circle of radius `0.035–0.05 H_p` centred in the almond. In Style
     V it is raised as a **domed boss**. A horizontal sunken **slit** crosses it (width
     ≈ groove width, length ≈ 1.2 × pupil diameter, so it slightly overcuts the boss).
     The slit is common but not universal. A plain round boss and a boss with a concentric
     ring groove are both period-correct.
  5. Style IV: the almond is a band outline (stroke) with the pupil as a filled disc
     flush with the surface.

**(b) Round / oval boss eye (圆目 / 突目)** **[firm]**

- A domed boss with radius `0.06–0.09 H_p`, height 2–6 mm above the plateau, at the same centre.
  It has no canthus hooks, or only a small inner hook. It is common on V-b smooth faces, on
  dissolved masks, and on small friezes. The pupil is either a small ring/slit or omitted.
- Avoid a perfect hemisphere that is too large. Real bosses are **flattened domes**
  (height/radius ≈ 0.3–0.5).

Placement rules:

- The eyes are the **largest single relief mass and sit roughly at mid-height**. Never put
  them above y = 0.62 or below y = 0.42.
- The inter-pupil distance in full-mask terms is about `2 × x_e × (W/2)`. It reads correctly at
  **0.35–0.50 of the full mask width**.

### 2.9 Eyebrows (眉)

- Placement: above the eye, `y ≈ 0.64–0.74`, spanning `x ≈ 0.10 → 0.40`.
- Shapes:
  - **Plain arched band**: rising toward the outside, ending in an up-curl or down-hook.
  - **Kui-eyebrow**: the eyebrow is drawn as a small profile kui facing the axis (common
    in Yinxu III).
  - **Absent**: the horn sits directly on the eye (very common).
- Width: 0.04–0.06 H_p (thinner than the horn).

### 2.10 Horns (角) — complete catalogue

All horns are anchored at a **horn root** at about `(0.12–0.20, 0.70–0.78)`, just above and
inside the eye, next to the forehead shield. The horn occupies the upper band
`y ∈ [0.70, 1.0]` and extends outward to `x_h_max`. Taxonomy follows Chen Gongrou & Zhang
Changshou (1990), Ma Chengyuan (1988) and Zhu Fenghan.

| # | Name | Chinese | Shape construction (right half) | Extent | Period frequency |
|---|---|---|---|---|---|
| H1 | **C-horn / outward-curled horn** | 外卷角 | band rises from root up-outward, arcs over at y≈0.95 and **curls down and outward** into a CScroll of 1–1.5 turns at x≈0.45–0.55, y≈0.80 | x to 0.55 | very common Yinxu I–III |
| H2 | **Inward-curled ram horn** | 内卷角 / 羊角 | band rises up-outward to x≈0.40, then **curls back toward the axis and down**; spiral centre at (0.30, 0.82), 1–1.5 turns. Ram-horn grooves = parallel sunken arcs along the curve | x to 0.45 | very common Yinxu II–III; dominant on V-b |
| H3 | **Ox / buffalo horn** | 牛角 | thick crescent: root broad (0.12–0.16 H_p), rises outward and **sweeps up to a sharp point** at (0.55–0.70, 0.95–1.0), tip curving back toward axis slightly; inner edge concave | x to 0.70 | common Yinxu II–IV; heavy masks, fangding |
| H4 | **Bottle horn** | 瓶形角 / 瓶角 | vertical horn shaped like a **bottle/vase**: narrow neck at root (0.05 wide), swelling to a rounded body (0.10–0.14 wide), with a small flat or knobbed cap; often stands near-vertical just outside the shield at x≈0.12–0.22, y 0.72–1.0 | x to 0.25 | Yinxu II–III; also on dragon heads (e.g. Fu Hao) |
| H5 | **T-horn / mushroom horn** | 蘑菇形角 / T形角 / 菌状角 | vertical stem (0.04 wide) topped by a **horizontal cap** (0.16–0.22 wide, 0.05–0.07 tall) whose ends curl down; looks like a "T" or mushroom | x to 0.28 | Yinxu (common on kui and on small masks) **[firm for kui; moderate for taotie]** |
| H6 | **Kui-dragon horn** | 夔龙角 | the horn **is a small profile kui** lying along the top of the mask, head toward the axis above the shield, tail outward and upturned; body band 0.06–0.08 H_p | x to 0.75 | Yinxu II–III |
| H7 | **Serpent / coiled horn** | 蛇形角 / 卷曲角 | a band forming an **S or full coil** (2 turns) above the eye; sometimes with a snake head at the end | x to 0.50 | Yinxu, less common **[moderate]** |
| H8 | **Giraffe-like knob horn** | 长颈鹿角 / 柱角 | short **vertical post with a rounded knob** (ossicone): stem 0.04–0.05 wide, knob circle r≈0.04 | x to 0.22 | uncommon; small masks, animal heads in the round **[moderate]** |
| H9 | **Branched / antler horn** | 分枝角 / 鹿角 | stem with 2–3 short forward tines | x to 0.45 | rare in Yinxu taotie; more in sculpture **[moderate]** |
| H10 | **Zig-zag / bent horn** | 曲折角 | squared Z-shaped band, horizontal–vertical–horizontal, ending in a hook | x to 0.50 | Yinxu, especially dissolved masks **[moderate]** |
| H11 | **Leaf-horn** | 叶形角 | a leaf/blade shape pointing up-out, can be confused with the ear | x to 0.40 | Yinxu I–II **[uncertain naming]** |

In Style V the horn surface carries 1–3 sunken lines parallel to the contour, ending in
the terminal spiral. Ox and ram horns sometimes have **transverse ribbing** (V-b, late).
On monumental pieces the horn tip may rise to high relief (+5–20 mm) and break the panel edge.

### 2.11 Forehead shield / crest (额饰, 菱形)

- Centred on the axis at `y ≈ 0.74–0.90`, sitting on top of the nose ridge.
- Variants:
  - **Lozenge (菱形)**: diamond with half-width 0.05–0.08 and height 0.10–0.14. Inner
    sunken diamond or central vertical groove. **Most diagnostic Yinxu II–III.**
  - **Shield / spade**: an inverted rounded trapezoid.
  - **Small inverted cicada or inverted mini-taotie** stacked on the axis.
  - **Vertical crest with hooks**, continuous with the flange.
- When there is a central flange, the shield becomes the flange's base. Draw it as a slight
  widening of the plateau around the flange root.

### 2.12 Ears (耳)

- Placement: just outside the outer end of the eye and below the horn, at
  `(0.38–0.50, 0.56–0.72)`.
- Shape: a **leaf / teardrop** whose point is **up-and-outward**. Length 0.12–0.18 H_p,
  width 0.06–0.08. It has a central sunken line, or a small inner spiral at the base.
- Variant: **C-ear**, a small CScroll opening downward.
- Often omitted when a body is present: the body starts where the ear would be.

### 2.13 Body band, tail, leg, claw, quills (身, 尾, 足, 爪, 羽脊)

**Body-attached ("连体", split-body) taotie** — the canonical Style V form:

- **Body**: a horizontal band starting behind the ear at `x ≈ 0.45–0.50` and running to
  `x ≈ 0.88–0.95`. The centreline is at `y ≈ 0.58–0.72` and the band width is 0.10–0.16 H_p,
  thicker than the face bands.
- **Tail**: at the outer end the band **turns up** (rarely down) through 90–180° into a
  spiral or a **forked tail** (two hooks, one up and one down: 歧尾). Tail end at
  `(0.90–1.0, 0.80–0.98)`.
- **Dorsal quills / plume hooks** (背鳍 / 羽状钩): 2–4 small `Hook`s rising from the top
  edge of the body, **pointing backward (outward)**, spaced 0.08–0.12, height 0.06–0.10.
- **Leg**: a vertical band hanging from the body at `x ≈ 0.50–0.65` down to y ≈ 0.08. It is
  slightly bent forward (toward the axis), with knee at about mid-height.
- **Claw**: at the foot, 2–3 hooked toes (`Hook`, curl 90–150°) pointing **forward
  toward the axis**, plus often one rear spur. Total claw span 0.10–0.14.
- Leftover areas (under the body, behind the leg, above the tail) are filled with leiwen
  or with **small floating hooks and kui fragments**.

**"Dissolved" / disjoint taotie (分解式 / 散列式兽面)** — Bagley's dissolved mask:

- The **same components**, but each is an **isolated plateau island** on a continuous
  leiwen sea with **no shared outline**. Typical islands are the nose ridge and shield,
  eye with canthus hooks, eyebrow, horn, ear, mouth-corner hook, body segments, and quills.
- Gaps between islands: 0.03–0.08 H_p, all leiwen-filled.
- This mode is common on Style IV/V-a in Yinxu II. Recognition depends almost entirely on
  the **eyes**, which must remain the dominant masses.

**"Split-body" / two-kui taotie (双夔合成)**:

- Each half is a **complete profile kui dragon** (§4.1) with its head at the axis and
  its body extending outward. The two kui meet **nose to nose** (in the jaw region) at the
  flange, and their two inner-facing profile eyes become the "frontal" pair. In this mode
  the half-mask's eye is the **kui eye**, the lip is the **kui upper jaw**, the horn is the
  **kui crest**, and the body/leg/tail are the kui's. Use it as a separate config that
  shares the kui generator.

**Frontal "head-only" taotie (独立兽面)**: face components only (nose, eyes, horns,
mouth, ears), with no body. The face occupies x ∈ [0, 0.55–0.65]. The remainder of the panel
(x > 0.6) is filled with a **vertical kui** (head down or head up) or with leiwen.

### 2.14 Canonical Anyang configurations (pick one per panel)

Ids are for the generator. Frequencies are rough **[est]**.

| Id | Name | Style | Eye | Horn | Shield | Body | Lower jaw | Other | Typical host |
|---|---|---|---|---|---|---|---|---|---|
| T1 | Classic split-body, C-horn | V-a | 臣, slit boss | H1 | lozenge | yes, tail up, 2–3 quills, leg+claw | no | flange on axis | ding/gui belly, you belly, lei belly |
| T2 | Ram-horn, body | V-a/V-b | 臣 | H2 | lozenge | yes | no | ears omitted | zun, lei, fangyi body |
| T3 | Ox-horn heavy mask | V-b | round boss / 臣 | H3 | shield | short body or none | sometimes | high-relief horns | fangding, large ding, monumental |
| T4 | Bottle-horn mask | V-a | 臣 | H4 | lozenge | yes | no | kui in remaining x>0.6 | ding, gu foot, jia |
| T5 | Kui-horn mask | V-a | 臣 | H6 | crest | no (kui is the horn) | no | — | gui, pou, zun |
| T6 | T-horn head-only | V-a | 臣 | H5 | lozenge | no | no | vertical kui at edge | gu middle, jue/jia belly |
| T7 | Dissolved mask | IV or V-a | 臣 or round | H1/H10 | small lozenge | fragments | no | all islands | jia, jue, gu, early ding |
| T8 | Two-kui split-body | V-a | kui eye | kui crest | — | kui bodies | kui lower jaw | — | narrow belly bands, gu middle |
| T9 | Flat band mask | IV | 臣, flush | H1/H2 | lozenge | yes | no | flush wide bands on fine leiwen | Fu Hao-horizon ding/jia |
| T10 | Inverted mask in blade | V-a | 臣 | H1 tiny | — | no | no | vertically stretched, fits triangle | gu/zun rising blades |

---

## 3. Leiwen (雷纹 / 云雷纹) ground

### 3.1 The unit spiral

```
 angular (雷纹)            rounded (云纹)
 ┌──────────┐             ╭──────────╮
 │ ┌──────┐ │             │ ╭──────╮ │
 │ │ ┌──┐ │ │             │ │ ╭──╮ │ │
 │ │ │  │ │ │             │ │ ╰╮ │ │ │
 │ │ └──┘ │ │  …exit       │ ╰───╯ │ │
 │ └──────┘ └───           ╰───────╯ ╰───
```

- Line width `w` (raised or reserved metal line) **≈ gap width g**, so the ratio is about **1:1**
  (range 0.8:1 to 1.3:1). The metal lines are the *raised* surface. The grooves are the
  sunken part. In a rubbing the metal lines print dark.
- Pitch `p = w + g` = **0.8–2 mm** on 20–40 cm vessels (typical 1.0–1.4), and up to 3 mm on
  monumental pieces.
- Turns per unit: **2–3.5** (typical 2.5). Unit footprint ≈ `(2·turns+1)·p`, which gives
  **4–9 mm** squares.
- Segment-length recursion from the centre outward: `p, p, 2p, 2p, 3p, 3p, …`. Stop when the
  bounding box reaches the target cell. Exit along one side as a straight lead line.
- Corner radius: 0 (angular, the majority on Yinxu bronzes) to 0.5p (rounded). Real
  castings are **never perfectly sharp**, so use a minimum fillet of 0.1–0.15 p.
- Centre: a short straight stub or a tiny hook (do not leave a dot).
- Irregularity: segment lengths jitter ±5–10 %, lines are not perfectly parallel (±1–2°),
  and cell sizes vary ±15 %. This hand-carved-in-the-mould look is essential (§7).

### 3.2 Packing rules for irregular regions

The ground is **not a regular tiled meander**. It is a packing of units adapted to each leftover
area. Suggested algorithm:

1. Compute the leftover region R (panel minus motif plateau dilated by `g`).
2. **Decompose R** into convex-ish cells by recursive splitting along the medial axis or
   the longest dimension, until each cell's short side is between `s_min = 4p` and
   `s_max = 9p`.
3. Classify each cell:
   - **near-square (aspect < 1.6)**: a single `SqSpiral` fitted to the cell. Its turn count
     follows from the size.
   - **rectangle (1.6–3.2)**: an **S-pair (双联雷纹)**, two spirals of opposite handedness
     joined by a shared diagonal or straight lead line, like `⟲—⟳`.
   - **long strip (> 3.2)**: a chain of S-pairs, or a **T-hook strip**, which is a centre line
     with alternating perpendicular hooks.
   - **triangle / wedge**: a **triangular spiral** (三角雷纹), which is a spiral whose
     segments run parallel to the triangle edges, 1.5–2.5 turns.
   - **sliver (< 3p wide)**: single parallel lines following the motif contour,
     ending in a hook (a "contour echo"). Width under 2p: leave it as one groove.
4. Units of adjacent cells **interlock**. A lead line of one spiral may run into the
   outer turn of its neighbour. Avoid leaving a uniform grid of separate squares.
5. Orientation: within a mirrored panel, the ground is **mirrored too** (it is
   approximately symmetric, ±10 % jitter). Spirals in the right half curl with the opposite
   handedness to those in the left half.
6. Ground lines meet the motif edge at **right angles or parallel**, never at random
   oblique angles.

### 3.3 Line treatment *on* the motif (Style V secondary lines)

- **Contour-echo grooves**: 1–2 sunken lines parallel to the plateau outline at an
  inset of 1–1.5 × p. They end in a small hook or spiral where the band terminates.
- **Centre-line groove** along long bands (body, horn, lip).
- **Small hooks and spirals** in wider plateau areas (eye surround, shield, horn root).
- **Scales / C-marks** on body bands of dragon or kui type: rows of small `⊂` or `∩` cuts,
  spaced 2–3 p. These are less common on taotie bodies than on kui/snakes.
- Groove width = ground groove width `g`. Groove depth is 0.3–0.6 mm.
- In Style IV (flush), the motif bands are **reserved wider lines** (metal) with
  0–1 internal grooves, and the ground is the finer pattern.

---

## 4. Companion motifs

### 4.1 Kui dragon (夔纹 / 夔龙纹)

A profile one-legged quadruped/dragon. It is the workhorse of narrow friezes and fills the side
zones of taotie panels.

```
   crest(T/bottle)
      ┃      quills ʌ ʌ
  ╭───┸──╮━━━━━━━━━━━━━━━━━━━━━━━╮  tail up-curl
  │ 臣◉   ┝━━━━━━━━━━━━━━━━━━━━━━━╯↺
  ╰─╮  ╭─╯  ┃ leg
 jaw↶  ↷    ┃
 (open)     ⌐ claw (toes forward)
```

- Bounding box: **length 3–5 × height** (in friezes, frieze height h_f = 8–25 mm).
- Head: at the front end, occupying about `0.25–0.35` of length. It has a 臣 eye (or a round eye
  in small friezes) with eye diameter ≈ 0.25–0.35 h_f. The **open jaws**: the upper jaw is a band
  curling **up** at its tip, and the lower jaw is a band curling **down/back**. The mouth gap is
  filled with leiwen.
- Crest/horn on top of head: T-horn (H5), bottle horn (H4), or a backward-pointing hook.
- Body: a horizontal band of width 0.20–0.30 h_f with 1–3 quills on top.
- Leg: one leg below the body, near the head, with a forward claw.
- Variants:
  - **K1 tail-up**: tail curls up and back over the body (most common).
  - **K2 tail-down**: tail turns down into a spiral.
  - **K3 trunked (长鼻夔)**: the upper jaw elongates into an **upturned trunk** that rises
    and coils.
  - **K4 beaked (鸟喙夔 / 鸟首夔)**: a hooked beak replaces the jaws.
  - **K5 S-kui**: body S-bends (vertical kui, used at the outer edges of taotie panels with the
    head down or up).
  - **K6 "dissolved kui"**: islands, like T7.
- Friezes: the kui **face the centre line** of the panel (toward a flange or a small central
  mask/animal head), in mirrored pairs. A typical neck frieze per mould section is a
  **kui pair + central small mask** or **kui pair facing a flange**.

### 4.2 Cicada (蝉纹)

- Elongated triangle or teardrop: **length:width ≈ 2.5–3.5:1**.
- Head at the broad end: two **large round eyes** (each about 0.25 of width) at the corners,
  with a small square/trapezoid head between them.
- Body: a central spine with **chevrons** (∧ cuts) or paired hooks along it, 3–6 segments,
  tapering to a point. Optional small leg hooks at the sides.
- Uses: a **frieze of horizontal cicadas** (head facing in a consistent direction or toward the centre)
  on ding necks/legs, and as fillers inside blades with the **head toward the blade base**.
  **[est; most hanging-blade examples I recall have the head at the base]**

### 4.3 Rising / hanging blades (蕉叶纹 / 三角纹)

- Isosceles triangles with **height:base ≈ 2:1 to 3.5:1**, apex up (rising: gu/zun
  trumpets) or apex down (hanging: lower belly of ding, lei, hu, gu foot occasionally).
- On gu/zun necks, the blades rise from a bowstring and their apices reach to about 0.85–0.95 of the
  zone height. **Number around the circumference: 4 (on flanged gu, one per quadrant),
  typically 4–8.** **[est]**
- Fill:
  - **inverted / vertically stretched taotie (T10)**: eyes in the wider lower part,
    nose ridge on the blade axis, horns stretched up toward the apex. **[uncertain: orientation of
    the face varies; both "face upright, crown at apex" and the inverse occur]**
  - **cicada** (§4.2)
  - **leiwen + contour echo** only (Style IV)
- Blade outline in Style V: a raised border band of 1–2 p width with the fill inside.
  Simpler blades are just contour grooves.

### 4.4 Whorl circle (火纹 / 囧纹 / 涡纹)

```
     ╭──────╮
   ╭╯ ╭──╮  ╰╮
   │ ⟲ ( ○ ) ⟳│     4–6 comma-spokes rotating the same way
   ╰╮ ╰──╯  ╭╯
     ╰──────╯
```

- A raised **domed disc** with diameter 12–30 mm on 20–40 cm vessels, and 40–60 mm on jia
  post caps or large pieces.
- Centre: a small circle (0.2–0.25 D) or boss.
- **4–6 curved spokes** (most often 5? **[uncertain: 4 and 6 are also frequent]**), each
  a comma-shaped sunken groove starting near the centre circle and sweeping **in the same
  rotational direction** to the rim, covering 60–90° of arc. Spokes widen outward.
- Bands: whorls alternate with kui or with **四瓣目纹 / 目纹** units. Typical shoulder band on
  lei, pou, jia and you: `whorl – kui – whorl – kui …`, about 6–12 whorls around the vessel.

### 4.5 Boss-in-lozenge (乳钉雷纹 / 斜方格乳钉纹 / 百乳)

- A diagonal lattice of **raised double lines** (or single ridges) forming lozenges with
  side length 12–25 mm. The lattice angle is often near 60–70° from horizontal.
- Each lozenge: leiwen fill plus a **conical/domed nipple** (乳钉) at the centre. Nipple base
  diameter 3–8 mm, height 2–8 mm, pointed in Yinxu III–IV.
- Hosts: gui bellies, ding bellies (Yinxu II–IV), and the borders of fangding plain panels.
- **Fangding panel variant**: a plain central rectangle framed on its sides and bottom by 2–3
  rows of free nipples (no lattice), in a U or L arrangement.

### 4.6 Bowstrings (弦纹)

- 1–3 raised **thin ribs**, width 1–2 mm, height 0.5–1 mm, with rounded or flat tops.
  Spacing 3–6 mm.
- They separate zones and bound décor bands top and bottom. On "plain" vessels (gu, jue) they are the
  only décor.

### 4.7 Birds (鸟纹), Shang type

- **Small, compact, profile**, facing the centre line. Length:height ≈ 1.3–2:1.
- Hooked beak, round eye (or small 臣 eye), a **short crest** (a single hook or a small
  T), wing as a hooked band, and a **tail turned down** into a short hook or fork. One
  claw is visible.
- Frieze use: like kui, in mirrored pairs on narrow neck/foot bands, height 8–20 mm.
- **Do not** use the large Western Zhou "long-crested phoenix" with extended trailing plumes
  (mid-10th c. BC onward). It is the most common anachronism.

### 4.8 Snake (蛇纹)

- **Triangular head** seen from above with two eyes, and a sinuous body band.
- Body surface: scales or rows of C-hooks. Used on handles, inside dishes (pan), and in narrow
  bands as **coiled serpents** (a body spiral with the head at the centre).

### 4.9 Silkworm (蚕纹)

- A short, fat, segmented band with 4–8 transverse segments, a round head with two small eyes,
  and a slightly curved shape. It appears in narrow bands on Yinxu vessels, especially
  around feet and lips. **[moderate frequency]**

### 4.10 Eye-and-diagonal band (目雷纹 / 斜角目雷纹)

- A horizontal band containing repeated **eyes** (臣 or round), each flanked by **diagonal
  leiwen strips** at about 45°. The pattern alternates direction in mirrored pairs: eye — "\\"
  leiwen — "/" leiwen — eye.
- Band height 10–20 mm. It is typical on ding and gui necks and on gu middles in Yinxu I–II.

### 4.11 Scale pattern (鳞纹)

- Overlapping **U- or ∩-shaped scales** in staggered rows, with scale width about 2–4 p.
- In Shang it is **limited to creature bodies** (dragons and snakes on pan basins, handles, some kui).
  **Avoid it as an all-over vessel pattern** (that is Western Zhou / Eastern Zhou 重环纹 and 鳞纹).

### 4.12 Square spiral with eye / 四瓣目纹

- A round eye at the centre with four **petal-like hooked lobes** (四瓣) in X arrangement,
  enclosed in a square. Used alternately with whorls in shoulder bands.

---

## 5. Layout rules

### 5.1 General

- **Section = mould sector.** Round vessels are cast in 3 (tripods: ding, jue, jia, li)
  or 4 (gu, zun, lei, you, gui, pou, hu) vertical sectors. Rectangular vessels (fangding,
  fangyi, fangzun) have 4 faces, often each split again at the centre, giving 8 sectors.
- Each sector carries **one mask centred on its vertical centre line** (where there is
  often a flange), or a mask centred on a **seam/flange** spanning two half-sectors. On
  tripods the mask is usually **centred over a leg** **[firm for Yinxu ding; many
  have the leg under a mask, with the "back" mask between legs centred on the third
  seam]**.
- **Bilateral symmetry** applies within each mask and each frieze, never the whole frieze
  mirrored vertically. **Masks are never mirrored top-to-bottom.**
- Register stack, top to bottom: **lip (plain) → neck frieze → bowstrings → main belly
  register → (optional hanging blades) → bowstrings → foot frieze**. Plain bands are normal
  between décor zones.
- Narrow friezes (neck/foot): kui, birds, eye-and-diagonal, whorl-and-kui, cicadas. Each
  pair faces a central axis (a flange, seam or **small sculpted animal head**).
- Main register: taotie (T1–T9), boss-in-lozenge, or a large plain area (Yinxu IV).

### 5.2 Register proportions by vessel type **[est]**

Heights are a fraction of the **décor-bearing height** (body or bowl height, excluding the
legs on tripods and, for gu, the full height).

| Type | Structure | Register heights (top→bottom) | Mask aspect (full W/H_p) | Flanges |
|---|---|---|---|---|
| **Ding** (round tripod, deep belly) | 3 sectors, legs under masks | neck frieze 0.15–0.22 (kui pairs or eye-band) / main belly 0.45–0.60 (T1/T4/T9) or only neck band with plain belly / sometimes hanging blades in lower 0.25 | 2.0–2.6 | 3 or 6, low |
| **Fangding** | 4 faces; legs columnar with mask at top | top frieze 0.20–0.28 (kui pairs facing centre flange, or taotie); side columns and bottom band of nipples; plain centre (Simuwu ding) **or** full-face taotie (Fu Hao fangding) | 1.5–2.0 per face | corners + face centres; legs flanged |
| **Li-ding** (lobed) | 3 lobes, each lobe a mask | lobe mask 0.70–0.85 of lobe height; neck band 0.15 | each lobe 1.1–1.5 (mask stretched vertically) | on lobe centres |
| **Gu** | 4 sectors | trumpet: rising blades 0.40–0.48 + a small frieze (kui/cicada) at the waist end / middle (腹) taotie 0.15–0.20 between bowstrings / foot taotie 0.25–0.32 + bowstrings and plain ring at the bottom | middle: 2.4–3.0; foot: 1.6–2.0 | 4 on middle + foot (Yinxu II+), sometimes on blades |
| **Jue** | 3 sectors (spout, tail, handle) | single belly band 0.35–0.50 of body height (T6/T7); posts with whorl caps | 2.0–2.5 | low on belly at spout/tail axis |
| **Jia** | 3 sectors | neck band 0.30–0.40 (blades or taotie) / belly band 0.35–0.45 (taotie) / post caps with whorls | 1.8–2.4 | 3, low |
| **Zun** (beaker, 觚形尊) | 4 sectors, like a heavy gu | neck blades 0.35–0.45 / belly taotie 0.25 / foot taotie 0.20 | 2.0–2.4 | 4, prominent hooked |
| **Zun** (shoulder, 肩尊 / 大口尊) | 3–4 sectors | neck bowstrings or blades 0.2 / shoulder band with **3 sculpted heads** 0.12 / belly taotie 0.40 / foot 0.15 | 2.0 | 3–4 |
| **Lei** | 4 sectors (round) or 4 faces (fanglei) | neck bowstrings / shoulder whorl+kui band 0.12–0.15 with sculpted heads / belly taotie 0.35 / hanging blades 0.20 / foot band 0.10 | 2.0–2.4 | on fanglei: corners and centres |
| **Pou** | 3–4 sectors | shoulder band 0.15 (whorl/kui) / belly taotie or boss-lozenge 0.50 / foot band 0.15 | 2.2–2.8 | 3–4 or none |
| **You** | 2 sides (oval), swing handle on axis | lid band 0.25 (of lid) / neck band 0.15 with a sculpted head on the front axis / belly plain or taotie 0.50 / foot band 0.12 | 1.8–2.2 | 4 (front, back, sides) on decorated types |
| **Fangyi** | 4 faces, hip-roof lid | lid faces: **inverted taotie** filling the trapezoid / body: upper narrow band (kui or birds) 0.12–0.18 / main taotie 0.55–0.65 / foot band (kui) 0.15–0.20, with an arched cut-out at foot centre | 1.0–1.5 per face (mask nearly square) | 8: 4 corners + 4 face centres, prominent, hooked/notched, continuing onto lid |
| **Gui** (Shang, ring-foot, with or without handles) | 3–4 sectors | neck/rim band 0.20–0.25 (kui + central animal head, or whorl band) / belly taotie or boss-lozenge 0.50 / foot band 0.20 (kui) | 2.2–2.8 | none to 4 low |
| **Hu** | 4 sectors; pierced lugs on neck | neck bands 2 × 0.12 / belly taotie 0.30 / hanging or plain / foot band 0.10 | 2.0–2.4 | sometimes 4 |

Vessel-wide rules:

- Masks on tripods: one per sector, so 3 around. On 4-sector vessels: 4 around.
- Frieze kui count per sector: **2** (one mirrored pair) is the default, or 4 on wide sectors.
- Total ornament coverage on Yinxu II–III ritual vessels: **50–85 % of the outer surface**
  [est]. Lips, interiors and leg lower parts are plain.

---

## 6. Flanges (扉棱)

### 6.1 Placement

- On mould seams (to hide the seam), and **on the axis of each mask** (on the nose ridge).
  On rectangular vessels, flanges also sit on the corners, where the mask halves of adjacent faces
  meet and read as a **corner mask**.
- Flanges run continuously through all registers on fangyi/fangzun/gu. On ding/jia they
  often occupy only the main register.

### 6.2 Profiles

```
 F0 plain        F1 notched/T-scored    F2 hooked "F"         F3 spiky/quilled (late)
   ┃                 ┣━                    ┃╮                      ┃>
   ┃                 ┃ ─                   ┣╯                      ┃
   ┃                 ┣━                    ┃╮                      ┃>
   ┃                 ┃ ─                   ┣╯                      ┃>
```

| Id | Profile (side view) | Front face | Typical | Notes |
|---|---|---|---|---|
| F0 | plain rectangular strip, square or slightly rounded top | plain | Yinxu I–II, small vessels | |
| F1 | **straight with notches**: the outer edge is broken into segments of length s by notches (depth 0.3–0.5 × projection, width 1.5–3 mm). Segments carry **T- or L-shaped scored grooves** on the side faces | 1 groove | **default for Yinxu II–III** | |
| F2 | **hooked**: segments whose upper end curls down into a hook (an "F" or "厂" shape), like a row of flat birds' beaks | 1 groove | Yinxu III–IV, fangyi, zun | |
| F3 | **projecting quills**: tall teeth that curve upward/outward like barbs, with a larger gap between them | — | late Yinxu IV → early Western Zhou | use sparingly for "13th–12th c." |

### 6.3 Dimensions **[est]**

| Parameter | 20–40 cm vessel | Monumental |
|---|---|---|
| Thickness (tangential) | 3–6 | 8–15 |
| Projection beyond the décor surface | 5–15 (gu: 4–8; fangyi: 8–15) | 15–40 |
| Segment pitch (notch spacing) | 6–15, commonly ≈ 1–2 × flange projection | 15–35 |
| Notch depth | 0.3–0.5 × projection | same |
| Score grooves (T/L marks) on side faces | width = groove width g, depth 0.5 | ×2 |

Flange edges are slightly rounded, not knife-sharp. Flange height **follows the register
structure**: a flange segment pattern typically resets at each register boundary, and on
gu and fangyi flanges often **extend beyond the vessel silhouette at the top and bottom
ends** (step out 3–10 mm).

---

## 7. Authenticity checklist ("tells")

**Do**

1. Build every mask as **two mirrored profile halves**. Small asymmetries between the halves
   (±2–5 % in positions and widths) are realistic: the halves were carved separately in the mould.
2. Keep the **eyes dominant**: they have the largest relief, sit at mid-height, have a 臣 shape with a
   **down-hooking inner canthus**, and an almond tilted slightly up-and-out.
3. Use **constant-width bands with squared-round corners** and curled terminals everywhere.
4. Fill all leftover space inside a zone with **irregularly packed leiwen**, varying cell size
   by ±15 % and mixing S-pairs and triangular spirals.
5. Keep **line weight** small and uniform. At gallery scale (a 30 cm vessel on screen)
   leiwen should approach the visible limit, reading as a fine "texture" rather than a pattern.
6. Make the **register structure explicit**: bowstrings and plain bands, with masks centred on
   flanges/seams. Use 3 masks on tripods and 4 on round 4-sector vessels.
7. Make relief **stepped**, not smoothly modelled: flat plateau, near-vertical walls,
   grooves cut into it. V-b gets slight doming only.
8. Respect the **mould-section logic**: décor never crosses a seam with a continuous
   unbroken element (except bowstrings). Flanges sit where sections meet.
9. Use companion motifs in **narrow friezes** with **creatures facing the centre line**.

**Avoid**

1. **Regular Greek-key meanders** as ground. A continuous, uniform 回纹 band is a Qing
   archaistic or modern pastiche signal. Leiwen units are discrete, packed and irregular.
2. **Cartoon round eyes**: a large hemisphere with a white ring, or googly eyes. Pupils are small
   relative to the eye (radius ≈ 0.035–0.05 H_p). Eyes are horizontal almonds, not circles (except T3/V-b).
3. **Vertical mirroring** or 4-fold rotational symmetry of a mask. Taotie are only
   left–right symmetric. The mouth opens down, horns go up and out, and the body runs to the sides.
4. **Line weights that are too heavy** (> 1.5 mm grooves on a 30 cm vessel), or
   **variable-width calligraphic strokes**.
5. **Zhou-period vocabulary**: long-plumed phoenixes, big birds as main motif, 窃曲纹
   (dissolved S-bands without eyes), 重环纹 (overlapping rings), wavy 环带纹 (wave band),
   scale bands all over, 瓦纹 (horizontal fluting), and vessel forms like gui with square bases.
6. **Han / later "cloud scroll" (云气纹)** flowing curves, interlaced dragons (蟠螭/蟠虺
   of Eastern Zhou with tiny interlaced bodies), and gilding or inlay. Turquoise inlay on
   Yinxu ritual vessels is rare (inlay belongs on weapons and fittings).
7. **Empty plain background inside a décor panel** (except V-b small gaps and
   deliberately plain Yinxu IV bands, which are bounded by bowstrings).
8. **Perfect CAD precision**: perfectly sharp corners, identical repeated units, and
   flanges with uniform razor edges all look wrong. Add low-amplitude noise to the line paths
   (±0.05–0.1 mm), plus casting softness.
9. **Motifs off-axis**: a mask whose nose does not sit on a flange or seam, or a kui frieze
   whose creatures all face the same way around the whole vessel (Shang friezes are mirrored
   pairs; continuous same-direction processions are rare and limited to some narrow bands).
10. **Wrong proportion of décor**: an entire vessel covered top to bottom including lip and
   interior. Lips are plain and have a thickened rim.
11. **Characters/inscriptions on the exterior**: Shang inscriptions (铭文) are short, placed
   **inside** the vessel (under the lip, inside the handle, or on the inner wall), and are often a clan
   sign or "Fu Hao" (婦好) / "Si Mu Xin" (司母辛).

---

## 8. Construction recipe (end-to-end, per panel)

```
input: panel (W, H_p, curvature), style ∈ {IV, V-a, V-b, V-c}, config ∈ T1..T10,
       seed, pitch p, motif height h_m
1. Choose half-mask aspect A = (W/2)/H_p; lay out components in normalised coords
   (§2.3–2.13) using config table T*; jitter positions ±0.01–0.02.
2. Build component outlines from primitives (Band/SqSpiral/Hook/CScroll/Blade).
3. Union them into motif plateau polygons. Style V-c: keep as separate islands with a
   minimum gap of 0.03 H_p.
4. Mirror to the left half; apply small independent jitter to the left half (±2 %).
5. Compute the leftover region R = panel − dilate(motif, g); pack leiwen (§3.2).
6. Add secondary grooves on the plateau (contour-echo inset 1–1.5 p; centre lines;
   terminal spirals) — V-a dense, V-b sparse, IV none (flush wide bands instead).
7. Height map: ground surface 0; leiwen grooves −d_g; plateau +h_m (flat; V-b dome);
   plateau grooves h_m − d_g; eye boss + h_eye; horn tips + h_horn.
8. Wrap onto the vessel sector surface (cylindrical/conic UV), centre on flange/seam.
9. Add flange geometry (§6) on the axis and seams; add bowstrings at register edges.
10. Hand the height map + a "recess mask" (grooves, ground) to the patina shader:
    recesses accumulate cuprite/malachite/earth; plateau tops are wear-polished.
```

---

## 9. Reference pieces (to calibrate against)

| Piece | Where | Why it matters |
|---|---|---|
| Houmuwu (Simuwu) fangding, H 133 cm, 832.84 kg | National Museum of China | monumental scale; plain centre with nipple frame; kui frieze; ox-horn masks on legs |
| Fu Hao tomb M5 bronzes (fangyi, ou-fangyi, owl zun, gu, jia, fangding) | Institute of Archaeology, CASS / Henan Museum | Yinxu II benchmark, with Styles IV and V side by side |
| Huayuanzhuang East M54 (Ya Chang) | Anyang | Yinxu II, large set, heavy flanges |
| Ding, Met 49.135.10, 12th–11th c. BC, H 25.4 cm (20 cm without handles) | Metropolitan Museum | typical small ding; checked via the Met collection API |
| Freer/Sackler Shang holdings (Freer F1911.x / Arthur M. Sackler collections) | National Museum of Asian Art | Bagley 1987 catalogue; Gettens 1969 technical study |

---

## 10. Annotated sources

- **Max Loehr, "The Bronze Styles of the Anyang Period (1300–1028 B.C.)", *Archives of
  the Chinese Art Society of America* 7 (1953): 42–53.** This is the origin of Styles I–V. Its
  definitions underlie §1.2.
- **Robert W. Bagley, *Shang Ritual Bronzes in the Arthur M. Sackler Collections* (1987).**
  The best technical-stylistic analysis: piece-mould décor, how Styles IV/V emerge,
  the dissolved taotie, and the role of flanges. Primary for §§1, 2.13, 5, 6.
- **Robert Bagley, "Shang Archaeology", in *Cambridge History of Ancient China* (1999).**
  Chronology and Yinxu phasing.
- **Jessica Rawson, *Chinese Bronzes: Art and Ritual* (1987); *Western Zhou Ritual
  Bronzes from the Arthur M. Sackler Collections* (1990).** Rawson is good on the Shang/Zhou
  transition and the motifs to avoid (§7).
- **陈公柔、张长寿, 〈殷周青铜容器上兽面纹的断代研究〉, 《考古学报》1990.3.** The standard
  typology of taotie by horn type and body type, with dating. Primary for §2.10 and §2.14.
- **马承源 (Ma Chengyuan), 《中国青铜器》 (1988).** Motif glossary (夔纹, 蝉纹, 火纹, 目雷纹, 乳钉雷纹,
  蕉叶纹) and vessel nomenclature.
- **朱凤瀚, 《古代中国青铜器》 (1995; rev. 《中国青铜器综论》 2009).** Typology of vessel
  shapes and décor zoning (§5).
- **中国社会科学院考古研究所, 《殷墟妇好墓》 (1980); 《安阳殷墟花园庄东地商代墓葬》 (2007);
  岳洪彬, 《殷墟青铜礼器研究》 (2006).** Excavation-report data for proportions and
  phasing. Yue Hongbin is the best on Yinxu décor statistics.
- **Rutherford J. Gettens, *The Freer Chinese Bronzes, vol. II: Technical Studies*
  (1969); W. T. Chase, *Ancient Chinese Bronze Art: Casting the Precious Sacral
  Vessel* (1991).** Casting, mould sections, surface. Hand these to the patina researcher too.
- **Sarah Allan, *The Shape of the Turtle* (1991).** For the iconographic debate only.
  It is not needed for geometry.
- **陈梦家 (Chen Mengjia), 《殷周青铜器分类图录》 / *Yin-Zhou qingtongqi* (1962/1977).**
  A large photographic corpus useful for proportion sampling.
- Web check: Metropolitan Museum Collection API (v1.1 search, object 61239 = acc.
  49.135.10, Ding 12th–11th c. BC). Wikimedia APIs were rate-limited during this pass,
  so no image-level measurements were taken from Commons. All millimetre figures marked
  [est] are calibrations from the literature and photographs, not measurements.
