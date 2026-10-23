// The unit card (DESIGN §1.3): a unit's name, seat and role, what of it
// stands, what it has done this turn, its stats, weapons and abilities.
// Opened by a click on a figure (or as a unit is picked up), closed by
// showing nothing.
//
// It reads the unit as shown (the mirror's: what stands, what wounds are
// left, mesmerized, in combat), like its label. What the unit has done this
// turn and whether it stands in cover read the match itself once the table
// has caught up with it (the player idle), and while the player is behind
// (the AI's turn, a watched battle) the record of the match as it stood at
// the last action's end, or the last stop for a decision, the table has
// played (present/hud-model.js's facts), so the card never tells of moves
// and dice the table hasn't played (§2.4).
import { factOf, cardStatus } from '../present/hud-model.js'

const statKeys = ['M', 'WS', 'BS', 'S', 'T', 'W', 'A', 'Ld', 'Sv', 'OC']

// A unit type's stats, weapons and abilities, as the card shows them (and
// (F6) the battle-setup panel, for a figure of its race showcase)
export function statsHtml(t) {
  const fmt = (k) => (k === 'M' ? `${t.M}"` : ['WS', 'BS', 'Sv'].includes(k) ? `${t[k]}+` : t[k])
  const wpn = (w, icon) => {
    if (!w) return ''
    if (w.mesmerize) return `<div class="wpn"><span>${icon} ${w.name}</span><em>spell ${w.spell}+ · ${w.range}" · D3 mortal + mesmerize</em></div>`
    const bits = []
    if (w.range) bits.push(`${w.range}"`)
    if (w.spell) bits.push(`spell ${w.spell}+`)
    if (w.blast) bits.push(`blast ${w.blast}" ×${w.shots}`)
    else if (w.shots) bits.push(`A${w.shots}`)
    bits.push(`S${w.S}`, `AP-${w.AP}`, `D${w.D}`)
    if (w.poison) bits.push(`poison ${w.poison}+`)
    if (w.indirect) bits.push('indirect')
    if (w.heavy) bits.push('heavy')
    if (w.assault) bits.push('assault')
    return `<div class="wpn"><span>${icon} ${w.name}</span><em>${bits.join(' · ')}</em></div>`
  }
  return `
    <table class="stats"><tr>${statKeys.map((k) => `<th>${k}</th>`).join('')}</tr><tr>${statKeys.map((k) => `<td>${fmt(k)}</td>`).join('')}</tr></table>
    ${wpn(t.ranged, t.ranged?.spell ? '✦' : '➹')}${wpn({ ...t.melee, range: 0 }, '⚔')}
    <ul class="abil">${(t.abilities || []).map((a) => `<li>${a}</li>`).join('')}</ul>`
}

export class Card {
  // `sides()`: each seat's look (ui/theme.js); `shown(u)`: the unit as
  // shown; `live()`: whether the table has caught up with the match;
  // `ask(fn)`: fn(G, q) of the match the table shows, with its dice locked
  // (the core's preview, §4.1 rule 2); `facts()`: the record of the last
  // action or stop played, by unit id
  constructor({ el, sides, shown, live, ask, facts }) {
    this.el = el
    this.sides = sides
    this.shown = shown
    this.live = live
    this.ask = ask
    this.facts = facts
    // the unit the open card shows (app/flow.js redraws it as the table
    // catches up)
    this.unit = null
    // (F10a) a line above the lead's card while units are picked up
    // together: what the group is (input/group.js)
    this.group = ''
    this.groupLead = null
  }

  get open() {
    return this.el.classList.contains('show')
  }

  show(u) {
    const card = this.el
    this.unit = u
    if (!u) {
      card.classList.remove('show')
      return
    }
    const t = u.t
    // as shown; what it did and its cover from the match once the table has
    // caught up, else from the last action played (the title's backdrop is
    // never behind)
    const mu = this.shown(u), f = this.live() ? this.ask((G) => factOf(G, u)) : this.facts()[u.id]
    card.innerHTML = `${this.group && u.id === this.groupLead ? `
    <div class="card-group">${this.group}</div>` : ''}
    <div class="card-head s${u.side}"><b>${t.name}</b><span>${this.sides()[u.side].short} · ${t.role}</span></div>
    <div class="card-sub">${cardStatus(t, mu, f)}</div>${statsHtml(t)}`
    card.classList.add('show')
  }
}
