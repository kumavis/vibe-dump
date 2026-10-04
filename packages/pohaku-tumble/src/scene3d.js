import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { clamp01, inOutCubic, smooth } from './ease.js'
import { stoneText } from './lexicon.js'
import { SLAB, mulberry32 } from './field.js'
import { SHADOW, STONE, STONE_LIGHT, font } from './palette.js'

const X = new THREE.Vector3(1, 0, 0)
const Y = new THREE.Vector3(0, 1, 0)
const BEVEL = 0.055
// How far a flake knocked off an edge reaches into the face.
const FLAKE = 0.12
const VARIANTS = 6
// A face just turned away keeps this much of its pecking's lightness: the
// carving is still there, but the fresh grey has gone back toward the stone.
const GHOST = 0.4

// Every turn is a quarter roll forward about X: the top face tips toward the
// viewer onto the front, and the back face — the one face the camera never
// sees — comes up on top. So the new root is pecked into the back before the
// roll starts, and the old one ends up on the front, upright, as a weathered
// ghost of what the word used to be. The face that was on the front goes
// underneath and is thrown away.
//
// The stone keeps every roll it has made (the mesh's own quaternion), so its
// grain, pits and chips go round with it instead of snapping back when a roll
// ends. The four faces a roll passes through are numbered in the stone's own
// frame — 0 +Y, 1 +Z, 2 −Y, 3 −Z — and after r rolls face k sits where face
// (k + r) mod 4 sat at the start: 0 top, 1 front, 2 under, 3 back.
const ROLL = new THREE.Quaternion().setFromAxisAngle(X, Math.PI / 2)
const TOP = 0
const FRONT = 1
const UNDER = 2
const BACK = 3

export class Scene3D {
  constructor(canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true })
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    this.renderer = renderer

    const scene = new THREE.Scene()
    this.scene = scene
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400)

    // Warm light off the paper from below, a pale sky above.
    scene.add(new THREE.HemisphereLight(0xfaf4ea, 0xab9d86, 1.9))
    const sun = new THREE.DirectionalLight(0xffeedb, 2.9)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.radius = 7
    sun.shadow.blurSamples = 12
    sun.shadow.bias = -0.0006
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 120
    scene.add(sun, sun.target)
    this.sun = sun
    // A low sun from the left and a little behind, about 38° up: low enough to
    // rake across the faces so the pits and the pecking stand out, and coming
    // mostly from the side, so the longer shadows run along a row of stones
    // rather than down over the captions beneath them. The fronts are in the
    // fill and read as the dark side of the stone.
    this.sunDir = new THREE.Vector3(-0.74, 0.62, -0.3).normalize()

    // The floor is the page itself (the map is on a canvas underneath this
    // one). The GL floor only exists to catch shadows, drawn as a translucent
    // warm brown over whatever is below.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.ShadowMaterial({ color: new THREE.Color(SHADOW), opacity: 0.34 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    this.slabs = Array.from({ length: VARIANTS }, (_, i) => slabGeometry(mulberry32(0x5eed + i * 977)))
    this.blobGeo = new THREE.PlaneGeometry(SLAB + 1.1, 2.1)
    this.blobTex = blobTexture()
    this.glyphs = new GlyphCache()

    this.blocks = new Map()
    this.raycaster = new THREE.Raycaster()
    this.v = new THREE.Vector3()
    this.w = 1
    this.h = 1
  }

  setSize(w, h, dpr) {
    this.w = w
    this.h = h
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
  }

  // An orthographic camera: the floor maps to the screen by one affine
  // transform, so the 2D canvases can draw "on the floor" exactly in step.
  setView({ tx, tz, yaw, pitch, ppu }) {
    const cam = this.camera
    const hw = this.w / 2 / ppu
    const hh = this.h / 2 / ppu
    cam.left = -hw
    cam.right = hw
    cam.top = hh
    cam.bottom = -hh
    cam.updateProjectionMatrix()
    const D = 80
    cam.position.set(
      tx + D * Math.sin(yaw) * Math.cos(pitch),
      D * Math.sin(pitch),
      tz + D * Math.cos(yaw) * Math.cos(pitch),
    )
    cam.up.copy(Y)
    cam.lookAt(tx, 0, tz)
    cam.updateMatrixWorld()

    const sun = this.sun
    sun.target.position.set(tx, 0, tz)
    sun.position.copy(this.sunDir).multiplyScalar(40).add(sun.target.position)
    const reach = Math.max(hw, hh / Math.sin(pitch)) + 3
    const sc = sun.shadow.camera
    sc.left = -reach
    sc.right = reach
    sc.top = reach
    sc.bottom = -reach
    sc.updateProjectionMatrix()
  }

  // Screen position (CSS px) of a world point.
  project(x, y, z) {
    const v = this.v.set(x, y, z).project(this.camera)
    return [((v.x + 1) / 2) * this.w, ((1 - v.y) / 2) * this.h]
  }

  // The floor plane's screen mapping: screen = (a·x + c·z + e, b·x + d·z + f).
  floorAffine() {
    const [ex, ey] = this.project(0, 0, 0)
    const [ax, ay] = this.project(1, 0, 0)
    const [cx, cy] = this.project(0, 0, 1)
    return [ax - ex, ay - ey, cx - ex, cy - ey, ex, ey]
  }

  addTile(tile) {
    const block = new Block(this, tile)
    this.blocks.set(tile.id, block)
    return block
  }

  block(tile) {
    return this.blocks.get(tile.id)
  }

  pick(x, y) {
    const ndc = new THREE.Vector2((x / this.w) * 2 - 1, -(y / this.h) * 2 + 1)
    this.raycaster.setFromCamera(ndc, this.camera)
    const hits = this.raycaster.intersectObjects(
      [...this.blocks.values()].map((b) => b.stone),
      false,
    )
    return hits.length ? hits[0].object.userData.tile : null
  }

  update(now) {
    for (const block of this.blocks.values()) block.update(now)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}

class Block {
  constructor(scene3d, tile) {
    this.s = scene3d
    this.tile = tile
    // The stone's cut, how it lies and the grain of its rock all come from
    // its tile, so a stone looks the same every time the page is opened.
    const rng = mulberry32(0x9e3779b1 ^ (tile.id * 2654435761))
    const group = new THREE.Group()
    group.position.set(tile.x, 0.5, tile.z)
    this.u = stoneUniforms(scene3d, rng)
    const stone = new THREE.Mesh(scene3d.slabs[Math.floor(rng() * VARIANTS)], stoneMaterial(this.u))
    this.rolls = Math.floor(rng() * 4)
    for (let i = 0; i < this.rolls; i++) stone.quaternion.premultiply(ROLL)
    stone.castShadow = true
    stone.receiveShadow = true
    stone.userData.tile = tile
    group.add(stone)
    scene3d.scene.add(group)
    this.group = group
    this.stone = stone

    // Contact shadow: the tight darkening where a stone meets the floor, the
    // part of ambient occlusion a shadow map is too soft to draw.
    const blob = new THREE.Mesh(
      scene3d.blobGeo,
      new THREE.MeshBasicMaterial({
        color: 0x2b1f15,
        alphaMap: scene3d.blobTex,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
      }),
    )
    blob.rotation.x = -Math.PI / 2
    blob.position.set(tile.x, 0.002, tile.z)
    blob.renderOrder = -1
    scene3d.scene.add(blob)
    this.blob = blob

    // What is pecked into each of the stone's four faces, by its own frame.
    this.faces = [null, null, null, null]
    this.peck(this.face(TOP), tile.stone, 1)
    this.roll = null
    this.drop = null
  }

  // The stone's own face that currently sits at `place` (TOP, FRONT, …).
  face(place) {
    return (place - this.rolls + 400) % 4
  }

  peck(k, stone, lift) {
    this.free(k)
    const text = stoneText(stone)
    this.faces[k] = text
    this.u.uGlyph.value[k] = this.s.glyphs.acquire(text)
    this.u.uLift.value.setComponent(k, lift)
    this.u.uCut.value.setComponent(k, 1)
  }

  free(k) {
    const text = this.faces[k]
    if (!text) return
    this.s.glyphs.release(text)
    this.faces[k] = null
    this.u.uGlyph.value[k] = this.s.glyphs.blank
    this.u.uLift.value.setComponent(k, 0)
    this.u.uCut.value.setComponent(k, 0)
  }

  // Fall in from above, for the opening.
  dropIn(t0, dur = 0.7) {
    this.drop = { t0, dur, spin: (Math.random() - 0.5) * 0.9 }
    this.group.position.y = 99
  }

  // Tumble forward onto `stone`. Returns when it will land.
  turn(stone, t0, dur = 0.86) {
    if (this.roll) this.finishRoll()
    const faces = { top: this.face(TOP), front: this.face(FRONT), back: this.face(BACK) }
    this.peck(faces.back, stone, 1)
    this.roll = { t0, dur, faces, hop: 0.22 + Math.random() * 0.12 }
    return t0 + dur
  }

  landsAt() {
    return this.roll ? this.roll.t0 + this.roll.dur : 0
  }

  finishRoll() {
    const { faces } = this.roll
    this.free(faces.front)
    this.u.uLift.value.setComponent(faces.top, GHOST)
    this.stone.quaternion.premultiply(ROLL)
    this.rolls++
    this.group.quaternion.identity()
    this.group.position.y = 0.5
    this.roll = null
  }

  update(now) {
    const g = this.group
    let lift = 0
    if (this.drop) {
      const t = clamp01((now - this.drop.t0) / this.drop.dur)
      if (now < this.drop.t0) {
        lift = 30
      } else if (t < 0.62) {
        const u = t / 0.62
        lift = 3.2 * (1 - u * u)
      } else {
        const u = (t - 0.62) / 0.38
        lift = 0.16 * Math.sin(Math.PI * u) * (1 - u * 0.4)
      }
      g.quaternion.setFromAxisAngle(Y, this.drop.spin * (1 - smooth(t)))
      g.position.y = 0.5 + lift
      if (t >= 1) {
        this.drop = null
        g.quaternion.identity()
        g.position.y = 0.5
      }
    } else if (this.roll) {
      const r = this.roll
      const t = clamp01((now - r.t0) / r.dur)
      // Over-rotate by a few degrees and settle back, as if the stone landed
      // with a little momentum left.
      const e = t < 0.8 ? 1.04 * inOutCubic(t / 0.8) : 1.04 - 0.04 * smooth((t - 0.8) / 0.2)
      const a = e * (Math.PI / 2)
      g.quaternion.setFromAxisAngle(X, a)
      // A square section rotating in place has to rise to keep its edge off
      // the floor.
      lift = 0.5 * (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a))) - 0.5 + r.hop * Math.sin(Math.PI * Math.min(1, t / 0.85))
      g.position.y = 0.5 + lift
      this.u.uLift.value.setComponent(r.faces.top, 1 - (1 - GHOST) * smooth(clamp01((t - 0.15) / 0.7)))
      if (this.faces[r.faces.front]) {
        const k = 1 - smooth(clamp01(t / 0.5))
        this.u.uLift.value.setComponent(r.faces.front, GHOST * k)
        this.u.uCut.value.setComponent(r.faces.front, k)
      }
      if (t >= 1) this.finishRoll()
    }
    const b = this.blob
    const k = Math.min(1, lift / 1.4)
    b.material.opacity = 0.55 * (1 - k) * (1 - k)
    b.scale.setScalar(1 + k * 0.7)
  }
}

// ── the stone ──────────────────────────────────────────────────────────────

// A slab of basalt, squared but cut by hand: a rounded box finely divided so
// it can be worked — the faces undulate a little and lean off true, and the
// edges and corners are knocked off in places. Each variant gets its own rng,
// so no two neighbours are the same stone.
function slabGeometry(rng) {
  const half = [SLAB / 2, 0.5, 0.5]
  const B = 3 // rows across each quarter of the bevel
  const flat = [30, 20, 20] // rows across the flat of each face
  const N = flat.map((n) => n + 2 * B)
  const geo = new THREE.BoxGeometry(1, 1, 1, ...N)
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')

  // Box rows → stone rows: the outer B rows on each side are spent on the
  // bevel, the rest spread evenly over the flat.
  const pos = geo.attributes.position
  const p = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i)
    const c = [p.x, p.y, p.z].map((v, a) => {
      const j = Math.round((v + 0.5) * N[a])
      const r = half[a] - BEVEL
      if (j <= B) return -half[a] + (j / B) * BEVEL
      if (j >= N[a] - B) return half[a] - ((N[a] - j) / B) * BEVEL
      return -r + ((j - B) / (N[a] - 2 * B)) * 2 * r
    })
    pos.setXYZ(i, ...c)
  }
  const merged = mergeVertices(geo, 1e-6)
  geo.dispose()

  const noise = valueNoise(rng)
  const off = [rng() * 50, rng() * 50, rng() * 50]
  const lean = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(0.022)
  const at = merged.attributes.position
  const core = new THREE.Vector3()
  const n = new THREE.Vector3()
  for (let i = 0; i < at.count; i++) {
    p.fromBufferAttribute(at, i)
    core.set(
      THREE.MathUtils.clamp(p.x, -half[0] + BEVEL, half[0] - BEVEL),
      THREE.MathUtils.clamp(p.y, -half[1] + BEVEL, half[1] - BEVEL),
      THREE.MathUtils.clamp(p.z, -half[2] + BEVEL, half[2] - BEVEL),
    )
    n.subVectors(p, core).normalize()
    // How near an arris this point is, measured along its face: 1 on the
    // edge, 0 a flake's width in. Where the noise is high a flake has come
    // away, taking the edge with it and fading back into the face.
    const gap = [half[0] - Math.abs(p.x), half[1] - Math.abs(p.y), half[2] - Math.abs(p.z)].sort((a, b) => a - b)
    const arris = THREE.MathUtils.smoothstep(FLAKE - gap[1], 0, FLAKE)
    const q = [p.x * 2.1 + off[0], p.y * 2.1 + off[1], p.z * 2.1 + off[2]]
    const swell = 0.006 * (noise(...q) * 2 - 1) + 0.003 * (noise(q[0] * 2.7, q[1] * 2.7, q[2] * 2.7) * 2 - 1)
    const flake = THREE.MathUtils.smoothstep(noise(q[0] * 2.6, q[1] * 2.6, q[2] * 2.6), 0.5, 0.72)
    const chip = 0.034 * arris * arris * flake
    const d = swell + lean.dot(p) - chip
    p.copy(core).addScaledVector(n, BEVEL + d)
    at.setXYZ(i, p.x, p.y, p.z)
  }
  merged.computeVertexNormals()
  return merged
}

// Smooth 3D value noise in [0, 1) on an integer lattice, for shaping the
// slabs. Rebuilt per variant from its rng.
function valueNoise(rng) {
  const perm = Uint8Array.from({ length: 256 }, (_, i) => i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }
  const val = Float32Array.from({ length: 256 }, () => rng())
  const h = (x, y, z) => val[perm[(perm[(perm[x & 255] + y) & 255] + z) & 255]]
  const f = (t) => t * t * (3 - 2 * t)
  const mix = (a, b, t) => a + (b - a) * t
  return (x, y, z) => {
    const i = Math.floor(x)
    const j = Math.floor(y)
    const k = Math.floor(z)
    const u = f(x - i)
    const v = f(y - j)
    const w = f(z - k)
    return mix(
      mix(mix(h(i, j, k), h(i + 1, j, k), u), mix(h(i, j + 1, k), h(i + 1, j + 1, k), u), v),
      mix(mix(h(i, j, k + 1), h(i + 1, j, k + 1), u), mix(h(i, j + 1, k + 1), h(i + 1, j + 1, k + 1), u), v),
      w,
    )
  }
}

// Each stone's own uniforms: where in the rock it was cut from, the sun (one
// vector, shared), and the four faces' pecking.
function stoneUniforms(scene3d, rng) {
  const blank = scene3d.glyphs.blank
  return {
    uSeed: { value: new THREE.Vector3(rng() * 40, rng() * 40, rng() * 40) },
    uSun: { value: scene3d.sunDir },
    uGlyph: { value: [blank, blank, blank, blank] },
    uLift: { value: new THREE.Vector4() },
    uCut: { value: new THREE.Vector4() },
  }
}

// The palette's basalt is the stone's middle tone; the body drifts either side
// of it, a little greyer than the swatch so the warm light doesn't turn it to
// brown.
const BASALT = greyer(new THREE.Color(STONE), 0.45)
const PECKED = new THREE.Color(STONE_LIGHT)
// Olivine, the green crystal Hawaiian basalt carries, seen as a dull glint.
const OLIVINE = new THREE.Color('#5d6430')

// MeshStandardMaterial with the rock written into it. Everything is worked out
// in the stone's own frame, so the texture rolls with the stone:
//   · the body, dark warm grey, drifting slowly lighter and darker;
//   · vesicles — gas bubbles frozen in the lava — as small dark pits with a
//     faint rim: a Worley field, kept where a cell's random number is low;
//   · now and then, a cell holds an olivine fleck instead;
//   · the pecked letters, from the face's glyph texture: lighter where the
//     dark skin has been broken, mottled peck by peck, sunk a little, with a
//     thin shadow inside the edge nearest the sun.
// One material per stone for its own uniforms; the cache key is fixed, so
// every stone shares one compiled program.
function stoneMaterial(uniforms) {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 })
  mat.customProgramCacheKey = () => 'pohaku-basalt'
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms, {
      uDark: { value: BASALT.clone().multiplyScalar(0.72) },
      uLight: { value: BASALT.clone().multiplyScalar(1.45) },
      uPecked: { value: PECKED },
      uOlivine: { value: OLIVINE },
    })
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERT_HEAD}`)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObj = position;')
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vWorldY = (modelMatrix * vec4(transformed, 1.0)).y;
        vSunObj = uSun * mat3(modelMatrix);`,
      )
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAG_HEAD}`)
      .replace('#include <color_fragment>', `#include <color_fragment>\n${FRAG_ROCK}`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = rough;')
      .replace('#include <normal_fragment_maps>', 'normal = bumpNormal(-vViewPosition, normal, height, faceDirection);')
      .replace(
        '#include <aomap_fragment>',
        `#include <aomap_fragment>
        // Darker toward the floor: the ambient occlusion a real renderer would
        // find where stone meets ground. In world space, so it stays put as
        // the stone rolls.
        float aoY = smoothstep(0.0, 0.5, vWorldY);
        aoY = aoY * aoY * (3.0 - 2.0 * aoY);
        reflectedLight.indirectDiffuse *= mix(0.45, 1.0, aoY);
        reflectedLight.directDiffuse *= mix(0.7, 1.0, aoY) * (1.0 - 0.85 * rim) * (1.0 - 0.45 * pit);
        reflectedLight.directSpecular *= 1.0 - rim;`,
      )
  }
  return mat
}

const VERT_HEAD = /* glsl */ `
uniform vec3 uSun;
varying vec3 vObj;
varying vec3 vSunObj;
varying float vWorldY;
`

const FRAG_HEAD = /* glsl */ `
#define SLAB ${SLAB.toFixed(4)}
#define HALF vec3(${(SLAB / 2).toFixed(4)}, 0.5, 0.5)
#define BEVEL ${BEVEL.toFixed(4)}
uniform vec3 uSeed;
uniform sampler2D uGlyph[4];
uniform vec4 uLift;
uniform vec4 uCut;
uniform vec3 uDark;
uniform vec3 uLight;
uniform vec3 uPecked;
uniform vec3 uOlivine;
varying vec3 vObj;
varying vec3 vSunObj;
varying float vWorldY;

// Hash without Sine (Dave Hoskins, MIT).
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), u.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), u.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), u.x), u.y),
    u.z);
}

// Distance to the nearest of a jittered lattice of points, and a random
// number belonging to that point's cell.
vec2 worley(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  float best = 9.0;
  float id = 0.0;
  for (int z = -1; z <= 1; z++)
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec3 c = vec3(x, y, z);
    vec3 d = c + hash33(i + c) - f;
    float dd = dot(d, d);
    if (dd < best) {
      best = dd;
      id = hash13(i + c + 41.7);
    }
  }
  return vec2(sqrt(best), id);
}

// The glyph on face k: r pecked, g how bright each peck broke, b how deep.
// Explicit gradients, because the face (and so the texture) changes from one
// pixel to the next along the stone's edges.
vec4 glyphAt(int k, vec2 uv, vec2 gx, vec2 gy) {
  if (k == 0) return textureGrad(uGlyph[0], uv, gx, gy);
  if (k == 1) return textureGrad(uGlyph[1], uv, gx, gy);
  if (k == 2) return textureGrad(uGlyph[2], uv, gx, gy);
  return textureGrad(uGlyph[3], uv, gx, gy);
}

// Bump mapping from a height in world units (Mikkelsen, "Bump Mapping
// Unparametrized Surfaces on the GPU"), unnormalised so a slope is a slope.
vec3 bumpNormal(vec3 pos, vec3 n, float h, float faceDir) {
  vec3 sx = dFdx(pos);
  vec3 sy = dFdy(pos);
  vec3 r1 = cross(sy, n);
  vec3 r2 = cross(n, sx);
  float det = dot(sx, r1) * faceDir;
  vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  return normalize(abs(det) * n - grad);
}
`

const FRAG_ROCK = /* glsl */ `
vec3 dpx = dFdx(vObj);
vec3 dpy = dFdy(vObj);
// Stone units per pixel: detail finer than about a pixel is faded out
// rather than left to shimmer.
float px = max(max(length(dpx), length(dpy)), 1e-5);

// The body: slow drift between a darker and a lighter grey, and a finer
// grain over it.
vec3 sp = vObj + uSeed;
float tone = 0.55 * vnoise(sp * 2.1) + 0.3 * vnoise(sp * 4.7 + 9.1) + 0.15 * vnoise(sp * 11.0 + 3.3);
float grain = vnoise(sp * 38.0);
vec3 rock = mix(uDark, uLight, smoothstep(0.25, 0.78, tone));
rock *= 0.9 + 0.2 * mix(0.5, grain, smoothstep(2.5, 6.0, 0.026 / px));

// Vesicles and olivine, one Worley field: about a third of the cells hold a
// pit, one in sixty a crystal.
const float CELLS = 24.0;
vec2 wv = worley(sp * CELLS);
float aa = px * CELLS * 0.75;
float seen = smoothstep(1.2, 3.0, 1.0 / (CELLS * px));
float hasPit = step(wv.y, 0.42 * smoothstep(0.2, 0.75, vnoise(sp * 3.3 + 5.0))) * seen;
float rad = mix(0.1, 0.34, pow(fract(wv.y * 37.0), 2.2));
float pit = hasPit * (1.0 - smoothstep(rad - aa, rad + aa, wv.x));
float lip = hasPit * smoothstep(rad - aa, rad + aa, wv.x) * (1.0 - smoothstep(rad + aa, rad + 0.1 + aa, wv.x));
float olivine = step(0.984, wv.y) * (1.0 - smoothstep(0.17 - aa, 0.17 + aa, wv.x)) * seen;
rock *= (1.0 - 0.62 * pit) * (1.0 + 0.22 * lip);
rock = mix(rock, uOlivine, 0.85 * olivine);

// Which of the four faces a roll passes through this is (−1: the slab's
// ends, which carry nothing), and the face's own coordinates: across, and
// up the letters, which on face k is the outward normal of face k − 1.
vec3 q = abs(vObj) - (HALF - BEVEL);
int k = -1;
if (q.y >= q.x && q.y >= q.z) k = vObj.y > 0.0 ? 0 : 2;
else if (q.z >= q.x) k = vObj.z > 0.0 ? 1 : 3;
float th = float(max(k, 0)) * PI_HALF;
vec3 fn = vec3(0.0, cos(th), sin(th));
vec3 up = vec3(0.0, sin(th), -cos(th));
vec2 uv = vec2(vObj.x / SLAB + 0.5, dot(vObj, up) + 0.5);
vec2 gx = vec2(dpx.x / SLAB, dot(dpx, up));
vec2 gy = vec2(dpy.x / SLAB, dot(dpy, up));
vec4 glyph = vec4(0.0);
float cut = 0.0;
float lift = 0.0;
float rim = 0.0;
if (k >= 0) {
  glyph = glyphAt(k, uv, gx, gy);
  cut = uCut[k];
  lift = uLift[k];
  // The thin shadow inside the letter: a point in the groove is shaded
  // where, a groove's depth toward the sun, the stone is shallower than here.
  vec3 L = normalize(vSunObj);
  float ln = dot(L, fn);
  if (ln > 0.0 && glyph.b > 0.0) {
    vec2 toSun = vec2(L.x / SLAB, dot(L, up)) / max(ln, 0.25);
    float there = glyphAt(k, uv + toSun * 0.011, gx, gy).b;
    rim = cut * clamp((glyph.b - there) * 3.0, 0.0, 1.0);
  }
}
float pecked = glyph.r * cut;
vec3 broken = uPecked * (0.58 + 0.42 * glyph.g) * (0.9 + 0.2 * tone);
diffuseColor.rgb = mix(rock, broken, pecked * lift);

float height = 0.004 * tone - 0.007 * pit - 0.013 * glyph.b * cut;
float rough = mix(0.9, 0.97, pecked) - 0.5 * olivine;
`

function greyer(c, k) {
  const l = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
  return c.lerp(new THREE.Color(l, l, l), k)
}

// A rounded rectangle the size of a slab's footprint, with a soft falloff
// around it, as an alpha map.
function blobTexture() {
  const W = 192
  const H = 128
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(W, H)
  const hx = (SLAB + 1.1) / 2
  const hz = 2.1 / 2
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const x = ((i + 0.5) / W) * 2 * hx - hx
      const z = ((j + 0.5) / H) * 2 * hz - hz
      const r = 0.07
      const qx = Math.abs(x) - (SLAB / 2 - r)
      const qz = Math.abs(z) - (0.5 - r)
      const d = Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r
      const a = d <= 0 ? 1 : Math.pow(Math.max(0, 1 - d / 0.5), 2.6)
      const v = Math.round(a * 255)
      const o = (j * W + i) * 4
      img.data[o] = img.data[o + 1] = img.data[o + 2] = v
      img.data[o + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return new THREE.CanvasTexture(c)
}

// ── the letters ────────────────────────────────────────────────────────────

// One texture per root on show, shared by every face that carries it.
// Released roots linger a while — the same few hundred keep coming back.
class GlyphCache {
  constructor() {
    this.map = new Map()
    this.idle = []
    this.blank = glyphTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
  }

  acquire(text) {
    let e = this.map.get(text)
    if (!e) {
      e = { tex: pecked(text), refs: 0 }
      this.map.set(text, e)
    }
    if (e.refs === 0) this.idle = this.idle.filter((t) => t !== text)
    e.refs++
    return e.tex
  }

  release(text) {
    const e = this.map.get(text)
    if (!e) return
    e.refs--
    if (e.refs > 0) return
    this.idle.push(text)
    while (this.idle.length > 96) {
      const old = this.idle.shift()
      this.map.get(old).tex.dispose()
      this.map.delete(old)
    }
  }
}

// A face is 1.5 × 1, at 256 texels a unit.
const GW = 384
const GH = 256
// Every root is set at one size if it fits the measure — 4–5 letters do —
// so the two stones of a word read as one word. Longer roots are condensed,
// down to NARROWEST; only past that do they get smaller.
const EM = 108
const MEASURE = 0.82 * GW
const NARROWEST = 0.64
const TRACK = 0.05 // letter-spacing, in em, as cut capitals want
const PECK = 2.6 // peck radius in texels: ~1.5 mm on a 30 cm slab

let scratch = null

// Pecked, not printed: the root is set in a scratch canvas, then rebuilt as
// a field of overlapping pecks — small discs, each struck where the letter is
// and each breaking the skin to its own lightness — so the edge comes out
// scalloped and a few strays land just outside it, as a hammerstone leaves
// them. Packed for the shader as r coverage, g brightness, b depth (the
// coverage blurred into a groove with sloping walls).
function pecked(text) {
  if (!scratch) {
    scratch = document.createElement('canvas')
    scratch.width = GW
    scratch.height = GH
  }
  const ctx = scratch.getContext('2d', { willReadFrequently: true })
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, GW, GH)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  const rng = mulberry32(hash(text))
  const chars = [...text]
  // Advances from prefix widths, so kerning (ʻA, AW) survives drawing the
  // letters one at a time.
  const measure = (size) => {
    ctx.font = font(size, { weight: 600 })
    const at = chars.map((_, i) => ctx.measureText(chars.slice(0, i).join('')).width + TRACK * size * i)
    const width = ctx.measureText(text).width + TRACK * size * (chars.length - 1)
    return { at, width }
  }
  let size = EM
  let m = measure(size)
  let squeeze = Math.min(1, MEASURE / m.width)
  if (squeeze < NARROWEST) {
    size = Math.floor((EM * squeeze) / NARROWEST)
    m = measure(size)
    squeeze = Math.min(1, MEASURE / m.width)
  }
  ctx.font = font(size, { weight: 600 })
  // Capitals centred on the face; macrons and the ʻokina stand above.
  const cap = ctx.measureText('H').actualBoundingBoxAscent
  const base = GH / 2 + cap / 2
  const x0 = GW / 2 - (m.width * squeeze) / 2
  // Cut by hand: each letter sits a hair off the line and off square.
  chars.forEach((ch, i) => {
    ctx.save()
    ctx.translate(x0 + m.at[i] * squeeze, base + (rng() - 0.5) * size * 0.025)
    ctx.rotate((rng() - 0.5) * 0.035)
    ctx.scale(squeeze, 1)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
  })
  const ink = ctx.getImageData(0, 0, GW, GH).data
  const inside = (x, y) => {
    const i = Math.round(y) * GW + Math.round(x)
    return x < 0 || y < 0 || x >= GW || y >= GH ? 0 : ink[i * 4] / 255
  }

  const cover = new Float32Array(GW * GH)
  const bright = new Float32Array(GW * GH)
  const strike = (cx, cy, r, b) => {
    const left = Math.max(0, Math.floor(cx - r - 1))
    const right = Math.min(GW - 1, Math.ceil(cx + r + 1))
    const top = Math.max(0, Math.floor(cy - r - 1))
    const bottom = Math.min(GH - 1, Math.ceil(cy + r + 1))
    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        const a = clamp01(r + 0.5 - Math.hypot(x + 0.5 - cx, y + 0.5 - cy))
        if (a <= 0) continue
        const i = y * GW + x
        cover[i] = Math.max(cover[i], a)
        if (a > 0.5) bright[i] = b
      }
    }
  }
  // A jittered grid of strikes over the letters, thick enough to close up,
  // with the edge left to chance; then a few strays just outside.
  const step = PECK * 1.15
  for (let y = step / 2; y < GH; y += step) {
    for (let x = step / 2; x < GW; x += step) {
      const cx = x + (rng() - 0.5) * step
      const cy = y + (rng() - 0.5) * step
      const v = inside(cx, cy)
      const r = PECK * (0.75 + rng() * 0.5)
      const b = 0.35 + 0.65 * rng() * rng() + 0.35 * rng()
      if (v > 0.38 + rng() * 0.3) strike(cx, cy, r, Math.min(1, b))
      else if (v > 0.02 && rng() < 0.12) strike(cx + (rng() - 0.5) * PECK * 2, cy + (rng() - 0.5) * PECK * 2, r * 0.7, b * 0.7)
    }
  }

  const depth = blur(blur(cover, 2), 2)
  const data = new Uint8Array(GW * GH * 4)
  for (let y = 0; y < GH; y++) {
    // Canvas rows run down, texture rows up.
    const row = (GH - 1 - y) * GW
    for (let x = 0; x < GW; x++) {
      const i = y * GW + x
      const o = (row + x) * 4
      data[o] = Math.round(cover[i] * 255)
      data[o + 1] = Math.round(bright[i] * 255)
      data[o + 2] = Math.round(Math.min(1, depth[i] * 1.15) * 255)
      data[o + 3] = 255
    }
  }
  return glyphTexture(data, GW, GH)
}

function glyphTexture(data, w, h) {
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat)
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

// Separable box blur, edges clamped.
function blur(src, r) {
  const tmp = new Float32Array(src.length)
  const out = new Float32Array(src.length)
  const n = 2 * r + 1
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      let s = 0
      for (let d = -r; d <= r; d++) s += src[y * GW + Math.min(GW - 1, Math.max(0, x + d))]
      tmp[y * GW + x] = s / n
    }
  }
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      let s = 0
      for (let d = -r; d <= r; d++) s += tmp[Math.min(GH - 1, Math.max(0, y + d)) * GW + x]
      out[y * GW + x] = s / n
    }
  }
  return out
}

// FNV-1a over the code units: a root's pecking is the same every time.
function hash(text) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193)
  return h >>> 0
}
