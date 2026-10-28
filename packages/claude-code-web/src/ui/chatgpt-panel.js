// The "ChatGPT subscription" part of Settings: Sign in with ChatGPT by
// pasting the callback address (host/siwc.js), the model and effort, the
// advanced endpoints, and what the user should know first.

import { h, clear } from './dom.js'
import { FALLBACK_MODELS } from '../host/siwc.js'
import { checkChatgptUrls } from '../host/invocation.js'
import { CHATGPT_EFFORTS, DEFAULT_CHATGPT_BASE, DEFAULT_CHATGPT_ISSUER, DEFAULT_CHATGPT_MODEL } from '../host/settings.js'

const EFFORT_LABELS = { '': 'Auto (follow Claude Code)', low: 'Low', medium: 'Medium', high: 'High', xhigh: 'Extra high' }

export function chatgptSection (session) {
  const siwc = session.siwc
  const settings = session.settings
  const save = (patch) => settings.set({ chatgpt: patch })
  const cur = () => settings.get().chatgpt
  const field = (label, input, hint) => h('label', { class: 'field' }, h('span', null, label), input, hint ? h('small', null, hint) : null)

  const error = h('p', { id: 'chatgpt-error', class: 'error', role: 'alert', hidden: true })
  const showError = (err) => { error.hidden = !err; error.textContent = err ? (err.message ?? String(err)) : '' }
  const busy = (el, p) => {
    el.disabled = true
    showError(null)
    return Promise.resolve(p).catch((err) => { showError(err); return null }).finally(() => { el.disabled = false; render() })
  }

  // --- signed out: open the sign-in tab, paste the address it ends on ---------
  const open = h('button', { id: 'chatgpt-open', type: 'button', class: 'primary' }, 'Open sign-in')
  const link = h('a', { id: 'chatgpt-authorize-link', target: '_blank', rel: 'noopener noreferrer', hidden: true }, 'open the sign-in page')
  const callback = h('input', { id: 'chatgpt-callback', type: 'url', autocomplete: 'off', spellcheck: false, placeholder: 'http://127.0.0.1:1455/auth/callback?code=…' })
  const complete = h('button', { id: 'chatgpt-complete', type: 'button' }, 'Complete sign-in')
  open.addEventListener('click', () => busy(open, siwc.beginLogin().then(({ url }) => {
    link.href = url
    link.hidden = false
    // a real tab: auth.openai.com cannot be framed, and the redirect to
    // 127.0.0.1 must happen in the user's own browser
    globalThis.open?.(url, '_blank', 'noopener,noreferrer')
    callback.focus()
  })))
  const doComplete = () => busy(complete, siwc.completeLogin(callback.value).then(() => {
    callback.value = ''
    link.hidden = true
    refreshModels()
  }))
  complete.addEventListener('click', doComplete)
  callback.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doComplete() } })
  const signedOut = h('div', { id: 'chatgpt-signed-out', class: 'col' },
    h('ol', { class: 'steps' },
      h('li', null, open, ' signs you in on auth.openai.com in a new tab (', link, ' if no tab opened).'),
      h('li', null, 'That tab ends on a page that cannot load, at ', h('code', null, 'http://127.0.0.1:1455/auth/callback?code=…'), '. That is expected: copy its whole address from the address bar and paste it here.')),
    callback,
    h('div', { class: 'row' }, complete))

  // --- signed in -----------------------------------------------------------------
  const account = h('span', { id: 'chatgpt-account' })
  const logout = h('button', { id: 'chatgpt-logout', type: 'button' }, 'Log out')
  logout.addEventListener('click', () => busy(logout, siwc.logout()))
  const signedIn = h('div', { id: 'chatgpt-signed-in', class: 'row', hidden: true }, account, logout)

  // --- model and effort -------------------------------------------------------------
  const model = h('select', { id: 'chatgpt-model' })
  const effort = h('select', { id: 'chatgpt-effort' })
  const modelsNote = h('small', { id: 'chatgpt-models-note' })
  const reloadModels = h('button', { id: 'chatgpt-models-refresh', type: 'button', class: 'link' }, 'refresh the list')
  model.addEventListener('change', () => { save({ model: model.value }); renderEffort() })
  effort.addEventListener('change', () => save({ effort: effort.value }))
  let modelsState = 'fallback' // fallback | loading | live | error
  let modelsError = ''
  function refreshModels () {
    if (!siwc.status().signedIn) return Promise.resolve()
    modelsState = 'loading'
    renderModels()
    return siwc.listModels().then((list) => {
      modelsState = 'live'
      // the saved model is gone from the live list and was only the default: take the first one offered
      if (list.length && !list.some((m) => m.slug === cur().model) && cur().model === DEFAULT_CHATGPT_MODEL) save({ model: list[0].slug })
    }, (err) => {
      modelsState = 'error'
      modelsError = err.message
    }).finally(renderModels)
  }
  reloadModels.addEventListener('click', () => refreshModels())

  function renderModels () {
    const list = siwc.models ?? [...FALLBACK_MODELS]
    const chosen = cur().model || DEFAULT_CHATGPT_MODEL
    clear(model)
    for (const m of list) model.append(h('option', { value: m.slug }, m.displayName && m.displayName !== m.slug ? `${m.displayName} (${m.slug})` : m.slug))
    if (!list.some((m) => m.slug === chosen)) model.append(h('option', { value: chosen }, `${chosen} (saved; not offered now)`))
    model.value = chosen
    modelsNote.textContent = modelsState === 'live' ? `${list.length} model${list.length === 1 ? '' : 's'} offered for your plan. ` + 'GPT-5.5 is the one tested with this page; newer models are likely to work.'
      : modelsState === 'loading' ? 'Loading the models your plan offers…'
        : modelsState === 'error' ? `Could not load the model list (${modelsError}); showing the default.`
          : 'Sign in to see the models your plan offers.'
    renderEffort()
  }

  function renderEffort () {
    const m = (siwc.models ?? FALLBACK_MODELS).find((x) => x.slug === model.value)
    const allowed = CHATGPT_EFFORTS.filter((e) => e === '' || !m?.efforts || m.efforts.includes(e))
    const chosen = cur().effort
    clear(effort)
    for (const e of allowed) effort.append(h('option', { value: e }, EFFORT_LABELS[e] ?? e))
    effort.value = allowed.includes(chosen) ? chosen : ''
  }

  // --- advanced: where the requests go (tests point them at the mock) -----------
  const urlError = h('p', { id: 'chatgpt-url-error', class: 'error', hidden: true })
  const checkUrls = () => {
    const why = checkChatgptUrls(cur())
    urlError.hidden = !why
    urlError.textContent = why ?? ''
  }
  const baseUrl = h('input', { id: 'chatgpt-base-url', type: 'url', spellcheck: false, placeholder: DEFAULT_CHATGPT_BASE, value: cur().baseUrl === DEFAULT_CHATGPT_BASE ? '' : cur().baseUrl, oninput: () => { save({ baseUrl: baseUrl.value.trim() || DEFAULT_CHATGPT_BASE }); checkUrls() } })
  const issuer = h('input', { id: 'chatgpt-issuer', type: 'url', spellcheck: false, placeholder: DEFAULT_CHATGPT_ISSUER, value: cur().issuer === DEFAULT_CHATGPT_ISSUER ? '' : cur().issuer, oninput: () => { save({ issuer: issuer.value.trim() || DEFAULT_CHATGPT_ISSUER }); checkUrls() } })
  const advanced = h('details', { id: 'chatgpt-advanced' },
    h('summary', null, 'Advanced: endpoints'),
    h('p', { class: 'muted small' }, 'Leave empty for OpenAI. Point both at mock/mock-api.mjs to try the flow without an account (API base URL <mock>/v1, issuer <mock>). https only (http just for localhost).'),
    field('ChatGPT API base URL', baseUrl),
    field('Sign-in issuer', issuer),
    urlError)

  const notes = h('ul', { id: 'chatgpt-notes', class: 'notes small' },
    h('li', null, 'Uses your ', h('strong', null, 'ChatGPT Plus or Pro'), ' plan through OpenAI\'s "Sign in with ChatGPT" for open-source apps. It counts against your plan\'s Codex usage limits; in ChatGPT under Settings → Security and login → Sign in with ChatGPT you can set a weekly cap for this app or disconnect it.'),
    h('li', null, 'OpenAI offers plan usage to open-source apps under its own terms; this page is open source and runs only in your browser. Unofficial: not affiliated with or endorsed by OpenAI or Anthropic.'),
    h('li', null, 'Your ChatGPT tokens stay in this browser (this tab only unless you tick "Remember on this device" below) and go only to OpenAI. The refresh token is a long-lived credential: anyone who reads it can use your plan until you log out.'),
    h('li', null, 'Claude Code\'s own prompt runs on the OpenAI model you pick. Its cost line is in Claude prices and does not describe your ChatGPT usage. Logging in with the Codex CLI itself is not supported here (README).'))

  const section = h('div', { id: 'chatgpt-section', class: 'col chatgpt' },
    h('p', { class: 'muted small' }, 'Sign in with ChatGPT'),
    signedOut, signedIn, error,
    field('Model', model, modelsNote), reloadModels,
    field('Reasoning effort', effort, 'Auto uses the effort Claude Code asks for.'),
    notes,
    advanced)

  function render () {
    const st = siwc.status()
    signedIn.hidden = !st.signedIn
    signedOut.hidden = st.signedIn
    const plan = st.plan ? st.plan.charAt(0).toUpperCase() + st.plan.slice(1) : ''
    account.textContent = st.signedIn ? `Signed in${st.email ? ` as ${st.email}` : ''}${plan ? ` (${plan})` : ''}` : ''
    section.dataset.state = st.signedIn ? 'signed-in' : st.pending ? 'pending' : 'signed-out'
    reloadModels.hidden = !st.signedIn
  }

  let loadedOnce = false
  siwc.addEventListener('change', () => {
    render()
    if (!siwc.status().signedIn) { modelsState = 'fallback'; renderModels() }
  })
  render()
  renderModels()
  checkUrls()
  return {
    element: section,
    /** Called when the ChatGPT mode is shown: load the live model list once. */
    shown () {
      if (loadedOnce || !siwc.status().signedIn) return
      loadedOnce = true
      refreshModels()
    }
  }
}
