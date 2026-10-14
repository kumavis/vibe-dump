// The Storm Eye: a cyclone with one huge eye. Lasers bounce off its winds, so
// the only way to hurt it is with its own lightning: fly into a glowing beacon
// on the floor, hold still while it charges, and it shoots chain lightning up
// into the eye. All the while the Eye throws strikes at the beacons and the
// ships, spins out bullet spirals and blows gusts that shove ships sideways.

import { synth } from '../../audio.js'
import { drawStar } from '../../art.js'
import { hexA } from '../../stars.js'
import { sky, strike, walk, thunder, glow, boltPath, strokeBolt, boltSign } from './storm.js'

const TAU = Math.PI * 2
const GOLD = '#ffe66b'

const CHARGE_TIME = 1.6 // seconds for one ship to fill a beacon
const DRAIN = 0.3 // what a beacon loses per second with nobody in it
const BEACON_R = 66
const ZAPS = 5 // rounds of beacons to finish it
const GUST = 150 // how hard the wind shoves, against a ship speed of 440
const WINDUP = 0.6 // the eye glows this long before each attack

// main.js hands `g` to most boss hooks but not to shot() and hits(), so the
// Eye keeps hold of the one it was created with.
let G = null

const SEQ = ['spiral', 'walk', 'aimed', 'gust', 'ring', 'spiral', 'aimed', 'walk', 'gust', 'ring']

// What each attack glows as while the eye winds up to it.
const TELL = { spiral: '#8fd8ff', ring: '#c9a4ff', aimed: '#ffe23d', walk: '#ffffff', gust: '#9fffe0' }

export const stormeye = {
  name: 'The Storm Eye',
  warnSub: 'Here comes',
  create(g) {
    G = g
    const hp = Math.round(100 * g.hpMult())
    const two = g.numPlayers === 2
    const slots = two ? [0.6, 1.4] : [0.6]
    return {
      x: g.W / 2,
      y: -200,
      ty: 205,
      r: 150,
      hp,
      maxHp: hp,
      // two players get two beacons at a time, so each one is worth half as
      // much: either way it's five rounds of beacons
      zapDmg: Math.ceil(hp / (ZAPS * slots.length)),
      slots: slots.map((wait) => ({ beacon: null, wait, last: null })),
      rest: 2,
      attack: null,
      at: 0,
      step: 0,
      seqI: 0,
      spin: 0,
      swirl: 0,
      stormT: 2.8,
      stormI: 0,
      spawnT: 13,
      daze: 0,
      lx: 0,
      ly: 0.5,
      blinkT: 2.5,
      blink: 0,
      squint: 0,
      gust: 0,
      gustDir: 1,
      gustWarn: 0,
      rage: false,
      hintT: 4,
      tell: null,
    }
  },

  update(b, dt, g) {
    const angry = b.rage
    b.swirl += dt * (b.gust > 0 || b.gustWarn > 0 ? 3.2 : b.attack ? 1.7 : 1) * (angry ? 1.25 : 1)
    look(b, dt, g)
    if (g.bossEnter(b, dt)) return

    const range = Math.max(0, Math.min(g.W / 2 - b.r - 30, 300))
    b.x = g.W / 2 + Math.sin(b.t * 0.33) * range + (b.daze > 0 ? Math.sin(b.t * 11) * 4 : 0)
    b.y = b.ty + Math.sin(b.t * 1.2) * 8
    b.hintT -= dt

    if (!b.rage && b.hp <= b.maxHp * 0.5) {
      b.rage = true
      g.popText(b.x, b.y + 130, 'The Storm Eye is ANGRY!', '#ff8a8a', 22, 2)
      g.shake(10)
    }

    updateBeacons(b, dt, g)
    updateWind(b, dt, g)

    // reeling from a zap: no attacks for a moment
    if (b.daze > 0) {
      b.daze -= dt
      return
    }

    // lightning keeps coming down the whole fight, aimed by turns at a
    // beacon, at a ship and anywhere at all — and always at a beacon that's
    // being charged, so the ship in it has to slip to the edge of the ring
    if (b.attack !== 'walk' && (b.stormT -= dt) <= 0) {
      b.stormT = (angry ? 1.6 : 2.2) * (b.gust > 0 ? 1.4 : 1)
      const beacons = b.slots.map((s) => s.beacon).filter(Boolean)
      const charging = beacons.filter((k) => k.on)
      const ships = g.alive()
      const turn = b.stormI++ % 3
      let x = g.rand(60, g.W - 60)
      if (charging.length) x = g.pick(charging).x + g.rand(-12, 12)
      else if (turn === 0 && beacons.length) x = g.pick(beacons).x + g.rand(-20, 20)
      else if (turn !== 2 && ships.length) x = g.pick(ships).x + g.rand(-25, 25)
      strike(g, x, { from: b })
    }

    if ((b.spawnT -= dt) <= 0) {
      // a couple of saucers tumble out of the clouds: something to shoot at,
      // and the odd bubble. Once it's angry, every other pair are divers
      // that come for whoever is sitting on a beacon
      b.spawnT = angry ? 9 : 11
      const divers = angry && (b.spawns = (b.spawns ?? 0) + 1) % 2 === 0
      for (const d of [-1, 1]) {
        g.later(d > 0 ? 0.4 : 0, () => {
          if (g.boss !== b || b.dying) return
          const x = g.clamp(b.x + d * b.r * 0.8, 50, g.W - 50)
          if (divers) g.spawn('diver', x, b.y, { path: 'dive', state: 'enter', hoverY: g.rand(250, 300), entered: true })
          else g.spawn('scout', x, b.y, { path: 'fall', speed: 135, entered: true })
        })
      }
    }

    if (!b.attack) {
      b.tell = null
      if ((b.rest -= dt) <= 0) {
        b.attack = SEQ[b.seqI++ % SEQ.length]
        b.at = 0
        b.step = 0
        b.tell = TELL[b.attack]
      }
      return
    }

    b.at += dt
    const done = () => {
      b.attack = null
      b.rest = angry ? 0.9 : 1.4
    }
    if (b.at < WINDUP) return
    const t = b.at - WINDUP
    const ex = b.x
    const ey = b.y + 8
    switch (b.attack) {
      case 'spiral': {
        const gap = angry ? 0.085 : 0.1
        while (t >= b.step * gap) {
          b.step++
          b.spin += 0.21
          const arms = angry ? 4 : 3
          for (let k = 0; k < arms; k++) g.shoot(ex, ey, b.spin + (k * TAU) / arms, 170, '#8fd8ff')
        }
        if (t > (angry ? 3 : 2.4)) done()
        break
      }
      case 'ring':
        if (t >= b.step * 0.55 && b.step < 3) {
          g.ringShot(ex, ey, angry ? 22 : 18, 150, '#c9a4ff', b.step * 0.17)
          b.step++
        }
        if (t > 1.4) done()
        break
      case 'aimed':
        if (t >= b.step * 0.36 && b.step < 4) {
          g.aimed(ex, ey + 30, 3, 0.16, 280, '#ffe23d')
          b.step++
        }
        if (t > 1.5) done()
        break
      case 'walk':
        if (b.step === 0) {
          b.step = 1
          walk(g, { from: b })
        }
        if (t > 2.4) {
          b.stormT = Math.max(b.stormT, 1)
          done()
        }
        break
      case 'gust':
        if (b.step === 0) {
          // the wind is coming: a warning first, then the shove
          b.step = 1
          b.gustDir = Math.random() < 0.5 ? -1 : 1
          b.gustWarn = 1.3
          g.popText(g.W / 2, g.playerTop() + 40, b.gustDir > 0 ? 'Wind! >>>' : '<<< Wind!', '#bfffe9', 26, 1.4)
          synth.noise({ dur: 1.2, vol: 0.12, freq: 500, to: 1400, q: 2 }, 'ion-windup', 1)
        }
        if (b.step === 1 && b.gustWarn <= 0) {
          b.step = 2
          b.gust = angry ? 3.2 : 2.6
          synth.noise({ dur: b.gust, vol: 0.22, freq: 1300, to: 380, q: 1.5 }, 'ion-wind', 1)
        }
        if (b.step === 2 && b.gust <= 0) done()
        break
    }
  },

  shot(b, x, y, owner, g = G) {
    const dx = x - b.x
    const dy = y - b.y
    if ((dx / (b.r * 0.92)) ** 2 + (dy / (b.r * 0.6)) ** 2 > 1) return false
    // lasers just bounce off the wind
    g.sparks(x, y, '#cfe8ff', 2)
    g.sfx.ting()
    // a tip for anyone still trying to shoot it — until the first zap shows
    // them how it's done
    if (b.hintT <= 0 && !b.entering && !b.zaps && (b.tips = (b.tips ?? 0) + 1) <= 2) {
      b.hintT = 10
      g.popText(b.x, b.y + b.r * 0.75, 'Lasers bounce off! Use the beacons!', '#cfe8ff', 17, 2)
    }
    return true
  },

  hits: (b, p, g = G) => g.near(p.x, p.y, b.x, b.y, b.r * 0.62),

  nova(b, owner, g) {
    if (b.entering) return
    g.damageBoss(b, 4, owner, b.x, b.y)
    b.squint = 1
  },

  draw(b, g, ctx) {
    if (!b.dying) {
      drawWind(b, g, ctx)
      for (const s of b.slots) if (s.beacon) drawBeacon(ctx, s.beacon, g)
      drawGuides(b, g, ctx)
    }
    drawEye(ctx, b, g)
  },

  hud(b, g, ctx) {
    const charging = b.slots.some((s) => s.beacon?.on)
    let text = g.numPlayers === 2 ? 'Fly into a glowing beacon!' : 'Fly into the glowing beacon!'
    let col = GOLD
    if (b.daze > 0) text = 'ZAP! Find the next beacon!'
    else if (b.gust > 0 || b.gustWarn > 0) (text = 'Wind! Steer against it!'), (col = '#bfffe9')
    else if (charging) (text = 'Charging… stay inside!'), (col = '#9ff0ff')
    ctx.save()
    ctx.font = `15px ${g.FONT}`
    ctx.textAlign = 'center'
    ctx.lineJoin = 'round'
    ctx.globalAlpha = 0.75 + 0.25 * Math.sin(g.time * 5)
    ctx.strokeStyle = 'rgba(10,6,30,0.9)'
    ctx.lineWidth = 5
    ctx.strokeText(text, g.W / 2, 78)
    ctx.fillStyle = col
    ctx.fillText(text, g.W / 2, 78)
    ctx.restore()
  },

  explodeAt: (b) => [b.x + (Math.random() * 2 - 1) * b.r * 0.85, b.y + (Math.random() * 2 - 1) * b.r * 0.45],

  defeated(b) {
    for (const s of b.slots) s.beacon = null
    b.gust = 0
    sky.wind = 0
  },
}

// ---------------------------------------------------------------- the eye

// The eye follows the nearest ship and blinks now and then.
function look(b, dt, g) {
  const p = g.nearestPlayer(b.x, b.y)
  let tx = 0
  let ty = 0.4
  if (p) {
    const dx = p.x - b.x
    const dy = p.y - b.y
    const d = Math.hypot(dx, dy) || 1
    tx = dx / d
    ty = dy / d
  }
  if (b.daze > 0) {
    tx = Math.cos(b.t * 9)
    ty = Math.sin(b.t * 9)
  }
  const k = Math.min(1, dt * 6)
  b.lx += (tx - b.lx) * k
  b.ly += (ty - b.ly) * k
  b.squint = Math.max(0, b.squint - dt * 1.5)
  b.blink = Math.max(0, b.blink - dt)
  if ((b.blinkT -= dt) <= 0) {
    b.blink = 0.16
    b.blinkT = g.rand(2.5, 5)
  }
}

// ---------------------------------------------------------------- beacons

function updateBeacons(b, dt, g) {
  for (const s of b.slots) {
    if (!s.beacon) {
      if ((s.wait -= dt) <= 0) {
        s.beacon = placeBeacon(b, b.slots.indexOf(s), g)
        synth.tone({ type: 'sine', from: 520, to: 1040, dur: 0.25, vol: 0.12 }, 'ion-beacon', 0.2)
        if (b.slots.every((o) => o.last === null)) g.popText(s.beacon.x, s.beacon.y - BEACON_R - 50, 'Fly here!', GOLD, 20, 2)
      }
      continue
    }
    const k = s.beacon
    k.age += dt
    let n = 0
    let who = null
    for (const p of g.players) {
      if (p.alive && g.near(p.x, p.y, k.x, k.y, k.r)) {
        n++
        who ??= p
      }
    }
    k.on = n
    if (n) {
      // two ships in one beacon fill it faster
      k.charge += (dt / CHARGE_TIME) * (n > 1 ? 1.8 : 1)
      k.who = who.id
      synth.tone({ type: 'triangle', from: 360 + k.charge * 900, to: 400 + k.charge * 900, dur: 0.08, vol: 0.05 }, 'ion-charge', 0.11)
    } else k.charge = Math.max(0, k.charge - dt * DRAIN)
    if (k.charge >= 1) {
      s.last = { x: k.x, y: k.y }
      s.beacon = null
      s.wait = 2.3
      fire(b, k, g)
      if (b.dying) return
    }
  }
}

// Somewhere on the floor of the ship zone, well away from where the last
// beacons were and not right under a ship (some flying is the point), but not
// clear across the screen either. With two players each beacon keeps to its
// own side, P1's on the left and P2's on the right.
function placeBeacon(b, slot, g) {
  const top = g.playerTop()
  const two = b.slots.length > 1
  const x0 = two && slot === 1 ? g.W / 2 + 70 : 100
  const x1 = two && slot === 0 ? g.W / 2 - 70 : g.W - 100
  const avoid = []
  for (const o of b.slots) {
    if (o.beacon) avoid.push(o.beacon)
    if (o.last) avoid.push(o.last)
  }
  const ships = g.alive()
  let best = null
  let bestScore = -Infinity
  for (let i = 0; i < 18; i++) {
    const x = g.rand(x0, x1)
    const y = g.rand(top + 85, g.H - 105)
    let score = 0
    for (const a of avoid) score += Math.min(380, Math.hypot(a.x - x, a.y - y)) - (Math.hypot(a.x - x, a.y - y) < 240 ? 300 : 0)
    for (const p of ships) {
      const d = Math.hypot(p.x - x, p.y - y)
      if (d < 150) score -= 250
      if (d > 620) score -= (d - 620) * 0.6
    }
    score += Math.random() * 40
    if (score > bestScore) {
      bestScore = score
      best = { x, y }
    }
  }
  return { x: best.x, y: best.y, r: BEACON_R, charge: 0, age: 0, on: 0, who: 0 }
}

// A full beacon lets go: chain lightning from the floor up into the eye.
function fire(b, k, g) {
  sky.zaps.push({ x: k.x, y: k.y, b, life: 0.8, max: 0.8 })
  sky.flick = 1
  thunder(1)
  synth.tone({ type: 'sawtooth', from: 220, to: 1700, dur: 0.35, vol: 0.16 }, 'ion-zap', 0.1)
  g.flash(0.3)
  g.shake(16)
  g.splash(k.x, k.y, GOLD)
  g.explode(b.x, b.y + 10, '#9fe0ff', 1.6)
  // a moment's peace around the ship that did it
  g.eShots = g.eShots.filter((s) => {
    if (!g.near(s.x, s.y, k.x, k.y, 170)) return true
    g.sparks(s.x, s.y, '#fff3a0', 2)
    return false
  })
  g.popText(b.x, b.y + 125, 'ZAP!', GOLD, 40, 1.3)
  b.zaps = (b.zaps ?? 0) + 1
  g.addScore(k.who, 1000, k.x, k.y - 40)
  b.daze = 1.5
  b.attack = null
  b.tell = null
  b.rest = 0.9
  b.gust = 0
  b.gustWarn = 0
  g.damageBoss(b, b.zapDmg, k.who, b.x, b.y + 20)
  b.flash = 1
  b.squint = 1
}

const ease = (u) => 1 + 2.2 * (u - 1) ** 3 + 1.2 * (u - 1) ** 2

function drawBeacon(ctx, k, g) {
  const t = g.time
  const pop = ease(Math.min(1, k.age / 0.45))
  const r = Math.max(1, k.r * pop)
  const c = k.charge
  const pulse = 0.5 + 0.5 * Math.sin(t * 6)
  ctx.save()

  // a beam of light standing up out of it, so it's easy to spot
  ctx.globalCompositeOperation = 'lighter'
  const gl = glow(GOLD, 48)
  ctx.globalAlpha = 0.3 + 0.15 * pulse + c * 0.3
  ctx.drawImage(gl, k.x - r * 0.55, k.y - 300, r * 1.1, 400)
  ctx.globalAlpha = 0.45 + 0.25 * pulse + c * 0.3
  ctx.drawImage(gl, k.x - r * 1.5, k.y - r * 1.5, r * 3, r * 3)
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'

  // the pad
  ctx.fillStyle = 'rgba(30,20,6,0.45)'
  ctx.beginPath()
  ctx.arc(k.x, k.y, r, 0, TAU)
  ctx.fill()
  if (c > 0) {
    // it fills up from the middle as it charges
    ctx.fillStyle = hexA(GOLD, 0.18 + 0.25 * c)
    ctx.beginPath()
    ctx.arc(k.x, k.y, r * c, 0, TAU)
    ctx.fill()
  }
  ctx.strokeStyle = hexA(GOLD, 0.35)
  ctx.lineWidth = 12
  ctx.beginPath()
  ctx.arc(k.x, k.y, r, 0, TAU)
  ctx.stroke()
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.strokeStyle = hexA('#fff6c8', 0.7)
  ctx.lineWidth = 2.5
  ctx.setLineDash([10, 12])
  ctx.lineDashOffset = -t * (30 + c * 120)
  ctx.beginPath()
  ctx.arc(k.x, k.y, r * 0.74, 0, TAU)
  ctx.stroke()
  ctx.setLineDash([])

  // the charge meter around the rim
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.arc(k.x, k.y, r + 12, 0, TAU)
  ctx.stroke()
  if (c > 0) {
    ctx.strokeStyle = c > 0.8 && Math.sin(t * 30) > 0 ? '#ffffff' : '#7dfcff'
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(k.x, k.y, r + 12, -Math.PI / 2, -Math.PI / 2 + TAU * Math.min(1, c))
    ctx.stroke()
    ctx.lineCap = 'butt'
  }

  boltSign(ctx, k.x, k.y, 15 + pulse * 2 + c * 6, 1, k.on ? '#ffffff' : GOLD)

  if (k.on) {
    // sparks jump from the rim to the ship inside
    ctx.globalCompositeOperation = 'lighter'
    for (const p of g.players) {
      if (!p.alive || !g.near(p.x, p.y, k.x, k.y, k.r)) continue
      const a = Math.random() * TAU
      const path = boltPath(k.x + Math.cos(a) * r, k.y + Math.sin(a) * r, p.x, p.y + 6, 7, 0, 16)
      strokeBolt(ctx, path, '#7dfcff', 0.7, 0.35)
    }
  } else {
    // nobody home: a bouncing arrow says "here!"
    const ay = k.y - r - 30 - Math.abs(Math.sin(t * 5)) * 12
    ctx.fillStyle = GOLD
    ctx.strokeStyle = 'rgba(14,10,46,0.85)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(k.x - 15, ay - 12)
    ctx.lineTo(k.x + 15, ay - 12)
    ctx.lineTo(k.x, ay + 6)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
  }
  ctx.restore()
}

// A little gold arrow beside any ship that's a long way from a beacon,
// pointing the way.
function drawGuides(b, g, ctx) {
  const beacons = b.slots.map((s) => s.beacon).filter((k) => k && k.age > 0.4)
  if (!beacons.length) return
  for (const p of g.alive()) {
    let best = null
    let bd = Infinity
    for (const k of beacons) {
      const d = Math.hypot(k.x - p.x, k.y - p.y)
      if (d < bd) (bd = d), (best = k)
    }
    if (bd < 190) continue
    const a = Math.atan2(best.y - p.y, best.x - p.x)
    const x = p.x + Math.cos(a) * 58
    const y = p.y + Math.sin(a) * 58
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(a)
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(g.time * 8)
    ctx.fillStyle = GOLD
    ctx.strokeStyle = 'rgba(14,10,46,0.85)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(12, 0)
    ctx.lineTo(-7, -10)
    ctx.lineTo(-3, 0)
    ctx.lineTo(-7, 10)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()
    ctx.restore()
  }
}

// ---------------------------------------------------------------- wind

function updateWind(b, dt, g) {
  if (b.gustWarn > 0) b.gustWarn -= dt
  if (b.gust > 0) {
    b.gust -= dt
    // a steady shove sideways — enough to drag a ship out of a beacon if it
    // doesn't steer against it, never enough to beat a ship that does
    sky.wind += (b.gustDir - sky.wind) * Math.min(1, dt * 3)
    for (const p of g.alive()) p.x = g.clamp(p.x + b.gustDir * GUST * Math.min(1, sky.wind * b.gustDir) * dt, 34, g.W - 34)
    for (const s of g.bubbles) s.x0 += b.gustDir * 60 * dt
  }
}

function drawWind(b, g, ctx) {
  const top = g.playerTop()
  const dir = b.gustDir
  const t = g.time
  if (b.gustWarn > 0) {
    // big chevrons sweeping across the ship zone: wind's coming this way
    ctx.save()
    const a = 0.55 + 0.3 * Math.sin(t * 14)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const y = top + (g.H - top) * 0.5
    const travel = ((t * 260) % 240) * dir
    const chevrons = new Path2D()
    for (let i = -4; i <= 4; i++) {
      const x = g.W / 2 + i * 240 + travel
      chevrons.moveTo(x - dir * 22, y - 40)
      chevrons.lineTo(x + dir * 22, y)
      chevrons.lineTo(x - dir * 22, y + 40)
    }
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = hexA('#3dffb4', a * 0.35)
    ctx.lineWidth = 26
    ctx.stroke(chevrons)
    ctx.strokeStyle = hexA('#7dffd0', a)
    ctx.lineWidth = 10
    ctx.stroke(chevrons)
    ctx.strokeStyle = hexA('#ffffff', a * 0.8)
    ctx.lineWidth = 3
    ctx.stroke(chevrons)
    ctx.restore()
  }
  const w = Math.abs(sky.wind)
  if (w > 0.05) {
    // streaks of wind racing across the ship zone
    ctx.save()
    ctx.strokeStyle = `rgba(190,255,230,${0.5 * w})`
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    const span = g.W + 400
    for (let i = 0; i < 26; i++) {
      const y = top - 30 + ((i * 97) % (g.H - top + 20))
      const len = 60 + ((i * 53) % 110)
      const x = ((((i * 211 + t * 900 * Math.sign(sky.wind)) % span) + span) % span) - 200
      ctx.moveTo(x, y)
      ctx.lineTo(x - Math.sign(sky.wind) * len * w, y)
    }
    ctx.stroke()
    ctx.restore()
  }
}

// ---------------------------------------------------------------- the eye

function drawEye(ctx, b, g) {
  const t = g.time
  const r = b.r
  const tell = b.attack && b.at < WINDUP ? b.tell : null
  const windup = tell ? b.at / WINDUP : 0
  ctx.save()
  ctx.translate(b.x, b.y)

  // a halo of storm light
  ctx.globalCompositeOperation = 'lighter'
  const halo = glow(b.rage ? '#ff6a8a' : '#6a7bff', 64)
  ctx.globalAlpha = 0.55 + (tell ? windup * 0.4 : 0)
  ctx.drawImage(halo, -r * 1.5, -r * 1.05, r * 3, r * 2.1)
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'

  // the cyclone leans with its own wind (the eye stays upright), flattened
  // like a whirlpool seen at a slant
  ctx.save()
  ctx.transform(1, 0, sky.wind * -0.18, 0.58, 0, 0)
  const body = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.12)
  body.addColorStop(0, '#120c38')
  body.addColorStop(0.75, 'rgba(32,24,92,0.95)')
  body.addColorStop(1, 'rgba(32,24,92,0)')
  ctx.fillStyle = body
  ctx.beginPath()
  ctx.arc(0, 0, r * 1.12, 0, TAU)
  ctx.fill()

  // three arms of cloud winding in to the eye: fat at the root, thin at the
  // tip, trailing behind the way it turns, with a lumpy cloud edge outside
  const spin = -b.swirl
  const arm = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.1)
  arm.addColorStop(0, b.rage ? '#ffe0ec' : '#ecebff')
  arm.addColorStop(0.3, b.rage ? '#c27ad6' : '#9d94f0')
  arm.addColorStop(1, '#3a3290')
  const N = 12
  const at = (a0, u, off) => {
    const ang = a0 + u * 2.3
    const rr = r * (0.42 + 0.68 * u) + off
    return [Math.cos(ang) * rr, Math.sin(ang) * rr]
  }
  const half = (u) => (r * 0.42 * (1 - u) ** 0.8 + 2) / 2
  const rims = new Path2D()
  for (let k = 0; k < 3; k++) {
    const a0 = spin + (k * TAU) / 3
    const shape = new Path2D()
    const rim = new Path2D()
    shape.moveTo(...at(a0, 0, half(0)))
    rim.moveTo(...at(a0, 0.05, half(0.05)))
    for (let i = 1; i <= N; i++) {
      const u = i / N
      const m = (i - 0.5) / N
      const c = at(a0, m, half(m) + 6 + 12 * (1 - m))
      const p = at(a0, u, half(u))
      shape.quadraticCurveTo(...c, ...p)
      if (i > 1 && u < 0.85) rim.quadraticCurveTo(...c, ...p)
    }
    for (let i = N; i >= 0; i--) shape.lineTo(...at(a0, i / N, -half(i / N)))
    shape.closePath()
    ctx.fillStyle = arm
    ctx.fill(shape)
    rims.addPath(rim)
  }
  ctx.strokeStyle = 'rgba(245,245,255,0.55)'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.stroke(rims)
  ctx.restore()

  // the eye wall, crackling
  const E = 58
  ctx.strokeStyle = '#140c38'
  ctx.lineWidth = 16
  ctx.beginPath()
  ctx.arc(0, 0, E + 9, 0, TAU)
  ctx.stroke()
  const rim = tell ?? (b.rage ? '#ff8a8a' : '#7dfcff')
  ctx.strokeStyle = hexA(rim, 0.55 + 0.45 * windup)
  ctx.lineWidth = 3 + windup * 3
  ctx.beginPath()
  ctx.arc(0, 0, E + 15, 0, TAU)
  ctx.stroke()
  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = hexA('#bfefff', 0.9)
  ctx.lineWidth = 2
  ctx.beginPath()
  const sparks = 2 + (b.attack ? 2 : 0)
  for (let i = 0; i < sparks; i++) {
    const a = Math.random() * TAU
    let rr = E + 16
    ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
    for (let s = 0; s < 3; s++) {
      rr += 9 + Math.random() * 8
      const aa = a + (Math.random() - 0.5) * 0.3
      ctx.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr * 0.8)
    }
  }
  ctx.stroke()
  ctx.globalCompositeOperation = 'source-over'

  drawEyeball(ctx, b, E, tell, windup, t)

  // dizzy after a zap: stars go round its head
  if (b.daze > 0) {
    for (let i = 0; i < 3; i++) {
      const a = t * 5 + (i * TAU) / 3
      drawStar(ctx, Math.cos(a) * 70, -E - 22 + Math.sin(a) * 14, 10, i === 1 ? '#ffffff' : GOLD)
    }
  }
  ctx.restore()
}

function drawEyeball(ctx, b, E, tell, windup, t) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(0, 0, E, 0, TAU)
  ctx.clip()

  // the white
  const white = ctx.createRadialGradient(-E * 0.3, -E * 0.35, E * 0.1, 0, 0, E)
  white.addColorStop(0, '#ffffff')
  white.addColorStop(0.65, '#e4ebff')
  white.addColorStop(1, '#8f9ad8')
  ctx.fillStyle = white
  ctx.fillRect(-E, -E, E * 2, E * 2)

  // the iris and pupil look at the nearest ship
  const ix = b.lx * E * 0.34
  const iy = b.ly * E * 0.3
  const ir = E * 0.54
  const iris = ctx.createRadialGradient(ix, iy, 0, ix, iy, ir)
  const pal = b.rage ? ['#fff3b0', '#ffb02e', '#ff4d5e', '#4a0820'] : ['#fff7b8', '#7dfcff', '#2f7bff', '#0f205e']
  iris.addColorStop(0, pal[0])
  iris.addColorStop(0.32, pal[1])
  iris.addColorStop(0.78, pal[2])
  iris.addColorStop(1, pal[3])
  ctx.fillStyle = iris
  ctx.beginPath()
  ctx.arc(ix, iy, ir, 0, TAU)
  ctx.fill()
  // streaks in the iris, turning with the storm
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < 12; i++) {
    const a = (i * TAU) / 12 + b.swirl * 0.3
    ctx.moveTo(ix + Math.cos(a) * ir * 0.42, iy + Math.sin(a) * ir * 0.42)
    ctx.lineTo(ix + Math.cos(a) * ir * 0.9, iy + Math.sin(a) * ir * 0.9)
  }
  ctx.stroke()
  if (tell) {
    // winding up to an attack: the iris lights with its colour
    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = hexA(tell, 0.55 * windup)
    ctx.beginPath()
    ctx.arc(ix, iy, ir, 0, TAU)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }
  // a cat's slit when it's about to attack, a pinprick when it's dazed
  ctx.fillStyle = '#0a0620'
  ctx.beginPath()
  if (b.daze > 0) ctx.arc(ix, iy, E * 0.09, 0, TAU)
  else if (tell || b.attack) ctx.ellipse(ix, iy, E * 0.08, E * 0.27, 0, 0, TAU)
  else ctx.arc(ix, iy, E * 0.2, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(ix - E * 0.2, iy - E * 0.2, E * 0.11, 0, TAU)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(ix + E * 0.14, iy + E * 0.16, E * 0.05, 0, TAU)
  ctx.fill()

  // the lids: a scowl that deepens as it gets angry, a squeeze when it's hit
  const hurt = Math.max(b.squint, b.hurt ?? 0)
  const shut = b.blink > 0 ? 1 : 0
  const upper = Math.max(shut, 0.2 + (b.rage ? 0.1 : 0) + (b.attack ? 0.08 : 0) + hurt * 0.35)
  const lower = Math.max(shut, 0.1 + hurt * 0.3)
  const lidTop = -E + upper * E * 1.05
  const lidLow = E - lower * E * 1.05
  // the lid comes down in a V for a scowl, and tips up into a worried arch
  // while it's dazed
  const scowl = shut ? 0 : E * (b.daze > 0 ? -0.16 : b.rage ? 0.3 : b.attack ? 0.22 : 0.13)
  const lid = ctx.createLinearGradient(0, -E, 0, E)
  lid.addColorStop(0, '#5b4fc0')
  lid.addColorStop(1, '#2a2170')
  ctx.fillStyle = lid
  ctx.beginPath()
  ctx.moveTo(-E - 2, -E - 2)
  ctx.lineTo(E + 2, -E - 2)
  ctx.lineTo(E + 2, lidTop - scowl)
  ctx.lineTo(0, lidTop + scowl)
  ctx.lineTo(-E - 2, lidTop - scowl)
  ctx.closePath()
  ctx.moveTo(-E - 2, E + 2)
  ctx.lineTo(E + 2, E + 2)
  ctx.lineTo(E + 2, lidLow + 6)
  ctx.quadraticCurveTo(0, lidLow - 8, -E - 2, lidLow + 6)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#140c38'
  ctx.lineWidth = 5
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(E + 2, lidTop - scowl)
  ctx.lineTo(0, lidTop + scowl)
  ctx.lineTo(-E - 2, lidTop - scowl)
  ctx.moveTo(E + 2, lidLow + 6)
  ctx.quadraticCurveTo(0, lidLow - 8, -E - 2, lidLow + 6)
  ctx.stroke()

  if (b.flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, b.flash) * 0.7})`
    ctx.fillRect(-E, -E, E * 2, E * 2)
  }
  ctx.restore()

  ctx.strokeStyle = '#140c38'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(0, 0, E, 0, TAU)
  ctx.stroke()
}

// The beacon bolts, drawn by the level over everything else.
export function drawZaps(g, ctx) {
  for (const z of sky.zaps) {
    const b = z.b
    const frame = Math.floor(g.time * 22)
    if (z.frame !== frame) {
      z.frame = frame
      z.path = boltPath(z.x, z.y, b.x + g.rand(-20, 20), b.y + 30, 26, 3, 38)
      z.path2 = boltPath(z.x, z.y, b.x + g.rand(-80, 80), b.y + g.rand(10, 50), 22, 1, 40)
    }
    const a = Math.min(1, z.life / 0.25)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    strokeBolt(ctx, z.path, GOLD, a, 1.3)
    strokeBolt(ctx, z.path2, '#7dfcff', a * 0.7, 0.7)
    const gl = glow(GOLD, 48)
    ctx.globalAlpha = a
    ctx.drawImage(gl, z.x - 100, z.y - 100, 200, 200)
    ctx.drawImage(gl, b.x - 130, b.y - 110, 260, 260)
    ctx.restore()
  }
}

