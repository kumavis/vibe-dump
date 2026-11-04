// The battle-setup panel (DESIGN §1.3, F6): what a title-screen mode button
// opens before its battle. Each seat's card says who plays it and its race
// (ui/screens/races.js: the races' buttons, the race's figures, a unit's
// stats under the pointer); Start the battle, or Back to the title. Its
// defaults are the page's races (?races=, else the classic matchup), and
// then the last ones chosen. Two seats of one race make a mirror match: the
// second army takes its race's other colours, and the panel says so. (F7a)
// The terrain line: the sets the battle's mission is fought on (its first,
// or ?terrain='s, then the last chosen), one button each.
//
// (F8b) The battle size: a line of the missions (Skirmish, Field, Grand,
// (F19a) and the Powder keg, a Skirmish of its own), each with its board
// and points, the one chosen named under them with its rounds (and what a
// mission of its own is about); its default the flow's mission
// (?mission=, else classic; then the last chosen). Grand is offered on a phone too (open question 16), with a
// note that it is best on a larger screen. The sizes come from the page
// (app/boot.js reads the missions), so this panel imports no rules data.
// The size's sets are the terrain line's options.
//
// (F16) The fog line, against the AI only (never hotseat: one screen; nor a
// watched battle): a toggle for the courtesy fog of war (your units show
// you only what they see of the other army; app/flow.js, present/fog.js),
// and a note that the AI sees everything (core/ai reads the match whole).
// Its default the page's (?fog, else the last choice, which the page keeps
// in localStorage: app/boot.js).
//
// (F11b, DESIGN §4.2.8.8) The army line, under each seat's race picker: a
// seat played here "Army: Classic ▾ · Build…" (the presets its battle size
// allows, and "List" while it holds one built on the Muster screen,
// ui/screens/muster.js, which Build… opens), an AI seat "Army: Classic ▾ /
// Random" (Random a list app/boot.js draws for it, and, against the AI,
// its units a tap away: no secrecy against the AI), each with its total
// and units, red with why when it isn't legal in the size chosen (a list
// built for a larger battle), and Start then disabled with the first
// seat's why. In hotseat a seat's line shows a built list by its total
// alone ("Ready · 970 pts · 14 units"), never its units, and its Build…
// opens it again only through the pass screen, handed back to its player
// (app/boot.js: nor does a hotseat seat default to the device's last list,
// which may be the other player's). What each line
// holds is app/boot.js's (the picking); this draws it, and every line's
// DOM is made here with textContent: nothing of a list but its totals is
// written into the panel.
import { RacePicker } from './races.js'

const $ = (s) => document.querySelector(s)
const el = (tag, cls, text) => {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (text !== undefined) e.textContent = text
  return e
}

// (F7a) what each terrain set is called on the panel and in the lobby, and
// what is on it (a set without a line here is shown by its name)
export const TERRAINS = Object.freeze({
  classic: { name: 'Classic', what: 'ruins, woods, hedges and walls' },
  fortified: { name: 'Fortified', what: 'ramparts, bastions, towers and a keep to climb' },
  // (F8b's set, the larger tables')
  open: { name: 'Open', what: 'ruins, woods, hedges and walls, spread over the larger table' },
  // (F19a's set, the keg mission's only one)
  keg: { name: 'Powder keg', what: 'ruins, woods, hedges and walls round a powder keg' },
  // (V3d's, the Powder Field's only one)
  powder: { name: 'Powder Field', what: 'a battlefield still burning: wrecks to climb, shell holes, and powder everywhere' },
})
export const terrainName = (set) => TERRAINS[set]?.name ?? set

// (F19a) What a mission that is more than a battle's size is called on the
// size line and in the lobby, and what it is about (a mission without a
// line here goes by its list's size: Skirmish, Field, Grand)
export const MISSION_NAMES = Object.freeze({
  keg: { name: 'Powder keg', what: 'Four objectives round a powder keg at the centre: hold them while it stands, and whoever sets it off (a template, acid or the Brute) catches everyone near it.' },
  // (V3d) a Grand battle of its own
  powder: { name: 'Powder Field', what: 'A Grand battle on the wreckage of the day\'s fighting, still burning: the objectives on a burned farmstead, wrecked trebuchets and venom engines, and among heaps of powder kegs. Climb the wrecks; a blast that touches the powder sets off every keg in reach.' },
})
// a mission's name on the size line: its own, else its list's size
export const sizeName = (mission, m) => MISSION_NAMES[mission]?.name ?? m.list?.size ?? mission

// a phone's screen: narrow, or a coarse pointer on a small one
export const phoneScreen = () => innerWidth < 700 || (!!globalThis.matchMedia?.('(pointer: coarse)').matches && Math.min(innerWidth, innerHeight) < 600)

export class SetupScreen {
  // `diorama()`: the race showcase (view/diorama.js), asked for only as the
  // panel first opens
  constructor({ diorama }) {
    this.diorama = diorama
    this.root = $('#setup')
    this.pickers = null
    this.on = null
    // (F8b) the size line, made as the panel first shows it
    this.sizeRow = null
    // (F16) the fog line, likewise
    this.fogRow = null
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  // { pick(seat, race), terrain(set), size(mission), (F16) fog(on), start(),
  // back(), (F11b) army(seat, value) (the line's select: a preset's name,
  // or 'list'), build(seat) (Build…), random(seat) (an AI seat's Random) }
  wire(on) {
    this.on = on
    $('#setupStart').onclick = () => on.start()
    $('#setupBack').onclick = () => on.back()
  }

  // { title, seats: [{ who, race, color }], mirror, (F8b) sizes: [{
  // mission, name, W, H, points, rounds }], size (the chosen one's mission),
  // (F7a) terrain: { sets, pick } (the mission's sets and the one picked),
  // (F16) fog: { offered, on } (the mode takes it, and the toggle's state),
  // (F11b) armies: each seat's army line (armyLine, below), and startWhy:
  // why Start is disabled (null: it isn't) }
  show({ title, seats, mirror, sizes = [], size = null, terrain = null, fog = null, armies = null, startWhy = null }) {
    // (the pickers made once, as the panel first opens: nothing is drawn
    // before)
    this.pickers ??= [0, 1].map((s) => new RacePicker({ root: $(`#setup .setupSeat[data-seat="${s}"] .picker`), diorama: this.diorama(), pick: (race) => this.on.pick(s, race) }))
    $('#setupTitle').textContent = title
    seats.forEach((x, s) => {
      $(`#setup .setupSeat[data-seat="${s}"] .who`).textContent = x.who
      this.pickers[s].render({ race: x.race, color: x.color, rules: x.rules })
      if (armies) this.armyLine(s, armies[s])
    })
    // (F11b) Start, while every seat's army is legal
    $('#setupStart').disabled = !!startWhy
    const why = $('#setupWhy')
    if (why) {
      why.textContent = startWhy ? `${startWhy.charAt(0).toUpperCase()}${startWhy.slice(1)}.` : ''
      why.classList.toggle('hidden', !startWhy)
    }
    this.sizes(sizes, size)
    $('#setupMirror').classList.toggle('hidden', !mirror)
    this.terrainLine(terrain)
    this.fogLine(fog)
    this.root.classList.remove('hidden')
  }

  // (F11b) Seat s's army line: `a` { human (a seat played here), options
  // [{ value, label }] (the presets, and 'list' while one is held), value
  // (the option shown), random (an AI seat's Random on), total ("485 pts ·
  // 7 units"), why (null, or why the army isn't legal here), units (an AI
  // seat's units as text, a tap away; null: none shown), sealed (hotseat: a
  // built list shown by its total alone) }.
  armyLine(s, a) {
    const seat = $(`#setup .setupSeat[data-seat="${s}"]`)
    let line = seat.querySelector('.armyLine')
    if (!line) {
      line = el('div', 'armyLine')
      line.dataset.seat = String(s)
      seat.append(line)
    }
    line.classList.toggle('bad', !!a.why)
    const lbl = el('span', 'lbl', 'Army:')
    const pick = el('select', 'armyPick')
    pick.setAttribute('aria-label', `Seat ${s + 1}'s army`)
    for (const o of a.options) {
      const opt = el('option', '', o.label)
      opt.value = o.value
      pick.append(opt)
    }
    pick.value = a.value
    pick.onchange = () => this.on.army?.(s, pick.value)
    const parts = [lbl, pick]
    if (a.human) {
      const build = el('button', 'armyBuild', 'Build…')
      build.onclick = () => this.on.build?.(s)
      parts.push(build)
    } else {
      const rnd = el('button', `armyRandom${a.random ? ' on' : ''}`, 'Random')
      rnd.setAttribute('aria-pressed', String(!!a.random))
      rnd.onclick = () => this.on.random?.(s)
      parts.push(rnd)
    }
    const total = el('span', 'armyTotal small', a.total)
    parts.push(total)
    if (a.units) {
      // (an AI seat's units, a tap away: open as it was across redraws)
      const was = line.querySelector('.armyUnits')?.open ?? false
      const box = el('details', 'armyUnits small')
      box.open = was
      box.append(el('summary', '', 'Its units'), el('span', '', a.units))
      parts.push(box)
    }
    if (a.why) parts.push(el('p', 'armyWhy small', `${a.why.charAt(0).toUpperCase()}${a.why.slice(1)}`))
    line.replaceChildren(...parts)
  }

  // (F16) The fog line: shown for a mode that takes it (against the AI), a
  // toggle and what it means.
  fogLine(fog) {
    if (!this.fogRow) {
      const row = (this.fogRow = document.createElement('div'))
      row.id = 'setupFog'
      row.className = 'fogLine'
      const lbl = document.createElement('span')
      lbl.className = 'lbl'
      lbl.textContent = 'Fog of war'
      const btn = document.createElement('button')
      btn.id = 'setupFogToggle'
      btn.setAttribute('role', 'switch')
      btn.onclick = () => this.on.fog?.(btn.getAttribute('aria-checked') !== 'true')
      const note = document.createElement('span')
      note.className = 'what small'
      note.textContent = 'You see only what your units see of the other army, and the scenery as you last saw it. The AI sees everything.'
      row.append(lbl, btn, note)
      $('#setupMirror').before(row)
      this.fogBtn = btn
    }
    this.fogRow.classList.toggle('hidden', !fog?.offered)
    const btn = this.fogBtn, on = !!fog?.on
    btn.textContent = on ? 'On' : 'Off'
    btn.classList.toggle('on', on)
    btn.setAttribute('aria-checked', String(on))
  }

  // (F7a) the terrain line: a button per set the mission is fought on, the
  // one picked pressed, and what is on it (none for a mission with one set)
  terrainLine(t) {
    const row = $('#setupTerrain')
    row.classList.toggle('hidden', !t || t.sets.length < 2)
    if (!t) return
    const opts = $('#setupTerrain .opts')
    opts.replaceChildren(...t.sets.map((set) => {
      const b = document.createElement('button')
      b.textContent = terrainName(set)
      b.dataset.terrain = set
      b.classList.toggle('on', set === t.pick)
      b.setAttribute('aria-pressed', String(set === t.pick))
      b.onclick = () => this.on.terrain(set)
      return b
    }))
    $('#setupTerrain .what').textContent = TERRAINS[t.pick]?.what ?? ''
  }

  // (F8b) The size line: a button per size (its name, its board and points),
  // the chosen one lit, and a line saying what it is.
  sizes(sizes, size) {
    if (!sizes.length) return
    if (!this.sizeRow) {
      const row = (this.sizeRow = document.createElement('div'))
      row.id = 'setupSize'
      row.setAttribute('role', 'radiogroup')
      row.setAttribute('aria-label', 'Battle size')
      const note = document.createElement('p')
      note.id = 'setupSizeNote'
      note.className = 'small'
      $('#setupMirror').before(row, note)
    }
    const phone = phoneScreen()
    const lbl = document.createElement('span')
    lbl.className = 'lbl'
    lbl.textContent = 'Battle size'
    const buttons = sizes.map((s) => {
      const b = document.createElement('button')
      b.dataset.size = s.mission
      b.className = s.mission === size ? 'on' : ''
      b.setAttribute('role', 'radio')
      b.setAttribute('aria-checked', String(s.mission === size))
      b.append(s.name)
      const small = document.createElement('small')
      small.textContent = `${s.W}×${s.H} · ${s.points.toLocaleString('en')} pts`
      b.append(small)
      b.onclick = () => this.on.size?.(s.mission)
      return b
    })
    this.sizeRow.replaceChildren(lbl, ...buttons)
    const at = sizes.find((s) => s.mission === size) ?? sizes[0]
    const big = phone && at.W * at.H > 60 * 40
    const what = MISSION_NAMES[at.mission]?.what
    $('#setupSizeNote').textContent = `${at.name}: ${/^8/.test(String(at.W)) ? 'an' : 'a'} ${at.W}×${at.H} board, ${at.points.toLocaleString('en')} points a side, ${at.rounds} rounds.${what ? ` ${what}` : ''}${big ? ' Best on a larger screen.' : ''}`
  }

  hide() {
    this.root.classList.add('hidden')
    for (const p of this.pickers ?? []) p.close()
  }
}
