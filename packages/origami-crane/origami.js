import * as THREE from 'three'

// ---------------------------------------------------------------------------
// A tiny rigid-origami engine.
//
// You start from ONE flat polygon (the square sheet) and *split the plane*
// along straight crease lines. Each split cuts every face the line crosses in
// two, inserting shared vertices on the cut — so the result is a single
// connected triangle mesh whose faces share vertices along the creases.
//
// Folding is rigid and isometric: every crease has a dihedral angle, and each
// face's world transform is the composition of the fold rotations along a
// spanning tree of the face graph. Adjacent faces rotate about the *shared*
// crease edge, so that edge stays welded — the sheet bends, never tears.
//
// THE NO-CUT GUARANTEE.  Real origami has no scissors: the paper is one
// connected surface from start to finish. Two things here enforce that, so the
// mesh can never split no matter the crease pattern or the fold angles:
//
//   1. A *conforming* triangulation. When a crease ends on another crease (a
//      reverse fold lifting the neck out of the body, say), it drops a vertex
//      partway along an existing edge. If only one side of that edge knew about
//      the vertex you'd get a T-junction — a hairline slit, and in the worst
//      case a whole panel (a wing!) floating free as its own mesh component.
//      `_conform()` inserts every on-edge vertex into BOTH faces that share the
//      edge, so every edge is split identically on both sides.
//
//   2. *Welded* output. A vertex shared by several faces resolves to ONE world
//      position — the average of what each face's rigid transform predicts for
//      it (`solve()` fills `this.world`). For folds the engine can satisfy
//      rigidly every face agrees and the average is exact; where a complex
//      vertex is slightly over-constrained the faces meet at the average and
//      the paper bends a hair there instead of cracking open. Because every
//      copy of a vertex reads back the SAME welded position, seams are sewn
//      shut by construction. There is no per-face vertex that can drift away.
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

  // Parameter of point p projected onto the line a->b (0 at a, 1 at b).
  static _param(a, b, p) {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    return ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)
  }

  // Split every face this crease passes through. The cut becomes a crease
  // tagged with `id`. With `{ segment: true }` the crease is bounded to the
  // span a..b: a face is only cut where the crease enters AND exits within
  // that span (so a crease can be local to a region, e.g. the body band).
  crease(id, a, b, { segment = false } = {}) {
    this.lines.push({ id, a, b, segment })
    const next = []
    for (const face of this.faces) {
      const sides = face.map((vid) => Paper._side(a, b, this.pts[vid]))
      const hasPos = sides.some((s) => s > EPS)
      const hasNeg = sides.some((s) => s < -EPS)
      if (!(hasPos && hasNeg)) {
        next.push(face) // line misses (or only grazes) this face
        continue
      }
      // Find where the line crosses this face's edges — but DON'T create any
      // vertices yet. A bounded crease may reject this face after the fact, and
      // a vertex minted for a rejected cut would linger as a phantom that the
      // conforming pass then splatters onto unrelated edges.
      const crossings = new Map() // edge index -> [x, y]
      const cutParams = []
      for (let i = 0; i < face.length; i++) {
        const sc = sides[i]
        const sn = sides[(i + 1) % face.length]
        if ((sc > EPS && sn < -EPS) || (sc < -EPS && sn > EPS)) {
          const t = sc / (sc - sn)
          const p = this.pts[face[i]]
          const q = this.pts[face[(i + 1) % face.length]]
          const x = p[0] + t * (q[0] - p[0])
          const y = p[1] + t * (q[1] - p[1])
          crossings.set(i, [x, y])
          cutParams.push(Paper._param(a, b, [x, y]))
        }
      }
      // Bounded crease: skip faces the span doesn't fully reach.
      if (segment && cutParams.some((t) => t < -EPS || t > 1 + EPS)) {
        next.push(face)
        continue
      }
      // Commit the split: now mint the shared crossing vertices.
      const left = []
      const right = []
      for (let i = 0; i < face.length; i++) {
        const sc = sides[i]
        if (sc >= -EPS) left.push(face[i])
        if (sc <= EPS) right.push(face[i])
        if (crossings.has(i)) {
          const [x, y] = crossings.get(i)
          const vid = this._v(x, y)
          left.push(vid)
          right.push(vid)
        }
      }
      next.push(left, right)
    }
    this.faces = next
    return this
  }

  // True if edge vid0-vid1 lies along crease `line` (and within its span, if
  // the line is a bounded segment).
  _edgeOnLine(vid0, vid1, line) {
    const p = this.pts[vid0]
    const q = this.pts[vid1]
    if (
      Math.abs(Paper._side(line.a, line.b, p)) >= 1e-4 ||
      Math.abs(Paper._side(line.a, line.b, q)) >= 1e-4
    ) {
      return false
    }
    if (line.segment) {
      const tp = Paper._param(line.a, line.b, p)
      const tq = Paper._param(line.a, line.b, q)
      if (Math.min(tp, tq) < -EPS || Math.max(tp, tq) > 1 + EPS) return false
    }
    return true
  }

  // Make the subdivision conforming: a vertex that lies in the interior of a
  // face's edge gets inserted INTO that edge. Without this a crease that ends
  // on another edge leaves a T-junction — one side of the edge carries the
  // vertex, the other doesn't — and the two faces stop sharing a full edge.
  // That is exactly what let the wings drift off as separate mesh islands.
  _conform() {
    const onEdge = (a, b, p) => {
      // collinear with a->b and strictly between the endpoints?
      const cross = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
      if (Math.abs(cross) > 1e-7) return false
      const len2 = (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2
      const dot = (p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])
      return dot > EPS && dot < len2 - EPS
    }
    this.faces = this.faces.map((face) => {
      const out = []
      for (let i = 0; i < face.length; i++) {
        const cur = face[i]
        const nxt = face[(i + 1) % face.length]
        out.push(cur)
        const a = this.pts[cur]
        const b = this.pts[nxt]
        const mids = []
        for (let k = 0; k < this.pts.length; k++) {
          if (k === cur || k === nxt) continue
          if (onEdge(a, b, this.pts[k])) mids.push(k)
        }
        mids.sort((m, n) => Paper._param(a, b, this.pts[m]) - Paper._param(a, b, this.pts[n]))
        out.push(...mids)
      }
      return out
    })
  }

  // Fan-triangulate one convex face. The apex must NOT be collinear with the
  // face's subdivided edges: fanning from a vertex that sits along a straight
  // run (e.g. a corner on the conformed wing edge) makes every triangle on that
  // run degenerate, and dropping those slivers would delete exactly the edges
  // that weld neighbouring faces together — which is how the wing came loose.
  // So we pick the apex that yields the fewest degenerate fan triangles.
  _triangulate(face) {
    const n = face.length
    if (n < 3) return []
    const area2 = (i, j, k) => {
      const a = this.pts[face[i]]
      const b = this.pts[face[j]]
      const c = this.pts[face[k]]
      return Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]))
    }
    let apex = 0
    let bestDegenerate = Infinity
    for (let s = 0; s < n; s++) {
      let degenerate = 0
      for (let t = 1; t < n - 1; t++) {
        if (area2(s, (s + t) % n, (s + t + 1) % n) <= 1e-9) degenerate++
      }
      if (degenerate < bestDegenerate) {
        bestDegenerate = degenerate
        apex = s
        if (degenerate === 0) break
      }
    }
    const tris = []
    for (let t = 1; t < n - 1; t++) {
      const j = (apex + t) % n
      const k = (apex + t + 1) % n
      if (area2(apex, j, k) > 1e-9) tris.push([face[apex], face[j], face[k]])
    }
    return tris
  }

  // Triangulate and wire up the rigid-fold solver.
  // `rootSelector(centroid2D)` picks which triangle stays fixed.
  build(rootSelector) {
    this._conform()

    const tris = []
    for (const face of this.faces) tris.push(...this._triangulate(face))

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

    // Any triangle the BFS never reached is a detached island. With a
    // conforming mesh this should never happen — assert it loudly if it does.
    if (seen.size !== tris.length) {
      console.warn(`origami: ${tris.length - seen.size} triangle(s) detached from the sheet — mesh is not connected`)
    }

    this.tris = tris
    this.order = order
    this.parent = parent
    this.parentEdge = parentEdge
    this.matrices = tris.map(() => new THREE.Matrix4())
    this.creaseEdges = [...edgeMap.values()].filter((e) => e.lineId)

    // For each rest vertex, which triangles reference it — used to weld every
    // copy of the vertex to one shared world position (the no-cut guarantee).
    this.vertTris = this.pts.map(() => [])
    tris.forEach((t, ti) => {
      for (const vid of t) this.vertTris[vid].push(ti)
    })
    this.world = this.pts.map(() => new THREE.Vector3())

    // Reusable scratch objects (no per-frame allocation).
    this._p0 = new THREE.Vector3()
    this._p1 = new THREE.Vector3()
    this._dir = new THREE.Vector3()
    this._rot = new THREE.Matrix4()
    this._tmp = new THREE.Matrix4()
    this._acc = new THREE.Vector3()
    return this
  }

  // Solve all face transforms for the current crease angles, then weld every
  // shared vertex to a single world position.
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

    // Weld: every shared vertex resolves to the average of the positions its
    // incident faces predict. Faces that fold consistently agree exactly; an
    // over-constrained vertex meets at the average — the paper bends, it never
    // splits, because every face later reads back this one shared position.
    for (let vid = 0; vid < this.world.length; vid++) {
      const list = this.vertTris[vid]
      const w = this.world[vid]
      w.set(0, 0, 0)
      if (list.length === 0) continue
      for (const ti of list) {
        this._acc.set(this.pts[vid][0], this.pts[vid][1], 0).applyMatrix4(this.matrices[ti])
        w.add(this._acc)
      }
      w.multiplyScalar(1 / list.length)
    }
  }

  // Flat-shaded, non-indexed positions for every triangle (3 verts each), read
  // from the welded shared-vertex positions so seams are sewn shut.
  writePositions(array) {
    let o = 0
    for (let ti = 0; ti < this.tris.length; ti++) {
      for (let c = 0; c < 3; c++) {
        const w = this.world[this.tris[ti][c]]
        array[o++] = w.x
        array[o++] = w.y
        array[o++] = w.z
      }
    }
    return array
  }

  get triangleCount() {
    return this.tris.length
  }

  // World-space endpoints of every crease, for drawing fold lines (welded).
  writeCreaseLines(array) {
    let o = 0
    for (const edge of this.creaseEdges) {
      for (const vid of [edge.i, edge.j]) {
        const w = this.world[vid]
        array[o++] = w.x
        array[o++] = w.y
        array[o++] = w.z
      }
    }
    return array
  }

  get creaseLineCount() {
    return this.creaseEdges.length
  }
}
