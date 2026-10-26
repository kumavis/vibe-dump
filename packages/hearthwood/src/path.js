// Grid A* pathfinding with a budgeted job queue and an LRU path cache.
// OWNER: world implementer. Contract: ARCHITECTURE.md §7.
//
// Paths are SHARED, IMMUTABLE Int32Arrays of packed tiles: path[0] = start tile,
// path[path.length-1] = goal tile, length >= 1. Never mutate a returned path.
//
// Layout (all allocation-free in steady state; the only per-search allocation is the
// result Int32Array itself, which is then shared through the cache):
//   AStar          resumable search state over typed arrays sized to the world
//                  (g, parent, per-search stamps, lazy-deletion open list). The open list
//                  is a monotone bucket queue (O(1)): with integer costs and a consistent
//                  octile heuristic every open f lies within 2*COST_DIAG of the minimum.
//                  MinHeap stays exported as the generic heap of the contract.
//   PathService    FIFO job queue (typed ring) + result ring + pending-dedupe Map +
//                  LRU cache (Map key -> slot, doubly-linked slot list) + region labels.
//
// Seam for hierarchical pathing: callers only use request/poll/update. A chunk-portal
// layer can later be slotted into PathService._startJob/_runActive (e.g. plan over chunk
// portals first, then refine per chunk) without touching units.js. world.chunkNavVersion
// already tells such a layer which chunks changed walkability.

import {
  PATH_BUDGET, PATH_MAX_EXPANSIONS, PATH_CACHE_SIZE, PATH_QUEUE_MAX, PATH_RING,
  COST_STRAIGHT, COST_DIAG,
} from './constants.js'

/** Sentinel returned by poll() while the search is queued or running. Compare by identity. */
export const PATH_PENDING = Object.freeze(new Int32Array(0))
/** Sentinel returned by poll() when no path exists, the queue overflowed, or the job id expired. */
export const PATH_NONE = Object.freeze(new Int32Array(0))

const JOB_MASK = (1 << 30) - 1
/** Half-size of the flood window used to patch region labels after a placement. */
const LOCAL_R = 16
const NB_DX = Int8Array.from([1, -1, 0, 0, 1, -1, 1, -1])
const NB_DY = Int8Array.from([0, 0, 1, -1, 1, 1, -1, -1])

/**
 * Binary min-heap of int32 values keyed by int32 priorities (f-scores).
 * Fixed capacity, allocation-free. Ties pop in unspecified-but-deterministic order.
 * Optional third push argument `tie` breaks equal keys (smaller tie pops first); A* passes
 * h so that among equal f the node closest to the goal is expanded first.
 */
export class MinHeap {
  /** @param {number} capacity */
  constructor(capacity) {
    this.capacity = capacity
    this.vals = new Int32Array(capacity)
    this.keys = new Int32Array(capacity)
    this.ties = new Int32Array(capacity)
    this.size = 0
  }
  clear() { this.size = 0 }
  /** @returns {boolean} false if full */
  push(val, key, tie = 0) {
    let i = this.size
    if (i >= this.capacity) return false
    const vals = this.vals, keys = this.keys, ties = this.ties
    this.size = i + 1
    while (i > 0) {
      const p = (i - 1) >> 1
      const pk = keys[p]
      if (pk < key || (pk === key && ties[p] <= tie)) break
      vals[i] = vals[p]; keys[i] = pk; ties[i] = ties[p]
      i = p
    }
    vals[i] = val; keys[i] = key; ties[i] = tie
    return true
  }
  /** @returns {number} value with the smallest key; -1 if empty */
  pop() {
    const n = this.size
    if (n === 0) return -1
    const vals = this.vals, keys = this.keys, ties = this.ties
    const top = vals[0]
    const last = n - 1
    this.size = last
    if (last === 0) return top
    const v = vals[last], k = keys[last], t = ties[last]
    let i = 0
    for (;;) {
      let c = 2 * i + 1
      if (c >= last) break
      const r = c + 1
      if (r < last && (keys[r] < keys[c] || (keys[r] === keys[c] && ties[r] < ties[c]))) c = r
      const ck = keys[c]
      if (ck > k || (ck === k && ties[c] >= t)) break
      vals[i] = vals[c]; keys[i] = ck; ties[i] = ties[c]
      i = c
    }
    vals[i] = v; keys[i] = k; ties[i] = t
    return top
  }
  /** smallest key without popping (undefined behaviour if empty) */
  peekKey() { return this.keys[0] }
  /** Double the capacity (rare; only when a search pushes more duplicates than expected). */
  grow() {
    const cap = this.capacity * 2
    const v = new Int32Array(cap), k = new Int32Array(cap), t = new Int32Array(cap)
    v.set(this.vals); k.set(this.keys); t.set(this.ties)
    this.vals = v; this.keys = k; this.ties = t; this.capacity = cap
  }
}

// ------------------------------------------------------------------ bucket queue (A* open list)

/** f of any open node lies in [fmin, fmin + 2*COST_DIAG] under a consistent heuristic. */
const BQ_BUCKETS = 64
const BQ_MASK = BQ_BUCKETS - 1

/**
 * Monotone integer priority queue for A*: one LIFO stack per f value, circular over
 * BQ_BUCKETS consecutive f values. O(1) push/pop. Entries live in a pool of linked nodes
 * (typed arrays, free list, grows by doubling — only on unusually large searches).
 * LIFO among equal f is a good tie-break: the most recently generated node (usually the
 * one closest to the goal) is expanded first, so open ground costs ~path-length expansions.
 */
class BucketQueue {
  constructor(capacity) {
    this.head = new Int32Array(BQ_BUCKETS).fill(-1)
    this.val = new Int32Array(capacity)
    this.next = new Int32Array(capacity)
    this.capacity = capacity
    this.used = 0 // high-water mark of pool entries
    this.free = -1 // free-list head
    this.size = 0
    this.fcur = 0 // lowest f that may be non-empty
  }
  clear() {
    this.head.fill(-1)
    this.used = 0
    this.free = -1
    this.size = 0
    this.fcur = 0
  }
  push(v, f) {
    let e = this.free
    if (e >= 0) this.free = this.next[e]
    else {
      if (this.used >= this.capacity) this._grow()
      e = this.used++
    }
    if (this.size === 0 || f < this.fcur) this.fcur = f
    const b = f & BQ_MASK
    this.val[e] = v
    this.next[e] = this.head[b]
    this.head[b] = e
    this.size++
  }
  /** @returns {number} value with the smallest f (LIFO among equals); -1 if empty */
  pop() {
    if (this.size === 0) return -1
    const head = this.head
    let f = this.fcur
    while (head[f & BQ_MASK] < 0) f++
    this.fcur = f
    const b = f & BQ_MASK
    const e = head[b]
    head[b] = this.next[e]
    this.next[e] = this.free
    this.free = e
    this.size--
    return this.val[e]
  }
  _grow() {
    const cap = this.capacity * 2
    const v = new Int32Array(cap), n = new Int32Array(cap)
    v.set(this.val); n.set(this.next)
    this.val = v; this.next = n; this.capacity = cap
  }
}

// ------------------------------------------------------------------ resumable A*

const S_RUNNING = 0
const S_FOUND = 1
const S_FAILED = 2

/**
 * Resumable A* over one World. Not exported; PathService owns one, findPathSync keeps one
 * per World in a WeakMap. Node state uses a per-search stamp: state[i] === openStamp means
 * "g/parent valid, maybe in heap", === openStamp + 1 means closed; anything else = unseen.
 */
class AStar {
  /** @param {import('./world.js').World} world */
  constructor(world) {
    this.world = world
    const n = world.size
    this.g = new Int32Array(n)
    this.parent = new Int32Array(n)
    this.state = new Uint32Array(n)
    this.stamp = 0 // openStamp of the current search (even); closed = stamp + 1
    this.heap = new BucketQueue(Math.max(1024, n >> 2))
    this.from = -1
    this.to = -1
    this.gx = 0
    this.gy = 0
    this.expansions = 0
    this.status = S_FAILED
  }

  /** Start a new search (does not expand anything). */
  begin(from, to) {
    const world = this.world
    this.stamp += 2
    if (this.stamp >= 0xfffffff0) { this.state.fill(0); this.stamp = 2 }
    this.from = from
    this.to = to
    this.gx = to & world.mask
    this.gy = to >> world.shift
    this.expansions = 0
    this.heap.clear()
    if (from < 0 || to < 0 || from >= world.size || to >= world.size || world.pass[to] !== 1) {
      this.status = S_FAILED
      return
    }
    this.status = S_RUNNING
    this.g[from] = 0
    this.parent[from] = -1
    this.state[from] = this.stamp
    this.heap.push(from, this._h(from))
  }

  _h(i) {
    const w = this.world
    let dx = (i & w.mask) - this.gx, dy = (i >> w.shift) - this.gy
    if (dx < 0) dx = -dx
    if (dy < 0) dy = -dy
    return dx > dy ? COST_STRAIGHT * dx + (COST_DIAG - COST_STRAIGHT) * dy : COST_STRAIGHT * dy + (COST_DIAG - COST_STRAIGHT) * dx
  }

  /**
   * Expand up to `limit` nodes (and never beyond `maxExpansions` in total for this search).
   * @returns {number} expansions performed
   */
  run(limit, maxExpansions) {
    if (this.status !== S_RUNNING) return 0
    const world = this.world
    const pass = world.pass, mask = world.mask, shift = world.shift, W = world.w, H = world.h
    const g = this.g, state = this.state, heap = this.heap
    const closed = this.stamp + 1
    const goal = this.to
    let done = 0
    while (done < limit) {
      if (this.expansions >= maxExpansions || heap.size === 0) { this.status = S_FAILED; break }
      const cur = heap.pop()
      if (state[cur] === closed) continue // stale duplicate
      state[cur] = closed
      done++
      this.expansions++
      if (cur === goal) { this.status = S_FOUND; break }
      const cx = cur & mask, cy = cur >> shift
      const gs = g[cur] + COST_STRAIGHT, gd = g[cur] + COST_DIAG
      // orthogonal walkability; diagonals need both adjacent orthogonals (no corner cutting)
      const L = cx > 0 && pass[cur - 1] === 1
      const R = cx < W - 1 && pass[cur + 1] === 1
      const U = cy > 0 && pass[cur - W] === 1
      const D = cy < H - 1 && pass[cur + W] === 1
      if (R) this._relax(cur + 1, cur, gs)
      if (L) this._relax(cur - 1, cur, gs)
      if (D) this._relax(cur + W, cur, gs)
      if (U) this._relax(cur - W, cur, gs)
      if (D && R && pass[cur + W + 1] === 1) this._relax(cur + W + 1, cur, gd)
      if (D && L && pass[cur + W - 1] === 1) this._relax(cur + W - 1, cur, gd)
      if (U && R && pass[cur - W + 1] === 1) this._relax(cur - W + 1, cur, gd)
      if (U && L && pass[cur - W - 1] === 1) this._relax(cur - W - 1, cur, gd)
    }
    return done
  }

  /** Offer node n reached from `from` with cost ng (n is in bounds and walkable). */
  _relax(n, from, ng) {
    const st = this.state[n]
    const open = this.stamp
    if (st === open + 1) return
    if (st === open && ng >= this.g[n]) return
    this.g[n] = ng
    this.parent[n] = from
    this.state[n] = open
    const world = this.world
    let dx = (n & world.mask) - this.gx, dy = (n >> world.shift) - this.gy
    if (dx < 0) dx = -dx
    if (dy < 0) dy = -dy
    const h = dx > dy ? COST_STRAIGHT * dx + (COST_DIAG - COST_STRAIGHT) * dy : COST_STRAIGHT * dy + (COST_DIAG - COST_STRAIGHT) * dx
    this.heap.push(n, ng + h)
  }

  /** Build the result path (allocates the shared Int32Array). Only valid when status === S_FOUND. */
  extract() {
    const parent = this.parent
    let len = 1
    for (let i = this.to; i !== this.from; i = parent[i]) len++
    const out = new Int32Array(len)
    let k = len - 1
    for (let i = this.to; ; i = parent[i]) {
      out[k--] = i
      if (i === this.from) break
    }
    return out
  }

  /** Cost of the found path (g of the goal). */
  cost() { return this.g[this.to] }
}

/** @type {WeakMap<object, AStar>} */
const syncSearches = new WeakMap()

/**
 * Synchronous unbudgeted A* (tests, debug overlay, mapgen connectivity checks).
 * 8-connected, octile heuristic with COST_STRAIGHT/COST_DIAG, no diagonal corner cutting
 * (a diagonal step needs both orthogonal neighbours walkable). The start tile is treated
 * as walkable even if blocked; the goal must be walkable.
 * @param {import('./world.js').World} world
 * @param {number} from packed tile
 * @param {number} to packed tile
 * @param {number} [maxExpansions=PATH_MAX_EXPANSIONS]
 * @returns {Int32Array|null} fresh path (not cached) or null
 */
export function findPathSync(world, from, to, maxExpansions = PATH_MAX_EXPANSIONS) {
  if (from < 0 || to < 0 || from >= world.size || to >= world.size) return null
  if (world.pass[to] !== 1) return null
  if (from === to) return Int32Array.of(from)
  let s = syncSearches.get(world)
  if (!s) { s = new AStar(world); syncSearches.set(world, s) }
  s.begin(from, to)
  s.run(0x7fffffff, maxExpansions)
  return s.status === S_FOUND ? s.extract() : null
}

/** Cost (COST_STRAIGHT/COST_DIAG units) of a path; -1 for an empty array. Test/debug helper. */
export function pathCost(world, path) {
  if (path.length === 0) return -1
  let c = 0
  for (let k = 1; k < path.length; k++) {
    const a = path[k - 1], b = path[k]
    const diag = (a & world.mask) !== (b & world.mask) && (a >> world.shift) !== (b >> world.shift)
    c += diag ? COST_DIAG : COST_STRAIGHT
  }
  return c
}

/**
 * Budgeted path service. One instance per game: ctx.path.
 *
 * Protocol (only units.js calls request/poll; game loop calls update once per tick):
 *   const job = ctx.path.request(from, to)     // always returns an int job id >= 0
 *   const r = ctx.path.poll(job)               // Int32Array | PATH_PENDING | PATH_NONE
 * Cache hits and trivial requests (from === to, unreachable by region) resolve inside
 * request(), so poll() right after request() can already return a path.
 */
export class PathService {
  /**
   * @param {import('./world.js').World} world
   * @param {{budget?:number, cacheSize?:number, maxExpansions?:number, queueMax?:number}} [opts]
   */
  constructor(world, opts = {}) {
    this.world = world
    /** node expansions allowed per update() */ this.budget = opts.budget ?? PATH_BUDGET
    this.cacheSize = Math.max(1, opts.cacheSize ?? PATH_CACHE_SIZE)
    this.maxExpansions = opts.maxExpansions ?? PATH_MAX_EXPANSIONS
    this.queueMax = Math.max(1, opts.queueMax ?? PATH_QUEUE_MAX)
    /** monotonically increasing job counter (wraps at 2^30) */ this.nextJob = 0
    /** counters for stats() / HUD debug; reset never (queued = searches waiting or running now) */
    this.stats = { requests: 0, hits: 0, misses: 0, expansions: 0, found: 0, failed: 0, queued: 0, lastUpdateExpansions: 0 }

    // ---- result ring: slot = job & ringMask
    this._ringMask = PATH_RING - 1
    this._ringJob = new Int32Array(PATH_RING).fill(-1)
    /** @type {Int32Array[]} */ this._ringRes = new Array(PATH_RING).fill(PATH_NONE)

    // ---- FIFO queue of pending jobs (typed ring buffer)
    const q = this.queueMax
    this._qJob = new Int32Array(q)
    this._qFrom = new Int32Array(q)
    this._qTo = new Int32Array(q)
    this._qHead = 0
    this._qLen = 0
    /** key -> job id of a queued/running search with that (from,to) */
    this._pending = new Map()

    // ---- active search
    this._search = new AStar(world)
    this._active = -1 // job id being searched, -1 none
    this._activeNav = -1 // navVersion the active search started at
    this._activeRestarts = 0

    // ---- LRU cache: Map key -> slot; slots form a doubly-linked list (head = MRU)
    const cs = this.cacheSize
    this._cache = new Map()
    this._cKey = new Float64Array(cs)
    this._cNav = new Float64Array(cs)
    /** @type {(Int32Array|null)[]} */ this._cPath = new Array(cs).fill(null)
    this._cPrev = new Int32Array(cs).fill(-1)
    this._cNext = new Int32Array(cs).fill(-1)
    this._cHead = -1
    this._cTail = -1
    this._cFree = new Int32Array(cs)
    for (let i = 0; i < cs; i++) this._cFree[i] = cs - 1 - i
    this._cFreeN = cs

    // ---- region labels (4-connected components of walkable tiles; equivalent to the
    // 8-connected no-corner-cut rule because a legal diagonal implies both orthogonals)
    this._label = new Int32Array(world.size)
    this._labelNav = -1
    this._bfs = new Int32Array(world.size)
    // local flood window for incremental relabelling (see _syncLabels)
    const lw = 2 * LOCAL_R + 8
    this._locStamp = new Uint32Array(lw * lw)
    this._locGen = 0
    /** counters: full flood fills vs. locally patched footprint changes (debug / tests) */
    this.relabels = { full: 0, local: 0 }
    /** number of regions at the last labelling */ this.regionCount = 0
  }

  // ------------------------------------------------------------------ public API

  /**
   * Request a path. Dedupes identical pending (from,to) pairs onto one job.
   * Never throws. O(1) amortised (cache hit revalidation is O(path length) once per navVersion).
   * @param {number} from packed start tile (unit's current tile)
   * @param {number} to packed goal tile
   * @returns {number} job id
   */
  request(from, to) {
    const st = this.stats
    st.requests++
    const world = this.world
    if (!(from >= 0 && to >= 0 && from < world.size && to < world.size) || world.pass[to] !== 1) {
      return this._resolveNew(PATH_NONE)
    }
    const hit = this.cached(from, to)
    if (hit !== null) { st.hits++; return this._resolveNew(hit) }
    if (from === to) {
      const p = Int32Array.of(from)
      this._cacheInsert(from * world.size + to, p)
      st.hits++
      return this._resolveNew(p)
    }
    if (!this.sameRegion(from, to)) return this._resolveNew(PATH_NONE)
    const key = from * world.size + to
    const existing = this._pending.get(key)
    if (existing !== undefined && this._ringJob[existing & this._ringMask] === existing) return existing
    if (this._qLen >= this.queueMax) return this._resolveNew(PATH_NONE)
    st.misses++
    const job = this._newJob()
    const slot = job & this._ringMask
    this._ringJob[slot] = job
    this._ringRes[slot] = PATH_PENDING
    let qi = this._qHead + this._qLen
    if (qi >= this.queueMax) qi -= this.queueMax
    this._qJob[qi] = job
    this._qFrom[qi] = from
    this._qTo[qi] = to
    this._qLen++
    this._pending.set(key, job)
    st.queued = this.pending()
    return job
  }

  /**
   * @param {number} job id from request()
   * @returns {Int32Array} a path, or the PATH_PENDING / PATH_NONE sentinel
   */
  poll(job) {
    const slot = job & this._ringMask
    if (job < 0 || this._ringJob[slot] !== job) return PATH_NONE
    return this._ringRes[slot]
  }

  /**
   * Advance queued searches by at most `budget` node expansions in total. A search that
   * runs out of budget keeps its open/closed state and resumes on the next call.
   * Completed paths are inserted into the cache.
   * @param {number} [budget=this.budget]
   * @returns {number} expansions used
   */
  update(budget = this.budget) {
    let used = 0 // loop budget: real expansions, plus 1 per job that resolves without expanding
    let expanded = 0
    while (used < budget) {
      if (this._active < 0) {
        if (this._qLen === 0) break
        if (!this._startNext()) { used++; continue }
      }
      const n = this._runActive(budget - used)
      expanded += n
      used += n > 0 ? n : 1
    }
    this.stats.expansions += expanded
    this.stats.lastUpdateExpansions = expanded
    this.stats.queued = this.pending()
    return expanded
  }

  /**
   * Cache lookup without queuing. Revalidates stale entries (entry.navVersion !== world.navVersion)
   * by checking every tile on the path is still walkable: valid -> re-stamp and return it,
   * invalid -> evict and return null.
   * @returns {Int32Array|null}
   */
  cached(from, to) {
    const world = this.world
    const key = from * world.size + to
    const slot = this._cache.get(key)
    if (slot === undefined) return null
    const p = this._cPath[slot]
    if (this._cNav[slot] !== world.navVersion) {
      if (!this._pathStillValid(p)) { this._cacheEvict(slot); return null }
      this._cNav[slot] = world.navVersion
    }
    this._cacheTouch(slot)
    return p
  }

  /**
   * Same connected walkable region (8-connected with the no-corner-cut rule)? Region labels
   * are recomputed lazily, at most once per navVersion, O(map size).
   * A blocked tile (unit standing inside a fresh building, door of nothing) counts as part
   * of any region one of its 8 neighbours belongs to, matching A*'s "start is walkable".
   */
  sameRegion(a, b) {
    const world = this.world
    if (!(a >= 0 && b >= 0 && a < world.size && b < world.size)) return false
    if (this._labelNav !== world.navVersion) this._syncLabels()
    const L = this._label
    const la = L[a], lb = L[b]
    if (la >= 0 && lb >= 0) return la === lb
    // at least one side blocked: compare neighbourhood label sets (k = 8 is the tile itself)
    for (let i = 0; i < 9; i++) {
      const ra = this._nbLabel(a, i)
      if (ra < 0) continue
      for (let j = 0; j < 9; j++) if (this._nbLabel(b, j) === ra) return true
    }
    return false
  }

  /** Region label of a walkable tile (-1 for blocked), refreshed lazily. Debug/logistics helper. */
  regionOf(i) {
    if (this._labelNav !== this.world.navVersion) this._syncLabels()
    return i >= 0 && i < this.world.size ? this._label[i] : -1
  }

  /** Number of searches waiting or running. */
  pending() { return this._qLen + (this._active >= 0 ? 1 : 0) }

  /** Number of cached paths. */
  cacheCount() { return this._cache.size }

  /** Drop every cached path and pending job (tests / map reset). */
  clear() {
    this._cache.clear()
    this._cPath.fill(null)
    this._cPrev.fill(-1)
    this._cNext.fill(-1)
    this._cHead = this._cTail = -1
    const cs = this.cacheSize
    for (let i = 0; i < cs; i++) this._cFree[i] = cs - 1 - i
    this._cFreeN = cs
    this._pending.clear()
    this._qHead = 0
    this._qLen = 0
    this._active = -1
    this._ringJob.fill(-1)
    this._ringRes.fill(PATH_NONE)
    this._labelNav = -1
    this.stats.queued = 0
  }

  // ------------------------------------------------------------------ internals

  _newJob() {
    const j = this.nextJob
    this.nextJob = (j + 1) & JOB_MASK
    return j
  }

  /** Allocate a job id that is already resolved to `res`. */
  _resolveNew(res) {
    const job = this._newJob()
    const slot = job & this._ringMask
    this._ringJob[slot] = job
    this._ringRes[slot] = res
    return job
  }

  /** Set a pending job's result if its ring slot still belongs to it. */
  _resolve(job, res) {
    const slot = job & this._ringMask
    if (this._ringJob[slot] === job) this._ringRes[slot] = res
  }

  /** Dequeue the next job and begin its search. @returns {boolean} true if a search is now active */
  _startNext() {
    const job = this._qJob[this._qHead], from = this._qFrom[this._qHead], to = this._qTo[this._qHead]
    this._qHead++
    if (this._qHead >= this.queueMax) this._qHead = 0
    this._qLen--
    const world = this.world
    const key = from * world.size + to
    if (this._ringJob[job & this._ringMask] !== job) {
      // nobody can read this result any more
      if (this._pending.get(key) === job) this._pending.delete(key)
      return false
    }
    // the world may have changed while queued: cache may now hold it, or goal is gone
    const hit = this.cached(from, to)
    if (hit !== null) { this._finish(job, key, hit); return false }
    if (world.pass[to] !== 1 || !this.sameRegion(from, to)) { this._finish(job, key, PATH_NONE); return false }
    this._active = job
    this._activeNav = world.navVersion
    this._activeRestarts = 0
    this._search.begin(from, to)
    return true
  }

  /** Run the active search for at most `limit` expansions. @returns {number} expansions used */
  _runActive(limit) {
    const s = this._search, world = this.world
    if (this._activeNav !== world.navVersion) {
      // walkability changed mid-search: restart (bounded) so the result is never stale
      if (this._activeRestarts < 3 && world.pass[s.to] === 1 && this.sameRegion(s.from, s.to)) {
        this._activeRestarts++
        this._activeNav = world.navVersion
        s.begin(s.from, s.to)
      } else if (world.pass[s.to] !== 1 || !this.sameRegion(s.from, s.to)) {
        s.status = S_FAILED
      }
    }
    const used = s.run(limit, this.maxExpansions)
    if (s.status !== S_RUNNING) {
      const key = s.from * world.size + s.to
      const job = this._active
      this._active = -1
      if (s.status === S_FOUND) {
        const p = s.extract()
        this._cacheInsert(key, p)
        this.stats.found++
        this._finish(job, key, p)
      } else {
        this.stats.failed++
        this._finish(job, key, PATH_NONE)
      }
    }
    return used
  }

  _finish(job, key, res) {
    if (this._pending.get(key) === job) this._pending.delete(key)
    this._resolve(job, res)
  }

  _pathStillValid(p) {
    const world = this.world, pass = world.pass, mask = world.mask, W = world.w
    // path[0] is the start tile: treated as walkable, like A*
    for (let k = 1; k < p.length; k++) {
      const b = p[k]
      if (pass[b] !== 1) return false
      const a = p[k - 1]
      const dx = (b & mask) - (a & mask)
      if (dx !== 0 && b - a !== dx) {
        // diagonal step: the corner rule must still hold
        if (pass[a + dx] !== 1 || pass[b - dx] !== 1) return false
      }
    }
    return true
  }

  _cacheTouch(slot) {
    if (this._cHead === slot) return
    // unlink
    const p = this._cPrev[slot], n = this._cNext[slot]
    if (p >= 0) this._cNext[p] = n
    if (n >= 0) this._cPrev[n] = p
    if (this._cTail === slot) this._cTail = p
    // push front
    this._cPrev[slot] = -1
    this._cNext[slot] = this._cHead
    if (this._cHead >= 0) this._cPrev[this._cHead] = slot
    this._cHead = slot
    if (this._cTail < 0) this._cTail = slot
  }

  _cacheEvict(slot) {
    const p = this._cPrev[slot], n = this._cNext[slot]
    if (p >= 0) this._cNext[p] = n; else this._cHead = n
    if (n >= 0) this._cPrev[n] = p; else this._cTail = p
    this._cPrev[slot] = -1
    this._cNext[slot] = -1
    this._cache.delete(this._cKey[slot])
    this._cPath[slot] = null
    this._cFree[this._cFreeN++] = slot
  }

  _cacheInsert(key, path) {
    let slot = this._cache.get(key)
    if (slot === undefined) {
      if (this._cFreeN === 0) this._cacheEvict(this._cTail)
      slot = this._cFree[--this._cFreeN]
      this._cKey[slot] = key
      this._cache.set(key, slot)
      this._cPrev[slot] = -1
      this._cNext[slot] = this._cHead
      if (this._cHead >= 0) this._cPrev[this._cHead] = slot
      this._cHead = slot
      if (this._cTail < 0) this._cTail = slot
    } else {
      this._cacheTouch(slot)
    }
    this._cPath[slot] = path
    this._cNav[slot] = this.world.navVersion
  }

  /** k in 0..7: label of the k-th 8-neighbour of i (-1 if OOB/blocked); k === 8: label of i. */
  _nbLabel(i, k) {
    if (k === 8) return this._label[i]
    const world = this.world
    const x = (i & world.mask) + NB_DX[k], y = (i >> world.shift) + NB_DY[k]
    return x >= 0 && y >= 0 && x < world.w && y < world.h ? this._label[(y << world.shift) | x] : -1
  }

  /**
   * Bring region labels up to world.navVersion. When exactly one building footprint changed
   * since the last labelling (world.navLog), patch the labels locally:
   *  - occupy: the footprint tiles leave their region; the region can only split if the
   *    walkable tiles on the 1-tile ring around the footprint form more than one arc AND a
   *    bounded flood from one arc fails to reach the others. Otherwise labels stay valid.
   *  - vacate: the freed tiles join the single region around them (or a new one); when
   *    they touch two different regions (a wall plug was removed) fall back to a full fill.
   * Anything else (terrain edits, several changes at once, ambiguity) = full relabel.
   */
  _syncLabels() {
    const world = this.world
    const v = world.navVersion
    if (this._labelNav >= 0 && v === this._labelNav + 1 && world.navLogVer) {
      const s = v & (world.navLogVer.length - 1)
      if (world.navLogVer[s] === v) {
        const o = s * 4, R = world.navLogRect
        const ok = world.navLogKind[s] === 1
          ? this._patchOccupy(R[o], R[o + 1], R[o + 2], R[o + 3])
          : this._patchVacate(R[o], R[o + 1], R[o + 2], R[o + 3])
        if (ok) { this._labelNav = v; this.relabels.local++; return }
      }
    }
    this._relabel()
  }

  /** Perimeter tile k (clockwise from the top-left corner) of the ring around a w x h rect. */
  _ringTile(tx, ty, w, h, k) {
    const top = w + 2, right = h + 1, bottom = w + 1
    let x, y
    if (k < top) { x = tx - 1 + k; y = ty - 1 }
    else if (k < top + right) { x = tx + w; y = ty + (k - top) }
    else if (k < top + right + bottom) { x = tx + w - 1 - (k - top - right); y = ty + h }
    else { x = tx - 1; y = ty + h - 1 - (k - top - right - bottom) }
    const world = this.world
    if (x < 0 || y < 0 || x >= world.w || y >= world.h) return -1
    return (y << world.shift) | x
  }

  _patchOccupy(tx, ty, w, h) {
    const world = this.world, pass = world.pass, L = this._label, shift = world.shift
    for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) {
      const i = (y << shift) | x
      if (pass[i] === 1) return false // not actually blocked (defensive)
      L[i] = -1
    }
    // walkable arcs on the ring (the ring is a 4-connected cycle)
    const n = 2 * (w + h) + 4
    let arcs = 0, first = -1
    let prevWalk = false
    { const t = this._ringTile(tx, ty, w, h, n - 1); prevWalk = t >= 0 && pass[t] === 1 }
    let allWalk = true
    for (let k = 0; k < n; k++) {
      const t = this._ringTile(tx, ty, w, h, k)
      const wk = t >= 0 && pass[t] === 1
      if (!wk) allWalk = false
      if (wk && !prevWalk) { arcs++; if (first < 0) first = t }
      prevWalk = wk
    }
    if (allWalk || arcs <= 1) return true
    // several arcs: are they still joined by a path around the footprint (bounded window)?
    const lw = 2 * LOCAL_R + 8
    const x0 = tx - LOCAL_R, y0 = ty - LOCAL_R
    const x1 = x0 + lw, y1 = y0 + lw // exclusive
    if (w > 6 || h > 6) return false
    const st = this._locStamp
    if (this._locGen > 0xfffffff0) { st.fill(0); this._locGen = 0 }
    const gen = ++this._locGen
    const q = this._bfs
    let head = 0, tail = 0
    q[tail++] = first
    st[((first >> shift) - y0) * lw + ((first & world.mask) - x0)] = gen
    const W = world.w, H = world.h
    while (head < tail) {
      const i = q[head++]
      const x = i & world.mask, y = i >> shift
      for (let k = 0; k < 4; k++) {
        const nx = k === 0 ? x - 1 : k === 1 ? x + 1 : x
        const ny = k === 2 ? y - 1 : k === 3 ? y + 1 : y
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || nx < x0 || ny < y0 || nx >= x1 || ny >= y1) continue
        const ni = (ny << shift) | nx
        if (pass[ni] !== 1) continue
        const l = (ny - y0) * lw + (nx - x0)
        if (st[l] === gen) continue
        st[l] = gen
        q[tail++] = ni
      }
    }
    for (let k = 0; k < n; k++) {
      const t = this._ringTile(tx, ty, w, h, k)
      if (t < 0 || pass[t] !== 1) continue
      if (st[((t >> shift) - y0) * lw + ((t & world.mask) - x0)] !== gen) return false // maybe split
    }
    return true
  }

  _patchVacate(tx, ty, w, h) {
    const world = this.world, pass = world.pass, L = this._label, shift = world.shift
    for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) {
      if (pass[(y << shift) | x] !== 1) return false
    }
    // labels of the walkable 4-neighbours of the footprint (ring sides, corners excluded)
    let lab = -1
    const n = 2 * (w + h) + 4
    for (let k = 0; k < n; k++) {
      const t = this._ringTile(tx, ty, w, h, k)
      if (t < 0 || pass[t] !== 1) continue
      const x = t & world.mask, y = t >> shift
      const corner = (x === tx - 1 || x === tx + w) && (y === ty - 1 || y === ty + h)
      if (corner) continue
      const l = L[t]
      if (l < 0) return false
      if (lab < 0) lab = l
      else if (l !== lab) return false // joins two regions
    }
    if (lab < 0) lab = this.regionCount++
    for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) L[(y << shift) | x] = lab
    return true
  }

  /** Flood-fill 4-connected walkable components. O(size). */
  _relabel() {
    this.relabels.full++
    const world = this.world, pass = world.pass, L = this._label, q = this._bfs
    const W = world.w, H = world.h, mask = world.mask, shift = world.shift, size = world.size
    L.fill(-1)
    let label = 0
    for (let s = 0; s < size; s++) {
      if (pass[s] !== 1 || L[s] >= 0) continue
      let head = 0, tail = 0
      q[tail++] = s
      L[s] = label
      while (head < tail) {
        const i = q[head++]
        const x = i & mask, y = i >> shift
        if (x > 0 && pass[i - 1] === 1 && L[i - 1] < 0) { L[i - 1] = label; q[tail++] = i - 1 }
        if (x < W - 1 && pass[i + 1] === 1 && L[i + 1] < 0) { L[i + 1] = label; q[tail++] = i + 1 }
        if (y > 0 && pass[i - W] === 1 && L[i - W] < 0) { L[i - W] = label; q[tail++] = i - W }
        if (y < H - 1 && pass[i + W] === 1 && L[i + W] < 0) { L[i + W] = label; q[tail++] = i + W }
      }
      label++
    }
    this.regionCount = label
    this._labelNav = world.navVersion
  }
}
