# SMF 02 · The Jam

L2→L3 rung of the Slime Mold Foundry automation ladder. See
`docs/slime-mold-foundry/design.md` (§2 pillars, §4.1–4.2 parts & alert
routing, layer table L2/L3) and `prototype-brief.md` §3.

## Design question

Does manual-toil saturation produce *voluntary* adoption of alert routing?
Is alert-as-physical-token legible? Does the alert storm → tank/hysteresis
fix land?

**Hypothesis.** If jams scale with the lanes the player wants anyway (more
lanes = more income = more jams), the HANDS meter climbs into the red on its
own, and a palette card that appears after 12 manual clears — no modal — is
enough of an offer. And if an alert is an *item* (minted at a tripped gate,
riding a trace, queuing at a bay, dispatching a responder), then the L3
signature failure (alert storm from a chattering gate) is visible as a
flooded queue, and its fix is a *part*: a tank between probe and gate,
whose band IS the hysteresis. Same intuition as buffering a starved
assembler — one floor up.

## How this prototype tests it

- Up to 8 belt lanes (`hopper → belt → smelter`), each flowing 2 matter/s
  into a shared quota bank (goal 1500). Jams spawn on a seeded schedule
  (mulberry32, fixed seed — zero `Math.random` in the sim) that tightens as
  lanes multiply. Manual clear = click the clog.
- After 12 manual clears (`fluency`) the SIGNAL PALETTE card pulses into the
  HUD: probes (per lane) and responder bots. A probed lane that stops
  flowing stops emitting flow tokens — **absence is the signal** — its gate
  trips and mints an alert token that physically travels the cyan trace to
  the alert bay, queues in visible slots, and dispatches a responder
  carrying the UNJAM runbook.
- 10s after the first automated clear, a scripted `degraded belt` makes one
  lane flutter 0↔2 across the gate threshold. The gate chatters, tokens
  flood the bay, responders ping-pong to a lane that self-recovers before
  arrival while real jams wait. Queue ≥ 6 flags `storm`; the TANK button
  appears. Installing the tank on the flapping lane gives the gate a
  buffered reading with a LO–HI band; the chatter stops.

## Controls

- click a pulsing clog — clear the jam by hand
- click a dashed lane (or `+ LANE`) — buy the next lane
- after fluency: `PROBE` / `TANK` arm a tool, then click a lane;
  `RESPONDER` hires a bot
- space pause · `1`/`2`/`3` = ×1/×4/×16 · panel toggle top-right

## Milestones

`firstJam → firstClear → fluency → firstProbe → firstAutoClear → storm →
tankInstalled → stormQuelled → handsFree → quota`

## Harness

`node harness.mjs` (or `npm test`). An autoplayer drives the scenario
through `act()` only: ~1.2s reaction manual clears, buys lanes as
affordable, adopts probes + bots after fluency, installs the tank ~2s after
the storm flags. Asserts milestone order, HANDS peak ≥ 4/min pre-automation
then 0 in the final stretch, bay queue > 5 in the storm and < 2 after the
tank, quota under T_MAX = 480s. Reference run on this container:

```
firstJam 8.1 · firstClear 9.4 · fluency 64.5 · firstProbe 64.6 ·
firstAutoClear 72.2 · storm 97.5 · tankInstalled 99.6 · stormQuelled 118.8 ·
handsFree 124.6 · quota 151.3
HANDS peak 12.0/min pre-automation → 0.0/min at end
storm queue peak 8 → 1 at quell → 0 at end · ~7µs/tick
```

## Findings

- **Alert-as-token is legible, and the queue is the storyteller.** The
  token's whole journey is drawn (gate flash → diamond riding the trace →
  bay slot → runbook chip on the departing bot), but the single element
  that carries the storm is the queue row: it converts "the control plane
  is misbehaving" into a picture *before* throughput visibly craters.
- **Absence-is-the-signal needed presence to be visible.** Silence only
  reads if the flow-token stream on the overlay is drawn per lane: a jammed
  probed lane goes quiet while its neighbors keep streaming, and the
  contrast is the alarm. An earlier pass without flow dots made gate trips
  feel arbitrary.
- **The adoption moment worked without a modal, because the motive is the
  economy.** Jam interval = 24s/lanes means the player's own greed (buy
  lanes for income) is what saturates their hands — HANDS hit 12/min around
  5 lanes. By the time the palette pulses, relief is *wanted*; the card is
  the offer and the red meter is the pitch.
- **Physical constraints do the storm arithmetic.** Responders must return
  to the bay to reload the runbook before the next dispatch. That single
  physical rule sets the service rate below the chatter's mint rate, so the
  flood emerges from logistics — nothing scripts the queue depth.
- **Deviation: the TANK is revealed at the storm, not at fluency.** Same
  trick as the palette itself — the next part is offered at the failure it
  fixes. Showing it earlier diluted the fix-as-relief beat.
- **Deviation: `handsFree` requires a calm bay (`stormQuelled`).** During
  the storm the player makes zero manual clears while everything burns; the
  60s window could complete mid-storm and "hands-free" would be a lie. The
  flag now also requires all active lanes probed and ≥1 responder.
- **Two rules borrowed from Scenario 01 turned out load-bearing:** the tank
  ships primed at its HI threshold (installing it during a stall must not
  itself mint an alert), and the degraded lane is excluded from the random
  jam schedule (a real jam on the flapping lane is indistinguishable from
  the flutter and muddies the ghost-visit story).
