import * as THREE from 'three'
import { buildWorld } from './world.js'
import { makeTimeline } from './timeline.js'
import { LABELS } from './script.js'
import { SOURCES, CAVEATS, cite } from './sources.js'
import { makeFigure } from './figures.js'
import { clamp, lerp, smooth } from './util.js'

const $ = id => document.getElementById(id)
const stage = $('stage')
const lowRes = Math.min(innerWidth, innerHeight) < 560

// ---------------------------------------------------------------- renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.localClippingEnabled = true
stage.prepend(renderer.domElement)
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(30, 1, 1, 4000)
const world = buildWorld(scene, lowRes)
const tl = makeTimeline(world.toWorld)

let W = 0, H = 0
function resize() {
  W = stage.clientWidth; H = stage.clientHeight
  if (!W || !H) return
  renderer.setSize(W, H, false)
  camera.aspect = W / H
  // hold the horizontal field of view on tall screens so the subject still fits
  camera.fov = W / H >= 1.35 ? 30 : THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(15)) * 1.35 / (W / H)))
  camera.updateProjectionMatrix()
  $('leaders').setAttribute('viewBox', `0 0 ${W} ${H}`)
}
new ResizeObserver(resize).observe(stage)
resize()

// ---------------------------------------------------------------- labels
const NS = 'http://www.w3.org/2000/svg'
const labels = Object.entries(LABELS).map(([id, [f, p, text, off, kind]]) => {
  const el = document.createElement('div'); el.className = 'label' + (kind ? ' ' + kind : ''); el.textContent = text
  $('labels').appendChild(el)
  const line = document.createElementNS(NS, 'line'), dot = document.createElementNS(NS, 'circle')
  dot.setAttribute('r', 3)
  if (!kind) $('leaders').append(line, dot)
  const pos = f === 'o' ? world.toWorld(p) : new THREE.Vector3(...p)
  return { id, el, line, dot, pos, off, a: 0, w: 0, h: 0 }
})
const v3 = new THREE.Vector3()
function layoutLabels(active, dt) {
  const k = clamp(W / 1280, 0.42, 1.15)
  // things labels must keep clear of: the subtitle box and the figure
  const placed = []
  const sb = stage.getBoundingClientRect()
  for (const id of ['subtext', 'figure', 'gauges']) {
    const r = $(id).getBoundingClientRect()
    if (r.width) placed.push({ x: r.left - sb.left + r.width / 2, y: r.top - sb.top + r.height / 2, w: r.width, h: r.height, fixed: true })
  }
  for (const l of labels) {
    const want = active.has(l.id) ? 1 : 0
    l.a = clamp(l.a + (want ? dt * 2.2 : -dt * 4))
    v3.copy(l.pos).project(camera)
    const show = l.a > 0.01 && v3.z < 1 && Math.abs(v3.x) < 1.15 && Math.abs(v3.y) < 1.15
    l.el.style.opacity = show ? l.a : 0; l.line.style.opacity = l.dot.style.opacity = show ? l.a * 0.9 : 0
    if (!show) continue
    if (!l.w) { l.w = l.el.offsetWidth; l.h = l.el.offsetHeight }
    const ax = (v3.x * 0.5 + 0.5) * W, ay = (-v3.y * 0.5 + 0.5) * H
    let x = clamp(ax + l.off[0] * k, l.w / 2 + 12, W - l.w / 2 - 12), y = clamp(ay + l.off[1] * k, l.h / 2 + 70, H - l.h / 2 - 20)
    for (let pass = 0; pass < 6; pass++) for (const o of placed) { // nudge apart
      if (Math.abs(x - o.x) < (l.w + o.w) / 2 + 6 && Math.abs(y - o.y) < (l.h + o.h) / 2 + 4) y = o.y + (o.fixed ? (o.y > H / 2 ? -1 : 1) : y >= o.y ? 1 : -1) * ((l.h + o.h) / 2 + 6)
    }
    y = clamp(y, l.h / 2 + 70, H - l.h / 2 - 12)
    placed.push({ x, y, w: l.w, h: l.h })
    l.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    l.line.setAttribute('x1', ax); l.line.setAttribute('y1', ay); l.line.setAttribute('x2', x); l.line.setAttribute('y2', y)
    l.dot.setAttribute('cx', ax); l.dot.setAttribute('cy', ay)
  }
}
addEventListener('resize', () => { for (const l of labels) l.w = 0 })

// ---------------------------------------------------------------- transport
let t = 0, playing = false, rate = 1, subsOn = true
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const look = { yaw: 0, pitch: 0, zoom: 1 }
const setPlaying = p => {
  playing = p
  $('play').textContent = p ? '❚❚' : '▶'
  $('hint').hidden = p || t <= 0.01
}
$('play').addEventListener('click', () => { if (t >= tl.total - 0.05) t = 0; setPlaying(!playing) })
const seek = (x, keepPlaying, fromScrub) => {
  t = clamp(x, 0, tl.total); look.yaw = look.pitch = 0; look.zoom = 1
  if (!fromScrub) $('scrub').value = Math.round(t / tl.total * 1000)
  if (!keepPlaying) setPlaying(false)
}
$('prev').addEventListener('click', () => { const c = tl.cueAt(t); seek((t - c.start > 2 ? c : tl.cues[Math.max(0, c.i - 1)]).start, playing) })
$('next').addEventListener('click', () => { const c = tl.cueAt(t); seek(tl.cues[Math.min(tl.cues.length - 1, c.i + 1)].start, playing) })
$('scrub').addEventListener('input', () => seek($('scrub').value / 1000 * tl.total, false, true))
const RATES = [1, 1.5, 2, 0.5]
$('speed').addEventListener('click', () => { rate = RATES[(RATES.indexOf(rate) + 1) % RATES.length]; $('speed').textContent = rate + '×' })
$('cc').addEventListener('click', () => { subsOn = !subsOn; $('cc').setAttribute('aria-pressed', subsOn); $('subs').hidden = !subsOn })
addEventListener('keydown', e => {
  if (e.target.closest('input, button, a')) return
  if (e.code === 'Space') { e.preventDefault(); $('play').click() }
  if (e.code === 'ArrowRight') $('next').click()
  if (e.code === 'ArrowLeft') $('prev').click()
})
// chapter marks on the timeline
for (const c of tl.cues) if (c.first) {
  const b = document.createElement('button')
  b.style.left = (c.start / tl.total * 100) + '%'; b.title = c.chapter; b.setAttribute('aria-label', 'Chapter: ' + c.chapter)
  b.addEventListener('click', () => seek(c.start, playing))
  $('ticks').appendChild(b)
}

// look around while paused
let drag = null
renderer.domElement.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY }; renderer.domElement.setPointerCapture(e.pointerId) })
renderer.domElement.addEventListener('pointermove', e => {
  if (!drag) return
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y
  if (playing && Math.hypot(dx, dy) > 6) setPlaying(false)
  if (!playing) { look.yaw = clamp(look.yaw - dx * 0.005, -1.4, 1.4); look.pitch = clamp(look.pitch + dy * 0.005, -1, 1); drag = { x: e.clientX, y: e.clientY } }
})
renderer.domElement.addEventListener('pointerup', () => { drag = null })
renderer.domElement.addEventListener('wheel', e => { e.preventDefault(); setPlaying(false); look.zoom = clamp(look.zoom * Math.exp(e.deltaY * 0.0012), 0.25, 4) }, { passive: false })

// ---------------------------------------------------------------- notes drawer
$('tab-transcript').innerHTML = tl.cues.map(c => `${c.first ? `<h3>${c.chapterIndex + 1}. ${c.chapter}</h3>` : ''}<p data-cue="${c.i}"><button class="go" aria-label="Play from here">${fmt(c.start)}</button>${cite(c.text)}</p>`).join('')
$('srclist').innerHTML = SOURCES.map(s => `<li id="src-${s.id}">${s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>` : `<b>${s.title}</b>`}
  <span class="read ${s.read}">${{ full: 'Read in full', summary: 'Search summary only — not yet read', none: 'Not checked against a source' }[s.read]}</span><p>${s.took}</p></li>`).join('')
$('caveats').innerHTML = CAVEATS.map(c => `<li>${c}</li>`).join('')
const showTab = name => {
  for (const b of document.querySelectorAll('[role=tab]')) b.setAttribute('aria-selected', b.dataset.tab === name)
  for (const d of document.querySelectorAll('.tab')) d.hidden = d.id !== 'tab-' + name
}
const openNotes = (tab, srcId) => {
  $('notes').hidden = false; showTab(tab)
  for (const li of $('srclist').children) li.classList.toggle('hit', li.id === 'src-' + srcId)
  if (srcId) $('src-' + srcId).scrollIntoView({ block: 'center' })
}
document.querySelectorAll('[role=tab]').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)))
$('open-notes').addEventListener('click', () => openNotes('transcript'))
$('close-notes').addEventListener('click', () => { $('notes').hidden = true })
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-src]')
  if (a) { e.preventDefault(); setPlaying(false); openNotes('sources', a.dataset.src); return }
  const go = e.target.closest('button.go')
  if (go) { seek(tl.cues[+go.parentElement.dataset.cue].start, false); setPlaying(true) }
})

// ---------------------------------------------------------------- frame loop
const figure = makeFigure($('figure'))
const cam = { at: new THREE.Vector3(), dir: new THREE.Vector3(), dist: 1 }
const right = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0)
const DAY = new THREE.Color(0x0c1017), NIGHT = new THREE.Color(0x060a1e), bg = new THREE.Color()
const UNITS = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005]
let shownCue = -1, last = performance.now(), ready = false

function frame(now) {
  // the first frame's timestamp can precede `last`, so never let time run backwards
  const dt = clamp((now - last) / 1000, 0, 0.1); last = now
  if (playing) {
    t += dt * rate
    look.yaw *= 0.9; look.pitch *= 0.9; look.zoom = lerp(look.zoom, 1, 0.1)
    if (t >= tl.total) { t = tl.total; setPlaying(false) }
  }
  const s = tl.state(t), cue = tl.cueAt(t)

  // camera: the scripted shot, plus whatever the viewer has dragged
  tl.camera(t, cam)
  right.crossVectors(up, cam.dir).normalize()
  cam.dir.applyAxisAngle(up, look.yaw).applyAxisAngle(right, -look.pitch).normalize()
  const dist = cam.dist * look.zoom
  camera.position.copy(cam.at).addScaledVector(cam.dir, dist)
  camera.lookAt(cam.at)
  camera.near = dist * 0.02; camera.far = dist * 40 + 900
  camera.updateProjectionMatrix(); camera.updateMatrixWorld()

  renderer.setClearColor(bg.copy(DAY).lerp(NIGHT, s.night))
  const mmPerPx = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / H, span = mmPerPx * H
  world.update(s, playing ? dt * rate : dt * 0.35, camera, span)
  renderer.render(scene, camera)

  // subtitles and chapter
  if (cue.i !== shownCue) {
    shownCue = cue.i
    $('subtext').innerHTML = cite(cue.text)
    $('chapter').textContent = `${cue.chapterIndex + 1} · ${cue.chapter}`
    for (const p of $('tab-transcript').querySelectorAll('p')) p.classList.toggle('now', +p.dataset.cue === cue.i)
  }
  const settled = t - cue.start > cue.move * 0.55 || cue.i === 0
  layoutLabels(new Set(settled ? cue.labels : cue.labels.filter(id => tl.cues[Math.max(0, cue.i - 1)].labels.includes(id))), dt)

  // scale bar and place name
  const unit = UNITS.find(u => u / mmPerPx <= 150) ?? 0.005
  $('scalebar').style.width = unit / mmPerPx + 'px'
  $('scaletext').textContent = unit >= 10 ? unit / 10 + ' cm' : unit >= 1 ? unit + ' mm' : unit * 1000 + ' µm'
  $('crumb').textContent = span > 220 ? 'Head' : span > 45 ? 'Eye socket' : span > 9 ? 'Eye' : span > 0.5 ? 'Optic nerve head' : 'Capillary bed'

  // gauges and figure
  $('gauges').hidden = s.hud < 0.5
  $('g-pp').style.width = lerp(100, 45, smooth(1, 0.5, s.flowAll)) + '%'
  $('g-flow').style.width = s.flow * 100 + '%'
  $('g-swell').style.width = s.swelling * 100 + '%'
  $('g-work').style.width = (1 - s.damage) * 100 + '%'
  figure.update(cue.fig, s)
  document.body.classList.toggle('night', s.night > 0.5)

  if (playing) $('scrub').value = Math.round(t / tl.total * 1000)
  $('clock').textContent = `${fmt(t)} / ${fmt(tl.total)}`
  if (!ready) { ready = true; $('loading').hidden = true; document.body.classList.add('ready') }
  requestAnimationFrame(frame)
}
setPlaying(false)
requestAnimationFrame(frame)
// for automated screenshots
window.__aion = { seek: x => seek(x), cueStart: i => tl.cues[i].start, cues: tl.cues.length, total: tl.total, play: () => setPlaying(true) }
