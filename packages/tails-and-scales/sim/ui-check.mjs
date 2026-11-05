// The army builder's screens in Chromium (DESIGN §4.2.8.8, §4.2.9's
// ui-check row; F11b): the Muster screen (ui/screens/muster.js), the
// battle-setup panel's army line (ui/screens/setup.js, app/boot.js's
// picking), the hotseat's pass screen and the lists saved on the device
// (app/lists.js), driven by the mouse and the keys (and on a phone by taps)
// on a fresh build with ?debug&fast&lowfi, read through the page's DOM,
// and held to core/army.js's own checkList, listCost and keysOf (imported
// here from the code under test: the very check the fold refuses a setup
// by). Each case on a page of its own (a fresh browser context, so nothing
// kept on the device carries from one to the next but where a case says):
//   plus      + is disabled at each cap, its why in its tooltip (data-say,
//             shown on a hover): a role's slot ("Hero: 2 of 2", Field), a
//             role the battle allows none of ("No vehicles in a
//             Skirmish"), the most of one unit ("At most 3 of one unit",
//             Skirmish), the units ("24 units at most", Grand's Bushtails,
//             the one size and race whose models and points let a list
//             reach its units), the models ("36 models at most",
//             Skirmish) and the points ("N over the limit", Field), each
//             at a list checkList takes and whose one more it refuses;
//             and a hover over a disabled + shows the tooltip with it;
//             − is disabled at 0
//   ready     Ready is disabled with the first refusal of checkList as its
//             label (no unit at all; no hero), and enabled at a legal list
//   random    Random, 25 presses at Field and at Grand: every list it makes
//             is legal (checkList, on the counts the rows show) and Ready
//             enabled
//   saved     a list built, saved by name, cleared and opened from Saved
//             is the list built (and so on a fresh page of the same
//             device); the store holds { v: 1, lists: [{ id, name, race,
//             mission, units: by key, at }] }; a saved list naming a unit
//             the roster lacks opens without it, with its note; one over
//             today's limit shows "Prices changed: N over" in Saved and
//             opens red
//   over      a list built for a Field battle, the size then made a
//             Skirmish: the seat's line red, Start disabled with why, and
//             the Muster screen opening on it red (the bar), Ready
//             disabled; back to Field, legal again
//   race      on the panel a race change resets the seat's army line: to
//             the preset (no list kept for the new race), and back to the
//             race of a list readied before, to that race's last list
//             (ts.lists.last); an AI seat's Random rerolls for its race
//   phone     a 360×780 touch screen: the panel and the Muster screen
//             scroll nothing sideways (the page's width, and every box of
//             the screen inside it but the role chips' own scroller), the
//             points bar and Ready stay put while the rows scroll to their
//             end, − and + and Ready, the units' names (a tap: the card),
//             Save list… and the tools at least 44 px, a tap on a disabled
//             + pins its why
//   pass      hotseat: player 1's Ready shows the pass screen, which holds
//             nothing of player 1's list (the Muster screen's rows gone
//             from the page, no unit of the list named outside the rules'
//             help, its total and Ready alone); player 2 builds; back on
//             the panel nothing of either list is in the page, nor once
//             the size changes to one that refuses player 1's list (the
//             line red and Start disabled, saying so without the
//             refusal's words, which name the list's units or roles), and
//             a built seat's Build… opens the pass screen (the screen handed back
//             to its player), not its list; a mirror (player 2 on player
//             1's race) opens on the preset, never on the device's last
//             list (player 1's); both armies take the table at the
//             deployment, unit for unit
//   field     a list built on the Muster screen against the AI, the AI's
//             line on Random, Start: the battle's setup names both lists
//             and each seat's units on the table are its list's, unit for
//             unit in roster order (core/army.js keysOf), and the
//             deployment's banner reads both totals and unit counts
//   door      ?armies=classic,110211 and the panel's Start pressed as it
//             opens: the setup, and the start entry as written, name the
//             URL's values as given (the door every Chromium harness starts
//             a battle with lists by); without it the start entry names
//             none
//
//   node sim/ui-check.mjs [--only <cases>] [--dist <dir>]
//   node sim/ui-check.mjs --self-test     each edit of MUTATIONS (a page
//                                         that breaks one thing the cases
//                                         hold, built afresh) must fail the
//                                         cases it names, after the
//                                         unedited code passes them
//
// Exit 0 when every case holds (the self-test: the unedited code passes
// and every edit is caught), 1 otherwise, 2 on bad arguments. Set
// CHROMIUM_PATH to the pre-installed Chromium if Playwright's own isn't
// installed.
import { parseArgs } from 'node:util'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { startStaticServer } from '../../../scripts/static-server.mjs'
import { buildApp, copyCode } from './lib.mjs'
import { PKG } from './oracle/pin.mjs'

const CASES = ['plus', 'ready', 'random', 'saved', 'over', 'race', 'phone', 'pass', 'field', 'door']
let a
try {
  ({ values: a } = parseArgs({ options: { only: { type: 'string' }, dist: { type: 'string' }, 'self-test': { type: 'boolean' } } }))
  if (a.only && a.only.split(',').some((c) => !CASES.includes(c))) throw new Error(`--only takes some of ${CASES.join(', ')}`)
} catch (e) {
  console.error(`ui-check: ${e.message}\nusage: node sim/ui-check.mjs [--only <cases>] [--dist <dir>] | --self-test`)
  process.exit(2)
}

// the code under test's own army rules and data
const imp = (f) => import(pathToFileURL(join(PKG, f)).href)
const { RACES } = await imp('data/schema.js')
const { MISSIONS } = await imp('data/mission.js')
const { checkList, listCost, listText, keysOf } = await imp('core/army.js')
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const counts = (race, rec) => RACES[race].roster.map((k) => rec[k] ?? 0)
const cost = (race, mission, c) => listCost(RACES[race], c, MISSIONS[mission].list)
// the waits a step may take, and a page's own
const STEP = 15000

// ── The page ──────────────────────────────────────────────────────────────
// A page of its own on the panel of `mode` (?debug&fast&lowfi, the board
// 4242, `q` more of the URL), at `vp` ({ width, height, touch }); `ctx` an
// existing context (the device's storage kept) to open it in.
async function panel(browser, url, { mode = 'bushtail', q = '', vp = { width: 1280, height: 800 }, ctx = null } = {}) {
  ctx ??= await browser.newContext({ viewport: { width: vp.width, height: vp.height }, ...(vp.touch ? { hasTouch: true, isMobile: true } : {}) })
  const page = await ctx.newPage()
  page.setDefaultTimeout(STEP)
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(`${url}/?debug&fast&lowfi&seed=4242${q}`, { timeout: 120000 })
  await page.waitForSelector('#title:not(.hidden)', { timeout: 120000 })
  await page.click(`[data-mode="${mode}"]`)
  await page.waitForSelector('#setup:not(.hidden) #setupStart')
  return { page, ctx, errors }
}
// the panel's battle size
const size = (page, mission) => page.click(`#setupSize button[data-size="${mission}"]`)
// seat s's Build…, and the Muster screen up
async function build(page, s) {
  await page.click(`.setupSeat[data-seat="${s}"] .armyBuild`)
  await page.waitForSelector('#muster:not(.hidden) #musterRows .mRow')
}
// the rows' counts, by unit key in roster order
const rows = (page) => page.evaluate(() => [...document.querySelectorAll('#musterRows .mRow')].map((r) => [r.dataset.unit, Number(r.querySelector('.n').textContent)]))
// The list `want` (counts in roster order) made on the Muster screen by
// its buttons: every row above it − first, then every row below it +
// (from a list within it, every + on the way is within every cap).
async function setTo(page, want) {
  const have = await rows(page)
  for (const [i, [k, n]] of have.entries()) for (let j = n; j > (want[i] ?? 0); j--) await page.click(`.mRow[data-unit="${k}"] .minus`)
  for (const [i, [k, n]] of have.entries()) for (let j = n; j < (want[i] ?? 0); j++) await page.click(`.mRow[data-unit="${k}"] .plus`)
}
// a row's + as the page has it: off (aria-disabled), and its why
const plusOf = (page, k) => page.evaluate((k) => {
  const b = document.querySelector(`.mRow[data-unit="${k}"] .plus`)
  return { off: b.getAttribute('aria-disabled') === 'true' && b.classList.contains('off'), say: b.dataset.say ?? null, tip: b.dataset.tip ?? null }
}, k)
const readyOf = (page) => page.evaluate(() => ({ disabled: document.querySelector('#musterReady').disabled, text: document.querySelector('#musterReady').textContent }))
const lineOf = (page, s) => page.evaluate((s) => {
  const l = document.querySelector(`.setupSeat[data-seat="${s}"] .armyLine`)
  return { bad: l.classList.contains('bad'), value: l.querySelector('select').value, options: [...l.querySelectorAll('option')].map((o) => o.value), total: l.querySelector('.armyTotal').textContent, why: l.querySelector('.armyWhy')?.textContent ?? '', random: l.querySelector('.armyRandom')?.getAttribute('aria-pressed') === 'true' }
}, s)
const startOf = (page) => page.evaluate(() => ({ disabled: document.querySelector('#setupStart').disabled, why: document.querySelector('#setupWhy').textContent }))
// The battle the panel's Start begins: its setup and each seat's units (keys
// in G.units order), once the match stands at its deployment.
async function started(page) {
  await page.click('#setupStart')
  await page.waitForFunction(() => window.__ts?.G?.units?.length > 0 && document.body.classList.contains('playing'), null, { timeout: 120000 })
  return page.evaluate(() => ({ setup: window.__ts.G.setup, units: [0, 1].map((s) => window.__ts.G.units.filter((u) => u.side === s).map((u) => u.key)), banner: document.querySelector('#armyBanner')?.textContent ?? '' }))
}

// (in the page) where the names `names` stand in its text but the rules'
// help and the table's labels, the Muster screen's rows left, and the pass
// screen's and the labels' text
function leakOf(names) {
  const found = []
  const walk = (n) => {
    if (n.nodeType === 3) {
      for (const x of names) if (n.textContent.includes(x) && !n.parentElement.closest('#help, #labels')) found.push(`${x} in ${n.parentElement.tagName.toLowerCase()}${n.parentElement.id ? `#${n.parentElement.id}` : ''}`)
    } else for (const c of n.childNodes) walk(c)
  }
  walk(document.body)
  return { found, rows: document.querySelectorAll('#muster .mRow, #muster [data-unit]').length, muster: document.querySelector('#muster').textContent.length, pass: document.querySelector('#pass').textContent, labels: document.querySelector('#labels').textContent }
}

// ── The cases ─────────────────────────────────────────────────────────────
// Each: (browser, url) → { rows: [what held], why: [what didn't] }.
const CHECKS = {
  async plus(browser, url) {
    const out = { rows: [], why: [] }
    const at = async (mission, race, rec, k, want, seat = 0) => {
      const { page, ctx, errors } = await panel(browser, url, { q: `&mission=${mission}${race === 'serpent' ? '&races=serpent,squirrel' : ''}` })
      try {
        await build(page, seat)
        const c = counts(race, rec), r = RACES[race], rules = MISSIONS[mission].list, i = r.roster.indexOf(k)
        // (the case is a real cap: the list legal, its one more refused)
        const more = c.map((n, j) => (j === i ? n + 1 : n))
        if (checkList(r, rules, c) || !checkList(r, rules, more)) return out.why.push(`${mission} ${listText(c)} + ${k}: no cap here (checkList ${checkList(r, rules, c)} / ${checkList(r, rules, more)})`)
        await setTo(page, c)
        const p = await plusOf(page, k)
        if (!p.off || p.say !== want || p.tip !== 'say') out.why.push(`${mission}, ${listText(c)}: ${k}'s + ${p.off ? 'off' : 'on'}, its why ${JSON.stringify(p.say)} (want off, "${want}")`)
        else out.rows.push(`${MISSIONS[mission].list.size} ${k} "${want}"`)
        // (clicking it changes nothing)
        await page.evaluate((k) => document.querySelector(`.mRow[data-unit="${k}"] .plus`).click(), k)
        const after = (await rows(page)).map(([, n]) => n)
        if (listText(after) !== listText(c)) out.why.push(`${mission}: a click on ${k}'s disabled + took the list to ${listText(after)}`)
        if (mission === 'field' && k === 'elder') {
          // a hover over it shows its why in the tooltip, on the screen
          await page.hover(`.mRow[data-unit="${k}"] .plus`, { force: true })
          const tip = await page.evaluate(() => {
            // (the tooltip takes no pointer: lent one for the look, so
            // elementFromPoint finds it where nothing stands over it)
            const t = document.querySelector('#tooltip'), b = t.getBoundingClientRect(), was = t.style.pointerEvents
            t.style.pointerEvents = 'auto'
            const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2)
            t.style.pointerEvents = was
            return { shown: t.style.display === 'block', text: t.textContent, onTop: t.contains(top) }
          })
          if (!tip.shown || tip.text !== want || !tip.onTop) out.why.push(`a hover over ${k}'s +: the tooltip ${tip.shown ? `"${tip.text}"${tip.onTop ? '' : ', under the screen'}` : 'not shown'}`)
          else out.rows.push('its tooltip on a hover')
          // − at 0
          await setTo(page, c.map((n, j) => (r.roster[j] === 'oakguard' ? 0 : n)))
          if (!(await page.evaluate(() => document.querySelector('.mRow[data-unit="oakguard"] .minus').disabled))) out.why.push('− is not disabled at 0')
          else out.rows.push('− at 0 disabled')
        }
        if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
      } finally {
        await ctx.close()
      }
    }
    // a role's slot, at Field: the Field preset holds two Elders
    await at('field', 'squirrel', { elder: 2, oakguard: 2, nutkin: 4, grenadier: 2, glider: 2, trebuchet: 2 }, 'elder', 'Hero: 2 of 2')
    // the points, at Field: 905 of 1,000, and an Oak Guard's 115 more
    {
      const rec = { elder: 1, oakguard: 2, nutkin: 4, grenadier: 2, glider: 2, trebuchet: 2 }
      const over = cost('squirrel', 'field', counts('squirrel', { ...rec, oakguard: 3 })) - MISSIONS.field.list.points
      await at('field', 'squirrel', rec, 'oakguard', `${over} over the limit`)
    }
    // none of a role: a War-Cart in a Skirmish
    await at('classic', 'squirrel', { elder: 1, nutkin: 1 }, 'warcart', 'No vehicles in a Skirmish')
    // the most of one unit, at Skirmish
    await at('classic', 'squirrel', { elder: 1, grenadier: 3 }, 'grenadier', 'At most 3 of one unit')
    // the models, at Skirmish: 34, and a Glider Wing's 4 more
    await at('classic', 'squirrel', { elder: 1, nutkin: 3, grenadier: 3 }, 'glider', '36 models at most')
    // the units, at Grand (the one list rules and race whose points and
    // models let a list reach its units: 24)
    await at('grand', 'squirrel', { elder: 3, nutkin: 5, grenadier: 7, glider: 4, trebuchet: 3, warcart: 2 }, 'oakguard', '24 units at most')
    return out
  },

  async ready(browser, url) {
    const out = { rows: [], why: [] }
    const { page, ctx, errors } = await panel(browser, url, { q: '&mission=field' })
    try {
      await build(page, 0)
      const r = RACES.squirrel, rules = MISSIONS.field.list
      for (const rec of [{}, { nutkin: 2 }, { elder: 1, nutkin: 1 }, { elder: 1, nutkin: 2, oakguard: 3 }]) {
        const c = counts('squirrel', rec)
        await setTo(page, c)
        const want = checkList(r, rules, c), got = await readyOf(page)
        const ok = want ? got.disabled && got.text === cap(want) : !got.disabled && /^Ready/.test(got.text)
        if (!ok) out.why.push(`${listText(c) || 'no unit'}: Ready ${got.disabled ? 'disabled' : 'enabled'}, "${got.text}" (want ${want ? `disabled, "${cap(want)}"` : 'enabled'})`)
        else out.rows.push(`${listText(c) || 'none'}: "${got.text}"`)
      }
      if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
    } finally {
      await ctx.close()
    }
    return out
  },

  async random(browser, url) {
    const out = { rows: [], why: [] }
    for (const [mission, race] of [['field', 'squirrel'], ['grand', 'serpent']]) {
      const { page, ctx, errors } = await panel(browser, url, { q: `&mission=${mission}${race === 'serpent' ? '&races=serpent,squirrel' : ''}` })
      try {
        await build(page, 0)
        const seen = new Set(), pts = []
        for (let k = 0; k < 25; k++) {
          await page.click('#musterRandom')
          const c = (await rows(page)).map(([, n]) => n), why = checkList(RACES[race], MISSIONS[mission].list, c), got = await readyOf(page)
          seen.add(listText(c))
          pts.push(cost(race, mission, c))
          if (why || got.disabled) out.why.push(`${mission}: Random made ${listText(c)} (${why ?? 'legal'}), Ready ${got.disabled ? `disabled "${got.text}"` : 'enabled'}`)
        }
        out.rows.push(`${mission} ${race}: 25 legal, ${seen.size} different, ${Math.min(...pts)}-${Math.max(...pts)} pts`)
        if (seen.size < 5) out.why.push(`${mission}: Random made only ${seen.size} lists in 25 presses`)
        if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
      } finally {
        await ctx.close()
      }
    }
    return out
  },

  async saved(browser, url) {
    const out = { rows: [], why: [] }
    const { page, ctx, errors } = await panel(browser, url, { q: '&mission=field' })
    try {
      await build(page, 0)
      const want = counts('squirrel', { elder: 1, oakguard: 1, nutkin: 3, grenadier: 5, glider: 1, warcart: 1 })
      await setTo(page, want)
      await page.click('#musterSave')
      await page.fill('#musterSaveName', 'Acorn line')
      await page.click('#musterSaveKeep')
      await page.click('#musterClear')
      const open = async (p, name) => {
        await p.click('#musterSavedBtn')
        await p.waitForSelector('#musterSaved:not(.hidden) .mList')
        const id = await p.evaluate((name) => [...document.querySelectorAll('#musterSaved .mList')].find((l) => l.querySelector('.mlName').textContent === name)?.dataset.list ?? null, name)
        if (!id) return null
        await p.click(`#musterSaved .mList[data-list="${id}"] .mlOpen`)
        return (await rows(p)).map(([, n]) => n)
      }
      const back = await open(page, 'Acorn line')
      if (!back || listText(back) !== listText(want)) out.why.push(`saved ${listText(want)}, opened ${back ? listText(back) : 'nothing'}`)
      else out.rows.push(`"Acorn line" ${listText(want)} round-trips`)
      const doc = await page.evaluate(() => JSON.parse(localStorage.getItem('ts.lists')))
      const l = doc?.lists?.[0]
      const units = Object.fromEntries(RACES.squirrel.roster.flatMap((k, i) => (want[i] ? [[k, want[i]]] : [])))
      if (doc?.v !== 1 || !l || l.name !== 'Acorn line' || l.race !== 'squirrel' || l.mission !== 'field' || JSON.stringify(l.units) !== JSON.stringify(units) || typeof l.id !== 'string' || typeof l.at !== 'number') out.why.push(`the store holds ${JSON.stringify(doc)}`)
      else out.rows.push('stored by unit key, v 1')
      // a list naming a unit the roster lacks, and one over today's limit,
      // as an older device might have kept them; on a fresh page
      await page.evaluate(() => {
        const doc = JSON.parse(localStorage.getItem('ts.lists'))
        doc.lists.push({ id: 'old1', name: 'Old ballista', race: 'squirrel', mission: 'field', units: { elder: 1, nutkin: 2, ballista: 2 }, at: 1 })
        doc.lists.push({ id: 'old2', name: 'Old prices', race: 'squirrel', mission: 'field', units: { elder: 2, oakguard: 3, nutkin: 5, glider: 3 }, at: 2 })
        localStorage.setItem('ts.lists', JSON.stringify(doc))
      })
      const again = await panel(browser, url, { q: '&mission=field', ctx })
      await build(again.page, 0)
      const fresh = await open(again.page, 'Acorn line')
      if (!fresh || listText(fresh) !== listText(want)) out.why.push(`on a fresh page "Acorn line" opened ${fresh ? listText(fresh) : 'nothing'}`)
      else out.rows.push('and on a fresh page')
      const lost = await open(again.page, 'Old ballista')
      const note = await again.page.textContent('#musterNote')
      if (!lost || listText(lost) !== listText(counts('squirrel', { elder: 1, nutkin: 2 })) || !/"ballista" is no longer in the Bushtails' roster/.test(note)) out.why.push(`a list with a lost unit opened ${lost ? listText(lost) : 'nothing'}, its note "${note}"`)
      else out.rows.push(`a lost unit dropped: "${note}"`)
      const oc = counts('squirrel', { elder: 2, oakguard: 3, nutkin: 5, glider: 3 }), over = cost('squirrel', 'field', oc) - 1000
      await again.page.click('#musterSavedBtn')
      const said = await again.page.evaluate(() => document.querySelector('#musterSaved .mList[data-list="old2"] .mlWhy')?.textContent ?? '')
      await again.page.click('#musterSavedBtn')
      const opened = await open(again.page, 'Old prices')
      const red = await again.page.evaluate(() => ({ bar: document.querySelector('#musterBar').classList.contains('over'), pts: document.querySelector('#musterPts').textContent }))
      if (over <= 0 || said !== `Prices changed: ${over} over` || !opened || listText(opened) !== listText(oc) || !red.bar) out.why.push(`a list ${over} over: Saved says "${said}", opens ${opened ? listText(opened) : 'nothing'}, the bar ${red.bar ? 'red' : 'not red'} (${red.pts})`)
      else out.rows.push(`"Prices changed: ${over} over", opened red`)
      await again.page.close()
      if (errors.length || again.errors.length) out.why.push(`page errors: ${[...errors, ...again.errors].join(' | ')}`)
    } finally {
      await ctx.close()
    }
    return out
  },

  async over(browser, url) {
    const out = { rows: [], why: [] }
    const { page, ctx, errors } = await panel(browser, url, { q: '&mission=field' })
    try {
      await build(page, 0)
      const c = counts('squirrel', { elder: 2, oakguard: 2, nutkin: 4, grenadier: 2, glider: 2, trebuchet: 1 })
      await setTo(page, c)
      await page.click('#musterReady')
      await page.waitForSelector('#muster.hidden', { state: 'attached' })
      await size(page, 'classic')
      const why = checkList(RACES.squirrel, MISSIONS.classic.list, c)
      const line = await lineOf(page, 0), start = await startOf(page)
      if (!why || !line.bad || line.value !== 'list' || line.why !== cap(why) || !start.disabled || !start.why.includes(why)) out.why.push(`a Field list in a Skirmish: the line ${line.bad ? 'red' : 'not red'} (${line.value}, "${line.why}"), Start ${start.disabled ? 'disabled' : 'enabled'} ("${start.why}"); checkList says "${why}"`)
      else out.rows.push(`the line red, "${line.why}", Start disabled`)
      await build(page, 0)
      const red = await page.evaluate(() => ({ bar: document.querySelector('#musterBar').classList.contains('over'), pts: document.querySelector('#musterPts').textContent }))
      const ready = await readyOf(page)
      if (!red.bar || !ready.disabled || ready.text !== cap(why)) out.why.push(`the Muster screen on it: the bar ${red.bar ? 'red' : 'not red'} (${red.pts}), Ready "${ready.text}"`)
      else out.rows.push(`the Muster screen red: ${red.pts}`)
      await page.click('#musterClose')
      await size(page, 'field')
      const ok = await lineOf(page, 0), st = await startOf(page)
      if (ok.bad || st.disabled) out.why.push(`back at Field: the line ${ok.bad ? 'still red' : 'fine'}, Start ${st.disabled ? 'disabled' : 'enabled'}`)
      if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
    } finally {
      await ctx.close()
    }
    return out
  },

  async race(browser, url) {
    const out = { rows: [], why: [] }
    const { page, ctx, errors } = await panel(browser, url, { mode: 'bushtail', q: '&mission=field' })
    try {
      const pick = (s, race) => page.click(`.setupSeat[data-seat="${s}"] .raceRow button[data-race="${race}"]`)
      await build(page, 0)
      const c = counts('squirrel', { elder: 1, oakguard: 1, nutkin: 3, grenadier: 4, glider: 2, trebuchet: 1 })
      await setTo(page, c)
      await page.click('#musterReady')
      await page.waitForSelector('#muster.hidden', { state: 'attached' })
      const built = await lineOf(page, 0)
      await pick(0, 'serpent')
      const reset = await lineOf(page, 0)
      const preset = MISSIONS.field.army
      const pc = RACES.serpent.roster.map((k, i) => Number(RACES.serpent.armies[preset][i] ?? 0))
      if (reset.value !== preset || reset.options.includes('list') || !reset.total.startsWith(`${cost('serpent', 'field', pc).toLocaleString('en')} pts`)) out.why.push(`the race changed to the Coil: the line ${reset.value} (${reset.options.join(', ')}), "${reset.total}" (want the preset ${preset}, no list)`)
      else out.rows.push(`to the Coil: the preset, "${reset.total}"`)
      await pick(0, 'squirrel')
      const back = await lineOf(page, 0)
      const want = `${cost('squirrel', 'field', c).toLocaleString('en')} pts · ${c.reduce((x, y) => x + y, 0)} units`
      if (back.value !== 'list' || back.total !== want || built.total !== want) out.why.push(`back to the Bushtails: the line ${back.value}, "${back.total}" (want its last list, "${want}")`)
      else out.rows.push(`back to the Bushtails: their last list, "${back.total}"`)
      // the AI's seat: Random on, then another race: rerolled, still Random
      await page.click('.setupSeat[data-seat="1"] .armyRandom')
      const r1 = await lineOf(page, 1)
      await pick(1, 'squirrel')
      const r2 = await lineOf(page, 1)
      if (!r1.random || r1.value !== 'list' || !r2.random || r2.value !== 'list' || r2.bad) out.why.push(`the AI's Random: ${JSON.stringify(r1)} then, its race changed, ${JSON.stringify(r2)}`)
      else out.rows.push(`the AI's Random rerolled: "${r1.total}" then "${r2.total}"`)
      // and the battle fields what the lines say
      const b = await started(page)
      const want0 = keysOf(RACES.squirrel, c)
      if (b.setup.seats[0].army !== listText(c) || JSON.stringify(b.units[0]) !== JSON.stringify(want0) || b.setup.seats[1].race !== 'squirrel' || !/^\d+$/.test(b.setup.seats[1].army)) out.why.push(`the battle: ${JSON.stringify(b.setup.seats)} (want seat 0 ${listText(c)}, seat 1 a Random list)`)
      else out.rows.push(`fielded: ${b.setup.seats.map((x) => x.army).join(' v ')}`)
      if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
    } finally {
      await ctx.close()
    }
    return out
  },

  async phone(browser, url) {
    const out = { rows: [], why: [] }
    const { page, ctx, errors } = await panel(browser, url, { q: '&mission=field', vp: { width: 360, height: 780, touch: true } })
    try {
      // every box of the page inside the screen's width, the role chips'
      // own scroller's insides left out (they scroll in one row)
      const wide = () => page.evaluate(() => {
        const W = document.documentElement.clientWidth, bad = []
        for (const e of document.querySelectorAll('#setup *, #muster *')) {
          if (e.closest('.mChips') && !e.classList.contains('mChips')) continue
          const r = e.getBoundingClientRect()
          if (r.width && r.height && getComputedStyle(e).visibility !== 'hidden' && (r.left < -0.5 || r.right > W + 0.5)) bad.push(`${e.tagName.toLowerCase()}.${[...e.classList].join('.') || e.id} ${Math.round(r.left)}-${Math.round(r.right)}`)
        }
        return { W, sw: document.scrollingElement.scrollWidth, bad: bad.slice(0, 6), n: bad.length }
      })
      const p = await wide()
      if (p.sw > p.W || p.n) out.why.push(`the panel at 360 px: ${p.sw} px wide, ${p.n} boxes outside (${p.bad.join(', ')})`)
      else out.rows.push('the panel: no sideways scroll')
      await page.locator('.setupSeat[data-seat="0"] .armyBuild').tap()
      await page.waitForSelector('#muster:not(.hidden) #musterRows .mRow')
      const m = await wide()
      if (m.sw > m.W || m.n) out.why.push(`the Muster screen at 360 px: ${m.sw} px wide, ${m.n} boxes outside (${m.bad.join(', ')})`)
      else out.rows.push('the Muster screen: no sideways scroll')
      const boxes = () => page.evaluate(() => Object.fromEntries(['#musterBar', '#musterReady', '#musterPts'].map((s) => {
        const r = document.querySelector(s).getBoundingClientRect()
        return [s, { top: r.top, bottom: r.bottom, h: r.height, w: r.width }]
      })))
      // (a shorter phone, 640 px, where the rows overflow their box)
      await page.setViewportSize({ width: 360, height: 640 })
      await page.waitForFunction(() => innerHeight === 640)
      const before = await boxes()
      const scroll = await page.evaluate(() => {
        const e = document.querySelector('#musterRows')
        e.scrollTop = e.scrollHeight
        return { top: e.scrollTop, can: e.scrollHeight > e.clientHeight }
      })
      const after = await boxes(), H = await page.evaluate(() => innerHeight)
      if (!scroll.can) out.why.push('the rows never scroll at 360×640 (nothing to hold still)')
      else if (Math.abs(after['#musterBar'].top - before['#musterBar'].top) > 0.5 || after['#musterBar'].top < 0 || after['#musterReady'].bottom > H + 0.5 || Math.abs(after['#musterReady'].top - before['#musterReady'].top) > 0.5) out.why.push(`the rows scrolled ${scroll.top} px: the bar ${Math.round(before['#musterBar'].top)} → ${Math.round(after['#musterBar'].top)}, Ready ${Math.round(before['#musterReady'].top)} → ${Math.round(after['#musterReady'].top)} (screen ${H})`)
      else out.rows.push(`at 360×640 the rows scrolled ${scroll.top} px: the bar at ${Math.round(after['#musterBar'].top)}, Ready at ${Math.round(after['#musterReady'].top)}-${Math.round(after['#musterReady'].bottom)}`)
      // (every button of the screen shown: the steppers, the names, the
      // tools, Save list…, Ready and ✕)
      const small = await page.evaluate(() => {
        const shown = [...document.querySelectorAll('#muster button')].filter((b) => b.getClientRects().length && getComputedStyle(b).visibility !== 'hidden')
        const bad = shown.filter((b) => {
          const r = b.getBoundingClientRect()
          return r.width < 43.5 || r.height < 43.5
        }).map((b) => `${b.id || b.className} ${Math.round(b.getBoundingClientRect().width)}×${Math.round(b.getBoundingClientRect().height)}`)
        return { n: shown.length, names: shown.filter((b) => b.classList.contains('mName')).length, bad }
      })
      if (small.bad.length || !small.names) out.why.push(`${small.bad.length} of the Muster screen's ${small.n} buttons under 44 px (${small.bad.slice(0, 4).join(', ')})${small.names ? '' : ', no unit name among them'}`)
      else out.rows.push(`its ${small.n} buttons 44 px, the ${small.names} names among them`)
      // a tap on a disabled +: its why pinned
      await page.locator('.mRow[data-unit="elder"] .plus').tap({ force: true })
      const tip = await page.evaluate(() => ({ shown: document.querySelector('#tooltip').style.display === 'block', text: document.querySelector('#tooltip').textContent }))
      if (!tip.shown || tip.text !== 'Hero: 2 of 2') out.why.push(`a tap on the Elder's +: the tooltip ${tip.shown ? `"${tip.text}"` : 'not shown'}`)
      else out.rows.push('a tap pins "Hero: 2 of 2"')
      if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
    } finally {
      await ctx.close()
    }
    return out
  },

  async pass(browser, url) {
    const out = { rows: [], why: [] }
    const { page, ctx, errors } = await panel(browser, url, { mode: 'hotseat', q: '&mission=classic' })
    try {
      const c0 = counts('squirrel', { elder: 1, oakguard: 1, grenadier: 2, glider: 2 })
      const c1 = counts('serpent', { hierophant: 1, scaleguard: 2, spitter: 1, sidewinder: 2 })
      // (the table's labels, the title's backdrop's: they must not change)
      const labels = await page.evaluate(() => document.querySelector('#labels').textContent)
      await build(page, 0)
      await setTo(page, c0)
      await page.click('#musterReady')
      await page.waitForSelector('#pass:not(.hidden)')
      // nothing of player 1's list in the page: no row, no unit of it named
      // (the rules' help names every hero, so it is left out, and the
      // table's labels, the title's backdrop's preset armies, so they are
      // held to what they were as the panel opened), the pass screen its
      // total and Ready alone
      const names = RACES.squirrel.roster.flatMap((k, i) => (c0[i] ? [RACES.squirrel.units[k].name, RACES.squirrel.units[k].short] : []))
      const leak = await page.evaluate(leakOf, names)
      if (leak.labels !== labels) leak.found.push('the table\'s labels changed')
      const total = `${cost('squirrel', 'classic', c0)} pts · ${c0.reduce((x, y) => x + y, 0)} units`
      if (leak.found.length || leak.rows || !leak.pass.includes(`Ready · ${total}`)) out.why.push(`the pass screen: ${leak.rows} rows left, ${leak.found.length} names of the list in the page (${leak.found.slice(0, 4).join(', ')}), it says "${leak.pass.slice(0, 120)}"`)
      else out.rows.push(`the pass screen holds "Player 1: Ready · ${total}" and nothing of the list (${leak.muster} characters left in the Muster screen)`)
      await page.click('#passGo')
      await page.waitForSelector('#muster:not(.hidden) #musterRows .mRow')
      const title = await page.textContent('#muster .mTitle')
      const shown = (await rows(page)).map(([k]) => k)
      if (!title.startsWith(RACES.serpent.name) || JSON.stringify(shown) !== JSON.stringify(RACES.serpent.roster)) out.why.push(`player 2's Muster screen is "${title}" (${shown.join(' ')})`)
      await setTo(page, c1)
      await page.click('#musterReady')
      await page.waitForSelector('#muster.hidden', { state: 'attached' })
      const l0 = await lineOf(page, 0), l1 = await lineOf(page, 1)
      if (!l0.total.startsWith('Ready · ') || !l1.total.startsWith('Ready · ')) out.why.push(`the panel after both: "${l0.total}", "${l1.total}"`)
      // back on the panel: nothing of either list in the page
      const names1 = RACES.serpent.roster.flatMap((k, i) => (c1[i] ? [RACES.serpent.units[k].name, RACES.serpent.units[k].short] : []))
      const after = await page.evaluate(leakOf, [...names, ...names1])
      if (after.found.length || after.rows) out.why.push(`the panel after both Readies: ${after.rows} rows, ${after.found.length} names of the lists in the page (${after.found.slice(0, 4).join(', ')})`)
      else out.rows.push('the panel after both: nothing of either list')
      // ((F11b's review, second pass) the size changed after both Readies,
      // to one that refuses player 1's list: the panel says so without the
      // refusal's words (they are the list: a unit and its count, or how
      // many of a role), Start disabled; back at the Skirmish both stand)
      const refused = checkList(RACES.squirrel, MISSIONS.grand.list, c0)
      await size(page, 'grand')
      const sealed = await lineOf(page, 0), st = await startOf(page)
      const grand = await page.evaluate(leakOf, [...names, ...names1, ...(refused ? [refused] : [])])
      const said = "It doesn't fit a Grand battle: hand the screen to player 1 to change it"
      if (!refused || grand.found.length || grand.rows || !sealed.bad || sealed.why !== said || !st.disabled || st.why !== `Player 1's army ${said.slice(3)}.`) out.why.push(`a Grand size after both Readies: ${grand.found.length} words of the lists in the page (${grand.found.slice(0, 4).join(', ')}), player 1's line ${sealed.bad ? 'red' : 'not red'} ("${sealed.why}"), Start ${st.disabled ? 'disabled' : 'enabled'} ("${st.why}"); checkList says "${refused}"`)
      else out.rows.push(`a Grand size after both: "${st.why}", nothing of the lists`)
      await size(page, 'classic')
      const st2 = await startOf(page), b0 = await lineOf(page, 0)
      if (st2.disabled || b0.bad || !b0.total.startsWith('Ready · ')) out.why.push(`back at the Skirmish: player 1's line "${b0.total}" ${b0.bad ? 'red' : ''}, Start ${st2.disabled ? `disabled ("${st2.why}")` : 'enabled'}`)
      // a built seat's Build…: the pass screen, the screen handed back to
      // its player, and not its list
      await page.click('.setupSeat[data-seat="0"] .armyBuild')
      // (a short wait, so a Muster screen opened instead says so)
      if (!(await page.waitForSelector('#pass:not(.hidden)', { timeout: 3000 }).then(() => true, () => false))) {
        const up = await page.evaluate(() => ({ rows: document.querySelectorAll('#muster .mRow').length, muster: !document.querySelector('#muster').classList.contains('hidden') }))
        out.why.push(`player 1's built seat's Build… from the panel: no pass screen, ${up.muster ? `the Muster screen up on its list (${up.rows} rows)` : 'nothing shown'}`)
        return out
      }
      const back = await page.evaluate(() => ({ pass: document.querySelector('#pass').textContent, rows: document.querySelectorAll('#muster .mRow').length, muster: !document.querySelector('#muster').classList.contains('hidden') }))
      if (back.rows || back.muster || !back.pass.includes('hand the screen to player 1')) out.why.push(`player 1's built seat's Build… from the panel: ${back.muster ? 'the Muster screen up' : 'the screen hidden'}, ${back.rows} rows, the pass screen "${back.pass.slice(0, 120)}"`)
      else out.rows.push('a built seat\'s Build… asks for the screen handed back first')
      await page.click('#passGo')
      await page.waitForSelector('#muster:not(.hidden) #musterRows .mRow')
      const own = (await rows(page)).map(([, n]) => n)
      if (listText(own) !== listText(c0)) out.why.push(`handed back, player 1's Muster screen opens on ${listText(own)} (want ${listText(c0)})`)
      await page.click('#musterClose')
      await page.waitForSelector('#muster.hidden', { state: 'attached' })
      // a mirror: player 2 on player 1's race opens on the preset, never on
      // the device's last list for it (player 1's)
      const pick = (s, race) => page.click(`.setupSeat[data-seat="${s}"] .raceRow button[data-race="${race}"]`)
      await pick(1, 'squirrel')
      const mirror = await lineOf(page, 1)
      if (mirror.value === 'list' || mirror.options.includes('list') || mirror.total.startsWith(`Ready · `)) out.why.push(`player 2 on the Bushtails: the line ${mirror.value} (${mirror.options.join(', ')}), "${mirror.total}" (want the preset, not player 1's list)`)
      else {
        await build(page, 1)
        const m = (await rows(page)).map(([, n]) => n)
        const pc = counts('squirrel', Object.fromEntries(RACES.squirrel.roster.map((k, i) => [k, Number(RACES.squirrel.armies[MISSIONS.classic.army][i] ?? 0)])))
        if (listText(m) !== listText(pc)) out.why.push(`player 2's Muster screen on the Bushtails opens on ${listText(m)} (want the preset ${listText(pc)}, not player 1's ${listText(c0)})`)
        else out.rows.push('a mirror opens on the preset, not player 1\'s list')
        await page.click('#musterClose')
        await page.waitForSelector('#muster.hidden', { state: 'attached' })
      }
      // player 2 back on the Serpents, built again
      await pick(1, 'serpent')
      await build(page, 1)
      await setTo(page, c1)
      await page.click('#musterReady')
      await page.waitForSelector('#muster.hidden', { state: 'attached' })
      const b = await started(page)
      const ok = [[c0, 'squirrel'], [c1, 'serpent']].every(([c, race], s) => b.setup.seats[s].army === listText(c) && JSON.stringify(b.units[s]) === JSON.stringify(keysOf(RACES[race], c)))
      if (!ok) out.why.push(`the deployment: ${JSON.stringify(b.setup.seats.map((x) => x.army))}, ${JSON.stringify(b.units)}`)
      else out.rows.push(`both armies at the deployment, unit for unit (${listText(c0)} v ${listText(c1)})`)
      if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
    } finally {
      await ctx.close()
    }
    return out
  },

  async field(browser, url) {
    const out = { rows: [], why: [] }
    const { page, ctx, errors } = await panel(browser, url, { mode: 'serpent', q: '&mission=field' })
    try {
      // (against the AI from the east seat: the human's is seat 1)
      const c = counts('serpent', { hierophant: 2, brute: 1, scaleguard: 3, spitter: 4, sidewinder: 2, engine: 1 })
      if (checkList(RACES.serpent, MISSIONS.field.list, c)) throw new Error(`the case's list is illegal: ${checkList(RACES.serpent, MISSIONS.field.list, c)}`)
      await build(page, 1)
      await setTo(page, c)
      await page.click('#musterReady')
      await page.waitForSelector('#muster.hidden', { state: 'attached' })
      await page.click('.setupSeat[data-seat="0"] .armyRandom')
      const ai = await lineOf(page, 0)
      const units = await page.evaluate(() => document.querySelector('.setupSeat[data-seat="0"] .armyUnits span')?.textContent ?? '')
      if (!ai.random || !units) out.why.push(`the AI's line: ${JSON.stringify(ai)}, its units "${units}"`)
      else out.rows.push(`the AI's Random: "${ai.total}", its units a tap away`)
      const b = await started(page)
      const ai0 = b.setup.seats[0].army
      const aic = RACES.squirrel.roster.map((k, i) => Number(ai0?.[i] ?? 0))
      const ok = b.setup.seats[1].army === listText(c) && JSON.stringify(b.units[1]) === JSON.stringify(keysOf(RACES.serpent, c)) && /^\d+$/.test(ai0) && JSON.stringify(b.units[0]) === JSON.stringify(keysOf(RACES.squirrel, ai0)) && !checkList(RACES.squirrel, MISSIONS.field.list, aic)
      if (!ok) out.why.push(`the battle: ${JSON.stringify(b.setup.seats.map((x) => x.army))}, units ${JSON.stringify(b.units)}`)
      else out.rows.push(`fielded unit for unit: ${ai0} v ${listText(c)} (${b.units[0].length} and ${b.units[1].length} units)`)
      const want = `Bushtails ${cost('squirrel', 'field', aic).toLocaleString('en')} pts · ${b.units[0].length} units vs Serpents ${cost('serpent', 'field', c).toLocaleString('en')} pts · ${b.units[1].length} units`
      if (b.banner !== want) out.why.push(`the deployment's banner: "${b.banner}" (want "${want}")`)
      else out.rows.push(`the banner: "${b.banner}"`)
      if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
    } finally {
      await ctx.close()
    }
    return out
  },

  async door(browser, url) {
    const out = { rows: [], why: [] }
    const { page, ctx, errors } = await panel(browser, url, { mode: 'hotseat', q: '&armies=classic,110211' })
    try {
      const b = await started(page)
      const seats = b.setup.seats.map((x) => x.army)
      // (and as the start entry writes it: G.setup is fullSetup's, a seat
      // naming none filled in with its mission's preset)
      const written = await page.evaluate(() => window.__ts.session.store.entries().find((e) => e?.t === 'start')?.setup?.seats?.map((x) => x.army ?? null))
      if (JSON.stringify(seats) !== JSON.stringify(['classic', '110211']) || JSON.stringify(written) !== JSON.stringify(['classic', '110211']) || JSON.stringify(b.units[1]) !== JSON.stringify(keysOf(RACES.serpent, '110211'))) out.why.push(`?armies=classic,110211, Start as the panel opens: the setup names ${JSON.stringify(seats)}, the start entry ${JSON.stringify(written)}`)
      else out.rows.push('?armies= as given, in the setup and the start entry: classic, 110211')
      if (errors.length) out.why.push(`page errors: ${errors.join(' | ')}`)
    } finally {
      await ctx.close()
    }
    // and no army named where no URL names one: the setup as before lists
    const p2 = await panel(browser, url, { mode: 'watch' })
    try {
      const b = await started(p2.page)
      if (b.setup.seats.some((x) => x.army !== 'classic')) out.why.push(`no ?armies=: the filled setup names ${JSON.stringify(b.setup.seats.map((x) => x.army))}`)
      const written = await p2.page.evaluate(() => window.__ts.session.store.entries().find((e) => e?.t === 'start')?.setup?.seats?.map((x) => x.army ?? null))
      if (JSON.stringify(written) !== JSON.stringify([null, null])) out.why.push(`no ?armies=: the start entry's seats name ${JSON.stringify(written)}`)
      else out.rows.push('none named without it (the start entry names no army)')
    } finally {
      await p2.ctx.close()
    }
    return out
  },
}

// ── The self-test's edits: [file, text, replacement, the cases that must
// fail on it] ─────────────────────────────────────────────────────────────
const MUTATIONS = {
  // a disabled + says nothing of why
  'plus-mute': ['ui/screens/muster.js', '        plus.dataset.say = capital(why)\n', '', ['plus']],
  // + never disabled (its click still does nothing past a cap)
  'plus-on': ['ui/screens/muster.js', "      plus.setAttribute('aria-disabled', String(!!why))", "      plus.setAttribute('aria-disabled', 'false')", ['plus']],
  // Ready's label never says why
  'ready-mute': ['ui/screens/muster.js', "    this.readyBtn.textContent = refusal ? capital(refusal) : 'Ready ✓'", "    this.readyBtn.textContent = 'Ready ✓'", ['ready']],
  // Random past the points limit
  'random-over': ['ui/screens/muster.js', '    rnd.onclick = () => this.set(autoList(r, rules,', '    rnd.onclick = () => this.set(autoList(r, { ...rules, points: rules.points + 300 },', ['random']],
  // a saved list stored a unit short
  'saved-short': ['app/lists.js', '    if ((counts[i] ?? 0) > 0) out[k] = counts[i]', '    if ((counts[i] ?? 0) > 0) out[k] = counts[i] - 1 || 1', ['saved']],
  // the bar never red
  'over-unred': ['ui/screens/muster.js', "    this.bar.classList.toggle('over', over)", "    this.bar.classList.toggle('over', false)", ['over', 'saved']],
  // Start never disabled by an army
  'start-open': ['app/boot.js', '    const bad = armies.findIndex((x) => x.why)', '    const bad = -1', ['over']],
  // a race change keeps the seat's list
  'race-keeps': ['app/boot.js', '      picking.armies[s] = picking.armies[s].random ? { counts: randomOf(s, race, picking.mission), random: true } : armyDefault(s, race, picking.mission, picking.mode)', '      picking.armies[s] = picking.armies[s].random ? { counts: randomOf(s, race, picking.mission), random: true } : picking.armies[s].counts ? picking.armies[s] : armyDefault(s, race, picking.mission, picking.mode)', ['race']],
  // the rows' name column fixed at 260 px: on a phone the steppers run
  // past the screen's edge
  'phone-wide': ['style.css', '  grid-template-columns: minmax(0, 1fr) 3em auto;', '  grid-template-columns: 260px 3em auto;', ['phone']],
  // the Muster screen's rows kept in the page when it closes
  'pass-leaks': ['ui/screens/muster.js', "    for (const e of this.root.querySelectorAll('.mFill')) e.replaceChildren()", '    // (kept)', ['pass']],
  // the panel's armies never reach the battle
  'unfielded': ['app/flow.js', '    const fielded = armies === undefined ? this.armies : armies.some((a) => a != null) ? [...armies] : null', '    const fielded = this.armies', ['field', 'pass', 'race']],
  // (F11b's review: each assertion a case makes broken by an edit)
  // a line on its ?armies= value respelled: the size's own preset handed
  // on as none
  'door-respelled': ['app/boot.js', '  const valueOf = (mission, a) => a.url ?? (a.counts ?', '  const valueOf = (mission, a) => (a.counts ?', ['door']],
  // the deployment's banner with the seats' totals swapped
  'banner-swapped': ['app/flow.js', '    return [0, 1].map((s) => {\n      const { counts } = army.armyOf(setup, s)', '    return [1, 0].map((s) => {\n      const { counts } = army.armyOf(setup, s)', ['field']],
  // a seat played here never defaults to its race's last list
  'last-forgotten': ['app/boot.js', "    const last = played(mode, s) && mode !== 'hotseat' ? lists.last(race, mission) : null", '    const last = null', ['race']],
  // the rows' box as tall as its rows: the screen no longer holds the bar
  // and Ready while they scroll
  'rows-unheld': ['style.css', '.muster .mRows {\n  flex: 1 1 auto;', '.muster .mRows {\n  flex: none;', ['phone']],
  // the steppers 36 px on a phone
  'small-steps': ['style.css', '  .muster .mStep button {\n    width: 44px;\n    height: 44px;', '  .muster .mStep button {\n    width: 36px;\n    height: 36px;', ['phone']],
  // the units' names their text's height on a phone
  'small-names': ['style.css', '  .muster .mName {\n    min-height: 44px;', '  .muster .mName {\n    min-height: 0;', ['phone']],
  // the tooltip under the Muster screen
  'tip-under': ['style.css', 'body:has(#muster:not(.hidden)) #tooltip {\n  z-index: 40;', 'body:has(#muster:not(.hidden)) #tooltip {\n  z-index: 20;', ['plus']],
  // Saved says nothing of a price change
  'prices-unsaid': ['ui/screens/muster.js', "over > 0 ? (l.mission === at.mission ? `Prices changed: ${over} over` :", 'over > 0 ? (l.mission === at.mission ? `${over} over` :', ['saved']],
  // a lost unit dropped without its note
  'lost-unsaid': ['ui/screens/muster.js', '        this.set(counts, [...notes.map(capital),', '        this.set(counts, [', ['saved']],
  // hotseat seats default to the device's last list (the other player's)
  'hotseat-last': ['app/boot.js', "    const last = played(mode, s) && mode !== 'hotseat' ? lists.last(race, mission) : null", '    const last = played(mode, s) ? lists.last(race, mission) : null', ['pass']],
  // ((F11b's review, second pass) a sealed hotseat line's why in
  // checkList's words, the list's units or roles, after a size change)
  'sealed-why': ['app/boot.js', '    const why = sealed && refused ? `it ${unfit(s, mission)}` : refused', '    const why = refused', ['pass']],
  // the panel's army line never red
  'line-unred': ['ui/screens/setup.js', "    line.classList.toggle('bad', !!a.why)", "    line.classList.toggle('bad', false)", ['over']],
  // the panel's army line's preset ▾ 400 px at the least: past a phone's
  // edge
  'panel-wide': ['style.css', '  border-radius: 6px;\n  padding: 6px 7px;\n  min-width: 0;\n}\n.armyLine .armyTotal {', '  border-radius: 6px;\n  padding: 6px 7px;\n  min-width: 400px;\n}\n.armyLine .armyTotal {', ['phone']],
  // a line no ?armies= names handed on as its preset's name
  'door-named': ['app/boot.js', ': a.preset && a.preset !== MISSIONS[mission].army ? a.preset : null)', ': a.preset ?? MISSIONS[mission].army)', ['door']],
  // a built hotseat seat's Build… opens its list on the panel
  'hotseat-reopen': ['app/boot.js', "    if (mode === 'hotseat' && a.built && !handed) return pass.show(", "    if (false) return pass.show(", ['pass']],
  // a Random AI seat's race changed: its Random let go for the default,
  // never rerolled
  'reroll-dropped': ['app/boot.js', '      picking.armies[s] = picking.armies[s].random ? { counts: randomOf(s, race, picking.mission), random: true } : armyDefault(s, race,', '      picking.armies[s] = armyDefault(s, race,', ['race']],
  // a finger lifted on a marked element pins nothing (a hover's tip alone)
  'tap-unpinned': ['ui/tooltip.js', '      if (m) this.tip(m, { x: e.clientX, y: e.clientY }, true)\n', '', ['phone']],
}

async function runCases(browser, url, names) {
  const res = []
  for (const name of names) {
    let r
    try {
      r = await CHECKS[name](browser, url)
    } catch (e) {
      r = { rows: [], why: [`threw: ${e.message.split('\n')[0]}`] }
    }
    res.push([name, r])
  }
  return res
}

const work = mkdtempSync(join(tmpdir(), 'tails-and-scales-ui-'))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
let failed = 0
try {
  if (a['self-test']) {
    console.log(`ui-check self-test: ${Object.keys(MUTATIONS).length} edits, each on the cases it breaks, after the unedited code passes every case`)
    for (const [k, name] of ['unedited', ...Object.keys(MUTATIONS)].entries()) {
      const dir = copyCode(PKG, join(work, `${k}`))
      let on = CASES
      if (name !== 'unedited') {
        const [f, from, to, cases] = MUTATIONS[name]
        const src = readFileSync(join(dir, f), 'utf8')
        if (src.split(from).length !== 2) throw new Error(`ui-check self-test: ${name} finds no single "${from.trim().slice(0, 60)}" in ${f}`)
        writeFileSync(join(dir, f), src.replace(from, to))
        on = cases
      }
      const served = await startStaticServer(await buildApp(dir, join(work, `${k}-dist`)))
      let res
      try {
        res = await runCases(browser, served.url, on)
      } finally {
        served.close()
        rmSync(dir, { recursive: true, force: true })
      }
      const bad = res.filter(([, r]) => r.why.length)
      const ok = name === 'unedited' ? !bad.length : bad.length === on.length
      if (!ok) failed++
      const said = name === 'unedited' ? (bad.length ? bad.map(([c, r]) => `${c}: ${r.why.join('; ')}`).join(' | ') : `${res.length} cases hold`) : res.map(([c, r]) => `${c}: ${r.why.length ? r.why[0] : 'HELD'}`).join(' | ')
      console.log(`  ${ok ? (name === 'unedited' ? 'passes' : 'caught') : 'WRONG '} ${name.padEnd(11)} ${said.slice(0, 400)}`)
      if (name === 'unedited' && !ok) break
    }
    console.log(failed ? `\nui-check self-test FAILED: ${failed} wrong verdict(s)` : '\nui-check self-test passed: the unedited code passes, and every edit is caught by each case it breaks')
  } else {
    const dist = a.dist ?? (await buildApp(PKG, join(work, 'dist')))
    const { url, close } = await startStaticServer(dist)
    const on = a.only ? a.only.split(',') : CASES
    console.log(`ui-check: ${on.length} cases in Chromium ${browser.version()}: the Muster screen, the panel's army line, the saved lists, the hotseat's pass screen and the lists fielded`)
    try {
      for (const [name, r] of await runCases(browser, url, on)) {
        if (r.why.length) failed++
        console.log(`  ${r.why.length ? 'FAIL' : 'ok  '} ${name.padEnd(7)} ${r.why.length ? r.why.join(' | ') : r.rows.join('; ')}`)
      }
    } finally {
      close()
    }
    console.log(failed ? `\nui-check FAILED: ${failed} of ${on.length} cases` : `\nui-check passed: ${on.length} cases hold`)
  }
} finally {
  await browser.close()
  rmSync(work, { recursive: true, force: true })
}
process.exit(failed ? 1 : 0)
