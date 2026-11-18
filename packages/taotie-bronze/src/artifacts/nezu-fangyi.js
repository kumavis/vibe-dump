// Nezu Museum fangyi — lidded wine box with coiled-horn masks, Shang–Western
// Zhou transition (est. c. 1050–1000 BC). Reconstructed from the project
// owner's single photograph (reference/nezu-fangyi/three-quarter.jpg) via the
// measured dossier; H = 330 mm is ASSUMED (the museum's height is unpublished).
// Units mm, Y up, front (+Z) = a broad face, the left narrow face is −X.
//
// Form: a stepped plinth (base) under a set-back foot register, a belly that
// BULGES (widest at 0.32 H) between foot and a straight neck band, a plain
// mouth band, a steep hipped lid with ridge beams turned up at the ends, and a
// knob that is a miniature hipped roof on a square post. Thick hooked flanges
// on every corner and face centre, broken at each register.
// Décor (nezu-fangyi/decor.js) is V-b sculptural relief: 3 mm round-shouldered
// plateaus with one incised line, 5 mm slit eye bosses, leiwen only in channels.

import * as THREE from 'three'
import { renderSheets } from './nezu-fangyi/relief.js'
import { drawBelly } from './nezu-fangyi/belly.js'
import { drawFoot } from './nezu-fangyi/foot.js'
import { drawLidBroad } from './nezu-fangyi/lid.js'
import { neckSheet, lidNarrowSheet, knobSheet } from './nezu-fangyi/decor.js'
import { H, LV, PLAN, bellyX, bellyZ, polyPath, segmentOutline, FLANGE_POLY, densify, flangeGrooves, buildKnob, block, rectPoint } from './nezu-fangyi/form.js'

const SIDES = ['front', 'right', 'back', 'left']
const LID_CONCAVE = -0.06 // straight to slightly convex slopes, crisp at the eave (no bell-cast)
const SN = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]]
const BELLY_BORDER = 7.0 // plain lower border of the belly (0.14 → 0.16 H), curling under

export default {
  id: 'nezu-fangyi',
  order: 0,
  title: 'Fangyi Wine Container with Coiled-horn Masks',
  titleZh: '卷角兽面纹方彝',
  type: 'fangyi',
  date: 'c. 1050–1000 BC',
  period: 'Shang–Western Zhou transition',
  findspot: 'Not documented; an Anyang provenance is unverified',
  collection: 'Nezu Museum, Tokyo',
  accession: 'unknown',
  dimensions: { h: 330, w: 220, d: 175 },
  blurb:
    'A lidded wine box from the hinge between the Shang and Zhou dynasties, still speaking the Anyang vocabulary, only louder: the belly swells outward, ' +
    'the masks’ coiled horns have grown until they push the slit-boss eyes to the bottom of the field, every gap between the deep-cut bands is crowded with smaller hooks and thunder-spirals, ' +
    'and thick hooked flanges break at every register and jut past the eaves of the hipped lid, whose handle is a miniature hipped roof. ' +
    'Reconstructed from a single photograph of the front and left faces: the height (330 mm) is assumed, the back and right faces repeat the visible ones, and the narrow-face décor, the foot frieze, the knob’s depth and the exact layout of the small filler hooks are inferred.',
  defaultPatina: 'nezu-olive',
  views: {
    // solved against the photograph (7 landmarks, fov held at the dossier's 36°): eye ≈ 0.77 H, 764 mm from the aim point;
    // the target sits off-axis because the phone frame is an off-centre crop
    // fit/target tightened (was 1.125): the vessel fills ≈ 80 % of the landscape frame's height (photo: 74 % of its
    // portrait frame, but ≈ 77 % of its width, which a landscape frame can only answer by going bigger)
    // round 4: −32° — at −27.5 the plinth's narrow face spanned 0.29 of the broad face against the photo's 0.37–0.38
    // (an azimuth sweep put 0.375 at −32°)
    'three-quarter': { azimuth: -32, elevation: 9.8, fov: 36, fit: 1.035, target: [30, 144, 18], ref: 'three-quarter.jpg' },
    front: { azimuth: 0, elevation: 8, fov: 30, fit: 1.1 },
    side: { azimuth: -90, elevation: 8, fov: 30, fit: 1.1 },
    top: { azimuth: -25, elevation: 58, fov: 30, fit: 1.1 },
    'detail-belly': { azimuth: -25, elevation: 14, fov: 21.4, fit: 0.36, target: [0, 88, 85] },
    'detail-lid': { azimuth: -14, elevation: 24, fov: 30, fit: 0.32, target: [0, 222, 40] },
    'detail-flanges': { azimuth: -58, elevation: 8, fov: 30, fit: 0.36, target: [-80, 95, 50] },
    'detail-knob': { azimuth: -22, elevation: 8, fov: 30, fit: 0.16, target: [0, 304, 0] },
    // flat faces (KIT.md § Flat faces): head-on, framed on a face rectangle in mm; ref = the flattened photograph
    // (reference/nezu-fangyi/faces.json → tools/faces.mjs --rectify)
    'face-belly': { face: { center: [0, 87.45, 75.2], normal: [0, -0.0797, 0.9968], up: [0, 0.9968, 0.0797], width: 200, height: 90 }, ref: 'faces/face-belly.jpg' },
    'face-neck-frieze': { face: { center: [0, 144.65, 73.5], normal: [0, 0, 1], up: [0, 1, 0], width: 184, height: 34 }, ref: 'faces/face-neck-frieze.jpg' },
    'face-foot-frieze': { face: { center: [0, 34.35, 70.5], normal: [0, 0, 1], up: [0, 1, 0], width: 180, height: 27 }, ref: 'faces/face-foot-frieze.jpg' },
    'face-lid-broad': { face: { center: [0, 222.45, 39.85], normal: [0, 0.7187, 0.6953], up: [0, 0.6953, -0.7187], width: 196, height: 116 }, ref: 'faces/face-lid-broad.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 5.6 * Math.sqrt(q) // 0.9 mm leiwen: ≥ 5 px/mm at q 1
    const dens = 1.5 * Math.sqrt(q) // verts/mm on décor cells (3 mm plateaus must show in the silhouette)
    const plain = new kit.PatinaMaterial()
    // up-facing ledges (plinth top, belly-top step, neck/mouth steps): a dead-flat, featureless plane with the default
    // 'fully exposed' cavity 0.8 caught the key light as a neutral near-white strip; at 0.45 it takes the photo's
    // powdery grey-green settled skin instead
    const ledge = new kit.PatinaMaterial({ cavity: 0.45 })
    const ledges = (g) => g.traverse((m) => { if (m.isMesh && /^rim/.test(m.name)) m.material = ledge })
    const seed = 3300
    const panels = {}
    const object = new THREE.Group()
    object.name = 'nezu-fangyi'
    const cast = (s) => ({ seed: s, sag: 0.0015, rim: 0, wave: 0.08, skew: 0 })
    const ground = (pitch, depth = 0.4) => ({ pitch, line: 0.5, depth, roundness: 0.12, jitter: 0.06, turns: 2.3, pairs: 0.6, margin: 0.45 })

    // ---------------------------------------------------------------- layouts
    const baseOpts = { width: 2 * PLAN.base[0], depth: 2 * PLAN.base[1], height: LV.base, wall: 7, floor: { thickness: 4 }, rim: { kind: 'plain' }, material: plain, part: 'base', cast: false }
    const footOpts = {
      width: 2 * PLAN.foot[0], depth: 2 * PLAN.foot[1], height: LV.foot - LV.footFrieze, wall: 6, floor: { thickness: 4 }, rim: { kind: 'plain' },
      material: plain, part: 'foot', cast: cast(31), density: dens,
    }
    const b0 = [bellyX(0), bellyZ(0)]
    const bellyOpts = {
      width: 2 * b0[0], depth: 2 * b0[1], height: LV.belly - LV.foot, wall: 8.5, floor: { thickness: 4 }, rim: { kind: 'plain' },
      profile: (t) => ({ dx: bellyX(t) - b0[0], dz: bellyZ(t) - b0[1] }), material: plain, part: 'belly', cast: cast(32), density: dens,
    }
    const neckOpts = { width: 2 * PLAN.neck[0], depth: 2 * PLAN.neck[1], height: LV.neck - LV.belly, wall: 6, floor: { thickness: 4 }, rim: { kind: 'plain' }, material: plain, part: 'neck', cast: cast(33), density: dens }
    const mouthOpts = { width: 2 * PLAN.mouth[0], depth: 2 * PLAN.mouth[1], height: LV.mouth - LV.neck, wall: 5, floor: { thickness: 3 }, rim: { kind: 'plain' }, material: plain, part: 'neck', cast: false }
    const lidOpts = {
      width: 2 * PLAN.eave[0], depth: 2 * PLAN.eave[1], rise: LV.apex - LV.lid - LV.fascia, ridge: 2 * PLAN.ridgeHalf, concave: LID_CONCAVE,
      skirt: { height: 0, overhang: PLAN.eave[0] - PLAN.mouth[0], fascia: LV.fascia }, thickness: 4,
    }
    const footL = kit.fangLayout(footOpts), bellyL = kit.fangLayout(bellyOpts), neckL = kit.fangLayout(neckOpts)
    const lidL = kit.hippedLidLayout(lidOpts)

    // ---------------------------------------------------------------- belly panels (one per face kind, reused front/back, left/right)
    const stats = {}
    const bellyPanel = async (side, kind, s) => {
      const cell = bellyL.sides[side].cells[0][0]
      const p = new kit.ReliefPanel({ width: cell.w, height: cell.h, ppmm, seed: s })
      const corner = kind === 'broad' ? 4.2 : 3.6 // clear of the corner flange
      // round 5: TRACED off the flattened photograph (nezu-fangyi/belly.js); V-b 3 mm plateaus, one incised line each
      drawBelly(kit, p, { cell, corner, L1: 3.0, ground: ground(0.85), seed: s, stats: (stats[kind] = {}) })
      return p.bake()
    }
    await onProgress(0.02, 'belly · broad face')
    panels.bellyLong = await bellyPanel('front', 'broad', seed + 1)
    await onProgress(0.14, 'belly · narrow face')
    panels.bellyShort = await bellyPanel('right', 'narrow', seed + 2)

    // ---------------------------------------------------------------- neck + foot friezes
    const friezePanel = (cell, sheetFn, { v0, top, slot, L1, s }) => {
      const p = new kit.ReliefPanel({ width: cell.w, height: cell.h, ppmm, seed: s })
      const hw = cell.w / 2, Hn = cell.h - v0 - top
      const sheet = sheetFn(kit, { hw, v0, Hn, slot, seed: s })
      renderSheets(kit, p, [{ sheet, xc: hw }], {
        L1, shoulder: 0.6, groove: { w: 0.6, d: 0.42 }, ground: ground(0.85, 0.35), seed: s,
        fields: [{ x: 1.4, y: v0 - 0.4, w: hw - 1.4 - slot + 1.2, h: Hn + 0.8 }],
      })
      return p.bake()
    }
    await onProgress(0.24, 'neck frieze')
    const neckV0 = (0.40 - 0.39) * H + 1.0
    panels.neckLong = friezePanel(neckL.sides.front.cells[0][0], neckSheet, { v0: neckV0, top: 1.0, slot: 5.8, L1: 1.3, s: seed + 3 })
    panels.neckShort = friezePanel(neckL.sides.right.cells[0][0], neckSheet, { v0: neckV0, top: 1.0, slot: 4.8, L1: 1.3, s: seed + 4 })
    await onProgress(0.34, 'foot frieze')
    // round 5: TRACED off the flattened photograph (nezu-fangyi/foot.js)
    const footPanel = (cell, slot, s, kind) => {
      const p = new kit.ReliefPanel({ width: cell.w, height: cell.h, ppmm, seed: s })
      drawFoot(kit, p, { cell, slot, L1: 1.4, ground: ground(0.85, 0.35), seed: s, stats: (stats['foot-' + kind] = {}) })
      return p.bake()
    }
    panels.footLong = footPanel(footL.sides.front.cells[0][0], 5.2, seed + 5, 'broad')
    panels.footShort = footPanel(footL.sides.right.cells[0][0], 4.8, seed + 6, 'narrow')

    // ---------------------------------------------------------------- lid slopes
    const halfFrom = (f) => {
      // face half width at panel height v, from the layout outline's left edge
      const pts = f.outline.slice(0, 13)
      return (v) => {
        let i = 1
        while (i < pts.length - 1 && pts[i][1] < v) i++
        const a = pts[i - 1], b = pts[i]
        const t = Math.min(1, Math.max(0, (v - a[1]) / (b[1] - a[1] || 1)))
        return f.w / 2 - (a[0] + (b[0] - a[0]) * t)
      }
    }
    await onProgress(0.44, 'lid · broad slopes')
    let lidZones
    {
      const f = lidL.faces.front
      const p = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed: seed + 7 })
      // round 5: TRACED off the flattened photograph (nezu-fangyi/lid.js); zones from the photo
      lidZones = drawLidBroad(kit, p, { f, slot: 4.6, L1: 2.5, ground: ground(0.9), seed: seed + 7, stats: (stats.lid = {}) })
      panels.lidLong = p.bake()
    }
    await onProgress(0.56, 'lid · narrow slopes')
    {
      const f = lidL.faces.right
      const halfAt = halfFrom(f)
      const p = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed: seed + 8 })
      const { sheet, v0 } = lidNarrowSheet(kit, { slant: f.h, halfAt, margin: 4.4, slot: 4, seed: seed + 8 })
      renderSheets(kit, p, [{ sheet, xc: f.w / 2 }], {
        L1: 2.5, shoulder: 1.0, groove: { w: 0.8, d: 0.5 }, ground: ground(0.9), seed: seed + 8,
        fields: [{ x: 0, y: v0 - 0.5, w: f.w / 2 - 3.6, h: f.h - v0 - 1 }],
      })
      panels.lidShort = p.bake()
    }

    // ---------------------------------------------------------------- knob slopes
    await onProgress(0.62, 'knob')
    const knobPanel = (kind, s) => {
      const [ea, eb] = PLAN.knobEave, [ta, tb] = PLAN.knobTop
      const h0 = kind === 'long' ? ea : eb, h1 = kind === 'long' ? ta : tb
      const d0 = kind === 'long' ? eb : ea, d1 = kind === 'long' ? tb : ta
      const slant = Math.hypot(LV.top - 0.6 - (LV.knobEave + 2.2), d0 - d1)
      const halfAt = (v) => h0 + (h1 - h0) * (v / slant)
      const p = new kit.ReliefPanel({ width: 2 * h0, height: slant, ppmm: Math.max(ppmm, 8.5), seed: s })
      const sheet = knobSheet(kit, { kind, halfAt, slant, border: 3, seed: s })
      renderSheets(kit, p, [{ sheet, xc: h0 }], {
        L1: 1.25, shoulder: 0.45, groove: { w: 0.5, d: 0.32 }, ground: ground(0.72, 0.3), seed: s,
        // round 4: both faces fill the trapezoid inside a 3 mm border (review: the long face had a wide plain margin)
        fields: [{ x: 3 + (h0 - h1), y: 3, w: h1 - 3, h: slant - 6 }, { x: 3 + (h0 - h1) * 0.5, y: 3, w: h0 - 3 - (h0 - h1) * 0.5, h: slant * 0.5 - 3 }],
      })
      return p.bake()
    }
    panels.knobLong = knobPanel('long', seed + 9)
    panels.knobShort = knobPanel('short', seed + 10)

    // ---------------------------------------------------------------- casting the body stack
    await onProgress(0.7, 'casting')
    const cellSpec = (relief) => ({ relief, fade: 1.2, density: dens })
    const base = kit.fangBody(baseOpts)
    // the foot: frieze band over a plain dark band set back under it, standing on the plinth's ledge (a stepped plinth)
    const foot = new THREE.Group()
    foot.name = 'foot'
    foot.userData.part = 'foot'
    const footFrieze = kit.fangBody({ ...footOpts, cells: { long: [[cellSpec(panels.footLong)]], short: [[cellSpec(panels.footShort)]] } })
    footFrieze.position.y = LV.footFrieze
    const footBand = kit.fangBody({ width: 2 * PLAN.footBand[0], depth: 2 * PLAN.footBand[1], height: LV.footFrieze - LV.base + 0.5, wall: 6, floor: { thickness: 4 }, rim: { kind: 'plain' }, material: plain, part: 'foot', cast: false })
    footBand.position.y = LV.base - 0.5
    foot.add(footFrieze, footBand)
    const belly = kit.fangBody({ ...bellyOpts, cells: { long: [[cellSpec(panels.bellyLong)]], short: [[cellSpec(panels.bellyShort)]] } })
    belly.position.y = LV.foot
    const neck = new THREE.Group()
    neck.name = 'neck'
    neck.userData.part = 'neck'
    const neckBody = kit.fangBody({ ...neckOpts, cells: { long: [[cellSpec(panels.neckLong)]], short: [[cellSpec(panels.neckShort)]] } })
    neckBody.position.y = LV.belly
    const mouth = kit.fangBody(mouthOpts)
    mouth.position.y = LV.neck
    neck.add(neckBody, mouth)
    object.add(base, foot, belly, neck)
    for (const g of [base, foot, belly, neck]) ledges(g)

    // ---------------------------------------------------------------- lid + knob
    await onProgress(0.8, 'lid')
    const lid = kit.hippedLid({
      ...lidOpts, material: plain, density: dens,
      faces: { long: { relief: panels.lidLong, density: dens, fade: 0.8 }, short: { relief: panels.lidShort, density: dens, fade: 0.8 } },
    })
    lid.position.y = LV.lid
    object.add(lid)
    // the knob post's socket: a block on the ridge between the beams, carrying the post down into the roof
    lid.add(block(kit, 0, 0, PLAN.post[0] + 0.6, PLAN.post[1] + 0.6, LV.apex - 16 - LV.lid, LV.knobBase - LV.lid + 0.4, { material: plain, part: 'lid', name: 'post-socket' }))
    const knob = buildKnob(kit, { material: plain, faces: { long: panels.knobLong, short: panels.knobShort }, density: 2.4 * Math.sqrt(q) })
    object.add(knob)

    // ---------------------------------------------------------------- flanges
    await onProgress(0.88, 'flanges')
    const flanges = []
    const F = (o) => {
      const outline = o.outline && densify(o.outline)
      const grooves = !outline ? undefined : o.carve === false ? [] : flangeGrooves(kit, outline, { seed: flanges.length, spirals: o.carve !== 'contour' })
      const m = kit.flange({ material: plain, waver: 0.3, taper: 2.5, seed: seed + flanges.length * 17, ...o, outline, grooves })
      flanges.push(m)
      object.add(m)
      return m
    }
    const V = (x, y, z) => new THREE.Vector3(x, y, z)
    // a path up a body wall: corner k (s = 1 of side k) or face centre k (s = 0.5), y0 → y1 (world)
    const wallPath = (body, k, s, y0, y1, out) => {
      const pts = [], outs = []
      const yb = body.position.y + (body.parent && body.parent !== object ? body.parent.position.y : 0)
      for (let i = 0; i <= 16; i++) {
        const y = y0 + ((y1 - y0) * i) / 16
        const p = body.userData.at(k, s, y - yb)
        p.y += yb
        pts.push(p)
        outs.push(out.clone())
      }
      return polyPath(pts, outs)
    }
    const diag = (k) => V(SN[k][0] + SN[(k + 1) % 4][0], 0, SN[k][2] + SN[(k + 1) % 4][2]).normalize()
    const face = (k) => V(...SN[k])
    const regs = {
      foot: { body: footFrieze, y0: 13.0, y1: 40.5 },
      belly: { body: belly, y0: LV.foot, y1: LV.belly },
      // the belly caps stand ≈ 6 mm above the belly top: the neck segments start above them, a 3 mm gap between
      neck: { body: neckBody, y0: LV.belly + 9, y1: LV.neck },
    }
    // round 4: belly 14 → 16 mm (dossier 14 [est]); the photo's far-side caps reach further past the wall than ours did
    const proj = { foot: { corner: 11, centre: 10.5 }, belly: { corner: 16, centre: 16 }, neck: { corner: 9, centre: 10 } }
    for (const [name, r] of Object.entries(regs)) {
      for (let k = 0; k < 4; k++) {
        // corner flanges (45°, F2 hooked, 6 mm thick)
        const pc = wallPath(r.body, k, 1, r.y0, r.y1, diag(k))
        F({ path: pc, outline: segmentOutline(FLANGE_POLY[name], pc.length, proj[name].corner, 2.2), thickness: 6.5, embed: 2.2, taper: 1.2 })
        const pf = wallPath(r.body, k, 0.5, r.y0, r.y1, face(k))
        const L = pf.length
        if (k % 2 === 1) {
          // narrow-face centre flanges: hooked, at least as heavy as the corners
          F({ path: pf, outline: segmentOutline(FLANGE_POLY[name], L, proj[name].centre, 2.2), thickness: 7, embed: 2.2, taper: 1.2 })
        } else if (name === 'belly') {
          // broad face: a low bar with a small projecting knob at 0.73 of the register
          F({ path: pf, outline: [[1.2, -2.2], [L - 1.2, -2.2], [L - 1.2, 6], [0.80 * L, 6], [0.785 * L, 9.6], [0.665 * L, 9.6], [0.65 * L, 6], [1.2, 6]], thickness: 7.5, embed: 2.2 })
        } else if (name === 'neck') {
          // broad face: one rectangular block 9 × 26 mm
          F({ path: pf, outline: [[-1.6, -2.2], [L + 0.4, -2.2], [L + 0.4, 6.2], [-1.6, 6.2]], thickness: 9, embed: 2.2, taper: 1.5, carve: 'contour' })
        } else {
          // broad face foot: a low block over the frieze, then a rounded tab hanging below it onto the plinth ledge
          F({ path: pf, outline: [[-1.4, -2.2], [L + 4.8, -2.2], [L + 4.8, 4.2], [10.8, 4.2], [9.8, 7.4], [8.2, 9.2], [5, 9.8], [1, 9.4], [-0.6, 8.2], [-1.4, 6]], thickness: 8, embed: 2.2, carve: false })
        }
      }
    }

    // lid: hip flanges (lower ends stab 12–15 mm past the eave corners as a downward point), slope-centre bars
    const lidY = (p) => p.clone().add(V(0, LV.lid, 0))
    const rise = lidOpts.rise, cc = lidOpts.concave
    const A = PLAN.eave[0], B = PLAN.eave[1]
    // slope normals of the loft at level v
    const faceN = (k, v) => {
      const gr = rise * ((1 - cc) + 2 * cc * v)
      const n = k % 2 === 0 ? V(0, B, gr) : V(gr, A - PLAN.ridgeHalf, 0)
      if (k === 2) n.z = -n.z
      if (k === 3) n.x = -n.x
      return n.normalize()
    }
    for (let k = 0; k < 4; k++) {
      const hip = lid.userData.hips[k].map((p) => lidY(p.clone()))
      const ph = polyPath(hip, hip.map((_, i) => faceN(k, i / 12).add(faceN((k + 1) % 4, i / 12)).normalize()))
      const L = ph.length
      // a broad plate on the hip, 7 mm thick: its projection grows from 4 mm at the ridge to 10.5 at the eave on a
      // convex curve (the photo's lid outline bows like a bell), incised T/L hooks on its flanks; past the eave
      // corner it ends in a point stabbing down, 13–15 mm beyond the corner
      const crest = []
      for (let i = 0; i <= 12; i++) {
        const f = 1 - i / 12 // σ from the ridge down to the eave
        crest.push([f * L, 6 + 4.5 * (1 - f * f)]) // round 4: a heavier plank all the way up (review: 7 × 7 mm bar)
      }
      // photo: past the eave corner the crest keeps its convex run down to a point at about eave level; behind the
      // point the underside steps back in one small squared notch (no hook, no droop below the eave)
      F({ path: ph, outline: [[-9.5, -3], [L, -3], ...crest, [-4.5, 10.3], [-9, 9.1], [-12.5, 7.2], [-14, 5.4], [-10.6, 4.6], [-10.6, 2.0], [-9.5, 1.2]], thickness: 8, embed: 3, taper: 1, carve: 'contour' }) // review: no continuous key-fret, one faint contour line
      const mid = lid.userData.midlines[SIDES[k]].map(lidY)
      const pm = polyPath(mid, mid.map((_, i) => faceN(k, i / 12)))
      const Lm = pm.length
      if (k % 2 === 0) {
        // broad slopes: plain bar, a smaller block at the top of the main panel, a tall squared peg at the top of the kui frieze
        const st = lidZones.vf0 + lidZones.Hu, sb = lidZones.vs0
        F({ path: pm, outline: [[-1.5, -2.6], [st, -2.6], [st, 15], [st - 8, 15], [st - 8, 6], [sb + 6, 6], [sb + 6, 10.5], [sb - 1, 10.5], [sb - 1, 6], [-1.5, 6]], thickness: 7.5, embed: 2.6, taper: 1.5, carve: 'contour' })
      } else {
        const st = 0.8 * Lm
        F({ path: pm, outline: [[-1.5, -2.6], [st, -2.6], [st + 2, 3], [st, 6], [0.62 * Lm, 6], [0.6 * Lm, 4.4], [0.56 * Lm, 4.4], [0.54 * Lm, 6], [0.3 * Lm, 6], [0.28 * Lm, 4.4], [0.24 * Lm, 4.4], [0.22 * Lm, 6], [-1.5, 6]], thickness: 6.5, embed: 2.6, carve: 'contour' })
      }
    }
    // ridge beams either side of the knob post, ends turned up and projecting past the hip tops
    for (const sx of [1, -1]) {
      const a = V(sx * (PLAN.post[0] + 0.4), LV.apex, 0), b = V(sx * (PLAN.ridgeHalf + 8), LV.apex, 0)
      const Lb = a.distanceTo(b)
      // one continuous plank: 12 mm on the apex (≈ 8 showing above the slopes); photo: its end is a squared block
      // stepping up ≈ 2.5 mm past the hip top (not a swept horn)
      const m = F({ from: a, to: b, out: V(0, 1, 0), outline: [[0, -3], [Lb - 6, -3], [Lb - 6, 3], [Lb + 1, 3], [Lb + 1, LV.beam + 2.6], [Lb - 8, LV.beam + 2.6], [Lb - 8.6, LV.beam], [0, LV.beam]], thickness: 8, embed: 3, taper: 1.5, carve: 'contour' })
      m.userData.part = 'lid'
    }
    // knob: plain corner ridges whose eave tips hook down and in
    for (let k = 0; k < 4; k++) {
      // flat strips (5 mm wide, 1.8 proud) following the concave hips; past the eave corner an open loop ≈ 6.5 mm
      // long hooking down and in
      const hp = knob.userData.hipPts(k)
      const out = V(SN[k][0] + SN[(k + 1) % 4][0], 0.55, SN[k][2] + SN[(k + 1) % 4][2]).normalize()
      const path = polyPath(hp, hp.map(() => out))
      const L = path.length
      // round 4 (review): a prouder flat bar (2.6 mm) and a larger open loop (≈ 9 mm) at the eave
      F({ path, outline: [[-1, -1.2], [L, -1.2], [L, 2.6], [0, 2.6], [-4, 2.4], [-7.2, 1.0], [-9, -1.8], [-8.8, -5.8], [-6.6, -8.2], [-3.8, -8], [-3, -6.3], [-4.7, -5.8], [-6, -4.2], [-5.8, -1.6], [-3.4, -0.4]], thickness: 6.5, embed: 1.2, taper: 1, carve: false })
    }

    await onProgress(1, 'done')
    object.userData.decorStats = stats
    return { object, parts: { base, foot, belly, neck, lid, knob, flanges }, panels }
  },
}

void rectPoint
