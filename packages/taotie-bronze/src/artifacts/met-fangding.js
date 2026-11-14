// Met fangding 49.135.2 — rectangular cauldron, 12th–11th c. BCE. Reconstruction from
// reference/met-fangding/dossier.md (measured on the Met's head-on long-face, short-face and
// three-quarter photographs). Units mm, Y up, the legs stand on y = 0, front (+Z) = a LONG face,
// handles on the short (±X) sides.
//
// Form: a vertical-walled box 162 × 131 on four tapering columnar legs, a thick slab rim, two plain
// upright loop handles, 45° corner flanges with two lugs and incised T marks, and a plain centre
// flange (the mask's nose) on every face. Décor (met-fangding/wall.js) is TRACED from the flattened
// photographs (reference/met-fangding/faces/, trace.py → met-fangding/trace-data.js).

import * as THREE from 'three'
import { wallPanel } from './met-fangding/wall.js'
import { legPanel, cornerOutline, centreOutline } from './met-fangding/parts.js'

const H = 229
const LEG_H = 98.5 // ground → body underside
const WALL_TOP = 180.2
const WALL_H = WALL_TOP - LEG_H
const RIM = { height: 6.3, overhang: 5.4 } // slab 180.2 → 186.5, 173.6 × 141.8 overall
const W = 162, D = 131 // wall outer faces (long × short)
const HANDLE = { width: 44, height: H - WALL_TOP - RIM.height, bar: 12.8, barTop: 12.5, depth: 15, radius: 13, aperture: 9, x: 76 }
const LEG = { r: 12.3, taper: 0.15, x: 54, z: 42, splay: 0.5 }
const FLANGE_Y = [102.5, 173.2] // corner and centre flanges: mask bottom → frieze top
const LUG_Y = 151.6 // the fillet between frieze and mask

export default {
  id: 'met-fangding',
  order: 3,
  title: 'Rectangular Cauldron (Fangding)',
  titleZh: '方鼎',
  type: 'fangding',
  date: '12th–11th century BCE',
  period: 'Late Shang dynasty, Anyang period (Yinxu III–IV by style)',
  findspot: 'Not recorded',
  collection: 'The Metropolitan Museum of Art, New York — Bequest of Addie W. Kahn, 1949',
  accession: '49.135.2',
  dimensions: { h: 229, w: 152, d: 178 },
  blurb:
    'A small four-legged cauldron whose every wall is one taotie: fat, rounded bands of pale bronze — a broad horn sweeping out from the nose ridge, a pillow-shaped eye with a slit pupil, a jointed upright body — standing over a thunder-pattern ground darkened almost to black, under a frieze of dragons with tiny frontal heads. ' +
    'Six graphs are cast inside one wall. ' +
    'The décor is traced from the Met’s head-on photographs, flattened to scale; form and registers are measured from them, while the back faces, the inside and the hidden short face are assumed to repeat what is shown.',
  defaultPatina: 'met-fangding',
  views: {
    front: { azimuth: 0, elevation: 5, fov: 26, fit: 1.15, ref: 'front.jpg' },
    'three-quarter': { azimuth: 32, elevation: 14, fov: 30, fit: 0.98, ref: 'three-quarter.jpg' },
    side: { azimuth: 90, elevation: 3, fov: 26, fit: 1.12, ref: 'side.jpg' },
    'detail-mask-long': { azimuth: 0, elevation: 2, fov: 20, fit: 0.25, target: [0, 126, 66], ref: 'detail-mask-long.jpg' },
    'detail-frieze-long': { azimuth: 0, elevation: 2, fov: 20, fit: 0.25, target: [0, 163, 66], ref: 'detail-frieze-long.jpg' },
    'detail-face-short': { azimuth: 90, elevation: 3, fov: 20, fit: 0.26, target: [82, 138, 0], ref: 'detail-face-short.jpg' },
    'detail-flange-corner': { azimuth: 0, elevation: 2, fov: 20, fit: 0.21, target: [-80, 138, 66], ref: 'detail-flange-corner.jpg' },
    'detail-flange-centre': { azimuth: 0, elevation: 2, fov: 20, fit: 0.15, target: [0, 140, 68], ref: 'detail-flange-centre.jpg' },
    'detail-leg': { azimuth: 0, elevation: 2, fov: 20, fit: 0.24, target: [-54, 62, 42], ref: 'detail-leg.jpg' },
    'detail-handle': { azimuth: 0, elevation: 2, fov: 20, fit: 0.2, target: [-76, 203, 30], ref: 'detail-handle.jpg' },
    top: { azimuth: 20, elevation: 60, fov: 30, fit: 1.1 },
    // flat faces (KIT.md § Flat faces): head-on, framed on a face rectangle in mm; ref = the flattened photograph
    // (reference/met-fangding/faces.json → tools/faces.mjs --rectify)
    'face-long': { face: { center: [0, 140, 65.5], normal: [0, 0, 1], up: [0, 1, 0], width: 192, height: 92 }, ref: 'faces/face-long.jpg' },
    'face-long-main': { face: { center: [0, 126, 65.5], normal: [0, 0, 1], up: [0, 1, 0], width: 154, height: 50 }, ref: 'faces/face-long-main.jpg' },
    'face-long-frieze': { face: { center: [0, 163, 65.5], normal: [0, 0, 1], up: [0, 1, 0], width: 154, height: 24 }, ref: 'faces/face-long-frieze.jpg' },
    'face-short': { face: { center: [81, 140, 0], normal: [1, 0, 0], up: [0, 1, 0], width: 160, height: 92 }, ref: 'faces/face-short.jpg' },
    'face-short-main': { face: { center: [81, 126, 0], normal: [1, 0, 0], up: [0, 1, 0], width: 122, height: 50 }, ref: 'faces/face-short-main.jpg' },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const ppmm = 7 * Math.sqrt(q) // 1.0 mm leiwen needs ≥ 5 px/mm
    const seed = 491352
    const plain = new kit.PatinaMaterial()

    // ---- body: vertical box, sharp arrises under the corner flanges, thick slab rim with a rounded edge
    const bodyOpts = {
      width: W, depth: D, height: WALL_H, at: 'bottom', taper: 0,
      wall: 4.5, innerRadius: 2.5, floor: { thickness: 4.5, round: 3 },
      rim: { kind: 'slab', height: RIM.height, overhang: RIM.overhang, inner: 0.5, round: 2.6 },
      cast: { seed: 7, sag: 0.002, rim: 0.5, wave: 0.15, waveLength: 60, skew: 0.2 },
      material: plain, density: 1.0 * Math.sqrt(q), plainDensity: 0.1,
    }
    const layout = kit.fangLayout(bodyOpts)
    await onProgress(0.03, 'long wall (traced)')
    const long = wallPanel(kit, layout.sides.front.cells[0][0], { kind: 'long', y0: LEG_H, ppmm, seed, q })
    await onProgress(0.3, 'short wall (traced)')
    const short = wallPanel(kit, layout.sides.right.cells[0][0], { kind: 'short', y0: LEG_H, ppmm, seed: seed + 1, q })
    await onProgress(0.55, 'casting the walls')
    const cell = (relief) => [[{ relief, map: 'true', fade: 0.6 }]]
    const body = kit.fangBody({ ...bodyOpts, cells: { long: cell(long), short: cell(short) } })
    body.position.y = LEG_H
    const object = new THREE.Group()
    object.name = 'met-fangding'
    object.add(body)
    const U = body.userData
    const lift = (p) => p.clone().setY(p.y + LEG_H)

    // ---- flanges
    await onProgress(0.62, 'flanges')
    const flanges = []
    const L = FLANGE_Y[1] - FLANGE_Y[0]
    for (const [i, c] of Object.values(U.corners).entries()) {
      const at = (y) => lift(c.bottom.clone().lerp(c.top, (y - LEG_H - c.bottom.y) / (c.top.y - c.bottom.y)))
      const o = cornerOutline(L, { lugAt: LUG_Y - FLANGE_Y[0] })
      flanges.push(kit.flange({
        from: at(FLANGE_Y[0]), to: at(FLANGE_Y[1]), out: c.out, height: 8.5, thickness: 6, embed: 2.5, taper: 3, bevel: 1.4,
        outline: o.outline, grooves: o.grooves, grooveStyle: { width: 0.9, depth: 0.45 }, waver: 0.3, seed: seed + 10 + i, material: plain,
      }))
    }
    for (const [i, side] of ['front', 'right', 'back', 'left'].entries()) {
      const w = U.walls[side]
      const at = (y) => lift(U.at(side, 0.5, y - LEG_H))
      const isLong = side === 'front' || side === 'back'
      // long: a 4.5 mm plain rib ≈ 5 mm proud; short: a 6.5 mm rib ≈ 8 mm proud with T marks on its sides
      const o = centreOutline(L, isLong ? { p: 5, lug: 2.4, lugAt: LUG_Y - FLANGE_Y[0] } : { p: 8, lug: 2.2, lugAt: LUG_Y - FLANGE_Y[0], marks: true })
      flanges.push(kit.flange({
        from: at(FLANGE_Y[0]), to: at(FLANGE_Y[1]), out: w.normal, height: isLong ? 5 : 8, thickness: isLong ? 4.6 : 6.4, embed: 2, taper: 2, bevel: 1.3,
        outline: o.outline, grooves: o.grooves, grooveStyle: { width: 0.85, depth: 0.4 }, waver: 0.25, seed: seed + 20 + i, material: plain,
      }))
    }
    for (const f of flanges) object.add(f)

    // ---- legs: plain tapering columns with a rounded foot, incised thread décor on the upper 45 mm
    await onProgress(0.7, 'legs')
    const zone = [LEG_H - 47, LEG_H - 0.5]
    const legOpts = {
      height: LEG_H, radius: LEG.r, taper: LEG.taper, entasis: 0, foot: { swell: 0, height: 0.04 },
      top: { flare: 0.04, height: 4 }, embed: 4,
    }
    const arc = 200
    const lp = kit.legPanelSize({ ...legOpts, zone, arc })
    const legMap = legPanel(kit, lp, { ppmm: Math.max(4, 6 * Math.sqrt(q)), seed: seed + 100 })
    const legMat = new kit.PatinaMaterial({ relief: legMap })
    const legs = []
    for (const [i, [sx, sz]] of [[1, 1], [1, -1], [-1, -1], [-1, 1]].entries()) {
      const facing = (Math.atan2(sx * LEG.x, sz * LEG.z) * 180) / Math.PI
      const leg = kit.columnLeg({
        ...legOpts, material: plain, density: 0.8 * Math.sqrt(q),
        relief: { map: legMap, zone, arc, facing, material: legMat },
        splay: { angle: LEG.splay, toward: [sx * LEG.x, sz * LEG.z] },
        cast: { seed: seed + 30 + i, splay: 0.4, length: 0.002, twist: 2 },
      })
      leg.position.set(sx * LEG.x, 0, sz * LEG.z)
      object.add(leg)
      legs.push(leg)
    }

    // ---- handles: plain rounded upright loops on the short-side rims, vertical
    await onProgress(0.85, 'handles')
    const handles = []
    for (const sx of [-1, 1]) {
      const hnd = kit.uprightHandle({
        width: HANDLE.width, height: HANDLE.height, bar: HANDLE.bar, barTop: HANDLE.barTop, depth: HANDLE.depth,
        radius: HANDLE.radius, aperture: { radius: HANDLE.aperture }, lean: 0, embed: 6,
        density: 0.9 * Math.sqrt(q), cast: { seed: seed + 40 + sx, lean: 0.6, height: 0.01 }, material: plain,
      })
      hnd.rotation.y = (sx * Math.PI) / 2
      hnd.position.set(sx * HANDLE.x, U.rim.y + LEG_H, 0)
      object.add(hnd)
      handles.push(hnd)
    }
    await onProgress(1, 'done')
    return { object, parts: { body, legs, handles, flanges }, panels: { long, short, leg: legMap } }
  },
}
