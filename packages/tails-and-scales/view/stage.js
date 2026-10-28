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
//
// (V2) The perf overlay's probe (ui/perf.js), `probe`, null unless the
// overlay is on (then nothing of it runs): `drawn(renderer)` right after the
// table's render, renderer.info then counting that render alone with the
// sun's shadow pass (three resets the counts after drawing the shadow map,
// so while the probe is on they are reset by hand before the render
// instead; the race picker's windows, drawn after, reset them as ever), and
// `frame(t0, t1)` once the frame is done (its start and end on
// performance.now()). The splats the table drew (view/stats.js) are zeroed
// before each frame's render, so they count that render's.
//
// (V2) The splat-fur Bushtails (view/models/splat/splats.js): every render
// of the table's scene prepares its splats first (prepareSplats, as the
// scene's onBeforeRender: three calls it at the start of each render, once
// the world matrices and the camera, the shake's offset in it, are current,
// before it lists what to draw), for the camera drawing it, the viewport
// it draws into and the sun's direction: each figure's level of detail and
// draw order. Under ?fast nothing is drawn, so nothing is prepared. And
// the squirrels' shadows: their shadow proxies (the classic bodies, on
// SHADOW_LAYER alone) are seen by the sun's shadow camera only. That camera
// has the layer enabled, but three r160's shadow pass tests a caster's
// layers against the camera the scene is drawn by, not the shadow camera's
// (later three tests the shadow camera's), so the renderer's shadow pass is
// wrapped to draw with that layer enabled on the drawing camera too, and
// set back after: the scene's own render lists what it draws before the
// shadow pass, so a proxy is never drawn but into the shadow map. (A lost
// WebGL context, restored, makes three a new shadow map: it is wrapped
// again then.) The 'new' style's other figures cast through one such
// shadow-only mesh each too (view/models/cache.js), on the same layer.
//
// (V2) The quality (QUALITY, `quality` here, the page's: app/boot.js and
// the title's Quality switch): the cap on the renderer's pixel ratio (the
// device's, never above it), the sun's shadow map (its size; 0: none) and
// the splats a frame (view/models/splat/splats.js's budget). 'high' is the
// page as it always drew (a ratio up to 2, a 2048 map); setQuality changes
// it as the page runs (the ratio and the canvas at once; the shadows by the
// sun's castShadow, which changes the lights' state, so three makes every
// lit material's program again for it; the map remade at its new size).
// ?lowfi overrides the ratio (0.5) and the shadows (no shadow map at all),
// as it always did, and the splats: low's, whatever the quality (the
// harnesses' mode: a figure's level is chosen from the drawing buffer's
// height, a quarter of the splats at 0.5, and the frame holds 30,000).
import * as THREE from 'three'
import { clock, stepTweens } from './clock.js'
import { drawStats } from './stats.js'
import { prepareSplats, setSplatBudget, SHADOW_LAYER } from './models/splat/splats.js'

// (V2) the qualities: the pixel ratio's cap, the shadow map's size (0: no
// shadows), the splats a frame
export const QUALITY = Object.freeze({
  high: Object.freeze({ dpr: 2, shadow: 2048, splats: 150000 }),
  medium: Object.freeze({ dpr: 1.5, shadow: 1024, splats: 60000 }),
  low: Object.freeze({ dpr: 1, shadow: 0, splats: 30000 }),
})

export class Stage {
  // `lowfi`: half the pixels and no shadows (?lowfi); `fast`: ?fast;
  // (V2) `quality`: one of QUALITY's
  constructor({ lowfi = false, fast = false, quality = 'high' } = {}) {
    this.fast = fast
    this.lowfi = lowfi
    this.quality = quality
    const q = QUALITY[quality]
    const renderer = (this.renderer = new THREE.WebGLRenderer({ antialias: true }))
    renderer.setPixelRatio(lowfi ? 0.5 : Math.min(devicePixelRatio, q.dpr))
    renderer.setSize(innerWidth, innerHeight)
    renderer.shadowMap.enabled = !lowfi
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    document.body.prepend(renderer.domElement)
    setSplatBudget(lowfi ? QUALITY.low.splats : q.splats)
    // ((V2) the shadow pass sees the shadow proxies' layer: see above; and
    // again on a restored context's new shadow map, after three's own
    // listener has made it)
    const wrap = () => {
      const map = renderer.shadowMap, pass = map.render
      map.render = (lights, scene, camera) => {
        const mask = camera.layers.mask
        camera.layers.enable(SHADOW_LAYER)
        try {
          pass.call(map, lights, scene, camera)
        } finally {
          camera.layers.mask = mask
        }
      }
    }
    wrap()
    renderer.domElement.addEventListener('webglcontextrestored', wrap)

    const scene = (this.scene = new THREE.Scene())
    scene.background = new THREE.Color('#1c1712')
    scene.fog = new THREE.Fog('#1c1712', 70, 140)
    addEventListener('resize', () => renderer.setSize(innerWidth, innerHeight))
    // the floating labels and texts, over the canvas
    this.overlay = document.querySelector('#labels')
    // ((V2) the perf overlay's, while it is on)
    this.probe = null
  }

  // (V2) Draw at quality `name` (one of QUALITY's) from now on.
  setQuality(name) {
    const q = QUALITY[name], r = this.renderer, sun = this.sun
    this.quality = name
    if (this.lowfi) return
    setSplatBudget(q.splats)
    r.setPixelRatio(Math.min(devicePixelRatio, q.dpr))
    r.setSize(innerWidth, innerHeight)
    if (!sun) return
    sun.castShadow = q.shadow > 0
    if (q.shadow && q.shadow !== sun.shadow.mapSize.x) {
      sun.shadow.map?.dispose()
      sun.shadow.map = null
      sun.shadow.mapSize.set(q.shadow, q.shadow)
    }
  }

  // The sky's and the sun's light (after the camera is made, as always).
  light() {
    const scene = this.scene
    scene.add(new THREE.HemisphereLight('#d6e6ff', '#3b2a1a', 0.85))
    const sun = (this.sun = new THREE.DirectionalLight('#fff0d6', 2.3))
    sun.position.set(-16, 34, 20)
    // ((V2) as the quality has it: high's 2048 map, as ever)
    const q = QUALITY[this.quality]
    sun.castShadow = this.lowfi || q.shadow > 0
    sun.shadow.mapSize.set(q.shadow || 2048, q.shadow || 2048)
    Object.assign(sun.shadow.camera, { left: -27, right: 27, top: 22, bottom: -22, near: 5, far: 90 })
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.02
    // ((V2) the squirrels' shadow proxies: see above)
    sun.shadow.camera.layers.enable(SHADOW_LAYER)
    scene.add(sun)
    // ((V2) the splats prepared at the start of each render, lit by the sun)
    const toSun = sun.position.clone().normalize()
    scene.onBeforeRender = (renderer, scene, camera) => prepareSplats(camera, renderer, toSun, scene, 'table')
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
    const timer = new THREE.Clock(), start = performance.now()
    const frame = () => {
      requestAnimationFrame(frame)
      const probe = this.probe, t0 = probe ? performance.now() : 0
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
      drawStats.splats = 0
      if (probe) {
        this.renderer.info.autoReset = false
        this.renderer.info.reset()
      }
      rig.render(this.renderer, this.scene, shake(), !this.fast)
      if (probe) {
        probe.drawn(this.renderer)
        this.renderer.info.autoReset = true
      }
      if (after && !this.fast) after((performance.now() - start) / 1000)
      if (probe) probe.frame(t0, performance.now())
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
