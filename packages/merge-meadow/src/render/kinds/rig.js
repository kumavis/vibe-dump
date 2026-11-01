// rig: a data-driven articulated look (design §17). The renderer knows nothing
// about animals: it builds a model's named node tree (kinds/nodes.js, exactly what
// `tree` builds), compiles its clips once (rig/evaluator.js) and turns the sim's
// semantic state into clip layers (rig/controller.js).
//
//   { kind: 'rig', model: 'horse', color: '#ffffff', scale: 1 }      a model in doc.models
//   { kind: 'rig', nodes, animations?, controller? }                  inline (what `tree` is)
//
// The resolved model is a TEMPLATE resource keyed on the resolved key
// ('model:<name>:<revs>:<hash>' or 'inline:<hash>'), so 300 instances of one model
// resolve and compile once and share geometry (unit shapes) and materials.
// Editing a model bumps its rev and changes its content hash, which re-keys every
// look built on it: the reconciler asks stale() when the doc changes and rebuilds
// those. The hash is what catches a model that changed under the same revs (two
// peers defining one name from scratch, a remove + redefine).
//
// `tree` is an alias: the same implementation reading only the inline fields,
// so adding `animations` to a tree component animates it in place (same root,
// same meshes), never a kind swap.
import * as THREE from 'three'
import { resolveRepresentation, modelKeyOf, inlineKeyOf } from '../../doc/models.js'
import { geoKey, shapeGeo, normColor } from '../resources.js'
import { kindProp, defaultsOf, finite } from './common.js'
import { signature, buildNodes, patchNodes } from './nodes.js'
import { makeRigEvaluator, applyOffsets } from '../rig/evaluator.js'
import { makeRigController } from '../rig/controller.js'

export { signature }

const isObj = (v) => v != null && typeof v === 'object' && !Array.isArray(v)
const str = (v) => (v == null ? '' : String(v))

const json = (title) => ({ type: 'object', 'x-json': true, title })
export const rigSchema = {
  type: 'object',
  properties: {
    kind: kindProp('rig'),
    model: { type: 'string', title: 'model', default: 'quadruped', 'x-immutable': true },
    color: { type: 'string', format: 'color', title: 'colour', default: '#ffffff' },
    scale: { type: 'number', minimum: 0.01, maximum: 20, step: 0.05, title: 'scale', default: 1 },
    nodes: { type: 'array', 'x-json': true, title: 'nodes (inline)' },
    animations: json('animations (inline)'),
    controller: json('controller (inline)'),
  },
}
export const treeSchema = {
  type: 'object',
  properties: {
    kind: kindProp('tree'),
    nodes: { type: 'array', 'x-json': true, title: 'nodes', default: [{ shape: 'box', p: [0, 0.5, 0], s: [1, 1, 1], color: '#aa7744' }] },
    animations: json('animations'),
    controller: json('controller'),
  },
}

// ---- keys (cheap: no resolve) ----------------------------------------------------
// A model key walks the extends chain reading revs and per-link content hashes (own
// first: models.js modelKeyOf, the key resolveRepresentation reports); memoised per
// doc snapshot (an Automerge doc is a new object after every change, so a
// snapshot's keys never go stale; the link hashes are cached across snapshots).
let memoDoc = null
const memo = new Map()
export function modelKey (doc, name) {
  if (doc !== memoDoc) { memoDoc = doc; memo.clear() }
  const hit = memo.get(name)
  if (hit) return hit
  const key = modelKeyOf(doc?.models, name)
  memo.set(name, key)
  return key
}

// the look-defining part of a representation; `alias` (tree) reads only inline fields
function lookOf (d, alias) {
  const r = isObj(d) ? d : {}
  const model = alias ? '' : str(r.model)
  if (model) return { model }
  const body = { nodes: Array.isArray(r.nodes) ? r.nodes : [], animations: isObj(r.animations) ? r.animations : {}, controller: isObj(r.controller) ? r.controller : {} }
  if (r.stride != null) body.stride = r.stride
  if (r.runSpeed != null) body.runSpeed = r.runSpeed
  return { model: '', body }
}
export function lookKey (doc, d, alias = false) {
  const L = lookOf(d, alias)
  return L.model ? modelKey(doc, L.model) : inlineKeyOf(L.body)
}

// template = what every instance of one resolved key shares
function template (doc, L) {
  const resolved = L.model ? resolveRepresentation(doc, { kind: 'rig', model: L.model }) : resolveRepresentation(null, { kind: 'rig', ...L.body })
  if (!resolved) return null
  const evaluator = makeRigEvaluator(resolved)
  return { resolved, evaluator, sig: signature(resolved.nodes), stride: resolved.stride > 0 ? resolved.stride : 1, runSpeed: resolved.runSpeed > 0 ? resolved.runSpeed : 4 }
}
const disposeTemplate = (T) => T?.evaluator?.dispose()

const lookStyle = (d) => ({ color: normColor(d?.color, '#ffffff'), tint: d?.tint })
const scaleOf = (d) => Math.min(20, Math.max(0.01, finite(d?.scale, 1)))

function missing (root, res, why) {
  const m = new THREE.Mesh(res.use(root, geoKey('box'), shapeGeo('box')),
    res.use(root, 'mat:placeholder:unknown', () => new THREE.MeshBasicMaterial({ color: '#ff3cc8', wireframe: true })))
  m.position.y = 0.5; m.userData.notNode = true
  root.add(m); root.userData.error = why; root.userData.missing = true
}

function setTemplate (root, T) {
  const ud = root.userData
  ud.tpl = T; ud.stride = T.stride; ud.runSpeed = T.runSpeed
  ud.ctl = makeRigController(T.resolved)
  ud.offsets = new Map()
}

function make (alias) {
  return {
    create (d, ctx) {
      const { res } = ctx
      const doc = ctx.doc?.()
      const L = lookOf(d, alias)
      const key = lookKey(doc, d, alias)
      const root = new THREE.Group()
      const ud = root.userData
      ud.pick = 'mesh'; ud.key = key; ud.model = L.model; ud.bones = new Map(); ud.anchors = {}
      root.scale.setScalar(scaleOf(d))
      let T = null
      if (!key.startsWith('missing:') && !key.startsWith('broken:')) {
        // resolve once per key: later instances find the template already held
        if (res.has(key)) T = res.use(root, key, () => null, disposeTemplate)
        else {
          const fresh = template(doc, L)
          if (fresh) T = res.use(root, key, () => fresh, disposeTemplate)
        }
      }
      if (!T) { missing(root, res, L.model ? `unknown model ${JSON.stringify(L.model)}` : 'bad inline rig'); return root }
      ud.sig = T.sig
      buildNodes(root, T.resolved.nodes, res, lookStyle(d))
      setTemplate(root, T)
      return root
    },
    update (root, d, prev, ctx) {
      const { res } = ctx
      const ud = root.userData
      if (ud.missing) return false
      const doc = ctx.doc?.()
      const L = lookOf(d, alias)
      if (str(L.model) !== str(ud.model)) return false
      const key = lookKey(doc, d, alias)
      if (key !== ud.key) {
        // a model edit re-keys: rebuild (the reconciler swaps the child)
        if (L.model) return false
        // an inline edit: same structure -> keep the root and meshes, swap the template
        const fresh = res.has(key) ? null : template(doc, L)
        if (!res.has(key) && !fresh) return false
        const sig = res.has(key) ? signature(lookOf(d, alias).body.nodes) : fresh.sig
        if (sig !== ud.sig) return false
        const T = res.swap(root, ud.key, key, () => fresh, disposeTemplate)
        ud.key = key
        const keepState = ud.ctl?.state
        setTemplate(root, T)
        if (keepState) ud.ctl.set(keepState, ud.lastT ?? 0)
      }
      patchNodes(root, ud.tpl.resolved.nodes, res, lookStyle(d))
      root.scale.setScalar(scaleOf(d))
      // patching re-posed every node to rest: put the last animated pose back
      // (a halted, dead rig must not snap up when the dead tint arrives)
      applyOffsets(root, ud.offsets)
    },
    dispose () {},
    // the model under this look was redefined (or appeared): rebuild
    stale (root, d, ctx) {
      const ud = root.userData
      if (!ud.model && !ud.missing) return false
      const L = lookOf(d, alias)
      return L.model ? modelKey(ctx.doc?.(), L.model) !== ud.key : false
    },
    anchors: (root) => root.userData.anchors ?? {},
    // vars: { t, st, phase, speed, gait, turn, hp, rand, idx } from the reconciler;
    // without them (an older caller) the look keeps its own clock
    animate (root, state, mapping, dt, vars) {
      const ud = root.userData
      const ctl = ud.ctl
      if (!ctl || !ud.tpl.evaluator.clips.length) return
      let v = vars
      if (!v) {
        const own = ud.ownVars ||= { t: 0, st: 0, phase: 0, speed: 0, gait: 0, turn: 0, hp: 1, rand: 0, idx: 0, state: null }
        own.t += finite(dt, 0)
        if (own.state !== state) { own.state = state; own.st = 0 } else own.st += finite(dt, 0)
        v = own
      }
      ud.lastT = v.t
      ctl.set(state, v.t, { mapping, since: v.st })
      if (ctl.halted) return
      ud.tpl.evaluator.evaluate(ctl.layers(v.t), v, ud.offsets)
      applyOffsets(root, ud.offsets)
    },
  }
}

const rigImpl = make(false)
const treeImpl = make(true)

export default {
  schema: rigSchema,
  defaults: defaultsOf(rigSchema),
  signature,
  ...rigImpl,
}

// `tree` = a rig with inline nodes (and, optionally, animations and a controller)
export const treeAlias = {
  schema: treeSchema,
  defaults: defaultsOf(treeSchema),
  signature,
  alias: 'rig',
  ...treeImpl,
}
