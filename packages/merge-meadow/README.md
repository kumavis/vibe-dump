# Merge Meadow

A shared three.js world whose whole authored state is one
[Automerge](https://automerge.org) document. Open the link and you are in the
same meadow as everyone else who has it. You can edit it from a desktop editor,
from inside WebXR, or by handing an AI agent a capability so it can edit the
world live while you watch.

Everything in the world is an entity made of plain JSON components. Behaviour
comes from those components, not from code about particular animals. Add a
T-rex and a sheep, and the T-rex hunts while the sheep flees, because one
carries `predator` and a `pursue` drive and the other carries `prey` and a
`flee` drive. Health, damage, riding and death are presets over the same small
vocabulary. You can change an entity's look in place, between an emoji billboard,
a mesh, a node tree and an animated rig (a skeleton of named parts whose
clips are data in the document), and its behaviour does not change.

Status: work in progress. The design, with every decision and the
measurement behind it, is in
[`docs/design-merge-meadow.md`](../../docs/design-merge-meadow.md). The module
contract is in [ARCHITECTURE.md](./ARCHITECTURE.md), and what is verified
today is in [STATUS.md](./STATUS.md).

## The link is the world

```
…/vibe-dump/merge-meadow/                              a bare URL opens the launcher
…/merge-meadow/#new=meadow   (or #new=blank)            make a new world from a template at once
…/merge-meadow/#doc=automerge:<id>&key=<secret>         the world, with the agent key
…/merge-meadow/#doc=automerge:<id>&view=<secret>        the world, agent key for reading only
…/merge-meadow/#doc=automerge:<id>&heads=<h1,h2>        a read-only view of one version
                                         &sync=<ws url> another sync server (default wss://sync.automerge.org)
                                         &safe          start with doc systems switched off
```

- Opening a bare URL shows the **launcher**, and nothing is created until you
  choose:
  - **Your worlds**: the worlds this browser has opened, newest first, with
    when you last opened each, **Open**, **Copy link** and **Forget**. Forget
    removes the entry from this browser's list only; the world itself stays
    on the sync server and in this browser's storage, and its link still opens it.
  - **New world**: one card per template. **Animal meadow** is trees, rocks, a
    lamp, a T-rex, three sheep, a horse to ride, a wizard by the lamp and five
    zodiac animals (rabbit, goat, pig, dog, rooster). **Blank meadow** is
    ground, sky and one lamp. Both carry the same library: every preset is in
    the palette and every rig model is in the document.
  - **Open a file**: an `.automerge` file you downloaded earlier.
  - **Paste a link**: a world link, or the `#doc=…` part of one.

  Choosing creates or opens the world in place (no reload) and rewrites the
  address to `#doc=…&key=…`; **Back** returns to the launcher. `#new=meadow` or
  `#new=blank` skips the launcher and creates the world straight away (for
  links, docs and tests); `&sync=` and `&safe` work with it. An unknown
  template name shows the launcher.
- **Share** copies the world's link. It becomes active
  once the sync server has acknowledged the document, so a friend who opens it
  straight away does not get "unavailable". If they do, the page retries and
  shows "waiting for the world…".
- Everything sits in the URL **fragment**, so none of it reaches a web server.
  The sync server sees the document, but not the key.
- **Fork** copies the world under a new link. **Download** and **Open** save the
  document as an `.automerge` file and load one back. The World tab copies a
  **version link**, a read-only view of the world as it is now.
- Each browser tab is one peer. One peer at a time simulates each creature:
  the lowest live peer id hosts the NPCs, a ridden horse follows its rider, and
  a grabbed entity follows the hand holding it. Everyone else sees the owner's
  poses streamed over Automerge's ephemeral channel, 120 ms behind. Resting
  poses are written into the document every few seconds, so anyone who arrives
  late starts close to the truth.

## Controls

**Desktop: editor mode.** This is the default. Panels float over the scene.

| input | does |
| --- | --- |
| click an entity | select it; the inspector opens |
| press on the selection and drag | move it along the ground |
| **G** | grab the selection; it follows the mouse until you click |
| **Esc** | drop a grab without saving it, leave a field, or leave play mode |
| **Delete** / Backspace | delete the selection |
| **F** | focus the camera on the selection |
| **E** | ride the nearest mount (a horse), or get off |
| right-drag | look around |
| **W A S D** / arrow keys (hold Shift to go faster), mouse wheel | move the camera; wheel dollies |
| **Tab** or **P** | switch to play mode (pointer lock) and back |
| **/** | search the entity tree |
| Ctrl/⌘-Z, Shift-Ctrl/⌘-Z or Ctrl-Y | undo and redo, per gesture |

The left panel holds the entity tree and the spawn palette. Each preset is a
card with its icon (a preset's own `icon` field, else its billboard emoji, else
a glyph for its kind). The search box above the grid filters by name: **Enter**
spawns the first match, **↓** moves into the grid (arrow keys, Home and End
move between cards), **Esc** clears it. A palette click spawns 6 m ahead of
you; **📍 at cursor** then a click in the scene spawns where you point. The right panel has four tabs:

- **Inspector**: one form per component, marked own, inherited or override.
  It also has groups, the owner pin and a health bar, plus a "doing: …" line
  that explains why a creature is doing what it does.
- **Systems**: doc-stored code, with live status and inline compile errors.
- **Agent**: the links and set-up lines from the next section, plus a log of
  agent calls.
- **World**: title, bounds, colours, which systems are switched on for
  everyone, the version link, and credits.

While riding, WASD steers the mount.

**WebXR.** The **Enter VR** button appears only when the browser supports
`immersive-vr`.

| input | does |
| --- | --- |
| trigger on an entity | select and grab it; move the controller to carry it and twist to turn it |
| trigger on the ground | teleport there |
| squeeze near a mount | ride it; squeeze again to get off |
| left stick / right stick | move / snap-turn 30° |
| trigger on the left-wrist palette | spawn a sheep, a T-rex or a tree |

## Looks

An entity's `representation` component is its look. Replacing it swaps the
look in place: the entity keeps its root object, its live state and its
behaviour.

| kind | fields | what it is |
| --- | --- | --- |
| `billboard` | `image` (`emoji:🐑` or a URL), `size`, `color` | a camera-facing sprite; switching a rig to `billboard` in the inspector shows the preset's icon |
| `primitive` | `shape` (box, sphere, cone, cylinder, capsule), `size` [x,y,z], `color`, `roughness`, `metalness` | one mesh |
| `tree` | `nodes` (and optionally `animations`, `controller`) | a sculpt of nested shapes stored on the entity; an alias of an inline `rig` |
| `rig` | `model` (a name in `doc.models`), `color` (multiplies every node colour), `scale`; or inline `nodes`/`animations`/`controller` | an articulated look: named nodes are bones, clips move them, a controller maps the sim's state to clips |
| `model` | `url` (`asset:<name>` or https glTF), `scale` | an external glTF asset, loaded asynchronously |

Any look also takes `tint`, which is how the `dead` group greys a creature out.
Adding `animations` to a `tree` animates it without a kind swap: the same
meshes start moving.

### Rigs: models are data

The document holds a library of rig models in `doc.models`. A new world gets
nineteen: the bases `quadruped`, `biped`, `serpent` and `bird`; the species
`horse`, `sheep` and `trex`; the `wizard`; and eleven zodiac animals (below).
The T-rex, sheep and horse presets look like their rigs
(`{ "kind": "rig", "model": "horse" }`), and any entity can be pointed at any
model with one replace. Every instance of a model shares one compiled
template, and editing the model updates every entity that uses it, on every
peer.

**The wizard and the zoo.** Each of these is a model that `extends` a base,
plus a preset of the same name that extends `creature`, carries its palette
`icon` and looks like its rig:

| preset | model extends | behaviour |
| --- | --- | --- |
| 🧙 `wizard` | `biped`: hat with a star, beard, robe, staff with a crystal; idle bobs the staff; a `cast` clip for attack (the preset has no attack, so preview it in the inspector) | a person; flees predators |
| 🐀 `rat` | `quadruped` | prey (and `rodent`); flees predators and snakes |
| 🐂 `ox` · 🐇 `rabbit` (hops) · 🐐 `goat` · 🐖 `pig` | `quadruped` | prey; flee predators |
| 🐅 `tiger` | `quadruped`, striped; `pounce` on attack | predator; hunts prey (damage 20) |
| 🐉 `dragon` | `serpent` on four legs; `breath` (a flame) on attack | predator; hunts prey (damage 40) |
| 🐍 `snake` | `serpent`, slimmer and banded | hunts rodents; flees predators |
| 🐒 `monkey` | `biped`, long arms and a tail | wanders |
| 🐓 `rooster` | `bird`, comb, wattle and a tail fan | prey; flees predators |
| 🐕 `dog` | `quadruped`, collar; idle wags | wanders |

There is no zodiac horse: the core `horse` preset is it. A world made before
this library keeps the models it has: the library is added only to a world
with no `doc.models` at all, so a model someone removed is never put back, and
an older world's T-rex, sheep and horse presets stay as they were.

A model has three layers:

```js
{
  extends: 'biped',            // '' or a base model: nodes patch the base BY NAME, clips merge by name,
                               // the controller merges (states by state name); up to 8 levels, no cycles
  stride: 1.2, runSpeed: 4,    // metres per gait cycle (drives `phase`) and the speed where `gait` reaches 1
  nodes: [                     // geometry: a tree of nodes; a named node is a bone, its children move with it
    { name: 'head', children: [{ name: 'hat', shape: 'cone', p: [0, 0.5, 0], s: [0.34, 0.5, 0.34], color: '#3b2a7a' }] },
  ],                           // node fields: name, shape, p [m], r [deg], s, color, roughness, metalness,
                               // anchor ('seat' | 'head'), children
  animations: {                // clips of tracks, ADDITIVE to the rest pose, so clips layer
    attack: { once: true, tracks: {
      'staff.rz': [[0, 0], [0.3, 40], [0.7, 0]],     // keyframes [[seconds, value], ...], linear
      'hat.ry': 'sin(st * tau * 2) * 10',             // or an expression, evaluated every frame
    } },
  },
  controller: { states: { idle: ['idle', 'breathe'], walk: ['walk', 'breathe'], attack: 'attack' }, blend: 0.15 },
}
```

- A track key is `<node>.<channel>`: `rx ry rz` (degrees), `px py pz`
  (metres), or `sx sy sz` (a factor on the node's rest scale).
- A clip loops unless it says `once: true`; a `once` clip plays from the
  moment its state starts and holds its last frame.
- The controller maps the sim's states (`idle`, `walk`, `run`, `attack`,
  `die`, `sit`) to one clip or a list of clips played together, with a
  crossfade of `blend` seconds. A state without a clip falls back (run → walk
  → idle, attack and sit → idle); a missing `die` clip freezes the pose. An
  entity's `animation.clips` can remap states per entity.
- In an extending model, `{ name: 'chest', color: '#3b2a7a' }` patches the
  base's `chest`; a node with a new name under a base node's stub is added
  there; `remove: true` deletes a base node and its subtree; `null` removes a
  field, a clip or a track.
- Limits: 200 nodes, 400 tracks, 8 levels of node nesting.

**Expressions** are a small language with its own parser (no `eval`): numbers,
`+ - * / %` (`%` is floored, so `phase % 1` stays in 0..1), comparisons,
`&& || !`, `a ? b : c`, the functions `sin cos tan abs min max clamp lerp
smoothstep floor ceil round sign sqrt pow saturate step`, and the constants
`pi` and `tau`. The variables, supplied per entity per frame:

| variable | meaning |
| --- | --- |
| `t` | seconds since the look was created |
| `st` | seconds since the current state started |
| `phase` | distance walked ÷ `stride`, in gait cycles |
| `speed` | horizontal speed, m/s |
| `gait` | `speed / runSpeed`, clamped to 0..1 |
| `turn` | yaw rate, rad/s |
| `hp` | health fraction 0..1 (1 without health) |
| `rand`, `idx` | a per-entity constant in 0..1 and a per-entity integer, for variety |

An unknown name, a wrong number of arguments or a syntax error is reported
with its column when the model is written, and nothing is written.

**Making your own person**: extend `biped` and add parts under its bones,
then point an entity at it. (The library has a `wizard`; this one is a `mage`,
so it does not replace it.)

```bash
node agent/cli.mjs "$L" define-model mage '{"extends":"biped","nodes":[
  {"name":"head","children":[{"name":"hat","shape":"cone","p":[0,0.5,0],"s":[0.34,0.5,0.34],"color":"#3b2a7a"}]},
  {"name":"chest","color":"#3b2a7a"},
  {"name":"arm_r","children":[{"name":"staff","shape":"cylinder","p":[0,-0.3,0.1],"s":[0.04,1.6,0.04],"color":"#6b4a2e"}]}],
  "animations":{"attack":{"tracks":{"staff.rz":[[0,0],[0.3,40],[0.7,0]]}}}}'
node agent/cli.mjs "$L" spawn --name Merlin --at 0,0,10 --json '{"representation":{"kind":"rig","model":"mage"}}'
```

The biped's walk, run, idle and die clips come with it. For behaviour, spawn
from a preset instead (`spawn horse`, or a preset of your own that extends
`creature`) and replace its representation. In the editor: select an entity,
switch its look to `rig` with model `biped`, press **Fork** to copy the model
under a new name, edit the `nodes` box, and set **preview** to `walk` to watch the
clips with the sim idle.

## Agents

An agent gets the same write path as the editor: every change is a validated
list of ops, applied as one change. The live tab serves the agent a
[CapTP](https://github.com/endojs/endo) `World` capability. It sends the frames
sealed (AES-GCM, key derived from the link's `key`) over the document's own
ephemeral channel, so other peers see only noise. If no tab with the link is
open, the agent edits the document directly; then the only things it cannot do
are `capture`, `eval` and `explain`, and the server must acknowledge every
write before the agent continues.

**MCP (Claude Code or any MCP client).** Run this from this directory:

```bash
claude mcp add merge-meadow -- node "$PWD/agent/mcp.mjs"
# then, in Claude: connect to https://…/merge-meadow/#doc=automerge:…&key=…
# or fix the world up front: claude mcp add merge-meadow -e MERGE_MEADOW_LINK='<link>' -- node "$PWD/agent/mcp.mjs"
```

There are 25 tools: `connect`, `describe`, `list`, `get`, `spawn`, `set`,
`replace`, `remove`, `despawn`, `link`, `batch`, `define`, `define_preset`,
`define_component`, `define_system`, `systems`, `explain`, `events`,
`capture`, `eval`, `heads`, and for rig models `define_model`, `models`,
`model` and `remove_model`. `models` lists the library with each model's node
names and clips (after `extends`), `model` returns one model resolved through
its chain (ready to copy and redefine under a new name), and `define_model`
validates the whole model, every expression included, before the document
changes. Every result reports `mode`, which is `live`
(through a tab) or `local` (straight to the document), and the
`fallbackReason` when it is `local`. The editor's Agent tab shows this line
with the path filled in.

**CLI: one call per run.**

```bash
L='https://…/merge-meadow/#doc=automerge:…&key=…'
node agent/cli.mjs "$L" describe
node agent/cli.mjs "$L" spawn trex --at 3,0,-5 --name Rex
node agent/cli.mjs "$L" list --tags prey
node agent/cli.mjs "$L" set <id> body '{"speed": 8}'
node agent/cli.mjs "$L" replace <id> representation '{"kind":"rig","model":"horse"}'
node agent/cli.mjs "$L" models                    # the rig model library
node agent/cli.mjs "$L" model biped               # one model, resolved through extends
node agent/cli.mjs "$L" define-model mage --file mage.json
node agent/cli.mjs "$L" remove-model mage         # refused while another model extends it
node agent/cli.mjs "$L" define-system bob --file bob.js
node agent/cli.mjs "$L" capture shot.jpg          # needs an open tab
node agent/cli.mjs "$L" describe --local          # skip the tab, edit the doc directly
```

stdout carries the JSON result, and stderr the mode and timings. Environment
variables:

- `MERGE_MEADOW_LINK`: the link, instead of passing it as an argument.
- `MERGE_MEADOW_HOST_TIMEOUT`: how long to wait for a live tab before falling
  back to local mode, in ms (default 1500).
- `MERGE_MEADOW_CALL_TIMEOUT`: the limit for each MCP call, in ms (default
  20000).

**Pages on the same origin** can import `./agent.js` and call
`connect(link)` to reach an open tab over a BroadcastChannel in a few
milliseconds. `public/agent.js` is generated; rebuild it with
`node agent/build-page-tool.mjs` after changing anything under
`src/agent/transport.js`, `bc-handle.js`, `page-tool.js` or `src/net/link.js`.

**Doc systems** are ES modules stored in the document as text. Every peer runs
them:

```js
export default {
  init (world, hot) { hot.data.n = (hot.prev.n ?? 0) + 1 },       // hot data survives a hot swap
  update (world, dt) { for (const e of world.query('tags')) if (e.owned && e.c.tags.prey) e.live.yaw += dt },
  dispose (hot) {},
}
```

A system sees only `world` and `log`. Through `world` it can call `query`,
`get`, `owns`, `nearby`, `spawn` (on the host only), `despawn`, `set`, `emit`,
`events` and `rand`, and read `time` and `dt`. It may change the `live` state
only of entities it owns.

## Security, plainly

- **The document link is edit access.** The public sync server has no
  accounts, so anyone with `#doc=…` can change the world, including the system
  code that every peer runs. Share it the way you would share an editable
  Google Doc.
- **Doc-stored code is sandboxed.** The page runs under SES `lockdown()`, and
  each system compiles in its own `Compartment`. Inside, it sees `world` and
  `log`, and nothing of the page: no DOM, three.js, network, storage, `eval` or
  `import()`. `Math.random` and `Date.now` throw there, and `world.rand()` is
  the seeded replacement. A system that throws is suspended after 30
  consecutive errors. A system that hangs the tab costs one safe-mode load: a
  crash marker in this tab's `localStorage` names the systems that were
  running, and the next load of that world starts with systems off until they
  change, or until you click **Run systems anyway**.
- **The `key` in the link controls what an agent can reach beyond the
  document**: the screenshot, the log, `eval` (in a Compartment) and
  `explain`. A **view link** (`&view=`) is derived from the key one way. It
  can read, but cannot write, `eval` or `capture`, and the agent enforces
  this in local mode as well. A tab hosts agents only when its link carries
  `key`. A wrong key gets no answer at all.
- **The launcher's list of your worlds holds each world's agent key.** It
  lives in this browser's `localStorage['mm:worlds']` (at most 50 entries of
  doc id, key or view key, sync server, title and time), the same secrets the
  browser history holds for those links, with one difference: `localStorage`
  is per origin, and this origin is shared by every app on this Pages site
  (every vibe in the gallery, and any other Pages site of the same account).
  Any of those pages can read the list; none of them can read your history.
  **Forget** removes an entry and its key; clearing the site's data removes
  them all. Anyone with access to this browser profile can read them too.
- **Little from a document is written into this origin's storage**, and no
  code. That origin is shared by every app on the site. The crash marker holds
  only a doc id and a hash. The worlds list stores each world's title, capped
  at 200 characters and only ever shown as text. Besides that, `localStorage`
  keeps your display name and the package path you typed in the Agent tab,
  and `sessionStorage` keeps a per-tab peer id.
- Model URLs must be `asset:` names or https. `blob:`, `data:` and
  `javascript:` URLs are refused.

## Emoji and the Twemoji attribution

Billboards are emoji drawn with your system's colour-emoji font, so they need
no image files; palette icons are emoji text in the page. If the platform has
no colour-emoji font, which a 1 ms probe at boot detects, billboards of the
starter emoji use eight bundled
[Twemoji](https://github.com/jdecked/twemoji) 15.1 SVGs instead:
🦖 🐑 🐎 🌳 🪨 💡 🐺 🧑. Twemoji graphics are © Twitter, Inc., jdecked and other
contributors, licensed under [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/).
The credit appears in the app's World tab, and the file list with its source
is in [`src/render/emoji/LICENSE.md`](./src/render/emoji/LICENSE.md). Emoji
drawn by your own system font are not Twemoji and need no credit here.

## Development and tests

```bash
npm run dev -w @vibe-dump/merge-meadow           # vite dev server
npm run build -w @vibe-dump/merge-meadow         # → packages/merge-meadow/dist/
cd packages/merge-meadow
node --test "test/unit/*.test.mjs"               # unit tests (no browser), ~18 s
node scripts/boundaries.mjs [--strict]           # the import-boundary lint (ARCHITECTURE §2)
node test/e2e.mjs                                # the built app end to end, ~80 s (build first)
node test/xr.mjs                                 # WebXR smoke with an emulated Quest 3 (IWER), by hand
```

`test/e2e.mjs` needs nothing from the network. It starts an
`@automerge/automerge-repo-sync-server` in process on a free port, serves
`dist/` under a `/vibe-dump/merge-meadow/` sub-path, and drives headless
Chromium with at most three pages at once. It covers the launcher (a bare URL
creates nothing; New world → Animal meadow; Your worlds and Forget;
`#new=blank`), the gallery thumbnail's clicks, every zoo preset spawned from
the palette and the palette search, boot order, two peers,
the chase, damage applied exactly once, handoff, doc systems, look upgrades
(through a tree that gains animations and a library rig), 300 animating rigs
with their CPU cost per frame, the editor's preview state, the dead tint on a
rig, keys and view links, the MCP server live and local (`define_model`
included), the page tool, and safe mode. Point it at a browser with `CHROMIUM_PATH=…`; by default it uses
Playwright's own browser or whatever is under `/opt/pw-browsers`. Screenshots
and `results.json` go to `$TMPDIR/merge-meadow-e2e`, or to `MM_E2E_OUT`.

How to add a creature (a model plus a preset, as data, never as code) is the
playbook in [AGENTS.md](./AGENTS.md). Code layout and the rules each directory follows are in
[ARCHITECTURE.md](./ARCHITECTURE.md). The short version: `src/doc` is the
document and the only write path (`applyOps`); `src/core`, `src/sim` and
`src/scripts` are the world, the built-in behaviours and doc systems, and
import neither three.js nor the DOM; `src/net` is sync, presence, ownership and
the pose stream; `src/agent` and `agent/` are CapTP and the Node agent;
`src/render` and `src/xr` hold the only three.js code; `src/editor` holds the
DOM panels.
