import * as THREE from 'three'

/* =========================================================================
 * Cartoon faces
 * Every character in the scene wears a face drawn into a 2D canvas that is
 * then used as a billboarded texture.  Drawing happens in a unit square and
 * is scaled by the canvas size, so the same routine serves the sun, a
 * pea-sized moon and the UFO alike.
 * ========================================================================= */

const TAU = Math.PI * 2
const INK = '#2f1d44' // soft near-black: reads as ink rather than a hole
const WHITE = '#fffaf2'

// Where the features sit inside the unit square.
const EYE_Y = 0.44
const EYE_DX = 0.175
const EYE_RX = 0.105
const EYE_RY = 0.125
const MOUTH_Y = 0.7

// An expression is a small bag of feature choices. `brow` is positive for
// worried (inner ends lifted) and negative for cross (inner ends lowered).
const PRESETS = {
  content: { eyes: 'open', mouth: 'smile' },
  happy: { eyes: 'arc', mouth: 'bigSmile', blush: true },
  laugh: { eyes: 'arc', mouth: 'laugh', blush: true },
  grin: { eyes: 'open', mouth: 'grin', brow: -0.25 },
  surprise: { eyes: 'wide', mouth: 'o', brow: 0.3, pupil: 0.34 },
  scared: { eyes: 'wide', mouth: 'wobble', brow: 0.5, pupil: 0.3, sweat: true },
  worried: { eyes: 'open', mouth: 'wavy', brow: 0.4, pupil: 0.42 },
  angry: { eyes: 'open', mouth: 'frown', brow: -0.6, steam: true },
  hmph: { eyes: 'arc', mouth: 'pout', brow: -0.35, steam: true },
  smug: { eyes: 'half', mouth: 'smirk', brow: -0.15 },
  mischief: { eyes: 'open', mouth: 'smirk', brow: -0.45, pupil: 0.46 },
  cool: { eyes: 'half', mouth: 'smile' },
  sleepy: { eyes: 'closed', mouth: 'tiny', zzz: true },
  tease: { eyes: 'wink', mouth: 'tongue', blush: true },
  dizzy: { eyes: 'spiral', mouth: 'wobble' },
  love: { eyes: 'heart', mouth: 'bigSmile', blush: true },
  determined: { eyes: 'wide', mouth: 'grin', brow: -0.65, pupil: 0.4 },
  alien: { eyes: 'alien', mouth: 'smile' },
  alienGlee: { eyes: 'alien', mouth: 'bigSmile' },
}

export const EXPRESSIONS = Object.keys(PRESETS)

// ---------------------------------------------------------------------------
// Eye shapes — each draws one eye centred on (cx, cy)
// ---------------------------------------------------------------------------

function eyeBall(ctx, S, cx, cy, look, blink, scale, pupil) {
  const rx = EYE_RX * S * scale
  const ry = EYE_RY * S * scale * blink
  ctx.beginPath()
  ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU)
  ctx.fillStyle = WHITE
  ctx.fill()
  ctx.lineWidth = S * 0.016
  ctx.strokeStyle = INK
  ctx.stroke()

  // Pupil stays inside the eye even when the character looks sideways.
  ctx.save()
  ctx.clip()
  const px = cx + look.x * rx * 0.4
  const py = cy + look.y * ry * 0.4
  ctx.beginPath()
  ctx.arc(px, py, EYE_RX * S * scale * pupil, 0, TAU)
  ctx.fillStyle = INK
  ctx.fill()
  ctx.beginPath()
  ctx.arc(px - rx * 0.22, py - ry * 0.3, rx * 0.2, 0, TAU)
  ctx.fillStyle = WHITE
  ctx.fill()
  ctx.restore()
}

function eyeArc(ctx, S, cx, cy, up = true) {
  const r = EYE_RX * S * 1.15
  ctx.lineWidth = S * 0.028
  ctx.lineCap = 'round'
  ctx.strokeStyle = INK
  ctx.beginPath()
  if (up) ctx.arc(cx, cy + r * 0.4, r, Math.PI * 1.12, Math.PI * 1.88)
  else ctx.arc(cx, cy - r * 0.5, r, Math.PI * 0.18, Math.PI * 0.82)
  ctx.stroke()
}

function eyeSpiral(ctx, S, cx, cy, phase) {
  ctx.lineWidth = S * 0.022
  ctx.lineCap = 'round'
  ctx.strokeStyle = INK
  ctx.beginPath()
  for (let i = 0; i <= 44; i++) {
    const t = i / 44
    const a = t * TAU * 2 + phase
    const r = t * EYE_RX * S * 1.4
    const x = cx + Math.cos(a) * r
    const y = cy + Math.sin(a) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function eyeHeart(ctx, S, cx, cy) {
  const r = EYE_RX * S * 1.15
  ctx.beginPath()
  ctx.moveTo(cx, cy + r * 0.95)
  ctx.bezierCurveTo(cx - r * 1.7, cy - r * 0.35, cx - r * 0.55, cy - r * 1.35, cx, cy - r * 0.3)
  ctx.bezierCurveTo(cx + r * 0.55, cy - r * 1.35, cx + r * 1.7, cy - r * 0.35, cx, cy + r * 0.95)
  ctx.closePath()
  ctx.fillStyle = '#ff6f9c'
  ctx.fill()
  ctx.lineWidth = S * 0.014
  ctx.strokeStyle = INK
  ctx.stroke()
}

function eyeAlien(ctx, S, cx, cy, blink, side) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(side * 0.32) // classic tilted almonds
  ctx.beginPath()
  ctx.ellipse(0, 0, EYE_RX * S * 1.25, EYE_RY * S * 1.5 * blink, 0, 0, TAU)
  ctx.fillStyle = INK
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(-EYE_RX * S * 0.35, -EYE_RY * S * 0.5 * blink, EYE_RX * S * 0.3, EYE_RY * S * 0.35 * blink, -0.5, 0, TAU)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fill()
  ctx.restore()
}

function drawEye(ctx, S, style, cx, cy, s, side) {
  const blink = s.blink
  switch (style) {
    case 'open':
      if (blink < 0.2) eyeArc(ctx, S, cx, cy, false)
      else eyeBall(ctx, S, cx, cy, s.look, blink, 1, s.pupil)
      break
    case 'wide':
      if (blink < 0.2) eyeArc(ctx, S, cx, cy, false)
      else eyeBall(ctx, S, cx, cy, s.look, blink, 1.3, s.pupil)
      break
    case 'half':
      ctx.save()
      ctx.beginPath()
      ctx.rect(cx - S * 0.2, cy - EYE_RY * S * 0.2, S * 0.4, S * 0.4)
      ctx.clip()
      eyeBall(ctx, S, cx, cy, s.look, blink, 1.05, s.pupil)
      ctx.restore()
      ctx.lineWidth = S * 0.024
      ctx.lineCap = 'round'
      ctx.strokeStyle = INK
      ctx.beginPath()
      ctx.moveTo(cx - EYE_RX * S * 1.15, cy - EYE_RY * S * 0.2)
      ctx.lineTo(cx + EYE_RX * S * 1.15, cy - EYE_RY * S * 0.2)
      ctx.stroke()
      break
    case 'arc':
      eyeArc(ctx, S, cx, cy, true)
      break
    case 'closed':
      eyeArc(ctx, S, cx, cy, false)
      break
    case 'spiral':
      eyeSpiral(ctx, S, cx, cy, s.phase)
      break
    case 'heart':
      eyeHeart(ctx, S, cx, cy)
      break
    case 'alien':
      eyeAlien(ctx, S, cx, cy, Math.max(0.12, blink), side)
      break
    default:
      eyeBall(ctx, S, cx, cy, s.look, blink, 1, s.pupil)
  }
}

// ---------------------------------------------------------------------------
// Mouth shapes — drawn around (cx, cy)
// ---------------------------------------------------------------------------

function openMouth(ctx, S, cx, cy, halfWidth, depth) {
  ctx.beginPath()
  ctx.moveTo(cx - halfWidth, cy - S * 0.02)
  ctx.quadraticCurveTo(cx, cy + depth * 1.35, cx + halfWidth, cy - S * 0.02)
  ctx.closePath()
  ctx.fillStyle = INK
  ctx.fill()
  ctx.lineWidth = S * 0.014
  ctx.strokeStyle = INK
  ctx.lineJoin = 'round'
  ctx.stroke()
  return { halfWidth, depth }
}

function tongueIn(ctx, S, cx, cy, m) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(cx - m.halfWidth, cy - S * 0.02)
  ctx.quadraticCurveTo(cx, cy + m.depth * 1.35, cx + m.halfWidth, cy - S * 0.02)
  ctx.closePath()
  ctx.clip()
  ctx.beginPath()
  ctx.ellipse(cx, cy + m.depth * 0.95, m.halfWidth * 0.62, m.depth * 0.6, 0, 0, TAU)
  ctx.fillStyle = '#ff7a9e'
  ctx.fill()
  ctx.restore()
}

function drawMouth(ctx, S, style, s) {
  const cx = S * 0.5
  const cy = S * MOUTH_Y
  ctx.lineWidth = S * 0.026
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = INK

  switch (style) {
    case 'smile':
      ctx.beginPath()
      ctx.arc(cx, cy - S * 0.05, S * 0.13, Math.PI * 0.18, Math.PI * 0.82)
      ctx.stroke()
      break
    case 'tiny':
      ctx.beginPath()
      ctx.arc(cx, cy - S * 0.03, S * 0.06, Math.PI * 0.15, Math.PI * 0.85)
      ctx.stroke()
      break
    case 'bigSmile': {
      const m = openMouth(ctx, S, cx, cy, S * 0.15, S * 0.1 * (0.7 + s.talk * 0.6))
      tongueIn(ctx, S, cx, cy, m)
      break
    }
    case 'laugh': {
      const m = openMouth(ctx, S, cx, cy, S * 0.17, S * 0.14 * (0.65 + s.talk * 0.7))
      tongueIn(ctx, S, cx, cy, m)
      break
    }
    case 'grin': {
      const m = openMouth(ctx, S, cx, cy, S * 0.17, S * 0.1)
      // A band of teeth across the top of the mouth.
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx - m.halfWidth, cy - S * 0.02)
      ctx.quadraticCurveTo(cx, cy + m.depth * 1.35, cx + m.halfWidth, cy - S * 0.02)
      ctx.closePath()
      ctx.clip()
      ctx.fillStyle = WHITE
      ctx.fillRect(cx - m.halfWidth, cy - S * 0.03, m.halfWidth * 2, S * 0.05)
      ctx.restore()
      break
    }
    case 'o':
      ctx.beginPath()
      ctx.ellipse(cx, cy + S * 0.01, S * 0.055, S * 0.07 * (0.8 + s.talk * 0.5), 0, 0, TAU)
      ctx.fillStyle = INK
      ctx.fill()
      break
    case 'frown':
      ctx.beginPath()
      ctx.arc(cx, cy + S * 0.09, S * 0.12, Math.PI * 1.2, Math.PI * 1.8)
      ctx.stroke()
      break
    case 'pout':
      ctx.beginPath()
      ctx.arc(cx, cy + S * 0.06, S * 0.07, Math.PI * 1.15, Math.PI * 1.85)
      ctx.stroke()
      break
    case 'smirk':
      ctx.beginPath()
      ctx.moveTo(cx - S * 0.11, cy + S * 0.01)
      ctx.quadraticCurveTo(cx + S * 0.03, cy + S * 0.07, cx + S * 0.13, cy - S * 0.05)
      ctx.stroke()
      break
    case 'wobble':
    case 'wavy': {
      const amp = style === 'wobble' ? S * 0.028 : S * 0.016
      const w = S * 0.15
      ctx.beginPath()
      for (let i = 0; i <= 24; i++) {
        const t = i / 24
        const x = cx - w + t * w * 2
        const y = cy + Math.sin(t * TAU * 2 + s.phase * 2) * amp
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      break
    }
    case 'tongue': {
      ctx.beginPath()
      ctx.arc(cx, cy - S * 0.05, S * 0.13, Math.PI * 0.18, Math.PI * 0.82)
      ctx.stroke()
      // A cheeky tongue hanging out of one corner.
      ctx.beginPath()
      ctx.ellipse(cx + S * 0.05, cy + S * 0.07, S * 0.06, S * 0.075, 0.25, 0, TAU)
      ctx.fillStyle = '#ff7a9e'
      ctx.fill()
      ctx.lineWidth = S * 0.014
      ctx.stroke()
      break
    }
    default:
      break
  }
}

// ---------------------------------------------------------------------------
// Trimmings
// ---------------------------------------------------------------------------

function drawBrows(ctx, S, tilt) {
  ctx.lineWidth = S * 0.026
  ctx.lineCap = 'round'
  ctx.strokeStyle = INK
  for (const side of [-1, 1]) {
    const cx = S * (0.5 + side * EYE_DX)
    const base = S * (EYE_Y - 0.18)
    // `side` is -1 for the left eye, so the outer edge lies further out.
    const outer = cx + side * EYE_RX * S * 1.2
    const inner = cx - side * EYE_RX * S * 1.1
    ctx.beginPath()
    ctx.moveTo(outer, base + tilt * S * 0.03)
    ctx.lineTo(inner, base - tilt * S * 0.06)
    ctx.stroke()
  }
}

function drawBlush(ctx, S) {
  ctx.fillStyle = 'rgba(255, 122, 158, 0.5)'
  for (const side of [-1, 1]) {
    ctx.beginPath()
    ctx.ellipse(S * (0.5 + side * 0.255), S * 0.61, S * 0.072, S * 0.042, 0, 0, TAU)
    ctx.fill()
  }
}

function drawSweat(ctx, S, phase) {
  const y = S * (0.24 + Math.sin(phase * 3) * 0.012)
  ctx.beginPath()
  ctx.moveTo(S * 0.79, y)
  ctx.bezierCurveTo(S * 0.86, y + S * 0.06, S * 0.85, y + S * 0.12, S * 0.79, y + S * 0.12)
  ctx.bezierCurveTo(S * 0.73, y + S * 0.12, S * 0.72, y + S * 0.06, S * 0.79, y)
  ctx.closePath()
  ctx.fillStyle = 'rgba(150, 220, 255, 0.92)'
  ctx.fill()
  ctx.lineWidth = S * 0.012
  ctx.strokeStyle = 'rgba(60, 120, 190, 0.8)'
  ctx.stroke()
}

/** The comic-book popping-vein mark, throbbing above one eyebrow. */
function drawAngerMark(ctx, S, phase) {
  const x = S * 0.78
  const y = S * 0.22
  const r = S * (0.055 + Math.sin(phase * 6) * 0.006)
  ctx.strokeStyle = '#ff5d72'
  ctx.lineWidth = S * 0.022
  ctx.lineCap = 'round'
  for (const a of [0.25, 0.75, 1.25, 1.75]) {
    const ang = a * Math.PI
    ctx.beginPath()
    ctx.moveTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r)
    ctx.lineTo(x + Math.cos(ang + Math.PI / 2) * r * 0.35, y + Math.sin(ang + Math.PI / 2) * r * 0.35)
    ctx.lineTo(x + Math.cos(ang + Math.PI) * r, y + Math.sin(ang + Math.PI) * r)
    ctx.stroke()
  }
}

function drawZzz(ctx, S, phase) {
  ctx.fillStyle = 'rgba(190, 220, 255, 0.95)'
  for (let i = 0; i < 3; i++) {
    const t = (phase * 0.35 + i / 3) % 1
    const size = S * (0.09 + i * 0.02)
    ctx.save()
    ctx.globalAlpha = 0.95 * (1 - t * 0.8)
    ctx.font = `bold ${size}px "Trebuchet MS", sans-serif`
    ctx.fillText('z', S * (0.68 + t * 0.13), S * (0.33 - t * 0.2))
    ctx.restore()
  }
}

// ---------------------------------------------------------------------------
// The face itself
// ---------------------------------------------------------------------------

function drawFace(ctx, S, s) {
  ctx.clearRect(0, 0, S, S)
  const p = PRESETS[s.expression] ?? PRESETS.content
  s.pupil = p.pupil ?? 0.5

  const styles = p.eyes === 'wink' ? ['arc', 'open'] : [p.eyes, p.eyes]
  styles.forEach((style, i) => {
    const side = i === 0 ? -1 : 1
    drawEye(ctx, S, style, S * (0.5 + side * EYE_DX), S * EYE_Y, s, side)
  })

  if (p.brow) drawBrows(ctx, S, p.brow)
  drawMouth(ctx, S, p.mouth, s)
  if (p.blush) drawBlush(ctx, S)
  if (p.sweat) drawSweat(ctx, S, s.phase)
  if (p.steam) drawAngerMark(ctx, S, s.phase)
  if (p.zzz) drawZzz(ctx, S, s.phase)
}

// Expressions that visibly animate need the canvas redrawn as they move;
// the rest only redraw when something about the state actually changes.
const ANIMATED = new Set(['scared', 'worried', 'dizzy', 'sleepy', 'angry', 'hmph', 'laugh', 'happy', 'love', 'alienGlee'])

export class Face {
  constructor({ size = 256, expression = 'content' } = {}) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    this.size = size
    this.ctx = canvas.getContext('2d')
    this.texture = new THREE.CanvasTexture(canvas)
    this.texture.colorSpace = THREE.SRGBColorSpace

    this.base = expression
    this.expression = expression
    this.hold = 0
    this.blink = 1
    this.blinkTimer = 1 + Math.random() * 4
    this.look = new THREE.Vector2()
    this.phase = Math.random() * 10
    this.talk = 0
    this.pupil = 0.5
    this._key = null
  }

  /** Wear `expression` for `seconds` (0 = until something else changes it). */
  set(expression, seconds = 0) {
    this.expression = expression
    this.hold = seconds
  }

  /** The mood this character falls back to when nothing is happening. */
  setBase(expression) {
    this.base = expression
    if (this.hold <= 0) this.expression = expression
  }

  update(dt) {
    this.phase += dt
    this.talk = 0.5 + Math.sin(this.phase * 9) * 0.5

    if (this.hold > 0) {
      this.hold -= dt
      if (this.hold <= 0) this.expression = this.base
    }

    // Blink: a quick squash every few seconds.
    this.blinkTimer -= dt
    if (this.blinkTimer <= 0) {
      this.blink = Math.max(0, this.blink - dt * 14)
      if (this.blink <= 0) {
        this.blinkTimer = 2 + Math.random() * 4
        this.blink = 0.001
      }
    } else if (this.blink < 1) {
      this.blink = Math.min(1, this.blink + dt * 10)
    }

    const animated = ANIMATED.has(this.expression)
    const key = [
      this.expression,
      Math.round(this.blink * 5),
      Math.round(this.look.x * 5),
      Math.round(this.look.y * 5),
      animated ? Math.round(this.phase * 12) : 0,
    ].join('|')
    if (key === this._key) return
    this._key = key
    drawFace(this.ctx, this.size, this)
    this.texture.needsUpdate = true
  }
}

/** A transparent plane carrying a face, ready to be billboarded at the camera. */
export function makeFaceMesh(face, width) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, width),
    new THREE.MeshBasicMaterial({
      map: face.texture,
      transparent: true,
      depthWrite: false,
    }),
  )
  mesh.renderOrder = 3
  return mesh
}
