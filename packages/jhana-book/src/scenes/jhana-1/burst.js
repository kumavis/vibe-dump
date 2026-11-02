// burst.js — V-fold rays cut as starburst sectors, for jhana-1.
//
// A V-fold panel is a sector of paper between its glue line (angle 0) and its
// crease (angle gamma), both radiating from the apex. Cutting that sector into
// rays that also radiate from the apex makes each folded V half of a paper
// sun: the two mirrored panels meet along the crease, where their last rays
// fuse into one tall central ray. Stack a few of these V's — nested, each one
// inside the wedge of the one before — and the open page holds a layered
// sunburst.
//
// Every ray is clamped (clampRay) so the piece obeys the book's rules at every
// angle: flat inside the page when closed, never into the printed strip, never
// taller than the pop-up volume.

const PAGE_REACH = 0.97 // keep folded paper this far from the spine at most (W = 1)
const Z_NEAR = 0.44 // the printed strip starts at z = 0.45
const Z_FAR = -0.68 // the far page edge is at −0.7
const MAX_RISE = 0.9

// Unit direction, in the parent hinge frame, of the line that leaves a V-fold
// panel's apex at angle phi from the glue line (toward the crease), with the
// hinge open to theta. Mirrors paper.js's V-fold pose for the right panel
// (x ≥ 0); the left panel is its mirror in x, which no bound below depends on.
export function vDir(alpha, gamma, toward, theta, phi, out) {
  const s = toward === 'near' ? 1 : -1
  const sh = Math.sin(theta / 2)
  const ch = Math.cos(theta / 2)
  const sa = Math.sin(alpha)
  const ca = Math.cos(alpha)
  const cg = Math.cos(gamma)
  const sg = Math.sin(gamma)
  const A = sa * ch
  const R = Math.hypot(A, ca)
  const beta = Math.atan2(A, ca) + Math.acos(Math.min(1, Math.max(-1, cg / Math.max(R, 1e-12))))
  // glue g, crease c, and n ⊥ g in the panel toward the crease: c = cos γ·g + sin γ·n
  const gx = sa * sh
  const gy = sa * ch
  const gz = s * ca
  const cy = Math.sin(beta)
  const cz = s * Math.cos(beta)
  const nx = (-cg * gx) / sg
  const ny = (cy - cg * gy) / sg
  const nz = (cz - cg * gz) / sg
  const cp = Math.cos(phi)
  const sp = Math.sin(phi)
  out.x = cp * gx + sp * nx
  out.y = cp * gy + sp * ny
  out.z = cp * gz + sp * nz
  return out
}

const THETAS = Array.from({ length: 25 }, (_, i) => (Math.PI * i) / 24)
const _d = { x: 0, y: 0, z: 0 }

// The longest ray (≤ want) leaving the apex at angle phi that stays legal for
// every theta: z within the page and out of the printed strip, inside the page
// width when folded flat (θ = 0, the page runs along +y), under MAX_RISE open.
export function clampRay(spec, phi, want) {
  const { alpha, gamma, toward = 'far', z } = spec
  let r = want
  for (const th of THETAS) {
    vDir(alpha, gamma, toward, th, phi, _d)
    if (_d.z > 1e-6) r = Math.min(r, (Z_NEAR - z) / _d.z)
    if (_d.z < -1e-6) r = Math.min(r, (z - Z_FAR) / -_d.z)
    if (th === 0 && _d.y > 1e-6) r = Math.min(r, PAGE_REACH / _d.y)
    if (th === Math.PI && _d.y > 1e-6) r = Math.min(r, MAX_RISE / _d.y)
  }
  return Math.max(0, r)
}

// A starburst sector in V-panel coords (s toward the crease, t along the glue
// line): a short glue edge on the page, then `n` rays alternating long/short,
// the last one lying exactly on the crease so the two panels share it.
//   reach   length of the longest ray (before clamping)
//   valley  radius of the notches between rays, as a fraction of reach
//   skip    offset of the ray pattern (0..1): staggers the layers so each one's
//           rays show through the notches of the layer in front
//   holes   punch a small round hole in each notch (cut-paper lace)
export function raySector(THREE, spec) {
  const { gamma, n = 4, reach = 0.6, valley = 0.45, skip = 0.4, short = 0.78, holes = false } = spec
  const step = gamma / (n - 0.5 + skip)
  const pt = (phi, r) => new THREE.Vector2(r * Math.sin(phi), r * Math.cos(phi))
  const notch = (phi) => clampRay(spec, phi, reach * valley)
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  const first = step * skip
  shape.lineTo(0, notch(0)) // the glue tab along the page
  if (first > 0.01) {
    const v = pt(first, notch(first))
    shape.lineTo(v.x, v.y)
  }
  for (let j = 0; j < n; j++) {
    const phi = gamma - (n - 1 - j) * step
    // long rays on the crease and every other one out from it; the rays lying
    // low near the glue line are shortened so the silhouette rounds off
    const longRay = (n - 1 - j) % 2 === 0
    const lowFade = 0.72 + 0.28 * Math.sin(Math.min(Math.PI / 2, (phi / gamma) * Math.PI * 0.75))
    const tip = clampRay(spec, phi, reach * (longRay ? 1 : short) * lowFade)
    const p = pt(phi, tip)
    shape.lineTo(p.x, p.y)
    if (j < n - 1) {
      const v = pt(phi + step / 2, notch(phi + step / 2))
      shape.lineTo(v.x, v.y)
    }
  }
  shape.lineTo(0, 0) // back down the crease
  if (holes) {
    for (let j = 0; j < n - 1; j++) {
      const phi = gamma - (n - 1 - j) * step + step / 2
      const r = notch(phi) * 0.62
      const c = pt(phi, r)
      const hole = new THREE.Path()
      hole.absarc(c.x, c.y, Math.min(0.022, r * 0.12), 0, Math.PI * 2, true)
      shape.holes.push(hole)
    }
  }
  return shape
}

// One layer of the fan: the V-fold plus its two cut panels.
export function rayLayer(THREE, paper, spec) {
  const { z, alpha, gamma, toward = 'far', material, on } = spec
  const fold = paper.vFold({ on, z, alpha, gamma, toward, length: clampRay(spec, gamma, spec.reach) })
  const shape = raySector(THREE, spec)
  const left = paper.card(fold.left, { shape, material })
  const right = paper.card(fold.right, { shape, material })
  return { fold, left, right }
}
