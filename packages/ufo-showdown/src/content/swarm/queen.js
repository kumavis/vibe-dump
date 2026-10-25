// The Hive Queen: a huge insect mothership with a crown, buzzing wings, a
// striped belly and four glowing egg sacs, birthing swarmlets the whole
// fight. Lasers bounce off her head, her saucer ring and the honeycomb
// armour over her belly. Each egg sac takes a few hits to pop and tears a
// chunk off her; pop all four and she's stunned, her armour slides open and
// her soft belly takes double damage until she shakes it off. Then the sacs
// grow back and it starts again.
//
// This level hands out firepower by the bucket, so a stun only lets so much
// damage through before she shakes it off early: it's three rounds or so
// however hard the ships hit, and a ship with a pea-shooter gets there too
// (the sacs only grow back after a stun, so nothing it pops is ever undone).
//
// Every attack is telegraphed: the sacs swell before a brood, an aim line
// shows exactly where the stinger will fire, the belly glows before honey,
// and her wings blur before she sweeps a wall of bugs down the field.

import { synth } from '../../audio.js'
import { stats, BOSS_CAP, flock, ring, wall, spiral, burst, bonusKills, firepower, PALS_N } from './bugs.js'
import { stampGlow } from './sprites.js'

const TAU = Math.PI * 2
const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// Her body, in her own units (scaled by b.k to fit a narrow screen).
const HEAD = { y: -84, r: 44 }
const DISC = { y: -14, rx: 150, ry: 32 }
const BELLY = { y: 62, rx: 74, ry: 66 }
const STING = 154 // the stinger's tip
const SACS = [
  { ox: -146, oy: 40, r: 25 },
  { ox: 146, oy: 40, r: 25 },
  { ox: -98, oy: 104, r: 27 },
  { ox: 98, oy: 104, r: 27 },
]
const SAC_PAL = [0, 3, 1, 2] // the colour of what hatches from each

const SEQ = ['brood', 'sting', 'honey', 'ring', 'sting', 'brood', 'wall', 'honey', 'spin']
const STING_WARN = 0.95
const STUN = 3.4
const GROW = 6 // seconds for popped sacs to grow back after a stun
const RIPE = 0.85 // how grown a sac has to be before a laser can pop it
const STUN_CAP = 0.22 // most of her health one stun can let through
const SAC_DMG = 0.035 // what popping one sac tears off

// The crown she loses, tumbling down the screen after the fight.
const fx = { crown: null }
export function resetQueenFx() {
  fx.crown = null
}

export const hivequeen = {
  name: 'The Hive Queen',
  warnSub: 'All hail',
  hudName: (b) => (b.rage ? 'The Hive Queen is FURIOUS!' : 'The Hive Queen'),

  create(g) {
    const hp = Math.round(150 * g.hpMult())
    stats.cap = BOSS_CAP
    const sacHp = Math.round(8 * g.hpMult())
    return {
      x: g.W / 2,
      y: -280,
      ty: 245,
      k: clamp(g.W / 1100, 0.68, 0.9),
      hp,
      maxHp: hp,
      sacs: SACS.map((s, i) => ({ ...s, i, alive: true, hp: sacHp, max: sacHp, size: 1, flash: 0, glow: 0 })),
      sacDmg: Math.round(hp * SAC_DMG),
      stunCap: Math.round(hp * STUN_CAP),
      stunDmg: 0,
      open: 0,
      pops: 0,
      sway: 0,
      wing: 0,
      buzz: 0,
      rest: 2.2,
      attack: null,
      at: 0,
      step: 0,
      seqI: 0,
      ringI: 0,
      dripT: 3,
      daze: 0,
      rage: false,
      hold: false,
      aims: [],
      tellBelly: 0,
      eyeFlash: 0,
    }
  },

  update(b, dt, g) {
    b.wing += dt * (b.buzz > 0 ? 70 : 38)
    b.buzz = Math.max(0, b.buzz - dt)
    b.eyeFlash = Math.max(0, b.eyeFlash - dt * 2)
    b.tellBelly = Math.max(0, b.tellBelly - dt * 1.5)
    for (const s of b.sacs) {
      s.flash = Math.max(0, s.flash - dt * 6)
      s.glow = Math.max(0, s.glow - dt * 2)
      if (s.alive) s.size = Math.min(1, s.size + dt / GROW)
    }
    // the armour slides open while she's stunned
    b.open += ((b.daze > 0 ? 1 : 0) - b.open) * Math.min(1, dt * 8)
    if (g.bossEnter(b, dt)) return

    if (!b.hold) b.sway += dt
    const range = clamp(g.W / 2 - 270 * b.k - 10, 0, 220)
    b.x = g.W / 2 + Math.sin(b.sway * 0.35) * range
    b.y = b.ty + Math.sin(b.t * 1.2) * 8

    if (!b.rage && b.hp <= b.maxHp * 0.5) {
      b.rage = true
      // a line below "Her armour is open!", which often lands the same moment
      g.popText(b.x, b.y + 236 * b.k, 'The Hive Queen is FURIOUS!', '#ff8a8a', 22, 2)
      g.shake(10)
      screech()
    }

    if (b.daze > 0) {
      b.daze -= dt
      b.attack = null
      b.hold = false
      b.aims = []
      if (b.daze <= 0) wake(b, g)
      return
    }

    // a steady drip of hatchlings out of whichever sacs are ripe
    if ((b.dripT -= dt) <= 0) {
      b.dripT = b.rage ? 1.5 : 2.3
      const ripe = b.sacs.filter((s) => s.alive && s.size > 0.6)
      if (ripe.length) {
        const s = g.pick(ripe)
        const [sx, sy] = sacAt(b, s)
        burst(g, sx, sy + s.r * b.k, 2, SAC_PAL[s.i], { spread: 0.6 })
      } else burst(g, b.x, b.y + STING * b.k, 2, 2, { spread: 0.6 })
    }

    if (!b.attack) {
      if ((b.rest -= dt) <= 0) {
        let a = SEQ[b.seqI++ % SEQ.length]
        if (a === 'spin' && !b.rage) a = 'sting'
        begin(b, a, g)
      }
      return
    }
    b.at += dt
    ATTACKS[b.attack](b, g, dt)
  },

  shot(b, x, y, owner, g) {
    const k = b.k
    const dx = x - b.x
    const dy = y - b.y
    if (dx < -185 * k || dx > 185 * k || dy < -150 * k || dy > (STING + 16) * k) return false
    // the sacs hang lowest, so they catch lasers first
    for (const s of b.sacs) {
      if (!s.alive || s.size < RIPE) continue
      const [sx, sy] = sacAt(b, s)
      const r = s.r * k * s.size + 4
      if ((x - sx) ** 2 + (y - sy) ** 2 > r * r) continue
      if (b.entering) ting(g, x, y)
      else hitSac(b, s, owner, g, x, y)
      return true
    }
    const ux = dx / k
    const uy = dy / k
    const belly = (ux / BELLY.rx) ** 2 + ((uy - BELLY.y) / BELLY.ry) ** 2 <= 1
    const sting = Math.abs(ux) < 16 && uy > BELLY.y && uy < STING
    if (belly || sting) {
      if (b.entering || b.daze <= 0) ting(g, x, y)
      else {
        b.stunDmg += 2
        hurt(b, 2, owner, g, x, y)
        if (b.stunDmg >= b.stunCap && b.hp > 0 && !b.dying) {
          b.daze = 0
          wake(b, g)
        }
      }
      return true
    }
    const shell = (ux / DISC.rx) ** 2 + ((uy - DISC.y) / DISC.ry) ** 2 <= 1 || ux * ux + (uy - HEAD.y) ** 2 < HEAD.r * HEAD.r
    if (shell) {
      ting(g, x, y)
      return true
    }
    return false
  },

  hits(b, p) {
    const ux = (p.x - b.x) / b.k
    const uy = (p.y - b.y) / b.k
    return (ux / (DISC.rx * 0.95)) ** 2 + ((uy - DISC.y) / (DISC.ry + 12)) ** 2 < 1 || (ux / (BELLY.rx + 10)) ** 2 + ((uy - BELLY.y) / (BELLY.ry + 10)) ** 2 < 1
  },

  nova(b, owner, g) {
    if (b.entering) return
    for (const s of b.sacs) {
      if (!s.alive || s.size < RIPE) continue
      s.hp -= 5
      s.flash = 1
      if (s.hp <= 0) popSac(b, s, owner, g)
    }
    if (b.hp > 0 && !b.dying) hurt(b, b.daze > 0 ? 10 : 4, owner, g, b.x, b.y + BELLY.y * b.k)
  },

  draw(b, g, ctx) {
    drawQueen(ctx, b, g.time)
  },

  hud(b, g, ctx) {
    const alive = b.sacs.filter((s) => s.alive && s.size >= RIPE).length
    let text = 'Pop her egg sacs to crack her armour!'
    let col = '#d4ff5a'
    if (b.daze > 0) (text = 'Stunned! Blast her belly!'), (col = '#ffe23d')
    else if (!alive) (text = 'Her egg sacs are growing back!'), (col = '#ffcf5a')
    else if (b.attack === 'sting' && b.at < STING_WARN) (text = 'Stinger! Get off the red line!'), (col = '#ff8a9a')
    ctx.save()
    ctx.textAlign = 'center'
    ctx.lineJoin = 'round'
    ctx.font = `15px ${g.FONT}`
    ctx.globalAlpha = 0.75 + 0.25 * Math.sin(g.time * 5)
    ctx.strokeStyle = 'rgba(10,6,30,0.9)'
    ctx.lineWidth = 5
    ctx.strokeText(text, g.W / 2, 78)
    ctx.fillStyle = col
    ctx.fillText(text, g.W / 2, 78)
    ctx.globalAlpha = 1
    // the sacs, as four little eggs, and the swarm count
    for (let i = 0; i < 4; i++) {
      const s = b.sacs[i]
      const x = g.W / 2 - 66 + i * 18
      ctx.fillStyle = s.alive && s.size >= RIPE ? '#d4ff5a' : 'rgba(212,255,90,0.2)'
      ctx.beginPath()
      ctx.ellipse(x, 96, 6, 7.5, 0, 0, TAU)
      ctx.fill()
    }
    ctx.font = `12px ${g.FONT}`
    ctx.textAlign = 'left'
    ctx.fillStyle = '#ffe23d'
    ctx.fillText(`${stats.kills.toLocaleString()} zapped`, g.W / 2 + 8, 101)
    ctx.restore()
  },

  explodeAt: (b) => [b.x + rand(-150, 150) * b.k, b.y + rand(-110, 130) * b.k],

  defeated(b, g) {
    const k = b.k
    for (const s of b.sacs) {
      const [sx, sy] = sacAt(b, s)
      g.splash(sx, sy, '#d4ff5a')
    }
    g.explode(b.x, b.y + BELLY.y * k, '#ffcf5a', 2.4)
    g.splash(b.x, b.y + BELLY.y * k, '#ffb02e')
    fx.crown = { x: b.x, y: b.y + (HEAD.y - HEAD.r) * k, vx: rand(-90, 90), vy: -460, rot: 0, spin: rand(-6, 6), k, t: 0 }
    synth.tone({ type: 'triangle', from: 1568, to: 2093, dur: 0.4, vol: 0.12 }, 'swarm-crown', 0.5)
    b.attack = null
    b.aims = []
  },
}

// ---------------------------------------------------------------- the fight

function sacAt(b, s) {
  const sway = Math.sin(b.t * 2 + s.i * 1.7) * 3
  return [b.x + (s.ox + sway) * b.k, b.y + (s.oy + Math.abs(sway) * 0.6) * b.k]
}

function ting(g, x, y) {
  g.sparks(x, y, '#ffe9b0', 2)
  g.sfx.ting()
}

// Damage that might be the last of her: if it is, every bug still flying
// goes up with her, and counts.
function hurt(b, dmg, owner, g, x, y) {
  if (b.dying) return
  if (dmg >= b.hp) {
    let n = 0
    for (const e of g.enemies) if (!e.dead && (e.swarm || e.type === 'swarmspitter')) n++
    if (n) {
      bonusKills(g, owner, n)
      g.popText(b.x, b.y + 200 * b.k, `Chain reaction! +${n} saucers`, '#d4ff5a', 20, 2.2)
    }
  }
  g.damageBoss(b, dmg, owner, x, y)
}

function hitSac(b, s, owner, g, x, y) {
  s.hp -= 1
  s.flash = 1
  g.addScore(owner, 10)
  g.sparks(x, y, '#e6ff9a', 3)
  g.sfx.hitTick()
  if (s.hp <= 0) popSac(b, s, owner, g)
}

function popSac(b, s, owner, g) {
  const [sx, sy] = sacAt(b, s)
  s.alive = false
  s.size = 0
  s.glow = 0
  b.pops++
  g.splash(sx, sy, '#d4ff5a')
  g.explode(sx, sy, '#d4ff5a', 1.1)
  g.shake(6)
  synth.noise({ dur: 0.35, vol: 0.35, freq: 1400, to: 120, q: 2 }, 'swarm-splat', 0.08)
  synth.tone({ type: 'sine', from: 300, to: 90, dur: 0.25, vol: 0.2 }, 'swarm-splat2', 0.08)
  g.popText(sx, sy - 30, 'SPLAT!', '#d4ff5a', 20, 1)
  if (b.pops % 2 === 0) g.dropBubble(sx, sy + 20, firepower())
  if (!b.sacs.some((o) => o.alive)) {
    b.daze = STUN
    b.stunDmg = 0
    g.popText(b.x, b.y + 190 * b.k, 'Her armour is open!', '#ffe23d', 22, 2)
    g.shake(10)
    screech()
  }
  hurt(b, b.sacDmg, owner, g, sx, sy)
}

// She shakes off a stun: the armour closes and the sacs start growing back.
function wake(b, g) {
  b.rest = 1.4
  for (const s of b.sacs) {
    s.alive = true
    s.hp = s.max
    s.size = 0.05
  }
  synth.tone({ type: 'sawtooth', from: 300, to: 700, dur: 0.4, vol: 0.08 }, 'swarm-wake', 0.5)
}

function screech() {
  synth.tone({ type: 'sawtooth', from: 900, to: 300, dur: 0.6, vol: 0.12 }, 'swarm-screech', 0.5)
  synth.tone({ type: 'square', from: 1300, to: 500, dur: 0.5, vol: 0.05, at: 0.05 }, 'swarm-screech2', 0.5)
}

function buzz(dur = 0.8) {
  synth.tone({ type: 'sawtooth', from: 95, to: 120, dur, vol: 0.12 }, 'swarm-buzz', 0.4)
  synth.noise({ dur, vol: 0.1, freq: 600, to: 300, q: 4 }, 'swarm-buzz2', 0.4)
}

function begin(b, a, g) {
  b.attack = a
  b.at = 0
  b.step = 0
  if (a === 'brood') {
    for (const s of b.sacs) if (s.alive && s.size > 0.6) s.glow = 1.2
    synth.tone({ type: 'sine', from: 200, to: 420, dur: 0.9, vol: 0.1 }, 'swarm-swell', 0.5)
  } else if (a === 'sting') {
    // the aim is fixed now and shown: the needles go exactly down these lines
    b.hold = true
    const ships = g.alive()
    const p = ships.length ? ships[b.ringI++ % ships.length] : null
    const ox = b.x
    const oy = b.y + STING * b.k
    const a0 = p ? Math.atan2(p.y - oy, p.x - ox) : Math.PI / 2
    b.aims = b.rage ? [a0 - 0.3, a0, a0 + 0.3] : [a0]
    b.aimFrom = [ox, oy]
    g.sfx.laserWarn()
  } else if (a === 'honey') {
    b.tellBelly = 1
    synth.tone({ type: 'sine', from: 160, to: 110, dur: 0.6, vol: 0.12 }, 'swarm-gloop', 0.4)
  } else if (a === 'ring') {
    b.eyeFlash = 1
  } else if (a === 'wall') {
    b.buzz = 1.1
    buzz(1)
  } else if (a === 'spin') {
    b.tellBelly = 1
    b.buzz = 0.8
    buzz(0.7)
  }
}

function done(b) {
  b.attack = null
  b.hold = false
  b.aims = []
  b.rest = b.rage ? 0.75 : 1.25
}

const ATTACKS = {
  // the ripe sacs swell, then each lets out a little flock that weaves
  // beside her and dives on a ship down a lane it shows first
  brood(b, g) {
    if (b.at >= 1 && b.step === 0) {
      b.step = 1
      const ripe = b.sacs.filter((s) => s.alive && s.size > 0.6)
      ripe.forEach((s, j) => {
        const [sx, sy] = sacAt(b, s)
        const side = s.ox < 0 ? -1 : 1
        const G = flock(g, { style: 'dive', n: b.rage ? 6 : 5, pal: SAC_PAL[s.i], from: { x: sx, y: sy }, x: clamp(sx + side * rand(90, 180) * b.k, 60, g.W - 60), hy: rand(260, Math.min(340, g.playerTop() - 50)) })
        G.hover = 0.9 + j * 0.55
        g.splash(sx, sy, '#d4ff5a')
      })
      if (!ripe.length) burst(g, b.x, b.y + STING * b.k, 8, 2)
      synth.noise({ dur: 0.4, vol: 0.2, freq: 1000, to: 200, q: 2 }, 'swarm-hatch', 0.2)
    }
    if (b.at > 1.5) done(b)
  },

  // five needles down each aim line, after the line has shown for a while
  sting(b, g) {
    if (b.at >= STING_WARN && b.step < 5 && b.at >= STING_WARN + b.step * 0.075) {
      b.step++
      const [ox, oy] = b.aimFrom
      for (const a of b.aims) g.shoot(ox, oy, a, 390, '#ff3b6b', 5)
      synth.tone({ type: 'square', from: 1400, to: 700, dur: 0.05, vol: 0.05 }, 'swarm-needle', 0.05)
    }
    if (b.at > STING_WARN + 0.6) done(b)
  },

  // slow fans of honey globs, the second shifted so the gaps move
  honey(b, g) {
    const k = b.k
    if (b.at >= 0.7 + b.step * 0.55 && b.step < (b.rage ? 3 : 2)) {
      const n = 6
      const off = b.step % 2 ? 0.11 : -0.11
      for (let i = 0; i < n; i++) g.shoot(b.x, b.y + (BELLY.y + 40) * k, Math.PI / 2 - 0.7 + (1.4 * i) / (n - 1) + off, 150, '#ffb02e', 9)
      b.step++
      b.tellBelly = 0.5
      synth.tone({ type: 'sine', from: 240, to: 90, dur: 0.2, vol: 0.15 }, 'swarm-glob', 0.1)
    }
    if (b.at > 1.9) done(b)
  },

  // she calls the swarm round a ship (round both, once she's angry)
  ring(b, g) {
    if (b.at >= 0.6 && b.step === 0) {
      b.step = 1
      const ships = g.alive()
      const targets = b.rage ? ships : ships.length ? [ships[b.ringI++ % ships.length]] : []
      targets.forEach((p, i) => ring(g, p, { pal: (b.ringI + i * 2) % PALS_N }))
    }
    if (b.at > 1.1) done(b)
  },

  // her wings beat a wall of bugs down the field
  wall(b, g) {
    if (b.at >= 1 && b.step === 0) {
      b.step = 1
      wall(g, { rows: 2, gaps: g.W < 900 ? 1 : 2, vy: 96 })
    }
    if (b.at > 1.4) done(b)
  },

  // angry: a spiral of bugs wheels out of her belly
  spin(b, g) {
    if (b.at >= 0.6 && b.step === 0) {
      b.step = 1
      spiral(g, { x: b.x, y: b.y + (BELLY.y + 20) * b.k, arms: 3, dur: 2.6, warm: 0.4, every: 0.2, pals: [1, 4, 2] })
    }
    if (b.at > 1) done(b)
  },
}

// ---------------------------------------------------------------- the crown

export function updateQueenFx(g, dt) {
  const c = fx.crown
  if (!c) return
  c.t += dt
  c.vy += 620 * dt
  c.x += c.vx * dt
  c.y += c.vy * dt
  c.rot += c.spin * dt
  if (Math.random() < dt * 30) g.sparks(c.x, c.y, '#ffe23d', 1)
  if (c.y > g.H + 80) fx.crown = null
}

export function drawQueenFx(g, ctx) {
  const c = fx.crown
  if (!c) return
  ctx.save()
  ctx.translate(c.x, c.y)
  ctx.rotate(c.rot)
  ctx.scale(c.k * 1.2, c.k * 1.2)
  crown(ctx, 0, 14)
  ctx.restore()
}

// ---------------------------------------------------------------- her art

function drawQueen(ctx, b, t) {
  const k = b.k
  const dying = b.dying > 0 ? 1 - b.dying / 2.6 : 0
  const angry = b.rage
  ctx.save()
  ctx.translate(b.x, b.y)
  ctx.scale(k, k)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'

  // wings, behind everything: a buzzing blur of two copies each
  const beat = dying ? 0 : Math.sin(b.wing) * (b.buzz > 0 ? 0.24 : 0.11)
  for (const [len, wid, base] of [[240, 64, -0.5], [180, 46, -0.08]]) {
    for (const d of [-1, 1]) {
      const droop = dying * 0.9
      wingShape(ctx, d, len, wid, base + beat + droop, t, 0.32)
      if (!dying) wingShape(ctx, d, len, wid, base - beat * 1.4 + 0.05, t, 0.18)
    }
  }

  // legs, folded under the saucer ring
  ctx.strokeStyle = '#2a0b30'
  ctx.lineWidth = 7
  for (const lx of [44, 84, 120]) {
    for (const d of [-1, 1]) {
      const w = Math.sin(t * 3 + lx + d) * 4
      ctx.beginPath()
      ctx.moveTo(d * lx, DISC.y + 18)
      ctx.lineTo(d * (lx * 1.16 + 8), DISC.y + 46 + w)
      ctx.lineTo(d * (lx * 1.06 + 4), DISC.y + 78 + w)
      ctx.stroke()
    }
  }

  // stalks the sacs hang from
  ctx.strokeStyle = '#4a1440'
  ctx.lineWidth = 5
  for (const s of b.sacs) {
    const sy = s.oy + Math.abs(Math.sin(b.t * 2 + s.i * 1.7) * 3) * 0.6
    const sx = s.ox + Math.sin(b.t * 2 + s.i * 1.7) * 3
    ctx.beginPath()
    ctx.moveTo(s.ox * 0.78, DISC.y + 12)
    ctx.quadraticCurveTo(s.ox * 0.95, (DISC.y + sy) / 2, sx, sy - s.r * (s.alive ? s.size : 0.3))
    ctx.stroke()
  }

  drawBelly(ctx, b, t)
  drawDisc(ctx, b, t, angry)
  drawHead(ctx, b, t, angry, dying)
  for (const s of b.sacs) drawSac(ctx, b, s, t)

  // the stinger's aim lines
  if (b.attack === 'sting' && b.aims.length) {
    const tell = Math.min(1, b.at / STING_WARN)
    const firing = b.at >= STING_WARN
    ctx.restore()
    ctx.save()
    const [ox, oy] = b.aimFrom
    for (const a of b.aims) {
      const len = 1400
      ctx.strokeStyle = `rgba(255,59,107,${firing ? 0.25 : 0.35 + 0.35 * Math.sin(t * 30)})`
      ctx.lineWidth = firing ? 2 : 2 + tell * 3
      ctx.setLineDash([14, 10])
      ctx.lineDashOffset = -t * 200
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(ox + Math.cos(a) * len, oy + Math.sin(a) * len)
      ctx.stroke()
    }
    ctx.setLineDash([])
    ctx.globalCompositeOperation = 'lighter'
    stampGlow(ctx, '#ff3b6b', ox, oy, 12 + tell * 26, 0.5 + tell * 0.5)
  }
  ctx.restore()
}

function wingShape(ctx, d, len, wid, ang, t, a) {
  ctx.save()
  ctx.translate(d * 56, -44)
  ctx.scale(d, 1)
  ctx.rotate(ang)
  const gr = ctx.createLinearGradient(0, 0, len, 0)
  gr.addColorStop(0, `rgba(160,255,240,${a * 1.3})`)
  gr.addColorStop(0.5, `rgba(190,160,255,${a})`)
  gr.addColorStop(1, `rgba(255,160,230,${a * 0.8})`)
  ctx.fillStyle = gr
  ctx.strokeStyle = `rgba(255,255,255,${a * 1.8})`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(len / 2, 0, len / 2, wid / 2, 0, 0, TAU)
  ctx.fill()
  ctx.stroke()
  ctx.strokeStyle = `rgba(90,40,140,${a * 1.2})`
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(8, 0)
  ctx.lineTo(len * 0.95, -wid * 0.05)
  ctx.moveTo(len * 0.3, 0)
  ctx.lineTo(len * 0.62, wid * 0.36)
  ctx.moveTo(len * 0.45, 0)
  ctx.lineTo(len * 0.8, -wid * 0.34)
  ctx.stroke()
  ctx.restore()
}

// The soft striped belly, with honeycomb sheen and the stinger underneath.
function drawBelly(ctx, b, t) {
  const pulse = 1 + 0.035 * Math.sin(t * 3)
  const rx = BELLY.rx * pulse
  const ry = BELLY.ry * pulse
  const by = BELLY.y
  // the stinger
  ctx.fillStyle = '#3a0c2e'
  ctx.beginPath()
  ctx.moveTo(-18, by + ry - 14)
  ctx.lineTo(18, by + ry - 14)
  ctx.lineTo(0, STING)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#ffd23d'
  ctx.beginPath()
  ctx.moveTo(-5, STING - 14)
  ctx.lineTo(5, STING - 14)
  ctx.lineTo(0, STING)
  ctx.closePath()
  ctx.fill()

  const gr = ctx.createRadialGradient(-20, by - 20, 6, 0, by, rx * 1.1)
  gr.addColorStop(0, '#fff2a8')
  gr.addColorStop(0.45, '#ffb02e')
  gr.addColorStop(1, '#8a3a12')
  ctx.fillStyle = gr
  ctx.beginPath()
  ctx.ellipse(0, by, rx, ry, 0, 0, TAU)
  ctx.fill()
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(0, by, rx, ry, 0, 0, TAU)
  ctx.clip()
  ctx.fillStyle = 'rgba(58,12,46,0.78)'
  for (const sy of [-26, 6, 36]) {
    ctx.beginPath()
    ctx.ellipse(0, by + sy, rx * 1.05, 9 + sy * 0.06, 0, 0, TAU)
    ctx.fill()
  }
  // honeycomb sheen up on the light side
  ctx.strokeStyle = 'rgba(255,248,200,0.4)'
  ctx.lineWidth = 1.4
  for (const [hx, hy] of [[-34, -38], [-20, -46], [-48, -24], [-6, -38], [-34, -14]]) hex(ctx, hx, by + hy + 20, 8)

  // the armour: golden honeycomb plates that slide apart to either side
  // while she's stunned
  const arm = 1 - b.open
  if (arm > 0.02) {
    const pg = ctx.createLinearGradient(-rx, by - ry, rx * 0.6, by + ry)
    pg.addColorStop(0, '#fff6c2')
    pg.addColorStop(0.35, '#f0b429')
    pg.addColorStop(1, '#7a4300')
    ctx.fillStyle = pg
    ctx.strokeStyle = '#5a2a00'
    ctx.lineWidth = 2.2
    ctx.globalAlpha = arm
    const r = 15
    const slide = b.open * rx
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        const cx = i * r * 1.5
        const cy = by + j * r * 1.732 + (i % 2 ? r * 0.866 : 0)
        if ((cx / (rx + 8)) ** 2 + ((cy - by) / (ry + 8)) ** 2 > 1) continue
        const sx = cx + (cx < 0 ? -1 : cx > 0 ? 1 : j % 2 ? 1 : -1) * slide
        ctx.beginPath()
        for (let k = 0; k < 6; k++) ctx.lineTo(sx + Math.cos((k * Math.PI) / 3) * r * 0.86, cy + Math.sin((k * Math.PI) / 3) * r * 0.86)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1
  }
  ctx.restore()

  // the soft spot glows: brighter when she's about to spit honey, and a
  // beacon of a target while she's stunned
  const g = Math.max(b.tellBelly, b.daze > 0 ? 0.6 + 0.4 * Math.sin(t * 10) : 0)
  if (g > 0.02) {
    ctx.globalCompositeOperation = 'lighter'
    stampGlow(ctx, '#ffcf5a', 0, by + 10, rx * 1.15, g * 0.8)
    ctx.globalCompositeOperation = 'source-over'
  }
  if (b.flash > 0) {
    ctx.globalAlpha = b.flash * 0.55
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(0, by, rx, ry, 0, 0, TAU)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

function hex(ctx, x, y, r) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r)
  }
  ctx.closePath()
  ctx.stroke()
}

// The saucer ring round her middle, with gold running lights.
function drawDisc(ctx, b, t, angry) {
  const { y, rx, ry } = DISC
  const hg = ctx.createLinearGradient(0, y - ry, 0, y + ry)
  hg.addColorStop(0, '#ffd6f0')
  hg.addColorStop(0.45, '#c2367a')
  hg.addColorStop(1, '#3a0828')
  ctx.fillStyle = hg
  ctx.beginPath()
  ctx.ellipse(0, y, rx, ry, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = 'rgba(58,8,40,0.6)'
  ctx.beginPath()
  ctx.ellipse(0, y + 6, rx * 0.98, ry * 0.45, 0, 0, Math.PI)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(0, y, rx * 0.92, ry * 0.7, 0, Math.PI * 1.08, Math.PI * 1.6)
  ctx.stroke()
  const n = 11
  for (let i = 0; i < n; i++) {
    const u = (i / (n - 1)) * 2 - 1
    const on = Math.sin(t * (angry ? 12 : 7) - i * 0.9) > 0.1
    ctx.fillStyle = on ? (angry ? '#ff5a5a' : '#ffe23d') : 'rgba(255,226,61,0.25)'
    ctx.beginPath()
    ctx.arc(u * rx * 0.84, y + 8 + (1 - u * u) * 10, 4.5, 0, TAU)
    ctx.fill()
  }
}

// Her head: a violet carapace, two great compound eyes, feelers, pincers,
// and the crown.
function drawHead(ctx, b, t, angry, dying) {
  const { y, r } = HEAD
  // antennae
  ctx.strokeStyle = '#2a0b30'
  ctx.lineWidth = 4
  for (const d of [-1, 1]) {
    const w = Math.sin(t * 2.4 + d) * 5
    ctx.beginPath()
    ctx.moveTo(d * 14, y - r + 8)
    ctx.bezierCurveTo(d * 20, y - r - 30, d * (52 + w), y - r - 40, d * (60 + w), y - r - 18)
    ctx.stroke()
    ctx.fillStyle = '#ff9be6'
    ctx.beginPath()
    ctx.arc(d * (60 + w), y - r - 18, 6, 0, TAU)
    ctx.fill()
  }
  // pincers over the saucer rim
  ctx.fillStyle = '#2a0b30'
  for (const d of [-1, 1]) {
    const open = Math.sin(t * 5) * 0.08 + (b.attack ? 0.12 : 0)
    ctx.save()
    ctx.translate(d * 14, y + r - 8)
    ctx.rotate(d * open)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(d * 18, 18, d * 2, 34)
    ctx.quadraticCurveTo(d * 8, 16, -d * 6, 6)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  const hg = ctx.createRadialGradient(-14, y - 18, 4, 0, y, r)
  hg.addColorStop(0, '#c9a4ff')
  hg.addColorStop(0.5, '#6a2fc0')
  hg.addColorStop(1, '#22094d')
  ctx.fillStyle = hg
  ctx.beginPath()
  ctx.arc(0, y, r, 0, TAU)
  ctx.fill()

  for (const d of [-1, 1]) {
    const ex = d * 21
    const ey = y - 2
    const eg = ctx.createRadialGradient(ex - d * 4, ey - 8, 2, ex, ey, 24)
    const lit = angry || b.eyeFlash > 0
    eg.addColorStop(0, lit ? '#ffd0d0' : '#ffd6f4')
    eg.addColorStop(0.45, lit ? '#ff3b4b' : '#ff4fb0')
    eg.addColorStop(1, lit ? '#5a0010' : '#4a0a3a')
    ctx.fillStyle = eg
    ctx.beginPath()
    ctx.ellipse(ex, ey, 19, 23, d * 0.35, 0, TAU)
    ctx.fill()
    if (dying || b.daze > 0) {
      // dizzy spirals instead of eyes
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 2.5
      ctx.beginPath()
      for (let s = 0; s < 16; s++) {
        const a = s * 0.7 + t * 8 * d
        ctx.lineTo(ex + Math.cos(a) * s * 0.9, ey + Math.sin(a) * s * 0.9)
      }
      ctx.stroke()
    } else {
      // facets: a scatter of little lighter cells
      ctx.fillStyle = 'rgba(255,255,255,0.22)'
      for (let i = 0; i < 9; i++) {
        const a = i * 2.4
        const rr = 4 + (i % 3) * 5
        ctx.beginPath()
        ctx.arc(ex + Math.cos(a) * rr, ey + Math.sin(a) * rr * 1.2, 2.2, 0, TAU)
        ctx.fill()
      }
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.ellipse(ex - d * 6, ey - 10, 5, 7, d * 0.35, 0, TAU)
      ctx.fill()
    }
  }
  if (b.eyeFlash > 0) {
    ctx.globalCompositeOperation = 'lighter'
    for (const d of [-1, 1]) stampGlow(ctx, '#ff3b6b', d * 21, y - 2, 40, b.eyeFlash)
    ctx.globalCompositeOperation = 'source-over'
  }
  // the crown: it's knocked askew as she goes down
  ctx.save()
  ctx.translate(dying * 30, y - r + 6 - dying * 20)
  ctx.rotate(dying * 0.7)
  crown(ctx, 0, 0)
  ctx.restore()
}

function crown(ctx, x, y) {
  ctx.fillStyle = '#ffd23d'
  ctx.strokeStyle = '#8a5a00'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x - 26, y)
  ctx.lineTo(x - 30, y - 24)
  ctx.lineTo(x - 15, y - 12)
  ctx.lineTo(x, y - 30)
  ctx.lineTo(x + 15, y - 12)
  ctx.lineTo(x + 30, y - 24)
  ctx.lineTo(x + 26, y)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#fff6c2'
  ctx.fillRect(x - 26, y - 6, 52, 6)
  for (const [jx, jy, c] of [[-30, -24, '#38d6ff'], [0, -30, '#ff4fb0'], [30, -24, '#7dff5a'], [0, -3, '#ff4fb0']]) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(x + jx, y + jy, 4, 0, TAU)
    ctx.fill()
  }
}

// An egg sac: a glowing see-through bag with bugs wriggling about inside.
function drawSac(ctx, b, s, t) {
  const sway = Math.sin(b.t * 2 + s.i * 1.7) * 3
  const x = s.ox + sway
  const y = s.oy + Math.abs(sway) * 0.6
  if (!s.alive) {
    // a torn, dripping stub
    ctx.fillStyle = '#5a7a1a'
    ctx.beginPath()
    ctx.ellipse(x, y - s.r * 0.75, 7, 5, 0, 0, TAU)
    ctx.fill()
    ctx.fillStyle = 'rgba(212,255,90,0.7)'
    const drip = (t * 0.8 + s.i * 0.3) % 1
    ctx.beginPath()
    ctx.arc(x, y - s.r * 0.6 + drip * 30, 3 * (1 - drip), 0, TAU)
    ctx.fill()
    return
  }
  const r = s.r * s.size
  const swell = 1 + s.glow * 0.15 * (0.5 + 0.5 * Math.sin(t * 22))
  const rx = r * swell
  const ry = r * 1.18 * swell
  const gr = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.35, 1, x, y, ry)
  gr.addColorStop(0, 'rgba(250,255,200,0.95)')
  gr.addColorStop(0.5, 'rgba(170,235,70,0.85)')
  gr.addColorStop(1, 'rgba(60,120,26,0.9)')
  ctx.fillStyle = gr
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU)
  ctx.fill()
  // the brood inside, wriggling
  if (s.size > 0.4) {
    ctx.fillStyle = 'rgba(40,70,10,0.55)'
    for (let i = 0; i < 3; i++) {
      const a = t * (1.6 + i * 0.4) + i * 2.1 + s.i
      const bx = x + Math.cos(a) * rx * 0.38
      const by = y + Math.sin(a * 1.3) * ry * 0.38
      ctx.beginPath()
      ctx.ellipse(bx, by, rx * 0.2, rx * 0.12, a, 0, TAU)
      ctx.fill()
    }
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.ellipse(x, y, rx * 0.7, ry * 0.72, 0, Math.PI * 1.1, Math.PI * 1.45)
  ctx.stroke()
  // how many hits it has left, as a thin ring that empties
  if (s.hp < s.max) {
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(x, y, ry + 6, -Math.PI / 2, -Math.PI / 2 + TAU * (s.hp / s.max))
    ctx.stroke()
  }
  if (s.glow > 0 || s.flash > 0) {
    ctx.globalCompositeOperation = 'lighter'
    stampGlow(ctx, '#d4ff5a', x, y, ry * 1.8, Math.max(s.glow * (0.6 + 0.4 * Math.sin(t * 22)), s.flash * 0.6))
    ctx.globalCompositeOperation = 'source-over'
  }
}
