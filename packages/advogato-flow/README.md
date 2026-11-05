# Advogato Flow

An interactive explainer and simulator of Advogato's maximum-flow
certification metric — the "group trust metric" Raph Levien built into
mod_virgule. Draw a certification graph, choose trusted seeds and a
certification threshold, edit the capacity schedule, and step through the
computation one move at a time. Four guided scenarios show why a reachable
account can still be rejected, and why a cluster of mutually certifying fake
accounts cannot buy more admission slots than the bottleneck feeding it.

Live: <https://kumavis.github.io/vibe-dump/advogato-flow/>

## Run it

From the repository root:

```bash
npm install                             # once
npm run dev -w @vibe-dump/advogato-flow # hot reload at the URL Vite prints
```

Or build and preview the gallery's copy:

```bash
npm run build && npm run preview        # http://127.0.0.1:4173/advogato-flow/
```

Tests (no browser needed):

```bash
npm test -w @vibe-dump/advogato-flow
```

## Files

| file | what it holds |
| --- | --- |
| `metric.js` | the metric, pure: threshold filter, source, BFS capacities, in/out split, augmenting-path max flow, per-level report, rejection explanations, invariant checks, and EigenTrust for contrast |
| `scenarios.js` | the four guided scenarios as data, plus the graph edits the UI and scenarios share |
| `view.js` | SVG rendering of the social graph and the expanded flow network |
| `main.js` | app state, the step trace, prose for each step, editing, inspector, tables |
| `test/metric.test.mjs` | the verification suite described below |

## What matches the reference

The algorithm is a re-telling of [`tmetric.c`](https://github.com/steevithak/mod_virgule/blob/Raph/tmetric.c)
and [`net_flow.c`](https://github.com/steevithak/mod_virgule/blob/Raph/net_flow.c):

- **The synthetic source** is a node named `-`, created first so it is node 0,
  with an edge to each seed. It is treated like any other node: distance 0,
  capacity `caps[0]`, and one unit of that spent on its own sink edge — so at
  most `caps[0] − 1` real accounts can be accepted.
- **Capacities** come from a breadth-first search from the source: a node at
  distance `d` gets `caps[d]`, and past the end of the schedule the last entry
  persists (`net_flow_assign_capacities`). Unreachable nodes keep capacity −1
  and never carry flow.
- **The split**: `v_in → v_out` with capacity `c(v) − 1`, `v_in → sink` with
  capacity 1, and `u_out → v_in` with no limit for each kept certification.
  This is the `TWEAK` in `net_flow_max_flow` (`capacity[i]--` plus a per-node
  `node_sink ∈ {0, 1}`).
- **Augmenting paths** are found by breadth-first search over the residual
  graph, visiting neighbours in the same order as `net_flow_augment`, and the
  first in-node dequeued whose sink edge is empty receives the unit. Reverse
  residual edges (undoing flow on a certification, or through a node) are
  followed exactly as the reference does.
- **Per-level runs**: a certification at level *L* appears in the graphs of
  levels 1 … *L*; each level is an independent maximum flow; the reported level
  is the highest that accepted the account, because `tmetric_run` overwrites
  upward.
- Self-certifications are dropped the way `net_flow_init_graph` drops
  self-edges.

## Simplifications, stated

- The reference warms the flow up with a greedy tree
  (`net_flow_assign_tree` / `net_flow_from_tree`) before augmenting. This
  simulator starts from zero flow. The maximum flow **value** is identical; what
  can differ is which of several equally valid accepted sets comes out when
  accounts tie for the last unit. The app says so wherever a tie is visible —
  a tie-break is an artefact of traversal order, not a trust judgement.
- Traversal order here is the order accounts and certifications were created
  (the reference reads accounts from a directory). Identical inputs always give
  identical results.
- Schedule entries must be whole numbers ≥ 1: the reference reads its schedule
  up to the first zero, so a zero can't appear inside one.
- Scenario labels — "fake", "bad", "confused" — are drawn for the reader. The
  metric sees accounts, certifications and seeds, nothing else.
- Advogato's separate diary-rating system is out of scope.

## What the tests verify

`npm test -w @vibe-dump/advogato-flow` runs `node --test` over
`test/metric.test.mjs`:

- flow never exceeds any capacity and is conserved at every in-node and
  out-node, on every scenario at every threshold and on 200 seeded random
  graphs;
- the flow value equals an independent Edmonds–Karp on an explicitly built
  expanded network, on those same random graphs;
- each accepted account's sink edge carries exactly one unit, and the total
  flow counts them (plus the source's own unit);
- unreachable accounts are never accepted and carry no flow; with no seeds,
  nothing but the source is accepted;
- threshold filtering keeps only certifications at or above the level, and
  the reported level is the highest accepting one;
- `caps[d]` is indexed by BFS distance, the last entry persists, and the
  source reserves one unit of `caps[0]`;
- identical inputs give identical results, including tie winners and the
  sequence of augmenting paths;
- the four lessons hold numerically: every reachable account in the small
  community is accepted; four reachable accounts compete for two slots behind
  Bo; ten added fake accounts with full internal endorsement leave the
  cluster's accepted count unchanged; the shortcut attack moves Y1–Y3 from
  distance 5 (capacity 1) to distance 4 (capacity 3) and admits the bad
  accounts.

## Sources

- Certification graph and threshold handling: [`tmetric.c`](https://github.com/steevithak/mod_virgule/blob/Raph/tmetric.c)
- Capacity assignment and maximum flow: [`net_flow.c`](https://github.com/steevithak/mod_virgule/blob/Raph/net_flow.c)
- Kamvar, Schlosser, Garcia-Molina, [The EigenTrust Algorithm for Reputation Management in P2P Networks](https://www.areto.ethz.ch/CDstore/www2003/papers/refereed/p446/p446-kamvar/), WWW 2003
- Jesse Ruderman, [Advogato's trust metric is not attack-resistant](https://www.squarefree.com/2005/05/26/advogato/), 2005
