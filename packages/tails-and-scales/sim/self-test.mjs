// The parity harness must catch what it claims to. Each case feeds it a
// deliberately broken input or build and expects one precise failure:
//
//   1. The human driver refuses commands the UI can't issue: a shot or a
//      charge in the movement phase, a move in the shooting phase, a shot in
//      the charge phase, and a second shot by a unit that already shot.
//   2. parity.mjs run through a symlinked path still runs, and fails a build
//      whose dice all come up differently (a CLI that skipped itself would
//      pass everything, silently).
//   3. A build that spins forever without yielding (the fight alternation
//      guard of 30 removed) is killed at the oracle deadline, and parity
//      names the battle instead of hanging.
//   4. A build that never writes a destroyed unit's line to the battle log
//      fails parity, though every trace line is unchanged.
//   5. With --browser: a build whose title-screen buttons start nothing fails
//      P-browser, naming the button.
//
//   node sim/self-test.mjs [--browser]
//
// Runs the frozen PIN code: the mutants are copies of it, so their exact-text
// edits keep applying while the working tree is refactored (until the PIN
// moves; then a mutation that no longer applies is reported, not thrown).
// Exit 0 when every case gets the verdict it must, else 1.
import { parseArgs } from 'node:util'
import { readFileSync, writeFileSync, rmSync, symlinkSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { loadCorpus, runOracle, verdict, copyCode, buildApp } from './lib.mjs'
import { PKG, codeDir, readPin } from './oracle/pin.mjs'

const { values: a } = parseArgs({ options: { browser: { type: 'boolean' } } })
const BASE = codeDir(readPin())
const work = join(tmpdir(), `tails-and-scales-selftest-${process.pid}`)
mkdirSync(work, { recursive: true })
process.on('exit', () => rmSync(work, { recursive: true, force: true }))
const { items } = loadCorpus()
let bad = 0
const verdictLine = (ok, what, why) => {
  if (!ok) bad++
  console.log(`  ${ok ? 'ok  ' : 'BAD '} ${what}${why ? `: ${why}` : ''}`)
}

// A copy of the PIN code with one exact edit of `file`, or null (reported as
// a wrong verdict) when the PIN's text no longer holds the anchor.
function mutant(name, file, from, to) {
  const dir = copyCode(BASE, join(work, name))
  const src = readFileSync(join(dir, file), 'utf8')
  if (src.split(from).length !== 2) {
    verdictLine(false, `mutant "${name}"`, `the PIN's ${file} doesn't hold exactly one "${from.slice(0, 60)}"; update this case for the new PIN`)
    return null
  }
  writeFileSync(join(dir, file), src.replace(from, to))
  return dir
}
// parity.mjs as a child, its stdout+stderr and exit status
const parity = (script, args, env = {}) => {
  const p = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { ...process.env, ...env }, timeout: 300000 })
  return { status: p.status, out: `${p.stdout}${p.stderr}`, hung: p.error?.code === 'ETIMEDOUT' }
}
const PARITY = join(PKG, 'sim', 'parity.mjs')
const last = (s) => s.trim().split('\n').at(-1)

// ── 1. The driver's gates ───────────────────────────────────────────────────
console.log('1. the human driver refuses what the UI never issues')
const log = items.find((it) => it.id === 'hotseat-aggressive-909')
const ref = await runOracle(log.job, BASE)
if (!verdict(log, ref).ok) throw new Error(`${log.id} doesn't replay on the PIN code; run parity --pin first`)
const E = log.entries, asked = ref.asked
const at = (phase, t) => E.findIndex((e, i) => asked[i] === phase && (!t || e.t === t))
const foe = (s) => log.entries.find((e) => e.s !== s && e.u)?.u
const kMove = at('move', 'move'), kShoot = at('shoot', 'shoot'), kCharge = at('charge')
const cases = [
  ['a shot in the movement phase', kMove, (e) => ({ s: e.s, t: 'shoot', u: e.u, tg: foe(e.s) }), /belongs to the shoot phase/],
  ['a charge in the movement phase', kMove, (e) => ({ s: e.s, t: 'charge', u: e.u, tg: foe(e.s) }), /belongs to the charge phase/],
  ['a move in the shooting phase', kShoot, (e) => ({ s: e.s, t: 'move', u: e.u, c: 0 }), /belongs to the move phase/],
  ['a shot in the charge phase', kCharge, (e) => ({ s: e.s, t: 'shoot', u: E[kShoot].u, tg: foe(e.s) }), /belongs to the shoot phase/],
  ['a second shot by the same unit', kShoot + 1, () => E[kShoot], /cannot shoot that|is not a live enemy/],
]
for (const [what, k, make, want] of cases) {
  const wrong = make(E[k] ?? E[k - 1])
  const r = await runOracle({ setup: log.setup, entries: [...E.slice(0, k), wrong] }, BASE)
  const ok = !!r.error && new RegExp(`entry ${k} `).test(r.error) && want.test(r.error)
  verdictLine(ok, `${what} (entry ${k}, ${JSON.stringify(wrong)})`, ok ? r.error.split('\n')[0].replace(/^Error: /, '').slice(0, 110) : `got ${r.error?.split('\n')[0] ?? 'no error: it was accepted'}`)
}

// ── 2. The CLI through a symlink ────────────────────────────────────────────
console.log('2. parity.mjs, run through a symlinked path, still judges')
const link = join(work, 'linked-package')
symlinkSync(PKG, link)
const dice = mutant('dice', 'rules.js', 'export const d6 = () => 1 + Math.floor(rng() * 6)', 'export const d6 = () => 6 - Math.floor(rng() * 6) // MUTANT')
if (dice) {
  const r = parity(join(link, 'sim', 'parity.mjs'), ['--dir', dice, '--only', '64-89'])
  verdictLine(r.status === 1 && /DIVERGES at trace line \d+/.test(r.out), 'a dice mutant, via the link', `exit ${r.status}, ${last(r.out)}`)
}

// ── 3. A loop that never yields ─────────────────────────────────────────────
console.log('3. a battle that spins forever is stopped and named')
const spin = mutant('spin', 'main.js',
  `  for (let guard = 0; guard < 30; guard++) {
    const next = units.find((u) => u.side === side && alive(u) && !u.flags.fought && isEngaged(u))`,
  `  for (let guard = 0; ; guard++) { // MUTANT: no guard, and the fought flag ignored
    const next = units.find((u) => u.side === side && alive(u) && isEngaged(u))`)
if (spin) writeFileSync(join(spin, 'main.js'), readFileSync(join(spin, 'main.js'), 'utf8').replace('    if (next) await fight(next)\n', '    if (next) fight(next) // MUTANT: not awaited\n'))
if (spin) {
  const t0 = Date.now()
  const r = parity(PARITY, ['--dir', spin, '--only', '64-89'], { ORACLE_TIMEOUT_MS: '10000' })
  const secs = Math.round((Date.now() - t0) / 1000)
  verdictLine(!r.hung && r.status === 1 && /ai\s+64-89 .* STOPPED/.test(r.out) && /killed/.test(r.out), `the spinning mutant, with a 10 s deadline (${secs} s)`, r.hung ? 'parity hung' : `exit ${r.status}, ${(r.out.match(/STOPPED before trace line \d+ of \d+/) ?? [last(r.out)])[0]}`)
}

// ── 4. The battle log ───────────────────────────────────────────────────────
console.log('4. a battle log missing its destroyed-unit lines fails, traces unchanged')
const quiet = mutant('quiet', 'main.js', "  S.pendingLog.push([u.side, `<b>${u.t.name}</b> ${u.t.models > 1 ? 'are' : 'is'} destroyed!`, 'big'])\n", '  // MUTANT: the destroyed line is never written\n')
if (quiet) {
  const r = parity(PARITY, ['--dir', quiet, '--only', '64-89,hotseat-aggressive-909'])
  const both = ['64-89', 'hotseat-aggressive-909'].every((id) => new RegExp(`${id} .* LOG DIFFERS`).test(r.out))
  verdictLine(r.status === 1 && both && !/DIVERGES|SHADOW DIFFERS/.test(r.out), 'the mutant that drops "… destroyed!"', `exit ${r.status}, ${(r.out.match(/BATTLE LOG DIFFERS at write \d+ of \d+/) ?? [last(r.out)])[0]}`)
}

// ── 5. The title screen, in Chromium ────────────────────────────────────────
if (a.browser) {
  console.log('5. P-browser fails a build whose title-screen buttons start nothing')
  // one corpus battle per button the verdict names, taken from the corpus so
  // a re-record can't leave this asking for a battle that is gone
  const ids = ['watch', 'hotseat'].map((m) => items.find((it) => it.mode === m)?.id)
  const dead = ids.every(Boolean) && mutant('title', 'main.js', '    start(b.dataset.mode)\n', '    // MUTANT: the title-screen buttons start nothing\n')
  if (!ids.every(Boolean)) verdictLine(false, 'the mutant title screen', `the corpus has no ${['watch', 'hotseat'].filter((m, i) => !ids[i]).join(' or ')} battle to start`)
  else if (dead) {
    const dist = await buildApp(dead, join(work, 'title-dist'))
    const r = parity(PARITY, ['--browser', '--dist', dist, '--only', ids.join(',')])
    verdictLine(r.status === 1 && /\[data-mode="watch"\] button did not start/.test(r.out) && /\[data-mode="hotseat"\] button did not start/.test(r.out), `the mutant title screen (${ids.join(', ')})`, `exit ${r.status}, ${(r.out.match(/the title screen's .* did not start[^\n]*/) ?? [last(r.out)])[0].slice(0, 110)}`)
  }
}

rmSync(work, { recursive: true, force: true })
console.log(bad ? `\nself-test FAILED: ${bad} wrong verdicts` : '\nself-test passed: the harness catches every one')
process.exit(bad ? 1 : 0)
