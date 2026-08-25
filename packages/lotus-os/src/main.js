// main.js — boot.
//
// The machine is a fixed 1440x900 panel. In the page it is scaled to fit the
// viewport and surrounded by black; later, if you run the executable, that
// same panel is handed to a monitor in a room and the black around it turns
// out to have been a bezel all along. Nothing in the OS knows the difference,
// which is the whole trick: one DOM subtree, moved intact.

import { createShell } from './os/shell.js'
import { createAppBar } from './os/appbar.js'
import { createDesktop } from './os/desktop.js'
import { createSfx } from './os/sfx.js'
import { clamp } from './os/util.js'

export const SCREEN = { w: 1440, h: 900 }

const osEl = document.getElementById('os')
const stageWrap = document.getElementById('stage-wrap')
const appbarEl = document.getElementById('appbar')
const desktopEl = document.getElementById('desktop')
const windowLayer = document.getElementById('layer-windows')
const snapLayer = document.getElementById('layer-snap')
const menuLayer = document.getElementById('layer-menus')
const modalLayer = document.getElementById('layer-modals')

// --- fitting the panel into the page ---------------------------------------

function fit() {
  if (osEl.dataset.embodied === 'true') return // three.js owns the transform now
  const s = Math.min(window.innerWidth / SCREEN.w, window.innerHeight / SCREEN.h)
  stageWrap.style.transform = `translate(-50%, -50%) scale(${s})`
}

/**
 * How many device pixels one logical OS pixel currently occupies. The window
 * manager divides pointer deltas by this so drags track the cursor.
 *
 * Computed, not measured: getBoundingClientRect returns the axis-aligned box
 * of the *projected* element, which is not a uniform scale once the panel is
 * inside a monitor and tilted a few degrees back. It does not need to be —
 * pointer input is off while the panel is embodied — so answer honestly for
 * the case that matters and get out of the way for the one that does not.
 */
function getScale() {
  if (osEl.dataset.embodied === 'true') return 1
  return Math.min(window.innerWidth / SCREEN.w, window.innerHeight / SCREEN.h)
}

window.addEventListener('resize', () => {
  fit()
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
  shell.launch('reader', { path: '/read-me.txt' }, { width: 700, height: 456, x: 158, y: 56 })
  shell.launch(
    'explorer',
    { path: '/Wat' },
    { width: 528, height: 404, x: clamp(Math.round(w - 528 - 86), 0, w), y: clamp(Math.round(h - 404 - 88), 0, h) },
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
window.lotus = { shell, fit, getScale, SCREEN, osEl, stageWrap }
