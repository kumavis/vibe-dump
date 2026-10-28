// Getting Claude Code's JavaScript into the cache: the user's own binary
// (file drop) or the official npm platform package downloaded by this page.
// The work is track A's (src/extract/); this file only adapts it for the UI
// and tolerates its absence, so the page still renders when the extractor
// fails to load.

import { CC_VERSION } from './constants.js'

let extractModule = null

/** The extractor module, or throws a readable error. Cached after the first load. */
export async function loadExtractor (load = () => import('../extract/index.js')) {
  if (extractModule) return extractModule
  try {
    extractModule = await load()
  } catch (err) {
    throw new Error(`the extractor (src/extract) could not be loaded: ${err?.message ?? err}`)
  }
  return extractModule
}

/** For tests: inject a fake extractor module. */
export function setExtractor (mod) { extractModule = mod }

/**
 * The manifest of a complete cached extraction for this page, or null.
 * Uses loadCurrentManifest (also checks the rewrite-set fingerprint) when the
 * extractor exports it, else loadCachedManifest(version).
 */
export async function cachedManifest (mod, { version = CC_VERSION, appUrl, caches } = {}) {
  if (typeof mod.loadCurrentManifest === 'function') return mod.loadCurrentManifest(version, { appUrl, caches })
  if (typeof mod.loadCachedManifest === 'function') return mod.loadCachedManifest(version, { appUrl, caches })
  throw new Error('the extractor exports neither loadCurrentManifest nor loadCachedManifest')
}

export function npmUrl (mod, version = CC_VERSION) {
  if (typeof mod.npmTarballUrl === 'function') return mod.npmTarballUrl(mod.DEFAULT_PLATFORM ?? 'linux-x64', version)
  return `https://registry.npmjs.org/@anthropic-ai/claude-code-linux-x64/-/claude-code-linux-x64-${version}.tgz`
}

/**
 * fzstd's decompress as the extractor's `zstdDecompressSync`, so the .zst
 * drift check (src/extract/rewrites.js) runs on every extraction: each
 * compressed asset is checked for rewrite targets instead of being counted
 * as unchecked. Loaded on first use (kept out of the page's main bundle);
 * if it cannot load, the extraction goes on and the manifest's
 * rewrites.zst.unchecked says what was not checked.
 */
let zstd = null
export async function loadZstd (load = () => import('fzstd')) {
  if (zstd) return zstd
  try {
    const { decompress } = await load()
    zstd = (u8) => decompress(u8)
  } catch {
    return undefined
  }
  return zstd
}

/** A dropped file (the user's `claude`, `claude.exe` or the platform .tgz). */
export async function extractFile (mod, file, { version = CC_VERSION, appUrl, onProgress, caches, zstdDecompressSync } = {}) {
  zstdDecompressSync ??= await loadZstd()
  return mod.extractFromBinary(file, { source: 'drop', version, appUrl, onProgress, caches, zstdDecompressSync })
}

/**
 * Download the pinned platform package from registry.npmjs.org (it serves
 * Access-Control-Allow-Origin: *) and extract it while it streams in.
 * Progress: {phase: 'download', loaded, total} then the extractor's phases.
 */
export async function downloadAndExtract (mod, { version = CC_VERSION, appUrl, onProgress, caches, fetch = globalThis.fetch, signal, zstdDecompressSync } = {}) {
  zstdDecompressSync ??= await loadZstd()
  const url = npmUrl(mod, version)
  onProgress?.({ phase: 'download', loaded: 0, total: 0, url })
  const res = await fetch(url, { signal })
  if (!res.ok || !res.body) throw new Error(`download failed: HTTP ${res.status} for ${url}`)
  const total = Number(res.headers.get('content-length')) || 0
  let loaded = 0
  let last = 0
  const counted = res.body.pipeThrough(new TransformStream({
    transform (chunk, ctl) {
      loaded += chunk.byteLength
      if (loaded - last > 1 << 20 || loaded === total) { last = loaded; onProgress?.({ phase: 'download', loaded, total, url }) }
      ctl.enqueue(chunk)
    }
  }))
  return mod.extractFromBinary(counted, {
    source: 'npm',
    version,
    appUrl,
    caches,
    zstdDecompressSync,
    // The extractor's own 'read' phase would repeat the download numbers.
    onProgress: (p) => { if (p.phase !== 'read') onProgress?.(p) }
  })
}

/** Throw away cached extractions (the "Clear cache" button). */
export async function clearExtraction (mod, { version, caches } = {}) {
  if (typeof mod.clearCache === 'function') return mod.clearCache(version, { caches })
  return false
}

/** One line for the UI: "2,848 modules, 2,846 cached, rewrites ok". */
export function describeManifest (m) {
  if (!m) return 'not cached'
  const n = (x) => (typeof x === 'number' ? x.toLocaleString('en-US') : '?')
  const rw = m.rewrites
  const rewrites = rw ? (rw.ok ? `${rw.rewrites?.length ?? 0} rewrites at expected counts` : 'REWRITE DRIFT') : 'rewrites: no report'
  const from = m.source?.kind === 'npm' ? 'npm download' : m.source?.kind === 'drop' ? 'dropped file' : 'cache'
  return `Claude Code ${m.version}: ${n(m.moduleCount)} modules (${n(m.files)} cached, ${(m.bytes / 1e6).toFixed(1)} MB), ${rewrites}, from ${from}`
}
