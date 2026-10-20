// The piece's adjustable values, and a panel to adjust them by hand.
//
// Every value the look and the sound are tuned by lives in PARAMS, with the
// range worth exploring. The renderer and the score read `tune` every frame,
// so a change shows (or sounds) at once. The panel itself only appears with
// #debug in the address; its values are remembered in this browser, and
// "Copy" puts them on the clipboard as one line to paste back.

export const PARAMS = [
  // the light
  { group: 'Light', key: 'exposure', label: 'exposure', min: 0.5, max: 8, step: 0.05, value: 2.5 },
  { group: 'Light', key: 'sun', label: 'sun strength', min: 5, max: 120, step: 1, value: 40 },
  { group: 'Light', key: 'sky', label: 'sky in the opening', min: 0, max: 0.5, step: 0.005, value: 0.13 },
  { group: 'Light', key: 'spread', label: 'sun softness', min: 0.001, max: 0.03, step: 0.0005, value: 0.0075 },
  { group: 'Light', key: 'bounce', label: 'bounce light', min: 0, max: 4, step: 0.05, value: 1 },
  { group: 'Light', key: 'palette', label: 'colour (−1 cycles)', min: -1, max: 4, step: 1, value: -1 },
  // the air
  { group: 'Air', key: 'fogBase', label: 'haze', min: 0, max: 0.03, step: 0.0002, value: 0.0062 },
  { group: 'Air', key: 'fogLow', label: 'haze near the floor', min: 0, max: 0.05, step: 0.0005, value: 0.011 },
  { group: 'Air', key: 'fogHeight', label: 'floor haze height (m)', min: 0.5, max: 20, step: 0.1, value: 5 },
  { group: 'Air', key: 'phaseG', label: 'forward scatter', min: 0, max: 0.9, step: 0.01, value: 0.55 },
  { group: 'Air', key: 'glow', label: 'air glow', min: 0, max: 0.06, step: 0.001, value: 0.01 },
  // dust in the light
  { group: 'Dust', key: 'dustFloor', label: 'clear air between', min: 0, max: 1, step: 0.01, value: 0.1 },
  { group: 'Dust', key: 'dustAmount', label: 'dust in the streaks', min: 0, max: 4, step: 0.05, value: 1.5 },
  { group: 'Dust', key: 'dustLo', label: 'streak threshold', min: 0, max: 0.95, step: 0.01, value: 0.45 },
  { group: 'Dust', key: 'dustHi', label: 'streak edge', min: 0.05, max: 1, step: 0.01, value: 0.85 },
  { group: 'Dust', key: 'dustAcross', label: 'streak fineness', min: 0.01, max: 0.4, step: 0.005, value: 0.07 },
  { group: 'Dust', key: 'dustAlong', label: 'streak length (inv)', min: 0.001, max: 0.1, step: 0.001, value: 0.011 },
  { group: 'Dust', key: 'motes', label: 'motes', min: 0, max: 1, step: 0.01, value: 0.5 },
  { group: 'Dust', key: 'moteGlow', label: 'mote brightness', min: 0, max: 5, step: 0.05, value: 1 },
  // the floor
  { group: 'Floor', key: 'polish', label: 'reflection', min: 0, max: 1, step: 0.01, value: 0.45 },
  { group: 'Floor', key: 'roughLo', label: 'polish roughness', min: 0.01, max: 0.6, step: 0.005, value: 0.08 },
  { group: 'Floor', key: 'roughHi', label: 'worn roughness', min: 0.01, max: 0.9, step: 0.005, value: 0.32 },
  { group: 'Floor', key: 'floorAlbedo', label: 'floor tone', min: 0.02, max: 0.5, step: 0.005, value: 0.14 },
  // the lens
  { group: 'Lens', key: 'bloom', label: 'bloom', min: 0, max: 0.4, step: 0.005, value: 0.09 },
  { group: 'Lens', key: 'grain', label: 'grain', min: 0, max: 0.12, step: 0.002, value: 0.03 },
  { group: 'Lens', key: 'fringe', label: 'colour fringe', min: 0, max: 0.02, step: 0.0005, value: 0.003 },
  // the sound
  { group: 'Sound', key: 'level', label: 'master', min: 0, max: 1, step: 0.01, value: 0.4 },
  { group: 'Sound', key: 'reverb', label: 'reverb', min: 0, max: 2, step: 0.01, value: 0.85 },
  { group: 'Sound', key: 'lowCut', label: 'low cut (Hz)', min: 20, max: 300, step: 1, value: 40 },
  { group: 'Sound', key: 'shepard', label: 'falling glide', min: 0, max: 2, step: 0.01, value: 1 },
  { group: 'Sound', key: 'pad', label: 'pad and bass', min: 0, max: 2, step: 0.01, value: 1 },
  { group: 'Sound', key: 'air', label: 'choir', min: 0, max: 2, step: 0.01, value: 1 },
  { group: 'Sound', key: 'hall', label: 'room air', min: 0, max: 2, step: 0.01, value: 1 },
  { group: 'Sound', key: 'dust', label: 'dust grains', min: 0, max: 2, step: 0.01, value: 1 },
  { group: 'Sound', key: 'breath', label: 'breath', min: 0, max: 2, step: 0.01, value: 1 },
]

// Phones play the low end through speakers that cannot, and the reverb's bass
// tail turns to distortion in them: cut it there by default.
const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
const defaults = Object.fromEntries(PARAMS.map((p) => [p.key, p.key === 'lowCut' && coarse ? 110 : p.value]))

const STORE = 'cenotaph.tune'
function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || '{}')
    return Object.fromEntries(PARAMS.map((p) => [p.key, Number.isFinite(saved[p.key]) ? saved[p.key] : defaults[p.key]]))
  } catch {
    return { ...defaults }
  }
}
function save(t) {
  try {
    localStorage.setItem(STORE, JSON.stringify(t))
  } catch {}
}

// the values everything reads; only the panel changes them
export const tune = { ...defaults }

const fmt = (p, v) => {
  const digits = Math.max(0, Math.min(4, Math.ceil(-Math.log10(p.step))))
  return (+v).toFixed(digits)
}

// Build the panel (only called with #debug). Remembered values apply only
// here, so an ordinary visit always sees the piece as published.
export function mountPanel() {
  Object.assign(tune, load())
  const root = document.createElement('div')
  root.id = 'tune'
  root.innerHTML = `
    <button type="button" class="head" aria-expanded="true">tune <span class="caret">▾</span></button>
    <div class="body">
      <div class="groups"></div>
      <div class="actions">
        <button type="button" data-act="copy">Copy</button>
        <button type="button" data-act="reset">Reset</button>
        <span class="note" aria-live="polite"></span>
      </div>
    </div>`
  const groups = root.querySelector('.groups')
  const rows = new Map()
  let open = true
  try {
    open = localStorage.getItem(STORE + '.open') !== '0'
  } catch {}
  for (const name of [...new Set(PARAMS.map((p) => p.group))]) {
    const det = document.createElement('details')
    det.open = name === 'Floor' || name === 'Dust'
    det.innerHTML = `<summary>${name}</summary>`
    for (const p of PARAMS.filter((q) => q.group === name)) {
      const row = document.createElement('label')
      row.className = 'row'
      row.innerHTML = `<span class="name">${p.label}</span><input type="range" id="tune-${p.key}" min="${p.min}" max="${p.max}" step="${p.step}"><output></output>`
      const input = row.querySelector('input')
      const out = row.querySelector('output')
      input.value = tune[p.key]
      out.textContent = fmt(p, tune[p.key])
      row.classList.toggle('changed', tune[p.key] !== defaults[p.key])
      input.addEventListener('input', () => {
        tune[p.key] = +input.value
        out.textContent = fmt(p, tune[p.key])
        row.classList.toggle('changed', tune[p.key] !== defaults[p.key])
        save(tune)
      })
      // double-click a slider to put it back
      input.addEventListener('dblclick', (e) => {
        e.stopPropagation()
        tune[p.key] = defaults[p.key]
        input.value = tune[p.key]
        input.dispatchEvent(new Event('input'))
      })
      rows.set(p.key, { input, out, row })
      det.appendChild(row)
    }
    groups.appendChild(det)
  }
  const head = root.querySelector('.head')
  const setOpen = (v) => {
    open = v
    root.classList.toggle('closed', !open)
    head.setAttribute('aria-expanded', String(open))
    try {
      localStorage.setItem(STORE + '.open', open ? '1' : '0')
    } catch {}
  }
  setOpen(open)
  head.addEventListener('click', () => setOpen(!open))
  const note = root.querySelector('.note')
  root.querySelector('[data-act="copy"]').addEventListener('click', () => {
    // only what differs from the defaults, as key=value pairs
    const line = PARAMS.filter((p) => tune[p.key] !== defaults[p.key])
      .map((p) => `${p.key}=${fmt(p, tune[p.key])}`)
      .join(' ')
    const text = line || '(all defaults)'
    const done = () => (note.textContent = 'Copied')
    navigator.clipboard?.writeText(text).then(done, () => {
      note.textContent = text
    }) ?? (note.textContent = text)
  })
  root.querySelector('[data-act="reset"]').addEventListener('click', () => {
    Object.assign(tune, defaults)
    save(tune)
    for (const [key, r] of rows) {
      const p = PARAMS.find((q) => q.key === key)
      r.input.value = tune[key]
      r.out.textContent = fmt(p, tune[key])
      r.row.classList.remove('changed')
    }
    note.textContent = 'Reset'
  })
  document.body.appendChild(root)
  return root
}
