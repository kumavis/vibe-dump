import * as THREE from 'three'

// ---------------------------------------------------------------------------
// A tiny rigid-origami engine.
//
// You start from ONE flat polygon (the square sheet) and *split the plane*
// along straight crease lines. Each split cuts every face the line crosses in
// two, inserting shared vertices on the cut — so the result is a single
// connected triangle mesh whose faces share vertices along the creases, not a
// pile of separate panels.
//
// Folding is then rigid and isometric: every crease has a dihedral angle, and
// each face's world transform is the composition of the fold rotations along a
// spanning tree of the face graph. Because adjacent faces rotate about the
// *shared* crease edge, that edge stays welded — the sheet bends, it never
// tears or stretches.
// ---------------------------------------------------------------------------

const EPS = 1e-6
const key2 = (x, y) => `${Math.round(x / EPS)}:${Math.round(y / EPS)}`

export class Paper {
  constructor(squareHalf = 1) {
    this.pts = [] // 2D rest positions, the flat sheet
    this._index = new Map()
    this.lines = [] // crease lines: { id, a:[x,y], b:[x,y] }
    const h = squareHalf
    // One face to begin with: the square, CCW.
    this.faces = [[this._v(h, -h), this._v(h, h), this._v(-h, h), this._v(-h, -h)]]
  }

  _v(x, y) {
    const k = key2(x, y)
    let i = this._index.get(k)
    if (i === undefined) {
      i = this.pts.length
      this.pts.push([x, y])
      this._index.set(k, i)
    }
    return i
  }

  // Signed side of point p relative to the directed line a->b.
  static _side(a, b, p) {
    return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
  }

  // Split every face this line passes through. The cut segment becomes a
  // crease tagged with `id`.
  crease(id, a, b) {
    this.lines.push({ id, a, b })
    const next = []
    for (const face of this.faces) {
      const sides = face.map((vid) => Paper._side(a, b, this.pts[vid]))
      const hasPos = sides.some((s) => s > EPS)
      const hasNeg = sides.some((s) => s < -EPS)
      if (!(hasPos && hasNeg)) {
        next.push(face) // line misses (or only grazes) this face
        continue
      }
      const left = []
      const right = []
      for (let i = 0; i < face.length; i++) {
        const cur = face[i]
        const nxt = face[(i + 1) % face.length]
        const sc = sides[i]
        const sn = sides[(i + 1) % face.length]
        if (sc >= -EPS) left.push(cur)
        if (sc <= EPS) right.push(cur)
        if ((sc > EPS && sn < -EPS) || (sc < -EPS && sn > EPS)) {
          // Edge crosses the line: insert the intersection vertex in both.
          const t = sc / (sc - sn)
          const p = this.pts[cur]
          const q = this.pts[nxt]
          const vid = this._v(p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1]))
          left.push(vid)
          right.push(vid)
        }
      }
      next.push(left, right)
    }
    this.faces = next
    return this
  }

  // True if the segment vid0-vid1 lies along crease line `id`.
  _edgeOnLine(vid0, vid1, line) {
    const p = this.pts[vid0]
    const q = this.pts[vid1]
    return (
      Math.abs(Paper._side(line.a, line.b, p)) < 1e-4 &&
      Math.abs(Paper._side(line.a, line.b, q)) < 1e-4
    )
  }

  // Triangulate (fan) and wire up the rigid-fold solver.
  // `rootSelector(centroid2D)` picks which triangle stays fixed.
  build(rootSelector) {
    // Fan-triangulate every face.
    const tris = []
    for (const face of this.faces) {
      for (let i = 1; i < face.length - 1; i++) {
        tris.push([face[0], face[i], face[i + 1]])
      }
    }

    // Map undirected edge -> the triangles touching it.
    const edgeMap = new Map()
    const ekey = (i, j) => (i < j ? `${i}:${j}` : `${j}:${i}`)
    tris.forEach((t, ti) => {
      for (let e = 0; e < 3; e++) {
        const i = t[e]
        const j = t[(e + 1) % 3]
        const k = ekey(i, j)
        if (!edgeMap.has(k)) edgeMap.set(k, { i, j, tris: [] })
        edgeMap.get(k).tris.push(ti)
      }
    })

    // Tag which edges are creases (and which fold line they belong to).
    for (const edge of edgeMap.values()) {
      edge.lineId = null
      for (const line of this.lines) {
        if (this._edgeOnLine(edge.i, edge.j, line)) {
          edge.lineId = line.id
          break
        }
      }
    }

    // Spanning tree of the triangle adjacency graph (BFS from the root tri).
    const centroid = (t) => {
      const a = this.pts[t[0]]
      const b = this.pts[t[1]]
      const c = this.pts[t[2]]
      return [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3]
    }
    let root = 0
    let best = -Infinity
    tris.forEach((t, ti) => {
      const s = rootSelector(centroid(t))
      if (s > best) {
        best = s
        root = ti
      }
    })

    const parent = new Array(tris.length).fill(-1)
    const parentEdge = new Array(tris.length).fill(null)
    const order = [root]
    const seen = new Set([root])
    for (let h = 0; h < order.length; h++) {
      const ti = order[h]
      for (let e = 0; e < 3; e++) {
        const i = tris[ti][e]
        const j = tris[ti][(e + 1) % 3]
        const edge = edgeMap.get(ekey(i, j))
        for (const nb of edge.tris) {
          if (seen.has(nb)) continue
          seen.add(nb)
          parent[nb] = ti
          parentEdge[nb] = edge
          order.push(nb)
        }
      }
    }

    this.tris = tris
    this.order = order
    this.parent = parent
    this.parentEdge = parentEdge
    this.matrices = tris.map(() => new THREE.Matrix4())
    this.creaseEdges = [...edgeMap.values()].filter((e) => e.lineId)

    // Reusable scratch objects (no per-frame allocation).
    this._p0 = new THREE.Vector3()
    this._p1 = new THREE.Vector3()
    this._dir = new THREE.Vector3()
    this._rot = new THREE.Matrix4()
    this._tmp = new THREE.Matrix4()
    return this
  }

  // Solve all face transforms for the current crease angles.
  // `angleOf(lineId)` returns the dihedral angle (radians) for a fold line.
  // `baseMatrix` orients the root face.
  solve(angleOf, baseMatrix) {
    const lift = (vid, out) => out.set(this.pts[vid][0], this.pts[vid][1], 0)
    for (const ti of this.order) {
      const m = this.matrices[ti]
      const pa = this.parent[ti]
      if (pa < 0) {
        m.copy(baseMatrix)
        continue
      }
      const edge = this.parentEdge[ti]
      const angle = edge.lineId ? angleOf(edge.lineId) : 0
      const parentM = this.matrices[pa]
      if (angle === 0) {
        m.copy(parentM)
        continue
      }
      // World-space crease axis = parent transform applied to the shared edge.
      lift(edge.i, this._p0).applyMatrix4(parentM)
      lift(edge.j, this._p1).applyMatrix4(parentM)
      this._dir.subVectors(this._p1, this._p0).normalize()
      // m = T(p0) * R(dir, angle) * T(-p0) * parentM
      this._rot.makeRotationAxis(this._dir, angle)
      this._tmp.makeTranslation(-this._p0.x, -this._p0.y, -this._p0.z)
      this._rot.multiply(this._tmp)
      this._tmp.makeTranslation(this._p0.x, this._p0.y, this._p0.z)
      m.multiplyMatrices(this._tmp, this._rot).multiply(parentM)
    }
  }

  // Flat-shaded, non-indexed positions for every triangle (3 verts each).
  writePositions(array) {
    const v = new THREE.Vector3()
    let o = 0
    for (let ti = 0; ti < this.tris.length; ti++) {
      const m = this.matrices[ti]
      for (let c = 0; c < 3; c++) {
        const p = this.pts[this.tris[ti][c]]
        v.set(p[0], p[1], 0).applyMatrix4(m)
        array[o++] = v.x
        array[o++] = v.y
        array[o++] = v.z
      }
    }
    return array
  }

  get triangleCount() {
    return this.tris.length
  }

  // World-space endpoints of every crease, for drawing fold lines.
  writeCreaseLines(array) {
    const v = new THREE.Vector3()
    let o = 0
    for (const edge of this.creaseEdges) {
      const m = this.matrices[edge.tris[0]]
      for (const vid of [edge.i, edge.j]) {
        const p = this.pts[vid]
        v.set(p[0], p[1], 0).applyMatrix4(m)
        array[o++] = v.x
        array[o++] = v.y
        array[o++] = v.z
      }
    }
    return array
  }

  get creaseLineCount() {
    return this.creaseEdges.length
  }
}
