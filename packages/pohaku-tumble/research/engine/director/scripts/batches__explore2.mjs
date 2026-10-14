// Exploration 2: attacking repeats. 9x8, 1280x800, 4 seeds.
const L = { bgRetry: 'legal', noteTwo: true, noteLook: true, allowPrev: true }
const V = {
  stock: {},
  L,
  'L+hist0.2': { ...L, hist: 0.2 },
  'L+hist0.05': { ...L, hist: 0.05 },
  'F+hist0.2': { ...L, bgRetry: 'fresh', hist: 0.2 },
  'F+strict+hist0.2': { ...L, bgRetry: 'fresh', noteStrict: true, noteFresh: true, hist: 0.2 },
  'F+strict+hist0.05': { ...L, bgRetry: 'fresh', noteStrict: true, noteFresh: true, hist: 0.05 },
  'F+strict+hist0.2+look0.1': { ...L, bgRetry: 'fresh', noteStrict: true, noteFresh: true, hist: 0.2, look: 0.1 },
}
const jobs = []
for (const lex of ['curve-realistic-225', 'curve-realistic-300', 'curve-realistic-400', 'curve-realistic-500'])
  for (const [variant, v] of Object.entries(V))
    jobs.push({ lex, variant, cfg: { name: variant, seeds: 4, dealMin: 1, horizontalOnly: true, slab: 1.5, ...v } })
for (const [variant, v] of Object.entries({ 'F+strict+hist0.2': V['F+strict+hist0.2'] }))
  jobs.push({ lex: 'jukugo', variant, cfg: { name: variant, seeds: 4, horizontalOnly: false, slab: 1, ...v } })
export default jobs
