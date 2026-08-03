// ---------------------------------------------------------------------------
// The DOM layer: HUD, shift banner, and the blueprint sheet.
//
// The sheet is the piece worth the trouble. Clicking the site office drops a
// rolled tube in from the top of the screen and the paper unrolls out of it —
// the roll rides the leading edge, the paper overshoots and settles, and it
// wobbles a degree or two on the way down like a real drawing being pulled out
// of its tube. The canvas is a fixed size; only the clipping window grows, so
// the ink never stretches.
// ---------------------------------------------------------------------------

import { blueprintSheetAspect, formatDuration } from './blueprint.js'
import { orders, CREWABLE, CREW_MIN, CREW_MAX } from './orders.js'
import { HOUSE_TYPES, PAINT, ROOFS } from './config.js'

const $ = (id) => document.getElementById(id)
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches

const clock = (s) => {
  const v = Math.max(0, Math.round(s))
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`
}

/** Ease-out with a touch of overshoot, then settle. */
function easeSettle(t) {
  if (t >= 1) return 1
  const e = 1 - Math.pow(1 - t, 2.6)
  return e + Math.sin(t * Math.PI) * 0.035
}

export function createUI({ onSheetOpen, onSheetClose } = {}) {
  const loading = $('loading')
  const loadFill = $('load-fill')
  const loadSub = $('load-sub')

  const el = {
    shiftNo: $('shift-no'),
    crewName: $('crew-name'),
    chipShift: $('chip-shift'),
    shiftLeft: $('shift-left'),
    phase: $('chip-phase'),
    eta: $('eta'),
    day: $('chip-day'),
    onSite: $('on-site'),
    fill: $('progress-fill'),
    count: $('progress-count'),
    rate: $('progress-rate'),
    hint: $('hint'),
    banner: $('banner'),
    bannerText: $('banner-text'),
    bannerSub: $('banner-sub'),
    backdrop: $('sheet-backdrop'),
    stage: $('sheet-stage'),
    wrap: $('sheet-wrap'),
    clip: $('sheet-clip'),
    roll: $('sheet-roll'),
    close: $('sheet-close'),
    follow: $('follow'),
    followRole: $('follow-role'),
    followDoing: $('follow-doing'),
    followSince: $('follow-since'),
    followHold: $('follow-hold'),
    followDrop: $('follow-drop'),
    orders: $('orders'),
    ordersOpen: $('orders-open'),
    ordersClose: $('orders-close'),
    speedSeg: $('speed-seg'),
    crewSteps: $('crew-steps'),
    crewSize: $('crew-size'),
    crewNote: $('crew-note'),
    housePick: $('house-pick'),
    paintPick: $('paint-pick'),
    roofPick: $('roof-pick'),
    plotNote: $('plot-note'),
    house: $('house'),
    houseTitle: $('house-title'),
    houseCount: $('house-count'),
    houseClose: $('house-close'),
    houseClear: $('house-clear'),
    houseRestore: $('house-restore'),
    houseList: $('house-list'),
  }
  const sheetCanvas = $('sheet-canvas')

  // --- sheet sizing --------------------------------------------------------
  let sheetW = 0
  let sheetH = 0

  function sizeSheet() {
    const aspect = blueprintSheetAspect()
    const padX = Math.min(84, innerWidth * 0.09)
    const padY = Math.min(96, innerHeight * 0.12)
    let w = innerWidth - padX
    let h = w / aspect
    if (h > innerHeight - padY) {
      h = innerHeight - padY
      w = h * aspect
    }
    // Portrait phones get a tall sheet rather than a postage stamp.
    if (innerWidth / innerHeight < 0.9) {
      w = innerWidth - Math.min(24, innerWidth * 0.06)
      h = Math.min(innerHeight - 110, w * 1.62)
    }
    sheetW = Math.max(240, Math.round(w))
    sheetH = Math.max(200, Math.round(h))
    const dpr = Math.min(devicePixelRatio || 1, 2)
    sheetCanvas.width = Math.round(sheetW * dpr)
    sheetCanvas.height = Math.round(sheetH * dpr)
    sheetCanvas.style.width = `${sheetW}px`
    sheetCanvas.style.height = `${sheetH}px`
    const ctx = sheetCanvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    el.wrap.style.width = `${sheetW}px`
  }
  sizeSheet()
  addEventListener('resize', sizeSheet)

  // --- unroll state machine ------------------------------------------------
  let phase = 'closed' // closed | dropping | unrolling | open | rolling
  let t = 0
  let reveal = 0
  let openedAt = 0
  // The unroll runs on its own wall clock. The render loop clamps its delta to
  // keep the simulation stable on a slow frame, and borrowing that clamped
  // value here stretched a 1.1 s animation out to four seconds.
  let lastTick = 0

  const OPEN_T = REDUCED ? 0.25 : 1.1
  const DROP_T = REDUCED ? 0.05 : 0.28
  const CLOSE_T = REDUCED ? 0.2 : 0.7

  function applySheet(r, wobble) {
    const visible = Math.max(0, Math.round(sheetH * r))
    el.clip.style.height = `${visible}px`
    el.roll.style.transform = `translateY(${visible}px) rotate(${wobble * 0.55}deg)`
    el.wrap.style.transform = `rotate(${wobble}deg)`
    el.roll.style.opacity = r > 0.995 ? '0' : '1'
  }

  function openSheet() {
    if (phase === 'open' || phase === 'unrolling' || phase === 'dropping') return
    showOrders(false)
    houseFns.close?.()
    sizeSheet()
    phase = 'dropping'
    t = 0
    lastTick = 0
    openedAt = performance.now()
    el.stage.classList.add('on')
    el.backdrop.classList.add('on')
    el.wrap.style.transform = 'none'
    applySheet(0, 0)
    el.roll.style.transform = 'translateY(-60px)'
    onSheetOpen?.()
  }

  function closeSheet() {
    if (phase === 'closed' || phase === 'rolling') return
    phase = 'rolling'
    t = 0
    lastTick = 0
    el.stage.classList.remove('open')
    el.backdrop.classList.remove('on', 'armed')
    onSheetClose?.()
  }

  function tick() {
    if (phase === 'closed') return
    const now = performance.now()
    const dt = lastTick ? Math.min(0.5, (now - lastTick) / 1000) : 0
    lastTick = now
    t += dt
    if (phase === 'dropping') {
      const k = Math.min(1, t / DROP_T)
      el.roll.style.opacity = '1'
      el.roll.style.transform = `translateY(${(-60 * (1 - k) ** 2).toFixed(1)}px)`
      if (k >= 1) {
        phase = 'unrolling'
        t = 0
      }
      reveal = 0
      return
    }
    if (phase === 'unrolling') {
      const k = Math.min(1, t / OPEN_T)
      reveal = Math.min(1, easeSettle(k))
      const wob = REDUCED ? 0 : Math.sin(k * 9) * (1 - k) * 1.5
      applySheet(reveal, wob)
      if (k >= 1) {
        phase = 'open'
        reveal = 1
        applySheet(1, 0)
        el.stage.classList.add('open')
        // Only now does the backdrop start swallowing clicks.
        el.backdrop.classList.add('armed')
      }
      return
    }
    if (phase === 'open') {
      reveal = 1
      return
    }
    if (phase === 'rolling') {
      const k = Math.min(1, t / CLOSE_T)
      reveal = Math.max(0, 1 - k * k)
      applySheet(reveal, 0)
      if (k >= 1) {
        phase = 'closed'
        reveal = 0
        el.stage.classList.remove('on')
      }
    }
  }

  /**
   * A tap that opens the sheet also fires a synthesised click a moment later,
   * and by then the backdrop is under the pointer — which used to shut the
   * sheet the instant it appeared. Ignore anything that arrives too soon.
   */
  const ghostClick = () => performance.now() - openedAt < 500

  el.close.addEventListener('click', (e) => {
    e.stopPropagation()
    if (ghostClick()) return
    closeSheet()
  })
  el.backdrop.addEventListener('click', () => {
    if (ghostClick()) return
    closeSheet()
  })
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    if (phase !== 'closed') closeSheet()
    else if (el.house.classList.contains('on')) houseFns.close?.()
    else showOrders(false)
  })

  // --- banner --------------------------------------------------------------
  let bannerTimer = 0
  function banner(text, subtext, accentCss) {
    el.bannerText.textContent = text
    el.bannerSub.textContent = subtext || ''
    el.banner.classList.add('on')
    if (accentCss) el.banner.querySelector('.banner-inner').style.borderColor = accentCss
    el.banner.classList.remove('klaxon')
    if (/shift/i.test(text)) {
      // restart the stripe sweep
      void el.banner.offsetWidth
      el.banner.classList.add('klaxon')
      el.chipShift.classList.remove('flash')
      void el.chipShift.offsetWidth
      el.chipShift.classList.add('flash')
    }
    clearTimeout(bannerTimer)
    bannerTimer = setTimeout(() => {
      el.banner.classList.remove('on', 'klaxon')
    }, 4000)
  }

  // --- hud -----------------------------------------------------------------
  let lastCount = ''
  function setHud(d) {
    el.shiftNo.textContent = `SHIFT ${d.shiftIndex}`
    el.crewName.textContent = d.crewName
    el.chipShift.style.borderLeftColor = d.crewAccent
    el.shiftLeft.textContent = clock(d.secondsToShiftChange)
    el.phase.textContent = d.phaseLabel
    el.eta.textContent = formatDuration(d.etaSeconds)
    el.day.textContent = `DAY ${d.day}`
    el.onSite.textContent = String(d.onSite)
    const key = `${d.placed}/${d.total}`
    if (key !== lastCount) {
      lastCount = key
      el.count.textContent = `${d.placed} / ${d.total} SET`
      el.fill.style.width = `${d.total ? (d.placed / d.total) * 100 : 0}%`
    }
    el.rate.textContent = `${(d.ratePerMin || 0).toFixed(1)} /min`
  }

  /** The card that rides along with whichever robot you tapped. */
  let onDropFollow = null
  let onHoldFollow = null
  function setFollow(d) {
    if (!d) {
      el.follow.classList.remove('on')
      return
    }
    el.follow.classList.add('on')
    el.followRole.textContent = d.leaving ? `${d.role} · off shift` : d.role
    el.followDoing.textContent = d.doing
    el.followSince.textContent = d.shiftsOn > 1
      ? `on since shift ${d.signedOn} · ${d.shiftsOn} shifts`
      : `signed on shift ${d.signedOn}`
    el.followHold.classList.toggle('on', !!d.held)
    el.followHold.textContent = d.held ? 'signed on indefinitely' : 'keep on next shift'
  }
  el.followHold.addEventListener('click', () => onHoldFollow?.())
  el.followDrop.addEventListener('click', () => {
    el.follow.classList.remove('on')
    onDropFollow?.()
  })

  // --- site orders ---------------------------------------------------------
  // The diorama runs itself; this panel is the handful of things you can lean
  // in and change. Everything it sets lives in orders.js — the panel only
  // renders that state and never touches the simulation directly.

  let ordersOn = false
  function showOrders(on) {
    ordersOn = on
    el.orders.classList.toggle('on', on)
    el.ordersOpen.setAttribute('aria-expanded', String(on))
  }
  el.ordersOpen.addEventListener('click', () => {
    if (!ordersOn) houseFns.close?.()
    showOrders(!ordersOn)
  })
  el.ordersClose.addEventListener('click', () => showOrders(false))

  for (const b of el.speedSeg.querySelectorAll('button')) {
    b.addEventListener('click', () => orders.setSpeed(Number(b.dataset.speed)))
  }

  const stepEls = {}
  for (const role of CREWABLE) {
    const row = document.createElement('div')
    row.className = 'step'
    const label = document.createElement('span')
    label.textContent = `${role}s`
    const less = document.createElement('button')
    less.type = 'button'
    less.textContent = '−'
    less.setAttribute('aria-label', `one fewer ${role}`)
    const val = document.createElement('b')
    const more = document.createElement('button')
    more.type = 'button'
    more.textContent = '+'
    more.setAttribute('aria-label', `one more ${role}`)
    less.addEventListener('click', () => orders.adjust(role, -1))
    more.addEventListener('click', () => orders.adjust(role, +1))
    row.append(label, less, val, more)
    el.crewSteps.append(row)
    stepEls[role] = { val, less, more }
  }

  const houseBtns = [{ label: 'AUTO', i: null }, ...HOUSE_TYPES.map((h, i) => ({ label: h.name, i }))]
    .map(({ label, i }) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = label
      b.addEventListener('click', () => orders.setHouse(orders.house === i ? null : i))
      el.housePick.append(b)
      return { b, i }
    })

  /**
   * A row of colours with a DEFAULT chip in front of it. Every control that
   * picks a colour gets one, so there is always a way back to whatever the
   * street would have chosen on its own.
   */
  function swatchRow(host, palette, get, set) {
    const btns = []
    const dflt = document.createElement('button')
    dflt.type = 'button'
    dflt.className = 'auto'
    dflt.textContent = 'DEFAULT'
    dflt.title = 'let the street choose'
    dflt.addEventListener('click', () => set(null))
    host.append(dflt)
    btns.push({ b: dflt, i: null })
    palette.forEach((p, i) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.title = p.name
      b.setAttribute('aria-label', p.name)
      b.style.background = `#${p.color.toString(16).padStart(6, '0')}`
      b.addEventListener('click', () => set(get() === i ? null : i))
      host.append(b)
      btns.push({ b, i })
    })
    return btns
  }

  const paintBtns = swatchRow(el.paintPick, PAINT, () => orders.paint, (i) => orders.setPaint(i))
  const roofBtns = swatchRow(el.roofPick, ROOFS, () => orders.roof, (i) => orders.setRoof(i))

  function renderOrders() {
    for (const b of el.speedSeg.querySelectorAll('button')) {
      b.classList.toggle('on', Number(b.dataset.speed) === orders.speed)
    }
    const counts = orders.counts
    const size = orders.crewSize
    for (const role of CREWABLE) {
      const s = stepEls[role]
      s.val.textContent = String(counts[role])
      s.less.disabled = !(counts[role] > 1 && size > CREW_MIN)
      s.more.disabled = !(counts[role] < 10 && size < CREW_MAX)
    }
    el.crewSize.textContent = `${size} strong`
    for (const { b, i } of houseBtns) b.classList.toggle('on', orders.house === i)
    for (const { b, i } of paintBtns) b.classList.toggle('on', orders.paint === i)
    for (const { b, i } of roofBtns) b.classList.toggle('on', orders.roof === i)
    const house = orders.house == null ? null : HOUSE_TYPES[orders.house].name
    const bits = []
    if (orders.paint != null) bits.push(`${PAINT[orders.paint].name.toLowerCase()} walls`)
    if (orders.roof != null) bits.push(`a ${ROOFS[orders.roof].name.toLowerCase()} roof`)
    el.plotNote.classList.toggle('live', !!(house || bits.length))
    el.plotNote.textContent = house && bits.length ? `next up: ${house}, ${bits.join(' and ')}`
      : house ? `next up: ${house}`
        : bits.length ? `next house gets ${bits.join(' and ')}`
          : 'the street carries on in order'
  }
  orders.onChange(renderOrders)
  renderOrders()

  // --- inside a finished house ---------------------------------------------
  // Tap a house that has been handed over and this opens with what is standing
  // in it. Everything here is a request back to the renderer, which owns the
  // meshes; the panel only ever renders what it is given.

  const houseFns = {}
  let houseRows = []
  function setHouse(d) {
    if (!d) {
      el.house.classList.remove('on')
      return
    }
    el.house.classList.add('on')
    el.houseTitle.textContent = d.title
    const inside = d.pieces.filter((p) => p.present).length
    el.houseCount.textContent = `${inside} of ${d.pieces.length} in`
    if (houseRows.length !== d.pieces.length) {
      el.houseList.textContent = ''
      houseRows = d.pieces.map((_, i) => {
        const row = document.createElement('div')
        row.className = 'furn-row'
        const prev = document.createElement('button')
        prev.type = 'button'
        prev.textContent = '‹'
        prev.title = 'a different piece'
        prev.addEventListener('click', () => houseFns.swap?.(i, -1))
        const name = document.createElement('b')
        const next = document.createElement('button')
        next.type = 'button'
        next.textContent = '›'
        next.title = 'a different piece'
        next.addEventListener('click', () => houseFns.swap?.(i, +1))
        const tint = document.createElement('button')
        tint.type = 'button'
        tint.className = 'tint'
        tint.title = 'a different finish'
        tint.addEventListener('click', () => houseFns.tint?.(i))
        const gone = document.createElement('button')
        gone.type = 'button'
        gone.className = 'gone'
        gone.textContent = '×'
        gone.title = 'in or out'
        gone.addEventListener('click', () => houseFns.toggle?.(i))
        row.append(name, prev, next, tint, gone)
        el.houseList.append(row)
        return { row, name, tint, gone }
      })
    }
    d.pieces.forEach((p, i) => {
      const r = houseRows[i]
      r.name.textContent = p.name
      r.row.classList.toggle('out', !p.present)
      r.tint.style.background = p.css
      r.gone.textContent = p.present ? '×' : '+'
    })
  }
  el.houseClose.addEventListener('click', () => houseFns.close?.())
  el.houseClear.addEventListener('click', () => houseFns.clear?.())
  el.houseRestore.addEventListener('click', () => houseFns.restore?.())

  /** Told by the renderer, because only it knows what the yard is up to. */
  function setCrewNote(text, live) {
    if (el.crewNote.textContent !== text) el.crewNote.textContent = text
    el.crewNote.classList.toggle('live', !!live)
  }

  function setLoading(fraction, subtitle) {
    if (subtitle) loadSub.textContent = subtitle
    loadFill.style.width = `${Math.min(1, Math.max(0, fraction)) * 100}%`
    if (fraction >= 1) loading.classList.add('done')
  }

  let hintShown = true
  function setHint(show) {
    if (show === hintShown) return
    hintShown = show
    el.hint.classList.toggle('gone', !show)
  }
  el.hint.addEventListener('click', () => {
    openSheet()
    setHint(false)
  })

  return {
    setLoading,
    setHud,
    openSheet,
    closeSheet,
    toggleSheet: () => (phase === 'closed' || phase === 'rolling' ? openSheet() : closeSheet()),
    isSheetOpen: () => phase !== 'closed',
    sheetCanvas,
    sheetSize: () => ({ w: sheetW, h: sheetH }),
    sheetReveal: () => reveal,
    banner,
    tick,
    setHint,
    setFollow,
    setCrewNote,
    setHouse,
    onHouse: (fns) => Object.assign(houseFns, fns),
    isHouseOpen: () => el.house.classList.contains('on'),
    onDropFollow: (fn) => (onDropFollow = fn),
    onHoldFollow: (fn) => (onHoldFollow = fn),
  }
}
