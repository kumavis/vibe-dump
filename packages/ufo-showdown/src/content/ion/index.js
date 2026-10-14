// The Ion Storm: saucer waves under a sky full of lightning, then the Storm
// Eye. Strikes always crackle before they land, never land right next to each
// other, and fry any saucer caught in them too. See ../README.md for the
// content-pack contract.

import { drawSaucer } from '../../art.js'
import { strike, walk, updateSky, resetSky, drawSkyBack, drawSkyTop, boltGlyph } from './storm.js'
import { stormeye, drawZaps } from './stormeye.js'

const TAU = Math.PI * 2
const LENGTH = 70 // seconds of saucers and lightning before the Storm Eye

// The formations, in order, looping if the clock outlasts them.
const WAVES = ['snake', 'rain', 'vee', 'divers', 'sweep', 'gunners', 'vee', 'snake', 'divers', 'rain', 'gunners', 'vee']

let waveI = 0
let waveT = 0
let waveCd = 0
let boltT = 0
let tipped = false

// The same saucer formations as the classic levels (main.js launchWave),
// tuned for a danger-4 mission.
function launch(g, kind) {
  const W = g.W
  const rand = g.rand
  switch (kind) {
    case 'snake': {
      const x0 = rand(W * 0.3, W * 0.7)
      const amp = Math.min(W * 0.28, 260)
      for (let i = 0; i < 6; i++) g.later(i * 0.3, () => g.spawn('scout', x0, -40, { path: 'sine', x0, amp, freq: 1.5, speed: 135 }))
      break
    }
    case 'rain':
      for (let i = 0; i < 8; i++) g.later(i * 0.42, () => g.spawn('scout', rand(60, W - 60), -40, { path: 'fall', speed: rand(125, 175) }))
      break
    case 'sweep': {
      const dir = Math.random() < 0.5 ? 1 : -1
      const y0 = rand(120, 210)
      for (let i = 0; i < 6; i++) {
        g.later(i * 0.38, () => g.spawn('scout', dir > 0 ? -40 : W + 40, y0, { path: 'sweep', vx: dir * 215, y0, entered: true }))
      }
      break
    }
    case 'vee': {
      const cx = rand(W * 0.3, W * 0.7)
      const slots = [[0, 0], [-60, -50], [60, -50], [-120, -100], [120, -100]]
      for (const [ox, oy] of slots) g.spawn('zigzag', cx + ox, -40 + oy, { path: 'zig', speed: 115, vx: ox < 0 ? -150 : 150, zt: 0 })
      break
    }
    case 'divers':
      for (let i = 0; i < 3; i++) g.later(i * 0.5, () => g.spawn('diver', (W * (i + 1)) / 4, -40, { path: 'dive', state: 'enter', hoverY: rand(120, 220) }))
      break
    case 'gunners':
      for (const fx of [0.28, 0.72]) g.spawn('gunner', W * fx, -50, { path: 'gun', hoverY: rand(140, 210), life: 9, fireT: rand(1, 2) })
      break
  }
}

// The storm builds as the level goes on: lone strikes at first, then pairs,
// then rows that step across the field.
function lightning(g, t) {
  const ships = g.alive()
  const roll = Math.random()
  if (!tipped) {
    tipped = true
    g.popText(g.W / 2, g.playerTop() - 20, 'Lightning! Dodge the glowing lines!', '#cfeeff', 20, 2.6)
  }
  if (t > 45 && roll < 0.25) walk(g)
  else if (t > 20 && roll < 0.55) {
    const a = strike(g, ships.length ? g.pick(ships).x + g.rand(-30, 30) : g.rand(60, g.W - 60))
    // the second of a pair goes well away from the first
    const far = a && a.x < g.W / 2 ? g.rand(a.x + 260, g.W - 50) : g.rand(50, (a?.x ?? g.W) - 260)
    if (far > 40 && far < g.W - 40) strike(g, far)
  } else if (ships.length && roll < 0.8) strike(g, g.pick(ships).x + g.rand(-25, 25))
  else strike(g, g.rand(60, g.W - 60))
}

const ion = {
  setup() {
    resetSky()
    waveI = 0
    waveT = 0
    waveCd = 0
    boltT = 4
    tipped = false
  },

  update(g, dt) {
    updateSky(g, dt)
    if (g.phase !== 'main') return
    const t = g.phaseT
    const live = g.enemies.length

    waveT -= dt
    waveCd -= dt
    if (t < LENGTH - 8 && waveCd <= 0 && (waveT <= 0 || live === 0)) {
      launch(g, WAVES[waveI++ % WAVES.length])
      waveT = 6.1
      waveCd = 1.6
    }

    if ((boltT -= dt) <= 0 && t < LENGTH - 2) {
      lightning(g, t)
      boltT = 3.4 - 1.6 * Math.min(1, t / 60)
    }

    if (t >= LENGTH && (live === 0 || t > LENGTH + 8)) g.levelDone()
  },

  progress: (g) => g.phaseT / LENGTH,

  drawBack: drawSkyBack,

  drawTop(g, ctx) {
    drawSkyTop(g, ctx)
    drawZaps(g, ctx)
  },

  // The Storm Eye glaring out of the clouds, a bolt coming down, a saucer
  // dodging and a beacon lit up on the ground.
  icon(ctx, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#1d1858')
    sky.addColorStop(1, '#0b0726')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(170,200,255,0.3)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    for (let i = 0; i < 16; i++) {
      const x = 3 + ((i * 23) % (w - 4))
      const y = 16 + ((i * 17) % (h - 18))
      ctx.moveTo(x, y)
      ctx.lineTo(x - 1.5, y - 5)
    }
    ctx.stroke()

    // a beacon glowing on the ground
    const bx = 61
    const by = 39
    const glow = ctx.createRadialGradient(bx, by, 0, bx, by, 15)
    glow.addColorStop(0, 'rgba(255,230,107,0.55)')
    glow.addColorStop(1, 'rgba(255,230,107,0)')
    ctx.fillStyle = glow
    ctx.fillRect(bx - 15, by - 15, 30, 30)
    ctx.fillStyle = 'rgba(30,20,6,0.5)'
    ctx.strokeStyle = '#ffe66b'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.arc(bx, by, 7.5, 0, TAU)
    ctx.fill()
    ctx.stroke()
    boltGlyph(ctx, bx, by, 3.6, '#ffe66b')

    drawSaucer(ctx, 17, 36, 8, 'zigzag', 1.1)

    // the bolt
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const path = new Path2D()
    path.moveTo(41, 18)
    path.lineTo(36, 26)
    path.lineTo(42, 29)
    path.lineTo(37, 38)
    path.lineTo(42, 41)
    path.lineTo(39, 50)
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'rgba(143,216,255,0.35)'
    ctx.lineWidth = 6
    ctx.stroke(path)
    ctx.strokeStyle = '#8fd8ff'
    ctx.lineWidth = 2.6
    ctx.stroke(path)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.1
    ctx.stroke(path)
    ctx.restore()

    // the cloud deck, one heap shaded top to bottom
    const deck = ctx.createLinearGradient(0, -4, 0, 18)
    deck.addColorStop(0, '#a49de8')
    deck.addColorStop(0.5, '#4b43a0')
    deck.addColorStop(1, '#241e5e')
    ctx.fillStyle = deck
    ctx.beginPath()
    for (const [x, y, r] of [[2, 6, 8], [13, 9, 8], [25, 6, 9], [55, 6, 9], [67, 9, 8], [78, 6, 8], [40, 4, 10]]) {
      ctx.moveTo(x + r, y)
      ctx.arc(x, y, r, 0, TAU)
    }
    ctx.rect(0, 0, w, 8)
    ctx.fill()

    // and the Eye in the middle of it, glaring down
    ctx.fillStyle = '#140c38'
    ctx.beginPath()
    ctx.arc(40, 10, 9.5, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#eef2ff'
    ctx.beginPath()
    ctx.arc(40, 10, 7.5, 0, TAU)
    ctx.fill()
    const iris = ctx.createRadialGradient(40, 11.5, 0, 40, 11.5, 4.2)
    iris.addColorStop(0, '#fff7b8')
    iris.addColorStop(0.35, '#7dfcff')
    iris.addColorStop(1, '#2f7bff')
    ctx.fillStyle = iris
    ctx.beginPath()
    ctx.arc(40, 11.5, 4.2, 0, TAU)
    ctx.fill()
    ctx.fillStyle = '#0a0620'
    ctx.beginPath()
    ctx.ellipse(40, 11.5, 0.9, 2.6, 0, 0, TAU)
    ctx.fill()
    // a scowling lid, kept inside the eye
    ctx.save()
    ctx.beginPath()
    ctx.arc(40, 10, 7.5, 0, TAU)
    ctx.clip()
    ctx.fillStyle = '#5b4fc0'
    ctx.beginPath()
    ctx.moveTo(32, 2)
    ctx.lineTo(48, 2)
    ctx.lineTo(48, 5)
    ctx.lineTo(40, 8.6)
    ctx.lineTo(32, 5)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  },
}

export default {
  levels: { ion },
  bosses: { stormeye },
  enemies: {},
}
