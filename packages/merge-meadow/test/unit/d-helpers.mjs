// Shared fixtures for track D's tests (not itself a test file): a real
// automerge-repo handle seeded with the starter meadow, and track A's write path.
import { Repo } from '@automerge/automerge-repo'
import { seedDoc } from '../../src/doc/seed.js'
import { applyOps } from '../../src/doc/ops.js'
import * as read from '../../src/doc/read.js'

export const repo = new Repo({ network: [] })
export function seeded () {
  const h = repo.create()
  h.change((d) => seedDoc(d, { title: 'test meadow' }))
  return h
}
export const apply = (h) => (ops, opts = {}) => applyOps(h, ops, opts)
export { read, applyOps }

// S4's kind schemas, the shape track C's KINDS registry exposes ({ schema, defaults })
export const KINDS = {
  billboard: { schema: { type: 'object', properties: { image: { type: 'string', default: 'emoji:🐑', 'x-immutable': true }, size: { type: 'number', minimum: 0.1, maximum: 10, default: 1.2 }, color: { type: 'string', format: 'color', default: '#ffffff' } } } },
  primitive: { schema: { type: 'object', properties: { shape: { enum: ['box', 'sphere', 'cone', 'cylinder', 'capsule'], default: 'box', 'x-immutable': true }, size: { type: 'array', items: { type: 'number' }, minItems: 3, maxItems: 3, default: [1, 1, 1] }, color: { type: 'string', format: 'color', default: '#88aa55' }, roughness: { type: 'number', minimum: 0, maximum: 1, default: 0.8 }, metalness: { type: 'number', minimum: 0, maximum: 1, default: 0 } } } },
  tree: { schema: { type: 'object', properties: { nodes: { type: 'array', 'x-json': true, default: [{ shape: 'box', p: [0, 0.5, 0], s: [1, 1, 1], color: '#aa7744' }] } } } },
  model: { schema: { type: 'object', properties: { url: { type: 'string', default: '', 'x-immutable': true }, scale: { type: 'number', minimum: 0.01, maximum: 20, default: 1 } } } },
  critter: { schema: { type: 'object', properties: { rig: { enum: ['quadruped', 'biped'], default: 'quadruped', 'x-immutable': true }, length: { type: 'number', minimum: 0.2, maximum: 12, default: 1.2 }, height: { type: 'number', minimum: 0.2, maximum: 12, default: 0.9 }, color: { type: 'string', format: 'color', default: '#eeeeee' } } }, defaults: { tail: 0.5 } },
}
