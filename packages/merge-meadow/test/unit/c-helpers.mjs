// Shared fixtures for track C's Node tests (not itself a test file): a doc-backed
// World mirrored through watch(), a reconciler on a bare Scene, and a fake
// renderer.xr good enough for PlayerRig.
import * as THREE from 'three'
import { Repo } from '@automerge/automerge-repo'
import { World } from '../../src/core/world.js'
import { watch } from '../../src/doc/watch.js'
import { applyOps } from '../../src/doc/ops.js'
import { plain } from '../../src/doc/read.js'
import { seedDoc } from '../../src/doc/seed.js'
import { makeResources } from '../../src/render/resources.js'
import { makeReconciler } from '../../src/render/reconciler.js'
import { KINDS } from '../../src/render/kinds/index.js'

const repo = new Repo({ network: [] })

// the seed vocabulary with no starter entities
export function vocabulary () {
  const h = repo.create()
  h.change((d) => { seedDoc(d, { title: 'c' }); for (const id of Object.keys(d.entities)) delete d.entities[id] })
  return h
}

export function stage ({ handle = vocabulary(), peerId = 'p_c' } = {}) {
  const world = new World({ peerId })
  const stop = watch(handle, ({ doc, patches, initial }) => { if (initial) world.load(doc); else world.applyPatches(doc, patches) })
  const scene = new THREE.Scene()
  const res = makeResources({ document: null })
  const rec = makeReconciler({ world, scene, resources: res, plain })
  const ops = (list) => applyOps(handle, list, { peerId, kinds: KINDS })
  return { handle, world, scene, res, rec, ops, stop }
}

export function fakeRenderer ({ presenting = false } = {}) {
  const listeners = {}
  return {
    domElement: null,
    xr: {
      isPresenting: presenting,
      getController: () => new THREE.Group(),
      getControllerGrip: () => new THREE.Group(),
      getHand: () => Object.assign(new THREE.Group(), { joints: {} }),
      addEventListener: (t, fn) => { (listeners[t] ||= []).push(fn) },
      dispatch: (t) => { for (const fn of listeners[t] || []) fn({ type: t }) },
    },
  }
}

// a resources leak check: what is still held, by prefix
export const held = (res) => res.stats()
