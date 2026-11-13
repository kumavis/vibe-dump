// The app: boot → title card → segments back-to-back in rundown order (each cuts straight into the
// next: no title card between them) → end card. Owns the one Transport (audible playhead), the
// Stage, the puppets (shared across segments) and the bar.
//
// URL parameters:
//   ?seg=<id>                  start the show at that segment (title card first, unless autostart)
//   ?seg=<id>&t=<s>&freeze=1   render that segment at exactly t (no audio, no gesture), set window.__ready
//                              (seg may also be `title` or `end`)
//   ?autostart=1               skip the title card; with &mute=1 runs silent on the wall clock (QA)
import { Stage } from './stage/stage.js'
import { Show } from './show/show.js'
import { Transport } from './engine/transport.js'
import { rundown, load, loadMeta, audioLead, hasSegment } from './show/segments.js'
import { titleModule, endModule, productionModule, TONIGHT_FALLBACK } from './show/builtins.js'
import { makeBar } from './ui/bar.js'
import { label, P } from './kit/draw.js'

/** a load that takes longer than this (s) puts up the "coming up" card; quicker ones hold the last frame */
const LOADING_CARD_AFTER = 0.8

export async function startApp(params) {
  const wrap = document.getElementById('stage-wrap')
  const canvas = document.getElementById('stage')
  const overlay = document.getElementById('overlay')
  const stage = new Stage(canvas, wrap)
  const puppets = new Map()
  const ids = rundown()
  // ?seg=<id> for a segment outside the rundown (e.g. demo): play it first
  if (params.seg && hasSegment(params.seg) && !ids.includes(params.seg)) ids.unshift(params.seg)
  const exists = ids.map((id) => hasSegment(id))
  const metas = await Promise.all(ids.map((id, i) => (exists[i] ? loadMeta(id).catch((e) => (console.error(e), null)) : null)))
  const pretty = (id) => id.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const titles = metas.map((m, i) => m?.module.title ?? m?.cues?.title ?? pretty(ids[i]))
  for (const [i, id] of ids.entries()) if (!metas[i]) console.info(`rundown: ${id} is in production (no src/segments/${id}/index.js yet) — skipped in playback`)
  const ready = ids.map((_, i) => !!metas[i])
  const tonight = ready.some(Boolean) && ids.some((id, i) => ready[i] && id !== 'demo') ? titles.filter((_, i) => ready[i]) : TONIGHT_FALLBACK
  const transport = new Transport({ muted: !!params.mute })
  window.__lc = { stage, transport, puppets, get show() { return state.show }, get state() { return { mode: state.mode, index: state.index, t: state.show ? state.t : 0, playing: transport.isPlaying, wantPlay: state.wantPlay } } }

  // wantPlay: what the viewer asked for. It survives the gap while the next segment loads, so a
  // pause pressed at (or just across) a segment boundary sticks instead of being overridden.
  const state = { mode: 'title', index: 0, show: null, t: 0, captions: params.captions !== '0', token: 0, epoch: -1, loadingMsg: '', loadingSince: 0, wantPlay: true }
  const makeTitle = () => new Show({ module: titleModule(tonight), cues: null, tele: null, puppets })
  const makeEnd = () => new Show({ module: endModule(), cues: null, tele: null, puppets })
  const makeProduction = (i) => new Show({ module: productionModule(titles[i], i + 1), cues: null, tele: null, puppets })

  // ------------------------------------------------------------ deterministic frame mode
  if (params.freeze) {
    const id = params.seg ?? 'title'
    const t = Number(params.t ?? 0)
    let show
    if (id === 'title') show = makeTitle()
    else if (id === 'end') show = makeEnd()
    else if (!hasSegment(id)) show = makeProduction(Math.max(0, ids.indexOf(id)))
    else {
      const d = await load(id, { audio: false })
      show = new Show({ module: d.module, cues: d.cues, tele: d.tele, puppets })
      try {
        d.module.setup?.(show)
      } catch (e) {
        console.error(e)
      }
    }
    // settle springs, particles and turns: step from a little before t at a fixed 60 fps
    const dt = 1 / 60
    const start = Math.max(0, t - 2.5)
    for (let s = start; s < t - 1e-6; s += dt) show.frame(s, dt, { full: true })
    show.frame(t, dt, { full: true })
    stage.draw(show, drawOpts())
    // a second pass at the same instant: the GL canvas is warm, fonts are certainly in
    await new Promise((r) => requestAnimationFrame(r))
    stage.draw(show, drawOpts())
    window.__ready = true
    document.body.dataset.ready = '1'
    return
  }

  function drawOpts(extra = {}) {
    return { captions: state.captions, ...extra }
  }

  // ------------------------------------------------------------ play / pause
  /** the one play/pause toggle: the bar button, space / k and a click on the stage all come here */
  function togglePlay() {
    if (state.mode === 'title' || state.mode === 'end') return start()
    if (state.mode === 'loading') {
      state.wantPlay = !state.wantPlay // applied when the segment is ready
      return
    }
    if (state.mode !== 'play') return
    state.wantPlay = !transport.isPlaying
    transport.toggle()
  }

  // ------------------------------------------------------------ the bar & overlay buttons
  const bar = makeBar(document.getElementById('bar'), {
    toggle: togglePlay,
    restart: () => state.mode === 'play' && (transport.seek(0), (state.wantPlay = true), transport.play()),
    next: () => state.mode === 'play' && jump(state.index + 1),
    seek: (t) => state.mode === 'play' && transport.seek(t),
    seekBy: (d) => state.mode === 'play' && transport.seek(transport.time() + d),
    jump: (i) => (state.mode === 'title' || state.mode === 'end' ? start(i) : jump(i)),
    captions: () => (state.captions = !state.captions),
    fullscreen,
  })

  function button(text, cls, onClick, pos) {
    const b = document.createElement('button')
    b.className = `stage-btn ${cls}`
    b.innerHTML = `<span>${text}</span>`
    b.style.left = `${(pos.x / 1280) * 100}%`
    b.style.top = `${(pos.y / 720) * 100}%`
    b.onclick = (e) => {
      e.stopPropagation()
      onClick()
    }
    overlay.append(b)
    return b
  }
  function syncOverlay() {
    const c = stage.css
    if (!c) return
    Object.assign(overlay.style, { left: c.x + 'px', top: c.y + 'px', width: c.w + 'px', height: c.h + 'px', fontSize: `${(c.w / 1280) * 16}px` })
  }

  function fullscreen() {
    const el = document.getElementById('app')
    if (document.fullscreenElement) document.exitFullscreen?.()
    else el.requestFullscreen?.().catch(() => {})
  }

  // ------------------------------------------------------------ flow
  async function start(i = params.seg ? Math.max(0, ids.indexOf(params.seg)) : ready.indexOf(true) >= 0 ? ready.indexOf(true) : 0) {
    transport.unlock() // inside the click: the one gesture audio needs
    overlay.replaceChildren()
    state.wantPlay = true
    if (!ids.length) return showEnd()
    await playSegment(i)
  }

  /** a chapter jump (n / p / the chapter list / the next button): plays the chosen segment */
  function jump(i) {
    if (i < 0) i = 0
    state.wantPlay = true
    if (i >= ids.length) return showEnd()
    playSegment(i)
  }

  // A segment's module, telemetry and *decoded* audio, cached by rundown index. The next segment is
  // prepared while this one plays, so the cut to it is immediate (decoding a long mp3 at the
  // boundary used to leave a visible gap).
  const prepared = new Map()
  function prepare(i) {
    if (!prepared.has(i)) {
      const p = (async () => {
        const d = await load(ids[i], { audio: !transport.muted })
        let buffer = null
        if (d.bytes && !transport.muted) {
          try {
            buffer = await transport.decode(d.bytes)
          } catch (e) {
            console.warn(`segment ${ids[i]}: audio would not decode (${e.message}); playing silent`)
          }
        }
        return { d, buffer }
      })()
      p.catch(() => prepared.delete(i))
      prepared.set(i, p)
    }
    return prepared.get(i)
  }

  async function playSegment(i) {
    const token = ++state.token
    transport.pause()
    state.index = i
    state.mode = 'loading'
    state.loadingMsg = titles[i]
    state.loadingSince = performance.now()
    if (!ready[i]) {
      // not made yet: a short "in production" card, then on to the next one
      const show = makeProduction(i)
      transport.load({ buffer: null, duration: 2.6 })
      state.show = show
      state.mode = 'play'
      state.epoch = -1
      if (state.wantPlay) transport.play()
      return
    }
    try {
      const { d, buffer } = await prepare(i)
      if (token !== state.token) return
      const show = new Show({ module: d.module, cues: d.cues, tele: d.tele, puppets })
      show.captions = state.captions
      try {
        d.module.setup?.(show)
      } catch (e) {
        console.error(e)
      }
      transport.load({ buffer, duration: show.duration, audioLead: audioLead(d.cues, buffer) })
      state.show = show
      state.mode = 'play'
      state.epoch = -1
      if (state.wantPlay) transport.play()
      // keep only this segment and the next one decoded; the next one gets ready while this one plays
      for (const k of prepared.keys()) if (k !== i && k !== i + 1) prepared.delete(k)
      if (ready[i + 1]) prepare(i + 1).catch(() => {})
    } catch (e) {
      console.error(e)
      if (token !== state.token) return
      state.loadingMsg = `COULD NOT LOAD ${titles[i]}: ${e.message}`
      state.loadingSince = -Infinity
    }
  }

  function showEnd() {
    state.token++ // a segment still loading must not take over the end card
    transport.pause()
    state.mode = 'end'
    state.show = makeEnd()
    state.t0 = performance.now()
    overlay.replaceChildren()
    button('WATCH AGAIN', 'again', () => start(), { x: 640, y: 640 })
  }

  function showTitle() {
    state.mode = 'title'
    state.show = makeTitle()
    state.t0 = performance.now() - 2000
    overlay.replaceChildren()
    button('START THE SHOW', 'start', () => start(), { x: 96, y: 640 })
  }

  // ------------------------------------------------------------ keyboard
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return
    const k = e.key
    if (k === ' ' || k === 'k') {
      e.preventDefault()
      if (!e.repeat) togglePlay()
    } else if (k === 'ArrowLeft' || k === 'ArrowRight') {
      if (state.mode !== 'play') return
      e.preventDefault()
      transport.seek(transport.time() + (k === 'ArrowLeft' ? -5 : 5))
    } else if (k === 'n') {
      if (state.mode === 'play') jump(state.index + 1)
      else if (state.mode === 'title') start() // the first segment
    } else if (k === 'p') {
      if (state.mode === 'play') transport.time() > 3 ? transport.seek(0) : jump(state.index - 1)
      else if (state.mode === 'end') start(ids.length - 1) // back into the last segment
    } else if (k === 'c') state.captions = !state.captions
    else if (k === 'f') fullscreen()
  })
  // a click on the stage toggles play
  canvas.addEventListener('click', () => state.mode === 'play' && togglePlay())

  // ------------------------------------------------------------ the frame loop
  let last = performance.now()
  function tick(now) {
    requestAnimationFrame(tick)
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
    last = now
    const w0 = performance.now()
    syncOverlay()
    let show = state.show, t = 0, extra = {}
    if (state.mode === 'play') {
      t = transport.time()
      if (transport.epoch !== state.epoch) {
        state.epoch = transport.epoch
        show.resetMotion()
      }
      if (transport.ended) {
        transport.ended = false
        if (state.index + 1 < ids.length) playSegment(state.index + 1)
        else showEnd()
      }
    } else if (state.mode === 'loading') {
      // hold the last frame (a straight cut follows); only a slow load gets the "coming up" card
      t = state.t
      if (now - state.loadingSince > LOADING_CARD_AFTER * 1000) extra.overlay = (ctx) => loadingCard(ctx, state.loadingMsg, now / 1000)
      if (!show) show = state.show = makeTitle()
    } else {
      t = (now - state.t0) / 1000
    }
    state.t = t
    show.captions = state.captions
    show.frame(t, dt, { light: stage.stats.ms > 14, paused: state.mode === 'play' && !transport.isPlaying })
    stage.draw(show, drawOpts(extra))
    stage.budget(performance.now() - w0)
    bar.update({
      playing: state.mode === 'play' ? transport.isPlaying : state.mode === 'loading' && state.wantPlay,
      t: state.mode === 'play' ? Math.max(0, t) : 0,
      start: 0,
      duration: state.mode === 'play' ? transport.duration : 0,
      title: state.mode === 'play' || state.mode === 'loading' ? `${String(state.index + 1).padStart(2, '0')} · ${titles[state.index]}` : state.mode === 'end' ? 'THAT’S THE SHOW' : 'THE LATE CLUSTER',
      index: state.mode === 'play' ? state.index : -1,
      segments: ids.map((id, i) => ({ id, title: titles[i] + (ready[i] ? '' : ' · in production') })),
      captions: state.captions,
      enabled: true,
      marks: [],
    })
  }

  if (params.autostart) {
    state.show = makeTitle()
    state.t0 = performance.now()
    start()
  } else showTitle()
  requestAnimationFrame(tick)
}

function loadingCard(ctx, msg, t) {
  ctx.save()
  ctx.globalAlpha = 0.85
  ctx.fillStyle = '#000'
  ctx.fillRect(390, 300, 500, 110)
  ctx.restore()
  label(ctx, 'COMING UP', 640, 336, { size: 14, align: 'center', color: P.sky, ls: 0.5 })
  label(ctx, String(msg ?? '').toUpperCase(), 640, 372, { size: 24, align: 'center', color: P.white, ls: 0.2 })
  const n = Math.floor(t * 3) % 4
  label(ctx, '·'.repeat(n + 1), 640, 398, { size: 22, align: 'center', color: P.gold })
}
