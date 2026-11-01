// The launcher (design §18.1, ARCHITECTURE §7): what a bare URL shows instead
// of planting a world at once. Your worlds (this browser's recent list), New
// world (one card per template), Open a file (.automerge import) and Paste a
// link. Plain DOM in the app's dark theme, before the repo, the scene or the
// editor exist; every title from storage or a doc goes in with textContent.
// Stable ids: #launcher, #launch-new, #launch-template-<name>, #launch-recent,
// #launch-open-file, #launch-link.
import { h } from './dom.js'
import { parseLink, buildLink, normalizeDocUrl, DEFAULT_SYNC } from '../net/link.js'

// ---- pure helpers (unit-tested in Node)

const fragmentOf = (s) => { const i = String(s ?? '').indexOf('#'); return i >= 0 ? String(s).slice(i + 1) : String(s ?? '') }

// '#new=<template>[&sync=…]' -> the template name ('' when none)
export function newTemplateOf (hash) {
  try { return (new URLSearchParams(fragmentOf(hash)).get('new') ?? '').trim() } catch { return '' }
}

// "how long ago", coarse and short
export function relativeTime (at, now = Date.now()) {
  const t = Number(at)
  if (!Number.isFinite(t) || t <= 0) return 'some time ago'
  const s = Math.max(0, Math.round((now - t) / 1000))
  if (s < 45) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const hr = Math.round(m / 60)
  if (hr < 24) return `${hr} h ago`
  const d = Math.round(hr / 24)
  if (d === 1) return 'yesterday'
  if (d < 30) return `${d} days ago`
  try { return `on ${new Date(t).toISOString().slice(0, 10)}` } catch { return 'long ago' }
}

// a recent entry -> its world link (edit key, else view key)
export function entryLink (e, base = globalThis.location) {
  return buildLink({ docUrl: e.docUrl, key: e.key || undefined, view: e.key ? undefined : e.view || undefined, sync: e.sync || undefined }, base)
}

// the line under a world's title: when, and what kind of link it holds
export function entryMeta (e, now = Date.now()) {
  const bits = [relativeTime(e.at, now)]
  if (!e.key) bits.push(e.view ? 'view link' : 'no agent key')
  if (e.sync === 'none') bits.push('offline')
  else if (e.sync && e.sync !== DEFAULT_SYNC) { let host = e.sync; try { host = new URL(e.sync).host || e.sync } catch {} bits.push(`via ${host}`) }
  return bits.join(' · ')
}

export const titleOf = (e) => (String(e?.title ?? '').trim() || 'Untitled world')

const baseOf = (u) => `${u.origin}${u.pathname}`

// What a pasted text means:
//   { kind: 'open', link }            a world of this app (open it in place)
//   { kind: 'create', template, sync, safe }   a '#new=<template>' link, with the
//                                     sync server and safe flag it names (§18.1)
//   { kind: 'navigate', href }        a world link of another copy of the app (an http(s) page)
//   { kind: 'invalid', reason }
// `base` is this page's location; `templates` the known template names.
export function parseWorldInput (text, { base = globalThis.location, templates = [] } = {}) {
  const s = String(text ?? '').trim()
  if (!s) return { kind: 'invalid', reason: 'Paste a world link first.' }
  if (s.length > 4096) return { kind: 'invalid', reason: 'That is too long to be a world link.' }
  // a bare doc url or document id
  if (!/[#=]/.test(s) && !/^[a-z]+:\/\//i.test(s)) {
    const docUrl = normalizeDocUrl(s)
    return docUrl ? { kind: 'open', link: { ...parseLink(''), docUrl } } : { kind: 'invalid', reason: 'That is not a world link (it should contain #doc=automerge:…).' }
  }
  let here = null
  try { here = base ? new URL(String(base.href ?? base)) : null } catch {}
  let url = null
  if (/^[a-z][a-z0-9+.-]*:/i.test(s) && !/^automerge:/i.test(s)) {
    try { url = new URL(s) } catch { return { kind: 'invalid', reason: 'That link does not parse.' } }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return { kind: 'invalid', reason: 'Only http(s) links open here.' }
  }
  const frag = url ? url.hash : s
  const tpl = newTemplateOf(frag)
  const link = parseLink(frag)
  const elsewhere = url && here && baseOf(url) !== baseOf(here)
  if (!link.docUrl && !tpl) return { kind: 'invalid', reason: 'That link names no world (no #doc=…).' }
  if (elsewhere) return { kind: 'navigate', href: url.href }
  if (link.docUrl) return { kind: 'open', link }
  if (templates.length && !templates.includes(tpl)) return { kind: 'invalid', reason: `No template called “${tpl}”.` }
  return { kind: 'create', template: tpl, sync: link.sync, safe: link.safe }
}

// template cards in display order: the listed order first, then any others by name
export function templateCards (templates, order = []) {
  const names = Object.keys(templates ?? {})
  const sorted = [...order.filter((n) => names.includes(n)), ...names.filter((n) => !order.includes(n)).sort()]
  return sorted.map((name) => ({ name, title: String(templates[name]?.title ?? name), description: String(templates[name]?.description ?? ''), icon: String(templates[name]?.icon ?? '🌱') }))
}

// ---- the panel

async function copyText (text, clipboard) {
  try { await clipboard.writeText(text); return true } catch { return false }
}

export function makeLauncher ({
  root, recent, templates, onOpen, onCreate, onOpenFile,
  // optional
  order = ['meadow', 'blank'], base = globalThis.location, now = () => Date.now(),
  clipboard = globalThis.navigator?.clipboard, navigate = (href) => globalThis.location.assign(href),
} = {}) {
  if (!root) throw new TypeError('makeLauncher needs a root element')
  const status = h('p', { class: 'launch-status', role: 'status', 'aria-live': 'polite' })
  const say = (text, level = '') => { status.textContent = text ?? ''; status.className = `launch-status${level ? ` ${level}` : ''}` }

  // -- Your worlds
  const list = h('ul', { id: 'launch-recent', class: 'launch-recent', 'aria-label': 'your worlds' })
  const emptyNote = h('p', { class: 'launch-empty muted' }, 'No worlds yet. Worlds you create or open in this browser show up here.')
  const worldsSec = h('section', { class: 'launch-sec launch-worlds', 'aria-labelledby': 'launch-worlds-h' },
    h('h2', { id: 'launch-worlds-h' }, 'Your worlds'), list, emptyNote,
    h('p', { class: 'launch-fine muted' }, 'Kept in this browser only. Forget removes a world from this list; the world itself is not deleted.'))

  // -- New world
  const cards = templateCards(templates, order)
  const cardEls = cards.map((c) => h('button', {
    id: `launch-template-${c.name}`, class: 'launch-template', type: 'button', dataset: { template: c.name },
    onclick: () => choose(() => onCreate?.(c.name)),
  }, h('span', { class: 'launch-icon', 'aria-hidden': 'true' }, c.icon), h('span', { class: 'launch-tt' }, h('strong', null, c.title), h('span', { class: 'muted' }, c.description))))
  const newSec = h('section', { id: 'launch-new-section', class: 'launch-sec launch-newsec', 'aria-labelledby': 'launch-new-h' },
    h('h2', { id: 'launch-new-h' }, 'New world'), h('div', { class: 'launch-templates' }, ...cardEls))

  // -- Open a file
  const fileInput = h('input', { type: 'file', accept: '.automerge,application/octet-stream', hidden: true, tabIndex: -1 })
  fileInput.addEventListener('change', () => { const f = fileInput.files?.[0]; fileInput.value = ''; if (f) choose(() => onOpenFile?.(f)) })
  const fileSec = h('section', { class: 'launch-sec launch-file', 'aria-labelledby': 'launch-file-h' },
    h('h2', { id: 'launch-file-h' }, 'Open a file'),
    h('p', { class: 'muted' }, 'A world saved with Download (.automerge) opens as a new copy.'),
    h('button', { id: 'launch-open-file', type: 'button', onclick: () => fileInput.click() }, '📂 Choose a file…'), fileInput)

  // -- Paste a link
  const linkInput = h('input', { id: 'launch-link', type: 'text', inputmode: 'url', autocomplete: 'off', spellcheck: false, placeholder: 'https://…#doc=automerge:…', 'aria-label': 'world link' })
  const linkErr = h('p', { class: 'launch-error', role: 'alert' })
  const linkForm = h('form', { class: 'launch-linkform' }, linkInput, h('button', { id: 'launch-link-go', type: 'submit' }, 'Open'))
  linkForm.addEventListener('submit', (ev) => {
    ev.preventDefault()
    const r = parseWorldInput(linkInput.value, { base, templates: Object.keys(templates ?? {}) })
    linkErr.textContent = r.kind === 'invalid' ? r.reason : ''
    if (r.kind === 'open') choose(() => onOpen?.(r.link))
    else if (r.kind === 'create') choose(() => onCreate?.(r.template, { sync: r.sync, safe: r.safe }))
    else if (r.kind === 'navigate') { say('Opening that link…'); navigate(r.href) }
  })
  linkInput.addEventListener('input', () => { linkErr.textContent = '' })
  const linkSec = h('section', { class: 'launch-sec launch-paste', 'aria-labelledby': 'launch-paste-h' },
    h('h2', { id: 'launch-paste-h' }, 'Paste a link'), linkForm, linkErr)

  // -- hero
  const newBtn = h('button', { id: 'launch-new', class: 'primary launch-newbtn', type: 'button', onclick: () => { newSec.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' }); newSec.classList.remove('flash'); void newSec.offsetWidth; newSec.classList.add('flash'); cardEls[0]?.focus() } }, '＋ New world')
  const hero = h('header', { class: 'launch-hero' },
    h('div', { class: 'launch-logo', 'aria-hidden': 'true' }, '🌱🦖🐑'),
    h('div', { class: 'launch-heading' }, h('h1', { id: 'launch-title' }, 'Merge Meadow'), h('p', { class: 'muted' }, 'A shared world edited live by people and agents. Pick one up again or plant a new one.')),
    newBtn)

  const el = h('section', { id: 'launcher', class: 'launcher', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'launch-title', hidden: true },
    h('div', { class: 'launch-inner' }, hero, status,
      h('div', { class: 'launch-grid' }, worldsSec, h('div', { class: 'launch-side' }, newSec, fileSec, linkSec))))
  root.append(el)

  let busy = false
  // one choice at a time: the buttons go quiet until the app says otherwise
  function choose (fn) {
    if (busy) return
    setBusy(true)
    try { fn() } catch (e) { setBusy(false); say(String(e?.message ?? e), 'error') }
  }
  function setBusy (on) {
    busy = !!on
    el.classList.toggle('busy', busy)
    for (const b of el.querySelectorAll('button, input')) b.disabled = busy
  }

  function row (e) {
    const href = entryLink(e, base)
    const copyBox = h('input', { class: 'launch-copybox', type: 'text', readOnly: true, value: href, hidden: true, 'aria-label': 'world link' })
    const li = h('li', { class: 'launch-world', dataset: { doc: e.docUrl } },
      h('div', { class: 'launch-wt' }, h('span', { class: 'launch-wtitle' }, titleOf(e)), h('span', { class: 'launch-wmeta muted' }, entryMeta(e, now()))),
      h('div', { class: 'launch-wbtns' },
        h('button', { class: 'primary launch-open', type: 'button', onclick: () => choose(() => onOpen?.(parseLink(href))) }, 'Open'),
        h('button', { class: 'launch-copy', type: 'button', onclick: async () => {
          if (clipboard && await copyText(href, clipboard)) say(`Link to “${titleOf(e)}” copied: anyone with it can edit.`)
          else { copyBox.hidden = false; copyBox.focus(); copyBox.select?.(); say('Copy the link from the box.', 'warn') }
        } }, 'Copy link'),
        h('button', { class: 'launch-forget', type: 'button', title: 'Remove from this list (the world is not deleted)', onclick: () => {
          recent?.forget(e.docUrl)
          refresh()
          say(e.sync === 'none'
            ? `Forgot “${titleOf(e)}”. It is still in this browser's storage; its link still opens it here.`
            : `Forgot “${titleOf(e)}”. It is still in this browser's storage and on the sync server; its link still opens it.`)
        } }, 'Forget')),
      copyBox)
    // the title is storage data: textContent only (h() appends text nodes)
    return li
  }

  function refresh () {
    let items = []
    try { items = recent?.list() ?? [] } catch { items = [] }
    list.replaceChildren(...items.map(row))
    emptyNote.hidden = items.length > 0
    list.hidden = items.length === 0
    el.classList.toggle('no-worlds', items.length === 0)
    if (busy) setBusy(true)
  }

  return {
    el,
    show () { refresh(); el.hidden = false; document.body.classList.add('launching'); (list.querySelector('.launch-open') ?? cardEls[0])?.focus?.({ preventScroll: true }) },
    hide () { el.hidden = true; document.body.classList.remove('launching') },
    refresh,
    // after a failed open / create: buttons back, and say why
    error (text) { setBusy(false); say(text, 'error'); refresh() },
    setBusy,
    get busy () { return busy },
    destroy () { el.remove(); document.body.classList.remove('launching') },
  }
}
