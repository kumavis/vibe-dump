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
//   - (F4) at the round limit (a human log that votes): a seat played here
//     still to vote, the table still playing the round's score;
//   - past game.over (every battle; a watched battle at once, its whole
//     battle computed as it starts): the match over, its game.over event
//     still queued, unplayed (a battle the round limit's last say ends
//     plays its end in the table's next frame: that point is taken as the
//     driver plays the say).
// After each snap, while the figures settle (the driver held), the page must
// show: in the deployment, End up and enabled as "Begin battle ▸", Auto
// down, the deployment's hint and the deploying seat's zone lit; for a
// phase, End up and enabled as "End <phase> ▸", Auto up and enabled, a
// hint; at a charge's end, Shortest move up, End and Auto down, the
// charge's hint ("Charge! Rolled …") and its spots shaded orange; at the
// round limit, the vote's panel up ("Round r is over"), End and Auto down;
// past the end, the end screen up (not the vote's panel), worded as the match's own game.over event (taken
// from the player's queue before the snap drops it: who won, how, the score
// and the rounds), End and Auto down; and nowhere else Shortest move, nor
// the end screen or the vote's panel. The battle must then play on to its end with every log
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
//   node sim/hud-check.mjs [--only <kinds, modes or ids>] [--dist <dir>] [--tips]
//                                          (--tips: (F7b) the tooltips alone,
//                                          and with --self-test their edits)
//   node sim/hud-check.mjs --self-test     each edit of MUTATIONS (the HUD's
//                                          state, a charge's spots or the
//                                          end screen left as the dropped
//                                          events had them, End never
//                                          ready, or (F3) End or Begin
//                                          battle never lit, in a copy)
//                                          must fail it,
//                                          after the unedited code passes
//
// (F7b, DESIGN §4.2.4's "View, input, UI") And the tooltips that read
// heights, on a fortified Skirmish hotseat battle played at the table
// (sim/fort-scene.mjs: seed 3, dice 1, both deployments as the autoload
// placed them), the pointer moved over the table by Playwright:
//   - a climb: a unit of the seat moving, on its rampart, picked up, the
//     pointer on the ground just past a ladder's foot its plan climbs down:
//     the tooltip reads `<inches>" of <move>" (<2h>" climbing)`, the
//     climb's cost the ladder's (twice its height), within the inches; on
//     its own deck, no climbing;
//   - a rim: the pointer along its deck's edges, the overlay's rims under
//     the unit's radius: somewhere "a ledge: no way down here", and not at
//     the deck's middle;
//   - a shot past a parapet: in a shooting phase, a shooter standing on
//     the ground and an enemy on a deck it sees past a parapet (the match's
//     sightInfo: visible, a parapet among the obscurers): hovering the
//     enemy reads "Visible · target behind a parapet (cover)", the odds
//     with `cover`, its LOS block amber, and the LOS ray drawn amber, a
//     beam to each of the enemy's standing models; the pointer off it, no
//     ray; and an enemy it can't see at all (if one stands): "Blocked by
//     …" and the ray red.
// --self-test runs them on TIP_MUTATIONS' edits too (the climb's cost
// never added; the ray always drawn green), each of which must fail them.
//
// By default five battles: a watched one and four human logs (one per
// vs-AI seat, one hotseat, and (F4) a hotseat log that votes at the round
// limit and plays two overtime rounds), then the tooltips. Exit 0 when every snap shows what it must and
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
import { humanDriver, jobSetup, pageStart, playedAs, missingHooks } from './oracle/human-bot.mjs'
import { fortScene } from './fort-scene.mjs'

let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, dist: { type: 'string' }, 'self-test': { type: 'boolean' }, tips: { type: 'boolean' } } }))
} catch (e) {
  console.error(`hud-check: ${e.message}\nusage: node sim/hud-check.mjs [--only <kinds, modes or ids>] [--dist <dir>] | --self-test`)
  process.exit(2)
}
const DEFAULT = '64-89,bushtail-random-6,serpent-late-1,hotseat-aggressive-103,hotseat-late-vote-9'
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
  'ready-never': ['present/hud-model.js', '    ready: mine && idle ? !ask((G, q) => G.units.some((u) => u.side === P.seats[0] && !covered.has(u.id) && q.canAct(G, u))) : false,', '    ready: false,'],
  // (F3) the model right, but End never lit on the page
  'lit-never': ['ui/actions.js', "    end.classList.toggle('ready', m.end.lit)", "    end.classList.toggle('ready', false)"],
  // (F3) End lit only when ready: Begin battle neutral in the deployment
  'deploy-unlit': ['present/hud-model.js', '  end.lit = deploying || end.ready', '  end.lit = end.ready'],
  // (F3) Begin battle lit, but End never lit when nothing is left to do
  'ready-unlit': ['present/hud-model.js', '  end.lit = deploying || end.ready', '  end.lit = deploying'],
  // no end screen after a snap past the battle's end
  'over-unshown': ['app/flow.js', "    if (M.stage === 'over' && (!this.ui.result.up || this.ui.result.voting)) this.over(resultOf(G))", '    // (dropped)'],
  // (F4) the round limit's vote panel never shown
  'vote-unshown': ['app/flow.js', "    if (this.player.idle && P?.k === 'roundLimit' && this.session.decisionFor() >= 0) {", '    if (false) {'],
  // a charge's spots left marked as shaded after a snap clears them: the
  // input never shades them again (the pick is the same decision's: the
  // snap again at a charge's end)
  'pick-unshaded': ['app/flow.js', '    human.pickShown = null\n', ''],
}
const SELF_TEST_ON = '64-89,hotseat-aggressive-103,hotseat-late-vote-9'
// (F7b) the tooltips' edits, each of which tips() must catch
const TIP_MUTATIONS = {
  // the climb's cost never added up: no "(4.0" climbing)"
  'tip-no-climb': ['input/tools/move.js', '    if (k >= 0) sum += k', '    if (k >= 0) sum += 0'],
  // the LOS ray always green, whatever the verdict
  'tip-ray-green': ['input/tools/shoot.js', '  ray?.(los.rays, LOS_COLORS[los.verdict])', '  ray?.(los.rays, LOS_COLORS.clear)'],
}

// (F7b) The tooltips that read heights (the header): a fortified hotseat
// battle played at the table. Returns { rows, why } (why '' when every row
// holds).
async function tips(browser, url) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  page.setDefaultTimeout(IDLE_MS)
  const errors = [], rows = [], whys = []
  page.on('pageerror', (e) => errors.push(e.message))
  const no = (m) => whys.push(m)
  try {
    const f = await fortScene(page, url)
    const first = await f.at()
    const A = first.seat
    // ── a climb, and a rim ──
    const cl = await f.climbs(A)
    if (!cl.length) no(`no unit of seat ${A} on a deck climbs a ladder down in its first movement phase`)
    else {
      const c = cl[0]
      // (just past the foot, away from the deck)
      const dx = c.foot.x - c.top.x, dz = c.foot.z - c.top.z, L = Math.hypot(dx, dz)
      const g = { x: c.foot.x + (dx / L) * 0.6, z: c.foot.z + (dz / L) * 0.6 }
      await f.pose([g.x + (dx / L) * 6 - (dz / L) * 4, 9, g.z + (dz / L) * 6 + (dx / L) * 4], [(g.x + c.top.x) / 2, 0.8, (g.z + c.top.z) / 2])
      await f.select(c.u)
      const at = await f.hover(g.x, 0, g.z)
      const t = await f.tip()
      const m = t.text.match(/(\d+\.\d)" of (\d+)" \((\d+\.\d)" climbing\)/)
      const want = (2 * c.h).toFixed(1)
      if (at.on !== 'CANVAS') no(`the climb's point is under ${at.on}, not the table`)
      else if (!m) no(`hovering past ladder ${c.ladder}'s foot with unit ${c.u} picked up, the tooltip reads "${t.text}": no climbing breakdown`)
      else if (m[3] !== want || +m[1] < +m[3] || +m[1] > +m[2]) no(`the climbing breakdown "${m[0]}": the climb costs ${want}" (twice the ladder's ${c.h}"), within the inches spent`)
      else rows.push(`a climb down ladder ${c.ladder} reads "${m[0]}"`)
      // the deck's own top: no climbing; its edges: a rim somewhere
      const deck = await f.ev((u) => window.__ts.session.preview((G, q) => {
        const unit = G.units.find((x) => x.id === u)
        const c = G.terrain.chunks.find((c) => c.alive && c.kind === 'deck' && c.surface && Math.abs(Math.cos(c.shape.yaw) * (unit.pos.x - c.shape.x) - Math.sin(c.shape.yaw) * (unit.pos.z - c.shape.z)) <= c.shape.hx && Math.abs(Math.sin(c.shape.yaw) * (unit.pos.x - c.shape.x) + Math.cos(c.shape.yaw) * (unit.pos.z - c.shape.z)) <= c.shape.hz)
        return c && { x: c.shape.x, z: c.shape.z, hx: c.shape.hx, hz: c.shape.hz, yaw: c.shape.yaw, y: c.surface.y }
      }), c.u)
      if (!deck) no(`unit ${c.u} stands on no deck`)
      else {
        const toWorld = (lx, lz) => ({ x: deck.x + lx * Math.cos(deck.yaw) + lz * Math.sin(deck.yaw), z: deck.z - lx * Math.sin(deck.yaw) + lz * Math.cos(deck.yaw) })
        await f.pose([deck.x + 0.01, deck.y + 16, deck.z + 6], [deck.x, deck.y, deck.z])
        const mid = toWorld(0, 0)
        await f.hover(mid.x, deck.y, mid.z)
        const tm = await f.tip()
        if (/climbing|a ledge/.test(tm.text)) no(`the deck's middle reads "${tm.text}"`)
        let rim = null
        // (points just inside each edge: along the long ones at a quarter,
        // the middle and three quarters, and the middle of the short ones)
        const edges = [...[-0.5, 0, 0.5].flatMap((k) => [[k, 1], [k, -1]]), [1, 0], [-1, 0]]
        for (const [kx, kz] of edges) {
          for (const inset of [0.06, 0.15, 0.3]) {
            const p = toWorld(Math.abs(kx) === 1 ? kx * (deck.hx - inset) : kx * deck.hx, Math.abs(kz) === 1 ? kz * (deck.hz - inset) : 0)
            await f.hover(p.x, deck.y, p.z)
            const tr = await f.tip()
            if (tr.text.includes('a ledge: no way down here')) {
              rim = tr.text
              break
            }
          }
          if (rim) break
        }
        if (!rim) no(`no point along the deck's edges reads "a ledge: no way down here" with unit ${c.u} picked up (its rims under its radius)`)
        else rows.push(`its deck's rim reads "${rim.split('\n').at(-1)}", its middle not`)
      }
      await f.select(null)
      await f.away()
    }
    // ── a shot past a parapet ──
    let shot = null, seat = A
    for (const s of [A, 1 - A]) {
      await f.until(s, 'shoot')
      const list = await f.shots(s)
      if (list.length) {
        shot = list.find((p) => p.range) ?? list[0]
        seat = s
        break
      }
    }
    if (!shot) no(`no shooter on the ground sees an enemy on a deck past a parapet in either seat's first shooting phase`)
    else {
      const n = await f.ev((id) => window.__ts.G.units.find((u) => u.id === id).alive, shot.e)
      await f.pose([shot.x + 4, shot.y + 7, shot.z + 9], [shot.x, shot.y, shot.z])
      await f.select(shot.s)
      const at = await f.hover(shot.x, shot.y + 0.6, shot.z)
      const t = await f.tip(), b = await f.beams()
      if (at.on !== 'CANVAS') no(`the target's point is under ${at.on}, not the table`)
      else if (!t.text.includes('Visible · target behind a parapet (cover)')) no(`seat ${seat}'s unit ${shot.s} on the ground hovering unit ${shot.e} behind a parapet: the tooltip reads "${t.text}"`)
      else if (shot.range && !/· cover ·|· cover$/m.test(t.text)) no(`the odds don't say cover: "${t.text}"`)
      else if (t.los !== 'cover') no(`the reasons' block is ${t.los}, not amber (cover)`)
      else if (b.n !== n || b.color !== '#ffb347') no(`the LOS ray: ${b.n} beams in ${b.color}, not ${n} (a model each) in amber #ffb347`)
      else rows.push(`unit ${shot.s} on the ground at unit ${shot.e} on a deck: "${t.text.split('\n').find((l) => l.includes('parapet'))}", the ray amber, ${b.n} beams`)
      await f.away()
      const off = await f.beams()
      if (off.n) no(`the pointer off the table, ${off.n} LOS beams still drawn`)
      // an enemy it can't see, if one stands
      const hid = await f.ev((s) => window.__ts.session.preview((G, q) => {
        const u = G.units.find((x) => x.id === s)
        const e = G.units.find((e) => e.side !== u.side && q.alive(e) && !q.sightInfo(G, u, e).ok)
        return e && { id: e.id, x: e.pos.x, z: e.pos.z, y: q.floorAt(G, e.pos.x, e.pos.z), indirect: !!u.t.ranged.indirect }
      }), shot.s)
      if (hid) {
        await f.pose([hid.x + 4, hid.y + 8, hid.z + 9], [hid.x, hid.y, hid.z])
        await f.hover(hid.x, hid.y + 0.6, hid.z)
        const th = await f.tip(), bh = await f.beams()
        // (refused, "✖ no line of sight", unless the weapon lobs over:
        // an indirect one's odds say "unseen (indirect −1)")
        const head = hid.indirect ? th.text.includes('unseen (indirect −1)') : /^✖ no line of sight/.test(th.text)
        if (!head || !th.text.includes('Blocked') || th.los !== 'blocked' || bh.color !== '#ff5a4a') no(`unit ${hid.id}, unseen: the tooltip reads "${th.text}" (${th.los}), the ray ${bh.n} beams in ${bh.color}: ${hid.indirect ? '"unseen (indirect −1)"' : '"✖ no line of sight"'}, "Blocked …" and red`)
        else rows.push(`unit ${hid.id}, unseen: "${th.text.split('\n').find((l) => l.startsWith('Blocked'))}", the ray red`)
        await f.away()
      }
      await f.select(null)
    }
  } catch (e) {
    no(e.message.split('\n')[0])
  } finally {
    await page.context().close()
  }
  if (errors.length) no(`page errors: ${errors.slice(0, 3).join('; ')}`)
  return { rows, why: whys.join('; ') }
}

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
  const CHARGE_END = "at a charge's end", AGAIN = "again at a charge's end", ROUND_LIMIT = 'at the round limit'
  const todo = mode === 'watch' ? ['past the end'] : ['in the deployment', 'in the roll-off', 'in a phase', CHARGE_END, AGAIN, ROUND_LIMIT, 'past the end']
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
    // (F4) the panel showing the round limit's vote, not the end
    vote: !document.querySelector('#over').classList.contains('hidden') && !document.querySelector('#overVote').classList.contains('hidden'),
  })
  // what the page must show once settled after the snap, by the match (and
  // past the end by its game.over event, which the snap drops)
  const expect = (what, g) => {
    const P = g.pending
    if (what === 'in the deployment') return { seat: ts.session.decisionFor() }
    if (what === CHARGE_END || what === AGAIN) return { rolled: P.rolled }
    if (what === ROUND_LIMIT) return { round: g.turn.round }
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
    if (what === ROUND_LIMIT) return local && P?.k === 'roundLimit'
    return g.turn.stage === 'over' && !!queuedOver()
  }
  // the points the battle has passed by: the deployment once the match has
  // left it, every other once it is over (and the end itself once its
  // game.over has played)
  const passed = (what, g) => (what === 'in the deployment' && g.turn.stage !== 'deploy') || (g.turn.stage === 'over' && (what !== 'past the end' || !queuedOver()))
  // the first point due now, snapped at: the table settles `settle` frames
  // before it is read
  const take = (g) => {
    const what = todo.find((w) => due(w, g))
    if (!what) return false
    todo.splice(todo.indexOf(what), 1)
    const want = expect(what, g)
    ts.player.snap(g)
    waiting = { what, want, n: settle }
    return true
  }
  function loop() {
    try {
      if (waiting) {
        if (--waiting.n > 0) return void requestAnimationFrame(loop)
        sim.snaps.push({ what: waiting.what, want: waiting.want, got: read(), at: ts.trace.length })
        waiting = null
        // (the driver held one frame more: a point due where the table now
        // rests, the snap again at a charge's end, comes first)
        return void requestAnimationFrame(loop)
      } else if (ts.G && todo.length && take(ts.G)) return void requestAnimationFrame(loop)
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
      // (F4) an entry that ends the battle at once (the round limit's last
      // say) leaves its end queued only until the table's next frame plays
      // it: a point due then is taken before that frame
      if (sim.driver?.tick() && ts.G && todo.length) take(ts.G)
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
    await page.addInitScript({ content: `${[missingHooks, humanDriver].join('\n')}\n(${pageHarness})(${JSON.stringify(item.job)}, ${JSON.stringify(mode)}, ${SETTLE}, ${JSON.stringify(NAMES)})` })
    await page.goto(`${url}/?debug&fast&${query}`)
    const boot = await ask(page, () => window.__sim?.error ?? (window.__ts ? null : 'no window.__ts'))
    if (boot) throw new Error(boot)
    await page.click(`[data-mode="${mode}"]`, { timeout: 30000 })
    // (F6) the battle-setup panel's Start, its races the URL's
    await page.click('#setupStart', { timeout: 30000 })
    let mark = '', since = Date.now()
    for (;;) {
      const p = await ask(page, () => ({ done: window.__sim.done || !!window.__sim.error, mark: `${window.__ts.trace.length}/${window.__sim.snaps.length}` }))
      if (p.done) break
      if (p.mark !== mark) (mark = p.mark), (since = Date.now())
      else if (Date.now() - since > IDLE_MS) throw new Error(`stalled at ${p.mark}`)
      await new Promise((r) => setTimeout(r, 500))
    }
    const r = await ask(page, () => ({ snaps: window.__sim.snaps, error: window.__sim.error, unused: window.__sim.driver?.unused ?? 0, ready: window.__sim.ready, setup: window.__ts.G?.setup }))
    if (!r.error && errors.length) r.error = errors.join('\n')
    // the battle played is the log's, field for field
    r.error ??= playedAs(r.setup, setup)
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
    else if (got.vote) bad.push('the vote panel up, not the end screen')
    else {
      if (want.win < 0 ? got.over.title !== 'A bloody draw' : !got.over.title.endsWith(' win!')) bad.push(`the end screen's title "${got.over.title}"`)
      if (!got.over.why.endsWith(want.line)) bad.push(`the end screen says "${got.over.why}", not "… ${want.line}"`)
    }
    down('end', 'End')
    down('auto', 'Auto')
    zones([0.05, 0.05])
  } else if (what === 'at the round limit') {
    if (!got.vote) bad.push('no vote panel')
    else if (got.over.title !== `Round ${want.round} is over`) bad.push(`the vote panel's title "${got.over.title}", not "Round ${want.round} is over"`)
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
  if (what !== 'past the end' && what !== 'at the round limit' && got.over) bad.push('the end screen up')
  return bad.join('; ')
}

// the points a battle must be snapped at: every human log's deployment,
// roll-off and phase, its charge's end (twice) if it has one and its round
// limit if it votes; every battle's end
const needs = (item, mode) => (mode === 'watch' ? [] : ['in the deployment', 'in the roll-off', 'in a phase', ...((item.job.entries ?? []).some((e) => e.t === 'chargeEnd') ? ["at a charge's end", "again at a charge's end"] : []), ...((item.job.entries ?? []).some((e) => e.t === 'vote') ? ['at the round limit'] : [])]).concat('past the end')

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
const brief = (s) => `${s.what} (trace line ${s.at}: ${s.what === 'past the end' ? `"${s.got.over.title}", "${s.got.over.why}"` : s.what === 'at the round limit' ? `"${s.got.over.title}"` : s.what.endsWith("at a charge's end") ? `Shortest move, "${s.got.hint.slice(0, 22)}…", spots shaded` : `"${s.got.end.text}"${s.got.auto.show ? ', Auto' : ''}`})`
const say = (it, r, why) => `${why ? `FAIL: ${why.slice(0, 400)}` : `right after ${r.snaps.length} snap${r.snaps.length === 1 ? '' : 's'}: ${r.snaps.map(brief).join(', ')}${r.ready?.checked ? `; End's readiness right at ${r.ready.checked} frames idle on a local seat's phase (${r.ready.ready} ready)` : ''}`}`

const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-hud-'))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
let failed = 0
try {
  if (a['self-test']) {
    const on = select(loadCorpus().items, SELF_TEST_ON)
    console.log(a.tips ? `hud-check self-test: (F7b) the tooltips' ${Object.keys(TIP_MUTATIONS).length} edits, after the unedited code passes them` : `hud-check self-test: ${Object.keys(MUTATIONS).length} edits, each on ${on.map((x) => x.id).join(' and ')}, after the unedited code passes there; then the tooltips' ${Object.keys(TIP_MUTATIONS).length}`)
    // ((F7b) with --tips, the tooltips' edits alone)
    for (const [k, name] of (a.tips ? [] : ['unedited', ...Object.keys(MUTATIONS)]).entries()) {
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
    // ((F7b) the tooltips: the unedited code passes them, and each of
    // TIP_MUTATIONS' edits fails them)
    if (!failed) {
      for (const [k, name] of ['unedited', ...Object.keys(TIP_MUTATIONS)].entries()) {
        const dir = copyCode(PKG, join(work, `tip${k}`))
        if (name !== 'unedited') {
          const [f, from, to] = TIP_MUTATIONS[name]
          const src = readFileSync(join(dir, f), 'utf8')
          if (src.split(from).length !== 2) throw new Error(`hud-check self-test: ${name} finds no single "${from.trim().slice(0, 60)}" in ${f}`)
          writeFileSync(join(dir, f), src.replace(from, to))
        }
        const served = await startStaticServer(await buildApp(dir, join(work, `tip${k}-dist`)))
        let r
        try {
          r = await tips(browser, served.url)
        } finally {
          served.close()
        }
        const ok = name === 'unedited' ? !r.why : !!r.why
        if (!ok) failed++
        console.log(`  ${ok ? (name === 'unedited' ? 'passes' : 'caught') : 'WRONG '} ${name.padEnd(14)} the tooltips: ${(r.why || r.rows.join('; ') || 'right').slice(0, 300)}`)
        if (name === 'unedited' && !ok) break
      }
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
      for (const it of a.tips ? [] : items) {
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
      // ((F7b) the tooltips that read heights, on a fortified board)
      const t = await tips(browser, url)
      if (t.why) failed++
      console.log(`  F7b   tooltips                 ${t.why ? `FAIL: ${t.why.slice(0, 600)}` : t.rows.join('; ')}`)
    } finally {
      close()
    }
    // (a readiness never true, or never false, proves little: the default
    // battles have both; a selection may not)
    if (!failed && (!ready.ready || ready.ready === ready.checked) && !a.only && !a.tips) {
      failed++
      console.log(`  FAIL: End's readiness held at ${ready.checked} frames idle on a local seat's phase, ${ready.ready} of them ready: never ${ready.ready ? 'not ready' : 'ready'}`)
    }
    console.log(failed ? `\nhud-check FAILED: ${failed} problem(s) over ${a.tips ? 0 : items.length} battles and the tooltips` : `\nhud-check passed: after every snap mid-battle the HUD is the snapped match's (Begin battle in the deployment, End and Auto up for a local seat's phase, Shortest move and the spots at a charge's end, the end screen past the end, worded as the match's game.over), and End's readiness is the match's at ${ready.checked} frames idle on a local seat's phase (${ready.ready} ready); (F7b) the tooltips read heights (a climb's cost, a rim, a shot past a parapet in cover, the ray in the verdict's colour)`)
  }
} finally {
  await browser.close()
  rmSync(work, { recursive: true, force: true })
}
process.exit(failed ? 1 : 0)
