// Decoder for a segment's telemetry file (public/tele/<id>.bin, written by tools/telebin.ts).
//
//   gzip( "LCT1" | u32 LE jsonLen | JSON header (space-padded to a multiple of 4) | data area )
//   header: { fs, hop, scalars[10], nArtic, scope, blocks: [{ frames, channels, nPh, nOr, body, offset }] }
//   block @ data-area offset: Float32LE[channels × 2] (min, step) per channel,
//                             Uint16LE[channels × frames] channel-major, delta-coded mod 65536.
//   frame channels: 10 scalars, 17 artic, phAreas(nPh), orAreas(nOr), pressureRms(nPh+nOr),
//                   flow(nPh+nOr), glottalArea(scope)
//
// Each block is dequantised once into a channel-major Float32Array; `TeleBlock.fill` then samples it
// at a fractional frame (linear interpolation, nearest for noiseNode) into a reusable
// TelemetryMessage, the shape the live worklet posts, so the vendored head renderer can't tell.

const SCALAR_NAMES = ['phLen', 'orLen', 'velumPort', 'f0', 'voicing', 'pLung', 'outRms', 'noiseLevel', 'noiseNode', 'gate']

async function gunzip(buf) {
  const ds = new DecompressionStream('gzip')
  const stream = new Blob([buf]).stream().pipeThrough(ds)
  return await new Response(stream).arrayBuffer()
}

/** Parse a telemetry file's bytes (gzipped, or already inflated by the server). */
export async function decodeTele(buf) {
  let u8 = new Uint8Array(buf)
  if (u8[0] === 0x1f && u8[1] === 0x8b) {
    buf = await gunzip(buf)
    u8 = new Uint8Array(buf)
  }
  const magic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3])
  if (magic !== 'LCT1') throw new Error(`telemetry: bad magic "${magic}"`)
  const dv = new DataView(buf)
  const jsonLen = dv.getUint32(4, true)
  const json = new TextDecoder().decode(u8.subarray(8, 8 + jsonLen)).replace(/[\s\0]+$/, '')
  const header = JSON.parse(json)
  const dataStart = 8 + Math.ceil(jsonLen / 4) * 4
  const scalars = header.scalars || SCALAR_NAMES
  for (let i = 0; i < SCALAR_NAMES.length; i++) {
    if (scalars[i] !== SCALAR_NAMES[i]) console.warn(`telemetry: scalar ${i} is "${scalars[i]}", expected "${SCALAR_NAMES[i]}"`)
  }
  const blocks = header.blocks.map((b, i) => new TeleBlock(buf, dataStart + b.offset, b, header, i))
  return { fs: header.fs, hop: header.hop, blocks }
}

export class TeleBlock {
  constructor(buf, at, b, header, index) {
    const { frames, channels, nPh, nOr } = b
    this.index = index
    this.frames = frames
    this.channels = channels
    this.nPh = nPh
    this.nOr = nOr
    this.body = { female: b.body?.female ?? 0, child: b.body?.child ?? 0 }
    this.fs = header.fs
    this.hop = header.hop
    this.nArtic = header.nArtic
    this.scope = header.scope
    this.rate = this.fs / this.hop
    /** seconds from the first frame to the last */
    this.duration = ((frames - 1) * this.hop) / this.fs
    const nT = nPh + nOr
    const want = SCALAR_NAMES.length + this.nArtic + 3 * nT + this.scope
    if (want !== channels) throw new Error(`telemetry block ${index}: ${channels} channels, layout says ${want}`)
    // copy out (offsets need not be aligned for typed-array views)
    const headBytes = channels * 8
    const head = new Float32Array(buf.slice(at, at + headBytes))
    const q = new Uint16Array(buf.slice(at + headBytes, at + headBytes + channels * frames * 2))
    const d = new Float32Array(channels * frames)
    for (let c = 0; c < channels; c++) {
      const min = head[2 * c], step = head[2 * c + 1]
      let acc = 0
      const o = c * frames
      for (let f = 0; f < frames; f++) {
        acc = (acc + q[o + f]) & 0xffff
        d[o + f] = min + acc * step
      }
    }
    this.data = d
    // channel offsets
    let o = SCALAR_NAMES.length
    this.oArtic = o
    o += this.nArtic
    this.oPh = o
    o += nPh
    this.oOr = o
    o += nOr
    this.oP = o
    o += nT
    this.oFlow = o
    o += nT
    this.oGA = o
  }

  /** a fresh TelemetryMessage with buffers for this block's layout (reuse it with fill()) */
  makeMessage() {
    const nT = this.nPh + this.nOr
    return {
      type: 'telemetry',
      t: {
        phLen: 0, orLen: 0, velumPort: 0, f0: 0, voicing: 0, pLung: 0, outRms: 0, noiseLevel: 0, noiseNode: 0, gate: 0, clock: 0,
        artic: new Float32Array(this.nArtic),
        phAreas: new Float32Array(this.nPh),
        orAreas: new Float32Array(this.nOr),
        pressureRms: new Float32Array(nT),
        flow: new Float32Array(nT),
        glottalArea: new Float32Array(this.scope),
        glottalFlow: new Float32Array(this.scope),
        active: [],
      },
      load: 0,
      body: this.body,
      nPh: this.nPh,
      nOr: this.nOr,
      beatStep: -1,
      _layout: this,
    }
  }

  /** frame position (fractional) for a time relative to the block's first frame */
  frameAt(dt) {
    return (dt * this.fs) / this.hop
  }

  /** sample the block at fractional frame u into msg (from makeMessage of a block with the same layout) */
  fill(msg, u, clock = 0) {
    const F = this.frames
    if (!(u > 0)) u = 0
    if (u > F - 1) u = F - 1
    const i0 = Math.floor(u), i1 = Math.min(F - 1, i0 + 1), f = u - i0, g = 1 - f
    const d = this.data
    const ch = (c) => d[c * F + i0] * g + d[c * F + i1] * f
    const t = msg.t
    t.phLen = ch(0)
    t.orLen = ch(1)
    t.velumPort = ch(2)
    t.f0 = ch(3)
    t.voicing = ch(4)
    t.pLung = ch(5)
    t.outRms = ch(6)
    t.noiseLevel = ch(7)
    t.noiseNode = d[8 * F + (f < 0.5 ? i0 : i1)]
    t.gate = ch(9)
    t.clock = clock
    const run = (arr, o) => {
      for (let k = 0; k < arr.length; k++) arr[k] = ch(o + k)
    }
    run(t.artic, this.oArtic)
    run(t.phAreas, this.oPh)
    run(t.orAreas, this.oOr)
    run(t.pressureRms, this.oP)
    run(t.flow, this.oFlow)
    run(t.glottalArea, this.oGA)
    msg.body = this.body
    return msg
  }

  /** the artic vector (17) at fractional frame u into out */
  articAt(u, out) {
    const F = this.frames
    u = Math.max(0, Math.min(F - 1, u))
    const i0 = Math.floor(u), i1 = Math.min(F - 1, i0 + 1), f = u - i0
    for (let k = 0; k < this.nArtic; k++) {
      const c = (this.oArtic + k) * F
      out[k] = this.data[c + i0] * (1 - f) + this.data[c + i1] * f
    }
    return out
  }
}

/** fetch + decode */
export async function loadTele(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`)
  return decodeTele(await r.arrayBuffer())
}
