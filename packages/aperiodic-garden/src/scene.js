// Renderer, camera, lights, and every mesh in the garden.

import * as THREE from 'three'
import {
  W,
  worldY,
  PROP_CONIFER,
  PROP_BROADLEAF,
  PROP_ROCK,
  PROP_HOUSE,
  PROP_BUSH,
  PROP_PENNANT,
} from './geometry.js'
import { cellAt, KEY } from './hat.js'
import {
  SKY_TOP,
  FOG,
  WATER_SHALLOW,
  WATER_DEEP,
  TREE_GREENS,
  AUTUMN,
  HOUSE_WALLS,
  HOUSE_ROOFS,
  ROCK_GREYS,
  LOOK,
  shade,
} from './palette.js'

const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear()

// --- prop geometries --------------------------------------------------------

function trunkGeo() {
  const g = new THREE.CylinderGeometry(0.022, 0.032, 0.15, 5, 1)
  g.translate(0, 0.075, 0)
  return g
}
function coniferGeo() {
  const g = new THREE.ConeGeometry(0.115, 0.42, 6, 1)
  g.translate(0, 0.33, 0)
  return g
}
function broadleafGeo() {
  const g = new THREE.IcosahedronGeometry(0.15, 0)
  g.scale(1, 0.86, 1)
  g.translate(0, 0.27, 0)
  return g
}
function rockGeo() {
  const g = new THREE.IcosahedronGeometry(0.1, 0)
  g.scale(1.25, 0.72, 1)
  g.translate(0, 0.05, 0)
  return g
}
function bushGeo() {
  const g = new THREE.IcosahedronGeometry(0.075, 0)
  g.scale(1.2, 0.8, 1.1)
  g.translate(0, 0.05, 0)
  return g
}
function houseBodyGeo() {
  const g = new THREE.BoxGeometry(0.2, 0.13, 0.16)
  g.translate(0, 0.065, 0)
  return g
}
function poleGeo() {
  const g = new THREE.CylinderGeometry(0.013, 0.016, 0.5, 5, 1)
  g.translate(0, 0.25, 0)
  return g
}
function pennantGeo() {
  // A triangular flag, planted in every sealed region. One triangle drawn
  // double-sided — emitting front and back faces instead would leave every
  // vertex with two opposite normals averaging to zero, and the flag would
  // vanish into unlit black.
  const g = new THREE.BufferGeometry()
  g.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array([0.013, 0.5, 0, 0.013, 0.33, 0, 0.25, 0.43, 0.04]), 3),
  )
  g.computeVertexNormals()
  return g
}
function houseRoofGeo() {
  const g = new THREE.ConeGeometry(0.16, 0.11, 4, 1)
  g.rotateY(Math.PI / 4)
  g.translate(0, 0.185, 0)
  return g
}

class Instancer {
  constructor(scene, geo, colour, { shadow = true, side } = {}) {
    this.geo = geo
    this.mat = new THREE.MeshLambertMaterial({ color: colour ?? 0xffffff, side: side ?? THREE.FrontSide })
    this.scene = scene
    this.mesh = null
    this.shadow = shadow
    this.cap = 0
  }
  set(list) {
    const n = list.length
    if (n > this.cap) {
      if (this.mesh) {
        this.scene.remove(this.mesh)
        this.mesh.dispose()
      }
      this.cap = Math.max(64, Math.ceil(n * 1.6))
      this.mesh = new THREE.InstancedMesh(this.geo, this.mat, this.cap)
      this.mesh.castShadow = this.shadow
      this.mesh.receiveShadow = false
      this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.cap * 3), 3)
      this.scene.add(this.mesh)
    }
    if (!this.mesh) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const pos = new THREE.Vector3()
    const scl = new THREE.Vector3()
    const col = new THREE.Color()
    for (let i = 0; i < n; i++) {
      const p = list[i]
      pos.set(p.x, p.y, p.z)
      q.setFromAxisAngle(UP, p.rot)
      scl.set(p.s, p.sy ?? p.s, p.s)
      m.compose(pos, q, scl)
      this.mesh.setMatrixAt(i, m)
      col.set(p.colour ?? 0xffffff).convertSRGBToLinear()
      this.mesh.instanceColor.setXYZ(i, col.r, col.g, col.b)
    }
    this.mesh.count = n
    this.mesh.instanceMatrix.needsUpdate = true
    this.mesh.instanceColor.needsUpdate = true
    this.mesh.frustumCulled = false
  }
}
const UP = new THREE.Vector3(0, 1, 0)

// --- water ------------------------------------------------------------------

const WATER_VERT = /* glsl */ `
  uniform float uTime;
  varying vec3 vPos;
  varying float vWave;
  #include <common>
  #include <fog_pars_vertex>
  void main() {
    vec3 p = position;
    float w = sin(p.x * 2.9 + uTime * 1.15) * 0.5 + sin(p.z * 2.3 - uTime * 0.95) * 0.5;
    p.y += w * 0.011;
    vWave = w;
    vPos = p;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`
// The uniforms are linear, like every other colour in the scene; the trailing
// colorspace include is what converts the result for the framebuffer. Without
// it a ShaderMaterial writes linear values straight out and the river comes out
// looking like ink.
const WATER_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  varying vec3 vPos;
  varying float vWave;
  #include <common>
  #include <fog_pars_fragment>
  void main() {
    vec3 c = mix(uDeep, uShallow, 0.42 + 0.34 * vWave);
    float ripple = sin(vPos.x * 11.0 + uTime * 1.9) * sin(vPos.z * 8.5 - uTime * 1.35);
    c += smoothstep(0.72, 1.0, ripple) * 0.12;
    float glint = sin(vPos.x * 24.0 - uTime * 2.6) * sin(vPos.z * 19.0 + uTime * 1.7);
    c += smoothstep(0.93, 1.0, glint) * 0.35;
    gl_FragColor = vec4(c, 0.92);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`

// --- the scene --------------------------------------------------------------

export class Garden {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene = new THREE.Scene()
    this.scene.background = skyTexture()
    this.scene.fog = new THREE.Fog(lin(FOG), 26, 62)

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.5, 200)

    const hemi = new THREE.HemisphereLight(lin(SKY_TOP), lin(0x6f6e58), 1.32)
    this.scene.add(hemi)
    this.sun = new THREE.DirectionalLight(lin(0xfff3dd), 2.3)
    this.sun.position.set(-8, 14, 7)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.camera.near = 1
    this.sun.shadow.camera.far = 60
    this.sun.shadow.bias = -0.0012
    this.sun.shadow.normalBias = 0.02
    this.scene.add(this.sun)
    this.scene.add(this.sun.target)

    // A shallow plate under the garden so it sits on something. It is sized to
    // the garden each rebuild and tinted near the fog, so its rim dissolves.
    this.haze = new THREE.Mesh(
      new THREE.CircleGeometry(1, 72),
      new THREE.MeshBasicMaterial({
        color: lin(0xbfd2ce),
        transparent: true,
        opacity: 0.9,
        alphaMap: fadeTexture(),
        depthWrite: false,
      }),
    )
    this.haze.rotation.x = -Math.PI / 2
    this.haze.position.y = -0.62
    this.scene.add(this.haze)

    this.landMat = new THREE.MeshLambertMaterial({ vertexColors: true })
    this.land = new THREE.Mesh(new THREE.BufferGeometry(), this.landMat)
    this.land.castShadow = true
    this.land.receiveShadow = true
    this.land.frustumCulled = false
    this.scene.add(this.land)

    this.waterUniforms = {
      ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
      uTime: { value: 0 },
      uShallow: { value: lin(WATER_SHALLOW) },
      uDeep: { value: lin(WATER_DEEP) },
    }
    this.waterMat = new THREE.ShaderMaterial({
      uniforms: this.waterUniforms,
      fog: true,
      vertexShader: WATER_VERT,
      fragmentShader: WATER_FRAG,
      transparent: true,
      depthWrite: false,
    })
    this.water = new THREE.Mesh(new THREE.BufferGeometry(), this.waterMat)
    this.water.frustumCulled = false
    this.water.renderOrder = 2
    this.scene.add(this.water)

    this.props = {
      trunk: new Instancer(this.scene, trunkGeo(), 0x6a4f3a),
      conifer: new Instancer(this.scene, coniferGeo()),
      broadleaf: new Instancer(this.scene, broadleafGeo()),
      rock: new Instancer(this.scene, rockGeo()),
      bush: new Instancer(this.scene, bushGeo()),
      houseBody: new Instancer(this.scene, houseBodyGeo()),
      houseRoof: new Instancer(this.scene, houseRoofGeo()),
      pole: new Instancer(this.scene, poleGeo(), 0x8a6f4f),
      pennant: new Instancer(this.scene, pennantGeo(), 0xffffff, { side: THREE.DoubleSide }),
    }

    // The held tile is solid, not translucent — a ghosted one reads as a
    // rendering fault on this palette. It floats, bobs, and casts a real shadow
    // onto the garden, which is what says "not placed yet" without any tint.
    this.ghostMat = new THREE.MeshLambertMaterial({ vertexColors: true })
    this.ghost = new THREE.Mesh(new THREE.BufferGeometry(), this.ghostMat)
    this.ghost.frustumCulled = false
    this.ghost.castShadow = true
    this.ghost.visible = false
    this.scene.add(this.ghost)

    this.flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.flash = new THREE.Mesh(new THREE.BufferGeometry(), this.flashMat)
    this.flash.frustumCulled = false
    this.flash.renderOrder = 4
    this.flash.visible = false
    this.scene.add(this.flash)
    this.flashT = 0

    // camera rig
    this.target = new THREE.Vector3(0, 0, 0)
    this.wantTarget = new THREE.Vector3(0, 0, 0)
    this.dist = 22
    this.wantDist = 22
    this.azimuth = -0.62
    this.polar = 0.74
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    this.ray = new THREE.Raycaster()
    this._v = new THREE.Vector3()
  }

  resize(w, h) {
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    if (this.lastBounds) this.frame(this.lastBounds)
  }

  // --- content ---------------------------------------------------------------

  setGarden(bundle, bounds) {
    applyBuf(this.land.geometry, bundle.land)
    applyBuf(this.water.geometry, bundle.water)

    const lists = { trunk: [], conifer: [], broadleaf: [], rock: [], bush: [], houseBody: [], houseRoof: [], pole: [], pennant: [] }
    for (const p of bundle.props) {
      switch (p.type) {
        case PROP_CONIFER:
          lists.trunk.push(p)
          lists.conifer.push({ ...p, colour: TREE_GREENS[Math.floor(p.tint * TREE_GREENS.length) % TREE_GREENS.length] })
          break
        case PROP_BROADLEAF:
          lists.trunk.push(p)
          lists.broadleaf.push({
            ...p,
            colour: p.tint > 0.86 ? AUTUMN[p.tint > 0.94 ? 1 : 0] : TREE_GREENS[Math.floor(p.tint * 4) % 4],
          })
          break
        case PROP_ROCK:
          lists.rock.push({ ...p, colour: ROCK_GREYS[Math.floor(p.tint * 3) % 3] })
          break
        case PROP_BUSH:
          lists.bush.push({ ...p, colour: TREE_GREENS[Math.floor(p.tint * 4) % 4] })
          break
        case PROP_HOUSE:
          lists.houseBody.push({ ...p, colour: HOUSE_WALLS[Math.floor(p.tint * 3) % 3] })
          lists.houseRoof.push({ ...p, colour: HOUSE_ROOFS[Math.floor(p.tint * 4) % 4] })
          break
        case PROP_PENNANT:
          lists.pole.push(p)
          lists.pennant.push({ ...p, colour: shade(LOOK[p.biome].top, 1.3) })
          break
        default:
          break
      }
    }
    for (const k of Object.keys(lists)) this.props[k].set(lists[k])

    if (bounds) this.fitShadow(bounds)
  }

  fitShadow({ cx, cz, r }) {
    const c = this.sun.shadow.camera
    const pad = r + 3
    c.left = -pad
    c.right = pad
    c.top = pad
    c.bottom = -pad
    c.far = pad * 4 + 34
    c.updateProjectionMatrix()
    this.sunRadius = pad
    this.scene.fog.near = Math.max(16, r * 1.7)
    this.scene.fog.far = this.scene.fog.near + r * 2.6 + 30
    this.haze.position.set(cx, -0.62, cz)
    this.haze.scale.setScalar(r + 7)
  }

  setGhost(buf) {
    if (!buf) {
      this.ghost.visible = false
      return
    }
    applyBuf(this.ghost.geometry, buf)
    this.ghost.visible = true
  }

  playFlash(buf) {
    applyBuf(this.flash.geometry, buf)
    this.flash.visible = true
    this.flashT = 1
  }

  // --- camera ----------------------------------------------------------------

  frame(bounds, instant = false) {
    const { cx, cz, r, maxY = 1 } = bounds
    this.lastBounds = bounds
    // Fit properly rather than guessing: at this camera pitch a garden of world
    // radius r covers 2r·sin(elevation) vertically, plus whatever the massif
    // adds. Guessing a multiplier leaves the garden hanging off the bottom of
    // the screen the moment it grows in one direction more than the other.
    const elev = Math.PI / 2 - this.polar
    const half = Math.tan((this.camera.fov * Math.PI) / 360)
    const vert = r * Math.sin(elev) + maxY * 0.5 * Math.cos(elev) + 0.9
    const horiz = r + 0.9
    this.wantTarget.set(cx, maxY * 0.3, cz)
    this.wantDist = Math.max(9, Math.max(vert / half, horiz / (half * this.camera.aspect)) * 0.96)
    if (instant) {
      this.target.copy(this.wantTarget)
      this.dist = this.wantDist
    }
  }

  orbit(dx, dy) {
    this.azimuth -= dx * 0.006
    this.polar = Math.min(1.42, Math.max(0.28, this.polar - dy * 0.005))
  }

  zoom(f) {
    this.wantDist = Math.min(90, Math.max(5, this.wantDist * f))
  }

  pan(dx, dy) {
    const s = this.dist * 0.0016
    const ca = Math.cos(this.azimuth)
    const sa = Math.sin(this.azimuth)
    this.wantTarget.x += (-dx * ca - dy * sa) * s
    this.wantTarget.z += (-dx * -sa - dy * ca) * s
  }

  updateCamera(dt) {
    const k = 1 - Math.pow(0.0015, dt)
    this.target.lerp(this.wantTarget, k)
    this.dist += (this.wantDist - this.dist) * k
    const sp = Math.sin(this.polar)
    this.camera.position.set(
      this.target.x + this.dist * sp * Math.sin(this.azimuth),
      this.target.y + this.dist * Math.cos(this.polar),
      this.target.z + this.dist * sp * Math.cos(this.azimuth),
    )
    this.camera.lookAt(this.target)

    // Keep the sun a fixed 48° off the camera's shoulder. Orbit a fixed sun and
    // half the turns leave the garden flat or backlit; carry it with the camera
    // and the light is always raking across the tiles, whichever way you look.
    const pad = this.sunRadius ?? 10
    const az = this.azimuth + 0.84
    this.sun.position.set(
      this.target.x + pad * 0.8 * Math.sin(az),
      this.target.y + pad * 1.15 + 5,
      this.target.z + pad * 0.8 * Math.cos(az),
    )
    this.sun.target.position.copy(this.target)
    this.sun.target.updateMatrixWorld()
  }

  /**
   * Screen point → kite cell. Rather than raycasting fifty thousand triangles on
   * every mouse move, intersect the ground plane, read the height of whatever
   * cell that lands in, and intersect again at that height. Two corrections is
   * plenty even on the shoulder of the mountain.
   */
  pick(nx, ny, game) {
    this.ray.setFromCamera({ x: nx, y: ny }, this.camera)
    let y = 0.2
    let cell = null
    for (let i = 0; i < 3; i++) {
      this.plane.constant = -y
      const hit = this.ray.ray.intersectPlane(this.plane, this._v)
      if (!hit) return null
      const [a, b, k] = cellAt(hit.x / W, hit.z / W)
      cell = KEY(a, b, k)
      const e = game.elev.get(cell)
      const ny2 = e === undefined ? 0.2 : worldY(e)
      if (Math.abs(ny2 - y) < 0.01) break
      y = ny2
    }
    return { cell, point: this._v.clone() }
  }

  project(x, y, z) {
    this._v.set(x, y, z).project(this.camera)
    return this._v
  }

  render(dt, t) {
    this.waterUniforms.uTime.value = t
    if (this.ghost.visible) this.ghost.position.y = Math.sin(t * 1.7) * 0.035
    if (this.flashT > 0) {
      this.flashT = Math.max(0, this.flashT - dt * 1.15)
      const f = this.flashT
      this.flashMat.opacity = Math.sin(Math.min(1, f) * Math.PI) * 0.5
      this.flash.visible = this.flashT > 0
    }
    this.renderer.render(this.scene, this.camera)
  }
}

/** A disc that is opaque in the middle and gone at the rim. */
function fadeTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 6, 64, 64, 64)
  grad.addColorStop(0, '#fff')
  grad.addColorStop(0.45, '#fff')
  grad.addColorStop(1, '#000')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

/** A soft vertical gradient, drawn as a full-screen background. */
function skyTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 256
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#9fc4dc')
  grad.addColorStop(0.45, '#c9dfe8')
  grad.addColorStop(0.78, '#e4eee6')
  grad.addColorStop(1, '#eef1e4')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function applyBuf(geo, buf) {
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buf.pos), 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(buf.nrm), 3))
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(buf.col), 3))
  geo.attributes.position.needsUpdate = true
  geo.computeBoundingSphere()
}

export { applyBuf, lin }
