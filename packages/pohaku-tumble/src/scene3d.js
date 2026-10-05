import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { clamp01, inOutCubic, smooth } from './ease.js'
import { BY_STONE, stoneText } from './lexicon.js'
import { SLAB, mulberry32 } from './field.js'
import { SHADOW, STONE, STONE_LIGHT, font } from './palette.js'

const X = new THREE.Vector3(1, 0, 0)
const Y = new THREE.Vector3(0, 1, 0)
// The slabs' arrises are rounded by anything up to WORN; BEVEL is where a
// face is taken to end, for the letters.
const WORN = 0.09
const BEVEL = 0.06
const VARIANTS = 6
// A face just turned away keeps this much of its pecking's lightness: the
// carving is still there, but the fresh grey has gone most of the way back to
// the stone — there to be read when you look for it, not at a glance.
const GHOST = 0.22
// A glyph texture covers one 1.5 × 1 face, at 256 texels a unit.
const GW = 384
const GH = 256

// Every turn is a quarter roll forward about X: the top face tips toward the
// viewer onto the front, and the back face — the one face the camera never
// sees — comes up on top. So the new root is pecked into the back before the
// roll starts, and the old one ends up on the front, upright, as a weathered
// ghost of what the word used to be. The face that was on the front goes
// underneath and is thrown away.
//
// The stone keeps the rolls it has made (the mesh's own quaternion), so its
// grain, pits and worn edges go round with it instead of snapping back when a
// roll ends. Four rolls bring it back to where it started, so only the count
// mod 4 is kept. The four faces a roll passes through are numbered in the
// stone's own frame — 0 +Y, 1 +Z, 2 −Y, 3 −Z — and after r rolls face k sits
// where face (k + r) mod 4 sat at the start: 0 top, 1 front, 2 underneath,
// 3 back.
const TOP = 0
const FRONT = 1
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

    // A pale sky above, and warm light thrown back off the sunlit paper,
    // which reaches the stones' sides more than their tops. Both kept well
    // under the sun, so that what draws a top is the sun's raking light, not
    // a wash that would flatten it, while the fronts and the ghosts on them
    // stay readable.
    scene.add(new THREE.HemisphereLight(0xf3ebdd, 0xe6d5b3, 1.2))
    const sun = new THREE.DirectionalLight(0xffeedb, 3.8)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.radius = 3
    sun.shadow.blurSamples = 12
    sun.shadow.bias = -0.0006
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 120
    scene.add(sun, sun.target)
    this.sun = sun
    // The sun stands lower than Jukugo's (DESIGN §5), 42° up, so it skims
    // across a face and picks out the grain, the pits and the sunward edge of
    // every pecked letter. No lower, though: a stone is a unit high, and its
    // shadow runs 1/tan(elevation) along the row, while the gap to the next
    // word is only about 1.5 (a 4.67 cell less a 3.12 word). At 42° the
    // shadow ends a little over a unit out and leaves a strip of clean paper
    // before most neighbours, so a row reads as words standing apart, not as
    // one bar of stone, shadow, stone. It comes from the upper left, as a map
    // is lit: from the west and a little north — far enough round to the west
    // that the shadow runs along the row, not down over the captions
    // beneath; the fronts face away from it and read as the stone's dark
    // side. The sun's strength is set for this height, so that a top keeps
    // its dark warm grey.
    this.sunDir = toward(42, 12)

    // The floor is the page itself (the map is on a canvas underneath this
    // one). The GL floor only exists to catch shadows, drawn as a translucent
    // warm brown over whatever is below — light enough that the map reads on
    // through it, and that where the layout's jitter sets two words close
    // enough for one's shadow to reach the other, it lies between them as a
    // tint, not a dark seam. The contact shadow under each stone is what
    // keeps it on the floor.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.ShadowMaterial({ color: new THREE.Color(SHADOW), opacity: 0.2 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const blank = slabBlank()
    this.slabs = Array.from({ length: VARIANTS }, (_, i) => slabGeometry(blank, mulberry32(0x5eed + i * 977)))
    blank.dispose()
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

// The direction toward a light `up` degrees above the floor, `north` degrees
// round from due west toward the north (map north is −z).
function toward(up, north) {
  const e = THREE.MathUtils.degToRad(up)
  const a = THREE.MathUtils.degToRad(north)
  return new THREE.Vector3(-Math.cos(e) * Math.cos(a), Math.sin(e), -Math.cos(e) * Math.sin(a))
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
    stone.quaternion.setFromAxisAngle(X, (this.rolls * Math.PI) / 2)
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

    // What is pecked into each of the stone's four faces, by its own frame,
    // and which of them are still waiting for their root's texture.
    this.faces = [null, null, null, null]
    this.waiting = new Set()
    this.peck(this.face(TOP), tile.stone, 1)
    this.roll = null
    this.drop = null
    this.tip = null
  }

  // The stone's own face that currently sits at `place` (TOP, FRONT, …).
  face(place) {
    return (place - this.rolls + 4) % 4
  }

  // The root's texture may come a little later, from the cache's idle-time
  // pecking; `hurry` sees that it is there before the face can be seen.
  peck(k, stone, lift) {
    this.free(k)
    const text = stoneText(stone)
    this.faces[k] = text
    this.u.uLift.value.setComponent(k, lift)
    this.u.uCut.value.setComponent(k, 1)
    this.waiting.add(k)
    this.s.glyphs.acquire(text, (tex) => {
      if (this.faces[k] !== text) return
      this.u.uGlyph.value[k] = tex
      this.waiting.delete(k)
    })
  }

  free(k) {
    const text = this.faces[k]
    if (!text) return
    this.s.glyphs.release(text)
    this.faces[k] = null
    this.waiting.delete(k)
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
    this.tip = null
    this.roll = { t0, dur, faces, hop: 0.22 + Math.random() * 0.12 }
    return t0 + dur
  }

  // Start to tumble and fall back: clicked, with nothing to turn into.
  nudge(t0, dur = 0.5) {
    if (!this.roll && !this.drop) this.tip = { t0, dur }
  }

  landsAt() {
    return this.roll ? this.roll.t0 + this.roll.dur : 0
  }

  // Letters still waiting when the stone is about to show them are pecked
  // there and then: every face from the moment the stone starts to fall, but
  // a turn's new root only once the roll is a fifth through — until then it
  // is on the back, out of sight, and idle time may yet get to it.
  hurry(now) {
    if (!this.waiting.size || (this.drop && now < this.drop.t0)) return
    const r = this.roll
    const hidden = r && now < r.t0 + 0.2 * r.dur ? r.faces.back : -1
    for (const k of this.waiting) if (k !== hidden) this.s.glyphs.hurry(this.faces[k])
  }

  finishRoll() {
    const { faces } = this.roll
    this.free(faces.front)
    this.u.uLift.value.setComponent(faces.top, GHOST)
    // Set from the count rather than turned once more, so a stone that has
    // rolled for hours sits as square as it did at the start.
    this.rolls = (this.rolls + 1) % 4
    this.stone.quaternion.setFromAxisAngle(X, (this.rolls * Math.PI) / 2)
    this.group.quaternion.identity()
    this.group.position.y = 0.5
    this.roll = null
  }

  update(now) {
    this.hurry(now)
    const g = this.group
    let lift = 0
    if (this.drop) {
      const t = clamp01((now - this.drop.t0) / this.drop.dur)
      // A stone waiting to fall isn't in the world yet. Hung above the floor
      // it would show at the top of the frame, and cast a shadow, while the
      // map is still drawing itself.
      g.visible = now >= this.drop.t0
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
    } else if (this.tip) {
      // Forward about ten degrees, back down, and a small rock onto the back
      // edge as it lands.
      const t = clamp01((now - this.tip.t0) / this.tip.dur)
      const a = t < 0.6 ? 0.18 * Math.sin(Math.PI * (t / 0.6)) : -0.035 * Math.sin(Math.PI * ((t - 0.6) / 0.4))
      g.quaternion.setFromAxisAngle(X, a)
      lift = 0.5 * (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a))) - 0.5
      g.position.y = 0.5 + lift
      if (t >= 1) {
        this.tip = null
        g.quaternion.identity()
        g.position.y = 0.5
      }
    }
    const b = this.blob
    const k = Math.min(1, lift / 1.4)
    b.material.opacity = 0.55 * (1 - k) * (1 - k)
    b.scale.setScalar(1 + k * 0.7)
  }
}

// ── the stone ──────────────────────────────────────────────────────────────

const HALF = [SLAB / 2, 0.5, 0.5]

// The block every slab is worked from: a box divided finely enough to be
// shaped, the outer B rows on each side spent on the band the widest bevel can
// reach and the rest spread evenly over the face. Built once and shared.
// The faces want few rows: their swell is under a pixel, and the pits, grain
// and letters are all in the shader. The rows along an edge are there to
// carry its wear from rounded to nearly sharp — about 1,700 triangles a slab.
function slabBlank() {
  const B = 3 // rows across the band, on each face that meets an edge
  const flat = [8, 5, 5] // rows across the rest of each face
  const N = flat.map((n) => n + 2 * B)
  const geo = new THREE.BoxGeometry(1, 1, 1, ...N)
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const c = [pos.getX(i), pos.getY(i), pos.getZ(i)].map((v, a) => {
      const j = Math.round((v + 0.5) * N[a])
      const r = HALF[a] - WORN
      if (j <= B) return -HALF[a] + (j / B) * WORN
      if (j >= N[a] - B) return HALF[a] - ((N[a] - j) / B) * WORN
      return -r + ((j - B) / (N[a] - 2 * B)) * 2 * r
    })
    pos.setXYZ(i, ...c)
  }
  const merged = mergeVertices(geo, 1e-6)
  geo.dispose()
  return merged
}

// A slab of basalt, squared but cut by hand. The faces undulate a little and
// lean off true, and the arrises are worn unevenly — nearly sharp in one
// place, well rounded a hand's width along. Each point is rounded onto a box
// whose bevel radius drifts along the edges; where it is small, the rows in
// the band simply land on the flat face. Each variant has its own rng, so
// neighbours don't match.
function slabGeometry(blank, rng) {
  const geo = blank.clone()
  const noise = valueNoise(rng)
  const off = [rng() * 50, rng() * 50, rng() * 50]
  const lean = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(0.02)
  const at = geo.attributes.position
  const p = new THREE.Vector3()
  const core = new THREE.Vector3()
  const n = new THREE.Vector3()
  for (let i = 0; i < at.count; i++) {
    p.fromBufferAttribute(at, i)
    const q = [p.x * 2.1 + off[0], p.y * 2.1 + off[1], p.z * 2.1 + off[2]]
    const r = 0.03 + (WORN - 0.03) * THREE.MathUtils.smoothstep(noise(q[0] * 0.9, q[1] * 0.9, q[2] * 0.9), 0.3, 0.8)
    core.set(
      THREE.MathUtils.clamp(p.x, -HALF[0] + r, HALF[0] - r),
      THREE.MathUtils.clamp(p.y, -HALF[1] + r, HALF[1] - r),
      THREE.MathUtils.clamp(p.z, -HALF[2] + r, HALF[2] - r),
    )
    n.subVectors(p, core).normalize()
    const swell = 0.006 * (noise(...q) * 2 - 1) + 0.003 * (noise(q[0] * 2.7, q[1] * 2.7, q[2] * 2.7) * 2 - 1)
    p.copy(core).addScaledVector(n, r + swell + lean.dot(p))
    at.setXYZ(i, p.x, p.y, p.z)
  }
  geo.computeVertexNormals()
  return geo
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
// brown, and a little lighter, so a lit face reads as dark warm grey rather
// than black and the slabs don't outweigh the map they stand on.
const BASALT = greyer(new THREE.Color(STONE), 0.45).multiplyScalar(1.2)
const DARK = BASALT.clone().multiplyScalar(0.72)
const LIGHT = BASALT.clone().multiplyScalar(1.45)
const PECKED = new THREE.Color(STONE_LIGHT)
// Olivine, the green crystal Hawaiian basalt carries, seen as a dull glint.
const OLIVINE = new THREE.Color('#5d6430')

function greyer(c, k) {
  const l = 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b
  return c.lerp(new THREE.Color(l, l, l), k)
}

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
      uDark: { value: DARK },
      uLight: { value: LIGHT },
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
#define GLYPH vec2(${GW}.0, ${GH}.0)
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
// number belonging to that point's cell. Only the eight cells nearest p are
// searched, not all 27 round it: a point in any other cell is at least half
// a cell away, and a pit is never that wide.
vec2 worley(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 o = step(0.5, f) - 1.0;
  float best = 9.0;
  float id = 0.0;
  for (int z = 0; z <= 1; z++)
  for (int y = 0; y <= 1; y++)
  for (int x = 0; x <= 1; x++) {
    vec3 c = o + vec3(x, y, z);
    vec3 d = c + hash33(i + c) - f;
    float dd = dot(d, d);
    if (dd < best) {
      best = dd;
      id = hash13(i + c + 41.7);
    }
  }
  return vec2(sqrt(best), id);
}

// The glyph on face k: r pecked, g how bright each peck broke. Explicit
// gradients, because the face (and so the texture) changes from one pixel to
// the next along the stone's edges.
vec2 glyphAt(int k, vec2 uv, vec2 gx, vec2 gy) {
  if (k == 0) return textureGrad(uGlyph[0], uv, gx, gy).rg;
  if (k == 1) return textureGrad(uGlyph[1], uv, gx, gy).rg;
  if (k == 2) return textureGrad(uGlyph[2], uv, gx, gy).rg;
  return textureGrad(uGlyph[3], uv, gx, gy).rg;
}

// How deep the groove is: the coverage seen a few texels blurred, which a
// coarser level of the mip chain gives for nothing — walls that slope.
float grooveAt(int k, vec2 uv, float lod) {
  if (k == 0) return textureLod(uGlyph[0], uv, lod).r;
  if (k == 1) return textureLod(uGlyph[1], uv, lod).r;
  if (k == 2) return textureLod(uGlyph[2], uv, lod).r;
  return textureLod(uGlyph[3], uv, lod).r;
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
// grain over it. The fine detail, here and in the pits below, is only worked
// out where it can be seen: zoomed out, or on a small screen, it is skipped.
vec3 sp = vObj + uSeed;
float tone = 0.55 * vnoise(sp * 2.1) + 0.3 * vnoise(sp * 4.7 + 9.1) + 0.15 * vnoise(sp * 11.0 + 3.3);
// Each stone a shade of its own, as stones gathered from one shore are.
vec3 rock = mix(uDark, uLight, smoothstep(0.25, 0.78, tone)) * (0.84 + 0.32 * hash13(uSeed));
float near = smoothstep(2.5, 6.0, 0.026 / px);
if (near > 0.0) rock *= 0.9 + 0.2 * mix(0.5, vnoise(sp * 38.0), near);
// Pale specks of feldspar in the groundmass, seen once the stone is nearer.
float nearer = smoothstep(1.5, 3.0, 0.011 / px);
if (nearer > 0.0) rock *= 1.0 + 0.45 * smoothstep(0.82, 0.93, vnoise(sp * 90.0)) * nearer;

// Vesicles and olivine, one Worley field: where the rock is frothy up to two
// cells in five hold a pit, where it is dense none; one in sixty holds a
// crystal.
const float CELLS = 24.0;
float aa = px * CELLS * 0.75;
float seen = smoothstep(1.2, 3.0, 1.0 / (CELLS * px));
vec2 wv = seen > 0.0 ? worley(sp * CELLS) : vec2(9.0, 0.0);
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
vec2 glyph = vec2(0.0);
float groove = 0.0;
float cut = 0.0;
float lift = 0.0;
float rim = 0.0;
if (k >= 0) {
  glyph = glyphAt(k, uv, gx, gy);
  float lod = max(log2(max(length(gx * GLYPH), length(gy * GLYPH))), 2.2);
  groove = min(1.0, 1.15 * grooveAt(k, uv, lod));
  cut = uCut[k];
  lift = uLift[k];
  // The thin shadow inside the letter: a point in the groove is shaded
  // where, a groove's depth toward the sun, the stone is shallower than here.
  vec3 L = normalize(vSunObj);
  float ln = dot(L, fn);
  if (ln > 0.0 && groove > 0.0) {
    vec2 toSun = vec2(L.x / SLAB, dot(L, up)) / max(ln, 0.25);
    float there = min(1.0, 1.15 * grooveAt(k, uv + toSun * 0.011, lod));
    rim = cut * clamp((groove - there) * 3.0, 0.0, 1.0);
  }
}
float pecked = glyph.r * cut;
vec3 broken = uPecked * (0.46 + 0.54 * glyph.g) * (0.9 + 0.2 * tone);
diffuseColor.rgb = mix(rock, broken, pecked * lift);

float height = 0.004 * tone - 0.007 * pit - 0.013 * groove * cut;
float rough = mix(0.9, 0.97, pecked) - 0.5 * olivine;
`

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
// A root not to hand is pecked in the page's idle time rather than on the
// frame that asks for it: the opening's fifty-odd would otherwise hold up the
// first frame, and a turn would hitch. A face about to be seen can't wait for
// that, and has its root pecked at once (`hurry`).
class GlyphCache {
  constructor() {
    this.map = new Map()
    this.idle = []
    this.queue = []
    this.asked = false
    this.blank = glyphTexture(new Uint8Array([0, 0]), 1, 1)
  }

  // `use(tex)` gets the root's texture: at once if it is cached, or as soon
  // as it has been pecked.
  acquire(text, use) {
    let e = this.map.get(text)
    if (!e) {
      e = { text, tex: null, refs: 0, waiting: [] }
      this.map.set(text, e)
      this.queue.push(e)
      this.ask()
    }
    if (e.refs === 0) this.idle = this.idle.filter((t) => t !== text)
    e.refs++
    if (e.tex) use(e.tex)
    else e.waiting.push(use)
  }

  release(text) {
    const e = this.map.get(text)
    if (!e) return
    e.refs--
    if (e.refs > 0) return
    this.idle.push(text)
    while (this.idle.length > 48) {
      const old = this.map.get(this.idle.shift())
      old.tex?.dispose()
      this.map.delete(old.text)
    }
  }

  hurry(text) {
    const e = this.map.get(text)
    if (!e || e.tex) return
    this.queue.splice(this.queue.indexOf(e), 1)
    this.peck(e)
  }

  peck(e) {
    e.tex = pecked(e.text)
    for (const use of e.waiting) use(e.tex)
    e.waiting = []
  }

  ask() {
    if (this.asked) return
    this.asked = true
    const work = (deadline) => this.work(deadline)
    if (window.requestIdleCallback) requestIdleCallback(work, { timeout: 50 })
    else setTimeout(work, 0)
  }

  // Pecks while the idle period lasts. A page that never falls idle gets the
  // timeout instead (and one without idle callbacks, a plain task), and gives
  // the queue a short slice of time anyway. Always at least one root.
  work(deadline) {
    this.asked = false
    const idle = deadline && !deadline.didTimeout
    const start = performance.now()
    const more = () => (idle ? deadline.timeRemaining() > 3 : performance.now() - start < 8)
    for (let n = 0; this.queue.length && (n === 0 || more()); n++) {
      const e = this.queue.shift()
      // One released and evicted before it was pecked has nobody waiting.
      if (this.map.get(e.text) === e) this.peck(e)
    }
    if (this.queue.length) this.ask()
  }
}

const EM = 108 // the largest a root is set
const SMALLEST = 84 // below this a root on a phone stops reading as letters
const MEASURE = 0.88 * GW // the flat of the face, inside the most worn arris
const NARROWEST = 0.6
const TRACK = 0.05 // letter-spacing, in em, as cut capitals want
const PECK = 2.6 // peck radius in texels: ~1.5 mm on a 30 cm slab

let scratch = null
let em = 0

// Every root of up to five letters is set at one size, so the two stones of a
// word read as one word: the size at which the widest of them just fills the
// measure, found once from the word list. Longer roots are condensed, down to
// NARROWEST; only past that do they get smaller.
function rootSize(ctx) {
  if (em) return em
  ctx.font = font(100, { weight: 600 })
  let widest = 0
  for (const id of BY_STONE.keys()) {
    const text = stoneText(id)
    const n = [...text].length
    if (n <= 5) widest = Math.max(widest, ctx.measureText(text).width / 100 + TRACK * (n - 1))
  }
  em = Math.max(SMALLEST, Math.min(EM, Math.floor(MEASURE / widest)))
  return em
}

// Pecked, not printed: the root is set in a scratch canvas, then rebuilt as
// a field of overlapping pecks — small discs, each struck where the letter is
// and each breaking the skin to its own lightness — so the edge comes out
// scalloped and a few strays land just outside it, as a hammerstone leaves
// them. Packed for the shader as two bytes a texel, r coverage and
// g brightness: the face's few hundred kilobytes, mipmaps and all.
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
  const full = rootSize(ctx)
  let size = full
  let m = measure(size)
  let squeeze = Math.min(1, MEASURE / m.width)
  if (squeeze < NARROWEST) {
    size = Math.floor((full * squeeze) / NARROWEST)
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

  // Only the letters' box is worked, with room round it for the tilt and the
  // strays: on most roots, under half the face.
  const ext = ctx.measureText(text)
  const pad = Math.ceil(PECK * 4)
  const left = Math.max(0, Math.floor(x0 - pad))
  const top = Math.max(0, Math.floor(base - ext.actualBoundingBoxAscent - pad))
  const bw = Math.min(GW, Math.ceil(x0 + m.width * squeeze + pad)) - left
  const bh = Math.min(GH, Math.ceil(base + ext.actualBoundingBoxDescent + pad)) - top
  const ink = ctx.getImageData(left, top, bw, bh).data
  const inside = (x, y) => {
    const i = Math.round(y) * bw + Math.round(x)
    return x < 0 || y < 0 || x > bw - 1 || y > bh - 1 ? 0 : ink[i * 4] / 255
  }

  const cover = new Float32Array(bw * bh)
  const bright = new Float32Array(bw * bh)
  const strike = (cx, cy, r, b) => {
    const reach = r + 0.5
    const x1 = Math.max(0, Math.floor(cx - reach))
    const x2 = Math.min(bw - 1, Math.ceil(cx + reach))
    const y1 = Math.max(0, Math.floor(cy - reach))
    const y2 = Math.min(bh - 1, Math.ceil(cy + reach))
    for (let y = y1; y <= y2; y++) {
      const dy = y + 0.5 - cy
      for (let x = x1; x <= x2; x++) {
        const dx = x + 0.5 - cx
        const d2 = dx * dx + dy * dy
        if (d2 >= reach * reach) continue
        const a = Math.min(1, reach - Math.sqrt(d2))
        const i = y * bw + x
        if (a > cover[i]) cover[i] = a
        if (a > 0.5) bright[i] = b
      }
    }
  }
  // A jittered grid of strikes over the letters, thick enough to close up,
  // with the edge left to chance; then a few strays just outside.
  const step = PECK * 1.15
  for (let y = step / 2; y < bh; y += step) {
    for (let x = step / 2; x < bw; x += step) {
      const cx = x + (rng() - 0.5) * step
      const cy = y + (rng() - 0.5) * step
      const v = inside(cx, cy)
      const r = PECK * (0.75 + rng() * 0.5)
      const b = 0.35 + 0.65 * rng() * rng() + 0.35 * rng()
      if (v > 0.38 + rng() * 0.3) {
        strike(cx, cy, r, Math.min(1, b))
      } else if (v > 0.02 && rng() < 0.12) {
        const stray = PECK * 2
        strike(cx + (rng() - 0.5) * stray, cy + (rng() - 0.5) * stray, r * 0.7, b * 0.7)
      }
    }
  }

  // Into the face's texture, the rest of which stays unpecked (zero).
  const data = new Uint8Array(GW * GH * 2)
  for (let y = 0; y < bh; y++) {
    // Canvas rows run down, texture rows up.
    const row = (GH - 1 - (top + y)) * GW + left
    for (let x = 0; x < bw; x++) {
      const i = y * bw + x
      data[(row + x) * 2] = Math.round(cover[i] * 255)
      data[(row + x) * 2 + 1] = Math.round(bright[i] * 255)
    }
  }
  return glyphTexture(data, GW, GH)
}

function glyphTexture(data, w, h) {
  const tex = new THREE.DataTexture(data, w, h, THREE.RGFormat)
  tex.unpackAlignment = 1
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 4
  tex.needsUpdate = true
  // Once it is on the GPU the bytes aren't needed again; letting them go
  // keeps a couple of hundred kilobytes a root out of the page's memory.
  tex.onUpdate = () => {
    tex.image.data = null
  }
  return tex
}

// FNV-1a over the code units: a root's pecking is the same every time.
function hash(text) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193)
  return h >>> 0
}
