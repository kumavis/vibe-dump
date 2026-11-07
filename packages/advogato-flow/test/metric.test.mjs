import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  runLevel,
  runAll,
  checkFlow,
  makeGraph,
  explainRejection,
  eigenTrust,
  SOURCE,
  throughCapacity,
} from '../metric.js'
import { SCENARIOS, findScenario, cloneGraph } from '../scenarios.js'

// ─────────────────────────────────────────── an independent max-flow oracle
// Plain Edmonds–Karp on an explicit expanded network with explicit
// capacities: v_in→v_out c(v)−1, v_in→sink 1, u_out→v_in "unlimited" (a big
// number). Shares nothing with metric.js except the graph, so agreement on the
// flow *value* is real evidence that the port is right.
function oracleMaxFlow(graph, caps, threshold) {
  const names = ['-', ...graph.accounts.map((a) => a.name)]
  const ix = new Map(graph.accounts.map((a, i) => [a.id, i + 1]))
  const n = names.length
  const adj = []
  for (let i = 0; i < n; i++) adj.push([])
  const seeds = graph.accounts.filter((a) => a.seed).map((a) => ix.get(a.id))
  const certs = graph.certs.filter((c) => c.level >= threshold && c.from !== c.to).map((c) => [ix.get(c.from), ix.get(c.to)])
  for (const s of seeds) adj[0].push(s)
  for (const [u, v] of certs) adj[u].push(v)
  // BFS distances
  const dist = new Array(n).fill(-1)
  dist[0] = 0
  const q = [0]
  for (let qi = 0; qi < q.length; qi++) for (const v of adj[q[qi]]) if (dist[v] < 0) { dist[v] = dist[q[qi]] + 1; q.push(v) }
  const capOf = (d) => (d < 0 ? -1 : caps[Math.min(d, caps.length - 1)])
  // expanded network: node 2i = in, 2i+1 = out, sink = 2n, source = 0 (in of node 0)
  const N = 2 * n + 1
  const SINK = 2 * n
  const C = Array.from({ length: N }, () => new Map())
  const add = (a, b, c) => C[a].set(b, (C[a].get(b) ?? 0) + c)
  for (let i = 0; i < n; i++) {
    const c = capOf(dist[i])
    if (c < 0) continue
    add(2 * i, 2 * i + 1, Math.max(c - 1, 0))
    add(2 * i, SINK, 1)
  }
  for (const s of seeds) add(1, 2 * s, 1e6)
  for (const [u, v] of certs) add(2 * u + 1, 2 * v, 1e6)
  const F = Array.from({ length: N }, () => new Map())
  const res = (a, b) => (C[a].get(b) ?? 0) - (F[a].get(b) ?? 0) + (F[b].get(a) ?? 0)
  let flow = 0
  for (;;) {
    const pred = new Array(N).fill(-1)
    pred[0] = 0
    const bq = [0]
    for (let qi = 0; qi < bq.length && pred[SINK] === -1; qi++) {
      const a = bq[qi]
      const nbrs = new Set([...C[a].keys(), ...F[a].keys()])
      for (let b = 0; b < N; b++) if (pred[b] === -1 && (nbrs.has(b) || C[b].has(a)) && res(a, b) > 0) { pred[b] = a; bq.push(b) }
    }
    if (pred[SINK] === -1) break
    let bott = Infinity
    for (let v = SINK; v !== 0; v = pred[v]) bott = Math.min(bott, res(pred[v], v))
    for (let v = SINK; v !== 0; v = pred[v]) {
      const u = pred[v]
      const back = F[v].get(u) ?? 0
      if (back > 0) {
        const cancel = Math.min(back, bott)
        F[v].set(u, back - cancel)
        if (cancel < bott) F[u].set(v, (F[u].get(v) ?? 0) + bott - cancel)
      } else F[u].set(v, (F[u].get(v) ?? 0) + bott)
    }
    flow += bott
  }
  return { flow, dist, names }
}

function byName(result, name) {
  const ix = result.net.nodes.findIndex((nd) => nd.name === name)
  assert.ok(ix >= 0, `node ${name} exists`)
  return ix
}
function accepted(result, name) {
  return result.accepted[byName(result, name)]
}

// A deterministic PRNG so the random graphs are the same on every run.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}
function randomGraph(seed) {
  const r = rng(seed)
  const g = makeGraph()
  const n = 4 + Math.floor(r() * 12)
  for (let i = 0; i < n; i++) g.account(`n${i}`, { seed: r() < 0.25 })
  const m = Math.floor(r() * n * 3)
  for (let i = 0; i < m; i++) g.cert(`n${Math.floor(r() * n)}`, `n${Math.floor(r() * n)}`, 1 + Math.floor(r() * 3))
  const caps = []
  const len = 1 + Math.floor(r() * 5)
  for (let i = 0; i < len; i++) caps.push(1 + Math.floor(r() * 6))
  return { graph: g.graph, caps }
}

// ──────────────────────────────────────────────────────────── invariants

test('flow obeys capacities and conservation on every scenario and threshold', () => {
  for (const s of SCENARIOS) {
    const graph = s.build()
    for (const L of [1, 2, 3]) {
      const r = runLevel(graph, s.caps, L)
      assert.deepEqual(checkFlow(r), [], `${s.key} @${L}`)
    }
  }
})

test('random graphs: invariants hold and the flow value matches an independent max-flow', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const { graph, caps } = randomGraph(seed)
    for (const L of [1, 2, 3]) {
      const r = runLevel(graph, caps, L)
      assert.deepEqual(checkFlow(r), [], `seed ${seed} @${L}`)
      const o = oracleMaxFlow(graph, caps, L)
      assert.equal(r.totalFlow, o.flow, `seed ${seed} @${L}: flow value`)
      assert.deepEqual(r.dist, o.dist, `seed ${seed} @${L}: distances`)
    }
  }
})

test('each accepted account consumes exactly one sink unit; total flow counts them', () => {
  for (const s of SCENARIOS) {
    const r = runLevel(s.build(), s.caps, s.threshold)
    let count = 0
    r.accepted.forEach((ok, v) => {
      assert.equal(r.flow.nodeSink[v], ok ? 1 : 0)
      if (ok) count++
    })
    assert.equal(r.totalFlow, count)
    assert.equal(r.flow.nodeSink[SOURCE], 1, 'the synthetic source takes one unit for itself, as in the reference')
  }
})

test('unreachable accounts are never accepted and carry no flow', () => {
  for (let seed = 300; seed < 400; seed++) {
    const { graph, caps } = randomGraph(seed)
    for (const L of [1, 2, 3]) {
      const r = runLevel(graph, caps, L)
      r.dist.forEach((d, v) => {
        if (d < 0) {
          assert.equal(r.accepted[v], false)
          assert.equal(r.flow.nodeFlow[v], 0)
          assert.equal(r.cap[v], -1)
        }
      })
    }
  }
  // and explicitly: no seeds at all means nobody is reachable
  const g = makeGraph()
  g.account('a')
  g.account('b')
  g.cert('a', 'b', 3)
  const r = runLevel(g.graph, [5, 5], 1)
  assert.equal(r.totalFlow, 1, 'only the source itself')
  assert.equal(accepted(r, 'a'), false)
  assert.equal(accepted(r, 'b'), false)
})

test('threshold filtering keeps only certifications at or above the level', () => {
  const s = findScenario('community')
  const graph = s.build()
  const all = runAll(graph, s.caps)
  const lvl = (name) => all.level.get(graph.accounts.find((a) => a.name === name).id)
  assert.equal(lvl('Ada'), 3)
  assert.equal(lvl('Bea'), 3, 'Ada → Bea is a Master cert')
  assert.equal(lvl('Cal'), 2)
  assert.equal(lvl('Dev'), 2)
  assert.equal(lvl('Eli'), 2)
  assert.equal(lvl('Fil'), 1, 'Cal → Fil is only Apprentice')
  const atJ = runLevel(graph, s.caps, 2)
  assert.equal(atJ.dist[byName(atJ, 'Fil')], -1, 'Fil is unreachable at Journeyer')
  assert.deepEqual(atJ.net.dropped.length, 2, 'two Apprentice certs dropped at Journeyer')
  const atM = runLevel(graph, s.caps, 3)
  assert.equal(atM.net.kept.length, 1)
})

test('capacity schedule: caps[d] by BFS distance, last entry persists, source gets caps[0]', () => {
  const g = makeGraph()
  g.account('s', { seed: true })
  g.account('a')
  g.account('b')
  g.account('c')
  g.cert('s', 'a')
  g.cert('a', 'b')
  g.cert('b', 'c')
  const r = runLevel(g.graph, [9, 7], 2)
  assert.equal(r.cap[SOURCE], 9)
  assert.equal(r.cap[byName(r, 's')], 7)
  assert.equal(r.cap[byName(r, 'a')], 7, 'beyond the schedule the last value persists')
  assert.equal(r.cap[byName(r, 'c')], 7)
  assert.equal(r.dist[byName(r, 'c')], 4)
  assert.equal(throughCapacity(7), 6)
  assert.equal(throughCapacity(1), 0)
  assert.equal(throughCapacity(-1), 0)
})

test('the source reserves one unit of caps[0] for itself: at most caps[0] − 1 accounts', () => {
  const g = makeGraph()
  for (let i = 0; i < 6; i++) g.account(`s${i}`, { seed: true })
  const r = runLevel(g.graph, [3, 5], 1)
  assert.equal(r.totalFlow, 3)
  assert.equal(r.accepted.filter(Boolean).length - 1, 2, 'two real accounts, plus the source')
})

test('identical inputs give identical results, including which accounts win a tie', () => {
  for (const s of SCENARIOS) {
    const a = runAll(s.build(), s.caps, { trace: true })
    const b = runAll(s.build(), s.caps, { trace: true })
    for (const L of [1, 2, 3]) {
      assert.deepEqual(a.perLevel[L].accepted, b.perLevel[L].accepted)
      assert.deepEqual(a.perLevel[L].flow, b.perLevel[L].flow)
      assert.deepEqual(
        a.perLevel[L].augmentations.map((x) => x.path),
        b.perLevel[L].augmentations.map((x) => x.path),
      )
    }
  }
})

// ───────────────────────────────────────────────────────── the four lessons

test('small community: every reachable account is accepted at Journeyer', () => {
  const s = findScenario('community')
  const r = runLevel(s.build(), s.caps, 2)
  for (const name of ['Ada', 'Bea', 'Cal', 'Dev', 'Eli']) assert.equal(accepted(r, name), true, name)
  assert.equal(accepted(r, 'Fil'), false)
  assert.equal(r.flow.nodeFlow[byName(r, 'Ada')], 4, 'Ada forwards four of c−1 = 5')
})

test('bottleneck: four reachable accounts, two admission slots, rejected ones name Bo', () => {
  const s = findScenario('bottleneck')
  const r = runLevel(s.build(), s.caps, 2)
  const leaves = ['Cy', 'Di', 'Ed', 'Flo']
  const won = leaves.filter((n) => accepted(r, n))
  assert.equal(won.length, 2)
  for (const n of leaves) {
    const ix = byName(r, n)
    assert.equal(r.dist[ix], 3, `${n} is reachable at distance 3`)
    if (!accepted(r, n)) {
      const why = explainRejection(r, ix)
      assert.equal(why.kind, 'rejected')
      assert.deepEqual(why.saturated.map((b) => r.net.nodes[b].name), ['Bo'])
      assert.deepEqual(why.cut.map((b) => r.net.nodes[b].name), ['Bo'])
      assert.deepEqual(why.path.map((b) => r.net.nodes[b].name), ['-', 'Ada', 'Bo', n])
    }
  }
  const bo = byName(r, 'Bo')
  assert.equal(r.flow.nodeFlow[bo], 2, 'Bo forwards all of c−1 = 2')
  assert.equal(r.flow.nodeSink[bo], 1)
  // the scenario's action lifts the bottleneck
  const caps = s.caps.slice()
  s.actions[0].apply({ caps })
  const r2 = runLevel(s.build(), caps, 2)
  assert.equal(leaves.filter((n) => accepted(r2, n)).length, 4)
})

test('fake-account cluster: more fakes and more internal certs never breach the incoming bottleneck', () => {
  const s = findScenario('sybil')
  const graph = s.build()
  const clusterAccepted = (g) => {
    const r = runLevel(g, s.caps, 2)
    assert.deepEqual(checkFlow(r), [])
    return g.accounts.filter((a) => a.tag === 'fake' && r.accepted[r.net.indexOf.get(a.id)]).length
  }
  const before = clusterAccepted(graph)
  assert.equal(before, 2, 'Mal plus one fake: Di forwards two units and Di → Mal is the only way in')
  for (let i = 0; i < 10; i++) {
    s.actions[0].apply({ graph })
    assert.equal(clusterAccepted(graph), before, `after adding fake #${i + 1}`)
  }
  assert.equal(graph.accounts.filter((a) => a.tag === 'fake').length, 14)
  // honest accounts are unaffected
  const r = runLevel(graph, s.caps, 2)
  for (const n of ['Ada', 'Bo', 'Cy', 'Di', 'Eve']) assert.equal(accepted(r, n), true, n)
  const di = byName(r, 'Di')
  assert.equal(r.flow.nodeFlow[di], 2)
  const why = explainRejection(r, byName(r, 'F2'))
  assert.ok(why.kind === 'rejected' || why.kind === 'accepted')
  assert.equal(why.kind, 'rejected')
  assert.deepEqual(why.saturated.map((b) => r.net.nodes[b].name), ['Di', 'Mal'], 'the units run out at the single edge into the cluster')
  assert.deepEqual(why.cut.map((b) => r.net.nodes[b].name), ['Di'])
})

test('shortcut attack: a new path shortens Y1–Y3, triples their capacity, and admits the bad accounts', () => {
  const s = findScenario('shortcut')
  const graph = s.build()
  const before = runLevel(graph, s.caps, 2)
  for (const y of ['Y1', 'Y2', 'Y3']) {
    const ix = byName(before, y)
    assert.equal(before.dist[ix], 5)
    assert.equal(before.cap[ix], 1)
    assert.equal(before.accepted[ix], true)
  }
  const badBefore = graph.accounts.filter((a) => a.tag === 'bad' && before.accepted[before.net.indexOf.get(a.id)]).length
  assert.equal(badBefore, 0)
  const attacked = cloneGraph(graph)
  s.actions[0].apply({ graph: attacked })
  const after = runLevel(attacked, s.caps, 2)
  assert.deepEqual(checkFlow(after), [])
  for (const y of ['Y1', 'Y2', 'Y3']) {
    const ix = byName(after, y)
    assert.equal(after.dist[ix], 4)
    assert.equal(after.cap[ix], 3)
  }
  const badAfter = attacked.accounts.filter((a) => a.tag === 'bad' && after.accepted[after.net.indexOf.get(a.id)]).length
  assert.equal(badAfter, 6, 'all six B accounts')
  assert.equal(accepted(after, 'Mal'), true)
  // the honest accounts keep their slots
  for (const n of ['Ada', 'Bo', 'Cy', 'H1', 'H2', 'H3', 'Y1', 'Y2', 'Y3']) assert.equal(accepted(after, n), true, n)
})

test('EigenTrust: scores form a distribution and seeds get the pre-trust mass', () => {
  const s = findScenario('sybil')
  const graph = s.build()
  const { scores, alpha } = eigenTrust(graph, 2)
  const total = [...scores.values()].reduce((a, b) => a + b, 0)
  assert.ok(Math.abs(total - 1) < 1e-9)
  const ada = scores.get(graph.accounts.find((a) => a.name === 'Ada').id)
  assert.ok(ada >= alpha, 'the only seed holds at least α')
})
