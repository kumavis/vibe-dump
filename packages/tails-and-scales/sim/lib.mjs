// Shared plumbing for the sim/ scripts: running oracle jobs in child
// processes, hashing traces, judging a run against the corpus, and reading
// and writing the corpus. Library only: every CLI in sim/ is its own file.
//
// The corpus commits inputs and hashes only. Per battle: the seed/dice pair
// or the human command log `{ setup, entries }`, then one short sha256 prefix
// per trace line, per shadow snapshot and per battle-log write. A mismatch
// still names the first line that diverged; the full reference text is
// regenerated on demand from the PIN code (sim/oracle/PIN).
import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, readdirSync, existsSync, rmSync, cpSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cpus } from 'node:os'
import { pageStart } from './oracle/human-bot.mjs'
import { codeDir } from './oracle/pin.mjs'

export const SIM = fileURLToPath(new URL('./', import.meta.url))
export const BASE = join(SIM, 'baselines')
const RUNNER = join(SIM, 'oracle', 'run-legacy.mjs')
// the page under the fake DOM (sim/oracle's driver): the runner of code
// older than R6, of P-browser's Node twin and of every check that plays the
// page (present-check, rematch-check, perturb)
export const PAGE_RUNNER = RUNNER
// the headless fold of the pure core (R6), which takes the same jobs and
// reports the same way (sim/run.mjs): parity's default from R6b
export const CORE_RUNNER = join(SIM, 'run.mjs')
// The runner a package's own code is judged by: its pure core when it has
// one (core/index.js, R6a on), else its page.
export const runnerOf = (dir) => (existsSync(join(dir, 'core', 'index.js')) ? CORE_RUNNER : RUNNER)

// ── The legacy rules ────────────────────────────────────────────────────────
// The R0 commit: the first with the ?debug hooks. It and every commit before
// R2 hold the unit types, armies and sides in rules.js, and the key,
// ability-text and fx tests R2 replaced with flags in main.js and ai.js, with
// the same unit data throughout; sim/data-check.mjs and flag-lint's
// --self-test compare against it. It is named here rather than read from
// sim/oracle/PIN, because the PIN moves at every deliberate re-record (N0's
// CORE_VERSION 2, the F4, F5 and F7 baselines) to code that has none of
// this. It never moves (nor does PIN's `hooks` line, but that one belongs to
// hooks-inert.mjs).
export const LEGACY_REF = 'cacf5f5ade9c38720875b428a7dd82f6a386efdc'
export function legacyDir() {
  const dir = codeDir(LEGACY_REF)
  // a wrong sha here must fail loudly, not compare against the wrong code
  if (!/^export const TYPES = \{/m.test(readFileSync(join(dir, 'rules.js'), 'utf8'))) {
    throw new Error(`the legacy anchor ${LEGACY_REF.slice(0, 12)} has no TYPES in rules.js: it must name the R0 commit`)
  }
  return dir
}

export const h10 = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10)
export const hashLines = (lines) => lines.map(h10).join(' ')

// Index of the first line whose hash differs (or that is missing on either
// side), or -1 when every line matches.
export function firstDiff(lines, hashes) {
  const hs = hashes ? hashes.split(' ') : []
  for (let i = 0; i < Math.max(lines.length, hs.length); i++) if (lines[i] === undefined || h10(lines[i]) !== hs[i]) return i
  return -1
}

// ── Running the oracle ──────────────────────────────────────────────────────
// A battle takes 1-2 s in Node. One that has produced no result after this
// long is spinning without ever yielding to the frame pump (a lost loop
// guard, say), which run-legacy's own stall check, counting frames, can't see.
export const ORACLE_TIMEOUT_MS = Number(process.env.ORACLE_TIMEOUT_MS) || 60000
// and one that writes far more than any battle does (300-400 trace lines) is
// looping too, while the trace grows
const RUNAWAY = 20000
const live = new Set()
let reaper = false

// Run one job (see run-legacy.mjs) against the package in `dir`. The child
// streams every trace line, shadow and battle-log write on fd 3 as it takes
// them, so a run that crashes or is stopped at the deadline still reports
// how far it got: { trace, shadow, written, error }, like any run that
// stopped short, and parity names the battle and the line. `runner` is the
// legacy page under the fake DOM by default, or CORE_RUNNER, the pure core.
export function runOracle(job, dir, { ms = ORACLE_TIMEOUT_MS, runner = RUNNER } = {}) {
  if (!reaper) {
    // killing the parent alone (timeout, kill) must not leave children spinning
    reaper = true
    for (const [sig, n] of [['SIGINT', 130], ['SIGTERM', 143]]) {
      process.once(sig, () => {
        for (const p of live) p.kill('SIGKILL')
        process.exit(n)
      })
    }
  }
  return new Promise((resolve, reject) => {
    const p = spawn(process.execPath, [runner, '--job', '-', '--dir', dir, '--progress', '3'], { stdio: ['pipe', 'pipe', 'pipe', 'pipe'] })
    live.add(p)
    const part = { trace: [], shadow: [], written: [] }
    const KEY = { l: 'trace', s: 'shadow', w: 'written' }
    let out = '', err = '', buf = '', late = false, runaway = false
    const timer = setTimeout(() => {
      late = true
      p.kill('SIGKILL')
    }, ms)
    // decoded as streams: a character split across two chunks (an em dash
    // in a battle-log line) stays whole
    for (const s of [p.stdout, p.stderr, p.stdio[3]]) s.setEncoding('utf8')
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.stdio[3].on('data', (d) => {
      buf += d
      for (let i; !runaway && (i = buf.indexOf('\n')) >= 0; buf = buf.slice(i + 1)) {
        const [k, v] = Object.entries(JSON.parse(buf.slice(0, i)))[0]
        if (part[KEY[k]].push(v) > RUNAWAY) (runaway = true), p.kill('SIGKILL')
      }
    })
    p.on('close', (code) => {
      clearTimeout(timer)
      live.delete(p)
      const stopped = (error) => resolve({ ...part, entries: null, error })
      if (runaway) return stopped(`it wrote more than ${RUNAWAY} ${Object.keys(part).find((k) => part[k].length > RUNAWAY)} records, so it was killed: a loop that never ends?`)
      if (late) return stopped(`no result after ${ms / 1000} s, so it was killed: a loop that never yields? It had written ${part.trace.length} trace lines (ORACLE_TIMEOUT_MS sets the limit)`)
      if (code !== 0) return stopped(err.trim().split('\n').slice(0, 6).join('\n') || `oracle exited with ${code}`)
      try {
        resolve({ ...JSON.parse(out), stderr: err })
      } catch (e) {
        reject(new Error(`the oracle printed something besides its result (${e.message}): ${out.slice(0, 120)}`))
      }
    })
    p.stdin.end(JSON.stringify(job))
  })
}

// Map `fn` over `items` with at most `n` in flight; results keep item order.
export async function pool(items, n, fn) {
  const out = new Array(items.length)
  let next = 0
  const worker = async () => {
    for (let i; (i = next++) < items.length; ) out[i] = await fn(items[i], i)
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker))
  return out
}
export const CPUS = Math.max(1, cpus().length)

// ── Judging a run ───────────────────────────────────────────────────────────
// A run matches its battle when the trace, the shadow snapshots and the
// battle-log writes all hash the same, in every engine: (N0) the rules'
// trig is core/dmath.js's, so Chromium computes Node's shadow too (code
// older than N0 took the engine's Math.sin/cos, which Chromium's build of
// V8 rounds differently for a few inputs: its terrain an ULP apart there).
export function verdict(item, r) {
  const line = firstDiff(r.trace, item.trace)
  const shadow = firstDiff(r.shadow ?? [], item.shadow)
  const written = firstDiff(r.written ?? [], item.written)
  return { ok: line < 0 && shadow < 0 && written < 0 && !r.error, line, shadow, written }
}

// index in the trace of the k-th state (non-log) line, where shadow k was taken
export function stateLine(trace, k) {
  for (let i = 0, n = -1; i < trace.length; i++) if (!trace[i].startsWith('log ') && ++n === k) return i
  return trace.length
}

const cut = (s, n = 320) => (s === undefined ? '(ended)' : s.length > n ? s.slice(0, n) + '…' : s)
const nth = (hashes, k) => `(reference hash ${hashes?.split(' ')[k] ?? 'none: the reference ended'})`

// What went wrong, as text. `ref` is a run of the same battle by code known
// to reproduce the corpus (the PIN's), or null when there is none to show.
export function explain(item, r, v, ref) {
  const out = []
  if (v.line >= 0) {
    const k = v.line
    // a run that broke off with everything before matching stopped; it did not diverge
    out.push(`   ${r.error && k >= r.trace.length ? 'STOPPED before' : 'DIVERGES at'} trace line ${k + 1} of ${item.n}`)
    for (let i = Math.max(0, k - 2); i < k; i++) out.push(`     ${String(i + 1).padStart(4)}   ${cut(r.trace[i], 200)}`)
    out.push(`     ${String(k + 1).padStart(4)} - ${ref ? cut(ref.trace[k]) : nth(item.trace, k)}`)
    out.push(`          + ${cut(r.trace[k])}`)
    for (let i = k + 1; i < Math.min(r.trace.length, k + 3); i++) out.push(`     ${String(i + 1).padStart(4)} + ${cut(r.trace[i], 200)}`)
  } else {
    if (v.written >= 0) {
      // writes are `@<trace length> <class>: <html>`; most echo a `log` line,
      // the rest (destroyed units) are written but never traced
      const k = v.written
      out.push(`   BATTLE LOG DIFFERS at write ${k + 1} of ${item.written.split(' ').length}; the trace still matches`)
      out.push(`     - ${ref ? cut(ref.written?.[k]) : nth(item.written, k)}`, `     + ${cut(r.written?.[k])}`)
    }
    if (v.shadow >= 0) {
      const k = v.shadow, at = stateLine(r.trace, k)
      out.push(`   SHADOW DIFFERS at state ${k + 1} (trace line ${at + 1}: ${cut(r.trace[at], 80)}); the 3-decimal trace still matches`)
      if (ref?.shadow?.[k] !== undefined && r.shadow[k] !== undefined) {
        const a = ref.shadow[k].split(' | '), b = r.shadow[k].split(' | ')
        const i = a.findIndex((x, j) => x !== b[j])
        out.push(`     - ${cut(a[i])}`, `     + ${cut(b[i])}`)
      }
    }
  }
  if (r.error) out.push(`   STOPPED: ${r.error.split('\n').slice(0, 3).join(' / ')}`)
  return out.join('\n')
}

// One word for a verdict, for the per-battle lines.
export const tag = (v, r) =>
  v.ok ? 'same' : r.error && (v.line < 0 || v.line >= r.trace.length) ? 'STOPPED' : v.line >= 0 ? 'DIVERGES' : v.written >= 0 ? 'LOG DIFFERS' : 'SHADOW DIFFERS'

// ── The corpus ──────────────────────────────────────────────────────────────
// sim/baselines/pairs.json   AI-vs-AI pairs: { seed, dice, why, n, trace, shadow, written },
//                            and `engines`: the Node and Chromium that recorded
//                            the whole corpus
// sim/baselines/human/*.json human logs: { setup, bot, why, n, trace, shadow, written, entries }
// sim/baselines/pilot/*.json (F10b) human logs that put units on autopilot
//                            (`pilot`), recorded on F10b's code: a log set of
//                            their own, as each new corpus is (DESIGN §4.2.9)
// sim/baselines/army/*.json  (F11a) battles whose seats name army lists, each
//                            built by core/army.js's autoList at 90% of the
//                            mission's points: AI pairs, stored as logs with
//                            no entries (the whole battle runs inside the
//                            start), and human-bot hotseat logs
// sim/baselines/fort/*.json  (F7a) battles on the fortified board, recorded on
//                            F7a's code: AI pairs (both seats AI, so a log
//                            with no entries: the whole battle runs inside
//                            its start) and human-bot logs
// sim/baselines/scale/*.json (F8b) battles on the larger boards, recorded on
//                            F8b's code: Field and Grand AI pairs (logs with
//                            no entries, as army/'s) and human-bot logs, each
//                            seat's list built at 90% of its mission's points
// (until N0 the corpus also kept Chromium's shadow hashes, `webShadow`, where
// they differed from Node's: since N0 every engine computes Node's). Each
// item comes back as { id, kind, set, mode, job, ...stored fields } (`set`
// a log's: human, pilot, army, fort or scale), `mode` the title screen's for
// its seats (a log whose seats no button seats is refused here) and `kind`
// who sits in them: 'ai' for pairs.json's pairs and for a log whose seats
// are both AI (F11a's army/, F7a's fort/ and F8b's scale/ all keep AI pairs
// as logs, because their setups name what a seed pair can't: lists and seat
// races, a terrain set, a board), 'human' for a log with a human seat. So
// `--only ai` takes every AI battle, a pair or a log, and `--only army`,
// `--only fort` or `--only scale` a set's whole; a consumer that needs a
// pair's seeds reads `it.set` (undefined for a pair) or `it.job.seed`.
// Whether the page can make the rest of a setup is found where it is
// played: every page runner holds the battle the page started to the log's
// setup (oracle/human-bot.mjs's playedAs).
export const LOG_SETS = Object.freeze(['human', 'pilot', 'army', 'fort', 'scale'])
export function loadCorpus() {
  const pairs = JSON.parse(readFileSync(join(BASE, 'pairs.json'), 'utf8'))
  const items = pairs.pairs.map((p) => ({ ...p, id: `${p.seed}-${p.dice}`, kind: 'ai', mode: 'watch', job: { seed: p.seed, dice: p.dice } }))
  for (const set of LOG_SETS) {
    const hdir = join(BASE, set)
    if (!existsSync(hdir)) continue
    for (const f of readdirSync(hdir).filter((f) => f.endsWith('.json')).sort()) {
      const h = JSON.parse(readFileSync(join(hdir, f), 'utf8'))
      const mode = pageStart(h.setup).mode
      items.push({ ...h, id: f.replace(/\.json$/, ''), kind: mode === 'watch' ? 'ai' : 'human', set, mode, job: { setup: h.setup, entries: h.entries } })
    }
  }
  return { pairs, items }
}

// The battles an --only list names: kinds (ai, human), modes (watch,
// bushtail, serpent, hotseat), a log set (LOG_SETS: human, pilot, army,
// fort, scale) or ids. A token that names nothing is a usage error, so a typo can
// never pass a gate by selecting no battles.
export function select(all, only) {
  if (only === undefined) return all
  const tokens = only.split(',').map((s) => s.trim()).filter(Boolean)
  const hit = (o, it) => o === it.kind || o === it.mode || o === it.set || o === it.id
  const unknown = tokens.filter((o) => !all.some((it) => hit(o, it)))
  if (!tokens.length || unknown.length) {
    const modes = [...new Set(all.map((it) => it.mode).filter(Boolean))].join(', ')
    console.error(`--only ${unknown.length ? `${unknown.join(', ')}: matches no battle` : 'is empty'}; use a kind (ai, human), a mode (${modes}), a log set (${LOG_SETS.join(', ')}) or a battle id`)
    process.exit(2)
  }
  return all.filter((it) => tokens.some((o) => hit(o, it)))
}

export function savePairs(pairs) {
  // one pair per line, its hashes on the same line: small and diffable
  const head = { ...pairs, pairs: undefined }
  const body = pairs.pairs.map((p) => '  ' + JSON.stringify(p)).join(',\n')
  const json = JSON.stringify(head, null, 1).replace(/\n}$/, `,\n "pairs": [\n${body}\n ]\n}`)
  writeFileSync(join(BASE, 'pairs.json'), json + '\n')
}

export function saveHuman(id, log, set = 'human') {
  const { setup, entries, ...rest } = log
  const lines = [
    '{',
    ` "setup": ${JSON.stringify(setup)},`,
    ...Object.entries(rest).filter(([, v]) => v !== undefined).map(([k, v]) => ` ${JSON.stringify(k)}: ${JSON.stringify(v)},`),
    // (an AI pair's log has none: the whole battle runs inside its start)
    ...(entries.length ? [' "entries": [', entries.map((e) => '  ' + JSON.stringify(e)).join(',\n'), ' ]'] : [' "entries": []']),
    '}',
  ]
  const text = lines.join('\n') + '\n'
  JSON.parse(text) // never write a log the corpus can't read back
  if (!LOG_SETS.includes(set)) throw new Error(`no log set ${set}`)
  mkdirSync(join(BASE, set), { recursive: true })
  writeFileSync(join(BASE, set, `${id}.json`), text)
}

// A human log's stored fields, in file order.
export const humanRecord = (it) => ({ setup: it.setup, bot: it.bot, why: it.why, n: it.n, trace: it.trace, shadow: it.shadow, written: it.written, entries: it.entries })

// Text features of a battle, for choosing what the corpus should cover.
export function features(trace) {
  const f = {}
  const count = (k, re) => (f[k] = trace.filter((l) => re.test(l)).length)
  count('friendlyFire', /^log .*Friendly fire!/)
  count('mesmerize', /^log .* mesmerizes /)
  count('flee', /^log .* flee\./)
  count('wrecked', /^log .*of scenery .* wrecked\./)
  count('fizzle', /^log .* it fizzles /)
  count('failedCharge', /^log .* Failed\. rng/)
  count('fallBack', /^log \d .* fall back /)
  return f
}

// ── Building a copy of the app ──────────────────────────────────────────────
// Copy a package's sources (not dist/, sim/ or node_modules/) to `dst`.
export function copyCode(src, dst) {
  rmSync(dst, { recursive: true, force: true })
  cpSync(src, dst, { recursive: true, filter: (p) => !/^[\\/]?(dist|sim|node_modules)([\\/]|$)/.test(p.slice(src.length)) })
  return dst
}

// Build the app in `root` (any directory, e.g. a git archive under /tmp) the
// way the shared Vite config does. Bare imports resolve as if from this
// package, so a copy outside the repo still finds node_modules. With
// `keepIdentifiers` it minifies as shipped but renames nothing.
export async function buildApp(root, outDir, { minify = true, keepIdentifiers = false } = {}) {
  const { build } = await import('vite')
  const from = join(SIM, '..', 'main.js')
  const repoModules = {
    name: 'repo-modules',
    resolveId(src, importer, opts) {
      if (/^[@a-z]/i.test(src) && !src.includes(':')) return this.resolve(src, from, { ...opts, skipSelf: true })
    },
  }
  await build({
    root, base: './', configFile: false, logLevel: 'silent', plugins: [repoModules],
    esbuild: keepIdentifiers ? { minifyIdentifiers: false } : undefined,
    build: { outDir, emptyOutDir: true, minify, reportCompressedSize: false },
  })
  return outDir
}
