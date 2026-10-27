// Settings: credential (API key by default, or a `claude setup-token`
// token), API base URL, model, custom tools JSON, permission prompts.
// Every edit is saved at once (localStorage, this device only).

import { h } from './dom.js'
import { parseToolsConfig, DEFAULT_TOOLS_JSON } from '../host/custom-tools.js'
import { DEFAULT_API_BASE } from '../host/constants.js'

export function settingsPanel (session) {
  const s = session.settings.get()
  const save = (patch) => session.settings.set(patch)

  const field = (label, input, hint) => h('label', { class: 'field' }, h('span', null, label), input, hint ? h('small', null, hint) : null)

  const apiKey = h('input', { id: 'api-key', type: 'password', autocomplete: 'off', spellcheck: false, placeholder: 'sk-ant-api…', value: s.apiKey, oninput: () => save({ apiKey: apiKey.value }) })
  const token = h('input', { id: 'token', type: 'password', autocomplete: 'off', spellcheck: false, placeholder: 'sk-ant-oat01-…', value: s.token, oninput: () => save({ token: token.value }) })
  const apiKeyField = field('API key', apiKey, 'From the Console org linked to your plan. Sent only to the base URL below.')
  const tokenField = field('Token from `claude setup-token`', token, 'Run `claude setup-token` on your own machine and paste the result.')
  const grayArea = h('p', { class: 'warn' },
    'Experimental: subscription tokens are meant for the unmodified Claude Code binary. This page runs its JavaScript on a different runtime, a gray area in Anthropic\'s terms. See the README.')

  const modes = [['api-key', 'API key'], ['oauth', 'Subscription token']]
  const radios = modes.map(([value, label]) => h('label', { class: 'radio' },
    h('input', { type: 'radio', name: 'auth-mode', id: `auth-${value}`, value, checked: s.authMode === value, onchange: () => { save({ authMode: value }); sync() } }),
    label))
  const sync = () => {
    const oauth = session.settings.get().authMode === 'oauth'
    apiKeyField.hidden = oauth
    tokenField.hidden = !oauth
    grayArea.hidden = !oauth
  }

  const baseUrl = h('input', { id: 'base-url', type: 'url', spellcheck: false, placeholder: DEFAULT_API_BASE, value: s.baseUrl, oninput: () => save({ baseUrl: baseUrl.value.trim() }) })
  const model = h('input', { id: 'model', type: 'text', spellcheck: false, placeholder: 'default', value: s.model, oninput: () => save({ model: model.value.trim() }) })

  const toolsError = h('p', { id: 'tools-error', class: 'error', hidden: true })
  const tools = h('textarea', { id: 'tools-json', rows: 12, spellcheck: false, value: s.toolsJson })
  const checkTools = () => {
    try {
      const cfg = parseToolsConfig(tools.value)
      toolsError.hidden = true
      toolsSummary.textContent = cfg.tools.length ? `${cfg.tools.length} tool${cfg.tools.length === 1 ? '' : 's'} on server "${cfg.server}"` : 'none'
    } catch (err) {
      toolsError.hidden = false
      toolsError.textContent = err.message
      toolsSummary.textContent = 'invalid'
    }
  }
  tools.addEventListener('input', () => { save({ toolsJson: tools.value }); checkTools() })
  const toolsSummary = h('span', { class: 'muted' })
  const resetTools = h('button', { type: 'button', class: 'link', onclick: () => { tools.value = DEFAULT_TOOLS_JSON; save({ toolsJson: tools.value }); checkTools() } }, 'reset to the example')

  const ask = h('input', { id: 'ask-permission', type: 'checkbox', checked: s.askPermission, onchange: () => save({ askPermission: ask.checked }) })

  // A form (never submitted) so browsers treat the secret fields as credentials.
  const panel = h('form', { class: 'panel', id: 'panel-settings', autocomplete: 'off', onsubmit: (e) => e.preventDefault() },
    h('h2', null, 'Settings'),
    h('div', { class: 'radios', role: 'radiogroup' }, radios),
    apiKeyField, tokenField, grayArea,
    field('API base URL', baseUrl, 'Leave as is for the real API; point it at mock/mock-api.mjs to try things out.'),
    field('Model', model, 'Empty: Claude Code picks its default.'),
    h('details', { class: 'tools' },
      h('summary', null, 'Custom tools ', toolsSummary),
      h('p', { class: 'muted' }, 'JSON with a JavaScript handler body per tool, run in this page as async (input, ctx) => …. The model sees them as mcp__<server>__<name>. Takes effect on the next start.'),
      tools, toolsError, resetTools),
    h('label', { class: 'check' }, ask, ' Ask before each tool use'))
  sync()
  checkTools()
  return panel
}
