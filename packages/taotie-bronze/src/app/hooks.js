// window.__taotie — the verification surface tools/*.mjs drive. Kept apart
// from the UI so a tool never has to click anything.

import * as THREE from 'three'

const r1 = (v) => Math.round(v * 10) / 10
const boxOut = (b) => {
  const s = b.getSize(new THREE.Vector3())
  return { min: b.min.toArray().map(r1), max: b.max.toArray().map(r1), w: r1(s.x), h: r1(s.y), d: r1(s.z) }
}

/**
 * Overall bbox and the bbox of every userData.part, in mm. `count` is the
 * number of separate part roots (four legs → 4; a body group of many wall
 * meshes → 1).
 */
export function measure(object) {
  if (!object) return null
  object.updateMatrixWorld(true)
  const overall = new THREE.Box3().setFromObject(object)
  const parts = {}
  object.traverse((o) => {
    if (!o.isMesh) return
    let part = null
    let root = null
    for (let p = o; p; p = p.parent) {
      if (p.userData?.part) {
        if (!part) part = p.userData.part
        if (p.userData.part === part) root = p
        else break
      }
      if (p === object) break
    }
    if (!part) return
    const e = (parts[part] ??= { box: new THREE.Box3(), roots: new Set() })
    e.box.union(new THREE.Box3().setFromObject(o))
    e.roots.add(root)
  })
  const out = { overall: boxOut(overall), parts: {} }
  for (const [k, e] of Object.entries(parts)) out.parts[k] = { ...boxOut(e.box), count: e.roots.size }
  return out
}

/** Triangles, vertices and draw calls of everything visible under `object`. */
export function meshStats(object) {
  const out = { triangles: 0, vertices: 0, meshes: 0 }
  object?.traverse((o) => {
    if (!o.isMesh || !o.geometry) return
    const g = o.geometry
    const n = g.index ? g.index.count : g.attributes.position?.count || 0
    out.triangles += Math.floor(n / 3)
    out.vertices += g.attributes.position?.count || 0
    out.meshes++
  })
  return out
}

/** "1.24 M triangles · 0.81 M vertices · 86 meshes" */
export function meshStatsText(object) {
  const s = meshStats(object)
  const n = (v) => (v >= 1e6 ? (v / 1e6).toFixed(2) + ' M' : v >= 1e4 ? Math.round(v / 1e3) + ' k' : v >= 1e3 ? (v / 1e3).toFixed(1) + ' k' : String(v))
  return `${n(s.triangles)} triangles · ${n(s.vertices)} vertices · ${s.meshes} meshes`
}

export function installHooks(api) {
  let resolveReady
  const ready = new Promise((r) => (resolveReady = r))
  window.__taotie = { ready, ...api }
  return {
    markReady() {
      document.documentElement.dataset.ready = '1'
      resolveReady(true)
    },
  }
}
