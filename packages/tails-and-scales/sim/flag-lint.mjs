// The key/ability/fx lint (DESIGN §1.2, §2.8; R2). Abilities are flags on
// the race data, each read by one rules module, so rules code never decides
// anything by a unit's or race's key, by its name, by ability text or by a
// weapon's visual `fx`. This greps the code that holds rules for the tells:
//
//   .key === / == x.key / key != '…'     a unit key test, strict or loose (or
//                                         any key: a phase's or a keyboard's is
//                                         allowed below)
//   .race === / != x.race                a race test
//   [x.key] / [x.race] / [key]           a table keyed by unit or race (the
//                                         registry lookups RACES[x.race] and
//                                         race.units[key] are fine)
//   includes(x.key) / has( / get( / in   a key or race looked up in a list
//   switch (x.key) / switch (key)         a key or race switched on
//   x.key.includes( / .test(x.key)       a text or pattern test on a key or race
//   startsWith( / endsWith(              a text test (the old "Sidewind" check)
//   .name === / .short == / .name.includes(   a name test (names are copy;
//                                         RULES_ID leaves them out)
//   .abilities                           reading the ability text
//   .fx                                  reading a weapon's visual effect
//   RACES.serpent / ['fx'] / { fx } = w / k = u.key   the same, by another
//                                         route: named through the registry,
//                                         by string, destructured, aliased
//
// What rules code reads instead is data: the flags, `t.role`, `t.ai`, the
// stat line and weapons, the derived fields, and a seat's `edge`. Those are
// rule-bearing (RULES_ID hashes them), so testing them is the point.
//
// It covers main.js and ai.js (rules code until R4-R6 moves it into core/),
// the rules.js re-export, and everything under core/ and data/. main.js still
// holds the view too, so the presentation sites it keeps are listed below,
// each with why it is presentation. An allowed text excuses only itself: it
// is cut out of the line and the rest of the line is linted again, so a test
// added beside an allowed one is still caught. An entry that no longer
// matches exactly its count of lines fails, so the list can't go stale. (From
// R6, sim/boundaries.mjs runs this ban, allow-list included, over core/ and
// data/; data/schema.js names .fx and .abilities to validate them.)
//
//   node sim/flag-lint.mjs               lint the working tree
//   node sim/flag-lint.mjs --self-test   lint the R0 code (sim/lib.mjs's
//                                        LEGACY_REF, a fixed commit: not the
//                                        PIN, which moves on a re-record),
//                                        which must fail on every test R2
//                                        replaced with a flag, and a set of
//                                        lines that must (and must not) be
//                                        flagged
//
// Exit 0 clean (self-test: every case gets its verdict), else 1.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { PKG } from './oracle/pin.mjs'
import { legacyDir, LEGACY_REF } from './lib.mjs'

// a member path such as u, u.t, G.seats[s], e?.t or raceOf(G, s)
const P = String.raw`[\w$.?\[\]]*(?:\([^()]*\)[\w$.?\[\]]*)*`
// (every comparison is strict or loose: [!=]==? is ===, !==, == or !=)
const BANNED = [
  [new RegExp(String.raw`\.key\s*[!=]==?|[!=]==?\s*${P}\.key\b`), 'a key test'],
  [/(?<![\w$.]|typeof\s)key\s*[!=]==?\s*['"`]|['"`]\s*[!=]==?\s*key\b/, 'a key test'],
  [new RegExp(String.raw`\.race\s*[!=]==?|[!=]==?\s*${P}\.race\b`), 'a race test'],
  [/\[\s*[\w$.?]+\.key\s*\]/, 'a table keyed by unit key'],
  // a bare key, as after `const { key } = u`; a race's own units table,
  // race.units[key], is the registry lookup
  [/(?<!\.units)\[\s*key\s*\]/, 'a table keyed by a bare key'],
  // the registry itself, RACES[u.race] or RACES[G.seats[s].race], is the lookup
  [/(?<!\bRACES)\[\s*[\w$.?]+(?:\[[^[\]]*\][\w$.?]*)*\.race\s*\]/, 'a table keyed by race'],
  [new RegExp(String.raw`\b(includes|indexOf|lastIndexOf|has|get)\(\s*${P}\.(key|race)\s*[,)]|\.(key|race)\s+in\s`), 'a key or race looked up in a list'],
  [new RegExp(String.raw`\bswitch\s*\(\s*(?:${P}\.)?(key|race)\s*\)`), 'a switch on a key or race'],
  [/\.(key|race)\.(includes|indexOf|startsWith|endsWith|localeCompare|match|search)\(/, 'a text test on a key or race'],
  [new RegExp(String.raw`\.test\(\s*${P}\.(key|race)\b`), 'a pattern test on a key or race'],
  [/\b(startsWith|endsWith)\(/, 'a text test'],
  [new RegExp(String.raw`(?<!\btypeof\s+${P})\.(name|short)\s*[!=]==?|['"\x60]\s*[!=]==?\s*${P}\.(name|short)\b|\.(name|short)\.(includes|indexOf|localeCompare|match|search)\(`), 'a name test'],
  [/\.abilities\b/, 'reads ability text'],
  [/\.fx\b/, "reads a weapon's fx"],
  // the same reads by another route: a race named through the registry, a
  // banned field read by its string name, destructured or aliased
  [/\bRACES\s*\.\s*[A-Za-z_$]|\bRACES\s*\[\s*['"`]/, 'a race named in code'],
  [/\[\s*['"`](key|race|fx|abilities|name|short)['"`]\s*\]/, 'a banned field read by name'],
  [/\{(?:[^{}]*,)?\s*(fx|abilities|key|race)\s*(?:[,:][^{}]*|=(?!=)[^{}]*)?\}\s*=(?!=)/, 'a banned field destructured'],
  [/(?<![=!<>])=\s*[\w$?[\]]+(?:\.[\w$?[\]]+)*\.(key|race)\s*(?:[;,)]|$)/, 'a key or race aliased'],
]

// [file, exact text on the line, how many lines hold it, why it is allowed]
const ALLOW = [
  ['main.js', 'projectileStyle(w.fx)', 2, 'the projectile a volley or a blast flies: presentation'],
  ['main.js', "color: w.fx === 'spit' ? '#9aff5a' : '#ffe0a0'", 1, "a volley's impact sparks: presentation"],
  ['main.js', "if (w.fx !== 'thorns') {", 1, 'only skips the second explosion and boom: the thornburst plays its own'],
  ['main.js', "fx.explode(land.x, land.z, w.blast, w.fx === 'acid' ? 'acid' : 'fire')", 1, "the explosion's look: presentation"],
  ['main.js', "fx.ring(land.x, land.z, w.blast, w.fx === 'acid' ? '#8aff5a' : '#ff9a4a'", 1, "the template ring's colour: presentation"],
  ['main.js', '(t.abilities || []).map(', 1, 'the unit card prints the ability text'],
  ['main.js', "if (ph.key === 'fight')", 1, 'a phase key, not a unit or race key'],
  ['main.js', "} else if (ph.key === 'morale')", 1, 'a phase key, not a unit or race key'],
  ['main.js', 'PHASES.find((p) => p.key === S.phase)', 1, "a phase key, for the End button's label"],
  ['main.js', "if (e.key === 'Escape'", 1, 'a keyboard key'],
  ['main.js', 'S.phase = ph.key', 1, 'a phase key, not a unit or race key'],
  ['data/compat.js', 'seats[0].race === seats[1].race', 1, 'spots a mirror match, so seat 1 is painted in look.alt: presentation'],
  ['data/schema.js', "if (w.fx !== undefined && typeof w.fx !== 'string')", 1, 'validates the field: the data must say what fx is'],
  ['data/schema.js', "if (!Array.isArray(def.abilities) || def.abilities.some((a) => typeof a !== 'string'))", 1, 'validates the card text is text'],
  ['data/schema.js', 'abilities: [...def.abilities]', 1, 'copies the card text into the normalised type'],
  ['data/schema.js', 'const { key } = def', 1, "reads the race definition's own key, to validate and register it"],
]

function files(dir) {
  const out = ['main.js', 'ai.js', 'rules.js'].filter((f) => existsSync(join(dir, f)))
  const walk = (d) => {
    if (!existsSync(join(dir, d))) return
    for (const e of readdirSync(join(dir, d), { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(d, e.name))
      else if (e.name.endsWith('.js')) out.push(join(d, e.name))
    }
  }
  walk('core')
  walk('data')
  return out
}

// a line without its // comment (crude: this code has no // in a string)
const code = (l) => l.replace(/(^|\s)\/\/.*$/, '')

// Lint one file's text as `f` (its path in the package, which picks its
// allow entries); each allow entry that excuses a line adds one to `used`.
function lintSource(f, text, used) {
  const hits = []
  let inBlock = false
  text.split('\n').forEach((raw, i) => {
    let l = raw
    if (inBlock) {
      const end = l.indexOf('*/')
      if (end < 0) return
      l = l.slice(end + 2)
      inBlock = false
    }
    l = code(l)
    const start = l.indexOf('/*')
    if (start >= 0 && !l.slice(0, start).match(/['"`]/)) {
      const end = l.indexOf('*/', start + 2)
      if (end < 0) inBlock = true
      l = l.slice(0, start) + (end < 0 ? '' : l.slice(end + 2))
    }
    if (!BANNED.some(([re]) => re.test(l))) return
    // each allowed text on the line excuses itself only: cut it out, then
    // lint what is left
    for (const a of ALLOW) {
      if (a[0] !== f || !l.includes(a[1])) continue
      used.set(a, (used.get(a) ?? 0) + 1)
      l = l.split(a[1]).join(' ')
    }
    const what = BANNED.filter(([re]) => re.test(l)).map(([, w]) => w)
    if (what.length) hits.push({ f, line: i + 1, what: [...new Set(what)].join(', '), text: raw.trim() })
  })
  return hits
}

function lint(dir) {
  const used = new Map(ALLOW.map((a) => [a, 0]))
  const fs = files(dir)
  const hits = fs.flatMap((f) => lintSource(f, readFileSync(join(dir, f), 'utf8'), used))
  const stale = ALLOW.filter((a) => used.get(a) !== a[2]).map((a) => ({ a, n: used.get(a) }))
  return { hits, stale, n: fs.length }
}

const { values: args } = parseArgs({ options: { 'self-test': { type: 'boolean' } } })
if (args['self-test']) {
  let bad = 0
  const say = (ok, what) => {
    if (!ok) bad++
    console.log(`  ${ok ? 'ok  ' : 'BAD '} ${what}`)
  }
  // 1. the tests R2 turned into flags, as the R0 code has them
  const LEGACY = [
    ['main.js', "!u.t.abilities?.some((a) => a.startsWith('Sidewind'))", 'canCharge: Sidewind'],
    ['main.js', "if (sel?.t.abilities?.some((a) => a.startsWith('Sidewind')))", 'the Advance button: Sidewind'],
    ['main.js', "{ acid: w.fx === 'acid' }", 'blastLands: acid'],
    ['ai.js', "e.key === 'sidewinder' || e.key === 'oakguard'", 'the AI: brawler keys'],
    ['ai.js', 'ROLE[u.key]', 'the AI: role by key'],
  ]
  const { hits } = lint(legacyDir())
  console.log(`flag-lint self-test\n1. the R0 code (${LEGACY_REF.slice(0, 12)}) must fail on each legacy test`)
  for (const [f, text, what] of LEGACY) {
    const found = hits.filter((h) => h.f === f && h.text.includes(text))
    say(found.length, `${what}: ${found.length ? `flagged at ${f}:${found.map((h) => h.line).join(',')}` : 'not flagged'}`)
  }
  // 2. lines that must be flagged, as the file named: the regressions the
  // R0 code can't show (it has no race field), loose, method and pattern
  // tests, and banned tests smuggled onto a line beside an allowed one
  const FLAG = [
    ['main.js', "if (u.race === 'serpent') sfx.hiss()"],
    ['main.js', "if (G.seats[s].race !== 'squirrel') return"],
    ['main.js', "if ('serpent' === raceOf(G, s).key) return"],
    ['main.js', 'const bonus = BONUS[u.race]'],
    ['main.js', 'const bonus = BONUS[G.seats[s].race]'],
    ['main.js', "if (key === 'oakguard') brawl()"],
    ['ai.js', "const brawler = ['sidewinder', 'oakguard'].includes(e.key)"],
    ['ai.js', 'const brawler = BRAWLERS.has(e.key)'],
    ['ai.js', 'const role = ROLES.get(u.key)'],
    ['ai.js', 'if (u.key in ROLE) x()'],
    ['ai.js', 'switch (u.key) {'],
    ['core/match.js', 'switch (race) {'],
    ['main.js', "if (u.t.name.includes('Trebuchet')) heavy()"],
    ['main.js', "if (u.t.short === 'Elder') aura()"],
    ['main.js', "if (u.t.abilities[0]) x()"],
    ['main.js', "if (ph.key === 'fight') { if (u.key === 'brute') x() }"],
    ['main.js', "if (u.key === 'engine') fx.ring(land.x, land.z, w.blast, w.fx === 'acid' ? '#8aff5a' : '#ff9a4a', { life: 1.4, fill: 0.2 })"],
    ['main.js', "fx.explode(land.x, land.z, w.blast, w.fx === 'acid' ? 'acid' : 'fire'); scenery.blast(x, z, r, { acid: w.fx === 'acid' })"],
    ['main.js', "const lines = (t.abilities || []).map((a) => a); if (t.abilities[0]) x()"],
    ['main.js', "if (u.key === 'x') f() // projectileStyle(w.fx)"],
    ['data/compat.js', "const mirror = seats[0].race === seats[1].race && seats[0].race === 'serpent'"],
    ['main.js', "if (u.key == 'sidewinder') a()"],
    ['main.js', "if (e.race != 'serpent') b()"],
    ['main.js', "if (key == 'oakguard') c()"],
    ['ai.js', 'const role = ROLE[key]'],
    ['main.js', "if (u.key.includes('side')) f()"],
    ['main.js', "if (u.t.name == 'Constrictor Brute') g()"],
    ['main.js', "if (/^side/.test(u.key)) h()"],
    ['main.js', "if (u.key.localeCompare('brute') === 0) i()"],
    ['main.js', "if (u.t.short.localeCompare('Elder') === 0) j()"],
    ['main.js', 'const bonus = RACES.serpent.units.brute.W'],
    ['main.js', "const r = RACES['serpent']"],
    ['main.js', "if (w['fx'] === 'acid') k()"],
    ['main.js', "const { fx, blast } = w"],
    ['main.js', 'const { abilities } = u.t'],
    ['ai.js', 'const k = u.key'],
    ['main.js', 'let race = G.seats[s].race;'],
  ]
  // 3. lines that must not be: the registry lookup, the mirror check, and
  // reads of rule data that are the point of the flags
  const PASS = [
    ['main.js', 'const look = RACES[u.race].look'],
    ['core/match.js', 'export const raceOf = (G, s) => RACES[G.seats[s].race]'],
    ['data/compat.js', 'export const isMirror = (seats) => seats.length === 2 && seats[0].race === seats[1].race'],
    ['main.js', "if (a.kind === 'squirrel') {"],
    ['main.js', 'const enemiesOf = (u) => units.filter((e) => e.side === 1 - u.side)'],
    ['main.js', 'if (u.t.noCharge || u.mesmerized || u.flags.fellBack || isEngaged(u)) return false'],
    ['ai.js', "if (e.t.role === 'Artillery') s += 2"],
    ['main.js', 'keys.add(e.key.toLowerCase())'],
    ['data/schema.js', "if (typeof w.name !== 'string' || !w.name) throw bad('needs a name')"],
    ['data/schema.js', "if (typeof key !== 'string' || !/^[a-z][a-z0-9-]*$/.test(key)) throw new Error('bad key')"],
    ['main.js', "fx.ring(land.x, land.z, w.blast, w.fx === 'acid' ? '#8aff5a' : '#ff9a4a', { life: 1.4, fill: 0.2 })"],
    ['main.js', 'const race = raceOf(G, side), t = race.units[key]'],
    ['core/version.js', 'export function rulesData({ races = RACES, constants = CONSTANTS, phases = PHASES.map((p) => p.key) } = {}) {'],
    ['main.js', 'const look = RACES[u.race].look'],
    ['data/schema.js', 'if (!KEY.test(k)) throw bad(`unit key "${k}" must be lower-case letters, digits and dashes`)'],
  ]
  console.log('2. lines that must be flagged')
  for (const [f, line] of FLAG) {
    const h = lintSource(f, line, new Map())
    say(h.length, `${f}: ${line}${h.length ? `  (${h[0].what})` : '  NOT FLAGGED'}`)
  }
  console.log('3. lines that must pass')
  for (const [f, line] of PASS) {
    const h = lintSource(f, line, new Map())
    say(!h.length, `${f}: ${line}${h.length ? `  FLAGGED (${h[0].what})` : ''}`)
  }
  console.log(bad ? `\nflag-lint self-test FAILED: ${bad} wrong verdict(s)` : '\nflag-lint self-test passed')
  process.exit(bad ? 1 : 0)
}

const { hits, stale, n } = lint(PKG)
console.log(`flag-lint: ${n} files (main.js, ai.js, rules.js, core/, data/), ${ALLOW.length} allowed presentation sites`)
for (const h of hits) console.log(`  FAIL ${h.f}:${h.line} ${h.what}: ${h.text}`)
for (const { a, n: k } of stale) console.log(`  FAIL allow-list entry for ${a[0]} "${a[1]}" matches ${k} line(s), not ${a[2]}: update or drop it`)
for (const a of ALLOW) if (!stale.some((s) => s.a === a)) console.log(`  allowed ${a[0]}: ${a[1]}  (${a[3]})`)
const bad = hits.length + stale.length
console.log(bad ? `\nflag-lint FAILED: ${bad} problem(s)` : '\nflag-lint passed: no rules code tests a unit or race key, a name, ability text or fx')
process.exit(bad ? 1 : 0)
