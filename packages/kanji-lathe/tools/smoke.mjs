#!/usr/bin/env node
// Whole-pipeline integration check, runnable without a browser.
//
//   node tools/smoke.mjs [--all] [--preset "Crown Shy"]
//
// Every preset is pushed through the full pipeline over a spread of glyph
// complexities, then outlined, measured and (once) packed into a TrueType file.
// It fails loudly on non-finite geometry, degenerate outlines and lost strokes.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')

const { decodeCorpus } = await import(join(ROOT, 'src/data/loader.js'))
const { buildGlyph, EM } = await import(join(ROOT, 'src/engine/pipeline.js'))
const { freshParams, SPECS, BY_ID } = await import(join(ROOT, 'src/params.js'))
const { PRESETS } = await import(join(ROOT, 'src/presets.js'))
const { strokeOutline } = await import(join(ROOT, 'src/engine/outline.js'))
const { capsFor } = await import(join(ROOT, 'src/engine/nib.js'))
const { computeMetrics } = await import(join(ROOT, 'src/engine/metrics.js'))
const { trimmedPoints, trimmedWidths } = await import(join(ROOT, 'src/engine/skeleton.js'))
const { buildTTF } = await import(join(ROOT, 'src/font/ttf.js'))

const corpus = decodeCorpus(JSON.parse(readFileSync(join(ROOT, 'public/kanji-1000.json'), 'utf8')))
const args = process.argv.slice(2)
const ALL = args.includes('--all')

let failures = 0
const fail = (msg) => {
  failures++
  console.error('  ✗ ' + msg)
}

// A spread of complexities: one stroke through the densest glyph in the corpus.
const sorted = [...corpus.chars].sort((a, b) => a.strokeCount - b.strokeCount)
const SAMPLE = ALL
  ? corpus.chars
  : [sorted[0], sorted[1], corpus.byChar.get('日'), corpus.byChar.get('海'), corpus.byChar.get('曜') || sorted[800], sorted[sorted.length - 1], sorted[sorted.length - 2]].filter(Boolean)

console.log(`corpus: ${corpus.chars.length} kanji · ${SPECS.length} parameters`)

// 1 — every preset references a parameter that exists
for (const p of PRESETS) {
  for (const k of Object.keys(p.params)) {
    if (!BY_ID.has(k)) fail(`preset "${p.name}" sets unknown parameter ${k}`)
    else {
      const spec = BY_ID.get(k)
      const v = p.params[k]
      if (spec.type === 'select' && !spec.options.some((o) => String(o.value) === String(v))) fail(`preset "${p.name}": ${k}="${v}" is not one of ${spec.options.map((o) => o.value).join('|')}`)
      if (spec.type === 'range' && (v < spec.min || v > spec.max)) fail(`preset "${p.name}": ${k}=${v} outside ${spec.min}..${spec.max}`)
    }
  }
}

// 2 — every parameter the pipeline reads is declared
const declared = new Set(SPECS.map((s) => s.id))
for (const rel of ['src/engine/ops/layout.js', 'src/engine/ops/warp.js', 'src/engine/ops/structure.js', 'src/engine/ops/frame.js', 'src/engine/ops/noise.js', 'src/engine/ops/shyness.js', 'src/engine/ops/fit.js', 'src/engine/nib.js', 'src/render/canvas.js']) {
  const src = readFileSync(join(ROOT, rel), 'utf8')
  for (const m of src.matchAll(/\bP\.([a-z]{2}[A-Z][A-Za-z]*)/g)) {
    if (!declared.has(m[1])) fail(`${rel} reads undeclared parameter P.${m[1]}`)
  }
}

// 3 — the pipeline itself
const results = []
for (const preset of [{ name: 'Defaults', params: {} }, ...PRESETS]) {
  if (args.includes('--preset') && preset.name !== args[args.indexOf('--preset') + 1]) continue
  const P = { ...freshParams(), ...preset.params }
  const t0 = performance.now()
  let polys = 0
  let minLeg = 1
  let dropped = 0
  for (const rec of SAMPLE) {
    let skel
    try {
      skel = buildGlyph(rec, P, { quality: 1 })
    } catch (err) {
      fail(`${preset.name} / ${rec.char}: buildGlyph threw — ${err.message}`)
      continue
    }
    for (const s of skel.strokes) {
      if (!s.alive) {
        dropped++
        continue
      }
      if (s.pts.length !== s.n * 2) fail(`${preset.name} / ${rec.char} #${s.i}: pts resized to ${s.pts.length / 2} (expected ${s.n})`)
      for (let i = 0; i < s.pts.length; i++) {
        if (!Number.isFinite(s.pts[i])) fatal(`${preset.name} / ${rec.char} #${s.i}: non-finite point`)
        if (Math.abs(s.pts[i]) > 40 * EM) fatal(`${preset.name} / ${rec.char} #${s.i}: point ${s.pts[i]} far outside the em`)
      }
      for (let i = 0; i < s.n; i++) {
        if (!(s.w[i] >= 0.5)) fatal(`${preset.name} / ${rec.char} #${s.i}: half-width ${s.w[i]}`)
      }
      const pts = trimmedPoints(s)
      const w = trimmedWidths(s)
      if (pts.length >= 4) {
        const out = strokeOutline(pts, w, { ...capsFor(s, P), join: 'round', miterLimit: 3, capScale: 1 })
        for (const poly of out) {
          polys++
          if (poly.length < 6) fail(`${preset.name} / ${rec.char} #${s.i}: outline polygon with ${poly.length / 2} points`)
          for (const v of poly) if (!Number.isFinite(v)) fatal(`${preset.name} / ${rec.char} #${s.i}: non-finite outline vertex`)
        }
      }
    }
    const m = computeMetrics(skel, P, skel.ctx)
    for (const [k, v] of Object.entries(m)) if (!Number.isFinite(v)) fail(`${preset.name} / ${rec.char}: metric ${k} = ${v}`)
    minLeg = Math.min(minLeg, m.legibility)
  }
  const ms = performance.now() - t0
  results.push({ preset: preset.name, ms, polys, minLeg, dropped })
}

/** A non-finite coordinate is not a finding to tally — stop and show the state. */
function fatal(msg) {
  fail(msg)
  report()
  process.exit(1)
}

// 4 — a real font binary
const P = freshParams()
const upm = EM
const glyphs = []
for (const rec of corpus.chars.slice(0, 60)) {
  const skel = buildGlyph(rec, P, { quality: 1 })
  const contours = []
  for (const s of skel.strokes) {
    if (!s.alive) continue
    const pts = trimmedPoints(s)
    if (pts.length < 4) continue
    for (const poly of strokeOutline(pts, trimmedWidths(s), { ...capsFor(s, P), join: 'round', miterLimit: 3, capScale: 1 })) {
      const flipped = new Float64Array(poly.length)
      for (let i = 0; i < poly.length; i += 2) {
        flipped[i] = poly[i]
        flipped[i + 1] = upm - poly[i + 1]
      }
      contours.push(flipped)
    }
  }
  if (contours.length) glyphs.push({ unicode: rec.char.codePointAt(0), advance: upm, contours })
}
const ttf = buildTTF({ unitsPerEm: upm, ascent: 900, descent: -124, familyName: 'Kanji Lathe Smoke', styleName: 'Regular', version: '1.000', glyphs })
if (!(ttf instanceof Uint8Array) || ttf.length < 2000) fail(`buildTTF produced ${ttf?.length} bytes`)
writeFileSync(join(tmpdir(), 'kanji-lathe-smoke.ttf'), ttf)

function report() {
  console.log('\npreset                 ms     polys   min legibility  dropped')
  for (const r of results) {
    console.log(
      r.preset.padEnd(20) +
        String(Math.round(r.ms)).padStart(6) +
        String(r.polys).padStart(10) +
        r.minLeg.toFixed(3).padStart(16) +
        String(r.dropped).padStart(9),
    )
  }
  console.log(`\nTTF: ${glyphs.length} glyphs, ${(ttf.length / 1024).toFixed(1)} KiB`)
  console.log(failures === 0 ? '\nOK — no failures' : `\n${failures} failure(s)`)
}

report()
process.exit(failures ? 1 : 0)
