# AGENTS.md — working in merge-meadow

This is the playbook for adding things to Merge Meadow, above all **creatures**.
The user-facing reference is [README.md](./README.md) (the model format, the
expression language, the agent verbs), the contract between directories is
[ARCHITECTURE.md](./ARCHITECTURE.md), what is verified and what is known to be
missing is [STATUS.md](./STATUS.md), and the decisions behind all of it are in
[docs/design-merge-meadow.md](../../docs/design-merge-meadow.md) (§17 rigs,
§18 launcher and templates). The repo-wide rules (committed `dist/`,
thumbnails by hand, lockfile commits) are in the root [CLAUDE.md](../../CLAUDE.md).

## The rule: a creature is data, never code

Round one shipped a `critter` render kind: the T-rex, the sheep and the horse
were JavaScript, one hand-built skinned mesh per species, with the walk cycle
in code. Adding an animal meant adding a case to the renderer, and the twelve
zodiac animals showed it could not stretch that far. Round two threw it out.

Since then a creature is two pieces of data in the document:

| piece | what it is | where it lives |
| --- | --- | --- |
| a **rig model** | geometry (a tree of named nodes), clips (tracks of expressions or keyframes, additive to the rest pose) and a controller (sim state → clips). Usually a patch over a base: `quadruped`, `biped`, `serpent` or `bird`. | `doc.models.<name>`; the shipped ones in `src/doc/models.js` (`MODEL_LIBRARY`) |
| a **preset** | behaviour as components (tags, body, perception, brain drives, attack, health, mount, light, `on` reactions), the palette `icon`, and the look `{ kind: 'rig', model: '<name>' }`. Extends `creature`, which brings the `dead` group. | `doc.presets.<name>`; the shipped ones in `src/doc/presets.js` (`PRESETS`) and `src/doc/presets-zoo.js` (`ZOO_PRESETS`) |

Nothing in `src/render`, `src/sim`, `src/editor` or the agent knows a species.
`src/render/kinds/rig.js` builds whatever the model says; `src/sim` runs
whatever the drives say; the palette shows whatever presets the doc has, with
their own icons. Behaviour a creature needs that the vocabulary cannot say
goes in a **doc system** (an ES module stored as text, run by every peer in a
Compartment), not in a built-in.

So, when asked for a new animal, a person, a monster:

- **Do not** add a render kind, a `switch` on a species name, a per-species
  system, or a special case in the reconciler, the sim or the editor.
- **Do** write a model and a preset. If the vocabulary genuinely lacks
  something (a node field, an expression variable, a drive act, a component),
  extend the vocabulary once, generically, with a test, and then write the
  creature as data on top of it. That is the whole point: the phoenix below
  needed no code at all.

## Two ways to add a creature

### A. Into a live world, with the agent CLI (no code, no build)

This is how the phoenix was made. Everything is a doc write; the tab that has
the world open applies it live and every peer sees it.

```bash
L='http://127.0.0.1:5173/#doc=automerge:…&key=…'          # the world's edit link
cd packages/merge-meadow
node agent/cli.mjs "$L" models                           # what the doc already has (bases to extend)
node agent/cli.mjs "$L" model bird                       # one model, resolved: its node names and clips
node agent/cli.mjs "$L" define-model phoenix --file phoenix.json
node agent/cli.mjs "$L" define-preset phoenix "$(cat phoenix-preset.json)"
node agent/cli.mjs "$L" define-system phoenix-rebirth --file phoenix-rebirth.mjs
node agent/cli.mjs "$L" spawn phoenix --at 11,0,-2 --name Ember
node agent/cli.mjs "$L" explain <id>                     # its drive scores, target, hp, anim, owner
node agent/cli.mjs "$L" capture shot.jpg                 # a screenshot from the open tab
```

An invalid model is refused before anything is written, with the track and the
expression column. A model defined this way lives in that world only; to put it
in every new world, do B as well. The library is added to a document only when
it has no `doc.models` at all, so an existing world never gets new library
models by itself and a model someone removed is never put back.

The user does not want a test cycle for live edits: when the ask is "change
this world", make the writes, look at the result (`explain`, `capture`), and
stop. Do not touch the source for a live edit.

### B. Into the library, shipped with every new world

1. **The model** — `src/doc/models.js`. A `const <name> = { extends,
   description, stride, runSpeed, nodes, animations, controller }` next to its
   relatives, built with the file's helpers (`box`, `pivot`, `pair` for a
   left/right pair, `mirrorTree`, `quad`/`qlegs` for four-legged patches,
   `each` for per-segment tracks). Add it to `MODEL_LIBRARY` (`LIBRARY_ORDER`
   sorts bases before species by itself) and, if it is a zoo animal, to
   `ZOO_MODELS` (a test asserts that list). It must round-trip through JSON:
   no functions, no `undefined`, no `-0` (use `neg()`).
2. **The preset** — `src/doc/presets-zoo.js`:
   `name: zoo('🦅', 'name', { tags, body, perception, brain, attack, health })`,
   with drives from `hunt(tags, weight, range)`, `flee(weight, range, match)`
   or `drive(act, match, extra)`. The core presets (`src/doc/presets.js`) win
   a name clash with the zoo.
3. **The template**, optionally — a row in `ZOO_SPOTS` in
   `src/doc/templates.js` places one in the Animal meadow; `NAMES` there gives
   it a display name other than its capitalised preset.
4. **Tests that name the library.** Most counts are computed from
   `MODEL_LIBRARY` and `ZOO_PRESETS` (the e2e's are), but these lists are
   written out and must grow with it: `test/unit/m-zoo.test.mjs` (`NEW`,
   `BASE`, `ICONS`, and its measurements: feet within 3 cm of the ground, the
   head anchor above the body bone, a sensible size, the lowest point between
   −0.12 and 0.16 m over 45 walk frames), `test/unit/d-tree.test.mjs` (the
   palette's names), `test/unit/l-templates.test.mjs` (`ZOO_ANIMALS`) and
   `test/unit/a-doc.test.mjs` (who is `prey`) if the meadow changes. The e2e
   `rigs` phase spawns every zoo preset from the palette and checks its icon
   with no edit.
5. **The README** — the library table and the count in "Rigs: models are
   data" are prose; update both.
6. **Verify** (from `packages/merge-meadow`):

   ```bash
   node --test "test/unit/*.test.mjs"      # ~18 s
   node scripts/boundaries.mjs --strict    # import boundaries
   npm run build -w @vibe-dump/merge-meadow   # from the repo root
   CHROMIUM_PATH=/opt/pw-browsers/chromium-<build>/chrome-linux64/chrome node test/e2e.mjs   # ~85 s
   ```

   Then look at it (next section), and finish with the root playbook's
   `npm run build && npm run verify` and a re-shot thumbnail if the meadow
   template changed.

A library model edited later changes every species that extends it, in every
*new* world; worlds made earlier keep the copy they have.

## Writing a model: what the README does not tell you

- **Patch by name.** In an extending model, `{ name: 'head', color: … }`
  patches the base's `head`; a node with a new name is added under the base
  node whose `children` it sits in, and needs a `shape` or a `p` (a bare name
  is read as a typo and refused, with a "did you mean"). `remove: true`
  deletes a base node and its subtree; `null` drops a field, a clip or a
  track. Unnamed nodes are static parts, not bones: they cannot be animated.
- **Track arithmetic.** `rx ry rz` and `px py pz` add to the rest pose;
  `sx sy sz` multiply the rest scale, so `1` is "unchanged". A near-invisible
  flame cone at rest scale `0.005` becomes a burst with
  `'flame.sx': '1 + 59*saturate((st - 0.2)/0.2)'`.
- **Which variable.** `phase` for legs (distance walked, so feet never slide),
  `t` for beats that are not tied to walking (wings, a wagging tail), `gait`
  to scale an effect with speed, `st` inside a `once` clip, `rand` and `idx`
  to desynchronise a herd. `pi` and `tau` are constants.
- **Flight.** The sim keeps every body on the ground; a flyer lifts its whole
  rig with `'root.py': '1.2 + sin(t*1.6)*0.1'`. Put that track in *every*
  state (idle, walk, run and the attack clip), because a state's offsets blend
  out when the state changes, and start the `die` clip at the hover height.
  The seat anchor rides with the rig, so a rider is lifted too.
- **`once` clips hold their last frame.** `die` must end in the resting pose.
  Keep the lowest point above about −0.12 m, which is where the zoo test draws
  the line; a rig rolled onto its side swings its spread wing underground, so
  a flyer collapses flat instead.
- **Attack and die are states, not clip names.** Map them in the controller
  (`controller: { states: { attack: 'flare', die: 'burn' } }`) and set the
  base's `attack: null` / `die: null` if you replace them. A state with no
  clip falls back (run → walk → idle; attack and sit → idle).
- **Budget.** Every shaped node is a draw call: a library model stays under
  about 40 nodes (16–20 draw calls per rig; 300 rigs cost 4–8 ms of
  reconciler CPU per frame). No emissive materials and no transparency: for a
  glow give the preset a `light` component.
- **Validate before you write.** Ten lines of Node catch everything the
  renderer would refuse, with no browser:

  ```js
  import { validateModel, resolveModel, MODEL_LIBRARY } from './src/doc/models.js'
  const problems = validateModel(model, MODEL_LIBRARY, { name: 'phoenix' })
  if (problems.length) throw new Error(problems.join('\n'))
  const r = resolveModel({ ...MODEL_LIBRARY, phoenix: model }, 'phoenix')   // nodes, clips, controller as rendered
  ```

## Writing a preset: the behaviour vocabulary

Everything emerges from these components; there is no per-species code to
call. Extend `creature` for the `dead` group (greys the look and strips
`brain`, `attack`, `perception`, `controller`, `rider` and `body`).

| component | fields | notes |
| --- | --- | --- |
| `tags` | `{ name: true }` | what others filter on: `prey`, `predator`, `person`, `rodent`, a species tag |
| `body` | `speed` m/s, `accel`, `radius` | fairness is a design choice: sheep 6.5 beats T-rex 6, pig 4 does not |
| `perception` | `radius` | what the brain can see |
| `brain.drives` | `{ act, match, when, range, weight, priority, speedMul, distance }` per drive | acts: `pursue`, `flee`, `seek`, `follow` (stops at `distance`), `wander`, `steer`, `idle`; `match` is `{ tags, anyTags, notTags }` (always `notTags: ['dead']`); score = weight·(1 − d/range) + priority, the best wins, `idle` is `wander` by default |
| `attack` | `damage`, `reach`, `cooldown`, `match` | `match` strikes any sensed match in reach instead of the pursued target |
| `health` | `max`, `armor` | hp = max − Σ max(0, hit − armor): damage at or below the victim's armor is a display attack that cannot hurt (the phoenix flares at the T-rex, armor 2, with damage 2) |
| `mount` | `seats: [{ name, anchor, offset, controls }]`, `panicPriority` | `anchor: 'seat'` uses the rig's seat node; a controlling seat steers unless the winning drive's `priority` is ≥ `panicPriority` (so a mount can bolt from a predator under its rider) |
| `light` | `kind`, `color`, `intensity`, `distance`, `offset` | the only glow there is |
| `on` | `{ <event>: { add: [groups], remove: [groups] } }` | reactions to `died`, `hurt`, `hit` or any type a system emits; groups are preset-defined component overlays |
| `representation` | `{ kind: 'rig', model }` | the look; `tint` is a colour overlay |

Think about what the creature does to the world it joins. A guardian that
pursues predators with real damage kills the meadow's T-rex in half a minute;
that is a different world, not a new animal, and the user should ask for it.

## Behaviour beyond the vocabulary: a doc system

A doc system is an ES module stored as text, compiled in its own Compartment
on every peer, with `world` and `log` and nothing else. Through `world` it can
`query`, `get`, `owns`, `nearby`, `set`, `addGroup`, `removeGroup`, `emit`,
read `events`, `rand`, `time` and `dt`, and write `live` state of entities it
owns; `spawn` is for the host. Write only entities the peer owns (`e.owned`),
or every peer writes the same thing. A `set` patch with `null` deletes a field,
which is how a health ledger is cleared.

The phoenix's rebirth, complete:

```js
// phoenix-rebirth: a dead phoenix smoulders in its ashes for ASHES seconds, then
// its wounds are cleared from the health ledger and a `reborn` event lifts the
// dead group (the preset's on.reborn), so it rises and flies again.
const ASHES = 6
let ashes = {}
export default {
  init (world, hot) { ashes = hot.prev.ashes ?? {}; hot.data.ashes = ashes },   // survives a hot swap
  update (world) {
    for (const e of world.query('tags', 'health')) {
      if (!e.c.tags.phoenix) continue
      if (!e.groups.includes('dead')) { delete ashes[e.id]; continue }
      if (!e.owned) continue
      if (ashes[e.id] === undefined) { ashes[e.id] = world.time; continue }
      if (world.time - ashes[e.id] < ASHES) continue
      const clear = {}
      for (const k of Object.keys(e.c.health.hits ?? {})) clear[k] = null
      world.set(e.id, 'health', { hits: clear })
      world.emit({ type: 'reborn', id: e.id })
      delete ashes[e.id]
      world.log('phoenix ' + e.id + ' rises from its ashes')
    }
  },
}
```

with `"on": { "died": { "add": ["dead"] }, "reborn": { "remove": ["dead"] } }`
in the preset. Doc systems run at order 950, after health (800) and the `on`
reactions (900) and before animation; a system that throws is suspended after
30 errors, one that hangs costs a safe-mode load. Prefer a system over a new
built-in whenever the behaviour is about one kind of creature. A built-in
(`src/sim`, with an `ORDER` slot) is for engine rules every entity obeys.

## Looking at it

Numbers do not catch a wing that reads as a plank. Before calling a creature
done, look at it in at least one of these:

- **The editor.** `npm run dev -w @vibe-dump/merge-meadow`, open
  `/#new=blank&sync=none`, spawn it from the palette, select it, and set the
  inspector's **preview** to each state (`walk`, `run`, `attack`, `die`) to
  play the clips with the sim idle. **Fork** copies a library model under a
  new name so the `nodes` box can be edited live.
- **A live world.** `node agent/cli.mjs "$L" capture shot.jpg` after
  spawning; it shoots the open tab's view, so it shows what the user sees.
- **A scratch harness.** The zoo and the phoenix were checked with a throwaway
  Vite page in the scratchpad that boots the real `makeScene`, `makeResources`,
  `makeReconciler` and `KINDS` over an in-memory automerge doc, defines the
  model with `applyOps`, spawns one rig walking in a circle and screenshots
  `show(model, state, seconds)` from a framed camera under Playwright. It is
  ~150 lines and not in the repo; `test/unit/m-zoo.test.mjs` shows the same
  modules driven from Node, which is where its measurements came from.

## Conventions for this package

- Commit messages start with `merge-meadow:`.
- Every verified claim and every known gap goes in `STATUS.md`, with the test
  that proves it; an interface change gets an amendment in `ARCHITECTURE.md`;
  a decision gets a section in the design doc. Record what was *not* checked
  as plainly as what was.
- `scripts/boundaries.mjs` is the law on imports: `src/doc`, `src/core`,
  `src/sim` and `src/scripts` never import three.js or the DOM; `src/render`
  and `src/xr` hold the only three.js code.
- Rebuild the gallery and re-shoot the thumbnail per the root playbook when the
  Animal meadow template or the launcher changes; the thumbnail is shot through
  the launcher's clicks named in `package.json`.
