// The transport bar (DOM, under the stage): play/pause, restart, the segment's seek bar, the
// chapter list, captions, fullscreen. Thin vector-styled chrome; the app drives it via update().

const ICON = {
  play: '<path d="M7 4.5 L17 10 L7 15.5 Z"/>',
  pause: '<path d="M6.5 4.5 V15.5 M13.5 4.5 V15.5"/>',
  restart: '<path d="M5 4.5 V15.5"/><path d="M15.5 4.5 L7.5 10 L15.5 15.5 Z"/>',
  prev: '<path d="M5 4.5 V15.5"/><path d="M15.5 4.5 L7.5 10 L15.5 15.5 Z"/>',
  next: '<path d="M15 4.5 V15.5"/><path d="M4.5 4.5 L12.5 10 L4.5 15.5 Z"/>',
  list: '<path d="M4 6 H16 M4 10 H16 M4 14 H16"/>',
  cc: '<rect x="2.5" y="4.5" width="15" height="11" rx="1.5"/><path d="M8.6 8.2 A2 2 0 1 0 8.6 11.8 M14.2 8.2 A2 2 0 1 0 14.2 11.8"/>',
  full: '<path d="M3.5 8 V3.5 H8 M12 3.5 H16.5 V8 M16.5 12 V16.5 H12 M8 16.5 H3.5 V12"/>',
}
const svg = (name) => `<svg viewBox="0 0 20 20" aria-hidden="true">${ICON[name]}</svg>`
const clock = (t) => {
  t = Math.max(0, t)
  return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`
}

export function makeBar(root, h) {
  root.innerHTML = `
    <button class="ic" data-k="play" title="Play / pause (space)" aria-label="Play">${svg('play')}</button>
    <button class="ic" data-k="restart" title="Restart segment" aria-label="Restart segment">${svg('restart')}</button>
    <button class="ic" data-k="next" title="Next segment (n)" aria-label="Next segment">${svg('next')}</button>
    <div class="seek" role="slider" tabindex="0" aria-label="Position in segment" aria-valuemin="0">
      <div class="seek-title"></div>
      <div class="seek-track"><div class="seek-fill"></div><div class="seek-marks"></div></div>
    </div>
    <span class="time">0:00 / 0:00</span>
    <div class="chap-wrap">
      <button class="ic" data-k="list" title="Segments" aria-label="Segments" aria-expanded="false">${svg('list')}</button>
      <ol class="chapters" hidden></ol>
    </div>
    <button class="ic on" data-k="cc" title="Captions (c)" aria-label="Captions" aria-pressed="true">${svg('cc')}</button>
    <button class="ic" data-k="full" title="Fullscreen (f)" aria-label="Fullscreen">${svg('full')}</button>`
  const $ = (s) => root.querySelector(s)
  const play = $('[data-k=play]'), cc = $('[data-k=cc]'), list = $('[data-k=list]')
  const seek = $('.seek'), fill = $('.seek-fill'), title = $('.seek-title'), time = $('.time'), marks = $('.seek-marks')
  const chapters = $('.chapters')
  play.onclick = () => h.toggle()
  $('[data-k=restart]').onclick = () => h.restart()
  $('[data-k=next]').onclick = () => h.next()
  cc.onclick = () => h.captions()
  $('[data-k=full]').onclick = () => h.fullscreen()
  list.onclick = (e) => {
    e.stopPropagation()
    chapters.hidden = !chapters.hidden
    list.setAttribute('aria-expanded', String(!chapters.hidden))
  }
  document.addEventListener('click', (e) => {
    if (!chapters.hidden && !root.contains(e.target)) {
      chapters.hidden = true
      list.setAttribute('aria-expanded', 'false')
    }
  })
  let dur = 0, start = 0
  const seekTo = (e) => {
    const r = seek.querySelector('.seek-track').getBoundingClientRect()
    const u = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    h.seek(start + u * (dur - start))
  }
  let dragging = false
  seek.addEventListener('pointerdown', (e) => {
    dragging = true
    seek.setPointerCapture(e.pointerId)
    seekTo(e)
  })
  seek.addEventListener('pointermove', (e) => dragging && seekTo(e))
  seek.addEventListener('pointerup', () => (dragging = false))
  seek.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopPropagation(), h.seekBy(e.key === 'ArrowLeft' ? -5 : 5)
  })

  let lastChap = '', lastPlaying = null
  return {
    /** s: { playing, t, start, duration, title, index, segments:[{id,title}], captions, enabled, marks:[t] } */
    update(s) {
      // update() runs every frame: touch the play button's icon only when the state flips. Replacing
      // its <svg> every frame detached the node under the pointer between mousedown and mouseup,
      // and the browser then never fired `click` — a real (held) click on pause did nothing.
      if (s.playing !== lastPlaying) {
        lastPlaying = s.playing
        play.innerHTML = svg(s.playing ? 'pause' : 'play')
        play.setAttribute('aria-label', s.playing ? 'Pause' : 'Play')
      }
      cc.classList.toggle('on', s.captions)
      cc.setAttribute('aria-pressed', String(s.captions))
      dur = s.duration
      start = s.start
      const u = dur > start ? (s.t - start) / (dur - start) : 0
      fill.style.width = `${(Math.max(0, Math.min(1, u)) * 100).toFixed(2)}%`
      title.textContent = s.title ?? ''
      time.textContent = `${clock(s.t)} / ${clock(dur)}`
      seek.setAttribute('aria-valuemax', String(Math.round(dur)))
      seek.setAttribute('aria-valuenow', String(Math.round(s.t)))
      root.classList.toggle('disabled', !s.enabled)
      const ck = JSON.stringify([s.segments, s.index, s.marks])
      if (ck !== lastChap) {
        lastChap = ck
        chapters.innerHTML = ''
        s.segments.forEach((seg, i) => {
          const li = document.createElement('li')
          const b = document.createElement('button')
          b.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')}</span> ${seg.title}`
          if (i === s.index) b.classList.add('cur')
          b.onclick = () => {
            chapters.hidden = true
            h.jump(i)
          }
          li.append(b)
          chapters.append(li)
        })
        marks.innerHTML = ''
        for (const m of s.marks ?? []) {
          const d = document.createElement('i')
          d.style.left = `${(((m - start) / (dur - start)) * 100).toFixed(2)}%`
          marks.append(d)
        }
      }
    },
  }
}
