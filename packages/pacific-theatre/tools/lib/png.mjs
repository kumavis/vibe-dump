// A minimal PNG writer and reader for the bake.
//
// Copied from packages/ahupuaa/tools/png.mjs (8-bit RGB, no interlace) and
// extended here: greyscale output, per-row adaptive filtering for smaller
// files, and a decoder so the checker can read back exactly what was written.
// Every image this writes is 8-bit, non-interlaced, colour type 2 (RGB) or 0
// (grey), which browsers decode losslessly.
import { deflateSync, inflateSync } from 'node:zlib'
import { readFileSync, writeFileSync } from 'node:fs'

const CRC = new Int32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  CRC[n] = c
}
function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
}

// Filter one row with filter type f into out (length stride), given the
// previous row (or null for the first row). bpp = bytes per pixel.
function filterRow(f, row, prev, bpp, out) {
  const n = row.length
  for (let i = 0; i < n; i++) {
    const a = i >= bpp ? row[i - bpp] : 0
    const b = prev ? prev[i] : 0
    const c = prev && i >= bpp ? prev[i - bpp] : 0
    let p = 0
    if (f === 1) p = a
    else if (f === 2) p = b
    else if (f === 3) p = (a + b) >> 1
    else if (f === 4) p = paeth(a, b, c)
    out[i] = (row[i] - p) & 255
  }
}

/**
 * Encode an 8-bit PNG. data: Uint8Array of w*h*channels (channels 1 = grey,
 * 3 = RGB). Rows are filtered with the usual minimum-sum-of-absolute-
 * differences heuristic, which is lossless and only changes the file size.
 */
export function encodePNG(w, h, data, channels = 3) {
  if (channels !== 1 && channels !== 3) throw new Error('channels must be 1 or 3')
  if (data.length !== w * h * channels) throw new Error(`data length ${data.length} != ${w}*${h}*${channels}`)
  const stride = w * channels
  const raw = Buffer.alloc((stride + 1) * h)
  const cand = [0, 1, 2, 3, 4].map(() => new Uint8Array(stride))
  for (let y = 0; y < h; y++) {
    const row = data.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? data.subarray((y - 1) * stride, y * stride) : null
    let best = 0
    let bestScore = Infinity
    for (let f = 0; f < 5; f++) {
      filterRow(f, row, prev, channels, cand[f])
      let s = 0
      const c = cand[f]
      for (let i = 0; i < stride; i++) s += c[i] < 128 ? c[i] : 256 - c[i]
      if (s < bestScore) { bestScore = s; best = f }
    }
    raw[y * (stride + 1)] = best
    Buffer.from(cand[best].buffer, 0, stride).copy(raw, y * (stride + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = channels === 3 ? 2 : 0 // colour type
  ihdr[10] = 0 // deflate
  ihdr[11] = 0 // adaptive filtering
  ihdr[12] = 0 // no interlace
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** rgb: Uint8Array of w*h*3 (the original ahupuaʻa signature). */
export function writePNG(path, w, h, rgb) {
  writeFileSync(path, encodePNG(w, h, rgb, 3))
}

/** grey: Uint8Array of w*h. */
export function writeGreyPNG(path, w, h, grey) {
  writeFileSync(path, encodePNG(w, h, grey, 1))
}

/**
 * Decode an 8-bit, non-interlaced grey or RGB PNG (what this module writes).
 * Returns { width, height, channels, colourType, interlace, bitDepth, data }.
 * Throws on anything else, so the checker fails loudly on a wrong format.
 */
export function readPNG(path) {
  const buf = readFileSync(path)
  const sig = [137, 80, 78, 71, 13, 10, 26, 10]
  for (let i = 0; i < 8; i++) if (buf[i] !== sig[i]) throw new Error(`${path}: not a PNG`)
  let off = 8
  let width = 0, height = 0, bitDepth = 0, colourType = -1, interlace = -1
  const idat = []
  while (off < buf.length) {
    const len = buf.readUInt32BE(off)
    const type = buf.toString('latin1', off + 4, off + 8)
    const body = buf.subarray(off + 8, off + 8 + len)
    const crc = buf.readUInt32BE(off + 8 + len)
    if (crc32(buf.subarray(off + 4, off + 8 + len)) !== crc) throw new Error(`${path}: bad CRC in ${type}`)
    if (type === 'IHDR') {
      width = body.readUInt32BE(0)
      height = body.readUInt32BE(4)
      bitDepth = body[8]
      colourType = body[9]
      interlace = body[12]
    } else if (type === 'IDAT') idat.push(body)
    else if (type === 'IEND') break
    off += 12 + len
  }
  if (bitDepth !== 8) throw new Error(`${path}: bit depth ${bitDepth}, expected 8`)
  if (interlace !== 0) throw new Error(`${path}: interlaced`)
  const channels = colourType === 2 ? 3 : colourType === 0 ? 1 : 0
  if (!channels) throw new Error(`${path}: colour type ${colourType}, expected 0 or 2`)
  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * channels
  if (raw.length !== (stride + 1) * height) throw new Error(`${path}: bad data length`)
  const data = new Uint8Array(stride * height)
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)]
    const src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1))
    const row = data.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? data.subarray((y - 1) * stride, y * stride) : null
    for (let i = 0; i < stride; i++) {
      const a = i >= channels ? row[i - channels] : 0
      const b = prev ? prev[i] : 0
      const c = prev && i >= channels ? prev[i - channels] : 0
      let p = 0
      if (f === 1) p = a
      else if (f === 2) p = b
      else if (f === 3) p = (a + b) >> 1
      else if (f === 4) p = paeth(a, b, c)
      else if (f !== 0) throw new Error(`${path}: bad filter ${f}`)
      row[i] = (src[i] + p) & 255
    }
  }
  return { width, height, channels, colourType, interlace, bitDepth, data }
}
