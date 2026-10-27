// The HUD (ENGINEERING.md §7; R7 §4.11; R8 §5.1): DOM over the canvas. The
// battle clock in its zone; the record's beats as one-line subtitles; the
// plot inset (a radar plot on a ship with radar, a lookout plot otherwise);
// the unit's instruments in its own units (knots, feet and yards for the US
// Navy; km/h and metres for the Imperial Navy; a toggle); the target bracket
// with range and time of flight; the aim reticle; the release cue and the
// torpedo envelope; the time-of-flight countdown and the spotting tags; the
// checkpoint prompt and the restart offers. Its words name the ship and what
// happened, never "Kill", "Destroyed" or "Mission accomplished".
//
// Round two (ROUND-2.md §4): the station bar (the held unit's stations, the
// active one marked; a click or Tab switches), the first take's hints (four
// lines for eight seconds, once: localStorage pt.hints), the bracket on the
// selected unit, the AA director's and the gunner's reticles with their lead
// pips, the level sight (the predicted impact and the drift line), and the
// release cue's window.
//
// Round three (ROUND-3.md §1 "Arcade handling"), in a wargame only (the
// arena's player.state.arena): the main battery's lead (a diamond where to lay
// the guns on the target's course at the time of flight), the torpedoes'
// spread (the fan of tracks from the ship along the aim, six kilometres) and an
// aircraft's torpedo track, the bomb's impact ring at all times, and the plot
// at the arena's scale (8 km). The record's HUD is unchanged.
//
// On a phone (700 px wide or less, or a coarse pointer: the page's phone
// layout, style.css) the instruments are a strip of the four numbers that
// matter for the kind (an aircraft's speed, height, heading and g; a ship's
// speed, heading, rudder and the main battery ready), small, docked under
// the page's bar at the top (beside it on a phone on its side), with the
// ammunition and the fuel on a second line only once they run low or out
// and the assist and the like as short tags; the plot shrinks to the top
// right with its caption inside it; the beat's subtitle is one line just
// above the touch controls; the first hints stand in the middle. Where the
// page's bar and the touch controls stand comes from the document's
// variables (--pt-head, --pt-head-end, --pt-foot: ui/boxbar.js;
// --pt-controls: controls/touch.js); the plot's place is given back as
// --pt-plot-top and --pt-plot for the touch controls' camera and time.

import * as THREE from 'three'

// (the page's phone query: style.css and controls/touch.js keep the same one)
const PHONE = '(max-width: 700px), (pointer: coarse)'

const STYLE = `
.pt-hud { position: fixed; inset: 0; pointer-events: none; font: 12px/1.35 Inter, system-ui, sans-serif; color: #e9e4d6; text-shadow: 0 1px 2px rgba(0,0,0,.85); z-index: 20; }
.pt-hud .clock { position: absolute; left: 14px; top: 12px; }
.pt-hud .clock b { font-size: 18px; font-weight: 600; letter-spacing: .02em; font-variant-numeric: tabular-nums; }
.pt-hud .clock .sub { opacity: .75; }
.pt-hud .subs { position: absolute; left: 50%; bottom: 64px; transform: translateX(-50%); text-align: center; max-width: min(720px, 90vw); }
.pt-hud .subs div { margin: 2px 0; padding: 2px 10px; background: rgba(8,10,12,.45); border-radius: 3px; transition: opacity .6s; }
.pt-hud .plot { position: absolute; right: 14px; top: 12px; width: 168px; height: 168px; border-radius: 50%; background: rgba(6,12,10,.55); border: 1px solid rgba(200,220,200,.25); }
.pt-hud .plot-label { position: absolute; right: 14px; top: 184px; width: 168px; text-align: center; opacity: .7; font-size: 11px; }
.pt-hud .inst { position: absolute; left: 14px; bottom: 14px; min-width: 210px; padding: 8px 10px; background: rgba(8,10,12,.45); border-radius: 4px; font-variant-numeric: tabular-nums; white-space: pre; }
.pt-hud .inst .warn { color: #f0b860; }
.pt-hud .msg { position: absolute; left: 50%; top: 26%; transform: translateX(-50%); text-align: center; font-size: 15px; padding: 6px 14px; background: rgba(8,10,12,.5); border-radius: 4px; }
.pt-hud .msg:empty, .pt-hud .subs:empty, .pt-hud .keys:empty { display: none; }
.pt-hud .keys { position: absolute; right: 14px; bottom: 14px; max-width: 300px; padding: 8px 10px; background: rgba(8,10,12,.45); border-radius: 4px; font-size: 11px; white-space: pre-line; }
.pt-hud .mark { position: absolute; transform: translate(-50%, -50%); white-space: nowrap; font-size: 11px; }
.pt-hud .bracket { width: 34px; height: 34px; border: 1px solid rgba(240,230,200,.85); border-radius: 2px; }
.pt-hud .bracket span { position: absolute; left: 40px; top: 4px; }
.pt-hud .reticle { width: 22px; height: 22px; border: 1px solid rgba(255,255,255,.9); border-radius: 50%; }
.pt-hud .reticle span { position: absolute; left: 28px; top: 2px; }
.pt-hud .pip { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #f6e3a0; }
.pt-hud .ccip { width: 14px; height: 14px; border: 1px solid #f6e3a0; transform: translate(-50%, -50%) rotate(45deg); }
.pt-hud .ccip.on { background: rgba(246,227,160,.6); }
.pt-hud .cue { position: absolute; left: 50%; top: 62%; transform: translateX(-50%); padding: 3px 10px; border: 1px solid #f6e3a0; border-radius: 3px; }
.pt-hud .cue:empty { display: none; }
.pt-hud .vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.95) 75%); opacity: 0; transition: opacity .3s; }
/* the app's own bar may show the stations where this one stands (ui-2's held box bar, top centre): the page sets
   --pt-stations-display: none and moves the hints below its bar with --pt-hints-top */
.pt-hud .stations { position: absolute; left: 50%; top: var(--pt-stations-top, 12px); transform: translateX(-50%); display: var(--pt-stations-display, flex); gap: 4px; pointer-events: auto; }
.pt-hud .stations:empty { display: none; }
.pt-hud .stations button { font: inherit; color: #e9e4d6; background: rgba(8,10,12,.55); border: 1px solid rgba(233,228,214,.3); border-radius: 3px; padding: 3px 9px; cursor: pointer; min-height: 26px; }
.pt-hud .stations button[aria-pressed="true"] { border-color: #f6e3a0; color: #f6e3a0; background: rgba(40,36,20,.6); }
.pt-hud .stations .tab { align-self: center; opacity: .6; font-size: 11px; padding-left: 4px; }
.pt-hud .hints { position: absolute; left: 50%; top: var(--pt-hints-top, 52px); transform: translateX(-50%); max-width: calc(100% - 32px); padding: 8px 14px; background: rgba(8,10,12,.6); border-radius: 4px; white-space: pre-line; text-align: left; line-height: 1.6; }
.pt-hud .hints:empty { display: none; }
.pt-hud .sel { border: 1px dashed rgba(246,227,160,.85); border-radius: 3px; }
.pt-hud .sel span { position: absolute; left: 100%; top: -2px; padding-left: 6px; color: #f6e3a0; }
.pt-hud .cross { width: 28px; height: 28px; }
.pt-hud .cross::before, .pt-hud .cross::after { content: ''; position: absolute; background: rgba(255,255,255,.9); }
.pt-hud .cross::before { left: 13px; top: 0; width: 1px; height: 28px; }
.pt-hud .cross::after { left: 0; top: 13px; width: 28px; height: 1px; }
.pt-hud .cross.on::before, .pt-hud .cross.on::after { background: #f6e3a0; }
.pt-hud .cross.off { opacity: .35; }
.pt-hud .lead { width: 10px; height: 10px; border-radius: 50%; border: 1px solid #f6e3a0; }
.pt-hud .lead2 { width: 6px; height: 6px; border-radius: 50%; border: 1px solid rgba(246,227,160,.7); }
.pt-hud canvas.sightc { position: absolute; inset: 0; width: 100%; height: 100%; }
.pt-hud .cuewin { position: absolute; left: 50%; top: calc(62% + 28px); transform: translateX(-50%); width: 180px; height: 6px; background: rgba(8,10,12,.5); border: 1px solid rgba(233,228,214,.35); border-radius: 3px; }
.pt-hud .cuewin b { position: absolute; top: 0; bottom: 0; background: rgba(246,227,160,.35); }
.pt-hud .cuewin i { position: absolute; top: -3px; width: 2px; height: 12px; background: #fff; }
.pt-hud .cue.on { background: rgba(246,227,160,.25); }
/* (the middle's words: placed one by one on a wide screen, stacked in the middle on a phone) */
.pt-hud .mid { display: contents; }
.pt-hud .strip { display: none; }
@media ${PHONE} {
  /* the plot's place, for the touch controls' camera and time beneath it: under the page's bar, or at the top on a phone on its side */
  :root { --pt-plot: 96px; --pt-plot-top: max(var(--pt-head, 0px), calc(env(safe-area-inset-top, 0px) + 58px)); }
  .pt-hud {
    --head: max(var(--pt-head, 0px), calc(env(safe-area-inset-top, 0px) + 58px));
    --foot: calc(max(var(--pt-controls, 0px), var(--pt-foot, 0px)) + env(safe-area-inset-bottom, 0px) + 10px);
    --edge-l: max(8px, env(safe-area-inset-left, 0px));
    --edge-r: max(8px, env(safe-area-inset-right, 0px));
    /* the middle: under the plot and the camera and time buttons, over the subtitle */
    --band-top: calc(var(--pt-plot-top) + var(--pt-plot) + 112px);
    --band-foot: calc(var(--foot) + 32px);
  }
  .pt-hud .clock { display: var(--pt-clock-display, block); left: max(12px, env(safe-area-inset-left, 0px)); top: calc(10px + env(safe-area-inset-top, 0px)); max-width: calc(100vw - 132px); }
  .pt-hud .clock b { font-size: 17px; }
  .pt-hud .clock .sub { font-size: 11px; }
  .pt-hud .inst { display: none !important; }
  .pt-hud .strip { position: absolute; top: var(--head); left: var(--edge-l); max-width: calc(100vw - var(--edge-l) - var(--edge-r) - var(--pt-plot) - 8px); display: flex; flex-wrap: wrap; align-items: baseline; gap: 1px 10px; padding: 4px 9px; background: rgba(8,10,12,.45); border-radius: 4px; font-size: 11.5px; line-height: 1.45; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .pt-hud .strip:empty { display: none; }
  .pt-hud .strip .tag { padding: 0 5px; border-radius: 3px; background: rgba(233,228,214,.14); font-size: 10.5px; }
  .pt-hud .strip .warn { color: #f0b860; }
  .pt-hud .strip .tag.warn { background: rgba(240,184,96,.18); }
  .pt-hud .strip .l2 { flex: 1 0 100%; display: flex; flex-wrap: wrap; gap: 0 10px; }
  .pt-hud .plot { top: var(--pt-plot-top); right: var(--edge-r); width: var(--pt-plot); height: var(--pt-plot); }
  .pt-hud .plot-label { top: calc(var(--pt-plot-top) + var(--pt-plot) - 30px); right: var(--edge-r); width: var(--pt-plot); padding: 0 20px; font-size: 9px; line-height: 1.15; white-space: normal; }
  .pt-hud .subs { bottom: var(--foot); max-width: calc(100vw - 24px); }
  .pt-hud .subs div { display: none; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pt-hud .subs div:last-child { display: block; }
  /* the middle, under the plot and over the subtitle: the first hints (or the keys), a message, the release cue and its
     window, stacked so that none stands on another */
  .pt-hud .mid { position: absolute; left: 0; right: 0; top: var(--band-top); bottom: var(--band-foot); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
  .pt-hud .mid > * { position: static; left: auto; right: auto; top: auto; bottom: auto; transform: none; margin: 0; flex: none; }
  .pt-hud .msg { max-width: calc(100vw - 32px); font-size: 13px; }
  .pt-hud .hints, .pt-hud .keys { width: max-content; max-width: min(460px, calc(100vw - 32px)); padding: 8px 12px; font-size: 12px; line-height: 1.45; white-space: pre-line; }
  .pt-hud:has(.hints:not(:empty)) .keys { display: none; }
  @media (orientation: landscape) {
    :root { --pt-plot-top: calc(env(safe-area-inset-top, 0px) + 8px); }
    /* the strip beside the page's bar, short of the plot; the middle starts under the bar */
    .pt-hud { --band-top: var(--head); }
    .pt-hud .strip { top: calc(env(safe-area-inset-top, 0px) + 8px); left: max(var(--pt-head-end, 0px), var(--edge-l)); max-width: calc(100vw - max(var(--pt-head-end, 0px), var(--edge-l)) - var(--edge-r) - var(--pt-plot) - 8px); min-height: 44px; align-content: center; }
    .pt-hud .hints, .pt-hud .keys { max-width: min(520px, calc(100vw - 2 * (var(--pt-plot) + 24px))); }
  }
}
`

const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const KN = 0.514444
const DEG = Math.PI / 180
const TELEGRAPH = [
  [-0.75, 'back full'],
  [-0.3, 'back one third'],
  [0.05, 'stop'],
  [0.4, 'ahead one third'],
  [0.7, 'ahead two thirds'],
  [0.86, 'ahead standard'],
  [0.97, 'ahead full'],
  [2, 'ahead flank'],
]
const telegraphName = (f) => TELEGRAPH.find(([v]) => f <= v)?.[1] ?? 'ahead flank'
const STATION_NAMES = { helm: 'Helm', main: 'Main battery', aa: 'Anti-aircraft', torpedoes: 'Torpedoes', pilot: 'Pilot', gunner: 'Gunner', bombardier: 'Bombardier' }

export class Hud {
  constructor(box, { container = document.body } = {}) {
    this.box = box
    if (!document.getElementById('pt-hud-style')) {
      const st = document.createElement('style')
      st.id = 'pt-hud-style'
      st.textContent = STYLE
      document.head.appendChild(st)
    }
    const el = document.createElement('div')
    el.className = 'pt-hud'
    el.innerHTML = `
      <div class="vignette"></div>
      <div class="clock"><b></b><div class="sub"></div></div>
      <canvas class="plot" width="168" height="168"></canvas><div class="plot-label"></div>
      <div class="subs"></div>
      <div class="inst"></div>
      <div class="strip"></div>
      <div class="mark bracket" style="display:none"><span></span></div>
      <div class="mark reticle" style="display:none"><span></span></div>
      <div class="mark pip" style="display:none"></div>
      <div class="mark ccip" style="display:none"></div>
      <canvas class="sightc" style="display:none"></canvas>
      <div class="mark sel" style="display:none"><span></span></div>
      <div class="mark cross" style="display:none"></div>
      <div class="mark lead" style="display:none"></div>
      <div class="mark lead2" style="display:none"></div>
      <div class="mid"><div class="hints"></div><div class="keys"></div><div class="msg"></div><div class="cue"></div><div class="cuewin" style="display:none"><b></b><i></i></div></div>
      <nav class="stations" aria-label="Stations"></nav>`
    container.appendChild(el)
    this.el = el
    this.$ = (s) => el.querySelector(s)
    this.clockB = this.$('.clock b')
    this.clockS = this.$('.clock .sub')
    this.plot = this.$('.plot')
    this.plotLabel = this.$('.plot-label')
    this.subs = this.$('.subs')
    this.msg = this.$('.msg')
    this.cue = this.$('.cue')
    this.inst = this.$('.inst')
    this.strip = this.$('.strip')
    this.full = new Map() // the most rounds each gun of the held unit has held, for the strip's "low"
    this.keys = this.$('.keys')
    this.bracket = this.$('.bracket')
    this.reticle = this.$('.reticle')
    this.pip = this.$('.pip')
    this.ccip = this.$('.ccip')
    this.vignette = this.$('.vignette')
    this.sightc = this.$('.sightc')
    this.sel = this.$('.sel')
    this.cross = this.$('.cross')
    this.lead = this.$('.lead')
    this.lead2 = this.$('.lead2')
    this.cuewin = this.$('.cuewin')
    this.hints = this.$('.hints')
    this.stationBar = this.$('.stations')
    this.hintsUntil = 0
    this.stationKey = ''
    this.beatIndex = 0
    this.lines = []
    this.units = null // null: the unit's own; 'imperial' | 'metric'
    this.textT = 0
    this.message = ''
    this.messageUntil = 0
    this.keysUntil = 0
    this.visible = true
    this.v = new THREE.Vector3()
  }

  toggleUnits() {
    const own = this.box.sim?.player?.state?.units ?? 'imperial'
    const cur = this.units ?? own
    this.units = cur === 'imperial' ? 'metric' : 'imperial'
  }

  /** A message in the middle of the screen (the checkpoint, the end), for `s` seconds or until replaced. */
  say(text, s = 4) {
    this.message = text
    this.messageUntil = performance.now() / 1000 + s
  }

  showKeys(text, s = 3) {
    this.keys.textContent = text
    this.keysUntil = performance.now() / 1000 + s
  }

  /**
   * The station bar for the held unit (or none): a button per station, the
   * active one pressed; a click switches (Battle.setStation), as Tab does.
   */
  setStations(pl) {
    const bar = this.stationBar
    const key = pl ? `${pl.unitIndex}:${pl.stations.join(',')}:${pl.station}:${pl.allStations ? 1 : 0}` : ''
    if (key === this.stationKey) return
    this.stationKey = key
    bar.innerHTML = ''
    if (!pl || pl.stations.length < 1) return
    for (const st of pl.stations) {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = STATION_NAMES[st] ?? st
      b.dataset.station = st
      b.setAttribute('aria-pressed', String(st === pl.station && !pl.allStations))
      b.addEventListener('click', (e) => {
        e.stopPropagation()
        const battle = this.box.battle
        try {
          battle?.setStation?.(st)
        } catch (err) {
          this.say(err.message, 2)
        }
        e.currentTarget.blur()
      })
      bar.appendChild(b)
    }
    if (pl.stations.length > 1) {
      const t = document.createElement('span')
      t.className = 'tab'
      // (in a wargame Tab hops between units and the stations go round on the backquote key)
      t.textContent = this.box.sim?.arena ? '`' : 'Tab'
      bar.appendChild(t)
    }
  }

  /** The first take's hints (ROUND-2 §1.2): four lines for eight seconds, once for each kind (localStorage pt.hints). */
  firstHints(kind, lines) {
    if (!lines?.length) return false
    let seen = {}
    try {
      seen = JSON.parse(localStorage.getItem('pt.hints') || '{}') || {}
    } catch {
      seen = {}
    }
    if (seen[kind]) return false
    this.hints.textContent = lines.join('\n')
    this.hintsUntil = performance.now() / 1000 + 8
    try {
      localStorage.setItem('pt.hints', JSON.stringify({ ...seen, [kind]: true }))
    } catch {
      // (no storage: the hints show this once in this page's life)
    }
    return true
  }

  /** The hints taken down: a station left or the controls given back, so no line names a station no longer held. */
  clearHints() {
    this.hints.textContent = ''
    this.hintsUntil = 0
  }

  setVisible(on) {
    this.visible = on
    this.el.style.display = on ? '' : 'none'
  }

  /** Project a world point to the screen: [x, y] in CSS pixels, or null behind the camera. */
  project(x, y, z) {
    const cam = this.box.camera
    this.v.set(x, y, z).project(cam)
    if (this.v.z > 1 || this.v.z < -1) return null
    return [((this.v.x + 1) / 2) * innerWidth, ((1 - this.v.y) / 2) * innerHeight]
  }

  place(el, p) {
    if (!p) {
      el.style.display = 'none'
      return
    }
    el.style.display = ''
    el.style.left = `${p[0]}px`
    el.style.top = `${p[1]}px`
  }

  update(dt) {
    if (!this.visible) return
    const box = this.box
    const sim = box.sim
    if (!sim) return
    const now = performance.now() / 1000
    const clock = sim.clock
    // the beats: new ones become subtitles for six seconds
    while (this.beatIndex < sim.beats.length) {
      const b = sim.beats[this.beatIndex++]
      if (b.kind === 'checkpoint') continue
      this.lines.push({ text: b.text, until: now + 6 })
    }
    this.lines = this.lines.filter((l) => l.until > now).slice(-3)
    this.textT -= dt
    const textNow = this.textT <= 0
    if (textNow) {
      this.textT = 0.1
      const zone = box.battleData?.clock?.name ?? clock.zone
      this.clockB.textContent = clock.label(sim.t, { seconds: true })
      const sc = box.battle?.timeScale ?? 1
      this.clockS.textContent = `${zone} · ${clock.dateLabel(sim.t)}${sc !== 1 ? ` · ×${sc}` : ''}${box.battle && !box.battle.running ? ' · paused' : ''}`
      this.subs.innerHTML = ''
      for (const l of this.lines) {
        const d = document.createElement('div')
        d.textContent = l.text
        this.subs.appendChild(d)
      }
      this.msg.textContent = now < this.messageUntil ? this.message : ''
      if (now > this.keysUntil) this.keys.textContent = ''
      if (now > this.hintsUntil && this.hints.textContent) this.hints.textContent = ''
    }
    const pl = sim.player
    this.drawPlot(pl)
    this.setStations(pl)
    this.drawSelection(pl)
    for (const m of [this.cross, this.lead, this.lead2]) m.style.display = 'none'
    this.sightc.style.display = 'none'
    this.cuewin.style.display = 'none'
    if (!pl || !sim.state.alive[pl.unitIndex]) {
      this.inst.style.display = 'none'
      if (this.stripHTML) {
        this.strip.textContent = ''
        this.stripHTML = ''
      }
      this.full.clear()
      for (const m of [this.bracket, this.reticle, this.pip, this.ccip]) m.style.display = 'none'
      this.cue.textContent = ''
      this.vignette.style.opacity = 0
      return
    }
    this.inst.style.display = ''
    const st = pl.state
    if (st.arena) this.drawArena(pl, st)
    const units = this.units ?? st.units
    const imp = units === 'imperial'
    const spd = (ms) => (imp ? `${(ms / KN).toFixed(0)} kn` : `${(ms * 3.6).toFixed(0)} km/h`)
    const alt = (m) => (imp ? `${Math.round(m * 3.28084).toLocaleString('en')} ft` : `${Math.round(m).toLocaleString('en')} m`)
    const rng = (m) => (imp ? `${Math.round(m * 1.09361).toLocaleString('en')} yd` : `${Math.round(m).toLocaleString('en')} m`)
    const hdg = (d) => `${String(Math.round(((d % 360) + 360) % 360)).padStart(3, '0')}°`
    if (pl.kind === 'aircraft') {
      if (textNow) {
        const lines = [
          `${spd(st.ias)} IAS   ${alt(st.alt)}`,
          `heading ${hdg(st.heading)}   throttle ${Math.round(st.throttle * 100)} %`,
          `${st.g.toFixed(1)} g${st.stall ? '   <span class="warn">stall</span>' : ''}${st.shake > 0 ? '   <span class="warn">overspeed</span>' : ''}${st.broken ? '   <span class="warn">controls damaged</span>' : ''}`,
          st.ammo.filter((a) => a.left > 0 || a.position !== 'rear').map((a) => `${a.calibreMm} mm ${a.left}`).join('  '),
          `${st.bombs ? `bombs ${st.bombs}   ` : ''}${st.torpedoes ? `torpedo ${st.torpedoes}   ` : ''}fuel ${Math.floor(st.endurance / 60)} min`,
          st.home ? `home ${hdg(st.home.bearing)} ${imp ? `${(st.home.range / 1852).toFixed(0)} nm` : `${(st.home.range / 1000).toFixed(0)} km`}` : '',
          st.aa > 0 ? '<span class="warn">AA</span>' : '',
          st.station === 'gunner' && st.gun ? `rear gun ${st.gun.rounds} rounds${st.gun.bears ? '' : '   <span class="warn">does not bear</span>'}` : '',
          st.station === 'bombardier' ? `bombardier · run-in ${hdg(st.sight?.heading ?? st.heading)}${st.bombs ? `   bombs ${st.bombs}` : ''}` : '',
          st.assist === 'assisted' && st.assisting?.length ? `assisted: ${st.assisting.join(', ')}` : '',
          st.engaged === false ? 'on the record until you act' : '',
        ]
        this.inst.innerHTML = lines.filter(Boolean).join('\n')
        this.drawStrip([spd(st.ias), alt(st.alt), hdg(st.heading), `${st.g.toFixed(1)} g`], this.airTags(st, hdg), this.airLow(pl, st))
      }
      // the target, its lead pip, the CCIP and the release cue
      const t = st.target
      if (t) {
        const s = sim.state
        this.place(this.bracket, this.project(s.pos[3 * t.index], s.pos[3 * t.index + 1], s.pos[3 * t.index + 2]))
        this.bracket.querySelector('span').textContent = rng(t.range)
        const showPip = box.aid !== 'record' && (box.aid === 'guided' || t.range < 400)
        this.place(this.pip, showPip && t.lead ? this.project(t.lead[0], t.lead[1], t.lead[2]) : null)
      } else {
        this.bracket.style.display = 'none'
        this.pip.style.display = 'none'
      }
      const c = st.ccip
      const showCcip = c && box.aid !== 'record' && (box.aid === 'guided' || st.alt < 1500) && st.pitch < -20
      this.place(this.ccip, showCcip ? this.project(c.x, 0, c.z) : null)
      this.ccip.classList.toggle('on', !!c?.onTarget)
      let cue = ''
      const assisted = st.assist === 'assisted' || st.station === 'bombardier'
      const cw = st.cue
      if (assisted && cw?.on) cue = 'release now'
      else if (st.release && st.pitch < -20) cue = 'release'
      else if (st.envelope && st.alt < 120) cue = st.envelope.ok ? 'in the envelope' : st.envelope.why
      else if (assisted && cw?.kind === 'torpedo' && cw.value != null && cw.value < (cw.hi ?? 0) * 2) cue = cw.envelope?.ok ? 'in the envelope' : cw.envelope?.why ?? ''
      if (cue !== this.cue.textContent) this.cue.textContent = cue
      this.cue.classList.toggle('on', cue === 'release now' || cue === 'release')
      this.drawCueWindow(cw, rng)
      this.vignette.style.opacity = st.blackout > 0.9 ? 0.9 : st.blackout > 0.4 ? 0.45 : 0
      this.reticle.style.display = 'none'
      if (st.station === 'gunner' && st.gun) this.drawGunSight(st.gun, rng)
      if (st.station === 'bombardier' && st.sight) this.drawLevelSight(st.sight, sim)
    } else {
      if (textNow) {
        const fires = st.fires.reduce((a, b) => a + b, 0)
        const ls = st.lastSalvo
        const flight = ls && sim.t < ls.landsAt ? `salvo in the air ${(ls.landsAt - sim.t).toFixed(1)} s` : ls && ls.tags.length ? `last salvo: ${[...new Set(ls.tags)].join(', ')}${ls.straddle ? ' (straddle)' : ''}` : ''
        const ready = st.turrets.filter((t) => t.role === 'main' || t.battery === 0)
        const lines = [
          `${spd(st.speed)}   ordered ${telegraphName(st.telegraph >= 0 ? st.telegraph : st.telegraph)}`,
          `heading ${hdg(st.heading)}   rudder ${Math.abs(st.rudder).toFixed(0)}° ${st.rudder > 0.5 ? 'starboard' : st.rudder < -0.5 ? 'port' : ''}`,
          `main battery ${ready.filter((t) => t.ready).length}/${ready.length} ready${st.aimTof != null ? `   time of flight ${st.aimTof.toFixed(1)} s` : ''}`,
          flight,
          `damage: fighting ${Math.round(Math.max(0, 1 - st.fight) * 100)} %  afloat ${Math.round(Math.max(0, 1 - st.float) * 100)} %${Math.abs(st.list) > 1 ? `  list ${Math.abs(st.list).toFixed(0)}°` : ''}${fires ? `  fires ${fires}` : ''}`,
          st.systemsOut.length ? `<span class="warn">${st.systemsOut.join(', ')}</span>` : '',
          st.torpedoesReady ? `torpedoes ready: ${st.torpedoesReady}` : '',
          st.helmHeld ? `helm: ${st.helmHeld === 'record' ? 'on the record’s course' : `holding ${hdg(st.helmHeld.heading)} at ${spd(st.helmHeld.speed)}`}` : '',
          st.mainTarget >= 0 ? `main battery on ${sim.slots[st.mainTarget]?.name ?? 'its target'}` : '',
          st.director ? `AA director${st.director.aimed >= 0 ? ` · ${st.director.range != null ? rng(st.director.range) : ''}` : ' · no aircraft on the aim'}${st.director.firing ? '   firing' : ''}` : '',
          st.engaged === false ? 'on the record until you act' : '',
        ]
        this.inst.innerHTML = lines.filter(Boolean).join('\n')
        const rud = Math.abs(st.rudder)
        const tags = [
          ...st.systemsOut.map((x) => ['warn', x]),
          st.station === 'main' && flight ? ['', flight.replace(/^last salvo: /, '')] : null,
          st.station === 'torpedoes' && st.torpedoesReady ? ['', `tubes ${st.torpedoesReady}`] : null,
          st.director ? ['', `director${st.director.aimed >= 0 && st.director.range != null ? ` ${rng(st.director.range)}` : ' · no aircraft'}${st.director.firing ? ' · firing' : ''}`] : null,
          // (a unit on the record until the player acts is on the record's course too: the one tag says it)
          st.engaged === false ? ['', 'on the record'] : st.helmHeld ? ['', st.helmHeld === 'record' ? 'the record’s course' : `holding ${hdg(st.helmHeld.heading)}`] : null,
        ]
        const dmg = Math.max(0, 1 - st.fight) < 0.995 || Math.max(0, 1 - st.float) < 0.995 || Math.abs(st.list) > 1 || fires
        const low = dmg ? [['warn', `fighting ${Math.round(Math.max(0, 1 - st.fight) * 100)} %`], ['warn', `afloat ${Math.round(Math.max(0, 1 - st.float) * 100)} %`], Math.abs(st.list) > 1 ? ['warn', `list ${Math.abs(st.list).toFixed(0)}°`] : null, fires ? ['warn', `fires ${fires}`] : null] : []
        this.drawStrip([spd(st.speed), hdg(st.heading), `rudder ${rud.toFixed(0)}°${st.rudder > 0.5 ? ' stbd' : st.rudder < -0.5 ? ' port' : ''}`, `main ${ready.filter((t) => t.ready).length}/${ready.length}`], tags, low)
      }
      const s = sim.state
      const i = pl.unitIndex
      const inp = pl.input
      // the aim reticle: where the main battery is laid
      if (inp.aimRange != null && inp.aimAz != null) {
        const a = inp.aimAz * DEG
        const px = s.pos[3 * i] + Math.sin(a) * inp.aimRange
        const pz = s.pos[3 * i + 2] - Math.cos(a) * inp.aimRange
        this.place(this.reticle, this.project(px, 0, pz))
        this.reticle.querySelector('span').textContent = `${rng(inp.aimRange)}${st.aimTof != null ? ` · ${st.aimTof.toFixed(1)} s` : ''}`
      } else this.reticle.style.display = 'none'
      if (st.director) {
        this.drawGunSight(st.director, rng)
        this.reticle.style.display = 'none'
        this.pip.style.display = 'none'
        this.ccip.style.display = 'none'
        this.cue.textContent = ''
        this.vignette.style.opacity = 0
        return
      }
      const t = st.target
      if (t && box.aid !== 'record') {
        this.place(this.bracket, this.project(s.pos[3 * t.index], 12, s.pos[3 * t.index + 2]))
        this.bracket.querySelector('span').textContent = `${sim.slots[t.index].name} · ${rng(t.range)}${t.tof ? ` · ${t.tof.toFixed(1)} s` : ''}${t.how === 'radar' ? ' · radar' : ''}`
      } else this.bracket.style.display = 'none'
      this.pip.style.display = 'none'
      this.ccip.style.display = 'none'
      this.cue.textContent = ''
      this.vignette.style.opacity = 0
    }
  }

  /**
   * A phone's instrument strip: the four numbers, then the tags (a warning or a state in a word or two), and a
   * second line only for what has run low or out (tags and lines as [cls, text] pairs; empty ones are left out).
   */
  drawStrip(nums, tags, low) {
    const span = ([cls, text]) => `<span class="${cls ? `${cls} ` : ''}tag">${esc(text)}</span>`
    const tagsHTML = tags.filter((t) => t && t[1]).map(span).join('')
    const lowHTML = low.filter((t) => t && t[1]).map(([cls, text]) => `<span class="${cls}">${esc(text)}</span>`).join('')
    const html = `${nums.map((n) => `<span>${esc(n)}</span>`).join('')}${tagsHTML}${lowHTML ? `<div class="l2">${lowHTML}</div>` : ''}`
    if (html !== this.stripHTML) {
      this.stripHTML = html
      this.strip.innerHTML = html
    }
  }

  /** An aircraft's tags: its warnings, the AA on it, the gun or the sight it is at, the assist, the record. */
  airTags(st, hdg) {
    return [
      st.stall ? ['warn', 'stall'] : null,
      st.shake > 0 ? ['warn', 'overspeed'] : null,
      st.broken ? ['warn', 'controls damaged'] : null,
      st.aa > 0 ? ['warn', 'AA'] : null,
      st.station === 'gunner' && st.gun && !st.gun.bears ? ['warn', 'does not bear'] : null,
      st.station === 'bombardier' ? ['', `run-in ${hdg(st.sight?.heading ?? st.heading)}`] : null,
      st.assist === 'assisted' && st.assisting?.length ? ['', `assist: ${st.assisting.join(', ')}`] : null,
      st.engaged === false ? ['', 'on the record'] : null,
    ]
  }

  /** What an aircraft has run low on or out of: a gun's rounds under a fifth of the most it held, the fuel under ten minutes. */
  airLow(pl, st) {
    const out = []
    const key = (k) => `${pl.unitIndex}:${k}`
    st.ammo.forEach((a, k) => {
      const full = Math.max(this.full.get(key(k)) ?? 0, a.left)
      this.full.set(key(k), full)
      if (a.position === 'rear' && st.station !== 'gunner') return
      if (a.left <= 0 && full > 0) out.push(['warn', `${a.calibreMm} mm out`])
      else if (a.left <= full * 0.2) out.push(['warn', `${a.calibreMm} mm ${a.left}`])
    })
    if (st.endurance <= 0) out.push(['warn', 'fuel out'])
    else if (st.endurance < 600) out.push(['warn', `fuel ${Math.floor(st.endurance / 60)} min`])
    return out
  }

  /** The bracket on the selected unit (dashed), with its name; not on the player's own unit seen from it. */
  drawSelection(pl) {
    const box = this.box
    const sim = box.sim
    const i = box.selected
    const cm = box.cameraMode
    if (i == null || !sim || sim.state.alive[i] !== 1 || (pl && pl.unitIndex === i && cm !== 'orbit' && cm !== 'free')) {
      this.sel.style.display = 'none'
      return
    }
    const s = sim.state
    const u = sim.slots[i]
    const p = this.project(s.pos[3 * i], s.pos[3 * i + 1] + (u.kind === 'ship' ? 8 : 0), s.pos[3 * i + 2])
    if (!p) {
      this.sel.style.display = 'none'
      return
    }
    let size = 26
    if (u.kind === 'ship') {
      const L = sim._X[i].model?.L ?? 100
      const h = s.heading[i] * DEG
      const a = this.project(s.pos[3 * i] + Math.sin(h) * L * 0.5, 4, s.pos[3 * i + 2] - Math.cos(h) * L * 0.5)
      const b = this.project(s.pos[3 * i] - Math.sin(h) * L * 0.5, 4, s.pos[3 * i + 2] + Math.cos(h) * L * 0.5)
      if (a && b) size = Math.max(26, Math.min(400, Math.hypot(a[0] - b[0], a[1] - b[1]) + 14))
    }
    this.place(this.sel, p)
    this.sel.style.width = `${size}px`
    this.sel.style.height = `${Math.max(22, u.kind === 'ship' ? size * 0.4 : size)}px`
    const label = u.kind === 'aircraft' && !u.parked ? u.name : u.name
    const span = this.sel.querySelector('span')
    if (span.textContent !== label) span.textContent = label
  }

  /**
   * A gun station's sight (the AA director's or the gunner's): the cross on
   * the aim (the screen's centre when the camera looks along it), the lead
   * pips on the aimed aircraft, the bracket on it with its range.
   */
  drawGunSight(g, rng) {
    const box = this.box
    const sim = box.sim
    const s = sim.state
    const R = g.range ?? 1500
    const along = box.cameraMode === 'gun'
    const c = along ? [innerWidth / 2, innerHeight / 2] : this.project(g.eye[0] + g.dir[0] * R, g.eye[1] + g.dir[1] * R, g.eye[2] + g.dir[2] * R)
    this.place(this.cross, c)
    this.cross.classList.toggle('on', g.cone > 0 && g.firing)
    this.cross.classList.toggle('off', g.bears === false)
    if (g.aimed >= 0) {
      const j = g.aimed
      this.place(this.bracket, this.project(s.pos[3 * j], s.pos[3 * j + 1], s.pos[3 * j + 2]))
      this.bracket.querySelector('span').textContent = g.range != null ? rng(g.range) : ''
      const showLead = box.aid !== 'record'
      this.place(this.lead, showLead && g.lead ? this.project(g.lead[0], g.lead[1], g.lead[2]) : null)
      this.place(this.lead2, showLead && g.leadLight ? this.project(g.leadLight[0], g.leadLight[1], g.leadLight[2]) : null)
    } else this.bracket.style.display = 'none'
  }

  /**
   * The arena's reticles (round three): the main battery's lead, the torpedoes'
   * spread or an aircraft's torpedo track, the bomb's impact ring.
   */
  drawArena(pl, st) {
    if (st.station === 'bombardier') return
    const c = this.sightc
    const W = innerWidth
    const H = innerHeight
    if (c.width !== W || c.height !== H) {
      c.width = W
      c.height = H
    }
    const g = c.getContext('2d')
    g.clearRect(0, 0, W, H)
    let drew = false
    const line = (pts) => {
      let open = false
      g.beginPath()
      for (const p of pts) {
        const q = this.project(p[0], p[1], p[2])
        if (!q) {
          open = false
          continue
        }
        if (open) g.lineTo(q[0], q[1])
        else g.moveTo(q[0], q[1])
        open = true
      }
      g.stroke()
    }
    // the main battery's lead: where to lay the guns to meet the target on its course
    const t = st.target
    if (pl.kind === 'ship' && t?.lead && (st.station === 'helm' || st.station === 'main')) {
      const p = this.project(t.lead[0], 2, t.lead[2])
      if (p) {
        g.strokeStyle = 'rgba(246,227,160,.95)'
        g.lineWidth = 1.5
        g.beginPath()
        g.moveTo(p[0], p[1] - 8)
        g.lineTo(p[0] + 8, p[1])
        g.lineTo(p[0], p[1] + 8)
        g.lineTo(p[0] - 8, p[1])
        g.closePath()
        g.stroke()
        g.font = '11px Inter, system-ui, sans-serif'
        g.fillStyle = 'rgba(246,227,160,.95)'
        g.fillText('lead', p[0] + 11, p[1] + 4)
        drew = true
      }
    }
    // the torpedoes' spread: the fan of tracks along the aim, dashed while the tubes reload
    const sp = st.spread
    if (sp && sp.n > 0) {
      g.strokeStyle = sp.ready ? 'rgba(190,230,255,.75)' : 'rgba(190,230,255,.3)'
      g.lineWidth = 1
      g.setLineDash(sp.ready ? [] : [6, 6])
      for (let k = 0; k < sp.n; k++) {
        const b = ((sp.bearing + (k - (sp.n - 1) / 2) * sp.deg) * Math.PI) / 180
        const pts = []
        for (let d = 60; d <= sp.length; d += 250) pts.push([sp.from[0] + Math.sin(b) * d, 0.5, sp.from[1] - Math.cos(b) * d])
        line(pts)
      }
      g.setLineDash([])
      drew = true
    }
    // an aircraft's torpedo track ahead, and the bomb's impact ring
    if (pl.kind === 'aircraft') {
      const tr = st.track
      if (tr) {
        const b = (tr.bearing * Math.PI) / 180
        g.strokeStyle = st.cue?.on ? 'rgba(246,227,160,.95)' : 'rgba(190,230,255,.6)'
        g.lineWidth = 1
        const pts = []
        for (let d = 100; d <= 1800; d += 100) pts.push([tr.x + Math.sin(b) * d, 0.5, tr.z - Math.cos(b) * d])
        line(pts)
        drew = true
      }
      const cc = st.ccip
      if (cc) {
        const p = this.project(cc.x, 0, cc.z)
        if (p) {
          g.strokeStyle = cc.onTarget ? 'rgba(246,227,160,.95)' : 'rgba(255,255,255,.7)'
          g.lineWidth = 1.5
          g.beginPath()
          g.arc(p[0], p[1], 10, 0, Math.PI * 2)
          g.moveTo(p[0] - 18, p[1])
          g.lineTo(p[0] - 6, p[1])
          g.moveTo(p[0] + 6, p[1])
          g.lineTo(p[0] + 18, p[1])
          g.stroke()
          drew = true
        }
      }
    }
    c.style.display = drew ? '' : 'none'
  }

  /** The level sight: the predicted impact, the drift line through it along the track, the target's bracket. */
  drawLevelSight(sight, sim) {
    const c = this.sightc
    const W = innerWidth
    const H = innerHeight
    if (c.width !== W || c.height !== H) {
      c.width = W
      c.height = H
    }
    c.style.display = ''
    const g = c.getContext('2d')
    g.clearRect(0, 0, W, H)
    const p = this.project(sight.x, 0, sight.z)
    const a = this.project(sight.x - sight.drift[0] * 3000, 0, sight.z - sight.drift[1] * 3000)
    const b = this.project(sight.x + sight.drift[0] * 3000, 0, sight.z + sight.drift[1] * 3000)
    g.strokeStyle = sight.onTarget ? 'rgba(246,227,160,.95)' : 'rgba(255,255,255,.75)'
    g.lineWidth = 1
    if (a && b) {
      g.beginPath()
      g.moveTo(a[0], a[1])
      g.lineTo(b[0], b[1])
      g.stroke()
    }
    if (p) {
      g.beginPath()
      g.arc(p[0], p[1], 9, 0, Math.PI * 2)
      g.moveTo(p[0] - 16, p[1])
      g.lineTo(p[0] - 5, p[1])
      g.moveTo(p[0] + 5, p[1])
      g.lineTo(p[0] + 16, p[1])
      g.stroke()
    }
    const s = sim.state
    const t = sight.target
    if (t >= 0 && s.alive[t]) {
      this.place(this.bracket, this.project(s.pos[3 * t], 10, s.pos[3 * t + 2]))
      this.bracket.querySelector('span').textContent = sim.slots[t].name
    }
  }

  /** The release cue's window (ROUND-2 §1.2): where the release stands against the window (a torpedo's range band, a bomb's miss against the hull). */
  drawCueWindow(cw, rng) {
    const el = this.cuewin
    if (!cw || cw.value == null || cw.hi == null) return
    let lo
    let hi
    let v
    let span
    if (cw.kind === 'torpedo') {
      if (cw.value > cw.hi * 2.5) return
      span = cw.hi * 1.5
      lo = cw.lo / span
      hi = cw.hi / span
      v = Math.min(1, cw.value / span)
    } else {
      if (cw.value > cw.hi * 8) return
      span = Math.max(1, cw.hi * 4)
      lo = 0
      hi = cw.hi / span
      v = Math.min(1, cw.value / span)
    }
    el.style.display = ''
    const b = el.querySelector('b')
    b.style.left = `${lo * 100}%`
    b.style.width = `${Math.max(1, (hi - lo) * 100)}%`
    el.querySelector('i').style.left = `${v * 100}%`
    el.title = cw.kind === 'torpedo' ? `range ${rng(cw.value)}` : `${rng(cw.value)} off`
  }

  /** The plot inset: radar contacts or what the lookouts see, north up, 30 km to the rim (or 15 nm). */
  drawPlot(pl) {
    const c = this.plot
    const g = c.getContext('2d')
    const W = c.width
    const R = W / 2
    g.clearRect(0, 0, W, W)
    const sim = this.box.sim
    if (!pl) {
      c.style.display = 'none'
      this.plotLabel.textContent = ''
      return
    }
    c.style.display = ''
    const st = pl.state
    const span = st.plotSpan ?? (pl.kind === 'aircraft' ? 20000 : 30000)
    g.strokeStyle = 'rgba(200,230,200,.22)'
    for (const k of [1 / 3, 2 / 3]) {
      g.beginPath()
      g.arc(R, R, R * k, 0, Math.PI * 2)
      g.stroke()
    }
    const radar = (sim._X[pl.unitIndex].model.sensors || []).length > 0
    // (the number and its unit kept together, so the phone's caption inside the small plot breaks between the words)
    this.plotLabel.textContent = `${radar ? 'radar plot' : 'lookouts'} · ${Math.round(span / 1000)}\u00a0km`
    for (const ct of st.contacts || []) {
      if (ct.range > span) continue
      const a = ct.bearing * DEG
      const x = R + (Math.sin(a) * ct.range * R) / span
      const y = R - (Math.cos(a) * ct.range * R) / span
      g.fillStyle = ct.friendly ? 'rgba(150,200,255,.9)' : 'rgba(255,170,140,.95)'
      g.beginPath()
      g.arc(x, y, ct.kind === 'ship' ? 2.6 : 1.4, 0, Math.PI * 2)
      g.fill()
    }
    // own ship or aircraft, and its heading
    g.strokeStyle = 'rgba(240,235,210,.95)'
    g.beginPath()
    const h = st.heading * DEG
    g.moveTo(R, R)
    g.lineTo(R + Math.sin(h) * 10, R - Math.cos(h) * 10)
    g.stroke()
  }

  dispose() {
    this.el.remove()
  }
}
