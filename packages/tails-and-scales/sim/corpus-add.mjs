// Add human logs to the parity corpus (sim/baselines/human) without building
// it again: the human-bot plays seeded games of one mode and setup on the
// PIN code, and the first --count of them that show everything --need asks
// for, and pass sim/corpus.mjs's admission (twice more identically in Node
// from their entries alone, then the same trace and battle log in Chromium,
// on a fresh build of the PIN code), are written. A step whose code lets a
// log hold something new (F4's vote, F5's races, F7's terrain) adds its logs
// this way, recorded on that code: so sim/oracle/PIN names its commit first
// (the PIN's header), and `node sim/parity.mjs --pin` passes afterwards.
//
//   node sim/corpus-add.mjs --mode hotseat --policy late --tag vote --overtime vote --need vote,overtime [--count 1] [--tries 24] [--dry]
//   node sim/corpus-add.mjs --mode watch --terrain fortified --set fort --tag fort --need works,keep --count 3
//
// --mode bushtail, serpent or hotseat, or (F7a) watch: an AI pair, recorded
// as a log whose seats are both AI and which has no entries (the whole
// battle runs inside its start), so a set's AI pairs can be on a setup of
// their own (pairs.json's are classic's seeds); --policy random, late,
// aggressive or pilot (sim/oracle/human-bot.mjs; none with watch);
// --overtime the setup's (F4: 'vote'); (F7a) --terrain the setup's terrain
// set (classic, the default; fortified); --set the log set it joins (human,
// the default; pilot: F10b's own; fort: F7a's); --need a comma-separated
// list, each a property every log written must show:
//   vote       a vote among its entries (F4)
//   overtime   a round played past the setup's rounds (F4)
//   score      ended on the score: no army wiped out
//   pilot      (F10b) a pilot among its entries that played a unit, in
//              each of the movement, shooting and charge phases
//   (F7a, read off the match as the log is folded again in Node on the PIN
//   code, sim/height-probe.mjs: the trace has no floors, and nothing is
//   added to it)
//   deck       a unit standing on a deck at a round's end
//   climb      a ladder taken (a move along a nav link); climbup: one
//              taken up, from its foot to its deck
//   deckfight  a blow struck in a fight with a unit on a deck
//   works      both seats' own ramparts stand
//   keep       the keep stands round the centre objective; nokeep: it doesn't
// Logs are named <mode>-<policy>-<tag>-<k> (an AI pair <mode>-<tag>-<k>),
// k the bot's seed (and the board and dice drawn from it); an existing log
// is never overwritten.
import { parseArgs } from 'node:util'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { runOracle, pool, CPUS, features, hashLines, saveHuman, buildApp, BASE, LOG_SETS } from './lib.mjs'
import { codeDir, readPin } from './oracle/pin.mjs'
import { setupFor, mulberry32 } from './oracle/human-bot.mjs'
import { foldJob, loadMatch } from './run.mjs'
import { heightProbe } from './height-probe.mjs'

const NEEDS = {
  vote: (r) => r.entries.some((e) => e.t === 'vote'),
  overtime: (r) => r.trace.some((l) => /^log -1 Overtime: round \d+/.test(l)),
  score: (r) => r.over.wiped < 0,
  // (the trace grew between the pilot and the entry after it: it played a
  // unit, whose action wrote its act line)
  pilot: (r) => ['move', 'shoot', 'charge'].every((ph) => r.entries.some((e, i) => e.t === 'pilot' && r.asked[i] === ph && (r.at[i + 1] ?? r.trace.length) > r.at[i])),
  // (F7a: the probe's, r.height)
  deck: (r) => r.height.deckRounds.length > 0,
  climb: (r) => r.height.climbs > 0,
  climbup: (r) => r.height.up > 0,
  deckfight: (r) => r.height.deckFights > 0,
  works: (r) => r.height.works === 2,
  keep: (r) => r.height.keep,
  nokeep: (r) => r.height.height && !r.height.keep,
}
const HEIGHT_NEEDS = ['deck', 'climb', 'climbup', 'deckfight', 'works', 'keep', 'nokeep']
const { values: a } = parseArgs({
  options: {
    mode: { type: 'string' }, policy: { type: 'string' }, tag: { type: 'string' }, overtime: { type: 'string' }, need: { type: 'string' },
    count: { type: 'string' }, tries: { type: 'string' }, dry: { type: 'boolean' }, set: { type: 'string' }, terrain: { type: 'string' },
  },
})
const watch = a.mode === 'watch'
const need = (a.need ?? '').split(',').filter(Boolean)
const COUNT = Number(a.count ?? 1), TRIES = Number(a.tries ?? 24)
const bad = [
  !['bushtail', 'serpent', 'hotseat', 'watch'].includes(a.mode) && '--mode takes bushtail, serpent, hotseat or watch',
  !watch && !['random', 'late', 'aggressive', 'pilot'].includes(a.policy) && '--policy takes random, late, aggressive or pilot',
  watch && a.policy !== undefined && '--mode watch records an AI pair: no bot plays it, so it takes no --policy',
  watch && a.overtime !== undefined && '--mode watch has no human seat to vote, so it takes no --overtime',
  !['classic', 'fortified'].includes(a.terrain ?? 'classic') && '--terrain takes classic or fortified',
  !LOG_SETS.includes(a.set ?? 'human') && `--set takes ${LOG_SETS.join(' or ')}`,
  !/^[a-z]+$/.test(a.tag ?? '') && '--tag takes a lowercase word (it names the logs)',
  need.some((n) => !NEEDS[n]) && `--need takes ${Object.keys(NEEDS).join(', ')}`,
  !(Number.isInteger(COUNT) && COUNT > 0 && Number.isInteger(TRIES) && TRIES >= COUNT) && '--count and --tries take whole numbers, tries at least count',
].filter(Boolean)
if (bad.length) {
  console.error(`corpus-add: ${bad.join('; ')}`)
  process.exit(2)
}

const PIN = readPin()
const dir = codeDir(PIN)
// (F7a) the PIN code's own core and Folder, in this process, for the height
// needs: each candidate's log folded again with sim/height-probe.mjs looking
// on (its counts are the result's `height`)
const pinCore = need.some((n) => HEIGHT_NEEDS.includes(n)) || a.terrain === 'fortified' ? await import(pathToFileURL(join(dir, 'core', 'index.js')).href) : null
const pinMatch = pinCore ? await loadMatch(dir) : null
const heightOf = (log) => {
  const probe = heightProbe(pinCore.q)
  const r = foldJob(pinCore, log, { match: pinMatch, probe })
  return r.error ? { error: r.error, ...probe.result() } : probe.result()
}
const json = (v) => JSON.stringify(v ?? null)
const sameTrace = (x, y) => json(x.trace) === json(y.trace) && json(x.written) === json(y.written)
const same = (x, y) => sameTrace(x, y) && json(x.shadow) === json(y.shadow)
const run = (jobs) => pool(jobs, CPUS, (j) => runOracle(j, dir).catch((e) => ({ trace: [], shadow: [], written: [], entries: [], error: e.message })))

console.log(`corpus-add: ${TRIES} ${a.mode} games, ${watch ? 'AI against AI' : `${a.policy} bot`}${a.overtime ? `, overtime ${a.overtime}` : ''}${a.terrain ? `, on ${a.terrain}` : ''}, on PIN ${PIN.slice(0, 9)}; wanted ${COUNT} showing ${need.join(', ') || 'anything'}`)
const cands = Array.from({ length: TRIES }, (_, i) => {
  const k = i + 1, r = mulberry32(9000 + k)
  const setup = { ...setupFor(a.mode, 1 + Math.floor(r() * 99999), 1 + Math.floor(r() * 999999), a.overtime), ...(a.terrain ? { terrain: a.terrain } : {}) }
  // (an AI pair is its start alone: no bot, no entries)
  return watch ? { k, label: `${a.mode}-${a.tag}-${k}`, job: { setup, entries: [] } } : { k, label: `${a.mode}-${a.policy}-${a.tag}-${k}`, job: { setup, bot: { policy: a.policy, seed: k } } }
}).filter((c) => !LOG_SETS.some((set) => existsSync(join(BASE, set, `${c.label}.json`))))
const played = (await run(cands.map((c) => c.job))).map((r) => (r.error ? r : { ...r, entries: r.entries ?? [] }))
// (F7a) the height the battle played with, where a need or the terrain asks
if (pinCore) played.forEach((r, i) => !r.error && (r.height = heightOf({ setup: cands[i].job.setup, entries: r.entries })))
const fits = cands.map((c, i) => ({ ...c, res: played[i] })).filter((c) => {
  const miss = c.res.error ? `failed: ${c.res.error.split('\n')[0]}` : c.res.height?.error ? `failed folding again for the height needs: ${c.res.height.error.split('\n')[0]}` : need.filter((n) => !NEEDS[n](c.res)).join(', ')
  console.log(`  ${c.label.padEnd(30)} ${miss ? (c.res.error ? miss : `lacks ${miss}`) : 'fits'}`)
  return !miss
})

// admission: twice more in Node from the entries alone, then Chromium
const work = join(tmpdir(), `tails-and-scales-corpus-add-${process.pid}`)
const { runBrowser } = await import('./chromium.mjs')
const dist = await buildApp(dir, join(work, 'dist'))
const chosen = []
for (const c of fits) {
  if (chosen.length >= COUNT) break
  const log = { setup: c.job.setup, entries: c.res.entries }
  const [x, y] = await run([log, log])
  const node = !x.error && !y.error && same(x, c.res) && same(y, c.res)
  const [web] = node ? await runBrowser([log], { dist }) : []
  const ok = node && web && !web.error && sameTrace(web, c.res)
  console.log(`  ${ok ? 'admit ' : 'REJECT'} ${c.label}${ok ? '' : !node ? ': not the same battle again in Node' : `: ${web?.error?.split('\n')[0] ?? 'the trace or battle log differs in Chromium'}`}`)
  if (ok) chosen.push(c)
}
rmSync(work, { recursive: true, force: true })

const describe = (f) => Object.entries(f).filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(', ')
for (const c of chosen) {
  const votes = c.res.entries.filter((e) => e.t === 'vote').length, pilots = c.res.entries.filter((e) => e.t === 'pilot').length
  const over = c.res.trace.filter((l) => /^log -1 Overtime: round/.test(l)).length
  // ((F7a) what it did with the height: sim/height-probe.mjs's counts)
  const h = c.res.height
  const high = h?.height && [h.works === 2 && 'works', h.keep && `keep held at ${h.keepHeld} round end${h.keepHeld === 1 ? '' : 's'}`, h.deployed && `deployed on decks ${h.deployed}`, h.deckRounds.length && `on a deck at the end of rounds ${h.deckRounds.join(' ')}`, h.movedRounds?.length && `by a move at the end of rounds ${h.movedRounds.join(' ')}`, h.climbs && `ladders ${h.climbs} (${h.up} up)`, h.ontoDeck && `onto a deck ${h.ontoDeck}`, h.deckFights && `deck fights ${h.deckFights}`].filter(Boolean).join(', ')
  const why = [votes && `votes ${votes}`, pilots && `pilots ${pilots}`, over && `overtime rounds ${over}`, c.res.over.wiped >= 0 && `wipe ${c.res.over.wiped}`, high, describe(features(c.res.trace))].filter(Boolean).join(', ')
  console.log(`  ${c.label}: ${why}`)
  if (!a.dry) saveHuman(c.label, { setup: c.job.setup, bot: c.job.bot, why, n: c.res.trace.length, trace: hashLines(c.res.trace), shadow: hashLines(c.res.shadow), written: hashLines(c.res.written), entries: c.res.entries }, a.set ?? 'human')
}
const short = chosen.length < COUNT
console.log(short ? `\ncorpus-add: only ${chosen.length} of ${COUNT} logs fit and passed admission${chosen.length && !a.dry ? ' (those written)' : ''}` : `\ncorpus-add: ${a.dry ? 'would write' : 'wrote'} ${chosen.map((c) => c.label).join(', ')}`)
process.exit(short ? 1 : 0)
