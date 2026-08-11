// main.js — SloshOS boot. A Frutiger Aero toy desktop, but weird:
// windows are irregular blobs of frosted glass whose hollow frames are
// liquid-filled moats (glitter, mini ducks) that slosh when you drag them.
// Notifications are lava-lamp globules. Everything is jelly.

import {
  SloshSim, drawLiquid, Duck, Glitter, Bubbles,
  tubePath, sampleQuadratic, sampleCubic,
} from './vessel.js'
import { AMP, KEYGEN, FILES, DONUT, bandPath } from './shapes.js'
import { HydroClock } from './ring.js'
import { toast, stepToasts } from './toasts.js'

const DPR = Math.min(2, window.devicePixelRatio || 1)
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// phones get the whole desktop scaled down instead of a pile-up
const uiScale = () => clamp(innerWidth / 840, 0.48, 1)

function fitCanvas(canvas, w, h) {
  canvas.width = Math.round(w * DPR)
  canvas.height = Math.round(h * DPR)
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  const ctx = canvas.getContext('2d')
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
  return ctx
}

// ---------------------------------------------------------------------------
// Weird-window manager
// ---------------------------------------------------------------------------

const desktop = document.getElementById('desktop')
const windows = []
let zTop = 20

// pos: [fx, fy] fractions of the free space, so layouts survive any viewport
function makeWindow({ id, title, shape, pos, titleAt, moat = {}, contentClass, contentHTML }) {
  const S = uiScale()
  const x = pos[0] * Math.max(0, innerWidth - shape.w * S)
  const y = 46 + pos[1] * Math.max(0, innerHeight - 170 - shape.h * S)
  const el = document.createElement('div')
  el.className = 'window'
  el.style.width = shape.w + 'px'
  el.style.height = shape.h + 'px'
  el.style.clipPath = `path('${shape.outline.replace(/\s+/g, ' ')}')`

  const chrome = document.createElement('canvas')
  chrome.className = 'chrome'
  el.appendChild(chrome)

  if (title) {
    const t = document.createElement('div')
    t.className = 'wtitle'
    t.style.left = titleAt[0] + 'px'
    t.style.top = titleAt[1] + 'px'
    t.innerHTML = `<span>${title}</span>
      <span class="orbs"><span class="orb aqua"></span><span class="orb lime"></span><span class="orb amber"></span></span>`
    el.appendChild(t)
  }

  let content = null
  if (shape.content) {
    content = document.createElement('div')
    content.className = 'wcontent'
    content.style.left = shape.content.x + 'px'
    content.style.top = shape.content.y + 'px'
    content.style.width = shape.content.w + 'px'
    content.style.height = shape.content.h + 'px'
    if (contentClass) content.innerHTML = `<div class="${contentClass}">${contentHTML}</div>`
    else content.innerHTML = contentHTML || ''
    content.firstElementChild && (content.firstElementChild.style.height = '100%')
    el.appendChild(content)
  }
  desktop.appendChild(el)

  const win = {
    id, shape, el, content,
    w: shape.w, h: shape.h,
    scale: S,
    x, y, px: x, py: y, vx: 0, vy: 0, ax: 0, ay: 0,
    sk: 0, skv: 0, st: 0, stv: 0,
    dragging: false,
    ctx: fitCanvas(chrome, shape.w, shape.h),
    band: bandPath(shape),
    outlinePath: new Path2D(shape.outline),
    innerPath: shape.inner ? new Path2D(shape.inner) : null,
    sim: new SloshSim(52, { maxAmp: moat.maxAmp ?? 18, damping: 1.2 }),
    region: { x0: 4, x1: shape.w - 4, level: moat.level ?? shape.h * 0.8, bottom: shape.h - 4 },
    glitter: moat.glitter ? new Glitter(moat.glitter) : null,
    ducks: (moat.ducks || []).map(([p, s, r]) => new Duck(p, s, r)),
    bubbles: new Bubbles(moat.bubbles ?? 0.35),
    colors: moat.colors || {},
  }
  win.sim.splash(0.3 + Math.random() * 0.4, 12)

  const focus = () => {
    for (const o of windows) o.el.classList.remove('focused')
    el.classList.add('focused')
    el.style.zIndex = ++zTop
  }
  let grabX = 0, grabY = 0
  el.addEventListener('pointerdown', (e) => {
    focus()
    if (e.target.closest('button, .file, [data-nodrag]')) return
    win.dragging = true
    grabX = e.clientX - win.x
    grabY = e.clientY - win.y
    el.setPointerCapture(e.pointerId)
    e.preventDefault()
  })
  el.addEventListener('pointermove', (e) => {
    if (!win.dragging) return
    const sw = win.w * win.scale
    win.x = clamp(e.clientX - grabX, -sw * 0.35, innerWidth - sw * 0.55)
    win.y = clamp(e.clientY - grabY, 30, innerHeight - 110)
    e.preventDefault()
  })
  const drop = () => { win.dragging = false }
  el.addEventListener('pointerup', drop)
  el.addEventListener('pointercancel', drop)

  win.focus = focus
  windows.push(win)
  return win
}

function stepWindowPhysics(win, dt) {
  const nvx = (win.x - win.px) / dt
  const nvy = (win.y - win.py) / dt
  const nax = (nvx - win.vx) / dt
  const nay = (nvy - win.vy) / dt
  const s = Math.min(1, 14 * dt)
  win.ax += (clamp(nax, -9000, 9000) - win.ax) * s
  win.ay += (clamp(nay, -9000, 9000) - win.ay) * s
  win.vx = nvx
  win.vy = nvy
  win.px = win.x
  win.py = win.y

  // jelly wobble
  win.skv += (-180 * win.sk - 14 * win.skv + win.ax * 0.0036) * dt
  win.sk = clamp(win.sk + win.skv * dt, -0.14, 0.14)
  win.stv += (-180 * win.st - 14 * win.stv + win.ay * 0.0025) * dt
  win.st = clamp(win.st + win.stv * dt, -0.1, 0.1)
  const S = win.scale
  win.el.style.transform =
    `translate(${win.x}px, ${win.y}px) scale(${S * (1 - win.st * 0.5)}, ${S * (1 + win.st)}) skewX(${win.sk}rad)`

  win.sim.step(dt, win.ax, win.ay)
  win.glitter && win.glitter.step(dt, win.sim)
  for (const d of win.ducks) d.step(dt, win.sim, win.region)
  win.bubbles.step(dt, win.sim, win.region)
}

// Default chrome: liquid moat between outline and content hole + glassy gloss.
function renderMoatChrome(win) {
  const { ctx, w, h } = win
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  ctx.clip(win.band, 'evenodd')
  // glass tint across the empty part of the moat
  ctx.fillStyle = 'rgba(240,252,255,0.18)'
  ctx.fillRect(0, 0, w, h)
  drawLiquid(ctx, win.sim, win.region, { steps: 46, alpha: 0.82, ...win.colors })
  win.bubbles.draw(ctx, win.region)
  win.glitter && win.glitter.draw(ctx, win.sim, win.region)
  for (const d of win.ducks) d.draw(ctx, win.region)
  // gloss sheet across the top of the frame
  const g = ctx.createLinearGradient(0, 0, 0, h * 0.35)
  g.addColorStop(0, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h * 0.35)
  // fresnel inner edge
  ctx.strokeStyle = 'rgba(190,240,255,0.3)'
  ctx.lineWidth = 7
  ctx.stroke(win.outlinePath)
  ctx.restore()

  // rims
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 1.6
  ctx.stroke(win.outlinePath)
  if (win.innerPath) {
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'
    ctx.lineWidth = 1
    ctx.stroke(win.innerPath)
  }
}

// ---------------------------------------------------------------------------
// App: HydroAmp — webamp-shaped player, spectrum + marquee + duck volume
// ---------------------------------------------------------------------------

function makeAmp() {
  const win = makeWindow({
    id: 'amp', title: 'HydroAmp', shape: AMP,
    pos: [0.04, 0.03],
    titleAt: [58, 13],
    moat: { level: 124, glitter: 26, bubbles: 0.5, maxAmp: 16 },
    contentClass: 'amp',
    contentHTML: `
      <div class="marquee"><span id="amp-mq"></span></div>
      <canvas class="spectrum" id="amp-spec"></canvas>
      <div class="side">
        <div class="btns">
          <button class="abtn" data-nodrag>⏮</button>
          <button class="abtn" data-nodrag id="amp-play">▶</button>
          <button class="abtn" data-nodrag>⏭</button>
        </div>
        <canvas id="amp-vol" data-nodrag></canvas>
      </div>`,
  })

  const mq = win.el.querySelector('#amp-mq')
  const TRACK = '♫ Now Playing: Aqua Vista — Glass Ocean.mp3 ··· 128 kbps of sloshing stereo ··· '
  mq.textContent = TRACK + TRACK
  let mqW = 0
  requestAnimationFrame(() => { mqW = mq.scrollWidth / 2 })

  const specEl = win.el.querySelector('#amp-spec')
  const spec = fitCanvas(specEl, 176, 40)
  const bars = new Float32Array(20)

  const volEl = win.el.querySelector('#amp-vol')
  const vol = fitCanvas(volEl, 84, 14)
  const volSim = new SloshSim(14, { maxAmp: 4, wave: 140, damping: 1.8 })

  win.el.querySelector('#amp-play').addEventListener('click', () => {
    toast('💿 ripping: Glass Ocean.mp3')
    win.sim.splash(0.5, 10)
  })

  win.render = (t, dt) => {
    renderMoatChrome(win)
    if (mqW > 0) mq.style.transform = `translateX(${-((t * 42) % mqW)}px)`

    // spectrum: springy fake bars
    spec.clearRect(0, 0, 176, 40)
    for (let i = 0; i < bars.length; i++) {
      const target =
        0.28 + 0.62 * Math.abs(Math.sin(t * 2.4 + i * 0.9) * Math.sin(t * 1.1 + i * 2.3))
        * (0.6 + 0.4 * Math.sin(t * 0.6 + i))
      bars[i] += (target - bars[i]) * Math.min(1, 9 * dt)
      const bh = bars[i] * 34
      const bx = 3 + i * 8.6
      const bg = spec.createLinearGradient(0, 38 - bh, 0, 38)
      bg.addColorStop(0, '#9ff0ff')
      bg.addColorStop(0.5, '#3fb7e8')
      bg.addColorStop(1, '#0b62aa')
      spec.fillStyle = bg
      spec.beginPath()
      spec.roundRect(bx, 38 - bh, 6, bh, 2)
      spec.fill()
      spec.fillStyle = 'rgba(255,255,255,0.85)'
      spec.fillRect(bx, 37 - bh, 6, 1.6)
    }

    // volume tube: liquid level with a duck for a thumb
    volSim.step(dt, win.ax * 0.6, win.ay * 0.4)
    vol.clearRect(0, 0, 84, 14)
    const tube = new Path2D()
    tube.roundRect(1, 2, 82, 10, 5)
    vol.save()
    vol.clip(tube)
    vol.fillStyle = 'rgba(255,255,255,0.35)'
    vol.fillRect(0, 0, 84, 14)
    drawLiquid(vol, volSim, { x0: 1, x1: 58, level: 4, bottom: 13 }, { caustics: false, alpha: 0.9, steps: 16 })
    vol.restore()
    vol.strokeStyle = 'rgba(255,255,255,0.9)'
    vol.lineWidth = 1
    vol.stroke(tube)
    // the duck thumb rides the liquid edge
    const dy = 6 - volSim.heightAt(0.95) * 0.6
    drawDuckMini(vol, 58, dy)
  }
  return win
}

function drawDuckMini(ctx, x, y) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(3.6, 3.6)
  ctx.fillStyle = '#ffd94e'
  ctx.beginPath()
  ctx.ellipse(0, 0.15, 1, 0.7, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0.45, -0.6, 0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#f08018'
  ctx.beginPath()
  ctx.ellipse(0.98, -0.62, 0.3, 0.16, -0.15, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#26221c'
  ctx.beginPath()
  ctx.arc(0.55, -0.72, 0.09, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

// ---------------------------------------------------------------------------
// App: KeyGen 2000 — jagged warez chrome, toxic green moat
// ---------------------------------------------------------------------------

const SERIAL_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const serial = () => {
  const grp = () => Array.from({ length: 4 }, () => SERIAL_CHARS[(Math.random() * SERIAL_CHARS.length) | 0]).join('')
  return `AERO-${grp()}-DUCK-${grp()}`
}

function makeKeygen() {
  const win = makeWindow({
    id: 'keygen', title: 'KeyGen 2000', shape: KEYGEN,
    pos: [0.38, 0.68],
    titleAt: [44, 17],
    moat: {
      level: 240, glitter: 30, bubbles: 0.7, maxAmp: 16,
      colors: { top: '#8fffce', mid: '#2fd18a', deep: '#0a7a52' },
    },
    contentClass: 'kg',
    contentHTML: `
      <div class="kg-head">✦ SLOSH KEYGEN 2000 ✦</div>
      <div class="kg-screen"><div class="kg-serial" id="kg-serial">AERO-????-DUCK-????</div></div>
      <div class="kg-btns">
        <button class="kg-btn" data-nodrag id="kg-gen">▶ GENERATE</button>
        <button class="kg-btn" data-nodrag id="kg-copy">⧉ COPY</button>
      </div>
      <div class="kg-marquee"><span id="kg-greetz"></span></div>`,
  })

  const gz = win.el.querySelector('#kg-greetz')
  const GREETZ = '◄◄ greetz fly out to: teamAQUA ~ bubbleboy ~ dj glasswater ~ the lily pad crew ~ all ducks worldwide ►► no waves were harmed ◄◄ '
  gz.textContent = GREETZ + GREETZ
  let gzW = 0
  requestAnimationFrame(() => { gzW = gz.scrollWidth / 2 })

  const out = win.el.querySelector('#kg-serial')
  win.el.querySelector('#kg-gen').addEventListener('click', () => {
    out.textContent = serial()
    win.sim.splash(Math.random(), 12)
    toast('🔑 serial ripped: ' + out.textContent.slice(0, 9) + '…')
  })
  win.el.querySelector('#kg-copy').addEventListener('click', () => {
    navigator.clipboard?.writeText(out.textContent).catch(() => {})
    toast('⧉ serial copied. stay moist')
  })

  win.render = (t) => {
    renderMoatChrome(win)
    if (gzW > 0) gz.style.transform = `translateX(${-((t * 55) % gzW)}px)`
  }
  return win
}

// ---------------------------------------------------------------------------
// App: Aqua Files — cloud-shaped browser; ducks live in the frame moat
// ---------------------------------------------------------------------------

const FILE_LIST = [
  ['🦆', 'duckz.png'], ['💿', 'glass_ocean.mp3'], ['🔑', 'serials.txt'],
  ['🫧', 'bubbles.cfg'], ['☁️', 'sky.raw'], ['💧', 'wet.dll'],
]

function makeFiles() {
  const win = makeWindow({
    id: 'files', title: 'Aqua Files', shape: FILES,
    pos: [0.94, 0.12],
    titleAt: [84, 36],
    moat: {
      level: 236, glitter: 12, bubbles: 0.5, maxAmp: 18,
      ducks: [[0.3, 8, [0.08, 0.92]], [0.7, 6.5, [0.08, 0.92]]],
    },
    contentClass: 'files',
    contentHTML: FILE_LIST.map(([ico, name], i) =>
      `<div class="file${i === 1 ? ' sel' : ''}" data-nodrag>
         <span class="fico">${ico}</span><span>${name}</span></div>`).join(''),
  })

  win.el.querySelectorAll('.file').forEach((f) => {
    f.addEventListener('click', () => {
      win.el.querySelectorAll('.file').forEach((o) => o.classList.remove('sel'))
      f.classList.add('sel')
      win.sim.splash(Math.random(), 10)
      toast('💾 mounted ' + f.textContent.trim().split('\n').pop().trim())
    })
  })

  win.render = () => renderMoatChrome(win)
  return win
}

// ---------------------------------------------------------------------------
// App: Hydro Donut — a window with a hole in it; the ring IS the clock
// ---------------------------------------------------------------------------

function makeDonut() {
  const win = makeWindow({
    id: 'donut', title: null, shape: DONUT,
    pos: [0.92, 0.88],
    titleAt: [0, 0],
    moat: { level: 9999 }, // unused; the clock draws its own liquid
  })
  const clock = new HydroClock(DONUT.w, DONUT.h, { R: (DONUT.R + DONUT.r) / 2, T: DONUT.R - DONUT.r - 18 })
  win.render = (t, dt) => {
    clock.step(dt, win.ax)
    const ctx = win.ctx
    ctx.clearRect(0, 0, win.w, win.h)
    clock.draw(ctx)
  }
  return win
}

// ---------------------------------------------------------------------------
// Desktop sky + background glass tube (kept from the calm era, still weird)
// ---------------------------------------------------------------------------

const sky = document.getElementById('sky')
let skyCtx = fitCanvas(sky, innerWidth, innerHeight)
const skyBubbles = Array.from({ length: 34 }, () => ({
  x: Math.random(), y: Math.random(), r: 3 + Math.random() * 16,
  s: 0.008 + Math.random() * 0.02, w: Math.random() * Math.PI * 2,
}))

function renderSky(t, dt) {
  const W = innerWidth, H = innerHeight
  skyCtx.clearRect(0, 0, W, H)
  skyCtx.save()
  skyCtx.globalCompositeOperation = 'lighter'
  for (let k = 0; k < 2; k++) {
    skyCtx.beginPath()
    const yy = H * (0.28 + k * 0.34) + Math.sin(t * 0.2 + k * 2) * 12
    skyCtx.moveTo(-50, yy)
    skyCtx.bezierCurveTo(W * 0.3, yy - H * 0.22, W * 0.6, yy + H * 0.18, W + 50, yy - H * 0.12)
    skyCtx.lineWidth = 70 - k * 25
    skyCtx.strokeStyle = `rgba(255,255,255,${0.05 + k * 0.02})`
    skyCtx.lineCap = 'round'
    skyCtx.stroke()
  }
  skyCtx.restore()
  for (const b of skyBubbles) {
    b.y -= b.s * dt * 8
    b.w += dt
    if (b.y < -0.05) { b.y = 1.05; b.x = Math.random() }
    const x = b.x * W + Math.sin(b.w) * 8
    const y = b.y * H
    skyCtx.strokeStyle = 'rgba(255,255,255,0.35)'
    skyCtx.lineWidth = 1.2
    skyCtx.beginPath()
    skyCtx.arc(x, y, b.r, 0, Math.PI * 2)
    skyCtx.stroke()
    const g = skyCtx.createRadialGradient(x - b.r * 0.4, y - b.r * 0.4, 0.5, x, y, b.r)
    g.addColorStop(0, 'rgba(255,255,255,0.5)')
    g.addColorStop(0.4, 'rgba(255,255,255,0.06)')
    g.addColorStop(1, 'rgba(200,240,255,0.12)')
    skyCtx.fillStyle = g
    skyCtx.fill()
  }
}

const tubeBg = document.getElementById('tube-bg')
let tubeBgCtx = fitCanvas(tubeBg, innerWidth, innerHeight)
let bgTube = null
const bgSim = new SloshSim(72, { maxAmp: 20, damping: 1.0 })
const bgGlitter = new Glitter(46)

function buildBgTube() {
  const W = innerWidth, H = innerHeight
  const pts = sampleCubic(
    { x: -70, y: H * 0.30 }, { x: W * 0.30, y: H * 0.02 },
    { x: W * 0.55, y: H * 0.55 }, { x: W + 70, y: H * 0.22 }, 90)
  const radius = Math.max(24, Math.min(40, W * 0.026))
  let minY = 1e9, maxY = -1e9
  for (const p of pts) { minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y) }
  bgTube = {
    path: tubePath(pts, radius),
    region: { x0: 0, x1: W, level: minY + (maxY - minY) * 0.62, bottom: maxY + radius },
  }
}

function renderBgTube() {
  const ctx = tubeBgCtx
  const W = innerWidth, H = innerHeight
  ctx.clearRect(0, 0, W, H)
  ctx.save()
  ctx.globalAlpha = 0.85
  ctx.clip(bgTube.path)
  ctx.fillStyle = 'rgba(235,250,255,0.16)'
  ctx.fillRect(0, 0, W, H)
  drawLiquid(ctx, bgSim, bgTube.region, {
    steps: 70, alpha: 0.55, caustics: false,
    top: '#9ff0ff', mid: '#3fb7e8', deep: '#0b62aa',
  })
  bgGlitter.draw(ctx, bgSim, bgTube.region)
  ctx.restore()
  ctx.globalAlpha = 0.6
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'
  ctx.lineWidth = 1.2
  ctx.stroke(bgTube.path)
  ctx.globalAlpha = 1
}

// ---------------------------------------------------------------------------
// Dock: curved liquid tube, mini ducks, wobbly icons
// ---------------------------------------------------------------------------

const dockWrap = document.getElementById('dock-wrap')
const dockCanvas = document.getElementById('dock-tube')
let dockCtx = null
let dock = null
const dockSim = new SloshSim(60, { maxAmp: 14, damping: 1.1 })
const dockDucks = [new Duck(0.44, 8, [0.34, 0.66]), new Duck(0.56, 6.5, [0.34, 0.66])]
const dockBubbles = new Bubbles(1.2)

function buildDock() {
  const W = dockWrap.clientWidth, H = dockWrap.clientHeight
  dockCtx = fitCanvas(dockCanvas, W, H)
  const pts = sampleQuadratic({ x: 18, y: H - 66 }, { x: W / 2, y: H - 10 }, { x: W - 18, y: H - 66 }, 60)
  dock = {
    w: W, h: H,
    path: tubePath(pts, 25),
    region: { x0: 12, x1: W - 12, level: H - 40, bottom: H - 6 },
  }
}

function renderDock() {
  const ctx = dockCtx
  const { w: W, h: H } = dock
  ctx.clearRect(0, 0, W, H)
  ctx.save()
  ctx.clip(dock.path)
  ctx.fillStyle = 'rgba(240,252,255,0.28)'
  ctx.fillRect(0, 0, W, H)
  drawLiquid(ctx, dockSim, dock.region, { steps: 60, alpha: 0.85 })
  dockBubbles.draw(ctx, dock.region)
  for (const d of dockDucks) d.draw(ctx, dock.region)
  const g = ctx.createLinearGradient(0, H - 70, 0, H - 52)
  g.addColorStop(0, 'rgba(255,255,255,0.4)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, H - 72, W, 20)
  ctx.restore()
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'
  ctx.lineWidth = 1.4
  ctx.stroke(dock.path)
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

const amp = makeAmp()
const keygen = makeKeygen()
const files = makeFiles()
const donut = makeDonut()

buildBgTube()
buildDock()

const dockIcons = document.getElementById('dock-icons')
const apps = [
  { icon: '🎵', win: amp }, { icon: '🔑', win: keygen },
  { icon: '☁️', win: files }, { icon: '🕐', win: donut },
  { icon: '💧', win: null },
]
apps.forEach(({ icon, win }, i) => {
  const b = document.createElement('div')
  b.className = 'dock-icon'
  b.innerHTML = `<span class="glyph">${icon}</span>`
  b.title = win ? win.id : 'sploosh!'
  b.addEventListener('click', () => {
    dockSim.splash((i + 0.5) / apps.length, 10)
    if (win) {
      win.focus()
      win.sim.splash(0.5, 10)
      win.skv += 0.8
    } else {
      for (const w of windows) { w.sim.splash(Math.random(), 12); w.skv += (Math.random() - 0.5) * 2 }
      bgSim.splash(Math.random(), 16)
      dockSim.splash(0.5, 12)
      toast('💧 SPLOOSH — all liquids agitated')
    }
  })
  dockIcons.appendChild(b)
})

// menu clock
const menuClock = document.getElementById('menu-clock')
const setClock = () => {
  const d = new Date()
  menuClock.textContent =
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
setInterval(setClock, 1000)
setClock()

// boot toasts, rising like wax
setTimeout(() => toast('✨ Welcome to SloshOS'), 700)
setTimeout(() => toast('🦆 3 ducks mounted successfully'), 2600)
setTimeout(() => toast('💧 all liquids calibrated'), 4800)
const AMBIENT = [
  '🫧 3 new bubbles available', '☁️ cloud sync: moist', '🦆 duck requested attention',
  '✨ glitter defragmented', '💿 buffering ocean…', '🌡 desktop temperature: pleasant',
]
setInterval(() => toast(AMBIENT[(Math.random() * AMBIENT.length) | 0]), 16000)

// resize
addEventListener('resize', () => {
  skyCtx = fitCanvas(sky, innerWidth, innerHeight)
  tubeBgCtx = fitCanvas(tubeBg, innerWidth, innerHeight)
  buildBgTube()
  buildDock()
  for (const w of windows) {
    w.scale = uiScale()
    const sw = w.w * w.scale
    w.x = clamp(w.x, -sw * 0.35, innerWidth - sw * 0.55)
    w.y = clamp(w.y, 30, innerHeight - 110)
  }
})

// main loop
let last = performance.now()
function frame(now) {
  const dt = clamp((now - last) / 1000, 0.001, 0.05)
  last = now
  const t = now / 1000

  let stirX = 0, stirY = 0
  for (const w of windows) {
    stepWindowPhysics(w, dt)
    stirX += w.ax * 0.3
    stirY += w.ay * 0.2
  }
  stirX = clamp(stirX, -4000, 4000)
  stirY = clamp(stirY, -4000, 4000)

  bgSim.step(dt, stirX, stirY)
  bgGlitter.step(dt, bgSim)
  dockSim.step(dt, stirX, stirY)
  for (const d of dockDucks) d.step(dt, dockSim, dock.region)
  dockBubbles.step(dt, dockSim, dock.region)

  for (const w of windows) w.render && w.render(t, dt)

  renderSky(t, dt)
  renderBgTube()
  renderDock()
  stepToasts(dt, stirX)
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

bgSim.splash(0.4, 14)
dockSim.splash(0.5, 8)
