// The engine configurations of the final runs. Harness R/seek are in beats (ticks);
// the director-mode driver reads R in seconds (one beat is ~1 s of Director play).
export const BASE = { dealMin: 2, matchMin: 2, retry: 6 }
const SCHED = { seek: 0.3, R: 5 }
export const CONF = {
  // Jukugo's rules, deal bound lowered to 1 so small lists deal at all
  stock: { dealMin: 1 },
  // the non-bending baseline the task names: deal bound 2, match bound 2, retry up to 6 other pairs on a stall
  base: { ...BASE },
  // one recovery at a time on the baseline, same scheduling (frozen >= 5 beats; 30% of beats look for such a pair)
  'base+back': { ...BASE, ...SCHED, recover: ['back'] },
  'base+unblock': { ...BASE, ...SCHED, recover: ['unblock'] },
  'base+dtprev': { ...BASE, ...SCHED, recover: ['dtprev'] },
  'base+dt': { ...BASE, ...SCHED, recover: ['dt'] },
  'base+dup': { ...BASE, ...SCHED, recover: ['dup'] },
  'base+dupfar12': { ...BASE, ...SCHED, recover: ['dup'], rDupFar: 12 },
  'base+redeal': { ...BASE, ...SCHED, recover: ['redeal'] },
  // not a recovery: chooseTurn weights a word the pair showed in its last 6 by 0.05
  'base+rw': { ...BASE, recentW: 0.05 },
  // best grammar-clean configuration: auto deal bound, recentW, hand-off, clean double tumble, back-step
  BEST: { ...BASE, dealMin: 'auto', recentW: 0.05, ...SCHED, recover: ['unblock', 'dtprev', 'back'] },
  // the same with the bending variants swapped in
  'BEST-dt': { ...BASE, dealMin: 'auto', recentW: 0.05, ...SCHED, recover: ['unblock', 'dt', 'back'] },
  'BEST+dup': { ...BASE, dealMin: 'auto', recentW: 0.05, ...SCHED, recover: ['unblock', 'dtprev', 'dup', 'back'], rDupFar: 12 },
  'BEST-redeal': { ...BASE, dealMin: 'auto', recentW: 0.05, ...SCHED, recover: ['unblock', 'dtprev', 'redeal'] },
  'redeal+rw': { ...BASE, dealMin: 'auto', recentW: 0.05, ...SCHED, recover: ['redeal'] },
}
