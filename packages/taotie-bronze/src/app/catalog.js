// The artifact catalog, loaded lazily. src/artifacts/index.js stays the one
// registry (one static re-export line per artifact, edited by the vessel
// engineers); the app reads WHICH files it names from its source text and
// imports each module on demand, so every artifact is its own chunk and first
// paint needs only the app shell and the first vessel.
//
// Convention this relies on: an artifact's file is named after its id
// (houmuwu-ding.js → 'houmuwu-ding'). A module whose id differs still works,
// it is just found by id only after it has loaded.

import registrySource from '../artifacts/index.js?raw'

// Underscore files are studies (not registered); index.js is the registry itself.
const LOADERS = import.meta.glob(['../artifacts/*.js', '!../artifacts/_*.js', '!../artifacts/index.js'], { import: 'default' })

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.title).localeCompare(String(b.title))

export function createCatalog() {
  const files = [...registrySource.matchAll(/^\s*export\s*\{\s*default\s+as\s+\w+\s*\}\s*from\s*['"]\.\/([^'"]+\.js)['"]/gm)].map((m) => m[1])
  const entries = []
  for (const file of files) {
    const loader = LOADERS['../artifacts/' + file]
    if (!loader) {
      console.warn(`[taotie] ${file} is registered but not lazily loadable (study files starting with "_" are skipped)`)
      continue
    }
    entries.push({ file, id: file.replace(/\.js$/, ''), loader, artifact: null, promise: null })
  }
  // ids in registry order until the modules arrive, then sorted by `order` (in place:
  // window.__taotie.artifacts is this same array)
  const ids = entries.map((e) => e.id)
  const listeners = new Set()
  let all = null

  const find = (id) => entries.find((e) => e.id === id || e.artifact?.id === id)

  function load(entry) {
    entry.promise ??= entry.loader().then((a) => {
      entry.artifact = a
      if (a?.id && a.id !== entry.id) {
        ids[ids.indexOf(entry.id)] = a.id
        entry.id = a.id
      }
      for (const l of listeners) l(a)
      return a
    })
    return entry.promise
  }

  function loadAll() {
    all ??= Promise.all(entries.map((e) => load(e))).then(() => {
      const sorted = entries.map((e) => e.artifact).sort(byOrder)
      ids.splice(0, ids.length, ...sorted.map((a) => a.id))
      return sorted
    })
    return all
  }

  return {
    ids,
    /** Artifacts loaded so far, sorted by order. */
    get loaded() {
      return entries.filter((e) => e.artifact).map((e) => e.artifact).sort(byOrder)
    },
    has: (id) => !!find(id),
    get: (id) => find(id)?.artifact || null,
    /** → Promise<artifact> (null for an unknown id). */
    async load(id) {
      const e = find(id)
      if (e) return load(e)
      await loadAll()
      return find(id)?.artifact || null
    },
    loadAll,
    /** The default first vessel: the lowest `order` — needs every module's metadata. */
    async first() {
      return (await loadAll())[0]
    },
    onLoad(fn) {
      listeners.add(fn)
    },
  }
}
