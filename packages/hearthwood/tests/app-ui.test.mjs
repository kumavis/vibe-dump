// App module: HUD helpers (pure) + ui.js against a tiny fake DOM.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createUI } from '../src/ui.js'
import { fmtClock, fmtCount, esc, hintIndex, HINTS, eventMessage, offeringProgress, stockVisible, costText } from '../src/app-hud.js'
import { createGame, setupStart } from '../src/game.js'
import { createOverlay } from '../src/overlay.js'
import {
  BUILDING_COUNT, B_HEARTH, B_QUARRY, B_STOREHOUSE, B_SHRINE, B_WARDEN_HALL, B_SPRITE_DEN, B_WARD_TOWER, B_FORGE,
  U_WARDEN, U_COURIER, U_CRAWLER, F_BLIGHT, I_PLANK, I_INGOT, I_WOOD, I_RELIC, I_GLOWCAP, ITEM_SHIFT,
  EV_WAVE_WARNING, EV_TIER_UP, EV_BUILDING_LOST, EV_CANNOT_AFFORD, EV_COURIER_SPAWNED, TICK_RATE,
} from '../src/constants.js'
import { BUILD_MENU, BUILDINGS } from '../src/content.js'

// ------------------------------------------------------------------ fake DOM
class ClassList {
  constructor() { this.s = new Set() }
  add(c) { this.s.add(c) }
  remove(c) { this.s.delete(c) }
  contains(c) { return this.s.has(c) }
  toggle(c, on) { if (on === undefined) on = !this.s.has(c); if (on) this.s.add(c); else this.s.delete(c); return on }
}
class El {
  constructor(tag) {
    this.tagName = tag.toUpperCase(); this.children = []; this.parent = null; this.id = ''
    this.classList = new ClassList(); this.dataset = {}; this.style = {}; this.hidden = false
    this._html = ''; this._text = ''; this.l = new Map(); this.title = ''; this.tabIndex = 0
    this.offsetWidth = 200; this.offsetHeight = 60
  }
  set className(v) { this.classList = new ClassList(); for (const c of String(v).split(/\s+/)) if (c) this.classList.add(c) }
  get className() { return [...this.classList.s].join(' ') }
  set innerHTML(v) { this._html = String(v); this.children = [] }
  get innerHTML() { return this._html }
  set textContent(v) { this._text = String(v); this._html = ''; this.children = [] }
  get textContent() { return this._text || this._html.replace(/<[^>]*>/g, '') }
  appendChild(c) { if (c.parent) c.remove(); c.parent = this; this.children.push(c); return c }
  remove() { if (this.parent) { this.parent.children = this.parent.children.filter((x) => x !== this); this.parent = null } }
  get childElementCount() { return this.children.length }
  get firstElementChild() { return this.children[0] || null }
  get lastChild() { return this.children.at(-1) || null }
  addEventListener(t, f) { if (!this.l.has(t)) this.l.set(t, []); this.l.get(t).push(f) }
  fire(t, e = {}) { for (const f of this.l.get(t) || []) f({ target: this, preventDefault() {}, ...e }) }
  getBoundingClientRect() { return { left: 100, top: 700, width: 60, height: 60 } }
  getAttribute(k) { return this.dataset[k] ?? null }
  closest() { return null }
  blur() {}
  all() { const out = []; const walk = (e) => { out.push(e); e.children.forEach(walk) }; walk(this); return out }
}
function fakeDoc() {
  const body = new El('body')
  const hud = body.appendChild(Object.assign(new El('div'), { id: 'hud' }))
  for (const id of ['stock', 'couriers', 'tier', 'wave', 'speed', 'hints', 'toasts', 'selpanel', 'bottombar']) {
    hud.appendChild(Object.assign(new El('div'), { id }))
  }
  hud.children.find((e) => e.id === 'bottombar').appendChild(Object.assign(new El('div'), { id: 'buildmenu' }))
  return {
    body, documentElement: { clientWidth: 1280 },
    createElement: (t) => new El(t),
    getElementById: (id) => body.all().find((e) => e.id === id) || null,
  }
}

function setup() {
  const game = createGame({ w: 64, h: 64, seed: 3, waves: true, start: false,
    context: { generate: false, maxUnits: 4096, maxBuildings: 1024 } })
  setupStart(game.ctx)
  const overlay = createOverlay(4096)
  const placed = []
  const input = { beginPlace: (t) => placed.push(t), buildMenuOpen: true, camera: null, cancel() {}, holdSelected() {}, stopSelected() {} }
  const doc = fakeDoc()
  const ui = createUI(/** @type {any} */ (doc), game, /** @type {any} */ (input), overlay)
  const $ = (id) => doc.getElementById(id)
  const frames = (n) => { for (let i = 0; i < n; i++) ui.update() }
  return { game, ctx: game.ctx, overlay, input, doc, ui, $, frames, placed }
}

// ------------------------------------------------------------------ pure helpers
test('fmtClock / fmtCount / esc / costText', () => {
  assert.equal(fmtClock(0), '0:00')
  assert.equal(fmtClock(-50), '0:00')
  assert.equal(fmtClock(5 * 60 * TICK_RATE), '5:00')
  assert.equal(fmtClock(61 * TICK_RATE + 1), '1:02')
  assert.equal(fmtCount(999), '999')
  assert.equal(fmtCount(1234), '1.2k')
  assert.equal(fmtCount(68000), '68k')
  assert.equal(fmtCount(2_500_000), '2.5M')
  assert.equal(esc('<a&"b">'), '&lt;a&amp;&quot;b&quot;&gt;')
  assert.equal(costText([]), 'free')
  assert.match(costText(BUILDINGS[B_STOREHOUSE].cost), /20 Heartwood, 10 Mossstone/)
})

test('tutorial hints advance with buildings and tier', () => {
  const { ctx } = setup()
  assert.equal(hintIndex(ctx), 0)
  const B = ctx.buildings
  B.typeCount[B_QUARRY]++
  assert.equal(HINTS[hintIndex(ctx)].id, 'store')
  B.typeCount[B_STOREHOUSE]++; B.typeCount[B_SPRITE_DEN]++; B.typeCount[B_WARD_TOWER]++; B.typeCount[B_FORGE]++
  assert.equal(HINTS[hintIndex(ctx)].id, 'shrine')
  ctx.tier = 1
  assert.equal(HINTS[hintIndex(ctx)].id, 'grove')
  ctx.won = true; ctx.tier = 3
  assert.equal(hintIndex(ctx), -1)
})

test('eventMessage maps events to toasts', () => {
  const { ctx } = setup()
  assert.match(eventMessage(ctx, EV_WAVE_WARNING, 3, 30 * TICK_RATE).msg, /wave 3 in 30 s/)
  assert.equal(eventMessage(ctx, EV_TIER_UP, 1, 0).kind, 'good')
  const lost = eventMessage(ctx, EV_BUILDING_LOST, B_FORGE, 77)
  assert.match(lost.msg, /Ember Forge/)
  assert.equal(lost.tile, 77)
  assert.match(eventMessage(ctx, EV_CANNOT_AFFORD, U_WARDEN, 1).msg, /Warden/)
  assert.equal(eventMessage(ctx, EV_COURIER_SPAWNED, 1, 0), null)
})

test('offeringProgress reads the Shrine inventory; stockVisible follows tier', async () => {
  const { ctx } = setup()
  assert.deepEqual(offeringProgress(ctx).map((p) => [p.item, p.have, p.need]), [[I_PLANK, 0, 20], [I_INGOT, 0, 10]])
  const { placeBuilding } = await import('../src/buildings.js')
  const s = placeBuilding(ctx, B_SHRINE, 10, 10, { free: true })
  ctx.buildings.inv[(s << ITEM_SHIFT) | I_PLANK] = 7 // direct poke: display only
  assert.equal(offeringProgress(ctx)[0].have, 7)
  assert.equal(stockVisible(ctx, I_WOOD), true)
  assert.equal(stockVisible(ctx, I_GLOWCAP), false)
  ctx.tier = 2
  assert.equal(stockVisible(ctx, I_RELIC), true)
  ctx.tier = 3
  assert.deepEqual(offeringProgress(ctx), [])
})

// ------------------------------------------------------------------ ui.js on the fake DOM
test('HUD renders stock, couriers, wave, build menu and speed', () => {
  const { ctx, $, frames, placed, game, input } = setup()
  frames(13)
  const stock = $('stock')
  const woodSpan = stock.children[I_WOOD - 1]
  assert.equal(woodSpan.lastChild.textContent, String(ctx.stock[I_WOOD]))
  assert.match($('couriers').innerHTML, new RegExp(`<b>${ctx.units.typeCount[U_COURIER]}</b>`))
  // countdown text sits in the first child; the pause/resume button is the last
  assert.match($('wave').firstElementChild.innerHTML, /wave 1 in <b>4:00<\/b>/)
  assert.equal($('wave').lastChild.textContent, '❚❚')
  assert.match($('tier').innerHTML, /Clearing/)
  const menu = $('buildmenu')
  assert.equal(menu.children.length, BUILD_MENU.length)
  const groveBtn = menu.children[BUILD_MENU.indexOf(6)]
  assert.equal(groveBtn.classList.contains('locked'), true, 'tier-1 building is locked at tier 0')
  menu.children[0].fire('click')
  assert.deepEqual(placed, [BUILD_MENU[0]])
  // speed buttons
  const sp = $('speed').children
  assert.equal(sp.length, 4)
  sp[3].fire('click'); frames(1)
  assert.equal(game.speed, 4)
  assert.equal(sp[3].classList.contains('active'), true)
  sp[0].fire('click'); frames(1)
  assert.equal(game.paused, true)
  input.buildMenuOpen = false; frames(1)
  assert.equal($('bottombar').hidden, true)
  // stock updates on change
  ctx.stock[I_WOOD] = 4321; frames(6) // stock text refreshes at ~10 Hz
  assert.equal(woodSpan.lastChild.textContent, '4.3k')
})

test('selection panel renders every building type and unit selections without throwing', async () => {
  const env = setup()
  const { ctx, overlay, $, frames } = env
  const { placeBuilding } = await import('../src/buildings.js')
  const { spawnUnit } = await import('../src/units.js')
  frames(1)
  assert.equal($('selpanel').hidden, true)
  let x = 2
  for (let t = 1; t < BUILDING_COUNT; t++) {
    let b = t === B_HEARTH ? ctx.buildings.typeList[B_HEARTH][0] : placeBuilding(ctx, t, x, 50, { free: true })
    if (b < 0) b = placeBuilding(ctx, t, x, 56, { free: true })
    if (b < 0) continue // extractors need resources: skip on the grass map
    x += 4
    overlay.selBuilding = b; overlay.selBuildingGen = ctx.buildings.gen[b]
    env.ui.markSelection(); frames(1)
    const sel = $('selpanel')
    assert.equal(sel.hidden, false, BUILDINGS[t].name)
    assert.match(sel.children[0].innerHTML, new RegExp(BUILDINGS[t].name), BUILDINGS[t].name)
    if (t === B_WARDEN_HALL) assert.match(sel.children[0].innerHTML, /data-act="train"/)
    if (t === B_HEARTH) assert.doesNotMatch(sel.children[0].innerHTML, /demolish/)
  }
  overlay.selBuilding = -1
  const w = spawnUnit(ctx, U_WARDEN, 20.5, 20.5)
  overlay.sel[0] = w; overlay.selGen[0] = ctx.units.gen[w]; overlay.selCount = 1
  env.ui.markSelection(); frames(1)
  assert.match($('selpanel').children[0].innerHTML, /Warden/)
  // courier single selection shows job/cargo
  let courier = -1
  for (let i = 0; i < ctx.units.hi; i++) if (ctx.units.alive[i] && ctx.units.type[i] === U_COURIER) { courier = i; break }
  overlay.sel[0] = courier; overlay.selGen[0] = ctx.units.gen[courier]
  env.ui.markSelection(); frames(1)
  assert.match($('selpanel').children[1].innerHTML, /Cargo/)
  // multi
  const e = spawnUnit(ctx, U_CRAWLER, 40.5, 40.5, F_BLIGHT)
  overlay.sel[0] = w; overlay.selGen[0] = ctx.units.gen[w]
  overlay.sel[1] = e; overlay.selGen[1] = ctx.units.gen[e]
  overlay.selCount = 2
  env.ui.markSelection(); frames(1)
  assert.match($('selpanel').children[0].innerHTML, /2 selected/)
})

test('events become toasts; ctx replacement resets the cursor; win shows a banner', () => {
  const { ctx, $, frames, game, doc } = setup()
  frames(1)
  ctx.events.emit(EV_TIER_UP, 1, 0, ctx.tick)
  ctx.events.emit(EV_WAVE_WARNING, 1, 600, ctx.tick)
  frames(1)
  const toasts = $('toasts')
  assert.equal(toasts.children.length, 2)
  assert.equal(toasts.children[0].classList.contains('good'), true)
  frames(1)
  assert.equal(toasts.children.length, 2, 'events are read once')
  game.reset(9)
  game.ctx.events.emit(EV_TIER_UP, 2, 0, 0)
  frames(1) // a fresh ctx starts its cursor at the current write count: old/new events are not replayed
  assert.equal(toasts.children.length, 2)
  game.ctx.won = true
  frames(12)
  assert.ok(doc.getElementById('banner'), 'banner shown')
})
