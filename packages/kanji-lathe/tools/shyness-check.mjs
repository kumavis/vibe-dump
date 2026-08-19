#!/usr/bin/env node
// Behavioural check for the signature effect.
//
//   node tools/shyness-check.mjs
//
// Crown shyness has to actually open gaps, not merely jiggle points, so this
// measures the minimum clearance between points on *different* strokes before
// and after, confirms the canopy trim really retracts stroke tips without
// consuming a stroke whole, and holds the operator to its time budget on the
// densest glyph in the corpus.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const R = join(dirname(fileURLToPath(import.meta.url)), '..')

const { decodeCorpus } = await import(R + '/src/data/loader.js')
const { buildSkeleton, trimmedPoints } = await import(R + '/src/engine/skeleton.js')
const sy = await import(R + '/src/engine/ops/shyness.js')
const { mulberry32, makeNoise2D, hashString } = await import(R + '/src/geom/path.js')

const corpus = decodeCorpus(JSON.parse(readFileSync(R + '/public/kanji-1000.json', 'utf8')))
const D = Object.fromEntries(sy.params.map((s) => [s.id, s.type === 'curve' ? [...s.default] : s.default]))
const ctx = (rec, q = 1) => ({ rng: mulberry32(hashString(rec.char)), noise: makeNoise2D(1), record: rec, time: 0, seed: 1, quality: q })

/** Min distance between sample points belonging to different strokes. */
function minGap(sk) {
  let best = Infinity
  const S = sk.strokes.filter((s) => s.alive)
  for (let a = 0; a < S.length; a++)
    for (let b = a + 1; b < S.length; b++)
      for (let i = 0; i < S[a].n; i++)
        for (let j = 0; j < S[b].n; j++) {
          const d = Math.hypot(S[a].pts[i * 2] - S[b].pts[j * 2], S[a].pts[i * 2 + 1] - S[b].pts[j * 2 + 1])
          if (d < best) best = d
        }
  return best
}

const sorted = [...corpus.chars].sort((a, b) => b.strokeCount - a.strokeCount)
const probes = [corpus.byChar.get('日'), corpus.byChar.get('海'), corpus.byChar.get('警'), sorted[0], sorted[1]].filter(Boolean)

const SETTING = { ...D, syStrength: 0.7, syRadius: 0.1, syIterations: 10, syPerp: 0.7, syTrim: 0.18, syTrimReach: 0.1, syPreserveEnds: 0.3, syRelax: 0.3 }
console.log('char  strokes   gap before   gap after   trimmed tips')
for (const rec of probes) {
  const a = buildSkeleton(rec)
  const before = minGap(a)
  sy.apply(a, SETTING, ctx(rec))
  const after = minGap(a)
  let trimmed = 0
  for (const s of a.strokes) {
    if (s.t0 > 0.001) trimmed++
    if (s.t1 < 0.999) trimmed++
    const tp = trimmedPoints(s)
    if (tp.length < 4) console.error(`  ✗ ${rec.char}#${s.i} trimmed to ${tp.length / 2} points`)
  }
  console.log(
    `${rec.char}     ${String(rec.strokeCount).padStart(2)}      ${before.toFixed(1).padStart(8)}    ${after.toFixed(1).padStart(8)}    ${trimmed}`,
  )
}

// worst-case timing on the densest glyph, at the settings the contract names
const heavy = { ...D, syStrength: 1, syRadius: 0.25, syIterations: 24, syTrim: 0.35, syGapTarget: 0.12, syRepelSelf: 1 }
const sk = buildSkeleton(sorted[0])
const t0 = performance.now()
sy.apply(sk, heavy, ctx(sorted[0]))
const ms = performance.now() - t0
console.log(`\nworst case: ${sorted[0].char} (${sorted[0].strokeCount} strokes), max settings — ${ms.toFixed(1)} ms ${ms < 60 ? 'OK' : 'OVER BUDGET'}`)

// quality scaling must actually cut the cost for thumbnails
const sk2 = buildSkeleton(sorted[0])
const t1 = performance.now()
sy.apply(sk2, heavy, ctx(sorted[0], 0.3))
console.log(`quality 0.3: ${(performance.now() - t1).toFixed(1)} ms`)
