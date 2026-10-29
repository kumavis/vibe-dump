// Every read that leaves the core goes through here (rule §2.4): fresh plain
// data, never a doc proxy or a world row. CapTP's marshal hardens what it sends,
// so a shared object handed out once would be frozen for its owner too.
import { plain, isObj } from './convert.js'
import { resolveEntity, presetChain } from './presets.js'

export { plain }

const str = (v) => (v == null ? '' : String(plain(v)))

// hp from a health ledger { max, armor, hits: { [hitId]: amount } }
export function hp (health) {
  if (!health || typeof health !== 'object') return null
  const max = Number(plain(health.max) ?? 0)
  const armor = Number(plain(health.armor) ?? 0)
  let dmg = 0
  const hits = health.hits
  if (hits && typeof hits === 'object') for (const k of Object.keys(hits)) { const a = Number(plain(hits[k])); if (Number.isFinite(a)) dmg += Math.max(0, a - armor) }
  return Math.min(max, Math.max(0, max - dmg))
}

function row (doc, id, e, r) {
  return {
    id,
    name: str(e.name),
    parent: str(e.parent),
    preset: str(e.preset),
    owner: str(e.owner),
    components: plain(e.components ?? {}),
    effective: plain(r?.components ?? {}),
    groups: Object.keys(e.groups ?? {}).filter((g) => e.groups[g]).sort(),
    inbox: plain(e.inbox ?? {}),
  }
}

export function entityData (doc, id) {
  const e = doc?.entities?.[id]
  if (!e) return null
  return row(doc, id, e, resolveEntity(doc, e))
}

const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v])

// Filters match EFFECTIVE components (spike S3 found 0 of 51 preset-spawned sheep
// by tag otherwise). `preset` matches any preset in the entity's chain.
export function listEntities (doc, { has, tags, name, parent, preset } = {}) {
  const hasL = asList(has).map(String); const tagL = asList(tags).map(String)
  const out = []
  for (const id of Object.keys(doc?.entities ?? {}).sort()) {
    const e = doc.entities[id]
    if (name != null && str(e.name) !== String(name)) continue
    if (parent != null && str(e.parent) !== String(parent)) continue
    const r = resolveEntity(doc, e)
    if (preset != null && !presetChain(doc, str(e.preset)).filter((n) => doc.presets?.[n]).includes(String(preset))) continue
    const c = r?.components ?? {}
    if (!hasL.every((k) => k in c)) continue
    if (!tagL.every((t) => c.tags && c.tags[t])) continue
    out.push(row(doc, id, e, r))
  }
  return out
}

export function presetData (doc, name) {
  const p = doc?.presets?.[name]
  if (!p) return null
  const d = plain(p)
  return { name, extends: d.extends ?? '', components: d.components ?? {}, groups: d.groups ?? {}, chain: presetChain(doc, name).filter((n) => doc.presets?.[n]) }
}

export function docSummary (doc) {
  const systems = Object.keys(doc?.systems ?? {}).sort().map((name) => {
    const s = doc.systems[name]
    return { name, order: Number(plain(s.order) ?? 950), enabled: plain(s.enabled) !== false, rev: Number(plain(s.rev) ?? 0) }
  })
  return {
    title: str(doc?.meta?.title),
    schema: Number(plain(doc?.schema) ?? 0),
    entities: Object.keys(doc?.entities ?? {}).length,
    presets: Object.keys(doc?.presets ?? {}).sort(),
    components: Object.keys(doc?.components ?? {}).sort(),
    systems,
    world: isObj(doc?.world) ? plain(doc.world) : {},
  }
}

export function componentData (doc, name) {
  const c = doc?.components?.[name]
  return c ? { name, ...plain(c) } : null
}

export function systemData (doc, name) {
  const s = doc?.systems?.[name]
  if (!s) return null
  return { name, source: String(s.source ?? ''), order: Number(plain(s.order) ?? 950), enabled: plain(s.enabled) !== false, rev: Number(plain(s.rev) ?? 0) }
}
