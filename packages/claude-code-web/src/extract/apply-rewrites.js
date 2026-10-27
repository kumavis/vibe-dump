// Engine for rewrites.js: applies every rewrite to the files it targets,
// counts matches per rewrite, and refuses (RewriteDriftError) when a count
// differs from what is pinned for this build. Nothing here decides *what* is
// rewritten; that is rewrites.js.
//
// Byte semantics match the port's sed: patterns are ASCII, so matching on the
// decoded text gives the same counts as sed over raw bytes, and a file no
// rewrite touches keeps its original bytes (a view, no copy).

import { REWRITES, ZST_CHECK_IDS, PINNED_VERSION } from './rewrites.js'
import { isAscii, decodeUtf8, tryDecodeUtf8, decodeLatin1, encodeLatin1, encodeUtf8 } from './text.js'
import { BUNFS_PREFIX, rootRelative } from './bunfs.js'

export const DEFAULT_FLAVOR = 'linux'

export class RewriteDriftError extends Error {
  /**
   * @param {string} message
   * @param {{code: 'count-mismatch'|'unknown-build'|'zst-needs-rewrite', drift?: object[], report?: object}} info
   */
  constructor (message, { code, drift = [], report = null } = {}) {
    super(message)
    this.name = 'RewriteDriftError'
    this.code = code
    this.drift = drift
    this.report = report
  }
}

/** "/a/b/" or "/a/b" -> "/a/b" (a URL pathname; percent-encoding kept as is). */
export function normalizeAppDir (appPath) {
  if (typeof appPath !== 'string' || !appPath.startsWith('/')) {
    throw new TypeError(`appPath must be an absolute URL pathname such as "/vibe-dump/claude-code-web/vfs/app/", got ${JSON.stringify(appPath)}`)
  }
  const dir = appPath.replace(/\/+$/, '')
  if (/["'\\`\n\r]/.test(dir)) throw new TypeError(`appPath contains a character that cannot go into a JS string: ${JSON.stringify(appPath)}`)
  return dir
}

// Fingerprint of the rewrite set (FNV-1a over ids, patterns, replacements and
// pinned counts). Stored in the manifest so a deployment with different
// rewrites does not reuse a tree cached by an older one.
export function rewritesId (rewrites = REWRITES) {
  const s = JSON.stringify(rewrites.map((r) => [r.id, r.pattern.source, r.pattern.flags, String(r.replacement), r.expect]))
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) }
  return (h >>> 0).toString(16).padStart(8, '0')
}

// How a file is turned into text for matching, and back into bytes.
//   ascii  : pure 7-bit (the 2,598 JS modules); utf-8 both ways
//   utf8   : valid UTF-8 (UTF-16LE modules after transcoding, file-loader JS)
//   latin1 : Bun latin1 module with high bytes; written back as UTF-8, since
//            browsers load module scripts as UTF-8 (none on 2.1.311)
//   bytes  : binary that is not UTF-8; one char per byte both ways (sed-like)
function decodeForRewrite (f) {
  const b = f.bytes
  if (isAscii(b)) return { text: decodeUtf8(b), codec: 'ascii' }
  if (f.encoding === 'latin1') return { text: decodeLatin1(b), codec: 'latin1' }
  const s = tryDecodeUtf8(b)
  if (s !== null) return { text: s, codec: 'utf8' }
  return { text: decodeLatin1(b), codec: 'bytes' }
}

function encodeFromRewrite (text, codec) {
  return codec === 'bytes' ? encodeLatin1(text) : encodeUtf8(text)
}

// "$1".."$9" expansion for string replacements (no $&, $`, $' needed).
function expand (template, groups) {
  return template.replace(/\$([1-9])/g, (_, d) => groups[d - 1] ?? '')
}

function checkCount (exp, got) {
  if (exp == null) return true
  if (exp.min != null && got.matches < exp.min) return false
  if (exp.matches != null && got.matches !== exp.matches) return false
  if (exp.files != null && got.files !== exp.files) return false
  return true
}

function describe (exp) {
  if (exp == null) return 'any'
  const parts = []
  if (exp.min != null) parts.push(`>= ${exp.min} matches`)
  if (exp.matches != null) parts.push(`${exp.matches} matches`)
  if (exp.files != null) parts.push(`in ${exp.files} files`)
  return parts.join(' ')
}

/**
 * @param {Map<string, {bytes: Uint8Array, encoding: string}>} files  from parseBunfs
 * @param {object} opts
 * @param {string} opts.appPath  URL pathname of BASE/vfs/app/
 * @param {string} [opts.flavor]  'linux' | 'darwin': key into each rewrite's `expect` (default 'linux')
 * @param {string} [opts.version]  detected Claude Code version; strict mode requires PINNED_VERSION
 * @param {boolean} [opts.strict=true]  false: check only the port's release-independent counts
 * @param {(u8: Uint8Array) => Uint8Array} [opts.zstdDecompressSync]  enables the .zst check
 * @param {object[]} [opts.rewrites]  override the list (tests)
 * @returns {{ files: Map, report: object }}  same keys; rewritten entries get new bytes and `rewritten: true`
 */
export function applyRewrites (files, opts = {}) {
  const { appPath, flavor = DEFAULT_FLAVOR, version, strict = true, zstdDecompressSync, rewrites = REWRITES } = opts
  const appDir = normalizeAppDir(appPath)

  if (strict && version != null && version !== PINNED_VERSION) {
    throw new RewriteDriftError(
      `this is Claude Code ${version}; the rewrites are pinned to ${PINNED_VERSION}. ` +
      'Use the pinned download, or extract with strict:false to accept the FreeBSD port\'s looser checks.',
      { code: 'unknown-build' })
  }
  if (strict && !rewrites.every((r) => r.expect && r.expect[flavor])) {
    throw new RewriteDriftError(
      `no pinned rewrite counts for "${flavor}" builds of Claude Code ${PINNED_VERSION} ` +
      `(pinned: ${Object.keys(rewrites[0]?.expect ?? {}).join(', ')}); refusing to guess.`,
      { code: 'unknown-build' })
  }

  const stats = new Map(rewrites.map((r) => [r.id, { matches: 0, files: 0, sample: [] }]))
  const out = new Map()
  const transcoded = []
  let rewrittenFiles = 0

  for (const [name, f] of files) {
    const applicable = rewrites.filter((r) => r.files(name))
    // Untouched unless a rewrite targets it, or it is a latin1 module with
    // high bytes that must become UTF-8 (isAscii runs once per file either way).
    if (!applicable.length && (f.encoding !== 'latin1' || isAscii(f.bytes))) { out.set(name, f); continue }

    const { text, codec } = decodeForRewrite(f)
    const rel = rootRelative(name) ?? name.slice(BUNFS_PREFIX.length)
    const slash = rel.lastIndexOf('/')
    const ctx = { appDir, fileDir: slash < 0 ? appDir : appDir + '/' + rel.slice(0, slash), file: name }

    let t = text
    for (const r of applicable) {
      let n = 0
      const lit = typeof r.replacement === 'function' ? r.replacement(ctx) : null
      t = t.replace(r.pattern, (...args) => {
        n++
        if (lit !== null) return lit
        const groups = args.slice(1, args.findIndex((a) => typeof a === 'number'))
        return expand(r.replacement, groups)
      })
      if (n) {
        const s = stats.get(r.id)
        s.matches += n
        s.files++
        if (s.sample.length < 12) s.sample.push(rel)
      }
    }

    if (t !== text || codec === 'latin1') {
      if (codec === 'latin1') transcoded.push(rel)
      if (t !== text) rewrittenFiles++
      out.set(name, { ...f, bytes: encodeFromRewrite(t, codec), rewritten: t !== text })
    } else {
      out.set(name, f)
    }
  }

  // Compressed assets: stored as shipped, so prove none needs the rewrite.
  const zst = { checked: 0, unchecked: 0, needRewrite: [] }
  const zstChecks = rewrites.filter((r) => ZST_CHECK_IDS.includes(r.id))
  for (const [name, f] of files) {
    if (!name.endsWith('.zst')) continue
    if (!zstdDecompressSync) { zst.unchecked++; continue }
    const plain = decodeLatin1(zstdDecompressSync(f.bytes))
    zst.checked++
    for (const r of zstChecks) {
      r.pattern.lastIndex = 0
      if (r.pattern.test(plain)) { zst.needRewrite.push({ file: rootRelative(name) ?? name, id: r.id }); break }
    }
    for (const r of zstChecks) r.pattern.lastIndex = 0
  }

  const drift = []
  const results = rewrites.map((r) => {
    const got = stats.get(r.id)
    const expected = strict ? r.expect[flavor] : r.portExpect
    const ok = checkCount(expected, got)
    if (!ok) drift.push({ id: r.id, expected, actual: { matches: got.matches, files: got.files } })
    return { id: r.id, matches: got.matches, files: got.files, expected: expected ?? null, ok, sample: got.sample }
  })

  const report = {
    pinnedVersion: PINNED_VERSION,
    flavor,
    version: version ?? null,
    strict,
    appDir,
    ok: drift.length === 0 && zst.needRewrite.length === 0,
    rewrites: results,
    rewrittenFiles,
    transcoded,
    zst
  }

  if (drift.length) {
    const lines = drift.map((d) => `  ${d.id}: expected ${describe(d.expected)}, found ${d.actual.matches} matches in ${d.actual.files} files`)
    throw new RewriteDriftError(
      `Claude Code rewrite drift (${flavor} build${strict ? ', pinned counts' : ', port checks'}):\n${lines.join('\n')}\n` +
      'The extracted JS no longer has the shape these rewrites were written for; nothing was changed.',
      { code: 'count-mismatch', drift, report })
  }
  if (zst.needRewrite.length) {
    throw new RewriteDriftError(
      `compressed assets now contain rewrite targets (${zst.needRewrite.map((z) => `${z.file}: ${z.id}`).join(', ')}); ` +
      'they are stored as shipped, so the .zst round trip from the port would be needed',
      { code: 'zst-needs-rewrite', drift: zst.needRewrite, report })
  }
  return { files: out, report }
}
