// Exploration: which director variants move what, 9x8, 1280x800 view, 4 seeds.
const V = {
  stock: {},
  r6: { bgRetry: 6 },
  legal: { bgRetry: 'legal' },
  noteMin2: { noteMin: 2 },
  noteTwo: { noteTwo: true },
  noteLook: { noteLook: true },
  'legal+notes': { bgRetry: 'legal', noteTwo: true, noteLook: true },
  allowPrev: { allowPrev: true },
  'legal+notes+prev': { bgRetry: 'legal', noteTwo: true, noteLook: true, allowPrev: true },
  look01: { look: 0.1 },
  'legal+notes+prev+look01': { bgRetry: 'legal', noteTwo: true, noteLook: true, allowPrev: true, look: 0.1 },
}
const jobs = []
for (const lex of ['attested-WA', 'curve-realistic-300', 'curve-realistic-500', 'curve-realistic-905'])
  for (const [variant, v] of Object.entries(V))
    jobs.push({ lex, variant, cfg: { name: variant, seeds: 4, dealMin: 1, horizontalOnly: true, slab: 1.5, ...v } })
for (const [variant, v] of Object.entries({ stock: {}, 'legal+notes+prev+look01': V['legal+notes+prev+look01'] }))
  jobs.push({ lex: 'jukugo', variant, cfg: { name: variant, seeds: 4, horizontalOnly: false, slab: 1, ...v } })
export default jobs
