// CHIMERA heads on the stage.
//
// Each puppet owns one vendored `Anatomy3D` scene (its body's geometry, face springs, airflow
// particles). All of them are drawn by ONE shared THREE.WebGLRenderer on an offscreen canvas: per
// head we aim that head's camera, render into a square tile at the canvas's bottom-left, and the
// stage copies the tile onto its 2D canvas (additively, over a dark occluder) straight away. Heads
// are drawn one after another in depth order, so overlap and costumes layer correctly.
//
// We place each camera ourselves (no OrbitControls): azimuth 0 = profile facing screen-right,
// π/2 = facing the camera, π = profile facing left (Anatomy3D.poses() uses 0.62 / π−0.62 for its
// three-quarter views).
import * as THREE from 'three'
import { Anatomy3D } from '../../chimera/ui/render/anatomy3d.ts'
import { VoiceModel } from '../../chimera/ui/analysis.ts'
import { NEUTRAL } from '../../chimera/wasm/engine.ts'
import { withPalette } from './palette.js'

export const VIEW = { pressure: true, particles: true, grid: false, calipers: false }
const SAMPLE_RATE = 48000

/** the mouth at rest: lips together, jaw nearly shut */
export const REST_ARTIC = Object.freeze({ ...NEUTRAL, jaw: 0.18, lipAp: 0, lipProt: 0.1 })

const models = new Map()
/** one VoiceModel per body mix (they hold engine memory; a show has few bodies) */
export function modelFor(body) {
  const key = `${(+body.female || 0).toFixed(3)}/${(+body.child || 0).toFixed(3)}`
  let m = models.get(key)
  if (!m) {
    m = new VoiceModel({ female: +body.female || 0, child: +body.child || 0 }, SAMPLE_RATE)
    models.set(key, m)
  }
  return m
}

export const articFromArray = (a) => VoiceModel.articFromArray(a)

const tmpV = new THREE.Vector3()

export class Head {
  constructor(body, palette) {
    this.model = modelFor(body)
    this.palette = palette
    const r = (this.r = new Anatomy3D())
    r.centred = true
    r.camera.aspect = 1
    r.camera.clearViewOffset()
    r.camera.updateProjectionMatrix()
    this.tile = 0
    this.lw = 0
    this.target = new THREE.Vector3()
    // build the rest pose (bakes colours, so in this head's palette) and find its centre
    withPalette(palette, () => this.target.copy(r.poses(this.model).target))
    this.k = this.model.tract.scale
    this.half = Math.tan((r.camera.fov * Math.PI) / 360)
    this.dist = (1.1 * 15.2) / this.half
    this._hullSrc = null
  }

  /**
   * Aim the camera. az/el radians; tile = the tile's size in stage units; lw = line-width scale.
   * Must be called before update() each frame (the head's pose reads the camera).
   */
  aim(az, el, tile, lw) {
    const r = this.r
    if (Math.abs(tile - this.tile) > 0.01 || lw !== this.lw) {
      this.tile = tile
      this.lw = lw
      // private fields of the vendored renderer: its projection size and the fat lines' resolution
      r.w = r.h = tile
      r.beams.setResolution(tile / lw, tile / lw)
    }
    const d = this.dist
    const c = r.camera
    c.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(d).add(this.target)
    c.up.set(0, 1, 0)
    c.lookAt(this.target)
    c.updateMatrixWorld()
  }

  /** advance the face and rebuild this frame's beams */
  update(dt, elapsed, tele, artic, nod = 0, tilt = 0) {
    const r = this.r
    withPalette(this.palette, () => {
      r.face.update(tele, elapsed)
      r.face.nod += nod
      r.face.tilt += tilt
      this.f = this.model.frame(artic)
      r.update(this.model, this.f, artic, tele, VIEW, dt)
    })
  }

  resetMotion() {
    this.r.resetMotion()
  }

  /** a body point (cm) → tile position in stage units (origin at the tile's top-left) */
  project(x, y, z) {
    return this.r.project(x, y, z)
  }

  /** where the neck meets the collar, in tile units, and px per cm there */
  neck() {
    const rest = this.r.rest
    const k = this.k
    const y = rest.head.y0 + 3.4 * k
    const s = rest.head.at(y)
    const x = s ? (s.F + s.Bk) / 2 : rest.center.x
    const [px, py] = this.r.project(x, y, 0)
    const [fx] = this.r.project(s ? s.F : x + 4, y, 0)
    return { x: px, y: py, cm: this.r.pxPerCmAt(x, y, 0), front: fx - px }
  }

  /** the front of the lips in tile units (speech bubbles, notes, sparks) */
  mouth() {
    const f = this.f
    if (!f) return this.r.project(this.target.x + 7 * this.k, this.target.y - 4 * this.k, 0)
    const u = f.upperLip[Math.min(6, f.upperLip.length - 1)], l = f.lowerLip[Math.min(6, f.lowerLip.length - 1)]
    let x = -Infinity
    for (const p of f.upperLip) x = Math.max(x, p.x)
    return this.r.project(x, (u.y + l.y) / 2, 0)
  }

  /** the top of the head in tile units */
  crown() {
    return this.r.crown(this.model)
  }

  /** the head's silhouette (convex hull of its shell) in tile units, as a flat [x0,y0,x1,y1,…] */
  hull() {
    if (!this._hullSrc) {
      const pts = []
      for (const sk of this.r.rest.shell) for (let i = 0; i < sk.a.length; i += 9) pts.push(sk.a[i], sk.a[i + 1], sk.a[i + 2])
      this._hullSrc = new Float32Array(pts)
      this._hullXY = new Float32Array((pts.length / 3) * 2)
    }
    const src = this._hullSrc, xy = this._hullXY
    const r = this.r
    const m = r.beams.group.matrixWorld
    const w = r.w, h = r.h
    for (let i = 0, j = 0; i < src.length; i += 3, j += 2) {
      tmpV.set(src[i], src[i + 1], src[i + 2]).applyMatrix4(m).project(r.camera)
      xy[j] = ((tmpV.x + 1) / 2) * w
      xy[j + 1] = ((1 - tmpV.y) / 2) * h
    }
    return convexHull(xy)
  }

  dispose() {
    this.r.dispose()
  }
}

/** Andrew's monotone chain over flat xy → hull as flat xy (counter-clockwise) */
function convexHull(xy) {
  const n = xy.length / 2
  const idx = new Array(n)
  for (let i = 0; i < n; i++) idx[i] = i
  idx.sort((a, b) => xy[2 * a] - xy[2 * b] || xy[2 * a + 1] - xy[2 * b + 1])
  const cross = (o, a, b) => (xy[2 * a] - xy[2 * o]) * (xy[2 * b + 1] - xy[2 * o + 1]) - (xy[2 * a + 1] - xy[2 * o + 1]) * (xy[2 * b] - xy[2 * o])
  const lower = [], upper = []
  for (const i of idx) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], i) <= 0) lower.pop()
    lower.push(i)
  }
  for (let k = idx.length - 1; k >= 0; k--) {
    const i = idx[k]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], i) <= 0) upper.pop()
    upper.push(i)
  }
  upper.pop()
  lower.pop()
  const out = []
  for (const i of lower.concat(upper)) out.push(xy[2 * i], xy[2 * i + 1])
  return out
}

// ---------------------------------------------------------------- the shared renderer

export class GLHeads {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.canvas.height = 512
    this.failed = false
    this.lost = false
    this.size = 512
    try {
      this.gl = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false })
    } catch (e) {
      console.warn('heads: WebGL unavailable', e)
      this.failed = true
      return
    }
    const gl = this.gl
    // the palette's sRGB values go straight through, as on chimera's 2D screens
    gl.outputColorSpace = THREE.LinearSRGBColorSpace
    gl.setClearColor(0x000000, 1)
    gl.setPixelRatio(1)
    gl.setSize(512, 512, false)
    gl.autoClear = false
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      this.lost = true
    })
    this.canvas.addEventListener('webglcontextrestored', () => (this.lost = false))
  }

  get ok() {
    return !this.failed && !this.lost
  }

  /** render a head into a px×px tile; returns the source rect in this.canvas */
  render(head, px) {
    px = Math.max(8, Math.round(px))
    if (px > this.size) {
      this.size = Math.min(4096, Math.ceil(px / 256) * 256)
      this.gl.setSize(this.size, this.size, false)
    }
    const gl = this.gl
    gl.setViewport(0, 0, px, px)
    gl.setScissor(0, 0, px, px)
    gl.setScissorTest(true)
    gl.clear()
    gl.render(head.r.scene, head.r.camera)
    return [0, this.size - px, px, px]
  }

  dispose() {
    if (!this.gl) return
    this.gl.dispose()
    this.gl.forceContextLoss()
  }
}
