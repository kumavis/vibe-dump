// The lurker: a stealth saucer, and the main thing to fear in the nebula. It
// cloaks itself and slides about the fog unseen (a ripple of bent light is
// all there is of it), then uncloaks with a pink ripple, lights itself up
// pink, shoots, and stays lit a beat before it cloaks again. Every shot comes
// after that glow, so there's always a warning: watch for the pink.
//
//   enter → lurk (cloaked) → uncloak → glow → shoot → linger → cloak → lurk …
//   … and after its last round, it slips away
//
// The wave that spawns it picks its kind:
//
//   solo     drops in from the top on its own
//   squad    a line of them that slides about as one and fires in a ripple
//   ambush   creeps in from the side of the screen, behind a warning glow
//   shroud   the big one: two eyes, more armour and a double spread
//
// A cloaked lurker can still be shot (a hit lights it up), so firing into
// the murk where you saw one go is never wasted.

import { synth } from '../../audio.js'
import { drawLurker, drawLurkerOutline, glow, stamp, twinkle } from './draw.js'

const PINK = '#ff5fd2'
const UNCLOAK = 0.45
const LINGER = 0.7
const CLOAK = 0.5
const RIPPLE = 0.3 // seconds between squad members' shots

const KINDS = {
  solo: { glow: 0.9, rounds: 3, wait: [2.2, 3.2] },
  squad: { glow: 0.85, rounds: 2, wait: [2.6, 2.6] },
  ambush: { glow: 0.9, rounds: 2, wait: [1.7, 2.5] },
  shroud: { glow: 1, rounds: 4, wait: [2.1, 2.7] },
}

// Ambush warnings glowing on the screen edge: { side, y0, y1, t, max }.
let warnings = []

export function resetLurkers() {
  warnings = []
}

export function updateLurkers(dt) {
  for (const w of warnings) w.t -= dt
  warnings = warnings.filter((w) => w.t > 0)
}

// ---------------------------------------------------------------- spawners

export function solo(g, x0, hy) {
  return g.spawn('nebulaLurker', x0, -40, { kind: 'solo', hx: x0, hy, x0 })
}

export function shroud(g, x0) {
  return g.spawn('nebulaLurker', x0, -60, { kind: 'shroud', big: true, r: 44, hp: 9, hx: x0, hy: g.rand(150, 200), x0 })
}

// A line of n, dropping in together at the same height.
export function squad(g, n, cx = g.W / 2) {
  const gap = Math.min(120, (g.W - 160) / Math.max(1, n - 1))
  const sq = { x0: g.clamp(cx, 80 + (gap * (n - 1)) / 2, g.W - 80 - (gap * (n - 1)) / 2), y: g.rand(150, 210), gap, n, killed: 0, fireAt: Infinity, moved: 0 }
  for (let i = 0; i < n; i++) {
    const [hx, hy] = squadSpot(sq, i)
    g.spawn('nebulaLurker', hx, -40 - (i % 2) * 20, { kind: 'squad', sq, slot: i, hx, hy })
  }
  return sq
}

function squadSpot(sq, i) {
  const u = i - (sq.n - 1) / 2
  // a shallow V, the middle one lowest
  return [sq.x0 + u * sq.gap, sq.y - Math.abs(u) * 16]
}

// n of them creeping in from one side (-1 left, 1 right). A pink glow on that
// edge gives them away a second before they arrive.
export function ambush(g, side, n) {
  if (n <= 0) return
  const y0 = 160
  const y1 = Math.max(y0 + 80, g.playerTop() - 90)
  const ys = []
  for (let i = 0; i < n; i++) ys.push(y0 + ((y1 - y0) * (i + 0.5)) / n + g.rand(-14, 14))
  warnings.push({ side, y0: y0 - 40, y1: y1 + 40, t: 1.8, max: 1.8 })
  synth.tone({ type: 'triangle', from: 300, to: 520, dur: 0.5, vol: 0.06 }, 'neb-ambush', 0.3)
  synth.tone({ type: 'triangle', from: 300, to: 520, dur: 0.5, vol: 0.06, at: 0.32 }, 'neb-ambush2', 0.3)
  for (let i = 0; i < n; i++) {
    g.later(0.8 + i * 0.35, () => {
      // the boss that called them may be gone by the time they'd arrive
      if (g.phase === 'clear' || g.phase === 'victory' || g.boss?.dying) return
      const hx = side < 0 ? g.rand(g.W * 0.08, g.W * 0.24) + 40 : g.W - g.rand(g.W * 0.08, g.W * 0.24) - 40
      g.spawn('nebulaLurker', side < 0 ? -50 : g.W + 50, ys[i], { kind: 'ambush', side, hx, hy: ys[i] })
    })
  }
}

// ---------------------------------------------------------------- the saucer

export const lurker = {
  hp: 3,
  r: 30,
  score: 250,
  light: PINK,
  boom: 0.9,
  drop: 0.1,
  update(e, dt, g) {
    if (!e.st) {
      e.st = 'enter'
      e.st_t = 0
      e.cloak = 1
      e.glow = 0
      e.rounds = 0
      e.kindDef = KINDS[e.kind] ?? KINDS.solo
    }
    e.st_t += dt
    const K = e.kindDef
    const px = e.x
    const sq = e.sq

    // where it wants to be: its spot, drifting a little
    let tx = e.hx
    let ty = e.hy
    if (sq) [tx, ty] = squadSpot(sq, e.slot)
    else if (e.kind !== 'ambush') tx = e.hx + Math.sin(e.t * 0.45 + e.seed) * Math.min(90, g.W * 0.08)
    tx = g.clamp(tx, e.r + 20, g.W - e.r - 20)
    ty += Math.sin(e.t * 1.1 + e.seed) * 9

    switch (e.st) {
      case 'enter':
        glide(e, tx, ty, dt, e.kind === 'ambush' ? 300 : 220)
        if (Math.hypot(tx - e.x, ty - e.y) < 10) {
          next(e, 'lurk')
          e.wait = g.rand(...K.wait) * 0.55
          if (sq && sq.fireAt === Infinity) sq.fireAt = g.time + 1.1 / g.mission.fire
        }
        break
      case 'lurk':
        glide(e, tx, ty, dt, 260)
        if (g.phase === 'victory' || g.phase === 'clear' || g.boss?.dying) break
        if (sq ? g.time >= sq.fireAt + e.slot * RIPPLE : e.st_t > e.wait / g.mission.fire) {
          if (e.rounds >= K.rounds) next(e, 'leave')
          else {
            next(e, 'uncloak')
            synth.tone({ type: 'sine', from: 1500, to: 600, dur: 0.3, vol: 0.05 }, 'neb-cloak', 0.12)
          }
        }
        break
      case 'uncloak':
        glide(e, tx, ty, dt, 80)
        e.cloak = Math.max(0, 1 - e.st_t / UNCLOAK)
        if (e.st_t >= UNCLOAK) {
          next(e, 'glow')
          synth.tone({ type: 'sine', from: 260, to: 780, dur: K.glow, vol: 0.07 }, 'neb-lurk', 0.25)
        }
        break
      case 'glow':
        e.cloak = 0
        e.glow = Math.min(1, e.st_t / K.glow)
        if (e.st_t >= K.glow) {
          fire(e, g)
          e.rounds++
          next(e, 'linger')
        }
        break
      case 'linger':
        // it stays lit a beat after shooting, so a quick ship can tag it
        e.glow = e.st_t < LINGER * 0.6 ? 1 : Math.max(0, 1 - (e.st_t - LINGER * 0.6) / (LINGER * 0.4))
        if (e.big && !e.second && e.st_t > 0.4) {
          // the Shroud's second spread, shifted half a gap: step sideways
          e.second = true
          g.aimed(e.x, e.y + 18, 4, 0.17, 210, PINK, g.nearestPlayer(e.x, e.y))
        }
        if (e.st_t >= LINGER) next(e, 'cloak')
        break
      case 'cloak':
        e.glow = 0
        e.cloak = Math.min(1, e.st_t / CLOAK)
        if (e.st_t >= CLOAK) {
          // slip off somewhere new while nobody can see
          relocate(e, g)
          next(e, 'lurk')
          e.wait = g.rand(...K.wait)
          e.second = false
        }
        break
      case 'leave':
        e.cloak = Math.min(1, e.cloak + dt * 2)
        e.glow = 0
        if (e.kind === 'ambush') e.x += e.side * 260 * dt
        else e.y -= 130 * dt
        if (e.y < -80 || e.x < -90 || e.x > g.W + 90) e.gone = true
        break
    }
    if (dt > 0) e.tilt = g.clamp((e.x - px) / dt / 900, -0.22, 0.22)
  },
  draw(e, g, ctx) {
    drawLurker(ctx, e, g.time + e.seed)
  },
  onDeath(e, g, owner) {
    if (e.big) {
      g.addScore(owner, 400, e.x, e.y - 44)
      if (Math.random() < 0.5) g.dropBubble(e.x, e.y)
    }
    const sq = e.sq
    if (sq && ++sq.killed === sq.n) {
      g.addScore(owner, 500)
      g.popText(e.x, e.y - 40, 'Squad cleared! +500', '#ffd6f4', 20, 1.4)
    }
  },
}

function next(e, st) {
  e.st = st
  e.st_t = 0
}

// Ease toward a point at up to `speed` units a second.
function glide(e, tx, ty, dt, speed) {
  const dx = tx - e.x
  const dy = ty - e.y
  const d = Math.hypot(dx, dy)
  if (d < 0.5) return
  const step = Math.min(d, Math.max(30, Math.min(speed, d * 2.5)) * dt)
  e.x += (dx / d) * step
  e.y += (dy / d) * step
}

function fire(e, g) {
  const tg = g.nearestPlayer(e.x, e.y)
  switch (e.kind) {
    case 'squad':
      g.aimed(e.x, e.y + 14, 2, 0.2, 200, PINK, tg)
      break
    case 'ambush':
      g.aimed(e.x, e.y + 12, 3, 0.2, 220, PINK, tg)
      break
    case 'shroud':
      g.aimed(e.x, e.y + 18, 5, 0.17, 210, PINK, tg)
      break
    default:
      g.aimed(e.x, e.y + 14, 3, 0.22, 210, PINK, tg)
  }
}

// After a round, a cloaked lurker moves: a squad picks a new line (whoever
// cloaks first decides, and sets the time of its next volley), an ambusher a
// new spot on its own side, the rest somewhere else along the top.
function relocate(e, g) {
  const sq = e.sq
  if (sq) {
    if (sq.moved < e.rounds) {
      sq.moved = e.rounds
      const half = (sq.gap * (sq.n - 1)) / 2
      let x = g.rand(80 + half, Math.max(80 + half, g.W - 80 - half))
      for (let i = 0; i < 5 && Math.abs(x - sq.x0) < g.W * 0.2; i++) x = g.rand(80 + half, Math.max(80 + half, g.W - 80 - half))
      sq.x0 = x
      sq.y = g.rand(140, 220)
      sq.fireAt = g.time + 2.6 / g.mission.fire
    }
    return
  }
  if (e.kind === 'ambush') {
    e.hx = e.side < 0 ? g.rand(g.W * 0.06, g.W * 0.26) + 40 : g.W - g.rand(g.W * 0.06, g.W * 0.26) - 40
    e.hy = g.clamp(e.hy + g.rand(-70, 70), 150, Math.max(170, g.playerTop() - 90))
    return
  }
  const span = Math.min(g.W * 0.35, 380)
  e.hx = g.clamp(e.hx + (Math.random() < 0.5 ? -1 : 1) * g.rand(span * 0.5, span), 70, g.W - 70)
  e.hy = g.rand(130, 250)
}

// ---------------------------------------------------------------- through the fog

// How far a lurker lights the fog round itself: not at all until it glows.
export function lurkerLight(e) {
  if (!(e.glow > 0.02)) return null
  return { x: e.x, y: e.y, r: (70 + 110 * e.glow) * (e.big ? 1.25 : 1), a: e.glow, rim: PINK }
}

// What shows through the fog, drawn with 'lighter': two slow pink blinks
// while it's uncloaked, a glint now and then while it's cloaked, the pink
// ripple as it uncloaks, its outline if crystal light (`sight`) is on it, and
// the glow before it shoots, which shows whatever the fog is doing.
export function lurkerHint(ctx, e, g, clear, sight = 0) {
  const t = g.time + e.seed
  const hidden = 1 - clear
  const cloak = e.cloak ?? 1
  const r = e.r
  if (hidden > 0.05 && cloak < 0.6 && !(e.glow > 0.5)) {
    const on = Math.sin(t * 2.6) > 0.55
    const a = hidden * (1 - cloak)
    for (const d of [-1, 1]) stamp(ctx, PINK, e.x + d * r * 0.72, e.y + r * 0.06, on ? 9 : 5, a * (on ? 0.8 : 0.3))
  }
  if (cloak > 0.5) {
    const k = Math.sin(t * 1.6)
    if (k > 0.55) {
      ctx.globalAlpha = ((k - 0.55) / 0.45) * 0.55 * cloak
      twinkle(ctx, e.x + Math.cos(t * 2.1) * r * 0.9, e.y + Math.sin(t * 2.1) * r * 0.2, 4 + 3 * k, '#d8ecff')
    }
  }
  if (sight > 0.05 && cloak > 0.3) drawLurkerOutline(ctx, e, sight * cloak * 0.85)
  if (e.st === 'uncloak') {
    // the first warning: a ripple of pink spreading off it
    const k = e.st_t / UNCLOAK
    ctx.globalAlpha = (1 - k) * 0.85
    ctx.strokeStyle = PINK
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.ellipse(e.x, e.y, r * (0.7 + 1.3 * k), r * (0.35 + 0.65 * k), 0, 0, Math.PI * 2)
    ctx.stroke()
    stamp(ctx, PINK, e.x, e.y + 8, 8 + 10 * k, 0.5 * k)
  }
  if (e.glow > 0.02) stamp(ctx, PINK, e.x, e.y + r * 0.45, (12 + 28 * e.glow) * (e.big ? 1.3 : 1), e.glow * 0.95)
}

// The ambush warnings: the screen edge glowing pink where they'll come from,
// with chevrons pointing in. Drawn over the fog.
export function drawAmbushWarnings(ctx, g) {
  for (const w of warnings) {
    const k = w.t / w.max
    const a = Math.min(1, (1 - k) * 4) * Math.min(1, k * 3) * (0.75 + 0.25 * Math.sin(g.time * 14))
    const x = w.side < 0 ? 0 : g.W
    // a soft pink glow hugging the edge
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = a
    ctx.drawImage(glow(PINK, false), x - 150, w.y0, 300, w.y1 - w.y0)
    ctx.drawImage(glow(PINK, false), x - 70, w.y0 + 30, 140, w.y1 - w.y0 - 60)
    ctx.globalCompositeOperation = 'source-over'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const cy = (w.y0 + w.y1) / 2
    for (const [col, lw] of [[PINK, 8], ['#ffffff', 3]]) {
      ctx.strokeStyle = col
      ctx.lineWidth = lw
      for (let i = 0; i < 2; i++) {
        const cx = x - w.side * (24 + i * 22 + (1 - k) * 10)
        ctx.beginPath()
        ctx.moveTo(cx + w.side * 10, cy - 16)
        ctx.lineTo(cx - w.side * 6, cy)
        ctx.lineTo(cx + w.side * 10, cy + 16)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
  }
}
