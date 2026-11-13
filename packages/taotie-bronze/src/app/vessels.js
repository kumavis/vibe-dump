// Vessels tab: artifact list, object label, asynchronous builds with a small
// LRU cache. A built vessel is a few hundred thousand vertices plus several
// relief textures, so only the last few are kept and the rest are disposed.

import * as kit from '../kit/index.js'
import { el, yieldToBrowser } from './ui.js'

const CACHE_MAX = 3

export function createVessels({ stage, artifacts, quality, progress, listEl, labelEl, onShown }) {
  const cache = new Map() // id → Promise<result>
  let current = null // { artifact, result }
  let token = 0
  let timings = {}

  // --- list
  const buttons = new Map()
  for (const a of artifacts) {
    const b = el('button', { type: 'button', onclick: () => show(a.id) }, el('span', { text: a.title }), el('small', { text: a.titleZh || '' }))
    buttons.set(a.id, b)
    listEl.append(b)
  }
  if (artifacts.length < 2) listEl.classList.add('single')

  function label(a) {
    const dims = a.dimensions || {}
    const cm = (v) => (v / 10).toFixed(1)
    const dimText = ['h', 'w', 'd'].filter((k) => dims[k]).map((k) => `${k.toUpperCase()} ${cm(dims[k])}`).join(' · ') + (Object.keys(dims).length ? ' cm' : '')
    const row = (k, v) => (v ? el('div', {}, el('span', { class: 'k', text: k }), v) : null)
    labelEl.replaceChildren(
      a.titleZh ? el('div', { class: 'zh', text: a.titleZh }) : null,
      el('h1', { text: a.title }),
      el('div', { class: 'meta' },
        row('date', [a.date, a.period].filter(Boolean).join(' · ')),
        row('findspot', a.findspot),
        row('size', dimText),
        row('collection', [a.collection, a.accession].filter(Boolean).join(', ')),
      ),
      a.blurb ? el('hr') : null,
      a.blurb ? el('p', { text: a.blurb }) : null,
    )
  }

  function build(a) {
    if (cache.has(a.id)) {
      const p = cache.get(a.id)
      cache.delete(a.id) // refresh LRU order
      cache.set(a.id, p)
      return p
    }
    const t0 = performance.now()
    const p = (async () => {
      const result = await a.build(kit, {
        quality,
        onProgress: async (f, what) => {
          progress.set(f, what)
          await yieldToBrowser()
        },
      })
      result.object.userData.artifact = a.id
      result.object.traverse((o) => {
        if (o.isMesh) o.castShadow = o.receiveShadow = true
      })
      timings[a.id] = Math.round(performance.now() - t0)
      return result
    })()
    cache.set(a.id, p)
    while (cache.size > CACHE_MAX) {
      const [oldId, old] = cache.entries().next().value
      cache.delete(oldId)
      old.then((r) => {
        if (current?.result !== r) disposeResult(r)
      })
    }
    return p
  }

  /** Show an artifact; resolves once it is on stage (not yet rendered). */
  async function show(id, { view } = {}) {
    const a = artifacts.find((x) => x.id === id) || artifacts[0]
    const my = ++token
    for (const [bid, b] of buttons) b.classList.toggle('on', bid === a.id)
    label(a)
    document.documentElement.dataset.ready = '0'
    progress.start(a.title)
    const result = await build(a)
    if (my !== token) return null
    progress.done()
    current = { artifact: a, result }
    stage.setContent(result.object, { rig: 'vitrine' })
    const views = Object.keys(a.views || {})
    const v = view && a.views?.[view] ? view : views[0]
    stage.setView(a.views?.[v] || {})
    onShown?.(a, v)
    return current
  }

  return {
    show,
    get current() {
      return current
    },
    timings,
    setView(name) {
      const a = current?.artifact
      if (a?.views?.[name]) stage.setView(a.views[name])
    },
  }
}

export function disposeResult(r) {
  r.object.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose()
      const ms = Array.isArray(o.material) ? o.material : [o.material]
      for (const m of ms) m.dispose()
    }
  })
  for (const p of Object.values(r.panels || {})) p.dispose?.()
}
