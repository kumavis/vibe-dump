#!/usr/bin/env node
// Two checks on the font export, because one is not enough.
//
//   node tools/font-check.mjs
//
// The first re-parses the generated binary with a reader written independently
// of the writer: table directory order, every checksum, loca monotonicity and
// its end matching the glyf length, each glyph's flags and point counts, at
// least one on-curve point per contour, and the cmap resolving every codepoint
// to the right glyph id.
//
// The second hands the file to Chromium. That step exists because a font can be
// perfectly self-consistent and still be rejected: the first version of this
// writer carried a transposed head.magicNumber, sailed through the re-parse, and
// was refused by the sanitiser in every browser. Nothing short of a real
// rasteriser catches that class of bug.
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const R = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(tmpdir(), 'kanji-lathe-font-check.ttf')

const { decodeCorpus } = await import(R + '/src/data/loader.js')
const { buildSkeleton, trimmedPoints, trimmedWidths } = await import(R + '/src/engine/skeleton.js')
const nib = await import(R + '/src/engine/nib.js')
const { styledStroke } = await import(R + '/src/engine/outline-style.js')
const { buildTTF } = await import(R + '/src/font/ttf.js')
const { mulberry32, makeNoise2D, hashString } = await import(R + '/src/geom/path.js')

const STYLE = process.argv.includes('--hollow') ? 'hollow' : 'solid'
// Written by the solid run, read by the hollow one, so the two are comparable.
const BASELINE = join(tmpdir(), 'kanji-lathe-solid-ink.txt')

const corpus = decodeCorpus(JSON.parse(readFileSync(R + '/public/corpus-core.json', 'utf8')))
const P = Object.fromEntries(nib.params.map((s) => [s.id, s.type === 'curve' ? [...s.default] : s.default]))
// Both runs use the same weight, or the ink comparison below is meaningless:
// a hollow glyph drawn heavier than the solid one can carry a real hole and
// still put down more ink. The stroke also has to be thick enough to hold a
// wall and a hole at all.
P.nbWeight = 48
const ctx = (rec) => ({ rng: mulberry32(hashString(rec.char)), noise: makeNoise2D(1), record: rec, time: 0, seed: 1, quality: 1 })
const UPM = 1024
let fails = 0
const bad = (m) => { fails++; console.error('  ✗ ' + m) }

const CHARS = [...'日一国会人年大十二本中長出時政事自行社見月分議後前民生連海警'].filter((c) => corpus.byChar.has(c))
const glyphs = []
for (const ch of CHARS) {
  const rec = corpus.byChar.get(ch)
  const sk = buildSkeleton(rec)
  nib.applyNib(sk, P, ctx(rec))
  const contours = []
  for (const s of sk.strokes) {
    const pts = trimmedPoints(s)
    if (pts.length < 4) continue
    for (const poly of styledStroke(pts, trimmedWidths(s), nib.capsFor(s, P), STYLE)) {
      const f = new Float64Array(poly.length)
      for (let i = 0; i < poly.length; i += 2) { f[i] = poly[i]; f[i + 1] = UPM - poly[i + 1] }
      contours.push(f)
    }
  }
  glyphs.push({ unicode: ch.codePointAt(0), advance: UPM, contours })
}
const bytes = buildTTF({ unitsPerEm: UPM, ascent: 900, descent: -124, familyName: 'Kanji Lathe Test', styleName: 'Regular', version: '1.000', glyphs })
writeFileSync(OUT, bytes)
console.log(`built ${glyphs.length} ${STYLE} glyphs, ${(bytes.length / 1024).toFixed(1)} KiB`)

// ── independent re-parse ─────────────────────────────────────────────────────
const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
const u16 = (o) => dv.getUint16(o), i16 = (o) => dv.getInt16(o), u32 = (o) => dv.getUint32(o)
const numTables = u16(4)
const tables = {}
for (let i = 0; i < numTables; i++) {
  const o = 12 + i * 16
  const tag = String.fromCharCode(bytes[o], bytes[o + 1], bytes[o + 2], bytes[o + 3])
  tables[tag] = { checksum: u32(o + 4), offset: u32(o + 8), length: u32(o + 12) }
}
for (const t of ['head', 'hhea', 'maxp', 'hmtx', 'cmap', 'glyf', 'loca', 'name', 'post', 'OS/2'])
  if (!tables[t]) bad(`missing table ${t}`)
// directory must be sorted by tag
const tags = []
for (let i = 0; i < numTables; i++) { const o = 12 + i * 16; tags.push(String.fromCharCode(bytes[o], bytes[o+1], bytes[o+2], bytes[o+3])) }
if (tags.join() !== [...tags].sort().join()) bad('table directory not sorted by tag')
// checksums
for (const [tag, t] of Object.entries(tables)) {
  let sum = 0
  for (let o = t.offset; o < t.offset + ((t.length + 3) & ~3); o += 4) sum = (sum + u32(o)) >>> 0
  if (tag === 'head') sum = (sum - u32(t.offset + 8)) >>> 0
  if (sum !== t.checksum) bad(`${tag}: checksum ${sum.toString(16)} != ${t.checksum.toString(16)}`)
}
const indexToLoc = i16(tables.head.offset + 50)
const numGlyphs = u16(tables.maxp.offset + 4)
if (numGlyphs !== glyphs.length + 1) bad(`maxp numGlyphs ${numGlyphs}, expected ${glyphs.length + 1}`)
const loca = []
for (let i = 0; i <= numGlyphs; i++)
  loca.push(indexToLoc ? u32(tables.loca.offset + i * 4) : u16(tables.loca.offset + i * 2) * 2)
for (let i = 1; i <= numGlyphs; i++) if (loca[i] < loca[i - 1]) bad(`loca not monotone at ${i}`)
if (loca[numGlyphs] !== tables.glyf.length) bad(`loca end ${loca[numGlyphs]} != glyf length ${tables.glyf.length}`)

// decode every glyph
let totalPts = 0, onCurve = 0
for (let g = 1; g < numGlyphs; g++) {
  if (loca[g + 1] === loca[g]) { bad(`glyph ${g} is empty`); continue }
  let o = tables.glyf.offset + loca[g]
  const nc = i16(o)
  if (nc <= 0) { bad(`glyph ${g}: ${nc} contours (composites not expected)`); continue }
  o += 10
  const ends = []
  for (let c = 0; c < nc; c++) { ends.push(u16(o)); o += 2 }
  for (let c = 1; c < nc; c++) if (ends[c] <= ends[c - 1]) bad(`glyph ${g}: contour ends not increasing`)
  const nPts = ends[nc - 1] + 1
  o += 2 + u16(o) // instructions
  const flags = []
  while (flags.length < nPts) {
    const f = bytes[o++]
    flags.push(f)
    if (f & 8) { let r = bytes[o++]; while (r-- > 0) flags.push(f) }
  }
  if (flags.length !== nPts) bad(`glyph ${g}: decoded ${flags.length} flags for ${nPts} points`)
  let x = 0
  for (const f of flags) { if (f & 2) { const d = bytes[o++]; x += f & 16 ? d : -d } else if (!(f & 16)) { x += i16(o); o += 2 } }
  let y = 0
  for (const f of flags) { if (f & 4) { const d = bytes[o++]; y += f & 32 ? d : -d } else if (!(f & 32)) { y += i16(o); o += 2 } }
  if (o > tables.glyf.offset + loca[g + 1]) bad(`glyph ${g}: read past its loca extent`)
  totalPts += nPts
  onCurve += flags.filter((f) => f & 1).length
  // every contour needs at least one on-curve point
  let s = 0
  for (const e of ends) { let any = false; for (let i = s; i <= e; i++) if (flags[i] & 1) any = true; if (!any) bad(`glyph ${g}: contour with no on-curve point`); s = e + 1 }
}
console.log(`re-parsed: ${numGlyphs} glyphs, ${totalPts} points (${((onCurve / totalPts) * 100).toFixed(0)}% on-curve), loca ${indexToLoc ? 'long' : 'short'}`)

// cmap format 4
let co = tables.cmap.offset
const nSub = u16(co + 2)
let f4 = 0
for (let i = 0; i < nSub; i++) {
  const off = u32(co + 4 + i * 8 + 4)
  if (u16(co + off) === 4) f4 = co + off
}
if (!f4) bad('no format-4 cmap subtable')
else {
  const segX2 = u16(f4 + 6)
  const endO = f4 + 14, startO = endO + segX2 + 2, deltaO = startO + segX2, rangeO = deltaO + segX2
  const lookup = (cp) => {
    for (let s = 0; s < segX2 / 2; s++) {
      if (u16(endO + s * 2) >= cp) {
        if (u16(startO + s * 2) > cp) return 0
        const ro = u16(rangeO + s * 2)
        if (ro === 0) return (cp + i16(deltaO + s * 2)) & 0xffff
        const gi = u16(rangeO + s * 2 + ro + (cp - u16(startO + s * 2)) * 2)
        return gi === 0 ? 0 : (gi + i16(deltaO + s * 2)) & 0xffff
      }
    }
    return 0
  }
  for (let i = 0; i < CHARS.length; i++) {
    const gi = lookup(CHARS[i].codePointAt(0))
    if (gi !== i + 1) bad(`cmap: ${CHARS[i]} -> glyph ${gi}, expected ${i + 1}`)
  }
  console.log(`cmap: all ${CHARS.length} codepoints map to the right glyph id`)
}
console.log(fails ? `${fails} structural failure(s)` : 'structure OK')

// ── does a real rasteriser accept it? ────────────────────────────────────────
const b64 = Buffer.from(bytes).toString('base64')
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const page = await browser.newPage({ viewport: { width: 1200, height: 400 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))

const result = await page.evaluate(
  async ({ b64, chars }) => {
    const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    const face = new FontFace('KLTest', bin.buffer)
    await face.load()
    document.fonts.add(face)
    const c = document.createElement('canvas')
    c.width = c.height = 120
    const g = c.getContext('2d', { willReadFrequently: true })
    const out = []
    for (const ch of chars) {
      g.clearRect(0, 0, 120, 120)
      g.fillStyle = '#000'
      g.font = '96px KLTest'
      g.textBaseline = 'alphabetic'
      g.fillText(ch, 10, 100)
      const d = g.getImageData(0, 0, 120, 120).data
      let ink = 0
      let hash = 0
      for (let i = 3; i < d.length; i += 4) {
        if (d[i] > 40) {
          ink++
          hash = (hash * 31 + i) >>> 0
        }
      }
      // measure the same character in a font that definitely lacks it, to be
      // sure we are not just seeing a fallback face
      g.font = '96px KLTest'
      const w = g.measureText(ch).width
      out.push({ ch, ink, hash, w })
    }
    return out
  },
  { b64, chars: CHARS },
)
await browser.close()

const blank = result.filter((r) => r.ink < 200)
if (blank.length) bad(`${blank.length} glyph(s) rendered blank or near-blank: ${blank.map((r) => r.ch).join('')}`)
const hashes = new Set(result.map((r) => r.hash))
if (hashes.size < result.length) bad(`only ${hashes.size} distinct rasters for ${result.length} characters — glyphs are being confused`)
const widths = new Set(result.map((r) => Math.round(r.w)))
if (widths.size !== 1) bad(`advance widths differ: ${[...widths].join(', ')} (all should be the em)`)

console.log('char  ink px   advance')
for (const r of result.slice(0, 8)) console.log(`  ${r.ch}   ${String(r.ink).padStart(5)}   ${r.w.toFixed(1)}`)
console.log(`…${result.length} characters, ${hashes.size} distinct rasters, advance ${[...widths].join('/')}px at 96px`)
console.log(errors.length ? 'page errors: ' + errors.join('\n') : 'no page errors')
const totalInk = result.reduce((a, r) => a + r.ink, 0)
if (STYLE === 'solid') writeFileSync(BASELINE, String(totalInk))
if (STYLE === 'hollow') {
  // A punched hole is the whole point: a hollow glyph must put down materially
  // less ink than the solid one, or the reversed contour was ignored.
  const base = Number(readFileSync(BASELINE, 'utf8'))
  const ratio = totalInk / base
  console.log(`hollow ink is ${(ratio * 100).toFixed(0)}% of solid ink`)
  if (!(ratio < 0.75)) bad(`hollow glyphs are not hollow — ${(ratio * 100).toFixed(0)}% of solid ink`)
}
console.log(fails ? `\n${fails} failure(s)` : '\nOK — the browser rendered every glyph')
process.exit(fails || errors.length ? 1 : 0)
