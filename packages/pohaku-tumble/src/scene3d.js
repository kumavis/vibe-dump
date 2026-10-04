import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { clamp01, inOutCubic, smooth } from './ease.js'

const X = new THREE.Vector3(1, 0, 0)
const Y = new THREE.Vector3(0, 1, 0)
const INK = new THREE.Color('#141414')
const GHOST = new THREE.Color('#9b9a95')
const LIFT = 0.004

// Canonical glyph placements on a unit cube, relative to its centre. A plane
// lies in XY facing +Z with the texture's "up" along +Y; laid on the top face
// its up points along -Z, away from the viewer, so it reads upright on screen.
const TOP = {
  pos: new THREE.Vector3(0, 0.5 + LIFT, 0),
  quat: new THREE.Quaternion().setFromAxisAngle(X, -Math.PI / 2),
}
const FRONT = { pos: new THREE.Vector3(0, 0, 0.5 + LIFT), quat: new THREE.Quaternion() }

// Every turn is a quarter roll forward about X: the top face tips toward the
// viewer onto the front, and the back face — the one face the camera never
// sees — comes up on top. So the new character is printed on the back before
// the roll starts, and the old one ends up on the front, upright, as a grey
// ghost of what the word used to be. The face that was on the front goes
// underneath and is thrown away.
const ROLL = new THREE.Quaternion().setFromAxisAngle(X, Math.PI / 2)
const ROLL_INV = ROLL.clone().invert()
const BACK = {
  pos: TOP.pos.clone().applyQuaternion(ROLL_INV),
  quat: ROLL_INV.clone().multiply(TOP.quat),
}

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

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc9c4bb, 2.1))
    const sun = new THREE.DirectionalLight(0xffffff, 2.1)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    sun.shadow.radius = 6
    sun.shadow.blurSamples = 12
    sun.shadow.bias = -0.0006
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 120
    scene.add(sun, sun.target)
    this.sun = sun
    // Light from behind and to the left, high: shadows fall forward and right,
    // toward the viewer, where they can be seen; the front faces sit in the
    // soft fill and read as the darker side of the block.
    this.sunDir = new THREE.Vector3(-0.5, 1, -0.42).normalize()

    // The floor is the page itself (a CSS background, with the line drawings
    // on a canvas underneath this one). The GL floor only exists to catch
    // shadows, drawn as translucent dark over whatever is below.
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
      new THREE.ShadowMaterial({ color: 0x24201a, opacity: 0.2 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    this.cubeGeo = new RoundedBoxGeometry(1, 1, 1, 4, 0.065)
    this.cubeMat = cubeMaterial()
    this.glyphGeo = new THREE.PlaneGeometry(0.86, 0.86)
    this.blobGeo = new THREE.PlaneGeometry(2.1, 2.1)
    this.blobTex = blobTexture()
    this.glyphs = new GlyphCache(192)

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
      [...this.blocks.values()].map((b) => b.cube),
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
    const group = new THREE.Group()
    group.position.set(tile.x, 0.5, tile.z)
    const cube = new THREE.Mesh(scene3d.cubeGeo, scene3d.cubeMat)
    cube.castShadow = true
    cube.receiveShadow = true
    cube.userData.tile = tile
    group.add(cube)
    scene3d.scene.add(group)
    this.group = group
    this.cube = cube

    // Contact shadow: the tight darkening where a block meets the floor, the
    // part of ambient occlusion a shadow map is too soft to draw.
    const blob = new THREE.Mesh(
      scene3d.blobGeo,
      new THREE.MeshBasicMaterial({
        color: 0x1f1b16,
        alphaMap: scene3d.blobTex,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    )
    blob.rotation.x = -Math.PI / 2
    blob.position.set(tile.x, 0.002, tile.z)
    blob.renderOrder = -1
    scene3d.scene.add(blob)
    this.blob = blob

    this.top = this.glyph(tile.char, TOP, INK)
    this.front = null
    this.roll = null
    this.drop = null
  }

  glyph(char, place, color) {
    const tex = this.s.glyphs.acquire(char)
    const mat = new THREE.MeshBasicMaterial({
      color: color.clone(),
      map: tex,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    })
    const mesh = new THREE.Mesh(this.s.glyphGeo, mat)
    mesh.position.copy(place.pos)
    mesh.quaternion.copy(place.quat)
    this.group.add(mesh)
    return { char, mesh }
  }

  free(g) {
    if (!g) return
    this.group.remove(g.mesh)
    g.mesh.material.dispose()
    this.s.glyphs.release(g.char)
  }

  // Fall in from above, for the opening.
  dropIn(t0, dur = 0.7) {
    this.drop = { t0, dur, spin: (Math.random() - 0.5) * 0.9 }
    this.group.position.y = 99
  }

  // Tumble forward onto `char`. Returns when it will land.
  turn(char, t0, dur = 0.86) {
    if (this.roll) this.finishRoll()
    this.roll = { t0, dur, incoming: this.glyph(char, BACK, INK), hop: 0.22 + Math.random() * 0.12 }
    return t0 + dur
  }

  landsAt() {
    return this.roll ? this.roll.t0 + this.roll.dur : 0
  }

  finishRoll() {
    const { incoming } = this.roll
    this.free(this.front)
    this.front = this.top
    this.top = incoming
    this.front.mesh.position.copy(FRONT.pos)
    this.front.mesh.quaternion.copy(FRONT.quat)
    this.front.mesh.material.color.copy(GHOST)
    this.top.mesh.position.copy(TOP.pos)
    this.top.mesh.quaternion.copy(TOP.quat)
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
      // Over-rotate by a few degrees and settle back, as if the block landed
      // with a little momentum left.
      const e = t < 0.8 ? 1.04 * inOutCubic(t / 0.8) : 1.04 - 0.04 * smooth((t - 0.8) / 0.2)
      const a = e * (Math.PI / 2)
      g.quaternion.setFromAxisAngle(X, a)
      // A cube rotating in place has to rise to keep its edge off the floor.
      lift = 0.5 * (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a))) - 0.5 + r.hop * Math.sin(Math.PI * Math.min(1, t / 0.85))
      g.position.y = 0.5 + lift
      this.top.mesh.material.color.copy(INK).lerp(GHOST, smooth(clamp01((t - 0.15) / 0.7)))
      if (this.front) this.front.mesh.material.opacity = 1 - smooth(clamp01(t / 0.5))
      if (t >= 1) this.finishRoll()
    }
    const b = this.blob
    const k = Math.min(1, lift / 1.4)
    b.material.opacity = 0.5 * (1 - k) * (1 - k)
    b.scale.setScalar(1 + k * 0.7)
  }
}

// Plain white material, darkened by height above the floor: a cheap stand-in
// for the ambient occlusion a real renderer would find where block meets
// ground. Computed in world space, so it stays put while a block rolls.
function cubeMaterial() {
  const mat = new THREE.MeshStandardMaterial({ color: 0xf7f6f2, roughness: 0.82, metalness: 0 })
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vWorldY;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvWorldY = (modelMatrix * vec4(transformed, 1.0)).y;',
      )
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vWorldY;')
      .replace(
        '#include <aomap_fragment>',
        `#include <aomap_fragment>
        float aoY = smoothstep(0.0, 0.5, vWorldY);
        aoY = aoY * aoY * (3.0 - 2.0 * aoY);
        reflectedLight.indirectDiffuse *= mix(0.5, 1.0, aoY);
        reflectedLight.directDiffuse *= mix(0.72, 1.0, aoY);`,
      )
  }
  return mat
}

// A rounded square with a soft falloff around it, as an alpha map.
function blobTexture() {
  const N = 128
  const c = document.createElement('canvas')
  c.width = c.height = N
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(N, N)
  const half = 2.1 / 2
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const x = ((i + 0.5) / N) * 2 * half - half
      const z = ((j + 0.5) / N) * 2 * half - half
      const r = 0.07
      const qx = Math.abs(x) - (0.5 - r)
      const qz = Math.abs(z) - (0.5 - r)
      const d = Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r
      const a = d <= 0 ? 1 : Math.pow(Math.max(0, 1 - d / 0.5), 2.6)
      const v = Math.round(a * 255)
      const o = (j * N + i) * 4
      img.data[o] = img.data[o + 1] = img.data[o + 2] = v
      img.data[o + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  return tex
}

// One texture per character on show, shared by every face that prints it.
// Released characters linger a while — the same few hundred keep coming back.
class GlyphCache {
  constructor(size) {
    this.size = size
    this.map = new Map()
    this.idle = []
  }

  acquire(char) {
    let e = this.map.get(char)
    if (!e) {
      e = { tex: draw(char, this.size), refs: 0 }
      this.map.set(char, e)
    }
    if (e.refs === 0) this.idle = this.idle.filter((c) => c !== char)
    e.refs++
    return e.tex
  }

  release(char) {
    const e = this.map.get(char)
    if (!e) return
    e.refs--
    if (e.refs > 0) return
    this.idle.push(char)
    while (this.idle.length > 96) {
      const old = this.idle.shift()
      this.map.get(old).tex.dispose()
      this.map.delete(old)
    }
  }
}

function draw(char, size) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `600 ${Math.round(size * 0.8)}px 'JT Serif'`
  ctx.fillText(char, size / 2, size / 2 + size * 0.02)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
