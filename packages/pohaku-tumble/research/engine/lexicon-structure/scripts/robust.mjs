// robust.mjs — does checking candidates in bridge order still pay if only some lookups confirm?
// For a checking order, N lookups and a pass rate p: each of the first N candidates of the order is
// confirmed independently with probability p; the list is the 128 attested + the confirmed ones.
// Reports mean |2-core|, mean walkRepeat of the 2-core (walk.mjs) and mean collide over 12 draws.
// The same p for every order is a simplification: the realistic order puts words already in use in
// Hawaiian Wikipedia first precisely because they are likelier to pass. -> robust.tsv
import fs from 'node:fs'
import { TIERS, loadList, kcore } from './lexgraph.mjs'
import { walkRepeat } from './walk.mjs'
const here = new URL('.', import.meta.url).pathname
const base = loadList(`${TIERS}/curve-realistic-128.json`)
const orders = {
  realistic: loadList(`${TIERS}/curve-realistic-905.json`).slice(128),
  random: loadList(`${TIERS}/curve-random-905.json`).slice(128),
  best: loadList(`${TIERS}/curve-best-905.json`).slice(128),
  bridgeS6: JSON.parse(fs.readFileSync(here + 'lex/bridge-S6-order.json', 'utf8')).slice(128),
}
function rng32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
function collide(list) { const c = new Map(); for (const r of list) for (const p of r.parts) c.set(p, (c.get(p) ?? 0) + 1); let s = 0; for (const v of c.values()) s += (v / (2 * list.length)) ** 2; return s }
const out = [['order', 'lookups', 'pass', 'confirmed', 'core2', 'walkRep', 'collide'].join('\t')]
for (const p of [0.5, 0.75, 1]) for (const N of [60, 120, 200, 300, 400]) for (const [o, cand] of Object.entries(orders)) {
  const draws = p === 1 ? 1 : 12
  let c2 = 0, wr = 0, co = 0, conf = 0
  for (let d = 0; d < draws; d++) {
    const rnd = rng32(1000 + d * 31 + N)
    const picked = cand.slice(0, N).filter(() => rnd() < p)
    const core = kcore([...base, ...picked], 2)
    conf += picked.length; c2 += core.length; wr += walkRepeat(core, { steps: 30000 }).walkRepeat; co += collide(core)
  }
  out.push([o, N, p, (conf / draws).toFixed(0), (c2 / draws).toFixed(0), (wr / draws).toFixed(3), (co / draws).toFixed(4)].join('\t'))
}
fs.writeFileSync(here + 'robust.tsv', out.join('\n') + '\n')
console.log(out.join('\n'))
