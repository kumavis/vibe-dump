// The chips (F8b, DESIGN §4.2.7's "Drawing at scale" 4): at the Strategic
// tier, where a figure is a few pixels tall, each unit on screen is a 22 px
// disc over it in its seat's colour, carrying its role's glyph (⚔ ➶ ★ ✈ ⛭
// ▣), its models standing (a single model's wounds) and its order badge.
// The rings are hidden then, so the chip's border carries their state: the
// colour the input painted the ring (picked up, a target, can act), gold
// when picked up, red when in combat, else a dark rim. A tap selects
// (`pick(id)`), which beats casting a ray at an 11 px figure. Chips within
// 18 px of each other stack into one cluster, "×3", and a tap zooms the
// camera onto it (`zoom(x, z, r)`: the table's point and the radius its
// units take; the app wires it to the camera rig).
//
// view/units.js hands it what to show every frame it draws (draw(chips), or
// draw(null) at any other tier: none shown), already projected; it writes
// the page only where a chip changed, and counts the writes (render-bench's
// "label and chip style writes per frame").
import { clusters } from '../present/zoom.js'

const PX = 18

export class Chips {
  // `pick(id)`: a unit's chip tapped; `zoom(x, z, r)`: a cluster's
  constructor({ pick = () => {}, zoom = () => {} } = {}) {
    this.pick = pick
    this.zoomTo = zoom
    this.el = document.createElement('div')
    this.el.id = 'chips'
    document.body.appendChild(this.el)
    // the discs on the page, in the order drawn, each with what it last showed
    this.pool = []
    this.shown = 0
    this.el.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip')
      if (!chip) return
      e.stopPropagation()
      const c = this.pool[Number(chip.dataset.k)]?.c
      if (!c) return
      if (c.ids.length === 1) this.pick(c.ids[0])
      else this.zoomTo(c.wx, c.wz, c.wr)
    })
  }

  // Show `units` ([{ id, x, y, wx, wz, side, color, glyph, n, ord, sel,
  // engaged, look }], in G.units order), clustered; null shows none.
  // Returns how many style or text writes it made.
  draw(units) {
    let writes = 0
    const cs = units ? clusters(units, PX) : []
    const byId = units ? new Map(units.map((u) => [u.id, u])) : null
    cs.forEach((c, k) => {
      const us = c.ids.map((id) => byId.get(id))
      const lead = us[0]
      // where the cluster stands on the table, and how far its units reach
      c.wx = us.reduce((a, u) => a + u.wx, 0) / us.length
      c.wz = us.reduce((a, u) => a + u.wz, 0) / us.length
      c.wr = Math.max(4, ...us.map((u) => Math.hypot(u.wx - c.wx, u.wz - c.wz) + 2))
      const many = us.length > 1
      const sides = new Set(us.map((u) => u.side))
      const look = {
        x: Math.round(c.x), y: Math.round(c.y),
        bg: sides.size > 1 ? '#5a4a36' : lead.color,
        border: us.some((u) => u.sel) ? '#ffe680' : us.find((u) => u.look)?.look ?? (us.some((u) => u.engaged) ? '#ff6a4a' : 'rgba(20,16,12,0.85)'),
        text: many ? `×${us.length}` : `${lead.glyph}${lead.n}`,
        ord: many ? '' : lead.ord,
        title: many ? `${us.length} units: tap to zoom in` : null,
      }
      let slot = this.pool[k]
      if (!slot) {
        const el = document.createElement('div')
        el.className = 'chip'
        el.dataset.k = k
        el.innerHTML = '<b></b><i></i>'
        this.el.appendChild(el)
        slot = this.pool[k] = { el, last: {} }
      }
      slot.c = c
      const { el, last } = slot
      if (last.x !== look.x || last.y !== look.y) (el.style.transform = `translate(${look.x}px, ${look.y}px) translate(-50%, -50%)`), writes++
      if (last.bg !== look.bg) (el.style.background = look.bg), writes++
      if (last.border !== look.border) (el.style.borderColor = look.border), writes++
      if (last.text !== look.text) (el.firstChild.textContent = look.text), writes++
      if (last.ord !== look.ord) (el.lastChild.textContent = look.ord), writes++
      if (last.many !== many) el.classList.toggle('many', many), writes++
      if (last.title !== look.title) (look.title ? (el.title = look.title) : el.removeAttribute('title')), writes++
      if (last.hidden !== false) (el.style.display = ''), writes++
      slot.last = { ...look, many, hidden: false }
    })
    // the discs left over: hidden (kept for the next frame that needs them)
    for (let k = cs.length; k < this.shown; k++) {
      const slot = this.pool[k]
      if (slot.last.hidden) continue
      slot.el.style.display = 'none'
      slot.last = { hidden: true }
      slot.c = null
      writes++
    }
    this.shown = Math.max(cs.length, this.shown)
    return writes
  }
}
