// stage.js — table, lights, fog/background and the camera rig around the book.

import * as THREE from 'three'
import { W, H, OVERHANG, T } from './dims.js'
import { YS } from './layout.js'
import { drawTablePool, toTexture } from './textures.js'

const DEG = Math.PI / 180
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
const smooth = (x) => x * x * (3 - 2 * x)

function boxCorners(x0, x1, y0, y1, z0, z1) {
  const out = []
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) out.push(new THREE.Vector3(x, y, z))
  return out
}

const HZ = H / 2 + OVERHANG
// What must be in frame. Open: the whole spread (both boards) plus the pop-up
// volume (0.9 above the pages, over the middle of the spread). Closed: the box.
const OPEN_BOX = [
  ...boxCorners(-(W + OVERHANG), W + OVERHANG, 0, YS, -HZ, HZ),
  ...boxCorners(-0.85 * W, 0.85 * W, YS, YS + 0.9, -0.6, 0.42),
]
const CLOSED_BOX = boxCorners(-(W + OVERHANG) / 2 - 0.01, (W + OVERHANG) / 2 + 0.01, 0, T, -HZ, HZ)

// Allowed NDC extents [x, top, bottom] — the bottom keeps room for the HUD.
const OPEN_MARGIN = [1 / 1.06, 0.9, 0.8]
const CLOSED_MARGIN = [0.8, 0.8, 0.72]

export class Stage {
  constructor({ renderer, scene, camera, quality = 'high', reducedMotion = false }) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    this.reducedMotion = reducedMotion
    this.bg = new THREE.Color('#12100e')
    scene.background = this.bg
    scene.fog = new THREE.Fog(this.bg.clone(), 4, 12)

    // ---- lights --------------------------------------------------------------
    // Warm key from upper-left-front, the only shadow caster.
    const key = new THREE.DirectionalLight('#ffe6c4', 2.7)
    key.position.set(-2.3, 4.5, 2.7)
    key.target.position.set(0, 0, 0)
    key.castShadow = true
    const size = quality === 'low' ? 1024 : 2048
    key.shadow.mapSize.set(size, size)
    const sc = key.shadow.camera
    sc.left = -1.75
    sc.right = 1.75
    sc.top = 1.75
    sc.bottom = -1.75
    sc.near = 2
    sc.far = 9.5
    // Thin double-sided cards self-shadow: a small depth bias plus a normal
    // offset (in world units, ≈ two shadow texels) keeps them clean without
    // detaching the contact shadows ("peter-panning").
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 0.012
    key.shadow.radius = 18 // VSM blur: a soft, paper-lamp penumbra
    key.shadow.blurSamples = 20
    scene.add(key, key.target)
    this.key = key

    this.hemi = new THREE.HemisphereLight('#f3e8d8', '#1a1411', 0.62)
    scene.add(this.hemi)

    // Accent light above the spine, tinted with the spread's accent.
    this.accent = new THREE.PointLight('#e3bf86', 1.2, 0, 2)
    this.accent.position.set(0, 1.25, 0.22)
    scene.add(this.accent)
    this.accentColor = new THREE.Color('#e3bf86')

    // ---- table ---------------------------------------------------------------
    const tableTex = toTexture(drawTablePool(), { srgb: false })
    this.tableMat = new THREE.MeshStandardMaterial({ color: '#2c241f', roughness: 0.95, metalness: 0, map: tableTex })
    const table = new THREE.Mesh(new THREE.CircleGeometry(9, 96).rotateX(-Math.PI / 2), this.tableMat)
    table.position.y = -0.0006
    table.receiveShadow = true
    scene.add(table)
    this.table = table
    this._tableTint = new THREE.Color('#5a4a3e')

    // ---- camera rig ----------------------------------------------------------
    this.aspect = 1
    this.fits = { open: null, closed: null }
    this.parallax = new THREE.Vector2()
    this.orbit = { yaw: 0, pitch: 0, dragging: false }
    this._target = new THREE.Vector3()
    this._pos = new THREE.Vector3()
    this._right = new THREE.Vector3()
    this._up = new THREE.Vector3()
    this._dir = new THREE.Vector3()
  }

  // ---- fitting ----------------------------------------------------------------

  // Elevation of the view (degrees above the table). Portrait screens look more
  // from above and pull back instead of cropping the spread.
  elevation(closed) {
    const portrait = clamp((1.25 - this.aspect) / (1.25 - 0.6), 0, 1)
    return closed ? lerp(46, 62, portrait) * DEG : lerp(33, 55, portrait) * DEG
  }

  fit(corners, el, margin) {
    const cam = this.camera
    const tanY = Math.tan((cam.fov * DEG) / 2)
    const tanX = tanY * this.aspect
    const [mx, mt, mb] = margin
    const dir = new THREE.Vector3(0, Math.sin(el), Math.cos(el))
    const fwd = dir.clone().negate()
    const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize()
    const up = new THREE.Vector3().crossVectors(right, fwd)
    const target = new THREE.Vector3(0, 0.25, 0)
    const pos = new THREE.Vector3()
    const v = new THREE.Vector3()
    const project = (d, cb) => {
      pos.copy(target).addScaledVector(dir, d)
      for (const c of corners) {
        v.copy(c).sub(pos)
        const z = v.dot(fwd)
        cb(v.dot(right) / (z * tanX), v.dot(up) / (z * tanY), z)
      }
    }
    let dist = 3
    for (let iter = 0; iter < 5; iter++) {
      let lo = 0.4
      let hi = 40
      for (let i = 0; i < 48; i++) {
        const mid = (lo + hi) / 2
        let ok = true
        project(mid, (x, y, z) => {
          if (z <= 0.05 || Math.abs(x) > mx || y > mt || y < -mb) ok = false
        })
        if (ok) hi = mid
        else lo = mid
      }
      dist = hi
      // centre the content vertically within the allowed band
      let ymin = Infinity
      let ymax = -Infinity
      project(dist, (x, y) => {
        ymin = Math.min(ymin, y)
        ymax = Math.max(ymax, y)
      })
      const off = (ymin + ymax) / 2 - (mt - mb) / 2
      target.addScaledVector(up, off * dist * tanY)
    }
    return { dist, target, el }
  }

  resize(w, h) {
    this.aspect = w / Math.max(1, h)
    this.camera.aspect = this.aspect
    this.camera.updateProjectionMatrix()
    this.fits.open = this.fit(OPEN_BOX, this.elevation(false), OPEN_MARGIN)
    this.fits.closed = this.fit(CLOSED_BOX, this.elevation(true), CLOSED_MARGIN)
  }

  // ---- per frame --------------------------------------------------------------

  // look: { bg: Color, accent: Color, open: 0..1 }; pointer: eased {x, y}.
  update(dt, look, breath, pointer) {
    const { open, closed } = this.fits
    const o = smooth(clamp(look.open, 0, 1))
    const dist = lerp(closed.dist, open.dist, o)
    const el = lerp(closed.el, open.el, o)
    this._target.lerpVectors(closed.target, open.target, o)

    // drag-orbit eases back to rest once released
    const ob = this.orbit
    if (!ob.dragging) {
      const k = 1 - Math.exp(-dt * 2.2)
      ob.yaw += (0 - ob.yaw) * k
      ob.pitch += (0 - ob.pitch) * k
    }
    const yaw = ob.yaw
    const pitch = ob.pitch
    const e = el + pitch
    this._dir.set(Math.sin(yaw) * Math.cos(e), Math.sin(e), Math.cos(yaw) * Math.cos(e))
    this._pos.copy(this._target).addScaledVector(this._dir, dist)

    // pointer parallax (eased) + a slow breath sway
    if (!this.reducedMotion) {
      const k = 1 - Math.exp(-dt * 2.5)
      this.parallax.x += (pointer.x - this.parallax.x) * k
      this.parallax.y += (pointer.y - this.parallax.y) * k
      this._right.set(Math.cos(yaw), 0, -Math.sin(yaw))
      this._up.set(0, 1, 0)
      this._pos.addScaledVector(this._right, this.parallax.x * 0.12)
      this._pos.addScaledVector(this._up, this.parallax.y * 0.06)
      this._pos.y += 0.01 * breath.breath
    }
    this.camera.position.copy(this._pos)
    this.camera.lookAt(this._target)

    // colours: background + fog follow the spread; the table is the background
    // lifted a little toward warm umber so the book sits on something.
    this.bg.copy(look.bg)
    this.scene.fog.color.copy(look.bg)
    this.scene.fog.near = dist + 0.6
    this.scene.fog.far = dist + 6.5
    this.tableMat.color.copy(look.bg).lerp(this._tableTint, 0.32)

    // accent swells with the breath; dimmer while the book is closed
    this.accent.color.copy(look.accent)
    this.accent.intensity = (0.55 + 0.9 * o) * (0.82 + 0.36 * breath.breath)
  }
}
