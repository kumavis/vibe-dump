// Camera director: every step names a shot (or a list of shots keyed by step
// progress) and the camera glides between them. The viewer can grab the scene
// and orbit at any time; the next shot change takes the camera back.

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { easeInOut } from './util.js'

export class Director {
  constructor(camera, dom, shots) {
    this.camera = camera
    this.shots = shots
    this.controls = new OrbitControls(camera, dom)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 4
    // Portrait and landscape phones back every shot off (see setFrame), so
    // leave plenty of room.
    this.controls.maxDistance = 2000
    this.controls.maxPolarAngle = Math.PI * 0.49
    this.controls.zoomSpeed = 0.8
    this.flight = null
    this.current = null
    this.backoff = 1
    this.userMoved = false
    this.controls.addEventListener('start', () => {
      this.flight = null
      this.userMoved = true
    })
  }
  // Shots are composed for a landscape frame; on a tall, narrow one the camera
  // backs off along the same line of sight so the subject still fits.
  shotFor(name) {
    const raw = this.shots[name]
    if (!raw) return null
    const s = typeof raw === 'function' ? raw() : { ...raw, pos: raw.pos.clone(), target: raw.target.clone() }
    const k = this.backoff
    if (k !== 1) s.pos.sub(s.target).multiplyScalar(k).add(s.target)
    return s
  }
  // How far to back every shot off so its subject fits the part of the screen
  // the panel and timeline leave uncovered. rV / rH are that window's height /
  // width as fractions of the virtual frustum's height; the constants are the
  // same ratios in the 1280×800 desktop layout the shots were composed for.
  setFrame(rV, rH) {
    this.backoff = Math.max(1, 0.826 / rV, 0.99 / rH)
  }
  // Fly to a named shot. `instant` jumps (used on load and when scrubbing).
  go(name, { duration = 1.8, instant = false } = {}) {
    if (!name) return
    if (name === this.current && !this.userMoved && !instant) return
    const s = this.shotFor(name)
    if (!s) return
    this.current = name
    this.userMoved = false
    const fromPos = this.camera.position.clone()
    const fromTarget = this.controls.target.clone()
    const fromFov = this.camera.fov
    const toPos = s.pos.clone()
    const toTarget = s.target.clone()
    const toFov = s.fov || 40
    if (instant) {
      this.camera.position.copy(toPos)
      this.controls.target.copy(toTarget)
      this.camera.fov = toFov
      this.camera.updateProjectionMatrix()
      this.flight = null
      this.controls.update()
      return
    }
    // Swing through a higher arc when travelling far, so the move reads as a
    // flight rather than a dolly through the board.
    const dist = fromPos.distanceTo(toPos)
    this.flight = { t: 0, duration: Math.max(0.9, Math.min(duration, 0.8 + dist / 160)), fromPos, fromTarget, toPos, toTarget, fromFov, toFov, lift: Math.min(60, dist * 0.18) }
  }
  update(dt) {
    const f = this.flight
    if (f) {
      f.t += dt / f.duration
      const e = easeInOut(Math.min(1, f.t))
      const pos = new THREE.Vector3().lerpVectors(f.fromPos, f.toPos, e)
      pos.y += Math.sin(Math.PI * e) * f.lift
      this.camera.position.copy(pos)
      this.controls.target.lerpVectors(f.fromTarget, f.toTarget, e)
      this.camera.fov = f.fromFov + (f.toFov - f.fromFov) * e
      this.camera.updateProjectionMatrix()
      if (f.t >= 1) this.flight = null
    }
    this.controls.update()
  }
  // How "zoomed onto the die" the camera is: 0 at board scale, 1 close to the
  // silicon. Drives the heat-spreader lift and label density.
  // Measured in landscape terms: a portrait screen backs every shot off, and a
  // die close-up should still count as close there.
  dieCloseness(dieCenter) {
    const d = this.camera.position.distanceTo(dieCenter) / this.backoff
    return THREE.MathUtils.clamp((140 - d) / 90, 0, 1)
  }
}
