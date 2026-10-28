# merge-meadow research — behaviors

_Structured summary returned by the research agent (Opus 5.5), 2026-10-28. Every finding is graded verified / likely / speculative by what the agent actually ran._

## Summary

The T-rex chasing the sheep while the sheep runs away comes out of about 10 general JSON components plus a small filter language modelled on Minecraft Bedrock's filters. Nothing in the code is specific to either animal. I prototyped it in Node: 16.7 kB vanilla ES modules (6.3 kB gzipped).

**The core mechanism** is `brain.drives`, a map of drives. Each drive is `{match: filter, act: pursue|flee|seek|wander|steer, weight, priority, range, speedMul, when?}`, and the highest score wins with a little stickiness so targets don't flicker.
- **Filters** can test tags, components, number comparisons on any component path of self or other (`other.body.mass < self.body.mass * 0.25`), shared values, and derived relations such as `targetsMe` or `myRider`. A component an agent invents at runtime can therefore drive existing behavior without changing the brain system.
- **Presets** are named component bundles with `extends`. "Aggressive T-rex", "sheep" and "rideable beast" are each just a preset; a rideable beast is a preset plus a `mount` component.
- **Groups** are named component bundles switched on and off by events (Bedrock's component groups). Death is not special: dying turns on a `dead` group, which removes the brain, attack and perception components. Layer order is preset chain, then the entity's own components, then active groups.
- **Visuals** are decoupled. The simulation writes only a semantic animation state (idle, walk, run, attack, die, sit). Renderer adapters keyed by `representation.kind` map that onto a billboard, a static mesh, or animation clips with fallbacks. Swapping billboard to mesh to animated mesh mid-run left the simulation hash bit-identical.

**The prototype run:** the T-rex killed the sheep, then the rider. The riderless horse then fled on its own, with no code for that case.

**Runtime extension works.** An agent-defined `hunger` component, a system sent as source text (run in a SES Compartment), and a new `wolf` preset all ran with no core changes. Sheep fled the wolves without any edit to the sheep preset.

**Performance at 300 entities:** 3.7 ms/tick naive; 1.45 ms/tick with compiled filters and staggered thinking (every 3 ticks).

**Multiplayer: one writer per entity.**
- Players own themselves, a mount follows its rider's owner, and other NPCs belong to an elected host.
- Only the victim's owner applies damage and decides death.
- Health damage is an Automerge Counter, so concurrent hits add up.
- Per-tick motion never goes in the doc: one change covering 300 entity transforms took about 45 ms and grew the doc by about 3 MB a minute at 10 Hz.
- The two-peer test worked: kills across owners, and a host handoff with a 0.4–0.5 m position jump.

**Libraries:** Yuka and behavior-tree libraries are not worth adopting as the data model.

## Findings

- **[verified]** Chase/flee/damage/death emerges from general components only (no species code).
  - _Evidence:_ proto/run.mjs, 30 Hz × 900 ticks. The T-rex picks the nearest sheep (mass 60 < 0.25×6000), the sheep flees (tagged predator OR targetsMe) at 1.5×. Hits at 8.5 s and 9.7 s; the sheep dies at 9.7 s. The T-rex retargets the rider, which dies at 18.27 s; the riderless horse switches from steer to its own flee drive at 13.5 m/s.
- **[verified]** Representation upgrades (billboard→mesh→clips→sprite-sheet) do not affect simulation.
  - _Evidence:_ proto/determinism.mjs: sim hash 89589908 identical for baseline, with mid-run representation swaps, with reversed spawn order, and on a rerun; a different seed gives 787d48e. proto/repr.mjs with three@0.186.1: Sprite with procedural bob, then a static Group, then AnimationMixer clips with fallback walk→run→idle.
- **[verified]** Agent can add a new component, a system (source string) and a preset at runtime, and existing drives use it with zero core changes.
  - _Evidence:_ proto/runtime-ext.mjs. Defines `hunger` and a system at order 950, evaluated in a SES 2.3.0 Compartment after lockdown. Patches the predator hunt drive with when: cmp live.self.hunger > self.hunger.threshold, adds a wolf preset, spawns 2 wolves. Sheep fled the wolves unmodified; log: died shaun by wolf1 at 15.07 s, sated wolf1, died dolly by rex at 15.57 s. In the sandbox, process, fetch and require are undefined and Array.prototype is frozen.
- **[verified]** Cost per tick at 300 entities is low; staggered thinking (Bedrock scan_interval) is the main lever.
  - _Evidence:_ bench.mjs/bench-opt.mjs, Node 22: N=300 naive 3.71 ms (perceive 1.39, decide 1.72); compiled filters 2.71 ms; plus thinkEvery=3 1.45 ms. Crowded (40 m world, ~30 sensed each): naive 10.3 ms, optimised 3.13 ms. N=1000: naive 29.6 ms, optimised 9.58 ms. Yuka with 300 steering-only vehicles: 1.07 ms.
- **[verified]** Per-tick transforms must not be written to Automerge; event-rate state is cheap.
  - _Evidence:_ am.mjs, automerge 3.5.0: one A.change covering 300 transforms costs 44.7–49.6 ms; 600 changes (10 Hz × 60 s) save to 2983 KiB, 60 changes to 303 KiB. One entity per change: 0.093 ms. 300 entities with 500 damage increments and group toggles: 10.7 KiB.
- **[verified]** Health damage should be an Automerge Counter; sets (tags, drives) must be maps keyed by id; map key order is not preserved.
  - _Evidence:_ am.mjs: concurrent hits of 25 and 8 merge to 33 with a Counter but 8 with a plain number (last writer wins, conflict recorded). Concurrent tag pushes to a list give ['creature','angry','angry','tamed']; a map gives {creature, angry, tamed}. Presets round-trip equal only modulo key order. undefined values are rejected. Counter becomes {value} under structuredClone.
- **[verified]** Per-entity single-writer ownership works for multiplayer, including kills across owners and host handoff.
  - _Evidence:_ multipeer.mjs, 2 peers. At 99 ms latency and 10 Hz snapshots, max remote position error is 0.49 m (horse seen by A) and 0.38 m (T-rex seen by B); handoff jump 0.51 m when peerA leaves. At 198 ms and 5 Hz: errors 1.16 m and 0.80 m, jump 0.41 m. The rider (owned by B) was killed by the T-rex (owned by A) via damage requests, and B logged the death once. Outcomes differ from the single-peer run (by design).
- **[verified]** Death and seat claims must be edge-triggered or deterministically resolved under concurrency.
  - _Evidence:_ Two wolves biting in the same tick produced two died events until health switched to an edge trigger (before > 0 and hp ≤ 0). The mount system gives a contested seat to the lowest id and emits dismount for the other. Groups must layer after the entity's own components: with the opposite order, a dead player kept steering the horse.
- **[verified]** Yuka should not be the data model; port its steering math instead.
  - _Evidence:_ yuka@0.7.8, last publish 2022-09-17. 10 Math.random call sites in the module; unseeded runs diverged, a global patch makes them repeat, and per-entity seeding is impossible. toJSON is a UUID graph of class state. Vite 5 bundle: full 122.5 kB (32.2 kB gz), tree-shaken steering subset 50.8 kB (13.5 kB gz). It works as ESM.
- **[verified]** Behavior-tree libraries are a poor primary mechanism here.
  - _Evidence:_ mistreevous@4.3.1: JSON definition, 50.4 kB (11.1 kB gz). In selector[sequence[SeesThreat, Flee], Wander], a running Wander was not pre-empted when the threat appeared (log: wander,wander,wander). Running-node state is hidden in the tree instance, so it can't sit in the doc or be handed off between peers.
- **[likely]** Ephemeral snapshot bandwidth limits networked NPC count to tens unless intents are replicated.
  - _Evidence:_ snapsize.mjs: a 300-entity snapshot is 67 KB as naive JSON, 13 KB quantised, 6 KB packed f32. At 10 Hz that is 659, 127 and 59 KiB/s; 293 of 300 entities were moving. Intent replication would cut this further (estimated 3–5×; not prototyped).
- **[speculative]** SES lockdown may conflict with three.js or automerge-wasm in the browser.
  - _Evidence:_ Only tested in Node. Not verified in a browser build.

## Recommendation

Adopt the vocabulary, the fixed system order and the ownership model below, as vanilla ES modules. No Yuka, no behavior-tree library, no React for this layer.

**Components:** transform, body, tags (a map), species, perception, brain.drives (a map), attack, health with an Automerge Counter for damage, `on` (events to groups), controller, rider.mount (the only stored side of the ride relationship), mount.seats, representation (renderer only), and an optional animation component.

**Presets** use `extends` and are linked by name, so editing a preset updates every entity using it. **Groups** layer last.

**System order:** perceive (100), decide (200), control (300), steer (400), integrate (500), mount (600), attack (700), health (800), events (900), runtime systems (950), animate (1000). Fixed 30 Hz tick; rendering interpolates.

**Multiplayer:** one writer per entity. Players own themselves, a mount follows its rider's owner, NPCs go to the host (lowest live peer id) or to an explicit owner pin, and the victim's owner applies damage and decides death. Live pose and intent go over ephemeral messages at 5–10 Hz; the doc only gets occasional rest-pose snapshots.

**Agent API:** JSON ops that address drives, groups and systems by id, never by array index. Include an `explain(id)` query.

**What this costs:**
- A small filter language and resolver to maintain and validate against component schemas.
- The steering verbs are a fixed list in the core; a new movement style needs a runtime system.
- Preset cache invalidation driven by Automerge patches.
- SES or a Worker plus a trust prompt for user-written systems; runaway loops are not prevented by the sandbox alone.
- A bandwidth budget of tens of networked NPCs, unless intents are replicated.

**What it rules out or makes harder:**
- Exact lockstep replay across peers (given up on purpose).
- Rigid-body physics that crosses owners (use host ownership for physics props).
- Archetype-ECS performance at 1000+ entities. The storage could change later without changing the JSON vocabulary.
- Bedrock's roughly 100 built-in goal types; we trade them for one general drive plus extensibility.

## Risks

- SES lockdown() compatibility with three.js and @automerge/automerge (wasm) in a browser bundle is untested; only Node was tested.
- System code stored in a shared doc runs on every peer that opens the link. A Compartment blocks access to globals but not runaway loops or memory blowups; this needs a Worker watchdog or a 'trust this scene's code' prompt.
- The `targetsMe` relation needs other entities' intents. For entities owned by another peer that requires replicating intents; without it, prey flee only tagged predators.
- Filter paths are untyped strings, so a typo silently evaluates to false. The editor and agent API must validate filters against `doc.components` schemas.
- Automerge does not preserve map key order, so every iteration over drives, groups or systems must sort explicitly or peers will diverge.
- Writing per-tick motion into the doc is about 45 ms per change and about 3 MB a minute; a naive implementation would kill performance and the saved doc.
- Networked NPC count is bounded by snapshot bandwidth (about 127 KiB/s for 300 quantised entities at 10 Hz) and needs interest management or intent replication.
- Utility weights and stickiness are heuristics and need per-preset tuning. The containment walls cause cornered kills, and real terrain needs obstacle avoidance or a navmesh.
- No ground height or vertical movement in the prototype (y is fixed); WebXR terrain needs ground sampling in the integrate step.
- Ownership flapping on presence churn: needs leases or hysteresis (about 3 s expiry assumed, not tested against the real automerge-repo ephemeral channel).

## Versions tested

- `node@22.22.0`
- `yuka@0.7.8`
- `three@0.186.1`
- `@automerge/automerge@3.5.0`
- `ses@2.3.0`
- `mistreevous@4.3.1`
- `vite@5.4.21`

Long-form report with code and numbers: [`behaviors-report.md`](./behaviors-report.md)
