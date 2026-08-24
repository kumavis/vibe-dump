// desktop.js — the icon field, the wallpaper it sits on, and the right-click
// menu nobody expects a toy to have.

import { el, clear } from './util.js'
import { icon } from './icons.js'
import { childrenOf, iconFor } from './fs.js'
import { markFor, wallpaperSVG } from './motifs.js'

export function createDesktop({ root, shell, menuLayer }) {
  const wallpaper = el('div.wallpaper', { 'aria-hidden': 'true' })
  const field = el('div.icons', { role: 'listbox', 'aria-label': 'Desktop' })
  root.append(wallpaper, field)

  let selected = null

  function paintWallpaper() {
    wallpaper.innerHTML = wallpaperSVG({
      theme: shell.prefs.get('theme'),
      ornament: shell.prefs.get('ornament'),
    })
  }

  function select(node, cell) {
    selected = node
    for (const c of field.querySelectorAll('.icon-cell')) c.classList.remove('is-selected')
    cell?.classList.add('is-selected')
  }

  function renderIcons() {
    clear(field)
    const root_ = shell.node('/')
    for (const node of childrenOf(root_)) {
      const isExec = node.kind === 'exec'
      const cell = el(
        `div.icon-cell${isExec ? '.icon-cell--exec' : ''}`,
        {
          role: 'option',
          tabindex: '0',
          title: node.caption ?? node.name,
          data: { path: node.path },
        },
        [
          el('div.icon-cell__glyph', {
            html: isExec ? markFor('gate') : icon(iconFor(node), { size: 34, stroke: 1.2 }),
            'aria-hidden': 'true',
          }),
          el('div.icon-cell__label', { text: node.name }),
        ],
      )

      cell.addEventListener('click', () => select(node, cell))
      cell.addEventListener('dblclick', () => shell.open(node))
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          shell.open(node)
        }
      })
      field.append(cell)
    }
  }

  // --- desktop context menu ----------------------------------------------

  // The menu layer covers the whole panel and takes pointer events while it is
  // up, so a menu with no way to dismiss it does not merely linger — it locks
  // the machine. These come off again in close().
  let dismiss = null

  function contextMenu(x, y) {
    close()
    menuLayer.classList.add('is-on')
    const items = [
      { label: 'New Explorer Window', icon: 'folder', run: () => shell.launch('explorer', { path: '/' }, { id: `explorer:new:${Date.now()}` }) },
      { label: 'Terminal', icon: 'terminal', run: () => shell.launch('terminal') },
      { sep: true },
      { label: 'Appearance…', icon: 'gear', run: () => shell.launch('settings') },
      {
        label: shell.prefs.get('theme') === 'dark' ? 'Daylight' : 'Nightfall',
        icon: shell.prefs.get('theme') === 'dark' ? 'sun' : 'moon',
        run: () => shell.prefs.toggleTheme(),
      },
      { sep: true },
      { label: 'Run reveal.run', icon: 'exec', accent: true, run: () => shell.reveal() },
    ]
    const panel = el('div.menu.menu--context', { role: 'menu' })
    for (const item of items) {
      if (item.sep) {
        panel.append(el('div.menu__sep', { html: markFor('rule'), 'aria-hidden': 'true' }))
        continue
      }
      panel.append(
        el(`button.menu__item${item.accent ? '.menu__item--accent' : ''}`, {
          type: 'button',
          role: 'menuitem',
          onclick: () => {
            close()
            item.run()
          },
        }, [
          el('span.menu__icon', { html: icon(item.icon, { size: 16 }), 'aria-hidden': 'true' }),
          el('span.menu__label', { text: item.label }),
        ]),
      )
    }
    panel.style.left = `${Math.min(x, 1440 - 240)}px`
    panel.style.top = `${Math.min(y, 900 - 260)}px`
    menuLayer.append(panel)
    requestAnimationFrame(() => panel.classList.add('is-in'))

    const onDown = (e) => {
      if (!e.target.closest('.menu')) close()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    // Capture, so the menu is torn down before the contextmenu event that
    // follows a second right-click reaches the desktop and reopens it there.
    window.addEventListener('pointerdown', onDown, true)
    window.addEventListener('keydown', onKey)
    dismiss = () => {
      window.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('keydown', onKey)
      dismiss = null
    }
  }

  const close = () => {
    dismiss?.()
    clear(menuLayer)
    menuLayer.classList.remove('is-on')
  }

  root.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.win')) return
    e.preventDefault()
    // #desktop starts below the app bar but the menu layer covers the whole
    // panel, so the bar's height has to be added back on.
    const box = root.getBoundingClientRect()
    const scale = box.width / root.offsetWidth || 1
    const barH = parseFloat(getComputedStyle(root).getPropertyValue('--bar-h')) || 40
    contextMenu((e.clientX - box.left) / scale, (e.clientY - box.top) / scale + barH)
  })

  root.addEventListener('pointerdown', (e) => {
    if (e.target === root || e.target === wallpaper || e.target === field) {
      select(null, null)
      shell.wm.blurAll()
    }
  })

  paintWallpaper()
  renderIcons()
  shell.prefs.subscribe((_, changed) => {
    if (changed === 'theme' || changed === 'ornament' || changed === 'accent' || changed === '*') paintWallpaper()
  })

  return { renderIcons, paintWallpaper, closeContextMenu: close }
}
