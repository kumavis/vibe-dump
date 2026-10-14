// The Dark Nebula: saucer waves flown through thick fog. Each ship carries a
// pool of light nearly four hundred across; past that, a saucer is only a pair
// of blinking lights until it comes close. Bullets are always drawn over the
// fog, and every saucer glows for about half a second before it fires, so you
// can always see what's coming at you even when you can't see who sent it.
//
// Space fireflies drift down now and then: catch one and your light grows
// big for a while. The fog rolls in during the intro, stays for the Phantom,
// and lifts once it's beaten.

import { SAUCERS } from '../../art.js'
import { drawFog, clearAt } from './fog.js'
import { drawFirefly, drawNebulaIcon, stamp } from './draw.js'
import { lurkerLight, lurkerHint } from './lurker.js'
import { phantomLight, phantomTells, echoLight, echoHint } from './phantom.js'

const LENGTH = 62 // seconds of waves before the Phantom
const LIGHT = 185 // a ship's pool of light
const BIG_LIGHT = 300 // …with a firefly
const BOOST = 12 // seconds a firefly lasts
const FIREFLY = '#ffe65a'

let t = 0
let step = 0
let fog = 0
let flies = []
let flyT = 0
let boost = [0, 0]
let flashes = []
let prev = []
let motes = []
let lights = []
let tipped = false

// ---------------------------------------------------------------- waves

// What happens when, in seconds from the start of the main phase. Mostly the
// classic formations, retimed so each one has a moment to drift out of the
// fog before the next, with lurkers mixed in from early on.
const TIMELINE = [
  [0.8, (g) => rain(g, 5)],
  [6.5, (g) => snake(g)],
  [8, (g) => firefly(g)],
  [12, (g) => lurkers(g, 2)],
  [16, (g) => sweep(g)],
  [21, (g) => vee(g)],
  [26, (g) => divers(g, 2)],
  [27, (g) => firefly(g)],
  [30, (g) => (lurkers(g, 2), rain(g, 4))],
  [36, (g) => (snake(g), g.later(1.4, () => sweep(g)))],
  [42, (g) => gunners(g)],
  [46, (g) => firefly(g)],
  [47, (g) => lurkers(g, 3)],
  [51, (g) => (vee(g), divers(g, 2))],
  [56, (g) => snake(g)],
  [59, (g) => rain(g, 6)],
]

function rain(g, n) {
  for (let i = 0; i < n; i++) g.later(i * 0.5, () => g.spawn('scout', g.rand(60, g.W - 60), -40, { path: 'fall', speed: g.rand(120, 165) }))
}

function snake(g) {
  const x0 = g.rand(g.W * 0.3, g.W * 0.7)
  const amp = Math.min(g.W * 0.28, 260)
  for (let i = 0; i < 6; i++) g.later(i * 0.32, () => g.spawn('scout', x0, -40, { path: 'sine', x0, amp, freq: 1.5, speed: 125 }))
}

function sweep(g) {
  const dir = Math.random() < 0.5 ? 1 : -1
  const y0 = g.rand(170, 250)
  for (let i = 0; i < 6; i++) g.later(i * 0.4, () => g.spawn('scout', dir > 0 ? -40 : g.W + 40, y0, { path: 'sweep', vx: dir * 200, y0, entered: true }))
}

function vee(g) {
  const cx = g.rand(g.W * 0.3, g.W * 0.7)
  for (const [ox, oy] of [[0, 0], [-60, -50], [60, -50], [-120, -100], [120, -100]]) {
    g.spawn('zigzag', cx + ox, -40 + oy, { path: 'zig', speed: 105, vx: ox < 0 ? -150 : 150, zt: 0 })
  }
}

function divers(g, n) {
  for (let i = 0; i < n; i++) g.later(i * 0.6, () => g.spawn('diver', (g.W * (i + 1)) / (n + 1), -40, { path: 'dive', state: 'enter', hoverY: g.rand(140, 220) }))
}

function gunners(g) {
  for (const fx of [0.28, 0.72]) g.spawn('gunner', g.W * fx, -50, { path: 'gun', hoverY: g.rand(150, 210), life: 8, fireT: g.rand(1.4, 2.2) })
}

function lurkers(g, n) {
  for (let i = 0; i < n; i++) {
    const x0 = (g.W * (i + 0.5 + g.rand(-0.2, 0.2))) / n
    g.later(i * 0.8, () => g.spawn('nebulaLurker', x0, -40, { x0, hoverY: g.rand(130, 260) }))
  }
}

function firefly(g) {
  const x = g.rand(90, g.W - 90)
  flies.push({ x, x0: x, y: -30, t: g.rand(0, 6) })
}

// ---------------------------------------------------------------- lights

// Everything that parts the fog this frame: the ships first (with a rim in
// their team colour), then fireflies, saucers that were just hit or blew up,
// and whatever the lurkers and the Phantom are lighting up.
function gatherLights(g) {
  lights = []
  for (const p of g.players) {
    if (!p.alive) continue
    const k = Math.min(1, boost[p.id] / 1.5)
    lights.push({ x: p.x, y: p.y - 20, r: LIGHT + (BIG_LIGHT - LIGHT) * k, a: 1, rim: p.pal.main })
  }
  for (const f of flies) lights.push({ x: f.x, y: f.y, r: 80, a: 0.6 })
  for (const f of flashes) lights.push({ x: f.x, y: f.y, r: f.r, a: f.life / f.max })
  for (const e of g.enemies) {
    const L = e.type === 'nebulaLurker' ? lurkerLight(e) : e.type === 'phantomEcho' ? echoLight(e) : null
    if (L) lights.push(L)
    // a saucer that's been hit shows itself for a moment, so shooting blind
    // into the murk tells you you're on target
    else if (e.nebLit > 0) lights.push({ x: e.x, y: e.y, r: 120, a: Math.min(1, e.nebLit * 2.5) })
  }
  if (g.boss && g.boss.kind === 'phantom') {
    const L = phantomLight(g.boss)
    if (L) lights.push(L)
  }
  return lights
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
    flies = []
    flyT = 8
    boost = [0, 0]
    flashes = []
    prev = []
    lights = []
    tipped = false
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
    g.later(2.2, () => g.popText(g.W / 2, g.H * 0.4, 'Look for blinking lights', '#ffe23d', 20, 2.2))
  },

  update(g, dt) {
    // the fog rolls in with the mission and lifts once it's won
    const want = g.phase === 'clear' || g.phase === 'victory' ? 0 : 1
    fog += (want - fog) * Math.min(1, dt * (want ? 1.2 : 0.7))

    // anything that blew up since last frame lights the fog for a moment
    for (const e of prev) if (e.dead) flashes.push({ x: e.x, y: e.y, r: 170, life: 0.5, max: 0.5 })
    prev = g.enemies
    for (const e of prev) e.nebLit = e.flash > 0.5 ? 0.6 : Math.max(0, (e.nebLit ?? 0) - dt)
    for (const f of flashes) f.life -= dt
    flashes = flashes.filter((f) => f.life > 0)

    for (let i = 0; i < boost.length; i++) boost[i] = Math.max(0, boost[i] - dt)

    // fireflies: drift down in loops; any ship that touches one gets big light
    for (const f of flies) {
      f.t += dt
      f.y += 62 * dt
      f.x = g.clamp(f.x0 + Math.sin(f.t * 1.4) * 60, 30, g.W - 30)
      for (const p of g.alive()) {
        if (!f.dead && g.near(p.x, p.y, f.x, f.y, 60)) {
          f.dead = true
          boost[p.id] = BOOST
          g.sfx.bubble()
          g.splash(f.x, f.y, FIREFLY)
          g.addScore(p.id, 100)
          g.popText(f.x, f.y - 30, 'Big light!', FIREFLY, 20, 1.3)
        }
      }
      if (f.y > g.H + 40) f.dead = true
    }
    flies = flies.filter((f) => !f.dead)

    if (g.phase === 'boss') {
      if (!tipped && g.boss && !g.boss.entering) {
        tipped = true
        g.popText(g.W / 2, g.H * 0.58, 'Shoot the glowing eyes!', '#7dfcff', 22, 2.4)
      }
      if ((flyT -= dt) <= 0) {
        firefly(g)
        flyT = g.rand(14, 18)
      }
    }

    if (g.phase !== 'main') return
    t += dt
    while (step < TIMELINE.length && t >= TIMELINE[step][0]) TIMELINE[step++][1](g)
    if (step >= TIMELINE.length && t > LENGTH && (g.enemies.length === 0 || t > LENGTH + 6)) g.levelDone()
  },

  progress: () => Math.min(1, t / LENGTH),

  drawMid(g, ctx) {
    gatherLights(g)
    drawFog(ctx, g, lights, fog)
    ctx.save()
    if (fog > 0.02) drawHints(g, ctx)
    for (const f of flies) drawFirefly(ctx, f.x, f.y, g.time + f.t)
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
    const a = (0.25 + 0.35 * Math.sin(g.time * 2 + m.tw * 3)) * fog
    if (a <= 0.02) continue
    ctx.globalAlpha = a
    ctx.fillStyle = m.c
    ctx.fillRect(x - m.s / 2, y - m.s / 2, m.s, m.s)
  }

  // the hints that show through: blinks, eyes and warning glows
  for (const e of g.enemies) {
    const clear = Math.max(1 - fog, clearAt(e.x, e.y, lights))
    if (e.type === 'nebulaLurker') lurkerHint(ctx, e, g, clear)
    else if (e.type === 'phantomEcho') echoHint(ctx, e, g, clear)
    else saucerHint(ctx, e, g, clear)
  }
  const b = g.boss
  if (b && b.kind === 'phantom' && !(b.dying > 0)) phantomTells(ctx, b, g, Math.max(1 - fog, clearAt(b.x, b.y - b.r * 0.4, lights)))
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
}
