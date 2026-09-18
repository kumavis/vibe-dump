// about.js — the about box.
//
// Half of this window is a spec sheet for a machine that does not exist, so
// every line in it has to be one the OS can actually answer for, and every
// one of them is read live rather than written down — the panel size
// included, now that the panel is whatever shape the window is.

import { el } from '../util.js'
import { icon } from '../icons.js'
import { markFor } from '../motifs.js'
import { ACCENTS } from '../theme.js'
import { SCREEN, aspectLabel } from '../screen.js'

const BUILD = 'build 0.9.4 "bai sema"'

const pad = (n) => String(Math.floor(n)).padStart(2, '0')
const mmss = (seconds) => `${pad(seconds / 60)}:${pad(seconds % 60)}`

export default {
  id: 'about',
  title: 'About This Machine',
  mark: 'lotus',
  // Sized to the card rather than guessed: 507px of content plus the title bar
  // and the hairlines. It cannot be resized, so anything that does not fit is
  // gone — and what did not fit was the closing sentence and the button that
  // sentence points at.
  width: 380,
  height: 552,
  minWidth: 380,
  minHeight: 552,
  resizable: false,

  mount(body, { win, shell }) {
    const prefs = shell.prefs
    const values = {}

    const spec = el('dl.about__spec')
    const row = (key, label) => {
      const dd = el('dd')
      values[key] = dd
      spec.append(el('dt', { text: label }), dd)
    }

    row('panel', 'Panel')
    row('theme', 'Theme')
    row('accent', 'Accent')
    row('windows', 'Windows open')
    row('uptime', 'Uptime')
    row('ornament', 'Ornament')

    // Live, because the panel is the window now and this is the one place on
    // the machine that ever says what it is running at.
    const showPanel = () => {
      values.panel.textContent = `${SCREEN.w} x ${SCREEN.h}, ${aspectLabel()}`
    }

    const card = el('div.about', [
      el('div.about__mark', { html: markFor('lotusMark'), 'aria-hidden': 'true' }),
      el('h1.about__name', { text: 'LOTUS OS' }),
      el('div.about__build', { text: BUILD }),
      spec,
      el('p.about__note', {
        text:
          'Nothing on this machine does anything useful, which was never the requirement. The one thing on it that is not a program is the button below this paragraph, and it does not open a window.',
      }),
      el('button.btn.btn--primary', { type: 'button', onclick: () => shell.reveal() }, [
        el('span', { html: icon('exec', { size: 15 }), 'aria-hidden': 'true' }),
        el('span', { text: 'Run reveal.run' }),
      ]),
    ])

    body.append(el('div.pane', [el('div.scroll', [card])]))

    function refresh() {
      const p = prefs.value
      const accent = ACCENTS[p.accent]
      values.theme.textContent = p.theme
      values.accent.textContent = accent ? `${accent.label.toLowerCase()}, hue ${accent.hue}` : p.accent
      values.windows.textContent = String(shell.wm.list().length)
      values.ornament.textContent = p.ornament ? 'on' : 'off'
    }

    // performance.now() is measured from page load, which is the only boot
    // this machine has ever had.
    const tick = () => {
      values.uptime.textContent = mmss(performance.now() / 1000)
      showPanel()
    }

    refresh()
    tick()

    const timer = setInterval(tick, 1000)
    const offPrefs = prefs.subscribe(refresh)
    const offShell = shell.subscribe((kind) => {
      if (kind === 'windows') refresh()
    })

    win.onDispose(() => {
      clearInterval(timer)
      offPrefs()
      offShell()
    })
  },
}
