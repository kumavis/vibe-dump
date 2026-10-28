# merge-meadow research — webxr

_Structured summary returned by the research agent (Opus 5.5), 2026-10-28. Every finding is graded verified / likely / speculative by what the agent actually ran._

## Summary

One three.js codebase can serve both desktop and WebXR, and I ran it end to end, not only on paper. I built a Vite 5 spike on three@0.186.1 with a single PlayerRig, a single Pointer abstraction, a custom Enter-VR button, riding a mount, a remote "ghost" avatar fed by 20 Hz pose samples and an HTMLMesh wrist panel. Headless Playwright tested the desktop path. The XR path was tested with Meta's IWER emulator (iwer@2.7.0), injected through addInitScript so it adds 0 bytes to dist. The emulated Quest 3 started a stereo session and drove controller select/grab, thumbstick smooth move, snap turn, squeeze-to-mount, hand tracking (25 joints) and session end. These tests caught a real snap-turn crash.

Choices backed by measurements:
- three@0.186.1 is required in practice. `Raycaster.setFromXRController`, which InteractiveGroup needs, first appears in 0.162 and is missing in the repo's 0.160.1. Cost: +20 kB gz. It sits alongside 0.160 in npm workspaces with no effect on other apps.
- The stock VRButton puts a visible "VR NOT SUPPORTED" pill into thumbnails. A custom button that stays hidden unless immersive-vr is supported gives a clean card. The repo's own thumbnails.mjs shot it in 2.8 s.
- XRButton tries AR first, so it would start passthrough AR on a Quest 3.
- The XR camera's world matrix is parent.matrixWorld × headset pose, so riding is just `seat.add(rig.root)`. Confirmed on desktop and in emulated XR.
- Avatar poses must go over automerge-repo's ephemeral `broadcast()`, not into the doc. Writing them into the doc costs 11–51 KiB of permanent history per player-minute plus 0.8–1.7 ms of CPU per change. Through wss://sync.automerge.org, ephemeral delivered 100/100 messages at 20 Hz, p50 19 ms, with doc heads unchanged.
- XRControllerModelFactory fetches models from jsDelivr at runtime; use procedural controller/hand meshes instead.
- HTMLMesh renders the same DOM inspector in XR. It needs a fixed-size element, or it floods the console with GL_INVALID_VALUE.

## Findings

- **[verified]** three latest is 0.186.1; Raycaster.setFromXRController (also used by InteractiveGroup for XR UI) is absent in 0.160.1/0.161.0 and present from 0.162.0, so the repo's 0.160 is not a good base for XR picking
  - _Evidence:_ npm view three -> 0.186.1; grep of 0.160.1 node_modules Raycaster.js = 0 hits; unpkg src/core/Raycaster.js for 0.161.0=0, 0.162.0/0.163/0.165/0.170=1
- **[verified]** Bundle cost of 0.186.1 vs 0.160.1 for the same spike app: 760.6 kB/197.5 kB gz vs 681.1 kB/177.9 kB gz (+80 kB min, +20 kB gz)
  - _Evidence:_ vite build of identical src in app/ (0.186.1) and app160/ (0.160.1)
- **[verified]** Mixed three versions coexist in npm workspaces; ^0.160.0 can never resolve to 0.186 (0.x caret is minor-locked) so other apps' bundles are unchanged
  - _Evidence:_ scratch ws/: packages/old ^0.160.0 -> nested 0.160.1, packages/new 0.186.1 -> root; built bundles contain REVISION "160" and "186" respectively
- **[verified]** renderer.setAnimationLoop drives both modes; in XR the XR camera world = camera.parent.matrixWorld x headset pose, so moving/reparenting a rig Group moves the player and riding = seat.add(rig.root)
  - _Evidence:_ WebXRManager.updateCamera source; IWER run: rig parented to moving mount, XR camera world moved 2.63 m while beast moved 2.38 m (seat offset + head); desktop: camera world == beast world + 2.85 m height
- **[verified]** three leaves the last headset pose in camera.position/quaternion after sessionend; app must restore desktop eye height/pitch and resize
  - _Evidence:_ IWER session.end(): with restore code camLocal [0,1.6,0], canvas 1280x800, body class cleared
- **[verified]** Snap turn must pivot about the head (rotate root, then translate root by headBefore-headAfter in parent frame)
  - _Evidence:_ IWER: headset 0.45 m off-centre, right stick x=1 -> yaw -0.524 rad, head drift 0.0000 m; the first version threw ReferenceError each frame, caught by the IWER test
- **[verified]** A single Pointer abstraction (mouse ray / pointer-lock reticle / xr-0 / xr-1 via setFromXRController) with grab offset = inv(pointerMatrix) x objectWorld works identically on desktop and XR
  - _Evidence:_ desktop: LMB on sheep -> selected, dragged; XR: right controller aimed + trigger -> selected; controller +0.3 m x -> sheep x -2 -> -1.7 exactly; ray line scaled to 6.15 m hit distance
- **[verified]** Throttled commits (local preview each frame, doc write at <=10 Hz + on release) keep CRDT churn bounded: 32-34 writes for a ~3.4 s desktop drag, 11-12 for an XR grab
  - _Evidence:_ __app.docWrites counters in tests/desktop.cjs and tests/xr.cjs
- **[verified]** Headless Chromium (localhost) exposes navigator.xr but isSessionSupported('immersive-vr'/'immersive-ar') = false; WebGL2 on SwiftShader renders the XR-enabled scene fine at DPR 2 (2560x1600)
  - _Evidence:_ tests/desktop.cjs: hasXR true, vrSupported false, renderer 'ANGLE ... SwiftShader', ~8-11 fps, 2.05 s goto->shot; repo's real scripts/thumbnails.mjs shot it in 2.8 s wall, 30 KB jpg
- **[verified]** Stock VRButton degrades to a visible 'VR NOT SUPPORTED' pill (would appear in every gallery thumbnail); a custom button hidden unless immersive-vr is supported leaves the card clean
  - _Evidence:_ shots/desktop-stockbutton.jpg vs shots/desktop.jpg; stockBtn text 'VR NOT SUPPORTED', customBtnHidden true
- **[verified]** XRButton tries immersive-ar first (Quest 3 would launch passthrough AR); VRButton adds local-floor/bounded-floor/layers but not hand-tracking
  - _Evidence:_ examples/jsm/webxr/XRButton.js and VRButton.js source at 0.186.1; IWER metaQuest3 reports both vr and ar supported
- **[verified]** IWER (iwer@2.7.0) injected via Playwright addInitScript with installRuntime({forceInstall:true}) gives full scripted XR testing: session start through app button, Quest Touch Plus input sources (4 axes, 7 buttons), stereo render, select/squeeze/thumbstick, hand tracking (25 joints in renderer.xr.getHand(i).joints), session end
  - _Evidence:_ tests/xr.cjs output; shots/xr-emulated.jpg (stereo), granted features local-floor,bounded-floor,hand-tracking,viewer,local
- **[verified]** In-app emulator is too heavy to ship: lazy import('iwer') = +255 kB min/73 kB gz chunk; @iwer/devui = +904 kB/247 kB gz (React + its own three 0.184)
  - _Evidence:_ vite build with ?xr=emulate dynamic imports, chunk listing
- **[verified]** XRControllerModelFactory/XRHandMeshModel fetch GLBs from cdn.jsdelivr.net at runtime; vendoring needs profilesList.json + profiles (meta-quest-touch-plus 444 KB, generic-hand 196 KB, fallback generic-trigger 3.9 MB)
  - _Evidence:_ DEFAULT_PROFILES_PATH in source; du of @webxr-input-profiles/assets@1.0.20 dist/profiles
- **[verified]** HTMLMesh + InteractiveGroup render the same DOM inspector as a wrist panel in XR (+9.6 kB min/+2.9 kB gz); the element must be fixed-size or texture re-uploads spam GL_INVALID_VALUE glTexSubImage2D offset overflow
  - _Evidence:_ shots/xr-wrist.jpg shows 'Inspector / nothing selected' on the controller; warnings present with auto-height panel, 0 after width/height fixed
- **[verified]** Pointer lock works in headless Chromium, so the desktop 'play' mode is testable
  - _Evidence:_ document.pointerLockElement non-null after KeyP / click in tests/desktop.cjs
- **[verified]** Storing avatar poses in the Automerge doc is prohibitively expensive; ephemeral broadcast is the right channel
  - _Evidence:_ @automerge/automerge 3.5.0, 1200 writes (60 s @20 Hz): list-replace +50.9 KiB retained, 397 B/write sync, 0.76 ms/change; per-scalar +11.1 KiB, 213 B/write, 1.73 ms/change; ephemeral: doc heads unchanged, envelope ~412 B CBOR (pose 134 B JSON, 56 B Int16-packed)
- **[verified]** wss://sync.automerge.org relays automerge-repo ephemeral messages between peers with low latency
  - _Evidence:_ am/eph-remote.mjs, automerge-repo 2.6.0-alpha.3 websocket adapter via proxy: doc found in 34 ms, 100/100 broadcasts at 20 Hz received, p50 19 ms p95 20 ms (datacenter)
- **[likely]** Expressing avatar poses in rig-local space plus the rig's parent entity id makes riding jitter-free for observers (remote reconstructs mount.world x seat x root x head)
  - _Evidence:_ spike ghost reparents to the seat when parent set (verified ghost.parent == 'seat' while mounted); jitter-freeness under real network not measured
- **[verified]** Incremental visual upgrade (billboard Sprite -> mesh) is independent of rig/interaction when the reconciler swaps only a visual child under a stable entity root keyed on the render component
  - _Evidence:_ Digit2 swap: visual type Sprite->Mesh, transform JSON unchanged, still pickable via userData.entityId
- **[likely]** Stay on WebGLRenderer for XR; WebGPU XR needs XRGPUBinding and three 0.186 ships WebGLXRFallback.js to swap backends at session start
  - _Evidence:_ src/renderers/common/XRManager.js and examples/jsm/webxr/WebGLXRFallback.js source

## Recommendation

Decide the following.

1. **three@0.186.1 with WebGLRenderer.** Set `renderer.xr.enabled=true` always and use one `setAnimationLoop` for both modes. This costs +20 kB gz and puts a nested three under the new package in the workspace. Nothing is foreclosed; the other apps don't change.

2. **PlayerRig.** `root` Group (locomotion and yaw) > camera `head` (desktop: eye height + pitch) + `getController` / `getControllerGrip` / `getHand` children. Always move the root; snap turn pivots around the head; teleport places the head. Riding = `seat.add(rig.root)`.

3. **Players are local-world ECS entities spawned from ephemeral presence**, not durable doc entities. Poses travel only over `handle.broadcast()` at about 20 Hz, in rig-local space plus the parent entity id. Remotes interpolate behind a 100–150 ms buffer and despawn after about 3 s of silence. Mounts carry `Rideable{seat, rider}` in the doc. The rider's client owns the mount's transform while riding; please confirm that with the simulation-authority researcher. This rules out server-authoritative or persistent player state until a later design adds it.

4. **One Pointer abstraction** (mouse / reticle / xr-0 / xr-1) feeding one interaction system. Preview locally every frame; commit to the doc at ≤10 Hz and on release.

5. **Custom Enter-VR button**, hidden unless immersive-vr is supported. Don't use XRButton (it tries AR first) or the stock VRButton (its "not supported" pill lands in thumbnails).

6. **Desktop gets the DOM editor**, with an editor camera (right-drag look + WASD) and a play camera (pointer lock). **XR v1 gets grab / move / rotate / delete / spawn / mount** plus a fixed-size HTMLMesh wrist panel. A full XR editor is deferred, and text editing stays desktop- and agent-only.

7. **Procedural controller and hand meshes**, with no jsDelivr fetch. Vendoring the Quest profiles would add at least 0.65 MB to the committed dist.

8. **Ship an IWER-driven Playwright smoke test as a local by-hand script** (not CI), with iwer as a devDependency only. It is the only way to exercise the XR path without a headset, and it already caught one real bug.

## Risks

- No physical headset was used: Quest Browser specifics (layers, foveation, framerate, offerSession, hand pinch->select mapping, comfort) are unverified; IWER is an emulator
- HTMLMesh supports only a CSS subset, re-rasterises on DOM mutation and has no text input in XR; a large inspector would be slow
- Ephemeral latency (p50 19 ms) was measured from a datacenter with 2 peers; home Wi-Fi + Quest and many-peer O(N^2) fan-out through the public best-effort sync.automerge.org are unmeasured
- Mount authority while riding (rider's client writes mount transform) overlaps with the simulation/authority dimension and can conflict with an NPC-behaviour system also moving the mount
- automerge-repo's npm 'latest' tag is currently a prerelease (2.6.0-alpha.3); the repo's tails-and-scales pins 2.5.6, so pin deliberately
- Desktop mouse grab drags on a sphere around the eye; usable but a ground-plane drag is better UX and is a separate code path
- Anything time-driven (wandering NPCs) changes the thumbnail between shots; harmless since thumbnails are committed once, but they're not reproducible

## Versions tested

- `three@0.186.1`
- `three@0.160.1`
- `vite@5.4.11`
- `iwer@2.7.0`
- `@iwer/devui@2.7.0`
- `@automerge/automerge@3.5.0`
- `@automerge/automerge-repo@2.6.0-alpha.3`
- `@automerge/automerge-repo-network-websocket@2.6.0-alpha.3`
- `@automerge/automerge-repo-network-messagechannel@2.6.0-alpha.3`
- `@webxr-input-profiles/assets@1.0.20`
- `playwright@1.63.0`
- `chromium@153.0.8010.12 (headless, SwiftShader)`
- `node@22.22.0`

Long-form report with code and numbers: [`webxr-report.md`](./webxr-report.md)
