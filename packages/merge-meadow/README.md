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
vocabulary. You can upgrade an entity's look in place, from an emoji billboard
to a mesh, a node tree or an animated procedural critter, and its behaviour
does not change.

Status: work in progress. The design, with every decision and the
measurement behind it, is in
[`docs/design-merge-meadow.md`](../../docs/design-merge-meadow.md). The module
contract is in [ARCHITECTURE.md](./ARCHITECTURE.md), and what is verified
today is in [STATUS.md](./STATUS.md).

## The link is the world

```
…/vibe-dump/merge-meadow/                              a bare URL makes a new world
…/merge-meadow/#doc=automerge:<id>&key=<secret>         the world, with the agent key
…/merge-meadow/#doc=automerge:<id>&view=<secret>        the world, agent key for reading only
…/merge-meadow/#doc=automerge:<id>&heads=<h1,h2>        a read-only view of one version
                                         &sync=<ws url> another sync server (default wss://sync.automerge.org)
                                         &safe          start with doc systems switched off
```

- Opening a bare URL plants a new meadow: a seeded document, then the address
  is rewritten to `#doc=…&key=…`. **Share** copies that link. It becomes active
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

The left panel holds the entity tree and the spawn palette. A palette click
spawns 6 m ahead of you; **📍 at cursor** then a click in the scene spawns where
you point. The right panel has four tabs:

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

There are 21 tools: `connect`, `describe`, `list`, `get`, `spawn`, `set`,
`replace`, `remove`, `despawn`, `link`, `batch`, `define`, `define_preset`,
`define_component`, `define_system`, `systems`, `explain`, `events`,
`capture`, `eval` and `heads`. Every result reports `mode`, which is `live`
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
node agent/cli.mjs "$L" replace <id> representation '{"kind":"critter","rig":"quadruped","length":1.2,"height":0.9,"color":"#f4f0e8"}'
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
- **Nothing from a document or an agent is written into this origin's
  storage.** That origin is shared by every app on the site. The crash marker
  holds only a doc id and a hash. Besides that, `localStorage` keeps your
  display name and the package path you typed in the Agent tab, and
  `sessionStorage` keeps a per-tab peer id.
- Model URLs must be `asset:` names or https. `blob:`, `data:` and
  `javascript:` URLs are refused.

## Emoji and the Twemoji attribution

Creatures start as emoji billboards drawn with your system's colour-emoji font,
so they need no image files. If the platform has no colour-emoji font, which a
1 ms probe at boot detects, the starter looks use eight bundled
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
node --test "test/unit/*.test.mjs"               # unit tests (no browser), ~6 s
node scripts/boundaries.mjs [--strict]           # the import-boundary lint (ARCHITECTURE §2)
node test/e2e.mjs                                # the built app end to end, ~30 s (build first)
node test/xr.mjs                                 # WebXR smoke with an emulated Quest 3 (IWER), by hand
```

`test/e2e.mjs` needs nothing from the network. It starts an
`@automerge/automerge-repo-sync-server` in process on a free port, serves
`dist/` under a `/vibe-dump/merge-meadow/` sub-path, and drives headless
Chromium with at most three pages at once. It covers boot order, two peers,
the chase, damage applied exactly once, handoff, doc systems, look upgrades,
keys and view links, the MCP server live and local, the page tool, and safe
mode. Point it at a browser with `CHROMIUM_PATH=…`; by default it uses
Playwright's own browser or whatever is under `/opt/pw-browsers`. Screenshots
and `results.json` go to `$TMPDIR/merge-meadow-e2e`, or to `MM_E2E_OUT`.

Code layout and the rules each directory follows are in
[ARCHITECTURE.md](./ARCHITECTURE.md). The short version: `src/doc` is the
document and the only write path (`applyOps`); `src/core`, `src/sim` and
`src/scripts` are the world, the built-in behaviours and doc systems, and
import neither three.js nor the DOM; `src/net` is sync, presence, ownership and
the pose stream; `src/agent` and `agent/` are CapTP and the Node agent;
`src/render` and `src/xr` hold the only three.js code; `src/editor` holds the
DOM panels.
