// ---------------------------------------------------------------------------
// Site kit: everything that isn't the ground, the house or the crew.
//
// Each builder returns a Group whose origin sits on the ground and which faces
// +Z, so the caller only ever has to set position and rotation.y. The two piles
// (pallet and supply stack) expose setCount() and are drawn with InstancedMesh,
// because they change every few seconds and there are hundreds of bricks in them.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { BRICK, MORTAR, STACK_CAP, SCAFFOLD, DECKS, COLORS } from './config.js'

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

export function buildSupplyPile(rng) {
  const group = new THREE.Group()
  const capacity = STACK_CAP
  box(group, M.ply, 1.7, 0.03, 1.3, 0, 0.015)
  const perRow = 6
  const perLayer = perRow * 2
  // Hand-stacked, so everything is a degree or two out.
  const jitter = []
  for (let i = 0; i < capacity; i++) jitter.push([(rnd(rng) - 0.5) * 0.05, (rnd(rng) - 0.5) * 0.16, (rnd(rng) - 0.5) * 0.05])
  const pile = brickPile(
    capacity,
    (i) => {
      const layer = Math.floor(i / perLayer)
      const k = i % perLayer
      const row = Math.floor(k / perRow)
      const col = k % perRow
      const j = jitter[i]
      return {
        x: -0.72 + col * 0.28 + j[0],
        y: 0.03 + layer * (BH + 0.008) + BH / 2,
        z: -0.24 + row * 0.48 + j[2],
        ry: j[1],
      }
    },
    rng,
  )
  group.add(pile)
  let shown = 0
  const api = {
    group,
    capacity,
    setCount(n) {
      shown = Math.max(0, Math.min(capacity, Math.round(n)))
      pile.count = shown
    },
    get count() {
      return shown
    },
  }
  api.setCount(0)
  return api
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
export function buildScaffold() {
  const group = new THREE.Group()
  const { rx, rz, deckW, ladder } = SCAFFOLD
  const lifts = []
  const topY = DECKS[DECKS.length - 1].y

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
  void topY
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
