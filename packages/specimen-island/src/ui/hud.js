import { VEHICLE_FX } from '../data/vehicles.js'
import { clamp, wrapAngle, yawTo, formatTime } from '../core/mathx.js'
import { doseReadout } from './dose.js'
import { Viewfinder } from './viewfinder.js'

// The heads-up display. Reads game state each frame and writes the DOM only
// when something changed. Deus Ex-ish information: an eye that shows how
// visible you are, arcs around the reticle for every animal that has noticed
// you, and a vitals readout on anything you have catalogued.

const $ = (id) => document.getElementById(id)

export class HUD {
  constructor(G) {
    this.G = G
    this.el = {}
    for (const id of [
      'hud', 'crosshair', 'hitmarker', 'prompt', 'promptText', 'promptRing', 'health', 'stamina', 'eye', 'eyeLabel', 'noise', 'weapon', 'weaponName', 'ammo',
      'gadgets', 'compass', 'compassStrip', 'objectives', 'score', 'clock', 'toasts', 'detect', 'target', 'scope', 'blind', 'vignette', 'heliHud', 'fade', 'hurtArrow',
    ])
      this.el[id] = $(id)
    this.detectCtx = this.el.detect.getContext('2d')
    this.cache = {}
    this.targetTimer = 0
    this.hitT = 0
    this.vignette = 0
    G.events.on('dart:hit', (e) => this.hit(e))
    G.events.on('score', (e) => this.toast(`${e.delta > 0 ? '+' : ''}${e.delta}  ${e.reason}`, e.delta > 0 ? 'score' : 'penalty'))
    G.events.on('player:damaged', ({ amount }) => (this.vignette = Math.min(1, this.vignette + amount / 25)))
    // the vehicle you are in reports its own hits: pulse the vignette, flash the hull readout
    this.hullFlash = 0
    G.events.on('vehicle:damaged', ({ vehicle, amount }) => {
      if (!vehicle.occupied) return
      this.vignette = Math.min(1, this.vignette + amount * VEHICLE_FX.vignettePerHp)
      this.hullFlash = VEHICLE_FX.flashTime
    })
    this.buildCompass()
    this.viewfinder = new Viewfinder(G)
  }

  set(key, el, value, prop = 'textContent') {
    if (this.cache[key] === value) return
    this.cache[key] = value
    if (prop === 'html') el.innerHTML = value
    else if (prop.startsWith('style.')) el.style[prop.slice(6)] = value
    else el[prop] = value
  }

  toast(text, kind = 'info', seconds = 4.5) {
    const d = document.createElement('div')
    d.className = 'toast ' + kind
    d.textContent = text
    this.el.toasts.prepend(d)
    while (this.el.toasts.children.length > 6) this.el.toasts.lastChild.remove()
    setTimeout(() => d.classList.add('out'), seconds * 1000)
    setTimeout(() => d.remove(), seconds * 1000 + 600)
    if (kind === 'objective') this.G.audio?.play('objective')
    else if (kind === 'penalty') this.G.audio?.play('penalty')
  }

  hit(e) {
    this.hitT = 0.5
    this.el.hitmarker.textContent = e.zone + (e.dose ? ` +${Math.round(e.dose)}u` : e.damage ? ` −${Math.round(e.damage)}` : '')
    this.el.hitmarker.className = e.dose === 0 && !e.damage ? 'show armor' : e.damage ? 'show lethal' : 'show'
  }

  buildCompass() {
    const strip = this.el.compassStrip
    strip.innerHTML = ''
    const labels = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' }
    for (let deg = 0; deg < 360; deg += 15) {
      const t = document.createElement('div')
      t.className = 'tick' + (labels[deg] ? ' major' : '')
      t.dataset.deg = deg
      t.textContent = labels[deg] || '·'
      strip.appendChild(t)
    }
    this.markers = []
  }

  update(dt) {
    const G = this.G
    const p = G.player
    const W = G.weapons
    const veh = G.vehicle
    const flying = !!veh // in any vehicle, the helicopter or the jeep
    const camYaw = veh ? veh.camYaw : p.yaw

    // vitals
    this.set('hp', this.el.health, `${clamp(p.health, 0, 100)}%`, 'style.width')
    this.set('st', this.el.stamina, `${Math.round(p.stamina * 100)}%`, 'style.width')
    // stealth eye
    const vis = G.stealth.visibility
    const open = clamp(vis / 1.2, 0.08, 1)
    this.set('eyeOpen', this.el.eye, `scaleY(${open.toFixed(2)})`, 'style.transform')
    const col = vis < 0.25 ? '#6fd08c' : vis < 0.6 ? '#d8d070' : '#ff7a50'
    this.set('eyeCol', this.el.eye, col, 'style.background')
    this.set('eyeLbl', this.el.eyeLabel, flying ? (veh.kind === 'heli' ? 'AIRBORNE' : 'DRIVING') : vis < 0.25 ? 'HIDDEN' : vis < 0.6 ? 'LOW PROFILE' : 'EXPOSED')
    this.set('noise', this.el.noise, `${clamp(G.stealth.playerNoise / 25, 0, 1) * 100}%`, 'style.width')

    // weapon
    const def = W.def
    this.set('wname', this.el.weaponName, flying ? veh.hudName : def.name)
    let ammo = ''
    if (!flying && def.ammo) ammo = `${W.mag[def.id]} <span>/ ${G.inventory.count(def.ammo)}</span>${W.reloadT > 0 ? ' <em>RELOADING</em>' : ''}`
    else if (!flying && def.kind === 'scanner') ammo = `<span>${G.science.catalogue.size} species</span>`
    else if (!flying && def.kind === 'camera') ammo = `${G.photos.count} <span>/ ${Object.keys(G.species).length} species photographed</span>`
    this.set('ammo', this.el.ammo, ammo, 'html')
    const slots = W.owned()
      .map((w) => `<b class="${w.id === W.current ? 'on' : ''}">${w.slot}</b>`)
      .join('')
    this.set('gad', this.el.gadgets, `${slots}<i>G</i> stone ×${G.inventory.count('stone')} <i>T</i> flare ×${G.inventory.count('flare')} <i>H</i> med ×${G.inventory.count('medkit')}`, 'html')

    // crosshair / scope
    const scoped = !flying && !!W.scoped()
    this.el.scope.classList.toggle('show', scoped)
    this.set('xh', this.el.crosshair, flying ? 'none' : def.kind === 'scanner' ? 'scan' : def.id === 'shotgun' ? 'wide' : 'dot', 'className')
    this.el.crosshair.style.opacity = scoped ? 0 : 1
    this.hitT -= dt
    if (this.hitT <= 0) this.el.hitmarker.className = ''
    this.viewfinder.update(dt)

    // score / clock
    this.set('score', this.el.score, `${G.scoring.total} <span>pts</span>`, 'html')
    this.set('clock', this.el.clock, formatTime(G.sky.hours))

    // objectives
    const objs = G.objectives
      .active()
      .slice(0, 4)
      .map((o) => `<div class="obj"><b>${o.title}</b>${objs_progress(G, o)}<br><span>${o.text}</span></div>`)
      .join('')
    this.set('objs', this.el.objectives, objs, 'html')

    // compass
    this.updateCompass(camYaw)

    // interaction prompt
    const pr = flying ? null : G.interact.prompt()
    if (pr) {
      this.el.prompt.classList.add('show')
      this.set('prt', this.el.promptText, pr.blocked ? `<em>${pr.label}</em><br><span class="blocked">${pr.blocked}</span>` : `<b>E</b> ${pr.hold ? 'hold · ' : ''}${pr.label}`, 'html')
      this.el.promptRing.style.setProperty('--p', (pr.progress * 100).toFixed(1))
      this.el.promptRing.style.display = pr.hold && !pr.blocked ? 'block' : 'none'
    } else this.el.prompt.classList.remove('show')

    // overlays
    this.vignette = Math.max(0, this.vignette - dt * 0.8)
    const low = p.health < 35 ? (35 - p.health) / 35 : 0
    this.el.vignette.style.opacity = Math.max(this.vignette, low * (0.5 + 0.2 * Math.sin(G.time * 6))).toFixed(2)
    this.el.blind.style.opacity = clamp(p.blindT / 2, 0, 0.95).toFixed(2)
    this.el.fade.style.opacity = clamp(p.fade * 1.5, 0, 1).toFixed(2)
    const hurtRecent = G.time - p.lastHurt < 1.2
    this.el.hurtArrow.style.opacity = hurtRecent ? 1 - (G.time - p.lastHurt) / 1.2 : 0
    this.el.hurtArrow.style.transform = `translate(-50%,-50%) rotate(${-wrapAngle(p.hurtDir)}rad)`

    // vehicle panel (helicopter or jeep)
    this.hullFlash = Math.max(0, this.hullFlash - dt)
    this.el.heliHud.classList.toggle('show', flying)
    if (flying) this.set('veh', this.el.heliHud, this.vehiclePanel(veh), 'html')

    this.drawDetection(camYaw)
    this.targetTimer -= dt
    if (this.targetTimer <= 0) {
      this.targetTimer = 0.1
      this.updateTarget()
    }
  }

  // Speed, hull and (for the helicopter) altitude, climb rate and fuel. A
  // fresh hit flashes the hull readout red; a failing hull keeps blinking.
  vehiclePanel(v) {
    const G = this.G
    const blink = (hz) => Math.sin(G.time * hz * Math.PI * 2) > 0
    const hit = this.hullFlash > 0
    const hullCls = hit ? (blink(6) ? 'flash' : 'warn') : v.health < VEHICLE_FX.warnBelow ? (blink(1.5) ? 'warn' : '') : v.health < VEHICLE_FX.smokeBelow ? 'warn' : ''
    const hull = `<div class="hull${hit ? ' hit' : ''}">HULL <b class="${hullCls}">${Math.round(v.health)}%</b></div>`
    const spd = `<div>SPD <b>${Math.round(v.speed * 3.6)}</b> km/h</div>`
    if (v.kind === 'heli') {
      const agl = v.pos.y - Math.max(G.island.heightAt(v.pos.x, v.pos.z), G.island.waterAt(v.pos.x, v.pos.z))
      // sinking faster than a skid landing can take, close to the ground: red
      const vs = v.onGround ? 0 : v.vel.y
      const sinkCls = vs < -v.tune.impact.terrain.min && agl < 15 ? 'warn' : ''
      return `<div>ALT <b>${Math.round(agl)}</b> m</div><div>V/S <b class="${sinkCls}">${Math.abs(vs) < 0.05 ? '0.0' : (vs > 0 ? '+' : '') + vs.toFixed(1)}</b> m/s</div>${spd}<div>FUEL <b class="${v.fuel < 0.2 ? 'warn' : ''}">${Math.round(v.fuel * 100)}%</b></div>${hull}<div class="hint">${v.onGround ? 'E: exit · ' : ''}V: camera</div>`
    }
    return `${spd}${hull}<div>LIGHTS <b>${v.lights ? 'ON' : 'OFF'}</b></div><div class="hint">${v.canExit() ? 'E: exit · ' : ''}Space: handbrake · F: lights · V: camera</div>`
  }

  updateCompass(camYaw) {
    const G = this.G
    const strip = this.el.compassStrip
    const width = this.el.compass.clientWidth || 600
    const pxPerRad = width / 2.2
    // heading in compass degrees (0 = north, clockwise)
    const heading = -camYaw
    for (const t of strip.children) {
      if (t.classList.contains('marker')) continue
      const a = wrapAngle((t.dataset.deg * Math.PI) / 180 - heading)
      const x = a * pxPerRad
      t.style.transform = `translateX(${x}px)`
      t.style.opacity = Math.abs(a) > 1.05 ? 0 : 1
    }
    // markers: objective(s) and discovered places
    const pos = G.vehicle ? G.vehicle.pos : G.player.pos
    const want = []
    for (const o of G.objectives.active()) {
      const m = G.objectives.marker(o)
      if (m) want.push({ x: m.x, z: m.z, cls: 'obj', label: '◆', dist: true })
    }
    for (const poi of G.island.pois) if (G.discovered.has(poi.id) || G.flags.get('mapRevealed')) want.push({ x: poi.x, z: poi.z, cls: 'poi', label: '▾' })
    while (this.markers.length < want.length) {
      const d = document.createElement('div')
      d.className = 'marker'
      strip.appendChild(d)
      this.markers.push(d)
    }
    this.markers.forEach((d, i) => {
      const m = want[i]
      if (!m) {
        d.style.opacity = 0
        return
      }
      // world yaw toward the marker, then the same transform as the ticks
      const yaw = yawTo(pos.x, pos.z, m.x, m.z)
      const a = wrapAngle(-yaw - heading)
      d.className = 'marker ' + m.cls
      const dist = Math.hypot(m.x - pos.x, m.z - pos.z)
      d.innerHTML = m.dist ? `${m.label}<small>${Math.round(dist)}m</small>` : m.label
      d.style.transform = `translateX(${a * pxPerRad}px)`
      d.style.opacity = Math.abs(a) > 1.05 ? 0 : 1
    })
  }

  drawDetection(camYaw) {
    const G = this.G
    const ctx = this.detectCtx
    const S = this.el.detect.width
    ctx.clearRect(0, 0, S, S)
    const p = G.vehicle ? G.vehicle.pos : G.player.pos
    for (const c of G.ecology.active) {
      if (!c.vitals.conscious) continue
      const aw = c.perception.awareness
      if (aw < 0.05) continue
      const d = Math.hypot(c.pos.x - p.x, c.pos.z - p.z)
      if (d > 140) continue
      const rel = wrapAngle(yawTo(p.x, p.z, c.pos.x, c.pos.z) - camYaw)
      const ang = -rel - Math.PI / 2
      const hostile = c.brain.state === 'hunt' || c.brain.state === 'charge' || c.brain.state === 'attack' || c.brain.state === 'threaten'
      const col = aw >= 1 ? (hostile ? '255,70,50' : '255,150,60') : aw >= 0.35 ? '255,220,90' : '230,230,230'
      const r = S * 0.4
      const span = 0.18 + 0.1 * clamp(1 - d / 140, 0, 1)
      ctx.lineWidth = 5
      ctx.strokeStyle = `rgba(${col},0.25)`
      ctx.beginPath()
      ctx.arc(S / 2, S / 2, r, ang - span, ang + span)
      ctx.stroke()
      ctx.strokeStyle = `rgba(${col},${aw >= 1 ? 0.6 + 0.4 * Math.sin(G.time * 10) : 0.9})`
      ctx.beginPath()
      ctx.arc(S / 2, S / 2, r, ang - span, ang - span + span * 2 * clamp(aw, 0, 1))
      ctx.stroke()
    }
  }

  updateTarget() {
    const G = this.G
    const el = this.el.target
    if (G.vehicle || !G.player.alive) {
      this.set('tgt', el, '', 'html')
      return
    }
    const cam = G.camera
    const dir = G.player.look
    const zoomed = G.weapons.aim > 0.5 || G.weapons.def.kind === 'scanner'
    const hit = G.ecology.raycast(cam.position, dir, zoomed ? 160 : 45)
    if (!hit || G.physics.raycast(cam.position.x, cam.position.y, cam.position.z, dir.x, dir.y, dir.z, hit.t)) {
      this.set('tgt', el, '', 'html')
      return
    }
    const c = hit.creature
    const known = G.science.known(c.sp.id)
    const v = c.vitals
    const P = c.perception
    let state
    if (!v.alive) state = c.rec.cause === 'predation' ? 'DEAD (predation)' : 'DEAD'
    else if (v.state === 'unconscious') state = 'UNCONSCIOUS'
    else if (c.brain.state === 'flee') state = 'FLEEING'
    else if (['hunt', 'attack', 'charge', 'spit'].includes(c.brain.state)) state = 'HOSTILE'
    else if (c.brain.state === 'threaten') state = 'THREATENED'
    else if (P.awareness >= 1) state = 'ALERTED'
    else if (P.awareness >= 0.35) state = 'SUSPICIOUS'
    else state = 'UNAWARE'
    if (v.alive && v.state === 'drowsy') state += ' · DROWSY'
    // a melee weapon says when the animal is within its reach
    const held = G.weapons.def
    const reach = held.kind === 'melee' && hit.t <= held.reach ? ' · IN REACH' : ''
    let html = `<div class="tname">${known ? c.sp.name : 'Unknown species'}<small>${Math.round(hit.t)} m · ${hit.zone === 'armor' ? 'ARMOUR' : hit.zone.toUpperCase()}${reach}</small></div><div class="tstate s-${state.split(' ')[0].toLowerCase()}">${state}</div>`
    if (known && v.alive) {
      const sp = c.sp.sedation
      const L = sp.lethal
      const cur = (c.rec.sedative / L) * 100
      const pend = (c.rec.pending / L) * 100
      const ko = (sp.ko / L) * 100
      html += `<div class="sedbar"><i style="width:${cur.toFixed(1)}%"></i><u style="left:${cur.toFixed(1)}%;width:${pend.toFixed(1)}%"></u><b style="left:${ko.toFixed(1)}%"></b></div>`
      html += doseReadout(c.sp, v.state, c.rec.sedative, c.rec.pending, hit.zone, held)
        .map((l) => `<div class="dose">${l.warn ? `<span class="bad">${l.text}</span>` : l.text}</div>`)
        .join('')
    } else if (!known) html += `<div class="dose">Scan [1] to learn its tolerances</div>`
    const s = c.rec.science
    if (known) html += `<div class="sci">${['blood', 'measure', 'tag'].map((k) => `<span class="${s[k] ? 'done' : ''}">${k}</span>`).join('')}</div>`
    this.set('tgt', el, html, 'html')
  }
}

function objs_progress(G, o) {
  const pr = G.objectives.progress(o)
  return pr ? ` <em>${pr}</em>` : ''
}
