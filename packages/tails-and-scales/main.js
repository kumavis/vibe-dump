import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {
  BOARD, CHARGE_RANGE, OBJECTIVE_RANGE, PHASES,
  passes, woundNeed, saveNeed, attackCount, expected, p2D6,
} from './core/rules.js'
import { RACES } from './data/schema.js'
import { MISSIONS, CLASSIC } from './data/mission.js'
import { EDGES, NAV_CELL, edgeOf, ctrl, refreshNav } from './core/match.js'
import { createMatch, fullSetup, preview, q } from './core/index.js'
import { gridSize } from './core/nav.js'
import { Session } from './match/session.js'
import { LocalStore } from './match/store.js'
import { project } from './present/mirror.js'
import { PACE } from './present/pace.js'
import { TerrainView } from './view/terrain.js'
import { EventPlayer } from './view/player.js'
import { chargePick, nearestSpot, endAt, SHORTEST } from './input/tools/charge-end.js'
import { sidesFor, isMirror } from './ui/theme.js'
import { FX } from './fx.js'
import { buildModel, M } from './models.js'
import { clock, tween, wait, stepTweens, easeOut, easeInOut, wrapAngle, lerp } from './util.js'
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
// This file is the table: the scene, the units' figures, how each of the
// match's events looks (the EventPlayer's handlers), the input and the UI.
// The battle itself is the core's (core/index.js): a pure function of its
// setup and the commands its seats send. Every mode plays one through a
// Session (match/session.js) over a LocalStore (match/store.js): the title
// screen's button makes the setup, the Session creates the match from it,
// the AI plays inside the match (core/engine.js, core/ai/), and a human
// seat's clicks become commands (units by id, places by nav cell) that the
// Session folds into it. The match runs ahead, to the next decision a human
// makes, and reports what happened as events (DESIGN §2.3), which the player
// (view/player.js) plays here at the table's pace, folding each into the
// mirror (present/mirror.js): the match as shown, which the figures, labels,
// flags and score read. Input and the HUD read the match itself (G) only once
// the player has played everything (§2.4), and what a tool shows before a
// seat commits it asks through the Session's preview, with the dice locked.
// ---------------------------------------------------------------------------

// the read-only queries (core/queries.js, through the core's API)
const {
  alive, isEngaged, eyeY, chestY, inCover, phaseKey,
  canAct, movePlan, validEnd, freeSpot, shotInfo, shootTargets, chargeTargets, chargePlan, rngState,
} = q

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
// paintSeats once the seats are known), as deep as the mission's (the rules'
// zone, core/deploy.js)
const zoneMats = [], zoneLineMats = []
const DEPLOY = MISSIONS.classic.deploy
for (const s of [0, 1]) {
  const sx = EDGES[s]
  const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.07, depthWrite: false })
  zoneMats.push(mat)
  const z = new THREE.Mesh(new THREE.PlaneGeometry(DEPLOY, H).rotateX(-Math.PI / 2), mat)
  z.position.set(sx * (W / 2 - DEPLOY / 2), 0.008, 0)
  z.renderOrder = 1
  scene.add(z)
  const pts = []
  for (let zz = -H / 2; zz < H / 2; zz += 1) pts.push(new THREE.Vector3(sx * (W / 2 - DEPLOY), 0.02, zz), new THREE.Vector3(sx * (W / 2 - DEPLOY), 0.02, zz + 0.5))
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
// match's, G.objectives, where the classic mission puts them:
// data/mission.js); `owner` is whose colours it shows.
const objViews = MISSIONS.classic.objectives.map((p, i) => {
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
// among the events of the entry the Session folds, and the player plays
// each report (the terrain.* handlers) when it reaches it in those events,
// in order (a wrecker's smashes as its walk passes them).
const terrainView = new TerrainView(scene, fx)
terrainView.onBreak = (c) => {
  if (c.kind === 'block') sfx.crumble()
  else sfx.thwack()
}

// ── Game state ──────────────────────────────────────────────────────────────
// The table's and the screen's own state: the board seed and who plays each
// seat as the title screen has them, and input and camera state. The
// match's state (the turn, the score, the units) is G's.
// (Every seed the page takes is made a whole number from 0 to 2^32 - 1, as
// a setup's must be, with `>>> 0`: what the board's and the dice's
// generators always did with a seed, so ?seed=-5 is still the board -5 drew.)
const S = {
  seed: (Number(params.get('seed')) || ((Math.random() * 1e6) | 0)) >>> 0,
  control: ['human', 'ai'],
  sel: null,
  reach: null,
  hover: null,
  follow: true,
}
// The races at the table: the classic Bushtails-versus-Coil matchup
// (data/mission.js), or any pair a ?races=<seat 0>,<seat 1> URL names (e.g.
// ?races=serpent,serpent), until the title screen gets a race picker. A
// value naming no two races gets the classic matchup and a line on the title
// card saying why, not a page that never starts (sim/mirror-check.mjs fails
// a run whose log shows other races than it asked for).
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
// The battle being played: its Session (match/session.js), which folds the
// battle's log (a LocalStore) through the core, and the match itself,
// session.G. Both null on the title screen: no battle exists before a mode
// is chosen, and start() makes a new one from the whole setup, so nothing
// carries over from one battle to the next.
let session = null
let G = null
// The table the title screen shows (showTable): a match on the board seed
// that is never played. Both its seats are human, so it stops at its
// deployment having drawn nothing; it is only drawn (its board, and the
// armies where any battle on this board deploys them), and lends the title
// its nav grid's geometry. A battle on the same board and races starts on
// exactly this table, so its figures and meshes are kept (start()).
let backdrop = null
// false once the backdrop's board has been changed since it was drawn (the
// ?debug block's scenery.blast, for sim/terrain-shots.mjs): it is then no
// battle's table, and start() draws a fresh one
let backdropAsDrawn = true
// the match the table shows: the battle's, or on the title the backdrop
const atTable = () => G ?? backdrop
// Under ?debug every battle reports its trace lines here as it writes them
// (createMatch's onTrace, which the Session passes), and start() says when
// a battle begins; only the ?debug block listens (sim/ reads one trace for
// the page's lifetime, emptied as each battle begins). Without ?debug a
// battle has no onTrace.
let traceListener = null
const DEBUG = params.has('debug')
const onTrace = DEBUG ? (line, g) => traceListener?.line(line, g) : null
// each seat's name, icon and colours, from its race (ui/theme.js)
const seatsOf = (races) => races.map((race, seat) => ({ seat, race }))
let SIDES = sidesFor(seatsOf(RACE_PICK))

// Seat the players: the races at the table.
function seatPlayers(seats) {
  SIDES = sidesFor(seats)
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
const seatInk = (s) => (s >= 0 && isMirror(atTable().seats) ? SIDES[s].color : '')

const human = (side) => ctrl(G, side) === 'human'
// a seat played here (the Session's local seats: a human seat may be another
// device's from R8, which this page only watches)
const local = (side) => !!session?.localSeats.includes(side)
// a phase's name by its key ('move' → 'Movement')
const PHASE_NAME = Object.fromEntries(PHASES.map((p) => [p.key, p.name]))

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

// (`at`: the match the unit is in, for its seat's edge)
function makeView(u, at) {
  // facing across the table, away from the seat's own edge (kept: a fleeing
  // figure runs off over it)
  const edge = edgeOf(at, u.side)
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

// A battle's units are the backdrop's, id for id (start() makes sure the
// backdrop is the battle's table: the same board, terrain and races deploy
// the same armies the same way, newState being a pure function of the
// setup, and neither who plays a seat nor the dice move a unit before the
// battle starts), so their figures stay on the table: each view now follows
// the battle's unit. A unit the table has no figure for is a bug in that
// (the mirror the player was reset to is the backdrop's too), so it throws.
function bindViews(at) {
  const differs = (u) => !views.has(u.id) || views.get(u.id).u.t !== u.t || views.get(u.id).u.side !== u.side
  const bad = at.units.find(differs)
  if (bad || at.units.length !== views.size) throw new Error(`the battle's units are not the table's (${bad ? `unit ${bad.id}, ${bad.key} of seat ${bad.side}` : `${at.units.length} units, ${views.size} figures`}): a battle starts on its own table (start())`)
  for (const u of at.units) {
    const v = views.get(u.id)
    v.u = u
    v.hit.userData.unit = u
    updateLabel(u)
  }
}

// ── Playing the match's events ──────────────────────────────────────────────
// The match runs ahead to the next decision a human makes and reports what
// happened as events (DESIGN §2.3), which the Session hands over entry by
// entry (the sink, below); the player plays them here at the table's pace,
// each kind of event with the old code's visuals, after folding it into the
// mirror (present/mirror.js), the match as shown.
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
  act: () => {},
  // the flow: a stage of the battle, a phase begun, a round scored, the end
  stage: (e) => staged(e),
  'phase.start': (e) => phaseBegun(e),
  'round.scored': (e) => scored(e),
  'game.over': (e) => over(e),
  // (what the match waits on: the table asks once it has played everything)
  pending: () => {},
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
// Told when it has played everything: the table catches up (idled, below).
const player = new EventPlayer({ handlers: HANDLERS, onIdle: () => idled() })

// What the Session hands over after each entry it folds: the events that
// entry made happen, played in order. A battle's first entry, its start,
// begins with the match's board (its terrain.clear and an add per chunk),
// which the backdrop already shows chunk for chunk: start() asks for those
// to be dropped (boardShown), so the meshes stay. Under ?debug the
// checkpoints P-present holds the mirror to go in first (the ?debug block).
let boardShown = false
const sink = {
  // (`ses`, the Session handing them over: a Session over a store that holds
  // entries already folds them as it is made, before start() has it)
  events(events, ses) {
    if (G !== ses.G) {
      G = ses.G
      bindViews(G)
    }
    if (traceListener) events = traceListener.present(events, G)
    if (boardShown) {
      boardShown = false
      if (events[0]?.t === 'terrain.clear') {
        let k = 1
        while (events[k]?.t === 'terrain.add') k++
        events = events.slice(k)
      }
    }
    player.push(events)
  },
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

// ── Shooting ────────────────────────────────────────────────────────────────
// How a shot's events look (core/actions/shoot.js: a volley, a blast
// weapon's templates, a spell).
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
// away (showTable), and a snap must too (DESIGN §2.4), since it drops the
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
// (showTable), and a snap must too (DESIGN §2.4), since it drops the
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
// (the charge is core/actions/charge.js's; where a seat's ends is picked
// with input/tools/charge-end.js, below)

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

// ── Camera focus for AI turns ───────────────────────────────────────────────
// (the stage and the seat to act as shown: a focus event plays while the
// match has run ahead, a whole AI turn or more)
let focusTween = null
function focus(x, z) {
  const M = player.mirror
  if (!S.follow || M.stage !== 'battle') return
  // (never during the decision of the one seat played here: hotseat's two
  // seats and a spectator's none both follow)
  if (local(M.active) && session.localSeats.length === 1) return
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

// ── The flow ────────────────────────────────────────────────────────────────
// What the table shows as the battle moves on: a stage (the deployment, the
// battle, its end), each phase's banner, each round's score, the end screen.
// The match decides all of it (core/engine.js); these are its events played.

// Whether the table has shown a phase begin (its phase.start played) since
// the stage it shows began. Until one has, the mirror's turn fields are a
// table's before the battle (seat 0's movement in round 1), which say
// nothing about whose turn it is: through the roll-off the HUD shows no
// seat's phase, whoever moves first. (View state: the mirror is held to
// project(G) by P-present, so this stays out of it.)
let phaseShown = false
// Whether End and Auto are up for the seat whose phase the table shows: they
// come up once the player has caught up to that phase (idle), and stay up,
// disabled, while the table plays the seat's own actions (a charge's roll
// and its walk too, though the match waits on its end in between) until an
// End or an Auto moves the decision on. (View state, like phaseShown.)
let buttonsUp = false

// A stage begins: the zones dim for the battle, and nothing stays selected.
function staged(e) {
  phaseShown = false
  if (e.stage !== 'deploy') select(null)
  refreshUI()
}

// A phase begins: its banner, which the table waits on.
function phaseBegun(e) {
  phaseShown = true
  select(null)
  tray.el.classList.remove('show')
  refreshUI()
  return banner(`${SIDES[e.side].icon} ${SIDES[e.side].name}`, PHASE_NAME[e.phase], e.side)
}

// A round scored: a ring in the holder's colours on each objective held,
// then the score's banner.
function scored(e) {
  e.owners.forEach((c, i) => {
    const o = MISSIONS.classic.objectives[i]
    if (c >= 0) fx.ring(o.x, o.z, OBJECTIVE_RANGE, SIDES[c].color, { life: 1.6, fill: 0.15 })
  })
  refreshUI()
  return banner(`End of round ${e.round}`, `VP ${e.vp[0]} – ${e.vp[1]}`)
}

// The end: who won and why, worded from `why` and the rounds played (0 for
// a battle that ended in its deployment).
function over({ win, why, vp, rounds }) {
  select(null)
  refreshUI()
  const t = win < 0 ? 'A bloody draw' : `${SIDES[win].name} win!`
  const when = rounds ? `in round ${rounds}` : 'in the deployment'
  const line = why === 'wipe' ? `${SIDES[1 - win].name} have been wiped from the table ${when}.`
    : why === 'concede' ? `${SIDES[1 - win].name} conceded ${when}.`
    : `Final score ${vp[0]} – ${vp[1]} after ${rounds} round${rounds === 1 ? '' : 's'}.`
  const title = $('#overTitle')
  title.textContent = `${win >= 0 ? SIDES[win].icon + ' ' : ''}${t}`
  title.style.color = seatInk(win)
  $('#overWhy').textContent = line
  $('#over').classList.remove('hidden')
  sfx.fanfare()
}

// ── Commands ────────────────────────────────────────────────────────────────
// What a seat played here sends (DESIGN §2.5): each click or button becomes
// a command body (units by id, places by nav cell, picked with the core's
// own queries: nearestValid, freeSpot, the charge-end tool), sent through
// the Session only if the match takes it now. The Session folds it at once:
// the match runs on to the next decision a human makes, and the table plays
// what happened. Whether a seat may act is derived, never stored: from the
// decision the match waits on and whether the player has played everything.

// the seat played here that the match waits on, or -1
const localSeat = () => (session ? session.decisionFor() : -1)
// that seat's decision, null for none
const localDecision = () => (localSeat() >= 0 ? G.pending : null)
// the seat deploying here, or -1 (a placement plays at once: the deployment
// never waits on the player)
const deploySeat = () => (localDecision()?.k === 'deploy' ? localSeat() : -1)
// a seat played here is in a phase of its own turn, and the table has shown
// everything up to now
const myTurn = () => player.idle && localDecision()?.k === 'phase'
// a charge's end to pick, here and now (input/tools/charge-end.js)
const picking = () => (player.idle && localDecision()?.k === 'chargeEnd' ? chargePick(session) : null)
// a question the tools ask the match: with the dice locked (§4.1 rule 2)
const ask = (fn) => session.preview(fn)

// Send `body` for the seat played here, if the match takes it now. Returns
// null once sent, else why not (and sends nothing).
function send(seat, body) {
  const why = session ? session.legal(seat, body) : 'no battle'
  if (why) return why
  session.submit(seat, body)
  // (the buttons go disabled at once, while the table plays it)
  refreshUI()
  return null
}
const moveTo = (u, c) => {
  clearOverlay()
  return send(localSeat(), { t: 'move', u: u.id, c })
}
const advance = (u) => send(localSeat(), { t: 'advance', u: u.id })
const shoot = (u, tg) => send(localSeat(), { t: 'shoot', u: u.id, tg: tg.id })
const charge = (u, tg) => send(localSeat(), { t: 'charge', u: u.id, tg: tg.id })

// End the charge on cell c, a spot the roll reaches (a click's, nearestSpot's:
// its -1 for "no spot" is no command, though the wire's Shortest move is -1
// too, so that takes its own path, takeShortest).
function placeCharge(c) {
  const pk = picking()
  if (!pk) return 'no charge to end'
  if (!(c >= 0 && pk.ok[c])) return `cell ${c} is no spot the roll reaches`
  return endCharge(pk, c)
}
// End the charge with the shortest move (SHORTEST: the plan's own cell).
function takeShortest() {
  const pk = picking()
  if (!pk) return 'no charge to end'
  return endCharge(pk, SHORTEST)
}
function endCharge(pk, c) {
  pickShown = null
  clearOverlay()
  ghost.visible = false
  $('#tooltip').style.display = 'none'
  return send(pk.seat, endAt(c))
}

// The table has played everything: the trace catches up (?debug), a card
// still open catches up with the table (the unit its figure shows now: the
// battle's start rebinds the figures), the selected unit stays selected
// while it can still act (a move or a shot spent it; an advance didn't), a
// charge waiting for its end shades the spots its roll reaches, and the HUD
// follows.
let pickShown = null
function idled() {
  traceListener?.idle()
  const cu = carded && views.get(carded.id)?.u
  if (cu && cu.t === carded.t && cu.side === carded.side && $('#card').classList.contains('show')) showCard(cu)
  if (S.sel && myTurn()) select(ask((G, q) => q.canAct(G, S.sel)) ? S.sel : null)
  const pk = picking()
  if (pk && pickShown !== pk) {
    pickShown = pk
    // the 12" declaration ring is spent; leave the orange to the area itself,
    // filled strongly enough to see when it's only a cell or two
    rangeRing.visible = false
    paintMask(pk.ok, [255, 150, 60], 150)
    ghostAt(pk.cell, pk.u.r)
  }
  refreshUI()
  traceListener?.settled()
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
  const hits = ray.intersectObjects([...views.values()].filter((v) => shown(v.u).alive > 0).map((v) => v.hit), false)
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

// A click on the table: a unit, or the ground under the pointer (or both).
// On a seat's own turn it selects, moves, shoots or charges; while a charge
// waits for its end it picks the spot; in the deployment it places; any
// other time it shows the unit's card.
function click({ unit, ground }) {
  $('#tooltip').style.display = 'none'
  if (deploySeat() >= 0) return deployClick(unit, ground)
  const pk = picking()
  if (pk) {
    // the board under the cursor counts even when it's under a model; a
    // click outside the orange area (no spot within reach of it) does nothing
    if (ground) {
      const i = nearestSpot(G.nav, pk.ok, ground.x, ground.z)
      if (i >= 0) placeCharge(i)
    }
    return
  }
  if (!myTurn()) {
    if (unit) showCard(unit)
    return
  }
  const sel = S.sel, ph = phaseKey(G)
  if (unit && unit.side === localSeat()) {
    if (ask((G, q) => q.canAct(G, unit))) {
      sfx.click()
      select(unit)
    } else showCard(unit)
    return
  }
  if (ph === 'move' && sel && ground) {
    const i = ask((G, q) => q.nearestValid(G, S.reach, ground.x, ground.z))
    if (i >= 0) moveTo(sel, i)
    return
  }
  // (the match judges the shot and the charge: in range, in sight, a way
  // there; a click it refuses does nothing)
  if (ph === 'shoot' && sel && unit && unit.side !== sel.side) return void shoot(sel, unit)
  if (ph === 'charge' && sel && unit && unit.side !== sel.side) return void charge(sel, unit)
  if (unit) showCard(unit)
  else if (ground) select(null)
}

// The deployment: a click on one of the deploying seat's units picks it up,
// a click inside its zone puts it on the free spot nearest the click (within
// 2.5", the UI's tolerance; the cell is freeSpot's, a cell centre, so the
// command carries its index). Returns why a placement it sent was refused
// (null for anything else: a click too far from a free spot does nothing).
function deployClick(unit, ground) {
  const side = deploySeat()
  if (side < 0) return 'no seat deploying here'
  if (unit && unit.side === side) {
    sfx.click()
    S.sel = unit
    showCard(unit)
    refreshRings()
    return null
  }
  if (S.sel && ground) {
    const u = S.sel
    const p = ask((G, q) => q.freeSpot(G, u, ground.x, ground.z, side, G.units.filter((o) => o !== u)))
    if (p && Math.hypot(p.x - ground.x, p.z - ground.z) < 2.5) {
      const why = send(side, { t: 'place', u: u.id, c: G.nav.index(p.x, p.z) })
      if (!why) {
        sfx.click()
        for (const v of views.values()) updateLabel(v.u)
      }
      return why
    }
  }
  return null
}

// Pick up a unit (null: none). On a seat's own turn its move shows where it
// can go (the move's plan, which the click snaps to), and its shot or charge
// the range ring.
function select(u) {
  S.sel = u
  S.reach = null
  clearOverlay()
  if (u && G) {
    const ph = phaseKey(G)
    if (G.turn.stage === 'battle' && ph === 'move' && !u.flags.moved) {
      S.reach = ask((G, q) => q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0))
      paintReach(S.reach)
    }
    if (ph === 'shoot' && u.t.ranged) showRange(u, u.t.ranged.range)
    if (ph === 'charge') showRange(u, CHARGE_RANGE)
  }
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
  rangeRing.material.color.set(phaseKey(G) === 'charge' ? '#ffb070' : '#ffffff')
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

// What the pointer is over: a unit's line, or on a seat's own turn what its
// selected unit would do there (the path and inches of a move, a shot's
// odds, a charge's), or where a charge would end. Asked with the dice
// locked; while the player is behind, the units are as shown.
function hover() {
  const tip = $('#tooltip')
  tip.style.display = 'none'
  pathLine.visible = false
  ghost.visible = false
  const h = S.hoverPick
  const pk = picking()
  if (!h) {
    // off the board mid-pick: show where "Shortest move" would put the unit
    if (pk) ghostAt(pk.cell, pk.u.r)
    return
  }
  S.hover = h.unit
  let text = ''
  const sel = S.sel
  // a path, drawn with its end's ghost
  const path = (pts, i, r) => {
    pathLine.geometry.setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0.08, p.z)))
    pathLine.visible = true
    ghostAt(i, r)
  }
  if (pk && h.ground) {
    const i = nearestSpot(G.nav, pk.ok, h.ground.x, h.ground.z)
    if (i >= 0) {
      path(ask((G) => G.nav.path(pk.plan.res, i, pk.u.r, pk.plan.mode === 'fly' ? null : pk.plan.forbid)), i, pk.u.r)
      text = `End charge here · ${pk.plan.res.dist[i].toFixed(1)}" of ${pk.rolled}"`
    } else text = `✖ out of reach — pick a spot in the orange area`
  } else if (myTurn() && sel) {
    text = ask((G, q) => {
      const ph = q.phaseKey(G), nav = G.nav
      if (ph === 'move' && S.reach && h.ground && !h.unit) {
        const i = q.nearestValid(G, S.reach, h.ground.x, h.ground.z)
        if (i < 0) return ''
        path(nav.path(S.reach.res, i, sel.r, S.reach.mode === 'fly' ? null : S.reach.forbid), i, sel.r)
        return `${S.reach.res.dist[i].toFixed(1)}" of ${S.reach.max}"`
      }
      if (ph === 'shoot' && h.unit && h.unit.side !== sel.side) {
        const info = q.shotInfo(G, sel, h.unit)
        return info.ok ? oddsText(sel, h.unit, info) : `✖ ${info.why}`
      }
      if (ph === 'charge' && h.unit && h.unit.side !== sel.side) {
        if (!q.chargeTargets(G, sel).includes(h.unit)) return `✖ out of charge range (${q.gap(sel, h.unit).toFixed(1)}")`
        const p = q.chargePlan(G, sel, h.unit)
        return p ? `Charge: need ${p.need}" on 2D6 — ${Math.round(p2D6(p.need) * 100)}%` : '✖ no route'
      }
      return ''
    })
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
// the trace is the match's replayable fingerprint), then shown: its `log`
// event, played here by write, the destroyed-unit lines held back until an
// attack ends following it.
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
// the unit the open card shows (idled() redraws it as the table catches up)
let carded = null
function showCard(u) {
  const card = $('#card')
  carded = u
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
  // like the label. What it has done this turn and whether it stands in
  // cover have no shown source yet (the mirror holds neither: R7's HUD
  // model), so they read the match, and only once the table has caught up
  // with it: while the player is behind (the AI's turn, a watched battle)
  // they are left off, or the card would tell of moves and dice the table
  // hasn't played (§2.4). (The title's backdrop is never behind.)
  const mu = shown(u), live = player.idle
  const status = []
  if (live && u.flags.moved) status.push(u.flags.fellBack ? 'fell back' : u.flags.advanced ? `advanced +${u.flags.advRoll}"` : 'moved')
  if (live && u.flags.shot) status.push('shot')
  if (live && u.flags.charged) status.push('charged')
  if (mu.mesmerized) status.push('🌀 mesmerized')
  if (mu.alive > 0 && mu.engaged) status.push('⚔ in combat')
  if (live && mu.alive > 0 && inCover(atTable(), u)) status.push('🛡 in cover')
  const models = t.models > 1 ? `${mu.alive}/${t.models} models` : `${mu.models[0].w}/${t.W} wounds`
  card.innerHTML = `
    <div class="card-head s${u.side}"><b>${t.name}</b><span>${SIDES[u.side].short} · ${t.role}</span></div>
    <div class="card-sub">${mu.alive > 0 ? models : 'destroyed'}${status.length ? ' · ' + status.join(' · ') : ''}</div>
    <table class="stats"><tr>${statKeys.map((k) => `<th>${k}</th>`).join('')}</tr><tr>${statKeys.map((k) => `<td>${fmt(k)}</td>`).join('')}</tr></table>
    ${wpn(t.ranged, t.ranged?.spell ? '✦' : '➹')}${wpn({ ...t.melee, range: 0 }, '⚔')}
    <ul class="abil">${(t.abilities || []).map((a) => `<li>${a}</li>`).join('')}</ul>`
  card.classList.add('show')
}

// The HUD: the score, round, phase and seat as shown (the mirror), and what
// a seat played here can do now. Its buttons show while a local seat's
// decision is the one on the table, and go disabled (not just deaf) while
// the table plays: a seat's own action, or anything else. While the player
// is behind they keep what they showed, so they never read the match before
// the table has caught up with it; they hide once the decision has moved on
// (an End or an Auto hands the phase over).
function refreshUI() {
  const M = player.mirror, at = atTable()
  const rounds = at.setup.rounds
  // the score and the round as shown
  $('#vp0').textContent = M.vp[0]
  $('#vp1').textContent = M.vp[1]
  $('#round').textContent = M.stage === 'deploy' ? 'Deployment' : `Round ${Math.min(M.round, rounds)} / ${rounds}`
  document.querySelectorAll('#phases .ph').forEach((el) => {
    el.classList.toggle('on', M.stage === 'battle' && el.dataset.k === M.phase)
  })
  $('#sideA').classList.toggle('active', M.stage === 'battle' && M.active === 0)
  $('#sideB').classList.toggle('active', M.stage === 'battle' && M.active === 1)
  const idle = player.idle, P = localDecision(), sel = S.sel
  const deploying = P?.k === 'deploy'
  // the seat's own phase, which the table has reached (its banner played:
  // the mirror's turn fields are the last phase.start's)
  const mine = phaseShown && P?.k === 'phase' && M.stage === 'battle' && M.active === P.seats[0] && M.phase === P.phase && M.round === G.turn.round
  // (the same seat's charge, waiting on its end: still its own phase)
  const charging = phaseShown && P?.k === 'chargeEnd' && M.stage === 'battle' && M.active === P.seats[0] && M.phase === 'charge' && M.round === G.turn.round
  const pk = picking()
  const end = $('#endPhase'), auto = $('#autoPhase'), adv = $('#advance')
  if (!mine && !charging) buttonsUp = false
  else if (idle) buttonsUp = true
  // (the pick hides them: Shortest move stands in their place)
  const up = buttonsUp && !pk
  end.style.display = deploying || up ? '' : 'none'
  auto.style.display = up ? '' : 'none'
  $('#closestSpot').style.display = pk ? '' : 'none'
  if (deploying) end.textContent = 'Begin battle ▸'
  else if (mine) end.textContent = `End ${PHASE_NAME[P.phase]} ▸`
  end.disabled = auto.disabled = adv.disabled = !idle
  if (!mine) adv.style.display = 'none'
  else if (idle) adv.style.display = P.phase === 'move' && sel && !sel.flags.moved && !sel.flags.advanced && !ask((G, q) => q.isEngaged(G, sel)) ? '' : 'none'
  if (sel) {
    adv.textContent = `Advance (+D6") — no ${sel.t.ranged?.assault ? 'charge' : 'shooting or charge'} after`
    if (sel.t.chargeAfterAdvance) adv.textContent = 'Advance (+D6") — can still charge'
  }
  // the deploying seat's zone is lit; in battle both dim
  const dep = deploySeat()
  for (const s of [0, 1]) zoneMats[s].opacity = M.stage === 'battle' || M.stage === 'over' ? 0.05 : s === dep ? 0.2 : 0.07
  // hint line (a picked-up unit's kept as it was while the table plays its
  // action: the match has moved on already)
  let hint = $('#hint').textContent
  if (pk) hint = `Charge! Rolled ${pk.rolled}" — click the orange area to place ${pk.u.t.short}, or take the shortest move.`
  else if (deploying) hint = `Deployment — click one of your units, then click inside your shaded zone to move it there.`
  else if (G && phaseShown && M.stage === 'battle' && !human(M.active)) hint = `${SIDES[M.active].name} (AI) are taking their turn…`
  else if (mine && (idle || !sel)) {
    hint = {
      move: sel ? (ask((G, q) => q.isEngaged(G, sel)) ? 'Engaged — click inside the red area to fall back (no shooting or charging after).' : 'Click inside the shaded area to move. Difficult ground costs double.') : 'Movement — pick a unit with a white ring to move it.',
      shoot: sel ? 'Click an enemy unit to shoot it. Hover for odds.' : 'Shooting — pick a unit with a white ring to fire.',
      charge: sel ? 'Click an enemy within 12" to declare a charge, then roll 2D6.' : 'Charge — pick a unit to charge with.',
    }[P.phase] || ''
  } else if (!mine) hint = ''
  $('#hint').textContent = hint
  $('#hint').style.display = hint ? '' : 'none'
  refreshRings()
}

// Each unit's ring: the one picked up, the deploying seat's, a charge's
// target, and on a seat's own turn who can act and what the picked-up unit
// can shoot or charge (asked of the match, so only once the table has
// caught up); the one under the pointer.
function refreshRings() {
  const mine = myTurn(), dep = deploySeat(), pk = picking(), sel = S.sel
  // (unit id → [colour, opacity]) for what the match says, on a seat's turn
  const lit = !mine ? new Map() : ask((G, q) => {
    const ph = q.phaseKey(G), out = new Map()
    for (const u of G.units) {
      if (!q.alive(u) || u === sel) continue
      if (q.canAct(G, u)) out.set(u.id, ['#ffffff', 0.75])
      else if (sel && ph === 'shoot' && u.side !== sel.side && q.shotInfo(G, sel, u).ok) out.set(u.id, ['#ff5a4a', 0.95])
      else if (sel && ph === 'charge' && u.side !== sel.side && q.chargeTargets(G, sel).includes(u)) out.set(u.id, ['#ffa040', 0.95])
    }
    return out
  })
  for (const v of views.values()) {
    const u = v.u
    // (the units the table shows standing)
    if (!(shown(u).alive > 0)) continue
    const m = v.ring.material
    let op = 0, col = '#ffffff'
    if (u === sel) {
      op = 1
      col = '#ffe680'
    } else if (dep >= 0 && u.side === dep) {
      op = 0.5
    } else if (pk && u === pk.tg) {
      op = 0.95
      col = '#ffa040'
    } else if (lit.has(u.id)) {
      [col, op] = lit.get(u.id)
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
  // (longer when the seat shown is played here, or outside the battle)
  const M = player.mirror
  await wait(PACE.phaseStart(local(M.active), M.stage))
}

// ── Buttons ─────────────────────────────────────────────────────────────────
// End: in the deployment, the deploying seat is done (the last seat done
// starts the battle); on a seat's own turn, the phase ends.
// (Each button's handler returns why it sent nothing, null once it sent:
// for the ?debug block's hooks, which press them.)
$('#endPhase').onclick = () => {
  unlock()
  sfx.click()
  if (deploySeat() >= 0) {
    const why = send(deploySeat(), { t: 'deployed' })
    if (!why) {
      S.sel = null
      showCard(null)
      refreshUI()
    }
    return why
  }
  if (!myTurn()) return 'no phase of a seat played here to end now'
  select(null)
  return send(localSeat(), { t: 'end' })
}
// Shortest move: the charge ends where the AI's would.
$('#closestSpot').onclick = () => {
  sfx.click()
  return takeShortest()
}
// Auto: the AI plays the rest of the phase for the seat, then ends it (one
// command: the match plays it all at once, the table at its pace).
$('#autoPhase').onclick = () => {
  if (!myTurn()) return 'no phase of a seat played here to play out now'
  select(null)
  return send(localSeat(), { t: 'auto' })
}
// Advance: a D6 more inches for the unit picked up (it stays picked up, its
// move now as far as the roll allows: idled).
$('#advance').onclick = () => {
  const u = S.sel
  if (!u || !myTurn()) return 'no unit of a seat played here to advance now'
  return advance(u)
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
  showTable(S.seed)
}
$('#seed').onchange = () => {
  // (the table first: should it throw, S.seed still names the one on show)
  const seed = (Number($('#seed').value) || 1) >>> 0
  showTable(seed)
  S.seed = seed
  $('#seed').value = seed
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
  showTable(S.seed)
}

// keyboard panning
const keys = new Set()
addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return
  keys.add(e.key.toLowerCase())
  if (e.key === 'Escape' && !picking()) select(null)
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
// The title screen's table for a board seed: its board and both armies where
// any battle on it deploys them, drawn from a match that is never played
// (both seats human, so it waits at its deployment having drawn nothing, and
// its dice, 0, are never rolled). The battle a mode starts is a match of its
// own (start()), on this table when it is the battle's (tableOf: the title's
// is the classic terrain set and the races at the table, RACE_PICK).
function showTable(board, { terrain = 'classic', races = RACE_PICK } = {}) {
  // the new table first: if building it throws, the last one stays whole
  const next = createMatch({ board, dice: 0, terrain, seats: races.map((race) => ({ race, ctrl: 'human' })) }, { out: [] })
  session?.close()
  session = null
  G = null
  backdrop = next
  backdropAsDrawn = true
  // (the figures take their seat's colours as they are made)
  seatPlayers(seatsOf(races))
  clearUnits()
  S.sel = null
  S.reach = null
  pickShown = null
  phaseShown = false
  buttonsUp = false
  clearOverlay()
  $('#logList').innerHTML = ''
  $('#tray').classList.remove('show')
  // the table as shown: its units where they stand, nobody's flags, the
  // title's stage; the board played from its terrain.clear (the rest of
  // what the match reported, its deployment's lines, is no battle's)
  player.reset({ ...project(next), stage: 'title' })
  player.push(next.out.splice(0).filter((e) => /^terrain\./.test(e.t)))
  scatterTufts()
  for (const u of next.units) makeView(u, next)
  for (const u of next.units) updateLabel(u)
  // nothing from the last game carries over: banners, scorch marks, turn state
  for (const o of objViews) paintObjective(o, -1)
  fx.clearDecals()
  // (and a template or thorns a replaced table left standing, though only
  // the title and the end screen replace one, with nothing left to play)
  blastMarker?.userData.remove()
  blastMarker = null
  for (const spikes of spikesOf.values()) for (const s of spikes) scene.remove(s)
  spikesOf.clear()
  refreshUI()
}

// who plays each seat, by the title screen's mode buttons
const MODES = { bushtail: ['human', 'ai'], serpent: ['ai', 'human'], hotseat: ['human', 'human'], watch: ['ai', 'ai'] }

// What of a setup the table shows before its battle: the board, the terrain
// set and the races at it (a mission too, once a setup names one). Who plays
// a seat, the dice and the rounds draw nothing on it.
const tableOf = (setup) => {
  const s = fullSetup(setup)
  return { board: s.board, terrain: s.terrain, races: s.seats.map((x) => x.race) }
}
const sameTable = (a, b) => JSON.stringify(tableOf(a)) === JSON.stringify(tableOf(b))

// A battle: the whole setup (the board on the title screen, a fresh dice
// stream, who plays each seat), a LocalStore whose first entry starts it,
// and a Session over it for the seats played here. The match runs on at
// once: to each human seat's deployment, or (watch) to its end, and the
// table plays it from there.
function start(mode) {
  // an unknown mode changes nothing (S included), so the table stays playable
  if (!Object.hasOwn(MODES, mode)) throw new Error(`no mode "${mode}" (there are ${Object.keys(MODES).join(', ')})`)
  const who = MODES[mode]
  // (a battle starts on a fresh table: a second start without the end
  // screen's Back would find the last battle's on show)
  if (session) showTable(S.seed)
  // a fresh logic-dice stream per battle; ?dice=N replays one exactly
  const dice = (Number(params.get('dice')) || ((Math.random() * 1e9) | 0)) >>> 0
  const setup = {
    board: S.seed, dice, terrain: 'classic', rounds: MISSIONS.classic.rounds, diceMode: 'shared',
    seats: RACE_PICK.map((race, i) => ({ race, ctrl: who[i] })),
  }
  // The battle starts on the table shown, which must be its own: the
  // backdrop, on the same board and terrain with the same races and untouched
  // since it was drawn, is that match's table before anything has happened
  // (else it is drawn afresh from the battle's setup first: today the title's
  // always is the battle's). So the mirror starts from it, and the match's own
  // board events, which would rebuild the meshes chunk for chunk, are dropped
  // (P-present holds the table to the match at every checkpoint).
  if (!backdropAsDrawn || !sameTable(backdrop.setup, setup)) showTable(setup.board, tableOf(setup))
  S.control = [...who]
  S.sel = null
  S.reach = null
  seatPlayers(seatsOf(setup.seats.map((s) => s.race)))
  // the page's trace starts afresh (?debug), before the match's first line
  traceListener?.begin()
  player.reset(structuredClone(player.mirror))
  boardShown = true
  const store = new LocalStore()
  session = new Session({ store, localSeats: who.flatMap((c, s) => (c === 'human' ? [s] : [])), sink, onTrace })
  store.append({ s: -1, t: 'start', setup })
  if (session.status === 'refused') {
    // no battle: the title's table again, drawn afresh from the board it
    // showed (built once already, so it builds again), and no refused
    // Session left behind
    const why = session.error
    session.close()
    session = null
    boardShown = false
    showTable(backdrop.setup.board, tableOf(backdrop.setup))
    throw new Error(`the battle could not start: ${why}`)
  }
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
  refreshUI()
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
  for (const v of views.values()) {
    // (a unit walking a unit.move is drawn where its walk has got to)
    const u = v.u, mu = M.units[u.id], p = v.at ?? mu.pos
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

showTable(S.seed)
frame()
if (params.has('watch')) start('watch')
// ?debug exposes the table to the console (and to the test harness)
if (params.has('debug')) {
  // The input hooks are the calls a click or a button makes, so sim/ can
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
  // Since R6b the surface is derived from the battle's Session (no battle on
  // the title: its members read the backdrop there, and S.stage says
  // 'title'). The hooks are wrappers that build a command body and send it
  // through the Session (main.js's own command functions: moveTo, shoot, …),
  // returning a promise settled once the player has played everything again
  // (doCharge's: once no charge waits for its end either, so it stays
  // pending until the chargeEnd is placed, as the old pick did); a hook's
  // command the match refuses throws, since the driver checked it as the UI
  // does, and so does a button pressed when it can't send (every hook's:
  // deployClick's placement and the buttons' too). deployClick keeps its
  // pick-up-then-place pair, ending in a `place` for freeSpot's cell (a spot
  // too far from the click is still the UI's no-op, which the driver sees
  // for itself); placeCharge takes a cell the roll reaches, never Shortest
  // move's -1 (the driver sends the plan's own cell for that, as a click
  // on it would); endPhase and autoPhase press the buttons. Derived,
  // never stored: phaseResolve is truthy while a seat played here holds a
  // phase decision and the player is idle (main.js's myTurn); chargePick is
  // {u, plan, ok} while one holds a chargeEnd and the player is idle (the
  // charge-end tool's pick: plan.cell the shortest move's, ok a 1 per cell
  // the roll reaches); S.busy and S.auto are !player.idle; S.deploySide is
  // the seat deploying here. S's turn fields read the match (G.turn; wiped
  // undefined until a side is wiped, -1 in G.turn; the phase the key of
  // G.turn.ph), except that S.stage says 'over' only once the page has
  // shown the end (the player idle, every trace line joined), since sim/
  // stops reading there; until then 'battle'. units, nav and scenery.chunks
  // are the match's, and the queries take it (q.canAct: (u) => canAct(G,
  // u)), asked with the dice locked. S lists and copies as a plain object
  // would ({...S}, JSON), turn fields included, though structuredClone
  // refuses it, as it does any Proxy.
  //
  // The trace is one array for the page's lifetime, fed by each battle's
  // onTrace (createMatch's, which the Session passes) as the match writes
  // a line, and emptied when start() begins a battle. The match runs ahead
  // of the view: one `end` computes a whole AI turn, a watched battle the
  // whole battle, before its first die is shown. So the trace keeps pace
  // with the player: a line the match writes while the player is behind it
  // (events not yet played) joins `trace` when the player reaches it: at the
  // log event that shows it (each carries `at`, the trace's length when it
  // was logged, and `trace` is brought up to `at` before the entry is
  // written, which carries it too, as data-at), or when the player goes
  // idle. sim/ then records every write at the trace length it always did.
  // It takes a state line's shadow as the line joins (oracle/shadow.mjs
  // reads S, q.rngState(), units and scenery.chunks then), when the match
  // has long moved on; so each state line carries a snapshot of what that
  // shadow reads, taken as the match writes the line (the turn as the
  // legacy shadow has it, the dice, every unit, every chunk), and while the
  // line is pushed those members serve the snapshot. (The legacy round
  // quirk too: one past the last on the `over` line of a battle that ran its
  // course, as sim/run.mjs's shadowPartsG has it.)
  //
  // Not promised, for sim/terrain-shots.mjs only: clock, camera, renderer,
  // S.titleSpin, scenery.scene and scenery.blast (a blast played as
  // core/actions/shoot.js's blastLands plays one: its reports played, the
  // nav refreshed; on the title only, on the backdrop, which a start() then
  // draws afresh: with a battle on it throws, the battle's board changing
  // only through its commands). Nor G and session, for
  // the console and for sim/rematch-check.mjs (G.out, which it requires
  // empty whenever the player is idle and before each new table: the
  // Session hands every event over as it folds an entry; it also presses
  // #again, #reroll and #seed's onchange, and reads S.seed), nor player,
  // which it reads for that (player.idle). Nor, for sim/present-check.mjs,
  // present.listen(observer), present.card(u) (the unit card's status line
  // as it shows u now: it holds the card to the mirror while the player is
  // behind), G (at the game's end it holds its mirror to project(G)) and
  // player.idle (at the game's end): the observer's
  // reset(M) hears each new table's mirror (the backdrop's, and a battle's
  // as it starts, which it folds its own from) and event(e, M) every event
  // as the player plays it, so it can hold its mirror to each act's `proj`
  // and to each `check {proj}`, which only ?debug carries: P-present's
  // checkpoints, put into each entry's events before the player gets them
  // (present(), below). The core can't project (present/ is above it), so
  // onTrace takes project(G) as the match writes each `act`, `phase` and
  // `over` line, where it stands in the events so far: a `check` there
  // (after an action's own events, before its end re-reports the flags and
  // labels; after a fight or morale phase; before the end), the `act`
  // event's `proj` the act line's; and a `check` at the end of each entry's
  // events, as the match stops for a decision or ends. The M it is handed is
  // the player's own, folded in place (present/mirror.js): an observer
  // reads it and never folds into it, or every event would be applied
  // twice.
  const TURN = new Set(['stage', 'round', 'active', 'first', 'phase', 'vp', 'wiped'])
  const DERIVED = {
    busy: () => !player.idle,
    auto: () => !player.idle,
    deploySide: () => (deploySeat() < 0 ? undefined : deploySeat()),
  }
  const trace = [], held = []
  // the state a state line carries, while it is pushed
  let serving = null
  // the page has shown everything: the player idle, every line joined
  const caughtUp = () => player.idle && !held.length
  const turn = (k) => {
    if (serving) return serving.turn[k]
    const g = atTable(), T = g.turn
    if (k === 'stage') return !G ? 'title' : T.stage === 'over' && !caughtUp() ? 'battle' : T.stage
    return k === 'wiped' ? (T.wiped < 0 ? undefined : T.wiped) : k === 'phase' ? phaseKey(g) : T[k]
  }
  const legacyS = new Proxy(S, {
    get: (s, k) => (TURN.has(k) ? turn(k) : Object.hasOwn(DERIVED, k) ? DERIVED[k]() : s[k]),
    has: (s, k) => TURN.has(k) || Object.hasOwn(DERIVED, k) || k in s,
    set: (s, k, v) => {
      if (TURN.has(k)) throw new Error(`__ts.S.${k} is the match's ${k === 'phase' ? 'G.turn.ph (phaseKey)' : `G.turn.${k}`}: it can't be set through S`)
      if (Object.hasOwn(DERIVED, k)) throw new Error(`__ts.S.${k} is derived from the Session and the player: it can't be set`)
      s[k] = v
      return true
    },
    ownKeys: (s) => [...new Set([...Reflect.ownKeys(s), ...TURN, ...Object.keys(DERIVED)])],
    getOwnPropertyDescriptor: (s, k) =>
      TURN.has(k) ? { value: turn(k), enumerable: true, configurable: true, writable: false }
      : Object.hasOwn(DERIVED, k) ? { value: DERIVED[k](), enumerable: true, configurable: true, writable: false }
      : Reflect.getOwnPropertyDescriptor(s, k),
  })
  // the player is behind the match: events emitted and not yet played
  const behind = (g) => !!g.out?.length || !player.idle
  // What sim/oracle's shadow reads of the match as state line `line` is
  // written: the turn as the legacy shadow has it, the dice, every unit,
  // every chunk (copies: the match moves on).
  const snapshot = (g, line) => {
    const T = g.turn
    // (the old loop's `for` left the round one past the last on a battle
    // that ran its course: the engine ends one at its score step)
    const ranOut = /^over /.test(line) && T.step === 'score'
    return {
      turn: { stage: T.stage, round: ranOut ? T.round + 1 : T.round, active: T.active, phase: phaseKey(g), first: T.first, vp: [...T.vp], wiped: T.wiped < 0 ? undefined : T.wiped },
      rng: rngState(g.rng),
      units: g.units.map((u) => ({ ...u, pos: { ...u.pos }, flags: { ...u.flags }, models: u.models.map((m) => ({ ...m })) })),
      chunks: g.terrain.chunks.map((c) => ({ id: c.id, kind: c.kind, alive: c.alive, hp: c.hp, shape: { ...c.shape } })),
    }
  }
  // a line joins the trace, a state line with the state it carries
  const push = (line, snap) => {
    serving = snap
    try {
      trace.push(line)
    } finally {
      serving = null
    }
  }
  // P-present's checkpoints in the events so far: { at, proj, act }
  const marks = []
  // the hooks' promises, settled once the player is idle and `until()` holds
  const waiters = []
  const settle = (until = () => true) => new Promise((resolve) => {
    waiters.push({ until, resolve })
    traceListener.settled()
  })
  traceListener = {
    begin: () => {
      trace.length = 0
      held.length = 0
      marks.length = 0
      // a hook's promise left waiting by the battle a start() abandons is
      // settled now (its battle is gone), never left to wait on the next
      for (const w of waiters.splice(0)) w.resolve()
    },
    line: (line, g) => {
      const snap = /^log /.test(line) ? null : snapshot(g, line)
      if (/^(act|phase|over) /.test(line)) marks.push({ at: g.out.length, proj: project(g), act: /^act /.test(line) })
      if (held.length || behind(g)) held.push([line, snap])
      else push(line, snap)
    },
    // the log entry about to be written was logged at trace length `at`
    reach: (at) => {
      while (trace.length < at && held.length) push(...held.shift())
    },
    idle: () => {
      while (held.length) push(...held.shift())
    },
    settled: () => {
      if (!player.idle) return
      for (const w of waiters.splice(0)) {
        // (a test that throws settles its promise: this runs as the player
        // goes idle, inside whatever made it, a new table's drawing too)
        let done = true
        try {
          done = w.until()
        } catch {}
        if (done) w.resolve()
        else waiters.push(w)
      }
    },
    // An entry's events, with P-present's checkpoints put in: a `check` at
    // each mark, the act events given their act line's projection, and a
    // `check` with the match as it stops.
    present: (events, g) => {
      const out = [], projs = marks.filter((m) => m.act).map((m) => m.proj)
      let m = 0
      events.forEach((e, i) => {
        while (m < marks.length && marks[m].at <= i) out.push({ t: 'check', proj: marks[m++].proj })
        out.push(e.t === 'act' ? { ...e, proj: projs.shift() } : e)
      })
      while (m < marks.length) out.push({ t: 'check', proj: marks[m++].proj })
      out.push({ t: 'check', proj: project(g) })
      marks.length = 0
      return out
    },
  }
  // a hook's command must be one the match takes: the driver checked it as
  // the UI does, so a refusal is a bug, not a click to ignore
  const must = (why, what) => {
    if (why) throw new Error(`?debug ${what}: ${why}`)
  }
  // a question with the dice locked, of the match shown
  const asked = (fn) => preview(atTable(), fn)
  window.__ts = {
    S: legacyS, clock, camera, controls, renderer, trace,
    get G() {
      return G
    },
    get session() {
      return session
    },
    get player() {
      return player
    },
    present: {
      listen(observer) {
        player.observer = observer
      },
      // the unit card's status line as it shows `u` now (it opens the card)
      card(u) {
        showCard(u)
        return /class="card-sub">([^<]*)</.exec($('#card').innerHTML)?.[1] ?? null
      },
    },
    get units() {
      return serving ? serving.units : atTable().units
    },
    get nav() {
      return atTable().nav
    },
    scenery: {
      get chunks() {
        return serving ? serving.chunks : atTable().terrain.chunks
      },
      scene,
      // (the title's table only: a battle's board changes only through its
      // commands, the log being the whole truth of it; and a table blasted
      // here is no battle's, so the next start() draws a fresh one)
      blast(x, z, r, dmg, opts) {
        if (G) throw new Error('?debug scenery.blast: only on the title screen (no battle)')
        const out = []
        const broke = backdrop.terrain.blast(x, z, r, dmg, opts, out)
        backdropAsDrawn = false
        player.push(out)
        refreshNav(backdrop)
        return broke
      },
    },
    validEnd: (plan, i) => asked((g) => validEnd(g, plan, i)),
    get phaseResolve() {
      return myTurn() || null
    },
    get chargePick() {
      const pk = picking()
      return pk && { u: pk.u, plan: pk.plan, ok: pk.ok }
    },
    start,
    select,
    doMove: (u, c) => {
      must(moveTo(u, c), 'doMove')
      return settle()
    },
    doAdvance: (u) => {
      must(advance(u), 'doAdvance')
      return settle()
    },
    doShoot: (u, tg) => {
      must(shoot(u, tg), 'doShoot')
      return settle()
    },
    doCharge: (u, tg) => {
      must(charge(u, tg), 'doCharge')
      // (the battle it was sent in: a new table, or another battle, ends the
      // wait)
      const s = session
      return settle(() => s !== session || s.G.pending?.k !== 'chargeEnd')
    },
    placeCharge: (c) => {
      must(placeCharge(c), 'placeCharge')
      return settle()
    },
    deployClick: (unit, ground) => must(deployClick(unit, ground), 'deployClick'),
    endPhase: () => {
      must($('#endPhase').onclick(), 'endPhase')
      return settle()
    },
    autoPhase: () => {
      must($('#autoPhase').onclick(), 'autoPhase')
      return settle()
    },
    // read-only rules queries, for choosing legal input (only what sim/ uses)
    q: {
      alive,
      isEngaged: (u) => asked((g) => isEngaged(g, u)),
      canAct: (u) => asked((g) => canAct(g, u)),
      movePlan: (u, extra) => asked((g) => movePlan(g, u, extra)),
      freeSpot: (u, x, z, side, others) => asked((g) => freeSpot(g, u, x, z, side, others)),
      shootTargets: (u) => asked((g) => shootTargets(g, u)),
      shotInfo: (u, tg) => asked((g) => shotInfo(g, u, tg)),
      chargeTargets: (u) => asked((g) => chargeTargets(g, u)),
      chargePlan: (u, tg) => asked((g) => chargePlan(g, u, tg)),
      rngState: () => (serving ? serving.rng : rngState(atTable().rng)),
    },
    screen(x, y, z) {
      const v = new THREE.Vector3(x, y, z).project(camera)
      return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight]
    },
  }
}
