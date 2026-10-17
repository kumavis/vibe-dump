// Exploration 4: refinements of B. 1280x800, 6 seeds.
const B0 = { bgRetry: 'legal', noteTwo: true, noteLook: true, allowPrev: true, hist: 0.05 }
const B = { ...B0, look: 0.1 }
const V = {
  B0, B,
  'B+hist0.01': { ...B, hist: 0.01 },
  'B+noteFresh': { ...B, noteFresh: true },
  'B+freshW0.3': { ...B, freshW: 0.3 },
  'B+noteFresh+hist0.01': { ...B, noteFresh: true, hist: 0.01 },
}
const jobs = []
for (const [lex, g] of [['curve-realistic-225', { cols: 9, rows: 8 }], ['curve-realistic-300', { cols: 9, rows: 8 }], ['curve-realistic-400', { cols: 9, rows: 8 }],
  ['curve-realistic-175', { cols: 6, rows: 5, scaleFloor: true }], ['curve-realistic-225', { cols: 6, rows: 5, scaleFloor: true }]])
  for (const [variant, v] of Object.entries(V))
    jobs.push({ lex, variant, cfg: { name: variant, seeds: 6, dealMin: 1, horizontalOnly: true, slab: 1.5, ...g, ...v } })
export default jobs
