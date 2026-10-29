// World tab: title, bounds, ground / sky colour, built-in and doc systems
// switched off for everyone (world.disabledSystems), doc stats and a version link.
import { h, hasFocusWithin } from './dom.js'

// ctx: { doc(), read, write, builtinSystems(), share, copy, toast }
export function makeWorldPanel (ctx) {
  const el = h('div', { class: 'world' })
  function render () {
    if (hasFocusWithin(el)) return
    const s = ctx.read.docSummary(ctx.doc())
    const w = s.world ?? {}
    const disabled = w.disabledSystems ?? {}
    const names = [...new Set([...(ctx.builtinSystems?.() ?? []), ...s.systems.map((x) => x.name)])]
    const row = (label, input) => h('label', { class: 'sf-row' }, h('span', { class: 'sf-label' }, label), input)
    el.replaceChildren(
      row('title', h('input', { value: s.title, spellcheck: false, onchange: (e) => ctx.write([{ op: 'setMeta', patch: { title: e.target.value.trim() || 'Merge Meadow' } }], 'rename world') })),
      row('bounds (m)', h('input', { type: 'number', min: 5, max: 2000, step: 1, value: w.bounds ?? 40, onchange: (e) => { const v = Number(e.target.value); if (v >= 5 && v <= 2000) ctx.write([{ op: 'setWorld', patch: { bounds: v } }], 'bounds') } })),
      row('ground', h('input', { type: 'color', value: w.ground?.color ?? '#7fb069', onchange: (e) => ctx.write([{ op: 'setWorld', patch: { ground: { color: e.target.value } } }], 'ground colour') })),
      row('sky', h('input', { type: 'color', value: w.sky?.color ?? '#a8d8ff', onchange: (e) => ctx.write([{ op: 'setWorld', patch: { sky: { color: e.target.value } } }], 'sky colour') })),
      h('h4', null, 'Systems on for everyone'),
      h('p', { class: 'muted' }, 'Untick to switch a system off in every peer (a doc system with the same order can replace it).'),
      h('div', { class: 'checks' }, ...names.map((n) => h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: !disabled[n], onchange: (e) => ctx.write([{ op: 'setWorld', patch: { disabledSystems: { [n]: e.target.checked ? null : true } } }], `${e.target.checked ? 'enable' : 'disable'} ${n}`) }), n))),
      h('h4', null, 'This doc'),
      h('div', { class: 'stats muted' }, `${s.entities} entities · ${s.presets.length} presets · ${s.components.length} component types · ${s.systems.length} doc systems`),
      h('div', { class: 'row btns' },
        h('button', { class: 'small', type: 'button', title: 'a read-only view of the world as it is now', onclick: async () => { const ok = await ctx.copy(ctx.share.versionLink()); ctx.toast(ok ? 'Version link copied (read-only view)' : 'Copy failed', ok ? 'info' : 'warn') } }, 'copy version link')),
      // CC-BY 4.0 attribution for the bundled fallback glyphs (src/render/emoji/LICENSE.md)
      h('p', { class: 'muted credits' }, 'Emoji fallback art: ', h('a', { href: 'https://github.com/jdecked/twemoji', target: '_blank', rel: 'noopener' }, 'Twemoji'),
        ' © Twitter, Inc., jdecked and other contributors, ', h('a', { href: 'https://creativecommons.org/licenses/by/4.0/', target: '_blank', rel: 'noopener' }, 'CC-BY 4.0'), '.'))
  }
  return { el, render }
}
