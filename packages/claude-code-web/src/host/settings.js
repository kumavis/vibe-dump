// The user's settings: credentials, API base URL, model, custom tools and
// permission behaviour.
//
// Where they live: on GitHub Pages this page's origin (kumavis.github.io) is
// shared with every other gallery app and every other Pages site of the
// account, and any script on that origin can read its localStorage. So the
// credential (API key or token) is NOT written to localStorage by default:
//
//   cc-web:settings  localStorage    everything except the credential, plus
//                                    the credential only when `remember` is on
//   cc-web:secrets   sessionStorage  the credential while `remember` is off:
//                                    kept across reloads of this tab, gone
//                                    when the tab closes
//
// Turning `remember` off removes the credential from localStorage at once.
// A credential an older build left in localStorage without `remember` is
// moved to sessionStorage on load.

import { DEFAULT_API_BASE } from './constants.js'
import { DEFAULT_TOOLS_JSON } from './custom-tools.js'
import { createJsonStore } from './persist.js'

export const SETTINGS_KEY = 'cc-web:settings'
export const SECRETS_KEY = 'cc-web:secrets'
export const SECRET_FIELDS = Object.freeze(['apiKey', 'token'])

export const DEFAULT_SETTINGS = Object.freeze({
  // API key is the default: browser-direct API-key use is officially
  // supported. The setup-token (OAuth) mode is the gray area (README).
  authMode: 'api-key', // 'api-key' | 'oauth'
  apiKey: '',
  token: '',
  remember: false, // keep the credential in localStorage ("Remember on this device")
  baseUrl: DEFAULT_API_BASE,
  model: '',
  toolsJson: DEFAULT_TOOLS_JSON,
  askPermission: false
})

const pick = (o, keys) => Object.fromEntries(keys.filter((k) => k in o).map((k) => [k, o[k]]))
const omit = (o, keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)))
const hasSecret = (o) => SECRET_FIELDS.some((k) => o[k])

/**
 * @param {object} [o]
 * @param {Storage} [o.storage]         localStorage (default globalThis.localStorage)
 * @param {Storage} [o.sessionStorage]  sessionStorage (default globalThis.sessionStorage)
 */
export function createSettings ({ storage, sessionStorage } = {}) {
  const local = createJsonStore(SETTINGS_KEY, { storage, area: 'localStorage' })
  const tab = createJsonStore(SECRETS_KEY, { storage: sessionStorage, area: 'sessionStorage' })
  const saved = sanitise(local.load()) ?? {}
  const secrets = pick(sanitise(tab.load()) ?? {}, SECRET_FIELDS)
  let value = { ...DEFAULT_SETTINGS, ...saved, ...secrets }
  // an older build kept the credential in localStorage: move it out
  if (!value.remember && hasSecret(saved)) persist()

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

  return {
    get: () => ({ ...value }),
    /** The settings without the credential: safe to show or log. */
    getPublic: () => ({ ...omit(value, SECRET_FIELDS), hasCredential: Boolean(value.authMode === 'oauth' ? value.token : value.apiKey) }),
    set (patch) {
      value = { ...value, ...sanitise(patch) }
      persist()
      return { ...value }
    },
    reset () { value = { ...DEFAULT_SETTINGS }; local.clear(); tab.clear(); return { ...value } }
  }
}

function sanitise (o) {
  if (!o || typeof o !== 'object') return null
  const out = {}
  for (const k of Object.keys(DEFAULT_SETTINGS)) {
    if (!(k in o)) continue
    const v = o[k]
    if (k === 'askPermission' || k === 'remember') out[k] = Boolean(v)
    else if (k === 'authMode') out[k] = v === 'oauth' ? 'oauth' : 'api-key'
    else if (typeof v === 'string') out[k] = v
  }
  return out
}
