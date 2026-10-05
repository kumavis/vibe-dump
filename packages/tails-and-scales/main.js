import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  BOARD, ENGAGE, CHARGE_RANGE, OBJECTIVE_RANGE, ROUNDS, AURA, SIDES, PHASES, TYPES, ARMIES,
  roll, passes, woundNeed, saveNeed, hitNeed, attackCount, expected, p2D6, pD6, d6,
} from './rules.js'
import { NavGrid, pathLength } from './nav.js'
import { Scenery } from './scenery.js'
import { FX } from './fx.js'
import { buildModel, M } from './models.js'
import { clock, tween, wait, stepTweens, easeOut, easeInOut, wrapAngle, lerp } from './util.js'
import { aiPhase } from './ai.js'
import { sfx, unlock, toggleMute, isMuted } from './sfx.js'
import { rng, seedLogic, rngState } from './rng.js'

// ---------------------------------------------------------------------------
// Tails & Scales — a pocket-sized Warhammer.
//
// Two armies, alternating player turns, each turn run through five phases:
// Movement → Shooting → Charge → Fight → Morale. Units are squads of models
// that move as a disc; every attack is rolled hit → wound → save → damage and
// the dice are shown. Blast weapons drop a template that can scatter, hurts
// whoever is underneath (friends included) and breaks the scenery.
//
// This file is the table: scene, units, the actions both a human and the AI
// call, the turn loop, and the UI. Rules data lives in rules.js, movement in
// nav.js, the battlefield in scenery.js, the AI in ai.js.
// ---------------------------------------------------------------------------

const { W, H } = BOARD
const $ = (s) => document.querySelector(s)
const params = new URLSearchParams(location.search)

// ── Renderer, camera, light ─────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(params.has('lowfi') ? 0.5 : Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
renderer.shadowMap.enabled = !params.has('lowfi')
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
document.body.prepend(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#1c1712')
scene.fog = new THREE.Fog('#1c1712', 70, 140)

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 400)
camera.position.set(0, 30, 31)
const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0, 1.5)
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.maxPolarAngle = 1.32
controls.minDistance = 5
controls.maxDistance = 75
controls.screenSpacePanning = false
controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }

scene.add(new THREE.HemisphereLight('#d6e6ff', '#3b2a1a', 0.85))
const sun = new THREE.DirectionalLight('#fff0d6', 2.3)
sun.position.set(-16, 34, 20)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
Object.assign(sun.shadow.camera, { left: -27, right: 27, top: 22, bottom: -22, near: 5, far: 90 })
sun.shadow.bias = -0.0004
sun.shadow.normalBias = 0.02
scene.add(sun)
const fill = new THREE.DirectionalLight('#9fb8ff', 0.35)
fill.position.set(18, 12, -16)
scene.add(fill)

const overlayEl = $('#labels')
const fx = new FX(scene, camera, overlayEl)

// ── The table ───────────────────────────────────────────────────────────────
function paintMat() {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = Math.round((2048 * H) / W)
  const g = c.getContext('2d')
  g.fillStyle = '#5b7a36'
  g.fillRect(0, 0, c.width, c.height)
  const blot = (cols, n, rmin, rmax, alpha) => {
    for (let i = 0; i < n; i++) {
      g.globalAlpha = alpha * (0.4 + Math.random() * 0.6)
      g.fillStyle = cols[(Math.random() * cols.length) | 0]
      g.beginPath()
      g.ellipse(Math.random() * c.width, Math.random() * c.height, rmin + Math.random() * (rmax - rmin), rmin + Math.random() * (rmax - rmin), Math.random() * 3, 0, Math.PI * 2)
      g.fill()
    }
  }
  blot(['#6a8a40', '#4f6c2c', '#729347', '#55742f', '#7f964c'], 700, 20, 90, 0.35)
  blot(['#7d6b45', '#6e5d3a', '#8a7650'], 40, 30, 110, 0.22)
  blot(['#8fa65a', '#a4b46a'], 300, 4, 14, 0.4)
  for (let i = 0; i < 14000; i++) {
    g.globalAlpha = 0.35
    g.fillStyle = Math.random() < 0.5 ? '#3f5a24' : '#8fae5a'
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 2, 4 + Math.random() * 4)
  }
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return t
}
function paintWood() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#4a3020'
  g.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 260; i++) {
    g.strokeStyle = Math.random() < 0.5 ? 'rgba(30,18,10,0.35)' : 'rgba(110,70,40,0.25)'
    g.lineWidth = 1 + Math.random() * 3
    const y = Math.random() * 512
    g.beginPath()
    g.moveTo(0, y)
    for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 4)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(6, 6)
  return t
}

const boardMat = new THREE.MeshStandardMaterial({ map: paintMat(), roughness: 0.95 })
const board = new THREE.Mesh(new THREE.PlaneGeometry(W, H).rotateX(-Math.PI / 2), boardMat)
board.receiveShadow = true
scene.add(board)
const table = new THREE.Mesh(new THREE.PlaneGeometry(220, 220).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: paintWood(), roughness: 0.7 }))
table.position.y = -0.62
table.receiveShadow = true
scene.add(table)
{
  const frameMat = new THREE.MeshStandardMaterial({ color: '#5a3a22', roughness: 0.6 })
  const parts = [
    [W + 1.6, 0.8, 0.8, 0, -H / 2 - 0.4],
    [W + 1.6, 0.8, 0.8, 0, H / 2 + 0.4],
    [0.8, 0.8, H, -W / 2 - 0.4, 0],
    [0.8, 0.8, H, W / 2 + 0.4, 0],
  ]
  for (const [w, h, d, x, z] of parts) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat)
    m.position.set(x, -0.22, z)
    m.castShadow = m.receiveShadow = true
    scene.add(m)
  }
  const under = new THREE.Mesh(new THREE.BoxGeometry(W, 0.6, H), frameMat)
  under.position.y = -0.31
  scene.add(under)
}

// deployment zones
const zoneMats = []
for (const s of [0, 1]) {
  const sx = s === 0 ? -1 : 1
  const mat = new THREE.MeshBasicMaterial({ color: SIDES[s].color, transparent: true, opacity: 0.07, depthWrite: false })
  zoneMats.push(mat)
  const z = new THREE.Mesh(new THREE.PlaneGeometry(BOARD.deploy, H).rotateX(-Math.PI / 2), mat)
  z.position.set(sx * (W / 2 - BOARD.deploy / 2), 0.008, 0)
  z.renderOrder = 1
  scene.add(z)
  const pts = []
  for (let zz = -H / 2; zz < H / 2; zz += 1) pts.push(new THREE.Vector3(sx * (W / 2 - BOARD.deploy), 0.02, zz), new THREE.Vector3(sx * (W / 2 - BOARD.deploy), 0.02, zz + 0.5))
  const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: SIDES[s].color, transparent: true, opacity: 0.5 }))
  scene.add(line)
}

// grass tufts and flowers, purely for looks
const tufts = new THREE.InstancedMesh(new THREE.ConeGeometry(0.035, 0.13, 3), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1 }), 700)
const flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.05, 0), new THREE.MeshStandardMaterial({ roughness: 0.6 }), 140)
scene.add(tufts, flowers)
function scatterTufts() {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler()
  const col = new THREE.Color()
  for (let i = 0; i < tufts.count; i++) {
    const x = (Math.random() - 0.5) * (W - 0.4), z = (Math.random() - 0.5) * (H - 0.4)
    const s = 0.6 + Math.random() * 1.2
    q.setFromEuler(e.set((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5))
    m.compose(new THREE.Vector3(x, 0.08 * s, z), q, new THREE.Vector3(s, s, s))
    tufts.setMatrixAt(i, m)
    tufts.setColorAt(i, col.set(['#9cba5a', '#a8c464', '#b4c86e', '#8fae50'][i % 4]))
  }
  const fc = ['#f4f0e0', '#f2d14a', '#d77ad0', '#e8e8ff']
  for (let i = 0; i < flowers.count; i++) {
    const x = (Math.random() - 0.5) * (W - 0.4), z = (Math.random() - 0.5) * (H - 0.4)
    m.compose(new THREE.Vector3(x, 0.08, z), q.identity(), new THREE.Vector3(1, 0.6, 1))
    flowers.setMatrixAt(i, m)
    flowers.setColorAt(i, col.set(fc[i % fc.length]))
  }
  tufts.instanceMatrix.needsUpdate = flowers.instanceMatrix.needsUpdate = true
  tufts.instanceColor.needsUpdate = flowers.instanceColor.needsUpdate = true
}

// ── Objectives ──────────────────────────────────────────────────────────────
const OBJ_POS = [
  { x: 0, z: 0 },
  { x: -9, z: 8 },
  { x: 9, z: -8 },
  { x: -9, z: -8 },
  { x: 9, z: 8 },
]
const objectives = OBJ_POS.map((p, i) => {
  const g = new THREE.Group()
  g.position.set(p.x, 0, p.z)
  const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.16, 8), M('#8a8478'))
  stone.position.y = 0.08
  stone.castShadow = stone.receiveShadow = true
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), new THREE.MeshStandardMaterial({ color: '#fff3c0', emissive: '#ffd060', emissiveIntensity: 0.8, flatShading: true }))
  gem.position.y = 0.42
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.1, 6), M('#5a3d24'))
  pole.position.set(0.35, 1.1, 0)
  pole.castShadow = true
  const flagMat = new THREE.MeshStandardMaterial({ color: '#e8e0d0', side: THREE.DoubleSide, roughness: 0.8 })
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5, 6, 1).translate(0.4, 0, 0), flagMat)
  flag.position.set(0.35, 1.85, 0)
  flag.castShadow = true
  const ring = new THREE.Mesh(new THREE.RingGeometry(OBJECTIVE_RANGE - 0.06, OBJECTIVE_RANGE, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#fff3c0', transparent: true, opacity: 0.35, depthWrite: false }))
  ring.position.y = 0.03
  g.add(stone, gem, pole, flag, ring)
  scene.add(g)
  return { ...p, i, g, gem, flag, flagMat, ring, owner: -1 }
})

// ── Scenery & navigation ────────────────────────────────────────────────────
const scenery = new Scenery(scene, fx, W, H)
const nav = new NavGrid(W, H, 0.5)
scenery.onBreak = (c) => {
  if (c.kind === 'block') sfx.crumble()
  else sfx.thwack()
}
function refreshNav() {
  if (!scenery.dirty) return
  scenery.dirty = false
  nav.rebuild(scenery.chunks)
}

// ── Game state ──────────────────────────────────────────────────────────────
const S = {
  seed: Number(params.get('seed')) || ((Math.random() * 1e6) | 0),
  stage: 'title', // title | deploy | battle | over
  control: ['human', 'ai'],
  round: 1,
  active: 0,
  first: 0,
  phase: 'move',
  vp: [0, 0],
  busy: false,
  sel: null,
  reach: null,
  hover: null,
  follow: true,
  pendingLog: [],
}
let units = []
let nextUnitId = 1

const alive = (u) => u.alive > 0
const enemiesOf = (u) => units.filter((e) => e.side !== u.side && alive(e))
const friendsOf = (u) => units.filter((e) => e.side === u.side && alive(e) && e !== u)
const dist = (a, b) => Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z)
const gap = (a, b) => dist(a, b) - a.r - b.r
const engagedWith = (u) => enemiesOf(u).filter((e) => gap(u, e) <= ENGAGE + 0.05)
// Where a model stands as far as the rules are concerned: its slot in the
// formation, not wherever its mesh has animated to this frame.
const mx = (u, m) => u.pos.x + m.ox
const mz = (u, m) => u.pos.z + m.oz
const isEngaged = (u) => engagedWith(u).length > 0
const human = (side) => S.control[side] === 'human'

// ── Units ───────────────────────────────────────────────────────────────────
// Formation: one model in the middle and the rest in a ring, or a plain ring
// for small squads. Recomputed as models fall so squads close ranks.
function formation(n, base) {
  const sp = base * 2 + 0.16
  if (n === 1) return [[0, 0]]
  if (n <= 4) {
    const R = n === 2 ? sp / 2 : sp / (2 * Math.sin(Math.PI / n))
    return Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2 + 0.4) * R, Math.sin((i / n) * Math.PI * 2 + 0.4) * R])
  }
  const k = n - 1
  const R = Math.max(sp, sp / (2 * Math.sin(Math.PI / k)))
  return [[0, 0], ...Array.from({ length: k }, (_, i) => [Math.cos((i / k) * Math.PI * 2 + 0.3) * R, Math.sin((i / k) * Math.PI * 2 + 0.3) * R])]
}

function makeUnit(key, side) {
  const t = TYPES[key]
  const u = {
    id: nextUnitId++, key, t, side, name: t.name,
    pos: { x: 0, z: 0 }, facing: side === 0 ? Math.PI / 2 : -Math.PI / 2,
    models: [], alive: t.models, r: 0, flags: {}, lost: 0, mesmerized: false, moving: false,
  }
  for (let i = 0; i < t.models; i++) {
    const mesh = buildModel(key, t, SIDES[side].color)
    scene.add(mesh)
    u.models.push({ mesh, w: t.W, alive: true, ox: 0, oz: 0, x: 0, z: 0, yaw: u.facing, lunge: 0, lungeDir: 0, lift: 0 })
  }
  // selection / status ring
  u.ring = new THREE.Mesh(new THREE.RingGeometry(0.88, 1, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, toneMapped: false }))
  u.ring.position.y = 0.04
  u.ring.renderOrder = 2
  scene.add(u.ring)
  u.hit = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 12), new THREE.MeshBasicMaterial({ visible: false }))
  u.hit.userData.unit = u
  scene.add(u.hit)
  u.label = document.createElement('div')
  u.label.className = `ulabel s${side}`
  overlayEl.appendChild(u.label)
  relayout(u, true)
  return u
}

function relayout(u, snap = false) {
  const live = u.models.filter((m) => m.alive)
  const offs = formation(live.length, u.t.base)
  // keep each survivor roughly where it was: assign slots greedily by angle
  live.sort((a, b) => Math.atan2(a.oz, a.ox) - Math.atan2(b.oz, b.ox))
  offs.forEach(([ox, oz], i) => {
    live[i].ox = ox
    live[i].oz = oz
  })
  u.r = offs.reduce((m, [ox, oz]) => Math.max(m, Math.hypot(ox, oz)), 0) + u.t.base
  u.ring.scale.setScalar(u.r + 0.18)
  const tall = u.t.big ? 2.4 : u.t.fly ? 1.8 : 1.3
  u.hit.scale.set(u.r, tall, u.r)
  if (snap) for (const m of u.models) placeModel(u, m)
  updateLabel(u)
}
function placeModel(u, m) {
  m.x = u.pos.x + m.ox
  m.z = u.pos.z + m.oz
  m.mesh.position.set(m.x, 0, m.z)
  m.mesh.rotation.y = m.yaw
}
function setUnitPos(u, x, z) {
  u.pos.x = x
  u.pos.z = z
  u.ring.position.x = u.hit.position.x = x
  u.ring.position.z = u.hit.position.z = z
  u.hit.position.y = u.hit.scale.y / 2
}

function updateLabel(u) {
  const w = u.models.filter((m) => m.alive)
  let html = `<span class="nm">${u.t.short}</span>`
  if (u.t.models > 1) html += `<span class="ct">${u.alive}/${u.t.models}</span>`
  else html += `<span class="ct">${w[0] ? w[0].w : 0}/${u.t.W}♥</span>`
  if (u.mesmerized) html += `<span class="st" title="Mesmerized">🌀</span>`
  if (alive(u) && isEngaged(u)) html += `<span class="st" title="In combat">⚔</span>`
  u.label.innerHTML = html
  u.label.style.display = alive(u) ? '' : 'none'
}

function clearUnits() {
  for (const u of units) {
    for (const m of u.models) scene.remove(m.mesh)
    scene.remove(u.ring, u.hit)
    u.label.remove()
  }
  units = []
}

// Pick a spot near (x, z) inside the side's deployment zone.
function freeSpot(u, x, z, side, others) {
  let best = null, bd = Infinity
  const minX = side === 0 ? -W / 2 : W / 2 - BOARD.deploy, maxX = side === 0 ? -W / 2 + BOARD.deploy : W / 2
  for (let i = 0; i < nav.N; i++) {
    const cx = nav.x(i), cz = nav.z(i)
    if (cx - u.r < minX - 0.01 || cx + u.r > maxX + 0.01) continue
    if (!nav.standable(i, u.r, 'walk')) continue
    if (others.some((o) => Math.hypot(o.pos.x - cx, o.pos.z - cz) < o.r + u.r + 0.4)) continue
    const d = Math.hypot(cx - x, cz - z)
    if (d < bd) {
      bd = d
      best = { x: cx, z: cz }
    }
  }
  return best
}

function deployArmies() {
  for (const side of [0, 1]) {
    const sx = side === 0 ? -1 : 1
    const list = units.filter((u) => u.side === side)
    const placed = []
    const back = list.filter((u) => u.t.role === 'Artillery')
    const mid = list.filter((u) => u.t.hero)
    const front = list.filter((u) => !back.includes(u) && !mid.includes(u))
    const rows = [
      [front, W / 2 - BOARD.deploy + 1.8],
      [mid, W / 2 - BOARD.deploy + 3.6],
      [back, W / 2 - 2.4],
    ]
    for (const [row, depth] of rows) {
      row.forEach((u, i) => {
        const z = ((i + 0.5) / row.length - 0.5) * (H - 6) * (side ? -1 : 1)
        const p = freeSpot(u, sx * depth, z, side, placed) || { x: sx * depth, z }
        setUnitPos(u, p.x, p.z)
        placed.push(u)
        for (const m of u.models) placeModel(u, m)
      })
    }
  }
}

// ── Line of sight, cover, control ───────────────────────────────────────────
const eyeY = (u) => (u.t.big ? 1.9 : u.t.fly ? 1.5 : 0.95)
const chestY = (u) => (u.t.big ? 1.0 : u.t.fly ? 1.0 : 0.55)

function inCover(u) {
  const live = u.models.filter((m) => m.alive)
  if (u.t.fly) return false
  let n = 0
  for (const m of live) if (nav.cover[nav.index(mx(u, m), mz(u, m))]) n++
  return n * 2 >= live.length && n > 0
}

// Can `a` see `b`? Rays from a's centre to each of b's models.
function sight(a, b, from = a.pos) {
  const eye = { x: from.x, y: eyeY(a), z: from.z }
  let seen = 0, obsc = 0, total = 0
  for (const m of b.models) {
    if (!m.alive) continue
    total++
    const r = scenery.los(eye, { x: mx(b, m), y: chestY(b), z: mz(b, m) })
    if (!r.blocked) {
      seen++
      if (r.obscure) obsc++
    }
  }
  return { visible: seen > 0, cover: seen > 0 && (obsc > 0 || seen < total || inCover(b)), seen, total }
}

function leadership(u) {
  let ld = u.t.Ld
  for (const f of friendsOf(u)) if (f.t.hero && dist(u, f) <= AURA + u.r) ld = Math.max(ld, f.t.Ld)
  return ld
}

function controlOf(o) {
  const oc = [0, 0]
  for (const u of units) {
    if (!alive(u)) continue
    for (const m of u.models) if (m.alive && Math.hypot(mx(u, m) - o.x, mz(u, m) - o.z) <= OBJECTIVE_RANGE + u.t.base) oc[u.side] += u.t.OC
  }
  return oc[0] > oc[1] ? 0 : oc[1] > oc[0] ? 1 : -1
}

// ── Movement ────────────────────────────────────────────────────────────────
function moveMode(u) {
  return u.t.fly ? 'fly' : u.t.wrecker ? 'wreck' : 'walk'
}

// Cells a unit may not enter: within 1" of an enemy (or just their bases when
// falling back / charging). `except` is the charge target.
function forbidMask(u, pad, onlyBodies = []) {
  const f = new Uint8Array(nav.N)
  f.discs = [] // the exact shapes, for nav.walkable's straight-line shortcuts
  for (const e of enemiesOf(u)) {
    const R = e.r + u.r + (onlyBodies.includes(e) ? 0.02 : pad)
    f.discs.push({ x: e.pos.x, z: e.pos.z, R: R - 0.02 })
    const i0x = Math.max(0, Math.floor((e.pos.x - R + W / 2) / nav.cell)), i1x = Math.min(nav.nx - 1, Math.floor((e.pos.x + R + W / 2) / nav.cell))
    const i0z = Math.max(0, Math.floor((e.pos.z - R + H / 2) / nav.cell)), i1z = Math.min(nav.nz - 1, Math.floor((e.pos.z + R + H / 2) / nav.cell))
    for (let iz = i0z; iz <= i1z; iz++) for (let ix = i0x; ix <= i1x; ix++) {
      const i = iz * nav.nx + ix
      if (Math.hypot(nav.x(i) - e.pos.x, nav.z(i) - e.pos.z) < R) f[i] = 1
    }
  }
  return f
}

// Everything the movement phase needs for one unit: where it can go and how.
function movePlan(u, extra = 0) {
  refreshNav()
  const fallback = isEngaged(u)
  const max = u.t.M + extra
  const mode = moveMode(u)
  const enemies = enemiesOf(u)
  // falling back may walk through the 1" bubble but not through bases
  const forbid = forbidMask(u, ENGAGE + 0.05, fallback ? enemies : [])
  const endForbid = forbidMask(u, ENGAGE + 0.05)
  const res = nav.reach(u.pos.x, u.pos.z, { r: u.r, max, mode: mode === 'fly' ? 'fly' : mode, forbid: mode === 'fly' ? null : forbid })
  return { u, res, max, mode, forbid, endForbid, fallback }
}

function validEnd(plan, i) {
  const { u, res, mode, endForbid } = plan
  if (i < 0 || !isFinite(res.dist[i])) return false
  if (!nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', endForbid)) return false
  const x = nav.x(i), z = nav.z(i)
  for (const o of units) if (o !== u && alive(o) && Math.hypot(o.pos.x - x, o.pos.z - z) < o.r + u.r + 0.08) return false
  return true
}

function nearestValid(plan, x, z, within = 2.4) {
  let best = -1, bd = within
  const c = nav.index(x, z)
  if (c < 0) return -1
  const R = Math.ceil(within / nav.cell)
  const cx = c % nav.nx, cz = (c / nav.nx) | 0
  for (let dz = -R; dz <= R; dz++) for (let dx = -R; dx <= R; dx++) {
    const ix = cx + dx, iz = cz + dz
    if (ix < 0 || iz < 0 || ix >= nav.nx || iz >= nav.nz) continue
    const i = iz * nav.nx + ix
    const d = Math.hypot(nav.x(i) - x, nav.z(i) - z)
    if (d < bd && validEnd(plan, i)) {
      bd = d
      best = i
    }
  }
  return best
}

async function walk(u, pts, { speed = 7, fly = false } = {}) {
  const L = pathLength(pts)
  if (L < 0.05) return
  u.moving = true
  if (fly) for (const m of u.models) m.flying = true
  const seg = []
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
    seg.push({ a: pts[i - 1], b: pts[i], s: acc, l })
    acc += l
  }
  // The Brute smashes what it passes at fixed 0.25" samples along the path, so
  // what breaks (and which way trees fall) never depends on the frame rate.
  const smash = []
  if (u.t.wrecker) for (const q of seg) for (let t = 0; t < q.l; t += 0.25) smash.push({ s: q.s + t, x: q.a.x + ((q.b.x - q.a.x) * t) / q.l, z: q.a.z + ((q.b.z - q.a.z) * t) / q.l, dir: Math.atan2(q.b.x - q.a.x, q.b.z - q.a.z) })
  if (u.t.wrecker) smash.push({ s: L, x: pts[pts.length - 1].x, z: pts[pts.length - 1].z, dir: seg[seg.length - 1] ? Math.atan2(seg[seg.length - 1].b.x - seg[seg.length - 1].a.x, seg[seg.length - 1].b.z - seg[seg.length - 1].a.z) : u.facing })
  let smashed = 0
  await tween(L / speed + 0.15, (k) => {
    const d = Math.min(L, k * (L + speed * 0.15))
    const s = seg.find((q) => d <= q.s + q.l) || seg[seg.length - 1]
    const f = s.l > 0 ? (d - s.s) / s.l : 1
    const x = lerp(s.a.x, s.b.x, f), z = lerp(s.a.z, s.b.z, f)
    u.facing = Math.atan2(s.b.x - s.a.x, s.b.z - s.a.z)
    setUnitPos(u, x, z)
    if (fly) for (const m of u.models) m.lift = Math.sin(Math.min(1, d / L) * Math.PI) * Math.min(3, L * 0.3)
    while (smashed < smash.length && smash[smashed].s <= d) smashAround(u, smash[smashed++])
  }, easeInOut)
  while (smashed < smash.length) smashAround(u, smash[smashed++])
  u.moving = false
  if (fly) for (const m of u.models) (m.flying = false), (m.lift = 0)
  await wait(0.15)
}

// The Brute ploughs through anything breakable in its way.
function smashAround(u, { x, z, dir }) {
  for (const c of scenery.chunks) {
    if (!c.alive || !c.destructible) continue
    const s = c.nav || c.shape
    if (Math.hypot(s.x - x, s.z - z) < u.r + Math.max(s.hx, s.hz) * 0.8) {
      scenery.hurt(c, 99, { x: x - Math.sin(dir), z: z - Math.cos(dir) })
      fx.shake = Math.max(fx.shake, 0.08)
    }
  }
}

async function doMove(u, cell, plan) {
  S.busy = true
  const pts = nav.path(plan.res, cell, u.r, plan.mode === 'fly' ? null : plan.forbid)
  u.flags.moved = true
  if (plan.fallback) u.flags.fellBack = true
  const L = pathLength(pts)
  log(u.side, `<b>${u.t.short}</b> ${plan.fallback ? 'fall back' : u.flags.advanced ? 'advance' : 'move'} ${L.toFixed(1)}".`)
  if (u.t.wrecker && L > 0.1) sfx.boom(0.4)
  await walk(u, pts, { fly: plan.mode === 'fly' })
  refreshNav()
  finishAction()
}

async function doAdvance(u) {
  S.busy = true
  tray.clear(`${u.t.short} — Advance`)
  const r = roll(1)
  await tray.row('Advance D6', r, 0, { sum: true, note: `+${r[0]}"` })
  u.flags.advanced = true
  u.flags.advRoll = r[0]
  log(u.side, `<b>${u.t.short}</b> advance: +${r[0]}".`)
  S.busy = false
  return r[0]
}

// ── Shooting ────────────────────────────────────────────────────────────────
function canShoot(u) {
  const w = u.t.ranged
  if (!w || !alive(u) || u.flags.shot) return false
  if (u.mesmerized || u.flags.fellBack || isEngaged(u)) return false
  if (u.flags.advanced && !w.assault) return false
  return true
}

function shotInfo(u, target) {
  const w = u.t.ranged
  const range = gap(u, target)
  if (range > w.range) return { ok: false, why: `out of range (${range.toFixed(1)}" / ${w.range}")` }
  if (isEngaged(target) && !w.spell) return { ok: false, why: 'locked in combat' }
  const s = sight(u, target)
  if (!s.visible && !w.indirect) return { ok: false, why: 'no line of sight' }
  let mod = 0
  if (w.heavy && u.flags.moved) mod++
  if (w.indirect && !s.visible) mod++
  return { ok: true, range, ...s, mod, need: hitNeed(u.t.BS, mod) }
}

function shootTargets(u) {
  if (!canShoot(u)) return []
  return enemiesOf(u).filter((e) => shotInfo(u, e).ok)
}

async function doShoot(u, target) {
  S.busy = true
  const w = u.t.ranged
  const info = shotInfo(u, target)
  u.flags.shot = true
  face(u, target)
  tray.clear(`${u.t.short} → ${target.t.short} · ${w.name}`)
  if (w.spell) {
    const c = roll(2)
    const ok = c[0] + c[1] >= w.spell
    await tray.row(`Cast ${w.spell}+ (2D6)`, c, 0, { sum: true, pass: ok })
    if (!ok) {
      sfx.fizzle()
      fx.text(top(u), 'Fizzle…', '#c8b8ff')
      log(u.side, `<b>${u.t.short}</b> tries ${w.name} — it fizzles (${c[0] + c[1]}).`)
      return finishAction()
    }
    sfx.magic()
    if (w.mesmerize) return mesmerize(u, target)
    log(u.side, `<b>${u.t.short}</b> casts <b>${w.name}</b> on ${target.t.short}!`)
    await thornburst(u, target, w)
    return finishAction()
  }
  if (w.blast) {
    await blastVolley(u, target, w, info)
    return finishAction()
  }
  // a plain volley
  const n = attackCount(u, w, false)
  await volleyFx(u, target, w)
  const hits = roll(n)
  const h = passes(hits, info.need)
  await tray.row(`Hit ${info.need}+`, hits, info.need)
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const wd = roll(h)
  const wounds = passes(wd, wn)
  if (h) await tray.row(`Wound ${wn}+`, wd, wn)
  const sn = saveNeed(target.t.Sv, w.AP, info.cover)
  const sv = roll(wounds)
  const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
  if (wounds) await tray.row(sn > 6 ? 'No save' : `Save ${sn}+${info.cover ? ' (cover)' : ''}`, sn > 6 ? [] : sv, sn, { save: true })
  const killed = await damage(target, unsaved, w.D, u)
  log(u.side, `<b>${u.t.short}</b> shoot ${target.t.short}: ${h} hit, ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
  finishAction()
}

// Projectiles for a non-blast volley — a handful, not one per die.
async function volleyFx(u, target, w) {
  const shooters = u.models.filter((m) => m.alive)
  const victims = target.models.filter((m) => m.alive)
  const flights = []
  const n = Math.min(10, shooters.length * w.shots)
  for (let i = 0; i < n; i++) {
    const s = shooters[i % shooters.length]
    const v = victims[(Math.random() * victims.length) | 0]
    const a = { x: s.x, y: eyeY(u) * 0.8 + s.lift, z: s.z }
    const b = { x: v.x + (Math.random() - 0.5) * 0.6, y: chestY(target) * 0.8, z: v.z + (Math.random() - 0.5) * 0.6 }
    flights.push(wait(i * 0.06).then(() => {
      sfx.shot()
      return fx.projectile(a, b, projectileStyle(w.fx))
    }).then(() => {
      for (let k = 0; k < 5; k++) fx.mote({ x: b.x, y: b.y, z: b.z, vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3, vz: (Math.random() - 0.5) * 4, size: 0.05, color: w.fx === 'spit' ? '#9aff5a' : '#ffe0a0', life: 0.35, g: 10 })
    }))
  }
  await Promise.all(flights)
}

const projGeo = {
  acorn: new THREE.SphereGeometry(0.07, 6, 5),
  dart: new THREE.ConeGeometry(0.03, 0.3, 4).rotateX(Math.PI / 2),
  javelin: new THREE.CylinderGeometry(0.02, 0.02, 0.9, 4).rotateX(Math.PI / 2),
  spit: new THREE.IcosahedronGeometry(0.08, 0),
  bomb: new THREE.SphereGeometry(0.11, 8, 6),
  pinecone: new THREE.ConeGeometry(0.2, 0.42, 7),
  acid: new THREE.SphereGeometry(0.24, 12, 8),
}
function projectileStyle(kind) {
  const glow = (c) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false })
  switch (kind) {
    case 'acorn': return { mesh: new THREE.Mesh(projGeo.acorn, M('#8a5a2a')), arc: 0.08, speed: 28 }
    case 'dart': return { mesh: new THREE.Mesh(projGeo.dart, M('#4a6a2a')), arc: 0.03, speed: 34, spin: 0 }
    case 'javelin': return { mesh: new THREE.Mesh(projGeo.javelin, M('#8a6a3a')), arc: 0.18, speed: 20, spin: 0 }
    case 'spit': return { mesh: new THREE.Mesh(projGeo.spit, glow('#9aff5a')), arc: 0.12, speed: 18, trail: (p) => fx.mote({ x: p.x, y: p.y, z: p.z, size: 0.04, color: '#7aef4a', life: 0.4, g: 6 }) }
    case 'bomb': return { mesh: new THREE.Mesh(projGeo.bomb, M('#7a4a22')), arc: 0.45, speed: 14, trail: (p) => fx.mote({ x: p.x, y: p.y + 0.1, z: p.z, size: 0.05, color: '#ffb030', life: 0.3, g: -1 }) }
    case 'pinecone': return { mesh: new THREE.Mesh(projGeo.pinecone, M('#6b4a26', { emissive: '#ff5a10', emissiveIntensity: 0.6 })), arc: 0.55, speed: 18, trail: (p) => { fx.mote({ x: p.x, y: p.y, z: p.z, size: 0.12, color: Math.random() < 0.5 ? '#ff8a2a' : '#ffd36e', life: 0.4, g: -2 }); fx.smoke({ x: p.x, y: p.y, z: p.z, size: 0.14, color: '#3a3430', life: 0.9 }) } }
    case 'acid': return { mesh: new THREE.Mesh(projGeo.acid, glow('#8aff5a')), arc: 0.5, speed: 15, trail: (p) => fx.mote({ x: p.x, y: p.y, z: p.z, size: 0.1, color: Math.random() < 0.5 ? '#5be04a' : '#c8ff8a', life: 0.5, g: 8 }) }
  }
  return { mesh: new THREE.Mesh(projGeo.acorn, M('#888')) }
}

// Blast weapons: each template is aimed at the target, rolled to hit, and on
// a miss scatters D6+1" in a random direction before it lands.
async function blastVolley(u, target, w, info) {
  const n = attackCount(u, w, false)
  log(u.side, `<b>${u.t.short}</b> fire ${w.name} at ${target.t.short} (${info.need}+${info.visible ? '' : ', unseen'}).`)
  for (let k = 0; k < n; k++) {
    if (!alive(target) && k > 0) break
    const ang = rng() * Math.PI * 2, off = rng() * target.r * 0.5
    const aim = { x: target.pos.x + Math.cos(ang) * off, z: target.pos.z + Math.sin(ang) * off }
    const marker = fx.ring(aim.x, aim.z, w.blast, '#ffffff', { hold: true, fill: 0.12 })
    const r = roll(1)
    const hit = r[0] >= info.need
    await tray.row(n > 1 ? `Template ${k + 1}: hit ${info.need}+` : `Hit ${info.need}+`, r, info.need)
    let land = aim
    if (!hit) {
      const sc = roll(1)[0] + 1
      const a = rng() * Math.PI * 2
      land = {
        x: Math.max(-W / 2 + 0.3, Math.min(W / 2 - 0.3, aim.x + Math.cos(a) * sc)),
        z: Math.max(-H / 2 + 0.3, Math.min(H / 2 - 0.3, aim.z + Math.sin(a) * sc)),
      }
      await tray.row(`Scatter D6+1`, [sc - 1], 0, { sum: true, note: `${sc}"` })
      fx.text({ x: aim.x, y: 1.5, z: aim.z }, `scatter ${sc}"`, '#ffd36e', { size: 15 })
      await tween(0.35, (t) => marker.position.set(lerp(aim.x, land.x, t), 0.05, lerp(aim.z, land.z, t)), easeOut)
    }
    await artilleryFire(u, land, w)
    marker.userData.remove()
    await blastLands(u, land, w)
  }
}

async function artilleryFire(u, land, w) {
  const src = u.models.find((m) => m.alive)
  const anim = src.mesh.userData.anim
  if (anim?.throwArm) {
    const r0 = anim.rest
    sfx.thwack()
    tween(0.25, (k) => (anim.throwArm.rotation.x = r0 - 2.1 * easeOut(k))).then(() => tween(0.8, (k) => (anim.throwArm.rotation.x = r0 - 2.1 * (1 - k))))
    if (anim.globe) anim.globe.visible = false
    await wait(0.15)
  } else {
    // a grenadier winds up
    src.lunge = 1
    src.lungeDir = Math.atan2(land.x - src.x, land.z - src.z)
  }
  const a = { x: src.x, y: u.t.big ? 1.8 : 0.9, z: src.z }
  sfx.shot()
  await fx.projectile(a, { x: land.x, y: 0.15, z: land.z }, projectileStyle(w.fx))
  if (anim?.globe) anim.globe.visible = true
}

async function thornburst(u, target, w) {
  const land = { x: target.pos.x, z: target.pos.z }
  const gem = u.models[0].mesh.userData.anim.gem
  if (gem) {
    const p = new THREE.Vector3()
    gem.getWorldPosition(p)
    for (let i = 0; i < 20; i++) fx.mote({ x: p.x, y: p.y, z: p.z, vx: (Math.random() - 0.5) * 3, vy: Math.random() * 3, vz: (Math.random() - 0.5) * 3, size: 0.06, color: '#9aff7a', life: 0.8, g: -1 })
  }
  // thorns burst up through the turf
  const spikes = []
  const geo = new THREE.ConeGeometry(0.12, 1, 5)
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * w.blast
    const s = new THREE.Mesh(geo, M(i % 3 ? '#5a7a2a' : '#7a5a2a'))
    s.position.set(land.x + Math.cos(a) * d, -0.6, land.z + Math.sin(a) * d)
    s.rotation.set((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6)
    s.scale.set(1, 0.6 + Math.random() * 1.1, 1)
    s.castShadow = true
    scene.add(s)
    spikes.push(s)
  }
  await tween(0.3, (k) => spikes.forEach((s) => (s.position.y = -0.6 + easeOut(k) * (0.3 + s.scale.y * 0.4))))
  fx.explode(land.x, land.z, w.blast, 'thorns')
  await blastLands(u, land, w)
  tween(1.2, (k) => spikes.forEach((s) => (s.position.y -= 0.02 * k))).then(() => spikes.forEach((s) => scene.remove(s)))
}

// Everything under the template takes a hit, whoever it belongs to; then the
// blast chews the scenery.
async function blastLands(u, land, w) {
  if (w.fx !== 'thorns') {
    fx.explode(land.x, land.z, w.blast, w.fx === 'acid' ? 'acid' : 'fire')
    sfx.boom(w.blast / 2)
  }
  fx.ring(land.x, land.z, w.blast, w.fx === 'acid' ? '#8aff5a' : '#ff9a4a', { life: 1.4, fill: 0.2 })
  const victims = []
  for (const v of units) {
    if (!alive(v)) continue
    const under = v.models.filter((m) => m.alive && Math.hypot(mx(v, m) - land.x, mz(v, m) - land.z) <= w.blast + v.t.base * 0.6)
    if (under.length) victims.push({ v, under })
  }
  for (const { v, under } of victims) {
    let hits = under.length
    if (v.t.big) hits = Math.ceil(d6() / 2) + 1
    const friendly = v.side === u.side
    const wn = woundNeed(w.S, v.t.T, w.poison)
    const wd = roll(hits)
    const wounds = passes(wd, wn)
    await tray.row(`${friendly ? '⚠ ' : ''}${v.t.short}: ${hits} hit${hits > 1 ? 's' : ''} · wound ${wn}+`, wd, wn)
    const cover = inCover(v)
    const sn = saveNeed(v.t.Sv, w.AP, cover)
    const sv = roll(wounds)
    const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
    if (wounds && sn <= 6) await tray.row(`Save ${sn}+${cover ? ' (cover)' : ''}`, sv, sn, { save: true })
    const killed = await damage(v, unsaved, w.D, u, under)
    log(u.side, `${friendly ? '<b>Friendly fire!</b> ' : ''}${w.name} hits ${v.t.short}: ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
  }
  if (!victims.length) await wait(0.25)
  const broke = scenery.blast(land.x, land.z, w.blast, w.scenery || 1, { acid: w.fx === 'acid' })
  if (broke.length) log(u.side, `…and ${broke.length} piece${broke.length > 1 ? 's' : ''} of scenery ${broke.length > 1 ? 'are' : 'is'} wrecked.`)
  refreshNav()
}

async function mesmerize(u, target) {
  const from = top(u), to = top(target)
  const beam = []
  for (let i = 0; i <= 16; i++) {
    const k = i / 16
    beam.push(wait(k * 0.3).then(() => fx.mote({ x: lerp(from.x, to.x, k), y: lerp(from.y, to.y, k) + Math.sin(k * Math.PI) * 0.8, z: lerp(from.z, to.z, k), size: 0.09, color: '#c070ff', life: 0.7, g: 0 })))
  }
  await Promise.all(beam)
  for (let i = 0; i < 3; i++) fx.ring(target.pos.x, target.pos.z, target.r * (0.6 + i * 0.35), '#c070ff', { life: 1.2 + i * 0.3, fill: 0.08 })
  const mw = Math.ceil(d6() / 2)
  await tray.row('Mortal wounds D3', [mw], 0, { sum: true, note: `${mw}` })
  const killed = await damage(target, mw, 1, u)
  target.mesmerized = true
  updateLabel(target)
  fx.text(top(target), 'Mesmerized!', '#e0a0ff', { size: 20 })
  log(u.side, `<b>${u.t.short}</b> mesmerizes ${target.t.short}: ${mw} mortal wound${mw > 1 ? 's' : ''}${killed ? `, <b>${killed} slain</b>` : ''}. It can't shoot or charge next turn.`)
  finishAction()
}

// ── Damage ──────────────────────────────────────────────────────────────────
// Allocate `n` wounds of `D` damage to `u`, finishing off wounded models first
// and preferring the models actually under a template. Returns models slain.
async function damage(u, n, D, attacker, prefer = null) {
  let killed = 0
  for (let i = 0; i < n; i++) {
    const live = u.models.filter((m) => m.alive)
    if (!live.length) break
    let pool = prefer ? live.filter((m) => prefer.includes(m)) : []
    if (!pool.length) pool = live
    const wounded = pool.filter((m) => m.w < u.t.W)
    let m
    if (wounded.length) m = wounded[0]
    else {
      // whoever is nearest the attacker takes it
      const near = (q) => Math.hypot(mx(u, q) - attacker.pos.x, mz(u, q) - attacker.pos.z)
      m = pool.reduce((a, b) => (near(a) < near(b) ? a : b))
    }
    m.w -= D
    fx.text({ x: m.x, y: (u.t.big ? 2.3 : 1.3), z: m.z }, `-${Math.min(D, D + Math.min(0, m.w))}`, '#ff5a4a', { size: u.t.big ? 24 : 18 })
    if (m.w <= 0) {
      killModel(u, m, attacker)
      killed++
    } else {
      m.flash = 0.4
    }
    await wait(0.06)
  }
  if (killed) {
    u.lost += killed
    await wait(0.25)
    if (alive(u)) closeRanks(u)
  }
  updateLabel(u)
  return killed
}

// Survivors close ranks — and pile in, so a squad thinned out in melee doesn't
// shrink out of the fight it was in.
function closeRanks(u) {
  const foes = engagedWith(u)
  relayout(u)
  if (!foes.length || isEngaged(u)) return
  const f = foes.reduce((a, b) => (gap(u, a) < gap(u, b) ? a : b))
  const d = dist(u, f)
  const step = gap(u, f) - (ENGAGE - 0.3)
  setUnitPos(u, u.pos.x + ((f.pos.x - u.pos.x) / d) * step, u.pos.z + ((f.pos.z - u.pos.z) / d) * step)
}

function killModel(u, m, attacker) {
  m.alive = false
  m.w = 0
  u.alive--
  m.dying = true
  if (u.side === 0) sfx.squeak()
  else sfx.hiss()
  const fig = m.mesh.userData.fig
  const dir = attacker ? Math.atan2(m.x - attacker.pos.x, m.z - attacker.pos.z) - m.yaw : 0
  const side = Math.sin(dir) >= 0 ? 1 : -1
  fx.debris(m.x, 0.5, m.z, u.side === 0 ? ['#cf6d2a', '#f1dcb5'] : ['#3f8f4a', '#d9cf86'], 6, { power: 2, size: 0.07 })
  tween(0.6, (k) => {
    fig.rotation.z = side * k * 1.45
    fig.position.y = (u.t.big ? 0.09 : 0.06) + Math.sin(k * Math.PI) * 0.15
  }, easeOut)
    .then(() => wait(1.4))
    .then(() => tween(0.8, (k) => (m.mesh.position.y = -k * 1.4)))
    .then(() => {
      scene.remove(m.mesh)
      m.dying = false
    })
  if (!alive(u)) unitDestroyed(u, attacker)
}

function unitDestroyed(u, by) {
  u.label.style.display = 'none'
  u.ring.visible = false
  u.hit.visible = false
  scene.remove(u.hit)
  // reported after the attack that did it, not in the middle of it
  S.pendingLog.push([u.side, `<b>${u.t.name}</b> ${u.t.models > 1 ? 'are' : 'is'} destroyed!`, 'big'])
  fx.text({ x: u.pos.x, y: 2.2, z: u.pos.z }, `${u.t.short} destroyed`, SIDES[by ? by.side : 1 - u.side].color, { size: 20, life: 2 })
}

// ── Charge & fight ──────────────────────────────────────────────────────────
function canCharge(u) {
  if (!alive(u) || u.flags.charged || u.flags.chargeTried) return false
  if (u.t.role === 'Artillery' || u.mesmerized || u.flags.fellBack || isEngaged(u)) return false
  if (u.flags.advanced && !u.t.abilities?.some((a) => a.startsWith('Sidewind'))) return false
  return true
}

function chargeTargets(u) {
  if (!canCharge(u)) return []
  return enemiesOf(u).filter((e) => gap(u, e) <= CHARGE_RANGE)
}

// Every spot a charge could end on: within 1" of the target, not within 1" of
// any other enemy, not on top of a friend — each with the length of the
// shortest route there. The closest one sets the distance the dice must beat;
// a roll that beats it may end on any spot it reaches.
function chargePlan(u, target) {
  refreshNav()
  const others = enemiesOf(u).filter((e) => e !== target)
  const mode = moveMode(u)
  // the target's 1" bubble is fine to enter, its base is not
  const forbid = forbidMask(u, ENGAGE + 0.05, [target])
  const res = nav.reach(u.pos.x, u.pos.z, { r: u.r, max: CHARGE_RANGE + 0.5, mode, forbid: mode === 'fly' ? null : forbid })
  const spots = []
  let best = -1, bd = Infinity
  const want = target.r + u.r + ENGAGE - 0.08
  const R = Math.ceil((want + 1) / nav.cell)
  const cx = nav.index(target.pos.x, target.pos.z)
  const tx = cx % nav.nx, tz = (cx / nav.nx) | 0
  for (let dz = -R; dz <= R; dz++) for (let dx = -R; dx <= R; dx++) {
    const ix = tx + dx, iz = tz + dz
    if (ix < 0 || iz < 0 || ix >= nav.nx || iz >= nav.nz) continue
    const i = iz * nav.nx + ix
    const d = res.dist[i]
    if (!isFinite(d)) continue
    const dd = Math.hypot(nav.x(i) - target.pos.x, nav.z(i) - target.pos.z)
    if (dd > want || dd < target.r + u.r + 0.02) continue
    if (!nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', forbid)) continue
    if (others.some((e) => Math.hypot(nav.x(i) - e.pos.x, nav.z(i) - e.pos.z) < e.r + u.r + ENGAGE)) continue
    if (units.some((o) => o !== u && o !== target && alive(o) && o.side === u.side && Math.hypot(o.pos.x - nav.x(i), o.pos.z - nav.z(i)) < o.r + u.r + 0.05)) continue
    spots.push({ i, d })
    if (d < bd) {
      best = i
      bd = d
    }
  }
  if (best < 0) return null
  return { cell: best, need: Math.max(2, Math.ceil(bd - 0.01)), res, forbid, mode, dist: bd, spots }
}

async function doCharge(u, target, { auto = false } = {}) {
  S.busy = true
  const plan = chargePlan(u, target)
  u.flags.chargeTried = true
  tray.clear(`${u.t.short} charge ${target.t.short}`)
  if (!plan) {
    log(u.side, `<b>${u.t.short}</b> can't find a way to ${target.t.short}.`)
    return finishAction()
  }
  const r = roll(2)
  const total = r[0] + r[1]
  const ok = total >= plan.need
  await tray.row(`Charge ${plan.need}" (2D6)`, r, 0, { sum: true, pass: ok })
  face(u, target)
  if (!ok) {
    fx.text(top(u), 'Charge failed', '#d0d0d0')
    log(u.side, `<b>${u.t.short}</b> charge ${target.t.short} — roll ${total}, needed ${plan.need}. Failed.`)
    return finishAction()
  }
  u.flags.charged = true
  u.flags.chargeTarget = target.id
  fx.text(top(u), 'CHARGE!', SIDES[u.side].color, { size: 22 })
  log(u.side, `<b>${u.t.short}</b> charge ${target.t.short} — roll ${total} vs ${plan.need}. <b>Contact!</b>`)
  // a human chooses where around the target to end; the AI takes the shortest move
  const cell = auto || !human(u.side) ? plan.cell : await pickChargeSpot(u, target, plan, total)
  const pts = nav.path(plan.res, cell, u.r, plan.mode === 'fly' ? null : plan.forbid)
  await walk(u, pts, { speed: 11, fly: plan.mode === 'fly' })
  refreshNav()
  for (const x of [u, target]) updateLabel(x)
  finishAction()
}

// Shade every spot the roll reaches and wait for a click on one of them.
function pickChargeSpot(u, target, plan, rolled) {
  // same 0.01" grace `need` was rounded with, and the shortest-move spot always
  // counts, so a roll that made the charge can never leave nowhere to stand
  const ok = new Uint8Array(nav.N)
  for (const s of plan.spots) if (s.d <= rolled + 0.011) ok[s.i] = 1
  ok[plan.cell] = 1
  // the 12" declaration ring is spent; leave the orange to the area itself,
  // filled strongly enough to see when it's only a cell or two
  rangeRing.visible = false
  paintMask(ok, [255, 150, 60], 150)
  ghostAt(plan.cell, u.r)
  return new Promise((resolve) => {
    S.chargePick = { u, target, plan, rolled, ok, resolve }
    refreshUI()
  })
}

function nearestSpot(pick, x, z, within = 2.4) {
  let best = -1, bd = within
  for (let i = 0; i < nav.N; i++) {
    if (!pick.ok[i]) continue
    const d = Math.hypot(nav.x(i) - x, nav.z(i) - z)
    if (d < bd) {
      bd = d
      best = i
    }
  }
  return best
}

function placeCharge(i) {
  const pick = S.chargePick
  if (!pick || i < 0 || !pick.ok[i]) return
  S.chargePick = null
  clearOverlay()
  ghost.visible = false
  $('#tooltip').style.display = 'none'
  refreshUI()
  pick.resolve(i)
}

async function fight(u) {
  if (!alive(u) || u.flags.fought) return
  const foes = engagedWith(u)
  if (!foes.length) return
  u.flags.fought = true
  const target = foes.find((f) => f.id === u.flags.chargeTarget) || foes.reduce((a, b) => (a.alive * a.t.W < b.alive * b.t.W ? a : b))
  const w = u.t.melee
  const mod = u.mesmerized ? 1 : 0
  const need = hitNeed(u.t.WS, mod)
  face(u, target)
  if (human(u.side) || human(target.side) || S.follow) focus(u.pos.x * 0.5 + target.pos.x * 0.5, u.pos.z * 0.5 + target.pos.z * 0.5)
  tray.clear(`${u.t.short} fight ${target.t.short} · ${w.name}`)
  // lunge!
  for (const m of u.models) if (m.alive) {
    m.lunge = 1
    m.lungeDir = Math.atan2(target.pos.x - m.x, target.pos.z - m.z)
  }
  sfx.thwack()
  const n = attackCount(u, w, true)
  const hits = roll(n)
  const h = passes(hits, need)
  await tray.row(`Hit ${need}+${mod ? ' (mesmerized)' : ''}`, hits, need)
  for (let i = 0; i < Math.min(h, 8); i++) {
    const v = target.models.filter((m) => m.alive)[i % Math.max(1, target.alive)]
    if (v) for (let k = 0; k < 4; k++) fx.mote({ x: v.x, y: 0.6, z: v.z, vx: (Math.random() - 0.5) * 5, vy: Math.random() * 4, vz: (Math.random() - 0.5) * 5, size: 0.05, color: '#fff2b0', life: 0.3, g: 12 })
  }
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const wd = roll(h)
  const wounds = passes(wd, wn)
  if (h) await tray.row(`Wound ${wn}+`, wd, wn)
  const sn = saveNeed(target.t.Sv, w.AP, false)
  const sv = roll(wounds)
  const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
  if (wounds) await tray.row(sn > 6 ? 'No save' : `Save ${sn}+`, sn > 6 ? [] : sv, sn, { save: true })
  const killed = await damage(target, unsaved, w.D, u)
  log(u.side, `<b>${u.t.short}</b> fight ${target.t.short}: ${h} hit, ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
  await wait(0.3)
}

async function fightPhase(active) {
  const chargers = units.filter((u) => u.side === active && u.flags.charged && alive(u))
  for (const u of chargers) await fight(u)
  // then the rest, defender first, alternating
  let side = 1 - active
  for (let guard = 0; guard < 30; guard++) {
    const next = units.find((u) => u.side === side && alive(u) && !u.flags.fought && isEngaged(u))
    const other = units.find((u) => u.side === 1 - side && alive(u) && !u.flags.fought && isEngaged(u))
    if (!next && !other) break
    if (next) await fight(next)
    side = 1 - side
  }
  for (const u of units) {
    u.flags.fought = false
    updateLabel(u)
  }
}

// ── Morale ──────────────────────────────────────────────────────────────────
async function moralePhase() {
  let any = false
  for (const u of units) {
    if (!alive(u) || !u.lost || u.t.models === 1) continue
    if (!any) tray.clear('Morale')
    any = true
    const ld = leadership(u)
    const r = roll(1)
    const total = r[0] + u.lost
    const flee = r[0] === 1 ? 0 : Math.max(0, total - ld)
    await tray.row(`${u.t.short}: D6 + ${u.lost} lost vs Ld ${ld}`, r, 0, { sum: true, pass: flee === 0, note: `${total}` })
    if (flee) {
      const n = Math.min(flee, u.alive)
      const runners = u.models.filter((m) => m.alive).slice(-n)
      for (const m of runners) flee1(u, m)
      log(u.side, `<b>${u.t.short}</b> lose their nerve — <b>${n} flee</b>.`)
      if (!alive(u)) unitDestroyed(u, null)
      else closeRanks(u)
      updateLabel(u)
      await wait(0.5)
    } else log(u.side, `<b>${u.t.short}</b> hold firm (${total} vs Ld ${ld}).`)
  }
}

function flee1(u, m) {
  m.alive = false
  m.w = 0
  u.alive--
  m.dying = true
  const ex = u.side === 0 ? -W / 2 - 3 : W / 2 + 3
  const x0 = m.x, z0 = m.z
  m.fleeing = true
  fx.text({ x: m.x, y: 1.4, z: m.z }, 'flees!', '#e0e0e0', { size: 14 })
  m.yaw = u.side === 0 ? -Math.PI / 2 : Math.PI / 2
  tween(2.2, (k) => {
    m.x = lerp(x0, ex, k)
    m.z = z0
    m.mesh.position.set(m.x, Math.abs(Math.sin(k * 30)) * 0.2, m.z)
    m.mesh.rotation.y = m.yaw
  }).then(() => {
    scene.remove(m.mesh)
    m.dying = false
  })
}

// ── Little helpers used by actions ──────────────────────────────────────────
function face(u, target) {
  u.facing = Math.atan2(target.pos.x - u.pos.x, target.pos.z - u.pos.z)
  for (const m of u.models) m.look = Math.atan2(target.pos.x - m.x, target.pos.z - m.z)
}
const top = (u) => ({ x: u.pos.x, y: u.t.big ? 2.6 : 1.6, z: u.pos.z })

function finishAction() {
  traceState('act')
  S.busy = false
  for (const u of units) updateLabel(u)
  if (S.sel && !canAct(S.sel)) select(null)
  else if (S.sel) select(S.sel)
  refreshUI()
  checkWipe()
}

function checkWipe() {
  for (const s of [0, 1]) if (!units.some((u) => u.side === s && alive(u))) S.wiped = s
}

// ── Camera focus for AI turns ───────────────────────────────────────────────
let focusTween = null
function focus(x, z) {
  if (!S.follow || S.stage !== 'battle') return
  if (human(S.active) && S.control[0] !== S.control[1]) return
  const t0 = controls.target.clone()
  const d = Math.hypot(x - t0.x, z - t0.z)
  if (d < 6) return
  const off = camera.position.clone().sub(t0)
  const tgt = new THREE.Vector3(lerp(t0.x, x, 0.6), 0, lerp(t0.z, z, 0.6))
  const id = (focusTween = {})
  tween(0.9, (k) => {
    if (focusTween !== id) return
    controls.target.lerpVectors(t0, tgt, k)
    camera.position.copy(controls.target).add(off)
  }, easeInOut)
}

// ── API handed to the AI ────────────────────────────────────────────────────
const api = {
  get units() {
    return units
  },
  objectives, nav, scenery, S, alive, enemiesOf, friendsOf, dist, gap, isEngaged, engagedWith, sight, inCover, controlOf,
  movePlan, validEnd, doMove, doAdvance, canShoot, shootTargets, shotInfo, doShoot, canCharge, chargeTargets, chargePlan,
  doCharge, focus, leadership,
}

// ── Turn loop ───────────────────────────────────────────────────────────────
let phaseResolve = null

async function battle() {
  S.stage = 'battle'
  select(null)
  zoneMats.forEach((m) => (m.opacity = 0.05))
  // roll off for first turn
  tray.clear('Roll-off for the first turn')
  let a, b
  do {
    a = roll(1)
    b = roll(1)
    await tray.row(SIDES[0].short, a, 0, { sum: true })
    await tray.row(SIDES[1].short, b, 0, { sum: true })
  } while (a[0] === b[0])
  S.first = a[0] > b[0] ? 0 : 1
  log(S.first, `<b>${SIDES[S.first].name}</b> win the roll-off and take the first turn.`, 'big')
  for (S.round = 1; S.round <= ROUNDS; S.round++) {
    for (let t = 0; t < 2; t++) {
      S.active = (S.first + t) % 2
      await playerTurn(S.active)
      if (S.wiped !== undefined) return gameOver()
    }
    await scoreRound()
  }
  gameOver()
}

async function playerTurn(side) {
  for (const u of units) {
    u.lost = 0
    if (u.side === side) u.flags = {}
  }
  for (const ph of PHASES) {
    S.phase = ph.key
    select(null)
    tray.el.classList.remove('show')
    refreshUI()
    await banner(`${SIDES[side].icon} ${SIDES[side].name}`, ph.name)
    if (ph.key === 'fight') {
      if (units.some((u) => alive(u) && isEngaged(u))) await fightPhase(side)
    } else if (ph.key === 'morale') {
      await moralePhase()
    } else if (!anyCanAct(side)) {
      await wait(0.2)
    } else if (human(side)) {
      await new Promise((res) => {
        phaseResolve = res
        S.waiting = true
        refreshUI()
      })
      phaseResolve = null
      S.waiting = false
    } else {
      await aiPhase(api, side, ph.key)
    }
    traceState(`phase ${side}:${ph.key}`)
    checkWipe()
    if (S.wiped !== undefined) return
  }
  // mesmerism wears off at the end of the victim's own turn
  for (const u of units) if (u.side === side && u.mesmerized) {
    u.mesmerized = false
    updateLabel(u)
  }
}

async function scoreRound() {
  const held = [0, 0]
  for (const o of objectives) {
    const c = controlOf(o)
    if (c >= 0) {
      held[c]++
      fx.ring(o.x, o.z, OBJECTIVE_RANGE, SIDES[c].color, { life: 1.6, fill: 0.15 })
    }
  }
  S.vp[0] += held[0]
  S.vp[1] += held[1]
  traceState(`round ${S.round}`)
  log(-1, `End of round ${S.round}: ${SIDES[0].short} hold ${held[0]} objective${held[0] === 1 ? '' : 's'}, ${SIDES[1].short} hold ${held[1]}. Score ${S.vp[0]}–${S.vp[1]}.`, 'big')
  refreshUI()
  await banner(`End of round ${S.round}`, `VP ${S.vp[0]} – ${S.vp[1]}`)
}

function gameOver() {
  for (const p of S.pendingLog.splice(0)) write(...p)
  traceState('over')
  S.stage = 'over'
  select(null)
  refreshUI()
  let win
  if (S.wiped !== undefined) win = 1 - S.wiped
  else win = S.vp[0] > S.vp[1] ? 0 : S.vp[1] > S.vp[0] ? 1 : -1
  const t = win < 0 ? 'A bloody draw' : `${SIDES[win].name} win!`
  const why = S.wiped !== undefined ? `${SIDES[S.wiped].name} have been wiped from the table.` : `Final score ${S.vp[0]} – ${S.vp[1]} after ${ROUNDS} rounds.`
  $('#overTitle').textContent = `${win >= 0 ? SIDES[win].icon + ' ' : ''}${t}`
  $('#overWhy').textContent = why
  $('#over').classList.remove('hidden')
  sfx.fanfare()
}

// ── Human input ─────────────────────────────────────────────────────────────
const ray = new THREE.Raycaster()
const ptr = new THREE.Vector2()
let downAt = null

function pick(ev) {
  ptr.set((ev.clientX / innerWidth) * 2 - 1, -(ev.clientY / innerHeight) * 2 + 1)
  ray.setFromCamera(ptr, camera)
  const hits = ray.intersectObjects(units.filter(alive).map((u) => u.hit), false)
  const unit = hits.length ? hits[0].object.userData.unit : null
  const g = ray.intersectObject(board, false)[0]
  return { unit, ground: g ? g.point : null }
}

function canAct(u) {
  if (!alive(u) || u.side !== S.active) return false
  switch (S.phase) {
    case 'move': return !u.flags.moved
    case 'shoot': return canShoot(u) && shootTargets(u).length > 0
    case 'charge': return canCharge(u) && chargeTargets(u).length > 0
  }
  return false
}
const anyCanAct = (side) => units.some((u) => u.side === side && canAct(u))

renderer.domElement.addEventListener('pointerdown', (e) => {
  unlock()
  downAt = { x: e.clientX, y: e.clientY, b: e.button }
})
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downAt || e.button !== 0) return
  const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y)
  downAt = null
  if (moved > 6) return
  click(pick(e))
})
renderer.domElement.addEventListener('pointerleave', () => {
  S.hoverPick = null
  S.hover = null
  hover()
  refreshRings()
})
renderer.domElement.addEventListener('pointermove', (e) => {
  S.mouse = { x: e.clientX, y: e.clientY }
  S.hoverPick = pick(e)
  hover()
})

function myTurn() {
  return (S.stage === 'battle' && human(S.active) && phaseResolve && !S.busy && !S.auto) || S.stage === 'deploy'
}

async function click({ unit, ground }) {
  $('#tooltip').style.display = 'none'
  if (S.stage === 'deploy') return deployClick(unit, ground)
  if (S.chargePick) {
    // the board under the cursor counts even when it's under a model
    if (ground) placeCharge(nearestSpot(S.chargePick, ground.x, ground.z))
    return
  }
  if (!myTurn()) {
    if (unit) showCard(unit)
    return
  }
  const sel = S.sel
  if (unit && unit.side === S.active) {
    if (canAct(unit)) {
      sfx.click()
      select(unit)
    } else showCard(unit)
    return
  }
  if (S.phase === 'move' && sel && ground) {
    const i = nearestValid(S.reach, ground.x, ground.z)
    if (i >= 0) {
      clearOverlay()
      await doMove(sel, i, S.reach)
    }
    return
  }
  if (S.phase === 'shoot' && sel && unit && unit.side !== sel.side) {
    if (shotInfo(sel, unit).ok) await doShoot(sel, unit)
    return
  }
  if (S.phase === 'charge' && sel && unit && unit.side !== sel.side) {
    if (chargeTargets(sel).includes(unit) && chargePlan(sel, unit)) await doCharge(sel, unit)
    return
  }
  if (unit) showCard(unit)
  else if (!unit && ground) select(null)
}

function deployClick(unit, ground) {
  const side = S.deploySide
  if (unit && unit.side === side) {
    sfx.click()
    S.sel = unit
    showCard(unit)
    refreshRings()
    return
  }
  if (S.sel && ground) {
    const u = S.sel
    const others = units.filter((o) => o !== u)
    const p = freeSpot(u, ground.x, ground.z, side, others)
    if (p && Math.hypot(p.x - ground.x, p.z - ground.z) < 2.5) {
      setUnitPos(u, p.x, p.z)
      sfx.click()
      for (const o of units) updateLabel(o)
    }
  }
}

function select(u) {
  S.sel = u
  S.reach = null
  clearOverlay()
  if (u && S.stage === 'battle' && S.phase === 'move' && !u.flags.moved) {
    S.reach = movePlan(u, u.flags.advanced ? u.flags.advRoll : 0)
    paintReach(S.reach)
  }
  if (u && S.phase === 'shoot' && u.t.ranged) showRange(u, u.t.ranged.range)
  if (u && S.phase === 'charge') showRange(u, CHARGE_RANGE)
  showCard(u)
  refreshUI()
}

// ── Reach overlay, range ring, path preview ─────────────────────────────────
const ovData = new Uint8Array(nav.nx * nav.nz * 4)
const ovTex = new THREE.DataTexture(ovData, nav.nx, nav.nz, THREE.RGBAFormat)
ovTex.magFilter = THREE.LinearFilter
ovTex.minFilter = THREE.LinearFilter
const ovMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: ovTex, transparent: true, depthWrite: false, toneMapped: false }))
ovMesh.position.y = 0.035
ovMesh.renderOrder = 2
ovMesh.visible = false
scene.add(ovMesh)

// The shaded area is everywhere the unit could stand; spots overlapping a
// friend are still shaded (a click there snaps to the nearest legal spot), so
// the region reads as one shape instead of a sieve.
function paintReach(plan) {
  const adv = plan.u.flags.advanced
  const { u, res, mode, endForbid } = plan
  const ok = new Uint8Array(nav.N)
  for (let i = 0; i < nav.N; i++) if (isFinite(res.dist[i]) && nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', endForbid)) ok[i] = 1
  paintMask(ok, plan.fallback ? [255, 120, 90] : adv ? [255, 190, 70] : [90, 180, 255])
}

function paintMask(ok, col, fill = 80) {
  ovData.fill(0)
  for (let i = 0; i < nav.N; i++) {
    if (!ok[i]) continue
    const ix = i % nav.nx, iz = (i / nav.nx) | 0
    const edge = ix === 0 || iz === 0 || ix === nav.nx - 1 || iz === nav.nz - 1 || !ok[i - 1] || !ok[i + 1] || !ok[i - nav.nx] || !ok[i + nav.nx]
    const o = ((nav.nz - 1 - iz) * nav.nx + ix) * 4
    ovData[o] = col[0]
    ovData[o + 1] = col[1]
    ovData[o + 2] = col[2]
    ovData[o + 3] = edge ? 210 : nav.diff[i] ? Math.round(fill * 0.7) : fill
  }
  ovTex.needsUpdate = true
  ovMesh.visible = true
}
function clearOverlay() {
  ovMesh.visible = false
  pathLine.visible = false
  rangeRing.visible = false
}

const rangeRing = new THREE.Mesh(new THREE.RingGeometry(0.985, 1, 96).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false }))
rangeRing.position.y = 0.04
rangeRing.visible = false
scene.add(rangeRing)
function showRange(u, range) {
  rangeRing.position.x = u.pos.x
  rangeRing.position.z = u.pos.z
  rangeRing.scale.setScalar(u.r + range)
  rangeRing.material.color.set(S.phase === 'charge' ? '#ffb070' : '#ffffff')
  rangeRing.visible = true
}

const pathLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, toneMapped: false }))
pathLine.visible = false
pathLine.renderOrder = 4
scene.add(pathLine)
const ghost = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, depthWrite: false, toneMapped: false }))
ghost.position.y = 0.05
ghost.visible = false
scene.add(ghost)

function ghostAt(i, r) {
  ghost.position.x = nav.x(i)
  ghost.position.z = nav.z(i)
  ghost.scale.setScalar(r)
  ghost.visible = true
}

function hover() {
  const tip = $('#tooltip')
  tip.style.display = 'none'
  pathLine.visible = false
  ghost.visible = false
  const h = S.hoverPick
  if (!h) {
    // off the board mid-pick: show where "Shortest move" would put the unit
    if (S.chargePick) ghostAt(S.chargePick.plan.cell, S.chargePick.u.r)
    return
  }
  S.hover = h.unit
  let text = ''
  const sel = S.sel
  if (S.chargePick && h.ground) {
    const pk = S.chargePick
    const i = nearestSpot(pk, h.ground.x, h.ground.z)
    if (i >= 0) {
      const pts = nav.path(pk.plan.res, i, pk.u.r, pk.plan.mode === 'fly' ? null : pk.plan.forbid)
      pathLine.geometry.setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0.08, p.z)))
      pathLine.visible = true
      ghost.position.x = nav.x(i)
      ghost.position.z = nav.z(i)
      ghost.scale.setScalar(pk.u.r)
      ghost.visible = true
      text = `End charge here · ${pk.plan.res.dist[i].toFixed(1)}" of ${pk.rolled}"`
    } else text = `✖ out of reach — pick a spot in the orange area`
  } else if (S.stage === 'battle' && myTurn() && sel) {
    if (S.phase === 'move' && S.reach && h.ground && !h.unit) {
      const i = nearestValid(S.reach, h.ground.x, h.ground.z)
      if (i >= 0) {
        const pts = nav.path(S.reach.res, i, sel.r, S.reach.mode === 'fly' ? null : S.reach.forbid)
        pathLine.geometry.setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0.08, p.z)))
        pathLine.visible = true
        ghost.position.x = nav.x(i)
        ghost.position.z = nav.z(i)
        ghost.scale.setScalar(sel.r)
        ghost.visible = true
        text = `${S.reach.res.dist[i].toFixed(1)}" of ${S.reach.max}"`
      }
    } else if (S.phase === 'shoot' && h.unit && h.unit.side !== sel.side) {
      const info = shotInfo(sel, h.unit)
      text = info.ok ? oddsText(sel, h.unit, info) : `✖ ${info.why}`
    } else if (S.phase === 'charge' && h.unit && h.unit.side !== sel.side) {
      if (!chargeTargets(sel).includes(h.unit)) text = `✖ out of charge range (${gap(sel, h.unit).toFixed(1)}")`
      else {
        const p = chargePlan(sel, h.unit)
        text = p ? `Charge: need ${p.need}" on 2D6 — ${Math.round(p2D6(p.need) * 100)}%` : '✖ no route'
      }
    }
  }
  if (!text && h.unit) text = `${h.unit.t.name} · ${h.unit.t.models > 1 ? `${h.unit.alive}/${h.unit.t.models} models` : `${h.unit.models[0].w}/${h.unit.t.W} wounds`}`
  if (text && S.mouse) {
    tip.innerHTML = text
    tip.style.display = 'block'
    tip.style.left = S.mouse.x + 16 + 'px'
    tip.style.top = S.mouse.y + 14 + 'px'
  }
}

function oddsText(u, target, info) {
  const w = u.t.ranged
  if (w.mesmerize) return `Mesmerize: cast ${w.spell}+ on 2D6 (${Math.round(p2D6(w.spell) * 100)}%) · D3 mortal wounds`
  const lines = []
  if (w.spell) lines.push(`Cast ${w.spell}+ (${Math.round(p2D6(w.spell) * 100)}%)`)
  const n = attackCount(u, w, false)
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const sn = saveNeed(target.t.Sv, w.AP, info.cover)
  lines.push(`${n} ${w.blast ? `template${n > 1 ? 's' : ''} (${w.blast}")` : 'shots'} · hit ${w.spell ? 'auto' : info.need + '+'} · wound ${wn}+ · save ${sn > 6 ? '—' : sn + '+'}`)
  const flags = []
  flags.push(`${info.range.toFixed(1)}"`)
  if (info.cover) flags.push('cover')
  if (!info.visible) flags.push('unseen (indirect −1)')
  else if (info.seen < info.total) flags.push(`${info.seen}/${info.total} visible`)
  if (w.heavy && u.flags.moved) flags.push('moved (heavy −1)')
  if (!w.blast) {
    const e = expected(n, info.need, w, target, info.cover)
    flags.push(`≈${e.kills.toFixed(1)} slain`)
  }
  lines.push(flags.join(' · '))
  return lines.join('<br>')
}

// ── UI: dice tray, log, card, HUD ───────────────────────────────────────────
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }
function dieEl(v, cls) {
  const d = document.createElement('div')
  d.className = `die ${cls}`
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('i')
    if (PIPS[v].includes(i)) p.className = 'on'
    d.appendChild(p)
  }
  return d
}

const tray = {
  el: $('#tray'),
  clear(title) {
    this.el.innerHTML = ''
    const t = document.createElement('div')
    t.className = 'tray-title'
    t.textContent = title
    this.el.appendChild(t)
    this.el.classList.add('show')
  },
  // `need` 0 means "just show the dice"; save rows colour passes as blocked.
  async row(label, dice, need, { sum = false, pass, note = '', save = false } = {}) {
    sfx.dice(dice.length)
    const row = document.createElement('div')
    row.className = 'tray-row'
    const l = document.createElement('span')
    l.className = 'lbl'
    l.textContent = label
    row.appendChild(l)
    const box = document.createElement('span')
    box.className = 'dice'
    row.appendChild(box)
    const shown = dice.slice(0, 30)
    shown.forEach((v, i) => {
      const cls = need ? (v >= need ? (save ? 'saved' : 'ok') : 'fail') : pass === false ? 'fail' : pass ? 'ok' : 'plain'
      const d = dieEl(v, cls)
      d.style.animationDelay = `${(i * 0.025) / clock.speed}s`
      box.appendChild(d)
    })
    const res = document.createElement('span')
    res.className = 'res'
    if (need) {
      const k = passes(dice, need)
      res.textContent = save ? `${k} saved` : `${k} ✓`
      if (dice.length > 30) res.textContent += ` (of ${dice.length})`
    } else if (sum) {
      res.textContent = note || `= ${dice.reduce((a, b) => a + b, 0)}`
      if (pass === true) res.classList.add('good')
      if (pass === false) res.classList.add('bad')
    }
    row.appendChild(res)
    this.el.appendChild(row)
    while (this.el.children.length > 7) this.el.children[1].remove()
    await wait(0.38 + Math.min(dice.length, 14) * 0.035)
  },
}

// A replayable fingerprint of the battle: every log line and the logic-RNG
// position, plus a state snapshot after each action. Two runs with the same
// seeds must produce identical traces (that is how refactors are checked).
const trace = []
function traceState(tag) {
  const us = units.map((u) => `${u.id}:${u.pos.x.toFixed(3)},${u.pos.z.toFixed(3)},${u.models.map((m) => m.w).join('/')}`).join(' ')
  trace.push(`${tag} ${us} chunks:${scenery.chunks.filter((c) => c.alive).length} vp:${S.vp.join('-')} rng:${rngState()}`)
}

function log(side, html, cls = '') {
  trace.push(`log ${side} ${html.replace(/<[^>]+>/g, '')} rng:${rngState()}`)
  write(side, html, cls)
  for (const p of S.pendingLog.splice(0)) write(...p)
}
function write(side, html, cls) {
  const list = $('#logList')
  const e = document.createElement('div')
  e.className = `entry s${side} ${cls}`
  e.innerHTML = html
  list.prepend(e)
  while (list.children.length > 80) list.lastChild.remove()
}

const statKeys = ['M', 'WS', 'BS', 'S', 'T', 'W', 'A', 'Ld', 'Sv', 'OC']
function showCard(u) {
  const card = $('#card')
  if (!u) {
    card.classList.remove('show')
    return
  }
  const t = u.t
  const fmt = (k) => (k === 'M' ? `${t.M}"` : ['WS', 'BS', 'Sv'].includes(k) ? `${t[k]}+` : t[k])
  const wpn = (w, icon) => {
    if (!w) return ''
    if (w.mesmerize) return `<div class="wpn"><span>${icon} ${w.name}</span><em>spell ${w.spell}+ · ${w.range}" · D3 mortal + mesmerize</em></div>`
    const bits = []
    if (w.range) bits.push(`${w.range}"`)
    if (w.spell) bits.push(`spell ${w.spell}+`)
    if (w.blast) bits.push(`blast ${w.blast}" ×${w.shots}`)
    else if (w.shots) bits.push(`A${w.shots}`)
    bits.push(`S${w.S}`, `AP-${w.AP}`, `D${w.D}`)
    if (w.poison) bits.push(`poison ${w.poison}+`)
    if (w.indirect) bits.push('indirect')
    if (w.heavy) bits.push('heavy')
    if (w.assault) bits.push('assault')
    return `<div class="wpn"><span>${icon} ${w.name}</span><em>${bits.join(' · ')}</em></div>`
  }
  const status = []
  if (u.flags.moved) status.push(u.flags.fellBack ? 'fell back' : u.flags.advanced ? `advanced +${u.flags.advRoll}"` : 'moved')
  if (u.flags.shot) status.push('shot')
  if (u.flags.charged) status.push('charged')
  if (u.mesmerized) status.push('🌀 mesmerized')
  if (alive(u) && isEngaged(u)) status.push('⚔ in combat')
  if (alive(u) && inCover(u)) status.push('🛡 in cover')
  const models = t.models > 1 ? `${u.alive}/${t.models} models` : `${u.models[0].w}/${t.W} wounds`
  card.innerHTML = `
    <div class="card-head s${u.side}"><b>${t.name}</b><span>${SIDES[u.side].short} · ${t.role}</span></div>
    <div class="card-sub">${alive(u) ? models : 'destroyed'}${status.length ? ' · ' + status.join(' · ') : ''}</div>
    <table class="stats"><tr>${statKeys.map((k) => `<th>${k}</th>`).join('')}</tr><tr>${statKeys.map((k) => `<td>${fmt(k)}</td>`).join('')}</tr></table>
    ${wpn(t.ranged, t.ranged?.spell ? '✦' : '➹')}${wpn({ ...t.melee, range: 0 }, '⚔')}
    <ul class="abil">${(t.abilities || []).map((a) => `<li>${a}</li>`).join('')}</ul>`
  card.classList.add('show')
}

function refreshUI() {
  $('#vp0').textContent = S.vp[0]
  $('#vp1').textContent = S.vp[1]
  $('#round').textContent = S.stage === 'deploy' ? 'Deployment' : `Round ${Math.min(S.round, ROUNDS)} / ${ROUNDS}`
  document.querySelectorAll('#phases .ph').forEach((el) => {
    el.classList.toggle('on', S.stage === 'battle' && el.dataset.k === S.phase)
  })
  $('#sideA').classList.toggle('active', S.stage === 'battle' && S.active === 0)
  $('#sideB').classList.toggle('active', S.stage === 'battle' && S.active === 1)
  const mine = S.stage === 'battle' && human(S.active) && !!phaseResolve && !S.auto
  const sel = S.sel
  const picking = !!S.chargePick
  $('#endPhase').style.display = (mine && !picking) || S.stage === 'deploy' ? '' : 'none'
  $('#closestSpot').style.display = picking ? '' : 'none'
  $('#endPhase').textContent = S.stage === 'deploy' ? 'Begin battle ▸' : `End ${PHASES.find((p) => p.key === S.phase).name} ▸`
  $('#endPhase').disabled = S.busy || S.auto
  $('#autoPhase').style.display = mine && !picking ? '' : 'none'
  const adv = $('#advance')
  adv.style.display = mine && S.phase === 'move' && sel && !sel.flags.moved && !sel.flags.advanced && !isEngaged(sel) ? '' : 'none'
  adv.textContent = `Advance (+D6") — no ${sel?.t.ranged?.assault ? 'charge' : 'shooting or charge'} after`
  if (sel?.t.abilities?.some((a) => a.startsWith('Sidewind'))) adv.textContent = 'Advance (+D6") — can still charge'
  // hint line
  let hint = ''
  if (picking) hint = `Charge! Rolled ${S.chargePick.rolled}" — click the orange area to place ${S.chargePick.u.t.short}, or take the shortest move.`
  else if (S.stage === 'deploy') hint = `Deployment — click one of your units, then click inside your shaded zone to move it there.`
  else if (S.stage === 'battle' && !human(S.active)) hint = `${SIDES[S.active].name} (AI) are taking their turn…`
  else if (mine) {
    hint = {
      move: sel ? (isEngaged(sel) ? 'Engaged — click inside the red area to fall back (no shooting or charging after).' : 'Click inside the shaded area to move. Difficult ground costs double.') : 'Movement — pick a unit with a white ring to move it.',
      shoot: sel ? 'Click an enemy unit to shoot it. Hover for odds.' : 'Shooting — pick a unit with a white ring to fire.',
      charge: sel ? 'Click an enemy within 12" to declare a charge, then roll 2D6.' : 'Charge — pick a unit to charge with.',
    }[S.phase] || ''
  }
  $('#hint').textContent = hint
  $('#hint').style.display = hint ? '' : 'none'
  refreshRings()
}

function refreshRings() {
  const mine = myTurn()
  for (const u of units) {
    if (!alive(u)) continue
    const m = u.ring.material
    let op = 0, col = '#ffffff'
    if (u === S.sel) {
      op = 1
      col = '#ffe680'
    } else if (S.stage === 'deploy' && u.side === S.deploySide) {
      op = 0.5
    } else if (S.chargePick && u === S.chargePick.target) {
      op = 0.95
      col = '#ffa040'
    } else if (mine && S.stage === 'battle' && canAct(u)) {
      op = 0.75
    } else if (mine && S.sel && S.phase === 'shoot' && u.side !== S.sel.side && shotInfo(S.sel, u).ok) {
      op = 0.95
      col = '#ff5a4a'
    } else if (mine && S.sel && S.phase === 'charge' && u.side !== S.sel.side && chargeTargets(S.sel).includes(u)) {
      op = 0.95
      col = '#ffa040'
    } else if (u === S.hover) {
      op = 0.35
    }
    m.opacity = op
    m.color.set(col)
  }
}

async function banner(a, b) {
  const el = $('#banner')
  el.innerHTML = `<div class="b1">${a}</div><div class="b2">${b}</div>`
  el.classList.remove('show')
  void el.offsetWidth
  el.classList.add('show')
  await wait(human(S.active) || S.stage !== 'battle' ? 0.9 : 0.6)
}

// ── Buttons ─────────────────────────────────────────────────────────────────
$('#endPhase').onclick = () => {
  unlock()
  sfx.click()
  if (S.stage === 'deploy') return S.deployDone?.()
  if (S.busy || S.auto || !phaseResolve) return
  select(null)
  phaseResolve()
}
$('#closestSpot').onclick = () => {
  sfx.click()
  if (S.chargePick) placeCharge(S.chargePick.plan.cell)
}
// Every AI action ends by clearing S.busy, so the Auto run holds its own flag:
// without it a click in the gap between two AI actions could start a manual
// charge whose pick outlived the phase.
$('#autoPhase').onclick = async () => {
  if (S.busy || S.auto || !phaseResolve) return
  select(null)
  S.auto = true
  S.busy = true
  refreshUI()
  try {
    await aiPhase(api, S.active, S.phase)
  } finally {
    S.auto = false
    S.busy = false
  }
  phaseResolve?.()
}
$('#advance').onclick = async () => {
  const u = S.sel
  if (!u || S.busy || S.auto) return
  await doAdvance(u)
  select(u)
}
const SPEEDS = [1, 2, 4]
$('#speed').onclick = () => {
  clock.speed = SPEEDS[(SPEEDS.indexOf(clock.speed) + 1) % SPEEDS.length]
  $('#speed').textContent = `⏩ ${clock.speed}×`
}
$('#follow').onclick = () => {
  S.follow = !S.follow
  $('#follow').classList.toggle('off', !S.follow)
}
$('#mute').textContent = isMuted() ? '🔇' : '🔊'
$('#mute').onclick = () => {
  unlock()
  $('#mute').textContent = toggleMute() ? '🔇' : '🔊'
}
$('#helpBtn').onclick = () => $('#help').classList.remove('hidden')
$('#helpClose').onclick = () => $('#help').classList.add('hidden')
$('#logToggle').onclick = () => $('#log').classList.toggle('collapsed')
$('#seed').value = S.seed
$('#reroll').onclick = () => {
  S.seed = (Math.random() * 1e6) | 0
  $('#seed').value = S.seed
  setupTable()
}
$('#seed').onchange = () => {
  S.seed = Number($('#seed').value) || 1
  setupTable()
}
document.querySelectorAll('[data-mode]').forEach((b) => {
  b.onclick = () => {
    unlock()
    sfx.click()
    start(b.dataset.mode)
  }
})
$('#again').onclick = () => {
  $('#over').classList.add('hidden')
  $('#title').classList.remove('hidden')
  document.body.classList.remove('playing')
  S.stage = 'title'
  S.titleSpin = true
  S.titleAngle -= clock.time * 0.035
  S.viewShift = 1
  setupTable()
}

// keyboard panning
const keys = new Set()
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return
  keys.add(e.key.toLowerCase())
  if (e.key === 'Escape' && !S.chargePick) select(null)
})
addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()))
function panKeys(dt) {
  const v = new THREE.Vector3()
  const fwd = new THREE.Vector3().subVectors(controls.target, camera.position).setY(0).normalize()
  const right = new THREE.Vector3(-fwd.z, 0, fwd.x)
  if (keys.has('w') || keys.has('arrowup')) v.add(fwd)
  if (keys.has('s') || keys.has('arrowdown')) v.sub(fwd)
  if (keys.has('d') || keys.has('arrowright')) v.add(right)
  if (keys.has('a') || keys.has('arrowleft')) v.sub(right)
  if (v.lengthSq()) {
    v.normalize().multiplyScalar(dt * 18)
    controls.target.add(v)
    camera.position.add(v)
  }
}

// ── Setup ───────────────────────────────────────────────────────────────────
function setupTable() {
  clearUnits()
  S.vp = [0, 0]
  S.round = 1
  S.wiped = undefined
  S.sel = null
  $('#logList').innerHTML = ''
  $('#tray').classList.remove('show')
  scenery.generate(S.seed, objectives, BOARD.deploy)
  scenery.dirty = true
  refreshNav()
  scatterTufts()
  for (const side of [0, 1]) for (const key of ARMIES[side]) units.push(makeUnit(key, side))
  deployArmies()
  for (const u of units) updateLabel(u)
  // nothing from the last game carries over: banners, scorch marks, turn state
  for (const o of objectives) paintObjective(o, -1)
  fx.clearDecals()
  S.pendingLog = []
  S.phase = 'move'
  S.active = 0
  S.busy = false
  S.waiting = false
  S.chargePick = null
  S.auto = false
  refreshUI()
}

async function start(mode) {
  // a fresh logic-dice stream per battle; ?dice=N replays one exactly
  S.dice = Number(params.get('dice')) || ((Math.random() * 1e9) | 0)
  seedLogic(S.dice)
  trace.length = 0
  S.control = { bushtail: ['human', 'ai'], serpent: ['ai', 'human'], hotseat: ['human', 'human'], watch: ['ai', 'ai'] }[mode]
  $('#title').classList.add('hidden')
  document.body.classList.add('playing')
  S.titleSpin = false
  const p0 = camera.position.clone(), t0 = controls.target.clone()
  const view = defaultView()
  if (innerWidth < 700) $('#log').classList.add('collapsed')
  tween(1.4, (k) => {
    S.viewShift = 1 - k
    camera.position.lerpVectors(p0, view.pos, k)
    controls.target.lerpVectors(t0, view.target, k)
  }, easeInOut)
  // humans get to adjust their deployment first
  for (const side of [0, 1]) {
    if (!human(side)) continue
    S.stage = 'deploy'
    S.deploySide = side
    zoneMats[side].opacity = 0.2
    log(side, `<b>${SIDES[side].name}</b>: deploy your army.`)
    refreshUI()
    await new Promise((res) => (S.deployDone = res))
    zoneMats[side].opacity = 0.07
    S.sel = null
    showCard(null)
  }
  battle()
}

// ── Frame loop ──────────────────────────────────────────────────────────────
const timer = new THREE.Clock()
const tmpV = new THREE.Vector3()
S.titleSpin = true
S.titleAngle = -1.02
S.viewShift = 1

function animateUnits(dt, time) {
  for (const u of units) {
    for (const m of u.models) {
      if (!m.alive && !m.dying) continue
      const a = m.mesh.userData.anim
      if (m.alive) {
        const tx = u.pos.x + m.ox, tz = u.pos.z + m.oz
        const k = 1 - Math.exp(-dt * (u.moving ? 16 : 7))
        const px = m.x, pz = m.z
        m.x += (tx - m.x) * k
        m.z += (tz - m.z) * k
        const sp = Math.hypot(m.x - px, m.z - pz) / Math.max(dt, 1e-4)
        const want = sp > 0.6 ? Math.atan2(m.x - px, m.z - pz) : m.look ?? u.facing
        m.yaw += wrapAngle(want - m.yaw) * (1 - Math.exp(-dt * 8))
        m.moving = sp > 0.6
        let lx = 0, lz = 0
        if (m.lunge > 0) {
          m.lunge = Math.max(0, m.lunge - dt * 2.5)
          const s = Math.sin((1 - m.lunge) * Math.PI) * 0.35
          lx = Math.sin(m.lungeDir) * s
          lz = Math.cos(m.lungeDir) * s
        }
        m.mesh.position.set(m.x + lx, m.lift || 0, m.z + lz)
        m.mesh.rotation.y = m.yaw
      }
      if (!a || !m.alive) continue
      const t = time + m.mesh.userData.phase
      const fig = m.mesh.userData.fig
      if (a.kind === 'squirrel') {
        const hop = m.moving ? Math.abs(Math.sin(t * 13)) * 0.16 : 0
        fig.position.y = fig.userData.y0 + hop
        fig.scale.y = 1 + (m.moving ? 0 : Math.sin(t * 2.4) * 0.018)
        fig.rotation.x = m.moving ? 0.12 : 0
      } else if (a.kind === 'naga') {
        fig.rotation.z = Math.sin(t * (m.moving ? 9 : 1.4)) * (m.moving ? 0.12 : 0.035)
        fig.scale.y = 1 + Math.sin(t * 1.4) * 0.015
      } else if (a.kind === 'machine') {
        if (m.moving) for (const w of a.wheels) w.rotation.x += dt * 6
      }
      if (a.gem) a.gem.rotation.y = t * 2
      if (m.flash > 0) {
        m.flash -= dt
        fig.position.x = Math.sin(time * 60) * 0.04 * (m.flash > 0 ? 1 : 0)
      }
    }
    // the floating label
    if (alive(u) && !FAST) {
      tmpV.set(u.pos.x, (u.t.big ? 2.7 : u.t.fly ? 2.3 : 1.7), u.pos.z).project(camera)
      const on = tmpV.z < 1
      u.label.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * innerWidth}px, ${(-tmpV.y * 0.5 + 0.5) * innerHeight}px) translate(-50%, -100%)`
      u.label.style.visibility = on && S.stage !== 'title' ? 'visible' : 'hidden'
      u.label.classList.toggle('sel', u === S.sel)
    }
  }
}

// Flag and ring in the colours of whoever holds the objective (-1: nobody).
function paintObjective(o, c) {
  o.owner = c
  o.flagMat.color.set(c < 0 ? '#e8e0d0' : SIDES[c].color)
  o.ring.material.color.set(c < 0 ? '#fff3c0' : SIDES[c].color)
}

function animateObjectives(dt, time) {
  for (const o of objectives) {
    const c = S.stage === 'battle' || S.stage === 'over' ? controlOf(o) : -1
    if (c !== o.owner) paintObjective(o, c)
    o.gem.rotation.y = time * 1.2
    o.gem.position.y = 0.45 + Math.sin(time * 2 + o.i) * 0.05
    o.flag.rotation.y = Math.sin(time * 2.2 + o.i) * 0.25
    o.ring.material.opacity = 0.3 + Math.sin(time * 2 + o.i) * 0.08
  }
}

// ?fast: a test mode that skips drawing and lets game time run effectively
// instantly, so a whole AI battle replays in about a minute. Logic is
// unaffected: every animation still resolves, just within a frame.
const FAST = params.has('fast')

function frame() {
  requestAnimationFrame(frame)
  if (FAST) clock.speed = 1e4
  const raw = Math.min(timer.getDelta(), 0.05)
  const dt = raw * clock.speed
  clock.time += dt
  stepTweens(dt)
  fx.update(dt)
  animateUnits(dt, clock.time)
  animateObjectives(dt, clock.time)
  if (S.titleSpin) {
    // a slow drift from behind the Bushtail lines, across toward the Coil
    const a = S.titleAngle + clock.time * 0.035
    camera.position.set(-5 + Math.sin(a) * 25, 13, Math.cos(a) * 25)
    controls.target.set(-5, 0, 0)
  }
  // on the title screen the table slides right, out from under the panel
  const shift = innerWidth > 900 ? S.viewShift : 0
  if (shift > 0.001) camera.setViewOffset(innerWidth, innerHeight, -innerWidth * 0.21 * shift, 0, innerWidth, innerHeight)
  else if (camera.view?.enabled) camera.clearViewOffset()
  panKeys(raw)
  controls.update()
  const sh = fx.shake
  const off = new THREE.Vector3((Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh)
  camera.position.add(off)
  if (!FAST) renderer.render(scene, camera)
  camera.position.sub(off)
}

// Landscape looks across the table; portrait looks down its length from
// behind the Bushtail lines, so the 28" width is what has to fit the screen.
function defaultView() {
  if (innerWidth >= innerHeight) return { pos: new THREE.Vector3(0, 30, 31), target: new THREE.Vector3(0, 0, 1.5) }
  return { pos: new THREE.Vector3(-36, 46, 0), target: new THREE.Vector3(-1, 0, 0) }
}
function fitFov() {
  camera.fov = innerWidth >= innerHeight ? 40 : 56
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
}
fitFov()

addEventListener('resize', () => {
  fitFov()
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

setupTable()
frame()
if (params.has('watch')) start('watch')
// ?debug exposes the table to the console (and to the test harness)
if (params.has('debug')) {
  window.__ts = {
    S, clock, scenery, nav, camera, controls, renderer, validEnd, setUnitPos, trace,
    get units() {
      return units
    },
    screen(x, y, z) {
      const v = new THREE.Vector3(x, y, z).project(camera)
      return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight]
    },
  }
}
