// Patches (DATA.md "Patches, on any pack"): the ground of a year before a
// harbour was dredged or a reef was filled, as masks over a pack's grid.
// They are listed in patches/manifest.json, for any pack, island or
// district, and a district's own manifest may list more for its pack
// (data/district.js); both read the same way here.
//
// A patch is a `raise` (today's sea, back to the reef flat it was dredged
// from) or a `lower` (today's land, back to the reef flat it was filled
// over), at `depth` metres, for the years before `until`. Its mask is 8-bit
// grey, 255 whole and soft at its edges, over the pack's bounds at the pack's
// size or a smaller one (`size`), its texels registered as the pack's are:
// the bounds are their outer edges.

import { decodeImage } from './image.js'

export const KINDS = ['raise', 'lower']

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/**
 * One manifest entry as the app uses it: { id, pack, kind, depth, until, url,
 * size, note }, or null (said in a warning) where it can't be drawn.
 * `abs` resolves its file; `pack` stands in for an entry that names none (a
 * district's own list).
 */
export function describePatch(p, abs, warn = console.warn, pack = null) {
  const id = p?.id || p?.keyframe || p?.file || '?'
  const kind = p?.kind ?? 'lower'
  if (!KINDS.includes(kind)) return warn(`patch ${id}: kind "${kind}" is neither raise nor lower; not drawn`), null
  if (!Number.isFinite(p.until)) return warn(`patch ${id}: no until year; not drawn`), null
  if (!p.file) return warn(`patch ${id}: no mask file; not drawn`), null
  const size = Array.isArray(p.size) && p.size.length === 2 && p.size.every((v) => Number.isInteger(v) && v > 0) ? p.size : null
  return {
    id: String(id),
    pack: p.pack ?? pack,
    kind,
    depth: Number.isFinite(p.depth) ? p.depth : -1,
    until: p.until,
    url: abs(p.file),
    size,
    note: p.note || '',
  }
}

/**
 * patches/manifest.json under `base` (the data's own, unless the address
 * asks for another with ?patches=, as the tools do), described; [] when
 * there is none.
 */
export async function loadPatchManifest(base, warn = console.warn) {
  const root = new URL(base, location.href)
  const abs = (f) => new URL(f, root).href
  let man
  try {
    man = await getJSON(abs('patches/manifest.json'))
  } catch {
    // (data with no patches: every pack is drawn as it is today)
    return []
  }
  const out = []
  for (const p of man?.patches || []) {
    if (!p?.pack) {
      warn(`patch ${p?.id ?? '?'}: no pack; not drawn`)
      continue
    }
    const d = describePatch(p, abs, warn)
    if (d) out.push(d)
  }
  return out
}

/** A mask's first channel, at its own size: { grey, W, H }. */
export async function decodeMask(url) {
  const { px, W, H } = await decodeImage(url)
  const grey = new Uint8Array(W * H)
  for (let c = 0, p = 0; c < grey.length; c++, p += 4) grey[c] = px[p]
  return { grey, W, H }
}

/**
 * A mask resampled onto a W × H grid over the same bounds (bilinear, texel
 * centres registered as the pack's), or the mask itself when it is already
 * that size.
 */
export function resampleMask(grey, w, h, W, H) {
  if (w === W && h === H) return grey
  const out = new Uint8Array(W * H)
  for (let j = 0; j < H; j++) {
    const fy = Math.min(h - 1, Math.max(0, ((j + 0.5) / H) * h - 0.5))
    const y0 = Math.floor(fy)
    const y1 = Math.min(h - 1, y0 + 1)
    const ty = fy - y0
    for (let i = 0; i < W; i++) {
      const fx = Math.min(w - 1, Math.max(0, ((i + 0.5) / W) * w - 0.5))
      const x0 = Math.floor(fx)
      const x1 = Math.min(w - 1, x0 + 1)
      const tx = fx - x0
      const a = grey[y0 * w + x0] + (grey[y0 * w + x1] - grey[y0 * w + x0]) * tx
      const b = grey[y1 * w + x0] + (grey[y1 * w + x1] - grey[y1 * w + x0]) * tx
      out[j * W + i] = Math.round(a + (b - a) * ty)
    }
  }
  return out
}

/** The part of a mask that marks anything, with a texel of nothing round it: { data, w, h, i0, j0 }, or null. */
export function cropMask(grey, W, H) {
  let i0 = W
  let j0 = H
  let i1 = -1
  let j1 = -1
  for (let j = 0; j < H; j++) {
    const row = j * W
    for (let i = 0; i < W; i++) {
      if (!grey[row + i]) continue
      if (i < i0) i0 = i
      if (i > i1) i1 = i
      if (j < j0) j0 = j
      if (j > j1) j1 = j
    }
  }
  if (i1 < 0) return null
  i0 = Math.max(0, i0 - 1)
  j0 = Math.max(0, j0 - 1)
  i1 = Math.min(W - 1, i1 + 1)
  j1 = Math.min(H - 1, j1 + 1)
  const w = i1 - i0 + 1
  const h = j1 - j0 + 1
  const data = new Uint8Array(w * h)
  for (let j = 0; j < h; j++) data.set(grey.subarray((j0 + j) * W + i0, (j0 + j) * W + i0 + w), j * w)
  return { data, w, h, i0, j0 }
}

/**
 * A district job's masks, each decoded and laid on the district's grid (a
 * mask may be smaller than its pack, over the same bounds); one that can't be
 * read is an empty mask, said once.
 */
export async function decodeMasks(job, warn = console.warn) {
  const out = []
  for (const m of job.masks || []) {
    try {
      const g = await decodeMask(m.url)
      const [w, h] = m.size || [job.W, job.H]
      if (g.W !== w || g.H !== h) warn(`${m.url} is ${g.W}×${g.H}, the manifest says ${w}×${h}; read at its own size`)
      out.push(resampleMask(g.grey, g.W, g.H, job.W, job.H))
    } catch (err) {
      warn(`${m.url}: ${err.message} (that patch is not drawn)`)
      out.push(new Uint8Array(job.W * job.H))
    }
  }
  return out
}
