/* ===========================================================================
   Busy Beaver Basins
   ---------------------------------------------------------------------------
   A Turing machine on an unbounded tape has infinitely many configurations, and
   one run from the blank tape is a single path — there is nothing to fly
   through. Put the same machine on a *ring* of N cells and the configuration
   space is finite again, the step function is total, and you are back to a
   functional graph: out-degree one, one attractor per component, transient
   trees draining into it.

   A node here is (control state, tape word read starting under the head). That
   encoding is already the quotient by rotating the ring, because "the tape as
   the head sees it" does not care where on the ring the head is standing. It
   costs no enumeration and it divides the raw configuration count by exactly N.

   Every halting configuration is merged into a single sink, so "does it halt"
   becomes "which cone are you in".
   =========================================================================== */

const HALT = -1

// ------------------------------------------------------------------- machine

/** Parse the standard machine code, e.g. 1RB1LC_1RC1RB_1RD0LE_1LA1LD_1RZ0LA. */
function parseMachine(code) {
  const rows = code.trim().toUpperCase().split('_').filter(Boolean)
  if (rows.length < 1 || rows.length > 6) return null
  const n = rows.length
  const write = new Uint8Array(n * 2)
  const dir = new Int8Array(n * 2)
  const next = new Int8Array(n * 2)
  for (let q = 0; q < n; q++) {
    if (rows[q].length !== 6) return null
    for (let c = 0; c < 2; c++) {
      const t = rows[q].slice(c * 3, c * 3 + 3)
      const i = q * 2 + c
      if (t === '---') { write[i] = 0; dir[i] = 1; next[i] = HALT; continue }
      if (t[0] !== '0' && t[0] !== '1') return null
      if (t[1] !== 'L' && t[1] !== 'R') return null
      write[i] = t[0] === '1' ? 1 : 0
      dir[i] = t[1] === 'R' ? 1 : -1
      if (t[2] === 'Z' || t[2] === 'H' || t[2] === '-') { next[i] = HALT; continue }
      const q2 = t.charCodeAt(2) - 65
      if (q2 < 0 || q2 >= n) return null
      next[i] = q2
    }
  }
  return { n, write, dir, next, code: formatMachine({ n, write, dir, next }) }
}

function formatMachine(m) {
  let out = ''
  for (let q = 0; q < m.n; q++) {
    if (q) out += '_'
    for (let c = 0; c < 2; c++) {
      const i = q * 2 + c
      out += (m.write[i] ? '1' : '0') + (m.dir[i] > 0 ? 'R' : 'L') +
             (m.next[i] === HALT ? 'Z' : String.fromCharCode(65 + m.next[i]))
    }
  }
  return out
}

function randomMachine(n) {
  const opts = 4 * (n + 1)
  const write = new Uint8Array(n * 2)
  const dir = new Int8Array(n * 2)
  const next = new Int8Array(n * 2)
  for (let i = 0; i < n * 2; i++) {
    const o = (Math.random() * opts) | 0
    write[i] = o & 1
    dir[i] = ((o >> 1) & 1) ? 1 : -1
    next[i] = (o >> 2) - 1
  }
  const m = { n, write, dir, next }
  m.code = formatMachine(m)
  return m
}

/**
 * The honest run: blank tape, unbounded in both directions. This is the thing
 * the busy beaver problem is actually about; the ring below is the toy that
 * lets you look at it.
 */
function runUnbounded(m, cap) {
  const SIZE = 1 << 17
  const MID = SIZE >> 1
  const tape = new Uint8Array(SIZE)
  let head = MID, q = 0, steps = 0, lo = MID, hi = MID
  while (steps < cap) {
    const i = q * 2 + tape[head]
    const t = m.next[i]
    tape[head] = m.write[i]
    head += m.dir[i]
    if (head < lo) lo = head; else if (head > hi) hi = head
    steps++
    if (t === HALT) {
      let ones = 0
      for (let k = lo; k <= hi; k++) ones += tape[k]
      return { halted: true, steps, ones, span: hi - lo + 1 }
    }
    q = t
    if (head <= 0 || head >= SIZE - 1) return { halted: false, steps, span: hi - lo + 1, escaped: true }
  }
  return { halted: false, steps, span: hi - lo + 1 }
}

/** The first `rows` steps of that run, for the spacetime strip. */
function traceUnbounded(m, rows) {
  const SIZE = 1 << 12
  const MID = SIZE >> 1
  const tape = new Uint8Array(SIZE)
  const heads = new Int32Array(rows)
  const qs = new Int32Array(rows)
  const reads = new Uint8Array(rows)
  const snaps = []
  let head = MID, q = 0, steps = 0, lo = MID, hi = MID
  for (let r = 0; r < rows; r++) {
    heads[r] = head
    qs[r] = q
    reads[r] = tape[head]
    snaps.push(tape.slice(MID - 96, MID + 96))
    const i = q * 2 + tape[head]
    const t = m.next[i]
    tape[head] = m.write[i]
    head += m.dir[i]
    if (head < lo) lo = head; else if (head > hi) hi = head
    steps++
    if (t === HALT) return { snaps, heads, qs, reads, rows: r + 1, halted: true, haltRow: r + 1, lo, hi, mid: MID }
    q = t
    if (head <= 1 || head >= SIZE - 2) return { snaps, heads, qs, reads, rows: r + 1, halted: false, lo, hi, mid: MID }
  }
  return { snaps, heads, qs, reads, rows, halted: false, lo, hi, mid: MID }
}

// --------------------------------------------------------------- ring graph

/**
 * Build the rotation-quotiented ring configuration graph.
 *
 * Node id = q * 2^N + w, where bit i of w is the tape cell at (head + i) mod N.
 * Stepping is: overwrite bit 0, rotate the word one place (left for a move
 * right, right for a move left), change state. `merge` collapses every halting
 * configuration into one sink; without it each distinct final tape becomes its
 * own fixed point.
 */
function buildRing(m, N, merge) {
  const R = 1 << N
  const mask = R - 1
  const halts = hasHalt(m)
  const base = m.n * R
  const M = !halts ? base : (merge ? base + 1 : base + R)
  const succ = new Int32Array(M)
  if (halts) {
    if (merge) succ[base] = base
    else for (let w = 0; w < R; w++) succ[base + w] = base + w
  }
  for (let q = 0; q < m.n; q++) {
    for (let w = 0; w < R; w++) {
      const i = q * 2 + (w & 1)
      let nw = m.write[i] ? (w | 1) : (w & ~1)
      nw = m.dir[i] === 1
        ? ((nw >>> 1) | ((nw & 1) << (N - 1)))
        : (((nw << 1) | (nw >>> (N - 1))) & mask)
      succ[q * R + w] = m.next[i] === HALT ? (merge ? base : base + nw) : m.next[i] * R + nw
    }
  }
  return { M, succ, N, R, base, halts, merge, n: m.n }
}

function hasHalt(m) {
  for (let i = 0; i < m.n * 2; i++) if (m.next[i] === HALT) return true
  return false
}

/**
 * Classify the functional graph: which nodes sit on cycles, which component
 * each belongs to, and how many steps every node is from its attractor.
 */
function analyze(succ) {
  const M = succ.length

  // Attractor nodes: peel leaves until only cycles are left.
  const indeg = new Int32Array(M)
  for (let s = 0; s < M; s++) indeg[succ[s]]++
  const onCycle = new Uint8Array(M).fill(1)
  const stack = []
  for (let s = 0; s < M; s++) if (indeg[s] === 0) stack.push(s)
  while (stack.length) {
    const u = stack.pop()
    onCycle[u] = 0
    if (--indeg[succ[u]] === 0) stack.push(succ[u])
  }

  // Components, by union-find over s -> succ[s].
  const parent = new Int32Array(M)
  for (let s = 0; s < M; s++) parent[s] = s
  const find = (x) => { while (parent[x] !== x) x = parent[x] = parent[parent[x]]; return x }
  for (let s = 0; s < M; s++) {
    const a = find(s), b = find(succ[s])
    if (a !== b) parent[a] = b
  }
  const compOf = new Int32Array(M)
  const index = new Map()
  let nComp = 0
  for (let s = 0; s < M; s++) {
    const r = find(s)
    let i = index.get(r)
    if (i === undefined) { i = nComp++; index.set(r, i) }
    compOf[s] = i
  }

  // Reverse edges, flat.
  const counts = new Int32Array(M)
  for (let s = 0; s < M; s++) counts[succ[s]]++
  const revStart = new Int32Array(M + 1)
  for (let s = 0; s < M; s++) revStart[s + 1] = revStart[s] + counts[s]
  const rev = new Int32Array(M)
  const fill = revStart.slice(0, M)
  for (let s = 0; s < M; s++) rev[fill[succ[s]]++] = s

  // Distance to the attractor, breadth-first back from the cycles.
  const dist = new Int32Array(M).fill(-1)
  let frontier = []
  for (let s = 0; s < M; s++) if (onCycle[s]) { dist[s] = 0; frontier.push(s) }
  let maxDist = 0
  while (frontier.length) {
    const nextF = []
    for (const v of frontier) {
      for (let k = revStart[v]; k < revStart[v + 1]; k++) {
        const u = rev[k]
        if (dist[u] === -1) {
          dist[u] = dist[v] + 1
          if (dist[u] > maxDist) maxDist = dist[u]
          nextF.push(u)
        }
      }
    }
    frontier = nextF
  }

  const cycleLen = new Map()
  for (let s = 0; s < M; s++) if (onCycle[s]) cycleLen.set(compOf[s], (cycleLen.get(compOf[s]) || 0) + 1)
  let eden = 0
  for (let s = 0; s < M; s++) if (revStart[s + 1] === revStart[s]) eden++

  return { M, succ, onCycle, compOf, dist, maxDist, nComp, cycleLen, eden, revStart, rev }
}

// ------------------------------------------------------------------- layout

/**
 * The canonical picture of a functional graph, drawn directly rather than
 * discovered by a force simulation:
 *   • each attractor cycle becomes a literal ring in the z = 0 plane;
 *   • height is steps-to-attractor, so every edge points downhill;
 *   • transient trees fan out in the angular wedge of the cycle node they drain
 *     into, split among subtrees by leaf count, so siblings never cross;
 *   • components pack as disjoint disks, so N basins read as N objects.
 */
const TAU = Math.PI * 2
const clamp = (v, a, b) => v < a ? a : v > b ? b : v

function layout(a, nodeSpacing = 13, levelHeight = 16) {
  const { M, succ, onCycle, compOf, dist, maxDist, nComp, revStart, rev } = a
  const pad = nodeSpacing * 1.3

  const byDepth = Array.from({ length: maxDist + 1 }, () => [])
  for (let v = 0; v < M; v++) byDepth[dist[v]].push(v)

  // Subtree leaf weight, deepest first so children are ready before parents.
  const weight = new Float64Array(M)
  for (let d = maxDist; d >= 0; d--) {
    for (const v of byDepth[d]) {
      let w = 0, any = false
      for (let k = revStart[v]; k < revStart[v + 1]; k++) {
        const u = rev[k]
        if (onCycle[u]) continue
        any = true
        w += weight[u]
      }
      weight[v] = any ? w : 1
    }
  }

  const comps = new Array(nComp)
  for (let c = 0; c < nComp; c++) comps[c] = { cycle: [], levels: [], height: 0, radius: 0, r: null }
  for (let v = 0; v < M; v++) {
    const c = comps[compOf[v]]
    const d = dist[v]
    c.levels[d] = (c.levels[d] || 0) + 1
    if (d > c.height) c.height = d
  }
  const walked = new Uint8Array(M)
  for (let v = 0; v < M; v++) {
    if (!onCycle[v] || walked[v]) continue
    const c = comps[compOf[v]]
    let u = v
    do { c.cycle.push(u); walked[u] = 1; u = succ[u] } while (u !== v)
  }

  // A level wants circumference for its population. Past `hoop` that becomes a
  // single absurd ring, so wide levels get seated in a shell of concentric
  // rings instead — the basin stays compact and reads as a solid body.
  const hoop = nodeSpacing * 46
  for (const c of comps) {
    const L = c.cycle.length
    const rr = new Float64Array(c.height + 1)
    const layers = new Int32Array(c.height + 1)
    let widest = 0
    for (let d = 0; d <= c.height; d++) {
      const nn = c.levels[d] || 0
      let need = (nn * nodeSpacing) / TAU
      if (d === 0 && L <= 1) need = 0
      const k = Math.max(1, Math.ceil(need / hoop))
      layers[d] = k
      // Unlike a cellular automaton's basins these taper, so the radius follows
      // the population honestly instead of ratcheting upward.
      rr[d] = Math.max(need / k, d === 0 && L <= 1 ? 0 : nodeSpacing * 0.6)
      if (rr[d] > widest) widest = rr[d]
    }
    c.r = rr
    c.layers = layers
    c.radius = Math.max(widest, nodeSpacing * 0.5)
  }

  const angle = new Float64Array(M)
  const wlo = new Float64Array(M)
  const whi = new Float64Array(M)
  for (const c of comps) {
    const L = c.cycle.length
    const span = TAU / L
    for (let k = 0; k < L; k++) {
      const v = c.cycle[k]
      const th = L === 1 ? 0 : k * span
      angle[v] = th
      wlo[v] = th - span / 2
      whi[v] = th + span / 2
    }
  }
  for (let d = 0; d <= maxDist; d++) {
    for (const v of byDepth[d]) {
      let total = 0, count = 0
      for (let k = revStart[v]; k < revStart[v + 1]; k++) {
        const u = rev[k]
        if (onCycle[u]) continue
        total += weight[u]; count++
      }
      if (!count) continue
      const width = whi[v] - wlo[v]
      let cur = wlo[v]
      for (let k = revStart[v]; k < revStart[v + 1]; k++) {
        const u = rev[k]
        if (onCycle[u]) continue
        const w = (weight[u] / total) * width
        wlo[u] = cur; whi[u] = cur + w; angle[u] = cur + w / 2
        cur += w
      }
    }
  }

  const centers = packDisks(comps.map((c) => c.radius), pad)

  let widest = 0
  for (const c of comps) if (c.radius > widest) widest = c.radius
  levelHeight = clamp(widest * 1.5 / Math.max(1, maxDist), nodeSpacing * 0.55, nodeSpacing * 9)

  // Rank within its level, so shelled levels can step inward ring by ring.
  const rank = new Int32Array(M)
  const seen = new Int32Array(maxDist + 1)
  for (let d = 0; d <= maxDist; d++) for (const v of byDepth[d]) rank[v] = seen[d]++

  const positions = new Float32Array(M * 3)
  for (let v = 0; v < M; v++) {
    const c = comps[compOf[v]]
    const ctr = centers[compOf[v]]
    const d = dist[v]
    const k = c.layers[d]
    const shell = k > 1 ? 1 - (rank[v] % k) * (0.42 / k) : 1
    const r = c.r[d] * shell
    positions[v * 3] = ctr.x + r * Math.cos(angle[v])
    positions[v * 3 + 1] = ctr.y + r * Math.sin(angle[v])
    positions[v * 3 + 2] = d * levelHeight
  }
  return { positions, comps, levelHeight }
}

/** Greedy disk packing along a phyllotaxis spiral, largest disk first. */
function packDisks(radii, pad) {
  const n = radii.length
  if (n === 1) return [{ x: 0, y: 0 }]
  const GOLDEN = Math.PI * (3 - Math.sqrt(5))
  let sq = 0, maxR = 0
  for (const r0 of radii) {
    const r = r0 + pad
    sq += r * r
    if (r > maxR) maxR = r
  }
  const step = Math.max(1e-3, 0.85 * Math.sqrt(sq / n))
  const cell = 2 * maxR
  const grid = new Map()
  const key = (i, j) => (i + 32768) * 65536 + (j + 32768)
  const fits = (x, y, r) => {
    const ci = Math.floor(x / cell), cj = Math.floor(y / cell)
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      const b = grid.get(key(ci + di, cj + dj))
      if (!b) continue
      for (let p = 0; p < b.length; p++) {
        const q = b[p]
        const dx = x - q.x, dy = y - q.y, rr = r + q.r
        if (dx * dx + dy * dy < rr * rr) return false
      }
    }
    return true
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => radii[j] - radii[i])
  const out = new Array(n)
  let cursor = 0, prevR = Infinity
  for (const idx of order) {
    const r = radii[idx] + pad
    let t = r < prevR ? Math.max(0, cursor - 32) : cursor + 1
    prevR = r
    for (;;) {
      const ang = t * GOLDEN
      const rad = step * Math.sqrt(t)
      const x = rad * Math.cos(ang), y = rad * Math.sin(ang)
      if (fits(x, y, r)) {
        out[idx] = { x, y }
        const k = key(Math.floor(x / cell), Math.floor(y / cell))
        let b = grid.get(k)
        if (!b) { b = []; grid.set(k, b) }
        b.push({ x, y, r })
        cursor = t
        break
      }
      t++
    }
  }
  return out
}

// -------------------------------------------------------------------- colour

/* Two ramps, because there are two answers. Depth still modulates lightness
   within each, so the picture reads twice: hue tells you the fate, brightness
   tells you how close you are to meeting it. */
const RAMP_HALT = [
  [0.00, 0x2a, 0x10, 0x2e], [0.30, 0x6e, 0x1f, 0x3a], [0.55, 0xb8, 0x45, 0x27],
  [0.80, 0xff, 0xae, 0x3d], [1.00, 0xff, 0xf0, 0xc2],
]
const RAMP_LOOP = [
  [0.00, 0x14, 0x1c, 0x3e], [0.30, 0x12, 0x40, 0x6b], [0.55, 0x14, 0x7d, 0x96],
  [0.80, 0x46, 0xd3, 0xe6], [1.00, 0xd8, 0xf8, 0xff],
]

function ramp(list, v, out, o) {
  const t = v <= 0 ? 0 : v >= 1 ? 1 : v
  let i = 0
  while (i < list.length - 2 && t > list[i + 1][0]) i++
  const a = list[i], b = list[i + 1]
  const k = (t - a[0]) / (b[0] - a[0])
  out[o] = (a[1] + (b[1] - a[1]) * k) / 255
  out[o + 1] = (a[2] + (b[2] - a[2]) * k) / 255
  out[o + 2] = (a[3] + (b[3] - a[3]) * k) / 255
}

// ------------------------------------------------------------------- webgl

const canvas = document.getElementById('gl')
const gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' })
if (!gl) {
  document.getElementById('boot').textContent = 'this browser has no webgl'
  throw new Error('no webgl')
}

const VS_POINT = `
attribute vec3 aPos; attribute vec3 aCol;
uniform mat4 uMVP; uniform float uScale; uniform float uSize;
varying vec3 vCol;
void main() {
  vCol = aCol;
  vec4 p = uMVP * vec4(aPos, 1.0);
  gl_Position = p;
  gl_PointSize = clamp(uSize * uScale / max(p.w, 0.001), 1.0, 190.0);
}`
const FS_POINT = `
precision mediump float;
varying vec3 vCol; uniform float uAlpha;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.06, length(d));
  if (a <= 0.004) discard;
  gl_FragColor = vec4(vCol, a * uAlpha);
}`
const VS_LINE = `
attribute vec3 aPos; attribute vec3 aCol;
uniform mat4 uMVP;
varying vec3 vCol;
void main() { vCol = aCol; gl_Position = uMVP * vec4(aPos, 1.0); }`
const FS_LINE = `
precision mediump float;
varying vec3 vCol; uniform float uAlpha;
void main() { gl_FragColor = vec4(vCol, uAlpha); }`

function shader(type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
  return s
}
function makeProgram(vs, fs, names) {
  const p = gl.createProgram()
  gl.attachShader(p, shader(gl.VERTEX_SHADER, vs))
  gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  const o = { p, a: {}, u: {} }
  o.a.aPos = gl.getAttribLocation(p, 'aPos')
  o.a.aCol = gl.getAttribLocation(p, 'aCol')
  for (const n of names) o.u[n] = gl.getUniformLocation(p, n)
  return o
}
const PROG_POINT = makeProgram(VS_POINT, FS_POINT, ['uMVP', 'uScale', 'uSize', 'uAlpha'])
const PROG_LINE = makeProgram(VS_LINE, FS_LINE, ['uMVP', 'uAlpha'])

function buffer(data) {
  const b = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, b)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
  return b
}

// 4x4 matrix helpers, column-major like GL wants.
function perspective(out, fovy, aspect, near, far) {
  const f = 1 / Math.tan(fovy / 2)
  out.fill(0)
  out[0] = f / aspect; out[5] = f; out[11] = -1
  out[10] = (far + near) / (near - far)
  out[14] = (2 * far * near) / (near - far)
  return out
}
function lookAt(out, eye, at, up) {
  let zx = eye[0] - at[0], zy = eye[1] - at[1], zz = eye[2] - at[2]
  let l = Math.hypot(zx, zy, zz) || 1
  zx /= l; zy /= l; zz /= l
  let xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx
  l = Math.hypot(xx, xy, xz) || 1
  xx /= l; xy /= l; xz /= l
  const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx
  out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0
  out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0
  out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2])
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2])
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2])
  out[15] = 1
  return out
}
function multiply(out, a, b) {
  for (let c = 0; c < 4; c++) {
    const b0 = b[c * 4], b1 = b[c * 4 + 1], b2 = b[c * 4 + 2], b3 = b[c * 4 + 3]
    out[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3
    out[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3
    out[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3
    out[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3
  }
  return out
}

const FOV = 55 * Math.PI / 180
const matProj = new Float32Array(16)
const matView = new Float32Array(16)
const matMVP = new Float32Array(16)

// ------------------------------------------------------------------- camera

const cam = { az: 0.9, el: 0.40, dist: 900, tAz: 0.9, tEl: 0.40, tDist: 900, target: [0, 0, 0], tTarget: [0, 0, 0] }
let autoOrbit = true
const eye = [0, 0, 0]

function updateCamera(dt) {
  if (autoOrbit && !dragging) cam.tAz += dt * 0.14
  const k = 1 - Math.pow(0.0001, dt)
  cam.az += (cam.tAz - cam.az) * k
  cam.el += (cam.tEl - cam.el) * k
  cam.dist += (cam.tDist - cam.dist) * k
  for (let i = 0; i < 3; i++) cam.target[i] += (cam.tTarget[i] - cam.target[i]) * k
  const ce = Math.cos(cam.el)
  eye[0] = cam.target[0] + cam.dist * ce * Math.cos(cam.az)
  eye[1] = cam.target[1] + cam.dist * ce * Math.sin(cam.az)
  eye[2] = cam.target[2] + cam.dist * Math.sin(cam.el)
  const aspect = canvas.width / Math.max(1, canvas.height)
  perspective(matProj, FOV, aspect, Math.max(0.5, cam.dist * 0.002), cam.dist * 12 + 8000)
  // The rail and the machine bar sit on top of the canvas, so aim the frustum at
  // the middle of what is actually visible instead of the middle of the window.
  const pad = chromePads()
  const cx = (pad.l + innerWidth - pad.r) / 2
  const cy = (pad.t + innerHeight - pad.b) / 2
  matProj[8] = -(2 * cx / innerWidth - 1)
  matProj[9] = -(1 - 2 * cy / innerHeight)
  lookAt(matView, eye, cam.target, [0, 0, 1])
  multiply(matMVP, matProj, matView)
}

/** How much of the window the chrome is covering, in CSS pixels. */
function chromePads() {
  const rail = document.getElementById('rail')
  const dock = document.getElementById('dock')
  const pad = { l: 16, r: 16, t: 16, b: 16 }
  if (!rail.classList.contains('hidden')) pad.l = rail.getBoundingClientRect().right + 18
  const db = dock.getBoundingClientRect()
  if (db.height > 0 && getComputedStyle(dock).display !== 'none') pad.b = innerHeight - db.top + 16
  return pad
}

let dragging = false
let lastX = 0, lastY = 0, downX = 0, downY = 0
const pointers = new Map()
let pinchDist = 0

canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId)
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  lastX = e.clientX; lastY = e.clientY
  downX = e.clientX; downY = e.clientY
  dragging = pointers.size === 1
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    pinchDist = Math.hypot(a.x - b.x, a.y - b.y)
  }
  hideTip()
})
canvas.addEventListener('pointermove', (e) => {
  cursor.x = e.clientX; cursor.y = e.clientY; cursor.inside = true
  if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    const d = Math.hypot(a.x - b.x, a.y - b.y)
    if (pinchDist > 0) cam.tDist = clamp(cam.tDist * (pinchDist / Math.max(1, d)), 6, 400000)
    pinchDist = d
    return
  }
  if (dragging && pointers.size === 1) {
    const dx = e.clientX - lastX, dy = e.clientY - lastY
    if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 3) hideTip()
    cam.tAz -= dx * 0.006
    cam.tEl = clamp(cam.tEl + dy * 0.006, -1.45, 1.45)
    lastX = e.clientX; lastY = e.clientY
  } else {
    needPick = true
  }
})
function endPointer(e) {
  const moved = Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY)
  pointers.delete(e.pointerId)
  if (pointers.size < 2) pinchDist = 0
  if (dragging && pointers.size === 0) {
    dragging = false
    if (moved < 4) clickAt(e.clientX, e.clientY)
    needPick = true
  }
}
canvas.addEventListener('pointerup', endPointer)
canvas.addEventListener('pointercancel', endPointer)
canvas.addEventListener('pointerleave', () => { cursor.inside = false; needPick = true })
canvas.addEventListener('wheel', (e) => {
  e.preventDefault()
  cam.tDist = clamp(cam.tDist * Math.exp(e.deltaY * 0.0012), 6, 400000)
}, { passive: false })

// ------------------------------------------------------------------- scene

let scene = null

function disposeScene() {
  if (!scene) return
  for (const b of scene.buffers) gl.deleteBuffer(b)
  scene = null
}

function buildScene(g, a, lay) {
  disposeScene()
  const M = a.M
  const maxD = Math.max(1, a.maxDist)
  const pos = lay.positions

  // Which component is the halting one? Everything else loops forever.
  const haltComp = g.halts ? a.compOf[g.base] : -1
  const isHalting = new Uint8Array(M)
  if (g.halts) {
    if (g.merge) for (let v = 0; v < M; v++) isHalting[v] = a.compOf[v] === haltComp ? 1 : 0
    else {
      // Split mode: every fixed point that is a halted configuration seeds one.
      const haltComps = new Set()
      for (let w = 0; w < g.R; w++) haltComps.add(a.compOf[g.base + w])
      for (let v = 0; v < M; v++) isHalting[v] = haltComps.has(a.compOf[v]) ? 1 : 0
    }
  }

  const nodeCol = new Float32Array(M * 3)
  for (let v = 0; v < M; v++) {
    ramp(isHalting[v] ? RAMP_HALT : RAMP_LOOP, 1 - a.dist[v] / maxD, nodeCol, v * 3)
  }

  const nodeSize = 13 * 0.5

  // Attractor halo, tinted by which kind of attractor it is.
  let nCycle = 0
  for (let v = 0; v < M; v++) if (a.onCycle[v]) nCycle++
  const glowPos = new Float32Array(nCycle * 3)
  const glowCol = new Float32Array(nCycle * 3)
  for (let v = 0, j = 0; v < M; v++) {
    if (!a.onCycle[v]) continue
    glowPos[j * 3] = pos[v * 3]; glowPos[j * 3 + 1] = pos[v * 3 + 1]; glowPos[j * 3 + 2] = pos[v * 3 + 2]
    if (isHalting[v]) { glowCol[j * 3] = 1.0; glowCol[j * 3 + 1] = 0.70; glowCol[j * 3 + 2] = 0.25 }
    else { glowCol[j * 3] = 0.27; glowCol[j * 3 + 1] = 0.83; glowCol[j * 3 + 2] = 0.90 }
    j++
  }

  // One edge per node, minus the self-loops at the fixed points.
  let nEdges = 0
  for (let s = 0; s < M; s++) if (a.succ[s] !== s) nEdges++
  const linePos = new Float32Array(nEdges * 6)
  const lineCol = new Float32Array(nEdges * 6)
  for (let s = 0, e = 0; s < M; s++) {
    const t = a.succ[s]
    if (t === s) continue
    const o = e * 6
    const K = 0.87
    linePos[o] = pos[s * 3]; linePos[o + 1] = pos[s * 3 + 1]; linePos[o + 2] = pos[s * 3 + 2]
    linePos[o + 3] = pos[s * 3] + (pos[t * 3] - pos[s * 3]) * K
    linePos[o + 4] = pos[s * 3 + 1] + (pos[t * 3 + 1] - pos[s * 3 + 1]) * K
    linePos[o + 5] = pos[s * 3 + 2] + (pos[t * 3 + 2] - pos[s * 3 + 2]) * K
    const boost = a.onCycle[s] && a.onCycle[t] ? 1.0 : 0.58
    for (let k = 0; k < 3; k++) {
      lineCol[o + k] = nodeCol[s * 3 + k] * boost
      lineCol[o + 3 + k] = nodeCol[t * 3 + k] * boost
    }
    e++
  }

  const buffers = []
  const mk = (d) => { const b = buffer(d); buffers.push(b); return b }

  scene = {
    M, pos, nodeCol, isHalting, nodeSize, haltComp,
    nodes: mk(pos), nodesC: mk(nodeCol), nNodes: M,
    glow: mk(glowPos), glowC: mk(glowCol), nGlow: nCycle,
    lines: mk(linePos), linesC: mk(lineCol), nEdges,
    path: mk(new Float32Array(6)), pathC: mk(new Float32Array(6)), nPath: 0,
    pathPts: mk(new Float32Array(3)), nPathPts: 0,
    sparks: mk(new Float32Array(3)), sparksC: mk(new Float32Array(3)), nSparks: 0,
    mark: mk(new Float32Array(3)),
    buffers,
  }
  seedSparks(a)
  const want = M > 120000 ? 1.25 : M > 50000 ? 1.5 : 2
  if (want !== dprCap) { dprCap = want; resize() }
  fitCamera(pos, M)
}

function fitCamera(pos, M) {
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (let v = 0; v < M; v++) {
    const x = pos[v * 3], y = pos[v * 3 + 1], z = pos[v * 3 + 2]
    if (x < minX) minX = x; if (x > maxX) maxX = x
    if (y < minY) minY = y; if (y > maxY) maxY = y
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2
  // A basin field is a wide, shallow plate: fit its width and its height
  // separately, or the camera backs off far enough to fit a sphere that isn't
  // there and the graph ends up a speck in the corner.
  let rxy = 0, rz = 0
  for (let v = 0; v < M; v++) {
    const dx = pos[v * 3] - cx, dy = pos[v * 3 + 1] - cy
    const d = dx * dx + dy * dy
    if (d > rxy) rxy = d
    const dz = Math.abs(pos[v * 3 + 2] - cz)
    if (dz > rz) rz = dz
  }
  rxy = Math.max(1, Math.sqrt(rxy))
  cam.tTarget = [cx, cy, cz]
  cam.target = [cx, cy, cz]
  fitExtent = { rxy, rz }
  fitCenter = [cx, cy, cz]
  cam.tDist = distanceFor(rxy, rz, cam.tEl)
  cam.dist = cam.tDist
}

let fitExtent = null
let fitCenter = [0, 0, 0]
let markExtent = null

/** Ease toward a viewpoint; the damping in updateCamera does the flying. */
function easeTo({ az, el: elev, dist, node } = {}) {
  if (az != null) cam.tAz = az
  if (elev != null) cam.tEl = elev
  if (node != null && scene) {
    const p = scene.pos
    cam.tTarget = [p[node * 3], p[node * 3 + 1], p[node * 3 + 2]]
  }
  if (dist != null) cam.tDist = dist
}

/** How far back the camera must sit for a plate of this size to fill the space
 *  the panels leave, seen from elevation `el`. */
function distanceFor(rxy, rz, el) {
  const pad = chromePads()
  const freeW = Math.max(120, innerWidth - pad.l - pad.r)
  const freeH = Math.max(120, innerHeight - pad.t - pad.b)
  const t = Math.tan(FOV / 2)
  const tanY = t * (freeH / innerHeight)
  const tanX = t * (innerWidth / innerHeight) * (freeW / innerWidth)
  const reqH = rxy * Math.abs(Math.sin(el)) + rz * Math.abs(Math.cos(el))
  return Math.max(reqH / tanY, rxy / tanX) * 1.1
}

// -------------------------------------------------------------------- sparks

const SPARKS = 900
let sparkNode = null, sparkT = null, sparkPos = null, sparkCol = null

function seedSparks(a) {
  const n = Math.min(SPARKS, Math.max(60, a.M >> 3))
  sparkNode = new Int32Array(n)
  sparkT = new Float32Array(n)
  sparkPos = new Float32Array(n * 3)
  sparkCol = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    sparkNode[i] = (Math.random() * a.M) | 0
    sparkT[i] = Math.random()
  }
  scene.nSparks = n
}

function stepSparks(a, dt) {
  if (!sparkNode) return
  const rate = dt * 1.7
  const pos = scene.pos
  for (let i = 0; i < sparkNode.length; i++) {
    let t = sparkT[i] + rate
    let v = sparkNode[i]
    while (t >= 1) { t -= 1; v = a.succ[v] }
    // Sparks that settle onto a fixed point get recycled somewhere upstream, so
    // the halting basin keeps raining instead of silting up at the sink.
    if (a.succ[v] === v && Math.random() < 0.02) { v = (Math.random() * a.M) | 0; t = 0 }
    sparkNode[i] = v; sparkT[i] = t
    const w = a.succ[v]
    const o = i * 3, sv = v * 3, sw = w * 3
    sparkPos[o] = pos[sv] + (pos[sw] - pos[sv]) * t
    sparkPos[o + 1] = pos[sv + 1] + (pos[sw + 1] - pos[sv + 1]) * t
    sparkPos[o + 2] = pos[sv + 2] + (pos[sw + 2] - pos[sv + 2]) * t
    const h = scene.isHalting[v]
    sparkCol[o] = h ? 1.0 : 0.55
    sparkCol[o + 1] = h ? 0.85 : 0.95
    sparkCol[o + 2] = h ? 0.52 : 1.0
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, scene.sparks)
  gl.bufferData(gl.ARRAY_BUFFER, sparkPos, gl.DYNAMIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, scene.sparksC)
  gl.bufferData(gl.ARRAY_BUFFER, sparkCol, gl.DYNAMIC_DRAW)
}

// ------------------------------------------------------------------ drawing

let showEdges = true
let showFlow = true

function draw() {
  const w = canvas.width, h = canvas.height
  gl.viewport(0, 0, w, h)
  gl.clearColor(0.020, 0.027, 0.047, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.disable(gl.DEPTH_TEST)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
  if (!scene) return

  const scale = h * 0.5 / Math.tan(FOV / 2)
  const density = Math.sqrt(Math.max(1, scene.M))

  if (showEdges && scene.nEdges) {
    gl.useProgram(PROG_LINE.p)
    gl.uniformMatrix4fv(PROG_LINE.u.uMVP, false, matMVP)
    gl.uniform1f(PROG_LINE.u.uAlpha, clamp(9 / density, 0.035, 0.34))
    bindAttr(PROG_LINE.a.aPos, scene.lines)
    bindAttr(PROG_LINE.a.aCol, scene.linesC)
    gl.drawArrays(gl.LINES, 0, scene.nEdges * 2)
  }

  gl.useProgram(PROG_POINT.p)
  gl.uniformMatrix4fv(PROG_POINT.u.uMVP, false, matMVP)
  gl.uniform1f(PROG_POINT.u.uScale, scale)

  drawPoints(scene.nodes, scene.nodesC, scene.nNodes, scene.nodeSize, clamp(26 / density, 0.16, 0.72))
  drawPoints(scene.glow, scene.glowC, scene.nGlow, scene.nodeSize * 3.2, clamp(9 / density, 0.06, 0.28))

  if (scene.nPath) {
    gl.useProgram(PROG_LINE.p)
    gl.uniformMatrix4fv(PROG_LINE.u.uMVP, false, matMVP)
    gl.uniform1f(PROG_LINE.u.uAlpha, 0.70)
    bindAttr(PROG_LINE.a.aPos, scene.path)
    bindAttr(PROG_LINE.a.aCol, scene.pathC)
    gl.drawArrays(gl.LINES, 0, scene.nPath * 2)
    gl.useProgram(PROG_POINT.p)
    gl.uniformMatrix4fv(PROG_POINT.u.uMVP, false, matMVP)
    gl.uniform1f(PROG_POINT.u.uScale, scale)
    drawPointsConst(scene.pathPts, scene.nPathPts, scene.nodeSize * 1.15, 0.52, 1.0, 0.40, 0.70)
  }

  if (showFlow && scene.nSparks) {
    drawPoints(scene.sparks, scene.sparksC, scene.nSparks, scene.nodeSize * 1.5, 0.95)
  }

  if (markNode >= 0) {
    drawPointsConst(scene.mark, 1, scene.nodeSize * 5.2, 0.42, 1.0, 0.37, 0.66)
    drawPointsConst(scene.mark, 1, scene.nodeSize * 1.7, 1.0, 1.0, 0.80, 0.92)
  }
}

function bindAttr(loc, buf) {
  if (loc < 0) return
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0)
}
function drawPoints(bp, bc, count, size, alpha) {
  gl.uniform1f(PROG_POINT.u.uSize, size)
  gl.uniform1f(PROG_POINT.u.uAlpha, alpha)
  bindAttr(PROG_POINT.a.aPos, bp)
  bindAttr(PROG_POINT.a.aCol, bc)
  gl.drawArrays(gl.POINTS, 0, count)
}
function drawPointsConst(bp, count, size, alpha, r, g, b) {
  gl.uniform1f(PROG_POINT.u.uSize, size)
  gl.uniform1f(PROG_POINT.u.uAlpha, alpha)
  bindAttr(PROG_POINT.a.aPos, bp)
  if (PROG_POINT.a.aCol >= 0) {
    gl.disableVertexAttribArray(PROG_POINT.a.aCol)
    gl.vertexAttrib3f(PROG_POINT.a.aCol, r, g, b)
  }
  gl.drawArrays(gl.POINTS, 0, count)
}

// ------------------------------------------------------------------ picking

const cursor = { x: 0, y: 0, inside: false }
let needPick = false
let hovered = -1
let markNode = -1
const tip = document.getElementById('tip')

function project(v, out) {
  const p = scene.pos
  const x = p[v * 3], y = p[v * 3 + 1], z = p[v * 3 + 2]
  const cw = matMVP[3] * x + matMVP[7] * y + matMVP[11] * z + matMVP[15]
  if (cw <= 0.0001) return false
  const cx = matMVP[0] * x + matMVP[4] * y + matMVP[8] * z + matMVP[12]
  const cy = matMVP[1] * x + matMVP[5] * y + matMVP[9] * z + matMVP[13]
  out[0] = (cx / cw * 0.5 + 0.5) * canvas.clientWidth
  out[1] = (0.5 - cy / cw * 0.5) * canvas.clientHeight
  out[2] = cw
  return true
}

const pj = [0, 0, 0]
function nearestNode(px, py, radius) {
  if (!scene) return -1
  let best = -1, bestD = radius * radius
  for (let v = 0; v < scene.M; v++) {
    if (!project(v, pj)) continue
    const dx = pj[0] - px, dy = pj[1] - py
    const d = dx * dx + dy * dy
    if (d < bestD) { bestD = d; best = v }
  }
  return best
}

function clickAt(px, py) {
  const v = nearestNode(px, py, 14)
  if (v < 0) return
  setStMode('ring')
  setMark(v)
}

function hideTip() { tip.classList.remove('show'); hovered = -1 }

function doPick() {
  if (!cursor.inside || dragging) { hideTip(); return }
  const v = nearestNode(cursor.x, cursor.y, 12)
  if (v < 0) { hideTip(); return }
  hovered = v
  tip.innerHTML = describeNode(v)
  tip.classList.add('show')
  const r = tip.getBoundingClientRect()
  tip.style.left = clamp(cursor.x + 16, 8, innerWidth - r.width - 8) + 'px'
  tip.style.top = clamp(cursor.y + 16, 8, innerHeight - r.height - 8) + 'px'
}

/** Node id back to something a person can read: state, tape, fate. */
function describeNode(v) {
  const g = state.ring, a = state.an
  const R = g.R
  let head = ''
  if (g.halts && v >= g.base) {
    head = '<span class="tq">HALTED</span>'
    if (!g.merge) head += ' <span class="tw">' + word(v - g.base, g.N) + '</span>'
  } else {
    const q = (v / R) | 0
    const w = v % R
    head = '<span class="tq">' + String.fromCharCode(65 + q) + '</span> <span class="tw">' + word(w, g.N) + '</span>'
  }
  const d = a.dist[v]
  const fate = scene.isHalting[v]
    ? (d === 0 ? 'halted' : d + ' step' + (d === 1 ? '' : 's') + ' to halt')
    : (d === 0 ? 'on a cycle of ' + a.cycleLen.get(a.compOf[v]) : d + ' step' + (d === 1 ? '' : 's') + ' to a cycle of ' + a.cycleLen.get(a.compOf[v]))
  return head + '<br><span class="tm">' + fate + '</span>'
}

/** Tape word with the cell under the head bracketed. */
function word(w, N) {
  let s = ''
  for (let i = 0; i < N; i++) {
    const bit = (w >> i) & 1
    s += i === 0 ? '<span class="th">[' + bit + ']</span>' : bit
  }
  return s
}

// The trajectory hanging off the marked node: this is the run itself.
function setMark(v) {
  markNode = v
  const a = state.an, pos = scene.pos
  const seen = new Set()
  const path = [v]
  let u = v
  while (!seen.has(u) && path.length < 60000) {
    seen.add(u)
    const w = a.succ[u]
    if (w === u) break
    path.push(w)
    u = w
    if (a.onCycle[u] && seen.has(u)) break
  }
  const nSeg = path.length - 1
  const lp = new Float32Array(Math.max(1, nSeg) * 6)
  const lc = new Float32Array(Math.max(1, nSeg) * 6)
  for (let i = 0; i < nSeg; i++) {
    const s = path[i], t = path[i + 1], o = i * 6
    lp[o] = pos[s * 3]; lp[o + 1] = pos[s * 3 + 1]; lp[o + 2] = pos[s * 3 + 2]
    lp[o + 3] = pos[t * 3]; lp[o + 4] = pos[t * 3 + 1]; lp[o + 5] = pos[t * 3 + 2]
    const k = nSeg > 1 ? i / (nSeg - 1) : 1
    const gr = 0.22 + 0.26 * k, bl = 0.54 + 0.22 * k
    lc[o] = 1.0; lc[o + 1] = gr; lc[o + 2] = bl
    lc[o + 3] = 1.0; lc[o + 4] = gr; lc[o + 5] = bl
  }
  const pp = new Float32Array(path.length * 3)
  let nx = Infinity, xx = -Infinity, ny = Infinity, xy = -Infinity, nz = Infinity, xz = -Infinity
  for (let i = 0; i < path.length; i++) {
    const x = pos[path[i] * 3], y = pos[path[i] * 3 + 1], z = pos[path[i] * 3 + 2]
    pp[i * 3] = x; pp[i * 3 + 1] = y; pp[i * 3 + 2] = z
    if (x < nx) nx = x; if (x > xx) xx = x
    if (y < ny) ny = y; if (y > xy) xy = y
    if (z < nz) nz = z; if (z > xz) xz = z
  }
  markExtent = {
    center: [(nx + xx) / 2, (ny + xy) / 2, (nz + xz) / 2],
    rxy: Math.max(1, 0.5 * Math.hypot(xx - nx, xy - ny)),
    rz: Math.max(1, 0.5 * (xz - nz)),
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, scene.path); gl.bufferData(gl.ARRAY_BUFFER, lp, gl.DYNAMIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, scene.pathC); gl.bufferData(gl.ARRAY_BUFFER, lc, gl.DYNAMIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, scene.pathPts); gl.bufferData(gl.ARRAY_BUFFER, pp, gl.DYNAMIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, scene.mark)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([pos[v * 3], pos[v * 3 + 1], pos[v * 3 + 2]]), gl.DYNAMIC_DRAW)
  scene.nPath = nSeg
  scene.nPathPts = path.length
  describeProbe(v)
  renderSpacetime()
}

function describeProbe(v) {
  const a = state.an
  const d = a.dist[v]
  const isBlank = v === 0
  const g = state.ring
  if (g.halts && v >= g.base) {
    document.getElementById('probeNote').innerHTML =
      'This is the <b>halt state</b> itself — the point every run in the amber cone falls to.'
    return
  }
  const who = isBlank ? 'The blank tape' : 'This configuration'
  let text
  if (scene.isHalting[v]) {
    text = who + ' sits <b>' + d.toLocaleString() + ' step' + (d === 1 ? '' : 's') + '</b> above the halt point.'
    if (isBlank) text += ' That height is the machine’s score on this ring.'
  } else {
    const L = a.cycleLen.get(a.compOf[v])
    text = who + ' falls for <b>' + d.toLocaleString() + ' step' + (d === 1 ? '' : 's') +
      '</b> into a cycle of <b>' + L + '</b>, and repeats forever.'
  }
  document.getElementById('probeNote').innerHTML = text
}

// -------------------------------------------------------------- render loop

let lastTime = performance.now()
let lastPick = 0
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

function frame(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000)
  lastTime = now
  updateCamera(dt)
  if (stagePlay) stageTick(now)
  const hidden = document.body.classList.contains('staged')
  if (!hidden) {
    if (scene && showFlow && !reduced) stepSparks(state.an, dt)
    draw()
  }
  if (needPick && now - lastPick > 55) { needPick = false; lastPick = now; doPick() }
  requestAnimationFrame(frame)
}

let dprCap = 2
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, dprCap)
  canvas.width = Math.floor(innerWidth * dpr)
  canvas.height = Math.floor(innerHeight * dpr)
  canvas.style.width = innerWidth + 'px'
  canvas.style.height = innerHeight + 'px'
}
function refit() {
  if (!fitExtent) return
  cam.tDist = distanceFor(fitExtent.rxy, fitExtent.rz, cam.tEl)
}

/** Fly back out to the whole basin field. */
function frameAll(elev) {
  if (!fitExtent) return
  if (elev != null) cam.tEl = elev
  cam.tTarget = fitCenter.slice()
  cam.tDist = distanceFor(fitExtent.rxy, fitExtent.rz, cam.tEl)
}

/** Move in on the field's centre, as a fraction of the fitted distance. */
function zoomTo(frac, elev) {
  if (!fitExtent) return
  if (elev != null) cam.tEl = elev
  cam.tTarget = fitCenter.slice()
  cam.tDist = distanceFor(fitExtent.rxy, fitExtent.rz, cam.tEl) * frac
}

/** Frame the marked trajectory, so a 21-step thread reads as 21 steps tall. */
function frameMark(pad = 1.35, elev) {
  if (!markExtent) return
  if (elev != null) cam.tEl = elev
  cam.tTarget = markExtent.center.slice()
  cam.tDist = distanceFor(Math.max(1, markExtent.rxy * pad), markExtent.rz * pad, cam.tEl)
}
addEventListener('resize', () => { resize(); refit(); layoutStage(); if (tourOn && tourAt >= 0) goStep(tourAt) })
resize()

// ---------------------------------------------------------------- spacetime

const stCanvas = document.getElementById('spacetime')

/** Time down, tape across, head in magenta — the run itself, on the real tape. */
function drawSpacetime(m) {
  const ctx = stCanvas.getContext('2d')
  const W = stCanvas.width, H = stCanvas.height
  // Scale the rows to the run: a 21-step machine drawn 3px per row left five
  // sixths of the panel empty and read as broken.
  const probe = runUnbounded(m, 600)
  const tail = probe.halted ? clamp(Math.ceil(probe.steps * 0.2), 2, 20) : 0
  const want = probe.halted ? probe.steps + 1 + tail : 132
  const rows = clamp(want, 6, 320)
  const rowH = H / rows
  const tr = traceUnbounded(m, rows)

  // Window the tape on what the run actually touched, clipped to the snapshot.
  const half = 96
  let lo = Math.max(tr.mid - half, tr.lo - 2)
  let hi = Math.min(tr.mid + half - 1, tr.hi + 2)
  if (hi - lo < 24) { const c = ((lo + hi) / 2) | 0; lo = c - 12; hi = c + 12 }
  const cells = hi - lo + 1
  const cellW = W / cells

  ctx.fillStyle = '#04050a'
  ctx.fillRect(0, 0, W, H)
  for (let r = 0; r < tr.rows; r++) {
    const snap = tr.snaps[r]
    const y = r * rowH
    for (let c = 0; c < cells; c++) {
      const idx = lo + c - (tr.mid - half)
      if (idx < 0 || idx >= snap.length) continue
      if (!snap[idx]) continue
      ctx.fillStyle = '#ffae3d'
      ctx.fillRect(c * cellW, y, Math.max(1, cellW - 0.6), rowH - 0.6)
    }
    const hx = (tr.heads[r] - lo) * cellW
    ctx.fillStyle = 'rgba(255,94,168,0.92)'
    ctx.fillRect(hx, y, Math.max(1.5, cellW - 0.6), rowH - 0.6)
  }
  // the frozen tape after STOP, same as the ring view
  if (tr.halted && tr.rows < rows) {
    const last = tr.snaps[tr.rows - 1]
    ctx.fillStyle = '#4d3a18'
    for (let r = tr.rows; r < rows; r++) {
      for (let c = 0; c < cells; c++) {
        const idx = lo + c - (tr.mid - half)
        if (idx < 0 || idx >= last.length || !last[idx]) continue
        ctx.fillRect(c * cellW, r * rowH, Math.max(1, cellW - 0.6), Math.max(1, rowH - 0.6))
      }
    }
  }
  if (tr.halted && tr.haltRow <= rows) {
    ctx.fillStyle = 'rgba(255,240,194,0.9)'
    ctx.fillRect(0, tr.haltRow * rowH - 1, W, 1.5)
  }
  return { rows: tr.rows, shown: rows, halted: tr.halted }
}

/**
 * Run the machine on the ring from one selected configuration.
 *
 * A node is stored head-relative — bit i of the word is the cell at head + i —
 * so laying it out as an absolute tape just means starting the head at 0 and
 * letting it walk. This is the run the graph is actually about: the same steps
 * a spark takes falling down that basin.
 */
function ringRun(m, N, node, rows) {
  const R = 1 << N
  let q = (node / R) | 0
  const w = node % R
  const tape = new Uint8Array(N)
  for (let i = 0; i < N; i++) tape[i] = (w >> i) & 1
  let head = 0
  const snaps = [], heads = []
  let haltRow = -1
  for (let r = 0; r < rows; r++) {
    snaps.push(tape.slice())
    heads.push(head)
    const i = q * 2 + tape[head]
    tape[head] = m.write[i]
    head = (head + (m.dir[i] === 1 ? 1 : N - 1)) % N
    if (m.next[i] === HALT) { haltRow = r + 1; break }
    q = m.next[i]
  }
  // A stopped machine does not disappear — its tape just sits there. Drawing
  // that out is both true and the difference between "it halted" and a panel
  // that looks broken.
  const frozen = tape.slice()
  while (snaps.length < rows) { snaps.push(frozen); heads.push(-1) }
  return { snaps, heads, rows: snaps.length, haltRow }
}

/**
 * Draw that run. The ring is tiled sideways so the wrap-around is visible —
 * a tape of N cells joined end to end really is an infinite tape of period N —
 * with a hairline at each seam. Colour follows the 3-D graph: amber if this
 * trajectory ends in STOP, cyan if it ends in a loop, and dim until the step
 * where it falls into that loop.
 */
function drawRingSpacetime(node) {
  const ctx = stCanvas.getContext('2d')
  const W = stCanvas.width, H = stCanvas.height
  ctx.fillStyle = '#04050a'
  ctx.fillRect(0, 0, W, H)

  const g = state.ring, a = state.an, m = state.m
  const N = g.N
  if (g.halts && node >= g.base) {
    ctx.fillStyle = 'rgba(255,174,61,0.9)'
    ctx.font = '600 11px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.fillText('HALTED', W / 2, H / 2)
    return { sink: true }
  }

  const halting = !!scene.isHalting[node]
  const d = a.dist[node]
  const cyc = a.cycleLen.get(a.compOf[node]) || 1
  const tail = clamp(Math.ceil(d * 0.2), 2, 20)
  const want = halting ? d + 1 + tail : d + Math.min(cyc * 2 + 1, 300)
  const rows = clamp(want, 6, 320)
  const rowH = H / rows
  const run = ringRun(m, N, node, rows)

  const repeats = clamp(Math.round(W / (N * 17)), 1, 3)
  const cellW = W / (N * repeats)
  const cols = N * repeats
  const bright = halting ? '#ffae3d' : '#46d3e6'
  const dim = halting ? '#6d3a10' : '#124254'

  for (let r = 0; r < run.rows; r++) {
    const snap = run.snaps[r]
    const head = run.heads[r]
    const y = r * rowH
    const h = Math.max(1, rowH - (rowH > 5 ? 0.7 : 0.3))
    ctx.fillStyle = head < 0 ? '#4d3a18' : (halting || r >= d ? bright : dim)
    for (let c = 0; c < cols; c++) {
      if (!snap[c % N]) continue
      ctx.fillRect(c * cellW, y, Math.max(1, cellW - 0.5), h)
    }
    if (head < 0) continue
    ctx.fillStyle = 'rgba(255,94,168,0.92)'
    for (let k = 0; k < repeats; k++) {
      ctx.fillRect((k * N + head) * cellW, y, Math.max(1.5, cellW - 0.5), h)
    }
  }
  // seams, so the wrap is a thing you can see rather than infer
  if (repeats > 1) {
    ctx.fillStyle = 'rgba(150,162,196,0.3)'
    for (let k = 1; k < repeats; k++) ctx.fillRect(k * N * cellW - 0.5, 0, 1, run.rows * rowH)
  }
  // the moment its fate is sealed
  if (run.haltRow > 0 && run.haltRow <= rows) {
    ctx.fillStyle = 'rgba(255,240,194,0.9)'
    ctx.fillRect(0, run.haltRow * rowH - 1, W, 1.5)
  } else if (!halting && d > 0 && d < run.rows) {
    ctx.fillStyle = 'rgba(70,211,230,0.75)'
    ctx.fillRect(0, d * rowH - 1, W, 1.5)
  }
  return { halting, d, cyc, rows: run.rows, halted: run.haltRow > 0 }
}

/** The head-relative word, with the cell under the head bracketed. */
function shortWord(node) {
  const g = state.ring
  const R = g.R
  const q = (node / R) | 0
  const w = node % R
  let out = '<span class="q">' + String.fromCharCode(65 + q) + '</span> '
  for (let i = 0; i < g.N; i++) {
    const bit = (w >> i) & 1
    out += i === 0 ? '<span class="h">[' + bit + ']</span>' : bit
  }
  return out
}

let stMode = 'ring'

/** Draw whichever run the panel is set to, and caption it. */
function renderSpacetime() {
  if (!state.m || !scene || !state.an) return
  const cap = el('stFoot')
  if (stMode === 'free') {
    const st = drawSpacetime(state.m)
    cap.innerHTML = 'blank tape, unbounded &middot; ' + (st.halted
      ? 'stops on row ' + st.rows.toLocaleString()
      : 'first ' + st.rows.toLocaleString() + ' steps')
    return
  }
  const node = markNode >= 0 ? markNode : 0
  const r = drawRingSpacetime(node)
  if (r.sink) { cap.innerHTML = 'the halt state &mdash; nothing runs on from here'; return }
  cap.innerHTML = 'from ' + shortWord(node) + ' &middot; ' + (r.halting
    ? 'stops after ' + r.d.toLocaleString() + ' step' + (r.d === 1 ? '' : 's')
    : (r.d > 0 ? 'falls ' + r.d.toLocaleString() + ' steps into a cycle of ' + r.cyc
               : 'already looping, period ' + r.cyc))
}

for (const b of document.querySelectorAll('.seg button')) {
  b.addEventListener('click', () => {
    stMode = b.dataset.st
    for (const o of document.querySelectorAll('.seg button')) o.classList.toggle('on', o === b)
    renderSpacetime()
  })
}

function setStMode(mode) {
  if (stMode === mode) return
  stMode = mode
  for (const o of document.querySelectorAll('.seg button')) o.classList.toggle('on', o.dataset.st === mode)
}

// ---------------------------------------------------------------------- ui

const PRESETS = [
  { k: 'BB(2)', code: '1RB1LB_1LA1RZ' },
  { k: 'BB(3) steps', code: '1RB1RZ_1LB0RC_1LC1LA' },
  { k: 'BB(3) ones', code: '1RB1LC_1LA1RB_1LB1LZ' },
  { k: 'BB(4)', code: '1RB1LB_1LA0LC_1RZ1LD_1RD0RA' },
  { k: 'BB(5)', code: '1RB1LC_1RC1RB_1RD0LE_1LA1LD_1RZ0LA' },
  { k: 'never stops', code: '0LB1RB_1RC1LD_1RA0RC_1LD1LB' },
  { k: 'wanderer', code: '0RD1LB_1RD0RB_0RA0LC_1LC1RB' },
]

const state = { m: null, N: 12, merge: true, ring: null, an: null, truth: null }

const el = (id) => document.getElementById(id)

function maxN(n) {
  let N = 16
  while (N > 4 && n * (1 << N) > 150000) N--
  return N
}

function setMachine(code, { keepN = false, N = null } = {}) {
  const m = parseMachine(code)
  if (!m) { el('code').classList.add('bad'); return Promise.resolve(false) }
  el('code').classList.remove('bad')
  const wantN = Math.min(N == null ? state.N : N, maxN(m.n))
  if (scene && state.m && state.m.code === m.code && state.N === wantN) return Promise.resolve(true)
  state.m = m
  el('code').value = m.code
  const cap = maxN(m.n)
  el('nRange').max = String(cap)
  state.N = Math.min(N == null ? state.N : N, cap)
  el('nRange').value = String(state.N)
  renderStates(m)
  renderPresets()
  state.truth = null
  const built = rebuild()
  // The honest run can be 47 million steps; do it after the graph is on screen.
  setTimeout(() => {
    if (state.m !== m) return
    state.truth = runUnbounded(m, 60e6)
    renderVerdict()
  }, 0)
  return built
}

function rebuild() {
  const boot = el('boot')
  boot.classList.remove('gone')
  boot.textContent = 'building state graph'
  // Let the overlay paint before the synchronous build.
  return new Promise((done) => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const g = buildRing(state.m, state.N, state.merge)
      const a = analyze(g.succ)
      const lay = layout(a)
      state.ring = g
      state.an = a
      buildScene(g, a, lay)
      setMark(0)
      renderStats()
      renderVerdict()
      boot.classList.add('gone')
      done(true)
    }))
  })
}

function renderStats() {
  const g = state.ring, a = state.an
  el('sNodes').textContent = a.M.toLocaleString()
  el('sBasins').textContent = a.nComp.toLocaleString()
  let inHalt = 0
  for (let v = 0; v < a.M; v++) if (scene.isHalting[v]) inHalt++
  el('sHalt').textContent = g.halts ? (100 * inHalt / a.M).toFixed(1) + '%' : 'none'
  // One representative per component, in a single pass — scanning per component
  // is quadratic once "split halts" makes thousands of them.
  const rep = new Int32Array(a.nComp).fill(-1)
  for (let v = 0; v < a.M; v++) if (rep[a.compOf[v]] < 0) rep[a.compOf[v]] = v
  let loops = 0
  for (const [c] of a.cycleLen) if (rep[c] >= 0 && !scene.isHalting[rep[c]]) loops++
  el('sLoops').textContent = loops.toLocaleString()
  el('sDepth').textContent = a.maxDist.toLocaleString()
  el('sEden').textContent = (100 * a.eden / a.M).toFixed(1) + '%'
  el('nodeCount').textContent = a.M.toLocaleString() + ' configurations'
  el('nVal').textContent = String(state.N)
}

function renderVerdict() {
  if (!scene || !state.an) return
  const a = state.an, g = state.ring
  const t = state.truth

  if (!t) {
    el('trueFate').textContent = 'running…'
    el('trueFate').className = 'fate unknown'
    el('trueDetail').textContent = ''
  } else if (t.halted) {
    el('trueFate').textContent = 'Halts'
    el('trueFate').className = 'fate halts'
    el('trueDetail').textContent =
      t.steps.toLocaleString() + ' steps · ' + t.ones.toLocaleString() + ' ones · ' + t.span.toLocaleString() + ' cells used'
  } else {
    el('trueFate').textContent = 'No halt found'
    el('trueFate').className = 'fate loops'
    el('trueDetail').textContent = 'still running after ' + t.steps.toLocaleString() + ' steps'
  }

  const d = a.dist[0]
  const blankHalts = scene.isHalting[0]
  if (blankHalts) {
    el('ringFate').textContent = 'Halts'
    el('ringFate').className = 'fate halts'
    el('ringDetail').textContent = d.toLocaleString() + ' steps from the blank tape'
  } else {
    const L = a.cycleLen.get(a.compOf[0])
    el('ringFate').textContent = 'Loops forever'
    el('ringFate').className = 'fate loops'
    el('ringDetail').textContent = 'falls ' + d.toLocaleString() + ' steps into a cycle of ' + L
  }

  const agree = el('agree'), text = el('agreeText')
  if (!t) { agree.className = 'agree match'; text.textContent = 'checking the unbounded run…'; return }
  const matches = t.halted && blankHalts && t.steps === d
  if (matches) {
    agree.className = 'agree match'
    text.textContent = 'The ring is wide enough — this is the true score.'
  } else if (t.halted && !blankHalts) {
    agree.className = 'agree miss'
    text.innerHTML = 'Ring too small: the tape wraps and a halting machine loops instead. Needs <b>' + t.span + '</b> cells.'
  } else if (t.halted && blankHalts) {
    agree.className = 'agree miss'
    text.innerHTML = 'Ring too small: it halts early on wrapped tape. Needs <b>' + t.span.toLocaleString() + '</b> cells.'
  } else if (!t.halted && blankHalts) {
    agree.className = 'agree miss'
    text.textContent = 'Ring too small: wrapping makes it halt when the real machine has not.'
  } else {
    agree.className = 'agree match'
    text.textContent = 'Both run forever — though only the ring can prove it.'
  }
}

function renderStates(m) {
  const host = el('states')
  host.textContent = ''
  for (let q = 0; q < m.n; q++) {
    const card = document.createElement('div')
    card.className = 'qcard'
    card.dataset.q = String(q)
    const h = document.createElement('div')
    h.className = 'qh'
    h.textContent = String.fromCharCode(65 + q)
    card.appendChild(h)
    const body = document.createElement('div')
    body.className = 'qt'
    for (let c = 0; c < 2; c++) {
      const i = q * 2 + c
      const row = document.createElement('div')
      row.className = 'qr'
      row.dataset.tr = q + ',' + c
      const read = document.createElement('span')
      read.className = 'read'
      read.textContent = 'read ' + c
      const arrow = document.createElement('span')
      arrow.className = 'arrow'
      arrow.textContent = '▶'
      const act = document.createElement('span')
      act.className = 'act' + (m.next[i] === HALT ? ' stop' : '')
      act.textContent = m.next[i] === HALT
        ? 'write ' + m.write[i] + ' · STOP'
        : 'write ' + m.write[i] + ' ' + (m.dir[i] > 0 ? '→' : '←') + ' ' + String.fromCharCode(65 + m.next[i])
      row.append(read, arrow, act)
      body.appendChild(row)
    }
    card.appendChild(body)
    host.appendChild(card)
  }
}

function renderPresets() {
  const host = el('presets')
  host.textContent = ''
  for (const p of PRESETS) {
    const b = document.createElement('button')
    b.className = 'chip' + (state.m && state.m.code === p.code ? ' on' : '')
    b.textContent = p.k
    b.addEventListener('click', () => setMachine(p.code, { keepN: true }))
    host.appendChild(b)
  }
}

// wiring ---------------------------------------------------------------------

el('nRange').addEventListener('input', (e) => {
  state.N = +e.target.value
  el('nVal').textContent = e.target.value
})
el('nRange').addEventListener('change', () => rebuild())

el('tOrbit').addEventListener('change', (e) => { autoOrbit = e.target.checked })
el('tFlow').addEventListener('change', (e) => { showFlow = e.target.checked })
el('tEdges').addEventListener('change', (e) => { showEdges = e.target.checked })
el('tSplit').addEventListener('change', (e) => {
  state.merge = !e.target.checked
  const cap = state.merge ? maxN(state.m.n) : Math.min(maxN(state.m.n), 13)
  el('nRange').max = String(cap)
  if (state.N > cap) { state.N = cap; el('nRange').value = String(cap); el('nVal').textContent = String(cap) }
  rebuild()
})

el('code').addEventListener('change', (e) => setMachine(e.target.value, { keepN: true }))
el('code').addEventListener('keydown', (e) => { if (e.key === 'Enter') setMachine(e.target.value, { keepN: true }) })

el('random').addEventListener('click', () => {
  const n = state.m ? state.m.n : 4
  setMachine(randomMachine(n).code, { keepN: true })
})

/* "Surprise me" wants a machine worth looking at: one that halts, but only
   after wandering far enough to build a tall basin. Rejection sampling finds
   one in a few hundred tries. */
el('surprise').addEventListener('click', () => {
  const n = state.m ? state.m.n : 4
  let best = null, bestScore = -1
  for (let i = 0; i < 3000; i++) {
    const m = randomMachine(n)
    if (!hasHalt(m)) continue
    const r = runUnbounded(m, 4000)
    if (!r.halted || r.steps < 12) continue
    const score = r.steps * Math.min(r.span, 24)
    if (score > bestScore) { bestScore = score; best = m }
    if (bestScore > 6000) break
  }
  setMachine((best || randomMachine(n)).code, { keepN: true })
})

el('railclose').addEventListener('click', () => { el('rail').classList.add('hidden'); setTimeout(refit, 340) })
el('railopen').addEventListener('click', () => { el('rail').classList.remove('hidden'); setTimeout(refit, 340) })

addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return
  if (e.key === 'r') el('random').click()
  if (e.key === 's') el('surprise').click()
})

if (reduced) {
  autoOrbit = false
  showFlow = false
  el('tOrbit').checked = false
  el('tFlow').checked = false
}
if (innerWidth < 900) el('rail').classList.add('hidden')


// =============================================================================
// The stage: one machine's run, drawn big and played out a step at a time.
// =============================================================================

const stageEl = document.getElementById('stage')
const stageCanvas = document.getElementById('stageCanvas')
let stagePlay = null

function layoutStage() {
  const pad = chromePads()
  stageEl.style.left = pad.l + 'px'
  stageEl.style.top = pad.t + 'px'
  stageEl.style.width = Math.max(160, innerWidth - pad.l - pad.r) + 'px'
  stageEl.style.height = Math.max(160, innerHeight - pad.t - pad.b) + 'px'
}

function stageStart(m, caption) {
  layoutStage()
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const box = stageEl.getBoundingClientRect()
  const W = Math.max(160, box.width)
  const H = Math.max(140, box.height - 62)

  // Enough rows to tell the story: a short run gets big cells, a long one gets
  // the tall narrow strip a spacetime diagram naturally wants.
  const probe = runUnbounded(m, 400)
  const steps = probe.halted ? probe.steps : 132
  const rows = clamp(probe.halted ? steps + 1 : steps, 7, 136)
  const tr = traceUnbounded(m, rows)

  let lo = Math.max(tr.mid - 96, tr.lo - 1)
  let hi = Math.min(tr.mid + 95, tr.hi + 1)
  if (hi - lo < 7) { const c = ((lo + hi) / 2) | 0; lo = c - 4; hi = c + 4 }
  const cells = hi - lo + 1
  const HEAD_H = 17
  // A lane per control state, so "which state is it in" is a thing you watch
  // rather than a thing you are told.
  const laneW = clamp((W * 0.14) / m.n, 8, 18)
  const trackW = laneW * m.n
  const gap = 18
  const tapeArea = Math.max(60, W - trackW - gap)
  const rowH = (H - HEAD_H) / rows
  const cellW = Math.min(tapeArea / cells, Math.max(3.5, rowH * 2.6), 42)
  const gw = cells * cellW, gh = rows * rowH

  stageCanvas.width = Math.round(W * dpr)
  stageCanvas.height = Math.round(H * dpr)
  stageCanvas.style.width = W + 'px'
  stageCanvas.style.height = H + 'px'
  const ctx = stageCanvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, W, H)

  const trackX = (W - trackW - gap - gw) / 2
  const x0 = trackX + trackW + gap
  const y0 = HEAD_H

  const st = {
    ctx, tr, rows: tr.rows, lo, cells, cellW, rowH, x0, y0, W, H, gw, gh,
    trackX, trackW, laneW, n: m.n, m,
    cursor: 0, t0: performance.now(), lastRule: '', lastRuleAt: 0,
    rowMs: clamp(4200 / Math.max(1, tr.rows), 20, 300),
    holdUntil: 0,
  }
  stageBackdrop(st)
  document.getElementById('stageCap').innerHTML = caption
  stagePlay = st
}

/** The empty tape, the state lanes and their letters — everything the run
 *  will be drawn onto. */
function stageBackdrop(st) {
  const { ctx, x0, y0, gw, gh, cells, cellW, trackX, trackW, laneW, n, W, H } = st
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#080b12'
  ctx.fillRect(x0, y0, gw, gh)
  if (cellW > 7) {
    ctx.strokeStyle = 'rgba(120,132,160,0.09)'
    ctx.lineWidth = 1
    for (let c = 0; c <= cells; c++) {
      const x = Math.round(x0 + c * cellW) + 0.5
      ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + gh); ctx.stroke()
    }
  }
  ctx.fillStyle = 'rgba(255,255,255,0.022)'
  ctx.fillRect(trackX, y0, trackW, gh)
  ctx.strokeStyle = 'rgba(120,132,160,0.10)'
  for (let k = 1; k < n; k++) {
    const x = Math.round(trackX + k * laneW) + 0.5
    ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + gh); ctx.stroke()
  }
  ctx.font = '600 9.5px "IBM Plex Mono", ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#55606f'
  for (let k = 0; k < n; k++) {
    ctx.fillText(String.fromCharCode(65 + k), trackX + (k + 0.5) * laneW, y0 - 6)
  }
  ctx.fillStyle = '#3d4757'
  ctx.textAlign = 'left'
  ctx.fillText('TAPE', x0, y0 - 6)
}

function stageStop() {
  stagePlay = null
  highlightRule(-1, 0)
  document.getElementById('stageNow').textContent = ''
}

function stageTick(now) {
  const st = stagePlay
  if (!st) return
  if (st.holdUntil) {
    if (now < st.holdUntil) return
    st.holdUntil = 0
    st.cursor = 0
    st.t0 = now
    st.lastRule = ''
    stageBackdrop(st)
    return
  }
  const want = Math.min(st.rows, Math.floor((now - st.t0) / st.rowMs))
  while (st.cursor < want) { stageRow(st, st.cursor); st.cursor++ }
  // A 20ms-per-row run would strobe the readout unreadably, so it updates at a
  // pace a person can follow while the drawing keeps full speed.
  if (st.cursor > 0 && now - st.lastRuleAt > 95) {
    st.lastRuleAt = now
    showRule(st, st.cursor - 1)
  }
  if (st.cursor >= st.rows && !st.holdUntil) {
    st.holdUntil = now + 1900
    showRule(st, st.rows - 1, true)
  }
}

/** Say, in words, which rule just fired — and light it up in the table. */
function showRule(st, row, done) {
  const m = st.m, tr = st.tr
  const q = tr.qs[row], c = tr.reads[row]
  const key = q + ',' + c + (done ? 'd' : '')
  if (key === st.lastRule) return
  st.lastRule = key
  const i = q * 2 + c
  const Q = (k) => '<span class="q">' + String.fromCharCode(65 + k) + '</span>'
  const parts = [Q(q), 'reads <span class="bit">' + c + '</span>',
                 '<span class="arr">&rarr;</span>', 'write <span class="bit">' + m.write[i] + '</span>']
  if (m.next[i] === HALT) parts.push('<span class="stop">STOP</span>')
  else parts.push('step <span class="go">' + (m.dir[i] > 0 ? 'right' : 'left') + '</span>',
                  'become ' + Q(m.next[i]))
  document.getElementById('stageNow').innerHTML = parts.join(' ')
  highlightRule(q, c)
}

/** Mark the firing transition in the machine strip along the bottom. */
function highlightRule(q, c) {
  for (const n of document.querySelectorAll('.qr.firing')) n.classList.remove('firing')
  for (const n of document.querySelectorAll('.qcard.active')) n.classList.remove('active')
  if (q < 0) return
  const row = document.querySelector('.qr[data-tr="' + q + ',' + c + '"]')
  if (row) row.classList.add('firing')
  const card = document.querySelector('.qcard[data-q="' + q + '"]')
  if (card) card.classList.add('active')
}

function stageRow(st, r) {
  const { ctx, tr, lo, cells, cellW, rowH, x0, y0, trackX, laneW } = st
  const snap = tr.snaps[r]
  const y = y0 + r * rowH
  // the state lane for this step
  const lh = Math.max(1, rowH - (rowH > 6 ? 1 : 0.4))
  ctx.fillStyle = 'rgba(214,222,233,0.62)'
  ctx.fillRect(trackX + tr.qs[r] * laneW + 1.5, y, Math.max(2, laneW - 3), lh)
  const h = Math.max(1, rowH - (rowH > 6 ? 1 : 0.4))
  for (let c = 0; c < cells; c++) {
    const idx = lo + c - (tr.mid - 96)
    if (idx < 0 || idx >= snap.length || !snap[idx]) continue
    ctx.fillStyle = '#ffae3d'
    ctx.fillRect(x0 + c * cellW, y, Math.max(1, cellW - (cellW > 6 ? 1 : 0.4)), h)
  }
  const hc = tr.heads[r] - lo
  if (hc >= 0 && hc < cells) {
    ctx.fillStyle = 'rgba(255,94,168,0.95)'
    ctx.fillRect(x0 + hc * cellW, y, Math.max(1.5, cellW - (cellW > 6 ? 1 : 0.4)), h)
  }
  if (tr.halted && r === st.rows - 1) {
    ctx.fillStyle = 'rgba(255,240,194,0.95)'
    ctx.fillRect(x0, y + h, st.gw, Math.max(1, rowH * 0.3))
  }
}

// =============================================================================
// The tour.
// =============================================================================

const BB2 = '1RB1LB_1LA1RZ'
const BB3 = '1RB1RZ_1LB0RC_1LC1LA'
const BB4 = '1RB1LB_1LA0LC_1RZ1LD_1RD0RA'
const BB5 = '1RB1LC_1RC1RB_1RD0LE_1LA1LD_1RZ0LA'
const NEVER = '0LB1RB_1RC1LD_1RA0RC_1LD1LB'
// Where the app opens: the 4-state champion on a ring one notch too narrow.
const OPENS_ON = BB4

const TOUR = [
  {
    title: 'A Turing machine is four things',
    body: `A tape of 0s and 1s, <b>endless</b> in both directions. A head parked on one cell.
      And a <b>finite</b> handful of internal states — here just <b>A</b> and <b>B</b> — with one
      rule per state per symbol: read the cell, write a bit, step left or right, switch state.
      The strip along the bottom is the whole program. Nothing else exists in the model.`,
    spot: '#states',
    stage: () => [BB2, 'the 2-state champion &middot; <b>amber</b> = a 1 written &middot; <i>magenta</i> = the head'],
    apply: () => setMachine(BB2, { N: 8 }),
  },
  {
    title: 'Start it on a blank tape and watch',
    body: `Time runs downward, one row per step. The lanes on the left are the machine's entire
      memory — one per state, marked with the one it is in. Above the tape, the rule firing at
      that instant, lit up in the table below as it goes. Six steps, four 1s, then <b>STOP</b>.
      No 2-state machine runs longer, so <b>BB(2) = 6</b>.`,
    stage: () => [BB2, 'stops after <b>6</b> steps &middot; the pale line is where it froze'],
    apply: () => setMachine(BB2, { N: 8 }),
  },
  {
    title: 'Most machines never stop',
    body: `Here is a 4-state program instead. Nothing is broken about it — it simply never
      reaches a STOP, so it scribbles away forever. This is the normal case. Among all the
      machines with a handful of states, the ones that stop are the minority.`,
    stage: () => [NEVER, 'no stop in the first <u>132</u> steps &middot; and none ever'],
    apply: () => setMachine(NEVER, { N: 8 }),
  },
  {
    title: 'So: which stopper runs longest?',
    body: `That is the busy beaver question. Among all machines with <i>n</i> states that
      <b>do</b> stop from a blank tape, find the one that runs longest. Call it <b>BB(n)</b>:
      <span class="num">6</span>, <span class="num">21</span>, <span class="num">107</span> — and
      this is the 107. Radó's original asked for the most <i>1s left behind</i> rather than the
      most steps; for 3 states those are two different machines, which is why the tour ends with
      two BB(3) buttons.`,
    stage: () => [BB4, 'the 4-state champion &middot; stops after <b>107</b> steps'],
    apply: () => setMachine(BB4, { N: 12 }),
  },
  {
    title: 'Then it stops being cute',
    body: `<b>BB(5) = 47,176,870.</b> Same rules, one more state. Drawn at this scale that run
      would be a strip forty-seven million rows tall. It took until 2024 to prove, with a
      machine-checked proof and a few thousand hard cases picked off one at a time. BB(6) is
      not a number anyone can write down.`,
    stage: () => [BB5, 'the 5-state champion &middot; the first <b>132</b> of <b>47,176,870</b> steps'],
    apply: () => setMachine(BB5, { N: 12 }),
  },
  {
    title: 'And you cannot just run them',
    body: `To find BB(5) you must decide, for every 5-state machine, whether it ever stops. But
      watching one tells you nothing: still going after a billion steps might mean it halts at
      a billion and one. That is the halting problem, and it is why BB grows faster than any
      function a computer can compute.`,
    stage: () => [BB5, 'still running &hellip;'],
    apply: () => setMachine(BB5, { N: 12 }),
  },
  {
    title: 'So bend the tape into a ring',
    body: `Give the machine exactly <i>N</i> cells, joined end to end. Now there are only
      finitely many situations it can ever be in, so it must eventually repeat itself — and
      "does it stop" becomes a question you can answer by <b>looking</b>. That finite set of
      situations is the object that just appeared.`,
    spot: '[data-tour="ring"]',
    apply: async () => { await setMachine(BB3, { N: 10 }); frameAll(0.40) },
  },
  {
    title: 'Every speck is one whole situation',
    body: `Mind the word "state": this machine has only <b>three</b> — A, B, C. A speck is a whole
      <b>configuration</b>: the state it is in <i>plus</i> the entire tape as the head sees it.
      There are <span class="num">3,073</span> of those. Each has exactly one arrow out, the next
      step, so the cloud is one flow. Hover a speck to read one.`,
    apply: () => zoomTo(0.5, 0.48),
  },
  {
    title: 'Height is time',
    body: `A speck's height is how many steps it has left before its fate is sealed. Every
      arrow points downhill, so time runs like gravity and the endings are all at the bottom.
      Drop the camera and you can read a machine's future as an altitude.`,
    apply: () => frameAll(0.10),
  },
  {
    title: 'The pink thread is the run',
    body: `One speck is the blank tape — where a busy beaver starts. The <span class="mag">thread</span>
      hanging off it is its entire life, step by step, down to its ending. Count the beads and
      you get <span class="num">21</span>: this is BB(3), and its score is simply
      <b>how high it hangs</b>.`,
    spot: '[data-tour="verdict"]',
    apply: () => { setMark(0); frameMark(1.5, 0.28) },
  },
  {
    title: 'Amber stops, cyan loops',
    body: `A busier machine breaks into several cones. The <span class="amber">amber</span> one
      holds every situation that ends in STOP, its bright core the stopping point itself. The
      <span class="cyan">cyan</span> ones are trapped in loops — the glowing ring at the base
      of each is the loop, drawn at its true length. <b>Which cone you are in is the answer.</b>`,
    spot: '[data-tour="stats"]',
    apply: async () => { await setMachine(BB5, { N: 12 }); frameAll(0.38) },
  },
  {
    title: 'But the ring can lie',
    body: `Wrap the tape too tightly and the machine collides with its own past. This is the
      4-state champion on <b>12</b> cells: it never stops at all, caught in a loop of 54. The
      panel keeps the ring's answer next to the real one and tells you, in pink, when they
      disagree.`,
    spot: '[data-tour="verdict"]',
    apply: async () => { await setMachine(BB4, { N: 12 }); frameAll(0.36) },
  },
  {
    title: 'Give it the room it needs',
    body: `Its real run touches 14 cells. Widen the ring to <b>14</b> and the same machine
      stops — after exactly <span class="num">107</span> steps, the true score, now readable
      straight off the height of the thread. Where the ring is wide enough, the picture is not
      an analogy. It is the answer.`,
    spot: '[data-tour="ring"]',
    apply: async () => { await setRing(14); setMark(0); frameMark(1.5, 0.26) },
  },
  {
    title: 'Which is also the catch',
    body: `BB(5)'s real run needs <b>12,289</b> cells. A ring that wide has more situations in
      it than there are atoms in this screen, so no picture here will ever reach it — the
      panel will say so. That gap, between what can be drawn and what is true, <i>is</i> the busy
      beaver problem.`,
    spot: '[data-tour="verdict"]',
    apply: async () => { await setMachine(BB5, { N: 14 }); frameAll(0.36) },
  },
  {
    title: 'Go poke at it',
    body: `Every control is live now. Pick a champion, drag the ring, click any speck to hang
      its run off it, and use <b>surprise me</b> to hunt for machines with tall basins. Drag to
      orbit, scroll to zoom.`,
    apply: async () => { await setMachine(BB4, { N: 14 }); setMark(0); frameAll(0.40) },
  },
]

/** Set the ring size the way the slider does, and wait for the rebuild. */
function setRing(N) {
  const cap = maxN(state.m.n)
  state.N = Math.min(N, cap)
  el('nRange').value = String(state.N)
  el('nVal').textContent = String(state.N)
  return rebuild()
}

let tourAt = -1
let tourOn = false
let orbitBefore = true

function startTour(at = 0) {
  if (!tourOn) {
    orbitBefore = el('tOrbit').checked
    autoOrbit = false
    tourOn = true
    document.body.classList.add('touring')
    buildDots()
  }
  goStep(at)
}

function endTour() {
  // The prelude swaps in teaching machines while the graph is hidden, so
  // leaving from there would strand you on a 2-state ring you were never shown.
  // Leaving from a graph step keeps whatever you were looking at.
  const fromPrelude = tourAt >= 0 && !!TOUR[tourAt].stage
  tourOn = false
  tourAt = -1
  stageStop()
  document.body.classList.remove('touring', 'staged')
  autoOrbit = orbitBefore
  el('tOrbit').checked = orbitBefore
  setStMode('ring')
  clearSpot()
  try { localStorage.setItem('bbb.tour', 'done') } catch { /* private window */ }
  if (fromPrelude) setMachine(OPENS_ON, { N: 12 }).then(() => frameAll(0.40))
  else { renderSpacetime(); setTimeout(refit, 60) }
}

function clearSpot() {
  for (const n of document.querySelectorAll('.spot')) n.classList.remove('spot')
}

let stepToken = 0
async function goStep(i) {
  if (i < 0 || i >= TOUR.length) return endTour()
  const token = ++stepToken
  tourAt = i
  const step = TOUR[i]

  el('tourTitle').textContent = step.title
  el('tourBody').innerHTML = step.body
  el('tourCount').textContent = (i + 1) + ' / ' + TOUR.length
  el('tourBack').disabled = i === 0
  el('tourBack').style.opacity = i === 0 ? '.35' : '1'
  el('tourNext').textContent = i === TOUR.length - 1 ? 'finish' : 'next'
  const dots = el('tourDots').children
  for (let k = 0; k < dots.length; k++) dots[k].className = k === i ? 'now' : (k < i ? 'seen' : '')

  clearSpot()
  document.body.classList.toggle('staged', !!step.stage)
  setStMode(step.stage ? 'free' : 'ring')
  if (step.apply) await step.apply()
  if (token !== stepToken) return
  renderSpacetime()

  if (step.stage) {
    const [code, cap] = step.stage()
    const m = parseMachine(code)
    if (m) stageStart(m, cap)
  } else {
    stageStop()
  }
  if (step.spot) {
    const node = document.querySelector(step.spot)
    if (node) {
      node.classList.add('spot')
      if (node.closest('.rail-body')) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }
}

function buildDots() {
  const host = el('tourDots')
  host.textContent = ''
  for (let i = 0; i < TOUR.length; i++) {
    const d = document.createElement('i')
    d.addEventListener('click', () => goStep(i))
    host.appendChild(d)
  }
}

el('tourNext').addEventListener('click', () => goStep(tourAt + 1))
el('tourBack').addEventListener('click', () => goStep(tourAt - 1))
el('tourSkip').addEventListener('click', endTour)
el('tourStart').addEventListener('click', () => startTour(0))
addEventListener('keydown', (e) => {
  if (!tourOn || e.target.tagName === 'INPUT') return
  if (e.key === 'ArrowRight') { e.preventDefault(); goStep(tourAt + 1) }
  if (e.key === 'ArrowLeft') { e.preventDefault(); goStep(tourAt - 1) }
  if (e.key === 'Escape') endTour()
})

// A first-time visitor gets the tour; anyone coming back opens on BB(4) at
// twelve cells, where the ring is one notch too narrow and the machine loops.
let seenTour = false
try { seenTour = localStorage.getItem('bbb.tour') === 'done' } catch { /* private window */ }
if (seenTour) setMachine(OPENS_ON, { N: 12 })
else startTour(0)
requestAnimationFrame(frame)
