// STATUS: first pass — rectangular-section bodies (fangding, fangyi, fanghu).
// Keep `fangBody(opts)` and the wall naming; refine the internals (rounded
// corners, bulging walls, lids).
//
// A fang vessel's walls were cast in one mould section each, joined at the
// corners — which is exactly why the corners carry flanges: they hide the
// mould seams. So each wall is its own surface patch with its own relief, and
// all four share the same eight corner points so they meet without a crack.

import * as THREE from 'three'
import { buildSurface, quadSurface } from './surface.js'

/**
 * @param {object} o
 * @param {number} o.width   bottom width along X (mm)
 * @param {number} o.depth   bottom depth along Z (mm)
 * @param {number} o.height  wall height (mm); the body stands on y = 0
 * @param {number} [o.flare] top is (1 + flare)× the bottom in plan — Shang fangding walls lean out slightly
 * @param {number} [o.wall]  wall thickness (mm)
 * @param {{front?,back?,left?,right?: {relief, reliefRect?, material?, fade?}}} [o.panels]
 * @param {THREE.Material} o.material      plain surfaces (and walls without their own)
 * @param {number} [o.density]  vertices per mm on decorated walls
 * @returns {THREE.Group} children have userData.part = 'body'; group.userData.walls = { front: { corners, normal } … }
 */
export function fangBody({ width, depth, height, flare = 0, wall = 8, panels = {}, material, density = 1, part = 'body' }) {
  const g = new THREE.Group()
  g.userData.part = part
  const w0 = width / 2, d0 = depth / 2
  const w1 = w0 * (1 + flare), d1 = d0 * (1 + flare)
  const V = (x, y, z) => new THREE.Vector3(x, y, z)
  // outer corners: b = bottom, t = top; seen from outside each wall is [BL, BR, TL, TR]
  const walls = {
    front: [V(-w0, 0, d0), V(w0, 0, d0), V(-w1, height, d1), V(w1, height, d1)],
    right: [V(w0, 0, d0), V(w0, 0, -d0), V(w1, height, d1), V(w1, height, -d1)],
    back: [V(w0, 0, -d0), V(-w0, 0, -d0), V(w1, height, -d1), V(-w1, height, -d1)],
    left: [V(-w0, 0, -d0), V(-w0, 0, d0), V(-w1, height, -d1), V(-w1, height, d1)],
  }
  g.userData.walls = {}
  for (const [name, c] of Object.entries(walls)) {
    const p = panels[name] || {}
    const geo = buildSurface({
      surface: quadSurface(c[0], c[1], c[2], c[3]),
      segments: p.relief ? { density } : [8, 8],
      relief: p.relief || null,
      reliefRect: p.reliefRect,
      fade: p.fade ?? 1.5,
    })
    add(g, geo, p.material || material, part, name)
    const normal = new THREE.Vector3().subVectors(c[1], c[0]).cross(new THREE.Vector3().subVectors(c[2], c[0])).normalize()
    g.userData.walls[name] = { corners: c, normal }
  }

  // inner walls, inset by the wall thickness, plain (décor lived in the outer mould)
  const iw0 = w0 - wall, id0 = d0 - wall, iw1 = w1 - wall, id1 = d1 - wall
  const fy = Math.min(wall, height * 0.5)
  const inner = [
    // seen from inside the vessel, u left → right
    [V(iw0, fy, id0), V(-iw0, fy, id0), V(iw1, height, id1), V(-iw1, height, id1)],
    [V(iw0, fy, -id0), V(iw0, fy, id0), V(iw1, height, -id1), V(iw1, height, id1)],
    [V(-iw0, fy, -id0), V(iw0, fy, -id0), V(-iw1, height, -id1), V(iw1, height, -id1)],
    [V(-iw0, fy, id0), V(-iw0, fy, -id0), V(-iw1, height, id1), V(-iw1, height, -id1)],
  ]
  for (const c of inner) add(g, buildSurface({ surface: quadSurface(...c), segments: [4, 4] }), material, part, 'inner')

  // flat rim between outer and inner top edges (a thickened lip on the real thing)
  const ot = [walls.front[2], walls.front[3], walls.back[2], walls.back[3]] // FL, FR, BR, BL (top)
  const it = [V(-iw1, height, id1), V(iw1, height, id1), V(iw1, height, -id1), V(-iw1, height, -id1)]
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4
    // seen from above, the outer edge is the strip's v = 0 side
    add(g, buildSurface({ surface: quadSurface(ot[i], ot[j], it[i], it[j]), segments: [2, 1] }), material, part, 'rim')
  }
  // floor inside, and the underside
  add(g, buildSurface({ surface: quadSurface(V(-iw0, fy, id0), V(iw0, fy, id0), V(-iw0, fy, -id0), V(iw0, fy, -id0)), segments: [2, 2] }), material, part, 'floor')
  add(g, buildSurface({ surface: quadSurface(V(-w0, 0, -d0), V(w0, 0, -d0), V(-w0, 0, d0), V(w0, 0, d0)), segments: [2, 2] }), material, part, 'underside')
  return g
}

function add(g, geo, material, part, name) {
  const m = new THREE.Mesh(geo, material)
  m.name = name
  m.userData.part = part
  m.castShadow = m.receiveShadow = true
  g.add(m)
  return m
}
