// Stage 2: factorial over the reuse knobs on the full 9x8 board.
import { job, REAL } from './common.mjs'
export const jobs = []
for (const lex of REAL)
  for (const tiers of [false, true])
    for (const prevAfter of [null, 6, 12, 25, 50])
      for (const dupFar of [null, 14, 20, 26, 31.1])
        for (const retry of [0, 6])
          for (const dealMin of [1, 3]) {
            const r = { dealMin, retry }
            if (tiers) r.tiers = true
            if (prevAfter != null) r.prevAfter = prevAfter
            if (dupFar != null) r.dupFar = dupFar
            const name = [tiers ? 'T' : '', prevAfter != null ? `P${prevAfter}` : '', dupFar != null ? `D${dupFar}` : '', retry ? `R${retry}` : '', `d${dealMin}`].filter(Boolean).join('-')
            jobs.push(job(name, lex, '9x8', r))
          }
