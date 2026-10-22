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
//
// --mode bushtail, serpent or hotseat; --policy random, late or aggressive
// (sim/oracle/human-bot.mjs); --overtime the setup's (F4: 'vote'); --need a
// comma-separated list, each a property every log written must show:
//   vote       a vote among its entries (F4)
//   overtime   a round played past the setup's rounds (F4)
//   score      ended on the score: no army wiped out
// Logs are named <mode>-<policy>-<tag>-<k>, k the bot's seed (and the board
// and dice drawn from it); an existing log is never overwritten.
import { parseArgs } from 'node:util'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { runOracle, pool, CPUS, features, hashLines, saveHuman, buildApp, BASE } from './lib.mjs'
import { codeDir, readPin } from './oracle/pin.mjs'
import { setupFor, mulberry32 } from './oracle/human-bot.mjs'

const NEEDS = {
  vote: (r) => r.entries.some((e) => e.t === 'vote'),
  overtime: (r) => r.trace.some((l) => /^log -1 Overtime: round \d+/.test(l)),
  score: (r) => r.over.wiped < 0,
}
const { values: a } = parseArgs({
  options: {
    mode: { type: 'string' }, policy: { type: 'string' }, tag: { type: 'string' }, overtime: { type: 'string' }, need: { type: 'string' },
    count: { type: 'string' }, tries: { type: 'string' }, dry: { type: 'boolean' },
  },
})
const need = (a.need ?? '').split(',').filter(Boolean)
const COUNT = Number(a.count ?? 1), TRIES = Number(a.tries ?? 24)
const bad = [
  !['bushtail', 'serpent', 'hotseat'].includes(a.mode) && '--mode takes bushtail, serpent or hotseat',
  !['random', 'late', 'aggressive'].includes(a.policy) && '--policy takes random, late or aggressive',
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
const json = (v) => JSON.stringify(v ?? null)
const sameTrace = (x, y) => json(x.trace) === json(y.trace) && json(x.written) === json(y.written)
const same = (x, y) => sameTrace(x, y) && json(x.shadow) === json(y.shadow)
const run = (jobs) => pool(jobs, CPUS, (j) => runOracle(j, dir).catch((e) => ({ trace: [], shadow: [], written: [], entries: [], error: e.message })))

console.log(`corpus-add: ${TRIES} ${a.mode} games, ${a.policy} bot${a.overtime ? `, overtime ${a.overtime}` : ''}, on PIN ${PIN.slice(0, 9)}; wanted ${COUNT} showing ${need.join(', ') || 'anything'}`)
const cands = Array.from({ length: TRIES }, (_, i) => {
  const k = i + 1, r = mulberry32(9000 + k)
  const setup = setupFor(a.mode, 1 + Math.floor(r() * 99999), 1 + Math.floor(r() * 999999), a.overtime)
  return { k, label: `${a.mode}-${a.policy}-${a.tag}-${k}`, job: { setup, bot: { policy: a.policy, seed: k } } }
}).filter((c) => !existsSync(join(BASE, 'human', `${c.label}.json`)))
const played = await run(cands.map((c) => c.job))
const fits = cands.map((c, i) => ({ ...c, res: played[i] })).filter((c) => {
  const miss = c.res.error ? `failed: ${c.res.error.split('\n')[0]}` : need.filter((n) => !NEEDS[n](c.res)).join(', ')
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
  const votes = c.res.entries.filter((e) => e.t === 'vote').length
  const over = c.res.trace.filter((l) => /^log -1 Overtime: round/.test(l)).length
  const why = [votes && `votes ${votes}`, over && `overtime rounds ${over}`, c.res.over.wiped >= 0 && `wipe ${c.res.over.wiped}`, describe(features(c.res.trace))].filter(Boolean).join(', ')
  console.log(`  ${c.label}: ${why}`)
  if (!a.dry) saveHuman(c.label, { setup: c.job.setup, bot: c.job.bot, why, n: c.res.trace.length, trace: hashLines(c.res.trace), shadow: hashLines(c.res.shadow), written: hashLines(c.res.written), entries: c.res.entries })
}
const short = chosen.length < COUNT
console.log(short ? `\ncorpus-add: only ${chosen.length} of ${COUNT} logs fit and passed admission${chosen.length && !a.dry ? ' (those written)' : ''}` : `\ncorpus-add: ${a.dry ? 'would write' : 'wrote'} ${chosen.map((c) => c.label).join(', ')}`)
process.exit(short ? 1 : 0)
