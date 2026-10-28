// The chat transcript: renders Session 'entry' events. Assistant text and
// thinking blocks, tool calls as cards whose result fills in when the
// matching tool_result arrives, permission prompts, and the result line.

import { h, clear } from './dom.js'
import { initSummary, resultSummary, systemLine, toolLabel, toolResultText, prettyJson } from './format.js'

export class Transcript {
  constructor (root) {
    this.root = root
    this.toolCards = new Map() // tool_use id -> result slot
    this.lastInit = null
  }

  clear () { clear(this.root); this.toolCards.clear(); this.lastInit = null }

  add (entry) {
    const node = this.#render(entry)
    if (!node) return
    const stick = this.root.scrollHeight - this.root.scrollTop - this.root.clientHeight < 80
    this.root.append(node)
    if (stick) this.root.scrollTop = this.root.scrollHeight
  }

  #render (entry) {
    switch (entry.kind) {
      case 'user': return h('div', { class: 'msg user' }, h('div', { class: 'bubble' }, entry.text))
      case 'note': return h('div', { class: `meta note ${entry.level}` }, entry.text)
      case 'permission': return this.#permission(entry.detail)
      case 'message': return this.#message(entry.msg)
      default: return null
    }
  }

  #message (msg) {
    switch (msg.type) {
      case 'system':
        if (msg.subtype === 'init') {
          // The CLI repeats system/init at the start of every turn; show it when it changes.
          const text = initSummary(msg)
          if (text === this.lastInit) return null
          this.lastInit = text
          return h('div', { class: 'meta init' }, text)
        }
        return systemLine(msg) ? h('div', { class: 'meta' }, systemLine(msg)) : null
      case 'assistant': return this.#assistant(msg)
      case 'user': this.#toolResults(msg); return null
      case 'result': {
        const r = resultSummary(msg)
        return h('div', { class: `meta result ${r.ok ? 'ok' : 'error'}` }, r.text, r.detail ? h('div', { class: 'detail' }, r.detail) : null)
      }
      case 'stream_event':
      case 'keep_alive':
      case 'rate_limit_event':
        return null
      default: return null
    }
  }

  #assistant (msg) {
    const blocks = Array.isArray(msg.message?.content) ? msg.message.content : []
    const nodes = []
    for (const b of blocks) {
      if (b.type === 'text' && b.text) nodes.push(h('div', { class: 'text' }, b.text))
      else if (b.type === 'thinking' || b.type === 'redacted_thinking') {
        nodes.push(h('details', { class: 'thinking' }, h('summary', null, 'Thinking'), h('div', { class: 'text' }, b.thinking || (b.type === 'redacted_thinking' ? '(redacted)' : '(no summary)'))))
      } else if (b.type === 'tool_use' || b.type === 'server_tool_use') {
        const slot = h('div', { class: 'tool-result pending' }, 'running…')
        this.toolCards.set(b.id, slot)
        nodes.push(h('div', { class: 'tool', dataset: { toolUseId: b.id, tool: b.name } },
          h('div', { class: 'tool-name' }, toolLabel(b.name)),
          h('details', { class: 'tool-input' }, h('summary', null, 'input'), h('pre', null, prettyJson(b.input))),
          slot))
      }
    }
    if (msg.error) nodes.push(h('div', { class: 'meta note error' }, `API error: ${msg.error}`))
    if (!nodes.length) return null
    return h('div', { class: `msg assistant${msg.parent_tool_use_id ? ' sub' : ''}` }, nodes)
  }

  #toolResults (msg) {
    const blocks = Array.isArray(msg.message?.content) ? msg.message.content : []
    for (const b of blocks) {
      if (b.type !== 'tool_result') continue
      const slot = this.toolCards.get(b.tool_use_id)
      const text = toolResultText(b.content)
      if (!slot) continue
      slot.classList.remove('pending')
      if (b.is_error) slot.classList.add('error')
      clear(slot).append(h('pre', null, text || '(empty)'))
    }
  }

  #permission (detail) {
    const status = h('span', { class: 'perm-status' })
    const decide = (allow) => {
      if (allow) detail.allow(); else detail.deny('The user denied this in the page.')
      for (const b of buttons) b.disabled = true
      status.textContent = allow ? 'allowed' : 'denied'
    }
    const buttons = [
      h('button', { type: 'button', class: 'allow', onclick: () => decide(true) }, 'Allow'),
      h('button', { type: 'button', class: 'deny', onclick: () => decide(false) }, 'Deny')
    ]
    detail.signal?.addEventListener('abort', () => { for (const b of buttons) b.disabled = true; status.textContent = 'cancelled' }, { once: true })
    return h('div', { class: 'permission' },
      h('div', null, `Allow ${toolLabel(detail.toolName)}?`),
      h('pre', null, prettyJson(detail.input, 1500)),
      h('div', { class: 'row' }, buttons, status))
  }
}
