// Composition root (ARCHITECTURE §3.5), in exactly this order:
//   1 link (or create a seeded world)  2 repo + doc  3 world, sim, system host, safe mode
//   4 scene, reconciler, rig/pointers/controllers/interaction, VR button
//   5 presence/ownership/stream/checkpointer  6 agent host (only with `key`)
//   7 editor  8 watch(handle) -> world, systems, editor  9 the animation loop.
// Loaded by src/boot/entry.js with a dynamic import, AFTER lockdown(); it boots
// inside an async function because the shared Vite config has no es2022
// target (no top-level await).
import { parseLink, buildLink, newKey, peerIdFor } from './src/net/link.js'
import { openRepo, findDoc, serverStorageId, whenSynced } from './src/net/repo.js'
import { makePresence } from './src/net/presence.js'
import { makeOwnership } from './src/net/ownership.js'
import { makePoseStream } from './src/net/stream.js'
import { makeCheckpointer } from './src/net/checkpoint.js'
import { seedOps } from './src/doc/seed.js'
import { applyOps as applyDocOps, applyValidOps, withMoves } from './src/doc/ops.js'
import * as read from './src/doc/read.js'
import { watch } from './src/doc/watch.js'
import { World } from './src/core/world.js'
import { makeTicker } from './src/core/tick.js'
import { installSim, explain, BUILTIN_SYSTEMS } from './src/sim/index.js'
import { makeSystemHost } from './src/scripts/host.js'
import { makeSafeMode, systemsHash, syncArmed } from './src/scripts/safe-mode.js'
import { makeScene } from './src/render/scene.js'
import { makeResources } from './src/render/resources.js'
import { KINDS } from './src/render/kinds/index.js'
import { makeReconciler } from './src/render/reconciler.js'
import { PlayerRig } from './src/xr/rig.js'
import { makePointers } from './src/xr/pointer.js'
import { makeControllers } from './src/xr/controllers.js'
import { makeVRButton } from './src/xr/vr-button.js'
import { makeInteraction } from './src/xr/interact.js'
import { makeDesktopControls } from './src/xr/desktop.js'
import { makeWorldCaps, makeEvalPower } from './src/agent/world-caps.js'
import { startAgentHost } from './src/agent/host.js'
import { makeEditor } from './src/editor/app.js'
import { makeUndo } from './src/editor/undo.js'
import { makeShare } from './src/editor/share.js'
import { peerColor } from './src/editor/dom.js'
import { view } from '@automerge/automerge/slim'
import { bootStatus, hideBoot, banner } from './src/boot/overlay.js'
import { makeLog, makeCallLog } from './src/boot/log.js'
import { makePlayers } from './src/boot/players.js'
import { makeHostPowers, makeCompartmentFactory } from './src/boot/host-powers.js'

// Boot-order probe (design §16.15): lockdown must already have frozen the
// intrinsics when this module body runs; the e2e test reads __order.
const TOP = { what: 'main-body', arrayProtoFrozen: Object.isFrozen(Array.prototype), t: Math.round(performance.now()) }
if (!Array.isArray(globalThis.__order)) globalThis.__order = []
globalThis.__order.push(TOP)

// the three looks on the left wrist in XR (design §9)
const XR_PALETTE = [{ preset: 'sheep', image: 'emoji:🐑' }, { preset: 'trex', image: 'emoji:🦖' }, { preset: 'tree', image: 'emoji:🌳' }]
const opsLabel = (ops) => { const names = (ops ?? []).map((o) => o?.op ?? '?'); return names.length > 3 ? `${names.slice(0, 3).join(', ')} +${names.length - 3}` : names.join(', ') }
const myName = () => { try { return globalThis.localStorage?.getItem('mm:name') || '' } catch { return '' } }

export const booted = boot()

async function boot () {
  const log = makeLog()
  const calls = makeCallLog()
  addEventListener('error', (e) => log.error('uncaught', e.message))
  addEventListener('unhandledrejection', (e) => log.error('unhandled', String(e.reason?.message ?? e.reason)))
  const mm = globalThis.__mm = { boot: globalThis.__boot, top: TOP, log, ready: false }

  // ---- 1 link
  let link = parseLink(location.hash)
  const peerId = peerIdFor()

  // ---- 2 repo + doc (the wasm loads inside openRepo)
  bootStatus('loading Automerge…')
  const { repo, ws } = await openRepo(link.sync, { peerId })
  let handle; let created = false
  if (link.docUrl) {
    bootStatus('opening the world…')
    handle = await findDoc(repo, link.docUrl, { onWait: ({ attempt, tries }) => bootStatus(`waiting for the world… (try ${attempt + 1} of ${tries})`, { waiting: true }) })
  } else {
    // a bare URL is "make me a world": seed through the one write path, then
    // rewrite the hash so a reload, a copy or the Share button carries doc + key
    bootStatus('planting a new meadow…')
    handle = repo.create()
    applyDocOps(handle, seedOps({ title: 'Merge Meadow' }), { message: 'seed', peerId })
    link = { ...link, docUrl: handle.url, key: newKey() }
    history.replaceState(null, '', buildLink({ docUrl: handle.url, key: link.key, sync: link.sync }, location))
    created = true
  }
  addEventListener('hashchange', () => { if (parseLink(location.hash).docUrl !== link.docUrl) location.reload() })
  const readOnly = !!link.heads
  let docView = null
  if (readOnly) {
    try { docView = view(handle.doc(), link.heads) } catch (e) {
      docView = handle.doc()
      banner({ id: 'heads', level: 'error', text: `This version link names heads this world does not have (${e?.message ?? e}); showing the current world, read-only.` })
    }
  }
  const docNow = () => (readOnly ? docView : handle.doc())
  Object.assign(mm, { repo, handle, url: handle.url, peerId, link, readOnly })

  // ---- 3 world, built-in sim, doc systems, safe mode
  let stage = null; let reconciler = null; let players = null; let ownership = null; let editor = null
  const world = new World({ peerId })
  installSim(world, {
    inputs: () => players?.inputs() ?? new Map(),
    ground: (x, z) => stage?.ground?.(x, z) ?? 0,
    peerId,
    anchor: (id, name) => reconciler?.anchorArray?.(id, name) ?? null,
  })
  world.load(docNow())
  const makeCompartment = makeCompartmentFactory()
  const systemHost = makeSystemHost({ world, makeCompartment, log: (...a) => log.info(...a), opsOptions: { kinds: KINDS } })
  const lockedDown = Object.isFrozen(Array.prototype) && globalThis.__mmLockedDown !== false
  const safe = makeSafeMode({ docId: handle.documentId, systemsHash: systemsHash(docNow()), forced: link.safe })
  let systemsOn = lockedDown
  let armedHash = null
  let safeBanner = null
  let ranAnyway = false
  let safeHash = null // the systems hash safe mode protects against; any other hash runs again
  const crashHash = safe.bootCrashHash()
  function enterSafe (why, hash) {
    safeHash = hash
    if (!safe.forced) { safe.hold(hash); armedHash = null }
    systemsOn = false
    systemHost.setEnabled(false)
    safeBanner = banner({ id: 'safe', text: `Safe mode: doc systems are off — ${why ?? 'requested'}.`, actions: [{ label: 'Run systems anyway', onClick: () => runSystemsAnyway() }] })
  }
  if (!lockedDown) {
    systemHost.setEnabled(false)
    banner({ id: 'lockdown', level: 'error', text: 'SES lockdown did not run in this tab, so doc systems are off (they would run unsandboxed).' })
  } else if (safe.shouldStartSafe()) enterSafe(safe.reason(), systemsHash(docNow()))
  // user: the banner's "Run systems anyway" (sticks for this tab); otherwise the
  // systems changed since the hang, and meeting the crashed hash again goes safe again
  function runSystemsAnyway ({ user = true } = {}) {
    if (!lockedDown) return
    if (user) ranAnyway = true
    systemsOn = true
    systemHost.setEnabled(true)
    safeBanner?.remove(); safeBanner = null
    syncSystems(docNow())
    editor?.toast('Doc systems are running again')
  }
  // the crash marker is armed while systems run, keyed by what they are, so
  // editing a system after a hang re-enables systems (design §7.3)
  function syncSystems (doc) {
    const hash = systemsHash(doc)
    // a boot can start from a stale local copy and only then sync the systems that
    // hung last time: meeting the crashed hash later is as good a reason as at boot
    if (systemsOn && !ranAnyway && crashHash && hash === crashHash) {
      enterSafe('the last session stopped while running these systems (they arrived after boot)', hash)
      editor?.toast('Safe mode: the systems that hung last time just arrived', 'warn')
    }
    if (!systemsOn) {
      // compare with the hash safe mode was entered for, not the marker: this tab may
      // have re-armed the marker with other systems before the crashed ones arrived
      if (lockedDown && safeBanner && !safe.forced && hash !== safeHash) { editor?.toast('A system changed since the hang: running systems again'); runSystemsAnyway({ user: false }) }
      return
    }
    // armed BEFORE the sync: compiling runs module bodies and init(), which can hang
    const { report, armed } = syncArmed(safe, { hash, armed: armedHash, sync: () => systemHost.sync(doc), running: () => systemHost.size > 0 })
    armedHash = armed
    for (const r of report) if (!r.ok) log.warn(`[system ${r.name}]`, r.error)
  }

  // ---- 4 scene, reconciler, rig, pointers, controllers, interaction, VR button
  const canvas = document.getElementById('scene')
  stage = makeScene({ canvas, pixelRatio: Math.min(globalThis.devicePixelRatio || 1, 2) })
  const resources = makeResources()
  reconciler = makeReconciler({ world, scene: stage.scene, resources, plain: read.plain })
  stage.applyWorldSettings(read.docSummary(docNow()).world)
  const rig = new PlayerRig(stage.renderer, stage.camera)
  if (!rig.root.parent) stage.scene.add(rig.root)
  // the editor camera opens raised over the starter meadow (and the gallery card)
  rig.teleport({ x: 0, y: 3.5, z: 23 })
  rig.look(0, -0.24)
  const pointers = makePointers({ renderer: stage.renderer, camera: stage.camera, rig, dom: canvas })
  // no onMove / onSnapTurn: the controllers then move and turn the rig themselves;
  // their `move` is read below as a mounted rider's steering
  const controllers = makeControllers(rig, {})
  const commits = [] // interaction commits, flushed in the tick
  const interaction = makeInteraction({
    world, reconciler, pointers, rig, controllers, resources,
    // ownership arrives in step 5 (and never in a read-only view): resolve it per call
    pinOps: (id) => ownership?.pinOps(id) ?? [],
    unpinOps: (id, o) => ownership?.unpinOps(id, o) ?? [],
    // a drag whose pin is no longer mine aborts and writes nothing (§4.1)
    pinnedToMe: (id) => (ownership ? ownership.pinnedToMe(id) : true),
    ground: (x, z) => stage.ground(x, z),
    commit: (ops, { message } = {}) => { if (ops?.length) commits.push({ ops, message: message ?? 'move' }) },
    canGrab: (id) => (ownership ? ownership.canGrab(id) : true),
    onSelect: (id, info) => {
      if (info?.refused) { editor?.toast(`Can't grab ${world.get(id)?.name ?? id}: ${info.refused}`, 'warn'); return }
      editor?.select(id ?? null)
    },
    onMount: (id) => { players?.mount(id); editor?.toast(`Riding ${world.get(id)?.name ?? id} — WASD steers, E to get off`) },
    onDismount: () => { players?.dismount() },
    palette: XR_PALETTE,
    onSpawn: (item, at) => editor?.spawnAt(item.preset, Array.isArray(at) ? at : [at.x, at.y, at.z]),
  })
  const desktop = makeDesktopControls({
    rig, dom: canvas, interaction, reconciler,
    onDelete: (id) => editor?.remove(id),
    onMode: (m) => editor?.setMode(m === 'play' ? 'play' : 'edit'),
  })
  const vrButton = makeVRButton(stage.renderer, {
    onSessionStart: () => { document.body.classList.add('xr'); log.info('[xr] session started') },
    onSessionEnd: () => { document.body.classList.remove('xr'); log.info('[xr] session ended') },
  })

  // ---- 5 presence, ownership, pose stream, checkpoints (not for a read-only version view:
  // a peer that cannot write must never be elected to simulate for everyone)
  let presence = null; let stream = null; let checkpointer = null
  if (!readOnly) {
    presence = makePresence(handle, { peerId, info: { name: myName() || `guest-${peerId.slice(2, 6)}`, color: peerColor(peerId) } })
    ownership = makeOwnership({ presence, world, peerId })
    stream = makePoseStream(handle, { world, peerId, owns: ownership.owns, owner: ownership.owner, presence })
    checkpointer = makeCheckpointer({ world, owns: ownership.owns, flush: (ops) => world.queueOps(ops) })
    // a peer that says bye (or expires) hands its entities over NOW, not on this
    // tab's next frame: a slow or stalled frame must not delay the takeover
    presence.on((ev) => { if (ev.type === 'leave') { try { reown() } catch (e) { log.warn('[ownership]', e?.message) } } })
  }
  // recompute owners; buffers and checkpoints follow the gains and losses
  // After a stall or a hidden spell, what this tab still believes about the
  // entities it lost is stale (others simulated them meanwhile): no checkpoint.
  let stale = false
  function reown () {
    const { gained, lost } = ownership.update()
    for (const id of gained) stream.forget(id)
    for (const id of lost) {
      stream.hold(id)
      // what this tab's sim derived is stale once another peer simulates it: a later
      // regain starts from first sight (health's died-once rule), not an old hp
      const l = world.get(id)?.live
      if (l) { delete l.hp; delete l.died; delete l.intent; delete l.scores }
    }
    if (lost.length && !stale) checkpointer.flushNow(lost)
  }
  players = makePlayers({ world, presence, peerId, rig })

  // ---- 6 agent host, only when the link carries the editor key (§16.8)
  let agentHost = null
  if (link.key && !readOnly) {
    try {
      let evalFn = () => Promise.reject(new Error('eval is not ready'))
      const hostPowers = makeHostPowers({ scene: stage, log, evalPower: (src) => evalFn(src), explain: (id) => explain(world, id), systemHost, onCall: (c) => calls.push(c) })
      const capsApply = (h, ops, opts) => {
        const t0 = performance.now()
        try { const r = applyDocOps(h, ops, opts); calls.push({ what: opsLabel(ops), ok: true, ms: Math.round(performance.now() - t0) }); return r } catch (e) { calls.push({ what: opsLabel(ops), ok: false, error: String(e?.message ?? e).slice(0, 200) }); throw e }
      }
      const caps = makeWorldCaps(handle, { applyOps: capsApply, read, checkSource: lockedDown ? (src) => systemHost.check(src) : undefined, host: hostPowers, mode: 'live', peerId, kinds: KINDS, log: (...a) => log.info('[agent]', ...a) })
      evalFn = makeEvalPower({ world: caps.world, makeCompartment, log: (...a) => log.info(...a) })
      agentHost = startAgentHost({ handle, docId: handle.documentId, key: link.key, caps, log: (...a) => log.info('[agent]', ...a) })
      mm.caps = caps
    } catch (e) {
      log.error('[agent] host failed', e?.message)
      console.error('[agent] host failed', e)
    }
  }
  const agentView = agentHost && {
    sessions: () => agentHost.sessions(),
    revoke: (role) => agentHost.revoke(role),
    calls: () => calls.list(),
    get viewKey () { return agentHost.viewKey },
  }

  // ---- 7 editor
  const checkSource = lockedDown ? (src) => systemHost.check(src) : undefined
  // every editor write (and undo/redo) moves a simulated entity through its
  // owner's inbox too: withMoves is the one expansion (design §4.4)
  const editorApply = (ops, { message } = {}) => {
    if (readOnly) throw new Error('this is a read-only version view')
    return applyDocOps(handle, withMoves(handle.doc(), ops), { message, peerId, checkSource, kinds: KINDS })
  }
  const undo = makeUndo({ applyOps: (ops, opts) => editorApply(ops, opts) })
  const share = makeShare({ handle, link, repo, title: () => read.docSummary(docNow()).title })
  // E / squeeze: track C's interaction finds the mount and seats the rig; its
  // onMount / onDismount put the rider component on my player
  const toggleMount = () => { if (!interaction.toggleRide(rig.pose().p ? { x: rig.pose().p[0], y: rig.pose().p[1], z: rig.pose().p[2] } : null, editor?.selected)) editor?.toast('Nothing to ride here: get within reach of a mount (a horse)') }
  editor = makeEditor({
    root: document.getElementById('app'), world, handle, applyOps: editorApply, read, reconciler, interaction, rig, presence, ownership, systemHost, agentHost: agentView, link, undo, kinds: KINDS,
    share, doc: docNow, peerId, explain: (id) => explain(world, id), pointers, ground: (x, z) => stage.ground(x, z), vrButton, readOnly,
    safe: { reason: () => (!lockedDown ? 'SES lockdown did not run.' : safeBanner ? safe.reason() ?? 'safe mode' : 'they are switched off.'), canRun: () => lockedDown, runAnyway: runSystemsAnyway },
    onMode: (m) => desktop.setMode(m === 'play' ? 'play' : 'editor'),
    onMount: toggleMount,
    deferKeys: ['grab', 'delete', 'focus', 'mount'], // desktop.js binds G, Delete, F, E
    enableAgents: () => { location.hash = buildLink({ docUrl: handle.url, key: newKey(), sync: link.sync }, location).split('#')[1]; location.reload() },
    builtinSystems: () => [...BUILTIN_SYSTEMS],
  })

  // ---- 8 one doc subscription feeds everything (rule §2.3)
  watch(handle, ({ doc, patches, initial, deleted }) => {
    if (deleted) { banner({ id: 'deleted', level: 'error', text: 'This world was deleted.' }); return }
    if (readOnly && !initial) return // a version view stays at its heads
    const d = readOnly ? docView : doc
    if (initial) world.load(d); else world.applyPatches(d, patches)
    syncSystems(d)
    if (initial || patches.some((p) => p.path?.[0] === 'world')) stage.applyWorldSettings(read.docSummary(d).world)
    editor.docChanged(patches)
  })

  // ---- 9 the loop: fixed 30 Hz simulation, render at display rate
  function flush () {
    if (readOnly) { world.drainOps(); commits.length = 0; return }
    // editor commits first and on their own, so each gesture has an exact inverse for undo
    for (const { ops, message } of commits.splice(0)) {
      // grab, drags and release of one entity coalesce: one undo puts it back where it was.
      // A drag of an entity this tab simulates already moved its live pose; any other
      // pose write also reaches the entity's owner through its inbox.
      try { const out = applyDocOps(handle, withMoves(handle.doc(), ops, { skip: (id) => world.owns(id) }), { message, peerId, kinds: KINDS }); undo.record(out.inverse, message, { key: `commit:${ops[0]?.id ?? message}` }) } catch (e) { log.warn('[commit]', e?.message); editor.toast(`Not saved: ${e?.message ?? e}`, 'warn') }
    }
    const ops = world.drainOps()
    if (!ops.length) return
    // nobody can retry this batch (the sim's local state has moved on as if it
    // landed), so one bad op drops only itself: every hit, drain, checkpoint and
    // `dead` group of the tick still reaches the doc
    try {
      const { dropped } = applyValidOps(handle, ops, { message: 'tick', peerId, kinds: KINDS })
      for (const d of dropped) reportDropped(d)
    } catch (e) { log.error('[flush] dropped a tick batch:', String(e?.message ?? e).slice(0, 400)) }
  }
  const droppedSeen = new Map()
  function reportDropped ({ op, error }) {
    const k = `${op?.op}|${error}`; const n = (droppedSeen.get(k) ?? 0) + 1
    droppedSeen.set(k, n)
    if (n === 1 || n % 300 === 0) {
      log.warn(`[flush] dropped ${op?.op ?? '?'} ${op?.id ?? op?.name ?? ''}${n > 1 ? ` (${n}×)` : ''}:`, String(error).slice(0, 300))
      if (n === 1) editor?.toast(`A queued ${op?.op ?? 'op'} was refused: ${String(error).slice(0, 160)}`, 'warn')
    }
  }
  function step (dt) {
    const nowMs = Date.now()
    if (ownership) {
      // a stall past the stream TTL is noticed BEFORE ownership is recomputed, so a
      // tab the others elected around never runs one more step as the stale host
      if (presence.selfCheck(nowMs)) stale = true
      reown()
      stale = false
      players.sync()
      stream.apply(nowMs)
    }
    players.updateSelf()
    world.tick(dt)
    systemHost.tick(dt)
    flush()
    if (stream) { stream.tick(nowMs); checkpointer.tick(nowMs) }
  }
  const ticker = makeTicker({ hz: 30, step })
  let last = performance.now(); let frames = 0
  const frameErrors = new Map()
  const frameError = (e) => {
    const k = String(e?.message ?? e); const n = (frameErrors.get(k) ?? 0) + 1
    frameErrors.set(k, n)
    if (n === 1) { console.error('[frame]', e); log.error('[frame]', k); editor?.toast(`Render loop error: ${k}`, 'error') }
  }
  stage.renderer.setAnimationLoop(() => {
    const t = performance.now(); const dt = Math.min(0.1, (t - last) / 1000); last = t
    try {
      desktop.update(dt)
      controllers.update(dt)
      // a rider steers its mount through the sim's control system (input, not the rig)
      const stick = controllers.move[0] || controllers.move[1] ? controllers.move : desktop.move
      players.setMove(players.riding ? [stick[0], stick[1]] : [0, 0])
      // a stall past the stream TTL (debugger, background tab): rejoin as a newcomer
      // first, and drop the backlog instead of simulating it under stale ownership
      if (presence?.selfCheck(Date.now())) { stale = true; ticker.reset() }
      const alpha = ticker.advance(t)
      interaction.update(dt) // also runs pointers.update() and rig.update()
      reconciler.frame(dt, alpha)
      editor.frame()
      stage.render()
    } catch (e) { frameError(e) }
    if (++frames === 2) { hideBoot(); mm.ready = true }
  })
  addEventListener('resize', () => stage.resize())

  // leave cleanly: last checkpoint of what I simulate, bye, clear the crash marker
  addEventListener('pagehide', () => {
    try { checkpointer?.flushNow(); flush() } catch {}
    presence?.bye()
    // a closing host says a sealed bye, so a guest's pending calls fail at once
    // instead of waiting out their timeout (the guest then reconnects or falls back)
    agentHost?.stop().catch(() => {})
    safe.onPageHide()
  })
  addEventListener('pageshow', (e) => { if (e.persisted) { safe.onPageShow(); presence?.hello() } })
  // A hidden tab stops its frames (no sim, no stream) while its timers still run:
  // hand everything over at once and stay silent, then come back as a newcomer.
  // Not in XR: an immersive session keeps its own frame loop.
  document.addEventListener('visibilitychange', () => {
    if (!presence || stage.renderer.xr?.isPresenting) return
    try {
      if (document.visibilityState === 'hidden') { checkpointer?.flushNow(); flush(); presence.pause() } else if (presence.paused) { presence.resume(); stale = true; ticker.reset() }
    } catch (e) { log.warn('[visibility]', e?.message) }
  })

  // Share enables once the sync server holds the doc: a joiner opened earlier
  // gets 'unavailable' (design §2.3). A found doc is already there.
  if (readOnly) editor.setShareReady(true, 'a version link')
  else if (!ws || !created) editor.setShareReady(true)
  else waitForServer(handle, ws).then(() => editor.setShareReady(true), () => editor.setShareReady(true, 'the sync server has not confirmed yet; the link may need a moment'))

  Object.assign(mm, { world, systemHost, editor, stage, renderer: stage.renderer, resources, reconciler, interaction, desktop, rig, presence, ownership, stream, players, agentHost, undo, share, KINDS, calls, safe, lockedDown })
  return mm
}

async function waitForServer (handle, ws, { tries = 40 } = {}) {
  for (let i = 0; i < tries; i++) {
    const sid = serverStorageId(ws)
    if (sid) { try { await whenSynced(handle, sid, { timeoutMs: 10000 }); return } catch {} } else await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('sync server never acknowledged')
}
