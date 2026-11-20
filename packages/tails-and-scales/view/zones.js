// (Breakthrough, DESIGN §4.2.12's "The page") Each seat's deployment zone as
// the table and the minimap draw it: a polygon on the table, [{ x, z }], in
// the seat's colour. On a mission with roles each seat's zone is its role's
// (core/deploy.js zone): the attacker's rectangle, and for a zone behind the
// line everything on the defender's side of the wall's outer face (the
// plan's region, core/terrain/breakthrough.js, a plain record the view
// already reads) inside the role's x bounds, point-mirrored when seat 1
// attacks. A mission without roles gives null, and the table and minimap
// draw the strips `deploy` deep at each seat's edge, as they always have.
//
// It reads the rules' record through the doors the page already uses
// (core/index.js rolesOf and roleOf, core/match.js flipped) and the plan's
// points as the match made them; it decides nothing. core/deploy.js zone is
// no door of the core's surface (sim/boundaries.mjs), so the shape is its
// sums again, here: sim/hud-check.mjs's zones lane holds every point of a
// grid over the board to `zone(G, side)` (inside one exactly when inside the
// other, the wall's own band aside: a base must stand its radius behind the
// face, a cell centre on it is in neither's), either seat attacking.
import { rolesOf, roleOf } from '../core/index.js'
import { flipped } from '../core/match.js'

// the polygon `pts` cut to x0 ≤ x ≤ x1 and z0 ≤ z ≤ z1 (Sutherland-Hodgman,
// one half-plane at a time: the region is no convex shape, the box is)
function clipBox(pts, x0, x1, z0, z1) {
  const cut = (poly, inside, meet) => {
    const out = []
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], ia = inside(a), ib = inside(b)
      if (ia) out.push(a)
      if (ia !== ib) out.push(meet(a, b))
    }
    return out
  }
  const atX = (x) => (a, b) => ({ x, z: a.z + ((b.z - a.z) * (x - a.x)) / (b.x - a.x) })
  const atZ = (z) => (a, b) => ({ x: a.x + ((b.x - a.x) * (z - a.z)) / (b.z - a.z), z })
  let p = pts
  p = cut(p, (q) => q.x >= x0, atX(x0))
  p = cut(p, (q) => q.x <= x1, atX(x1))
  p = cut(p, (q) => q.z >= z0, atZ(z0))
  p = cut(p, (q) => q.z <= z1, atZ(z1))
  return p
}
const rect = (x0, x1, z0, z1) => [{ x: x0, z: z0 }, { x: x1, z: z0 }, { x: x1, z: z1 }, { x: x0, z: z1 }]

// [seat 0's polygon, seat 1's], or null on a mission without roles
export function zoneShapes(G) {
  const roles = rolesOf(G.setup)
  if (!roles) return null
  const { W, H } = G.board, flip = flipped(G.setup)
  return [0, 1].map((s) => {
    const z = roles[roleOf(G, s)].zone
    const [x0, x1] = flip ? [0 - z.x[1], 0 - z.x[0]] : z.x
    const [z0, z1] = z.z ? (flip ? [0 - z.z[1], 0 - z.z[0]] : z.z) : [-H / 2, H / 2]
    const bx0 = Math.max(-W / 2, x0), bx1 = Math.min(W / 2, x1)
    if (!z.behind) return rect(bx0, bx1, Math.max(-H / 2, z0), Math.min(H / 2, z1))
    const plan = G.terrain.plan, line = roles[roleOf(G, s)].line
    // (no plan: the line itself is the face, x from it to the seat's edge)
    if (!plan) return flip ? rect(bx0, Math.min(bx1, 0 - line), -H / 2, H / 2) : rect(Math.max(bx0, line), bx1, -H / 2, H / 2)
    return clipBox(plan.region, bx0, bx1, -H / 2, H / 2)
  })
}

// whether (x, z) is inside polygon `pts` (an even-odd ray cast)
export function inZone(pts, x, z) {
  let c = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j]
    if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) c = !c
  }
  return c
}
