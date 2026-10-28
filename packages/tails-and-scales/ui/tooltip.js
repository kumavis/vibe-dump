// The tooltip (DESIGN §1.3): what the pointer is over, next to it: a unit's
// line, a move's inches, a shot's odds, a charge's, where a charge would
// end. input/human.js says what; this puts it on the page.
//
// (V3a) One tooltip for the page, and it stays on the screen: below and
// right of the pointer, flipped to the pointer's other side where it would
// run off an edge, and clamped MARGIN px inside every edge (placeTip; the
// style caps its width at the screen's less two margins, so a phone's
// fits). And it tells the conditions (present/conditions.js): an element
// marked with one (data-cond: a label's icon, a word of the card's status
// line, a war machine's ability line) or with a tip of its own (data-tip:
// a chip, its unit's line and conditions, or a cluster's count) shows its
// tip, worded by `explain` (app/boot.js's, for the unit it belongs to), on
// a mouse's hover, gone as the mouse leaves it; on a touch screen on a tap,
// pinned until the next press anywhere (which then does its own work: a tap
// on another marked element shows that one), no other hide taking it away.
// The labels let the pointer through to the table (a click on one is the
// table's), so their icons are found by their boxes (iconAt) and asked for
// by the table's own handlers (input/human.js: hoverIcon, tapIcon); the
// card and the chips take the pointer, and are watched here (watch). No
// native title says any of it.
import { woundNeed, saveNeed, attackCount, expected, p2D6, pD6 } from '../core/rules.js'

// how far a tip keeps from each edge of the screen, and stands from the
// pointer
export const MARGIN = 8
const DX = 16, DY = 14

// Where a tip w × h px goes beside the pointer at (x, y) on a screen W × H:
// below and right of it; to its left where that runs off the right edge,
// above it where it runs off the bottom; then clamped `m` inside every edge
// (one wider or taller than the screen less two margins keeps to the left
// or top margin). Pure: { left, top }.
export function placeTip(x, y, w, h, W, H, m = MARGIN) {
  let left = x + DX
  if (left + w > W - m) left = x - DX - w
  let top = y + DY
  if (top + h > H - m) top = y - DY - h
  return { left: Math.max(m, Math.min(left, W - m - w)), top: Math.max(m, Math.min(top, H - m - h)) }
}

// the marked element an event reached, or null
const MARKED = '[data-cond], [data-tip]'
const markedOf = (t) => (t && typeof t.closest === 'function' ? t.closest(MARKED) : null)

export class Tooltip {
  // `el` the page's tooltip; (V3a) `labels` the floating labels' container,
  // whose icons it finds by their boxes; `explain(el, { tap })` the tip of
  // a marked element ('' for none: nothing shows)
  constructor(el, { labels = null, explain = () => '' } = {}) {
    this.el = el
    this.labels = labels
    this.explain = explain
    // the marked element whose tip shows (null: another tip, or none), and
    // whether a tap pinned it
    this.src = null
    this.pinned = false
  }

  // Take the tip away, unless a tap pinned it (the next press does).
  hide() {
    if (this.pinned) return
    this.el.style.display = 'none'
    this.src = null
  }
  // the pinned tip taken away (the next press)
  unpin() {
    this.pinned = false
    this.hide()
  }

  // `html` beside the pointer at `mouse` ({x, y}, the page's), kept on the
  // screen (placeTip); (V3a) `src` the marked element it tells, if any
  show(html, mouse, src = null) {
    const tip = this.el
    tip.innerHTML = html
    tip.style.display = 'block'
    this.src = src
    this.pinned = false
    // (measured at the corner, where it can't wrap against an edge)
    tip.style.left = '0px'
    tip.style.top = '0px'
    const r = tip.getBoundingClientRect()
    const at = placeTip(mouse.x, mouse.y, r.width, r.height, innerWidth, innerHeight)
    tip.style.left = at.left + 'px'
    tip.style.top = at.top + 'px'
  }

  // (V3a) a marked element's tip at `at`, pinned by a tap; false when it
  // has none
  tip(el, at, tap = false) {
    const html = this.explain(el, { tap })
    if (!html) return false
    this.show(html, at, el)
    this.pinned = tap
    return true
  }

  // (V3a) The marked elements that take the pointer, under `root` (the
  // page): a mouse (or a pen) over one shows its tip, and leaving it takes
  // it away; a press anywhere takes a pinned tip away first (capturing,
  // before anything else hears it); a finger lifted on one, where it went
  // down, pins its tip (a chip's pick, its click, follows: no hide takes a
  // pinned tip away).
  watch(root) {
    let down = null
    root.addEventListener('pointerdown', (e) => {
      down = { x: e.clientX, y: e.clientY }
      if (this.pinned) this.unpin()
    }, true)
    root.addEventListener('pointerover', (e) => {
      if (e.pointerType === 'touch') return
      const m = markedOf(e.target)
      if (m && m !== this.src) this.tip(m, { x: e.clientX, y: e.clientY })
      // (a hovered element drawn away under a still pointer: the card shown
      // again)
      else if (!m && this.src && !this.src.isConnected) this.hide()
    })
    root.addEventListener('pointerout', (e) => {
      if (e.pointerType === 'touch' || !this.src || markedOf(e.target) !== this.src) return
      if (e.relatedTarget && this.src.contains(e.relatedTarget)) return
      this.hide()
    })
    root.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'touch' || !down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) return
      const m = markedOf(e.target)
      if (m) this.tip(m, { x: e.clientX, y: e.clientY }, true)
    })
  }

  // (V3a) The label icon at page point (x, y), within `slop` px of its box,
  // or null: of the shown labels' icons, the one whose box is nearest (a
  // finger's slop reaches its neighbours), the topmost (the last drawn) of
  // those as near.
  iconAt(x, y, slop = 2) {
    if (!this.labels) return null
    let hit = null, best = Infinity
    for (const el of this.labels.querySelectorAll('.ulabel .st[data-cond]')) {
      const l = el.parentElement
      if (l.style.display === 'none' || l.style.visibility === 'hidden') continue
      const r = el.getBoundingClientRect()
      const d = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom))
      if (r.width > 0 && d <= slop && d <= best) (hit = el), (best = d)
    }
    return hit
  }
  // The mouse over the table at (x, y): over a label's icon, its tip (kept
  // where it is while the pointer stays on it) and true; else false (the
  // table's own hover goes on).
  hoverIcon(x, y) {
    const el = this.iconAt(x, y)
    if (!el) return false
    return el === this.src || this.tip(el, { x, y })
  }
  // A finger's tap on the table at (x, y): on a label's icon (with a
  // finger's slop), its tip pinned and true (the tap does nothing else);
  // else false.
  tapIcon(x, y) {
    const el = this.iconAt(x, y, 10)
    return !!el && this.tip(el, { x, y }, true)
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
// shooter's own side says so on a line of its own (riskText).
export function oddsText(u, target, info) {
  const w = u.t.ranged
  if (w.mesmerize) return `Mesmerize: cast ${w.spell}+ on 2D6 (${Math.round(p2D6(w.spell) * 100)}%) · D3 mortal wounds`
  const lines = []
  if (w.spell) lines.push(`Cast ${w.spell}+ (${Math.round(p2D6(w.spell) * 100)}%)`)
  const n = attackCount(u, w, false)
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const sn = saveNeed(target.t.Sv, w.AP, info.cover)
  lines.push(`${n} ${w.blast ? `template${n > 1 ? 's' : ''} (${w.blast}")` : 'shots'} · hit ${w.spell ? 'auto' : info.need + '+'} · wound ${wn}+ (${woundWhy(w, target.t)}) · save ${sn > 6 ? '—' : sn + '+'} (${saveWhy(w, target.t, info.cover)})`)
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
  const risk = riskText(u, info, n)
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
export function riskText(u, info, n = attackCount(u, u.t.ranged, false)) {
  const w = u.t.ranged
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
// (AP0, AP-1: the card's way of writing it), and cover where it helps
export const saveWhy = (w, t, cover) => `Sv${t.Sv}+ AP${w.AP ? `-${w.AP}` : '0'}${cover ? ', cover' : ''}`
