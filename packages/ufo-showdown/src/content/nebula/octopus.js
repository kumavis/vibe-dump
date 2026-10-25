// The Gloomtopus: a big cosmic octopus that lives in the fog. Mostly what you
// see of it is two golden eyes and a scatter of glowing spots, until it lights
// up to attack. Its head is the only place it can be hurt; lasers fly
// straight through its arms (they flinch, but that's all).
//
// Every attack has a tell. The ones that come at you through the fog are
// drawn over it, so you can always see them:
//
//   spread  its mouth glows pink, then two fans, the second shifted half a gap
//   tips    two arms rear up with glowing tips, then shoot at you in bursts
//   slam    an arm rears up and a glowing lane marks where it will come down
//   sweep   an arm swings across under it; a glowing arc shows its reach, so
//           duck under it
//   grab    a ring of suckers follows a ship, stops, flashes, then an arm
//           shoots out to where it stopped
//   ink     it puffs up, then squirts ink that swallows the light for a few
//           seconds (bullets and tells still show)
//   ring    its spots flare, then two rings of bubbles
//   squad   its eyes flash pink and lurkers creep in from the sides
//   twirl   its arms spin up, then a pinwheel of bullets
//
//   stage 1   spread, slam, tips, ink, sweep
//   stage 2   + grab, ring, squad          (under 2/3 health)
//   stage 3   + twirl, faster, cross brows (under 1/3 health)

import { synth } from '../../audio.js'
import { stamp } from './draw.js'
import { ARMS, armRoot, armPose, drawArm, armFill, armGlow, drawOctopus, inHead, EYE, HEAD, MOUTH, SPOTS } from './octoart.js'
import { ambush } from './lurker.js'

const R = 85
const GOLD = '#ffd84a'
const TELL = '#e07bff' // the glow of an arm that's coming for you
const TAU = Math.PI * 2

const ATTACKS = {
  spread: { color: '#ff7bd8', charge: 0.9 },
  tips: { color: '#7dfcff', charge: 0.85 },
  ring: { color: '#c9b8ff', charge: 0.9 },
  twirl: { color: '#9ff0ff', charge: 1 },
  ink: { color: '#b98cff', charge: 0.85 },
  squad: { color: '#ff5fd2', charge: 0.6 },
  slam: { color: TELL, charge: 0 },
  sweep: { color: TELL, charge: 0 },
  grab: { color: TELL, charge: 0 },
}

const SEQ = [
  null,
  ['spread', 'slam', 'tips', 'ink', 'sweep', 'spread', 'slam', 'tips'],
  ['grab', 'spread', 'slam', 'squad', 'ink', 'tips', 'sweep', 'ring', 'grab', 'slam'],
  ['twirl', 'grab', 'slam', 'ink', 'spread', 'sweep', 'squad', 'tips', 'grab', 'ring'],
]
const REST = [0, 1.25, 1.0, 0.75]

// slam lanes: how long the warning glows, how long the arm takes to come down
// within that, how long it stays down and how long it takes to pull back
const SLAM = { warn: 1.15, extend: 0.14, down: 0.55, retract: 0.3, w: 54 }

// main.js passes the game API to shot() and hits() too, but keep the one
// create() and update() were given in case it doesn't.
let G = null

// Where the Gloomtopus can drift: across the top, arms and all on screen.
const zone = (g) => {
  const x0 = R * 1.7 + 30
  return { x0, x1: Math.max(x0, g.W - x0), y0: 215, y1: Math.max(235, g.playerTop() - 180) }
}

const eyesOf = (b) => [-1, 1].map((d) => [b.x + d * EYE.x * R, b.y + EYE.y * R])
const mouthOf = (b) => [b.x, b.y + MOUTH.y * R]
// Arms that reach out over the fog start under the head rather than at their
// true roots, so they never cover its face.
const reachRoot = (b, i) => {
  const [rx] = armRoot(b, i, R)
  return [rx, b.y + R * 0.16]
}
const tipOf = (b, i, g) => {
  const pts = armPose(b, i, R, g.time, b.arms[i].raise, b.wild)
  return pts[pts.length - 1]
}

export const octopus = {
  name: 'The Gloomtopus',
  warnSub: 'Something with a lot of arms…',
  create(g) {
    G = g
    const hp = Math.round(130 * g.hpMult())
    return {
      x: g.W / 2,
      y: -130,
      ty: 222,
      r: R,
      hp,
      maxHp: hp,
      hx: g.W / 2,
      hy: 222,
      wanderT: 2,
      stage: 1,
      seqI: 0,
      attack: null,
      at: 0,
      step: 0,
      rest: 1.5,
      charge: 0,
      chargeColor: ATTACKS.spread.color,
      shine: 0, // a burst of light each time it fires
      puff: 0,
      wild: 0,
      spin: 0,
      ink: { k: 0, hold: 0, age: 9, x: 0, y: 0 },
      arms: Array.from({ length: ARMS }, () => ({ raise: 0, want: 0, busy: false, flinch: 0 })),
      sweep: null,
      grabs: [],
      blinkT: 2.5,
      look: [0, 0],
      told: {},
    }
  },

  update(b, dt, g) {
    G = g
    b.shine = Math.max(0, b.shine - dt * 2.5)
    for (const a of b.arms) {
      a.raise += (a.want - a.raise) * Math.min(1, dt * 7)
      a.flinch = Math.max(0, a.flinch - dt * 3)
    }
    const ink = b.ink
    ink.age += dt
    if (ink.hold > 0) {
      ink.hold -= dt
      ink.k = Math.min(1, ink.k + dt * 2.5)
    } else ink.k = Math.max(0, ink.k - dt * 0.8)
    b.wild += ((b.attack === 'twirl' ? 1 : 0) - b.wild) * Math.min(1, dt * 3)
    if (b.attack !== 'ink') b.puff = Math.max(0, b.puff - dt * 3)
    b.blinkT -= dt
    if (b.blinkT < -0.16) b.blinkT = g.rand(2.2, 4.5)
    // its eyes follow the nearest ship
    const tg = g.nearestPlayer(b.x, b.y)
    if (tg) {
      const dx = tg.x - b.x
      const dy = tg.y - (b.y + EYE.y * R)
      const d = Math.hypot(dx, dy) || 1
      b.look[0] += (dx / d - b.look[0]) * Math.min(1, dt * 4)
      b.look[1] += (dy / d - b.look[1]) * Math.min(1, dt * 4)
    }
    markBusy(b, g)
    if (g.bossEnter(b, dt)) {
      b.hy = b.y
      return
    }

    const frac = b.hp / b.maxHp
    const stage = frac > 0.66 ? 1 : frac > 0.33 ? 2 : 3
    if (stage > b.stage) {
      b.stage = stage
      b.seqI = 0
      if (stage === 2) g.popText(b.x, b.y + 150, 'Look out for grabby arms!', '#ffb3f0', 20, 1.8)
      if (stage === 3) {
        b.rage = true
        g.popText(b.x, b.y + 150, 'The Gloomtopus is cross!', '#ff8ad8', 22, 1.8)
        g.shake(8)
      }
    }

    // drift from spot to spot, slower while it attacks, and not at all while
    // an arm is swinging from it
    const z = zone(g)
    if ((b.wanderT -= dt) <= 0) {
      b.hx = g.rand(z.x0, z.x1)
      b.hy = g.rand(z.y0, z.y1)
      b.wanderT = g.rand(2.4, 3.8)
    }
    const calm = b.sweep ? 0 : b.attack ? 0.3 : 1
    const px = b.x
    b.x += (b.hx - b.x) * Math.min(1, dt * 0.8 * calm)
    b.y += (b.hy + Math.sin(b.t * 1.4) * 10 - b.y) * Math.min(1, dt * 1.1 * calm)
    b.tilt = g.clamp((b.x - px) / Math.max(dt, 1e-3) / 2400, -0.08, 0.08)

    if (b.sweep) sweeping(b, dt, g)
    grabbing(b, dt, g)

    if (!b.attack) {
      b.charge = Math.max(0, b.charge - dt * 3)
      if ((b.rest -= dt) <= 0) {
        const seq = SEQ[b.stage]
        b.attack = seq[b.seqI++ % seq.length]
        // only one swing or one set of grabs at a time
        if ((b.attack === 'sweep' && b.sweep) || (b.attack === 'grab' && b.grabs.length)) b.attack = 'spread'
        b.at = 0
        b.step = 0
        b.chargeColor = ATTACKS[b.attack].color
        begin(b, g)
      }
      return
    }
    attacking(b, dt, g)
  },

  shot(b, x, y, owner, g = G) {
    if (inHead(b, R, x, y)) {
      if (b.entering) {
        g.sparks(x, y, '#ffffff', 2)
        g.sfx.ting()
      } else g.damageBoss(b, 1, owner, x, y)
      return true
    }
    if (b.entering) return false
    // an arm that's out flinches as a laser goes through it, and that's all
    if (b.sweep?.pts && nearLine(b.sweep.pts, x, y, R * 0.2)) b.arms[b.sweep.i].flinch = 1
    for (const gr of b.grabs) if (gr.pts && nearLine(gr.pts, x, y, R * 0.18)) b.arms[gr.i].flinch = 1
    for (const L of g.lasers) if (L.ob === b && L.warn <= 0 && Math.abs(x - L.x) < 18 && y > L.y0) L.flinch = 1
    return false
  },

  hits: (b, p) => inHead(b, R, p.x, p.y, 0.9),

  nova(b, owner, g) {
    if (b.entering) return
    g.damageBoss(b, 8, owner, b.x, b.y + HEAD.y * R)
  },

  draw(b, g, ctx) {
    const dying = b.dying > 0
    drawOctopus(ctx, dying ? { ...b, arms: null } : b, R, {
      t: g.time,
      flash: b.flash,
      hurt: b.hurt,
      puff: b.puff,
      charge: b.charge,
      chargeColor: b.chargeColor,
      angry: b.stage === 3,
      blink: !dying && b.blinkT < 0 && b.charge < 0.05,
      look: b.look,
      wild: b.wild,
      lid: b.puff > 0.1 ? 0.3 + b.puff * 0.35 : undefined,
    })
  },

  explodeAt: (b) => {
    if (Math.random() < 0.7) return [b.x + (Math.random() - 0.5) * R * 1.8, b.y + HEAD.y * R + (Math.random() - 0.5) * R * 1.7]
    return [b.x + (Math.random() - 0.5) * R * 2.6, b.y + Math.random() * R * 1.4]
  },

  defeated(b, g) {
    g.popText(b.x, b.y, 'Blub blub… bye!', '#ffb3f0', 22, 1.8)
  },
}

// Which arms are off attacking this frame, and so drawn over the fog instead
// of with the body.
function markBusy(b, g) {
  for (const a of b.arms) a.busy = false
  for (const L of g.lasers) if (L.ob === b && L.warn < SLAM.extend) b.arms[L.arm].busy = true
  if (b.sweep) b.arms[b.sweep.i].busy = true
  for (const gr of b.grabs) if (gr.st === 'strike' || gr.st === 'hold' || gr.st === 'back') b.arms[gr.i].busy = true
}

function chargeTime(b) {
  return ATTACKS[b.attack].charge * (b.stage === 3 ? 0.85 : 1)
}

// The moment an attack is picked: start its tell.
function begin(b, g) {
  const cd = chargeTime(b)
  if (cd) synth.tone({ type: 'triangle', from: 200, to: 600, dur: cd, vol: 0.08, attack: cd * 0.6 }, 'neb-charge', 0.3)
  switch (b.attack) {
    case 'tips':
      b.arms[0].want = b.arms[ARMS - 1].want = 1
      break
    case 'ink':
      synth.tone({ type: 'sine', from: 140, to: 320, dur: cd, vol: 0.12 }, 'neb-gulp', 0.3)
      break
    case 'slam':
      slam(b, g)
      break
    case 'sweep':
      startSweep(b, g)
      break
    case 'grab':
      startGrabs(b, g)
      break
  }
}

function done(b, extra = 0) {
  b.attack = null
  b.rest = REST[b.stage] + extra
}

function attacking(b, dt, g) {
  b.at += dt
  const cd = chargeTime(b)
  if (b.at < cd) {
    b.charge = b.at / cd
    if (b.attack === 'ink') b.puff = b.charge
    return
  }
  b.charge = Math.max(0, 1 - (b.at - cd) * 1.5)
  const ft = b.at - cd
  const [mx, my] = mouthOf(b)
  const col = b.chargeColor
  const fire = () => {
    b.shine = 1
    g.sfx.zap()
  }
  switch (b.attack) {
    case 'spread': {
      // two fans, the second shifted half a gap: step sideways, not back
      if (ft >= b.step * 0.45 && b.step < 2) {
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
    case 'tips': {
      const bursts = b.stage === 3 ? 4 : 3
      if (ft >= b.step * 0.34 && b.step < bursts) {
        for (const i of [0, ARMS - 1]) {
          const [tx, ty] = tipOf(b, i, g)
          g.aimed(tx, ty, 2, 0.14, 245, col, g.nearestPlayer(tx, ty))
        }
        fire()
        b.step++
      }
      if (ft > bursts * 0.34 + 0.2) {
        b.arms[0].want = b.arms[ARMS - 1].want = 0
        done(b)
      }
      break
    }
    case 'ring':
      if (ft >= b.step * 0.45 && b.step < 2) {
        const n = b.stage === 3 ? 18 : 14
        g.ringShot(b.x, b.y + HEAD.y * R * 0.6, n, 140, col, b.step * (Math.PI / n) + b.t)
        fire()
        b.step++
      }
      if (ft > 0.7) done(b)
      break
    case 'twirl':
      b.charge = 0.8
      while (ft >= b.step * 0.1 && ft < 2.2) {
        b.step++
        b.spin += 0.26
        for (let k = 0; k < 3; k++) g.shoot(b.x, b.y + HEAD.y * R * 0.5, b.spin + (k * TAU) / 3, 165, col)
        b.shine = Math.max(b.shine, 0.6)
      }
      if (ft > 2.4) done(b)
      break
    case 'ink':
      squirt(b, g)
      done(b)
      break
    case 'squad': {
      const live = g.enemies.filter((e) => e.type === 'nebulaLurker').length
      const want = Math.min(b.stage === 3 ? 3 : 2, 4 - live)
      if (want > 0) {
        if (want === 3) {
          ambush(g, -1, 2)
          ambush(g, 1, 1)
        } else ambush(g, Math.random() < 0.5 ? -1 : 1, want)
        if (!b.told.squad) {
          b.told.squad = true
          g.popText(g.W / 2, g.playerTop() - 30, 'It called its saucers!', '#ffd6f4', 20, 1.8)
        }
      }
      done(b, 0.4)
      break
    }
    case 'slam':
      // done once its arms are back
      if (!g.lasers.some((L) => L.ob === b)) done(b)
      break
    case 'sweep':
      if (!b.sweep) done(b)
      break
    case 'grab':
      if (!b.grabs.length) done(b)
      break
  }
}

// ---------------------------------------------------------------- ink

function squirt(b, g) {
  const ink = b.ink
  ink.hold = b.stage === 3 ? 4.2 : 3.6
  ink.age = 0
  ink.x = b.x
  ink.y = b.y
  b.puff = 1
  g.shake(5)
  synth.noise({ dur: 0.9, vol: 0.3, freq: 700, to: 70, q: 1.2 }, 'neb-ink', 0.3)
  synth.tone({ type: 'sine', from: 320, to: 70, dur: 0.6, vol: 0.14 }, 'neb-ink2', 0.3)
  if (!b.told.ink) {
    b.told.ink = true
    g.popText(g.W / 2, g.playerTop() - 30, 'Ink! Watch for the glows!', '#d9c8ff', 22, 2)
  }
}

// ---------------------------------------------------------------- slam

// Arms come down in lanes: the first where the nearest ship is, the rest
// well apart from it and each other, so there's always room between them.
function slam(b, g) {
  const n = b.stage === 1 ? 2 : 3
  const tg = g.nearestPlayer(b.x, b.y)
  const lanes = []
  const lo = 50
  const hi = g.W - 50
  if (tg) lanes.push(g.clamp(tg.x, lo, hi))
  for (let tries = 0; lanes.length < n && tries < 40; tries++) {
    const x = g.rand(lo, hi)
    if (lanes.every((l) => Math.abs(l - x) > 210)) lanes.push(x)
  }
  const used = new Set()
  lanes.forEach((x, k) => {
    // the free arm whose root is closest to the lane
    let best = -1
    let bd = Infinity
    for (let i = 0; i < ARMS; i++) {
      if (used.has(i)) continue
      const d = Math.abs(armRoot(b, i, R)[0] - x)
      if (d < bd) {
        bd = d
        best = i
      }
    }
    used.add(best)
    b.arms[best].want = 1
    const warn = SLAM.warn + k * 0.15
    g.lasers.push({ ob: b, arm: best, x, y0: laneTop(b, g), w: SLAM.w, warn, warn0: warn, active: SLAM.down + SLAM.retract, flinch: 0, track: trackSlam, draw: drawSlam, quiet: true })
  })
  synth.tone({ type: 'sawtooth', from: 90, to: 160, dur: 0.9, vol: 0.06 }, 'neb-rear', 0.3)
}

// Where a slamming arm turns straight down: just above the ships.
const laneTop = (b, g) => Math.max(b.y + R * 1.1, g.playerTop() - 40)

function trackSlam(L, g) {
  const b = L.ob
  if (g.boss !== b || b.dying) {
    L.dead = true
    return
  }
  L.flinch = Math.max(0, (L.flinch ?? 0) - 0.05)
  if (L.warn > 0) {
    L.y0 = laneTop(b, g)
    if (L.warn < SLAM.extend) b.arms[L.arm].want = 0
    return
  }
  if (!L.landed) {
    L.landed = true
    g.shake(7)
    g.sparks(L.x, g.H - 12, '#ff86dc', 10)
    synth.noise({ dur: 0.5, vol: 0.35, freq: 400, to: 60, q: 1 }, 'neb-slam', 0.08)
  }
  // pulling back up: it can't hurt any more
  L.y0 = L.active < SLAM.retract ? g.H + 100 : laneTop(b, g)
}

function slamPoints(b, L, g) {
  const [rx, ry] = reachRoot(b, L.arm)
  const yv = laneTop(b, g)
  const pts = bezier([rx, ry], [rx + (L.x - rx) * 0.15, ry + R * 0.9], [L.x, yv - R * 1.1], [L.x, yv], 10)
  const end = g.H + 30
  for (let k = 1; k <= 6; k++) pts.push([L.x + Math.sin(g.time * 30 + k) * (L.flinch ?? 0) * 6, yv + ((end - yv) * k) / 6])
  return pts
}

function drawSlam(ctx, L, H, t) {
  const b = L.ob
  const g = G
  if (!g || !b) return
  if (L.warn > 0) {
    // where it'll come down: a lane glowing brighter and brighter
    const k = 1 - L.warn / L.warn0
    const pulse = 0.65 + 0.35 * Math.sin(t * 16)
    const w = L.w * 0.9
    const grad = ctx.createLinearGradient(L.x - w, 0, L.x + w, 0)
    grad.addColorStop(0, 'rgba(224,123,255,0)')
    grad.addColorStop(0.5, `rgba(224,123,255,${(0.2 + 0.3 * k) * pulse})`)
    grad.addColorStop(1, 'rgba(224,123,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(L.x - w, L.y0, w * 2, H - L.y0)
    ctx.strokeStyle = `rgba(255,200,246,${(0.5 + 0.5 * k) * pulse})`
    ctx.lineWidth = 4
    ctx.setLineDash([14, 12])
    ctx.lineDashOffset = -t * 160
    ctx.beginPath()
    ctx.moveTo(L.x, L.y0)
    ctx.lineTo(L.x, H)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalCompositeOperation = 'lighter'
    stamp(ctx, TELL, L.x, H - 24, 30 + 30 * k, 0.4 + 0.5 * k * pulse, false)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    if (L.warn < SLAM.extend) drawSlamArm(ctx, b, L, g, 1 - L.warn / SLAM.extend)
    return
  }
  drawSlamArm(ctx, b, L, g, L.active < SLAM.retract ? L.active / SLAM.retract : 1)
}

function drawSlamArm(ctx, b, L, g, frac) {
  const pts = cut(slamPoints(b, L, g), frac)
  armGlow(ctx, pts, R * 0.4 + 18, TELL, 0.3)
  drawArm(ctx, pts, R * 0.2, R * 0.12 + (1 - frac) * R * 0.04, armFill(ctx, b.y, g.H), { side: L.x < b.x ? 1 : -1 })
}

// ---------------------------------------------------------------- sweep

// One of the middle arms swings right across under it, like a pendulum. Its
// tip never comes lower than SWEEP_LOW above the bottom, so there's always a
// strip to duck into.
const SWEEP_LOW = 140
const SWING = 1.2 // radians either side of straight down

function startSweep(b, g) {
  const dir = Math.random() < 0.5 ? 1 : -1
  const i = dir > 0 ? 3 : 4
  const [, py] = reachRoot(b, i)
  const st3 = b.stage === 3
  b.sweep = {
    i,
    st: 'warn',
    t: 0,
    a0: -dir * SWING,
    a1: dir * SWING,
    a: -dir * SWING,
    lag: 0,
    len: Math.max(260, g.H - SWEEP_LOW - py),
    reach: 0.4,
    warn: st3 ? 1.05 : 1.25,
    swing: st3 ? 1.05 : 1.3,
    back: st3, // in a temper it swings back again
    pts: null,
  }
  synth.tone({ type: 'sawtooth', from: 80, to: 140, dur: 1, vol: 0.06 }, 'neb-rear', 0.3)
  if (!b.told.sweep) {
    b.told.sweep = true
    g.popText(b.x, Math.min(g.H - 60, py + b.sweep.len + 40), 'Duck under the arm!', '#ffd6f4', 20, 1.6)
  }
}

const ease = (u) => u * u * (3 - 2 * u)

function sweeping(b, dt, g) {
  const S = b.sweep
  S.t += dt
  const [px, py] = reachRoot(b, S.i)
  if (S.st === 'warn') {
    S.reach = 0.4 + 0.6 * Math.min(1, S.t / S.warn)
    if (S.t >= S.warn) {
      S.st = 'swing'
      S.t = 0
      synth.noise({ dur: 0.9, vol: 0.18, freq: 300, to: 1400, q: 2 }, 'neb-whoosh', 0.2)
    }
  } else if (S.st === 'swing') {
    const u = Math.min(1, S.t / S.swing)
    S.a = S.a0 + (S.a1 - S.a0) * ease(u)
    // the arm trails a little behind the way it's going
    S.lag = (S.a1 - S.a0) * 6 * u * (1 - u) * 0.1
    if (u >= 1) {
      if (S.back) {
        S.back = false
        S.st = 'pause'
      } else S.st = 'pull'
      S.t = 0
      S.lag = 0
    }
  } else if (S.st === 'pause') {
    if (S.t >= 0.35) {
      ;[S.a0, S.a1] = [S.a1, S.a0]
      S.st = 'swing'
      S.t = 0
      synth.noise({ dur: 0.9, vol: 0.18, freq: 300, to: 1400, q: 2 }, 'neb-whoosh', 0.2)
    }
  } else {
    S.reach = Math.max(0, 1 - S.t / 0.35)
    if (S.t >= 0.35) {
      b.sweep = null
      return
    }
  }
  S.pts = sweepPoints(px, py, S)
  if (S.st !== 'swing') return
  for (const p of g.alive()) {
    if (p.y < py) continue
    if (hitsArm(S.pts, p.x, p.y, R * 0.17, R * 0.06, p.hitR * 0.8)) g.hurtPlayer(p)
  }
}

function sweepPoints(px, py, S) {
  const pts = []
  const n = 14
  for (let k = 0; k <= n; k++) {
    const s = k / n
    const a = S.a - S.lag * s * s
    const d = S.len * S.reach * s
    pts.push([px + Math.sin(a) * d, py + Math.cos(a) * d])
  }
  return pts
}

// ---------------------------------------------------------------- grab

function startGrabs(b, g) {
  const st3 = b.stage === 3
  for (const p of g.alive()) {
    const i = p.x < b.x ? (b.grabs.some((q) => q.i === 1) ? 2 : 1) : b.grabs.some((q) => q.i === ARMS - 2) ? ARMS - 3 : ARMS - 2
    b.arms[i].want = 1
    b.grabs.push({ p, i, x: p.x, y: p.y, st: 'track', t: 0, track: st3 ? 0.85 : 1, lock: st3 ? 0.34 : 0.42, pts: null, spin: 0 })
  }
}

const GRAB_R = 34 // plus the ship's own size

function grabbing(b, dt, g) {
  for (const gr of b.grabs) {
    gr.t += dt
    gr.spin += dt * (gr.st === 'track' ? 3 : 0)
    if (gr.st === 'track') {
      if (gr.p.alive) {
        gr.x += (gr.p.x - gr.x) * Math.min(1, dt * 9)
        gr.y += (gr.p.y - gr.y) * Math.min(1, dt * 9)
      }
      if (gr.t >= gr.track) {
        gr.st = 'lock'
        gr.t = 0
        synth.tone({ type: 'square', from: 900, to: 1300, dur: 0.08, vol: 0.06 }, 'neb-lock', 0.05)
      }
    } else if (gr.st === 'lock') {
      if (gr.t >= gr.lock) {
        gr.st = 'strike'
        gr.t = 0
        b.arms[gr.i].want = 0
        synth.noise({ dur: 0.25, vol: 0.2, freq: 2000, to: 300 }, 'neb-snap', 0.05)
      }
    } else if (gr.st === 'strike') {
      if (gr.t >= 0.13) {
        gr.st = 'hold'
        gr.t = 0
      }
    } else if (gr.st === 'hold') {
      for (const p of g.alive()) {
        if (!gr.caught && p.invuln <= 0 && g.near(p.x, p.y, gr.x, gr.y, GRAB_R + p.hitR)) {
          gr.caught = true
          g.hurtPlayer(p)
          g.popText(gr.x, gr.y - 50, 'Gotcha!', '#ffb3f0', 18, 1)
        }
      }
      if (gr.t >= 0.38) {
        gr.st = 'back'
        gr.t = 0
      }
    } else if (gr.t >= 0.32) gr.dead = true
    const [rx, ry] = reachRoot(b, gr.i)
    const frac = gr.st === 'strike' ? gr.t / 0.13 : gr.st === 'hold' ? 1 : gr.st === 'back' ? 1 - gr.t / 0.32 : 0
    gr.pts = frac > 0 ? cut(bezier([rx, ry], [rx, ry + R * 0.9], [gr.x, gr.y - R * 1.8], [gr.x, gr.y], 14), frac) : null
  }
  b.grabs = b.grabs.filter((gr) => !gr.dead)
}

// ---------------------------------------------------------------- through the fog

// How far the Gloomtopus lights the fog: it glows when it charges and fires,
// and flickers into view while it's being hit. Ink snuffs it.
export function octoLight(b, inkK = 0) {
  const k = Math.max(b.charge, b.shine, Math.min(1, b.hurt * 1.6) * 0.75, b.dying > 0 ? 1 : 0) * (b.dying > 0 ? 1 : 1 - inkK * 0.8)
  if (k < 0.03) return null
  return { x: b.x, y: b.y + HEAD.y * R * 0.7, r: 140 + 170 * k, a: Math.min(1, k * 1.3), rim: b.dying > 0 ? '#ffffff' : b.chargeColor }
}

// The glows that always show through the fog (drawn with 'lighter'): its
// eyes, its spots and arm tips, and the glow of whatever it's charging.
export function octoTells(ctx, b, g, clear, inkK = 0) {
  const t = g.time
  const hidden = 1 - clear
  const blink = b.blinkT < 0 && b.charge < 0.05
  const eyeCol = b.attack === 'squad' && b.charge > 0.05 ? '#ff5fd2' : GOLD
  for (const [ex, ey] of eyesOf(b)) {
    stamp(ctx, eyeCol, ex, ey, R * (0.38 + 0.12 * b.charge), (blink ? 0.15 : 0.5 + 0.4 * b.charge) * (0.45 + 0.55 * hidden), false)
    if (!blink) stamp(ctx, '#fff6b8', ex, ey, R * 0.2, hidden * 0.8)
  }
  if (!blink && hidden > 0.2) {
    // and its sideways pupils, watching you from the murk
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = hidden * 0.8
    ctx.fillStyle = '#1a0838'
    ctx.beginPath()
    for (const [ex, ey] of eyesOf(b)) {
      const px = ex + b.look[0] * EYE.r * R * 0.32
      const py = ey + b.look[1] * EYE.r * R * 0.22
      ctx.moveTo(px + EYE.r * R * 0.5, py)
      ctx.ellipse(px, py, EYE.r * R * 0.5, EYE.r * R * (0.26 - 0.16 * b.charge), 0, 0, TAU)
    }
    ctx.fill()
    ctx.globalCompositeOperation = 'lighter'
  }
  if (b.entering) return
  const dim = 1 - inkK * 0.7
  const flare = b.attack === 'ring' ? b.charge : 0
  for (let i = 0; i < SPOTS.length; i++) {
    const [sx, sy, sr, col] = SPOTS[i]
    const k = 0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.3)
    stamp(ctx, flare > 0 ? ATTACKS.ring.color : col, b.x + sx * R, b.y + sy * R, sr * R * (2.6 + 2 * flare), (hidden * (0.25 + 0.35 * k) + flare) * dim, false)
  }
  for (let i = 0; i < ARMS; i++) {
    if (b.arms[i].busy) continue
    const [tx, ty] = tipOf(b, i, g)
    const tipsCharge = b.attack === 'tips' && (i === 0 || i === ARMS - 1) ? b.charge || b.shine : 0
    if (tipsCharge > 0.02) stamp(ctx, ATTACKS.tips.color, tx, ty, 10 + 26 * tipsCharge, 0.5 + 0.5 * tipsCharge)
    else stamp(ctx, '#ff9be6', tx, ty, 7, hidden * 0.5 * dim, false)
    // an arm rearing up to slam or grab glows from inside
    const rear = b.arms[i].raise * (b.attack === 'tips' ? 0 : 1)
    if (rear > 0.05) stamp(ctx, TELL, tx, ty, 14 + 20 * rear, rear * 0.8)
  }
  if (b.charge > 0.05 && (b.attack === 'spread' || b.attack === 'twirl')) {
    const [mx, my] = mouthOf(b)
    stamp(ctx, b.chargeColor, mx, my, R * (0.14 + 0.32 * b.charge), b.charge)
  }
  if (b.puff > 0.05) {
    // filling up with ink: a dark shimmer round the head, and its spots
    // going out
    stamp(ctx, '#b98cff', b.x, b.y + HEAD.y * R, R * (1.1 + 0.4 * b.puff), b.puff * 0.35, false)
  }
}

// What's drawn over the fog in full: the arms out after the ships and the
// marks that show where they'll go. (Slamming arms draw themselves, as
// lasers.)
export function drawOctoOverFog(ctx, b, g) {
  if (b.dying > 0 || b.entering) return
  const t = g.time
  const S = b.sweep
  if (S && S.pts) {
    const [px, py] = reachRoot(b, S.i)
    // its reach: the whole wedge it sweeps through, edged with a glowing arc
    const fade = S.st === 'pull' ? 1 - S.t / 0.35 : S.st === 'warn' ? Math.min(1, S.t * 3) : 1
    const pulse = 0.7 + 0.3 * Math.sin(t * 14)
    const lo = Math.PI / 2 - SWING
    const hi = Math.PI / 2 + SWING
    ctx.globalAlpha = 0.1 * fade
    ctx.fillStyle = TELL
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.arc(px, py, S.len, lo, hi)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = fade * pulse * 0.55
    ctx.strokeStyle = TELL
    ctx.lineWidth = 12
    ctx.beginPath()
    ctx.arc(px, py, S.len, lo, hi)
    ctx.stroke()
    ctx.globalAlpha = fade * pulse
    ctx.strokeStyle = '#ffd6f4'
    ctx.lineWidth = 2.5
    ctx.setLineDash([12, 10])
    ctx.lineDashOffset = t * 60
    ctx.beginPath()
    ctx.arc(px, py, S.len, lo, hi)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
    const wob = b.arms[S.i].flinch
    const pts = wob > 0 ? S.pts.map(([x, y], k) => [x + Math.sin(t * 40 + k) * wob * 4, y]) : S.pts
    armGlow(ctx, pts, R * 0.36 + 16, TELL, S.st === 'swing' ? 0.45 : 0.3)
    drawArm(ctx, pts, R * 0.17, R * 0.06, armFill(ctx, py, py + S.len), { side: S.a1 > S.a0 ? -1 : 1 })
  }
  for (const gr of b.grabs) drawGrab(ctx, b, gr, t)
}

function drawGrab(ctx, b, gr, t) {
  // the ring of suckers marking the spot: spinning while it follows the
  // ship, still and flashing once it has picked its moment
  const locked = gr.st !== 'track'
  const a = gr.st === 'back' ? 1 - gr.t / 0.32 : gr.st === 'track' ? Math.min(1, gr.t * 4) : 1
  const flash = gr.st === 'lock' && Math.sin(t * 40) > 0
  const rr = GRAB_R + 8 - (gr.st === 'track' ? 0 : 6)
  ctx.globalCompositeOperation = 'lighter'
  stamp(ctx, TELL, gr.x, gr.y, rr * 1.3, a * (locked ? 0.55 : 0.3), false)
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = a
  ctx.strokeStyle = flash ? '#ffffff' : TELL
  ctx.lineWidth = locked ? 4 : 3
  ctx.setLineDash(locked ? [] : [10, 9])
  ctx.lineDashOffset = -gr.spin * 20
  ctx.beginPath()
  ctx.arc(gr.x, gr.y, rr, 0, TAU)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = flash ? '#ffffff' : '#ffc8f0'
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const an = gr.spin + (i * TAU) / 8
    const x = gr.x + Math.cos(an) * rr
    const y = gr.y + Math.sin(an) * rr
    ctx.moveTo(x + 5, y)
    ctx.arc(x, y, 5, 0, TAU)
  }
  ctx.fill()
  ctx.globalAlpha = 1
  if (gr.pts) {
    const wob = b.arms[gr.i].flinch
    const pts = wob > 0 ? gr.pts.map(([x, y], k) => [x + Math.sin(t * 40 + k) * wob * 4, y]) : gr.pts
    armGlow(ctx, pts, R * 0.34 + 14, TELL, 0.4)
    drawArm(ctx, pts, R * 0.18, R * 0.08, armFill(ctx, b.y, gr.y), { side: gr.x < b.x ? 1 : -1 })
  }
}

// ---------------------------------------------------------------- geometry

function bezier(p0, p1, p2, p3, n) {
  const pts = []
  for (let k = 0; k <= n; k++) {
    const s = k / n
    const u = 1 - s
    const a = u * u * u
    const bq = 3 * u * u * s
    const c = 3 * u * s * s
    const d = s * s * s
    pts.push([a * p0[0] + bq * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + bq * p1[1] + c * p2[1] + d * p3[1]])
  }
  return pts
}

// The first `frac` of a line, by length, ending exactly at that point.
function cut(pts, frac) {
  if (frac >= 1) return pts
  let total = 0
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  let left = total * Math.max(0.02, frac)
  const out = [pts[0]]
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]
    const [bx, by] = pts[i]
    const d = Math.hypot(bx - ax, by - ay)
    if (d >= left) {
      const k = left / (d || 1)
      out.push([ax + (bx - ax) * k, ay + (by - ay) * k])
      break
    }
    out.push(pts[i])
    left -= d
  }
  if (out.length < 2) out.push([pts[0][0], pts[0][1] + 1])
  return out
}

function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const l2 = dx * dx + dy * dy || 1
  const s = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2))
  return [Math.hypot(px - ax - dx * s, py - ay - dy * s), s]
}

// Whether (x, y) is within the arm along `pts`, w0 thick at the root and w1 at
// the tip, give or take `pad`.
function hitsArm(pts, x, y, w0, w1, pad) {
  const n = pts.length - 1
  for (let i = 0; i < n; i++) {
    const [d, s] = segDist(x, y, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])
    const w = w0 + (w1 - w0) * ((i + s) / n)
    if (d < w + pad) return true
  }
  return false
}

const nearLine = (pts, x, y, w) => hitsArm(pts, x, y, w, w, 0)
