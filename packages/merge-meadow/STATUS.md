# merge-meadow — status

The current state only. The design is
[`docs/design-merge-meadow.md`](../../docs/design-merge-meadow.md) and the module
contract is [ARCHITECTURE.md](./ARCHITECTURE.md). This file records what is
verified and by which test, what is known to be missing, and where the code
departs from the contract.

**State (rigs, integration round 1, 2026-11-01):** data-driven rigs (design §17,
ARCHITECTURE §6) replace the `critter` kind; tracks A, B and C are wired
together and `main.js` adds the model library to worlds opened from before rigs.
Every check below passes:

- unit tests: 260/260, ~9.5 s
- boundary lint: 0 errors and 0 warnings in 97 files, also with `--strict`
- Vite build with the shared config: `base './'`, one module script, no
  `manualChunks`, no top-level await
- `test/e2e.mjs`: 102/102 in ~60 s (a new `rigs` phase; `upgrade`, `mcp` and
  `local` reworked for rigs). Of the 5 full runs this round: the first failed
  one check because the leftover-key filter matched the seed's own inline
  templates (test fixed); one hit the known pose-error flake (max 0.41 m at
  160 ms behind a 106 ms frame gap in B); one failed the handoff motion check
  (a wandering T-rex covered 0.48 m of the required 0.5 m in 1.5 s; the check now
  waits up to 3 s more); the last two after both fixes were 102/102.
- `test/xr.mjs` (run by hand): not re-run this round (16/16 in most runs
  before; nothing in it is rig-specific, and its horse and sheep are billboard
  presets)

Not done here, left to the PM: the thumbnail, the gallery `dist/`, and
`package.json`.

## What is verified, and by which test

| claim | test |
| --- | --- |
| Boot order: three evaluates after `lockdown()` froze the intrinsics; main runs under lockdown | e2e `boot` (inline `__THREE__` setter probe + `window.__order`) |
| A doc-less link makes a seeded world and rewrites the hash to `doc` + `key`, keeping `&sync` | e2e `boot` |
| The seed scene renders: 15 roots, no placeholders, a drawn canvas; the editor is shown; no console `error`s anywhere in the run | e2e `boot` (screenshot `boot.png`), final check |
| A second browser context finds the world through the sync server; the peers see each other in presence; both elect the lowest peer id | e2e `join` |
| Each page renders the other's spawn (5–180 ms) | e2e `spawns` |
| A's T-rex chases a sheep spawned in B. B's **displayed** pose is within 0.01–0.07 m mean and 0.05–0.16 m max of A's simulated pose 140–160 ms earlier, at ~5 m/s, over ~285 frames | e2e `chase` (see contract amendment 13) |
| A kill writes exactly `ceil(max/(damage−armor))` hits, all from the attacker's owner. In the doc history every hit id is put exactly once and is still in its victim's ledger | e2e `hits`, and `local` (decodes every change) |
| A doc system defined in A runs in B (~100–160 ms); a hot swap keeps hot data | e2e `system` |
| Representation replace billboard → primitive → tree → **tree + animations** → rig (`horse`) → model (glTF) → billboard keeps the same root `Object3D` and the same `live` object, with one visual and no leftover resources (primitive, tree, inline-rig and model templates, glTF) | e2e `upgrade`; unit `c-reconciler`, `c-rig-kind` |
| Adding `animations` to a tree (a `set`, not a replace) keeps the same visual and the same mesh objects, and the tree starts moving (trunk swings ~22°) | e2e `upgrade`; unit `c-rig-kind` |
| A new world carries the seven library models; every library model builds with every track on a built bone, feet at y≈0, `seat` and `head` anchors | e2e `rigs`; unit `a-rig-models`, `c-rig-kind`, `c-rig-lockdown` |
| 300 rigs of two library models (horse + sheep) animating: they share one template per model (150 refs each); reconciler CPU **4.1–4.7 ms/frame** mean (p95 6–7.7 ms) in headless Chromium/SwiftShader under lockdown; a frame with render and a 1 px readback ~280–300 ms (~3.3 fps, ~5870 draw calls at 640×400); nothing is left after despawning them | e2e `rigs` (prints the numbers; `results.json` → `rigPerf`) |
| The inspector's preview selector forces `walk` on a rig the sim leaves idle (bone swing 2.6° idle → ~48° walk); deselecting clears it | e2e `rigs`; unit `d-rig-editor`, `c-rig-kind` |
| The `dead` group tints every node of a rig (a sheep preset with a rig look), patched in place (same visual) | e2e `rigs`; unit `c-rig-kind` (a halted pose survives the tint patch) |
| Expressions: precedence, functions, arity, column-numbered errors, no global access, guarded output, also under `lockdown()` | unit `a-rig-expr`, `a-rig-lockdown` |
| `extends`: nodes patch by name, clips/tracks merge, controller merge, `remove`, cycle and depth rejection; a base edit that would break a dependent is refused | unit `a-rig-models`, `a-rig-ops` |
| Controller: crossfade weights sum to 1 (also mid-fade), shared looping clips keep their clock, `once` clamps, a missing `die` clip halts, fallback chain, `since` resumes | unit `c-rig-controller`; evaluator layering and exact rest restore in `c-rig-evaluator` |
| A `defineModel` re-keys (`model:horse:1.1` → `1.4` when its base changes) and the entities on screen rebuild through `stale()`; only the newest template stays held | unit `c-rig-kind` |
| A wrong key gets no host session, and a raw SYN sealed with it is never answered. A view link attaches live as a viewer that can read but not write, eval or capture, and stays read-only in local mode | e2e `keys`; unit `b-transport` |
| A same-origin page tool (`public/agent.js` over a BroadcastChannel) connects in ~5–10 ms and spawns; its `fin` ends the host session | e2e `keys` |
| A closes gracefully → B is host and owns the T-rex after 7–60 ms (≤250 ms), then simulates it | e2e `handoff`; unit `b-presence` (fake clock: bye ≤100 ms, crash 2.46 s) |
| The MCP server over stdio, through the live page: 25 tools; spawn, set, `set transform` moving a simulated sheep (inbox move), replace to a rig (`sheep`), `models` lists the library, `define_model wizard` (extends `biped`, adds a hat and a staff) renders on B with the biped's bones plus `hat` and `staff`, `models()` reports it, a `define_model` with an expression syntax error is refused (column in the message, rev unchanged), `define_system` with a syntax error refused while the connection survives, explain, a capture JPEG of the live view, events | e2e `mcp`; unit `b-rig-mcp`, `b-rig-caps` |
| No page open: MCP falls back to local mode with a `fallbackReason`. Writes return after the server acknowledges them. `capture` needs a live page; `systems` reports `unknown`; `define_system` and `define_model` with a syntax error leave the heads unchanged; `model` resolves a two-level chain (apprentice → wizard → biped); `heads` returns a version link; the one-shot CLI works (`get`, `models`) | e2e `local`; unit `b-mcp`, `b-world-caps`, `b-rig-mcp` |
| An infinite-loop system hangs a tab. The next load of that world (same profile, browser restarted) starts in safe mode and still ticks. When the systems that hung arrive **after** boot (a boot from a stale local copy), the tab goes safe instead of running them. Fixing the system re-enables systems with no reload | e2e `safe` |
| The World tab credits the bundled Twemoji glyphs (CC-BY 4.0) | e2e `boot` |
| A non-host rider owns its mount on every peer (riding is published in presence); the host stops simulating it, and gets it back on dismount | e2e `ride`; unit `d-boot` |
| A hidden host tab (no frames, timers still running) hands over at once and is not re-elected while hidden; it returns as a newcomer, then hosts again | e2e `hidden`; unit `b-presence` (also with the sender guard off) |
| One invalid op in a tick batch drops only itself; doc systems' bad spawn/despawn/group ops throw into the system at queue time | unit `a-ops` (applyValidOps), `a-scripts` |
| The crash marker is written before a system's module body or `init()` runs; disabled systems are not evaluated | unit `a-scripts` |
| Concurrent first hits and first field edits on preset-spawned and seed entities merge (own empty maps at spawn) | unit `a-ops` |
| Every pose write on a simulated entity (`set`/`replace`/`define` of transform, `transform`) reaches its owner as one inbox `move`; a yaw-only edit keeps the live position | unit `d-component-ops`, `a-sim` |
| A recorded CapTP session cannot be replayed, and a frame re-addressed into a live session is dropped without breaking it | unit `b-transport` |
| A drag that lost its pin aborts and writes nothing, even after the winner let go | unit `c-xr` |
| The seed meadow is not a massacre (≥2 of 4 prey alive after 60 s; cornered prey slide along the wall) | unit `a-sim` |
| A local CLI write the sync server never acknowledges exits 3 with an error | unit `b-mcp` |
| A look replaced while its glTF is still loading stays replaced; the model kind leaks nothing | e2e `upgrade` |
| The §12 headless scenario: the T-rex kills, and the riderless horse flees. `simHash` is unchanged across look swaps. The core, ops and a real Compartment run under `lockdown()` | unit `a-sim`, `a-lockdown` |
| Enter VR (button hidden without a runtime), grab, drag-commit, stick move, 30° snap turn about the head, ride and dismount, the wrist palette spawning, session end | `test/xr.mjs` (IWER Quest 3), by hand |

How the e2e harness is set up:

- A and B run in **separate browser processes**, as on two machines. Pages of
  one headless browser share a GPU process: tearing down one page stalled the
  other's frames for ~800 ms, and closing any page stalled the others for up to
  ~2.8 s. That is past the 2.5 s stream TTL, after which a peer rightly rejoins
  as a newcomer.
- While it **measures pose error and handoff**, the e2e skips only the WebGL
  draw call. On a 4-core box, two SwiftShader browsers draw at ~6 fps, which
  bunches the 30 Hz ticks. The sim, stream, interpolation and reconciler tween
  all keep running.
- Pages run at 640×400. The boot screenshot is taken at 1280×800.

## Known gaps

- **A real background tab is not in the e2e.** `hidden` emulates one (held
  `requestAnimationFrame`, `visibilityState` + `visibilitychange`); Chrome's
  timer throttling of hidden tabs is not reproduced.
- **Crash failover is not in the e2e.** CDP `Page.crash` kills the whole
  headless shell. It is covered only by `b-presence` on a fake clock (2.46 s).
- **There is no write path for `doc.assets`** (no `setAsset` / `removeAsset`
  op). `model.url` takes https directly, but `asset:<name>` can only point at
  assets written by hand.
- **Two rare e2e failures, not reproduced since.** The checks report enough to
  diagnose either if it comes back.
  - **Pose error.** Seen in 3 of ~20 runs before the last 10: one sample of B's
    displayed pose was 0.33–0.45 m off, against a 0.3 m max, while the mean
    stayed ≤0.1 m. The check now prints the worst samples with A's tick gap
    and B's frame gap around each, which tells a rig stall from an
    interpolation error. Seen again in 1 of 5
    runs in the rigs round (0.41 m at 160 ms, behind a 106 ms frame gap in B).
  - **Sync after a reload.** Seen in 2 of ~40 runs. A tab reloaded on the same
    profile (same peer id and IndexedDB) did not receive an agent's change
    within 5 s, although the server had acknowledged it. The tab's own final
    change, written at the old tab's `pagehide`, did reach the server. This
    usually arrives in 3–15 ms. It never failed in 24 isolated runs, with the
    same or fresh peer ids. The wait is now 15 s and reports the time taken.
    It may be an automerge-repo sync stall after a tab dies with unsynced
    local changes.
- **One intermittent in `test/xr.mjs`**, about 1 run in 8: the second squeeze
  sometimes does not dismount. It did not reproduce in 5 instrumented runs,
  where the session fired `squeezestart` and the rider dismounted every time.
  The test now holds the horse still and holds each squeeze until the state
  flips; it was flaky before only because the horse fled out of reach.
- **Tabs and peers:**
  - A duplicated tab copies `sessionStorage`, so two tabs share one peer id.
    This is not handled.
  - Safe mode cannot tell two live tabs of one doc apart: the second boots
    safe while the first runs systems.
  - The agent host is stopped on `pagehide` and not restarted if the page
    returns from the bfcache. A page with an open websocket is rarely
    bfcache-eligible.
- **Remote players** show as a 🧑 billboard. XR head and hands are in `pose()`
  but not rendered for others, and a remote player's hit events are not
  forwarded to that player's peer.
- **Behaviour and the world model:**
  - No obstacle avoidance or navmesh. Near a wall, prey drop the outward part of
    their flight and slide along it, but a T-rex can still pin a sheep in a corner.
  - Own empty maps at spawn (`entity.hollow`) make first concurrent writes to a
    component merge, but only one level deep: two first writes of different
    drives (`brain.drives.a` vs `brain.drives.b`) still race to create
    `drives`. "Reset" of a component removes its own map, so the next first
    writes race again.
  - Despawn does not cascade: children keep a dangling parent and render at
    the scene root.
  - For a parented entity with a body, `live.p` is applied parent-local.
  - Billboard images from URLs are always square.
  - No shadows. `ground()` is flat.
- **Editor:**
  - "Revert" restores the doc's current source only; there is no per-revision
    picker.
  - Merge toasts cover only representation conflicts.
  - On phones the safe-mode banner covers the right drawer's tabs until it is
    dismissed.
  - The MCP set-up line uses a package path the user types in the Agent tab.
- **Rigs (design §17):**
  - **Draw calls.** Every shaped node is its own mesh: ~16–20 draw calls per
    rig, so 300 rigs plus the seed are ~5870 calls and ~290 ms per rendered
    frame in SwiftShader at 640×400 (static trees ~100 ms, billboards ~19 ms in
    track C's harness). Critters were one skinned mesh each. Merging or
    instancing the rigid parts of a template is not done.
  - **CPU is 4–5 ms per frame for 300 rigs**, not the design's "well under a
    millisecond": that figure counted closure calls only. Node writes (Euler to
    quaternion) and the per-instance vars cost as much as the tracks.
  - A rig's pick and bounds box is computed once at build, not per animated
    frame, so a swinging limb or a dead rig lying down can extend past it.
  - A model redefinition rebuilds every instance. The state resumes (`since`),
    but an in-flight crossfade restarts and layer clocks reset.
  - A model removed and re-created under the same name restarts at rev 1, so a
    template still held from before the removal could be reused.
  - `ensureLibraryOps` runs on every open of a writable doc: it never
    overwrites an edited model, but it puts back a library model the user
    removed.
  - A doc seeded before rigs keeps its old `representation` def (kind enum with
    `critter`) in `doc.components`; validation unions the built-in kinds, but
    the editor's form for that def shows the old enum until it is redefined.
    A `critter` look renders the unknown-kind placeholder until converted (the
    inspector offers "Convert to rig").
  - Editor DOM paths in the e2e: only the preview selector. Fork, the JSON boxes
    with inline errors, the switcher's model dropdown and the Convert button are
    covered by unit tests of their op builders only.
  - When a previewed entity's look changes from rig to another kind, the
    preview stays on until deselect. If the inspector clears while a drag of
    the same entity is active, it clears the drag pose and the preview state
    stays on until the next clear.
  - LIMITS.depth = 8 node levels; the serpent uses all 8.
  - The geometry and clips were checked in track C's harness (screenshots) and
    numerically; the biped gained a neck mesh this round (its head floated).
- **The 300-entity stream** has not been checked end to end. Units cover
  steady error, clamping, holds and 5 s snaps. The resting-entity skip assumes
  receivers hold a pose through ~1 s gaps.
- **`public/agent.js` is a committed generated file.** It is current as of this
  round (byte-identical rebuild), but nothing checks that it stays current.
- **Main is one dynamic chunk** of ~970 KB (280 KB gzip), and Vite warns about
  the size. That is expected: no `manualChunks`, by design §16.1.

## For the PM

- Optional `package.json` script:
  `"build:agent": "node agent/build-page-tool.mjs"`. `esbuild` is imported by
  that script and is present only as Vite's dependency at the repo root;
  declare it as a devDependency to make that explicit.
- **Thumbnail:** at 1280×800 the editor panels are open (≥900 px), framing the
  meadow from (0, 3.5, 23). To shoot the bare scene, use a hint such as
  `"thumbnail": { "click": "…" }` that collapses the panels, or add a `#thumb`
  switch. The renderer now sizes its buffer at boot, so the card is sharp.
  Before this round, every tab rendered a 300×150 buffer stretched by CSS.
- The contract (ARCHITECTURE.md §3) was reconciled with the code on 2026-10-29.

## Contract amendments

ARCHITECTURE.md §3 now reflects these; they stay here as the record of why it changed.

Where an amendment below overstated the code, the contract follows the code:
`live.held` is honoured by steer and integrate only (and set only on entities
this peer owns); editor writes are applied at once through `applyOps` with
`withMoves`, and only interaction commits are queued into the tick flush, whose
world ops go through `applyValidOps`; `expandMoves` and `healOps` live in
`src/editor/component-ops.js`; a host's served-session set is capped at 4096
(oldest dropped); `changeDoc` writes `schema: 1` only when it is missing; the
sim's `teleport` queues a checkpoint as `{id, p, yaw}`; and ownership loss
clears `live.hp/died/intent/scores` in `main.js`'s `reown()`, not in
`makeOwnership`.

Positional parameters are unchanged everywhere. These are the departures from
ARCHITECTURE §3 that callers rely on.

1. **World (A):**
   - `registerComponent` allows several handlers per name and returns an
     unregister function. The sim seeds `live.p` at order −1000 and the
     reconciler registers at −100.
   - Added: `isHost()`, `errors()`, `systems()`, `componentOrder()`, `ids()`,
     `pendingOps()`, `events`, and `setOwnership({ owns, owner, isHost })`.
   - Built-ins skip entities whose `live.held` is set; interaction sets it
     while dragging.
2. **System host (A):** doc systems are scheduled into `world.tick` as
   `doc:<name>` at their own order, and `host.tick()` does nothing when
   interleaved (the default).
3. **`watch()` (A):** calls `fn({ doc, patches, heads, initial, deleted })`.
   The first call is the full diff with `initial: true`.
4. **Doc data (A):**
   - Every string in component, preset and def data is an ImmutableString, not
     just `IMMUTABLE_KEYS`. Only `systems[*].source` is Text.
   - `hitId` is `${peerId}:${sessionBase}.${n}`.
   - `define` keeps `transform` and `health.hits` unless it names them, and
     `null` removes an inherited component.
   - The filter grammar adds `any`, `notRelation`, `where.of`, `{path, of, mul}`
     values and `$hp`/`$live`/`$id`.
   - The creature `dead` group also removes `controller`, `rider` and `body`.
5. **Ops (A):**
   - `applyOps` and `validateOps` take `{ kinds, componentDefs }`. With
     `kinds`, any registered representation kind is valid (integration fix,
     the open registry of design §8). `changeDoc` writes `schema: 1`.
   - Extra exports: `moveOps`, `OP_NAMES`, `seedOps`.
6. **Scripts (A):** `makeScriptWorld` refuses writes to entities this peer
   does not own, and `spawn` runs on the host only.
7. **Safe mode (A + integration):** `makeSafeMode` adds:
   - `forced` and `reason()`
   - `arm(hash)`
   - `bootCrashHash()`: the marker as boot found it
   - `hold(hash)`: keep the crash evidence through a clean exit

   `main.js` enters safe mode when the crashed hash arrives after boot. It
   re-enables only when the systems hash differs from the one safe mode was
   entered for (it used to compare against the live marker, which the tab may
   have re-armed). An automatic re-enable does not count as "Run systems
   anyway".
8. **Repo, link and presence (B):**
   - `openRepo(sync, { peerId, storageName })`: the repo's peer id must equal
     the peer id presence uses.
   - `parseLink` returns defaults: `sync` is `DEFAULT_SYNC`, `heads` is an
     array or null, `safe` is a boolean.
   - Presence adds `setStreaming`, `selfCheck`, `livePeers` and `info`, the
     first-heartbeat rule (agents never become hosts), and a streaming flag in
     heartbeats.
9. **Stream, checkpoints and ownership (B):**
   - `makePoseStream` takes `owner` and `presence`.
   - Checkpoints are per-entity `{ op: 'checkpoint', id, p, r }`;
     `flushNow(ids?)`.
   - Ownership adds `owned()`, `host()` and `pinnedToMe()`, and
     `unpinOps(id, { transform })`.
   - `canGrab` may return `'ridden by X'`.
   - Ownership now installs `isHost` on the world (integration fix: a doc
     system's `world.spawn` ran on every peer).
10. **Transport, caps and agent host (B):**
    - Transport roles take `bootstrap(sessionId, role)` and `onEnd`.
      `connectCapTP` accepts the secret string and `keepAliveMs`, and a host
      sends a sealed `bye`.
    - `makeWorldCaps` takes `watch`, `peerId`, `kinds`, `componentDefs` and
      `log`. It adds `session()`, `endSession()`, `subscriptions()` and
      `close()`, plus the extra verbs `removePreset`, `removeComponent`,
      `setSystem`, `removeSystem` and `setWorld`.
    - `Entity.get(comp)` returns effective data.
    - An agent `set transform` or `transform` on an entity with a body also
      pushes an inbox `move`, appended at the batch's end so `$n` references
      hold (integration fix: the owner ignored the move).
    - `startAgentHost` returns `{ ready, viewKey, sessions, revoke, stop }`, and
      `main.js` stops it on `pagehide`.
    - `main.js` also recomputes ownership the moment presence reports a
      `leave`, not only in the sim step (integration fix). A stalled frame (B
      measured 200–290 ms of no frames while another browser closed a page)
      used to delay the takeover past 250 ms.
11. **Render and XR (C):**
    - `resources.use(obj, key, make, dispose?)` takes a factory.
    - `makeVRButton` returns the element, with `supported`, `enter`, `exit`
      and `dispose`.
    - The animator's `set(state, { fade, mapping })`.
    - Kind schemas carry a hidden `kind` property.
    - `makeReconciler` takes the THREE.Scene (`stage.scene`). It adds
      `anchorArray`, `anchorObject`, `visualFor`, `bounds`, `preview`,
      `setVisible`, `stats` and `ids`, and computes anchors from the sim pose.
    - `makeInteraction` takes pin protocol options (`pinOps`/`unpinOps` or
      `ownership`), `onMount`, `onDismount`, `onSpawn`, `controllers`,
      `palette` and `ground`.
    - Added `src/xr/desktop.js`.
    - `resolveUrl` also allows localhost and same-origin relative paths.
    - `makeScene` sizes the renderer when it is created (integration fix).
12. **App and editor (D):**
    - §3.5 step 9 is implemented as: interaction and editor commits each in
      their own `applyOps`, applied first, then the world's ops as one change.
      This keeps undo exact and isolates failures.
    - `makeEditor`, `switchKindOps(…, { inherited })` and `makeShare` take
      extra options.
    - Version links carry `Automerge.getHeads` (hex).
    - Preset resolution walks `extends` recursively.
    - `window.__mm` is the test surface; integration added `resources` and
      `renderer` to it.
13. **E2E pose-error criterion (§16.15):** the 160 ms in §16.15 is the 120 ms
    interpolation delay plus ~40 ms one-way latency of the *public* server.
    Against the local server the display runs ~20 ms fresher than that, so the
    check accepts any lag in 120–160 ms that meets ≤0.1 m mean and ≤0.3 m max,
    and also requires ≤0.3 m max at exactly 160 ms. Measured: mean 0.01–0.07 m
    at the best lag, and ≤0.2 m max at 160 ms.
14. **MCP (B + integration):**
    - The `link` tool is `Entity.link`.
    - `heads` returns a `versionLink`.
    - A live connection is dropped only on a call timeout or a closed CapTP
      session. It used to match the error text, so a refused op whose message
      mentioned "broken" dropped a healthy connection.
15. **Review fixes (A, B, C, D):**
    - Ops: `applyValidOps(handle, ops, opts)` / `splitValidOps(doc, ops, opts)`
      apply what validates and return `dropped: [{ index, op, error }]`;
      `main.js` flushes the tick batch through it. `withMoves(doc, ops, { skip })`
      is the one pose-write → inbox-`move` expansion (editor writes, undo, agent
      writes, interaction commits of entities this tab does not simulate);
      `moveOps(doc, id, p|null, yaw)` is built on it, and a `move` may carry only
      `yaw`. `expandMoves(doc, ops, withMoves)` is a thin alias.
    - Doc shape: entities may carry `hollow: { [component]: true }`, the own
      empty maps spawn and the seed create for inherited object components (plus
      an own `health.hits`); an own map listed there that holds only empty maps is
      invisible when nothing is inherited at that key. `spawn` takes `hollow:
      [names]` (a respawn by undo). `presets.js` exports `withOwnMaps` and
      `isHollow`. `define` keeps the health ledger when it does not name health.
      `healOps` re-creates `hits: {}` in the same batch.
    - Validation: `on.*.add/remove` entries must be group names; `replace` checks
      required fields (except an empty own map); a spawn's parent counts in the
      batch's cycle check.
    - Scripts: `makeScriptWorld(world, { opsOptions })` validates spawn, despawn,
      add/removeGroup and `set on` at queue time and throws into the system;
      `makeSystemHost({ opsOptions })` passes it. World adds `queuedOps()`;
      `drainOps` drops ops on an id despawned earlier in the batch. Disabled
      systems are neither compiled nor init'ed. `status().ok` is the live state
      (`lastError` stays for display). `check()` parses with the compartment's
      `Function` constructor first, so it runs nothing. `safe-mode.js` adds
      `syncArmed(safe, { hash, armed, sync, running })`: the marker is written
      before `sync` evaluates anything.
    - Presets: sheep `body.speed` 6.5, T-rex hunt `range` 15 (design §3.3).
    - Presence: `pause()`, `resume()`, `paused`; `selfCheck()` returns whether it
      saw a stall; heartbeats stop while frames are stalled; a heartbeat with
      `st:1` starts the stream TTL. `main.js` pauses on `visibilitychange` to
      hidden (not in XR), self-checks before ownership in every step, drops the
      backlog after a stall, and skips loss checkpoints right after one.
      Ownership loss clears `live.hp/died/intent/scores`.
    - Players: riding is published as `presence.info.riding` and remote player
      entities carry `rider` (`ridingOf(info)`), so ownership agrees everywhere.
    - Stream: the hello flag is per stream (players, NPCs).
    - Transport (protocol v2): `aesKey(secret, docId)` returns a role key
      `{ syn, base }` (also exported as `roleKey`). SYN and ACK carry nonces;
      each session runs under `HKDF(base, gN‖hN, gid|hid)` with `{from, to, dir}`
      as AES-GCM additional data; a host never serves a gid twice.
      `public/agent.js` is rebuilt; older guests cannot attach.
    - Interaction: `makeInteraction({ pinnedToMe, pinWindowS })`; drag commits
      wait until the pin is seen, and a pin seen and then lost aborts the drag.
    - Share: version links never carry the editor key.
    - Agent (Node): `connect().synced()` rejects when the server advertised no
      storage id (unless the repo factory says `noServer`); `close()` rejects
      when local writes were not acknowledged. The CLI exits 3 for an
      unacknowledged write; MCP write results carry `durable`.
16. **Rigs (A, B, C + integration), against ARCHITECTURE §6** (§3.3, §3.4 and §6 now reflect these):
    - Doc (A): `resolveRepresentation` returns `{ key, model, chain, stride,
      runSpeed, nodes, animations, controller }` or null (never throws), with
      `key = 'model:<name>:<revs>'` joining the chain's revs own-first
      (`model:horse:3.1`), so editing a base re-keys every model built on it. A
      model's `rev` is an Automerge Counter that only moves forward (an undo
      restores content under a new rev; concurrent redefinitions sum).
      `validateModel(model, models, { name })` takes the name to catch cycles
      through itself and accepts resolver extras, so a resolved model can be
      passed back to `defineModel` (the editor's Fork). `defineModel` is also
      refused when it would break a model that extends it. Patch semantics: a NEW
      node's children are taken wholesale; `remove: true` only in an extending
      model. Rig looks validate with or without `kinds`, and `BUILTIN_KINDS` is
      always unioned into the doc's kind enum. Extra exports listed in §6.1.
    - Render (C): kind ctx gains `doc()`; kinds may expose `stale(obj, data,
      ctx)`, asked once per doc change, which is how a model edit (or a model
      arriving after load) reaches the screen, since world handlers see no
      component change. `src/render/kinds/nodes.js` holds the node builder
      (tree.js re-exports rig.js's alias; importing each from the other was
      circular). `signature()` includes node names. An inline rig/tree key change
      with the same structure swaps the template in place; only model looks
      return false. `reconciler.preview(id, null)` clears the drag pose when one
      is active, else the preview state; `{ anim: null }` clears only the state;
      added `previewState(id)`. `evaluate(layers, vars, out?)` and
      `controller.set(state, now, { mapping, since })` avoid per-frame
      allocation and let a rebuilt look resume. With nothing matching, the
      controller plays the first LOOPING clip. A missing model renders a
      wireframe placeholder inside the rig visual (impl stays `rig`, so
      `stats().placeholders` does not count it).
    - Agent and editor (B): `models()` lists node NAMES (depth-first, after
      extends) and adds `error` for a model that fails to resolve; the viewer has
      `models()`/`model()`; `eventsFromPatches` emits `model-changed`; CLI adds
      `remove-model`. `makeRigPanel(ctx, { id, rep, inherited, preview })` writes
      through the editor's write path (undo), and the pure op builders are in
      `src/editor/rig-ops.js`. `renderKindSwitcher(…, { models })` adds the
      model dropdown. JSON boxes on a model-backed rig redefine the model's OWN
      fields (patches over its base), so `extends` sharing survives an edit.
    - Integration: `main.js` applies `ensureLibraryOps` when it opens an
      existing writable doc (not a version view, not a world it just seeded).
      The library biped gained `neck_m` (its head floated over the chest) and
      the T-rex patches it to fit.
