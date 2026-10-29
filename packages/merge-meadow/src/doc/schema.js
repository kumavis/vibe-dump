// Schema v1 of the merge-meadow doc (design §2.1, ARCHITECTURE §4).
import { ImmutableString } from './convert.js'

export const SCHEMA_VERSION = 1

// Fields stored as ImmutableString (rule §2.5). In practice ops.js stores EVERY
// string of component data as ImmutableString; this list is the contract other
// tracks can rely on when they compare (always via String(x)).
export const IMMUTABLE_KEYS = Object.freeze(['name', 'parent', 'preset', 'owner', 'type', 'from', 'kind', 'rig', 'shape', 'image', 'url', 'act'])

const NAME_RE = /^[A-Za-z_][A-Za-z0-9_-]{0,63}$/
export const ID_RE = /^[A-Za-z0-9_][A-Za-z0-9_:.-]{0,79}$/
export const isName = (s) => typeof s === 'string' && NAME_RE.test(s)
export const isId = (s) => typeof s === 'string' && ID_RE.test(s)

export const slug = (s) => String(s || 'e').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'e'

const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyz'
function randomChars (n) {
  const out = []
  const c = globalThis.crypto
  if (c && typeof c.getRandomValues === 'function') {
    const b = c.getRandomValues(new Uint8Array(n))
    for (let i = 0; i < n; i++) out.push(ALPHA[b[i] % 36])
  } else {
    for (let i = 0; i < n; i++) out.push(ALPHA[Math.floor(Math.random() * 36)])
  }
  return out.join('')
}

export function newId (prefix = 'e') { return `${slug(prefix)}-${randomChars(5)}` }

const I = (s) => new ImmutableString(String(s ?? ''))

export const DEFAULT_WORLD = Object.freeze({ bounds: 40, ground: { color: '#7fb069' }, sky: { color: '#a8d8ff' } })

// Mutates a fresh doc proxy into schema v1. Each map is assigned and then left
// for callers to re-read from `d` (an assigned literal is copied into the doc).
export function initDoc (d, { title = 'Merge Meadow' } = {}) {
  d.schema = SCHEMA_VERSION
  d.meta = { title: I(title), created: Date.now() }
  d.world = { bounds: DEFAULT_WORLD.bounds, ground: { color: I(DEFAULT_WORLD.ground.color) }, sky: { color: I(DEFAULT_WORLD.sky.color) }, disabledSystems: {} }
  for (const k of ['entities', 'presets', 'components', 'systems', 'assets']) if (!d[k]) d[k] = {}
  return d
}

export function migrate (d) {
  if (d.schema == null) d.schema = SCHEMA_VERSION
  return d
}
