# merge-meadow research — captp

_Structured summary returned by the research agent (Opus 5.5), 2026-10-28. Every finding is graded verified / likely / speculative by what the agent actually ran._

## Summary

CapTP works from a static page, and I tested it end to end with real code: a Node CLI, an MCP server and a same-origin page tool all drove a live three.js scene running under SES lockdown in Chromium. The traffic went through the public wss://sync.automerge.org server.

Runtime: @endo/captp 4.5.1 does not need lockdown. It does need two shims imported first: 'ses/assert-shim.js' (sets a global assert) and '@endo/eventual-send/shim.js' (sets HandledPromise). That costs about 34 KB gzip. Full SES lockdown costs 58 KB gzip in total and takes about 10 ms. It worked with WebGLRenderer, OrbitControls, VRButton, GLTF export and load, SkinnedMesh animation and automerge-repo over websocket.

Lockdown is needed for one reason. Systems stored in the doc run in every visitor's browser on kumavis.github.io. That origin is shared with claude-code-web, which can keep API keys in localStorage. A SES Compartment blocks that code from window, fetch and localStorage. It stops blocking as soon as you hand it any object that reaches the DOM: I stole a localStorage key through texture.image.ownerDocument.

Critical rule: captp's marshal freezes whatever it sends. Returning mesh.position froze the live vector and, under lockdown, Vector3.prototype too, which kills the render loop. The capability API may only return fresh plain data or Far handles.

Transport: captp over automerge-repo ephemeral messages works. Frames are AES-GCM sealed with a key taken from a secret in the link fragment, and carry sequence numbers. It is best routed on a rendezvous doc whose id is derived from the secret. Measured: round trip about 41 ms with a Node host, about 67 ms with a headless browser host. Pipelining does a three-step edit in 45 ms instead of 125 ms. A batch of 100 updates takes 63 ms, against 371 ms as 100 separate calls. Same-origin tabs over BroadcastChannel take about 1 ms.

Agent side: a stdio MCP server with 8 tools, including eval, answers in about 43 ms per call. A one-shot CLI takes 0.35–0.75 s per call.

Security limit: on the public server, anyone with the doc id can write to the doc. The captp secret only gates what the agent can do through the live page.

## Findings

- **[verified]** @endo/captp no longer requires lockdown() or a global harden, because @endo/harden 1.1 ships a fallback. It does require the global `assert` and `HandledPromise`. Without them it fails with 'ReferenceError: assert is not defined', then 'HandledPromise is not defined'. The fix is two side-effect imports first in the entry module: `import 'ses/assert-shim.js'` and `import '@endo/eventual-send/shim.js'`.
  - _Evidence:_ exp/01-minimal.mjs failed with exactly those errors. exp/01a-shim.mjs passed: bootstrap, a remote object returned from spawn, a pipelined E(E(w).spawn()).id(), and a non-Far function argument rejected with 'Remotables must be explicitly declared'. Array.prototype stayed unfrozen.
- **[verified]** lockdown() must sit in a separate module that is statically imported first, and the eventual-send shim must be imported before it. If lockdown() is called in the entry module's body, it throws 'Cannot lockdown (repairIntrinsics) if a prior harden implementation has been used' because ESM hoists the imports. Running it through a top-level-await dynamic import also broke the page.
  - _Evidence:_ host-fake-world.mjs crashed with that TypeError until I moved the call into lib/init-lockdown.mjs. The web3 page with a TLA dynamic import of the init never became ready; with a static first import it worked. lockdown took 9.4–12.2 ms in Node and 9.6 ms in Chromium.
- **[verified]** SES lockdown (moderate override taming) did not break the three.js or Automerge features tested, in Node or in a Vite production build in Chromium.
  - _Evidence:_ Node: three Scene, clone, toJSON/ObjectLoader; Automerge from/change/save/load; Repo.create/change; a captp loopback. Chromium (web/ and web3/): WebGLRenderer readPixels gave the same [0,152,0,255] as without lockdown; OrbitControls, VRButton and renderer.xr.enabled worked and navigator.xr was present; a GLTFExporter→GLTFLoader round trip plus SkeletonUtils.clone and AnimationMixer ran on a SkinnedMesh; automerge-repo slim with base64 wasm connected to wss://sync.automerge.org. The only extra console output was the warning 'Removing intrinsics.%IteratorPrototype%.join'. Not tested: a real XR session, physics, r3f.
- **[verified]** Bundle cost (Vite 5 production build, gzip -9): captp with shims adds about 34.5 KB; captp with ses and lockdown adds about 58.3 KB. The standalone agent client (captp guest plus transport) is 36.2 KB.
  - _Evidence:_ captp-only pages: 108.9 KB raw / 34.2 KB gzip with shims, 183.8 / 57.6 with lockdown. Baseline three+automerge was 1763.0 KB gzip; with shims 1797.5; with lockdown 1821.3. The agent client minified with esbuild: 112.6 KB raw / 36.2 KB gzip.
- **[verified]** Hazard: marshal freezes everything it sends, including values whose serialization fails. Returning live ECS state or a THREE object freezes it. Under lockdown it also freezes the class prototype, and the render loop breaks. Arguments are frozen on the caller's side too. Rule: the capability layer returns only fresh plain copies or Far handles.
  - _Evidence:_ exp/01b: returning internal.health made it frozen, and the next write threw 'Cannot assign to read only property hp'. Returning mesh.position failed with 'cannot serialize Remotables with non-methods like x' but left mesh.position frozen. exp/01c (lockdown): THREE.Vector3.prototype was frozen and mesh.position.set() threw. The caller's argument object was frozen after the send.
- **[verified]** A SES Compartment sandboxes source text stored in the doc, as long as it is given only plain data and hardened functions. It is NOT a sandbox if any endowed object reaches the DOM, which rules out THREE Textures (they hold an <img>), renderers (they hold a <canvas>) and the Automerge handle. Without lockdown there is no sandbox at all: new Function code has full page authority on the shared kumavis.github.io origin, which claude-code-web uses for API keys.
  - _Evidence:_ exp/03 and web3/escape.mjs in Chromium under lockdown. Inside the Compartment, window, document, process, fetch, localStorage and indexedDB were all undefined. Function('return this')() returned undefined. fn.constructor('return localStorage') threw 'not a valid constructor'. Writing Array.prototype.push and Object.prototype.hp both threw. Endowing {image:<img>} and evaluating tex.image.ownerDocument.defaultView.localStorage.getItem('anthropic-api-key') returned 'sk-secret'. Creating and evaluating a Compartment took 0.061 ms. Infinite loops are not prevented (by construction; not run).
- **[verified]** Ephemeral messages via the public server are a workable captp carrier: ordered in practice, fast, and able to carry large payloads. Because delivery is not guaranteed, the transport adds sequence numbers and aborts the session on a gap.
  - _Evidence:_ exp/04, Node↔Node through wss://sync.automerge.org: connect 408 ms, find +206 ms. Ping round trip min 42 / median 46 / max 315 ms, 0 of 20 lost. A burst of 500 messages arrived 500/500 and in order. Payloads of 16 KB, 64 KB, 256 KB, 1 MB and 4 MB all arrived.
- **[verified]** Working captp over a sealed ephemeral protocol (lib/transport.mjs, 133 lines, the same code in Node and the browser). Each frame is AES-GCM encrypted with a key HKDF(fragment secret, salt = docId). The guest sends a SYN that only key holders can read; the host picks the bootstrap object by which role key (editor or viewer) decrypts it; there is one makeCapTP per guest session.
  - _Evidence:_ exp/05-bench.mjs against host-fake-world.mjs (lockdown, systems run in Compartments). Connect: ws 151 / find 61 / SYN-ACK 50 ms. describe() round trip p50 41.2, p90 42.8, max 90.5 ms (n=40). spawn→set→get pipelined p50 45.4 ms vs 125.5 ms awaited sequentially. 100 updates: 371 ms as concurrent calls vs 63 ms as one batch(). get(id) twice returned the same presence (===). Passing a handle back as an argument, E(rider).link('Riding', horse), stored {seat:0, target:'horse-3vpkd'}. A push event after set() arrived in 44 ms. Errors arrived as rejections ('no entity nope', and the SyntaxError from bad system source). The viewer facet rejected spawn and set with 'target has no method "spawn"'. A wrong secret got no answer, and the guest timed out.
- **[verified]** A browser tab can host the agent API over the public server: a Node CLI changed a real WebGL scene in headless Chromium. The browser host's round trip is higher than the Node host's.
  - _Evidence:_ web3/run.mjs: page under lockdown with real three and automerge-repo over wss. The CLI's eval of E(world).pixel() returned [0,0,0,255]; after the CLI's spawn it returned [207,0,0,255]. In-process round trip p50 66.8 / p90 77.2 ms. One-shot CLI calls took 620–744 ms. No page errors.
- **[verified]** Ephemeral broadcasts on the scene doc reach every peer of that doc, so each viewer receives every agent frame. A rendezvous doc whose id is derived from the secret avoids this: the host creates it with repo.import(bytes, {docId: HKDF(secret,'rendezvous')}) and the agent find()s it knowing only the secret. A find() of an id nobody created rejects as 'unavailable'.
  - _Evidence:_ exp/07: an unrelated viewer received 50 of 50 frames; find() of an uncreated id rejected on both peers. exp/08: the agent found the imported rendezvous doc in 192 ms, round trip 41 ms.
- **[verified]** Same-origin page agent (claude-code-web): its custom-tool handlers run in the page as new AsyncFunction('input','ctx', body), and its index.html sets no CSP. A tool can therefore `await import('/vibe-dump/<slug>/agent.js')` (a stable, unhashed file in the scene package's public/ folder) and reach the scene tab over BroadcastChannel, using the same sealed protocol.
  - _Evidence:_ Read packages/claude-code-web/src/host/custom-tools.js (compileTools) and README §4. web2/ Playwright test emulating compileTools: first call 29 ms, spawning a red cube 23 ms, pixel [0,0,0,255]→[207,0,0,255], steady-state tool call p50 1.0 / p90 1.4 ms. The agent page gains the globals assert and HandledPromise; no lockdown there.
- **[verified]** Agent ergonomics: a stdio MCP server holding one persistent captp connection is the best primary path, at about 43 ms per call. A one-shot CLI needs no setup but takes 0.35–0.75 s per call. An eval tool (JS with world/E/Far in scope) gives the model pipelining and batching.
  - _Evidence:_ exp/06 with the MCP SDK stdio client: server start 463 ms, scene_connect 555 ms, describe p50 42.7 / p90 46.4 ms, spawn 75–87 ms, a bad system returned isError 'Unexpected end of input', an eval that batch-sets every Health entity took 102 ms, scene_events drain 1.1 ms. CLI breakdown: Node start plus imports about 150 ms (captp 36, automerge-repo 73), ws 140–310, find 60, SYN-ACK 50, call 85–115; totals 333–498 ms (Node host).
- **[verified]** The brief's behaviour scenario runs through the API with nothing but data components plus systems sent as source. The T-rex (Aggressive{targets:'Prey'}) chased, the sheep (Fearful{of:'Aggressive'}) fled while taking damage and was removed by a death system. A visual upgrade (Billboard→Model) is just set/remove of components and leaves behaviour untouched.
  - _Evidence:_ CLI against the Node host: chase, flee and death were sent with defineSystem. T-rex x 0→22.9, sheep 8→24.2, hp 30→15, then the sheep was destroyed. watch received 128 events in 6 s (about 21/s for 2 entities at 10 Hz, so subscriptions need filtering and coalescing). Malformed system source was rejected before it was written to the doc. Over MCP, set Billboard null then set Model took 51–61 ms each.
- **[likely]** An agent that writes the Automerge doc directly (no captp, no browser host) reaches other peers as fast as one going through captp. So world-caps can also be instantiated locally in the agent as a fallback when no tab is open; only page-only extras (pixel, screenshot, raycast) would be missing.
  - _Evidence:_ exp/05: captp spawn reached a third observer peer at p50 99.7 ms; a direct handle.change reached it at p50 100.8 ms. host-fake-world.mjs already runs world-caps over a DocHandle in Node. The automatic fallback itself was not built.
- **[likely]** On sync.automerge.org the doc id works as a write capability: anyone holding it can edit. A captp 'viewer' facet does not make the doc read-only; the secret only gates what the agent can do through the live page (page-only powers, pushed events, which tab answers). The fragment secret is never sent to the server, which sees only the rendezvous id and ciphertext.
  - _Evidence:_ Every experiment wrote to docs on the public server without any auth step. The transport only ever sends AES-GCM ciphertext plus random session ids. Remedies for true read-only sharing (a one-way mirror doc, keyhive) are not tested.
- **[likely]** Captp sessions have no liveness detection. A guest that exits without closing leaves a host session and a listener behind, and the host keeps sending to it until a send rejects. A heartbeat, an idle timeout and a fin frame are needed.
  - _Evidence:_ Seen in transport design and host logs: each CLI process attaches a session that is never torn down on the host. Not stress-tested.
- **[speculative]** WebRTC is possible later (signalling could ride the same ephemeral channel) but not worth building now: there is no TURN server of ours, and Node would need a native WebRTC module. The relay already gives 41–67 ms round trips.
  - _Evidence:_ Not built (out of scope by request). Reasoning based on the measured relay latencies.

## Recommendation

Decide: (1) One shared module, world-caps.js: Far World / Entity / WorldView objects over a DocHandle. Reads return plain copies; entity handles are memoized; it offers batch(), subscribe(listener, filter), and defineSystem compiled in a Compartment. The scene page exports it over captp, and the agent can run it locally against the doc when no tab is open. (2) Transport: captp over automerge-repo ephemeral messages on a rendezvous doc derived from the secret, AES-GCM sealed and sequence-checked, reusing the app's existing sync connection; the same protocol over BroadcastChannel for same-origin agents. No WebRTC. (3) Agent: ship a stdio MCP server inside the package (connect, describe, list, spawn, set, define_system, events, eval; about 43 ms per call), plus a one-shot CLI and a public/agent.js for claude-code-web page tools. (4) Security: run the page under SES lockdown, because systems stored in the doc are code from anyone holding the doc id, running on an origin shared with stored API keys. Give that code only plain data and hardened functions, never THREE, DOM or handle objects. Keep the agent secret in the fragment and in sessionStorage. The viewer secret is derived one way from the editor secret. Be explicit in the UI that the doc link means edit access. Costs: about 58 KB gzip and 10 ms for captp plus SES. The return-only-plain-data rule becomes mandatory. Libraries that patch built-in prototypes are ruled out (none found among three, Automerge or Vite output). The page holds global assert and HandledPromise. A plain JSON-RPC (about 2 KB) would lose pipelining (45 vs 125 ms), handles as arguments, push callbacks and per-object attenuation. Ephemeral transport depends on the public server keeping its ephemeral relay and on one host tab being open; the local-doc fallback covers the second.

## Risks

- Freeze hazard: any code path that returns or passes a live Automerge proxy, ECS row or THREE object through captp freezes it, and under lockdown its prototype too, breaking the scene far from the cause. This needs review discipline or a wrapper that clones every return.
- Doc-stored systems are code from anyone who holds the doc id. Endowing a single DOM-reachable object (a THREE Texture or renderer, a DOM node) escapes the Compartment and can read localStorage on kumavis.github.io, where claude-code-web can keep API keys. Compartments do not stop infinite loops.
- sync.automerge.org is a public, unauthenticated, best-effort service: the doc id is a write capability, ephemeral relay behaviour could change, and its latency outliers reached 315 ms.
- There is no session liveness or GC (captp gcImports off, no heartbeat), so hosts leak sessions and listeners over long runs.
- Event fan-out is unfiltered: at a 10 Hz sim, about 21 events/s for 2 entities; with hundreds of entities subscriptions need filters and coalescing per frame.
- automerge-repo's npm 'latest' tag is a prerelease (2.6.0-alpha.3); its ephemeral, import({docId}) and find semantics may shift.
- Only one tab answers the agent (first ACK wins); if that tab closes, the agent must reconnect, and handles from the old session go dead (IDs remain valid).
- Lockdown is verified only for the three/Automerge subset I tested; other libraries (physics, r3f, some three addons) are untested, and new ES built-ins such as Iterator.prototype.join get stripped with a warning.

## Versions tested

- `@endo/captp@4.5.1`
- `@endo/far@1.1.14`
- `@endo/eventual-send@1.5.0`
- `@endo/marshal@1.10.0`
- `@endo/pass-style@1.8.2`
- `@endo/harden@1.1.0`
- `ses@2.3.0`
- `@automerge/automerge@3.5.0`
- `@automerge/automerge-repo@2.6.0-alpha.3`
- `@automerge/automerge-repo-network-websocket@2.6.0-alpha.3`
- `three@0.186.1`
- `vite@5.4.21`
- `@modelcontextprotocol/sdk@1.32.2`
- `zod@4.6.7`
- `node@22.22.0`
- `playwright (preinstalled) headless chromium`

(The agent's long-form report was not written as a file; this structured output is the full record.)
