// reader.js — the document viewer.
//
// Everything in the filesystem is plain text and stays plain text. The only
// thing this program adds is three colours, decided by looking at a line and
// the line after it. There is no markdown parser here on purpose: the day one
// arrives is the day the notes start being written in markdown.

import { el, clamp } from '../util.js'
import { icon } from '../icons.js'

const SIZE = { min: 11, max: 17, base: 13 }

const RULE = /^\s*[-=_]{3,}\s*$/
const UNDERLINE = /^\s*[-=]{3,}\s*$/
const BULLET = /^(\s*)(\[[ xX]\]|[-·*])(\s+)/

// The document bodies are hand-written in fs.js, which is exactly the sort of
// place a stray angle bracket goes to live. Nothing reaches innerHTML unescaped.
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

const nameOf = (path) => String(path ?? '').split('/').filter(Boolean).pop() ?? 'Document'
const plural = (n, word) => `${n.toLocaleString()} ${n === 1 ? word : `${word}s`}`

// A heading is either shouted or underlined. Both conventions are already in
// the files, so the reader honours both rather than picking a winner.
const isHead = (line, next) => {
  if (!line.trim()) return false
  if (next !== undefined && UNDERLINE.test(next)) return true
  return /[A-Z]/.test(line) && !/[a-z]/.test(line)
}

function highlight(text) {
  const lines = text.split('\n')
  return lines
    .map((line, i) => {
      if (RULE.test(line)) return `<span class="prose__rule">${escape(line)}</span>`
      if (isHead(line, lines[i + 1])) return `<span class="prose__head">${escape(line)}</span>`
      const bullet = line.match(BULLET)
      if (!bullet) return escape(line)
      const [all, indent, mark, gap] = bullet
      // Only the mark is tinted. Tinting the whole line turns a list into a
      // wall of accent colour and the eye stops finding the marks at all.
      return `${escape(indent)}<span class="prose__bullet">${escape(mark)}</span>${escape(gap)}${escape(line.slice(all.length))}`
    })
    .join('\n')
}

export default {
  id: 'reader',
  title: (args) => nameOf(args?.path),
  mark: 'bud',
  // Wide enough for the widest document this machine ships. They are hand-
  // wrapped at up to 78 columns, and a reader five columns short of that
  // re-wraps almost every one of them into orphan words — and collapses the
  // hanging indents in /Wat/ornament.txt outright.
  width: 660,
  height: 520,
  minWidth: 320,
  minHeight: 240,
  key: (args) => `reader:${args?.path ?? ''}`,

  mount(body, { win, shell, args }) {
    const path = args?.path ?? ''
    const node = shell.node(path)
    const found = node?.kind === 'doc'
    const text = found ? node.body : ''
    let size = SIZE.base
    let flash = 0

    // --- chrome -----------------------------------------------------------

    const head = el('div.doc-head', [
      el('h1.doc-head__title', { text: node?.name ?? nameOf(path) }),
      el('span.doc-head__path', { text: node?.path ?? path }),
    ])

    const smallerBtn = el('button.toolbar__btn', {
      type: 'button',
      title: 'Smaller text',
      'aria-label': 'Smaller text',
      text: 'A-',
      onclick: () => step(-1),
    })
    const largerBtn = el('button.toolbar__btn', {
      type: 'button',
      title: 'Larger text',
      'aria-label': 'Larger text',
      text: 'A+',
      onclick: () => step(1),
    })
    const copyBtn = el('button.toolbar__btn', {
      type: 'button',
      title: 'Copy the text',
      'aria-label': 'Copy the text',
      disabled: !found,
      html: icon('doc', { size: 15 }),
      onclick: () => copy(),
    })
    const sizeText = el('span.toolbar__text')

    const toolbar = el('div.toolbar', [
      smallerBtn,
      largerBtn,
      el('div.toolbar__sep', { 'aria-hidden': 'true' }),
      copyBtn,
      el('div.toolbar__spacer'),
      sizeText,
    ])

    // tabindex so the arrow keys and page keys have something to scroll
    const scroll = el('div.scroll', { tabindex: '0' })
    const prose = el('pre.prose', { html: highlight(text) })
    scroll.append(
      found
        ? prose
        : el('div.empty-note', { text: `There is nothing at ${path} that opens as a document.` }),
    )

    const statusbar = el('div.statusbar', [
      el('span', { text: plural(found ? text.split('\n').length : 0, 'line') }),
      el('div.statusbar__spacer'),
      el('span', { text: plural(text.length, 'character') }),
    ])

    body.append(el('div.pane', [head, toolbar, scroll, statusbar]))

    // --- type size --------------------------------------------------------

    function paintSize() {
      prose.style.fontSize = `${size}px`
      sizeText.textContent = `${size} px`
      smallerBtn.disabled = !found || size <= SIZE.min
      largerBtn.disabled = !found || size >= SIZE.max
    }

    function step(delta) {
      const next = clamp(size + delta, SIZE.min, SIZE.max)
      if (next === size) return
      size = next
      paintSize()
      shell.sfx?.play('blip')
    }

    paintSize()

    // --- clipboard --------------------------------------------------------

    async function copy() {
      if (!found) return
      // Insecure contexts and older browsers simply do not hand this over.
      if (!navigator.clipboard?.writeText) {
        shell.notify('This browser keeps the clipboard to itself. Select the text and copy it by hand.', 'warn')
        return
      }
      try {
        await navigator.clipboard.writeText(text)
        shell.notify(`${node.name} is on the clipboard.`)
        copyBtn.innerHTML = icon('check', { size: 15 })
        clearTimeout(flash)
        flash = setTimeout(() => {
          copyBtn.innerHTML = icon('doc', { size: 15 })
        }, 1400)
      } catch {
        shell.notify('The clipboard refused. That usually means the page was not focused.', 'warn')
      }
    }

    win.onDispose(() => clearTimeout(flash))

    if (!found) shell.notify(`Nothing at ${path} that opens as a document.`, 'warn')
  },
}
