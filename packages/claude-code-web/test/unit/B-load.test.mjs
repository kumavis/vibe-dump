// Track B: every shim loads under Node as plain ESM, every specifier in
// BUILTINS.js has a file with a default export, vendor.js only imports our own
// shims, and every named import Claude Code 2.1.311 makes from a built-in exists.
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'
import { getRuntime, load, EXTRACTED_TREE } from './B-support.mjs'

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.js')) out.push(p)
  }
  return out
}

test('every file under runtime/node imports under Node', async () => {
  const dir = await getRuntime()
  const files = walk(join(dir, 'node'))
  assert.ok(files.length > 40, `expected the full shim set, got ${files.length}`)
  for (const f of files) {
    await assert.doesNotReject(import(pathToFileURL(f).href), `import ${relative(dir, f)}`)
  }
})

test('BUILTINS.js: every specifier maps to a shim with a default export', async () => {
  const { BUILTINS, NPM_SHIMS, SPECIFIER_MAP, shimFile } = await load('node/BUILTINS.js')
  for (const name of [...BUILTINS, ...NPM_SHIMS]) {
    const file = shimFile(name)
    assert.ok(file, `no mapping for ${name}`)
    if (BUILTINS.includes(name)) assert.equal(shimFile(`node:${name}`), file)
    const ns = await load(`node/${file}`)
    assert.ok('default' in ns, `${name} has no default export`)
  }
  assert.equal(shimFile('node:fs/promises'), 'fs/promises.js')
  assert.equal(shimFile('ws'), 'ws.js')
  assert.equal(shimFile('node:ws'), null)
  assert.equal(shimFile('left-pad'), null)
  assert.ok(Object.keys(SPECIFIER_MAP).length === BUILTINS.length * 2 + NPM_SHIMS.length)
})

test('index.js registry serves require()-style module objects', async () => {
  const { getBuiltinModule, requireShim, isShimmed } = await load('node/index.js')
  const fs = getBuiltinModule('node:fs')
  assert.equal(typeof fs.readFileSync, 'function')
  assert.equal(getBuiltinModule('fs'), fs)
  assert.equal(typeof getBuiltinModule('util').inherits, 'function')
  assert.equal(typeof getBuiltinModule('events'), 'function') // require('events') === EventEmitter
  assert.equal(getBuiltinModule('ws'), undefined) // not a Node built-in...
  assert.equal(typeof requireShim('ws'), 'function') // ...but __bunRequire('ws') needs it
  assert.equal(typeof requireShim('undici').setGlobalDispatcher, 'function')
  assert.equal(requireShim('zlib'), getBuiltinModule('node:zlib'))
  assert.equal(getBuiltinModule('nope'), undefined)
  assert.equal(requireShim('node:ws'), undefined)
  assert.ok(isShimmed('node:zlib') && isShimmed('undici') && !isShimmed('node:undici'))
  const { createProcess } = await load('node/process.js')
  assert.equal(createProcess().getBuiltinModule('os').platform(), 'linux')
})

test('vendor.js is one ESM file whose only imports are ./node/* shims', async () => {
  const dir = await getRuntime()
  const src = readFileSync(join(dir, 'vendor.js'), 'utf8')
  const specs = [...src.matchAll(/(?:^|[\n;])\s*import\s*[^;"']*?from\s*["']([^"']+)["']/g)].map((m) => m[1])
  assert.ok(specs.length >= 5, `found ${specs.length} imports`)
  for (const s of specs) {
    assert.match(s, /^\.\/node\/[a-z_/]+\.js$/)
    assert.ok(existsSync(join(dir, s)), `${s} missing`)
  }
  assert.ok(!/import\(/.test(src.replace(/["'`][^"'`\n]*import\([^"'`\n]*["'`]/g, '')), 'no dynamic imports (no code splitting)')
  assert.ok(existsSync(join(dir, 'vendor.licenses.txt')), 'licences of the bundled packages ship next to vendor.js')
  const v = await load('vendor.js')
  for (const name of ['Volume', 'createFsFromVolume', 'memfsProcess', 'sha256', 'sha1', 'md5', 'sha512', 'hmac', 'pbkdf2', 'fflate', 'fzstd', 'YAML', 'semver', 'stringWidth', 'wrapAnsi', 'sliceAnsi', 'stripAnsi']) {
    assert.ok(v[name] !== undefined, `vendor.js lacks ${name}`)
  }
  assert.equal(v.stringWidth('héllo'), 5)
  assert.equal(v.semver.satisfies('2.1.311', '>=2.1.0'), true)
  assert.deepEqual(v.YAML.parse('a: [1, 2]'), { a: [1, 2] })
})

// Every `import{a,b as c}from"<builtin>"` in the extracted 2.1.311 tree must
// link against our shim (a missing name is a link-time SyntaxError).
test('named imports used by Claude Code 2.1.311 all exist', { skip: !existsSync(EXTRACTED_TREE) && `extracted tree not found at ${EXTRACTED_TREE}` }, async () => {
  const { shimFile } = await load('node/BUILTINS.js')
  const wanted = new Map()
  const re = /import\s*(?:[A-Za-z_$][\w$]*\s*,?\s*)?\{([^}]*)\}\s*from\s*"([^"./][^"]*)"/g
  for (const name of readdirSync(EXTRACTED_TREE)) {
    if (!(name.endsWith('.js') || name === 'cli')) continue
    const src = readFileSync(join(EXTRACTED_TREE, name), 'latin1')
    for (const m of src.matchAll(re)) {
      const spec = m[2]
      if (!shimFile(spec)) continue
      const set = wanted.get(spec) || new Set()
      for (const part of m[1].split(',')) { const n = part.trim().split(/\s+as\s+/)[0].trim(); if (n) set.add(n) }
      wanted.set(spec, set)
    }
  }
  assert.ok(wanted.size >= 30, `expected imports from ~40 built-ins, found ${wanted.size}`)
  const missing = []
  for (const [spec, names] of wanted) {
    const ns = await load(`node/${shimFile(spec)}`)
    for (const n of names) if (!(n in ns)) missing.push(`${spec}.${n}`)
  }
  assert.deepEqual(missing, [])
})
