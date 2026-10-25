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
// (F11a, DESIGN §4.2.9) Two fields have one reader each in the consensus
// code (core/ and data/; OWNED below), whatever the route (`.x`, `['x']`,
// destructured):
//   cost, roster, armies, a mission's `list` and an `army` (a race's
//   classic list, a seat's or a mission's preset)   core/army.js alone: the
//                                         army builder's data decides which
//                                         units newState makes and nothing
//                                         else, so no rule reads a price
//   pts                                   core/ai/score.js alone (and
//                                         core/rules.js's `expected`, listed
//                                         below): the AI's own appraisal,
//                                         which the builder's prices never
//                                         replace without a re-record
// data/schema.js validating and copying them, data/mission.js checking a
// mission's list and preset name, and fullSetup filling in a seat's army
// are listed in ALLOW, as the .fx and .abilities lines are. The view may
// read them all (the card shows a unit's cost).
//
// It covers main.js and ai.js (rules code until R5-R6 moved the rest of it
// into core/; R6a moved ai.js to core/ai/, so only an older checkout has
// one), the root rules.js where a checkout has one (the R0 code's, for
// --self-test; R4 removed the working tree's re-export), everything under
// core/ and data/, and (R6b) the Session's match/, the input tools' input/
// and ui/, where the seats' look (ui/theme.js's isMirror) moved with
// data/compat.js, and (R7) the view's view/ (where main.js's figures,
// shooting and models went, and their presentation sites with them),
// present/ and app/. main.js, view/ and ui/ are view code, so the
// presentation sites they keep are listed below, each with why it is
// presentation. An allowed
// text excuses only itself: it is cut out of the line and the rest of the
// line is linted again, so a test added beside an allowed one is still
// caught. An entry that no longer matches exactly its count of lines fails,
// so the list can't go stale. sim/boundaries.mjs (R6b) runs this ban,
// allow-list included, over core/ and data/ (data/schema.js names .fx and
// .abilities to validate them): it imports BANNED, ALLOW and lintSource
// from here, which runs as a CLI only when it is the script run.
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
import { readFileSync, readdirSync, existsSync, realpathSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import { PKG } from './oracle/pin.mjs'
import { legacyDir, LEGACY_REF } from './lib.mjs'

// a member path such as u, u.t, G.seats[s], e?.t or raceOf(G, s)
const P = String.raw`[\w$.?\[\]]*(?:\([^()]*\)[\w$.?\[\]]*)*`
// (every comparison is strict or loose: [!=]==? is ===, !==, == or !=)
export const BANNED = [
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

// (F11a) Fields of the consensus code's that one module alone reads:
// [pattern, the files that may, what a read elsewhere is]. Checked over
// core/ and data/ only (the view shows them); a read is a member (`.cost`),
// by name (`['cost']`) or destructured (`{ cost } = t`).
const reads = (names) => new RegExp(String.raw`\.(${names})\b|\[\s*['"\x60](${names})['"\x60]\s*\]|\{(?:[^{}]*,)?\s*(${names})\s*(?:[,:][^{}]*|=(?!=)[^{}]*)?\}\s*=(?!=)`)
export const OWNED = [
  [reads('cost|roster|armies|list|army'), ['core/army.js'], "the army builder's data (cost, roster, armies, a mission's list, an army) read outside core/army.js"],
  [reads('pts'), ['core/ai/score.js'], "the AI's appraisal (pts) read outside core/ai/score.js"],
]
// the patterns that apply to file `f`
const rulesFor = (f) => [...BANNED, ...(/^(core|data)\//.test(f) ? OWNED.filter(([, owners]) => !owners.includes(f)).map(([re, , what]) => [re, what]) : [])]

// [file, exact text on the line, how many lines hold it, why it is allowed]
export const ALLOW = [
  ['view/effects/shots.js', 'this.fly(a, b, e.fx)', 2, 'the projectile a volley or a blast flies (the volley and blast.fire handlers): presentation'],
  ['view/effects/shots.js', "color: e.fx === 'spit' ? '#9aff5a' : '#ffe0a0'", 1, "a volley's impact sparks: presentation"],
  ['view/effects/shots.js', "if (e.fx !== 'thorns') {", 1, 'the blast.land handler only skips the second explosion and boom: the thornburst plays its own'],
  ['view/effects/shots.js', "fx.explode(e.x, e.z, e.r, e.fx === 'acid' ? 'acid' : 'fire')", 1, "the explosion's look: presentation"],
  ['view/effects/shots.js', "fx.ring(e.x, e.z, e.r, e.fx === 'acid' ? '#8aff5a' : '#ff9a4a'", 1, "the template ring's colour: presentation"],
  ['view/models/cache.js', 'KITS[kit][key]', 1, "the unit's figure, by its kit's builder for the unit (the kit the race's look names): presentation"],
  ['ui/card.js', '(t.abilities || []).map(', 1, 'the unit card prints the ability text'],
  ['input/human.js', "if (e.key === 'Escape'", 1, 'a keyboard key'],
  // (F1/F2) the camera's keys: V the next view, Home the overview
  ['view/camera.js', "(e.key === 'v' || e.key === 'V')", 1, 'a keyboard key'],
  ['view/camera.js', "if (e.key === 'Home')", 1, 'a keyboard key'],
  ['core/actions/shoot.js', 'fx: w.fx', 3, "the weapon's look, carried to the view in the volley, blast.fire and blast.land events and never tested there: presentation"],
  ['ui/theme.js', 'seats[0].race === seats[1].race', 1, 'spots a mirror match, so seat 1 is painted in look.alt: presentation'],
  ['ui/screens/races.js', 'b.dataset.race === race', 1, "(F6) the race picker marks the chosen race's button: presentation"],
  ['view/diorama.js', 'had.race === race', 1, '(F6) the race showcase drawn once for a race and colour, not rebuilt: presentation'],
  ['input/group.js', 'switch (e.key) {', 1, "(F10a) the group's keys (Enter, Escape, Q, Tab): a keyboard key, no unit's: input"],
  ['input/group.js', 'SPACE.has(e.key)', 1, "(F10a) Space left to a focused button: a keyboard key, no unit's: input"],
  ['ui/screens/races.js', 'if (race !== this.race) {', 1, "(F6) the race picker puts the last race's unit stats away when another race is shown: presentation"],
  ['data/schema.js', "if (w.fx !== undefined && typeof w.fx !== 'string')", 1, 'validates the field: the data must say what fx is'],
  ['data/schema.js', "if (!Array.isArray(def.abilities) || def.abilities.some((a) => typeof a !== 'string'))", 1, 'validates the card text is text'],
  ['data/schema.js', 'abilities: [...def.abilities]', 1, 'copies the card text into the normalised type'],
  ['data/schema.js', 'const { key } = def', 1, "reads the race definition's own key, to validate and register it"],
  // (F11a, OWNED) the army builder's data and pts, validated and copied by
  // defineRace, a mission's list and preset name checked by checkMission, a
  // seat's army filled in by fullSetup, and the AI's value of a shot
  ['data/schema.js', 'def.pts', 2, 'validates pts and copies it into the normalised type'],
  ['data/schema.js', 'def.cost', 2, 'validates cost and copies it into the normalised type'],
  ['data/schema.js', 'def.army', 6, 'validates the classic army (its units, its roster order), copies it, and derives the classic preset from it'],
  ['data/schema.js', 'def.roster', 3, 'validates the roster (each unit once) and copies it'],
  ['data/schema.js', 'def.armies', 1, "reads the race file's presets, to validate them"],
  ['data/mission.js', 'm.army', 1, "checkMission: the mission names its preset"],
  ['data/mission.js', 'checkListRules(m.list, bad)', 1, "checkMission hands the mission's list rules to their check"],
  ['core/index.js', 'army: x.army ?? mission.army', 1, "fullSetup fills in a seat's army, the mission's preset when it names none (core/army.js judges it)"],
  ['core/rules.js', 'value: kills * t.pts', 1, "expected(): the AI's value of a shot, per model killed (a legacy reading of pts, kept)"],
  // (N2) the online lobby's race picker: each race by its key, name and
  // icon, and a seat's race shown by its look
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
  for (const d of ['core', 'data', 'match', 'present', 'view', 'input', 'ui', 'app']) walk(d)
  return out
}

// a line without its // comment (crude: this code has no // in a string)
const code = (l) => l.replace(/(^|\s)\/\/.*$/, '')

// Lint one file's text as `f` (its path in the package, which picks its
// allow entries); each allow entry that excuses a line adds one to `used`.
export function lintSource(f, text, used) {
  const hits = []
  const rules = rulesFor(f)
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
    if (!rules.some(([re]) => re.test(l))) return
    // each allowed text on the line excuses itself only: cut it out, then
    // lint what is left
    for (const a of ALLOW) {
      if (a[0] !== f || !l.includes(a[1])) continue
      used.set(a, (used.get(a) ?? 0) + 1)
      l = l.split(a[1]).join(' ')
    }
    const what = rules.filter(([re]) => re.test(l)).map(([, w]) => w)
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

// (run, not imported: by real paths, since Node gives the main module its
// real path while argv keeps a symlinked one)
const real = (f) => {
  try {
    return realpathSync(f)
  } catch {
    return null
  }
}
const main = !!process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))
const { values: args } = main ? parseArgs({ options: { 'self-test': { type: 'boolean' } } }) : { values: {} }
if (main && args['self-test']) {
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
    ['core/actions/shoot.js', "emit(G, 'volley', { u: u.id, tg: target.id, fx: w.fx, n }); if (w.fx === 'acid') corrode()"],
    ['core/actions/shoot.js', "const look = w.fx"],
    ['ui/theme.js', "const mirror = seats[0].race === seats[1].race && seats[0].race === 'serpent'"],
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
    // (F11a, OWNED) the army builder's data read by rules code, and pts
    // outside the AI's appraisal, by every route
    ['core/ai/score.js', 'export const worth = (u) => (u.t.cost * u.alive) / u.t.models'],
    ['core/match.js', 'for (const key of raceOf(G, side).army) G.units.push(makeUnit(G, key, side))'],
    ['core/deploy.js', 'const order = race.roster.indexOf(u.key)'],
    ['core/engine.js', 'if (race.armies.field) x()'],
    ['core/engine.js', 'const cap = missionOf(G.setup).list.units'],
    ['core/index.js', 'const army = s.seats[0].army'],
    ['core/queries.js', "const price = u.t['cost']"],
    ['core/queries.js', 'const { cost, models } = u.t'],
    ['core/actions/shoot.js', 'const v = e.t.pts * e.alive'],
    ['core/rules.js', 'const bonus = t.pts + 1'],
    ['core/rules.js', '  return { wounds, kills, value: kills * t.pts + u.t.pts }'],
    ['data/mission.js', 'const n = m.list.points'],
    ['data/schema.js', 'const price = t.cost'],
    ['core/index.js', 's.seats = s.seats.map((x) => ({ ...x, army: x.army ?? mission.army })); const r = x.roster'],
  ]
  // 3. lines that must not be: the registry lookup, the mirror check, and
  // reads of rule data that are the point of the flags
  const PASS = [
    ['main.js', 'const look = RACES[u.race].look'],
    ['core/match.js', 'export const raceOf = (G, s) => RACES[G.seats[s].race]'],
    ['ui/theme.js', 'export const isMirror = (seats) => seats.length === 2 && seats[0].race === seats[1].race'],
    ['main.js', "if (a.kind === 'squirrel') {"],
    ['main.js', 'const enemiesOf = (u) => units.filter((e) => e.side === 1 - u.side)'],
    ['main.js', 'if (u.t.noCharge || u.mesmerized || u.flags.fellBack || isEngaged(u)) return false'],
    ['ai.js', "if (e.t.role === 'Artillery') s += 2"],
    ['main.js', 'keys.add(e.key.toLowerCase())'],
    ['data/schema.js', "if (typeof w.name !== 'string' || !w.name) throw bad('needs a name')"],
    ['data/schema.js', "if (typeof key !== 'string' || !/^[a-z][a-z0-9-]*$/.test(key)) throw new Error('bad key')"],
    ['view/effects/shots.js', "fx.ring(e.x, e.z, e.r, e.fx === 'acid' ? '#8aff5a' : '#ff9a4a', { life: 1.4, fill: 0.2 })"],
    ['core/actions/shoot.js', "emit(G, 'blast.fire', { u: u.id, to: { x: land.x, z: land.z }, fx: w.fx })"],
    ['main.js', 'const race = raceOf(G, side), t = race.units[key]'],
    ['core/version.js', 'export function rulesData({ races = RACES, constants = CONSTANTS, phases = PHASES.map((p) => p.key) } = {}) {'],
    ['main.js', 'const look = RACES[u.race].look'],
    ['data/schema.js', 'if (!KEY.test(k)) throw bad(`unit key "${k}" must be lower-case letters, digits and dashes`)'],
    // (F11a, OWNED) the one reader of each, its allowed sites, and the view
    ['core/army.js', 'export const listCost = (race, counts) => race.roster.reduce((sum, k, i) => sum + (counts[i] ?? 0) * race.units[k].cost, 0)'],
    ['core/army.js', 'const why = checkList(race, mission.list, counts)'],
    ['core/army.js', 'const army = rec.army ?? mission.army'],
    ['core/ai/score.js', 'export const worth = (u) => (u.t.pts * u.alive) / u.t.models'],
    ['core/rules.js', '  return { wounds, kills, value: kills * t.pts }'],
    ['core/index.js', '  s.seats = s.seats.map((x) => ({ ...x, army: x.army ?? mission.army }))'],
    ['data/schema.js', "  if (!Number.isInteger(def.cost) || def.cost <= 0 || def.cost % 5 !== 0) throw bad('cost')"],
    ['ui/card.js', 'el.textContent = `${u.t.cost} pts`'],
    ['ui/screens/muster.js', 'const left = mission.list.points - army.listCost(race, counts)'],
    ['app/flow.js', 'const preset = race.armies[name] ?? race.army'],
    ['core/units.js', 'const costly = (u) => u.t.costs + u.t.rosterOrder'],
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

if (main && !args['self-test']) {
  const { hits, stale, n } = lint(PKG)
  const roots = ['main.js', 'ai.js', 'rules.js'].filter((f) => existsSync(join(PKG, f)))
  console.log(`flag-lint: ${n} files (${[...roots, 'core/', 'data/', 'match/', 'present/', 'view/', 'input/', 'ui/', 'app/'].join(', ')}), ${OWNED.length} one-reader fields over core/ and data/, ${ALLOW.length} allowed sites`)
  for (const h of hits) console.log(`  FAIL ${h.f}:${h.line} ${h.what}: ${h.text}`)
  for (const { a, n: k } of stale) console.log(`  FAIL allow-list entry for ${a[0]} "${a[1]}" matches ${k} line(s), not ${a[2]}: update or drop it`)
  for (const a of ALLOW) if (!stale.some((s) => s.a === a)) console.log(`  allowed ${a[0]}: ${a[1]}  (${a[3]})`)
  const bad = hits.length + stale.length
  console.log(bad ? `\nflag-lint FAILED: ${bad} problem(s)` : '\nflag-lint passed: no rules code tests a unit or race key, a name, ability text or fx, and (F11a) the army builder\'s data and pts each have their one reader in core/ and data/')
  process.exit(bad ? 1 : 0)
}
