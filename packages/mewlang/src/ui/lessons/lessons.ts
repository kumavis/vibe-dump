import type { EvalResult } from '../../engine/scheduler'
import type { RoundLog, SnapClass, Snapshot } from '../../engine/roundlog'
import type { ConfluenceReport } from '../store'
import { exampleById } from '../../examples'

export type SpotlightTarget = 'editor' | 'graph' | 'inspector' | 'timeline' | 'console' | null

export interface LessonStep {
  prose: string
  spotlight?: SpotlightTarget
}

export interface LessonCtx {
  run: EvalResult | null
  round: number
  snapshot: Snapshot | null
  roundLog: RoundLog | null
  selectedClass: SnapClass | null
  confluence: ConfluenceReport | null
  source: string
}

export interface Lesson {
  id: string
  title: string
  source: string
  exampleId?: string
  /** Round to jump to after compiling ('end' = final). */
  startRound?: number | 'end'
  steps: LessonStep[]
  checkpoint: { text: string; test(ctx: LessonCtx): boolean }
  illustration?: 'tree-vs-dag'
}

const FIB6 = `def fib(n) =
  if n < 2 then n
  else fib(n - 1) + fib(n - 2)

main = fib(6)
`

export const LESSONS: Lesson[] = [
  {
    id: 'terms',
    title: '1 · Terms & the e-graph',
    source: exampleById('arith').source,
    exampleId: 'arith',
    startRound: 0,
    steps: [
      {
        prose:
          'Welcome! mewlang programs are not run by an interpreter. They are compiled into a graph and evaluated by growing what the graph knows. This program is (1 + 2) * (1 + 2). Each circle is an e-class: a set of terms known to be equal.',
        spotlight: 'graph',
      },
      {
        prose:
          'Arrows point from a term to its subterms. Count the circles: the program has two copies of (1 + 2) in the source, but only ONE node for it. Identical subterms are hash-consed into the same e-class — this is structural memoization, and it is free.',
        spotlight: 'graph',
      },
      {
        prose:
          'Hover a node and watch the editor: every occurrence of that term lights up in the source. The mapping goes both ways — hover the source to find the node.',
        spotlight: 'editor',
      },
    ],
    checkpoint: {
      text: 'Click the shared (1 + 2) node — the one whose highlight shows two places in the source.',
      test: (ctx) =>
        ctx.selectedClass !== null &&
        ctx.selectedClass.alts.some((a) => a.op === '+') &&
        ctx.selectedClass.spans.length >= 2,
    },
  },
  {
    id: 'cells',
    title: '2 · Cells & lattices',
    source: exampleById('arith').source,
    exampleId: 'arith',
    startRound: 'end',
    steps: [
      {
        prose:
          'Each e-class is a propagator cell. Its value is the growing set of alternatives — every form the term is known to take. Rewriting never replaces anything: 1 + 2 does not BECOME 3; the cell learns that 3 is also a member.',
        spotlight: 'inspector',
      },
      {
        prose:
          'Every write goes through one join function: set-union the alternatives, keep the cheaper "best". Joins are commutative, associative and idempotent — a lattice. That is why firing order can never matter: knowledge only accumulates.',
        spotlight: 'inspector',
      },
      {
        prose:
          'The inspector also shows provenance: which rule added which alternative, in which round. Nothing is ever deleted, so the whole history is right there.',
        spotlight: 'inspector',
      },
    ],
    checkpoint: {
      text: 'Select any class holding 2+ alternatives and peek at its list in the inspector.',
      test: (ctx) => ctx.selectedClass !== null && ctx.selectedClass.alts.length >= 2,
    },
  },
  {
    id: 'rules',
    title: '3 · Propagator rules',
    source: 'main = (1 + 2) + (3 + 4)\n',
    startRound: 0,
    steps: [
      {
        prose:
          'Rules watch cells and add knowledge. R-arith: if both children of a + node contain a literal, add the computed literal to the parent. Step forward one round and watch it fire twice — both inner sums at once.',
        spotlight: 'timeline',
      },
      {
        prose:
          'Now check the round ribbon: the outer sum did NOT fire in round 1. Rules read the snapshot from the START of the round — the outer + could not see 3 and 7 yet, because they were only added this round.',
        spotlight: 'timeline',
      },
      {
        prose:
          'That snapshot discipline is what makes rounds honest: every rule in a round sees the same world, so their firings are independent facts, not a sequence.',
        spotlight: 'graph',
      },
    ],
    checkpoint: {
      text: 'Scrub to a round in which R-arith fired (the ribbon lists the firings).',
      test: (ctx) => (ctx.roundLog?.firings ?? []).some((f) => f.rule === 'R-arith'),
    },
  },
  {
    id: 'bsp',
    title: '4 · BSP rounds & quiescence',
    source: exampleById('max').source,
    exampleId: 'max',
    startRound: 0,
    steps: [
      {
        prose:
          'Evaluation is bulk-synchronous: each round, ALL enabled rules fire against the same snapshot, all their updates merge, repeat. No rule ever waits on another — there is no call stack, only a wavefront.',
        spotlight: 'timeline',
      },
      {
        prose:
          'Press play. Cells turn green as their best form becomes a literal — they have settled. The wavefront of green spreads from the leaves toward the root.',
        spotlight: 'graph',
      },
      {
        prose:
          'When a round finds nothing new to fire, the network is QUIESCENT. Not "finished executing" — there is no executor — simply: no rule can add knowledge. That is the stopping condition.',
        spotlight: 'console',
      },
    ],
    checkpoint: {
      text: 'Reach the final round (play or step to quiescence).',
      test: (ctx) =>
        ctx.run !== null && ctx.run.status === 'quiescent' && ctx.round === ctx.run.rounds.length,
    },
  },
  {
    id: 'branching',
    title: '5 · Branching without control flow',
    source: exampleById('max').source,
    exampleId: 'max',
    startRound: 0,
    steps: [
      {
        prose:
          'How does `if` work with no control flow? R-if watches the condition cell. When it contains true or false, the if-class is UNIONED with the taken branch — the two circles glide together and become one.',
        spotlight: 'graph',
      },
      {
        prose:
          'It is a union, not a replacement: the if-node is still an alternative in the merged class (check the inspector). The class simply also contains everything the branch knew — including, eventually, its literal.',
        spotlight: 'inspector',
      },
      {
        prose:
          'The untaken branch? Still in the graph, still true knowledge — just never demanded again. Nothing is discarded; it merely stops mattering.',
        spotlight: 'graph',
      },
    ],
    checkpoint: {
      text: 'Scrub to the round where R-if fired (watch max(3, 8) merge with its else branch).',
      test: (ctx) => (ctx.roundLog?.firings ?? []).some((f) => f.rule === 'R-if'),
    },
  },
  {
    id: 'recursion',
    title: '6 · Recursion, unfolding & fuel',
    source: FIB6,
    startRound: 0,
    steps: [
      {
        prose:
          'Function bodies are templates, not graph nodes. R-unfold fires when a call\'s arguments all hold literals AND the program still demands the call: it instantiates the body, allocating NEW cells between rounds. Play fib(6) and watch topology being born.',
        spotlight: 'graph',
      },
      {
        prose:
          'Each unfold costs 1 fuel (see the console). Fuel is the only guarantee of termination — the rules themselves would happily unfold forever.',
        spotlight: 'console',
      },
      {
        prose:
          'Prove it: pick the "loop" example from the dropdown, compile, and let it run. It never quiesces — it stops with FUEL-EXHAUSTED, and extraction can only offer a non-literal best form.',
        spotlight: 'editor',
      },
    ],
    checkpoint: {
      text: 'Run the loop example to FUEL-EXHAUSTED (load it from the dropdown and compile).',
      test: (ctx) => ctx.run !== null && ctx.run.status === 'fuel-exhausted',
    },
  },
  {
    id: 'memo',
    title: '7 · Structural memoization',
    source: exampleById('fib').source,
    exampleId: 'fib',
    startRound: 'end',
    illustration: 'tree-vs-dag',
    steps: [
      {
        prose:
          'Naive fib(10) makes 177 calls — an exponential tree. Load the final round and count the fib nodes here: about eleven. One e-class per DISTINCT subproblem.',
        spotlight: 'graph',
      },
      {
        prose:
          'No cache was added. When fib(9) unfolds, its body mentions fib(8) — and the hashcons returns the class that already exists. fib(10-2) and fib((10-1)-1) merge by congruence the moment their arguments prove equal. Memoization is structural, not bolted on.',
        spotlight: 'graph',
      },
      {
        prose:
          'Shared nodes carry multiple source spans: hover one and see it light up both fib(n - 1) and fib(n - 2) in the definition.',
        spotlight: 'editor',
      },
    ],
    checkpoint: {
      text: 'Click a fib(k) node that is shared — its highlight shows 2+ places in the source.',
      test: (ctx) =>
        ctx.selectedClass !== null &&
        ctx.selectedClass.alts.some((a) => a.op === 'call' && a.fn === 'fib') &&
        ctx.selectedClass.spans.length >= 2,
    },
  },
  {
    id: 'calm',
    title: '8 · Confluence & extraction (CALM)',
    source: exampleById('fib').source,
    exampleId: 'fib',
    startRound: 'end',
    steps: [
      {
        prose:
          'Every update was a monotone join, so the CALM theorem applies: a monotone program needs no coordination. Any firing order reaches the same quiescent state. Flip on "shuffle" and recompile — same answer, same graph.',
        spotlight: 'console',
      },
      {
        prose:
          'Don\'t take one run\'s word for it. "Verify confluence" executes the program 10 times with different shuffle seeds and compares the extracted answer, class count and alternative count.',
        spotlight: 'console',
      },
      {
        prose:
          'And the answer itself? Nothing "returns". After quiescence we EXTRACT: pick the lowest-cost representative of the root class — literals cost 0, so 55 wins. Reduction as knowledge growth, scheduling as a free variable, extraction as a choice. That\'s the whole trick. 😺',
        spotlight: 'console',
      },
    ],
    checkpoint: {
      text: 'Press "Verify confluence" and get 10/10 identical runs.',
      test: (ctx) => ctx.confluence !== null && ctx.confluence.ok,
    },
  },
]
