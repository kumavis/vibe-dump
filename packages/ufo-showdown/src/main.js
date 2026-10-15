import '@fontsource/bungee/latin-400.css'
import { Starfield, hexA } from './stars.js'
import { sfx, unlockAudio, toggleMute, isMuted } from './audio.js'
import {
  PLAYER_COLORS,
  POWERS,
  SAUCERS,
  drawShieldBubble,
  drawSaucer,
  drawBlorp,
  drawMothership,
  drawBubble,
  drawIcon,
  drawPlayerShot,
  drawEnemyShot,
  drawLaser,
  drawPuff,
  MOTHER,
} from './art.js'
import { SLOTTED, FIRE_DELAY, SHIP_SPEED, SPREADS, addPower, tickPowers, powerLevel, absorbHit } from './powers.js'
import { MISSIONS, missionIndex } from './missions.js'
import { starReward, loadout } from './catalog.js'
import { loadSave, writeSave } from './save.js'
import { drawShipModel, drawDrone } from './ships.js'
import { openStore, storeKey } from './store/store.js'
import asteroidsPack from './content/asteroids/index.js'
import racePack from './content/race/index.js'
import nebulaPack from './content/nebula/index.js'
import ionPack from './content/ion/index.js'
import swarmPack from './content/swarm/index.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const near = (ax, ay, bx, by, r) => (ax - bx) ** 2 + (ay - by) ** 2 < r * r

const FONT = "'Bungee', 'Arial Black', sans-serif"

// ================================================================ canvas

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const stars = new Starfield()

// The world is always at least 640 wide and 800 tall; a wider window just
// gives the fight more room to the sides.
let W = 1280
let H = 800
let S = 1
let DPR = 1

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2)
  const cw = window.innerWidth
  const ch = window.innerHeight
  S = Math.min(ch / 800, cw / 640)
  W = cw / S
  H = ch / S
  canvas.width = Math.round(cw * DPR)
  canvas.height = Math.round(ch * DPR)
  canvas.style.width = cw + 'px'
  canvas.style.height = ch + 'px'
  stars.resize(W, H)
  for (const p of players) {
    p.x = clamp(p.x, 34, W - 34)
    p.y = clamp(p.y, playerTop(), H - 48)
  }
  if (mode === 'map') renderMap()
}
window.addEventListener('resize', resize)

const playerTop = () => H * 0.5

// ================================================================ game data

// Enemy types. The saucers here move along the formation paths in
// updateEnemy(); content packs add types with their own update/draw (see
// src/content/README.md).
const ENEMY = {
  scout: { hp: 1, r: 28, score: 100 },
  zigzag: { hp: 2, r: 26, score: 150 },
  diver: { hp: 2, r: 28, score: 200 },
  gunner: { hp: 5, r: 36, score: 300, boom: 1.2 },
}

const P1_KEYS = { up: 'KeyW', left: 'KeyA', down: 'KeyS', right: 'KeyD' }
const P2_KEYS = { up: 'ArrowUp', left: 'ArrowLeft', down: 'ArrowDown', right: 'ArrowRight' }

// ================================================================ state

let mode = 'menu' // menu | map | store | play | pause | over | done | win
let numPlayers = 1
let menuSel = 0
let menuRow = 0 // 0: how many players, 1: the store button
let mapSel = 0
let save = loadSave()
// Missions get added to the map over time; anything after the furthest one a
// player has already cleared stays open to them.
MISSIONS.forEach((m, i) => {
  if (save.missions.cleared[m.id]) save.missions.unlocked = Math.max(save.missions.unlocked, Math.min(MISSIONS.length, i + 2))
})
let mission = MISSIONS[0]
let missionIdx = 0
let level = null // the running level's definition
let run = { deaths: 0, finished: false }
let lastReward = null
let storeReturn = 'menu'
let players = []
let enemies = []
let pShots = []
let eShots = []
let bubbles = []
let particles = []
let rings = []
let texts = []
let lasers = []
let pending = [] // spawns scheduled a beat apart, so formations string out
let boss = null
let phase = 'intro' // intro | main | warning | boss | clear | victory
let phaseT = 0
let bubbleTimer = 0
let shake = 0
let flash = 0
let time = 0
let endTimer = -1
let fireworkT = 0
let cutscene = null // { onSkip, t } while a level plays a scripted moment
let bars = 0 // letterbox bars, 0..1
let menuUfos = []

// ================================================================ helpers

const alive = () => players.filter((p) => p.alive)

function nearestPlayer(x, y) {
  let best = null
  let bd = Infinity
  for (const p of players) {
    if (!p.alive) continue
    const d = (p.x - x) ** 2 + (p.y - y) ** 2
    if (d < bd) {
      bd = d
      best = p
    }
  }
  return best
}

function later(delay, fn) {
  pending.push({ t: delay, fn })
}

// Every enemy bullet flies a little faster than the number it was fired with.
const BULLET_SPEED = 1.12

function shoot(x, y, a, speed, color, r = 6) {
  speed *= BULLET_SPEED
  eShots.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r, color, kind: 'bolt' })
}

function aimed(x, y, n, spread, speed, color, target = pick(alive())) {
  const a0 = target ? Math.atan2(target.y - y, target.x - x) : Math.PI / 2
  for (let i = 0; i < n; i++) shoot(x, y, a0 + (i - (n - 1) / 2) * spread, speed, color)
}

function fan(x, y, n, width, speed, color, center = Math.PI / 2) {
  for (let i = 0; i < n; i++) shoot(x, y, center - width / 2 + (width * i) / (n - 1), speed, color)
}

function ringShot(x, y, n, speed, color, offset = 0, r = 6) {
  for (let i = 0; i < n; i++) shoot(x, y, offset + (TAU * i) / n, speed, color, r)
}

function popText(x, y, text, color = '#ffffff', size = 18, life = 1.1) {
  const t = { x, y, text, color, size, life, max: life, rise: 36 }
  texts.push(t)
  return t
}

function addScore(owner, pts, x, y) {
  const p = players[owner] || players[0]
  if (!p) return
  p.score += pts
  if (x !== undefined) popText(x, y, '+' + pts, p.pal.light, 15, 0.8)
}

const persist = () => writeSave(save)

// ================================================================ the game API
//
// Content packs (src/content/*) get this object as `g`: everything a level,
// boss or enemy type needs to read the world and act on it. The arrays are
// replaced every frame as dead things are filtered out, so read them through
// `g` each time rather than holding on to one. See src/content/README.md.
const g = {
  ctx,
  sfx,
  rand,
  pick,
  clamp,
  near,
  TAU,
  FONT,
  get W() { return W },
  get H() { return H },
  get time() { return time },
  get phase() { return phase },
  get phaseT() { return phaseT },
  get mission() { return mission },
  get difficulty() { return mission.difficulty },
  get numPlayers() { return numPlayers },
  get players() { return players },
  get enemies() { return enemies },
  get eShots() { return eShots },
  set eShots(v) { eShots = v },
  get pShots() { return pShots },
  get bubbles() { return bubbles },
  get lasers() { return lasers },
  get boss() { return boss },
  get debug() { return params.has('debug') },
  playerTop,
  canFire,
  alive,
  nearestPlayer,
  later,
  spawn,
  shoot,
  aimed,
  fan,
  ringShot,
  popText,
  addScore,
  explode,
  sparks,
  splash,
  dropBubble,
  damageEnemy,
  damageBoss,
  startBossDeath,
  bossEnter,
  hpMult,
  hurtPlayer,
  banner,
  shake(n) { shake = Math.max(shake, n) },
  // A short scripted moment: ships stop taking orders and stop shooting (and
  // can't be hurt), the HUD steps aside for letterbox bars, and Enter or a tap
  // calls onSkip — which should wrap the scene up and call g.cutscene(false).
  cutscene(on, opts = {}) {
    cutscene = on ? { onSkip: opts.onSkip ?? null, minSkip: opts.minSkip ?? 0.6, t: 0 } : null
  },
  get inCutscene() { return !!cutscene },
  // how fast the starfield streams past; 1 is cruising, 6+ is warp
  warp(n) { stars.targetSpeed = n },
  flash(n) { flash = Math.max(flash, n) },
  // The level's main part is over: on to the boss, or straight to the finish.
  levelDone() {
    if (phase !== 'main') return
    phaseT = 0
    if (mission.boss) {
      const def = BOSSES[mission.boss]
      phase = 'warning'
      banner(def.warnSub ?? 'Warning!', def.name, 'warn')
      sfx.siren()
    } else {
      phase = 'clear'
    }
  },
}

// ================================================================ particles

function explode(x, y, color, size = 1) {
  const n = Math.round(16 * size + 6)
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU
    const sp = rand(80, 340) * Math.sqrt(size)
    const life = rand(0.35, 0.9) * (0.7 + size * 0.3)
    particles.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life,
      max: life,
      color: pick([color, color, '#ffffff', '#ffd54a']),
      size: rand(1.6, 3.6) * Math.sqrt(size),
      kind: 'spark',
      drag: 2.2,
    })
  }
  for (let i = 0; i < 4 * size; i++) {
    const a = Math.random() * TAU
    const sp = rand(10, 60) * size
    const life = rand(0.5, 1.1)
    particles.push({
      x: x + rand(-10, 10) * size,
      y: y + rand(-10, 10) * size,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life,
      max: life,
      color: '#8a7fb8',
      size: rand(10, 22) * size,
      kind: 'puff',
      drag: 1.5,
    })
  }
  particles.push({ x, y, vx: 0, vy: 0, life: 0.18, max: 0.18, color: '#ffffff', size: 30 * size, kind: 'glow', drag: 0 })
  rings.push({ x, y, r: 6, max: 70 * size, speed: 300 * Math.sqrt(size), color, w: 4 * Math.sqrt(size) })
  if (particles.length > 900) particles.splice(0, particles.length - 900)
}

function sparks(x, y, color, n = 5) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU
    const sp = rand(60, 220)
    const life = rand(0.15, 0.35)
    particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life, max: life, color, size: rand(1.2, 2.4), kind: 'spark', drag: 3 })
  }
}

function splash(x, y, color) {
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU
    const sp = rand(120, 240)
    const life = rand(0.35, 0.6)
    particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life, max: life, color, size: rand(2.5, 4.5), kind: 'drop', drag: 3 })
  }
  rings.push({ x, y, r: 20, max: 80, speed: 260, color, w: 3 })
}

// ================================================================ players

// A ship as it leaves the hangar: hull, paint and upgrades from the save
// (catalog.js `loadout`), with its starter power-ups already loaded.
function makePlayer(id) {
  const lo = loadout(save, id)
  const p = {
    id,
    pal: PLAYER_COLORS[id], // team colour: HUD, labels, lasers
    paint: lo.paint, // what the hull is painted
    ship: lo.ship,
    lo,
    x: numPlayers === 1 ? W / 2 : W * (id ? 0.62 : 0.38),
    y: H - 110,
    vx: 0,
    vy: 0,
    tilt: 0,
    lives: lo.lives,
    alive: true,
    out: false,
    respawn: 0,
    invuln: 2,
    fireCd: 0.4,
    hitR: lo.hitR,
    maxSlots: lo.slots,
    powers: [], // see powers.js
    phoenix: lo.phoenix,
    carry: null, // something a level has the ship hauling (see content/README.md)
    droneCd: 0.5,
    score: 0,
    touch: null,
  }
  for (const st of lo.starters) for (let i = 0; i < st.level; i++) addPower(p.powers, st.type, p.maxSlots)
  if (lo.lifeShield) addPower(p.powers, 'shield', p.maxSlots)
  return p
}

// Where a ship's helper drones fly: off each wingtip, bobbing.
function dronePositions(p) {
  const n = p.lo.drones.count
  const out = []
  for (let i = 0; i < n; i++) {
    const side = n === 1 ? -1 : i ? 1 : -1
    out.push([p.x + side * 48, p.y + 6 + Math.sin(time * 4 + i * 2) * 5])
  }
  return out
}

function steer(p) {
  let dx = 0
  let dy = 0
  const sets = numPlayers === 1 ? [P1_KEYS, P2_KEYS] : [p.id === 0 ? P1_KEYS : P2_KEYS]
  for (const k of sets) {
    if (keys.has(k.left)) dx -= 1
    if (keys.has(k.right)) dx += 1
    if (keys.has(k.up)) dy -= 1
    if (keys.has(k.down)) dy += 1
  }
  return { dx: clamp(dx, -1, 1), dy: clamp(dy, -1, 1) }
}

function updatePlayer(p, dt) {
  if (!p.alive) {
    if (!p.out) {
      p.respawn -= dt
      if (p.respawn <= 0) {
        p.alive = true
        p.x = clamp(p.x, 60, W - 60)
        p.y = H - 110
        p.vx = p.vy = 0
        p.invuln = 2.2
        if (p.lo.lifeShield) addPower(p.powers, 'shield', p.maxSlots)
        level?.onRespawn?.(g, p)
      }
    }
    return
  }
  const top = playerTop()
  const sp = SHIP_SPEED[powerLevel(p.powers, 'speed')] * p.lo.speed * (p.carry ? p.carry.slow ?? 0.8 : 1)
  let tvx
  let tvy
  if (cutscene) {
    tvx = 0
    tvy = 0
    p.invuln = Math.max(p.invuln, 0.4)
  } else if (p.touch) {
    tvx = clamp((p.touch.x - p.x) * 9, -sp, sp)
    tvy = clamp((p.touch.y - 70 - p.y) * 9, -sp, sp)
  } else {
    const { dx, dy } = steer(p)
    tvx = dx * sp
    tvy = dy * sp * 0.8
  }
  const k = Math.min(1, dt * 14)
  p.vx += (tvx - p.vx) * k
  p.vy += (tvy - p.vy) * k
  p.x = clamp(p.x + p.vx * dt, 34, W - 34)
  p.y = clamp(p.y + p.vy * dt, top, H - 48)
  p.tilt += (p.vx / sp - p.tilt) * Math.min(1, dt * 10)

  p.invuln = Math.max(0, p.invuln - dt)
  tickPowers(p.powers, dt)

  const firing = phase !== 'victory' && !level?.noFire && !cutscene
  p.fireCd -= dt
  if (p.fireCd <= 0 && firing) {
    p.fireCd = FIRE_DELAY[powerLevel(p.powers, 'rapid')]
    const spd = 900
    const pierce = p.lo.pierce
    for (const a of SPREADS[powerLevel(p.powers, 'triple')]) {
      const x = p.x + a * 40
      const y = p.y - (a ? 30 : 34)
      const vx = Math.sin(a) * spd
      const vy = -Math.cos(a) * spd
      if (p.lo.twin) {
        // side by side, square to the direction of travel
        const ox = Math.cos(a) * 8
        const oy = Math.sin(a) * 8
        pShots.push({ x: x - ox, y: y - oy, vx, vy, owner: p.id, pierce })
        pShots.push({ x: x + ox, y: y + oy, vx, vy, owner: p.id, pierce })
      } else pShots.push({ x, y, vx, vy, owner: p.id, pierce })
    }
    sfx.zap()
  }

  // helper drones keep up a steady fire of their own
  if (p.lo.drones.count && firing) {
    p.droneCd -= dt
    if (p.droneCd <= 0) {
      p.droneCd = p.lo.drones.delay
      for (const [dx, dy] of dronePositions(p)) pShots.push({ x: dx, y: dy - 12, vx: 0, vy: -820, owner: p.id, drone: true })
    }
  }
}

function dropCarry(p) {
  if (!p.carry) return
  const c = p.carry
  p.carry = null
  c.onDrop?.(p)
}

function hurtPlayer(p) {
  if (!p.alive || p.invuln > 0 || phase === 'victory' || phase === 'clear' || cutscene) return
  if (absorbHit(p.powers)) {
    p.invuln = 1.2
    sfx.shieldPop()
    splash(p.x, p.y, POWERS.shield.color)
    const left = powerLevel(p.powers, 'shield')
    popText(p.x, p.y - 50, left ? `Shield blocked it! ×${left} left` : 'Shield saved you!', POWERS.shield.color, 15)
    return
  }
  if (p.phoenix) {
    // the Phoenix shrugs off one crash per mission in a blaze of light
    p.phoenix = false
    p.invuln = 2.2
    nova(p)
    popText(p.x, p.y - 60, 'The Phoenix rises!', '#ffb02e', 20, 1.6)
    return
  }
  run.deaths++
  dropCarry(p)
  p.lives--
  p.alive = false
  p.powers.length = 0
  level?.onShipDown?.(g, p)
  explode(p.x, p.y, p.pal.main, 1.6)
  sfx.hurt()
  shake = Math.max(shake, 16)
  if (p.lives > 0) {
    p.respawn = 1.4
  } else {
    p.out = true
    if (numPlayers === 2 && players.some((q) => !q.out)) {
      popText(p.x, Math.max(p.y - 60, H * 0.45), `${p.pal.name} is down — grab a heart to bring them back!`, p.pal.light, 16, 2.6)
    }
  }
}

function revive(p, by) {
  p.out = false
  p.alive = true
  p.lives = 1
  p.invuln = 2.5
  p.x = clamp(by ? by.x + (p.id ? 70 : -70) : W / 2, 60, W - 60)
  p.y = H - 110
  p.vx = p.vy = 0
  if (p.lo.lifeShield) addPower(p.powers, 'shield', p.maxSlots)
  sfx.revive()
  splash(p.x, p.y, p.pal.main)
  popText(p.x, p.y - 60, `${p.pal.name} is back!`, p.pal.light, 18, 1.6)
}

// ================================================================ bubbles

function powerWeights() {
  const needHeart = players.some((p) => p.out || p.lives <= 1)
  return { shield: 18, triple: 22, rapid: 20, speed: 12, heart: needHeart ? 26 : 9, nova: 9 }
}

function randomPower() {
  const w = powerWeights()
  let total = 0
  for (const k in w) total += w[k]
  let r = Math.random() * total
  for (const k in w) {
    r -= w[k]
    if (r <= 0) return k
  }
  return 'triple'
}

function dropBubble(x, y, type = randomPower()) {
  bubbles.push({ x, x0: x, y, type, t: rand(0, 6), r: 24, vy: rand(65, 85) })
}

function collect(p, b) {
  const info = POWERS[b.type]
  sfx.bubble()
  splash(b.x, b.y, info.color)
  let label = info.label + '!'
  if (SLOTTED.has(b.type)) {
    const { slot, capped, dropped } = addPower(p.powers, b.type, p.maxSlots)
    if (capped && b.type === 'shield') {
      addScore(p.id, 250)
      label = 'Max shield! +250'
    } else if (capped) label = `${info.label} ×3 — more time!`
    else if (slot.level > 1) label = `${info.label} ×${slot.level}!`
    if (dropped) popText(b.x, b.y - 4, `${POWERS[dropped.type].label} dropped`, '#a9b3d6', 13, 1.2)
  }
  switch (b.type) {
    case 'heart': {
      const down = players.find((q) => q !== p && q.out)
      if (down) {
        revive(down, p)
        label = 'Rescue!'
      } else if (p.lives < Math.max(5, p.lo.lives)) {
        p.lives++
        label = '+1 life!'
      } else {
        addScore(p.id, 500)
        label = '+500!'
      }
      break
    }
    case 'nova':
      nova(p)
      break
  }
  popText(b.x, b.y - 30, label, info.color, 20, 1.2)
}

function nova(p) {
  sfx.nova()
  flash = 0.5
  shake = Math.max(shake, 12)
  rings.push({ x: p.x, y: p.y, r: 10, max: Math.hypot(W, H), speed: 1500, color: POWERS.nova.color, w: 16 })
  for (const s of eShots) sparks(s.x, s.y, '#e6c2ff', 3)
  eShots = []
  for (const e of enemies) damageEnemy(e, 4, p.id)
  if (boss && !boss.dying && boss.def.nova) boss.def.nova(boss, p.id, g)
}

// ================================================================ enemies

function spawn(type, x, y, o = {}) {
  const d = ENEMY[type]
  const e = {
    type,
    x,
    y,
    hp: d.hp,
    r: d.r,
    t: 0,
    flash: 0,
    tilt: 0,
    fireT: rand(1.2, 3.5),
    entered: false,
    seed: Math.random() * TAU,
    ...o,
  }
  enemies.push(e)
  return e
}

function launchWave(kind) {
  switch (kind) {
    case 'snake': {
      const x0 = rand(W * 0.3, W * 0.7)
      const amp = Math.min(W * 0.28, 260)
      for (let i = 0; i < 7; i++) later(i * 0.28, () => spawn('scout', x0, -40, { path: 'sine', x0, amp, freq: 1.5, speed: 140 }))
      break
    }
    case 'rain': {
      const n = 5 + mission.difficulty
      for (let i = 0; i < n; i++) later(i * 0.45, () => spawn('scout', rand(60, W - 60), -40, { path: 'fall', speed: rand(120, 170) }))
      break
    }
    case 'sweep': {
      const dir = Math.random() < 0.5 ? 1 : -1
      const y0 = rand(110, 210)
      for (let i = 0; i < 6; i++) {
        later(i * 0.38, () => spawn('scout', dir > 0 ? -40 : W + 40, y0, { path: 'sweep', vx: dir * 210, y0, entered: true }))
      }
      break
    }
    case 'vee': {
      const cx = rand(W * 0.3, W * 0.7)
      const slots = [[0, 0], [-60, -50], [60, -50], [-120, -100], [120, -100]]
      if (mission.difficulty >= 3) slots.push([-180, -150], [180, -150])
      for (const [ox, oy] of slots) spawn('zigzag', cx + ox, -40 + oy, { path: 'zig', speed: 110, vx: ox < 0 ? -150 : 150, zt: 0 })
      break
    }
    case 'divers': {
      const n = mission.difficulty >= 3 ? 3 : 2
      for (let i = 0; i < n; i++) later(i * 0.5, () => spawn('diver', (W * (i + 1)) / (n + 1), -40, { path: 'dive', state: 'enter', hoverY: rand(120, 220) }))
      break
    }
    case 'gunners': {
      const spots = mission.difficulty >= 5 ? [0.2, 0.5, 0.8] : [0.28, 0.72]
      for (const fx of spots) spawn('gunner', W * fx, -50, { path: 'gun', hoverY: rand(140, 210), life: 9, fireT: rand(1, 2) })
      break
    }
  }
}

// Whether a formation saucer is in a spot to shoot: on screen, above the
// ships, not diving or leaving. Packs use it to telegraph a shot (g.canFire).
function canFire(e) {
  return e.entered && e.y > 20 && e.y < H * 0.62 && !e.leaving && e.path !== 'dive' && phase !== 'victory'
}

const enemyLight = (e) => ENEMY[e.type]?.light ?? SAUCERS[e.type]?.light ?? '#ffffff'

function updateEnemy(e, dt) {
  e.t += dt
  e.flash = Math.max(0, e.flash - dt * 6)
  const def = ENEMY[e.type]
  if (def.update) {
    // a content pack's own enemy: it moves, shoots and leaves on its own terms
    def.update(e, dt, g)
    if (!e.entered && e.y > 0) e.entered = true
    if (!def.keepOffscreen && e.entered && (e.y > H + 120 || e.y < -200 || e.x < -160 || e.x > W + 160)) e.gone = true
    return
  }
  const px = e.x
  switch (e.path) {
    case 'sine':
      e.y += e.speed * dt
      e.x = e.x0 + e.amp * Math.sin(e.t * e.freq)
      break
    case 'fall':
      e.y += e.speed * dt
      e.x += Math.sin(e.t * 2 + e.seed) * 40 * dt
      break
    case 'sweep':
      e.x += e.vx * dt
      e.y = e.y0 + Math.sin(e.t * 3) * 28
      break
    case 'zig':
      e.y += e.speed * dt
      e.x += e.vx * dt
      e.zt += dt
      if (e.zt > 0.9 || (e.x < 40 && e.vx < 0) || (e.x > W - 40 && e.vx > 0)) {
        e.zt = 0
        e.vx *= -1
      }
      break
    case 'dive': {
      const tg = nearestPlayer(e.x, e.y)
      if (e.state === 'enter') {
        e.y += Math.max(30, (e.hoverY - e.y) * 2.5) * dt
        if (e.y >= e.hoverY - 2) {
          e.state = 'aim'
          e.t2 = 0
        }
      } else if (e.state === 'aim') {
        if (tg) e.x += (tg.x - e.x) * Math.min(1, dt * 1.8)
        e.y = e.hoverY + Math.sin(e.t * 20) * 2
        e.t2 += dt
        if (e.t2 > 0.8) {
          e.state = 'dive'
          e.vy = 60
        }
      } else {
        e.vy += 560 * dt
        e.y += e.vy * dt
        if (tg && e.y < tg.y - 80) e.x += clamp(tg.x - e.x, -1, 1) * 150 * dt
      }
      break
    }
    case 'gun':
      if (!e.leaving && e.y < e.hoverY) e.y += Math.max(40, (e.hoverY - e.y) * 2.5) * dt
      e.x = clamp(e.x + Math.sin(e.t * 0.8 + e.seed) * 110 * dt, 40, W - 40)
      e.life -= dt
      if (e.life <= 0) e.leaving = true
      if (e.leaving) e.y -= 170 * dt
      break
  }
  if (dt > 0) e.tilt += (clamp((e.x - px) / dt / 900, -0.25, 0.25) - e.tilt) * Math.min(1, dt * 8)
  if (!e.entered && e.y > 0) e.entered = true

  // shooting back
  if (canFire(e)) {
    e.fireT -= dt * mission.fire
    if (e.fireT <= 0) {
      if (e.type === 'gunner') {
        aimed(e.x, e.y + 20, 3, 0.16, 250, '#ffb02e', nearestPlayer(e.x, e.y))
        e.fireT = 1.7
      } else if (e.type === 'zigzag') {
        aimed(e.x, e.y + 10, 1, 0, 230, '#ff7bd8', nearestPlayer(e.x, e.y))
        e.fireT = rand(2, 3.5)
      } else {
        shoot(e.x, e.y + 10, Math.PI / 2, 220, '#7dff5a')
        e.fireT = rand(2.5, 4.5)
      }
    }
  }

  if (e.entered && (e.y > H + 60 || e.y < -140 || e.x < -90 || e.x > W + 90)) e.gone = true
}

function damageEnemy(e, dmg, owner) {
  if (e.dead) return
  const def = ENEMY[e.type]
  if (def.armored?.(e, g)) {
    sparks(e.x, e.y, '#ffffff', 2)
    sfx.ting()
    return
  }
  e.hp -= dmg
  e.flash = 1
  if (e.hp <= 0) {
    e.dead = true
    if (def.score) addScore(owner, def.score, e.x, e.y - 20)
    const boom = def.boom ?? 0.8
    if (def.pop) def.pop(e, g)
    else {
      explode(e.x, e.y, enemyLight(e), boom)
      sfx.pop(boom + (boom > 1 ? 0 : -0.1))
    }
    if (Math.random() < (def.drop ?? 0.07)) dropBubble(e.x, e.y)
    def.onDeath?.(e, g, owner)
  } else {
    sfx.hitTick()
  }
}

// ================================================================ bosses

// Bosses take more punishment than they used to — and more again with a
// second ship pouring lasers into them.
function hpMult() {
  return numPlayers === 2 ? 1.85 : 1.25
}

function bossEnter(b, dt) {
  if (!b.entering) return false
  b.y += Math.max(40, (b.ty - b.y) * 1.6) * dt
  if (b.y >= b.ty - 1) {
    b.y = b.ty
    b.entering = false
  }
  return b.entering
}

function damageBoss(b, dmg, owner, x, y) {
  b.hp -= dmg
  // a light touch: a boss under steady fire would otherwise strobe white
  b.flash = 0.45
  b.hurt = 0.5
  addScore(owner, 10)
  sparks(x, y, '#ffffff', 3)
  sfx.hitTick()
  if (b.hp <= 0) startBossDeath(b)
}

function startBossDeath(b) {
  b.hp = 0
  b.dying = 2.6
  b.boomT = 0
  for (const s of eShots) sparks(s.x, s.y, '#ffffff', 2)
  eShots = []
  lasers = []
  for (const e of enemies) {
    e.dead = true
    explode(e.x, e.y, enemyLight(e), 0.8)
  }
  for (const p of players) dropCarry(p)
  shake = Math.max(shake, 10)
}

const BOSSES = {
  zorb: {
    name: 'Captain Zorb',
    create() {
      const hp = Math.round(70 * hpMult())
      return { x: W / 2, y: -140, ty: 170, r: 150, hp, maxHp: hp, sway: 0, fanT: 2.2, aimT: 1.4, ringT: 3, spawnT: 7 }
    },
    update(b, dt) {
      if (bossEnter(b, dt)) return
      const angry = b.hp < b.maxHp * 0.5
      const range = Math.max(0, W / 2 - b.r - 30)
      b.sway += dt * (angry ? 0.8 : 0.55)
      const nx = W / 2 + Math.sin(b.sway) * range
      b.tilt = clamp((nx - b.x) / Math.max(dt, 1e-3) / 3000, -0.12, 0.12)
      b.x = nx
      b.y = b.ty + Math.sin(b.t * 1.3) * 12

      if ((b.fanT -= dt) <= 0) {
        fan(b.x, b.y + 30, angry ? 9 : 7, 1.2, 210, '#7dff5a')
        b.fanT = angry ? 1.8 : 2.4
      }
      if ((b.aimT -= dt) <= 0) {
        aimed(b.x, b.y + 30, 3, 0.18, 270, '#ffe23d')
        b.aimT = angry ? 1.2 : 1.6
      }
      if (angry && (b.ringT -= dt) <= 0) {
        ringShot(b.x, b.y, 14, 150, '#9ff0ff', b.t)
        b.ringT = 3.6
      }
      if ((b.spawnT -= dt) <= 0) {
        for (const d of [-1, 1]) spawn('scout', b.x + d * 80, b.y + 30, { path: 'fall', speed: 150, entered: true })
        b.spawnT = 10
      }
    },
    shot(b, x, y, owner) {
      const dx = x - b.x
      const dy = y - b.y
      const inDisc = (dx / b.r) ** 2 + (dy / (b.r * 0.34)) ** 2 <= 1
      const inDome = near(x, y, b.x, b.y - b.r * 0.12, b.r * 0.5) && y < b.y
      if (!inDisc && !inDome) return false
      if (b.entering) {
        sparks(x, y, '#ffffff', 2)
        sfx.ting()
      } else damageBoss(b, 1, owner, x, y)
      return true
    },
    hits: (b, p) => (p.x - b.x) ** 2 / (b.r * 0.9) ** 2 + (p.y - b.y) ** 2 / (b.r * 0.4) ** 2 < 1,
    nova(b, owner) {
      if (!b.entering) damageBoss(b, 8, owner, b.x, b.y)
    },
    draw(b) {
      drawSaucer(ctx, b.x, b.y, b.r, 'zorb', time, { flash: b.flash, tilt: b.tilt, alien: { cap: '#2f5fb8', patch: true, hurt: b.hurt } })
    },
    explodeAt: (b) => [b.x + rand(-b.r, b.r), b.y + rand(-b.r * 0.4, b.r * 0.2)],
  },

  blorp: {
    name: 'General Blorp',
    create() {
      const hp = Math.round(110 * hpMult())
      return {
        x: W / 2,
        y: -160,
        ty: 175,
        r: 160,
        podX: 150,
        podY: 54,
        hp,
        maxHp: hp,
        dir: 1,
        rest: 1.2,
        attack: null,
        at: 0,
        seq: ['laser', 'spiral', 'mines', 'fan', 'laser', 'aimed'],
        seqI: 0,
        charge: 0,
        spin: 0,
        spawnT: 9,
      }
    },
    update(b, dt) {
      if (bossEnter(b, dt)) return
      const angry = b.hp < b.maxHp * 0.5
      const lo = Math.min(b.r + 30, W / 2)
      const hi = Math.max(W - b.r - 30, W / 2)
      b.y = b.ty + Math.sin(b.t * 1.1) * 10
      b.charge = Math.max(0, b.charge - dt * 2)

      if (!b.attack) {
        b.x += b.dir * 80 * dt
        if (b.x < lo) (b.x = lo), (b.dir = 1)
        if (b.x > hi) (b.x = hi), (b.dir = -1)
        b.tilt = b.dir * 0.05
        if ((b.rest -= dt) <= 0) {
          b.attack = b.seq[b.seqI++ % b.seq.length]
          b.at = 0
          b.step = 0
          if (b.attack === 'laser') {
            const pl = alive()
            const avg = pl.length ? pl.reduce((s, p) => s + p.x, 0) / pl.length : W / 2
            b.sweep = avg > b.x ? 1 : -1
            if ((b.sweep > 0 && b.x > hi - 150) || (b.sweep < 0 && b.x < lo + 150)) b.sweep *= -1
            for (const side of [-1, 1]) lasers.push({ x: b.x + side * b.podX, y0: b.y + b.podY + 18, w: 46, warn: 1.1, active: 1.8, boss: b, side })
            sfx.laserWarn()
          }
        }
      } else {
        b.at += dt
        const done = () => {
          b.attack = null
          b.rest = angry ? 0.75 : 1.3
        }
        switch (b.attack) {
          case 'laser':
            b.tilt = 0
            if (b.at < 1.1) b.charge = b.at / 1.1
            else if (b.at < 2.9) {
              b.charge = 1
              b.x = clamp(b.x + b.sweep * 120 * dt, lo, hi)
            } else done()
            break
          case 'spiral':
            if (b.at - b.step * 0.08 >= 0) {
              b.step++
              b.spin += 0.23
              for (const k of [0, Math.PI]) shoot(b.x, b.y + 10, b.spin + k, 190, '#ff7bd8')
            }
            if (b.at > (angry ? 3.2 : 2.4)) done()
            break
          case 'mines':
            if (b.at >= b.step * 0.5 && b.step < 3) {
              const side = b.step % 2 ? 1 : -1
              eShots.push({ kind: 'mine', x: b.x + side * b.podX, y: b.y + b.podY + 20, vx: rand(-60, 60), vy: 120, r: 13, stopY: rand(H * 0.4, H * 0.62), fuse: 2.4, color: '#ff7bd8' })
              b.step++
            }
            if (b.at > 1.8) done()
            break
          case 'fan':
            if (b.at >= b.step * 0.55 && b.step < 3) {
              fan(b.x, b.y + 40, 9, 1.3, 200, '#ffb02e', Math.PI / 2 + (b.step % 2 ? 0.07 : -0.07))
              b.step++
            }
            if (b.at > 1.8) done()
            break
          case 'aimed':
            if (b.at >= b.step * 0.35 && b.step < 4) {
              const side = b.step % 2 ? 1 : -1
              aimed(b.x + side * b.podX, b.y + b.podY + 18, 3, 0.14, 280, '#ffe23d')
              b.step++
            }
            if (b.at > 1.7) done()
            break
        }
      }
      if (angry && (b.spawnT -= dt) <= 0) {
        for (const fx of [0.3, 0.7]) spawn('diver', W * fx, -40, { path: 'dive', state: 'enter', hoverY: rand(260, 320) })
        b.spawnT = 11
      }
    },
    shot(b, x, y, owner) {
      const dx = x - b.x
      const dy = y - b.y
      const hit =
        (dx / b.r) ** 2 + (dy / (b.r * 0.34)) ** 2 <= 1 ||
        (near(x, y, b.x, b.y - b.r * 0.12, b.r * 0.5) && y < b.y) ||
        near(x, y, b.x - b.podX, b.y + b.podY, 32) ||
        near(x, y, b.x + b.podX, b.y + b.podY, 32)
      if (!hit) return false
      if (b.entering) {
        sparks(x, y, '#ffffff', 2)
        sfx.ting()
      } else damageBoss(b, 1, owner, x, y)
      return true
    },
    hits: (b, p) =>
      (p.x - b.x) ** 2 / (b.r * 0.9) ** 2 + (p.y - b.y) ** 2 / (b.r * 0.4) ** 2 < 1 ||
      near(p.x, p.y, b.x - b.podX, b.y + b.podY, 40) ||
      near(p.x, p.y, b.x + b.podX, b.y + b.podY, 40),
    nova(b, owner) {
      if (!b.entering) damageBoss(b, 10, owner, b.x, b.y)
    },
    draw(b) {
      drawBlorp(ctx, b, time)
    },
    explodeAt: (b) => [b.x + rand(-b.r, b.r), b.y + rand(-b.r * 0.4, b.r * 0.4)],
  },

  mothership: {
    name: 'The Mothership',
    warnSub: 'Here comes the',
    hudName: (b) => (b.stage === 1 ? 'Mothership — knock out the turrets!' : 'Supreme Commander Zyx'),
    create() {
      const w = Math.min(W - 40, 980)
      const th = Math.round(35 * hpMult())
      const ch = Math.round(140 * hpMult())
      const tur = (side, fireT) => ({ ox: side * w * MOTHER.turretX, oy: MOTHER.turretY, hp: th, max: th, aim: Math.PI / 2, fireT, flash: 0 })
      return {
        x: W / 2,
        y: -230,
        ty: 180,
        w,
        turrets: [tur(-1, 1.5), tur(1, 2.4)],
        coreHp: ch,
        coreMax: ch,
        hp: th * 2 + ch,
        maxHp: th * 2 + ch,
        shield: 1,
        stage: 1,
        hangarT: 4,
        hangarOpen: 0,
        hangarAnim: 0,
        rest: 1.5,
        attack: null,
        at: 0,
        seq: ['ring', 'comb', 'aimed', 'hangar', 'ring', 'comb', 'spiral'],
        seqI: 0,
        spin: 0,
        coreFlash: 0,
        rage: false,
      }
    },
    update(b, dt) {
      b.hangarAnim = Math.max(0, b.hangarAnim - dt)
      b.hangarOpen += ((b.hangarAnim > 0 ? 1 : 0) - b.hangarOpen) * Math.min(1, dt * 6)
      b.coreFlash = Math.max(0, b.coreFlash - dt * 6)
      for (const t of b.turrets) t.flash = Math.max(0, t.flash - dt * 6)
      if (bossEnter(b, dt)) return
      const range = Math.max(0, W / 2 - b.w / 2 - 10)
      b.x = W / 2 + Math.sin(b.t * 0.35) * range
      b.y = b.ty + Math.sin(b.t * 0.9) * 6
      b.hp = b.turrets.reduce((s, t) => s + Math.max(0, t.hp), 0) + b.coreHp
      const dome = { x: b.x, y: b.y + MOTHER.coreY }

      const launch = (n) => {
        b.hangarAnim = 1.2
        for (let i = 0; i < n; i++) {
          later(0.35 + i * 0.3, () => {
            if (!boss || boss.dying) return
            const bx = b.x + (i % 2 ? 1 : -1) * b.w * MOTHER.bayX
            if (i % 2 && b.stage === 2) spawn('diver', bx, b.y + 60, { path: 'dive', state: 'enter', hoverY: rand(280, 340), entered: true })
            else spawn('scout', bx, b.y + 60, { path: 'fall', speed: rand(130, 170), entered: true })
          })
        }
      }

      if (b.stage === 1) {
        // the gun turrets guard the Commander
        for (const t of b.turrets) {
          if (t.hp <= 0) continue
          const tx = b.x + t.ox
          const ty = b.y + t.oy
          const tg = nearestPlayer(tx, ty)
          const want = tg ? Math.atan2(tg.y - ty, tg.x - tx) : Math.PI / 2
          t.aim += (want - t.aim) * Math.min(1, dt * 3)
          if ((t.fireT -= dt) <= 0) {
            const bx = tx + Math.cos(t.aim) * 44
            const by = ty + Math.sin(t.aim) * 44
            for (let i = 0; i < 3; i++) shoot(bx, by, t.aim + (i - 1) * 0.15, 260, '#ffb02e')
            t.fireT = b.turrets.some((o) => o !== t && o.hp <= 0) ? 1.1 : 1.8
          }
        }
        if ((b.hangarT -= dt) <= 0) {
          launch(3)
          b.hangarT = 6.5
        }
        if (b.turrets.every((t) => t.hp <= 0)) {
          b.stage = 2
          b.rest = 2
          shake = Math.max(shake, 12)
          banner('Shield down!', 'Hit the Commander!', 'warn')
          sfx.siren()
        }
        return
      }

      // stage 2: the Commander fights back
      b.shield = Math.max(0, b.shield - dt * 1.2)
      if (!b.rage && b.coreHp < b.coreMax * 0.4) {
        b.rage = true
        popText(b.x, b.y + 120, 'The Commander is FURIOUS!', '#ff6a6a', 22, 2)
        shake = Math.max(shake, 10)
      }
      if (!b.attack) {
        if ((b.rest -= dt) <= 0) {
          b.attack = b.seq[b.seqI++ % b.seq.length]
          if (b.attack === 'spiral' && !b.rage) b.attack = 'aimed'
          b.at = 0
          b.step = 0
          if (b.attack === 'comb') {
            // a row of beams out of the hull with gaps to hide in
            const slots = Math.max(5, Math.round(b.w / 120))
            const bw = (b.w / slots) * 0.62
            const open = new Set()
            const gaps = b.rage ? 2 : 3
            while (open.size < gaps) open.add((Math.random() * slots) | 0)
            for (let i = 0; i < slots; i++) {
              if (open.has(i)) continue
              const lx = b.x - b.w / 2 + (b.w / slots) * (i + 0.5)
              lasers.push({ x: lx, y0: b.y + 40, w: bw, warn: 1.3, active: 1.0, boss: null })
            }
            sfx.laserWarn()
          }
          if (b.attack === 'hangar') launch(4)
        }
      } else {
        b.at += dt
        const done = () => {
          b.attack = null
          b.rest = b.rage ? 0.8 : 1.4
        }
        switch (b.attack) {
          case 'ring':
            if (b.at >= b.step * 0.45 && b.step < 3) {
              ringShot(dome.x, dome.y, b.rage ? 20 : 16, b.rage ? 190 : 160, '#7dfcff', b.step * 0.2)
              b.coreFlash = 0.4
              b.step++
            }
            if (b.at > 1.5) done()
            break
          case 'comb':
            if (b.at > 2.5) done()
            break
          case 'aimed':
            if (b.at >= b.step * 0.3 && b.step < 5) {
              aimed(dome.x, dome.y + 20, 3, 0.16, 290, '#ff5a5a')
              b.step++
            }
            if (b.at > 1.8) done()
            break
          case 'hangar':
            if (b.at > 1.2) done()
            break
          case 'spiral':
            if (b.at - b.step * 0.07 >= 0) {
              b.step++
              b.spin += 0.27
              for (const k of [0, (TAU * 1) / 3, (TAU * 2) / 3]) shoot(dome.x, dome.y, b.spin + k, 180, '#c77dff')
            }
            if (b.at > 3) done()
            break
        }
      }
    },
    shot(b, x, y, owner) {
      for (const t of b.turrets) {
        if (t.hp <= 0) continue
        if (near(x, y, b.x + t.ox, b.y + t.oy, 34)) {
          if (b.entering) {
            sfx.ting()
            sparks(x, y, '#ffffff', 2)
            return true
          }
          t.hp -= 1
          t.flash = 0.6
          b.flash = 0.3
          addScore(owner, 10)
          sparks(x, y, '#ffd6a0', 3)
          sfx.hitTick()
          if (t.hp <= 0) {
            explode(b.x + t.ox, b.y + t.oy, '#ff9d2e', 2)
            sfx.boom()
            shake = Math.max(shake, 12)
            addScore(owner, 2000, b.x + t.ox, b.y + t.oy - 40)
            dropBubble(b.x + t.ox, b.y + t.oy + 40)
          }
          return true
        }
      }
      const dx = x - b.x
      const dy = y - b.y
      if (near(x, y, b.x, b.y + MOTHER.coreY, MOTHER.coreR + 4)) {
        if (b.stage === 1 || b.shield > 0.3 || b.entering) {
          sparks(x, y, '#9fe8ff', 2)
          sfx.ting()
        } else {
          b.coreHp -= 1
          b.hp -= 1
          b.coreFlash = 0.6
          b.hurt = 0.5
          addScore(owner, 10)
          sparks(x, y, '#ffffff', 3)
          sfx.hitTick()
          if (b.coreHp <= 0) startBossDeath(b)
        }
        return true
      }
      if ((dx / (b.w / 2)) ** 2 + (dy / 60) ** 2 <= 1) {
        sparks(x, y, '#b9b0e6', 1)
        return true
      }
      return false
    },
    hits: (b, p) =>
      (p.x - b.x) ** 2 / (b.w / 2) ** 2 + (p.y - b.y) ** 2 / 70 ** 2 < 1 || near(p.x, p.y, b.x, b.y + MOTHER.coreY, MOTHER.coreR + 12),
    nova(b, owner) {
      if (b.entering) return
      if (b.stage === 1) {
        for (const t of b.turrets) if (t.hp > 0) t.hp = Math.max(1, t.hp - 6)
      } else {
        b.coreHp = Math.max(1, b.coreHp - 10)
      }
      b.flash = 1
      addScore(owner, 100)
    },
    draw(b) {
      drawMothership(ctx, b, time)
    },
    explodeAt: (b) => [b.x + rand(-b.w / 2, b.w / 2) * 0.9, b.y + rand(-50, 90)],
  },
}

function spawnBoss(kind) {
  const def = BOSSES[kind]
  boss = { kind, def, t: 0, flash: 0, hurt: 0, tilt: 0, entering: true, dying: 0, ...def.create(g) }
}

function updateBoss(dt) {
  const b = boss
  b.t += dt
  b.flash = Math.max(0, b.flash - dt * 6)
  b.hurt = Math.max(0, b.hurt - dt)
  if (b.dying > 0) {
    b.dying -= dt
    b.boomT -= dt
    b.x += Math.sin(b.t * 50) * 1.5
    b.y += 12 * dt
    b.hurt = 1
    if (b.boomT <= 0) {
      const [ex, ey] = b.def.explodeAt(b)
      explode(ex, ey, pick(['#ffb02e', '#ff5a5a', '#ffe23d', '#ffffff']), rand(0.9, 1.6))
      sfx.pop(1.2)
      shake = Math.max(shake, 8)
      b.boomT = 0.13
    }
    if (b.dying <= 0) bossDefeated(b)
    return
  }
  b.def.update(b, dt, g)
}

function bossDefeated(b) {
  const final = !!mission.final
  explode(b.x, b.y, '#ffffff', final ? 5 : 3.5)
  for (let i = 0; i < (final ? 6 : 3); i++) {
    const [ex, ey] = b.def.explodeAt(b)
    explode(ex, ey, pick(['#ffb02e', '#ff5a5a', '#ffe23d']), 2)
  }
  sfx.boom()
  flash = 0.8
  shake = 22
  const bonus = mission.bonus
  if (bonus) {
    for (const p of players) if (!p.out) addScore(p.id, bonus)
    popText(W / 2, H * 0.42, `Boss bonus +${bonus}`, '#ffd54a', 26, 2.2)
  }
  b.def.defeated?.(b, g)
  boss = null
  phaseT = 0
  if (final) {
    phase = 'victory'
    sfx.win()
  } else {
    phase = 'clear'
  }
}

// ================================================================ stage flow

function banner(sub, title, cls = '') {
  const el = document.getElementById('banner')
  el.querySelector('.sub').textContent = sub
  el.querySelector('.title').textContent = title
  el.className = ''
  void el.offsetWidth
  el.className = ('show ' + cls).trim()
}

// ---------------------------------------------------------------- levels
//
// The classic level: saucer formations, one after another, until the list is
// done and the screen is clear. Content packs bring the others.
let waveIndex = 0
let waveTimer = 0
let waveCooldown = 0

const WAVES_LEVEL = {
  start() {
    waveIndex = 0
    waveTimer = 0
    waveCooldown = 0
  },
  update(_, dt) {
    if (phase !== 'main') return
    const waves = mission.waves
    const live = enemies.length + pending.length
    waveTimer -= dt
    waveCooldown -= dt
    if (waveIndex < waves.length) {
      if (waveCooldown <= 0 && (waveTimer <= 0 || live === 0)) {
        launchWave(waves[waveIndex++])
        waveTimer = 6.4 - mission.difficulty * 0.35
        waveCooldown = 1.6
      }
    } else if (live === 0 || waveTimer < -6) g.levelDone()
  },
  progress: () => waveIndex / mission.waves.length,
}

const LEVELS = { waves: WAVES_LEVEL }

// Each pack adds its levels, bosses and enemy types to the registries.
for (const pack of [asteroidsPack, racePack, nebulaPack, ionPack, swarmPack]) {
  Object.assign(LEVELS, pack.levels ?? {})
  Object.assign(BOSSES, pack.bosses ?? {})
  Object.assign(ENEMY, pack.enemies ?? {})
}

// `?mission=belt` jumps straight into a mission from the player choice, and
// `?boss` skips to its boss — for practising one fight. (Query strings don't
// survive the artifact viewer, so this only works on the deployed page.)
const params = new URLSearchParams(location.search)

function clearWorld() {
  cutscene = null
  bars = 0
  enemies = []
  pShots = []
  eShots = []
  bubbles = []
  particles = []
  rings = []
  texts = []
  lasers = []
  pending = []
  boss = null
}

function startMission(idx) {
  missionIdx = clamp(idx, 0, MISSIONS.length - 1)
  mission = MISSIONS[missionIdx]
  level = LEVELS[mission.level] ?? WAVES_LEVEL
  document.body.classList.toggle('solo', numPlayers === 1)
  clearWorld()
  players = []
  for (let i = 0; i < numPlayers; i++) players.push(makePlayer(i))
  run = { deaths: 0, finished: false }
  endTimer = -1
  mode = 'play'
  phase = 'intro'
  phaseT = 0
  bubbleTimer = 5
  stars.targetSpeed = 1
  stars.setTint(...mission.tint)
  showScreen(null)
  sfx.start()
  banner(`Mission ${missionIdx + 1}`, mission.name)
  level.setup?.(g)
}

function updateFlow(dt) {
  phaseT += dt
  level.update?.(g, dt)

  if (phase === 'intro' && phaseT > 2.4) {
    phase = 'main'
    phaseT = 0
    level.start?.(g)
    if (params.has('boss')) g.levelDone()
  } else if (phase === 'warning' && phaseT > 2.8) {
    phase = 'boss'
    phaseT = 0
    spawnBoss(mission.boss)
  } else if (phase === 'clear') {
    if (phaseT > 0.6 && phaseT - dt <= 0.6) {
      banner(mission.doneTitle ?? (mission.boss ? 'Mission complete!' : 'Bonus round complete!'), 'Great flying!', 'clear')
      sfx.clear()
      const flying = players.find((q) => !q.out)
      if (flying) for (const p of players) if (p.out) revive(p, flying)
    }
    if (phaseT > 3 && phaseT - dt <= 3) stars.targetSpeed = 7
    if (phaseT > 4.4) endMission(true)
  } else if (phase === 'victory') {
    if (phaseT > 1 && phaseT - dt <= 1) stars.targetSpeed = 0.4
    if (phaseT > 3) endMission(true)
  }

  // bubbles drift down on their own every so often
  if (cutscene) cutscene.t += dt
  if ((phase === 'main' || phase === 'boss') && !level.noBubbles && !cutscene) {
    bubbleTimer -= dt
    if (bubbleTimer <= 0) {
      dropBubble(rand(60, W - 60), -30)
      bubbleTimer = phase === 'boss' ? rand(10, 13) : rand(9, 12)
    }
  }
}

// ---------------------------------------------------------------- the payout
//
// Every run pays stars, won or lost — less for each ship lost along the way.
function payOut(cleared) {
  if (run.finished) return lastReward
  run.finished = true
  const score = players.reduce((sum, p) => sum + p.score, 0)
  const reward = starReward({ score, deaths: run.deaths, cleared, difficulty: mission.difficulty })
  save.stars += reward.total
  save.earned += reward.total
  const best = save.missions.best
  best[mission.id] = Math.max(best[mission.id] ?? 0, score)
  if (cleared) {
    save.missions.cleared[mission.id] = true
    save.missions.unlocked = Math.max(save.missions.unlocked, Math.min(MISSIONS.length, missionIdx + 2))
  }
  persist()
  lastReward = { ...reward, score, wallet: save.stars, missionId: mission.id }
  return lastReward
}

function endMission(cleared) {
  if (mode !== 'play') return
  payOut(cleared)
  const screen = !cleared ? 'over' : mission.final ? 'win' : 'done'
  mode = screen
  stars.targetSpeed = 1
  if (cleared) {
    if (mission.final) sfx.win()
  } else sfx.lose()
  fillEndScreen(screen)
  showScreen(screen)
  updateWallet()
}

// ================================================================ update

function update(dt) {
  time += dt
  stars.update(dt)
  bars += ((cutscene ? 1 : 0) - bars) * Math.min(1, dt * 5)
  shake = Math.max(0, shake - dt * 30)
  flash = Math.max(0, flash - dt * 1.6)

  if (inMenus()) {
    updateMenu(dt)
    return
  }

  if (mode === 'play') updateFlow(dt)

  for (let i = pending.length - 1; i >= 0; i--) {
    const q = pending[i]
    q.t -= dt
    if (q.t <= 0) {
      pending.splice(i, 1)
      if (mode === 'play' || q.always) q.fn()
    }
  }

  for (const p of players) updatePlayer(p, dt)
  for (const e of enemies) updateEnemy(e, dt)
  if (boss) updateBoss(dt)

  // player shots
  for (const s of pShots) {
    s.x += s.vx * dt
    s.y += s.vy * dt
    if (s.y < -30 || s.x < -30 || s.x > W + 30) {
      s.dead = true
      continue
    }
    for (const e of enemies) {
      // a piercing laser remembers what it has been through, so it can't hit
      // the same saucer — or a rock fragment split off under it — twice
      if (e.dead || s.hit?.has(e) || !near(s.x, s.y, e.x, e.y, e.r + 4)) continue
      damageEnemy(e, 1, s.owner)
      if (s.pierce > 0) {
        s.pierce--
        ;(s.hit ??= new Set()).add(e)
        for (const f of enemies) if (f !== e && near(f.x, f.y, e.x, e.y, e.r)) s.hit.add(f)
      } else {
        s.dead = true
        break
      }
    }
    if (!s.dead && boss && !boss.dying && boss.def.shot(boss, s.x, s.y, s.owner, g)) s.dead = true
  }
  pShots = pShots.filter((s) => !s.dead)

  // enemy shots
  for (const s of eShots) {
    if (s.kind === 'mine') {
      s.x += s.vx * dt
      s.vx *= 1 - dt
      if (s.y < s.stopY) s.y += s.vy * dt
      s.fuse -= dt
      if (s.fuse <= 0) {
        s.dead = true
        explode(s.x, s.y, '#ff7bd8', 0.6)
        sfx.pop(0.6)
        ringShot(s.x, s.y, 8, 170, '#ff7bd8', Math.random())
      }
    } else {
      s.x += s.vx * dt
      s.y += s.vy * dt
    }
    if (s.x < -40 || s.x > W + 40 || s.y < -60 || s.y > H + 40) s.dead = true
  }

  // lasers
  for (const L of lasers) {
    if (L.track) L.track(L, g)
    else if (L.boss) {
      L.x = L.boss.x + L.side * L.boss.podX
      L.y0 = L.boss.y + L.boss.podY + 18
    }
    if (L.warn > 0) {
      L.warn -= dt
      if (L.warn <= 0 && !L.quiet) {
        sfx.laser()
        shake = Math.max(shake, 4)
      }
    } else {
      L.active -= dt
      if (L.active <= 0) L.dead = true
    }
  }
  lasers = lasers.filter((L) => !L.dead)

  // bubbles drift down and wobble — unless a ship's magnet has hold of them
  for (const b of bubbles) {
    b.t += dt
    b.pulledBy = null
    let best = Infinity
    for (const p of players) {
      if (!p.alive || !p.lo.magnet) continue
      const d = Math.hypot(p.x - b.x, p.y - b.y)
      if (d < p.lo.magnet && d < best) {
        best = d
        b.pulledBy = p
      }
    }
    const p = b.pulledBy
    b.wob = clamp((b.wob ?? 1) + (p ? -dt * 3 : dt), 0, 1)
    if (p && best > 1) {
      const pull = 260 + 380 * (1 - best / p.lo.magnet)
      const step = Math.min(best, pull * dt)
      b.x0 += ((p.x - b.x) / best) * step
      b.y += ((p.y - b.y) / best) * step
    } else b.y += b.vy * dt
    b.x = clamp(b.x0 + Math.sin(b.t * 1.6) * 24 * b.wob, 30, W - 30)
    if (b.y > H + 40) b.dead = true
  }

  // collisions with the players
  for (const p of players) {
    if (!p.alive) continue
    for (const b of bubbles) {
      if (!b.dead && near(p.x, p.y, b.x, b.y, b.r + 26)) {
        b.dead = true
        collect(p, b)
      }
    }
    if (p.invuln > 0) continue
    for (const s of eShots) {
      if (!s.dead && near(p.x, p.y - 2, s.x, s.y, s.r + p.hitR)) {
        s.dead = true
        hurtPlayer(p)
        break
      }
    }
    if (!p.alive || p.invuln > 0) continue
    for (const e of enemies) {
      if (!e.dead && near(p.x, p.y, e.x, e.y, e.r * 0.75 + 16)) {
        hurtPlayer(p)
        damageEnemy(e, 3, p.id)
        break
      }
    }
    if (!p.alive || p.invuln > 0) continue
    for (const L of lasers) {
      if (L.warn <= 0 && L.active > 0.05 && p.y > L.y0 && Math.abs(p.x - L.x) < L.w * 0.4 + p.hitR * 0.8) {
        hurtPlayer(p)
        break
      }
    }
    if (!p.alive || p.invuln > 0) continue
    if (boss && !boss.dying && !boss.entering && boss.def.hits(boss, p, g)) hurtPlayer(p)
  }

  eShots = eShots.filter((s) => !s.dead)
  enemies = enemies.filter((e) => !e.dead && !e.gone)
  bubbles = bubbles.filter((b) => !b.dead)

  for (const p of particles) {
    p.x += p.vx * dt
    p.y += p.vy * dt
    const k = Math.max(0, 1 - p.drag * dt)
    p.vx *= k
    p.vy *= k
    p.life -= dt
  }
  particles = particles.filter((p) => p.life > 0)
  for (const r of rings) r.r += r.speed * dt
  rings = rings.filter((r) => r.r < r.max)
  for (const t of texts) {
    t.y -= t.rise * dt
    t.life -= dt
  }
  texts = texts.filter((t) => t.life > 0)

  // game over once nobody is left flying
  // (not while a boss is blowing up, either: the last ship can go down to the
  // very shot that finished it, and that's still a win)
  if (mode === 'play' && players.every((p) => p.out) && phase !== 'clear' && phase !== 'victory' && !(boss && boss.dying > 0)) {
    if (endTimer < 0) endTimer = 2
    endTimer -= dt
    if (endTimer <= 0) endMission(false)
  } else endTimer = -1

  // fireworks over the victory screen
  if (mode === 'win' || phase === 'victory') {
    fireworkT -= dt
    if (fireworkT <= 0) {
      const x = rand(W * 0.1, W * 0.9)
      const y = rand(H * 0.1, H * 0.5)
      const col = pick(['#ffd54a', '#38d6ff', '#ff5fb8', '#7dff5a', '#c77dff'])
      explode(x, y, col, rand(1, 1.8))
      fireworkT = rand(0.25, 0.6)
    }
  }
}

// ================================================================ menu scene

// The home screen, the mission map and the store share a backdrop of idling
// saucers; everything else draws the battle.
const inMenus = () => mode === 'menu' || mode === 'map' || mode === 'store'

function initMenuScene() {
  const kinds = ['scout', 'zigzag', 'diver', 'gunner', 'scout', 'zigzag']
  menuUfos = kinds.map((kind, i) => ({
    kind,
    side: i % 2 ? 1 : -1,
    ph: rand(0, TAU),
    sp: rand(0.25, 0.45),
    r: kind === 'gunner' ? 34 : rand(24, 30),
    lane: (i >> 1) / 3,
  }))
}

function updateMenu(dt) {
  for (const u of menuUfos) {
    u.ph += dt * u.sp
    const margin = Math.max(90, (W - 860) / 2)
    const cx = u.side < 0 ? margin * 0.5 : W - margin * 0.5
    const nx = cx + Math.sin(u.ph * 1.3) * Math.min(margin * 0.3, 60)
    u.tilt = (nx - (u.x ?? nx)) * 0.02
    u.x = nx
    u.y = H * (0.18 + u.lane * 0.62) + Math.sin(u.ph * 2.1) * 30
  }
}

function drawMenu() {
  for (const u of menuUfos) drawSaucer(ctx, u.x, u.y, u.r, u.kind, time, { tilt: clamp(u.tilt, -0.2, 0.2) })
}

// ================================================================ drawing

function draw() {
  ctx.setTransform(S * DPR, 0, 0, S * DPR, 0, 0)
  stars.draw(ctx)

  if (inMenus()) {
    drawMenu()
    return
  }

  ctx.save()
  if (shake > 0) ctx.translate(rand(-shake, shake) * 0.5, rand(-shake, shake) * 0.5)

  // a level paints in layers: behind everything, over the enemies (where a fog
  // hides them) and over the whole field
  level?.drawBack?.(g, ctx)
  if (boss) boss.def.draw(boss, g, ctx)
  for (const e of enemies) {
    const def = ENEMY[e.type]
    if (def.draw) def.draw(e, g, ctx)
    else drawSaucer(ctx, e.x, e.y, e.r, e.type, time + e.seed, { flash: e.flash, tilt: e.tilt })
  }
  level?.drawMid?.(g, ctx)
  for (const b of bubbles) {
    if (b.pulledBy) {
      // the magnet's tractor beam
      const p = b.pulledBy
      ctx.strokeStyle = hexA(POWERS[b.type].color, 0.35 + 0.15 * Math.sin(time * 20))
      ctx.lineWidth = 3
      ctx.setLineDash([6, 6])
      ctx.lineDashOffset = -time * 60
      ctx.beginPath()
      ctx.moveTo(p.x, p.y - 20)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
      ctx.setLineDash([])
    }
    drawBubble(ctx, b.x, b.y, b.r, b.type, b.t)
  }

  ctx.globalCompositeOperation = 'lighter'
  for (const s of pShots) {
    if (!s.drone) drawPlayerShot(ctx, s, PLAYER_COLORS[s.owner])
    else {
      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.scale(0.6, 0.6)
      drawPlayerShot(ctx, { x: 0, y: 0, vx: s.vx, vy: s.vy }, PLAYER_COLORS[s.owner])
      ctx.restore()
    }
  }
  ctx.globalCompositeOperation = 'source-over'

  for (const p of players) drawPlayer(p)

  for (const L of lasers) (L.draw ?? drawLaser)(ctx, L, H, time)
  ctx.globalCompositeOperation = 'lighter'
  for (const s of eShots) if (s.kind !== 'mine') drawEnemyShot(ctx, s, time)
  ctx.globalCompositeOperation = 'source-over'
  for (const s of eShots) if (s.kind === 'mine') drawEnemyShot(ctx, s, time)

  drawParticles()
  level?.drawTop?.(g, ctx)
  drawTexts()
  ctx.restore()

  if (flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${flash * 0.6})`
    ctx.fillRect(0, 0, W, H)
  }
  if (bars > 0.5) drawBars()
  else {
    drawHUD()
    if (bars > 0.01) drawBars()
  }
}

// Cinema bars for a cutscene, with a reminder that it can be skipped.
function drawBars() {
  const h = 74 * bars
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, W, h)
  ctx.fillRect(0, H - h, W, h)
  if (cutscene?.onSkip && cutscene.t > cutscene.minSkip) {
    ctx.globalAlpha = Math.min(1, (cutscene.t - cutscene.minSkip) * 2) * (0.55 + 0.25 * Math.sin(time * 4))
    ctx.font = `13px ${FONT}`
    ctx.textAlign = 'right'
    ctx.fillStyle = '#a9b3d6'
    ctx.fillText('Enter or tap: skip', W - 20, H - h / 2 + 5)
    ctx.globalAlpha = 1
  }
}

function drawPlayer(p) {
  if (!p.alive) return
  if (p.invuln > 0 && Math.floor(time * 14) % 2 === 0) ctx.globalAlpha = 0.35
  const moving = Math.min(1, Math.hypot(p.vx, p.vy) / 400)
  for (const [dx, dy] of dronePositions(p)) drawDrone(ctx, dx, dy, p.paint, time + p.id)
  drawShipModel(ctx, p.x, p.y, p.ship, p.paint, { tilt: p.tilt, t: time + p.id, thrust: 0.4 + moving * 0.6 - Math.max(0, p.vy / 800) })
  ctx.globalAlpha = 1
  p.carry?.draw?.(ctx, p, time)
  const shield = powerLevel(p.powers, 'shield')
  if (shield) drawShieldBubble(ctx, p.x, p.y, time, POWERS.shield.color, shield)
  const speed = powerLevel(p.powers, 'speed')
  if (speed) {
    ctx.fillStyle = hexA(POWERS.speed.color, 0.5)
    for (const d of [-1, 1]) ctx.fillRect(p.x + d * 22 - 1.5, p.y + 26, 3, 12 + speed * 6 + Math.sin(time * 30 + d) * 6)
  }
  if (numPlayers === 2) {
    ctx.font = `12px ${FONT}`
    ctx.textAlign = 'center'
    ctx.fillStyle = p.pal.main
    ctx.fillText(p.pal.name, p.x, p.y + 52)
  }
}

function drawParticles() {
  for (const p of particles) {
    const a = Math.max(0, p.life / p.max)
    if (p.kind === 'puff') {
      ctx.globalAlpha = a * 0.5
      drawPuff(ctx, p.x, p.y, p.size * (2.2 - a * 0.8))
    }
  }
  ctx.globalCompositeOperation = 'lighter'
  for (const p of particles) {
    const a = Math.max(0, p.life / p.max)
    if (p.kind === 'spark' || p.kind === 'drop') {
      ctx.globalAlpha = a
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * (p.kind === 'drop' ? 1 : 0.5 + a * 0.5), 0, TAU)
      ctx.fill()
    } else if (p.kind === 'glow') {
      ctx.globalAlpha = a
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
      g.addColorStop(0, 'rgba(255,255,255,0.9)')
      g.addColorStop(1, 'rgba(255,200,120,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, TAU)
      ctx.fill()
    }
  }
  for (const r of rings) {
    ctx.globalAlpha = Math.max(0, 1 - r.r / r.max)
    ctx.strokeStyle = r.color
    ctx.lineWidth = r.w
    ctx.beginPath()
    ctx.arc(r.x, r.y, r.r, 0, TAU)
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
}

function drawTexts() {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  for (const t of texts) {
    const a = Math.min(1, t.life / (t.max * 0.4))
    ctx.globalAlpha = a
    ctx.font = `${t.size}px ${FONT}`
    const x = clamp(t.x, 20 + ctx.measureText(t.text).width / 2, W - 20 - ctx.measureText(t.text).width / 2)
    ctx.strokeStyle = 'rgba(10,6,30,0.85)'
    ctx.lineWidth = 5
    ctx.strokeText(t.text, x, t.y)
    ctx.fillStyle = t.color
    ctx.fillText(t.text, x, t.y)
  }
  ctx.globalAlpha = 1
  ctx.textBaseline = 'alphabetic'
}

function drawHUD() {
  for (const p of players) drawPlayerHUD(p)

  // centre: stage progress or the boss's health
  const cx = W / 2
  ctx.textAlign = 'center'
  if (boss && !boss.entering) {
    const bw = Math.min(W * 0.46, 520)
    const frac = Math.max(0, boss.hp / boss.maxHp)
    const name = boss.def.hudName?.(boss, g) ?? boss.def.name
    ctx.font = `15px ${FONT}`
    ctx.fillStyle = '#ffb3b3'
    ctx.fillText(name, cx, 28)
    drawBar(cx - bw / 2, 38, bw, 14, frac, boss.rage ? '#ff3b3b' : '#ff5a6a')
    boss.def.hud?.(boss, g, ctx)
  } else if (phase === 'main' || phase === 'intro') {
    if (level.hud) level.hud(g, ctx)
    else {
      const bw = Math.min(W * 0.3, 280)
      ctx.font = `13px ${FONT}`
      ctx.fillStyle = '#a9b3d6'
      ctx.textAlign = 'center'
      ctx.fillText(`Mission ${missionIdx + 1} · ${mission.name}`, cx, 26)
      drawBar(cx - bw / 2, 34, bw, 8, clamp(level.progress?.(g) ?? 0, 0, 1), '#7d8cff')
    }
  }

  ctx.font = `11px ${FONT}`
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(169,179,214,0.6)'
  ctx.fillText(`P pause · M sound ${isMuted() ? 'off' : 'on'}`, cx, H - 12)
}

function drawBar(x, y, w, h, frac, color) {
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, h / 2)
  ctx.fill()
  if (frac > 0) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.roundRect(x, y, Math.max(h, w * frac), h, h / 2)
    ctx.fill()
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, h / 2)
  ctx.stroke()
}

function drawPlayerHUD(p) {
  const right = p.id === 1
  const x = right ? W - 20 : 20
  const align = right ? 'right' : 'left'
  const dir = right ? -1 : 1
  ctx.textAlign = align
  ctx.font = `14px ${FONT}`
  ctx.fillStyle = p.pal.main
  ctx.fillText(numPlayers === 1 ? 'Score' : p.pal.name, x, 28)
  ctx.font = `24px ${FONT}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText(String(p.score).padStart(6, '0'), x, 56)

  if (p.out) {
    // drawn where the power-up slots would be, clear of any boss hint lines
    ctx.font = `12px ${FONT}`
    ctx.fillStyle = '#ff8a8a'
    if (numPlayers === 2) {
      ctx.fillText('Down!', x, 100)
      ctx.fillText('Partner: grab a heart', x, 118)
    } else ctx.fillText('Out of ships', x, 100)
    return
  }
  // lives as tiny ships, with a count once there are too many to draw
  const shown = Math.min(p.lives, 5)
  for (let i = 0; i < shown; i++) {
    drawShipModel(ctx, x + dir * (12 + i * 24), 82, p.ship, p.paint, { scale: 0.32, t: time, thrust: 0.2 })
  }
  if (p.lives > shown) {
    ctx.font = `13px ${FONT}`
    ctx.textAlign = align
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`+${p.lives - shown}`, x + dir * (12 + shown * 24 - 6), 88)
  }
  // the power-up slots, oldest first, each with its timer ring and stack
  for (let k = 0; k < p.maxSlots; k++) {
    const slot = p.powers[k]
    const ix = x + dir * (16 + k * 36)
    const iy = 114
    ctx.fillStyle = 'rgba(10,8,34,0.7)'
    ctx.beginPath()
    ctx.arc(ix, iy, 14, 0, TAU)
    ctx.fill()
    if (!slot) {
      ctx.strokeStyle = 'rgba(169,179,214,0.28)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([3, 4])
      ctx.stroke()
      ctx.setLineDash([])
      continue
    }
    const col = POWERS[slot.type].color
    // blink the last three seconds so a ship knows it's about to lose it
    const ending = slot.time < 3 && Math.floor(time * 6) % 2 === 0
    ctx.save()
    ctx.translate(ix, iy)
    if (ending) ctx.globalAlpha = 0.4
    drawIcon(ctx, slot.type, 7.5, col)
    ctx.restore()
    const frac = Number.isFinite(slot.time) ? slot.time / slot.full : 1
    ctx.strokeStyle = col
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.arc(ix, iy, 14, -Math.PI / 2, -Math.PI / 2 + TAU * frac)
    ctx.stroke()
    if (slot.level > 1) {
      ctx.font = `10px ${FONT}`
      ctx.textAlign = 'center'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = 'rgba(10,6,30,0.9)'
      ctx.lineWidth = 3
      ctx.strokeText(`×${slot.level}`, ix + 11, iy + 16)
      ctx.fillStyle = col
      ctx.fillText(`×${slot.level}`, ix + 11, iy + 16)
    }
  }
}

// ================================================================ screens & input

const screens = {
  menu: document.getElementById('menu'),
  map: document.getElementById('map'),
  store: document.getElementById('store'),
  pause: document.getElementById('pause'),
  over: document.getElementById('over'),
  done: document.getElementById('done'),
  win: document.getElementById('win'),
}
const walletEl = document.getElementById('wallet')
const toastEl = document.getElementById('toast')

function showScreen(name) {
  for (const k in screens) screens[k].classList.toggle('show', k === name)
  if (name && screens[name].querySelector('.buttons')) selectButton(screens[name], 0)
  // the wallet pill rides along on the home screen and the map; the store and
  // the end-of-mission panels show the balance themselves, and over a battle
  // it would sit on Player 2's score
  walletEl.classList.toggle('show', name === 'menu' || name === 'map')
}

function updateWallet() {
  walletEl.querySelector('.n').textContent = save.stars.toLocaleString()
  document.querySelectorAll('[data-wallet]').forEach((el) => (el.textContent = save.stars.toLocaleString()))
}

let toastTimer = 0
function toast(text) {
  toastEl.textContent = text
  toastEl.classList.remove('show')
  void toastEl.offsetWidth
  toastEl.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600)
}

function selectButton(screen, i) {
  const btns = [...screen.querySelectorAll('.buttons button:not([hidden])')]
  btns.forEach((b, j) => b.classList.toggle('sel', j === i))
}

function moveButton(screen, d) {
  const btns = [...screen.querySelectorAll('.buttons button:not([hidden])')]
  const i = btns.findIndex((b) => b.classList.contains('sel'))
  selectButton(screen, (i + d + btns.length) % btns.length)
  sfx.select()
}

function activeButton(screen) {
  return screen.querySelector('.buttons button.sel:not([hidden])')
}

// Scores and what the run paid, on the game-over, mission-complete and
// victory screens.
function fillEndScreen(name) {
  const sc = screens[name]
  const box = sc.querySelector('.scores')
  box.innerHTML = ''
  const card = (cls, who, pts) => {
    const d = document.createElement('div')
    d.className = 'score ' + cls
    d.innerHTML = `<div class="who"></div><div class="pts"></div>`
    d.querySelector('.who').textContent = who
    d.querySelector('.pts').textContent = pts.toLocaleString()
    box.appendChild(d)
  }
  if (numPlayers === 1) card('p1', 'Score', players[0].score)
  else {
    card('p1', 'Player 1', players[0].score)
    card('p2', 'Player 2', players[1].score)
    card('team', 'Team', players[0].score + players[1].score)
  }

  const r = lastReward
  const list = sc.querySelector('.reward')
  list.innerHTML = ''
  const line = (label, value, cls = '') => {
    const li = document.createElement('li')
    li.className = cls
    li.innerHTML = '<span class="k"></span><span class="v"></span>'
    li.querySelector('.k').textContent = label
    li.querySelector('.v').textContent = value
    list.appendChild(li)
  }
  line(`Score ${r.score.toLocaleString()}`, `★ ${r.base}`)
  if (r.deaths) {
    line(`${r.deaths} ${r.deaths === 1 ? 'ship' : 'ships'} lost (−${Math.round(r.penalty * 100)}%)`, `★ ${r.kept}`, 'minus')
  }
  if (r.clearBonus) line('Mission cleared', `+★ ${r.clearBonus}`, 'plus')
  line('Stars earned', `+★ ${r.total}`, 'total')
  sc.querySelector('.wallet-line').textContent = `You have ★ ${r.wallet.toLocaleString()}`

  if (name === 'done') {
    sc.querySelector('h2').textContent = mission.doneTitle ?? (mission.boss ? 'Mission complete!' : 'Bonus round complete!')
    const next = MISSIONS[missionIdx + 1]
    const btn = sc.querySelector('[data-act="next"]')
    btn.hidden = !next
    if (next) btn.textContent = `Next: ${next.name}`
  }
  if (name === 'over') sc.querySelector('.lead').textContent = run.deaths ? 'Every ship got knocked out — but you still earned stars!' : 'The aliens got away this time…'
}

// ---------------------------------------------------------------- home

function setMenuSel(i) {
  if (i !== menuSel) sfx.select()
  menuSel = i
  numPlayers = i + 1
  save.players = numPlayers
  document.querySelectorAll('.choice').forEach((b, j) => b.classList.toggle('sel', j === i && menuRow === 0))
  document.body.classList.toggle('solo', i === 0)
}

function setMenuRow(r) {
  if (r !== menuRow) sfx.select()
  menuRow = r
  document.getElementById('storeBtn').classList.toggle('sel', r === 1)
  setMenuSel(menuSel)
}

function goHome() {
  mode = 'menu'
  clearWorld()
  players = []
  stars.targetSpeed = 1
  document.getElementById('banner').className = ''
  menuRow = 0
  setMenuRow(0)
  paintMenuArt()
  showScreen('menu')
  updateWallet()
}

// ---------------------------------------------------------------- mission map

function goMap(select) {
  mode = 'map'
  clearWorld()
  players = []
  stars.targetSpeed = 1
  document.getElementById('banner').className = ''
  persist()
  const open = save.missions.unlocked
  mapSel = clamp(select ?? Math.min(open - 1, MISSIONS.length - 1), 0, open - 1)
  renderMap()
  showScreen('map')
  updateWallet()
}

function renderMap() {
  const grid = screens.map.querySelector('.missions')
  grid.innerHTML = ''
  MISSIONS.forEach((m, i) => {
    const locked = i >= save.missions.unlocked
    const cleared = !!save.missions.cleared[m.id]
    const card = document.createElement('button')
    card.type = 'button'
    card.className = 'mission' + (locked ? ' locked' : '') + (cleared ? ' cleared' : '') + (i === mapSel ? ' sel' : '')
    card.dataset.idx = i
    card.innerHTML = `
      <canvas class="micon" width="160" height="100" aria-hidden="true"></canvas>
      <span class="mnum"></span>
      <span class="mname"></span>
      <span class="danger" aria-label=""></span>
      <span class="mblurb"></span>
      <span class="mbest"></span>`
    card.querySelector('.mnum').textContent = m.boss ? `Mission ${i + 1}` : `Mission ${i + 1} · ${m.tag ?? 'Bonus'}`
    card.querySelector('.mname').textContent = locked ? '???' : m.name
    const danger = card.querySelector('.danger')
    danger.setAttribute('aria-label', `Danger ${m.difficulty} of 5`)
    for (let k = 0; k < 5; k++) {
      const pip = document.createElement('i')
      if (k < m.difficulty) pip.className = 'on'
      danger.appendChild(pip)
    }
    card.querySelector('.mblurb').textContent = locked ? `Clear mission ${i} to unlock` : m.blurb
    const best = save.missions.best[m.id]
    card.querySelector('.mbest').textContent = cleared ? `Cleared · best ${(best ?? 0).toLocaleString()}` : best ? `Best ${best.toLocaleString()}` : ''
    card.addEventListener('mouseenter', () => selectMission(i))
    card.addEventListener('click', () => {
      unlockAudio()
      if (!locked) startMission(i)
    })
    grid.appendChild(card)
    paintMissionIcon(card.querySelector('canvas'), m, locked)
  })
}

function selectMission(i) {
  i = clamp(i, 0, MISSIONS.length - 1)
  if (i === mapSel) return
  mapSel = i
  sfx.select()
  screens.map.querySelectorAll('.mission').forEach((c, j) => c.classList.toggle('sel', j === i))
  screens.map.querySelector('.mission.sel')?.scrollIntoView({ block: 'nearest' })
}

// How many cards sit in one row of the map grid right now.
function mapColumns() {
  const cards = [...screens.map.querySelectorAll('.mission')]
  if (cards.length < 2) return 1
  const top = cards[0].offsetTop
  const n = cards.findIndex((c) => c.offsetTop !== top)
  return n < 0 ? cards.length : n
}

function paintMissionIcon(canvas, m, locked) {
  // painted at the card's real pixel size so it stays crisp on phones and
  // retina screens
  const k = clamp(Math.ceil(((canvas.clientWidth || 160) / 80) * (window.devicePixelRatio || 1)), 2, 10)
  canvas.width = 80 * k
  canvas.height = 50 * k
  const c = canvas.getContext('2d')
  c.setTransform(k, 0, 0, k, 0, 0)
  const w = 80
  const h = 50
  c.fillStyle = '#0b0726'
  c.fillRect(0, 0, w, h)
  const lv = LEVELS[m.level]
  if (lv?.icon && m.level !== 'waves') lv.icon(c, w, h)
  else {
    // the classic missions show their boss's ship
    if (m.boss === 'mothership') {
      // the real thing, shrunk until its wingtips just kiss the card's edges
      const w = 980
      const tur = (side) => ({ ox: side * w * MOTHER.turretX, oy: MOTHER.turretY, hp: 1, aim: Math.PI / 2, flash: 0 })
      c.save()
      c.translate(40, 17)
      c.scale(0.088, 0.088)
      drawMothership(c, { x: 0, y: 0, w, turrets: [tur(-1), tur(1)], shield: 1, hangarOpen: 0, coreFlash: 0, flash: 0, hurt: 0, rage: false }, 1.3)
      c.restore()
    } else drawSaucer(c, 40, 30, 26, m.boss === 'blorp' ? 'blorp' : 'zorb', 1.3)
  }
  if (locked) {
    c.fillStyle = 'rgba(8,5,24,0.72)'
    c.fillRect(0, 0, w, h)
    c.fillStyle = '#a9b3d6'
    c.fillRect(33, 24, 14, 11)
    c.strokeStyle = '#a9b3d6'
    c.lineWidth = 2.2
    c.beginPath()
    c.arc(40, 24, 5, Math.PI, TAU)
    c.stroke()
  }
}

// ---------------------------------------------------------------- store

function goStore(from) {
  storeReturn = from
  mode = 'store'
  showScreen('store')
  updateWallet()
  openStore({
    root: screens.store,
    save,
    numPlayers,
    persist() {
      persist()
      updateWallet()
    },
    sfx,
    onClose() {
      persist()
      if (storeReturn === 'map') goMap(mapSel)
      else goHome()
    },
  })
}

// ---------------------------------------------------------------- in flight

function pause() {
  if (mode !== 'play') return
  mode = 'pause'
  showScreen('pause')
}

function resume() {
  if (mode !== 'pause') return
  mode = 'play'
  showScreen(null)
  last = performance.now()
}

// Leaving mid-mission still pays for what you did — and once the boss is
// beaten, skipping the celebration still counts as winning.
function quitMission() {
  if (mode !== 'pause' && mode !== 'play') return
  mode = 'play'
  if (phase === 'clear' || phase === 'victory' || (boss && boss.dying > 0)) return endMission(true)
  const r = payOut(false)
  goMap(missionIdx)
  if (r.total) toast(`You earned ★ ${r.total}`)
}

function act(name) {
  if (name === 'resume') resume()
  else if (name === 'quit') quitMission()
  else if (name === 'home') goHome()
  else if (name === 'map') goMap(missionIdx)
  else if (name === 'store') goStore(mode === 'menu' ? 'menu' : 'map')
  else if (name === 'again') startMission(missionIdx)
  else if (name === 'next') startMission(missionIdx + 1)
}

const keys = new Set()
const GAME_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'])
const LEFT = new Set(['KeyA', 'ArrowLeft'])
const RIGHT = new Set(['KeyD', 'ArrowRight'])
const UP = new Set(['KeyW', 'ArrowUp'])
const DOWN = new Set(['KeyS', 'ArrowDown'])
const OK = new Set(['Enter', 'Space', 'NumpadEnter'])

function chooseFromMenu() {
  if (menuRow === 1) return goStore('menu')
  const direct = missionIndex(params.get('mission') ?? '')
  if (direct >= 0) startMission(direct)
  else goMap()
}

window.addEventListener('keydown', (e) => {
  unlockAudio()
  if (GAME_KEYS.has(e.code) && mode !== 'store') e.preventDefault()
  keys.add(e.code)
  if (e.repeat && mode !== 'map' && mode !== 'store') return
  if (e.code === 'KeyM' && mode !== 'store') toggleMute()

  if (mode === 'menu') {
    if (LEFT.has(e.code)) menuRow === 0 ? setMenuSel(0) : setMenuRow(0)
    else if (RIGHT.has(e.code)) menuRow === 0 ? setMenuSel(1) : setMenuRow(0)
    else if (DOWN.has(e.code)) setMenuRow(1)
    else if (UP.has(e.code)) setMenuRow(0)
    else if (e.code === 'Digit1' || e.code === 'Numpad1') (setMenuSel(0), goMap())
    else if (e.code === 'Digit2' || e.code === 'Numpad2') (setMenuSel(1), goMap())
    else if (e.code === 'KeyT') goStore('menu')
    else if (OK.has(e.code)) chooseFromMenu()
  } else if (mode === 'map') {
    const cols = mapColumns()
    if (LEFT.has(e.code)) selectMission(mapSel - 1)
    else if (RIGHT.has(e.code)) selectMission(mapSel + 1)
    else if (UP.has(e.code)) selectMission(mapSel - cols)
    else if (DOWN.has(e.code)) selectMission(mapSel + cols)
    else if (e.code === 'KeyT') goStore('map')
    else if (e.code === 'Escape' || e.code === 'Backspace' || e.code === 'KeyH') goHome()
    else if (OK.has(e.code) && mapSel < save.missions.unlocked) startMission(mapSel)
    if (GAME_KEYS.has(e.code)) e.preventDefault()
  } else if (mode === 'store') {
    storeKey(e)
  } else if (mode === 'play') {
    if (e.code === 'KeyP' || e.code === 'Escape') pause()
    else if (cutscene?.onSkip && cutscene.t >= cutscene.minSkip && OK.has(e.code)) cutscene.onSkip()
  } else if (mode === 'pause') {
    if (e.code === 'KeyP' || e.code === 'Escape') resume()
    else if (e.code === 'KeyQ') quitMission()
    else if (LEFT.has(e.code) || RIGHT.has(e.code)) moveButton(screens.pause, LEFT.has(e.code) ? -1 : 1)
    else if (OK.has(e.code)) act(activeButton(screens.pause).dataset.act)
  } else if (mode === 'over' || mode === 'done' || mode === 'win') {
    const sc = screens[mode]
    if (e.code === 'Escape' || e.code === 'KeyH') goMap(missionIdx)
    else if (e.code === 'KeyT') goStore('map')
    else if (LEFT.has(e.code) || RIGHT.has(e.code)) moveButton(sc, LEFT.has(e.code) ? -1 : 1)
    else if (OK.has(e.code)) act(activeButton(sc).dataset.act)
  }
})
window.addEventListener('keyup', (e) => keys.delete(e.code))
window.addEventListener('blur', () => {
  keys.clear()
  pause()
})
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause()
})

document.querySelectorAll('.choice').forEach((b, i) => {
  b.addEventListener('mouseenter', () => {
    menuRow = 0
    setMenuRow(0)
    setMenuSel(i)
  })
  b.addEventListener('click', () => {
    unlockAudio()
    menuRow = 0
    setMenuSel(i)
    chooseFromMenu()
  })
})
document.getElementById('storeBtn').addEventListener('click', () => {
  unlockAudio()
  goStore('menu')
})
document.querySelectorAll('.buttons button').forEach((b) => {
  b.addEventListener('click', () => {
    unlockAudio()
    act(b.dataset.act)
  })
})

// Touch / mouse: drag a finger and your ship follows it. With two players,
// the left half of the screen steers P1 and the right half P2.
function toWorld(e) {
  return { x: e.clientX / S, y: e.clientY / S }
}
canvas.addEventListener('pointerdown', (e) => {
  if (mode !== 'play') return
  unlockAudio()
  if (cutscene?.onSkip) return cutscene.t >= cutscene.minSkip && cutscene.onSkip()
  const pt = toWorld(e)
  const p = numPlayers === 2 && pt.x > W / 2 ? players[1] : players[0]
  if (!p) return
  p.touch = { id: e.pointerId, ...pt }
  canvas.setPointerCapture(e.pointerId)
})
canvas.addEventListener('pointermove', (e) => {
  for (const p of players) if (p.touch && p.touch.id === e.pointerId) Object.assign(p.touch, toWorld(e))
})
const release = (e) => {
  for (const p of players) if (p.touch && p.touch.id === e.pointerId) p.touch = null
}
canvas.addEventListener('pointerup', release)
canvas.addEventListener('pointercancel', release)

// ================================================================ boot

// `?debug` puts a handle on the window for playtesting from a script: god mode,
// handing out power-ups, jumping into a mission or editing the save.
if (params.has('debug')) {
  window.__ufo = {
    g,
    get mode() { return mode },
    get save() { return save },
    start(id, n = 1) {
      numPlayers = n
      startMission(Math.max(0, missionIndex(id)))
    },
    god(on = true) { for (const p of players) p.invuln = on ? 1e9 : 0 },
    give(i, type) {
      const p = players[i]
      if (p) collect(p, { type, x: p.x, y: p.y - 60 })
    },
    steer(i, x, y) {
      const p = players[i]
      if (p) p.touch = x == null ? null : { id: -1, x, y: y ?? H - 40 }
    },
    skip() { g.levelDone() },
    setSave(patch) {
      Object.assign(save, patch)
      persist()
      paintMenuArt()
      updateWallet()
    },
  }
}

// The home screen's ships show what each player has equipped in the store,
// and its tip counts the slots the Cargo Bay has bought.
function paintMenuArt() {
  document.querySelector('.stack-note b').textContent = loadout(save, 0).slots
  for (const c of document.querySelectorAll('.shipicon')) {
    const id = Number(c.dataset.player)
    const lo = loadout(save, id)
    // 80 x 72 units, wide enough for the Bulwark's wingtips
    c.width = 120
    c.height = 108
    const g2 = c.getContext('2d')
    g2.scale(1.5, 1.5)
    drawShipModel(g2, 40, 38, lo.ship, lo.paint, { thrust: 0.6, t: 0 })
  }
}

function paintLegend() {
  const list = document.querySelector('.legend')
  for (const [type, info] of Object.entries(POWERS)) {
    const li = document.createElement('li')
    const c = document.createElement('canvas')
    c.width = 68
    c.height = 68
    const g = c.getContext('2d')
    g.scale(2, 2)
    drawBubble(g, 17, 17, 15, type, 0)
    const label = document.createElement('span')
    label.innerHTML = `<b></b> — `
    label.querySelector('b').textContent = info.label
    label.append(info.blurb)
    li.append(c, label)
    list.appendChild(li)
  }
}

let last = performance.now()
function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000)
  last = now
  if (mode !== 'pause') update(dt)
  draw()
  requestAnimationFrame(frame)
}

resize()
initMenuScene()
paintMenuArt()
paintLegend()
setMenuSel(save.players - 1)
setMenuRow(0)
updateWallet()
showScreen('menu')
document.fonts.load(`16px ${FONT}`).finally(() => document.body.classList.add('ready'))
requestAnimationFrame(frame)
