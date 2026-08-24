// reveal.js — what happens when you double-click the executable.
//
// The three.js room is a lazy import, so the first thing this does is put up
// something honest to look at while a couple of hundred kilobytes of renderer
// arrives. The loader is deliberately unhurried: it is the last thing anyone
// sees of the desktop before the desktop turns out to be a monitor.

import { el, clear } from './util.js'
import { markFor } from './motifs.js'

const STEPS = [
  'waking the panel',
  'measuring the room',
  'hanging the cables',
  'warming the nozzle',
  'lighting the lamp',
]

const MIN_VISIBLE = 1100 // do not let the loader flash past on a fast machine

export async function runReveal({ shell, osEl }) {
  const modalLayer = shell.layers.modalLayer
  const scrim = el('div.scrim.scrim--boot')
  const stepEl = el('p.boot__step', { text: STEPS[0] })
  const barFill = el('div.boot__fill')

  const card = el('div.sheet.sheet--boot', { role: 'status', 'aria-live': 'polite' }, [
    el('div.boot__mark', { html: markFor('gate'), 'aria-hidden': 'true' }),
    el('h2.sheet__title', { text: 'reveal.run' }),
    el('div.boot__bar', [barFill]),
    stepEl,
    el('p.boot__note', { text: 'The camera is about to leave the screen. It will come back.' }),
  ])
  scrim.append(card)
  modalLayer.append(scrim)
  requestAnimationFrame(() => scrim.classList.add('is-in'))

  const started = performance.now()
  let step = 0
  const stepTimer = setInterval(() => {
    step = Math.min(STEPS.length - 1, step + 1)
    stepEl.textContent = STEPS[step]
    barFill.style.width = `${18 + (step / (STEPS.length - 1)) * 62}%`
  }, 380)
  barFill.style.width = '18%'

  const done = () => {
    clearInterval(stepTimer)
    scrim.classList.remove('is-in')
    setTimeout(() => scrim.remove(), 220)
  }

  try {
    const mod = await import('../scene/index.js')
    const workspace = await mod.createWorkspace({
      osEl,
      homeEl: document.getElementById('stage-wrap'),
      shell,
    })

    barFill.style.width = '100%'
    stepEl.textContent = 'stand back'
    const waited = performance.now() - started
    if (waited < MIN_VISIBLE) await new Promise((r) => setTimeout(r, MIN_VISIBLE - waited))
    done()
    await new Promise((r) => setTimeout(r, 180))

    await workspace.enter()
    return workspace
  } catch (err) {
    done()
    throw err
  }
}
