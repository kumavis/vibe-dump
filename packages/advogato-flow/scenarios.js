// scenarios.js — the four guided scenarios, as data.
//
// Each scenario builds a graph with readable positions (viewBox 960×600), a
// capacity schedule, a threshold to open on, and optional *actions* that
// change the graph the way an attacker or a growing community would. The
// `tag` on an account is a label for the demonstration only — "fake", "bad",
// "confused" — it is never an input to the metric, which sees nothing but
// accounts, certifications and seeds.

import { makeGraph } from './metric.js'

const A = 1
const J = 2
const M = 3

export const SCENARIOS = [
  {
    key: 'community',
    title: 'Small community',
    lesson: 'Follow one unit from a seed to an accepted account.',
    caps: [8, 6, 3, 2, 1],
    threshold: J,
    focus: 'Eli',
    intro:
      'Ada is the only trusted seed. The synthetic source hands Ada one unit for herself and five to forward; each hop away from the seed the schedule gives less. Step through the computation and watch a single unit travel source → Ada → Bea → Dev → Eli. Switch the threshold to Master and most of the graph becomes unreachable; switch to Apprentice and Fil joins.',
    build() {
      const g = makeGraph()
      g.account('Ada', { seed: true, x: 150, y: 300 })
      g.account('Bea', { x: 340, y: 170 })
      g.account('Cal', { x: 340, y: 430 })
      g.account('Dev', { x: 540, y: 300 })
      g.account('Eli', { x: 740, y: 300 })
      g.account('Fil', { x: 560, y: 500 })
      g.cert('Ada', 'Bea', M)
      g.cert('Ada', 'Cal', J)
      g.cert('Bea', 'Dev', J)
      g.cert('Cal', 'Dev', A)
      g.cert('Dev', 'Eli', J)
      g.cert('Cal', 'Fil', A)
      return g.graph
    },
    actions: [],
  },
  {
    key: 'bottleneck',
    title: 'Bottleneck',
    lesson: 'More reachable accounts can compete for limited capacity.',
    caps: [8, 7, 3, 1],
    threshold: J,
    focus: 'Ed',
    intro:
      'Bo is at distance 2, so the schedule gives Bo capacity 3: one unit for Bo, two to forward. Bo certifies four people. All four are reachable, all four have a certification path from the seed, and only two of them can be accepted. Select a rejected account to see the bottleneck. Which two win is a tie-break of the flow computation, not a judgement about the people.',
    build() {
      const g = makeGraph()
      g.account('Ada', { seed: true, x: 130, y: 300 })
      g.account('Bo', { x: 380, y: 300 })
      g.account('Gus', { x: 300, y: 520 })
      g.account('Cy', { x: 660, y: 120 })
      g.account('Di', { x: 700, y: 250 })
      g.account('Ed', { x: 700, y: 380 })
      g.account('Flo', { x: 660, y: 510 })
      g.cert('Ada', 'Bo', J)
      g.cert('Ada', 'Gus', J)
      g.cert('Bo', 'Cy', J)
      g.cert('Bo', 'Di', J)
      g.cert('Bo', 'Ed', J)
      g.cert('Bo', 'Flo', J)
      return g.graph
    },
    actions: [
      {
        label: 'Give Bo more capacity (distance-2 entry 3 → 5)',
        kind: 'caps',
        apply(ctx) {
          ctx.caps[2] = 5
        },
        note: 'Raising the schedule at distance 2 lets Bo forward four units, so all four of Bo\'s certifications can be accepted — until the next bottleneck.',
      },
    ],
  },
  {
    key: 'sybil',
    title: 'Fake-account cluster',
    lesson: 'Adding identities and internal endorsements cannot overcome a fixed incoming bottleneck.',
    caps: [12, 9, 5, 3, 2, 1],
    threshold: J,
    focus: 'Mal',
    intro:
      'Di, an honest account, has been fooled into certifying Mal. Mal has created fake accounts that all certify Mal and one another at Master level. The only certification entering the cluster is Di → Mal, and Di can forward at most two units. However many fakes Mal adds, the cluster can never hold more than those two admission slots. The "fake" labels are drawn for you; the algorithm never sees them.',
    build() {
      const g = makeGraph()
      g.account('Ada', { seed: true, x: 110, y: 300 })
      g.account('Bo', { x: 270, y: 170 })
      g.account('Cy', { x: 270, y: 430 })
      g.account('Eve', { x: 420, y: 530 })
      g.account('Di', { x: 440, y: 300 })
      g.account('Mal', { x: 620, y: 300, tag: 'fake' })
      g.account('F1', { x: 790, y: 150, tag: 'fake' })
      g.account('F2', { x: 850, y: 320, tag: 'fake' })
      g.account('F3', { x: 790, y: 480, tag: 'fake' })
      g.cert('Ada', 'Bo', J)
      g.cert('Ada', 'Cy', J)
      g.cert('Bo', 'Di', J)
      g.cert('Cy', 'Di', J)
      g.cert('Cy', 'Eve', J)
      g.cert('Di', 'Mal', J)
      for (const f of ['F1', 'F2', 'F3']) {
        g.cert('Mal', f, M)
        g.cert(f, 'Mal', M)
      }
      g.cert('F1', 'F2', M)
      g.cert('F2', 'F3', M)
      g.cert('F3', 'F1', M)
      return g.graph
    },
    actions: [
      {
        label: 'Add a fake account',
        kind: 'graph',
        apply(ctx) {
          const fakes = ctx.graph.accounts.filter((a) => a.tag === 'fake' && a.name !== 'Mal')
          const n = fakes.length + 1
          const angle = -Math.PI / 2 + (n - 1) * 0.9
          const id = addAccount(ctx.graph, `F${n}`, {
            x: Math.round(700 + 150 * Math.cos(angle)),
            y: Math.round(310 + 190 * Math.sin(angle)),
            tag: 'fake',
          })
          const mal = ctx.graph.accounts.find((a) => a.name === 'Mal')
          addCert(ctx.graph, mal.id, id, M)
          addCert(ctx.graph, id, mal.id, M)
          for (const f of fakes) {
            addCert(ctx.graph, f.id, id, M)
            addCert(ctx.graph, id, f.id, M)
          }
        },
        note: 'Another identity, certified by every member of the cluster and certifying them back. The cluster\'s accepted count does not move.',
      },
    ],
  },
  {
    key: 'shortcut',
    title: 'Shortcut attack',
    lesson: 'New paths can shorten distances and increase capacities, weakening claims based on capacities before the attack.',
    caps: [40, 24, 20, 7, 3, 1],
    threshold: J,
    focus: 'Y2',
    intro:
      'Before the attack, Y1–Y3 sit at distance 5 with capacity 1: they are accepted, but can forward nothing, so the "bad" accounts they certify are rejected. A bound computed from those capacities says the attacker gets at most three slots through them. Then the attacker creates an account, Mal, obtains one certification for it from Bo, near the seed, and certifies Y1–Y3 from it. Their distance drops to 4, their capacity triples, and the units their honest certifiers had to spare now reach the bad accounts. This is the distance-shortening attack described by Jesse Ruderman (2005).',
    build() {
      const g = makeGraph()
      g.account('Ada', { seed: true, x: 70, y: 300 })
      g.account('Bo', { x: 200, y: 300 })
      g.account('Cy', { x: 330, y: 300 })
      g.account('H1', { x: 470, y: 130 })
      g.account('H2', { x: 470, y: 300 })
      g.account('H3', { x: 470, y: 470 })
      g.account('Y1', { x: 620, y: 130, tag: 'confused' })
      g.account('Y2', { x: 620, y: 300, tag: 'confused' })
      g.account('Y3', { x: 620, y: 470, tag: 'confused' })
      g.account('B1', { x: 790, y: 80, tag: 'bad' })
      g.account('B2', { x: 790, y: 180, tag: 'bad' })
      g.account('B3', { x: 790, y: 260, tag: 'bad' })
      g.account('B4', { x: 790, y: 350, tag: 'bad' })
      g.account('B5', { x: 790, y: 430, tag: 'bad' })
      g.account('B6', { x: 790, y: 530, tag: 'bad' })
      g.cert('Ada', 'Bo', M)
      g.cert('Bo', 'Cy', M)
      g.cert('Cy', 'H1', J)
      g.cert('Cy', 'H2', J)
      g.cert('Cy', 'H3', J)
      g.cert('H1', 'Y1', J)
      g.cert('H2', 'Y2', J)
      g.cert('H3', 'Y3', J)
      g.cert('Y1', 'B1', J)
      g.cert('Y1', 'B2', J)
      g.cert('Y2', 'B3', J)
      g.cert('Y2', 'B4', J)
      g.cert('Y3', 'B5', J)
      g.cert('Y3', 'B6', J)
      return g.graph
    },
    actions: [
      {
        label: 'Apply the attack: add Mal, Bo → Mal, Mal → Y1–Y3',
        kind: 'graph',
        once: true,
        apply(ctx) {
          const by = (n) => ctx.graph.accounts.find((a) => a.name === n)
          const mal = by('Mal')?.id ?? addAccount(ctx.graph, 'Mal', { x: 330, y: 70, tag: 'attacker' })
          addCert(ctx.graph, by('Bo').id, mal, J)
          for (const y of ['Y1', 'Y2', 'Y3']) addCert(ctx.graph, mal, by(y).id, J)
        },
        note: 'One new account and four new certifications. Compare the distance and capacity of Y1–Y3, and the accepted count among the accounts labelled "bad", before and after.',
      },
    ],
  },
]

export function findScenario(key) {
  return SCENARIOS.find((s) => s.key === key) ?? SCENARIOS[0]
}

// ─────────────────────────────────────────── graph edits shared with the UI

export function addAccount(graph, name, opts = {}) {
  const a = { id: graph.nextId++, name, seed: !!opts.seed, x: opts.x ?? 480, y: opts.y ?? 300, tag: opts.tag ?? null }
  graph.accounts.push(a)
  return a.id
}

export function addCert(graph, from, to, level) {
  if (from === to) return null
  const existing = graph.certs.find((c) => c.from === from && c.to === to)
  if (existing) {
    existing.level = level
    return existing.id
  }
  const c = { id: graph.nextId++, from, to, level }
  graph.certs.push(c)
  return c.id
}

export function removeAccount(graph, id) {
  graph.accounts = graph.accounts.filter((a) => a.id !== id)
  graph.certs = graph.certs.filter((c) => c.from !== id && c.to !== id)
}

export function removeCert(graph, id) {
  graph.certs = graph.certs.filter((c) => c.id !== id)
}

export function cloneGraph(graph) {
  return {
    accounts: graph.accounts.map((a) => ({ ...a })),
    certs: graph.certs.map((c) => ({ ...c })),
    nextId: graph.nextId,
  }
}

// A fresh name that is not in use: Acct 1, Acct 2, …
export function freshName(graph) {
  const used = new Set(graph.accounts.map((a) => a.name))
  for (let i = 1; ; i++) if (!used.has(`N${i}`)) return `N${i}`
}
