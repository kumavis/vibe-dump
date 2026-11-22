// WAT editor: a textarea over a highlighted mirror, with the assembler's
// error shown inline at its line and column. Ctrl/Cmd+Enter assembles.
import { h, icon, esc } from './dom.js'
import { highlightText } from './wat-highlight.js'

export class Editor {
  constructor({ onRun, onCancel, onReset }) {
    this.onRun = onRun
    this.ta = h('textarea', { class: 'ed-ta mono', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'WAT source' })
    this.mirror = h('pre', { class: 'ed-mirror mono', 'aria-hidden': 'true' })
    this.gutter = h('div', { class: 'ed-gutter mono', 'aria-hidden': 'true' })
    this.err = h('div', { class: 'ed-err', role: 'alert', hidden: true })
    this.resetBtn = h('button', { type: 'button', class: 'btn ghost small', title: 'Restore the lesson\'s original program', onclick: () => onReset && onReset() }, 'Reset')
    const bar = h('div', { class: 'ed-bar' },
      h('span', { class: 'pane-label' }, 'Edit WAT'), h('span', { class: 'grow' }),
      this.resetBtn,
      h('button', { type: 'button', class: 'btn ghost small', onclick: () => onCancel && onCancel() }, 'Cancel'),
      h('button', { type: 'button', class: 'btn primary small', title: 'Assemble and load  ·  Ctrl+Enter', onclick: () => this.run() }, icon('play', 12), 'Assemble', h('kbd', { class: 'ed-kbd' }, 'Ctrl ↵')))
    this.wrap = h('div', { class: 'ed-wrap' }, this.gutter, h('div', { class: 'ed-area' }, this.mirror, this.ta))
    this.el = h('div', { class: 'editor' }, bar, this.wrap, this.err)
    this.ta.addEventListener('input', () => this.sync())
    this.ta.addEventListener('scroll', () => this.syncScroll())
    this.ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.run()
      } else if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault()
        document.execCommand('insertText', false, '  ')
      } else if (e.key === 'Escape') {
        onCancel && onCancel()
      }
      e.stopPropagation()
    })
  }

  set(text, { canReset = false } = {}) {
    this.ta.value = text
    this.resetBtn.hidden = !canReset
    this.error = null
    this.sync()
  }
  get value() {
    return this.ta.value
  }
  focus() {
    this.ta.focus()
  }
  run() {
    this.onRun && this.onRun(this.ta.value)
  }

  /** Show an error {line, col, message, stage}; null clears it. */
  showError(e) {
    this.error = e
    if (!e) {
      this.err.hidden = true
      this.sync()
      return
    }
    this.err.hidden = false
    const where = e.line != null ? `line ${e.line}, col ${e.col}: ` : ''
    this.err.innerHTML = `${icon('warn', 14).outerHTML}<span><b>${esc(e.title || 'Error')}</b> ${esc(where)}<span class="mono">${esc(e.message)}</span></span>`
    this.sync()
    if (e.line != null) {
      // move the caret to the error
      const lines = this.ta.value.split('\n')
      let pos = 0
      for (let i = 0; i < e.line - 1 && i < lines.length; i++) pos += lines[i].length + 1
      pos += Math.max(0, e.col - 1)
      this.ta.setSelectionRange(pos, pos)
    }
  }

  sync() {
    const text = this.ta.value
    const lines = highlightText(text)
    const e = this.error
    if (e && e.line != null && lines[e.line - 1] != null) {
      // underline from the error column to the end of the token
      const raw = text.split('\n')[e.line - 1]
      let c1 = e.col - 1
      while (c1 < raw.length && !/[\s()]/.test(raw[c1])) c1++
      if (c1 <= e.col - 1) c1 = e.col
      const before = raw.slice(0, e.col - 1)
      lines[e.line - 1] = `${esc(before)}<span class="ed-bad">${esc(raw.slice(e.col - 1, c1) || ' ')}</span>${esc(raw.slice(c1))}`
    }
    this.mirror.innerHTML = lines.join('\n') + '\n'
    let g = ''
    for (let i = 1; i <= lines.length; i++) g += `<div class="${e && e.line === i ? 'bad' : ''}">${i}</div>`
    this.gutter.innerHTML = g
    this.syncScroll()
  }

  syncScroll() {
    this.mirror.style.transform = `translate(${-this.ta.scrollLeft}px, ${-this.ta.scrollTop}px)`
    this.gutter.style.transform = `translateY(${-this.ta.scrollTop}px)`
  }
}
