// The tooltip (DESIGN §1.3): what the pointer is over, next to it: a unit's
// line, a move's inches, a shot's odds, a charge's, where a charge would
// end. input/human.js says what; this puts it on the page.
import { woundNeed, saveNeed, attackCount, expected, p2D6, pD6, svOf } from '../core/rules.js'

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
// printed range, or a lob's from or at height, said so beside it). (The
// October playtest's fix) Each need says why beside it: the wound the
// weapon's strength against the target's toughness ("wound 6+ (S3 vs T6)",
// and a poison that makes it easier), the save the target's own and the
// weapon's AP ("save 4+ (Sv4+ AP0)", and cover's +1). A unit's numbers are
// its own: no armour rule hides behind them. (F18) A shot that risks the
// shooter's own side says so on a line of its own (riskText). (V3c) `sp`:
// a caster's spell (none: its first); a spell that marks its target says
// what the mark does, one cast on a friend its range, and a warded target's
// save is its own, one better (svOf).
export function oddsText(u, target, info, sp) {
  const w = sp === undefined ? u.t.ranged : u.t.spells[sp]
  const cast = `cast ${w.spell}+ on 2D6 (${Math.round(p2D6(w.spell) * 100)}%)`
  if (w.mesmerize) return `Mesmerize: ${cast} · D3 mortal wounds`
  if (w.snare) return `${w.name}: ${cast} · it can't move or charge next turn<br>${info.range.toFixed(1)}" / ${w.range}"`
  if (w.ward || w.resolve) return `${w.name} on ${target === u ? 'itself' : target.t.short}: ${cast} · ${w.ward ? '+1 to its saves' : 'no morale tests, a failed charge rolled again'} until your next turn<br>${info.range.toFixed(1)}" / ${w.range}"`
  const lines = []
  if (w.spell) lines.push(`${w.name}: ${cast}`)
  const n = attackCount(u, w, false)
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const sn = saveNeed(svOf(target), w.AP, info.cover)
  lines.push(`${n} ${w.blast ? `template${n > 1 ? 's' : ''} (${w.blast}")` : 'shots'} · hit ${w.spell ? 'auto' : info.need + '+'} · wound ${wn}+ (${woundWhy(w, target.t)}) · save ${sn > 6 ? '—' : sn + '+'} (${saveWhy(w, target.t, info.cover, target.warded)})`)
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
  const risk = riskText(u, info, n, w)
  if (risk) lines.push(risk)
  return lines.join('<br>')
}

// (F18) What a shot at a target locked in combat risks of the shooter's
// own side, or '' when nothing: for a volley, how many of yours are in the
// fight (info.fight: fightOf's F), the odds a miss strays into them (F in
// F + T, in lowest terms) and the models of yours it is expected to slay
// (the misses by that share, each a hit on the friend a stray strikes, by
// rules.js's expected: what doShoot rolls); for a template, who of yours
// one landing square on the target would catch (info.under: friendsUnder),
// a scatter's risk being the blast's own line in the help.
// ((V3c) `w`: the weapon, a caster's spell; its ranged weapon by default)
export function riskText(u, info, n = attackCount(u, u.t.ranged, false), w = u.t.ranged) {
  if (w.blast) {
    if (!info.under?.length) return ''
    return `⚠ friends under the template: ${info.under.map(({ v, under }) => `${v.t.short}${v.models.length > 1 ? ` ×${under}` : ''}`).join(', ')}`
  }
  const f = info.fight
  if (!f || w.mesmerize) return ''
  const d = gcd(f.F, f.F + f.T)
  const stray = n * (1 - pD6(info.need)) * f.F / (f.F + f.T)
  const slain = expected(stray, 1, w, f.onto, f.cover).kills
  return `⚠ into a fight: ${f.F} of yours in it, a miss strays ${f.F / d} in ${(f.F + f.T) / d} (≈${slain.toFixed(1)} of yours slain)`
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a)

// Why a wound needs what it needs: "S3 vs T6", and the poison where it
// lowers the need below the table's (core/rules.js woundNeed)
export function woundWhy(w, t) {
  const plain = woundNeed(w.S, t.T)
  return `S${w.S} vs T${t.T}${w.poison && w.poison < plain ? `, poison ${w.poison}+` : ''}`
}

// Why a save needs what it needs: the target's save and the weapon's AP
// (AP0, AP-1: the card's way of writing it), and cover where it helps, and
// (V3c) a ward (Barkskin)
export const saveWhy = (w, t, cover, warded = false) => `Sv${t.Sv}+ AP${w.AP ? `-${w.AP}` : '0'}${cover ? ', cover' : ''}${warded ? ', ward' : ''}`
