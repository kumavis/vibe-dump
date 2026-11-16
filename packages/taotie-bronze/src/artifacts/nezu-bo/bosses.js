// Nezu bo 蟠螭文鎛 (90120) — the 36 coiled-serpent bosses (枚) as true geometry.
//
// Each boss is a disc footprint lying ON the bell's wall (sampled through form.js, so it follows the oval's
// curvature), displaced along the wall normal by a small ReliefMap drawn with kit.coilBoss (dome, coiled body,
// hatching, head): silhouette and cast shadow from the mesh, all slope from the full-res normal map, one map shared
// by every boss of a variant. Three variants (the head turned a little differently, the body wound either way) are
// dealt round the rows so neighbours differ, as the photographs show.

import * as THREE from 'three'
import { halfLength, ARC_END, PANEL_W, faceTheta, pointAt, normalAt, LAYOUT } from './form.js'

// one map per ROW: the apron of each row runs down to just past the top of the ledge (or border) under it
// (photo-18 / 19: every boss is a drop — the coiled dome with a smooth tongue hanging to the ledge, lapping it)
const ROW_BOTTOM = [160.6, 266, 369] // body y where each row's apron ends
const ROWS = [
  { hand: 1, start: 268, rot: 0 },
  { hand: 1, start: 272, rot: 0 },
  { hand: 1, start: 270, rot: 0 },
]

export function bossMaps(kit, { quality = 1, seed = 1 } = {}) {
  const B = LAYOUT.bosses
  const ppmm = 12 * Math.sqrt(quality)
  return ROWS.map((v, i) => {
    const depth = (B.y[i] - ROW_BOTTOM[i]) / B.r
    const W = 2 * B.r + 2, Hp = B.r * (1 + depth) + 2
    const panel = new kit.ReliefPanel({ width: W, height: Hp, ppmm, seed: seed + i })
    const c = [W / 2, 1 + B.r * depth]
    kit.coilBoss(panel, {
      c, r: B.r, height: B.height, turns: 2.0, rot: v.rot, hand: v.hand, start: v.start, gap: 0.12, ridge: 0.12,
      foot: 'plain', apron: { depth, end: 0.8, drop: 0.5 },
      striate: { pitch: 1.05, depth: 0.32, slant: 1.1, from: 0.05 },
      head: { style: 'tiger', at: [0, 0.0], w: 0.66, h: 0.58, height: 0.42 },
    })
    // the foot of a 13 mm dome reads as a deep recess to the default cavity measure (a pale ring of earth round every
    // boss); the photographs show clean metal there: a gentler large-scale cavity
    const map = panel.bake({ cavity: { kSmall: 0.6, kLarge: 5 } })
    map.userData = { c, depth }
    return map
  })
}

/** the boss outline (unit radius, centre origin, y up): the dome and its apron — inside test */
function insideDrop(x, y, depth, end) {
  if (x * x + y * y < 1) return true
  if (y > 0.2) return false
  const Dc = depth - end
  for (let k = 0; k <= 16; k++) {
    const t = k / 16, rr = 1 + (end - 1) * t
    if (Math.hypot(x, y + t * Dc) < rr) return true
  }
  return false
}

/**
 * One boss: panel coordinates (px from the face centre line, body y), face ±1, side ±1.
 * The footprint is laid in TRUE mm round its centre: Δpx = Δx_true · PANEL_W / (A(y) · ARC_END). It is a polar grid
 * out to the drop's outline, sunk 1.2 mm into the wall so the zero-height rim never shows as a seam.
 */
export function bossMesh(kit, { face, side, px, y, map, material, quality = 1, mirror = false }) {
  const B = LAYOUT.bosses
  const W = map.widthMM, Hp = map.heightMM
  const { c, depth } = map.userData
  const mx = mirror ? -1 : 1
  const nA = Math.round(80 * Math.sqrt(quality)), nR = Math.round(28 * Math.sqrt(quality))
  // outline radius per angle (unit r), a little outside the drop so the foot is caught
  const rMax = new Float64Array(nA + 1)
  for (let i = 0; i <= nA; i++) {
    const a = (i / nA) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a)
    let lo = 0.5, hi = depth + 0.2
    for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (insideDrop(m * ca, m * sa, depth, 0.8)) lo = m; else hi = m }
    rMax[i] = lo + 0.6 / B.r
  }
  const radiusAt = (u) => { const f = u * nA, i = Math.min(nA - 1, Math.floor(f)), t = f - i; return (rMax[i] * (1 - t) + rMax[i + 1] * t) * B.r }
  const sinkMM = 1.2
  const posAt = (dx, dy) => {
    const yy = y + dy
    const k = PANEL_W / (halfLength(yy) * ARC_END)
    const f = (px + side * dx * k) / PANEL_W
    const th = faceTheta(face, side, f)
    return { p: pointAt(th, yy), n: normalAt(th, yy) }
  }
  const polar = (u, v) => { const a = u * Math.PI * 2, r = radiusAt(u) * (1 - v); return [r * Math.cos(a), r * Math.sin(a)] }
  const surface = (u, v, out) => {
    const [dx, dy] = polar(u, v)
    const { p, n } = posAt(dx, dy)
    out.pos.set(p[0] - n[0] * sinkMM, p[1] - n[1] * sinkMM, p[2] - n[2] * sinkMM)
    out.nrm.set(n[0], n[1], n[2])
  }
  const panelMap = (u, v, o) => {
    const [dx, dy] = polar(u, v)
    o[0] = (c[0] + mx * dx) / W
    o[1] = (c[1] + dy) / Hp
    o[2] = 1
  }
  const geo = kit.buildSurface({ surface, segments: [nA, nR], relief: map, panelMap, fade: 0, maxVerts: 1e6 })
  // the grid runs round and in, the panel runs east and up: re-aim the tangent frame at the panel axes
  // (else the normal map's slopes turn with the polar grid and a dome shades as a bowl); a mirrored map: east flips
  const e0 = posAt(-0.5 * mx, 0).p, e1 = posAt(0.5 * mx, 0).p, n0 = posAt(0, -0.5).p, n1 = posAt(0, 0.5).p
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
      B.y.forEach((by, ri) => {
        B.x.forEach((px, ci) => {
          // each row has its own map (apron length); neighbours alternate the coil's hand by mirroring it
          const mirror = (ci + (side > 0 ? 0 : 1)) % 2 === 1
          const m = bossMesh(kit, { face, side, px, y: by, map: maps[ri], material: materials[ri], quality, mirror })
          group.add(m)
          n++
        })
      })
    }
  }
  group.userData.count = n
  return group
}
