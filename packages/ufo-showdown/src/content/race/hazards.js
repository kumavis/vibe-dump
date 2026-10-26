// The things in the way: space bombs and saucers. Both are enemy types (see
// ../README.md), so the game already knocks a ship out when it touches one,
// and a Nova blast clears them. Ships don't shoot in this race; it's all
// about seeing them in time and steering round.
//
// Bombs sit on the course and come down with it. Some slide in from the side
// while they're still up the screen and stop just short of the racing line;
// some swing back and forth.
//
// Saucers fly their own way, each with its own warning:
//   swoop   dives in from a top corner and sweeps across every lane
//   park    keeps pace above a lane and fires a few shots, glowing first
//   streak  a red warning line down the screen for a second, then it rips
//           straight down that line
//   bomber  crosses the top of the screen dropping bombs into the lanes,
//           never right where a ring is

import { synth } from '../../audio.js'
import { drawSaucer } from '../../art.js'
import { lv, yOf, sAt, yRef } from './state.js'
import { drawBomb, drawStreakWarn, drawMotion, drawCharge } from './draw.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (k) => k * k * (3 - 2 * k)

export const bomb = {
  hp: 1,
  r: 18,
  score: 0,
  light: '#ff5a7a',
  boom: 0.9,
  drop: 0,
  update(e, dt, g) {
    e.y = yOf(g, e.s)
    const top = g.playerTop()
    if (e.x0 !== undefined) {
      // slides in while it's up the screen, done before it reaches the ships
      const k = clamp((e.y + 80) / (top - 40 + 80), 0, 1)
      e.x = e.x0 + (e.x1 - e.x0) * smooth(k)
      e.moving = k > 0 && k < 1 ? Math.sign(e.x1 - e.x0) : 0
    } else if (e.sway) e.x = e.cx + Math.sin(e.t * 2.1 + e.seed) * e.sway
    e.spin = (e.spin ?? e.seed) + dt * 0.9
    // a warning halo, and a faster blink, once it's down where the ships fly
    e.warn = clamp((e.y - top + 170) / 130, 0, 1)
    // just let go of by a bomber: it starts a little big and settles
    if (e.fall > 0) e.fall = Math.max(0, e.fall - dt * 3)
  },
  draw(e, g, ctx) {
    drawBomb(ctx, e, g.time)
  },
  onDeath(e, g) {
    // only ever a ship flying into it, or a Nova: either way a big bang
    g.shake(9)
    g.sparks(e.x, e.y, '#ffe23d', 10)
    synth.noise({ dur: 0.6, vol: 0.4, freq: 1800, to: 80, q: 1 }, 'race-bomb', 0.08)
  },
}

// ---------------------------------------------------------------- saucers

const KIND = { swoop: 'zigzag', park: 'gunner', streak: 'diver', bomber: 'scout' }

// A saucer as the level launches it. `ev` is the planned event (course.js).
export function launch(g, ev) {
  const W = g.W
  const H = g.H
  const o = { mode: ev.mode, st: 'go', vx: 0, vy: 0, kind: KIND[ev.mode] }
  switch (ev.mode) {
    case 'swoop': {
      const xs = ev.side < 0 ? W * 0.1 : W * 0.9
      Object.assign(o, { xs, xe: W - xs, u: 0, dur: (H + 130) / (0.42 * lv.v + 170), amp: Math.min(W * 0.1, 90) })
      return g.spawn('raceSaucer', xs, -50, o)
    }
    case 'park': {
      const x = clamp(ev.x, 60, W - 60)
      Object.assign(o, { st: 'enter', lx: x, hoverY: clamp(H * 0.21, 150, 210), shots: ev.shots, wait: 0.35, charge: 0 })
      return g.spawn('raceSaucer', x, -50, o)
    }
    case 'streak': {
      // down the column a ship is in right now: it has a second to move over
      const ships = g.alive()
      const x = ships.length ? g.pick(ships).x : g.rand(80, W - 80)
      Object.assign(o, { st: 'warn', warnT: 1.05, warn0: 1.05, x: clamp(x, 50, W - 50) })
      beep(0)
      beep(0.32)
      return g.spawn('raceSaucer', o.x, -90, o)
    }
    case 'bomber': {
      const dir = ev.dir
      const y0 = clamp(H * 0.19, 140, 200)
      Object.assign(o, { y0, vx: dir * (250 + 30 * Math.min(3, Math.floor(lv.clock / 20))), dropT: 0.5, load: 1 })
      return g.spawn('raceSaucer', dir > 0 ? -50 : W + 50, y0, o)
    }
  }
}

export const saucer = {
  hp: 3,
  r: 26,
  score: 0,
  light: '#ffe23d',
  boom: 1,
  drop: 0,
  update(e, dt, g) {
    const px = e.x
    if (lv.done && e.st !== 'flee') {
      // the race is over: everyone clears off
      e.st = 'flee'
      e.vy = -120
    }
    MODES[e.mode](e, dt, g)
    if (e.st === 'flee') {
      e.vy -= 900 * dt
      e.y += e.vy * dt
      if (e.y < -120) e.gone = true
    }
    if (dt > 0) e.tilt += (clamp((e.x - px) / dt / 900, -0.3, 0.3) - e.tilt) * Math.min(1, dt * 8)
  },
  draw(e, g, ctx) {
    if (e.st === 'warn') return drawStreakWarn(ctx, e, g.H, g.time)
    if (e.mode === 'streak' || e.mode === 'swoop') drawMotion(ctx, e, e.mode === 'streak' ? e.vy * 0.16 : 60)
    if (e.mode === 'park' && e.charge > 0) drawCharge(ctx, e.x, e.y + 16, e.charge, g.time)
    drawSaucer(ctx, e.x, e.y, e.r, e.kind, g.time + e.seed, { flash: e.flash, tilt: e.tilt })
    // a bomber carries its next bomb underneath
    if (e.mode === 'bomber' && e.load > 0) drawBomb(ctx, { x: e.x, y: e.y + 22 + (1 - e.load) * 8, r: 11, spin: g.time, warn: 0, t: g.time, seed: e.seed }, g.time)
  },
}

const MODES = {
  swoop(e, dt, g) {
    if (e.st === 'flee') return
    e.u += dt / e.dur
    const k = e.u
    e.x = e.xs + (e.xe - e.xs) * smooth(clamp(k * 1.1 - 0.05, 0, 1)) + Math.sin(k * Math.PI * 2) * e.amp
    e.y = -50 + (g.H + 180) * k
  },

  park(e, dt, g) {
    if (e.st === 'flee') return
    e.st_t = (e.st_t ?? 0) + dt
    if (e.st === 'enter') {
      e.y += Math.max(70, (e.hoverY - e.y) * 3) * dt
      if (e.y >= e.hoverY - 3) set(e, 'hold')
    } else if (e.st === 'leave') {
      e.vx += e.side * 900 * dt
      e.x += e.vx * dt
      e.y -= 60 * dt
      return
    } else {
      e.x = e.lx + Math.sin(e.t * 1.4 + e.seed) * 16
      e.y = e.hoverY + Math.sin(e.t * 2.3) * 5
    }
    if (e.st === 'hold' && e.st_t > e.wait) {
      if (e.shots <= 0) {
        set(e, 'leave')
        e.side = e.x < g.W / 2 ? -1 : 1
        e.vx = e.side * 120
      } else {
        set(e, 'charge')
        synth.tone({ type: 'sine', from: 300, to: 900, dur: 0.5, vol: 0.06 }, 'race-charge', 0.2)
      }
    } else if (e.st === 'charge') {
      e.charge = Math.min(1, e.st_t / 0.55)
      if (e.st_t >= 0.55) {
        g.aimed(e.x, e.y + 18, 1, 0, 215, '#ffb02e', g.nearestPlayer(e.x, e.y))
        e.shots--
        e.charge = 0
        e.wait = 0.5
        set(e, 'hold')
      }
    }
  },

  streak(e, dt, g) {
    if (e.st === 'flee') return
    if (e.st === 'warn') {
      e.warnT -= dt
      if (e.warnT <= 0) {
        e.st = 'go'
        e.vy = lv.v * 1.1 + 640
        synth.noise({ dur: 0.45, vol: 0.28, freq: 600, to: 5000, q: 2 }, 'race-streak', 0.1)
      }
      return
    }
    e.y += e.vy * dt
  },

  bomber(e, dt, g) {
    if (e.st === 'flee') return
    e.x += e.vx * dt
    e.y = e.y0 + Math.sin(e.t * 3) * 6
    e.load = Math.min(1, e.load + dt * 2.5)
    if ((e.dropT -= dt) <= 0 && e.x > 70 && e.x < g.W - 70) {
      e.dropT = 0.2
      if (dropBomb(g, e.x, e.y + 24)) {
        e.load = 0
        e.dropT = 0.44
      }
    }
  },
}

function set(e, st) {
  e.st = st
  e.st_t = 0
}

// A bomber only lets go where the bomb won't sit on a ring's line, or on top
// of another bomb.
function dropBomb(g, x, y) {
  for (const r of lv.rings) if (Math.abs(r.y - y) < 120 && Math.abs(r.x - x) < r.rx + 48) return false
  for (const e of g.enemies) if (e.type === 'raceBomb' && Math.abs(e.y - y) < 130 && Math.abs(e.x - x) < 100) return false
  if (lv.finish && Math.abs(lv.finish.y - y) < 160) return false
  // nothing in the last stretch before the ships: too late to see it coming
  if (y > yRef(g) - 300) return false
  g.spawn('raceBomb', x, y, { s: sAt(g, y), fall: 1, role: 'dropped' })
  synth.tone({ type: 'sine', from: 700, to: 240, dur: 0.18, vol: 0.08 }, 'race-drop', 0.1)
  return true
}

function beep(at) {
  synth.tone({ type: 'square', from: 1250, dur: 0.07, vol: 0.06, at }, 'race-warn' + at, 0.2)
}
