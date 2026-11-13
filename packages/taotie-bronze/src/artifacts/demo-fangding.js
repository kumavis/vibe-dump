// Placeholder artifact: a small generic fangding that exercises every seam of
// the pipeline (relief panels → displaced walls → PatinaMaterial, flanges,
// legs, handles). It is NOT a reconstruction of any real vessel; real
// artifacts live beside it, one file each, and follow the same contract.

import * as THREE from 'three'

const H_WALL = 190
const W = 300
const D = 230
const LEG_H = 150
const FLARE = 0.04

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
  dimensions: { h: LEG_H + H_WALL + 78, w: W * (1 + FLARE) + 30, d: D * (1 + FLARE) + 30 },
  blurb:
    'A generic square cauldron built to prove the kit end to end: a taotie register on each wall above a U of cast bosses, notched flanges hiding the mould seams at the corners and on each mask’s centre line, four columnar legs and two upright handles.',
  defaultPatina: 'excavated-green',
  views: {
    front: { azimuth: 0, elevation: 6, fov: 30, fit: 1.1 },
    'three-quarter': { azimuth: 38, elevation: 16, fov: 30, fit: 1.1 },
    side: { azimuth: 90, elevation: 6, fov: 30, fit: 1.1 },
    top: { azimuth: 20, elevation: 55, fov: 30, fit: 1.1 },
    detail: { azimuth: 0, elevation: 3, fov: 18, fit: 0.42, target: [0, LEG_H + 147, 0] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const ppmm = 5 * quality
    const density = 1.0 * Math.sqrt(quality)
    const seed = 1203

    await onProgress(0.05, 'long wall relief')
    const long = wallRelief(kit, W * (1 + FLARE / 2), ppmm, seed)
    await onProgress(0.35, 'short wall relief')
    const short = wallRelief(kit, D * (1 + FLARE / 2), ppmm, seed + 1)
    await onProgress(0.6, 'casting walls')

    const plain = new kit.PatinaMaterial()
    const mLong = new kit.PatinaMaterial({ relief: long })
    const mShort = new kit.PatinaMaterial({ relief: short })

    const object = new THREE.Group()
    object.name = 'demo-fangding'
    const body = kit.fangBody({
      width: W,
      depth: D,
      height: H_WALL,
      flare: FLARE,
      wall: 9,
      material: plain,
      density,
      panels: {
        front: { relief: long, material: mLong },
        back: { relief: long, material: mLong },
        left: { relief: short, material: mShort },
        right: { relief: short, material: mShort },
      },
    })
    body.position.y = LEG_H
    object.add(body)
    await onProgress(0.8, 'flanges, legs, handles')

    // flanges: on the four corner seams, and on each register's centre line
    const flanges = []
    const walls = body.userData.walls
    for (const name of ['front', 'right', 'back', 'left']) {
      const [bl, , tl] = walls[name].corners
      const out = new THREE.Vector3(bl.x, 0, bl.z).normalize()
      flanges.push(kit.flange({ from: bl.clone(), to: tl.clone(), out, height: 13, thickness: 6, hook: 9, material: plain, notches: { every: 24, depth: 0.42, width: 3.2 } }))
      const [b0, b1, t0, t1] = walls[name].corners
      const at = (v) => new THREE.Vector3().lerpVectors(b0.clone().lerp(b1, 0.5), t0.clone().lerp(t1, 0.5), v)
      flanges.push(kit.flange({ from: at(118 / H_WALL), to: at(178 / H_WALL), out: walls[name].normal, height: 9, thickness: 5, hook: 5, material: plain, notches: { every: 16, depth: 0.4, width: 2.6 } }))
    }
    for (const f of flanges) body.add(f)

    const legs = []
    for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const leg = kit.columnarLeg({ height: LEG_H + 12, radius: 17, material: plain, density: 0.6 * Math.sqrt(quality) })
      leg.position.set(sx * (W / 2 - 34), 0, sz * (D / 2 - 30))
      object.add(leg)
      legs.push(leg)
    }

    const handles = []
    for (const sx of [-1, 1]) {
      const hnd = kit.loopHandle({ width: 82, height: 80, bar: 14, thickness: 10, material: plain })
      hnd.rotation.y = Math.PI / 2
      hnd.position.set(sx * (W / 2) * (1 + FLARE) - sx * 6, LEG_H + H_WALL - 2, 0)
      object.add(hnd)
      handles.push(hnd)
    }
    await onProgress(1, 'done')
    return { object, parts: { body, legs, handles, flanges }, panels: { long, short } }
  },
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
