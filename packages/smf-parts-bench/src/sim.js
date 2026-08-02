/* =====================================================================
   SMF 03 — PARTS BENCH · data layer
   Pure JS: no DOM, no canvas, no timers, no Math.random.
   createSim() -> { state, step(dt), act(action) }.
   Every player verb goes through act(); the headless harness dispatches
   the same actions the mouse does.

   The bench: a 14×9 schematic grid. Left edge: four deterministic source
   ports. Right edge: one contract socket. Between them the player places
   signal parts and traces. All computation is plumbing — parts jam,
   saturate, chatter and starve instead of erroring.
   ===================================================================== */

export const DT = 0.1
export const GW = 14
export const GH = 9
export const TRACE_CAP = 20 // rate cap of a trace cell, /s
export const TANK_CAP = 30 // tank capacity (see README Findings — was 10)
export const TANK_DRAIN_DEF = 4 // default tank drain, /s (drag-tunable)
export const HOVER_BAND = 0.12 // gate: |SENSE−N| inside this = marginal
export const HOVER_DWELL = 0.6 // s hovering in the band before flicker
export const FLICKER_T = 0.3 // s per flicker half-cycle while marginal
export const PASS_HOLD = 12 // consecutive in-tolerance seconds to pass
export const SCOPE_N = 280 // scope samples kept (1/tick → 28 s strip)
export const DECAY_K = 0.85 // decay pipe attenuation per cell
export const DECAY_LAG = 5 // decay pipe delay, ticks (0.5 s per cell)

// dir: 0=E 1=S 2=W 3=N (grid z grows downward)
export const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]

export const COSTS = { trace: 1, valve: 4, merge: 4, ratio: 5, gate: 8, tank: 10, decay: 2 }

/* --- deterministic source streams (exact functions of sim time) --- */
export const SOURCES = [
  { gz: 1, name: 'CONST', desc: '10/s', max: 10, fn: () => 10 },
  { gz: 3, name: 'SQUARE', desc: '0↔12 · 8s', max: 12, fn: (t) => (t % 8) < 4 ? 12 : 0 },
  { gz: 5, name: 'SINE', desc: '2..8 · 20s', max: 8, fn: (t) => 5 + 3 * Math.sin(2 * Math.PI * t / 20) },
  { gz: 7, name: 'TRI', desc: '0..10 · 30s', max: 10, fn: (t) => { const p = (t % 30) / 30; return (p < 0.5 ? p : 1 - p) * 20 } },
]
export const SOCKET = { gx: GW - 1, gz: 4 }

const sine = SOURCES[2].fn

/* --- the five contracts. target(t) is exact; tolerance is the band. --- */
export const PUZZLES = [
  { key: 'HALF', tol: 0.5, brief: 'from the 10/s constant, deliver 5 ± 0.5', target: () => 5 },
  { key: 'BLEND', tol: 1, brief: 'deliver 0.5·sine + 0.5·const, ± 1', target: (t) => 0.5 * sine(t) + 5 },
  { key: 'STEADY', tol: 1, brief: 'from the square wave, deliver 6 ± 1', target: () => 6 },
  { key: 'GUARD', tol: 1, brief: 'deliver const while sine < 4, else 0, ± 1', target: (t) => sine(t) < 4 ? 10 : 0 },
  // LATCH target: hysteresis on the triangle — open at ≥6 rising (t≡9 mod 30),
  // close only below 2 falling (t≡27 mod 30); 4/s (the tank drain) while open.
  { key: 'LATCH', tol: 1, brief: '4/s while latched: open ≥6, close <2', target: (t) => { const p = t % 30; return (p >= 9 && p < 27) ? 4 : 0 } },
]

export const PART_NAMES = {
  trace: 'TRACE', valve: 'VALVE', merge: 'MERGE', ratio: 'RATIO GATE',
  gate: 'THRESH GATE', tank: 'TANK', decay: 'DECAY PIPE',
  source: 'SOURCE', socket: 'SOCKET',
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const ix = (gx, gz) => gx + gz * GW
const inGrid = (gx, gz) => gx >= 0 && gx < GW && gz >= 0 && gz < GH

function mkPart(type, dir) {
  const p = { type, dir: dir & 3, in: 0, out: 0, sat: false, confused: false }
  if (type === 'valve') p.k = 1
  if (type === 'gate') { p.n = 6; p.mode = 'NO'; p.open = false; p.hoverT = 0; p.flips = []; p.chatter = false; p.flow = 0; p.sense = 0 }
  if (type === 'tank') { p.drain = TANK_DRAIN_DEF; p.level = 0; p.full = false }
  if (type === 'ratio') { p.ins = []; p.starved = 0 } // starved: 0 none, 1 side A, 2 side B
  if (type === 'decay') { p.buf = new Float32Array(DECAY_LAG); p.bi = 0 }
  return p
}

function mkBoard() {
  const cells = new Array(GW * GH).fill(null)
  for (let s = 0; s < SOURCES.length; s++) {
    cells[ix(0, SOURCES[s].gz)] = { type: 'source', src: s, dir: 0, fixed: true, in: 0, out: 0 }
  }
  cells[ix(SOCKET.gx, SOCKET.gz)] = { type: 'socket', dir: 0, fixed: true, in: 0, out: 0 }
  return { cells, order: [], dirty: true, spent: 0 }
}

/* Which input port (if any) does `part` expose to a stream travelling in
   direction `entryDir` as it enters the cell? 0=none 1=generic 2=FLOW 3=SENSE */
function portFor(part, entryDir) {
  if (part.type === 'source') return 0
  if (part.type === 'gate') {
    if (entryDir === part.dir) return 2 // straight through the back = FLOW
    if (entryDir === ((part.dir + 2) & 3)) return 0 // head-on into the muzzle
    return 3 // perpendicular tap = SENSE
  }
  return 1
}

export function createSim(opts = {}) {
  const eventCap = opts.eventCap ?? 60

  const state = {
    t: 0,
    puzzle: opts.puzzle ?? 0,
    boards: PUZZLES.map(() => mkBoard()),
    prog: PUZZLES.map((pz) => ({
      hold: 0, passed: false, ok: false, actual: 0, target: pz.target(0),
      sT: new Float32Array(SCOPE_N), sA: new Float32Array(SCOPE_N), si: 0, count: 0,
    })),
    flags: {}, // ordered dict: p1..p5, firstSaturation, firstChatter
    events: [], // ring buffer of {t, msg}
    ticks: 0,
  }

  const ev = (msg) => {
    state.events.push({ t: state.t, msg })
    if (state.events.length > eventCap) state.events.shift()
  }
  const flag = (k, msg) => {
    if (!state.flags[k]) { state.flags[k] = true; if (msg) ev(msg) }
  }

  /* ------------------------- graph rebuild -------------------------
     On topology change: recompute each part's output edge, run Kahn's
     algorithm for a topological order, and mark every part that sits on
     a cycle as CONFUSED (it carries 0 and flashes red — a visible
     failure, not an error dialog). Parts merely downstream of a cycle
     evaluate normally and simply receive 0.                          */
  function rebuild(board) {
    const cells = board.cells
    const N = cells.length
    const outIx = new Int16Array(N).fill(-1)
    const outPort = new Uint8Array(N)
    const indeg = new Uint8Array(N)
    let spent = 0
    for (let i = 0; i < N; i++) {
      const p = cells[i]
      if (!p) continue
      if (!p.fixed) spent += COSTS[p.type] || 0
      if (p.type === 'socket') continue
      const gx = i % GW, gz = (i / GW) | 0
      const [dx, dz] = DIRS[p.dir]
      const tx = gx + dx, tz = gz + dz
      if (!inGrid(tx, tz)) continue
      const q = cells[ix(tx, tz)]
      if (!q) continue
      const port = portFor(q, p.dir)
      if (port === 0) continue
      outIx[i] = ix(tx, tz)
      outPort[i] = port
      indeg[ix(tx, tz)]++
    }
    // Kahn pass 1: find everything reachable without cycles
    const order = []
    const done = new Uint8Array(N)
    const queue = []
    for (let i = 0; i < N; i++) if (cells[i] && indeg[i] === 0) queue.push(i)
    const deg = indeg.slice()
    while (queue.length) {
      const i = queue.shift()
      done[i] = 1
      order.push(i)
      const o = outIx[i]
      if (o >= 0 && --deg[o] === 0) queue.push(o)
    }
    // leftovers are on a cycle or fed only through one; walk each leftover's
    // out-chain — if it returns to itself it is a true cycle member.
    const confusedN = []
    for (let i = 0; i < N; i++) {
      if (!cells[i] || done[i]) continue
      let j = outIx[i], hops = 0
      while (j >= 0 && hops++ < N) { if (j === i) break; j = outIx[j] }
      cells[i].confused = j === i
      if (j === i) confusedN.push(i)
    }
    // Kahn pass 2 over non-confused leftovers (cycles broken: confused
    // parts contribute nothing, so drop their edges).
    const deg2 = new Uint8Array(N)
    for (let i = 0; i < N; i++) {
      if (!cells[i] || done[i] === 0 && cells[i].confused) continue
      if (done[i] || !cells[i].confused) {
        const o = outIx[i]
        if (o >= 0 && !done[o] && !cells[o].confused) deg2[o]++
      }
    }
    // (recompute cleanly: order2 over the leftover, non-confused set)
    const left = []
    for (let i = 0; i < N; i++) if (cells[i] && !done[i] && !cells[i].confused) left.push(i)
    const ldeg = new Uint8Array(N)
    for (const i of [...order, ...left]) {
      const o = outIx[i]
      if (o >= 0 && left.includes(o)) ldeg[o]++
    }
    const q2 = left.filter((i) => ldeg[i] === 0)
    const order2 = []
    const done2 = new Uint8Array(N)
    while (q2.length) {
      const i = q2.shift()
      if (done2[i]) continue
      done2[i] = 1
      order2.push(i)
      const o = outIx[i]
      if (o >= 0 && left.includes(o) && --ldeg[o] === 0) q2.push(o)
    }
    for (const i of order) if (cells[i]) cells[i].confused = false
    board.order = order.concat(order2)
    board.outIx = outIx
    board.outPort = outPort
    board.confusedCount = confusedN.length
    board.spent = spent
    board.dirty = false
    if (confusedN.length) ev(`CYCLE — ${confusedN.length} part${confusedN.length > 1 ? 's' : ''} CONFUSED (carrying 0)`)
  }

  /* --------------------------- evaluation --------------------------- */
  function evalBoard(board, dt) {
    if (board.dirty) rebuild(board)
    const cells = board.cells
    const { order, outIx, outPort } = board
    // reset per-tick accumulators
    for (let k = 0; k < order.length; k++) {
      const p = cells[order[k]]
      p.in = 0
      if (p.type === 'gate') { p.flow = 0; p.sense = 0 }
      if (p.type === 'ratio') p.ins.length = 0
    }
    for (let i = 0; i < cells.length; i++) {
      const p = cells[i]
      if (p && p.confused) { p.in = 0; p.out = 0 }
    }
    // topological sweep
    for (let k = 0; k < order.length; k++) {
      const i = order[k]
      const p = cells[i]
      switch (p.type) {
        case 'source':
          p.out = SOURCES[p.src].fn(state.t)
          break
        case 'trace': {
          const wasSat = p.sat
          p.sat = p.in > TRACE_CAP + 1e-6
          p.out = p.sat ? TRACE_CAP : p.in
          if (p.sat && !wasSat) {
            flag('firstSaturation', `TRACE SATURATED at (${i % GW},${(i / GW) | 0}) — ${p.in.toFixed(1)}/s into a 20/s trace, excess lost upstream`)
            if (state.flags.firstSaturation) ev(`congestion: trace (${i % GW},${(i / GW) | 0}) carrying ${TRACE_CAP}/s, losing ${(p.in - TRACE_CAP).toFixed(1)}/s`)
          }
          break
        }
        case 'merge':
          p.out = p.in // a + b; the downstream trace does the capping
          p.sat = p.in > TRACE_CAP + 1e-6
          break
        case 'valve':
          p.out = p.in * p.k
          break
        case 'ratio': {
          const a = p.ins.length > 0 ? p.ins[0] : 0
          const b = p.ins.length > 1 ? p.ins[1] : 0
          p.out = Math.min(a, b)
          p.starved = (a < 0.05 && b >= 0.05) ? 1 : (b < 0.05 && a >= 0.05) ? 2 : 0
          break
        }
        case 'gate': {
          const base = p.mode === 'NO' ? p.sense >= p.n : p.sense < p.n
          if (Math.abs(p.sense - p.n) < HOVER_BAND) p.hoverT += dt
          else p.hoverT = 0
          let open = base
          if (p.hoverT > HOVER_DWELL) {
            // marginal input: the comparator cannot commit — it flickers.
            const ph = Math.floor((p.hoverT - HOVER_DWELL) / FLICKER_T)
            open = (ph & 1) === 0 ? base : !base
          }
          if (open !== p.open) {
            p.open = open
            p.flips.push(state.t)
            if (p.flips.length > 8) p.flips.shift()
          }
          const wasChatter = p.chatter
          p.chatter = p.flips.length >= 3 && state.t - p.flips[p.flips.length - 3] <= 2
          if (p.chatter && !wasChatter) {
            flag('firstChatter', `GATE CHATTER at (${i % GW},${(i / GW) | 0}) — SENSE hovering at N=${p.n.toFixed(1)}, ≥3 flips in 2s`)
            if (state.flags.firstChatter) ev(`gate (${i % GW},${(i / GW) | 0}) chattering — SENSE ${p.sense.toFixed(2)} vs N ${p.n.toFixed(2)}`)
          }
          p.out = p.open ? p.flow : 0
          break
        }
        case 'tank': {
          const avail = p.level / dt + p.in
          const out = p.level > 1e-9 ? Math.min(p.drain, avail) : Math.min(p.in, p.drain)
          p.level = clamp(p.level + (p.in - out) * dt, 0, TANK_CAP) // overflow above cap is lost
          p.full = p.level >= TANK_CAP - 1e-6
          p.out = out
          break
        }
        case 'decay': {
          const old = p.buf[p.bi]
          p.buf[p.bi] = p.in
          p.bi = (p.bi + 1) % DECAY_LAG
          p.out = old * DECAY_K // thinner and later — old data is literally stale
          break
        }
        case 'socket':
          p.out = 0
          break
      }
      // deliver downstream
      const o = outIx[i]
      if (o >= 0 && p.out > 0) {
        const q = cells[o]
        if (!q.confused) {
          const port = outPort[i]
          if (port === 2) q.flow += p.out
          else if (port === 3) q.sense += p.out
          else if (q.type === 'ratio') { q.ins.push(p.out); q.in += p.out }
          else q.in += p.out
        }
      } else if (o >= 0 && p.out === 0 && cells[o].type === 'ratio' && !cells[o].confused) {
        cells[o].ins.push(0) // a connected-but-zero side still claims its port
      }
    }
    return cells[ix(SOCKET.gx, SOCKET.gz)].in
  }

  /* ----------------------------- step ------------------------------ */
  function step(dt) {
    state.t += dt
    state.ticks++
    const pzIx = state.puzzle
    const actual = evalBoard(state.boards[pzIx], dt)
    const pz = PUZZLES[pzIx]
    const pr = state.prog[pzIx]
    const target = pz.target(state.t)
    pr.actual = actual
    pr.target = target
    pr.ok = Math.abs(actual - target) <= pz.tol
    pr.hold = pr.ok ? pr.hold + dt : 0
    if (!pr.passed && pr.hold >= PASS_HOLD) {
      pr.passed = true
      flag('p' + (pzIx + 1), `CONTRACT ${pz.key} PASSED — ${PASS_HOLD}s inside tolerance at T+${state.t.toFixed(1)}s`)
    }
    pr.sT[pr.si] = target
    pr.sA[pr.si] = actual
    pr.si = (pr.si + 1) % SCOPE_N
    if (pr.count < SCOPE_N) pr.count++
  }

  /* ------------------------------ act ------------------------------
     The complete player verb set. UI and harness both come through here. */
  function act(a) {
    const board = state.boards[state.puzzle]
    const cells = board.cells
    switch (a.type) {
      case 'puzzle': {
        const n = clamp(a.ix | 0, 0, PUZZLES.length - 1)
        if (n !== state.puzzle) {
          state.puzzle = n
          state.prog[n].hold = 0
          ev(`BENCH → CONTRACT ${n + 1} · ${PUZZLES[n].key}`)
        }
        break
      }
      case 'place': {
        if (!inGrid(a.gx, a.gz) || !(a.part in COSTS)) return
        const i = ix(a.gx, a.gz)
        if (cells[i]) return
        cells[i] = mkPart(a.part, a.dir ?? 0)
        board.dirty = true
        break
      }
      case 'remove': {
        if (!inGrid(a.gx, a.gz)) return
        const i = ix(a.gx, a.gz)
        if (!cells[i] || cells[i].fixed) return
        cells[i] = null
        board.dirty = true
        break
      }
      case 'rotate': {
        if (!inGrid(a.gx, a.gz)) return
        const p = cells[ix(a.gx, a.gz)]
        if (!p || p.fixed) return
        p.dir = (p.dir + 1) & 3
        board.dirty = true
        break
      }
      case 'tune': {
        if (!inGrid(a.gx, a.gz)) return
        const p = cells[ix(a.gx, a.gz)]
        if (!p) return
        const v = +a.value
        if (!Number.isFinite(v)) return
        if (p.type === 'valve') p.k = clamp(v, 0, 1)
        else if (p.type === 'gate') p.n = clamp(v, 0, 12)
        else if (p.type === 'tank') p.drain = clamp(v, 0.5, 8)
        break
      }
      case 'mode': {
        if (!inGrid(a.gx, a.gz)) return
        const p = cells[ix(a.gx, a.gz)]
        if (!p || p.type !== 'gate') return
        p.mode = p.mode === 'NO' ? 'NC' : 'NO'
        break
      }
      case 'traceRun': {
        // cells: [[gx,gz], ...] — a dragged path. Each placed trace points at
        // the next cell in the path; the run stops at the first occupied cell
        // (so ending the drag on a part/socket aims the last trace into it).
        const path = a.cells
        if (!Array.isArray(path) || path.length === 0) return
        let prevDir = 0
        for (let i = 0; i < path.length; i++) {
          const [gx, gz] = path[i]
          if (!inGrid(gx, gz)) break
          if (cells[ix(gx, gz)]) break // occupied: terminal (or blocked)
          let dir = prevDir
          if (i + 1 < path.length) {
            const dx = path[i + 1][0] - gx, dz = path[i + 1][1] - gz
            const d = DIRS.findIndex(([x, z]) => x === dx && z === dz)
            if (d < 0) { cells[ix(gx, gz)] = mkPart('trace', dir); board.dirty = true; break }
            dir = d
          }
          cells[ix(gx, gz)] = mkPart('trace', dir)
          prevDir = dir
          board.dirty = true
        }
        break
      }
    }
  }

  ev('BENCH ONLINE — four sources live, contract socket waiting')
  ev(`CONTRACT 1 · HALF — ${PUZZLES[0].brief}`)

  return { state, step, act }
}
