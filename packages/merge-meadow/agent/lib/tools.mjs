// The one table of agent verbs, shared by the MCP server and the CLI. Every verb
// goes through E(world): a remote World (live host page) or the local World
// (fallback), so both modes run the same code path on the agent side.
// input: zod raw shapes (what McpServer.registerTool takes).
import { z } from 'zod'
import { E } from '@endo/far'

const vec3 = z.array(z.number()).length(3)
const obj = z.record(z.string(), z.any())

export const tools = {
  describe: {
    description: 'Scene summary: title, entity count, presets, component names, doc systems, heads, and which live powers the host page offers.',
    input: {},
    run: (w) => E(w).describe(),
  },
  list: {
    description: 'List entities as plain data rows {id, name, preset, parent, owner, components (own), effective (preset-resolved), groups}. Filters (all optional, all must hold, matched on EFFECTIVE components): has [component names], tags [tag names], name, parent, preset.',
    input: { has: z.array(z.string()).optional(), tags: z.array(z.string()).optional(), name: z.string().optional(), parent: z.string().optional(), preset: z.string().optional() },
    run: (w, a) => E(w).list(a),
  },
  get: {
    description: 'One entity as a plain row, or with `component` just that component\'s effective data (null if absent).',
    input: { id: z.string(), component: z.string().optional() },
    run: (w, { id, component }) => E(E(w).get(id)).get(component),
  },
  spawn: {
    description: 'Create an entity. preset (e.g. "trex", "sheep", "horse", "tree"), name, components {name: data}, at [x,y,z], parent id. Returns {id}.',
    input: { preset: z.string().optional(), name: z.string().optional(), components: obj.optional(), at: vec3.optional(), parent: z.string().optional() },
    run: async (w, a) => ({ id: await E(E(w).spawn(a)).id() }),
    write: true,
  },
  set: {
    description: 'FIELD-MERGE a patch into a component: other fields and concurrent edits survive; null deletes a field. Use this for tweaks (speed, colour, position).',
    input: { id: z.string(), component: z.string(), patch: obj },
    run: (w, { id, component, patch }) => E(E(w).get(id)).set(component, patch),
    write: true,
  },
  replace: {
    description: 'Replace a component wholesale (a new identity; wins over concurrent field edits). Use for meaning changes, e.g. swapping representation.kind from billboard to critter.',
    input: { id: z.string(), component: z.string(), data: obj },
    run: (w, { id, component, data }) => E(E(w).get(id)).replace(component, data),
    write: true,
  },
  remove: {
    description: 'Remove one component from an entity.',
    input: { id: z.string(), component: z.string() },
    run: (w, { id, component }) => E(E(w).get(id)).remove(component),
    write: true,
  },
  despawn: {
    description: 'Delete an entity.',
    input: { id: z.string() },
    run: (w, { id }) => E(E(w).get(id)).destroy(),
    write: true,
  },
  link: {
    description: 'Store a relation on this entity: component "rider" -> {mount: other} (ride other), any other component -> {target: other}, merged with `extra` (e.g. {seat: 0}).',
    input: { id: z.string(), component: z.string(), other: z.string(), extra: obj.optional() },
    // await the handle: a presence resolved on this side passes back to the host as the
    // host's own Entity; a bare promise would arrive as a promise and not be recognised
    run: async (w, { id, component, other, extra }) => { const o = await E(w).get(other); return E(E(w).get(id)).link(component, o, extra ?? {}) },
    write: true,
  },
  batch: {
    description: 'Apply many ops in ONE validated change and one round trip; a bad op fails the whole batch with no change. ops: [{op: "spawn"|"despawn"|"set"|"replace"|"remove"|"define"|"setParent"|"setName"|"addGroup"|"removeGroup"|"push"|"definePreset"|"removePreset"|"defineComponent"|"removeComponent"|"defineSystem"|"setSystem"|"removeSystem"|"setWorld", ...fields}]; "$<i>" in an id field refers to the id spawned by op i.',
    input: { ops: z.array(obj) },
    run: (w, { ops }) => E(w).batch(ops),
    write: true,
  },
  define: {
    description: 'Make an entity match a full definition {name, preset, parent, components, groups} by DEEP DIFF: only differing fields are written, nothing is assigned wholesale, so concurrent edits to untouched fields survive.',
    input: { id: z.string(), entity: obj },
    run: (w, { id, entity }) => E(w).define(id, entity),
    write: true,
  },
  define_preset: {
    description: 'Define or update a preset {extends, components, groups: {name: {components, remove: [names]}}} (deep-diffed). Every instance updates live.',
    input: { name: z.string(), preset: obj },
    run: (w, { name, preset }) => E(w).definePreset(name, preset),
    write: true,
  },
  define_component: {
    description: 'Define a component kind {description, order, defaults, schema}; schema is a JSON-Schema subset (object of number(min,max,step)/string/boolean/enum/array/nested object). Later writes are validated against it.',
    input: { name: z.string(), def: obj },
    run: (w, { name, def }) => E(w).defineComponent(name, def),
    write: true,
  },
  define_system: {
    description: 'Add or hot-swap a doc system that every peer runs. source is an ES module: `export default { init(world, hot) {}, update(world, dt) {}, dispose(hot) {} }`. world: query(...names) -> [{id, c, live, has, owned}], get(id), owns(id), nearby(id, r), spawn(def), despawn(id), set(id, comp, patch), emit(ev), events(type), rand(), time, dt, log. Mutate `live` of owned entities only. A syntax error is rejected before the doc changes.',
    input: { name: z.string(), source: z.string(), order: z.number().optional(), enabled: z.boolean().optional() },
    run: (w, { name, ...rest }) => E(w).defineSystem(name, rest),
    write: true,
  },
  systems: {
    description: 'Doc systems with status on the host page (ok|error|suspended, last error, compile ms). Without a host page the status is "unknown".',
    input: {},
    run: (w) => E(w).systems(),
  },
  explain: {
    description: 'Why an entity is doing what it does: owner, intent, drive scores, sensed count, hp. Needs a live host page.',
    input: { id: z.string() },
    run: (w, { id }) => E(w).explain(id),
  },
  capture: {
    description: 'Screenshot of the host page\'s 3D view. Needs a live host page.',
    input: { type: z.enum(['image/jpeg', 'image/png']).optional(), quality: z.number().min(0).max(1).optional() },
    run: (w, a) => E(w).capture(a),
    image: true,
  },
  eval: {
    description: 'Run an async JS function body on the host page in a SES Compartment endowed with `world` (this World), `E`, `Math`, `log`; `return` plain data. Needs a live host page and the editor key.',
    input: { code: z.string() },
    run: (w, { code }) => E(w).eval(code),
  },
  heads: {
    description: 'Current heads of the doc (a version), for a read-only version link.',
    input: {},
    run: (w) => E(w).heads(),
  },
}
