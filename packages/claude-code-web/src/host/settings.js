// The user's settings: credentials, API base URL, model, custom tools and
// permission behaviour.
//
// Where they live: on GitHub Pages this page's origin (kumavis.github.io) is
// shared with every other gallery app and every other Pages site of the
// account, and any script on that origin can read its localStorage. So the
// credentials (API key, token, ChatGPT tokens) are NOT written to
// localStorage by default:
//
//   cc-web:settings  localStorage    everything except the credentials, plus
//                                    the credentials only when `remember` is on
//   cc-web:secrets   sessionStorage  the credentials while `remember` is off:
//                                    kept across reloads of this tab, gone
//                                    when the tab closes
//
// Turning `remember` off removes the credentials from localStorage at once.
// A credential an older build left in localStorage without `remember` is
// moved to sessionStorage on load.
//
// The ChatGPT subscription option (ARCHITECTURE.md Appendix A) adds:
//   authMode 'chatgpt'
//   chatgpt        public: { clientId, extAgentHostId, model, effort, baseUrl, issuer }
//                  (patched field by field: set({chatgpt: {model}}) keeps the rest)
//   chatgptTokens  secret: { accessToken, refreshToken, idToken, expiresAt, earliestRefreshAt }
//                  or null (signed out); replaced as a whole by set()
// Settings saved by an older build have neither; they load with the defaults.

import { DEFAULT_API_BASE } from './constants.js'
import { DEFAULT_TOOLS_JSON } from './custom-tools.js'
import { createJsonStore } from './persist.js'

export const SETTINGS_KEY = 'cc-web:settings'
export const SECRETS_KEY = 'cc-web:secrets'
export const SECRET_FIELDS = Object.freeze(['apiKey', 'token', 'chatgptTokens'])

export const AUTH_MODES = Object.freeze(['api-key', 'oauth', 'chatgpt'])
/** Reasoning effort overrides for the ChatGPT model; '' follows Claude Code's own effort. */
export const CHATGPT_EFFORTS = Object.freeze(['', 'low', 'medium', 'high', 'xhigh'])
export const DEFAULT_CHATGPT_BASE = 'https://api.openai.com/v1'
export const DEFAULT_CHATGPT_ISSUER = 'https://auth.openai.com'
/** gpt-5.5 takes the classic Responses tools shape (report J §5); the newer models are responses-lite. */
export const DEFAULT_CHATGPT_MODEL = 'gpt-5.5'

export const DEFAULT_CHATGPT = Object.freeze({
  clientId: '', // the oaiapp_… id the first sign-in issues (dynamic registration)
  extAgentHostId: '', // urn:uuid:… minted once per device, at the first sign-in
  model: DEFAULT_CHATGPT_MODEL,
  effort: '',
  baseUrl: DEFAULT_CHATGPT_BASE,
  issuer: DEFAULT_CHATGPT_ISSUER
})

export const DEFAULT_SETTINGS = Object.freeze({
  // API key is the default: browser-direct API-key use is officially
  // supported. The setup-token (OAuth) mode is the gray area (README).
  authMode: 'api-key', // 'api-key' | 'oauth' | 'chatgpt'
  apiKey: '',
  token: '',
  chatgptTokens: null,
  remember: false, // keep the credentials in localStorage ("Remember on this device")
  baseUrl: DEFAULT_API_BASE,
  model: '',
  toolsJson: DEFAULT_TOOLS_JSON,
  askPermission: false,
  chatgpt: DEFAULT_CHATGPT
})

const pick = (o, keys) => Object.fromEntries(keys.filter((k) => k in o).map((k) => [k, o[k]]))
const omit = (o, keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)))
const hasSecret = (o) => SECRET_FIELDS.some((k) => o[k])

/** Whether the settings hold what the current auth mode needs (no network check). */
export function hasCredentialFor (s) {
  if (s.authMode === 'oauth') return Boolean(s.token)
  if (s.authMode === 'chatgpt') return Boolean(s.chatgptTokens?.refreshToken || s.chatgptTokens?.accessToken)
  return Boolean(s.apiKey)
}

/**
 * @param {object} [o]
 * @param {Storage} [o.storage]         localStorage (default globalThis.localStorage)
 * @param {Storage} [o.sessionStorage]  sessionStorage (default globalThis.sessionStorage)
 */
export function createSettings ({ storage, sessionStorage } = {}) {
  const local = createJsonStore(SETTINGS_KEY, { storage, area: 'localStorage' })
  const tab = createJsonStore(SECRETS_KEY, { storage: sessionStorage, area: 'sessionStorage' })
  let value

  function load () {
    const saved = sanitise(local.load()) ?? {}
    const secrets = pick(sanitise(tab.load()) ?? {}, SECRET_FIELDS)
    value = { ...DEFAULT_SETTINGS, ...saved, ...secrets, chatgpt: { ...DEFAULT_CHATGPT, ...saved.chatgpt } }
    // an older build kept the credential in localStorage: move it out
    if (!value.remember && hasSecret(saved)) persist()
  }

  function persist () {
    if (value.remember) {
      local.save(value)
      tab.clear()
    } else {
      local.save(omit(value, SECRET_FIELDS))
      if (hasSecret(value)) tab.save(pick(value, SECRET_FIELDS))
      else tab.clear()
    }
  }

  const copy = () => ({ ...value, chatgpt: { ...value.chatgpt }, chatgptTokens: value.chatgptTokens ? { ...value.chatgptTokens } : null })

  load()
  return {
    get: copy,
    /** The settings without the credentials: safe to show or log. */
    getPublic: () => ({ ...omit(copy(), SECRET_FIELDS), hasCredential: hasCredentialFor(value), chatgptSignedIn: hasCredentialFor({ ...value, authMode: 'chatgpt' }) }),
    set (patch) {
      const clean = sanitise(patch) ?? {}
      const next = { ...value, ...clean }
      if (clean.chatgpt) next.chatgpt = { ...value.chatgpt, ...clean.chatgpt }
      value = next
      persist()
      return copy()
    },
    /**
     * Read storage again: another tab of this origin may have rotated the
     * ChatGPT refresh token (only with `remember` on; sessionStorage is per tab).
     */
    reload () {
      // nothing readable (blocked storage): keep what this tab has in memory
      if (local.load() === null && tab.load() === null) return copy()
      load()
      return copy()
    },
    reset () { value = { ...DEFAULT_SETTINGS }; local.clear(); tab.clear(); return copy() }
  }
}

const trimSlash = (u) => String(u ?? '').trim().replace(/\/+$/, '')

/** The ChatGPT settings with defaults applied and URLs without a trailing slash. */
export function chatgptConfig (chatgpt = {}) {
  const c = chatgpt ?? {}
  return {
    clientId: c.clientId ?? '',
    extAgentHostId: c.extAgentHostId ?? '',
    model: c.model || DEFAULT_CHATGPT_MODEL,
    effort: CHATGPT_EFFORTS.includes(c.effort) ? c.effort : '',
    baseUrl: trimSlash(c.baseUrl || DEFAULT_CHATGPT_BASE),
    issuer: trimSlash(c.issuer || DEFAULT_CHATGPT_ISSUER)
  }
}

function sanitise (o) {
  if (!o || typeof o !== 'object') return null
  const out = {}
  for (const k of Object.keys(DEFAULT_SETTINGS)) {
    if (!(k in o)) continue
    const v = o[k]
    if (k === 'askPermission' || k === 'remember') out[k] = Boolean(v)
    else if (k === 'authMode') out[k] = AUTH_MODES.includes(v) ? v : 'api-key'
    else if (k === 'chatgpt') { const c = sanitiseChatgpt(v); if (c) out[k] = c }
    else if (k === 'chatgptTokens') out[k] = sanitiseTokens(v)
    else if (typeof v === 'string') out[k] = v
  }
  return out
}

/** Only the fields present (a patch); unknown fields and wrong types are dropped. */
function sanitiseChatgpt (o) {
  if (!o || typeof o !== 'object') return null
  const out = {}
  for (const k of Object.keys(DEFAULT_CHATGPT)) {
    if (!(k in o) || typeof o[k] !== 'string') continue
    const v = o[k].trim()
    if (k === 'effort') out[k] = CHATGPT_EFFORTS.includes(v) ? v : ''
    else out[k] = v
  }
  return out
}

const num = (v) => (Number.isFinite(Number(v)) && v !== null && v !== '' ? Number(v) : 0)

/** A token set, or null when it holds no usable token (signed out). */
export function sanitiseTokens (o) {
  if (!o || typeof o !== 'object') return null
  const str = (v) => (typeof v === 'string' ? v : '')
  const t = {
    accessToken: str(o.accessToken),
    refreshToken: str(o.refreshToken),
    idToken: str(o.idToken),
    expiresAt: num(o.expiresAt),
    earliestRefreshAt: num(o.earliestRefreshAt)
  }
  return t.accessToken || t.refreshToken ? t : null
}
