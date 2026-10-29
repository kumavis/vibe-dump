// Share links (design §2.3). Everything lives in the URL FRAGMENT so none of it
// reaches a web server:
//   #doc=automerge:<id>&key=<editor secret>[&sync=<ws url>][&heads=<h1,h2>][&safe]
//   #doc=automerge:<id>&view=<HKDF(key,'view')>          (a view link)
// The role is carried by the parameter NAME (key vs view), so an agent that
// falls back to editing the doc directly can attenuate itself to WorldView
// without a host page to ask (§16.8). The doc URL alone is edit access to the
// doc: the public sync server has no auth.
export const DEFAULT_SYNC = 'wss://sync.automerge.org'

const B58 = /^[1-9A-HJ-NP-Za-km-z]+$/

function fragmentOf (hashOrUrl) {
  const s = String(hashOrUrl ?? '')
  const i = s.indexOf('#')
  return i >= 0 ? s.slice(i + 1) : s
}

// Accepts 'automerge:<id>' or a bare base58 document id; returns '' when it is neither,
// so a garbled link reads as "no doc" (create a new world) instead of a find() that hangs.
export function normalizeDocUrl (v) {
  const s = String(v ?? '').trim()
  const id = s.startsWith('automerge:') ? s.slice(10) : s
  return id && B58.test(id) ? `automerge:${id}` : ''
}

export function docIdOf (docUrl) {
  return normalizeDocUrl(docUrl).slice(10)
}

export function parseLink (hashOrUrl) {
  const q = new URLSearchParams(fragmentOf(hashOrUrl))
  const heads = (q.get('heads') ?? '').split(',').map((h) => h.trim()).filter(Boolean)
  return {
    docUrl: normalizeDocUrl(q.get('doc')),
    key: q.get('key') ?? '',
    view: q.get('view') ?? '',
    sync: q.get('sync') || DEFAULT_SYNC,
    heads: heads.length ? heads : null,
    // '#safe' and '#…&safe' both count; '&safe=0' is the explicit off switch
    safe: q.has('safe') && q.get('safe') !== '0',
  }
}

function baseOf (base) {
  if (base == null) return ''
  if (typeof base === 'string') return base.split('#')[0]
  // a Location or URL
  if (typeof base.origin === 'string' && typeof base.pathname === 'string') return `${base.origin === 'null' ? '' : base.origin}${base.pathname}${base.search ?? ''}`
  return String(base).split('#')[0]
}

// The parameter order is fixed (doc first) so links compare as strings in tests and logs.
export function buildLink ({ docUrl, key, view, sync, heads, safe } = {}, base = globalThis.location) {
  const doc = normalizeDocUrl(docUrl)
  if (!doc) throw new TypeError(`buildLink: not an automerge doc url: ${JSON.stringify(docUrl)}`)
  const parts = [`doc=${doc}`]
  if (key) parts.push(`key=${encodeURIComponent(key)}`)
  else if (view) parts.push(`view=${encodeURIComponent(view)}`)
  if (sync && sync !== DEFAULT_SYNC) parts.push(`sync=${encodeURIComponent(sync)}`)
  if (heads?.length) parts.push(`heads=${[...heads].map(String).join(',')}`)
  if (safe) parts.push('safe')
  return `${baseOf(base)}#${parts.join('&')}`
}

const b64url = (u8) => {
  let s = ''
  for (const b of u8) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// 128-bit bearer secret for the agent key.
export function newKey () {
  return b64url(crypto.getRandomValues(new Uint8Array(16)))
}

const PEER_KEY = 'mm:peer'

// Stable per tab (sessionStorage), so a reload keeps the same peer id and an owner
// pin written by this tab still names it. The repo MUST be created with this id:
// ephemeral messages arrive tagged with the sending repo's peerId, and presence,
// ownership and the pose stream all key on that.
export function peerIdFor (storage = globalThis.sessionStorage) {
  try {
    const have = storage?.getItem(PEER_KEY)
    if (have && /^p_[A-Za-z0-9_-]{6,32}$/.test(have)) return have
  } catch {}
  const id = 'p_' + b64url(crypto.getRandomValues(new Uint8Array(9)))
  try { storage?.setItem(PEER_KEY, id) } catch {}
  return id
}
