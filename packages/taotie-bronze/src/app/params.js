// URL parameters, read once at boot (the verification hooks in KIT.md), plus
// the plain `#name` fragment a query-stripping host still passes through, and
// the device defaults (a phone builds lighter and renders at a capped DPR).

export const MODES = ['beauty', 'clay', 'silhouette', 'height', 'mask']

/** Fragment → a route name (letters, digits and hyphens only), or null. */
export function readHash(hash = location.hash) {
  let s = String(hash || '').replace(/^#/, '')
  try {
    s = decodeURIComponent(s)
  } catch {
    return null
  }
  s = s.trim()
  return /^[A-Za-z0-9-]{1,80}$/.test(s) ? s : null
}

/** A phone or small tablet: coarse pointer on a small screen, or a small viewport. */
export function isCompactDevice() {
  const mm = (q) => {
    try {
      return window.matchMedia(q).matches
    } catch {
      return false
    }
  }
  const short = Math.min(screen?.width || 9999, screen?.height || 9999)
  return (mm('(pointer: coarse)') && short <= 820) || Math.min(window.innerWidth, window.innerHeight) <= 500 || window.innerWidth <= 720
}

const store = {
  get(k) {
    try {
      return window.localStorage?.getItem(k) ?? null
    } catch {
      return null
    }
  },
  set(k, v) {
    try {
      if (v == null) window.localStorage?.removeItem(k)
      else window.localStorage?.setItem(k, String(v))
    } catch {
      /* private mode, blocked storage, sandboxed frame: preferences just don't persist */
    }
  },
}
export { store }

export const QUALITY_KEY = 'taotie-bronze.quality'

export function readParams(search = location.search, hash = location.hash) {
  const q = new URLSearchParams(search)
  const num = (k) => {
    const v = parseFloat(q.get(k))
    return Number.isFinite(v) ? v : null
  }
  const mode = q.get('mode')
  const compact = isCompactDevice()
  const route = readHash(hash)
  // quality: ?q= wins, then the viewer's remembered choice, then the device default
  const stored = parseFloat(store.get(QUALITY_KEY))
  const qUrl = num('q')
  const quality = qUrl ?? (Number.isFinite(stored) ? stored : compact ? 0.5 : 1)
  const dpr = num('dpr')
  const tabParam = q.get('tab')
  return {
    a: q.get('a'),
    view: q.get('view'),
    patina: q.get('patina'),
    mode: MODES.includes(mode) ? mode : 'beauty',
    ui: q.get('ui') !== '0',
    q: Math.min(4, Math.max(0.25, quality)),
    qExplicit: qUrl != null,
    compact,
    // device pixel ratio cap: ≤ 2 everywhere (a phone's 3× screen is not worth 2.25× the fill)
    dpr: Math.min(3, Math.max(0.5, dpr ?? Math.min(window.devicePixelRatio || 1, 2))),
    tab: tabParam === 'atlas' || (!tabParam && !q.get('a') && route === 'atlas') ? 'atlas' : 'vessels',
    motif: q.get('motif'),
    preset: q.get('preset'),
    route,
  }
}
