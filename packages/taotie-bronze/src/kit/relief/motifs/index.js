// STATUS: first pass — the registry. A new motif is one file in this folder
// plus one line in ./list.js (alphabetical). Each module's default export is
//   { name, label, schema, presets, draw(panel, rect, params), plaque?: { w, h } }
// `schema` drives the Motif Atlas controls; `plaque` is the atlas preview size in mm.

import { motifDefaults } from './schema.js'
import * as ALL from './list.js'

export const MOTIFS = {}

export function registerMotif(m) {
  if (!m || !m.name || typeof m.draw !== 'function') throw new Error('registerMotif: needs { name, draw }')
  MOTIFS[m.name] = m
  return m
}

/** Look up by name (or pass a module through). */
export function getMotif(nameOrMotif) {
  if (typeof nameOrMotif === 'object') return nameOrMotif
  const m = MOTIFS[nameOrMotif]
  if (!m) throw new Error(`unknown motif "${nameOrMotif}" (have: ${Object.keys(MOTIFS).join(', ')})`)
  return m
}

/** Defaults ← preset ← overrides, deep-merging `group` params. */
export function resolveMotifParams(nameOrMotif, overrides = {}, presetName) {
  const m = getMotif(nameOrMotif)
  const base = motifDefaults(m.schema)
  const preset = presetName ? m.presets?.[presetName] ?? {} : {}
  return deepMerge(deepMerge(base, preset), overrides)
}

function deepMerge(a, b) {
  const out = { ...a }
  for (const [k, v] of Object.entries(b || {})) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && a[k] && typeof a[k] === 'object' ? deepMerge(a[k], v) : v
  }
  return out
}

export { motifDefaults }

for (const m of Object.values(ALL)) registerMotif(m)
