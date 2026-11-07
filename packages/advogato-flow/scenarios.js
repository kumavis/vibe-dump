// scenarios.js — the four guided scenarios, as data.
//
// Each scenario builds a graph with readable positions (viewBox 960×600), a
// capacity schedule, a threshold to open on, a short "how to play", and
// optional *actions* that change the graph the way an attacker or a growing
// community would. The `tag` on an account is a label for the demonstration
// only — "fake", "bad", "confused", "attacker" — it is never an input to the
// metric, which sees nothing but accounts, certifications and seeds.
//
// All reader-facing text here is written in Simplified Technical English.

import { makeGraph } from './metric.js'

const A = 1
const J = 2
const M = 3

export const SCENARIOS = [
  {
    key: 'community',
    title: 'Small community',
    lesson: 'Follow 1 unit from a seed to an accepted account.',
    caps: [8, 6, 3, 2, 1],
    threshold: J,
    focus: 'Eli',
    intro:
      'Ada is the only trusted seed. The synthetic source gives Ada 1 unit for herself and 5 units to forward. The schedule gives less at each hop from the seed. Step through the computation and follow 1 unit along source → Ada → Bea → Dev → Eli. Set the threshold to Master, and most of the graph becomes unreachable. Set the threshold to Apprentice, and Fil joins.',
    play: [
      'The result is shown. Click <b>Reset</b>, then click <b>Step</b> to see the computation. At the augmenting paths, 1 unit moves along source → Ada → Bea → Dev → Eli.',
      'Select <b>Eli</b>: distance 4, capacity 1, 1 unit consumed, 0 units forwarded.',
      'Set the threshold to <b>Master</b>: only Ada → Bea remains. Set the threshold to <b>Apprentice</b>: Fil joins.',
    ],
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
    lesson: 'More reachable accounts compete for a limited capacity.',
    caps: [8, 7, 3, 1],
    threshold: J,
    focus: 'Ed',
    intro:
      'Bo is at distance 2, so the schedule gives Bo capacity 3: 1 unit for Bo, and 2 units to forward. Bo certifies 4 accounts. All 4 are reachable, and all 4 have a certification path from the seed. Only 2 of them can be accepted. Select a rejected account to see the bottleneck. The flow computation decides which 2 win. This is a tie-break, not a judgement about the accounts.',
    play: [
      'Four accounts depend on Bo. Two are accepted. <b>Ed</b> is selected. The inspector shows the reason: Bo forwards 2 of 2 units.',
      'Click <b>Reset</b>, then click <b>Step</b> through the augmenting paths. The 2 units that Bo forwards go to the first 2 accounts that the search reaches.',
      'Click <b>Give Bo more capacity</b> below. All 4 accounts get in.',
    ],
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
        label: 'Give Bo more capacity (distance 2: 3 → 5)',
        kind: 'caps',
        apply(ctx) {
          ctx.caps[2] = 5
        },
        note: 'A larger entry at distance 2 lets Bo forward 4 units. All 4 accounts that Bo certifies can be accepted, until the next bottleneck.',
      },
    ],
  },
  {
    key: 'sybil',
    title: 'Fake-account cluster',
    lesson: 'More identities and more internal certifications cannot pass a fixed incoming bottleneck.',
    caps: [12, 9, 5, 3, 2, 1],
    threshold: J,
    focus: 'Mal',
    intro:
      'Di is an honest account. Di has been tricked into certifying Mal. Mal has created fake accounts. The fake accounts certify Mal and each other at Master level. The only certification into the cluster is Di → Mal, and Di can forward at most 2 units. Mal can add many fakes, but the cluster can never get more than those 2 admission slots. The fake labels are for the reader. The algorithm does not see them.',
    play: [
      '<b>Mal</b> is selected: accepted, and it forwards 1 of 1 units. Select <b>F2</b>: reachable, rejected. The cluster has exactly 2 slots.',
      'Click <b>Add a fake account</b> below, several times. The accepted count in the notes stays at 2.',
      'Select the <b>Flow network</b> view. The only edge into the cluster is Di → Mal. It carries 2 units, and Di forwards 2 of 2 units.',
    ],
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
        note: 'One more identity. Each member of the cluster certifies it, and it certifies each member. The accepted count of the cluster does not change.',
      },
    ],
  },
  {
    key: 'shortcut',
    title: 'Shortcut attack',
    lesson: 'New paths can make distances shorter and capacities larger. Then a claim that uses the capacities from before the attack is not correct.',
    caps: [40, 24, 20, 7, 3, 1],
    threshold: J,
    focus: 'Y2',
    intro:
      'Before the attack, Y1–Y3 are at distance 5 with capacity 1. They are accepted, but they can forward nothing. Thus the bad accounts that they certify are rejected. A limit that uses those capacities says that the attacker gets at most 3 slots through them. Then the attacker creates an account, Mal. Mal gets 1 certification from Bo, near the seed, and Mal certifies Y1–Y3. Their distance decreases to 4, and their capacity triples. The units that their honest certifiers did not use now reach the bad accounts. This is the distance-shortening attack that Jesse Ruderman described in 2005.',
    play: [
      'Before the attack: <b>Y2</b> is selected. It is at distance 5 with capacity 1, and it forwards nothing. Select <b>B3</b>: reachable, rejected. The capacities of the 3 confused accounts add up to 3.',
      'Click <b>Apply the attack</b> below. Mal appears. Bo certifies Mal, and Mal certifies Y1–Y3.',
      'Read the notes. Y1–Y3 are now at distance 4 with capacity 3 each. All 6 bad accounts are accepted.',
      'Click <b>Reset</b>, then click <b>Step</b>. Watch the units move through Mal into Y1–Y3 and on to the bad accounts.',
    ],
    argument: `<p><b>The claim.</b> The security argument of Levien gives a limit on the number of accepted bad accounts. The limit is the total capacity of the <em>confused</em> accounts. A confused account is an honest account that certifies a bad account. Here the confused accounts are Bo and Y1–Y3. Bo is expensive: it is near the seed, with capacity 20. Y1–Y3 are cheap: they are far from the seed, with capacity 1 each.</p>
<p><b>The observation of Ruderman.</b> The limit uses the capacities of the confused accounts <em>after</em> the attack, and the attacker can increase those capacities. Capacity is a function of the distance from the seed. A certification from an account near the seed makes the distance of each account after it shorter. The method: make 1 expensive account and many cheap accounts confused. Then make the expensive account trust the cheap accounts. In this scenario, Bo → Mal → Y1–Y3 does this. The Y accounts move from distance 5 to distance 4, and their capacity increases from 1 to 3.</p>
<p><b>Why this is important.</b> Measure the gain against the capacities from before the attack, which are the cost of the attack. Then the gain is not linear. With <i>k</i> cheap accounts and 1 expensive account, the gain is approximately <i>k</i> times the <em>new</em> capacity of the cheap accounts. Ruderman estimates this as a constant times the square of the cost. Here the limit of 3 from before the attack becomes 7 attacker slots after the attack: Mal plus 6 bad accounts. Part of the flow comes from forwarding capacity that the honest certifiers H1–H3 did not use.</p>
<p><b>The objection and the reply.</b> Matt Brubeck noted that the proof of Levien is not clear about the control that the attacker has. If a confused account can only be made to trust <em>bad</em> accounts, does the attack still work? Ruderman replied yes. The attacker goes through a bad account. This is the Bo → Mal → Y shape that this scenario uses. The cost is at most 4 times larger.</p>
<p><b>The contrast.</b> Ruderman notes that PageRank limits the gain of an attacker to a small constant times the score of the confused pages from <em>before</em> the attack. The limit holds for all positions of the links of the attacker. In Advogato, the capacities change after the attack, so this type of limit does not apply.</p>`,
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
        note: 'One new account and 4 new certifications. Compare the distance and the capacity of Y1–Y3 before and after. Compare the accepted count of the accounts with the label "bad".',
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

// A fresh name that is not in use: N1, N2, …
export function freshName(graph) {
  const used = new Set(graph.accounts.map((a) => a.name))
  for (let i = 1; ; i++) if (!used.has(`N${i}`)) return `N${i}`
}
