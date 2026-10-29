// Shared fixtures for track A's tests (not itself a test file).
import { Repo } from '@automerge/automerge-repo'
import * as A from '@automerge/automerge'
import { seedDoc } from '../../src/doc/seed.js'
import { initDoc } from '../../src/doc/schema.js'

export const repo = new Repo({ network: [] })

export function seeded (title = 'test') {
  const h = repo.create()
  h.change((d) => seedDoc(d, { title }))
  return h
}
export function empty (title = 'test') {
  const h = repo.create()
  h.change((d) => initDoc(d, { title }))
  return h
}
export const fork = (h) => repo.import(A.save(h.doc()))
export const heads = (h) => A.getHeads(h.doc())
export { A }

// ---- headless sim harness: a doc handle, a world mirroring it through watch(),
// the built-in systems, and the per-tick flush the app does (one applyOps)
import { World } from '../../src/core/world.js'
import { installSim } from '../../src/sim/index.js'
import { watch } from '../../src/doc/watch.js'
import { applyOps } from '../../src/doc/ops.js'

export function vocabulary (title = 'test') {
  const h = repo.create()
  h.change((d) => { seedDoc(d, { title }); for (const id of Object.keys(d.entities)) delete d.entities[id] })
  return h
}

export function mirror (handle, { peerId = 'A', inputs = new Map(), owns, hitBase = 'h', anchor } = {}) {
  const world = new World({ peerId })
  if (owns) world.setOwnership({ owns })
  const sim = installSim(world, { inputs: () => inputs, peerId, hitBase, anchor })
  const stop = watch(handle, ({ doc, patches, initial }) => { if (initial) world.load(doc); else world.applyPatches(doc, patches) })
  const flushed = []
  const step = (n = 1) => {
    for (let i = 0; i < n; i++) {
      world.tick(1 / 30)
      const ops = world.drainOps()
      if (ops.length) { flushed.push(...ops); applyOps(handle, ops, { peerId, message: 'tick' }) }
    }
  }
  return { world, sim, step, stop, inputs, flushed }
}

// design §12: trex, two sheep, a horse and a rider with controller input
export function scenario ({ peerId = 'A', owns, extra = [] } = {}) {
  const h = vocabulary()
  applyOps(h, [
    { op: 'definePreset', name: 'rider', preset: { extends: 'creature', components: { tags: { prey: true, humanoid: true }, body: { speed: 4, radius: 0.4 }, brain: null, perception: null, controller: { kind: 'input' }, health: { max: 50 }, representation: { kind: 'billboard', image: 'emoji:🧑', size: 1.6 } } } },
    { op: 'spawn', id: 'rex', preset: 'trex', at: [0, 0, 0] },
    // an old, slow sheep: a seed sheep (6.5 m/s) outruns the T-rex (6 m/s) when it sees it coming
    { op: 'spawn', id: 'dolly', preset: 'sheep', at: [9, 0, 4], components: { body: { speed: 4 } } },
    { op: 'spawn', id: 'shaun', preset: 'sheep', at: [-30, 0, 26] },
    { op: 'spawn', id: 'bucephalus', preset: 'horse', at: [22, 0, -18] },
    { op: 'spawn', id: 'ann', preset: 'rider', at: [22, 0, -18], components: { rider: { mount: 'bucephalus', seat: 0 } } },
    ...extra,
  ])
  return { handle: h, ...mirror(h, { peerId, owns }) }
}
