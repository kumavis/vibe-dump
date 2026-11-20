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
// ((S5d) One reader.) The zone is the rules' own, read through the core's
// surface for views (core/queries.js re-exports core/deploy.js zone, as it
// does freeSpot and placeOk): its x bounds (mirrored, and cut to the
// board and the plan's reach, by the rules), its z bounds where the role
// names them, and the plan where the zone lies behind the wall's face. The
// polygon is all that is the view's: the bounds as a rectangle cut to the
// board, or the plan's region cut to them. sim/hud-check.mjs's zones lane
// still holds every point of a grid over the board to `zone(G, side)`
// (inside one exactly when inside the other, the wall's own band aside: a
// base must stand its radius behind the face, a cell centre on it is in
// neither's), either seat attacking.
import { rolesOf } from '../core/index.js'
import { zone } from '../core/queries.js'

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
  if (!rolesOf(G.setup)) return null
  const { W, H } = G.board
  return [0, 1].map((s) => {
    const b = zone(G, s)
    const x0 = Math.max(-W / 2, b.minX), x1 = Math.min(W / 2, b.maxX)
    const z0 = Math.max(-H / 2, b.minZ ?? -H / 2), z1 = Math.min(H / 2, b.maxZ ?? H / 2)
    // (behind the wall's face: the plan's region inside the bounds)
    return b.plan ? clipBox(b.plan.region, x0, x1, z0, z1) : rect(x0, x1, z0, z1)
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
