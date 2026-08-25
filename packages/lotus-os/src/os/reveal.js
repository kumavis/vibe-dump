// reveal.js — what happens when you double-click the executable.
//
// This used to put up a loader: a progress bar, a list of invented steps
// ("hanging the cables"), and a deliberate minimum hold so it could not flash
// past on a fast machine. That was the wrong instinct. The whole trick of this
// app is that the desktop turns out to be a monitor, and a modal card between
// the double-click and the camera move is an announcement that something is
// being fetched — which is precisely the thought the trick needs you not to be
// having.
//
// So the room is paid for in advance now, while the desktop sits idle and
// nobody has asked for anything: main.js calls the shell's prewarm on the first
// idle callback, and by the time anyone runs reveal.run the workspace usually
// already exists. This module then does nothing but fly the camera.
//
// The waiting card survives only for the case it was ever really for — a cold
// cache on a slow link — and it does not appear at all unless the wait crosses
// the threshold below.

import { el } from './util.js'
import { markFor } from './motifs.js'

// Below this, putting something up reads as a flicker and putting nothing up
// reads as instant.
const SHOW_AFTER = 260

// Worth knowing before anyone tries to make the card cover more: it can only
// ever appear while the room is DOWNLOADING. Assembling it is synchronous and
// holds the main thread, so a card raised against that phase is never painted —
// the timer below cannot fire until the assembly has finished, by which point
// the promise has already resolved and cancelled it. Measured: throttle the
// chunk and the card shows and clears correctly; let it arrive instantly and
// the whole wait is unpaintable assembly and nothing appears, which is the
// honest outcome rather than a bug. It is also why the prewarm matters more
// than this does — the prewarm moves that freeze to a moment when nobody is
// waiting on it.

/**
 * Fetch the room and assemble it, without entering it. Safe to call before
 * anyone has asked to reveal: createWorkspace leaves the layer switched off and
 * hidden until enter().
 */
export async function prepareRoom({ shell, osEl }) {
  const mod = await import('../scene/index.js')
  return mod.createWorkspace({ osEl, homeEl: document.getElementById('stage-wrap'), shell })
}

function showWaiting(shell) {
  const scrim = el('div.scrim.scrim--boot')
  scrim.append(
    el('div.sheet.sheet--boot', { role: 'status', 'aria-live': 'polite' }, [
      el('div.boot__mark', { html: markFor('gate'), 'aria-hidden': 'true' }),
      el('p.boot__note', { text: 'The camera is about to leave the screen. It will come back.' }),
    ]),
  )
  shell.layers.modalLayer.append(scrim)
  requestAnimationFrame(() => scrim.classList.add('is-in'))
  return scrim
}

function dismiss(scrim) {
  if (!scrim) return Promise.resolve()
  scrim.classList.remove('is-in')
  return new Promise((r) =>
    setTimeout(() => {
      scrim.remove()
      r()
    }, 220),
  )
}

export async function runReveal({ shell, build }) {
  const pending = build()
  let scrim = null
  const timer = setTimeout(() => {
    scrim = showWaiting(shell)
  }, SHOW_AFTER)
  try {
    const workspace = await pending
    clearTimeout(timer)
    await dismiss(scrim)
    await workspace.enter()
    return workspace
  } catch (err) {
    clearTimeout(timer)
    await dismiss(scrim)
    throw err
  }
}
