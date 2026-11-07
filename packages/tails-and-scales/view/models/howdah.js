// (F9b, DESIGN §4.2.5) The Shell-Back Howdah, the Coil of Ssithra's
// transport: one machine of meshes, shared by both figure styles (V2,
// view/models/cache.js's STYLES) as the War-Cart's is (./warcart.js): the
// classic kit (./classic/serpent.js) and the glossy one (./gloss/
// serpents.js) each build it here, and differ only in the finish its parts
// are drawn in, which `paint` gives (the classic's faceted painted plastic,
// the glossy's lacquered scales).
//
// A great serpent, its length the footprint's (5.9": its head disc 2" ahead
// of its body's, its tail's 2" behind), carrying a long tortoise shell over
// all three of its segments, on whose flattened crown stands the howdah: a
// railed riding deck of planks, an oval just wider than the shell, a
// pennant at each corner. The serpent is three segments: its body under
// the shell's middle, and its head (a thick neck rising out from under the
// shell's front rim into a broad viper's head, a gold bridle on it, its
// reins running back to the deck's front rail) and its tail (out from
// under the rim behind, tapering to a horned tip), each its own group, kept
// out of the bake ('hull' kind, view/units.js: they slither from side to
// side as it walks, and sway a little at rest). Nothing drawn at random, so
// the template cache clones it. Its anim's `deck` is the height its riders
// stand at, in the figure's own frame (view/units.js parents them there, at
// present/deck.js's slots, so they ride with it and turn as it turns): the
// deck's slots reach 1.15" from its centre (deck 1.6 less a 0.45" base's
// margin), inside the rail. Its front is +z, as every figure's.
//
//   howdah(paint, res)   the miniature; paint(kind, geo, hex) the mesh of
//                        geometry `geo` in the style's finish for `kind`:
//                        'skin' (the scaled hide), 'belly', 'shell' (horn),
//                        'seam' (the shell's dark seams and rim), 'wood',
//                        'metal' (gold), 'cloth', 'eye' (glowing), 'dark'
//                        (pupils, nostrils); `res` its detail (1 the
//                        classic's facets; the glossy's smoother)
//   longBase(fp, sideColor, rim)   (F9b) a long hull's base: the outline of
//                        its discs (view/hull.js) where a round unit's disc
//                        goes, dark, flocked, rimmed in the seat's colour,
//                        as kit.js's base() (its tufts fall at random, so a
//                        base is made for each figure; its plinth first,
//                        the one part of it a 'new' figure's shadow casts)
import * as THREE from 'three'
import { M, part, G } from './kit.js'
import { outline, discs0 } from '../hull.js'

// a tube along points (an [x, y, z] list, a Catmull-Rom curve through them),
// its radius r(t) from tail (t 0) to head (t 1), each end closed with a fan
function tube(points, r, radial = 10, segs = 24, flat = 1) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
  const frames = curve.computeFrenetFrames(segs, false)
  const pos = [], idx = []
  // (each ring's frame: the Frenet normal kept level, so the belly's
  // flattening (`flat` < 1) stays under it)
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, P = curve.getPointAt(t), T = frames.tangents[i]
    const side = new THREE.Vector3(0, 1, 0).cross(T).normalize()
    if (side.lengthSq() < 1e-6) side.set(1, 0, 0)
    const up = T.clone().cross(side).normalize()
    const rr = r(t)
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a)
      const ys = s < 0 ? s * flat : s
      pos.push(P.x + rr * (c * side.x + ys * up.x), P.y + rr * (c * side.y + ys * up.y), P.z + rr * (c * side.z + ys * up.z))
    }
  }
  for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b = a + radial + 1
    // (the corners run anticlockwise about the tangent: kit.js taperTube's
    // order, faces out)
    idx.push(a, a + 1, b, b, a + 1, b + 1)
  }
  for (const [end, ring] of [[0, 0], [1, segs]]) {
    const P = curve.getPointAt(end), c = pos.length / 3
    pos.push(P.x, P.y, P.z)
    for (let j = 0; j < radial; j++) {
      const a = ring * (radial + 1) + j
      if (end === 0) idx.push(c, a + 1, a)
      else idx.push(c, a, a + 1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

// a sphere of radius 1 scaled to (sx, sy, sz) in its geometry, at (x, y, z)
const blobAt = (n, sx, sy, sz, x, y, z) => new THREE.SphereGeometry(1, n, Math.max(4, Math.round(n * 0.6))).scale(sx, sy, sz).translate(x, y, z)

// The shell's surface, an ellipsoid dome: half-width A, half-length B, its
// rim at y Y0, its crown H over it; the point over (x, z) and its normal
const A = 1.32, B = 2.3, Y0 = 0.68, H = 0.86
function onShell(x, z) {
  const u = x / A, w = z / B, q = Math.max(0, 1 - u * u - w * w)
  const y = Y0 + H * Math.sqrt(q)
  const n = new THREE.Vector3((x / (A * A)) * H, Math.sqrt(q) || 1e-3, (z / (B * B)) * H).normalize()
  return { p: new THREE.Vector3(x, y, z), n }
}
// the deck: its top's height, and its half-width and half-length (an oval
// on the shell's flattened crown, the riders' slots inside its rail)
const DECK_Y = Y0 + H + 0.02, DW = 1.36, DL = 1.5

export function howdah(paint, res = 1) {
  const R = (n, min = 4) => Math.max(min, Math.round(n * res))
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)
  const SKIN = '#2f6e58', BELLY = '#d6c886', SHELL = '#7d6334', PLATE = '#9a7c42', SEAM = '#3b2c17', GOLD = '#c39a3c', WOOD = '#7a5232', CLOTH = '#5a2f7a'

  // the body under the shell: the serpent's coils, lying low in an S from
  // where the tail leaves it to where the neck does, bulging out under the
  // rim one side and then the other, so the beast shows under its load
  const coil = [[0.1, 0.38, -1.5], [0.85, 0.36, -0.95], [0.2, 0.38, -0.2], [-0.85, 0.36, 0.5], [-0.1, 0.38, 1.3]]
  body.add(paint('skin', tube(coil, (t) => 0.42 + 0.06 * Math.sin(Math.PI * t), R(14, 8), R(28, 12), 0.72), SKIN))
  // its belly, a cream band along its underside
  body.add(paint('belly', tube(coil.map(([x, , z]) => [x, 0.12, z]), () => 0.2, R(8, 6), R(20, 10), 0.35), BELLY))

  // the shell: the dome, its scutes (a row down the crown, a row of costal
  // plates either side, and the marginal ones round its rim, each a
  // low hexagon laid on the dome), and a dark seam under each
  const dome = new THREE.SphereGeometry(1, R(28, 12), R(12, 6), 0, Math.PI * 2, 0, Math.PI / 2).scale(A, H, B).translate(0, Y0, 0)
  body.add(paint('shell', dome, SHELL))
  const hex = new THREE.CylinderGeometry(1, 0.94, 1, 6)
  const plate = (x, z, s, hex2 = PLATE, lift = 0.012) => {
    const { p, n } = onShell(x, z)
    const g = hex.clone().scale(s, 0.07, s * 1.08)
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n)
    g.applyQuaternion(q).translate(p.x + n.x * lift, p.y + n.y * lift, p.z + n.z * lift)
    body.add(paint('shell', g, hex2))
    const s2 = hex.clone().scale(s * 1.1, 0.04, s * 1.18).applyQuaternion(q).translate(p.x - n.x * 0.01, p.y - n.y * 0.01, p.z - n.z * 0.01)
    body.add(paint('seam', s2, SEAM))
  }
  // (the crown's own plates are under the deck: those at its ends show)
  for (const z of [-1.85, 1.85]) plate(0, z, 0.36)
  for (const sx of [-1, 1]) for (const z of [-1.55, -0.55, 0.55, 1.55]) plate(sx * 0.98, z, 0.34)
  // the marginal scutes: a ring of small plates leaning out over the rim
  const nM = R(26, 18)
  for (let k = 0; k < nM; k++) {
    const a = (k / nM) * Math.PI * 2, x = Math.sin(a) * A * 0.985, z = Math.cos(a) * B * 0.985
    const g = new THREE.BoxGeometry(0.34, 0.07, 0.28)
    const out = new THREE.Vector3(Math.sin(a) / A, 0, Math.cos(a) / B).normalize()
    g.rotateX(0.5).applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), out)).translate(x, Y0 + 0.02, z)
    body.add(paint(k % 2 ? 'shell' : 'seam', g, k % 2 ? PLATE : SEAM))
  }
  // the girth straps under the dome, gold, holding the howdah on
  for (const z of [-0.9, 0.9]) body.add(paint('metal', new THREE.TorusGeometry(1, 0.04, R(5, 3), R(28, 14)).scale(A * 1.015, 0.5, 1).translate(0, 0.5, z), GOLD))

  // the howdah: an oval deck of planks on the crown, its rim and a low rail
  // on posts round it, a pennant on a pole at each corner
  const deck = new THREE.CylinderGeometry(1, 1, 0.1, R(32, 14)).scale(DW, 1, DL).translate(0, DECK_Y - 0.05, 0)
  body.add(paint('wood', deck, WOOD))
  for (let i = -5; i <= 5; i++) {
    const x = i * 0.25, half = DL * Math.sqrt(Math.max(0, 1 - (x / DW) ** 2)) * 0.97
    if (half < 0.1) continue
    body.add(paint('wood', new THREE.BoxGeometry(0.21, 0.025, half * 2).translate(x, DECK_Y + 0.005, 0), i % 2 ? '#8a6038' : '#6c4628'))
  }
  // the deck's skirt down to the shell, so it sits on it and doesn't float
  body.add(paint('seam', new THREE.CylinderGeometry(1, 0.8, 0.5, R(32, 14), 1, true).scale(DW * 0.96, 1, DL * 0.96).translate(0, DECK_Y - 0.3, 0), SEAM))
  body.add(paint('metal', new THREE.TorusGeometry(1, 0.035, R(5, 3), R(40, 16)).rotateX(Math.PI / 2).scale(DW, 1, DL).translate(0, DECK_Y, 0), GOLD))
  const nP = R(18, 12), rail = []
  for (let k = 0; k < nP; k++) {
    const a = (k / nP) * Math.PI * 2, x = Math.sin(a) * DW * 0.98, z = Math.cos(a) * DL * 0.98
    body.add(paint('wood', new THREE.CylinderGeometry(0.03, 0.035, 0.3, R(5, 4)).translate(x, DECK_Y + 0.15, z), '#5e3e22'))
    rail.push([x, z])
  }
  body.add(paint('wood', new THREE.TorusGeometry(1, 0.028, R(5, 3), R(40, 16)).rotateX(Math.PI / 2).scale(DW * 0.98, 1, DL * 0.98).translate(0, DECK_Y + 0.3, 0), '#5e3e22'))
  for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    const x = sx * DW * 0.7, z = sz * DL * 0.71
    body.add(paint('wood', new THREE.CylinderGeometry(0.035, 0.04, 1.05, R(6, 4)).translate(x, DECK_Y + 0.52, z), '#4a3018'))
    body.add(paint('metal', new THREE.SphereGeometry(0.06, R(8, 5), R(6, 4)).translate(x, DECK_Y + 1.06, z), GOLD))
    // a pennant, swallow-tailed, flying back
    const fl = new THREE.BufferGeometry()
    const y0 = DECK_Y + 1.0, y1 = DECK_Y + 0.72, dz = -0.55
    fl.setAttribute('position', new THREE.Float32BufferAttribute([x, y0, z, x, y1, z, x, (y0 + y1) / 2 + 0.04, z + dz, x, y0, z, x, (y0 + y1) / 2 + 0.04, z + dz, x, y0 - 0.02, z + dz * 1.1, x, y1, z, x, y1 + 0.02, z + dz * 1.1, x, (y0 + y1) / 2 + 0.04, z + dz], 3))
    fl.computeVertexNormals()
    body.add(paint('cloth', fl, CLOTH))
  }

  // the head: a thick neck out from under the shell's front rim, rising
  // into a broad viper's head (a jaw in the belly's cream, brow ridges,
  // glowing eyes with slit pupils, nostrils, a forked tongue), a gold
  // bridle on it with its reins back to the rail
  const head = new THREE.Group()
  head.position.set(0, 0.4, 1.25)
  // (the neck: out from under the rim, then up in a swan's S, the head
  // held high and level over the table ahead; a hood spread behind it, a
  // cobra's, its back the hide's darker, banded)
  const neck = [[-0.1, 0, -0.35], [0, 0.02, 0.3], [0.05, 0.3, 0.75], [0, 0.78, 0.9], [0, 1.08, 1.02]]
  head.add(paint('skin', tube(neck, (t) => 0.42 - 0.14 * t, R(12, 8), R(18, 8), 0.8), SKIN))
  head.add(paint('belly', tube(neck.map(([x, y, z]) => [x, y - 0.2 + 0.08 * (z > 0.6), z + 0.14]), (t) => 0.2 - 0.07 * t, R(8, 6), R(14, 6), 0.6), BELLY))
  const hood = new THREE.Group()
  hood.position.set(0, 1.1, 0.98)
  hood.rotation.x = -0.25
  hood.add(paint('skin', blobAt(R(16, 8), 0.62, 0.56, 0.08, 0, 0, 0), '#255a48'))
  hood.add(paint('belly', blobAt(R(14, 7), 0.5, 0.46, 0.05, 0, 0, 0.05), BELLY))
  for (const [y, w] of [[0.26, 0.42], [0.06, 0.55], [-0.16, 0.48]]) hood.add(paint('skin', blobAt(R(10, 6), w, 0.05, 0.06, 0, y, -0.035), '#1b4436'))
  head.add(hood)
  const skull = new THREE.Group()
  skull.position.set(0, 1.12, 1.24)
  skull.rotation.x = 0.12
  // (a viper's: broad over the jaws, a narrower snout before it, the jaw
  // under it in the belly's cream, brow ridges over its eyes)
  skull.add(paint('skin', blobAt(R(16, 8), 0.4, 0.22, 0.44, 0, 0, 0), SKIN))
  skull.add(paint('skin', blobAt(R(12, 7), 0.27, 0.16, 0.3, 0, 0.0, 0.36), SKIN))
  skull.add(paint('belly', blobAt(R(14, 7), 0.34, 0.1, 0.46, 0, -0.12, 0.12), BELLY))
  for (const s of [-1, 1]) {
    skull.add(paint('skin', blobAt(R(10, 6), 0.12, 0.07, 0.22, s * 0.2, 0.13, 0.12), '#285e4b'))
    skull.add(paint('eye', blobAt(R(10, 6), 0.08, 0.08, 0.08, s * 0.28, 0.07, 0.18), '#ffd23a'))
    skull.add(paint('dark', blobAt(R(6, 4), 0.02, 0.065, 0.028, s * 0.355, 0.07, 0.2), '#111111'))
    skull.add(paint('dark', blobAt(R(6, 4), 0.028, 0.02, 0.028, s * 0.09, 0.07, 0.62), '#141414'))
    // the bridle's cheek ring, and its rein back to the deck's front rail
    skull.add(paint('metal', new THREE.TorusGeometry(0.07, 0.018, R(5, 3), R(12, 6)).rotateY(Math.PI / 2).translate(s * 0.37, -0.04, 0.12), GOLD))
  }
  skull.add(paint('metal', new THREE.TorusGeometry(1, 0.03, R(5, 3), R(24, 10)).scale(0.39, 0.25, 1).rotateY(Math.PI / 2).rotateZ(Math.PI / 2).translate(0, -0.02, -0.16), GOLD))
  for (const s of [-1, 1]) skull.add(paint('dark', new THREE.CylinderGeometry(0.014, 0.014, 0.26, 4).rotateX(Math.PI / 2).rotateY(s * 0.3).translate(s * 0.03, -0.08, 0.76), '#c8304a'))
  head.add(skull)
  for (const s of [-1, 1]) {
    const a = new THREE.Vector3(s * 0.37, 1.08, 1.36), b = new THREE.Vector3(s * 0.5, DECK_Y + 0.28 - 0.4, DL * 0.98 - 1.25)
    head.add(paint('wood', new THREE.CylinderGeometry(0.014, 0.014, 1, 4).applyMatrix4(new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()), new THREE.Vector3(1, a.distanceTo(b), 1))), '#3a2414'))
  }
  // the tail: out from under the rim behind, tapering into a horned tip,
  // a curl to it
  const tail = new THREE.Group()
  tail.position.set(0.1, 0.38, -1.4)
  tail.add(paint('skin', tube([[0.18, -0.3, -1.62], [0.22, -0.26, -1.2], [-0.12, -0.18, -0.6], [0.06, 0, 0.2]], (t) => 0.04 + 0.44 * Math.pow(t, 0.8), R(12, 8), R(16, 8), 0.7), SKIN))
  for (let i = 0; i < 4; i++) {
    const t = 0.18 + i * 0.1, z = -1.55 + i * 0.28, x = 0.2 - i * 0.07
    tail.add(paint('shell', new THREE.ConeGeometry(0.05 + i * 0.01, 0.16, R(6, 4)).rotateX(-0.6).translate(x, -0.2 + t * 0.4, z), '#cfc29a'))
  }
  head.userData.keep = true
  tail.userData.keep = true
  body.add(head, tail)
  root.userData.anim = { kind: 'hull', body, head, tail, deck: DECK_Y }
  return root
}

// (F9b) A long hull's base: its discs' outline (view/hull.js), the plinth
// first, then its flocked top and its rim in the seat's colour, as kit.js's
// base() draws a round one
export function longBase(fp, sideColor, rim = 1) {
  const g = new THREE.Group()
  const shape = (pad) => new THREE.Shape(outline(fp, pad, 32).map(([x, z]) => new THREE.Vector2(x, -z)))
  // (a shape's (x, y) lies flat as (x, −y): extruded up from the table)
  const flat = (geo) => geo.rotateX(-Math.PI / 2)
  const b = part(flat(new THREE.ExtrudeGeometry(shape(0.04), { depth: 0.09, bevelEnabled: false })), M('#262422'))
  b.receiveShadow = true
  const top = part(flat(new THREE.ShapeGeometry(shape(-0.03))), M('#4c5e2c', { flatShading: false }), 0, 0.094, 0)
  top.receiveShadow = true
  const pts = outline(fp, 0.03, 32).map(([x, z]) => new THREE.Vector3(x, 0, z))
  const ring = part(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), pts.length * 2, 0.028 * rim, 4, true), M(sideColor, { emissive: sideColor, emissiveIntensity: 0.35 }), 0, 0.07, 0)
  g.add(b, top, ring)
  // flock: a few tufts of static grass on each disc
  for (const [x, z, r] of discs0(fp)) for (let i = 0; i < Math.round(r * 6); i++) {
    const a = Math.random() * 6, d = Math.sqrt(Math.random()) * r * 0.85
    g.add(part(G.cone, M('#6a8a3a'), x + Math.cos(a) * d, 0.13, z + Math.sin(a) * d, 0.035, 0.08, 0.035))
  }
  return g
}
