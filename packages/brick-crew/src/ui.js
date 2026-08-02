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
    sizeSheet()
    phase = 'dropping'
    t = 0
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
    el.stage.classList.remove('open')
    el.backdrop.classList.remove('on')
    onSheetClose?.()
  }

  function tick(dt) {
    if (phase === 'closed') return
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

  el.close.addEventListener('click', (e) => {
    e.stopPropagation()
    closeSheet()
  })
  el.backdrop.addEventListener('click', closeSheet)
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet()
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
  }
}
