// Build the parity corpus (sim/baselines) from the PIN code. Run by hand,
// once per re-baseline; everything is seeded, so it reproduces.
//
//   node sim/corpus.mjs [--sweep 160] [--ai 12] [--dry] [--no-browser (implies --dry)]
//
// 1. AI pairs: the 12 original baselines, plus pairs from a seeded sweep
//    chosen to show friendly fire, mesmerize, flight, wrecked scenery,
//    fizzled spells and failed charges (two pairs per feature).
// 2. Human logs: the human-bot (sim/oracle/human-bot.mjs) plays vs-AI games
//    from both seats and hotseat games, with the random, the late-Auto and
//    the aggressive (wipe-seeking) policy, plus a sweep of aggressive hotseat
//    games for wipe-outs that a human's own command causes. Logs are chosen so
//    the set holds at least three wipe-outs and covers deployment, advances,
//    falling back, both kinds of charge end, a failed charge, Auto in each
//    phase and Auto after acting (the AI then moving an advanced unit on the
//    roll it already has: since 33946a4 it never advances it again), and
//    wipe-outs in a fight
//    and by a human's shot, of the enemy and of the shooter's own army.
// 3. Admission: a pair or log enters the corpus only when the Node oracle and
//    Chromium produce identical traces and battle logs; Chromium runs a build
//    of the same PIN code, made into a temp dir. Each human log must also
//    replay identically (trace, shadow and log) twice more in Node. Where
//    Chromium's shadow differs from Node's (an ULP of terrain, from the
//    engines' Math.sin/cos), its hashes are kept too, as `webShadow`. The 12
//    originals are not optional: if any fails in Node or traces differently
//    in Chromium, nothing is written.
//
// Writes sim/baselines/pairs.json and sim/baselines/human/*.json: inputs plus
// per-line hashes, and the Node and Chromium versions that took them. It
// writes only a complete corpus (every original admissible, every quota and
// coverage target met); otherwise it says why and exits 1. --no-browser skips
// admission, so it only previews. Full traces are never committed;
// regenerate them with `node sim/parity.mjs --pin --dump <dir>`.
import { parseArgs } from 'node:util'
import { readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { runOracle, pool, CPUS, features, hashLines, savePairs, saveHuman, buildApp, BASE } from './lib.mjs'
import { codeDir, readPin } from './oracle/pin.mjs'
import { setupFor, mulberry32 } from './oracle/human-bot.mjs'

const { values: a } = parseArgs({
  options: { sweep: { type: 'string' }, ai: { type: 'string' }, 'no-browser': { type: 'boolean' }, dry: { type: 'boolean' } },
})
if (a['no-browser'] && !a.dry) {
  console.log('--no-browser skips the Node/Chromium admission, so this run only previews (it implies --dry)')
  a.dry = true
}
const SWEEP = Number(a.sweep ?? 160)
const AI = Number(a.ai ?? 12)
const PIN = readPin()
const dir = codeDir(PIN)
// the engines agree on a battle when its trace and battle log are identical;
// `same` adds the shadow (within one engine, or where the trig agrees)
const json = (v) => JSON.stringify(v ?? null)
const sameTrace = (x, y) => json(x.trace) === json(y.trace) && json(x.written) === json(y.written)
const same = (x, y) => sameTrace(x, y) && json(x.shadow) === json(y.shadow)
// Chromium's shadow, hashed, where it differs from Node's: the two engines'
// Math.sin/cos disagree in the last bit for ~3% of inputs, which moves some
// terrain by an ULP without changing the 3-decimal trace
const webShadow = (c) => (c.web && !same(c.web, c.res) ? { webShadow: hashLines(c.web.shadow) } : {})
const run = (jobs) => pool(jobs, CPUS, (j) => runOracle(j, dir).catch((e) => ({ trace: [], shadow: [], written: [], error: e.message })))
const describe = (f) => Object.entries(f).filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(', ')

// Chromium runs a fresh build of the PIN code, never whatever dist/ holds
const work = join(tmpdir(), `tails-and-scales-corpus-${process.pid}`)
let browser = null, dist = null, chromium = null
if (!a['no-browser']) {
  const { runBrowser } = await import('./chromium.mjs')
  dist = await buildApp(dir, join(work, 'dist'))
  browser = async (jobs) => {
    const out = await runBrowser(jobs, { dist })
    chromium = out.chromium
    return out
  }
}

// Admit candidates in `order` while `want(chosen)` holds, skipping any that
// `want(chosen, c)` turns down: each must produce the identical trace in Node
// and Chromium (plus pass any `extra` check). Chromium's run is kept as c.web.
async function admit(order, want, extra = async () => true) {
  const chosen = [], rejected = []
  let i = 0
  while (want(chosen) && i < order.length) {
    const batch = []
    while (batch.length < Number(process.env.PARALLEL || 3) && i < order.length) {
      const c = order[i++]
      if (want(chosen, c)) batch.push(c)
    }
    if (!batch.length) break
    const web = browser ? await browser(batch.map((c) => c.job)) : batch.map((c) => c.res)
    for (let k = 0; k < batch.length; k++) {
      const c = batch[k]
      const ok = !web[k].error && sameTrace(web[k], c.res) && (await extra(c))
      if (browser) c.web = web[k]
      const note = !ok ? (web[k].error ? `: ${web[k].error.split('\n')[0]}` : ': the traces or battle logs differ between Node and Chromium') : browser && !same(web[k], c.res) ? ' (shadow differs in Chromium by an ULP)' : ''
      const take = ok && want(chosen, c)
      console.log(`    ${take ? 'admit ' : ok ? 'spare ' : 'REJECT'} ${c.label}${note}`)
      if (take) chosen.push(c)
      else if (!ok) rejected.push(c)
    }
  }
  return { chosen, rejected }
}

console.log(`corpus from ${PIN === 'WORKTREE' ? 'the working tree (PIN is WORKTREE)' : `PIN ${PIN}`}${browser ? `, Chromium on ${dist}` : ' — WITHOUT browser admission'}`)

// ── 1. AI pairs ─────────────────────────────────────────────────────────────
const ORIGINAL = [[4242, 99], [777, 1], [1, 2], [31337, 7], [90210, 3], [42, 11], [5, 5], [2024, 13], [8, 21], [123, 34], [999, 55], [64, 89]]
const FEATURES = ['friendlyFire', 'mesmerize', 'flee', 'wrecked', 'fizzle', 'failedCharge']
const rnd = mulberry32(20261005)
const sweep = Array.from({ length: SWEEP }, () => ({ seed: 1 + Math.floor(rnd() * 99999), dice: 1 + Math.floor(rnd() * 999999) }))
console.log(`\n1. AI: the 12 originals and a sweep of ${SWEEP} pairs`)
const origRes = await run(ORIGINAL.map(([seed, dice]) => ({ seed, dice })))
const sweepRes = await run(sweep)
const cand = sweep.map((job, i) => ({ job, res: sweepRes[i], label: `${job.seed}-${job.dice}`, f: features(sweepRes[i].trace) }))
  .filter((c) => !c.res.error && !ORIGINAL.some(([s, d]) => s === c.job.seed && d === c.job.dice))
// for each feature in turn, the two richest pairs not already in
const per = AI / FEATURES.length
const total = (c) => Object.values(c.f).reduce((s, v) => s + v, 0)
const aiChosen = [], aiRejected = []
for (const k of FEATURES) {
  console.log(`  ${k}:`)
  const ranked = cand.filter((c) => c.f[k] > 0 && !aiChosen.includes(c) && !aiRejected.includes(c)).sort((x, y) => y.f[k] - x.f[k] || total(y) - total(x))
  const { chosen, rejected } = await admit(ranked, (ch) => ch.length < per)
  aiChosen.push(...chosen)
  aiRejected.push(...rejected)
}
const origWeb = browser ? await browser(ORIGINAL.map(([seed, dice]) => ({ seed, dice }))) : []
console.log(`  the 12 originals${browser ? ', in Node and Chromium' : ' in Node'}:`)
// every original must pass admission like any other pair: they are the
// corpus's backbone, so one that fails stops the whole write
const origBad = []
ORIGINAL.forEach(([s, d], i) => {
  const why = origRes[i].error ? `failed in Node: ${origRes[i].error.split('\n')[0]}`
    : !browser ? null
    : origWeb[i].error ? `failed in Chromium: ${origWeb[i].error.split('\n')[0]}`
    : !sameTrace(origWeb[i], origRes[i]) ? 'TRACE OR LOG DIFFERS between Node and Chromium' : null
  if (why) origBad.push(`${s}-${d}`)
  console.log(`    ${why ?? (browser ? `same trace and log${same(origWeb[i], origRes[i]) ? '' : ', shadow differs by an ULP'}` : 'ran')}  ${s}-${d}`)
})

// ── 2. Human logs ───────────────────────────────────────────────────────────
const MODES = ['bushtail', 'serpent', 'hotseat']
const POLICIES = ['random', 'aggressive', 'late']
const K = 8, WIPE_SWEEP = 48
const jobs = []
const job = (mode, policy, seed, board, dice) => ({ mode, policy, seed, label: `${mode}-${policy}-${seed}`, job: { setup: setupFor(mode, board, dice), bot: { policy, seed } } })
for (const mode of MODES) for (const policy of POLICIES) for (let k = 1; k <= K; k++) {
  const r = mulberry32(MODES.indexOf(mode) * 1000 + POLICIES.indexOf(policy) * 100 + k)
  jobs.push(job(mode, policy, k, 1 + Math.floor(r() * 99999), 1 + Math.floor(r() * 999999)))
}
// wipe-outs a human command causes are rare in those, so a seeded sweep of
// aggressive hotseat games for them; and one a wider fuzz turned up, where a
// blast's friendly fire wipes out the shooter's own army
for (let k = 1; k <= WIPE_SWEEP; k++) {
  const r = mulberry32(5000 + k)
  jobs.push(job('hotseat', 'aggressive', 100 + k, 1 + Math.floor(r() * 99999), 1 + Math.floor(r() * 999999)))
}
jobs.push(job('hotseat', 'aggressive', 909, 1333, 5909))
console.log(`\n2. Human: ${jobs.length} bot games`)
const played = await run(jobs.map((j) => j.job))

// positions on a state line: unit id → 'x,z'
const positions = (l) => new Map(l.split(' ').filter((w) => /^\d+:-?\d/.test(w)).map((w) => {
  const [id, p] = w.split(':')
  return [id, p.split(',').slice(0, 2).join()]
}))

// What a log covers, counting only what the human seats did. r.asked says
// which decision each entry answered and r.at where its trace lines start.
function cover(j, r) {
  const humans = j.job.setup.seats.map((s, i) => (s.ctrl === 'human' ? i : -1)).filter((i) => i >= 0)
  const mine = (re) => r.trace.filter((l) => humans.some((s) => l.startsWith(`log ${s} `)) && re.test(l)).length
  const c = {}
  const add = (k, n = 1) => n && (c[k] = (c[k] ?? 0) + n)
  // the seat's earlier entries in the same phase, latest first (every human
  // phase ends with that seat's end or auto)
  const before = (i) => {
    const out = []
    for (let k = i - 1; k >= 0 && r.entries[k].s === r.entries[i].s && !['end', 'auto', 'deployed', 'place'].includes(r.entries[k].t); k--) out.push(r.entries[k])
    return out
  }
  r.entries.forEach((e, i) => {
    if (e.t === 'chargeEnd') add(e.c < 0 ? 'shortest' : r.asked[i] === 'chargeEnd at shortest' ? 'pick shortest spot' : 'pick spot')
    else if (e.t === 'place' || e.t === 'advance') add(e.t)
    if (e.t !== 'auto') return
    const ph = r.asked[i], prior = before(i)
    add(`auto ${ph}`)
    if (!prior.length) return
    add(`auto after ${ph}`)
    if (prior[0].t === 'advance') add('auto after advance')
    // units advanced but not yet moved when Auto took over: the AI must move
    // them on the roll they have ('re-advance' would be the old double-roll
    // bug fixed in 33946a4, and is refused below)
    const adv = new Set(prior.filter((p) => p.t === 'advance' && !prior.some((m) => m.t === 'move' && m.u === p.u)).map((p) => String(p.u)))
    if (ph !== 'move' || !adv.size) return
    let prev = null, rolled = false
    for (let k = r.at[i] - 1; k >= 0 && !prev; k--) if (!r.trace[k].startsWith('log ')) prev = positions(r.trace[k])
    for (let k = r.at[i]; k < r.trace.length && !r.trace[k].startsWith('phase '); k++) {
      const l = r.trace[k]
      if (l.startsWith(`log ${e.s} `) && l.includes(' advance: +')) rolled = true
      else if (l.startsWith('act ')) {
        const now = positions(l)
        if (prev) for (const id of adv) if (now.get(id) !== prev.get(id)) add(rolled ? 're-advance' : 'advanced, auto-moved')
        prev = now
        rolled = false
      }
    }
  })
  add('fall back', mine(/ fall back /))
  add('failed charge', mine(/ Failed\. rng/))
  if (r.over.wiped >= 0) {
    // the phase it ended in (the state line before `over`), and whether a
    // human's own shot did it: the battle ends on that seat's End in its
    // shooting phase, after it shot (moves and charges never kill)
    const m = r.trace.filter((l) => !l.startsWith('log ')).at(-2)?.match(/^phase (\d):(\w+) /)
    add(`wipe ${r.over.wiped}`)
    if (m) add(`wipe in ${m[2]}`)
    const i = r.entries.length - 1, last = r.entries[i]
    if (m?.[2] === 'shoot' && last?.t === 'end' && last.s === Number(m[1]) && humans.includes(last.s) && r.asked[i] === 'shoot' && before(i).some((p) => p.t === 'shoot'))
      add(r.over.wiped === last.s ? 'self wipe' : 'wipe by command')
  }
  return c
}
const NEED = [
  'place', 'advance', 'fall back', 'shortest', 'pick spot', 'failed charge', 'auto move', 'auto shoot', 'auto charge',
  'auto after advance', 'advanced, auto-moved', 'auto after shoot', 'auto after charge',
  'wipe in fight', 'wipe by command', 'self wipe',
]
const logs = jobs.map((j, i) => ({ ...j, res: played[i], c: played[i].error ? {} : cover(j, played[i]) })).filter((l) => !l.res.error)
const again = logs.filter((l) => l.c['re-advance'])
if (again.length) {
  console.log(`the AI advanced an already-advanced unit again in ${again.map((l) => l.label).join(', ')}: the double-advance fix (33946a4) is missing from this code`)
  process.exit(1)
}
for (const l of logs) console.log(`    ${l.label.padEnd(24)} ${l.res.trace.length} lines, ${l.res.entries.length} entries, ${l.res.over.wiped >= 0 ? `seat ${l.res.over.wiped} wiped out` : `vp ${l.res.over.vp.join('-')}`}`)

// order: the rarest things first (a wipe-out by command, a self-wipe, an
// advanced unit the AI moves on); then wipe-outs, seat 1's first, at most two per mode and six
// in all; then whatever adds the most uncovered features; then the rest,
// richest first, round-robin over mode and policy so every mode gets a mix
const rich = (l) => NEED.filter((n) => l.c[n]).length * 1000 + Object.values(l.c).reduce((s, v) => s + v, 0)
const hOrder = []
for (const k of ['wipe by command', 'self wipe', 'advanced, auto-moved']) {
  const l = logs.filter((x) => x.c[k] && !hOrder.includes(x)).sort((x, y) => rich(y) - rich(x))[0]
  if (l) hOrder.push(l)
}
const wiped = (l) => l.res.over.wiped >= 0
for (const l of logs.filter((x) => wiped(x) && !hOrder.includes(x)).sort((x, y) => y.res.over.wiped - x.res.over.wiped || rich(y) - rich(x))) {
  if (hOrder.filter(wiped).length < 6 && hOrder.filter((x) => wiped(x) && x.mode === l.mode).length < 2) hOrder.push(l)
}
const covered = new Set(hOrder.flatMap((l) => NEED.filter((n) => l.c[n])))
const gain = (l) => NEED.filter((n) => l.c[n] && !covered.has(n)).length
let rest = logs.filter((l) => !hOrder.includes(l))
for (let l; (l = rest.filter((x) => gain(x) > 0).sort((x, y) => gain(y) - gain(x) || rich(y) - rich(x))[0]); ) {
  for (const n of NEED) if (l.c[n]) covered.add(n)
  hOrder.push(l)
  rest = rest.filter((x) => x !== l)
}
const lists = MODES.flatMap((m) => POLICIES.map((p) => rest.filter((l) => l.mode === m && l.policy === p).sort((x, y) => rich(y) - rich(x))))
for (let i = 0; i < Math.max(...lists.map((l) => l.length)); i++) for (const list of lists) if (list[i]) hOrder.push(list[i])
const QUOTA = { bushtail: 4, serpent: 4, hotseat: 8 }
const hWant = (chosen, c) => {
  const n = (m) => chosen.filter((x) => x.mode === m).length
  return c ? n(c.mode) < QUOTA[c.mode] : MODES.some((m) => n(m) < QUOTA[m])
}
// each log must reproduce twice more in Node, from its entries alone
const twice = async (c) => {
  const [x, y] = await run([0, 1].map(() => ({ setup: c.job.setup, entries: c.res.entries })))
  return !x.error && !y.error && same(x, c.res) && same(y, c.res)
}
console.log('  admitting (Node twice more, then Chromium):')
const { chosen: hChosen } = await admit(hOrder.map((l) => ({ ...l, job: { setup: l.job.setup, entries: l.res.entries } })), hWant, twice)

// ── 3. Write ────────────────────────────────────────────────────────────────
const got = new Set()
for (const l of hChosen) for (const n of NEED) if (l.c[n]) got.add(n)
const wipeCount = hChosen.filter((l) => l.res.over.wiped >= 0).length
console.log(`\nAI pairs: 12 original + ${aiChosen.length} new`)
for (const c of aiChosen) console.log(`  ${c.label.padEnd(14)} ${describe(c.f)}`)
console.log(`human logs: ${hChosen.length} (${MODES.map((m) => `${hChosen.filter((l) => l.mode === m).length} ${m}`).join(', ')}), ${wipeCount} wipe-outs`)
for (const l of hChosen) console.log(`  ${l.label.padEnd(24)} ${describe(l.c)}`)
const missing = NEED.filter((n) => !got.has(n))
console.log(missing.length ? `MISSING coverage: ${missing.join(', ')}` : `covers: ${NEED.join(', ')}`)

// only a complete corpus is written: a short one would quietly drop coverage
const want = Object.values(QUOTA).reduce((s, n) => s + n, 0)
const short = [
  origBad.length && `originals ${origBad.join(', ')} are not admissible`,
  missing.length && 'coverage is missing',
  wipeCount < 3 && `only ${wipeCount} wipe-outs`,
  hChosen.length < want && `only ${hChosen.length} of ${want} human logs`,
  aiChosen.length < AI && `only ${aiChosen.length} of ${AI} new AI pairs`,
].filter(Boolean)
if (short.length) console.log(`\nshort: ${short.join('; ')}`)

const hashes = (r) => ({ n: r.trace.length, trace: hashLines(r.trace), shadow: hashLines(r.shadow) })
if (!a.dry && short.length) console.log('NOT WRITING sim/baselines: the run fell short (above)')
else if (!a.dry) {
  const pairs = {
    note: 'AI-vs-AI battles (each started from the title screen\'s watch button, ?debug&fast&seed&dice): per trace line, per shadow snapshot and per battle-log write, a 10-hex sha256 prefix. The hashes come from the code of sim/oracle/PIN, which a re-record moves with them; node sim/parity.mjs --pin checks that it still reproduces them. Built by sim/corpus.mjs.',
    engines: { node: process.version, chromium },
    pairs: [
      ...ORIGINAL.map(([seed, dice], i) => ({ seed, dice, why: 'original baseline', ...hashes(origRes[i]), ...webShadow({ res: origRes[i], web: origWeb[i] }), written: hashLines(origRes[i].written) })),
      ...aiChosen.map((c) => ({ seed: c.job.seed, dice: c.job.dice, why: describe(c.f), ...hashes(c.res), ...webShadow(c), written: hashLines(c.res.written) })),
    ],
  }
  savePairs(pairs)
  for (const f of readdirSync(join(BASE, 'human'))) rmSync(join(BASE, 'human', f))
  for (const l of hChosen) {
    saveHuman(l.label, {
      setup: l.job.setup, bot: { policy: l.policy, seed: l.seed }, why: describe(l.c),
      ...hashes(l.res), ...webShadow(l), written: hashLines(l.res.written), entries: l.res.entries,
    })
  }
  console.log(`wrote ${pairs.pairs.length} pairs and ${hChosen.length} human logs to ${BASE}`)
}
rmSync(work, { recursive: true, force: true })
process.exitCode = short.length ? 1 : 0
