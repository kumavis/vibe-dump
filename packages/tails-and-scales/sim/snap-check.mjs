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
// (F8b) And the Grand row (DESIGN §4.2.9's snap-check row): in one page a
// watched battle of the grand mission started from the classic title, then
// a classic one: the table made over for each board as its battle starts
// (classic → Grand → classic, view.board()'s builds), the table built event
// by event a fresh snap's at every checkpoint as the corpus battles' are,
// and its terrain tiles (view/terrain.js: a Grand table's chunks drawn by
// 8" tiles) drawn as their chunks at each of them (view.drawing().tiles,
// the tileCheck: every tiled chunk's drawn shape and colour its own
// mesh's, vertex for vertex); the battle snapped in place at its end; and
// back on the classic table, no tile left. It runs by default and with
// --only grand; the self-test's tile edits run on it.
//
// (F9a) And the cart row (DESIGN §4.2.5's view: riders on deck, the hull's
// pips and label, the wreck and the bail-out): a watched Field battle,
// both seats' lists given (CART_ARMIES: the Bushtails with two War-Carts,
// whose deployment's autoload seats their Troops on the decks), the table
// built event by event a fresh snap's at every checkpoint (every rider's
// figures where its hull's deck seats them, every bail-out's on the table),
// and snapped in place at its end. The row must have seen riders aboard at
// some checkpoint, riders stepping off a deck and a War-Cart wrecked (its
// wreck a chunk of the table), or it proves nothing. (F9a's integration:
// the AI's riders step off by their first turns, so its hulls die empty;
// the bail-out's hop and dice are the vehicle/ corpus's bail-out log's, a
// default row.) It runs by default and with --only cart; the self-test's
// deck edits run on it.
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
// too) and four human logs (one per vs-AI seat, one hotseat, and (F4) a
// vs-AI log that votes at the round limit and plays an overtime round), and
// (F9a) the vehicle/ corpus's bail-out log (a War-Cart wrecked with its
// riders aboard: their hop off and the bail-out's dice), the quick run for a
// step that touches the view; --only picks others (`ai`, `human`
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
import { humanDriver, jobSetup, pageStart, playedAs, missingHooks } from './oracle/human-bot.mjs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, dist: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
} catch (e) {
  console.error(`snap-check: ${e.message}\nusage: node sim/snap-check.mjs [--only <kinds, modes or ids>] [--dist <dir>]`)
  process.exit(2)
}
const DEFAULT = '64-89,4242-99,1-2,64886-198528,bushtail-random-6,serpent-late-1,hotseat-aggressive-103,serpent-random-vote-1,bushtail-random-bail-41'
let items
// ((F8b) the Grand row: by default, or named in --only)
const only = (a.only ?? DEFAULT).split(',').map((x) => x.trim())
const GRAND_ROW = !a.only || only.includes('grand')
// ((F9a) the cart row: by default, or named in --only)
const CART_ROW = !a.only || only.includes('cart')
const ROWS = new Set(['grand', 'cart'])
try {
  items = only.filter((x) => !ROWS.has(x)).length ? select(loadCorpus().items, only.filter((x) => !ROWS.has(x)).join(',')) : []
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
  'place-unmoved': ['view/index.js', "      'unit.place': (e) => units.placed(e),", "      'unit.place': () => {},"],
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
  // (F8b, on the Grand row) a chunk promoted out of its tile as a shot
  // hurts it leaves the tile as it was: drawn twice, by its tile and itself
  'tile-stale': ['view/terrain.js', '    item.tile = null\n    if (item.obj) item.obj.visible = true\n    this.mark(t)\n', '    item.tile = null\n    if (item.obj) item.obj.visible = true\n', 'grand'],
  // (F8b, on the Grand row) a classic battle after a Grand one keeps the
  // Grand table's terrain tiles: the classic table drawn otherwise than
  // ever
  'tiles-kept': ['view/index.js', '    this.terrain.tiling(big)\n', '    this.terrain.tiling(big || this.terrain.tiled)\n', 'grand'],
  // (F9a, on the cart row) a rider stepping off left standing on its
  // hull's deck, riding on with it
  'stays-aboard': ['view/units.js', '    this.dismount(e.v, true, e.u)\n    this.disc(e.u)\n', '    this.disc(e.u)\n', 'cart'],
  // (F9a, on the cart row) a rider stepped off left without its ring and
  // hit cylinder, as it rode
  'ringless-off': ['view/units.js', '    this.stands(v, this.shown(e.u).alive > 0)\n    this.layDeck(e.v)\n', '    this.layDeck(e.v)\n', 'cart'],
}
// (F9a) the cart row's battle: the Field mission, seat 0's Bushtails with
// two War-Carts (950 points), seat 1 its preset
const CART_ARMIES = '1222112,field'
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
  const setup = jobSetup(item.job)
  const { mode, query } = pageStart(setup)
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    const fns = [shadowString, shadowParts, shadowOf, instrument, missingHooks, humanDriver].join('\n')
    await page.addInitScript({ content: `${fns}\n(${pageHarness})(${JSON.stringify(item.job)}, ${JSON.stringify(mode)}, ${SETTLE})` })
    await page.goto(`${url}/?debug&fast&${query}`)
    const boot = await ask(page, () => window.__sim?.error ?? (window.__ts ? null : 'no window.__ts'))
    if (boot) throw new Error(boot)
    await page.click(`[data-mode="${mode}"]`, { timeout: 30000 })
    // (F6) the battle-setup panel's Start, its races the URL's
    await page.click('#setupStart', { timeout: 30000 })
    const t0 = Date.now()
    let mark = '', since = Date.now()
    for (;;) {
      const p = await ask(page, () => ({ done: window.__sim.done || !!window.__sim.error, mark: `${window.__ts.trace.length}/${window.__sim.checks.length}` }))
      if (p.done) break
      if (p.mark !== mark) (mark = p.mark), (since = Date.now())
      else if (Date.now() - since > IDLE_MS) throw new Error(`stalled at ${p.mark}`)
      await new Promise((r) => setTimeout(r, 500))
    }
    const r = await ask(page, () => ({ trace: window.__ts.trace.slice(), shadow: window.__sim.rec.shadow, written: window.__sim.rec.written, checks: window.__sim.checks, error: window.__sim.error, unused: window.__sim.driver?.unused ?? 0, setup: window.__ts.G?.setup }))
    // the battle played is the log's, field for field
    r.error ??= playedAs(r.setup, setup)
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

// (F8b) The Grand row: a watched grand battle from the classic title, then
// a classic one, in one page (above). Returns { checks, error, ... } as run
// does, judged by judgeGrand.
async function grandRow(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(`(${(settle) => {
      const sim = (window.__grand = { checks: [], error: null })
      addEventListener('error', (e) => (sim.error ??= String(e.error?.stack ?? e.message)))
      addEventListener('unhandledrejection', (e) => (sim.error ??= String(e.reason?.stack ?? e.reason)))
      // at every checkpoint the player waits while the figures settle, and
      // the table and its tiles are held to the match as it stood there
      const hook = () => {
        if (!window.__ts) return void requestAnimationFrame(hook)
        window.__ts.view.pauseAtChecks((e) => new Promise((resolve) => {
          let n = settle
          const f = () => {
            if (--n > 0) return void requestAnimationFrame(f)
            try {
              const d = window.__ts.view.snapDiff(e.proj), t = window.__ts.view.drawing().tiles
              sim.checks.push({ mark: `check at trace line ${window.__ts.trace.length}`, board: window.__ts.board.W, n: d.n + t.bad.length, diffs: [...t.bad, ...d.diffs], tiles: t.tiles, tiled: t.tiled, chunks: d.chunks })
            } catch (err) {
              sim.error ??= String(err.stack ?? err)
            }
            resolve()
          }
          requestAnimationFrame(f)
        }))
      }
      hook()
    }})(${SETTLE})`)
    await page.goto(`${url}/?debug&fast&seed=4242&dice=99`)
    await page.waitForFunction(() => window.__ts)
    const t0 = Date.now()
    const board = () => page.evaluate(() => ({ ...window.__ts.view.board(), tiles: window.__ts.view.drawing().tiles }))
    const boards = [['the title', await board()]]
    const battle = async (mission) => {
      await page.evaluate((m) => window.__ts.view.mission(m), mission)
      await page.click('[data-mode="watch"]', { timeout: 30000 })
      await page.click('#setupStart', { timeout: 30000 })
      await page.waitForFunction(() => window.__grand.error || (window.__ts.S.stage === 'over' && window.__ts.player.idle), null, { timeout: 900000, polling: 500 })
      // the page's own table snapped in place, then held to a fresh snap
      const end = await page.evaluate((settle) => new Promise((resolve) => {
        const ts = window.__ts
        ts.player.snap(ts.G)
        let n = settle
        const f = () => {
          if (--n > 0) return void requestAnimationFrame(f)
          const d = ts.view.snapDiff(), t = ts.view.drawing().tiles
          resolve({ mark: 'snapped in place', board: ts.board.W, n: d.n + t.bad.length, diffs: [...t.bad, ...d.diffs], tiles: t.tiles, tiled: t.tiled, chunks: d.chunks })
        }
        requestAnimationFrame(f)
      }), SETTLE)
      await page.evaluate((c) => window.__grand.checks.push(c), end)
      boards.push([`the ${mission} battle`, await board()])
      await page.click('#again', { timeout: 30000 })
    }
    await battle('grand')
    await battle('classic')
    boards.push(['the title again', await board()])
    const r = await page.evaluate(() => ({ checks: window.__grand.checks, error: window.__grand.error }))
    if (!r.error && errors.length) r.error = errors.join('\n')
    r.boards = boards
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}
// (F9a) The cart row: a watched Field battle with War-Carts (above).
// Returns { checks, error, ... }, judged by judgeCart.
async function cartRow(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  try {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.addInitScript(`(${(settle) => {
      const sim = (window.__cart = { checks: [], error: null })
      addEventListener('error', (e) => (sim.error ??= String(e.error?.stack ?? e.message)))
      addEventListener('unhandledrejection', (e) => (sim.error ??= String(e.reason?.stack ?? e.reason)))
      // at every checkpoint the player waits while the figures settle, and
      // the table is held to the match as it stood there: how many units
      // rode then, and how many wrecks stood (the chunks of kind 'wreck'
      // the checkpoint's projection holds standing)
      const hook = () => {
        if (!window.__ts) return void requestAnimationFrame(hook)
        window.__ts.view.pauseAtChecks((e) => new Promise((resolve) => {
          let n = settle
          const f = () => {
            if (--n > 0) return void requestAnimationFrame(f)
            try {
              const ts = window.__ts, d = ts.view.snapDiff(e.proj)
              const riders = Object.values(e.proj.units).filter((u) => u.aboard && u.alive > 0).length
              const wrecks = ts.G.terrain.chunks.filter((c) => c.kind === 'wreck' && e.proj.chunks[c.id]?.alive).length
              sim.checks.push({ mark: `check at trace line ${ts.trace.length}`, n: d.n, diffs: d.diffs, riders, wrecks, figures: d.figures })
            } catch (err) {
              sim.error ??= String(err.stack ?? err)
            }
            resolve()
          }
          requestAnimationFrame(f)
        }))
        // every bail-out played (a forced unit.disembark)
        const obs = window.__ts.player.observer
        sim.bails = 0
        window.__ts.present.listen({ ...obs, event: (ev, M) => (ev.t === 'unit.disembark' && (sim[ev.forced ? 'bails' : 'steps'] = (sim[ev.forced ? 'bails' : 'steps'] ?? 0) + 1), obs?.event?.(ev, M)), reset: (M) => obs?.reset?.(M) })
      }
      hook()
    }})(${SETTLE})`)
    await page.goto(`${url}/?debug&fast&seed=4242&dice=99&mission=field&armies=${CART_ARMIES}`)
    await page.waitForFunction(() => window.__ts)
    const t0 = Date.now()
    await page.click('[data-mode="watch"]', { timeout: 30000 })
    await page.click('#setupStart', { timeout: 30000 })
    await page.waitForFunction(() => window.__cart.error || (window.__ts.S.stage === 'over' && window.__ts.player.idle), null, { timeout: 1800000, polling: 500 })
    const end = await page.evaluate((settle) => new Promise((resolve) => {
      const ts = window.__ts
      ts.player.snap(ts.G)
      let n = settle
      const f = () => {
        if (--n > 0) return void requestAnimationFrame(f)
        const d = ts.view.snapDiff()
        resolve({ mark: 'snapped in place', n: d.n, diffs: d.diffs, riders: 0, wrecks: 0 })
      }
      requestAnimationFrame(f)
    }), SETTLE)
    const r = await page.evaluate(() => ({ checks: window.__cart.checks, error: window.__cart.error, bails: window.__cart.bails ?? 0, steps: window.__cart.steps ?? 0, carts: window.__ts.G.units.filter((u) => u.key === 'warcart').length, mission: window.__ts.G.setup.mission }))
    r.checks.push(end)
    if (!r.error && errors.length) r.error = errors.join('\n')
    r.secs = Math.round((Date.now() - t0) / 1000)
    return r
  } finally {
    await ctx.close()
  }
}
// what the cart row says is wrong ('' when nothing is)
function judgeCart(r) {
  if (r.error) return r.error.split('\n')[0]
  const why = []
  if (r.mission !== 'field' || r.carts < 1) why.push(`board: the battle was a ${r.mission} one with ${r.carts} War-Carts (a Field battle, two)`)
  if (!r.checks.some((c) => c.riders > 0)) why.push('board: no checkpoint had a unit aboard a War-Cart')
  // ((F9a's integration) riders stepping off, not bailing out: the AI's
  // riders step off to shoot by their first turns, so in its battles a hull
  // dies with nobody aboard; the bail-out is the vehicle/ corpus's log's,
  // a default row)
  if (!r.checks.some((c) => c.wrecks > 0) || !(r.steps + r.bails)) why.push(`board: ${r.checks.some((c) => c.wrecks > 0) ? 'a wreck' : 'no wreck'} and ${r.steps} step-offs and ${r.bails} bail-outs (a wreck, and riders off a deck)`)
  const bad = r.checks.filter((c) => c.n)
  if (bad.length) why.unshift(`${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}`)
  return why.join('; ')
}

// what the Grand row says is wrong ('' when nothing is)
function judgeGrand(r) {
  if (r.error) return r.error.split('\n')[0]
  const [title, grand, classic, again] = r.boards.map(([, b]) => b)
  const why = []
  if (title.W !== 40 || title.builds !== 0) why.push(`the title's table is ${title.W}" wide, made over ${title.builds} times (classic's, never)`)
  if (grand.W !== 80 || grand.H !== 56 || grand.builds !== 1) why.push(`the grand battle's table is ${grand.W}×${grand.H}, made over ${grand.builds} times (80×56, once)`)
  if (classic.W !== 40 || classic.H !== 28 || classic.builds !== 2) why.push(`the classic battle after it is on a ${classic.W}×${classic.H} table, made over ${classic.builds} times (40×28, twice)`)
  if (classic.tiles.tiles || again.tiles.tiles) why.push(`a classic table holds ${classic.tiles.tiles || again.tiles.tiles} terrain tiles (none)`)
  const grandChecks = r.checks.filter((c) => c.board === 80)
  if (!grandChecks.length || !grandChecks.every((c) => c.tiled > 0)) why.push(`${grandChecks.length} checks on the Grand table, ${grandChecks.filter((c) => !c.tiled).length} of them with no chunk in a tile`)
  const bad = r.checks.filter((c) => c.n)
  if (bad.length) why.push(`${bad.length} of ${r.checks.length} checks differ; first at ${bad[0].mark} on the ${bad[0].board === 80 ? 'Grand' : 'classic'} table (${bad[0].n} differences): ${bad[0].diffs.slice(0, 4).join('; ')}`)
  return why.length ? `${why[0].includes('checks differ') ? '' : 'board: '}${why.join('; ')}` : ''
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
      const it = ROWS.has(id) ? null : corpus.find((x) => x.id === id)
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
        r = it ? await run(browser, served.url, it) : id === 'cart' ? await cartRow(browser, served.url) : await grandRow(browser, served.url)
      } catch (e) {
        r = { error: e.message, checks: [] }
      } finally {
        served.close()
      }
      const why = it ? judge(it, r) : id === 'cart' ? judgeCart(r) : judgeGrand(r)
      const ok = name === 'unedited' ? !why : /checks differ|^board: /.test(why)
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
  if (GRAND_ROW) {
    let r
    try {
      r = await grandRow(browser, url)
    } catch (e) {
      r = { error: e.message, checks: [], boards: [] }
    }
    const why = judgeGrand(r)
    if (why) failed++
    checks += r.checks.length
    const g = r.checks.filter((c) => c.board === 80)
    console.log(`  grand ${'classic → Grand → classic'.padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the table made over for each board (${r.boards.map(([w, b]) => `${w} ${b.W}×${b.H}`).join(', ')}), the same at ${g.length} Grand checkpoints and ${r.checks.length - g.length} classic ones, the tiles drawn as their chunks at each (${g.at(-1)?.tiled} chunks in ${g.at(-1)?.tiles} tiles at the end), and none left on the classic table (${r.secs} s)`}`)
  }
  if (CART_ROW) {
    let r
    try {
      r = await cartRow(browser, url)
    } catch (e) {
      r = { error: e.message, checks: [] }
    }
    const why = judgeCart(r)
    if (why) failed++
    checks += r.checks.length
    console.log(`  cart  ${'Field, two War-Carts'.padEnd(24)} ${why ? `FAIL: ${why.slice(0, 400)}` : `the same at ${r.checks.length - 1} checkpoints (riders aboard at ${r.checks.filter((c) => c.riders > 0).length}, up to ${Math.max(...r.checks.map((c) => c.riders))} units; a wreck standing at ${r.checks.filter((c) => c.wrecks > 0).length}), ${r.steps} step-offs and ${r.bails} bail-outs played, and snapped in place (${r.secs} s)`}`)
  }
} finally {
  await browser.close()
  close()
  rmSync(work, { recursive: true, force: true })
}
console.log(failed ? `\nsnap-check FAILED: ${failed} of ${items.length + (GRAND_ROW ? 1 : 0) + (CART_ROW ? 1 : 0)} rows` : `\nsnap-check passed: ${checks} checks over ${items.length} battles${GRAND_ROW ? ' and the Grand row' : ''}${CART_ROW ? ' and the cart row' : ''}, the table as built is the table a snap builds every time the player drains, and at every checkpoint on the way, and each battle's table snapped in place at its end is a fresh snap's, with no fx mark left`)
process.exit(failed ? 1 : 0)
