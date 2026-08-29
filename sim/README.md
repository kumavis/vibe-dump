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

## How it is wired

One tick is a day. Three clocks run on top of it, deliberately not collapsed
together, because Raindrop's claim to fix the "snapshot problem" is a claim
about their mismatch.

1. **Interaction events** (daily) — exposure, collaboration, patronage,
   referral. These differ in how much they reveal and how much promotion
   distorts them: exposure carries a heavy hustle bias, collaboration almost
   none. Since collaboration takes free time and a day job consumes exactly
   that, a population stuck in day jobs learns about each other only through the
   biased channel. Funding people out of their jobs improves the trust graph
   itself.
2. **Work and produce** (daily).
3. **Trust updates** (event-triggered) — a delegation row is rewritten only once
   accumulated belief has moved enough to be worth acting on. Rows trickle.
4. **Issuance** (daily) — `t <- (1-α)·Cᵀt + α·b`, warm-started from the previous
   round.
5. **Market** (daily) — a constant-product AMM. Thin by design, so a forced
   seller eats their own price move.
6. **Bills, lifestyle ratchet, employment decisions** (monthly).

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

- `craft~amp` / `hustl~amp` — **the headline.** Rank correlation of
  *amplification* with true craft and with hustle. Amplification is RAIN
  received divided by what a pure staking yield would have paid, so an agent's
  starting balance is divided out. Above 1.0 trust lifted you above your stake.
  Correlating raw receipts instead is misleading: at α = 0.5 half of every round
  is a straight staking yield, which buries whatever trust did.
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
- A single run is an anecdote. Use `sweep.mjs`, which medians over seeds.

## Files

| file | what |
| --- | --- |
| `run.mjs` | CLI entry, prints the trace |
| `sweep.mjs` | parameter sweeps, medians over seeds |
| `src/config.mjs` | every number, with the reasoning attached |
| `src/eigentrust.mjs` | the algorithm, unmodified, with the conventions documented |
| `src/population.mjs` | personas and population generation |
| `src/events.mjs` | interaction events, beliefs, delegation rewrites |
| `src/economy.mjs` | wages, bills, lifestyle ratchet, the quit decision |
| `src/market.mjs` | constant-product AMM with an EIP-1559-style base-fee burn |
| `src/model.mjs` | the tick loop and the invariant checks |
| `src/metrics.mjs` | measures |
| `src/trace.mjs` | trace formatting |

The engine is dependency-free ESM with no Node built-ins in `src/`, so it can be
imported by a browser app later without changes.
