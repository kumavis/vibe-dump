// "Your worlds" (design §18.1): the worlds this browser has opened, newest
// first, in localStorage['mm:worlds'] as JSON [{ docUrl, key, view, sync, title, at }].
// Written only by the app on open / create and on a title change. Forget drops
// an entry and nothing else: the document stays in IndexedDB and on the sync
// server. Every storage access is guarded (a private window, blocked site data
// or a full quota make the list empty or read-only, never an exception), and
// callers render titles with textContent only.
import { normalizeDocUrl, DEFAULT_SYNC } from './link.js'

export const RECENT_KEY = 'mm:worlds'
export const RECENT_MAX = 50
const MAX_TITLE = 200
const MAX_FIELD = 2048

const str = (v, max = MAX_FIELD) => (typeof v === 'string' ? v.slice(0, max) : v == null ? '' : String(v).slice(0, max))

// one stored entry -> a clean plain entry, or null when it names no doc
export function cleanEntry (e) {
  if (!e || typeof e !== 'object') return null
  const docUrl = normalizeDocUrl(e.docUrl)
  if (!docUrl) return null
  const at = Number(e.at)
  return {
    docUrl,
    key: str(e.key),
    view: str(e.view),
    sync: str(e.sync) || DEFAULT_SYNC,
    title: str(e.title, MAX_TITLE),
    at: Number.isFinite(at) ? at : 0,
  }
}

const defaultStorage = () => { try { return globalThis.localStorage ?? null } catch { return null } }

// recentWorlds(storage) -> { list, upsert, touch, forget, clear }
// `now` is injectable for tests.
export function recentWorlds (storage = defaultStorage(), { now = () => Date.now(), max = RECENT_MAX } = {}) {
  const load = () => {
    let raw = null
    try { raw = storage?.getItem(RECENT_KEY) ?? null } catch { return [] }
    if (!raw) return []
    let arr
    try { arr = JSON.parse(raw) } catch { return [] }
    if (!Array.isArray(arr)) return []
    const seen = new Set(); const out = []
    for (const x of arr) {
      const e = cleanEntry(x)
      if (!e || seen.has(e.docUrl)) continue
      seen.add(e.docUrl); out.push(e)
    }
    return sortNewest(out).slice(0, max)
  }
  const save = (list) => {
    if (!storage) return false
    try { storage.setItem(RECENT_KEY, JSON.stringify(sortNewest(list).slice(0, max))); return true } catch { return false }
  }
  return {
    list: () => load(),
    // add or refresh one world (dedupe by doc). A field given empty keeps what
    // was stored: opening a view link of a world never drops its stored key.
    upsert (entry = {}) {
      const docUrl = normalizeDocUrl(entry.docUrl)
      if (!docUrl) return null
      const list = load()
      const i = list.findIndex((e) => e.docUrl === docUrl)
      const old = i >= 0 ? list[i] : null
      const pick = (f) => (str(entry[f]) || old?.[f] || '')
      const e = cleanEntry({ docUrl, key: pick('key'), view: pick('view'), sync: str(entry.sync) || old?.sync || DEFAULT_SYNC, title: entry.title != null ? str(entry.title, MAX_TITLE) : old?.title ?? '', at: now() })
      if (i >= 0) list.splice(i, 1)
      list.unshift(e)
      return save(list) ? { ...e } : null
    },
    // the world is open and its title moved: refresh the entry (never creates one)
    touch (docUrl, { title } = {}) {
      const d = normalizeDocUrl(docUrl)
      const list = load()
      const e = list.find((x) => x.docUrl === d)
      if (!e) return null
      if (title != null) e.title = str(title, MAX_TITLE)
      e.at = now()
      return save(list) ? { ...e } : null
    },
    forget (docUrl) {
      const d = normalizeDocUrl(docUrl)
      const list = load()
      const next = list.filter((x) => x.docUrl !== d)
      if (next.length === list.length) return false
      return save(next)
    },
    clear () { if (!storage) return false; try { storage.removeItem(RECENT_KEY); return true } catch { return false } },
  }
}

function sortNewest (list) {
  return list.sort((a, b) => b.at - a.at)
}
