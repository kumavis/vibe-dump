// paper.js — pop-up mechanisms posed from a dihedral angle.
//
// STUB. This file defines the API documented in DESIGN.md ("The `paper`
// library") with placeholder posing so the engine can be developed against it.
// The real implementation replaces every TODO below while keeping the exported
// surface identical.

import * as THREE from 'three'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// Pose a panel frame that hinges on the +z axis of its parent, with its body
// direction rotated `angle` radians from the parent's +x toward +y.
function poseHingedPanel(frame, angle, dir) {
  // Frame convention (DESIGN.md): +z along the glue line, +y the panel normal,
  // +x = y × z; the body lies on the side x·dir ≥ 0.
  frame.rotation.set(0, 0, dir > 0 ? angle : angle + Math.PI)
}

class Hinge {
  constructor(crease, left, right, getTheta, paper) {
    this.crease = crease
    this.left = left
    this.right = right
    this._getTheta = getTheta
    this._paper = paper
    this._outside = null
  }
  get theta() {
    return this._getTheta()
  }
  get outside() {
    if (!this._outside) {
      // TODO(real impl): same crease rotated π about z; θ_out = 2π − θ_in;
      // left/right swap in that frame.
      const crease = new THREE.Object3D()
      crease.rotation.z = Math.PI
      this.crease.add(crease)
      this._outside = new Hinge(crease, this.right, this.left, () => 2 * Math.PI - this.theta, this._paper)
    }
    return this._outside
  }
}

export class Paper {
  constructor(spreadGroup) {
    this.group = spreadGroup
    this._theta = Math.PI
    this._mechanisms = []
    this._materials = new Map()
    this._geometries = []

    const left = new THREE.Object3D()
    const right = new THREE.Object3D()
    left.userData = { dir: -1, length: 1.0 }
    right.userData = { dir: +1, length: 1.0 }
    spreadGroup.add(left, right)
    this.root = new Hinge(spreadGroup, left, right, () => this._theta, this)
  }

  // Engine: once per frame before the scene's update().
  update(theta) {
    this._theta = clamp(theta, 0, Math.PI)
    const h = this._theta / 2
    // Right page body direction (sin θ/2, cos θ/2): angle from +x = π/2 − θ/2.
    poseHingedPanel(this.root.right, Math.PI / 2 - h, +1)
    // Left page body direction (−sin θ/2, cos θ/2): the frame's +x = y × z
    // points the other way, so the frame itself is rotated by π/2 + θ/2 + π…
    // handled by poseHingedPanel via dir.
    poseHingedPanel(this.root.left, Math.PI / 2 + h, -1)
    for (const m of this._mechanisms) m.pose()
  }

  // ---- mechanisms ---------------------------------------------------------

  parallelFold({ on = this.root, a, b, p, q, z0 = -0.5, z1 = 0.5 } = {}) {
    const parent = on.crease
    const left = new THREE.Object3D()
    const right = new THREE.Object3D()
    const ridge = new THREE.Object3D()
    const innerCrease = new THREE.Object3D()
    left.userData = { dir: +1, length: p, z0, z1 }
    right.userData = { dir: -1, length: q, z0, z1 }
    parent.add(left, right, ridge, innerCrease)
    const state = { theta: 0, height: 0 }
    const fold = {
      left,
      right,
      ridge,
      get theta() {
        return state.theta
      },
      get height() {
        return state.height
      },
    }
    fold.inner = new Hinge(innerCrease, left, right, () => state.theta, this)
    Object.defineProperty(fold, 'outer', { get: () => fold.inner.outside })
    const pose = () => {
      // TODO(real impl): circle intersection of radii p, q about a·uL, b·uR.
      const th = on.theta
      const h = th / 2
      const gl = new THREE.Vector2(-Math.sin(h) * a, Math.cos(h) * a)
      const gr = new THREE.Vector2(Math.sin(h) * b, Math.cos(h) * b)
      const d = gl.distanceTo(gr)
      const x = clamp((d * d + p * p - q * q) / (2 * d || 1), -p, p)
      const y = Math.sqrt(Math.max(0, p * p - x * x))
      const ex = gr.clone().sub(gl).normalize()
      const ey = new THREE.Vector2(-ex.y, ex.x)
      const c = gl.clone().addScaledVector(ex, x).addScaledVector(ey, y)
      left.position.set(gl.x, gl.y, 0)
      right.position.set(gr.x, gr.y, 0)
      const dl = c.clone().sub(gl)
      const dr = c.clone().sub(gr)
      left.rotation.set(0, 0, Math.atan2(dl.y, dl.x))
      right.rotation.set(0, 0, Math.atan2(dr.y, dr.x) + Math.PI)
      ridge.position.set(c.x, c.y, 0)
      innerCrease.position.copy(ridge.position)
      const bis = Math.atan2(-(dl.y + dr.y), -(dl.x + dr.x)) // into the fold
      innerCrease.rotation.set(0, 0, bis + Math.PI / 2)
      ridge.rotation.set(0, 0, bis - Math.PI / 2)
      state.theta = Math.acos(clamp(dl.clone().normalize().dot(dr.clone().normalize()), -1, 1))
      state.height = c.y
    }
    this._mechanisms.push({ pose })
    pose()
    return fold
  }

  vFold({ on = this.root, z = 0.3, alpha = 0.5, gamma = 1.2, length = 0.5, toward = 'far' } = {}) {
    const parent = on.crease
    const left = new THREE.Object3D()
    const right = new THREE.Object3D()
    const ridge = new THREE.Object3D()
    const innerCrease = new THREE.Object3D()
    left.userData = { dir: +1, length, alpha, gamma }
    right.userData = { dir: -1, length, alpha, gamma }
    parent.add(left, right, ridge, innerCrease)
    const state = { theta: 0, height: 0 }
    const fold = {
      left,
      right,
      ridge,
      get theta() {
        return state.theta
      },
      get height() {
        return state.height
      },
    }
    fold.inner = new Hinge(innerCrease, left, right, () => state.theta, this)
    Object.defineProperty(fold, 'outer', { get: () => fold.inner.outside })
    const sz = toward === 'near' ? 1 : -1
    const pose = () => {
      // TODO(real impl): β from g·c = cos γ; panel frames from g and c.
      const th = on.theta
      const h = th / 2
      const A = Math.sin(alpha) * Math.cos(h)
      const B = Math.cos(alpha)
      const beta = Math.atan2(A, B) + Math.acos(clamp(Math.cos(gamma) / Math.hypot(A, B), -1, 1))
      left.position.set(0, 0, z)
      right.position.set(0, 0, z)
      ridge.position.set(0, 0, z)
      innerCrease.position.set(0, 0, z)
      // crude: tilt each panel frame's z along its glue line, lift by β
      const gr = new THREE.Vector3(Math.sin(alpha) * Math.sin(h), Math.sin(alpha) * Math.cos(h), sz * Math.cos(alpha))
      const gl = new THREE.Vector3(-gr.x, gr.y, gr.z)
      const c = new THREE.Vector3(0, Math.sin(beta), sz * Math.cos(beta))
      const up = new THREE.Vector3(0, 1, 0)
      const q = new THREE.Quaternion()
      right.quaternion.copy(q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), gr.clone().normalize()))
      left.quaternion.copy(q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), gl.clone().normalize()))
      ridge.quaternion.copy(q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), c))
      innerCrease.quaternion.copy(ridge.quaternion)
      state.theta = th
      state.height = Math.sin(beta) * length
      void up
    }
    this._mechanisms.push({ pose })
    pose()
    return fold
  }

  flap({ on = this.root, side = 'right', x = 0.5, z = 0, alpha = 0, length = 0.3, lift = () => 0 } = {}) {
    const page = side === 'left' ? on.left : on.right
    const panel = new THREE.Object3D()
    panel.userData = { dir: page.userData.dir, length }
    page.add(panel)
    const state = { angle: 0 }
    const pose = () => {
      state.angle = lift(on.theta)
      const dir = page.userData.dir
      panel.position.set(dir * x, 0, z)
      panel.rotation.set(0, alpha, dir * state.angle)
    }
    this._mechanisms.push({ pose })
    pose()
    return {
      panel,
      get angle() {
        return state.angle
      },
    }
  }

  // ---- helpers --------------------------------------------------------------

  card(frame, { length, z0, z1, material, shape = 'rect', thickness = 0 } = {}) {
    const dir = frame.userData.dir ?? 1
    const L = length ?? frame.userData.length ?? 0.5
    const a = z0 ?? frame.userData.z0 ?? -0.5
    const b = z1 ?? frame.userData.z1 ?? 0.5
    let geometry
    if (shape === 'rect') {
      geometry = thickness > 0 ? new THREE.BoxGeometry(L, thickness, b - a) : new THREE.PlaneGeometry(L, b - a)
      if (thickness <= 0) geometry.rotateX(-Math.PI / 2)
      geometry.translate((dir * L) / 2, 0, (a + b) / 2)
    } else {
      // tri / quad / custom THREE.Shape in (s, t): s toward the crease, t along the glue line
      const sh = shape instanceof THREE.Shape ? shape : new THREE.Shape()
      if (!(shape instanceof THREE.Shape)) {
        const g = frame.userData.gamma ?? Math.PI / 2
        sh.moveTo(0, 0)
        sh.lineTo(0, L)
        if (shape === 'quad') sh.lineTo(L * Math.sin(g), L)
        sh.lineTo(L * Math.sin(g), L * Math.cos(g))
        sh.lineTo(0, 0)
      }
      geometry = new THREE.ShapeGeometry(sh)
      // shape (s, t) → frame (x = dir·s, y = 0, z = t)
      geometry.rotateX(-Math.PI / 2) // (s, t, 0) → (s, 0, t)… then mirror x by dir
      if (dir < 0) geometry.scale(-1, 1, 1)
    }
    this._geometries.push(geometry)
    const mesh = new THREE.Mesh(geometry, material ?? this.material({ color: '#f2e9d8' }))
    mesh.castShadow = true
    mesh.receiveShadow = true
    frame.add(mesh)
    return mesh
  }

  place(frame, { x = 0, y = 0, z = 0 } = {}) {
    const o = new THREE.Object3D()
    o.position.set((frame.userData.dir ?? 1) * x, y, z)
    frame.add(o)
    return o
  }

  material({ color = '#f2e9d8', roughness = 0.92, metalness = 0, side = THREE.DoubleSide, ...rest } = {}) {
    const key = JSON.stringify({ color, roughness, metalness, side, ...rest })
    let m = this._materials.get(key)
    if (!m) {
      m = new THREE.MeshStandardMaterial({ color, roughness, metalness, side, ...rest })
      this._materials.set(key, m)
    }
    return m
  }

  rng(seed = 1) {
    let s = (seed >>> 0) || 1
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0
      return s / 4294967296
    }
  }

  dispose() {
    for (const g of this._geometries) g.dispose()
    for (const m of this._materials.values()) m.dispose()
    this._geometries.length = 0
    this._materials.clear()
  }
}
