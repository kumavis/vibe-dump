import { PHOTO } from '../data/weapons.js'
import { frameRect, starHtml } from '../player/photos.js'

// The Field Camera's viewfinder, a pure view over G.photos: frame corners and
// a thirds grid matching exactly the rectangle the album crops, a focus box
// that snaps to the subject the camera would grade, the live estimate and the
// zoom, the shutter flash, and a polaroid of the last shot. The polaroid sits
// over the right of the frame, so with the camera at the eye it leaves as soon
// as the shutter is ready again. Its timers stop while the game is paused.

const $ = (id) => document.getElementById(id)

export class Viewfinder {
  constructor(G) {
    this.G = G
    const vf = $('viewfinder')
    this.el = {
      hud: $('hud'),
      vf,
      frame: vf.querySelector('.vf-frame'),
      focus: vf.querySelector('.vf-focus'),
      subject: vf.querySelector('.vf-subject'),
      zoom: vf.querySelector('.vf-zoom'),
      rec: vf.querySelector('.vf-rec'),
      count: vf.querySelector('.vf-count'),
      flash: $('photoFlash'),
      card: $('photoCard'),
      img: $('photoCard').querySelector('img'),
      cap: $('photoCard').querySelector('.pc-cap'),
    }
    this.cache = {}
    this.shotId = 0
    this.imgId = 0
    this.flashT = 0
    this.cardT = 0
  }

  set(key, value, apply) {
    if (this.cache[key] === value) return
    this.cache[key] = value
    apply(value)
  }

  update(realDt) {
    const G = this.G
    const dt = G.paused ? 0 : realDt
    const W = G.weapons
    const P = G.photos
    const p = G.player
    const on = W.vm.current === 'camera' && !W.pending && p.alive && !p.swimming
    const raised = on && W.raised()
    const el = this.el
    this.set('on', on, (v) => {
      el.vf.classList.toggle('show', v)
      el.hud.classList.toggle('cam', v)
    })
    this.set('raised', raised, (v) => {
      el.vf.classList.toggle('aim', v)
      el.hud.classList.toggle('cam-aim', v)
    })

    if (on) {
      const f = frameRect(innerWidth, innerHeight)
      this.set('rect', `${f.x}|${f.y}|${f.w}|${f.h}`, () => Object.assign(el.frame.style, { left: f.x + 'px', top: f.y + 'px', width: f.w + 'px', height: f.h + 'px' }))
      const b = P.live?.best
      const ok = b && b.stars > 0
      // focus box: the subject's box (clipped to the frame), or searching at centre
      const box = ok ? b.box : { u0: 0.44, u1: 0.56, v0: 0.42, v1: 0.58 }
      const pct = (x) => (x * 100).toFixed(1) + '%'
      this.set('focus', `${pct(box.u0)}|${pct(box.v0)}|${pct(box.u1 - box.u0)}|${pct(box.v1 - box.v0)}|${ok ? b.stars : 0}`, () => {
        Object.assign(el.focus.style, { left: pct(box.u0), top: pct(box.v0), width: pct(box.u1 - box.u0), height: pct(box.v1 - box.v0) })
        el.focus.className = `vf-focus s${ok ? b.stars : 0}`
      })
      let html = '<b>NO SUBJECT</b>'
      if (b && ok) {
        const name = G.science.known(b.species) ? b.creature.sp.name : 'Unknown animal'
        html = `<b>${name}</b> <span class="st">${starHtml(b.stars)}</span><small>${b.poseLabel}${b.unaware ? ' · unaware' : ''} · ${Math.round(b.dist)} m${b.hint ? ` · <em>${b.hint}</em>` : ''}</small>`
      } else if (b && b.vis >= 0.3 && b.hint) html = `<b>NO SUBJECT</b><small><em>${b.hint}</em></small>`
      this.set('subj', html, (v) => (el.subject.innerHTML = v))
      const z = W.zoomFactor()
      this.set('zoom', `${z.toFixed(1)}× <small>${raised ? 'wheel: zoom' : 'RMB: raise'}</small>`, (v) => (el.zoom.innerHTML = v))
      this.set('count', `${P.count}/${Object.keys(G.species).length} species`, (v) => (el.count.textContent = v))
      // the shutter cooldown: a press now only clicks
      this.set('wind', P.cool > 0, (v) => {
        el.rec.textContent = v ? '◌ WINDING ON' : '● FIELD CAMERA'
        el.rec.classList.toggle('wind', v)
      })
    }

    // shutter: flash and the polaroid
    const shot = P.last
    if (shot && shot.id !== this.shotId) {
      this.shotId = shot.id
      this.flashT = 1
      this.cardT = PHOTO.preview
      el.img.removeAttribute('src')
      el.cap.innerHTML = cardCaption(G, shot)
    }
    // the picture arrives a frame later, once main.js has captured it
    if (shot && shot.image && this.imgId !== shot.id) {
      this.imgId = shot.id
      el.img.src = shot.image
    }
    this.flashT = Math.max(0, this.flashT - dt * 4)
    this.cardT = Math.max(0, this.cardT - dt)
    if (raised && P.cool <= 0) this.cardT = 0 // framing the next shot
    this.set('flash', this.flashT.toFixed(2), (v) => (el.flash.style.opacity = (v * 0.85).toFixed(2)))
    this.set('card', this.cardT > 0, (v) => el.card.classList.toggle('show', v))
  }
}

function cardCaption(G, shot) {
  if (!shot.species) return '<b>No subject</b><small>Nothing recognisable in frame</small>'
  const name = G.science.known(shot.species) ? G.species[shot.species].name : 'Unknown animal'
  let note
  if (shot.first) note = `First photo · <b class="pts">+${shot.points}</b>`
  else if (shot.points > 0) note = `New best (+${shot.quality - shot.prevQuality}) · <b class="pts">+${shot.points}</b>`
  else if (shot.best) note = 'New best'
  else note = `Your best is ${shot.prevQuality} — no points`
  return `<b>${name}</b><span class="st">${starHtml(shot.stars)}</span><small>${shot.pose} · quality ${shot.quality}</small><small>${note}</small>`
}
