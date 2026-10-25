// The roster (F8b, DESIGN §4.2.7's "Camera and navigation"): your units in
// a list down the left of the screen, each with its role's glyph, its name,
// its models standing (a single model's wounds) and its state: acted (it can
// do nothing more this phase), ordered (its standing order's badge), in
// combat; and over the list both armies' worth on the table, each unit's
// cost times the share of its models still standing (Σ cost × alive /
// models), each unit at its battle's own price (core/army.js unitPrice: the
// mission's where its list sets one; `setup()`, the table's match's). Tapping a row picks the unit up and frames it (`pick(id)`, the
// app's: the input's select and the camera's glide). (A unit aboard a
// hull, F9a's, will say so here too.)
//
// It reads only what the table shows: the unit views (view/units.js: each
// unit's type, seat, label badge and ring as the input painted it) and the
// mirror. `seats()` names the seats whose units are "yours" (the seats
// played here; for a watched battle, none: only the totals show); `phase()`
// whether one of them is in its own phase now (outside it nothing is
// "acted"). It is folded to its header (the totals) unless opened (the
// tools' ☰, or R), open by default on a board larger than classic's (not on
// a phone), and rewritten at most four times a second, only when what it
// shows changed.
import { glyphOf } from '../present/zoom.js'
import { unitPrice } from '../core/army.js'

const HZ = 4

export class Roster {
  constructor({ units, mirror, board, colorOf, setup = () => null, seats = () => [], phase = () => false, pick = () => {}, fast = false }) {
    Object.assign(this, { units, mirror, board, colorOf, setup, seats, phase, pick })
    const el = (this.el = document.createElement('aside'))
    el.id = 'roster'
    el.className = 'hidden'
    el.innerHTML = '<h3 class="rhead"><span class="rtot"></span><span class="rfold">▾</span></h3><ol class="rlist"></ol>'
    document.body.appendChild(el)
    this.head = el.querySelector('.rtot')
    this.list = el.querySelector('.rlist')
    el.querySelector('.rhead').onclick = () => this.toggle()
    let btn = document.querySelector('#rosterBtn')
    if (!btn) {
      btn = document.createElement('button')
      btn.id = 'rosterBtn'
      btn.textContent = '☰'
      document.body.appendChild(btn)
    }
    this.button = btn
    btn.title = 'Roster (R): your units, and both armies on the table'
    btn.onclick = () => this.toggle()
    addEventListener('keydown', (e) => {
      if (e.code !== 'KeyR' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target?.tagName ?? '') || document.querySelector('.modal:not(.hidden)')) return
      this.toggle()
    })
    this.list.addEventListener('click', (e) => {
      const row = e.target.closest('li[data-id]')
      if (row) this.pick(Number(row.dataset.id))
    })
    // the player's choice (null: open on a larger board), and what it last
    // wrote
    this.wanted = null
    this.sig = ''
    if (!fast) setInterval(() => this.tick(), 1000 / HZ)
  }

  // shown in battle; open (the list) by the player's choice, else on a
  // board larger than classic's on a screen wider than a phone's
  open() {
    const b = this.board()
    return this.wanted ?? (!!b && b.W * b.H > 40 * 28 && innerWidth > 700)
  }
  toggle() {
    this.wanted = !this.open()
    this.sig = ''
    this.tick()
  }

  // What the roster shows now: both armies' worth, and the rows.
  model() {
    const M = this.mirror(), mine = new Set(this.seats()), inPhase = this.phase(), setup = this.setup()
    const worth = [0, 0], full = [0, 0], rows = []
    for (const v of this.units.views.values()) {
      const t = v.u.t, mu = M?.units[v.id]
      if (!mu) continue
      const s = v.u.side
      const price = unitPrice(setup, v.u)
      full[s] += price
      worth[s] += (price * mu.alive) / t.models
      if (!mine.has(s) || !(mu.alive > 0)) continue
      const can = v.look === '#ffffff' || v.look === '#5fd3ff' || v.look === '#ffe680'
      rows.push({
        id: v.id, side: s, glyph: glyphOf(t), name: t.short,
        n: t.models > 1 ? `${mu.alive}/${t.models}` : `${mu.models.find((m) => m.alive)?.w ?? 0}/${t.W}♥`,
        acted: inPhase && !can, ord: v.label.dataset.ord ?? '', engaged: !!mu.engaged, sel: v.look === '#ffe680',
      })
    }
    return { worth: worth.map(Math.round), full, rows }
  }

  tick() {
    const M = this.mirror()
    const battle = !!M && M.stage !== 'title' && !!this.board()
    this.el.classList.toggle('hidden', !battle)
    this.button.classList.toggle('hidden', !battle)
    if (!battle) return
    const open = this.open()
    const m = this.model()
    const sig = JSON.stringify([open, m])
    if (sig === this.sig) return
    this.sig = sig
    this.el.classList.toggle('open', open)
    this.button.classList.toggle('on', open)
    this.el.querySelector('.rfold').textContent = open ? '▾' : '▸'
    this.head.innerHTML = [0, 1].map((s) => `<span class="rpts" style="color:${this.colorOf(s)}" title="On the table: ${m.worth[s]} of ${m.full[s]} points">${m.worth[s].toLocaleString('en-GB')}</span>`).join('<span class="rvs">·</span>') + '<span class="rlbl">pts</span>'
    this.list.innerHTML = !open ? '' : m.rows.map((r) => `<li data-id="${r.id}" class="${[r.acted ? 'acted' : '', r.sel ? 'sel' : '', r.engaged ? 'engaged' : ''].join(' ').trim()}" style="--side:${this.colorOf(r.side)}"><span class="rg">${r.glyph}</span><span class="rn">${r.name}</span><span class="rc">${r.n}</span><span class="rs">${r.engaged ? '<span title="In combat">⚔</span>' : ''}${r.ord ? `<span class="ro" title="Standing order">${r.ord}</span>` : ''}${r.acted ? '<span title="Done this phase">✓</span>' : ''}</span></li>`).join('')
  }
}
