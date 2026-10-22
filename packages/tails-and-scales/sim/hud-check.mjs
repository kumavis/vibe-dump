// The HUD after a snap mid-battle (DESIGN §2.4, §2.11; R7b). A snap
// (view/player.js's snap(G): a new table and a battle's start today; N2's
// rejoin, scrub and catch-up later) makes the table the match as it stands
// at once, dropping whatever was still to play, so whatever the HUD keeps
// outside the mirror must be derived again from the snapped table, not
// left as the dropped events would have set it: the HUD model's own state
// (present/hud-model.js's afterSnap: a phase has been shown once the
// snapped mirror's stage is 'battle'; the buttons come up as the player is
// idle on a local seat's decision), a charge's spots (shaded again as the
// input catches up) and the end screen (shown as the table comes to rest
// past the battle's end: app/flow.js's snapped()). Before R7b a snap
// mid-battle left End and Auto down for the seat whose phase it was, and
// no end screen.
//
// Each battle is played in Chromium on a fresh build of the code under test
// (?debug&fast, started from its title-screen button; a human log's seats
// played by the corpus driver, as P-browser's), and snapped where the table
// is behind the match:
//   - in the deployment (a human log): a seat played here deploying, the
//     table still playing what came before (the stage, a placement);
//   - in the roll-off (a human log): the battle's stage played, no phase
//     begun on the table yet, a seat played here holding its phase decision
//     (the match has run on past the roll-off and any AI turn before it);
//   - in a seat's phase (a human log): the table still showing the other
//     seat's turn (an AI's, or in hotseat the other player's) while a seat
//     played here holds its phase decision;
//   - at a charge's end (a human log with one): a seat played here picking
//     where its charge ends, the table still playing the charge's roll;
//     and once the table has caught up and shaded the spots, again where it
//     stands (a rejoin while a seat picks: the snap clears the spots the
//     input already shaded, and it must shade them again);
//   - past game.over (every battle; a watched battle at once, its whole
//     battle computed as it starts): the match over, its game.over event
//     still queued, unplayed.
// After each snap, while the figures settle (the driver held), the page must
// show: in the deployment, End up and enabled as "Begin battle ▸", Auto
// down, the deployment's hint and the deploying seat's zone lit; for a
// phase, End up and enabled as "End <phase> ▸", Auto up and enabled, a
// hint; at a charge's end, Shortest move up, End and Auto down, the
// charge's hint ("Charge! Rolled …") and its spots shaded orange; past the
// end, the end screen up, worded as the match's own game.over event (taken
// from the player's queue before the snap drops it: who won, how, the score
// and the rounds), End and Auto down; and nowhere else Shortest move, nor
// the end screen. The battle must then play on to its end with every log
// entry played and no page error.
//
// And the HUD model's end.ready, read off the ?debug block's `hud` (the
// model last put on the page): after each snap in a phase, and wherever the
// player is idle on a seat played here holding its phase decision, it must
// be exactly "no unit of the seat can act" (the core's anyCanAct, asked
// with the dice locked), and (F3) the page must show it: End lit (its
// `.ready` class) exactly then, and Begin battle lit wherever it shows in
// the deployment. Over the default battles it must have been true somewhere
// (a seat with nothing left to do in its phase, before its End) as well as
// false.
//
//   node sim/hud-check.mjs [--only <kinds, modes or ids>] [--dist <dir>]
//   node sim/hud-check.mjs --self-test     each edit of MUTATIONS (the HUD's
//                                          state, a charge's spots or the
//                                          end screen left as the dropped
//                                          events had them, End never
//                                          ready, or (F3) End or Begin
//                                          battle never lit, in a copy)
//                                          must fail it,
//                                          after the unedited code passes
//
// By default four battles: a watched one and three human logs (one per
// vs-AI seat, one hotseat). Exit 0 when every snap shows what it must and
// End's readiness is the match's, 1 otherwise, 2 on bad arguments. Set
// CHROMIUM_PATH to the pre-installed Chromium if Playwright's own isn't
// installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { loadCorpus, select, buildApp, copyCode } from './lib.mjs'
import { IDLE_MS } from './chromium.mjs'
import { PKG } from './oracle/pin.mjs'
import { humanDriver, legacyMode, setupFor, missingHooks } from './oracle/human-bot.mjs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, dist: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
} catch (e) {
  console.error(`hud-check: ${e.message}\nusage: node sim/hud-check.mjs [--only <kinds, modes or ids>] [--dist <dir>] | --self-test`)
  process.exit(2)
}
const DEFAULT = '64-89,bushtail-random-6,serpent-late-1,hotseat-aggressive-103'
let items
try {
  items = select(loadCorpus().items, a.only ?? DEFAULT)
} catch (e) {
  console.error(`hud-check: ${e.message}`)
  process.exit(2)
}
// each phase's name, as the End button names it
const { PHASES } = await import(pathToFileURL(join(PKG, 'core', 'rules.js')).href)
const NAMES = Object.fromEntries(PHASES.map((p) => [p.key, p.name]))
// frames to let the table settle after a snap, the driver held
const SETTLE = 8

// --self-test's edits: [file, text, replacement], each the HUD left as the
// events a snap dropped had it
const MUTATIONS = {
  // no phase shown after a snap: End and Auto stay down for the seat's phase
  // (until its next phase.start plays)
  'phase-unshown': ['present/hud-model.js', "export const afterSnap = (M) => ({ phaseShown: M.stage === 'battle', buttonsUp: false })", 'export const afterSnap = () => ({ phaseShown: false, buttonsUp: false })'],
  // End never ready, whatever is left to do (F3's End never lit)
  'ready-never': ['present/hud-model.js', '    ready: mine && idle ? !ask((G, q) => q.anyCanAct(G, P.seats[0])) : false,', '    ready: false,'],
  // (F3) the model right, but End never lit on the page
  'lit-never': ['ui/actions.js', "    end.classList.toggle('ready', m.end.lit)", "    end.classList.toggle('ready', false)"],
  // (F3) End lit only when ready: Begin battle neutral in the deployment
  'deploy-unlit': ['present/hud-model.js', '  end.lit = deploying || end.ready', '  end.lit = end.ready'],
  // (F3) Begin battle lit, but End never lit when nothing is left to do
  'ready-unlit': ['present/hud-model.js', '  end.lit = deploying || end.ready', '  end.lit = deploying'],
  // no end screen after a snap past the battle's end
  'over-unshown': ['app/flow.js', "    if (M.stage === 'over' && !this.ui.result.up) this.over(resultOf(G))", '    // (dropped)'],
  // a charge's spots left marked as shaded after a snap clears them: the
  // input never shades them again (the pick is the same decision's: the
  // snap again at a charge's end)
  'pick-unshaded': ['app/flow.js', '    human.pickShown = null\n', ''],
}
const SELF_TEST_ON = '64-89,hotseat-aggressive-103'

// In the page, before the app: catch window.__ts, drive a human log's seats
// (the corpus driver), and snap at each point due, reading the page once
// the table has settled.
function pageHarness(job, mode, settle, names) {
  // (`ready`: end.ready held to the match at each frame the player is idle
  // on a local seat's phase: how often, how often true, the first time
  // wrong)
  const sim = (window.__sim = { error: null, driver: null, snaps: [], done: false, ready: { checked: 0, ready: 0, wrong: null } })
  let ts = null
  addEventListener('error', (e) => (sim.error ??= String(e.error?.stack ?? e.message)))
  addEventListener('unhandledrejection', (e) => (sim.error ??= String(e.reason?.stack ?? e.reason)))
  // the stage the table last showed begin, and whether a phase has begun on
  // it since
  let stage = null, begun = false
  Object.defineProperty(window, '__ts', {
    configurable: true,
    get: () => ts,
    set: (v) => {
      ts = v
      const missing = missingHooks(v)
      if (missing.length) return void (sim.error = `window.__ts lacks ${missing.join(', ')}`)
      if (mode !== 'watch') sim.driver = humanDriver(ts, { entries: job.entries })
      // Under ?fast a placement and a charge's roll play through at once,
      // the table never behind on them at a frame: so while a seat played
      // here waits on its deployment or its charge's end and that point is
      // still to snap, the player is held a frame at each checkpoint (the
      // ?debug block's pauseAtChecks; the entry's last is the stop itself)
      ts.view.pauseAtChecks(() => {
        const P = ts.G?.pending
        const hold = ts.session?.decisionFor() >= 0 && ((P.k === 'deploy' && todo.includes('in the deployment')) || (P.k === 'chargeEnd' && todo.includes(CHARGE_END)))
        return hold ? new Promise((r) => requestAnimationFrame(() => r())) : null
      })
      ts.present.listen({
        reset: () => {},
        event: (e) => {
          if (e.t === 'stage') (stage = e.stage), (begun = false)
          if (e.t === 'phase.start') begun = true
        },
      })
      requestAnimationFrame(loop)
    },
  })
  // the points still to snap at, whichever comes first (a seat's charge
  // may come before the table shows the other seat's turn, or after); one
  // the battle passes by is dropped, and judge() says which it needed
  const CHARGE_END = "at a charge's end", AGAIN = "again at a charge's end"
  const todo = mode === 'watch' ? ['past the end'] : ['in the deployment', 'in the roll-off', 'in a phase', CHARGE_END, AGAIN, 'past the end']
  let waiting = null
  // the page as a player sees it
  const lit = () => document.querySelector('#endPhase').classList.contains('ready')
  const shown = (s) => {
    const el = document.querySelector(s)
    return { show: getComputedStyle(el).display !== 'none', enabled: !el.disabled, text: el.textContent }
  }
  // the overlay's shading (view/overlay.js: the one plane textured by the
  // nav grid, a texel per cell), whether it is shown and with a texel in a
  // charge's orange
  const shading = () => {
    let out = null
    ts.scenery.scene.traverse((o) => {
      if (!o.isMesh || !o.material?.map?.isDataTexture) return
      const d = o.material.map.image.data
      let orange = false
      for (let i = 0; i < d.length && !orange; i += 4) orange = d[i + 3] > 0 && d[i] === 255 && d[i + 1] === 150 && d[i + 2] === 60
      out = { shown: o.visible, orange }
    })
    return out
  }
  // the game.over event still to play (the player's queue, not promised)
  const queuedOver = () => {
    if (!Array.isArray(ts.player.q)) throw new Error("the player's queue (player.q) is gone: hud-check takes the game.over a snap drops from it")
    return ts.player.q.find((e) => e.t === 'game.over') ?? null
  }
  // nothing left for the seat whose phase decision the match holds to do
  // (what end.ready must say)
  const done = (g) => !ts.session.preview((G, q) => q.anyCanAct(G, g.pending.seats[0]))
  const read = () => ({
    end: shown('#endPhase'), auto: shown('#autoPhase'), shortest: shown('#closestSpot'), ready: ts.hud?.end.ready ?? null, zones: ts.hud?.zones ?? null, shading: shading(),
    hint: getComputedStyle(document.querySelector('#hint')).display === 'none' ? '' : document.querySelector('#hint').textContent,
    over: document.querySelector('#over').classList.contains('hidden') ? null : { title: document.querySelector('#overTitle').textContent, why: document.querySelector('#overWhy').textContent },
  })
  // what the page must show once settled after the snap, by the match (and
  // past the end by its game.over event, which the snap drops)
  const expect = (what, g) => {
    const P = g.pending
    if (what === 'in the deployment') return { seat: ts.session.decisionFor() }
    if (what === CHARGE_END || what === AGAIN) return { rolled: P.rolled }
    if (what !== 'past the end') return { phase: names[P.phase], ready: done(g) }
    const { win, why, vp, rounds } = queuedOver(), when = rounds ? `in round ${rounds}` : 'in the deployment'
    return {
      win, why,
      line: why === 'score' ? `Final score ${vp[0]} – ${vp[1]} after ${rounds} round${rounds === 1 ? '' : 's'}.` : why === 'wipe' ? `have been wiped from the table ${when}.` : `conceded ${when}.`,
    }
  }
  // whether a point is due now: the table behind the match (but for the
  // snap again at a charge's end, once the table has caught up and the
  // first snap there is taken: the spots shaded, the driver not yet on)
  const due = (what, g) => {
    const P = g.pending, M = ts.player.mirror, idle = ts.player.idle
    const local = ts.session.decisionFor() >= 0
    if (what === AGAIN) return idle && local && P?.k === 'chargeEnd' && !todo.includes(CHARGE_END)
    if (idle) return false
    if (what === 'in the deployment') return local && P?.k === 'deploy'
    if (what === 'in the roll-off') return local && P?.k === 'phase' && stage === 'battle' && !begun
    if (what === 'in a phase') return local && P?.k === 'phase' && M.stage === 'battle' && begun && M.active !== P.seats[0]
    if (what === CHARGE_END) return local && P?.k === 'chargeEnd'
    return g.turn.stage === 'over' && !!queuedOver()
  }
  // the points the battle has passed by: the deployment once the match has
  // left it, every other once it is over (and the end itself once its
  // game.over has played)
  const passed = (what, g) => (what === 'in the deployment' && g.turn.stage !== 'deploy') || (g.turn.stage === 'over' && (what !== 'past the end' || !queuedOver()))
  function loop() {
    try {
      if (waiting) {
        if (--waiting.n > 0) return void requestAnimationFrame(loop)
        sim.snaps.push({ what: waiting.what, want: waiting.want, got: read(), at: ts.trace.length })
        waiting = null
        // (the driver held one frame more: a point due where the table now
        // rests, the snap again at a charge's end, comes first)
        return void requestAnimationFrame(loop)
      } else if (ts.G && todo.length) {
        const g = ts.G
        const what = todo.find((w) => due(w, g))
        if (what) {
          todo.splice(todo.indexOf(what), 1)
          const want = expect(what, g)
          ts.player.snap(g)
          waiting = { what, want, n: settle }
          return void requestAnimationFrame(loop)
        }
      }
      if (ts.G) for (const w of todo.filter((w) => passed(w, ts.G))) todo.splice(todo.indexOf(w), 1)
      if (ts.S.stage === 'over' && ts.player.idle && !todo.length) {
        sim.done = true
        return
      }
      // idle on a seat played here holding its phase: End's readiness
      const g = ts.G
      if (g && ts.player.idle && ts.session.decisionFor() >= 0 && g.pending?.k === 'phase') {
        const want = done(g), got = ts.hud?.end.ready
        sim.ready.checked++
        if (want) sim.ready.ready++
        if (got !== want) sim.ready.wrong ??= `End's readiness ${got} at trace line ${ts.trace.length} (seat ${g.pending.seats[0]}'s ${g.pending.phase}), not ${want}`
        // (F3) and the page shows it: End lit exactly then
        else if (lit() !== want) sim.ready.wrong ??= `End ${lit() ? 'lit' : 'not lit'} at trace line ${ts.trace.length} (seat ${g.pending.seats[0]}'s ${g.pending.phase}), where its readiness is ${want}`
      }
      // (F3) Begin battle lit wherever it shows in the deployment
      if (g && ts.player.idle && g.pending?.k === 'deploy' && shown('#endPhase') && !lit()) sim.ready.wrong ??= `Begin battle not lit in the deployment (trace line ${ts.trace.length})`
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
    await page.addInitScript({ content: `${[missingHooks, humanDriver].join('\n')}\n(${pageHarness})(${JSON.stringify(item.job)}, ${JSON.stringify(mode)}, ${SETTLE}, ${JSON.stringify(NAMES)})` })
    await page.goto(`${url}/?debug&fast&seed=${setup.board}&dice=${setup.dice}`)
    const boot = await ask(page, () => window.__sim?.error ?? (window.__ts ? null : 'no window.__ts'))
    if (boot) throw new Error(boot)
    await page.click(`[data-mode="${mode}"]`, { timeout: 30000 })
    let mark = '', since = Date.now()
    for (;;) {
      const p = await ask(page, () => ({ done: window.__sim.done || !!window.__sim.error, mark: `${window.__ts.trace.length}/${window.__sim.snaps.length}` }))
      if (p.done) break
      if (p.mark !== mark) (mark = p.mark), (since = Date.now())
      else if (Date.now() - since > IDLE_MS) throw new Error(`stalled at ${p.mark}`)
      await new Promise((r) => setTimeout(r, 500))
    }
    const r = await ask(page, () => ({ snaps: window.__sim.snaps, error: window.__sim.error, unused: window.__sim.driver?.unused ?? 0, ready: window.__sim.ready }))
    if (!r.error && errors.length) r.error = errors.join('\n')
    if (!r.error && r.unused) r.error = `the battle ended with ${r.unused} log entries unplayed`
    return { ...r, mode }
  } finally {
    await ctx.close()
  }
}

// what one snap shows wrong ('' when nothing)
function wrong({ what, want, got }) {
  const bad = []
  const down = (b, name) => got[b].show && bad.push(`${name} up`)
  const zones = (z) => JSON.stringify(got.zones) !== JSON.stringify(z) && bad.push(`the zones ${JSON.stringify(got.zones)}, not ${JSON.stringify(z)}`)
  if (what === 'past the end') {
    if (!got.over) bad.push('no end screen')
    else {
      if (want.win < 0 ? got.over.title !== 'A bloody draw' : !got.over.title.endsWith(' win!')) bad.push(`the end screen's title "${got.over.title}"`)
      if (!got.over.why.endsWith(want.line)) bad.push(`the end screen says "${got.over.why}", not "… ${want.line}"`)
    }
    down('end', 'End')
    down('auto', 'Auto')
    zones([0.05, 0.05])
  } else if (what === 'in the deployment') {
    if (!got.end.show || !got.end.enabled || got.end.text !== 'Begin battle ▸') bad.push(`End ${got.end.show ? `"${got.end.text}"${got.end.enabled ? '' : ', disabled'}` : 'down'}, not "Begin battle ▸"`)
    down('auto', 'Auto')
    if (!got.hint.startsWith('Deployment')) bad.push(`the hint "${got.hint}"`)
    zones([0, 1].map((s) => (s === want.seat ? 0.2 : 0.07)))
  } else if (what === "at a charge's end" || what === "again at a charge's end") {
    if (!got.shortest.show) bad.push('Shortest move down')
    down('end', 'End')
    down('auto', 'Auto')
    if (!got.hint.startsWith(`Charge! Rolled ${want.rolled}"`)) bad.push(`the hint "${got.hint}"`)
    if (!got.shading?.shown || !got.shading.orange) bad.push(`the charge's spots ${got.shading?.shown ? 'shaded, not in orange' : 'not shaded'}`)
    zones([0.05, 0.05])
  } else {
    if (!got.end.show || !got.end.enabled || got.end.text !== `End ${want.phase} ▸`) bad.push(`End ${got.end.show ? `"${got.end.text}"${got.end.enabled ? '' : ', disabled'}` : 'down'}, not "End ${want.phase} ▸"`)
    if (!got.auto.show || !got.auto.enabled) bad.push(`Auto ${got.auto.show ? 'disabled' : 'down'}`)
    if (!got.hint) bad.push('no hint')
    if (got.ready !== want.ready) bad.push(`End's readiness ${got.ready}, not ${want.ready}`)
    zones([0.05, 0.05])
  }
  if (!what.endsWith("at a charge's end")) down('shortest', 'Shortest move')
  if (what !== 'past the end' && got.over) bad.push('the end screen up')
  return bad.join('; ')
}

// the points a battle must be snapped at: every human log's deployment,
// roll-off and phase, and its charge's end (twice) if it has one; every
// battle's end
const needs = (item, mode) => (mode === 'watch' ? [] : ['in the deployment', 'in the roll-off', 'in a phase', ...((item.job.entries ?? []).some((e) => e.t === 'chargeEnd') ? ["at a charge's end", "again at a charge's end"] : [])]).concat('past the end')

// what one battle's run says is wrong ('' when nothing is)
function judge(item, r) {
  if (r.error) return r.error.split('\n')[0]
  const missing = needs(item, r.mode).filter((w) => !r.snaps.some((s) => s.what === w))
  if (missing.length) return `never snapped ${missing.join(', ')}`
  const bad = r.snaps.map((s) => [s.what, wrong(s)]).filter(([, w]) => w)
  if (bad.length) return bad.map(([what, w]) => `snapped ${what}: ${w}`).join(' | ')
  return r.ready?.wrong ? `idle: ${r.ready.wrong}` : ''
}

// a snap as the page showed it, in brief
const brief = (s) => `${s.what} (trace line ${s.at}: ${s.what === 'past the end' ? `"${s.got.over.title}", "${s.got.over.why}"` : s.what.endsWith("at a charge's end") ? `Shortest move, "${s.got.hint.slice(0, 22)}…", spots shaded` : `"${s.got.end.text}"${s.got.auto.show ? ', Auto' : ''}`})`
const say = (it, r, why) => `${why ? `FAIL: ${why.slice(0, 400)}` : `right after ${r.snaps.length} snap${r.snaps.length === 1 ? '' : 's'}: ${r.snaps.map(brief).join(', ')}${r.ready?.checked ? `; End's readiness right at ${r.ready.checked} frames idle on a local seat's phase (${r.ready.ready} ready)` : ''}`}`

const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-hud-'))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
let failed = 0
try {
  if (a['self-test']) {
    const on = select(loadCorpus().items, SELF_TEST_ON)
    console.log(`hud-check self-test: ${Object.keys(MUTATIONS).length} edits, each on ${on.map((x) => x.id).join(' and ')}, after the unedited code passes there`)
    for (const [k, name] of ['unedited', ...Object.keys(MUTATIONS)].entries()) {
      const dir = copyCode(PKG, join(work, `${k}`))
      if (name !== 'unedited') {
        const [f, from, to] = MUTATIONS[name]
        const src = readFileSync(join(dir, f), 'utf8')
        if (src.split(from).length !== 2) throw new Error(`hud-check self-test: ${name} finds no single "${from.trim().slice(0, 60)}" in ${f}`)
        writeFileSync(join(dir, f), src.replace(from, to))
      }
      const served = await startStaticServer(await buildApp(dir, join(work, `${k}-dist`)))
      const whys = []
      try {
        for (const it of on) {
          let r
          try {
            r = await run(browser, served.url, it)
          } catch (e) {
            r = { error: e.message, snaps: [] }
          }
          whys.push([it.id, judge(it, r)])
        }
      } finally {
        served.close()
      }
      const caught = whys.filter(([, w]) => /^(snapped |idle: )/.test(w))
      const ok = name === 'unedited' ? whys.every(([, w]) => !w) : caught.length > 0
      if (!ok) failed++
      console.log(`  ${ok ? (name === 'unedited' ? 'passes' : 'caught') : 'WRONG '} ${name.padEnd(14)} ${whys.map(([id, w]) => `${id}: ${(w || 'right').slice(0, 160)}`).join(' | ')}`)
      if (name === 'unedited' && !ok) break
    }
    console.log(failed ? `\nhud-check self-test FAILED: ${failed} wrong verdict(s)` : '\nhud-check self-test passed: the unedited code passes, and every edit is caught')
  } else {
    const dist = a.dist ?? (await buildApp(PKG, join(work, 'dist')))
    const { url, close } = await startStaticServer(dist)
    console.log(`hud-check: ${items.length} battles in Chromium ${browser.version()}, each snapped mid-battle where the table is behind (in the deployment, in the roll-off, in a seat's phase and at a charge's end, there again once the table has caught up, for a human log, and past its end), the HUD, the charge's spots and the end screen read once the table settles`)
    // End's readiness over every battle: at how many frames held, at how
    // many true
    const ready = { checked: 0, ready: 0 }
    try {
      for (const it of items) {
        let r
        try {
          r = await run(browser, url, it)
        } catch (e) {
          r = { error: e.message, snaps: [] }
        }
        const why = judge(it, r)
        if (why) failed++
        ready.checked += r.ready?.checked ?? 0
        ready.ready += r.ready?.ready ?? 0
        console.log(`  ${it.kind.padEnd(5)} ${it.id.padEnd(24)} ${say(it, r, why)}`)
      }
    } finally {
      close()
    }
    // (a readiness never true, or never false, proves little: the default
    // battles have both; a selection may not)
    if (!failed && (!ready.ready || ready.ready === ready.checked) && !a.only) {
      failed++
      console.log(`  FAIL: End's readiness held at ${ready.checked} frames idle on a local seat's phase, ${ready.ready} of them ready: never ${ready.ready ? 'not ready' : 'ready'}`)
    }
    console.log(failed ? `\nhud-check FAILED: ${failed} of ${items.length} battles` : `\nhud-check passed: after every snap mid-battle the HUD is the snapped match's (Begin battle in the deployment, End and Auto up for a local seat's phase, Shortest move and the spots at a charge's end, the end screen past the end, worded as the match's game.over), and End's readiness is the match's at ${ready.checked} frames idle on a local seat's phase (${ready.ready} ready)`)
  }
} finally {
  await browser.close()
  rmSync(work, { recursive: true, force: true })
}
process.exit(failed ? 1 : 0)
