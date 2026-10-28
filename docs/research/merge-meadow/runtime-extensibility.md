# merge-meadow research — runtime-extensibility

_Structured summary returned by the research agent (Opus 5.5), 2026-10-28. Every finding is graded verified / likely / speculative by what the agent actually ran._

## Summary

Verified end to end: system code can be stored in the Automerge doc as source text and hot-swapped on every peer. Two headless-Chromium peers ran a real Vite 5 build with SES lockdown, three.js and Automerge WASM, synced through wss://sync.automerge.org. Peer A added a new component plus a new system, and peer B had it compiled and running 89 ms later. Compiling one system takes 0.1–1 ms. A system that throws is isolated per system and suspended locally. A syntax error keeps the last good version running. Durable state lives in components and survives a swap; caches survive through hot.data.

**Recommended system contract:** an ES-module string with only `export default { init(world, hot), update(world, dt), dispose, on, represent }`, turned into a script by one regex. No parser is needed. @endo/module-source would be the real ESM route, but it costs 1.6 MB min / 378 KB gz and fails in a Vite browser build.

**Isolation: run SES Compartments (one per system version) inside a Web Worker. Keep lockdown off the main thread.**
- Lockdown takes 9–12 ms on desktop and about 37 ms at 4x CPU throttle.
- On the main thread it makes three's matrix code 2x slower (updateMatrixWorld) to 8x slower (Matrix4.compose). The cause is V8: freezing Array.prototype or Object.prototype alone reproduces it.
- A worker watchdog terminated an infinite-loop system after 267 ms, suspended it and respawned the worker with state intact, while rendering kept going.
- On the main thread such a loop freezes every peer on every load. A localStorage crash marker (about 4 µs per system per frame) only recovers after the user kills the tab.

**Never pass live three.js objects into a sandbox.** I verified an escape: from one Mesh, sandboxed code walked the parent chain to a sibling's texture image and reached window, fetch and localStorage. harden() on three classes breaks three globally. Representation must be data: a JSON node spec built by the host from an allowlist, plus a frozen per-entity animation handle.

**Schemas:** a JSON Schema subset in doc.components. It drives generic editor forms, either a hand-rolled renderer of about 50 lines or a mapper onto lil-gui (8.4 KB gz); both worked on a component the editor had never seen. It is also exactly the format an agent passes to defineComponent over CapTP.

**Security:** an edit link is a code-execution capability on the github.io origin that all vibe-dump apps share. A true view-only link is impossible with the public sync server, because the document ID grants both read and write. The options are a snapshot in the URL fragment (about 1.3 KB) or a mirror doc of signed snapshots with an Ed25519 key in the link.

**CapTP needs `import 'ses'`, but not lockdown.**

## Findings

- **[verified]** Doc-stored system source is compiled and hot-swapped on remote peers over sync.automerge.org with SES lockdown + three.js + Automerge WASM in a Vite 5 production build
  - _Evidence:_ pw/run-build.cjs: page A (ses.html) creates the doc via automerge-repo 2.5.6 slim + automerge.wasm?url + WebSocketClientAdapter('wss://sync.automerge.org'), then adds components.Spin + systems.spin. Page B (?doc=automerge:oUYj...) logged 'doc change -> [{name:spin, ok:true, ms:0.2}]' 89 ms later. Rendering under lockdown confirmed in shots/peerB.png. Compile 0.1-1 ms per system.
- **[verified]** lockdown() cost: about 10 ms on desktop Chromium, about 37 ms at 4x CPU throttle, 56-112 ms at 6x. ses adds 87 KB min / 28.5 KB gz
  - _Evidence:_ pw/throttle.cjs, 5 runs each: x1 9.0-12.2 ms; x4 35.8-40.6; x6 55.9-111.8. sizes/ses Vite build: 87,036 B min / 28,476 B gz. Node: import ses 25 ms, lockdown 9.4 ms. new Compartment 0.05 ms; Compartment.evaluate of a system 0.07 ms (new Function 0.09 ms). No per-call overhead: 115.4 vs 115.6 ms/frame on the same workload.
- **[verified]** lockdown makes three.js matrix math 2-8x slower on the thread where it runs, because frozen Array/Object prototypes defeat V8's element-store fast path
  - _Evidence:_ pw/bench.cjs in Chromium (600 iterations, 2000 meshes): updateMatrixWorld 82-87 ms plain vs 174-177 ms lockdown; Matrix4.compose x1.2M 8 vs 66-67 ms; setFromAxisAngle 88 vs 147-149. node/09e: with no SES at all, Object.freeze(Array.prototype) alone takes compose from 5 to 65 ms (Object.prototype alone: 66 ms). Importing ses without calling lockdown: no slowdown (276 vs 260 ms).
- **[verified]** Default lockdown (overrideTaming 'moderate') breaks three's WebXR session with the iwer emulator; overrideTaming 'severe' fixes it
  - _Evidence:_ pw/xr.cjs, iwer 2.7.0 forceInstall + three renderer.xr.setSession: under default lockdown, "TypeError: Cannot assign to read only property 'constructor'" in iwer createActiveRenderState. With ?taming=severe: setSession ok, 240 XR frames. Without lockdown: ok. Real headsets not tested.
- **[verified]** Vite dev server and HMR work after lockdown
  - _Evidence:_ pw/dev-hmr.cjs: lockdown imported first in dev mode. An HMR-accepted module edit was applied with no full reload (__hmrValue 1->2, accepted 1). A full-reload edit re-ran cleanly. Zero page errors.
- **[verified]** Handing live three.js objects to an SES Compartment gives the script window, fetch and localStorage
  - _Evidence:_ app/ses.js on peer B: a Compartment endowed only with one Mesh in the scene walked .parent to the root, then traversed to a Sprite's material.map.image.ownerDocument.defaultView. Logged: {reachedWindow:true, fetch:'function', localStorage:'object'}. THREE loaders also carry network/DOM authority from module scope.
- **[verified]** harden() on three.js classes breaks three for the host app, irreversibly
  - _Evidence:_ harden({Vector3, Quaternion, Euler, Color, MathUtils, Matrix4}), then the host's new THREE.Mesh() threw "Cannot assign to read only property '_onChangeCallback'" (override mistake on frozen prototypes). Hyperfy's lockdown.js sets __hardenTaming__:'unsafe' (harden becomes a no-op) and endows unhardened THREE classes.
- **[verified]** Representation as data (JSON node spec + host allowlist + frozen animation handle) gives scripts full visual flexibility without exposing three objects
  - _Evidence:_ node/06 + proto/represent.js: a script's represent(e) returned a body/torso/head spec; the host built 2 meshes; animate() moved the head through handle.set (y=0.997). Inside the compartment typeof h.parent === 'undefined' and the handle is frozen. ShaderMaterial and unknown geometries were refused.
- **[verified]** A worker sim with a watchdog recovers automatically from a hanging (or memory-hogging) system while rendering continues; on the main thread a hang freezes the tab, and a crash marker only helps on the next load
  - _Evidence:_ pw/hang.cjs. Worker: 'watchdog: sim hung 267 ms inside oops -> terminate, suspend, respawn'; render frames 214 vs sim 104; sheep state preserved. pw/oom.cjs: an allocating loop was caught by the same watchdog (restart within 0.5 s). Main thread: Playwright evaluate did not return in 3 s. After closing the tab, the reopened page booted with safeModeSuspect 'oops' and ran 97 frames. Marker write cost 3.95-4.36 us. Per-frame transfer: structuredClone of 1000 full entities 2.9 ms; packed Float32Array of transforms 0.115 ms.
- **[verified]** Inside a compartment, scripts get no fetch/document/process/console/setTimeout, and Math.random and Date throw; source containing 'import(' or '<!--' is rejected even inside strings or comments
  - _Evidence:_ node/01b: Math.random() throws '%SharedMath%.random() throws'; new Date() throws; console undefined; a string literal containing 'import(x)' raised SES_IMPORT_REJECTED; a comment containing '<!--' raised SES_HTML_COMMENT_REJECTED; eval('1+1') raised SES_EVAL_REJECTED. Function loader probe: fetch 'function', process 'object', world.query patchable.
- **[verified]** One compartment per system prevents cross-script global poisoning; a shared compartment (Hyperfy model) does not
  - _Evidence:_ node/08: in a shared compartment, globalThis.Math={sin:()=>42} was then seen by the next evaluation (Math.sin(0)=42). With per-system compartments, system b saw typeof leak 'undefined'.
- **[verified]** @endo/module-source (real ESM in a Compartment) works in Node but fails in a Vite browser build and costs 378 KB gz
  - _Evidence:_ node/02: two-module import works (first 21 ms, re-import ~3 ms). Browser build: 'Error transforming source ... Cannot read properties of undefined (reading get)', both minified and unminified, whether imported before or after lockdown. Chunk 1,627,780 B min / 378,120 B gz.
- **[verified]** The 'export default only' regex lowering gives ESM-like authoring with no parser, under both Function and SES
  - _Evidence:_ node/06 toScript(): module-level consts/functions plus export default worked inside the compartment; a leading import was rejected with a clear message. Note: 'export const' before the default slipped through in the test, so the rule needs the stricter check described in the report.
- **[verified]** Concurrent edits of source text can merge into invalid code, and whole-string assignment silently drops concurrent splices; use A.updateText plus compile-gating
  - _Evidence:_ node/04 (automerge 3.5.0): two splices on one token merged to 'Math.min(h.Diet.bite, 5)h.Diet.bite * 2' (SyntaxError). Splice + assignment: the splice was lost with getConflicts empty. ImmutableString: atomic, 2 conflict values visible. Size after 100 rewrites of an 873 B source: updateText 566->1,179 B, assignment 2,885 B, ImmutableString 1,539 B.
- **[verified]** @endo/captp needs `import 'ses'` (for the assert global) plus the eventual-send shim, but not lockdown
  - _Evidence:_ node/05*: with no ses: 'assert is not defined'. ses imported without the shim: 'HandledPromise is not defined'. ses + @endo/eventual-send/shim.js with no lockdown: round-trips records and nested objects, Array.prototype not frozen. @endo/init calls lockdown with default taming. captp+far+ses bundle 154 KB min / 51.6 KB gz.
- **[verified]** JSON-Schema-subset component registry drives generic editor forms for components the editor has never seen
  - _Evidence:_ pw/forms.cjs + shots/forms.png on a runtime-defined Rideable (integer range, enum, color, vec3, tags, bool, nested object). Hand-rolled renderForm (~50 lines, 3.6 KB source) emitted mount=fly, seatOffset.1=2.25, tame=true, allow=[player,npc]. The lil-gui mapper emitted mount=walk, tame=true. Gzipped sizes: lil-gui 8,382 B; tweakpane 31,718 B; json-editor 109,861 B.
- **[verified]** QuickJS-in-WASM gives true interruption and memory limits on the main thread, but is far too slow for per-frame ECS systems
  - _Evidence:_ node/10, quickjs-emscripten 0.32.0: while(true) interrupted after 101 ms; memory bomb gave 'out of memory' under a 32 MB limit. 1000-entity JSON marshal + trivial update: 13.34 ms/frame vs 0.052 ms native. Wasm 503 KB.
- **[likely]** A true view-only link cannot be enforced with automerge-repo + sync.automerge.org; a fragment snapshot or a signed mirror doc are workable substitutes
  - _Evidence:_ node/07: demo scene JSON 3,156 B -> deflate 990 B -> 1,320 base64url chars. Ed25519 via WebCrypto: 32 B public key (43 chars), 64 B signature; verify ok=true, tampered=false. The no-ACL claim rests on automerge-repo having no access-control API and the doc ID being the only handle.
- **[verified]** Prior art: Hyperfy v2 uses SES with one shared Compartment and live THREE math classes; A-Frame refuses re-registration; Decentraland SDK7 allows remove+add system hot swap and exposes JSON Schema from defineComponent; the three.js editor uses new Function with renderer/scene endowed
  - _Evidence:_ hyperfy@0.16.0 (5d20037) src/core/systems/Scripts.js + lockdown.js read. aframe 1.8.0 component.js:657 throws 'has been already registered'. @dcl/ecs 7.31.0 run: removeSystem('drain')+addSystem hot-swapped (hp 90->91); Health.schema.jsonSchema = {type:object, properties:{hp:{type:number}}}. three.js editor/js/libs/app.js:102 uses new Function(scriptWrapParams, source + 'return {...}'). Roblox drafts, Minecraft behaviour components and Third Room QuickJS-WASM are from docs/search only.

## Recommendation

**Recommendation**

**1. Doc layout.**
- `doc.components[Name] = {schema: <JSON Schema subset>, description, rev}`
- `doc.systems[name] = {source: Text, order, enabled, rev, lastEditor}`
  - `source` is a module with only `export default {init, update, dispose, on, represent}`.
  - Edits must go through `A.updateText`, never whole-string assignment.
- `doc.libs[name] = {source}`, reached from scripts as `world.lib(name)`.
- `doc.entities[id][Name] = data`, with representation written as `Look {kind | spec}`.
- Seed the generic hunt/flee/damage/rideable systems as doc-stored sources, so agents edit them through the same path as everything else.

**2. Loading.**
- On each doc change, diff systems by source hash. Debounce about 150 ms while a human types.
- Compile each changed system in a fresh SES Compartment inside one module Worker. The worker calls `lockdown({overrideTaming:'severe'})`.
- Swap with `dispose` → `init(world, {prev, data})`. If compilation fails, keep the last good version.
- Report per-system status (compile/run errors, suspended) locally and through the agent's CapTP return values. Do not write status into the doc.

**3. Main thread.**
- Runs three, WebXR, the editor, automerge-repo and CapTP. It does no lockdown; it only does `import 'ses'` plus the eventual-send shim, which CapTP needs.
- Scripts never get three objects. They return JSON specs that the host instantiates from an allowlist, and get a frozen per-entity animation handle.
- The world API is hardened: query/get/spawn/despawn/emit/events/rand/time/log/lib, plus host-provided spatial queries.

**4. Recovery.**
- Watchdog of about 250 ms: terminate the worker, suspend the culprit, respawn with the last snapshot.
- A `#safe` boot flag that starts with all systems disabled.
- A "revert system to revision N" action, using Automerge history.

**5. Sharing.** The edit link is the doc URL. A view link is either a fragment snapshot or a mirror doc of signed snapshots.

**Cost:**
- About 90 KB for the worker chunk (SES plus runtime). The 28 KB gz of SES is already paid if CapTP lives in the page.
- A two-mirror architecture: a worker sim and a main-thread render copy, with packed transforms transferred each frame (0.1 ms for 1000 entities).
- An async editor API, and input delivered to systems as events/components.

**Forecloses:**
- Systems touching three objects, the DOM, input devices or the network directly. They go through the world API and data instead.
- Synchronous main-thread raycasts from systems.
- Real ESM imports between scripts; `world.lib` replaces them.

**Cheaper alternative if the worker is rejected:** SES on the main thread with `overrideTaming:'severe'`, plus the crash marker. You accept 2–8x slower three matrix math and a tab freeze on hangs until reload.

**Do not ship plain `new Function` on the shared github.io origin.** Any link holder could then read every vibe-dump app's storage and hijack the agent's CapTP session.

## Risks

- Write authority is unsolved here. Committing sim results per frame from every peer would produce N conflicting writers at 60 Hz and blow up doc size; another dimension must define who commits what, and how often.
- SES 2.3.0 lags new Chromium intrinsics: the '%IteratorPrototype%.join' warning appears on every page. A future browser could break lockdown, so pin ses and test on browser updates.
- Lockdown on any thread that also runs three/WebXR costs 2-8x on matrix math and needs overrideTaming 'severe' for the iwer XR emulator. Lockdown on a real headset browser is untested.
- A two-thread architecture adds one frame of latency from editor action to visual, needs input routed to the worker as events, and duplicates entity state.
- SES rejects source text containing 'import(' or '<!--' anywhere, including comments and strings, which confuses authors unless the editor rewrites the error message.
- The regex lowering of 'export default' is intentionally simple. Edge cases fail closed with a SyntaxError, and the 'export const' check needs tightening.
- Concurrent human edits of the same system can merge into invalid code. Compile-gating keeps the scene alive, but the source in the doc stays broken until someone fixes it. Consider Roblox-style draft-then-commit editing.
- A view-only link is client-enforced only, unless signed snapshots are used. Anyone holding the edit doc ID can write, and doc IDs leak when links are pasted.
- The watchdog budget (250 ms) can false-positive on a legitimately heavy frame or on a slow device such as a Quest; it needs tuning and maybe a consecutive-miss rule.
- @endo/module-source browser breakage might be fixable with a CJS interop alias, but its 378 KB gz size makes that irrelevant unless real cross-script ESM imports become a hard requirement.

## Versions tested

- `ses@2.3.0`
- `@endo/module-source@1.5.0`
- `@endo/captp@4.5.1`
- `@endo/far@1.1.14`
- `@endo/eventual-send@1.5.0`
- `@endo/init@1.1.13`
- `three@0.186.1`
- `@automerge/automerge@3.5.0`
- `@automerge/automerge-repo@2.5.6`
- `@automerge/automerge-repo-network-websocket@2.5.6`
- `vite@5.4.21`
- `iwer@2.7.0`
- `lil-gui@0.21.0`
- `tweakpane@4.0.5`
- `@json-editor/json-editor@2.17.3`
- `quickjs-emscripten@0.32.0`
- `aframe@1.8.0`
- `@dcl/ecs@7.31.0`
- `hyperfy@0.16.0 (git 5d20037)`
- `playwright@1.63.0`
- `chromium@153.0.8010.12`
- `node@22.22.0`

(The agent's long-form report was not written as a file; this structured output is the full record.)
