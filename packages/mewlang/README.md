# mewlang 🐱

**mewlang** is a tiny first-order functional language that is deliberately *not*
evaluated by an interpreter. A program is compiled into a **propagator network
whose cells are e-graph equivalence classes**, and "running" it means
**monotone equality saturation** driven by a BSP (bulk-synchronous parallel)
scheduler. The webapp around it is an interactive teaching tool: a code editor,
an animated force-directed view of the network evolving round by round, an
e-class inspector, and a nine-lesson guided tutorial — with bidirectional
source mapping between graph nodes and source code.

The point of the exercise is a change of perspective: reduction as **knowledge
growth, not state change**. A cell never holds "the current form of a term" —
it holds the growing set of everything known to be *equal* to that term.
Rewriting `fib(2) → fib(1) + fib(0)` replaces nothing; it joins a new
alternative into an equivalence class. Every component of a cell's value is an
element of a join-semilattice with a commutative, associative, idempotent
join: alternatives are a grow-only set, `best` is a min in a *total* order,
provenance is a set of (rule, round, premises) facts, the partition only ever
coarsens, demand only ever grows. Even the evaluation strategy fits inside the
monotone fragment: **demand** is just another grow-only set, seeded at the
root, spread by a rule with only positive triggers.

Two more ideas fall out for free. **Memoization is structural**: identical
subterms are hash-consed into the same e-class, so `fib(10)`'s exponential call
tree collapses into a linear DAG of ~11 distinct subproblems — visibly, in the
graph. And **the answer is extracted, not returned**: after quiescence, the
result is simply the lowest-cost representative of the root class (literals
cost 0, so they win when they exist).

## What confluence does — and doesn't — claim

Because every rule is monotone and every write is an ACI join, **any schedule
reaches the same fixpoint**: for a program that reaches *quiescence*, the
final canonical e-graph (alternatives, partition structure, best, provenance)
— modulo renaming of class ids — and the extracted value are identical for
every firing order. The shuffle scheduler and the "verify confluence" button
demonstrate this empirically; "chaos" mode goes further and abandons rounds
entirely, firing one random propagator at a time, and still lands on the same
state.

The boundaries, stated exactly:

1. **Budget-exhausted runs are not confluent as states.** A run stopped early
   holds some *prefix* of the knowledge; different schedules hold different
   prefixes. What monotonicity still buys you: everything in any prefix is
   *true*, and any literal already extracted is the correct answer. Exhausted
   runs agree on the answer *if* they found one — nothing more is claimed.
2. **Class ids are schedule-dependent.** Only the quotient structure is
   invariant; all comparisons work modulo canonical renaming.
3. **BSP is not the source of the guarantee.** The barriers between rounds are
   *coordination* — a global synchronization chosen because rounds are easy to
   animate. Monotonicity is what makes the barriers semantically unnecessary:
   delete them, fire propagators one at a time, asynchronously, in shuffled
   order, even across machines — and the fixpoint cannot change. That is the
   CALM theorem's lesson (Consistency As Logical Monotonicity), and it is the
   monotone joins, never the rounds, that earn it.

Soundness is enforced, not assumed: a **literal-collision tripwire** (two
distinct literals proved equal = engine bug, red banner) plus a 30-line
**reference interpreter** used for differential testing.

## Run it

```bash
npm install
npm run dev        # from packages/mewlang, or use the workspace root
npm test           # vitest: parser, lattice laws, confluence, contract matrix
npm run build      # static site in dist/
```

Open the app, press **Compile ▸** on the bundled `fib(10)` program, and watch
it saturate to `55`. Or open the **Tutorial** tab and click through the nine
lessons. The scheduler budget (max rounds / max classes) is checked *between*
rounds only — within a round, everything enabled always fires.

## 60-second architecture tour

```
src/lang/     lexer.ts parser.ts       hand-written recursive descent; every
              ast.ts span.ts           AST node carries a source span
src/engine/   egraph.ts                union-find + hashcons (the memoizer),
                                       cell lattice with a single ACI join(),
                                       congruence repair, total-order best,
                                       cost fixpoint, collision tripwire
              rules.ts                 R-arith, R-if, R-unfold, R-demand —
                                       INV-SOUND documented at the top; rules
                                       read the snapshot and nothing else
              scheduler.ts             BSP / shuffled / chaos schedulers,
                                       between-round budgets, RoundLog
              compile.ts               main is interned bottom-up; defs stay
                                       templates until R-unfold instantiates
              reference.ts             the differential-testing ground truth
              fingerprint.ts           canonical-state fingerprints (id-free)
              roundlog.ts extract.ts   immutable per-round snapshots for
                                       scrubbing; cost-min extraction
src/ui/       App/Editor/Graph/        React + zustand + CodeMirror 6 +
              Inspector/Timeline/      d3-force over hand-rolled SVG;
              Tutorial + lessons/      lessons drive the store directly
tests/        parser, egraph (lattice laws incl. provenance), rules,
              scheduler (budget), confluence (25 shuffles, full-state
              fingerprints, chaos), golden + differential, contract matrix
```

`engine/` has zero DOM/React imports and runs headless under vitest. The UI
never re-runs the engine to scrub: the scheduler records a `RoundLog` plus a
full snapshot per round, and the timeline just renders `snapshots[r]`.

## Further reading

- Radul & Sussman, *The Art of the Propagator* (MIT CSAIL TR, 2009)
- Willsey et al., *egg: Fast and Extensible Equality Saturation* (POPL 2021)
- Tate et al., *Equality Saturation: A New Approach to Optimization* (POPL 2009)
- Hellerstein & Alvaro, *Keeping CALM: When Distributed Consistency Is Easy* (CACM 2020)
- Valiant, *A Bridging Model for Parallel Computation* (CACM 1990) — the BSP model
