// Mission 2, the Asteroid Belt: about a minute of rocks drifting down past the
// ships, then Krax the rock hauler and the Ion Cannon (krax.js).
//
// Rocks split when they're shot, big into two medium into two small, and
// hurt on contact but never shoot. A ship's own lasers clear the rocks right
// above it, so what keeps it moving is everything else: saucers drifting down
// with the rocks (the pink ones aim), and hot rocks that glow hotter and pop
// into a fan of pebbles aimed at the nearest ship unless they're shot first.
// The field gets thick, but a channel that wanders slowly from side to side
// is always kept clear of new rocks, so there's a way through even for a ship
// that can't shoot fast enough. Along the way: crystal rocks full of prizes,
// two rock walls with a gap, three meteor showers with their lanes lit up
// first, and one giant.

import { missionIndex } from '../../missions.js'
import { hexA } from '../../stars.js'
import { synth } from '../../audio.js'
import { ROCK_ENEMIES, SIZES, PALS, CORE, spawnRock, rockSprite, spriteList, drawRock, drawHalo, updateDebris, drawDebris, clearDebris } from './rocks.js'
import { krax, KRAX_ENEMIES, resetFight, currentFight, updateFight, drawFightBack, drawFightMid, drawFightTop } from './krax.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)

const DURATION = 60 // seconds of rocks before the field thins out
const KM = 20 // how far that is, for the HUD
const GAP = 125 // half-width of the channel kept clear of new rocks

const lv = { t: 0, far: [], warns: [] }

// With `?debug` (see main.js) a probe can read the field and the Krax fight,
// and jump ahead in the level by setting `__belt.lv.t`.
if (new URLSearchParams(location.search).has('debug')) globalThis.__belt = { lv, fight: currentFight }

function reset(g) {
  lv.t = 0
  lv.spawnT = 1.4
  lv.scoutT = 8
  lv.crystalT = 8
  lv.hotT = 6
  lv.toldHot = false
  lv.ev = 0
  lv.quiet = 0
  lv.ended = false
  lv.done = false
  lv.gapPh = rand(0, TAU)
  lv.gapX = g.W / 2
  lv.recent = []
  lv.warns = []
  lv.told = false
  lv.far = []
  for (let i = 0; i < 18; i++) lv.far.push(farRock(g, rand(0, g.H)))
}

// ---------------------------------------------------------------- the field

// Dim little rocks far behind the action, drifting slower: depth for free.
function farRock(g, y) {
  return {
    x: rand(0, g.W),
    y,
    k: rand(0.25, 0.6),
    rot: rand(0, TAU),
    spin: rand(-0.4, 0.4),
    vy: rand(12, 24),
    a: rand(0.1, 0.2),
    spr: rockSprite(Math.random() < 0.35 ? 'mid' : 'small', (Math.random() * PALS.length) | 0),
  }
}

// A spot along the top for a new rock: outside the clear channel and not on
// top of the last couple of rocks.
function pickX(g, r) {
  for (let tries = 0; tries < 10; tries++) {
    const x = rand(r + 8, g.W - r - 8)
    if (Math.abs(x - lv.gapX) < GAP + r) continue
    if (lv.recent.some((q) => Math.abs(q - x) < r + 44)) continue
    lv.recent.push(x)
    if (lv.recent.length > 3) lv.recent.shift()
    return x
  }
  return null
}

function spawnOne(g, ramp) {
  const roll = Math.random()
  const size = roll < 0.2 + 0.24 * ramp ? 'big' : roll < 0.66 ? 'mid' : 'small'
  const S = SIZES[size]
  const x = pickX(g, S.r)
  if (x == null) return
  spawnRock(g, size, x, -S.r - 12, { vx: rand(-14, 14), vy: S.speed * rand(0.88, 1.12) * (1 + 0.2 * ramp) })
}

function rockWall(g) {
  g.popText(g.W / 2, g.H * 0.36, 'Rock wall! Find the gap!', '#ffc58a', 24, 2.2)
  const step = 94
  const n = Math.floor((g.W - 30) / step)
  const x0 = (g.W - (n - 1) * step) / 2
  for (let i = 0; i < n; i++) {
    const x = x0 + i * step + rand(-6, 6)
    if (Math.abs(x - lv.gapX) < GAP + 40) continue
    spawnRock(g, 'mid', x, -46 - rand(0, 14), { vx: 0, vy: 74, k: rand(1, 1.12) })
  }
  lv.quiet = 3.4
}

function meteorShower(g, n = 3) {
  g.popText(g.W / 2, g.H * 0.36, 'Meteor shower!', '#ff9a6a', 24, 2)
  const lanes = Math.max(2, Math.min(4, Math.floor(g.W / 300)))
  for (let i = 0; i < lanes; i++) {
    let x = (g.W * (i + 0.5)) / lanes + rand(-30, 30)
    // keep the meteors out of the clear channel
    if (Math.abs(x - lv.gapX) < GAP + 40) x = lv.gapX + Math.sign(x - lv.gapX || 1) * (GAP + 40)
    if (x < 30 || x > g.W - 30) continue
    lv.warns.push({ x, t: 0, dur: 1.6 })
    for (let k = 0; k < n; k++) {
      g.later(1.6 + k * 0.28, () => spawnRock(g, 'small', x + rand(-8, 8), -30, { vx: 0, vy: 340, trail: true, spin: 5, pal: 3 }))
    }
  }
  synth.tone({ type: 'square', from: 990, to: 740, dur: 0.12, vol: 0.06 }, 'belt-warn', 0)
  synth.tone({ type: 'square', from: 990, to: 740, dur: 0.12, vol: 0.06, at: 0.22 }, 'belt-warn2', 0)
  lv.quiet = 2.6
}

// A hot rock's fuse runs out about a third of the way down the screen, well
// above the ships, so its pebbles have room to be dodged.
function hotRock(g) {
  const x = pickX(g, 60)
  if (x == null) return false
  const vy = rand(70, 82)
  spawnRock(g, 'big', x, -70, { kind: 'hot', vx: rand(-10, 10), vy, hot: (g.H * 0.34 + 70) / vy })
  if (!lv.toldHot) {
    lv.toldHot = true
    g.popText(g.clamp(x, 200, g.W - 200), 130, 'Hot rock! Shoot it before it pops!', '#ff9a4d', 18, 2.6)
  }
  return true
}

function giantRock(g) {
  g.popText(g.W / 2, g.H * 0.36, 'Giant rock!', '#ffd7a0', 26, 2)
  const x = lv.gapX < g.W / 2 ? rand(g.W * 0.62, g.W * 0.8) : rand(g.W * 0.2, g.W * 0.38)
  spawnRock(g, 'giant', x, -90, { vx: 0, vy: 42 })
  lv.quiet = 2.4
}

const EVENTS = [
  { at: 0.5, run: (g) => g.popText(g.W / 2, g.H * 0.4, 'Blast the rocks!', '#ffd7a0', 28, 2.2) },
  { at: 13, run: meteorShower },
  { at: 21, run: rockWall },
  { at: 29, run: meteorShower },
  { at: 36, run: giantRock },
  { at: 44, run: rockWall },
  { at: 51, run: (g) => meteorShower(g, 4) },
]

function updateField(g, dt) {
  lv.t += dt
  const t = lv.t
  lv.gapX = g.W / 2 + Math.sin(t * 0.16 + lv.gapPh) * Math.max(0, g.W / 2 - 170)
  if (t >= DURATION) {
    if (!lv.ended) {
      lv.ended = true
      g.popText(g.W / 2, g.H * 0.36, 'Almost through!', '#bff9ff', 24, 2)
    }
    // punching out of the belt: what's left streams past faster and faster
    for (const e of g.enemies) {
      if (e.spr && !e.grav) e.vy = Math.min(420, Math.max(e.vy, 40) + 110 * dt)
      else if (e.path === 'fall') e.speed = Math.min(420, e.speed + 110 * dt)
    }
    // the field's done once the rocks still up the screen are gone
    const left = g.enemies.filter((e) => e.y < g.H - 80).length
    if (!lv.done && ((t > DURATION + 1.5 && left === 0) || t > DURATION + 7)) {
      lv.done = true
      g.levelDone()
    }
    return
  }

  while (lv.ev < EVENTS.length && t >= EVENTS[lv.ev].at) EVENTS[lv.ev++].run(g)

  // the field fills in over the first forty-odd seconds and eases off at the end
  const ramp = Math.min(1, t / 44)
  const taper = t > DURATION - 5 ? 1.6 : 1
  lv.quiet -= dt
  lv.spawnT -= dt
  if (lv.spawnT <= 0 && lv.quiet <= 0) {
    spawnOne(g, ramp)
    lv.spawnT = (1.15 - 0.55 * ramp) * (g.numPlayers === 2 ? 0.85 : 1) * taper
  }

  if ((lv.crystalT -= dt) <= 0) {
    const x = pickX(g, 40)
    if (x != null) {
      spawnRock(g, 'mid', x, -50, { kind: 'crystal', k: 1.12, vx: rand(-8, 8), vy: 66, spin: 0.5 })
      if (!lv.told) {
        lv.told = true
        g.popText(x, 110, 'Shiny rocks hold prizes!', '#ffb3ec', 18, 2.4)
      }
    }
    lv.crystalT = rand(9, 12)
  }

  if (t > 7 && (lv.scoutT -= dt) <= 0) {
    const n = ramp > 0.45 ? 2 : 1
    for (let i = 0; i < n; i++) {
      const x = pickX(g, 30)
      // the pink zigzag saucers aim their shots; scouts just drop theirs
      const type = ramp > 0.3 && Math.random() < 0.45 ? 'zigzag' : 'scout'
      if (x != null) g.spawn(type, x, -40 - i * 50, { path: 'fall', speed: rand(110, 140) })
    }
    lv.scoutT = rand(6, 7.5) - ramp * 1.5
  }

  // a hot rock waits for a wall or a shower to pass rather than piling on;
  // with no room up top this moment, it tries again in a beat
  if (t > 10 && t < DURATION - 6 && (lv.hotT -= dt) <= 0 && lv.quiet <= 0) {
    lv.hotT = hotRock(g) ? rand(6.5, 8) - ramp * 1.5 : 0.3
  }
}

// Rocks that run into each other bump apart, the small one getting the bigger
// shove, rather than sliding through one another.
function bump(g, dt) {
  const rocks = g.enemies.filter((e) => e.spr && !e.dead && e.y > -e.r)
  for (let i = 0; i < rocks.length; i++) {
    const a = rocks[i]
    for (let j = i + 1; j < rocks.length; j++) {
      const b = rocks[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const min = (a.r + b.r) * 0.86
      if (Math.abs(dx) > min || Math.abs(dy) > min) continue
      const d = Math.hypot(dx, dy)
      if (d >= min || d < 0.01) continue
      const ux = dx / d
      const uy = dy / d
      const ma = a.r * a.r
      const mb = b.r * b.r
      const push = Math.min(min - d, 120 * dt)
      a.x -= ux * push * (mb / (ma + mb))
      a.y -= uy * push * (mb / (ma + mb))
      b.x += ux * push * (ma / (ma + mb))
      b.y += uy * push * (ma / (ma + mb))
      const vn = (b.vx - a.vx) * ux + (b.vy - a.vy) * uy
      if (vn < 0) {
        const k = (-1.5 * vn) / (1 / ma + 1 / mb)
        a.vx -= (k / ma) * ux
        a.vy -= (k / ma) * uy
        b.vx += (k / mb) * ux
        b.vy += (k / mb) * uy
        a.spin += rand(-0.6, 0.6)
        b.spin += rand(-0.6, 0.6)
        // a rock is always on its way down past the ships, never back up
        for (const r of [a, b]) {
          if (!r.grav) r.vy = Math.max(r.vy, 30)
          r.damp = r.damp || 0.3
        }
      }
    }
  }
}

// ---------------------------------------------------------------- the level

let warm = spriteList()

const LEVEL = {
  setup(g) {
    reset(g)
    clearDebris()
    resetFight()
  },
  update(g, dt) {
    // paint the rock sprites a couple per frame during the intro
    if (warm) {
      for (let i = 0; i < 2 && warm; i++) {
        const n = warm.next()
        if (n.done) warm = null
        else rockSprite(...n.value)
      }
    }
    updateDebris(dt)
    for (const r of lv.far) {
      r.y += r.vy * dt
      r.rot += r.spin * dt
      if (r.y > g.H + 40) Object.assign(r, farRock(g, -40))
    }
    for (const w of lv.warns) w.t += dt
    lv.warns = lv.warns.filter((w) => w.t < w.dur + 0.9)
    if (g.phase === 'main') updateField(g, dt)
    bump(g, dt)
    updateFight(g, dt)
  },
  progress: () => Math.min(1, lv.t / DURATION),
  hud(g, ctx) {
    const cx = g.W / 2
    const bw = Math.min(g.W * 0.3, 280)
    const frac = Math.min(1, lv.t / DURATION)
    ctx.textAlign = 'center'
    ctx.font = `13px ${g.FONT}`
    ctx.fillStyle = '#a9b3d6'
    ctx.fillText(`Mission ${missionIndex(g.mission.id) + 1} · ${g.mission.name}`, cx, 26)
    const x = cx - bw / 2
    const y = 34
    ctx.fillStyle = 'rgba(255,255,255,0.12)'
    ctx.beginPath()
    ctx.roundRect(x, y, bw, 8, 4)
    ctx.fill()
    if (frac > 0) {
      ctx.fillStyle = '#ffb36b'
      ctx.beginPath()
      ctx.roundRect(x, y, Math.max(8, bw * frac), 8, 4)
      ctx.fill()
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(x, y, bw, 8, 4)
    ctx.stroke()
    // a little ship rides the bar
    const sx = x + bw * frac
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(sx, y - 5)
    ctx.lineTo(sx + 6, y + 11)
    ctx.lineTo(sx, y + 8)
    ctx.lineTo(sx - 6, y + 11)
    ctx.closePath()
    ctx.fill()
    ctx.font = `11px ${g.FONT}`
    ctx.fillStyle = '#ffd7a0'
    ctx.fillText(`${(frac * KM).toFixed(1)} of ${KM} km`, cx, 56)
  },
  drawBack(g, ctx) {
    for (const r of lv.far) {
      ctx.globalAlpha = r.a
      ctx.save()
      ctx.translate(r.x, r.y)
      ctx.rotate(r.rot)
      ctx.scale(r.k, r.k)
      ctx.drawImage(r.spr.canvas, -r.spr.R, -r.spr.R, r.spr.R * 2, r.spr.R * 2)
      ctx.restore()
    }
    ctx.globalAlpha = 1
    // meteor lanes light up before the meteors come
    for (const w of lv.warns) {
      if (w.t > w.dur) continue
      const a = 0.5 + 0.5 * Math.sin(g.time * 24)
      ctx.fillStyle = `rgba(255, 110, 70, ${0.08 + a * 0.08})`
      ctx.fillRect(w.x - 36, 0, 72, g.H)
      ctx.strokeStyle = `rgba(255, 150, 100, ${0.25 + a * 0.3})`
      ctx.lineWidth = 2
      ctx.setLineDash([12, 10])
      ctx.lineDashOffset = g.time * 120
      ctx.beginPath()
      ctx.moveTo(w.x - 36, 0)
      ctx.lineTo(w.x - 36, g.H)
      ctx.moveTo(w.x + 36, 0)
      ctx.lineTo(w.x + 36, g.H)
      ctx.stroke()
      ctx.setLineDash([])
    }
    drawFightBack(g, ctx)
  },
  drawMid(g, ctx) {
    drawDebris(ctx)
    drawFightMid(g, ctx)
  },
  drawTop(g, ctx) {
    for (const w of lv.warns) {
      if (w.t > w.dur) continue
      const blink = Math.floor(g.time * 8) % 2 === 0
      ctx.save()
      ctx.translate(w.x, 96)
      ctx.fillStyle = blink ? '#ff6a4a' : '#ffd23d'
      ctx.strokeStyle = 'rgba(30,6,10,0.9)'
      ctx.lineWidth = 3
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(0, -22)
      ctx.lineTo(22, 16)
      ctx.lineTo(-22, 16)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#2a0a08'
      ctx.font = `20px ${g.FONT}`
      ctx.textAlign = 'center'
      ctx.fillText('!', 0, 12)
      ctx.restore()
    }
    drawFightTop(g, ctx)
  },
  icon(ctx) {
    // a scatter of rocks around a glowing power core
    ctx.fillStyle = '#ffffff'
    for (const [x, y, s] of [[5, 7, 1], [21, 44, 1], [74, 46, 1], [43, 4, 1.4], [77, 27, 1], [11, 30, 1.4], [35, 22, 1], [52, 44, 1], [62, 3, 1]]) ctx.fillRect(x, y, s, s)
    drawRock(ctx, { x: 61, y: 18, k: 0.31, rot: 0.6, spr: rockSprite('big', 0, 'plain', 0) })
    drawRock(ctx, { x: 16, y: 15, k: 0.34, rot: 2.1, spr: rockSprite('mid', 1, 'plain', 1) })
    drawRock(ctx, { x: 69, y: 40, k: 0.36, rot: 1.2, spr: rockSprite('small', 3, 'plain', 2) })
    drawRock(ctx, { x: 25, y: 38, k: 0.3, rot: 0.3, spr: rockSprite('small', 2, 'plain', 3) })
    drawRock(ctx, { x: 45, y: 9, k: 0.2, rot: 0.9, spr: rockSprite('small', 0, 'plain', 4) })
    drawRock(ctx, { x: 6, y: 44, k: 0.24, rot: 2.6, spr: rockSprite('small', 1, 'plain', 0) })
    ctx.globalCompositeOperation = 'lighter'
    drawHalo(ctx, 42, 30, 22, CORE, 0.9)
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = CORE
    ctx.lineWidth = 1.5
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (i * Math.PI) / 3
      ctx.lineTo(42 + Math.cos(a) * 6, 30 + Math.sin(a) * 6)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = hexA(CORE, 0.8)
    ctx.beginPath()
    ctx.ellipse(42, 30, 10, 3.5, -0.3, 0, TAU)
    ctx.stroke()
  },
}

export default {
  levels: { asteroids: LEVEL },
  bosses: { krax },
  enemies: { ...ROCK_ENEMIES, ...KRAX_ENEMIES },
}
