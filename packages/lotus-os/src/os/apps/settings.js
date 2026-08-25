// settings.js — the Appearance panel.
//
// Every control here is a thin lever over shell.prefs and nothing else; the
// panel keeps no state of its own and reads everything back through
// prefs.subscribe(), so the app bar's theme button and this window can never
// drift apart. A change retoggles classes rather than rebuilding the panel,
// because the switch knobs slide and a freshly built knob has nothing to
// slide from.

import { el } from '../util.js'
import { icon } from '../icons.js'
import { ACCENTS } from '../theme.js'

const THEMES = [
  { value: 'dark', label: 'Nightfall', glyph: 'moon' },
  { value: 'light', label: 'Daylight', glyph: 'sun' },
]

// `motion` is stored as 'full' | 'reduced' rather than a boolean, so each
// switch carries its own read/write pair instead of the other three riding
// prefs.toggle() and this one quietly writing `false` into a string field.
const SWITCHES = [
  {
    label: 'Ornament',
    note: 'The wallpaper lattice and the gold marks in the window corners. Take it away and every window still opens, drags and closes, which was always the test.',
    read: (p) => p.ornament,
    write: (prefs, on) => prefs.set('ornament', on),
  },
  {
    label: 'Scanlines',
    note: 'Phosphor lines and one diagonal sheen across the glass. Nothing changes on this screen: the glass is only lit once the panel is inside the monitor at the end of reveal.run.',
    read: (p) => p.scanlines,
    write: (prefs, on) => prefs.set('scanlines', on),
  },
  {
    label: 'Sound',
    note: 'A small synth for windows opening, folding and closing. Nothing is downloaded, and the audio device stays untouched until the first sound is actually asked for.',
    read: (p) => p.sound,
    write: (prefs, on) => prefs.set('sound', on),
  },
  {
    label: 'Reduced motion',
    note: 'Flattens the desktop: windows arrive where they were going instead of travelling there. The camera flight in the room follows the browser setting, not this one.',
    read: (p) => p.motion === 'reduced',
    write: (prefs, on) => prefs.set('motion', on ? 'reduced' : 'full'),
  },
]

export default {
  id: 'settings',
  title: 'Appearance',
  mark: 'prajamYam',
  width: 520,
  height: 560,
  minWidth: 380,
  minHeight: 320,

  mount(body, { win, shell }) {
    const prefs = shell.prefs
    const syncers = []

    // --- theme ------------------------------------------------------------

    const themeBtns = THEMES.map((opt) => {
      const btn = el(
        'button.seg__btn',
        { type: 'button', onclick: () => prefs.set('theme', opt.value) },
        [
          el('span', { html: icon(opt.glyph, { size: 15 }), 'aria-hidden': 'true' }),
          el('span', { text: opt.label }),
        ],
      )
      syncers.push((p) => {
        const on = p.theme === opt.value
        btn.classList.toggle('is-on', on)
        btn.setAttribute('aria-pressed', String(on))
      })
      return btn
    })

    // --- accent -----------------------------------------------------------

    const accentHint = el('div.field__hint')

    const swatches = el(
      'div.swatches',
      Object.entries(ACCENTS).map(([key, accent]) => {
        const btn = el(
          'button.swatch',
          { type: 'button', title: accent.label, 'aria-label': accent.label, onclick: () => prefs.set('accent', key) },
          // The disc is built at a fixed lightness rather than from the live
          // token, so all four read as the same family of colour whichever
          // theme is up and whichever one is currently selected.
          [el('div.swatch__disc', { style: { background: `hsl(${accent.hue} 70% 58%)` } })],
        )
        syncers.push((p) => {
          const on = p.accent === key
          btn.classList.toggle('is-on', on)
          btn.setAttribute('aria-pressed', String(on))
        })
        return btn
      }),
    )

    syncers.push((p) => {
      accentHint.textContent = ACCENTS[p.accent]?.note ?? 'A hue nobody wrote a note for.'
    })

    // --- switches ---------------------------------------------------------

    const switches = SWITCHES.map((spec) => {
      const btn = el(
        'button.switch',
        {
          type: 'button',
          onclick: () => {
            spec.write(prefs, !spec.read(prefs.value))
            // Inaudible for three of the four, and for the fourth it is the
            // only honest way to say that sound is now on.
            shell.sfx?.play('blip')
          },
        },
        [
          el('div.switch__text', [el('div', { text: spec.label }), el('div.field__hint', { text: spec.note })]),
          el('div.switch__track', [el('div.switch__knob')]),
        ],
      )
      syncers.push((p) => {
        const on = spec.read(p)
        btn.classList.toggle('is-on', on)
        btn.setAttribute('aria-pressed', String(on))
      })
      return btn
    })

    // --- housekeeping -----------------------------------------------------

    const resetBtn = el('button.btn', {
      type: 'button',
      text: 'Reset preferences',
      onclick: () => {
        prefs.reset()
        shell.notify('Back to the defaults: nightfall, amethyst, ornament on, sound off.')
      },
    })

    const revealBtn = el('button.btn.btn--primary', { type: 'button', onclick: () => shell.reveal() }, [
      el('span', { html: icon('exec', { size: 15 }), 'aria-hidden': 'true' }),
      el('span', { text: 'Run reveal.run' }),
    ])

    // .field stacks; these two want to sit on one line and there is no class
    // in apps.css for a row of buttons.
    const buttonRow = el('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } }, [resetBtn, revealBtn])

    // --- assembly ---------------------------------------------------------

    const settings = el('div.settings', [
      el('div.field', [
        el('div.field__label', { text: 'Theme' }),
        el('div.seg', themeBtns),
        el('div.field__hint', {
          text: 'Nightfall is what the gold was drawn for. Daylight is the same building at noon, with the lamp off.',
        }),
      ]),
      el('div.field__rule', { 'aria-hidden': 'true' }),
      el('div.field', [el('div.field__label', { text: 'Accent' }), swatches, accentHint]),
      el('div.field__rule', { 'aria-hidden': 'true' }),
      el('div.field', [el('div.field__label', { text: 'Switches' }), ...switches]),
      el('div.field__rule', { 'aria-hidden': 'true' }),
      el('div.field', [
        el('div.field__label', { text: 'Housekeeping' }),
        buttonRow,
        el('div.field__hint', {
          text: 'Preferences live in this browser and nowhere else. If it refuses to store them, the machine forgets between visits and everything above still works.',
        }),
      ]),
    ])

    body.append(el('div.pane', [el('div.scroll', [settings])]))

    const refresh = () => {
      const p = prefs.value
      for (const fn of syncers) fn(p)
    }

    refresh()
    win.onDispose(prefs.subscribe(refresh))
  },
}
