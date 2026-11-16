// Relief FROM AN IMAGE — a height map (e.g. derived from a flattened photograph by tools/photoheight.py) written
// into a ReliefPanel, so everything downstream (bake → normal map, macro displacement, cavity / edge / groove
// masks, buildSurface, PatinaMaterial) works unchanged.
//
// STATUS: first pass (experiment). Additive: nothing else in the kit imports this file.
//
//   const img = await loadHeightImage(url, meta)        // 16-bit (or 8-bit) greyscale PNG + { min, max, width, height }
//   imageRelief(panel, img, { rect, mirror: true, crop, feather, blend: 'replace', groove })
//
// The PNG is decoded here (zlib via DecompressionStream, no canvas): a canvas would drop 16-bit to 8 and may
// colour-manage, and an 8-bit height at 0.02 mm steps terraces visibly in a Sobel normal map.

/**
 * Decode a non-interlaced greyscale PNG (8 or 16 bit) → { cols, rows, data: Uint16Array (0..65535), rowsTopDown: true }.
 * @param {ArrayBuffer|Uint8Array} buf
 */
export async function decodeGreyPNG(buf) {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  const be32 = (o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0
  if (be32(0) !== 0x89504e47) throw new Error('decodeGreyPNG: not a PNG')
  let o = 8
  let cols = 0, rows = 0, depth = 0, ctype = 0, interlace = 0
  const idat = []
  while (o < b.length) {
    const len = be32(o)
    const type = String.fromCharCode(b[o + 4], b[o + 5], b[o + 6], b[o + 7])
    const d = b.subarray(o + 8, o + 8 + len)
    if (type === 'IHDR') {
      cols = be32(o + 8); rows = be32(o + 12); depth = d[8]; ctype = d[9]; interlace = d[12]
    } else if (type === 'IDAT') idat.push(d)
    else if (type === 'IEND') break
    o += 12 + len
  }
  if (ctype !== 0 || interlace !== 0 || (depth !== 8 && depth !== 16)) throw new Error(`decodeGreyPNG: need non-interlaced 8/16-bit greyscale (type ${ctype}, depth ${depth})`)
  const z = new Uint8Array(idat.reduce((n, c) => n + c.length, 0))
  let p = 0
  for (const c of idat) { z.set(c, p); p += c.length }
  const raw = new Uint8Array(await new Response(new Blob([z]).stream().pipeThrough(new DecompressionStream('deflate'))).arrayBuffer())
  const bpp = depth / 8
  const stride = cols * bpp
  const out = new Uint8Array(rows * stride)
  for (let y = 0; y < rows; y++) {
    const f = raw[y * (stride + 1)]
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    const cur = out.subarray(y * stride, (y + 1) * stride)
    const prev = y ? out.subarray((y - 1) * stride, y * stride) : null
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0
      const up = prev ? prev[i] : 0
      const c = prev && i >= bpp ? prev[i - bpp] : 0
      let v = src[i]
      if (f === 1) v += a
      else if (f === 2) v += up
      else if (f === 3) v += (a + up) >> 1
      else if (f === 4) {
        const pp = a + up - c, pa = Math.abs(pp - a), pb = Math.abs(pp - up), pc = Math.abs(pp - c)
        v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c
      }
      cur[i] = v & 255
    }
  }
  const data = new Uint16Array(cols * rows)
  if (depth === 16) for (let i = 0; i < data.length; i++) data[i] = (out[2 * i] << 8) | out[2 * i + 1]
  else for (let i = 0; i < data.length; i++) data[i] = out[i] * 257
  return { cols, rows, data }
}

/**
 * Fetch + decode a height PNG and scale it to mm.
 * @param {string|URL} url
 * @param {{min:number,max:number,width:number,height:number,rowsBottomUp?:boolean}} meta  mm range of 0..65535 and the
 *   image's size in mm. tools/photoheight.py writes rows bottom-up (row 0 = y 0, the ReliefPanel convention), the default.
 * @returns {{cols, rows, width, height, data: Float32Array (mm, row 0 = bottom)}}
 */
export async function loadHeightImage(url, meta) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`loadHeightImage: ${res.status} ${url}`)
  const { cols, rows, data } = await decodeGreyPNG(await res.arrayBuffer())
  const k = (meta.max - meta.min) / 65535
  const f = new Float32Array(cols * rows)
  const flip = meta.rowsBottomUp === false
  for (let y = 0; y < rows; y++) {
    const sy = flip ? rows - 1 - y : y
    for (let x = 0; x < cols; x++) f[y * cols + x] = meta.min + data[sy * cols + x] * k
  }
  return { cols, rows, width: meta.width, height: meta.height, data: f }
}

/**
 * Write a height image into a panel.
 * @param panel ReliefPanel
 * @param img { cols, rows, width, height (mm), data: Float32Array mm, row 0 = bottom }
 * @param o.rect   panel mm { x, y, w, h } the image (or, with mirror, the mirrored pair) covers
 * @param o.mirror true: the image is the RIGHT half of rect (x from its centre line to its right edge) and is
 *                 mirrored onto the left half — one half of a bilaterally symmetric register
 * @param o.crop   image mm { x0, y0, x1, y1 }: write only inside (default: all of it)
 * @param o.feather mm: blend in from the crop/rect border over this distance (default 1)
 * @param o.blend  'replace' (default: lerp field → image by the feather weight) | 'max' | 'add'
 * @param o.scale  height multiplier (default 1); o.offset mm added
 * @param o.groove { small: 0.6 mm, k: 0.15 mm } — the groove channel (inlay paste) from the image's own small
 *                 cavities: 1 where a pixel lies ≥ k below its `small`-mm neighbourhood | false
 * @returns {{ px: number, ms: number }}
 */
export function imageRelief(panel, img, o = {}) {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0
  const { rect = { x: 0, y: 0, w: panel.width, h: panel.height }, mirror = false, feather = 1, blend = 'replace', scale = 1, offset = 0 } = o
  const crop = o.crop || { x0: 0, y0: 0, x1: img.width, y1: img.height }
  const gopt = o.groove === false ? null : { small: 0.6, k: 0.15, ...(o.groove || {}) }
  const { cols, rows, ppmm, field, groove } = panel
  const half = mirror ? rect.w / 2 : rect.w
  const sx = img.width / half // image mm per panel mm (x)
  const sy = img.height / rect.h
  const ipx = img.cols / img.width, ipy = img.rows / img.height
  const cx = rect.x + (mirror ? rect.w / 2 : 0)
  const xa = Math.max(0, Math.floor(rect.x * ppmm)), xb = Math.min(cols, Math.ceil((rect.x + rect.w) * ppmm))
  const ya = Math.max(0, Math.floor(rect.y * ppmm)), yb = Math.min(rows, Math.ceil((rect.y + rect.h) * ppmm))
  const bw = xb - xa, bh = yb - ya
  if (bw <= 0 || bh <= 0) return { px: 0, ms: 0 }
  const h = new Float32Array(bw * bh)
  const wgt = new Float32Array(bw * bh)
  const D = img.data
  let n = 0
  for (let y = ya; y < yb; y++) {
    const v = ((y + 0.5) / ppmm - rect.y) * sy // image mm
    for (let x = xa; x < xb; x++) {
      const xm = (x + 0.5) / ppmm
      const u = (mirror ? Math.abs(xm - cx) : xm - rect.x) * sx
      const e = Math.min(u - crop.x0, crop.x1 - u, v - crop.y0, crop.y1 - v) / Math.max(Math.min(sx, sy), 1e-6)
      if (e <= 0) continue
      const w = feather > 0 ? Math.min(1, e / feather) : 1
      // bilinear in the image (pixel centres at +0.5)
      const fx = Math.min(Math.max(u * ipx - 0.5, 0), img.cols - 1), fy = Math.min(Math.max(v * ipy - 0.5, 0), img.rows - 1)
      const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(x0 + 1, img.cols - 1), y1 = Math.min(y0 + 1, img.rows - 1)
      const ax = fx - x0, ay = fy - y0
      const a = D[y0 * img.cols + x0] + (D[y0 * img.cols + x1] - D[y0 * img.cols + x0]) * ax
      const b = D[y1 * img.cols + x0] + (D[y1 * img.cols + x1] - D[y1 * img.cols + x0]) * ax
      const i = (y - ya) * bw + (x - xa)
      h[i] = (a + (b - a) * ay) * scale + offset
      wgt[i] = w * w * (3 - 2 * w)
      n++
    }
  }
  // the groove channel from the image's own small-scale cavities (it carries no sink() record)
  let g = null
  if (gopt) {
    const r = Math.max(1, Math.round(gopt.small * ppmm))
    const bl = boxBlur(h, bw, bh, r)
    g = new Float32Array(bw * bh)
    for (let i = 0; i < g.length; i++) g[i] = Math.min(1, Math.max(0, (bl[i] - h[i]) / gopt.k))
  }
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const i = y * bw + x
      const w = wgt[i]
      if (!(w > 0)) continue
      const j = (y + ya) * cols + (x + xa)
      if (blend === 'max') field[j] = Math.max(field[j], h[i])
      else if (blend === 'add') field[j] += w * h[i]
      else field[j] += (h[i] - field[j]) * w
      if (g) groove[j] = blend === 'replace' ? groove[j] * (1 - w) + g[i] * w : Math.max(groove[j], g[i] * w)
    }
  }
  return { px: n, ms: Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - t0) }
}

function boxBlur(src, w, h, r, passes = 2) {
  let a = Float32Array.from(src)
  const b = new Float32Array(src.length)
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      let acc = 0
      const row = y * w
      for (let x = -r; x <= r; x++) acc += a[row + Math.min(w - 1, Math.max(0, x))]
      for (let x = 0; x < w; x++) {
        b[row + x] = acc / (2 * r + 1)
        acc += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)]
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0
      for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x]
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / (2 * r + 1)
        acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]
      }
    }
  }
  return a
}
