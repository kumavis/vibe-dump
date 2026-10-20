// 3x3 rotations (row-major) and a perspective camera — the only linear algebra
// the piece needs, since the figure is drawn as projected 2D shapes.

export function mul3(a, b) {
  const o = new Array(9)
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]
  return o
}

export function apply3(m, v) {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ]
}

export const rotX = (a) => {
  const c = Math.cos(a), s = Math.sin(a)
  return [1, 0, 0, 0, c, -s, 0, s, c]
}
export const rotY = (a) => {
  const c = Math.cos(a), s = Math.sin(a)
  return [c, 0, s, 0, 1, 0, -s, 0, c]
}
export const rotZ = (a) => {
  const c = Math.cos(a), s = Math.sin(a)
  return [c, -s, 0, s, c, 0, 0, 0, 1]
}

// Joint rotation: twist about the bone first, then flex, then splay.
export const euler = (x, y, z) => mul3(rotZ(z), mul3(rotX(x), rotY(y)))

export const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const scale3 = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
export const len3 = (a) => Math.hypot(a[0], a[1], a[2])
export const norm3 = (a) => {
  const l = len3(a) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
export const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

// A camera orbiting a target. `project` returns pixel coordinates with the
// origin at the bottom-left (gl_FragCoord's convention) and the view depth.
export class Camera {
  constructor() {
    this.pos = [0, 0, 5]
    this.target = [0, 0, 0]
    this.fov = 0.6
    this.w = 1
    this.h = 1
    this.near = 0.05
    this.update()
  }

  update() {
    const f = norm3(sub3(this.target, this.pos)) // forward
    const r = norm3(cross3(f, [0, 1, 0]))
    const u = cross3(r, f)
    // rows of the world→camera rotation (camera looks down -z)
    this.R = [r[0], r[1], r[2], u[0], u[1], u[2], -f[0], -f[1], -f[2]]
    this.focal = 1 / Math.tan(this.fov / 2)
    this.pxPerUnit = (this.focal * this.h) / 2 // pixels per world unit at depth 1
  }

  toCam(p) {
    return apply3(this.R, sub3(p, this.pos))
  }

  project(p) {
    const c = this.toCam(p)
    const depth = Math.max(-c[2], this.near)
    const s = this.pxPerUnit / depth
    return [this.w / 2 + c[0] * s, this.h / 2 + c[1] * s, depth]
  }

  // Column-major view-projection for the particle shader.
  viewProj() {
    const R = this.R, p = this.pos
    const t = [-(R[0] * p[0] + R[1] * p[1] + R[2] * p[2]), -(R[3] * p[0] + R[4] * p[1] + R[5] * p[2]), -(R[6] * p[0] + R[7] * p[1] + R[8] * p[2])]
    const aspect = this.w / this.h
    const f = this.focal, n = this.near, far = 100
    const A = f / aspect, B = f, C = (far + n) / (n - far), D = (2 * far * n) / (n - far)
    // P * V, written out. V rows: R0 t0 / R1 t1 / R2 t2 / 0 0 0 1
    const m = new Float32Array(16)
    // column j of (P*V): P * Vcol_j
    for (let j = 0; j < 4; j++) {
      const v0 = j < 3 ? R[j] : t[0]
      const v1 = j < 3 ? R[3 + j] : t[1]
      const v2 = j < 3 ? R[6 + j] : t[2]
      const v3 = j < 3 ? 0 : 1
      m[j * 4 + 0] = A * v0
      m[j * 4 + 1] = B * v1
      m[j * 4 + 2] = C * v2 + D * v3
      m[j * 4 + 3] = -v2
    }
    return m
  }
}
