// The era layers (DATA.md "Era layers"), from their PNGs to what the terrain
// shader samples. Pure functions on typed arrays, so they run in the layers'
// worker (layers-worker.js) or, failing that, on the main thread.
//
// The unit of work is one keyframe. Each island's three masks for it become
// one RGBA grid on the island's own texels: r cultivation, g settlement (the
// log bytes as baked), b forest; a is unused, since three has no RGB texture.
// An island finer than about 60 m a texel (Kahoʻolawe, Lānaʻi, Niʻihau) is
// averaged down to about that: the layers are densities at hundreds of
// metres, and those three would otherwise cost as much as Oʻahu. The bounds
// never change, so the texels stay registered with the pack's own.
//
// The archipelago pack has no masks of its own, so the same pass bins every
// island's texels into one grid over the archipelago, at half the
// archipelago pack's texels (about 560 m, a pixel or so with the whole chain
// in view). Where two islands' boxes overlap (Maui's holds the north of
// Kahoʻolawe) a texel takes the island whose edge is further away, as the
// shaders' ownerAt() does. Settlement is averaged as people, not as bytes,
// and every average is over land only: a coastal texel half in the sea
// keeps the density of its shore, where most people lived. Then each grid's
// values are spread a few texels out over the sea, which the shader never
// shows, so that filtering and mipmaps at the coast blend land with land
// and not with an empty sea.
//
// A keyframe that lacks a layer (the Māhele has no forest) gets it by
// interpolating, by year, between the nearest keyframes on either side that
// have it. Interpolation is linear in years, so a forest made this way for
// 1853 and then interpolated again between 1778 and 1853 or 1853 and 1896 is
// the same forest the straight line from 1778 to 1896 gives (within a byte),
// and every year needs only two keyframes.

/** Bytes → people per km², and back (DATA.md: d = d0 (exp(v/255 · ln(1 + dMax/d0)) − 1)). */
export function settlementCodec(d0 = 2, dMax = 50000) {
  const L = Math.log(1 + dMax / d0)
  const lut = new Float32Array(256)
  for (let v = 0; v < 256; v++) lut[v] = d0 * (Math.exp((v / 255) * L) - 1)
  return {
    lut,
    decode: (v) => d0 * (Math.exp((v / 255) * L) - 1),
    encode: (d) => Math.max(0, Math.min(255, Math.round((255 * Math.log(1 + Math.max(0, d) / d0)) / L))),
  }
}

/** The downsampling factor for a pack of this many metres a texel. */
export const thinFactor = (metresPerTexel) => Math.max(1, Math.round(60 / Math.max(1, metresPerTexel)))

/**
 * One keyframe, baked.
 *
 * job: { kf, d0, dMax,
 *        arch: { W, H, rect: { x0, z0, x1, z1 } },
 *        islands: [ { id, W, H, f, rect, land, layers: { cultivation, settlement, forest } } ] }
 * where land is a Uint8Array on the island's grid, 1 for land (or absent: all land)
 * where each layer is a URL, or { from, to, t } (two URLs and a weight), or
 * null (no data: zero).
 * grey(url) resolves to { px: Uint8Array of W × H, W, H }.
 *
 * Resolves to { kf, arch: { W, H, data }, islands: [ { id, W, H, data } ] },
 * every data an RGBA Uint8Array.
 */
export async function bakeKeyframe(job, grey) {
  const { arch } = job
  const codec = settlementCodec(job.d0, job.dMax)
  const AW = arch.W
  const AH = arch.H
  const ar = arch.rect
  const islands = job.islands

  // who owns each archipelago texel: the island whose box holds its centre
  // most deeply, or none (-1)
  const owner = new Int8Array(AW * AH).fill(-1)
  const ax = (ar.x1 - ar.x0) / AW
  const az = (ar.z1 - ar.z0) / AH
  for (let J = 0; J < AH; J++) {
    const z = ar.z0 + (J + 0.5) * az
    for (let I = 0; I < AW; I++) {
      const x = ar.x0 + (I + 0.5) * ax
      let best = 0
      let o = -1
      for (let k = 0; k < islands.length; k++) {
        const r = islands[k].rect
        const e = Math.min(x - r.x0, r.x1 - x, z - r.z0, r.z1 - z)
        if (e > best) {
          best = e
          o = k
        }
      }
      owner[J * AW + I] = o
    }
  }
  const aSum = new Float32Array(AW * AH * 3)
  const aCnt = new Float32Array(AW * AH)

  const out = { kf: job.kf, arch: null, islands: [] }
  for (let k = 0; k < islands.length; k++) {
    const isl = islands[k]
    const { W, H } = isl
    const [cu, se, fo] = await Promise.all(['cultivation', 'settlement', 'forest'].map((l) => layer(isl.layers[l], W, H, grey, `${isl.id} ${l}`)))
    const land = isl.land && isl.land.length === W * H ? isl.land : null
    // into the archipelago grid, by each texel's centre
    const r = isl.rect
    const sx = (r.x1 - r.x0) / W
    const sz = (r.z1 - r.z0) / H
    const colI = new Int32Array(W)
    for (let i = 0; i < W; i++) colI[i] = Math.floor((r.x0 + (i + 0.5) * sx - ar.x0) / ax)
    for (let j = 0; j < H; j++) {
      const J = Math.floor((r.z0 + (j + 0.5) * sz - ar.z0) / az)
      if (J < 0 || J >= AH) continue
      const row = j * W
      for (let i = 0; i < W; i++) {
        const I = colI[i]
        if (I < 0 || I >= AW) continue
        const a = J * AW + I
        if (owner[a] !== k) continue
        const c = row + i
        if (land && !land[c]) continue
        aSum[a * 3] += cu[c]
        aSum[a * 3 + 1] += codec.lut[se[c]]
        aSum[a * 3 + 2] += fo[c]
        aCnt[a]++
      }
    }
    // and onto the island's own grid, averaged down if it is finer than it needs
    const f = Math.max(1, isl.f || 1)
    if (f === 1) {
      const data = new Uint8Array(W * H * 4)
      for (let c = 0; c < W * H; c++) {
        data[c * 4] = cu[c]
        data[c * 4 + 1] = se[c]
        data[c * 4 + 2] = fo[c]
        data[c * 4 + 3] = 255
      }
      if (land) spread(data, W, H, land, 2)
      out.islands.push({ id: isl.id, W, H, data })
    } else {
      const W2 = Math.max(1, Math.round(W / f))
      const H2 = Math.max(1, Math.round(H / f))
      const sum = new Float32Array(W2 * H2 * 3)
      const cnt = new Float32Array(W2 * H2)
      const col2 = new Int32Array(W)
      for (let i = 0; i < W; i++) col2[i] = Math.min(W2 - 1, Math.floor(((i + 0.5) * W2) / W))
      for (let j = 0; j < H; j++) {
        const row2 = Math.min(H2 - 1, Math.floor(((j + 0.5) * H2) / H)) * W2
        for (let i = 0; i < W; i++) {
          const c = j * W + i
          if (land && !land[c]) continue
          const d = row2 + col2[i]
          sum[d * 3] += cu[c]
          sum[d * 3 + 1] += codec.lut[se[c]]
          sum[d * 3 + 2] += fo[c]
          cnt[d]++
        }
      }
      const data = pack(sum, cnt, W2 * H2, codec)
      spread(data, W2, H2, cnt, 2)
      out.islands.push({ id: isl.id, W: W2, H: H2, data })
    }
  }
  const data = pack(aSum, aCnt, AW * AH, codec)
  spread(data, AW, AH, aCnt, 3)
  out.arch = { W: AW, H: AH, data }
  return out
}

/**
 * Carry the values of the texels that have any (`has`, nonzero) out over
 * their neighbours, a texel a pass, each new one the mean of the ones beside
 * it.
 */
function spread(data, W, H, has, passes) {
  let ok = Uint8Array.from(has, (v) => (v ? 1 : 0))
  for (let p = 0; p < passes; p++) {
    const next = ok.slice()
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const c = y * W + x
        if (ok[c]) continue
        let n = 0
        let r = 0
        let g = 0
        let b = 0
        const take = (q) => {
          if (!ok[q]) return
          n++
          r += data[q * 4]
          g += data[q * 4 + 1]
          b += data[q * 4 + 2]
        }
        if (x > 0) take(c - 1)
        if (x < W - 1) take(c + 1)
        if (y > 0) take(c - W)
        if (y < H - 1) take(c + W)
        if (!n) continue
        data[c * 4] = Math.round(r / n)
        data[c * 4 + 1] = Math.round(g / n)
        data[c * 4 + 2] = Math.round(b / n)
        next[c] = 1
      }
    }
    ok = next
  }
}

/** Averages (cultivation, people, forest) → RGBA bytes. */
function pack(sum, cnt, n, codec) {
  const data = new Uint8Array(n * 4)
  for (let c = 0; c < n; c++) {
    const w = cnt[c]
    data[c * 4 + 3] = 255
    if (!w) continue
    data[c * 4] = Math.round(sum[c * 3] / w)
    data[c * 4 + 1] = codec.encode(sum[c * 3 + 1] / w)
    data[c * 4 + 2] = Math.round(sum[c * 3 + 2] / w)
  }
  return data
}

/** One layer's bytes on the island's grid: a mask, two masks blended, or zero. */
async function layer(src, W, H, grey, what) {
  if (!src) return new Uint8Array(W * H)
  if (typeof src === 'string') return check(await grey(src), W, H, src)
  const [a, b] = await Promise.all([grey(src.from), grey(src.to)])
  const pa = check(a, W, H, src.from)
  const pb = check(b, W, H, src.to)
  const t = src.t
  const px = new Uint8Array(W * H)
  for (let c = 0; c < W * H; c++) px[c] = Math.round(pa[c] + (pb[c] - pa[c]) * t)
  return px
}

function check(img, W, H, url) {
  if (img.W !== W || img.H !== H) throw new Error(`${url} is ${img.W}×${img.H}, the pack is ${W}×${H}`)
  return img.px
}

/** A greyscale PNG's bytes, through decodeImage (data/image.js): its first channel. */
export async function decodeGrey(decodeImage, url) {
  const { px, W, H } = await decodeImage(url)
  const out = new Uint8Array(W * H)
  for (let c = 0, p = 0; c < W * H; c++, p += 4) out[c] = px[p]
  return { px: out, W, H }
}

/** The buffers to hand back from a worker without copying. */
export const transfers = (out) => [out.arch.data.buffer, ...out.islands.map((i) => i.data.buffer)]
