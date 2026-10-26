// The tooltip (DESIGN §1.3): what the pointer is over, next to it: a unit's
// line, a move's inches, a shot's odds, a charge's, where a charge would
// end. input/human.js says what; this puts it on the page.
import { woundNeed, saveNeed, attackCount, expected, p2D6 } from '../core/rules.js'

export class Tooltip {
  constructor(el) {
    this.el = el
  }

  hide() {
    this.el.style.display = 'none'
  }

  // `html` beside the pointer at `mouse` ({x, y}, the page's)
  show(html, mouse) {
    const tip = this.el
    tip.innerHTML = html
    tip.style.display = 'block'
    tip.style.left = mouse.x + 16 + 'px'
    tip.style.top = mouse.y + 14 + 'px'
  }
}

// (F7b, DESIGN §4.2.4's line of sight with its reasons) The colours the LOS
// ray is drawn in, by verdict, and the reasons under a shot's odds: `los`
// is input/tools/shoot.js's sightOf (sightInfo's answer, the chunks by
// name, what high ground sees over). A line each:
//   "Blocked by the keep" (the solid chunk that stopped a ray; two
//   obscurers in a row stop it too: "Blocked by the hedge and the trees"),
//   "Visible · target behind a parapet (cover)", "Visible · 3/5 models in
//   sight (cover)", "Visible · target in cover" (standing in a cover band:
//   a wood, a ruin, a deck behind its parapets), "Visible · clear shot",
//   and on a deck, "High ground: sees over the hedge".
// In a block the style colours by verdict (style.css's F7b block).
export const LOS_COLORS = Object.freeze({ clear: '#5be37a', cover: '#ffb347', blocked: '#ff5a4a' })
export function losText(los) {
  const names = (ids) => {
    const ns = [...new Set(ids.map(los.name))]
    return ns.length > 2 ? `${ns.slice(0, 2).join(', ')} and more` : ns.join(' and ')
  }
  const lines = []
  if (!los.ok) lines.push(los.block !== null ? `Blocked by ${los.name(los.block)}` : los.obscure.length ? `Blocked by ${names(los.obscure)}` : 'Blocked')
  else if (los.obscure.length) lines.push(`Visible · target behind ${names(los.obscure)}${los.cover ? ' (cover)' : ''}`)
  else if (los.cover && los.seen < los.total) lines.push(`Visible · ${los.seen}/${los.total} models in sight (cover)`)
  else if (los.cover) lines.push('Visible · target in cover')
  else lines.push('Visible · clear shot')
  if (los.high) lines.push(los.over.length ? `High ground: sees over ${names(los.over)}` : 'High ground')
  return `<div class="los los-${los.verdict}">${lines.join('<br>')}</div>`
}

// A shot's odds: unit u's ranged weapon at `target`, `info` the match's
// shotInfo for the pair (its range, cover, sight and hit roll).
export function oddsText(u, target, info) {
  const w = u.t.ranged
  if (w.mesmerize) return `Mesmerize: cast ${w.spell}+ on 2D6 (${Math.round(p2D6(w.spell) * 100)}%) · D3 mortal wounds`
  const lines = []
  if (w.spell) lines.push(`Cast ${w.spell}+ (${Math.round(p2D6(w.spell) * 100)}%)`)
  const n = attackCount(u, w, false)
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const sn = saveNeed(target.t.Sv, w.AP, info.cover)
  lines.push(`${n} ${w.blast ? `template${n > 1 ? 's' : ''} (${w.blast}")` : 'shots'} · hit ${w.spell ? 'auto' : info.need + '+'} · wound ${wn}+ · save ${sn > 6 ? '—' : sn + '+'}`)
  const flags = []
  flags.push(`${info.range.toFixed(1)}"`)
  if (info.cover) flags.push('cover')
  if (!info.visible) flags.push('unseen (indirect −1)')
  else if (info.seen < info.total) flags.push(`${info.seen}/${info.total} visible`)
  if (w.heavy && u.flags.moved) flags.push('moved (heavy −1)')
  if (!w.blast) {
    const e = expected(n, info.need, w, target, info.cover)
    flags.push(`≈${e.kills.toFixed(1)} slain`)
  }
  lines.push(flags.join(' · '))
  return lines.join('<br>')
}
