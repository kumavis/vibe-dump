# Behaviors dimension: a data-driven behavior/AI vocabulary for the live-editable ECS scene

Researcher: "behaviors". Every number below comes from code that was run in
`/tmp/claude-0/-home-user-vibe-dump/f580ed5c-7e6e-5a9a-b50f-88ecc42cf4d9/scratchpad/research/behaviors/` (prototype in `proto/`).
Grades: **[V]** verified by running code, **[L]** likely (reasoned from verified pieces or docs), **[S]** speculative.

Versions tested: node 22.22.0, yuka@0.7.8, three@0.186.1, @automerge/automerge@3.5.0, ses@2.3.0, mistreevous@4.3.1, vite@5.4.21.

---

## 0. TL;DR (what the PM should take away)

1. **"The T-rex chases the sheep and the sheep runs away" comes out of about 10 general components plus a JSON filter language. Nothing in the code is specific to either animal.** [V] A 16.7 kB (6.3 kB gzip) vanilla ES-module prototype runs a T-rex, two sheep and a player riding a horse. The T-rex picks the nearest sheep, the sheep flees at 1.5x speed, the T-rex catches it at t=8.5 s, bites twice (25 dmg, 1.2 s cooldown), and the sheep dies at 9.7 s. The T-rex then switches to the rider and the horse, kills the rider at 18.3 s, and the riderless horse **bolts on its own**, with no code for that case: the controlling rider is gone, so the horse's own `flee` drive takes over.
2. **The core idea is "drives", each one a Bedrock-style filter plus a steering act.** `brain.drives` is a *map* of `{match: <filter>, act: pursue|flee|seek|wander|steer, weight, priority, range, speedMul, when?}`. A filter can test tags, components, numeric comparisons on *any component path of self or other* (e.g. `other.body.mass < self.body.mass * 0.25`), and derived relations (`targetsMe`, `myRider`). Because filters read arbitrary paths, **a component an agent invents at runtime is usable in existing drives without touching the brain system** [V] (see `hunger` in §8).
3. **Presets are just named bundles of components with `extends`. Entities point at a preset plus per-instance overrides, and Bedrock-style component *groups* (e.g. `dead`, `panicked`) are switched on by events.** Death is not special-cased. `on.died → addGroups:['dead']`, and the `dead` group removes `brain`/`attack`/`perception` (a `null` in a layer means "delete this component"). Resolution order: **preset chain → instance components → active groups** (state wins over authored data) [V].
4. **The visual representation is fully decoupled from behavior.** The sim writes only a *semantic* `live.anim` (`idle|walk|run|attack|die|sit`). Renderer adapters keyed by `representation.kind` map that to whatever they have: billboard bob → static mesh → clip with a fallback chain. Swapping billboard → mesh → animated mesh mid-run leaves the sim state hash **bit-identical** (`89589908` with and without upgrades) [V].
5. **Performance.** 300 entities cost **3.7 ms/tick** with the naive version and **1.45 ms/tick** with compiled filters plus staggered thinking every 3 ticks (Bedrock's `scan_interval` idea), on Node/x64 [V]. For comparison, Yuka with its own spatial index is 1.07 ms/tick for 300 vehicles that only do steering [V]. 1000 entities at thinkEvery=3 cost 9.6 ms/tick [V]. Budget roughly 3-4x that on Quest-class hardware [S].
6. **Multiplayer: per-entity single-writer ownership, not lockstep.** Players own themselves, a mount follows its rider's owner, and every other NPC belongs to an elected host (the lexicographically smallest live peer id). Only the *victim's owner* applies damage and decides death. Attackers on another peer send damage requests. The two-peer test passed: kills across owners worked, the host handed off when peer A left, and the handoff jump was 0.4-0.5 m [V].
7. **Never put per-tick sim state in Automerge.** 300 transforms per change cost **~45-50 ms per `A.change`**, and the doc grows by **~3 MB/min at 10 Hz** [V]. Health damage *should* be an **Automerge Counter**. Two concurrent bites of 25 and 8 merge to 33, while a plain number keeps only one (LWW → 8) [V]. Tags and drives must be **maps keyed by id, not arrays**: concurrent pushes duplicate list entries [V]. Automerge **does not preserve map key order** (it sorts keys) [V], so every iteration over drives, groups or systems must sort explicitly.
8. **Yuka: don't adopt it as the data model.** It is unmaintained since 2022-09-17 (0.7.8). It uses class instances with object references, and global `Math.random` (10 call sites), so per-entity seeding is impossible. Its full bundle is 122 kB (32 kB gz) and a tree-shaken steering subset is 51 kB (13.5 kB gz) [V]. The useful steering math is about 150 lines, so port it. Yuka's NavMesh could be pulled in later if pathfinding is needed.
9. **Behavior trees: not the primary mechanism.** mistreevous@4.3.1 accepts a JSON tree definition (11 kB gz), but a RUNNING action is never pre-empted by a newly true higher-priority condition unless you add guards. In the test, `wander` kept running after the threat appeared [V]. Running-node state is hidden instance state, not doc data. Utility drives re-evaluated every think tick are simpler, reactive and JSON-native.

---

## 1. Prior art studied, and what we take from each

### 1.1 Minecraft Bedrock entity JSON (the closest match to our needs)
Sources: learn.microsoft.com pages for `minecraft:behavior.avoid_mob_type`, `minecraft:behavior.nearest_attackable_target`, `minecraft:rideable` (fetched 2026-10-28).

- **Goals as components with `priority`** (lower number = higher priority). The predator/prey pair lives in two *components*, `nearest_attackable_target.entity_types` and `avoid_mob_type.entity_types`. Each is a list of `{filters, max_dist, walk_speed_multiplier, sprint_speed_multiplier, must_see, cooldown, ...}`.
  ```json
  "minecraft:behavior.avoid_mob_type": { "priority": 4,
    "entity_types": [{ "filters": {"test":"is_family","subject":"other","value":"wolf"},
                       "max_dist": 6, "walk_speed_multiplier": 1.2, "sprint_speed_multiplier": 1.2 }] }
  ```
- **Filters**: `{test, subject: self|other|target..., operator, value}` combined with `all_of / any_of / none_of`. Tests include `is_family` (tags), `in_water`, `enum_property`, `is_daytime`.
- **Component groups + events**: an event adds or removes named bundles of components (e.g. `spider_angry` vs `spider_hostile` carry different `nearest_attackable_target` settings). That is a data-only state machine.
- **`minecraft:rideable`**: `seat_count`, `seats[{position, lock_rider_rotation, ...}]`, `family_types` (who may ride), `controlling_seat`, `on_rider_enter_event`. Controllability is a *separate* component (`input_ground_controlled` / `behavior.controlled_by_player`).
- **`scan_interval`** (default 10 ticks): targeting is not re-evaluated every tick, and the doc notes that "values under 10 can affect performance".

**Taken:** the filter grammar (renamed to `tag/has/cmp/same/rel` + `all/any/not`), drive lists with speed multipliers and range, component groups toggled by events, seats with offsets plus a separate controller, and staggered scan intervals.
**Not taken:** one component per goal type (`avoid_mob_type`, `nearest_attackable_target`, `panic`, ...). Bedrock has about 100 hardcoded goal types. We collapse them into **one `brain.drives` map whose `act` is a steering verb**, so a new "goal" is data, not a new engine feature. Bedrock's filters also can't compare against arbitrary component paths; ours can (`cmp: ['other.body.mass','<','self.body.mass',0.25]`).

### 1.2 Flecs / Bevy relationships
- **Flecs** pairs: `Bob.add(Likes, Alice)`, wildcard queries `(Eats, *)` and `(*, Alice)`. Relationships fragment tables, so heavy use costs table creation and query matching. Flecs offers `DontFragment` (flecs.dev/flecs/Relationships.html).
- **Bevy 0.16** relationships: `#[relationship(relationship_target = LikedBy)] struct Likes(Entity)`. **The source side is the only truth, and the target side (`Vec<Entity>`) is maintained automatically by hooks.** "Both sides are not allowed to drive" because keeping both in sync is expensive. One-to-many only for now. `ChildOf`/`Children` are built on it (bevy.org/news/bevy-0-16).

**Taken:** in a CRDT doc, **store only the source side** (`rider.mount = "horseId"`, `intent.target` in live state) and *derive* the reverse (`mount` occupancy, `targetsMe`) at runtime. Storing both sides in Automerge invites concurrent half-updates. A derived index also gives a deterministic race rule: when two riders concurrently claim seat 0, **the first in id order keeps it and the other gets a `dismount` event** [V, `mount` system]. Relations are exposed to filters as `{rel: 'targetsMe' | 'myRider' | 'myMount' | 'isMounted'}`. A new relation is a named predicate registered alongside a system.
**Not taken:** archetype or pair storage. At our scale (hundreds of entities), plain objects plus a spatial hash are fast enough and stay JSON.

### 1.3 Yuka (Mugen87)
- npm `yuka@0.7.8`, last publish **2022-09-17** [V]. Ships `build/yuka.module.js` (ESM via the `module` field, no `exports` map). It works in Vite 5 and in Node ESM import [V].
- Size: `import * as YUKA` → 122.5 kB / 32.2 kB gz. A tree-shaken `{Vehicle, Seek, Flee, Wander, EntityManager}` → 50.8 kB / 13.5 kB gz [V].
- Features: steering (Seek, Flee, Arrive, Pursuit, Evade, Wander, Separation, Alignment, Cohesion, ObstacleAvoidance, FollowPath, Interpose, OffsetPursuit), `Vision`, `MemorySystem`, `StateMachine`, goal-driven `Think`/`GoalEvaluator`, `NavMesh` + A*, `CellSpacePartitioning`, `Regulator`.
- `Math.random` appears **10 times** in the module (Wander, MathUtils.randFloat/randInt, generateUUID, NavMesh random region) [V]. Two unseeded runs gave different positions. Patching `Math.random` globally made runs repeatable [V], but **per-entity seeding is impossible**, so a host handoff can't continue an entity's random stream.
- `toJSON()` exists, but it serialises a UUID graph of class state (`_cache`, `worldMatrix`, `steering`, ...) [V]. That is not a schema we would want agents to edit.
- Perf: 300 vehicles, wander + pursuit/evade, its own spatial index: **1.07-1.35 ms/tick** [V]. That is the same order as our whole pipeline.

**Verdict:** borrow its algorithms and leave the library. If navmesh pathfinding becomes a requirement, `NavMesh` + `AStar` can be imported à la carte later (cost about 30-60 kB [S]).

### 1.4 Behavior trees and utility AI in JS
- `mistreevous@4.3.1` (updated 2025-07): JSON or DSL definitions, 50.4 kB / 11.1 kB gz in Vite [V]. In the test tree `selector[sequence[cond SeesThreat, Flee], Wander]`, once `Wander` returned RUNNING, flipping `SeesThreat` to true did **not** pre-empt it: `wander,wander,wander` [V]. Reactivity needs explicit `while`/`until` guards on every node. Running-node state lives inside the tree instance, so it can't be handed off between peers or stored in Automerge without extra work.
- `behaviortree@3.0.0-beta.1` exists (updated 2026-03). Not tested; same structural issue [L].
- **Utility AI** (score each option, pick the max, with hysteresis) is stateless per think tick. It re-evaluates cleanly after any doc edit and is trivially JSON. That is what `brain.drives` is.

**Recommendation:** drives are the default mechanism. BTs/FSMs can be added later as *just another runtime system* that writes `live.intent` (with a `brain.kind: 'tree'` component) without changing anything downstream [L].

---

## 2. The vocabulary (recommended, minimal, general)

Everything is plain JSON. **Sets are maps** (`{predator: true}`), lists are only used for ordered small tuples, and keys are iterated *sorted*.

| component | shape (defaults) | consumed by | notes |
|---|---|---|---|
| `transform` | `{p:[x,y,z], yaw}` | spawn / rest snapshot | Authored or last-rest pose. **Live pose is NOT in the doc** (§9). |
| `body` | `{speed, accel, radius, mass}` | steer, integrate, separation, filters | `mass` doubles as a "size" scalar for predator/prey filters. |
| `tags` | `{creature:true, predator:true, ...}` | filters | Bedrock "family". A map so concurrent adds merge. |
| `species` | `"sheep"` | `same` filters (flocking, packs) | Any scalar can be compared with `same`. |
| `perception` | `{radius}` (+ later `fov`, `mustSee`) | perceive | Spatial hash, sorted by (distance, id). |
| `brain` | `{idle:'wander', stickiness:0.15, thinkEvery:3, drives:{<id>: Drive}}` | decide | Drive = `{match, when?, act, weight, priority, range, speedMul}`. |
| `attack` | `{damage, reach, cooldown, kind?, acts?:['pursue'], match?}` | attack | Default: hits the current intent target. `match` gives contact damage (cactus, lava). |
| `health` | `{max, armor, regen?}` | health | Damage taken lives in `entity.state.damage` (an Automerge **Counter**). |
| `on` | `{died:{addGroups:['dead']}, hurt:{addGroups:['panicked']}, killed:..., dealtDamage:...}` | events | Bedrock events → component groups, plus `patch`. |
| `controller` | `{kind:'input'}` (later `'agent'`, `'xr'`) | control | Input source: keyboard, XR thumbstick, or an agent puppet. |
| `rider` | `{mount: <id>\|null, seat: 0}` | control, mount | **Source of truth** for the ride relationship. |
| `mount` | `{seats:[{offset:[x,y,z], controls:true}], accepts:<filter>, panicPriority}` | control, mount | A controlling seat suppresses the brain unless a drive's priority ≥ `panicPriority` (a horse that bolts). |
| `representation` | `{kind:'billboard'\|'mesh'\|'sprite-sheet'\|..., src, size?, scale?, clips?:{idle:'Idle',run:'Run',...}}` | renderer only | Sim never reads it. Swap kinds by **replacing** the object. |
| `animation` *(optional)* | `{map?:{...}, speedRef?}` | renderer | The semantic state comes from the sim. This component only tunes the mapping. |

Preset-level (not per instance): `groups: {<name>: <component layer>}` and `extends: [presetNames]`.

### 2.1 Filter language (Bedrock-style, JSON)
```js
{ tag: 'predator' }                      // other has tag (subject:'self' to test self)
{ has: 'health' }                        // other has component
{ cmp: ['other.body.mass', '<', 'self.body.mass', 0.25] }   // path op path*k ; also 'live.self.hunger'
{ same: 'species' }                      // self.species === other.species
{ rel: 'targetsMe' }                     // derived relation predicate (registry)
{ all: [...] } / { any: [...] } / { not: {...} }
```
Compiled once per resolved entity into closures (cached on the resolved object, invalidated on edit). Compiling cut `decide` time by about 36% (1.72 → 1.10 ms at N=300) [V].

### 2.2 Acts (steering verbs, Reynolds)
`pursue` (seek with predicted target position), `seek`, `flee`/`evade` (inverse-square sum over all matches), `wander` (seeded per entity), `steer` (external vector: rider, player, agent), `ride` (no-op, the seat drives it), `idle`. They always blend with **containment** (soft wall at 85% of world bounds) and **separation**. Adding `arrive`, `follow(offset)`, `orbit` or `path` is one `else if` each, or one runtime system that writes `live.desired`.

### 2.3 Decision rule (utility with hysteresis)
For each drive (sorted by id): gate by `when` (a filter with `other = self`), collect sensed entities within `range` that match, and score
`u = weight * (1 - nearest/range) + priority + (currentDrive ? stickiness : 0)`.
The highest score wins. With no matches, use `brain.idle`. The output is `live.intent = {act, target, from[], speedMul, drive}`.

### 2.4 Presets: "aggressive T-rex", "sheep", "rideable beast" are bundles
```json
"predator": { "extends": ["creature"], "components": {
  "tags": {"predator": true},
  "brain": {"drives": {"hunt": {"act": "pursue", "speedMul": 1.25,
     "match": {"all": [{"has":"health"}, {"not":{"tag":"dead"}}, {"not":{"tag":"predator"}},
                        {"cmp": ["other.body.mass","<","self.body.mass",0.25]}]}}}},
  "attack": {"damage": 10, "reach": 0.8, "cooldown": 1.0}}},
"prey": { "extends": ["creature"], "components": {
  "tags": {"prey": true},
  "brain": {"drives": {
     "flee":  {"act":"flee", "weight":2, "priority":1, "speedMul":1.5, "range":14,
               "match": {"any": [{"tag":"predator"}, {"rel":"targetsMe"}]}},
     "flock": {"act":"seek", "weight":0.3, "match": {"all":[{"same":"species"},{"not":{"tag":"dead"}}]}}}}},
  "groups": {"panicked": {"body": {"accel": 20}}}},
"trex":  { "extends": ["predator"], "components": {"species":"trex", "body":{"speed":6,"mass":6000,"radius":1.5}, "health":{"max":300,"armor":2}, "perception":{"radius":30}, "attack":{"damage":25,"reach":1.5,"cooldown":1.2}, "representation":{"kind":"billboard","src":"trex.png","size":[4,4]}}},
"sheep": { "extends": ["prey"],     "components": {"species":"sheep", "body":{"speed":4.4,"mass":60}, "health":{"max":40}, "on":{"died":{"addGroups":["dead"]},"hurt":{"addGroups":["panicked"]}}}},
"horse": { "extends": ["prey"],     "components": {"species":"horse", "body":{"speed":9,"mass":500}, "health":{"max":80},
           "mount": {"seats":[{"offset":[0,1.6,-0.2],"controls":true}], "accepts":{"tag":"humanoid"}, "panicPriority":5}}}
```
- The T-rex chases the sheep because a 60 kg creature is lighter than 0.25 × 6000 kg. The sheep flees because the T-rex is tagged `predator` (**or** because it is targeting the sheep: `rel: targetsMe`, which also makes prey flee *any future hunter* that has no predator tag).
- **Rideable beast = add a `mount` component.** A "rideable T-rex" is `trex` plus a `mount` override. A vehicle is `{body, mount, controller-less}` with no brain.
- **An NPC that others respond to** = tags or components that other entities' filters match on. A "shepherd" NPC could carry a drive `{match:{tag:'predator'}, act:'pursue'}` plus `{match:{same:'faction'}, act:'seek'}`. Again, no new code.
- **Live-linked presets** (entities reference the preset by name and resolve at read time). Editing `doc.presets.sheep.body.speed` speeds up *all* sheep, and an agent can rebalance a species with one write. To detach, copy the resolved components into the entity and drop `preset`. **Cost:** resolution needs a cache. The prototype re-resolves only dirty entities; with Automerge, invalidate on the patch paths returned by `A.diff`/patch callbacks [L].

### 2.5 Groups and events (Bedrock component groups)
```json
"creature": { "components": { "on": {"died": {"addGroups": ["dead"]}} },
  "groups": { "dead": {"brain": null, "attack": null, "perception": null, "tags": {"dead": true}, "body": {"speed": 0}} } }
```
- Layering: **preset chain (extends, depth-first) → instance `components` → active `groups` sorted by name.** Groups go last on purpose: a player whose instance says `rider.mount = 'horse'` must still dismount when the `dead` group sets `rider:{mount:null}`. The prototype originally had the opposite order, and a dead player kept steering the horse. Fixed and verified [V].
- `null` in a layer deletes the component. Two prototype bugs came from merging group *definitions* with the same null-deleting merge, which silently dropped the `brain: null`. **Group definitions must be merged by replacement, not deep merge** [V].
- Event sources: `damage` (attack) → `hurt` and `died` (health; **edge-triggered** on the hp>0 → hp≤0 crossing). Without the edge trigger, two wolves biting in the same tick produced two `died` events [V]. `killed` and `dealtDamage` go to the attacker.

---

## 3. System order (fixed, with numeric gaps so runtime systems slot in)

```
  0 lifecycle   spawn/despawn queue, ownership recompute
100 perceive    spatial hash (cell 8 m) → live.sensed (sorted by distance, then id); staggered by brain.thinkEvery
200 decide      drives → live.intent                                   (owner only)
300 control     controller input → intent; controlling rider overrides mount brain unless panic
400 steer       intent → live.desired (pursue/flee/seek/wander/steer + containment + separation)
500 integrate   accel-limited velocity, speed cap, position, yaw
600 mount       riders snap to seat transforms; seat race → dismount event
700 attack      reach + cooldown → damage events
800 health      damage → state.damage Counter (victim owner only) → hurt/died (edge)
900 events      on.<event> → add/remove groups, patch components
950 (runtime)   e.g. user:hunger
1000 animate    semantic live.anim = die|attack|sit|run|walk|idle
---- render     (outside sim, per frame) representation adapters read live.p/yaw/anim, interpolate between fixed ticks
```
Fixed timestep 1/30 s. Rendering interpolates. **Order matters** in two places: `mount` must come after `integrate`, or riders lag a tick; `health` must come before `events`, so death removes the brain before the next decide [V].

---

## 4. Prototype run (T-rex, 2 sheep, player on horse), 30 Hz, 900 ticks [V]
`node proto/run.mjs` (excerpt):
```
--- t=2.0s
  bucephalus p=(  27.1, -15.0) v=9.0 hp=  80 intent=steer          (ridden: rider input)
  dolly      p=(  21.4,  10.6) v=6.6 hp=  40 intent=flee->rex<-rex  anim=run
  rex        p=(  10.6,   5.3) v=7.5 hp= 300 intent=pursue->dolly   anim=run
  shaun      p=( -21.1,  15.0) v=1.8 hp=  40 intent=wander           (too far to perceive rex)
--- t=10.0s
  dolly      p=(  58.4,  32.5) v=0.0 hp=   0 DEAD intent=- anim=die  (cornered against the containment wall)
  rex        p=(  56.8,  32.8) v=2.4 hp= 300 intent=pursue->ann      (retargets the nearest: the rider)
--- t=20.0s
  ann        hp=   0 DEAD anim=die
  bucephalus p=(  18.2,  53.3) v=13.5 hp= 30 intent=flee->rex        (riderless → own flee drive at 9*1.5 m/s)
  rex        intent=pursue->bucephalus
EVENTS:
  t=8.50s hurt dolly by rex hp=15
  t=9.70s hurt dolly by rex hp=-10
  t=9.70s died dolly by rex
  t=10.90s hurt bucephalus by rex hp=55
  t=13.47s hurt bucephalus by rex hp=30
  t=14.67s hurt ann by rex hp=75   ... t=18.27s died ann by rex
final rex representation: {"kind":"mesh","src":"trex.glb","size":[4,4],"clips":{...}}   (patched at t=15s and t=20s)
```
Note the stale `size` carried over from the billboard because the representation was *patched*. Recommendation: **`setRepresentation` replaces the whole object.** Under Automerge, a concurrent replace wins over a concurrent field patch (the old object is gone) [V, §9 test 5]. That is the right semantics for "swap visual".

### 4.1 Determinism and representation independence [V] (`proto/determinism.mjs`)
```
baseline          { h: '89589908', deaths: [ 'dolly@291', 'ann@548' ] }
repr upgrades     { h: '89589908', ... }   billboard→mesh→clips→sprite-sheet mid-run: identical sim
reversed spawn    { h: '89589908', ... }   insertion order irrelevant (ids sorted, sensed ties by id)
baseline again    { h: '89589908', ... }
different seed    { h: '787d48e',  deaths: [ 'dolly@286', 'ann@543' ] }
```
Per-entity PRNG = `mulberry32(fnv1a(id) ^ worldSeed)`.

### 4.2 Representation adapters (three@0.186.1, headless) [V] (`proto/repr.mjs`)
```
t=50  rex anim=run  -> procedural:run (Sprite)      billboard: bob + tip over on die
t=250 rex anim=run  -> static (Group)               mesh, no clips yet
t=450 rex anim=walk -> clip:run (Group)             clips {idle,run} only: walk falls back to run
```
Adapter contract: `create(rep) → handle`, `anim(handle, semanticState, t, dt)`, rebuilt when `JSON.stringify(rep)` changes. Fallback chains (`walk → run → idle`, `attack → idle`, ...) mean **incremental art never breaks**: each new clip just gets used. Unknown `kind` → placeholder mesh. The `representation` is the *only* place three.js is touched.

---

## 5. Runtime extensibility (agent or human) [V] (`proto/runtime-ext.mjs`)
The agent sends JSON ops over CapTP. All of them land in the doc:
```js
['defineComponent', 'hunger', { doc: 'rises over time; resets on a kill', fields: { rate: {type:'number', default:0.05}, threshold: {...} } }]
['defineSystem', 'hunger', { order: 950, reads: ['hunger'], src: `(api, dt) => {
    for (const id of api.query('hunger')) { const c = api.get(id), l = api.live(id); l.hunger = Math.min(1, (l.hunger ?? 0) + c.hunger.rate * dt) }
    for (const ev of api.events()) if (ev.type === 'died' && ev.by && api.get(ev.by).hunger) { api.live(ev.by).hunger = 0; api.log('sated', ev.by) } }` }]
['patchPreset', 'predator', { components: { hunger: {rate:0.08, threshold:0.5},
    brain: { drives: { hunt: { when: { cmp: ['live.self.hunger', '>', 'self.hunger.threshold'] } } } } } }]
['definePreset', 'wolf', { extends: ['predator'], components: { species:'wolf', body:{speed:6.2, mass:40}, ..., brain:{drives:{
    hunt: { match: {all:[{tag:'prey'},{not:{tag:'dead'}},{cmp:['other.body.mass','<','self.body.mass',3]}]} },
    pack: { act:'seek', weight:0.2, match:{same:'species'} } }} } }]
['spawn', 'wolf1', 'wolf', {transform:{p:[-35,0,25]}}], ['spawn', 'wolf2', ...]
```
Result: system order `100:perceive 200:decide ... 900:events 950:user:hunger 1000:animate`. The T-rex now wanders until hungry and *then* hunts. The sheep flee the wolves with **no change to the sheep preset** (wolves inherit the `predator` tag). The wolves pack via `same:species`. Log: `t=15.07s died shaun by wolf1; sated wolf1; t=15.57s died dolly by rex; sated rex`.

**Sandboxing:** the system source is evaluated in a SES `Compartment` (ses@2.3.0, after `lockdown()`), with only `Math` endowed and a hardened `api` facade (`query/get/live/events/log`). Probes: `typeof process`, `fetch` and `require` are all `undefined`, `Function("return this")().process` throws, and `Array.prototype` is frozen [V]. **This matters because system code in a shared doc runs on every peer that opens the link.** Remaining risk: an infinite loop or a huge allocation (DoS) is *not* prevented by Compartments. Mitigations: run user systems in a Worker with a watchdog [S], or require each viewer to "trust code from this scene" [L]. lockdown() compatibility with three.js and automerge-wasm in the browser is **not verified here**; another dimension (CapTP/SES) should check it. If lockdown breaks something, a fallback is a Compartment-only shim without lockdown (weaker), or a Worker.

**Recommended agent-facing ops** (all JSON in/out, all idempotent where possible): `spawn(id, preset, overrides)`, `despawn(id)`, `setComponent(id, name, value)`, `patchComponent(id, name, patch)`, `removeComponent`, `setGroup(id, g, on)`, `definePreset(name, def)`, `patchPreset(name, patch)`, `defineComponent(name, schema)`, `defineSystem(name, {order, src, reads})`, `removeSystem`, `defineRelation(name, src)`, `emit(event)`, plus queries `list(filter)`, `get(id)` (resolved), `getLive(id)`, `explain(id)` (why the brain chose its intent: return scored drives). Reference drives, groups and systems **by id, never by array index**: indices are unstable under concurrent edits [V for list duplication; L for index drift].

---

## 6. Performance [V] (`proto/bench.mjs`, `proto/bench-opt.mjs`; Node 22, this container)
Mix: 5% T-rex, 70% sheep, 15% horses, 10% players riding horses. 300 ticks after a 30-tick warmup.

| N | world half-size | variant | ms/tick | perceive | decide | steer |
|---|---|---|---|---|---|---|
| 300 | 120 m | naive | 3.71 | 1.39 | 1.72 | 0.29 |
| 300 | 120 m | compiled filters, numeric grid keys | 2.71 | 1.00 | 1.10 | 0.30 |
| 300 | 120 m | + thinkEvery=3 (staggered) | **1.45** | 0.43 | 0.44 | 0.28 |
| 300 | 40 m (crowded, ~30 sensed each) | naive | 10.29 | 2.65 | 7.07 | 0.27 |
| 300 | 40 m | opt + thinkEvery=3 | 3.13 | 0.91 | 1.55 | 0.35 |
| 1000 | 120 m | naive | 29.6 | 8.8 | 18.4 | 1.1 |
| 1000 | 120 m | opt + thinkEvery=3 | 9.58 | 2.90 | 3.99 | 1.37 |

Cost scales with *sensed neighbours* × drives, not with N. Remaining levers, not built: perception radius cap and `maxSensed`, typed-array positions, and running perceive+decide in a Worker [S]. Yuka for comparison: 1.07 ms/tick for 300 vehicles, steering and neighbourhood only.

---

## 7. What goes in the Automerge doc vs local live state

| data | where | why |
|---|---|---|
| presets, groups defs, component schemas, system sources, relations | doc | Authored, rarely changes, must be shared and saved. |
| entity `{preset, components (overrides), groups (map of true)}` | doc | Authored and state-machine state. Group toggles are rare events. |
| `state.damage` | doc, **Counter** | Concurrent hits must sum: 25 + 8 → 33 with Counter, 8 with plain number (LWW) [V]. |
| `transform` (rest pose) | doc, low rate | Written by the owner when the entity comes to rest, on ownership handoff, or every ~5 s, *incrementally*, so a late joiner or a reload sees a sane world. |
| position/velocity/yaw/intent/anim/cooldown/sensed/wander angle | **live, per peer** | Owner simulates, broadcasts ephemerally at 5-10 Hz, and others dead-reckon. |

Measured Automerge costs [V] (`proto/am.mjs`):
- 300 entities' transforms in one `A.change`: **44.7-49.6 ms/change** (arrays or scalar fields alike). 600 changes (10 Hz × 60 s) → **2983 KiB** saved; 1 Hz × 60 s → 303 KiB. One entity's transform per change: 0.093 ms, ~5 bytes/change after compression.
- 300 entities + 500 damage increments + group toggles: **10.7 KiB** total. Event-rate state is cheap.
- Presets round-trip, `null` preserved, but **map key order is not preserved** (keys come back sorted; equal modulo key order) → every iteration over drives, groups or systems sorts explicitly [V].
- `undefined` is rejected (`Cannot assign undefined value at /entities/...`). The editor API must strip undefined [V].
- `Counter` reads back as a `Counter` object. `structuredClone` turns it into `{value: n}`, so resolution must call `.value`/`+x` [V].
- Concurrent tag adds: list → `["creature","angry","angry","tamed"]` (duplicate); map → `{creature, angry, tamed}` [V].
- Concurrent replace vs patch of `representation`: the replace wins completely. Patch vs patch merges field-wise, which can leave stale fields [V].

Ephemeral snapshot size for 300 entities [V] (`proto/snapsize.mjs`): naive JSON 67 KB (659 KiB/s at 10 Hz), quantised JSON 13 KB (127 KiB/s), packed f32×5 6 KB (59 KiB/s). With 293/300 wanderers moving, delta-only doesn't help much. **Practical networked budget: tens of active NPCs, not hundreds** [L], unless intent replication (below) is used.

---

## 8. Multiplayer simulation authority, compared

| approach | how | pros | cons | verdict |
|---|---|---|---|---|
| A. Lockstep / everyone simulates everything | exchange inputs, deterministic sim | minimal bandwidth | Automerge edits land at different ticks on different peers → divergence; needs input delay, rollback, a tick-synchronised clock; one late doc edit desyncs forever | **No** |
| B. Single host simulates all NPCs | elected host broadcasts snapshots | simple, one writer | host CPU and upload scale with NPC count; latency for remote players fighting NPCs | OK as the default for unowned NPCs |
| C. **Per-entity owner (single writer per entity)** | players own self; mount → rider's owner; NPC → host (or pinned via `sim.owner`); victim's owner applies damage and death | interactions with your own mount are lag-free; load spreads; no write conflicts on sim state; handoff = new owner continues from last snapshot | needs presence/leases; cross-owner combat has one-way latency; ownership must be derivable identically on all peers | **Recommended** |
| D. Interest-based ownership | NPC owned by the nearest player's peer | lowest latency for local fights | ownership flaps; needs hysteresis/leases | Later optimisation on top of C |

Two-peer prototype [V] (`proto/multipeer.mjs`): peerA = host (rex, sheep), peerB owns `ann` and, through the ride relation, `bucephalus`. Snapshots and damage requests travel over a simulated wire. peerA leaves at tick 450.
```
latency=99ms snapshot=10Hz
max remote position error while both present: horse seen by A 0.49 m | rex seen by B 0.38 m
rex jump at host handoff (1 tick): 0.51 m (normal per-tick travel <= 0.26 m)
deaths logged by owner: dolly@291 (on A), ann@486 (on B)       ← rex (A) killed ann (B) via damage requests
latency=198ms snapshot=5Hz:  errors 1.16 m / 0.80 m, handoff jump 0.41 m, ann@575 (on B)
```
Outcomes differ from the single-peer run (ann died at 548 single-peer vs 486/575). That is expected and fine: **peers converge on the owner's truth; they don't replay identical histories.** The deterministic seeded sim still pays off: tests and replays are reproducible, and a new owner continues an entity's random stream plausibly.

Rules to implement:
1. `owner(id)` is a pure function of (doc, presence set): `doc.sim.owner[id]` pin → player/controller binding → rider's owner for a mount → `min(livePeerIds)`. Presence comes from automerge-repo ephemeral heartbeats, with ~3 s expiry [L].
2. Only the owner runs decide/steer/integrate/attack for an entity. Others dead-reckon (`p += v*dt`) and blend toward snapshots.
3. **Damage**: an attack on a non-owned victim → a `damage` request to the victim's owner, which increments the Counter and evaluates death (edge-triggered, single writer). The Counter still sums correctly if two peers ever both write [V]. Group writes are idempotent (`groups.dead = true`).
4. The owner writes the rest `transform` to the doc on handoff, on settle, and every N s, a few entities per change (≈0.1-0.15 ms per entity) [V].
5. **Intent replication** [S, not prototyped]: broadcast `intent` at think rate (it is already needed for `targetsMe`) and let non-owners run the cheap steer+integrate locally, corrected by 2-5 Hz snapshots. That cuts bandwidth by about 3-5x.
6. Must be identical everywhere: preset resolution, filter semantics, system order, `owner()`. Can diverge (cosmetic): non-owned entity poses between snapshots, animation phase, renderer state.

---

## 9. Recommendation, costs, what it forecloses

**Adopt:** the vocabulary in §2, the order in §3, and ownership model C, as vanilla ES modules (prototype 16.7 kB / 6.3 kB gz incl. presets). No Yuka, no BT library, no React needed for this layer.

**Costs:**
- A small filter language and resolver must be maintained and documented for agents. Debuggability needs an `explain(id)` query that shows drive scores.
- The steering "acts" are a closed enum in the core. New *movement styles* need a runtime system that writes `live.desired`. That is possible, but it is code, not data.
- Live-linked presets require cache invalidation on Automerge patches.
- Runtime systems need SES (or a Worker) and a trust prompt. DoS is unsolved by Compartment alone.
- Networked NPC count is bounded by bandwidth: tens comfortably, hundreds only with intent replication and quantisation.

**Forecloses / makes harder:**
- Exact replay across peers (lockstep): deliberately given up.
- Physics-accurate interaction between entities owned by different peers (e.g. a stack of rigid bodies split across owners). Acceptable for creatures; use host ownership for physics props.
- Archetype-ECS performance (bitECS/Flecs-style SoA). Fine below ~1000 entities. Switching later means changing the storage, not the JSON vocabulary.
- Bedrock-scale goal variety out of the box. We trade 100 built-in goals for one general drive plus extensibility.

---

## 10. Risks / open questions
- SES `lockdown()` compatibility with three.js and @automerge/automerge (wasm) in the browser: **untested here** (Node only).
- `rel: targetsMe` needs other entities' *intent*, which for remote entities exists only once intents are replicated. Without that, prey flee only tagged predators.
- Filter paths like `other.body.mass` are untyped. A typo silently fails (returns `false`). The editor and agent API should validate filters against `doc.components` schemas.
- `thinkEvery > 1` makes reaction latency up to 100 ms. Fine for animals; players and controlled mounts bypass it.
- Containment walls cause "cornered" deaths. Real terrain needs obstacle avoidance or a navmesh (Yuka NavMesh is an à-la-carte option).
- Hysteresis (`stickiness`) and utility formula tuning are heuristics; expect to tune per preset.
- No vertical dimension or terrain height in the prototype (y fixed). WebXR scenes need ground sampling in `integrate`.

## Files
- `proto/engine.mjs`: World, resolver (preset chain → instance → groups), filter evaluator, seeded RNG, editing ops
- `proto/systems.mjs`: core systems with order numbers and relation predicates
- `proto/opt.mjs`: compiled filters, numeric grid, staggered thinking
- `proto/presets.json`: creature / predator / prey / trex / sheep / horse / player
- `proto/run.mjs` (+ `run.log`), `determinism.mjs`, `runtime-ext.mjs`, `bench.mjs`, `bench-opt.mjs`, `am.mjs`, `multipeer.mjs`, `snapsize.mjs`, `repr.mjs`, `yuka-bench.mjs`, `bt.mjs`
- `vt-full/`, `vt-tree/`, `vt-bt/`, `vt-proto/`: Vite 5 bundle-size probes
