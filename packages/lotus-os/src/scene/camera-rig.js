// camera-rig.js — everything that decides where the camera is.
//
// Three jobs, in order of how much they matter:
//   1. Hold a pose (position, look-at target, field of view) and interpolate
//      between two of them along a curved path, because a straight dolly out
//      of a monitor looks like a CAD viewport and an arc looks like a camera.
//   2. Let the mouse push the view around a little, inside tight limits. This
//      is a room you look around, not a scene you orbit.
//   3. Never sit perfectly still. A camera locked to six decimal places reads
//      as a render; a hand holding one does not.

import * as THREE from 'three'

const _v = new THREE.Vector3()
const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _q = new THREE.Quaternion()
const _axis = new THREE.Vector3()

/** Slow start, firm middle, long settle — not a symmetric ease. */
const flightEase = (t) => {
  const smoother = t * t * t * (t * (6 * t - 15) + 10)
  const settle = 1 - (1 - t) ** 4
  return smoother * 0.45 + settle * 0.55
}

export function createRig(camera, { getSize }) {
  const base = {
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
    fov: 45,
  }

  // where the user has pushed the view, and where it is actually sitting
  const look = { yaw: 0, pitch: 0, yawTo: 0, pitchTo: 0 }
  let limits = { yaw: 0.34, pitch: 0.17 }
  let driftAmount = 0
  let flight = null
  let dragging = false
  let last = null

  const tmpPos = new THREE.Vector3()
  const tmpTarget = new THREE.Vector3()

  function setPose(pose, { instant = true } = {}) {
    base.position.copy(pose.position)
    base.target.copy(pose.target)
    base.fov = pose.fov ?? base.fov
    if (instant) {
      look.yaw = look.pitch = look.yawTo = look.pitchTo = 0
      flight = null
      apply(0, 0)
    }
  }

  /**
   * Fly to a pose. `mid` bends the path: without it the camera slides along a
   * chord and the room seems to rotate around it, which is the giveaway of a
   * scripted move. With it the camera swings.
   */
  function flyTo(pose, { ms = 2600, mid = null, ease = flightEase, onUpdate } = {}) {
    const from = {
      position: base.position.clone(),
      target: base.target.clone(),
      fov: base.fov,
    }
    const to = {
      position: pose.position.clone(),
      target: pose.target.clone(),
      fov: pose.fov ?? base.fov,
    }
    const control = mid
      ? mid.clone()
      : from.position.clone().lerp(to.position, 0.5).add(_v.set(0, 0.06, 0))

    return new Promise((resolve) => {
      flight = {
        from,
        to,
        control,
        ms,
        ease,
        onUpdate,
        t0: performance.now(),
        resolve,
      }
      // The user's own look-around unwinds over the flight, so the arrival
      // pose is the pose and not the pose plus whatever they were doing.
      look.yawTo = 0
      look.pitchTo = 0
    })
  }

  const isFlying = () => flight !== null

  function cancelFlight() {
    if (!flight) return
    flight.resolve?.(false)
    flight = null
  }

  // --- look-around --------------------------------------------------------

  function attach(el) {
    const onDown = (ev) => {
      if (ev.button !== 0) return
      dragging = true
      last = { x: ev.clientX, y: ev.clientY }
      el.setPointerCapture?.(ev.pointerId)
    }
    const onMove = (ev) => {
      const { width, height } = getSize()
      if (!dragging || !last) {
        // even without a drag, the pointer nudges the view a little
        const nx = (ev.clientX / width) * 2 - 1
        const ny = (ev.clientY / height) * 2 - 1
        look.yawTo = THREE.MathUtils.clamp(-nx * limits.yaw * 0.36, -limits.yaw, limits.yaw)
        look.pitchTo = THREE.MathUtils.clamp(-ny * limits.pitch * 0.36, -limits.pitch, limits.pitch)
        return
      }
      const dx = (ev.clientX - last.x) / width
      const dy = (ev.clientY - last.y) / height
      last = { x: ev.clientX, y: ev.clientY }
      look.yawTo = THREE.MathUtils.clamp(look.yawTo + dx * 1.5, -limits.yaw, limits.yaw)
      look.pitchTo = THREE.MathUtils.clamp(look.pitchTo + dy * 1.1, -limits.pitch, limits.pitch)
    }
    const onUp = (ev) => {
      dragging = false
      last = null
      el.releasePointerCapture?.(ev.pointerId)
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('pointerleave', () => {
      look.yawTo = 0
      look.pitchTo = 0
    })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }

  // --- per-frame ----------------------------------------------------------

  function apply(t, dt) {
    tmpPos.copy(base.position)
    tmpTarget.copy(base.target)

    // look-around: swing the camera about the target, not the world origin
    if (Math.abs(look.yaw) > 1e-5 || Math.abs(look.pitch) > 1e-5) {
      _a.copy(tmpPos).sub(tmpTarget)
      _q.setFromAxisAngle(_axis.set(0, 1, 0), look.yaw)
      _a.applyQuaternion(_q)
      _b.copy(_a).cross(_axis.set(0, 1, 0)).normalize()
      _q.setFromAxisAngle(_b, look.pitch)
      _a.applyQuaternion(_q)
      tmpPos.copy(tmpTarget).add(_a)
    }

    // handheld: three slow sines that never line up, plus a whisper of roll
    let roll = 0
    if (driftAmount > 0) {
      tmpPos.x += Math.sin(t * 0.69) * 0.012 * driftAmount
      tmpPos.y += Math.sin(t * 0.83 + 1.7) * 0.009 * driftAmount
      tmpPos.z += Math.sin(t * 0.57 + 3.1) * 0.01 * driftAmount
      tmpTarget.x += Math.sin(t * 0.47 + 2.2) * 0.008 * driftAmount
      tmpTarget.y += Math.sin(t * 0.61 + 0.4) * 0.006 * driftAmount
      roll = Math.sin(t * 0.41 + 1.1) * 0.004 * driftAmount
    }

    camera.position.copy(tmpPos)
    camera.up.set(0, 1, 0)
    camera.lookAt(tmpTarget)
    if (roll) camera.rotateZ(roll)
    if (camera.fov !== base.fov) {
      camera.fov = base.fov
      camera.updateProjectionMatrix()
    }
  }

  function update(dt, t) {
    if (flight) {
      const raw = Math.min(1, (performance.now() - flight.t0) / flight.ms)
      const e = flight.ease(raw)
      // quadratic bezier through the control point
      const inv = 1 - e
      base.position
        .copy(flight.from.position)
        .multiplyScalar(inv * inv)
        .addScaledVector(flight.control, 2 * inv * e)
        .addScaledVector(flight.to.position, e * e)
      base.target.lerpVectors(flight.from.target, flight.to.target, e)
      base.fov = THREE.MathUtils.lerp(flight.from.fov, flight.to.fov, e)
      flight.onUpdate?.(e, raw)
      if (raw >= 1) {
        const done = flight
        flight = null
        done.resolve?.(true)
      }
    }

    // ease the look-around toward where the pointer asked for it
    const k = 1 - Math.exp(-dt * 5.5)
    look.yaw += (look.yawTo - look.yaw) * k
    look.pitch += (look.pitchTo - look.pitch) * k

    apply(t, dt)
  }

  return {
    camera,
    base,
    setPose,
    flyTo,
    cancelFlight,
    isFlying,
    attach,
    update,
    set drift(v) {
      driftAmount = v
    },
    get drift() {
      return driftAmount
    },
    set limits(v) {
      limits = v
    },
    /** Snap the look-around back to centre without a jump. */
    recentre() {
      look.yawTo = 0
      look.pitchTo = 0
    },
  }
}

/**
 * The pose that makes a plane of `worldHeight` metres fill exactly the same
 * rectangle of the viewport that the DOM copy of it was filling — which is
 * how the hand-off from page to monitor happens without a visible cut.
 *
 * On-screen height in pixels of a plane at distance d:
 *     px = worldHeight * (viewportPx / 2) / (d * tan(fov / 2))
 * The DOM copy was drawn at `logicalHeight * fitScale` pixels tall, so solve
 * that equation for d and the two images are the same size to the pixel.
 */
export function screenFitDistance({ worldHeight, viewportHeight, targetHeightPx, fov }) {
  const halfFov = THREE.MathUtils.degToRad(fov) / 2
  return (worldHeight * viewportHeight) / (2 * Math.tan(halfFov) * Math.max(1, targetHeightPx))
}
