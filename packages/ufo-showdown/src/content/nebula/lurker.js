// The lurker: a stealth saucer that hangs in the thick of the fog where no
// ship's light reaches. All you see of it is a faint pink blink, until it
// lights itself up to shoot. Then it's in plain view for a moment, and
// that's the time to get it.
//
//   hide → glow (it lights up: the warning) → shoot → fade → hide …
//
// After three rounds it slips away up and out of the fog.

import { synth } from '../../audio.js'
import { drawLurker, stamp } from './draw.js'

const PINK = '#ff5fd2'
const GLOW_TIME = 0.85

export const lurker = {
  hp: 3,
  r: 30,
  score: 250,
  light: PINK,
  boom: 0.9,
  drop: 0.14,
  update(e, dt, g) {
    e.st ??= 'enter'
    e.st_t = (e.st_t ?? 0) + dt
    e.glow ??= 0
    e.rounds ??= 0
    const px = e.x
    const drift = Math.sin(e.t * 0.45 + e.seed) * Math.min(110, g.W * 0.12)

    if (e.st === 'enter') {
      e.y += Math.max(30, (e.hoverY - e.y) * 1.4) * dt
      e.x += (e.x0 + drift - e.x) * Math.min(1, dt * 2)
      if (e.y >= e.hoverY - 4) next(e, 'hide')
    } else if (e.st === 'leave') {
      e.y -= 110 * dt
      e.glow = Math.max(0, e.glow - dt * 2)
    } else {
      e.x += (e.x0 + drift - e.x) * Math.min(1, dt * 2)
      e.y = e.hoverY + Math.sin(e.t * 1.1 + e.seed) * 10
    }

    switch (e.st) {
      case 'hide':
        e.glow = Math.max(0, e.glow - dt * 2)
        if (e.st_t > e.wait / g.mission.fire && g.phase !== 'victory') {
          if (e.rounds >= 3) next(e, 'leave')
          else {
            next(e, 'glow')
            synth.tone({ type: 'sine', from: 260, to: 780, dur: GLOW_TIME, vol: 0.07 }, 'neb-lurk', 0.25)
          }
        }
        break
      case 'glow':
        e.glow = Math.min(1, e.st_t / GLOW_TIME)
        if (e.st_t >= GLOW_TIME) {
          g.aimed(e.x, e.y + 14, 3, 0.22, 230, PINK, g.nearestPlayer(e.x, e.y))
          e.rounds++
          next(e, 'fade')
        }
        break
      case 'fade':
        // it stays lit a beat after shooting, so a quick ship can tag it
        e.glow = e.st_t < 0.7 ? 1 : Math.max(0, 1 - (e.st_t - 0.7) * 2.5)
        if (e.st_t > 1.1) {
          e.wait = g.rand(2.2, 3.4)
          next(e, 'hide')
        }
        break
    }
    if (dt > 0) e.tilt = g.clamp((e.x - px) / dt / 900, -0.2, 0.2)
  },
  draw(e, g, ctx) {
    drawLurker(ctx, e, g.time + e.seed)
  },
}

function next(e, st) {
  e.st = st
  e.st_t = 0
  e.wait ??= 1.2 + Math.random() * 1.6
}

// How far a lurker lights the fog round itself: not at all while it hides.
export const lurkerLight = (e) => (e.glow > 0.02 ? { x: e.x, y: e.y, r: 70 + 110 * e.glow, a: e.glow, rim: PINK } : null)

// What shows through the fog: two slow pink blinks, and the glow before it
// shoots (drawn even when the fog is clear, since it's the warning).
export function lurkerHint(ctx, e, g, clear) {
  const t = g.time + e.seed
  const hidden = 1 - clear
  if (hidden > 0.05 && e.glow < 0.5) {
    const on = Math.sin(t * 2.6) > 0.55
    for (const d of [-1, 1]) stamp(ctx, PINK, e.x + d * e.r * 0.72, e.y + e.r * 0.06, on ? 9 : 5, hidden * (on ? 0.8 : 0.3))
  }
  if (e.glow > 0.02) stamp(ctx, PINK, e.x, e.y + 14, 10 + 22 * e.glow, e.glow * 0.9)
}
