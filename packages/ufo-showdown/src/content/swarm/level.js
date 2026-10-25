// Total Mayhem: the biggest swarm in the galaxy. Seventy-odd seconds of
// bugs, building from a few flocks to a sky so full of them it's hard to see
// the stars: flocks that dive down a lane they show first, rivers, spirals,
// walls with gaps, rings that close round a ship, spitters and brood beetles.
// Firepower bubbles come thick and fast, every kill counts toward the next
// "N SAUCERS!" shout, and then the Hive Queen.

import { synth } from '../../audio.js'
import { missionIndex } from '../../missions.js'
import { stats, resetStats, tickStats, groups, resetGroups, updateGroups, drawTells, flock, river, spiral, wall, ring, rain, spitter, beetle, CAP, PALS_N, swarmlet, swarmspitter, swarmbeetle } from './bugs.js'
import { PALS, spriteList, bugSprite } from './sprites.js'
import { resetQueenFx, updateQueenFx, drawQueenFx, hivequeen } from './queen.js'

const TAU = Math.PI * 2
const LENGTH = 76 // seconds of swarm before the Queen

// How many swarmlets the sky should hold, [seconds in, count]: the rain tops
// the flocks and rivers up to this. Killing fast just means more to kill.
const CROWD = [[0, 16], [8, 34], [20, 62], [34, 92], [46, 120], [60, 148], [76, 162]]

const RIVERS = ['side', 'snake', 'swoop', 'side', 'swoop', 'snake']

const lv = {}
function reset() {
  Object.assign(lv, {
    t: 0,
    si: 0, // next line of the script
    flockT: 1.5,
    flockI: 0,
    riverT: 9,
    riverI: 0,
    spitT: 22,
    rainAcc: 0,
    tips: new Set(),
    mayhem: 0, // the screen-edge pulse once it all kicks off
  })
  resetStats()
  resetGroups()
  resetQueenFx()
}
reset()

// With `?debug` (see main.js) a probe can read the swarm and jump the clock.
if (new URLSearchParams(globalThis.location?.search ?? '').has('debug')) {
  globalThis.__swarm = {
    lv,
    stats,
    get groups() { return groups },
    defs: { swarmlet, swarmspitter, swarmbeetle, hivequeen },
    jump(t) {
      lv.t = t
      while (lv.si < SCRIPT.length && SCRIPT[lv.si][0] < t) lv.si++
      lv.flockT = lv.riverT = 0
      lv.spitT = Math.max(0, 22 - t)
    },
  }
}

const lerp = (a, b, u) => a + (b - a) * Math.max(0, Math.min(1, u))

function crowd(t, g) {
  let want = CROWD[CROWD.length - 1][1]
  for (let i = 1; i < CROWD.length; i++) {
    const [t1, n1] = CROWD[i]
    if (t < t1) {
      const [t0, n0] = CROWD[i - 1]
      want = n0 + ((n1 - n0) * (t - t0)) / (t1 - t0)
      break
    }
  }
  return Math.min(CAP, want * (g.numPlayers === 2 ? 1.1 : 1) * roomy(g))
}

// A phone-shaped screen has half the sky of a desktop one, so it gets fewer
// bugs: the same crowd in half the room would be twice as hard to fly through.
const roomy = (g) => Math.max(0.6, Math.min(1, g.W / 1100))

function tip(g, key, text, color = '#cfeeff') {
  if (lv.tips.has(key)) return
  lv.tips.add(key)
  g.popText(g.W / 2, g.playerTop() - 24, text, color, 18, 2.6)
}

function spitters(g, n) {
  const live = g.enemies.filter((e) => e.type === 'swarmspitter').length
  n = Math.min(n, (g.numPlayers === 2 ? 5 : 4) - live)
  for (let i = 0; i < n; i++) g.later(i * 0.35, () => spitter(g, g.W * ((i + 0.5 + Math.random() * 0.6 - 0.3) / n)))
  if (n > 0) tip(g, 'spit', 'Red bugs shoot back. Watch their stingers glow!', '#ffb3a8')
}

function rings(g, all) {
  const ships = g.alive()
  const targets = all ? ships : ships.length ? [g.pick(ships)] : []
  targets.forEach((p, i) => g.later(i * 0.5, () => ring(g, p, { pal: (lv.riverI + i * 2) % PALS_N })))
  if (targets.length) tip(g, 'ring', 'They are surrounding you! Fly out through the gap!', '#ffe9a8')
}

function lowRivers(g, both) {
  const top = g.playerTop()
  if (both) {
    river(g, { style: 'low', n: 20, dir: 1, y: top + 70 })
    river(g, { style: 'low', n: 20, dir: -1, y: g.H - 120 })
  } else river(g, { style: 'low', n: 24 })
  tip(g, 'low', 'Bugs coming in low! Look at the edge!', '#ffb3a8')
}

// The set pieces, at seconds into the level. Flocks, rivers, spitters and
// the rain carry on between them.
const SCRIPT = [
  [0.4, (g) => {
    tip(g, 'go', 'So. Many. Saucers. Keep blasting!', '#ffe23d')
    g.dropBubble(g.W * 0.5, -30, 'rapid')
  }],
  [15, (g) => wall(g, { rows: 2, gaps: 2 })],
  [19, (g) => {
    beetle(g)
    tip(g, 'beetle', 'Brood beetle! Pop it for firepower!', '#9ff7ea')
  }],
  [23, (g) => spitters(g, 2)],
  [27, (g) => spiral(g, { x: g.W / 2, y: 190 })],
  [32.5, (g) => rings(g, false)],
  [37, (g) => wall(g, { rows: 2, gaps: 2, vy: 92 })],
  [39.5, (g) => {
    beetle(g, g.W * 0.25)
    beetle(g, g.W * 0.75)
  }],
  [42, (g) => lowRivers(g, false)],
  [45, (g) => {
    const t = g.popText(g.W / 2, g.H * 0.3, 'SWARM SURGE!', '#ff9be6', 34, 1.8)
    t.rise = 14
    river(g, { style: 'side', dir: 1, y: 120, n: 28 })
    river(g, { style: 'side', dir: -1, y: 260, n: 28 })
    g.dropBubble(g.W * 0.3, -30, 'triple')
    synth.tone({ type: 'sawtooth', from: 220, to: 660, dur: 0.5, vol: 0.08 }, 'swarm-surge', 1)
  }],
  [49, (g) => {
    spiral(g, { x: g.W * 0.27, y: 170, arms: 2, turn: 1.3 })
    spiral(g, { x: g.W * 0.73, y: 170, arms: 2, turn: -1.3 })
  }],
  [53, (g) => rings(g, false)],
  [55.5, (g) => wall(g, { rows: 2, gaps: 2, vy: 96 })],
  [57, (g) => {
    spitters(g, 3)
    beetle(g)
  }],
  [60, (g) => {
    g.banner('Here they ALL come!', 'TOTAL MAYHEM!', 'warn')
    g.shake(12)
    g.sfx.siren()
    lv.mayhem = 1
    g.dropBubble(g.W * 0.35, -30, 'rapid')
    g.later(0.8, () => g.dropBubble(g.W * 0.65, -30, 'triple'))
  }],
  [62, (g) => spiral(g, { x: g.W / 2, y: 180, arms: 4, dur: 3.6, pals: [0, 1, 2, 3] })],
  [64.5, (g) => wall(g, { rows: 2, gaps: 2, vy: 102 })],
  [66.5, (g) => rings(g, true)],
  [69, (g) => lowRivers(g, g.numPlayers === 2)],
  [70.5, (g) => {
    beetle(g, g.W * 0.3)
    beetle(g, g.W * 0.7)
    spitters(g, 3)
  }],
  [73, (g) => wall(g, { rows: 2, gaps: 2, vy: 106 })],
]

function updateMain(g, dt) {
  const t = (lv.t += dt)
  const u = t / LENGTH
  const duo = g.numPlayers === 2
  while (lv.si < SCRIPT.length && SCRIPT[lv.si][0] <= t) SCRIPT[lv.si++][1](g)
  if (t >= LENGTH) {
    if (stats.live < 12 || t > LENGTH + 7) g.levelDone()
    return
  }

  if ((lv.flockT -= dt) <= 0) {
    lv.flockT = lerp(3.6, 1.7, u)
    const style = lv.flockI++ % 3 === 1 ? 'swoop' : 'dive'
    flock(g, { style, n: Math.round((9 + t / 9 + (duo ? 3 : 0)) * (0.5 + 0.5 * roomy(g))) })
  }
  if (t > 9 && (lv.riverT -= dt) <= 0) {
    lv.riverT = lerp(5.5, 2.8, u)
    river(g, { style: RIVERS[lv.riverI++ % RIVERS.length], n: Math.round(18 + t / 4) })
  }
  if (t > 22 && (lv.spitT -= dt) <= 0) {
    lv.spitT = lerp(8, 4.5, u)
    spitters(g, t > 50 ? 2 : 1)
  }

  // the rain fills the sky up to the crowd it should hold by now
  const short = crowd(t, g) - stats.live
  // (two ships at full power can pop sixty a second, so it has to be quick)
  lv.rainAcc += Math.max(0, Math.min(34, short * 0.7)) * dt
  if (lv.rainAcc >= 1) {
    const n = Math.floor(lv.rainAcc)
    lv.rainAcc -= n
    rain(g, n)
  }
}

// ---------------------------------------------------------------- backdrop

// A distant hive hanging in the sky: a cluster of glowing honeycomb cells,
// painted once and stamped behind everything.
let hive = null
function hiveSprite() {
  if (hive) return hive
  const w = 420
  const h = 320
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const x = c.getContext('2d')
  const glow = x.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2)
  glow.addColorStop(0, 'rgba(255,176,46,0.35)')
  glow.addColorStop(0.5, 'rgba(194,54,122,0.14)')
  glow.addColorStop(1, 'rgba(194,54,122,0)')
  x.fillStyle = glow
  x.fillRect(0, 0, w, h)
  const r = 22
  const dx = r * 1.5
  const dy = r * Math.sqrt(3)
  for (let i = -6; i <= 6; i++) {
    for (let j = -5; j <= 5; j++) {
      const cx = w / 2 + i * dx
      const cy = h / 2 + j * dy + (i % 2 ? dy / 2 : 0)
      const d = Math.hypot((cx - w / 2) / (w * 0.42), (cy - h / 2) / (h * 0.42))
      if (d > 1) continue
      const a = (1 - d) * 0.8
      x.strokeStyle = `rgba(255,214,120,${a * 0.55})`
      x.lineWidth = 2
      x.beginPath()
      for (let k = 0; k < 6; k++) x.lineTo(cx + Math.cos((k * Math.PI) / 3) * r * 0.92, cy + Math.sin((k * Math.PI) / 3) * r * 0.92)
      x.closePath()
      x.stroke()
      if ((i * 7 + j * 3) % 5 === 0) {
        x.fillStyle = `rgba(255,200,90,${a * 0.35})`
        x.fill()
      }
    }
  }
  hive = c
  return c
}

function drawBack(g, ctx) {
  const c = hiveSprite()
  // it drifts down slowly as the fight goes on, like the swarm is coming
  // from it
  const y = -c.height * 0.35 + Math.min(lv.t, LENGTH) * 0.9
  ctx.globalAlpha = 0.5
  ctx.drawImage(c, g.W * 0.72 - c.width / 2, y)
  ctx.globalAlpha = 1
  drawTells(g, ctx)
}

// Warnings for the rivers that come in low, the Queen's crown, and the score
// once it's all over.
function drawTop(g, ctx) {
  for (const G of groups) {
    if (G.kind !== 'path' || G.style !== 'low' || G.warn <= 0) continue
    const a = 0.55 + 0.45 * Math.sin(g.time * 18)
    const x0 = G.dir > 0 ? 18 : g.W - 18
    ctx.save()
    ctx.strokeStyle = `rgba(255,120,140,${0.35 * a})`
    ctx.lineWidth = 2
    ctx.setLineDash([12, 12])
    ctx.lineDashOffset = -G.dir * g.time * 120
    ctx.beginPath()
    ctx.moveTo(0, G.y0)
    ctx.lineTo(g.W, G.y0)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = `rgba(255,90,106,${a})`
    for (let i = 0; i < 3; i++) {
      const cx = x0 + G.dir * i * 18
      ctx.beginPath()
      ctx.moveTo(cx - G.dir * 6, G.y0 - 14)
      ctx.lineTo(cx + G.dir * 8, G.y0)
      ctx.lineTo(cx - G.dir * 6, G.y0 + 14)
      ctx.lineTo(cx - G.dir * 1, G.y0)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  }

  // once it all kicks off, the edges of the screen throb
  if (lv.mayhem > 0 && g.phase === 'main') {
    const a = 0.12 + 0.08 * Math.sin(g.time * 8)
    const e = 70
    ctx.save()
    for (const [x0, x1] of [[0, e], [g.W, g.W - e]]) {
      const gr = ctx.createLinearGradient(x0, 0, x1, 0)
      gr.addColorStop(0, `rgba(255,59,107,${a})`)
      gr.addColorStop(1, 'rgba(255,59,107,0)')
      ctx.fillStyle = gr
      ctx.fillRect(Math.min(x0, x1), 0, e, g.H)
    }
    ctx.restore()
  }

  drawQueenFx(g, ctx)

  if (g.phase === 'clear' && g.phaseT > 0.9) {
    const a = Math.min(1, (g.phaseT - 0.9) * 2)
    ctx.save()
    ctx.globalAlpha = a
    ctx.textAlign = 'center'
    ctx.lineJoin = 'round'
    ctx.font = `26px ${g.FONT}`
    ctx.strokeStyle = 'rgba(10,6,30,0.85)'
    ctx.lineWidth = 6
    const line1 = `${stats.kills.toLocaleString()} saucers zapped!`
    ctx.strokeText(line1, g.W / 2, g.H * 0.6)
    ctx.fillStyle = '#ffe23d'
    ctx.fillText(line1, g.W / 2, g.H * 0.6)
    ctx.font = `16px ${g.FONT}`
    const line2 = `Best combo ×${stats.best}`
    ctx.strokeText(line2, g.W / 2, g.H * 0.6 + 30)
    ctx.fillStyle = '#ff9be6'
    ctx.fillText(line2, g.W / 2, g.H * 0.6 + 30)
    ctx.restore()
  }
}

// ---------------------------------------------------------------- the HUD

// Mission name and progress, and under them the running count of bugs
// zapped, with the combo when it's going.
function hud(g, ctx) {
  const cx = g.W / 2
  const bw = Math.min(g.W * 0.3, 280)
  const frac = Math.min(1, lv.t / LENGTH)
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = `13px ${g.FONT}`
  ctx.fillStyle = '#a9b3d6'
  ctx.fillText(`Mission ${missionIndex(g.mission.id) + 1} · ${g.mission.name}`, cx, 24)
  const x = cx - bw / 2
  const y = 31
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.beginPath()
  ctx.roundRect(x, y, bw, 8, 4)
  ctx.fill()
  if (frac > 0) {
    ctx.fillStyle = frac > 60 / LENGTH ? '#ff5a8a' : '#ffb02e'
    ctx.beginPath()
    ctx.roundRect(x, y, Math.max(8, bw * frac), 8, 4)
    ctx.fill()
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(x, y, bw, 8, 4)
  ctx.stroke()

  if (!stats.kills) return ctx.restore()
  const count = `${stats.kills.toLocaleString()} zapped`
  const combo = stats.combo >= 10 ? `  ×${stats.combo}` : ''
  ctx.font = `15px ${g.FONT}`
  const w1 = ctx.measureText(count).width
  const w2 = combo ? ctx.measureText(combo).width : 0
  const left = cx - (w1 + w2) / 2
  ctx.textAlign = 'left'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = 'rgba(10,6,30,0.85)'
  ctx.lineWidth = 4
  ctx.save()
  const s = 1 + stats.pulse * 0.12
  ctx.translate(left + w1 / 2, 55)
  ctx.scale(s, s)
  ctx.strokeText(count, -w1 / 2, 0)
  ctx.fillStyle = '#ffe23d'
  ctx.fillText(count, -w1 / 2, 0)
  ctx.restore()
  if (combo) {
    ctx.strokeText(combo, left + w1, 55)
    ctx.fillStyle = stats.combo >= 50 ? '#ff5fb8' : '#ff9be6'
    ctx.fillText(combo, left + w1, 55)
  }
  ctx.restore()
}

// ---------------------------------------------------------------- the map icon

// The Hive Queen with her swarm wheeling round her: a far-off swirl of tiny
// bugs, a few big ones up close, and a ship's lasers punching through.
function icon(ctx, w, h) {
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#3a1440')
  sky.addColorStop(1, '#0b0726')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  const glow = ctx.createRadialGradient(40, 14, 2, 40, 14, 34)
  glow.addColorStop(0, 'rgba(255,176,46,0.5)')
  glow.addColorStop(1, 'rgba(255,176,46,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  const bug = (x, y, s, pal, tilt, frame) => {
    const spr = bugSprite('swarmlet', pal, tilt, frame)
    ctx.drawImage(spr, x - spr.box * s, y - spr.box * s, spr.box * 2 * s, spr.box * 2 * s)
  }
  // the far swirl
  for (let i = 0; i < 34; i++) {
    const a = i * 0.55
    const r = 13 + i * 0.95
    bug(40 + Math.cos(a) * r * 1.35, 16 + Math.sin(a) * r * 0.62, 0.17, i % PALS.length, 2, i % 4)
  }

  // the Queen
  ctx.save()
  ctx.translate(40, 14)
  ctx.scale(1.25, 1.25)
  ctx.fillStyle = 'rgba(200,180,255,0.55)'
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 0.5
  for (const d of [-1, 1]) {
    ctx.beginPath()
    ctx.ellipse(d * 10, -3, 9.5, 3.2, d * -0.42, 0, TAU)
    ctx.fill()
    ctx.stroke()
  }
  ctx.fillStyle = '#ffb02e'
  ctx.beginPath()
  ctx.ellipse(0, 6, 5.2, 5, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = 'rgba(58,12,46,0.85)'
  ctx.fillRect(-5.2, 5, 10.4, 1.3)
  ctx.fillRect(-4.6, 8, 9.2, 1.1)
  for (const d of [-1, 1]) {
    ctx.fillStyle = '#c8f05a'
    ctx.beginPath()
    ctx.ellipse(d * 8.5, 4.5, 2.2, 2.6, 0, 0, TAU)
    ctx.fill()
  }
  ctx.fillStyle = '#c2367a'
  ctx.beginPath()
  ctx.ellipse(0, 0.5, 10.5, 2.5, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#6a2fc0'
  ctx.beginPath()
  ctx.arc(0, -3.4, 3.5, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#ff4fb0'
  for (const d of [-1, 1]) {
    ctx.beginPath()
    ctx.arc(d * 1.6, -3.5, 1.4, 0, TAU)
    ctx.fill()
  }
  ctx.fillStyle = '#ffd23d'
  ctx.beginPath()
  ctx.moveTo(-2.6, -6.4)
  ctx.lineTo(-3, -9)
  ctx.lineTo(-1.3, -7.7)
  ctx.lineTo(0, -9.8)
  ctx.lineTo(1.3, -7.7)
  ctx.lineTo(3, -9)
  ctx.lineTo(2.6, -6.4)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // the ship's lasers, and a few big bugs up close
  ctx.strokeStyle = '#d6f8ff'
  ctx.lineWidth = 1.4
  ctx.lineCap = 'round'
  for (const [x, y] of [[37, 40], [43, 31], [40, 22]]) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + 5)
    ctx.stroke()
  }
  for (const [x, y, p, t, f] of [[9, 33, 0, 3, 0], [71, 30, 1, 1, 2], [18, 9, 2, 3, 1], [64, 9, 3, 1, 3], [59, 43, 4, 0, 1], [23, 44, 2, 4, 2]]) bug(x, y, 0.42, p, t, f)
  ctx.fillStyle = '#38d6ff'
  ctx.beginPath()
  ctx.moveTo(40, 43)
  ctx.lineTo(45.5, 50)
  ctx.lineTo(34.5, 50)
  ctx.closePath()
  ctx.fill()
}

// ---------------------------------------------------------------- the level

let warm = null

export const swarmLevel = {
  setup(g) {
    reset()
    stats.cap = CAP
    g.warp(1)
    warm = spriteList()
  },
  start() {
    lv.t = 0
  },
  update(g, dt) {
    // paint the bug sprites a few per frame during the intro
    if (warm) {
      for (let i = 0; i < 8 && warm; i++) {
        const n = warm.next()
        if (n.done) warm = null
        else bugSprite(...n.value)
      }
    }
    tickStats(g, dt)
    // once the Queen is going down, nothing new hatches: a spiral or river
    // still pouring would carry on into the "Mission complete!" screen
    if (g.boss?.dying || g.phase === 'clear' || g.phase === 'victory') for (const G of groups) G.emit = 0
    updateGroups(g, dt)
    updateQueenFx(g, dt)
    lv.mayhem = Math.max(0, lv.mayhem - (g.phase === 'main' ? 0 : dt))
    if (g.phase === 'main') updateMain(g, dt)
  },
  progress: () => lv.t / LENGTH,
  hud,
  drawBack,
  drawTop,
  icon,
}
