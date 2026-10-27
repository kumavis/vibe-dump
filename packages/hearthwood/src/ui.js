// DOM HUD: stock, couriers, build menu, selection panel, wave, tier, hints, speed, toasts.
// OWNER: app implementer. Contract: ARCHITECTURE.md §17.1.
// No DOM access at import time. Every DOM write is diffed against a cached string, and the
// heavy panels (selection, build-menu affordability, tier, hints) refresh at ~5 Hz.

import {
  ITEM_COUNT, ITEM_SHIFT, TRAIN_QUEUE, U_COURIER, F_PLAYER, F_BLIGHT, UNIT_COUNT, TICK_RATE,
  BF_STORAGE, BF_PRODUCER, BF_EXTRACTOR, BF_DEN, BF_HALL, BF_TOWER, BF_SHRINE, BF_CORE,
  STATUS_NAMES, ORDER_NAMES, MSTATE_NAMES, JOB_NAMES, B_HEARTH, B_STOREHOUSE, J_NONE, BS_STARVED, BS_IDLE,
} from './constants.js'
import {
  BUILDINGS, UNITS, TIERS, WIN_TIER, ITEMS, ITEM_COLOR, BUILD_MENU, B_FLAGS, B_HP, B_STORAGE,
  B_SLOT_CAP, B_OUT_ITEM, U_HP, RESOURCES,
} from './content.js'
import { canAfford, setPaused, demolishBuilding } from './buildings.js'
import { enqueueTraining, cancelTraining } from './combat.js'
import { itemIconURL, buildingIconURL } from './sprites.js'
import {
  fmtClock, fmtCount, esc, stockVisible, offeringProgress, shrineId, HINTS, hintIndex, eventMessage, costText,
} from './app-hud.js'

/** @typedef {import('./game.js').Game} Game */
/** @typedef {import('./input.js').Input} Input */
/** @typedef {import('./overlay.js').Overlay} Overlay */

/**
 * @typedef {Object} UI
 * @property {() => void} update   per frame; rewrites only changed DOM (diff cached strings), heavy panels ~5 Hz
 * @property {(msg:string, kind?:'good'|'bad'|'info') => void} toast
 */

const HEAVY_EVERY = 12 // frames (~5 Hz at 60 fps)
const TOAST_MS = 4000
const TOAST_MAX = 5

// sprite helpers are owned by the render module; they may still be stubs -> fall back to CSS
const iconCache = new Map()
function safeIcon(kind, id) {
  const key = kind + id
  if (iconCache.has(key)) return iconCache.get(key)
  let url = ''
  try { url = kind === 'b' ? buildingIconURL(id, 40) : itemIconURL(id) } catch (_) { url = '' }
  if (typeof url !== 'string') url = ''
  iconCache.set(key, url)
  return url
}

/** Small item icon markup (img when the sprite module provides one, else a glowing dot). */
function itemIcon(item) {
  const url = safeIcon('i', item)
  if (url) return `<img class="ico" src="${url}" alt="">`
  return `<i class="dot" style="color:${ITEM_COLOR[item]};background:${ITEM_COLOR[item]}"></i>`
}
function unitDot(type) {
  const c = UNITS[type] ? UNITS[type].color : '#fff'
  return `<i class="dot" style="color:${c};background:${c}"></i>`
}
function bar(frac, cls) {
  const p = frac <= 0 ? 0 : frac >= 1 ? 100 : Math.round(frac * 100)
  return `<div class="bar${cls ? ' ' + cls : ''}"><i style="width:${p}%"></i></div>`
}

/**
 * Wire the HUD containers from index.html (#stock, #couriers, #tier, #wave, #speed, #hints,
 * #toasts, #selpanel, #buildmenu, #minimap clicks are handled in main.js/input.js).
 * @param {Document} doc
 * @param {Game} game
 * @param {Input & Record<string, any>} input
 * @param {Overlay} overlay
 * @returns {UI}
 */
export function createUI(doc, game, input, overlay) {
  const $ = (id) => {
    let el = doc.getElementById(id)
    if (!el) {
      el = doc.createElement('div')
      el.id = id
      const hud = doc.getElementById('hud') || doc.body
      hud.appendChild(el)
    }
    return el
  }
  const elStock = $('stock'), elCour = $('couriers'), elTier = $('tier'), elWave = $('wave'), elSpeed = $('speed')
  const elHints = $('hints'), elToasts = $('toasts'), elSel = $('selpanel'), elMenu = $('buildmenu')
  const elBottom = doc.getElementById('bottombar')
  const hud = doc.getElementById('hud') || doc.body

  let frame = 0
  let ctxSeen = null
  let evCursor = 0
  const lastToast = new Map()

  // ---------------------------------------------------------------- toasts
  function toast(msg, kind = 'info', tile) {
    const t = performance.now()
    const prev = lastToast.get(msg)
    if (prev !== undefined && t - prev < 1500) return
    lastToast.set(msg, t)
    if (lastToast.size > 64) lastToast.clear()
    const d = doc.createElement('div')
    d.className = 'toast ' + kind
    d.textContent = msg
    if (tile !== undefined && tile >= 0 && input.camera) {
      d.classList.add('clickable')
      d.title = 'Show'
      d.addEventListener('click', () => {
        const w = game.ctx.world
        input.camera.centerOn((tile & w.mask) + 0.5, (tile >> w.shift) + 0.5)
      })
    }
    elToasts.appendChild(d)
    while (elToasts.childElementCount > TOAST_MAX) elToasts.firstElementChild.remove()
    const h = setTimeout(() => d.remove(), TOAST_MS)
    if (h && typeof h === 'object' && h.unref) h.unref() // Node tests: never hold the process open
  }

  // ---------------------------------------------------------------- stock bar
  const stockEls = []
  const stockLast = new Int32Array(ITEM_COUNT).fill(-1)
  const stockVis = new Int8Array(ITEM_COUNT).fill(-1)
  elStock.textContent = ''
  for (let i = 1; i < ITEM_COUNT; i++) {
    const s = doc.createElement('span')
    s.className = 'stock-item'
    s.title = ITEMS[i].name
    s.innerHTML = itemIcon(i)
    const num = doc.createElement('b')
    num.textContent = '0'
    s.appendChild(num)
    elStock.appendChild(s)
    stockEls[i] = { root: s, num }
  }
  const capEl = doc.createElement('span')
  capEl.className = 'stock-cap'
  capEl.title = 'Goods in storage / storage capacity (Hearth + Storehouses)'
  elStock.appendChild(capEl)
  let capLast = ''

  function updateStock(ctx, heavy) {
    const tenHz = heavy || frame % 6 === 0
    for (let i = 1; i < ITEM_COUNT; i++) {
      const v = ctx.stock[i]
      if (heavy) {
        const vis = stockVisible(ctx, i) ? 1 : 0
        if (vis !== stockVis[i]) { stockVis[i] = vis; stockEls[i].root.hidden = !vis }
      }
      // ~10 Hz: at scale stock changes every tick, and each text change costs a top-bar layout
      if (tenHz && v !== stockLast[i]) { stockLast[i] = v; stockEls[i].num.textContent = fmtCount(v) }
    }
    if (heavy) {
      const B = ctx.buildings
      let used = 0
      for (const t of [B_HEARTH, B_STOREHOUSE]) {
        const list = B.typeList[t], n = B.typeCount[t]
        for (let j = 0; j < n; j++) used += B.invTotal[list[j]]
      }
      const s = fmtCount(used) + ' / ' + fmtCount(ctx.storeCap)
      if (s !== capLast) { capLast = s; capEl.textContent = s; capEl.classList.toggle('full', used >= ctx.storeCap * 0.95) }
    }
  }

  // ---------------------------------------------------------------- simple diffed text slots
  const cache = new Map()
  /** Friendlier status words: "starved" reads as a fault when goods are simply on the way. */
  function statusText(B, b, f) {
    const s = B.status[b]
    if (s === BS_STARVED) {
      if (f & BF_SHRINE) return 'awaiting offerings'
      return B.resInTotal[b] > 0 ? 'awaiting delivery' : 'waiting for input'
    }
    if (s === BS_IDLE && (f & BF_DEN)) return 'idle · enough couriers'
    return STATUS_NAMES[s]
  }

  function setHTML(el, html) {
    if (cache.get(el) === html) return false
    cache.set(el, html)
    el.innerHTML = html
    return true
  }

  function updateCouriers(ctx) {
    const n = ctx.units.typeCount[U_COURIER]
    const idle = ctx.log ? ctx.log.idleCount : 0
    const busy = ctx.log ? (ctx.log.busyCount || ctx.log.jobCount || 0) : 0
    setHTML(elCour, `<span title="Sprite couriers: total / cap">${unitDot(U_COURIER)} <b>${fmtCount(n)}</b><span class="dim">/${fmtCount(ctx.courierCap)}</span></span>` +
      ` <span class="dim" title="idle · hauling">${fmtCount(idle)} idle · ${fmtCount(busy)} hauling</span>`)
  }

  function updateTier(ctx) {
    const t = TIERS[ctx.tier]
    let html = `<span class="tier-name" title="Shrine tier">✦ ${esc(t ? t.name : '')}</span>`
    if (ctx.won || ctx.tier >= WIN_TIER) html += ' <span class="dim">awakened</span>'
    else if (shrineId(ctx) < 0) html += ' <span class="dim">· raise a Shrine <kbd>0</kbd></span>'
    else {
      const parts = offeringProgress(ctx)
      for (const p of parts) {
        html += ` <span class="offer${p.have >= p.need ? ' met' : ''}" title="${esc(ITEMS[p.item].name)} offered">${itemIcon(p.item)}${p.have}/${p.need}</span>`
      }
    }
    setHTML(elTier, html)
  }

  function updateWave(ctx) {
    const W = ctx.waves
    const blight = ctx.units.factionCount[F_BLIGHT]
    let html
    let warn = false
    if (!W || !W.enabled) html = '<span class="dim">peaceful</span>'
    else {
      const left = W.nextTick - ctx.tick
      warn = left < 30 * TICK_RATE
      html = `<span title="Next Blight wave (est. ${W.nextPoints | 0} strength)">wave ${W.number + 1} in <b>${fmtClock(left)}</b></span>`
    }
    if (blight > 0) { html += ` <span class="blight" title="Blight on the map">${unitDot(4)}${blight}</span>`; warn = true }
    setHTML(elWave, html)
    if (elWave.classList.contains('warn') !== warn) elWave.classList.toggle('warn', warn)
  }

  // ---------------------------------------------------------------- speed
  elSpeed.textContent = ''
  const speedBtns = []
  for (const [s, label, title] of [[0, '❚❚', 'Pause (Space)'], [1, '1×', 'Normal speed'], [2, '2×', 'Fast (=)'], [4, '4×', 'Fastest (=)']]) {
    const b = doc.createElement('button')
    b.textContent = label
    b.title = title
    b.tabIndex = -1
    b.addEventListener('click', () => { if (s === 0) game.togglePause(); else game.setSpeed(s); b.blur() })
    elSpeed.appendChild(b)
    speedBtns.push([s, b])
  }
  let speedKey = -1
  function updateSpeed() {
    const k = game.paused ? 0 : game.speed
    if (k === speedKey) return
    speedKey = k
    for (const [s, b] of speedBtns) b.classList.toggle('active', s === k)
    doc.body.classList.toggle('paused', game.paused)
  }

  // ---------------------------------------------------------------- build menu
  elMenu.textContent = ''
  const menuBtns = []
  for (const type of BUILD_MENU) {
    const d = BUILDINGS[type]
    const b = doc.createElement('button')
    b.className = 'build-btn'
    b.tabIndex = -1
    b.dataset.type = String(type)
    const url = safeIcon('b', type)
    const pic = url ? `<img class="bico" src="${url}" alt="">`
      : `<span class="swatch" style="--c:${d.color}">${esc(d.glyph)}</span>`
    let cost = ''
    for (const e of d.cost) cost += `<span>${itemIcon(e.item)}${e.qty}</span>`
    b.innerHTML = `<span class="key">${esc((d.hotkey || '').toUpperCase())}</span>${pic}<span class="cost">${cost}</span>`
    b.addEventListener('click', () => { input.beginPlace(type); b.blur() })
    b.addEventListener('pointerenter', () => showTip(b, type))
    b.addEventListener('pointerleave', hideTip)
    elMenu.appendChild(b)
    menuBtns.push({ b, type, locked: -1, poor: -1, active: -1 })
  }
  const tip = doc.createElement('div')
  tip.className = 'tooltip'
  tip.hidden = true
  hud.appendChild(tip)
  let tipType = 0, tipAnchor = null
  function tipHTML(type) {
    const ctx = game.ctx
    const d = BUILDINGS[type]
    let costs = ''
    for (const e of d.cost) {
      const ok = ctx.stock[e.item] >= e.qty
      costs += `<span class="${ok ? '' : 'short'}">${itemIcon(e.item)}${e.qty} ${esc(ITEMS[e.item].name)}</span>`
    }
    let extra = ''
    if (d.tier > ctx.tier) extra += `<div class="short">Needs tier ${d.tier} (${esc(TIERS[d.tier].name)})</div>`
    if (d.extractor) extra += `<div class="dim">Place within ${d.extractor.reach} tiles of ${esc(RESOURCES[d.extractor.res].name)}</div>`
    if (d.recipe && d.recipe.inputs.length) {
      let r = ''
      for (const s of d.recipe.inputs) r += `${s.qty}${itemIcon(s.item)} `
      r += '→ '
      for (const s of d.recipe.outputs) r += `${s.qty}${itemIcon(s.item)}`
      extra += `<div class="recipe">${r} <span class="dim">${(d.recipe.ticks / TICK_RATE).toFixed(1)} s</span></div>`
    }
    return `<b>${esc(d.name)}</b> <kbd>${esc((d.hotkey || '').toUpperCase())}</kbd><div>${esc(d.desc)}</div>` +
      `<div class="costs">${costs || '<span class="dim">free</span>'}</div>${extra}`
  }
  function showTip(anchor, type) {
    tipType = type; tipAnchor = anchor
    setHTML(tip, tipHTML(type))
    tip.hidden = false
    const r = anchor.getBoundingClientRect()
    const tw = tip.offsetWidth || 220, th = tip.offsetHeight || 80
    let x = r.left + r.width / 2 - tw / 2
    const vw = doc.documentElement.clientWidth || 1280
    if (x < 6) x = 6; else if (x + tw > vw - 6) x = vw - 6 - tw
    tip.style.left = x + 'px'
    tip.style.top = Math.max(6, r.top - th - 8) + 'px'
  }
  function hideTip() { tip.hidden = true; tipType = 0; tipAnchor = null }

  let menuOpen = null
  function updateMenu(ctx, heavy) {
    const open = input.buildMenuOpen !== false
    if (open !== menuOpen) {
      menuOpen = open
      if (elBottom) elBottom.hidden = !open
      else elMenu.hidden = !open
      if (!open) hideTip()
    }
    const placing = overlay.ghostType
    for (const m of menuBtns) {
      const a = placing === m.type ? 1 : 0
      if (a !== m.active) { m.active = a; m.b.classList.toggle('active', !!a) }
      if (!heavy) continue
      const d = BUILDINGS[m.type]
      const locked = d.tier > ctx.tier ? 1 : 0
      const poor = !locked && !canAfford(ctx, d.cost) ? 1 : 0
      if (locked !== m.locked) { m.locked = locked; m.b.classList.toggle('locked', !!locked) }
      if (poor !== m.poor) { m.poor = poor; m.b.classList.toggle('poor', !!poor) }
    }
    if (heavy && tipType && tipAnchor) setHTML(tip, tipHTML(tipType)) // diffed: no re-parse when unchanged
  }

  // ---------------------------------------------------------------- hints
  let hintsClosed = false
  function updateHints(ctx) {
    if (hintsClosed) { setHTML(elHints, ''); return }
    const i = hintIndex(ctx)
    if (i < 0) { setHTML(elHints, ''); return }
    setHTML(elHints, `<button class="x" data-act="hint-close" title="Hide hints" tabindex="-1">×</button>` +
      `<div class="hint"><span class="step">${i + 1}/${HINTS.length}</span> ${HINTS[i].html}</div>` +
      `<div class="controls dim">${['WASD pan', 'wheel zoom', 'drag select', 'right-click move', 'A attack-move', 'B build menu', 'Space pause']
        .join(' · ')}</div>`)
  }
  elHints.addEventListener('click', (e) => {
    const t = /** @type {HTMLElement} */ (e.target)
    if (t && t.closest && t.closest('[data-act="hint-close"]')) { hintsClosed = true; updateHints(game.ctx) }
  })

  // ---------------------------------------------------------------- selection panel
  const selHead = doc.createElement('div')
  const selBody = doc.createElement('div')
  selHead.className = 'sel-head'
  selBody.className = 'sel-body'
  elSel.textContent = ''
  elSel.appendChild(selHead)
  elSel.appendChild(selBody)
  let selDirty = true

  elSel.addEventListener('click', (e) => {
    const t = /** @type {HTMLElement} */ (e.target)
    const btn = t && t.closest ? t.closest('[data-act]') : null
    if (!btn) return
    const ctx = game.ctx
    const b = overlay.selBuilding
    const act = btn.getAttribute('data-act')
    if (act === 'pause' && b >= 0) setPaused(ctx, b, !ctx.buildings.paused[b])
    else if (act === 'demolish' && b >= 0) {
      const type = ctx.buildings.type[b]
      if (demolishBuilding(ctx, b)) { toast(BUILDINGS[type].name + ' demolished (50% refund)'); overlay.selBuilding = -1 }
      else toast('The Hearth cannot be demolished', 'bad')
    } else if (act === 'train' && b >= 0) {
      const ut = Number(btn.getAttribute('data-unit'))
      if (!enqueueTraining(ctx, b, ut)) {
        if (ctx.tier < UNITS[ut].tier) toast(UNITS[ut].name + ' needs tier ' + UNITS[ut].tier, 'bad')
        else if (ctx.buildings.trainLen[b] >= TRAIN_QUEUE) toast('Training queue full', 'bad')
        else toast('Not enough stock for ' + UNITS[ut].name, 'bad')
      }
    } else if (act === 'untrain' && b >= 0) cancelTraining(ctx, b)
    else if (act === 'hold') input.holdSelected()
    else if (act === 'stop') input.stopSelected()
    else if (act === 'focus') {
      const id = Number(btn.getAttribute('data-id'))
      const U = ctx.units
      if (U.alive[id] && input.camera) input.camera.centerOn(U.x[id], U.y[id])
    }
    btn.blur()
    selDirty = true
  })

  function buildingPanel(ctx, b) {
    const B = ctx.buildings
    const type = B.type[b]
    const d = BUILDINGS[type]
    const f = B_FLAGS[type]
    const o = b << ITEM_SHIFT
    // ---- head (static-ish: rebuilt only when it changes)
    let acts = ''
    if (f & (BF_PRODUCER | BF_DEN | BF_HALL)) acts += `<button data-act="pause" tabindex="-1">${B.paused[b] ? 'Resume' : 'Pause'} <kbd>P</kbd></button>`
    if (f & BF_HALL) {
      for (const ut of d.trains) {
        const u = UNITS[ut]
        const lock = ctx.tier < u.tier
        let c = ''
        for (const e of u.cost) c += `${itemIcon(e.item)}${e.qty}`
        acts += `<button data-act="train" data-unit="${ut}" tabindex="-1" class="${lock ? 'locked' : ''}" title="${esc(u.desc)}">${unitDot(ut)}${esc(u.name)} <span class="cost">${c}</span></button>`
      }
      if (B.trainLen[b] > 0) acts += '<button data-act="untrain" tabindex="-1" title="Cancel last (full refund)">✕ last</button>'
    }
    if (!(f & BF_CORE)) acts += '<button data-act="demolish" class="danger" tabindex="-1" title="Demolish (Delete): 50% refund">Demolish <kbd>Del</kbd></button>'
    const head = `<h3>${esc(d.name)}</h3><div class="actions">${acts}</div>`

    // ---- body (dynamic)
    const hp = B.hp[b], hpMax = B_HP[type]
    let body = `<div class="kv"><span>HP</span><span>${Math.ceil(hp)}/${hpMax}</span></div>${bar(hp / hpMax, 'hp')}`
    body += `<div class="kv"><span>Status</span><span class="st st${B.status[b]}">${statusText(B, b, f)}</span></div>`
    if (f & BF_STORAGE) {
      const cap = B_STORAGE[type]
      body += `<div class="kv"><span>Stored</span><span>${B.invTotal[b]}/${cap}</span></div>${bar(B.invTotal[b] / cap)}`
      let slots = ''
      for (let i = 1; i < ITEM_COUNT; i++) {
        const n = B.inv[o + i]
        if (n > 0 || B.resIn[o + i] > 0) slots += slot(i, n, 0, B.resIn[o + i], B.resOut[o + i])
      }
      body += `<div class="slots">${slots || '<span class="dim">empty</span>'}</div>`
    }
    if (f & BF_PRODUCER) {
      const rec = d.recipe
      let slots = ''
      for (const s of rec.inputs) slots += slot(s.item, B.inv[o + s.item], B_SLOT_CAP[(type << ITEM_SHIFT) | s.item], B.resIn[o + s.item], 0, s.qty)
      const out = B_OUT_ITEM[type]
      if (rec.inputs.length) slots += '<span class="arrow">→</span>'
      slots += slot(out, B.inv[o + out], B_SLOT_CAP[(type << ITEM_SHIFT) | out], 0, B.resOut[o + out])
      body += `<div class="slots">${slots}</div>`
      body += `<div class="kv"><span>Work</span><span>${(rec.ticks / TICK_RATE).toFixed(1)} s</span></div>${bar(B.progress[b] / rec.ticks)}`
      if (f & BF_EXTRACTOR) {
        const ex = d.extractor
        const n = ctx.world.countResource(B.tx[b], B.ty[b], B.w[b], B.h[b], ex.reach, ex.res)
        body += `<div class="kv"><span>${esc(RESOURCES[ex.res].name)}</span><span>${n} tiles in reach</span></div>`
      }
    }
    if (f & BF_DEN) {
      const sp = d.courierSpawn
      body += `<div class="kv"><span>Couriers</span><span>${ctx.units.typeCount[U_COURIER]}/${ctx.courierCap}</span></div>`
      body += `<div class="kv"><span>Next sprite</span><span>${costText(sp.cost)}</span></div>${bar(B.progress[b] / sp.ticks)}`
    }
    if (f & BF_HALL) {
      const len = B.trainLen[b]
      let q = ''
      for (let k = 0; k < len; k++) q += `<span class="slot">${unitDot(B.trainQ[b * TRAIN_QUEUE + k])}</span>`
      for (let k = len; k < TRAIN_QUEUE; k++) q += '<span class="slot empty"></span>'
      body += `<div class="slots queue">${q}</div>`
      if (len > 0) {
        const ut = B.trainQ[b * TRAIN_QUEUE]
        body += bar(B.progress[b] / Math.max(1, UNITS[ut].trainTicks))
      }
      body += `<div class="kv dim"><span>Rally</span><span>${B.rally[b] >= 0 ? 'set' : 'door'} · right-click to set</span></div>`
    }
    if (f & BF_TOWER) {
      const tw = d.tower
      body += `<div class="kv"><span>Range</span><span>${tw.range} tiles · ${tw.attack} dmg</span></div>`
    }
    if (f & BF_SHRINE) {
      const parts = offeringProgress(ctx)
      if (parts.length === 0) body += '<div class="good">The forest is awake.</div>'
      else {
        body += `<div class="kv"><span>Offering for ${esc(TIERS[ctx.tier + 1] ? TIERS[ctx.tier + 1].name : '')}</span><span></span></div>`
        let slots = ''
        for (const p of parts) slots += slot(p.item, p.have, p.need, B.resIn[o + p.item], 0)
        body += `<div class="slots">${slots}</div>`
      }
    }
    if (f & BF_CORE) body += `<div class="kv dim"><span>Couriers housed</span><span>+${d.courierCap}</span></div>`
    return [head, body]
  }

  function slot(item, n, cap, incoming, outgoing, perCycle) {
    let sub = ''
    if (incoming > 0) sub += `<i class="in" title="incoming">+${incoming}</i>`
    if (outgoing > 0) sub += `<i class="out" title="reserved for pickup">−${outgoing}</i>`
    const title = esc(ITEMS[item].name) + (perCycle ? ` (${perCycle} per cycle)` : '')
    return `<span class="slot" title="${title}">${itemIcon(item)}<b>${n}${cap ? `<small>/${cap}</small>` : ''}</b>${sub}</span>`
  }

  const typeCounts = new Int32Array(UNIT_COUNT)
  function unitPanel(ctx) {
    const U = ctx.units
    let n = 0, id0 = -1, hp = 0, hpMax = 0
    typeCounts.fill(0)
    for (let k = 0; k < overlay.selCount; k++) {
      const id = overlay.sel[k]
      if (!U.alive[id] || U.gen[id] !== overlay.selGen[k]) continue
      if (id0 < 0) id0 = id
      n++
      typeCounts[U.type[id]]++
      hp += U.hp[id]; hpMax += U_HP[U.type[id]]
    }
    if (n === 0) return null
    if (n === 1) {
      const id = id0
      const t = U.type[id]
      const u = UNITS[t]
      const mine = U.faction[id] === F_PLAYER
      let acts = ''
      if (mine && t !== U_COURIER) acts = '<button data-act="hold" tabindex="-1">Hold <kbd>H</kbd></button><button data-act="stop" tabindex="-1">Stop <kbd>X</kbd></button>'
      acts += `<button data-act="focus" data-id="${id}" tabindex="-1">Centre</button>`
      const head = `<h3>${unitDot(t)} ${esc(u.name)}${mine ? '' : ' <span class="blight">(Blight)</span>'}</h3><div class="actions">${acts}</div>`
      let body = `<div class="kv"><span>HP</span><span>${Math.ceil(U.hp[id])}/${U_HP[t]}</span></div>${bar(U.hp[id] / U_HP[t], 'hp')}`
      if (t === U_COURIER) {
        body += `<div class="kv"><span>Job</span><span>${JOB_NAMES[U.job[id]]}</span></div>`
        const ci = U.cargoItem[id], cq = U.cargoQty[id]
        body += `<div class="kv"><span>Cargo</span><span>${cq > 0 ? itemIcon(ci) + cq + ' ' + esc(ITEMS[ci].name) : '<span class="dim">empty</span>'} <span class="dim">/ ${u.cargo}</span></span></div>`
        if (U.job[id] !== J_NONE) {
          const B = ctx.buildings
          const s = U.jobSrc[id], dd = U.jobDst[id]
          const sn = s >= 0 && B.alive[s] ? BUILDINGS[B.type[s]].name : '—'
          const dn = dd >= 0 && B.alive[dd] ? BUILDINGS[B.type[dd]].name : '—'
          body += `<div class="kv"><span>Route</span><span>${esc(sn)} → ${esc(dn)}</span></div>`
          body += `<div class="kv"><span>Hauling</span><span>${itemIcon(U.jobItem[id])}${U.jobQty[id]}</span></div>`
        }
      } else {
        body += `<div class="kv"><span>Order</span><span>${ORDER_NAMES[U.order[id]]}</span></div>`
        body += `<div class="kv dim"><span>Attack</span><span>${u.attack} · range ${u.range}</span></div>`
      }
      body += `<div class="kv dim"><span>Moving</span><span>${MSTATE_NAMES[U.mstate[id]]}</span></div>`
      return [head, body]
    }
    let summary = ''
    for (let t = 1; t < UNIT_COUNT; t++) if (typeCounts[t]) summary += `<span class="slot">${unitDot(t)}<b>${typeCounts[t]}</b></span>`
    const head = `<h3>${n} selected</h3><div class="actions"><button data-act="hold" tabindex="-1">Hold <kbd>H</kbd></button><button data-act="stop" tabindex="-1">Stop <kbd>X</kbd></button></div>`
    const body = `<div class="slots">${summary}</div><div class="kv"><span>Health</span><span>${Math.round(hp / hpMax * 100)}%</span></div>${bar(hp / hpMax, 'hp')}` +
      '<div class="dim">Right-click: move · A + click: attack-move · Ctrl+Shift+1–9: set group · Shift+1–9: recall</div>'
    return [head, body]
  }

  let selShown = null
  function updateSel(ctx) {
    let parts = null
    const b = overlay.selBuilding
    if (b >= 0 && ctx.buildings.alive[b] && ctx.buildings.gen[b] === overlay.selBuildingGen) parts = buildingPanel(ctx, b)
    else if (overlay.selCount > 0) parts = unitPanel(ctx)
    const show = !!parts
    if (show !== selShown) { selShown = show; elSel.hidden = !show }
    if (!parts) return
    setHTML(selHead, parts[0])
    setHTML(selBody, parts[1])
  }

  // ---------------------------------------------------------------- banner (win / lose)
  let banner = null
  let bannerState = 0
  function updateBanner(ctx) {
    const st = ctx.won ? 1 : ctx.lost ? 2 : 0
    if (st === bannerState) return
    bannerState = st
    if (banner) { banner.remove(); banner = null }
    if (!st) return
    banner = doc.createElement('div')
    banner.id = 'banner'
    banner.className = st === 1 ? 'won' : 'lost'
    banner.innerHTML = `<h2>${st === 1 ? 'The forest awakens' : 'The Hearth has fallen'}</h2>` +
      `<p>${st === 1 ? 'Five Starbloom Relics shine on the Moonwell. The grove is safe.' : 'The Blight swallowed the grove.'}</p>` +
      '<div class="actions"><button data-act="again">New grove</button>' +
      (st === 1 ? '<button data-act="continue">Keep building</button>' : '') + '</div>'
    banner.addEventListener('click', (e) => {
      const t = /** @type {HTMLElement} */ (e.target)
      const a = t && t.getAttribute ? t.getAttribute('data-act') : null
      if (a === 'again') { game.reset(((game.seed || 1) + 1) >>> 0); game.paused = false }
      else if (a === 'continue') { banner.remove(); banner = null; game.paused = false }
    })
    hud.appendChild(banner)
  }

  // ---------------------------------------------------------------- perf line (F3 / ?debug)
  let perf = null
  function updatePerf(ctx) {
    const on = !!input.showPerf
    if (!on) { if (perf) perf.hidden = true; return }
    if (!perf) { perf = doc.createElement('div'); perf.id = 'perf'; hud.appendChild(perf) }
    perf.hidden = false
    const loop = input.loopStats || {}
    const ps = ctx.path && ctx.path.stats
    setHTML(perf, `${(loop.fps || 0).toFixed(0)} fps · frame ${(loop.frameMs || 0).toFixed(1)} ms · tick ${ctx.stats.tickMs.toFixed(2)} ms` +
      ` · units ${ctx.units.count} · bldg ${ctx.buildings.count} · jobs ${ctx.log ? ctx.log.jobCount : 0}` +
      (ps ? ` · path q ${ps.queued} hit ${ps.hits}/${ps.hits + ps.misses}` : ''))
  }

  // ---------------------------------------------------------------- events -> toasts
  function readEvents(ctx) {
    const ring = ctx.events
    for (let n = ring.since(evCursor); n < ring.written; n++) {
      const s = n & ring.mask
      const m = eventMessage(ctx, ring.type[s], ring.a[s], ring.b[s])
      if (m) toast(m.msg, m.kind, m.tile)
    }
    evCursor = ring.written
  }

  // ---------------------------------------------------------------- layout glue
  const elTop = doc.getElementById('topbar')
  let topH = -1
  /** Publish the top bar's real height (it wraps on narrow screens) for hints/toasts placement. */
  function measureTop() {
    if (!elTop || !hud.style || !hud.style.setProperty) return
    const h = elTop.offsetHeight | 0
    if (h > 0 && h !== topH) { topH = h; hud.style.setProperty('--topbar-h', h + 'px') }
  }

  // ---------------------------------------------------------------- per frame
  function update() {
    const ctx = game.ctx
    frame++
    if (ctx !== ctxSeen) {
      ctxSeen = ctx
      evCursor = ctx.events.written
      stockLast.fill(-1)
      stockVis.fill(-1)
      cache.clear()
      bannerState = -1
      selDirty = true
    }
    const heavy = frame % HEAVY_EVERY === 0 || selDirty || frame === 1
    // read layout BEFORE this frame's DOM writes (reading after them forces a sync layout)
    if (heavy) measureTop()
    updateStock(ctx, heavy)
    updateSpeed()
    updateMenu(ctx, heavy)
    readEvents(ctx)
    if (frame % 6 === 0 || heavy) updateWave(ctx)
    if (heavy) {
      updateCouriers(ctx)
      updateTier(ctx)
      updateHints(ctx)
      updateSel(ctx)
      updateBanner(ctx)
      updatePerf(ctx)
      selDirty = false
    }
  }

  /** Force the selection panel to refresh next frame (input calls this through hooks.onSelect). */
  function markSelection() { selDirty = true }

  return { update, toast, markSelection }
}
