// appbar.js — the bar across the top: mark, menus, the open-window strip,
// the theme and sound switches, and a clock that is finally correct.

import { el, clear, formatClock } from './util.js'
import { icon } from './icons.js'
import { markFor } from './motifs.js'

export function createAppBar({ root, shell, menuLayer }) {
  const prefs = shell.prefs
  let openMenu = null

  // --- menu model ---------------------------------------------------------

  const sep = { sep: true }
  const menus = () => [
    {
      id: 'lotus',
      mark: true,
      label: 'Lotus',
      items: [
        { label: 'About This Machine', icon: 'info', run: () => shell.launch('about') },
        { label: 'Appearance…', icon: 'gear', run: () => shell.launch('settings') },
        sep,
        { label: 'Run reveal.run', icon: 'exec', accent: true, run: () => shell.reveal() },
        sep,
        {
          label: prefs.get('sound') ? 'Silence the machine' : 'Let the machine speak',
          icon: prefs.get('sound') ? 'sound-off' : 'sound-on',
          run: () => prefs.toggle('sound'),
        },
      ],
    },
    {
      id: 'file',
      label: 'File',
      items: [
        { label: 'New Explorer Window', icon: 'folder', run: () => shell.launch('explorer', { path: '/' }, { id: `explorer:new:${Date.now()}` }) },
        { label: 'Terminal', icon: 'terminal', run: () => shell.launch('terminal') },
        { label: 'Motif Table', icon: 'image', run: () => shell.launch('motifs', {}) },
        sep,
        {
          label: 'Close Front Window',
          icon: 'x',
          disabled: !shell.wm.focused,
          run: () => shell.wm.focused?.close(),
        },
        { label: 'Close Everything', icon: 'power', disabled: !shell.wm.list().length, run: () => shell.wm.closeAll() },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        {
          label: prefs.get('theme') === 'dark' ? 'Daylight' : 'Nightfall',
          icon: prefs.get('theme') === 'dark' ? 'sun' : 'moon',
          run: () => prefs.toggleTheme(),
        },
        { label: 'Ornament', icon: 'eye', check: prefs.get('ornament'), run: () => prefs.toggle('ornament') },
        { label: 'Scanlines', icon: 'disc', check: prefs.get('scanlines'), run: () => prefs.toggle('scanlines') },
        sep,
        { label: 'Cascade Windows', icon: 'cascade', disabled: !shell.wm.list().length, run: () => shell.wm.cascadeAll() },
        { label: 'Tile Windows', icon: 'tile', disabled: !shell.wm.list().length, run: () => shell.wm.tileAll() },
      ],
    },
    {
      id: 'go',
      label: 'Go',
      items: [
        { label: 'Root', icon: 'drive', run: () => shell.launch('explorer', { path: '/' }) },
        sep,
        ...['/Wat', '/Notes', '/Workbench', '/System'].map((path) => ({
          label: path.slice(1),
          icon: 'folder',
          run: () => shell.launch('explorer', { path }),
        })),
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { label: 'Read Me', icon: 'doc', run: () => shell.open(shell.node('/read-me.txt')) },
        { label: 'Notes on the Ornament', icon: 'doc', run: () => shell.open(shell.node('/Wat/ornament.txt')) },
        sep,
        { label: 'What is reveal.run?', icon: 'exec', run: explainReveal },
      ],
    },
  ]

  function explainReveal() {
    shell.sheet({
      title: 'reveal.run',
      body:
        'It is not a program in the sense the others are. It does not open a window — it opens the room the window is in. ' +
        'The camera pulls back off this screen until you can see the monitor it has been playing on, and the desk under that. ' +
        'Everything on the bench is clickable. Click the monitor to come back.',
      actions: [
        { id: 'later', label: 'Not yet' },
        { id: 'run', label: 'Run it', primary: true },
      ],
    }).then((id) => id === 'run' && shell.reveal())
  }

  // --- rendering ----------------------------------------------------------

  const markBtn = el('button.appbar__mark', { type: 'button', 'aria-label': 'Lotus menu', html: markFor('lotusMark') })
  const menuStrip = el('nav.appbar__menus', { role: 'menubar' })
  const titleEl = el('span.appbar__title')
  const chipStrip = el('div.appbar__chips')
  const themeBtn = el('button.appbar__btn', { type: 'button' })
  const soundBtn = el('button.appbar__btn', { type: 'button' })
  const clockEl = el('button.appbar__clock', { type: 'button', title: 'The clock is correct now' })

  root.append(
    el('div.appbar__left', [markBtn, menuStrip]),
    el('div.appbar__center', [titleEl]),
    el('div.appbar__right', [chipStrip, el('span.appbar__rule', { 'aria-hidden': 'true' }), soundBtn, themeBtn, clockEl]),
  )

  function closeMenu() {
    openMenu = null
    clear(menuLayer)
    menuLayer.classList.remove('is-on')
    for (const b of root.querySelectorAll('.is-open')) b.classList.remove('is-open')
  }

  function showMenu(def, anchor) {
    closeMenu()
    openMenu = def.id
    anchor.classList.add('is-open')
    const rect = anchor.getBoundingClientRect()
    const parentRect = menuLayer.getBoundingClientRect()
    const scale = rect.width && anchor.offsetWidth ? rect.width / anchor.offsetWidth : 1

    const panel = el('div.menu', { role: 'menu' })
    for (const item of def.items) {
      if (item.sep) {
        panel.append(el('div.menu__sep', { html: markFor('rule'), 'aria-hidden': 'true' }))
        continue
      }
      const btn = el(`button.menu__item${item.accent ? '.menu__item--accent' : ''}`, {
        type: 'button',
        role: 'menuitem',
        disabled: item.disabled || false,
        onclick: () => {
          closeMenu()
          item.run?.()
        },
      }, [
        el('span.menu__icon', { html: icon(item.icon ?? 'doc', { size: 16 }), 'aria-hidden': 'true' }),
        el('span.menu__label', { text: item.label }),
        item.check !== undefined
          ? el('span.menu__check', { html: item.check ? icon('check', { size: 15 }) : '', 'aria-hidden': 'true' })
          : null,
      ])
      panel.append(btn)
    }

    // Position in the OS's own logical pixels, not the viewport's.
    panel.style.left = `${(rect.left - parentRect.left) / scale}px`
    panel.style.top = `${(rect.bottom - parentRect.top) / scale + 2}px`
    menuLayer.append(panel)
    menuLayer.classList.add('is-on')
    requestAnimationFrame(() => panel.classList.add('is-in'))
  }

  function renderMenus() {
    const defs = menus()
    clear(menuStrip)
    markBtn.onclick = (e) => {
      e.stopPropagation()
      openMenu === 'lotus' ? closeMenu() : showMenu(defs[0], markBtn)
    }
    markBtn.onpointerenter = () => openMenu && openMenu !== 'lotus' && showMenu(defs[0], markBtn)
    for (const def of defs.slice(1)) {
      const btn = el('button.appbar__menu', { type: 'button', role: 'menuitem', text: def.label })
      btn.onclick = (e) => {
        e.stopPropagation()
        openMenu === def.id ? closeMenu() : showMenu(def, btn)
      }
      btn.onpointerenter = () => openMenu && openMenu !== def.id && showMenu(def, btn)
      menuStrip.append(btn)
    }
  }

  function renderSwitches() {
    const dark = prefs.get('theme') === 'dark'
    themeBtn.innerHTML = icon(dark ? 'moon' : 'sun', { size: 17 })
    themeBtn.title = dark ? 'Nightfall — switch to daylight' : 'Daylight — switch to nightfall'
    themeBtn.setAttribute('aria-label', themeBtn.title)
    themeBtn.onclick = () => prefs.toggleTheme()

    const on = prefs.get('sound')
    soundBtn.innerHTML = icon(on ? 'sound-on' : 'sound-off', { size: 17 })
    soundBtn.title = on ? 'Sound on' : 'Sound off'
    soundBtn.setAttribute('aria-label', soundBtn.title)
    soundBtn.classList.toggle('is-off', !on)
    soundBtn.onclick = () => prefs.toggle('sound')
  }

  function renderChips(windows = shell.wm.list(), focused = shell.wm.focused) {
    clear(chipStrip)
    for (const win of windows) {
      const chip = el(
        `button.chip${win === focused ? '.is-active' : ''}${win.state === 'minimized' ? '.is-folded' : ''}`,
        { type: 'button', title: win.title, onclick: () => (win === focused && win.state !== 'minimized' ? win.minimize() : win.focus()) },
        [el('span.chip__dot', { 'aria-hidden': 'true' }), el('span.chip__label', { text: win.title })],
      )
      chipStrip.append(chip)
    }
    titleEl.textContent = focused && focused.state !== 'minimized' ? focused.title : 'Lotus OS'
    chipStrip.classList.toggle('is-empty', windows.length === 0)
  }

  function tickClock() {
    const { time, suffix, day } = formatClock()
    clear(clockEl).append(
      el('span.clock__day', { text: day }),
      el('span.clock__time', { text: time }),
      el('span.clock__suffix', { text: suffix }),
    )
  }

  clockEl.onclick = () => shell.notify('It is exactly as late as you think it is.', 'info', 2600)

  renderMenus()
  renderSwitches()
  renderChips()
  tickClock()
  setInterval(tickClock, 10_000)

  prefs.subscribe(() => {
    renderSwitches()
    if (openMenu) closeMenu()
  })
  shell.subscribe((kind, detail) => {
    if (kind === 'windows') renderChips(detail.windows, detail.focused)
  })

  window.addEventListener('pointerdown', (e) => {
    if (openMenu && !e.target.closest('.menu') && !e.target.closest('.appbar__menu') && !e.target.closest('.appbar__mark')) closeMenu()
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openMenu) closeMenu()
  })

  return { closeMenu, renderChips }
}
