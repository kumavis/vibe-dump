// Agent tab (design §6.3, §6.4): the editor link (with key), the MCP setup
// line, the view link, live CapTP sessions and a log of agent calls. The page
// cannot know where the package is checked out, so the path is a field the
// viewer fills in once (kept in this browser only).
import { h } from './dom.js'
import { mcpSetupLine, cliLine, PACKAGE_HINT } from './share.js'

const PATH_KEY = 'mm:agent-path'
const load = () => { try { return globalThis.localStorage?.getItem(PATH_KEY) || PACKAGE_HINT } catch { return PACKAGE_HINT } }
const store = (v) => { try { globalThis.localStorage?.setItem(PATH_KEY, v) } catch {} }
const ago = (t) => { const s = Math.round((Date.now() - t) / 1000); return s < 60 ? `${s}s ago` : `${Math.round(s / 60)}m ago` }

// ctx: { link, share, agentHost, viewLink(), enableAgents(), copy(text) }
export function makeAgentPanel (ctx) {
  const el = h('div', { class: 'agent' })
  let path = load()
  let parts = null

  const copyRow = (label, value, cls = '') => {
    const box = h(value.length > 90 ? 'textarea' : 'input', { class: `copyable ${cls}`, readOnly: true, value, rows: 3, spellcheck: false, onfocus: (e) => e.target.select() })
    return { box, row: h('div', { class: 'copy-row' }, h('span', { class: 'sf-label' }, label), box, h('button', { class: 'small', type: 'button', onclick: async () => { const ok = await ctx.copy(box.value); ctx.toast?.(ok ? `${label} copied` : 'Copy failed: select the text and copy it', ok ? 'info' : 'warn') } }, 'copy')) }
  }

  function build () {
    if (!ctx.link?.key) {
      el.replaceChildren(
        h('p', null, 'This tab hosts no agent: its link has no ', h('code', null, 'key'), '. Anyone with the doc link can still edit the world directly (the agent library falls back to that), but live powers — capture, logs, eval, explain — need a host tab.'),
        h('button', { class: 'primary', type: 'button', onclick: () => ctx.enableAgents?.() }, 'Host agents in this tab (new key)'),
        security())
      parts = null
      return
    }
    const link = ctx.share.link()
    const editor = copyRow('editor link', link)
    const mcp = copyRow('MCP setup', mcpSetupLine({ link, path }), 'code')
    const cli = copyRow('one-shot CLI', cliLine({ link, path }), 'code')
    const pathIn = h('input', { value: path, spellcheck: false, title: 'where packages/merge-meadow lives on the machine running the agent', onchange: (e) => { path = e.target.value.trim() || PACKAGE_HINT; store(path); build() } })
    const view = h('div', { class: 'view-link' })
    const sessions = h('div', { class: 'sessions' })
    const calls = h('ol', { class: 'calls' })
    el.replaceChildren(
      h('p', { class: 'muted' }, 'Hand an agent the editor link and it can edit this world over CapTP through this tab (sealed frames on the doc\'s own channel), or directly through the doc when no tab answers.'),
      editor.row,
      h('label', { class: 'copy-row' }, h('span', { class: 'sf-label' }, 'package path'), pathIn),
      mcp.row, cli.row, view,
      h('div', { class: 'section-head' }, h('h4', null, 'Sessions'), h('button', { class: 'small danger', type: 'button', title: 'end every agent session now', onclick: () => { ctx.agentHost?.revoke?.(); ctx.toast?.('Agent sessions revoked') } }, 'revoke all')),
      sessions,
      h('h4', null, 'Agent calls'), calls,
      security())
    parts = { view, sessions, calls, viewShown: false }
    refresh()
  }

  function security () {
    return h('details', { class: 'security' }, h('summary', null, 'What this means'), h('ul', null,
      h('li', null, 'Anyone with the doc link can edit — including the system code every peer runs.'),
      h('li', null, 'Doc systems run in a sandbox (SES Compartment): no DOM, no three.js, no handles.'),
      h('li', null, 'The key gates capture, logs and eval in this tab. A view link is derived one-way and lets agents only read — but it still carries the doc link, so anyone holding it can edit the world in a browser.'),
      h('li', null, 'Nothing from a doc or an agent is written to this site\'s storage.')))
  }

  function refresh () {
    if (!parts) return
    const vl = ctx.viewLink?.()
    if (vl && !parts.viewShown) { parts.viewShown = true; parts.view.replaceChildren(copyRow('view link', vl).row) }
    const list = ctx.agentHost?.sessions?.() ?? []
    parts.sessions.replaceChildren(list.length
      ? h('ul', null, ...list.map((s) => h('li', null, h('span', { class: `badge ${s.role}` }, s.role), ` ${String(s.id).slice(0, 10)}… · last ${ago(s.lastAt)}`)))
      : h('div', { class: 'muted' }, 'No agent attached.'))
    const calls = ctx.agentHost?.calls?.() ?? []
    parts.calls.replaceChildren(...calls.slice(-40).reverse().map((c) => h('li', { class: c.ok ? '' : 'error' }, h('span', { class: 'muted' }, new Date(c.t).toLocaleTimeString()), ` ${c.what}${c.ms != null ? ` · ${c.ms} ms` : ''}${c.error ? ` — ${c.error}` : ''}`)))
    if (!calls.length) parts.calls.append(h('li', { class: 'muted' }, 'none yet'))
  }

  build()
  return { el, refresh, rebuild: build, sessionCount: () => ctx.agentHost?.sessions?.().length ?? 0 }
}
