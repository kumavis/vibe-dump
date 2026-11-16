// Nezu bo 蟠螭文鎛 (90120) — the openwork crown (钮): a plain bar loop flanked by interlaced dragons, ONE flat cast
// plate standing on the top in the plane of the long axis (X–Y), with real openings.
//
// Traced off photo-18 (head-on; the crown lies at the depth of the edges, so it is measured at the silhouette's
// scale, 3.02 px/mm, dossier §b) and checked against photo-19 (≈ 40° round: the plate's thickness, ≈ 13 mm, and
// the loop's, ≈ 16 mm). The crown's foot is hidden behind the front of the top in both photographs: it is taken to
// stand straight on the top. Per half, outward from the loop: an arched dragon whose body springs from the top
// beside the loop leg, rises and rolls its head into two curls (one at its outer shoulder, one on its crown) with a
// small curl at its foot inside the arch; then a chain of three fat curls climbing toward the loop's shoulder — a
// big spiral at the foot, a second above it, a small one at the top — all on one body that drops down beside the arch.
// Every band is a fat flat strap with rounded edges and one incised line running round inside its edge.
//
// Built as a signed-distance field (the drawn 2D outline → exact distance → a rounded extrusion, the incised line
// cut into both faces) meshed by the kit's surface nets: the openings are true holes, the edges round.

import * as THREE from 'three'

/** an Archimedean curl centre line: from radius r0 at angle a0 (deg), `turns` (+ anticlockwise) down to r1 */
function curl(c, r0, r1, a0, turns, n = 64) {
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const a = (a0 * Math.PI) / 180 + t * turns * Math.PI * 2
    const r = r0 + (r1 - r0) * t
    pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)])
  }
  return pts
}
const seg = (...pts) => pts

/**
 * The left half (X < 0), crown mm: X from the axis, Y above the top. Traced on faces/face-crown.jpg (photo-18
 * rectified onto the crown's own plane, 4 px/mm): fat flat masses with small openings —
 *   straps { pts, w } (centre lines), discs { c, r, hole: { c, r } } (the curls: a round mass with its eye pierced),
 *   grooves { pts } (the incised spirals on the curls and on the arch's two heads).
 */
export const CROWN = {
  // round-8 fix: re-read on faces/face-crown.jpg with a 10 mm grid (crown X from the axis, Y above the top):
  // loop outer −54 / 112, window −31 / 85, outer corners ≈ 13 mm, a plain bevelled bar (no incised border)
  loop: { outer: [53.5, 112], inner: [31, 85], r: [13, 5] },
  straps: [
    // the arched dragon: a round-topped arch ≈ 20 mm wide over an opening ≈ 29 mm across (X −50 … −21, top Y 33)
    { pts: [[-60, -4], ...curl([-35.5, 21], 24.5, 24.5, 180, -0.5, 32), [-11, -4]], w: 20 },
    // the top curl's body running down on its outer side into the middle curl (X −75 … −62)
    { pts: [[-68.5, 74], [-68.5, 46]], w: 13 },
    // the top curl tied to the loop's shoulder
    { pts: [[-62, 77], [-53, 79]], w: 11 },
    // the middle curl into the column and down onto the big curl
    { pts: [[-82, 50], [-69, 47]], w: 13 },
    { pts: [[-87, 44], [-91, 34]], w: 12 },
  ],
  discs: [
    { c: [-64.5, 76], r: 9.8 }, // the top curl (a rolled head, its eye not pierced)
    { c: [-84, 54], r: 14, hole: { c: [-82.5, 51.5], r: 3.2 } }, // the middle curl
    { c: [-96, 22.5], r: 19, hole: { c: [-94.5, 19.5], r: 4.6 } }, // the big curl at the foot
    { c: [-39, 17], r: 10 }, // the small curl at the arch's foot, mostly behind the rim
    { c: [-54, 49], r: 8 }, { c: [-33, 50], r: 8 }, // the two curled heads humping up out of the arch's top
  ],
  // the two curled heads on the arch's top (X −54, −34): raised rolled bosses, proud of the strap on both faces
  heads: [{ c: [-54, 49], r: 7.6 }, { c: [-33, 50], r: 7.6 }],
  // the rolled straps: a wide, deep spiral channel winding in from the curl's rim to its eye
  grooves: [
    { c: [-54, 49], r0: 6.2, r1: 1.2, a0: 90, turns: 1.6 }, // the arch's two heads
    { c: [-33, 50], r0: 6.2, r1: 1.2, a0: 90, turns: 1.6 },
    { c: [-64.5, 76], r0: 7.4, r1: 1.6, a0: 270, turns: -1.7 },
    { c: [-84, 54], r0: 10.6, r1: 4.6, a0: 0, turns: 1.4 },
    { c: [-96, 22.5], r0: 14.6, r1: 6.4, a0: 180, turns: -1.4 },
  ],
}

/**
 * @returns THREE.Mesh (part 'crown'): the crown standing on y = 0 (put it on the top), centred on the axis, its plate
 *   in the X–Y plane (front face +Z)
 */
export function buildCrown(kit, { quality = 1, material, thickness = 13, loopThickness = 16 } = {}) {
  const ppmm = 4
  const W = 250, Hc = 128, ox = 125, oy = 6
  const panel = new kit.ReliefPanel({ width: W, height: Hc, ppmm, maxSize: 2048 })
  const P = (x, y) => [x + ox, y + oy]
  const C = CROWN
  const line = (ctx, pts, sx) => { ctx.beginPath(); pts.forEach(([x, y], i) => { const [px, py] = P(sx * x, y); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py) }) }
  const drawHalf = (ctx, sx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const s of C.straps) {
      if (Array.isArray(s.w)) {
        // leg, back, leg of different widths: one stroke per segment, rounded corners filled by round joins
        for (let i = 0; i < s.pts.length - 1; i++) { ctx.lineWidth = s.w[Math.min(i, s.w.length - 1)]; line(ctx, [s.pts[i], s.pts[i + 1]], sx); ctx.stroke() }
      } else { ctx.lineWidth = s.w; line(ctx, s.pts, sx); ctx.stroke() }
    }
    ctx.beginPath()
    for (const d of C.discs) { const [px, py] = P(sx * d.c[0], d.c[1]); ctx.moveTo(px + d.r, py); ctx.arc(px, py, d.r, 0, Math.PI * 2) }
    ctx.fill()
  }
  const drawHoles = (ctx) => {
    // the curls' eyes are pierced (a mask of its own, subtracted in the distance field)
    ctx.beginPath()
    for (const sx of [1, -1]) for (const d of C.discs) if (d.hole) { const [px, py] = P(sx * d.hole.c[0], d.hole.c[1]); ctx.moveTo(px + d.hole.r, py); ctx.arc(px, py, d.hole.r, 0, Math.PI * 2) }
    ctx.fill()
  }
  const drawGrooves = (ctx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 1.7
    for (const sx of [1, -1]) for (const g of C.grooves) { line(ctx, curl([g.c[0], g.c[1]], g.r0, g.r1, g.a0, g.turns), sx); ctx.stroke() }
  }
  const loopPath = (ctx) => {
    // ONE outline: the legs stop at Y 42 inside the arches (photo-18: the arch openings show the background under
    // them), so the loop is an ∩ — outer corners r[0], window corners r[1]
    const L = C.loop
    const yb = 42
    const [ox0, oy0] = P(-L.outer[0], yb), [ox1, oy1] = P(L.outer[0], L.outer[1])
    const [ix0] = P(-L.inner[0], yb), [ix1, iy1] = P(L.inner[0], L.inner[1])
    const r0 = L.r[0], r1 = L.r[1]
    ctx.beginPath()
    ctx.moveTo(ox0, oy0)
    ctx.arcTo(ox0, oy1, ox1, oy1, r0)
    ctx.arcTo(ox1, oy1, ox1, oy0, r0)
    ctx.lineTo(ox1, oy0)
    ctx.lineTo(ix1, oy0)
    ctx.arcTo(ix1, iy1, ix0, iy1, r1)
    ctx.arcTo(ix0, iy1, ix0, oy0, r1)
    ctx.lineTo(ix0, oy0)
    ctx.closePath()
    ctx.fill()
  }
  // the dragons and the loop are two plates of different thickness: two masks
  const mD = panel.mask((ctx) => { drawHalf(ctx, 1); drawHalf(ctx, -1) })
  const mG = panel.mask((ctx) => drawGrooves(ctx))
  const sdG = kit.signedDistance(mG.data, mG.cols, mG.rows)
  const mH = panel.mask((ctx) => drawHoles(ctx))
  const sdH = kit.signedDistance(mH.data, mH.cols, mH.rows)
  const mL = panel.mask((ctx) => loopPath(ctx))
  const sdD = kit.signedDistance(mD.data, mD.cols, mD.rows)
  const sdL = kit.signedDistance(mL.data, mL.cols, mL.rows)
  const cols = mD.cols, rows = mD.rows, inv = 1 / mD.ppmm
  const look = (sd, x, y) => {
    // bilinear, mm (positive inside)
    const fx = (x + ox) * mD.ppmm - 0.5, fy = (y + oy) * mD.ppmm - 0.5
    const i = Math.max(0, Math.min(cols - 2, Math.floor(fx))), j = Math.max(0, Math.min(rows - 2, Math.floor(fy)))
    const tx = Math.min(1, Math.max(0, fx - i)), ty = Math.min(1, Math.max(0, fy - j))
    const k = j * cols + i
    return ((sd[k] * (1 - tx) + sd[k + 1] * tx) * (1 - ty) + (sd[k + cols] * (1 - tx) + sd[k + cols + 1] * tx) * ty) * inv
  }
  const box = (din, z, T, rr) => {
    // rounded extrusion of a 2D region (din = inside distance) to thickness T, edge radius rr
    const qx = -din + rr, qz = Math.abs(z) - T / 2 + rr
    return Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - rr
  }
  const groove = (din, z, T, inset, w, depth) => Math.max(Math.abs(din - inset) - w / 2, T / 2 - depth - Math.abs(z))
  // the arch's curled heads stand proud of the strap on both faces (a low dome, ≈ 2.4 mm a side)
  const headExtra = (x, y) => {
    let e = 0
    for (const sx of [1, -1]) for (const h of C.heads || []) {
      const d = Math.hypot(x - sx * h.c[0], y - h.c[1]) / h.r
      if (d < 1) e = Math.max(e, 2.4 * Math.sqrt(1 - d * d))
    }
    return e
  }
  const sdf = {
    bounds: { min: [-123, -4, -loopThickness / 2 - 2], max: [123, 121, loopThickness / 2 + 2] },
    sd(x, y, z) {
      const dD = Math.min(look(sdD, x, y), -look(sdH, x, y)), dL = look(sdL, x, y)
      const T = thickness + 2 * headExtra(x, y)
      let a = box(dD, z, T, 4.2)
      if (dD > 1) {
        a = Math.max(a, -groove(dD, z, T, 2.8, 1.0, 0.8))
        const g = look(sdG, x, y) // the rolled spirals: a wide channel, deepest on its centre line
        if (g > -1.2) a = Math.max(a, -Math.max(-g - 0.2, T / 2 - 2.1 - Math.abs(z) + Math.min(0, g) * 1.2))
      }
      // the loop: a plain bar with broad bevelled (rounded) edges
      const b = box(dL, z, loopThickness, 6)
      return Math.min(a, b)
    },
  }
  const geo = kit.meshSDF(sdf, { voxel: quality >= 1 ? 0.85 : 1.15 })
  const g = geo.isBufferGeometry ? geo : geo.geometry
  const mesh = new THREE.Mesh(g, material)
  mesh.userData.part = 'crown'
  return mesh
}
