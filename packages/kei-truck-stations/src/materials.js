import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Materials
//
// Everything here is procedural — no image files, so the built app is a couple
// of hundred KB and works offline. Most surfaces are flat MeshStandardMaterials
// with roughness and metalness chosen to sit right under the scene's lighting;
// only the handful that read as *texture* at conversation distance (asphalt,
// plywood edge grain, canvas weave, tyre rubber, the bed floor's ribbed steel)
// get a generated map.
//
// Materials are memoised and shared. Anything that needs its own tiling clones
// the texture — cheap, since a clone shares the underlying canvas.
// ---------------------------------------------------------------------------

const cache = new Map()

function canvas(size = 256) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  return c
}

function tex(c, { repeat = [1, 1], srgb = false } = {}) {
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat[0], repeat[1])
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Value noise on a canvas — the one primitive every texture below is built on. */
function fillNoise(ctx, size, { octaves = 4, base = 128, amp = 40, seed = 1 } = {}) {
  const img = ctx.createImageData(size, size)
  const d = img.data
  let s = seed
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
  // Pre-roll a few lattices, coarse to fine, and sample each bilinearly.
  const lattices = []
  for (let o = 0; o < octaves; o++) {
    const n = 2 << o
    const grid = new Float32Array(n * n)
    for (let i = 0; i < grid.length; i++) grid[i] = rnd()
    lattices.push({ n, grid })
  }
  const sample = ({ n, grid }, u, v) => {
    const x = u * n
    const y = v * n
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = x - x0
    const fy = y - y0
    const sx = fx * fx * (3 - 2 * fx)
    const sy = fy * fy * (3 - 2 * fy)
    const at = (i, j) => grid[(((j % n) + n) % n) * n + (((i % n) + n) % n)]
    const a = at(x0, y0) * (1 - sx) + at(x0 + 1, y0) * sx
    const b = at(x0, y0 + 1) * (1 - sx) + at(x0 + 1, y0 + 1) * sx
    return a * (1 - sy) + b * sy
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size
      const v = y / size
      let acc = 0
      let w = 0
      for (let o = 0; o < octaves; o++) {
        const k = 1 / (o + 1)
        acc += sample(lattices[o], u, v) * k
        w += k
      }
      const val = base + (acc / w - 0.5) * 2 * amp
      const i = (y * size + x) * 4
      d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, val))
      d[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}

function memo(key, make) {
  if (!cache.has(key)) cache.set(key, make())
  return cache.get(key)
}

// --- generated maps ---------------------------------------------------------

export function asphaltMaps() {
  return memo('asphalt', () => {
    const size = 512
    const c = canvas(size)
    const ctx = c.getContext('2d')
    fillNoise(ctx, size, { octaves: 6, base: 74, amp: 26, seed: 7 })
    // Aggregate: scatter light chips so it reads as tarmac, not grey fog.
    for (let i = 0; i < 2600; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 0.5 + Math.random() * 1.8
      ctx.fillStyle = `rgba(${140 + Math.random() * 70},${138 + Math.random() * 66},${132 + Math.random() * 60},${0.14 + Math.random() * 0.3})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    // Colour only. Feeding this canvas in as a roughnessMap turns the lot into a
    // mirror — the noise is dark, and dark in a roughness map means glossy.
    return { map: tex(c, { repeat: [26, 26], srgb: true }) }
  })
}

export function plywoodMap() {
  return memo('ply', () => {
    const size = 256
    const c = canvas(size)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#c8a271'
    ctx.fillRect(0, 0, size, size)
    // Birch ply: long, low-contrast, slightly wandering grain.
    for (let i = 0; i < 220; i++) {
      const y = Math.random() * size
      const dark = Math.random() < 0.35
      ctx.strokeStyle = dark
        ? `rgba(120,86,52,${0.06 + Math.random() * 0.13})`
        : `rgba(233,205,166,${0.05 + Math.random() * 0.12})`
      ctx.lineWidth = 0.6 + Math.random() * 2.6
      ctx.beginPath()
      ctx.moveTo(0, y)
      for (let x = 0; x <= size; x += 16) {
        ctx.lineTo(x, y + Math.sin((x / size) * Math.PI * (1 + Math.random() * 2)) * 2.2)
      }
      ctx.stroke()
    }
    return tex(c, { repeat: [1, 1], srgb: true })
  })
}

export function canvasWeaveMap() {
  return memo('weave', () => {
    const size = 128
    const c = canvas(size)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = 'rgba(0,0,0,0.10)'
    ctx.lineWidth = 1
    for (let i = 0; i < size; i += 4) {
      ctx.beginPath()
      ctx.moveTo(i + 0.5, 0)
      ctx.lineTo(i + 0.5, size)
      ctx.moveTo(0, i + 0.5)
      ctx.lineTo(size, i + 0.5)
      ctx.stroke()
    }
    return tex(c, { repeat: [10, 10], srgb: true })
  })
}

export function treadMap() {
  return memo('tread', () => {
    const size = 256
    const c = canvas(size)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#2b2b2e'
    ctx.fillRect(0, 0, size, size)
    // A kei truck runs 145R12 6PR light-truck rubber: a plain, blocky,
    // load-rated highway tread with straight circumferential ribs.
    ctx.fillStyle = '#191a1c'
    for (let i = 0; i < 5; i++) {
      const x = 18 + i * 46
      ctx.fillRect(x, 0, 9, size)
    }
    ctx.fillStyle = 'rgba(0,0,0,0.42)'
    for (let y = 0; y < size; y += 16) ctx.fillRect(0, y, size, 4)
    return tex(c, { repeat: [1, 12], srgb: true })
  })
}

/** The ribbed steel of the cargo deck — pressed longitudinal swages. */
export function deckMaps() {
  return memo('deck', () => {
    const size = 256
    const c = canvas(size)
    const ctx = c.getContext('2d')
    fillNoise(ctx, size, { octaves: 5, base: 150, amp: 12, seed: 21 })
    // Swages every ~110 mm across the deck, drawn as bright/dark pairs so the
    // normal-free surface still reads as corrugated under a grazing light.
    for (let i = 0; i < 8; i++) {
      const x = i * 32
      const g = ctx.createLinearGradient(x, 0, x + 32, 0)
      g.addColorStop(0, 'rgba(255,255,255,0.16)')
      g.addColorStop(0.5, 'rgba(0,0,0,0.0)')
      g.addColorStop(1, 'rgba(0,0,0,0.20)')
      ctx.fillStyle = g
      ctx.fillRect(x, 0, 32, size)
    }
    return { map: tex(c, { repeat: [3, 4], srgb: true }) }
  })
}

/** Washi paper for lanterns and shoji: warm, blotchy, fibrous. */
export function washiMap() {
  return memo('washi', () => {
    const size = 256
    const c = canvas(size)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#fff2d8'
    ctx.fillRect(0, 0, size, size)
    for (let i = 0; i < 700; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const len = 3 + Math.random() * 22
      const a = Math.random() * Math.PI
      ctx.strokeStyle = `rgba(214,186,144,${0.05 + Math.random() * 0.14})`
      ctx.lineWidth = 0.5 + Math.random()
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
      ctx.stroke()
    }
    return tex(c, { repeat: [1, 1], srgb: true })
  })
}

// --- the library ------------------------------------------------------------

let LIB = null

/**
 * Every material in the scene, keyed. Built once, on first call.
 *
 * The truck is finished in Suzuki's "Superior White" — the colour something
 * like four out of five working kei trucks actually wear — over black plastic
 * bumper trim and unpainted galvanised bed hardware. The modules are
 * deliberately a different family: mill-finish aluminium extrusion and birch
 * ply, the palette of things that get built in a workshop and bolted on.
 */
export function materials() {
  if (LIB) return LIB

  const std = (o) => new THREE.MeshStandardMaterial(o)
  const asphalt = asphaltMaps()
  const deck = deckMaps()

  LIB = {
    // --- truck ---
    paint: std({ color: 0xf2f3f2, roughness: 0.36, metalness: 0.06 }),
    paintDark: std({ color: 0xd8dbdd, roughness: 0.42, metalness: 0.06 }),
    bumper: std({ color: 0x2f3134, roughness: 0.78, metalness: 0.0 }),
    trim: std({ color: 0x1c1d20, roughness: 0.6, metalness: 0.1 }),
    chrome: std({ color: 0xd6d9dd, roughness: 0.18, metalness: 0.95 }),
    // Dark tinted glass rather than a transmissive material. Transmission needs
    // a scene render behind it and, without one, washes out to near-white — which
    // is exactly what a windscreen must not do. A dark, near-mirror standard
    // material picks up the environment map and reads correctly at dusk.
    glass: std({
      color: 0x0a1017,
      roughness: 0.14,
      metalness: 0.1,
      envMapIntensity: 0.45, // a full-strength sky reflection turns the
      //                        windscreen into a white card and hides the cab
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    }),
    headlamp: std({ color: 0xdfe6ee, roughness: 0.12, metalness: 0.2, emissive: 0x8fa6c0, emissiveIntensity: 0.35 }),
    lampRed: std({ color: 0x7d1419, roughness: 0.3, emissive: 0xc02028, emissiveIntensity: 0.5 }),
    lampAmber: std({ color: 0x8a5406, roughness: 0.35, emissive: 0xd07f12, emissiveIntensity: 0.3 }),
    tire: std({ color: 0x232427, roughness: 0.94, metalness: 0.0, map: treadMap() }),
    wheel: std({ color: 0xb9bcc0, roughness: 0.42, metalness: 0.7 }),
    hubcap: std({ color: 0xcfd3d7, roughness: 0.3, metalness: 0.8 }),
    deckSteel: std({ color: 0xb8bcc0, roughness: 0.55, metalness: 0.62, ...deck }),
    frame: std({ color: 0x3a3d42, roughness: 0.72, metalness: 0.5 }),
    galv: std({ color: 0x9ea4ab, roughness: 0.5, metalness: 0.68 }),

    // --- module structure ---
    alu: std({ color: 0xa9aeb4, roughness: 0.38, metalness: 0.82 }),
    aluDark: std({ color: 0x5a6068, roughness: 0.44, metalness: 0.78 }),
    ply: std({ color: 0xffffff, roughness: 0.72, metalness: 0.0, map: plywoodMap() }),
    plyEdge: std({ color: 0xd9b586, roughness: 0.8 }),
    rubberFoot: std({ color: 0x1a1a1c, roughness: 0.95 }),
    steelRod: std({ color: 0x8e949b, roughness: 0.3, metalness: 0.9 }),
    hinge: std({ color: 0x74797f, roughness: 0.34, metalness: 0.88 }),

    // --- soft goods ---
    canvasCream: std({
      color: 0xece2cf,
      roughness: 0.92,
      metalness: 0,
      map: canvasWeaveMap(),
      side: THREE.DoubleSide,
    }),
    canvasIndigo: std({
      color: 0x1f3550,
      roughness: 0.9,
      metalness: 0,
      map: canvasWeaveMap(),
      side: THREE.DoubleSide,
    }),
    noren: std({ color: 0x16263a, roughness: 0.94, side: THREE.DoubleSide }),

    // --- shrine ---
    vermilion: std({ color: 0xc4342a, roughness: 0.42, metalness: 0.04 }),
    vermilionDeep: std({ color: 0x8e241d, roughness: 0.5 }),
    hinoki: std({ color: 0xd8c39c, roughness: 0.68, map: plywoodMap() }),
    copperRoof: std({ color: 0x4f8f7d, roughness: 0.62, metalness: 0.35 }),
    copperTrim: std({ color: 0xb87333, roughness: 0.36, metalness: 0.85 }),
    gold: std({ color: 0xd9a441, roughness: 0.26, metalness: 0.95 }),
    washi: std({
      color: 0xffffff,
      map: washiMap(),
      roughness: 0.9,
      emissive: 0xffcf82,
      emissiveIntensity: 0.9,
      side: THREE.DoubleSide,
    }),
    rope: std({ color: 0xe4dcc4, roughness: 0.95 }),

    // --- kit ---
    speakerBox: std({ color: 0x18191c, roughness: 0.86 }),
    speakerGrille: std({ color: 0x2a2c30, roughness: 0.5, metalness: 0.6 }),
    ledCyan: std({ color: 0x0a1418, emissive: 0x33e0ff, emissiveIntensity: 2.4, roughness: 0.4 }),
    ledMagenta: std({ color: 0x18080f, emissive: 0xff3cae, emissiveIntensity: 2.2, roughness: 0.4 }),
    ledWarm: std({ color: 0x1a1408, emissive: 0xffb347, emissiveIntensity: 2.0, roughness: 0.4 }),
    stainless: std({ color: 0xc3c8cd, roughness: 0.24, metalness: 0.94 }),
    griddle: std({ color: 0x2c2b28, roughness: 0.55, metalness: 0.4 }),

    // --- world ---
    asphalt: std({ color: 0xb0b2b6, roughness: 0.97, metalness: 0.0, ...asphalt }),
  }

  // Materials the engineering overlay swaps in. Kept beside the rest so nothing
  // else has to know how the x-ray view is drawn.
  LIB.ghost = new THREE.MeshStandardMaterial({
    color: 0x7fd4ff,
    roughness: 0.9,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
  })
  LIB.hullWire = new THREE.LineBasicMaterial({ color: 0x46e0a0, transparent: true, opacity: 0.55 })
  LIB.hullWireBad = new THREE.LineBasicMaterial({ color: 0xff4d6d, transparent: true, opacity: 0.95 })
  LIB.axisWire = new THREE.LineBasicMaterial({ color: 0xffc857, transparent: true, opacity: 0.9 })
  LIB.sweepWire = new THREE.LineBasicMaterial({ color: 0xffc857, transparent: true, opacity: 0.3 })
  LIB.supportWire = new THREE.LineBasicMaterial({ color: 0x7fd4ff, transparent: true, opacity: 0.85 })

  return LIB
}

/** Swap every material a subtree uses for the ghost, remembering the originals. */
export function setGhosted(root, on, lib) {
  root.traverse((o) => {
    if (!o.isMesh) return
    if (on) {
      if (!o.userData._mat) o.userData._mat = o.material
      o.material = lib.ghost
    } else if (o.userData._mat) {
      o.material = o.userData._mat
    }
  })
}
