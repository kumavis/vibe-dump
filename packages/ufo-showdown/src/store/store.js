// The store: stars in; ships, paint jobs, upgrades and starter power-ups out.
//
// main.js shows the empty #store section and calls openStore() with the save
// and a few hooks; everything inside is built here. Keys arrive through
// storeKey() while it's open, so the store never listens to the window itself.
//
// Kids drive this with a mouse, a finger or the keys they fly with, and the
// rule is the same for all three: the first tap (or arrow) picks an item and
// tries it on in the big preview; a second tap, Enter, or the big button buys
// or equips it. A single stray click never spends a star.

import './store.css'
import { SHIPS, PAINTS, UPGRADES, STARTERS, resolvePaint, loadout } from '../catalog.js'
import { POWERS, PLAYER_COLORS, drawBubble, drawShieldBubble, drawStar, drawPlayerShot } from '../art.js'
import { addPower, powerLevel, DURATION, MAX_TIME, SPREADS, FIRE_DELAY } from '../powers.js'
import { drawShipModel, drawDrone } from '../ships.js'
import { synth } from '../audio.js'
import { hexA } from '../stars.js'
import { SVG, drawSwatch, drawUpgradeIcon } from './icons.js'

const TAU = Math.PI * 2
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const fmt = (n) => n.toLocaleString('en-US')
const STAR = '<span class="st-star">★</span>'

const TABS = [
  { id: 'ships', name: 'Ships', sub: 'New ships, new tricks', icon: SVG.ship, color: '#38d6ff' },
  { id: 'paint', name: 'Paint', sub: 'Colors & patterns', icon: SVG.palette, color: '#ff5fb8' },
  { id: 'upgrades', name: 'Upgrades', sub: 'Slots · armor · magnet · drones', icon: SVG.up, color: '#7dff8a' },
  { id: 'starters', name: 'Power-ups', sub: 'Start every mission with them', icon: SVG.bolt, color: '#ffe23d' },
]

const NOTES = {
  ships: 'Every ship has its own trick. Player 1 and Player 2 can fly different ones.',
  paint: 'Paint your ship! Each player picks their own colors.',
  upgrades: 'Upgrades work on every ship, for both players.',
}

const PAINT_BLURB = {
  team: 'Your own team color: blue for Player 1, pink for Player 2.',
  ruby: 'Shiny red, like a race car.',
  emerald: 'Bright green. Go, go, go!',
  sunburst: 'Warm orange, like a sunrise.',
  midnight: 'Deep space blue.',
  stripes: 'White with red racing stripes.',
  checker: 'Black and white, like the finish line.',
  camo: 'Hide among the asteroids.',
  flames: 'A dark hull with hot flames.',
  galaxy: 'A sparkly night sky that twinkles.',
  rainbow: 'Every color at once!',
  gold: 'The shiniest ship in the galaxy.',
}

const UPGRADE_TAG = {
  cargo: ['More slots', '#ffe23d'],
  armor: ['Defense', '#c9d6e6'],
  magnet: ['Magnet', '#ff7b8a'],
  drones: ['Helpers', '#38d6ff'],
}

const STARTER_BLURB = {
  speed: 'Zoom around faster.',
  rapid: 'Your lasers fire faster.',
  triple: 'Shoot a fan of lasers.',
  shield: 'A bubble that blocks hits.',
}

// What one starter does at a level: the same numbers as catching that many
// bubbles in a row (see ../powers.js).
function starterText(id, lvl) {
  const secs = id in DURATION ? Math.min(MAX_TIME, DURATION[id] * lvl) : 0
  if (id === 'shield') return lvl === 1 ? 'Blocks 1 hit' : `Blocks ${lvl} hits`
  if (id === 'triple') return `${SPREADS[lvl].length} lasers · ${secs}s`
  return `${['Fast', 'Faster', 'Fastest'][lvl - 1]} · ${secs}s`
}

// ---------------------------------------------------------------- state

let opts = null // what main.js handed over; null while the store is shut
let ui = null // handles into the built DOM, and the preview's state
let tab = 0
let who = 0 // which player's ship is being kitted out
const picked = TABS.map(() => null) // the selected item on each tab, between visits
let raf = 0

export function openStore(o) {
  if (ui) stop()
  opts = o
  if (o.numPlayers !== 2) who = 0
  build(o.root)
  switchTab(tab, true)
  ui.balShown = o.save.stars
  ui.balN.textContent = fmt(o.save.stars)
  raf = requestAnimationFrame(loop)
}

function close() {
  const o = opts
  stop()
  opts = null
  o?.onClose()
}

function stop() {
  cancelAnimationFrame(raf)
  raf = 0
  ui?.ro.disconnect()
  ui = null
}

// ---------------------------------------------------------------- building

function el(tag, cls, html) {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (html != null) e.innerHTML = html
  return e
}

function button(cls, html) {
  const b = el('button', cls, html)
  b.type = 'button'
  // Keep the browser's focus off store buttons, so Space and Enter only ever
  // reach storeKey() and never press a button a second time behind its back.
  b.addEventListener('mousedown', (e) => e.preventDefault())
  return b
}

// A canvas drawn at twice its CSS size, so it stays crisp on a phone.
function canvas(w, h, cls) {
  const c = el('canvas', cls)
  c.width = w * 2
  c.height = h * 2
  c.w = w
  c.h = h
  return c
}

function pen(c) {
  const g = c.getContext('2d')
  g.setTransform(2, 0, 0, 2, 0, 0)
  g.clearRect(0, 0, c.w, c.h)
  return g
}

function build(root) {
  root.innerHTML = `
    <div class="st-panel" role="dialog" aria-label="Store">
      <header class="st-head">
        <h2 class="st-title">${SVG.star}<span>Store</span></h2>
        <div class="st-bal" title="Your stars">${SVG.star}<span class="n"></span></div>
      </header>
      <nav class="st-tabs" role="tablist" aria-label="Store sections"></nav>
      <div class="st-body">
        <section class="st-stage" aria-label="Your ship">
          <div class="st-who" role="group" aria-label="Shopping for">
            <span class="st-who-k"><kbd class="sm">P</kbd></span>
          </div>
          <div class="st-view">
            <canvas></canvas>
            <span class="st-tryon"></span>
            <span class="st-cap"></span>
          </div>
          <div class="st-info">
            <div class="st-iname"><span class="nm"></span><span class="kind"></span></div>
            <p class="st-blurb"></p>
            <p class="st-next"></p>
            <div class="st-stats"></div>
            <p class="st-msg" role="status" aria-live="polite"></p>
          </div>
        </section>
        <section class="st-shelf">
          <div class="st-note"></div>
          <div class="st-grid"></div>
        </section>
      </div>
      <footer class="st-keys">
        <span><kbd class="sm">Arrows</kbd> pick</span>
        <span><kbd class="sm">Enter</kbd> buy / use</span>
        <span><kbd class="sm">Q</kbd><kbd class="sm">E</kbd> or <kbd class="sm">1</kbd>–<kbd class="sm">4</kbd> tabs</span>
        <span><kbd class="sm">P</kbd> Player 1 / 2</span>
        <span><kbd class="sm">Esc</kbd> back</span>
      </footer>
    </div>`

  const $ = (s) => root.querySelector(s)
  ui = {
    root,
    panel: $('.st-panel'),
    balEl: $('.st-bal'),
    balN: $('.st-bal .n'),
    tabsEl: $('.st-tabs'),
    body: $('.st-body'),
    stage: $('.st-stage'),
    view: $('.st-view'),
    pcan: $('.st-view canvas'),
    tryon: $('.st-tryon'),
    cap: $('.st-cap'),
    iname: $('.st-iname .nm'),
    ikind: $('.st-iname .kind'),
    blurb: $('.st-blurb'),
    next: $('.st-next'),
    stats: $('.st-stats'),
    msg: $('.st-msg'),
    note: $('.st-note'),
    grid: $('.st-grid'),
    cards: [],
    sel: null,
    balShown: 0,
    t: 0,
    last: performance.now(),
    pstars: Array.from({ length: 50 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random(), c: Math.random() < 0.25 ? '#9ff0ff' : '#ffffff' })),
    shots: [],
    fireCd: 0,
    droneCd: 0,
    mag: [],
    parts: [],
    rings: [],
  }

  const close_ = button('st-close', '<kbd class="sm">Esc</kbd><span>Back</span>')
  close_.addEventListener('click', () => close())
  $('.st-head').append(close_)

  const whoEl = $('.st-who')
  ui.whoBtns = [0, 1].map((i) => {
    const b = button(`st-p p${i + 1}`, `<span class="dot"></span>Player ${i + 1}`)
    b.addEventListener('click', () => {
      pointer()
      setWho(i)
    })
    whoEl.insertBefore(b, whoEl.lastElementChild)
    return b
  })

  ui.tabBtns = TABS.map((t, i) => {
    const b = button('st-tab', `<span class="ic">${t.icon}</span><span class="tx"><span class="nm">${t.name}</span><span class="sb">${t.sub}</span></span><span class="dot" title="Something new you can buy"></span>`)
    b.setAttribute('role', 'tab')
    b.style.setProperty('--tc', t.color)
    b.addEventListener('click', () => {
      pointer()
      switchTab(i)
    })
    ui.tabsEl.append(b)
    return b
  })

  ui.go = button('st-go')
  ui.go.addEventListener('click', () => {
    pointer()
    if (ui.sel) activate(ui.sel)
  })
  $('.st-info').insertBefore(ui.go, ui.msg)

  ui.stats.innerHTML = ['speed', 'lives', 'slots', 'magnet', 'drones', 'trick']
    .map((k) => `<div class="st-stat" data-k="${k}"><span class="k">${k === 'trick' ? 'Trick' : k[0].toUpperCase() + k.slice(1)}</span><span class="v"></span></div>`)
    .join('')
  ui.statEls = Object.fromEntries([...ui.stats.children].map((d) => [d.dataset.k, d]))

  ui.pctx = ui.pcan.getContext('2d')
  ui.ro = new ResizeObserver(() => sizePreview())
  ui.ro.observe(ui.view)
  sizePreview()

  // The keyboard focus ring is louder than the mouse one: show it only after a key.
  ui.panel.addEventListener('pointerdown', pointer)
}

function pointer() {
  ui?.panel.classList.remove('kb')
}

function sizePreview() {
  if (!ui) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = ui.view.clientWidth
  const h = ui.view.clientHeight
  ui.dpr = dpr
  ui.vw = w
  ui.vh = h
  ui.pcan.width = Math.max(1, Math.round(w * dpr))
  ui.pcan.height = Math.max(1, Math.round(h * dpr))
}

// ---------------------------------------------------------------- items

function itemsFor(id) {
  if (id === 'ships') return SHIPS.map((def) => ({ kind: 'ship', id: def.id, def, name: def.name }))
  if (id === 'paint') return PAINTS.map((def) => ({ kind: 'paint', id: def.id, def, name: def.name }))
  if (id === 'upgrades') return UPGRADES.map((def) => ({ kind: 'upgrade', id: def.id, def, name: def.name }))
  return STARTERS.map((def) => ({ kind: 'starter', id: def.id, def, name: POWERS[def.id].label }))
}

// Where an item stands for the player being kitted out: owned, worn, maxed,
// what the next press costs and what it would do.
function status(item) {
  const s = opts.save
  const { kind, id, def } = item
  let st
  if (kind === 'ship' || kind === 'paint') {
    const owned = (kind === 'ship' ? s.ships : s.paints).includes(id)
    const by = [0, 1].filter((i) => s.equip[i]?.[kind] === id)
    const on = by.includes(who)
    st = { owned, by, on, price: owned ? 0 : def.price, act: on ? 'on' : owned ? 'equip' : 'buy' }
  } else {
    const lvl = (kind === 'upgrade' ? s.upgrades[id] : s.starters[id]) ?? 0
    const max = def.prices.length
    st = { owned: lvl > 0, by: [], lvl, max, price: lvl < max ? def.prices[lvl] : 0, act: lvl >= max ? 'max' : 'buy' }
  }
  st.need = st.act === 'buy' ? Math.max(0, st.price - s.stars) : 0
  return st
}

function actionLabel(item, st) {
  if (st.act === 'buy') {
    if (st.need > 0) return `Need ${STAR} ${fmt(st.need)} more`
    return `${st.lvl ? 'Upgrade' : 'Buy'} ${STAR} ${fmt(st.price)}`
  }
  if (st.act === 'equip') return item.kind === 'ship' ? 'Fly it' : 'Paint it'
  if (st.act === 'on') return `${SVG.check}${item.kind === 'ship' ? 'Flying' : 'Painted'}`
  return `${SVG.check}Maxed out`
}

// A copy of the save with `item` bought and worn, for the try-on preview.
function tryOn(item) {
  const s = opts.save
  const t = {
    ...s,
    equip: s.equip.map((e) => ({ ...e })),
    upgrades: { ...s.upgrades },
    starters: { ...s.starters },
    startersOn: { ...s.startersOn },
  }
  if (!item) return t
  const { kind, id, def } = item
  if (kind === 'ship') t.equip[who].ship = id
  else if (kind === 'paint') t.equip[who].paint = id
  else if (kind === 'upgrade') t.upgrades[id] = Math.min(def.prices.length, (t.upgrades[id] ?? 0) + 1)
  else if (kind === 'starter') {
    t.starters[id] = Math.min(def.prices.length, (t.starters[id] ?? 0) + 1)
    t.startersOn[id] = true
  }
  return t
}

// The ship as it leaves the hangar, starters already in its slots — the
// same steps as makePlayer() in main.js.
function launch(save) {
  const lo = loadout(save, who)
  const slots = []
  for (const st of lo.starters) for (let i = 0; i < st.level; i++) addPower(slots, st.type, lo.slots)
  if (lo.lifeShield) addPower(slots, 'shield', lo.slots)
  return { lo, slots }
}

// ---------------------------------------------------------------- the shelf

function switchTab(i, quiet) {
  tab = (i + TABS.length) % TABS.length
  ui.tabBtns.forEach((b, j) => {
    b.classList.toggle('on', j === tab)
    b.setAttribute('aria-selected', j === tab ? 'true' : 'false')
  })
  const t = TABS[tab]
  ui.panel.dataset.tab = t.id
  ui.grid.className = `st-grid st-g-${t.id}`
  ui.cards = itemsFor(t.id).map(makeCard)
  ui.grid.replaceChildren(...ui.cards.map((c) => c.wrap))
  ui.note.replaceChildren()
  if (t.id === 'starters') buildLaunchBox()
  else ui.note.append(el('p', 'st-hint', NOTES[t.id]))
  paintCards()
  const navs = navEls()
  ui.sel = navs.find((n) => navKey(n) === picked[tab]) ?? navs[0] ?? null
  ui.body.scrollTop = 0
  ui.msg.textContent = ''
  refresh()
  if (!quiet) opts.sfx.select()
}

function makeCard(item) {
  const c = { item }
  c.wrap = el('div', `st-card st-k-${item.kind}`)
  c.btn = button('st-item')
  c.btn.dataset.nav = 'item'
  c.btn.card = c
  c.badges = el('span', 'st-badges')
  c.name = el('span', 'st-name')
  c.name.textContent = item.name
  c.pill = el('span', 'st-pill')
  if (item.kind === 'ship') {
    c.canvas = canvas(150, 92, 'st-thumb')
    const perks = el('span', 'st-perks')
    for (const p of item.def.perks) perks.append(Object.assign(el('span'), { textContent: p }))
    c.btn.append(c.badges, c.canvas, c.name, perks, c.pill)
  } else if (item.kind === 'paint') {
    c.canvas = canvas(84, 84, 'st-swatch')
    c.btn.append(c.badges, c.canvas, c.name, c.pill)
  } else if (item.kind === 'upgrade') {
    const [tag, color] = UPGRADE_TAG[item.id]
    c.canvas = canvas(96, 80, 'st-uicon')
    c.ladder = el('span', 'st-ladder')
    const tagEl = el('span', 'st-tag', tag)
    tagEl.style.setProperty('--tc', color)
    const text = el('span', 'st-utext')
    text.append(tagEl, c.name, Object.assign(el('span', 'st-ublurb'), { textContent: item.def.blurb }))
    const head = el('span', 'st-uhead')
    head.append(c.canvas, text)
    c.btn.append(head, c.ladder, c.pill)
  } else {
    c.canvas = canvas(84, 84, 'st-bub')
    c.ladder = el('span', 'st-ladder')
    c.btn.append(c.canvas, c.name, c.ladder, c.pill)
    c.toggle = button('st-toggle', '<span class="sw"><i></i></span><span class="lb"></span>')
    c.toggle.dataset.nav = 'toggle'
    c.toggle.card = c
    c.toggle.addEventListener('click', () => {
      pointer()
      select(c.toggle)
      activate(c.toggle)
    })
  }
  c.btn.addEventListener('click', () => {
    pointer()
    // first tap looks, second tap buys
    if (ui.sel !== c.btn) {
      select(c.btn)
      opts.sfx.select()
    } else activate(c.btn)
  })
  c.wrap.append(c.btn)
  if (c.toggle) c.wrap.append(c.toggle)
  return c
}

// Card pictures only change with the player or what they wear, so they're
// drawn then rather than every refresh.
function paintCards() {
  const eq = opts.save.equip[who]
  const paint = resolvePaint(eq.paint, who)
  for (const c of ui.cards) {
    const g = pen(c.canvas)
    const { kind, id } = c.item
    if (kind === 'ship') {
      const glow = g.createRadialGradient(75, 54, 4, 75, 54, 60)
      glow.addColorStop(0, hexA(paint.main, 0.28))
      glow.addColorStop(1, hexA(paint.main, 0))
      g.fillStyle = glow
      g.fillRect(0, 0, 150, 92)
      g.save()
      g.translate(75, 50)
      g.scale(1.12, 1.12)
      drawShipModel(g, 0, 0, id, paint, { t: 0.1, thrust: 0.45 })
      g.restore()
    } else if (kind === 'paint') {
      drawSwatch(g, 42, 42, 32, resolvePaint(id, who), 0.3)
    } else if (kind === 'upgrade') {
      drawUpgradeIcon(g, id, 48, 42, 1, { paint, ship: eq.ship, t: 0.2 })
    } else {
      drawBubble(g, 42, 42, 36, id, 0)
    }
  }
}

// The starters tab's launch bay: this player's ship as a mission begins,
// with the slots it takes off with already filled.
function buildLaunchBox() {
  const box = el('div', 'st-launch')
  box.innerHTML = `
    <div class="st-launch-t"><b>Mission start!</b> Your ship takes off with these power-ups already loaded. ×2 and ×3 are stronger and last longer.</div>
    <div class="st-slots" aria-label="Your slots at the start of a mission"></div>
    <p class="st-warn"></p>`
  ui.lship = canvas(64, 72, 'st-lship')
  box.prepend(ui.lship)
  ui.note.append(box)
  ui.slotsEl = box.querySelector('.st-slots')
  ui.warnEl = box.querySelector('.st-warn')
}

function renderSlots() {
  const { lo, slots } = launch(opts.save)
  const g = pen(ui.lship)
  g.save()
  g.translate(32, 38)
  g.scale(0.82, 0.82)
  drawShipModel(g, 0, 0, lo.ship, lo.paint, { t: 0.1, thrust: 0.7 })
  g.restore()
  const want = lo.starters.length + (lo.lifeShield ? 1 : 0)
  ui.slotsEl.replaceChildren()
  for (let i = 0; i < lo.slots; i++) {
    const s = slots[i]
    const d = el('span', s ? 'st-slot' : 'st-slot empty')
    if (s) {
      const c = canvas(56, 56)
      drawBubble(pen(c), 28, 28, 23, s.type, 0)
      d.append(c)
      if (s.level > 1) d.append(el('b', null, `×${s.level}`))
      d.title = `${POWERS[s.type].label} ×${s.level}`
    }
    ui.slotsEl.append(d)
  }
  const roomy = (opts.save.upgrades.cargo ?? 0) >= UPGRADES.find((u) => u.id === 'cargo').prices.length
  ui.warnEl.textContent =
    want > lo.slots
      ? `Only ${lo.slots} fit, so the first ones get bumped. Turn one off${roomy ? '' : ', or get a Cargo Bay'}.`
      : roomy
        ? `${lo.slots} slots: the most a ship can carry!`
        : `${lo.slots} slots. A Cargo Bay upgrade adds more.`
  ui.warnEl.classList.toggle('bad', want > lo.slots)
}

function navEls() {
  return [...ui.grid.querySelectorAll('[data-nav]:not(:disabled)')]
}

const navKey = (n) => `${n.card.item.id}:${n.dataset.nav}`

function select(n) {
  if (!n) return
  ui.sel = n
  picked[tab] = navKey(n)
  ui.msg.textContent = ''
  ui.msg.className = 'st-msg'
  refresh()
}

// ---------------------------------------------------------------- refresh

function refresh() {
  if (!ui) return
  ui.panel.dataset.who = who
  ui.whoBtns.forEach((b, i) => {
    b.classList.toggle('on', i === who)
    b.setAttribute('aria-pressed', i === who ? 'true' : 'false')
  })
  // a dot on each tab that holds something new the wallet can cover
  TABS.forEach((t, i) => {
    const any = itemsFor(t.id).some((it) => {
      const st = status(it)
      return st.act === 'buy' && st.need === 0 && !st.owned
    })
    ui.tabBtns[i].classList.toggle('has-new', any)
  })
  for (const c of ui.cards) updateCard(c)
  if (TABS[tab].id === 'starters') renderSlots()
  updateStage()
}

function updateCard(c) {
  const { item } = c
  const st = status(item)
  const selected = ui.sel === c.btn
  c.btn.classList.toggle('is-sel', selected)
  c.toggle?.classList.toggle('is-sel', ui.sel === c.toggle)
  c.wrap.classList.toggle('is-owned', st.owned)
  c.wrap.classList.toggle('is-on', !!st.on)
  c.wrap.classList.toggle('is-locked', st.act === 'buy' && st.need > 0 && !st.owned)
  c.wrap.classList.toggle('is-max', st.act === 'max')
  c.btn.setAttribute('aria-pressed', selected ? 'true' : 'false')

  c.badges.innerHTML = st.by.map((i) => `<i class="p${i + 1}">P${i + 1}</i>`).join('')

  let pill
  let cls
  if (selected) {
    pill = actionLabel(item, st)
    cls = st.act === 'buy' ? (st.need ? 'need' : 'go') : st.act === 'equip' ? 'go' : st.act
  } else if (st.act === 'max') {
    pill = 'Max'
    cls = 'max'
  } else if (st.act === 'on') {
    pill = `${SVG.check}${item.kind === 'ship' ? 'Flying' : 'Painted'}`
    cls = 'on'
  } else if (st.act === 'equip') {
    pill = 'Owned'
    cls = 'owned'
  } else {
    pill = `${st.need ? SVG.lock : ''}${STAR} ${fmt(st.price)}`
    cls = st.need ? 'price locked' : 'price'
  }
  c.pill.innerHTML = pill
  c.pill.className = `st-pill ${cls}`

  if (c.ladder) c.ladder.innerHTML = ladder(item, st)
  if (c.toggle) {
    const on = st.owned && opts.save.startersOn[item.id] !== false
    c.toggle.disabled = !st.owned
    c.toggle.setAttribute('aria-pressed', on ? 'true' : 'false')
    c.toggle.querySelector('.lb').textContent = !st.owned ? 'Not yours yet' : on ? 'On' : 'Off'
    c.toggle.setAttribute('aria-label', `${POWERS[item.id].label} at start: ${on ? 'on' : 'off'}`)
  }
}

// The left column: the try-on preview, what the item is, the ship's stats
// against what it flies with now, and the big button.
function updateStage() {
  const n = ui.sel
  const item = n?.card.item ?? null
  const st = item ? status(item) : null
  const now = launch(opts.save)
  const trial = tryOn(n?.dataset.nav === 'toggle' ? null : item)
  const next = launch(trial)
  const lo = next.lo
  ui.look = {
    lo,
    shield: powerLevel(next.slots, 'shield'),
    rapid: powerLevel(next.slots, 'rapid'),
    triple: powerLevel(next.slots, 'triple'),
    speed: powerLevel(next.slots, 'speed'),
    magnet: trial.upgrades.magnet ?? 0,
  }

  const shipName = SHIPS.find((x) => x.id === lo.ship)?.name ?? ''
  ui.cap.textContent = `${shipName} · ${lo.paint.name}`
  let tag = ''
  if (item && n.dataset.nav !== 'toggle') {
    if ((item.kind === 'ship' || item.kind === 'paint') && st.act !== 'on') tag = 'Trying it on'
    else if ((item.kind === 'upgrade' || item.kind === 'starter') && st.act === 'buy') tag = 'Next level'
  }
  ui.tryon.textContent = tag
  ui.tryon.hidden = !tag

  if (!item) {
    ui.iname.textContent = ''
    ui.ikind.textContent = ''
    ui.blurb.textContent = ''
    ui.next.textContent = ''
    ui.go.hidden = true
  } else {
    ui.go.hidden = false
    ui.iname.textContent = item.name
    ui.ikind.textContent = { ship: 'Ship', paint: 'Paint', upgrade: 'Upgrade', starter: 'Starter power-up' }[item.kind]
    if (item.kind === 'ship') {
      ui.blurb.textContent = item.def.blurb
      ui.next.textContent = item.def.perks.join(' · ')
    } else if (item.kind === 'paint') {
      ui.blurb.textContent = PAINT_BLURB[item.id] ?? ''
      ui.next.textContent = item.def.pattern ? 'Pattern paint job' : ''
    } else if (item.kind === 'upgrade') {
      ui.blurb.textContent = item.def.blurb
      ui.next.innerHTML =
        st.act === 'max'
          ? `<b>Level ${st.lvl}:</b> ${item.def.describe(st.lvl)}`
          : `Now: ${item.def.describe(st.lvl)} <span class="arr">→</span> <b>${item.def.describe(st.lvl + 1)}</b>`
    } else {
      ui.blurb.textContent = `${STARTER_BLURB[item.id]} Fills one slot at the start of every mission.`
      ui.next.innerHTML =
        st.act === 'max'
          ? `<b>×${st.lvl}:</b> ${starterText(item.id, st.lvl)}`
          : st.lvl
            ? `Now: ×${st.lvl} <span class="arr">→</span> <b>×${st.lvl + 1}: ${starterText(item.id, st.lvl + 1)}</b>`
            : `<b>${starterText(item.id, 1)}</b>`
    }
    let label
    let cls
    if (n.dataset.nav === 'toggle') {
      const on = opts.save.startersOn[item.id] !== false
      label = on ? 'Turn it off' : 'Turn it on'
      cls = 'go'
    } else {
      label = actionLabel(item, st)
      cls = st.act === 'buy' ? (st.need ? 'need' : 'go') : st.act === 'equip' ? 'go' : st.act
    }
    ui.go.innerHTML = label
    ui.go.className = `st-go ${cls}`
  }

  // stats: what the ship flies with if you take this, against what it has now
  const was = now.lo
  const mark = (k, a, b) => {
    const d = ui.statEls[k]
    d.classList.toggle('up', b > a)
    d.classList.toggle('down', b < a)
  }
  const sv = ui.statEls.speed.querySelector('.v')
  sv.innerHTML = `<span class="bar"><i style="width:${Math.round(clamp((lo.speed - 0.5) / 0.8, 0.1, 1) * 100)}%"></i></span>`
  mark('speed', was.speed, lo.speed)
  // past five, hearts get counted rather than drawn, so the row never wraps
  ui.statEls.lives.querySelector('.v').innerHTML =
    Math.max(lo.lives, was.lives) <= 5 ? row(SVG.heart, lo.lives, was.lives, 'hrt') : `<span class="hrt">${SVG.heart}</span><b class="num">×${lo.lives}</b>`
  mark('lives', was.lives, lo.lives)
  ui.statEls.slots.querySelector('.v').innerHTML = row('<b></b>', lo.slots, was.slots, 'box')
  mark('slots', was.slots, lo.slots)
  const magWas = opts.save.upgrades.magnet ?? 0
  ui.statEls.magnet.querySelector('.v').innerHTML = pips(ui.look.magnet, magWas, 3)
  mark('magnet', magWas, ui.look.magnet)
  const drWas = opts.save.upgrades.drones ?? 0
  ui.statEls.drones.querySelector('.v').innerHTML = pips(trial.upgrades.drones ?? 0, drWas, 3)
  mark('drones', drWas, trial.upgrades.drones ?? 0)
  const tricks = []
  if (lo.twin) tricks.push('Twin lasers')
  if (lo.pierce) tricks.push('Pierce')
  if (lo.phoenix) tricks.push('Phoenix')
  if (lo.lifeShield) tricks.push('Shield each life')
  if (lo.hitR < 10) tricks.push('Hard to hit')
  ui.statEls.trick.querySelector('.v').innerHTML = tricks.length ? tricks.map((t) => `<em>${t}</em>`).join('') : '<span class="none">All-rounder</span>'
  ui.statEls.trick.classList.toggle('up', lo.ship !== was.ship && tricks.length > 0)
}

// Every level of an upgrade or starter, top to bottom: the ones owned ticked
// off, the next one lit up, the rest still to come.
function ladder(item, st) {
  const up = item.kind === 'upgrade'
  return item.def.prices
    .map((price, i) => {
      const cls = i < st.lvl ? 'done' : i === st.lvl ? 'next' : ''
      const mark = i < st.lvl ? SVG.check : up ? i + 1 : `×${i + 1}`
      const text = up ? item.def.describe(i + 1) : starterText(item.id, i + 1)
      const cost = up && i >= st.lvl ? `<span class="p">${STAR} ${fmt(price)}</span>` : ''
      return `<span class="${cls}"><i>${mark}</i><span class="t">${text}</span>${cost}</span>`
    })
    .join('')
}

// `n` little icons, with the ones gained over `was` lit up and the ones lost
// shown as ghosts.
function row(icon, n, was, cls) {
  let out = ''
  for (let i = 0; i < Math.max(n, was); i++) out += `<span class="${cls}${i >= was ? ' new' : ''}${i >= n ? ' lost' : ''}">${icon}</span>`
  return out
}

function pips(n, was, max) {
  let out = ''
  for (let i = 0; i < max; i++) out += `<i class="${i < n ? 'on' : ''}${i < n && i >= was ? ' new' : ''}"></i>`
  return `<span class="st-pips sm">${out}</span>`
}

// ---------------------------------------------------------------- actions

function activate(n) {
  if (!n || !opts) return
  const c = n.card
  if (n.dataset.nav === 'toggle') return toggleStarter(c)
  const st = status(c.item)
  if (st.act === 'buy') return st.need > 0 ? deny(c, st) : buy(c, st)
  if (st.act === 'equip') return equip(c)
  // already worn, or already maxed: a friendly nudge, not a buzzer
  opts.sfx.select()
  say(st.act === 'max' ? `${c.item.name} is all maxed out!` : `Player ${who + 1} already has ${c.item.name}.`)
}

// A purchase can't be undone, so a second activation of the same item hard on
// the heels of the first — a double-click or double-tap, which kids do out of
// habit — is swallowed instead of buying the next level too.
let lastBuy = { key: '', at: -Infinity }

function buy(c, st) {
  const s = opts.save
  const { kind, id, def } = c.item
  const key = `${kind}:${id}`
  const now = performance.now()
  if (key === lastBuy.key && now - lastBuy.at < 700) return
  if (s.stars < st.price) return deny(c, { ...st, need: st.price - s.stars })
  lastBuy = { key, at: now }
  s.stars = Math.max(0, s.stars - st.price)
  let text
  if (kind === 'ship') {
    if (!s.ships.includes(id)) s.ships.push(id)
    s.equip[who].ship = id
    text = `${def.name} is yours! Player ${who + 1} is flying it.`
  } else if (kind === 'paint') {
    if (!s.paints.includes(id)) s.paints.push(id)
    s.equip[who].paint = id
    text = `Fresh paint! Player ${who + 1}'s ship is ${def.name} now.`
  } else if (kind === 'upgrade') {
    s.upgrades[id] = (s.upgrades[id] ?? 0) + 1
    text = `${def.name} level ${s.upgrades[id]}: ${def.describe(s.upgrades[id])}!`
  } else {
    s.starters[id] = (s.starters[id] ?? 0) + 1
    s.startersOn[id] = true
    text = `${POWERS[id].label} ×${s.starters[id]} loads at the start of every mission.`
  }
  opts.persist()
  opts.sfx.buy()
  say(text, 'good')
  spent(st.price)
  bump(c.wrap, 'st-pop')
  burst(true)
  if (kind === 'ship' || kind === 'paint' || kind === 'upgrade') paintCards()
  refresh()
}

function deny(c, st) {
  opts.sfx.deny()
  say(`Need ★ ${fmt(st.need)} more. Play a mission to earn stars!`, 'bad')
  bump(c.wrap, 'st-shake')
  bump(ui.go, 'st-shake')
}

function equip(c) {
  const { kind, id, name } = c.item
  opts.save.equip[who][kind] = id
  opts.persist()
  synth.tone({ type: 'triangle', from: 660, dur: 0.08, vol: 0.14 }, 'st-eq1', 0)
  synth.tone({ type: 'triangle', from: 990, dur: 0.14, vol: 0.14, at: 0.07 }, 'st-eq2', 0)
  say(kind === 'ship' ? `Player ${who + 1} is flying ${name}!` : `Player ${who + 1}'s ship is ${name} now!`, 'good')
  bump(c.wrap, 'st-pop')
  burst(false)
  paintCards()
  refresh()
}

function toggleStarter(c) {
  const s = opts.save
  const { id } = c.item
  if (!(s.starters[id] > 0)) return
  const on = s.startersOn[id] === false
  s.startersOn[id] = on
  opts.persist()
  synth.tone({ type: 'sine', from: on ? 520 : 780, to: on ? 880 : 420, dur: 0.12, vol: 0.16 }, 'st-tog', 0)
  say(on ? `${POWERS[id].label} is on: it loads when a mission starts.` : `${POWERS[id].label} is off: saved for later.`)
  refresh()
}

function setWho(i) {
  if (i === who) return
  who = i
  opts.sfx.select()
  paintCards()
  refresh()
  say(who === 1 && opts.numPlayers !== 2 ? 'Player 2 flies in 2-player games.' : `Shopping for Player ${who + 1}.`)
}

function say(text, cls = '') {
  ui.msg.textContent = text
  ui.msg.className = `st-msg ${cls}`
}

// Restart a one-shot CSS animation on `node`.
function bump(node, cls) {
  node.classList.remove('st-pop', 'st-shake')
  void node.offsetWidth
  node.classList.add(cls)
  node.addEventListener('animationend', () => node.classList.remove(cls), { once: true })
}

function spent(n) {
  ui.balEl.querySelectorAll('.st-delta').forEach((d) => d.remove())
  const d = el('span', 'st-delta', `−${fmt(n)}`)
  ui.balEl.append(d)
  d.addEventListener('animationend', () => d.remove(), { once: true })
}

// ---------------------------------------------------------------- keys

const MOVES = {
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
}

export function storeKey(e) {
  if (!opts || !ui) return
  if (e.ctrlKey || e.metaKey || e.altKey) return
  const c = e.code
  const mv = MOVES[c]
  if (mv || c === 'Tab' || c === 'Space' || c === 'Enter' || c === 'NumpadEnter' || c === 'Backspace') e.preventDefault()
  ui.panel.classList.add('kb')
  if (mv) return move(mv[0], mv[1])
  if (e.repeat) return
  if (c === 'Escape' || c === 'Backspace') return close()
  if (c === 'Tab') return switchTab(tab + (e.shiftKey ? -1 : 1))
  if (c === 'KeyQ' || c === 'PageUp') return switchTab(tab - 1)
  if (c === 'KeyE' || c === 'PageDown') return switchTab(tab + 1)
  const num = /^(?:Digit|Numpad)([1-9])$/.exec(c)
  if (num && +num[1] <= TABS.length) return switchTab(+num[1] - 1)
  if (c === 'KeyP') return setWho(1 - who)
  if (c === 'Enter' || c === 'Space' || c === 'NumpadEnter') return activate(ui.sel)
}

// Arrows follow the layout on screen, whatever the grid's columns are at this
// width: the nearest item in that direction wins, favouring ones in line.
function move(dx, dy) {
  const navs = navEls()
  if (!navs.length) return
  const cur = navs.includes(ui.sel) ? ui.sel : navs[0]
  const a = cur.getBoundingClientRect()
  const ax = a.left + a.width / 2
  const ay = a.top + a.height / 2
  let best = null
  let bestD = Infinity
  for (const n of navs) {
    if (n === cur) continue
    const b = n.getBoundingClientRect()
    const ox = b.left + b.width / 2 - ax
    const oy = b.top + b.height / 2 - ay
    const along = ox * dx + oy * dy
    if (along <= 4) continue
    const d = along + Math.abs(ox * dy + oy * dx) * 2.5
    if (d < bestD) {
      bestD = d
      best = n
    }
  }
  // off the end of a row: carry on to the next item in reading order
  if (!best && dx) best = navs[navs.indexOf(cur) + dx] ?? null
  if (!best) return
  select(best)
  opts.sfx.select()
  best.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

// ---------------------------------------------------------------- preview

function loop(now) {
  if (!ui) return
  raf = requestAnimationFrame(loop)
  const dt = clamp((now - ui.last) / 1000, 0, 0.05)
  ui.last = now
  ui.t += dt
  tickBalance(dt)
  drawPreview(dt)
}

function tickBalance(dt) {
  const target = opts.save.stars
  if (ui.balShown === target) return
  const diff = target - ui.balShown
  const step = Math.sign(diff) * Math.max(1, Math.abs(diff) * Math.min(1, dt * 8))
  ui.balShown = Math.abs(step) >= Math.abs(diff) ? target : Math.round(ui.balShown + step)
  ui.balN.textContent = fmt(ui.balShown)
}

// A shower of stars off the ship — gold for a purchase, paint for a re-fit.
function burst(big) {
  const look = ui.look
  if (!look) return
  const colors = big ? ['#ffd54a', '#fff1a0', '#ffffff', look.lo.paint.main] : [look.lo.paint.main, look.lo.paint.light, '#ffffff']
  const n = big ? 34 : 18
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU
    const sp = (big ? 140 : 90) + Math.random() * 180
    ui.parts.push({ x: 0, y: -6, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: 0.7 + Math.random() * 0.5, c: colors[i % colors.length], r: 2.5 + Math.random() * 3.5, star: i % 3 === 0 })
  }
  ui.rings.push({ r: 20, life: 0.6, c: big ? '#ffd54a' : look.lo.paint.main })
}

function drawPreview(dt) {
  const look = ui.look
  const { pctx: ctx, vw: w, vh: h, dpr, t } = ui
  if (!look || !w || !h) return
  const lo = look.lo
  const paint = lo.paint
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  // stars streaming past, faster for a faster ship
  const sp = 0.35 + lo.speed * 0.5
  for (const s of ui.pstars) {
    s.y += (0.06 + s.z * 0.4) * sp * dt
    if (s.y > 1.05) {
      s.y -= 1.1
      s.x = Math.random()
    }
    const len = 1.5 + s.z * s.z * 16 * sp
    ctx.globalAlpha = 0.2 + s.z * 0.6
    ctx.fillStyle = s.c
    ctx.fillRect(s.x * w, s.y * h - len, 1 + s.z * 1.2, len)
  }
  ctx.globalAlpha = 1

  // The ship and its kit live between y = -46 (shield top) and +66 (pad);
  // fit that range into the view.
  const k = Math.min(h / 128, w / 150)
  const cx = w / 2
  const cy = h / 2 - 10 * k
  const bob = Math.sin(t * 2) * 3

  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(k, k)

  // the hover pad, lit in the paint colour
  const padY = 64
  const pg = ctx.createRadialGradient(0, padY, 2, 0, padY, 70)
  pg.addColorStop(0, hexA(paint.main, 0.45))
  pg.addColorStop(1, hexA(paint.main, 0))
  ctx.fillStyle = pg
  ctx.beginPath()
  ctx.ellipse(0, padY, 70, 14, 0, 0, TAU)
  ctx.fill()
  ctx.strokeStyle = hexA(paint.light, 0.55)
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.ellipse(0, padY, 46, 8, 0, 0, TAU)
  ctx.stroke()

  updateShots(dt, lo, look)
  ctx.globalCompositeOperation = 'lighter'
  const team = PLAYER_COLORS[who]
  for (const s of ui.shots) {
    if (s.drone) {
      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.scale(0.6, 0.6)
      drawPlayerShot(ctx, { x: 0, y: 0, vx: s.vx, vy: s.vy }, team)
      ctx.restore()
    } else drawPlayerShot(ctx, s, team)
  }
  ctx.globalCompositeOperation = 'source-over'

  drawMagnet(ctx, dt, look, bob)

  const n = lo.drones.count
  for (let i = 0; i < n; i++) {
    const side = n === 1 ? -1 : i ? 1 : -1
    drawDrone(ctx, side * 48, 6 + bob + Math.sin(t * 4 + i * 2) * 5, paint, t)
  }
  drawShipModel(ctx, 0, bob, lo.ship, paint, { t, thrust: 0.55 + 0.3 * Math.sin(t * 3), tilt: Math.sin(t * 0.9) * 0.35 })
  if (look.speed) {
    ctx.fillStyle = hexA(POWERS.speed.color, 0.5)
    for (const d of [-1, 1]) ctx.fillRect(d * 22 - 1.5, bob + 26, 3, 12 + look.speed * 6 + Math.sin(t * 30 + d) * 6)
  }
  if (look.shield) drawShieldBubble(ctx, 0, bob, t, POWERS.shield.color, look.shield)
  ctx.restore()

  // celebration sparks, in view pixels so they fly the same at any size
  ctx.save()
  ctx.translate(cx, cy)
  for (const r of ui.rings) {
    r.life -= dt
    r.r += 260 * dt
    ctx.strokeStyle = hexA(r.c, Math.max(0, r.life / 0.6) * 0.8)
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(0, 0, r.r, 0, TAU)
    ctx.stroke()
  }
  ui.rings = ui.rings.filter((r) => r.life > 0)
  for (const p of ui.parts) {
    p.life -= dt
    p.vy += 260 * dt
    p.vx *= 1 - dt * 1.5
    p.x += p.vx * dt
    p.y += p.vy * dt
    ctx.globalAlpha = clamp(p.life / 0.4, 0, 1)
    if (p.star) drawStar(ctx, p.x, p.y, p.r * 1.6, p.c)
    else {
      ctx.fillStyle = p.c
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 0.7, 0, TAU)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
  ui.parts = ui.parts.filter((p) => p.life > 0)
  ctx.restore()
}

// The ship keeps firing in the preview, with whatever its loadout would give
// it: rapid fire, triple shot, twin cannons, and the drones' own little shots.
function updateShots(dt, lo, look) {
  const top = -ui.vh / (2 * Math.min(ui.vh / 128, ui.vw / 150)) - 30
  ui.fireCd -= dt
  if (ui.fireCd <= 0) {
    ui.fireCd = FIRE_DELAY[look.rapid] * 2.2
    for (const a of SPREADS[look.triple]) {
      for (const ox of lo.twin ? [-7, 7] : [0]) ui.shots.push({ x: ox, y: -34, vx: Math.sin(a) * 240, vy: -Math.cos(a) * 240 })
    }
  }
  if (lo.drones.count) {
    ui.droneCd -= dt
    if (ui.droneCd <= 0) {
      ui.droneCd = lo.drones.delay * 2.2
      const n = lo.drones.count
      for (let i = 0; i < n; i++) ui.shots.push({ x: (n === 1 ? -1 : i ? 1 : -1) * 48, y: -6, vx: 0, vy: -220, drone: true })
    }
  }
  for (const s of ui.shots) {
    s.x += s.vx * dt
    s.y += s.vy * dt
  }
  ui.shots = ui.shots.filter((s) => s.y > top)
}

// A magnet reels bubbles in from the edges on a tractor beam: one at a time
// for a small pull, three at once for a super one.
function drawMagnet(ctx, dt, look, bob) {
  const lvl = look.magnet
  while (ui.mag.length < lvl) ui.mag.push(newMagBubble(ui.mag.length))
  if (ui.mag.length > lvl) ui.mag.length = lvl
  const types = ['shield', 'triple', 'rapid', 'speed', 'heart', 'nova']
  for (const b of ui.mag) {
    b.d -= dt * (0.32 + lvl * 0.1)
    if (b.d <= 0.1) {
      for (let i = 0; i < 8; i++) {
        const a = Math.random() * TAU
        ui.parts.push({ x: 0, y: -10, vx: Math.cos(a) * 120, vy: Math.sin(a) * 120 - 40, life: 0.45, c: POWERS[b.type].color, r: 2.5, star: false })
      }
      Object.assign(b, newMagBubble(Math.random() * 3))
      b.type = types[(Math.random() * types.length) | 0]
      continue
    }
    const R = 120
    const x = Math.cos(b.a) * b.d * R
    const y = Math.sin(b.a) * b.d * R * 0.8 + bob - 10
    if (b.d < 0.85) {
      ctx.strokeStyle = hexA(POWERS[b.type].color, 0.35 + 0.15 * Math.sin(ui.t * 20))
      ctx.lineWidth = 3
      ctx.setLineDash([6, 6])
      ctx.lineDashOffset = -ui.t * 60
      ctx.beginPath()
      ctx.moveTo(0, bob - 20)
      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
    drawBubble(ctx, x, y, 12, b.type, ui.t + b.a)
  }
}

function newMagBubble(i) {
  // from above and the sides, never from under the ship
  return { a: -Math.PI * (0.12 + ((i * 0.37 + Math.random() * 0.3) % 0.76)), d: 1.15, type: ['shield', 'rapid', 'triple'][i % 3] }
}
