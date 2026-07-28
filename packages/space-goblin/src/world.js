import * as THREE from 'three'
import { fbm2, noise2, tileFbm2, makeRng, smoothstep } from './noise.js'
import { scrollZ } from './convention.js'
import * as TEX from './textures.js'

// The alien flat the goblin runs across. Nothing here is an asset: the ground,
// the sky gradient, the stars, the gas giant and every prop are generated from
// `noise.js` at load time.
//
// The runner never moves — he sprints in place at the origin and the WORLD
// slides past him (endless-runner treadmill).
//
// The world travels along BACKWARD (-Z) while he runs along FORWARD (+Z) — see
// `convention.js`. Every sign in this file derives from that one fact; none of
// them is independently tunable. The first version got this backwards: the
// signs here were picked one at a time until each subsystem looked plausible on
// its own, they all agreed with each other and all disagreed with the
// character, and the goblin moonwalked. Hence `scrollZ()` rather than a bare
// `-` anywhere below.
//
// Everything is written around one number, `dist`, the total metres travelled:
//
//   • the ground is a geometry clipmap — the mesh stays put and its height
//     samples shift by whole grid rows, so per-frame cost is ~zero and the
//     terrain never visibly repeats,
//   • props live on a Z band and wrap modulo its length,
//   • the sky/planet are drawn depth-independently at a small radius, so they
//     work no matter what near/far planes the app picks.

// ---------------------------------------------------------------------------
// Layout — all distances in metres
// ---------------------------------------------------------------------------
const GROUND_W = 200 // x extent; must out-reach the camera's horizontal fov
const GROUND_D = 175 // z extent
const GROUND_NX = 50
const GROUND_NZ = 50
const GROUND_Z0 = -150 // far edge; near edge lands just behind the camera
const GX0 = -GROUND_W / 2
const DX = GROUND_W / GROUND_NX
const DZ = GROUND_D / GROUND_NZ
const SX = GROUND_NX + 1 // grid row stride
const GROUND_REPEAT = 64

const BAND = 130 // props wrap over this many metres of z…
const BAND_AHEAD = 110 // …spanning [-110, +20]: travelling -Z, they enter behind
//                        the camera and recycle at the far edge, deep in the fog

// The gas giant sits low and slightly right of the camera's forward azimuth.
const PLANET_DIR = new THREE.Vector3(-0.42, 0.055, -0.9).normalize()
const PLANET_DIST = 40
const PLANET_R = 6.6
// Its star is off to the left, roughly where the amber key comes from — which
// puts the terminator across the disc rather than leaving it flatly full.
const PLANET_LIGHT = new THREE.Vector3(-0.8, 0.4, -0.1).normalize()

const SKY_R = 40 // dome radius — small on purpose, see note above
const STAR_R = 36

const COLOR_HORIZON = '#120a20'
const COLOR_ZENITH = '#05030b'
const COLOR_HAZE = '#3a1f2e'
const COLOR_FOG = '#2b1b33'
const COLOR_CYAN = '#48e8ff'
const FOG_DENSITY = 0.0235

const MAX_MONOLITH = 56
const MAX_RUBBLE = 320
const MAX_PYLON = 34
const MAX_DUST = 1200
const STAR_COUNT = 2500

// ---------------------------------------------------------------------------
// Terrain height — ONE function, shared by the mesh and by `groundHeightAt`
// ---------------------------------------------------------------------------
/** Height of the terrain at a point in *terrain* space (pre-scroll). */
function terrainH(x, z) {
  // Long swells plus one fine ripple. Amplitude is deliberately tiny (~0.3m
  // over ~50m wavelengths) so the runner still reads as level and his foot IK
  // never has to reach far.
  const swell = fbm2(x * 0.017 + 11.3, z * 0.017 - 4.1, 4) - 0.5
  const ripple = noise2(x * 0.085 - 3.0, z * 0.085 + 7.5) - 0.5
  return swell * 0.6 + ripple * 0.08
}

// ---------------------------------------------------------------------------
// textures.js guard — it is authored in parallel, so never trust a maker
// ---------------------------------------------------------------------------
/** Call a textures.js maker; on any failure fall back to "no maps at all". */
function safe(name, opts) {
  try {
    return TEX[name]?.(opts) || {}
  } catch (err) {
    console.warn(`[world] ${name} unavailable, falling back to flat colour`, err)
    return {}
  }
}

// ---------------------------------------------------------------------------
// Canvas helpers
// ---------------------------------------------------------------------------
function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

const srgb = (r, g, b) => `rgb(${r | 0},${g | 0},${b | 0})`

/**
 * Banded gas-giant albedo. Bands are a phase-noised sine in latitude, warped
 * along longitude by fbm so they shear and curl like real belts; the noise is
 * TILING in u so the sphere has no visible seam as it spins.
 */
function makeGasGiantTexture(size = 512) {
  const w = size
  const h = size >> 1
  const P = 8 // tiling period of the warp noise across the full wrap
  // amber / rust / cream ramp, sampled by band value
  const stops = [
    [0.0, [58, 32, 30]],
    [0.22, [124, 66, 42]],
    [0.44, [196, 122, 62]],
    [0.66, [226, 174, 110]],
    [0.85, [242, 219, 184]],
    [1.0, [250, 240, 220]],
  ]
  const ramp = (t) => {
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i][0] || i === stops.length - 1) {
        const [a, ca] = stops[i - 1]
        const [b, cb] = stops[i]
        const k = smoothstep(a, b, t)
        return [ca[0] + (cb[0] - ca[0]) * k, ca[1] + (cb[1] - ca[1]) * k, ca[2] + (cb[2] - ca[2]) * k]
      }
    }
    return stops[0][1]
  }
  return canvasTexture(w, h, (ctx) => {
    const img = ctx.createImageData(w, h)
    const d = img.data
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1)
      const lat = v * 2 - 1 // -1 pole .. +1 pole
      const eq = 1 - lat * lat // belts shear hardest at the equator
      for (let x = 0; x < w; x++) {
        const u = x / w
        // Shear the latitude coordinate along longitude — this is what turns
        // flat stripes into curling belts.
        const warp = (tileFbm2(u * P, v * P * 0.5 + 3.0, P, 4) - 0.5) * 1.15 * eq
        const l = lat + warp * 0.16
        // Bands: a high-frequency sine in latitude, its phase jittered so the
        // belt widths are irregular rather than a barcode.
        const jitter = (tileFbm2(u * P * 0.5 + 5.0, v * P * 2.0, P, 3) - 0.5) * 1.6
        let t = 0.5 + 0.5 * Math.sin(l * Math.PI * 8.5 + jitter)
        // Broad zonal brightness so the belts group into light/dark regions.
        t = t * 0.62 + (tileFbm2(u * P * 0.25 + 1.0, v * P * 0.75 + 9.0, P, 3) - 0.2) * 0.62
        t = t * 0.9 + 0.05
        t += (tileFbm2(u * P * 3.0 + 2.0, v * P * 3.0 + 4.0, P, 3) - 0.5) * 0.14 * eq
        // Poles cool to a dull grey-blue haze.
        const pole = smoothstep(0.62, 1.0, Math.abs(lat))
        let [r, g, b] = ramp(Math.max(0, Math.min(1, t)))
        r += (96 - r) * pole * 0.65
        g += (98 - g) * pole * 0.65
        b += (118 - b) * pole * 0.65
        const i = (y * w + x) * 4
        d[i] = r
        d[i + 1] = g
        d[i + 2] = b
        d[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)

    // A great storm oval, drawn on top with a swirl so it reads as a vortex.
    const cx = w * 0.63
    const cy = h * 0.62
    const rx = w * 0.085
    const ry = h * 0.075
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(rx, ry)
    for (let i = 10; i >= 0; i--) {
      const k = i / 10
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
      g.addColorStop(0, srgb(232, 116, 74))
      g.addColorStop(0.55, srgb(178, 74, 48))
      g.addColorStop(1, srgb(150, 92, 60))
      ctx.globalAlpha = 0.1
      ctx.beginPath()
      ctx.ellipse(0, 0, k, k, 0, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
    ctx.globalAlpha = 0.5
    ctx.strokeStyle = srgb(246, 214, 178)
    ctx.lineWidth = 0.06
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.ellipse(0, 0, 0.35 + i * 0.15, 0.28 + i * 0.14, i * 0.22, 0, Math.PI * 1.7)
      ctx.stroke()
    }
    ctx.restore()
  })
}

/** Radial band ramp for the planet's ring — RGBA, alpha carries the gaps. */
function makeRingTexture(size = 512) {
  return canvasTexture(size, 4, (ctx, w, h) => {
    const img = ctx.createImageData(w, h)
    const d = img.data
    for (let x = 0; x < w; x++) {
      const t = x / (w - 1)
      // Fine ringlets from stacked noise; a couple of hard division gaps.
      let a = 0.35 + 0.65 * fbm2(t * 26 + 4.5, 2.3, 4)
      a *= smoothstep(0.0, 0.08, t) * (1 - smoothstep(0.86, 1.0, t))
      a *= 1 - 0.92 * Math.exp(-Math.pow((t - 0.44) * 26, 2)) // Cassini-ish gap
      a *= 1 - 0.6 * Math.exp(-Math.pow((t - 0.72) * 34, 2))
      const shade = 0.62 + 0.38 * fbm2(t * 12 - 2.0, 8.1, 3)
      for (let y = 0; y < h; y++) {
        const i = (y * w + x) * 4
        d[i] = 206 * shade
        d[i + 1] = 190 * shade
        d[i + 2] = 186 * shade
        d[i + 3] = Math.max(0, Math.min(1, a)) * 105
      }
    }
    ctx.putImageData(img, 0, 0)
  })
}

/** Seamless blobby alpha for the ground mist sheets. */
function makeMistTexture(size = 256) {
  const P = 4
  return canvasTexture(size, size, (ctx, w, h) => {
    const img = ctx.createImageData(w, h)
    const d = img.data
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const n = tileFbm2((x / w) * P, (y / h) * P, P, 5)
        const a = smoothstep(0.44, 0.9, n)
        const i = (y * w + x) * 4
        d[i] = 226
        d[i + 1] = 198
        d[i + 2] = 224
        d[i + 3] = a * 255
      }
    }
    ctx.putImageData(img, 0, 0)
  })
}

// ---------------------------------------------------------------------------
// Prop geometry — low-poly shards knocked out of primitives with noise
// ---------------------------------------------------------------------------
/**
 * A snapped basalt column: a barely-tapered hexagonal prism sheared off at an
 * angle. Columnar jointing is the reason this shape exists in nature and it is
 * also what stops the props reading as traffic cones — the silhouette is a
 * broken shaft with a slanted top, not a spike.
 * Base sits at y=0, break plane at y≈1, footprint radius ~1.
 */
function makeShardGeometry(seed = 91) {
  const rng = makeRng(seed)
  const SIDES = 6
  const ys = [0, 0.24, 0.5, 0.74, 0.91, 1.0]
  const rad = [1.0, 0.97, 0.93, 0.88, 0.82, 0.72]
  const tiltX = 0.26
  const tiltZ = -0.15
  const verts = []
  const uvs = []
  let lean = 0
  let leanZ = 0
  for (let r = 0; r < ys.length; r++) {
    lean += (rng() - 0.5) * 0.1
    leanZ += (rng() - 0.5) * 0.1
    const last = r === ys.length - 1
    for (let s = 0; s < SIDES; s++) {
      const a = (s / SIDES) * Math.PI * 2
      // Corner radii jitter per (ring, corner) but stay correlated up the
      // column, so facets run as continuous planes rather than random noise.
      const k = rad[r] * (0.86 + 0.26 * noise2(Math.cos(a) * 2.1 + 4.0, Math.sin(a) * 2.1 + r * 0.35))
      const shear = last ? (Math.cos(a) * tiltX + Math.sin(a) * tiltZ) * k : 0
      verts.push(
        Math.cos(a) * k + lean * ys[r],
        ys[r] + shear + (rng() - 0.5) * 0.03,
        Math.sin(a) * k + leanZ * ys[r],
      )
      // Cylindrical uv so the shared rock normal map can break up the facets;
      // without it every flat face renders as one dead-flat tone.
      uvs.push(s / SIDES, ys[r])
    }
  }
  const cap = verts.length / 3
  verts.push(lean, 1.0, leanZ) // centre of the break plane
  uvs.push(0.5, 1)
  const idx = []
  for (let r = 0; r < ys.length - 1; r++) {
    for (let s = 0; s < SIDES; s++) {
      const a = r * SIDES + s
      const b = r * SIDES + ((s + 1) % SIDES)
      idx.push(a, a + SIDES, b, b, a + SIDES, b + SIDES)
    }
  }
  const top = (ys.length - 1) * SIDES
  for (let s = 0; s < SIDES; s++) idx.push(top + s, cap, top + ((s + 1) % SIDES))
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/** A lumpy pebble. */
function makeRubbleGeometry() {
  const geo = new THREE.IcosahedronGeometry(0.3, 0)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const k = 0.72 + 0.6 * noise2(x * 5 + 2, z * 5 - y * 3)
    pos.setXYZ(i, x * k, y * k * 0.8, z * k)
  }
  geo.computeVertexNormals()
  return geo
}

// ---------------------------------------------------------------------------
// Points material — one shader drives stars, dust and lamp haloes
// ---------------------------------------------------------------------------
const POINTS_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPix;
  uniform float uTwinkle;
  uniform float uAttenuate;
  uniform float uAttenScale;
  uniform float uFog;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 1.0 - uTwinkle * (0.5 + 0.5 * sin(uTime * (1.3 + aPhase * 2.7) + aPhase * 6.283));
    float atten = mix(1.0, uAttenScale / max(-mv.z, 0.1), uAttenuate);
    // Clamped, or a mote drifting past the lens balloons into a snowflake.
    gl_PointSize = min(aSize * uPix * atten * mix(1.0, tw, uTwinkle), 26.0 * uPix);
    // Additive points cannot use scene fog (it would ADD murk), so fade them
    // out by hand on the same exponential curve.
    float d = length(mv.xyz) * uFog;
    vAlpha = exp(-d * d) * mix(1.0, tw, uTwinkle);
    vColor = aColor;
    gl_Position = projectionMatrix * mv;
  }
`

const POINTS_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uIntensity;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float a = 1.0 - r;
    a *= a;
    gl_FragColor = vec4(vColor * (a * vAlpha * uIntensity), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

function makePointsMaterial({ pix = 1, twinkle = 0, attenuate = 0, attenScale = 22, fog = 0, intensity = 1 }) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPix: { value: pix },
      uTwinkle: { value: twinkle },
      uAttenuate: { value: attenuate },
      uAttenScale: { value: attenScale },
      uFog: { value: fog },
      uIntensity: { value: intensity },
    },
    vertexShader: POINTS_VERT,
    fragmentShader: POINTS_FRAG,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    // transparent:false keeps these in the OPAQUE pass, so renderOrder still
    // decides whether the ground can paint over them.
    transparent: false,
  })
}

// ---------------------------------------------------------------------------
// createWorld
// ---------------------------------------------------------------------------
/**
 * Build the environment and hand back a small driver the app ticks each frame.
 */
export function createWorld({ scene, renderer, quality = 1 } = {}) {
  const group = new THREE.Group()
  group.name = 'world'

  const junk = [] // everything that owns GPU memory, for dispose()
  const keep = (o) => {
    junk.push(o)
    return o
  }

  const rng = makeRng(20260727)
  const pix = renderer ? renderer.getPixelRatio() : 1
  const maxAniso = renderer?.capabilities?.getMaxAnisotropy?.() ?? 1

  let dist = 0 // total metres the world has scrolled
  let time = 0
  let q = quality

  const planetPos = PLANET_DIR.clone().multiplyScalar(PLANET_DIST)
  planetPos.y = 0.4 // sit the disc astride the horizon line

  // -------------------------------------------------------------------------
  // Atmosphere
  // -------------------------------------------------------------------------
  // Exponential fog in the same plum as the horizon, so props wash out into the
  // sky rather than popping out of a wall.
  if (scene) scene.fog = new THREE.FogExp2(COLOR_FOG, FOG_DENSITY)

  // -------------------------------------------------------------------------
  // Lighting
  // -------------------------------------------------------------------------
  // Tuned for ACESFilmic + sRGB output at ~1.05 exposure. The whole setting is
  // meant to sit a couple of stops under the character, so the key is modest
  // and most of the ground's read comes from the cold rim.
  const key = new THREE.DirectionalLight('#ffb672', 1.45)
  key.position.set(-6.5, 5.6, -5.2) // from the gas giant's quarter
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.near = 1
  key.shadow.camera.far = 22
  key.shadow.camera.left = -3.2
  key.shadow.camera.right = 3.2
  key.shadow.camera.top = 3.4
  key.shadow.camera.bottom = -3.0
  key.shadow.bias = -0.0006
  key.shadow.normalBias = 0.02
  key.shadow.radius = 3
  key.target.position.set(0, 0.9, 0)
  group.add(key, key.target)

  // Cold fill from the camera side (+Z), i.e. in *front* of him — he faces
  // FORWARD. Named "rim" from back when this file quietly assumed -Z was
  // forward; the warm key at -Z is what actually rims the silhouette against
  // the ground. Kept the name so callers reading `world.lights.rim` still work.
  const rim = new THREE.DirectionalLight('#7fe6ff', 0.85)
  rim.position.set(5.0, 1.9, 5.4)
  rim.target.position.set(0, 0.9, 0)
  group.add(rim, rim.target)

  const fill = new THREE.DirectionalLight('#b39ad6', 0.34)
  fill.position.set(-3.4, 2.6, 4.2)
  fill.target.position.set(0, 0.9, 0)
  group.add(fill, fill.target)

  const hemi = new THREE.HemisphereLight('#3a3350', '#231b2b', 0.34)
  group.add(hemi)

  // -------------------------------------------------------------------------
  // Sky dome
  // -------------------------------------------------------------------------
  // depthTest:false + a low renderOrder means the dome is painted first and
  // never writes depth, so it works under ANY camera near/far the app picks.
  const skyGeo = keep(new THREE.SphereGeometry(SKY_R, 48, 32))
  const skyMat = keep(
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uHorizon: { value: new THREE.Color(COLOR_HORIZON) },
        uZenith: { value: new THREE.Color(COLOR_ZENITH) },
        uHaze: { value: new THREE.Color(COLOR_HAZE) },
        uTo: { value: PLANET_DIR.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uHorizon, uZenith, uHaze, uTo;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float up = pow(clamp(d.y, 0.0, 1.0), 0.55);
          vec3 col = mix(uHorizon, uZenith, up);
          // Warm dust sitting on the horizon, banked up toward the gas giant.
          float band = exp(-pow(max(d.y, -0.06) * 6.5, 2.0));
          float toward = pow(clamp(dot(d, uTo) * 0.5 + 0.5, 0.0, 1.0), 7.0);
          col += uHaze * band * (0.30 + 1.35 * toward);
          col = mix(col, uHorizon * 0.5, smoothstep(0.0, -0.22, d.y));
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    }),
  )
  const sky = new THREE.Mesh(skyGeo, skyMat)
  sky.renderOrder = -40
  sky.frustumCulled = false
  group.add(sky)

  // -------------------------------------------------------------------------
  // Starfield
  // -------------------------------------------------------------------------
  const starGeo = keep(new THREE.BufferGeometry())
  {
    const p = new Float32Array(STAR_COUNT * 3)
    const c = new Float32Array(STAR_COUNT * 3)
    const s = new Float32Array(STAR_COUNT)
    const ph = new Float32Array(STAR_COUNT)
    const cool = new THREE.Color('#b9d4ff')
    const warm = new THREE.Color('#ffd2a1')
    const tmp = new THREE.Color()
    for (let i = 0; i < STAR_COUNT; i++) {
      // Uniform on the sphere, but skip the deep underside — the ground would
      // just paint over it anyway.
      const y = -0.12 + rng() * 1.12
      const r = Math.sqrt(Math.max(0, 1 - y * y))
      const a = rng() * Math.PI * 2
      p[i * 3] = Math.cos(a) * r * STAR_R
      p[i * 3 + 1] = y * STAR_R
      p[i * 3 + 2] = Math.sin(a) * r * STAR_R
      // Most stars are faint; a handful carry the composition.
      const bright = Math.pow(rng(), 3.1)
      s[i] = 0.9 + bright * 3.4
      tmp.copy(cool).lerp(warm, rng())
      const lum = 0.4 + bright * 0.75
      c[i * 3] = tmp.r * lum
      c[i * 3 + 1] = tmp.g * lum
      c[i * 3 + 2] = tmp.b * lum
      ph[i] = rng()
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(p, 3))
    starGeo.setAttribute('aColor', new THREE.BufferAttribute(c, 3))
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(s, 1))
    starGeo.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1))
  }
  const starMat = keep(makePointsMaterial({ pix, twinkle: 0.28, intensity: 1.9 }))
  starMat.depthTest = false
  const stars = new THREE.Points(starGeo, starMat)
  stars.renderOrder = -30
  stars.frustumCulled = false
  group.add(stars)

  // -------------------------------------------------------------------------
  // Gas giant (+ ring)
  // -------------------------------------------------------------------------
  const planetGroup = new THREE.Group()
  planetGroup.position.copy(planetPos)
  planetGroup.rotation.set(0.3, 0, 0.32) // axial tilt; the ring inherits it
  group.add(planetGroup)

  const planetTex = keep(makeGasGiantTexture(512))
  planetTex.wrapS = THREE.RepeatWrapping
  planetTex.wrapT = THREE.ClampToEdgeWrapping
  planetTex.colorSpace = THREE.NoColorSpace // decoded by hand in the shader
  planetTex.anisotropy = maxAniso

  const planetGeo = keep(new THREE.SphereGeometry(PLANET_R, 96, 64))
  const planetMat = keep(
    new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uMap: { value: planetTex },
        uSpin: { value: 0 },
        uLight: { value: PLANET_LIGHT.clone() },
        uAtmo: { value: new THREE.Color('#ffb98a') },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUvw;
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vUvw = uv;
          vN = normalize(mat3(modelMatrix) * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vW = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uSpin;
        uniform vec3 uLight;
        uniform vec3 uAtmo;
        varying vec2 vUvw;
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vec3 c = texture2D(uMap, vec2(vUvw.x + uSpin, vUvw.y)).rgb;
          c = mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
          vec3 n = normalize(vN);
          vec3 v = normalize(cameraPosition - vW);
          float lit = smoothstep(-0.88, 0.5, dot(n, uLight));
          float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.2);
          vec3 col = c * (0.02 + 0.62 * lit);
          col *= mix(1.0, 0.45, fres);                 // limb darkening
          col += uAtmo * fres * (0.03 + 0.42 * lit);   // thin atmosphere rim
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    }),
  )
  const planet = new THREE.Mesh(planetGeo, planetMat)
  planet.renderOrder = -20
  planet.frustumCulled = false
  planetGroup.add(planet)

  // A slightly larger additive shell. Without it the disc has a razor edge
  // against the sky and reads as a decal instead of a world with an atmosphere.
  const haloGeoP = keep(new THREE.SphereGeometry(PLANET_R * 1.05, 64, 40))
  const haloMatP = keep(
    new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      transparent: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uLight: { value: PLANET_LIGHT.clone() },
        uAtmo: { value: new THREE.Color('#ff9f6e') },
      },
      vertexShader: /* glsl */ `
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vN = normalize(mat3(modelMatrix) * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vW = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uLight, uAtmo;
        varying vec3 vN;
        varying vec3 vW;
        void main() {
          vec3 n = normalize(vN);
          float fres = pow(1.0 - clamp(dot(n, normalize(cameraPosition - vW)), 0.0, 1.0), 3.2);
          float lit = smoothstep(-0.95, 0.55, dot(n, uLight));
          gl_FragColor = vec4(uAtmo * fres * (0.02 + 0.26 * lit), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    }),
  )
  const planetHalo = new THREE.Mesh(haloGeoP, haloMatP)
  planetHalo.renderOrder = -15
  planetHalo.frustumCulled = false
  planetGroup.add(planetHalo)

  const ringTex = keep(makeRingTexture(512))
  ringTex.wrapS = THREE.ClampToEdgeWrapping
  ringTex.wrapT = THREE.ClampToEdgeWrapping
  ringTex.colorSpace = THREE.NoColorSpace
  const ringGeo = keep(new THREE.RingGeometry(PLANET_R * 1.4, PLANET_R * 2.02, 160, 1))
  ringGeo.rotateX(-Math.PI / 2)
  const ringMat = keep(
    new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      transparent: false, // stay in the opaque pass; renderOrder does the sorting
      blending: THREE.NormalBlending,
      uniforms: {
        uMap: { value: ringTex },
        uInner: { value: PLANET_R * 1.4 },
        uOuter: { value: PLANET_R * 2.02 },
        uCenter: { value: planetPos.clone() },
        uRadius: { value: PLANET_R },
        uLight: { value: PLANET_LIGHT.clone() },
      },
      vertexShader: /* glsl */ `
        varying float vR;
        varying vec3 vW;
        void main() {
          vR = length(position.xz);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vW = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uInner, uOuter, uRadius;
        uniform vec3 uCenter, uLight;
        varying float vR;
        varying vec3 vW;
        void main() {
          // Depth testing is off for the whole sky group, so occlusion by the
          // planet has to be done analytically: ray-vs-sphere against the disc.
          vec3 toC = uCenter - cameraPosition;
          vec3 rd = normalize(vW - cameraPosition);
          float tc = dot(toC, rd);
          float perp = length(toC - rd * tc);
          if (perp < uRadius) {
            float tHit = tc - sqrt(max(uRadius * uRadius - perp * perp, 0.0));
            if (length(vW - cameraPosition) > tHit) discard;
          }
          vec4 s = texture2D(uMap, vec2((vR - uInner) / (uOuter - uInner), 0.5));
          s.rgb = mix(s.rgb / 12.92, pow((s.rgb + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), s.rgb));
          // …and the planet's own shadow falls across the far side of the ring.
          vec3 q = vW - uCenter;
          float along = dot(q, uLight);
          float off = length(q - uLight * along);
          float shade = (along < 0.0 && off < uRadius) ? 0.18 : 1.0;
          gl_FragColor = vec4(s.rgb * shade * 0.52, s.a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
    }),
  )
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.renderOrder = -10
  ring.frustumCulled = false
  planetGroup.add(ring)

  // -------------------------------------------------------------------------
  // Ground — a geometry clipmap
  // -------------------------------------------------------------------------
  // The mesh never moves more than one grid cell: heights shift by whole rows
  // as `dist` crosses each cell, and the leftover fraction is applied as a
  // position offset. Per frame that costs nothing; per cell it costs one row.
  const H = new Float32Array(SX * (GROUND_NZ + 1))
  let rowK = 0 // how many whole rows the terrain has scrolled
  let meshZ = 0 // sub-cell remainder, applied to ground.position.z

  const groundGeo = keep(new THREE.BufferGeometry())
  {
    const n = SX * (GROUND_NZ + 1)
    const pos = new Float32Array(n * 3)
    const nor = new Float32Array(n * 3)
    const uv = new Float32Array(n * 2)
    const idx = new Uint32Array(GROUND_NX * GROUND_NZ * 6)
    let t = 0
    for (let j = 0; j <= GROUND_NZ; j++) {
      for (let i = 0; i <= GROUND_NX; i++) {
        const k = j * SX + i
        pos[k * 3] = GX0 + i * DX
        pos[k * 3 + 2] = GROUND_Z0 + j * DZ
        nor[k * 3 + 1] = 1
        uv[k * 2] = i / GROUND_NX
        uv[k * 2 + 1] = j / GROUND_NZ
        if (i < GROUND_NX && j < GROUND_NZ) {
          idx[t++] = k
          idx[t++] = k + SX
          idx[t++] = k + 1
          idx[t++] = k + 1
          idx[t++] = k + SX
          idx[t++] = k + SX + 1
        }
      }
    }
    groundGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    groundGeo.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
    groundGeo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    groundGeo.setIndex(new THREE.BufferAttribute(idx, 1))
    groundGeo.attributes.position.setUsage(THREE.DynamicDrawUsage)
    groundGeo.attributes.normal.setUsage(THREE.DynamicDrawUsage)
    groundGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, GROUND_Z0 + GROUND_D / 2), GROUND_D)
  }

  const rego = safe('makeRegolith', { size: 1024, seed: 23 })
  for (const t of [rego.map, rego.normalMap, rego.roughnessMap]) {
    if (!t) continue
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(GROUND_REPEAT, GROUND_REPEAT)
    t.anisotropy = maxAniso
    keep(t)
  }
  const groundMat = keep(
    new THREE.MeshStandardMaterial({
      color: rego.map ? '#57525f' : '#3b3043',
      map: rego.map || null,
      normalMap: rego.normalMap || null,
      roughnessMap: rego.roughnessMap || null,
      roughness: 0.94,
      metalness: 0.0,
    }),
  )
  if (groundMat.normalMap) groundMat.normalScale.set(1.15, 1.15)

  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.receiveShadow = true
  ground.frustumCulled = false
  group.add(ground)

  /**
   * Refill one grid row. Row 0 is still the far edge geometrically, but new
   * terrain now enters at the NEAR edge (row GROUND_NZ): the ground travels -Z
   * and rolls off the far end.
   *
   * The sample point inverts the scroll — a vertex whose world z is `w` has to
   * read terrain at `w + dist`, so that a fixed terrain feature comes out at
   * `worldZ = terrainZ - dist` and travels BACKWARD.
   */
  function fillRow(j) {
    const tz = GROUND_Z0 + j * DZ + rowK * DZ
    const base = j * SX
    for (let i = 0; i <= GROUND_NX; i++) H[base + i] = terrainH(GX0 + i * DX, tz)
  }

  /** Push the grid into the vertex buffers and rebuild normals from it. */
  function flushGround() {
    const pos = groundGeo.attributes.position.array
    const nor = groundGeo.attributes.normal.array
    for (let j = 0; j <= GROUND_NZ; j++) {
      const jm = j > 0 ? j - 1 : 0
      const jp = j < GROUND_NZ ? j + 1 : GROUND_NZ
      for (let i = 0; i <= GROUND_NX; i++) {
        const k = j * SX + i
        pos[k * 3 + 1] = H[k]
        const im = i > 0 ? i - 1 : 0
        const ip = i < GROUND_NX ? i + 1 : GROUND_NX
        const dhx = (H[j * SX + ip] - H[j * SX + im]) / ((ip - im) * DX)
        const dhz = (H[jp * SX + i] - H[jm * SX + i]) / ((jp - jm) * DZ)
        const inv = 1 / Math.sqrt(dhx * dhx + 1 + dhz * dhz)
        nor[k * 3] = -dhx * inv
        nor[k * 3 + 1] = inv
        nor[k * 3 + 2] = -dhz * inv
      }
    }
    groundGeo.attributes.position.needsUpdate = true
    groundGeo.attributes.normal.needsUpdate = true
  }

  for (let j = 0; j <= GROUND_NZ; j++) fillRow(j)
  flushGround()

  /**
   * World-space ground height. This bilinearly samples the very grid the mesh
   * is drawn from (offset by the clipmap's sub-cell shift), so feet planted
   * with it land exactly on the visible surface.
   */
  function groundHeightAt(x, z) {
    let fi = (x - GX0) / DX
    let fj = (z - meshZ - GROUND_Z0) / DZ
    fi = fi < 0 ? 0 : fi > GROUND_NX ? GROUND_NX : fi
    fj = fj < 0 ? 0 : fj > GROUND_NZ ? GROUND_NZ : fj
    const i0 = Math.min(fi | 0, GROUND_NX - 1)
    const j0 = Math.min(fj | 0, GROUND_NZ - 1)
    const tx = fi - i0
    const tz = fj - j0
    const a = H[j0 * SX + i0]
    const b = H[j0 * SX + i0 + 1]
    const c = H[(j0 + 1) * SX + i0]
    const d = H[(j0 + 1) * SX + i0 + 1]
    return (a + (b - a) * tx) * (1 - tz) + (c + (d - c) * tx) * tz
  }

  // -------------------------------------------------------------------------
  // Scattered props
  // -------------------------------------------------------------------------
  // Each instance stores its position in BAND space; every frame we wrap
  // (z - dist) modulo BAND, so instances recycle from the far edge of the fog
  // back to behind the camera with no pop.
  const dummy = new THREE.Object3D()
  const scatters = []

  /**
   * World z of a prop sitting at band coordinate `z`, after scrolling `dist`.
   * Euclidean modulo, not a bare `%`: the dividend is negative now, and JS
   * hands back a negative remainder for that, which would march props out of
   * the band instead of wrapping them.
   */
  const bandZ = (z) => (((z + scrollZ(dist)) % BAND) + BAND) % BAND - BAND_AHEAD

  function addScatter(mesh, items, { sit = true } = {}) {
    mesh.frustumCulled = false
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    keep(mesh.geometry)
    keep(mesh.material)
    const s = { mesh, items, sit, max: items.length }
    scatters.push(s)
    group.add(mesh)
    return s
  }

  function updateScatter(s) {
    const n = s.mesh.count
    for (let i = 0; i < n; i++) {
      const it = s.items[i]
      const z = bandZ(it.z)
      dummy.position.set(it.x, it.y + (s.sit ? groundHeightAt(it.x, z) : 0), z)
      dummy.rotation.set(it.rx, it.ry, it.rz)
      dummy.scale.set(it.sx, it.sy, it.sz)
      dummy.updateMatrix()
      s.mesh.setMatrixAt(i, dummy.matrix)
    }
    s.mesh.instanceMatrix.needsUpdate = true
  }

  // Rock material — reuses the regolith normal map at a tighter repeat so the
  // monoliths and the ground share a surface language.
  const rockNormal = rego.normalMap ? keep(rego.normalMap.clone()) : null
  if (rockNormal) {
    rockNormal.repeat.set(2, 3)
    rockNormal.needsUpdate = true
  }
  const rockMat = new THREE.MeshStandardMaterial({
    color: '#403a48',
    normalMap: rockNormal,
    roughness: 0.95,
    metalness: 0.02,
    flatShading: true,
  })

  // Shattered basalt monoliths.
  const monoliths = new THREE.InstancedMesh(makeShardGeometry(), rockMat, MAX_MONOLITH)
  monoliths.castShadow = true
  monoliths.receiveShadow = true
  {
    const items = []
    for (let i = 0; i < MAX_MONOLITH; i++) {
      // Keep the running corridor clear — nothing within ~4m of the track.
      const side = rng() < 0.5 ? -1 : 1
      const x = side * (5.5 + Math.pow(rng(), 0.75) * 44)
      // Two thirds are squat broken blocks; the rest are spires. An even
      // spread of tall thin shapes just reads as a field of traffic cones.
      const spire = rng() < 0.34
      const w = spire ? 0.55 + rng() * 0.6 : 0.7 + rng() * 0.85
      items.push({
        x,
        y: -0.3,
        z: rng() * BAND,
        rx: (rng() - 0.5) * (spire ? 0.16 : 0.4),
        ry: rng() * Math.PI * 2,
        rz: (rng() - 0.5) * (spire ? 0.16 : 0.4),
        sx: w,
        sy: spire ? 2.4 + Math.pow(rng(), 1.5) * 3.6 : 0.95 + rng() * 1.3,
        sz: w * (0.82 + rng() * 0.36),
      })
    }
    addScatter(monoliths, items)
  }

  // Rubble.
  const rubble = new THREE.InstancedMesh(makeRubbleGeometry(), rockMat, MAX_RUBBLE)
  rubble.receiveShadow = true
  {
    const items = []
    for (let i = 0; i < MAX_RUBBLE; i++) {
      const side = rng() < 0.5 ? -1 : 1
      items.push({
        x: side * (1.3 + Math.pow(rng(), 1.35) * 26),
        y: -0.04,
        z: rng() * BAND,
        rx: rng() * Math.PI,
        ry: rng() * Math.PI,
        rz: rng() * Math.PI,
        sx: 0.45 + rng() * 0.75,
        sy: 0.65 + rng() * 0.6,
        sz: 0.45 + rng() * 0.75,
      })
    }
    addScatter(rubble, items)
  }
  keep(rockMat)

  // Derelict marker pylons — evenly spaced down both shoulders of the track.
  // Regular spacing is what actually sells the speed of the treadmill.
  const metal = safe('makeMetal', { size: 512, seed: 17, base: '#5e6470', rust: 0.5, scratch: 0.7 })
  for (const t of [metal.map, metal.normalMap, metal.roughnessMap, metal.metalnessMap]) {
    if (!t) continue
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(2, 1)
    t.anisotropy = maxAniso
    keep(t)
  }
  const pylonMat = new THREE.MeshStandardMaterial({
    color: metal.map ? '#8e94a4' : '#5c5566',
    map: metal.map || null,
    normalMap: metal.normalMap || null,
    roughnessMap: metal.roughnessMap || null,
    metalnessMap: metal.metalnessMap || null,
    roughness: 0.55,
    metalness: metal.metalnessMap ? 1.0 : 0.8,
  })
  // One lathe profile gives the whole pylon — splayed footing, tapered column,
  // a collar under the lamp — without needing to merge separate primitives.
  const PYLON_LAMP_Y = 2.05
  const postGeo = new THREE.LatheGeometry(
    [
      [0.0, 0.0], [0.21, 0.0], [0.23, 0.07], [0.12, 0.14], [0.095, 0.5],
      [0.075, 1.7], [0.125, 1.86], [0.125, 2.24], [0.07, 2.34], [0.055, 2.6], [0.0, 2.66],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    8,
  )
  const posts = new THREE.InstancedMesh(postGeo, pylonMat, MAX_PYLON)
  posts.castShadow = true

  const panel = safe('makeEmissivePanel', { size: 256, seed: 19, color: COLOR_CYAN, density: 1 })
  for (const t of [panel.map, panel.emissiveMap]) {
    if (!t) continue
    t.anisotropy = maxAniso
    keep(t)
  }
  const stripMat = new THREE.MeshStandardMaterial({
    color: panel.map ? '#0d1a1e' : '#07171b',
    map: panel.map || null,
    emissive: new THREE.Color(COLOR_CYAN),
    emissiveMap: panel.emissiveMap || null,
    // Without the panel's mask the whole band emits, so dial it back or the
    // fallback blows out to white.
    emissiveIntensity: panel.emissiveMap ? 2.2 : 1.2,
    roughness: 0.45,
    metalness: 0.1,
  })
  // The lamp is a band around the collar, so it reads from every angle as the
  // pylons sweep past — a flat panel would vanish edge-on.
  const stripGeo = new THREE.CylinderGeometry(0.135, 0.135, 0.34, 10, 1, true)
  stripGeo.translate(0, PYLON_LAMP_Y, 0)
  const strips = new THREE.InstancedMesh(stripGeo, stripMat, MAX_PYLON)

  const pylonItems = []
  for (let i = 0; i < MAX_PYLON; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const step = BAND / (MAX_PYLON / 2)
    pylonItems.push({
      x: side * (6.4 + (rng() - 0.5) * 0.5),
      y: -0.05,
      z: Math.floor(i / 2) * step + (rng() - 0.5) * 0.8,
      rx: (rng() - 0.5) * 0.13, // derelict: every one leans a little
      ry: rng() * 0.6,
      rz: (rng() - 0.5) * 0.13,
      sx: 1,
      sy: 0.85 + rng() * 0.35,
      sz: 1,
    })
  }
  addScatter(posts, pylonItems.map((p) => ({ ...p })))
  addScatter(strips, pylonItems.map((p) => ({ ...p })))
  keep(pylonMat)
  keep(stripMat)

  // A soft halo per lamp. Points always billboard, so this costs one draw call
  // and needs no camera reference — and without bloom it is what makes the
  // strips read as *emitting* rather than merely being bright.
  const haloGeo = keep(new THREE.BufferGeometry())
  {
    const p = new Float32Array(MAX_PYLON * 3)
    const c = new Float32Array(MAX_PYLON * 3)
    const s = new Float32Array(MAX_PYLON)
    const ph = new Float32Array(MAX_PYLON)
    const col = new THREE.Color(COLOR_CYAN)
    for (let i = 0; i < MAX_PYLON; i++) {
      c[i * 3] = col.r
      c[i * 3 + 1] = col.g
      c[i * 3 + 2] = col.b
      s[i] = 9 + rng() * 4
      ph[i] = rng()
    }
    haloGeo.setAttribute('position', new THREE.BufferAttribute(p, 3))
    haloGeo.setAttribute('aColor', new THREE.BufferAttribute(c, 3))
    haloGeo.setAttribute('aSize', new THREE.BufferAttribute(s, 1))
    haloGeo.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1))
  }
  const haloMat = keep(makePointsMaterial({ pix, attenuate: 1, attenScale: 20, fog: FOG_DENSITY, intensity: 1.35 }))
  const haloes = new THREE.Points(haloGeo, haloMat)
  haloes.frustumCulled = false
  group.add(haloes)

  // -------------------------------------------------------------------------
  // Drifting dust / spores
  // -------------------------------------------------------------------------
  const DUST_SPAN = 56
  const dustGeo = keep(new THREE.BufferGeometry())
  const dustBase = new Float32Array(MAX_DUST * 3)
  const dustWob = new Float32Array(MAX_DUST * 2)
  {
    const p = new Float32Array(MAX_DUST * 3)
    const c = new Float32Array(MAX_DUST * 3)
    const s = new Float32Array(MAX_DUST)
    const ph = new Float32Array(MAX_DUST)
    const warm = new THREE.Color('#ffcf9e')
    const cold = new THREE.Color('#9fe8ff')
    const tmp = new THREE.Color()
    for (let i = 0; i < MAX_DUST; i++) {
      dustBase[i * 3] = (rng() - 0.5) * 22
      dustBase[i * 3 + 1] = 0.05 + Math.pow(rng(), 1.9) * 5.2
      dustBase[i * 3 + 2] = rng() * DUST_SPAN
      dustWob[i * 2] = rng() * 6.283
      dustWob[i * 2 + 1] = 0.25 + rng() * 0.9 // per-mote drift speed
      tmp.copy(warm).lerp(cold, Math.pow(rng(), 2))
      const lum = 0.25 + rng() * 0.75
      c[i * 3] = tmp.r * lum
      c[i * 3 + 1] = tmp.g * lum
      c[i * 3 + 2] = tmp.b * lum
      s[i] = 0.55 + Math.pow(rng(), 2.8) * 2.1
      ph[i] = rng()
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(p, 3))
    dustGeo.setAttribute('aColor', new THREE.BufferAttribute(c, 3))
    dustGeo.setAttribute('aSize', new THREE.BufferAttribute(s, 1))
    dustGeo.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1))
    dustGeo.attributes.position.setUsage(THREE.DynamicDrawUsage)
  }
  const dustMat = keep(makePointsMaterial({ pix, attenuate: 1, attenScale: 26, fog: FOG_DENSITY * 1.15, intensity: 0.9 }))
  const dust = new THREE.Points(dustGeo, dustMat)
  dust.frustumCulled = false
  group.add(dust)

  // -------------------------------------------------------------------------
  // Ground mist — two scrolling sheets at different heights and speeds
  // -------------------------------------------------------------------------
  const mistTex = keep(makeMistTexture(256))
  mistTex.wrapS = mistTex.wrapT = THREE.RepeatWrapping
  const mistSheets = []
  for (let i = 0; i < 2; i++) {
    const tex = i === 0 ? mistTex : keep(mistTex.clone())
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(2 + i, 2.5 + i * 1.5)
    tex.needsUpdate = true
    const geo = keep(new THREE.PlaneGeometry(130, 150, 24, 24))
    geo.rotateX(-Math.PI / 2)
    // Vertex colours fade the sheet to black at its rim; without this the
    // rectangular edge of an additive quad draws a hard line across the flat.
    {
      const p = geo.attributes.position
      const col = new Float32Array(p.count * 3)
      for (let v = 0; v < p.count; v++) {
        const fx = Math.abs(p.getX(v)) / 65
        const fz = Math.abs(p.getZ(v)) / 75
        const k = (1 - smoothstep(0.45, 1.0, fx)) * (1 - smoothstep(0.35, 1.0, fz))
        col[v * 3] = col[v * 3 + 1] = col[v * 3 + 2] = k
      }
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    }
    const mat = keep(
      new THREE.MeshBasicMaterial({
        map: tex,
        vertexColors: true,
        color: i === 0 ? '#8f5f86' : '#5f4270',
        transparent: true,
        opacity: i === 0 ? 0.62 : 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false, // additive + fog would brighten the distance, not dim it
      }),
    )
    const m = new THREE.Mesh(geo, mat)
    m.position.set(0, 0.16 + i * 0.4, -30)
    m.renderOrder = 5
    m.frustumCulled = false
    group.add(m)
    mistSheets.push({ tex, speed: i === 0 ? 1.0 : 0.55, scroll: 2.5 + i * 1.5, depth: 150 })
  }

  // -------------------------------------------------------------------------
  // Quality
  // -------------------------------------------------------------------------
  function setQuality(v) {
    q = Math.max(0, Math.min(1, v))
    monoliths.count = Math.max(6, Math.round(MAX_MONOLITH * (0.35 + 0.65 * q)))
    rubble.count = Math.max(20, Math.round(MAX_RUBBLE * (0.25 + 0.75 * q)))
    posts.count = Math.max(10, Math.round(MAX_PYLON * (0.5 + 0.5 * q)))
    strips.count = posts.count
    haloGeo.setDrawRange(0, posts.count)
    dustGeo.setDrawRange(0, Math.max(160, Math.round(MAX_DUST * (0.25 + 0.75 * q))))
    starGeo.setDrawRange(0, Math.max(600, Math.round(STAR_COUNT * (0.45 + 0.55 * q))))
    const res = q > 0.6 ? 2048 : q > 0.3 ? 1024 : 512
    if (key.shadow.mapSize.width !== res) {
      key.shadow.mapSize.set(res, res)
      key.shadow.map?.dispose()
      key.shadow.map = null
    }
  }
  setQuality(quality)

  // -------------------------------------------------------------------------
  // Per-frame
  // -------------------------------------------------------------------------
  const haloPos = haloGeo.attributes.position
  const dustPos = dustGeo.attributes.position

  function update(dt, speed) {
    const step = Math.min(Math.max(dt || 0, 0), 0.05) // clamp tab-switch spikes
    const v = Number.isFinite(speed) ? speed : 0
    time += step
    dist += v * step

    // --- ground: shift whole rows, carry the remainder as a mesh offset
    const k = Math.floor(dist / DZ)
    // Keep `meshZ` and `ground.position.z` the same number — `groundHeightAt`
    // subtracts `meshZ` to undo exactly this offset, and it is only correct
    // while the two agree. Negating one of them and not the other puts every
    // planted foot half a cell off the visible surface.
    meshZ = scrollZ(dist - k * DZ)
    ground.position.z = meshZ
    if (k !== rowK) {
      const delta = k - rowK
      rowK = k
      if (delta > 0 && delta <= GROUND_NZ) {
        // Row j inherits old row j+delta: the grid slides toward the far edge
        // and rolls off it, so the genuinely new rows are at the NEAR end.
        H.copyWithin(0, delta * SX)
        for (let j = GROUND_NZ - delta + 1; j <= GROUND_NZ; j++) fillRow(j)
      } else {
        for (let j = 0; j <= GROUND_NZ; j++) fillRow(j)
      }
      flushGround()
    }
    // The mesh itself already carries `meshZ` of the scroll; the texture only
    // has to make up the whole-row remainder.
    //
    // The sign is not free: the ground's uv v runs along +Z (vertex j carries
    // v = j/GROUND_NZ at z = GROUND_Z0 + j*DZ) and three applies offset AFTER
    // repeat, so a feature at a fixed sampled v sits at
    //   z_local = GROUND_Z0 + (v - off)/GROUND_REPEAT * GROUND_D,
    // i.e. +off moves the pattern -Z. Adding meshZ back, a POSITIVE off is what
    // cancels the k*DZ the mesh offset gives back and leaves the pattern moving
    // at exactly -dist, locked to the rows. Get it wrong and the terrain slides
    // against its own texture at 2 * DZ per row.
    const off = ((k * DZ) / GROUND_D) * GROUND_REPEAT
    if (rego.map) rego.map.offset.y = off
    if (rego.normalMap) rego.normalMap.offset.y = off
    if (rego.roughnessMap) rego.roughnessMap.offset.y = off

    // --- props
    for (const s of scatters) updateScatter(s)

    // Lamp haloes ride the pylon strips.
    const hp = haloPos.array
    const n = posts.count
    for (let i = 0; i < n; i++) {
      const it = pylonItems[i]
      const z = bandZ(it.z)
      hp[i * 3] = it.x
      hp[i * 3 + 1] = it.y + groundHeightAt(it.x, z) + PYLON_LAMP_Y * it.sy
      hp[i * 3 + 2] = z
    }
    haloPos.needsUpdate = true

    // --- dust: drifts along BACKWARD past the runner, with a slow lateral
    //     wobble. Each mote carries its own rate, so the field shears.
    const dp = dustPos.array
    const dn = dustGeo.drawRange.count
    for (let i = 0; i < dn; i++) {
      const sp = dustWob[i * 2 + 1]
      const ph = dustWob[i * 2]
      const drift = scrollZ(dist * (0.55 + sp * 0.6))
      // Euclidean modulo, not a bare `%`. `drift` is negative now, so the
      // dividend goes negative, and JS returns a NEGATIVE remainder for that —
      // which marches motes out of the window and never brings them back
      // (measured: z = -92 by dist = 100, against a window of [-48, +8]).
      let z = (((dustBase[i * 3 + 2] + drift) % DUST_SPAN) + DUST_SPAN) % DUST_SPAN
      dp[i * 3] = dustBase[i * 3] + Math.sin(time * 0.6 * sp + ph) * 0.85
      dp[i * 3 + 1] = dustBase[i * 3 + 1] + Math.cos(time * 0.45 * sp + ph * 1.7) * 0.45
      dp[i * 3 + 2] = z - DUST_SPAN + 8
    }
    dustPos.needsUpdate = true

    // --- mist sheets scroll at their own rates for cheap parallax
    for (const m of mistSheets) {
      // PlaneGeometry's +v points at -z once laid flat (v = 1 sits at z = -75),
      // opposite the ground's, so this offset has to carry the OPPOSITE sign to
      // the ground's — which is exactly what makes both of them drift along
      // BACKWARD together.
      m.tex.offset.y = scrollZ((dist * m.speed) / m.depth) * m.scroll
      m.tex.offset.x = Math.sin(time * 0.03) * 0.05
    }

    // --- sky
    starMat.uniforms.uTime.value = time
    planetMat.uniforms.uSpin.value = -time * 0.0045 // one turn every ~4 minutes
  }

  // -------------------------------------------------------------------------
  // Teardown
  // -------------------------------------------------------------------------
  function dispose() {
    group.parent?.remove(group)
    group.traverse((o) => {
      if (o.isInstancedMesh) o.dispose()
    })
    for (const o of junk) o.dispose?.()
    key.shadow.map?.dispose()
    if (scene && scene.fog) scene.fog = null
  }

  if (scene) scene.add(group)
  update(0, 0)

  return {
    group,
    lights: { key, fill, rim, hemi },
    update,
    groundHeightAt,
    setQuality,
    dispose,
  }
}
