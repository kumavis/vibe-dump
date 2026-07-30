import * as THREE from 'three'
import { drawIcon } from './icons.js'

// ---------------------------------------------------------------------------
// Sims-style speech bubbles: a rounded card of icon glyphs (and price digits)
// on a camera-facing sprite above a speaker's head. One bubble per speaker —
// a new utterance replaces the old one, which is exactly how a conversation
// reads from across a plaza.
// ---------------------------------------------------------------------------

const TONE = {
  neutral: '#8a8398',
  good: '#2f9e44',
  bad: '#c0392b',
  gold: '#c9971a',
}

const DPR = 2
const ICON = 40
const PAD = 11
const CARD_H = 62
const TAIL = 13

function renderBubble(tokens, tone) {
  // measure
  const meas = document.createElement('canvas').getContext('2d')
  meas.font = 'bold 30px sans-serif'
  let w = PAD * 2
  const widths = tokens.map((tok) => {
    const isText = /^\d/.test(tok)
    const tw = isText ? meas.measureText(tok).width + 4 : ICON
    w += tw + 5
    return tw
  })
  w -= 5

  const canvas = document.createElement('canvas')
  canvas.width = w * DPR
  canvas.height = (CARD_H + TAIL) * DPR
  const ctx = canvas.getContext('2d')
  ctx.scale(DPR, DPR)

  // card
  ctx.fillStyle = 'rgba(252, 250, 245, 0.96)'
  ctx.strokeStyle = TONE[tone] || TONE.neutral
  ctx.lineWidth = 3
  const r = 14
  ctx.beginPath()
  ctx.roundRect(1.5, 1.5, w - 3, CARD_H - 3, r)
  ctx.fill()
  ctx.stroke()
  // tail
  ctx.beginPath()
  ctx.moveTo(w / 2 - 9, CARD_H - 2)
  ctx.lineTo(w / 2, CARD_H + TAIL - 2)
  ctx.lineTo(w / 2 + 9, CARD_H - 2)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = 'rgba(252, 250, 245, 0.96)'
  ctx.stroke()

  // tokens
  let x = PAD
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i]
    if (/^\d/.test(tok)) {
      ctx.fillStyle = '#3a3226'
      ctx.font = 'bold 30px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(tok, x + 2, CARD_H / 2 + 1)
    } else {
      drawIcon(ctx, tok, x + ICON / 2, CARD_H / 2, ICON)
    }
    x += widths[i] + 5
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  return { texture, aspect: w / (CARD_H + TAIL) }
}

export function createBubbles(scene) {
  /** @type {Map<object, {sprite, mat, age, ttl, anchorH, target}>} */
  const live = new Map()
  const _p = new THREE.Vector3()

  /**
   * @param {THREE.Object3D} target   character group (feet at its origin)
   * @param {number} anchorH          metres above the target origin
   * @param {string[]} tokens         icon names / digit strings
   * @param {{tone?:string, ttl?:number}} [opts]
   */
  function say(target, anchorH, tokens, opts = {}) {
    dismiss(target)
    const { texture, aspect } = renderBubble(tokens, opts.tone || 'neutral')
    const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true })
    const sprite = new THREE.Sprite(mat)
    sprite.renderOrder = 20
    const h = 0.6
    sprite.scale.set(h * aspect, h, 1)
    sprite.center.set(0.5, 0)
    scene.add(sprite)
    live.set(target, { sprite, mat, age: 0, ttl: opts.ttl ?? 3.0, anchorH, target })
    return sprite
  }

  function dismiss(target) {
    const b = live.get(target)
    if (!b) return
    scene.remove(b.sprite)
    b.mat.map.dispose()
    b.mat.dispose()
    live.delete(target)
  }

  function update(dt) {
    for (const b of live.values()) {
      b.age += dt
      if (b.age >= b.ttl) {
        dismiss(b.target)
        continue
      }
      // pop-in overshoot, fade-out
      const pop = Math.min(1, b.age / 0.18)
      const overshoot = 1 + Math.sin(Math.min(pop, 1) * Math.PI) * 0.12
      const fade = Math.min(1, (b.ttl - b.age) / 0.3)
      b.mat.opacity = fade
      const s = pop * overshoot
      const h = 0.6 * s
      b.sprite.scale.set(h * (b.mat.map.image.width / b.mat.map.image.height), h, 1)
      b.target.getWorldPosition(_p)
      b.sprite.position.set(_p.x, _p.y + b.anchorH + Math.sin(b.age * 1.7) * 0.02, _p.z)
    }
  }

  return { say, dismiss, update, live }
}
