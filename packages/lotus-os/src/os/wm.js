// wm.js — the window manager.
//
// Windows live in a fixed 1440x900 logical screen, so every coordinate in here
// is in screen pixels and never in viewport pixels: the whole OS is scaled as
// one layer (by CSS in the page, by three.js once it is inside the monitor)
// and pointer deltas have to be divided back down by that scale before they
// mean anything. `getScale()` is how the manager finds out.

import { clamp, drag, el, uid, easeOutCubic, tween } from './util.js'

const GRIPS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
const SNAP_EDGE = 18 // px from a screen edge before a drag arms a snap zone

const CONTROL_GLYPH = {
  minimize: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5.5h6" /></svg>',
  maximize: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.4 2.4h5.2v5.2H2.4z" /></svg>',
  restore: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.8 3.6h4.6v4.6H1.8z" /><path d="M3.6 3.6V1.8h4.6v4.6H6.4" /></svg>',
  close: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.6 2.6l4.8 4.8M7.4 2.6L2.6 7.4" /></svg>',
}

export function createWM({ root, snapLayer, getScale = () => 1, onChange = () => {}, sfx = null }) {
  /** @type {Win[]} */
  const windows = []
  let zCounter = 10
  let focused = null
  let cascade = 0

  const bounds = () => ({ w: root.clientWidth, h: root.clientHeight })

  /** Viewport pixels to screen pixels. The panel is centred and scaled, so a
   *  raw clientX is off by the letterbox margin as well as by the scale. */
  const toLocal = (clientX, clientY) => {
    const r = root.getBoundingClientRect()
    const s = getScale() || 1
    return { x: (clientX - r.left) / s, y: (clientY - r.top) / s }
  }

  const notify = () => onChange(windows.slice(), focused)

  function focus(win) {
    if (!win || win.closing) return
    if (focused === win && win.state !== 'minimized') return
    focused = win
    win.z = ++zCounter
    win.el.style.zIndex = String(win.z)
    for (const w of windows) w.el.classList.toggle('is-focused', w === win)
    if (win.state === 'minimized') restore(win)
    notify()
  }

  function blurAll() {
    focused = null
    for (const w of windows) w.el.classList.remove('is-focused')
    notify()
  }

  // --- geometry -----------------------------------------------------------

  function place(win, rect, { animate = false } = {}) {
    Object.assign(win.rect, rect)
    const apply = () => {
      win.el.style.left = `${win.rect.x}px`
      win.el.style.top = `${win.rect.y}px`
      win.el.style.width = `${win.rect.w}px`
      win.el.style.height = `${win.rect.h}px`
    }
    if (animate) {
      win.el.classList.add('is-animating')
      apply()
      clearTimeout(win._animTimer)
      win._animTimer = setTimeout(() => {
        win.el.classList.remove('is-animating')
        win.emitResize()
      }, 260)
    } else {
      apply()
      win.emitResize()
    }
  }

  function maximize(win) {
    if (win.state === 'maximized') return
    win.restoreRect = { ...win.rect }
    win.state = 'maximized'
    win.el.classList.add('is-maximized')
    const b = bounds()
    place(win, { x: 0, y: 0, w: b.w, h: b.h }, { animate: true })
    win.setMaxGlyph(true)
    notify()
  }

  function restore(win) {
    const wasMin = win.state === 'minimized'
    // A window that was maximized when it was folded away comes back maximized.
    if (wasMin && win.preMinState === 'maximized') {
      win.preMinState = null
      win.state = 'normal'
      win.el.classList.remove('is-minimized')
      win.el.style.display = ''
      maximize(win)
      win.el.classList.add('is-unfolding')
      setTimeout(() => win.el.classList.remove('is-unfolding'), 240)
      return
    }
    win.preMinState = null
    win.state = 'normal'
    win.el.classList.remove('is-maximized', 'is-minimized')
    win.el.style.display = ''
    if (win.restoreRect) place(win, win.restoreRect, { animate: !wasMin })
    win.restoreRect = null
    win.setMaxGlyph(false)
    if (wasMin) {
      win.el.classList.add('is-unfolding')
      setTimeout(() => win.el.classList.remove('is-unfolding'), 240)
    }
    notify()
  }

  function toggleMax(win) {
    win.state === 'maximized' ? restore(win) : maximize(win)
  }

  function minimize(win) {
    if (win.state === 'minimized') return
    if (win.state !== 'maximized') win.restoreRect = { ...win.rect }
    // restore() only knows how to come back to a rect, so a maximized window
    // folded into the app bar would quietly return at its old size.
    win.preMinState = win.state
    win.state = 'minimized'
    win.el.classList.add('is-minimized')
    sfx?.play('fold')
    setTimeout(() => {
      if (win.state === 'minimized') win.el.style.display = 'none'
    }, 200)
    if (focused === win) {
      const next = windows.filter((w) => w !== win && w.state !== 'minimized').sort((a, b) => b.z - a.z)[0]
      focused = null
      next ? focus(next) : notify()
    } else notify()
  }

  function close(win) {
    if (win.closing) return
    win.closing = true
    win.el.classList.add('is-closing')
    sfx?.play('close')
    try {
      win.api?.onClose?.()
    } catch (err) {
      console.warn('window close handler failed', err)
    }
    for (const fn of win.disposers) {
      try {
        fn()
      } catch (err) {
        console.warn('window disposer failed', err)
      }
    }
    setTimeout(() => {
      win.el.remove()
      const i = windows.indexOf(win)
      if (i >= 0) windows.splice(i, 1)
      if (focused === win) {
        focused = null
        const next = windows.filter((w) => w.state !== 'minimized').sort((a, b) => b.z - a.z)[0]
        if (next) focus(next)
      }
      notify()
    }, 180)
  }

  // --- snap zones ---------------------------------------------------------

  function snapRectFor(zone) {
    const b = bounds()
    switch (zone) {
      case 'left':
        return { x: 0, y: 0, w: Math.round(b.w / 2), h: b.h }
      case 'right':
        return { x: Math.round(b.w / 2), y: 0, w: b.w - Math.round(b.w / 2), h: b.h }
      case 'top':
        return { x: 0, y: 0, w: b.w, h: b.h }
      default:
        return null
    }
  }

  function showSnapPreview(zone) {
    if (!snapLayer) return
    const rect = snapRectFor(zone)
    if (!rect) {
      snapLayer.classList.remove('is-on')
      return
    }
    snapLayer.classList.add('is-on')
    // snapRectFor() speaks window-layer coordinates, but the preview element is
    // positioned against the panel, which starts one app bar higher up.
    Object.assign(snapLayer.style, {
      left: `${rect.x + root.offsetLeft}px`,
      top: `${rect.y + root.offsetTop}px`,
      width: `${rect.w}px`,
      height: `${rect.h}px`,
    })
  }

  const hideSnapPreview = () => snapLayer?.classList.remove('is-on')

  // --- construction -------------------------------------------------------

  function open(spec) {
    const key = spec.id || uid('win')
    const existing = windows.find((w) => w.key === key && !w.closing)
    if (existing) {
      focus(existing)
      // A program that can walk — the explorer — wants to hear that it was
      // asked for again, so it can go where it was pointed rather than flinch.
      const handled = existing.api?.onReopen?.(spec.args) === true
      if (!handled) {
        existing.el.classList.add('is-nudged')
        setTimeout(() => existing.el.classList.remove('is-nudged'), 320)
      }
      return existing
    }

    const b = bounds()
    const w = clamp(spec.width ?? 640, spec.minWidth ?? 260, b.w)
    const h = clamp(spec.height ?? 420, spec.minHeight ?? 180, b.h)
    const step = 28
    const offset = (cascade++ % 6) * step
    const x = clamp(Math.round(spec.x ?? (b.w - w) / 2 - 110 + offset), 8, Math.max(8, b.w - w - 8))
    const y = clamp(Math.round(spec.y ?? (b.h - h) / 2 - 60 + offset), 8, Math.max(8, b.h - h - 8))

    const body = el('div.win__body')
    const titleEl = el('h2.win__title', { text: spec.title ?? 'Untitled' })
    const maxBtn = el('button.win__btn.win__btn--max', {
      type: 'button',
      title: 'Maximize',
      'aria-label': 'Maximize',
      html: CONTROL_GLYPH.maximize,
    })
    const minBtn = el('button.win__btn.win__btn--min', {
      type: 'button',
      title: 'Minimize',
      'aria-label': 'Minimize',
      html: CONTROL_GLYPH.minimize,
    })
    const closeBtn = el('button.win__btn.win__btn--close', {
      type: 'button',
      title: 'Close',
      'aria-label': 'Close',
      html: CONTROL_GLYPH.close,
    })

    const bar = el('header.win__bar', [
      el('span.win__mark', { html: spec.mark ?? '', 'aria-hidden': 'true' }),
      titleEl,
      el('div.win__actions', [minBtn, spec.resizable === false ? null : maxBtn, closeBtn]),
    ])

    const frame = el('div.win__frame', [
      bar,
      body,
      el('div.win__rule', { 'aria-hidden': 'true' }),
    ])

    const node = el('section.win', {
      role: 'dialog',
      'aria-label': spec.title ?? 'Window',
      style: { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` },
      data: { app: spec.app ?? '' },
    })
    if (spec.variant) node.classList.add(`win--${spec.variant}`)
    node.append(frame)
    if (spec.resizable !== false) {
      for (const g of GRIPS) node.append(el(`div.win__grip.win__grip--${g}`, { data: { grip: g } }))
    }

    /** @typedef {ReturnType<typeof makeWin>} Win */
    const win = {
      key,
      spec,
      el: node,
      body,
      rect: { x, y, w, h },
      restoreRect: null,
      state: 'normal',
      preMinState: null,
      z: 0,
      closing: false,
      disposers: [],
      api: null,
      focus: () => focus(win),
      close: () => close(win),
      minimize: () => minimize(win),
      toggleMax: () => toggleMax(win),
      setTitle: (t) => {
        titleEl.textContent = t
        notify()
      },
      get title() {
        return titleEl.textContent
      },
      setMaxGlyph: (isMax) => {
        maxBtn.innerHTML = isMax ? CONTROL_GLYPH.restore : CONTROL_GLYPH.maximize
        maxBtn.title = isMax ? 'Restore' : 'Maximize'
      },
      onDispose: (fn) => win.disposers.push(fn),
      emitResize: () => {
        const r = body.getBoundingClientRect()
        const s = getScale() || 1
        try {
          win.api?.onResize?.(r.width / s, r.height / s)
        } catch (err) {
          console.warn('window resize handler failed', err)
        }
      },
    }

    minBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      minimize(win)
    })
    maxBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      toggleMax(win)
    })
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      close(win)
    })
    node.addEventListener('pointerdown', () => focus(win), true)

    // --- drag the title bar ---
    let armedZone = null
    drag(bar, {
      onStart: (ev) => {
        if (ev.target.closest('.win__btn')) return false
        focus(win)
        armedZone = null
        const from = { ...win.rect }
        // Dragging a maximized window tears it back down to size, keeping the
        // grab point at the same fraction along the title bar.
        if (win.state === 'maximized') {
          const r = win.restoreRect ?? { w: Math.round(bounds().w * 0.6), h: Math.round(bounds().h * 0.7) }
          const px = toLocal(ev.clientX, ev.clientY).x
          const grabFrac = (px - win.rect.x) / win.rect.w
          restore(win)
          win.el.classList.remove('is-animating')
          const nx = clamp(Math.round(px - grabFrac * r.w), 0, Math.max(0, bounds().w - r.w))
          place(win, { x: nx, y: 0, w: r.w, h: r.h })
          return { ...win.rect }
        }
        return from
      },
      onMove: (dx, dy, ev, from) => {
        const s = getScale() || 1
        const b = bounds()
        const nx = clamp(Math.round(from.x + dx / s), -win.rect.w + 90, b.w - 90)
        const ny = clamp(Math.round(from.y + dy / s), 0, b.h - 34)
        place(win, { ...win.rect, x: nx, y: ny })

        const { x: px, y: py } = toLocal(ev.clientX, ev.clientY)
        const zone =
          spec.resizable === false
            ? null
            : px <= SNAP_EDGE
              ? 'left'
              : px >= b.w - SNAP_EDGE
                ? 'right'
                : py <= SNAP_EDGE
                  ? 'top'
                  : null
        if (zone !== armedZone) {
          armedZone = zone
          showSnapPreview(zone)
        }
      },
      onEnd: () => {
        hideSnapPreview()
        if (spec.resizable === false) {
          armedZone = null
          return
        }
        if (armedZone === 'top') {
          maximize(win)
        } else if (armedZone) {
          win.restoreRect = { ...win.rect }
          place(win, snapRectFor(armedZone), { animate: true })
          win.state = 'snapped'
          notify()
        }
        armedZone = null
      },
    })

    // A window that says it cannot be resized has no grips and no maximize
    // button, so these are the back doors into resizing it anyway.
    bar.addEventListener('dblclick', (ev) => {
      if (ev.target.closest('.win__btn')) return
      if (spec.resizable === false) return
      toggleMax(win)
    })

    // --- resize grips ---
    if (spec.resizable !== false) {
      for (const grip of node.querySelectorAll('.win__grip')) {
        const dir = grip.dataset.grip
        drag(grip, {
          onStart: () => {
            focus(win)
            if (win.state === 'maximized' || win.state === 'snapped') {
              win.state = 'normal'
              win.el.classList.remove('is-maximized')
              win.setMaxGlyph(false)
            }
            return { ...win.rect }
          },
          onMove: (dx, dy, ev, from) => {
            const s = getScale() || 1
            const b = bounds()
            const minW = spec.minWidth ?? 260
            const minH = spec.minHeight ?? 160
            let { x, y, w: ww, h: hh } = from
            const mx = dx / s
            const my = dy / s
            if (dir.includes('e')) ww = clamp(from.w + mx, minW, b.w - from.x)
            if (dir.includes('s')) hh = clamp(from.h + my, minH, b.h - from.y)
            if (dir.includes('w')) {
              const nw = clamp(from.w - mx, minW, from.x + from.w)
              x = from.x + from.w - nw
              ww = nw
            }
            if (dir.includes('n')) {
              const nh = clamp(from.h - my, minH, from.y + from.h)
              y = from.y + from.h - nh
              hh = nh
            }
            place(win, { x: Math.round(x), y: Math.round(y), w: Math.round(ww), h: Math.round(hh) })
          },
        })
      }
    }

    root.append(node)
    windows.push(win)
    focus(win)
    sfx?.play('open')

    node.classList.add('is-opening')
    setTimeout(() => node.classList.remove('is-opening'), 240)

    try {
      win.api = spec.mount?.(body, win) ?? null
    } catch (err) {
      console.error('app failed to mount', err)
      body.append(el('div.pane-error', { text: 'This program stopped responding.' }))
    }
    win.emitResize()
    notify()
    return win
  }

  // Re-flow anything that was pinned to an edge if the screen itself changes.
  function reflow() {
    const b = bounds()
    for (const win of windows) {
      if (win.state === 'maximized') place(win, { x: 0, y: 0, w: b.w, h: b.h })
      else {
        place(win, {
          ...win.rect,
          x: clamp(win.rect.x, -win.rect.w + 90, Math.max(0, b.w - 90)),
          y: clamp(win.rect.y, 0, Math.max(0, b.h - 34)),
        })
      }
    }
  }

  /** Fan the open windows out in a readable diagonal. */
  function cascadeAll() {
    const b = bounds()
    const open = windows.filter((w) => !w.closing)
    open.forEach((win, i) => {
      if (win.state === 'minimized') restore(win)
      win.state = 'normal'
      win.el.classList.remove('is-maximized')
      win.setMaxGlyph(false)
      const fixed = win.spec.resizable === false
      const w = fixed ? win.rect.w : Math.min(760, Math.round(b.w * 0.56))
      const h = fixed ? win.rect.h : Math.min(520, Math.round(b.h * 0.72))
      place(win, { x: 60 + i * 34, y: 40 + i * 30, w, h }, { animate: true })
      win.z = ++zCounter
      win.el.style.zIndex = String(win.z)
    })
    notify()
  }

  /** Grid-tile every open window. Reads better than cascade past three. */
  function tileAll() {
    const b = bounds()
    const open = windows.filter((w) => !w.closing && w.state !== 'minimized')
    if (!open.length) return
    const cols = Math.ceil(Math.sqrt(open.length))
    const rows = Math.ceil(open.length / cols)
    const gap = 10
    const cw = Math.floor((b.w - gap * (cols + 1)) / cols)
    const ch = Math.floor((b.h - gap * (rows + 1)) / rows)
    open.forEach((win, i) => {
      const c = i % cols
      const r = Math.floor(i / cols)
      win.state = 'normal'
      win.el.classList.remove('is-maximized')
      win.setMaxGlyph(false)
      const fixed = win.spec.resizable === false
      place(
        win,
        { x: gap + c * (cw + gap), y: gap + r * (ch + gap), w: fixed ? win.rect.w : cw, h: fixed ? win.rect.h : ch },
        { animate: true },
      )
    })
    notify()
  }

  const list = () => windows.filter((w) => !w.closing)
  const closeAll = () => list().forEach(close)

  return {
    open,
    focus,
    blurAll,
    close,
    minimize,
    toggleMax,
    restore,
    list,
    closeAll,
    cascadeAll,
    tileAll,
    reflow,
    get focused() {
      return focused
    },
  }
}
