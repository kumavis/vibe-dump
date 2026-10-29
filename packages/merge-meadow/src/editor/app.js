// The desktop editor (design §10): vanilla DOM panels floating over the
// full-window canvas. It reads through track A's read.js, writes only through
// the applyOps it is handed (recording undo), and reaches the scene only
// through reconciler / interaction / rig (never three, rule §2.8).
import { getConflicts } from '@automerge/automerge/slim'
import { h, peerColor } from './dom.js'
import { makeTopbar } from './topbar.js'
import { makeTree } from './tree.js'
import { makePalette } from './palette.js'
import { makeInspector } from './inspector.js'
import { makeSystemsPanel } from './systems-panel.js'
import { makeAgentPanel } from './agent-panel.js'
import { makeWorldPanel } from './world-panel.js'
import { makeToasts } from './toasts.js'
import { keyAction } from './keys.js'
import { aheadOf, groundHit, focusPose, pitchOfQuat, lookDelta } from './spatial.js'
import { presetComponents } from './component-ops.js'

const TABS = ['inspector', 'systems', 'agent', 'world']
const TAB_LABEL = { inspector: 'Inspector', systems: 'Systems', agent: 'Agent', world: 'World' }
const errorText = (e) => String(e?.problems?.length ? e.problems.slice(0, 3).join('; ') + (e.problems.length > 3 ? ` (+${e.problems.length - 3} more)` : '') : e?.message ?? e)
const TREE_FIELDS = new Set(['name', 'parent', 'preset', 'owner', 'groups'])

export function makeEditor ({
  root, world, handle, applyOps, read, reconciler, interaction, rig, presence, ownership, systemHost, agentHost, link, undo, kinds,
  // optional (the contract allows options to grow)
  share, doc: docOf = () => handle.doc(), peerId = presence?.peerId ?? 'local', explain, pointers, ground = () => 0,
  vrButton, safe, readOnly = false, onMode, onMount, enableAgents, builtinSystems, copy: copyFn, now = () => performance.now(),
  // actions another key handler already owns (track C's desktop controls bind G, Delete, F, E)
  deferKeys = [],
} = {}) {
  const deferred = new Set(deferKeys)
  if (!root) throw new TypeError('makeEditor needs a root element')
  const toasts = makeToasts()
  const toast = (msg, level) => toasts.toast(msg, level)
  const copy = copyFn ?? ((text) => share?.copy ? share.copy(text) : Promise.resolve(false))
  let selected = null; let tab = 'inspector'; let mode = 'edit'; let placing = null
  const dirty = { tree: true, insp: true, sys: true, world: true, palette: true, title: true }
  const lastAt = { live: 0, slow: 0, sys: 0 }
  const sysSeen = new Map(); let lastHost
  let destroyed = false

  // ---- writes: the one path, with undo
  function write (ops, message = 'edit', { key, quiet, onError } = {}) {
    if (readOnly) { toast('This is a read-only version view: open the live link to edit', 'warn'); return false }
    if (!ops?.length) return false
    try {
      const out = applyOps(ops, { message })
      undo?.record(out?.inverse, message, { key })
      return out ?? { results: [] }
    } catch (e) {
      try { onError?.(e) } catch {}
      if (!quiet) toast(errorText(e), 'error')
      return false
    }
  }

  // ---- panels
  const topbar = makeTopbar({
    onToggle: (side) => document.body.classList.toggle(`${side}-open`),
    onMode: () => setMode(mode === 'edit' ? 'play' : 'edit'),
    onUndo: () => doUndo(), onRedo: () => doRedo(),
    onShare: async () => { const r = await share?.copyLink(); toast(r?.copied ? 'Link copied — anyone with it can edit (and attach an agent)' : `Copy this link: ${r?.text ?? ''}`, r?.copied ? 'info' : 'warn') },
    onFork: async () => { try { const r = await share.fork(); toast('Forked: opening the copy…'); go(r.link) } catch (e) { toast(`Fork failed: ${errorText(e)}`, 'error') } },
    onDownload: () => { try { const r = share.download(); toast(`Saved ${r.name} (${Math.round(r.bytes / 1024)} KB)`) } catch (e) { toast(`Download failed: ${errorText(e)}`, 'error') } },
    onOpen: async (file) => { try { const r = await share.open(file); toast(`Opened ${file.name}: switching to it…`); go(r.link) } catch (e) { toast(`Open failed: ${errorText(e)}`, 'error') } },
    onRename: (name) => { presence?.set?.({ name }); try { globalThis.localStorage?.setItem('mm:name', name) } catch {} ; refreshPeers() },
    onPeersStale: () => refreshPeers(),
    onTitle: () => showTab('world'),
  })
  if (vrButton) topbar.vrSlot.append(vrButton)
  topbar.setReadOnly(readOnly)

  const ownerName = (p) => (p === peerId ? 'you' : presence?.peers?.().get(p)?.info?.name ?? p)
  const tree = makeTree({
    onSelect: (id) => select(id),
    ownerOf: (id) => ownership?.owner?.(id) ?? null,
    heldBy: (id) => { const r = ownership?.canGrab?.(id); return r === true || r == null ? null : String(r) },
    peerName: ownerName,
    selfId: peerId,
  })
  const palette = makePalette({
    onSpawn: (name) => { if (placing) { placing.preset = name; palette.setArmed(true, name) } else spawnAhead(name) },
    onArm: (on) => { placing = on ? { preset: null } : null; palette.setArmed(on) },
  })
  const ctx = { doc: () => docOf(), read, kinds, ownership, presence, peerId, write, explain, toast, copy }
  const inspector = makeInspector(ctx)
  const systems = makeSystemsPanel({ ...ctx, systemHost, safe })
  const agent = makeAgentPanel({ link, share, agentHost, copy, toast, enableAgents, viewLink: () => (agentHost?.viewKey && share?.viewLink ? share.viewLink(agentHost.viewKey) : null) })
  const worldPanel = makeWorldPanel({ ...ctx, share, builtinSystems })
  const panels = { inspector, systems, agent, world: worldPanel }

  const tabButtons = new Map(TABS.map((t) => [t, h('button', { class: 'tab', type: 'button', role: 'tab', dataset: { tab: t }, onclick: () => showTab(t) }, TAB_LABEL[t], h('span', { class: 'tab-badge' }))]))
  const tabBody = h('div', { class: 'tab-body' })
  const left = h('aside', { class: 'panel left' }, tree.el, palette.el)
  const right = h('aside', { class: 'panel right' }, h('nav', { class: 'tabs', role: 'tablist' }, ...tabButtons.values()), tabBody)
  const hint = h('div', { class: 'hint' }, 'Tab play · right-drag look · WASD move · F focus · G grab · Del delete · E ride · Ctrl-Z undo')
  const shell = h('div', { class: 'editor' }, topbar.el, left, right, hint, toasts.el)
  root.append(shell)
  if (globalThis.matchMedia?.('(min-width: 900px)').matches) document.body.classList.add('left-open', 'right-open')
  showTab('inspector', { open: false })

  function showTab (t, { open = true } = {}) {
    tab = TABS.includes(t) ? t : 'inspector'
    for (const [k, b] of tabButtons) b.classList.toggle('active', k === tab)
    tabBody.replaceChildren(panels[tab].el)
    if (tab === 'systems') systems.refresh()
    if (tab === 'agent') agent.refresh()
    if (tab === 'world') worldPanel.render()
    if (open) document.body.classList.add('right-open')
  }

  function go (href) { try { globalThis.location.assign(href); globalThis.location.reload() } catch (e) { toast(`Open ${href}`, 'info') } }

  // ---- selection, spawning, focus
  function select (id, { fromScene = false } = {}) {
    const next = id && read.entityData(docOf(), id) ? id : null
    if (next === selected) return
    selected = next
    tree.setSelected(selected)
    inspector.select(selected)
    if (!fromScene && interaction?.select && interaction.selected !== selected) { try { interaction.select(selected) } catch (e) { console.error('[editor] interaction.select', e) } }
    if (selected && tab !== 'inspector' && !fromScene) showTab('inspector')
  }

  function spawnAt (preset, at) {
    const out = write([{ op: 'spawn', preset, at }], `spawn ${preset}`)
    if (out) { const id = out.results?.[0]; if (typeof id === 'string') { dirty.tree = true; flushDirty(); select(id) } }
    return out
  }
  const spawnAhead = (preset) => spawnAt(preset, aheadOf(rig?.pose?.() ?? { p: [0, 0, 12], yaw: 0 }, 6, ground))

  function focus (id = selected) {
    const e = id ? world?.get?.(id) : null
    const p = e?.live?.p ?? read.entityData(docOf(), id)?.effective?.transform?.p
    if (!p || !rig) return
    const pose = rig.pose()
    const eye = Array.isArray(pose.head) ? pose.head[1] - pose.p[1] : 1.6
    const target = focusPose(p, { yaw: pose.yaw, dist: 8, height: 3 })
    rig.teleport?.({ x: target.p[0], y: target.p[1] - eye, z: target.p[2] })
    const d = lookDelta({ yaw: pose.yaw, pitch: pitchOfQuat(pose.head?.slice?.(3)) }, target)
    rig.look?.(d.dYaw, d.dPitch)
  }

  function remove (id = selected) {
    if (!id) return
    const row = read.entityData(docOf(), id)
    if (write([{ op: 'despawn', id }], `delete ${row?.name ?? id}`)) select(null)
  }

  function setMode (m) {
    const next = m === 'play' ? 'play' : 'edit'
    if (next === mode) return
    mode = next
    document.body.classList.toggle('mode-play', mode === 'play')
    topbar.setMode(mode)
    try { onMode?.(mode) } catch (e) { console.error('[editor] onMode', e) }
  }

  function doUndo () { const r = undo?.undo(); if (r) toast(r.ok ? `Undid ${r.message}` : `Could not undo ${r.message}: ${errorText(r.error)}`, r.ok ? 'info' : 'warn') }
  function doRedo () { const r = undo?.redo(); if (r) toast(r.ok ? `Redid ${r.message}` : `Could not redo ${r.message}: ${errorText(r.error)}`, r.ok ? 'info' : 'warn') }

  // ---- keyboard
  const onKey = (ev) => {
    const a = keyAction(ev)
    if (!a || deferred.has(a)) return
    switch (a) {
      case 'undo': ev.preventDefault(); doUndo(); break
      case 'redo': ev.preventDefault(); doRedo(); break
      case 'toggleMode': ev.preventDefault(); setMode(mode === 'edit' ? 'play' : 'edit'); break
      case 'mount': onMount?.(); break
      case 'focus': focus(); break
      case 'grab': if (selected) interaction?.grab?.(selected); break
      case 'delete': if (selected) { ev.preventDefault(); remove() } break
      case 'search': ev.preventDefault(); document.body.classList.add('left-open'); tree.focusSearch(); break
      case 'escape':
        if (ev.target?.blur && ev.target !== document.body) { ev.target.blur(); break }
        if (placing) { placing = null; palette.setArmed(false); break }
        if (interaction?.grabbing) { if (!deferred.has('grab')) interaction.abort?.(); break }
        if (mode === 'play') { setMode('edit'); break }
        select(null); break
    }
  }
  globalThis.addEventListener?.('keydown', onKey)
  undo?.onChange?.(() => topbar.setUndo(undo.canUndo, undo.canRedo, undo.peek?.()))

  // ---- doc changes: mark what is stale, render it in frame()
  function docChanged (patches = []) {
    const touched = new Set()
    for (const p of patches) {
      const [rootKey, key, sub, comp] = p.path ?? []
      if (rootKey === 'entities') {
        if (key === undefined || p.path.length <= 2 || TREE_FIELDS.has(sub)) dirty.tree = true
        if (key === selected) dirty.insp = true
        if (sub === 'components' && comp === 'representation' && p.path.length === 4) touched.add(String(key))
      } else if (rootKey === 'presets') { dirty.tree = dirty.insp = dirty.palette = true } else if (rootKey === 'components') dirty.insp = true
      else if (rootKey === 'systems') dirty.sys = true
      else if (rootKey === 'world' || rootKey === 'meta') { dirty.world = dirty.title = true; if (rootKey === 'world') dirty.sys = true }
      else if (rootKey === undefined) Object.keys(dirty).forEach((k) => { dirty[k] = true })
    }
    if (touched.size) mergeOddities(touched)
    if (selected && !read.entityData(docOf(), selected)) select(null)
  }

  // a concurrent re-put of a whole representation leaves two looks in conflict:
  // Automerge picks one deterministically; say so instead of letting it flicker by
  function mergeOddities (ids) {
    const d = docOf()
    for (const id of ids) {
      let c = null
      try { c = getConflicts(d.entities[id].components, 'representation') } catch { continue }
      if (c && Object.keys(c).length > 1) {
        const kindsSeen = Object.values(c).map((v) => String(v?.kind ?? '?'))
        toast(`Merge: two looks for ${read.entityData(d, id)?.name ?? id} were written at once (${kindsSeen.join(' vs ')}); kept ${String(d.entities[id].components.representation?.kind ?? '?')}`, 'warn')
      }
    }
  }

  function flushDirty () {
    const d = docOf()
    if (dirty.tree) { dirty.tree = false; tree.setRows(read.listEntities(d)) }
    if (dirty.palette) {
      dirty.palette = false
      const names = read.docSummary(d).presets
      palette.setPresets(names.map((n) => {
        const p = read.presetData(d, n)
        const ext = Array.isArray(p?.extends) ? p.extends : p?.extends ? [p.extends] : []
        const comps = presetComponents(read, d, n)
        return { name: n, extends: ext.map(String), look: comps.representation ?? null, light: !!comps.light }
      }))
    }
    if (dirty.title) { dirty.title = false; const t = read.docSummary(d).title; topbar.setTitle(t); if (typeof document !== 'undefined' && t) document.title = `${t} — Merge Meadow` }
    if (dirty.insp) { dirty.insp = false; inspector.update() }
    if (dirty.sys) { dirty.sys = false; systems.docChanged() }
    if (dirty.world && tab === 'world') { dirty.world = false; worldPanel.render() }
  }

  function refreshPeers () {
    if (!presence) { topbar.setPeers({ id: peerId, name: 'you' }, []); return }
    const others = [...(presence.peers?.() ?? new Map())].map(([id, p]) => ({ id, name: p.info?.name, streaming: p.streaming })).sort((a, b) => (a.id < b.id ? -1 : 1))
    topbar.setPeers({ id: peerId, name: presence.info?.()?.name ?? 'you' }, others)
  }

  // system errors become toasts once per new error, not once per tick
  function watchSystems () {
    const st = systemHost?.status?.() ?? []
    let bad = 0
    for (const s of st) {
      const key = s.suspended ? `suspended:${s.errors}` : s.lastError ?? ''
      if (s.lastError || s.suspended) bad++
      if (sysSeen.get(s.name) === key) continue
      sysSeen.set(s.name, key)
      if (s.suspended) toast(`System ${s.name} suspended after ${s.errors} errors: ${s.lastError ?? ''}`, 'error')
      else if (s.lastError) toast(`System ${s.name}: ${s.lastError}`, 'error')
    }
    tabButtons.get('systems').querySelector('.tab-badge').textContent = bad ? '●' : ''
    topbar.setSafe(!!systemHost && systemHost.enabled === false)
  }

  function watchHost () {
    const host = ownership?.host?.() ?? null
    if (host === lastHost) return
    const prev = lastHost
    lastHost = host
    if (prev == null) return // boot, or the first election: not news, a handoff is
    if (host === peerId) toast('This tab now simulates the shared creatures')
    else if (host) toast(`${ownerName(host)} now simulates the shared creatures`)
  }

  // placement at the cursor: the mouse pointer's press this frame, on the ground
  function place () {
    if (!placing?.preset || !pointers) return
    const m = pointers.list?.().find((p) => p.id === 'mouse')
    if (!m?.pressed) return
    const r = m.ray?.ray
    const at = r ? groundHit(r.origin, r.direction) : null
    if (!at) { toast('Point at the ground to place', 'warn'); return }
    at[1] = ground(at[0], at[2]) || 0
    const name = placing.preset
    placing = null; palette.setArmed(false)
    spawnAt(name, at)
  }

  function frame () {
    if (destroyed) return
    const t = now()
    place()
    flushDirty()
    if (t - lastAt.live > 250) { lastAt.live = t; inspector.refreshLive(); watchSystems(); watchHost() }
    if (t - lastAt.slow > 1000) {
      lastAt.slow = t
      refreshPeers(); tree.refreshBadges()
      if (tab === 'systems') systems.render()
      if (tab === 'agent') agent.refresh()
      const n = agentHost?.sessions?.().length ?? 0
      tabButtons.get('agent').querySelector('.tab-badge').textContent = n ? String(n) : ''
    }
  }

  flushDirty(); refreshPeers()
  topbar.setUndo(!!undo?.canUndo, !!undo?.canRedo)

  return {
    frame,
    docChanged,
    select: (id) => select(id, { fromScene: true }),
    toast,
    destroy () { destroyed = true; globalThis.removeEventListener?.('keydown', onKey); shell.remove() },
    // beyond the contract: what main.js wires into
    setShareReady: (ready, why) => topbar.setShareReady(ready, why),
    setMode,
    get mode () { return mode },
    get selected () { return selected },
    spawnAhead,
    spawnAt,
    remove,
    showTab,
    focus,
  }
}
