// The piece's adjustable values, and a panel to adjust them by hand.
//
// Every value the look and the sound are tuned by lives in PARAMS, with the
// range worth exploring. The renderer and the score read `tune` every frame,
// so a change shows (or sounds) at once. The panel itself only appears with
// #debug in the address; its values are remembered in this browser, and
// "Copy" puts them on the clipboard as one line to paste back.
//
// To judge a change, compare it: against the published values or a saved
// preset, side by side with a divider to drag, or the whole frame flipped
// between the two with C.

export const PARAMS = [
  // the light
  { group: 'Light', key: 'exposure', label: 'exposure', min: 0.5, max: 8, step: 0.05, value: 2.5 },
  { group: 'Light', key: 'sun', label: 'sun strength', min: 5, max: 120, step: 1, value: 40 },
  { group: 'Light', key: 'sky', label: 'sky in the opening', min: 0, max: 0.5, step: 0.005, value: 0.13 },
  { group: 'Light', key: 'spread', label: 'sun softness', min: 0.001, max: 0.06, step: 0.0005, value: 0.03 },
  { group: 'Light', key: 'bounce', label: 'bounce light', min: 0, max: 4, step: 0.05, value: 1 },
  { group: 'Light', key: 'palette', label: 'colour (−1 cycles)', min: -1, max: 4, step: 1, value: -1 },
  // the air
  { group: 'Air', key: 'fogBase', label: 'haze', min: 0, max: 0.03, step: 0.0002, value: 0.0062 },
  { group: 'Air', key: 'fogLow', label: 'haze near the floor', min: 0, max: 0.05, step: 0.0005, value: 0.011 },
  { group: 'Air', key: 'fogHeight', label: 'floor haze height (m)', min: 0.5, max: 20, step: 0.1, value: 5 },
  { group: 'Air', key: 'phaseG', label: 'forward scatter', min: 0, max: 0.9, step: 0.01, value: 0.55 },
  { group: 'Air', key: 'glow', label: 'air glow', min: 0, max: 0.06, step: 0.001, value: 0.01 },
  // dust in the light
  { group: 'Dust', key: 'dustFloor', label: 'clear air between', min: 0, max: 1, step: 0.01, value: 0.09 },
  { group: 'Dust', key: 'dustAmount', label: 'dust in the streaks', min: 0, max: 4, step: 0.05, value: 0.65 },
  { group: 'Dust', key: 'dustLo', label: 'streak threshold', min: 0, max: 0.95, step: 0.01, value: 0.78 },
  { group: 'Dust', key: 'dustHi', label: 'streak edge', min: 0.05, max: 1, step: 0.01, value: 0.79 },
  { group: 'Dust', key: 'dustAcross', label: 'streak fineness', min: 0.01, max: 0.4, step: 0.005, value: 0.335 },
  { group: 'Dust', key: 'dustAlong', label: 'streak length (inv)', min: 0.001, max: 0.1, step: 0.001, value: 0.004 },
  { group: 'Dust', key: 'motes', label: 'motes', min: 0, max: 1, step: 0.01, value: 0.76 },
  { group: 'Dust', key: 'moteGlow', label: 'mote brightness', min: 0, max: 5, step: 0.05, value: 0.95 },
  // the floor
  { group: 'Floor', key: 'polish', label: 'reflection', min: 0, max: 1, step: 0.01, value: 0.35 },
  { group: 'Floor', key: 'roughLo', label: 'polish roughness', min: 0.01, max: 0.6, step: 0.005, value: 0.04 },
  { group: 'Floor', key: 'roughHi', label: 'worn roughness', min: 0.01, max: 0.9, step: 0.005, value: 0.26 },
  { group: 'Floor', key: 'floorAlbedo', label: 'floor tone', min: 0.02, max: 0.5, step: 0.005, value: 0.13 },
  // the lens
  { group: 'Lens', key: 'bloom', label: 'bloom', min: 0, max: 0.4, step: 0.005, value: 0.205 },
  { group: 'Lens', key: 'grain', label: 'grain', min: 0, max: 0.12, step: 0.002, value: 0 },
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
export const defaults = Object.fromEntries(PARAMS.map((p) => [p.key, p.key === 'lowCut' && coarse ? 110 : p.value]))

const STORE = 'cenotaph.tune'
const read = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v == null ? fallback : JSON.parse(v)
  } catch {
    return fallback
  }
}
const write = (key, v) => {
  try {
    localStorage.setItem(key, JSON.stringify(v))
  } catch {}
}
// a full set of values from a partial one, anything missing at its default
const complete = (vals) => Object.fromEntries(PARAMS.map((p) => [p.key, Number.isFinite(vals?.[p.key]) ? vals[p.key] : defaults[p.key]]))

// the values everything reads; only the panel changes them
export const tune = { ...defaults }

// What to compare them with, and how: `view` is 'mine' (the live values),
// 'split' (reference on the left of `split`, mine on the right) or 'ref'
// (the whole frame, and the sound, on the reference). `ref` names the
// reference: 'published', or one of the saved presets.
export const compare = { view: 'mine', ref: 'published', split: 0.5 }
let presets = {} // name → values

// the values of the current reference
export function reference() {
  return compare.ref !== 'published' && presets[compare.ref] ? presets[compare.ref] : defaults
}

const fmt = (p, v) => {
  const digits = Math.max(0, Math.min(4, Math.ceil(-Math.log10(p.step))))
  return (+v).toFixed(digits)
}
// only what differs from the published values, as key=value pairs
const line = (vals) =>
  PARAMS.filter((p) => vals[p.key] !== defaults[p.key])
    .map((p) => `${p.key}=${fmt(p, vals[p.key])}`)
    .join(' ')
// and back: any key=value pairs found in a pasted line
function parseLine(text) {
  const out = {}
  for (const [, k, v] of text.matchAll(/([A-Za-z]+)\s*[=:]\s*(-?[\d.]+)/g)) if (k in defaults && Number.isFinite(+v)) out[k] = +v
  return out
}
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// Build the panel (only called with #debug). Remembered values apply only
// here, so an ordinary visit always sees the piece as published.
export function mountPanel() {
  Object.assign(tune, complete(read(STORE, {})))
  presets = Object.fromEntries(Object.entries(read(STORE + '.presets', {})).map(([k, v]) => [k, complete(v)]))
  Object.assign(compare, read(STORE + '.compare', {}))
  if (compare.ref !== 'published' && !presets[compare.ref]) compare.ref = 'published'
  if (!['mine', 'split', 'ref'].includes(compare.view)) compare.view = 'mine'
  compare.split = Math.min(0.95, Math.max(0.05, +compare.split || 0.5))
  const saveTune = () => write(STORE, tune)
  const saveCompare = () => write(STORE + '.compare', compare)
  const savePresets = () => write(STORE + '.presets', presets)

  const root = document.createElement('div')
  root.id = 'tune'
  root.className = 'tune-ui'
  root.innerHTML = `
    <button type="button" class="head" aria-expanded="true">tune <span class="caret">▾</span></button>
    <div class="body">
      <div class="compare">
        <div class="seg" role="group" aria-label="What the screen shows">
          <button type="button" data-view="mine" title="your values">Mine</button>
          <button type="button" data-view="split" title="the reference on the left, yours on the right">Split</button>
          <button type="button" data-view="ref" title="the reference (C flips)">Ref</button>
        </div>
        <label class="pick">vs <select id="tune-ref" aria-label="Reference"></select></label>
      </div>
      <div class="presets">
        <input id="tune-name" type="text" placeholder="preset name" aria-label="Preset name" maxlength="24" autocomplete="off" spellcheck="false">
        <button type="button" data-act="save" title="save your values under this name">Save</button>
        <button type="button" data-act="load" title="load the reference preset into your values">Load</button>
        <button type="button" data-act="delete" title="delete the reference preset">Delete</button>
      </div>
      <div class="groups"></div>
      <div class="actions">
        <button type="button" data-act="random" title="roll new values for the open groups (all but Sound if none is open)">Random</button>
        <button type="button" data-act="undo" title="take back the last Random, Reset, Load or paste" disabled>Undo</button>
        <button type="button" data-act="copy" title="copy your changed values as one line">Copy</button>
        <button type="button" data-act="reset" title="put every value back to the published one">Reset</button>
      </div>
      <div class="actions">
        <input id="tune-paste" type="text" placeholder="paste a copied line here" aria-label="Paste values" autocomplete="off" spellcheck="false">
      </div>
      <div class="note" aria-live="polite"></div>
    </div>`
  const groups = root.querySelector('.groups')
  const note = root.querySelector('.note')
  const say = (t) => (note.textContent = t)
  const rows = new Map()

  // the split's divider, and a badge for whole-frame reference
  const divider = document.createElement('div')
  divider.id = 'tune-split'
  divider.className = 'tune-ui'
  divider.innerHTML = `<span class="label left"></span><span class="grip" aria-hidden="true"></span><span class="label right">mine</span>`
  const badge = document.createElement('div')
  badge.id = 'tune-badge'
  badge.className = 'tune-ui'

  function refreshRows() {
    for (const [key, r] of rows) {
      const p = PARAMS.find((q) => q.key === key)
      r.input.value = tune[key]
      r.out.textContent = fmt(p, tune[key])
      r.row.classList.toggle('changed', tune[key] !== defaults[key])
      // and where the reference differs from yours, its value faintly
      const rv = reference()[key]
      r.ref.textContent = compare.view !== 'mine' && rv !== tune[key] ? fmt(p, rv) : ''
    }
  }
  function refreshCompare() {
    for (const b of root.querySelectorAll('[data-view]')) b.setAttribute('aria-pressed', String(b.dataset.view === compare.view))
    const sel = root.querySelector('#tune-ref')
    sel.innerHTML = ['published', ...Object.keys(presets)].map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join('')
    sel.value = compare.ref
    const name = compare.ref === 'published' ? 'published' : compare.ref
    divider.hidden = compare.view !== 'split'
    divider.style.left = `${compare.split * 100}%`
    divider.querySelector('.left').textContent = name
    badge.hidden = compare.view !== 'ref'
    badge.textContent = `showing ${name} · C flips back`
    root.querySelector('[data-act="load"]').disabled = compare.ref === 'published'
    root.querySelector('[data-act="delete"]').disabled = compare.ref === 'published'
    refreshRows()
    saveCompare()
  }

  for (const name of [...new Set(PARAMS.map((p) => p.group))]) {
    const det = document.createElement('details')
    det.open = name === 'Floor' || name === 'Dust'
    det.innerHTML = `<summary>${name}</summary>`
    for (const p of PARAMS.filter((q) => q.group === name)) {
      const row = document.createElement('label')
      row.className = 'row'
      row.innerHTML = `<span class="name">${p.label}</span><input type="range" id="tune-${p.key}" min="${p.min}" max="${p.max}" step="${p.step}"><output></output><span class="ref"></span>`
      const input = row.querySelector('input')
      const out = row.querySelector('output')
      const ref = row.querySelector('.ref')
      input.addEventListener('input', () => {
        tune[p.key] = +input.value
        // moving a slider while looking at the reference: look at yours
        if (compare.view === 'ref') {
          compare.view = 'mine'
          refreshCompare()
        }
        out.textContent = fmt(p, tune[p.key])
        row.classList.toggle('changed', tune[p.key] !== defaults[p.key])
        const rv = reference()[p.key]
        ref.textContent = compare.view !== 'mine' && rv !== tune[p.key] ? fmt(p, rv) : ''
        saveTune()
      })
      // double-click a slider to put it back
      input.addEventListener('dblclick', (e) => {
        e.stopPropagation()
        input.value = defaults[p.key]
        input.dispatchEvent(new Event('input'))
      })
      rows.set(p.key, { input, out, row, ref })
      det.appendChild(row)
    }
    groups.appendChild(det)
  }

  let open = read(STORE + '.open', true) !== false
  const head = root.querySelector('.head')
  const setOpen = (v) => {
    open = v
    root.classList.toggle('closed', !open)
    head.setAttribute('aria-expanded', String(open))
    write(STORE + '.open', open)
  }
  setOpen(open)
  head.addEventListener('click', () => setOpen(!open))

  const setView = (v) => {
    compare.view = v
    refreshCompare()
  }
  for (const b of root.querySelectorAll('[data-view]')) b.addEventListener('click', () => setView(b.dataset.view))
  root.querySelector('#tune-ref').addEventListener('change', (e) => {
    compare.ref = e.target.value
    refreshCompare()
  })

  const nameInput = root.querySelector('#tune-name')
  const saveAs = () => {
    const name = nameInput.value.trim() || `preset ${Object.keys(presets).length + 1}`
    if (name === 'published') return say('"published" is taken')
    presets[name] = { ...tune }
    savePresets()
    compare.ref = name
    nameInput.value = ''
    refreshCompare()
    say(`Saved "${name}"`)
  }
  root.querySelector('[data-act="save"]').addEventListener('click', saveAs)
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveAs()
  })
  // the values before the last big change, for Undo
  let before = null
  const undoBtn = root.querySelector('[data-act="undo"]')
  const remember = () => {
    before = { ...tune }
    undoBtn.disabled = false
  }
  undoBtn.addEventListener('click', () => {
    if (!before) return
    Object.assign(tune, before)
    before = null
    undoBtn.disabled = true
    saveTune()
    refreshRows()
    say('Undone')
  })

  // Random: new values for the open groups, drawn round the published ones —
  // near them more often than far — so most rolls stay worth looking at
  root.querySelector('[data-act="random"]').addEventListener('click', () => {
    let names = [...groups.querySelectorAll('details[open] summary')].map((el) => el.textContent)
    if (!names.length) names = [...new Set(PARAMS.map((p) => p.group))].filter((g) => g !== 'Sound')
    remember()
    for (const p of PARAMS.filter((q) => names.includes(q.group))) {
      const d = defaults[p.key]
      let v
      if (p.key === 'palette') v = Math.floor(Math.random() * (p.max - p.min + 1)) + p.min
      else {
        const u = Math.random() * 2 - 1
        const reach = Math.pow(Math.abs(u), 1.6)
        v = u > 0 ? d + reach * (p.max - d) : d - reach * (d - p.min)
        v = Math.min(p.max, Math.max(p.min, Math.round(v / p.step) * p.step))
      }
      tune[p.key] = +v.toFixed(6)
    }
    // the dust's edge has to stay above its threshold to mean anything
    if (tune.dustHi < tune.dustLo + 0.05) tune.dustHi = Math.min(1, tune.dustLo + 0.05)
    if (tune.roughHi < tune.roughLo) tune.roughHi = tune.roughLo
    saveTune()
    refreshRows()
    say(`Rolled ${names.join(', ')}`)
  })

  root.querySelector('[data-act="load"]').addEventListener('click', () => {
    if (compare.ref === 'published') return
    remember()
    Object.assign(tune, presets[compare.ref])
    saveTune()
    refreshRows()
    say(`Loaded "${compare.ref}"`)
  })
  root.querySelector('[data-act="delete"]').addEventListener('click', () => {
    if (compare.ref === 'published') return
    const gone = compare.ref
    delete presets[gone]
    savePresets()
    compare.ref = 'published'
    refreshCompare()
    say(`Deleted "${gone}"`)
  })
  root.querySelector('[data-act="copy"]').addEventListener('click', () => {
    // shown at once, so it can be selected by hand if the clipboard says no
    const text = line(tune) || '(all published values)'
    say(text)
    navigator.clipboard?.writeText(text).then(
      () => say('Copied: ' + text),
      () => {},
    )
  })
  root.querySelector('[data-act="reset"]').addEventListener('click', () => {
    remember()
    Object.assign(tune, defaults)
    saveTune()
    refreshRows()
    say('Reset to the published values')
  })
  // a line copied on another device, pasted here
  const paste = root.querySelector('#tune-paste')
  paste.addEventListener('change', () => {
    const vals = parseLine(paste.value)
    const n = Object.keys(vals).length
    if (!n) return say('No values found in that line')
    remember()
    Object.assign(tune, defaults, vals)
    saveTune()
    refreshRows()
    paste.value = ''
    say(`Applied ${n} value${n === 1 ? '' : 's'}`)
  })

  // the divider drags
  divider.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    divider.setPointerCapture(e.pointerId)
    const move = (ev) => {
      compare.split = Math.min(0.95, Math.max(0.05, ev.clientX / innerWidth))
      divider.style.left = `${compare.split * 100}%`
    }
    const up = () => {
      divider.removeEventListener('pointermove', move)
      divider.removeEventListener('pointerup', up)
      divider.removeEventListener('pointercancel', up)
      saveCompare()
    }
    divider.addEventListener('pointermove', move)
    divider.addEventListener('pointerup', up)
    divider.addEventListener('pointercancel', up)
  })

  // C flips the whole frame between yours and the reference
  addEventListener('keydown', (e) => {
    if (e.code !== 'KeyC' || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
    if (e.target.closest?.('input, select')) return
    setView(compare.view === 'ref' ? 'mine' : 'ref')
  })

  document.body.append(divider, badge, root)
  refreshCompare()
  return root
}
