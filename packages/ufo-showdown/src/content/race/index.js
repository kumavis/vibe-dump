// Mission 3, the Ring Race: a bonus round with nothing to shoot. For a minute,
// glowing rings stream down through the ships' half of the screen in lines,
// S-curves, zig-zags and staircases (patterns.js). Fly through one to score
// it. Rings in a row build a combo, a missed one ends it, and now and then a
// big gold ring is worth five. A few floating buoys drift down beside the
// racing line: bumping one knocks a ship dizzy and ends its combo, but never
// costs a life. In the last ten seconds the pace picks up.
//
// With two players both ships can take every ring, the points are each
// ship's own, and a ring only counts as missed if nobody flew through it.

import { synth } from '../../audio.js'
import { SQUASH, choosePattern, planPattern, planGold, planBuoys } from './patterns.js'
import { RING_PALS, GOLD_PAL, drawRingHalf, drawBurst, drawSparkles, drawSpeedLines, drawBuoy, drawDizzy, drawIcon } from './draw.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]

const DURATION = 60 // seconds on the clock
const RUSH = 10 // the last stretch, when everything speeds up
const LEAD = 2 // the course starts falling this long before the clock starts, so the first rings arrive soon after "go"
const SPEED = [170, 190, 245] // how fast the course falls: the opening, the middle, the rush
const GOLD_EVERY = 8.5 // seconds between gold rings, give or take a pattern

// No new rings this close to the end: they'd never reach the ships in time.
// A taller window (a phone held upright) has further for them to fall.
const stopAt = (g) => DURATION - (g.H - 60) / SPEED[2]

// Scoring. About 90 rings come by in the minute. A good run takes most of
// them with a few slips and lands around 8–15k (the stars it pays are about
// score / 100); a flawless one tops out near 19k.
const BASE = 40 // points for a ring, times the combo
const GOLD = 5 // a gold ring is worth this many rings
const STEP = 5 // rings in a row for each step up the combo
const MAX_MULT = 4
const PERFECT = 150 // every ring of a pattern (four or more) without a slip
const SLACK = 6 // a ship's centre may be this far onto the rim and still count
const BUMP_R = 18 // how close (beyond a buoy's radius) a ship's centre bumps it
const WOBBLE = 0.75 // seconds a bump leaves a ship wobbling

const lv = { rings: [], buoys: [], fx: [], sparks: [], lines: [], queue: [], ships: [] }

// With `?debug` (see main.js) a probe can read the course and wind the clock
// on by setting `__race.lv.clock`.
if (new URLSearchParams(globalThis.location?.search ?? '').has('debug')) globalThis.__race = { lv, DURATION, RUSH }

const multOf = (streak) => Math.min(MAX_MULT, 1 + Math.floor(streak / STEP))

function reset(g) {
  lv.clock = -2.4 // the intro banner runs 2.4 s; the clock reads 0 at "go"
  lv.t = 0
  lv.v = SPEED[0]
  lv.boost = 0
  lv.fade = 1
  lv.queue = []
  lv.endAt = -LEAD
  lv.planned = 0
  lv.closed = false
  lv.lastKind = null
  lv.lastX = g.W / 2
  lv.lastGold = 0
  lv.pal = 0
  lv.rowN = 0
  lv.rows = new Map()
  lv.pats = new Map()
  lv.rings = []
  lv.buoys = []
  lv.fx = []
  lv.sparks = []
  lv.ships = [0, 1].map(() => ({ rings: 0, streak: 0, best: 0, bumps: 0, wob: 0, kx: 0, cool: 0, perfect: 0 }))
  lv.rushed = false
  lv.beep = 6
  lv.done = false
  lv.hinted = false
  lv.said = []
  lv.w = g.W
  lv.lines = []
  for (let i = 0; i < 34; i++) lv.lines.push(speedLine(g, rand(-150, g.H)))
}

// ---------------------------------------------------------------- the course

// Plan the next pattern and queue up its rings and buoys on the clock.
function plan(g) {
  const at = lv.endAt
  const stage = at >= DURATION - RUSH - 1 ? 2 : at < 16 ? 0 : 1
  const W = g.W
  let p
  if (lv.planned && lv.lastKind !== 'gold' && at - lv.lastGold > GOLD_EVERY && at < stopAt(g) - 1) {
    p = planGold({ W, cx: lv.lastX })
    lv.lastGold = at
  } else {
    const kind = choosePattern(stage, lv.lastKind, g.numPlayers === 2)
    p = planPattern(kind, { W, cx: lv.lastX + rand(-160, 160), stage, pace: stage === 2 ? 0.85 : 1 })
  }

  // time to get across to it, on top of a breather between patterns
  const first = p.rings.filter((r) => r.at === p.rings[0].at)
  const travel = Math.min(...first.map((r) => Math.max(0, Math.abs(r.x - lv.lastX) - r.rx * 0.6)))
  const start = lv.planned ? at + (p.kind === 'gold' ? 0.75 : 0.95) + travel / 400 : at
  lv.planned++
  lv.lastKind = p.kind
  lv.lastX = p.exitX
  lv.endAt = start + p.dur
  if (start > stopAt(g)) {
    lv.closed = true
    return
  }

  const id = lv.planned
  const pal = lv.pal++ % RING_PALS.length
  const rowOf = new Map()
  let rows = 0
  for (const r of p.rings) {
    const t = start + r.at
    if (t > stopAt(g)) continue
    if (!rowOf.has(r.at)) {
      const row = ++lv.rowN
      rowOf.set(r.at, row)
      lv.rows.set(row, { rings: [], taken: false, done: false, pat: id })
      rows++
    }
    lv.queue.push({ at: t, ring: { x: r.x, rx: r.rx, gold: r.gold, pal, row: rowOf.get(r.at), pat: id } })
  }
  lv.pats.set(id, { rows, took: [0, 0] })

  // buoys beside the racing line, from a few seconds in
  if (p.kind !== 'gold' && start > 5) {
    const count = stage === 0 ? (Math.random() < 0.5 ? 1 : 0) : stage === 1 ? (Math.random() < 0.35 ? 2 : 1) : 1
    for (const b of planBuoys(p, { W, v: SPEED[stage], count })) {
      const t = start + b.at
      if (t < stopAt(g)) lv.queue.push({ at: t, buoy: { x: b.x } })
    }
  }
  lv.queue.sort((a, b) => a.at - b.at)
}

function spawnRing(g, q, late) {
  const r = q.ring
  r.y = -r.rx * SQUASH - 26 + lv.v * late
  r.got = [false, false]
  r.rel = [null, null]
  r.miss = false
  r.alpha = 1
  r.flash = 0
  r.fading = false
  lv.rows.get(r.row).rings.push(r)
  lv.rings.push(r)
}

function spawnBuoy(g, q, late) {
  const sat = Math.random() < 0.4
  lv.buoys.push({
    x: q.buoy.x,
    y: -40 + lv.v * late,
    r: sat ? 17 : 20,
    kind: sat ? 'sat' : 'float',
    rot: 0,
    spin: rand(-0.7, 0.7),
    vx: rand(-8, 8),
    t: rand(0, 6),
    hit: false,
    warn: 0,
  })
}

// ---------------------------------------------------------------- scoring

function shipState(p) {
  return lv.ships[p.id]
}

// Where a ship's pop-up words go: over the ship, or nudged out to its own side
// when the other ship is right alongside, so two scores don't print as one.
function textX(g, p) {
  const o = g.players.find((q) => q !== p && q.alive)
  if (!o || Math.abs(o.x - p.x) > 110) return p.x
  const side = Math.sign(p.x - o.x) || (p.id ? 1 : -1)
  return (p.x + o.x) / 2 + side * 54
}

// Words (rather than points) go out through here. Two ships side by side
// earning the same word in the same moment get it said once, and words that
// land close together (a Perfect, then a gold ring, then a combo step) stack
// up instead of printing over each other. Pop-up text rises 36 units a second
// (main.js), which is how far an earlier word has floated.
const RISE = 36
function say(g, p, dy, word, color, size, life) {
  const now = g.time
  lv.said = lv.said.filter((s) => now - s.t < s.life)
  if (lv.said.some((s) => s.word === word && now - s.t < 0.5 && Math.abs(s.px - p.x) < 220)) return
  const x = textX(g, p)
  let y = p.y + dy
  for (let tries = 0; tries < 4; tries++) {
    const near = lv.said.find((s) => Math.abs(s.x - x) < 150 && Math.abs(s.y - RISE * (now - s.t) - y) < 26)
    if (!near) break
    y = near.y - RISE * (now - near.t) - 26
  }
  lv.said.push({ word, t: now, life, px: p.x, x, y })
  g.popText(x, y, word, color, size, life)
}

function score(g, r, p) {
  const st = shipState(p)
  r.got[p.id] = true
  const row = lv.rows.get(r.row)
  row.taken = true
  const before = multOf(st.streak)
  st.streak++
  st.rings++
  st.best = Math.max(st.best, st.streak)
  const mult = multOf(st.streak)
  const pts = BASE * (r.gold ? GOLD : 1) * mult
  g.addScore(p.id, pts)
  const tx = textX(g, p)
  g.popText(tx, p.y - 48, `+${pts}`, r.gold ? '#ffe23d' : p.pal.light, r.gold ? 24 : 17, 0.9)
  if (r.gold) say(g, p, -80, 'Gold ring!', '#ffd54a', 20, 1.1)
  if (mult > before) {
    say(g, p, r.gold ? -108 : -78, `Combo ×${mult}!`, '#ffe23d', 21, 1.2)
    synth.tone({ type: 'square', from: 784, dur: 0.07, vol: 0.06, at: 0.1 }, 'race-up', 0)
    synth.tone({ type: 'square', from: 1175, dur: 0.12, vol: 0.06, at: 0.17 }, 'race-up2', 0)
  }
  chime(st.streak, r.gold)

  // a whole pattern without a slip
  const pat = lv.pats.get(r.pat)
  if (pat && ++pat.took[p.id] === pat.rows && pat.rows >= 4) {
    st.perfect++
    g.addScore(p.id, PERFECT)
    const word = g.numPlayers === 1 ? `Perfect! +${PERFECT}` : 'Perfect!'
    g.later(0.3, () => say(g, p, -104, word, '#9ff0ff', 22, 1.3))
  }

  // the pop: a burst of light and sparkles flying off the rim
  const pal = r.gold ? GOLD_PAL : RING_PALS[r.pal % RING_PALS.length]
  lv.fx.push({ x: r.x, y: r.y, rx: r.rx, gold: r.gold, pal: r.pal, t: 0, max: 0.45 })
  const n = r.gold ? 22 : 12
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + rand(-0.2, 0.2)
    const ex = Math.cos(a) * r.rx
    const ey = Math.sin(a) * r.rx * SQUASH
    const sp = rand(60, 160)
    const life = rand(0.45, 0.8)
    lv.sparks.push({
      x: r.x + ex,
      y: r.y + ey,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp * 0.6 - 40,
      life,
      max: life,
      size: rand(4, r.gold ? 9 : 7),
      rot: rand(0, TAU),
      color: pick([pal.main, pal.light, '#ffffff']),
    })
  }
  g.sparks(p.x, p.y - 10, pal.light, 5)
  // the ring flashes white and carries on past the ship as it fades, so the
  // ship is seen to fly right through it (with two players, it stays half
  // there until the other ship has had its go)
  r.flash = 1
  if (g.players.every((q) => !q.alive || r.got[q.id])) r.fading = true
  else r.alpha = 0.6
}

// A ring row has gone past everyone. If nobody flew through any ring in it,
// whoever was nearest missed it.
function resolveRow(g, id) {
  const row = lv.rows.get(id)
  if (!row || row.done) return
  row.done = true
  if (row.taken) return
  const blamed = new Set()
  for (const r of row.rings) {
    r.miss = true
    let best = null
    let bd = Infinity
    for (const p of g.players) {
      if (!p.alive) continue
      const d = Math.abs(p.x - r.x)
      if (d < bd) {
        bd = d
        best = p
      }
    }
    if (best) blamed.add(best)
  }
  for (const p of blamed) {
    const pat = lv.pats.get(row.pat)
    if (pat) pat.took[p.id] = -99 // no Perfect for this pattern now
    endCombo(g, p)
  }
}

// `quiet` for a bump, which has its own "Bonk!" and doesn't need a second line.
function endCombo(g, p, quiet = false) {
  const st = shipState(p)
  if (st.streak >= STEP && !quiet) {
    // up where "Combo ×n!" goes: the two can never land at once
    say(g, p, -80, 'Combo over', '#b8bde0', 17, 1)
    synth.tone({ type: 'triangle', from: 440, to: 210, dur: 0.32, vol: 0.1 }, 'race-lost', 0.2)
  }
  st.streak = 0
}

function bump(g, b, p) {
  const st = shipState(p)
  const dir = Math.sign(p.x - b.x) || 1
  st.wob = WOBBLE
  st.kx = dir * 320
  st.cool = 1
  st.bumps++
  b.hit = true
  b.vx = -dir * 170
  b.spin = -dir * 7
  g.sparks((p.x + b.x) / 2, (p.y + b.y) / 2, '#ffe23d', 9)
  g.shake(7)
  say(g, p, -62, 'Bonk!', '#ffb36a', 22, 0.9)
  synth.noise({ dur: 0.14, vol: 0.3, freq: 1500, to: 260 }, 'race-bonk', 0.1)
  synth.tone({ type: 'sine', from: 170, to: 560, dur: 0.22, vol: 0.18 }, 'race-boing', 0.1)
  endCombo(g, p, true)
  // no Perfect for whatever pattern the ship was in the middle of (not the
  // ones still coming down from the top)
  for (const r of lv.rings) {
    const pat = r.y > p.y - 150 && r.y < p.y + 60 && lv.pats.get(r.pat)
    if (pat) pat.took[p.id] = -99
  }
}

// Up a pentatonic scale as the streak grows, so a long run sings.
const NOTES = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760, 2093]
function chime(streak, gold) {
  const f = NOTES[Math.min(streak - 1, NOTES.length - 1)]
  synth.tone({ type: 'triangle', from: f, dur: 0.22, vol: 0.14 }, 'race-chime', 0.02)
  synth.tone({ type: 'sine', from: f * 2, dur: 0.34, vol: 0.06, at: 0.04 }, 'race-chime-hi', 0.02)
  if (gold) {
    ;[1047, 1319, 1568, 2093].forEach((n, i) => synth.tone({ type: 'triangle', from: n, dur: 0.16, vol: 0.1, at: 0.08 + i * 0.06 }, 'race-gold' + i, 0))
  }
}

// ---------------------------------------------------------------- per frame

function speedLine(g, y) {
  return {
    u: rand(-1, 1),
    y,
    len: rand(50, 150),
    k: rand(0.1, 0.26),
    w: rand(1, 2.6),
    sp: rand(2.4, 4.4),
    col: pick(['#9ff0ff', '#c9b3ff', '#ffffff', '#9ff0ff']),
  }
}

// A wider or narrower window: slide everything on the course to match.
function rescale(g) {
  const k = g.W / lv.w
  for (const r of lv.rings) r.x *= k
  for (const b of lv.buoys) b.x *= k
  for (const q of lv.queue) (q.ring ?? q.buoy).x *= k
  lv.lastX *= k
  lv.w = g.W
}

function update(g, dt) {
  if (g.W !== lv.w) rescale(g)
  const racing = (g.phase === 'intro' || g.phase === 'main') && !lv.done
  if (racing) lv.clock += dt
  lv.t = Math.max(0, lv.clock)
  const left = DURATION - lv.t

  if (g.phase === 'main' && !lv.done) {
    if (left <= RUSH && !lv.rushed) {
      lv.rushed = true
      g.popText(g.W / 2, g.H * 0.3, 'Faster!', '#ffb02e', 32, 1.6)
      g.popText(g.W / 2, g.H * 0.3 + 38, '10 seconds left', '#ffe23d', 18, 1.6)
      synth.noise({ dur: 0.8, vol: 0.22, freq: 300, to: 4000 }, 'race-whoosh')
    }
    if (left <= 5 && Math.ceil(left) < lv.beep) {
      lv.beep = Math.ceil(left)
      synth.tone({ type: 'square', from: 880, dur: 0.08, vol: 0.07 }, 'race-beep', 0.3)
    }
    if (left <= 0) {
      lv.done = true
      g.popText(g.W / 2, g.H * 0.22, "Time's up!", '#ffffff', 34, 1.4)
      synth.tone({ type: 'square', from: 1320, dur: 0.45, vol: 0.08 }, 'race-end', 0)
      synth.tone({ type: 'square', from: 990, dur: 0.45, vol: 0.06 }, 'race-end2', 0)
      g.levelDone()
    }
  }

  // the course: plan ahead, then let it fall
  const target = lv.rushed ? SPEED[2] : lv.t < 16 ? SPEED[0] : SPEED[1]
  lv.v += (target - lv.v) * Math.min(1, dt * 1.5)
  lv.boost += ((lv.rushed && !lv.done ? 1 : 0) - lv.boost) * Math.min(1, dt * 2)
  // the streaks die away once the race is over; the starfield does the warp out
  lv.fade = lv.done ? Math.max(0, lv.fade - dt * 0.8) : 1
  if (racing && lv.clock >= -LEAD) {
    while (!lv.closed && lv.clock >= lv.endAt - 1.2) plan(g)
    while (lv.queue.length && lv.queue[0].at <= lv.clock) {
      const q = lv.queue.shift()
      if (q.ring) spawnRing(g, q, lv.clock - q.at)
      else spawnBuoy(g, q, lv.clock - q.at)
    }
  }

  let lowY = -Infinity
  for (const p of g.players) if (p.alive) lowY = Math.max(lowY, p.y)
  lowY = Math.min(g.H + 30, lowY + 46)

  for (const r of lv.rings) {
    r.y += lv.v * dt
    r.flash = Math.max(0, r.flash - dt * 2.2)
    if (lv.done || r.fading) {
      // flown through by everyone, or time's up: it melts away
      r.alpha -= dt * 2.3
      if (r.alpha <= 0) r.dead = true
      continue
    }
    if (!r.miss) {
      for (const p of g.players) {
        if (!p.alive || r.got[p.id]) continue
        const rel = r.y - p.y
        const prev = r.rel[p.id]
        r.rel[p.id] = rel
        if (prev !== null && prev < 0 && rel >= 0 && Math.abs(p.x - r.x) <= r.rx + SLACK) score(g, r, p)
      }
      if (!r.dead && r.y > lowY) resolveRow(g, r.row)
    }
    if (r.y > g.H + 60) r.dead = true
  }
  lv.rings = lv.rings.filter((r) => !r.dead)

  for (const b of lv.buoys) {
    b.t += dt
    b.y += lv.v * dt
    b.x += b.vx * dt
    if (b.hit) {
      b.vx *= 1 - Math.min(1, dt * 0.8)
      b.spin *= 1 - Math.min(1, dt * 1.2)
    }
    b.rot = b.kind === 'sat' || b.hit ? b.rot + b.spin * dt : Math.sin(b.t * 1.7) * 0.22
    b.warn = Math.min(1, Math.max(0, (b.y - g.playerTop() + 160) / 120))
    // the first one gets a word of warning as it comes down to the ships
    if (!lv.hinted && b.y > g.playerTop() - 170 && g.phase === 'main') {
      lv.hinted = true
      g.popText(b.x, b.y - 44, "Don't bump the buoys!", '#ffb36a', 17, 2.2)
    }
    if (!b.hit && !lv.done) {
      for (const p of g.players) {
        if (!p.alive || shipState(p).cool > 0) continue
        if (g.near(p.x, p.y, b.x, b.y, b.r + BUMP_R)) {
          bump(g, b, p)
          break
        }
      }
    }
    if (b.y > g.H + 60 || b.x < -80 || b.x > g.W + 80) b.dead = true
  }
  lv.buoys = lv.buoys.filter((b) => !b.dead)

  // a bumped ship skids sideways and wobbles for a moment
  for (const p of g.players) {
    const st = shipState(p)
    st.cool = Math.max(0, st.cool - dt)
    if (st.wob <= 0 || !p.alive) continue
    st.wob = Math.max(0, st.wob - dt)
    const k = st.wob / WOBBLE
    p.x = g.clamp(p.x + st.kx * k * dt, 34, g.W - 34)
    p.tilt = Math.sin(st.wob * 26) * 1.7 * k
  }

  for (const f of lv.fx) {
    f.t += dt
    f.y += lv.v * dt
  }
  lv.fx = lv.fx.filter((f) => f.t < f.max)
  for (const s of lv.sparks) {
    s.x += s.vx * dt
    s.y += s.vy * dt
    s.vx *= 1 - Math.min(1, dt * 2.5)
    s.vy = s.vy * (1 - Math.min(1, dt * 2.5)) + 30 * dt
    s.rot += dt * 3
    s.life -= dt
  }
  lv.sparks = lv.sparks.filter((s) => s.life > 0)

  for (const l of lv.lines) {
    l.y += lv.v * l.sp * (1 + lv.boost * 0.9) * dt
    if (l.y - l.len * 2 > g.H) Object.assign(l, speedLine(g, rand(-140, -10)))
  }
}

// ---------------------------------------------------------------- drawing

function drawBack(g, ctx) {
  if (lv.fade > 0) drawSpeedLines(ctx, lv.lines, g.W, g.H, lv.boost, lv.fade)
  // farthest (newest, highest) first, so nearer rings paint over them
  const top = g.playerTop()
  for (let i = lv.rings.length - 1; i >= 0; i--) drawRingHalf(ctx, lv.rings[i], false, g.time, top)
}

function drawMid(g, ctx) {
  for (const b of lv.buoys) drawBuoy(ctx, b, g.time, b.warn)
}

function drawTop(g, ctx) {
  const top = g.playerTop()
  for (let i = lv.rings.length - 1; i >= 0; i--) drawRingHalf(ctx, lv.rings[i], true, g.time, top)
  for (const f of lv.fx) drawBurst(ctx, f)
  drawSparkles(ctx, lv.sparks)
  for (const p of g.players) {
    const st = shipState(p)
    if (p.alive && st.wob > 0) drawDizzy(ctx, p.x, p.y - 44, g.time, st.wob / WOBBLE)
  }
  if (g.phase === 'clear') drawResults(g, ctx)
}

// The clock is a ring too: it empties as the minute runs down.
function hud(g, ctx) {
  const cx = g.W / 2
  const left = Math.max(0, DURATION - lv.t)
  const rush = left <= RUSH && g.phase === 'main'
  const col = left <= 5 ? '#ff5a5a' : rush ? '#ffb02e' : '#3cf2c8'
  const pulse = rush ? 1 + 0.08 * Math.max(0, Math.sin(g.time * 12)) : 1
  const R = 22
  const cy = 33

  ctx.save()
  ctx.fillStyle = 'rgba(10,8,34,0.6)'
  ctx.beginPath()
  ctx.arc(cx, cy, R + 6, 0, TAU)
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = 'rgba(255,255,255,0.13)'
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, TAU)
  ctx.stroke()
  ctx.strokeStyle = col
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + TAU * (left / DURATION))
  ctx.stroke()
  ctx.translate(cx, cy)
  ctx.scale(pulse, pulse)
  ctx.font = `${left >= 9.5 ? 17 : 20}px ${g.FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = rush ? col : '#ffffff'
  ctx.fillText(String(Math.ceil(left)), 0, 1)
  ctx.restore()

  ctx.save()
  ctx.textBaseline = 'alphabetic'
  if (g.numPlayers === 1) {
    const st = lv.ships[0]
    group(g, ctx, cx - 44, -1, 'Rings', '#a9b3d6', String(st.rings), '#ffffff', null)
    group(g, ctx, cx + 44, 1, 'Combo', '#a9b3d6', `×${multOf(st.streak)}`, multOf(st.streak) > 1 ? '#ffe23d' : '#ffffff', st)
  } else {
    for (const p of g.players) {
      const st = shipState(p)
      const dir = p.id ? 1 : -1
      const label = `${p.pal.name} · ${st.rings} ${st.rings === 1 ? 'ring' : 'rings'}`
      group(g, ctx, cx + dir * 44, dir, label, p.pal.main, `×${multOf(st.streak)}`, multOf(st.streak) > 1 ? '#ffe23d' : '#ffffff', st)
    }
  }
  ctx.restore()
}

// A label over a big number, reading outward from the clock. With a ship's
// state it also shows pips filling toward the next combo step.
function group(g, ctx, x, dir, label, labelCol, big, bigCol, st) {
  ctx.textAlign = dir > 0 ? 'left' : 'right'
  ctx.font = `11px ${g.FONT}`
  ctx.fillStyle = labelCol
  ctx.fillText(label, x, 22)
  ctx.font = `24px ${g.FONT}`
  ctx.fillStyle = bigCol
  ctx.fillText(big, x, 50)
  if (!st) return
  const w = ctx.measureText(big).width
  const mult = multOf(st.streak)
  const fill = mult >= MAX_MULT ? STEP : st.streak % STEP
  for (let i = 0; i < STEP; i++) {
    const px = x + dir * (w + 12 + i * 11)
    ctx.fillStyle = i < fill ? (mult >= MAX_MULT ? '#ffe23d' : '#9ff0ff') : 'rgba(255,255,255,0.18)'
    ctx.beginPath()
    ctx.arc(px, 42, 3.8, 0, TAU)
    ctx.fill()
  }
}

// Under the "Bonus round complete!" banner: how the race went.
function drawResults(g, ctx) {
  const k = Math.min(1, Math.max(0, (g.phaseT - 0.8) * 3))
  if (k <= 0) return
  const two = g.numPlayers === 2
  const w = Math.min(g.W - 32, two ? 480 : 340)
  const h = 78
  const x = g.W / 2 - w / 2
  const y = g.H * 0.585 + (1 - k) * 16
  ctx.save()
  ctx.globalAlpha = k
  ctx.fillStyle = 'rgba(10,8,34,0.78)'
  ctx.strokeStyle = 'rgba(255,213,74,0.6)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, 16)
  ctx.fill()
  ctx.stroke()
  ctx.textAlign = 'center'
  const col = (p, cx) => {
    const st = shipState(p)
    ctx.font = `24px ${g.FONT}`
    ctx.fillStyle = two ? p.pal.main : '#ffd54a'
    ctx.fillText(`${st.rings} ${st.rings === 1 ? 'ring' : 'rings'}`, cx, y + 36)
    ctx.font = `12px ${g.FONT}`
    ctx.fillStyle = '#c9cff0'
    ctx.fillText(`Best streak ${st.best}`, cx, y + 60)
  }
  if (two) {
    col(g.players[0], g.W / 2 - w / 4)
    col(g.players[1], g.W / 2 + w / 4)
  } else col(g.players[0], g.W / 2)
  ctx.restore()
}

export default {
  levels: {
    race: {
      setup: reset,
      start(g) {
        lv.clock = 0
        g.popText(g.W / 2, g.H * 0.44, 'Fly through the rings!', '#9ff0ff', 24, 2.2)
      },
      update,
      progress: () => lv.t / DURATION,
      hud,
      drawBack,
      drawMid,
      drawTop,
      icon: drawIcon,
      noFire: true,
      noBubbles: true,
    },
  },
  enemies: {},
}
