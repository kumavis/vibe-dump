// Houmuwu ding 后母戊鼎 (National Museum of China) — reconstruction after
// reference/houmuwu-ding/dossier.md (measured from the photographs in that
// folder; where the dossier and research/ disagree, the dossier wins).
//
// Frame: mm, Y up, the legs stand on y = 0, long axis X (handles on the ±X
// end walls), front long face +Z. Parts: body (walls + floor + rim slab),
// legs (4, with their flanges), handles (2, with root blocks), flanges
// (4 corner + 8 short mid-wall, body only).

import * as THREE from 'three'
import { wallPanel, FRAME } from './houmuwu-ding/wall.js'
import { legPanel, handleOuterPanel, handleEdgePanel, handleRootPanel } from './houmuwu-ding/parts.js'

// ---- measured form (dossier §b)
const H = 1330
const LEG_H = 465 // ground → body underside
const WALL_H = 520 // underside → wall top (985)
const RIM_H = 58 // rim slab 985 → 1043
const RIM_OV = 34 // slab overhang beyond the wall face (photos: the rim stands 15–20 beyond the corner-flange crests)
const TOP_W = 1030, TOP_D = 719 // wall outer face at the top, under the rim (rim outer stays 1098 × 787)
const TAPER = { x: 2.2, z: 0.5 } // end walls lean 2.2°, long walls 0.5° (out going up)
const WALL_T = 60 // published wall thickness
const HANDLE = { width: 290, height: H - LEG_H - WALL_H - RIM_H, bar: 84, barTop: 90, depth: 100, radius: 32, aperture: 18, x: 492 }
const LEG = { r: 80, x: 420, z: 260 } // dossier ±429 ±15; 420 keeps the shaft flush with the end wall's foot (§b.4)

export default {
  id: 'houmuwu-ding',
  order: 1,
  title: 'Houmuwu Ding',
  titleZh: '后母戊鼎',
  type: 'fangding',
  date: 'c. 1200 BC',
  period: 'Late Shang, Anyang (Yinxu) phase II',
  findspot: 'Wuguan village, Anyang, Henan (royal cemetery, tomb M260); found 1939, recovered 1946',
  collection: 'National Museum of China, Beijing',
  accession: 'not published',
  dimensions: { h: 1330, w: 1100, d: 790 },
  blurb:
    'The heaviest bronze vessel to survive from ancient China: 133 cm high and 832 kg, cast about 1200 BC at Anyang for the cult of "Mother Wu", whose name is cast inside its wall. ' +
    'Each wall is a plain recessed field framed by confronted kui dragons on a 1.9 mm thunder-pattern ground, with ox-head masks at the upper corners and taotie at the lower, and on the outer face of each handle two tigers open their jaws over a human head. ' +
    'Proportions, frame layout and relief depths are measured from photographs; the line work of each motif is redrawn from them, and the unseen interior, the back face and the handle edges (fish) are inferred.',
  defaultPatina: 'houmuwu',
  views: {
    'three-quarter': { azimuth: -55, elevation: 1, fov: 46, fit: 0.97, ref: 'three-quarter.jpg' },
    front: { azimuth: 0, elevation: 0, fov: 39, fit: 1.0, ref: 'front.jpg' },
    side: { azimuth: 90, elevation: 0, fov: 43, fit: 1.04, ref: 'side.jpg' },
    'three-quarter-left-low': { azimuth: -27, elevation: 3, fov: 40, fit: 1.0, ref: 'three-quarter-left-low.jpg' },
    'three-quarter-right': { azimuth: 44, elevation: 5, fov: 50, fit: 0.9, ref: 'three-quarter-right.jpg' },
    'three-quarter-right-b': { azimuth: 43, elevation: 5, fov: 40, fit: 1.05, ref: 'three-quarter-right-b.jpg' },
    'side-low': { azimuth: 70, elevation: 0, fov: 45, fit: 0.97, ref: 'side-low.jpg' },
    'short-wall': { azimuth: 90, elevation: 2, fov: 30, fit: 0.32, target: [500, 725, 0], ref: 'detail-short-wall.jpg' },
    'frieze-top-centre': { azimuth: 0, elevation: 4, fov: 20, fit: 0.2, target: [0, 900, 395], ref: 'detail-frieze-top-centre.jpg' },
    'frieze-bottom-centre': { azimuth: 90, elevation: 1, fov: 22, fit: 0.24, target: [490, 520, 0], ref: 'detail-frieze-bottom-centre.jpg' },
    // handle views: the photos look up from below the rim top. stage.js clamps elevation at ≈ 1.15°,
    // so the camera is kept low by a low target and a short distance (wider fov) instead.
    'handle-front': { azimuth: 90, elevation: 0, fov: 36, fit: 0.37, target: [520, 1010, 0], ref: 'detail-handle-front.jpg' },
    handle: { azimuth: 90, elevation: 0, fov: 34, fit: 0.36, target: [520, 1012, 0], ref: 'detail-handle.jpg' },
    'handle-roots': { azimuth: 90, elevation: 0, fov: 20, fit: 0.22, target: [520, 985, 0], ref: 'detail-handle-roots.jpg' },
    // legs: each photo has its own side of the +X+Z (or −X+Z) leg; the mask axis is at az ≈ ±59°
    leg: { azimuth: 12, elevation: 1, fov: 22, fit: 0.24, target: [429, 300, 260], ref: 'detail-leg.jpg' },
    'leg-b': { azimuth: -10, elevation: 1, fov: 22, fit: 0.24, target: [-429, 290, 260], ref: 'detail-leg-b.jpg' },
    'leg-c': { azimuth: 18, elevation: 0, fov: 24, fit: 0.3, target: [429, 280, 260], ref: 'detail-leg-c.jpg' },
    'leg-d': { azimuth: 100, elevation: 1, fov: 22, fit: 0.28, target: [429, 290, 260], ref: 'detail-leg-d.jpg' },
    'front-ortho': { azimuth: 0, elevation: 0, fov: 14, fit: 1.08 },
    'side-ortho': { azimuth: 90, elevation: 0, fov: 14, fit: 1.08 },
    top: { azimuth: 20, elevation: 62, fov: 30, fit: 1.08 },
    'corner-masks': { azimuth: -45, elevation: 3, fov: 22, fit: 0.36, target: [-521, 725, 366] },
    'handle-face': { azimuth: 90, elevation: 2, fov: 20, fit: 0.19, target: [560, 1190, 0] },
    'frieze-long': { azimuth: -8, elevation: 4, fov: 24, fit: 0.42, target: [-250, 900, 395] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = quality
    const ppmm = 2.4 * q // 1.9 mm leiwen → ≈ 2.3 px per groove at q = 1
    const seed = 1939
    const plain = new kit.PatinaMaterial()

    // ---- body: near-vertical box, sharp arrises under the corner flanges, thick slab rim
    const bodyOpts = {
      width: TOP_W, depth: TOP_D, at: 'top', height: WALL_H, taper: TAPER,
      wall: WALL_T, innerRadius: 20, floor: { thickness: 45, round: 30 },
      rim: { kind: 'slab', height: RIM_H, overhang: RIM_OV, inner: 0, round: 5 },
      cast: { seed: 8, sag: 0.0025, rim: 6, wave: 0.8, waveLength: 120, skew: 0.3 },
      material: plain, density: 0.32 * Math.sqrt(q), plainDensity: 0.05,
    }
    const layout = kit.fangLayout(bodyOpts)
    await onProgress(0.03, 'long wall (mould section)')
    const long = wallPanel(kit, layout.sides.front.cells[0][0], { kind: 'long', ppmm, seed })
    await onProgress(0.3, 'short wall (mould section)')
    const short = wallPanel(kit, layout.sides.right.cells[0][0], { kind: 'short', ppmm, seed: seed + 50 })
    await onProgress(0.5, 'casting walls')
    const body = kit.fangBody({ ...bodyOpts, cells: { long: [[{ relief: long, map: 'true' }]], short: [[{ relief: short, map: 'true' }]] } })
    body.position.y = LEG_H
    const object = new THREE.Group()
    object.name = 'houmuwu-ding'
    object.add(body)
    const U = body.userData
    const lift = (p) => p.clone().setY(p.y + LEG_H)

    // ---- flanges (body only): 4 full-height corner flanges, 8 short mid-wall flanges
    await onProgress(0.58, 'flanges')
    const flanges = []
    for (const [i, c] of Object.values(U.corners).entries()) {
      flanges.push(kit.flange({
        from: lift(c.bottom), to: lift(c.top), out: c.out, height: 24, thickness: 17, embed: 4, taper: 2, bevel: 2.5,
        notches: { shape: 'square', pitch: 40, depth: 0.5, width: 10 }, waver: 0.6, seed: seed + i, material: plain,
      }))
    }
    for (const [i, side] of ['front', 'right', 'back', 'left'].entries()) {
      const w = U.walls[side]
      const at = (y) => lift(U.at(side, 0.5, y))
      // top: a 15 mm bar from the wall top through the top frieze, a crossbar at the frieze's
      // lower border, then a rounded stub ≈ 40 mm into the field; the TOP end hooks outward
      // as a small beak just under the rim (detail-frieze-top-centre.jpg, detail-handle-roots.jpg)
      const yFr = WALL_H - FRAME.topPlain - FRAME.top
      const yTopFlange = yFr - 40
      const Lf = WALL_H - yTopFlange
      const e = 3
      flanges.push(kit.flange({
        from: at(yTopFlange), to: at(WALL_H), out: w.normal, height: 20, thickness: 15, embed: e, bevel: 1.6, seed: seed + 10 + i, material: plain,
        outline: [
          [0, -e], [Lf, -e], [Lf, 27], [Lf - 5, 32], [Lf - 14, 32], [Lf - 20, 26], [Lf - 16, 23], [Lf - 22, 20],
          [Lf * 0.55 + 4, 20], [Lf * 0.55 + 3, 15], [Lf * 0.55 - 3, 15], [Lf * 0.55 - 4, 20],
          [12, 20], [6, 18.5], [2, 15], [0, 9],
        ],
      }))
      // crossbar ≈ 30 wide on the frieze's lower border
      const span = 15 / Math.hypot(w.corners[1].x - w.corners[0].x, w.corners[1].z - w.corners[0].z)
      const yc = yFr + FRAME.border / 2
      flanges.push(kit.flange({
        from: lift(U.at(side, 0.5 - span, yc)), to: lift(U.at(side, 0.5 + span, yc)), out: w.normal, height: 10, thickness: 8, embed: 3, bevel: 1.2,
        notches: { shape: 'none' }, ends: { start: 'taper', end: 'taper' }, seed: seed + 15 + i, material: plain,
      }))
      // bottom: within the bottom frieze, segmented into blocks at ≈ 23 mm pitch
      flanges.push(kit.flange({
        from: at(2), to: at(FRAME.bottom), out: w.normal, height: 18, thickness: 17, embed: 3, bevel: 1.8,
        notches: { shape: 'square', pitch: 25, depth: 0.75, width: 5 }, seed: seed + 20 + i, material: plain,
      }))
    }
    for (const f of flanges) object.add(f)

    // ---- legs: straight hollow cylinders, sleeve step, three bowstrings, V-b mask on the diagonal flange
    await onProgress(0.62, 'leg masks')
    const zone = [252, LEG_H - 2]
    const legOpts = {
      height: LEG_H, radius: LEG.r, taper: 0, entasis: 0, foot: { swell: 3.5 / LEG.r, height: 157, step: true },
      top: { flare: 0.05, height: 24 }, collar: { from: 246, amount: 2, shoulder: 4 },
      rings: { count: 3, at: 200, width: 10, spacing: 28, height: 3, soft: true }, hollow: { wall: 25, open: 'bottom' }, embed: 5,
    }
    const arc = 210
    const lp = kit.legPanelSize({ ...legOpts, zone, arc })
    const legMap = legPanel(kit, lp, { ppmm: 2.2 * q, seed: seed + 100 })
    const legMat = new kit.PatinaMaterial({ relief: legMap })
    await onProgress(0.75, 'legs')
    const legs = []
    for (const [i, [sx, sz]] of [[1, 1], [1, -1], [-1, -1], [-1, 1]].entries()) {
      const facing = (Math.atan2(sx * LEG.x, sz * LEG.z) * 180) / Math.PI
      const leg = kit.columnLeg({
        ...legOpts, material: plain, density: 0.45 * Math.sqrt(q),
        relief: { map: legMap, zone, arc, facing, material: legMat },
        flange: { from: zone[0] + 2, to: zone[1] - 4, height: 24, thickness: 16, embed: 4, bevel: 2.5, part: 'legs', notches: { shape: 'square', pitch: 42, depth: 0.4, width: 12 } },
        cast: { seed: seed + 30 + i, splay: 0.4, length: 0.002, twist: 1 },
      })
      leg.position.set(sx * LEG.x, 0, sz * LEG.z)
      object.add(leg)
      legs.push(leg)
    }

    // ---- handles: flat-topped, vertical, chunky; tigers + human head on the outer face,
    // fish on the edges, plain inner face, root blocks over the rim face
    await onProgress(0.82, 'handles')
    const hBase = {
      width: HANDLE.width, height: HANDLE.height, bar: HANDLE.bar, barTop: HANDLE.barTop, depth: HANDLE.depth,
      radius: HANDLE.radius, aperture: { radius: HANDLE.aperture }, lean: 0, embed: 20,
      root: { width: 92, height: RIM_H, rise: 18, outset: 13, inset: 0 },
    }
    const hl = kit.handleLayout(hBase)
    const hp = { ppmm: 2.2 * q, seed: seed + 200 }
    const faces = {
      outer: { relief: handleOuterPanel(kit, hl, { ...hp, bar: HANDLE.bar, barTop: HANDLE.barTop }) },
      edge: { relief: handleEdgePanel(kit, hl, { ppmm: 1.8 * q, seed: seed + 210 }) },
      root: { relief: handleRootPanel(kit, hl, { ...hp, seed: seed + 220, rimH: RIM_H }) },
    }
    const handles = []
    for (const sx of [-1, 1]) {
      const hnd = kit.uprightHandle({ ...hBase, faces, density: 0.5 * Math.sqrt(q), cast: { seed: seed + 40 + sx, lean: 0.6, height: 0.004 }, material: plain })
      hnd.rotation.y = (sx * Math.PI) / 2
      hnd.position.set(sx * HANDLE.x, U.rim.y + LEG_H, 0)
      object.add(hnd)
      handles.push(hnd)
    }
    await onProgress(1, 'done')
    return { object, parts: { body, legs, handles, flanges }, panels: { long, short, leg: legMap, handleOuter: faces.outer.relief, handleEdge: faces.edge.relief, handleRoot: faces.root.relief } }
  },
}
