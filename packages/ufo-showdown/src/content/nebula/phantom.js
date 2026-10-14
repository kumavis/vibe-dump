// The Phantom: a ghost in a flying saucer that haunts the fog. It drifts where
// the ships' lights don't reach, so mostly what you see of it is its eyes.
// Before every attack its eyes and mouth light up in the attack's colour, and
// that glow parts the fog round it: the tell, and the moment it's easiest to
// see. Hitting it makes it flicker into view too.
//
// It teleports with a shimmer: a sparkle marks where it's going before it gets
// there. From a third of the way down it starts throwing echoes of itself
// into the fog. They shoot too, and pop when hit. The real one is the big one
// with the health bar.
//
//   stage 1   spread, aimed, ring, teleport
//   stage 2   + echoes                         (under 2/3 health)
//   stage 3   + swirl, faster, angry brows     (under 1/3 health)

import { synth } from '../../audio.js'
import { drawGhost, ghostEyes, stamp } from './draw.js'

const R = 110
const LAV = '#c9b8ff'

const ATTACKS = {
  spread: { color: '#ff7bd8', charge: 0.95 },
  aimed: { color: '#ffe23d', charge: 0.8 },
  ring: { color: '#7dfcff', charge: 1 },
  swirl: { color: '#9ff0ff', charge: 1 },
  echoes: { color: LAV, charge: 0.8 },
  teleport: { color: LAV, charge: 0 },
}

const SEQ = [
  null,
  ['spread', 'aimed', 'teleport', 'ring', 'spread', 'teleport'],
  ['spread', 'echoes', 'aimed', 'ring', 'teleport', 'spread', 'aimed', 'teleport'],
  ['swirl', 'spread', 'teleport', 'echoes', 'aimed', 'ring', 'teleport'],
]
const REST = [0, 1.5, 1.2, 0.85]

// main.js calls shot() and hits() without the game API (the README says they
// get it), so hold on to the one create() and update() are given.
let G = null

// Where the Phantom can be: across the top, never down among the ships. In a
// tall window it comes further down, so it isn't always miles from them.
const zone = (g) => ({ x0: R + 40, x1: Math.max(R + 40, g.W - R - 40), y0: 150, y1: Math.max(270, g.playerTop() - 250) })

export const phantom = {
  name: 'The Phantom',
  warnSub: 'Something is in the fog…',
  hudName: (b) => (b.echoing > 0 ? 'The Phantom — find the real one!' : 'The Phantom'),
  create(g) {
    G = g
    const hp = Math.round(120 * g.hpMult())
    return {
      x: g.W / 2,
      y: -160,
      ty: 200,
      r: R,
      hp,
      maxHp: hp,
      hx: g.W / 2,
      hy: 200,
      wanderT: 1.5,
      vis: 1,
      stage: 1,
      seqI: 0,
      attack: null,
      at: 0,
      step: 0,
      rest: 1.4,
      charge: 0,
      chargeColor: ATTACKS.spread.color,
      shine: 0, // a burst of light each time it fires
      warp: 0,
      tele: null,
      blinkT: 2,
      spin: 0,
      echoing: 0,
    }
  },

  update(b, dt, g) {
    G = g
    b.shine = Math.max(0, b.shine - dt * 2.5)
    b.echoing = Math.max(0, b.echoing - dt)
    b.blinkT -= dt
    if (b.blinkT < -0.14) b.blinkT = g.rand(2, 4.5)
    // it fades in and out as it drifts, solid only when it means business
    const want = b.attack && b.at < (ATTACKS[b.attack]?.charge ?? 0) + 0.6 ? 1 : 0.6 + 0.4 * Math.sin(b.t * 0.9)
    b.vis += (want - b.vis) * Math.min(1, dt * 3)
    if (g.bossEnter(b, dt)) {
      b.hy = b.y
      return
    }

    const frac = b.hp / b.maxHp
    const stage = frac > 0.66 ? 1 : frac > 0.33 ? 2 : 3
    if (stage > b.stage) {
      b.stage = stage
      b.seqI = 0
      if (stage === 3) {
        b.rage = true
        g.popText(b.x, b.y + 140, 'The Phantom is cross!', '#ff8ad8', 22, 1.8)
        g.shake(8)
      }
    }

    if (b.tele) return teleporting(b, dt, g)

    // drift from spot to spot, slowing right down while it lines up a shot
    const z = zone(g)
    if ((b.wanderT -= dt) <= 0) {
      b.hx = g.rand(z.x0, z.x1)
      b.hy = g.rand(z.y0, z.y1)
      b.wanderT = g.rand(2.2, 3.6)
    }
    const calm = b.attack ? 0.35 : 1
    const px = b.x
    b.x += (b.hx - b.x) * Math.min(1, dt * 0.9 * calm)
    b.y += (b.hy + Math.sin(b.t * 1.6) * 12 - b.y) * Math.min(1, dt * 1.2 * calm)
    b.tilt = g.clamp((b.x - px) / Math.max(dt, 1e-3) / 2000, -0.1, 0.1)

    if (!b.attack) {
      b.charge = Math.max(0, b.charge - dt * 3)
      if ((b.rest -= dt) <= 0) {
        const seq = SEQ[b.stage]
        b.attack = seq[b.seqI++ % seq.length]
        b.at = 0
        b.step = 0
        b.chargeColor = ATTACKS[b.attack].color
        const cd = chargeTime(b)
        if (cd) synth.tone({ type: 'triangle', from: 220, to: 660, dur: cd, vol: 0.09, attack: cd * 0.6 }, 'neb-charge', 0.3)
      }
      return
    }
    attacking(b, dt, g)
  },

  shot(b, x, y, owner, g = G) {
    if (b.warp > 0.6) return false // mid-teleport, the lasers go straight through
    const dx = (x - b.x) / (R * 0.78)
    const dy = (y - (b.y - R * 0.2)) / (R * 0.9)
    const inBody = dx * dx + dy * dy <= 1
    const inRing = ((x - b.x) / R) ** 2 + ((y - b.y - R * 0.16) / (R * 0.28)) ** 2 <= 1
    if (!inBody && !inRing) return false
    if (b.entering) {
      g.sparks(x, y, '#ffffff', 2)
      g.sfx.ting()
    } else g.damageBoss(b, 1, owner, x, y)
    return true
  },

  hits(b, p) {
    if (b.warp > 0.4) return false
    return ((p.x - b.x) / (R * 0.75)) ** 2 + ((p.y - (b.y - R * 0.1)) / (R * 0.8)) ** 2 < 1
  },

  nova(b, owner, g) {
    if (b.entering || b.warp > 0.6) return
    g.damageBoss(b, 8, owner, b.x, b.y)
  },

  draw(b, g, ctx) {
    // beaten mid-teleport, it snaps back solid for its last moments
    const dying = b.dying > 0
    drawGhost(ctx, b.x, b.y, R, g.time, {
      alpha: dying ? 1 : b.vis,
      warp: dying ? 0 : b.warp,
      flash: b.flash,
      hurt: b.hurt,
      charge: b.charge,
      chargeColor: b.chargeColor,
      angry: b.stage === 3,
      blink: b.blinkT < 0 && b.charge < 0.05,
    })
  },

  explodeAt: (b) => [b.x + (Math.random() - 0.5) * R * 1.5, b.y + (Math.random() - 0.65) * R * 1.4],

  defeated(b, g) {
    g.popText(b.x, b.y + 40, 'Boo-hoo!', LAV, 22, 1.6)
  },
}

const chargeTime = (b) => ATTACKS[b.attack].charge * (b.stage === 3 ? 0.8 : 1)

function done(b) {
  b.attack = null
  b.rest = REST[b.stage]
}

function attacking(b, dt, g) {
  b.at += dt
  const cd = chargeTime(b)
  if (b.at < cd) {
    b.charge = b.at / cd
    return
  }
  b.charge = Math.max(0, 1 - (b.at - cd) * 1.5)
  const ft = b.at - cd
  const mx = b.x
  const my = b.y - R * 0.08
  const col = b.chargeColor
  const fire = () => {
    b.shine = 1
    g.sfx.zap()
  }
  switch (b.attack) {
    case 'spread': {
      // two fans, the second one shifted half a gap: step sideways, not back
      if (ft >= b.step * 0.5 && b.step < 2) {
        const n = b.stage === 3 ? 9 : 7
        const tg = g.nearestPlayer(mx, my)
        const aim = tg ? g.clamp(Math.atan2(tg.y - my, tg.x - mx), Math.PI / 2 - 0.45, Math.PI / 2 + 0.45) : Math.PI / 2
        const width = 1.15
        g.fan(mx, my, n, width, 205, col, aim + (b.step ? width / (n - 1) / 2 : 0))
        fire()
        b.step++
      }
      if (ft > 0.8) done(b)
      break
    }
    case 'aimed':
      if (ft >= b.step * 0.32 && b.step < 3) {
        g.aimed(mx, my, 3, 0.16, 260, col)
        fire()
        b.step++
      }
      if (ft > 0.9) done(b)
      break
    case 'ring':
      if (ft >= b.step * 0.45 && b.step < 2) {
        const n = b.stage === 3 ? 18 : 14
        g.ringShot(b.x, b.y, n, 150, col, b.step * (Math.PI / n) + b.t)
        fire()
        b.step++
      }
      if (ft > 0.7) done(b)
      break
    case 'swirl':
      b.charge = 0.8
      if (ft - b.step * 0.09 >= 0) {
        b.step++
        b.spin += 0.26
        for (const k of [0, Math.PI]) g.shoot(b.x, b.y, b.spin + k, 170, col)
        b.shine = Math.max(b.shine, 0.6)
      }
      if (ft > 2.3) done(b)
      break
    case 'echoes':
      throwEchoes(b, g)
      startTeleport(b, g)
      b.attack = null
      b.rest = REST[b.stage] + 0.6
      break
    case 'teleport':
      startTeleport(b, g)
      b.attack = null
      b.rest = REST[b.stage]
      break
  }
}

function startTeleport(b, g) {
  const z = zone(g)
  // somewhere well away, so it really feels like it jumped
  let x = g.rand(z.x0, z.x1)
  for (let i = 0; i < 6 && Math.abs(x - b.x) < (z.x1 - z.x0) * 0.35; i++) x = g.rand(z.x0, z.x1)
  b.tele = { st: 'out', t: 0, x, y: g.rand(z.y0, z.y1) }
  b.charge = 0
  synth.tone({ type: 'sine', from: 900, to: 260, dur: 0.5, vol: 0.12 }, 'neb-warp', 0.2)
  synth.noise({ dur: 0.5, vol: 0.12, freq: 3200, to: 500 }, 'neb-warpn', 0.2)
}

function teleporting(b, dt, g) {
  const T = b.tele
  T.t += dt
  if (T.st === 'out') {
    b.warp = Math.min(1, T.t / 0.55)
    if (T.t >= 0.55) {
      T.st = 'gone'
      T.t = 0
      b.x = b.hx = T.x
      b.y = b.hy = T.y
    }
  } else if (T.st === 'gone') {
    b.warp = 1
    if (T.t >= 0.5) {
      T.st = 'in'
      T.t = 0
      synth.tone({ type: 'sine', from: 260, to: 900, dur: 0.45, vol: 0.1 }, 'neb-warp', 0.2)
    }
  } else {
    b.warp = Math.max(0, 1 - T.t / 0.45)
    if (T.t >= 0.45) {
      b.warp = 0
      b.tele = null
      b.wanderT = g.rand(1.5, 2.5)
    }
  }
}

function throwEchoes(b, g) {
  const n = b.stage === 3 ? 3 : 2
  const z = zone(g)
  const spots = []
  for (let i = 0; i < n; i++) {
    let x = g.rand(z.x0, z.x1)
    for (let k = 0; k < 8 && spots.some((s) => Math.abs(s - x) < 160); k++) x = g.rand(z.x0, z.x1)
    spots.push(x)
    g.spawn('phantomEcho', b.x, b.y, { tx: x, ty: g.rand(z.y0 - 20, z.y1), warp: 1, life: 9, fireT: g.rand(1.4, 2.4), shots: 0, entered: true })
  }
  b.echoing = 4
  g.popText(b.x, b.y + 120, 'Which one is real?', LAV, 20, 1.6)
}

// ---------------------------------------------------------------- echoes

// A smaller copy of the Phantom that streaks out of it, haunts one spot, takes
// a shot or two (with the same eye-glow warning) and fades away. One hit
// pops it.
export const phantomEcho = {
  hp: 1,
  r: 48,
  score: 150,
  light: LAV,
  boom: 0.6,
  drop: 0.12,
  keepOffscreen: true,
  update(e, dt, g) {
    e.charge ??= 0
    e.life -= dt
    // streaks out from the boss to its spot
    e.x += (e.tx - e.x) * Math.min(1, dt * 2.4)
    e.y += (e.ty + Math.sin(e.t * 1.8 + e.seed) * 10 - e.y) * Math.min(1, dt * 2.4)
    if (e.life > 0.6) e.warp = Math.max(0, e.warp - dt * 2)
    else e.warp = Math.min(1, e.warp + dt * 2)
    if (e.life <= 0) e.gone = true
    if (e.life < 1 || e.shots >= 2) {
      e.charge = Math.max(0, e.charge - dt * 3)
      if (e.shots >= 2) e.life = Math.min(e.life, 1)
      return
    }
    e.fireT -= dt * g.mission.fire
    e.charge = e.fireT < 0.7 ? 1 - e.fireT / 0.7 : 0
    if (e.fireT <= 0) {
      g.aimed(e.x, e.y - 8, 1, 0, 230, '#7dfcff', g.nearestPlayer(e.x, e.y))
      e.shots++
      e.fireT = g.rand(1.8, 2.6)
      e.charge = 0
    }
  },
  draw(e, g, ctx) {
    drawGhost(ctx, e.x, e.y, e.r, g.time + e.seed, { alpha: 0.8, warp: e.warp, flash: e.flash, charge: e.charge, chargeColor: '#7dfcff', echo: true })
  },
  onDeath(e, g) {
    g.splash(e.x, e.y, LAV)
    g.popText(e.x, e.y - 34, 'Pop!', '#efe8ff', 16, 0.8)
    synth.tone({ type: 'sine', from: 700, to: 1800, dur: 0.14, vol: 0.12 }, 'neb-pop', 0.05)
  },
}

// ---------------------------------------------------------------- through the fog

// How far the Phantom lights the fog: it glows when it charges and fires, and
// flickers into view while it's being hit.
export function phantomLight(b) {
  if (b.warp > 0.9) return null
  const k = Math.max(b.charge, b.shine, Math.min(1, b.hurt * 1.6) * 0.7, b.dying > 0 ? 1 : 0) * (1 - b.warp)
  if (k < 0.03) return null
  return { x: b.x, y: b.y - R * 0.2, r: 120 + 160 * k, a: Math.min(1, k * 1.3), rim: b.dying > 0 ? '#ffffff' : b.chargeColor }
}

export const echoLight = (e) => (e.charge > 0.05 && e.warp < 0.5 ? { x: e.x, y: e.y, r: 60 + 70 * e.charge, a: e.charge, rim: '#7dfcff' } : null)

// Its eyes always show through the fog, and the attack glow builds in its
// mouth; when it teleports, a sparkle marks where it'll land.
export function phantomTells(ctx, b, g, clear) {
  const t = g.time
  const shown = 1 - b.warp
  const eyeCol = b.charge > 0.05 ? b.chargeColor : '#7dfcff'
  const blink = b.blinkT < 0 && b.charge < 0.05
  const hidden = 1 - clear
  if (shown > 0.02 && !b.entering) {
    for (const [ex, ey] of ghostEyes(b.x, b.y, R, b.warp)) {
      stamp(ctx, eyeCol, ex, ey, R * (0.2 + 0.12 * b.charge), shown * (blink ? 0.2 : 0.55 + 0.45 * b.charge) * (0.5 + 0.5 * hidden), false)
      if (!blink) stamp(ctx, '#ffffff', ex, ey + R * 0.02, R * 0.07, shown * hidden * 0.9)
    }
  } else if (b.entering) {
    // coming in from the top: just the eyes, getting brighter
    for (const [ex, ey] of ghostEyes(b.x, b.y, R)) stamp(ctx, '#7dfcff', ex, ey, R * 0.22, 0.8, false)
  }
  if (b.charge > 0.05 && shown > 0.1) {
    stamp(ctx, b.chargeColor, b.x, b.y - R * 0.08, R * (0.12 + 0.35 * b.charge), b.charge * shown)
  }
  if (b.tele && b.tele.st !== 'in') {
    // the landing spot: sparkles spiralling in
    const T = b.tele
    const k = T.st === 'out' ? T.t / 0.55 : 1
    stamp(ctx, LAV, T.x, T.y - R * 0.2, R * (0.4 + 0.6 * k), 0.55 * k, false)
    for (let i = 0; i < 8; i++) {
      const a = t * 3 + (i * Math.PI) / 4
      const rr = R * (1.1 - 0.6 * k) * (0.8 + 0.2 * Math.sin(t * 7 + i))
      stamp(ctx, i % 2 ? '#ffffff' : LAV, T.x + Math.cos(a) * rr, T.y - R * 0.2 + Math.sin(a) * rr * 0.7, 7, 0.4 + 0.5 * k)
    }
  }
  if (b.tele && b.tele.st === 'out') {
    // and where it's leaving: a shimmer collapsing to a line
    const k = b.tele.t / 0.55
    stamp(ctx, LAV, b.x, b.y - R * 0.2, R * (1.2 - k), 0.5 * (1 - k), false)
  }
}

export function echoHint(ctx, e, g, clear) {
  const shown = 1 - e.warp
  if (shown < 0.05) return
  // the same cyan eyes as the real one, so it really is a guess in the fog
  const col = '#7dfcff'
  const hidden = 1 - clear
  for (const [ex, ey] of ghostEyes(e.x, e.y, e.r, e.warp)) {
    stamp(ctx, col, ex, ey, e.r * (0.3 + 0.15 * e.charge), shown * (0.55 + 0.45 * e.charge) * (0.5 + 0.5 * hidden), false)
    stamp(ctx, '#ffffff', ex, ey + e.r * 0.02, e.r * 0.09, shown * hidden * 0.9)
  }
  if (e.charge > 0.05) stamp(ctx, col, e.x, e.y - 8, 8 + 18 * e.charge, e.charge * shown)
}
