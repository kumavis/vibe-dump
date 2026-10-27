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

// A shot's odds: unit u's ranged weapon at `target`, `info` the match's
// shotInfo for the pair (its range, cover, sight and hit roll). (F17) The
// inches are the gap against the reach to this target (`info.reach`: the
// printed range, or a lob's from or at height, said so beside it).
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
  const reach = info.reach ?? w.range
  const lob = reach > w.range ? ` (${w.range}", lobbed down)` : reach < w.range ? ` (${w.range}", lobbed up)` : ''
  flags.push(`${info.range.toFixed(1)}" / ${reach === w.range ? w.range : reach.toFixed(1)}"${lob}`)
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
