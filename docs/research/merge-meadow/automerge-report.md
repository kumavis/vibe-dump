# Automerge research report: how to run it in this product

Dimension: **automerge**. Tested on 2026-10-28 with Node v22.22.0, headless Playwright Chromium and Vite 5.4.21.
Scratch dir: `/tmp/claude-0/-home-user-vibe-dump/f580ed5c-7e6e-5a9a-b50f-88ecc42cf4d9/scratchpad/research/automerge/`.
Every script named here is in that dir and can be re-run.

## Versions tested

| package | version | note |
|---|---|---|
| @automerge/automerge | 3.5.0 | latest stable (2026-09-16) |
| @automerge/automerge-repo | **2.5.6** | latest *stable*. **npm's `latest` dist-tag points at `2.6.0-alpha.3`**, so an unpinned `npm i` installs the alpha |
| @automerge/automerge-repo-network-websocket | 2.5.6 | |
| @automerge/automerge-repo-storage-indexeddb | 2.5.6 | |
| @automerge/automerge-repo (alpha check) | 2.6.0-alpha.3 | builds and emits the same patches; JS is 51 kB gz, against 67 kB gz with IndexedDB on 2.5.6 |
| vite | 5.4.21 | |
| vite-plugin-wasm | 3.6.0 | |
| vite-plugin-top-level-await | 1.6.0 | **broken**: swc error "missing field `type`" |

**Prior art in this repo.** `packages/tails-and-scales` already ships Automerge with exactly these pins (3.5.0 / 2.5.6). It uses the slim entry plus `?url` wasm, IndexedDB, BroadcastChannel and wss://sync.automerge.org, loaded through a lazy `import()`. Its DESIGN.md §2.7 and `net/*.js` are worth reading. Reuse its pins:
- npm workspaces hoist a single copy.
- The emitted wasm, `automerge-LjMxZKTS.wasm`, has git blob `2e00105898b701d190ee20dc6100dc7079c78449`. That blob is identical to the one already committed at `dist/tails-and-scales/assets/`, so the new package's committed `dist/` costs **0 extra bytes of git storage** for the wasm. (Verified with `git hash-object`.)

---

## 1. Vite 5 bundling, base './', sub-path, file://

Four variants are in `vite-app/v1..v4`. Each runs `app-common.js`, which does the following: create a Repo (IndexedDB plus an optional WebSocket), create a doc, write `handle.url` into `location.hash`, reload, and `repo.find(hash)` from IndexedDB.

| variant | import | plugins | build | JS (gz) | wasm | http sub-path `/vibe-dump/<v>/` | reload from IndexedDB |
|---|---|---|---|---|---|---|---|
| v1 | `@automerge/automerge-repo` (fullfat) | none | **FAILS**: "ESM integration proposal for Wasm is not supported" | - | - | - | - |
| v2 | fullfat | wasm() + topLevelAwait() | **FAILS**: vite-plugin-top-level-await 1.6.0 / @swc/core 1.16.20 error "missing field `type`" | - | - | - | - |
| v2b | fullfat | wasm() only, `build.target:'es2022'` (native TLA) | ok | 213 kB (67.7 kB gz) | 3.64 MB separate file | **ok** (94 ms init) | ok |
| v3 | `/slim` + `initializeBase64Wasm(automergeWasmBase64)` | none | ok | **5.07 MB (1.70 MB gz)**, one chunk | inlined | ok (~660 ms wall) | ok |
| **v4** | `/slim` + `import wasmUrl from '@automerge/automerge/automerge.wasm?url'`; `await initializeWasm(fetch(wasmUrl))` (tails-and-scales passes the URL string straight in) | **none** | ok | **207 kB (66.6 kB gz)** | 3.64 MB raw / **1.14 MB gz** / 0.79 MB br | **ok** (~100 ms wall, 40 ms init) | ok |

- **file://** fails for **every** variant: "Access to script ... from origin 'null'". That is Chromium refusing `type=module` scripts over file://, which hits every Vite app, Automerge or not. It is not an Automerge issue, and the only way round it is inlining everything (e.g. a single-file build). (verified)
- **The deployed Pages wasm**, `curl -I https://kumavis.github.io/vibe-dump/tails-and-scales/assets/automerge-LjMxZKTS.wasm`, returns `content-type: application/wasm`, `content-encoding: gzip`, `content-length: 1161233` and `cache-control: max-age=600`. So `instantiateStreaming` works on Pages. (verified)
- **`vite` dev server** with v4 works in Playwright with no `optimizeDeps` config. (verified)
- **Recommendation: v4.** It is plugin-free, its wasm is a separately cached file that is 30% smaller over the wire than base64, and it matches tails-and-scales. The cost is a 1.14 MB gz wasm on the critical path before the scene can render. Mitigate this by starting the fetch early, either with `<link rel="preload" href=... as="fetch" crossorigin>` or by kicking off `import()` and the `fetch` at module top, and show a boot overlay.

```js
// net/repo.js (recommended shape)
const [{ Repo, initializeWasm }, { default: wasmUrl }, { WebSocketClientAdapter },
       { IndexedDBStorageAdapter }, { BroadcastChannelNetworkAdapter }] = await Promise.all([
  import('@automerge/automerge-repo/slim'), import('@automerge/automerge/automerge.wasm?url'),
  import('@automerge/automerge-repo-network-websocket'), import('@automerge/automerge-repo-storage-indexeddb'),
  import('@automerge/automerge-repo-network-broadcastchannel')])
await initializeWasm(wasmUrl)
export const repo = new Repo({
  storage: new IndexedDBStorageAdapter('<slug>'),
  network: [new BroadcastChannelNetworkAdapter(), new WebSocketClientAdapter('wss://sync.automerge.org')] })
```

Gotcha: import `Counter`, `ImmutableString` and the other types from `@automerge/automerge/slim` or from `@automerge/automerge-repo`, both of which are the same instance (checked: `ImmutableString === A.ImmutableString` is true). Do not import them from the fullfat entry, which would pull in a second wasm init path.

## 2. Network + storage via the public server

Script: `net-test.mjs`. Two Node `Repo`s each have their own `WebSocketClientAdapter('wss://sync.automerge.org')`. All results below are verified.
- **Connect.** A connects in 359 ms. Its peer list is `['storage-server-sync-automerge-org']`.
- **Find.** `B.find(url)` resolves in 147 ms.
- **Change round trip** (A changes, B sees it and changes, A sees that) is **~200 ms median** over 10 runs (194–528).
  - The source of this is `DocSynchronizer.syncDebounceRate = 100` in the automerge-repo source: each hop is throttled to 100 ms.
  - So one-way latency for a doc change is about 100 ms plus RTT/2.
- **Ephemeral round trip** (`handle.broadcast` / `'ephemeral-message'`) is **~42 ms median** (41–103), because it is not throttled.
- **Burst.** 120 ephemeral messages sent at 60 Hz arrived **120/120**.
- **Store and forward.** A was shut down, then a new peer C found the doc from the server alone in 219 ms with the latest state, so the server persists.
- **Unknown doc.** `find(unknownUrl)` rejects with "Document ... is unavailable" after **~806 ms**. Use this for a "link not found" UX.
- **Browser and Node** (`vite-app/pwnet.cjs`): headless Chromium (v4 build with IndexedDB and WebSocket) and a Node peer synced through the public server in both directions, and an ephemeral message reached the browser. The Node peer found the doc in 303 ms.
- **Binary docs** (`asset.mjs`): docs holding random `Uint8Array` of 0.25 MB, 1 MB and 4 MB synced through the public server to a fresh peer in 358 ms, 387 ms and 1379 ms. The bytes came back as a `Uint8Array` and were byte-identical. No size limit was hit up to 4 MB.
- **Ephemeral payloads up to 2 MB** passed (64 KB, 512 KB, 2048 KB). (verified)

**Public server policy** (docs plus web; likely):
- automerge.org says: "for prototyping and development you are welcome to use ours on an 'as-is' basis"; production should run its own server.
- The docs also say it is not private and has no reliability or data guarantees.
- No retention policy or rate limits are published.
- There is **no auth.** The doc URL is a bearer capability: anyone who has it can read and write.
- Self-hosting is the escape hatch: `@automerge/automerge-repo-sync-server`, plus a `?sync=` URL param as tails-and-scales does it.

**Throughput limits on the change path** are set by the 100 ms throttle. A made 120 changes at 60 Hz, and B saw only **41 change events**, coalesced, about 20 Hz. B's final state was correct. **But the doc still recorded 120 changes**, so the throttle saves network bandwidth, not history.

## 3. Share / save by link, fork, snapshot, history

Script: `share.mjs`, `share2.mjs`. Everything in this section is verified.
- **URL.** `handle.url` looks like `automerge:23naAdeuVF8okgqkS9qmSk5rgu3C`, a 28-char base58check doc id. Put it in the fragment as `#automerge:...`, or `#doc=<id>` (the fragment is never sent to Pages). `isValidAutomergeUrl` / `parseAutomergeUrl` handle the parsing.
- **URL with heads.** `stringifyAutomergeUrl({documentId, heads: handle.heads()})` gives `automerge:<id>#<heads>`, which round-trips through `parseAutomergeUrl().heads`. Use it for a "link to this exact version" (read-only).
- **Time travel.** `handle.history()` returned 203 entries for 203 changes. `handle.view(heads)` returns a **read-only DocHandle**: `isReadOnly()` is true and `change()` throws "view-only mode at specific heads". `handle.diff(h1, h2)` returns patches.
  - Raw `A.view(doc, [hash])` takes 3.1 ms on a 10k-change doc.
  - `A.getHistory` takes 36 ms for 10k changes. It materialises every change, so avoid calling it per frame.
- **Fork.** `repo.clone(handle)` gives a new URL with shared history, so the fork can be merged back with `handle.merge(fork)` (verified: the title propagated). A fork of the past is `repo.clone(handle.view(heads))`, which worked.
- **Snapshot download.**
  - `repo.export(url)` gives a `Uint8Array`. Make a `Blob`, then `URL.createObjectURL`, then `<a download="scene.automerge">`.
  - `repo.import(bytes)` gives a new doc id with the same heads and content.
  - `repo.import(bytes, {docId})` restores under the same id.
  - `A.load(A.save(doc))` gives `equals === true`.
- **Sizes for a realistic scene** (50 entities, 3–4 components each, a system code string, 202 changes):

| | size |
|---|---|
| `save` | 5,872 B |
| gzip of `save` | 5,536 B (save is already column-compressed) |
| base64url | 7,830 chars |
| history-free snapshot, `A.save(A.from(A.toJS(doc)))` | 4,393 B (5,858 b64 chars) |
| plain JSON of the state | 10,846 chars |

So a **serverless "snapshot in the link"** (`#snap=<base64url>`) is viable for small scenes, at about 8 kB per 50 entities. It is too long for chat apps for anything bigger. `repo.import` on open turns it into a live doc.

**Undo.** Automerge has no built-in undo. A working prototype is in `reconcile-undo.mjs`:
1. On each *local* change, record `(path, beforeValue)` at **component granularity**, e.g. `entities/<id>/components/<name>` or `entities/<id>/transform`.
2. Read those values from the doc before the change; `handle.diff(beforeHeads, afterHeads)` gives the touched paths.
3. Undo writes the old values back as a new change.

Verified: undoing a local visual swap restored `visual` and kept a concurrent remote edit to `ai.speed`.

Gotcha: restoring via a JSON clone turns a `Counter` into a plain number and an `ImmutableString` into collaborative text. The restore must re-wrap them using `A.isCounter` / `A.isImmutableString`.

Time-travel UX: scrub with `handle.view(heads)`. To "restore", write the view's state as a new change; never rewrite history.

## 4. Patch shapes, for the three.js reconciler

Script: `patches.mjs`, using `handle.on('change', ({patches, patchInfo}))`. `patchInfo` = `{before, after, source}`, where `before` and `after` are full doc snapshots. Every edit below fired **synchronously** inside `handle.change`. All results are verified.

```text
add entity (map with nested maps/lists, Counter, strings) -> 25 patches:
  {"action":"put","path":["entities","trex"],"value":{}}
  {"action":"put","path":["entities","trex","transform","pos"],"value":[]}
  {"action":"insert","path":["entities","trex","transform","pos",0],"values":[0,0,0]}
  {"action":"put","path":["entities","trex","components","health","hp"],"value":100}     <- Counter arrives as a number
  {"action":"put","path":["entities","trex","name"],"value":""}
  {"action":"splice","path":["entities","trex","name",0],"value":"T-rex"}               <- plain strings are TEXT
change nested field  d.entities.trex.transform.pos[1]=5 -> {"action":"put","path":["entities","trex","transform","pos",1],"value":5}
replace whole vec3   pos=[1,2,3]                        -> put pos [] + insert pos,0 [1,2,3]   (new list object)
replace component map visual={kind:'gltf',...}          -> put visual {} + put/splice for every field (7 patches)
splice list          order.splice(0,0,'sheep','grass')  -> insert order,0 ["",""] + splice order,0,0 "sheep" + splice order,1,0 "grass"
splice delete        order.splice(1,1)                  -> {"action":"del","path":["order",1]}
counter increment    hp.increment(-25)                  -> {"action":"inc","path":[...,"health","hp"],"value":-25}
delete entity        delete d.entities.sheep            -> {"action":"del","path":["entities","sheep"]}
assign string        name='Rex'                         -> put name "" + splice name,0 "Rex"
A.updateText         'Rex'->'Rexy'                      -> {"action":"splice","path":[...,"name",3],"value":"y"}
ImmutableString      kind=new ImmutableString('mesh')   -> {"action":"put","path":[...,"kind"],"value":"mesh"}   (single put)
no-op assign of equal number                            -> no change event at all
remote merge (handle.update/merge)                      -> 1 put patch, source "change"
```

**Reconciler rule, verified in `reconcile-undo.mjs`:**
1. **Don't interpret patches op-by-op.** Use them only to build a dirty set of entity ids and component names: `path[1]`, plus `path[2]` or `path[3]` under `components`.
2. Then read the current value of each dirty item from `patchInfo.after` and re-apply that component to its three.js object.
3. This handles text splices, counters, list inserts and wholesale replaces uniformly.

The output for the six edits was `update rex [*] | update rex [transform] | update rex [health] | update rex [visual] | update sheep [*] | remove sheep`, with the final hp 90 and src `rex2.png`.

Gotchas (all verified):
- `A.toJS(subobject)` throws "must be the document root". Use `JSON.parse(JSON.stringify(sub))`; Counters serialise to numbers, or read fields directly.
- **A listener that throws** does not break `change()`. Instead **xstate rethrows the error asynchronously as an uncaught exception**, which kills Node and fires `window.onerror` in the page. The handle keeps working: 3 of 3 later events were delivered. **Wrap the reconciler in try/catch.**
- **Re-entrancy.** `handle.change` called *inside* a change listener is queued. `handle.doc()` still shows the old value until the outer change returns (inner read: n=1; after: n=2). Never write from a listener; defer with `queueMicrotask`. tails-and-scales hit the same thing.
- **An `ImmutableString` in the doc is an object.** `doc.kind === 'mesh'` is **false**, so use `String(x)` when reading.

## 5. High-frequency data (60 Hz transforms)

Measured growth (`growth.mjs`, `growth2.mjs`; single actor, 10,000 changes each):

| encoding | time/change (Node) | `save` bytes | B/change | load |
|---|---|---|---|---|
| list `[x,y,z]` element writes | 85–247 µs | 27,341 | 2.7 | 51 ms |
| list replaced wholesale | 101 µs | 101,806 | 10.2 | 57 ms |
| map `{x,y,z}` | 111 µs | 27,306 | 2.7 | 36 ms |
| text string "x,y,z" | 112 µs | 106,903 | 10.7 | 90 ms |
| ImmutableString "x,y,z" | 48 µs | 25,252 | 2.5 | 25 ms |
| **integer millimetres list** | ~220 µs | **11,219** | **1.1** | 28 ms |
| history-free re-snapshot of any of the above | | 156–186 | | |

More measurements:
- 10k assignments inside **one** change gave 14,214 B. Overwrites inside a change are *still recorded as ops*, so batching only helps if you assign the final value once.
- 2 actors alternating 5,000 changes each gave 16.7 kB. 10 actors with 1,000 each gave 4.5 kB.
- Change metadata (`message`, `time`) is nearly free: 19,041 vs 19,025 B.
- A realistic **commit-everything** load of 50 entities, 2 Hz commits for 10 minutes (1,200 commits × 100 assignments), took **7.6 s of CPU in Node (6.4 ms/commit)** and grew to **166 kB**, about **1 MB/hour**.
- In **Chromium** through a live repo handle (IndexedDB plus WebSocket attached), one 50-entity commit costs **8.0 ms** and a single-field change **0.24 ms**.
- Per-change cost stays flat as history grows: 82–127 ms per 1,000 changes from 0 to 10k.

**Conclusions:**
1. 60 Hz × entities as changes is out: CPU, an unbounded history, and every late joiner downloading it.
2. The network side is already throttled to 10 Hz/hop (§2), so ephemeral messages are the only way to get real-time motion.
3. **Ephemeral works through the public server** (verified):
   - 42 ms RTT, 120/120 messages at 60 Hz.
   - CBOR keeps `Float32Array` and `Uint8Array` as typed arrays; a 200-entity × 7-float `Float32Array` arrives as 5,600 bytes.
   - Nested objects, `Date` and 2^40 survive. `undefined` survives.
   - A sender does **not** receive its own broadcast.
   - The `senderId` is the repo peerId.
4. **automerge-repo 2.5.6 ships a `Presence` class** (verified through the public server):
   - Use it as `new Presence({handle}).start({initialState, heartbeatMs, peerTtlMs})`, then `.broadcast(channel, value)`.
   - It emits `snapshot`, `update`, `heartbeat` and `goodbye` events.
   - `getPeerStates()` gives `{peerId: {value, lastSeenAt, lastActiveAt}}`.
   - The default heartbeat is 15 s, with TTL 45 s. Use it for cursors, selections, XR head and hands, roles, and the sim-authority election.

**Recommended policy:**
- **Live motion**: the sim authority sends packed transforms as `Float32Array` over ephemeral at 15–20 Hz, and peers interpolate.
  - 50 entities × 7 floats is 1.4 kB per message, about 28 kB/s per sender.
- **Drag gestures**: send ephemeral during the drag and **one** `handle.change` on release.
- **Durable runtime state**: commit HP, deaths, spawns and "rest pose" (an entity that stopped, or every ~5–10 s) as **one batched change**.
  - Only include entities that moved more than an epsilon.
  - Positions are quantised; integer mm halves the bytes again.
- **Compaction**: Automerge never garbage-collects history. True compaction is "fork from current state" (`repo.import(A.save(A.from(A.toJS(doc))))`), which **changes the URL and severs merge-ability with old copies**. Offer it as an explicit "Compact / new version" action, not automatically.

## 6. Data modelling: merge semantics

Script: `merge.mjs`. Two actors edit concurrently and are merged both ways. **Every case converged**; the table shows the converged result.

| case | merged result | verdict |
|---|---|---|
| list vec: A `pos[0]=1`, B `pos[0]=2` | `[2,0,0]`, `getConflicts` shows both | LWW per element, by actor id |
| list vec: A drags x, B drags z | `[5,0,7]` | per-axis mix, fine for position/scale |
| list vec: both replace wholesale | `[0,0,7]` | atomic LWW |
| list vec: A replaces, B edits an old element | `[5,5,5]` | B's edit **lost** |
| list vec: both `push` | `[0,0,0,8,9]` | **length 5**: never push into a vec |
| map vec `{x,y,z}`: A x, B z | `{x:5,y:0,z:7}` | same as list elements |
| ImmutableString vec / text assign | `"0,0,7"` | atomic LWW |
| text vec with `updateText`: "5,0,0" vs "0,0,7" | **`"5,0,7"`** | character merge, garbage for numbers |
| **quaternion `[x,y,z,w]` element writes**: A 90° about Y, B 90° about X | `[.707,.707,0,.707]`, **norm 1.225** | **invalid rotation** |
| quaternion replaced wholesale | `[.707,0,0,.707]`, norm 1 | valid |
| **health Counter**: A −10, B −20 | **70** | both damages land |
| health number: A 90, B 80 | 80 | one damage **lost** |
| Counter: A −10, B resets `new Counter(100)` | 90 (either actor order) | increments survive a concurrent reset |
| Counter: A inc, B deletes | deleted | |
| name `updateText` "Rex": A→"T-Rex", B→"Rexy" | **"T-Rexy"** | text merge |
| name plain assign | "Rexy" | LWW, but assign also makes text (§4) |
| system code `updateText`: A `chase(sheep)`, B appends `;roar()` | `chase(sheep);roar()` | good, but can merge to broken code |
| visual: A replaces the component map, B edits `src` | A's map wins | B's edit lost |
| visual field-wise: A `kind=mesh`, B `src=new.png` | `{kind:'mesh', src:'new.png'}` | **inconsistent mix** |
| entity: A deletes, B edits a field | deleted | delete wins over nested edits |
| entity: A deletes, B re-puts the whole entity | B's entity | put wins over delete |
| order list: both insert at 0 | `["y","x","e"]` | both kept |
| both add the component `ai` at the same key | one map wins whole (`flee`), 2 conflicts | atomic per component add |
| agent writes `posM` wholesale, human writes `x=5` | agent's | human edit lost |

**Modelling rules this implies:**
- **Position / scale**: `[x,y,z]` list of numbers, written element-wise through a `setVec(arr, v)` helper that writes only changed elements and never pushes. Mixing per axis is acceptable.
- **Rotation**: store either
  - **Euler degrees `[x,y,z]`**, where per-axis mixing still gives a valid rotation, or
  - a quaternion written as a **whole-list replace**, and always normalised on read.

  Never write quaternion elements independently.
- **Enums, ids, asset refs, URLs, component `kind`**: use `ImmutableString`. It gives atomic LWW, a single `put` patch and the smallest encoding. Read it with `String()`.
- **Human-edited prose and code** (names, descriptions, system source): plain strings, which are collaborative text, edited with `A.updateText` so concurrent edits merge. Validate code before running it, since a merge can break it.
- **Health**: `hp: Counter`, with `max: number`. Clamp on read (`Math.max(0, Math.min(max, hp))`), because Counters are unbounded. A Counter matters whenever **more than one writer** can apply damage, for example two players attacking, or a sim-authority handoff. Heal is `increment(+x)`. Respawn is `new Counter(max)`; note that concurrent damage still lands on top of it.
- **Representation upgrades** (billboard → mesh → animated): write the **whole visual component map in one assignment** when `kind` changes, so the swap is atomic and never mixes fields. Write individual fields when `kind` is unchanged.
  - Alternatively, use a variant key per representation (`visual: {kind, billboard:{...}, mesh:{...}, anim:{...}}`). This lets every representation keep its settings, and the reconciler picks `kind`.

## Recommended doc schema skeleton

```js
// scene doc  (one per scene; URL = automerge:<id>)
{
  schema: 1,                                   // bump + migrate on read
  meta: { title: 'Dino Park' /*text*/, forkedFrom: ImmutableString('automerge:..#heads') | null },
  entities: {
    [id /* random 10–16 char id, never index-based */]: {
      name: 'T-rex',                           // text
      parent: ImmutableString(id) | null,
      prefab: ImmutableString(id) | null,      // optional inheritance from a template entity
      transform: { p: [x, y, z], r: [rxDeg, ryDeg, rzDeg], s: [1, 1, 1] },   // authored / rest pose
      components: {                            // open-ended: any name -> plain map
        visual:  { kind: ImmutableString('billboard'), src: ImmutableString('asset:<id>'), size: 2 },
        health:  { hp: new Counter(100), max: 100 },
        faction: { tags: { predator: true } }, // map-as-set: concurrent adds merge, no dupes
        brain:   { kind: ImmutableString('chase'), targets: { herbivore: true }, speed: 6, damage: 15 },
        rideable:{ seat: [0, 2, 0] },
      },
    },
  },
  systems: {                                   // runtime-addable behaviours
    [name]: { code: 'export default (world, dt) => {...}' /*text*/, enabled: true, order: 100 },
  },
  componentTypes: { [name]: { defaults: {...}, doc: 'text' } },   // optional, for editors/agents
  assets: { [assetId]: { name: 'trex.png', mime: ImmutableString('image/png'),
                         url: ImmutableString('automerge:<assetDocId>' | 'https://...') } },
}
// asset doc (immutable, one per uploaded file): { mime, bytes: Uint8Array }
//   -> keeps binary out of the scene doc's history; replacing an image never bloats the scene.
```

Notes on the schema:
- **Sets are maps of `true`** (`tags: {predator: true}`), not lists. Concurrent list pushes duplicate entries (verified), while map keys deduplicate.
- **There is no `order` list** unless draw order really matters. Entities are a map keyed by id, so concurrent creates never collide and deletes are clean.

## Recommended sync architecture

1. **One Repo per page.**
   - Storage: `IndexedDBStorageAdapter`. Save is automatic, the page works offline, and a reload works.
   - Network: `BroadcastChannelNetworkAdapter` for tabs, plus `WebSocketClientAdapter('wss://sync.automerge.org')`, overridable with `?sync=`.
   - Pin exactly, with `--save-exact`: `@automerge/automerge@3.5.0` and `automerge-repo*@2.5.6`. Put the lockfile in its own commit.
2. **The URL fragment** names the doc: `#automerge:<id>`. Add `#…&at=<heads>` for a read-only historical view, and offer `#snap=<b64>` optionally for tiny serverless shares.
   - "Share" copies the link.
   - "Fork" is `repo.clone`.
   - "Download" is `repo.export` to a `.automerge` file; "Open" is `repo.import`.
   - "Compact" means fork from current state, which gives a new URL.
3. **Three data planes:**
   - **(a) Scene doc**, for authored state and durable runtime state. Commits are batched and rare.
   - **(b) Ephemeral / `Presence`**, for live transforms (packed `Float32Array`, 15–20 Hz, from the sim authority), drag previews, cursors, XR poses and roles.
   - **(c) Asset docs**, for binaries.
4. **Simulation authority.** If every peer runs systems *and* writes results, damage is applied N times. Instead:
   - Elect one sim host among Presence peers, e.g. the lowest peerId with `sim: true`, with failover after the TTL.
   - Other peers render ephemeral state and run only cosmetic and local prediction.
   - Player-initiated damage from any peer goes through `Counter.increment`, so it is safe concurrently.
5. **Reconciler.**
   - Listen to `handle.on('change')`, build a dirty set of entities and components, read `patchInfo.after`, and apply per component.
   - Wrap it in try/catch.
   - Never call `handle.change` from inside it.
6. **Agent / CapTP.**
   - Expose high-level verbs, each one `handle.change(d => ..., {message: 'agent: spawn trex'})`: `spawn`, `setComponent(id, name, value)`, `patchComponent`, `removeComponent`, `remove`, `defineSystem`, `transaction(ops[])`. The `message` makes agent edits visible in history and undoable.
   - Never hand the agent the raw doc URL if attenuation matters. Anyone with the URL has full write over the public server, so CapTP facets are the *only* access control.
   - A Node agent *could* also just join as a repo peer (verified to work), but that bypasses any CapTP facet.

## Risks / open issues

- **No auth or privacy on wss://sync.automerge.org.** It is offered as-is for prototyping with no SLA and no published retention policy, and the URL is the write capability.
- **History never shrinks.** At about 1 MB/hour, a "commit transforms at 2 Hz" design reaches a few MB after a session. Compacting changes the URL.
- **Plain JS strings become collaborative Text.** Assignment produces `put ""` + `splice`, and concurrent edits interleave ("T-Rexy"). Use `ImmutableString` for every atomic value, and remember it reads back as an object.
- **npm `latest` is an alpha** (2.6.0-alpha.3), so pin exactly.
- **Wasm on the critical path**: 1.14 MB gz. Pages caches it for only 10 minutes.
- **xstate rethrows listener errors asynchronously**, and change listeners are re-entrancy-hostile.
- **No file:// support**, as for every Vite module app.
- **Concurrent wholesale replaces lose concurrent field edits.** This is the price of atomic visual swaps.

## Scripts

- `vite-app/` (`v1`, `v2`, `v2b`, `v3`, `v4`, `app-common.js`, `pwtest.cjs`, `pwnet.cjs`): bundling, Playwright, browser↔Node sync.
- `net-test.mjs`, `net-test2.mjs`: public server latency, ephemeral, payload types and sizes, coalescing.
- `share.mjs`, `share2.mjs`: URLs, heads, history, view, fork, export/import, unavailable doc, Presence.
- `patches.mjs`: patch shapes.
- `reconcile-undo.mjs`: dirty-set reconciler, re-entrancy, scoped undo.
- `growth.mjs`, `growth2.mjs`: doc growth and CPU.
- `merge.mjs`: merge semantics.
- `asset.mjs`: binary asset docs through the server.
- `alpha/`: the 2.6.0-alpha.3 check.
