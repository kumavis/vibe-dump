import * as THREE from 'three'

/* =========================================================================
 * Art supplies
 * Procedural canvas textures (planet skins, glows, speech bubbles) plus the
 * toon ramp and outline helper that give everything its storybook look.
 * ========================================================================= */

const TAU = Math.PI * 2

function canvas2d(w, h) {
  const el = document.createElement('canvas')
  el.width = w
  el.height = h
  return el.getContext('2d')
}

function toTexture(ctx, { repeatWrap = true } = {}) {
  const tex = new THREE.CanvasTexture(ctx.canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  if (repeatWrap) tex.wrapS = THREE.RepeatWrapping
  return tex
}

const hex = (c) => `#${c.toString(16).padStart(6, '0')}`

/** A three-step ramp so MeshToonMaterial shades in flat cel bands. */
export function toonRamp() {
  const data = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255])
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat)
  tex.minFilter = tex.magFilter = THREE.NearestFilter
  tex.needsUpdate = true
  return tex
}

/** Draw a circle, repeating it across the seam so the texture tiles. */
function wrappedBlob(ctx, w, x, y, r, fill) {
  for (const dx of [-w, 0, w]) {
    ctx.beginPath()
    ctx.arc(x + dx, y, r, 0, TAU)
    ctx.fillStyle = fill
    ctx.fill()
  }
}

/**
 * A planet skin. `kind` picks the personality of the pattern; the two colours
 * are the base and the accent from the planet definition.
 */
export function planetTexture(kind, base, accent, seed = 1) {
  const w = 512
  const h = 256
  const ctx = canvas2d(w, h)
  let s = seed * 9781
  const rnd = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }

  ctx.fillStyle = hex(base)
  ctx.fillRect(0, 0, w, h)

  if (kind === 'bands') {
    for (let i = 0; i < 9; i++) {
      const y = (i + rnd() * 0.5) * (h / 9)
      const thickness = h * (0.035 + rnd() * 0.05)
      const amp = 4 + rnd() * 7
      const freq = 1 + Math.floor(rnd() * 3)
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const yy = y + Math.sin((x / w) * TAU * freq + i) * amp
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy)
      }
      for (let x = w; x >= 0; x -= 8) {
        const yy = y + thickness + Math.sin((x / w) * TAU * freq + i) * amp
        ctx.lineTo(x, yy)
      }
      ctx.closePath()
      ctx.fillStyle = hex(accent)
      ctx.globalAlpha = 0.35 + rnd() * 0.4
      ctx.fill()
      ctx.globalAlpha = 1
    }
    // A jovian storm spot, because giants should have one.
    ctx.globalAlpha = 0.75
    ctx.beginPath()
    ctx.ellipse(w * 0.62, h * 0.62, w * 0.06, h * 0.07, 0, 0, TAU)
    ctx.fillStyle = '#ff9d6e'
    ctx.fill()
    ctx.globalAlpha = 1
  } else if (kind === 'craters') {
    for (let i = 0; i < 34; i++) {
      const r = 6 + rnd() * 20
      const x = rnd() * w
      const y = h * 0.1 + rnd() * h * 0.8
      wrappedBlob(ctx, w, x, y, r, hex(accent))
      ctx.globalAlpha = 0.5
      wrappedBlob(ctx, w, x, y - r * 0.25, r * 0.7, 'rgba(255,255,255,0.35)')
      ctx.globalAlpha = 1
    }
  } else if (kind === 'continents') {
    for (let i = 0; i < 16; i++) {
      const cx = rnd() * w
      const cy = h * 0.15 + rnd() * h * 0.7
      const lobes = 4 + Math.floor(rnd() * 4)
      for (let j = 0; j < lobes; j++) {
        wrappedBlob(ctx, w, cx + (rnd() - 0.5) * 70, cy + (rnd() - 0.5) * 45, 12 + rnd() * 26, hex(accent))
      }
    }
    // Wispy clouds on top.
    ctx.globalAlpha = 0.3
    for (let i = 0; i < 22; i++) {
      wrappedBlob(ctx, w, rnd() * w, rnd() * h, 10 + rnd() * 26, '#ffffff')
    }
    ctx.globalAlpha = 1
  } else if (kind === 'swirl') {
    for (let i = 0; i < 26; i++) {
      const y = rnd() * h
      const amp = 6 + rnd() * 16
      ctx.beginPath()
      for (let x = 0; x <= w; x += 6) {
        const yy = y + Math.sin((x / w) * TAU * (1 + rnd() * 0.02) + i) * amp
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy)
      }
      ctx.strokeStyle = rnd() > 0.5 ? hex(accent) : 'rgba(255,255,255,0.55)'
      ctx.globalAlpha = 0.2 + rnd() * 0.4
      ctx.lineWidth = 3 + rnd() * 9
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }

  return toTexture(ctx)
}

/** Warm churning surface for the sun. */
export function sunTexture() {
  const w = 512
  const h = 256
  const ctx = canvas2d(w, h)
  ctx.fillStyle = '#ffc247'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 90; i++) {
    const r = 8 + Math.random() * 26
    ctx.globalAlpha = 0.16 + Math.random() * 0.25
    wrappedBlob(ctx, w, Math.random() * w, Math.random() * h, r, Math.random() > 0.45 ? '#fff1a8' : '#ff9d3c')
  }
  ctx.globalAlpha = 1
  return toTexture(ctx)
}

/** Soft radial glow used for the sun's halo and the star sprites. */
export function glowTexture(inner = 'rgba(255,225,160,0.95)', outer = 'rgba(255,170,80,0)') {
  const size = 256
  const ctx = canvas2d(size, size)
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, inner)
  g.addColorStop(0.45, inner.replace(/[\d.]+\)$/, '0.35)'))
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return toTexture(ctx, { repeatWrap: false })
}

/**
 * Flame gradient for the meteor's tail. The cone's v runs 0 at the base to 1
 * at the tip, so the top of this canvas is the hot nose and the bottom fades
 * out into nothing.
 */
export function flameTexture() {
  const ctx = canvas2d(16, 128)
  const g = ctx.createLinearGradient(0, 0, 0, 128)
  g.addColorStop(0, 'rgba(255, 244, 210, 0.95)')
  g.addColorStop(0.25, 'rgba(255, 190, 90, 0.7)')
  g.addColorStop(0.6, 'rgba(255, 110, 40, 0.3)')
  g.addColorStop(1, 'rgba(255, 60, 20, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 16, 128)
  return toTexture(ctx, { repeatWrap: false })
}

/** Ringed-planet rings: concentric bands with gaps. */
export function ringTexture(color, accent) {
  const w = 256
  const ctx = canvas2d(w, 8)
  ctx.fillStyle = hex(color)
  ctx.fillRect(0, 0, w, 8)
  for (let i = 0; i < 22; i++) {
    const x = Math.random() * w
    ctx.globalAlpha = 0.25 + Math.random() * 0.5
    ctx.fillStyle = Math.random() > 0.5 ? hex(accent) : 'rgba(255,255,255,0.6)'
    ctx.fillRect(x, 0, 2 + Math.random() * 9, 8)
  }
  ctx.globalAlpha = 1
  // Fade the inner and outer edges so the ring melts away at its rims.
  const fade = ctx.createLinearGradient(0, 0, w, 0)
  fade.addColorStop(0, 'rgba(0,0,0,1)')
  fade.addColorStop(0.12, 'rgba(0,0,0,0)')
  fade.addColorStop(0.9, 'rgba(0,0,0,0)')
  fade.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = fade
  ctx.fillRect(0, 0, w, 8)
  ctx.globalCompositeOperation = 'source-over'
  const tex = toTexture(ctx, { repeatWrap: false })
  return tex
}

/** A comic speech bubble with a tail, sized to the text. */
export function bubbleTexture(text) {
  const w = 512
  const h = 256
  const ctx = canvas2d(w, h)
  const pad = 34
  ctx.font = 'bold 74px "Trebuchet MS", "Segoe UI", sans-serif'
  const measured = Math.min(w - pad * 2, ctx.measureText(text).width)
  const bw = measured + pad * 2
  const bh = 130
  const x = (w - bw) / 2
  const y = 24

  ctx.beginPath()
  ctx.roundRect(x, y, bw, bh, 44)
  ctx.moveTo(w / 2 - 26, y + bh - 6)
  ctx.lineTo(w / 2 - 4, y + bh + 58)
  ctx.lineTo(w / 2 + 30, y + bh - 6)
  ctx.closePath()
  ctx.fillStyle = '#fff6e8'
  ctx.fill()
  ctx.lineWidth = 7
  ctx.strokeStyle = '#2f1d44'
  ctx.lineJoin = 'round'
  ctx.stroke()

  ctx.fillStyle = '#2f1d44'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, y + bh / 2, bw - pad * 2)
  return toTexture(ctx, { repeatWrap: false })
}

/** A painted deep-space backdrop: dusk gradient plus a few nebula smudges. */
export function nebulaSky(radius = 420) {
  const w = 1024
  const h = 512
  const ctx = canvas2d(w, h)
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#0d0722')
  sky.addColorStop(0.5, '#241543')
  sky.addColorStop(1, '#120b26')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  const tints = ['rgba(126, 84, 200, 0.30)', 'rgba(60, 130, 200, 0.24)', 'rgba(220, 110, 180, 0.20)']
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * w
    const y = h * 0.15 + Math.random() * h * 0.7
    const r = 60 + Math.random() * 190
    // Repeat across the seam, otherwise the wrap point shows as a hard edge.
    for (const dx of [-w, 0, w]) {
      const g = ctx.createRadialGradient(x + dx, y, 0, x + dx, y, r)
      g.addColorStop(0, tints[i % tints.length])
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(x + dx - r, y - r, r * 2, r * 2)
    }
  }

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 24),
    new THREE.MeshBasicMaterial({ map: toTexture(ctx), side: THREE.BackSide, depthWrite: false }),
  )
  return mesh
}

/** A faint dotted line marking a planet's orbit. */
export function orbitLine(radius, incl, color = 0x6f5aa8) {
  const points = []
  for (let i = 0; i <= 220; i++) {
    const a = (i / 220) * TAU
    points.push(
      new THREE.Vector3(
        Math.cos(a) * radius,
        Math.sin(a) * radius * Math.sin(incl),
        Math.sin(a) * radius * Math.cos(incl),
      ),
    )
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points)
  const line = new THREE.Line(geo, new THREE.LineDashedMaterial({ color, dashSize: 0.55, gapSize: 0.5, transparent: true, opacity: 0.4 }))
  line.computeLineDistances()
  return line
}

/** Twinkly background stars. */
export function starfield(count = 1400, radius = 260) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const tint = new THREE.Color()
  for (let i = 0; i < count; i++) {
    // Sample a shell so stars never sit inside the solar system itself.
    const u = Math.random() * 2 - 1
    const a = Math.random() * TAU
    const r = radius * (0.6 + Math.random() * 0.4)
    const s = Math.sqrt(1 - u * u)
    positions[i * 3] = Math.cos(a) * s * r
    positions[i * 3 + 1] = u * r * 0.55
    positions[i * 3 + 2] = Math.sin(a) * s * r
    tint.setHSL(0.55 + Math.random() * 0.25, 0.55, 0.72 + Math.random() * 0.28)
    colors[i * 3] = tint.r
    colors[i * 3 + 1] = tint.g
    colors[i * 3 + 2] = tint.b
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const mat = new THREE.PointsMaterial({
    size: 2.4,
    map: glowTexture('rgba(255,255,255,0.95)', 'rgba(255,255,255,0)'),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  })
  return new THREE.Points(geo, mat)
}

/** Classic inverted-hull outline: a slightly fatter back-facing copy. */
export function outline(geometry, scale = 1.055, color = 0x2f1d44) {
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }))
  mesh.scale.setScalar(scale)
  return mesh
}
