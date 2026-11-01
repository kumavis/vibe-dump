// Track B's rig tests run while track A writes src/doc/models.js. When that file
// is not there yet, `useModelsFake()` installs a module resolve hook (test only)
// that serves a minimal stand-in with the §6.1 export names, so world-caps and
// rig-panel load. With the real file present this does nothing.
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { register } from 'node:module'

export const MODELS_PATH = fileURLToPath(new URL('../../src/doc/models.js', import.meta.url))
export const haveRealModels = () => existsSync(MODELS_PATH)

const FAKE = `
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const clone = (v) => JSON.parse(JSON.stringify(v ?? null))
export const CHANNELS = ['rx','ry','rz','px','py','pz','sx','sy','sz']
export const LIMITS = { nodes: 200, tracks: 400, depth: 8, extendsDepth: 8 }
export const MODEL_LIBRARY = {}
export function nodeNames (nodes, out = []) { for (const n of nodes ?? []) { if (n?.name) out.push(String(n.name)); nodeNames(n?.children, out) } return out }
function patch (base, own) {
  const byName = new Map(own.filter((n) => n?.name).map((n) => [String(n.name), n]))
  const used = new Set()
  const walk = (list) => list.map((n) => { const o = n?.name && byName.get(String(n.name)); if (o) used.add(String(n.name)); return { ...n, ...(o ?? {}), children: walk(n.children ?? []) } })
  return [...walk(base), ...own.filter((n) => !n?.name || !used.has(String(n.name)))]
}
export function resolveModel (models, name, seen = []) {
  const m = models?.[name]
  if (!isObj(m)) return null
  if (seen.includes(name)) throw new Error('extends cycle: ' + [...seen, name].join(' -> '))
  if (seen.length > 8) throw new Error('extends too deep')
  const base = m.extends ? resolveModel(models, String(m.extends), [...seen, name]) : null
  const b = base ?? { nodes: [], animations: {}, controller: {}, stride: 1, runSpeed: 4 }
  return clone({ stride: m.stride ?? b.stride, runSpeed: m.runSpeed ?? b.runSpeed, nodes: patch(b.nodes, m.nodes ?? []), animations: { ...b.animations, ...(m.animations ?? {}) }, controller: { ...b.controller, ...(m.controller ?? {}), states: { ...(b.controller?.states ?? {}), ...(m.controller?.controller?.states ?? m.controller?.states ?? {}) } } })
}
export function validateModel (model, models) {
  const out = []
  const names = nodeNames(model?.nodes ?? [])
  for (const [clip, c] of Object.entries(model?.animations ?? {})) for (const [k, v] of Object.entries(c?.tracks ?? {})) {
    const [node, ch] = k.split('.')
    if (!names.includes(node)) out.push('animations.' + clip + ': no node ' + node)
    if (!CHANNELS.includes(ch)) out.push('animations.' + clip + ': bad channel ' + ch)
    if (typeof v === 'string' && /[^\\w\\s.+\\-*/%()<>=!&|?:,]/.test(v)) out.push('animations.' + clip + '.' + k + ': SyntaxError')
    if (typeof v === 'string' && (v.split('(').length !== v.split(')').length)) out.push('animations.' + clip + '.' + k + ': SyntaxError: unbalanced parentheses')
  }
  return out
}
export function resolveRepresentation () { return null }
export function ensureLibraryOps () { return [] }
`

let installed = false
export function useModelsFake () {
  if (installed || haveRealModels()) return false
  installed = true
  const target = new URL('../../src/doc/models.js', import.meta.url).href
  const hooks = `export async function resolve (spec, ctx, next) {
    if (spec.endsWith('/doc/models.js') || spec === ${JSON.stringify(target)}) return { url: 'data:text/javascript,' + encodeURIComponent(${JSON.stringify(FAKE)}), shortCircuit: true }
    return next(spec, ctx)
  }`
  register('data:text/javascript,' + encodeURIComponent(hooks))
  return true
}
