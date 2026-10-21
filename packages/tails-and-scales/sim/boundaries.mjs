// The layer rules (DESIGN §1.2): which code may import which, and what the
// consensus code may never contain. Every peer folds the same log through
// the same core, so core/ and data/ must run alike on every engine and in
// plain Node; match/ is the netplay rules over them, present/ the pure view
// models, net/ the only door to Automerge, and the view (view/, input/, ui/,
// app/ and the root files, main.js among them) everything above.
//
// It reads every .js file of the package (not sim/, dist/ or node_modules/)
// and checks:
//   1. the static import graph (import … from, export … from, a bare import,
//      each statement read across its lines) and dynamic import(): each
//      layer imports only what its row allows:
//        core/, data/     each other only, and no package at all
//        match/           core/, data/, match/
//        present/         core/, match/, present/: not data/
//        net/             core/, match/, net/, @automerge/*
//        the view         anything above, but net/ only through import()
//      and only net/ names @automerge/*; an import that leads nowhere fails;
//   2. the core's surface (§4.1 rule 1: only consensus code draws, and a
//      preview asks through core's preview(), §2.2): the layers above the
//      consensus code import from core/ only the modules listed in SURFACE
//      below, and not the names listed beside each (nor all of such a
//      module, through `import *`, `export * from` or import()):
//        the view         index.js but apply, queries.js, rules.js but d6
//                         and roll, match.js, nav.js, dmath.js, util.js,
//                         terrain/recipes.js
//        match/           index.js
//        present/         queries.js, rules.js but d6 and roll, index.js
//                         but createMatch and apply ("read-only queries")
//        net/             index.js but createMatch and apply
//      so core/rng.js, engine.js, commands.js, actions/ and ai/ (the code
//      that draws) are on no layer's surface; index.js's createMatch and
//      apply fold commands, and draw: apply is the Session's (match/'s), a
//      match is created by match/ or the view (the title's backdrop, a match
//      of its own that never rolls). The doors (every module on a surface,
//      and data/, which the view imports whole) pass on nothing that draws:
//      none of rules.js's dice, nothing of engine.js, commands.js, actions/
//      or ai/ but the queries CROSS lists (queries.js's, index.js's legal,
//      and, R8, commands.js's list of kinds, KINDS, for the envelope),
//      and all of a module (`export *`, a namespace) only if it is a door
//      itself. No module of core/ or data/ passes on anything of core/rng.js
//      but its rngState query. A binding is followed through `export {…}`
//      (with or without `from`), `export const x = name` (or `ns.name`),
//      `export default name`, and a module-level `const x = name` alias;
//      not through a function that wraps a draw (`export const f = (G) =>
//      d6(G)` in a door), which only parity sees, on the paths the corpus
//      runs;
//   3. the banned tokens, in the code with its comments taken out:
//        core/, data/     the DOM (document, window, location, localStorage,
//                         requestAnimationFrame), async, await, Promise,
//                         Math.random, Date, performance, Math.hypot (core's
//                         dmath since R1), Math other than as Math.<member>
//                         (Math['random'], `const { random } = Math`, an
//                         alias, Math passed on), the timers and task queues
//                         (setTimeout, setInterval, setImmediate,
//                         queueMicrotask, requestIdleCallback), crypto,
//                         process and globalThis; module-level mutable state: a
//                         module-level let or var (exported or not), a
//                         module-level Map or WeakMap (a cache), an empty
//                         Set or WeakSet (`new Set()`, `new Set([])`), an
//                         empty array or object literal, or a bare
//                         Object.create(null) (one only filled later), as
//                         any declarator of a one-line declaration; a
//                         lookup table filled where it is declared is a
//                         constant, and sim/data-check.mjs holds every
//                         exported one frozen
//        match/           the DOM, async, await, Promise; (R8) and the
//                         host's: Math.random, Date, performance, the
//                         timers, crypto, process, globalThis, Math other
//                         than as Math.<member> (the Folder's verdicts
//                         depend on the entry list alone); and (R8's
//                         fixer, round 2) core's module-level mutable
//                         state (several Folders share a process: every
//                         peer of sim/merge-sim.mjs, §4.1 rule 13)
//        present/         the DOM
//      (sin, cos, tan, atan, atan2, exp, pow and log join core's ban at N0,
//      §0.2 #10: until then their count is only reported);
//   4. sim/flag-lint.mjs's key/text/fx ban over core/ and data/, with its
//      allow-list (data/schema.js names .fx and .abilities to validate them;
//      core/actions/shoot.js carries a weapon's look to the view), each
//      entry for those files matching exactly its count.
// The top level is told by indentation (the code puts module-level
// declarations at column 0, and everything nested deeper).
//
//   node sim/boundaries.mjs [--dir <packageDir> | --ref <git ref>]
//   node sim/boundaries.mjs --self-test     edits in memory, each of which
//                                           must fail it (and some that must
//                                           not), on the working tree
//
// Exit 0 when every rule holds (the self-test: every edit gets its
// verdict), 1 otherwise.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, posix } from 'node:path'
import { parseArgs } from 'node:util'
import { dirFromArgs } from './oracle/pin.mjs'
import { BANNED, ALLOW, lintSource } from './flag-lint.mjs'

const LAYERS = ['core', 'data', 'match', 'present', 'net', 'view', 'input', 'ui', 'app']
const VIEW = new Set(['view', 'input', 'ui', 'app', 'root'])
const layerOf = (f) => (f.includes('/') && LAYERS.includes(f.split('/')[0]) ? f.split('/')[0] : 'root')

// which layers each may import (relative imports), and which packages
const MAY = {
  core: { layers: ['core', 'data'], packages: [] },
  data: { layers: ['core', 'data'], packages: [] },
  match: { layers: ['core', 'data', 'match'], packages: [] },
  present: { layers: ['core', 'match', 'present'], packages: [] },
  net: { layers: ['core', 'match', 'net'], packages: ['@automerge/'] },
}

// The core's surface (rule 2): the modules of core/ each layer above the
// consensus code may import, each with the names it may not take from it.
const DICE = ['d6', 'roll']
const FOLDS = ['createMatch', 'apply']
const VIEW_CORE = {
  'core/index.js': ['apply'], 'core/queries.js': [], 'core/rules.js': DICE, 'core/match.js': [],
  'core/nav.js': [], 'core/dmath.js': [], 'core/util.js': [], 'core/terrain/recipes.js': [],
}
const SURFACE = {
  match: { 'core/index.js': [] },
  present: { 'core/queries.js': [], 'core/rules.js': DICE, 'core/index.js': FOLDS },
  net: { 'core/index.js': FOLDS },
}
for (const l of VIEW) SURFACE[l] = VIEW_CORE
const WHY = {
  d6: "the dice are the core's (§4.1 rule 1)",
  roll: "the dice are the core's (§4.1 rule 1)",
  apply: 'a command reaches the match only through the Session (match/, §2.5, §2.6)',
  createMatch: 'a match is created by match/ (or the view, for the title\'s backdrop: §2.6)',
}
// the code that draws, and what of it a door may pass on: the queries
const DRAWS = /^core\/(rng\.js|engine\.js|commands\.js|actions\/|ai\/)/
const CROSS = {
  'core/queries.js': [
    'moveMode', 'forbidMask', 'movePlan', 'validEnd', 'nearestValid', 'canShoot', 'shotInfo', 'shootTargets',
    'canCharge', 'chargeTargets', 'chargePlan', 'chargeSpots', 'rngState',
  ],
  // (R8) KINDS: the command kinds, a frozen list of names, which
  // match/envelope.js decodes no other than
  'core/index.js': ['legal', 'KINDS'],
}
const isDoor = (f) => f.startsWith('data/') || Object.values(SURFACE).some((s) => f in s)

const DOM = [/\bdocument\b/, /\bwindow\b/, /\blocation\b/, /\blocalStorage\b/, /\brequestAnimationFrame\b/]
const ASYNC = [/\basync\b/, /\bawait\b/, /\bPromise\b/]
// what the host lends that differs from run to run or from engine to engine:
// Math only as Math.<member> (so no computed member, alias or destructuring
// of it can reach random or hypot unseen), timers and the queues (as
// asynchronous as a Promise), and the host's own objects
const HOST = [
  /\bMath\s*\.\s*random\b/, /\bMath\s*\.\s*hypot\b/, /\bMath\b(?!\s*\.)/, /\bDate\b/, /\bperformance\b/,
  /\b(setTimeout|setInterval|setImmediate|queueMicrotask|requestIdleCallback)\b/, /\bcrypto\b/, /\bprocess\b/, /\bglobalThis\b/,
]
const TOKENS = {
  core: [...DOM, ...ASYNC, ...HOST],
  // (R8) the Folder is the replicated authority: its verdicts depend on the
  // entry list alone, never on the clock, a random draw, a timer or the
  // host (§2.6), so match/ is held to the consensus code's host tokens too
  // (an entry id's random part is handed to the Session by the app)
  match: [...DOM, ...ASYNC, ...HOST],
  present: DOM,
}
TOKENS.data = TOKENS.core
// how a problem names the token it found
const TOKEN_NAME = new Map([
  [HOST[0], 'Math.random'], [HOST[1], 'Math.hypot'], [HOST[2], 'Math other than as Math.<member> (computed, aliased, destructured or passed on)'],
  [HOST[5], 'a timer or a task queue'],
])
const tokenName = (re) => TOKEN_NAME.get(re) ?? re.source.replace(/\\b|\\/g, '')
// N0's: reported, not yet banned
const N0 = /\bMath\.(sin|cos|tan|atan|atan2|exp|pow|log)\b/g
// module-level mutable state: a let or var; and, as any declarator of a
// module-level const, a cache or a container filled later
const LET = /^(export\s+)?(let|var)\s/
const DECL = /^(?:export\s+)?const\s+(.*)$/
const STATE = [
  [/^new\s+(Map|WeakMap)\b/, 'a module-level Map or WeakMap'],
  [/^new\s+(Set|WeakSet)\(\s*(\[\s*\]\s*)?\)\s*$/, 'a module-level empty Set or WeakSet, filled later'],
  [/^(\[\s*\]|\{\s*\})\s*$/, 'a module-level empty array or object, filled later'],
  [/^Object\.create\(\s*null\s*\)\s*$/, 'a module-level empty Object.create(null), filled later'],
]
// a declaration's declarators, split at its top-level commas: [name, init]
function declarators(s) {
  const out = []
  let depth = 0, from = 0, quote = null
  for (let i = 0; i <= s.length; i++) {
    const c = s[i]
    if (quote) {
      if (c === '\\') i++
      else if (c === quote) quote = null
      continue
    }
    if (c === '"' || c === "'" || c === '`') quote = c
    else if ('([{'.includes(c)) depth++
    else if (')]}'.includes(c)) depth--
    else if ((c === ',' && !depth) || i === s.length) {
      const m = /^\s*([\w$]+)\s*=\s*([\s\S]*?)\s*;?\s*$/.exec(s.slice(from, i))
      if (m) out.push([m[1], m[2]])
      from = i + 1
    }
  }
  return out
}

// Where a line's `//` comment starts (at its start or after a space), outside
// the line's quotes; -1 if it has none. A quote the line doesn't close (a
// regex literal's, say) keeps the rest of the line as code, so a banned
// token after it is seen, never missed.
function lineComment(l) {
  let quote = null
  for (let i = 0; i < l.length; i++) {
    const c = l[i]
    if (quote) {
      if (c === '\\') i++
      else if (c === quote) quote = null
    } else if (c === '"' || c === "'" || c === '`') quote = c
    else if (c === '/' && l[i + 1] === '/' && (!i || /\s/.test(l[i - 1]))) return i
  }
  return -1
}

// The code without its comments, line for line (crude, as flag-lint's: a
// `//` comment is cut outside the line's quotes, a block comment only where
// no quote comes before its opener, and no comment opener may stand inside
// a regex literal).
function strip(text) {
  let inBlock = false
  return text.split('\n').map((raw) => {
    let l = raw
    if (inBlock) {
      const end = l.indexOf('*/')
      if (end < 0) return ''
      l = l.slice(end + 2)
      inBlock = false
    }
    const cut = lineComment(l)
    if (cut >= 0) l = l.slice(0, cut)
    for (let start; (start = l.indexOf('/*')) >= 0 && !/['"`]/.test(l.slice(0, start));) {
      const end = l.indexOf('*/', start + 2)
      if (end < 0) {
        inBlock = true
        l = l.slice(0, start)
        break
      }
      l = l.slice(0, start) + l.slice(end + 2)
    }
    return l
  })
}

// A file's module statements, each read across its lines in the comment-
// stripped code: { imports, exports }.
//   imports: [{ spec, dynamic, line, names }], every import … from, export
//     … from, bare import and import(); names: what it takes from the
//     module ('*' for all of it, 'default'), [] for a bare import, null for
//     import() (all of it, at run time)
//   exports: [{ spec, name, line }], every binding the file passes on that
//     came from another module: an `export … from` (name: what it takes),
//     and an `export {…}`, `export const x = name` (or `ns.name`) or
//     `export default name` of an imported binding or of a module-level
//     `const x = name` alias of one (spec and name: where it came from)
const ID = '[\\w$]+'
const list = (s) => s.split(',').map((n) => n.trim()).filter(Boolean).map((n) => {
  const [name, as = name] = n.split(/\s+as\s+/)
  return { name, as }
})
function statements(lines) {
  const text = lines.join('\n')
  const lineOf = (i) => text.slice(0, i).split('\n').length
  const imports = [], exports = []
  const bound = new Map() // a local name → { spec, name } it was imported as
  const all = (re) => [...text.matchAll(re)].sort((a, b) => a.index - b.index)
  for (const m of all(/^[ \t]*import\s*([\w$\s{},*]*?)\s*from\s*['"]([^'"]+)['"]/gm)) {
    const [, clause, spec] = m, names = []
    const ns = new RegExp(`\\*\\s*as\\s+(${ID})`).exec(clause)
    if (ns) names.push('*'), bound.set(ns[1], { spec, name: '*' })
    const braces = /\{([^}]*)\}/.exec(clause)
    if (braces) for (const { name, as } of list(braces[1])) names.push(name), bound.set(as, { spec, name })
    const def = new RegExp(`^\\s*(${ID})\\s*(,|$)`).exec(clause)
    if (def) names.push('default'), bound.set(def[1], { spec, name: 'default' })
    imports.push({ spec, dynamic: false, line: lineOf(m.index), names })
  }
  for (const m of all(/^[ \t]*import\s*['"]([^'"]+)['"]/gm)) imports.push({ spec: m[1], dynamic: false, line: lineOf(m.index), names: [] })
  for (const m of all(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) imports.push({ spec: m[1], dynamic: true, line: lineOf(m.index), names: null })
  for (const m of all(new RegExp(`^[ \\t]*export\\s*(\\*(?:\\s*as\\s+${ID})?|\\{([\\w$\\s,]*)\\})\\s*from\\s*['"]([^'"]+)['"]`, 'gm'))) {
    const spec = m[3], line = lineOf(m.index)
    const names = m[2] === undefined ? ['*'] : list(m[2]).map((n) => n.name)
    imports.push({ spec, dynamic: false, line, names })
    for (const name of names) exports.push({ spec, name, line })
  }
  // where a local name (or ns.member) came from, if from an import
  const source = (local, member) => {
    const b = bound.get(local)
    return !b ? null : b.name === '*' && member ? { spec: b.spec, name: member } : b
  }
  for (const m of all(new RegExp(`^(?:const|let|var)\\s+(${ID})\\s*=\\s*(${ID})(?:\\.(${ID}))?\\s*;?\\s*$`, 'gm'))) {
    const b = source(m[2], m[3])
    if (b) bound.set(m[1], b)
  }
  const pass = (local, member, at) => {
    const b = source(local, member)
    if (b) exports.push({ ...b, line: lineOf(at) })
  }
  for (const m of all(/^[ \t]*export\s*\{([\w$\s,]*)\}(?!\s*from\b)/gm)) for (const { name } of list(m[1])) pass(name, null, m.index)
  for (const m of all(/^[ \t]*export\s+(?:const|let|var)\s+(.*)$/gm)) {
    for (const [, init] of declarators(m[1])) {
      const r = new RegExp(`^(${ID})(?:\\.(${ID}))?$`).exec(init)
      if (r) pass(r[1], r[2], m.index)
    }
  }
  for (const m of all(new RegExp(`^[ \\t]*export\\s+default\\s+(${ID})(?:\\.(${ID}))?\\s*;?\\s*$`, 'gm'))) pass(m[1], m[2], m.index)
  imports.sort((a, b) => a.line - b.line)
  return { imports, exports }
}

// Check the package's sources, `files` a Map of path (posix, from the
// package root) → text. Returns { problems: [text], n0: count, edges }.
export function check(files) {
  const problems = []
  const say = (f, line, what) => problems.push(`${f}${line ? `:${line}` : ''} ${what}`)
  const who = (layer) => (layer === 'root' ? 'the view' : VIEW.has(layer) ? `the view (${layer}/)` : `${layer}/`)
  const short = (m) => m.replace(/^core\//, '')
  let n0 = 0, edges = 0
  for (const [f, text] of files) {
    const layer = layerOf(f)
    const lines = strip(text)
    const { imports, exports } = statements(lines)
    // 1. the imports
    for (const { spec, dynamic, line, names } of imports) {
      edges++
      if (!spec.startsWith('.')) {
        // a package
        if (spec.startsWith('@automerge/') && layer !== 'net') say(f, line, `imports ${spec}: only net/ may name Automerge`)
        else if (MAY[layer] && !MAY[layer].packages.some((p) => spec.startsWith(p))) say(f, line, `imports the package ${spec}: ${layer}/ imports no package${layer === 'net' ? ' but @automerge/*' : ''}`)
        continue
      }
      const to = posix.normalize(posix.join(posix.dirname(f), spec))
      if (to.startsWith('..') || !files.has(to)) {
        say(f, line, `imports ${spec}, which is no source file of the package (${to})`)
        continue
      }
      const target = layerOf(to)
      if (MAY[layer] && !MAY[layer].layers.includes(target)) say(f, line, `imports ${to}: ${layer}/ may import only ${MAY[layer].layers.map((l) => `${l}/`).join(', ')}`)
      if (VIEW.has(layer) && target === 'net' && !dynamic) say(f, line, `imports ${to} statically: the view reaches net/ only through import()`)
      // 2. the core's surface
      const surface = SURFACE[layer]
      if (!surface || target !== 'core') continue
      const refused = surface[to]
      if (!refused) {
        if (to === 'core/rng.js') say(f, line, `imports core/rng.js: the dice are the core's, and ${who(layer)} asks through its preview() (§4.1 rule 1)`)
        else say(f, line, `imports ${to}${DRAWS.test(to) ? ', which draws' : ''}: ${who(layer)} may import from core/ only ${Object.keys(surface).map(short).join(', ')} (§1.2, the core's surface)`)
        continue
      }
      if (!refused.length) continue
      const whole = !names || names.includes('*')
      const took = whole ? refused : names.filter((n) => refused.includes(n))
      if (took.length) {
        const why = [...new Set(took.map((n) => WHY[n]))].join('; ')
        say(f, line, whole ? `takes all of ${to} (${dynamic ? 'import()' : '*'}), ${took.join(' and ')} among it: ${who(layer)} may not take ${took.join(' or ')}, as ${why}` : `imports ${took.join(', ')} from ${to}: ${why}`)
      }
    }
    // 2. what the consensus code passes on
    if (layer === 'core' || layer === 'data') {
      for (const { spec, name, line } of exports) {
        if (!spec.startsWith('.')) continue
        const from = posix.normalize(posix.join(posix.dirname(f), spec))
        const what = name === '*' ? 'all of it' : name
        if (from === 'core/rng.js') {
          if (name !== 'rngState') say(f, line, `re-exports ${what} from core/rng.js: only its rngState query leaves the dice's module (§4.1 rule 1)`)
          continue
        }
        if (!isDoor(f)) continue
        if (from === 'core/rules.js' && (name === '*' || DICE.includes(name))) say(f, line, `re-exports ${name === '*' ? 'all of core/rules.js, the dice among it' : `${name} from core/rules.js`}: a door of the core's surface passes on none of the dice (§4.1 rule 1)`)
        else if (DRAWS.test(from) && !(CROSS[f] ?? []).includes(name)) say(f, line, `re-exports ${what} from ${from}, which draws: ${CROSS[f] ? `${f} passes on of that code only ${CROSS[f].join(', ')}` : 'a door of the core\'s surface passes on none of that code'} (§1.2)`)
        else if (name === '*' && !isDoor(from) && !DRAWS.test(from)) say(f, line, `re-exports all of ${from}, which is no door of the core's surface itself (§1.2)`)
      }
    }
    // 3. the tokens and module-level state
    if (TOKENS[layer]) {
      lines.forEach((l, i) => {
        for (const re of TOKENS[layer]) if (re.test(l)) say(f, i + 1, `${layer}/ contains ${tokenName(re)}: ${l.trim().slice(0, 100)}`)
        n0 += (l.match(N0) ?? []).length
      })
    }
    if (layer === 'core' || layer === 'data' || layer === 'match') {
      lines.forEach((l, i) => {
        if (LET.test(l)) say(f, i + 1, `a module-level let or var in consensus code: ${l.trim().slice(0, 100)}`)
        const d = DECL.exec(l)
        if (!d) return
        for (const [, init] of declarators(d[1])) {
          for (const [re, what] of STATE) if (re.test(init)) say(f, i + 1, `${what} in consensus code: ${l.trim().slice(0, 100)}`)
        }
      })
    }
  }
  // 4. flag-lint's ban over core/ and data/, with their allow entries
  const used = new Map(ALLOW.map((a) => [a, 0]))
  for (const [f, text] of files) {
    if (!/^(core|data)\//.test(f)) continue
    for (const h of lintSource(f, text, used)) say(h.f, h.line, `${h.what} (flag-lint's ban): ${h.text}`)
  }
  for (const a of ALLOW) if (/^(core|data)\//.test(a[0]) && used.get(a) !== a[2]) say(a[0], 0, `flag-lint's allow entry "${a[1]}" matches ${used.get(a)} line(s), not ${a[2]}`)
  return { problems, n0, edges }
}

// The package's sources: every .js file but sim/, dist/ and node_modules/.
export function sources(dir) {
  const files = new Map()
  const walk = (d) => {
    for (const e of readdirSync(join(dir, d), { withFileTypes: true })) {
      const f = d ? `${d}/${e.name}` : e.name
      if (e.isDirectory()) {
        if (!['sim', 'dist', 'node_modules'].includes(f) && !e.name.startsWith('.')) walk(f)
      } else if (e.name.endsWith('.js') && f !== 'vite.config.js') files.set(f, readFileSync(join(dir, f), 'utf8'))
    }
  }
  walk('')
  return files
}

const { values: a } = parseArgs({ options: { dir: { type: 'string' }, ref: { type: 'string' }, 'self-test': { type: 'boolean' } } })

if (a['self-test']) {
  const base = sources(dirFromArgs({}))
  let bad = 0
  // [what, edit(files) → files, must it fail, the problem it must name]
  const append = (f, line) => (m) => new Map(m).set(f, `${m.get(f)}\n${line}\n`)
  const add = (f, text) => (m) => new Map(m).set(f, text)
  const both = (x, y) => (m) => y(x(m))
  const CASES = [
    ['the working tree as it stands', (m) => m, false],
    ['core/ importing three.js', append('core/engine.js', "import * as THREE from 'three'"), true, /imports the package three/],
    ['core/ importing the view', append('core/engine.js', "import { TerrainView } from '../view/terrain.js'"), true, /core\/ may import only/],
    ['data/ importing match/', append('data/mission.js', "import { Session } from '../match/session.js'"), true, /data\/ may import only/],
    ['an import that leads nowhere', append('core/rules.js', "import { x } from './nothing.js'"), true, /no source file/],
    ['core/ reading the clock (Date)', append('core/rules.js', 'export const now = () => Date.now()'), true, /contains Date/],
    ['core/ rolling Math.random', append('core/rules.js', 'export const r = () => Math.random()'), true, /contains Math\.random/],
    ['core/ measuring with Math.hypot', append('core/queries.js', 'export const d = (a, b) => Math.hypot(a, b)'), true, /contains Math\.hypot/],
    ["core/ rolling Math['random']", append('core/rules.js', "export const r = () => Math['random']()"), true, /contains Math other than as Math\.<member>/],
    ['core/ rolling Math . random (spaced)', append('core/rules.js', 'export const r = () => Math . random()'), true, /contains Math\.random/],
    ['core/ destructuring Math', append('core/rules.js', 'const { random } = Math\nexport const r = () => random()'), true, /contains Math other than as Math\.<member>/],
    ['data/ aliasing Math', append('data/mission.js', 'const M = Math\nexport const r = () => M.random()'), true, /contains Math other than as Math\.<member>/],
    ['core/ setting a timer', append('core/engine.js', 'export const later = (f) => setTimeout(f, 0)'), true, /contains a timer or a task queue/],
    ['core/ queueing a microtask', append('core/engine.js', 'export const later = (f) => queueMicrotask(f)'), true, /contains a timer or a task queue/],
    ['core/ drawing from crypto', append('core/rules.js', 'export const r = () => crypto.getRandomValues(new Uint32Array(1))[0]'), true, /contains crypto/],
    ['core/ reading the process clock', append('core/rules.js', 'export const t = () => process.hrtime()'), true, /contains process/],
    ['data/ reaching globalThis', append('data/schema.js', "export const g = () => globalThis['Math']"), true, /contains globalThis/],
    ['a banned token after a string holding " //"', append('core/rules.js', "export const r = () => [' // ', Math.random()]"), true, /contains Math\.random/],
    ['core/ using Math.<member>, and names that only begin with a banned one', append('core/rules.js', 'export const f = (u) => (u.processed ? Math.floor(u.cryptoKey) : Math.PI)'), false],
    ['core/ touching the DOM', append('core/terrain/terrain.js', "export const el = () => document.body"), true, /contains document/],
    ['data/ awaiting', append('data/schema.js', 'export async function later() { return 1 }'), true, /contains async/],
    ['match/ awaiting', append('match/session.js', 'export const later = () => new Promise((r) => r())'), true, /contains Promise/],
    ['match/ touching the window', append('match/store.js', 'export const w = () => window.name'), true, /contains window/],
    // (R8) the Folder stays pure: no Automerge, no clock, no random draw
    ['match/ naming Automerge', append('match/fold.js', "import * as A from '@automerge/automerge'"), true, /only net\/ may name Automerge/],
    ['match/ importing a package', append('match/envelope.js', "import { nanoid } from 'nanoid'"), true, /match\/ imports no package/],
    ['match/ reading the clock (Date)', append('match/fold.js', 'export const now = () => Date.now()'), true, /contains Date/],
    ['match/ drawing Math.random', append('match/session.js', 'export const salt = () => Math.random().toString(36)'), true, /contains Math\.random/],
    ['match/ setting a timer', append('match/session.js', 'export const later = (f) => setTimeout(f, 0)'), true, /contains a timer or a task queue/],
    ['match/ importing the view', append('match/fold.js', "import { View } from '../view/index.js'"), true, /match\/ may import only/],
    ['present/ importing data/', append('present/mirror.js', "import { RACES } from '../data/schema.js'"), true, /present\/ may import only/],
    ['present/ touching the DOM', append('present/pace.js', 'export const p = () => requestAnimationFrame(() => {})'), true, /contains requestAnimationFrame/],
    ['the view importing core/rng.js', append('view/player.js', "import { draw } from '../core/rng.js'"), true, /imports core\/rng\.js/],
    ['main.js importing core/rng.js', append('main.js', "import { createRng } from './core/rng.js'"), true, /imports core\/rng\.js/],
    ['match/ importing core/rng.js', append('match/session.js', "import { draw } from '../core/rng.js'"), true, /imports core\/rng\.js/],
    ['present/ importing core/rng.js', append('present/mirror.js', "import { createRng } from '../core/rng.js'"), true, /imports core\/rng\.js/],
    ['net/ importing core/rng.js', add('net/dice.js', "import { draw } from '../core/rng.js'\nexport const d = draw\n"), true, /imports core\/rng\.js/],
    ['data/ importing core/rng.js (consensus code)', append('data/mission.js', "import { draw } from '../core/rng.js'"), false],
    ['core/ re-exporting the dice', append('core/queries.js', "export { draw as roll } from './rng.js'"), true, /re-exports draw from core\/rng\.js/],
    ['core/ re-exporting the dice across lines', append('core/queries.js', "export {\n  draw,\n} from './rng.js'"), true, /re-exports draw from core\/rng\.js/],
    ['core/ importing the dice, then exporting them', append('core/queries.js', "import { draw } from './rng.js'\nexport { draw }"), true, /re-exports draw from core\/rng\.js/],
    ['core/ exporting the dice under an alias', append('core/queries.js', "import { draw as die } from './rng.js'\nexport { die as toss }"), true, /re-exports draw from core\/rng\.js/],
    ['core/ exporting the dice as a const (export const x = draw)', append('core/rules.js', 'export const x = draw'), true, /re-exports draw from core\/rng\.js/],
    ['core/ exporting the dice as a later declarator', append('core/rules.js', 'export const y = 1, x = draw'), true, /re-exports draw from core\/rng\.js/],
    ['core/ exporting the dice through a module-level alias', append('core/rules.js', 'const die = draw\nexport default die'), true, /re-exports draw from core\/rng\.js/],
    ['core/ passing on rng.js as a namespace', append('core/match.js', "import * as dice from './rng.js'\nexport { dice }"), true, /re-exports all of it from core\/rng\.js/],
    ['queries.js re-exporting roll', append('core/queries.js', "export { roll } from './rules.js'"), true, /re-exports roll from core\/rules\.js/],
    ['queries.js re-exporting d6 it imported, as a const', append('core/queries.js', "import { d6 } from './rules.js'\nexport const die = d6"), true, /re-exports d6 from core\/rules\.js/],
    ['queries.js exporting roll through a namespace (export const r = R.roll)', append('core/queries.js', "import * as R from './rules.js'\nexport const r = R.roll"), true, /re-exports roll from core\/rules\.js/],
    ['queries.js re-exporting doAdvance',append('core/queries.js', "export { doAdvance } from './actions/move.js'"), true, /re-exports doAdvance from core\/actions\/move\.js, which draws/],
    ['index.js passing on all of the engine', append('core/index.js', "export * from './engine.js'"), true, /re-exports all of it from core\/engine\.js, which draws/],
    ['index.js passing on all of a module that is no door', append('core/index.js', "export * from './units.js'"), true, /re-exports all of core\/units\.js, which is no door/],
    ['match.js (a door) passing on rollOff', append('core/match.js', "export { rollOff } from './engine.js'"), true, /re-exports rollOff from core\/engine\.js, which draws/],
    ['data/ passing on the dice', append('data/mission.js', "export { d6 } from '../core/rules.js'"), true, /re-exports d6 from core\/rules\.js/],
    ['the view importing d6', append('main.js', "import { d6 } from './core/rules.js'"), true, /imports d6 from core\/rules\.js/],
    ['the view importing roll across lines', append('view/terrain.js', "import {\n  BOARD,\n  roll,\n} from '../core/rules.js'"), true, /imports roll from core\/rules\.js/],
    ['the view taking all of rules.js', append('main.js', "import * as R from './core/rules.js'"), true, /takes all of core\/rules\.js \(\*\), d6 and roll among it/],
    ['the view importing rules.js through import()', append('main.js', "const rules = () => import('./core/rules.js')"), true, /takes all of core\/rules\.js \(import\(\)\)/],
    ['the view importing rollOff from the engine', append('main.js', "import { rollOff } from './core/engine.js'"), true, /imports core\/engine\.js, which draws: the view may import from core\/ only/],
    ['the view importing doAdvance from an action', append('input/tools/charge-end.js', "import { doAdvance } from '../../core/actions/move.js'"), true, /imports core\/actions\/move\.js, which draws/],
    ['the view importing the AI', append('ui/theme.js', "import { aiPhase } from '../core/ai/policy.js'"), true, /imports core\/ai\/policy\.js, which draws/],
    ['the view importing apply', append('main.js', "import { apply } from './core/index.js'"), true, /imports apply from core\/index\.js: a command reaches the match only through the Session/],
    ['the view re-exporting the dice', append('view/clock.js', "export { d6 } from '../core/rules.js'"), true, /imports d6 from core\/rules\.js/],
    ['match/ taking all of rules.js', append('match/session.js', "import * as R from '../core/rules.js'"), true, /match\/ may import from core\/ only index\.js/],
    ['match/ importing the engine', append('match/store.js', "import { advance } from '../core/engine.js'"), true, /imports core\/engine\.js, which draws: match\/ may import from core\/ only index\.js/],
    ['match/ calling HANDLERS', append('match/session.js', "import { HANDLERS } from '../core/commands.js'"), true, /imports core\/commands\.js, which draws/],
    ['present/ importing an action', append('present/mirror.js', "import { doShoot } from '../core/actions/shoot.js'"), true, /imports core\/actions\/shoot\.js, which draws: present\/ may import from core\/ only/],
    ['present/ importing the commands', append('present/pace.js', "import { HANDLERS } from '../core/commands.js'"), true, /imports core\/commands\.js, which draws/],
    ['present/ importing apply', append('present/pace.js', "import { apply } from '../core/index.js'"), true, /imports apply from core\/index\.js/],
    ['present/ importing createMatch', append('present/mirror.js', "import { createMatch } from '../core/index.js'"), true, /imports createMatch from core\/index\.js/],
    ['present/ importing units.js (no query)', append('present/mirror.js', "import { relayout } from '../core/units.js'"), true, /present\/ may import from core\/ only queries\.js/],
    ['the view importing passes and woundNeed (one under an alias)', append('main.js', "import { passes as p2, woundNeed } from './core/rules.js'"), false],
    ['present/ importing a query, preview and a rules constant', append('present/pace.js', "import { alive } from '../core/queries.js'\nimport { preview, q } from '../core/index.js'\nimport { PHASES } from '../core/rules.js'"), false],
    ['match/ importing createMatch and apply', append('match/store.js', "import { createMatch, apply } from '../core/index.js'"), false],
    ['main.js importing net/ statically', both(add('net/repo.js', 'export const repo = 1\n'), append('main.js', "import { repo } from './net/repo.js'")), true, /reaches net\/ only through import\(\)/],
    ['main.js reaching net/ through import()', both(add('net/repo.js', 'export const repo = 1\n'), append('main.js', "const net = () => import('./net/repo.js')")), false],
    ['net/ importing Automerge', add('net/repo.js', "import * as A from '@automerge/automerge'\nexport const repo = A\n"), false],
    ['the view importing Automerge', append('main.js', "import * as A from '@automerge/automerge'"), true, /only net\/ may name Automerge/],
    ['core/ with a module-level let', append('core/rules.js', 'let rolled = 0'), true, /module-level let or var/],
    ['core/ with an exported module-level let', append('core/rules.js', 'export let rolled = 0'), true, /module-level let or var/],
    ['core/ with a module-level cache', append('core/queries.js', 'const memo = new Map()'), true, /module-level Map or WeakMap/],
    ['core/ with a module-level Set filled later', append('core/queries.js', 'const seen = new Set()'), true, /module-level empty Set or WeakSet/],
    ['core/ with a module-level Set of an empty list', append('core/queries.js', 'const seen = new Set([])'), true, /module-level empty Set or WeakSet/],
    ['core/ with a module-level Object.create(null) filled later', append('core/queries.js', 'const memo = Object.create(null)'), true, /empty Object\.create\(null\)/],
    ['core/ with a cache as a later declarator', append('core/queries.js', 'const a = 1, cache = new Map()'), true, /module-level Map or WeakMap/],
    ['data/ with a list filled later', append('data/mission.js', 'export const seen = []'), true, /empty array or object/],
    ['match/ with a module-level let', append('match/fold.js', 'let folds = 0'), true, /module-level let or var/],
    ['match/ with a module-level cache', append('match/envelope.js', 'const decoded = new Map()'), true, /module-level Map or WeakMap/],
    ['a table filled where it is declared (Object.create(null) and a Set)', append('core/rules.js', "const KIND = Object.assign(Object.create(null), { a: 1 }), SOME = new Set(['a'])\nexport const kind = (k) => KIND[k] ?? SOME.size"), false],
    ['a default parameter (no module-level state)', append('core/rules.js', 'export const f = (a, seen = new Map()) => seen.get(a)'), false],
    ['core/ testing a unit key', append('core/actions/move.js', "export const brute = (u) => u.key === 'brute'"), true, /a key test \(flag-lint's ban\)/],
    ['core/ reading ability text', append('core/actions/charge.js', 'export const sidewind = (u) => u.t.abilities.length'), true, /reads ability text/],
    ['a stale allow entry (shoot.js carrying its look one time fewer)', (m) => new Map(m).set('core/actions/shoot.js', m.get('core/actions/shoot.js').replace('fx: w.fx', 'fx: w.look')), true, /allow entry "fx: w\.fx" matches 2/],
    ['the word in a comment (core/: "no Promise, no window")', append('core/rules.js', '// no Promise, no window, no Math.random, no Date'), false],
    ['a nested let (not module-level)', append('core/rules.js', 'export function f() {\n  let k = 0\n  return k\n}'), false],
  ]
  console.log('boundaries self-test: edits in memory on the working tree')
  for (const [what, edit, fail, want] of CASES) {
    const { problems } = check(edit(base))
    const hit = want ? problems.find((p) => want.test(p)) : null
    const ok = fail ? !!hit : !problems.length
    if (!ok) bad++
    console.log(`  ${ok ? 'ok  ' : 'BAD '} ${what}: ${fail ? (hit ? `caught: ${hit.slice(0, 120)}` : `MISSED${problems.length ? ` (found only: ${problems[0].slice(0, 100)})` : ''}`) : problems.length ? `FLAGGED: ${problems[0].slice(0, 120)}` : 'passes'}`)
  }
  console.log(bad ? `\nboundaries self-test FAILED: ${bad} wrong verdict(s)` : '\nboundaries self-test passed')
  process.exit(bad ? 1 : 0)
}

const dir = dirFromArgs(a)
if (!existsSync(join(dir, 'core'))) {
  console.error(`boundaries: ${dir} has no core/ (code older than R4?)`)
  process.exit(2)
}
const files = sources(dir)
const { problems, n0, edges } = check(files)
const count = (l) => [...files.keys()].filter((f) => layerOf(f) === l).length
console.log(`boundaries: ${files.size} files (${[...LAYERS, 'root'].map((l) => [l, count(l)]).filter(([, n]) => n).map(([l, n]) => `${l === 'root' ? 'the root' : `${l}/`} ${n}`).join(', ')}), ${edges} imports, ${BANNED.length} flag-lint patterns over core/ and data/`)
for (const p of problems) console.log(`  FAIL ${p}`)
console.log(`  (N0's: ${n0} call(s) to Math.sin/cos/tan/atan/atan2/exp/pow/log left in core/ and data/, banned from N0)`)
console.log(problems.length ? `\nboundaries FAILED: ${problems.length} problem(s)` : '\nboundaries passed: every layer imports only what it may, and the consensus code holds none of what it must not')
process.exit(problems.length ? 1 : 0)
