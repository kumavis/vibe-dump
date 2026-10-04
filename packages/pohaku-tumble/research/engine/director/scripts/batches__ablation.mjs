// Ablation on 9x8, 1280x800, realistic curve: each director change alone, then cumulatively.
import { BASE, SIZES, lexName } from './configs.mjs'
const single = {
  'stock': {},
  '1:retry6': { bgRetry: 6 },
  '1:legal': { bgRetry: 'legal' },
  '1:noteMin2': { noteMin: 2 },
  '1:noteTwo+noteLook': { noteTwo: true, noteLook: true },
  '1:allowPrev': { allowPrev: true },
  '1:hist0.01': { hist: 0.01 },
}
const steps = [
  ['+allowPrev', { allowPrev: true }],
  ['+legal', { bgRetry: 'legal' }],
  ['+noteTwo+noteLook', { noteTwo: true, noteLook: true }],
  ['+noteFresh', { noteFresh: true }],
  ['+hist0.01 (=D)', { hist: 0.01 }],
  ['+look0.1 (=D+look)', { look: 0.1 }],
]
const cum = {}
let acc = {}
steps.forEach(([k, v], i) => { acc = { ...acc, ...v }; cum[`c${i + 1}:${k}`] = acc })
const jobs = []
for (const n of [128, 175, 225, 300, 400, 500, 905])
  for (const [variant, v] of Object.entries({ ...single, ...cum }))
    jobs.push({ lex: lexName('realistic', n), variant, cfg: { name: variant, ...BASE, cols: 9, rows: 8, ...v } })
export default jobs
