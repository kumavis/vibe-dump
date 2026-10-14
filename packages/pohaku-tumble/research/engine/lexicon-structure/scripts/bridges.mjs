// bridges.mjs — which unconfirmed candidates would most improve the attested list's connectivity.
//
// Base: the 128 attested words, sense-keyed (curve-realistic-128.json; attested-WA.json keys roots by
// spelling, so it is NOT used here). Candidates: the 777 words of core-morph.json not in the base.
//
// Structural score of a list L (all on L's 2-core, the part of the list a board can live in):
//   core2(L) = |2-core|                                    (deal capacity under dealMin 2, no traps)
//   S6(L)    = sum over w in 2-core of min(deg_2core(w), 6) / 6
//              (each word counts up to 1, in proportion to how many ways it can turn, saturating at 6
//               so that piling more words onto one hub root -- which drives linked over 0.70 -- earns
//               nothing extra once its words already turn six ways)
//   deg5(L)  = words with degree >= 5 (Jukugo's stock deal pool)
// Greedy: repeatedly add the candidate with the largest gain in the chosen objective (ties: the other
// score, then Hawaiian-Wikipedia use as a stand-in for "likely to be confirmed", then spelling).
// Each pick's gain assumes every earlier pick was confirmed. `solo_*` columns give each word's gain
// added ALONE to the 128 (robust to earlier picks being rejected).
//
// usage: node bridges.mjs [objective=S6|core2] [steps=60] [out=bridges.tsv]
import fs from 'node:fs'
import { TIERS, loadList, index, kcoreMask } from './lexgraph.mjs'

const here = new URL('.', import.meta.url).pathname
const [objective = 'S6', stepsArg = '60', outName = 'bridges.tsv'] = process.argv.slice(2)
const STEPS = Number(stepsArg)

// Hawaiian Wikipedia use, evidence, flags from the worksheet
const tsv = fs.readFileSync('roots/compounds.tsv', 'utf8').trim().split('\n')
const head = tsv[0].split('\t')
const meta = new Map()
for (const line of tsv.slice(1)) {
  const c = line.split('\t')
  const r = Object.fromEntries(head.map((h, i) => [h, c[i] ?? '']))
  meta.set(r.word, r)
}

const base = loadList(`${TIERS}/curve-realistic-128.json`)
const baseWords = new Set(base.map((r) => r.word))
const cands = loadList(`${TIERS}/core-morph.json`).filter((r) => !baseWords.has(r.word))

export function score(list) {
  const ix = index(list)
  const alive = kcoreMask(ix, 2)
  let core2 = 0, S6 = 0, deg5 = 0
  for (let i = 0; i < list.length; i++) {
    if (ix.deg[i] >= 5) deg5++
    if (!alive[i]) continue
    core2++
    const r = list[i]
    let d = 0
    for (const j of ix.first.get(r.parts[0])) if (j !== i && alive[j]) d++
    for (const j of ix.second.get(r.parts[1])) if (j !== i && alive[j]) d++
    S6 += Math.min(d, 6) / 6
  }
  return { core2, S6, deg5 }
}

const hw = (w) => (Number(meta.get(w)?.hawwiki_1w || 0) + Number(meta.get(w)?.hawwiki_2w || 0))
const key = (s) => objective === 'core2' ? [s.core2, s.S6] : [s.S6, s.core2]

function greedy(start, pool, steps) {
  let cur = [...start]
  let curS = score(cur)
  const remaining = [...pool]
  const picks = []
  for (let step = 0; step < steps && remaining.length; step++) {
    const roots = new Set(cur.flatMap((r) => r.parts))
    let best = null
    for (let ci = 0; ci < remaining.length; ci++) {
      const c = remaining[ci]
      // a word sharing no root with the list has degree 0: it cannot enter the 2-core alone
      if (!roots.has(c.parts[0]) && !roots.has(c.parts[1])) continue
      const s = score([...cur, c])
      const g = key(s).map((v, i) => v - key(curS)[i])
      const cmp = (a) => a ? (g[0] - a.g[0]) || (g[1] - a.g[1]) || (hw(c.word) - hw(a.c.word)) || (a.c.word < c.word ? -1 : 1) : 1
      if (cmp(best) > 0) best = { ci, c, s, g }
    }
    if (!best) break
    remaining.splice(best.ci, 1)
    cur.push(best.c)
    picks.push({ step: step + 1, word: best.c.word, parts: best.c.parts, gain: best.g[0], gain2: best.g[1], after: best.s })
    curS = best.s
  }
  return { picks, final: cur }
}

const t0 = Date.now()
const baseS = score(base)
const { picks, final } = greedy(base, cands, STEPS)
// solo gains against the 128
const solo = new Map()
for (const c of cands) { const s = score([...base, c]); solo.set(c.word, { core2: s.core2 - baseS.core2, S6: s.S6 - baseS.S6, deg5: s.deg5 - baseS.deg5 }) }

const cols = ['word', 'parts', 'gain', 'rank', 'objective', 'gain_other', 'core2_after', 'S6_after', 'deg5_after', 'solo_core2', 'solo_S6', 'solo_deg5', 'hawwiki_uses', 'pe_via_pollex', 'flags', 'andrews_1922']
const lines = [cols.join('\t')]
process.stderr.write(`base: 128 attested (sense-keyed): core2=${baseS.core2} S6=${baseS.S6.toFixed(2)} deg5=${baseS.deg5}\n`)
for (const p of picks) {
  const m = meta.get(p.word) ?? {}
  const so = solo.get(p.word)
  lines.push([p.word, p.parts.join(' + '), p.gain.toFixed(3), p.step, objective, p.gain2.toFixed(3), p.after.core2, p.after.S6.toFixed(2), p.after.deg5,
    so.core2, so.S6.toFixed(3), so.deg5, hw(p.word), m.pe_via_pollex ?? '', m.flags ?? '', (m.andrews_1922 ?? '').slice(0, 80)].join('\t'))
}
fs.writeFileSync(here + outName, lines.join('\n') + '\n')
// the ordered full list (base + picks), for the sim
// the full ordered list (base + every pick) for ladder.mjs / robust.mjs; only from a full run
if (STEPS >= cands.length) fs.writeFileSync(here + `lex/bridge-${objective}-order.json`, JSON.stringify(final))
process.stderr.write(`${objective}: ${picks.length} picks in ${((Date.now() - t0) / 1000).toFixed(1)} s; final core2=${picks.at(-1)?.after.core2} S6=${picks.at(-1)?.after.S6.toFixed(1)}\n`)
