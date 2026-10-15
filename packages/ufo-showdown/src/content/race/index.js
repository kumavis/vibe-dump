// Mission 3, the Hyperspace Run. The ships are flying through hyperspace,
// faster and faster: the course starts quick and keeps speeding up for a
// minute and a quarter, to about twice the speed by the finish gate. Glowing
// rings come down the tunnel in trails, and every so often the trail splits
// into two or three lanes with a badge of stars over each one. The gold lane
// is worth the most and is the hardest to fly; the green one is easy and
// worth the least. There's about a second to choose (course.js).
//
// Fly through a ring to score it. Rings in a row build a combo, and every
// ring is worth more the faster the course is going. A missed ring ends the
// combo, but only one in the lane you picked: the lanes you didn't take
// don't count against you.
//
// Nothing to shoot here. Space bombs sit in the lanes and saucers come
// swooping, parking, streaking and bombing through (hazards.js), and they all
// knock a ship out like anything else in the game, so the race can be lost.
//
// With two players both ships can take every ring and the points are each
// ship's own. A trail ring only counts as missed if nobody flew through it.

import { synth } from '../../audio.js'
import { V0, V1, FINISH, INTRO, SQUASH, speedAt, distAt, newCourse, planNext, latest } from './course.js'
import { lv, yRef, yOf, sAt } from './state.js'
import { bomb, saucer, launch } from './hazards.js'
import {
  RING_PALS,
  GOLD_PAL,
  LANE_COL,
  depth,
  makeStreak,
  moveStreak,
  drawHyperspace,
  drawRingHalf,
  drawBurst,
  drawSparkles,
  drawSign,
  drawArrow,
  drawDivider,
  drawPaint,
  drawFinishHalf,
  drawIcon,
} from './draw.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// Scoring. About 130 rings come down in a run for a ship that keeps to one
// route. A good run lands around 8–15k (the stars it pays are about score /
// 100): sticking to the easy lanes gets about 8–10k, braving every gold lane
// and living to tell the tale about 16k.
const BASE = 16 // points for a ring at the starting speed, times the combo
const GOLD = 4 // a gold ring is worth this many rings
const STEP = 5 // rings in a row for each step up the combo
const MAX_MULT = 4
const PATH = 250 // every ring of a gold lane without a slip (times the speed)
const SLACK = 6 // a ship's centre may be this far onto the rim and still count
const PAD = 150 // course items appear this far above the top of the screen

const multOf = (streak) => Math.min(MAX_MULT, 1 + Math.floor(streak / STEP))
// rings are worth more the faster the course is going: double at the finish
const speedK = (v) => 1 + clamp((v - V0) / (V1 - V0), 0, 1)
const round5 = (n) => Math.round(n / 5) * 5

function reset(g) {
  lv.clock = -INTRO
  lv.v = speedAt(lv.clock)
  lv.D = distAt(lv.clock)
  lv.done = false
  lv.course = newCourse(g.W)
  lv.queue = []
  lv.events = []
  lv.rings = []
  lv.deco = []
  lv.fx = []
  lv.sparks = []
  lv.bubbles = []
  lv.forks = new Map()
  lv.finish = null
  lv.finishAt = FINISH
  lv.ships = [0, 1].map(() => ({ rings: 0, streak: 0, best: 0, gold: 0, paths: 0, crashes: 0, alive: true }))
  lv.said = []
  lv.w = g.W
  lv.fade = 1
  lv.lines = Array.from({ length: 70 }, () => makeStreak(true))
  lv.warpN = Math.floor(V0 / 100)
  lv.flashT = 0
  lv.signFork = 0
  enqueue(lv.course.items.slice())
  g.warp(1.2 + lv.v / 160)
  if (g.debug) globalThis.__race = { lv, speedAt, distAt, FINISH, yOf: (s) => yOf(g, s) }
}

// ---------------------------------------------------------------- the course

// Planned items wait in a queue, in arrival order, until they come into view.
function enqueue(items) {
  for (const it of items) {
    it.s = distAt(it.at)
    if (it.at1 !== undefined) it.s1 = distAt(it.at1)
    if (it.kind === 'fork') {
      lv.forks.set(it.id, { xs: it.xs, types: it.types, counts: it.counts, took: [it.types.map(() => 0), it.types.map(() => 0)] })
    } else lv.queue.push(it)
  }
  lv.queue.sort((a, b) => a.at - b.at)
  const ev = lv.course.events.splice(0)
  if (ev.length) {
    lv.events.push(...ev)
    lv.events.sort((a, b) => a.at - b.at)
  }
}

function spawnItem(g, it) {
  const y = yOf(g, it.s)
  switch (it.kind) {
    case 'ring':
      lv.rings.push({
        s: it.s,
        x: it.x,
        y,
        rx: it.rx,
        gold: it.gold,
        pal: it.pal,
        fork: it.fork ?? null,
        lane: it.lane ?? null,
        got: [false, false],
        rel: [null, null],
        miss: false,
        done: false,
        alpha: 1,
        flash: 0,
        fading: false,
      })
      break
    case 'bomb':
      g.spawn('raceBomb', it.drift ? it.x0 : it.x, y, {
        s: it.s,
        cx: it.x,
        sway: it.sway ?? 0,
        role: it.role,
        ...(it.drift ? { x0: it.x0, x1: it.x } : {}),
      })
      break
    case 'bubble': {
      // a power-up in the easy lane: a heart if anyone's in trouble, else a shield
      const needy = g.players.some((p) => p.out || p.lives <= 1)
      g.dropBubble(it.x, y, needy ? 'heart' : 'shield')
      const b = g.bubbles[g.bubbles.length - 1]
      b.raceS = it.s
      lv.bubbles.push(b)
      break
    }
    case 'finish':
      lv.finish = { s: it.s, x: it.x, y, alpha: 1 }
      lv.finishAt = it.at
      break
    case 'sign':
      if (lv.signFork !== it.at) {
        // ding-dong: a fork is coming
        lv.signFork = it.at
        synth.tone({ type: 'triangle', from: 1175, dur: 0.16, vol: 0.12 }, 'race-sign', 0.3)
        synth.tone({ type: 'triangle', from: 880, dur: 0.26, vol: 0.12, at: 0.15 }, 'race-sign2', 0.3)
      }
      lv.deco.push({ ...it, y })
      break
    default:
      lv.deco.push({ ...it, y, y1: it.s1 !== undefined ? yOf(g, it.s1) : y })
  }
}

// A wider or narrower window: slide everything on the course to match.
function rescale(g) {
  const k = g.W / lv.w
  const sx = (o) => {
    for (const key of ['x', 'x0', 'x1', 'cx', 'lx', 'xs', 'xe']) if (typeof o[key] === 'number') o[key] *= k
  }
  for (const r of lv.rings) sx(r)
  for (const d of lv.deco) sx(d)
  for (const q of lv.queue) sx(q)
  for (const ev of lv.events) sx(ev)
  for (const b of lv.bubbles) sx(b)
  for (const f of lv.forks.values()) f.xs = f.xs.map((x) => x * k)
  for (const e of g.enemies) if (e.type === 'raceBomb' || e.type === 'raceSaucer') sx(e)
  const c = lv.course
  c.W = g.W
  for (const e of c.exits) e.x *= k
  for (const it of c.items) sx(it)
  if (lv.finish) lv.finish.x = g.W / 2
  lv.w = g.W
}

// ---------------------------------------------------------------- scoring

const ship = (p) => lv.ships[p.id]

// Where a ship's pop-up words go: next to it, or nudged out to its own side
// when the other ship is right alongside, so two scores don't print as one.
function textX(g, p) {
  const o = g.players.find((q) => q !== p && q.alive)
  if (!o || Math.abs(o.x - p.x) > 110) return p.x
  const side = Math.sign(p.x - o.x) || (p.id ? 1 : -1)
  return (p.x + o.x) / 2 + side * 54
}

// Pop-ups go under the ship, never up the screen where the course is coming
// from, and sink away behind it as if left behind. Words that land close
// together (a combo step, then a gold path) stack downward instead of
// printing over each other, and two ships earning the same word in the same
// moment get it said once.
function say(g, p, word, color, size = 18, life = 1.1) {
  const now = g.time
  lv.said = lv.said.filter((s) => now - s.t < s.life)
  if (lv.said.some((s) => s.word === word && now - s.t < 0.5 && Math.abs(s.px - p.x) < 220)) return
  const x = textX(g, p)
  let y = Math.min(p.y + 66, g.H - 34)
  for (let tries = 0; tries < 3; tries++) {
    const near = lv.said.find((s) => Math.abs(s.x - x) < 160 && Math.abs(s.y + 30 * (now - s.t) - y) < 24)
    if (!near) break
    y = Math.min(g.H - 16, y + 24)
  }
  lv.said.push({ word, t: now, life, px: p.x, x, y })
  const t = g.popText(x, y, word, color, size, life)
  t.rise = -30
}

function score(g, r, p) {
  const st = ship(p)
  r.got[p.id] = true
  const before = multOf(st.streak)
  st.streak++
  st.rings++
  if (r.gold) st.gold++
  st.best = Math.max(st.best, st.streak)
  const mult = multOf(st.streak)
  const pts = round5(BASE * (r.gold ? GOLD : 1) * mult * speedK(lv.v))
  g.addScore(p.id, pts)
  const t = g.popText(textX(g, p), p.y + 38, `+${pts}`, r.gold ? '#ffe23d' : p.pal.light, r.gold ? 22 : 16, 0.75)
  t.rise = -70
  if (mult > before) {
    say(g, p, `Combo ×${mult}!`, '#ffe23d', 20, 1.1)
    synth.tone({ type: 'square', from: 784, dur: 0.07, vol: 0.06, at: 0.1 }, 'race-up', 0)
    synth.tone({ type: 'square', from: 1175, dur: 0.12, vol: 0.06, at: 0.17 }, 'race-up2', 0)
  }
  chime(st.streak, r.gold)

  // every ring of a gold lane without a slip
  const f = r.fork && lv.forks.get(r.fork)
  if (f) {
    const n = ++f.took[p.id][r.lane]
    if (f.types[r.lane] === 'gold' && n === f.counts[r.lane]) {
      st.paths++
      const bonus = round5(PATH * speedK(lv.v))
      g.addScore(p.id, bonus)
      g.later(0.25, () => say(g, p, g.numPlayers === 1 ? `Gold path! +${bonus}` : 'Gold path!', '#ffd54a', 21, 1.4))
      ;[1047, 1319, 1568, 2093, 2637].forEach((n, i) => synth.tone({ type: 'triangle', from: n, dur: 0.14, vol: 0.1, at: 0.25 + i * 0.06 }, 'race-path' + i, 0))
    }
  }

  // the pop: a burst of light and sparkles flying off the rim
  const pal = r.gold ? GOLD_PAL : RING_PALS[r.pal % RING_PALS.length]
  lv.fx.push({ x: r.x, y: r.y, rx: r.rx, gold: r.gold, pal: r.pal, t: 0, max: 0.4 })
  const n = r.gold ? 18 : 10
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + rand(-0.2, 0.2)
    const sp = rand(60, 160)
    const life = rand(0.4, 0.7)
    lv.sparks.push({
      x: r.x + Math.cos(a) * r.rx,
      y: r.y + Math.sin(a) * r.rx * SQUASH,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp * 0.6,
      life,
      max: life,
      size: rand(4, r.gold ? 9 : 7),
      rot: rand(0, TAU),
      color: pick([pal.main, pal.light, '#ffffff']),
    })
  }
  g.sparks(p.x, p.y - 10, pal.light, 4)
  // the ring flashes white and carries on past the ship as it fades, so the
  // ship is seen to fly right through it (with two players, it stays half
  // there until the other ship has had its go)
  r.flash = 1
  if (g.players.every((q) => !q.alive || r.got[q.id])) r.fading = true
  else r.alpha = 0.6
}

// The lane of a fork a ship is in: whichever it's nearest.
function laneOf(f, x) {
  let best = 0
  for (let k = 1; k < f.xs.length; k++) if (Math.abs(f.xs[k] - x) < Math.abs(f.xs[best] - x)) best = k
  return best
}

// A ring has gone past everyone. If nobody flew through it, it's a miss for
// whoever it was meant for: the nearest ship on a trail, or in a fork any
// ship that picked that lane.
function resolveRing(g, r) {
  r.done = true
  if (r.got[0] || r.got[1]) return
  r.miss = true
  const ships = g.alive()
  let blamed = []
  if (r.fork) {
    const f = lv.forks.get(r.fork)
    if (f) blamed = ships.filter((p) => laneOf(f, p.x) === r.lane)
    for (const p of blamed) f.took[p.id][r.lane] = -99
  } else if (ships.length) {
    blamed = [ships.reduce((a, b) => (Math.abs(a.x - r.x) <= Math.abs(b.x - r.x) ? a : b))]
  }
  for (const p of blamed) endCombo(g, p)
}

function endCombo(g, p) {
  const st = ship(p)
  if (st.streak >= STEP) {
    say(g, p, 'Combo over', '#b8bde0', 16, 1)
    synth.tone({ type: 'triangle', from: 440, to: 210, dur: 0.32, vol: 0.1 }, 'race-lost', 0.2)
  }
  st.streak = 0
}

// Up a pentatonic scale as the streak grows, so a long run sings.
const NOTES = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760, 2093]
function chime(streak, gold) {
  const f = NOTES[Math.min(streak - 1, NOTES.length - 1)]
  synth.tone({ type: 'triangle', from: f, dur: 0.2, vol: 0.13 }, 'race-chime', 0.02)
  synth.tone({ type: 'sine', from: f * 2, dur: 0.3, vol: 0.05, at: 0.04 }, 'race-chime-hi', 0.02)
  if (gold) synth.tone({ type: 'triangle', from: 2093, dur: 0.14, vol: 0.07, at: 0.07 }, 'race-gold', 0.02)
}

// ---------------------------------------------------------------- the finish

function finish(g) {
  lv.done = true
  g.levelDone()
  g.flash(0.55)
  g.shake(8)
  g.warp(1.2)
  g.popText(g.W / 2, g.H - 60, 'Finish!', '#ffe23d', 34, 1.6).rise = -10
  ;[784, 988, 1175, 1568].forEach((f, i) => synth.tone({ type: 'square', from: f, dur: i === 3 ? 0.5 : 0.12, vol: 0.08, at: i * 0.1 }, 'race-fin' + i, 0))
  synth.noise({ dur: 1.2, vol: 0.25, freq: 5000, to: 200 }, 'race-drop-out', 0)
  // every bomb left on the course goes pop, like fireworks
  const bombs = g.enemies.filter((e) => e.type === 'raceBomb' && !e.dead)
  bombs.forEach((e, i) =>
    g.later(0.15 + i * 0.06, () => {
      if (e.dead) return
      e.dead = true
      g.explode(e.x, e.y, pick(['#ff7bd8', '#ffd54a', '#9ff0ff']), 0.6)
    }),
  )
}

// ---------------------------------------------------------------- per frame

function update(g, dt) {
  if (g.W !== lv.w) rescale(g)
  const racing = (g.phase === 'intro' || g.phase === 'main') && !lv.done
  if (racing) {
    lv.clock += dt
    lv.v = speedAt(lv.clock)
    lv.D = distAt(lv.clock)
    g.warp(1.2 + lv.v / 160)
    if (Math.floor(lv.v / 100) > lv.warpN) {
      lv.warpN = Math.floor(lv.v / 100)
      lv.flashT = 1
      synth.noise({ dur: 0.9, vol: 0.2, freq: 300, to: 4500 }, 'race-warp', 0.5)
    }
  } else {
    // dropping out of hyperspace: the course slows to a drift
    lv.v = Math.max(80, lv.v - dt * 500)
    lv.D += lv.v * dt
  }
  lv.flashT = Math.max(0, lv.flashT - dt * 1.5)
  lv.fade = lv.done ? Math.max(0, lv.fade - dt * 0.9) : 1

  // plan far enough ahead to cover the whole screen, then bring things on
  // as they come into view
  if (racing) {
    const ahead = (g.H + PAD) / Math.max(lv.v, 100) + 1.5
    while (!lv.course.done && latest(lv.course) < lv.clock + ahead) enqueue(planNext(lv.course))
    while (lv.queue.length && yOf(g, lv.queue[0].s) > -PAD) spawnItem(g, lv.queue.shift())
    while (lv.events.length && lv.events[0].at <= lv.clock) {
      const ev = lv.events.shift()
      if (g.phase === 'main') launch(g, ev)
    }
  }

  // ships knocked out lose their combo
  for (const p of g.players) {
    const st = ship(p)
    if (st.alive && !p.alive) {
      st.crashes++
      endCombo(g, p)
      for (const f of lv.forks.values()) for (let k = 0; k < f.took[p.id].length; k++) f.took[p.id][k] = -99
    }
    st.alive = p.alive
  }

  let lowY = -Infinity
  for (const p of g.players) if (p.alive) lowY = Math.max(lowY, p.y)
  lowY = Math.min(g.H + 30, (lowY === -Infinity ? yRef(g) : lowY) + 46)

  for (const r of lv.rings) {
    r.y = yOf(g, r.s)
    r.flash = Math.max(0, r.flash - dt * 2.2)
    if (lv.done || r.fading) {
      // flown through by everyone, or the race is over: it melts away
      r.alpha -= dt * 2.3
      if (r.alpha <= 0) r.dead = true
      continue
    }
    if (!r.done) {
      for (const p of g.players) {
        if (!p.alive || r.got[p.id]) continue
        const rel = r.y - p.y
        const prev = r.rel[p.id]
        r.rel[p.id] = rel
        if (prev !== null && prev < 0 && rel >= 0 && Math.abs(p.x - r.x) <= r.rx + SLACK) score(g, r, p)
      }
      if (r.y > lowY) resolveRing(g, r)
    }
    if (r.y > g.H + 60) r.dead = true
  }
  lv.rings = lv.rings.filter((r) => !r.dead)

  for (const d of lv.deco) {
    d.y = yOf(g, d.s)
    if (d.s1 !== undefined) d.y1 = yOf(g, d.s1)
    if ((d.y1 ?? d.y) > g.H + 140) d.dead = true
  }
  lv.deco = lv.deco.filter((d) => !d.dead)

  // power-up bubbles ride along with the course (unless a magnet has them)
  lv.bubbles = lv.bubbles.filter((b) => !b.dead && g.bubbles.includes(b))
  for (const b of lv.bubbles) {
    if (b.pulledBy) b.raceS = sAt(g, b.y)
    else if (dt > 0) b.vy = (yOf(g, b.raceS) - b.y) / dt
  }

  // the finish gate: through it, and the race is won (as long as somebody's
  // still in it; a gate flying past a wrecked team doesn't count)
  if (lv.finish) {
    const f = lv.finish
    f.y = yOf(g, f.s)
    if (!lv.done) {
      const ships = g.alive()
      const line = ships.length ? Math.min(...ships.map((p) => p.y)) : yRef(g)
      if (f.y >= line && g.phase === 'main' && g.players.some((p) => !p.out)) finish(g)
    } else f.alpha = Math.max(0, f.alpha - dt * 1.2)
  }

  for (const f of lv.fx) {
    f.t += dt
    f.y += lv.v * dt
  }
  lv.fx = lv.fx.filter((f) => f.t < f.max)
  for (const s of lv.sparks) {
    s.x += s.vx * dt
    s.y += (s.vy + lv.v * 0.6) * dt
    s.vx *= 1 - Math.min(1, dt * 2.5)
    s.vy *= 1 - Math.min(1, dt * 2.5)
    s.rot += dt * 3
    s.life -= dt
  }
  lv.sparks = lv.sparks.filter((s) => s.life > 0)

  for (const l of lv.lines) {
    moveStreak(l, lv.v, g.H, dt)
    if (l.z - l.len > 1.1) Object.assign(l, makeStreak(false))
  }
}

// ---------------------------------------------------------------- drawing

function drawBack(g, ctx) {
  const heat = clamp(lv.clock / lv.finishAt, 0, 1)
  drawHyperspace(ctx, g.W, g.H, { lines: lv.lines, D: lv.D, v: lv.v, heat, fade: lv.fade }, g.time)
  const top = g.playerTop()
  const fadeIn = (y) => clamp((y + 90) / 140, 0, 1)
  // painted on the course: words, lane markings and the arrows at a fork
  for (const d of lv.deco) {
    if (d.kind === 'paint') drawPaint(ctx, d.text, d.x, d.y, d.color, d.big, g.FONT, fadeIn(d.y) * clamp((g.H - d.y) / 200, 0, 1) * lv.fade)
    else if (d.kind === 'divider') drawDivider(ctx, d.x, d.y, d.y1, g.time, lv.fade)
    else if (d.kind === 'arrow') drawArrow(ctx, d.x0, d.y, d.x, d.y1, LANE_COL[d.type], g.time, fadeIn(d.y1) * lv.fade)
  }
  if (lv.finish) drawFinishHalf(ctx, lv.finish, false, g.W, g.time, g.FONT)
  // farthest (newest, highest) first, so nearer rings paint over them
  for (let i = lv.rings.length - 1; i >= 0; i--) drawRingHalf(ctx, lv.rings[i], false, g.time, top)
  // each lane's badge floats over its entry ring
  for (const d of lv.deco) {
    if (d.kind !== 'sign') continue
    const { s, a } = depth(d.y, top)
    // shrinks less than its ring with distance: it's there to be read early
    const k = 0.75 + 0.25 * s
    drawSign(ctx, d.x, d.y - d.rx * SQUASH * s - 28 * k, k, d.tier, d.type, g.time, a * lv.fade)
  }
}

function drawTop(g, ctx) {
  const top = g.playerTop()
  for (let i = lv.rings.length - 1; i >= 0; i--) drawRingHalf(ctx, lv.rings[i], true, g.time, top)
  if (lv.finish) drawFinishHalf(ctx, lv.finish, true, g.W, g.time, g.FONT)
  for (const f of lv.fx) drawBurst(ctx, f)
  drawSparkles(ctx, lv.sparks)
  if (g.phase === 'clear') drawResults(g, ctx)
}

// ---------------------------------------------------------------- the HUD

// A speedometer in the middle, the rings and combo to its left, the distance
// to the finish to its right (or, with two players, a ship's rings and combo
// either side), and a strip under it all counting down to the finish flag.
function hud(g, ctx) {
  const cx = g.W / 2
  const span = Math.min(g.W * 0.46, 520)
  ctx.save()
  gauge(g, ctx, cx, 31)
  ctx.textBaseline = 'alphabetic'
  if (g.numPlayers === 1) {
    const st = lv.ships[0]
    group(g, ctx, cx - 42, -1, `${st.rings} ${st.rings === 1 ? 'ring' : 'rings'}`, '#a9b3d6', `×${multOf(st.streak)}`, multOf(st.streak) > 1 ? '#ffe23d' : '#ffffff', st)
    const left = Math.max(0, distAt(lv.finishAt) - lv.D) / 1000
    group(g, ctx, cx + 42, 1, 'To the finish', '#a9b3d6', `${left.toFixed(1)} km`, left < 5 ? '#ffb02e' : '#ffffff', null)
  } else {
    for (const p of g.players) {
      const st = ship(p)
      const dir = p.id ? 1 : -1
      const label = `${p.pal.name} · ${st.rings} ${st.rings === 1 ? 'ring' : 'rings'}`
      group(g, ctx, cx + dir * 42, dir, label, p.pal.main, `×${multOf(st.streak)}`, multOf(st.streak) > 1 ? '#ffe23d' : '#ffffff', st)
    }
  }
  track(g, ctx, cx - span / 2 + 10, cx + span / 2 - 10, 57)
  ctx.restore()
}

// A dial that sweeps round as the course speeds up, reading out the warp.
function gauge(g, ctx, cx, cy) {
  const R = 23
  const k = clamp((lv.v - 150) / (V1 - 150), 0, 1)
  const a0 = Math.PI * 0.8
  const a1 = Math.PI * 2.2
  const col = lv.v > 560 ? '#ff5a5a' : lv.v > 450 ? '#ffb02e' : '#3cf2c8'
  const pulse = 1 + lv.flashT * 0.12
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(pulse, pulse)
  ctx.fillStyle = 'rgba(10,8,34,0.66)'
  ctx.beginPath()
  ctx.arc(0, 0, R + 7, 0, TAU)
  ctx.fill()
  ctx.lineCap = 'round'
  ctx.lineWidth = 5
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.beginPath()
  ctx.arc(0, 0, R, a0, a1)
  ctx.stroke()
  ctx.strokeStyle = col
  ctx.beginPath()
  ctx.arc(0, 0, R, a0, a0 + (a1 - a0) * k)
  ctx.stroke()
  // the needle
  const an = a0 + (a1 - a0) * k + Math.sin(g.time * 40) * 0.02 * k
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(Math.cos(an) * 6, Math.sin(an) * 6)
  ctx.lineTo(Math.cos(an) * (R - 4), Math.sin(an) * (R - 4))
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `14px ${g.FONT}`
  ctx.fillStyle = lv.flashT > 0 ? '#ffe23d' : '#ffffff'
  ctx.fillText((lv.v / 100).toFixed(1), 0, 2)
  ctx.font = `8px ${g.FONT}`
  ctx.fillStyle = '#a9b3d6'
  ctx.fillText('WARP', 0, R - 1)
  ctx.restore()
}

// A label over a big number, reading outward from the dial. With a ship's
// state it also shows pips filling toward the next combo step.
function group(g, ctx, x, dir, label, labelCol, big, bigCol, st) {
  ctx.textAlign = dir > 0 ? 'left' : 'right'
  ctx.font = `11px ${g.FONT}`
  ctx.fillStyle = labelCol
  ctx.fillText(label, x, 19)
  ctx.font = `22px ${g.FONT}`
  ctx.fillStyle = bigCol
  ctx.fillText(big, x, 44)
  if (!st) return
  const w = ctx.measureText(big).width
  const mult = multOf(st.streak)
  const fill = mult >= MAX_MULT ? STEP : st.streak % STEP
  for (let i = 0; i < STEP; i++) {
    const px = x + dir * (w + 11 + i * 10)
    ctx.fillStyle = i < fill ? (mult >= MAX_MULT ? '#ffe23d' : '#9ff0ff') : 'rgba(255,255,255,0.18)'
    ctx.beginPath()
    ctx.arc(px, 36, 3.4, 0, TAU)
    ctx.fill()
  }
}

// The run from start to finish: a strip with the ships on it and a
// chequered flag at the end.
function track(g, ctx, x0, x1, y) {
  const k = clamp(lv.D / distAt(lv.finishAt), 0, 1)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.roundRect(x0, y - 2, x1 - x0, 4, 2)
  ctx.fill()
  const grad = ctx.createLinearGradient(x0, 0, x1, 0)
  grad.addColorStop(0, '#3cf2c8')
  grad.addColorStop(0.6, '#ffb02e')
  grad.addColorStop(1, '#ff5a5a')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.roundRect(x0, y - 2, Math.max(4, (x1 - x0) * k), 4, 2)
  ctx.fill()
  // the flag
  const fx = x1 + 3
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#1a1830' : '#ffffff'
      ctx.fillRect(fx + i * 3, y - 6 + j * 3, 3, 3)
    }
  }
  ctx.fillStyle = '#c9cfe6'
  ctx.fillRect(fx - 1, y - 6, 1.5, 11)
  // a pip for where the ships are
  const px = x0 + (x1 - x0) * k
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.moveTo(px, y - 6)
  ctx.lineTo(px + 4, y + 3)
  ctx.lineTo(px - 4, y + 3)
  ctx.closePath()
  ctx.fill()
}

// Under the "You made it through!" banner: how the run went.
function drawResults(g, ctx) {
  const k = Math.min(1, Math.max(0, (g.phaseT - 0.8) * 3))
  if (k <= 0) return
  const two = g.numPlayers === 2
  const w = Math.min(g.W - 32, two ? 500 : 360)
  const h = 84
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
  const forks = [...lv.forks.keys()].length
  const col = (p, cx) => {
    const st = ship(p)
    ctx.font = `24px ${g.FONT}`
    ctx.fillStyle = two ? p.pal.main : '#ffd54a'
    ctx.fillText(`${st.rings} ${st.rings === 1 ? 'ring' : 'rings'}`, cx, y + 34)
    ctx.font = `12px ${g.FONT}`
    ctx.fillStyle = '#c9cfe6'
    ctx.fillText(`Best streak ${st.best}`, cx, y + 56)
    ctx.fillStyle = st.paths ? '#ffd54a' : '#a9b3d6'
    ctx.fillText(`Gold paths ${st.paths} of ${forks}`, cx, y + 73)
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
        // punch it: the jump to full speed
        g.flash(0.3)
        synth.noise({ dur: 1, vol: 0.3, freq: 250, to: 5000, q: 1.5 }, 'race-punch', 0)
        // the hint goes under the ships, where it won't hide the first rings
        g.popText(g.W / 2, Math.min(g.H - 40, yRef(g) + 78), 'Fly through the rings!', '#9ff0ff', 22, 2.6).rise = -6
      },
      update,
      progress: () => clamp(lv.clock / lv.finishAt, 0, 1),
      hud,
      drawBack,
      drawTop,
      icon: drawIcon,
      noFire: true,
      noBubbles: true,
    },
  },
  enemies: { raceBomb: bomb, raceSaucer: saucer },
}
