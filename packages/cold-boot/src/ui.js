// Everything DOM: the stage chips, the step panel (narration, mode ladder,
// registers, code), the logical-processor strip, the timeline scrubber and
// clock, the eye-diagram inset, 3-D anchored labels and the hover tooltip.

import { MODE_COLORS, MODE_LABEL, fmtTime, clamp } from './util.js'
import { drawEye } from './eye.js'

const $ = (s) => document.querySelector(s)

const RUNGS = [
  { mode: 'real', bits: '16-bit real', era: '8086 · 1978', c: MODE_COLORS.real },
  { mode: 'prot', bits: '32-bit protected', era: '80386 · 1985', c: MODE_COLORS.prot },
  { mode: 'long', bits: '64-bit long', era: 'AMD64 · 2003', c: MODE_COLORS.long },
]
// Schematic (not to scale) map of the physical address space as the firmware
// sees it. A region is "on" once something decodes it, "hit" while the step is
// touching it.
const MEMMAP = [
  { id: 'dram', label: 'DRAM', sub: '0 → TOLUD: DRAM below the 32-bit MMIO hole', flex: 30, c: '#7cf2ff' },
  { gap: true },
  { id: 'mmio', label: 'MMIO', sub: 'PCIe BARs + ECAM configuration space', flex: 15, c: '#a78bff' },
  { gap: true },
  { id: 'car', label: 'CAR', sub: 'cache lines pinned as RAM (no DRAM behind them)', flex: 9, c: '#ff6bd5' },
  { id: 'lapic', label: 'APIC', sub: 'local APIC at FEE0_0000', flex: 8, c: '#ffffff' },
  { id: 'flash', label: 'flash', sub: 'BIOS region, top 16 MiB below 4 GiB', flex: 10, c: '#ffcf6b' },
  { four: true },
  { id: 'high', label: 'DRAM', sub: 'DRAM remapped above 4 GiB', flex: 20, c: '#7cf2ff' },
]

const RANK = { off: -1, reset: -1, wfs: -1, real: 0, prot: 1, long: 2, park: 2, os: 2 }

export class UI {
  constructor({ timeline, stages, lpLayout, onSpeed }) {
    this.tl = timeline
    this.stages = stages
    this.lastStep = -1
    this.codeLines = []
    this.labelEls = new Map()
    this.speeds = [0.25, 0.5, 1, 2, 4]
    this.speedIdx = 2
    this.onSpeed = onSpeed
    this.buildStages()
    this.buildTimeline()
    this.buildLps(lpLayout)
    this.bindControls()
  }

  buildStages() {
    const nav = $('#stages')
    nav.innerHTML = ''
    this.stageBtns = this.stages.map((s, k) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.style.setProperty('--c', s.color)
      b.innerHTML = `<span class="n">${k}</span><span>${s.name}</span>`
      b.title = s.long
      b.addEventListener('click', () => {
        const i = this.tl.steps.findIndex((st) => st.stage === k)
        if (i >= 0) this.tl.go(i)
      })
      nav.appendChild(b)
      return b
    })
  }

  buildTimeline() {
    const segs = $('#segments')
    const ticks = $('#ticks')
    segs.innerHTML = ''
    ticks.innerHTML = ''
    $('#track').title = ''
    // Consecutive runs of the same stage become one coloured segment.
    const runs = []
    this.tl.steps.forEach((st, i) => {
      const last = runs[runs.length - 1]
      if (last && last.stage === st.stage) last.end = i
      else runs.push({ stage: st.stage, start: i, end: i })
    })
    this.runs = runs.map((r) => {
      const a = this.tl.starts[r.start] / this.tl.total
      const b = (this.tl.starts[r.end] + this.tl.steps[r.end].dur) / this.tl.total
      const el = document.createElement('div')
      el.className = 'seg'
      el.style.flex = `${b - a} 1 0`
      const s = this.stages[r.stage]
      el.style.setProperty('--c', s.color)
      el.innerHTML = `<div class="fill"></div><div class="lbl">${s.name}</div>`
      el.title = s.long
      segs.appendChild(el)
      return { ...r, a, b, el, fill: el.firstChild }
    })
    this.tickEls = this.tl.steps.map((st, i) => {
      const t = document.createElement('i')
      t.style.left = `${(this.tl.starts[i] / this.tl.total) * 100}%`
      t.title = st.title
      ticks.appendChild(t)
      return t
    })
  }

  buildLps(layout) {
    const root = $('#lps')
    root.innerHTML = ''
    this.lpCells = []
    const head = document.createElement('div')
    head.className = 'count'
    root.appendChild(head)
    this.lpCount = head
    const pRow = document.createElement('div')
    pRow.className = 'row'
    pRow.innerHTML = '<span class="lab">P-cores</span>'
    const eRow = document.createElement('div')
    eRow.className = 'row'
    eRow.innerHTML = '<span class="lab">E-cores</span>'
    let pc = null
    layout.forEach((lp, i) => {
      const cell = document.createElement('div')
      cell.className = `cell ${lp.kind}`
      cell.title = lp.label
      if (lp.kind === 'p') {
        if (i % 2 === 0) {
          pc = document.createElement('div')
          pc.className = 'pc'
          pRow.appendChild(pc)
        }
        pc.appendChild(cell)
      } else {
        eRow.appendChild(cell)
      }
      this.lpCells.push(cell)
    })
    root.appendChild(pRow)
    root.appendChild(eRow)
    const legend = document.createElement('div')
    legend.className = 'legend'
    legend.innerHTML = ['wfs', 'real', 'prot', 'long', 'park', 'os'].map((m) => `<span><i style="background:${MODE_COLORS[m]}"></i>${MODE_LABEL[m]}</span>`).join('')
    root.appendChild(legend)
    this.lpModes = layout.map(() => 'off')
  }

  bindControls() {
    $('#play').addEventListener('click', () => this.tl.toggle())
    $('#next').addEventListener('click', () => this.tl.next())
    $('#prev').addEventListener('click', () => this.tl.prev())
    $('#speed').addEventListener('click', () => {
      this.speedIdx = (this.speedIdx + 1) % this.speeds.length
      const s = this.speeds[this.speedIdx]
      $('#speed').textContent = `${s}×`
      $('#speed').setAttribute('aria-label', `Playback speed ${s}×`)
      this.onSpeed?.(s)
    })
    // Reading the panel pauses playback: autoplay moves faster than anyone reads.
    for (const ev of ['pointerdown', 'wheel', 'touchstart']) {
      $('#panel').addEventListener(ev, () => {
        if (this.tl.playing) this.tl.pause()
      }, { passive: true })
    }
    const track = $('#track')
    let dragging = false
    const seek = (e) => {
      const r = track.getBoundingClientRect()
      this.tl.seekGlobal((e.clientX - r.left) / r.width)
    }
    track.addEventListener('pointerdown', (e) => {
      dragging = true
      track.setPointerCapture(e.pointerId)
      seek(e)
    })
    const tip = $('#tracktip')
    track.addEventListener('pointermove', (e) => {
      if (dragging) seek(e)
      const r = track.getBoundingClientRect()
      const f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * this.tl.total
      let k = this.tl.steps.length - 1
      for (let j = 0; j < this.tl.steps.length; j++) {
        if (f < this.tl.starts[j] + this.tl.steps[j].dur) {
          k = j
          break
        }
      }
      tip.hidden = false
      tip.innerHTML = `<span>${k + 1}</span>${this.tl.steps[k].title}`
      tip.style.left = `${e.clientX - r.left}px`
    })
    track.addEventListener('pointerleave', () => (tip.hidden = true))
    track.addEventListener('pointerup', () => (dragging = false))
    track.addEventListener('pointercancel', () => (dragging = false))
    track.addEventListener('lostpointercapture', () => (dragging = false))
    // Slider keys: arrows step, Home/End jump to the ends, PageUp/PageDown
    // jump a whole stage.
    const stageStart = (dir) => {
      const steps = this.tl.steps
      const cur = steps[this.tl.i].stage
      if (dir > 0) {
        const k = steps.findIndex((s) => s.stage > cur)
        return k < 0 ? steps.length - 1 : k
      }
      // back: to the start of this stage, or of the previous one if already there
      const first = steps.findIndex((s) => s.stage === cur)
      if (first < this.tl.i) return first
      return Math.max(0, steps.findIndex((s) => s.stage === cur - 1))
    }
    track.addEventListener('keydown', (e) => {
      const n = this.tl.steps.length
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') this.tl.next()
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') this.tl.prev()
      else if (e.key === 'Home') this.tl.go(0)
      else if (e.key === 'End') this.tl.go(n - 1)
      else if (e.key === 'PageUp') this.tl.go(stageStart(1))
      else if (e.key === 'PageDown') this.tl.go(stageStart(-1))
      else return
      e.preventDefault()
    })
    window.addEventListener('keydown', (e) => {
      const t = e.target
      if (t.closest?.('input, textarea, select')) return
      if (e.key === ' ') {
        // Space presses a focused control, except ⏻ and ▶ (focus stays on them
        // after a mouse click, and Space should keep meaning play/pause).
        if (t.closest?.('button') && !t.closest('#play, #power')) return
        e.preventDefault()
        if (document.body.classList.contains('intro')) $('#power').click()
        else this.tl.toggle()
      } else if (e.key === 'ArrowRight' && t !== track) this.tl.next()
      else if (e.key === 'ArrowLeft' && t !== track) this.tl.prev()
    })
  }

  // Rebuild the panel for a new step.
  renderStep(st, i) {
    const stage = this.stages[st.stage]
    const meta = $('#stepmeta')
    meta.style.setProperty('--c', stage.color)
    meta.innerHTML = `<span class="stage">Stage ${st.stage} · ${stage.name}</span><span class="lpmini" title="logical processors executing"></span><span>${i + 1} / ${this.tl.steps.length}</span>`
    this.lpMini = meta.querySelector('.lpmini')
    this.lpMiniText = null
    $('#title').textContent = st.title
    this.ladderMode = null
    $('#narration').innerHTML = (st.narration || []).map((p) => `<p>${p}</p>`).join('')
    const note = $('#note')
    note.innerHTML = st.note ? `<span class="tag">${st.note.tag}</span>${st.note.html}` : ''
    $('#facts').innerHTML = (st.facts || []).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')
    const mm = $('#memmap')
    mm.hidden = !st.mem
    if (st.mem) {
      $('#memnote').textContent = st.mem.note || ''
      mm.querySelector('.bar').innerHTML = MEMMAP.map((m) => {
        if (m.gap) return '<div class="m gap"></div>'
        if (m.four) return '<div class="m four" title="4 GiB boundary"></div>'
        const on = st.mem.on?.includes(m.id)
        const hit = st.mem.hit?.includes(m.id)
        return `<div class="m ${on ? 'on' : ''} ${hit ? 'hit' : ''}" style="flex:${m.flex} 1 0;--c:${m.c}" title="${m.sub}${on ? '' : ' — nothing answers here yet'}">${m.label}</div>`
      }).join('')
    }
    // registers
    this.regsKey = ''
    if (!st.regs) $('#regs').innerHTML = ''
    // code
    const code = $('#code')
    if (st.code) {
      const src = st.code.href ? `<a href="${st.code.href}" target="_blank" rel="noopener">${st.code.src}</a>` : st.code.src || ''
      code.innerHTML = `<h3>${st.code.title || 'Executing'}<span>${src}</span></h3><pre>${st.code.lines.map((l) => codeLine(l, codeLang(st.code))).join('')}</pre><div class="explain"></div>`
      this.codeLines = [...code.querySelectorAll('.ln')]
      this.codeExplain = code.querySelector('.explain')
      this.lastOn = null
    } else {
      code.innerHTML = ''
      this.codeLines = []
    }
    $('#sources').innerHTML = st.sources?.length ? 'Sources: ' + st.sources.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join(' · ') : ''
    $('#panel').scrollTop = 0
    // stage chips
    this.stageBtns.forEach((b, k) => {
      b.classList.toggle('on', k === st.stage)
      b.classList.toggle('past', k < st.stage)
      if (k === st.stage) b.setAttribute('aria-current', 'step')
      else b.removeAttribute('aria-current')
    })
    // the timeline slider's value, and one short line for screen readers
    // (debounced so scrubbing doesn't queue every step)
    const n = this.tl.steps.length
    const tr = $('#track')
    tr.setAttribute('aria-valuemin', '1')
    tr.setAttribute('aria-valuemax', String(n))
    tr.setAttribute('aria-valuenow', String(i + 1))
    tr.setAttribute('aria-valuetext', `Step ${i + 1} of ${n}: ${st.title} (${stage.name})`)
    clearTimeout(this.srT)
    this.srT = setTimeout(() => {
      $('#sr-step').textContent = `Step ${i + 1} of ${n}: ${st.title}`
    }, 400)
    this.tickEls.forEach((t, k) => t.classList.toggle('on', k === i))
    $('#eye').hidden = !st.eye
    this.obstaclesDirty = true
    if (st.eye) {
      $('#eyetitle').textContent = st.eye.title
      $('#eyesub').textContent = st.eye.sub || ''
    }
  }

  // Per-frame updates.
  frame({ realT, resetT, lpModes, step, p, time, ctx }) {
    const i = this.tl.i
    if (i !== this.lastStep) {
      this.lastStep = i
      this.renderStep(step, i)
    }
    const g = this.tl.global
    $('#playhead').style.left = `${g * 100}%`
    for (const r of this.runs) {
      const f = clamp((g - r.a) / (r.b - r.a))
      r.fill.style.width = `${f * 100}%`
    }
    $('#play').textContent = this.tl.playing ? '❚❚' : '▶'
    $('#play').setAttribute('aria-label', this.tl.playing ? 'Pause' : 'Play')
    // clock
    $('#clockmain').textContent = realT <= 0 ? 't = 0' : `t ≈ ${fmtTime(realT)}`
    $('#clocksub').textContent = resetT == null ? 'since the power button' : `since power button · ${fmtTime(resetT)} since the reset vector`
    // mode ladder (the BSP's mode; a step may change it part-way through)
    const mode = typeof step.mode === 'function' ? step.mode(p) : step.mode
    if (mode !== this.ladderMode) {
      this.ladderMode = mode
      const rank = RANK[mode] ?? -1
      $('#ladder').innerHTML = RUNGS.map((r, k) => {
        // Stage 0's ACM runs 32-bit before any 16-bit code, so nothing is 'done' yet
        const cls = k === rank ? 'on' : k < rank && step.stage >= 1 ? 'done' : ''
        return `<div class="rung ${cls}" style="--c:${r.c}"><b>${r.bits}</b>${r.era}</div>`
      }).join('')
      $('#ladder').title = rank < 0 ? 'No BIOS instruction has executed yet' : ''
    }
    // registers: static, or a function of progress (values change as the
    // instructions that change them execute)
    if (step.regs) {
      const R = typeof step.regs === 'function' ? step.regs(p, ctx) : step.regs
      const key = JSON.stringify(R)
      if (key !== this.regsKey) {
        const prev = this.regsPrev && this.regsStep === i ? this.regsPrev : null
        this.regsKey = key
        this.regsStep = i
        this.regsPrev = Object.fromEntries(R.rows.map(([k, v]) => [k, v]))
        $('#regs').innerHTML = `<h3>${R.title || 'State'}<span>${R.note || ''}</span></h3><div class="grid">${R.rows
          .map(([k, v, flags = '']) => {
            const changed = prev && prev[k] !== undefined && prev[k] !== v ? ' flash' : ''
            const wide = String(k).length + String(v).length > 20 && !flags.includes('wide') ? ' wide' : ''
            return `<div class="r ${flags}${wide}${changed}"><span class="k">${k}</span><span class="v" title="${v}">${v}</span></div>`
          })
          .join('')}</div>`
      }
    }
    // code line
    if (this.codeLines.length && step.code?.at) {
      const at = step.code.at(p)
      this.codeLines.forEach((el, k) => {
        el.classList.toggle('on', k === at)
        el.classList.toggle('done', k < at)
      })
      const on = this.codeLines[at]
      if (on && on !== this.lastOn) {
        this.lastOn = on
        const pre = on.parentElement
        // Both offsets are measured from #panel, so their difference is the
        // line's position inside the listing.
        pre.scrollTop = on.offsetTop - pre.offsetTop - (pre.clientHeight - on.offsetHeight) / 2
        const line = step.code.lines[at]
        const why = typeof line === 'object' ? line.why : ''
        this.codeExplain.innerHTML = why ? `<b>${esc(typeof line === 'object' ? line.i : line)}</b> — ${why}` : ''
      }
    }
    // logical processors
    let running = 0
    lpModes.forEach((m, k) => {
      if (m !== this.lpModes[k]) {
        this.lpModes[k] = m
        const c = this.lpCells[k]
        c.style.background = MODE_COLORS[m]
        c.style.boxShadow = m === 'off' || m === 'reset' ? 'none' : `0 0 6px ${MODE_COLORS[m]}88`
        c.title = `${c.title.split(' —')[0]} — ${MODE_LABEL[m]}`
      }
      if (m === 'real' || m === 'prot' || m === 'long' || m === 'os') running++
    })
    this.lpCount.textContent = `${running} of ${lpModes.length} logical processors executing`
    // phones hide the LP strip; the panel header keeps the count
    const mini = `${running}/${lpModes.length} threads`
    if (mini !== this.lpMiniText) {
      this.lpMiniText = mini
      this.lpMini.textContent = mini
    }
    if (step.eye) {
      const cap = drawEye($('#eyecanvas'), step.eye, p, time)
      if (cap !== this.eyeCap) {
        this.eyeCap = cap
        $('#eye .eyeaxes span').textContent = cap
      }
    }
  }

  // HTML labels pinned to 3-D anchors. `items`: [{id, text, pos (Vector3), hot, color}]
  labels(items, camera, w, h) {
    const root = $('#labels')
    const seen = new Set()
    const right = this.view?.right ?? w
    const bottom = this.view?.bottom ?? h
    const placed = []
    for (const it of items) {
      seen.add(it.id)
      let el = this.labelEls.get(it.id)
      if (!el) {
        el = document.createElement('div')
        el.className = 'l'
        root.appendChild(el)
        this.labelEls.set(it.id, el)
      }
      if (el.textContent !== it.text) {
        el.textContent = it.text
        el.bw = null // re-measure only when the text changes
      }
      el.classList.toggle('hot', !!it.hot)
      if (it.color) el.style.setProperty('--lc', it.color)
      else el.style.removeProperty('--lc')
      const v = it.pos.clone().project(camera)
      const x = ((v.x + 1) / 2) * w
      const y = ((1 - v.y) / 2) * h - 10
      const vis = v.z < 1 && x > -20 && x < right + 20 && y > 16 && y < bottom
      el.style.opacity = vis ? (it.dim ? 0.55 : 1) : 0
      if (el.bw == null) {
        el.bw = el.offsetWidth
        el.bh = el.offsetHeight
      }
      placed.push({ el, x, y, vis, hot: !!it.hot, bw: el.bw, bh: el.bh })
    }
    // Chrome drawn over the canvas that labels must not hide under: the brand
    // block, stage chips, LP strip, inset and eye card. Their rects only change
    // on resize or when the inset / eye appear, so they're cached.
    if (this.obstaclesDirty || !this.obstacles) {
      this.obstaclesDirty = false
      this.obstacles = ['#brand', '#stages', '#lps', '#inset', '#eye']
        .map((sel) => $(sel))
        .filter((el) => el && !el.hidden && getComputedStyle(el).display !== 'none')
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width > 0 && r.height > 0)
    }
    const obstacles = document.body.classList.contains('intro') ? [] : this.obstacles
    const hits = (cx, top, L) => obstacles.find((o) => cx + L.bw / 2 > o.left - 2 && cx - L.bw / 2 < o.right + 2 && top > o.top - 2 && top - L.bh < o.bottom + 2)
    // Keep each box on screen, off the chrome and off its neighbours: hot
    // labels claim their spot first, the rest slide up out of the way. The
    // leader line stretches (and leans) so it still ends on the true point.
    placed.sort((a, b) => b.hot - a.hot || b.y - a.y)
    const boxes = []
    for (const L of placed) {
      const half = L.bw / 2 + 6
      let cx = Math.max(half, Math.min(right - half, L.x))
      let top = L.y
      const o = L.vis && hits(cx, top, L)
      if (o) {
        // try beside the obstacle, then below it, then above it
        const tries = [
          [o.right + half + 2, top],
          [o.left - half - 2, top],
          [cx, o.bottom + L.bh + 4],
          [cx, o.top - 4],
        ]
        const ok = tries.find(([x, t]) => x >= half && x <= right - half && t - L.bh >= 16 && t <= bottom && !hits(x, t, L))
        if (ok) [cx, top] = ok
        // nowhere to go: a secondary label gives way; a hot one stays put
        else if (!L.hot) L.el.style.opacity = 0
      }
      if (L.vis) {
        for (let pass = 0; pass < 6; pass++) {
          const hit = boxes.find((b) => Math.abs(b.cx - cx) < (b.bw + L.bw) / 2 + 4 && top - L.bh < b.top + 2 && b.top - b.bh < top + 2)
          if (!hit) break
          top = hit.top - hit.bh - 3
        }
        boxes.push({ cx, top, bw: L.bw, bh: L.bh })
      }
      L.el.style.left = `${cx}px`
      L.el.style.top = `${top}px`
      L.el.style.setProperty('--dx', `${Math.max(-half + 6, Math.min(half - 6, L.x - cx))}px`)
      L.el.style.setProperty('--dy', `${Math.max(0, L.y - top)}px`)
      // moved below its anchor: the leader runs up from the box instead
      const below = top - L.bh > L.y + 10
      L.el.classList.toggle('below', below)
      if (below) L.el.style.setProperty('--up', `${top - L.bh - (L.y + 10)}px`)
    }
    for (const [id, el] of this.labelEls) {
      if (!seen.has(id)) {
        el.remove()
        this.labelEls.delete(id)
      }
    }
  }

  tip(info, x, y) {
    const el = $('#tip')
    if (!info) {
      el.hidden = true
      return
    }
    el.hidden = false
    const html = `<b>${info.title}</b>${info.sub ? `<span>${info.sub}</span>` : ''}`
    if (html !== this.tipHtml) {
      this.tipHtml = html
      el.innerHTML = html
    }
    const r = el.getBoundingClientRect()
    el.style.left = `${Math.min(window.innerWidth - r.width - 8, x + 14)}px`
    el.style.top = `${Math.min(window.innerHeight - r.height - 8, y + 14)}px`
  }
}

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// The oldest CPU each instruction form exists on — the "time travel" tag.
const ERA = { 8086: '#ffb547', 8087: '#ffb547', 186: '#ffa040', 286: '#ff8a3d', 386: '#4fe08a', 486: '#4fe08a', P5: '#3fd0c0', MMX: '#3fd0c0', P6: '#3fd0c0', AMD64: '#58a6ff', '': '#888' }

// A code line is either a plain string (source shown verbatim) or an object
// {a: address, b: bytes, i: instruction, era, why}.
// NASM uses ';' for comments. In C and in GNU as (AT&T syntax) ';' ends or
// separates statements, and comments are /* */, // or a '#' that isn't a
// preprocessor line.
const codeLang = (code) => code.lang || (/\.nasm\b/i.test(code.src || '') ? 'nasm' : 'c')

function codeLine(l, lang = 'c') {
  if (typeof l === 'string') return `<span class="ln">${fmtCode(l, lang)}</span>`
  const era = l.era ? `<span class="era" style="--e:${ERA[l.era] || '#888'}" title="oldest CPU with this instruction form">${l.era}</span>` : ''
  return `<span class="ln" title="${esc(l.why || '')}">${l.a ? `<span class="ad">${l.a}</span>` : ''}<span class="in">${fmtCode(l.i, lang)}</span>${era}</span>`
}

// Light syntax colouring: comments dimmed.
function fmtCode(line, lang = 'c') {
  const esc = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  if (/^\s*#\s*(include|if|ifdef|ifndef|endif|else|elif|define|undef)\b/.test(esc)) return esc
  // First comment marker outside a string literal.
  let q = null
  for (let i = 0; i < esc.length; i++) {
    const c = esc[i]
    if (q) {
      if (c === '\\') i++
      else if (c === q) q = null
      continue
    }
    if (c === '"' || (c === "'" && lang !== 'nasm')) q = c
    else if (lang === 'nasm' ? c === ';' : c === '#' || (c === '/' && (esc[i + 1] === '*' || esc[i + 1] === '/'))) {
      return `${esc.slice(0, i)}<span class="c">${esc.slice(i)}</span>`
    }
  }
  return esc
}
