// Entity tree (design §10): parent nesting from the flat map + parent pointer,
// preset badge, owner / held-by badges, search. buildTree is pure (tested).
import { h, peerColor } from './dom.js'

const byName = (a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

// rows: entityData rows. -> [{ row, depth, hasChildren, open, match }] in display
// order. A search shows matches with their ancestors (opened); collapsed nodes
// hide their subtree unless searching. A parent that does not exist puts the
// child at the root, so nothing is unreachable.
export function buildTree (rows, { query = '', collapsed = new Set() } = {}) {
  const byId = new Map(rows.map((r) => [r.id, r]))
  const kids = new Map()
  for (const r of rows) {
    const p = r.parent && byId.has(r.parent) && r.parent !== r.id ? r.parent : ''
    if (!kids.has(p)) kids.set(p, [])
    kids.get(p).push(r)
  }
  for (const list of kids.values()) list.sort(byName)
  const q = String(query).trim().toLowerCase()
  const hit = (r) => !q || [r.id, r.name, r.preset].some((s) => String(s ?? '').toLowerCase().includes(q))
  // ids visible under a search: matches and their ancestors
  const show = new Set()
  if (q) {
    for (const r of rows) {
      if (!hit(r)) continue
      for (let a = r, n = 0; a && n < 64; a = byId.get(a.parent), n++) show.add(a.id)
    }
  }
  const out = []
  const walk = (parent, depth, seen) => {
    for (const r of kids.get(parent) ?? []) {
      if (seen.has(r.id)) continue
      if (q && !show.has(r.id)) continue
      const hasChildren = (kids.get(r.id) ?? []).length > 0
      const open = q ? true : !collapsed.has(r.id)
      out.push({ row: r, depth, hasChildren, open, match: !!q && hit(r) })
      if (hasChildren && open) walk(r.id, depth + 1, new Set([...seen, r.id]))
    }
  }
  walk('', 0, new Set())
  return out
}

export function makeTree ({ onSelect, onToggle, ownerOf, heldBy, peerName, selfId }) {
  const collapsed = new Set()
  const search = h('input', { class: 'search', type: 'search', placeholder: 'Search entities  ( / )', spellcheck: false })
  const list = h('div', { class: 'tree', role: 'tree', tabIndex: 0 })
  const count = h('span', { class: 'muted count' })
  const el = h('section', { class: 'panel-section tree-section' }, h('div', { class: 'section-head' }, h('h3', null, 'Entities'), count), search, list)
  let rows = []; let selected = null

  const badge = (cls, text, title) => h('span', { class: `badge ${cls}`, title }, text)
  function render () {
    const items = buildTree(rows, { query: search.value, collapsed })
    count.textContent = String(rows.length)
    list.replaceChildren(...items.map(({ row, depth, hasChildren, open, match }) => {
      const owner = ownerOf?.(row.id)
      const held = heldBy?.(row.id)
      const caret = hasChildren
        ? h('button', { class: 'caret icon', type: 'button', title: open ? 'collapse' : 'expand', onclick: (e) => { e.stopPropagation(); if (collapsed.has(row.id)) collapsed.delete(row.id); else collapsed.add(row.id); render(); onToggle?.(row.id) } }, open ? '▾' : '▸')
        : h('span', { class: 'caret' })
      return h('div', {
        class: `node${row.id === selected ? ' selected' : ''}${match ? ' match' : ''}${row.groups?.includes('dead') ? ' dead' : ''}`,
        role: 'treeitem', dataset: { id: row.id }, style: { '--depth': depth },
        onclick: () => onSelect(row.id),
      },
      caret,
      h('span', { class: 'name', title: row.id }, row.name || row.id),
      row.preset ? badge('preset', row.preset, `preset ${row.preset}`) : null,
      held ? badge('held', '✋', held) : null,
      owner ? h('span', { class: 'owner-dot', title: owner === selfId ? 'simulated here' : `simulated by ${peerName?.(owner) ?? owner}`, style: { background: peerColor(owner) } }) : null)
    }))
    list.querySelector('.selected')?.scrollIntoView?.({ block: 'nearest' })
  }
  search.addEventListener('input', render)
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const first = buildTree(rows, { query: search.value, collapsed }).find((x) => x.match); if (first) onSelect(first.row.id) }
  })
  list.addEventListener('keydown', (e) => {
    const items = buildTree(rows, { query: search.value, collapsed })
    const i = items.findIndex((x) => x.row.id === selected)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const n = items[Math.max(0, Math.min(items.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))]
      if (n) onSelect(n.row.id)
    }
  })
  return {
    el,
    setRows (r) { rows = r; render() },
    setSelected (id) { selected = id; render() },
    refreshBadges: render,
    focusSearch () { search.focus(); search.select() },
  }
}
