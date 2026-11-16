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

/** the left half (X < 0), crown mm: X from the axis, Y above the top; each { pts, w } is a strap centre line */
export const CROWN = {
  loop: { outer: [52, 117], inner: [31.5, 89], r: [13, 5] }, // outer half-width / top, inner half-width / top, corner radii
  straps: [
    // the arched dragon: from its foot beside the loop leg, up, over, and down to the axis side
    { pts: seg([-66, -3], [-66, 34], [-62, 45], [-50, 49.5], [-24, 49.5], [-13, 44], [-10.5, 33], [-10.5, -3]), w: 10.5 },
    // its head rolled into a curl at the outer shoulder
    { pts: curl([-56, 47], 7.2, 1.6, 200, -0.95), w: 6.2 },
    // and a curl on its crown
    { pts: curl([-31, 50], 7, 1.6, 180, -0.95), w: 6.2 },
    // the small curl at its foot inside the arch
    { pts: curl([-39, 4.5], 9, 2.6, 0, 0.7), w: 7.4 },
    // the outer body: up beside the arch to the shoulder curl under the loop's corner
    { pts: seg([-74, -3], [-74, 16], [-62, 28], [-58, 40], [-58, 70]), w: 9.6 },
    { pts: curl([-64.5, 79], 9, 2, 0, 0.92), w: 8 },
    // the big middle spiral, hung off the body at its waist
    { pts: seg([-60, 34], [-72, 30]), w: 9 },
    { pts: curl([-86, 45], 15.5, 3.4, -60, 0.95), w: 9.8 },
    // the big spiral at the foot
    { pts: seg([-74, 6], [-86, 4]), w: 9.4 },
    { pts: curl([-96, 22], 17, 3.8, -90, -0.95), w: 10 },
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
  const drawHalf = (ctx, sx, which) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    if (which !== 'loop') {
      for (const s of C.straps) {
        ctx.lineWidth = s.w
        ctx.beginPath()
        s.pts.forEach(([x, y], i) => { const [px, py] = P(sx * x, y); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py) })
        ctx.stroke()
      }
    }
  }
  const loopPath = (ctx) => {
    const L = C.loop
    const rr = (x0, y0, x1, y1, r) => {
      ctx.moveTo(x0 + r, y0); ctx.lineTo(x1 - r, y0); ctx.arcTo(x1, y0, x1, y0 + r, r); ctx.lineTo(x1, y1 - r); ctx.arcTo(x1, y1, x1 - r, y1, r)
      ctx.lineTo(x0 + r, y1); ctx.arcTo(x0, y1, x0, y1 - r, r); ctx.lineTo(x0, y0 + r); ctx.arcTo(x0, y0, x0 + r, y0, r); ctx.closePath()
    }
    const [a, b] = [P(-L.outer[0], -4), P(L.outer[0], L.outer[1])]
    ctx.beginPath()
    rr(a[0], a[1], b[0], b[1], L.r[0])
    const [c, d] = [P(-L.inner[0], -20), P(L.inner[0], L.inner[1])]
    // the window (a hole: even-odd), open at the bottom where the dragons' arches pass in front
    rr(c[0], c[1], d[0], d[1], L.r[1])
    ctx.fill('evenodd')
  }
  // the dragons and the loop are two plates of different thickness: two masks
  const mD = panel.mask((ctx) => { drawHalf(ctx, 1); drawHalf(ctx, -1) })
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
  const sdf = {
    bounds: { min: [-123, -4, -loopThickness / 2 - 2], max: [123, 121, loopThickness / 2 + 2] },
    sd(x, y, z) {
      const dD = look(sdD, x, y), dL = look(sdL, x, y)
      let a = box(dD, z, thickness, 3.2)
      if (dD > 1) a = Math.max(a, -groove(dD, z, thickness, 2.6, 0.9, 0.8))
      let b = box(dL, z, loopThickness, 3.6)
      if (dL > 1) b = Math.max(b, -groove(dL, z, loopThickness, 3, 0.9, 0.7))
      return Math.min(a, b)
    },
  }
  const geo = kit.meshSDF(sdf, { voxel: quality >= 1 ? 0.75 : 1.05 })
  const g = geo.isBufferGeometry ? geo : geo.geometry
  const mesh = new THREE.Mesh(g, material)
  mesh.userData.part = 'crown'
  return mesh
}
