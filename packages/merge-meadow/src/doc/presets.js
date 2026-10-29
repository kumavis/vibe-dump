// Seed vocabulary (design §3.3, §7.4) and preset resolution (§3.1).
// None of the components knows what a T-rex is; the presets are data, copied
// into every new doc and editable there.
import { plain, isObj } from './convert.js'

const vec3 = (title, def) => ({ type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3, title, default: def })
const names = (title) => ({ type: 'array', items: { type: 'string' }, title, default: [] })
const filter = (title) => ({ type: 'object', 'x-filter': true, title })
const color = (title, def) => ({ type: 'string', format: 'color', title, default: def })

const DRIVE = {
  type: 'object',
  required: ['act'],
  properties: {
    act: { enum: ['pursue', 'flee', 'seek', 'wander', 'steer', 'follow', 'idle'], title: 'act' },
    match: filter('who it reacts to'),
    when: filter('only while I match'),
    range: { type: 'number', minimum: 0, maximum: 500, title: 'range (m)' },
    weight: { type: 'number', minimum: 0, maximum: 100, title: 'weight' },
    priority: { type: 'number', minimum: -100, maximum: 100, title: 'priority' },
    speedMul: { type: 'number', minimum: 0, maximum: 10, title: 'speed ×' },
    distance: { type: 'number', minimum: 0, maximum: 100, title: 'follow distance (m)' },
  },
}

const def = (order, description, defaults, schema) => ({ description, order, defaults, schema })

export const COMPONENT_DEFS = deepFreeze({
  transform: def(-100, 'Rest pose: position (m), Euler rotation (degrees), scale. Live motion is not stored here.',
    { p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] },
    { type: 'object', properties: { p: vec3('position', [0, 0, 0]), r: vec3('rotation (deg)', [0, 0, 0]), s: vec3('scale', [1, 1, 1]) } }),
  body: def(0, 'A moving body: top speed (m/s), acceleration (m/s²), radius (m), turn rate (rad/s, 0 = instant).',
    { speed: 3, accel: 12, radius: 0.5 },
    { type: 'object', properties: { speed: { type: 'number', minimum: 0, maximum: 60, title: 'speed' }, accel: { type: 'number', minimum: 0, maximum: 500, title: 'accel' }, radius: { type: 'number', minimum: 0.05, maximum: 20, title: 'radius' }, turn: { type: 'number', minimum: 0, maximum: 50, title: 'turn rate' }, hover: { type: 'number', minimum: -10, maximum: 50, title: 'height above ground' } } }),
  tags: def(0, 'A set of labels other entities filter on (prey, predator, …).', {},
    { type: 'object', additionalProperties: { type: 'boolean' } }),
  perception: def(0, 'How far this entity notices others (m).', { radius: 15 },
    { type: 'object', properties: { radius: { type: 'number', minimum: 0, maximum: 500, title: 'radius' } } }),
  brain: def(0, 'Utility-scored drives; the best-scoring drive with a match wins, otherwise `idle`.',
    { idle: 'wander', stickiness: 0.15, drives: {} },
    { type: 'object', properties: { idle: { enum: ['wander', 'idle'], title: 'when nothing matches' }, stickiness: { type: 'number', minimum: 0, maximum: 10, title: 'stickiness' }, drives: { type: 'object', additionalProperties: DRIVE, title: 'drives' } } }),
  attack: def(0, 'Melee: damage per hit, reach beyond both radii (m), cooldown (s); `match` attacks any sensed match instead of the pursued target.',
    { damage: 10, reach: 1, cooldown: 1 },
    { type: 'object', properties: { damage: { type: 'number', minimum: 0, maximum: 100000, title: 'damage' }, reach: { type: 'number', minimum: 0, maximum: 50, title: 'reach' }, cooldown: { type: 'number', minimum: 0, maximum: 60, title: 'cooldown' }, match: filter('attack whatever matches'), acts: names('attack while acting') } }),
  health: def(0, 'Hit points as a ledger: hp = max − Σ max(0, hit − armor). Hits are written once per hit id, so concurrent and repeated writes count once.',
    { max: 50, armor: 0, hits: {} },
    { type: 'object', properties: { max: { type: 'number', minimum: 0, maximum: 1e6, title: 'max hp' }, armor: { type: 'number', minimum: 0, maximum: 1e6, title: 'armor' }, hits: { type: 'object', additionalProperties: { type: 'number', minimum: 0 }, 'x-hidden': true } } }),
  on: def(0, 'Reactions: on an event (died, hurt, or any emitted type) add or remove component groups.',
    { died: { add: ['dead'] } },
    { type: 'object', additionalProperties: { type: 'object', properties: { add: names('add groups'), remove: names('remove groups') }, additionalProperties: false } }),
  controller: def(0, 'Driven by an input source (a player, a VR controller, an agent puppet).', { kind: 'input' },
    { type: 'object', properties: { kind: { enum: ['input'], title: 'kind' } } }),
  mount: def(0, 'Seats riders can take. A seat names a render anchor and falls back to its offset; a controlling seat steers unless a drive with priority ≥ panicPriority wins.',
    { seats: [{ anchor: 'seat', offset: [0, 1.5, 0], controls: true }], panicPriority: 5 },
    { type: 'object', properties: { seats: { type: 'array', maxItems: 16, items: { type: 'object', properties: { name: { type: 'string' }, anchor: { type: 'string', 'x-immutable': true }, offset: vec3('offset', [0, 1.5, 0]), controls: { type: 'boolean' } } } }, panicPriority: { type: 'number', minimum: -100, maximum: 1000, title: 'panic priority' } } }),
  rider: def(0, 'Riding a mount: the only stored side of the relation.', { mount: '', seat: 0 },
    { type: 'object', properties: { mount: { type: 'string', 'x-immutable': true, title: 'mount id' }, seat: { type: 'integer', minimum: 0, maximum: 15, title: 'seat' } } }),
  representation: def(10, 'How the entity looks. `kind` picks a renderer; the other fields belong to that kind.',
    { kind: 'billboard', image: 'emoji:❓', size: 1 },
    { type: 'object', required: ['kind'], properties: { kind: { enum: ['billboard', 'primitive', 'tree', 'model', 'critter'], 'x-immutable': true, title: 'kind' }, tint: color('tint', '#ffffff') } }),
  animation: def(10, 'Maps semantic states (idle, walk, run, attack, die, sit) to clip names of a model.', { clips: {} },
    { type: 'object', properties: { clips: { type: 'object', additionalProperties: { type: 'string' } } } }),
  light: def(10, 'A light attached to the entity.', { kind: 'point', color: '#ffd59a', intensity: 6, distance: 12 },
    { type: 'object', properties: { kind: { enum: ['point', 'spot', 'directional', 'ambient', 'hemisphere'], title: 'kind' }, color: color('colour', '#ffd59a'), intensity: { type: 'number', minimum: 0, maximum: 1000, title: 'intensity' }, distance: { type: 'number', minimum: 0, maximum: 1000, title: 'distance' }, offset: vec3('offset', [0, 0, 0]) } }),
})

const drive = (act, match, extra = {}) => ({ act, match, ...extra })

export const PRESETS = deepFreeze({
  creature: {
    extends: '',
    components: {
      tags: { creature: true },
      body: { speed: 3, accel: 12, radius: 0.5 },
      perception: { radius: 15 },
      brain: { idle: 'wander', stickiness: 0.15, drives: {} },
      health: { max: 50, armor: 0 },
      on: { died: { add: ['dead'] } },
    },
    groups: {
      // death is data: the group strips what made it act and greys it out
      dead: { components: { tags: { dead: true }, representation: { tint: '#555555' } }, remove: ['brain', 'attack', 'perception', 'controller', 'rider', 'body'] },
    },
  },
  trex: {
    extends: 'creature',
    components: {
      tags: { predator: true },
      body: { speed: 6, accel: 8, radius: 1.5 },
      perception: { radius: 25 },
      // a hunt range: past 15 m the T-rex gives up and wanders (prey can get away)
      brain: { drives: { hunt: drive('pursue', { tags: ['prey'], notTags: ['dead'] }, { weight: 2, range: 15 }) } },
      attack: { damage: 25, reach: 1.5, cooldown: 1.2 },
      health: { max: 200, armor: 2 },
      representation: { kind: 'billboard', image: 'emoji:🦖', size: 3 },
    },
  },
  sheep: {
    extends: 'creature',
    components: {
      tags: { prey: true },
      // faster than the T-rex (6): it catches unaware or cornered sheep, not every sheep
      body: { speed: 6.5, accel: 12, radius: 0.6 },
      perception: { radius: 15 },
      brain: { drives: { flee: drive('flee', { tags: ['predator'], notTags: ['dead'] }, { weight: 3, range: 12 }) } },
      health: { max: 30, armor: 0 },
      representation: { kind: 'billboard', image: 'emoji:🐑', size: 1.2 },
    },
  },
  horse: {
    extends: 'creature',
    components: {
      tags: { prey: true },
      body: { speed: 9, accel: 12, radius: 0.9 },
      perception: { radius: 18 },
      brain: { drives: { flee: drive('flee', { tags: ['predator'], notTags: ['dead'] }, { weight: 2, range: 14 }) } },
      mount: { seats: [{ name: 'saddle', anchor: 'seat', offset: [0, 1.6, -0.2], controls: true }], panicPriority: 5 },
      health: { max: 80, armor: 0 },
      representation: { kind: 'billboard', image: 'emoji:🐎', size: 2.2 },
    },
  },
  tree: {
    extends: '',
    components: {
      tags: { tree: true, static: true },
      representation: { kind: 'tree', nodes: [
        { shape: 'cylinder', p: [0, 1, 0], s: [0.35, 2, 0.35], color: '#7a5230' },
        { shape: 'cone', p: [0, 3.2, 0], s: [2.4, 3, 2.4], color: '#2f7d32' },
      ] },
    },
  },
  rock: {
    extends: '',
    components: {
      tags: { rock: true, static: true },
      representation: { kind: 'primitive', shape: 'sphere', size: [1.4, 0.9, 1.1], color: '#8a8a8a', roughness: 0.95, metalness: 0 },
    },
  },
  lamp: {
    extends: '',
    components: {
      tags: { lamp: true, static: true },
      representation: { kind: 'tree', nodes: [
        { shape: 'cylinder', p: [0, 1.25, 0], s: [0.12, 2.5, 0.12], color: '#3a3a3a' },
        { shape: 'sphere', p: [0, 2.65, 0], s: [0.45, 0.45, 0.45], color: '#fff2c4' },
      ] },
      light: { kind: 'point', color: '#ffd59a', intensity: 6, distance: 12, offset: [0, 2.65, 0] },
    },
  },
})

function deepFreeze (o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const k of Object.keys(o)) deepFreeze(o[k]) }
  return o
}

// Overlay `src` onto the fresh object `dst`: null deletes, objects merge (into a
// fresh copy, never into a doc object), arrays and scalars replace by reference.
// Untouched subtrees keep the doc's identity, which is what lets the world
// compare components by reference before falling back to a deep compare.
function overlay (dst, src) {
  for (const k of Object.keys(src)) {
    const v = src[k]
    if (v === null) delete dst[k]
    // an own map holding only empty maps (withOwnMaps) changes nothing: keep the
    // inherited object's identity, so untouched components still compare by reference
    else if (isObj(v) && isObj(dst[k])) { if (!isHollow(v)) dst[k] = overlay({ ...dst[k] }, v) }
    else dst[k] = v
  }
  return dst
}

const extendsOf = (p) => {
  const e = p?.extends
  if (e == null) return []
  return (Array.isArray(e) ? e : [e]).map((x) => String(x)).filter(Boolean)
}

// Preset chain, base first. `visited` also records names that do not exist (yet),
// so the world can re-resolve instances when such a preset is defined later.
function chainOf (doc, name, seen = new Set(), visited = []) {
  if (!name || seen.has(name) || seen.size > 16) return []
  seen.add(name); visited.push(name)
  const p = doc?.presets?.[name]
  if (!p) return []
  const out = []
  for (const base of extendsOf(p)) out.push(...chainOf(doc, base, seen, visited))
  out.push([name, p])
  return out
}

const groupOrder = (g) => (Number.isFinite(g?.order) ? g.order : 0)

// Full resolution: { components, chain (names visited, incl. missing), groupDefs, active }
export function resolveEntity (doc, idOrEntity) {
  const own = typeof idOrEntity === 'string' ? doc?.entities?.[idOrEntity] : idOrEntity
  if (!own) return null
  const visited = []
  const chain = chainOf(doc, String(own.preset ?? ''), new Set(), visited)
  let out = {}
  const groupDefs = {}
  for (const [, p] of chain) {
    if (isObj(p.components)) out = overlay(out, p.components)
    if (isObj(p.groups)) for (const g of Object.keys(p.groups)) groupDefs[g] = p.groups[g] // later preset replaces a group wholesale
  }
  if (isObj(own.components)) {
    // a merge target spawn created (withOwnMaps) adds nothing once nothing is inherited there
    const h = isObj(own.hollow) ? own.hollow : null
    let mine = own.components
    if (h) { mine = {}; for (const k of Object.keys(own.components)) { const v = own.components[k]; if (!(h[k] && !(k in out) && isHollow(v))) mine[k] = v } }
    out = overlay(out, mine)
  }
  // groups layer last (a dead rider must stop steering), in a stable order
  const active = Object.keys(own.groups ?? {}).filter((g) => own.groups[g] && groupDefs[g])
    .sort((a, b) => groupOrder(groupDefs[a]) - groupOrder(groupDefs[b]) || (a < b ? -1 : a > b ? 1 : 0))
  for (const g of active) {
    const gd = groupDefs[g]
    if (isObj(gd.components)) out = overlay(out, gd.components)
    for (const r of gd.remove ?? []) delete out[String(r)]
  }
  return { components: out, chain: visited, groupDefs, active }
}

// preset chain -> own -> active groups; null removes. Doc-backed references
// (structural sharing) for the world; read.js wraps the result in plain().
export function effectiveComponents (doc, idOrEntity) {
  return resolveEntity(doc, idOrEntity)?.components ?? null
}

export function presetChain (doc, name) { const v = []; chainOf(doc, name, new Set(), v); return v }

// plain copy of the component defs as a validation table: the doc's defs win,
// built-in defs cover components a doc never defined
export function componentDefsOf (doc) { return { ...plain(COMPONENT_DEFS), ...plain(doc?.components ?? {}) } }

// The own components a new entity should start with: what it was given, plus an
// EMPTY own map for every object-valued component it only inherits, and an own
// `health.hits` ledger. Without them the first `set` or `hit` on an inherited
// component assigns a brand-new map, and two peers doing that concurrently
// conflict: one side's field edit or damage hit is silently lost (design §2.2,
// "concurrent hits survive", "set merges fields"). An empty own map overrides
// nothing (overlay merges into a copy). `transform` is always own already.
// The names it created are returned as `hollow` and stored on the entity
// (`entity.hollow`), so a merge target whose inherited component later goes away
// (preset edited or changed) stays invisible instead of becoming an empty
// component; an empty component someone adds on purpose is not in that list.
export function withOwnMaps (doc, { preset = '', components = {}, groups = [] } = {}) {
  const own = { ...(isObj(components) ? components : {}) }
  const hollow = {}
  const gs = {}
  for (const g of Array.isArray(groups) ? groups : Object.keys(groups ?? {})) gs[g] = true
  const eff = effectiveComponents(doc, { preset, components: own, groups: gs }) ?? {}
  for (const [k, v] of Object.entries(eff)) {
    if (k === 'transform' || own[k] === null) continue
    if (isObj(v) && !isObj(own[k])) { own[k] = {}; hollow[k] = true }
  }
  if (isObj(own.health) && !isObj(own.health.hits)) own.health = { ...own.health, hits: {} }
  return { components: own, hollow }
}

// an own component that holds nothing but empty maps (what withOwnMaps adds):
// it overrides nothing, so the editor still shows the component as inherited
export function isHollow (v) {
  return isObj(v) && Object.values(v).every((x) => isHollow(x))
}
