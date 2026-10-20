// An event's card: title and gloss, when and where, the summary, how sure
// the record is (DATA.md's confidence), the tellings where the sources
// disagree, and the sources themselves, a source nobody has yet opened marked
// "verify". An event with stops gets the ahupuaʻa tour's footer: Next flies
// the camera to each stop's place at the stop's zoom and moves the year to it.

import * as THREE from 'three'
import { $, h, esc } from './dom.js'
import { icon, hasIcon } from './icons.js'
import { geometryPoint } from '../geo.js'
import { formatWhen } from '../time.js'
import { preferredPitch } from '../render/camera.js'

// camera distance for each of DATA.md's zooms
export const ZOOM = { far: 2600, island: 520, near: 70 }

const KIND = {
  arrival: 'arrival', battle: 'battle', founding: 'founding', construction: 'construction', eruption: 'eruption',
  epidemic: 'epidemic', law: 'law', treaty: 'treaty', voyage: 'voyage', death: 'death', protest: 'protest', restoration: 'restoration', other: 'event',
}

export class EventCard {
  constructor(root, app, ui) {
    this.app = app
    this.ui = ui
    this.el = h('section', { class: 'card', 'aria-live': 'polite' })
    root.appendChild(this.el)
    this.places = new Map(app.data.places.map((p) => [p.id, p]))
    this.sources = new Map(app.data.sources.map((s) => [s.id, s]))
    this.ev = null
    this.stop = -1
  }

  get isOpen() {
    return this.el.classList.contains('show')
  }

  open(ev, { fly = true } = {}) {
    this.ev = ev
    this.stop = -1
    this.ui.pins.setStopPlace(null)
    this.render()
    if (fly) {
      const where = (ev.where || []).map((w) => this.places.get(w.place)).find((p) => p && geometryPoint(p.geometry))
      if (where) {
        const rig = this.app.rig
        const want = ZOOM[ev.zoom?.[0]] ?? ZOOM.island
        this.flyToPlace(where, Math.min(rig.goal.distance, Math.max(want, ZOOM.island)))
      }
    }
  }

  close() {
    this.el.classList.remove('show')
    this.ev = null
    this.ui.pins.setStopPlace(null)
    this.ui.onCardClosed?.()
  }

  flyToPlace(place, distance) {
    const [x, z] = this.app.data.proj.toWorld(geometryPoint(place.geometry))
    const rig = this.app.rig
    const target = new THREE.Vector3(x, this.app.world.heightAt(x, z), z)
    const far = Math.hypot(rig.goal.target.x - x, rig.goal.target.z - z)
    const dur = Math.min(6, 1.8 + Math.sqrt(far) * 0.05 + Math.abs(Math.log(distance / rig.goal.distance)) * 0.35)
    const pitch = rig.goal.pitch + preferredPitch(distance) - preferredPitch(rig.goal.distance)
    rig.flyTo({ target, distance, pitch }, dur)
    return dur
  }

  /** Walk to stop i of the open event (-1: back to its summary). */
  goStop(i) {
    const ev = this.ev
    const stops = ev?.stops || []
    if (!ev || i < -1 || i >= stops.length) return
    this.stop = i
    this.render()
    const s = stops[i]
    const place = s ? this.places.get(s.place) : null
    this.ui.pins.setStopPlace(place)
    if (i < 0) return
    let dur = 1.5
    if (place && geometryPoint(place.geometry)) dur = this.flyToPlace(place, ZOOM[s.zoom] ?? ZOOM.island)
    if (Number.isFinite(s.year)) this.ui.timeline.easeToYear(s.year, Math.max(0.8, dur * 0.8))
  }

  sourceLine(ref) {
    const id = typeof ref === 'string' ? ref : ref.id
    const s = this.sources.get(id)
    const where = typeof ref === 'object' && ref.where ? `, ${esc(ref.where)}` : ''
    if (!s) return `<li><span class="src-title">${esc(id)}</span>${where} <span class="flag missing" title="not in sources.json">missing</span></li>`
    const title = s.url && /^https?:/.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>` : esc(s.title)
    const verify = s.opened === false ? ' <span class="flag" title="Not yet read at the source: check this before relying on it">verify</span>' : ''
    const by = s.author ? `${esc(s.author)}, ` : ''
    const yr = s.year ? ` (${esc(s.year)})` : ''
    return `<li>${by}<span class="src-title">${title}</span>${yr}${where}${verify}</li>`
  }

  render() {
    const ev = this.ev
    if (!ev) return
    const kind = hasIcon(ev.kind) ? ev.kind : 'other'
    const placeNames = (ev.where || [])
      .map((w) => {
        const p = this.places.get(w.place)
        return p ? `${esc(p.name)}${w.role ? ` <em>${esc(w.role)}</em>` : ''}` : null
      })
      .filter(Boolean)
    const conf = Object.entries(ev.confidence || {})
      .map(([k, v]) => `<span class="conf ${esc(v)}"><b>${esc(k)}</b> ${esc(v)}</span>`)
      .join('')
    const tellings = (ev.tellings || [])
      .map((t) => `<li><span class="src-title">${esc(this.sources.get(t.source)?.title || t.source)}</span>: ${esc(t.says)}</li>`)
      .join('')
    const stops = ev.stops || []
    const st = this.stop >= 0 ? stops[this.stop] : null
    const stopPlace = st ? this.places.get(st.place) : null
    this.el.innerHTML = `
      <header>
        <div class="card-icon">${icon(kind, 26)}</div>
        <div class="card-titles"><h1>${esc(ev.title)}</h1>${ev.gloss ? `<p class="gloss">${esc(ev.gloss)}</p>` : ''}</div>
        <button class="card-close" aria-label="Close">${icon('close', 18)}</button>
      </header>
      <div class="card-meta"><span class="when">${esc(formatWhen(ev))}</span><span class="kind">${esc(KIND[ev.kind] || ev.kind || 'event')}</span></div>
      ${placeNames.length ? `<div class="card-where">${placeNames.join('<i>·</i>')}</div>` : ''}
      ${st ? `<div class="stop"><div class="stop-n">${this.stop + 1} / ${stops.length}${stopPlace ? ` · ${esc(stopPlace.name)}` : ''}</div><p>${esc(st.text)}</p></div>` : ''}
      <div class="card-body">${ev.summary ? `<p>${esc(ev.summary)}</p>` : ''}</div>
      ${conf ? `<div class="card-conf">${conf}</div>` : ''}
      ${tellings ? `<div class="card-sec"><h2>Tellings</h2><ul class="tellings">${tellings}</ul></div>` : ''}
      <div class="card-sec"><h2>Sources</h2><ul class="sources">${(ev.sources || []).map((s) => this.sourceLine(s)).join('') || '<li class="none">none listed</li>'}</ul></div>
      ${stops.length ? `<footer>
        <button class="nav prev" aria-label="Previous" ${this.stop < 0 ? 'disabled' : ''}>${icon('prev', 18)}</button>
        <span class="count">${this.stop < 0 ? `${stops.length} stops` : `${this.stop + 1} / ${stops.length}`}</span>
        ${this.stop >= stops.length - 1 ? `<button class="nav finish" aria-label="Done">Done</button>` : `<button class="nav next" aria-label="${this.stop < 0 ? 'Begin' : 'Next'}">${this.stop < 0 ? '<span>Begin</span>' : ''}${icon('next', 18)}</button>`}
      </footer>` : ''}`
    this.el.classList.add('show')
    this.el.scrollTop = 0
    $('.prev', this.el)?.addEventListener('click', () => this.goStop(this.stop - 1))
    $('.next', this.el)?.addEventListener('click', () => this.goStop(this.stop + 1))
    $('.finish', this.el)?.addEventListener('click', () => this.goStop(-1))
    $('.card-close', this.el)?.addEventListener('click', () => this.close())
  }
}
