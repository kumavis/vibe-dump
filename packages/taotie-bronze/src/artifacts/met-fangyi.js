// Met fangyi 1974.268.2a, b — rectangular lidded wine container, 12th c. BCE.
// Reconstruction from reference/met-fangyi/dossier.md (measured from the Met's
// three photographs) and profile.json. Units mm, Y up, front (+Z) = a long face.
//
// Form: a straight-walled box leaning out 1.4°/side, the foot band flush with
// the wall and notched on every face; a convex hipped lid with a long ridge and
// near-gable ends; a miniature hipped-roof knob on a plain post; 18 comb flanges
// (4 pitch slots) running unbroken through the registers.
// Décor: hand-placed dissolved islands (met-fangyi/decor.js) on 0.82 mm leiwen,
// rendered by met-fangyi/relief.js.

import * as THREE from 'three'
import { renderSheets, leftHalf } from './met-fangyi/relief.js'
import { mainSheet, friezeSheet, footSheet, lidLongSheet, lidEndSheet, knobLines } from './met-fangyi/decor.js'

const H = 254
const FOOT_H = 33 // foot band (its own part): ground → top of the lower separator's middle
const RIM_Y = 162.2
const LID_Y = 162.8 // ~0.6 mm hairline between body rim and lid skirt
const W0 = 132.6, D0 = 95.6 // wall surface at the foot top (y 33)
const TAPER = 1.4 // deg per side, walls lean out going up
const WALL_H = RIM_Y - FOOT_H
const WALL = 3
const SKIRT = 4.8
const RISE = 56.5 // eave line (167.6) → ridge line
const CONVEX = -0.5 // kit `concave` < 0: steep at the eave (≈ 59°), ≈ 29° at the ridge — the cushion roof
const RIDGE = 100 // ridge length (mm)
const KNOB = { width: 27, depth: 21.7, ridge: 16, rise: 15.4, skirt: 3.1, convex: -0.6, post: { height: 10.9, width: 12, depth: 7.2, waist: 0.04 }, embed: 2.6 }
const FLANGE_NOTCH = { shape: 'score', pitch: 4, depth: 0.7, width: 1.2 }

const tanT = Math.tan((TAPER * Math.PI) / 180)

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
    'Eighteen finely toothed flanges run unbroken from the notched foot to the ridge, and every mask part — squared ram horns, low slit-eyed bosses, hooked jaws — floats as a separate island on thunder spirals under one millimetre in pitch. ' +
    'Reconstructed from the Met’s three photographs: the walls, lid, flanges and décor are measured, but the inside (floor height, lid seat, the cast clan sign) and the hidden back faces are inferred.',
  defaultPatina: 'met-fangyi',
  views: {
    'three-quarter': { azimuth: 23, elevation: 8, fov: 26, fit: 1.32, ref: 'three-quarter.jpg' },
    side: { azimuth: 90, elevation: 5, fov: 26, fit: 1.3, ref: 'side.jpg' },
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
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 8 * Math.sqrt(q) // 0.82 mm leiwen needs ≥ 5 px/mm
    const plain = new kit.PatinaMaterial()
    const seed = 19742682
    const panels = {}

    // ---------------------------------------------------------------- layout
    const bodyOpts = {
      width: W0, depth: D0, height: WALL_H, at: 'bottom', taper: { x: TAPER, z: TAPER },
      wall: WALL, floor: { thickness: WALL, round: 2 }, rim: { kind: 'plain', inner: 0.6 },
      foot: {
        height: FOOT_H, flare: -FOOT_H * tanT, thickness: WALL,
        notch: { long: { width: 18, height: 15, shape: 'rect', round: 3 }, short: { width: 15, height: 14.8, shape: 'rect', round: 3 } },
      },
      cast: { seed: 11, sag: 0, wave: 0, rim: 0.5, skew: 0.25 },
      material: plain, density: 1.25 * Math.sqrt(q),
    }
    const lay = kit.fangLayout(bodyOpts)

    // ---------------------------------------------------------------- body panels (one per face kind)
    const bodyPanel = (side, s) => {
      const cell = lay.sides[side].cells[0][0]
      const p = new kit.ReliefPanel({ width: cell.w, height: cell.h, ppmm, seed: s })
      const hw = cell.w / 2
      const P = leftHalf(hw, 0)
      const shift = (sheet, dv) => sheet.map(([u, v]) => [u, v + dv])
      renderSheets(kit, p, [
        { sheet: shift(mainSheet(hw, 93.3), 34.4 - FOOT_H), P },
        { sheet: shift(friezeSheet(hw, 28.6), 130.4 - FOOT_H), P },
      ], { seed: s, halfRect: { x: 0, y: 0, w: hw, h: cell.h } })
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
      const n = f.notch
      const sheet = footSheet(hw + 0.4, n.w / 2 + 1.6, n.h + 1.6 - 4.4, 27.3).map(([u, v]) => [u, v + 4.4])
      renderSheets(kit, p, [{ sheet, P: leftHalf(hw, 0) }], { seed: s, halfRect: { x: 0, y: 0, w: hw, h: FOOT_H } })
      return p.bake()
    }
    await onProgress(0.36, 'foot')
    panels.footLong = footPanel('front', seed + 3)
    panels.footShort = footPanel('right', seed + 4)

    // ---------------------------------------------------------------- lid panels
    const top = { a: kit.fangSection(bodyOpts)(WALL_H).a, b: kit.fangSection(bodyOpts)(WALL_H).b }
    const LW = 2 * top.a, LD = 2 * top.b
    const lidOpts = { width: LW, depth: LD, rise: RISE, ridge: RIDGE, concave: CONVEX, skirt: { height: SKIRT } }
    const roof = roofModel(LW, LD, RIDGE, RISE, CONVEX, SKIRT)
    const ll = kit.hippedLidLayout(lidOpts)
    await onProgress(0.5, 'lid slopes')
    {
      const f = ll.faces.front
      const p = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed: seed + 5 })
      const halfAt = (s) => roof.level(roof.vOfS(0, s)).a
      renderSheets(kit, p, [{ sheet: lidLongSheet(halfAt, f.h), P: leftHalf(f.w / 2, 0) }], { seed: seed + 5, halfRect: { x: 0, y: 0, w: f.w / 2, h: f.h } })
      panels.lidLong = p.bake()
    }
    await onProgress(0.6, 'lid ends')
    {
      const f = ll.faces.right
      const p = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed: seed + 6 })
      const vOfY = (y) => roof.vOfY(y - LID_Y)
      const sheet = lidEndSheet((y) => roof.level(vOfY(y)).b, (y) => roof.arc(1, vOfY(y)), LID_Y + roof.top)
      renderSheets(kit, p, [{ sheet, P: leftHalf(f.w / 2, 0) }], { seed: seed + 6, halfRect: { x: 0, y: 0, w: f.w / 2, h: f.h } })
      panels.lidEnd = p.bake()
    }
    await onProgress(0.68, 'knob')
    // knob roof (detail-knob): flush line work only — a plain face with incised scrolls and ring eyes
    const knobPanel = (w, h, eyes, s) => {
      const p = new kit.ReliefPanel({ width: w, height: h, ppmm: Math.max(ppmm, 9), seed: s })
      p.sink((ctx) => {
        ctx.lineWidth = 0.45
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (const l of knobLines(w, h, { eyes })) {
          ctx.beginPath()
          l.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
          ctx.stroke()
        }
      }, { depth: 0.35, profile: 'u' })
      return p.bake()
    }
    const kr = roofModel(KNOB.width, KNOB.depth, KNOB.ridge, KNOB.rise, KNOB.convex, 0)
    panels.knobLong = knobPanel(KNOB.width, kr.arc(0, 1), true, seed + 7)
    panels.knobEnd = knobPanel(KNOB.depth, kr.arc(1, 1), false, seed + 8)

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
      width: KNOB.width, depth: KNOB.depth, rise: KNOB.rise, ridge: KNOB.ridge / KNOB.width, concave: KNOB.convex, skirt: { height: KNOB.skirt },
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
        o = { ...o, outline: c.outline, grooves: c.grooves, grooveStyle: { width: 1.2, depth: Math.min(1.1, o.thickness * 0.24) } }
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
      F({ from: at(1), to: at(157), out: bc[name].out, height: 7.5, thickness: 4.2, taper: 8, embed: 3, comb: {} })
    }
    for (const side of ['front', 'right', 'back', 'left']) {
      // face-centre flanges: from the notch ceiling to just under the rim, unbroken
      const a = foot.userData.axes[side].bottom.clone(), w = body.userData.walls[side]
      const T = w.axis[1].clone()
      const at = (y) => a.clone().lerp(T, (y - a.y) / (T.y - a.y))
      F({ from: at(a.y + 0.2), to: at(161.5), out: w.normal, height: 6.5, thickness: 4.5, taper: 9, embed: 1.6, comb: {} })
    }
    // lid: hips over the corners (step-out tab at the eave), slope midlines over the face centres
    const lidXf = (p) => p.add(new THREE.Vector3(0, LID_Y, 0))
    for (let k = 0; k < 4; k++) {
      F({ path: roof.hipPath(k, lidXf), height: 6, thickness: 4, taper: 7, embed: 2.2, comb: { tab: [3.4, 1.4], hook: 0 } })
      F({ path: roof.midPath(k, lidXf, k % 2 === 0 ? 0.975 : roof.vOfY(214 - LID_Y)), // end-slope flange stops ~9 mm below the apex (detail-lid-end)
         // detail-lid-long / detail-lid-end: round-crested bars carrying the same ladder as the body flanges
         height: 5.2, thickness: 5, taper: 6, embed: 1.8, bevel: 1.3, comb: { nick: 0.6 } })
    }
    // ridge: two crenellated segments either side of the knob post
    const yR = LID_Y + roof.top
    for (const sx of [-1, 1]) {
      const a = new THREE.Vector3(sx * (KNOB.post.width / 2 + 0.6), yR, 0), b = new THREE.Vector3(sx * RIDGE / 2, yR, 0)
      F({ from: sx > 0 ? a : b, to: sx > 0 ? b : a, out: new THREE.Vector3(0, 1, 0), height: 6.2, thickness: 5, taper: 4, embed: 2.6, comb: { nick: 0.5, depth: 0.45, hook: 0 } }) // detail-knob: a near-continuous block, narrow notches, incised faces
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
function combOutline(L, H, embed, { pitch = 4, w = 1.2, depth = 0.72, hook = 1.1, nick = 0.8, tab = null } = {}) {
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
 * Replica of the kit's hipped-roof loft (lid.js resolveRoof), so the lid décor can be authored
 * in world heights and the lid flanges can follow the CONVEX hips and midlines as curved paths.
 */
function roofModel(W, D, ridge, rise, c, y0) {
  const A = W / 2, B = D / 2
  const rh = Math.min((ridge <= 1 ? ridge * W : ridge) / 2, A - 1e-3)
  const g = (v) => (1 - c) * v + c * v * v
  const dg = (v) => (1 - c) + 2 * c * v
  const level = (v) => ({ a: A + (rh - A) * v, b: B * (1 - v), y: y0 + rise * g(v) })
  const N = 48
  const arcF = [0], arcS = [0]
  for (let i = 1; i <= N; i++) {
    const p = level((i - 1) / N), qq = level(i / N)
    arcF.push(arcF[i - 1] + Math.hypot(qq.b - p.b, qq.y - p.y))
    arcS.push(arcS[i - 1] + Math.hypot(qq.a - p.a, qq.y - p.y))
  }
  const arc = (k, v) => {
    const t = k % 2 === 0 ? arcF : arcS
    const f = Math.min(N, Math.max(0, v * N)), i = Math.min(N - 1, Math.floor(f))
    return t[i] + (t[i + 1] - t[i]) * (f - i)
  }
  const invert = (fn, target) => {
    let lo = 0, hi = 1
    for (let i = 0; i < 40; i++) {
      const m = (lo + hi) / 2
      if (fn(m) < target) lo = m
      else hi = m
    }
    return (lo + hi) / 2
  }
  const SN = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]]
  const ST = [[1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 0, 1]]
  const point = (k, v, s) => {
    const L = level(v)
    const even = k % 2 === 0
    const Dd = even ? L.b : L.a, Hh = even ? L.a : L.b
    const x = (2 * s - 1) * Hh
    return new THREE.Vector3(SN[k][0] * Dd + ST[k][0] * x, L.y, SN[k][2] * Dd + ST[k][2] * x)
  }
  const normal = (k, v) => {
    const h = rise * dg(v)
    const up = k % 2 === 0 ? B : A - rh
    return new THREE.Vector3(SN[k][0] * h, up, SN[k][2] * h).normalize()
  }
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
    A, B, rh, top: y0 + rise, level, arc,
    vOfS: (k, s) => invert((v) => arc(k, v), s),
    vOfY: (y) => invert((v) => level(v).y, y),
    hipPath(k, xf) {
      const pts = [], outs = []
      for (let i = 0; i <= M; i++) {
        const v = i / M
        pts.push(xf(point(k, v, 1)))
        outs.push(normal(k, v).add(normal((k + 1) % 4, v)).normalize())
      }
      return path(pts, outs)
    },
    midPath(k, xf, vEnd = 1) {
      const pts = [], outs = []
      for (let i = 0; i <= M; i++) {
        const v = (i / M) * vEnd
        pts.push(xf(point(k, v, 0.5)))
        outs.push(normal(k, v))
      }
      return path(pts, outs)
    },
  }
}
