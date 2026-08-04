// ---------------------------------------------------------------------------
// Site kit: everything that isn't the ground, the house or the crew.
//
// Each builder returns a Group whose origin sits on the ground and which faces
// +Z, so the caller only ever has to set position and rotation.y. The two piles
// (pallet and supply stack) expose setCount() and are drawn with InstancedMesh,
// because they change every few seconds and there are hundreds of bricks in them.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { BRICK, MORTAR, COLORS } from './config.js'

const BOX = new THREE.BoxGeometry(1, 1, 1)
const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 14)
const CONE = new THREE.ConeGeometry(0.5, 1, 14)
const SPH = new THREE.SphereGeometry(0.5, 10, 8)

const rnd = (rng) => (rng ? rng() : Math.random())

const M = {
  steel: new THREE.MeshStandardMaterial({ color: 0xb2bcc4, roughness: 0.36, metalness: 0.8 }),
  darkSteel: new THREE.MeshStandardMaterial({ color: 0x5b636b, roughness: 0.5, metalness: 0.7 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x232629, roughness: 0.95 }),
  timber: new THREE.MeshStandardMaterial({ color: COLORS.timber, roughness: 0.92 }),
  timberDark: new THREE.MeshStandardMaterial({ color: 0x8f6538, roughness: 0.94 }),
  ply: new THREE.MeshStandardMaterial({ color: 0xd0a463, roughness: 0.9 }),
  board: new THREE.MeshStandardMaterial({ color: 0x8a7a60, roughness: 0.96 }),
  orange: new THREE.MeshStandardMaterial({ color: 0xe2621f, roughness: 0.7 }),
  yellow: new THREE.MeshStandardMaterial({ color: 0xe8b220, roughness: 0.62 }),
  white: new THREE.MeshStandardMaterial({ color: 0xe9edf0, roughness: 0.6 }),
  wrap: new THREE.MeshStandardMaterial({
    color: 0x9fd7ff, roughness: 0.25, metalness: 0.1,
    transparent: true, opacity: 0.3, side: THREE.DoubleSide,
  }),
  sand: new THREE.MeshStandardMaterial({ color: 0xc7a870, roughness: 1 }),
  grit: new THREE.MeshStandardMaterial({ color: 0x8e8b86, roughness: 1 }),
  mortar: new THREE.MeshStandardMaterial({ color: COLORS.mortar, roughness: 0.95 }),
  cast: new THREE.MeshStandardMaterial({ color: COLORS.lintel, roughness: 0.9 }),
  slate: new THREE.MeshStandardMaterial({ color: COLORS.tile[0], roughness: 0.66, metalness: 0.05 }),
  joinery: new THREE.MeshStandardMaterial({ color: 0xe6eef4, roughness: 0.55 }),
  glass: new THREE.MeshStandardMaterial({
    color: 0x9fc4dd, roughness: 0.12, metalness: 0.15,
    transparent: true, opacity: 0.55,
  }),
}

function box(parent, material, sx, sy, sz, x = 0, y = 0, z = 0, geo = BOX) {
  const m = new THREE.Mesh(geo, material)
  m.scale.set(sx, sy, sz)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  parent.add(m)
  return m
}

/** A cylinder lying along X (barrow axles, scaffold ledgers). */
function tubeX(parent, material, len, r, x, y, z) {
  const m = box(parent, material, r * 2, len, r * 2, x, y, z, CYL)
  m.rotation.z = Math.PI / 2
  return m
}
function tubeZ(parent, material, len, r, x, y, z) {
  const m = box(parent, material, r * 2, len, r * 2, x, y, z, CYL)
  m.rotation.x = Math.PI / 2
  return m
}

// --- brick piles -----------------------------------------------------------

const brickMat = new THREE.MeshStandardMaterial({ color: COLORS.brick[0], roughness: 0.92 })
const BL = BRICK.L - MORTAR
const BH = BRICK.H - MORTAR
const BD = BRICK.D - MORTAR

/**
 * An InstancedMesh of bricks laid out by `place(i)`, revealed from the bottom
 * up by setCount(). One buffer, one draw call, and depleting the pile is a
 * single integer write.
 */
function brickPile(capacity, place, rng) {
  const geo = new THREE.BoxGeometry(BL, BH, BD)
  const mesh = new THREE.InstancedMesh(
    geo,
    new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 }),
    capacity,
  )
  mesh.castShadow = true
  mesh.receiveShadow = true
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const v = new THREE.Vector3()
  const one = new THREE.Vector3(1, 1, 1)
  const col = new THREE.Color()
  for (let i = 0; i < capacity; i++) {
    const t = place(i, rng)
    e.set(0, t.ry || 0, t.rz || 0)
    q.setFromEuler(e)
    v.set(t.x, t.y, t.z)
    m4.compose(v, q, one)
    mesh.setMatrixAt(i, m4)
    mesh.setColorAt(i, col.setHex(COLORS.brick[(i * 7 + 3) % COLORS.brick.length]))
  }
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  mesh.count = capacity
  return mesh
}

export function buildPallet(rng) {
  const group = new THREE.Group()
  const capacity = 120
  // pallet bearers
  for (const z of [-0.44, 0, 0.44]) box(group, M.timberDark, 1.15, 0.07, 0.11, 0, 0.035, z)
  for (let i = 0; i < 6; i++) {
    box(group, M.timber, 1.15, 0.035, 0.13, 0, 0.088, -0.5 + i * 0.2)
  }
  const perRow = 5
  const perLayer = perRow * 4
  const pile = brickPile(
    capacity,
    (i) => {
      const layer = Math.floor(i / perLayer)
      const k = i % perLayer
      const row = Math.floor(k / perRow)
      const col = k % perRow
      const flip = layer & 1
      return {
        x: flip ? -0.44 + row * 0.29 : -0.5 + col * 0.25,
        y: 0.108 + layer * (BH + 0.006) + BH / 2,
        z: flip ? -0.5 + col * 0.25 : -0.44 + row * 0.29,
        ry: flip ? Math.PI / 2 : 0,
      }
    },
    rng,
  )
  group.add(pile)
  const wrap = box(group, M.wrap, 1.22, 0.9, 1.12, 0, 0.56)
  wrap.castShadow = false
  let shown = capacity
  return {
    group,
    capacity,
    setCount(n) {
      shown = Math.max(0, Math.min(capacity, Math.round(n)))
      pile.count = shown
      wrap.visible = shown > 12
      wrap.scale.y = Math.max(0.12, (shown / capacity) * 0.9)
      wrap.position.y = wrap.scale.y / 2 + 0.11
    },
    get count() {
      return shown
    },
  }
}

/**
 * A stock of one material, sitting by the house for the masons to draw from.
 * Each looks like what it is — you can tell the timber stack from the tiles
 * across the site, which is the point, since a mason has to fetch the right one.
 */
export function buildStock(mat, rng) {
  const group = new THREE.Group()
  const capacity = mat.cap
  box(group, M.ply, 1.5, 0.03, 1.15, 0, 0.015)
  const parts = []

  const add = (material, sx, sy, sz, x, y, z, ry) => {
    const m = box(group, material, sx, sy, sz, x, y, z)
    m.rotation.y = ry || 0
    m.visible = false
    parts.push(m)
    return m
  }

  if (mat.key === 'brick') {
    const perRow = 6
    const perLayer = perRow * 2
    for (let i = 0; i < capacity; i++) {
      const layer = Math.floor(i / perLayer)
      const k = i % perLayer
      const row = Math.floor(k / perRow)
      const col = k % perRow
      const b = add(brickMat, BL, BH, BD,
        -0.66 + col * 0.26 + (rnd(rng) - 0.5) * 0.04,
        0.03 + layer * (BH + 0.008) + BH / 2,
        -0.22 + row * 0.44 + (rnd(rng) - 0.5) * 0.04)
      b.rotation.y = (rnd(rng) - 0.5) * 0.14
    }
  } else if (mat.key === 'cast') {
    for (let i = 0; i < capacity; i++) {
      add(M.cast, 1.16, 0.075, 0.34, (rnd(rng) - 0.5) * 0.05, 0.05 + i * 0.085, (rnd(rng) - 0.5) * 0.06)
    }
  } else if (mat.key === 'timber') {
    for (let i = 0; i < capacity; i++) {
      const layer = Math.floor(i / 2)
      const col = i % 2
      add(layer & 1 ? M.timber : M.timberDark, 1.9, 0.1, 0.16,
        0, 0.06 + layer * 0.11, -0.16 + col * 0.32 + (rnd(rng) - 0.5) * 0.02)
    }
  } else if (mat.key === 'joinery') {
    // Glazed units come pre-made, so they stand on edge in a rack and lean
    // back against it the way they do outside a real joiner's shop.
    for (let i = 0; i < capacity; i++) {
      const unit = new THREE.Group()
      const lean = 0.13 + (rnd(rng) - 0.5) * 0.03
      box(unit, M.joinery, 0.86, 0.98, 0.05)
      box(unit, M.glass, 0.68, 0.8, 0.02, 0, 0, 0.026)
      unit.position.set(-0.5 + (i % 5) * 0.25, 0.52, -0.3 + Math.floor(i / 5) * 0.3)
      unit.rotation.set(lean, (rnd(rng) - 0.5) * 0.1, 0)
      unit.visible = false
      group.add(unit)
      parts.push(unit)
    }
  } else {
    for (let i = 0; i < capacity; i++) {
      const stackN = Math.floor(i / 9)
      const k = i % 9
      const t = add(M.slate, 0.52, 0.045, 0.44, -0.45 + stackN * 0.5, 0.04 + k * 0.05, 0)
      t.rotation.y = (rnd(rng) - 0.5) * 0.1
    }
  }

  let shown = 0
  const api = {
    group,
    capacity,
    key: mat.key,
    setCount(n) {
      shown = Math.max(0, Math.min(capacity, Math.round(n)))
      for (let i = 0; i < parts.length; i++) parts[i].visible = i < shown
    },
    get count() {
      return shown
    },
  }
  api.setCount(0)
  return api
}

/**
 * The delivery drop for a material out at the edge of the plot — a big pile
 * the haulers work down and the lorry tops back up.
 */
export function buildDrop(mat, rng) {
  const group = new THREE.Group()
  const capacity = 120
  for (const z of [-0.44, 0, 0.44]) box(group, M.timberDark, 1.15, 0.07, 0.11, 0, 0.035, z)
  for (let i = 0; i < 6; i++) box(group, M.timber, 1.15, 0.035, 0.13, 0, 0.088, -0.5 + i * 0.2)
  const perRow = 5
  const perLayer = perRow * 4
  const geoFor = {
    brick: [BL, BH, BD],
    cast: [1.0, 0.07, 0.28],
    timber: [1.1, 0.09, 0.15],
    tile: [0.46, 0.045, 0.4],
    joinery: [0.86, 0.06, 0.72],
  }[mat.key]
  const matFor = { brick: null, cast: M.cast, timber: M.timber, tile: M.slate, joinery: M.joinery }[mat.key]
  const mesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(geoFor[0], geoFor[1], geoFor[2]),
    matFor || new THREE.MeshStandardMaterial({ roughness: 0.92 }),
    capacity,
  )
  mesh.castShadow = true
  mesh.receiveShadow = true
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const v = new THREE.Vector3()
  const one = new THREE.Vector3(1, 1, 1)
  const col = new THREE.Color()
  for (let i = 0; i < capacity; i++) {
    const layer = Math.floor(i / perLayer)
    const k = i % perLayer
    const row = Math.floor(k / perRow)
    const c2 = k % perRow
    const flip = layer & 1
    e.set(0, flip ? Math.PI / 2 : 0, 0)
    q.setFromEuler(e)
    v.set(flip ? -0.44 + row * 0.29 : -0.5 + c2 * 0.25,
      0.108 + layer * (geoFor[1] + 0.006) + geoFor[1] / 2,
      flip ? -0.5 + c2 * 0.25 : -0.44 + row * 0.29)
    m4.compose(v, q, one)
    mesh.setMatrixAt(i, m4)
    if (!matFor) mesh.setColorAt(i, col.setHex(COLORS.brick[(i * 7 + 3) % COLORS.brick.length]))
  }
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  group.add(mesh)
  // brick comes shrink-wrapped; everything else is banded, which reads better
  // than a translucent box round a stack of slates
  const wrap = mat.key === 'brick' ? box(group, M.wrap, 1.22, 0.9, 1.12, 0, 0.56) : null
  if (wrap) wrap.castShadow = false
  const bands = mat.key === 'brick' ? [] : [-0.34, 0.34].map((z) => box(group, M.darkSteel, 1.24, 0.05, 0.03, 0, 0.4, z))
  let shown = capacity
  void rng
  return {
    group,
    capacity,
    key: mat.key,
    setCount(n) {
      shown = Math.max(0, Math.min(capacity, Math.round(n)))
      mesh.count = shown
      if (wrap) {
        wrap.visible = shown > 12
        wrap.scale.y = Math.max(0.12, (shown / capacity) * 0.9)
        wrap.position.y = wrap.scale.y / 2 + 0.11
      }
      for (const b of bands) {
        b.visible = shown > 10
        b.position.y = 0.11 + (shown / capacity) * 0.78
      }
    },
    get count() {
      return shown
    },
  }
}

// --- wheelbarrow -----------------------------------------------------------

export function buildWheelbarrow(rng) {
  const group = new THREE.Group()
  // Origin is the grip point — about 0.72 m up when the barrow is being
  // pushed — so it can simply be parented to a robot's barrowAnchor.
  const handleL = 1.3
  for (const s of [-1, 1]) {
    const h = box(group, M.timber, 0.055, 0.055, handleL, s * 0.18, -0.02, handleL / 2)
    h.rotation.x = 0.1
  }
  const trayZ = 0.92
  const body = box(group, M.steel, 0.64, 0.28, 0.72, 0, -0.24, trayZ)
  body.rotation.x = 0.1
  box(group, M.steel, 0.68, 0.06, 0.1, 0, -0.09, trayZ - 0.32)
  // legs down to the dirt
  for (const s of [-1, 1]) box(group, M.darkSteel, 0.05, 0.34, 0.05, s * 0.18, -0.53, 0.46)
  for (const s of [-1, 1]) box(group, M.darkSteel, 0.055, 0.055, 0.36, s * 0.18, -0.69, 0.56)
  // wheel + fork
  const wheel = box(group, M.rubber, 0.3, 0.3, 0.12, 0, -0.57, trayZ + 0.5, CYL)
  wheel.rotation.z = Math.PI / 2
  const hub = box(group, M.steel, 0.12, 0.14, 0.12, 0, -0.57, trayZ + 0.5, CYL)
  hub.rotation.z = Math.PI / 2
  for (const s of [-1, 1]) box(group, M.darkSteel, 0.035, 0.4, 0.05, s * 0.1, -0.4, trayZ + 0.5)
  const tray = new THREE.Object3D()
  tray.position.set(0, -0.2, trayZ)
  tray.rotation.x = 0.1
  group.add(tray)
  void rng
  return { group, tray, wheel }
}

// --- mixer -----------------------------------------------------------------

export function buildMixer(rng) {
  const group = new THREE.Group()
  box(group, M.orange, 0.1, 0.68, 0.1, -0.28, 0.34)
  box(group, M.orange, 0.1, 0.68, 0.1, 0.28, 0.34)
  box(group, M.darkSteel, 0.78, 0.07, 0.5, 0, 0.05)
  for (const s of [-1, 1]) {
    const w = box(group, M.rubber, 0.2, 0.2, 0.07, s * 0.34, 0.1, -0.06, CYL)
    w.rotation.z = Math.PI / 2
  }
  const drumPivot = new THREE.Object3D()
  drumPivot.position.set(0, 0.78, 0.06)
  drumPivot.rotation.x = -0.5
  group.add(drumPivot)
  const drum = box(drumPivot, M.yellow, 0.52, 0.5, 0.52, 0, 0, 0, CYL)
  drum.rotation.x = Math.PI / 2
  box(drumPivot, M.yellow, 0.34, 0.16, 0.34, 0, 0, 0.3, CONE).rotation.x = -Math.PI / 2
  // mortar tub and a shovel stuck in the sand
  box(group, M.darkSteel, 0.7, 0.16, 0.5, 0.9, 0.08, 0.3)
  box(group, M.mortar, 0.62, 0.1, 0.42, 0.9, 0.13, 0.3)
  const shaft = box(group, M.timber, 0.035, 0.9, 0.035, 1.15, 0.45, 0.05)
  shaft.rotation.z = 0.3
  box(group, M.steel, 0.17, 0.24, 0.02, 1.29, 0.06, 0.05)
  let t = 0
  return {
    group,
    update(dt) {
      t += dt
      drumPivot.rotation.z = t * 1.1
    },
  }
}

// --- scaffold --------------------------------------------------------------

/**
 * The ring of tube-and-board scaffold round the house. Built as one group per
 * lift so the app can raise it as the wall grows — setDecks(0|1|2).
 */
export function buildScaffold(geom) {
  const group = new THREE.Group()
  const { rx, rz, deckW, ladder } = geom.scaffold
  const DECKS = geom.decks
  const lifts = []

  // Standards: uprights at the corners and every couple of metres along.
  const posts = []
  const stepX = (rx * 2) / 4
  const stepZ = (rz * 2) / 3
  for (let i = 0; i <= 4; i++) for (const s of [1, -1]) posts.push([-rx + i * stepX, s * rz])
  for (let i = 1; i < 3; i++) for (const s of [1, -1]) posts.push([s * rx, -rz + i * stepZ])

  for (let lift = 1; lift < DECKS.length; lift++) {
    const g = new THREE.Group()
    const y = DECKS[lift].y
    // decking — weathered boards, kept narrow so the wall stays readable
    for (const s of [1, -1]) {
      box(g, M.board, rx * 2 + deckW, 0.05, deckW, 0, y, s * rz)
      box(g, M.board, deckW, 0.05, rz * 2 - deckW, s * rx, y, 0)
    }
    // ledgers just under the boards, and a guard rail above
    for (const s of [1, -1]) {
      tubeX(g, M.darkSteel, rx * 2 + deckW, 0.028, 0, y - 0.05, s * (rz - deckW / 2 + 0.03))
      tubeX(g, M.darkSteel, rx * 2 + deckW, 0.028, 0, y - 0.05, s * (rz + deckW / 2 - 0.03))
      tubeZ(g, M.darkSteel, rz * 2, 0.028, s * (rx - deckW / 2 + 0.03), y - 0.05, 0)
      tubeZ(g, M.darkSteel, rz * 2, 0.028, s * (rx + deckW / 2 - 0.03), y - 0.05, 0)
      // guard rail on the outer edge only, so the camera keeps a clear view in
      tubeX(g, M.steel, rx * 2 + deckW, 0.022, 0, y + 0.52, s * (rz + deckW / 2))
      tubeZ(g, M.steel, rz * 2, 0.022, s * (rx + deckW / 2), y + 0.52, 0)
      // toe boards
      box(g, M.timber, rx * 2 + deckW, 0.13, 0.03, 0, y + 0.09, s * (rz + deckW / 2))
      box(g, M.timber, 0.03, 0.13, rz * 2, s * (rx + deckW / 2), y + 0.09, 0)
    }
    g.userData.deck = true
    lifts.push({ group: g, y })
    group.add(g)
  }

  // Uprights run the full height and are shown with the topmost visible lift.
  const postGroups = []
  for (let lift = 1; lift < DECKS.length; lift++) {
    const g = new THREE.Group()
    const y0 = DECKS[lift - 1].y
    const y1 = DECKS[lift].y + (lift === DECKS.length - 1 ? 0.75 : 0)
    for (const [px, pz] of posts) {
      box(g, M.steel, 0.05, y1 - y0, 0.05, px, y0 + (y1 - y0) / 2, pz, CYL)
    }
    postGroups.push(g)
    group.add(g)
  }

  // Ladder: one run per lift, leaning on the west leg.
  const ladderGroups = []
  for (let lift = 1; lift < DECKS.length; lift++) {
    const g = new THREE.Group()
    const y0 = DECKS[lift - 1].y
    const y1 = DECKS[lift].y + 0.5
    const h = y1 - y0
    for (const s of [-1, 1]) {
      box(g, M.timber, 0.045, h, 0.045, ladder.x - 0.16, y0 + h / 2, ladder.z + s * 0.19)
    }
    const rungs = Math.max(2, Math.round(h / 0.26))
    for (let r = 1; r < rungs; r++) {
      tubeZ(g, M.timber, 0.4, 0.018, ladder.x - 0.16, y0 + (h * r) / rungs, ladder.z)
    }
    ladderGroups.push(g)
    group.add(g)
  }

  let shown = -1
  function setDecks(n) {
    const v = Math.max(0, Math.min(lifts.length, Math.round(n)))
    if (v === shown) return
    shown = v
    lifts.forEach((l, i) => (l.group.visible = i < v))
    postGroups.forEach((g, i) => (g.visible = i < v))
    ladderGroups.forEach((g, i) => (g.visible = i < v))
    group.visible = v > 0
  }
  setDecks(0)
  return { group, setDecks }
}

// --- scatter props ---------------------------------------------------------

export function buildCone(rng) {
  const g = new THREE.Group()
  box(g, M.rubber, 0.34, 0.035, 0.34, 0, 0.018)
  box(g, M.orange, 0.26, 0.52, 0.26, 0, 0.28, 0, CONE)
  const band = box(g, M.white, 0.2, 0.07, 0.2, 0, 0.3, 0, CONE)
  band.scale.set(0.2, 0.09, 0.2)
  g.rotation.y = rnd(rng) * Math.PI
  return g
}

export function buildToolCrate(rng) {
  const g = new THREE.Group()
  box(g, M.timberDark, 0.72, 0.36, 0.5, 0, 0.18)
  box(g, M.timber, 0.74, 0.05, 0.52, 0, 0.02)
  const lid = box(g, M.timber, 0.72, 0.04, 0.5, 0, 0.4, -0.24)
  lid.rotation.x = -1.1
  // a couple of handles poking out
  for (let i = 0; i < 3; i++) {
    const h = box(g, M.timber, 0.03, 0.42, 0.03, -0.2 + i * 0.18, 0.5, 0.05)
    h.rotation.z = -0.3 + i * 0.25
  }
  box(g, M.steel, 0.13, 0.03, 0.2, 0.26, 0.38, 0.1)
  g.rotation.y = (rnd(rng) - 0.5) * 0.7
  return g
}

export function buildTimberStack(rng) {
  const g = new THREE.Group()
  for (const z of [-0.7, 0.7]) box(g, M.timberDark, 2.2, 0.08, 0.12, 0, 0.04, z)
  for (let layer = 0; layer < 5; layer++) {
    const n = 5 - Math.floor(layer / 2)
    for (let i = 0; i < n; i++) {
      box(g, layer & 1 ? M.timber : M.timberDark, 2.2, 0.09, 0.15,
        0, 0.09 + layer * 0.1, -0.4 + i * 0.2 + (rnd(rng) - 0.5) * 0.02)
    }
  }
  for (const x of [-0.7, 0.7]) box(g, M.darkSteel, 0.02, 0.56, 0.9, x, 0.3)
  g.rotation.y = (rnd(rng) - 0.5) * 0.3
  return g
}

export function buildDumpster(rng) {
  const g = new THREE.Group()
  const body = box(g, M.yellow, 2.1, 0.86, 1.25, 0, 0.5)
  body.material = new THREE.MeshStandardMaterial({ color: 0xb8892a, roughness: 0.75, metalness: 0.25 })
  for (const s of [-1, 1]) box(g, M.darkSteel, 2.14, 0.09, 0.09, 0, 0.93, s * 0.6)
  for (const s of [-1, 1]) box(g, M.darkSteel, 0.09, 0.9, 0.09, s * 1.0, 0.5, 0)
  box(g, M.darkSteel, 2.2, 0.12, 1.3, 0, 0.06)
  // rubble
  for (let i = 0; i < 14; i++) {
    const m = box(g, i % 3 ? M.grit : M.timberDark, 0.16 + rnd(rng) * 0.2, 0.1, 0.14,
      (rnd(rng) - 0.5) * 1.7, 0.9 + rnd(rng) * 0.14, (rnd(rng) - 0.5) * 0.9)
    m.rotation.set(rnd(rng), rnd(rng) * 3, rnd(rng))
  }
  return g
}

export function buildPrivy(rng) {
  const g = new THREE.Group()
  const shell = new THREE.MeshStandardMaterial({ color: 0x3f8f6d, roughness: 0.55 })
  box(g, shell, 0.94, 2.06, 0.94, 0, 1.03)
  box(g, shell, 1.02, 0.08, 1.02, 0, 2.08)
  box(g, M.white, 0.62, 1.5, 0.02, 0, 0.85, 0.48)
  box(g, new THREE.MeshStandardMaterial({ color: 0x2a3a44, roughness: 0.4 }), 0.4, 0.22, 0.02, 0, 1.72, 0.49)
  box(g, M.darkSteel, 0.06, 0.06, 0.03, 0.24, 0.95, 0.5)
  g.rotation.y = (rnd(rng) - 0.5) * 0.5
  return g
}

export function buildSpoilHeap(rng) {
  const g = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const r = 1.5 - i * 0.32
    const c = box(g, i === 1 ? M.grit : M.sand, r * 2, 0.5 + i * 0.16, r * 2, (rnd(rng) - 0.5) * 0.5, 0, (rnd(rng) - 0.5) * 0.5, CONE)
    c.position.y = (0.5 + i * 0.16) / 2
    c.receiveShadow = true
  }
  return g
}

/**
 * The side garden that comes with The Little Stack — laid out on the left of
 * the house, and only turfed once the place is handed over. Lawn, a clipped
 * hedge round three sides, a bed of flowers under the gable window and a
 * couple of shrubs.
 */
export function buildGarden(geom, rng) {
  const g = new THREE.Group()
  const lawn = new THREE.MeshStandardMaterial({ color: 0x6f9a4e, roughness: 1 })
  const hedge = new THREE.MeshStandardMaterial({ color: 0x3f6b39, roughness: 0.98 })
  const bark = new THREE.MeshStandardMaterial({ color: 0x6b5236, roughness: 0.95 })
  const soil = new THREE.MeshStandardMaterial({ color: 0x5a4029, roughness: 1 })
  const stone = new THREE.MeshStandardMaterial({ color: 0xbdb6a6, roughness: 0.94 })

  const W = 3.6
  const D = geom.d + 1.2
  const cx = -(geom.w / 2 + W / 2 + 0.35)

  const turf = box(g, lawn, W, 0.06, D, cx, 0.03)
  turf.castShadow = false
  turf.receiveShadow = true

  // clipped hedge along the three open sides
  const seg = (sx, sz, x, z) => {
    const h = box(g, hedge, sx, 0.62, sz, x, 0.31, z)
    h.receiveShadow = true
  }
  seg(W, 0.3, cx, -D / 2 + 0.15)
  seg(W, 0.3, cx, D / 2 - 0.15)
  seg(0.3, D, cx - W / 2 + 0.15, 0)

  // stepping stones from the front of the plot up the side of the house
  for (let i = 0; i < 5; i++) {
    const s = box(g, stone, 0.52, 0.05, 0.46,
      cx + W / 2 - 0.8 + (rnd(rng) - 0.5) * 0.2, 0.06, D / 2 - 0.9 - i * (D - 1.8) / 4)
    s.rotation.y = (rnd(rng) - 0.5) * 0.3
    s.castShadow = false
  }

  // a flower bed against the gable wall
  const bedZ = -0.4
  box(g, soil, 1.5, 0.1, 1.9, cx + W / 2 - 0.75, 0.08, bedZ).castShadow = false
  const blooms = [0xe4585e, 0xf0c04a, 0xd57ac4, 0xffffff]
  for (let i = 0; i < 10; i++) {
    const px = cx + W / 2 - 1.35 + rnd(rng) * 1.2
    const pz = bedZ - 0.8 + rnd(rng) * 1.6
    box(g, new THREE.MeshStandardMaterial({ color: 0x4c7a3c, roughness: 1 }), 0.05, 0.26, 0.05, px, 0.24, pz)
    box(g, new THREE.MeshStandardMaterial({ color: blooms[(rnd(rng) * blooms.length) | 0], roughness: 0.9 }),
      0.17, 0.13, 0.17, px, 0.42, pz)
  }

  // two shrubs on the lawn
  for (const [sx, sz, sc] of [[-0.9, D / 2 - 2.0, 1], [-0.5, -D / 2 + 1.9, 0.78]]) {
    const t = box(g, bark, 0.14, 0.44, 0.14, cx + sx, 0.22, sz)
    t.castShadow = true
    const crown = box(g, hedge, 1.1 * sc, 1.0 * sc, 1.1 * sc, cx + sx, 0.44 + 0.5 * sc, sz, CONE)
    crown.castShadow = true
  }

  return g
}

/**
 * The gang leader's copy of the drawing: a rolled tube that opens out into a
 * sheet when it is held up for the gang to look at. `setOpen(k)` runs it from
 * rolled (0) to flat (1); the roll rides the leading edge the way it does on
 * the big sheet in the UI.
 */
export function buildDrawing() {
  const g = new THREE.Group()
  const cv = document.createElement('canvas')
  cv.width = 256
  cv.height = 176
  const c = cv.getContext('2d')
  c.fillStyle = '#0d3f60'
  c.fillRect(0, 0, 256, 176)
  c.strokeStyle = 'rgba(214,234,247,0.75)'
  c.lineWidth = 2
  c.strokeRect(10, 10, 236, 156)
  // a scribble of a house: elevation on the left, plan on the right
  c.lineWidth = 1.6
  c.strokeStyle = '#e4f0f8'
  c.strokeRect(28, 74, 78, 62)
  c.beginPath()
  c.moveTo(22, 74)
  c.lineTo(67, 42)
  c.lineTo(112, 74)
  c.stroke()
  c.strokeRect(44, 96, 18, 22)
  c.strokeRect(76, 96, 18, 18)
  c.strokeStyle = 'rgba(214,234,247,0.5)'
  c.strokeRect(140, 56, 86, 76)
  c.strokeRect(150, 66, 66, 56)
  for (let i = 0; i < 5; i++) {
    c.beginPath()
    c.moveTo(140, 142 + i * 6)
    c.lineTo(140 + 40 + (i % 3) * 22, 142 + i * 6)
    c.stroke()
  }
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace

  const sheet = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.44),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.88, side: THREE.DoubleSide }),
  )
  // pivot on the left edge so it unrolls to the right
  sheet.geometry.translate(0.31, 0, 0)
  sheet.position.set(-0.31, 0, 0)
  g.add(sheet)

  const roll = box(g, M.white, 0.05, 0.5, 0.05, 0.31, 0, 0.01, CYL)
  roll.rotation.x = Math.PI / 2
  roll.rotation.z = Math.PI / 2

  g.visible = false
  return {
    group: g,
    setOpen(k) {
      const t = Math.max(0, Math.min(1, k))
      g.visible = t > 0.01
      sheet.scale.x = Math.max(0.02, t)
      roll.position.x = -0.31 + 0.62 * t
      roll.visible = t < 0.98
    },
  }
}

/**
 * The merchant's flatbed. Loaded in the yard, driven to whichever plot is
 * being built, and unloaded into the drops by the shift on site — the same
 * vehicle either end, because it is the same vehicle.
 */
export function buildFlatbed() {
  const g = new THREE.Group()
  const cab = new THREE.MeshStandardMaterial({ color: 0x2f6fd8, roughness: 0.5, metalness: 0.2 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x454b52, roughness: 0.6, metalness: 0.4 })
  // cab at the front, facing +z
  box(g, cab, 2.2, 1.7, 2.0, 0, 1.5, 2.4)
  box(g, dark, 1.9, 0.7, 0.12, 0, 1.9, 3.42)
  box(g, dark, 2.3, 0.5, 2.1, 0, 0.45, 2.4)
  // bed
  box(g, dark, 2.4, 0.3, 5.0, 0, 0.72, -0.7)
  box(g, M.ply, 2.3, 0.1, 4.9, 0, 0.92, -0.7)
  for (const s of [-1, 1]) box(g, M.steel, 0.1, 0.5, 4.9, s * 1.15, 1.2, -0.7)
  box(g, M.steel, 2.4, 0.5, 0.1, 0, 1.2, -3.15)
  for (const [x, z] of [[-1.15, 2.3], [1.15, 2.3], [-1.15, -1.4], [1.15, -1.4], [-1.15, -2.6], [1.15, -2.6]]) {
    box(g, M.rubber, 0.34, 0.9, 0.9, x, 0.45, z)
  }
  const loadAnchor = new THREE.Group()
  loadAnchor.position.set(0, 0.97, -0.7)
  g.add(loadAnchor)
  g.userData.flatbed = true
  /** Where the next pallet goes on the bed. */
  const slot = (i) => ({ x: ((i % 2) - 0.5) * 1.0, y: 0, z: 1.5 - Math.floor(i / 2) * 1.15 })
  return { group: g, loadAnchor, slot }
}

export function buildSign(text) {
  const g = new THREE.Group()
  const cv = document.createElement('canvas')
  cv.width = 512
  cv.height = 256
  const c = cv.getContext('2d')
  c.fillStyle = '#d8b071'
  c.fillRect(0, 0, 512, 256)
  // plywood grain
  c.strokeStyle = 'rgba(120,80,40,0.16)'
  for (let i = 0; i < 60; i++) {
    c.beginPath()
    c.moveTo(0, i * 4.6 + Math.sin(i) * 3)
    c.bezierCurveTo(170, i * 4.6 + 6, 340, i * 4.6 - 6, 512, i * 4.6 + Math.cos(i) * 3)
    c.stroke()
  }
  c.fillStyle = '#22282c'
  c.fillRect(16, 16, 480, 224)
  c.fillStyle = '#d8b071'
  c.fillRect(24, 24, 464, 208)
  c.fillStyle = '#1d2226'
  c.textAlign = 'center'
  const lines = String(text).split('\n')
  lines.forEach((ln, i) => {
    c.font = `${i === 0 ? 'bold 58' : '34'}px ui-monospace, Menlo, Consolas, monospace`
    c.fillText(ln, 256, 108 + i * 52)
  })
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 })
  for (const s of [-1, 1]) box(g, M.timberDark, 0.08, 1.5, 0.08, s * 0.62, 0.75)
  const board = box(g, face, 1.6, 0.8, 0.05, 0, 1.2, 0.04)
  board.material = face
  return g
}

// --- fit-out and decorating ------------------------------------------------

/**
 * The carpenter's lorry. Drives in when the house tops out, drops its tailgate,
 * and the gang unloads it one piece at a time.
 */
export function buildTruck(rng) {
  const group = new THREE.Group()
  const body = new THREE.MeshStandardMaterial({ color: 0x2f6f4f, roughness: 0.5, metalness: 0.3 })
  const trim = new THREE.MeshStandardMaterial({ color: 0xe6e2d6, roughness: 0.55 })
  const glass = new THREE.MeshStandardMaterial({ color: 0x8fb6cc, roughness: 0.12, metalness: 0.5 })

  // cab up front (+Z), flatbed behind
  box(group, body, 2.0, 1.25, 1.9, 0, 1.28, 2.2)
  box(group, glass, 1.82, 0.62, 0.06, 0, 1.6, 3.13)
  for (const s of [-1, 1]) box(group, glass, 0.06, 0.55, 1.2, s * 1.0, 1.58, 2.35)
  box(group, body, 2.1, 0.28, 0.4, 0, 0.72, 3.2)
  box(group, M.darkSteel, 2.14, 0.16, 0.22, 0, 0.5, 3.32)
  // chassis + bed
  box(group, M.darkSteel, 1.9, 0.22, 5.6, 0, 0.56, 0)
  box(group, M.timberDark, 2.16, 0.12, 3.7, 0, 0.72, -0.6)
  for (const s of [-1, 1]) box(group, body, 0.1, 0.62, 3.7, s * 1.08, 1.03, -0.6)
  box(group, body, 2.16, 0.62, 0.1, 0, 1.03, 1.2)
  // wheels
  for (const s of [-1, 1]) {
    for (const z of [2.1, -0.6, -1.7]) {
      const w = box(group, M.rubber, 0.72, 0.72, 0.3, s * 1.02, 0.4, z, CYL)
      w.rotation.z = Math.PI / 2
      const h = box(group, trim, 0.32, 0.32, 0.32, s * 1.14, 0.4, z, CYL)
      h.rotation.z = Math.PI / 2
    }
  }
  // painted board on the flank
  const cv = document.createElement('canvas')
  cv.width = 512
  cv.height = 128
  const c = cv.getContext('2d')
  c.fillStyle = '#2f6f4f'
  c.fillRect(0, 0, 512, 128)
  c.fillStyle = '#f2ead6'
  c.font = 'bold 52px ui-monospace, Menlo, Consolas, monospace'
  c.textAlign = 'center'
  c.fillText('JOINERY & FIT-OUT', 256, 76)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  for (const s of [-1, 1]) {
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.62), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }))
    sign.position.set(s * 1.09, 1.02, -0.6)
    sign.rotation.y = s * Math.PI / 2
    group.add(sign)
  }

  // tailgate, hinged at the back of the bed
  const gate = new THREE.Group()
  gate.position.set(0, 0.72, -2.45)
  group.add(gate)
  box(gate, body, 2.16, 0.09, 1.1, 0, 0, -0.55)
  box(gate, M.darkSteel, 2.2, 0.13, 0.1, 0, 0.02, -1.06)
  gate.rotation.x = 0

  void rng
  return {
    group,
    /** 0 = shut and upright, 1 = dropped flat. */
    setGate(open) {
      gate.rotation.x = -Math.PI / 2 * (1 - open)
    },
    /** Where a robot stands to take the next piece off the back. */
    loadPoint: { x: 0, z: -3.4 },
  }
}

const FURN_MATS = new Map()
function furnMat(color) {
  let m = FURN_MATS.get(color)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.78 })
    FURN_MATS.set(color, m)
  }
  return m
}

/**
 * One piece of furniture. Origin on the floor at its centre, so it can be
 * parented straight onto a robot's hands or set down on the boards.
 */
/**
 * What a piece of furniture can be swapped for once the house is handed over
 * and somebody starts rearranging it. Sizes go with the kind — a bed is not a
 * lamp with different geometry.
 */
export const FURNITURE_KINDS = [
  { name: 'sofa', size: [1.4, 0.62, 0.62], color: 0x6d7f9c },
  { name: 'table', size: [0.95, 0.58, 0.68], color: 0xa9763f },
  { name: 'chair', size: [0.4, 0.8, 0.4], color: 0x8f5f33 },
  { name: 'bed', size: [1.2, 0.5, 1.8], color: 0xc4b9a6 },
  { name: 'wardrobe', size: [0.95, 1.7, 0.52], color: 0x7c5535 },
  { name: 'bookcase', size: [0.85, 1.4, 0.34], color: 0x96683c },
  { name: 'lamp', size: [0.3, 1.3, 0.3], color: 0xe0c98a },
]

/** Finishes you can put a piece in. */
export const FURNITURE_COLORS = [
  0x7c5535, 0xa9763f, 0x6d7f9c, 0xc4b9a6, 0x8a9c7a, 0xb0796f, 0xe0c98a, 0x5d5f68,
]

export function buildFurniture(spec) {
  const g = new THREE.Group()
  const [w, h, d] = spec.size
  const mat = furnMat(spec.color)
  const dark = furnMat(0x4c4238)
  switch (spec.name) {
    case 'sofa':
      box(g, mat, w, h * 0.45, d, 0, h * 0.34, 0)
      box(g, mat, w, h * 0.8, d * 0.28, 0, h * 0.55, -d * 0.36)
      for (const s of [-1, 1]) box(g, mat, w * 0.1, h * 0.62, d, s * w * 0.45, h * 0.5, 0)
      for (const s of [-1, 1]) for (const z of [-1, 1]) box(g, dark, 0.07, h * 0.2, 0.07, s * w * 0.4, h * 0.1, z * d * 0.36)
      break
    case 'table':
      box(g, mat, w, 0.07, d, 0, h - 0.035, 0)
      for (const s of [-1, 1]) for (const z of [-1, 1]) box(g, dark, 0.08, h - 0.07, 0.08, s * (w / 2 - 0.1), (h - 0.07) / 2, z * (d / 2 - 0.1))
      break
    case 'chair':
      box(g, mat, w, 0.06, d, 0, h * 0.52, 0)
      box(g, mat, w, h * 0.46, 0.06, 0, h * 0.76, -d * 0.44)
      for (const s of [-1, 1]) for (const z of [-1, 1]) box(g, dark, 0.05, h * 0.52, 0.05, s * (w / 2 - 0.05), h * 0.26, z * (d / 2 - 0.05))
      break
    case 'bed':
      box(g, mat, w, h * 0.42, d, 0, h * 0.5, 0)
      box(g, furnMat(0xe8e2d4), w * 0.94, h * 0.2, d * 0.62, 0, h * 0.78, d * 0.14)
      box(g, dark, w, h * 0.9, 0.08, 0, h * 0.6, -d / 2)
      for (const s of [-1, 1]) for (const z of [-1, 1]) box(g, dark, 0.09, h * 0.3, 0.09, s * (w / 2 - 0.07), h * 0.15, z * (d / 2 - 0.07))
      break
    case 'wardrobe':
      box(g, mat, w, h, d, 0, h / 2, 0)
      box(g, dark, w * 0.02, h * 0.9, d * 0.04, 0, h / 2, d / 2 + 0.01)
      for (const s of [-1, 1]) box(g, furnMat(0xd8c07a), 0.05, 0.05, 0.05, s * 0.09, h * 0.5, d / 2 + 0.03, SPH)
      break
    case 'bookcase':
      box(g, mat, w, h, d, 0, h / 2, 0)
      for (let i = 1; i < 4; i++) box(g, dark, w * 0.94, 0.03, d * 0.9, 0, (h * i) / 4, 0.01)
      for (let i = 0; i < 9; i++) {
        box(g, furnMat([0xb4523a, 0x3f6f8f, 0x6f8f4f][i % 3]),
          0.05, 0.2, d * 0.6, -w * 0.36 + i * 0.09, h * 0.62, 0)
      }
      break
    default: // lamp
      box(g, dark, 0.28, 0.04, 0.28, 0, 0.02, 0, CYL)
      box(g, dark, 0.05, h - 0.3, 0.05, 0, (h - 0.3) / 2, 0, CYL)
      box(g, furnMat(0xf2e4b8), 0.34, 0.3, 0.34, 0, h - 0.15, 0, CONE)
      break
  }
  g.traverse((o) => {
    if (o.isMesh) o.castShadow = true
  })
  return g
}

/** A decorator's roller on a pole. Held out in front while painting. */
export function buildRoller(color) {
  const g = new THREE.Group()
  box(g, M.timber, 0.035, 0.9, 0.035, 0, 0.45, 0)
  box(g, M.darkSteel, 0.03, 0.18, 0.03, 0, 0.96, 0)
  const sleeve = box(g, furnMat(color), 0.09, 0.26, 0.09, 0, 1.06, 0, CYL)
  sleeve.rotation.z = Math.PI / 2
  return g
}

/** A paint kettle the decorators carry about. */
export function buildPaintTin(color) {
  const g = new THREE.Group()
  box(g, M.steel, 0.24, 0.26, 0.24, 0, 0.13, 0, CYL)
  box(g, furnMat(color), 0.21, 0.03, 0.21, 0, 0.27, 0, CYL)
  const handle = box(g, M.darkSteel, 0.26, 0.02, 0.02, 0, 0.34, 0)
  handle.rotation.z = 0
  return g
}

/**
 * The arrow painted on the tarmac. `dir` is -1 to send you up the road and +1
 * to send you down it — baked into the artwork rather than flipped afterwards,
 * so the post-mounted sign and the paint always point the same way.
 */
export function buildRoadArrow(label, dir) {
  const g = new THREE.Group()
  const cv = document.createElement('canvas')
  cv.width = 512
  cv.height = 256
  const c = cv.getContext('2d')
  c.fillStyle = '#2b2f34'
  c.fillRect(0, 0, 512, 256)
  c.save()
  // the chevron below is drawn pointing left, so +1 is the one that mirrors
  if (dir > 0) {
    c.translate(512, 0)
    c.scale(-1, 1)
  }
  c.fillStyle = '#f0b429'
  c.beginPath()
  c.moveTo(120, 128); c.lineTo(250, 40); c.lineTo(250, 92)
  c.lineTo(400, 92); c.lineTo(400, 164); c.lineTo(250, 164)
  c.lineTo(250, 216); c.closePath()
  c.fill()
  c.restore()
  c.fillStyle = '#f0b429'
  c.font = 'bold 40px ui-monospace, Menlo, Consolas, monospace'
  c.textAlign = 'center'
  c.fillText(label, 256, 246)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 2.2),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, transparent: true }),
  )
  plate.rotation.x = -Math.PI / 2
  // clear of the yard's concrete pad, which is laid over the tarmac
  plate.position.y = 0.09
  plate.receiveShadow = true
  g.add(plate)
  // an invisible slab that is easy to hit with a finger
  const hit = box(g, new THREE.MeshBasicMaterial({ visible: false }), 5.0, 1.4, 3.0, 0, 0.7, 0)
  hit.castShadow = false
  hit.receiveShadow = false
  // a post-mounted sign so it reads from a low camera too
  const post = new THREE.Group()
  post.position.set(0, 0, -2.0)
  g.add(post)
  box(post, M.darkSteel, 0.08, 1.5, 0.08, 0, 0.75, 0)
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(2.0, 1.0),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide }),
  )
  board.position.set(0, 1.75, 0)
  post.add(board)
  return { group: g, hit, plate }
}

