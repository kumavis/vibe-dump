// The camera (DESIGN §1.1, §2.11): the CameraRig owns the camera and its
// orbit controls, and moves them for the table: the title screen's slow
// orbit, the swing onto a battle's view as it starts (goTo a preset of
// present/camera-presets.js, fitted to the screen by fit), following the
// action on the turns the player watches (focus, the follow policy), WASD
// and the arrow keys panning, the table's shake, and the title's panel
// shift (the table slides right, out from under the title card, on a wide
// screen). The frame loop (view/stage.js) calls update() each frame, then
// render().
//
// R7 moved it out of main.js unchanged: the same camera, controls and
// numbers, so every view a player sees is today's (sim/camera-check.mjs).
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PRESETS, fovFor, orbitPose, follows, fitPose } from '../present/camera-presets.js'
import { clock, tween, easeInOut, lerp } from './clock.js'

const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2])
// how far the player may dolly out (OrbitControls clamps the camera's
// distance to it every frame): today's, unless a preset fitted farther
const MAX_DISTANCE = 75

export class CameraRig {
  constructor(renderer) {
    const L = PRESETS.landscape
    this.camera = new THREE.PerspectiveCamera(L.fov, innerWidth / innerHeight, 0.1, 400)
    this.camera.position.set(...L.pos)
    const controls = (this.controls = new OrbitControls(this.camera, renderer.domElement))
    controls.target.set(...L.target)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.maxPolarAngle = 1.32
    controls.minDistance = 5
    controls.maxDistance = MAX_DISTANCE
    controls.screenSpacePanning = false
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }
    // the HUD's 🎥: follow the action on the turns the player watches
    this.follow = true
    // the title's orbit (titleAngle: where it started, at clock time 0) and
    // how far the title card's panel still shifts the table (1 on the title,
    // 0 in battle)
    this.titleSpin = true
    this.titleAngle = PRESETS.title.orbit.angle
    this.viewShift = 1
    this.focusTween = null
    // (F1, F2) the battle's views, which the view button and V step through
    // (present/camera-presets.js viewsFor: the battle's own first), and the
    // one the camera last went to; none on the title
    this.views = []
    this.viewAt = 0
    // the keys held for panning; V the next view, Home the overview
    this.keys = new Set()
    addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return
      if (!e.repeat && (e.key === 'v' || e.key === 'V')) this.nextView()
      else if (e.key === 'Home') this.toOverview()
      this.keys.add(e.key.toLowerCase())
    })
    addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()))
    this.fitFov()
    addEventListener('resize', () => {
      this.fitFov()
      this.camera.aspect = innerWidth / innerHeight
      this.camera.updateProjectionMatrix()
    })
  }

  // the field of view for the screen's shape
  fitFov() {
    const cam = this.camera
    cam.fov = fovFor(innerWidth / innerHeight)
    cam.aspect = innerWidth / innerHeight
    cam.updateProjectionMatrix()
  }

  // A preset's pose on a screen of this aspect: a pose preset (today's
  // landscape and portrait) as it is, one given by azimuth and elevation
  // (F1's behind, F2's broadside) fitted so the board shows (the presets'
  // pure fitPose). Its fov is fovFor(aspect), which fitFov already set.
  fit(preset, aspect = innerWidth / innerHeight) {
    return fitPose(preset, aspect)
  }

  // (F1, F2) A battle's views (viewsFor's), the camera swinging onto the
  // first: the battle's own.
  setViews(views) {
    this.views = views
    this.viewAt = 0
    this.goTo(views[0])
  }

  // The next of the battle's views, round again after the last (the view
  // button, V); nothing on the title.
  nextView() {
    if (!this.views.length) return
    this.viewAt = (this.viewAt + 1) % this.views.length
    this.goTo(this.views[this.viewAt], 0.9)
  }

  // The whole board from overhead (Home): the views' last.
  toOverview() {
    if (!this.views.length) return
    this.viewAt = this.views.length - 1
    this.goTo(this.views[this.viewAt], 0.9)
  }

  // Swing from wherever the camera is onto a preset (a battle's view as it
  // starts: viewsFor's first), fitted to the screen, sliding the table back
  // from under the title's panel. A preset fitted farther than the dolly's
  // limit (a portrait broadside's, up to 105") raises it to its max, or the
  // controls would pull the camera back in on the first frame.
  goTo(preset, seconds = 1.4) {
    this.titleSpin = false
    const camera = this.camera, controls = this.controls
    const pose = this.fit(preset)
    controls.maxDistance = Math.max(MAX_DISTANCE, preset.max ?? MAX_DISTANCE)
    const p0 = camera.position.clone(), t0 = controls.target.clone()
    const pos = v3(pose.pos), target = v3(pose.target)
    tween(seconds, (k) => {
      this.viewShift = 1 - k
      camera.position.lerpVectors(p0, pos, k)
      controls.target.lerpVectors(t0, target, k)
    }, easeInOut)
  }

  // Back to the title's orbit, picking it up where it would be now.
  toTitle() {
    this.views = []
    this.titleSpin = true
    this.controls.maxDistance = MAX_DISTANCE
    this.titleAngle -= clock.time * PRESETS.title.orbit.speed
    this.viewShift = 1
  }

  // Follow the action to (x, z) (a `focus` event), as the follow policy
  // says: the stage and the seat to act as the table shows them (a focus
  // plays while the match has run ahead), and the seats played here.
  focus(x, z, { stage, active, localSeats }) {
    if (!follows({ follow: this.follow, stage, active, localSeats })) return
    const camera = this.camera, controls = this.controls
    const t0 = controls.target.clone()
    const d = Math.hypot(x - t0.x, z - t0.z)
    if (d < 6) return
    const off = camera.position.clone().sub(t0)
    const tgt = new THREE.Vector3(lerp(t0.x, x, 0.6), 0, lerp(t0.z, z, 0.6))
    const id = (this.focusTween = {})
    tween(0.9, (k) => {
      if (this.focusTween !== id) return
      controls.target.lerpVectors(t0, tgt, k)
      camera.position.copy(controls.target).add(off)
    }, easeInOut)
  }

  // keyboard panning, in wall-clock seconds
  panKeys(dt) {
    const camera = this.camera, controls = this.controls, keys = this.keys
    const v = new THREE.Vector3()
    const fwd = new THREE.Vector3().subVectors(controls.target, camera.position).setY(0).normalize()
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x)
    if (keys.has('w') || keys.has('arrowup')) v.add(fwd)
    if (keys.has('s') || keys.has('arrowdown')) v.sub(fwd)
    if (keys.has('d') || keys.has('arrowright')) v.add(right)
    if (keys.has('a') || keys.has('arrowleft')) v.sub(right)
    if (v.lengthSq()) {
      v.normalize().multiplyScalar(dt * 18)
      controls.target.add(v)
      camera.position.add(v)
    }
  }

  // Each frame (raw: the wall-clock seconds since the last): the title's
  // orbit, the panel shift, the keys, the controls.
  update(raw) {
    const camera = this.camera
    if (this.titleSpin) {
      const p = orbitPose(PRESETS.title.orbit, clock.time, this.titleAngle)
      camera.position.set(...p.pos)
      this.controls.target.set(...p.target)
    }
    // on the title screen the table slides right, out from under the panel
    const shift = innerWidth > 900 ? this.viewShift : 0
    if (shift > 0.001) camera.setViewOffset(innerWidth, innerHeight, -innerWidth * 0.21 * shift, 0, innerWidth, innerHeight)
    else if (camera.view?.enabled) camera.clearViewOffset()
    this.panKeys(raw)
    this.controls.update()
  }

  // Draw the frame (unless `draw` is false: ?fast), the camera jolted by
  // the table's shake (`sh`, fx's) for this frame only.
  render(renderer, scene, sh, draw = true) {
    const camera = this.camera
    const off = new THREE.Vector3((Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh, (Math.random() - 0.5) * sh)
    camera.position.add(off)
    if (draw) renderer.render(scene, camera)
    camera.position.sub(off)
  }
}
