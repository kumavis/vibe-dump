// The Dark Nebula: saucers in thick fog. Each ship carries a pool of light
// nearly four hundred across; past that, a saucer is only a pair of blinking
// lights until it comes close. Bullets are always drawn over the fog, and
// everything glows before it fires, so you can always see what's coming at
// you even when you can't see who sent it.
//
// Most of what's out there is lurkers (lurker.js): stealth saucers that cloak,
// creep about, and come in squads and side ambushes. The classic formations
// fill in round them.
//
// Luminous crystals drift down now and then: catch one and your light grows
// big for a while. Crystal light shows the outline of any cloaked lurker
// anywhere near you, and holds back the Gloomtopus's ink. The fog rolls in
// during the intro, stays for the boss, and lifts once it's beaten.

import { SAUCERS } from '../../art.js'
import { synth } from '../../audio.js'
import { drawFog, clearAt } from './fog.js'
import { drawCrystal, drawNebulaIcon, stamp } from './draw.js'
import { lurkerLight, lurkerHint, resetLurkers, updateLurkers, drawAmbushWarnings, solo, squad, ambush, shroud } from './lurker.js'
import { octoLight, octoTells, drawOctoOverFog } from './octopus.js'

const LENGTH = 76 // seconds of waves before the Gloomtopus
const LIGHT = 185 // a ship's pool of light
const BIG_LIGHT = 300 // …with a crystal
const BOOST = 12 // seconds a crystal lasts
const CRYSTAL = '#7dfcff'

let t = 0
let step = 0
let fog = 0
let crystals = []
let crystalT = 0
let boost = [0, 0]
let flashes = []
let prev = []
let motes = []
let lights = []
let sights = []
let ink = { k: 0, x: 0, y: 0, age: 9 }
let told = {}

// ---------------------------------------------------------------- waves

const side = () => (Math.random() < 0.5 ? -1 : 1)

// Lurkers stay a long while, so the waves never put more than a handful up
// at once: past that the fog is just a wall of pink bullets.
const lurkCap = (g) => (g.numPlayers === 2 ? 6 : 5) - g.enemies.filter((e) => e.type === 'nebulaLurker').length

const solos = (g, n) => {
  n = Math.min(n, lurkCap(g))
  for (let i = 0; i < n; i++) {
    const x0 = (g.W * (i + 0.5 + g.rand(-0.2, 0.2))) / n
    g.later(i * 0.7, () => solo(g, x0, g.rand(130, 250)))
  }
}

const squads = (g, n, cx) => {
  n = Math.min(n, lurkCap(g))
  if (n >= 2) squad(g, n, cx)
  else solos(g, n)
}

// from one side, or both at once when `s` is 0
const ambushes = (g, s, n) => {
  const room = lurkCap(g)
  if (s) return ambush(g, s, Math.min(n, room))
  const half = Math.min(n, Math.floor(room / 2))
  if (half > 0) {
    ambush(g, -1, half)
    ambush(g, 1, half)
  } else if (room > 0) ambush(g, side(), 1)
}

// What happens when, in seconds from the start of the main phase. Lurkers
// from the first moments, then squads, ambushes and the Shroud, with the
// classic formations in between to keep the guns busy.
const TIMELINE = [
  [0.6, (g) => rain(g, 4)],
  [3.5, (g) => solos(g, 2)],
  [8.5, (g) => snake(g)],
  [10, (g) => crystal(g)],
  [12, (g) => ambushTip(g, side(), 2)],
  [17, (g) => squads(g, 3, g.rand(g.W * 0.3, g.W * 0.7))],
  [22, (g) => (sweep(g), solos(g, 1))],
  [26, (g) => vee(g)],
  [28.5, (g) => crystal(g)],
  [29.5, (g) => ambushes(g, side(), 3)],
  [34.5, (g) => squads(g, 4)],
  [39.5, (g) => divers(g, 2)],
  [42.5, (g) => ambushes(g, 0, 2)],
  [47, (g) => crystal(g)],
  [48, (g) => (shroud(g, g.rand(g.W * 0.3, g.W * 0.7)), solos(g, 1))],
  [54, (g) => (snake(g), g.later(1.4, () => sweep(g)))],
  [58, (g) => squads(g, 5)],
  [63, (g) => (gunners(g), ambushes(g, side(), 2))],
  [65.5, (g) => crystal(g)],
  [68, (g) => ambushes(g, 0, 3)],
  [72.5, (g) => (rain(g, 4), squads(g, 3))],
]

function rain(g, n) {
  for (let i = 0; i < n; i++) g.later(i * 0.45, () => g.spawn('scout', g.rand(60, g.W - 60), -40, { path: 'fall', speed: g.rand(125, 170) }))
}

function snake(g) {
  const x0 = g.rand(g.W * 0.3, g.W * 0.7)
  const amp = Math.min(g.W * 0.28, 260)
  for (let i = 0; i < 6; i++) g.later(i * 0.3, () => g.spawn('scout', x0, -40, { path: 'sine', x0, amp, freq: 1.5, speed: 130 }))
}

function sweep(g) {
  const dir = side()
  const y0 = g.rand(170, 250)
  for (let i = 0; i < 6; i++) g.later(i * 0.38, () => g.spawn('scout', dir > 0 ? -40 : g.W + 40, y0, { path: 'sweep', vx: dir * 210, y0, entered: true }))
}

function vee(g) {
  const cx = g.rand(g.W * 0.3, g.W * 0.7)
  for (const [ox, oy] of [[0, 0], [-60, -50], [60, -50], [-120, -100], [120, -100]]) {
    g.spawn('zigzag', cx + ox, -40 + oy, { path: 'zig', speed: 110, vx: ox < 0 ? -150 : 150, zt: 0 })
  }
}

function divers(g, n) {
  for (let i = 0; i < n; i++) g.later(i * 0.55, () => g.spawn('diver', (g.W * (i + 1)) / (n + 1), -40, { path: 'dive', state: 'enter', hoverY: g.rand(140, 220) }))
}

function gunners(g) {
  for (const fx of [0.28, 0.72]) g.spawn('gunner', g.W * fx, -50, { path: 'gun', hoverY: g.rand(150, 210), life: 8, fireT: g.rand(1.2, 2) })
}

// the first ambush gets a word of warning
function ambushTip(g, s, n) {
  ambushes(g, s, n)
  if (told.ambush) return
  told.ambush = true
  g.popText(s < 0 ? g.W * 0.28 : g.W * 0.72, g.playerTop() - 20, 'Sneak attack!', '#ffd6f4', 22, 1.6)
}

function crystal(g) {
  const x = g.rand(90, g.W - 90)
  crystals.push({ x, x0: x, y: -50, t: g.rand(0, 6) })
  if (told.crystal) return
  told.crystal = true
  g.later(1.2, () => g.popText(g.W / 2, g.H * 0.42, 'Catch the crystal for big light!', CRYSTAL, 20, 2.2))
}

// ---------------------------------------------------------------- lights

const isOcto = (b) => b && b.kind === 'octopus'

// Everything that parts the fog this frame: the ships first (with a rim in
// their team colour, or crystal blue while they've got big light), then the
// crystals, saucers that were just hit or blew up, and whatever the lurkers
// and the Gloomtopus are lighting up. Ink shrinks the ships' light, though
// less with a crystal.
function gatherLights(g) {
  lights = []
  sights = []
  for (const p of g.players) {
    if (!p.alive) continue
    const k = Math.min(1, boost[p.id] / 1.5)
    const r = (LIGHT + (BIG_LIGHT - LIGHT) * k) * (1 - ink.k * (0.5 - 0.25 * k))
    lights.push({ x: p.x, y: p.y - 20, r, a: 1, rim: k > 0.3 ? CRYSTAL : p.pal.main })
    // crystal light shows cloaked lurkers well past the pool itself
    if (k > 0.05) sights.push({ x: p.x, y: p.y - 20, r: r * 1.75, k })
  }
  for (const c of crystals) lights.push({ x: c.x, y: c.y, r: 95, a: 0.75, rim: CRYSTAL })
  for (const f of flashes) lights.push({ x: f.x, y: f.y, r: f.r, a: f.life / f.max })
  for (const e of g.enemies) {
    const L = e.type === 'nebulaLurker' ? lurkerLight(e) : null
    if (L) lights.push(L)
    // a saucer that's been hit shows itself for a moment, so shooting blind
    // into the murk tells you you're on target
    else if (e.nebLit > 0) lights.push({ x: e.x, y: e.y, r: 120, a: Math.min(1, e.nebLit * 2.5) })
  }
  if (isOcto(g.boss)) {
    const L = octoLight(g.boss, ink.k)
    if (L) lights.push(L)
  }
  return lights
}

// How much crystal light is on (x, y): any shows a cloaked lurker's shape.
function sightAt(x, y) {
  let best = 0
  for (const s of sights) if ((x - s.x) ** 2 + (y - s.y) ** 2 < s.r * s.r) best = Math.max(best, s.k)
  return best
}

// The game's own "can it shoot?" test, so the warning glow only shows for a
// saucer that's really about to fire.
const canFire = (e, g) => g.canFire(e)

// What a formation saucer shows through the fog: its two outer running
// lights, blinking out of step, and a glow building under it just before it
// shoots.
function saucerHint(ctx, e, g, clear) {
  const light = SAUCERS[e.type]?.light ?? '#ffffff'
  const tt = g.time * 5 + e.seed * 3
  const hidden = 1 - clear
  if (hidden > 0.05) {
    for (const d of [-1, 1]) {
      const on = Math.sin(tt + d * 1.4) > 0.2
      stamp(ctx, light, e.x + d * e.r * 0.8, e.y + e.r * 0.1, on ? 10 : 5, hidden * (on ? 0.9 : 0.3))
    }
  }
  if (canFire(e, g)) {
    const left = e.fireT / Math.max(0.1, g.mission.fire)
    if (left < 0.6) {
      const k = 1 - left / 0.6
      stamp(ctx, light, e.x, e.y + 12, 8 + 24 * k, 0.35 + 0.6 * k)
    }
  }
  if (e.path === 'dive' && e.state === 'aim') {
    // lining up a dive: a pulsing red glow
    const k = 0.6 + 0.4 * Math.sin(g.time * 20)
    stamp(ctx, '#ff4d4d', e.x, e.y + 10, 22 + 10 * k, 0.8 * k)
  }
}

// ---------------------------------------------------------------- the level

export const nebulaLevel = {
  setup(g) {
    t = 0
    step = 0
    fog = 0
    crystals = []
    crystalT = 10
    boost = [0, 0]
    flashes = []
    prev = []
    lights = []
    sights = []
    ink = { k: 0, x: 0, y: 0, age: 9 }
    told = {}
    resetLurkers()
    // for playtesting scripts: the crystals and how long each ship's big light
    // has left
    if (g.debug) window.__nebula = { get crystals() { return crystals }, get boost() { return boost } }
    // dust glinting in the fog, drifting down with it
    motes = []
    for (let i = 0; i < 46; i++) {
      motes.push({ u: Math.random(), v: Math.random(), s: 0.8 + Math.random() * 1.6, tw: Math.random() * 6, fall: 8 + Math.random() * 14, c: Math.random() < 0.3 ? '#ffd2f2' : '#d8e4ff' })
    }
  },

  start(g) {
    t = 0
    step = 0
    g.popText(g.W / 2, g.H * 0.4, 'Saucers hide in the fog!', '#e6dcff', 22, 2.2)
    g.later(2.4, () => g.popText(g.W / 2, g.H * 0.4, 'Pink glow? It is about to shoot!', '#ff9be6', 20, 2.4))
  },

  update(g, dt) {
    // the fog rolls in with the mission and lifts once it's won
    const want = g.phase === 'clear' || g.phase === 'victory' ? 0 : 1
    fog += (want - fog) * Math.min(1, dt * (want ? 1.2 : 0.7))
    updateLurkers(dt)

    // the ink belongs to the boss, but the fog keeps fading it out after
    // the boss is gone
    const b = g.boss
    if (isOcto(b) && !(b.dying > 0)) {
      ink.k = b.ink.k
      ink.x = b.ink.x
      ink.y = b.ink.y
      ink.age = b.ink.age
    } else {
      ink.k = Math.max(0, ink.k - dt * 1.2)
      ink.age += dt
    }

    // anything that blew up since last frame lights the fog for a moment
    for (const e of prev) if (e.dead) flashes.push({ x: e.x, y: e.y, r: 170, life: 0.5, max: 0.5 })
    prev = g.enemies
    for (const e of prev) e.nebLit = e.flash > 0.5 ? 0.6 : Math.max(0, (e.nebLit ?? 0) - dt)
    for (const f of flashes) f.life -= dt
    flashes = flashes.filter((f) => f.life > 0)

    for (let i = 0; i < boost.length; i++) boost[i] = Math.max(0, boost[i] - dt)

    // crystals: drift down, rocking; any ship that touches one gets big light
    for (const c of crystals) {
      c.t += dt
      c.y += 58 * dt
      c.x = g.clamp(c.x0 + Math.sin(c.t * 1.2) * 55, 30, g.W - 30)
      for (const p of g.alive()) {
        if (!c.dead && g.near(p.x, p.y, c.x, c.y, 62)) {
          c.dead = true
          boost[p.id] = BOOST
          g.sfx.bubble()
          ;[1319, 1760, 2093].forEach((f, i) => synth.tone({ type: 'sine', from: f, dur: 0.25, vol: 0.06, at: 0.1 + i * 0.07 }, 'neb-chime' + i, 0.05))
          g.splash(c.x, c.y, CRYSTAL)
          g.addScore(p.id, 150)
          g.popText(c.x, c.y - 34, told.sight ? 'Big light!' : 'Big light! Now you see them!', CRYSTAL, 20, 1.5)
          told.sight = true
        }
      }
      if (c.y > g.H + 50) c.dead = true
    }
    crystals = crystals.filter((c) => !c.dead)

    if (g.phase === 'boss') {
      if (!told.boss && b && !b.entering) {
        told.boss = true
        g.popText(g.W / 2, g.H * 0.58, 'Shoot its big head!', '#ffd84a', 22, 2.4)
      }
      if ((crystalT -= dt) <= 0) {
        crystal(g)
        crystalT = g.rand(13, 17)
      }
    }

    if (g.phase !== 'main') return
    t += dt
    while (step < TIMELINE.length && t >= TIMELINE[step][0]) TIMELINE[step++][1](g)
    if (step >= TIMELINE.length && t > LENGTH && (g.enemies.length === 0 || t > LENGTH + 8)) g.levelDone()
  },

  progress: () => Math.min(1, t / LENGTH),

  drawMid(g, ctx) {
    gatherLights(g)
    drawFog(ctx, g, lights, fog, ink)
    ctx.save()
    if (fog > 0.02) drawHints(g, ctx)
    for (const c of crystals) drawCrystal(ctx, c.x, c.y, g.time + c.t)
    const b = g.boss
    if (isOcto(b)) drawOctoOverFog(ctx, b, g)
    drawAmbushWarnings(ctx, g)
    ctx.restore()
  },

  icon(ctx, w, h) {
    drawNebulaIcon(ctx, w, h)
  },
}

function drawHints(g, ctx) {
  ctx.globalCompositeOperation = 'lighter'
  // glints of dust, faint, so the fog has a sparkle to it
  const W = g.W
  const H = g.H
  for (const m of motes) {
    const x = m.u * W + Math.sin(g.time * 0.3 + m.tw) * 24
    const y = (((m.v * H + g.time * m.fall) % H) + H) % H
    const a = (0.25 + 0.35 * Math.sin(g.time * 2 + m.tw * 3)) * fog * (1 - ink.k * 0.6)
    if (a <= 0.02) continue
    ctx.globalAlpha = a
    ctx.fillStyle = m.c
    ctx.fillRect(x - m.s / 2, y - m.s / 2, m.s, m.s)
  }

  // the hints that show through: blinks, eyes and warning glows
  for (const e of g.enemies) {
    const clear = Math.max(1 - fog, clearAt(e.x, e.y, lights))
    if (e.type === 'nebulaLurker') lurkerHint(ctx, e, g, clear, sights.length ? sightAt(e.x, e.y) : 0)
    else saucerHint(ctx, e, g, clear)
  }
  const b = g.boss
  if (isOcto(b) && !(b.dying > 0)) octoTells(ctx, b, g, Math.max(1 - fog, clearAt(b.x, b.y - 80, lights)), ink.k)
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
}
