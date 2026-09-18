// main.js — boot.
//
// The machine's panel is the window: it is laid out at whatever size and shape
// the browser gives it, one logical pixel to one page pixel, edge to edge. If
// you then run the executable that same panel is handed to a monitor in a room
// — a monitor built to the shape the window happens to be — and the page's
// last frame and the monitor's first are the same picture. Nothing in the OS
// knows the difference, which is the whole trick: one DOM subtree, moved
// intact.
//
// The only survivor of the old fixed 1440x900 panel is a floor. Under a window
// too small to hold a desktop the panel stops shrinking and the page scales the
// whole layer down instead, which is why `scale` is still a thing that exists.

import { createShell } from './os/shell.js'
import { createAppBar } from './os/appbar.js'
import { createDesktop } from './os/desktop.js'
import { createSfx } from './os/sfx.js'
import { clamp } from './os/util.js'
import { SCREEN, measure, MIN } from './os/screen.js'

export { SCREEN, MIN }

const osEl = document.getElementById('os')
const stageWrap = document.getElementById('stage-wrap')
const appbarEl = document.getElementById('appbar')
const desktopEl = document.getElementById('desktop')
const windowLayer = document.getElementById('layer-windows')
const snapLayer = document.getElementById('layer-snap')
const menuLayer = document.getElementById('layer-menus')
const modalLayer = document.getElementById('layer-modals')
const osdEl = document.getElementById('osd')

// --- fitting the panel into the page ---------------------------------------

/**
 * Re-read the window and resize the panel to it.
 *
 * The size lives in two custom properties rather than in inline styles on the
 * elements, because #os is sized by them from wherever it currently is — in
 * the page, or inside a CSS3DObject in a monitor, where three.js owns its
 * `transform` and this code must not go near the element at all.
 *
 * Idempotent and cheap, so anything that suspects the panel may be stale can
 * just call it. The room does, on its own resize handler, rather than trusting
 * that this module's listener was registered first.
 */
function fit() {
  measure()
  const root = document.documentElement
  root.style.setProperty('--screen-w', `${SCREEN.w}px`)
  root.style.setProperty('--screen-h', `${SCREEN.h}px`)
  if (osEl.dataset.embodied === 'true') return // three.js owns the transform now
  stageWrap.style.transform = `translate(-50%, -50%) scale(${SCREEN.scale})`
}

/**
 * How many page pixels one logical OS pixel currently occupies. The window
 * manager divides pointer deltas by this so drags track the cursor. It is 1
 * in any window big enough to hold the machine, which is nearly all of them.
 *
 * Computed, not measured: getBoundingClientRect returns the axis-aligned box
 * of the *projected* element, which is not a uniform scale once the panel is
 * inside a monitor and tilted a few degrees back. It does not need to be —
 * pointer input is off while the panel is embodied — so answer honestly for
 * the case that matters and get out of the way for the one that does not.
 */
function getScale() {
  if (osEl.dataset.embodied === 'true') return 1
  return SCREEN.scale
}

/**
 * The monitor's own on-screen display, and the one piece of the illusion that
 * only exists while the illusion is running: it is shown when the panel is
 * inside the monitor and the window changes shape under it, because that is
 * the moment the thing on the desk has just been handed a new signal. In the
 * page it would only be the app captioning a window resize, which is noise.
 */
let osdTimer = 0
function flashOsd() {
  if (osEl.dataset.embodied !== 'true') return
  osdEl.textContent = `${SCREEN.w} \u00d7 ${SCREEN.h}`
  osdEl.classList.add('is-on')
  clearTimeout(osdTimer)
  osdTimer = setTimeout(() => osdEl.classList.remove('is-on'), 1400)
}

window.addEventListener('resize', () => {
  fit()
  flashOsd()
  shell.wm.reflow()
})
fit()

// --- boot -------------------------------------------------------------------

const sfx = createSfx(() => shell?.prefs.get('sound') ?? false)

const shell = createShell({
  osEl,
  appbarEl,
  desktopEl,
  windowLayer,
  snapLayer,
  menuLayer,
  modalLayer,
  getScale,
  sfx,
})

createAppBar({ root: appbarEl, shell, menuLayer })
createDesktop({ root: desktopEl, shell, menuLayer })

// Open a couple of things so the machine looks inhabited the moment it is
// switched on — an empty desktop is a screensaver, not a computer.
requestAnimationFrame(() => {
  const w = windowLayer.clientWidth
  const h = windowLayer.clientHeight
  // Sized against the panel rather than written down, because the panel is
  // whatever the window is: two windows that read as "a little one and a
  // medium one" at 1440x900 are a pair of postage stamps on a 5K display and
  // do not fit at all on the floor size.
  // The floors are not arbitrary: read-me.txt is hard-wrapped at about 72
  // columns and the Wat folder is a four-across grid, so below these the two
  // windows stop showing what they were opened to show.
  const rw = clamp(Math.round(w * 0.55), 620, 860)
  const rh = clamp(Math.round(h * 0.55), 320, 540)
  const ew = clamp(Math.round(w * 0.42), 440, 620)
  const eh = clamp(Math.round(h * 0.5), 300, 460)
  shell.launch('reader', { path: '/read-me.txt' }, { width: rw, height: rh, x: Math.round(w * 0.11), y: Math.round(h * 0.07) })
  shell.launch(
    'explorer',
    { path: '/Wat' },
    { width: ew, height: eh, x: clamp(Math.round(w - ew - 86), 0, w), y: clamp(Math.round(h - eh - 88), 0, h) },
  )
  osEl.classList.add('is-booted')

  // The room is a few hundred kilobytes and a few hundred milliseconds of
  // assembly. Spending both here, while the desktop is sitting there doing
  // nothing and nobody has asked for anything, is what lets reveal.run be a
  // camera move instead of a loading screen. Idle-scheduled so it cannot get in
  // front of the desktop becoming interactive, with a timeout so a browser that
  // never goes idle still gets there.
  const warm = () => shell.prewarmRoom()
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 2500 })
  else setTimeout(warm, 1200)
})

// Handy for poking at the machine from a console, and how the build's
// screenshot pass drives it.
window.lotus = { shell, fit, getScale, SCREEN, MIN, osEl, stageWrap }
