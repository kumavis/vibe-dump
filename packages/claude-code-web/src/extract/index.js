// Track A public API: get Claude Code's JavaScript out of the official
// executable (or its npm tarball), apply the mechanical loader rewrites, and
// cache the result for the service worker and the Worker's VFS.
//
//   let manifest = await loadCurrentManifest()        // null: not cached yet (or stale)
//   if (!manifest) {
//     const res = await fetch(npmTarballUrl())        // or a dropped File
//     manifest = await extractFromBinary(res, { source: 'npm', onProgress })
//   }
//   const tree = await loadCachedFiles(manifest)      // in the Worker: VFS path -> bytes

import { readTarballEntries } from './tar.js'
import { findBunPayload, parseBunfs, detectVersion, rootRelative, BUNFS_PREFIX } from './bunfs.js'
import { bootGraph } from '../runtime/boot/module-graph.js'
import { applyRewrites, rewritesId, RewriteDriftError } from './apply-rewrites.js'
import { materialize, loadCachedManifest, defaultAppUrl } from './cache.js'
import { treeSha256, sha256Hex } from './hash.js'
import { flavorOf, identifyBuild } from './builds.js'
import { PINNED_VERSION } from './rewrites.js'
import { toReadableStream, toUint8Array, knownSize, countBytes, readAll, peek, isGzip, isTar } from './input.js'

export { readTarballEntries } from './tar.js'
export { findBunPayload, parseBunfs, detectVersion, detectContainer, normalizeModuleName, rootRelative, BunPayloadError, BUN_MAGIC, BUNFS_PREFIX, BUNFS_ROOT } from './bunfs.js'
export { applyRewrites, rewritesId, RewriteDriftError, normalizeAppDir, DEFAULT_FLAVOR } from './apply-rewrites.js'
export { REWRITES, PINNED_VERSION } from './rewrites.js'
export { materialize, loadCachedManifest, loadCachedFiles, clearCache, cacheName, manifestUrl, defaultAppUrl, contentTypeFor, CacheIncompleteError, DEFAULT_EXCLUDE, MANIFEST_FORMAT } from './cache.js'
export { createMemoryCaches } from './memory-caches.js'
export { KNOWN_BUILDS, DEFAULT_PLATFORM, npmTarballUrl, identifyBuild, flavorOf } from './builds.js'
export { treeSha256, sha256Hex } from './hash.js'

/** Tarball entries that hold the executable: package/claude, package/claude.exe. */
const isExecutableEntry = (path) => /^(?:package\/)?claude(?:\.exe)?$/.test(path)

/**
 * Turn any accepted input into the executable's bytes, unpacking an npm
 * tarball on the fly when that is what we were given. The kind is sniffed
 * from the bytes (gzip magic, or "ustar" at 257 for a .tar a server already
 * gunzipped via Content-Encoding), never trusted from `source`.
 */
async function readExecutable (input, progress) {
  const total = knownSize(input)
  const u8 = toUint8Array(input)
  let stream
  let head
  if (u8) {
    head = u8.subarray(0, 512)
    stream = toReadableStream(u8)
  } else {
    ({ head, stream } = await peek(toReadableStream(input), 512))
    stream = countBytes(stream, (loaded) => progress({ phase: 'read', loaded, total }))
  }
  const gzip = isGzip(head)
  if (!gzip && !isTar(head)) return { binary: u8 ?? await readAll(stream, total), tarEntry: null }
  let found = null
  for await (const e of readTarballEntries(stream, { gzip, filter: (h) => isExecutableEntry(h.path) })) {
    // Keep iterating to the end: the tar reader drains the gzip trailer, so
    // DecompressionStream verifies the CRC32 of everything we were handed.
    if (!found) found = e
  }
  if (!found) throw new Error('the tarball has no package/claude executable; is it @anthropic-ai/claude-code-<platform>?')
  return { binary: found.bytes, tarEntry: found.path }
}

/**
 * The whole pipeline: bytes -> payload -> module table -> rewrites -> Cache API.
 *
 * @param {Uint8Array|ArrayBuffer|Blob|File|Response|ReadableStream} input
 *   the `claude` executable (ELF, Mach-O or PE) or its npm platform .tgz
 * @param {object} [opts]
 * @param {'drop'|'npm'} [opts.source]   recorded in the manifest
 * @param {string} [opts.version]        expected version (default PINNED_VERSION)
 * @param {string} [opts.appUrl]         BASE/vfs/app/ (default: from location)
 * @param {boolean} [opts.strict=true]   pinned counts; false = the FreeBSD port's checks only
 * @param {(u8: Uint8Array) => Uint8Array} [opts.zstdDecompressSync]  verifies the .zst assets
 * @param {boolean} [opts.hashBinary=false]  also sha256 the executable (one more 294 MB pass)
 * @param {CacheStorage} [opts.caches]
 * @param {RegExp[]} [opts.exclude]      see cache.js DEFAULT_EXCLUDE
 * @param {(p: object) => void} [opts.onProgress]  {phase: 'read'|'parse'|'hash'|'rewrite'|'cache'|'done', ...}
 * @returns {Promise<object>} the manifest exactly as cached (cache.js fields plus
 *   moduleCount, sourceSha256, rewritesId, rewrites (the report), source {...}, timings)
 */
export async function extractFromBinary (input, opts = {}) {
  const { source = 'drop', strict = true, zstdDecompressSync, hashBinary = false, caches, exclude, onProgress } = opts
  const progress = (p) => { try { onProgress?.(p) } catch {} }
  const appUrl = opts.appUrl ?? defaultAppUrl()
  const appPath = new URL(appUrl).pathname
  const t = { start: Date.now() }

  let { binary, tarEntry } = await readExecutable(input, progress)
  t.read = Date.now()

  progress({ phase: 'parse', size: binary.length })
  const payload = findBunPayload(binary)
  let parsed = parseBunfs(binary, payload)
  const detected = detectVersion(parsed.files, parsed.entry)
  const flavor = flavorOf(payload.container)
  const wanted = opts.version ?? PINNED_VERSION
  if (strict && detected && detected !== wanted) {
    throw new RewriteDriftError(`this executable is Claude Code ${detected}; expected ${wanted}`, { code: 'unknown-build' })
  }
  if (strict && flavor === 'win32') {
    throw new RewriteDriftError('Windows builds of Claude Code embed "B:/~BUN/root/" paths and are not supported; use the in-page download instead', { code: 'unknown-build' })
  }
  t.parse = Date.now()

  progress({ phase: 'hash' })
  const tree = await treeSha256([...parsed.files].map(([n, f]) => [n.slice(BUNFS_PREFIX.length), f.bytes]))
  const known = identifyBuild(tree.sha256)
  const binarySha256 = hashBinary ? await sha256Hex(binary) : null
  const sourceInfo = {
    kind: source,
    container: payload.container,
    flavor,
    platform: known?.platform ?? null, // null: not one of the official 2.1.311 packages
    binarySize: binary.length,
    binarySha256,
    tarEntry,
    payload: { blobStart: payload.blobStart, byteCount: payload.byteCount, entryId: payload.entryId, flags: payload.flags, bytesAfterMarker: payload.bytesAfterMarker },
    skipped: parsed.skipped
  }
  const moduleCount = parsed.files.size
  const entry = parsed.entry
  t.hash = Date.now()

  progress({ phase: 'rewrite' })
  let { files, report } = applyRewrites(parsed.files, { appPath, flavor, version: detected, strict, zstdDecompressSync })
  t.rewrite = Date.now()

  // The Worker's pre-import order (src/runtime/boot/module-graph.js), worked
  // out here while the rewritten sources are in memory anyway.
  progress({ phase: 'graph' })
  const boot = bootGraph(new Map([...files].flatMap(([n, f]) => { const rel = rootRelative(n); return rel == null ? [] : [[appPath + rel, f.bytes]] })), appPath)
  t.graph = Date.now()

  // From here only `files` is needed. Unrewritten entries are still views
  // into the executable; materialize copies them into Response bodies, after
  // which nothing references the input buffer and it can be collected.
  parsed = null
  binary = null

  const manifest = await materialize(files, {
    version: detected ?? wanted,
    appUrl,
    entry,
    caches,
    exclude,
    onProgress: progress,
    extra: {
      moduleCount,
      sourceSha256: tree.sha256,
      rewritesId: rewritesId(),
      rewrites: report,
      boot,
      source: sourceInfo,
      // (the cache write itself is not timed: the manifest is its last entry)
      timings: { readMs: t.read - t.start, parseMs: t.parse - t.read, hashMs: t.hash - t.parse, rewriteMs: t.rewrite - t.hash, graphMs: t.graph - t.rewrite }
    }
  })
  files = null
  progress({ phase: 'done', manifest })
  return manifest
}

/**
 * loadCachedManifest with the checks a page wants before trusting a cache:
 * the same app URL (in a page it defaults to this page's BASE/vfs/app/; in
 * a Worker, pass it or any complete manifest is taken) and the same rewrite
 * set as this build of the app.
 */
export function loadCurrentManifest (version = PINNED_VERSION, { appUrl, caches } = {}) {
  const id = rewritesId()
  if (!appUrl && typeof document !== 'undefined' && typeof location !== 'undefined') appUrl = defaultAppUrl()
  return loadCachedManifest(version, { appUrl, caches, accept: (m) => m.rewritesId === id })
}
