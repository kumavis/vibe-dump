# WebXR + desktop dimension — research report

Researcher dimension: **webxr**. Everything below marked **verified** was run in this sandbox
(Node 22.22.0, Vite 5.4.11, Playwright 1.63.0 / Chromium 153.0.8010.12 headless, SwiftShader WebGL2).

Artifacts (all under `/tmp/claude-0/-home-user-vibe-dump/f580ed5c-7e6e-5a9a-b50f-88ecc42cf4d9/scratchpad/research/webxr/`):

| path | what |
| --- | --- |
| `app/` | the spike: Vite 5 + three 0.186.1, `index.html`, `src/main.js`, `src/rig.js`, `src/pointers.js` |
| `tests/desktop.cjs` | headless desktop run: thumbnail-equivalent shot, XR button degradation, mouse pick/drag, WASD, pointer lock, mount |
| `tests/xr.cjs` | **emulated Quest 3 via IWER** injected with `addInitScript`: session start, controller select/grab, thumbsticks, snap turn, squeeze-to-mount, hand tracking, session end |
| `tests/xr-wrist.cjs` | HTMLMesh wrist panel in XR |
| `am/pose-cost.mjs`, `am/eph.mjs`, `am/eph-remote.mjs`, `am/wire.mjs` | Automerge cost of poses-in-doc vs ephemeral; ephemeral relay through `wss://sync.automerge.org` |
| `ws/` | npm-workspaces coexistence test three 0.160 + 0.186 |
| `thumbsim/` | the repo's real `scripts/thumbnails.mjs` run against the spike |
| `shots/*.jpg` | screenshots (desktop, stock-button, mounted, XR stereo, XR wrist panel) |

---

## 1. three.js version and XR API surface

* `npm view three` → **0.186.1** is `latest` (verified). The monorepo pins `^0.160.0` (lockfile 0.160.1) in 30 packages.
* **Adopt 0.186.1 for the new package.** Reason that is not taste: `Raycaster.setFromXRController()` (the
  one-liner to turn a controller's target-ray space into a pick ray, also used internally by
  `InteractiveGroup`) **does not exist in 0.160.1 or 0.161.0, and appears in 0.162.0** (verified by grepping
  the published `src/core/Raycaster.js` of 0.160.1/0.161/0.162/0.163/0.165/0.170). So staying on 0.160 means
  hand-rolling the ray and not being able to use `InteractiveGroup` for XR UI.
* **Cost**: same spike app bundles to **760.6 kB min / 197.5 kB gz on 0.186.1 vs 681.1 kB / 177.9 kB on 0.160.1**
  (+80 kB / +20 kB gz). (verified)
* **Workspaces coexistence (verified)**: scratch monorepo with `packages/old` (`three ^0.160.0`) and
  `packages/new` (`three 0.186.1`): `npm install` put one at the root and nested the other
  (`packages/old/node_modules/three` = 0.160.1, root = 0.186.1); `vite build` in each bundled its own
  (`REVISION "160"` vs `"186"` in output). Because a `0.x` caret is minor-locked, `^0.160.0` can never resolve to
  0.186, so existing apps' bundles are byte-identical. In the real repo (30 dependents on 0.160) npm will keep
  0.160 hoisted and nest 0.186 under `packages/<slug>/node_modules`. Lockfile change goes in its own commit
  (CLAUDE.md convention).
* XR API at 0.186.1 (read from source, exercised under IWER):
  * `renderer.xr.enabled = true`; `renderer.xr.setReferenceSpaceType('local-floor')` (default is already
    `local-floor`). With `local-floor` the headset pose arrives with real standing height (IWER: camera local y = 1.6).
  * **`renderer.setAnimationLoop(cb)` is mandatory**: during an immersive session `window.requestAnimationFrame`
    stops; three routes the loop through `XRSession.requestAnimationFrame`. Callback is `(time, xrFrame)`.
    Without a session it uses window rAF — the same loop serves desktop (verified: frames counted in both).
  * `renderer.xr.getController(i)` (target-ray space Group), `getControllerGrip(i)` (grip space Group),
    `getHand(i)` (joint Groups, populated only if `'hand-tracking'` was granted). Events on the controller
    Group: `connected` (with `event.data = XRInputSource` → `handedness`, `gamepad`, `profiles`),
    `disconnected`, `selectstart/select/selectend`, `squeezestart/squeeze/squeezeend`; hands add `pinchstart/pinchend`.
  * `renderer.xr` dispatches `sessionstart` / `sessionend`.
  * **Camera parenting rule (source, `WebXRManager.updateCamera`)**: the XR camera's world matrix is
    `camera.parent.matrixWorld × headsetPose`. So the *user camera must be a child of a rig Group*; moving the rig
    moves the player. Verified: with the rig parented to a moving mount, the XR camera world position tracked the
    mount (IWER run: beast moved 2.38 m, XR camera moved 2.63 m with it).
  * **After `sessionend` three leaves the last headset pose decomposed into `camera.position/quaternion`**; you
    must restore desktop eye height/pitch yourself (verified: we restore and the test sees `camLocal [0,1.6,0]`,
    canvas back to 1280×800).
  * Buttons: `VRButton.createButton(renderer, init)` requests `immersive-vr`, auto-adds optional
    `local-floor, bounded-floor, layers`; **not** `hand-tracking` — pass it in `optionalFeatures`.
    `XRButton` **tries `immersive-ar` first** and falls back to VR — on a Quest 3 that launches a passthrough AR
    session where `scene.background` paints over the passthrough. Use VR (or a custom button) for this game.
  * Session features requested by the spike: `optionalFeatures: ['local-floor','bounded-floor','hand-tracking','layers']`.
    IWER/Quest 3 granted `local-floor, bounded-floor, hand-tracking, viewer, local` (verified; `layers` not granted
    by the emulator — three falls back to `XRWebGLLayer`, framebuffer 1280×800 in the emulator).
  * **WebGPURenderer + XR**: `src/renderers/common/XRManager.js` exists, but the WebGPU path needs
    `XRGPUBinding`; three 0.186 even ships `examples/jsm/webxr/WebGLXRFallback.js` to swap to a WebGL backend on
    session start. **Stay on `WebGLRenderer`** for this app (likely; not run on hardware).
  * `XRControllerModelFactory` / `XRHandMeshModel` **fetch GLBs from jsDelivr at runtime**
    (`DEFAULT_PROFILES_PATH = https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles`).
    That's an external request on Pages. Vendoring (`@webxr-input-profiles/assets@1.0.20`, 98 MB total) needs
    `profilesList.json` + the profiles you want: `meta-quest-touch-plus` 444 KB, `oculus-touch-v3` 1.3 MB,
    `generic-hand` 196 KB, and the fallback `generic-trigger` 3.9 MB (verified sizes). **Recommendation:
    procedural proxies (a box per grip, 25 joint spheres or a capsule per hand) for v1** — 0 bytes, and the same
    procedural mesh is what remote players see anyway.

## 2. Unified player rig (verified in desktop + emulated XR)

```
scene (or a mount's seat Object3D)
└─ rig.root  Group        ← locomotion: position + yaw. THE thing that gets reparented when riding.
   ├─ head   PerspectiveCamera   desktop: (0, 1.6, 0) + pitch     XR: overwritten each frame by headset pose
   ├─ hands[i].ray   = renderer.xr.getController(i)      (target-ray space)
   ├─ hands[i].grip  = renderer.xr.getControllerGrip(i)  (grip space; wrist panel / held items attach here)
   └─ hands[i].hand  = renderer.xr.getHand(i)            (25 joints when hand-tracking)
```

Rules (each one was a bug or a check in the spike):

1. **Never move the camera; move `rig.root`.** Desktop yaw goes on the root (so WASD and the body follow);
   desktop pitch goes on the camera (cleared on `sessionstart`).
2. **Locomotion direction = head yaw** projected on the floor (`rig.move(f, s, dt)`), same function for WASD and
   the left thumbstick (verified: WASD 0.5 s → 1.05 m; left stick 0.7 s → 2.18 m).
3. **Snap turn pivots around the head**, not the rig origin, or room-scale players are swung sideways:
   rotate root, then translate root by `(headWorldBefore − headWorldAfter)` expressed in the parent frame.
   Verified with the head 0.45 m off-centre in the room: yaw −30°, **head drift 0.0000 m**.
   (The first version had a bug that threw every frame — IWER caught it; see "testing" below.)
4. **Teleport places the head**, not the root, over the target (subtract the root-rotated local head offset).
5. **Riding = `seat.add(rig.root)`; root local = identity.** `dismount` = `scene.attach(rig.root)` (keeps world
   transform), then keep yaw only and drop to floor. Verified desktop (camera world == beast world + seat 1.25 m +
   eye 1.6 m) and XR (XR camera follows the mount; controller grips follow too because they are rig children).
6. Gamepad mapping (`xr-standard`, verified under IWER for Quest Touch Plus): 4 axes, 7 buttons; thumbstick is
   `axes[2], axes[3]`; left stick = smooth move, right stick X = 30° snap turn with hysteresis (0.7 / 0.3).

### How the rig becomes an entity

Recommendation (design; parts verified):

* The **local** rig is not driven by the doc; it's a client-side object. Each frame it publishes a **pose sample in
  rig-local space plus the rig's parent reference**:
  `{ t, parent: <entityId of mount>|null, root:[px,py,pz,qx,qy,qz,qw], head:[7], hands:[[7]|null,[7]|null], mode:'xr'|'desktop' }`.
  Expressing head/hands **relative to the rig, and the rig relative to its parent entity** is what makes riding
  jitter-free for observers: the remote reconstructs `mount.world × seat × root × head`, so the mount's pose and
  the rider's pose never have to arrive in the same packet. The spike's "ghost" replays its own samples with a
  150 ms interpolation buffer and reparents itself to the seat when `parent` is set (verified: ghost parent =
  `seat` while mounted).
* **Remote players should be ECS entities in each client's local world, spawned from presence (ephemeral)**, not
  durable doc entities: otherwise every visitor leaves a permanent player entity in the shared scene. The local
  world gives them the same components as anything else (`Transform`, `Avatar`/render, `Faction`/`Prey` tags,
  `Health`), so a T-rex system that chases "things tagged prey" chases players with zero special casing. Despawn
  after ~3 s without a pose.
* Durable facts that must survive refresh go in the doc on the *mount*, not the player:
  `Rideable { seat:[x,y,z], rider: <peerId>|null }` (a low-frequency claim; Automerge LWW on concurrent claims is
  acceptable). While someone rides, **their client is the authority for the mount's transform** (it steers), writing
  it to the doc at ≤10 Hz / on change and broadcasting it at pose rate (flag for the simulation-authority
  researcher).
* Desktop players also publish a pose (synthesised right hand in front of the chest) so desktop and XR avatars look
  alike.

## 3. Interaction in both modes (verified)

**One `Pointer` abstraction** feeds one interaction system:

```js
// pointers.js — every input becomes { id, kind, ray: THREE.Ray (world), matrix: Matrix4 (pointer pose, -Z = ray) }
// desktop: 'mouse' (ray through cursor) or 'reticle' (screen centre while pointer-locked)
// XR:      'xr-0' / 'xr-1' via raycaster.setFromXRController(h.ray)   (three >= 0.162)
// events:  pointerdown/up for LMB, selectstart/selectend + squeezestart for controllers
```

Grab math is identical for all pointers: on down, `offset = inverse(pointer.matrix) × entity.matrixWorld`; each frame
`entityWorld = pointer.matrix × offset`. For the mouse, the pointer matrix is built with `lookAt` along the ray from
the camera, so the drag sweeps a sphere around the eye (works; a ground-plane drag is nicer UX for desktop and is a
cheap special case).

* Desktop: LMB on sheep → `selected = sheep`, drag moved it, **32–34 doc writes over ~3.4 s** at a 10 Hz commit
  throttle (headless ran ~10 fps so every frame committed). XR: trigger with right controller aimed at the sheep →
  selected, controller moved +0.3 m → sheep moved exactly +0.3 m on x, **11–12 doc writes**. Ray line length
  snaps to hit distance (6.15 m on the sheep, 5 m when missing).
* **Preview locally every frame, commit to the CRDT at ≤10 Hz and on release.** A drag at 90 Hz written straight
  into Automerge would be ~90 changes/s of permanent history.
* Trigger on the floor with an XR pointer = teleport. Squeeze = mount/dismount (desktop: `E`).
* Desktop camera: **two modes** — *editor* (RMB-drag look + WASD, free cursor, mouse-ray picking, DOM
  inspector) and *play* (pointer lock, reticle picking). Pointer lock **works in headless Chromium**
  (`document.pointerLockElement` set after keypress/click; verified) so it's testable.
* **Incremental visual upgrade is independent of the rig/interaction**: the reconciler keys the visual child on
  `JSON.stringify(render)`; swapping `{kind:'billboard'}` → `{kind:'box'}` replaced only the visual child under the
  same entity root; transform untouched and the entity stayed pickable (picking walks up to `userData.entityId`)
  (verified). Billboards are `THREE.Sprite`, which auto-faces the camera — including each eye's XR camera.

### 2D editor vs in-XR editing

* **Desktop: DOM editor** (inspector, palettes, code). It's free, accessible, and what the agent-over-CapTP
  mirrors anyway.
* **XR: defer a real XR editor.** For v1, the useful XR verbs are *grab-move, rotate (twist while held), delete,
  spawn-from-palette, mount*. A wrist panel is cheap: `HTMLMesh` (three/addons/interactive) rasterises the **same DOM
  element** onto a plane; `InteractiveGroup.listenToXRControllerEvents(controller)` turns controller rays into
  synthetic DOM click/move events on it. **Verified it renders in the emulated session** (`shots/xr-wrist.jpg`) with
  the inspector text. Gotcha **verified**: if the element's size changes (inspector grows when something is
  selected), the canvas texture is re-uploaded at a new size → a flood of `GL_INVALID_VALUE: glTexSubImage2D: Offset
  overflows texture dimensions`; giving the panel a **fixed width/height** removed all of them. HTMLMesh draws a CSS
  subset (no text inputs you can type into; no system keyboard without extra work), so text editing stays
  desktop/agent-only. Bundle cost of HTMLMesh+InteractiveGroup: +9.6 kB min (+2.9 kB gz).

## 4. Headless screenshots / thumbnail (verified)

* Headless Chromium on `http://127.0.0.1` (secure context): **`navigator.xr` exists**, `isSessionSupported('immersive-vr')`
  → **false**, `'immersive-ar'` → false. WebGL2 on SwiftShader. Canvas 2560×1600 at DPR 2. `xrCompatible` stays false
  until a session starts (three calls `makeXRCompatible()` in `setSession`), so enabling XR has no cost on desktop.
* **Stock `VRButton` degrades to a visible pill "VR NOT SUPPORTED"** (verified; it's in `shots/desktop-stockbutton.jpg`
  — it would end up in every gallery card). With no `navigator.xr` (http non-localhost) it renders an
  "WEBXR NEEDS HTTPS"/"WEBXR NOT AVAILABLE" link. **Use a custom button that stays `hidden` unless
  `isSessionSupported('immersive-vr')` resolves true** (verified hidden; thumbnail clean).
* **The repo's real `scripts/thumbnails.mjs` shot the spike in 2.8 s wall** (`thumbsim/packages/xr-spike/thumbnail.jpg`,
  30 KB). My equivalent harness: 2.05 s from `goto` to shot; ~8–11 fps at 2560×1600 under SwiftShader.
  No `waitFor` needed for a scene this size.
* Gotcha: anything driven by wall-clock time (the wandering mount) changes between shots; harmless since thumbnails
  are committed once.

## 5. Automated XR testing without a headset — IWER (verified, high value)

`iwer@2.7.0` (Meta's Immersive Web Emulation Runtime, MIT) emulates the WebXR Device API in a normal page.
Injected **only from the test harness**, so it costs 0 bytes in `dist/`:

```js
await ctx.addInitScript({ content: fs.readFileSync('node_modules/iwer/build/iwer.min.js', 'utf8') }) // UMD → window.IWER
await ctx.addInitScript(() => {
  const d = new IWER.XRDevice(IWER.metaQuest3)
  d.installRuntime({ forceInstall: true })   // forceInstall: headless Chromium already has a native navigator.xr
  window.__xrdevice = d
})
// drive it:
__xrdevice.controllers.right.position.set(x, y, z); __xrdevice.controllers.right.quaternion.set(qx, qy, qz, qw)
__xrdevice.controllers.right.updateButtonValue('trigger', 1)      // -> selectstart
__xrdevice.controllers.left.updateAxes('thumbstick', 0, -1)       // -> gamepad.axes[2..3]
__xrdevice.controllers.left.updateButtonValue('squeeze', 1)       // -> squeezestart
__xrdevice.position.set(...); __xrdevice.quaternion.set(...)      // headset pose
__xrdevice.primaryInputMode = 'hand'                               // switch to tracked hands (25 joints)
```

Everything in section 2/3 marked "XR verified" ran through this: session start via our button click, two
`tracked-pointer` input sources with profiles `meta-quest-touch-plus, oculus-touch-v3, oculus-touch,
generic-trigger-squeeze-thumbstick`, stereo render (`shots/xr-emulated.jpg`), select/grab, smooth move, snap turn,
squeeze→mount, hands (25 joints each, three's `getHand(i).joints` populated), `session.end()` → desktop restored.
IWER also exposes a `RemoteControlInterface` (getTransform/setTransform/select/runSequence…) designed for scripted
or agent-driven control (speculative relevance: an agent could *play-test* the XR path).

In-app emulator option (measured, not recommended): `?xr=emulate` dynamic `import('iwer')` = **+255 kB min /
73 kB gz lazy chunk** (0 on normal load); adding `@iwer/devui` (React + its own three 0.184) = **+904 kB / 247 kB gz**
more — too heavy to commit into `dist/`. For humans, the "Immersive Web Emulator" browser extension does the same
job. Keep IWER as a **devDependency used only by a test script**.

## 6. Multiplayer avatars — the case for the ephemeral channel (verified numbers)

A remote avatar needs head + 2 hands (7 floats each) + rig root + parent ref at 15–30 Hz (20 Hz used).

| channel | bytes | permanent? | CPU |
| --- | --- | --- | --- |
| Automerge doc, replace three 7-number lists per sample | sync payload **397 B/write**; doc grows **+50.9 KiB per player-minute** (43.5 B/write retained) | **forever**, every future joiner downloads it | 0.76 ms/change (Node) |
| Automerge doc, per-scalar assignment | 213 B/write; **+11.1 KiB/player-minute** | forever | **1.73 ms/change** |
| automerge-repo `handle.broadcast()` ephemeral, JSON-ish pose | pose 134 B JSON / 214 B CBOR; full ephemeral envelope **≈412 B CBOR** (≈256 B with an Int16-packed 56 B pose) | **no** — doc heads unchanged (verified) | negligible |

* `am/pose-cost.mjs` @automerge/automerge 3.5.0: 1200 writes = 60 s @ 20 Hz.
  10 players × 1 h ≈ 6.5–30 MiB of permanent history for data nobody needs after 100 ms, and 1–2 ms of main-thread
  CPU per change at 20 Hz × N players on a Quest browser (slower than Node) eats into an 11 ms frame budget.
* **Ephemeral through the public server works** (verified, `am/eph-remote.mjs`): two Node repos (automerge-repo
  2.6.0-alpha.3 + websocket adapter, proxied) on `wss://sync.automerge.org`: second peer found the doc in 34 ms;
  **100/100 broadcasts received at 20 Hz, latency p50 19 ms / p95 20 ms** from this datacenter. In-process
  MessageChannel: 200/200, doc heads unchanged.
* Bandwidth: ~5–8 KB/s per sender per receiving peer at 20 Hz; server fan-out O(N²) — fine for ≤10 players.
* Interpolate remotes with a 100–150 ms buffer (spike: 150 ms, lerp/slerp between bracketing samples).
* Optional: write a coarse "last seen" root position into the doc at most every few seconds *only if* the product
  wants offline avatars; otherwise none.

## Recommendation (for the PM)

1. **three@0.186.1 + WebGLRenderer, `renderer.xr.enabled = true` always, one `setAnimationLoop`.** Cost +20 kB gz vs
   0.160 and a nested three in the workspace; forecloses nothing (other apps untouched).
2. **PlayerRig as above** (root/head/hands, move the root, snap-turn around head, teleport head, ride by reparenting
   root under a seat Object3D). Players are **local-world entities spawned from ephemeral presence**, not doc
   entities; mounts carry `Rideable{seat, rider}` in the doc; poses travel **only** on `handle.broadcast()` at 20 Hz in
   rig-local space + parent id. Forecloses: server-authoritative player state and persistent player inventories
   without a further design step.
3. **Pointer abstraction** (mouse / reticle / xr-0 / xr-1) → one interaction system; preview per frame, commit to the
   doc ≤10 Hz + on release.
4. **Custom Enter-VR button hidden unless `immersive-vr` is supported**; never XRButton (AR-first) and never the stock
   VRButton (visible "VR NOT SUPPORTED" in thumbnails).
5. **Desktop DOM editor; XR gets grab/move/mount + a fixed-size HTMLMesh wrist panel**; full XR editor deferred.
6. **Procedural controller/hand proxies** (no jsDelivr fetch; vendoring Quest profiles would add ≥0.65 MB to committed
   `dist/`).
7. **Add an IWER-based Playwright smoke test as a local script** (not CI — CI builds nothing). It caught a real
   snap-turn crash in this spike.

## Risks / unverified

* No real headset was used. Quest Browser specifics (layers, foveation, refresh rate, `offerSession`, hand-tracking
  pinch → `select` mapping, comfort of 30° snap) are **likely/speculative**. IWER is an emulator.
* HTMLMesh renders a CSS subset and re-rasterises on DOM mutation (MutationObserver/timers) — fine for a small
  inspector, costly for a big one.
* Ephemeral relay was measured from a datacenter, not a home Wi-Fi + Quest; p50 19 ms will be worse.
* `sync.automerge.org` is a public best-effort service; ephemeral fan-out to many players is unmeasured beyond 2 peers.
* Desktop sphere-drag is functional but less pleasant than ground-plane drag.
* automerge-repo `latest` dist-tag is currently a prerelease (2.6.0-alpha.3); the repo's `tails-and-scales` pins 2.5.6.
