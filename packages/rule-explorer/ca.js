// Elementary cellular automata + functional-graph analysis.
//
// An elementary CA has 2 states and a 3-cell neighbourhood, so a rule is one of
// the 256 numbers 0..255: bit `i` of the rule is the output for the neighbourhood
// whose (left,center,right) bits form the number `i`.
//
// We run the CA on a ring of N cells (periodic boundary). A "state" is the N-bit
// pattern of the whole ring, i.e. an integer in [0, 2^N). The rule maps every
// state to exactly one successor, so the 2^N states form a *functional graph*:
// every node has out-degree 1, each connected component has exactly one cycle
// (an attractor), and everything else is transient trees draining into it.

/** Expand a rule number into its 8-entry lookup table, indexed by (l<<2)|(c<<1)|r. */
export function ruleTable(rule) {
  const t = new Uint8Array(8)
  for (let i = 0; i < 8; i++) t[i] = (rule >> i) & 1
  return t
}

/** Successor of one N-bit ring state under `table`. */
export function stepState(state, N, table) {
  let next = 0
  for (let i = 0; i < N; i++) {
    const l = (state >> ((i + 1) % N)) & 1 // cell to the left (higher index = left)
    const c = (state >> i) & 1
    const r = (state >> ((i - 1 + N) % N)) & 1 // cell to the right
    if (table[(l << 2) | (c << 1) | r]) next |= 1 << i
  }
  return next
}

/**
 * Analyse the full state-transition graph for a rule on a ring of N cells.
 * Returns the successor map plus per-node classification (component, cycle
 * membership, distance to attractor) and summary statistics.
 */
export function analyzeRule(rule, N) {
  const M = 1 << N
  const table = ruleTable(rule)

  const succ = new Int32Array(M)
  for (let s = 0; s < M; s++) succ[s] = stepState(s, N, table)

  // --- attractor nodes: strip leaves until only cycles remain (Kahn-style) ---
  const indeg = new Int32Array(M)
  for (let s = 0; s < M; s++) indeg[succ[s]]++

  const onCycle = new Uint8Array(M).fill(1)
  const stack = []
  for (let s = 0; s < M; s++) if (indeg[s] === 0) stack.push(s)
  while (stack.length) {
    const u = stack.pop()
    onCycle[u] = 0
    const v = succ[u]
    if (--indeg[v] === 0) stack.push(v)
  }

  // --- connected components via union-find over edges s -> succ[s] ---
  const parent = new Int32Array(M)
  for (let s = 0; s < M; s++) parent[s] = s
  const find = (x) => {
    while (parent[x] !== x) x = parent[x] = parent[parent[x]]
    return x
  }
  for (let s = 0; s < M; s++) {
    const a = find(s)
    const b = find(succ[s])
    if (a !== b) parent[a] = b
  }
  const compOf = new Int32Array(M)
  const compIndex = new Map()
  let nComp = 0
  for (let s = 0; s < M; s++) {
    const root = find(s)
    let idx = compIndex.get(root)
    if (idx === undefined) { idx = nComp++; compIndex.set(root, idx) }
    compOf[s] = idx
  }

  // --- distance from each node to its attractor (BFS back from cycle nodes) ---
  const dist = new Int32Array(M).fill(-1)
  const rev = buildReverse(succ)
  let frontier = []
  for (let s = 0; s < M; s++) if (onCycle[s]) { dist[s] = 0; frontier.push(s) }
  let maxDist = 0
  while (frontier.length) {
    const nextFrontier = []
    for (const v of frontier) {
      for (const u of rev[v]) {
        if (dist[u] === -1) {
          dist[u] = dist[v] + 1
          if (dist[u] > maxDist) maxDist = dist[u]
          nextFrontier.push(u)
        }
      }
    }
    frontier = nextFrontier
  }

  // --- attractor inventory: cycle length per component, fixed points, Eden states ---
  const cycleLenByComp = new Map()
  for (let s = 0; s < M; s++) {
    if (onCycle[s]) cycleLenByComp.set(compOf[s], (cycleLenByComp.get(compOf[s]) || 0) + 1)
  }
  let fixedPoints = 0
  let maxCycle = 0
  for (const len of cycleLenByComp.values()) {
    if (len === 1) fixedPoints++
    if (len > maxCycle) maxCycle = len
  }
  let edenCount = 0 // garden-of-Eden states: no predecessor (unreachable)
  for (let s = 0; s < M; s++) if (indegOriginal(rev, s) === 0) edenCount++

  let cycleNodes = 0
  for (let s = 0; s < M; s++) if (onCycle[s]) cycleNodes++

  return {
    rule, N, M, table, succ, rev,
    onCycle, compOf, dist, maxDist,
    nComp,
    attractors: cycleLenByComp.size,
    maxCycle,
    fixedPoints,
    cycleNodes,
    edenCount,
  }
}

function buildReverse(succ) {
  const M = succ.length
  const counts = new Int32Array(M)
  for (let s = 0; s < M; s++) counts[succ[s]]++
  const rev = new Array(M)
  for (let s = 0; s < M; s++) rev[s] = new Array(counts[s])
  const fill = new Int32Array(M)
  for (let s = 0; s < M; s++) {
    const t = succ[s]
    rev[t][fill[t]++] = s
  }
  return rev
}

function indegOriginal(rev, s) {
  return rev[s].length
}

/**
 * Follow a seed state until it repeats, which it always must: the state space is
 * finite and the rule deterministic. Returns how many steps are spent falling
 * (transient) and the length of the cycle it lands in (period).
 */
export function trajectoryInfo(seed, N, table) {
  const seen = new Int32Array(1 << N).fill(-1)
  let s = seed
  for (let t = 0; ; t++) {
    if (seen[s] >= 0) return { transient: seen[s], period: t - seen[s] }
    seen[s] = t
    s = stepState(s, N, table)
  }
}

/**
 * Draw one seed's trajectory as a spacetime diagram: time flows downward, the
 * N-cell ring runs across. The ring is tiled horizontally to fill the canvas —
 * honest rather than decorative, since a length-N periodic ring *is* an infinite
 * lattice with spatial period N.
 *
 * Rows switch from the transient colour to the attractor colour at the step where
 * the trajectory falls into its cycle, which is the same event as a spark
 * reaching the glowing ring in the 3-D graph.
 *
 * Returns { transient, period }.
 */
export function drawSpacetime(canvas, rule, N, seed, opts = {}) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const table = ruleTable(rule)
  const rowH = opts.rowH ?? 2
  const steps = Math.floor(H / rowH)

  const bg = hexToRgb(opts.bg || '#0a0c16')
  const fgTransient = hexToRgb(opts.fg || '#66ccff')
  const fgCycle = hexToRgb(opts.fgCycle || '#ffd166')

  const { transient, period } = trajectoryInfo(seed, N, table)

  // Tile the ring only enough to keep cells ~11px wide: finer than that and the
  // repetition reads as busy wallpaper instead of a legible row of cells.
  const repeats = Math.max(1, Math.round(W / (N * 11)))
  const cellW = W / (N * repeats)

  const img = ctx.createImageData(W, H)
  // Which ring bit each column shows. Bit N-1 is the leftmost cell, matching the
  // usual binary reading order.
  const bitAt = new Int32Array(W)
  for (let x = 0; x < W; x++) bitAt[x] = N - 1 - (Math.floor(x / cellW) % N)

  let s = seed
  for (let t = 0; t < steps; t++) {
    const fg = t >= transient ? fgCycle : fgTransient
    for (let sub = 0; sub < rowH; sub++) {
      const y = t * rowH + sub
      if (y >= H) break
      for (let x = 0; x < W; x++) {
        const on = (s >> bitAt[x]) & 1
        const c = on ? fg : bg
        const o = (y * W + x) * 4
        img.data[o] = c[0]
        img.data[o + 1] = c[1]
        img.data[o + 2] = c[2]
        img.data[o + 3] = 255
      }
    }
    s = stepState(s, N, table)
  }
  ctx.putImageData(img, 0, 0)

  // Mark the moment it falls in, when that happens inside the visible window.
  if (transient > 0 && transient < steps) {
    ctx.fillStyle = 'rgba(255, 209, 102, 0.85)'
    ctx.fillRect(0, transient * rowH - 1, W, 1)
  }
  return { transient, period }
}

/** Draw the 8-cell rule diagram (neighbourhood patterns over their outputs). */
export function drawRuleIcon(canvas, rule) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  ctx.clearRect(0, 0, W, H)

  const table = ruleTable(rule)
  const cell = 16
  const gap = 6
  const groupW = cell * 3
  const totalW = groupW * 8 + gap * 7
  const x0 = (W - totalW) / 2
  const topY = 18
  const outY = topY + cell + 10

  ctx.font = '600 9px ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (let i = 7; i >= 0; i--) {
    const gx = x0 + (7 - i) * (groupW + gap)
    const l = (i >> 2) & 1
    const c = (i >> 1) & 1
    const r = i & 1
    const out = table[i]

    // neighbourhood of 3 cells
    const tri = [l, c, r]
    for (let k = 0; k < 3; k++) {
      drawCell(ctx, gx + k * cell, topY, cell, tri[k])
    }
    // output cell, centred under the middle
    drawCell(ctx, gx + cell, outY, cell, out, out ? '#ffd166' : null)
  }

  function drawCell(ctx, x, y, s, on, onColor) {
    ctx.fillStyle = on ? (onColor || '#e8ecff') : 'rgba(255,255,255,0.05)'
    ctx.fillRect(x, y, s - 1.5, s - 1.5)
    ctx.strokeStyle = 'rgba(140,150,200,0.25)'
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, y + 0.5, s - 1.5, s - 1.5)
  }
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
