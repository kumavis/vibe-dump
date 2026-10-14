// amp.js — HydroAmp: a liquid-metal Winamp skin. The visualizer is not bars,
// it is a chamber of magenta goo with jets along the floor that fire on every
// note the chiptune plays — melody notes by pitch, kicks dead centre, snares
// at the sides — with two rubber ducks riding the result. The porthole on the
// left is the BASS flask: it jumps on every kick.

import { Skin, buttonSprites, RES } from './skin.js'
import { rect, circle, capsule, blend, subtract, ring } from './sdf.js'
import { hex } from './skinart.js'
import { rgb } from './goo.js'
import { drawText, drawSeg, textWidth } from './pixelfont.js'
import { Floater, drawDuck, Bubbles, Glitter } from './fx.js'

const W = 560, H = 250
const VIZ = { x: 204, y: 134, w: 330, h: 84 }
const FLASK = { cx: 96, cy: 130, r: 63 }
const LCD = { x: 204, y: 46, w: 214, h: 76 }
const TRACK = { x0: 454, x1: 528, y: 104 }

const SHAPE = subtract(
  blend(34,
    rect(66, 30, 480, 200, 46),
    circle(96, 130, 86),
    capsule(318, 22, 508, 20, 15),
    capsule(150, 226, 300, 236, 10),
  ),
  circle(560, 250, 34), 10)

const TITLE = '   ♪ TEAM AQUA - GLASS OCEAN.XM ★ 138 BPM ★ 4 CHANNELS OF PURE GOO ★ '

export function makeAmp(goo, chip) {
  const skin = new Skin(goo, { id: 'amp', title: 'HydroAmp', w: W, h: H, shape: SHAPE })
  skin.controls([484, 20], [501, 19], 6)

  // ---- liquids ----
  const viz = skin.vessel({
    ...VIZ,
    inside: rect(4, 4, VIZ.w - 8, VIZ.h - 8, 28),
    fluid: { spacing: 7, max: 700, gravity: 1300 },
    fill: (x, y) => y > 46,
    tint: (x) => x / VIZ.w,
    look: { a: rgb('#ff2bd6'), b: rgb('#7d3cff'), glow: rgb('#ff8af0'), glowAmt: 0.45, caustics: 0.45, alpha: 0.84 },
  })
  const fs = FLASK.r * 2
  const flask = skin.vessel({
    x: FLASK.cx - FLASK.r, y: FLASK.cy - FLASK.r, w: fs, h: fs,
    inside: circle(FLASK.r, FLASK.r, FLASK.r - 3),
    fluid: { spacing: 7, max: 400, gravity: 1300 },
    fill: (x, y) => y > FLASK.r + 4,
    look: { a: rgb('#21ff8f'), b: rgb('#c6ff3d'), glow: rgb('#a8ffd0'), glowAmt: 0.5, caustics: 0.55, alpha: 0.82 },
    tint: (x, y) => Math.min(1, Math.max(0, (y - FLASK.r) / FLASK.r)),
  })
  viz.fluid.settle()
  flask.fluid.settle()

  const ducks = [
    new Floater(viz.fluid, 110, 40, 9, { buoy: 2.2 }),
    new Floater(viz.fluid, 230, 40, 7.5, { buoy: 2.2 }),
  ]
  ducks[1].flip = -1
  const vizBubbles = new Bubbles(viz.fluid, { rate: 7, size: [0.8, 2.4] })
  const flaskBubbles = new Bubbles(flask.fluid, { rate: 4, size: [1, 2.6] })
  const glitter = new Glitter(flask.fluid, 22)

  // ---- music → jets ----
  const spec = new Float32Array(12)
  let kickFlash = 0
  chip.on((e) => {
    const vf = viz.fluid, ff = flask.fluid
    const strong = chip.mode === 'play' ? 0.75 : 0.55
    if (e.type === 'kick') {
      vf.impulse(VIZ.w * 0.5, VIZ.h - 6, 58, 0, -620 * strong)
      ff.impulse(FLASK.r, fs - 10, 40, (Math.random() - 0.5) * 160, -420 * strong)
      kickFlash = 1
      spec[0] = spec[1] = 1
    } else if (e.type === 'snare') {
      vf.impulse(26, VIZ.h - 8, 30, 160, -560 * strong)
      vf.impulse(VIZ.w - 26, VIZ.h - 8, 30, -160, -560 * strong)
      spec[5] = spec[6] = 1
    } else if (e.type === 'lead') {
      const k = Math.min(1, Math.max(0, (e.note - 64) / 26))
      const x = 30 + k * (VIZ.w - 60)
      vf.impulse(x, VIZ.h - 6, 20, 0, -640 * strong)
      spec[2 + Math.round(k * 9)] = 1
    } else if (e.type === 'hat') {
      vf.impulse(40 + Math.random() * (VIZ.w - 80), VIZ.h - 6, 12, 0, -260 * strong)
      spec[11] = Math.max(spec[11], 0.6)
    } else if (e.type === 'bass') {
      ff.impulse(FLASK.r + (Math.random() - 0.5) * 30, fs - 12, 22, 0, -120 * strong)
    } else if (e.type === 'arp' && Math.random() < 0.35) {
      vizBubbles.spawn(20 + Math.random() * (VIZ.w - 40), VIZ.h - 10)
    }
  })

  // ---- buttons ----
  const jelly = (col) => (p, ox, oy, down) => {
    const r = (p.w - 16) / 2
    p.part(circle(ox + r, oy + r, r + 2), { type: 'chrome', color: [0.85, 0.95, 1.1], bevel: 3, pillow: 0.6 })
    p.part(circle(ox + r, oy + r, r - 1), { type: 'plastic', color: down ? col.map((c) => c * 0.7) : col, bevel: r * 0.9, pillow: 0.2, alpha: 0.95 })
  }
  const tri = (ctx, x, y, s, dir) => {
    ctx.beginPath()
    ctx.moveTo(x - s * 0.5 * dir, y - s * 0.6)
    ctx.lineTo(x + s * 0.6 * dir, y)
    ctx.lineTo(x - s * 0.5 * dir, y + s * 0.6)
    ctx.closePath()
    ctx.fill()
  }
  const glyphStyle = (ctx) => {
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    ctx.shadowColor = 'rgba(40,0,60,0.6)'
    ctx.shadowBlur = 2
    ctx.shadowOffsetY = 1
  }
  const prevSprite = buttonSprites(26, 26, jelly(hex('#28c8ff')), (ctx, x, y) => {
    glyphStyle(ctx); tri(ctx, x - 1, y, 7, -1); tri(ctx, x + 5, y, 7, -1)
  })
  const nextSprite = buttonSprites(26, 26, jelly(hex('#28c8ff')), (ctx, x, y) => {
    glyphStyle(ctx); tri(ctx, x - 4, y, 7, 1); tri(ctx, x + 2, y, 7, 1)
  })
  const playSprite = buttonSprites(32, 32, jelly(hex('#ff3cc8')), (ctx, x, y) => {
    glyphStyle(ctx); tri(ctx, x + 1, y, 11, 1)
  })
  const pauseSprite = buttonSprites(32, 32, jelly(hex('#ff3cc8')), (ctx, x, y) => {
    glyphStyle(ctx); ctx.fillRect(x - 6, y - 6, 4, 12); ctx.fillRect(x + 2, y - 6, 4, 12)
  })
  skin.button({ x: 446, y: 64, r: 13, sprite: prevSprite, press: () => { chip.skip(-1); viz.fluid.burst(60, 60, 60, 500) } })
  skin.togglePlay = () => {
    const was = chip.mode
    const m = chip.toggle()
    play.sprite = m === 'play' ? pauseSprite : playSprite
    if (was === 'demo') chip.elapsed = 0
    viz.fluid.burst(VIZ.w / 2, VIZ.h - 10, 90, 700)
  }
  // the tray duck pokes the real ones
  skin.hop = () => {
    for (const d of ducks) viz.fluid.impulse(d.x, d.y + 10, 26, 0, -700)
  }
  const play = skin.button({ x: 482, y: 64, r: 16, sprite: playSprite, press: () => skin.togglePlay() })
  skin.button({ x: 518, y: 64, r: 13, sprite: nextSprite, press: () => { chip.skip(1); viz.fluid.burst(VIZ.w - 60, 60, 60, 500) } })
  const setVol = (lx) => chip.setVolume(Math.min(1, Math.max(0, (lx - TRACK.x0) / (TRACK.x1 - TRACK.x0))))
  skin.button({ x: TRACK.x0 - 10, y: TRACK.y - 10, w: TRACK.x1 - TRACK.x0 + 20, h: 20, press: setVol, drag: setVol })
  const knob = buttonSprites(18, 18, jelly(hex('#b8ff3a')))

  // ---- paint the skin ----
  const back = skin.painter()
  back.part(SHAPE, { type: 'chrome', color: [0.8, 0.92, 1.14], bevel: 12, pillow: 1.0, hz: 0.06 })
  // porthole bezel + flask well
  back.part(ring(FLASK.cx, FLASK.cy, 70, 7), { type: 'chrome', color: [1.0, 0.98, 1.05], bevel: 7, pillow: 0 })
  back.part(circle(FLASK.cx, FLASK.cy, 63), { type: 'glass', color: [0.02, 0.07, 0.09], bevel: 7, recess: true, pillow: 0 })
  // LCD + bezel
  back.part(subtract(rect(LCD.x - 6, LCD.y - 6, LCD.w + 12, LCD.h + 12, 18), rect(LCD.x, LCD.y, LCD.w, LCD.h, 14)),
    { type: 'chrome', color: [0.9, 0.96, 1.1], bevel: 4, pillow: 0.4 })
  back.part(rect(LCD.x, LCD.y, LCD.w, LCD.h, 14), { type: 'lcd', color: [0.015, 0.11, 0.1], bevel: 5, recess: true, pillow: 0 })
  // visualizer chamber + bezel
  back.part(subtract(rect(VIZ.x - 6, VIZ.y - 6, VIZ.w + 12, VIZ.h + 12, 38), rect(VIZ.x, VIZ.y, VIZ.w, VIZ.h, 32)),
    { type: 'chrome', color: [0.9, 0.96, 1.1], bevel: 4, pillow: 0.4 })
  back.part(rect(VIZ.x, VIZ.y, VIZ.w, VIZ.h, 32), { type: 'glass', color: [0.03, 0.02, 0.09], bevel: 7, recess: true, pillow: 0 })
  // button wells + slider track
  for (const [x, r] of [[446, 13], [482, 16], [518, 13]]) {
    back.part(circle(x, 64, r + 4), { type: 'glass', color: [0.02, 0.04, 0.08], bevel: 3, recess: true, pillow: 0 })
  }
  back.part(capsule(TRACK.x0, TRACK.y, TRACK.x1, TRACK.y, 5), { type: 'glass', color: [0.02, 0.04, 0.08], bevel: 3, recess: true, pillow: 0 })
  // rivets
  for (const [x, y] of [[190, 46], [190, 214], [540, 96]]) {
    back.part(circle(x, y, 4.5), { type: 'chrome', color: [1, 1, 1], bevel: 4.5, pillow: 0 })
  }
  // front glass: shine over the chambers and the LCD
  const front = skin.painter()
  front.shine(rect(VIZ.x, VIZ.y, VIZ.w, VIZ.h, 32), { bevel: 7, gloss: 0.42, glossAlpha: 0.22 })
  front.shine(circle(FLASK.cx, FLASK.cy, 63), { bevel: 7, gloss: 0.45, glossAlpha: 0.3 })
  front.shine(rect(LCD.x, LCD.y, LCD.w, LCD.h, 14), { bevel: 5, gloss: 0.45, glossAlpha: 0.12 })
  skin.bake(back, front, { glow: 'rgba(80,200,255,0.55)', glowBlur: 30 })

  // etched lettering baked into the body
  const bctx = skin.back.getContext('2d')
  bctx.setTransform(RES, 0, 0, RES, skin.m * RES, skin.m * RES)
  const etch = (s, x, y, px) => {
    drawText(bctx, s, x, y + px * 0.6, { px, color: 'rgba(255,255,255,0.55)' })
    drawText(bctx, s, x, y, { px, color: 'rgba(8,28,60,0.75)' })
  }
  etch('HYDROAMP', 338, 12, 2)
  etch('V2.9 ★ TEAM AQUA', 172, 232, 1)
  etch('BASS', 85, 203, 1)
  etch('VOL', 430, 101, 1)

  // ---- per frame ----
  let mq = 0
  skin.drawUnder = null
  skin.drawOver = (ctx, t, dt) => {
    // ducks + bubbles in the goo
    for (const d of ducks) drawDuck(ctx, VIZ.x + d.x, VIZ.y + d.y - d.r * 0.25, d.r * 1.05, d.rot, d.flip ?? 1)
    vizBubbles.draw(ctx, VIZ.x, VIZ.y)
    flaskBubbles.draw(ctx, flask.x, flask.y)
    glitter.draw(ctx, flask.x, flask.y, t, kickFlash * 0.5)

    // LCD
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(LCD.x + 2, LCD.y + 2, LCD.w - 4, LCD.h - 4, 12)
    ctx.clip()
    const on = '#7dffc0', dim = 'rgba(125,255,192,0.07)'
    const secs = Math.floor(chip.elapsed)
    const mm = String(Math.floor(secs / 60) % 100).padStart(2, '0')
    const ss = String(secs % 60).padStart(2, '0')
    drawSeg(ctx, `${mm}:${ss}`, 236, 54, { w: 12, h: 24, t: 3.2, gap: 6, on, off: dim, glow: on })
    const icon = chip.mode === 'play' ? '▶' : chip.mode === 'pause' ? '■' : '▶'
    if (chip.mode !== 'demo' || Math.sin(t * 6) > 0) drawText(ctx, icon, 214, 59, { px: 2, color: on, glow: on })
    drawText(ctx, '128KBPS 44KHZ', 326, 53, { px: 1, color: on })
    drawText(ctx, chip.mode === 'demo' ? 'DEMO - PRESS ▶' : chip.mode === 'play' ? 'STEREO ★ LIVE' : 'PAUSED', 326, 64, { px: 1, color: chip.mode === 'demo' ? '#ffd27a' : on })
    // mini spectrum fed by the same note events as the jets
    for (let i = 0; i < spec.length; i++) {
      spec[i] *= Math.exp(-5 * dt)
      const bh = 2 + spec[i] * 18
      for (let k = 0; k < bh; k += 2) {
        ctx.fillStyle = k > 14 ? '#ff6ad5' : k > 9 ? '#ffe36a' : on
        ctx.fillRect(326 + i * 7, 96 - k, 5, 1.4)
      }
    }
    // marquee
    mq += dt * 34
    const tw = textWidth(TITLE, 2) + 12
    const off = mq % tw
    for (let k = 0; k < 2; k++) {
      drawText(ctx, TITLE, 214 - off + k * tw, 104, { px: 2, color: on, glow: on, lcd: 0.4 })
    }
    ctx.restore()
    kickFlash *= Math.exp(-6 * dt)
  }
  skin.drawTop = (ctx) => {
    const kx = TRACK.x0 + chip.volume * (TRACK.x1 - TRACK.x0)
    const img = knob.up
    ctx.drawImage(img, kx - img.width / RES / 2, TRACK.y - img.height / RES / 2 + 1, img.width / RES, img.height / RES)
  }

  // ambient fizz from the floors
  const onStep = (dt) => {
    vizBubbles.ambient(dt, () => [10 + Math.random() * (VIZ.w - 20), VIZ.h - 8])
    flaskBubbles.ambient(dt, () => [FLASK.r + (Math.random() - 0.5) * 60, fs - 10])
    vizBubbles.step(dt)
    flaskBubbles.step(dt)
  }
  skin.tick = onStep
  return skin
}
