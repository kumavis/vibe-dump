# Slime Mold Foundry — Design Document

*Working title. Draft 1 — August 2026. Companion to prototype `scenario-01-dying-patch.jsx`.*

---

## 1. Vision

A factory automation game about climbing the abstraction ladder all the way to the top. The player begins by placing machines by hand and ends by tending a distributed organism that decides for itself where to grow, where to lie dormant, and where to consume its own limbs to fund extension elsewhere. The factory becomes a slime mold; the player becomes its endocrine system.

Existing automation games stall at the blueprint: a copy-paste artifact with no parameters, no interface contract, and no way for the game to check that two of them compose. This game treats that stall as the starting line.

**The generative rule for the whole design:** a new abstraction layer is only admitted if it introduces a failure mode that is invisible from the layer below. Every layer described in this document was tested against that rule, and each one's signature failure is listed alongside it. If a proposed mechanic doesn't create a new way to be wrong, it isn't a new layer — it's decoration on an old one.

## 2. Design pillars

**Control is physical.** The game has two worlds: the matter layer (ore, belts, machines) and the signal layer (probes, traces, gates), rendered as an elevated overlay. Signal infrastructure costs matter, occupies space, has bandwidth, and can be severed. The player climbs the abstraction ladder twice — once in matter, once in control — and the second climb is what makes the organism possible. Nothing in the control plane is free, which means observability is a purchase and its value is invisible until the outage.

**Computation is plumbing, never text.** No scripting language, no block programming, no node-graph editor with free wires on an infinite canvas. Node editors are boring because they have no scarcity. Instead, signals are goods: a probe on a smelter doesn't report `temp=840`, it emits heat-tokens at 840/min down a physical trace. Arithmetic is done with parts that jam, saturate, and starve — so every intuition the player built about belts transfers directly to logic. Building a control system feels like building another factory, because it is one.

**Policy is fluid, not rules.** The player never writes the organism's decision function. They compose a signal factory whose product is *value fluid*, and they pour it onto the map. It spreads, pools, decays. The mold grows into deep fluid and withdraws from dry ground. Tuning a growth policy means walking the terrain watching where your fluid actually goes. Goodhart's law is delivered as a puddle in the wrong place, not a stack trace.

**Debugging is descent.** Every layer's failure resolves at a lower layer. An organism-level oscillation is diagnosed in the alert layer, traced in the instrumentation layer, and fixed by hand at layer zero. Descending through your own past work should feel like spelunking into your own history — the factory is a legacy codebase you inherit from yourself.

**The two-color law.** Amber is matter, cyan is signal, blue is field. This color semantics is enforced everywhere — world rendering, HUD, iconography — so the player can read which world any element belongs to at a glance, at any zoom level. It is the game's single most important piece of visual language.

## 3. The layer stack

| # | Layer | Player verb | New artifact | Signature failure (invisible from below) |
|---|-------|-------------|--------------|------------------------------------------|
| L0 | Hand placement | Place, rotate, connect | Machines | Ordinary mistakes. Baseline for all cost intuition. |
| L1 | Capture & auto-build | Capture, stamp | Blueprints, builder bots | Context mismatch: valid where captured, invalid where stamped. |
| L2 | Instrumentation | Probe, trace, route | Probes, traces, meters | The unobserved fault — wrong somewhere you can't see, only infer downstream. |
| L3 | Alert routing | Wire conditions to responders | Alert tokens, runbook hoppers | Alert storms, flapping, responders thrashing against each other. |
| L4 | Vocabulary | Seal, name, type | Sealed modules with typed ports | Leaky abstraction: the contract is true and the behavior is still wrong. |
| L5 | Automated placement | Author siting constraints | Planner bots | Locally valid, globally stupid — a hundred correct placements composing into a bad factory. |
| L6 | Growth policy | Compose and pour value fluid | The gradient field | Goodhart. It optimizes exactly what you poured. |

**Progression discipline.** Layers unlock in order, and each unlock is gated on demonstrated fluency rather than tech cost alone — you earn L3 by having enough probes that manual watching becomes untenable, you earn L5 by having sealed enough vocabulary that a planner has something to place. The planner at L5 can only place what the player named at L4, so L5's power is a direct function of L4 discipline. That dependency is deliberate: sloppy vocabulary produces a stupid planner, and the game never hides that this was the player's own authorship coming back to them.

**The latency ladder.** Higher layers act on slower clocks. L3 responders are reflexes (seconds). L5 planning is deliberate (minutes). L6 is metabolic (hours). The same disturbance can trigger all three at different tempos, and a characteristic mid-game bug is a fast layer repeatedly undoing a slow layer's work. This is a real, teachable failure class, and the game surfaces it rather than smoothing it away.

**Downward pressure.** The layers are not a menu; they are a stack under tension. Sealing a module (L4) creates a proof obligation and a blast radius — reopening it invalidates everything downstream that assumed its contract, and the game shows that radius before the seal breaks. Granting an L6 policy the authority to resorb structures is an explicit ceremony, because it is the moment the organism gains the right to eat the player's work.

## 4. The signal layer

### 4.1 Parts list

All computation is done with physical parts placed in the overlay world. Each part is the embodiment of an operation, and each one fails visibly.

| Part | Behavior | What it computes | How it fails visibly |
|------|----------|------------------|----------------------|
| Probe | Emits tokens at a rate proportional to what it measures | Sampling | Emits nothing when its subject is dead — absence is the signal |
| Trace | Carries tokens; has bandwidth, length, and cost | Wiring | Congests, and can be physically severed |
| Merge | Two streams in, one out | Addition | Saturates at output bandwidth |
| Ratio gate | Passes output proportional to the smaller input | Multiplication | Starving one side visibly chokes the product |
| Weight valve | Physical throttle, tuned by dragging | Coefficient | Set wrong, everything downstream is proportionally wrong |
| Threshold gate | Opens above N tokens/min | Conditional | Chatters when input hovers at the threshold |
| Filter splitter | Routes by token type | Dispatch | Misrouted types pile up on the wrong branch |
| Decay pipe | Tokens evaporate over distance | Staleness | Old data is literally thinner |
| Tank | Buffers a stream; drains at fixed rate | Averaging, hysteresis | Overflow and empty are both readable at a glance |

The load-bearing example: hysteresis is not a config field. It is a tank placed in front of a threshold gate. A flapping alert is fixed by adding a buffer, exactly the way a starved assembler is fixed by adding a chest — same intuition, one floor up. The prototype's rig (probe → tank → gate → emitter) is the minimal composition of this system, and its gate-close event in Scenario 01 demonstrates the hysteresis band working: the tank drains from full through HI to LO before the gate commits to closing.

### 4.2 Alert routing without scripts

L3 is where the temptation to add a scripting language is strongest, and where it is most firmly refused. An alert is an item. A threshold gate that trips mints an alert token, which travels a trace to a sorting array, which belts it to a responder bot. Whatever blueprint is loaded in that bot's hopper is what it stamps in response. Writing a runbook is loading a hopper; routing alerts is sorting packages. The whole discipline of incident response is expressed in the game's native verb — logistics.

### 4.3 The value field

The terminal product of the signal layer is value fluid, poured onto the map by emitters. Field dynamics are simple and fixed: pour adds, diffusion spreads to neighbors, decay evaporates everything at a constant rate. Three thresholds govern the organism's response at any point:

- Field above the dormancy threshold: structures here run.
- Field below dormancy: structures sleep — upkeep continues, production stops, reactivation is cheap.
- Field below the resorb threshold for a sustained duration: the structure is marked for reclamation. A bot dismantles it and returns a fraction of its cost.

Dormancy economics are what make the organism's decisions interesting rather than obvious: dormant limbs cost little but hold position; reactivation has latency; resorption returns only a fraction. Retreat is never free and never total.

Growth follows comparative gradients, not absolute ones. The mold extends toward the deepest fluid it can reach *relative to where it already is* — in the prototype, Beta's thin survey field only wins once Alpha's field decays below it. This makes the organism conservative by default and opportunistic under starvation, which is the correct slime-mold temperament.

### 4.4 Blackout modes

Because control is physical, it can be starved. When a signal trunk is severed, the disconnected region enters one of two modes (chosen per organism-species, a strategic pick): **freeze** — last policy latched, slowly starving, safe but wasteful — or **feral** — local rules only, growing without central purpose, productive but unaligned. Restoring communications and reconciling what a feral region did while blind is a full gameplay loop, and the freeze/feral choice is one of the few places the game asks for an explicit strategic commitment rather than an emergent one.

## 5. Technical architecture

Validated in the Scenario 01 prototype; these are commitments, not aspirations.

**Rates, not items.** The simulation moves continuous rates through the graph — extraction/s, tokens/s, pour/s. No discrete item entities exist in the data layer. Discrete tokens exist only in the view, drawn at `frac(time · speed)` along precomputed polylines. Consequences: per-entity state is near zero, fast-forward is nearly free (32× costs 32 cheap ticks per frame), and "units recover off a basic timer" is literal — a bot is a job record `(kind, target, t0, duration)` and its position is derived, never stored.

**Hard data/view split.** `createSim()` contains no rendering code and imports nothing from three.js; `createView()` owns no game state and reads the sim each frame. The split paid for itself immediately: the sim runs headless under node, which turns gameplay verification into an automated test. The harness runs the full scenario and asserts the milestone timeline. Every future scenario ships with one. This is the project's CI for game design — balance changes are validated by replaying every scenario headless before they land.

**Tile abstraction.** The field lives on a coarse tile grid (4 world units in the prototype). Structures sense their tile neighborhood, not their exact cell. At far zoom the view collapses structures into aggregate tile quads colored by dominant state, and stops drawing tokens entirely. Three LOD tiers by camera distance: full tokens → structures and lines only → tiles and field only. The sim never changes; only the view's sampling of it does. This is the scaling story: a continental factory is a big Float32Array and a rate graph, not a million entities.

**Determinism target.** Fixed 100 ms tick, no randomness in the core loop. Two clients stepping the same inputs produce the same organism. This keeps the door open for replays, shared scenarios, and eventually multiplayer observation without committing to any of them now.

## 6. Prototype findings — Scenario 01

The prototype runs the complete grow/dorm/resorb loop unattended in ~98 sim-seconds: patch depletes → tank drains through the hysteresis band → gate closes → field decays → dormancy cascade → gradient reverses toward the survey beacon → planner queues growth → bots build the new outpost, partly funded by resorbing the old one.

**Bug found, promoted to content.** The first headless run failed catastrophically and instructively: the field didn't reach the outer structures, so the colony collapsed at T+0, and the mold then built the new outpost and *resorbed its own new structures* because the survey field was too thin to keep them alive. Colony self-cannibalization is a real pathology of this design — the field's reach defining the organism's body — and it is reserved as the premise of a future scenario rather than patched out of existence.

**Design rules extracted from the fix:**

1. *Neighborhood sensing.* A structure samples the max of its 3×3 tile neighborhood. Structures have footprints; point-sampling a field is too brittle to build a body on.
2. *Commissioning grace.* Freshly built structures are immune to dormancy for a warmup period. Without it, anything built at the field's edge dies before it can contribute to the field.
3. *Primed rigs.* A newly built signal rig ships with its tank at the gate-open threshold. A new outpost must be able to bootstrap its own signal loop; otherwise miners need the rig's field, the rig needs the miners' extraction, and the colony deadlocks at birth.

**Emergent behavior worth keeping.** Two beats appeared un-scripted. First: the new outpost's miners went dormant when their grace expired under the thin survey field, then were *revived* when the primed rig came online — the nervous system arriving and waking the limbs. Second: during a mid-build funding stall, the builder bots automatically switched to resorption jobs (refunds are always affordable), so the retreat literally financed the extension. Both are consequences of the rules, not scripting, and both are the exact fantasy the game is selling.

## 7. Scenario roadmap

Development proceeds as isolated scenarios, each a vertical slice proving one mechanic, unified into a single game only after each loop is independently fun.

| # | Scenario | Proves | Status |
|---|----------|--------|--------|
| 01 | Dying Patch | Grow/dorm/resorb loop; field dynamics; rig hysteresis | **Done** |
| 02 | The Jam | L3 alert routing: belt jam mints alert tokens, runbook hoppers respond | Next |
| 03 | Parts Bench | Placeable signal parts (merge, ratio, valve) replacing the hardcoded rig | Planned |
| 04 | Autophagy | The self-cannibalization pathology as a puzzle: diagnose and fix a field too thin for its own body | Planned |
| 05 | The Seal | L4 vocabulary: seal a module against a throughput contract, then face a leaky abstraction | Planned |
| 06 | The Planner | L5: siting constraints, and the locally-valid/globally-stupid failure | Planned |
| 07 | Severed Trunk | Blackout modes: freeze vs feral, and reconciliation after reconnect | Planned |
| 08 | Two Gradients | Competing emitters creating an oscillating organism; the latency-ladder bug | Planned |

Each scenario ships with its headless harness and a milestone checklist rendered in the HUD, so a scenario is simultaneously a design test, a regression test, and a tutorial level.

## 8. Open questions

**What exactly does the player author at L6?** Current answer: nothing textual — they compose the signal factory that produces the fluid, and the pour locations. Whether that gives enough expressive range for late-game policies (seasonal behavior, multi-resource tradeoffs) without reintroducing a language is the biggest open design risk. The Parts Bench scenario exists to pressure-test it.

**Reopening seals.** The blast-radius preview for breaking an L4 seal is designed but not prototyped, and it's the interaction most likely to need UI invention.

**Feral reconciliation.** What a feral region does while blind, and how merging its unsanctioned growth back into the organism feels, is unexplored. Scenario 07 carries this.

**Tuning surface.** The prototype's constants (dormancy 0.5, resorb 0.22 after 12 s, decay 0.18/s, gate band 2–6 of 10) produced a well-paced 98-second arc, but every one of them is a lever on the organism's temperament. The long-term intent is that most of these become *player-visible properties of parts* — a bigger tank, a longer decay pipe — rather than hidden globals, so tuning the organism is itself played in the world.

---

*Appendix: prototype constants live in the `P` object of `scenario-01-dying-patch.jsx` and are printed in the HUD legend. The headless harness (`harness.mjs`) extracts the sim by slicing the source and replays the scenario to completion, asserting the milestone timeline.*
