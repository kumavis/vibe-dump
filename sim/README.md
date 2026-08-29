# raindrop sim

A Node simulation of [Raindrop](https://kumavis.github.io/raindrop-paper/paper.md)
— continuous token issuance allocated by EigenTrust over a delegated trust
network — layered on top of an ordinary small-city economy with jobs, rent, and
people who would rather be making things.

Not a web app, not part of the gallery build. Plain ESM, no dependencies.

```bash
node sim/run.mjs                       # the default 10-year run
node sim/run.mjs --no-raindrop         # same people, same seed, no token
node sim/run.mjs --alpha 0.2 --kappa 0.4 --seed 7
node sim/run.mjs --burn-bps 50 --jsonl out.jsonl
node sim/run.mjs --help

node sim/sweep.mjs alpha 0.15 0.35 0.55 0.75 0.95 --seeds 5
node sim/sweep.mjs kappa 0 0.4 0.8 1.6 3.2
node sim/sweep.mjs patronPropensity 0.05 0.15 0.35 0.8
```

## The thing the model is built to answer

Rent is denominated in dollars. An artist funded in RAIN has to sell RAIN to
somebody holding dollars. So **issuance does not create purchasing power, it
allocates it** — the number of baristas Raindrop can free is set by patron
inflow, not by the issuance rate. Minting faster just spreads the same dollar
flow across more recipients.

Which makes the real question: given a fixed patron budget, does trust
propagation allocate it well? Concretely — **is the money reaching craft, or
reaching hustle?**

Every agent has a hidden `craft` (real output per unit effort) and a separate
`hustle` (how much of that output other people *perceive*). The simulator knows
both. The agents know neither, and learn about each other only through events.

## The discovery layer

Trust can only rank people the delegators have *seen*, and who they have seen is
decided by a feed. So the model carries a real one, upstream of everything else:
a follow graph with preferential attachment, posts, reshares, and a recommender
ranking on engagement.

Two graphs, deliberately distinct. **Following is free and wide** — people
follow hundreds. **Delegating costs `(1-α)·b`** and is narrow — people delegate
to a handful. `--algo-share` mixes the feed between followed accounts and the
recommender: 0 is chronological, 1 is pure algorithm.

The recommender cannot see quality. It sees *engagement*, which packaging drives
at least as much as substance, and `--algo-gamma` amplifies it superlinearly.

Every agent also has a **legibility**: how much of their real work survives
compression into a post. This is set by field, and it is the trait that decides
whether a feed can see you at all.

| field | legibility | why |
| --- | --- | --- |
| art | 0.85 | reads from a thumbnail |
| general | 0.55 | |
| research | 0.30 | you cannot evaluate a proof from a post |
| infra | 0.22 | maintained systems read as nothing until they break |

## How it is wired

One tick is a day. Three clocks run on top of it, deliberately not collapsed
together, because Raindrop's claim to fix the "snapshot problem" is a claim
about their mismatch.

1. **Discovery** (daily) — people post, everyone reads a feed. Runs first
   because it decides who is visible at all.
2. **Direct interaction** (daily) — collaboration, patronage, referral. These
   bypass the feed. Collaboration is the one channel with almost no packaging
   bias and no legibility gate: you were in the room, you saw the work. Since
   collaboration takes free time and a day job consumes exactly that, a
   population stuck in day jobs learns about each other only through the feed.
   Funding people out of their jobs improves the trust graph itself.
3. **Work and produce** (daily).
4. **Trust updates** (event-triggered, plus a slow base review rate) — a
   delegation is granted only once accumulated belief has moved enough to be
   worth acting on. Delegations trickle.
5. **Issuance** (daily) — `t <- (1-α)·Cᵀt + α·b`, warm-started from the previous
   round.
6. **Market** (daily) — a constant-product AMM. Thin by design, so a forced
   seller eats their own price move.
7. **Bills, lifestyle ratchet, employment decisions** (monthly).

### Delegation is marginal, and decays

Two properties distinguish this from "rewrite your row with your current top-k":

- **Trust is a claim about the margin.** The paper defines a delegation as
  saying this account would further the network's goals *if granted additional
  allocation* — a claim about the margin, not the level. So a delegator with
  `corrective` weight ranks candidates by how **underserved** they are: believed
  in, but not currently well funded. It is the direct counterweight to
  `conformity`, which chases whoever is already ranked highly. Both act on the
  same public-rank term with opposite signs. `--corrective-scale` sweeps it.
- **Granting new trust dilutes old trust rather than replacing it.**
  `--trust-decay-on-update` (default 0.30) is how much everything already in the
  row fades when a new endorsement is added, so old delegations wash out over
  several updates. Rows carry a tail of stale small weights and the graph is
  path dependent — both more realistic for a system where you sign a transaction
  to add an edge, and materially different from a clean rewrite when you are
  testing a claim about staleness.

### Pinned specification choices

The paper leaves these open; the sim closes them:

| question | choice |
| --- | --- |
| α direction | Kamvar's original: α is the weight on the **pre-trust** vector. High α leans on balances. |
| pre-trust `p` | `= b`, the RAIN balance distribution |
| empty trust row | **self-trust** (`e_i`), not a fallback to `p` |
| self-trust | allowed, and the default — the diagonal is not zeroed |
| curators | paid, because EigenTrust pays intermediaries. No special case either way. |
| everyone | is an agent, patrons included |

Two consequences fall out and both are checked in the run:

- **Opting out is exactly neutral.** If nobody delegates, `C = I` and `t = b` for
  any α — the mechanism degrades gracefully into a staking yield that moves no
  wealth shares. Asserted as an invariant.
- **Endorsement costs the endorser.** An agent who delegates outward and
  receives nothing back gets `α·b_i` instead of `b_i`, giving up `(1-α)·b_i`
  every round. The redistribution pool *is* what delegators give up. The trace
  measures this exactly (re-solving with that agent's row self-trusted) and it
  tracks `(1-α)` closely. Its corollary — reciprocal delegation is free while
  unilateral delegation is not — is why reciprocity rings form here from
  arithmetic rather than from malice.

## Reading the trace

The periodic table is the run; the columns that matter:

- `craft~end` / `hustl~end` / `legib~end` — **the headline.** Rank correlation
  of cumulative *endorsement* with true craft, with hustle, and with legibility.
  Endorsement is other people's trust weighted by their own standing —
  `Σ_{j≠i} g_j·C_ji`, which at the fixed point is exactly the non-pre-trust,
  non-self-trust part of `g_i`. Your own balance and your own self-trust are
  both removed. Two measures were tried and discarded on the way here:
  correlating raw receipts is misleading because at α = 0.5 half of every round
  is a straight staking yield that buries whatever trust did, and correlating
  *amplification* (received ÷ pro-rata) is a ratio whose denominator explodes
  for the smallest holders, so the ranking ends up dominated by them. Both are
  still reported, for exactly that comparison.
- `craft` / `rent` — agents on full-time craft, versus agents who left the
  workforce and are *not* making anything. Counting rentiers as freed artists
  would flatter the mechanism.
- `back` — agents forced back to work at least once. The clearest harm the
  mechanism can cause, and invisible in any average.
- `rent$/mo` vs `trim$/mo` — forced selling for rent versus voluntary position
  trimming.
- `self` — share of issuance decided by self-directed trust.

Then: the lives of a few named agents, who trust lifted and who it taxed, a
per-persona table, and the invariant check.

## What it has found so far

**The feed decides everything.** `node sim/sweep.mjs algoShare 0 0.25 0.5 0.75 1.0
--seeds 3 --years 6`, medians:

| algoShare | craft~end | hustle~end | follower gini |
| --- | --- | --- | --- |
| 0.00 — chronological follow feed | **+0.44** | +0.16 | 0.421 |
| 0.25 | +0.23 | +0.30 | 0.715 |
| 0.50 | +0.06 | +0.39 | 0.706 |
| 0.75 | −0.02 | +0.30 | 0.682 |
| 1.00 — pure recommender | **−0.16** | +0.28 | 0.647 |

Same EigenTrust, same α, same population, same seeds. On a chronological feed
trust tracks craft strongly and beats hustle; on an engagement-ranked feed it
inverts and hustle wins. Raindrop's targeting quality is a property of the
discovery layer it sits on, not of the mechanism.

**Legibility is funded, not quality.** Researchers carry the highest mean craft
in the population (0.80) and end with an eighth of the artists' followers and
net-negative amplification. Infrastructure work does worse still.

| field | n | mean craft | mean followers | amplification |
| --- | --- | --- | --- | --- |
| general | 188 | 0.27 | 20 | 1.54× |
| art | 88 | 0.56 | 160 | 1.52× |
| research | 52 | 0.80 | 19 | 0.96× |
| infra | 72 | 0.47 | 13 | 0.82× |

**Trust quality decays over the run.** `craft~end` opens around +0.20 and drifts
to −0.12 across ten years while hustle holds. Belief evidence saturates, and
feed impressions outnumber collaborations by roughly two orders of magnitude, so
the biased channel wins on volume in the long run even though it is far weaker
per event.

**Corrective delegation fixes the wrong bottleneck.** Sweeping
`correctiveScale` 0 → 3 cuts `hustle~end` from +0.34 to −0.01 and Gini from
0.590 to 0.529 — it genuinely works as an anti-herding force. But craft
targeting does not improve (+0.08 → −0.11) and legibility bias gets *worse*
(0.00 → +0.47). Targeting the underfunded among the people you can already see
just redistributes within the visible. The bottleneck is discovery, not
allocation.

**The endorsement cost is real and tracks (1-α).** Sweeping α gives 79% / 56% /
37% / 19% / 4% at α = 0.15 / 0.35 / 0.55 / 0.75 / 0.95.

## Known behaviour worth knowing about

- **At the default calibration almost nobody quits.** That is the honest result,
  not a bug: ~$6.5k/month of issuance value across 400 agents supports two or
  three people. Supporting 50 artists at a modest $2,300/month needs $1.38M a
  year of real patron inflow. Raise `--patron-propensity` to reach the regime
  where liberation happens.
- **Conformity must enter as a rank percentile, not raw `g`.** Allocation shares
  span orders of magnitude; feeding `g` in directly makes the conformity term
  dwarf every belief and collapses the population onto whoever holds the most.
  An early version had this bug and 395 of 400 agents ended up delegating to one
  whale. Fixed, and worth not reintroducing.
- **Price drifts up across long runs** at default parameters: issuance
  concentrates in solvent holders who have little reason to convert, so sell
  pressure is thinner than gross issuance suggests. Voluntary rebalancing damps
  it but does not remove it.
- **Belief evidence saturates**, so drift stops accumulating and the trust graph
  would freeze with whatever it settled on in year one. `baseReviewRate` keeps
  delegations alive without making anyone attentive. Without it the run
  measures the first twelve months forever.
- A single run is an anecdote. Use `sweep.mjs`, which medians over seeds.
- A 10-year run of 400 agents takes ~25s, nearly all of it in the feed
  (~14M impressions). Drop `--feed-size` or `--agents` for faster sweeps.

## Files

| file | what |
| --- | --- |
| `run.mjs` | CLI entry, prints the trace |
| `sweep.mjs` | parameter sweeps, medians over seeds |
| `src/config.mjs` | every number, with the reasoning attached |
| `src/eigentrust.mjs` | the algorithm, unmodified, with the conventions documented |
| `src/population.mjs` | personas and population generation |
| `src/perception.mjs` | beliefs, and how an observation changes one |
| `src/social.mjs` | follow graph, posts, feed, reshares, preferential attachment |
| `src/events.mjs` | direct interaction and delegation |
| `src/economy.mjs` | wages, bills, lifestyle ratchet, the quit decision |
| `src/market.mjs` | constant-product AMM with an EIP-1559-style base-fee burn |
| `src/model.mjs` | the tick loop and the invariant checks |
| `src/metrics.mjs` | measures |
| `src/trace.mjs` | trace formatting |

The engine is dependency-free ESM with no Node built-ins in `src/`, so it can be
imported by a browser app later without changes.
