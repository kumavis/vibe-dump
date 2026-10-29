// Top bar (design §10): title · peers with colours · Edit/Play · undo/redo ·
// Share · Fork · Download · Open · Enter VR slot · safe-mode indicator.
import { h, peerColor } from './dom.js'

// ctx: { onToggle(side), onMode(), onUndo(), onRedo(), onShare(), onFork(), onDownload(), onOpen(file), onRename(name), onTitle() }
export function makeTopbar (ctx) {
  const title = h('button', { class: 'title', type: 'button', title: 'World settings', onclick: () => ctx.onTitle?.() }, 'Merge Meadow')
  const peers = h('div', { class: 'peers' })
  const mode = h('button', { class: 'mode', type: 'button', title: 'Tab: editor camera ⇄ play (pointer lock, E to ride)', onclick: () => ctx.onMode() }, '✎ Edit')
  const undo = h('button', { class: 'icon', type: 'button', title: 'Undo (Ctrl/Cmd-Z)', disabled: true, onclick: () => ctx.onUndo() }, '↶')
  const redo = h('button', { class: 'icon', type: 'button', title: 'Redo (Ctrl/Cmd-Shift-Z)', disabled: true, onclick: () => ctx.onRedo() }, '↷')
  const share = h('button', { class: 'primary share', type: 'button', disabled: true, title: 'waiting for the sync server to hold this world…', onclick: () => ctx.onShare() }, 'Share')
  const file = h('input', { type: 'file', accept: '.automerge,application/octet-stream', hidden: true, onchange: (e) => { const f = e.target.files?.[0]; if (f) ctx.onOpen(f); e.target.value = '' } })
  const more = h('div', { class: 'more' },
    h('button', { type: 'button', title: 'Copy into a new world (fresh history and key)', onclick: () => ctx.onFork() }, 'Fork'),
    h('button', { type: 'button', title: 'Save the doc as a .automerge file', onclick: () => ctx.onDownload() }, 'Download'),
    h('button', { type: 'button', title: 'Open a .automerge file as a new world', onclick: () => file.click() }, 'Open'), file)
  const vr = h('div', { class: 'vr-slot' })
  const safe = h('span', { class: 'badge safe', hidden: true, title: 'doc systems are not running in this tab' }, 'SAFE MODE')
  const ro = h('span', { class: 'badge ro', hidden: true, title: 'a version link: edits are off' }, 'READ-ONLY')
  const el = h('header', { class: 'topbar' },
    h('button', { class: 'icon toggle-left', type: 'button', title: 'Entities & palette', onclick: () => ctx.onToggle('left') }, '☰'),
    title, peers, h('div', { class: 'spacer' }), safe, ro, mode, undo, redo, share, more, vr,
    h('button', { class: 'icon toggle-right', type: 'button', title: 'Inspector, systems, agent, world', onclick: () => ctx.onToggle('right') }, '⚙'))

  let renaming = false
  return {
    el,
    vrSlot: vr,
    setTitle (t) { title.textContent = t || 'Merge Meadow'; title.title = `${t} — world settings` },
    setPeers (self, others) {
      if (renaming) return
      const me = h('button', { class: 'peer me', type: 'button', title: 'you — click to rename', style: { '--c': peerColor(self.id) }, onclick: () => rename(self) }, h('i'), self.name || 'you')
      peers.replaceChildren(me, ...others.map((p) => h('span', { class: 'peer', title: `${p.name || p.id}${p.streaming ? ' · streaming' : ''}`, style: { '--c': peerColor(p.id) } }, h('i'), p.name || p.id.slice(0, 6))))
    },
    setUndo (canUndo, canRedo, peek = {}) { undo.disabled = !canUndo; redo.disabled = !canRedo; undo.title = `Undo ${peek.undo ?? ''} (Ctrl/Cmd-Z)`; redo.title = `Redo ${peek.redo ?? ''} (Ctrl/Cmd-Shift-Z)` },
    setShareReady (ready, why) { share.disabled = !ready; share.title = ready ? 'Copy the link (with the agent key)' : (why || 'waiting for the sync server to hold this world…') },
    setMode (m) { mode.textContent = m === 'play' ? '▶ Play' : '✎ Edit'; mode.classList.toggle('on', m === 'play') },
    setSafe (on) { safe.hidden = !on },
    setReadOnly (on) { ro.hidden = !on },
  }

  function rename (self) {
    renaming = true
    const i = h('input', { class: 'rename', value: self.name || '', placeholder: 'your name', spellcheck: false })
    const done = (ok) => { if (!renaming) return; renaming = false; if (ok && i.value.trim()) ctx.onRename(i.value.trim().slice(0, 32)); ctx.onPeersStale?.() }
    i.addEventListener('keydown', (e) => { if (e.key === 'Enter') done(true); if (e.key === 'Escape') done(false) })
    i.addEventListener('blur', () => done(true))
    peers.firstElementChild?.replaceWith(i)
    i.focus(); i.select()
  }
}
