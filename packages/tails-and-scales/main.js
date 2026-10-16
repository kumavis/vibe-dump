import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  BOARD, CHARGE_RANGE, OBJECTIVE_RANGE, ROUNDS, PHASES,
  roll, passes, woundNeed, saveNeed, attackCount, expected, p2D6,
} from './core/rules.js'
import { sidesFor, isMirror, CLASSIC } from './data/compat.js'
import { RACES } from './data/schema.js'
import { EDGES, OBJ_POS, NAV_CELL, makeSeats, edgeOf, ctrl, newState, startMatch, refreshNav } from './core/match.js'
import { setUnitPos } from './core/units.js'
import {
  alive, gap, isEngaged, eyeY, chestY, inCover, controlOf, ownersOf, statusOf,
  canAct, anyCanAct, movePlan, validEnd, nearestValid, freeSpot, shotInfo, shootTargets, chargeTargets, chargePlan, rngState,
} from './core/queries.js'
import { emit, drain, log as logLine, flush, traceState } from './core/journal.js'
import { moralePhase } from './core/actions/morale.js'
import { fightPhase } from './core/actions/fight.js'
import { declareCharge, finishCharge, chargeSpots } from './core/actions/charge.js'
import { doMove as coreMove, doAdvance as coreAdvance } from './core/actions/move.js'
import { doShoot as coreShoot } from './core/actions/shoot.js'
import { gridSize } from './core/nav.js'
import { project } from './present/mirror.js'
import { PACE } from './present/pace.js'
import { TerrainView } from './view/terrain.js'
import { EventPlayer } from './view/player.js'
import { FX } from './fx.js'
import { buildModel, M } from './models.js'
import { clock, tween, wait, stepTweens, easeOut, easeInOut, wrapAngle, lerp } from './util.js'
import { aiPhase } from './ai.js'
import { sfx, unlock, toggleMute, isMuted } from './sfx.js'
import { hypot } from './core/dmath.js'

// ---------------------------------------------------------------------------
// Tails & Scales — a pocket-sized tabletop wargame.
//
// Two armies, alternating player turns, each turn run through five phases:
// Movement → Shooting → Charge → Fight → Morale. Units are squads of models
// that move as a disc; every attack is rolled hit → wound → save → damage and
// the dice are shown. Blast weapons drop a template that can scatter, hurts
// whoever is underneath (friends included) and breaks the scenery.
//
// This file is the table: scene, the units' figures, the actions both a human
// and the AI call (each core/actions/'s, ended here once its events have
// played), the turn loop, the UI, and how each of the match's events looks
// (the EventPlayer's handlers). The
// match state they act on is G (core/match.js): the units, the terrain, the
// turn, the journal; the rules' questions about it are core/queries.js, its
// constants and dice core/rules.js, the races data/, movement core/nav.js,
// the battlefield core/terrain/ (its meshes view/terrain.js), the AI ai.js.
// The rules report what happens as events in G.out (DESIGN §2.3), which the
// player (view/player.js) plays here at the table's pace, folding each into
// the mirror (present/mirror.js): the match as shown, which the figures,
// labels, flags and score read, never G.
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

// deployment zones, one along each seat's edge, in the seat's colour (set by
// paintSeats once the seats are known)
const zoneMats = [], zoneLineMats = []
for (const s of [0, 1]) {
  const sx = EDGES[s]
  const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.07, depthWrite: false })
  zoneMats.push(mat)
  const z = new THREE.Mesh(new THREE.PlaneGeometry(BOARD.deploy, H).rotateX(-Math.PI / 2), mat)
  z.position.set(sx * (W / 2 - BOARD.deploy / 2), 0.008, 0)
  z.renderOrder = 1
  scene.add(z)
  const pts = []
  for (let zz = -H / 2; zz < H / 2; zz += 1) pts.push(new THREE.Vector3(sx * (W / 2 - BOARD.deploy), 0.02, zz), new THREE.Vector3(sx * (W / 2 - BOARD.deploy), 0.02, zz + 0.5))
  const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 })
  zoneLineMats.push(lineMat)
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
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
// Each objective's marker, flag and ring (the objectives themselves are the
// match's, G.objectives, at OBJ_POS); `owner` is whose colours it shows.
const objViews = OBJ_POS.map((p, i) => {
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
  return { i, g, gem, flag, flagMat, ring, owner: -1 }
})

// ── Terrain ─────────────────────────────────────────────────────────────────
// The battlefield's meshes. The battlefield itself is the match's
// (G.terrain): each terrain call reports what it built or broke into G.out,
// and the player plays that (the terrain.* handlers) straight after the
// call, in order.
const terrainView = new TerrainView(scene, fx)
terrainView.onBreak = (c) => {
  if (c.kind === 'block') sfx.crumble()
  else sfx.thwack()
}

// ── Game state ──────────────────────────────────────────────────────────────
// The table's and the screen's own state: the board seed and who plays each
// seat as the title screen has them, and input and camera state. The match's
// state (the turn, the score, the units) is G's.
const S = {
  seed: Number(params.get('seed')) || ((Math.random() * 1e6) | 0),
  control: ['human', 'ai'],
  busy: false,
  sel: null,
  reach: null,
  hover: null,
  follow: true,
}
// The races at the table: the classic Bushtails-versus-Coil matchup, or any
// pair a ?races=<seat 0>,<seat 1> URL names (e.g. ?races=serpent,serpent),
// until the title screen gets a race picker. A value naming no two races
// gets the classic matchup and a line on the title card saying why, not a
// page that never starts (sim/mirror-check.mjs fails a run whose log shows
// other races than it asked for).
const RACE_PICK = (() => {
  if (!params.has('races')) return CLASSIC
  const pick = params.get('races').split(',').map((r) => r.trim().toLowerCase())
  if (pick.length === 2 && pick.every((r) => RACES[r])) return pick
  const msg = `?races= takes two of ${Object.keys(RACES).join(', ')}, comma-separated, not "${params.get('races')}"`
  console.warn(`${msg}: playing the classic matchup`)
  const note = document.createElement('p')
  note.className = 'small'
  note.textContent = `${msg}, so this is the classic matchup.`
  $('#title .modes').before(note)
  return CLASSIC
})()
// The match (core/match.js): everything the rules read and write. A new one
// for every table the title screen shows (setupTable); start() begins the
// battle on it, so nothing carries over from one battle to the next.
let G = null
// The dice of the table the title screen shows. Nothing draws from them:
// start() gives the battle its own. (Drawn once, at load, where the R1-R3
// code drew its placeholder stream, so the view's own Math.random draws after
// it keep their order.)
const TABLE_DICE = (Math.random() * 1e9) | 0
// Under ?debug every match reports its trace lines here as it writes them,
// and start() says when a battle begins; only the ?debug block listens (sim/
// reads one trace for the page's lifetime, emptied as each battle begins).
// Without ?debug a match has no onTrace.
let traceListener = null
const DEBUG = params.has('debug')
const onTrace = DEBUG ? (line, g) => traceListener?.line(line, g) : null
// each seat's name, icon and colours, from its race (data/compat.js)
let SIDES = sidesFor(makeSeats(RACE_PICK, S.control))

// Seat the players: the races at the table, with the mode's controllers
// (startMatch has set G.seats).
function seatPlayers() {
  SIDES = sidesFor(G.seats)
  paintSeats()
}
// The HUD, unit labels, battle log and card take each seat's colour from
// --s0/--s1, and the active seat's HUD glow from --s0-glow/--s1-glow
// (style.css holds the classic pair, which the title screen's copy keeps);
// the HUD shows each seat's race, and the zones are its colour.
const seatStyle = document.createElement('style')
document.body.appendChild(seatStyle)
const glow = (hex) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')}, 0.45)`
function paintSeats() {
  seatStyle.textContent = `#hud, #labels, #log, #card { --s0: ${SIDES[0].color}; --s1: ${SIDES[1].color}; ` +
    `--s0-glow: ${glow(SIDES[0].color)}; --s1-glow: ${glow(SIDES[1].color)}; }`
  for (const s of [0, 1]) {
    const hud = s ? '#sideB' : '#sideA'
    $(`${hud} .ic`).textContent = SIDES[s].icon
    $(`${hud} .nm`).textContent = SIDES[s].name
    zoneMats[s].color.set(SIDES[s].color)
    zoneLineMats[s].color.set(SIDES[s].color)
  }
}
paintSeats()
// In a mirror match both seats' names read the same, so text that names a
// seat outside the HUD (the turn banner, the end screen) takes the seat's
// colour; otherwise it keeps its own ('' leaves the stylesheet's).
const seatInk = (s) => (s >= 0 && isMirror(G.seats) ? SIDES[s].color : '')

const human = (side) => ctrl(G, side) === 'human'

// ── Units' figures ──────────────────────────────────────────────────────────
// A unit's view, by unit id: its figures, selection ring, hit cylinder (for
// picking) and floating label, which way it faces, whether it is walking;
// and per model (models[k] draws the unit's models[k]) where its figure
// stands this frame, which way it turns and how it lunges, lifts, flinches,
// dies or flees. The rules never read any of it. It follows the unit as
// shown (the mirror's record of it, `shown(u)`: its place, its slots, who
// still stands), and of the unit itself reads only what never changes in a
// match (`v.u`: its type, its seat, its race).
const views = new Map()
const V = (u) => views.get(u.id)
const unitOf = (id) => views.get(id).u
const shown = (u) => player.mirror.units[u.id]
// the figures of a unit's models still standing
const standing = (u) => V(u).models.filter((_, k) => shown(u).models[k].alive)

function makeView(u) {
  // facing across the table, away from the seat's own edge (kept: a fleeing
  // figure runs off over it)
  const edge = edgeOf(G, u.side)
  const facing = -edge * Math.PI / 2
  // (at: where a walk has got to while a unit.move plays; null otherwise)
  const v = { u, edge, facing, moving: false, at: null, models: [] }
  for (let i = 0; i < u.t.models; i++) {
    const mesh = buildModel(u.key, u.t, SIDES[u.side].color)
    scene.add(mesh)
    v.models.push({ mesh, x: 0, z: 0, yaw: facing, lunge: 0, lungeDir: 0, lift: 0 })
  }
  // selection / status ring
  v.ring = new THREE.Mesh(new THREE.RingGeometry(0.88, 1, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false, toneMapped: false }))
  v.ring.position.y = 0.04
  v.ring.renderOrder = 2
  scene.add(v.ring)
  v.hit = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 12), new THREE.MeshBasicMaterial({ visible: false }))
  v.hit.userData.unit = u
  scene.add(v.hit)
  v.label = document.createElement('div')
  v.label.className = `ulabel s${u.side}`
  overlayEl.appendChild(v.label)
  views.set(u.id, v)
  syncView(u)
  // the figures stand in their slots from the start
  const mu = shown(u)
  mu.models.forEach((m, k) => {
    const f = v.models[k]
    f.x = mu.pos.x + m.ox
    f.z = mu.pos.z + m.oz
    f.mesh.position.set(f.x, 0, f.z)
    f.mesh.rotation.y = f.yaw
  })
}

// The ring and hit cylinder follow the unit's disc as shown: its place (or,
// while it walks a unit.move, where the walk has got to: v.at) and radius.
function syncView(u) {
  const v = V(u), mu = shown(u), p = v.at ?? mu.pos
  v.ring.scale.setScalar(mu.r + 0.18)
  const tall = u.t.big ? 2.4 : u.t.fly ? 1.8 : 1.3
  v.hit.scale.set(mu.r, tall, mu.r)
  v.ring.position.x = v.hit.position.x = p.x
  v.ring.position.z = v.hit.position.z = p.z
  v.hit.position.y = v.hit.scale.y / 2
}
// Put a unit somewhere (a deployment's placement, and ?debug's setUnitPos),
// and show it there: its ring and hit cylinder go at once, the figures walk
// (animateUnits). (A move or a charge walks: core/actions/move.js's
// resolveWalk, a unit.move event.) In battle, which only ?debug's
// setUnitPos reaches, the flags and labels go with it as a walk's do, so
// the table shows who holds what and who is in combat at once.
function moveUnit(u, x, z) {
  setUnitPos(u, x, z)
  emit(G, 'unit.place', { u: u.id, x, z })
  if (G.turn.stage === 'battle') {
    emit(G, 'objectives', { owners: ownersOf(G) })
    emit(G, 'status', statusOf(G))
  }
  show()
}

// The label: the unit as shown (models standing or wounds left, mesmerized,
// in combat).
function updateLabel(u) {
  const mu = shown(u)
  const w = mu.models.filter((m) => m.alive)
  let html = `<span class="nm">${u.t.short}</span>`
  if (u.t.models > 1) html += `<span class="ct">${mu.alive}/${u.t.models}</span>`
  else html += `<span class="ct">${w[0] ? w[0].w : 0}/${u.t.W}♥</span>`
  if (mu.mesmerized) html += `<span class="st" title="Mesmerized">🌀</span>`
  if (mu.alive > 0 && mu.engaged) html += `<span class="st" title="In combat">⚔</span>`
  const v = V(u)
  v.label.innerHTML = html
  v.label.style.display = mu.alive > 0 ? '' : 'none'
}

function clearUnits() {
  for (const v of views.values()) {
    for (const f of v.models) scene.remove(f.mesh)
    scene.remove(v.ring, v.hit)
    v.label.remove()
  }
  views.clear()
}

// ── Playing the match's events ──────────────────────────────────────────────
// The rules run ahead and leave what happened in G.out (DESIGN §2.3); the
// player plays it here at the table's pace, each kind of event with the old
// code's visuals, after folding it into the mirror (present/mirror.js), the
// match as shown. Every action is core/actions/'s, and none of them awaits
// anything: until R6's engine runs them, each is called here as
// `fn(G, …)` and its events played before the turn loop goes on
// (`await played(fn(G, …))`); this file's own events (a deployment's
// placement, a phase begun, an action's end) are played as it emits them
// (`show()`), which takes no time when the player is idle.
const HANDLERS = {
  // the battle log, the dice tray, and the beats between
  log: (e) => write(e.side, e.html, e.cls, e.at),
  'tray.open': (e) => tray.clear(e.title),
  dice: (e) => tray.row(e.label, e.dice, e.need, e),
  pause: (e) => wait(PACE.pause(e.s)),
  // the camera, when it follows the action
  focus: (e) => focus(e.x, e.z),
  // the figures
  'unit.place': (e) => syncView(unitOf(e.u)),
  'unit.formation': (e) => {
    const u = unitOf(e.u)
    syncView(u)
    updateLabel(u)
  },
  'unit.wound': (e) => wounded(e),
  'unit.slain': (e, M) => slain(e, M),
  'unit.flee': (e) => fled(e),
  'unit.destroyed': (e, M) => destroyed(e, M),
  'unit.face': (e) => face(unitOf(e.u), unitOf(e.tg)),
  'unit.move': (e, M) => walked(e, M),
  melee: (e) => lunge(e),
  'charge.result': (e) => shout(e),
  // the shooting
  volley: (e) => volley(e),
  'blast.aim': (e) => aimed(e),
  'blast.scatter': (e) => scattered(e),
  'blast.fire': (e) => fired(e),
  'blast.land': (e) => landed(e),
  'spell.cast': () => {
    sfx.magic()
  },
  'spell.fizzle': (e) => {
    sfx.fizzle()
    fx.text(top(unitOf(e.u)), 'Fizzle…', '#c8b8ff')
  },
  'spell.thorns': (e) => thorns(e),
  'spell.fade': (e) => faded(e),
  'spell.gaze': (e) => gaze(e),
  'spell.mesmerized': (e) => {
    fx.text(top(unitOf(e.tg)), 'Mesmerized!', '#e0a0ff', { size: 20 })
  },
  // what the labels, flags and score show: read off the mirror, which these
  // have just updated (the flags repaint each frame, animateObjectives)
  status: () => {
    for (const v of views.values()) updateLabel(v.u)
  },
  objectives: () => {},
  'round.scored': () => {},
  'phase.start': () => {},
  stage: () => {},
  act: () => {},
  // (?debug) a checkpoint for sim/present-check.mjs
  check: () => {},
  // the battlefield
  'terrain.clear': (e, M) => terrainView.apply(e, M),
  'terrain.add': (e, M) => terrainView.apply(e, M),
  'terrain.hurt': (e, M) => terrainView.apply(e, M),
  'terrain.destroy': (e, M) => terrainView.apply(e, M),
  'terrain.collapse': (e, M) => terrainView.apply(e, M),
  'terrain.rubble': (e, M) => terrainView.apply(e, M),
  // an event this table has no visuals for yet: its text over the unit (or
  // the place) it names, then a beat
  fallback: (e, M) => {
    const at = e.u !== undefined && M.units[e.u] ? M.units[e.u].pos : { x: e.x ?? 0, z: e.z ?? 0 }
    if (e.text) fx.text({ x: at.x, y: 1.6, z: at.z }, e.text, '#ffffff')
    return wait(e.beat ?? PACE.beat)
  },
}
// Under ?debug the page's trace keeps pace with the player (the ?debug
// block's listener): told when the player has played everything.
const player = new EventPlayer({ handlers: HANDLERS, onIdle: () => traceListener?.idle() })
// play what the rules have emitted since the last drain
const show = () => player.play(drain(G))
// show(), and under ?debug end what it plays with a `check` carrying
// project(G) as the match stands, which sim/present-check.mjs holds the
// mirror to once it has played. The checkpoints: after an action's events
// (played(), below: the flags' and labels' events inside an action
// included, which the next action's end would otherwise refresh before its
// `act`), and after the stage events main.js emits (a deployment's, the
// battle's start: a lost one shows until the next stage event, which can
// come before any `act`).
function checkpoint() {
  if (DEBUG) emit(G, 'check', { proj: project(G) })
  return show()
}
// An action's result (core/actions/'s), once its events have played (and
// been checked, under ?debug).
async function played(result) {
  await checkpoint()
  return result
}

// A wound that leaves the model standing: the number, and a flinch.
function wounded(e) {
  const u = unitOf(e.u), f = V(u).models[e.m]
  fx.text({ x: f.x, y: (u.t.big ? 2.3 : 1.3), z: f.z }, `-${e.dmg}`, '#ff5a4a', { size: u.t.big ? 24 : 18 })
  f.flash = 0.4
}

// A model slain: the number, a squeak or a hiss, fur or scales flying, and
// the figure keels over away from whoever did it, then sinks out of sight.
function slain(e, M) {
  const u = unitOf(e.u), f = V(u).models[e.m]
  fx.text({ x: f.x, y: (u.t.big ? 2.3 : 1.3), z: f.z }, `-${e.dmg}`, '#ff5a4a', { size: u.t.big ? 24 : 18 })
  f.dying = true
  // the race's own voice and gore
  const look = RACES[u.race].look
  sfx[look.voice]()
  const fig = f.mesh.userData.fig
  const by = e.by === null ? null : M.units[e.by]
  const dir = by ? Math.atan2(f.x - by.pos.x, f.z - by.pos.z) - f.yaw : 0
  const side = Math.sin(dir) >= 0 ? 1 : -1
  fx.debris(f.x, 0.5, f.z, look.gore, 6, { power: 2, size: 0.07 })
  tween(0.6, (k) => {
    fig.rotation.z = side * k * 1.45
    fig.position.y = (u.t.big ? 0.09 : 0.06) + Math.sin(k * Math.PI) * 0.15
  }, easeOut)
    .then(() => wait(1.4))
    .then(() => tween(0.8, (k) => (f.mesh.position.y = -k * 1.4)))
    .then(() => {
      scene.remove(f.mesh)
      f.dying = false
    })
}

// A unit gone: its label, ring and hit cylinder go, and the table says so in
// the colours of whoever did it.
function destroyed(e, M) {
  const u = unitOf(e.u), v = V(u), p = M.units[e.u].pos
  v.label.style.display = 'none'
  v.ring.visible = false
  v.hit.visible = false
  scene.remove(v.hit)
  fx.text({ x: p.x, y: 2.2, z: p.z }, `${u.t.short} destroyed`, SIDES[e.by !== null ? unitOf(e.by).side : 1 - u.side].color, { size: 20, life: 2 })
}

// A melee: the attackers lunge at their target (a thwack), and as the hit
// row settles (the next event: the core emits the dice straight after
// this, and the old code threw the sparks once that row had waited) sparks
// fly over the models it hit.
function lunge(e) {
  const u = unitOf(e.u), target = unitOf(e.tg), tv = V(target)
  const at = shown(target).pos
  for (const f of standing(u)) {
    f.lunge = 1
    f.lungeDir = Math.atan2(at.x - f.x, at.z - f.z)
  }
  sfx.thwack()
  if (!e.hits) return
  wait(PACE.dice(e.n)).then(() => {
    // (nothing of a table since replaced)
    if (views.get(target.id) !== tv) return
    for (let i = 0; i < Math.min(e.hits, 8); i++) {
      const v = standing(target)[i % Math.max(1, shown(target).alive)]
      if (v) for (let k = 0; k < 4; k++) fx.mote({ x: v.x, y: 0.6, z: v.z, vx: (Math.random() - 0.5) * 5, vy: Math.random() * 4, vz: (Math.random() - 0.5) * 5, size: 0.05, color: '#fff2b0', life: 0.3, g: 12 })
    }
  })
}

// ── Movement ────────────────────────────────────────────────────────────────
// A unit walks its path (unit.move, from core/actions/move.js's
// resolveWalk: a move, an advance's move, a fall back, a charge): a wrecker
// setting off on a move stomps (`stomp`), then its disc goes along the path
// in game time, the figures following, as the old walk moved the unit
// itself, and what a wrecker smashed breaks as the walker passes each
// sample (the terrain events the sample made); then a breath. The mirror
// already holds where the walk ends, so until it gets there the view draws
// the disc at v.at, where the walk has got to.
async function walked(e, M) {
  const u = unitOf(e.u), v = V(u)
  const { path: pts, L, speed, fly, smashes } = e
  if (e.stomp) sfx.boom(0.4)
  v.moving = true
  if (fly) for (const f of v.models) f.flying = true
  const seg = []
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const l = hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
    seg.push({ a: pts[i - 1], b: pts[i], s: acc, l })
    acc += l
  }
  let next = 0
  const smash = ({ ev }) => {
    for (const x of ev) terrainView.apply(x, M)
    fx.shake = Math.max(fx.shake, 0.08)
  }
  // (nothing of a table since replaced: its unit ids count from 1 again)
  const gone = () => views.get(e.u) !== v
  await tween(L / speed + 0.15, (k) => {
    if (gone()) return
    const d = Math.min(L, k * (L + speed * 0.15))
    const s = seg.find((q) => d <= q.s + q.l) || seg[seg.length - 1]
    const f = s.l > 0 ? (d - s.s) / s.l : 1
    v.facing = Math.atan2(s.b.x - s.a.x, s.b.z - s.a.z)
    v.at = { x: lerp(s.a.x, s.b.x, f), z: lerp(s.a.z, s.b.z, f) }
    syncView(u)
    if (fly) for (const f of v.models) f.lift = Math.sin(Math.min(1, d / L) * Math.PI) * Math.min(3, L * 0.3)
    while (next < smashes.length && smashes[next].s <= d) smash(smashes[next++])
  }, easeInOut)
  if (gone()) return
  while (next < smashes.length) smash(smashes[next++])
  // there: drawn where the mirror has it from now on
  v.at = null
  syncView(u)
  v.moving = false
  if (fly) for (const f of v.models) (f.flying = false), (f.lift = 0)
  await wait(0.15)
}

// The movement phase's actions are core/actions/move.js's (a move, which is
// also an advance's move and a fall back; the advance roll): here, the
// action's end once their events have played, so its `act` line is
// written with nothing left to show. The advance roll writes none (DESIGN
// §4.1 rule 8): the move after it does. A move takes the unit and the
// cell only, as R6's `move` command will (the ?debug hook's third argument,
// sim/oracle's S.reach, goes unused): core makes the plan afresh from the
// unit's flags, and parity holds every corpus move made on it to the old
// move, made on the plan its cell was picked from (a click's S.reach, the
// AI's own); a one-off probe at R5c also found the two plans deep-equal at
// every corpus move.
async function doMove(u, cell) {
  S.busy = true
  await played(coreMove(G, u, cell))
  finishAction()
}

async function doAdvance(u) {
  S.busy = true
  const r = await played(coreAdvance(G, u))
  S.busy = false
  return r
}

// ── Shooting ────────────────────────────────────────────────────────────────
// The shot is core/actions/shoot.js's (a volley, a blast weapon's
// templates, a spell): here, the action's end once its events have played,
// so its `act` line is written with nothing left to show, and how each of
// those events looks.
async function doShoot(u, target) {
  S.busy = true
  await played(coreShoot(G, u, target))
  finishAction()
}

// A volley: projectiles for a non-blast volley — a handful, not one per
// shot (e.n), from the shooters standing to the figures they shoot at.
async function volley(e) {
  const u = unitOf(e.u), target = unitOf(e.tg), uv = V(u)
  // (nothing of a table since replaced)
  const gone = () => views.get(e.u) !== uv
  const shooters = standing(u)
  const victims = standing(target)
  const flights = []
  const n = Math.min(10, e.n)
  for (let i = 0; i < n; i++) {
    const s = shooters[i % shooters.length]
    const v = victims[(Math.random() * victims.length) | 0]
    const a = { x: s.x, y: eyeY(u) * 0.8 + s.lift, z: s.z }
    const b = { x: v.x + (Math.random() - 0.5) * 0.6, y: chestY(target) * 0.8, z: v.z + (Math.random() - 0.5) * 0.6 }
    flights.push(wait(i * 0.06).then(() => {
      if (gone()) return
      sfx.shot()
      return fx.projectile(a, b, projectileStyle(e.fx))
    }).then(() => {
      if (gone()) return
      for (let k = 0; k < 5; k++) fx.mote({ x: b.x, y: b.y, z: b.z, vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3, vz: (Math.random() - 0.5) * 4, size: 0.05, color: e.fx === 'spit' ? '#9aff5a' : '#ffe0a0', life: 0.35, g: 10 })
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

// Blast weapons: the template's marker where it is aimed, held on the table
// until the template is thrown (blast.aim); on a miss, its scatter
// (blast.scatter); the throw (blast.fire); then where it lands (blast.land).
// The marker is view state the mirror doesn't hold: a new table takes it
// away (setupTable), and a snap must too (DESIGN §2.4), since it drops the
// blast.fire that would have.
let blastMarker = null
function aimed(e) {
  blastMarker = fx.ring(e.x, e.z, e.r, '#ffffff', { hold: true, fill: 0.12 })
}

// (it moves its own marker only: a table since replaced has taken that away)
async function scattered(e) {
  const marker = blastMarker
  fx.text({ x: e.from.x, y: 1.5, z: e.from.z }, `scatter ${e.d}"`, '#ffd36e', { size: 15 })
  await tween(0.35, (t) => marker?.position.set(lerp(e.from.x, e.to.x, t), 0.05, lerp(e.from.z, e.to.z, t)), easeOut)
}

async function fired(e) {
  const v = V(unitOf(e.u))
  await artilleryFire(e)
  // (nothing of a table since replaced, whose marker went with it)
  if (views.get(e.u) !== v) return
  blastMarker?.userData.remove()
  blastMarker = null
}

// The throw: a war machine's arm (or the acid engine's globe) swings, a
// grenadier winds up, and the shot flies from the first figure standing.
async function artilleryFire(e) {
  const u = unitOf(e.u), v = V(u), land = e.to
  // (nothing of a table since replaced)
  const gone = () => views.get(e.u) !== v
  const src = standing(u)[0]
  const anim = src.mesh.userData.anim
  if (anim?.throwArm) {
    const r0 = anim.rest
    sfx.thwack()
    tween(0.25, (k) => (anim.throwArm.rotation.x = r0 - 2.1 * easeOut(k))).then(() => tween(0.8, (k) => (anim.throwArm.rotation.x = r0 - 2.1 * (1 - k))))
    if (anim.globe) anim.globe.visible = false
    await wait(0.15)
    if (gone()) return
  } else {
    // a grenadier winds up
    src.lunge = 1
    src.lungeDir = Math.atan2(land.x - src.x, land.z - src.z)
  }
  const a = { x: src.x, y: u.t.big ? 1.8 : 0.9, z: src.z }
  sfx.shot()
  await fx.projectile(a, { x: land.x, y: 0.15, z: land.z }, projectileStyle(e.fx))
  if (gone()) return
  if (anim?.globe) anim.globe.visible = true
}

// Where a template lands: an explosion and a boom (a thornburst's thorns
// have made their own), and the template's ring, which fades.
function landed(e) {
  if (e.fx !== 'thorns') {
    fx.explode(e.x, e.z, e.r, e.fx === 'acid' ? 'acid' : 'fire')
    sfx.boom(e.r / 2)
  }
  fx.ring(e.x, e.z, e.r, e.fx === 'acid' ? '#8aff5a' : '#ff9a4a', { life: 1.4, fill: 0.2 })
}

// A thornburst: motes from the caster's gem, thorns bursting up through the
// turf over the template, and their own explosion; they stand until the
// spell is done (spell.fade), then sink away. Like the marker, the spikes
// are view state the mirror doesn't hold: a new table takes them away
// (setupTable), and a snap must too (DESIGN §2.4), since it drops the
// spell.fade that would have.
const spikesOf = new Map()
async function thorns(e) {
  const cv = V(unitOf(e.u))
  const gem = cv.models[0].mesh.userData.anim.gem
  if (gem) {
    const p = new THREE.Vector3()
    gem.getWorldPosition(p)
    for (let i = 0; i < 20; i++) fx.mote({ x: p.x, y: p.y, z: p.z, vx: (Math.random() - 0.5) * 3, vy: Math.random() * 3, vz: (Math.random() - 0.5) * 3, size: 0.06, color: '#9aff7a', life: 0.8, g: -1 })
  }
  // thorns burst up through the turf
  const spikes = []
  const geo = new THREE.ConeGeometry(0.12, 1, 5)
  for (let i = 0; i < 26; i++) {
    const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * e.r
    const s = new THREE.Mesh(geo, M(i % 3 ? '#5a7a2a' : '#7a5a2a'))
    s.position.set(e.x + Math.cos(a) * d, -0.6, e.z + Math.sin(a) * d)
    s.rotation.set((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6)
    s.scale.set(1, 0.6 + Math.random() * 1.1, 1)
    s.castShadow = true
    scene.add(s)
    spikes.push(s)
  }
  spikesOf.set(e.u, spikes)
  await tween(0.3, (k) => spikes.forEach((s) => (s.position.y = -0.6 + easeOut(k) * (0.3 + s.scale.y * 0.4))))
  // (nothing of a table since replaced: no scorch mark on the new one)
  if (views.get(e.u) !== cv) return
  fx.explode(e.x, e.z, e.r, 'thorns')
}

function faded(e) {
  const spikes = spikesOf.get(e.u) ?? []
  spikesOf.delete(e.u)
  tween(1.2, (k) => spikes.forEach((s) => (s.position.y -= 0.02 * k))).then(() => spikes.forEach((s) => scene.remove(s)))
}

// A mesmerizing gaze: a beam of motes from the caster's head to the
// target's, then rings around the target.
async function gaze(e) {
  const target = unitOf(e.tg), tv = V(target)
  // (nothing of a table since replaced)
  const gone = () => views.get(e.tg) !== tv
  const from = top(unitOf(e.u)), to = top(target)
  const beam = []
  for (let i = 0; i <= 16; i++) {
    const k = i / 16
    beam.push(wait(k * 0.3).then(() => gone() || fx.mote({ x: lerp(from.x, to.x, k), y: lerp(from.y, to.y, k) + Math.sin(k * Math.PI) * 0.8, z: lerp(from.z, to.z, k), size: 0.09, color: '#c070ff', life: 0.7, g: 0 })))
  }
  await Promise.all(beam)
  if (gone()) return
  const at = shown(target)
  for (let i = 0; i < 3; i++) fx.ring(at.pos.x, at.pos.z, at.r * (0.6 + i * 0.35), '#c070ff', { life: 1.2 + i * 0.3, fill: 0.08 })
}

// ── Charge ──────────────────────────────────────────────────────────────────
// The charge is core/actions/charge.js's: declareCharge rolls, and on
// contact moves the charger on (an AI seat's, or Auto's, shortest move) or
// hands back what a human picks the spot from; finishCharge moves it to the
// spot picked. Here: the pick, and the action's end once the charge's
// events have played, so its `act` line is written with nothing left to
// show (under ?debug no state line waits in the trace's hold).
async function doCharge(u, target, { auto = false } = {}) {
  S.busy = true
  const pick = await played(declareCharge(G, u, target, auto || !human(u.side) ? 'ai' : 'seat'))
  // a human chooses where around the target to end
  if (pick) {
    const cell = await pickChargeSpot(u, target, pick.plan, pick.rolled)
    await played(finishCharge(G, u, target, cell))
  }
  // (the charger's ⚔ came with its walk's own `status`, as the walk ended:
  // the moment finishAction's showed it before)
  finishAction()
}

// Shade every spot the roll reaches and wait for a click on one of them.
function pickChargeSpot(u, target, plan, rolled) {
  const ok = chargeSpots(plan, rolled)
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
  const nav = G.nav
  let best = -1, bd = within
  for (let i = 0; i < nav.N; i++) {
    if (!pick.ok[i]) continue
    const d = hypot(nav.x(i) - x, nav.z(i) - z)
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

// ── Morale ──────────────────────────────────────────────────────────────────
// (the test is core/actions/morale.js; here, how a fleeing model looks:
// off the table over its unit's own edge)
function fled(e) {
  const u = unitOf(e.u), v = V(u), f = v.models[e.m]
  f.dying = true
  const edge = v.edge
  const ex = edge * (W / 2 + 3)
  const x0 = f.x, z0 = f.z
  f.fleeing = true
  fx.text({ x: f.x, y: 1.4, z: f.z }, 'flees!', '#e0e0e0', { size: 14 })
  f.yaw = edge * Math.PI / 2
  tween(2.2, (k) => {
    f.x = lerp(x0, ex, k)
    f.z = z0
    f.mesh.position.set(f.x, Math.abs(Math.sin(k * 30)) * 0.2, f.z)
    f.mesh.rotation.y = f.yaw
  }).then(() => {
    scene.remove(f.mesh)
    f.dying = false
  })
}

// ── View helpers the handlers share ─────────────────────────────────────────
// `u` turns to face `target`, as both are shown (a unit.face event's).
function face(u, target) {
  const v = V(u), at = shown(target).pos, from = shown(u).pos
  v.facing = Math.atan2(at.x - from.x, at.z - from.z)
  for (const f of v.models) f.look = Math.atan2(at.x - f.x, at.z - f.z)
}
// over a unit's head, as shown
const top = (u) => {
  const p = shown(u).pos
  return { x: p.x, y: u.t.big ? 2.6 : 1.6, z: p.z }
}
// A charge roll's verdict, over the charger's head.
function shout(e) {
  const u = unitOf(e.u)
  if (e.ok) fx.text(top(u), 'CHARGE!', SIDES[u.side].color, { size: 22 })
  else fx.text(top(u), 'Charge failed', '#d0d0d0')
}

// An action's end: its state line in the trace, then what the table shows
// of it (who holds each objective; every label), and the `act` itself,
// which under ?debug carries the match as it should now be shown
// (sim/present-check.mjs holds the mirror to it).
function finishAction() {
  traceState(G, 'act')
  emit(G, 'objectives', { owners: ownersOf(G) })
  emit(G, 'status', statusOf(G))
  emit(G, 'act', DEBUG ? { tag: 'act', proj: project(G) } : { tag: 'act' })
  show()
  S.busy = false
  if (S.sel && !canAct(G, S.sel)) select(null)
  else if (S.sel) select(S.sel)
  refreshUI()
  checkWipe()
}

function checkWipe() {
  for (const s of [0, 1]) if (!G.units.some((u) => u.side === s && alive(u))) G.turn.wiped = s
}

// ── Camera focus for AI turns ───────────────────────────────────────────────
// (the stage and the seat to act as shown: a focus event plays while the
// match may have run ahead; the AI's own calls come with the player idle)
let focusTween = null
function focus(x, z) {
  const M = player.mirror
  if (!S.follow || M.stage !== 'battle') return
  if (human(M.active) && ctrl(G, 0) !== ctrl(G, 1)) return
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

// ── What the AI acts through ────────────────────────────────────────────────
// (it reads the match itself, with the core queries)
const act = { doMove, doAdvance, doShoot, doCharge, focus }

// ── Turn loop ───────────────────────────────────────────────────────────────
let phaseResolve = null

// The battle, on G.turn (one match: G is not replaced while it runs, since
// only the title screen and the end screen build a new table).
async function battle() {
  const T = G.turn
  T.stage = 'battle'
  // the flags show who holds what from now on
  emit(G, 'stage', { stage: 'battle' })
  emit(G, 'objectives', { owners: ownersOf(G) })
  checkpoint()
  select(null)
  zoneMats.forEach((m) => (m.opacity = 0.05))
  // roll off for first turn
  tray.clear('Roll-off for the first turn')
  let a, b
  do {
    a = roll(G, 1)
    b = roll(G, 1)
    await tray.row(SIDES[0].short, a, 0, { sum: true })
    await tray.row(SIDES[1].short, b, 0, { sum: true })
  } while (a[0] === b[0])
  T.first = a[0] > b[0] ? 0 : 1
  log(T.first, `<b>${SIDES[T.first].name}</b> win the roll-off and take the first turn.`, 'big')
  for (T.round = 1; T.round <= G.setup.rounds; T.round++) {
    for (let t = 0; t < 2; t++) {
      T.active = (T.first + t) % 2
      await playerTurn(T.active)
      if (T.wiped >= 0) return gameOver()
    }
    await scoreRound()
  }
  gameOver()
}

async function playerTurn(side) {
  const T = G.turn
  for (const u of G.units) {
    u.lost = 0
    if (u.side === side) u.flags = {}
  }
  for (const ph of PHASES) {
    T.phase = ph.key
    emit(G, 'phase.start', { side, phase: T.phase, round: T.round })
    show()
    select(null)
    tray.el.classList.remove('show')
    refreshUI()
    await banner(`${SIDES[side].icon} ${SIDES[side].name}`, ph.name, side)
    if (ph.key === 'fight') {
      if (G.units.some((u) => alive(u) && isEngaged(G, u))) await played(fightPhase(G, side))
    } else if (ph.key === 'morale') {
      await played(moralePhase(G))
    } else if (!anyCanAct(G, side)) {
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
      await aiPhase(G, side, ph.key, act)
    }
    traceState(G, `phase ${side}:${ph.key}`)
    checkWipe()
    if (T.wiped >= 0) return
  }
  // mesmerism wears off at the end of the victim's own turn
  for (const u of G.units) if (u.side === side && u.mesmerized) u.mesmerized = false
  emit(G, 'status', statusOf(G))
  show()
}

async function scoreRound() {
  const T = G.turn
  const held = [0, 0]
  for (const o of G.objectives) {
    const c = controlOf(G, o)
    if (c >= 0) {
      held[c]++
      fx.ring(o.x, o.z, OBJECTIVE_RANGE, SIDES[c].color, { life: 1.6, fill: 0.15 })
    }
  }
  T.vp[0] += held[0]
  T.vp[1] += held[1]
  traceState(G, `round ${T.round}`)
  log(-1, `End of round ${T.round}: ${SIDES[0].short} hold ${held[0]} objective${held[0] === 1 ? '' : 's'}, ${SIDES[1].short} hold ${held[1]}. Score ${T.vp[0]}–${T.vp[1]}.`, 'big')
  emit(G, 'round.scored', { round: T.round, held: [...held], vp: [...T.vp], owners: ownersOf(G) })
  show()
  refreshUI()
  await banner(`End of round ${T.round}`, `VP ${T.vp[0]} – ${T.vp[1]}`)
}

function gameOver() {
  const T = G.turn
  // the destroyed-unit lines still held back
  flush(G)
  show()
  traceState(G, 'over')
  T.stage = 'over'
  emit(G, 'stage', { stage: 'over' })
  show()
  select(null)
  refreshUI()
  let win
  if (T.wiped >= 0) win = 1 - T.wiped
  else win = T.vp[0] > T.vp[1] ? 0 : T.vp[1] > T.vp[0] ? 1 : -1
  const t = win < 0 ? 'A bloody draw' : `${SIDES[win].name} win!`
  const why = T.wiped >= 0 ? `${SIDES[T.wiped].name} have been wiped from the table.` : `Final score ${T.vp[0]} – ${T.vp[1]} after ${G.setup.rounds} rounds.`
  const title = $('#overTitle')
  title.textContent = `${win >= 0 ? SIDES[win].icon + ' ' : ''}${t}`
  title.style.color = seatInk(win)
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
  // the units the table shows standing (while the player is behind, the
  // match may have slain some of them already)
  const hits = ray.intersectObjects(G.units.filter((u) => shown(u).alive > 0).map((u) => V(u).hit), false)
  const unit = hits.length ? hits[0].object.userData.unit : null
  const g = ray.intersectObject(board, false)[0]
  return { unit, ground: g ? g.point : null }
}

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
  const T = G.turn
  return (T.stage === 'battle' && human(T.active) && phaseResolve && !S.busy && !S.auto) || T.stage === 'deploy'
}

async function click({ unit, ground }) {
  $('#tooltip').style.display = 'none'
  const T = G.turn
  if (T.stage === 'deploy') return deployClick(unit, ground)
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
  if (unit && unit.side === T.active) {
    if (canAct(G, unit)) {
      sfx.click()
      select(unit)
    } else showCard(unit)
    return
  }
  if (T.phase === 'move' && sel && ground) {
    const i = nearestValid(G, S.reach, ground.x, ground.z)
    if (i >= 0) {
      clearOverlay()
      await doMove(sel, i)
    }
    return
  }
  if (T.phase === 'shoot' && sel && unit && unit.side !== sel.side) {
    if (shotInfo(G, sel, unit).ok) await doShoot(sel, unit)
    return
  }
  if (T.phase === 'charge' && sel && unit && unit.side !== sel.side) {
    if (chargeTargets(G, sel).includes(unit) && chargePlan(G, sel, unit)) await doCharge(sel, unit)
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
    const others = G.units.filter((o) => o !== u)
    const p = freeSpot(G, u, ground.x, ground.z, side, others)
    if (p && Math.hypot(p.x - ground.x, p.z - ground.z) < 2.5) {
      moveUnit(u, p.x, p.z)
      sfx.click()
      for (const o of G.units) updateLabel(o)
    }
  }
}

function select(u) {
  const T = G.turn
  S.sel = u
  S.reach = null
  clearOverlay()
  if (u && T.stage === 'battle' && T.phase === 'move' && !u.flags.moved) {
    S.reach = movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)
    paintReach(S.reach)
  }
  if (u && T.phase === 'shoot' && u.t.ranged) showRange(u, u.t.ranged.range)
  if (u && T.phase === 'charge') showRange(u, CHARGE_RANGE)
  showCard(u)
  refreshUI()
}

// ── Reach overlay, range ring, path preview ─────────────────────────────────
// one texel per nav cell (every match's grid has this size)
const OV = gridSize(W, H, NAV_CELL)
const ovData = new Uint8Array(OV.nx * OV.nz * 4)
const ovTex = new THREE.DataTexture(ovData, OV.nx, OV.nz, THREE.RGBAFormat)
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
  const nav = G.nav
  const ok = new Uint8Array(nav.N)
  for (let i = 0; i < nav.N; i++) if (isFinite(res.dist[i]) && nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', endForbid)) ok[i] = 1
  paintMask(ok, plan.fallback ? [255, 120, 90] : adv ? [255, 190, 70] : [90, 180, 255])
}

function paintMask(ok, col, fill = 80) {
  const nav = G.nav
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
  rangeRing.material.color.set(G.turn.phase === 'charge' ? '#ffb070' : '#ffffff')
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
  ghost.position.x = G.nav.x(i)
  ghost.position.z = G.nav.z(i)
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
  const T = G.turn, nav = G.nav
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
  } else if (T.stage === 'battle' && myTurn() && sel) {
    if (T.phase === 'move' && S.reach && h.ground && !h.unit) {
      const i = nearestValid(G, S.reach, h.ground.x, h.ground.z)
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
    } else if (T.phase === 'shoot' && h.unit && h.unit.side !== sel.side) {
      const info = shotInfo(G, sel, h.unit)
      text = info.ok ? oddsText(sel, h.unit, info) : `✖ ${info.why}`
    } else if (T.phase === 'charge' && h.unit && h.unit.side !== sel.side) {
      if (!chargeTargets(G, sel).includes(h.unit)) text = `✖ out of charge range (${gap(sel, h.unit).toFixed(1)}")`
      else {
        const p = chargePlan(G, sel, h.unit)
        text = p ? `Charge: need ${p.need}" on 2D6 — ${Math.round(p2D6(p.need) * 100)}%` : '✖ no route'
      }
    }
  }
  if (!text && h.unit) {
    // the unit as shown, like its label
    const mu = shown(h.unit)
    text = `${h.unit.t.name} · ${h.unit.t.models > 1 ? `${mu.alive}/${h.unit.t.models} models` : `${mu.models[0].w}/${h.unit.t.W} wounds`}`
  }
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
    await wait(PACE.dice(dice.length))
  },
}

// The battle log. Every line is traced as it is logged (core/journal.js:
// the trace is the match's replayable fingerprint), then shown (its `log`
// event, played here by write), and the destroyed-unit lines held back
// until now follow it.
function log(side, html, cls = '') {
  logLine(G, side, html, cls)
  show()
}
// A line into the battle log. `at` is the trace's length when it was logged
// (or flushed); under ?debug the entry carries it (data-at), and the page's
// trace has reached it before the entry lands (the ?debug block's listener).
function write(side, html, cls, at) {
  const list = $('#logList')
  const e = document.createElement('div')
  e.className = `entry s${side} ${cls}`
  e.innerHTML = html
  if (traceListener) {
    traceListener.reach(at)
    e.dataset.at = at
  }
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
  // what stands, what wounds are left, mesmerized and in combat: as shown,
  // like the label
  const mu = shown(u)
  const status = []
  if (u.flags.moved) status.push(u.flags.fellBack ? 'fell back' : u.flags.advanced ? `advanced +${u.flags.advRoll}"` : 'moved')
  if (u.flags.shot) status.push('shot')
  if (u.flags.charged) status.push('charged')
  if (mu.mesmerized) status.push('🌀 mesmerized')
  if (mu.alive > 0 && mu.engaged) status.push('⚔ in combat')
  if (mu.alive > 0 && inCover(G, u)) status.push('🛡 in cover')
  const models = t.models > 1 ? `${mu.alive}/${t.models} models` : `${mu.models[0].w}/${t.W} wounds`
  card.innerHTML = `
    <div class="card-head s${u.side}"><b>${t.name}</b><span>${SIDES[u.side].short} · ${t.role}</span></div>
    <div class="card-sub">${mu.alive > 0 ? models : 'destroyed'}${status.length ? ' · ' + status.join(' · ') : ''}</div>
    <table class="stats"><tr>${statKeys.map((k) => `<th>${k}</th>`).join('')}</tr><tr>${statKeys.map((k) => `<td>${fmt(k)}</td>`).join('')}</tr></table>
    ${wpn(t.ranged, t.ranged?.spell ? '✦' : '➹')}${wpn({ ...t.melee, range: 0 }, '⚔')}
    <ul class="abil">${(t.abilities || []).map((a) => `<li>${a}</li>`).join('')}</ul>`
  card.classList.add('show')
}

function refreshUI() {
  const T = G.turn, M = player.mirror
  // the score and the round as shown
  $('#vp0').textContent = M.vp[0]
  $('#vp1').textContent = M.vp[1]
  $('#round').textContent = M.stage === 'deploy' ? 'Deployment' : `Round ${Math.min(M.round, G.setup.rounds)} / ${G.setup.rounds}`
  document.querySelectorAll('#phases .ph').forEach((el) => {
    el.classList.toggle('on', T.stage === 'battle' && el.dataset.k === T.phase)
  })
  $('#sideA').classList.toggle('active', T.stage === 'battle' && T.active === 0)
  $('#sideB').classList.toggle('active', T.stage === 'battle' && T.active === 1)
  const mine = T.stage === 'battle' && human(T.active) && !!phaseResolve && !S.auto
  const sel = S.sel
  const picking = !!S.chargePick
  $('#endPhase').style.display = (mine && !picking) || T.stage === 'deploy' ? '' : 'none'
  $('#closestSpot').style.display = picking ? '' : 'none'
  $('#endPhase').textContent = T.stage === 'deploy' ? 'Begin battle ▸' : `End ${PHASES.find((p) => p.key === T.phase).name} ▸`
  $('#endPhase').disabled = S.busy || S.auto
  $('#autoPhase').style.display = mine && !picking ? '' : 'none'
  const adv = $('#advance')
  adv.style.display = mine && T.phase === 'move' && sel && !sel.flags.moved && !sel.flags.advanced && !isEngaged(G, sel) ? '' : 'none'
  adv.textContent = `Advance (+D6") — no ${sel?.t.ranged?.assault ? 'charge' : 'shooting or charge'} after`
  if (sel?.t.chargeAfterAdvance) adv.textContent = 'Advance (+D6") — can still charge'
  // hint line
  let hint = ''
  if (picking) hint = `Charge! Rolled ${S.chargePick.rolled}" — click the orange area to place ${S.chargePick.u.t.short}, or take the shortest move.`
  else if (T.stage === 'deploy') hint = `Deployment — click one of your units, then click inside your shaded zone to move it there.`
  else if (T.stage === 'battle' && !human(T.active)) hint = `${SIDES[T.active].name} (AI) are taking their turn…`
  else if (mine) {
    hint = {
      move: sel ? (isEngaged(G, sel) ? 'Engaged — click inside the red area to fall back (no shooting or charging after).' : 'Click inside the shaded area to move. Difficult ground costs double.') : 'Movement — pick a unit with a white ring to move it.',
      shoot: sel ? 'Click an enemy unit to shoot it. Hover for odds.' : 'Shooting — pick a unit with a white ring to fire.',
      charge: sel ? 'Click an enemy within 12" to declare a charge, then roll 2D6.' : 'Charge — pick a unit to charge with.',
    }[T.phase] || ''
  }
  $('#hint').textContent = hint
  $('#hint').style.display = hint ? '' : 'none'
  refreshRings()
}

function refreshRings() {
  const mine = myTurn()
  const T = G.turn
  for (const u of G.units) {
    if (!alive(u)) continue
    const m = V(u).ring.material
    let op = 0, col = '#ffffff'
    if (u === S.sel) {
      op = 1
      col = '#ffe680'
    } else if (T.stage === 'deploy' && u.side === S.deploySide) {
      op = 0.5
    } else if (S.chargePick && u === S.chargePick.target) {
      op = 0.95
      col = '#ffa040'
    } else if (mine && T.stage === 'battle' && canAct(G, u)) {
      op = 0.75
    } else if (mine && S.sel && T.phase === 'shoot' && u.side !== S.sel.side && shotInfo(G, S.sel, u).ok) {
      op = 0.95
      col = '#ff5a4a'
    } else if (mine && S.sel && T.phase === 'charge' && u.side !== S.sel.side && chargeTargets(G, S.sel).includes(u)) {
      op = 0.95
      col = '#ffa040'
    } else if (u === S.hover) {
      op = 0.35
    }
    m.opacity = op
    m.color.set(col)
  }
}

async function banner(a, b, side = -1) {
  const el = $('#banner')
  el.innerHTML = `<div class="b1">${a}</div><div class="b2">${b}</div>`
  el.querySelector('.b1').style.color = seatInk(side)
  el.classList.remove('show')
  void el.offsetWidth
  el.classList.add('show')
  await wait(PACE.phaseStart(human(G.turn.active), G.turn.stage))
}

// ── Buttons ─────────────────────────────────────────────────────────────────
$('#endPhase').onclick = () => {
  unlock()
  sfx.click()
  if (G.turn.stage === 'deploy') return S.deployDone?.()
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
    await aiPhase(G, G.turn.active, G.turn.phase, act)
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
// A new table for the title screen: a new match on the board seed, its
// armies deployed (who plays each seat and the dice come with start()).
function setupTable() {
  // the new match first: if building it throws, the last table stays whole
  const setup = {
    board: S.seed, dice: TABLE_DICE, terrain: 'classic', rounds: ROUNDS, diceMode: 'shared',
    seats: RACE_PICK.map((race, i) => ({ race, ctrl: S.control[i] })),
  }
  const next = newState(setup, { out: [], onTrace })
  clearUnits()
  S.sel = null
  $('#logList').innerHTML = ''
  $('#tray').classList.remove('show')
  G = next
  // the table as shown starts as the match stands, and the board is played
  // from its terrain.clear
  player.reset(project(G))
  show()
  scatterTufts()
  for (const u of G.units) makeView(u)
  for (const u of G.units) updateLabel(u)
  // nothing from the last game carries over: banners, scorch marks, turn state
  for (const o of objViews) paintObjective(o, -1)
  fx.clearDecals()
  // (and a template or thorns a replaced table left standing, though only
  // the title and the end screen replace one, with nothing left to play)
  blastMarker?.userData.remove()
  blastMarker = null
  for (const spikes of spikesOf.values()) for (const s of spikes) scene.remove(s)
  spikesOf.clear()
  S.busy = false
  S.waiting = false
  S.chargePick = null
  S.auto = false
  refreshUI()
}

// who plays each seat, by the title screen's mode buttons
const MODES = { bushtail: ['human', 'ai'], serpent: ['ai', 'human'], hotseat: ['human', 'human'], watch: ['ai', 'ai'] }

async function start(mode) {
  // an unknown mode changes nothing (S included), so the table stays playable
  if (!Object.hasOwn(MODES, mode)) throw new Error(`no mode "${mode}" (there are ${Object.keys(MODES).join(', ')})`)
  const who = MODES[mode]
  // a fresh logic-dice stream per battle; ?dice=N replays one exactly
  const dice = Number(params.get('dice')) || ((Math.random() * 1e9) | 0)
  // the battle is fought on the table the title screen shows (setupTable
  // built it, armies and all); it gets its dice and who plays each seat
  startMatch(G, { dice, ctrl: who })
  S.dice = dice
  S.control = [...who]
  traceListener?.begin(G)
  seatPlayers()
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
    G.turn.stage = 'deploy'
    emit(G, 'stage', { stage: 'deploy' })
    checkpoint()
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

// Each figure walks toward its model's slot as shown (the mirror's place
// for it), turns, lunges and idles; dying and fleeing figures play out their
// own tweens.
function animateUnits(dt, time) {
  const M = player.mirror
  for (const u of G.units) {
    // (a unit walking a unit.move is drawn where its walk has got to)
    const v = V(u), mu = M.units[u.id], p = v.at ?? mu.pos
    for (const [i, model] of mu.models.entries()) {
      const m = v.models[i]
      if (!model.alive && !m.dying) continue
      const a = m.mesh.userData.anim
      if (model.alive) {
        const tx = p.x + model.ox, tz = p.z + model.oz
        const k = 1 - Math.exp(-dt * (v.moving ? 16 : 7))
        const px = m.x, pz = m.z
        m.x += (tx - m.x) * k
        m.z += (tz - m.z) * k
        const sp = Math.hypot(m.x - px, m.z - pz) / Math.max(dt, 1e-4)
        const want = sp > 0.6 ? Math.atan2(m.x - px, m.z - pz) : m.look ?? v.facing
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
      if (!a || !model.alive) continue
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
    if (mu.alive > 0 && !FAST) {
      tmpV.set(p.x, (u.t.big ? 2.7 : u.t.fly ? 2.3 : 1.7), p.z).project(camera)
      const on = tmpV.z < 1
      v.label.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * innerWidth}px, ${(-tmpV.y * 0.5 + 0.5) * innerHeight}px) translate(-50%, -100%)`
      v.label.style.visibility = on && M.stage !== 'title' ? 'visible' : 'hidden'
      v.label.classList.toggle('sel', u === S.sel)
    }
  }
}

// Flag and ring in the colours of whoever holds the objective (-1: nobody).
function paintObjective(o, c) {
  o.owner = c
  o.flagMat.color.set(c < 0 ? '#e8e0d0' : SIDES[c].color)
  o.ring.material.color.set(c < 0 ? '#fff3c0' : SIDES[c].color)
}

// Each flag shows its holder as shown (the mirror's owners: nobody before the
// battle).
function animateObjectives(dt, time) {
  const owners = player.mirror.owners
  for (const o of objViews) {
    const c = owners[o.i]
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
    // a slow drift from behind seat 0's lines (the west edge), across toward seat 1's
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
// behind seat 0's lines, so the 28" width is what has to fit the screen.
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
  // The input hooks are the very calls a click or a button makes, so sim/ can
  // play a human seat headlessly; without ?debug none of this exists.
  // What sim/ reads (oracle/human-bot.mjs, oracle/shadow.mjs, chromium.mjs):
  // S.{stage,deploySide,phase,active,round,first,vp,wiped,busy,auto,reach,
  // control}; trace, whose push it wraps; units[].{id,side,pos,r,alive,lost,
  // mesmerized,flags,models[].{alive,w,ox,oz},t.{M,W,ranged}};
  // scenery.chunks[].{alive,hp,shape.{x,y,z,yaw}}; nav.{x,z,index,N,W,H};
  // validEnd(plan, i) with plan.res.dist; phaseResolve; chargePick.{u,
  // plan.cell,ok}; start and the input hooks below; and every q member with
  // today's arity and results: alive, isEngaged, canAct truthy or not;
  // shootTargets and chargeTargets arrays of the units[] objects themselves;
  // shotInfo(u, tg).ok; chargePlan(u, tg) null when no spot is reachable,
  // else a plan with .need; freeSpot(...) null or {x, z}; movePlan(u, extra)
  // the plan validEnd takes; rngState() as the trace prints it. Replaying a
  // log needs the hooks, alive, isEngaged, canAct, shotInfo().ok,
  // chargeTargets, chargePlan's null and rngState(); the rest feeds only the
  // corpus policies (run on the PIN), so parity won't notice a reshape of
  // those. Outside __ts it wraps #logList's prepend (the battle log) and, in
  // Chromium, presses #title's [data-mode] buttons. When internals move,
  // later steps keep this surface working here, inside this block, never by
  // editing sim/oracle: the PIN and the working tree share a driver.
  //
  // Since R4 the state is the match's, G (a new one per table), so the
  // members map onto whichever G is current: S's turn fields read G.turn
  // (wiped is undefined until a side is wiped, -1 in G.turn), units, nav and
  // scenery.chunks are getters, and the queries take the current G
  // (q.canAct: (u) => canAct(G, u)). The trace is one array for the page's
  // lifetime, fed by each match's onTrace as it writes a line, and emptied
  // when start() begins a battle, at the point it always was.
  // S lists and copies as a plain object would ({...S}, JSON), turn fields
  // included, though structuredClone refuses it, as it does any Proxy.
  //
  // Since R5 the rules run ahead of the view: what they emit in G.out is
  // played by the EventPlayer at the table's pace (view/player.js), and a
  // battle-log entry lands when its `log` event is played. So the trace
  // keeps pace with the player: a line the match writes while the player is
  // behind it (events emitted and not yet played) joins `trace` when the
  // player reaches it: at the log event that shows it (each carries `at`,
  // the trace's length when it was logged, and `trace` is brought up to
  // `at` before the entry is written, which carries it too, as data-at), or
  // when the player goes idle. sim/ then records every write at the trace
  // length it always did, and takes each state line's shadow as it joins:
  // the actions write only log lines while the player is behind (every
  // `act` line is finishAction's, here, once the action's events have
  // played; a fight or morale phase's `phase` line follows its played()),
  // so no state line waits. A state line that does wait is only right if
  // the match hasn't moved by the time it joins (sim/oracle's shadow reads
  // the live match then), so it waits with a fingerprint of what that
  // shadow reads, and joining throws, naming the line, if the fingerprint
  // has moved. The step that writes state lines while the player is behind
  // (R6, whose engine ends actions in core and runs a whole AI turn ahead)
  // carries the state with the line instead (DESIGN's R5a and R5b notes,
  // R6's row).
  //
  // Not promised, for sim/terrain-shots.mjs only: clock, camera, renderer,
  // S.titleSpin, scenery.scene and scenery.blast (a blast played as
  // core/actions/shoot.js's blastLands plays one: its reports played, the
  // nav refreshed). Nor G, for the console and for
  // sim/rematch-check.mjs (G.out, which it requires empty whenever the
  // player is idle and before each new table; it also presses #again,
  // #reroll and #seed's onchange, and reads S.seed), nor player, which it
  // reads for that (player.idle). Nor, for sim/present-check.mjs,
  // present.listen(observer), G (it folds its own mirror from project(G)
  // as the page loads and at each new table, and holds it to project(G) at
  // the game's end) and player.idle (at the game's end): the observer's
  // reset(M) hears each new table's mirror and event(e, M) every event as
  // the player plays it, so it can fold its own mirror and hold it to each
  // act's `proj` (project(G) when the action ended, which only ?debug's act
  // events carry) and to each `check {proj}`, an event only ?debug emits
  // (main.js's checkpoint(): after an action's events, and after
  // main.js's own stage events), with project(G) as the match then stood.
  // The M it is handed is
  // the player's own, folded in place (present/mirror.js): an observer
  // reads it and never folds into it, or every event would be applied
  // twice.
  const TURN = new Set(['stage', 'round', 'active', 'first', 'phase', 'vp', 'wiped'])
  const turn = (k) => (k === 'wiped' ? (G.turn.wiped < 0 ? undefined : G.turn.wiped) : G.turn[k])
  const legacyS = new Proxy(S, {
    get: (s, k) => (TURN.has(k) ? turn(k) : s[k]),
    has: (s, k) => TURN.has(k) || k in s,
    set: (s, k, v) => {
      if (TURN.has(k)) throw new Error(`__ts.S.${k} is the match's G.turn.${k}: it can't be set through S`)
      s[k] = v
      return true
    },
    ownKeys: (s) => [...new Set([...Reflect.ownKeys(s), ...TURN])],
    getOwnPropertyDescriptor: (s, k) =>
      TURN.has(k) ? { value: turn(k), enumerable: true, configurable: true, writable: false } : Reflect.getOwnPropertyDescriptor(s, k),
  })
  const trace = [], held = []
  // the player is behind the match: events emitted and not yet played
  const behind = (g) => !!g.out?.length || !player.idle
  // what sim/oracle's shadow reads of the match (shadowParts: the turn, the
  // dice, every unit, every chunk), as one string
  const reads = (g) => JSON.stringify([g.turn, rngState(g.rng),
    g.units.map((u) => [u.id, u.pos, u.r, u.alive, u.lost, u.mesmerized, u.flags, u.models.map((m) => [m.alive, m.w, m.ox, m.oz])]),
    g.terrain.chunks.map((c) => [c.alive, c.hp, c.shape.x, c.shape.y, c.shape.z, c.shape.yaw])])
  // a waiting line joins the trace; a state line only if the match is as it
  // was when the line was written (else its shadow would be taken against
  // a later match: the hold is no longer enough, see above)
  const join = () => {
    const [line, g, was] = held.shift()
    if (was !== undefined && (g !== G || reads(g) !== was)) throw new Error(`?debug trace: the state line '${line.slice(0, 60)}…' waited for the player, and the match moved before it joined the trace, so its shadow would be wrong`)
    trace.push(line)
  }
  traceListener = {
    begin: () => {
      trace.length = 0
      held.length = 0
    },
    line: (line, g) => {
      if (held.length || behind(g)) held.push(line.startsWith('log ') ? [line, g] : [line, g, reads(g)])
      else trace.push(line)
    },
    // the log entry about to be written was logged at trace length `at`
    reach: (at) => {
      while (trace.length < at && held.length) join()
    },
    idle: () => {
      while (held.length) join()
    },
  }
  window.__ts = {
    S: legacyS, clock, camera, controls, renderer, trace,
    get G() {
      return G
    },
    get player() {
      return player
    },
    present: {
      listen(observer) {
        player.observer = observer
      },
    },
    get units() {
      return G.units
    },
    get nav() {
      return G.nav
    },
    scenery: {
      get chunks() {
        return G.terrain.chunks
      },
      scene,
      blast(x, z, r, dmg, opts) {
        const broke = G.terrain.blast(x, z, r, dmg, opts, G.out)
        show()
        refreshNav(G)
        return broke
      },
    },
    validEnd: (plan, i) => validEnd(G, plan, i),
    setUnitPos: moveUnit,
    get phaseResolve() {
      return phaseResolve
    },
    get chargePick() {
      return S.chargePick
    },
    start, select, doMove, doAdvance, doShoot, doCharge, placeCharge, deployClick,
    endPhase: () => $('#endPhase').onclick(),
    autoPhase: () => $('#autoPhase').onclick(),
    // read-only rules queries, for choosing legal input (only what sim/ uses)
    q: {
      alive,
      isEngaged: (u) => isEngaged(G, u),
      canAct: (u) => canAct(G, u),
      movePlan: (u, extra) => movePlan(G, u, extra),
      freeSpot: (u, x, z, side, others) => freeSpot(G, u, x, z, side, others),
      shootTargets: (u) => shootTargets(G, u),
      shotInfo: (u, tg) => shotInfo(G, u, tg),
      chargeTargets: (u) => chargeTargets(G, u),
      chargePlan: (u, tg) => chargePlan(G, u, tg),
      rngState: () => rngState(G.rng),
    },
    screen(x, y, z) {
      const v = new THREE.Vector3(x, y, z).project(camera)
      return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight]
    },
  }
}
