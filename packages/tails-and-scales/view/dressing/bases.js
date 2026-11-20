// Where the figures' bases stand, as a mask over the mat (DESIGN's
// "Battlefield dressing", rule 3): the low clutter, the tufts and flowers
// and a wood's ferns shrink to nothing where the mask is set, so nothing of
// the dressing shows through or above a unit's base. Pure (no three.js):
// ground.js uploads the mask as a texture the clutter's shaders read at
// each item's centre, nearest texel, exactly as maskAt reads it here, and
// sim/dressing-check.mjs holds the two to the promise: every item that
// overlaps a base is hidden.
//
// The mask is RES texels a tail over the mat. A base of radius r at x, z
// sets every texel whose centre lies within r + REACH of it; REACH covers
// the largest item's radius and the half-diagonal of a texel, so an item
// whose disc touches the base is hidden wherever in its texel its centre
// falls.
export const RES = 4
// the largest item's radius (a fern's 0.43) and a texel's half-diagonal
export const REACH = 0.45 + Math.SQRT2 / (2 * RES)

export const maskSize = (W, H) => ({ w: Math.ceil(W * RES), h: Math.ceil(H * RES) })

// the texel an item's centre falls in, -1 off the mat
export function texel(W, H, x, z) {
  const { w, h } = maskSize(W, H)
  const i = Math.floor((x + W / 2) * RES), j = Math.floor((z + H / 2) * RES)
  return i < 0 || j < 0 || i >= w || j >= h ? -1 : j * w + i
}

// the mask (`mask` a Uint8Array of maskSize's, cleared first) for the bases
// `discs` ([{x, z, r}])
export function paintBases(mask, W, H, discs) {
  const { w, h } = maskSize(W, H)
  mask.fill(0)
  for (const d of discs) {
    const reach = d.r + REACH
    const i0 = Math.max(0, Math.floor((d.x - reach + W / 2) * RES)), i1 = Math.min(w - 1, Math.floor((d.x + reach + W / 2) * RES))
    const j0 = Math.max(0, Math.floor((d.z - reach + H / 2) * RES)), j1 = Math.min(h - 1, Math.floor((d.z + reach + H / 2) * RES))
    for (let j = j0; j <= j1; j++) {
      const cz = (j + 0.5) / RES - H / 2 - d.z
      for (let i = i0; i <= i1; i++) {
        const cx = (i + 0.5) / RES - W / 2 - d.x
        if (cx * cx + cz * cz <= reach * reach) mask[j * w + i] = 255
      }
    }
  }
  return mask
}

// whether the mask hides an item centred at x, z
export function maskAt(mask, W, H, x, z) {
  const t = texel(W, H, x, z)
  return t >= 0 && mask[t] > 0
}
