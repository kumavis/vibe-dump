// materials.js — the room's shared palette, material bench and dirt tools.
//
// Rules the whole scene plays by:
//   · 90% of the frame is near-black. All the chroma lives in the lights and
//     in a handful of emissive surfaces, never in a big painted face.
//   · Everything is MeshStandardMaterial with vertex colours enabled, so
//     contactDarken() and edgeDirt() can grime a mesh up after the fact.
//   · No image files. Every texture is drawn into a canvas at boot.
//   · Bloom is faked with three additive sprites per emitter; it costs
//     nothing and does not drag EffectComposer into the bundle.

import * as THREE from 'three'

export const PALETTE = {
  // architecture / base — violet-leaning near-blacks
  void: 0x07060b,
  crevice: 0x0d0b13,
  wallDark: 0x141120,
  wall: 0x1c1826,
  wallLit: 0x272134,
  dustTop: 0x332c45,
  chip: 0x463c58,

  // neutral ballast — keeps the room from reading as a monochrome wash
  greyMetal: 0x2a2a2e,
  plastic: 0x3a3844,
  aluminium: 0x6e6a78,
  brightMetal: 0x8e8798,

  // organics — the lived-in tax
  cardboardDark: 0x3a2a24,
  cardboard: 0x5c4133,
  plywood: 0x7a5a3c,
  fabric: 0x2f2836,
  leafDark: 0x26301f,
  leaf: 0x46603f,
  terracotta: 0x6b3d2e,

  // emissives — budget these hard
  violet: 0xb026ff,
  magenta: 0xe040fb,
  pink: 0xff2e88,
  periwinkle: 0x7a5cff,
  cyan: 0x38e8ff,
  green: 0x4dff9e,
  amber: 0xffb23f,
  sodium: 0xff7a18,
  gold: 0xd3ab55,

  // circuit board
  pcb: 0x1d2f26,
  pcbLit: 0x2c4a3b,
  solderMask: 0x0f1a16,
  copper: 0xb87333,
  silk: 0xd8d4c8,
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// --- canvas textures --------------------------------------------------------

const texCache = new Map()

export function makeCanvasTexture(key, w, h, draw, { repeat = [1, 1], srgb = true, wrap = THREE.RepeatWrapping } = {}) {
  if (texCache.has(key)) return texCache.get(key)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  draw(ctx, w, h)
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = wrap
  tex.repeat.set(repeat[0], repeat[1])
  // Colour maps must be tagged sRGB; roughness/bump maps must stay linear.
  // Getting this backwards is the classic silent "why is everything washed
  // out" bug, so it is a required argument rather than a default.
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  tex.anisotropy = 4
  texCache.set(key, tex)
  return tex
}

const hex = (n) => `#${n.toString(16).padStart(6, '0')}`

/** Three octaves of blotch noise. The universal roughness modulator. */
export function grimeTexture() {
  return makeCanvasTexture(
    'grime',
    256,
    256,
    (ctx, w, h) => {
      ctx.fillStyle = '#b4b4b4'
      ctx.fillRect(0, 0, w, h)
      for (const [count, size, alpha] of [
        [900, 3, 0.06],
        [260, 11, 0.07],
        [60, 38, 0.05],
      ]) {
        for (let i = 0; i < count; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`
          const x = Math.random() * w
          const y = Math.random() * h
          const r = size * (0.4 + Math.random())
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    },
    { srgb: false },
  )
}

/** Pitted concrete with hairline cracks and a grimy skirting gradient. */
export function concreteTexture() {
  return makeCanvasTexture(
    'concrete',
    512,
    512,
    (ctx, w, h) => {
      ctx.fillStyle = hex(PALETTE.wallLit)
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < 4200; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? `rgba(0,0,0,${0.03 + Math.random() * 0.07})` : `rgba(70,60,88,${0.03 + Math.random() * 0.07})`
        ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
      }
      ctx.strokeStyle = hex(PALETTE.crevice)
      ctx.lineWidth = 1
      for (let c = 0; c < 12; c++) {
        let x = Math.random() * w
        let y = Math.random() * h
        ctx.beginPath()
        ctx.moveTo(x, y)
        const steps = 12 + Math.floor(Math.random() * 22)
        let a = Math.random() * Math.PI * 2
        for (let s = 0; s < steps; s++) {
          a += (Math.random() - 0.5) * 1.1
          x += Math.cos(a) * 9
          y += Math.sin(a) * 9
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'multiply'
      for (let s = 0; s < 3; s++) {
        const g = ctx.createRadialGradient(Math.random() * w, Math.random() * h, 4, Math.random() * w, Math.random() * h, 120)
        g.addColorStop(0, 'rgba(20,15,30,0.42)')
        g.addColorStop(1, 'rgba(20,15,30,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
      const skirt = ctx.createLinearGradient(0, h * 0.82, 0, h)
      skirt.addColorStop(0, 'rgba(0,0,0,0)')
      skirt.addColorStop(1, 'rgba(0,0,0,0.55)')
      ctx.fillStyle = skirt
      ctx.fillRect(0, h * 0.82, w, h * 0.18)
      ctx.globalCompositeOperation = 'source-over'
    },
    { repeat: [2, 1] },
  )
}

/** Paint with the substrate showing through at the edges. */
export function chippedTexture(key, paint, substrate) {
  return makeCanvasTexture(`chip-${key}`, 256, 256, (ctx, w, h) => {
    ctx.fillStyle = hex(paint)
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = hex(substrate)
    for (let i = 0; i < 46; i++) {
      // chips cluster at two edges — they happen where things get knocked
      const edge = Math.random() < 0.7
      const cx = edge ? (Math.random() < 0.5 ? Math.random() * 26 : w - Math.random() * 26) : Math.random() * w
      const cy = edge ? Math.random() * h : Math.random() < 0.5 ? Math.random() * 26 : h - Math.random() * 26
      const r = 2 + Math.random() * 7
      ctx.beginPath()
      for (let p = 0; p < 6; p++) {
        const a = (p / 6) * Math.PI * 2
        const rr = r * (0.55 + Math.random() * 0.75)
        const x = cx + Math.cos(a) * rr
        const y = cy + Math.sin(a) * rr
        p === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
    }
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.05})`
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
    }
  })
}

/** Warning labels, barcodes and taped notes, for planes stuck onto things. */
export function decalTexture() {
  return makeCanvasTexture('decals', 512, 512, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    const inks = ['#e040fb', '#38e8ff', '#ffb23f', '#c4bcd0']
    for (let i = 0; i < 9; i++) {
      const x = 20 + Math.random() * (w - 140)
      const y = 20 + Math.random() * (h - 90)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((Math.random() - 0.5) * 0.22)
      ctx.fillStyle = 'rgba(28,24,38,0.92)'
      const bw = 70 + Math.random() * 60
      const bh = 34 + Math.random() * 30
      ctx.fillRect(0, 0, bw, bh)
      ctx.strokeStyle = inks[i % inks.length]
      ctx.lineWidth = 1.4
      ctx.strokeRect(1, 1, bw - 2, bh - 2)
      ctx.fillStyle = inks[i % inks.length]
      // fake glyph runs and a barcode
      let cx = 6
      while (cx < bw - 10) {
        const gw = 1 + Math.random() * 4
        ctx.fillRect(cx, 6, gw, 9)
        cx += gw + 2
      }
      cx = 6
      while (cx < bw - 10) {
        const gw = 1 + Math.random() * 3
        ctx.globalAlpha = 0.6
        ctx.fillRect(cx, bh - 14, gw, 8)
        ctx.globalAlpha = 1
        cx += gw + 3
      }
      ctx.restore()
    }
  })
}

/** The soft radial dot every glow sprite and dust mote shares. */
export function glowTexture() {
  return makeCanvasTexture('glow', 128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0.0, 'rgba(255,255,255,1)')
    g.addColorStop(0.12, 'rgba(255,255,255,0.62)')
    g.addColorStop(0.3, 'rgba(255,255,255,0.2)')
    g.addColorStop(0.58, 'rgba(255,255,255,0.05)')
    g.addColorStop(1.0, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
  })
}

// --- material bench ---------------------------------------------------------

const matCache = new Map()
const cached = (key, make) => {
  if (!matCache.has(key)) matCache.set(key, make())
  return matCache.get(key)
}

export const MAT = {
  concrete: () =>
    cached('concrete', () =>
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: concreteTexture(),
        roughnessMap: grimeTexture(),
        roughness: 0.94,
        metalness: 0,
        vertexColors: true,
      }),
    ),

  plaster: (color = PALETTE.wall) =>
    cached(`plaster-${color}`, () =>
      new THREE.MeshStandardMaterial({
        color,
        roughnessMap: grimeTexture(),
        roughness: 0.96,
        metalness: 0,
        vertexColors: true,
      }),
    ),

  paint: (color = PALETTE.greyMetal, { rough = 0.55, metal = 0.35, chipped = false, substrate = PALETTE.aluminium } = {}) =>
    cached(`paint-${color}-${rough}-${metal}-${chipped}`, () =>
      new THREE.MeshStandardMaterial({
        color: chipped ? 0xffffff : color,
        map: chipped ? chippedTexture(String(color), color, substrate) : null,
        roughnessMap: grimeTexture(),
        roughness: rough,
        metalness: metal,
        vertexColors: true,
      }),
    ),

  plastic: (color = PALETTE.plastic, rough = 0.62) =>
    cached(`plastic-${color}-${rough}`, () =>
      new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, vertexColors: true }),
    ),

  rubber: (color = PALETTE.wallDark) =>
    cached(`rubber-${color}`, () =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, vertexColors: true }),
    ),

  metal: (color = PALETTE.aluminium, rough = 0.42) =>
    cached(`metal-${color}-${rough}`, () =>
      new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0.9, vertexColors: true }),
    ),

  wood: (color = PALETTE.plywood) =>
    cached(`wood-${color}`, () =>
      new THREE.MeshStandardMaterial({ color, roughnessMap: grimeTexture(), roughness: 0.82, metalness: 0, vertexColors: true }),
    ),

  card: () =>
    cached('card', () =>
      new THREE.MeshStandardMaterial({ color: PALETTE.cardboard, roughness: 0.96, metalness: 0, vertexColors: true }),
    ),

  cloth: (color = PALETTE.fabric) =>
    cached(`cloth-${color}`, () => new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0, vertexColors: true })),

  leaf: () =>
    cached('leaf', () =>
      new THREE.MeshStandardMaterial({ color: PALETTE.leaf, roughness: 0.7, metalness: 0, side: THREE.DoubleSide, vertexColors: true }),
    ),

  glass: (color = 0x0a0810, opacity = 0.22) =>
    cached(`glass-${color}-${opacity}`, () =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.06, metalness: 0, transparent: true, opacity }),
    ),

  /** Unlit and hot. Sprites do the blooming; this is just the source. */
  emissive: (color, intensity = 1) =>
    cached(`emissive-${color}-${intensity}`, () => {
      const c = new THREE.Color(color)
      if (intensity !== 1) c.multiplyScalar(intensity)
      return new THREE.MeshBasicMaterial({ color: c, toneMapped: true, fog: false })
    }),

  /** A lit surface that also glows a little — LEDs seen up close, board pads. */
  glowStandard: (color, emissiveIntensity = 2.4) =>
    cached(`glowstd-${color}-${emissiveIntensity}`, () =>
      new THREE.MeshStandardMaterial({
        color: 0x111018,
        emissive: color,
        emissiveIntensity,
        roughness: 0.4,
        metalness: 0,
      }),
    ),
}

// --- fake bloom -------------------------------------------------------------

/**
 * Three stacked additive sprites: a hot core, a mid falloff, and a wide halo
 * that ignores depth so it bleeds over whatever is in front of it — which is
 * what real bloom does and what makes it read.
 */
export function glowSprite(color, size, { core = 0.85, mid = 0.3, halo = 0.1, streak = 0 } = {}) {
  const group = new THREE.Group()
  const tex = glowTexture()
  const layers = [
    [size * 1.6, core, true],
    [size * 4.5, mid, true],
    [size * 13, halo, false],
  ]
  for (const [s, opacity, depthTest] of layers) {
    const m = new THREE.SpriteMaterial({
      map: tex,
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest,
      fog: false,
    })
    const sp = new THREE.Sprite(m)
    sp.scale.set(s, s, 1)
    sp.renderOrder = 999
    group.add(sp)
  }
  if (streak > 0) {
    const m = new THREE.SpriteMaterial({
      map: tex,
      color,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      fog: false,
    })
    const sp = new THREE.Sprite(m)
    sp.scale.set(streak, size * 1.4, 1)
    sp.renderOrder = 1000
    group.add(sp)
  }
  group.traverse((o) => {
    if (!o.isSprite) return
    o.material.userData.base = o.material.opacity
    // Sprites are raycast targets, and the halo layer is thirteen times the
    // emitter's size. Left alone, a 2mm LED hands its prop a hover box that
    // reaches out over empty desk. No glow in this room is ever the thing you
    // are meant to be clicking, so none of them answer the ray.
    o.raycast = () => {}
  })
  group.userData.setIntensity = (k) => {
    group.traverse((o) => {
      if (o.isSprite) o.material.opacity = o.material.userData.base * k
    })
  }
  return group
}

// --- dirt -------------------------------------------------------------------

/** Every mesh in the room needs a colour attribute for the dirt passes. */
export function ensureColors(geometry) {
  if (!geometry.attributes.color) {
    const count = geometry.attributes.position.count
    const arr = new Float32Array(count * 3).fill(1)
    geometry.setAttribute('color', new THREE.BufferAttribute(arr, 3))
  }
  return geometry
}

const _v = new THREE.Vector3()

/**
 * Darken vertices that sit near a contact plane. Cheaper and better looking
 * than SSAO at this scale, and it is what stops a pile of primitives from
 * reading as a pile of primitives.
 */
export function contactDarken(mesh, planes, { radius = 0.1, floor = 0.42 } = {}) {
  const geo = ensureColors(mesh.geometry)
  const pos = geo.attributes.position
  const col = geo.attributes.color
  mesh.updateWorldMatrix(true, false)
  for (let i = 0; i < pos.count; i++) {
    _v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld)
    let d = Infinity
    for (const p of planes) d = Math.min(d, Math.abs(p.distanceToPoint(_v)))
    const k = floor + (1 - floor) * clamp01(THREE.MathUtils.smoothstep(d, 0, radius))
    col.setXYZ(i, col.getX(i) * k, col.getY(i) * k, col.getZ(i) * k)
  }
  col.needsUpdate = true
  return mesh
}

/**
 * Per-face edge darkening. Softens the hard silhouette of box primitives and
 * reads as accumulated dust in the seams. Requires non-indexed geometry.
 */
export function edgeDirt(geometry, amount = 0.18) {
  const geo = geometry.index ? geometry.toNonIndexed() : geometry
  ensureColors(geo)
  const pos = geo.attributes.position
  const col = geo.attributes.color
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const centroid = new THREE.Vector3()
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i)
    b.fromBufferAttribute(pos, i + 1)
    c.fromBufferAttribute(pos, i + 2)
    centroid.copy(a).add(b).add(c).divideScalar(3)
    const maxD = Math.max(a.distanceTo(centroid), b.distanceTo(centroid), c.distanceTo(centroid)) || 1
    for (let j = 0; j < 3; j++) {
      _v.fromBufferAttribute(pos, i + j)
      const k = 1 - amount * clamp01(_v.distanceTo(centroid) / maxD)
      col.setXYZ(i + j, col.getX(i + j) * k, col.getY(i + j) * k, col.getZ(i + j) * k)
    }
  }
  col.needsUpdate = true
  return geo
}

/** Tint every vertex of a geometry (before the dirt passes run). */
export function tintGeometry(geometry, color, jitter = 0) {
  ensureColors(geometry)
  const col = geometry.attributes.color
  const c = new THREE.Color(color)
  for (let i = 0; i < col.count; i++) {
    const j = 1 + (Math.random() - 0.5) * jitter
    col.setXYZ(i, c.r * j, c.g * j, c.b * j)
  }
  col.needsUpdate = true
  return geometry
}

// --- little builders every prop module wants --------------------------------

/** A box that already has vertex colours and edge dirt baked in. */
export function box(w, h, d, material, { dirt = 0.18, tint = null } = {}) {
  let geo = new THREE.BoxGeometry(w, h, d)
  if (tint !== null) tintGeometry(geo, tint)
  geo = edgeDirt(geo, dirt)
  const mesh = new THREE.Mesh(geo, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

export function cyl(rTop, rBottom, h, material, segments = 16, { open = false } = {}) {
  const geo = ensureColors(new THREE.CylinderGeometry(rTop, rBottom, h, segments, 1, open))
  const mesh = new THREE.Mesh(geo, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

/** A cable. Never a right angle, always a little slack. */
export function cable(points, { radius = 0.006, color = PALETTE.wallDark, segments = 40, material = null } = {}) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p))))
  const geo = ensureColors(new THREE.TubeGeometry(curve, segments, radius, 8, false))
  const mesh = new THREE.Mesh(geo, material ?? MAT.rubber(color))
  mesh.castShadow = true
  return mesh
}

/** Nothing in a lived-in room is axis-aligned except the architecture. */
export function jitter(obj, y = 0.05, xz = 0.02) {
  obj.rotation.y += (Math.random() - 0.5) * 2 * y
  obj.rotation.x += (Math.random() - 0.5) * 2 * xz
  obj.rotation.z += (Math.random() - 0.5) * 2 * xz
  return obj
}

export function disposeAll(root) {
  root.traverse((o) => {
    if (o.geometry) o.geometry.dispose()
    if (o.material) {
      const list = Array.isArray(o.material) ? o.material : [o.material]
      for (const m of list) {
        for (const key of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[key]?.dispose?.()
        m.dispose()
      }
    }
  })
  matCache.clear()
  texCache.clear()
}
