// The interface: a guided tour from mountain to sea, free exploration with
// markers and an ahupuaʻa inspector, map layers, and the sky/weather dock.
// Words are kept for the explainer cards; everything else is icons, colour
// and the island itself.

import * as THREE from 'three'
import { STOPS, WEATHER_TEXT, SEASON_TEXT } from './content.js'
import { icon } from './icons.js'
import { buildViews } from './views.js'
import { ZONES, MOKU } from '../gen/division.js'
import { ZONE_COLORS } from '../app.js'
import { MOON_NIGHTS } from '../render/sky.js'
import { HYDRO_RES, WORLD, HALF } from '../config.js'

const $ = (sel, root = document) => root.querySelector(sel)
const h = (tag, attrs = {}, html = '') => {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else el.setAttribute(k, v)
  }
  if (html) el.innerHTML = html
  return el
}
const fmtTime = (hr) => {
  const H = Math.floor(hr)
  const M = Math.floor((hr - H) * 60)
  return `${H}:${String(M).padStart(2, '0')}`
}
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export class UI {
  constructor(app) {
    this.app = app
    this.meta = app.island.meta
    const built = buildViews(app)
    this.views = built.views
    this.anchors = built.anchors
    this.model = built.model
    this.stops = STOPS.filter((s) => this.views[s.id])
    this.mode = 'tour'
    this.index = -1
    this.playing = false
    this.arrivedAt = 0
    this.overlayGoal = new THREE.Vector4(0, 0, 0, 0)
    this.focusGoal = 0
    this.layer = { lines: false, zones: false, pins: true }
    this.timeTween = null
    this.counts = this.countFeatures()
    this.build()
    this.bind()
    app.updaters.push((dt) => this.update(dt))
  }

  countFeatures() {
    const s = this.meta.sites
    const c = {}
    const add = (id, k, n = 1) => {
      c[id] = c[id] || { loi: 0, hale: 0, heiau: 0, loko: 0, koa: 0 }
      c[id][k] += n
    }
    for (const l of s.loi) add(l.id, 'loi', l.paddies.length)
    for (const v of s.houses) add(v.village, 'hale')
    for (const x of s.heiau) add(x.id, 'heiau')
    for (const p of s.ponds) add(p.id, 'loko')
    for (const k of s.koa) add(k.id, 'koa')
    return c
  }

  // --- DOM ----------------------------------------------------------------------
  build() {
    const root = h('div', { id: 'ui' })
    document.body.appendChild(root)
    this.root = root

    root.appendChild(h('div', { class: 'brand' }, `<div class="brand-name">Ahupuaʻa</div><div class="brand-sub">${icon('akua', 14)}<span></span>${icon('loko', 14)}</div>`))

    this.modeEl = h('div', { class: 'modes' })
    this.modeEl.append(
      h('button', { class: 'mode on', 'data-mode': 'tour', title: 'Guided tour', 'aria-label': 'Guided tour' }, `${icon('tour', 18)}<span>Tour</span>`),
      h('button', { class: 'mode', 'data-mode': 'explore', title: 'Explore freely', 'aria-label': 'Explore freely' }, `${icon('explore', 18)}<span>Explore</span>`),
    )
    root.appendChild(this.modeEl)

    // layers & tools
    this.tools = h('div', { class: 'tools' })
    const tool = (id, ic, label) => h('button', { class: 'tool', 'data-tool': id, title: label, 'aria-label': label }, icon(ic, 20))
    this.tools.append(tool('lines', 'lines', 'Ahupuaʻa boundaries'), tool('zones', 'zones', 'Zones, mountain to sea'), tool('pins', 'pins', 'Places'), tool('help', 'help', 'About'), tool('full', 'expand', 'Full screen'))
    root.appendChild(this.tools)

    // zone legend
    this.legend = h('div', { class: 'legend' })
    ZONES.forEach((z, i) => this.legend.appendChild(h('div', { class: 'lg' }, `<i style="background:${ZONE_COLORS[i]}"></i><b>${z.name}</b><em>${z.gloss}</em>`)))
    root.appendChild(this.legend)

    // explainer card
    this.card = h('section', { class: 'card', 'aria-live': 'polite' })
    root.appendChild(this.card)

    // tour rail
    this.rail = h('nav', { class: 'rail', 'aria-label': 'Tour stops' })
    this.playBtn = h('button', { class: 'play', title: 'Play the tour', 'aria-label': 'Play the tour' }, icon('play', 18))
    this.rail.appendChild(this.playBtn)
    this.dots = this.stops.map((s, i) => {
      const b = h('button', { class: 'dot', title: s.title, 'aria-label': s.title, 'data-i': i }, icon(s.icon, 18))
      this.rail.appendChild(b)
      return b
    })
    this.progress = h('div', { class: 'rail-progress' }, '<span></span>')
    this.rail.appendChild(this.progress)
    root.appendChild(this.rail)

    // markers
    this.markerLayer = h('div', { class: 'markers' })
    root.appendChild(this.markerLayer)
    this.markers = this.stops
      .filter((s) => this.anchors[s.id])
      .map((s) => {
        const b = h('button', { class: 'marker', title: s.title, 'aria-label': s.title }, `${icon(s.icon, 18)}<span>${s.title}</span>`)
        b.addEventListener('click', (e) => {
          e.stopPropagation()
          this.openStop(this.stops.indexOf(s), { fly: true, explore: true })
        })
        this.markerLayer.appendChild(b)
        const [x, z] = this.anchors[s.id]
        return { el: b, stop: s, pos: new THREE.Vector3(x, 0, z), vis: 0 }
      })
    for (const m of this.markers) m.pos.y = Math.max(0, this.app.terrain.heightAt(m.pos.x, m.pos.z)) + 0.05

    // hover / inspector card
    this.inspector = h('div', { class: 'inspector' })
    root.appendChild(this.inspector)

    // sky & weather dock
    this.dock = h('div', { class: 'dock' })
    this.dock.innerHTML = `
      <div class="dial" title="Drag to change the time of day">
        <svg viewBox="0 0 120 64" class="dial-svg">
          <path class="dial-arc" d="M8 58 A52 52 0 0 1 112 58"/>
          <line class="dial-horizon" x1="2" y1="58" x2="118" y2="58"/>
          <g class="dial-body"><circle r="7" class="dial-sun"/></g>
        </svg>
        <div class="dial-time"></div>
        <div class="dial-night"></div>
      </div>
      <div class="dock-row regimes"></div>
      <div class="dock-row seasons"></div>
      <div class="dock-row speeds"></div>
      <div class="wind" title="Wind"><span class="wind-arrow">${icon('wind', 22)}</span><span class="wind-speed"></span></div>`
    root.appendChild(this.dock)
    const reg = $('.regimes', this.dock)
    for (const k of ['auto', 'moae', 'kona', 'malie']) {
      reg.appendChild(h('button', { class: 'chip', 'data-regime': k, title: `${WEATHER_TEXT[k].name} — ${WEATHER_TEXT[k].gloss}`, 'aria-label': WEATHER_TEXT[k].name }, icon(k, 18)))
    }
    const sea = $('.seasons', this.dock)
    for (const k of ['kau', 'hooilo']) sea.appendChild(h('button', { class: 'chip', 'data-season': k, title: `${SEASON_TEXT[k].name} — ${SEASON_TEXT[k].gloss}`, 'aria-label': SEASON_TEXT[k].name }, icon(k, 18)))
    const spd = $('.speeds', this.dock)
    for (const [k, v, ic] of [['0', 0, 'pause'], ['1', 30, 'speed1'], ['2', 240, 'speed2'], ['3', 1800, 'speed3']]) {
      spd.appendChild(h('button', { class: 'chip', 'data-speed': v, title: v ? `${v}× time` : 'Pause time', 'aria-label': v ? `${v} times speed` : 'Pause' }, icon(ic, 16)))
      void k
    }

    // help
    this.help = h('div', { class: 'help hidden' })
    this.help.innerHTML = `
      <div class="help-card">
        <button class="help-close" aria-label="Close">${icon('close', 18)}</button>
        <h2>Ahupuaʻa</h2>
        <p>A composite Hawaiian high island, generated here in your browser: shaped by two volcanoes, carved by rain falling where the trade winds drop it, and divided into ahupuaʻa along its own watersheds.</p>
        <p>The weather is simulated: trade winds lift moist air over the mountains into cloud and rain; afternoon sun builds cumulus over the slopes; rainbows appear where sunlit rain sits opposite the sun.</p>
        <div class="help-keys">
          <span><b>Drag</b> turn</span><span><b>Right-drag / Shift</b> pan</span><span><b>Scroll / pinch</b> zoom</span><span><b>Double-click</b> fly there</span><span><b>← →</b> tour</span>
        </div>
      </div>`
    root.appendChild(this.help)
  }

  bind() {
    this.modeEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-mode]')
      if (b) this.setMode(b.dataset.mode)
    })
    this.tools.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tool]')
      if (!b) return
      const t = b.dataset.tool
      if (t === 'help') this.help.classList.toggle('hidden')
      else if (t === 'full') {
        if (document.fullscreenElement) document.exitFullscreen?.()
        else document.documentElement.requestFullscreen?.().catch(() => {})
      } else {
        this.layer[t] = !this.layer[t]
        this.applyLayers()
      }
    })
    this.help.addEventListener('click', (e) => {
      if (e.target === this.help || e.target.closest('.help-close')) this.help.classList.add('hidden')
    })
    this.rail.addEventListener('click', (e) => {
      const d = e.target.closest('.dot')
      if (d) {
        this.setMode('tour', false)
        this.goto(Number(d.dataset.i))
      }
    })
    this.playBtn.addEventListener('click', () => this.setPlaying(!this.playing))
    this.dock.addEventListener('click', (e) => {
      const r = e.target.closest('[data-regime]')
      const se = e.target.closest('[data-season]')
      const sp = e.target.closest('[data-speed]')
      if (r) this.app.weather.setMode(r.dataset.regime)
      if (se) this.setSeason(se.dataset.season)
      if (sp) this.app.clock.speed = Number(sp.dataset.speed)
      this.refreshDock()
    })
    // drag the sun across the dial
    const dial = $('.dial-svg', this.dock)
    let dragging = false
    const setFromEvent = (e) => {
      const r = dial.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 120
      const y = ((e.clientY - r.top) / r.height) * 64
      let a = Math.atan2(58 - y, x - 60) // 0 = east (right), π = west (left)
      if (a < 0) a = a < -Math.PI / 2 ? Math.PI : 0
      // map the arc (π → 0) to 6:00 → 18:00
      const hour = 6 + ((Math.PI - a) / Math.PI) * 12
      this.timeTween = null
      this.app.clock.hour = hour
    }
    dial.addEventListener('pointerdown', (e) => {
      dragging = true
      dial.setPointerCapture(e.pointerId)
      setFromEvent(e)
    })
    dial.addEventListener('pointermove', (e) => dragging && setFromEvent(e))
    dial.addEventListener('pointerup', () => (dragging = false))
    // hover and pick on the island
    const canvas = this.app.canvas
    let down = null
    canvas.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY, t: performance.now() }))
    canvas.addEventListener('pointerup', (e) => {
      if (!down) return
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y)
      if (moved < 5 && performance.now() - down.t < 400) this.pick(e.clientX, e.clientY)
      down = null
    })
    let lastHover = 0
    canvas.addEventListener('pointermove', (e) => {
      if (e.buttons || e.pointerType === 'touch') return
      const now = performance.now()
      if (now - lastHover < 60) return
      lastHover = now
      this.hover(e.clientX, e.clientY)
    })
    canvas.addEventListener('pointerleave', () => this.hover(null))
    addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && !e.shiftKey && this.mode === 'tour') {
        e.preventDefault()
        this.goto(this.index + 1)
      } else if (e.key === 'ArrowLeft' && !e.shiftKey && this.mode === 'tour') {
        e.preventDefault()
        this.goto(this.index - 1)
      } else if (e.key === 'Escape') {
        if (!this.help.classList.contains('hidden')) this.help.classList.add('hidden')
        else this.closeCard()
      } else if (e.key === ' ' && this.mode === 'tour' && e.target === document.body) {
        e.preventDefault()
        this.setPlaying(!this.playing)
      }
    })
    // any real camera input pauses autoplay
    this.app.rig.onUserInput = () => {
      if (this.playing) this.setPlaying(false)
    }
  }

  // --- modes -------------------------------------------------------------------------
  setMode(mode, go = true) {
    if (this.mode === mode && go) {
      if (mode === 'tour' && this.index < 0) this.goto(0)
      return
    }
    this.mode = mode
    for (const b of this.modeEl.querySelectorAll('.mode')) b.classList.toggle('on', b.dataset.mode === mode)
    this.root.classList.toggle('exploring', mode === 'explore')
    if (mode === 'explore') {
      this.setPlaying(false)
      this.closeCard()
      this.focusGoal = 0
      this.app.rig.autoOrbit = 0
      this.app.clock.speed = Math.max(this.app.clock.speed, 30)
      this.applyLayers()
    } else if (go) {
      this.goto(Math.max(0, this.index))
    }
  }

  applyLayers() {
    for (const b of this.tools.querySelectorAll('[data-tool]')) {
      const t = b.dataset.tool
      if (t in this.layer) b.classList.toggle('on', this.layer[t])
    }
    this.legend.classList.toggle('show', this.layer.zones)
    this.markerLayer.classList.toggle('hidden', !this.layer.pins || this.mode !== 'explore')
    if (this.mode === 'explore') {
      this.overlayGoal.set(this.layer.lines ? 1 : 0, this.layer.zones ? 1 : 0, this.layer.lines ? 0.5 : 0, this.layer.lines ? 0.8 : 0.35)
    }
  }

  setSeason(k) {
    const c = this.app.clock
    c.doy = k === 'kau' ? 172 : 355
    this.app.season = k
    this.refreshDock()
  }

  setPlaying(p) {
    this.playing = p
    this.playBtn.innerHTML = icon(p ? 'pause' : 'play', 18)
    this.playBtn.classList.toggle('on', p)
    if (p && this.mode !== 'tour') this.setMode('tour')
    if (p) this.arrivedAt = performance.now()
  }

  // --- tour ------------------------------------------------------------------------------
  goto(i) {
    if (i < 0 || i >= this.stops.length) {
      if (i >= this.stops.length) this.setPlaying(false)
      return
    }
    this.openStop(i, { fly: true, explore: false })
  }

  openStop(i, { fly, explore }) {
    this.index = i
    const stop = this.stops[i]
    const v = this.views[stop.id]
    this.dots.forEach((d, k) => {
      d.classList.toggle('on', k === i)
      d.classList.toggle('done', k < i)
    })
    this.renderCard(stop, explore)
    if (!v) return
    const rig = this.app.rig
    const far = rig.goal.target.distanceTo(v.target)
    const duration = Math.min(6, 2.2 + Math.sqrt(far) * 0.22 + Math.abs(Math.log(v.distance / rig.goal.distance)) * 0.35)
    // a portrait screen sees less across, so stand further back
    const aspect = innerWidth / Math.max(1, innerHeight)
    const dist = v.distance * (aspect < 1 ? Math.pow(1 / aspect, v.distance > 40 ? 1 : 0.5) : 1)
    if (fly) rig.flyTo({ target: v.target, distance: dist, yaw: v.yaw, pitch: v.pitch, lift: v.lookUp || 0 }, duration, { onDone: () => (this.arrivedAt = performance.now()) })
    this.arrivedAt = performance.now() + duration * 1000
    rig.autoOrbit = v.distance < 60 ? 0.012 : 0.02
    // the scene settles into the stop's light and weather while we fly
    const c = this.app.clock
    if (v.doy !== undefined && Math.abs(v.doy - c.doy) > 2) c.doy = v.doy
    else if (v.doy === undefined && this.lastDoy !== undefined && c.doy !== this.lastDoy) c.doy = this.lastDoy
    if (v.doy === undefined) this.lastDoy = c.doy
    if (v.hour !== undefined) {
      let dh = v.hour - c.hour
      if (dh < -12) dh += 24
      if (dh > 12) dh -= 24
      this.timeTween = { from: c.hour, by: dh, t: 0, dur: duration }
    }
    c.speed = 20
    if (v.weather) this.app.weather.setMode(v.weather)
    this.app.weather.boost = v.boost ? 1 : 0
    if (v.showers) for (const [x, z] of v.showers) this.app.weather.spawnShower(x, z, 5 + Math.random() * 3, 0.7)
    // the procession reaches the ahu as we arrive
    if (v.ahu && this.app.life) this.app.life.walkTo(v.ahu.x, v.ahu.z)
    if (!explore) {
      const o = v.overlay || [0, 0, 0, 0]
      this.overlayGoal.set(o[0], o[1], o[2], o[3])
      this.focusGoal = v.focus || 0
    }
  }

  renderCard(stop, explore) {
    const zone = stop.zone !== undefined && stop.zone !== null ? ZONES[stop.zone] : null
    const n = this.stops.length
    this.card.innerHTML = `
      <header>
        <div class="card-icon">${icon(stop.icon, 26)}</div>
        <div class="card-titles"><h1>${stop.title}</h1><p class="gloss">${stop.gloss}</p></div>
        <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
      </header>
      ${zone ? `<div class="zone-chip"><i style="background:${ZONE_COLORS[stop.zone]}"></i>${zone.name}<em>${zone.gloss}</em></div>` : ''}
      <div class="card-body">${stop.text.map((t) => `<p>${t}</p>`).join('')}</div>
      ${explore ? '' : `<footer>
        <button class="nav prev" aria-label="Previous" ${this.index === 0 ? 'disabled' : ''}>${icon('prev', 18)}</button>
        <span class="count">${this.index + 1} / ${n}</span>
        ${this.index === n - 1 ? `<button class="nav finish" aria-label="Explore">${icon('explore', 18)}<span>Explore</span></button>` : `<button class="nav next" aria-label="Next">${icon('next', 18)}</button>`}
      </footer>`}`
    this.card.classList.add('show')
    this.card.scrollTop = 0
    $('.prev', this.card)?.addEventListener('click', () => this.goto(this.index - 1))
    $('.next', this.card)?.addEventListener('click', () => this.goto(this.index + 1))
    $('.finish', this.card)?.addEventListener('click', () => this.setMode('explore'))
    $('.card-close', this.card)?.addEventListener('click', () => this.closeCard())
  }

  closeCard() {
    this.card.classList.remove('show')
  }

  // --- explore: hover and pick ---------------------------------------------------------------
  regionAt(x, z) {
    const reg = this.app.island.data.region
    const N = HYDRO_RES
    const i = Math.floor(((x + HALF) / WORLD) * N)
    const j = Math.floor(((z + HALF) / WORLD) * N)
    if (i < 0 || j < 0 || i >= N || j >= N) return 0
    return reg[(j * N + i) * 4]
  }

  hover(cx, cy) {
    if (cx === null || this.mode !== 'explore') {
      this.app.shared.uniforms.uHover.value = 0
      if (!this.pinned) this.inspector.classList.remove('show')
      return
    }
    const p = this.app.rig.pickGround(cx, cy)
    const id = p ? this.regionAt(p.x, p.z) : 0
    this.app.shared.uniforms.uHover.value = id
    if (this.pinned) return
    if (!id) {
      this.inspector.classList.remove('show')
      return
    }
    this.showInspector(id, cx, cy)
  }

  pick(cx, cy) {
    if (this.mode !== 'explore') return
    const p = this.app.rig.pickGround(cx, cy)
    const id = p ? this.regionAt(p.x, p.z) : 0
    if (!id || id === this.focusGoal) {
      this.focusGoal = 0
      this.pinned = false
      this.inspector.classList.remove('show', 'pinned')
      return
    }
    this.focusGoal = id
    this.pinned = true
    this.showInspector(id, cx, cy, true)
  }

  showInspector(id, cx, cy, pinned = false) {
    const a = this.meta.ahupuaa.find((q) => q.id === id)
    if (!a) return
    if (this.inspectorId !== id) {
      this.inspectorId = id
      const m = MOKU[a.moku]
      const c = this.counts[id] || {}
      const stat = (ic, n) => (n ? `<span class="st">${icon(ic, 15)}${n}</span>` : '')
      this.inspector.innerHTML = `
        <div class="in-head"><b>Ahupuaʻa</b><span class="in-moku"><i style="background:var(--moku${a.moku + 1})"></i>${m.name}<em>${m.gloss}</em></span></div>
        ${profileSVG(a.profile)}
        <div class="in-stats"><span class="st">${a.area.toFixed(1)} km²</span><span class="st">${icon('akua', 15)}${Math.round(a.top)} m</span>${stat('loi', c.loi)}${stat('kauhale', c.hale)}${stat('heiau', c.heiau)}${stat('loko', c.loko)}${stat('koa', c.koa)}</div>`
    }
    this.inspector.classList.add('show')
    this.inspector.classList.toggle('pinned', pinned)
    const W = innerWidth
    const x = Math.min(W - 300, cx + 18)
    const y = Math.max(70, Math.min(innerHeight - 220, cy + 18))
    this.inspector.style.transform = `translate(${x}px, ${y}px)`
  }

  // --- per frame -------------------------------------------------------------------------
  update(dt) {
    const app = this.app
    const u = app.shared.uniforms
    // overlay & focus easing
    const k = 1 - Math.exp(-dt * 3)
    app.overlay.lerp(this.overlayGoal, k)
    if (this.focusGoal) {
      u.uFocus.value = this.focusGoal
      u.uFocusK.value += (1 - u.uFocusK.value) * k
    } else {
      u.uFocusK.value += (0 - u.uFocusK.value) * k
      if (u.uFocusK.value < 0.01) u.uFocus.value = 0
    }
    // time-of-day tween during flights
    if (this.timeTween) {
      const t = this.timeTween
      t.t = Math.min(1, t.t + dt / t.dur)
      app.clock.hour = (((t.from + t.by * easeInOut(t.t)) % 24) + 24) % 24
      if (t.t >= 1) this.timeTween = null
    }
    // autoplay
    if (this.playing && this.mode === 'tour' && !app.rig.flight) {
      const stop = this.stops[this.index]
      const words = stop.text.join(' ').split(/\s+/).length
      const hold = Math.max(9, words * 0.32) * 1000
      const el = performance.now() - this.arrivedAt
      $('span', this.progress).style.width = `${Math.min(100, (el / hold) * 100)}%`
      if (el > hold) {
        if (this.index < this.stops.length - 1) this.goto(this.index + 1)
        else this.setPlaying(false)
      }
    } else {
      $('span', this.progress).style.width = '0%'
    }
    this.updateMarkers()
    this.frameN = (this.frameN || 0) + 1
    if (this.frameN % 6 === 0) this.refreshDock()
  }

  updateMarkers() {
    if (this.mode !== 'explore' || !this.layer.pins) return
    const cam = this.app.camera
    const W = innerWidth
    const H = innerHeight
    const v = new THREE.Vector3()
    const placed = []
    // nearest first, so a close marker wins over a far one it overlaps
    const order = this.markers
      .map((m) => ({ m, d: cam.position.distanceTo(m.pos) }))
      .sort((a, b) => a.d - b.d)
    for (const { m, d } of order) {
      v.copy(m.pos).project(cam)
      const behind = v.z > 1
      const sx = ((v.x + 1) / 2) * W
      const sy = ((1 - v.y) / 2) * H
      let show = !behind && sx > -40 && sx < W + 40 && sy > 60 && sy < H + 40 && d < 420
      // declutter: one marker per ~44 px; the rest wait until you zoom in
      if (show && placed.some((p) => Math.abs(p[0] - sx) < 44 && Math.abs(p[1] - sy) < 40)) show = false
      if (show) placed.push([sx, sy])
      m.el.style.opacity = show ? String(Math.min(1, (420 - d) / 120)) : '0'
      m.el.style.pointerEvents = show ? 'auto' : 'none'
      if (show) m.el.style.transform = `translate(${sx}px, ${sy}px)`
      m.el.classList.toggle('near', d < 40)
    }
  }

  refreshDock() {
    const app = this.app
    const c = app.clock
    const L = app.light
    // sun or moon on the arc
    const body = $('.dial-body', this.dock)
    const dayFrac = (c.hour - 6) / 12
    const night = c.hour < 6 || c.hour > 18
    let ang
    if (!night) ang = Math.PI - dayFrac * Math.PI
    else {
      const nf = ((c.hour - 18 + 24) % 24) / 12
      ang = Math.PI - nf * Math.PI
    }
    const x = 60 + Math.cos(ang) * 52
    const y = 58 - Math.sin(ang) * 52
    body.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
    body.classList.toggle('moon', night)
    $('.dial-time', this.dock).textContent = fmtTime(c.hour)
    const nightName = MOON_NIGHTS[app.sky.astro.night] || ''
    const nightEl = $('.dial-night', this.dock)
    nightEl.textContent = L.night > 0.5 ? `Pō ${nightName}` : ''
    nightEl.title = 'The night of the Hawaiian lunar month'
    for (const b of this.dock.querySelectorAll('[data-regime]')) b.classList.toggle('on', app.weather.mode === b.dataset.regime)
    const season = c.doy > 120 && c.doy < 305 ? 'kau' : 'hooilo'
    app.season = season
    for (const b of this.dock.querySelectorAll('[data-season]')) b.classList.toggle('on', season === b.dataset.season)
    for (const b of this.dock.querySelectorAll('[data-speed]')) b.classList.toggle('on', Number(b.dataset.speed) === c.speed || (c.speed === 20 && b.dataset.speed === '30'))
    const w = app.weather.wind
    const deg = (Math.atan2(w.x, -w.y) * 180) / Math.PI
    $('.wind-arrow', this.dock).style.transform = `rotate(${deg.toFixed(0)}deg)`
    $('.wind-speed', this.dock).textContent = `${Math.round(w.length() * 3.6)} km/h`
    const rname = WEATHER_TEXT[app.weather.regime]
    $('.wind', this.dock).title = `${rname.name} — ${rname.gloss}`
  }

  start() {
    this.setMode('tour', false)
    this.applyLayers()
    this.goto(0)
  }
}

/** A little mountain-to-sea cross-section, coloured by zone. */
function profileSVG(prof) {
  if (!prof || prof.length < 2) return ''
  const W = 260
  const H = 78
  const maxD = prof[prof.length - 1][0]
  const maxH = Math.max(...prof.map((p) => p[1]), 200)
  const minH = Math.min(...prof.map((p) => p[1]), -30)
  const sy = (H - 14) / (maxH - minH)
  const X = (d) => W - (d / maxD) * (W - 4) - 2 // sea on the right, mountain on the left
  const Y = (v) => H - 6 - (v - minH) * sy
  const sea = Y(0)
  let segs = ''
  for (let i = 0; i < prof.length - 1; i++) {
    const a = prof[i]
    const b = prof[i + 1]
    segs += `<path d="M${X(a[0]).toFixed(1)} ${sea.toFixed(1)}L${X(a[0]).toFixed(1)} ${Y(a[1]).toFixed(1)}L${X(b[0]).toFixed(1)} ${Y(b[1]).toFixed(1)}L${X(b[0]).toFixed(1)} ${sea.toFixed(1)}Z" fill="${ZONE_COLORS[a[2]]}" stroke="${ZONE_COLORS[a[2]]}" stroke-width=".6"/>`
  }
  const line = prof.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)} ${Y(p[1]).toFixed(1)}`).join('')
  return `<svg class="profile" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <rect x="0" y="${sea.toFixed(1)}" width="${W}" height="${(H - sea).toFixed(1)}" fill="rgba(60,120,190,0.35)"/>
    ${segs}
    <path d="${line}" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="1.2"/>
    <line x1="0" x2="${W}" y1="${sea.toFixed(1)}" y2="${sea.toFixed(1)}" stroke="rgba(255,255,255,0.4)" stroke-width=".8"/>
  </svg>
  <div class="profile-ends"><span>mauka</span><span>makai</span></div>`
}
