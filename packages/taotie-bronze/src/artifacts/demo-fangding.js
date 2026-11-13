// Placeholder artifact: a small generic fangding that exercises every seam of
// the pipeline (relief panels → displaced walls → PatinaMaterial, flanges,
// legs, handles). It is NOT a reconstruction of any real vessel; real
// artifacts live beside it, one file each, and follow the same contract.

import * as THREE from 'three'

const H_WALL = 190
const W = 300 // floor-level outer dims
const D = 230
const LEG_H = 150
const TAPER = 2.2 // deg: walls lean out going up
const RIM_H = 12
const HANDLE_H = 66 // above the rim top
const FLARE = Math.tan((TAPER * Math.PI) / 180) * H_WALL * 2 / W

export default {
  id: 'demo-fangding',
  order: 99, // sort after real artifacts
  title: 'Demonstration Fangding',
  titleZh: '示范方鼎',
  type: 'fangding',
  date: 'c. 1200 BC (style)',
  period: 'Late Shang, Yinxu II (style)',
  findspot: 'Procedural — not an excavated object',
  collection: 'Taotie Kit test piece',
  accession: 'KIT-0001',
  dimensions: { h: LEG_H + H_WALL + RIM_H + HANDLE_H, w: W * (1 + FLARE) + 30, d: D * (1 + FLARE) + 30 },
  blurb:
    'A generic square cauldron built to prove the kit end to end: a taotie register on each wall above a U of cast bosses, notched flanges hiding the mould seams at the corners and on each mask’s centre line, a thickened everted rim, four columnar legs with masks and bowstrings, and two upright handles leaning out from the rim.',
  defaultPatina: 'excavated-green',
  views: {
    front: { azimuth: 0, elevation: 6, fov: 30, fit: 1.1 },
    'three-quarter': { azimuth: 38, elevation: 16, fov: 30, fit: 1.1 },
    side: { azimuth: 90, elevation: 6, fov: 30, fit: 1.1 },
    top: { azimuth: 20, elevation: 55, fov: 30, fit: 1.1 },
    detail: { azimuth: 0, elevation: 3, fov: 18, fit: 0.42, target: [0, LEG_H + 147, 0] },
    leg: { azimuth: 45, elevation: 4, fov: 18, fit: 0.3, target: [110, 110, 85] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const ppmm = 5 * quality
    const density = 1.0 * Math.sqrt(quality)
    const seed = 1203
    const plain = new kit.PatinaMaterial()

    // the body: walls lean out ~2° (floor narrower than the mouth), a thickened
    // everted rim, sharp arrises under corner flanges, one décor cell per wall
    // mapped 1:1 in mm ('true': the panel is the trapezoid's bounding rect)
    const bodyOpts = {
      width: W, depth: D, height: H_WALL, taper: TAPER, wall: 7, floor: { thickness: 8 },
      rim: { kind: 'slab', height: RIM_H, overhang: 6, inner: 2, round: 1.6 },
      cast: { seed, sag: 0.003, rim: 1.4 },
      material: plain, density,
    }
    const layout = kit.fangLayout(bodyOpts)
    const cl = layout.sides.front.cells[0][0]
    const cs = layout.sides.right.cells[0][0]
    await onProgress(0.05, 'long wall relief')
    const long = wallRelief(kit, cl.wMax, ppmm, seed)
    await onProgress(0.35, 'short wall relief')
    const short = wallRelief(kit, cs.wMax, ppmm, seed + 1)
    await onProgress(0.55, 'leg masks')
    const legOpts = {
      height: LEG_H, radius: 16, taper: 0.06, entasis: 0.03, foot: { swell: 0.05, height: 0.1 }, top: { flare: 0.2, height: 9 },
      rings: { count: 2, at: 0.5, width: 2.4, spacing: 4.8, height: 1 }, embed: 10,
    }
    const zone = [LEG_H * 0.64, LEG_H - 2]
    const lp = kit.legPanelSize({ ...legOpts, zone, arc: 170 })
    const legMap = legRelief(kit, lp, ppmm, seed + 2)
    await onProgress(0.65, 'casting walls')

    const object = new THREE.Group()
    object.name = 'demo-fangding'
    const body = kit.fangBody({ ...bodyOpts, cells: { long: [[{ relief: long, map: 'true' }]], short: [[{ relief: short, map: 'true' }]] } })
    body.position.y = LEG_H
    object.add(body)
    await onProgress(0.8, 'flanges, legs, handles')

    // flanges: on the four corner seams, and on each register's centre line
    const flanges = []
    for (const c of Object.values(body.userData.corners)) {
      flanges.push(kit.flange({ from: c.bottom.clone(), to: c.top.clone(), out: c.out, height: 13, thickness: 6, hook: 9, material: plain, notches: { every: 24, depth: 0.42, width: 3.2 } }))
    }
    for (const name of ['front', 'right', 'back', 'left']) {
      const w = body.userData.walls[name]
      flanges.push(kit.flange({ from: body.userData.at(name, 0.5, 118), to: body.userData.at(name, 0.5, 178), out: w.normal, height: 9, thickness: 5, hook: 5, material: plain, notches: { every: 16, depth: 0.4, width: 2.6 } }))
    }
    for (const f of flanges) body.add(f)

    // legs under the corners, a taotie mask facing out along the diagonal, two bowstrings below it
    const legs = []
    for (const [i, corner] of ['front-right', 'right-back', 'back-left', 'left-front'].entries()) {
      const seat = body.userData.legSeat(corner, 32)
      const facing = (Math.atan2(seat.x, seat.z) * 180) / Math.PI
      const leg = kit.columnLeg({
        ...legOpts, material: plain, density: 1.2 * Math.sqrt(quality),
        relief: { map: legMap, zone, arc: 170, facing },
        splay: { angle: 1, toward: [seat.x, seat.z] }, cast: { seed: seed + i },
      })
      leg.position.set(seat.x, 0, seat.z)
      object.add(leg)
      legs.push(leg)
    }

    // upright loop handles on the short sides, standing on the rim, leaning out
    const handles = []
    for (const sx of [-1, 1]) {
      const hnd = kit.uprightHandle({
        width: 84, height: HANDLE_H, bar: 15, depth: 11, radius: 14, aperture: { radius: 20 }, lean: 4, embed: 10,
        channel: { width: 4, depth: 1.2 }, cast: { seed: seed + 10 + sx }, material: plain,
      })
      const p = body.userData.rimTop(sx > 0 ? 'right' : 'left', 0.5, 0.45)
      hnd.rotation.y = (sx * Math.PI) / 2
      hnd.position.set(p.x, p.y + LEG_H, p.z)
      object.add(hnd)
      handles.push(hnd)
    }
    await onProgress(1, 'done')
    return { object, parts: { body, legs, handles, flanges }, panels: { long, short, leg: legMap } }
  },
}

/** Leg mask: a compact taotie (Houmuwu-leg layout) on the upper leg. */
function legRelief(kit, size, ppmm, seed) {
  const p = new kit.ReliefPanel({ width: size.w, height: size.h, ppmm, seed })
  kit.drawMotif(p, 'taotie', { x: 3, y: 2, w: size.w - 6, h: size.h - 4 }, { relief: { motif: 1.2, boss: 2.6, groove: 0.35 } }, { preset: 'houmuwu-leg', ground: { pitch: 1.2, cell: [4, 8] } })
  return p.bake()
}

/**
 * One wall: a taotie register under the rim (its nose left as a slot for the
 * centre flange), framed by thread borders, over a U of bosses around a plain
 * field — the standard late-Shang fangding wall scheme.
 */
function wallRelief(kit, width, ppmm, seed) {
  const height = H_WALL
  const p = new kit.ReliefPanel({ width, height, ppmm, seed })
  const reg = { x: 26, y: 120, w: width - 52, h: 56 }
  kit.drawMotif(p, 'taotie', reg, { nose: 'flange', body: 'band', relief: { motif: 1.3, boss: 3, groove: 0.4 } }, { ground: { pitch: 1.5, cell: [5, 11] } })
  kit.borderLine(p, { x: 20, y: 114, w: width - 40, h: 68 }, { width: 1.4, height: 0.7, sides: 'tblr' })

  // U of bosses framing the plain centre
  const r = 4.6
  const bh = 3.6
  kit.bossRow(p, [14, 16], [14, 104], { count: 6, radius: r, height: bh })
  kit.bossRow(p, [width - 14, 16], [width - 14, 104], { count: 6, radius: r, height: bh })
  kit.bossRow(p, [28, 14], [width - 28, 14], { count: Math.round((width - 56) / 17), radius: r, height: bh })
  // leiwen in the boss bands only — the centre field stays plain, as cast
  p.fillGround({ pitch: 1.5, cell: [4, 9] }, { rect: { x: 6, y: 6, w: 17, h: 104 } })
  p.fillGround({ pitch: 1.5, cell: [4, 9] }, { rect: { x: width - 23, y: 6, w: 17, h: 104 } })
  p.fillGround({ pitch: 1.5, cell: [4, 9] }, { rect: { x: 23, y: 6, w: width - 46, h: 17 } })
  return p.bake()
}
