// Track A: the rewrite set and its engine.
//
// On the real 2.1.311 linux-x64 binary this checks (1) the exact counts of
// research report E §2, (2) that with the port's two Node-specific
// replacements swapped back in, the output is byte-identical to the FreeBSD
// recipe's own output tree (spike-E/install/app), and (3) that every module
// a shape-matched or import.meta.dir rewrite touched still parses.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { applyRewrites, rewritesId, RewriteDriftError } from '../../src/extract/apply-rewrites.js'
import { REWRITES, PINNED_VERSION } from '../../src/extract/rewrites.js'
import { parseBunfs, detectVersion } from '../../src/extract/bunfs.js'
import { RESEARCH_DIR } from '../research.mjs'

const RESEARCH = RESEARCH_DIR
const LINUX_BIN = path.join(RESEARCH, 'pkg-linux-x64/package/claude')
const PORT_APP = path.join(RESEARCH, 'spike-E/install/app')
const missing = (...ps) => { const m = ps.find((p) => !fs.existsSync(p)); return m ? `scratchpad artifact missing: ${m}` : false }

const te = new TextEncoder()
const td = new TextDecoder()
const APP = '/vibe-dump/claude-code-web/vfs/app/'
const file = (s, encoding = 'latin1', loader = 'js') => ({ bytes: typeof s === 'string' ? te.encode(s) : s, encoding, loader })

// Synthetic text with exactly one instance of each shape-matched target
// (the shapes the port matches; identifiers made up).
const HOOKS = 'var helper=(a,b,c)=>isExe()?load(b,c(),a):{module:b,folder:a};'
const GATE = 'function gate(){if(!flag("true"))return!1;if(other())return!1;return env.CLAUDE_CODE_ENTRYPOINT!=="local-agent"}'
const DIRLS1 = 'let a=(await fsw().readdir(dir)).filter((d)=>d.isDirectory()&&!d.name.startsWith("."));'
const DIRLS2 = 'let b=(await fsw().readdir(dir)).filter((d)=>!d.name.startsWith("."));'

function synthetic () {
  return new Map([
    ['/$bunfs/root/cli', file('// Version: 2.1.311\nimport"/$bunfs/root/chunk-a.js";import"//$bunfs/root//chunk-b.js";\n')],
    ['/$bunfs/root/chunk-a.js', file(`const r=import.meta.require("x");const d=import.meta.dir;const k=import.meta.dirname;${HOOKS}${GATE}`)],
    ['/$bunfs/root/chunk-b.js', file(`async function c(){${DIRLS1}${DIRLS2}}`)],
    ['/$bunfs/root/src/sub/w.js', file('export const here=import.meta.dir+"/x";')],
    ['/$bunfs/root/tool.mjs', file('"/$bunfs/root/not-in-the-port-file-set"', 'latin1', 'text')],
    ['/$bunfs/root/notes.md', file(new Uint8Array([0x63, 0x61, 0x66, 0xe9, 0x20, 0x2f, 0x24, 0x62, 0x75, 0x6e, 0x66, 0x73, 0x2f, 0x72, 0x6f, 0x6f, 0x74, 0x2f, 0x78]), 'latin1', 'text')], // "café /$bunfs/root/x" in latin1
    ['/$bunfs/root/blob.js', file(new Uint8Array([0xff, 0xfe, ...te.encode('"/$bunfs/root/y"')]), 'binary', 'file')],
    ['/$bunfs/root/pic.png', file(new Uint8Array([0x89, 0x50]), 'binary', 'file')]
  ])
}
// The synthetic tree's exact counts, as a pinned flavor.
const SYN = { 'bunfs-root': [4, 3], 'import-meta-require': [1, 1], 'import-meta-dir': [2, 2], 'builtin-hooks-helper': [1, 1], 'shell-search-gate': [1, 1], 'path-completer-readdir': [2, 1] }
const synRewrites = REWRITES.map((r) => ({ ...r, expect: { test: { matches: SYN[r.id][0], files: SYN[r.id][1] } } }))

test('rewrites: list shape', () => {
  assert.deepEqual(REWRITES.map((r) => r.id), ['bunfs-root', 'import-meta-require', 'import-meta-dir', 'builtin-hooks-helper', 'shell-search-gate', 'path-completer-readdir'])
  for (const r of REWRITES) {
    assert.ok(r.pattern instanceof RegExp && r.pattern.global, r.id)
    assert.ok(typeof r.replacement === 'string' || typeof r.replacement === 'function', r.id)
    assert.ok(r.expect.linux && r.expect.darwin, r.id)
    assert.equal(typeof r.files, 'function')
  }
  assert.equal(PINNED_VERSION, '2.1.311')
  assert.match(rewritesId(), /^[0-9a-f]{8}$/)
})

test('rewrites: engine semantics on a synthetic tree', () => {
  const input = synthetic()
  const { files, report } = applyRewrites(input, { appPath: APP, flavor: 'test', rewrites: synRewrites })
  const get = (n) => td.decode(files.get('/$bunfs/root/' + n).bytes)
  assert.equal(report.ok, true)
  assert.equal(get('cli'), '// Version: 2.1.311\nimport"/vibe-dump/claude-code-web/vfs/app/chunk-a.js";import"/vibe-dump/claude-code-web/vfs/app/chunk-b.js";\n')
  assert.equal(get('chunk-a.js'),
    'const r=globalThis.__bunRequire("x");const d="/vibe-dump/claude-code-web/vfs/app";const k=import.meta.dirname;' +
    'var helper=(a,b,c)=>load(b,c(),a);function gate(){return!1}')
  assert.match(get('chunk-b.js'), /^async function c\(\)\{let a=\(await \(\(d,p,f\)=>Promise\.all/)
  assert.equal(get('chunk-b.js').split('(await fsw().readdir(dir),dir,fsw())).filter(').length, 3)
  assert.equal(get('src/sub/w.js'), 'export const here="/vibe-dump/claude-code-web/vfs/app/src/sub"+"/x";')
  // not in the port's file set (*.js, cli, *.md, *.txt): untouched, same bytes object
  assert.equal(files.get('/$bunfs/root/tool.mjs'), input.get('/$bunfs/root/tool.mjs'))
  assert.equal(get('tool.mjs'), '"/$bunfs/root/not-in-the-port-file-set"')
  // latin1 module with a high byte: rewritten AND transcoded to UTF-8
  assert.equal(get('notes.md'), 'café /vibe-dump/claude-code-web/vfs/app/x')
  assert.deepEqual(report.transcoded, ['notes.md'])
  // binary .js that is not UTF-8: sed-like byte semantics, other bytes kept
  assert.deepEqual([...files.get('/$bunfs/root/blob.js').bytes.subarray(0, 2)], [0xff, 0xfe])
  assert.equal(td.decode(files.get('/$bunfs/root/blob.js').bytes.subarray(2)), '"/vibe-dump/claude-code-web/vfs/app/y"')
  assert.equal(files.get('/$bunfs/root/pic.png').rewritten, undefined)
  assert.deepEqual(report.rewrites.map((r) => [r.id, r.matches, r.files]), Object.entries(SYN).map(([k, v]) => [k, ...v]))
})

test('rewrites: replacement strings are literal ($ in the app path)', () => {
  const files = new Map([['/$bunfs/root/cli', file('import"/$bunfs/root/a.js"')]])
  const only = REWRITES.filter((r) => r.id === 'bunfs-root').map((r) => ({ ...r, expect: { t: { matches: 1, files: 1 } } }))
  const out = applyRewrites(files, { appPath: '/x$1$&/app', flavor: 't', rewrites: only })
  assert.equal(td.decode(out.files.get('/$bunfs/root/cli').bytes), 'import"/x$1$&/app/a.js"')
  assert.throws(() => applyRewrites(files, { appPath: 'relative/app' }), TypeError)
  assert.throws(() => applyRewrites(files, { appPath: '/a"b/' }), TypeError)
})

test('rewrites: drift is a hard error, never a silent skip', () => {
  // Pinned linux counts against a tiny tree: the three "any count in the
  // port" rewrites drift (the shape-matched ones happen to match: 1, 1, 2).
  assert.throws(() => applyRewrites(synthetic(), { appPath: APP }), (e) => {
    assert.ok(e instanceof RewriteDriftError)
    assert.equal(e.code, 'count-mismatch')
    assert.deepEqual(e.drift.map((d) => d.id), ['bunfs-root', 'import-meta-require', 'import-meta-dir'])
    assert.equal(e.report.ok, false)
    assert.deepEqual(e.drift[0], { id: 'bunfs-root', expected: { matches: 241429, files: 2391 }, actual: { matches: 4, files: 3 } })
    assert.match(e.message, /bunfs-root: expected 241429 matches in 2391 files, found 4 matches in 3 files/)
    return true
  })
  // Port checks (strict:false): the synthetic tree passes them...
  assert.equal(applyRewrites(synthetic(), { appPath: APP, strict: false }).report.ok, true)
  // ...but a second copy of the gate fails them (the port treats that as fatal).
  const twice = synthetic()
  twice.set('/$bunfs/root/chunk-c.js', file(GATE))
  assert.throws(() => applyRewrites(twice, { appPath: APP, strict: false }), (e) => e.code === 'count-mismatch' && e.drift.map((d) => d.id).join() === 'shell-search-gate')
  // Unknown flavor or another version under strict mode.
  assert.throws(() => applyRewrites(synthetic(), { appPath: APP, flavor: 'win32' }), (e) => e.code === 'unknown-build')
  assert.throws(() => applyRewrites(synthetic(), { appPath: APP, version: '2.1.400' }), (e) => e.code === 'unknown-build')
  // A .zst asset that contains a target cannot be stored as shipped.
  const z = synthetic()
  z.set('/$bunfs/root/doc.md.zst', file(zlib.zstdCompressSync(Buffer.from('see /$bunfs/root/x')), 'binary', 'file'))
  assert.throws(() => applyRewrites(z, { appPath: APP, flavor: 'test', rewrites: synRewrites, zstdDecompressSync: (u) => zlib.zstdDecompressSync(u) }),
    (e) => e.code === 'zst-needs-rewrite' && e.drift[0].file === 'doc.md.zst')
})

// --- the real thing -------------------------------------------------------

let real // parse once, share between the tests below
function loadReal () {
  if (!real) {
    const buf = fs.readFileSync(LINUX_BIN)
    real = parseBunfs(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength))
  }
  return real
}

test('rewrites: 2.1.311 linux-x64 matches report E §2 exactly', { skip: missing(LINUX_BIN) }, () => {
  const r = loadReal()
  const { files, report } = applyRewrites(r.files, {
    appPath: APP, flavor: 'linux', version: detectVersion(r.files, r.entry), zstdDecompressSync: (u) => zlib.zstdDecompressSync(u)
  })
  assert.equal(report.ok, true)
  assert.deepEqual(Object.fromEntries(report.rewrites.map((x) => [x.id, [x.matches, x.files]])), {
    'bunfs-root': [241429, 2391],
    'import-meta-require': [529, 115],
    'import-meta-dir': [9, 9],
    'builtin-hooks-helper': [1, 1],
    'shell-search-gate': [1, 1],
    'path-completer-readdir': [2, 1]
  })
  assert.deepEqual(report.zst, { checked: 137, unchecked: 0, needRewrite: [] })
  assert.deepEqual(report.transcoded, [])
  assert.equal(report.rewrittenFiles, 2392)
  assert.equal(files.size, 2848)
  // Nothing left to rewrite, and untouched files are still the same views.
  for (const [name, f] of files) {
    if (!f.rewritten) { assert.equal(f, r.files.get(name)); continue }
    const s = td.decode(f.bytes)
    assert.ok(!/\$bunfs\/root|import\.meta\.require|import\.meta\.dir\b/.test(s), name)
  }
  assert.ok(td.decode(files.get('/$bunfs/root/cli').bytes).includes('import"/vibe-dump/claude-code-web/vfs/app/chunk-'))
})

test('rewrites: with the port\'s own two Node-specific replacements, output == the FreeBSD recipe\'s tree', { skip: missing(LINUX_BIN, PORT_APP) }, () => {
  // spike-E ran tools/post-extract-linux.sh with APPDIR=PORT_APP. Swap back
  // the port's replacements for the two rewrites we deliberately changed,
  // and every file must come out byte-identical (cli modulo the polyfill
  // import the port prepends).
  const portStyle = REWRITES.map((r) =>
    r.id === 'import-meta-dir'
      ? { ...r, replacement: 'import.meta.dirname' }
      : r.id === 'path-completer-readdir'
        ? { ...r, replacement: '(await globalThis.__bunRequire("./follow-dir-links.cjs")(await $1().readdir($2),$2,$1()))$3' }
        : r)
  const { files } = applyRewrites(loadReal().files, { appPath: PORT_APP, flavor: 'linux', rewrites: portStyle })
  let compared = 0
  for (const [name, f] of files) {
    const rel = name.slice('/$bunfs/root/'.length)
    if (rel.endsWith('.node')) continue // the port extracts with -x '*.node'
    let theirs = fs.readFileSync(path.join(PORT_APP, rel))
    if (rel === 'cli') {
      const nl = theirs.indexOf(0x0a)
      assert.equal(theirs.subarray(0, nl).toString(), `import "${PORT_APP}/bun-polyfill.cjs";`)
      theirs = theirs.subarray(nl + 1)
    }
    assert.ok(Buffer.from(f.bytes.buffer, f.bytes.byteOffset, f.bytes.length).equals(theirs), `differs from the port: ${rel}`)
    compared++
  }
  assert.equal(compared, 2846)
})

test('rewrites: every module our own replacements touched still parses (esbuild)', { skip: missing(LINUX_BIN) }, async (t) => {
  let esbuild
  try { esbuild = await import('esbuild') } catch { t.skip('esbuild not installed'); return }
  const { files, report } = applyRewrites(loadReal().files, { appPath: APP })
  const touched = new Set(['cli'])
  for (const r of report.rewrites) if (r.id !== 'bunfs-root') for (const s of r.sample) touched.add(s)
  assert.ok(touched.size >= 10)
  for (const rel of touched) {
    const f = files.get('/$bunfs/root/' + rel)
    if (f.loader !== 'js') continue
    // Throws on a syntax error; `await using` and top-level await are fine for esbuild.
    await esbuild.transform(td.decode(f.bytes), { loader: 'js', format: 'esm', target: 'esnext', logLevel: 'silent' })
  }
})
