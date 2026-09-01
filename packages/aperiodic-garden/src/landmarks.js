// The buildings that stand on a special tile.
//
// Everything else in the garden is instanced: one geometry, hundreds of copies,
// scattered by a hash. That is the right answer for trees and boulders and the
// cottages of a hamlet, and the wrong one for a woodcutter's camp, because the
// whole point of a camp is that there is one of it. Left to the scatterer a
// camp came out as three more cottages on a patch of village cover, which is
// exactly what the ordinary hamlet tile already looks like — the tile you spent
// a whole errand's worth of forest on was indistinguishable from the tile you
// were dealt.
//
// So these are built one at a time, as small groups of real meshes. There are
// never more than a dozen on a board, and each one is a picture of what the
// place *does*: timber stacked and a saw trestle, hurdles round a fold, a
// stepped face with a derrick over it, vines on their wires. At card size you
// read the silhouette; up close you read the work.
//
// Each model is built facing +X, standing on y = 0, and fits inside a circle of
// about 0.55 — a little under a kite — so it sits on the tile's heart without
// spilling over a seam.

import * as THREE from 'three'

const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear()

// A shared, small palette. Landmarks are meant to look built by the same hands.
const TIMBER = 0xb07f4d
const TIMBER_DARK = 0x7d5732
const CUT_WOOD = 0xe0c493
const CANVAS = 0xe9e2d0
const THATCH = 0xc8ab63
const SLATE = 0x5d6775
const PLASTER = 0xe6dcc6
const STONE = 0x9aa0a6
const STONE_CUT = 0xc3c7cc
const IRON = 0x4a4f57
const WOOL = 0xf2efe6
const LEAF = 0x4a7b45
const GRAPE = 0x6b3f6e
const REED = 0x8fa254

const mats = new Map()
/** Materials are shared across every landmark — a dozen groups, six materials. */
function mat(hex, opts) {
  const k = hex + (opts?.side ?? 0) * 1e7
  let m = mats.get(k)
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: lin(hex), ...opts })
    mats.set(k, m)
  }
  return m
}

/** A box, positioned and turned in one line — most of what follows is boxes. */
function box(g, hex, w, h, d, x, y, z, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(hex))
  m.position.set(x, y, z)
  m.rotation.set(0, ry, rz)
  m.castShadow = true
  g.add(m)
  return m
}

// A cylinder stands on +y. Turning it by rz = π/2 lays it along x, by rx = π/2
// along z; ry then swings that horizontal axis round, because the default XYZ
// Euler order applies z first and y after it.
function cyl(g, hex, r0, r1, h, seg, x, y, z, rx = 0, rz = 0, ry = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat(hex))
  m.position.set(x, y, z)
  m.rotation.set(rx, ry, rz)
  m.castShadow = true
  g.add(m)
  return m
}

/** A pitched roof: a four-sided cone turned 45°, which is a hip roof cheaply. */
function roof(g, hex, r, h, x, y, z, ry = Math.PI / 4) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 4), mat(hex))
  m.position.set(x, y, z)
  m.rotation.y = ry
  m.castShadow = true
  g.add(m)
  return m
}

/** A small hut — the same shape at every camp, so they read as one settlement's
 *  work — with its walls and roof passed in. */
function hut(g, wall, cover, w, h, x, z, ry) {
  const b = box(g, wall, w, h, w * 0.82, x, h / 2, z, ry)
  roof(g, cover, w * 0.78, h * 0.85, x, h + h * 0.42, z, ry + Math.PI / 4)
  return b
}

// --- the camps ---------------------------------------------------------------

/**
 * Woodcutter's camp: a stack of cut timber, a saw trestle with a log on it, and
 * a canvas lean-to. The stack is the tell — nothing else in the garden is a
 * neat pile of cylinders, so even at thumbnail size the tile reads as felled
 * wood rather than as more forest.
 */
export function woodcutterCamp() {
  const g = new THREE.Group()

  // The timber stack: a proper cord of it, four courses of thin logs between two
  // upright stakes. Thin and many is the whole trick — three fat cylinders read
  // as three fallen trees, and a dozen slim ones read as *stacked*.
  const rows = [4, 4, 3, 2]
  for (let row = 0; row < rows.length; row++) {
    for (let i = 0; i < rows[row]; i++) {
      const off = (i - (rows[row] - 1) / 2) * 0.042
      cyl(g, CUT_WOOD, 0.02, 0.02, 0.23, 7, -0.15, 0.024 + row * 0.04, off, 0, Math.PI / 2)
    }
  }
  for (const x of [-0.25, -0.05]) {
    cyl(g, TIMBER_DARK, 0.008, 0.008, 0.2, 4, x, 0.1, -0.085)
    cyl(g, TIMBER_DARK, 0.008, 0.008, 0.2, 4, x, 0.1, 0.085)
  }

  // Saw-horse: two X-frames with a log across them. Nothing else — an earlier
  // pass leaned a saw blade on it as well, and three brown things at three
  // angles in the same tenth of a tile came out as one unreadable knot.
  for (const z of [-0.05, 0.05]) {
    cyl(g, TIMBER_DARK, 0.007, 0.007, 0.13, 4, 0.13, 0.055, z, 0, 0.45)
    cyl(g, TIMBER_DARK, 0.007, 0.007, 0.13, 4, 0.13, 0.055, z, 0, -0.45)
  }
  cyl(g, TIMBER, 0.024, 0.021, 0.19, 7, 0.13, 0.115, 0, Math.PI / 2, 0)

  // lean-to: a canvas sheet off a low ridgepole, open to the front
  cyl(g, TIMBER_DARK, 0.009, 0.009, 0.22, 5, 0, 0.13, -0.16, Math.PI / 2, 0)
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.17), mat(CANVAS, { side: THREE.DoubleSide }))
  sheet.position.set(0, 0.068, -0.21)
  sheet.rotation.set(-Math.PI / 2 + 0.75, 0, 0)
  sheet.castShadow = true
  g.add(sheet)

  // a stump, with the axe left standing in it
  cyl(g, TIMBER_DARK, 0.042, 0.046, 0.055, 8, 0.02, 0.028, 0.2)
  cyl(g, CUT_WOOD, 0.037, 0.037, 0.006, 8, 0.02, 0.058, 0.2)
  cyl(g, TIMBER, 0.006, 0.006, 0.13, 4, 0.03, 0.115, 0.2, 0, 0.3)
  box(g, IRON, 0.045, 0.03, 0.01, 0.058, 0.172, 0.2, 0, 0.3)
  return g
}

/**
 * Shepherd's fold: a ring of hurdles with a gap for a gate, a few sheep inside,
 * and the shepherd's hut outside it. A closed pen full of pale blobs is a shape
 * nothing else here makes.
 */
export function shepherdFold() {
  const g = new THREE.Group()
  const R = 0.2
  const N = 12
  for (let i = 0; i < N; i++) {
    // the gap in the ring is the gate, and it faces the way the model faces
    const a = (i / N) * Math.PI * 2
    if (Math.abs(((a + Math.PI) % (Math.PI * 2)) - Math.PI) < 0.5) continue
    cyl(g, TIMBER_DARK, 0.007, 0.007, 0.1, 4, Math.cos(a) * R, 0.05, Math.sin(a) * R)
    // The two rails on to the next post. A y-turn sends the bar's own +x to
    // (cos, -sin), and the tangent here is (-sin a, cos a), so the angle it
    // wants is -(a + π/2) — turn it the other way and the fence comes out as a
    // crown of spikes pointing out of the ring.
    const a2 = ((i + 1) / N) * Math.PI * 2
    const mx = ((Math.cos(a) + Math.cos(a2)) / 2) * R
    const mz = ((Math.sin(a) + Math.sin(a2)) / 2) * R
    const face = -(a + a2) / 2 - Math.PI / 2
    const span = 2 * R * Math.sin(Math.PI / N) * 1.06
    box(g, TIMBER, span, 0.009, 0.006, mx, 0.042, mz, face)
    box(g, TIMBER, span, 0.009, 0.006, mx, 0.078, mz, face)
  }
  // the flock: fleece on four stub legs, with a dark face
  for (const [x, z, ry] of [
    [-0.07, 0.02, 0.4],
    [0.04, -0.09, 2.2],
    [0.0, 0.09, 3.3],
    [0.09, 0.05, 1.1],
  ]) {
    const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.042, 0), mat(WOOL))
    b.scale.set(1.4, 0.95, 1)
    b.position.set(x, 0.056, z)
    b.rotation.y = ry
    b.castShadow = true
    g.add(b)
    const hx = x + Math.cos(ry) * 0.052
    const hz = z - Math.sin(ry) * 0.052
    box(g, IRON, 0.028, 0.024, 0.024, hx, 0.045, hz, ry)
    for (const s of [-1, 1])
      for (const f of [-1, 1])
        cyl(g, IRON, 0.005, 0.005, 0.036, 4, x + Math.cos(ry) * 0.028 * f + Math.sin(ry) * 0.018 * s,
          0.018, z - Math.sin(ry) * 0.028 * f + Math.cos(ry) * 0.018 * s)
  }
  hut(g, PLASTER, THATCH, 0.15, 0.12, 0.31, 0.06, 0.3)
  // the crook, stood by the door
  cyl(g, TIMBER, 0.007, 0.007, 0.19, 5, 0.23, 0.095, 0.02, 0, 0.12)
  return g
}

/**
 * Quarry: a stepped face cut down into the ground, dressed blocks stacked on the
 * floor of it, and a timber derrick standing over the lip. The steps are the
 * only concave thing in a garden made of extrusions, which is what makes it
 * read as a hole rather than a heap.
 */
export function quarryWorks() {
  const g = new THREE.Group()
  // A floor of pale cut rock, so the works stand on worked stone rather than on
  // whatever cover the tile happens to have.
  box(g, STONE_CUT, 0.46, 0.012, 0.36, -0.02, 0.006, 0)
  // Three benches, each set further back and standing higher. They sit *on* the
  // ground rather than in it — the board is flat and stays flat — but stepping
  // them back in lightening greys reads as a face cut into a hill.
  const shades = [0x9aa0a6, 0xa9aeb4, 0xb6bbc0]
  for (let i = 0; i < 3; i++) {
    const h = 0.05 + i * 0.045
    box(g, shades[i], 0.42 - i * 0.06, h, 0.075, -0.02, h / 2, -0.11 - i * 0.055)
  }
  // dressed blocks, stacked and waiting to go
  box(g, STONE_CUT, 0.07, 0.05, 0.06, 0.14, 0.031, 0.12)
  box(g, STONE_CUT, 0.07, 0.05, 0.06, 0.145, 0.081, 0.115, 0.25)
  box(g, STONE_CUT, 0.065, 0.045, 0.055, 0.06, 0.029, 0.14, 0.9)
  // rubble at the foot of the face
  for (const [x, z, s] of [[-0.19, 0.1, 1], [-0.05, 0.02, 0.75], [-0.24, -0.02, 0.7]]) {
    const r = new THREE.Mesh(new THREE.IcosahedronGeometry(0.032 * s, 0), mat(STONE))
    r.position.set(x, 0.018 * s, z)
    r.rotation.set(x * 3, z * 3, s)
    r.castShadow = true
    g.add(r)
  }
  // the derrick: a mast, a raked back-stay, a jib out over the face, and a
  // block hanging off the end of it
  cyl(g, TIMBER, 0.01, 0.013, 0.3, 6, 0.06, 0.15, 0.05)
  cyl(g, TIMBER_DARK, 0.007, 0.007, 0.3, 5, 0.15, 0.14, 0.05, 0, 0.6)
  cyl(g, TIMBER, 0.007, 0.007, 0.24, 5, -0.03, 0.26, 0.03, 0, 1.3)
  cyl(g, IRON, 0.0025, 0.0025, 0.13, 4, -0.14, 0.2, 0.02)
  box(g, STONE_CUT, 0.05, 0.05, 0.05, -0.14, 0.11, 0.02, 0.4)
  return g
}

/**
 * Vineyard: four rows of trained vines on wired stakes, running across the
 * slope, with the press house at the head of them. Rows of anything are rare
 * here — the scatterer cannot make one — so ruled lines of green say cultivated
 * from as far away as you can see the tile.
 */
export function vineyardRows() {
  const g = new THREE.Group()
  for (let r = 0; r < 4; r++) {
    const z = -0.15 + r * 0.1
    // The row itself, as one long low hedge. Modelling each vine as its own
    // little ball gives a grid of lollipops that reads as an orchard; what says
    // vineyard is the *continuous line*, trained along a wire and cut flat.
    box(g, LEAF, 0.32, 0.055, 0.05, -0.01, 0.1, z)
    box(g, TIMBER, 0.34, 0.003, 0.003, -0.01, 0.13, z)
    for (let i = 0; i < 5; i++) {
      const x = -0.15 + i * 0.07
      cyl(g, TIMBER_DARK, 0.005, 0.005, 0.15, 4, x, 0.075, z)
      // one bunch hanging under every third stake, so the colour is a note
      // rather than a wash
      if ((r + i) % 3 === 0) {
        const b = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.036, 5), mat(GRAPE))
        b.position.set(x + 0.018, 0.072, z + 0.03)
        b.rotation.x = Math.PI
        g.add(b)
      }
    }
  }
  hut(g, PLASTER, SLATE, 0.16, 0.14, 0.29, -0.02, -0.35)
  // the press: a tub with a screw and a bar over it
  cyl(g, TIMBER, 0.05, 0.045, 0.065, 8, 0.27, 0.033, 0.17)
  cyl(g, IRON, 0.005, 0.005, 0.1, 5, 0.27, 0.11, 0.17)
  box(g, TIMBER_DARK, 0.095, 0.01, 0.01, 0.27, 0.16, 0.17, 0.6)
  return g
}

// --- water ------------------------------------------------------------------

/**
 * Where a stream ends: reeds round the shore and a rowing boat pulled half out
 * of the water. A lake tile already draws its pool, so this is only the edge
 * dressing — placed at the tile's heart, the boat sits in the pool and the
 * reeds ring it.
 */
export function lakeReeds() {
  const g = new THREE.Group()
  const R = 0.21
  for (let i = 0; i < 8; i++) {
    // a gap on the near side, where the boat is
    const a = 0.8 + (i / 8) * Math.PI * 1.6
    const x = Math.cos(a) * (R + (i % 3) * 0.018)
    const z = Math.sin(a) * (R + (i % 3) * 0.018)
    // a tuft, not a stalk: a low clump with the stems rising out of it, or the
    // reeds read as bare wire from any distance at all
    const clump = new THREE.Mesh(new THREE.IcosahedronGeometry(0.032, 0), mat(REED))
    clump.scale.set(1, 0.5, 1)
    clump.position.set(x, 0.014, z)
    clump.rotation.y = a
    clump.castShadow = true
    g.add(clump)
    for (let k = 0; k < 4; k++) {
      const h = 0.09 + ((i + k) % 4) * 0.025
      cyl(g, REED, 0.005, 0.006, h, 4, x + (k - 1.5) * 0.014, h / 2 + 0.01,
        z + (((k * 7) % 3) - 1) * 0.013, (k - 1.5) * 0.12, (k - 1.5) * 0.13)
    }
  }
  // The boat, drawn up on the shore. Built in a group of its own, facing +x,
  // and turned as a whole — the parts of a boat are defined against each other,
  // and placing each one in the tile's frame means writing the same rotation
  // out by hand five times.
  //
  // It is an *open* boat: a pale floor with a dark rail either side of it, so
  // from above there is a shape with an inside. A solid hull, which is what the
  // first pass built, reads as a brown wedge dropped on the bank.
  const b = new THREE.Group()
  box(b, CUT_WOOD, 0.16, 0.012, 0.062, 0, 0.014, 0)
  for (const z of [-0.032, 0.032]) box(b, TIMBER, 0.16, 0.03, 0.011, 0, 0.028, z, 0, z * 3)
  const prow = new THREE.Mesh(new THREE.ConeGeometry(0.037, 0.06, 4), mat(TIMBER))
  prow.position.set(0.095, 0.026, 0)
  prow.rotation.set(0, Math.PI / 4, -Math.PI / 2)
  prow.castShadow = true
  b.add(prow)
  box(b, TIMBER_DARK, 0.016, 0.008, 0.07, -0.01, 0.036, 0)
  cyl(b, TIMBER_DARK, 0.004, 0.004, 0.17, 4, 0.01, 0.04, 0.01, 0, Math.PI / 2, 0.55)
  b.position.set(0.09, 0, 0.13)
  b.rotation.y = 0.42
  g.add(b)
  return g
}

/**
 * The water works.
 *
 * An aqueduct stood here first and never made sense: an aqueduct carries water
 * *across* something, in one direction, and this tile's whole trick is that it
 * gathers water from every direction at once. So the model is what the rule
 * actually is — a round stone cistern with six dressed channels running out of
 * it, one towards each crossing the hat can have, each closed by a sluice gate
 * on a screw. Whichever channels meet a stream carry it in; the rest stand shut.
 *
 * The six radiate at exactly the angles the hat's ports sit at, which is why
 * the channels line up with the river the garden draws no matter which way the
 * tile is turned.
 */
export function waterWorks() {
  const g = new THREE.Group()
  const R = 0.1

  // the cistern: a stone drum, its water sitting a little below the rim
  cyl(g, STONE, R + 0.022, R + 0.026, 0.08, 12, 0, 0.04, 0)
  cyl(g, STONE_CUT, R + 0.03, R + 0.03, 0.014, 12, 0, 0.085, 0)
  cyl(g, 0x6fb6d6, R, R, 0.01, 12, 0, 0.073, 0)

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    const at = (d) => [cos * d, -sin * d]
    // the channel: a floor with a kerb either side, running out from the drum
    const [mx, mz] = at(R + 0.12)
    box(g, STONE_CUT, 0.17, 0.012, 0.055, mx, 0.006, mz, a)
    for (const s of [-1, 1]) {
      const ox = -sin * 0.032 * s
      const oz = -cos * 0.032 * s
      box(g, STONE, 0.17, 0.032, 0.014, mx + ox, 0.016, mz + oz, a)
    }
    // the sluice: two posts, a head beam, the gate hung between them, and the
    // screw that lifts it
    const [gx, gz] = at(R + 0.16)
    for (const s of [-1, 1])
      box(g, TIMBER_DARK, 0.014, 0.075, 0.014, gx - sin * 0.036 * s, 0.038, gz - cos * 0.036 * s, a)
    box(g, TIMBER_DARK, 0.014, 0.012, 0.088, gx, 0.08, gz, a)
    box(g, TIMBER, 0.008, 0.042, 0.058, gx, 0.03, gz, a)
    cyl(g, IRON, 0.0035, 0.0035, 0.05, 4, gx, 0.095, gz)
    box(g, IRON, 0.03, 0.006, 0.006, gx, 0.118, gz, a + 0.6)
  }

  // the works themselves: a small slated house over the drum's north side, the
  // one thing tall enough to give the tile a silhouette
  hut(g, PLASTER, SLATE, 0.14, 0.14, 0, -0.26, 0.35)
  return g
}

/**
 * A crafted hamlet is a whole tile of houses, and the scatterer will fill it —
 * so what it needs is one thing standing above the roofs. A bell tower under a
 * shallow spire does it, and gives the tile a skyline.
 */
export function bellTower() {
  const g = new THREE.Group()
  box(g, PLASTER, 0.1, 0.3, 0.1, 0, 0.15, 0)
  // A tall louvred opening on each face, proud of the plaster by a hair. It is
  // the shadow of the belfry rather than the belfry, and at the size this thing
  // is ever seen that is the same picture for a tenth of the geometry.
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2
    box(g, IRON, 0.038, 0.09, 0.004, Math.sin(a) * 0.051, 0.235, Math.cos(a) * 0.051, a)
  }
  box(g, STONE_CUT, 0.12, 0.016, 0.12, 0, 0.308, 0)
  roof(g, SLATE, 0.095, 0.19, 0, 0.41, 0)
  // the weather-vane, because a spire wants a point on it
  cyl(g, IRON, 0.003, 0.003, 0.05, 4, 0, 0.52, 0)
  box(g, IRON, 0.035, 0.018, 0.003, 0.014, 0.535, 0)
  return g
}

/** kind → builder. Anything not here gets the ordinary scatter and a pennant. */
export const LANDMARK_MODELS = {
  woodcutter: woodcutterCamp,
  shepherd: shepherdFold,
  quarry: quarryWorks,
  vineyard: vineyardRows,
  lake: lakeReeds,
  millpond: lakeReeds,
  waterworks: waterWorks,
  hamlet: bellTower,
}

export const hasLandmarkModel = (kind) => Object.hasOwn(LANDMARK_MODELS, kind)

/** Build one, or null if that kind has no model of its own. */
export function landmarkGroup(kind) {
  const make = LANDMARK_MODELS[kind]
  return make ? make() : null
}
