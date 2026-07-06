# mewlang 🐱

**mewlang** is a tiny first-order functional language that is deliberately *not*
evaluated by an interpreter. A program is compiled into a **propagator network
whose cells are e-graph equivalence classes**, and "running" it means
**monotone equality saturation** driven by a BSP (bulk-synchronous parallel)
scheduler. The webapp around it is an interactive teaching tool: a code editor,
an animated force-directed view of the network evolving round by round, an
e-class inspector, and an eight-lesson guided tutorial — with bidirectional
source mapping between graph nodes and source code.

The point of the exercise is a change of perspective: reduction as **knowledge
growth, not state change**. A cell never holds "the current form of a term" —
it holds the growing set of everything known to be *equal* to that term.
Rewriting `fib(2) → fib(1) + fib(0)` replaces nothing; it joins a new
alternative into an equivalence class. Because every cell update is a monotone
lattice join (grow-only alternative sets, min-cost `best`, coarsening-only
partitions), firing order can never affect the final answer — the CALM
property (Consistency As Logical Monotonicity). The scheduler exploits that
freedom by firing *all* enabled rules each round against the same snapshot,
and a "shuffle firing order" mode demonstrates confluence empirically.

Two more ideas fall out for free. **Memoization is structural**: identical
subterms are hash-consed into the same e-class, so `fib(10)`'s exponential call
tree collapses into a linear DAG of ~11 distinct subproblems — visibly, in the
graph. And **the answer is extracted, not returned**: after quiescence, the
result is simply the lowest-cost representative of the root class (literals
cost 0, so they win when they exist).

## Run it

```bash
npm install
npm run dev        # from packages/mewlang, or use the workspace root
npm test           # vitest: parser, lattice laws, confluence, golden examples
npm run build      # static site in dist/
```

Open the app, press **Compile ▸** on the bundled `fib(10)` program, and watch
it saturate to `55`. Or open the **Tutorial** tab and click through the eight
lessons.

## 60-second architecture tour

```
src/lang/     lexer.ts parser.ts       hand-written recursive descent; every
              ast.ts span.ts           AST node carries a source span
src/engine/   egraph.ts                union-find + hashcons (the memoizer),
                                       cell lattice with a single join(),
                                       congruence repair (egg-style rebuild)
              rules.ts                 R-arith, R-if, R-unfold (CBV + demand
                                       guarded), each reads only the round
                                       snapshot and emits Deltas
              scheduler.ts             the BSP loop: read → topology → merge →
                                       congruence → best-cost tightening;
                                       seeded-shuffle confluence mode; fuel
              compile.ts               main is interned bottom-up; defs stay
                                       templates until R-unfold instantiates
              roundlog.ts extract.ts   immutable per-round snapshots for
                                       scrubbing; cost-min extraction
src/ui/       App/Editor/Graph/        React + zustand + CodeMirror 6 +
              Inspector/Timeline/      d3-force over hand-rolled SVG;
              Tutorial + lessons/      lessons drive the store directly
tests/        parser, egraph (lattice laws), rules, scheduler,
              confluence (25 seeded shuffles), golden (fib(10)=55 …)
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
