// Picking a unit in the box (ROUND-2.md §4): a click or a tap selects the
// nearest unit within 24 px of the pointer by its projected position (a ship
// by its hull, the line from bow to stern; an aircraft by its slot). A drag
// is the camera's, not a pick. Only in watch mode: at the controls the
// pointer is the player's. Battle.select does the selecting (the bracket,
// the orbit following, the 'select' event); this only finds the unit.

import * as THREE from 'three'

const V = new THREE.Vector3()
const RADIUS_PX = 24
const CLICK_PX = 6
const CLICK_MS = 450
const DEG = Math.PI / 180

/** The squared distance from p to the segment ab (screen pixels). */
function segDist2(px, py, ax, ay, bx, by) {
  const dx = bx - ax
  const dy = by - ay
  const L2 = dx * dx + dy * dy
  let t = L2 > 0 ? ((px - ax) * dx + (py - ay) * dy) / L2 : 0
  t = Math.max(0, Math.min(1, t))
  const qx = ax + dx * t - px
  const qy = ay + dy * t - py
  return qx * qx + qy * qy
}

/**
 * The unit nearest a screen point (CSS pixels) within radius, or −1.
 * box: the BoxScene (its camera and sim); w, h: the canvas's CSS size.
 */
export function pickAt(box, x, y, { radius = RADIUS_PX, w = innerWidth, h = innerHeight } = {}) {
  const sim = box.sim
  const cam = box.camera
  if (!sim || !cam) return -1
  cam.updateMatrixWorld()
  const s = sim.state
  const proj = (wx, wy, wz) => {
    V.set(wx, wy, wz).project(cam)
    if (V.z > 1 || V.z < -1) return null
    return [((V.x + 1) / 2) * w, ((1 - V.y) / 2) * h]
  }
  let best = -1
  let bd = radius * radius
  for (let i = 0; i < sim.capacity; i++) {
    if (s.alive[i] !== 1) continue
    const u = sim.slots[i]
    const o = 3 * i
    let d2 = Infinity
    if (u.kind === 'ship') {
      const L = sim._X[i].model?.L ?? 100
      const hd = s.heading[i] * DEG
      const fx = Math.sin(hd) * L * 0.5
      const fz = -Math.cos(hd) * L * 0.5
      const a = proj(s.pos[o] + fx, 4, s.pos[o + 2] + fz)
      const b = proj(s.pos[o] - fx, 4, s.pos[o + 2] - fz)
      if (a && b) d2 = segDist2(x, y, a[0], a[1], b[0], b[1])
      else if (a || b) {
        const p = a || b
        d2 = (p[0] - x) ** 2 + (p[1] - y) ** 2
      }
    } else if (u.kind === 'aircraft') {
      const p = proj(s.pos[o], s.pos[o + 1], s.pos[o + 2])
      if (p) d2 = (p[0] - x) ** 2 + (p[1] - y) ** 2
      // (an aircraft drawn over a ship is picked before it, at the same distance)
      d2 *= 0.9
    }
    if (d2 < bd) {
      bd = d2
      best = i
    }
  }
  return best
}

/** Clicks and taps on the canvas in watch mode select (a drag orbits as before). */
export class Picker {
  constructor(box) {
    this.box = box
    this.ac = new AbortController()
    this.down = null
    const canvas = box.app?.canvas
    if (!canvas) return
    const on = { signal: this.ac.signal }
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return
      this.down = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId }
    }, on)
    canvas.addEventListener('pointerup', (e) => {
      const d = this.down
      this.down = null
      if (!d || d.id !== e.pointerId || e.button !== 0) return
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > CLICK_PX || performance.now() - d.t > CLICK_MS) return
      const app = this.box.app
      if (app.mode !== 'watch') return
      const r = canvas.getBoundingClientRect()
      const i = pickAt(this.box, e.clientX - r.left, e.clientY - r.top, { w: r.width, h: r.height })
      const battle = this.box.battle ?? app.battle
      if (battle?.select) battle.select(i >= 0 ? i : null)
      else {
        this.box.select(i >= 0 ? i : null)
        if (i >= 0) this.box.setCamera('orbit', { unitIndex: i })
      }
    }, on)
  }

  dispose() {
    this.ac.abort()
  }
}
