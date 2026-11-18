// Nezu bo 蟠螭文鎛 (90120) — the 36 coiled-serpent bosses (枚) as true geometry.
//
// Each boss is a disc footprint lying ON the bell's wall (sampled through form.js, so it follows the oval's
// curvature), displaced along the wall normal by a small ReliefMap drawn with kit.coilBoss (dome, coiled body,
// hatching, head): silhouette and cast shadow from the mesh, all slope from the full-res normal map, ONE map shared by
// all 36.

import * as THREE from 'three'
import { halfLength, ARC_END, PANEL_W, faceTheta, pointAt, normalAt, LAYOUT } from './form.js'

// ONE boss design, placed 36 times (bo-fix, from photo-18 / 19 at full resolution): a ROUND stepped dome. The earlier
// reading of a tall drop was boss + its own cast shadow under the top light: the lit outline is a circle (Ø ≈ 37 mm on
// faces/face-bosses.jpg, 36–39 across the rows), the dark tongue under it changes length with the boss's distance from
// the light, and the bosses seen in profile on photo-18's silhouette are symmetric top and bottom (≈ 13 mm proud). The
// renderer casts the shadow. The creature: a serpent wound ≈ 2 stepped turns (the inner turn and the tail hatched by
// close oblique ribs), its eared tiger head upright on the crown, a little above and left of the centre (photo-18 / detail-boss: +0.1 … +0.27 r).
export const BOSS = { r: 18.5, height: 13 }

export function bossMaps(kit, { quality = 1, seed = 1 } = {}) {
  const ppmm = 12 * Math.sqrt(quality)
  const R = BOSS.r, W = 2 * R + 2
  const panel = new kit.ReliefPanel({ width: W, height: W, ppmm, seed })
  const c = [W / 2, W / 2]
  kit.coilBoss(panel, {
    c, r: R, height: BOSS.height, turns: 2.0, rot: 0, hand: 1, start: 250, gap: 0.16, ridge: 0.17,
    foot: 'plain',
    striate: { pitch: 1.0, depth: 0.32, slant: 1.1, from: 0.55 },
    head: { style: 'tiger', at: [-0.06, 0.12], w: 0.56, h: 0.5, height: 0.36 },
  })
  // the foot of a 13 mm dome reads as a deep recess to the default cavity measure (a pale ring of earth round every
  // boss); the photographs show clean metal there: a gentler large-scale cavity
  const map = panel.bake({ cavity: { kSmall: 0.6, kLarge: 5 } })
  map.userData = { c }
  return [map]
}

/**
 * One boss: panel coordinates (px from the face centre line, body y), face ±1, side ±1.
 * The footprint is laid in TRUE mm round its centre: Δpx = Δx_true · PANEL_W / (A(y) · ARC_END). It is a polar grid
 * out to the circle, sunk 1.2 mm into the wall so the zero-height rim never shows as a seam.
 */
export function bossMesh(kit, { face, side, px, y, map, material, quality = 1, mirror = false }) {
  const W = map.widthMM, Hp = map.heightMM
  const { c } = map.userData
  const mx = mirror ? -1 : 1
  const nA = Math.round(88 * Math.sqrt(quality)), nR = Math.round(27 * Math.sqrt(quality))
  // a circle a little outside the dome's foot, so the foot is caught
  const radiusAt = () => BOSS.r + 0.6
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
          // one design, the same way up everywhere (the bosses were cast from one model)
          const m = bossMesh(kit, { face, side, px, y: by, map: maps[0], material: materials[0], quality })
          group.add(m)
          n++
        })
      })
    }
  }
  group.userData.count = n
  return group
}
