#!/usr/bin/env node
// Build src/data/kanji-1000.json from KanjiVG + KANJIDIC2.
//
//   node tools/build-dataset.mjs --kanjivg <dir-of-svgs> --kanjidic <kanjidic2.xml> [--count 1000]
//
// The output is committed so the app stays a zero-dependency static build.
// Sources (both redistributable, see LICENSES.md next to the data file):
//   • KanjiVG   — CC BY-SA 3.0 — https://kanjivg.tagaini.net
//   • KANJIDIC2 — CC BY-SA 4.0 — https://www.edrdg.org/wiki/index.php/KANJIDIC_Project
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const argv = process.argv.slice(2)
const arg = (name, dflt) => {
  const i = argv.indexOf('--' + name)
  return i === -1 ? dflt : argv[i + 1]
}
const VG_DIR = arg('kanjivg')
const DIC = arg('kanjidic')
const COUNT = Number(arg('count', 1000))
const OUT = arg('out', join(HERE, '..', 'public', 'kanji-1000.json'))
// Importable for tests; only builds when run as a script.
const IS_MAIN = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (IS_MAIN && (!VG_DIR || !DIC)) {
  console.error('usage: build-dataset.mjs --kanjivg <svgdir> --kanjidic <kanjidic2.xml> [--count 1000]')
  process.exit(1)
}

// ── The em grid ──────────────────────────────────────────────────────────────
// KanjiVG draws on a 109×109 box. We rescale to EM units and quantize; 1/1024 em
// is roughly a tenth of a pixel on a 100px glyph, far below anything visible.
const VG_BOX = 109
const EM = 1024

// ── Compact coordinate codec ─────────────────────────────────────────────────
// Stroke geometry is a run of absolute cubic segments. We delta-encode the
// coordinate stream (successive points are close together) and pack each delta
// into a base-64 alphabet: one char for -31..31, otherwise a 3-char escape.
// Deltas are small in practice, so this lands near 1.2 bytes per coordinate.
const A64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const IDX64 = Object.fromEntries([...A64].map((c, i) => [c, i]))

export function encodeCoords(nums) {
  // nums is an interleaved x,y stream; each axis is delta-coded against its own
  // previous value, which keeps deltas tiny (successive control points are close).
  let out = ''
  const prev = [0, 0]
  for (let i = 0; i < nums.length; i++) {
    const ax = i & 1
    const d = nums[i] - prev[ax]
    prev[ax] = nums[i]
    if (d >= -31 && d <= 31) {
      out += A64[d + 31] // 0..62 — 63 ('/') is the escape marker
    } else {
      // escape: '/' + two chars of a zig-zagged 12-bit value (0..4095)
      const zz = d < 0 ? -d * 2 - 1 : d * 2
      if (zz > 4095) throw new Error('delta out of range: ' + d)
      out += '/' + A64[zz >> 6] + A64[zz & 63]
    }
  }
  return out
}

export function decodeCoords(str) {
  const out = []
  const prev = [0, 0]
  for (let i = 0, k = 0; i < str.length; i++, k++) {
    const c = str[i]
    let d
    if (c === '/') {
      const zz = (IDX64[str[++i]] << 6) | IDX64[str[++i]]
      d = zz & 1 ? -((zz + 1) / 2) : zz / 2
    } else {
      d = IDX64[c] - 31
    }
    const ax = k & 1
    prev[ax] += d
    out.push(prev[ax])
  }
  return out
}

// ── SVG path → absolute cubic coordinate stream ──────────────────────────────
// KanjiVG only ever emits M/m/C/c/S/s. Everything becomes absolute cubics, so a
// stroke is [x0,y0, then 6 numbers per segment].
function parseStrokePath(d) {
  const toks = d.match(/[MmCcSsLlZz]|-?\d*\.?\d+(?:e-?\d+)?/g) || []
  let i = 0
  const num = () => parseFloat(toks[i++])
  const nums = []
  let cx = 0
  let cy = 0
  let px = 0 // previous 2nd control point, for S/s smoothing
  let py = 0
  let cmd = null
  let started = false
  const push6 = (a, b, c, dd, e, f) => nums.push(a, b, c, dd, e, f)

  while (i < toks.length) {
    if (/[MmCcSsLlZz]/.test(toks[i])) cmd = toks[i++]
    if (cmd === 'M' || cmd === 'm') {
      const rel = cmd === 'm'
      const x = num()
      const y = num()
      cx = rel && started ? cx + x : x
      cy = rel && started ? cy + y : y
      if (!started) {
        nums.push(cx, cy)
        started = true
      }
      px = cx
      py = cy
      cmd = cmd === 'M' ? 'L' : 'l'
      continue
    }
    if (cmd === 'L' || cmd === 'l') {
      const rel = cmd === 'l'
      const x0 = cx
      const y0 = cy
      const x = num()
      const y = num()
      cx = rel ? cx + x : x
      cy = rel ? cy + y : y
      // a straight line as a degenerate cubic
      push6(x0 + (cx - x0) / 3, y0 + (cy - y0) / 3, x0 + (2 * (cx - x0)) / 3, y0 + (2 * (cy - y0)) / 3, cx, cy)
      px = cx
      py = cy
      continue
    }
    if (cmd === 'C' || cmd === 'c') {
      const rel = cmd === 'c'
      const bx = rel ? cx : 0
      const by = rel ? cy : 0
      const c1x = bx + num()
      const c1y = by + num()
      const c2x = bx + num()
      const c2y = by + num()
      const ex = bx + num()
      const ey = by + num()
      push6(c1x, c1y, c2x, c2y, ex, ey)
      px = c2x
      py = c2y
      cx = ex
      cy = ey
      continue
    }
    if (cmd === 'S' || cmd === 's') {
      const rel = cmd === 's'
      const bx = rel ? cx : 0
      const by = rel ? cy : 0
      const c1x = 2 * cx - px
      const c1y = 2 * cy - py
      const c2x = bx + num()
      const c2y = by + num()
      const ex = bx + num()
      const ey = by + num()
      push6(c1x, c1y, c2x, c2y, ex, ey)
      px = c2x
      py = c2y
      cx = ex
      cy = ey
      continue
    }
    if (cmd === 'Z' || cmd === 'z') continue
    i++ // unknown token, skip
  }
  return nums
}

// ── KanjiVG SVG → { strokes, groups } ────────────────────────────────────────
// Groups nest, and their document order matches stroke order, so a depth-first
// walk gives each group a contiguous [from,to) stroke range for free.
const attrs = (tag) => {
  const out = {}
  for (const m of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) out[m[1]] = m[2]
  return out
}

function parseKanjiVG(svg) {
  const start = svg.indexOf('<g id="kvg:StrokePaths_')
  if (start === -1) throw new Error('no StrokePaths group')
  const end = svg.indexOf('<g id="kvg:StrokeNumbers_')
  const body = svg.slice(start, end === -1 ? svg.length : end)

  const strokes = []
  const groups = []
  const stack = []
  // Tokenize just the tags we care about, in document order.
  const tagRe = /<g\b[^>]*>|<\/g>|<path\b[^>]*\/?>/g
  let m
  let first = true
  while ((m = tagRe.exec(body))) {
    const tag = m[0]
    if (tag.startsWith('</g')) {
      const g = stack.pop()
      if (g) g.to = strokes.length
      continue
    }
    if (tag.startsWith('<g')) {
      const a = attrs(tag)
      if (first) {
        // the outer StrokePaths wrapper carries no kvg data
        first = false
        stack.push(null)
        continue
      }
      const g = {
        i: groups.length,
        parent: [...stack].reverse().find((x) => x)?.i ?? -1,
        depth: stack.filter(Boolean).length,
        element: a['kvg:element'] || '',
        original: a['kvg:original'] || '',
        radical: a['kvg:radical'] || '',
        position: a['kvg:position'] || '',
        phon: a['kvg:phon'] || '',
        variant: a['kvg:variant'] === 'true',
        part: a['kvg:part'] ? Number(a['kvg:part']) : 0,
        from: strokes.length,
        to: strokes.length,
      }
      groups.push(g)
      stack.push(g)
      continue
    }
    // <path>
    const a = attrs(tag)
    if (!a.d) continue
    strokes.push({ type: a['kvg:type'] || '', d: a.d })
  }
  for (const g of stack) if (g) g.to = strokes.length
  return { strokes, groups }
}

// Positions and radical flavours are a tiny closed vocabulary — store them as
// single letters and let the loader expand them again.
const POS_CODE = {
  '': '',
  left: 'l',
  right: 'r',
  top: 't',
  bottom: 'b',
  tare: 'a',
  tarec: 'A',
  kamae: 'k',
  kamaec: 'K',
  nyo: 'n',
  nyoc: 'N',
  middle: 'm',
}
const RAD_CODE = { '': '', general: 'g', tradit: 't', nelson: 'n', jis: 'j' }

// ── KANJIDIC2 ────────────────────────────────────────────────────────────────
function parseKanjidic(xml) {
  const out = new Map()
  for (const chunk of xml.split('<character>').slice(1)) {
    const lit = /<literal>(.*?)<\/literal>/.exec(chunk)
    if (!lit) continue
    const freq = /<freq>(\d+)<\/freq>/.exec(chunk)
    const grade = /<grade>(\d+)<\/grade>/.exec(chunk)
    const sc = /<stroke_count>(\d+)<\/stroke_count>/.exec(chunk)
    const jlpt = /<jlpt>(\d+)<\/jlpt>/.exec(chunk)
    const meanings = [...chunk.matchAll(/<meaning>([^<]+)<\/meaning>/g)]
      .filter((m) => !/<meaning m_lang=/.test(m[0]))
      .map((m) => m[1])
    const on = [...chunk.matchAll(/<reading r_type="ja_on">([^<]+)<\/reading>/g)].map((m) => m[1])
    const kun = [...chunk.matchAll(/<reading r_type="ja_kun">([^<]+)<\/reading>/g)].map((m) => m[1])
    out.set(lit[1], {
      freq: freq ? +freq[1] : 0,
      grade: grade ? +grade[1] : 0,
      strokes: sc ? +sc[1] : 0,
      jlpt: jlpt ? +jlpt[1] : 0,
      meanings: meanings.slice(0, 4),
      on: on.slice(0, 3),
      kun: kun.slice(0, 3),
    })
  }
  return out
}

// ── Build ────────────────────────────────────────────────────────────────────
if (!IS_MAIN) { /* imported for its codec only */ } else {
const dic = parseKanjidic(readFileSync(DIC, 'utf8'))
const ranked = [...dic.entries()]
  .filter(([, v]) => v.freq > 0)
  .sort((a, b) => a[1].freq - b[1].freq)
  .slice(0, COUNT)

const scale = EM / VG_BOX
const chars = []
const typeTally = new Map()
let coordCount = 0

for (const [ch, info] of ranked) {
  const cp = ch.codePointAt(0).toString(16).padStart(5, '0')
  const file = join(VG_DIR, cp + '.svg')
  if (!existsSync(file)) {
    console.warn('! no KanjiVG for', ch, cp)
    continue
  }
  const { strokes, groups } = parseKanjiVG(readFileSync(file, 'utf8'))
  const enc = []
  const types = []
  for (const s of strokes) {
    const raw = parseStrokePath(s.d)
    const q = raw.map((n) => Math.round(n * scale))
    coordCount += q.length
    enc.push(encodeCoords(q))
    types.push(s.type)
    typeTally.set(s.type, (typeTally.get(s.type) || 0) + 1)
  }
  chars.push({
    c: ch,
    f: info.freq,
    g: info.grade,
    j: info.jlpt,
    n: strokes.length,
    m: info.meanings,
    on: info.on,
    kun: info.kun,
    // strokes: one compact coordinate string each, plus its KanjiVG stroke type
    s: enc,
    // stroke types, space-separated in stroke order
    t: types.join(' '),
    // component groups, depth-first, one ';'-separated record each:
    //   element,position,radical,depth,parent,from,to,flags
    gr: groups
      .map((g) =>
        [
          g.element || g.original || '',
          POS_CODE[g.position] ?? g.position,
          RAD_CODE[g.radical] ?? g.radical,
          g.depth,
          g.parent,
          g.from,
          g.to,
          (g.variant ? 1 : 0) | (g.phon ? 2 : 0),
        ].join(','),
      )
      .join(';'),
  })
}

const data = {
  meta: {
    em: EM,
    count: chars.length,
    generated: new Date().toISOString().slice(0, 10),
    sources: [
      { name: 'KanjiVG', license: 'CC BY-SA 3.0', url: 'https://kanjivg.tagaini.net' },
      { name: 'KANJIDIC2', license: 'CC BY-SA 4.0', url: 'https://www.edrdg.org/wiki/index.php/KANJIDIC_Project' },
    ],
    note: 'Stroke coordinates are delta+base64 packed absolute cubic Béziers on a 1024 em grid.',
  },
  chars,
}

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(data))
const bytes = readFileSync(OUT).length
console.log(`wrote ${OUT}`)
console.log(`  ${chars.length} kanji, ${chars.reduce((a, c) => a + c.s.length, 0)} strokes, ${coordCount} coords`)
console.log(`  ${(bytes / 1024).toFixed(1)} KiB raw`)
console.log(`  ${typeTally.size} distinct stroke types`)
}
