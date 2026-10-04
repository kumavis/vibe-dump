// The camera: an orbit around a point on the ground, with cinematic flights
// between points for the tour.
//
// Everything is expressed as (target, distance, yaw, pitch). Input moves a goal;
// the visible camera eases toward it, so drags feel weighty rather than twitchy.
// A flight is a timed curve between two of those states that rises away from
// the ground mid-way when the two ends are far apart — you see the island turn
// under you instead of skimming through a ridge.

import * as THREE from 'three'
import { HALF } from '../config.js'

const TAU = Math.PI * 2
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const wrapAngle = (a) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI

export class CameraRig {
  constructor(camera, dom, terrain) {
    this.camera = camera
    this.dom = dom
    this.terrain = terrain
    this.state = { target: new THREE.Vector3(0, 0, 20), distance: 420, yaw: 0.35, pitch: 0.62, lift: 0 }
    this.goal = { target: this.state.target.clone(), distance: 420, yaw: 0.35, pitch: 0.62, lift: 0 }
    this.flight = null
    this.floor = 0 // smoothed lift that keeps the camera clear of the ground
    this.minDistance = 0.5
    this.maxDistance = 900
    this.autoOrbit = 0 // radians per second while idle
    this.lastInput = -1e9
    this.onUserInput = null
    this.enabled = true
    this._ray = new THREE.Raycaster()
    this._v = new THREE.Vector3()
    this.bind()
  }

  bind() {
    const el = this.dom
    const pointers = new Map()
    let mode = null
    let last = null
    let pinch = null
    el.addEventListener('contextmenu', (e) => e.preventDefault())
    el.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return
      el.setPointerCapture(e.pointerId)
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pointers.size === 1) {
        mode = e.button === 2 || e.shiftKey || e.ctrlKey || e.metaKey ? 'pan' : 'orbit'
        last = { x: e.clientX, y: e.clientY }
        this.panAnchor = mode === 'pan' ? this.pickGround(e.clientX, e.clientY) : null
      } else if (pointers.size === 2) {
        mode = 'pinch'
        pinch = this.pinchState(pointers)
      }
      this.touch()
    })
    el.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (mode === 'orbit' && last) {
        const dx = e.clientX - last.x
        const dy = e.clientY - last.y
        this.goal.yaw -= dx * 0.005
        this.goal.pitch = THREE.MathUtils.clamp(this.goal.pitch + dy * 0.004, 0.06, 1.52)
        last = { x: e.clientX, y: e.clientY }
        this.touch()
      } else if (mode === 'pan' && last) {
        this.panBy(e.clientX - last.x, e.clientY - last.y)
        last = { x: e.clientX, y: e.clientY }
        this.touch()
      } else if (mode === 'pinch' && pointers.size === 2) {
        const now = this.pinchState(pointers)
        const s = pinch.dist / Math.max(20, now.dist)
        this.goal.distance = THREE.MathUtils.clamp(this.goal.distance * s, this.minDistance, this.maxDistance)
        this.panBy(now.cx - pinch.cx, now.cy - pinch.cy)
        this.goal.yaw -= wrapAngle(now.angle - pinch.angle)
        this.goal.pitch = THREE.MathUtils.clamp(this.goal.pitch + (now.cy - pinch.cy) * 0.0, 0.06, 1.52)
        pinch = now
        this.touch()
      }
    })
    const up = (e) => {
      pointers.delete(e.pointerId)
      if (pointers.size === 0) mode = null
      else if (pointers.size === 1) {
        const [p] = pointers.values()
        mode = 'orbit'
        last = { ...p }
      }
    }
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener(
      'wheel',
      (e) => {
        if (!this.enabled) return
        e.preventDefault()
        const k = Math.exp(Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * 0.0018)
        this.zoomAt(e.clientX, e.clientY, k)
        this.touch()
      },
      { passive: false },
    )
    el.addEventListener('dblclick', (e) => {
      const p = this.pickGround(e.clientX, e.clientY)
      if (p) this.flyTo({ target: p, distance: Math.max(6, this.goal.distance * 0.45) }, 1.6)
    })
    addEventListener('keydown', (e) => {
      if (!this.enabled || e.target.closest?.('input, textarea')) return
      const step = this.goal.distance * 0.08
      const f = { ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1], ArrowLeft: [-1, 0], KeyA: [-1, 0], ArrowRight: [1, 0], KeyD: [1, 0] }[e.code]
      if (f && !e.altKey) {
        const sy = Math.sin(this.goal.yaw)
        const cy = Math.cos(this.goal.yaw)
        this.goal.target.x += (f[0] * cy + f[1] * sy) * step
        this.goal.target.z += (-f[0] * sy + f[1] * cy) * step
        this.touch()
      }
      if (e.code === 'KeyQ') this.goal.yaw += 0.12
      if (e.code === 'KeyE') this.goal.yaw -= 0.12
      if (e.code === 'Equal' || e.code === 'NumpadAdd') this.goal.distance *= 0.85
      if (e.code === 'Minus' || e.code === 'NumpadSubtract') this.goal.distance /= 0.85
    })
  }

  pinchState(pointers) {
    const [a, b] = [...pointers.values()]
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      cx: (a.x + b.x) / 2,
      cy: (a.y + b.y) / 2,
      angle: Math.atan2(b.y - a.y, b.x - a.x),
    }
  }

  touch() {
    this.flight = null
    this.goal.lift = 0
    this.lastInput = performance.now()
    this.onUserInput?.()
  }

  panBy(dx, dy) {
    const h = this.dom.clientHeight || 1
    const k = (this.state.distance * 2 * Math.tan((this.camera.fov * Math.PI) / 360)) / h
    const sy = Math.sin(this.goal.yaw)
    const cy = Math.cos(this.goal.yaw)
    // drag moves the ground under the finger; pitch stretches the far direction
    const stretch = 1 / Math.max(0.35, Math.sin(this.state.pitch))
    this.goal.target.x += (-dx * cy - dy * sy * stretch) * k
    this.goal.target.z += (dx * sy - dy * cy * stretch) * k
  }

  zoomAt(cx, cy, k) {
    const p = this.pickGround(cx, cy)
    const d0 = this.goal.distance
    const d1 = THREE.MathUtils.clamp(d0 * k, this.minDistance, this.maxDistance)
    if (p && d1 < d0) {
      // pull the target toward the point under the cursor as we close in
      const t = 1 - d1 / d0
      this.goal.target.lerp(p, t)
    }
    this.goal.distance = d1
  }

  /** Ground (or sea) point under a screen position, by marching the ray. */
  pickGround(cx, cy) {
    const rect = this.dom.getBoundingClientRect()
    const ndc = new THREE.Vector2(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1)
    this._ray.setFromCamera(ndc, this.camera)
    return this.marchRay(this._ray.ray.origin, this._ray.ray.direction)
  }

  marchRay(o, d, maxT = 3000) {
    const ground = (x, z) => Math.max(0, this.terrain.heightAt(x, z))
    let t = 0
    let prevT = 0
    let p = this._v
    for (let i = 0; i < 400 && t < maxT; i++) {
      p.copy(o).addScaledVector(d, t)
      const gap = p.y - ground(p.x, p.z)
      if (gap < 0) {
        // refine between prevT and t
        let a = prevT
        let b = t
        for (let k = 0; k < 20; k++) {
          const m = (a + b) / 2
          p.copy(o).addScaledVector(d, m)
          if (p.y - ground(p.x, p.z) < 0) b = m
          else a = m
        }
        return p.clone()
      }
      prevT = t
      t += Math.max(0.03, gap * 0.45, t * 0.002)
    }
    return null
  }

  /**
   * Fly to a view. `to` may set any of target, distance, yaw, pitch. `hop`
   * controls how far the flight rises (default: by how far it travels).
   */
  flyTo(to, duration = 3, opts = {}) {
    const from = {
      target: this.goal.target.clone(),
      distance: this.goal.distance,
      yaw: this.goal.yaw,
      pitch: this.goal.pitch,
      lift: this.goal.lift,
    }
    const dest = {
      target: to.target ? to.target.clone() : from.target.clone(),
      distance: to.distance ?? from.distance,
      yaw: to.yaw ?? from.yaw,
      pitch: to.pitch ?? from.pitch,
      lift: to.lift ?? 0,
    }
    dest.yaw = from.yaw + wrapAngle(dest.yaw - from.yaw)
    const travel = from.target.distanceTo(dest.target)
    const hop = opts.hop ?? Math.max(0, travel * 0.9 - Math.max(from.distance, dest.distance) * 0.6)
    this.flight = { from, dest, t: 0, duration, hop, onDone: opts.onDone }
  }

  /** Jump straight to the end of the current flight (tests, reduced motion). */
  finishFlight() {
    if (!this.flight) return
    const f = this.flight
    this.goal.target.copy(f.dest.target)
    this.goal.distance = f.dest.distance
    this.goal.yaw = f.dest.yaw
    this.goal.pitch = f.dest.pitch
    this.goal.lift = f.dest.lift
    this.state.lift = f.dest.lift
    this.state.target.copy(f.dest.target)
    this.state.distance = f.dest.distance
    this.state.yaw = f.dest.yaw
    this.state.pitch = f.dest.pitch
    this.flight = null
    f.onDone?.()
    this.apply()
  }

  update(dt) {
    const g = this.goal
    if (this.flight) {
      const f = this.flight
      f.t = Math.min(1, f.t + dt / f.duration)
      const e = easeInOut(f.t)
      g.target.lerpVectors(f.from.target, f.dest.target, e)
      const logD = Math.log(f.from.distance) * (1 - e) + Math.log(f.dest.distance) * e
      g.distance = Math.exp(logD) + f.hop * Math.sin(Math.PI * e)
      g.yaw = f.from.yaw + (f.dest.yaw - f.from.yaw) * e
      g.pitch = f.from.pitch + (f.dest.pitch - f.from.pitch) * e + 0.25 * Math.sin(Math.PI * e) * Math.min(1, f.hop / 80)
      g.lift = f.from.lift + (f.dest.lift - f.from.lift) * e
      if (f.t >= 1) {
        this.flight = null
        f.onDone?.()
      }
    } else if (this.autoOrbit && performance.now() - this.lastInput > 4000) {
      g.yaw += this.autoOrbit * dt
    }
    // keep the target on the land/sea surface and inside the world (a flight
    // already runs between two points on the ground, so leave its height be:
    // nudging it toward the terrain each frame would jitter with frame time)
    g.target.x = THREE.MathUtils.clamp(g.target.x, -HALF * 1.3, HALF * 1.3)
    g.target.z = THREE.MathUtils.clamp(g.target.z, -HALF * 1.3, HALF * 1.3)
    if (!this.flight) {
      const gy = Math.max(0, this.terrain.heightAt(g.target.x, g.target.z))
      g.target.y += (gy - g.target.y) * (1 - Math.exp(-dt * 6))
    }

    const s = this.state
    const k = this.flight ? 1 : 1 - Math.exp(-dt * 7)
    s.target.lerp(g.target, k)
    s.distance += (g.distance - s.distance) * k
    s.yaw += (g.yaw - s.yaw) * k
    s.pitch += (g.pitch - s.pitch) * k
    s.lift += (g.lift - s.lift) * k

    this.apply(dt)
  }

  /**
   * Ground under the camera, and a little way ahead of where it is heading, so
   * it starts to rise before a ridge rather than on it.
   */
  groundAhead(x, z, dt) {
    const T = this.terrain
    let g = T.heightAt(x, z)
    const prev = this._prevXZ
    if (prev && dt > 0) {
      const vx = (x - prev.x) / dt
      const vz = (z - prev.y) / dt
      const speed = Math.hypot(vx, vz)
      const ahead = Math.min(2, speed * 0.3)
      if (ahead > 0.005) g = Math.max(g, T.heightAt(x + (vx / speed) * ahead, z + (vz / speed) * ahead))
    }
    this._prevXZ = (this._prevXZ || new THREE.Vector2()).set(x, z)
    return Math.max(0, g)
  }

  apply(dt = 0) {
    const s = this.state
    const cam = this.camera
    const cp = Math.cos(s.pitch)
    cam.position.set(
      s.target.x + s.distance * cp * Math.sin(s.yaw),
      s.target.y + s.distance * Math.sin(s.pitch),
      s.target.z + s.distance * cp * Math.cos(s.yaw),
    )
    // Never under the ground. Clamping to the height right under the camera
    // makes it bob over every ridge and gully (the terrain is only piecewise
    // smooth), so the lift is eased instead: it rises quickly, settles back
    // slowly, and looks ahead along the camera's path so it starts climbing
    // before the ground does. A hard floor just above the surface is the backstop.
    const clearance = 0.12 + s.distance * 0.03
    const ground = this.groundAhead(cam.position.x, cam.position.z, dt)
    const want = Math.max(0, ground + clearance - cam.position.y)
    if (dt <= 0) this.floor = want
    else this.floor += (want - this.floor) * (1 - Math.exp(-dt * (want > this.floor ? 9 : 2.5)))
    cam.position.y += this.floor
    const under = Math.max(0, this.terrain.heightAt(cam.position.x, cam.position.z))
    cam.position.y = Math.max(cam.position.y, under + Math.min(0.04, clearance * 0.3))
    this._v.copy(s.target)
    this._v.y += s.lift * s.distance * 0.45
    cam.lookAt(this._v)
    const alt = cam.position.y - under
    cam.near = THREE.MathUtils.clamp(Math.min(alt, s.distance) * 0.12, 0.02, 4)
    cam.far = 9000
    cam.updateProjectionMatrix()
  }
}
