// Builds the control panel straight from the parameter schema. Nothing here
// knows what any control does — add a parameter to an operator module and it
// appears, in the right section, with a working widget.
import { SECTIONS, BY_ID, isDefault } from '../params.js'
import { CURVE_N, evalCurve } from '../engine/curve.js'
import { clamp } from '../geom/path.js'

const el = (tag, cls, text) => {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (text != null) n.textContent = text
  return n
}

const fmt = (spec, v) => {
  if (spec.type !== 'range') return String(v)
  const step = spec.step ?? 0.01
  const dp = step >= 1 ? 0 : step >= 0.1 ? 1 : step >= 0.01 ? 2 : 3
  return v.toFixed(dp)
}

export function buildControls(root, getP, onChange) {
  root.textContent = ''
  const controls = new Map() // id → { row, sync() }
  const sections = []

  for (const sec of SECTIONS) {
    const secEl = el('div', 'section')
    const head = el('button', 'section__head')
    head.appendChild(el('span', 'section__chev', '▾'))
    head.appendChild(el('span', null, sec.name))
    const count = el('span', 'section__count')
    count.hidden = true
    head.appendChild(count)
    head.addEventListener('click', () => secEl.classList.toggle('is-closed'))
    secEl.appendChild(head)

    const body = el('div', 'section__body')
    const ids = []
    for (const grp of sec.groups) {
      const gEl = el('div', 'group')
      // A group titled the same as its section adds nothing; skip the heading.
      if (grp.name !== sec.name) gEl.appendChild(el('div', 'group__title', grp.name))
      for (const spec of grp.params) {
        const ctl = makeControl(spec, getP, onChange)
        controls.set(spec.id, ctl)
        ids.push(spec.id)
        gEl.appendChild(ctl.row)
      }
      body.appendChild(gEl)
    }
    secEl.appendChild(body)
    root.appendChild(secEl)
    sections.push({ el: secEl, count, ids })
  }

  /** Push current values into every widget, and refresh the "changed" badges. */
  function sync() {
    const P = getP()
    for (const c of controls.values()) c.sync(P)
    for (const s of sections) {
      const n = s.ids.reduce((a, id) => a + (isDefault(P, id) ? 0 : 1), 0)
      s.count.textContent = String(n)
      s.count.hidden = n === 0
    }
  }

  /** Filter by a free-text query over label, id and hint. */
  function filter(q) {
    const needle = q.trim().toLowerCase()
    for (const s of sections) {
      let visible = 0
      for (const id of s.ids) {
        const spec = BY_ID.get(id)
        const hit =
          !needle ||
          spec.label.toLowerCase().includes(needle) ||
          id.toLowerCase().includes(needle) ||
          (spec.hint || '').toLowerCase().includes(needle) ||
          (spec.group || '').toLowerCase().includes(needle)
        controls.get(id).row.classList.toggle('is-hidden', !hit)
        if (hit) visible++
      }
      s.el.hidden = visible === 0
      if (needle) s.el.classList.remove('is-closed')
    }
  }

  function setCollapsed(closed) {
    for (const s of sections) s.el.classList.toggle('is-closed', closed)
  }

  sync()
  // Everything except the first two sections starts folded — 200 controls at
  // once is a wall, and the panel should read as a menu first.
  sections.forEach((s, i) => s.el.classList.toggle('is-closed', i > 1))
  return { sync, filter, setCollapsed, controls }
}

function makeControl(spec, getP, onChange) {
  const row = el('div', 'ctl ctl--' + spec.type)
  if (spec.bipolar) row.classList.add('ctl--bipolar')
  const top = el('div', 'ctl__top')
  const label = el('span', 'ctl__label', spec.label)
  label.title = (spec.hint ? spec.hint + '\n\n' : '') + spec.id + ' — double-click to reset'
  label.addEventListener('dblclick', () => onChange(spec.id, spec.type === 'curve' ? [...spec.default] : spec.default))
  top.appendChild(label)
  row.appendChild(top)

  const set = (v) => onChange(spec.id, v)
  let sync

  if (spec.type === 'range' || spec.type === 'seed') {
    const isSeed = spec.type === 'seed'
    const num = el('input', 'ctl__val')
    num.type = 'number'
    if (!isSeed) {
      num.min = spec.min
      num.max = spec.max
      num.step = spec.step ?? 0.01
    }
    top.appendChild(num)
    if (spec.unit) top.appendChild(el('span', 'ctl__unit', spec.unit))

    let slider = null
    if (isSeed) {
      const dice = el('button', 'btn btn--ghost', '⚄')
      dice.title = 'Roll a new seed'
      dice.addEventListener('click', () => set(Math.floor(Math.random() * 100000)))
      top.appendChild(dice)
    } else {
      const wrap = el('div', 'track-mid')
      slider = el('input')
      slider.type = 'range'
      slider.min = spec.min
      slider.max = spec.max
      slider.step = spec.step ?? 0.01
      wrap.appendChild(slider)
      row.appendChild(wrap)
      slider.addEventListener('input', () => set(Number(slider.value)))
    }
    num.addEventListener('change', () => {
      const v = Number(num.value)
      if (Number.isFinite(v)) set(isSeed ? Math.round(v) : clamp(v, spec.min, spec.max))
    })
    sync = (P) => {
      const v = P[spec.id]
      if (slider) slider.value = String(v)
      if (document.activeElement !== num) num.value = isSeed ? String(v) : fmt(spec, v)
    }
  } else if (spec.type === 'toggle') {
    const sw = el('label', 'switch')
    const input = el('input')
    input.type = 'checkbox'
    sw.appendChild(input)
    sw.appendChild(el('span', 'switch__slot'))
    sw.appendChild(el('span', 'switch__knob'))
    top.appendChild(sw)
    input.addEventListener('change', () => set(input.checked))
    sync = (P) => { input.checked = !!P[spec.id] }
  } else if (spec.type === 'select') {
    const sel = el('select', 'select')
    for (const o of spec.options) {
      const opt = el('option', null, o.label)
      opt.value = o.value
      sel.appendChild(opt)
    }
    row.appendChild(sel)
    sel.addEventListener('change', () => set(sel.value))
    sync = (P) => { sel.value = P[spec.id] }
  } else if (spec.type === 'color') {
    const inp = el('input', 'swatch')
    inp.type = 'color'
    top.appendChild(inp)
    inp.addEventListener('input', () => set(inp.value))
    sync = (P) => { inp.value = P[spec.id] }
  } else if (spec.type === 'curve') {
    const canvas = el('canvas', 'curve')
    row.appendChild(canvas)
    const editor = makeCurveEditor(canvas, spec, () => getP()[spec.id], set)
    sync = () => editor.draw()
  } else {
    sync = () => {}
  }

  const baseSync = sync
  return {
    row,
    spec,
    sync(P) {
      baseSync(P)
      row.classList.toggle('is-dirty', !isDefault(P, spec.id))
      // `when` lets a module hide a control that only matters once its parent
      // control is switched on, which keeps the panel from reading as noise.
      if (spec.when) row.classList.toggle('is-inert', !spec.when(P))
    },
  }
}

/** Nine draggable handles over a Catmull-Rom preview. */
function makeCurveEditor(canvas, spec, getValue, set) {
  let dpr = 1
  let dragging = -1

  function draw() {
    const w = canvas.clientWidth || 220
    const h = canvas.clientHeight || 62
    dpr = Math.min(2, window.devicePixelRatio || 1)
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }
    const g = canvas.getContext('2d')
    const v = getValue()
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, w, h)
    const css = getComputedStyle(document.documentElement)
    const line = css.getPropertyValue('--line-2').trim() || '#35353f'
    const accent = css.getPropertyValue('--accent').trim() || '#e2574c'

    g.strokeStyle = line
    g.lineWidth = 1
    g.beginPath()
    for (let i = 1; i < 4; i++) {
      g.moveTo(0, (h * i) / 4)
      g.lineTo(w, (h * i) / 4)
    }
    g.stroke()

    g.strokeStyle = accent
    g.lineWidth = 1.5
    g.beginPath()
    for (let i = 0; i <= 64; i++) {
      const t = i / 64
      const y = h - clamp(evalCurve(v, t), 0, 1) * h
      i ? g.lineTo(t * w, y) : g.moveTo(t * w, y)
    }
    g.stroke()

    g.fillStyle = accent
    for (let i = 0; i < v.length; i++) {
      const x = (i / (v.length - 1)) * w
      const y = h - v[i] * h
      g.beginPath()
      g.arc(clamp(x, 2.5, w - 2.5), clamp(y, 2.5, h - 2.5), 2.5, 0, Math.PI * 2)
      g.fill()
    }
  }

  const pick = (ev) => {
    const r = canvas.getBoundingClientRect()
    const x = (ev.clientX - r.left) / r.width
    const y = 1 - (ev.clientY - r.top) / r.height
    return [clamp(x, 0, 1), clamp(y, 0, 1)]
  }

  canvas.addEventListener('pointerdown', (ev) => {
    const [x, y] = pick(ev)
    dragging = Math.round(x * (CURVE_N - 1))
    canvas.setPointerCapture(ev.pointerId)
    apply(y)
  })
  canvas.addEventListener('pointermove', (ev) => {
    if (dragging < 0) return
    const [x, y] = pick(ev)
    dragging = Math.round(x * (CURVE_N - 1))
    apply(y)
  })
  const stop = () => { dragging = -1 }
  canvas.addEventListener('pointerup', stop)
  canvas.addEventListener('pointercancel', stop)
  canvas.addEventListener('dblclick', () => set([...spec.default]))

  function apply(y) {
    const next = [...getValue()]
    next[dragging] = y
    set(next)
  }

  return { draw }
}
