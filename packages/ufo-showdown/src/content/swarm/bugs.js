// The horde: the swarm's three kinds of bug, the shapes they fly in, and the
// tally of how many went pop.
//
// A swarmlet is one hit and worth 10. Almost all of them hurt only by flying
// into a ship, so a full screen is a crowd to blast through rather than a
// bullet storm. They fly in groups: a group is one small object that moves
// (a flock's leader, a ring's centre, a spiral's eye) and every member reads
// it, so a hundred and seventy bugs cost a few multiplies each.

import { synth } from '../../audio.js'
import { PALS, FRAMES, tiltIndex, bugSprite, whiteOf, stampBug, stampGlow } from './sprites.js'

export const PALS_N = PALS.length

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// Past this many live swarmlets, new ones just don't hatch. main.js tests
// every laser against every enemy and every kill throws sparks, so the
// count is what the frame time follows. The boss fight keeps fewer about, so
// the Queen herself stays in reach of the lasers.
export const CAP = 170
export const BOSS_CAP = 95

// ---------------------------------------------------------------- the tally

const MILESTONES = [50, 100, 200, 300, 400, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000]
const COMBOS = [25, 50, 100, 150, 200, 300, 400, 500, 750, 1000]
// A firepower bubble every so many kills, but never two within DROP_GAP
// seconds, and one from the sky if nobody has earned one for a long while.
const DROP_EVERY = 40
const DROP_GAP = 6
const DROP_LATE = 11

export const stats = {}
export function resetStats() {
  Object.assign(stats, {
    kills: 0, // swarmlets and friends popped, whole team
    combo: 0, // kills without a breather
    comboT: 0, // seconds until the combo cools off
    best: 0,
    pulse: 0, // the HUD counter's bump
    mi: 0, // next milestone
    ci: 0, // next combo shout
    sinceDrop: 0,
    dropT: 4,
    dropI: 0,
    live: 0, // live swarmlets this frame
    cap: CAP,
    peak: 0, // most swarmlets alive at once
    peakAll: 0, // most enemies of any kind alive at once
    capped: 0, // hatchings the cap turned away
    spawned: 0,
    was: [],
    cheer: null, // the milestone shout on screen
    shout: null, // the combo shout on screen
  })
}
resetStats()

export const firepower = () => (stats.dropI++ % 2 ? 'triple' : 'rapid')

// Every bug that dies comes through here: points, the combo, the milestones
// and the firepower bubbles that keep the ships up to the job.
export function tally(g, e, owner, pts) {
  if (pts) g.addScore(owner, pts)
  stats.kills++
  stats.combo++
  stats.comboT = 1.4
  stats.pulse = 1
  stats.best = Math.max(stats.best, stats.combo)
  stats.sinceDrop++
  if (stats.kills >= MILESTONES[stats.mi]) celebrate(g, MILESTONES[stats.mi++])
  if (stats.combo >= COMBOS[stats.ci]) {
    const n = COMBOS[stats.ci++]
    const p = g.players[owner] ?? g.players[0]
    const bonus = n
    g.addScore(owner, bonus)
    if (p?.alive) stats.shout = say(g, stats.shout, p.x, p.y - 64, `×${n} COMBO! +${bonus}`, '#ff9be6', 17, 1.2)
    synth.tone({ type: 'square', from: 660 + Math.min(stats.ci, 8) * 60, to: 1320, dur: 0.12, vol: 0.06 }, 'swarm-combo', 0.1)
  }
  if (stats.sinceDrop >= DROP_EVERY && stats.dropT <= 0) {
    g.dropBubble(clamp(e.x, 40, g.W - 40), Math.min(e.y, g.H * 0.4), firepower())
    stats.sinceDrop = 0
    stats.dropT = DROP_GAP
  }
}

// Bugs that go up all at once (the Queen's last breath takes the swarm with
// her) count too, in one go.
export function bonusKills(g, owner, n) {
  g.addScore(owner, 10 * n)
  stats.kills += n
  let hit = 0
  while (stats.kills >= MILESTONES[stats.mi]) hit = MILESTONES[stats.mi++]
  if (hit) celebrate(g, hit)
}

// A shout replaces the last one if it's still up, so a Nova that pops a
// hundred bugs at once gives one "100 SAUCERS!", not a pile of them.
function say(g, last, x, y, text, color, size, life) {
  if (last && last.life > 0.3) {
    Object.assign(last, { x, y, text, color, size, life, max: life })
    return last
  }
  return g.popText(x, y, text, color, size, life)
}

function celebrate(g, n) {
  const t = (stats.cheer = say(g, stats.cheer, g.W / 2, g.H * 0.36, `${n} SAUCERS!`, '#ffe23d', n >= 1000 ? 40 : 34, 1.8))
  t.rise = 16
  for (const p of g.players) if (!p.out) g.addScore(p.id, Math.round(n / 2))
  ;[784, 988, 1175, 1568].forEach((f, i) => synth.tone({ type: 'square', from: f, dur: 0.1, vol: 0.07, at: i * 0.06 }, 'swarm-cheer' + i, 0.3))
}

export function tickStats(g, dt) {
  stats.comboT -= dt
  // a ship knocked out breaks the combo too, and one coming back gets a
  // firepower bubble right overhead: knocked-out ships lose their power-ups,
  // and a pea-shooter against this many bugs is no way back in
  let down = false
  g.players.forEach((p, i) => {
    if (stats.was[i] && !p.alive) down = true
    if (stats.was[i] === false && p.alive && (g.phase === 'main' || g.phase === 'boss')) g.dropBubble(p.x, p.y - 150, 'rapid')
    stats.was[i] = p.alive
  })
  if (down && stats.combo >= 25) g.popText(g.W / 2, g.H * 0.44, `Combo lost at ×${stats.combo}`, '#a9b3d6', 16, 1.4)
  if (stats.comboT <= 0 || down) {
    stats.combo = 0
    stats.ci = 0
  }
  stats.pulse = Math.max(0, stats.pulse - dt * 5)
  stats.dropT -= dt
  if (stats.dropT < -DROP_LATE && (g.phase === 'main' || g.phase === 'boss')) {
    g.dropBubble(g.rand(80, g.W - 80), -30, firepower())
    stats.dropT = DROP_GAP
    stats.sinceDrop = 0
  }
  let n = 0
  for (const e of g.enemies) if (e.swarm) n++
  stats.live = n
  stats.peak = Math.max(stats.peak, n)
  stats.peakAll = Math.max(stats.peakAll, g.enemies.length)
}

// ---------------------------------------------------------------- hatching

// The one way a swarmlet comes into the world, so the cap is never missed.
export function hatch(g, x, y, fields) {
  if (stats.live >= stats.cap) {
    if (stats.capped++ === 0 && g.debug) console.info(`[swarm] ${stats.cap} live swarmlets: the cap is holding the rest back`)
    return null
  }
  stats.live++
  stats.spawned++
  return g.spawn('swarmlet', x, y, fields)
}

// ---------------------------------------------------------------- groups

export let groups = []
export function resetGroups() {
  groups = []
}

function addGroup(G) {
  G.t = 0
  G.live = 0
  G.seen = 0
  groups.push(G)
  return G
}

export function updateGroups(g, dt) {
  for (const G of groups) {
    // members count themselves in as they update, a frame behind this
    G.seen = G.live
    G.live = 0
    G.t += dt
    STEP[G.kind]?.(G, g, dt)
  }
  // a group goes once it has nothing left to send and nobody left flying
  groups = groups.filter((G) => G.seen > 0 || G.t < (G.hold ?? 1.5) || (G.emit ?? 0) > 0)
}

const STEP = {
  // a flock's leader: swoop through in a U, or come down, weave, and dive
  flock(G, g, dt) {
    if (G.style === 'swoop') {
      const u = G.t / G.dur
      G.x = G.x0 + (G.x1 - G.x0) * u
      G.y = -70 + (G.depth + 70) * Math.sin(Math.PI * Math.min(1, u))
      if (u >= 1) G.done = true
      return
    }
    if (G.state === 'in') {
      G.x += (G.hx - G.x) * Math.min(1, dt * 1.6)
      G.y += Math.max(60, (G.hy - G.y) * 1.8) * dt
      if (G.y >= G.hy - 4) (G.state = 'weave'), (G.st = 0)
    } else if (G.state === 'weave') {
      G.st += dt
      G.x = clamp(G.x + Math.sin(G.st * 1.7 + G.ph) * 160 * dt, 80, g.W - 80)
      G.y = G.hy + Math.sin(G.st * 2.3) * 20
      if (G.st > G.hover) {
        G.state = 'rev'
        G.st = 0
        // the lane is picked here and shown, and the dive keeps to it
        const p = g.nearestPlayer(G.x, G.y)
        G.lane = clamp(p ? p.x : G.x, 50, g.W - 50)
        synth.tone({ type: 'sawtooth', from: 180, to: 420, dur: 0.5, vol: 0.05 }, 'swarm-rev', 0.2)
      }
    } else if (G.state === 'rev') {
      G.st += dt
      if (G.st > G.revT) (G.state = 'dive'), (G.vy = 80)
    } else {
      G.vy = Math.min(G.vy + 700 * dt, G.fast)
      G.y += G.vy * dt
      G.x += (G.lane - G.x) * Math.min(1, dt * 5)
      if (G.y > g.H + 260) G.done = true
    }
  },

  // a stream: let members out one at a time down the same path
  path(G, g, dt) {
    if (G.warn > 0) {
      G.warn -= dt
      return
    }
    if (G.emit > 0 && (G.next -= dt) <= 0) {
      G.next += G.every
      for (let i = 0; i < G.wide && G.emit > 0; i++) {
        G.emit--
        const e = hatch(g, -100, -100, { swarm: true, m: 'path', grp: G, pal: G.pal, jx: rand(-1, 1) * G.jit, jy: rand(-1, 1) * G.jit, a0: G.rot })
        if (e) G.at(e, 0, g)
      }
      G.rot += G.turn
    }
  },

  // the ring closes in: gather round a ship, spin round it, then tighten
  ring(G, g, dt) {
    const p = G.p.alive ? G.p : g.nearestPlayer(G.cx, G.cy)
    const follow = G.state === 'gather' || G.state === 'spin'
    if (p && follow) {
      const k = Math.min(1, dt * (G.state === 'gather' ? 3 : 1.4))
      G.cx += (clamp(p.x, 120, g.W - 120) - G.cx) * k
      G.cy += (clamp(p.y, g.playerTop() + 40, g.H - 100) - G.cy) * k
    }
    if (G.state === 'gather') {
      const u = Math.min(1, G.t / G.gather)
      G.k = 1 + (G.k0 - 1) * (1 - u) * (1 - u)
      G.rot += dt * 0.6
      if (u >= 1) (G.state = 'spin'), (G.st = 0)
      return
    }
    if (G.state === 'spin') {
      // whirl round, and end with the gap at the top: up is the one way out
      // a ship can always fly, whatever corner the ring has it in
      if (G.st === 0) {
        G.rot0 = G.rot
        G.rot1 = -Math.PI / 2 - G.gapAt * G.step
        while (G.rot1 < G.rot + 1.4) G.rot1 += TAU
      }
      G.st += dt
      const u = Math.min(1, G.st / G.spin)
      G.rot = G.rot0 + (G.rot1 - G.rot0) * u * u * (3 - 2 * u)
      if (G.st > G.spin) {
        G.state = 'close'
        G.st = 0
        synth.tone({ type: 'sawtooth', from: 220, to: 520, dur: 0.6, vol: 0.05 }, 'swarm-ring', 0.3)
      }
    } else if (G.state === 'close') {
      G.st += dt
      G.k = Math.max(0.26, 1 - G.st / G.close)
      if (G.st > G.close + 0.35) {
        G.state = 'bolt'
        G.dir = p && p.x > G.cx ? -1 : 1
      }
    }
  },

  // a spiral's eye opens, then pours out arms of bugs that wheel outward
  spiral(G, g, dt) {
    if (G.warm > 0) {
      G.warm -= dt
      return
    }
    G.rot += dt * G.turn
    if (G.emit > 0 && (G.next -= dt) <= 0) {
      G.next += G.every
      for (let a = 0; a < G.arms && G.emit > 0; a++) {
        G.emit--
        const e = hatch(g, G.cx, G.cy, { swarm: true, m: 'path', grp: G, pal: G.pals[a % G.pals.length], jx: 0, jy: 0, a0: G.rot + (a * TAU) / G.arms })
        if (e) G.at(e, 0, g)
      }
    }
  },
}

// ---------------------------------------------------------------- patterns

// A flock: a dozen-odd bugs that keep loose formation round a leader.
//   swoop  dips down through the field in a U and out the far side
//   dive   comes down, weaves overhead, then dives down a lane it shows first
export function flock(g, { style = 'dive', n = 12, pal = (Math.random() * PALS.length) | 0, x, hy, from } = {}) {
  const W = g.W
  const G = addGroup({ kind: 'flock', style, pal, spread: 1, ph: rand(0, TAU), hold: 3 })
  if (style === 'swoop') {
    const dir = Math.random() < 0.5 ? 1 : -1
    G.x0 = dir > 0 ? rand(-40, W * 0.15) : rand(W * 0.85, W + 40)
    G.x1 = dir > 0 ? rand(W * 0.85, W + 40) : rand(-40, W * 0.15)
    G.depth = rand(g.H * 0.36, g.H * 0.6)
    G.dur = rand(4.6, 5.6)
    G.x = G.x0
    G.y = -70
  } else {
    G.state = 'in'
    G.hx = x ?? rand(W * 0.2, W * 0.8)
    G.hy = hy ?? rand(110, g.H * 0.3)
    G.x = from ? from.x : G.hx + rand(-80, 80)
    G.y = from ? from.y : -80
    G.hover = rand(1.6, 2.6)
    G.revT = 0.8
    G.fast = 470
  }
  for (let i = 0; i < n; i++) {
    // a loose sunflower of spots, so the flock is round but never a grid
    const a = i * 2.4
    const r = 12 * Math.sqrt(i + 0.5)
    const sx = from ? from.x + rand(-20, 20) : G.x + Math.cos(a) * r * 2
    const sy = from ? from.y + rand(-10, 10) : G.y - 30 - Math.abs(Math.sin(a)) * r * 2
    hatch(g, sx, sy, { swarm: true, m: 'flock', grp: G, pal, ox: Math.cos(a) * r * 1.5, oy: Math.sin(a) * r * 1.1, k: rand(2.6, 5.5) })
  }
  return G
}

// A river: a long stream of bugs down one path, two or three abreast.
//   side   across the top half, waving
//   low    across the ships' own half: warned about first at the edge
//   snake  down from the top, slithering side to side
//   swoop  a U-bend that dips into the ships' half and back out
export function river(g, { style = 'side', n = 24, pal = (Math.random() * PALS.length) | 0, dir = Math.random() < 0.5 ? 1 : -1, y } = {}) {
  const W = g.W
  const H = g.H
  const G = addGroup({ kind: 'path', style, pal, emit: n, next: 0, wide: 2, jit: 10, rot: 0, turn: 0, dir, hold: 2, warn: 0 })
  if (style === 'side' || style === 'low') {
    const low = style === 'low'
    G.y0 = y ?? (low ? rand(g.playerTop() + 70, H - 110) : rand(100, H * 0.4))
    G.v = low ? 250 : rand(210, 260)
    G.amp = low ? 26 : rand(35, 70)
    G.f = low ? 2 : rand(1.8, 2.6)
    G.every = low ? 0.16 : 0.13
    G.wide = low ? 1 : 2
    G.warn = low ? 1.6 : 0
    G.ph = rand(0, TAU)
    G.at = atSide
  } else if (style === 'snake') {
    G.x0 = rand(W * 0.3, W * 0.7)
    G.amp = Math.min(W * 0.22, 230)
    G.v = 150
    G.f = 1.2
    G.every = 0.16
    G.at = atSnake
  } else {
    G.x0 = dir > 0 ? -30 : W + 30
    G.x1 = dir > 0 ? W + 30 : -30
    G.depth = rand(H * 0.55, H * 0.66)
    G.dur = 4.4
    G.every = 0.14
    G.at = atSwoop
  }
  return G
}

function atSide(e, t, g) {
  const G = e.grp
  e.x = (G.dir > 0 ? -30 : g.W + 30) + G.dir * G.v * t + e.jx
  e.y = G.y0 + G.amp * Math.sin(t * G.f + G.ph) + e.jy
  if (t > 1 && (e.x < -60 || e.x > g.W + 60)) e.gone = true
}

function atSnake(e, t, g) {
  const G = e.grp
  e.x = G.x0 + G.amp * Math.sin(t * G.f) + e.jx
  e.y = -30 + G.v * t + e.jy
}

function atSwoop(e, t, g) {
  const G = e.grp
  const u = t / G.dur
  e.x = G.x0 + (G.x1 - G.x0) * u + e.jx
  e.y = -40 + (G.depth + 40) * Math.sin(Math.PI * u) + e.jy
  if (u > 1) e.gone = true
}

// A spiral: an eye opens in the sky and pours out wheeling arms of bugs.
export function spiral(g, { x = g.W / 2, y = 200, arms = 3, dur = 3.4, every = 0.17, pals, warm = 1.3, turn = 1.1 } = {}) {
  const per = Math.ceil(dur / every)
  return addGroup({
    kind: 'spiral',
    cx: x,
    cy: y,
    arms,
    emit: per * arms,
    every,
    next: 0,
    rot: rand(0, TAU),
    turn,
    warm,
    warm0: warm,
    pals: pals ?? [(Math.random() * PALS.length) | 0],
    at: atSpiral,
    hold: warm + 1,
  })
}

function atSpiral(e, t, g) {
  const G = e.grp
  const r = 16 + 92 * t
  const a = e.a0 + (2.2 * t) / (1 + t * 0.45)
  e.x = G.cx + r * Math.cos(a)
  e.y = G.cy + r * Math.sin(a) * 0.86
  if (r > 260 && (e.x < -40 || e.x > g.W + 40 || e.y < -40 || e.y > g.H + 40)) e.gone = true
}

// A wall: rows of bugs right across the field coming slowly down, with a
// gap or two to fly through. The rows line up, so a ship that holds its
// ground and keeps firing blasts a lane of its own straight through.
export function wall(g, { rows = 2, gaps = 2, pal = (Math.random() * PALS.length) | 0, vy = 88 } = {}) {
  const W = g.W
  const G = addGroup({ kind: 'wall', vy, hold: 2 })
  const gap = 170
  const step = 44
  const holes = []
  // gaps well apart, and never hard against the walls of the screen
  for (let tries = 0; holes.length < gaps && tries < 40; tries++) {
    const h = rand(gap * 0.5 + 30, W - gap * 0.5 - 30)
    if (holes.every((o) => Math.abs(o - h) > gap * 2.2)) holes.push(h)
  }
  for (let r = 0; r < rows; r++) {
    for (let x = 22; x < W - 10; x += step) {
      if (holes.some((h) => Math.abs(x - h) < gap / 2)) continue
      hatch(g, x, -30 - r * 38, { swarm: true, m: 'wall', grp: G, pal, x0: x })
    }
  }
  return G
}

// A ring: bugs close in from every side to circle a ship, spin round it, and
// then tighten. There's always a gap, and the ring stops following once it
// starts to tighten, so flying out through the gap (or blasting a new one)
// always works.
export function ring(g, p, { n = 14, gapN = 3, pal = (Math.random() * PALS.length) | 0 } = {}) {
  const W = g.W
  const H = g.H
  if (!p) return null
  const cx = clamp(p.x, 120, W - 120)
  const cy = clamp(p.y, g.playerTop() + 40, H - 100)
  const rx = Math.min(190, W * 0.26)
  const ry = 140
  // start far enough out that the whole ring is off screen
  const k0 = Math.max((cy + 60) / ry, (cx + 60) / rx, (W - cx + 60) / rx, 2.5)
  const G = addGroup({ kind: 'ring', p, cx, cy, rx, ry, k: k0, k0, rot: rand(0, TAU), step: TAU / n, state: 'gather', gather: 1.6, spin: 2.1, close: 2.7, hold: 2, pal })
  const g0 = (Math.random() * n) | 0
  for (let i = 0; i < n; i++) {
    if ((i - g0 + n) % n < gapN) continue
    const a = G.rot + i * G.step
    hatch(g, cx + Math.cos(a) * rx * k0, cy + Math.sin(a) * ry * k0, { swarm: true, m: 'ring', grp: G, pal, slot: i })
  }
  G.gapAt = g0 + (gapN - 1) / 2
  return G
}

// Rain: loose bugs falling from the sky, drifting toward the nearest ship.
export function rain(g, n = 1, pal) {
  for (let i = 0; i < n; i++) {
    const e = hatch(g, rand(30, g.W - 30), rand(-70, -25), { swarm: true, m: 'rain', pal: pal ?? (Math.random() * PALS.length) | 0, vx: 0, vy: rand(105, 170), home: rand(12, 34) })
    if (!e) return
  }
}

// A clutch of hatchlings bursting out of something, then falling as rain.
export function burst(g, x, y, n, pal, { spread = 1, down = 1 } = {}) {
  for (let i = 0; i < n; i++) {
    const a = Math.PI / 2 + (i - (n - 1) / 2) * 0.45 * spread + rand(-0.15, 0.15)
    const sp = rand(140, 220)
    const e = hatch(g, x + rand(-6, 6), y + rand(-4, 4), { swarm: true, m: 'pop', pal, vx: Math.cos(a) * sp * 1.3, vy: Math.sin(a) * sp * down, home: rand(20, 40) })
    if (!e) return
  }
}

// ---------------------------------------------------------------- the swarmlet

function updateSwarmlet(e, dt, g) {
  const px = e.x
  const G = e.grp
  if (G) G.live++
  switch (e.m) {
    case 'flock': {
      if (G.done && G.style === 'swoop') {
        // the leader is out the far side: everyone follows it up and away
        e.m = 'leave'
        e.vx = (G.x1 > G.x0 ? 1 : -1) * 140
        e.vy = -240
        break
      }
      if (G.state === 'rev') e.x += Math.sin(g.time * 50 + e.seed * 7) * 70 * dt
      const tx = G.x + e.ox * G.spread + Math.sin(g.time * 2.3 + e.seed) * 8
      const ty = G.y + e.oy * G.spread + Math.cos(g.time * 2.9 + e.seed) * 6
      const k = Math.min(1, dt * e.k)
      e.x += (tx - e.x) * k
      e.y += (ty - e.y) * k
      break
    }
    case 'path':
      G.at(e, e.t, g)
      break
    case 'wall':
      e.y += G.vy * dt
      e.x = e.x0 + Math.sin(e.t * 2.2 + e.seed) * 5
      break
    case 'ring': {
      if (G.state === 'bolt') {
        e.m = 'leave'
        e.vx = G.dir * rand(380, 470)
        e.vy = rand(-90, 40)
        break
      }
      const a = G.rot + e.slot * G.step
      const tx = G.cx + Math.cos(a) * G.rx * G.k
      const ty = G.cy + Math.sin(a) * G.ry * G.k
      const k = Math.min(1, dt * 12)
      e.x += (tx - e.x) * k
      e.y += (ty - e.y) * k
      break
    }
    case 'pop': {
      const k = Math.max(0, 1 - dt * 2.6)
      e.vx *= k
      e.vy = e.vy * k + 260 * dt
      e.x += e.vx * dt
      e.y += e.vy * dt
      if (e.t > 0.7) {
        e.m = 'rain'
        e.vy = Math.max(e.vy, rand(110, 150))
      }
      break
    }
    case 'rain': {
      e.y += e.vy * dt
      // lean toward the nearest ship while still up high, then fall straight:
      // a ship's own lasers keep the lane above it clear
      const p = e.y < g.H * 0.3 ? g.nearestPlayer(e.x, e.y) : null
      const want = p ? clamp((p.x - e.x) * 0.6, -e.home, e.home) : e.vx * 0.98
      e.vx += (want - e.vx) * Math.min(1, dt * 2)
      e.x += e.vx * dt
      break
    }
    case 'leave':
      e.x += e.vx * dt
      e.y += e.vy * dt
      break
  }
  if (dt > 0) e.tilt += (clamp((e.x - px) / dt / 700, -0.32, 0.32) - e.tilt) * Math.min(1, dt * 8)
  // keepOffscreen is on (a ring gathers from off screen, rain and walls start
  // above it), so this is where bugs that have left are let go
  if (e.m === 'ring') return
  if (e.y > g.H + 50 || e.t > 40) e.gone = true
  else if (e.m === 'leave' && (e.y < -60 || e.x < -60 || e.x > g.W + 60)) e.gone = true
}

const frameOf = (g, e) => ((g.time * 22 + e.seed * 3) | 0) % FRAMES

export const swarmlet = {
  hp: 1,
  r: 13,
  score: 0, // tally() scores it, without a pop-up per bug
  light: '#ffe23d',
  boom: 0.32,
  drop: 0, // the tally drops firepower instead
  keepOffscreen: true,
  // dozens die a second, so a quick fizz of sparks stands in for the full
  // explosion (smoke, glow and shock ring) that would choke the particle cap
  pop(e, g) {
    g.sparks(e.x, e.y, PALS[e.pal]?.light ?? '#ffe23d', 5)
    g.sparks(e.x, e.y, '#ffffff', 2)
    g.sfx.pop(0.35)
  },
  update: updateSwarmlet,
  draw(e, g, ctx) {
    stampBug(ctx, bugSprite('swarmlet', e.pal, tiltIndex(e.tilt), frameOf(g, e)), e.x, e.y)
  },
  onDeath(e, g, owner) {
    tally(g, e, owner, 10)
  },
}

// ---------------------------------------------------------------- the spitter

// The one small bug that shoots: it drops in to a perch, sways, and spits
// single shots at the nearest ship. Its stinger glows for a good half second
// before each one.
const SPIT_WARN = 0.65

export function spitter(g, x, hy) {
  return g.spawn('swarmspitter', x, -40, { swarm: false, state: 'in', hy: hy ?? rand(90, g.H * 0.36), fireT: rand(1.2, 2), charge: 0, shots: 0 })
}

export const swarmspitter = {
  hp: 2,
  r: 15,
  score: 0,
  light: '#ff5a4f',
  boom: 0.6,
  drop: 0,
  keepOffscreen: true,
  update(e, dt, g) {
    const px = e.x
    if (e.state === 'in') {
      e.y += Math.max(60, (e.hy - e.y) * 2.2) * dt
      if (e.y >= e.hy - 3) e.state = 'perch'
    } else if (e.state === 'perch') {
      e.x = clamp(e.x + Math.sin(e.t * 1.3 + e.seed) * 90 * dt, 30, g.W - 30)
      e.y = e.hy + Math.sin(e.t * 3 + e.seed) * 6
      e.fireT -= dt * g.mission.fire
      e.charge = clamp(1 - e.fireT / SPIT_WARN, 0, 1)
      if (e.fireT <= 0) {
        g.aimed(e.x, e.y + 14, 1, 0, 235, '#ff5a4f', g.nearestPlayer(e.x, e.y))
        synth.tone({ type: 'square', from: 520, to: 260, dur: 0.08, vol: 0.05 }, 'swarm-spit', 0.08)
        e.fireT = rand(2.2, 3.1)
        e.charge = 0
        if (++e.shots >= 3) e.state = 'out'
      }
    } else {
      e.y -= 170 * dt
      if (e.y < -40) e.gone = true
    }
    if (dt > 0) e.tilt += (clamp((e.x - px) / dt / 500, -0.32, 0.32) - e.tilt) * Math.min(1, dt * 8)
  },
  draw(e, g, ctx) {
    const spr = bugSprite('spitter', 0, tiltIndex(e.tilt), frameOf(g, e))
    stampBug(ctx, spr, e.x, e.y)
    if (e.flash > 0) {
      ctx.globalAlpha = Math.min(1, e.flash) * 0.8
      stampBug(ctx, whiteOf(spr), e.x, e.y)
      ctx.globalAlpha = 1
    }
  },
  onDeath(e, g, owner) {
    tally(g, e, owner, 50)
  },
}

// ---------------------------------------------------------------- the beetle

// The brood beetle: tough, slow, and full of eggs. It hovers up top laying
// clutches of swarmlets (its belly glows first) and now and then fires a
// three-shot spread (its eyes glow first). Popping one always drops firepower.
const LAY_WARN = 0.75
const SHOT_WARN = 0.8

export function beetle(g, x) {
  return g.spawn('swarmbeetle', x ?? rand(g.W * 0.2, g.W * 0.8), -60, {
    hp: g.numPlayers === 2 ? 14 : 10,
    state: 'in',
    hy: rand(110, 190),
    layT: rand(1.4, 2.2),
    shotT: rand(2.6, 3.4),
    lay: 0,
    aim: 0,
    life: 14,
    pal: (Math.random() * PALS.length) | 0,
  })
}

export const swarmbeetle = {
  hp: 10,
  r: 32,
  score: 400,
  light: '#2fc7b4',
  boom: 1.3,
  drop: 0,
  keepOffscreen: true,
  update(e, dt, g) {
    const px = e.x
    if (e.state === 'in') {
      e.y += Math.max(45, (e.hy - e.y) * 1.8) * dt
      if (e.y >= e.hy - 3) e.state = 'hold'
    } else if (e.state === 'hold') {
      e.x = clamp(e.x + Math.sin(e.t * 0.7 + e.seed) * 80 * dt, 60, g.W - 60)
      e.y = e.hy + Math.sin(e.t * 1.6) * 8
      e.layT -= dt
      e.lay = clamp(1 - e.layT / LAY_WARN, 0, 1)
      if (e.layT <= 0) {
        burst(g, e.x, e.y + 14, 5, e.pal)
        synth.noise({ dur: 0.25, vol: 0.12, freq: 900, to: 200 }, 'swarm-lay', 0.15)
        e.layT = rand(2.8, 3.4)
        e.lay = 0
      }
      e.shotT -= dt * g.mission.fire
      e.aim = clamp(1 - e.shotT / SHOT_WARN, 0, 1)
      if (e.shotT <= 0) {
        g.aimed(e.x, e.y + 18, 3, 0.22, 205, '#5af0dc', g.nearestPlayer(e.x, e.y))
        e.shotT = rand(3.6, 4.4)
        e.aim = 0
      }
      if ((e.life -= dt) <= 0) e.state = 'out'
    } else {
      e.y -= 120 * dt
      e.lay = e.aim = 0
      if (e.y < -80) e.gone = true
    }
    if (dt > 0) e.tilt += (clamp((e.x - px) / dt / 500, -0.32, 0.32) - e.tilt) * Math.min(1, dt * 6)
  },
  draw(e, g, ctx) {
    const spr = bugSprite('beetle', 0, tiltIndex(e.tilt * 0.6), ((g.time * 18 + e.seed * 3) | 0) % FRAMES)
    stampBug(ctx, spr, e.x, e.y)
    if (e.flash > 0) {
      ctx.globalAlpha = Math.min(1, e.flash) * 0.7
      stampBug(ctx, whiteOf(spr), e.x, e.y)
      ctx.globalAlpha = 1
    }
    // the health it has left, as a row of pips
    const hp0 = g.numPlayers === 2 ? 14 : 10
    if (e.hp < hp0) {
      ctx.fillStyle = 'rgba(10,6,30,0.6)'
      ctx.fillRect(e.x - 22, e.y - 50, 44, 5)
      ctx.fillStyle = '#5af0dc'
      ctx.fillRect(e.x - 22, e.y - 50, (44 * Math.max(0, e.hp)) / hp0, 5)
    }
  },
  onDeath(e, g, owner) {
    tally(g, e, owner, 0)
    g.dropBubble(e.x, e.y, firepower())
  },
}

// ---------------------------------------------------------------- telegraphs

// Glows under the bugs that are about to do something: drawn behind the
// enemies in one 'lighter' pass, so a hundred bugs don't each switch blend
// modes.
export function drawTells(g, ctx) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (const e of g.enemies) {
    if (e.m === 'flock' && e.grp.state === 'rev') stampGlow(ctx, '#ff5a6a', e.x, e.y, 26, 0.55 + 0.35 * Math.sin(g.time * 30))
    else if (e.type === 'swarmspitter' && e.charge > 0) stampGlow(ctx, '#ff5a4f', e.x, e.y + 14, 8 + e.charge * 18, e.charge)
    else if (e.type === 'swarmbeetle') {
      if (e.lay > 0) stampGlow(ctx, '#d4ff5a', e.x, e.y + 10, 16 + e.lay * 26, e.lay * (0.7 + 0.3 * Math.sin(g.time * 26)))
      if (e.aim > 0) for (const d of [-1, 1]) stampGlow(ctx, '#ff3b6b', e.x + d * 8, e.y - 6, 6 + e.aim * 12, e.aim)
    }
  }
  ctx.restore()

  for (const G of groups) {
    if (G.kind === 'flock' && G.state === 'rev') drawLane(g, ctx, G)
    else if (G.kind === 'ring' && (G.state === 'gather' || G.state === 'close')) drawRingGuide(g, ctx, G)
    else if (G.kind === 'spiral' && (G.warm > 0 || G.emit > 0)) drawEye(g, ctx, G)
  }
}

// The lane a flock is about to dive down.
function drawLane(g, ctx, G) {
  const a = Math.min(1, G.st / 0.2) * (0.5 + 0.3 * Math.sin(g.time * 24))
  const w = 110
  const grad = ctx.createLinearGradient(G.lane - w / 2, 0, G.lane + w / 2, 0)
  grad.addColorStop(0, 'rgba(255,90,106,0)')
  grad.addColorStop(0.5, `rgba(255,90,106,${0.22 * a})`)
  grad.addColorStop(1, 'rgba(255,90,106,0)')
  ctx.fillStyle = grad
  ctx.fillRect(G.lane - w / 2, G.y, w, g.H - G.y)
  ctx.strokeStyle = `rgba(255,140,150,${0.6 * a})`
  ctx.lineWidth = 2
  ctx.setLineDash([10, 10])
  ctx.lineDashOffset = -g.time * 160
  ctx.beginPath()
  ctx.moveTo(G.lane, G.y + 30)
  ctx.lineTo(G.lane, g.H)
  ctx.stroke()
  ctx.setLineDash([])
}

// Where a ring is closing in, with the way out marked.
function drawRingGuide(g, ctx, G) {
  const col = PALS[G.pal].hull[1]
  const k = G.state === 'gather' ? 1 : G.k
  const a = G.state === 'gather' ? Math.min(1, G.t / 0.4) * 0.5 : 0.35 + 0.2 * Math.sin(g.time * 10)
  ctx.save()
  ctx.globalAlpha = a
  ctx.strokeStyle = col
  ctx.lineWidth = 2
  ctx.setLineDash([6, 9])
  ctx.lineDashOffset = g.time * 40
  ctx.beginPath()
  ctx.ellipse(G.cx, G.cy, G.rx * k, G.ry * k, 0, 0, TAU)
  ctx.stroke()
  ctx.setLineDash([])
  if (G.state === 'close') {
    // an arrow out through the gap
    const ang = G.rot + G.gapAt * G.step
    const c = Math.cos(ang)
    const s = Math.sin(ang)
    const r0 = 0.55 * k
    const r1 = 1.25 * k
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(g.time * 12)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    const x0 = G.cx + c * G.rx * r0
    const y0 = G.cy + s * G.ry * r0
    const x1 = G.cx + c * G.rx * r1
    const y1 = G.cy + s * G.ry * r1
    const h = Math.atan2(y1 - y0, x1 - x0)
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.moveTo(x1 + Math.cos(h + 2.5) * 12, y1 + Math.sin(h + 2.5) * 12)
    ctx.lineTo(x1, y1)
    ctx.lineTo(x1 + Math.cos(h - 2.5) * 12, y1 + Math.sin(h - 2.5) * 12)
    ctx.stroke()
  }
  ctx.restore()
}

// The eye of a spiral: a whirlpool that opens before the bugs pour out.
function drawEye(g, ctx, G) {
  const open = G.warm > 0 ? 1 - G.warm / G.warm0 : 1
  const fade = G.emit > 0 ? 1 : 0
  const col = PALS[G.pals[0]].hull[1]
  ctx.save()
  ctx.translate(G.cx, G.cy)
  ctx.globalCompositeOperation = 'lighter'
  stampGlow(ctx, col, 0, 0, 30 + open * 50, 0.6 * open * fade)
  ctx.globalCompositeOperation = 'source-over'
  ctx.strokeStyle = col
  ctx.lineWidth = 3
  ctx.globalAlpha = 0.7 * open
  for (let i = 0; i < 3; i++) {
    const a0 = -g.time * 4 + (i * TAU) / 3
    ctx.beginPath()
    for (let s = 0; s <= 14; s++) {
      const u = s / 14
      const r = 6 + u * 40 * open
      const a = a0 + u * 3
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.86)
    }
    ctx.stroke()
  }
  ctx.restore()
}
