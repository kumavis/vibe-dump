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
  demandOn: boolean
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
    title: '6 · Recursion, unfolding & budget',
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
          'Rules never count anything — that would smuggle scheduling into semantics. Termination is the SCHEDULER\'s job: a budget of rounds and classes, checked only between rounds. Within a round, everything enabled always fires.',
        spotlight: 'console',
      },
      {
        prose:
          'Prove the budget matters: pick the "loop" example from the dropdown and compile. It never quiesces — the scheduler stops it with BUDGET-EXHAUSTED, and extraction can only offer a non-literal best form.',
        spotlight: 'editor',
      },
    ],
    checkpoint: {
      text: 'Run the loop example to BUDGET-EXHAUSTED (load it from the dropdown and compile).',
      test: (ctx) => ctx.run !== null && ctx.run.status === 'budget-exhausted',
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
          'Every rule is monotone and every write is a join — THAT is why any firing order reaches the same fixpoint. Not the rounds. Switch the scheduler to "shuffled" and recompile: same answer, same canonical graph. "Verify confluence" runs it 10 times and compares full states.',
        spotlight: 'console',
      },
      {
        prose:
          'We chose BSP rounds because they are easy to animate and reason about. The barriers between rounds are global synchronization — coordination — a scheduling convenience, NOT the source of the guarantee. Try "chaos" mode: no rounds at all, one random firing at a time. Same fixpoint.',
        spotlight: 'timeline',
      },
      {
        prose:
          'Boundaries, stated exactly. (1) A budget-exhausted run holds a PREFIX of the knowledge — different schedules, different prefixes — but everything derived is true, and any literal extracted is THE answer. (2) Class ids are schedule-dependent: rerun shuffled and the inspector shows different #ids — only the quotient structure is invariant, so all comparisons work modulo renaming. Extraction: lowest-cost representative of the root; literals cost 0, so 55 wins. Delete the barriers, fire asynchronously, even across machines: the answer cannot change. That is CALM. 😺',
        spotlight: 'console',
      },
    ],
    checkpoint: {
      text: 'Press "Verify confluence" and get 10/10 runs with identical canonical state.',
      test: (ctx) => ctx.confluence !== null && ctx.confluence.ok,
    },
  },
  {
    id: 'demand',
    title: '9 · Demand: laziness as a lattice',
    source: exampleById('deadcode').source,
    exampleId: 'deadcode',
    startRound: 'end',
    steps: [
      {
        prose:
          'This program\'s else branch can never run. Demand is a grow-only set of classes seeded at the root; R-demand spreads it through what the program needs — all positive triggers. An if demands only its CONDITION until the condition resolves; then just the taken branch. Neither branch is demanded before that, and that is the point.',
        spotlight: 'graph',
      },
      {
        prose:
          'The run quiesced at 1. The loop(0) call sits ghosted — undemanded, untouched. Click it: its provenance log is empty. No rule ever fired at it.',
        spotlight: 'inspector',
      },
      {
        prose:
          'Try it: uncheck "demand", recompile — the answer 1 still appears (before quiescence!) but the network chases the dead loop until the budget dies. Then press ↻ reset to restore this lesson\'s demand-on run, and click the ghosted loop(0) node. Even evaluation strategy fits inside the monotone fragment — demand is just another grow-only set.',
        spotlight: 'editor',
      },
    ],
    checkpoint: {
      text: 'Click the ghosted loop(0) node and confirm its provenance log is empty.',
      test: (ctx) =>
        ctx.selectedClass !== null &&
        ctx.selectedClass.demanded === false &&
        ctx.selectedClass.provenance.length === 0 &&
        ctx.selectedClass.alts.some((a) => a.op === 'call' && a.fn === 'loop'),
    },
  },
]
