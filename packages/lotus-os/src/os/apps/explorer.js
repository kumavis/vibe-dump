// explorer.js — the file browser.
//
// One window per folder, and folders opened from inside a window walk that
// window instead of breeding a second one; the dedupe key is what keeps the
// two behaviours from fighting. Motif files are drawn with the actual
// ornament rather than a file icon, which is the only reason opening Wat is
// worth doing.

import { el, clear, bytes, clamp } from '../util.js'
import { icon } from '../icons.js'
import { KINDS, childrenOf, iconFor, sizeOf } from '../fs.js'
import { markFor, motifSVG } from '../motifs.js'

const PLACES = [
  { label: 'Root', path: '/', icon: 'drive' },
  { label: 'Wat', path: '/Wat', icon: 'image' },
  { label: 'Notes', path: '/Notes', icon: 'doc' },
  { label: 'Workbench', path: '/Workbench', icon: 'chip' },
  { label: 'System', path: '/System', icon: 'gear' },
]

const nameOf = (path) => path.split('/').filter(Boolean).pop() ?? 'Root'
const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`

const sizeText = (node) => {
  if (node.kind === 'folder') return plural(node.children.length, 'item')
  if (node.kind === 'doc') return bytes(sizeOf(node))
  return ''
}

export default {
  id: 'explorer',
  title: (args) => nameOf(args?.path ?? '/'),
  mark: 'kranok',
  width: 640,
  height: 440,
  minWidth: 340,
  minHeight: 220,
  key: (args) => `explorer:${args?.path ?? '/'}`,

  mount(body, { win, shell, args }) {
    let view = 'grid'
    let current = null
    let selected = null
    let items = []
    const trail = []

    // --- chrome -----------------------------------------------------------

    const places = el('nav.sidebar', { 'aria-label': 'Places' }, [el('div.sidebar__head', { text: 'Places' })])
    const placeBtns = PLACES.map((place) => {
      const btn = el('button.sidebar__item', { type: 'button', onclick: () => go(place.path) }, [
        el('span', { html: icon(place.icon, { size: 15 }), 'aria-hidden': 'true' }),
        el('span', { text: place.label }),
      ])
      places.append(btn)
      return { ...place, el: btn }
    })

    const backBtn = el('button.toolbar__btn', {
      type: 'button',
      title: 'Back',
      'aria-label': 'Back',
      html: icon('back', { size: 16 }),
      onclick: () => back(),
    })
    const upBtn = el('button.toolbar__btn', {
      type: 'button',
      title: 'Up one folder',
      'aria-label': 'Up one folder',
      html: icon('up', { size: 16 }),
      onclick: () => up(),
    })
    const crumbs = el('div.crumbs')
    const gridBtn = el('button.toolbar__btn.is-active', {
      type: 'button',
      title: 'Icons',
      'aria-label': 'Icons',
      html: icon('grid', { size: 15 }),
      onclick: () => setView('grid'),
    })
    const listBtn = el('button.toolbar__btn', {
      type: 'button',
      title: 'Details',
      'aria-label': 'Details',
      html: icon('list', { size: 15 }),
      onclick: () => setView('list'),
    })

    const toolbar = el('div.toolbar', [
      backBtn,
      upBtn,
      el('div.toolbar__sep', { 'aria-hidden': 'true' }),
      crumbs,
      el('div.toolbar__spacer'),
      gridBtn,
      listBtn,
    ])

    // tabindex so the arrow keys still have somewhere to land after a click
    // on empty space inside the folder.
    const scroll = el('div.scroll', { tabindex: '0' })

    const countEl = el('span')
    const selectedEl = el('span')
    const statusbar = el('div.statusbar', [countEl, el('div.statusbar__spacer'), selectedEl])

    body.append(el('div.pane.pane--split', [places, el('div.pane', [toolbar, scroll, statusbar])]))

    // --- rendering --------------------------------------------------------

    function renderPlaces() {
      for (const place of placeBtns) {
        const here =
          place.path === '/' ? current.path === '/' : current.path === place.path || current.path.startsWith(`${place.path}/`)
        place.el.classList.toggle('is-current', here)
      }
    }

    function renderCrumbs() {
      clear(crumbs)
      const chain = []
      for (let node = current; node; node = node.parent) chain.unshift(node)
      chain.forEach((node, i) => {
        const last = i === chain.length - 1
        crumbs.append(
          el(`button.crumb${last ? '.is-current' : ''}`, {
            type: 'button',
            text: node.parent ? node.name : 'Root',
            onclick: () => go(node.path),
          }),
        )
        if (!last) crumbs.append(el('span.crumb__sep', { text: '/', 'aria-hidden': 'true' }))
      })
    }

    const tileFor = (node) =>
      el(
        `button.tile${node.kind === 'motif' ? '.tile--motif' : ''}`,
        { type: 'button', role: 'option', title: node.caption ?? node.name, data: { path: node.path } },
        [
          el('div.tile__glyph', {
            // markFor() would answer with the app-bar mark for anything whose
            // name also lives in MARKS (kranok does), and that is the wrong
            // drawing at this size. The specimen first, the mark only as a net.
            html: node.kind === 'motif' ? motifSVG(node.motif) || markFor(node.motif) : icon(iconFor(node), { size: 32 }),
            'aria-hidden': 'true',
          }),
          el('div.tile__label', { text: node.name }),
        ],
      )

    const rowFor = (node) =>
      el(
        'button.row',
        { type: 'button', role: 'option', title: node.caption ?? node.name, data: { path: node.path } },
        [
          el('span.row__icon', { html: icon(iconFor(node), { size: 16 }), 'aria-hidden': 'true' }),
          el('span.row__name', { text: node.name }),
          el('span.row__kind', { text: KINDS[node.kind]?.label ?? '' }),
          el('span.row__size', { text: sizeText(node) }),
        ],
      )

    function renderItems() {
      clear(scroll)
      items = []
      const kids = childrenOf(current)
      if (!kids.length) {
        scroll.append(
          el('div.empty-note', { text: 'This folder is empty, which on a machine this small took some doing.' }),
        )
        updateStatus()
        return
      }
      const list = el(view === 'grid' ? 'div.grid-view' : 'div.list-view', {
        role: 'listbox',
        'aria-label': `Contents of ${current.parent ? current.name : 'Root'}`,
      })
      for (const node of kids) {
        const entry = view === 'grid' ? tileFor(node) : rowFor(node)
        entry.addEventListener('click', () => select(node))
        entry.addEventListener('dblclick', () => openNode(node))
        list.append(entry)
        items.push({ node, el: entry })
      }
      scroll.append(list)
      paintSelection()
      updateStatus()
    }

    function paintSelection() {
      for (const item of items) {
        const on = item.node === selected
        item.el.classList.toggle('is-selected', on)
        item.el.setAttribute('aria-selected', String(on))
      }
    }

    function updateStatus() {
      countEl.textContent = plural(items.length, 'item')
      selectedEl.textContent = selected ? selected.name : ''
    }

    // --- selection --------------------------------------------------------

    function select(node, { focus = true } = {}) {
      selected = node
      paintSelection()
      updateStatus()
      const item = items.find((i) => i.node === node)
      if (item && focus) {
        item.el.focus({ preventScroll: true })
        keepInView(item.el)
      }
    }

    // The panel is scaled to fit the page (and later to fit a monitor in a
    // room), so rect deltas come back in device pixels and have to be divided
    // back down before they mean anything to scrollTop.
    function keepInView(node) {
      const box = scroll.getBoundingClientRect()
      const scale = scroll.clientHeight > 0 ? box.height / scroll.clientHeight : 1
      const r = node.getBoundingClientRect()
      if (r.top < box.top) scroll.scrollTop -= (box.top - r.top) / scale + 8
      else if (r.bottom > box.bottom) scroll.scrollTop += (r.bottom - box.bottom) / scale + 8
    }

    // Auto-fill decides the row length, so the only honest way to know it is
    // to ask the layout how many tiles share the first one's top edge.
    function columnCount() {
      if (view !== 'grid' || items.length < 2) return 1
      const top = items[0].el.offsetTop
      let n = 0
      while (n < items.length && items[n].el.offsetTop === top) n++
      return Math.max(1, n)
    }

    function moveSelection(delta) {
      if (!items.length) return
      const at = items.findIndex((i) => i.node === selected)
      const next = at < 0 ? (delta > 0 ? 0 : items.length - 1) : clamp(at + delta, 0, items.length - 1)
      select(items[next].node)
    }

    scroll.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        openNode(selected)
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        up()
        return
      }
      const cols = columnCount()
      const delta =
        e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowDown' ? cols : e.key === 'ArrowUp' ? -cols : 0
      if (!delta) return
      e.preventDefault()
      moveSelection(delta)
    })

    // --- navigation -------------------------------------------------------

    function show(node, { push = true } = {}) {
      // Navigating destroys the element the focus was sitting on — a tile, or
      // the crumb that was just clicked — so the pane has to catch it again.
      // Only if it held it already, or the windows opened at boot would fight
      // over it.
      const active = document.activeElement
      const hadFocus = scroll === active || scroll.contains(active) || crumbs.contains(active)
      if (push && current && current !== node) trail.push(current.path)
      current = node
      selected = null
      win.setTitle(node.parent ? node.name : 'Root')
      backBtn.disabled = trail.length === 0
      upBtn.disabled = !node.parent
      renderPlaces()
      renderCrumbs()
      renderItems()
      scroll.scrollTop = 0
      if (hadFocus) scroll.focus({ preventScroll: true })
    }

    function go(path) {
      const node = shell.node(path)
      if (!node || node.kind !== 'folder') {
        shell.notify(`There is no folder at ${path}.`, 'warn')
        return
      }
      if (node === current) return
      show(node)
      shell.sfx?.play('blip')
    }

    function back() {
      const path = trail.pop()
      const node = path ? shell.node(path) : null
      backBtn.disabled = trail.length === 0
      if (!node) return
      show(node, { push: false })
      shell.sfx?.play('blip')
    }

    const up = () => current.parent && go(current.parent.path)

    const openNode = (node) => {
      if (!node) return
      if (node.kind === 'folder') go(node.path)
      else shell.open(node)
    }

    function setView(mode) {
      if (view === mode) return
      view = mode
      gridBtn.classList.toggle('is-active', mode === 'grid')
      listBtn.classList.toggle('is-active', mode === 'list')
      renderItems()
      revealSelection()
    }

    const revealSelection = () => {
      const item = items.find((i) => i.node === selected)
      if (item) keepInView(item.el)
    }

    // --- boot -------------------------------------------------------------

    const wanted = args?.path ?? '/'
    let start = shell.node(wanted)
    if (!start || start.kind !== 'folder') {
      shell.notify(`Nothing at ${wanted} that opens as a folder. Showing the root instead.`, 'warn')
      start = shell.node('/')
    }
    show(start, { push: false })

    return {
      onResize() {
        revealSelection()
      },
    }
  },
}
