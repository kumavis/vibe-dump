// Cache API materializer and loader for the extracted tree.
//
// Layout (ARCHITECTURE.md, "Runtime URL and path layout"):
//   cache name   cc-app-<version>
//   tree         <appUrl><rel>       appUrl = BASE + 'vfs/app/', rel = name minus "/$bunfs/root/"
//   manifest     <appUrl>../manifest.json   (= BASE + 'vfs/manifest.json', outside
//                the served tree), written LAST, so its presence means "complete"
//
// Browser-only at runtime (CacheStorage); every function takes an injectable
// `caches` so Node tests can pass memory-caches.js instead.

import { treeSha256 } from './hash.js'
import { BUNFS_ROOT, rootRelative } from './bunfs.js'

export const MANIFEST_FORMAT = 1
/** Native addons cannot load in a browser; the port excludes them too (unhare -x '*.node'). */
export const DEFAULT_EXCLUDE = [/\.node$/]

export class CacheIncompleteError extends Error {
  constructor (message, missing) { super(message); this.name = 'CacheIncompleteError'; this.missing = missing }
}

export const cacheName = (version) => `cc-app-${version}`

/**
 * public/sw.js keeps the JavaScript it has rewritten for serving in
 * companion caches (cc-sw<N>-<version>); they must go whenever
 * cc-app-<version> is rewritten or cleared, or stale modules would be served.
 */
async function deleteCompanions (c, version) {
  const suffix = `-${version}`
  const names = (await c.keys()).filter((n) => n.startsWith('cc-sw') && (!version || n.endsWith(suffix)))
  await Promise.all(names.map((n) => c.delete(n)))
}

/**
 * BASE/vfs/app/ derived from the current PAGE location (BASE = the page's
 * directory). In a Worker, location is the worker script's URL, so pass
 * appUrl explicitly there (or read it from the manifest).
 */
export function defaultAppUrl () {
  if (typeof location === 'undefined') throw new Error('appUrl is required outside a browser')
  if (typeof document === 'undefined') throw new Error('appUrl is required in a Worker (location is the worker script, not BASE)')
  return new URL('vfs/app/', new URL('.', location.href)).href
}

function normAppUrl (appUrl) {
  const u = new URL(appUrl ?? defaultAppUrl())
  if (!u.pathname.endsWith('/')) u.pathname += '/'
  u.search = ''
  u.hash = ''
  return u.href
}

export const manifestUrl = (appUrl) => new URL('../manifest.json', normAppUrl(appUrl)).href

function getCaches (caches) {
  const c = caches ?? globalThis.caches
  if (!c) throw new Error('the Cache API is not available here (it needs a secure context: https or localhost)')
  return c
}

/** content-type the service worker can pass through. */
export function contentTypeFor (rel) {
  if (rel === 'cli' || rel.endsWith('/cli') || /\.(m?js|cjs)$/.test(rel)) return 'text/javascript; charset=utf-8'
  if (rel.endsWith('.json')) return 'application/json'
  if (rel.endsWith('.md')) return 'text/markdown; charset=utf-8'
  if (rel.endsWith('.txt')) return 'text/plain; charset=utf-8'
  if (rel.endsWith('.zst')) return 'application/zstd'
  return 'application/octet-stream'
}

async function runPool (items, concurrency, fn) {
  let next = 0
  const worker = async () => { while (next < items.length) { const i = next++; await fn(items[i], i) } }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
}

/**
 * Write the (rewritten) tree into cc-app-<version> and return its manifest.
 * Any earlier cache of that name is deleted first, so a half-written attempt
 * never survives: the manifest is the last entry put.
 *
 * @param {Map<string, {bytes: Uint8Array}>} files  "/$bunfs/root/..." -> file
 * @param {object} opts
 * @param {string} opts.version
 * @param {string} [opts.appUrl]   absolute URL of BASE/vfs/app/ (default: from location)
 * @param {string} [opts.entry]    "/$bunfs/root/cli" by default
 * @param {RegExp[]} [opts.exclude] relative paths not written (default: *.node)
 * @param {object} [opts.extra]    merged into the manifest (rewrite report, source info)
 * @param {CacheStorage} [opts.caches]
 * @param {(p: {phase: 'cache', done: number, total: number}) => void} [opts.onProgress]
 * @returns {Promise<object>} manifest {format, complete, version, sha256, entry, entryUrl,
 *   appUrl, appPath, cacheName, files, paths[], bytes, excluded[], skipped[], createdAt, ...extra}
 */
export async function materialize (files, opts = {}) {
  const { version, entry = BUNFS_ROOT + 'cli', exclude = DEFAULT_EXCLUDE, extra = {}, onProgress, concurrency = 16 } = opts
  if (!version) throw new TypeError('materialize: version is required')
  const caches = getCaches(opts.caches)
  const appUrl = normAppUrl(opts.appUrl)
  const name = cacheName(version)

  const entries = []
  const excluded = []
  const skipped = []
  for (const [vname, f] of files) {
    const rel = rootRelative(vname)
    if (rel == null) { skipped.push(vname); continue }
    if (exclude.some((re) => re.test(rel))) { excluded.push(rel); continue }
    entries.push([rel, f.bytes])
  }
  const entryRel = rootRelative(entry)
  if (!entries.some(([rel]) => rel === entryRel)) throw new Error(`materialize: entry ${entry} is not in the tree`)

  await caches.delete(name)
  await deleteCompanions(caches, version)
  const cache = await caches.open(name)
  let done = 0
  let bytes = 0
  await runPool(entries, concurrency, async ([rel, b]) => {
    // new Response(bytes) copies the bytes (Fetch "extract a body"), so the
    // cache holds no view into the 294 MB binary.
    await cache.put(new URL(rel, appUrl).href, new Response(b, {
      headers: { 'content-type': contentTypeFor(rel), 'content-length': String(b.length) }
    }))
    bytes += b.length
    done++
    if (onProgress && (done % 64 === 0 || done === entries.length)) onProgress({ phase: 'cache', done, total: entries.length })
  })

  const { sha256 } = await treeSha256(entries)
  const paths = entries.map(([rel]) => rel).sort()
  const manifest = {
    format: MANIFEST_FORMAT,
    complete: true,
    version,
    sha256, // treeSha256 of exactly what is cached (post-rewrite), names relative to appUrl
    entry: entryRel,
    entryUrl: new URL(entryRel, appUrl).href,
    appUrl,
    appPath: new URL(appUrl).pathname,
    cacheName: name,
    files: paths.length,
    paths,
    bytes,
    excluded,
    skipped,
    createdAt: new Date().toISOString(),
    ...extra
  }
  await cache.put(manifestUrl(appUrl), new Response(JSON.stringify(manifest), {
    headers: { 'content-type': 'application/json' }
  }))
  return manifest
}

/**
 * The manifest of a complete cached extraction of `version`, or null.
 * With `appUrl`, a cache written for a different app URL (the rewritten
 * paths would be wrong) also counts as absent. `accept(manifest)` lets the
 * caller add checks (e.g. the rewrite-set fingerprint).
 */
export async function loadCachedManifest (version, { appUrl, caches, accept } = {}) {
  let c
  try { c = getCaches(caches) } catch { return null }
  const name = cacheName(version)
  if (!(await c.has(name))) return null // probe without creating an empty cache
  const cache = await c.open(name)
  let res
  if (appUrl) {
    res = await cache.match(manifestUrl(appUrl))
  } else {
    const key = (await cache.keys()).find((r) => new URL(r.url).pathname.endsWith('/vfs/manifest.json'))
    res = key && await cache.match(key)
  }
  if (!res) return null
  let m
  try { m = await res.json() } catch { return null }
  if (!m || m.format !== MANIFEST_FORMAT || m.complete !== true || m.version !== version) return null
  if (appUrl && m.appUrl !== normAppUrl(appUrl)) return null
  if (accept && !accept(m)) return null
  return m
}

/**
 * Read the cached tree back (for mounting into the VFS in the Worker).
 * @returns {Promise<Map<string, Uint8Array>>} keyed by VFS path: manifest.appPath + rel
 * @throws CacheIncompleteError when entries were evicted; re-extract then.
 */
export async function loadCachedFiles (manifest, { caches, concurrency = 32 } = {}) {
  const cache = await getCaches(caches).open(manifest.cacheName)
  const out = new Map()
  const missing = []
  await runPool(manifest.paths, concurrency, async (rel) => {
    const res = await cache.match(new URL(rel, manifest.appUrl).href)
    if (!res) { missing.push(rel); return }
    out.set(manifest.appPath + rel, new Uint8Array(await res.arrayBuffer()))
  })
  if (missing.length) throw new CacheIncompleteError(`${missing.length} cached files are missing (first: ${missing[0]})`, missing)
  return out
}

/** Remove cached extractions; all versions unless one is given. */
export async function clearCache (version, { caches } = {}) {
  const c = getCaches(caches)
  await deleteCompanions(c, version)
  if (version) return c.delete(cacheName(version))
  const names = (await c.keys()).filter((n) => n.startsWith('cc-app-'))
  await Promise.all(names.map((n) => c.delete(n)))
  return names.length > 0
}
