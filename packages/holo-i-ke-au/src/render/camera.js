// The camera, from ahupuaʻa: an orbit around a point on the ground, with
// cinematic flights between points. Everything is (target, distance, yaw,
// pitch); input moves a goal and the visible camera eases toward it.
//
// What changes here is the range. One wheel gesture runs from the whole chain
// (several hundred km) down to a few km over a valley, so the zoom is
// multiplicative and pulls toward the cursor, the camera tilts from a map's
// steep look to a landscape's oblique one as it closes in (keeping whatever
// tilt the person has added by hand), the near and far planes follow the
// distance, and picking marches the ray down from the highest summit rather
// than out from the lens. fit() finds the view that puts a stretch of ground
// in one part of the screen, so the tour can frame an island beside a card
// rather than under it.

import * as THREE from 'three'
import { MIN_DISTANCE, MAX_DISTANCE } from '../config.js'

const TAU = Math.PI * 2
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const wrapAngle = (a) => ((((a + Math.PI) % TAU) + TAU) % TAU) - Math.PI
const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** The tilt a zoom eases toward: oblique over a valley, steep over the whole chain. */
export function preferredPitch(d) {
  return 0.6 + 0.52 * smooth(Math.log(40), Math.log(4500), Math.log(Math.max(1, d)))
}

export class CameraRig {
  constructor(camera, dom, world) {
    this.camera = camera
    this.dom = dom
    this.world = world
    this.home = this.homeView()
    const h = this.home
    this.state = { target: h.target.clone(), distance: h.distance, yaw: h.yaw, pitch: h.pitch, lift: 0 }
    this.goal = { target: h.target.clone(), distance: h.distance, yaw: h.yaw, pitch: h.pitch, lift: 0 }
    this.flight = null
    this.floor = 0
    this.minDistance = MIN_DISTANCE
    this.maxDistance = MAX_DISTANCE
    this.autoOrbit = 0
    this.lastInput = -1e9
    this.onUserInput = null
    this.enabled = true
    this._ray = new THREE.Raycaster()
    this._v = new THREE.Vector3()
    this.bind()
  }

  /**
   * The whole chain, seen from a little south of overhead. On a landscape
   * screen north is up and the chain runs across it; on a portrait one the
   * view turns so the chain, which lies west-north-west to east-south-east,
   * runs down the screen's long side from Kauaʻi to Hawaiʻi instead of
   * shrinking to a strip across the middle.
   */
  homeView(aspect = innerWidth / Math.max(1, innerHeight)) {
    const b = this.world.bounds
    const w = b.x1 - b.x0
    const t = Math.tan((this.camera.fov * Math.PI) / 360)
    const portrait = aspect < 0.85
    // (1.2: the tilt and the perspective want a little more room than the rect)
    const d = portrait ? (1.2 * Math.hypot(w, b.z1 - b.z0) * 0.92) / (2 * t) : (1.2 * w) / (2 * t * Math.max(1, aspect))
    const distance = Math.min(MAX_DISTANCE, d)
    const target = new THREE.Vector3((b.x0 + b.x1) / 2, 0, (b.z0 + b.z1) / 2 + (portrait ? 0 : (b.z1 - b.z0) * 0.04))
    return { target, distance, yaw: portrait ? 1.1 : 0, pitch: preferredPitch(distance) }
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
        // on a map, a plain drag pans; turning wants the right button or a modifier
        mode = e.button === 2 || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey ? 'orbit' : 'pan'
        last = { x: e.clientX, y: e.clientY }
      } else if (pointers.size === 2) {
        mode = 'pinch'
        pinch = this.pinchState(pointers)
      }
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
        const dx = e.clientX - last.x
        const dy = e.clientY - last.y
        if (dx || dy) {
          this.panBy(dx, dy)
          this.touch()
        }
        last = { x: e.clientX, y: e.clientY }
      } else if (mode === 'pinch' && pointers.size === 2) {
        const now = this.pinchState(pointers)
        const s = pinch.dist / Math.max(20, now.dist)
        this.zoomAt(now.cx, now.cy, s)
        this.panBy(now.cx - pinch.cx, now.cy - pinch.cy)
        this.goal.yaw -= wrapAngle(now.angle - pinch.angle)
        pinch = now
        this.touch()
      }
    })
    const up = (e) => {
      pointers.delete(e.pointerId)
      if (pointers.size === 0) mode = null
      else if (pointers.size === 1) {
        const [p] = pointers.values()
        mode = 'pan'
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
        // (pixel and line deltas both; a trackpad's small steps zoom smoothly)
        const dy = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY
        const k = Math.exp(Math.sign(dy) * Math.min(Math.abs(dy), 150) * 0.0022)
        this.zoomAt(e.clientX, e.clientY, k)
        this.touch()
      },
      { passive: false },
    )
    el.addEventListener('dblclick', (e) => {
      const p = this.pickGround(e.clientX, e.clientY)
      if (p) {
        const d = Math.max(this.minDistance, this.goal.distance * 0.35)
        this.flyTo({ target: p, distance: d, pitch: this.goal.pitch + preferredPitch(d) - preferredPitch(this.goal.distance) }, 1.8)
      }
    })
    addEventListener('keydown', (e) => {
      if (!this.enabled || e.target.closest?.('input, textarea')) return
      const step = this.goal.distance * 0.08
      // (left and right arrows belong to the tour's Back and Next, ui.js)
      const f = { ArrowUp: [0, -1], KeyW: [0, -1], ArrowDown: [0, 1], KeyS: [0, 1], KeyA: [-1, 0], KeyD: [1, 0] }[e.code]
      if (f && !e.altKey) {
        const sy = Math.sin(this.goal.yaw)
        const cy = Math.cos(this.goal.yaw)
        this.goal.target.x += (f[0] * cy + f[1] * sy) * step
        this.goal.target.z += (-f[0] * sy + f[1] * cy) * step
        this.touch()
      }
      if (e.code === 'KeyQ') this.goal.yaw += 0.12
      if (e.code === 'KeyE') this.goal.yaw -= 0.12
      const cx = innerWidth / 2
      const cy = innerHeight / 2
      if (e.code === 'Equal' || e.code === 'NumpadAdd') this.zoomAt(cx, cy, 0.8)
      if (e.code === 'Minus' || e.code === 'NumpadSubtract') this.zoomAt(cx, cy, 1.25)
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
    const stretch = 1 / Math.max(0.35, Math.sin(this.state.pitch))
    this.goal.target.x += (-dx * cy - dy * sy * stretch) * k
    this.goal.target.z += (dx * sy - dy * cy * stretch) * k
  }

  /** Zoom by factor k about the ground under a screen point, tilting toward preferredPitch. */
  zoomAt(cx, cy, k) {
    const p = this.pickGround(cx, cy)
    const d0 = this.goal.distance
    const d1 = THREE.MathUtils.clamp(d0 * k, this.minDistance, this.maxDistance)
    if (p) {
      // keep the point under the cursor where it is (closing in pulls toward it,
      // pulling out pushes away from it)
      const t = 1 - d1 / d0
      this.goal.target.x += (p.x - this.goal.target.x) * t
      this.goal.target.z += (p.z - this.goal.target.z) * t
    }
    this.goal.pitch = THREE.MathUtils.clamp(this.goal.pitch + preferredPitch(d1) - preferredPitch(d0), 0.06, 1.52)
    this.goal.distance = d1
  }

  pickGround(cx, cy) {
    const rect = this.dom.getBoundingClientRect()
    const ndc = new THREE.Vector2(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1)
    this._ray.setFromCamera(ndc, this.camera)
    return this.marchRay(this._ray.ray.origin, this._ray.ray.direction)
  }

  /** Where a ray meets the ground (or the sea at y = 0), marching down from the highest summit. */
  marchRay(o, d) {
    const W = this.world
    const top = W.maxY + 0.05
    if (d.y >= 0 && o.y > top) return null
    const tSea = d.y < 0 ? o.y / -d.y : 4e5
    let t = o.y > top && d.y < 0 ? (o.y - top) / -d.y : 0
    const tEnd = Math.min(tSea, 4e5)
    const p = this._v
    let prevT = t
    for (let i = 0; i < 700 && t <= tEnd + 1e-3; i++) {
      p.copy(o).addScaledVector(d, t)
      const gap = p.y - W.heightAt(p.x, p.z)
      if (gap < 0) {
        let a = prevT
        let b = t
        for (let k = 0; k < 24; k++) {
          const m = (a + b) / 2
          p.copy(o).addScaledVector(d, m)
          if (p.y - W.heightAt(p.x, p.z) < 0) b = m
          else a = m
        }
        return p.clone()
      }
      prevT = t
      t += Math.max(0.02, gap * 0.45, t * 0.0015)
    }
    if (tSea < 4e5) return o.clone().addScaledVector(d, tSea).setY(0)
    return null
  }

  /**
   * The view that puts a world rectangle into a box on the screen (by
   * default the whole screen), seen at `yaw` and the pitch its distance
   * prefers plus `tilt`. A zero-size rectangle is a point; give it a
   * `distance` and only the target slides, so the point lands in the box's
   * middle. Found by trial: place a scratch camera, see where the corners
   * land, scale the distance and slide the target to suit, and again; the
   * projection is near enough linear over a view that it settles in a few
   * rounds. Corners sit at sea level, which is where an island's outline is.
   * A `pitch` holds the tilt at that, whatever the distance prefers (a tour
   * stop's own camera).
   */
  fit({ rect, distance, yaw = this.goal.yaw, tilt = 0, pitch: fixedPitch, box, pad = 1.06 }) {
    const cam = this._fitCam || (this._fitCam = new THREE.PerspectiveCamera())
    cam.fov = this.camera.fov
    cam.aspect = this.camera.aspect
    cam.near = 0.1
    cam.far = 1e6
    cam.updateProjectionMatrix()
    const W = innerWidth
    const H = innerHeight
    const b = box || { x0: 0, y0: 0, x1: W, y1: H }
    const bw = Math.max(60, b.x1 - b.x0)
    const bh = Math.max(60, b.y1 - b.y0)
    const tanH = Math.tan((cam.fov * Math.PI) / 360)
    const cy = Math.cos(yaw)
    const sy = Math.sin(yaw)
    let tx = (rect.x0 + rect.x1) / 2
    let tz = (rect.z0 + rect.z1) / 2
    const fixed = distance !== undefined
    let d = fixed ? distance : (Math.max(rect.x1 - rect.x0, rect.z1 - rect.z0) / (2 * tanH)) * (H / bh)
    let pitch = 0
    const v = this._v
    for (let i = 0; i < 8; i++) {
      d = THREE.MathUtils.clamp(d, this.minDistance, this.maxDistance)
      pitch = THREE.MathUtils.clamp(fixedPitch ?? preferredPitch(d) + tilt, 0.06, 1.52)
      const cp = Math.cos(pitch)
      const ty = fixed ? this.world.heightAt(tx, tz) : 0
      cam.position.set(tx + d * cp * sy, ty + d * Math.sin(pitch), tz + d * cp * cy)
      cam.lookAt(tx, ty, tz)
      cam.updateMatrixWorld()
      let x0 = Infinity
      let y0 = Infinity
      let x1 = -Infinity
      let y1 = -Infinity
      for (let k = 0; k < 4; k++) {
        v.set(k & 1 ? rect.x1 : rect.x0, ty, k & 2 ? rect.z1 : rect.z0).project(cam)
        const px = ((v.x + 1) / 2) * W
        const py = ((1 - v.y) / 2) * H
        x0 = Math.min(x0, px)
        x1 = Math.max(x1, px)
        y0 = Math.min(y0, py)
        y1 = Math.max(y1, py)
      }
      if (!fixed) d *= THREE.MathUtils.clamp(Math.max(((x1 - x0) * pad) / bw, ((y1 - y0) * pad) / bh), 0.3, 3)
      // slide so the middle of what's framed lands in the middle of the box:
      // along the screen's right on the ground, and along its down, which on
      // the ground runs toward the camera and is stretched by the tilt (as panBy)
      const k = (2 * d * tanH) / H
      const ex = ((x0 + x1) / 2 - (b.x0 + b.x1) / 2) * k
      const ey = (((y0 + y1) / 2 - (b.y0 + b.y1) / 2) * k) / Math.max(0.35, Math.sin(pitch))
      tx += ex * cy + ey * sy
      tz += -ex * sy + ey * cy
    }
    return { target: new THREE.Vector3(tx, this.world.heightAt(tx, tz), tz), distance: d, yaw, pitch }
  }

  /**
   * Fly to a view. `to` may set any of target, distance, yaw, pitch.
   * opts.ready: what the landing waits for (a district streaming in under
   * it): the last fifth of the flight slows to a crawl until it holds, for a
   * few seconds at most, so the view arrives with its ground.
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
      distance: THREE.MathUtils.clamp(to.distance ?? from.distance, this.minDistance, this.maxDistance),
      yaw: to.yaw ?? from.yaw,
      pitch: THREE.MathUtils.clamp(to.pitch ?? from.pitch, 0.06, 1.52),
      lift: to.lift ?? 0,
    }
    dest.yaw = from.yaw + wrapAngle(dest.yaw - from.yaw)
    const travel = Math.hypot(from.target.x - dest.target.x, from.target.z - dest.target.z)
    const hop = opts.hop ?? Math.max(0, travel * 0.9 - Math.max(from.distance, dest.distance) * 0.6)
    this.flight = { from, dest, t: 0, duration, hop, onDone: opts.onDone, ready: opts.ready, held: 0 }
  }

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

  /** Jump (no easing) to a view: the tools and the ?cam= parameter use this. */
  jump({ x, z, distance, yaw, pitch }) {
    this.flight = null
    for (const s of [this.goal, this.state]) {
      if (x !== undefined) s.target.set(x, this.world.heightAt(x, z), z)
      if (distance !== undefined) s.distance = distance
      if (yaw !== undefined) s.yaw = yaw
      if (pitch !== undefined) s.pitch = pitch
      s.lift = 0
    }
    this.apply()
  }

  update(dt) {
    const g = this.goal
    if (this.flight) {
      const f = this.flight
      let step = dt / f.duration
      if (f.ready && f.t > 0.8 && f.held < 6 && !f.ready()) {
        f.held += dt
        step *= 0.08
      }
      f.t = Math.min(1, f.t + step)
      const e = easeInOut(f.t)
      g.target.lerpVectors(f.from.target, f.dest.target, e)
      const logD = Math.log(f.from.distance) * (1 - e) + Math.log(f.dest.distance) * e
      g.distance = Math.exp(logD) + f.hop * Math.sin(Math.PI * e)
      g.yaw = f.from.yaw + (f.dest.yaw - f.from.yaw) * e
      g.pitch = f.from.pitch + (f.dest.pitch - f.from.pitch) * e + 0.2 * Math.sin(Math.PI * e) * Math.min(1, f.hop / 300)
      g.pitch = Math.min(1.52, g.pitch)
      g.lift = f.from.lift + (f.dest.lift - f.from.lift) * e
      if (f.t >= 1) {
        this.flight = null
        f.onDone?.()
      }
    } else if (this.autoOrbit && performance.now() - this.lastInput > 4000) {
      g.yaw += this.autoOrbit * dt
    }
    const b = this.world.bounds
    const m = 150
    g.target.x = THREE.MathUtils.clamp(g.target.x, b.x0 - m, b.x1 + m)
    g.target.z = THREE.MathUtils.clamp(g.target.z, b.z0 - m, b.z1 + m)
    if (!this.flight) {
      // the target rides the ground; the exaggeration moves it as the camera zooms
      const gy = this.world.heightAt(g.target.x, g.target.z)
      g.target.y += (gy - g.target.y) * (1 - Math.exp(-dt * 6))
    } else g.target.y = Math.max(g.target.y, this.world.heightAt(g.target.x, g.target.z))

    const s = this.state
    const k = this.flight ? 1 : 1 - Math.exp(-dt * 7)
    s.target.lerp(g.target, k)
    // (distance eases in log space, so a big zoom feels the same at every scale)
    s.distance = Math.exp(Math.log(s.distance) + (Math.log(g.distance) - Math.log(s.distance)) * k)
    s.yaw += (g.yaw - s.yaw) * k
    s.pitch += (g.pitch - s.pitch) * k
    s.lift += (g.lift - s.lift) * k
    this.apply(dt)
  }

  /** Ground under the camera and a little ahead of where it's heading, so it rises before a ridge. */
  groundAhead(x, z, dt) {
    const W = this.world
    let g = W.heightAt(x, z)
    const prev = this._prevXZ
    if (prev && dt > 0) {
      const vx = (x - prev.x) / dt
      const vz = (z - prev.y) / dt
      const speed = Math.hypot(vx, vz)
      const ahead = Math.min(20, speed * 0.3)
      if (ahead > 0.005) g = Math.max(g, W.heightAt(x + (vx / speed) * ahead, z + (vz / speed) * ahead))
    }
    this._prevXZ = (this._prevXZ || new THREE.Vector2()).set(x, z)
    return g
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
    // never under the ground: an eased lift that rises fast and settles slowly
    const clearance = 0.12 + s.distance * 0.03
    const ground = this.groundAhead(cam.position.x, cam.position.z, dt)
    const want = Math.max(0, ground + clearance - cam.position.y)
    if (dt <= 0) this.floor = want
    else this.floor += (want - this.floor) * (1 - Math.exp(-dt * (want > this.floor ? 9 : 2.5)))
    cam.position.y += this.floor
    const under = this.world.heightAt(cam.position.x, cam.position.z)
    cam.position.y = Math.max(cam.position.y, under + Math.min(0.04, clearance * 0.3))
    this._v.copy(s.target)
    this._v.y += s.lift * s.distance * 0.45
    cam.lookAt(this._v)
    const alt = cam.position.y - under
    cam.near = THREE.MathUtils.clamp(Math.min(alt, s.distance) * 0.12, 0.02, 300)
    cam.far = THREE.MathUtils.clamp(s.distance * 30 + alt * 60, 8000, 3e5)
    cam.updateProjectionMatrix()
    cam.updateMatrixWorld()
  }
}
