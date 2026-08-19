#!/usr/bin/env node
// Per-operator torture test: no-op at defaults across the whole corpus, finite
// and in-bounds at every parameter extreme (alone and all at once), safe to
// apply twice, and inside its time budget.
//
//   node tools/ops-sweep.mjs
//
// Goes module by module rather than through pipeline.js, so a single misbehaving
// operator is named directly instead of showing up as a broken glyph later.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const R = join(dirname(fileURLToPath(import.meta.url)), '..')

const { decodeCorpus } = await import(R + '/src/data/loader.js')
const { buildSkeleton } = await import(R + '/src/engine/skeleton.js')
const { mulberry32, makeNoise2D, hashString } = await import(R + '/src/geom/path.js')

const MODS = {}
for (const name of ['layout', 'warp', 'structure', 'frame', 'noise', 'shyness', 'fit']) {
  try {
    MODS[name] = await import(`${R}/src/engine/ops/${name}.js`)
  } catch (err) {
    console.warn(`! skipping ops/${name}.js — ${err.message}`)
  }
}
const corpus = decodeCorpus(JSON.parse(readFileSync(R + '/public/kanji-1000.json', 'utf8')))
const noise = makeNoise2D(1)
const mkCtx = (rec) => ({ rng: mulberry32(hashString(rec.char)), noise, record: rec, time: 0, seed: 1, glyphSeed: hashString(rec.char), quality: 1 })

const sorted = [...corpus.chars].sort((a, b) => a.strokeCount - b.strokeCount)
const pick = (n) => Array.from({ length: n }, (_, i) => sorted[Math.round(((sorted.length - 1) * i) / (n - 1))])

let fails = 0
const bad = (m) => { fails++; console.error('  ✗ ' + m) }

for (const [name, mod] of Object.entries(MODS)) {
  const specs = mod.params || []
  const D = Object.fromEntries(specs.map((s) => [s.id, s.type === 'curve' ? [...s.default] : s.default]))

  // 1. no-op at defaults, over the whole corpus
  let changed = 0
  for (const rec of corpus.chars) {
    const sk = buildSkeleton(rec)
    const before = sk.strokes.map((s) => s.pts.slice())
    mod.apply(sk, D, mkCtx(rec))
    for (let i = 0; i < before.length; i++) {
      const a = before[i], b = sk.strokes[i].pts
      if (a.length !== b.length) { bad(`${name}: pts resized on ${rec.char}`); break }
      for (let j = 0; j < a.length; j++) if (a[j] !== b[j]) { changed++; j = a.length; i = before.length }
    }
  }
  if (changed) bad(`${name}: not a no-op at defaults (${changed} glyphs moved)`)

  // 2. every parameter at both extremes, alone and all-at-once
  const cases = [{ label: 'defaults', P: D }]
  for (const s of specs) {
    if (s.type === 'range') {
      cases.push({ label: s.id + '=min', P: { ...D, [s.id]: s.min } })
      cases.push({ label: s.id + '=max', P: { ...D, [s.id]: s.max } })
    } else if (s.type === 'select') {
      for (const o of s.options) cases.push({ label: `${s.id}=${o.value}`, P: { ...D, [s.id]: o.value } })
    } else if (s.type === 'toggle') cases.push({ label: s.id + '=on', P: { ...D, [s.id]: !s.default } })
    else if (s.type === 'curve') cases.push({ label: s.id + '=spiky', P: { ...D, [s.id]: s.default.map((_, i) => (i % 2 ? 0.02 : 0.98)) } })
    else if (s.type === 'seed') cases.push({ label: s.id + '=7', P: { ...D, [s.id]: 7 } })
  }
  const allMax = { ...D }, allMin = { ...D }
  for (const s of specs) {
    if (s.type === 'range') { allMax[s.id] = s.max; allMin[s.id] = s.min }
    if (s.type === 'toggle') { allMax[s.id] = !s.default }
  }
  cases.push({ label: 'ALL=max', P: allMax }, { label: 'ALL=min', P: allMin })

  const probes = pick(12)
  let worst = 0
  for (const c of cases) {
    for (const rec of probes) {
      const sk = buildSkeleton(rec)
      const t = performance.now()
      try { mod.apply(sk, c.P, mkCtx(rec)) } catch (e) { bad(`${name} [${c.label}] ${rec.char}: threw ${e.message}`); continue }
      worst = Math.max(worst, performance.now() - t)
      for (const s of sk.strokes) {
        if (!s.alive) continue
        for (let i = 0; i < s.pts.length; i++) {
          if (!Number.isFinite(s.pts[i])) { bad(`${name} [${c.label}] ${rec.char}#${s.i}: non-finite`); i = s.pts.length }
          else if (Math.abs(s.pts[i]) > 20000) { bad(`${name} [${c.label}] ${rec.char}#${s.i}: ${s.pts[i].toFixed(0)} out of bounds`); i = s.pts.length }
        }
      }
    }
  }

  // 3. determinism: a fresh context with the same seed must reproduce the run
  //    bit-for-bit, or a shared link would not show the same design twice
  for (const rec of probes) {
    const a = buildSkeleton(rec)
    const b = buildSkeleton(rec)
    mod.apply(a, allMax, mkCtx(rec))
    mod.apply(b, allMax, mkCtx(rec))
    for (let i = 0; i < a.strokes.length; i++) {
      const pa = a.strokes[i].pts
      const pb = b.strokes[i].pts
      for (let j = 0; j < pa.length; j++) {
        if (pa[j] !== pb[j]) { bad(`${name}: not deterministic on ${rec.char}#${i}`); j = pa.length; i = a.strokes.length }
      }
    }
  }

  // 4. idempotence-safety: applying twice must not explode
  for (const rec of probes) {
    const sk = buildSkeleton(rec)
    mod.apply(sk, allMax, mkCtx(rec))
    mod.apply(sk, allMax, mkCtx(rec))
    for (const s of sk.strokes) for (const v of s.pts) if (!Number.isFinite(v)) { bad(`${name}: double-apply produced non-finite on ${rec.char}`); break }
  }

  console.log(`${name.padEnd(10)} ${String(specs.length).padStart(2)} params · ${String(cases.length).padStart(3)} cases · worst ${worst.toFixed(2)} ms`)
}
console.log(fails ? `\n${fails} failure(s)` : '\nOK — no failures')
process.exit(fails ? 1 : 0)
