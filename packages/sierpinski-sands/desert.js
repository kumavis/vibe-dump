import * as THREE from 'three'

// ---------------------------------------------------------------------------
// The desert everything else stands in: sky, dunes, the sphinx, the sand that
// falls off the pyramid, and the heat shimmer laid over the whole frame.
// ---------------------------------------------------------------------------

export const PALETTE = {
  horizon: new THREE.Color(0xecd2a2),
  zenith: new THREE.Color(0x1f63aa),
  sand: new THREE.Color(0xdcb87a),
  sandDeep: new THREE.Color(0x8f6a3c),
  stone: new THREE.Color(0xb59c78),
  sun: new THREE.Color(0xfff3d0),
}

// Light comes from over the pyramid's shoulder — high enough to read as noon
// heat, low enough that the stone courses throw usable relief.
export const SUN_DIR = new THREE.Vector3(0.38, 0.55, -0.62).normalize()

// --- noise ------------------------------------------------------------------
// A tiny value-noise so the dunes are reproducible and dependency-free.
function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function valueNoise(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v
}

function fbm(x, y) {
  let sum = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < 4; i++) {
    sum += valueNoise(x * freq, y * freq) * amp
    freq *= 2.07
    amp *= 0.5
  }
  return sum
}

/**
 * Height of the desert floor at (x, z).
 *
 * Two things are deliberately not noise: a flat court around the origin so the
 * pyramid has something level to stand on, and a low berm hugging its footprint
 * so the base doesn't meet the ground on a suspiciously clean line.
 */
export function duneHeight(x, z) {
  const r = Math.hypot(x, z)
  const openness = THREE.MathUtils.smoothstep(r, 4.8, 12)
  const dunes = (fbm(x * 0.058 + 11, z * 0.058 - 4) - 0.5) * 6.6 * openness
  // Wind ripples, running across the prevailing dune direction.
  const ripple = Math.sin((x * 0.82 + z * 0.55) * 1.9) * 0.035 * (0.35 + openness)
  const berm = Math.exp(-(((r - 2.4) / 1.5) ** 2)) * 0.22
  return dunes + ripple + berm
}

export function makeSky() {
  const geo = new THREE.SphereGeometry(420, 32, 20)
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uHorizon: { value: PALETTE.horizon.clone() },
      uZenith: { value: PALETTE.zenith.clone() },
      uSun: { value: SUN_DIR.clone() },
      uSunColor: { value: PALETTE.sun.clone() },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uHorizon, uZenith, uSunColor, uSun;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        // Pale, dust-bleached band at the horizon fading up into real blue.
        float h = clamp(d.y, -1.0, 1.0);
        vec3 col = mix(uHorizon, uZenith, pow(smoothstep(-0.02, 0.26, h), 0.8));
        // Below the horizon the sky is just more haze — the dunes cover it.
        col = mix(uHorizon * 0.94, col, smoothstep(-0.16, 0.02, h));
        float cosSun = dot(d, normalize(uSun));
        col += uSunColor * pow(max(cosSun, 0.0), 220.0) * 2.4;      // disc
        col += uSunColor * pow(max(cosSun, 0.0), 6.0) * 0.30;       // glare
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })
  const sky = new THREE.Mesh(geo, mat)
  sky.frustumCulled = false
  return sky
}

/**
 * Wind ripples, as a tiling normal map.
 *
 * They can't be geometry: the ripples are a couple of metres apart and the dune
 * mesh's vertices are further apart than that, so displacing it just aliases
 * them into noise. Baking them into normals instead puts the detail at pixel
 * resolution, which is what keeps the empty foreground from reading as a
 * flat-shaded ramp.
 */
function makeRippleNormalMap(size = 256) {
  // Only integer harmonics, so the tile is seamless in both directions.
  const h = (u, v) =>
    Math.sin(2 * Math.PI * (3 * u + 0.32 * Math.sin(2 * Math.PI * v))) +
    0.35 * Math.sin(2 * Math.PI * (2 * u + 5 * v)) +
    0.22 * Math.sin(2 * Math.PI * (7 * u - 3 * v))

  const data = new Uint8Array(size * size * 4)
  const d = 1 / size
  // h is differentiated in UV space, so its slopes come out in the tens — this
  // has to be small or every ripple turns into a wall.
  const strength = 0.012
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size
      const v = y / size
      const du = (h(u + d, v) - h(u - d, v)) / (2 * d)
      const dv = (h(u, v + d) - h(u, v - d)) / (2 * d)
      let nx = -du * strength
      let nz = -dv * strength
      const len = Math.hypot(nx, 1, nz)
      const i = (y * size + x) * 4
      data[i] = ((nx / len) * 0.5 + 0.5) * 255
      data[i + 1] = ((nz / len) * 0.5 + 0.5) * 255
      data[i + 2] = (1 / len) * 0.5 * 255 + 127.5
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(160, 160) // ~3 world units per tile, so ripples about a metre apart
  tex.anisotropy = 4
  // Without mipmaps a tile this small shimmers into noise a few dunes out.
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  tex.needsUpdate = true
  return tex
}

/**
 * The dune field. Vertex colours darken the troughs and bleach the crests so
 * the sand still reads as sand under flat noon light.
 */
export function makeDunes(segments) {
  const geo = new THREE.PlaneGeometry(460, 460, segments, segments)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const y = duneHeight(x, z)
    pos.setY(i, y)
    c.copy(PALETTE.sandDeep).lerp(PALETTE.sand, THREE.MathUtils.clamp(y * 0.4 + 0.55, 0, 1))
    c.toArray(colors, i * 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.98,
    metalness: 0,
    normalMap: makeRippleNormalMap(),
    normalScale: new THREE.Vector2(0.55, 0.55),
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  return mesh
}

// --- sphinx -----------------------------------------------------------------
// A recumbent lion with a nemes headdress, built the way a PlayStation-era
// character was: one continuous low-poly skin, a few hundred flat-shaded
// triangles, silhouette doing all of the work.
//
// The body is a single tube lofted from tail to muzzle. Every station along it
// is a six-sided ring — a squared-off hexagon standing on its flat bottom — and
// consecutive rings are stitched with quads. That is what gives an angular
// animal rather than an assembly of parts: the haunch, the waist, the chest and
// the neck are all the same skin, just different ring sizes. The headdress, the
// forelegs and the tail are separate lofts of the same kind, and the plinth is
// a frustum.
function pushTri(out, a, b, c) {
  out.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2])
}

// Push a triangle wound so its normal points away from `ref`. Every triangle
// here is a piece of a tube's skin, so "away from the ring centre" is always
// "outwards" — which means the builders below never have to reason about
// winding order, only about where the vertices go.
function pushTriAwayFrom(out, a, b, c, ref) {
  const nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1])
  const ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
  const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  const dx = (a[0] + b[0] + c[0]) / 3 - ref[0]
  const dy = (a[1] + b[1] + c[1]) / 3 - ref[1]
  const dz = (a[2] + b[2] + c[2]) / 3 - ref[2]
  if (nx * dx + ny * dy + nz * dz < 0) pushTri(out, a, c, b)
  else pushTri(out, a, b, c)
}

// One ring of the skin: a hexagon in the Y-Z plane at `x`, standing on a flat
// bottom, with the top edge pulled in so the back reads as a spine rather than
// a slab. `z` slides the whole ring sideways, which is all a foreleg needs.
function ring({ x, yb, yt, w, z = 0, top = 0.55, bottom = 0.72 }) {
  const mid = yb + (yt - yb) * 0.62
  return [
    [x, yt, z - w * top],
    [x, mid, z - w],
    [x, yb, z - w * bottom],
    [x, yb, z + w * bottom],
    [x, mid, z + w],
    [x, yt, z + w * top],
  ]
}

function ringCentre(r) {
  const c = [0, 0, 0]
  for (const p of r) {
    c[0] += p[0] / r.length
    c[1] += p[1] / r.length
    c[2] += p[2] / r.length
  }
  return c
}

/** Stitch a run of rings into a closed tube, capped at both ends. */
function loft(rings) {
  const v = []
  const centres = rings.map(ringCentre)
  for (let s = 0; s < rings.length - 1; s++) {
    const A = rings[s]
    const B = rings[s + 1]
    const ref = [
      (centres[s][0] + centres[s + 1][0]) / 2,
      (centres[s][1] + centres[s + 1][1]) / 2,
      (centres[s][2] + centres[s + 1][2]) / 2,
    ]
    for (let i = 0; i < A.length; i++) {
      const j = (i + 1) % A.length
      pushTriAwayFrom(v, A[i], A[j], B[j], ref)
      pushTriAwayFrom(v, A[i], B[j], B[i], ref)
    }
  }
  // End caps, fanned from the ring's own centre and faced away from its
  // neighbour so they point out of the tube rather than into it.
  for (const [end, inward] of [
    [0, 1],
    [rings.length - 1, rings.length - 2],
  ]) {
    const r = rings[end]
    const c = ringCentre(r)
    for (let i = 0; i < r.length; i++) {
      pushTriAwayFrom(v, c, r[i], r[(i + 1) % r.length], centres[inward])
    }
  }
  return v
}

// A rectangular frustum — used for the plinth and the little uraeus. Just a
// two-ring loft; `loft` doesn't care that these rings are square.
function frustum({ cx, cy, cz, hx, hz, h, topHx, topHz, ax = 0 }) {
  const y1 = cy + h
  return loft([
    [
      [cx - hx, cy, cz - hz],
      [cx + hx, cy, cz - hz],
      [cx + hx, cy, cz + hz],
      [cx - hx, cy, cz + hz],
    ],
    [
      [cx + ax - topHx, y1, cz - topHz],
      [cx + ax + topHx, y1, cz - topHz],
      [cx + ax + topHx, y1, cz + topHz],
      [cx + ax - topHx, y1, cz + topHz],
    ],
  ])
}

export function makeSphinx() {
  // Stations down the spine: (x, underside, back, half-width). The underside
  // lifts and the ring narrows through the chest, then the whole thing turns
  // upward into the neck and head — one skin the entire way.
  const body = loft([
    ring({ x: -1.78, yb: 0.36, yt: 0.52, w: 0.12 }), // rump tip
    ring({ x: -1.52, yb: 0.26, yt: 0.82, w: 0.36 }),
    ring({ x: -1.12, yb: 0.22, yt: 1.02, w: 0.55 }), // haunch — the high back
    ring({ x: -0.62, yb: 0.22, yt: 0.82, w: 0.46 }), // waist
    ring({ x: -0.08, yb: 0.22, yt: 0.84, w: 0.45 }),
    ring({ x: 0.42, yb: 0.22, yt: 1.06, w: 0.5 }), // shoulder
    ring({ x: 0.72, yb: 0.34, yt: 1.26, w: 0.44 }), // chest
    ring({ x: 0.86, yb: 0.8, yt: 1.44, w: 0.34 }), // throat
    ring({ x: 1.0, yb: 1.0, yt: 1.62, w: 0.34 }), // neck — short and thick
    ring({ x: 1.16, yb: 1.02, yt: 1.76, w: 0.38 }), // jaw
    ring({ x: 1.36, yb: 1.06, yt: 1.74, w: 0.36 }), // head
    ring({ x: 1.54, yb: 1.16, yt: 1.62, w: 0.24 }), // flat face, no muzzle
  ])

  // The nemes: a second skin over the head, flaring wide at the temples and
  // hanging down past the jaw in the two lappets.
  const nemes = loft([
    ring({ x: 0.92, yb: 1.14, yt: 1.68, w: 0.3, top: 0.8 }),
    ring({ x: 1.04, yb: 0.7, yt: 1.9, w: 0.6, top: 0.88, bottom: 0.92 }),
    ring({ x: 1.3, yb: 0.7, yt: 1.88, w: 0.62, top: 0.88, bottom: 0.92 }),
    ring({ x: 1.42, yb: 1.1, yt: 1.76, w: 0.36, top: 0.85 }),
    ring({ x: 1.47, yb: 1.32, yt: 1.6, w: 0.15 }),
  ])

  const leg = (z) =>
    loft([
      ring({ x: 0.5, yb: 0.2, yt: 0.66, w: 0.18, z }),
      ring({ x: 1.15, yb: 0.2, yt: 0.5, w: 0.16, z }),
      ring({ x: 1.72, yb: 0.2, yt: 0.44, w: 0.16, z }),
      ring({ x: 1.98, yb: 0.2, yt: 0.36, w: 0.13, z }), // paw
    ])

  const tail = loft([
    ring({ x: -1.62, yb: 0.3, yt: 0.46, w: 0.08, z: 0.34 }),
    ring({ x: -1.2, yb: 0.34, yt: 0.52, w: 0.1, z: 0.46 }),
    ring({ x: -0.78, yb: 0.36, yt: 0.54, w: 0.09, z: 0.48 }),
  ])

  const tris = [
    frustum({ cx: -0.05, cy: -0.16, cz: 0, hx: 1.86, hz: 0.8, h: 0.36, topHx: 1.7, topHz: 0.68 }),
    body,
    nemes,
    leg(0.32),
    leg(-0.32),
    tail,
    frustum({ cx: 1.36, cy: 1.7, cz: 0, hx: 0.08, hz: 0.07, h: 0.2, topHx: 0.03, topHz: 0.03, ax: 0.06 }), // uraeus
  ].flat()

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(tris), 3))

  // Same weathering pass as the pyramid blocks, a little heavier — this thing
  // has had a few more millennia of sandblasting.
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const n = (a, b, cc) => (hash2(a * 13.1 + b * 7.7, cc * 5.3 + a * 2.1) - 0.5) * 0.02
    pos.setXYZ(i, x + n(x, y, z), y + n(y, z, x), z + n(z, x, y))
  }
  geo.computeVertexNormals()

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color: 0xc0a173,
      roughness: 0.95,
      metalness: 0,
      flatShading: true,
    }),
  )
  mesh.castShadow = true
  mesh.receiveShadow = true
  return mesh
}

// --- sand veil --------------------------------------------------------------
/**
 * The falling sand. One Points cloud used as a ring buffer: `emit()` stamps a
 * grain's origin, launch velocity and birth time into the next free slot and
 * the vertex shader ballistics it from there, so a burst of ten thousand grains
 * costs one buffer write and nothing per frame afterwards.
 *
 * That single mechanism covers both looks in the piece — a wide, slow trickle
 * during the emergence and a hard sheet at the moment a block splits — because
 * the difference between them is only how many grains you stamp per second.
 */
export class SandVeil {
  // `pixelScale` is the on-screen size of a unit grain one world-unit from the
  // camera; grains are meant to read as grit, so it stays small — much past 40
  // and a sheet of sand turns into a bank of fog.
  constructor({ capacity, life = 2.6, gravity = 2.2, pixelScale = 40 }) {
    this.capacity = capacity
    this.life = life
    this.cursor = 0
    this.dirtyFrom = Infinity
    this.dirtyTo = -Infinity

    const geo = new THREE.BufferGeometry()
    this.origin = new Float32Array(capacity * 3)
    this.vel = new Float32Array(capacity * 3)
    this.t0 = new Float32Array(capacity).fill(-1e3) // "long dead"
    this.seed = new Float32Array(capacity)
    this.size = new Float32Array(capacity)
    for (let i = 0; i < capacity; i++) this.seed[i] = Math.random()

    geo.setAttribute('position', new THREE.BufferAttribute(this.origin, 3))
    geo.setAttribute('aVel', new THREE.BufferAttribute(this.vel, 3))
    geo.setAttribute('aT0', new THREE.BufferAttribute(this.t0, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(this.seed, 1))
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1))

    this.uniforms = {
      uTime: { value: 0 },
      uLife: { value: life },
      uGravity: { value: gravity },
      uPixelScale: { value: pixelScale },
      uGroundY: { value: 0 },
      uColorA: { value: new THREE.Color(0xe6cfa2) },
      uColorB: { value: new THREE.Color(0xa98a58) },
    }

    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        attribute vec3 aVel;
        attribute float aT0;
        attribute float aSeed;
        attribute float aSize;
        uniform float uTime, uLife, uGravity, uPixelScale, uGroundY;
        varying float vAlpha;
        varying float vSeed;
        void main() {
          float t = uTime - aT0;
          float alive = step(0.0, t) * step(t, uLife);
          vec3 p = position + aVel * t;
          p.y -= 0.5 * uGravity * t * t;
          // The air moves too; drift builds up over the fall.
          p.x += sin(aSeed * 31.0 + t * 2.0) * 0.05 * t;
          p.z += cos(aSeed * 17.0 + t * 2.3) * 0.05 * t;
          // Grains don't tunnel through the desert — they pile up on it.
          float landed = 1.0 - smoothstep(uGroundY - 0.05, uGroundY + 0.03, p.y);
          p.y = max(p.y, uGroundY - 0.04);
          vSeed = aSeed;
          vAlpha = alive * (1.0 - landed)
                 * smoothstep(0.0, 0.06, t)
                 * (1.0 - smoothstep(uLife * 0.55, uLife, t));
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = alive * aSize * uPixelScale / max(-mv.z, 0.1);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA, uColorB;
        varying float vAlpha;
        varying float vSeed;
        void main() {
          if (vAlpha <= 0.004) discard;
          vec2 d = gl_PointCoord - 0.5;
          float r2 = dot(d, d);
          if (r2 > 0.25) discard;
          // Individually translucent: a sheet gets its opacity from how many
          // grains overlap, not from any one of them being solid.
          gl_FragColor = vec4(mix(uColorA, uColorB, fract(vSeed * 7.3)),
                              vAlpha * (1.0 - smoothstep(0.02, 0.25, r2)) * 0.8);
        }
      `,
    })

    this.points = new THREE.Points(geo, mat)
    this.points.frustumCulled = false // origins go stale; bounds would lie
    this.points.renderOrder = 2
    this.geometry = geo
  }

  /**
   * Stamp `count` grains. `sample(pos, vel)` fills in where each one starts and
   * how it's thrown, and returns an extra per-grain delay in seconds — or
   * `false` to skip the grain entirely (used to reject anything that would
   * spawn below the sand).
   */
  emit(count, time, sample, spread = 0) {
    const pos = _p
    const vel = _v
    for (let n = 0; n < count; n++) {
      const delay = sample(pos, vel)
      if (delay === false) continue
      const i = this.cursor
      this.cursor = (this.cursor + 1) % this.capacity
      pos.toArray(this.origin, i * 3)
      vel.toArray(this.vel, i * 3)
      this.t0[i] = time + delay + Math.random() * spread
      this.size[i] = 0.5 + Math.random() * 0.9
      if (i < this.dirtyFrom) this.dirtyFrom = i
      if (i > this.dirtyTo) this.dirtyTo = i
    }
  }

  update(time) {
    this.uniforms.uTime.value = time
    if (this.dirtyTo < this.dirtyFrom) return
    const from = this.dirtyFrom
    const n = this.dirtyTo - from + 1
    // Only the touched slice goes back to the GPU. A wrapped write widens the
    // span to cover both ends, which costs an upload but never a stale grain.
    for (const name of ['position', 'aVel', 'aT0', 'aSize']) {
      const attr = this.geometry.getAttribute(name)
      attr.addUpdateRange(from * attr.itemSize, n * attr.itemSize)
      attr.needsUpdate = true
    }
    this.dirtyFrom = Infinity
    this.dirtyTo = -Infinity
  }
}

const _p = new THREE.Vector3()
const _v = new THREE.Vector3()

// --- heat haze --------------------------------------------------------------
/**
 * Full-frame heat shimmer. The distortion is masked to the lower part of the
 * frame — that's where the sand is radiating — and the channels are offset by
 * slightly different amounts so the air splits the light a little, the way it
 * does over a hot road.
 */
export const HeatHazeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAmp: { value: 0.0062 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAmp;
    varying vec2 vUv;

    float wob(vec2 p) {
      return sin(p.x * 3.1 + sin(p.y * 2.3)) * sin(p.y * 4.7 - p.x * 1.3);
    }

    void main() {
      float heat = 1.0 - smoothstep(0.04, 0.70, vUv.y);
      float w = wob(vec2(vUv.x * 9.0, vUv.y * 26.0 - uTime * 1.1)) * 0.65
              + wob(vec2(vUv.x * 17.0 + 3.0, vUv.y * 44.0 - uTime * 1.9)) * 0.35;
      vec2 off = vec2(w * 0.9, w * 0.45) * uAmp * heat;
      vec3 col;
      col.r = texture2D(tDiffuse, vUv + off * 1.08).r;
      col.g = texture2D(tDiffuse, vUv + off).g;
      col.b = texture2D(tDiffuse, vUv + off * 0.92).b;
      // Sun-bleached falloff towards the corners.
      col *= mix(0.84, 1.0, 1.0 - smoothstep(0.32, 1.15, distance(vUv, vec2(0.5, 0.54))));
      gl_FragColor = vec4(col, 1.0);
    }
  `,
}
