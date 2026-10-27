// The user's settings: credentials, API base URL, model, custom tools and
// permission behaviour. Stored in localStorage on this device only.

import { DEFAULT_API_BASE } from './constants.js'
import { DEFAULT_TOOLS_JSON } from './custom-tools.js'
import { createJsonStore } from './persist.js'

export const SETTINGS_KEY = 'cc-web:settings'

export const DEFAULT_SETTINGS = Object.freeze({
  // API key is the default: browser-direct API-key use is officially
  // supported. The setup-token (OAuth) mode is the gray area (README).
  authMode: 'api-key', // 'api-key' | 'oauth'
  apiKey: '',
  token: '',
  baseUrl: DEFAULT_API_BASE,
  model: '',
  toolsJson: DEFAULT_TOOLS_JSON,
  askPermission: false
})

export function createSettings ({ storage } = {}) {
  const store = createJsonStore(SETTINGS_KEY, { storage })
  let value = { ...DEFAULT_SETTINGS, ...(sanitise(store.load()) ?? {}) }
  return {
    get: () => ({ ...value }),
    set (patch) {
      value = { ...value, ...sanitise(patch) }
      store.save(value)
      return { ...value }
    },
    reset () { value = { ...DEFAULT_SETTINGS }; store.clear(); return { ...value } }
  }
}

function sanitise (o) {
  if (!o || typeof o !== 'object') return null
  const out = {}
  for (const k of Object.keys(DEFAULT_SETTINGS)) {
    if (!(k in o)) continue
    const v = o[k]
    if (k === 'askPermission') out[k] = Boolean(v)
    else if (k === 'authMode') out[k] = v === 'oauth' ? 'oauth' : 'api-key'
    else if (typeof v === 'string') out[k] = v
  }
  return out
}
