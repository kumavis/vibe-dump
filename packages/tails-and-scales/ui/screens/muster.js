// The Muster screen (DESIGN §4.2.8.8, F11b): a seat's army built unit by
// unit, up to its battle size's points limit, before the battle. The
// battle-setup panel's Build… opens it (app/boot.js), for one seat:
//
//   ┌ Bushtail Clans · Field battle ──────────────────────────── ✕ ┐
//   │ [███████████████████████████████████░░░] 970 / 1,000 pts       │
//   │ 14 units · 56 models   Hero 2 (1-2) · Troops 6 (≥2) · Elite 2 … │
//   │ [Classic ×2] [Classic] [Random] [Clear] [Saved ▾]              │
//   │ ★ Elder Chitterwick   Hero   1 model   75   [−] 2 [+]          │
//   │ …                                                              │
//   │ [Save list…]                                      [Ready ✓]    │
//   └────────────────────────────────────────────────────────────────┘
//
// One row per roster entry, in roster order: the role's glyph (the chips'
// and the short labels', present/zoom.js), the unit's name (a tap opens
// its card: ui/card.js's stats, weapons and abilities, the head priced as
// the battle prices it), its role, its models, its price under this
// battle's list rules (core/army.js's priceOf: a Field or Grand battle has
// its own) and − and +. (The figure thumbnails §4.2.8.8 offers from F6's
// template cache are not drawn: the race picker's figures are a window of
// the table's renderer, view/diorama.js, which a scrolling list of rows
// can't cheaply hold; the glyph stands in.) A disabled + always says why,
// in the tooltip (a hover; a tap or a long press on a touch screen, which
// ui/tooltip.js pins): "Artillery: 2 of 2", "15 over the limit", "70 models
// at most", "at most 5 of one unit", "no vehicles in a Skirmish"; − is
// disabled at 0. So + and − never take a list over its limits: a list is
// over only as it came in (a battle size changed on the panel, a list saved
// under other prices), and the bar and Ready say so.
//
// The points bar fills in segments coloured by role and reads "970 / 1,000
// pts", red above the limit; under it the units and models, and a chip per
// role the battle has a slot for (red below its minimum, or above its
// maximum). Ready is disabled with the first refusal of core/army.js's
// checkList as its label, the very check (and words) the fold refuses a
// setup by (§4.2.8.4), so the screen never offers a list the battle would
// refuse. The presets: the mission's own, then any other of the race's
// that is legal here (Classic in a Field battle). Random is autoList with a
// fresh seed (a Math.random draw, as app/flow.js draws a battle's dice: the
// UI's choice, and only the list it makes is recorded); Clear keeps the
// minimums, each role's from its cheapest unit here (the hero and the
// cheapest Troops). Saved ▾ lists the race's lists kept on this device
// (app/lists.js: by unit key, a key the roster lost dropped with a note),
// each with its cost here, red where it is over ("Prices changed: 15 over"
// for one saved for this battle size); Open and ✕ each. Save list… names
// the list as it stands and keeps it.
//
// (F9a) A vehicle's row says which Troops the deployment's autoload would
// put aboard it (DESIGN §4.2.8.7, core/actions/transport.js's rule: each
// vehicle in turn, the seat's Troops in roster order whose bases fit and
// whose models fit the room left), a line per hull. (F9c, F11b's Departs)
// Each vehicle row ends its line with its deck's fire slots ("⛭ deck fires
// 3"), whose tip (a hover, a tap) says how many of its squads aboard shoot
// from it a turn against how many units the autoload fits aboard ("The
// Howdah's deck fires 3 a turn; 2 units fit aboard"), so a deck with a
// slot left over shows it: the record's `fire` (t.transport.fire), the
// slots core/actions/transport.js's fireSlots reads.
//
// Phones (360 px portrait): one column, the points bar, the counts and the
// buttons in a block that stays at the top while the rows scroll, Save
// list… and Ready at the bottom, 44 px buttons, the role chips scrolling in
// one row, nothing wider than the screen (style.css; sim/ui-check.mjs
// holds it). The screen never reads the flow: open() hands it the race, the
// battle size and the list, and it hands back the counts (onReady) or
// nothing (onClose). Closed, it holds nothing of the list in the page: its
// rows, bar and chips are taken out (a hotseat's pass screen shows the
// screen with the other player's list gone, §4.2.8.8's courtesy).
//
//   new MusterScreen({ lists })   `lists`: app/lists.js's Lists
//   muster.open({ race, mission, counts | preset, notes, onReady(counts),
//                 onClose() })
//   muster.close()
//   new PassScreen()              the hotseat's "Pass to player 2"
//   pass.show({ to, line, onGo, onBack })   `line` the army just readied,
//                 its total and units (never its contents)
import { RACES, ROLES } from '../../data/schema.js'
import { MISSIONS } from '../../data/mission.js'
import { checkList, priceOf, listCost, autoList } from '../../core/army.js'
import { glyphOf } from '../../present/zoom.js'
import { statsHtml } from '../card.js'
import { sizeName } from './setup.js'

const $ = (s) => document.querySelector(s)
const el = (tag, cls, text) => {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text !== undefined) e.textContent = text
  return e
}
const pts = (n) => n.toLocaleString('en')
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
// (a refusal as a button's label: its first letter a capital)
const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// a role a battle allows none of, as + says so ("no vehicles in a Skirmish")
const NONE = Object.freeze({ Hero: 'heroes', Troops: 'troops', Elite: 'elite units', Fast: 'fast units', Monster: 'monsters', Artillery: 'artillery', Vehicle: 'vehicles' })

// the roles as the bar and the chips show them: the hero first, as the
// mock-up has it, then ROLES' order
const SHOWN = Object.freeze(['Hero', ...ROLES.filter((x) => x !== 'Hero')])

// What each preset is called on the screen and the panel: the classic list
// and its ×2 and ×3 (§4.2.8.5); one without a line here goes by its name.
export const PRESETS = Object.freeze({ classic: 'Classic', field: 'Classic ×2', grand: 'Classic ×3' })
export const presetName = (p) => PRESETS[p] ?? capital(p)

// A preset's counts, one per roster entry (its digits in roster order).
export const presetCounts = (race, p) => {
  const r = RACES[race], text = r.armies[p] ?? ''
  return r.roster.map((k, i) => (i < text.length ? text.charCodeAt(i) - 48 : 0))
}
// The presets of `race` a battle of `mission` offers: its own first, then
// every other the race has that its list rules allow, the costliest first.
export function presetsFor(race, mission) {
  const r = RACES[race], rules = MISSIONS[mission].list, own = MISSIONS[mission].army
  const others = Object.keys(r.armies).filter((p) => p !== own && !checkList(r, rules, presetCounts(race, p)))
  others.sort((a, b) => listCost(r, presetCounts(race, b), rules) - listCost(r, presetCounts(race, a), rules))
  return [own, ...others]
}

// The units the deployment's autoload would put aboard each vehicle of a
// list (DESIGN §4.2.8.7; core/actions/transport.js's autoload over a seat's
// units in G.units order, which for one seat is roster order): for each
// hull in turn, the Troops units not yet aboard whose bases are within its
// maxBase, that are neither big nor wreckers, and whose models fit the room
// left. → [{ i (the vehicle's roster entry), n (which of its copies),
// riders: [short…], models, capacity }]
export function aboardOf(race, counts) {
  const r = RACES[race]
  const copies = r.roster.flatMap((k, i) => Array(counts[i] ?? 0).fill(i))
  const taken = new Set(), out = []
  const seen = new Map()
  copies.forEach((i, at) => {
    const tr = r.units[r.roster[i]].transport
    if (!tr) return
    const n = (seen.get(i) ?? 0) + 1
    seen.set(i, n)
    let left = tr.capacity
    const riders = []
    copies.forEach((j, b) => {
      const t = r.units[r.roster[j]]
      if (taken.has(b) || t.role !== 'Troops' || t.base > tr.maxBase || t.big || t.wrecker || t.models > left) return
      taken.add(b)
      left -= t.models
      riders.push(t.short)
    })
    out.push({ i, n, riders, models: tr.capacity - left, capacity: tr.capacity, at })
  })
  return out
}

export class MusterScreen {
  constructor({ lists }) {
    this.lists = lists
    this.root = $('#muster')
    this.at = null
    this.built = false
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  // The screen for one seat: `race`, `mission` (the battle size: its list
  // rules and prices), the list to open with (`counts`, one per roster
  // entry, or `preset`, a preset's name; neither: the mission's own),
  // `notes` (what reading it dropped: a saved list's lost units),
  // onReady(counts) for Ready, onClose() for ✕.
  open({ race, mission, counts = null, preset = null, notes = [], onReady, onClose }) {
    const r = RACES[race], m = MISSIONS[mission]
    this.at = {
      race, mission, r, rules: m.list, onReady, onClose,
      counts: r.roster.map((k, i) => (counts ? counts[i] ?? 0 : presetCounts(race, preset ?? m.army)[i])),
      notes: [...notes],
    }
    this.build()
    this.root.classList.remove('hidden')
    this.render()
  }

  // Closed: every part that showed the list taken out of the page.
  close() {
    this.root.classList.add('hidden')
    this.at = null
    for (const e of this.root.querySelectorAll('.mFill')) e.replaceChildren()
  }

  // the screen's parts (the panel, its head, its bar, its rows' box, its
  // foot), made once; what they show is made by render()
  build() {
    if (this.built) return
    this.built = true
    const panel = el('div', 'panel muster')
    panel.setAttribute('role', 'dialog')
    panel.setAttribute('aria-label', 'Muster your army')
    const top = el('div', 'mTop')
    const head = el('div', 'mHead')
    this.titleEl = el('h2', 'mTitle mFill')
    const close = el('button', 'close', '✕')
    close.id = 'musterClose'
    close.setAttribute('aria-label', 'Close the Muster screen')
    close.onclick = () => {
      const at = this.at
      this.close()
      at?.onClose?.()
    }
    head.append(this.titleEl, close)
    this.bar = el('div', 'mBar mFill')
    this.bar.id = 'musterBar'
    this.ptsEl = el('div', 'mPts mFill')
    this.ptsEl.id = 'musterPts'
    const sum = el('div', 'mSum')
    this.countEl = el('span', 'mCount mFill')
    this.chipsEl = el('div', 'mChips mFill')
    this.chipsEl.id = 'musterChips'
    sum.append(this.countEl, this.chipsEl)
    this.toolsEl = el('div', 'mTools mFill')
    this.toolsEl.id = 'musterTools'
    this.savedEl = el('div', 'mSaved mFill hidden')
    this.savedEl.id = 'musterSaved'
    this.noteEl = el('p', 'mNote small mFill')
    this.noteEl.id = 'musterNote'
    top.append(head, this.bar, this.ptsEl, sum, this.toolsEl, this.savedEl, this.noteEl)
    this.rowsEl = el('div', 'mRows mFill')
    this.rowsEl.id = 'musterRows'
    const foot = el('div', 'mFoot')
    this.saveForm = el('div', 'mSaveForm hidden')
    this.saveName = el('input')
    this.saveName.id = 'musterSaveName'
    this.saveName.maxLength = 40
    this.saveName.placeholder = 'Name this list'
    this.saveName.setAttribute('aria-label', 'The list\'s name')
    const keep = el('button', '', 'Save')
    keep.id = 'musterSaveKeep'
    keep.onclick = () => this.save()
    this.saveName.onkeydown = (e) => e.code === 'Enter' && this.save()
    this.saveForm.append(this.saveName, keep)
    const saveBtn = el('button', 'mSave', 'Save list…')
    saveBtn.id = 'musterSave'
    saveBtn.onclick = () => {
      const show = this.saveForm.classList.contains('hidden')
      this.saveForm.classList.toggle('hidden', !show)
      if (show) {
        this.saveName.value = ''
        this.saveName.focus()
      }
    }
    this.readyBtn = el('button', 'primary mReady', 'Ready ✓')
    this.readyBtn.id = 'musterReady'
    this.readyBtn.onclick = () => {
      const at = this.at
      if (!at || checkList(at.r, at.rules, at.counts)) return
      const counts = [...at.counts]
      this.close()
      at.onReady?.(counts)
    }
    foot.append(saveBtn, this.saveForm, this.readyBtn)
    // the unit card a row's name opens, over the rows
    this.cardEl = el('div', 'mCard hidden')
    this.cardEl.id = 'musterCard'
    panel.append(top, this.rowsEl, foot, this.cardEl)
    this.root.replaceChildren(panel)
  }

  // ── What the list is ──────────────────────────────────────────────────
  price(i) {
    const { r, rules } = this.at
    return priceOf(r, r.roster[i], rules)
  }
  // the list's totals: points, units, models, each role's units and points
  tally(counts = this.at.counts) {
    const { r } = this.at
    const role = Object.fromEntries(ROLES.map((x) => [x, { n: 0, pts: 0 }]))
    let points = 0, units = 0, models = 0
    r.roster.forEach((k, i) => {
      const t = r.units[k], n = counts[i] ?? 0, p = n * this.price(i)
      points += p
      units += n
      models += n * t.models
      role[t.role].n += n
      role[t.role].pts += p
    })
    return { points, units, models, role }
  }
  // Why the list can't take one more of roster entry i (its +), or null:
  // the role's slot first, then the most of one unit, the units, the models
  // and the points.
  plusWhy(i) {
    const { r, rules, counts } = this.at, t = r.units[r.roster[i]], S = rules.size ?? 'battle'
    const s = this.tally(), max = rules.roles[t.role][1]
    if (s.role[t.role].n >= max) return max ? `${t.role}: ${s.role[t.role].n} of ${max}` : `no ${NONE[t.role] ?? `${t.role} units`} in a ${S}`
    if (counts[i] >= rules.perKind) return `at most ${rules.perKind} of one unit`
    if (s.units >= rules.units) return `${rules.units} units at most`
    if (s.models + t.models > rules.models) return `${rules.models} models at most`
    const over = s.points + this.price(i) - rules.points
    if (over > 0) return `${over} over the limit`
    return null
  }

  set(counts, notes = []) {
    this.at.counts = [...counts]
    this.at.notes = notes
    this.render()
  }

  // ── The tools ─────────────────────────────────────────────────────────
  // Clear: each role's minimum, from its cheapest unit here (the hero, the
  // cheapest Troops), as many of it as perKind allows, then the next
  // cheapest
  minimums() {
    const { r, rules } = this.at
    const counts = r.roster.map(() => 0)
    for (const role of ROLES) {
      let need = rules.roles[role][0]
      const ids = r.roster.map((k, i) => i).filter((i) => r.units[r.roster[i]].role === role).sort((a, b) => this.price(a) - this.price(b) || a - b)
      for (const i of ids) {
        while (need > 0 && counts[i] < rules.perKind) {
          counts[i]++
          need--
        }
      }
    }
    return counts
  }

  save() {
    const at = this.at
    if (!at) return
    const got = this.lists.save({ name: this.saveName.value, race: at.race, mission: at.mission, counts: at.counts, points: this.tally().points })
    this.saveForm.classList.add('hidden')
    this.set(at.counts, [got.why ? capital(got.why) : `Saved as “${got.list.name}”.`])
    this.savedEl.classList.add('hidden')
  }

  // the Saved panel: the race's lists on this device, each with its cost
  // here (red where over, and why), Open and ✕
  saved() {
    const at = this.at, box = this.savedEl
    const lists = this.lists.all(at.race)
    if (!lists.length) {
      box.replaceChildren(el('p', 'small', 'No lists saved on this device yet: build one, then press Save list…'))
      return
    }
    box.replaceChildren(...lists.map((l) => {
      const { counts, notes } = this.lists.countsOf(at.race, l.units)
      const why = checkList(at.r, at.rules, counts), s = this.tally(counts), over = s.points - at.rules.points
      const row = el('div', `mList${why ? ' bad' : ''}`)
      row.dataset.list = l.id
      const name = el('span', 'mlName', l.name)
      const what = el('span', 'mlWhat small', `${MISSIONS[l.mission] ? sizeName(l.mission, MISSIONS[l.mission]) : l.mission} · ${pts(s.points)} pts · ${plural(s.units, 'unit')}`)
      const bad = why ? el('span', 'mlWhy small', over > 0 ? (l.mission === at.mission ? `Prices changed: ${over} over` : `${over} over the ${at.rules.size ?? 'battle'} limit`) : capital(why)) : null
      const open = el('button', 'mlOpen', 'Open')
      open.onclick = () => {
        box.classList.add('hidden')
        this.set(counts, [...notes.map(capital), ...(why && over > 0 && l.mission === at.mission ? [`Prices changed: ${over} over`] : [])])
      }
      const del = el('button', 'mlDel', '✕')
      del.setAttribute('aria-label', `Delete ${l.name}`)
      del.onclick = () => {
        this.lists.remove(l.id)
        this.saved()
      }
      row.append(name, what, ...(bad ? [bad] : []), open, del)
      return row
    }))
  }

  // ── The page ──────────────────────────────────────────────────────────
  render() {
    const at = this.at
    if (!at) return
    const { r, rules, counts } = at, s = this.tally()
    this.titleEl.textContent = `${r.name} · ${sizeName(at.mission, MISSIONS[at.mission])} battle`
    // the bar: a segment per role, coloured by role, over the limit or the
    // list's own points if more; red over the limit
    const over = s.points > rules.points, scale = Math.max(rules.points, s.points)
    this.bar.classList.toggle('over', over)
    this.bar.replaceChildren(...SHOWN.filter((x) => s.role[x].pts > 0).map((x) => {
      const seg = el('span', `seg r-${x}`)
      seg.style.width = `${(100 * s.role[x].pts) / scale}%`
      return seg
    }))
    this.ptsEl.classList.toggle('over', over)
    this.ptsEl.textContent = `${pts(s.points)} / ${pts(rules.points)} pts${over ? ` · ${pts(s.points - rules.points)} over` : ''}`
    this.countEl.textContent = `${plural(s.units, 'unit')} · ${plural(s.models, 'model')}`
    // the role chips: each role the race fields a unit of and the battle
    // has a slot for (or the list fields), its range where it has a
    // minimum; red outside its slot
    const fields = new Set(r.roster.map((k) => r.units[k].role))
    this.chipsEl.replaceChildren(...SHOWN.filter((x) => (fields.has(x) && rules.roles[x][1] > 0) || s.role[x].n > 0 || rules.roles[x][0] > 0).map((x) => {
      const [min, max] = rules.roles[x], n = s.role[x].n
      const chip = el('span', `chip${n < min || n > max ? ' bad' : ''}`, `${x} ${n}${min ? (max <= 3 ? ` (${min === max ? min : `${min}-${max}`})` : ` (≥${min})`) : ''}`)
      chip.dataset.role = x
      return chip
    }))
    // the tools: the presets, Random, Clear, Saved
    const same = (a) => a.every((n, i) => n === (counts[i] ?? 0))
    const tools = presetsFor(at.race, at.mission).map((p) => {
      const b = el('button', 'mPreset', presetName(p))
      b.dataset.preset = p
      b.setAttribute('aria-pressed', String(same(presetCounts(at.race, p))))
      b.onclick = () => this.set(presetCounts(at.race, p))
      return b
    })
    const rnd = el('button', 'mRandom', 'Random')
    rnd.id = 'musterRandom'
    rnd.onclick = () => this.set(autoList(r, rules, (((Math.random() * 1e9) | 0) >>> 0)))
    const clr = el('button', 'mClear', 'Clear')
    clr.id = 'musterClear'
    clr.onclick = () => this.set(this.minimums())
    const sav = el('button', 'mSavedBtn', 'Saved ▾')
    sav.id = 'musterSavedBtn'
    sav.onclick = () => {
      const show = this.savedEl.classList.contains('hidden')
      if (show) this.saved()
      this.savedEl.classList.toggle('hidden', !show)
    }
    this.toolsEl.replaceChildren(...tools, rnd, clr, sav)
    this.noteEl.textContent = at.notes.join(' ')
    this.noteEl.classList.toggle('hidden', !at.notes.length)
    // the rows, in roster order
    const aboard = aboardOf(at.race, counts)
    this.rowsEl.replaceChildren(...r.roster.map((k, i) => {
      const t = r.units[k], row = el('div', 'mRow')
      row.dataset.unit = k
      const name = el('button', 'mName')
      name.append(el('span', 'g', glyphOf(t)), el('span', 'nm', t.name))
      name.onclick = () => this.card(i)
      const info = el('span', 'mInfo small', `${t.role} · ${plural(t.models, 'model')}`)
      const cost = el('span', 'mCost', String(this.price(i)))
      const step = el('div', 'mStep')
      const minus = el('button', 'minus', '−')
      minus.setAttribute('aria-label', `One ${t.short} fewer`)
      minus.disabled = !counts[i]
      minus.onclick = () => counts[i] > 0 && this.set(counts.map((n, j) => (j === i ? n - 1 : n)))
      const n = el('span', 'n', String(counts[i]))
      const plus = el('button', 'plus', '+')
      plus.setAttribute('aria-label', `One more ${t.short}`)
      const why = this.plusWhy(i)
      // (disabled by its look and aria, not the attribute: a disabled
      // button takes no pointer, and its why is the tooltip's on a hover
      // or a tap, ui/tooltip.js)
      plus.classList.toggle('off', !!why)
      plus.setAttribute('aria-disabled', String(!!why))
      if (why) {
        plus.dataset.tip = 'say'
        plus.dataset.say = capital(why)
      }
      plus.onclick = () => !this.plusWhy(i) && this.set(counts.map((c, j) => (j === i ? c + 1 : c)))
      step.append(minus, n, plus)
      row.append(name, info, cost, step)
      row.classList.toggle('none', !counts[i])
      // (F9a) a hull's riders, as the autoload would board them
      const hulls = aboard.filter((h) => h.i === i)
      if (t.transport) {
        const line = el('div', 'mAboard small')
        line.textContent = hulls.length
          ? hulls.map((h) => `${hulls.length > 1 ? `${t.short} ${h.n}` : 'Aboard at the deployment'}: ${h.riders.length ? h.riders.join(', ') : 'no Troops fit'} (${h.models} of ${h.capacity} models)`).join(' · ')
          : `Carries Troops at the deployment: up to ${t.transport.capacity} models`
        line.append(' · ', this.fireTip(t, hulls))
        row.append(line)
      }
      return row
    }))
    // Ready: the first refusal of checkList, the fold's own words
    const refusal = checkList(r, rules, counts)
    this.readyBtn.disabled = !!refusal
    this.readyBtn.textContent = refusal ? capital(refusal) : 'Ready ✓'
  }

  // (F9c) a vehicle row's fire slots: "⛭ deck fires N", its tip how many of
  // the squads aboard shoot from it a turn against how many units the
  // autoload fits aboard each of its hulls (`hulls`, aboardOf's)
  fireTip(t, hulls) {
    const k = t.transport.fire, tip = el('span', 'mFire', `⛭ deck fires ${k}`)
    const ns = [...new Set(hulls.map((h) => h.riders.length))]
    const fit = !hulls.length ? `up to ${plural(k, 'squad')} aboard shoot from it` : ns.length === 1 ? `${plural(ns[0], 'unit')} fit${ns[0] === 1 ? 's' : ''} aboard${hulls.length > 1 ? ' each' : ''}` : `${ns.join(', ')} units fit aboard them`
    tip.dataset.tip = 'say'
    tip.dataset.say = `The ${t.short}'s deck fires ${k} a turn; ${fit}`
    return tip
  }

  // the unit card of roster entry i over the rows: its name, its race and
  // role and its price in this battle, its stats, weapons and abilities
  // (ui/card.js's statsHtml, the race's own data, as the card shows them)
  card(i) {
    const { r } = this.at, t = r.units[r.roster[i]], box = this.cardEl
    const head = el('div', 'card-head')
    head.append(el('b', '', t.name), el('span', '', `${r.short} · ${t.role} · ${this.price(i)} pts`))
    const body = el('div', 'mCardBody')
    body.innerHTML = statsHtml(t)
    const shut = el('button', 'close', '✕')
    shut.id = 'musterCardClose'
    shut.setAttribute('aria-label', 'Close the card')
    shut.onclick = () => box.classList.add('hidden')
    box.replaceChildren(shut, head, body)
    box.dataset.unit = r.roster[i]
    box.classList.remove('hidden')
  }
}

// The hotseat's pass screen (§4.2.8.8's per-mode table): between one
// player's Ready and the other's Muster screen, so neither sees the other's
// list. It shows the army just readied by its total and units alone (the
// Muster screen has taken its rows out of the page), and goes on to the
// next player's.
export class PassScreen {
  constructor() {
    this.root = $('#pass')
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  // `to` the player passed to (2), `line` what to say of the army readied
  // ("Player 1: Ready · 970 pts · 14 units")
  show({ to, line, onGo, onBack }) {
    $('#passTitle').textContent = `Pass to player ${to}`
    $('#passLine').textContent = line
    $('#passGo').textContent = `Player ${to}: muster your army`
    $('#passGo').onclick = () => {
      this.hide()
      onGo()
    }
    $('#passBack').onclick = () => {
      this.hide()
      onBack()
    }
    this.root.classList.remove('hidden')
  }

  hide() {
    this.root.classList.add('hidden')
  }
}
