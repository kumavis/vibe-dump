// P-present (DESIGN §2.4, §4 R5): what the table shows is the match. From
// R5 the rules run ahead and the view plays their events later, reading a
// mirror folded from those events (present/mirror.js) instead of G. Here
// every corpus battle is played in Node, as the parity oracle plays it,
// while a mirror of its own is folded from every event the page's player
// plays, starting from project(G) of the table. At every checkpoint the
// folded mirror must equal the match's projection there exactly: every
// unit's place, radius, models (wounds, standing, slots), count standing,
// mesmerized and in combat; every chunk standing and its height; the
// objectives' owners, the score, the round, the seat and phase, the stage.
// The player's own mirror must equal it too. The checkpoints:
//   - each action's end, its `act` event (under ?debug it carries
//     project(G) as the action ended);
//   - a `check` event, which only ?debug emits (main.js's checkpoint()),
//     carrying project(G) as the match then stood: after each converted
//     action's events (core/actions/, run by main.js's played()); after
//     the stage events main.js emits itself (each deployment's, and the
//     battle's start with its flags: a lost one would show until the next
//     stage event, which can come before any act); and at the old walk's
//     end, where it carries `keys: ['owners']` and holds only the flags
//     (the walking unit's ⚔ comes at its action's end, so the rest isn't
//     due yet). An action's end emits the flags' and labels' events
//     (`objectives`, `status`) straight before its `act`, so at an act
//     those are always fresh; the checks are what hold the actions' own (a
//     damage that slew, a flight, the ⚔ going as a damage ends, a flag a
//     walking unit took) to the match.
// So an event the rules forget to emit (a model that fell, a block that
// dropped, a flag a kill turned) is a failing check, not a figure left
// standing on the table. Not covered:
//   - main.js's own `status` events outside converted actions (a
//     mesmerism's, a turn's end), which the next action's end repeats
//     before any checkpoint; they move into core at R5b-R6, where a
//     played() checkpoint covers them;
//   - the flags at the battle's start: a check follows them, but no corpus
//     battle deploys a model within reach of an objective (the deployment
//     zones end at |x| = 12, the flank objectives stand at |x| = 9 with a
//     3" reach plus the base), so they are always nobody's there and a
//     lost one changes nothing the check can see. Covering them needs a
//     human log that deploys onto an objective: a corpus change, the
//     lead's to make.
//
// It also requires one act event per `act` line of the trace, at least one
// check per battle (every turn's morale phase has one), and at the game's
// end the mirror to equal project(G) once more (all but the round, which
// the old battle loop leaves one past the last on a battle that ran its
// course), and each battle's trace, shadows and battle log to match the
// corpus, so the events are tapped from the battle parity checks.
//
//   node sim/present-check.mjs [--only ai,hotseat,4242-99] [--ref <ref> | --dir <packageDir>]
//   node sim/present-check.mjs --self-test     each edit in present-hooks.mjs's
//                                              MUTATIONS must fail it
//
// It reads the page through the ?debug block's present.listen, and reads
// its G (project(G) as the page loads, at each new table and at the game's
// end) and player.idle (main.js's contract comment), none of which
// sim/oracle uses. One child process per battle, up to one per CPU. Exit 0
// when every battle's mirror is the match at every checkpoint (the
// self-test: when every mutation is caught), 1 otherwise, 2 on bad
// arguments.
import { parseArgs } from 'node:util'
import { spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, ref: { type: 'string' }, dir: { type: 'string' }, child: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
} catch (e) {
  console.error(`present-check: ${e.message}\nusage: node sim/present-check.mjs [--only <kinds, modes or ids>] [--ref <ref> | --dir <packageDir>] | --self-test`)
  process.exit(2)
}

if (a.child) await page(a.child)
else if (a['self-test']) await selfTest()
else process.exit(await parent())

// The first place two mirrors differ ('' when they are the same): numbers
// by Object.is, objects by their own keys.
function differ(x, y, path = 'M') {
  if (Object.is(x, y)) return ''
  if (!x || !y || typeof x !== 'object' || typeof y !== 'object' || Array.isArray(x) !== Array.isArray(y)) return `${path}: ${JSON.stringify(x)} | ${JSON.stringify(y)}`
  const kx = Object.keys(x).sort(), ky = Object.keys(y).sort()
  if (kx.join() !== ky.join()) return `${path} keys: ${kx.join()} | ${ky.join()}`
  for (const k of kx) {
    const d = differ(x[k], y[k], `${path}.${k}`)
    if (d) return d
  }
  return ''
}

// ── One battle, in a child ──────────────────────────────────────────────────
async function page(dir) {
  const { register } = await import('node:module')
  register('./oracle/hooks.mjs', import.meta.url)
  register('./present-hooks.mjs', import.meta.url)
  const { takeFrame } = await import('./oracle/fakedom.mjs')
  const { instrument } = await import('./oracle/shadow.mjs')
  const { humanDriver, legacyMode, setupFor } = await import('./oracle/human-bot.mjs')
  const { project, applyEvent } = await import(pathToFileURL(join(dir, 'present', 'mirror.js')).href)
  const job = JSON.parse(readFileSync(0, 'utf8'))
  const setup = job.setup ?? setupFor('watch', job.seed, job.dice)
  const mode = legacyMode(setup)
  let ts = null, rec = null
  Object.defineProperty(globalThis, '__ts', {
    configurable: true,
    get: () => ts,
    set: (v) => {
      ts = v
      rec = instrument(v)
    },
  })
  globalThis.location = { search: `?fast&debug&lowfi&seed=${setup.board}&dice=${setup.dice}` }
  console.log = console.info = console.debug = console.error
  let fatal = null
  process.on('unhandledRejection', (e) => (fatal ??= e))
  const out = { trace: [], shadow: [], written: [], acts: 0, checks: 0, events: 0, kinds: {}, mismatch: null, error: null }
  try {
    await import(pathToFileURL(join(dir, 'main.js')).href)
    if (!ts?.present?.listen) throw new Error('main.js offers no ?debug present.listen: code older than R5?')
    // the table is up (main.js built it as it loaded): fold from it
    let M = project(ts.G)
    const miss = (why) => (out.mismatch ??= why)
    ts.present.listen({
      reset: () => (M = project(ts.G)),
      event: (e, shown) => {
        M = applyEvent(M, e)
        out.events++
        out.kinds[e.t] = (out.kinds[e.t] ?? 0) + 1
        if (e.t !== 'act' && e.t !== 'check') return
        const where = e.t === 'act' ? `act ${++out.acts} (trace line ${ts.trace.length})` : `check ${++out.checks} (after act ${out.acts}, trace line ${ts.trace.length})`
        if (!e.proj) return miss(`${where}: the ${e.t} event carries no projection (not ?debug?)`)
        // a check with `keys` holds only those fields of the mirror
        const only = (m) => (e.keys ? Object.fromEntries(e.keys.map((k) => [k, m[k]])) : m)
        const d = differ(only(M), only(e.proj))
        if (d) return miss(`${where}: the folded mirror differs from the match: ${d}`)
        const p = differ(only(shown), only(e.proj))
        if (p) miss(`${where}: the player's mirror differs from the match: ${p}`)
      },
    })
    const driver = mode === 'watch' ? null : humanDriver(ts, { entries: job.entries })
    ts.start(mode)
    let frames = 0
    while (ts.S.stage !== 'over') {
      if (fatal) throw fatal
      const f = takeFrame()
      if (!f) throw new Error('no frame queued')
      f()
      if (driver) driver.tick()
      if (++frames > 200000) throw new Error(`still at stage ${ts.S.stage} after ${frames} frames`)
      await new Promise((r) => setImmediate(r))
    }
    if (fatal) throw fatal
    if (driver?.unused) throw new Error(`the battle ended with ${driver.unused} log entries unplayed`)
    // the end: everything played, the mirror is the match (bar the round)
    if (!ts.player.idle) out.mismatch ??= 'the battle is over and the player is still playing'
    const end = { ...project(ts.G), round: null }, folded = { ...M, round: null }
    const d = differ(folded, end)
    if (d) out.mismatch ??= `at the game's end: ${d}`
    const lines = ts.trace.filter((l) => l.startsWith('act ')).length
    if (lines !== out.acts) out.mismatch ??= `${lines} act lines in the trace, ${out.acts} act events`
  } catch (e) {
    out.error = String(e?.stack ?? e)
  }
  out.trace = ts?.trace.slice() ?? []
  out.shadow = rec?.shadow ?? []
  out.written = rec?.written ?? []
  // (no process.exit: it would cut a piped stdout short)
  process.stdout.write(JSON.stringify(out))
}

function child(dir, job, env = process.env) {
  const self = fileURLToPath(import.meta.url)
  return new Promise((done) => {
    const p = spawn(process.execPath, [self, '--child', dir], { stdio: ['pipe', 'pipe', 'pipe'], env })
    let out = '', err = ''
    // decoded as a stream: a character split across two chunks stays whole
    p.stdout.setEncoding('utf8')
    p.stderr.setEncoding('utf8')
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => {
      try {
        done(JSON.parse(out))
      } catch {
        done({ error: `child exited ${code}: ${err.trim().split('\n').slice(0, 4).join(' | ')}` })
      }
    })
    p.stdin.end(JSON.stringify(job))
  })
}

// ── Every battle ────────────────────────────────────────────────────────────
// Returns the exit code; `env` (the self-test's mutation) goes to every child.
async function parent({ env = process.env, quiet = false } = {}) {
  const { loadCorpus, select, verdict, pool, CPUS } = await import('./lib.mjs')
  const { dirFromArgs } = await import('./oracle/pin.mjs')
  const dir = a.dir ? resolve(a.dir) : dirFromArgs({ ref: a.ref ?? 'WORKTREE' })
  let items
  try {
    items = select(loadCorpus().items, a.only)
  } catch (e) {
    console.error(`present-check: ${e.message}`)
    return 2
  }
  const say = quiet ? () => {} : console.log
  say(`present-check (P-present): ${items.length} battles, the mirror folded from each one's events held to the match at every act and check; on ${a.dir ? dir : a.ref ? `ref ${a.ref}` : 'the working tree'}`)
  const t0 = Date.now()
  const total = { acts: 0, checks: 0, events: 0, kinds: {} }
  let failed = 0
  await pool(items, CPUS, async (it) => {
    const r = await child(dir, it.job, env)
    let why = r.error ?? r.mismatch
    if (!why) {
      const v = verdict(it, r)
      if (!v.ok) why = `the battle itself differs from the corpus (trace line ${v.line}, shadow ${v.shadow}, write ${v.written})`
      else if (!r.acts) why = 'no act was checked'
      else if (!r.checks) why = 'no converted action was checked (no check event: main.js without a played() checkpoint?)'
    }
    if (why) failed++
    total.acts += r.acts ?? 0
    total.checks += r.checks ?? 0
    total.events += r.events ?? 0
    for (const [k, n] of Object.entries(r.kinds ?? {})) total.kinds[k] = (total.kinds[k] ?? 0) + n
    say(`  ${it.kind.padEnd(5)} ${it.id.padEnd(24)} ${why ? `FAIL: ${why.split('\n')[0].slice(0, 300)}` : `${String(r.acts).padStart(3)} acts, ${String(r.checks).padStart(3)} checks, ${String(r.events).padStart(5)} events: the mirror is the match`}`)
  })
  const kinds = Object.entries(total.kinds).filter(([k]) => /^(unit|terrain)\./.test(k)).sort().map(([k, n]) => `${k} ${n}`).join(', ')
  say(`  folded ${total.events} events (${kinds}) and compared ${total.acts} acts and ${total.checks} checks`)
  say(failed ? `\npresent-check FAILED: ${failed} of ${items.length}` : `\npresent-check passed: at every act and check of all ${items.length} battles the mirror folded from the events is the match (${Math.round((Date.now() - t0) / 1000)} s)`)
  return failed ? 1 : 0
}

// ── The self-test: each mutation must fail the check ────────────────────────
async function selfTest() {
  const { MUTATIONS } = await import('./present-hooks.mjs')
  let missed = 0
  for (const name of Object.keys(MUTATIONS)) {
    const lines = []
    const log = console.log
    console.log = (...x) => lines.push(x.join(' '))
    const code = await parent({ env: { ...process.env, PRESENT_MUTATE: name } })
    console.log = log
    const fail = lines.find((l) => /FAIL: .*(mirror|act events)/.test(l))
    const caught = code === 1 && !!fail
    if (!caught) missed++
    console.log(`  ${caught ? 'caught' : 'MISSED'} ${name.padEnd(17)} ${(fail ?? lines.find((l) => /FAIL/.test(l)) ?? `exit ${code}`).trim().slice(0, 200)}`)
  }
  console.log(missed ? `\npresent-check self-test FAILED: ${missed} mutation(s) passed` : '\npresent-check self-test passed: every mutation fails the check on the mirror')
  process.exit(missed ? 1 : 0)
}
