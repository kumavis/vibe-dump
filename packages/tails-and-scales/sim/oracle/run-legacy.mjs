// The parity oracle: one battle of the game's real main.js, run in Node under
// a fake DOM with a renderer-less three.js, frames pumped as fast as they go
// (?fast). AI-vs-AI by default; with a command log, or a bot policy, the human
// seats are played through the ?debug input hooks (human-bot.mjs).
//
//   node sim/oracle/run-legacy.mjs <seed> <dice> [mainDir]          print the trace
//   node sim/oracle/run-legacy.mjs --job <file|-> [--json]          run a job
//        job: { seed, dice }                         AI vs AI
//             { setup, entries }                     replay a human log
//             { setup, bot: { policy, seed } }       play the humans with a policy
//   --dir <packageDir> | --ref <git ref|WORKTREE>    which code (default: the PIN,
//        sim/oracle/PIN, i.e. the frozen reference; --ref WORKTREE for yours).
//        A ref must be the PIN commit or later: older code has no input hooks.
//   --progress <fd>   also write each trace line, shadow and battle-log write
//        to that fd as it is taken ({"l"|"s"|"w": text} per line), with a
//        synchronous write: a parent can then report how far a run got even
//        when it never finishes (sim/lib.mjs runOracle kills it at a deadline)
//
// --json prints { trace, shadow, written, entries, asked, at, over, frames,
// secs, error } on stdout, `error` saying why the run stopped short (else
// null). One battle per process, since main.js keeps module-level state.
// stdout carries only that (or the trace): the game's own console output
// goes to stderr.
//
// Every mode starts the way the title screen's button does, with
// __ts.start(mode) (which the button calls), after the recorder is in place;
// never with ?watch, which starts a battle before __ts exists.
import { register } from 'node:module'
import { readFileSync, writeSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { takeFrame } from './fakedom.mjs'
import { instrument } from './shadow.mjs'
import { humanDriver, makePolicy, legacyMode, setupFor, missingHooks } from './human-bot.mjs'
import { dirFromArgs, readPin } from './pin.mjs'

register('./hooks.mjs', import.meta.url)

const { values: args, positionals } = parseArgs({
  allowPositionals: true,
  options: { dir: { type: 'string' }, ref: { type: 'string' }, job: { type: 'string' }, json: { type: 'boolean' }, progress: { type: 'string' } },
})
const job = args.job ? JSON.parse(readFileSync(args.job === '-' ? 0 : args.job, 'utf8')) : { seed: Number(positionals[0] ?? 7), dice: Number(positionals[1] ?? 42) }
const pin = readPin()
const dir = positionals[2] ?? dirFromArgs(args, pin)
const code = positionals[2] ?? args.dir ?? (args.ref ? `ref ${args.ref}` : pin === 'WORKTREE' ? 'the PIN (WORKTREE, so the working tree)' : `the PIN ${pin.slice(0, 9)}`)
const setup = job.setup ?? setupFor('watch', job.seed, job.dice)
const mode = legacyMode(setup)
const t0 = performance.now()

let fatal = null
process.on('unhandledRejection', (e) => (fatal ??= e))

// the progress stream: written synchronously, retrying while the pipe is full,
// so nothing is left queued if the game then spins and never yields again
const fd = args.progress === undefined ? -1 : Number(args.progress)
const say = fd < 0 ? null : (k, v) => {
  const b = Buffer.from(JSON.stringify({ [k]: v }) + '\n')
  for (let off = 0; off < b.length; ) {
    try {
      off += writeSync(fd, b, off)
    } catch (e) {
      if (e.code !== 'EAGAIN') throw e
    }
  }
}

// catch window.__ts the moment main.js publishes it, before the first trace
// line, and check it has everything the driver and the shadow read
let ts = null, rec = null, missing = []
Object.defineProperty(globalThis, '__ts', {
  configurable: true,
  get: () => ts,
  set: (v) => {
    ts = v
    missing = missingHooks(v)
    if (!missing.length) rec = instrument(v, say)
  },
})
globalThis.location = { search: `?fast&debug&lowfi&seed=${setup.board}&dice=${setup.dice}` }
console.log = console.info = console.debug = console.error
await import(pathToFileURL(join(dir, 'main.js')).href)
if (!ts) throw new Error(`${dir}/main.js published no window.__ts under ?debug`)
if (missing.length) throw new Error(`${dir}/main.js: window.__ts lacks ${missing.join(', ')}. The oracle runs only the PIN commit or later, whose ?debug block lists what sim/ reads.`)

let driver = null
if (mode !== 'watch') {
  const choose = job.bot ? makePolicy(job.bot.policy, job.bot.seed) : null
  driver = humanDriver(ts, { entries: job.entries ?? null, choose })
}
ts.start(mode)

let frames = 0, idle = 0, seen = 0, error = null
try {
  while (ts.S.stage !== 'over') {
    if (fatal) throw fatal
    const f = takeFrame()
    if (!f) throw new Error('no frame queued')
    f()
    frames++
    const acted = driver ? driver.tick() : false
    idle = acted || ts.trace.length !== seen ? 0 : idle + 1
    seen = ts.trace.length
    if (idle > 20000) throw new Error(`stalled at frame ${frames}: stage ${ts.S.stage}, phase ${ts.S.phase}, seat ${ts.S.active}`)
    await new Promise((r) => setImmediate(r))
  }
  if (fatal) throw fatal
  if (driver?.unused) throw new Error(`the battle ended with ${driver.unused} log entries unplayed`)
} catch (e) {
  error = String(e?.stack ?? e)
}

// a failed run still reports how far it got, so parity can name the first
// line that diverged before it broke
const S = ts.S
const out = {
  trace: ts.trace.slice(),
  shadow: rec.shadow,
  written: rec.written,
  entries: driver ? driver.played : null,
  asked: driver ? driver.asked : null,
  at: driver ? driver.at : null,
  over: { wiped: S.wiped ?? -1, vp: S.vp.slice(), first: S.first, round: S.round },
  frames,
  secs: +((performance.now() - t0) / 1000).toFixed(2),
  error,
}
if (args.json || args.job) process.stdout.write(JSON.stringify(out))
else {
  process.stdout.write(out.trace.join('\n') + '\n')
  process.stderr.write(`seed ${setup.board} dice ${setup.dice} on ${code}: ${out.trace.length} lines, ${frames} frames, ${out.secs} s, stage ${S.stage}\n`)
  if (error) {
    process.stderr.write(error + '\n')
    process.exitCode = 1
  }
}
