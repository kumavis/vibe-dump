// Exploration 3: grid size / floor scaling on the small lexicons. 1280x800, 4 seeds.
const B = { bgRetry: 'legal', noteTwo: true, noteLook: true, allowPrev: true, hist: 0.05, look: 0.1 }
const V = { stock: {}, B }
const G = [
  { cols: 9, rows: 8 },
  { cols: 7, rows: 6 },
  { cols: 7, rows: 6, scaleFloor: true },
  { cols: 6, rows: 5, scaleFloor: true },
  { cols: 5, rows: 4, scaleFloor: true },
]
const jobs = []
for (const lex of ['attested-WA', 'curve-realistic-175', 'curve-realistic-225', 'curve-realistic-300'])
  for (const g of G)
    for (const [variant, v] of Object.entries(V))
      jobs.push({ lex, variant, cfg: { name: variant, seeds: 4, dealMin: 1, horizontalOnly: true, slab: 1.5, ...g, ...v } })
export default jobs
