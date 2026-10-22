// The snap check (DESIGN §2.4, §4 R7): the table the view builds event by
// event is the table a snap of the match builds from the match as it
// stands. The view plays the match's events one at a time (view/player.js),
// moving figures, felling them, breaking and dropping the scenery; a snap
// (the player's snap(G): a new table, a battle's start, a rejoin or a scrub
// later) builds the same table at once from G (TerrainView.sync,
// UnitViews.sync). Whenever the player has drained its queue the two must
// agree, or a rejoin would show another table than the players who watched
// it all.
//
// Each battle is played in Chromium on a fresh build of the code under test
// (?debug&fast, started from its title-screen button), a watched battle
// (an AI pair: the player drains once, at the end) or a human log (it drains
// at every decision the log answers, which a bot plays through the same
// driver as P-browser's). Whenever the player is idle at a point not yet
// checked, the driver waits while the figures settle (a figure walks to its
// slot, a fallen one sinks out of sight, a few frames under ?fast), and then
// the ?debug block's view.snapDiff() compares the table as built with a
// fresh snap's (and with a table kept from the last check and synced again:
// the snap's keeping path): every unit's ring (place, size, colour,
// strength), hit cylinder, standing figures and label; every chunk's mesh,
// shown or not, and where it stands (a dropped block's height, a fallen
// tree's lie); and what the shooting holds outside the mirror (a template's
// marker, an eruption's thorns: none, as a snap holds none). The fresh snap
// is made by the view's own rebuild (view/index.js; main.js's until R7b),
// the one the player's snap calls, into views off the table. And since a
// watched battle drains only at its end, the table is also held at every
// P-present checkpoint on the way (a `check` event, ?debug's: after each
// action, each fight and morale phase, each entry's stop;
// sim/present-check.mjs): the player waits there (the ?debug block's
// view.pauseAtChecks) while the figures settle, and the table as built so
// far must be the snap of the match as it stood there (the checkpoint's
// projection, its chunks those that stood then). The
// battle must also replay the corpus exactly (trace, shadow, battle log),
// so the check ran on the battle it names. And at its end the page's own
// table is snapped where it stands (the player's snap(G), as N2's rejoin
// will snap it): once the figures settle it must be a fresh snap's table,
// and hold none of fx's scorch and acid marks (view state outside the
// mirror, which the battle as built keeps and a snap takes away).
//
//   node sim/snap-check.mjs [--only <kinds, modes or ids>] [--dist <dir>]
//   node sim/snap-check.mjs --self-test    each edit of MUTATIONS (the view
//                                          broken one way at a time, in a
//                                          copy) must fail it, on a battle
//                                          the unedited code passes
//
// By default a selection: four watched battles (one of them 64886-198528,
// the only corpus battle where a block dropped by a collapse still stands
// when its action ends: in every other the same blast or sweep breaks it
// too) and three human logs (one per vs-AI seat, one hotseat), the quick
// run for a step that touches the view; --only picks others (`ai`, `human`
// or ids, as parity's): `--only ai,human`, the whole corpus (about an hour),
// is the milestone run, as P-browser's. Exit 0 when every check of every
// battle holds, 1 otherwise, 2 on bad arguments. Set CHROMIUM_PATH to the
// pre-installed Chromium if Playwright's own isn't installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { loadCorpus, select, verdict, buildApp, copyCode } from './lib.mjs'
import { IDLE_MS } from './chromium.mjs'
import { PKG } from './oracle/pin.mjs'
import { shadowString, shadowParts, shadowOf, instrument } from './oracle/shadow.mjs'
import { humanDriver, legacyMode, setupFor, missingHooks } from './oracle/human-bot.mjs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, dist: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
} catch (e) {
  console.error(`snap-check: ${e.message}\nusage: node sim/snap-check.mjs [--only <kinds, modes or ids>] [--dist <dir>]`)
  process.exit(2)
}
const DEFAULT = '64-89,4242-99,1-2,64886-198528,bushtail-random-6,serpent-late-1,hotseat-aggressive-103'
let items
try {
  items = select(loadCorpus().items, a.only ?? DEFAULT)
} catch (e) {
  console.error(`snap-check: ${e.message}`)
  process.exit(2)
}

// frames to let the figures settle before a check (?fast: a tween ends
// within a frame, and a fall chains three)
const SETTLE = 8

// --self-test's edits: [file, text, replacement, battle], each a way the
// table built event by event could part from the match. The battle an edit
// runs on (SELF_TEST_ON unless it names one) must reach it, or the edit
// would pass as the unedited code does and read as missed: SELF_TEST_ON
// breaks blocks and places units, and a block left hanging over a broken
// one shows only where a dropped block outlives its action (64886-198528,
// where the blast that drops one also hurts it).
const MUTATIONS = {
  // the labels not redrawn as the match's status changes (a wound, a
  // mesmerism, a melee joined)
  'stale-label': ['view/index.js', '      status: () => units.labelAll(),', '      status: () => {},'],
  // a slain model's figure left standing
  'dead-standing': ['view/units.js', '      .then(() => {\n        this.unfigure(f)\n        f.dying = false\n      })\n  }\n\n  // A model flees', '      .then(() => {\n        f.dying = false\n      })\n  }\n\n  // A model flees'],
  // a placed unit's ring and hit cylinder left where the unit stood
  'place-unmoved': ['view/index.js', "      'unit.place': (e) => units.disc(e.u),", "      'unit.place': () => {},"],
  // a broken chunk's mesh left up
  'broken-standing': ['view/terrain.js', "      case 'block': {\n        this.group.remove(v.obj)\n", "      case 'block': {\n"],
  // a block over a broken one left hanging where it stood
  'collapse-hangs': ['view/terrain.js', 'const y0 = m.position.y, y1 = rest', 'const y0 = m.position.y, y1 = y0', '64886-198528'],
  // a hurt block's shudder holding it at the height it was hit at, over its
  // fall (R0's: the block 64886-198528's blast drops and then hurts is left
  // a level up)
  'shudder-holds': ['view/terrain.js', '    }).then(() => {\n      m.position.x = p0.x\n      m.position.z = p0.z\n    })\n', '    }).then(() => m.position.copy(p0))\n', '64886-198528'],
  // a template's marker left on the table once it is thrown (R7a's fixer:
  // the shooting's view state, which a snap clears, compared too)
  'marker-held': ['view/effects/shots.js', '    if (units.gone(e.u, v, gen)) return\n    this.blastMarker?.userData.remove()\n    this.blastMarker = null\n', '    if (units.gone(e.u, v, gen)) return\n'],
  // (R7a's fixer, round 3) a snap that leaves fx's scorch and acid marks on
  // the table, from a timeline it left (caught by the snap in place)
  'marks-kept': ['view/index.js', '    sh.clear()\n    marks.clearDecals()\n', '    sh.clear()\n'],
}
const SELF_TEST_ON = 'hotseat-aggressive-103'

// In the page, before main.js: catch window.__ts, record (the shadow and
// battle log, as P-browser does), and run the battle frame by frame: the
// driver plays the log's next entry when the page asks, except while a
// check waits for the figures to settle; at every idle point a check.
function pageHarness(job, mode, settle) {
  const sim = (window.__sim = { error: null, rec: null, driver: null, checks: [], done: false })
  let ts = null
  addEventListener('error', (e) => (sim.error ??= String(e.error?.stack ?? e.message)))
  addEventListener('unhandledrejection', (e) => (sim.error ??= String(e.reason?.stack ?? e.reason)))
  Object.defineProperty(window, '__ts', {
    configurable: true,
    get: () => ts,
    set: (v) => {
      ts = v
      const missing = missingHooks(v)
      if (missing.length) return void (sim.error = `window.__ts lacks ${missing.join(', ')}`)
      sim.rec = instrument(v)
      if (mode !== 'watch') sim.driver = humanDriver(ts, { entries: job.entries })
      // at every checkpoint, the player waits while the figures settle and
      // the table is held to the match as it stood there
      ts.view.pauseAtChecks((e) => new Promise((resolve) => {
        let n = settle
        const f = () => {
          if (--n > 0) return void requestAnimationFrame(f)
          try {
            sim.checks.push({ mark: `check at trace line ${ts.trace.length}`, stage: 'checkpoint', ...ts.view.snapDiff(e.proj) })
          } catch (err) {
            sim.error ??= String(err.stack ?? err)
          }
          resolve()
        }
        requestAnimationFrame(f)
      }))
      requestAnimationFrame(loop)
    },
  })
  let last = null, waiting = 0
  function loop() {
    try {
      // (no battle yet: the title)
      if (ts.G && ts.player.idle) {
        const mark = `${ts.trace.length}/${sim.driver?.played.length ?? 0}/${ts.S.stage}`
        if (mark !== last) {
          if (++waiting < settle) return void requestAnimationFrame(loop)
          waiting = 0
          last = mark
          const r = ts.view.snapDiff()
          sim.checks.push({ mark, stage: ts.S.stage, ...r })
        }
      } else waiting = 0
      if (ts.S.stage === 'over' && ts.player.idle && last === `${ts.trace.length}/${sim.driver?.played.length ?? 0}/over`) {
        sim.done = true
        return
      }
      sim.driver?.tick()
    } catch (e) {
      sim.error ??= String(e.stack ?? e)
      return
    }
    requestAnimationFrame(loop)
  }
}

async function ask(page, fn, arg) {
  let timer
  try {
    return await Promise.race([page.evaluate(fn, arg), new Promise((_, no) => (timer = setTimeout(() => no(new Error('the page stopped answering')), IDLE_MS)))])
  } finally {
    clearTimeout(timer)
  }
}

async function run(browser, url, item) {
  const setup = item.job.setup ?? setupFor('watch', item.job.seed, item.job.dice)
  const mode = legacyMode(setup)
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    const fns = [shadowString, shadowParts, shadowOf, instrument, missingHooks, humanDriver].join('\n')
    await page.addInitScript({ content: `${fns}\n(${pageHarness})(${JSON.stringify(item.job)}, ${JSON.stringify(mode)}, ${SETTLE})` })
    await page.goto(`${url}/?debug&fast&seed=${setup.board}&dice=${setup.dice}`)
    const boot = await ask(page, () => window.__sim?.error ?? (window.__ts ? null : 'no window.__ts'))
    if (boot) throw new Error(boot)
    await page.click(`[data-mode="${mode}"]`, { timeout: 30000 })
    const t0 = Date.now()
    let mark = '', since = Date.now()
    for (;;) {
      const p = await ask(page, () => ({ done: window.__sim.done || !!window.__sim.error, mark: `${window.__ts.trace.length}/${window.__sim.checks.length}` }))
      if (p.done) break
      if (p.mark !== mark) (mark = p.mark), (since = Date.now())
      else if (Date.now() - since > IDLE_MS) throw new Error(`stalled at ${p.mark}`)
      await new Promise((r) => setTimeout(r, 500))
    }
    const r = await ask(page, () => ({ trace: window.__ts.trace.slice(), shadow: window.__sim.rec.shadow, written: window.__sim.rec.written, checks: window.__sim.checks, error: window.__sim.error, unused: window.__sim.driver?.unused ?? 0 }))
    // the page's own table snapped where it stands, once the battle is
    // read: then, the figures settled, a fresh snap's, and no fx mark left
    if (!r.error) {
      r.checks.push(await ask(page, (settle) => new Promise((resolve) => {
        const ts = window.__ts, marks = ts.view.counts().marks
        ts.player.snap(ts.G)
        let n = settle
        const f = () => {
          if (--n > 0) return void requestAnimationFrame(f)
          const d = ts.view.snapDiff(), left = ts.view.counts().marks
          if (left) (d.diffs = [`marks: ${left} | 0`, ...d.diffs]), d.n++
          resolve({ mark: 'snapped in place', stage: 'in place', marks, ...d })
        }
        requestAnimationFrame(f)
      }), SETTLE))
    }
    if (!r.error && errors.length) r.error = errors.join('\n')
    if (!r.error && r.unused) r.error = `the battle ended with ${r.unused} log entries unplayed`
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}

// what one battle's run says is wrong ('' when nothing is)
function judge(it, r) {
  const v = r.error ? null : verdict(it, r)
  const bad = r.checks.filter((c) => c.n)
  const played = r.checks.filter((c) => c.stage !== 'in place')
  const held = played.filter((c) => c.stage === 'checkpoint').length, drained = played.length - held
  return r.error ? r.error.split('\n')[0] : !v.ok ? `the battle differs from the corpus (trace line ${v.line}, shadow ${v.shadow}, write ${v.written})` : !held || !drained ? `${held} checkpoints and ${drained} drained queues checked` : played.at(-1).stage !== 'over' ? 'no check at the end' : r.checks.at(-1).stage !== 'in place' ? 'no snap in place' : bad.length ? `${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}` : ''
}

const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-snap-'))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
if (a['self-test']) {
  const corpus = loadCorpus().items
  const on = (name) => MUTATIONS[name][3] ?? SELF_TEST_ON
  // the unedited code first, on every battle an edit runs on
  const battles = [...new Set([SELF_TEST_ON, ...Object.keys(MUTATIONS).map(on)])]
  const runs = [...battles.map((id) => ['unedited', id]), ...Object.keys(MUTATIONS).map((name) => [name, on(name)])]
  let missed = 0
  console.log(`snap-check self-test: ${Object.keys(MUTATIONS).length} edits of the view, each on ${SELF_TEST_ON} unless it names another, after the unedited code on ${battles.join(' and ')}`)
  try {
    for (const [k, [name, id]] of runs.entries()) {
      const it = corpus.find((x) => x.id === id)
      const dir = copyCode(PKG, join(work, `${k}`))
      if (name !== 'unedited') {
        const [f, from, to] = MUTATIONS[name]
        const src = readFileSync(join(dir, f), 'utf8')
        if (src.split(from).length !== 2) throw new Error(`snap-check self-test: ${name} finds no single "${from.trim().slice(0, 60)}" in ${f}`)
        writeFileSync(join(dir, f), src.replace(from, to))
      }
      const served = await startStaticServer(await buildApp(dir, join(work, `${k}-dist`)))
      let r
      try {
        r = await run(browser, served.url, it)
      } catch (e) {
        r = { error: e.message, checks: [] }
      } finally {
        served.close()
      }
      const why = judge(it, r)
      const ok = name === 'unedited' ? !why : /checks differ/.test(why)
      if (!ok) missed++
      console.log(`  ${ok ? (name === 'unedited' ? 'passes' : 'caught') : 'WRONG '} ${name.padEnd(16)} ${id.padEnd(23)} ${(why || `the same at ${r.checks.length} checks`).slice(0, 220)}`)
      if (name === 'unedited' && !ok) break
    }
  } finally {
    await browser.close()
    rmSync(work, { recursive: true, force: true })
  }
  console.log(missed ? `\nsnap-check self-test FAILED: ${missed} wrong verdict(s)` : '\nsnap-check self-test passed: the unedited code passes, and every edit is caught')
  process.exit(missed ? 1 : 0)
}
const dist = a.dist ?? (await buildApp(PKG, join(work, 'dist')))
const { url, close } = await startStaticServer(dist)
console.log(`snap-check: ${items.length} battles in Chromium ${browser.version()}, the table built event by event against a fresh snap of the match (and one kept and synced again) whenever the player has drained its queue, and at every checkpoint on the way`)
let failed = 0, checks = 0, figures = 0, chunks = 0
try {
  for (const it of items) {
    let r
    try {
      r = await run(browser, url, it)
    } catch (e) {
      r = { error: e.message, checks: [] }
    }
    const played = r.checks.filter((c) => c.stage !== 'in place')
    const held = played.filter((c) => c.stage === 'checkpoint').length, drained = played.length - held
    const why = judge(it, r)
    if (why) failed++
    checks += r.checks.length
    const last = played.at(-1), snapped = r.checks.at(-1)
    if (last) (figures += last.figures), (chunks += last.chunks)
    console.log(`  ${it.kind.padEnd(5)} ${it.id.padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the same at ${drained} drained queues and ${held} checkpoints, and snapped in place (${snapped.marks} fx marks taken away) (at the end ${last.units} units, ${last.figures} figures standing, ${last.shown} of ${last.chunks} chunks shown; ${r.secs} s)`}`)
  }
} finally {
  await browser.close()
  close()
  rmSync(work, { recursive: true, force: true })
}
console.log(failed ? `\nsnap-check FAILED: ${failed} of ${items.length} battles` : `\nsnap-check passed: ${checks} checks over ${items.length} battles, the table as built is the table a snap builds every time the player drains, and at every checkpoint on the way, and each battle's table snapped in place at its end is a fresh snap's, with no fx mark left`)
process.exit(failed ? 1 : 0)
