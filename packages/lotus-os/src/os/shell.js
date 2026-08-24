// shell.js — the part of the OS that knows about everything else.
//
// Owns the filesystem index, the window manager, the preference store and the
// program registry, and hands all four to every program as one `shell` object.
// It is also the only module that knows the 3D room exists, and even then only
// as a promise it has not made yet.

import { createWM } from './wm.js'
import { createPrefs } from './theme.js'
import { index, TREE, iconFor } from './fs.js'
import { APPS } from './registry.js'
import { icon } from './icons.js'
import { el, clear, uid } from './util.js'
import { markFor } from './motifs.js'

export function createShell({ osEl, appbarEl, desktopEl, windowLayer, snapLayer, menuLayer, modalLayer, getScale, sfx }) {
  const prefs = createPrefs(osEl)
  const fs = index(TREE)
  const listeners = new Set()

  const wm = createWM({
    root: windowLayer,
    snapLayer,
    getScale,
    sfx,
    onChange: (windows, focused) => emit('windows', { windows, focused }),
  })

  function emit(kind, detail) {
    for (const fn of listeners) {
      try {
        fn(kind, detail)
      } catch (err) {
        console.warn('shell listener failed', err)
      }
    }
  }

  // --- programs -----------------------------------------------------------

  /**
   * Launch a registered program. `args` is passed through to mount(); `key`
   * lets a program open several windows that stay distinct (one per folder).
   */
  function launch(appId, args = {}, opts = {}) {
    const app = APPS[appId]
    if (!app) {
      notify(`No program named "${appId}".`, 'warn')
      return null
    }
    const key = opts.id ?? (app.singleton === false ? uid(appId) : app.key ? app.key(args) : appId)
    return wm.open({
      id: key,
      app: appId,
      title: typeof app.title === 'function' ? app.title(args) : app.title,
      mark: app.mark ? markFor(app.mark) : '',
      width: opts.width ?? app.width,
      height: opts.height ?? app.height,
      x: opts.x,
      y: opts.y,
      minWidth: app.minWidth,
      minHeight: app.minHeight,
      resizable: app.resizable,
      variant: app.variant,
      mount: (body, win) => app.mount(body, { win, shell, args }),
    })
  }

  /** Open a filesystem node with whatever program is right for its kind. */
  function open(node) {
    if (!node) return null
    switch (node.kind) {
      case 'folder':
        return launch('explorer', { path: node.path })
      case 'doc':
        return launch('reader', { path: node.path })
      case 'motif':
        return launch('motifs', { motif: node.motif, path: node.path })
      case 'app':
        return launch(node.app, {})
      case 'exec':
        return reveal()
      default:
        notify(`Nothing here knows how to open ${node.name}.`, 'warn')
        return null
    }
  }

  // --- notifications ------------------------------------------------------

  const toasts = el('div.toasts')
  modalLayer.append(toasts)

  function notify(text, tone = 'info', ms = 4200) {
    const node = el('div.toast', { data: { tone } }, [
      el('span.toast__mark', { html: markFor(tone === 'warn' ? 'kranok' : 'lotusSmall'), 'aria-hidden': 'true' }),
      el('span.toast__text', { text }),
    ])
    toasts.append(node)
    sfx?.play(tone === 'warn' ? 'warn' : 'blip')
    requestAnimationFrame(() => node.classList.add('is-in'))
    const die = () => {
      node.classList.remove('is-in')
      setTimeout(() => node.remove(), 260)
    }
    const timer = setTimeout(die, ms)
    node.addEventListener('click', () => {
      clearTimeout(timer)
      die()
    })
    return die
  }

  // --- modal sheets -------------------------------------------------------

  /**
   * A blocking sheet with an ornamental frame. Returns a promise for the id of
   * the chosen action, or null if dismissed.
   */
  function sheet({ title, body, actions = [{ id: 'ok', label: 'Very well' }], dismissable = true, variant = '' }) {
    return new Promise((resolve) => {
      const scrim = el('div.scrim')
      const card = el(`div.sheet${variant ? `.sheet--${variant}` : ''}`, { role: 'dialog', 'aria-modal': 'true' }, [
        el('div.sheet__crown', { html: markFor('crown'), 'aria-hidden': 'true' }),
        el('h2.sheet__title', { text: title }),
        typeof body === 'string' ? el('p.sheet__body', { text: body }) : el('div.sheet__body', [body]),
        el(
          'div.sheet__actions',
          actions.map((a) =>
            el(`button.btn${a.primary ? '.btn--primary' : ''}`, {
              type: 'button',
              text: a.label,
              onclick: () => done(a.id),
            }),
          ),
        ),
      ])
      const done = (id) => {
        scrim.classList.remove('is-in')
        setTimeout(() => scrim.remove(), 200)
        resolve(id)
      }
      if (dismissable) {
        scrim.addEventListener('click', (e) => {
          if (e.target === scrim) done(null)
        })
      }
      scrim.append(card)
      modalLayer.append(scrim)
      requestAnimationFrame(() => scrim.classList.add('is-in'))
      card.querySelector('.btn')?.focus?.()
      return scrim
    })
  }

  // --- the executable -----------------------------------------------------

  let revealing = false
  let workspace = null // the 3D room controller, once it has been paid for

  async function reveal() {
    if (revealing) return null
    if (workspace) return workspace.enter()
    revealing = true
    const { runReveal } = await import('./reveal.js')
    try {
      workspace = await runReveal({ shell, osEl })
      return workspace
    } catch (err) {
      console.error('reveal failed', err)
      await sheet({
        title: 'The room did not open',
        body:
          err && /webgl/i.test(String(err.message || err))
            ? 'This browser will not give the machine a 3D context, so the camera has nowhere to pull back to. The desktop still works.'
            : 'Something went wrong assembling the room. The desktop still works.',
        actions: [{ id: 'ok', label: 'Stay at the desk', primary: true }],
      })
      return null
    } finally {
      revealing = false
    }
  }

  const shell = {
    prefs,
    wm,
    fs,
    sfx,
    icon,
    iconFor,
    launch,
    open,
    notify,
    sheet,
    reveal,
    get workspace() {
      return workspace
    },
    layers: { osEl, appbarEl, desktopEl, windowLayer, menuLayer, modalLayer },
    node: (path) => fs.byPath.get(path),
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    emit,
  }

  return shell
}
