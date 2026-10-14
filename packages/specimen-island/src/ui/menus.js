// Title, pause, death, debrief and lore-note screens, plus the settings
// controls shared by the title and pause menus.

export const QUALITY = {
  low: { label: 'Low', pixelRatio: 1, shadows: 0, drawDist: 220, smallRadius: 60 },
  medium: { label: 'Medium', pixelRatio: 1.5, shadows: 2048, drawDist: 330, smallRadius: 90 },
  high: { label: 'High', pixelRatio: 2, shadows: 4096, drawDist: 480, smallRadius: 125 },
}

const $ = (id) => document.getElementById(id)

function loadSettings() {
  const d = { quality: 'medium', sensitivity: 1, volume: 0.8, invertY: false }
  try {
    return { ...d, ...JSON.parse(localStorage.getItem('specimen-island:settings') || '{}') }
  } catch {
    return d
  }
}
function saveSettings(s) {
  try {
    localStorage.setItem('specimen-island:settings', JSON.stringify(s))
  } catch {
    /* private mode */
  }
}

export class Menus {
  constructor(G, hooks) {
    this.G = G
    this.hooks = hooks // { start, resume, respawn, applySettings, openJournal }
    this.settings = loadSettings()
    this.noteOpen = false
    for (const el of document.querySelectorAll('.settings')) this.buildSettings(el)
    $('start').addEventListener('click', () => hooks.start())
    $('resume').addEventListener('click', () => hooks.resume())
    $('respawn').addEventListener('click', () => hooks.respawn())
    $('openJournal').addEventListener('click', () => hooks.openJournal())
    $('note').querySelector('[data-close]').addEventListener('click', () => this.closeNote())
  }

  buildSettings(el) {
    const s = this.settings
    el.innerHTML = `
      <label>Graphics</label><select data-k="quality">${Object.entries(QUALITY)
        .map(([k, q]) => `<option value="${k}" ${k === s.quality ? 'selected' : ''}>${q.label}</option>`)
        .join('')}</select>
      <label>Mouse</label><input type="range" data-k="sensitivity" min="0.3" max="2.5" step="0.05" value="${s.sensitivity}">
      <label>Volume</label><input type="range" data-k="volume" min="0" max="1" step="0.05" value="${s.volume}">
      <label>Invert Y</label><input type="checkbox" data-k="invertY" ${s.invertY ? 'checked' : ''}>`
    el.addEventListener('input', (e) => {
      const k = e.target.dataset.k
      if (!k) return
      s[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'range' ? Number(e.target.value) : e.target.value
      saveSettings(s)
      // keep both copies of the controls in step
      for (const other of document.querySelectorAll(`.settings [data-k="${k}"]`)) {
        if (other === e.target) continue
        if (other.type === 'checkbox') other.checked = s[k]
        else other.value = s[k]
      }
      this.hooks.applySettings(s)
    })
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

  showDebrief() {
    const G = this.G
    const S = G.scoring
    const el = $('debrief').querySelector('.inner')
    const species = G.science.catalogue.size
    el.innerHTML = `<h2>Expedition debrief</h2>
      <p style="font-size:28px;margin:4px 0"><b>${S.total}</b> pts — <span style="color:var(--accent)">${S.rank()}</span></p>
      <p style="color:var(--dim)">Species catalogued ${species}/10 · Blood samples ${G.stats.get('blood')} · Tags ${G.stats.get('tag')} · Animals killed ${G.stats.get('kills')} (overdoses ${G.stats.get('overdoses')}) · Times spotted ${G.stats.get('detections')}</p>
      <div class="ledger">${S.ledger
        .slice(-14)
        .reverse()
        .map((e) => `<div class="row ${e.delta < 0 ? 'bad' : ''}"><span>${e.reason}</span><b>${e.delta > 0 ? '+' : ''}${e.delta}</b></div>`)
        .join('')}</div>
      <div style="display:flex;gap:10px;margin-top:12px"><button class="btn primary" id="keepGoing">Keep exploring</button><button class="btn" id="newGame">New expedition</button></div>`
    this.show('debrief')
    el.querySelector('#keepGoing').onclick = () => {
      this.show('debrief', false)
      this.hooks.resume()
    }
    el.querySelector('#newGame').onclick = () => location.reload()
  }
}
