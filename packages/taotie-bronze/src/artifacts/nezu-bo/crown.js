// Nezu bo 蟠螭文鎛 (90120) — the openwork crown (钮): a plain bar loop over a pair of confronted openwork dragons,
// ONE flat cast plate standing on the top in the plane of the long axis (X–Y), with real openings.
//
// bo-fix: re-read on photo-18 rectified onto the crown plane (faces/face-crown.jpg, 10 mm grid, 2×) and on photo-19
// (≈ 30° round, 2× crops): the connection points are CURLS and S-SHAPES, not arches. Per half, outward from the axis:
//   A  a crook: its foot lands on the top beside the axis (X −4 … −20), the body rises, arches outward over a small
//      opening (≈ 29 × 18 mm) and rolls DOWN into a curl (eye X −33, Y 47) under the inner side of the loop leg;
//   B  its confronted twin: the foot lands at X −50 … −70, the body rises and rolls inward into a curl (eye X −56,
//      Y 46) under the outer side of the leg — the two curls flank the leg's foot, which stands on them;
//   C  an S: a small curl at the top (eye X −64, Y 75.5) hung on the loop's shoulder, the stem dropping (X −69) onto
//      B's curl and rolling OUTWARD into a fat curl with a pierced eye (X −82, Y 51);
//   D  the big foot curl (Ø 42, pierced eye Ø 10) standing on the top at the outer end, tied to B's foot and C's curl;
//   E  a small curl lying on the top inside the opening under A (only its upper half shows above the rim).
// Seen: every outline and opening of the front, the plate thickness (≈ 13 mm, photo-19; one plane — no second layer of
// openwork), the loop's thickness (≈ 16 mm). The bands are flat-faced straps with rounded edges, an incised line
// running inside every edge, and each curl's face cut by a spiral line from its rim to the eye. Inferred: the feet
// (hidden behind the top's front edge below Y ≈ 16 in both photographs: taken to land straight on the top), the back
// face (the mirror of the front).
//
// Built as a signed-distance field (the drawn 2D outline → exact distance → a rounded extrusion, the incised lines
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
 * The left half (X < 0), crown mm: X from the axis, Y above the top (the right half is its mirror):
 *   straps { pts, w | [w per segment] } (centre lines) · curls { c, r, hole?, turns, a0 } (a rolled band: a round mass
 *   with a spiral line cut on its face from the rim to the eye; `hole` = the eye pierced through)
 */
export const CROWN = {
  loop: { outer: [53, 110], inner: [30, 85], r: [13, 5], foot: 44 },
  straps: [
    // A: foot beside the axis, up, over outward into its curl
    { pts: [[-12, -4], [-12, 22], [-12.6, 30], [-14.5, 38], [-18, 45], [-23.5, 51], [-30, 54.5]], w: [17, 17, 16.5, 16, 15, 14] },
    // B: foot outside the opening (wide where it meets D), up into its curl
    { pts: [[-60, -4], [-60, 24], [-59.5, 38], [-57, 46]], w: [20, 18.5, 16] },
    // C: the S's stem, from under the top curl down onto the lower curl
    { pts: [[-68.5, 76], [-68.5, 62], [-70, 55], [-73, 52]], w: [11, 11, 11] },
    // ties: D to B's foot, D to C's lower curl
    { pts: [[-80, 28], [-64, 30]], w: 10 },
    { pts: [[-86, 37], [-84, 45]], w: 9 },
  ],
  curls: [
    { c: [-33, 46.5], r: 9.5, turns: -1.3, a0: 90 }, // A's curl (rolls down and in, under the leg's inner side)
    { c: [-56, 45.5], r: 9.5, turns: 1.3, a0: 90 }, // B's curl (the mirror sense)
    { c: [-64, 75.5], r: 9.5, turns: -1.4, a0: 180 }, // C's top curl, on the loop's shoulder
    { c: [-84, 53.5], r: 13.5, hole: { c: [-82, 51], r: 3.8 }, turns: 1.3, a0: 0 }, // C's lower curl, rolled outward
    { c: [-95, 19], r: 21, hole: { c: [-93, 17.5], r: 5 }, turns: -1.3, a0: 90 }, // D, the big foot curl
    { c: [-39.5, 11.5], r: 11, turns: 1.2, a0: 90 }, // E, the small curl on the floor of the opening
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
    for (const d of C.curls) { const [px, py] = P(sx * d.c[0], d.c[1]); ctx.moveTo(px + d.r, py); ctx.arc(px, py, d.r, 0, Math.PI * 2) }
    ctx.fill()
  }
  const drawHoles = (ctx) => {
    // the curls' eyes are pierced (a mask of its own, subtracted in the distance field)
    ctx.beginPath()
    for (const sx of [1, -1]) for (const d of C.curls) if (d.hole) { const [px, py] = P(sx * d.hole.c[0], d.hole.c[1]); ctx.moveTo(px + d.hole.r, py); ctx.arc(px, py, d.hole.r, 0, Math.PI * 2) }
    ctx.fill()
  }
  const drawGrooves = (ctx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 1.7
    // each curl's spiral line: from just inside the rim to its eye (the pierced eye's edge, or a small eye)
    for (const sx of [1, -1]) for (const g of C.curls) {
      const r1 = g.hole ? g.hole.r + 1.4 : 1.4
      line(ctx, curl([g.c[0], g.c[1]], g.r - 2.8, r1, g.a0, g.turns), sx); ctx.stroke()
    }
  }
  const loopPath = (ctx) => {
    // ONE outline: the legs stand on the two crooks' curls at Y `foot` (photo-18 / 19: the curls flank each leg's
    // foot and the openings under them show the background), so the loop is an ∩ — outer corners r[0], window r[1]
    const L = C.loop
    const yb = L.foot
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
  // optional proud heads on the plate (none since bo-fix: every curl is flat-faced, photo-19)
  const headExtra = (x, y) => {
    let e = 0
    for (const sx of [1, -1]) for (const h of C.heads || []) {
      const d = Math.hypot(x - sx * h.c[0], y - h.c[1]) / h.r
      if (d < 1) e = Math.max(e, 2.4 * Math.sqrt(1 - d * d))
    }
    return e
  }
  const sdf = {
    bounds: { min: [-124, -6, -loopThickness / 2 - 2], max: [124, 116, loopThickness / 2 + 2] },
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
      // the feet are cut off 3 mm into the top (inside the bounds, so the mesh closes)
      return Math.max(Math.min(a, b), -3 - y)
    },
  }
  const geo = kit.meshSDF(sdf, { voxel: quality >= 1 ? 0.85 : 1.15 })
  const g = geo.isBufferGeometry ? geo : geo.geometry
  const mesh = new THREE.Mesh(g, material)
  mesh.userData.part = 'crown'
  return mesh
}
