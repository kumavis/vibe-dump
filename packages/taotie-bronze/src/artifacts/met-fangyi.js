// Met fangyi 1974.268.2a, b — rectangular lidded wine container, 12th c. BCE.
// Reconstruction from reference/met-fangyi/dossier.md (measured from the Met's
// three photographs) and profile.json. Units mm, Y up, front (+Z) = a long face.
//
// Form: a straight-walled box leaning out 1.4°/side on the long axis and 1.8° on the short one, the foot
// band flush with the wall and notched on every face (r 4 corners); an OGIVAL cushion lid (kit hippedLid
// `section` + `pillow`) rising off a 2 mm lip flush with the rim, long ridge, near-gable ends; a miniature
// ogival roof knob on a waisted post; 18 comb flanges (4 pitch slots) running unbroken through the registers.
// Measurements: reference/met-fangyi/dossier.md § b.7.
// Décor (round 5): TRACED off the flattened photographs (reference/met-fangyi/faces/) in face mm and
// drawn with the kit's rounded vocabulary — met-fangyi/traced.js; the knob's line work is decor.js.

import * as THREE from 'three'
import { knobLines } from './met-fangyi/decor.js'
import { renderTraced, bodyFace, refit, MAIN_LONG, FRIEZE_LONG, FOOT_LONG, END_FIT, END_EYE, END_HORN, LID_LONG_FIT, LID_LONG_EYE, LID_END_FIT, LID_END_EYE, LID_END_DROP } from './met-fangyi/traced.js'

const H = 254
const FOOT_H = 33 // foot band (its own part): ground → top of the lower separator's middle
const RIM_Y = 162.2
const LID_Y = 162.8 // ~0.6 mm hairline between body rim and lid skirt
// walls lean out going up, deg per side. Long axis (x, the end faces): 1.4° — a pinhole camera solved on
// three-quarter.jpg jointly with the wall half-widths gives 1.35–1.47° for any camera distance 0.7–1.6 m.
// Short axis (z, the long faces): 1.8° — side.jpg (near-orthographic) shows the end-view outline 0.4°/side
// steeper than a 1.4° model shot through the same camera (flange tips 52.2 → 58.4 mm, foot → rim).
// The rim plan (139 × 102 mm) is kept: the lid sits flush on it.
const TAPER_X = 1.4, TAPER_Z = 1.8
const W0 = 132.6 // long-face wall at the foot top (y 33)
const D0 = 101.916 - 2 * (RIM_Y - FOOT_H) * Math.tan((TAPER_Z * Math.PI) / 180) // end-face wall at the foot top (93.8)
const WALL_H = RIM_Y - FOOT_H
const WALL = 3
// lid: a thin lip (2 mm) on the hairline seam, then an ogival cushion roof — measured off side.jpg's end
// outline (reference/met-fangyi/profile.json lidSection): b = B (1 − t^1.325)^0.8, t = height fraction;
// 73° at the eave, 53° mid-slope, 30° at the ridge (the old quadratic was 59° → 29° from 4.8 mm higher)
const SKIRT = 2.0
const EAVE_Y = LID_Y + SKIRT // 164.8
const RISE = 224.1 - EAVE_Y // eave line → ridge line (59.3)
const OGIVE = (alpha, beta, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n; return [1 - Math.pow(1 - Math.pow(t, alpha), beta), t] })
const SECTION = OGIVE(1.325, 0.8)
const PILLOW = { long: 1.0, short: 0.8 } // mm: each slope swells along its length (three-quarter.jpg; side.jpg outline +1 mm)
const CONVEX = -0.5 // legacy `concave` (unused once `section` is given)
const RIDGE = 100 // ridge length (mm)
// knob: side.jpg end outline (profile.json, y 238 → 254) is the same ogive as the lid: 9.2 / 7.3 / 5.0 / 2.1 mm
// half-width at t 0.24 / 0.47 / 0.71 / 0.94 (model 9.5 / 7.4 / 4.8 / 1.4); post slightly waisted (side.jpg 6.8 → 6.2 mm)
const KNOB = { width: 27, depth: 21.7, ridge: 16, rise: 15.4, skirt: 3.1, convex: -0.25, section: OGIVE(1.3, 0.8), pillow: 0.4, post: { height: 10.9, width: 12, depth: 7.2, waist: 0.1 }, embed: 2.6 }
const FLANGE_NOTCH = { shape: 'score', pitch: 4, depth: 0.7, width: 1.2 }

const tanT = Math.tan((TAPER_X * Math.PI) / 180) // long-axis lean (end faces)
const tanZ = Math.tan((TAPER_Z * Math.PI) / 180) // short-axis lean (long faces)

export default {
  id: 'met-fangyi',
  order: 2,
  title: 'Rectangular Wine Container (Fangyi)',
  titleZh: '方彝',
  type: 'fangyi',
  date: '12th century BCE',
  period: 'Late Shang dynasty, Anyang period (Yinxu III by style)',
  findspot: 'Not documented (unprovenanced); attributed to Anyang on style',
  collection: 'The Metropolitan Museum of Art, New York — Purchase, Arthur M. Sackler Gift, 1974',
  accession: '1974.268.2a, b',
  dimensions: { h: 254, w: 152, d: 114 },
  blurb:
    'A small wine container built like a roofed shrine: a straight box flaring slightly upward, its foot cut by a notch on every face, under a cushioned hipped roof crowned by a miniature roof on a post. ' +
    'Eighteen finely toothed flanges run unbroken from the notched foot to the ridge, and every mask part — fat round-cornered G-shaped horns whose flat tops are cut with chains of small spirals, pillow-shaped bosses with slit pupils, hooked jaws — floats as a separate island on big squared thunder spirals. ' +
    'Reconstructed from the Met’s three photographs: the walls, lid, flanges and décor are measured, but the inside (floor height, lid seat, the cast clan sign) and the hidden back faces are inferred.',
  defaultPatina: 'met-fangyi',
  views: {
    // pinhole camera solved on 10 landmarks of the 2882 × 3842 original (rim / base corners of the long face, end-face
    // back edge and notch jamb, knob top), jointly with the long-axis wall widths: camera ≈ 1.0 m from the axis at
    // 270 mm above the ground (el 8.2° toward the target), az 26.8°, full-frame vertical fov 23° (11 px rms)
    'three-quarter': { azimuth: 26.8, elevation: 8.2, fov: 23, fit: 1.29, target: [0, 129.6, 0], ref: 'three-quarter.jpg' },
    // side.jpg is the same studio set-up seen square to the +X end (no long face visible, el ≈ 5°): the same ≈ 1 m
    // camera distance as the three-quarter solve gives fov 20 at this framing (it was 26, ≈ 0.8 m)
    side: { azimuth: 90, elevation: 5, fov: 20, fit: 1.3, ref: 'side.jpg' },
    front: { azimuth: 0, elevation: 4, fov: 26, fit: 1.25 },
    top: { azimuth: 20, elevation: 62, fov: 26, fit: 1.25 },
    'detail-face-short': { azimuth: 90, elevation: 3, fov: 26, fit: 0.33, target: [68, 81, 0], ref: 'detail-face-short.jpg' },
    'detail-face-long': { azimuth: 21, elevation: 8, fov: 26, fit: 0.36, target: [0, 81, 52], ref: 'detail-face-long.jpg' },
    'detail-frieze-short': { azimuth: 90, elevation: 3, fov: 26, fit: 0.2, target: [69, 145, 0], ref: 'detail-frieze-short.jpg' },
    'detail-frieze-long': { azimuth: 21, elevation: 8, fov: 26, fit: 0.27, target: [0, 145, 52], ref: 'detail-frieze-long.jpg' },
    'detail-foot-short': { azimuth: 90, elevation: 4, fov: 26, fit: 0.2, target: [66, 17, 0], ref: 'detail-foot-short.jpg' },
    'detail-foot-long': { azimuth: 21, elevation: 9, fov: 26, fit: 0.27, target: [0, 17, 50], ref: 'detail-foot-long.jpg' },
    'detail-lid-end': { azimuth: 90, elevation: 6, fov: 26, fit: 0.33, target: [60, 208, 0], ref: 'detail-lid-end.jpg' },
    'detail-lid-long': { azimuth: 21, elevation: 10, fov: 26, fit: 0.36, target: [0, 208, 25], ref: 'detail-lid-long.jpg' },
    'detail-flanges': { azimuth: 65, elevation: 8, fov: 26, fit: 0.32, target: [68, 128, 0], ref: 'detail-flanges.jpg' },
    'detail-knob': { azimuth: 21, elevation: 10, fov: 26, fit: 0.14, target: [0, 240, 0], ref: 'detail-knob.jpg' },
    // flat faces (KIT.md § Flat faces): head-on, framed on a face rectangle in mm; ref = the flattened photograph
    // (reference/met-fangyi/faces.json → tools/faces.mjs --rectify)
    'face-long': { face: { center: [0, 81, 48.4], normal: [0, -0.0314, 1], up: [0, 1, 0.0314], width: 152, height: 166 }, ref: 'faces/face-long.jpg' },
    'face-long-frieze': { face: { center: [0, 145, 50.4], normal: [0, -0.0314, 1], up: [0, 1, 0.0314], width: 152, height: 38 }, ref: 'faces/face-long-frieze.jpg' },
    'face-long-main': { face: { center: [0, 81, 48.4], normal: [0, -0.0314, 1], up: [0, 1, 0.0314], width: 152, height: 100 }, ref: 'faces/face-long-main.jpg' },
    'face-long-foot': { face: { center: [0, 17, 46.4], normal: [0, -0.0314, 1], up: [0, 1, 0.0314], width: 152, height: 38 }, ref: 'faces/face-long-foot.jpg' },
    'face-lid-long': { face: { center: [0, 195.85, 25.13], normal: [0, 0.6646, 0.7472], up: [0, 0.7472, -0.6646], width: 146, height: 82 }, ref: 'faces/face-lid-long.jpg' },
    'face-end': { face: { center: [67.3, 81, 0], normal: [1, -0.0247, 0], up: [0.0247, 1, 0], width: 118, height: 166 }, ref: 'faces/face-end.jpg' },
    'face-lid-end': { face: { center: [59.6, 195.85, 0], normal: [0.9469, 0.3216, 0], up: [-0.3216, 0.9469, 0], width: 108, height: 66 }, ref: 'faces/face-lid-end.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 8 * Math.sqrt(q) // 0.82 mm leiwen needs ≥ 5 px/mm
    const plain = new kit.PatinaMaterial()
    const seed = 19742682
    const panels = {}

    // ---------------------------------------------------------------- layout
    const bodyOpts = {
      width: W0, depth: D0, height: WALL_H, at: 'bottom', taper: { x: TAPER_X, z: TAPER_Z },
      wall: WALL, floor: { thickness: WALL, round: 2 }, rim: { kind: 'plain', inner: 0.6 },
      foot: {
        height: FOOT_H, flare: (-FOOT_H * (tanT + tanZ)) / 2, thickness: WALL, // the kit foot takes one flare: the mean lean (0.1 mm off either axis)
        notch: { long: { width: 18, height: 15, shape: 'rect', round: 4 }, short: { width: 15, height: 14.8, shape: 'rect', round: 4 } }, // side.jpg: top corners r ≈ 4 mm
      },
      cast: { seed: 11, sag: 0, wave: 0, rim: 0.5, skew: 0.25 },
      material: plain, density: 1.25 * Math.sqrt(q),
    }
    const lay = kit.fangLayout(bodyOpts)

    // ---------------------------------------------------------------- body panels (one per face kind)
    // traced from the flattened photographs (met-fangyi/traced.js): the long face 1:1 in face mm
    const bodyPanel = (side, s) => {
      const cell = lay.sides[side].cells[0][0]
      const p = new kit.ReliefPanel({ width: cell.w, height: cell.h, ppmm, seed: s })
      const hw = cell.w / 2
      const long = side === 'front'
      const half0 = (long ? W0 : D0) / 2
      const halfAt = (Y) => half0 + (Y - FOOT_H) * (long ? tanT : tanZ)
      const face = (faceW, dy) => bodyFace({ faceW, dy, halfAt, hw, y0: FOOT_H }).P
      // the end face: the same elements, each re-fitted to its box on face-end.jpg (traced.js END_FIT);
      // its frieze kui keeps head and jaw (eye at u 24 against 22.7) and shortens the body and tail
      // (×0.6 outward of the eye: tail edge at u 48 against 62.4) — face-end.jpg, grid/s-endfr.png
      const endMain = refit(MAIN_LONG, END_FIT, { pillow: END_EYE }).map((e) => (e.name === 'horn' ? END_HORN : e))
      const endFrieze = refit(FRIEZE_LONG, {}, { rest: ([x, y]) => { const u = 76 - x; return [59 - (u <= 22.7 ? 24 - (22.7 - u) * 0.95 : 24 + (u - 22.7) * 0.6), y + 128] } })
      renderTraced(kit, p, long ? [
        { specs: MAIN_LONG, P: face(152, 31) },
        { specs: FRIEZE_LONG, P: face(152, 126) },
      ] : [
        { specs: endMain, P: face(118, -2) },
        { specs: endFrieze, P: face(118, -2) },
      ], {
        seed: s, halfRect: { x: 0, y: 0, w: hw, h: cell.h },
        fields: [[3.3, 34.0 - FOOT_H, hw - 6.5, 93.7], [3.3, 129.8 - FOOT_H, hw - 6.5, 27.6]],
      })
      return p.bake()
    }
    await onProgress(0.02, 'long face')
    panels.long = bodyPanel('front', seed + 1)
    await onProgress(0.2, 'end face')
    panels.short = bodyPanel('right', seed + 2)

    // ---------------------------------------------------------------- foot panels
    const footPanel = (side, s) => {
      const f = lay.foot.sides[side]
      const p = new kit.ReliefPanel({ width: f.w, height: FOOT_H, ppmm, seed: s })
      const hw = f.w / 2
      const long = side === 'front'
      const n = f.notch
      const half0 = (long ? W0 : D0) / 2
      const halfAt = (Y) => half0 + (Y - FOOT_H) * (long ? tanT : tanZ)
      // face-long-foot.jpg: the field runs from y 3.8 to 29.6 (vessel), stepping over the notch and its frame
      const nh = n.w / 2 + 1.4, nv = n.h + 1.4
      const field = [[3.3, 3.8], [hw - nh, 3.8], [hw - nh, nv], [hw - 3.2, nv], [hw - 3.2, 29.6], [3.3, 29.6]]
      // the end face: the same kui closed up outward of the notch jaw (u ≤ 12 kept)
      const specs = long ? FOOT_LONG : refit(FOOT_LONG, {}, { rest: ([x, y]) => { const u = 76 - x; return [59 - (u <= 12 ? u : 12 + (u - 12) * 0.7), y] } })
      renderTraced(kit, p, [{ specs, P: bodyFace({ faceW: long ? 152 : 118, dy: -2, halfAt, hw, y0: 0 }).P }], {
        seed: s, halfRect: { x: 0, y: 0, w: hw, h: FOOT_H }, fields: [field],
      })
      return p.bake()
    }
    await onProgress(0.36, 'foot')
    panels.footLong = footPanel('front', seed + 3)
    panels.footShort = footPanel('right', seed + 4)

    // ---------------------------------------------------------------- lid panels
    const top = { a: kit.fangSection(bodyOpts)(WALL_H).a, b: kit.fangSection(bodyOpts)(WALL_H).b }
    const LW = 2 * top.a, LD = 2 * top.b
    const lidOpts = { width: LW, depth: LD, rise: RISE, ridge: RIDGE, concave: CONVEX, section: SECTION, pillow: PILLOW, skirt: { height: SKIRT } }
    const roof = roofModel(kit, lidOpts)
    const ll = kit.hippedLidLayout(lidOpts)
    await onProgress(0.5, 'lid slopes')
    // lid slopes: the traced body mask, upside down, re-fitted to the flattened lid faces (traced.js
    // LID_*). A face point (chord plane, face mm) → its height on the roof → slant s on the 1:1 panel.
    const lidFace = (k, f, { cy, upY, fyc, xc }) => ([fx, fy]) => {
      const v = roof.vOfY(cy + (fy - fyc) * upY - LID_Y)
      return [f.w / 2 + (fx - xc), roof.arc(k, v)]
    }
    const lidField = (f, halfAtS) => {
      const pts = [[f.w / 2 - 3.2, 3]]
      for (let i = 0; i <= 14; i++) {
        const sv = 3 + ((f.h - 5.4) * i) / 14
        pts.push([Math.min(f.w / 2 - 3.4, f.w / 2 - (halfAtS(sv) - 3.4)), sv])
      }
      pts.push([f.w / 2 - 3.2, f.h - 2.4])
      return pts
    }
    {
      const f = ll.faces.front
      const p = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed: seed + 5 })
      const halfAt = (s) => roof.level(roof.vOfS(0, s)).a
      const specs = refit(MAIN_LONG, LID_LONG_FIT, { pillow: LID_LONG_EYE })
      renderTraced(kit, p, [{ specs, P: lidFace(0, f, { cy: 195.85, upY: 0.742, fyc: 41, xc: 73 }) }], {
        seed: seed + 5, halfRect: { x: 0, y: 0, w: f.w / 2, h: f.h }, fields: [lidField(f, halfAt)],
      })
      panels.lidLong = p.bake()
    }
    await onProgress(0.6, 'lid ends')
    {
      const f = ll.faces.right
      const p = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed: seed + 6 })
      const halfAt = (s) => roof.level(roof.vOfS(1, s)).b
      const specs = refit(MAIN_LONG.filter((e) => !LID_END_DROP.includes(e.name)), LID_END_FIT, { pillow: LID_END_EYE })
      renderTraced(kit, p, [{ specs, P: lidFace(1, f, { cy: 195.85, upY: 0.945, fyc: 33, xc: 54 }) }], {
        seed: seed + 6, halfRect: { x: 0, y: 0, w: f.w / 2, h: f.h }, fields: [lidField(f, halfAt)],
      })
      panels.lidEnd = p.bake()
    }
    await onProgress(0.68, 'knob')
    // knob roof (detail-knob): flush line work only — a plain face with incised scrolls and ring eyes
    const knobPanel = (w, h, eyes, s, topHalf) => {
      const p = new kit.ReliefPanel({ width: w, height: h, ppmm: Math.max(ppmm, 9), seed: s })
      p.sink((ctx) => {
        ctx.lineWidth = 0.55
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (const l of knobLines(w, h, { eyes, topHalf })) {
          ctx.beginPath()
          l.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
          ctx.stroke()
        }
      }, { depth: 0.35, profile: 'u' })
      return p.bake()
    }
    const kr = roofModel(kit, { width: KNOB.width, depth: KNOB.depth, ridge: KNOB.ridge, rise: KNOB.rise, concave: KNOB.convex, section: KNOB.section, pillow: KNOB.pillow })
    panels.knobLong = knobPanel(KNOB.width, kr.arc(0, 1), true, seed + 7, KNOB.ridge / 2)
    panels.knobEnd = knobPanel(KNOB.depth, kr.arc(1, 1), true, seed + 8, 0) // side.jpg: a two-eyed micro-mask on the ends

    // ---------------------------------------------------------------- body
    await onProgress(0.78, 'casting')
    const object = new THREE.Group()
    object.name = 'met-fangyi'
    const cellSpec = (relief) => [[{ relief, fade: 0.6 }]]
    const body = kit.fangBody({
      ...bodyOpts,
      cells: { long: cellSpec(panels.long), short: cellSpec(panels.short) },
      foot: { ...bodyOpts.foot, relief: { long: { relief: panels.footLong, density: 1.4 * Math.sqrt(q), fade: 0.6, notchFade: 1.2 }, short: { relief: panels.footShort, density: 1.4 * Math.sqrt(q), fade: 0.6, notchFade: 1.2 } } },
    })
    object.add(body)
    const foot = body.children.find((c) => c.userData.part === 'foot')
    // the foot band is flush with the wall: its inner skin and underside are the body's own wall
    // (dossier: the body bbox starts at y 0); the foot part keeps the decorated outer band
    for (const m of [...foot.children]) {
      if (!/^foot-(inner|bottom)/.test(m.name)) continue
      m.userData.part = 'body'
      body.add(m)
    }

    // ---------------------------------------------------------------- lid + knob
    const lid = kit.hippedLid({
      ...lidOpts, thickness: 2.6, faces: { long: { relief: panels.lidLong, density: 1.2 * Math.sqrt(q), fade: 0.6 }, short: { relief: panels.lidEnd, density: 1.2 * Math.sqrt(q), fade: 0.6 } },
      seat: { depth: 2, clearance: 0.4, thickness: 2 }, material: plain, density: 1.2 * Math.sqrt(q),
    })
    lid.position.y = LID_Y
    object.add(lid)
    const knob = kit.roofKnob({
      width: KNOB.width, depth: KNOB.depth, rise: KNOB.rise, ridge: KNOB.ridge / KNOB.width, concave: KNOB.convex, section: KNOB.section, pillow: KNOB.pillow, skirt: { height: KNOB.skirt },
      post: KNOB.post, embed: KNOB.embed, material: plain, part: 'knob',
      faces: { long: { relief: panels.knobLong, density: 3 * Math.sqrt(q), fade: 0.4 }, short: { relief: panels.knobEnd, density: 3 * Math.sqrt(q), fade: 0.4 } },
    })
    knob.position.y = LID_Y + roof.top
    object.add(knob)

    // ---------------------------------------------------------------- flanges
    await onProgress(0.88, 'flanges')
    const flanges = []
    const F = (o) => {
      if (o.comb) {
        const L = o.path ? o.path.length : o.from.distanceTo(o.to)
        const c = combOutline(L, o.height, o.embed, o.comb)
        o = { ...o, outline: c.outline, grooves: c.grooves, grooveStyle: { width: 1.0, depth: Math.min(1.0, o.thickness * 0.24) } }
      }
      const m = kit.flange({ notches: FLANGE_NOTCH, material: plain, waver: 0.35, seed: seed + flanges.length * 13, ...o })
      flanges.push(m)
      object.add(m)
    }
    const bc = body.userData.corners, fc = foot.userData.corners
    for (const name of Object.keys(bc)) {
      // corner flanges on the 45° bisector, from the ground to ~5 mm below the rim
      const B = fc[name].bottom.clone(), T = bc[name].top.clone()
      const at = (y) => B.clone().lerp(T, (y - B.y) / (T.y - B.y))
      F({ from: at(1), to: at(157), out: bc[name].out, height: 7.5, thickness: 3.6, taper: 8, embed: 3, comb: {} })
    }
    for (const side of ['front', 'right', 'back', 'left']) {
      // face-centre flanges: from the notch ceiling to just under the rim, unbroken
      const a = foot.userData.axes[side].bottom.clone(), w = body.userData.walls[side]
      const T = w.axis[1].clone()
      const at = (y) => a.clone().lerp(T, (y - a.y) / (T.y - a.y))
      F({ from: at(a.y + 0.2), to: at(161.5), out: w.normal, height: 6.5, thickness: 3.8, taper: 9, embed: 1.6, comb: {} })
    }
    // lid: hips over the corners (step-out tab at the eave), slope midlines over the face centres
    const lidXf = (p) => p.add(new THREE.Vector3(0, LID_Y, 0))
    for (let k = 0; k < 4; k++) {
      F({ path: roof.hipPath(k, lidXf), height: 6, thickness: 3.3, taper: 7, embed: 2.2, comb: { tab: [3.4, 1.4], hook: 0 } })
      F({ path: roof.midPath(k, lidXf, k % 2 === 0 ? 0.975 : roof.vOfY(214 - LID_Y)), // end-slope flange stops ~9 mm below the apex (detail-lid-end)
         // detail-lid-long / detail-lid-end: round-crested bars carrying the same ladder as the body flanges
         height: 5.2, thickness: 5, taper: 6, embed: 1.8, bevel: 1.3, comb: { nick: 0.6 } })
    }
    // ridge: two crenellated segments either side of the knob post
    const yR = LID_Y + roof.top
    for (const sx of [-1, 1]) {
      const a = new THREE.Vector3(sx * (KNOB.post.width / 2 + 0.6), yR, 0), b = new THREE.Vector3(sx * RIDGE / 2, yR, 0)
      F({ from: sx > 0 ? a : b, to: sx > 0 ? b : a, out: new THREE.Vector3(0, 1, 0), height: 4.8, thickness: 5, taper: 4, embed: 2.6, comb: { nick: 0.6, depth: 0.5, hook: 1.4 } }) // detail-knob: blocks ≈ 4–5 mm proud of the ridge // detail-knob: a near-continuous block, narrow notches, incised faces
    }

    await onProgress(1, 'done')
    return { object, parts: { body, foot, lid, knob, flanges }, panels }
  },
}

/**
 * The comb flange's side outline and face incisions (detail-flanges.jpg, side.jpg, detail-lid-end.jpg):
 * a continuous strip finely scored at a 4 mm pitch. In silhouette the crest is only nicked (`nick` mm
 * deep, a slightly chamfered notch `w` wide, so the teeth are ~2.8 mm and never read as cubes); the
 * slot itself is a 1.2 mm groove cut into both faces from the crest down `depth` × the projection,
 * turning DOWN at its inner end (the "⌐" hook every slot shows), leaving a continuous spine on the wall.
 * `tab: [len, extra]` = the step-out at the eave. Returns { outline (CCW, σ along the path, t outward,
 * root at −embed), grooves }.
 */
function combOutline(L, H, embed, { pitch = 4, w = 1.0, depth = 0.66, hook = 1.1, nick = 0.5, tab = null } = {}) {
  const D = depth * H
  const n = Math.max(2, Math.round(L / pitch))
  const seg = L / n
  const pts = [[0, -embed], [L, -embed], [L, H - 0.9], [L - 0.9, H]]
  const grooves = []
  for (let k = n - 1; k >= 1; k--) {
    const c = k * seg
    pts.push([c + w / 2, H], [c + w / 2 - 0.25, H - nick], [c - w / 2 + 0.25, H - nick], [c - w / 2, H])
    const hk = Math.min(hook, seg - w - 1.2)
    grooves.push(hk > 0 ? [[c, H - nick * 0.5], [c, H - D], [c - hk, H - D]] : [[c, H - nick * 0.5], [c, H - D]])
  }
  if (tab) {
    const [tl, te] = tab
    pts.push([Math.min(tl, seg - w / 2 - 0.2), H], [Math.min(tl, seg - w / 2 - 0.2), H + te], [0, H + te])
  } else pts.push([0.6, H], [0, H - 0.6])
  return { outline: pts, grooves }
}

/**
 * The lid's (or knob's) roof surface — kit.hippedRoof, the very loft hippedLid builds (ogival section, pillowed
 * slopes) — plus what this file needs on top: v ↔ slant / height inversions for the lid décor, and hip /
 * slope-midline paths so the lid flanges follow the curved hips and the swelling slopes.
 */
function roofModel(kit, opts) {
  const R = kit.hippedRoof(opts)
  const { A, B, rh, level, arc } = R
  const invert = (fn, target) => {
    let lo = 0, hi = 1
    for (let i = 0; i < 40; i++) {
      const m = (lo + hi) / 2
      if (fn(m) < target) lo = m
      else hi = m
    }
    return (lo + hi) / 2
  }
  const point = (k, v, s) => R.point(k, s, v)
  const path = (pts, outs) => {
    const cum = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
    const L = cum[cum.length - 1]
    return {
      isPath: true, length: L,
      frame(s) {
        let i = 1
        while (i < pts.length - 1 && cum[i] < s) i++
        const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
        const p = pts[i - 1].clone().lerp(pts[i], t)
        const d = pts[i].clone().sub(pts[i - 1]).normalize()
        const tt = Math.min(1, Math.max(0, t))
        const n = outs[i - 1].clone().lerp(outs[i], tt)
        n.addScaledVector(d, -n.dot(d)).normalize()
        const b = new THREE.Vector3().crossVectors(d, n)
        return { p, n, d, b }
      },
    }
  }
  const M = 40
  return {
    A, B, rh, top: R.top, level, arc,
    vOfS: (k, s) => invert((v) => arc(k, v), s),
    vOfY: (y) => invert((v) => level(v).y, y),
    hipPath(k, xf) {
      const pts = [], outs = []
      for (let i = 0; i <= M; i++) {
        const v = i / M
        pts.push(xf(point(k, v, 1)))
        outs.push(R.normal(k, 1, v).add(R.normal((k + 1) % 4, 0, v)).normalize())
      }
      return path(pts, outs)
    },
    midPath(k, xf, vEnd = 1) {
      const pts = [], outs = []
      for (let i = 0; i <= M; i++) {
        const v = (i / M) * vEnd
        pts.push(xf(point(k, v, 0.5)))
        outs.push(R.normal(k, 0.5, v))
      }
      return path(pts, outs)
    },
  }
}
