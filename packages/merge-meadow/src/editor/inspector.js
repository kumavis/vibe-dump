// Inspector (design §10): name, parent, preset, groups, owner/pin, health,
// "why is it doing that", then one schema-driven form per effective component.
// Every edit is an op through ctx.write (which records undo). Cards re-render
// only when their own effective data changed, and never under the cursor.
import { h, hasFocusWithin, peerColor } from './dom.js'
import { renderForm } from './forms.js'
import { renderKindSwitcher, switchKindOps } from './kind-switcher.js'
import { editOps, componentOrigin, removeComponentOps, resetComponentOps, addComponentOps, presetComponents, healOps, representationSchema, sortComponents } from './component-ops.js'
import { moveOps } from '../doc/ops.js'

const OPEN_BY_DEFAULT = new Set(['transform', 'representation', 'body', 'health', 'light', 'perception', 'attack'])
const json = (v) => JSON.stringify(v ?? null)

// ctx: { doc(), read, kinds, ownership, presence, peerId, write(ops, message, opts), explain(id), toast(msg, level), copy(text) }
export function makeInspector (ctx) {
  const el = h('div', { class: 'inspector' })
  const empty = h('div', { class: 'empty muted' }, 'Select an entity in the tree or the scene.', h('br'), 'Spawn one from the palette.')
  const opened = new Set(OPEN_BY_DEFAULT)
  const closed = new Set()
  let id = null; let cards = new Map(); let parts = null; let dirty = false

  const doc = () => ctx.doc()
  const rowOf = () => (id ? ctx.read.entityData(doc(), id) : null)
  const defs = () => Object.fromEntries((ctx.read.docSummary(doc()).components ?? []).map((n) => [n, ctx.read.componentData(doc(), n)]))
  const presetComps = (preset) => presetComponents(ctx.read, doc(), preset)
  const presetGroups = (preset, seen = new Set()) => {
    const p = preset && !seen.has(preset) ? ctx.read.presetData(doc(), preset) : null
    if (!p) return []
    seen.add(preset)
    const bases = Array.isArray(p.extends) ? p.extends : p.extends ? [p.extends] : []
    return [...Object.keys(p.groups ?? {}), ...bases.flatMap((b) => presetGroups(String(b), seen))]
  }
  const write = (ops, msg, opts) => ctx.write(ops, msg, opts)

  function header (row) {
    const presets = ctx.read.docSummary(doc()).presets
    const others = ctx.read.listEntities(doc()).filter((r) => r.id !== row.id && !isDescendant(r.id, row.id))
    const name = h('input', { class: 'name-input', value: row.name, spellcheck: false, title: 'name', onchange: (e) => { const v = e.target.value.trim(); if (v && v !== row.name) write([{ op: 'setName', id: row.id, name: v }], `rename ${row.id}`) } })
    const preset = h('select', { title: 'preset', onchange: (e) => write([{ op: 'define', id: row.id, entity: { preset: e.target.value } }], `preset of ${row.id}`) },
      h('option', { value: '', selected: !row.preset }, '— none —'), ...presets.map((p) => h('option', { value: p, selected: p === row.preset }, p)))
    const parent = h('select', { title: 'parent', onchange: (e) => write([{ op: 'setParent', id: row.id, parent: e.target.value }], `parent of ${row.id}`) },
      h('option', { value: '', selected: !row.parent }, '— scene —'), ...others.map((r) => h('option', { value: r.id, selected: r.id === row.parent }, `${r.name} (${r.id})`)))
    const groupNames = [...new Set(presetGroups(row.preset))].sort()
    const listId = `groups-${row.id}`
    const addGroup = h('input', { placeholder: '+ group', list: listId, spellcheck: false, onchange: (e) => { const g = e.target.value.trim(); if (g) write([{ op: 'addGroup', id: row.id, group: g }], `group ${g}`); e.target.value = '' } })
    const groups = h('div', { class: 'chips' }, ...row.groups.map((g) => h('span', { class: 'chip' }, g, h('button', { class: 'icon', type: 'button', title: `remove group ${g}`, onclick: () => write([{ op: 'removeGroup', id: row.id, group: g }], `ungroup ${g}`) }, '×'))),
      addGroup, h('datalist', { id: listId }, ...groupNames.filter((g) => !row.groups.includes(g)).map((g) => h('option', { value: g }))))
    return h('div', { class: 'insp-head' },
      h('div', { class: 'row' }, name, h('button', { class: 'id small', type: 'button', title: 'copy id', onclick: () => ctx.copy?.(row.id) }, row.id)),
      h('label', { class: 'sf-row' }, h('span', { class: 'sf-label' }, 'preset'), preset),
      h('label', { class: 'sf-row' }, h('span', { class: 'sf-label' }, 'parent'), parent),
      h('div', { class: 'sf-row' }, h('span', { class: 'sf-label' }, 'groups'), groups))
  }

  function isDescendant (candidate, ancestor) {
    const d = doc()
    for (let a = candidate, n = 0; a && n < 64; n++) { if (a === ancestor) return true; a = String(d.entities?.[a]?.parent ?? '') }
    return false
  }

  // owner, pin, hp and intent: refreshed at a few Hz without touching the forms
  function liveBox () {
    const owner = h('span', { class: 'owner' }); const pin = h('span'); const pinBtns = h('span', { class: 'btns' })
    const hp = h('div', { class: 'hp', hidden: true }, h('div', { class: 'bar' }, h('i')), h('span', { class: 'hp-text' }), h('button', { class: 'small', type: 'button', onclick: () => { const r = rowOf(); if (r) write(healOps(r), `heal ${r.id}`) } }, 'heal'))
    const why = h('div', { class: 'why muted' })
    const box = h('div', { class: 'insp-live' }, h('div', { class: 'row' }, owner, pin, pinBtns), hp, why)
    return {
      box,
      update (row) {
        const o = ctx.ownership?.owner(row.id) ?? null
        const name = (p) => (p === ctx.peerId ? 'you' : ctx.presence?.peers?.().get(p)?.info?.name ?? p)
        owner.replaceChildren(o ? h('span', { class: 'owner-dot', style: { background: peerColor(o) } }) : '', o ? `simulated by ${name(o)}` : 'simulated by nobody (no host yet)')
        const held = ctx.ownership?.canGrab?.(row.id)
        pin.textContent = row.owner ? ` · pinned to ${name(row.owner)}${held !== true && held ? ` (${held})` : ''}` : ''
        pinBtns.replaceChildren(
          row.owner === ctx.peerId
            ? h('button', { class: 'small', type: 'button', onclick: () => write(ctx.ownership.unpinOps(row.id), `unpin ${row.id}`) }, 'unpin')
            : h('button', { class: 'small', type: 'button', disabled: held !== true, title: held === true ? 'simulate it here until unpinned' : String(held), onclick: () => { const ops = ctx.ownership.pinOps(row.id); if (ops.length) write(ops, `pin ${row.id}`); else ctx.toast(`Can't pin: ${held}`, 'warn') } }, 'pin to me'))
        const health = row.effective?.health
        hp.hidden = !health
        if (health) {
          const v = ctx.read.hp(health); const max = Number(health.max) || 0
          hp.querySelector('i').style.width = `${max ? Math.round((v / max) * 100) : 0}%`
          hp.querySelector('.hp-text').textContent = `${Math.round(v)} / ${max} hp${row.groups.includes('dead') ? ' · dead' : ''}`
        }
        const ex = ctx.explain?.(row.id)
        const it = ex?.intent
        why.textContent = it ? `doing: ${it.act}${it.target ? ` → ${it.target}` : ''}${it.drive ? ` (${it.drive}${Number.isFinite(it.score) ? ` ${it.score.toFixed(2)}` : ''})` : ''}${ex.sensed ? ` · senses ${ex.sensed}` : ''}` : ''
      },
    }
  }

  function card (row, comp, pcomps, allDefs) {
    const data = row.effective[comp]
    const origin = componentOrigin(row, comp, pcomps)
    const def = allDefs[comp]
    const isOpen = closed.has(comp) ? false : opened.has(comp) || false
    const body = h('div', { class: 'card-body' })
    const btns = h('span', { class: 'btns' },
      origin === 'override' ? h('button', { class: 'small', type: 'button', title: 'drop my override: show the preset value', onclick: (e) => { e.preventDefault(); write(resetComponentOps(row, comp), `reset ${comp}`) } }, 'reset') : null,
      h('button', { class: 'icon', type: 'button', title: `remove ${comp}`, onclick: (e) => { e.preventDefault(); write(removeComponentOps(row, comp, pcomps), `remove ${comp}`) } }, '🗑'))
    const sum = h('summary', { title: def?.description ?? '' }, h('span', { class: 'comp-name' }, comp), h('span', { class: `badge ${origin}` }, origin), btns)
    const d = h('details', { class: `card comp-${comp}`, open: isOpen, dataset: { comp } }, sum, body)
    d.addEventListener('toggle', () => { if (d.open) { opened.add(comp); closed.delete(comp) } else { closed.add(comp); opened.delete(comp) } })
    const onPatch = (path, value, { live } = {}) => {
      const r = rowOf(); if (!r) return
      write(editOps({ row: r, comp, path, value, doc: doc(), moveOps }), `${comp}.${path.join('.')}`, { key: `${r.id}/${comp}/${path.join('.')}`, live })
    }
    if (comp === 'representation') {
      const kind = String(data?.kind ?? '')
      const sw = renderKindSwitcher(ctx.kinds ?? {}, data, (target) => {
        const r = rowOf(); if (!r) return
        write([switchKindOps(r.id, r.effective.representation, target, ctx.kinds, { inherited: presetComps(r.preset).representation ?? {} })], `look ${kind} → ${target}`)
      })
      const form = h('div')
      const { kind: _k, ...fields } = data ?? {} // kind belongs to the switcher, not the form
      renderForm(form, { schema: representationSchema(def?.schema, ctx.kinds, kind), value: fields, onPatch })
      body.append(h('label', { class: 'sf-row' }, h('span', { class: 'sf-label' }, 'kind'), sw), form)
      if (kind && ctx.kinds && !ctx.kinds[kind]) body.append(h('div', { class: 'warn' }, `no renderer registered for kind "${kind}"`))
    } else {
      const form = h('div')
      renderForm(form, { schema: def?.schema, value: data, onPatch })
      body.append(form)
    }
    return d
  }

  function full () {
    const row = rowOf()
    cards = new Map()
    if (!row) { parts = null; el.replaceChildren(empty); return }
    const pc = presetComps(row.preset)
    const allDefs = defs()
    const live = liveBox()
    const list = h('div', { class: 'cards' })
    for (const comp of sortComponents(Object.keys(row.effective), allDefs)) {
      const c = card(row, comp, pc, allDefs)
      cards.set(comp, { el: c, json: json(row.effective[comp]) })
      list.append(c)
    }
    const missing = Object.keys(allDefs).filter((n) => !(n in row.effective)).sort()
    const add = h('select', { class: 'add-comp', onchange: (e) => { const n = e.target.value; if (n) write(addComponentOps(row.id, n, allDefs[n]), `add ${n}`); e.target.value = '' } },
      h('option', { value: '' }, '+ add component…'), ...missing.map((n) => h('option', { value: n, title: allDefs[n]?.description ?? '' }, n)))
    const head = header(row)
    parts = { head, live, list, headJson: json([row.name, row.preset, row.parent, row.groups, row.owner]) }
    el.replaceChildren(head, live.box, list, add)
    live.update(row)
  }

  // catch up on whatever changed; a card that holds focus waits for blur
  function update () {
    if (!id || !parts) return full()
    const row = rowOf()
    if (!row) return full()
    dirty = false
    const names = Object.keys(row.effective)
    const headJson = json([row.name, row.preset, row.parent, row.groups, row.owner])
    if (headJson !== parts.headJson || names.length !== cards.size || names.some((n) => !cards.has(n))) {
      if (hasFocusWithin(el)) { dirty = true; return }
      return full()
    }
    const pc = presetComps(row.preset)
    const allDefs = defs()
    for (const n of names) {
      const j = json(row.effective[n])
      const c = cards.get(n)
      if (c.json === j) continue
      if (hasFocusWithin(c.el)) { dirty = true; continue } // that card catches up on blur
      const fresh = card(row, n, pc, allDefs)
      c.el.replaceWith(fresh)
      cards.set(n, { el: fresh, json: j })
    }
    parts.live.update(row)
  }

  el.addEventListener('focusout', () => setTimeout(() => { if (dirty && !hasFocusWithin(el)) update() }, 0))
  full()

  return {
    el,
    get id () { return id },
    select (next) { if (next === id) return; id = next ?? null; full() },
    update,
    refreshLive () { if (!id || !parts) return; const row = rowOf(); if (!row) { full(); return } parts.live.update(row) },
  }
}
