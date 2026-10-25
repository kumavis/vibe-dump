// The ?debug input hooks must change nothing for players. Compare the code
// before the hooks with the code that has them: the only difference allowed
// is the body of the `if (params.has('debug')) { … }` block, which runs only
// under ?debug: main.js's, or (R7b on) app/boot.js's, whichever file holds
// it (BLOCK_FILES). Each text is parsed (Rollup's parser, through Vite) and
// everything outside that body, before and after it, must be identical in:
//   1. the sources: the block's file; every other file of the package, at
//      any depth, byte-identical (vite.config.js and public/ included; not
//      dist/, sim/, test/ (the harness before sim/), node_modules/, *.md or
//      thumbnail.jpg, which never ship); package.json apart from `scripts`
//      and `gallery`; and from the repo root, vite.config.shared.js and the
//      locked version of three. The builds below emulate the shared config
//      and resolve three from this checkout for both sides, so they can't see
//      a difference there: that is why these inputs must match as text;
//   2. the built app, unminified;
//   3. the built app minified as shipped but with identifiers kept.
// The shipped bundle itself differs nearly everywhere: esbuild gives short
// names by how often each identifier is used, and the block's new references
// reshuffle them across the whole file. Renaming preserves behaviour, so the
// committed dist JS is a whole-file diff although nothing outside ?debug
// changed; (3) is the minified code without that noise.
//
//   node sim/hooks-inert.mjs [--base <ref>] [--ref <ref> | --dir <packageDir>]
//   node sim/hooks-inert.mjs --self-test     show it catches what it must
//
// Defaults: the code under test is the hooks commit (the `hooks` line of
// sim/oracle/PIN, which stays put when the PIN moves) and the base its
// parent; while that is still WORKTREE, the working tree against HEAD.
// So the standing runs judge main.js's block (R0's): app/boot.js's branch
// serves a --ref or --dir whose base has the same files outside the block,
// and the self-test checks it on the working tree's own app/boot.js without
// a build (ownBlock: one block, every hook in it, and the edits the cases
// put before and after the block landing inside boot()).
// Exit 0 inert, 1 not inert, 2 nothing to check (identical).
import { parseArgs } from 'node:util'
import { readFileSync, writeFileSync, readdirSync, existsSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { parseAst } from 'vite'
import { buildApp, copyCode } from './lib.mjs'
import { codeDir, readHooks, PKG } from './oracle/pin.mjs'

// the files the ?debug block may live in, in order: main.js (R0 to R7a),
// app/boot.js (R7b on, the page's boot)
const BLOCK_FILES = ['main.js', 'app/boot.js']

// what the block has to hold (DESIGN §4 R0)
const HOOKS = ['select', 'doMove', 'doAdvance', 'doShoot', 'doCharge', 'placeCharge', 'deployClick', 'endPhase', 'autoPhase', 'phaseResolve', 'chargePick']

// `….has('debug')`, however a build prints it
const isGuard = (n) => n?.type === 'CallExpression' && n.callee.type === 'MemberExpression' && !n.callee.computed &&
  n.callee.property.name === 'has' && n.arguments.length === 1 && n.arguments[0].value === 'debug'

// Split a text around the ?debug block's body: `if (guard) { body }`, or a
// minifier's `guard&&(body)`. There must be exactly one such block.
function split(text, what) {
  const found = []
  const walk = (n) => {
    if (n.type === 'IfStatement' && isGuard(n.test)) found.push(n.consequent)
    if (n.type === 'LogicalExpression' && n.operator === '&&' && isGuard(n.left)) found.push(n.right)
    for (const k in n) {
      const v = n[k]
      if (Array.isArray(v)) for (const c of v) c && typeof c.type === 'string' && walk(c)
      else if (v && typeof v.type === 'string') walk(v)
    }
  }
  walk(parseAst(text))
  if (found.length !== 1) throw new Error(`${what} has ${found.length} ?debug blocks, not exactly one`)
  const b = found[0]
  return { outside: text.slice(0, b.start) + '{}' + text.slice(b.end), body: text.slice(b.start, b.end) }
}

// The file of `dir` that holds the ?debug block (BLOCK_FILES' first with a
// guard in it), and where the block's `if` statement ends; main.js when none
// has one (the base, before the hooks, has none).
function blockOf(dir) {
  for (const f of BLOCK_FILES) {
    const p = join(dir, f)
    if (!existsSync(p)) continue
    const text = readFileSync(p, 'utf8')
    if (!text.includes("has('debug')") && !text.includes('has("debug")')) continue
    let end = -1
    const walk = (n) => {
      if (n.type === 'IfStatement' && isGuard(n.test)) end = n.end
      for (const k in n) {
        const v = n[k]
        if (Array.isArray(v)) for (const c of v) c && typeof c.type === 'string' && walk(c)
        else if (v && typeof v.type === 'string') walk(v)
      }
    }
    try {
      walk(parseAst(text))
    } catch {}
    if (end >= 0) return { file: f, end }
  }
  return { file: 'main.js', end: -1 }
}

// Where two texts that agree outside their blocks first part, as a line number.
const lineOf = (x, y) => {
  let i = 0
  while (i < x.length && x[i] === y[i]) i++
  return x.slice(0, i).split('\n').length
}

// Every file under `d`, as paths relative to it.
const walk = (d) => (existsSync(d) ? readdirSync(d, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).map((e) => join(e.parentPath ?? e.path, e.name).slice(d.length).replace(/^[\\/]/, '')) : [])
const NEVER_SHIPS = /^(dist|sim|test|node_modules|\.[^\\/]*)([\\/]|$)|\.md$|^thumbnail\.jpg$|^package\.json$/
const sources = (d) => walk(d).filter((f) => !NEVER_SHIPS.test(f)).sort()
const builtFiles = (d) => walk(d).sort()
const strip = (s) => s.replace(/-[\w-]{8}\.(\w+)/g, '-HASH.$1')

// package.json as it bears on the build: everything but its scripts and its
// gallery card (R0 itself adds the `parity` script)
const manifest = (d) => {
  const { scripts, gallery, ...rest } = JSON.parse(readFileSync(join(d, 'package.json'), 'utf8'))
  return JSON.stringify(rest)
}

// A repo-root file as `side` sees it: from git for a ref, else the checkout's.
const TOP = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: PKG, encoding: 'utf8' }).trim()
function rootFile(side, path) {
  try {
    return side.ref ? execFileSync('git', ['show', `${side.ref}:${path}`], { cwd: TOP, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }) : readFileSync(join(TOP, path), 'utf8')
  } catch {
    return null
  }
}
const lockedThree = (side) => {
  const lock = rootFile(side, 'package-lock.json')
  return lock && JSON.stringify(JSON.parse(lock).packages?.['node_modules/three'] ?? null)
}

// Builds, made once per tree and flavour.
const out = join(tmpdir(), `tails-and-scales-inert-${process.pid}`)
const builds = new Map()
function build(dir, flavour) {
  const key = `${dir}\n${flavour}`
  if (!builds.has(key)) {
    const dst = join(out, `${builds.size}`)
    builds.set(key, buildApp(dir, dst, flavour === 'unminified' ? { minify: false } : { keepIdentifiers: true }))
  }
  return builds.get(key)
}

// Compare `test` with `base`, each { dir, ref } (ref: the git ref its
// repo-root files come from, or null for this checkout's):
// { code: 0 | 1 | 2, problems, report }.
async function check(base, test) {
  const problems = [], report = []
  const tryIt = (fn) => {
    try {
      return fn()
    } catch (e) {
      problems.push(e.message)
      return null
    }
  }

  // 1. Sources
  const names = [...new Set([...sources(base.dir), ...sources(test.dir)])].sort()
  const read = (d, f) => (existsSync(join(d, f)) ? readFileSync(join(d, f)) : null)
  const changed = names.filter((f) => {
    const x = read(base.dir, f), y = read(test.dir, f)
    return !x || !y || !x.equals(y)
  })
  const config = [
    manifest(base.dir) !== manifest(test.dir) && 'package.json (outside scripts and gallery)',
    rootFile(base, 'vite.config.shared.js') !== rootFile(test, 'vite.config.shared.js') && 'the repo\'s vite.config.shared.js',
    lockedThree(base) !== lockedThree(test) && 'the locked version of three (package-lock.json)',
  ].filter(Boolean)
  if (!changed.length && !config.length) return { code: 2, problems, report: ['base and test sources are identical: nothing to check'] }
  // (the file that holds the test's block; the base's, before the hooks,
  // holds none, so it is compared as the same file)
  const bf = blockOf(test.dir).file
  for (const f of changed) if (f !== bf) problems.push(`source ${f} ${!read(base.dir, f) ? 'is only in the test' : !read(test.dir, f) ? 'is only in the base' : 'differs'}`)
  for (const c of config) problems.push(`${c} differs`)
  if (changed.includes(bf)) {
    const sb = tryIt(() => split(readFileSync(join(base.dir, bf), 'utf8'), `base ${bf}`))
    const st = tryIt(() => split(readFileSync(join(test.dir, bf), 'utf8'), bf))
    if (sb && st) {
      if (sb.outside !== st.outside) problems.push(`${bf} differs outside its ?debug block (from line ${lineOf(sb.outside, st.outside)})`)
      const missing = HOOKS.filter((h) => !new RegExp(`\\b${h}\\b`).test(st.body))
      if (missing.length) problems.push(`the ?debug block lacks hooks: ${missing.join(', ')}`)
      else if (HOOKS.every((h) => new RegExp(`\\b${h}\\b`).test(sb.body))) problems.push('the base already has the hooks: pass --base <the commit before them>')
    }
  }
  report.push(`sources: ${names.length} files and the build config; ${[...changed, ...config].join(', ') || 'none'} changed`)

  // 2, 3. Builds: files paired by their un-hashed names
  for (const flavour of ['unminified', 'identifiers kept']) {
    const [db, dt] = await Promise.all([build(base.dir, flavour), build(test.dir, flavour)])
    const byName = (d) => {
      const m = new Map(builtFiles(d).map((f) => [strip(f), f]))
      if (m.size !== builtFiles(d).length) problems.push(`${flavour} build: two files share an un-hashed name`)
      return m
    }
    const mb = byName(db), mt = byName(dt)
    const notes = []
    for (const k of [...new Set([...mb.keys(), ...mt.keys()])].sort()) {
      if (!mb.has(k) || !mt.has(k)) {
        problems.push(`${flavour} build: ${k} is in only one build`)
        continue
      }
      const rb = readFileSync(join(db, mb.get(k))), rt = readFileSync(join(dt, mt.get(k)))
      if (!/\.(js|css|html)$/.test(k)) {
        if (!rb.equals(rt)) problems.push(`${flavour} build: ${k} differs`)
        continue
      }
      const x = strip(rb.toString('utf8')), y = strip(rt.toString('utf8'))
      if (x === y) continue
      if (!k.endsWith('.js')) {
        problems.push(`${flavour} build: ${k} differs`)
        continue
      }
      const bx = tryIt(() => split(x, `${flavour} build: base ${k}`)), by = tryIt(() => split(y, `${flavour} build: ${k}`))
      if (!bx || !by) continue
      if (bx.outside !== by.outside) problems.push(`${flavour} build: ${k} differs outside the ?debug block (from line ${lineOf(bx.outside, by.outside)})`)
      else notes.push(`${k} differs only inside the ?debug block (${bx.body.length} → ${by.body.length} chars)`)
    }
    report.push(`build, ${flavour}: ${mt.size} files; ${notes.join('; ') || 'identical'}`)
  }
  return { code: problems.length ? 1 : 0, problems, report }
}

// The working tree's own block, which no comparison above reaches (the
// hooks commit's is main.js's): found by blockOf in app/boot.js, exactly one
// (split), with every hook, and its guard and its end inside boot(), so the
// self-test's edits before and after it run in the page's boot as they ran
// in main.js's top level. Returns what is wrong ([] for nothing).
function ownBlock(dir) {
  const { file, end } = blockOf(dir)
  if (file !== 'app/boot.js' || end < 0) return [`the working tree's ?debug block is ${end < 0 ? 'nowhere' : `in ${file}`}, not in app/boot.js`]
  const text = readFileSync(join(dir, file), 'utf8'), bad = []
  let body = null
  try {
    body = split(text, file).body
  } catch (e) {
    bad.push(e.message)
  }
  const missing = body ? HOOKS.filter((h) => !new RegExp(`\\b${h}\\b`).test(body)) : []
  if (missing.length) bad.push(`its block lacks hooks: ${missing.join(', ')}`)
  const fn = parseAst(text).body.map((n) => (n.type === 'ExportNamedDeclaration' ? n.declaration : n)).find((n) => n?.type === 'FunctionDeclaration' && n.id.name === 'boot')
  if (!fn) return [...bad, `${file} declares no boot()`]
  const inside = (at) => fn.body.start < at && at < fn.body.end
  const guard = text.indexOf("if (params.has('debug')) {")
  if (!inside(guard)) bad.push(`its guard (at ${guard}) is outside boot()`)
  if (!inside(end)) bad.push(`its end (at ${end}) is outside boot()`)
  return bad
}

const { values: a } = parseArgs({ options: { base: { type: 'string' }, ref: { type: 'string' }, dir: { type: 'string' }, 'self-test': { type: 'boolean' } } })
const hooks = readHooks()
const testRef = a.dir ? null : a.ref ?? hooks
const baseRef = a.base ?? (hooks === 'WORKTREE' ? 'HEAD' : `${hooks}~1`)
const sideOf = (ref, dir) => ({ dir: dir ?? codeDir(ref), ref: ref === 'WORKTREE' ? null : ref })
const test = a.dir ? sideOf(null, resolve(a.dir)) : sideOf(testRef)
const base = sideOf(baseRef)
const label = a.dir ? test.dir : testRef === 'WORKTREE' ? 'the working tree' : testRef
let code

if (!a['self-test']) {
  console.log(`hooks inert? base ${baseRef} vs ${label}`)
  const r = await check(base, test)
  for (const l of r.report) console.log(`  ${l}`)
  if (r.code === 2) {
    const hint = hooks === 'WORKTREE' ? '' : ` (the hooks commit is ${hooks}; its parent is the code before them)`
    console.log(`\nnothing to check: pass --base <the commit before the hooks>${hint}`)
  } else console.log(r.code ? `\nNOT inert:\n  ${r.problems.join('\n  ')}` : '\nhooks are inert: the app differs only inside the ?debug block')
  code = r.code
} else {
  // Copies of the code under test, each with one edit, and the verdict each
  // must get against the base. An edit outside the block's body (before it,
  // after its closing brace, an else branch, a second guard, another module,
  // the build config, a dependency) runs for every player and must fail; an
  // edit inside it, or to package.json's scripts, must pass.
  const GUARD = "if (params.has('debug')) {"
  // the file holding the block, and where its `if` ends: the edits after it
  // go there (main.js's ended the file; app/boot.js's ends its boot())
  const { file: BF, end: END } = blockOf(test.dir)
  const main = readFileSync(join(test.dir, BF), 'utf8')
  if (END < 0 || main.split(GUARD).length !== 2) throw new Error(`the self-test expects ${BF} to hold one ?debug block`)
  const edit = (file, fn) => (dir) => writeFileSync(join(dir, file), fn(readFileSync(join(dir, file), 'utf8')))
  // text put straight after the block's closing brace
  const after = (text) => edit(BF, (m) => `${m.slice(0, END)}${text}${m.slice(END)}`)
  const pkg = (fn) => edit('package.json', (s) => JSON.stringify(fn(JSON.parse(s)), null, 2) + '\n')
  const cases = [
    ['the code under test', null, 0],
    ['the base itself, unchanged', 'base', 2],
    ['a statement inside the block', edit(BF, (m) => m.replace(GUARD, `${GUARD}\n  S.debugging = true`)), 0],
    ['a statement before the block', edit(BF, (m) => m.replace(GUARD, `S.seed = 12345\n${GUARD}`)), 1],
    ['a statement after the block', after('\nS.seed = 12345\n'), 1],
    ['an else branch', after(' else S.seed = 12345\n'), 1],
    ['a second ?debug block', after(`\n${GUARD}\n  S.seed = 12345\n}\n`), 1],
    ['a change in rules.js', edit('rules.js', (s) => {
      if (!s.includes('rng() * 6')) throw new Error('rules.js has no d6 to change')
      return s.replace('rng() * 6', 'rng() * 5')
    }), 1],
    ['a new module in a subdirectory', (dir) => execFileSync('sh', ['-c', `mkdir -p "${dir}/core" && echo 'export const X = 1' > "${dir}/core/x.js"`]), 1],
    ['an edit to vite.config.js', edit('vite.config.js', (s) => `${s}// edited\n`), 1],
    ['a dependency bump', pkg((p) => ({ ...p, dependencies: { ...p.dependencies, three: '^0.170.0' } })), 1],
    ['a scripts-only edit', pkg((p) => ({ ...p, scripts: { ...p.scripts, extra: 'node -v' } })), 0],
  ]
  console.log(`hooks-inert self-test: base ${baseRef} vs edited copies of ${label}`)
  let bad = 0
  for (const [i, [what, fn, want]] of cases.entries()) {
    let side = test
    if (fn) {
      // copyCode skips dist/, sim/ and node_modules/, which never ship anyway
      const dir = copyCode(fn === 'base' ? base.dir : test.dir, join(out, 'copies', `${i}`))
      if (typeof fn === 'function') fn(dir)
      side = { dir, ref: fn === 'base' ? base.ref : test.ref }
    }
    const r = await check(base, side)
    const ok = r.code === want
    if (!ok) bad++
    console.log(`  ${ok ? 'ok  ' : 'BAD '} ${what.padEnd(32)} exit ${r.code} (want ${want})${r.problems.length ? `: ${r.problems.join('; ')}` : ''}`)
  }
  // the working tree's own app/boot.js, which none of the cases reach
  // (they edit the hooks commit's main.js)
  const own = ownBlock(PKG)
  if (own.length) bad++
  console.log(`  ${own.length ? 'BAD ' : 'ok  '} ${"the working tree's own block".padEnd(32)} ${own.length ? own.join('; ') : 'app/boot.js: one ?debug block, every hook, inside boot() (no build)'}`)
  console.log(bad ? `\nself-test FAILED: ${bad} wrong verdicts` : '\nself-test passed: every edit outside the block is caught, and only those')
  code = bad ? 1 : 0
}
rmSync(out, { recursive: true, force: true })
process.exit(code)
