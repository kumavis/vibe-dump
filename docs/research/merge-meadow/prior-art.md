# merge-meadow research — prior-art

_Structured summary returned by the research agent (Opus 5.5), 2026-10-28. Every finding is graded verified / likely / speculative by what the agent actually ran._

## Summary

Verdict: write our own small vanilla-JS core on plain three.js, borrowing heavily from the engines below. None of them can be adopted whole. None has a core that can be lifted out without fighting its sync model.

Why each one fails:
- **Needs its own server.** Hyperfy (fastify + sqlite + ws), Hubs (Reticulum/Phoenix), networked-aframe (socket.io/easyrtc/uws), Croquet/Multisynq (their relay servers plus an API key), Needle (networking-2.needle.tools), PlayCanvas Editor (closed backend plus ShareDB).
- **Not open source.** Needle has its own EULA and its build is 2.2 MB gz of JS plus 3.4 MB of wasm and CDN calls. Spline, Rogue and Wonderland are closed too.
- **Not three.js.** PlayCanvas, Babylon, Wonderland, Decentraland.
- **Wrong license for copying code.** Hyperfy is GPL-3.0.
- **Sync model contradicts "the doc is the truth".** Croquet's session id hashes the model code, and it replays a deterministic VM.
- **A-Frame** is the only static, MIT, XR-ready option. It costs +230 KB gz and locks us to its own three fork (r184). Its DOM stops being the truth once systems run: Playwright showed `position="0 0 0"` after the T-rex had moved to x=3.99.

Experiments that decide the data model:
- **Store position/rotation/scale separately, never a 4×4 matrix.** three.js stores each object as a 4×4 matrix. Under concurrent Automerge edits that matrix loses an edit, or merges into a skewed matrix neither peer wrote (determinant 2, expected 8).
- **Keep entities in a flat map with a parent pointer.** Nested children arrays duplicate an entity when two peers reparent it at the same time.
- **Don't write live simulation into the doc.** 20 entities at 10 Hz add 37.6 KB/min (155 KB/min done naively) and cost 3.4 ms per change.
- **SES lockdown works with three r186 and automerge-repo** in Chromium.

An end-to-end two-peer prototype passed: behaviours stored as source in the doc and compiled in SES Compartments, with each entity simulated only by its owner. The T-rex chases and the sheep flees purely from components. Damage crosses owners through a per-target inbox list. The visual upgrade (billboard → glTF → animator) left behaviour untouched. A live hot-swap of the behaviour code took effect, and both peers ended with identical document heads.

The repo already has `packages/tails-and-scales/net/`: an automerge-repo + sync.automerge.org + IndexedDB + ephemeral-presence setup that can be copied.

Ideas to borrow, by source:
- Croquet Microverse: behaviour modules as code in the shared state, with setup/teardown hot-swap.
- networked-aframe and Hubs: one owner per entity; ephemeral streaming plus debounced persistence.
- Decentraland SDK7: per-component LWW granularity; append-only event sets.
- PlayCanvas Editor: a "driver" command API exposed to agents over MCP, including screenshot, logs and undo.
- Hyperfy: SES Compartment scripts, a crash placeholder, blueprint vs instance.
- Hubs: inflators and a swappable Object3D table.

## Findings

- **[verified]** No candidate engine can be adopted wholesale for a static GitHub Pages app whose source of truth is an Automerge doc. Each needs its own server, or is closed, or is not three.js, or its sync model conflicts.
  - _Evidence:_ Source read:
- Hyperfy: ServerNetwork.js persists to SQLite via knex; its LICENSE is GPL-3.0.
- Hubs: package.json is MPL-2.0 and pins forked three/aframe/bitecs; the client talks to a Phoenix server.
- networked-aframe: all adapters in src/adapters need a server.
- Needle 5.1.16: LICENSE.md says "not open source". My Vite build was 6.98 MB raw / 2.22 MB gz JS plus 3.4 MB wasm, and it references wss://networking-2.needle.tools/socket and cdn.needle.tools.
- Multisynq: the bundle connects to wss://api.multisynq.io/depin and needs an API key.
- PlayCanvas Editor: the frontend is MIT, but it syncs through ShareDB to a closed backend.
- **[verified]** A-Frame is the only static, MIT, XR-ready engine core. It adds about 230 KB gz over plain three, forces A-Frame's own three fork, and its DOM attributes stop matching the moving scene once systems run.
  - _Evidence:_ Vite builds: aframe@1.8.0 is 1,323 KB raw / 358 KB gz; three@0.186.1 is 515 KB / 128 KB. A-Frame depends on super-three@0.184.0.

In a Playwright run, chase/flee components registered at runtime from a source string worked: the T-rex moved 0→3.99 and the sheep 5→7.99 in 1 s. Swapping the visual kept the behaviour and the health value.

Re-registering a component throws. After flushToDOM the serialized element still reads position="0 0 0" although the T-rex is at x=3.99. The inspector loads from unpkg or aframe.io by default (inspector.js lines 17-18).
- **[verified]** three.js's own scene JSON (Object3D.toJSON, used by the three editor) is unsafe as an Automerge source of truth. Concurrent transform edits lose an edit or produce a matrix neither peer wrote; storing position/rotation/scale as separate fields merges cleanly.
  - _Evidence:_ exp-three-json.mjs, two peers editing the same object:
- Position vs scale, replacing the whole matrix array: Automerge reports a conflict and the position edit is lost.
- Rotation vs scale, writing matrix elements one by one: the merged matrix has determinant 2.000 instead of 8 (sheared, non-uniform scale).
- Separate position/rotation/scale fields: both edits are kept.

The 50-mesh scene is 20,501 B as toJSON and 5,458 B as an Automerge save.
- **[verified]** Store entities as a flat map with a parent pointer, not as nested children arrays (three JSON, A-Frame DOM, or a JSX-style tree).
  - _Evidence:_ exp-reparent.mjs:
- Nested children arrays: concurrent reparents of X under P1 and P2 merge with X under both parents, i.e. a duplicated entity.
- Flat map: X.parent resolves deterministically to P1, and the losing value is visible via getConflicts.
- Deleting an entity while another peer edits it: the delete wins and the edit is lost.
- **[verified]** Streaming simulation transforms into the Automerge doc is too expensive. Prior art (Hyperfy at 8 Hz, NAF lerping on non-owners, Hubs debouncing persistence at 500 ms with a 3 s cap) separates ephemeral streaming from persisted state, and so should we.
  - _Evidence:_ exp-growth.mjs, 20 entities writing position at 10 Hz for 60 s:
- Rounded floats written element-wise: the doc grows 1,315 → 39,851 B (+37.6 KB/min), at 3.45 ms CPU per change in Node; loading takes 33.5 ms.
- Replacing the whole array with raw floats: 155 KB after 60 s.

Source: Hyperfy World.js has networkRate = 1/8; Hubs entity-persistence-system.ts uses saveDelayMS 500 and maxSaveDelayMS 3000.
- **[verified]** Croquet/Multisynq's replicated-deterministic-VM model is incompatible with agent-authored live code and with Automerge as the source of truth. Croquet Microverse's behaviour-module design, however, is the best idea donor for runtime-added behaviours.
  - _Evidence:_ Multisynq bundle: the session id is a hash of persistentId plus codeHash, and codeHash hashes the registered model classes' source (computedCodeHash).

Microverse src/code.js lines 618-700: ScriptingBehavior.compileBehavior runs new Function on source stored in the model; setCode publishes the new text; behaviours hot-swap via teardown then setup. The actor/pawn split is shown in behaviors/default/spin.js.

The in-repo tails-and-scales DESIGN.md section 0.1 records that Node and Chromium V8 differ in the last bit of Math.sin/cos for about 3% of inputs. Deterministic replication would be fragile for agent-written code.
- **[verified]** SES lockdown and Compartments work together with three r186 rendering and automerge-repo in Chromium. So Hyperfy-style sandboxed behaviour scripts can share one SES world with @endo/captp.
  - _Evidence:_ In Playwright, after lockdown: three renders (1 draw call), the automerge-repo doc change applies (hp 2), and the Compartment-evaluated behaviour sees typeof document === "undefined". The only warning is "Removing intrinsics.%IteratorPrototype%.join". In Node, a Compartment with no fetch endowment cannot call fetch. Hyperfy's Scripts.js and lockdown.js do the same in production.
- **[verified]** The borrowed architecture works end to end across two Automerge peers. Behaviours are stored as source in the doc and compiled in SES. Systems pick entities by which components they carry, and each entity is simulated only by its owner. Cross-owner damage goes through an inbox the target's owner drains. Visuals are a swappable component.
  - _Evidence:_ exp-borrowed.mjs ran over the real Automerge sync protocol:
- Both peers end with the same positions (sheep 19, T-rex 18) and identical document heads.
- The sheep's hp went to 0 through the inbox: alice-owned T-rex damaged bob-owned sheep, and bob applied it.
- The visual went billboard → gltf → +animator while the behaviour was untouched.
- An agent edit to the behaviour source slowed the T-rex from 4 to 1 unit/s. Both peers logged teardown/compile.
- Concurrent hp and visual edits merged.
- 248 sync messages; the doc is 3,798 B.
- **[verified]** The PlayCanvas Editor (frontend MIT since Aug 2025) already exposes an agent-facing driver API over MCP. That API is the best template for our CapTP surface.
  - _Evidence:_ src/editor/driver/entity.ts registers entities:create, modify (batched), components:add/remove, reparent and scripts:add; other driver files register assets:script:text:set, viewport:capture, viewport:focus, history:undo/redo, editor:logs, selection:get/set and templates:apply/revert. src/editor/mcp/register.ts forwards every driver method to MCP. Entities sync through a flat map keyed by resource_id with path ops (entities-sync.ts syncPaths).
- **[verified]** Decentraland SDK7 @dcl/ecs (Apache-2.0) is the cleanest reference for CRDT granularity in an ECS: last-writer-wins per (entity, component) with Lamport timestamps, plus grow-only value sets for events.
  - _Evidence:_ lww-element-set-component-definition.js keeps a timestamp per entity per component and breaks ties by comparing serialized bytes. grow-only-value-set-component-definition.js holds append-only, timestamp-sorted sets. It did not bundle standalone with Vite (unresolved @protobufjs/utf8, protobuf schemas), so use the ideas, not the code.
- **[verified]** Small ECS libraries are fine as a runtime index over the doc. miniplex matches the doc shape best: entities are plain objects and component names are strings, so an agent can invent new component names at runtime.
  - _Evidence:_ exp-ecslibs.mjs:
- miniplex: a query view updates on addComponent (0→1), the onEntityAdded event fires, and a component name invented at runtime is queryable. 4.1 KB gz.
- bitecs 0.4: an IsA prefab instance matches the prefab's component query, but the data is not inherited (hp undefined). 4.8 KB gz, MPL-2.0.
- koota: 11.3 KB gz.
- **[likely]** No existing open-source Automerge + three.js engine or editor exists. The two collaborative three.js editor prototypes found both use server-backed sync.
  - _Evidence:_ Web searches found none for Automerge.
- jvera71/ThreejsEditorCollaborative (2026-05): maps editor Commands to LWW path ops over a @microsoft/signalr server.
- pramishp/space-fe (2024): Yjs maps for objects, geometries and materials keyed by uuid, over y-websocket.
Both cloned and read.
- **[verified]** The monorepo already contains a working Automerge bootstrap that can be copied (not imported; CLAUDE.md bans cross-package imports).
  - _Evidence:_ packages/tails-and-scales/net/repo.js: lazy import() of automerge-repo/slim, wasm loaded via ?url, IndexedDB storage, BroadcastChannel and wss://sync.automerge.org, link as capability; pinned @automerge/automerge 3.5.0 and automerge-repo 2.5.6.

net/presence.js: validated ephemeral messages over handle.broadcast with a 5 s heartbeat.
- **[verified]** Hyperfy has the most complete in-world app model to learn from:
- blueprints separate from entity instances; editing a blueprint rebuilds every instance
- a build/unbuild lifecycle
- a crash-block placeholder when a script fails
- events queued and replayed by blueprint version
- a fixed-step loop with a set of 'hot' entities that get per-frame updates
Its AI integration rewrites a blueprint's whole script, which is the wrong grain for incremental agent edits.
  - _Evidence:_ Read in the cloned source (not executed: the sandbox blocked running its build scripts): src/core/World.js, systems/Blueprints.js (modify → entity.build()), entities/App.js (build, unbuild, crash-block, eventQueue version check), systems/Scripts.js (Compartment with a whitelist), systems/ServerAI.js (LLM create/edit/fix of the full script).

## Recommendation

Write our own core in vanilla JS on plain three.js (about 1.5-3k lines including the editor), built on these decisions:

1. **Document shape.** A flat `entities{id}` map. Each entity is `{name, parent, owner, proto?, components:{...}}`, with transform stored as separate position, rotation and scale values. Small components and vectors are replaced whole. Behaviours are stored as source under `behaviors{name}`. Events go in append-only per-target inbox lists that only the target's owner drains.
2. **Ownership.** Each entity is simulated only by its owner (NAF-style). Ownership is claimed last-writer-wins, and orphans go to an elected peer.
3. **Sync split.** Live transforms stream over the doc handle's ephemeral broadcast channel at about 10 Hz. The doc gets authored edits plus checkpoints debounced at 0.5 s with a 3 s cap.
4. **Behaviours.** Compiled in SES Compartments with setup/teardown hot-swap (Microverse plus Hyperfy). Each behaviour declares the component query it runs on.
5. **Visuals.** A `visual`/`animator` component backed by a swappable Object3D table (Hubs).
6. **Agent API.** One command API shared by the human editor and the CapTP agent: batched modify, define behaviour, capture, logs, undo (PlayCanvas driver).
7. **Bootstrap.** Copy the tails-and-scales `net/repo.js` bootstrap.

Optionally use miniplex (4 KB) as the query index instead of a hand-rolled one.

**Cost:** we write our own editor UI, XR input, glTF/animation loading and inspector. We get no physics, avatars or voice for free.

**What this forecloses:**
- Hyperfy's ecosystem and apps (GPL, and needs a server).
- A-Frame's inspector and component library.
- Croquet's late-join consistency and deterministic replay. We accept owner-authoritative jitter instead.
- Any Unity/Blender pipeline (Needle).

**Do not:**
- use three.js toJSON or a nested JSX tree as the doc format;
- write per-frame state into Automerge;
- build on deterministic replication for agent-authored code.

## Risks

- The public sync.automerge.org has no access control: anyone with the link can write, including behaviour code that every peer executes. Compartments limit what that code can reach but do not establish trust, so view-only and edit links need a design.
- Ownership handoff under network partition: two peers can both simulate the same entity until their docs merge. Last-writer-wins resolves it deterministically, but expect visible jitter or rubber-banding.
- Delete beats a concurrent edit in Automerge (verified), so an agent can silently lose edits to an entity a human just deleted. The API should report this.
- lockdown() must run before three and automerge are imported, and libraries that mutate JS intrinsics can break under it. Every new dependency needs a lockdown smoke test (Hyperfy needed __hardenTaming__:'unsafe').
- The Automerge bundle is heavy: 1.7 MB gz with the wasm inlined as base64. Use the lazy ?url wasm pattern from tails-and-scales.
- Claims about Hyperfy and Hubs come from reading source, not running it. Running Hyperfy's build scripts was blocked by the sandbox, and Hubs needs its server stack.
- Writing our own core means no ready-made inspector, physics, avatar or XR-input layer. Those are where the real implementation cost lies, not the ECS bookkeeping (~150-200 lines).
- The two-peer prototype wrote transforms into the doc every tick for simplicity. The production split between ephemeral streaming and checkpoints is unproven here and should be spiked.

## Versions tested

- `three@0.186.1`
- `aframe@1.8.0 (super-three@0.184.0)`
- `networked-aframe@0.14.3`
- `@needle-tools/engine@5.1.16`
- `@croquet/croquet@2.0.4`
- `@multisynq/client@1.1.0`
- `bitecs@0.4.0`
- `koota@0.6.6`
- `miniplex@2.0.0`
- `@lastolivegames/becsy@0.16.1`
- `@dcl/ecs@7.31.0 (source read; bundle failed)`
- `@automerge/automerge@3.5.0`
- `@automerge/automerge-repo@2.5.6`
- `@automerge/automerge-repo-network-websocket@2.5.x`
- `yjs@13.6.33`
- `@endo/captp@4.5.1`
- `@endo/far (latest)`
- `ses@2.3.0`
- `vite@5.4.21`
- `hyperfy git HEAD 2025-12-18 (source only)`
- `Hubs-Foundation/hubs git HEAD 2026-08-23 (source only)`
- `croquet/microverse git HEAD 2025-10-30 (source only)`
- `playcanvas/editor git HEAD 2026-10-28 (source only)`
- `mrdoob/three.js editor/ r186 HEAD 2026-10-28 (source only)`
- `networked-aframe git HEAD 2026-06-24 (source only)`

Long-form report with code and numbers: [`prior-art-report.md`](./prior-art-report.md)
