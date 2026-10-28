# merge-meadow research — automerge

_Structured summary returned by the research agent (Opus 5.5), 2026-10-28. Every finding is graded verified / likely / speculative by what the agent actually ran._

## Summary

Automerge works for this product, and every load-bearing claim below was verified with real code (Vite builds, Node peers, headless Chromium, the public server).

**Pins.** Use exactly the same pins as the existing `packages/tails-and-scales`: `@automerge/automerge@3.5.0` and every `@automerge/automerge-repo*@2.5.6`.
- npm's `latest` tag for automerge-repo points at 2.6.0-alpha.3, so pin exactly.
- The emitted wasm has the same git blob as the copy already committed under `dist/`, so the new package adds 0 bytes of git storage for it.

**Bundling.** Use the slim entry, with the wasm imported via `?url` and passed to `initializeWasm`.
- No Vite plugins are needed.
- Output: 207 kB JS (67 kB gz) plus a separate 3.64 MB wasm (1.14 MB gz). Pages serves it as `application/wasm` with gzip.
- It works under an http sub-path, in the `vite` dev server, and reloads from IndexedDB.
- The fullfat import fails without a plugin, `vite-plugin-top-level-await` is broken (swc error), and base64 inlining costs 1.70 MB gz.
- file:// fails for any Vite module app, not just this one.

**Public server** (wss://sync.automerge.org):
- It syncs and persists docs: a late joiner gets the latest state after the creator has left.
- A doc change takes about 200 ms for a round trip (100 ms throttle per hop). An ephemeral message takes about 42 ms, and 120 of 120 sent at 60 Hz arrived.
- Binary docs up to 4 MB and ephemeral messages up to 2 MB went through. CBOR keeps Float32Array intact.
- It is offered as-is for prototyping, with no auth: the doc URL is the write capability.

**History growth.** Automerge never discards history.
- About 2.7 B per small change; 50 entities committed at 2 Hz costs about 1 MB/hour and 6–8 ms of CPU per commit.
- So live motion must go over ephemeral messages / the built-in `Presence` class. The doc gets only batched durable commits: rest poses, health, spawns, edits on release.

**Patches.**
- Plain JS strings become collaborative text (`put ""` then `splice`), so use `ImmutableString` for enums, ids and asset refs.
- A Counter arrives as `put` on creation, then `inc` patches.
- The reconciler should turn patches into a set of dirty entities/components and read current values from `patchInfo.after`.
- A listener that throws is rethrown asynchronously as an uncaught error by xstate, and a change made inside a listener is queued, not applied yet.

**Merges.**
- `[x,y,z]` element writes mix per axis, which is fine for position and scale.
- Quaternion element writes merge to an invalid rotation (norm 1.225), so use Euler degrees or replace the whole quaternion.
- A health Counter keeps both concurrent damages (100 −10 −20 = 70); a plain number loses one.
- A wholesale component replace wins over a concurrent field edit and drops it. That makes it right for representation swaps (billboard → mesh).
- Delete wins over nested edits.

**Sharing.** Put the doc URL in the fragment, add heads for a read-only version link, fork with `repo.clone`, download/open with `export`/`import`. A 50-entity scene snapshot is about 8 kB base64. Undo is not built in; a working component-scoped undo prototype exists.

## Findings

- **[verified]** The import that bundles in Vite 5 with base './' and no plugins is `@automerge/automerge-repo/slim` plus `import wasmUrl from '@automerge/automerge/automerge.wasm?url'` and `await initializeWasm(...)`.
  - _Evidence:_ vite-app/v4: 207.39 kB JS (66.56 kB gz) plus a 3,644,225 B wasm (1,143,961 gz, 792,564 br). Under Playwright at http://127.0.0.1:4199/vibe-dump/v4/ it was ok in about 100 ms wall (40 ms init), and a reload found the doc from IndexedDB. The vite dev server also worked.
- **[verified]** The default (fullfat) import fails without a plugin, and vite-plugin-top-level-await 1.6.0 breaks the build. vite-plugin-wasm alone with build.target es2022 works.
  - _Evidence:_ v1 error: "ESM integration proposal for Wasm is not supported". v2 error: swc "missing field `type`" (@swc/core 1.16.20). v2b: 213 kB JS (67.7 kB gz) and it ran fine.
- **[verified]** Inlining the wasm as base64 is a bad trade: 1.70 MB gz JS against 1.14 MB gz for the separate wasm.
  - _Evidence:_ v3 output: 5,066 kB (1,695 kB gz) in a single chunk; about 660 ms wall to boot against about 100 ms for v4.
- **[verified]** file:// does not work for any Vite module build, Automerge or not.
  - _Evidence:_ All variants failed with Chromium's "Access to script ... from origin 'null'" error on the module script.
- **[verified]** GitHub Pages serves the wasm correctly, and the new package's wasm is byte-identical to the one tails-and-scales already committed, so it costs nothing extra in git.
  - _Evidence:_ curl -I on the deployed tails-and-scales wasm gave content-type application/wasm, content-encoding gzip, content-length 1161233, max-age=600. git hash-object of both wasm files is 2e00105898b701d190ee20dc6100dc7079c78449.
- **[verified]** npm's `latest` tag installs automerge-repo 2.6.0-alpha.3, so the versions must be pinned exactly to 2.5.6.
  - _Evidence:_ npm view dist-tags shows latest: 2.6.0-alpha.3. A fresh `npm i` installed the alpha. It worked (patches identical, JS 162 kB / 50.8 kB gz without IndexedDB).
- **[verified]** Two Node peers sync through wss://sync.automerge.org. A doc change takes about 200 ms for a round trip; an ephemeral message takes about 42 ms.
  - _Evidence:_ net-test.mjs, 10 runs each. Change RTT median 201 ms (194–528); ephemeral RTT median 42 ms (41–103). B.find took 147 ms; connecting took 359 ms. The source has DocSynchronizer.syncDebounceRate = 100.
- **[verified]** The public server stores and forwards documents.
  - _Evidence:_ After A shut down, a new peer C found the doc with the latest state in 219 ms. find() on an unknown doc rejects as 'unavailable' after about 806 ms.
- **[verified]** A headless Chromium page (IndexedDB plus WebSocket) and a Node peer sync both ways through the public server, including ephemeral messages.
  - _Evidence:_ vite-app/pwnet.cjs: the browser created the doc, the Node peer found it in 303 ms and wrote fromNode, and the browser saw that. The browser wrote fromBrowser, and the browser received the ephemeral reply.
- **[verified]** Ephemeral messages are reliable at 60 Hz, carry CBOR types including typed arrays, accept large payloads, and are not echoed back to the sender.
  - _Evidence:_ 120/120 burst messages delivered. Float32Array, Uint8Array, Date, 2^40 and nested objects were preserved. 64 KB, 512 KB and 2 MB payloads arrived. 0 self-deliveries.
- **[verified]** automerge-repo 2.5.6 ships a Presence class (heartbeats, TTL, per-channel state) that works through the public server.
  - _Evidence:_ share.mjs: Q received snapshot, update(cursor [1,2,3]), heartbeat and goodbye events. getPeerStates returned {peerId: {value, lastSeenAt, lastActiveAt}}. Defaults are 15 s heartbeat and 45 s TTL.
- **[verified]** The network throttle coalesces rapid changes on the wire, but history still records every change.
  - _Evidence:_ A made 120 changes at 60 Hz. B saw 41 change events and ended with the right state; the doc holds 120 changes.
- **[verified]** History growth: about 2.7 B per small change (1.1 B as integer mm). Committing 50 entities at 2 Hz costs about 1 MB/hour, 6.4 ms CPU per commit in Node and 8.0 ms in Chromium.
  - _Evidence:_ growth.mjs, 10k changes. List element writes 27,341 B; wholesale list replace 101,806 B; text string 106,903 B; ImmutableString 25,252 B; int mm 11,219 B. 50 entities x 1200 commits: 165,934 B and 7.6 s. Chromium through the handle: 8.03 ms per 50-entity commit, 0.244 ms per single field. A history-free resnapshot is 156–186 B.
- **[verified]** Overwriting a field many times inside one change still records every write, so batching only helps if each field is assigned once.
  - _Evidence:_ 10k assignments to pos[0] inside a single change saved as 14,214 B.
- **[verified]** Patch shapes, for the reconciler:
- Nested field set: a single put.
- Counter: put on creation, then inc.
- Plain string: put "" then splice.
- ImmutableString: a single put.
- Entity delete: del.
- List splice: insert / del plus a splice per string.
- Wholesale replace: put {} or [] followed by every field.
- No-op assign: no event.
- Events fire synchronously.
  - _Evidence:_ patches.mjs output, recorded verbatim in REPORT.md §4. patchInfo = {before, after, source}; source is 'change' for both local edits and merges.
- **[verified]** A dirty-set reconciler (entity, component) that reads values from patchInfo.after handles every edit kind uniformly.
  - _Evidence:_ reconcile-undo.mjs logged: update rex [*] | [transform] | [health] | [visual] | update sheep [*] | remove sheep. Final hp 90, src rex2.png.
- **[verified]** Change-listener pitfalls:
- A listener exception is rethrown asynchronously as an uncaught error by xstate; the handle survives.
- handle.change inside a listener is queued.
- A.toJS throws on sub-objects.
- An ImmutableString value is an object, so `=== 'mesh'` is false.
  - _Evidence:_ uncaughtException 'boom'; the handle then delivered 3/3 later events. Inside the listener the read gave n=1, and n=2 after the outer change returned. 'must be the document root'. isImmutableString was true.
- **[verified]** Merges of concurrent edits:
- vec3 element writes mix per axis.
- Quaternion element writes produce an invalid rotation.
- Wholesale replace is atomic.
- Concurrent list pushes on a vec grow its length.
- Counter damage sums; a number loses one damage.
- Text interleaves.
- Delete wins over a nested edit, but a re-put wins over delete.
  - _Evidence:_ merge.mjs, all converging both ways:
- Per-axis mix gave [5,0,7].
- Quaternion gave [.707,.707,0,.707] with norm 1.225; replaced wholesale, norm 1.000.
- Pushes gave [0,0,0,8,9].
- Counter 100 −10 −20 = 70; number gave 80.
- updateText "Rex" → "T-Rexy"; a numeric text gave "5,0,7".
- Field-wise visual edits mixed to {kind:mesh, src:new.png}.
- Counter inc against a reset gave 90.
- **[verified]** Share, fork, snapshot and history all work:
- URLs with heads.
- handle.view(heads) gives a read-only handle.
- repo.clone forks with history and can merge back.
- export/import round-trips.
- A 50-entity scene is small enough for a fragment snapshot.
  - _Evidence:_ share.mjs / share2.mjs:
- automerge:<id>#<heads> passes isValidAutomergeUrl.
- view.change throws 'view-only mode'.
- A fork merged back and the title propagated; a clone of a past view had systems=0.
- import kept identical heads, and import with {docId} returns the same handle.
- Scene save is 5,872 B (7,830 base64url chars; 4,393 B with no history). A.view at heads takes 3.1 ms; getHistory(10k) takes 36 ms.
- **[verified]** Component-scoped undo works by recording (path, before-value) per local change and writing those values back as a new change. It keeps concurrent remote edits to other components.
  - _Evidence:_ reconcile-undo.mjs: after undo the doc was {ai: {speed: 9 (remote)}, visual: {kind: billboard (restored)}}. Caveat: a JSON-based restore turns Counter into a number and ImmutableString into text, so values must be re-wrapped.
- **[verified]** Binary assets of 4 MB and up sync through the public server as Uint8Array docs.
  - _Evidence:_ asset.mjs: 0.25 MB in 358 ms, 1 MB in 387 ms, 4 MB in 1379 ms to a fresh peer, all byte-identical.
- **[likely]** The public server is offered as-is for prototyping: not private, no reliability guarantees, no published limits or retention policy, no auth.
  - _Evidence:_ automerge.org docs and web search. curl https://sync.automerge.org returns 'running'. No limits were hit up to 4 MB docs or 2 MB ephemeral messages.
- **[likely]** BroadcastChannelNetworkAdapter syncs between tabs.
  - _Evidence:_ Not re-tested here. tails-and-scales ships it with the same pins and documents it working.

## Recommendation

**Adopt automerge-repo 2.5.6 + automerge 3.5.0, pinned exactly, set up the way tails-and-scales does it.**
- **Imports:** the slim entry plus the wasm via `?url`.
- **Storage:** IndexedDB.
- **Network:** BroadcastChannel and the WebSocket adapter to wss://sync.automerge.org, with a `?sync=` override for a self-hosted server.
- **Cost:** about 67 kB gz of JS plus a 1.14 MB gz wasm before the scene first renders. Start loading it early and show a boot overlay.

**Split data into three planes.**
1. **Scene doc** (authored and durable state). Shape:
   - `{schema, meta, entities: {id: {name, parent, prefab, transform: {p, r: eulerDeg, s}, components: {name: map}}}, systems: {name: {code: text, enabled, order}}, componentTypes, assets}`.
   - Use ImmutableString for enums, ids and asset refs.
   - Use `hp: Counter` with `max` a number, clamped on read.
   - Represent sets as maps of `true`.
   - Change a representation by replacing the whole visual component map.
2. **Ephemeral / Presence** for live transforms: packed Float32Array at 15–20 Hz from one elected sim authority. The same channel carries drag previews, cursors, XR poses and roles.
3. **One immutable doc per binary asset.**

**Commits.** Make them batched and rare:
- an edit when the user releases a drag;
- durable runtime state (rest poses, health, spawns) every few seconds, in one change, only for entities that changed.

**Never commit per-frame transforms.**

**Reconciler.** Turn patches into a dirty set of entities/components and read the values from `patchInfo.after`. Wrap it in try/catch and never call `change` from inside it.

**Links.**
- Share: the doc URL in the fragment.
- Version link: the URL plus heads, opened read-only.
- Fork: `repo.clone`.
- Download / open: export / import.
- Compact: fork from the current state, behind an explicit button.

**Agent / CapTP.** Expose verbs such as spawn, setComponent, defineSystem and transaction. Each verb is one `handle.change`, with a message for history and undo.

**What this costs and forecloses:**
- **Access control.** It rules out server-side auth and privacy for as long as we stay on the public server: the doc URL is full write access. CapTP attenuation only means something if agents never get the URL.
- **Determinism.** Choosing a single sim authority over every peer simulating rules out lockstep determinism; that would need a deterministic ECS and a command log, as tails-and-scales does.
- **Unbounded history.** It commits us to history that only grows; compacting means a new URL.
- **Alternatives.** If it later turns out we need auth or reliability, the WebSocket adapter can point at a self-hosted `@automerge/automerge-repo-sync-server` with no other code change.

## Risks

- wss://sync.automerge.org is offered as-is for prototyping: no SLA, no published retention policy or rate limits, no privacy, no auth. Anyone with the doc URL can write, including vandals and agents that get around CapTP.
- History never shrinks. Committing transforms at 2 Hz for 50 entities costs about 1 MB/hour and 6–8 ms CPU per commit, and late joiners download all of it. Compacting changes the doc URL and breaks merging with old copies.
- Plain JS strings become collaborative Text (put "" plus splice patches); concurrent edits interleave ("T-Rexy", "5,0,7"). An ImmutableString is an object, so `=== 'mesh'` is false and code must call String().
- Writing quaternion elements independently merges to an invalid rotation (norm 1.225). Concurrent push on a vec grows its length.
- A wholesale component replace silently drops a concurrent field edit. Delete wins over nested edits, but a concurrent re-put wins over delete.
- Counter has no bounds: hp can go below 0 or above max, so clamp on read. A concurrent reset plus damage keeps the damage.
- If every peer runs systems and writes results to the doc, damage is applied N times. We need an elected sim authority and failover; this is not designed yet.
- xstate rethrows change-listener exceptions asynchronously as uncaught errors, and handle.change inside a listener is queued (stale reads).
- npm's latest tag points at 2.6.0-alpha.3. An unpinned install silently pulls the alpha, and its JS is a different size.
- The 1.14 MB gz wasm is on the critical path to first render. Pages caches it for only 10 minutes, and caches are per path, so it is not shared with tails-and-scales.
- file:// preview is impossible for any Vite module build.
- Undo restore via JSON loses the Counter and ImmutableString types unless values are re-wrapped.
- A merged text edit to system code can be syntactically broken, so validate or sandbox before running.

## Versions tested

- `@automerge/automerge@3.5.0`
- `@automerge/automerge-repo@2.5.6`
- `@automerge/automerge-repo-network-websocket@2.5.6`
- `@automerge/automerge-repo-storage-indexeddb@2.5.6`
- `@automerge/automerge-repo-storage-nodefs@2.5.6 (installed, unused)`
- `@automerge/automerge-repo@2.6.0-alpha.3 (npm latest tag, build/patch check)`
- `@automerge/automerge-repo-network-websocket@2.6.0-alpha.3`
- `vite@5.4.21`
- `vite-plugin-wasm@3.6.0`
- `vite-plugin-top-level-await@1.6.0 (broken with @swc/core@1.16.20)`
- `node@22.22.0`
- `playwright (pre-installed) chromium headless`

Long-form report with code and numbers: [`automerge-report.md`](./automerge-report.md)
