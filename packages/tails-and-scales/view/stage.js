// The stage (DESIGN §1.1): the renderer, the scene and its lights, the
// labels' overlay, and the frame loop that runs the table: each frame the
// clock advances (view/clock.js: game time at the speed button's pace, or
// near-instant under ?fast), every tween steps, the table's parts update in
// order (effects, figures, flags), the camera rig moves (view/camera.js),
// and the frame is drawn (never under ?fast, a test mode that skips
// drawing and lets game time run effectively instantly, so a whole AI
// battle replays in about a minute: logic is unaffected, every animation
// still resolves, just within a frame).
//
// R7 moved it out of main.js unchanged: the same renderer settings, fog and
// lights, and the frame's steps in the same order.
import * as THREE from 'three'
import { clock, stepTweens } from './clock.js'

export class Stage {
  // `lowfi`: half the pixels and no shadows (?lowfi); `fast`: ?fast
  constructor({ lowfi = false, fast = false } = {}) {
    this.fast = fast
    const renderer = (this.renderer = new THREE.WebGLRenderer({ antialias: true }))
    renderer.setPixelRatio(lowfi ? 0.5 : Math.min(devicePixelRatio, 2))
    renderer.setSize(innerWidth, innerHeight)
    renderer.shadowMap.enabled = !lowfi
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    document.body.prepend(renderer.domElement)

    const scene = (this.scene = new THREE.Scene())
    scene.background = new THREE.Color('#1c1712')
    scene.fog = new THREE.Fog('#1c1712', 70, 140)
    addEventListener('resize', () => renderer.setSize(innerWidth, innerHeight))
    // the floating labels and texts, over the canvas
    this.overlay = document.querySelector('#labels')
  }

  // The sky's and the sun's light (after the camera is made, as always).
  light() {
    const scene = this.scene
    scene.add(new THREE.HemisphereLight('#d6e6ff', '#3b2a1a', 0.85))
    const sun = (this.sun = new THREE.DirectionalLight('#fff0d6', 2.3))
    sun.position.set(-16, 34, 20)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    Object.assign(sun.shadow.camera, { left: -27, right: 27, top: 22, bottom: -22, near: 5, far: 90 })
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.02
    scene.add(sun)
    const fill = new THREE.DirectionalLight('#9fb8ff', 0.35)
    fill.position.set(18, 12, -16)
    scene.add(fill)
  }

  // (F8a) The fog and the sun's shadows for a board W×H: the fog from 70k to
  // 140k" (k: the board's diagonal over classic's, never under 1), the
  // shadow camera classic's ±27 by ±22 (in the sun's own view, where
  // classic's corners need about ±24.4 by ±20.5) and 90" deep, each times
  // k, so a larger board's corners cast and catch shadows too (classic's
  // exactly as ever). (F8b) On a larger board that is only where the shadow
  // camera starts: once the camera settles it is fitted to the view
  // (fitShadow), so the 2048 map's texels cover what is on screen.
  fit({ W, H }) {
    const k = Math.max(1, Math.hypot(W, H) / Math.hypot(40, 28))
    Object.assign(this.scene.fog, { near: 70 * k, far: 140 * k })
    // ((F8b) its near plane too: a fit to the view moves it)
    Object.assign(this.sun.shadow.camera, { left: -27 * k, right: 27 * k, top: 22 * k, bottom: -22 * k, near: 5, far: 90 * k })
    this.sun.shadow.camera.updateProjectionMatrix()
    // (F8b) fitted to the view on a board larger than classic's (classic
    // keeps its fixed ±27/±22: its title and boards drawn as ever)
    this.board = k > 1 ? { W, H } : null
    this.fitted = null
    this.lastPose = null
    this.fits = 0
  }

  // (F8b, DESIGN §4.2.3 and §4.2.7's "Drawing at scale" 2) The sun's shadow
  // camera fitted to the ground the view frustum takes in, clamped to the
  // board: the four rays through the screen's corners met with the table
  // (a ray at or above the horizon taken as far as the fog's end), the
  // quadrilateral clipped to the board (and its frame), and its corners in
  // the sun's own view bounding the shadow camera, with a little room. In
  // the sun's orthographic view a caster above the ground stands where its
  // shadow falls, so the ground's bounds are the casters' too; only the
  // depth must reach the tallest (MARGIN_Y above the table). Asked by the
  // frame loop once the camera has settled (never every frame); a board no
  // larger than classic's never asks it.
  fitShadow(camera) {
    if (!this.board) return false
    const { W, H } = this.board
    camera.updateMatrixWorld()
    const far = this.scene.fog.far
    const o = camera.position
    const pts = []
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const d = tmpA.set(sx, sy, 0.5).unproject(camera).sub(o).normalize()
      let t = d.y < -1e-6 ? -o.y / d.y : far
      t = Math.min(t, far)
      pts.push([o.x + d.x * t, o.z + d.z * t])
    }
    // (the board and its frame: 1" all round)
    const poly = clipRect(pts, -W / 2 - 1, W / 2 + 1, -H / 2 - 1, H / 2 + 1)
    if (poly.length < 3) return false
    const sc = this.sun.shadow.camera
    // the sun's view, as three.js's DirectionalLightShadow sets it
    sc.position.setFromMatrixPosition(this.sun.matrixWorld)
    tmpB.setFromMatrixPosition(this.sun.target.matrixWorld)
    sc.lookAt(tmpB)
    sc.updateMatrixWorld()
    const inv = sc.matrixWorldInverse
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity, z0 = Infinity, z1 = -Infinity
    for (const [x, z] of poly) for (const y of [-0.7, MARGIN_Y]) {
      tmpA.set(x, y, z).applyMatrix4(inv)
      x0 = Math.min(x0, tmpA.x), x1 = Math.max(x1, tmpA.x)
      y0 = Math.min(y0, tmpA.y), y1 = Math.max(y1, tmpA.y)
      z0 = Math.min(z0, tmpA.z), z1 = Math.max(z1, tmpA.z)
    }
    // a little room (a figure at the edge of the view keeps its shadow),
    // and never smaller than 12" across (a close view's texels stay round)
    const pad = 1.5, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    const hx = Math.max(6, (x1 - x0) / 2 + pad), hy = Math.max(6, (y1 - y0) / 2 + pad)
    Object.assign(sc, { left: cx - hx, right: cx + hx, bottom: cy - hy, top: cy + hy, near: Math.max(0.1, -z1 - 2), far: -z0 + 2 })
    sc.updateProjectionMatrix()
    this.fits++
    return true
  }

  // Run the table: `parts(dt, time)` each frame after the tweens (the
  // effects, the figures, the flags, in that order), then the camera rig
  // moves and draws, jolted by `shake()` (fx's); then (F6) `after(wall)`
  // draws into its windows of the page (wall: seconds since the page ran),
  // never under ?fast.
  run({ parts, rig, shake, after = null }) {
    const timer = new THREE.Clock(), t0 = performance.now()
    const frame = () => {
      requestAnimationFrame(frame)
      if (this.fast) clock.speed = 1e4
      const wall = timer.getDelta()
      const raw = Math.min(wall, 0.05)
      // (how much game time a wall second gives, at speed 1: under 1 when
      // frames come slower than 20 a second)
      if (wall > 0) clock.rate += (raw / wall - clock.rate) * 0.05
      const dt = raw * clock.speed * clock.boost
      clock.time += dt
      stepTweens(dt)
      parts(dt, clock.time)
      rig.update(raw)
      // (F8b) the shadows fitted to the view once the camera has rested
      // SETTLE frames (a larger board's only: fit())
      if (this.board && !this.fast) this.settleShadow(rig.camera)
      rig.render(this.renderer, this.scene, shake(), !this.fast)
      if (after && !this.fast) after((performance.now() - t0) / 1000)
    }
    frame()
  }

  // (F8b) Whether the camera has rested SETTLE frames since it last moved
  // (its world matrix and projection unchanged), and if so, and the view
  // is not the one the shadows were fitted to, fit them (fitShadow): once
  // per rest, never per frame.
  settleShadow(camera) {
    camera.updateMatrixWorld()
    const key = [...camera.matrixWorld.elements, ...camera.projectionMatrix.elements].map((v) => v.toFixed(4)).join()
    if (key !== this.lastPose) {
      this.lastPose = key
      this.still = 0
      return
    }
    if (++this.still === SETTLE && key !== this.fitted) {
      this.fitted = key
      this.fitShadow(camera)
    }
  }
}

// (F8b) how many frames the camera rests before the shadows are fitted to
// it, and how tall above the table a caster may stand (a tree's top)
const SETTLE = 8
const MARGIN_Y = 12
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3()

// A convex polygon ([[x, z]]) clipped to the rectangle x0..x1 by z0..z1
// (Sutherland-Hodgman, an edge at a time).
function clipRect(poly, x0, x1, z0, z1) {
  const edge = (pts, inside, cut) => {
    const out = []
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length]
      const ia = inside(a), ib = inside(b)
      if (ia) out.push(a)
      if (ia !== ib) out.push(cut(a, b))
    }
    return out
  }
  const atX = (x) => (a, b) => [x, a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])]
  const atZ = (z) => (a, b) => [a[0] + ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]), z]
  let p = poly
  p = edge(p, (q) => q[0] >= x0, atX(x0))
  p = edge(p, (q) => q[0] <= x1, atX(x1))
  p = edge(p, (q) => q[1] >= z0, atZ(z0))
  p = edge(p, (q) => q[1] <= z1, atZ(z1))
  return p
}
