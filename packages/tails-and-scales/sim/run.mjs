// The headless fold (DESIGN §1.1, §4 R6): one battle played by the pure core
// (core/index.js) in plain Node, with no fake DOM, no three.js and no frames.
// An AI pair is createMatch from its seeds, which plays the whole battle
// inside the call; a human log is createMatch from its setup, then each
// entry played for the seat it names (its `s`; the rest of the entry is
// the command body), as the Folder will (R8): an in-band entry first held to
// what the match is waiting on (pendingSeats), then to legal(); a `concede`,
// which comes out of band (any human seat, the waiting one too: DESIGN §2.2's
// table, §0.2 #5), to legal() alone. An entry that answers nothing pending,
// or that legal() refuses, stops the run with an error naming it; so does a
// log that ends while a decision is open, or a battle that ends with
// entries left over.
//
// Beside the trace it rebuilds parity's two other streams, in the frozen
// formats the legacy page recorded (sim/oracle/shadow.mjs, imported as a
// library and never edited):
//   - the shadow at every state line (every non-`log` trace line), taken the
//     moment the line is written (core's onTrace), through the G adapter,
//     shadowPartsG, which keeps the legacy quirks shadow.mjs's header lists:
//     the phase on `round` lines and a full battle's `over` line is the last
//     one run, the `over` line of a battle that ran its course says one
//     round past the last (the old loop's overshoot) and stage `battle`
//     (traced before the stage moves on), and `wiped` is undefined until a
//     side is wiped;
//   - the battle log as written (`@<trace length> <class>: <html>`), from
//     the match's `log` events, each carrying `at`, the trace's length when
//     it was logged or flushed (DESIGN §2.3).
//
//   node sim/run.mjs <seed> <dice>                print an AI pair's trace
//   node sim/run.mjs --job <file|-> [--json]      run a job and print the result
//        job: { seed, dice }                       AI vs AI, the classic matchup
//             { setup, entries }                   replay a human log
//             either plus races: [r0, r1]          the seat races
//   --dir <packageDir> | --ref <git ref|WORKTREE>  whose core (default: the working tree)
//   --progress <fd>   as run-legacy.mjs: each trace line, shadow and write as
//        it is taken ({"l"|"s"|"w": text} per line), so a parent can say how
//        far a run got when it never finishes (sim/lib.mjs runOracle)
//   --strict          check every AI command with legal() before it is
//        applied (createMatch's `strict`), as sim/property.mjs does
//
// --json (or --job) prints { trace, shadow, written, entries, over, secs,
// error }, `error` saying why the run stopped short (else null). The parity
// gate runs it as `node sim/parity.mjs --core`. Library: foldJob,
// shadowPartsG, writtenOf, mirrorTap (sim/property.mjs holds the match's own
// events to the mirror with it).
//
// Run as a CLI it proves the fold is headless: before the core is loaded it
// registers a module hook that refuses three.js and the oracle's fake DOM,
// three shim and OrbitControls stub, so a core (or anything it imports)
// that reached for one stops the run naming it, and plain Node has no
// `document` or `window` for it to touch.
import { readFileSync, writeSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { register } from 'node:module'
import { shadowString } from './oracle/shadow.mjs'
import { setupFor } from './oracle/human-bot.mjs'
import { dirFromArgs } from './oracle/pin.mjs'

// The legacy shadow's parts, read off G as the state line `line` is
// written (the G adapter of DESIGN §2.6). `q` is the core's query set.
export function shadowPartsG(q, G, line) {
  const T = G.turn
  // the old loop's `for (round = 1; round <= rounds; round++)` left the
  // round one past the last on a battle that ran its course: the engine's
  // score step, where it ends (a wipe ends at a phase's end, mid-round)
  const ranOut = line.startsWith('over ') && T.step === 'score'
  return {
    stage: T.stage, round: ranOut ? T.round + 1 : T.round, active: T.active, phase: q.phaseKey(G), first: T.first, vp: T.vp,
    wiped: T.wiped < 0 ? undefined : T.wiped, rng: q.rngState(G.rng),
    units: G.units,
    chunks: G.terrain.chunks.map((c) => ({ alive: c.alive, hp: c.hp, x: c.shape.x, y: c.shape.y, z: c.shape.z, yaw: c.shape.yaw })),
  }
}

// A `log` event as the legacy page wrote it into #logList.
export const writtenOf = (e) => `@${e.at} entry s${e.side} ${e.cls}: ${e.html}`

// The first place two mirrors differ ('' when they are the same): numbers
// by Object.is, objects by their own keys (sim/present-check.mjs's rule).
export function differ(x, y, path = 'M') {
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

// The match's own events (the engine's flow events, the actions', the AI's)
// folded into a mirror, as the view will fold them from R6b, and held to
// the match (DESIGN §2.4): `mirror` is present/mirror.js's module. The
// mirror starts from the table before the match's first event (the units
// where newState stood them; the stage, the flags and the terrain all to
// come from events) and must equal project(G) at every `act` (as the
// action ended: its trace line's moment) and whenever the match stops for a
// decision or ends, everything played (the engine's round, unlike the old
// loop's, never runs one past the last). `trace(line, G)` goes in core's
// onTrace; `fold(G, events, where)` takes the events since the last look
// and throws naming the first difference.
export function mirrorTap(mirror) {
  let M = null, acts = 0, stops = 0
  const projs = []
  const start = (G) => ({ ...mirror.project(G), stage: 'title', owners: G.objectives.map(() => -1), chunks: {} })
  return {
    trace(line, G) {
      M ??= start(G)
      if (line.startsWith('act ')) projs.push(mirror.project(G))
    },
    fold(G, events, where) {
      M ??= start(G)
      for (const e of events) {
        mirror.applyEvent(M, e)
        if (e.t !== 'act') continue
        const d = differ(M, projs.shift())
        if (d) throw new Error(`${where}: at act ${acts + 1}, the mirror of the match's events differs from the match: ${d}`)
        acts++
      }
      if (projs.length) throw new Error(`${where}: ${projs.length} act line(s) traced with no act event`)
      const d = differ(M, mirror.project(G))
      if (d) throw new Error(`${where}: with every event played, the mirror of the match's events differs from the match: ${d}`)
      stops++
    },
    counts: () => ({ acts, stops }),
  }
}

// The setup a job plays: a human log's own, or the watch mode's for an AI
// pair; `races` seats other races.
export function jobSetup(job) {
  const setup = job.setup ?? setupFor('watch', job.seed, job.dice)
  return job.races ? { ...setup, seats: setup.seats.map((s, i) => ({ ...s, race: job.races[i] })) } : setup
}

// Fold one job with `core` (core/index.js's exports). `on(k, v)` hears each
// trace line ('l'), shadow ('s') and battle-log write ('w') as it is taken;
// `before(G, e, k)` is called before each log entry is held to the match
// (sim/property.mjs probes the decision there); `quiet` folds with G.out
// null, keeping no events (as a catch-up or a peer folds), so it writes no
// battle log; `mirror` (present/mirror.js's module, not with `quiet`) holds
// the match's events to the match as they are taken (mirrorTap), and the
// result's `mirrored` says how often. Never throws: a run that stops short
// says why in `error`, with what it got that far.
export function foldJob(core, job, { on = null, strict = false, before = null, quiet = false, mirror = null } = {}) {
  const t0 = performance.now()
  const rec = { trace: [], shadow: [], written: [], entries: job.entries ? [] : null }
  const tap = mirror && !quiet ? mirrorTap(mirror) : null
  const onTrace = (line, G) => {
    tap?.trace(line, G)
    rec.trace.push(line)
    on?.('l', line)
    if (line.startsWith('log ')) return
    const s = shadowString(shadowPartsG(core.q, G, line))
    rec.shadow.push(s)
    on?.('s', s)
  }
  // the battle log, from the events since the last look (G.out is the
  // match's, kept and emptied here)
  const writes = (G, where) => {
    if (!G.out) return
    const events = G.out.splice(0)
    tap?.fold(G, events, where)
    for (const e of events) {
      if (e.t !== 'log') continue
      const w = writtenOf(e)
      rec.written.push(w)
      on?.('w', w)
    }
  }
  let G = null, error = null
  try {
    if (job.bot) throw new Error('the core fold replays command logs; a bot policy plays through the legacy hooks (run-legacy.mjs)')
    G = core.createMatch(jobSetup(job), { out: quiet ? null : [], onTrace, strict })
    writes(G, 'createMatch')
    const entries = job.entries ?? []
    for (const [k, e] of entries.entries()) {
      if (G.turn.stage === 'over') throw new Error(`the battle ended with ${entries.length - k} log entries unplayed`)
      before?.(G, e, k)
      const bad = (why) => new Error(`entry ${k} ${JSON.stringify(e)}: ${why}`)
      // the entry: its seat, and the command body, which is all legal() and
      // apply() take (legal() refuses a field the command doesn't; R8's
      // Folder splits an envelope the same way, bodyOf: DESIGN §2.6)
      const { s, ...body } = e
      // (a concession is out of band: the Folder switches on it before the
      // turn check, §0.2 #5, and legal() judges who may send it)
      if (body.t !== 'concede' && !core.pendingSeats(G).includes(s)) throw bad(`seat ${s} has no decision to make (waiting on ${JSON.stringify(G.pending)})`)
      const why = core.legal(G, s, body)
      if (why) throw bad(why)
      core.apply(G, s, body)
      rec.entries.push(e)
      writes(G, `entry ${k}`)
    }
    if (G.turn.stage !== 'over') throw new Error(`the log ends while the match waits on ${JSON.stringify(G.pending)}`)
  } catch (e) {
    error = String(e?.stack ?? e)
  }
  const T = G?.turn
  return {
    ...rec,
    mirrored: tap?.counts() ?? null,
    over: T ? { wiped: T.wiped, vp: T.vp.slice(), first: T.first, round: T.step === 'score' ? T.round + 1 : T.round, result: T.result } : null,
    secs: +((performance.now() - t0) / 1000).toFixed(2),
    error,
  }
}

// ── CLI ─────────────────────────────────────────────────────────────────────
// The module hook the CLI registers before it loads the core: three.js (by
// any specifier) and sim/oracle's page shims are refused.
const HEADLESS = `export async function resolve(spec, ctx, next) {
  if (spec === 'three' || spec.startsWith('three/') || /(^|\\/)(fakedom|three-shim|orbit-stub|register)\\.mjs$/.test(spec)) {
    throw new Error('the headless fold reached for ' + spec + ' (from ' + ctx.parentURL + '): the pure core needs no three.js and no DOM')
  }
  return next(spec, ctx)
}`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { values: args, positionals } = parseArgs({
    allowPositionals: true,
    options: { dir: { type: 'string' }, ref: { type: 'string' }, job: { type: 'string' }, json: { type: 'boolean' }, progress: { type: 'string' }, strict: { type: 'boolean' } },
  })
  const job = args.job ? JSON.parse(readFileSync(args.job === '-' ? 0 : args.job, 'utf8')) : { seed: Number(positionals[0] ?? 7), dice: Number(positionals[1] ?? 42) }
  const dir = dirFromArgs(args, 'WORKTREE')
  // headless: no three.js, no fake DOM (above), whatever the core imports
  register(`data:text/javascript,${encodeURIComponent(HEADLESS)}`)
  if ('document' in globalThis || 'window' in globalThis) throw new Error('the headless fold found a DOM in plain Node')
  const entry = pathToFileURL(join(dir, 'core', 'index.js')).href
  const core = await import(entry).catch((e) => {
    // no core/index.js at all, or a core that failed to load (the guard
    // above refusing an import it reached for, or any other error)
    const missing = e.code === 'ERR_MODULE_NOT_FOUND' && e.message.includes(entry.replace(/^file:\/\//, ''))
    console.error(missing ? `${dir} has no pure core (core/index.js): code older than R6?` : `the core in ${dir} failed to load headless: ${e.message.split('\n')[0]}`)
    process.exit(2)
  })
  // the progress stream: written synchronously, retrying while the pipe is
  // full, so nothing is left queued if the fold then spins
  const fd = args.progress === undefined ? -1 : Number(args.progress)
  const on = fd < 0 ? null : (k, v) => {
    const b = Buffer.from(JSON.stringify({ [k]: v }) + '\n')
    for (let off = 0; off < b.length; ) {
      try {
        off += writeSync(fd, b, off)
      } catch (e) {
        if (e.code !== 'EAGAIN') throw e
      }
    }
  }
  const out = foldJob(core, job, { on, strict: !!args.strict })
  if (args.json || args.job) process.stdout.write(JSON.stringify(out))
  else {
    process.stdout.write(out.trace.join('\n') + '\n')
    process.stderr.write(`seed ${job.seed} dice ${job.dice} on the core in ${dir}: ${out.trace.length} lines, ${out.secs} s\n`)
    if (out.error) {
      process.stderr.write(out.error + '\n')
      process.exitCode = 1
    }
  }
}
