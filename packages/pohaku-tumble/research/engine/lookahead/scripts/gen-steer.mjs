// Steering strength under lookahead: the most connective lists ("best" order) run linked > 0.70
// because the additive steering is swamped by the multiplicative lookahead factors.
import { writeFileSync } from 'node:fs'
import { LA, job } from './engines.mjs'
const DEAL = { dealComp: 12 }
const V = {
  LA: [LA, DEAL],
  'LA hiJoinMul.3': [{ ...LA, steer: { ...LA.steer, hiJoinMul: 0.3 } }, DEAL],
  'LA hiJoinMul.1': [{ ...LA, steer: { ...LA.steer, hiJoinMul: 0.1 } }, DEAL],
  'LA hiJoinMul.1 loJoinMul3': [{ ...LA, steer: { ...LA.steer, hiJoinMul: 0.1, lo: 0.45, loJoinMul: 3 } }, DEAL],
  'LA compressed': [{ ...LA, live: { ...LA.live, alpha: 0.5 }, reach: { ...LA.reach, gamma: 0.5 }, fresh: { ...LA.fresh, gamma: 0.5 } }, DEAL],
  'LA compressed hiJoinMul.3': [{ ...LA, live: { ...LA.live, alpha: 0.5 }, reach: { ...LA.reach, gamma: 0.5 }, fresh: { ...LA.fresh, gamma: 0.5 }, steer: { ...LA.steer, hiJoinMul: 0.3 } }, DEAL],
}
const POINTS = [['curve-best-175', 9, 8], ['curve-best-225', 9, 8], ['curve-best-300', 9, 8], ['curve-best-225', 6, 5],
  ['curve-realistic-225', 9, 8], ['curve-realistic-300', 9, 8], ['curve-realistic-175', 5, 4], ['curve-realistic-225', 6, 5], ['curve-random-300', 9, 8], ['curve-random-225', 7, 6]]
const jobs = []
for (const [lex, c, r] of POINTS) for (const [name, e] of Object.entries(V)) jobs.push(job(name, e, lex, c, r))
writeFileSync(process.argv[2], JSON.stringify(jobs, null, 1))
