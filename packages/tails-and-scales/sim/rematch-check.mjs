// Two battles in one page don't touch each other (DESIGN §4 R4: the match
// state G is built afresh for every table, and unit and chunk ids count from
// 1 in every match). The parity corpus can't see this: it plays one battle
// per page. Here each battle of the corpus is played to the end, then the
// end screen's Again button is pressed (back to the title, a new table on
// the same board seed) and the same mode is started again with the same
// dice and the same log. The second battle's trace, shadow snapshots and
// battle log must equal the first's, line for line, and the first must
// match the corpus. Before R4 the second battle's units were numbered 15-28,
// so its trace differed from the first line on (`--ref 91194ba` shows it).
//
// Then Again once more, a new battlefield from the title (the seed box for
// half the battles, the New battlefield button for the rest), and a third
// battle in another mode, its human seats played by a bot policy instead of
// the log: a different board, other controllers in the seats, the turn
// order and ids of a new match. That battle must equal the same setup and
// bot played on a fresh page (sim/lib.mjs runOracle). Each corpus battle
// switches to one of the other three modes and policies by its index, so
// the run covers every mode switch.
//
// It also checks that the terrain's reports are all played: after every
// frame of all three battles, and after each new table, the match's out
// (G.out) must be empty, since main.js drains it into the view straight
// after each terrain call.
//
//   node sim/rematch-check.mjs [--only ai,hotseat,4242-99] [--ref <ref> | --dir <packageDir>]
//
// One page per corpus battle (a child process each, as the oracle runs
// them), plus one fresh page for its third battle, up to one per CPU. Exit 0
// when every battle replays identically the second time, the third is the
// fresh page's, and every report is drained; 1 otherwise, 2 on bad arguments.
import { parseArgs } from 'node:util'
import { spawn } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { join, resolve } from 'node:path'
import { readFileSync } from 'node:fs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, ref: { type: 'string' }, dir: { type: 'string' }, child: { type: 'string' } } }))
} catch (e) {
  console.error(`rematch-check: ${e.message}\nusage: node sim/rematch-check.mjs [--only <kinds, modes or ids>] [--ref <ref> | --dir <packageDir>]`)
  process.exit(2)
}

if (a.child) await page(a.child)
else await parent()

// ── One page: two battles ───────────────────────────────────────────────────
async function page(dir) {
  const { register } = await import('node:module')
  register('./oracle/hooks.mjs', import.meta.url)
  const { takeFrame } = await import('./oracle/fakedom.mjs')
  const { instrument } = await import('./oracle/shadow.mjs')
  const { humanDriver, makePolicy, legacyMode, setupFor } = await import('./oracle/human-bot.mjs')
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
  await import(pathToFileURL(join(dir, 'main.js')).href)

  async function play(mode, how) {
    const from = { shadow: rec.shadow.length, written: rec.written.length }
    const driver = mode === 'watch' ? null : humanDriver(ts, how)
    ts.start(mode)
    let frames = 0, undrained = 0
    while (ts.S.stage !== 'over') {
      if (fatal) throw fatal
      const f = takeFrame()
      if (!f) throw new Error('no frame queued')
      f()
      if (driver) driver.tick()
      // (code before R4 has no G: nothing to check there)
      if (ts.G?.out?.length) undrained++
      if (++frames > 200000) throw new Error(`still at stage ${ts.S.stage} after ${frames} frames`)
      await new Promise((r) => setImmediate(r))
    }
    if (driver?.unused) throw new Error(`the battle ended with ${driver.unused} log entries unplayed`)
    return { trace: ts.trace.slice(), shadow: rec.shadow.slice(from.shadow), written: rec.written.slice(from.written), undrained, frames }
  }
  const out = { first: null, second: null, third: null, board: null, error: null }
  const again = () => {
    // back to the title, as a player presses the end screen's button
    document.querySelector('#again').onclick()
    if (ts.G?.out?.length) throw new Error('the new table left terrain reports unplayed')
  }
  try {
    out.first = await play(mode, { entries: job.entries })
    again()
    out.second = await play(mode, { entries: job.entries })
    again()
    // a new battlefield, as the title screen makes one
    const sw = job.switchTo
    if (sw.how === 'seed') {
      document.querySelector('#seed').value = String(sw.board)
      document.querySelector('#seed').onchange()
    } else document.querySelector('#reroll').onclick()
    if (ts.G?.out?.length) throw new Error('the new battlefield left terrain reports unplayed')
    out.board = ts.S.seed
    out.third = await play(sw.mode, { choose: makePolicy(sw.policy, sw.seed) })
  } catch (e) {
    out.error = String(e?.stack ?? e)
  }
  // (no process.exit: it would cut a piped stdout short)
  process.stdout.write(JSON.stringify(out))
}

// ── The parent: every battle, one child each ────────────────────────────────
async function parent() {
  const { loadCorpus, select, verdict, pool, CPUS, runOracle } = await import('./lib.mjs')
  const { MODES, setupFor, legacyMode } = await import('./oracle/human-bot.mjs')
  const { dirFromArgs } = await import('./oracle/pin.mjs')
  const dir = a.dir ? resolve(a.dir) : dirFromArgs({ ref: a.ref ?? 'WORKTREE' })
  const items = select(loadCorpus().items, a.only)
  const self = fileURLToPath(import.meta.url)

  function child(job) {
    return new Promise((done) => {
      const p = spawn(process.execPath, [self, '--child', dir], { stdio: ['pipe', 'pipe', 'pipe'] })
      let out = '', err = ''
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

  // the first index where two runs' lines differ, and the stream it is in
  function firstDiffer(x, y) {
    for (const k of ['trace', 'shadow', 'written']) {
      const n = Math.max(x[k].length, y[k].length)
      for (let i = 0; i < n; i++) if (x[k][i] !== y[k][i]) return { k, i, x: x[k][i], y: y[k][i] }
    }
    return null
  }

  // the third battle: another mode (each of the other three in turn), a bot
  // policy for its human seats, and a new board from the seed box (a board
  // of its own, by index) or the New battlefield button (whatever it rolls)
  const POLICIES = ['random', 'late', 'aggressive']
  const switchFor = (it, i) => {
    const setup = it.job.setup ?? setupFor('watch', it.job.seed, it.job.dice)
    const from = legacyMode(setup)
    const others = Object.keys(MODES).filter((m) => m !== from)
    return { from, dice: setup.dice, mode: others[i % 3], policy: POLICIES[(i >> 1) % 3], seed: 7001 + i, how: i % 2 ? 'reroll' : 'seed', board: 100003 + i * 7919 }
  }

  console.log(`rematch-check: ${items.length} battles, each played twice in one page (Again between them), then a third on a new board in another mode; on ${a.dir ? dir : a.ref ? `ref ${a.ref}` : 'the working tree'}`)
  const t0 = Date.now()
  let failed = 0
  await pool(items, CPUS, async (it, i) => {
    const sw = switchFor(it, i)
    const r = await child({ ...it.job, switchTo: sw })
    let why = r.error
    if (!why) {
      const v = verdict(it, r.first)
      const d = firstDiffer(r.first, r.second)
      if (!v.ok) why = `the first battle differs from the corpus (trace line ${v.line}, shadow ${v.shadow}, write ${v.written})`
      else if (d) why = `the second battle's ${d.k} differs at ${d.i}: first ${String(d.x).slice(0, 90)} | second ${String(d.y).slice(0, 90)}`
      else if (r.first.undrained || r.second.undrained || r.third.undrained) why = `terrain reports left unplayed after ${r.first.undrained} + ${r.second.undrained} + ${r.third.undrained} frames`
      else if (sw.how === 'seed' && r.board !== sw.board) why = `the seed box asked for board ${sw.board}, and the table has ${r.board}`
    }
    // the third battle against the same setup and bot on a fresh page
    let ref = null
    if (!why) {
      ref = await runOracle({ setup: setupFor(sw.mode, r.board, sw.dice), bot: { policy: sw.policy, seed: sw.seed } }, dir)
      const d = ref.error ? null : firstDiffer(ref, r.third)
      if (ref.error) why = `the fresh page's run of the third battle failed: ${ref.error}`
      else if (d) why = `the third battle (${sw.from} → ${sw.mode}, board ${r.board} by ${sw.how}, ${sw.policy} bot) differs from a fresh page's: ${d.k} ${d.i}: fresh ${String(d.x).slice(0, 90)} | here ${String(d.y).slice(0, 90)}`
      else if (r.third.trace.length < 20) why = `the third battle wrote only ${r.third.trace.length} trace lines`
    }
    if (why) failed++
    const n = r.first ? `${r.first.trace.length} lines, ${r.first.shadow.length} states, ${r.first.written.length} writes` : ''
    const n3 = r.third ? `; then ${sw.mode} on board ${r.board} (${sw.how}), ${sw.mode === 'watch' ? 'no' : sw.policy} bot: ${r.third.trace.length} lines as a fresh page` : ''
    console.log(`  ${it.kind.padEnd(5)} ${it.id.padEnd(24)} ${why ? `FAIL: ${why.split('\n')[0].slice(0, 260)}` : `same twice (${n})${n3}`}`)
  })
  console.log(failed ? `\nrematch-check FAILED: ${failed} of ${items.length}` : `\nrematch-check passed: every battle played twice in one page is the same battle, a third on a new board in another mode is the battle a fresh page plays, and every terrain report was played (${Math.round((Date.now() - t0) / 1000)} s)`)
  process.exit(failed ? 1 : 0)
}
