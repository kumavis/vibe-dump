// metric.js — Advogato's group trust metric as integer network flow.
//
// This is a JavaScript re-telling of mod_virgule's tmetric.c and net_flow.c
// (https://github.com/steevithak/mod_virgule/tree/Raph). The parts that matter
// for *which* accounts are accepted are kept the same as the reference:
//
//   • a synthetic source node "-" is node 0 and is treated like any other node;
//     it receives caps[0], reserves one unit for its own sink edge, and
//     forwards the rest to the trusted seeds (tmetric.c: tmetric_find_node("-"),
//     net_flow_add_edge("-", seed));
//   • distances come from a breadth-first search from that source, and a node
//     at distance d gets caps[d]; past the end of the schedule the last entry
//     persists (net_flow_assign_capacities: `if (iter_num < n_caps) cap = ...`);
//   • every node v is split into v_in and v_out with capacity c(v) − 1 on the
//     in→out edge and 1 on the in→sink edge (the TWEAK in net_flow_max_flow:
//     `capacity[i]--` plus node_sink ∈ {0, 1}); certification edges run
//     u_out → v_in with no capacity limit;
//   • augmenting paths are found by breadth-first search over the residual
//     graph, in the same visiting order as net_flow_augment, and the first
//     in-node reached whose sink edge is empty is the one that gets a unit.
//
// One simplification, stated once here and again in the app: the reference
// warms the flow up with a greedy tree (net_flow_assign_tree /
// net_flow_from_tree) before augmenting. We start from zero flow. The maximum
// flow value is the same either way; only which of several equally valid
// accepted sets comes out can differ, and no tie-break is a trust judgement.
//
// Everything here is pure: graphs in, results out, deterministic for a given
// insertion order of accounts and certifications.

export const LEVEL_NAMES = ['None', 'Apprentice', 'Journeyer', 'Master']
export const LEVELS = [1, 2, 3]
export const SOURCE = 0 // node index of the synthetic source, as in tmetric.c

export function levelName(level) {
  return LEVEL_NAMES[level] ?? 'None'
}

// ─────────────────────────────────────────────────────── graph → flow network

// Build the per-threshold network: node 0 is the source, then every account in
// insertion order; edges are source→seed (seeds in account order) followed by
// every certification at `threshold` or above, in insertion order. Self-certs
// are dropped the way net_flow_init_graph drops self-edges.
export function buildNetwork(graph, threshold) {
  const nodes = [{ id: null, name: '-', source: true }]
  const indexOf = new Map()
  for (const a of graph.accounts) {
    indexOf.set(a.id, nodes.length)
    nodes.push(a)
  }
  const edges = []
  const outEdges = nodes.map(() => [])
  const inEdges = nodes.map(() => [])
  const kept = []
  const dropped = []
  function addEdge(src, dst, cert) {
    const e = edges.length
    edges.push({ src, dst, cert })
    outEdges[src].push(e)
    inEdges[dst].push(e)
  }
  for (const a of graph.accounts) if (a.seed) addEdge(SOURCE, indexOf.get(a.id), null)
  for (const c of graph.certs) {
    if (c.level < threshold) {
      dropped.push(c.id)
      continue
    }
    kept.push(c.id)
    if (c.from === c.to) continue
    addEdge(indexOf.get(c.from), indexOf.get(c.to), c.id)
  }
  return { threshold, nodes, indexOf, edges, outEdges, inEdges, kept, dropped }
}

function findEdge(net, src, dst) {
  for (const e of net.inEdges[dst]) if (net.edges[e].src === src) return e
  throw new Error(`no edge ${src}→${dst}`)
}

// ──────────────────────────────────────────────────────── distances/capacities

// Breadth-first search from the source. Returns dist[] and cap[] (−1 where
// unreachable, like the reference) and the BFS layers for stepping through.
export function assignCapacities(net, caps) {
  if (!Array.isArray(caps) || caps.length === 0) throw new Error('capacity schedule is empty')
  const n = net.nodes.length
  const dist = new Array(n).fill(-1)
  const cap = new Array(n).fill(-1)
  const layers = []
  let frontier = [SOURCE]
  let c = caps[0]
  dist[SOURCE] = 0
  cap[SOURCE] = c
  layers.push({ d: 0, cap: c, nodes: [SOURCE] })
  for (let d = 1; frontier.length > 0; d++) {
    if (d < caps.length) c = caps[d]
    const next = []
    for (const ix of frontier) {
      for (const e of net.outEdges[ix]) {
        const succ = net.edges[e].dst
        if (dist[succ] === -1) {
          dist[succ] = d
          cap[succ] = c
          next.push(succ)
        }
      }
    }
    if (next.length > 0) layers.push({ d, cap: c, nodes: next })
    frontier = next
  }
  return { dist, cap, layers }
}

// Capacity of v_in → v_out after the reference's TWEAK: c(v) − 1, and nothing
// at all for an unreachable node (its capacity is −1, which the reference
// decrements to −2 and never lets any flow through).
export function throughCapacity(cap) {
  return cap < 1 ? 0 : cap - 1
}

// ───────────────────────────────────────────────────────────────── max flow

export function emptyFlow(net) {
  const n = net.nodes.length
  return {
    nodeFlow: new Array(n).fill(0), // units on v_in → v_out ("forwarded")
    nodeSink: new Array(n).fill(0), // units on v_in → sink ("consumed"), 0 or 1
    edgeFlow: new Array(net.edges.length).fill(0),
  }
}

export function cloneFlow(st) {
  return { nodeFlow: st.nodeFlow.slice(), nodeSink: st.nodeSink.slice(), edgeFlow: st.edgeFlow.slice() }
}

// One augmentation, mirroring net_flow_augment with TWEAK on. Breadth-first
// over the residual graph starting at source_in; queue entries are (node,
// side) with side false = in, true = out. The first in-node dequeued whose
// sink edge is empty ends the search and the path back to the source is
// augmented by one unit. Returns the path as a list of residual steps, in
// source→sink order, for display; mutates `st`.
export function augment(net, capThrough, st) {
  const n = net.nodes.length
  const visitedIn = new Uint8Array(n)
  const visitedOut = new Uint8Array(n)
  const queue = [{ node: SOURCE, out: false, pred: -1 }]
  visitedIn[SOURCE] = 1
  for (let qi = 0; qi < queue.length; qi++) {
    const { node, out } = queue[qi]
    if (!out && st.nodeSink[node] === 0) {
      st.nodeSink[node] = 1
      const path = [{ kind: 'sink', node }]
      let cur = qi
      while (queue[cur].pred !== -1) {
        const entry = queue[cur]
        const prev = queue[entry.pred]
        if (prev.node === entry.node) {
          if (entry.out) {
            st.nodeFlow[entry.node]++
            path.push({ kind: 'through', node: entry.node, dir: 1 })
          } else {
            st.nodeFlow[entry.node]--
            path.push({ kind: 'through', node: entry.node, dir: -1 })
          }
        } else if (!entry.out) {
          const e = findEdge(net, prev.node, entry.node)
          st.edgeFlow[e]++
          path.push({ kind: 'edge', edge: e, dir: 1 })
        } else {
          const e = findEdge(net, entry.node, prev.node)
          st.edgeFlow[e]--
          path.push({ kind: 'edge', edge: e, dir: -1 })
        }
        cur = entry.pred
      }
      path.push({ kind: 'start', node: SOURCE })
      return { found: true, node, path: path.reverse() }
    }
    if (!out) {
      if (st.nodeFlow[node] < capThrough[node] && !visitedOut[node]) {
        queue.push({ node, out: true, pred: qi })
        visitedOut[node] = 1
      }
      for (const e of net.inEdges[node]) {
        const src = net.edges[e].src
        if (!visitedOut[src] && st.edgeFlow[e] > 0) {
          queue.push({ node: src, out: true, pred: qi })
          visitedOut[src] = 1
        }
      }
    } else {
      if (st.nodeFlow[node] > 0 && !visitedIn[node]) {
        queue.push({ node, out: false, pred: qi })
        visitedIn[node] = 1
      }
      for (const e of net.outEdges[node]) {
        const dst = net.edges[e].dst
        if (!visitedIn[dst]) {
          queue.push({ node: dst, out: false, pred: qi })
          visitedIn[dst] = 1
        }
      }
    }
  }
  return { found: false }
}

// Which (node, side) pairs the source can still reach in the residual graph.
// After the last augmentation this is the source side of a minimum cut, which
// is what explains a rejected-but-reachable account.
export function residualReach(net, capThrough, st) {
  const n = net.nodes.length
  const inR = new Uint8Array(n)
  const outR = new Uint8Array(n)
  const queue = [{ node: SOURCE, out: false }]
  inR[SOURCE] = 1
  for (let qi = 0; qi < queue.length; qi++) {
    const { node, out } = queue[qi]
    if (!out) {
      if (st.nodeFlow[node] < capThrough[node] && !outR[node]) {
        outR[node] = 1
        queue.push({ node, out: true })
      }
      for (const e of net.inEdges[node]) {
        const src = net.edges[e].src
        if (!outR[src] && st.edgeFlow[e] > 0) {
          outR[src] = 1
          queue.push({ node: src, out: true })
        }
      }
    } else {
      if (st.nodeFlow[node] > 0 && !inR[node]) {
        inR[node] = 1
        queue.push({ node, out: false })
      }
      for (const e of net.outEdges[node]) {
        const dst = net.edges[e].dst
        if (!inR[dst]) {
          inR[dst] = 1
          queue.push({ node: dst, out: false })
        }
      }
    }
  }
  return { inR, outR }
}

// Run the metric at one threshold. With `trace` on, every intermediate state
// is kept so a UI can step through it.
export function runLevel(graph, caps, threshold, { trace = false } = {}) {
  const net = buildNetwork(graph, threshold)
  const { dist, cap, layers } = assignCapacities(net, caps)
  const capThrough = cap.map(throughCapacity)
  const st = emptyFlow(net)
  const augmentations = []
  for (;;) {
    const r = augment(net, capThrough, st)
    if (!r.found) break
    augmentations.push({ node: r.node, path: r.path, after: trace ? cloneFlow(st) : null })
  }
  const accepted = st.nodeSink.map((s) => s === 1)
  const reach = residualReach(net, capThrough, st)
  const totalFlow = st.nodeSink.reduce((a, b) => a + b, 0)
  return { threshold, net, caps: caps.slice(), dist, cap, capThrough, layers, flow: st, augmentations, accepted, reach, totalFlow }
}

// Run every level and report, per account, the highest level at which it was
// accepted — tmetric_run overwrites `level = i` for i ascending, so the last
// (highest) accepting level wins even if a lower one happened to reject.
export function runAll(graph, caps, opts) {
  const perLevel = [null]
  for (const L of LEVELS) perLevel.push(runLevel(graph, caps, L, opts))
  const level = new Map()
  for (const a of graph.accounts) {
    let best = 0
    for (const L of LEVELS) {
      const r = perLevel[L]
      if (r.accepted[r.net.indexOf.get(a.id)]) best = L
    }
    level.set(a.id, best)
  }
  return { perLevel, level }
}

// ──────────────────────────────────────────────────────────── explanations

// Why is a reachable account not accepted? Because no augmenting path remains,
// every certification path from the source to it crosses at least one account
// that forwards all it can (certification edges are unlimited, so only the
// through-edges can be full). `saturated` lists those accounts on one shortest
// certification path, with the path itself so the reader can follow the units
// and watch them run out. `cut` is the source side of the minimum cut, which is
// the global version of the same fact; the app shows the path-local one.
export function explainRejection(result, nodeIx) {
  const { net, dist, capThrough, flow, reach } = result
  if (dist[nodeIx] < 0) return { kind: 'unreachable' }
  if (flow.nodeSink[nodeIx] === 1) return { kind: 'accepted' }
  // ancestors of nodeIx in the kept graph
  const anc = new Uint8Array(net.nodes.length)
  const stack = [nodeIx]
  anc[nodeIx] = 1
  while (stack.length) {
    const v = stack.pop()
    for (const e of net.inEdges[v]) {
      const u = net.edges[e].src
      if (!anc[u]) {
        anc[u] = 1
        stack.push(u)
      }
    }
  }
  const bottlenecks = []
  for (let u = 0; u < net.nodes.length; u++) {
    if (anc[u] && reach.inR[u] && !reach.outR[u] && flow.nodeFlow[u] >= capThrough[u]) bottlenecks.push(u)
  }
  // one shortest path source → nodeIx (BFS in insertion order)
  const pred = new Array(net.nodes.length).fill(-1)
  pred[SOURCE] = SOURCE
  const q = [SOURCE]
  for (let qi = 0; qi < q.length && pred[nodeIx] === -1; qi++) {
    for (const e of net.outEdges[q[qi]]) {
      const v = net.edges[e].dst
      if (pred[v] === -1) {
        pred[v] = q[qi]
        q.push(v)
      }
    }
  }
  const path = []
  for (let v = nodeIx; v !== SOURCE; v = pred[v]) path.push(v)
  path.push(SOURCE)
  path.reverse()
  // the account itself is excluded: its own through-edge is irrelevant to whether
  // its sink edge gets a unit
  const saturated = path.filter((v) => v !== nodeIx && flow.nodeFlow[v] >= capThrough[v])
  return { kind: 'rejected', saturated, cut: bottlenecks, path }
}

// ─────────────────────────────────────────────────────────── sanity checks

// The invariants net_flow_sanity_check enforces, plus the ones a reader of
// the app cares about. Returns a list of problem strings; empty means sound.
export function checkFlow(result) {
  const { net, cap, capThrough, flow, dist } = result
  const problems = []
  const n = net.nodes.length
  for (let e = 0; e < net.edges.length; e++) if (flow.edgeFlow[e] < 0) problems.push(`edge ${e} has negative flow`)
  for (let v = 0; v < n; v++) {
    const name = net.nodes[v].name
    if (flow.nodeSink[v] !== 0 && flow.nodeSink[v] !== 1) problems.push(`${name}: sink flow ${flow.nodeSink[v]} is not 0 or 1`)
    if (flow.nodeFlow[v] < 0) problems.push(`${name}: negative through-flow`)
    if (flow.nodeFlow[v] > capThrough[v]) problems.push(`${name}: forwards ${flow.nodeFlow[v]} over its limit ${capThrough[v]}`)
    if (dist[v] < 0 && (flow.nodeSink[v] !== 0 || flow.nodeFlow[v] !== 0)) problems.push(`${name}: unreachable but carries flow`)
    if (cap[v] >= 0 && flow.nodeSink[v] + flow.nodeFlow[v] > cap[v]) problems.push(`${name}: uses more than c(v)`)
    let inFlow = 0
    for (const e of net.inEdges[v]) inFlow += flow.edgeFlow[e]
    if (v !== SOURCE && inFlow !== flow.nodeSink[v] + flow.nodeFlow[v])
      problems.push(`${name}: in-node conservation fails (${inFlow} in, ${flow.nodeSink[v]} to sink + ${flow.nodeFlow[v]} through)`)
    let outFlow = 0
    for (const e of net.outEdges[v]) outFlow += flow.edgeFlow[e]
    if (outFlow !== flow.nodeFlow[v]) problems.push(`${name}: out-node conservation fails (${flow.nodeFlow[v]} through, ${outFlow} out)`)
  }
  const sinks = flow.nodeSink.reduce((a, b) => a + b, 0)
  if (sinks !== flow.nodeSink[SOURCE] + flow.nodeFlow[SOURCE]) problems.push('total sink flow does not match what leaves the source')
  return problems
}

// ───────────────────────────────────────────────── EigenTrust, for contrast

// Kamvar, Schlosser & Garcia-Molina (WWW 2003). Local trust s_ij = 1 for a
// certification i→j at or above the threshold; c_ij = s_ij / Σ_j s_ij, or the
// pre-trust distribution p when i certifies nobody (their eq. 4); p is uniform
// over the seeds (their "pre-trusted peers"). Iterate
//   t ← (1 − α) Cᵀ t + α p
// from t = p. α is left open in the paper; the app exposes it.
export function eigenTrust(graph, threshold, { alpha = 0.15, iterations = 100 } = {}) {
  const ids = graph.accounts.map((a) => a.id)
  const n = ids.length
  if (n === 0) return { scores: new Map(), alpha, iterations: 0 }
  const ix = new Map(ids.map((id, i) => [id, i]))
  const seeds = graph.accounts.filter((a) => a.seed).map((a) => ix.get(a.id))
  const p = new Array(n).fill(0)
  if (seeds.length > 0) for (const s of seeds) p[s] = 1 / seeds.length
  else for (let i = 0; i < n; i++) p[i] = 1 / n
  const out = Array.from({ length: n }, () => new Set())
  for (const c of graph.certs) if (c.level >= threshold && c.from !== c.to) out[ix.get(c.from)].add(ix.get(c.to))
  let t = p.slice()
  let it = 0
  for (; it < iterations; it++) {
    const next = new Array(n).fill(0)
    for (let i = 0; i < n; i++) {
      if (out[i].size === 0) {
        for (let j = 0; j < n; j++) next[j] += t[i] * p[j]
      } else {
        const share = t[i] / out[i].size
        for (const j of out[i]) next[j] += share
      }
    }
    let delta = 0
    for (let j = 0; j < n; j++) {
      next[j] = (1 - alpha) * next[j] + alpha * p[j]
      delta += Math.abs(next[j] - t[j])
    }
    t = next
    if (delta < 1e-12) {
      it++
      break
    }
  }
  const scores = new Map()
  ids.forEach((id, i) => scores.set(id, t[i]))
  return { scores, alpha, iterations: it }
}

// ────────────────────────────────────────────────────── graph construction

// A tiny builder so scenarios and tests read as prose: names in, ids out.
export function makeGraph() {
  const g = { accounts: [], certs: [], nextId: 1 }
  const byName = new Map()
  const api = {
    graph: g,
    account(name, opts = {}) {
      const a = { id: g.nextId++, name, seed: !!opts.seed, x: opts.x ?? 0, y: opts.y ?? 0, tag: opts.tag ?? null }
      g.accounts.push(a)
      byName.set(name, a.id)
      return a.id
    },
    id(name) {
      const id = byName.get(name)
      if (id == null) throw new Error(`no account named ${name}`)
      return id
    },
    cert(from, to, level = 2) {
      const f = typeof from === 'string' ? api.id(from) : from
      const t = typeof to === 'string' ? api.id(to) : to
      const existing = g.certs.find((c) => c.from === f && c.to === t)
      if (existing) {
        existing.level = level
        return existing.id
      }
      const c = { id: g.nextId++, from: f, to: t, level }
      g.certs.push(c)
      return c.id
    },
  }
  return api
}
