// Nezu bo 蟠螭文鎛 (90120) — the 36 coiled-serpent bosses (枚) as true geometry.
//
// Each boss is a disc footprint lying ON the bell's wall (sampled through form.js, so it follows the oval's
// curvature), displaced along the wall normal by a small ReliefMap drawn with kit.coilBoss (dome, coiled body,
// hatching, head): silhouette and cast shadow from the mesh, all slope from the full-res normal map, one map shared
// by every boss of a variant. Three variants (the head turned a little differently, the body wound either way) are
// dealt round the rows so neighbours differ, as the photographs show.

import * as THREE from 'three'
import { halfLength, ARC_END, PANEL_W, faceTheta, pointAt, normalAt, LAYOUT } from './form.js'

const VARIANTS = [
  { rot: 0, hand: 1, start: 200 },
  { rot: -28, hand: 1, start: 160 },
  { rot: 22, hand: -1, start: 230 },
]

export function bossMaps(kit, { quality = 1, seed = 1 } = {}) {
  const B = LAYOUT.bosses
  const ppmm = 12 * Math.sqrt(quality)
  const size = 2 * B.r + 2
  return VARIANTS.map((v, i) => {
    const panel = new kit.ReliefPanel({ width: size, height: size, ppmm, seed: seed + i })
    kit.coilBoss(panel, { c: [size / 2, size / 2], r: B.r, height: B.height, turns: 2.1, rot: v.rot, hand: v.hand, start: v.start })
    return panel.bake()
  })
}

/**
 * One boss: panel coordinates (px from the face centre line, body y), face ±1, side ±1.
 * The footprint is laid in TRUE mm round its centre: Δpx = Δx_true · PANEL_W / (A(y) · ARC_END).
 */
export function bossMesh(kit, { face, side, px, y, map, material, quality = 1 }) {
  const B = LAYOUT.bosses
  const Rb = B.r + 0.6
  const size = map.widthMM
  const nA = Math.round(72 * Math.sqrt(quality)), nR = Math.round(26 * Math.sqrt(quality))
  const posAt = (dx, dy) => {
    const yy = y + dy
    const k = PANEL_W / (halfLength(yy) * ARC_END)
    const f = (px + side * dx * k) / PANEL_W
    const th = faceTheta(face, side, f)
    return { p: pointAt(th, yy), n: normalAt(th, yy) }
  }
  const surface = (u, v, out) => {
    // u: angle, v: 0 at the rim → 1 at the centre
    const a = u * Math.PI * 2, r = Rb * (1 - v)
    const { p, n } = posAt(r * Math.cos(a), r * Math.sin(a))
    out.pos.set(p[0], p[1], p[2])
    out.nrm.set(n[0], n[1], n[2])
  }
  const panelMap = (u, v, o) => {
    const a = u * Math.PI * 2, r = Rb * (1 - v)
    o[0] = 0.5 + (r * Math.cos(a)) / size
    o[1] = 0.5 + (r * Math.sin(a)) / size
    o[2] = 1
  }
  const geo = kit.buildSurface({ surface, segments: [nA, nR], relief: map, panelMap, fade: 0, maxVerts: 1e6 })
  // the grid runs round and in, the panel runs east and up: re-aim the tangent frame at the panel axes
  // (else the normal map's slopes turn with the polar grid and a dome shades as a bowl)
  const e0 = posAt(-0.5, 0).p, e1 = posAt(0.5, 0).p, n0 = posAt(0, -0.5).p, n1 = posAt(0, 0.5).p
  const E = [e1[0] - e0[0], e1[1] - e0[1], e1[2] - e0[2]], N = [n1[0] - n0[0], n1[1] - n0[1], n1[2] - n0[2]]
  const nrm = geo.attributes.normal.array, tan = geo.attributes.tangent.array
  for (let i = 0, k = 0; k < tan.length; i += 3, k += 4) {
    const nx = nrm[i], ny = nrm[i + 1], nz = nrm[i + 2]
    const d = E[0] * nx + E[1] * ny + E[2] * nz
    let tx = E[0] - nx * d, ty = E[1] - ny * d, tz = E[2] - nz * d
    const l = Math.hypot(tx, ty, tz) || 1
    tx /= l; ty /= l; tz /= l
    const bx = ny * tz - nz * ty, by = nz * tx - nx * tz, bz = nx * ty - ny * tx
    tan[k] = tx; tan[k + 1] = ty; tan[k + 2] = tz; tan[k + 3] = bx * N[0] + by * N[1] + bz * N[2] < 0 ? -1 : 1
  }
  geo.attributes.tangent.needsUpdate = true
  const mesh = new THREE.Mesh(geo, material)
  return mesh
}

/** all bosses: three rows × three columns per half-face × four half-faces */
export function buildBosses(kit, { maps, materials, quality = 1 }) {
  const group = new THREE.Group()
  group.userData.part = 'bosses'
  const B = LAYOUT.bosses
  let n = 0
  for (const face of [1, -1]) {
    for (const side of [1, -1]) {
      LAYOUT.rows.forEach(([y0, y1], ri) => {
        B.x.forEach((px, ci) => {
          const vi = (ri * 3 + ci + (side > 0 ? 0 : 1) + (face > 0 ? 0 : 2)) % maps.length
          const m = bossMesh(kit, { face, side, px, y: (y0 + y1) / 2, map: maps[vi], material: materials[vi], quality })
          group.add(m)
          n++
        })
      })
    }
  }
  group.userData.count = n
  return group
}
