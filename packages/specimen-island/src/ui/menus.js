import { MISSIONS } from '../data/objectives.js'
import { SPECIES_ORDER } from '../data/species.js'

// Title, pause, death, debrief and lore-note screens, plus the settings sheet
// that both the title and the pause menu open.

// Graphics tiers. `auto` is not a tier of its own: main.js picks one of the
// others from the GPU and measured frame times (see core/quality.js).
export const QUALITY = {
  auto: { label: 'Auto' },
  low: { label: 'Low', pixelRatio: 1, shadows: 0, drawDist: 220, smallRadius: 60 },
  medium: { label: 'Medium', pixelRatio: 1.5, shadows: 2048, drawDist: 330, smallRadius: 90 },
  high: { label: 'High', pixelRatio: 2, shadows: 4096, drawDist: 480, smallRadius: 125 },
}

const $ = (id) => document.getElementById(id)
const KEY = 'specimen-island:settings'

function loadSettings() {
  const d = { quality: 'auto', sensitivity: 1, controllerSensitivity: 1, volume: 0.8, invertY: false, v: 2 }
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || '{}')
    // before v2 Medium was the default and got saved along with any other
    // change, so it says nothing about the player's choice: Auto takes over
    if (!s.v && s.quality === 'medium') delete s.quality
    return { ...d, ...s, v: 2 }
  } catch {
    return d
  }
}
function saveSettings(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* private mode */
  }
}

const FOCUSABLE = 'button, select, input, [tabindex]:not([tabindex="-1"])'

export class Menus {
  constructor(G, hooks) {
    this.G = G
    this.hooks = hooks // { start, resume, respawn, applySettings, openJournal }
    this.settings = loadSettings()
    this.noteOpen = false
    this.settingsOpen = false
    this.autoLabel = ''
    for (const el of document.querySelectorAll('.settings')) this.buildSettings(el)
    $('start').addEventListener('click', () => hooks.start())
    $('resume').addEventListener('click', () => hooks.resume())
    $('respawn').addEventListener('click', () => hooks.respawn())
    $('openJournal').addEventListener('click', () => hooks.openJournal())
    $('note').querySelector('[data-close]').addEventListener('click', () => this.closeNote())
    for (const b of document.querySelectorAll('[data-settings]')) b.addEventListener('click', () => this.openSettings(b))
    const sheet = $('settings')
    for (const b of sheet.querySelectorAll('[data-close]')) b.addEventListener('click', () => this.closeSettings())
    sheet.addEventListener('mousedown', (e) => {
      if (e.target === sheet) this.closeSettings()
    })
    // Keys reach the menus before the game's input map, which swallows Tab,
    // Space and the arrows (so checkboxes, sliders and focus would not move)
    // and binds Tab to the journal. On the title nothing is playing yet, so
    // the browser gets Tab and Space back there too.
    addEventListener('keydown', (e) => this.onKey(e), true)
  }

  onKey(e) {
    if (this.settingsOpen) {
      e.stopImmediatePropagation()
      if (e.code === 'Escape') {
        e.preventDefault()
        this.closeSettings()
      } else if (e.code === 'Tab') {
        // keep focus inside the sheet
        e.preventDefault()
        this.cycleFocus($('settings'), e.shiftKey ? -1 : 1)
      }
    } else if (this.G.mode === 'title' && (e.code === 'Tab' || e.code === 'Space')) {
      e.stopImmediatePropagation()
    }
  }

  cycleFocus(root, dir) {
    const items = [...root.querySelectorAll(FOCUSABLE)].filter((el) => !el.disabled && el.offsetParent !== null)
    if (!items.length) return
    const i = items.indexOf(document.activeElement)
    const next = i < 0 ? (dir > 0 ? 0 : items.length - 1) : (i + dir + items.length) % items.length
    items[next].focus()
    items[next].scrollIntoView({ block: 'nearest' })
  }

  controllerRoot() {
    for (const id of ['settings', 'death', 'debrief', 'note', 'journal', 'map', 'pause']) {
      if ($(id).classList.contains('show')) return $(id)
    }
    return this.G.mode === 'title' ? $('title') : null
  }

  updateController(dt, pad, root) {
    if (pad.status !== this.padStatus) {
      this.padStatus = pad.status
      for (const el of document.querySelectorAll('.controller-status')) el.textContent = pad.status
    }
    const menuButton = pad.edges.has(9)
    const back = pad.edges.has(1)
    if (!root) {
      if (menuButton) this.hooks.pause()
      return menuButton
    }
    // Menu/View and the overlay's shortcut can close it, even though gameplay
    // actions are suppressed while a menu has focus.
    const closeOverlay = (root.id === 'map' && pad.edges.has(12)) || (root.id === 'journal' && pad.edges.has(8))
    if (back || menuButton || closeOverlay) {
      if (root.id === 'settings') this.closeSettings()
      else if (root.id === 'note') this.closeNote()
      else if (['map', 'journal', 'pause'].includes(root.id)) this.hooks.resume()
      return true
    }
    if (!pad.active) {
      this.navDirection = null
      this.navWait = 0
      return true
    }
    const items = [...root.querySelectorAll(FOCUSABLE)].filter(el => !el.disabled && el.offsetParent !== null)
    if (items.length && !items.includes(document.activeElement)) items[0].focus()
    const x = (pad.buttons.has(15) ? 1 : 0) - (pad.buttons.has(14) ? 1 : 0) || (Math.abs(pad.move.x) > 0.5 ? Math.sign(pad.move.x) : 0)
    const y = (pad.buttons.has(13) ? 1 : 0) - (pad.buttons.has(12) ? 1 : 0) || (Math.abs(pad.move.y) > 0.5 ? Math.sign(pad.move.y) : 0)
    const direction = y ? `y${y}` : x ? `x${x}` : null
    this.navWait = (this.navWait || 0) - dt
    if (direction && (direction !== this.navDirection || this.navWait <= 0)) {
      const el = document.activeElement
      if (!y && el?.matches('select, input[type="range"]')) {
        if (el.tagName === 'SELECT') el.selectedIndex = Math.max(0, Math.min(el.options.length - 1, el.selectedIndex + x))
        else el.value = String(Math.max(Number(el.min), Math.min(Number(el.max), Number(el.value) + x * Number(el.step || 1))))
        el.dispatchEvent(new Event('input', { bubbles: true }))
      } else this.cycleFocus(root, y || x)
      this.navWait = direction !== this.navDirection ? 0.35 : 0.12
    }
    this.navDirection = direction
    const scroll = root.querySelector('.ledger') || root.querySelector('.inner')
    if (scroll && pad.turn.y) scroll.scrollTop += pad.turn.y * dt * 600
    if (pad.edges.has(0)) {
      const el = document.activeElement
      if (root.contains(el) && el.matches('button, input[type="checkbox"]')) {
        const tab = el.dataset.tab
        el.click()
        // Journal tabs rebuild their DOM after selection.
        if (tab) root.querySelector(`[data-tab="${tab}"]`)?.focus()
      }
    }
    return true
  }

  openSettings(opener) {
    this.opener = opener || document.activeElement
    // from the pause menu the sheet takes its place, and gives it back on close
    this.reopenPause = $('pause').classList.contains('show')
    if (this.reopenPause) this.show('pause', false)
    this.show('settings')
    this.settingsOpen = true
    $('settings').querySelector('select, input')?.focus()
  }

  closeSettings() {
    if (!this.settingsOpen) return
    this.settingsOpen = false
    this.show('settings', false)
    if (this.reopenPause && this.G.mode === 'play' && this.G.paused) this.show('pause')
    this.opener?.focus?.()
  }

  // The Auto option names the tier it is running at: "Auto · Medium".
  setAutoLabel(text) {
    this.autoLabel = text
    for (const o of document.querySelectorAll('.settings option[value="auto"]')) o.textContent = text ? `Auto · ${text}` : 'Auto'
  }

  buildSettings(el) {
    const s = this.settings
    const id = (k) => `set-${k}`
    el.innerHTML = `
      <label for="${id('quality')}">Graphics</label><select id="${id('quality')}" data-k="quality">${Object.entries(QUALITY)
        .map(([k, q]) => `<option value="${k}" ${k === s.quality ? 'selected' : ''}>${q.label}</option>`)
        .join('')}</select>
      <label for="${id('sensitivity')}">Mouse</label><div class="range"><input id="${id('sensitivity')}" type="range" data-k="sensitivity" min="0.3" max="2.5" step="0.05" value="${s.sensitivity}"><output></output></div>
      <label for="${id('controllerSensitivity')}">Controller look</label><div class="range"><input id="${id('controllerSensitivity')}" type="range" data-k="controllerSensitivity" min="0.3" max="2.5" step="0.05" value="${s.controllerSensitivity}"><output></output></div>
      <label for="${id('volume')}">Volume</label><div class="range"><input id="${id('volume')}" type="range" data-k="volume" min="0" max="1" step="0.05" value="${s.volume}"><output></output></div>
      <label for="${id('invertY')}">Invert Y</label><div><input id="${id('invertY')}" type="checkbox" data-k="invertY" ${s.invertY ? 'checked' : ''}></div>`
    this.showValues(el)
    el.addEventListener('input', (e) => {
      const k = e.target.dataset.k
      if (!k) return
      s[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'range' ? Number(e.target.value) : e.target.value
      saveSettings(s)
      this.showValues(el)
      this.hooks.applySettings(s)
    })
  }

  // slider readouts
  showValues(el) {
    const s = this.settings
    const [mouse, controller, volume] = el.querySelectorAll('output')
    mouse.textContent = `${s.sensitivity.toFixed(2)}×`
    controller.textContent = `${s.controllerSensitivity.toFixed(2)}×`
    volume.textContent = `${Math.round(s.volume * 100)}%`
  }

  show(id, on = true) {
    $(id).classList.toggle('show', on)
  }

  showNote(entry) {
    const n = $('note')
    n.querySelector('h2').textContent = entry.title
    n.querySelector('p').textContent = entry.text
    this.show('note')
    this.noteOpen = true
  }
  closeNote() {
    this.show('note', false)
    this.noteOpen = false
    this.hooks.resume(true)
  }

  // The end of a mission: the score, what the island has given up so far, and
  // this mission's ledger. A mission with a `next` offers to carry straight on.
  showDebrief(mission = MISSIONS.expedition) {
    const G = this.G
    const S = G.scoring
    const n = SPECIES_ORDER.length
    const el = $('debrief').querySelector('.inner')
    const since = G.objectives.startedAt(mission.id)
    const rows = S.ledger.filter((e) => e.time >= since)
    const earned = rows.reduce((a, e) => a + e.delta, 0)
    const next = mission.next && !G.objectives.isStarted(mission.next) ? MISSIONS[mission.next] : null
    const rowHtml = (e) => `<div class="row ${e.delta < 0 ? 'bad' : ''}"><span>${e.reason}</span><b>${e.delta > 0 ? '+' : ''}${e.delta}</b></div>`
    el.innerHTML = `<h2>${mission.debrief}</h2>
      <p style="font-size:28px;margin:4px 0"><b>${S.total}</b> pts — <span style="color:var(--accent)">${S.rank()}</span></p>
      ${since > 0 ? `<p style="margin:0">${mission.title}: <b>${earned > 0 ? '+' : ''}${earned}</b> pts</p>` : ''}
      <p style="color:var(--dim)">Species catalogued ${G.science.catalogue.size}/${n} · Blood from ${G.stats.get('speciesBlood')}/${n} species (${G.stats.get('blood')} samples) · Photographed ${G.photos.count}/${n} · Tags ${G.stats.get('tag')} · Animals killed ${G.stats.get('kills')} (overdoses ${G.stats.get('overdoses')}) · Times spotted ${G.stats.get('detections')}</p>
      <div class="ledger">${rows.slice(-14).reverse().map(rowHtml).join('')}</div>
      ${next ? `<p class="brief"><b>${next.title}.</b> ${next.brief}</p>` : ''}
      <div style="display:flex;gap:10px;margin-top:12px">${
        next ? `<button class="btn primary" id="nextMission">Continue — ${next.title}</button>` : '<button class="btn primary" id="keepGoing">Keep exploring</button>'
      }<button class="btn" id="newGame">New expedition</button></div>`
    this.show('debrief')
    el.querySelector(next ? '#nextMission' : '#keepGoing').onclick = () => {
      this.show('debrief', false)
      if (next) G.objectives.start(next.id)
      this.hooks.resume()
    }
    el.querySelector('#newGame').onclick = () => location.reload()
  }
}
