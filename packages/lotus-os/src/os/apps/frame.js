// frame.js — the program that runs somebody else's program.
//
// Every other window on this machine is drawn by this machine. This one is a
// hole: an iframe filling the window body with a whole separate page inside it,
// running its own event loop, its own renderer and its own idea of what a pixel
// is. The OS's job shrinks to being a window manager, which is what a window
// manager was always supposed to be.
//
// Four things need care once a document you did not write is inside a window
// you are dragging around:
//
//   focus     a click that lands inside the frame is a click this document
//             never sees, so the window would not raise. The panel losing focus
//             *to the frame element* is the same event seen from outside, and
//             it is the only signal there is.
//   drag      pointer capture keeps a title-bar drag alive over the frame, but
//             capture is taken on pointerdown and a fast grab can get its first
//             move in before then. The shield closes that gap; it also comes
//             down on a release anywhere, including outside the page, or a drag
//             ended off the edge would seal the frame over for good.
//   refusal   a host may forbid framing another origin at all. A refused frame
//             loads a browser error page, which fires `load` like a success and
//             then sits in the window looking like the neighbour crashed. Only
//             `securitypolicyviolation` says what really happened, so that is
//             what the failure card is built on — and it is the *only* thing
//             that can be known about a cross-origin frame from out here.
//   failure   an iframe reports a 404 as a successful load of a 404 page, and a
//             dev server that answers every unknown path with its own index
//             would put Lotus OS inside Lotus OS and call that a success. Both
//             are checked for rather than trusted.

import { el } from '../util.js'
import { icon } from '../icons.js'
import { EMBEDS, sourceFor } from '../embeds.js'

const specOf = (args) => EMBEDS[args?.embed] ?? null

// Read the geometry off the entry the same way the title is read off it, so a
// program showing a different page in every window can be a different shape in
// every window too.
const per = (key, fallback) => (args) => specOf(args)?.[key] ?? fallback

const PATIENCE_MS = 20000

export default {
  id: 'frame',
  // One window per neighbour. Two windows onto the same page would be two
  // copies of it running, which for anything with a renderer in it is rude.
  key: (args) => `frame:${args?.embed ?? '?'}`,
  title: (args) => specOf(args)?.title ?? 'Embedded Program',
  mark: (args) => specOf(args)?.mark ?? 'kranok',
  width: per('width', 1120),
  height: per('height', 740),
  minWidth: per('minWidth', 420),
  minHeight: per('minHeight', 300),

  mount(body, { win, shell, args }) {
    const embed = specOf(args)
    const pane = el('div.pane')
    body.append(pane)

    if (!embed) {
      pane.append(
        el('div.empty-note', {
          text: `The embed table has nothing called "${args?.embed ?? ''}", so there is no page to put in this window.`,
        }),
      )
      return
    }

    const { url, sameSite } = sourceFor(args.embed, embed)
    // Resolved once, here, so the toolbar link and the refusal check are talking
    // about the same address the frame actually went to.
    const href = new URL(url, document.baseURI).href
    const origin = new URL(href).origin
    const loadingText = `Loading ${embed.title.toLowerCase()}…`

    // --- chrome -----------------------------------------------------------

    const toolbar = el('div.toolbar', [
      el('button.toolbar__btn', {
        type: 'button',
        title: 'Reload this page',
        'aria-label': 'Reload this page',
        html: icon('refresh', { size: 15 }),
        onclick: () => load({ again: true }),
      }),
      el('span.toolbar__sep', { 'aria-hidden': 'true' }),
      el('span.toolbar__text', { text: sameSite ? url : origin, title: href }),
      el('span.toolbar__spacer'),
      el('a.toolbar__btn', {
        href,
        target: '_blank',
        rel: 'noopener',
        title: 'Open it on its own, outside the machine',
        'aria-label': 'Open outside',
        html: icon('external', { size: 15 }),
      }),
    ])

    const view = el('iframe.frame__view', {
      title: embed.title,
      // Its own program on its own machine. It may run and it may draw; there
      // is nothing on this side worth reaching for anyway.
      referrerpolicy: 'no-referrer',
      allow: 'fullscreen',
    })
    const shield = el('div.frame__shield', { 'aria-hidden': 'true' })
    const veil = el('div.frame__veil')
    const stage = el('div.frame', [view, shield, veil])
    pane.append(toolbar, stage)

    // --- what the host will and will not allow ----------------------------

    // A frame the policy refuses and a frame the network never answers look
    // identical from out here: both fire `load`, and both throw when you read
    // their location, because a browser error page has an opaque origin exactly
    // like a real cross-origin document does. This event is the only thing that
    // tells them apart, and it fires before the load does.
    let refusal = null
    const onRefusal = (ev) => {
      const directive = String(ev.effectiveDirective || ev.violatedDirective || '')
      if (!/^(frame-src|child-src|default-src)/.test(directive)) return
      const blocked = ev.blockedURI || ''
      if (blocked && !href.startsWith(blocked) && blocked !== origin) return
      refusal = directive
    }
    document.addEventListener('securitypolicyviolation', onRefusal)

    // --- loading ----------------------------------------------------------

    let settled = false
    let patience = 0

    function waiting() {
      settled = false
      stage.classList.remove('is-failed')
      veil.classList.remove('is-gone')
      veil.replaceChildren(el('span.frame__spinner', { 'aria-hidden': 'true' }), el('span', { text: loadingText }))
    }

    function fail(why) {
      settled = true
      clearTimeout(patience)
      stage.classList.add('is-failed')
      veil.classList.remove('is-gone')
      veil.replaceChildren(
        el('strong', { text: refusal ? 'This page is not allowed to show that one' : 'Nothing came back' }),
        el('span', { text: why }),
        el('a.frame__link', { href, target: '_blank', rel: 'noopener', text: 'Open it outside the machine' }),
      )
    }

    function succeed() {
      settled = true
      clearTimeout(patience)
      stage.classList.remove('is-failed')
      veil.classList.add('is-gone')
    }

    // Same-origin, so the frame's own document can be asked whether what
    // arrived is what was sent for. Cross-origin throws and is taken at its word.
    function wrongPage() {
      try {
        const doc = view.contentDocument
        if (!doc) return null
        if (doc.getElementById('os')) return 'this machine, again' // its own index, served as a fallback
        if (/^\s*[45]\d\d\b/.test(doc.title)) return doc.title.trim()
        return null
      } catch {
        return null
      }
    }

    view.addEventListener('load', () => {
      if (settled) return
      if (refusal) {
        return fail(
          `This viewer's security policy (${refusal}) will not let a page from ${origin} be shown inside it.`,
        )
      }
      const wrong = wrongPage()
      if (wrong) return fail(`${url} answered with ${wrong} instead of ${embed.title}.`)
      // A cross-origin host that is simply down is *not* checked for, on
      // purpose. Nothing readable from here separates its error page from a
      // real document — location throws for both, resource timing records both,
      // and responseStatus is zeroed for both — so any test would be a guess,
      // and a guess that fires on a working frame is worse than no test. The
      // browser's own "cannot reach this site" page is left to say it instead.
      succeed()
    })
    view.addEventListener('error', () => {
      if (!settled) fail('The page reported an error while loading.')
    })

    /**
     * Point the frame at the page. `again` reloads in place where the browser
     * will allow it — re-assigning the source works too, but going through the
     * frame's own history keeps a reload from being a fresh boot.
     */
    function load({ again = false } = {}) {
      waiting()
      refusal = null
      clearTimeout(patience)
      // A frame that never answers is worse than one that answers badly: there
      // is nothing on screen to read and nothing to click.
      patience = setTimeout(() => {
        if (settled) return
        if (refusal) {
          return fail(`This viewer's security policy (${refusal}) will not let a page from ${origin} be shown inside it.`)
        }
        fail('The page has not answered. It may not be there.')
      }, PATIENCE_MS)

      if (again) {
        try {
          view.contentWindow.location.reload()
          return
        } catch {
          // Cross-origin, or nothing loaded yet. Fall through and re-navigate.
        }
      }
      view.src = href
    }

    load()

    // --- focus, and keeping the gesture -----------------------------------

    const drop = () => shield.classList.remove('is-on')

    // The panel losing focus is both signals at once: the frame may have taken
    // it (raise the window), and the page may be losing the pointer with it
    // (let the shield down rather than leave it sealed).
    const onBlur = () => {
      drop()
      if (document.activeElement === view) win.focus()
    }

    // Capture phase on the panel, so the shield is up before the drag handler
    // that follows has done any work. A press that lands *inside* the frame
    // never reaches this document at all, so it cannot raise the shield.
    const raise = () => shield.classList.add('is-on')

    const os = shell.layers.osEl
    os.addEventListener('pointerdown', raise, true)
    // The release can land anywhere at all, so it is watched for on the window.
    window.addEventListener('pointerup', drop, true)
    window.addEventListener('pointercancel', drop, true)
    window.addEventListener('blur', onBlur)

    win.onDispose(() => {
      clearTimeout(patience)
      document.removeEventListener('securitypolicyviolation', onRefusal)
      os.removeEventListener('pointerdown', raise, true)
      window.removeEventListener('pointerup', drop, true)
      window.removeEventListener('pointercancel', drop, true)
      window.removeEventListener('blur', onBlur)
      // Drop the document before the node goes, so its renderer stops now
      // rather than whenever the frame is collected.
      view.src = 'about:blank'
    })
  },
}
