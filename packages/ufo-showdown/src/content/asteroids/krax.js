// Krax the rock hauler: an armoured mining barge with a pilot in a hard hat,
// a hopper full of rocks and two claw arms to throw them with. Lasers just
// bounce off its plating. What hurts it is the Ion Cannon, a friendly turret
// that rises out of the ground by the ships and fires a huge beam whenever a
// ship flies a glowing power core into it.
//
// Krax's armour plates come off one beam at a time. Every power core comes out
// of a glowing rock Krax throws, and only cracks out when a ship shoots the
// rock open: one that's missed falls away with its core. So Krax never runs
// dry: whenever no core is floating, carried or on its way, its next move is
// always another glowing rock.
//
// The first time Krax shows up, a short cutscene introduces the cannon (see
// "the intro" below): lasers pinging off the armour, the cannon rising into a
// spotlight, and the three steps that crack Krax, acted out.
//
// The fight's own pieces (cores, pad, beam, the intro) live in `fight`. The
// Asteroid Belt level ticks and draws them through its hooks, so the beam can
// be drawn over everything and outlast Krax by a moment.

import { drawAlien, drawStar, drawPlayerShot } from '../../art.js'
import { hexA } from '../../stars.js'
import { synth } from '../../audio.js'
import { spawnRock, moveRock, rockSprite, drawRock, drawHalo, burstDebris, CORE, PALS } from './rocks.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]

const BEAM = 25 // damage per Ion Cannon shot: five shots crack Krax with one player
const CHARGE = 1.0 // seconds the cannon hums before it fires
const BEAM_T = 0.95
const GRAB_R = 58 // how close a ship has to fly to scoop up a core
const PAD_R = 92 // and how close to the cannon to load it
const DRIFT = 92 // how fast a glowing rock falls once it's settled: time to get under it
const LIFT = 52 // how far the cannon stands up out of the letterbox bar in the intro

// The intro's beats, in seconds: lasers bounce off, the cannon rises, then the
// three steps one at a time (the ghost rock is lobbed at `toss`), then the fight.
const INTRO = { cannon: 2.0, step1: 3.9, toss: 4.25, step2: 5.0, step3: 5.7, end: 6.7 }

const SKIN = '#8be04e'
const HAT = '#ffd23d'
const STEEL = ['#e2e8f8', '#9aa5c8', '#5c678f', '#2c3352']
const EMBER = '#ff8a2e'

let fight = null
// main.js calls a boss's shot() and hits() without the game object (the
// README says it passes it), so Krax keeps the one it was created with.
let G = null

export function resetFight() {
  fight = null
}

export const currentFight = () => fight

function newFight(g, hp) {
  return {
    t: 0,
    needed: Math.ceil(hp / BEAM),
    delivered: 0,
    cores: [], // floating free, waiting to be grabbed
    loads: [], // flying from a ship into the cannon
    motes: [], // charge sparkles drawn into the muzzle
    pad: { x: g.W / 2, y: g.H + 100, rise: 0, slide: 0, state: 'idle', st: 0, queue: [], aim: -Math.PI / 2, glow: 0, recoil: 0 },
    raised: false, // the cannon stays underground until the intro calls it up
    lift: 0, // follows the letterbox bars, so the cannon stands on top of them
    intro: null,
    beam: null,
    bounceT: -99,
    misses: 0, // glowing rocks that fell past unopened
    told: {},
    over: false,
  }
}

// Say something helpful the first time it comes up.
function tell(f, g, key, x, y, text, color = CORE, size = 20) {
  if (f.told[key]) return
  f.told[key] = true
  g.popText(x, y, text, color, size, 2)
}

// ================================================================ the boss

const SEQ = ['throw', 'volley', 'throw', 'laser', 'throw', 'spill']

function makeArm(side) {
  const arm = { side, raise: 0, want: 0, fast: false, has: true, reload: 0, kind: 'plain', pop: 0 }
  newRock(arm)
  return arm
}

function newRock(arm) {
  arm.pal = (Math.random() * PALS.length) | 0
  arm.variant = (Math.random() * 5) | 0
  arm.rot = rand(0, TAU)
  setRockKind(arm, 'plain')
}

function setRockKind(arm, kind) {
  arm.kind = kind
  arm.spr = kind === 'core' ? rockSprite('mid', 2, 'core', arm.variant) : rockSprite('big', arm.pal, kind, arm.variant)
  arm.k = kind === 'core' ? 1.2 : 0.85
}

function makePlates() {
  const out = []
  for (const side of [-1, 1]) {
    for (const [px, py] of [[86, -24], [128, -24], [86, 16], [124, 16]]) out.push({ x: side * px, y: py, on: true, seed: Math.random() * 9 })
  }
  return out
}

// Rocks heaped in the hopper, with one power core peeking out of the pile.
function makeHeap() {
  const spots = [[-70, -92, 'mid'], [-30, -100, 'mid'], [16, -96, 'mid'], [56, -98, 'mid'], [86, -90, 'small'], [-94, -88, 'small']]
  const heap = spots.map(([x, y, size], i) => ({ x, y, k: 0.8, rot: rand(0, TAU), flash: 0, spr: rockSprite(size, i % PALS.length, 'plain') }))
  heap.splice(2, 0, { x: -6, y: -106, k: 0.62, rot: 0.5, flash: 0, spr: rockSprite('mid', 2, 'core', 0), core: true })
  return heap
}

export const krax = {
  name: 'Krax',
  warnSub: 'Rock hauler ahead!',
  hudName: (b) => (b.hp < b.maxHp * 0.5 ? 'Krax — the armour is cracking!' : 'Krax the Rock Hauler'),
  create(g) {
    G = g
    const hp = Math.round(100 * g.hpMult())
    fight = newFight(g, hp)
    return {
      x: g.W / 2,
      y: -220,
      ty: 200,
      r: 170,
      hp,
      maxHp: hp,
      fight,
      sway: 0,
      rest: 0.9,
      attack: null,
      at: 0,
      step: 0,
      seqI: 1, // the opening core throw stands in for the first 'throw'
      arms: [makeArm(-1), makeArm(1)],
      nextSide: Math.random() < 0.5 ? -1 : 1,
      firstCore: true,
      gun: 0,
      gunFlash: [0, 0],
      emit: 0,
      rattle: 0,
      stun: 0,
      reel: 0,
      scoutT: 10,
      plates: makePlates(),
      heap: makeHeap(),
      angry: false,
    }
  },

  update(b, dt, g) {
    const f = b.fight
    for (const arm of b.arms) {
      arm.raise += (arm.want - arm.raise) * Math.min(1, dt * (arm.fast ? 16 : 5))
      arm.pop = Math.max(0, arm.pop - dt * 3)
      if (!arm.has && (arm.reload -= dt) <= 0) {
        arm.has = true
        arm.pop = 1
        newRock(arm)
      }
    }
    b.gunFlash = b.gunFlash.map((v) => Math.max(0, v - dt * 6))
    b.rattle = Math.max(0, b.rattle - dt)
    b.reel = Math.max(0, b.reel - dt * 1.4)
    b.tilt = Math.sin(b.t * 24) * 0.05 * b.reel
    if (g.bossEnter(b, dt)) return
    // the moment Krax pulls up, the intro: it holds its fire and the sky stays
    // empty until the show is over or skipped
    if (!f.intro) startIntro(b, g, f)
    if (!f.intro.done) {
      runIntro(b, g, f, dt)
      return
    }

    b.angry = b.hp < b.maxHp * 0.5
    const hi = swayRange(g)[1]
    if (b.attack !== 'laser') {
      b.sway += dt * (b.attack ? 0.12 : 0.4)
      const tx = g.W / 2 + Math.sin(b.sway) * (hi - g.W / 2)
      b.x += (tx - b.x) * Math.min(1, dt * 1.5)
    }
    b.y = b.ty + Math.sin(b.t * 1.2) * 8 - b.reel * 16

    // the holes in its armour fizz
    for (const pl of b.plates) {
      if (!pl.on && Math.random() < dt * 2.5) g.sparks(b.x + pl.x + rand(-12, 12), b.y + pl.y + rand(-12, 12), pick([EMBER, '#ffe23d']), 2)
    }

    if (b.stun > 0) {
      b.stun -= dt
      b.emit = Math.max(0, b.emit - dt * 3)
      b.gun = Math.max(0, b.gun - dt * 3)
      return
    }
    if (!b.attack) {
      b.gun = Math.max(0, b.gun - dt * 3)
      b.emit = Math.max(0, b.emit - dt * 3)
      if ((b.rest -= dt) <= 0) startAttack(b, g, f)
    } else runAttack(b, g, f, dt)

    if ((b.scoutT -= dt) <= 0) {
      for (const fx of [0.18, 0.82]) g.spawn('scout', g.W * fx, -40, { path: 'fall', speed: 120 })
      b.scoutT = b.angry ? 9 : 12
    }
  },

  shot(b, x, y, owner, g = G) {
    const dx = x - b.x
    const dy = y - b.y
    const hull = (dx / 165) ** 2 + ((dy - 8) / 68) ** 2 <= 1
    const hopper = Math.abs(dx) < 100 && dy > -112 && dy < -40
    if (!hull && !hopper) return false
    // the armour shrugs lasers off
    g.sparks(x, y, '#fff3b0', 3)
    g.sfx.ting()
    const f = b.fight
    if (f && !b.entering && !showing(f) && f.t - f.bounceT > 9) {
      f.bounceT = f.t
      g.popText(x, y + 40, 'Lasers bounce off!', '#ffd7a0', 16, 1.3)
    }
    return true
  },

  hits: (b, p) => ((p.x - b.x) / 165) ** 2 + ((p.y - b.y - 8) / 80) ** 2 < 1,

  nova(b, owner, g) {
    // a nova only scuffs the paint: it can't finish Krax off
    if (b.entering) return
    b.hp = Math.max(1, b.hp - 4)
    b.flash = 1
    b.hurt = 0.6
    g.addScore(owner, 100)
  },

  draw(b, g, ctx) {
    drawKrax(ctx, b, g)
    if (b.attack === 'throw' && b.step === 0 && b.arm) drawAim(ctx, b, g.time)
  },

  hud(b, g, ctx) {
    drawHint(b, g, ctx)
  },

  explodeAt: (b) => [b.x + rand(-150, 150), b.y + rand(-100, 60)],

  defeated(b, g) {
    for (const p of g.players) if (p.carry?.krax) p.carry = null
    const f = b.fight
    if (!f) return
    for (const c of f.cores) g.sparks(c.x, c.y, CORE, 8)
    f.cores = []
    f.loads = []
    f.pad.queue = []
    f.over = true // the pad sinks back into the ground, then the fight is gone
    g.splash(f.pad.x, f.pad.y - 20, CORE)
  },
}

// ---------------------------------------------------------------- attacks

function startAttack(b, g, f) {
  // With no core anywhere (none floating, carried or on its way) Krax always
  // reaches for another glowing rock, whatever was due next: the fight can't
  // stall, however many rocks get away.
  const dry = !b.firstCore && supply(f, g) === 0 && f.delivered < f.needed
  const must = b.firstCore || dry
  let kind = must ? 'throw' : SEQ[b.seqI++ % SEQ.length]
  if (kind === 'spill' && !b.angry) kind = 'volley'
  let arm = null
  if (kind === 'throw') {
    arm = b.arms.find((a) => a.has && a.side === b.nextSide) ?? b.arms.find((a) => a.has)
    if (!arm && must) {
      // both claws still reloading: the glowing rock is a moment away
      b.rest = 0.2
      return
    }
    if (!arm) kind = 'volley'
  }
  b.attack = kind
  b.at = 0
  b.step = 0
  if (kind === 'throw') {
    b.nextSide = -arm.side
    b.arm = arm
    const core = must || short(f, g)
    b.firstCore = false
    setRockKind(arm, core ? 'core' : Math.random() < (b.angry ? 0.55 : 0.25) ? 'hot' : 'plain')
    arm.want = 1
    arm.fast = false
    b.tgt = core ? coreLanding(g) : shipTarget(g)
    if (core) synth.tone({ type: 'sine', from: 660, to: 990, dur: 0.25, vol: 0.08 }, 'krax-core', 0.2)
    if (dry && f.misses) {
      const [rx, ry] = heldRock(b, arm)
      g.popText(g.clamp(rx, 140, g.W - 140), ry + 70, 'Another glowing rock!', CORE, 18, 1.6)
    }
  } else if (kind === 'volley') {
    synth.tone({ type: 'square', from: 220, to: 520, dur: 0.6, vol: 0.05 }, 'krax-charge', 0.3)
  } else if (kind === 'laser') {
    const pl = g.alive()
    const avg = pl.length ? pl.reduce((s, p) => s + p.x, 0) / pl.length : g.W / 2
    b.sweep = avg > b.x ? 1 : -1
    const [lo, hi] = swayRange(g)
    if ((b.sweep > 0 && b.x > hi - 150) || (b.sweep < 0 && b.x < lo + 150)) b.sweep *= -1
    b.laser = {
      x: b.x,
      y0: b.y + 92,
      w: 44,
      warn: 1.3,
      active: 2.0,
      sweep: b.sweep,
      track(L) {
        L.x = b.x
        L.y0 = b.y + 92
      },
      draw: drawMiningLaser,
    }
    g.lasers.push(b.laser)
    g.sfx.laserWarn()
  } else if (kind === 'spill') {
    b.rattle = 0.85
    for (let i = 0; i < 4; i++) synth.noise({ dur: 0.12, vol: 0.18, freq: 900, to: 300, at: i * 0.18 }, 'krax-rattle' + i, 0)
  }
}

function runAttack(b, g, f, dt) {
  b.at += dt
  const done = () => {
    b.attack = null
    b.rest = b.angry ? 0.75 : 1.15
  }
  switch (b.attack) {
    case 'throw': {
      const arm = b.arm
      // track the target, then lock on for the last moment so the aim line
      // shows exactly where the rock will go
      if (b.at < 0.5 && arm.kind !== 'core') b.tgt = shipTarget(g, b.tgt)
      const [rx, ry] = heldRock(b, arm)
      const [vx, vy] = throwVel(b, g, arm, rx, ry)
      b.aimA = Math.atan2(vy, vx)
      if (b.step === 0 && b.at >= 0.95) {
        b.step = 1
        const o = { spr: arm.spr, pal: arm.kind === 'core' ? 2 : arm.pal, k: arm.k, rot: arm.rot, vx, vy, entered: true }
        if (arm.kind === 'core') {
          spawnRock(g, 'mid', rx, ry, { ...o, kind: 'core', spin: 0.8, tx: b.tgt.x })
          tell(f, g, 'shoot', g.clamp(b.tgt.x, 160, g.W - 160), g.playerTop() + 20, 'Shoot it open!', CORE, 22)
        } else spawnRock(g, 'big', rx, ry, { ...o, kind: arm.kind, hot: arm.kind === 'hot' ? 1.5 : undefined })
        arm.has = false
        arm.reload = 1.3
        arm.want = -0.45
        arm.fast = true
        synth.noise({ dur: 0.35, vol: 0.25, freq: 1400, to: 200 }, 'krax-whoosh', 0.1)
      }
      if (b.at > 1.15) {
        arm.want = 0
        arm.fast = false
      }
      if (b.at > 1.45) done()
      break
    }
    case 'volley': {
      const n = b.angry ? 5 : 4
      b.gun = b.at < 0.7 ? b.at / 0.7 : 1
      if (b.at >= 0.7 + b.step * 0.4 && b.step < n) {
        const side = b.step % 2 ? 1 : -1
        const [gx, gy] = gunPos(b, side)
        const p = g.nearestPlayer(gx, gy)
        // every other burst leads the ship, aimed a little ahead of where
        // it's flying: a ship that keeps to one straight line gets caught
        let aim = p
        if (p && b.step % 2) {
          const t = Math.hypot(p.x - gx, p.y - gy) / 263
          aim = { x: p.x + p.vx * t * 0.7, y: p.y + p.vy * t * 0.7 }
        }
        g.aimed(gx, gy, 3, 0.17, 235, '#ffb02e', aim)
        b.gunFlash[side > 0 ? 1 : 0] = 1
        b.step++
      }
      if (b.at > 0.7 + n * 0.4 + 0.2) done()
      break
    }
    case 'laser':
      b.emit = Math.min(1, b.at / 1.3)
      if (b.at >= 1.3 && b.at < 3.3) {
        const [lo, hi] = swayRange(g)
        b.x = Math.max(lo, Math.min(hi, b.x + b.sweep * 122 * dt))
      }
      if (b.at > 3.45) {
        b.laser = null
        done()
      }
      break
    case 'spill':
      if (b.step === 0 && b.at >= 0.85) {
        b.step = 1
        // the hopper coughs up a spray of pebbles that rain down spread out
        for (let i = 0; i < 7; i++) {
          const u = i / 6 - 0.5
          spawnRock(g, 'small', b.x + u * 150, b.y - 80, { vx: u * 330 + rand(-15, 15), vy: rand(-160, -110), grav: 300, vmax: 140, damp: 0.25, entered: true })
        }
        g.sfx.pop(0.7)
      }
      if (b.at > 1.4) done()
      break
  }
}

// A rock goes straight at its target. A glowing rock is lobbed instead: it
// swings across to its column and settles into a slow fall through the ships'
// half (see belt-core-rock), so there's time to get under it and shoot.
function throwVel(b, g, arm, rx, ry) {
  if (arm.kind === 'core') return [Math.max(-380, Math.min(380, (b.tgt.x - rx) * 1.5)), 240]
  const sp = b.angry ? 235 : 205
  const a = Math.atan2(b.tgt.y - ry, b.tgt.x - rx)
  return [Math.cos(a) * sp, Math.sin(a) * sp]
}

// A cancelled attack: the cannon knocked Krax back.
function interrupt(b) {
  if (b.laser) b.laser.dead = true
  b.laser = null
  if (b.attack === 'throw' && b.arm && b.step === 0) {
    // the claw fumbles its rock in the blast and grabs a plain one, so a
    // glowing rock never sits in a claw that isn't about to throw it
    b.arm.want = 0
    b.arm.pop = 1
    newRock(b.arm)
  }
  b.attack = null
  b.rest = 1
  b.gun = 0
}

function shipTarget(g, prev) {
  const pl = g.alive()
  const p = prev?.p && pl.includes(prev.p) ? prev.p : pick(pl)
  if (!p) return { x: g.W / 2, y: g.H - 100 }
  const off = prev?.off ?? rand(-30, 30)
  return { x: p.x + off, y: p.y, p, off }
}

// Somewhere for a core rock to come down: near the ships but not on them.
function coreLanding(g) {
  const ships = g.alive()
  let best = { x: g.W / 2, y: g.playerTop() + 20 }
  let bestScore = -Infinity
  for (let i = 0; i < 8; i++) {
    const x = rand(g.W * 0.15, g.W * 0.85)
    const d = ships.length ? Math.min(...ships.map((p) => Math.abs(p.x - x))) : 200
    const score = -Math.abs(d - 210)
    if (score > bestScore) {
      bestScore = score
      best = { x, y: g.playerTop() + 20 }
    }
  }
  return best
}

// Cores that will turn into a cannon shot without Krax doing anything more.
function supply(f, g) {
  let n = f.cores.length
  for (const p of g.players) if (p.carry?.krax) n++
  for (const e of g.enemies) if (e.type === 'belt-core-rock' && !e.dead) n++
  return n
}

function wanted(f, g) {
  const flying = g.players.filter((p) => !p.out).length
  return Math.max(0, Math.min(Math.max(1, flying), f.needed - f.delivered))
}

const short = (f, g) => supply(f, g) < wanted(f, g)

// ---------------------------------------------------------------- the intro
//
// About seven seconds, skippable with Enter or a tap. Krax holds its fire,
// the ships hold still, and three beats explain the fight: practice lasers
// ping off the armour; the Ion Cannon rises out of the ground into a
// spotlight; then Krax holds up a glowing rock while a ghost of the whole
// trick plays out: the rock is lobbed, shot open, and its core flown into the
// cannon. The real first glowing rock follows the moment it's over.

const showing = (f) => !!f.intro && !f.intro.done
const padRange = (g) => Math.max(0, Math.min(g.W * 0.3, g.W / 2 - 130))

function startIntro(b, g, f) {
  f.intro = { t: 0, done: false, beat: 0, bolts: [], fireT: 0, shot: 0, arm: null, demo: null }
  // a finger already on the glass the moment the show starts shouldn't skip it
  // by accident, so a skip only counts once the "skip" hint is up
  g.cutscene(true, { onSkip: () => f.intro.t > 0.6 && endIntro(b, g, f) })
  // anything still in the air fizzles, so the ships get their controls back
  // to a clear sky
  for (const s of g.eShots) g.sparks(s.x, s.y, '#ffffff', 2)
  g.eShots = []
  // the cannon comes up where the ships aren't, so they don't hide it
  const ships = g.alive()
  let best = 1.2
  let far = -1
  for (const s of [-1.2, -0.7, 0.7, 1.2]) {
    const x = g.W / 2 + Math.sin(s) * padRange(g)
    const d = ships.length ? Math.min(...ships.map((p) => Math.abs(p.x - x))) : Math.abs(s)
    if (d > far + 1) {
      far = d
      best = s
    }
  }
  f.pad.slide = best
}

// Has the intro passed `at` this frame for beat number `n`? Each beat's one-off
// work (a sound, a burst) runs once.
function beat(I, n, at) {
  if (I.beat >= n || I.t < at) return false
  I.beat = n
  return true
}

function runIntro(b, g, f, dt) {
  const I = f.intro
  const pad = f.pad
  I.t += dt
  b.y = b.ty + Math.sin(b.t * 1.2) * 8
  b.gun = Math.max(0, b.gun - dt * 3)
  b.emit = Math.max(0, b.emit - dt * 3)
  // stray saucers from the field hold their fire too
  for (const e of g.enemies) if (e.fireT != null) e.fireT = Math.max(e.fireT, 1)

  // beat 1: practice lasers at the armour, pinging off
  if (I.t > 0.35 && I.t < INTRO.cannon - 0.4 && (I.fireT -= dt) <= 0) {
    I.fireT = 0.12
    const ships = g.alive()
    const p = ships[I.shot++ % Math.max(1, ships.length)]
    if (p) {
      const tx = b.x + g.clamp(p.x - b.x, -130, 130) + rand(-25, 25)
      const ty = b.y + rand(-10, 40)
      const a = Math.atan2(ty - (p.y - 34), tx - p.x)
      I.bolts.push({ x: p.x, y: p.y - 34, vx: Math.cos(a) * 900, vy: Math.sin(a) * 900, pal: p.pal, life: 1, hit: false, tgt: null })
    }
  }

  // beat 2: the cannon rises out of the ground
  if (beat(I, 1, INTRO.cannon)) {
    f.raised = true
    g.shake(8)
    burstDebris(pad.x, g.H - 84, 46, 0, 12, 0, -260)
    synth.noise({ dur: 1.2, vol: 0.32, freq: 500, to: 60 }, 'krax-rumble', 0)
    synth.tone({ type: 'sawtooth', from: 70, to: 160, dur: 1.1, vol: 0.1, attack: 0.2 }, 'krax-rise', 0)
  }
  if (I.beat === 1 && pad.rise < 1 && Math.random() < dt * 30) g.sparks(pad.x + rand(-80, 80), g.H - 80, '#d8c4a8', 1)
  if (beat(I, 2, INTRO.cannon + 1.15)) {
    pad.glow = 1
    g.flash(0.12)
    ;[523, 784, 1047].forEach((fr, i) => synth.tone({ type: 'triangle', from: fr, dur: 0.18, vol: 0.12, at: i * 0.07 }, 'krax-ready' + i, 0))
  }

  // beat 3: Krax holds up a glowing rock...
  if (beat(I, 3, INTRO.step1)) {
    const side = pad.x >= b.x ? 1 : -1
    const arm = b.arms.find((a) => a.side === side)
    arm.has = true
    arm.pop = 1
    setRockKind(arm, 'core')
    arm.want = 0.6
    arm.fast = false
    I.arm = arm
    synth.tone({ type: 'sine', from: 660, to: 990, dur: 0.25, vol: 0.08 }, 'krax-core', 0.2)
  }
  // ...and a ghost of it acts out the trick: lobbed, shot open...
  if (beat(I, 4, INTRO.toss)) {
    const arm = I.arm
    const [rx, ry] = heldRock(b, arm)
    const spot = demoSpot(b, g, f)
    I.demo = { x: rx, y: ry, x0: rx, y0: ry, sx: spot[0], sy: spot[1], t: 0, hits: 0, core: false, spr: arm.spr, k: arm.k, rot: arm.rot }
    arm.has = false
    arm.reload = 1.6
    arm.want = -0.3
    arm.fast = true
    synth.noise({ dur: 0.3, vol: 0.2, freq: 1400, to: 200 }, 'krax-whoosh', 0.1)
  }
  const D = I.demo
  if (D) {
    D.t += dt
    if (!D.core) {
      const u = Math.min(1, D.t / 0.45)
      const e = 1 - (1 - u) ** 2
      D.x = D.x0 + (D.sx - D.x0) * e
      D.y = D.y0 + (D.sy - D.y0) * e - Math.sin(u * Math.PI) * 50
      D.rot += dt * 2
      // three practice shots from the nearest ship crack it open
      if (D.t > 0.25 && D.t < 0.58 && (I.fireT -= dt) <= 0) {
        I.fireT = 0.1
        const p = g.nearestPlayer(D.sx, D.sy)
        if (p) {
          const a = Math.atan2(D.sy - (p.y - 34), D.sx - p.x)
          I.bolts.push({ x: p.x, y: p.y - 34, vx: Math.cos(a) * 900, vy: Math.sin(a) * 900, pal: p.pal, life: 1, hit: false, tgt: D })
        }
      }
      if (D.hits >= 3 || D.t > 1.1) {
        D.core = true
        D.ct = 0
        burstDebris(D.x, D.y, 40, 2, 8, 0, 60)
        g.sparks(D.x, D.y, CORE, 10)
        synth.tone({ type: 'triangle', from: 880, to: 1760, dur: 0.18, vol: 0.12 }, 'krax-crack', 0.05)
      }
    } else {
      D.ct += dt
      // ...grabbed, and flown into the cannon
      if (I.t >= INTRO.step3) {
        const k = Math.min(1, dt * 5)
        D.x += (pad.x - D.x) * k
        D.y += (pad.y - 10 - D.y) * k
        if (!D.loaded && g.near(D.x, D.y, pad.x, pad.y - 10, 24)) {
          D.loaded = true
          pad.glow = 1
          g.popText(pad.x, pad.y - 120, 'Loaded!', CORE, 22, 1)
          ;[784, 988, 1319].forEach((fr, i) => synth.tone({ type: 'triangle', from: fr, dur: 0.12, vol: 0.13, at: i * 0.06 }, 'krax-load' + i, 0))
        }
      }
    }
  }

  // the practice lasers fly, ping off the armour or crack the ghost rock
  let j = 0
  for (const s of I.bolts) {
    s.x += s.vx * dt
    s.y += s.vy * dt
    if (s.hit) s.life -= dt * 3
    else if (s.tgt) {
      if (g.near(s.x, s.y, s.tgt.x, s.tgt.y, 34)) {
        s.life = 0
        s.tgt.hits++
        g.sparks(s.x, s.y, CORE, 4)
        g.sfx.hitTick()
      }
    } else if (((s.x - b.x) / 165) ** 2 + ((s.y - b.y - 8) / 68) ** 2 <= 1) {
      s.hit = true
      s.vx = Math.sign(s.x - b.x || 1) * rand(260, 480)
      s.vy = rand(120, 360)
      g.sparks(s.x, s.y, '#fff3b0', 4)
      g.sfx.ting()
      if (I.shot % 4 === 1) g.popText(s.x, s.y + 30, 'Ting!', '#fff3b0', 15, 0.6)
    }
    if (s.life > 0 && s.y > -40 && s.y < g.H + 40) I.bolts[j++] = s
  }
  I.bolts.length = j

  if (I.t >= INTRO.end) endIntro(b, g, f)
}

// Where the ghost rock is cracked open in the intro: in from the cannon
// toward the middle and up a little, so the core's trip to the cannon reads
// as a trip.
function demoSpot(b, g, f) {
  const x = f.pad.x + (g.W / 2 - f.pad.x) * 0.42
  return [g.clamp(x, 110, g.W - 110), g.H - 270]
}

// The show's over, played out or skipped: the cannon is up (or on its way),
// the claws are back to normal, and the first real glowing rock comes next.
function endIntro(b, g, f) {
  const I = f.intro
  if (!I || I.done) return
  I.done = true
  I.bolts.length = 0
  I.demo = null
  f.raised = true
  for (const arm of b.arms) {
    arm.want = 0
    arm.fast = false
    if (!arm.has) {
      arm.has = true
      arm.pop = 1
      newRock(arm)
    }
  }
  b.firstCore = true
  b.attack = null
  b.rest = 0.35
  g.cutscene(false)
}

// ---------------------------------------------------------------- geometry

// How far Krax roams: far enough to keep the ships moving, never so far that
// a claw (and the rock in it) swings off the screen.
const swayRange = (g) => [Math.min(g.W / 2, 320), Math.max(g.W / 2, g.W - 320)]

// The arm's joints for a `raise` between -0.45 (swung through after a throw),
// 0 (resting, rock held low at its side) and 1 (wound up, rock out and up).
function armPoints(arm) {
  const s = arm.side
  const r = arm.raise
  const a1 = 0.55 - r * 0.9
  const a2 = a1 + 0.75 - r * 0.55
  const sx = s * 158
  const sy = -12
  const ex = sx + s * Math.cos(a1) * 56
  const ey = sy + Math.sin(a1) * 56
  const cx = ex + s * Math.cos(a2) * 48
  const cy = ey + Math.sin(a2) * 48
  return { sx, sy, ex, ey, cx, cy, a2, dx: s * Math.cos(a2), dy: Math.sin(a2) }
}

function heldLocal(arm) {
  const P = armPoints(arm)
  const d = arm.spr.r * arm.k * 0.72
  return [P.cx + P.dx * d, P.cy + P.dy * d]
}

function heldRock(b, arm) {
  const [lx, ly] = heldLocal(arm)
  return [b.x + lx, b.y + ly]
}

const GUN = { x: 62, y: 80 }
const gunPos = (b, side) => [b.x + side * GUN.x, b.y + GUN.y]

// ---------------------------------------------------------------- the fight's pieces

export const KRAX_ENEMIES = {
  // A glowing rock with a power core inside: the only place cores come from.
  // Shoot it open and the core floats free; let it fall past and the core goes
  // with it, and Krax throws another.
  'belt-core-rock': {
    hp: 4,
    r: 40,
    score: 200,
    light: CORE,
    boom: 0.8,
    drop: 0,
    update(e, dt, g) {
      if (!e.spr) {
        e.spr = rockSprite('mid', 2, 'core')
        e.k = 1.2
        e.rot = 0
        e.spin = 0.8
        e.vx = e.vx ?? 0
        e.vy = e.vy ?? 120
        e.pal = 2
      }
      // the lob: swing across to its column, then settle into a slow fall
      if (e.tx != null) {
        e.tx = g.clamp(e.tx, 90, g.W - 90)
        e.vx += ((e.tx - e.x) * 2 - e.vx) * Math.min(1, dt * 3)
      }
      e.vy += (DRIFT - e.vy) * Math.min(1, dt * 0.9)
      moveRock(e, dt, g)
      if (Math.random() < dt * 6) g.sparks(e.x + rand(-20, 20), e.y + rand(-20, 20), CORE, 1)
      if (e.y > g.H + e.r * 0.4) {
        e.gone = true
        lostCore(e, g)
      }
    },
    draw(e, g, ctx) {
      ctx.globalCompositeOperation = 'lighter'
      drawHalo(ctx, e.x, e.y, e.r * 2.6, CORE, 0.55 + 0.3 * Math.sin(g.time * 8))
      ctx.globalCompositeOperation = 'source-over'
      drawRock(ctx, e)
      if (fight && !fight.over) label(ctx, g, e.x, e.y - e.r - 16 + Math.sin(g.time * 6) * 3, 'Shoot it!')
    },
    onDeath(e, g) {
      crackCore(e, g)
    },
  },
}

// A little word over something the ships should go for.
function label(ctx, g, x, y, text) {
  ctx.font = `13px ${g.FONT}`
  ctx.textAlign = 'center'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 4
  ctx.strokeStyle = 'rgba(10,6,30,0.9)'
  ctx.strokeText(text, x, y)
  ctx.fillStyle = '#ffffff'
  ctx.fillText(text, x, y)
}

// A glowing rock fell past the ships unopened: its core is gone, and Krax will
// reach for another (startAttack).
function lostCore(e, g) {
  const f = fight
  if (!f || f.over) return
  f.misses++
  g.popText(g.clamp(e.x, 150, g.W - 150), g.H - 150, 'It got away!', '#ffc58a', 20, 1.4)
  synth.tone({ type: 'triangle', from: 660, to: 330, dur: 0.3, vol: 0.1 }, 'krax-miss', 0.2)
}

function crackCore(e, g) {
  burstDebris(e.x, e.y, e.r, 2, 8, e.vx, e.vy)
  g.sparks(e.x, e.y, CORE, 10)
  synth.tone({ type: 'triangle', from: 880, to: 1760, dur: 0.18, vol: 0.12 }, 'krax-crack', 0.05)
  const f = fight
  if (!f || f.over) return
  addCore(f, g, e.x, e.y)
  tell(f, g, 'grab', e.x, Math.max(e.y, g.playerTop()) + 90, 'Grab the core!', CORE, 22)
}

function addCore(f, g, x, y, tx = x, ty = y) {
  const top = g.playerTop()
  f.cores.push({
    x,
    y,
    tx: Math.max(70, Math.min(g.W - 70, tx)),
    ty: Math.max(top + 50, Math.min(g.H - 215, ty < top + 50 ? rand(top + 50, top + 150) : ty)),
    t: rand(0, 6),
  })
}

function grab(f, g, p, c) {
  f.cores.splice(f.cores.indexOf(c), 1)
  p.carry = {
    krax: true,
    slow: 0.8,
    core: c,
    draw: (ctx, q, t) => drawCarried(ctx, q, c, t),
    onDrop(q) {
      // knocked out with it: the core is left floating where the ship was
      if (fight !== f || f.over) return
      f.cores.push(c)
      c.tx = Math.max(70, Math.min(g.W - 70, q.x))
      c.ty = Math.max(g.playerTop() + 50, Math.min(g.H - 215, q.y))
      g.popText(q.x, q.y + 40, 'Core dropped!', CORE, 16, 1.3)
    },
  }
  synth.tone({ type: 'sine', from: 520, to: 1180, dur: 0.16, vol: 0.2 }, 'krax-grab', 0)
  synth.tone({ type: 'triangle', from: 1568, dur: 0.12, vol: 0.1, at: 0.1 }, 'krax-grab2', 0)
  if (!f.told.carry) tell(f, g, 'carry', p.x, p.y - 90, 'Take it to the Ion Cannon!', CORE, 18)
  else g.popText(p.x, p.y - 80, 'Got it!', CORE, 16, 0.9)
}

function deliver(f, g, p, c) {
  p.carry = null
  f.delivered++
  f.pad.queue.push(p.id)
  f.pad.glow = 1
  f.loads.push({ x: c.x, y: c.y, t: 0 })
  g.addScore(p.id, 300, f.pad.x, f.pad.y - 100)
  g.popText(f.pad.x, f.pad.y - 140, 'Loaded!', CORE, 22, 1)
  ;[784, 988, 1319].forEach((fr, i) => synth.tone({ type: 'triangle', from: fr, dur: 0.12, vol: 0.13, at: i * 0.06 }, 'krax-load' + i, 0))
}

const muzzle = (pad) => [pad.x + Math.cos(pad.aim) * (60 - pad.recoil * 12), pad.y - 22 + Math.sin(pad.aim) * (60 - pad.recoil * 12)]

function fire(f, g, b) {
  const pad = f.pad
  const owner = pad.queue.shift() ?? 0
  pad.state = 'fire'
  pad.st = 0
  pad.recoil = 1
  const ix = b.x
  const iy = b.y + 6
  f.beam = { t: 0, x1: ix, y1: iy }
  g.flash(0.75)
  g.shake(24)
  g.sfx.boom()
  synth.tone({ type: 'sawtooth', from: 1400, to: 90, dur: 0.9, vol: 0.2 }, 'krax-beam', 0)
  synth.noise({ dur: 1.0, vol: 0.45, freq: 5000, to: 300 }, 'krax-beam-n', 0)
  g.damageBoss(b, BEAM, owner, ix, iy)
  knockPlates(b, g)
  interrupt(b)
  b.stun = 1.3
  b.reel = 1
  g.explode(ix, iy, CORE, 2.4)
  g.explode(ix, iy + 20, '#ffffff', 1.2)
  g.addScore(owner, 1000, ix, iy + 90)
  g.popText(ix, iy + 130, b.hp > 0 ? pick(['Direct hit!', 'Ka-BOOM!', 'Bullseye!']) : 'You cracked Krax!', '#bff9ff', 30, 1.6)
  // the blast clears the sky: bullets in the air fizzle, rocks in its path shatter
  for (const s of g.eShots) g.sparks(s.x, s.y, '#bff9ff', 2)
  g.eShots = []
  const [mx, my] = muzzle(pad)
  for (const e of g.enemies) if (!e.dead && segDist(e.x, e.y, mx, my, ix, iy) < e.r + 50) g.damageEnemy(e, 99, owner)
}

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const u = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)))
  return Math.hypot(px - ax - dx * u, py - ay - dy * u)
}

// Plates fly off to match the damage: all eight on at full health.
function knockPlates(b, g) {
  const want = Math.ceil((8 * Math.max(0, b.hp)) / b.maxHp)
  let on = b.plates.filter((p) => p.on)
  while (on.length > want) {
    const pl = on.splice((Math.random() * on.length) | 0, 1)[0]
    pl.on = false
    burstDebris(b.x + pl.x, b.y + pl.y, 36, 2, 7, pl.x * 2, -160)
    g.explode(b.x + pl.x, b.y + pl.y, EMBER, 0.9)
  }
}

// Ticked by the level every frame, in every phase.
export function updateFight(g, dt) {
  const f = fight
  if (!f) return
  f.t += dt
  const b = g.boss && g.boss.fight === f && !g.boss.dying ? g.boss : null
  const pad = f.pad
  const top = g.playerTop()

  // the pad rises out of the ground when the intro calls it, slides about, and
  // sinks again at the end. While the letterbox bars are in it stands on top
  // of the bottom one rather than behind it
  if (f.over) {
    pad.rise = Math.max(0, pad.rise - dt * 1.2)
    if (pad.rise <= 0 && !f.beam) {
      fight = null
      return
    }
  } else if (f.raised) pad.rise = Math.min(1, pad.rise + dt * 0.9)
  f.lift += ((g.inCutscene && showing(f) ? 1 : 0) - f.lift) * Math.min(1, dt * 5)
  const e = 1 - (1 - pad.rise) ** 3
  pad.y = g.H - 72 - LIFT * f.lift + (1 - e) * 180
  pad.glow = Math.max(0, pad.glow - dt * 1.5)
  pad.recoil = Math.max(0, pad.recoil - dt * 2.5)
  if (pad.state === 'idle') {
    // it holds still for its close-up in the intro
    if (!showing(f)) pad.slide += dt * 0.28
    pad.x = g.W / 2 + Math.sin(pad.slide) * padRange(g)
  }
  const want = b ? Math.atan2(b.y - (pad.y - 22), b.x - pad.x) : -Math.PI / 2
  pad.aim += (want - pad.aim) * Math.min(1, dt * (pad.state === 'charge' ? 10 : 4))
  pad.st += dt
  switch (pad.state) {
    case 'idle':
      if (pad.queue.length && b && !b.entering) {
        pad.state = 'charge'
        pad.st = 0
        synth.tone({ type: 'sawtooth', from: 110, to: 880, dur: CHARGE, vol: 0.1, attack: 0.3 }, 'krax-hum', 0)
        synth.tone({ type: 'sine', from: 220, to: 1760, dur: CHARGE, vol: 0.12, attack: 0.3 }, 'krax-hum2', 0)
      } else if (!b) pad.queue = []
      break
    case 'charge': {
      const [mx, my] = muzzle(pad)
      for (let i = 0; i < 3; i++) {
        const a = rand(0, TAU)
        const d = rand(60, 110)
        f.motes.push({ x: mx + Math.cos(a) * d, y: my + Math.sin(a) * d, life: 0.35 })
      }
      if (pad.st >= CHARGE) {
        if (b) fire(f, g, b)
        else {
          pad.state = 'idle'
          pad.queue = []
        }
      }
      break
    }
    case 'fire':
      if (pad.st >= BEAM_T) {
        pad.state = 'cool'
        pad.st = 0
      }
      break
    case 'cool':
      if (pad.st >= 0.4) {
        pad.state = 'idle'
        pad.st = 0
      }
      break
  }

  if (f.beam) {
    f.beam.t += dt
    if (b) {
      f.beam.x1 = b.x
      f.beam.y1 = b.y + 6
    }
    const [mx, my] = muzzle(pad)
    const u = Math.random()
    g.sparks(mx + (f.beam.x1 - mx) * u, my + (f.beam.y1 - my) * u, pick([CORE, '#ffffff']), 1)
    if (f.beam.t >= BEAM_T) f.beam = null
  }

  {
    const [mx, my] = muzzle(pad)
    let j = 0
    for (const m of f.motes) {
      m.life -= dt
      if (m.life <= 0) continue
      m.x += (mx - m.x) * Math.min(1, dt * 9)
      m.y += (my - m.y) * Math.min(1, dt * 9)
      f.motes[j++] = m
    }
    f.motes.length = j
  }
  for (const L of f.loads) {
    L.t += dt
    const k = Math.min(1, dt * 10)
    L.x += (pad.x - L.x) * k
    L.y += (pad.y + 10 - L.y) * k
  }
  f.loads = f.loads.filter((L) => L.t < 0.35)

  if (f.over) return

  // floating cores glide to where they'll wait. The spot is re-fitted to the
  // world every frame, so a window resized or a phone turned mid-fight can't
  // leave a core stranded out of the ships' reach (and Krax waiting forever)
  for (const c of f.cores) {
    c.t += dt
    c.tx = Math.max(70, Math.min(g.W - 70, c.tx))
    c.ty = Math.max(top + 50, Math.min(g.H - 215, c.ty))
    const dx = c.tx - c.x
    const dy = c.ty - c.y
    const d = Math.hypot(dx, dy)
    if (d > 0.5) {
      const step = Math.min(d, Math.max(40, d * 2.2) * dt, 300 * dt)
      c.x += (dx / d) * step
      c.y += (dy / d) * step
    }
  }

  if (!b || b.entering) return
  for (const p of g.players) {
    if (!p.alive) continue
    if (p.carry?.krax) {
      const c = p.carry.core
      const k = Math.min(1, dt * 12)
      c.x += (p.x - c.x) * k
      c.y += (p.y + 46 - c.y) * k
      c.t += dt
      if (g.near(p.x, p.y, pad.x, pad.y - 26, PAD_R) || g.near(c.x, c.y, pad.x, pad.y - 10, PAD_R - 24)) deliver(f, g, p, c)
    } else if (!p.carry) {
      const c = f.cores.find((q) => q.y > top - 40 && g.near(p.x, p.y, q.x, q.y, GRAB_R))
      if (c) grab(f, g, p, c)
    }
  }

}

// ================================================================ drawing
//
// Everything on Krax that doesn't move (plating, hopper and its heap of rocks,
// gun ports, nozzle, the cockpit's frame) is painted once into a sprite and
// stamped each frame; it's repainted only when a plate gets knocked off. The
// lights, arms, pilot and glows are drawn live on top.

const BODY = { x0: -184, y0: -140, w: 368, h: 236, res: 2 }

function bodySprite(b, font) {
  const key = b.plates.map((p) => (p.on ? 1 : 0)).join('')
  if (b.body && b.body.key === key) return b.body.canvas
  const c = b.body?.canvas ?? document.createElement('canvas')
  c.width = BODY.w * BODY.res // resizing also clears it
  c.height = BODY.h * BODY.res
  const x = c.getContext('2d')
  x.setTransform(BODY.res, 0, 0, BODY.res, -BODY.x0 * BODY.res, -BODY.y0 * BODY.res)
  paintHopper(x, b, font)
  paintHull(x, b)
  paintPorts(x)
  b.body = { key, canvas: c }
  return c
}

function drawKrax(ctx, b, g) {
  const t = g.time
  ctx.save()
  ctx.translate(b.x + (b.rattle > 0 ? Math.sin(t * 70) * 3 : 0), b.y)
  ctx.rotate(b.tilt)

  for (const d of [-1, 1]) jet(ctx, d * 100, 62, t + d)
  for (const arm of b.arms) drawArm(ctx, arm)
  ctx.drawImage(bodySprite(b, g.FONT), BODY.x0, BODY.y0, BODY.w, BODY.h)
  drawCockpit(ctx, b, t)

  ctx.globalCompositeOperation = 'lighter'
  // the power core in the heap, the beacon, and the holes in the armour
  const core = b.heap.find((h) => h.core)
  drawHalo(ctx, core.x, core.y, 46, CORE, 0.55 + 0.25 * Math.sin(t * 5))
  const on = Math.sin(t * 7) > 0
  drawHalo(ctx, 126, -106, on ? 30 : 16, '#ffb02e', on ? 0.9 : 0.4)
  for (const pl of b.plates) if (!pl.on) drawHalo(ctx, pl.x, pl.y, 28, EMBER, 0.35 + 0.35 * Math.sin(t * 13 + pl.seed))
  const glows = [Math.max(b.gun, b.gunFlash[0]), Math.max(b.gun, b.gunFlash[1])]
  glows.forEach((v, i) => v > 0 && drawHalo(ctx, (i ? 1 : -1) * GUN.x, GUN.y, 16 + v * 22, '#ffb02e', v))
  drawHalo(ctx, 0, 90, 14 + b.emit * 34, EMBER, 0.35 + b.emit * 0.65)
  ctx.globalCompositeOperation = 'source-over'

  ctx.fillStyle = on ? '#fff1b0' : '#c77a1a'
  ctx.beginPath()
  ctx.arc(126, -106, 6, 0, TAU)
  ctx.fill()
  // running lights chase along the top edge
  for (let i = 0; i < 9; i++) {
    const lit = Math.sin(t * 6 - i * 0.8) > 0.2
    ctx.fillStyle = lit ? (b.angry ? '#ff5a4a' : '#ffd23d') : 'rgba(255,210,61,0.25)'
    ctx.beginPath()
    ctx.arc(-120 + i * 30, -42, 2.6, 0, TAU)
    ctx.fill()
  }
  glows.forEach((v, i) => {
    ctx.fillStyle = v > 0.05 ? '#fff1c4' : '#5a3a2a'
    ctx.beginPath()
    ctx.arc((i ? 1 : -1) * GUN.x, GUN.y, 3 + v * 4, 0, TAU)
    ctx.fill()
  })
  ctx.fillStyle = b.emit > 0.05 ? '#fff4d6' : '#ff9d5a'
  ctx.beginPath()
  ctx.arc(0, 90, 4 + b.emit * 4, 0, TAU)
  ctx.fill()

  if (b.flash > 0) {
    ctx.globalAlpha = Math.min(1, b.flash) * 0.5
    ctx.fillStyle = '#ffffff'
    hullPath(ctx)
    ctx.fill()
    ctx.globalAlpha = 1
  }
  ctx.restore()

  // the rocks in its claws, drawn upright in world space so the light is right
  for (const arm of b.arms) {
    if (!arm.has) continue
    const [rx, ry] = heldRock(b, arm)
    const grow = 1 - arm.pop
    if (arm.kind === 'core' || arm.kind === 'hot') {
      ctx.globalCompositeOperation = 'lighter'
      const col = arm.kind === 'core' ? CORE : '#ff6a2e'
      drawHalo(ctx, rx, ry, arm.spr.r * arm.k * 2.6, col, 0.6 + 0.3 * Math.sin(t * 10))
      ctx.globalCompositeOperation = 'source-over'
    }
    drawRock(ctx, { x: rx, y: ry, k: arm.k * grow, rot: arm.rot, spr: arm.spr, flash: 0 })
    // the claw's fingers close over the front of the rock
    drawClaw(ctx, b, arm, true)
  }
}

function hullPath(ctx) {
  ctx.beginPath()
  ctx.moveTo(-140, -50)
  ctx.lineTo(140, -50)
  ctx.quadraticCurveTo(168, -48, 172, -22)
  ctx.lineTo(128, 58)
  ctx.quadraticCurveTo(122, 68, 108, 68)
  ctx.lineTo(-108, 68)
  ctx.quadraticCurveTo(-122, 68, -128, 58)
  ctx.lineTo(-172, -22)
  ctx.quadraticCurveTo(-168, -48, -140, -50)
  ctx.closePath()
}

function paintHull(ctx, b) {
  const hg = ctx.createLinearGradient(0, -50, 0, 68)
  hg.addColorStop(0, STEEL[0])
  hg.addColorStop(0.35, STEEL[1])
  hg.addColorStop(1, STEEL[3])
  ctx.fillStyle = hg
  hullPath(ctx)
  ctx.fill()

  // hazard stripes along the keel
  ctx.save()
  hullPath(ctx)
  ctx.clip()
  ctx.fillStyle = HAT
  ctx.fillRect(-180, 48, 360, 20)
  ctx.fillStyle = '#1d1a2a'
  for (let x = -190; x < 190; x += 24) {
    ctx.beginPath()
    ctx.moveTo(x, 68)
    ctx.lineTo(x + 12, 68)
    ctx.lineTo(x + 26, 48)
    ctx.lineTo(x + 14, 48)
    ctx.closePath()
    ctx.fill()
  }
  // a bright lip along the top edge
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.fillRect(-180, -50, 360, 5)
  ctx.restore()

  ctx.strokeStyle = STEEL[3]
  ctx.lineWidth = 3
  hullPath(ctx)
  ctx.stroke()

  // the armour plates, or the glowing holes where they were
  const pg = ctx.createLinearGradient(0, -18, 0, 18)
  pg.addColorStop(0, '#c8d1ec')
  pg.addColorStop(1, '#69749c')
  for (const pl of b.plates) {
    ctx.save()
    ctx.translate(pl.x, pl.y)
    if (pl.on) {
      ctx.fillStyle = pg
      ctx.beginPath()
      ctx.roundRect(-18, -18, 36, 36, 6)
      ctx.fill()
      ctx.strokeStyle = STEEL[3]
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.fillRect(-13, -15, 26, 3)
      ctx.fillStyle = STEEL[3]
      for (const [rx, ry] of [[-11, -9], [11, -9], [-11, 11], [11, 11]]) {
        ctx.beginPath()
        ctx.arc(rx, ry, 2.2, 0, TAU)
        ctx.fill()
      }
    } else {
      ctx.fillStyle = '#1a0b14'
      ctx.beginPath()
      ctx.roundRect(-16, -16, 32, 32, 5)
      ctx.fill()
      ctx.strokeStyle = hexA(EMBER, 0.85)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-12, -6)
      ctx.lineTo(12, -6)
      ctx.moveTo(-12, 6)
      ctx.lineTo(12, 6)
      ctx.moveTo(0, -12)
      ctx.lineTo(0, 12)
      ctx.stroke()
    }
    ctx.restore()
  }
}

function paintHopper(ctx, b, font) {
  // the heap first, so the bin's front face hides the bottom of the pile
  for (const h of b.heap) drawRock(ctx, { x: h.x, y: h.y, k: h.k, rot: h.rot, spr: h.spr, flash: 0 })

  const bg = ctx.createLinearGradient(0, -88, 0, -46)
  bg.addColorStop(0, '#b4502e')
  bg.addColorStop(1, '#5a2018')
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.moveTo(-108, -88)
  ctx.lineTo(108, -88)
  ctx.lineTo(94, -46)
  ctx.lineTo(-94, -46)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#3a120e'
  ctx.lineWidth = 3
  ctx.stroke()
  // ribs
  ctx.strokeStyle = 'rgba(40,10,8,0.45)'
  ctx.lineWidth = 4
  for (const x of [-62, 62]) {
    ctx.beginPath()
    ctx.moveTo(x * 1.05, -86)
    ctx.lineTo(x * 0.93, -48)
    ctx.stroke()
  }
  // rim
  ctx.fillStyle = STEEL[1]
  ctx.beginPath()
  ctx.roundRect(-114, -94, 228, 9, 4)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillRect(-110, -93, 220, 2.5)
  // name plate
  ctx.font = `20px ${font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#2a0c08'
  ctx.lineWidth = 5
  ctx.strokeText('KRAX', 0, -65)
  ctx.fillStyle = HAT
  ctx.fillText('KRAX', 0, -65)
  ctx.textBaseline = 'alphabetic'
  // the post of a warning beacon
  ctx.strokeStyle = STEEL[2]
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(126, -50)
  ctx.lineTo(126, -100)
  ctx.stroke()
}

// Gun ports either side of the belly, the mining laser's nozzle under the
// cockpit, and the cockpit's bolted frame.
function paintPorts(ctx) {
  for (const side of [-1, 1]) {
    const gx = side * GUN.x
    ctx.fillStyle = STEEL[3]
    ctx.beginPath()
    ctx.roundRect(gx - 9, 58, 18, 22, 4)
    ctx.fill()
    ctx.fillStyle = STEEL[2]
    ctx.fillRect(gx - 6, 60, 4, 16)
  }
  ctx.fillStyle = STEEL[3]
  ctx.beginPath()
  ctx.moveTo(-18, 60)
  ctx.lineTo(18, 60)
  ctx.lineTo(9, 88)
  ctx.lineTo(-9, 88)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = STEEL[2]
  ctx.fillRect(-14, 66, 28, 4)
  ctx.fillRect(-11, 76, 22, 4)

  const cy = 8
  const R = 40
  ctx.fillStyle = STEEL[3]
  ctx.beginPath()
  ctx.arc(0, cy, R + 7, 0, TAU)
  ctx.fill()
  ctx.fillStyle = STEEL[1]
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + 0.2
    ctx.beginPath()
    ctx.arc(Math.cos(a) * (R + 3.5), cy + Math.sin(a) * (R + 3.5), 1.8, 0, TAU)
    ctx.fill()
  }
}

function drawCockpit(ctx, b, t) {
  const cy = 8
  const R = 40
  ctx.save()
  ctx.beginPath()
  ctx.arc(0, cy, R, 0, TAU)
  ctx.clip()
  ctx.fillStyle = 'rgba(28, 46, 74, 0.95)'
  ctx.fillRect(-R, cy - R, R * 2, R * 2)
  const s = 20
  const hy = cy + 14
  drawAlien(ctx, 0, hy, s, SKIN, { angry: b.angry || b.reel > 0, cap: HAT, t, hurt: Math.max(b.hurt, b.reel) })
  hardHat(ctx, 0, hy, s, t, b.hurt > 0 || b.reel > 0 ? Math.sin(t * 90) * 1.5 : 0)
  const glass = ctx.createRadialGradient(-R * 0.4, cy - R * 0.45, 3, 0, cy, R)
  glass.addColorStop(0, 'rgba(255,255,255,0.45)')
  glass.addColorStop(0.5, 'rgba(180,230,255,0.08)')
  glass.addColorStop(1, 'rgba(180,230,255,0.32)')
  ctx.fillStyle = glass
  ctx.fillRect(-R, cy - R, R * 2, R * 2)
  ctx.restore()
  ctx.strokeStyle = 'rgba(220,240,255,0.75)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(0, cy, R, 0, TAU)
  ctx.stroke()
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(0, cy, R * 0.78, Math.PI * 1.0, Math.PI * 1.3)
  ctx.stroke()
}

// A miner's hard hat with a headlamp, worn over the alien's cap.
function hardHat(ctx, x, y, s, t, wob) {
  ctx.save()
  ctx.translate(x + wob, y)
  // the antennae poke out through two holes in the top
  ctx.strokeStyle = SKIN
  ctx.fillStyle = SKIN
  ctx.lineWidth = Math.max(1.5, s * 0.1)
  ctx.lineCap = 'round'
  for (const d of [-1, 1]) {
    const wob2 = Math.sin(t * 4 + d) * s * 0.1
    ctx.beginPath()
    ctx.moveTo(d * s * 0.45, -s * 1.2)
    ctx.quadraticCurveTo(d * s * 0.65, -s * 1.6, d * s * 0.78 + wob2, -s * 1.78)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(d * s * 0.78 + wob2, -s * 1.78, s * 0.17, 0, TAU)
    ctx.fill()
  }
  const g = ctx.createLinearGradient(0, -s * 1.5, 0, -s * 0.5)
  g.addColorStop(0, '#fff6c0')
  g.addColorStop(0.45, HAT)
  g.addColorStop(1, '#c8890f')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.ellipse(0, -s * 0.6, s * 1.1, s * 0.88, 0, Math.PI, TAU)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#e8a91a'
  ctx.beginPath()
  ctx.roundRect(-s * 0.14, -s * 1.47, s * 0.28, s * 0.86, s * 0.1)
  ctx.fill()
  ctx.fillStyle = '#d5940f'
  ctx.beginPath()
  ctx.ellipse(0, -s * 0.6, s * 1.32, s * 0.2, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#4a4f63'
  ctx.beginPath()
  ctx.arc(0, -s * 1.02, s * 0.27, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#fffbe0'
  ctx.beginPath()
  ctx.arc(0, -s * 1.02, s * 0.17, 0, TAU)
  ctx.fill()
  ctx.restore()
}

function jet(ctx, x, y, t) {
  const f = 16 + Math.sin(t * 37) * 4
  const g = ctx.createLinearGradient(0, y, 0, y + f + 8)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.35, '#8fd8ff')
  g.addColorStop(1, 'rgba(120,200,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.moveTo(x - 10, y)
  ctx.quadraticCurveTo(x, y + f * 1.6, x + 10, y)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = STEEL[3]
  ctx.beginPath()
  ctx.roundRect(x - 13, y - 8, 26, 10, 3)
  ctx.fill()
}

function drawArm(ctx, arm) {
  const P = armPoints(arm)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (const [w, col] of [[24, STEEL[3]], [16, STEEL[1]]]) {
    ctx.strokeStyle = col
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.moveTo(P.sx, P.sy)
    ctx.lineTo(P.ex, P.ey)
    ctx.lineTo(P.cx, P.cy)
    ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(P.sx, P.sy - 4)
  ctx.lineTo(P.ex, P.ey - 4)
  ctx.lineTo(P.cx, P.cy - 4)
  ctx.stroke()
  // a yellow hydraulic ram along the upper arm
  ctx.strokeStyle = HAT
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(P.sx + (P.ex - P.sx) * 0.15, P.sy + 12)
  ctx.lineTo(P.ex + (P.cx - P.ex) * 0.3, P.ey + (P.cy - P.ey) * 0.3 + 8)
  ctx.stroke()
  for (const [x, y, r] of [[P.sx, P.sy, 14], [P.ex, P.ey, 11]]) {
    ctx.fillStyle = STEEL[3]
    ctx.beginPath()
    ctx.arc(x, y, r, 0, TAU)
    ctx.fill()
    ctx.fillStyle = STEEL[0]
    ctx.beginPath()
    ctx.arc(x, y, r * 0.45, 0, TAU)
    ctx.fill()
  }
  if (!arm.has) drawClaw(ctx, null, arm, false)
}

// Two hooked fingers at the end of the forearm. Called in Krax's own frame
// (b = null) when the claw is empty, or in world space over a held rock.
function drawClaw(ctx, b, arm, holding) {
  const P = armPoints(arm)
  ctx.save()
  if (b) ctx.translate(b.x, b.y)
  ctx.translate(P.cx, P.cy)
  ctx.rotate(Math.atan2(P.dy, P.dx))
  const open = holding ? arm.spr.r * arm.k * 0.95 : 10
  for (const d of [-1, 1]) {
    for (const [w, col] of [[11, STEEL[3]], [6, STEEL[1]]]) {
      ctx.strokeStyle = col
      ctx.lineWidth = w
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(0, d * 5)
      ctx.quadraticCurveTo(open * 0.5, d * (open + 6), open * 1.05, d * open * 0.55)
      ctx.stroke()
    }
  }
  ctx.fillStyle = STEEL[2]
  ctx.beginPath()
  ctx.arc(0, 0, 9, 0, TAU)
  ctx.fill()
  ctx.restore()
}

// The dashed line a wound-up rock is about to fly along.
function drawAim(ctx, b, t) {
  const arm = b.arm
  if (!arm.has) return
  const [rx, ry] = heldRock(b, arm)
  const a = Math.min(1, b.at / 0.6)
  const col = arm.kind === 'core' ? CORE : '#ff6a5a'
  const len = 230
  ctx.save()
  ctx.translate(rx, ry)
  ctx.rotate(b.aimA)
  ctx.globalAlpha = a * (0.55 + 0.35 * Math.sin(t * 18))
  ctx.strokeStyle = col
  ctx.lineWidth = 4
  ctx.setLineDash([14, 10])
  ctx.lineDashOffset = -t * 90
  ctx.beginPath()
  ctx.moveTo(arm.spr.r * arm.k + 6, 0)
  ctx.lineTo(len, 0)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = col
  ctx.beginPath()
  ctx.moveTo(len + 18, 0)
  ctx.lineTo(len, -11)
  ctx.lineTo(len, 11)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  ctx.globalAlpha = 1
}

// Krax's mining laser: orange, with chevrons in the warning showing which way
// the sweep will go.
function drawMiningLaser(ctx, L, h, t) {
  if (L.warn > 0) {
    const a = 0.4 + 0.35 * Math.sin(t * 30)
    ctx.fillStyle = `rgba(255, 140, 50, ${a * 0.22})`
    ctx.fillRect(L.x - L.w / 2, L.y0, L.w, h - L.y0)
    ctx.strokeStyle = `rgba(255, 170, 90, ${a + 0.2})`
    ctx.lineWidth = 2
    ctx.setLineDash([12, 10])
    ctx.lineDashOffset = -t * 120
    ctx.beginPath()
    ctx.moveTo(L.x, L.y0)
    ctx.lineTo(L.x, h)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = `rgba(255, 210, 120, ${0.5 + a * 0.5})`
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const step = 110
    for (let y = L.y0 + 90; y < h - 30; y += step) {
      for (let k = 0; k < 2; k++) {
        const x = L.x + L.sweep * (L.w * 0.6 + k * 16 + ((t * 40) % 16))
        ctx.beginPath()
        ctx.moveTo(x - L.sweep * 8, y - 12)
        ctx.lineTo(x + L.sweep * 4, y)
        ctx.lineTo(x - L.sweep * 8, y + 12)
        ctx.stroke()
      }
    }
    return
  }
  const fade = Math.min(1, L.active * 6)
  const w = L.w * (0.85 + 0.15 * Math.sin(t * 50))
  const g = ctx.createLinearGradient(L.x - w / 2, 0, L.x + w / 2, 0)
  g.addColorStop(0, 'rgba(255,110,30,0)')
  g.addColorStop(0.25, `rgba(255,120,40,${0.7 * fade})`)
  g.addColorStop(0.45, `rgba(255,240,200,${fade})`)
  g.addColorStop(0.55, `rgba(255,240,200,${fade})`)
  g.addColorStop(0.75, `rgba(255,120,40,${0.7 * fade})`)
  g.addColorStop(1, 'rgba(255,110,30,0)')
  ctx.fillStyle = g
  ctx.fillRect(L.x - w / 2, L.y0, w, h - L.y0)
}

// ---------------------------------------------------------------- the level-side layers

// The power core: a glowing hexagon gem in a spinning ring.
function drawCore(ctx, x, y, t, s = 1) {
  ctx.globalCompositeOperation = 'lighter'
  drawHalo(ctx, x, y, 58 * s, CORE, 0.75 + 0.2 * Math.sin(t * 6))
  ctx.globalCompositeOperation = 'source-over'
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.lineWidth = 2.5 * s
  ctx.beginPath()
  ctx.ellipse(x, y, 27 * s, 9 * s, Math.sin(t * 1.3) * 0.5, 0, TAU)
  ctx.stroke()
  const r = 17 * s
  const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, 1, x, y, r)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.45, CORE)
  g.addColorStop(1, '#127a9e')
  ctx.fillStyle = g
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3 + t * 0.8
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
  }
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2 * s
  ctx.stroke()
  for (let i = 0; i < 3; i++) {
    const a = t * 2.4 + (i * TAU) / 3
    drawStar(ctx, x + Math.cos(a) * 30 * s, y + Math.sin(a) * 12 * s, 4.5 * s, '#ffffff', 4, 0.35)
  }
}

function drawCarried(ctx, p, c, t) {
  // a little tractor beam holds the core under the ship
  ctx.strokeStyle = hexA(CORE, 0.55 + 0.25 * Math.sin(t * 20))
  ctx.lineWidth = 3
  ctx.setLineDash([5, 5])
  ctx.lineDashOffset = -t * 50
  ctx.beginPath()
  ctx.moveTo(p.x, p.y + 18)
  ctx.lineTo(c.x, c.y)
  ctx.stroke()
  ctx.setLineDash([])
  drawCore(ctx, c.x, c.y, t, 0.85)
}

// The pad's base and the turret's dome never change, so they're painted once.
let padArt = null

function paintSprite(x0, y0, w, h, paint) {
  const c = document.createElement('canvas')
  c.width = w * 2
  c.height = h * 2
  const x = c.getContext('2d')
  x.setTransform(2, 0, 0, 2, -x0 * 2, -y0 * 2)
  paint(x)
  return { c, x0, y0, w, h }
}

const stamp = (ctx, s) => ctx.drawImage(s.c, s.x0, s.y0, s.w, s.h)

function padSprites() {
  if (padArt) return padArt
  const base = paintSprite(-90, -12, 180, 56, (ctx) => {
    const bg = ctx.createLinearGradient(0, 0, 0, 40)
    bg.addColorStop(0, '#4a6fc4')
    bg.addColorStop(1, '#1a2558')
    ctx.fillStyle = bg
    ctx.beginPath()
    ctx.moveTo(-66, 2)
    ctx.lineTo(66, 2)
    ctx.lineTo(84, 34)
    ctx.quadraticCurveTo(84, 40, 76, 40)
    ctx.lineTo(-76, 40)
    ctx.quadraticCurveTo(-84, 40, -84, 34)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#121a40'
    ctx.lineWidth = 2.5
    ctx.stroke()
    ctx.fillStyle = '#6f95e6'
    ctx.beginPath()
    ctx.ellipse(0, 3, 66, 9, 0, 0, TAU)
    ctx.fill()
    ctx.strokeStyle = hexA(CORE, 0.9)
    ctx.lineWidth = 2
    ctx.stroke()
    // the socket a core slots into
    ctx.fillStyle = '#0d1430'
    ctx.beginPath()
    ctx.arc(0, 18, 11, 0, TAU)
    ctx.fill()
  })
  const dome = paintSprite(-40, -44, 80, 44, (ctx) => {
    const dg = ctx.createRadialGradient(-12, -32, 3, 0, -10, 40)
    dg.addColorStop(0, '#ffffff')
    dg.addColorStop(0.45, '#9cc2ff')
    dg.addColorStop(1, '#2f4a9e')
    ctx.fillStyle = dg
    ctx.beginPath()
    ctx.arc(0, -4, 36, Math.PI, TAU)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#18234f'
    ctx.lineWidth = 2.5
    ctx.stroke()
  })
  padArt = { base, dome }
  return padArt
}

function drawPad(ctx, f, t) {
  const pad = f.pad
  const art = padSprites()
  ctx.save()
  ctx.translate(pad.x, pad.y)

  // the landing ring
  const pulse = (t * 0.9) % 1
  ctx.strokeStyle = hexA(CORE, 0.6 * (1 - pulse))
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.ellipse(0, 22, 70 + pulse * 50, 16 + pulse * 12, 0, 0, TAU)
  ctx.stroke()
  ctx.strokeStyle = hexA(CORE, 0.7)
  ctx.setLineDash([12, 9])
  ctx.lineDashOffset = -t * 30
  ctx.beginPath()
  ctx.ellipse(0, 22, 90, 22, 0, 0, TAU)
  ctx.stroke()
  ctx.setLineDash([])

  stamp(ctx, art.base)
  // chasing lights along the front
  for (let i = 0; i < 7; i++) {
    const on = Math.sin(t * 7 - i * 0.9) > 0
    ctx.fillStyle = on ? '#7dff9a' : 'rgba(125,255,154,0.25)'
    ctx.beginPath()
    ctx.arc(-54 + i * 18, 31, 2.6, 0, TAU)
    ctx.fill()
  }
  const load = Math.max(pad.glow, pad.state === 'charge' ? 0.4 + 0.6 * (pad.st / CHARGE) : 0, pad.queue.length ? 0.6 : 0)
  ctx.strokeStyle = hexA(CORE, 0.4 + load * 0.6)
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(0, 18, 11, 0, TAU)
  ctx.stroke()
  if (load > 0) {
    ctx.globalCompositeOperation = 'lighter'
    drawHalo(ctx, 0, 18, 22 + load * 22, CORE, load)
    ctx.globalCompositeOperation = 'source-over'
  }

  // the barrel, then the dome over its root
  ctx.save()
  ctx.translate(0, -22)
  ctx.rotate(pad.aim)
  const rec = pad.recoil * 12
  ctx.fillStyle = '#26326e'
  ctx.beginPath()
  ctx.roundRect(-4 - rec, -12, 62, 24, 7)
  ctx.fill()
  ctx.fillStyle = '#9db8ee'
  ctx.beginPath()
  ctx.roundRect(-2 - rec, -9, 58, 18, 6)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillRect(-rec, -8, 54, 4)
  ctx.fillStyle = '#3d559a'
  ctx.fillRect(-rec, 4, 54, 4)
  ctx.fillStyle = hexA(CORE, 0.85)
  ctx.fillRect(18 - rec, -9, 5, 18)
  ctx.fillRect(32 - rec, -9, 5, 18)
  ctx.fillStyle = '#26326e'
  ctx.beginPath()
  ctx.roundRect(50 - rec, -13, 12, 26, 4)
  ctx.fill()
  ctx.restore()

  stamp(ctx, art.dome)
  ctx.fillStyle = hexA(CORE, 0.5 + 0.5 * load)
  ctx.beginPath()
  ctx.arc(0, -16, 7, 0, TAU)
  ctx.fill()
  ctx.restore()
}

function drawSign(ctx, f, g, t) {
  const pad = f.pad
  const carrying = g.players.some((p) => p.carry?.krax)
  const k = carrying ? 1 : 0.7
  const bob = Math.sin(t * (carrying ? 8 : 4)) * 8
  const y = pad.y - 118 + bob
  ctx.save()
  ctx.translate(pad.x, y)
  ctx.scale(k, k)
  ctx.globalAlpha = carrying ? 1 : 0.75
  ctx.fillStyle = HAT
  ctx.strokeStyle = '#3a2a08'
  ctx.lineWidth = 3
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(-11, -22)
  ctx.lineTo(11, -22)
  ctx.lineTo(11, 0)
  ctx.lineTo(24, 0)
  ctx.lineTo(0, 24)
  ctx.lineTo(-24, 0)
  ctx.lineTo(-11, 0)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.font = `15px ${g.FONT}`
  ctx.textAlign = 'center'
  ctx.lineWidth = 5
  ctx.strokeStyle = 'rgba(10,6,30,0.9)'
  const text = carrying ? 'Bring the core here!' : 'Ion Cannon'
  ctx.strokeText(text, 0, -34)
  ctx.fillStyle = carrying ? '#ffffff' : '#bff9ff'
  ctx.fillText(text, 0, -34)
  ctx.restore()
  ctx.globalAlpha = 1
}

export function drawFightBack(g, ctx) {
  const f = fight
  if (!f) return
  if (f.intro && f.lift > 0.02) drawSpotlight(ctx, g, f)
  drawPad(ctx, f, g.time)
}

export function drawFightMid(g, ctx) {
  const f = fight
  if (!f) return
  const t = g.time
  const pad = f.pad
  if (!f.over) {
    // a dotted guide from each carried core to the cannon
    for (const p of g.players) {
      if (!p.alive || !p.carry?.krax) continue
      const c = p.carry.core
      ctx.strokeStyle = hexA(CORE, 0.35)
      ctx.lineWidth = 3
      ctx.setLineDash([3, 12])
      ctx.lineDashOffset = -t * 40
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(c.x, c.y)
      ctx.lineTo(pad.x, pad.y - 20)
      ctx.stroke()
      ctx.setLineDash([])
    }
    if (!showing(f) && pad.rise > 0.5) drawSign(ctx, f, g, t)
  }
  for (const c of f.cores) {
    const y = c.y + Math.sin(c.t * 2.5) * 5
    drawCore(ctx, c.x, y, t + c.t)
    ctx.font = `13px ${g.FONT}`
    ctx.textAlign = 'center'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 4
    ctx.strokeStyle = 'rgba(10,6,30,0.9)'
    ctx.strokeText('Grab!', c.x, y - 36)
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Grab!', c.x, y - 36)
  }
  for (const L of f.loads) drawCore(ctx, L.x, L.y, t, 0.85 * (1 - L.t / 0.35))
}

export function drawFightTop(g, ctx) {
  const f = fight
  if (!f) return
  const t = g.time
  ctx.globalCompositeOperation = 'lighter'
  if (f.motes.length) {
    ctx.fillStyle = '#bff9ff'
    for (const m of f.motes) {
      ctx.globalAlpha = Math.min(1, m.life * 4)
      ctx.beginPath()
      ctx.arc(m.x, m.y, 2.6, 0, TAU)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    const [mx, my] = muzzle(f.pad)
    drawHalo(ctx, mx, my, 20 + 40 * (f.pad.st / CHARGE), CORE, 0.9)
  }
  if (f.beam) {
    const B = f.beam
    const [mx, my] = muzzle(f.pad)
    const dx = B.x1 - mx
    const dy = B.y1 - my
    const len = Math.hypot(dx, dy)
    const u = B.t / BEAM_T
    const fade = u < 0.08 ? u / 0.08 : u > 0.55 ? Math.max(0, 1 - (u - 0.55) / 0.45) : 1
    const w = 62 * fade * (0.9 + 0.1 * Math.sin(t * 70))
    ctx.save()
    ctx.translate(mx, my)
    ctx.rotate(Math.atan2(dy, dx))
    const gr = ctx.createLinearGradient(0, -w, 0, w)
    gr.addColorStop(0, 'rgba(98,246,255,0)')
    gr.addColorStop(0.22, 'rgba(98,246,255,0.3)')
    gr.addColorStop(0.42, 'rgba(98,246,255,0.9)')
    gr.addColorStop(0.48, '#ffffff')
    gr.addColorStop(0.52, '#ffffff')
    gr.addColorStop(0.58, 'rgba(98,246,255,0.9)')
    gr.addColorStop(0.78, 'rgba(98,246,255,0.3)')
    gr.addColorStop(1, 'rgba(98,246,255,0)')
    ctx.fillStyle = gr
    ctx.fillRect(0, -w, len, w * 2)
    // rings of energy racing up the beam
    ctx.strokeStyle = `rgba(255,255,255,${0.7 * fade})`
    ctx.lineWidth = 3
    for (let k = 0; k < 7; k++) {
      const d = (t * 1100 + (k * len) / 7) % len
      ctx.beginPath()
      ctx.ellipse(d, 0, 7, w * 0.75, 0, 0, TAU)
      ctx.stroke()
    }
    ctx.restore()
    drawHalo(ctx, mx, my, 110 * fade, CORE, 1)
    drawHalo(ctx, B.x1, B.y1, 220 * fade, CORE, 1)
    drawHalo(ctx, B.x1, B.y1, 120 * fade, '#ffffff', 1)
  }
  ctx.globalCompositeOperation = 'source-over'
  if (showing(f) && g.boss) drawIntro(ctx, g, f, g.boss)
}

// ---------------------------------------------------------------- the intro's layers

// A stage light leaning in from the middle of the sky onto the cannon, with
// the pool of light it throws on the ground. It fades out with the bars.
function drawSpotlight(ctx, g, f) {
  const a = Math.max(0, Math.min(1, (f.intro.t - INTRO.cannon) / 0.4)) * f.lift
  if (a <= 0) return
  const pad = f.pad
  const bx = pad.x
  const by = pad.y + 26
  const sx = pad.x + (pad.x < g.W / 2 ? 1 : -1) * Math.min(180, g.W * 0.14)
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const gr = ctx.createLinearGradient(0, 0, 0, by)
  gr.addColorStop(0, 'rgba(191,249,255,0)')
  gr.addColorStop(0.6, `rgba(191,249,255,${0.05 * a})`)
  gr.addColorStop(1, `rgba(191,249,255,${0.16 * a})`)
  ctx.fillStyle = gr
  // a wide soft cone with a brighter one inside it, for a soft edge; both run
  // on behind the letterbox bar
  const k = g.H / by
  for (const [top, bottom] of [[22, 150], [10, 95]]) {
    const cx = sx + (bx - sx) * k
    const hw = top + (bottom - top) * k
    ctx.beginPath()
    ctx.moveTo(sx - top, 0)
    ctx.lineTo(sx + top, 0)
    ctx.lineTo(cx + hw, g.H)
    ctx.lineTo(cx - hw, g.H)
    ctx.closePath()
    ctx.fill()
  }
  ctx.translate(bx, by)
  ctx.scale(1, 0.24)
  drawHalo(ctx, 0, 0, 170, '#bff9ff', 0.7 * a)
  ctx.restore()
}

const WHITE = '#ffffff'
const WARM = '#ffb36b'

// The words, a few at a time. Coloured words are the things to look for.
const CAPTIONS = [
  { from: 0.15, to: INTRO.cannon - 0.08, lines: [[["Krax's armour is ", WHITE], ['too thick', WARM], [' for lasers!', WHITE]]] },
  { from: INTRO.cannon + 0.05, to: INTRO.step1 - 0.08, lines: [[['Your ', WHITE], ['Ion Cannon', CORE], [' can crack it!', WHITE]]] },
  {
    from: INTRO.step1,
    to: INTRO.end + 1,
    at: [INTRO.step1, INTRO.step2, INTRO.step3],
    lines: [
      [['Shoot the ', WHITE], ['glowing rocks', CORE], [' Krax throws,', WHITE]],
      [['grab the ', WHITE], ['power core', CORE], [' inside,', WHITE]],
      [['and fly it to the ', WHITE], ['cannon!', CORE]],
    ],
  },
]

function drawIntro(ctx, g, f, b) {
  const I = f.intro
  const t = I.t
  const time = g.time
  const pad = f.pad

  // the practice lasers
  ctx.globalCompositeOperation = 'lighter'
  for (const s of I.bolts) {
    ctx.globalAlpha = Math.max(0, Math.min(1, s.life))
    drawPlayerShot(ctx, s, s.pal)
  }
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'

  // beat 2: a big arrow and a name over the cannon as it comes up
  const call = Math.min(1, Math.max(0, (t - INTRO.cannon - 0.45) / 0.3), Math.max(0, (INTRO.step1 - t) / 0.25))
  if (call > 0) callout(ctx, g, pad.x, pad.y - 84, 'Ion Cannon', call)

  drawCaptions(ctx, g, f, b)

  // beat 3: the trick acted out, each step numbered to match the caption
  if (t < INTRO.step1 || !I.arm) return
  const D = I.demo
  const spot = D ? [D.sx, D.sy] : demoSpot(b, g, f)
  const from = D ? [D.x0, D.y0] : I.arm.has ? heldRock(b, I.arm) : null
  if (from) guide(ctx, time, from, spot, Math.min(1, (t - INTRO.step1) / 0.3))
  if (t >= INTRO.step2) guide(ctx, time, spot, [pad.x, pad.y - 20], Math.min(1, (t - INTRO.step2) / 0.3))
  if (!D && I.arm.has) {
    const [rx, ry] = heldRock(b, I.arm)
    ring(ctx, rx, ry, 52, time)
    badge(ctx, g, rx, ry - 66, 1)
  }
  if (D && !D.core) {
    ctx.globalCompositeOperation = 'lighter'
    drawHalo(ctx, D.x, D.y, 100, CORE, 0.7)
    ctx.globalCompositeOperation = 'source-over'
    drawRock(ctx, { x: D.x, y: D.y, k: D.k, rot: D.rot, spr: D.spr, flash: D.hits * 0.3 })
    ring(ctx, D.x, D.y, 52, time)
    badge(ctx, g, D.x, D.y - 66, 1)
  }
  if (D && D.core && !D.loaded) {
    const bob = t < INTRO.step3 ? Math.sin(D.ct * 5) * 4 : 0
    drawCore(ctx, D.x, D.y + bob, time, 0.9)
    if (t < INTRO.step3) label(ctx, g, D.x, D.y - 40 + bob, 'Grab!')
    badge(ctx, g, D.x + 46, D.y - 30 + bob, 2)
  }
  if (t >= INTRO.step3) {
    ring(ctx, pad.x, pad.y - 16, 70, time)
    badge(ctx, g, pad.x + 72, pad.y - 70, 3)
  }
}

// A bouncing arrow pointing down at (x, y) with a name over it.
function callout(ctx, g, x, y, text, a) {
  const bob = Math.sin(g.time * 7) * 7
  ctx.save()
  ctx.globalAlpha = a
  ctx.translate(x, y + bob)
  ctx.fillStyle = HAT
  ctx.strokeStyle = '#3a2a08'
  ctx.lineWidth = 3.5
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(-14, -52)
  ctx.lineTo(14, -52)
  ctx.lineTo(14, -24)
  ctx.lineTo(32, -24)
  ctx.lineTo(0, 0)
  ctx.lineTo(-32, -24)
  ctx.lineTo(-14, -24)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.font = `26px ${g.FONT}`
  ctx.textAlign = 'center'
  const w = ctx.measureText(text).width
  const tx = g.clamp(x, 24 + w / 2, g.W - 24 - w / 2) - x
  ctx.lineWidth = 7
  ctx.strokeStyle = 'rgba(10,6,30,0.92)'
  ctx.strokeText(text, tx, -66)
  ctx.fillStyle = CORE
  ctx.fillText(text, tx, -66)
  ctx.restore()
}

// A dotted line marching from one point to the next, fading in.
function guide(ctx, t, [ax, ay], [bx, by], a) {
  ctx.save()
  ctx.globalAlpha = a * 0.8
  ctx.strokeStyle = CORE
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.setLineDash([2, 13])
  ctx.lineDashOffset = -t * 45
  ctx.beginPath()
  ctx.moveTo(ax, ay)
  ctx.lineTo(bx, by)
  ctx.stroke()
  ctx.restore()
}

// A pulsing target ring.
function ring(ctx, x, y, r, t) {
  const u = (t * 1.6) % 1
  ctx.strokeStyle = hexA(CORE, 0.85)
  ctx.lineWidth = 3
  ctx.setLineDash([10, 7])
  ctx.lineDashOffset = t * 30
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.strokeStyle = hexA(CORE, 0.6 * (1 - u))
  ctx.beginPath()
  ctx.arc(x, y, r + u * 26, 0, TAU)
  ctx.stroke()
}

// A numbered badge, matching a numbered line of the caption.
function badge(ctx, g, x, y, n, r = 15) {
  ctx.fillStyle = CORE
  ctx.strokeStyle = 'rgba(10,6,30,0.9)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(x, y, r, 0, TAU)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#0a1a2e'
  ctx.font = `${Math.round(r * 1.2)}px ${g.FONT}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(String(n), x, y + r * 0.08)
  ctx.textBaseline = 'alphabetic'
}

// The caption plate between Krax and the ships: one line, or a numbered list
// that grows a line at a time. While the trick is acted out on one side, the
// list keeps to the other side if the screen is wide enough, so nothing hides
// the demo; on a narrow screen it stays in the middle and the demo is drawn
// over it.
function drawCaptions(ctx, g, f, b) {
  const I = f.intro
  const t = I.t
  const cap = CAPTIONS.find((c) => t >= c.from && t < c.to)
  if (!cap) return
  const fade = Math.max(0, Math.min(1, (t - cap.from) / 0.2, (cap.to - t) / 0.15))
  const list = !!cap.at
  const pad = 22
  let size = 30
  ctx.font = `${size}px ${g.FONT}`
  const widths = cap.lines.map((line) => line.reduce((w, [text]) => w + ctx.measureText(text).width, 0))
  const badgeW = list ? size * 1.45 : 0
  const widest = Math.max(...widths) + badgeW

  let cx = g.W / 2
  let room = Math.min(g.W - 40, 940) - pad * 2
  if (list && I.arm) {
    // the demo runs between the claw and the cannon
    const xs = [f.pad.x, heldRock(b, I.arm)[0], demoSpot(b, g, f)[0]]
    const left = f.pad.x < g.W / 2
    const edge = left ? Math.max(...xs) + 100 : Math.min(...xs) - 100
    const side = left ? g.W - 20 - edge : edge - 20
    if (side - pad * 2 >= widest * 0.78) {
      room = side - pad * 2
      cx = left ? edge + side / 2 : 20 + side / 2
    }
  }
  const k = Math.min(1, room / widest)
  size *= k
  const lineH = size * 1.55
  const w = widest * k + pad * 2
  const fullH = cap.lines.length * lineH + pad * 1.1
  // just under Krax's claws, and a little lower on a tall screen
  const top = b.y + 145 + Math.max(0, g.H - 800) * 0.35
  const shown = list ? cap.at.reduce((n, at) => n + Math.max(0, Math.min(1, (t - at) / 0.25)), 0) : 1
  const h = shown * lineH + pad * 1.1
  const rise = (1 - fade) * 10

  ctx.save()
  ctx.globalAlpha = fade
  ctx.fillStyle = 'rgba(12,8,40,0.74)'
  ctx.strokeStyle = hexA(CORE, 0.5)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(cx - w / 2, top + rise, w, Math.min(h, fullH), 16)
  ctx.fill()
  ctx.stroke()
  // a new line is revealed as the plate grows to fit it
  ctx.clip()
  ctx.lineJoin = 'round'
  cap.lines.forEach((line, i) => {
    const a = list ? Math.max(0, Math.min(1, (t - cap.at[i]) / 0.25)) : 1
    if (a <= 0) return
    const y = top + pad * 0.55 + lineH * (i + 0.5) + rise + (1 - a) * 8
    let x = list ? cx - w / 2 + pad + badgeW * k : cx - (widths[i] * k) / 2
    ctx.globalAlpha = fade * a
    if (list) badge(ctx, g, x - badgeW * k * 0.55, y, i + 1, size * 0.52)
    ctx.font = `${size}px ${g.FONT}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    for (const [text, col] of line) {
      ctx.lineWidth = Math.max(3, size * 0.2)
      ctx.strokeStyle = 'rgba(10,6,30,0.9)'
      ctx.strokeText(text, x, y)
      ctx.fillStyle = col
      ctx.fillText(text, x, y)
      x += ctx.measureText(text).width
    }
  })
  ctx.restore()
  ctx.textBaseline = 'alphabetic'
}

// Under the boss bar: what to do next, and how many cores are in.
function drawHint(b, g, ctx) {
  const f = b.fight
  if (!f || f.over || showing(f)) return
  const cx = g.W / 2
  const carrying = g.players.some((p) => p.alive && p.carry?.krax)
  const rock = g.enemies.some((e) => e.type === 'belt-core-rock' && !e.dead)
  const winding = b.attack === 'throw' && b.step === 0 && b.arm?.kind === 'core'
  // the last line only shows with no core anywhere, and then it's true:
  // Krax's next move is always another glowing rock (startAttack)
  const hint = carrying
    ? 'Fly the core to the Ion Cannon!'
    : f.pad.state === 'charge'
      ? 'Ion Cannon charging...'
      : f.pad.state === 'fire'
        ? 'Great shot! Get another core!'
        : f.cores.length
          ? 'Grab the glowing power core!'
          : rock
            ? 'Shoot the glowing rock open!'
            : winding
              ? 'Here comes a glowing rock!'
              : 'Krax is grabbing another glowing rock...'
  ctx.textAlign = 'center'
  ctx.lineJoin = 'round'
  ctx.font = `13px ${g.FONT}`
  ctx.lineWidth = 4
  ctx.strokeStyle = 'rgba(10,6,30,0.85)'
  ctx.strokeText(hint, cx, 76)
  ctx.fillStyle = '#bff9ff'
  ctx.fillText(hint, cx, 76)

  const n = f.needed
  const label = `Cores: ${Math.min(f.delivered, n)}/${n}`
  ctx.font = `12px ${g.FONT}`
  const lw = ctx.measureText(label).width
  const pip = 19
  const total = lw + 10 + n * pip
  const x0 = cx - total / 2
  ctx.textAlign = 'left'
  ctx.strokeText(label, x0, 101)
  ctx.fillStyle = '#ffffff'
  ctx.fillText(label, x0, 101)
  for (let i = 0; i < n; i++) {
    const x = x0 + lw + 10 + i * pip + pip / 2
    const y = 97
    ctx.beginPath()
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + (k * Math.PI) / 3
      ctx.lineTo(x + Math.cos(a) * 7, y + Math.sin(a) * 7)
    }
    ctx.closePath()
    if (i < f.delivered) {
      ctx.fillStyle = CORE
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()
    } else {
      ctx.fillStyle = 'rgba(10,8,34,0.7)'
      ctx.fill()
      ctx.strokeStyle = hexA(CORE, 0.45)
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }
  ctx.textAlign = 'center'
}
