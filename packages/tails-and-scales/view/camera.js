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
//
// (F8b) Navigation at scale (DESIGN §4.2.7): the keys pan faster as the
// camera pulls back (panSpeed); with 🎥 on, a batch opening with a member
// off screen is framed whole (frame: the circle round where its members
// stand and go); a cluster of chips is zoomed onto (frameOn); and the
// bookmark: End pressed in a seat's phase keeps the camera's pose, and that
// seat's next phase glides back to it (bookmark, resume).
//
// (F14) Following an action played on its own (cue): view/player.js tells
// the rig of each action that plays alone, as it opens (where its actors
// stand and go, and where to glide), and the rig makes one move for it, as
// for a batch: if any actor is off screen it frames them all, else it
// glides toward the action as a focus does. So a human opponent's move,
// shot or charge (online, watched, replayed) swings the camera as the AI's
// always did, never an action of a seat played here (cues), and the
// bookmark still takes the camera back for that seat's next phase.
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PRESETS, fovFor, orbitPose, follows, fitPose, BOARD_RECT, boardRect, reachOf, panSpeed, circleOf, framePose, frames, cues } from '../present/camera-presets.js'
import { clock, tween, easeInOut, lerp } from './clock.js'

const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2])
const xyzOf = (v) => [v.x, v.y, v.z]
// how far the player may dolly out (OrbitControls clamps the camera's
// distance to it every frame): today's, unless a preset fitted farther
// (F8a: or a larger board's overview, setBoard)
const MAX_DISTANCE = 75
// the far plane: classic's (F8a: farther for a larger board)
const FAR = 400

export class CameraRig {
  constructor(renderer) {
    const L = PRESETS.landscape
    this.camera = new THREE.PerspectiveCamera(L.fov, innerWidth / innerHeight, 0.1, FAR)
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
    // ((F8b's review) the view swing's token: goTo)
    this.goTween = null
    // (F1, F2) the battle's views, which the view button and V step through
    // (present/camera-presets.js viewsFor: the battle's own first), and the
    // one the camera last went to; none on the title
    this.views = []
    this.viewAt = 0
    // (F8a) the board the views are fitted to (classic's until a match's
    // mission chooses another: setBoard) and how far the dolly reaches on it
    this.rect = BOARD_RECT
    this.dolly = MAX_DISTANCE
    // (F8b) the bookmarks: seat → { seat, pos, target }, where the camera
    // was as that seat pressed End, until its next phase begins ((F8b's
    // review) one per seat: with one slot, hotseat's other seat's End wrote
    // over the first's before its next phase could glide back); and how
    // often a batch ((F14) or an action played alone) was framed
    this.marks = new Map()
    this.framed = 0
    // ((F14) how often the follow policy moved the camera: a batch or an
    // action framed, a focus glided to; ?debug's camera())
    this.followed = 0
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
    return fitPose(preset, aspect, this.rect)
  }

  // (F8a) The views fitted to a match's board W×H from now on: on a larger
  // board than classic's the dolly reaches the overview's fit and a tenth
  // more (DESIGN §4.2.3: max(75, overview fit × 1.1)), and the far plane
  // three times the overview's reach (max(400, 3 × its max × the board's
  // reach)). Classic keeps its 75 and 400 exactly.
  setBoard({ W, H }) {
    this.rect = boardRect({ W, H })
    const k = reachOf(this.rect)
    const overview = fitPose(PRESETS.overview, innerWidth / innerHeight, this.rect)
    const d = Math.hypot(overview.pos[0] - overview.target[0], overview.pos[1] - overview.target[1], overview.pos[2] - overview.target[2])
    this.dolly = k > 1 ? Math.max(MAX_DISTANCE, d * 1.1) : MAX_DISTANCE
    this.camera.far = k > 1 ? Math.max(FAR, 3 * PRESETS.overview.max * k) : FAR
    this.camera.updateProjectionMatrix()
    if (this.views.length) this.controls.maxDistance = Math.max(this.controls.maxDistance, this.dolly)
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
  // ((F8b's review) A glide the player or the table asks for since (toPose:
  // a cluster's zoom, a batch framed, the bookmark; glide: Tab) takes the
  // camera from it: before, the swing went on writing the camera until it
  // ended, so a cluster tapped during Home's glide zoomed in and was then
  // pulled back out. Only the camera: the table's slide still finishes.)
  goTo(preset, seconds = 1.4) {
    this.titleSpin = false
    const camera = this.camera, controls = this.controls
    const pose = this.fit(preset)
    controls.maxDistance = Math.max(this.dolly, (preset.max ?? 0) * reachOf(this.rect))
    const p0 = camera.position.clone(), t0 = controls.target.clone()
    const pos = v3(pose.pos), target = v3(pose.target)
    // (and it takes the camera from any glide before it, the same way)
    this.focusTween = null
    const id = (this.goTween = {})
    tween(seconds, (k) => {
      this.viewShift = 1 - k
      if (this.goTween !== id) return
      camera.position.lerpVectors(p0, pos, k)
      controls.target.lerpVectors(t0, target, k)
    }, easeInOut)
  }

  // Back to the title's orbit, picking it up where it would be now.
  toTitle() {
    this.views = []
    this.marks.clear()
    this.titleSpin = true
    this.controls.maxDistance = MAX_DISTANCE
    this.titleAngle -= clock.time * PRESETS.title.orbit.speed
    this.viewShift = 1
  }

  // Follow the action to (x, z) (a `focus` event), as the follow policy
  // says: the stage and the seat to act as the table shows them (a focus
  // plays while the match has run ahead), and the seats played here.
  // ((F14) True if the camera glides: not when it looks within 6" of it.)
  focus(x, z, { stage, active, localSeats }) {
    if (!follows({ follow: this.follow, stage, active, localSeats })) return false
    const camera = this.camera, controls = this.controls
    const t0 = controls.target.clone()
    const d = Math.hypot(x - t0.x, z - t0.z)
    if (d < 6) return false
    const off = camera.position.clone().sub(t0)
    const tgt = new THREE.Vector3(lerp(t0.x, x, 0.6), 0, lerp(t0.z, z, 0.6))
    this.followed++
    const id = (this.focusTween = {})
    tween(0.9, (k) => {
      if (this.focusTween !== id) return
      controls.target.lerpVectors(t0, tgt, k)
      camera.position.copy(controls.target).add(off)
    }, easeInOut)
    return true
  }

  // (F10a) Glide to (x, z), as the player asks (Tab to the next unit to
  // act): whatever the follow policy says.
  glide(x, z) {
    const camera = this.camera, controls = this.controls
    const t0 = controls.target.clone(), off = camera.position.clone().sub(t0)
    const tgt = new THREE.Vector3(x, 0, z)
    this.goTween = null
    const id = (this.focusTween = {})
    tween(0.6, (k) => {
      if (this.focusTween !== id) return
      controls.target.lerpVectors(t0, tgt, k)
      camera.position.copy(controls.target).add(off)
    }, easeInOut)
  }

  // ── (F8b) Framing, the bookmark ─────────────────────────────────────────
  // A batch opens (view/player.js's frame: `points`, where its members stand
  // and go): with 🎥 on and the turn one the camera follows (or the seat's
  // own orders, played after its End: the bookmark's seat), if any of them
  // is off screen, the camera glides to frame the circle round them all,
  // looking the way it looks. True if it does (the batch's focus events are
  // then left out).
  frame(points, { stage, active, localSeats }) {
    if (!points.length || !frames({ follow: this.follow, stage, active, localSeats, ended: this.marks.has(active) ? active : -1 })) return false
    return this.frameAll(points)
  }

  // ((F8b) frame's, and (F14) cue's) If any of `points` is off screen, the
  // camera glides to frame the circle round them all (framePose, as near as
  // takes it in whole, from twice the dolly's least distance to its
  // limit), looking the way it looks. True if it does.
  frameAll(points) {
    if (!this.offScreen(points)) return false
    this.framed++
    this.followed++
    this.toPose(framePose(circleOf(points), this.pose(), innerWidth / innerHeight, { min: this.controls.minDistance * 2, max: this.controls.maxDistance }), 0.9)
    return true
  }

  // (F14) An action played on its own opens (view/player.js's cue, from
  // present/camera-presets.js's cueAt): `points`, where its actors stand
  // and go; (x, z), where the camera glides if they are all on screen; and
  // `own`, whether it carries a focus of its own (the AI's, a fight's: the
  // follow policy as frames has it), else it is a seat's command (cues:
  // never one of a seat played here, unless its orders after its End). One
  // move of the camera for the whole action, as a batch gets: its actors
  // framed if any is off screen (frameAll, as frame frames a batch's
  // members), else a glide toward (x, z) as focus makes (none within 6",
  // nor in a turn the camera doesn't follow: a seat's own orders after its
  // End are framed, never glided to). True if the camera moves.
  cue({ points, x, z, own }, { stage, active, localSeats }) {
    const ctx = { follow: this.follow, stage, active, localSeats, ended: this.marks.has(active) ? active : -1 }
    if (!(own ? frames(ctx) : cues(ctx))) return false
    if (points.length && this.frameAll(points)) return true
    return this.focus(x, z, { stage, active, localSeats })
  }

  // Zoom onto a circle on the table (x, z, r): a cluster of chips tapped
  // (ui/chips.js), whatever the follow policy says.
  frameOn(x, z, r = 4) {
    this.toPose(framePose({ cx: x, cz: z, r: Math.max(4, r) }, this.pose(), innerWidth / innerHeight, { min: this.controls.minDistance * 2, max: this.controls.maxDistance }), 0.6)
  }

  // whether any point is outside the screen (its middle 90%, the HUD's
  // edges counted out) or behind the camera
  offScreen(points) {
    const cam = this.camera
    cam.updateMatrixWorld()
    const v = new THREE.Vector3()
    return points.some((p) => {
      v.set(p.x, 0, p.z).project(cam)
      return !(v.z < 1 && Math.abs(v.x) <= 0.9 && Math.abs(v.y) <= 0.9)
    })
  }

  // the camera's pose now
  pose() {
    return { pos: xyzOf(this.camera.position), target: xyzOf(this.controls.target) }
  }

  // glide onto a pose (its pos and target) in `seconds`
  toPose(pose, seconds) {
    const camera = this.camera, controls = this.controls
    const p0 = camera.position.clone(), t0 = controls.target.clone()
    const pos = v3(pose.pos), target = v3(pose.target)
    this.goTween = null
    const id = (this.focusTween = {})
    tween(seconds, (k) => {
      if (this.focusTween !== id) return
      camera.position.lerpVectors(p0, pos, k)
      controls.target.lerpVectors(t0, target, k)
    }, easeInOut)
  }

  // End pressed in `seat`'s phase: the pose kept, the seat's orders at End
  // framed as they play
  bookmark(seat) {
    if (!this.views.length) return
    this.marks.set(seat, { seat, ...this.pose() })
  }

  // A phase of `seat` begins: back to the pose it pressed End at, if it
  // did (its own bookmark, spent; another seat's kept). True if the camera
  // glides there.
  resume(seat) {
    const m = this.marks.get(seat)
    if (!m) return false
    this.marks.delete(seat)
    this.toPose(m, 0.9)
    return true
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
      // ((F8b) faster as the camera pulls back: panSpeed)
      v.normalize().multiplyScalar(dt * panSpeed(camera.position.distanceTo(controls.target)))
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
