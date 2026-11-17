// Nezu Museum square lei 饕餮文方罍 (90081) — Shang dynasty, 12th–11th c. BC. Reconstructed from the project
// owner's two photographs (reference/nezu-fanglei/photo-37.jpg front, photo-36.jpg three-quarter from the right)
// via reference/nezu-fanglei/dossier.md. H = 503 mm is INFERRED (no dimension on the label). Units mm, Y up,
// front (+Z) = the face with the low lug; the loop handles are on ±X.
//
// Form (nezu-fanglei/form.js): a short square foot, a belly swelling up to broad shoulders (widest just under
// the shoulder crease), a shoulder rounding in to a flat ledge, a square collar, a hipped-roof lid with a skirt
// and a roof-shaped knob on a post. Thick slotted flanges on every corner of foot, belly, shoulder, collar and lid
// hips; slender centre flanges. Sculpture (nezu-fanglei/sculpture.js): two shoulder loop handles with heads,
// frontal heads on the front/back shoulder, the low lug. Décor (nezu-fanglei/relief.js) is TRACED from the
// flattened faces of photo-37 (reference/nezu-fanglei/faces/, trace.py → nezu-fanglei/trace-data.js).

import * as THREE from 'three'
import { H, LV, PLAN, RHO, bellyHalf, shoulderHalf, polyPath, toothed, slotRow, flankMarks } from './nezu-fanglei/form.js'
import { handleHeadSDF, handleRingSDF, shoulderHeadSDF, lugHeadSDF, lugRingSDF } from './nezu-fanglei/sculpture.js'
import { bellyPanel, shoulderPanel, collarPanel, footPanel, lidPanel, knobPanel } from './nezu-fanglei/relief.js'

const SIDES = ['front', 'right', 'back', 'left']

/** concatenate indexed geometries with the same attributes (meshSDF output: position, normal, uv) */
function mergeGeos(geos) {
  const names = Object.keys(geos[0].attributes)
  const out = new THREE.BufferGeometry()
  for (const n of names) {
    const size = geos[0].attributes[n].itemSize
    const arr = new Float32Array(geos.reduce((a, g) => a + g.attributes[n].array.length, 0))
    let o = 0
    for (const g of geos) { arr.set(g.attributes[n].array, o); o += g.attributes[n].array.length }
    out.setAttribute(n, new THREE.BufferAttribute(arr, size))
  }
  const idx = []
  let base = 0
  for (const g of geos) {
    const I = g.index.array
    for (let i = 0; i < I.length; i++) idx.push(I[i] + base)
    base += g.attributes.position.count
  }
  out.setIndex(idx)
  return out
}
const SN = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]]

export default {
  id: 'nezu-fanglei',
  order: 8,
  title: 'Square Lei with Taotie Design',
  titleZh: '饕餮文方罍',
  type: 'fanglei',
  date: '12th–11th century BC',
  period: 'Shang dynasty (Anyang period, by style)',
  findspot: 'Not stated on the label',
  collection: 'Nezu Museum, Tokyo',
  accession: '90081 (number on the gallery label; exhibit 13)',
  designation: 'none stated on the label',
  dimensions: { h: 503, w: 261, d: 170, inferred: true, note: 'INFERRED: H assumed 503 mm (typical square lei 45–60 cm); proportions solved from the two photographs (depth : width 0.65 ± 0.05 from photo-36, round 10b); w, d = body without flanges and handles' },
  blurb:
    'A tall square wine jar whose walls swell from a narrow foot to broad shoulders, closed by a hipped-roof lid with a little roof on a post for its knob. ' +
    'Slotted flanges run down every corner and face; masks with round boss eyes and fat hooked horns fill the belly in two registers over a fine thunder-pattern ground, ' +
    'loop handles with animal heads ride the shoulders, a horned head juts from the front shoulder, and a lug low on the front would have let the jar be tipped to pour. ' +
    'Reconstructed from two of the project owner’s photographs: the height is inferred, and the back and left faces repeat the visible ones.',
  defaultPatina: 'nezu-fanglei',
  views: {
    // solved from the photographs (.work/r7-lei/solve): photo-37 az ≈ 3°, el ≈ 10°, ≈ 3.8 m (long lens: fov ≈ 9°).
    // three-quarter, round 10 (.work/lei-mid/fit36e.py): photo-36 is NOT a long-lens shot — a pinhole fitted to the
    // knob tip, the near collar corner (top, bottom), the far-left collar corner and the near foot corner (principal point
    // at the image centre, 8 px rms) puts the phone ≈ 0.73 m from the axis at y ≈ 404 (lid-skirt height), az 67.6°,
    // looking down ≈ 13° at the belly, f ≈ 2520 px (vfov 41° over the three-quarter.jpg crop). These numbers reproduce
    // that camera (target = the crop centre's ray at the axis, fov = the crop's vertical angle).
    front: { azimuth: 3, elevation: 10, fov: 10, fit: 0.98, target: [0, 252, 0], ref: 'front.jpg' },
    'three-quarter': { azimuth: 67.64, elevation: 13.1, fov: 40.9, fit: 0.867, target: [5.1, 233.9, -12.3], ref: 'three-quarter.jpg' },
    side: { azimuth: 90, elevation: 6, fov: 26, fit: 1.08 },
    back: { azimuth: 180, elevation: 8, fov: 26, fit: 1.08 },
    top: { azimuth: 20, elevation: 70, fov: 28, fit: 1.05 },
    'detail-shoulder-head': { azimuth: 0, elevation: 10, fov: 12, fit: 0.16, target: [0, 297, 86.7], ref: 'detail-shoulder-head.jpg' },
    'detail-belly-mask': { azimuth: 0, elevation: 10, fov: 12, fit: 0.42, target: [0, 222, 84.1], ref: 'detail-belly-mask.jpg' },
    'detail-eye': { azimuth: 0, elevation: 10, fov: 12, fit: 0.08, target: [-37, 205, 84.9], ref: 'detail-eye.jpg' },
    'detail-handle': { azimuth: 0, elevation: 10, fov: 12, fit: 0.15, target: [138, 306, 0], ref: 'detail-handle.jpg' },
    'detail-lug': { azimuth: 0, elevation: 10, fov: 12, fit: 0.16, target: [0, 66, 86.7], ref: 'detail-lug.jpg' },
    'detail-lid-face': { azimuth: 0, elevation: 10, fov: 12, fit: 0.32, target: [0, 425, 34.7], ref: 'detail-lid-face.jpg' },
    'detail-knob': { azimuth: 0, elevation: 10, fov: 12, fit: 0.1, target: [0, 488, 0], ref: 'detail-knob.jpg' },
    'detail-flange': { azimuth: 0, elevation: 10, fov: 12, fit: 0.26, target: [-118, 165, 79.7], ref: 'detail-flange.jpg' },
    'detail-foot': { azimuth: 0, elevation: 10, fov: 12, fit: 0.2, target: [0, 18, 43.3], ref: 'detail-foot.jpg' },
    'detail-collar': { azimuth: 0, elevation: 10, fov: 12, fit: 0.24, target: [0, 352, 55.5], ref: 'detail-collar.jpg' },
    // flat faces (KIT.md § Flat faces): head-on on a register's chord plane; ref = the flattened photo-37
    // (reference/nezu-fanglei/faces.json → tools/faces.mjs --rectify). The tracing instrument for relief.js.
    'face-shoulder': { face: { center: [0, 294, 89.55], normal: [0, 0.255, 0.9669], up: [0, 0.9669, -0.255], width: 265, height: 66.1 }, ref: 'faces/face-shoulder.jpg' },
    'face-main': { face: { center: [0, 220.5, 96.56], normal: [0, -0.0273, 0.9996], up: [0, 0.9996, 0.0273], width: 265, height: 87 }, ref: 'faces/face-main.jpg' },
    'face-second': { face: { center: [0, 139.5, 84.75], normal: [0, -0.2666, 0.9638], up: [0, 0.9638, 0.2666], width: 258, height: 81.9 }, ref: 'faces/face-second.jpg' },
    'face-low': { face: { center: [0, 68, 63.11], normal: [0, -0.3159, 0.9488], up: [0, 0.9488, 0.3159], width: 202, height: 71.6 }, ref: 'faces/face-low.jpg' },
    'face-foot': { face: { center: [0, 10.75, 46.88], normal: [0, 0, 1], up: [0, 1, 0], width: 129, height: 23.5 }, ref: 'faces/face-foot.jpg' },
    'face-collar': { face: { center: [0, 350.5, 64.12], normal: [0, 0, 1], up: [0, 1, 0], width: 175, height: 53 }, ref: 'faces/face-collar.jpg' },
    'face-lid': { face: { center: [0, 423, 33], normal: [0, 0.686, 0.7276], up: [0, 0.7276, -0.686], width: 180, height: 98.2 }, ref: 'faces/face-lid.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {}, params = {} } = {}) {
    // ?relief=photo | photo-pure: the main register read off the photograph (experiment; nezu-fanglei/relief.js)
    const relief = params.relief || null
    const q = Math.max(0.25, quality)
    const ppmm = 4.4 * Math.sqrt(q)
    const dens = 0.75 * Math.sqrt(q)
    const seed = 90081
    const plain = new kit.PatinaMaterial()
    const ledge = new kit.PatinaMaterial({ cavity: 0.5 })
    const object = new THREE.Group()
    object.name = 'nezu-fanglei'
    const panels = {}
    const V = (x, y, z) => new THREE.Vector3(x, y, z)

    // ---------------------------------------------------------------- layouts
    const b0 = bellyHalf(LV.foot)
    const bellyOpts = {
      width: 2 * b0, depth: 2 * RHO * b0, height: LV.main - LV.foot, wall: 7, floor: { thickness: 5 }, rim: false,
      profile: (t) => { const h = bellyHalf(LV.foot + t * (LV.main - LV.foot)); return { dx: h - b0, dz: RHO * (h - b0) } }, material: plain, part: 'belly', cast: false, density: dens, plainDensity: 0.08,
    }
    const s0 = shoulderHalf(LV.main)
    const shoulderOpts = {
      width: 2 * s0, depth: 2 * RHO * s0, height: LV.shoulder - LV.main, wall: RHO * (s0 - PLAN.collar) - 4, floor: false, rim: { kind: 'plain', round: 1.2 },
      profile: (t) => { const h = shoulderHalf(LV.main + t * (LV.shoulder - LV.main)); return { dx: h - s0, dz: RHO * (h - s0) } }, material: plain, part: 'shoulder', cast: false, density: dens, plainDensity: 0.08,
    }
    const collarOpts = { width: 2 * PLAN.collar, depth: 2 * RHO * PLAN.collar, height: LV.collar - LV.shoulder, wall: 6, floor: false, rim: { kind: 'plain' }, material: plain, part: 'collar', cast: false, density: dens }
    const footOpts = { width: 2 * PLAN.foot, depth: 2 * RHO * PLAN.foot, height: LV.foot, wall: 6, floor: { thickness: 4 }, rim: false, material: plain, part: 'foot', cast: false, density: dens }
    const lidOpts = {
      width: 2 * PLAN.eave, depth: 2 * RHO * PLAN.eave, rise: LV.rise, ridge: 2 * PLAN.ridgeHalf, concave: 0,
      skirt: { height: LV.skirt, overhang: PLAN.eave - PLAN.skirt, fascia: LV.fascia }, thickness: 4,
    }
    const bellyL = kit.fangLayout(bellyOpts), shoulderL = kit.fangLayout(shoulderOpts), collarL = kit.fangLayout(collarOpts), footL = kit.fangLayout(footOpts)
    const lidL = kit.hippedLidLayout(lidOpts)

    // ---------------------------------------------------------------- relief panels (traced, nezu-fanglei/relief.js)
    const ctx = { ppmm, seed, q }
    // the narrow ±X faces: seen less, a lighter panel. Round 10b: the front design at its TRUE size in a narrower field —
    // elements that do not fit the narrow face are dropped (not squashed in x as before)
    const side = { ...ctx, side: true, ppmm: ppmm * 0.7 }
    await onProgress(0.02, 'belly · broad face (traced)')
    panels.bellyLong = await bellyPanel(kit, bellyL.sides.front.cells[0][0], { ...ctx, relief })
    await onProgress(0.2, 'belly · narrow face')
    panels.bellyShort = await bellyPanel(kit, bellyL.sides.right.cells[0][0], { ...side, seed: seed + 1 })
    await onProgress(0.36, 'shoulder frieze')
    panels.shoulderLong = shoulderPanel(kit, shoulderL.sides.front.cells[0][0], { ...ctx, seed: seed + 2 })
    panels.shoulderShort = shoulderPanel(kit, shoulderL.sides.right.cells[0][0], { ...side, seed: seed + 3 })
    await onProgress(0.44, 'collar frieze')
    panels.collarLong = collarPanel(kit, collarL.sides.front.cells[0][0], { ...ctx, seed: seed + 4 })
    panels.collarShort = collarPanel(kit, collarL.sides.right.cells[0][0], { ...side, seed: seed + 5 })
    await onProgress(0.5, 'foot frieze')
    panels.footLong = footPanel(kit, footL.sides.front.cells[0][0], { ...ctx, seed: seed + 6 })
    panels.footShort = footPanel(kit, footL.sides.right.cells[0][0], { ...side, seed: seed + 7 })
    await onProgress(0.55, 'lid slopes')
    panels.lidLong = lidPanel(kit, lidL.faces.front, { ...ctx, seed: seed + 8, kind: 'long' })
    panels.lidShort = lidPanel(kit, lidL.faces.right, { ...ctx, seed: seed + 9, kind: 'short' })
    await onProgress(0.62, 'knob')
    const knobOpts = {
      width: 2 * PLAN.knob.eave, depth: 2 * PLAN.knob.depth, rise: LV.top - LV.knobEave - 5.5, ridge: PLAN.knob.ridge,
      skirt: { height: 0.5, fascia: 5 }, // (kit.roofKnob lofts the fascia only when skirt.height > 0)
      post: { height: LV.knobEave - LV.ridge, width: 2 * PLAN.knob.post[0], depth: 2 * PLAN.knob.post[1], waist: 0 }, // photo-37: a thick vertical-sided cap (≈ 1/3 of its height) with a low hipped top, on a straight square post
    }
    const knobL = kit.hippedLidLayout(knobOpts)
    panels.knobLong = knobPanel(kit, knobL.faces.front, { ...ctx, seed: seed + 10, kind: 'long' })
    panels.knobShort = knobPanel(kit, knobL.faces.right, { ...ctx, seed: seed + 11, kind: 'short' })

    // ---------------------------------------------------------------- casting the stack
    await onProgress(0.68, 'casting')
    const cell = (relief) => (relief ? [[{ relief, map: 'true', fade: 1.0, density: dens }]] : null)
    const cells = (name) => ({ long: cell(panels[name + 'Long']), short: cell(panels[name + 'Short']) })
    const foot = kit.fangBody({ ...footOpts, cells: cells('foot') })
    const belly = kit.fangBody({ ...bellyOpts, cells: cells('belly') })
    belly.position.y = LV.foot
    const shoulder = kit.fangBody({ ...shoulderOpts, cells: cells('shoulder') })
    shoulder.position.y = LV.main
    shoulder.traverse((m) => { if (m.isMesh && /^rim/.test(m.name)) m.material = ledge })
    const collar = kit.fangBody({ ...collarOpts, cells: cells('collar') })
    collar.position.y = LV.shoulder
    object.add(foot, belly, shoulder, collar)
    // round 10 (photo-36 / photo-37): where the collar meets the shoulder a plain stepped plinth runs round the collar's
    // foot, and turned step-lines ring the flat ledge outside it. Flat rectangular frames lying on the ledge (y 325).
    const frame = (inset, width, height, name) => {
      const hw = PLAN.collar + inset, hd = RHO * PLAN.collar + inset
      const sh = new THREE.Shape([new THREE.Vector2(-hw, -hd), new THREE.Vector2(hw, -hd), new THREE.Vector2(hw, hd), new THREE.Vector2(-hw, hd)])
      const iw = hw - width, id = hd - width
      sh.holes.push(new THREE.Path([new THREE.Vector2(-iw, -id), new THREE.Vector2(-iw, id), new THREE.Vector2(iw, id), new THREE.Vector2(iw, -id)]))
      const g = new THREE.ExtrudeGeometry(sh, { depth: height + 0.6, bevelEnabled: true, bevelThickness: Math.min(0.5, height * 0.4), bevelSize: Math.min(0.5, width * 0.25), bevelSegments: 1, curveSegments: 1 })
      g.rotateX(-Math.PI / 2)
      const m = new THREE.Mesh(g, plain)
      m.position.y = LV.shoulder - 0.6
      m.name = name
      m.userData.part = 'shoulder'
      m.castShadow = m.receiveShadow = true
      object.add(m)
    }
    frame(2.8, 3.2, 3.2, 'collar-plinth') // the plain step at the collar's foot: 2.8 mm proud, 3.2 tall
    frame(6.6, 1.6, 0.9, 'ledge-line-1')
    frame(10.8, 1.6, 0.9, 'ledge-line-2')
    frame(15.0, 1.6, 0.9, 'ledge-line-3')

    const lid = kit.hippedLid({
      ...lidOpts, material: plain, density: dens,
      faces: { long: panels.lidLong && { relief: panels.lidLong, density: dens, fade: 0.8 }, short: panels.lidShort && { relief: panels.lidShort, density: dens, fade: 0.8 } },
    })
    lid.position.y = LV.collar
    object.add(lid)
    const knob = kit.roofKnob({
      ...knobOpts, material: plain, part: 'knob', embed: 10,
      faces: { long: panels.knobLong && { relief: panels.knobLong, density: 2 * dens }, short: panels.knobShort && { relief: panels.knobShort, density: 2 * dens } },
    })
    knob.position.y = LV.ridge
    object.add(knob)

    // ---------------------------------------------------------------- flanges
    await onProgress(0.76, 'flanges')
    const flanges = []
    const F = (o) => {
      const m = kit.flange({ material: plain, waver: 0.25, taper: 2, bevel: 1.0, grooveStyle: { width: 0.8, depth: 0.4 }, seed: seed + flanges.length * 13, ...o })
      flanges.push(m)
      object.add(m)
      return m
    }
    // a path up a body wall: corner of side k (s = 1) or face centre (s = 0.5), world y0 → y1
    const wallPath = (body, k, s, y0, y1, out, n = 24) => {
      const pts = [], outs = []
      for (let i = 0; i <= n; i++) {
        const y = y0 + ((y1 - y0) * i) / n
        const p = body.userData.at(SIDES[k], s, y - body.position.y)
        p.y += body.position.y
        pts.push(p)
        outs.push(out.clone())
      }
      return polyPath(pts, outs)
    }
    const diag = (k) => V(SN[k][0] + SN[(k + 1) % 4][0], 0, SN[k][2] + SN[(k + 1) % 4][2]).normalize()
    const face = (k) => V(...SN[k])
    const slotted = (L, p, n, opts = {}) => {
      const slots = slotRow(opts.a ?? 0, opts.b ?? L, n)
      const outline = toothed(L, p, { slots, ...opts })
      const sB = opts.bottom ? -(opts.bottom.over ?? 0) : 0, sT = opts.top ? L + (opts.top.over ?? 0) : L
      return { outline, grooves: opts.marks === false ? [] : flankMarks(L, p, slots, { sB, sT }) }
    }
    for (let k = 0; k < 4; k++) {
      // belly corners: 23 mm slabs, 17 slots, a squared cap standing above the belly top (photo-37)
      {
        const path = wallPath(belly, k, 1, 40, LV.main, diag(k))
        F({ path, ...slotted(path.length, 23, 17, { w: 2.6, dep: 9, top: { over: 0, up: 1.5, len: 10 } }), thickness: 8, embed: 2.5 }) // 23 mm: photo-37 shows ≈ 20 mm of it in x at 45°
      }
      // shoulder corners: slotted, the top end hooking up past the ledge
      {
        // photo-37: a separate slab with a clear gap above the belly flange's squared cap, standing further out, 3 slots, its top hooking up past the ledge
        const path = wallPath(shoulder, k, 1, LV.main + 7, LV.shoulder, diag(k), 12)
        F({ path, ...slotted(path.length, 22, 3, { w: 2.6, dep: 9, bottom: { over: 0, up: 0, len: 5 }, top: { over: 0, up: 3, len: 10 } }), thickness: 8, embed: 2.5 }) // round 10: a squared top just proud of the ledge — no cap running in over it (it crossed in front of the handle)
      }
      // collar corners and centres
      {
        const from = collar.userData.at(SIDES[k], 1, 0).add(V(0, LV.shoulder, 0)), to = collar.userData.at(SIDES[k], 1, LV.collar - LV.shoulder).add(V(0, LV.shoulder, 0))
        const L = from.distanceTo(to)
        F({ from, to, out: diag(k), ...slotted(L, 8.5, 2, { w: 2.2, dep: 4.5 }), thickness: 6.5, embed: 2 })
        const fc = collar.userData.at(SIDES[k], 0.5, 0).add(V(0, LV.shoulder, 0)), tc = collar.userData.at(SIDES[k], 0.5, LV.collar - LV.shoulder).add(V(0, LV.shoulder, 0))
        F({ from: fc, to: tc, out: face(k), ...slotted(L, 6, 1, { w: 2, dep: 3, marks: false }), thickness: 5.5, embed: 2 })
      }
      // foot corners and centres (short tabs)
      {
        const from = foot.userData.at(SIDES[k], 1, LV.base), to = foot.userData.at(SIDES[k], 1, LV.foot - 0.5)
        F({ from, to, out: diag(k), ...slotted(from.distanceTo(to), 7, 1, { w: 2, dep: 3.5, marks: false }), thickness: 6, embed: 2 })
        const fc = foot.userData.at(SIDES[k], 0.5, LV.base), tc = foot.userData.at(SIDES[k], 0.5, LV.foot - 0.5)
        if (k !== 0) F({ from: fc, to: tc, out: face(k), ...slotted(fc.distanceTo(tc), 5, 1, { w: 2, dep: 2.5, marks: false }), thickness: 5, embed: 2 })
      }
      // belly centre flanges: slender ribs with small slots; the front one stops above the lug (photo-37),
      // the others run on through the low register (inferred)
      {
        const y0 = k === 0 ? LV.low - 2 : LV.narrow
        // round 10: on the narrow ±X faces the centre flange stops under the handle's ring (photo-36: the ring's lower arc
        // hangs over the belly top at y ≈ 239 with plain décor behind it, no flange)
        const y1 = k % 2 ? 230 : LV.main + 1
        const path = wallPath(belly, k, 0.5, y0, y1, face(k))
        F({ path, ...slotted(path.length, 7, Math.round(path.length / 13), { w: 1.8, dep: 2.4, marks: false }), thickness: 6.5, embed: 2 })
      }
    }
    // lid: hip flanges (slotted, rising past the ridge as ears, a point past the eave corner) and slope centre bars
    const rise = LV.rise, A = PLAN.eave, rh = PLAN.ridgeHalf
    const nFront = V(0, RHO * A, rise).normalize(), nSide = V(rise, A - rh, 0).normalize()
    const slopeN = (k) => (k === 0 ? nFront.clone() : k === 2 ? V(0, nFront.y, -nFront.z) : k === 1 ? nSide.clone() : V(-nSide.x, nSide.y, 0))
    for (let k = 0; k < 4; k++) {
      const hip = lid.userData.hips[k].map((p) => p.clone().add(V(0, LV.collar, 0)))
      const from = hip[0], to = hip[hip.length - 1]
      const out = slopeN(k).add(slopeN((k + 1) % 4)).normalize()
      const L = from.distanceTo(to)
      // round 10 (photo-36 at the fitted camera): heavy slabs ≈ 13.5 mm deep and ≈ 10.5 thick, cut by 7 WIDE shallow
      // notches into crenellated blocks (not a comb of thin slots); the lower end runs ≈ 8 mm past the eave corner and
      // turns up as a tip, the top rises past the ridge as an ear. (16 mm / 12 mm overshot photo-36's silhouette.)
      F({ from, to, out, ...slotted(L, 13.5, 7, { w: 4.2, dep: 4.8, top: { over: 2, up: 6, len: 10 }, bottom: { over: 8, up: 3, len: 8 } }), thickness: 10.5, bevel: 0.6, embed: 3 })
      const mid = lid.userData.midlines[SIDES[k]].map((p) => p.clone().add(V(0, LV.collar, 0)))
      const mf = mid[0], mt = mid[mid.length - 1]
      const Lm = mf.distanceTo(mt)
      // round 10: a real notched flange down the middle of every slope (photo-36: a thick slab standing ≈ 9 mm off the
      // end slope, its lower end running past the eave); seen head-on in photo-37 it is the pale bar on the axis
      F({ from: mf, to: mt, out: slopeN(k), outline: toothed(Lm, 9, { slots: slotRow(8, Lm - 6, 5), w: 2.2, dep: 4, bottom: { over: 8, up: 2.5, len: 6 } }), thickness: 7.5, bevel: 0.5, embed: 2.5, grooves: [] })
    }

    // ---------------------------------------------------------------- sculpture
    await onProgress(0.84, 'handles and heads')
    const voxel = Math.max(0.6, 0.78 / Math.sqrt(q))
    const sMat = new kit.PatinaMaterial()
    const mesh = (geo, part) => {
      const m = new THREE.Mesh(geo, sMat)
      m.userData.part = part
      m.castShadow = m.receiveShadow = true
      object.add(m)
      return m
    }
    // the shoulder handles: a head holding a ring (sculpture.js), two fields with tight bounds merged into one mesh per side
    const hGeo = mergeGeos([kit.meshSDF(handleHeadSDF(), { voxel: voxel * 1.2 }), kit.meshSDF(handleRingSDF(), { voxel: voxel * 1.6 })])
    const handles = [mesh(hGeo, 'handles')]
    const hGeo2 = hGeo.clone().applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI))
    handles.push(mesh(hGeo2, 'handles'))
    const headGeo = kit.meshSDF(shoulderHeadSDF(), { voxel })
    const heads = [mesh(headGeo, 'heads')]
    heads.push(mesh(headGeo.clone().applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI)), 'heads')) // back: inferred
    const lug = mesh(mergeGeos([kit.meshSDF(lugHeadSDF(), { voxel: voxel * 0.88 }), kit.meshSDF(lugRingSDF(), { voxel: voxel * 1.35 })]), 'lug')

    await onProgress(1, 'done')
    void H; void face
    return { object, parts: { foot, belly, shoulder, collar, lid, knob, flanges, handles, heads, lug }, panels }
  },
}
