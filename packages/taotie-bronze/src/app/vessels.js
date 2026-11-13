// Vessels tab: the switcher (title + collection), the object label card, and
// lazy, cancellable-by-supersession builds. A vessel is built the first time it
// is shown. A built vessel is a few hundred thousand vertices plus several
// relief textures, so only `cacheMax` are kept (1 on a phone: switching
// disposes the previous one's geometries and textures, memory stays flat).

import * as kit from '../kit/index.js'
import { el, yieldToBrowser } from './ui.js'
import { meshStatsText } from './hooks.js'

const cm = (mm) => {
  const v = mm / 10
  return (v >= 100 ? Math.round(v) : Math.round(v * 10) / 10).toString()
}
/** "The Metropolitan Museum of Art, New York — Purchase, …" → the institution and city. */
export const shortCollection = (a) => String(a.collection || '').split(/\s+—\s+|\s+-\s+/)[0]
const knownAccession = (s) => s && !/^(unknown|not published|n\/a|none)$/i.test(String(s).trim())
export const isTestPiece = (a) => (a.order ?? 0) >= 90

export function createVessels({ stage, catalog, quality, cacheMax = 2, progress, listEl, labelEl, onShown, onPick }) {
  const cache = new Map() // id → { promise, result? }
  let current = null // { artifact, result }
  let token = 0
  let building = null // id being built for the current request
  const timings = {}
  let labelOpen = false
  let requested = null
  let q = quality
  let onLayout = null

  // ------------------------------------------------------------- switcher
  const rows = new Map() // id → { btn, sub }
  function renderList() {
    const arts = catalog.loaded
    const pending = catalog.ids.filter((id) => !catalog.get(id))
    listEl.replaceChildren()
    let sep = false
    for (const a of arts) {
      if (isTestPiece(a) && !sep) {
        sep = true
        listEl.append(el('li', { class: 'sep', 'aria-hidden': 'true' }, el('span', { class: 'cap', text: 'Kit test piece' })))
      }
      const sub = el('span', { class: 'v-sub' })
      const btn = el(
        'button',
        { type: 'button', class: 'vessel', 'data-id': a.id, onclick: () => onPick(a.id) },
        el('span', { class: 'v-line' }, el('span', { class: 'v-title', text: a.title }), a.titleZh ? el('span', { class: 'v-zh', lang: 'zh-Hans', text: a.titleZh }) : null),
        sub,
      )
      rows.set(a.id, { btn, sub, a })
      listEl.append(el('li', {}, btn))
      setSub(a.id)
    }
    for (const id of pending) listEl.append(el('li', { class: 'pending' }, el('span', { class: 'v-title', text: id.replace(/-/g, ' ') })))
    markCurrent()
  }
  function setSub(id, text) {
    const r = rows.get(id)
    if (!r) return
    const a = r.a
    const acc = knownAccession(a.accession) && String(a.accession).length <= 18 ? ' · ' + a.accession : ''
    r.sub.textContent = text ?? (isTestPiece(a) ? 'Procedural · not an excavated object' : shortCollection(a) + acc)
    r.sub.classList.toggle('busy', text != null)
  }
  function markCurrent() {
    const id = current?.artifact.id ?? requested
    for (const [rid, r] of rows) {
      if (rid === id) r.btn.setAttribute('aria-current', 'true')
      else r.btn.removeAttribute('aria-current')
    }
  }
  catalog.onLoad(() => renderList())
  renderList()

  // ---------------------------------------------------------------- label
  function label(a) {
    const dims = a.dimensions || {}
    const dimText = ['h', 'w', 'd'].filter((k) => dims[k]).map((k) => `${k.toUpperCase()} ${cm(dims[k])}`).join(' × ') + (Object.keys(dims).length ? ' cm' : '')
    const row = (k, v) => (v ? el('div', { class: 'row' }, el('dt', { text: k }), el('dd', { text: v })) : null)
    const head = el(
      'button',
      { type: 'button', class: 'label-head', 'aria-expanded': String(labelOpen), 'aria-controls': 'label-body', onclick: () => setLabelOpen(!labelOpen) },
      a.titleZh ? el('span', { class: 'zh', lang: 'zh-Hans', text: a.titleZh }) : null,
      el('span', { class: 'title', text: a.title }),
      el('span', { class: 'line', text: [a.date, shortCollection(a)].filter(Boolean).join(' · ') }),
      el('span', { class: 'status', 'aria-live': 'polite' }),
      el('span', { class: 'more', 'aria-hidden': 'true' }),
    )
    labelEl.replaceChildren(
      head,
      el(
        'div',
        { class: 'label-body', id: 'label-body' },
        el(
          'dl',
          { class: 'meta' },
          row('Date', a.date),
          row('Period', a.period),
          row('Findspot', a.findspot),
          row('Collection', a.collection),
          row('Accession', knownAccession(a.accession) ? a.accession : a.accession ? 'not published' : null),
          row('Size', dimText),
          // polygon count of the mesh actually on stage; filled in by show() once the vessel is built
          el('div', { class: 'row mesh-row', hidden: true }, el('dt', { text: 'Mesh' }), el('dd', { class: 'mesh' })),
        ),
        a.blurb ? el('p', { class: 'blurb', text: a.blurb }) : null,
        isTestPiece(a) ? el('p', { class: 'note', text: 'A procedural test piece for the Taotie Kit — not a copy of any one object.' }) : null,
      ),
    )
    labelEl.classList.toggle('open', labelOpen)
  }
  function setLabelOpen(on) {
    labelOpen = on
    labelEl.classList.toggle('open', on)
    labelEl.querySelector('.label-head')?.setAttribute('aria-expanded', String(on))
    onLayout?.()
  }
  function setStatus(text) {
    const s = labelEl.querySelector('.status')
    if (s) s.textContent = text || ''
    labelEl.classList.toggle('busy', !!text)
  }

  // ---------------------------------------------------------------- build
  function evict(keep) {
    for (const [id, c] of cache) {
      if (cache.size <= cacheMax) break
      if (id === keep || !c.result || current?.result === c.result) continue
      cache.delete(id)
      disposeResult(c.result)
    }
  }

  function build(a) {
    const hit = cache.get(a.id)
    if (hit) {
      cache.delete(a.id) // refresh LRU order
      cache.set(a.id, hit)
      return hit.promise
    }
    const t0 = performance.now()
    const entry = {}
    entry.promise = (async () => {
      const result = await a.build(kit, {
        quality: q,
        onProgress: async (f, what) => {
          if (building === a.id) {
            const pct = Math.round(Math.max(0, Math.min(1, f)) * 100)
            progress.set(f, what)
            setStatus(`Casting${what ? ' · ' + what : ''} — ${pct}%`)
            setSub(a.id, `casting · ${pct}%`)
          }
          await yieldToBrowser()
        },
      })
      result.object.userData.artifact = a.id
      result.object.traverse((o) => {
        if (o.isMesh) o.castShadow = o.receiveShadow = true
      })
      timings[a.id] = Math.round(performance.now() - t0)
      entry.result = result
      return result
    })()
    entry.promise.catch(() => cache.delete(a.id))
    cache.set(a.id, entry)
    return entry.promise
  }

  /** Show an artifact; resolves once it is on stage (not yet rendered), null if superseded. */
  async function show(id, { view } = {}) {
    const my = ++token
    requested = id
    markCurrent()
    const a = await catalog.load(id)
    if (my !== token) return null
    if (!a) throw new Error(`unknown artifact "${id}"`)
    requested = a.id
    markCurrent()
    label(a)
    document.documentElement.dataset.ready = '0'
    const cached = cache.get(a.id)?.result
    if (!cached) {
      building = a.id
      progress.start(a.title)
      setStatus('Casting…')
      setSub(a.id, 'casting…')
    }
    let result
    try {
      result = await build(a)
    } catch (e) {
      if (my === token) {
        progress.done()
        setStatus('This vessel could not be built.')
        setSub(a.id)
      }
      throw e
    }
    if (building === a.id) building = null
    setSub(a.id)
    if (my !== token) return null
    progress.done()
    setStatus('')
    const prev = current
    current = { artifact: a, result }
    stage.setContent(result.object, { rig: 'vitrine' })
    const meshRow = labelEl.querySelector('.mesh-row')
    if (meshRow) {
      meshRow.querySelector('.mesh').textContent = meshStatsText(result.object)
      meshRow.hidden = false
    }
    markCurrent()
    evict(a.id)
    if (prev && prev.result !== result && cache.get(prev.artifact.id)?.result !== prev.result) disposeResult(prev.result)
    const views = Object.keys(a.views || {})
    const v = view && a.views?.[view] ? view : views[0]
    stage.setView(a.views?.[v] || {})
    onShown?.(a, v)
    return current
  }

  return {
    show,
    renderList,
    get current() {
      return current
    },
    get requested() {
      return requested
    },
    get quality() {
      return q
    },
    timings,
    setView(name) {
      const a = current?.artifact
      if (a?.views?.[name]) stage.setView(a.views[name])
    },
    setLabelOpen,
    get labelOpen() {
      return labelOpen
    },
    set onLayout(fn) {
      onLayout = fn
    },
    /** New build quality: every cached vessel is dropped; the caller re-shows the current one. */
    setQuality(nq) {
      q = nq
      for (const [id, c] of cache) {
        if (c.result && c.result !== current?.result) disposeResult(c.result)
        cache.delete(id)
      }
    },
  }
}

/** Free a built vessel's GPU memory: geometries, materials, relief textures. */
export function disposeResult(r) {
  if (!r || r.disposed) return
  r.disposed = true
  const reliefs = new Set(Object.values(r.panels || {}))
  r.object.traverse((o) => {
    if (!o.isMesh && !o.isLine && !o.isPoints) return
    o.geometry?.dispose()
    const ms = Array.isArray(o.material) ? o.material : [o.material]
    for (const m of ms) {
      if (!m) continue
      if (m.relief) reliefs.add(m.relief)
      for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'bumpMap', 'displacementMap', 'emissiveMap']) m[k]?.dispose?.()
      m.dispose()
    }
  })
  for (const p of reliefs) p?.dispose?.()
}
