// Input (ENGINEERING.md §8): keyboard, mouse and touch collected into
// player.input each frame, as levels the controls hold (axes, held keys,
// never zeroed between sim steps) and counters the sim consumes (a press in
// a frame with no step is not lost). Every listener checks app.mode first:
// only 'moment' reaches here, and only while the player's input is not
// scripted (the smoke test writes it itself).
//
// Aircraft: mouse-aim by default (the pointer, in pointer lock or not, sets a
// direction the instructor flies the nose to; a held right button or M
// switches to direct control); W/S A/D direct pitch and roll; Q/E yaw; R/F or
// PageUp/PageDown throttle; Space or the left button guns (preventDefault); B
// bomb; T torpedo. Ship: A/D a persistent helm in five steps; W/S the
// telegraph's seven; the mouse lays the main battery (the wheel ladders the
// range ±100 m, Shift ±400 m), a click fires a salvo and a held button fires
// as the turrets come ready; T torpedoes; Space directs the AA at the
// pointer's aircraft. Backspace releases the controls, with a confirm; losing
// pointer lock pauses and offers release.
//
// Round two (ROUND-2.md §4): Tab switches the held unit's station. The gun
// stations (the AA director, the gunner) aim with the mouse: relative in
// pointer lock, the pointer's offset from the screen's centre as a turning
// rate without it, or a drag on touch; the left button or Space fires. The
// bombardier steers the run-in with A/D and releases the stick with B. Until
// the player first acts (a key, a button, a move of the mouse) nothing is
// written into the levels, so a unit taken and left alone stays on the
// record (the sim's soft take). A bookmark (pl.allStations) keeps the first
// build's bindings until the first Tab.
//
// Round three (ROUND-3.md §4): in a wargame (battle.arena) Tab hops to the
// next friendly unit of the same kind and 1–4 to the nearest friendly
// carrier, battleship or cruiser, destroyer, aircraft (battle.hop); the
// stations, which Tab switched in the record's box, go round on Shift+Tab
// (the project manager's decision 39), the backquote key (`) or the station
// bar.

import * as THREE from 'three'
import { AIRCRAFT_KEYS, SHIP_KEYS, GUN_KEYS, BOMBARDIER_KEYS, HELM_STEPS, TELEGRAPH_LEVELS, GUN_HELP, BOMBARDIER_HELP, matches } from './bindings.js'
import { TouchControls } from './touch.js'

const DEG = Math.PI / 180
// round three: the wargame's hops on the number keys (ROUND-3 §1)
export const HOP_KEYS = { Digit1: 'carrier', Digit2: 'capital', Digit3: 'destroyer', Digit4: 'aircraft', Numpad1: 'carrier', Numpad2: 'capital', Numpad3: 'destroyer', Numpad4: 'aircraft' }
const GUN_RATE = 70 // deg/s at the screen's edge, the pointer's offset as a rate (no pointer lock)
const GUN_SENS = 0.12 // deg per pixel of locked movement

export class Input {
  /** battle: for the player, the scene's camera and HUD, release and time. */
  constructor(app, battle) {
    this.app = app
    this.battle = battle
    this.held = new Set()
    this.ac = new AbortController()
    this.pointer = { x: innerWidth / 2, y: innerHeight / 2, inside: false }
    this.lock = false
    this.aim = { yaw: 0, pitch: 0, init: false }
    this.gun = { az: null, el: null }
    this.direct = false
    this.rightHeld = false
    this.leftDownAt = 0
    this.leftHeld = false
    this.ladder = 0
    this.confirmRelease = 0
    this.acted = false
    this.ray = new THREE.Raycaster()
    this.v = new THREE.Vector2()
    this.touch = null
    this.bind()
  }

  get player() {
    return this.battle.sim?.player ?? null
  }

  /** Whether the input is ours this frame. */
  get live() {
    const p = this.player
    return this.app.mode === 'moment' && p && !p.scripted
  }

  /** The station whose bindings apply: a bookmark's own (the first build's) until the first Tab. */
  get station() {
    const p = this.player
    if (!p || p.allStations) return null
    return p.station
  }

  get gunStation() {
    const st = this.station
    return st === 'aa' || st === 'gunner'
  }

  bind() {
    const on = { signal: this.ac.signal }
    const canvas = this.app.canvas
    addEventListener('keydown', (e) => this.key(e, true), { ...on, capture: true })
    addEventListener('keyup', (e) => this.key(e, false), { ...on, capture: true })
    addEventListener('blur', () => this.held.clear(), on)
    canvas.addEventListener('pointermove', (e) => this.move(e), on)
    canvas.addEventListener('pointerdown', (e) => this.down(e), on)
    addEventListener('pointerup', (e) => this.up(e), on)
    canvas.addEventListener('wheel', (e) => this.wheel(e), { ...on, passive: false })
    canvas.addEventListener('contextmenu', (e) => {
      if (this.live) e.preventDefault()
    }, on)
    document.addEventListener('pointerlockchange', () => {
      const was = this.lock
      this.lock = document.pointerLockElement === canvas
      // losing the lock (Esc) pauses and offers release
      // (at the checkpoint the battle is already paused and the lock let go on purpose: the bar's buttons need the pointer)
      if (was && !this.lock && this.live && this.battle.running) this.battle.pauseForRelease?.()
    }, on)
    canvas.addEventListener('touchstart', () => this.ensureTouch(), { ...on, passive: true })
    if (matchMedia?.('(pointer: coarse)')?.matches) this.ensureTouch()
  }

  ensureTouch() {
    if (this.touch || !this.live) return
    this.touch = new TouchControls(this)
  }

  /** Ask for pointer lock (from the click that took the controls); never on a coarse pointer, whose touch controls need the pointer. */
  requestLock() {
    if (matchMedia?.('(pointer: coarse)')?.matches) return
    try {
      const p = this.app.canvas.requestPointerLock?.()
      // (a lock granted after the controls were given back is let go)
      p?.then?.(() => {
        if (this.ac.signal.aborted && document.pointerLockElement === this.app.canvas) document.exitPointerLock?.()
      }, () => {})
    } catch {
      // (no lock: the pointer's place on the screen aims instead)
    }
  }

  /** The key map for the held unit at its station. */
  keyMap(p) {
    const st = this.station
    if (st === 'aa' || st === 'gunner') return GUN_KEYS
    if (st === 'bombardier') return BOMBARDIER_KEYS
    return p.kind === 'aircraft' ? AIRCRAFT_KEYS : SHIP_KEYS
  }

  /** The station switched (Battle.setStation): the new station's aim taken up, the fire let go, the touch controls rebuilt. */
  onStation(name) {
    const p = this.player
    this.aim.init = false
    this.gun.az = null
    this.gun.el = null
    if (p) p.input.fireHeld = false
    if (this.touch) {
      this.touch.dispose()
      this.touch = null
      this.ensureTouch()
    }
    const hud = this.battle.scene?.hud
    if (name === 'aa' || name === 'gunner') hud?.showKeys(GUN_HELP, 4)
    else if (name === 'bombardier') hud?.showKeys(BOMBARDIER_HELP, 4)
  }

  key(e, down) {
    // (in a moment Enter presses nothing on the page: a focused button would restart the sortie under the player)
    if (this.app.mode === 'moment' && (e.code === 'Enter' || e.code === 'NumpadEnter')) e.preventDefault()
    if (!this.live) return
    const p = this.player
    const code = e.code
    // the wargame's hops (Tab, 1–4) and its station keys (Shift+Tab, `)
    if (this.battle.arena && (code === 'Tab' || HOP_KEYS[code] || code === 'Backquote')) {
      e.preventDefault()
      e.stopPropagation()
      if (!down || e.repeat) return
      this.acted = true
      if (code === 'Backquote' || (code === 'Tab' && e.shiftKey)) this.battle.cycleStation?.(1)
      else this.battle.hop?.(code === 'Tab' ? 'next' : HOP_KEYS[code])
      return
    }
    // Tab switches the station (any map; a bookmark's too: its first Tab gives it stations)
    if (code === 'Tab') {
      e.preventDefault()
      e.stopPropagation()
      if (down && !e.repeat) this.battle.cycleStation?.(e.shiftKey ? -1 : 1)
      return
    }
    const map = this.keyMap(p)
    const ours = Object.values(map).some((v) => v.includes(code))
    if (!ours) return
    // Space would scroll the page; Backspace would navigate back; the arrows would scroll
    e.preventDefault()
    e.stopPropagation()
    if (down && e.repeat && !['KeyR', 'KeyF', 'PageUp', 'PageDown'].includes(code)) return
    if (down) {
      this.held.add(code)
      this.acted = true
    } else this.held.delete(code)
    const inp = p.input
    if (map === GUN_KEYS) {
      if (matches(map, 'fire', code)) inp.fireHeld = down || this.leftHeld
      if (!down) return
      if (matches(map, 'release', code)) return this.askRelease('Backspace')
      if (matches(map, 'units', code)) return this.battle.scene?.hud?.toggleUnits()
      if (matches(map, 'camera', code)) return this.battle.cycleCamera?.()
      if (matches(map, 'zoom', code)) {
        const z = this.battle.scene?.cameras?.cycleZoom()
        this.battle.scene?.hud?.say(`${z}×`, 1)
      } else if (matches(map, 'faster', code)) this.battle.cycleTime?.(1)
      else if (matches(map, 'slower', code)) this.battle.cycleTime?.(-1)
      return
    }
    if (map === BOMBARDIER_KEYS) {
      if (!down) return
      if (matches(map, 'release', code)) return this.askRelease('Backspace')
      if (matches(map, 'units', code)) return this.battle.scene?.hud?.toggleUnits()
      if (matches(map, 'camera', code)) return this.battle.cycleCamera?.()
      if (matches(map, 'bomb', code)) inp.bombCount++
      else if (matches(map, 'zoom', code)) {
        const z = this.battle.scene?.cameras?.cycleZoom()
        this.battle.scene?.hud?.say(`${z}×`, 1)
      } else if (matches(map, 'faster', code)) this.battle.cycleTime?.(1)
      else if (matches(map, 'slower', code)) this.battle.cycleTime?.(-1)
      return
    }
    if (!down) {
      if (p.kind === 'aircraft' && matches(map, 'guns', code)) p.input.fireHeld = this.leftHeld
      return
    }
    const hud = this.battle.scene?.hud
    if (matches(map, 'release', code)) return this.askRelease('Backspace')
    if (matches(map, 'units', code)) return hud?.toggleUnits()
    if (matches(map, 'camera', code)) return this.battle.cycleCamera?.()
    if (p.kind === 'aircraft') {
      if (matches(map, 'guns', code)) inp.fireHeld = true
      else if (matches(map, 'bomb', code)) inp.bombCount++
      else if (matches(map, 'torpedo', code)) inp.torpedoCount++
      else if (matches(map, 'sight', code)) this.battle.toggleSight?.()
      else if (matches(map, 'time', code)) this.battle.cycleTime?.()
      else if (matches(map, 'direct', code)) {
        this.direct = !this.direct
        hud?.say(this.direct ? 'Direct control' : 'Mouse aim', 1.5)
      }
    } else {
      if (matches(map, 'helmPort', code) || matches(map, 'helmStarboard', code)) {
        const d = matches(map, 'helmPort', code) ? -1 : 1
        const i = HELM_STEPS.reduce((b, v, k) => (Math.abs(v - inp.helm) < Math.abs(HELM_STEPS[b] - inp.helm) ? k : b), 0)
        inp.helm = HELM_STEPS[Math.max(0, Math.min(HELM_STEPS.length - 1, i + d))]
      } else if (matches(map, 'telegraphUp', code) || matches(map, 'telegraphDown', code)) {
        const d = matches(map, 'telegraphUp', code) ? 1 : -1
        const i = TELEGRAPH_LEVELS.reduce((b, v, k) => (Math.abs(v - inp.telegraph) < Math.abs(TELEGRAPH_LEVELS[b] - inp.telegraph) ? k : b), 0)
        inp.telegraph = TELEGRAPH_LEVELS[Math.max(0, Math.min(TELEGRAPH_LEVELS.length - 1, i + d))]
      } else if (matches(map, 'torpedo', code)) inp.torpedoCount++
      else if (matches(map, 'spread', code)) {
        inp.spread = inp.spread === 'wide' ? 'narrow' : 'wide'
        hud?.say(`${inp.spread} spread`, 1.5)
      } else if (matches(map, 'aa', code)) {
        inp.aa = true
        inp.aaDir = this.pointerRay()
        setTimeout(() => (inp.aa = false), 120)
      } else if (matches(map, 'starshell', code)) inp.starshellCount++
      else if (matches(map, 'battery', code)) {
        const n = this.battle.sim?._X[p.unitIndex]?.guns?.length ?? 1
        inp.battery = ((inp.battery | 0) + 1) % Math.max(1, n)
        hud?.say(`battery ${inp.battery + 1}`, 1.5)
      } else if (matches(map, 'zoom', code)) {
        const z = this.battle.scene?.cameras?.cycleZoom()
        hud?.say(`${z}×`, 1)
      } else if (matches(map, 'faster', code)) this.battle.cycleTime?.(1)
      else if (matches(map, 'slower', code)) this.battle.cycleTime?.(-1)
    }
  }

  /** Backspace, or the touch controls' release: twice within three seconds gives the controls back. */
  askRelease(how) {
    const now = performance.now()
    if (now - this.confirmRelease < 3000) {
      this.confirmRelease = 0
      this.battle.release()
    } else {
      this.confirmRelease = now
      this.battle.scene?.hud?.say(`${how} again to release the controls`, 3)
    }
  }

  move(e) {
    this.pointer.x = e.clientX
    this.pointer.y = e.clientY
    this.pointer.inside = true
    if (!this.live) return
    const p = this.player
    if (e.movementX || e.movementY) this.acted = true
    if (this.gunStation) {
      if (this.lock) {
        this.gunInit()
        this.gun.az = (this.gun.az + e.movementX * GUN_SENS + 360) % 360
        this.gun.el = Math.max(-10, Math.min(85, this.gun.el - e.movementY * GUN_SENS))
      }
      return
    }
    if (this.lock && p.kind === 'aircraft') {
      // in pointer lock the mouse turns an aim direction on a sphere about the aircraft
      this.aim.yaw += e.movementX * 0.0025
      this.aim.pitch = Math.max(-1.5, Math.min(1.5, this.aim.pitch - e.movementY * 0.0025))
    }
    if (this.lock && p.kind === 'ship' && this.battle.scene?.cameras) this.battle.scene.cameras.addLook(e.movementX * 0.002, -e.movementY * 0.002)
  }

  /** The gun's aim taken up from the input (the sim's enterStation sets a first one: the nearest aircraft of the other side). */
  gunInit() {
    if (this.gun.az != null) return
    const inp = this.player.input
    this.gun.az = inp.aimAz ?? 0
    this.gun.el = inp.aimEl ?? 15
  }

  down(e) {
    if (!this.live) return
    const p = this.player
    this.acted = true
    if (e.button === 2) {
      this.rightHeld = true
      return
    }
    if (e.button !== 0) return
    this.leftHeld = true
    this.leftDownAt = performance.now()
    if (this.gunStation) {
      p.input.fireHeld = true
      if (!this.lock && !matchMedia?.('(pointer: coarse)')?.matches) this.requestLock()
      return
    }
    if (this.station === 'bombardier') {
      p.input.bombCount++
      return
    }
    if (this.station === 'torpedoes') {
      p.input.torpedoCount++
      return
    }
    if (p.kind === 'aircraft') p.input.fireHeld = true
    else {
      p.input.salvoCount++
      this.ladder = 0
    }
  }

  up(e) {
    if (e.button === 2) this.rightHeld = false
    if (e.button !== 0) return
    this.leftHeld = false
    const p = this.player
    if (!p) return
    if (this.gunStation) p.input.fireHeld = this.held.has('Space')
    else if (p.kind === 'aircraft') p.input.fireHeld = this.held.has('Space')
    else p.input.fireHeld = false
  }

  wheel(e) {
    if (!this.live) return
    const p = this.player
    if (p.kind !== 'ship' || this.gunStation) return
    e.preventDefault()
    const step = e.shiftKey ? 400 : 100
    this.ladder += e.deltaY < 0 ? step : -step
  }

  /** A world direction through the pointer (or the screen's centre in pointer lock). */
  pointerRay() {
    const cam = this.battle.scene?.camera
    if (!cam) return [0, 0, -1]
    const x = this.lock ? 0 : (this.pointer.x / innerWidth) * 2 - 1
    const y = this.lock ? 0 : -(this.pointer.y / innerHeight) * 2 + 1
    this.v.set(x, y)
    this.ray.setFromCamera(this.v, cam)
    const d = this.ray.ray.direction
    return [d.x, d.y, d.z]
  }

  /** Once a frame: the held keys into levels, the pointer into the aim. */
  update(dt) {
    if (!this.live) return
    const p = this.player
    const inp = p.input
    const h = (codes) => codes.some((c) => this.held.has(c))
    if (this.touch) this.touch.update(dt)
    if (this.gunStation) {
      // the gun's aim: relative in pointer lock (move()), the pointer's offset as a rate without it
      this.gunInit()
      if (!this.lock && this.pointer.inside && !this.touch?.active) {
        const ox = (this.pointer.x - innerWidth / 2) / (innerWidth / 2)
        const oy = (this.pointer.y - innerHeight / 2) / (innerHeight / 2)
        const dz = (v) => (Math.abs(v) < 0.08 ? 0 : v - Math.sign(v) * 0.08)
        this.gun.az = (this.gun.az + dz(ox) * GUN_RATE * dt + 360) % 360
        this.gun.el = Math.max(-10, Math.min(85, this.gun.el - dz(oy) * GUN_RATE * 0.6 * dt))
      }
      inp.aimAz = this.gun.az
      inp.aimEl = this.gun.el
      return
    }
    if (this.station === 'bombardier') {
      // the run-in's heading, steered (the pilot's director): A/D
      inp.roll = (h(BOMBARDIER_KEYS.steerRight) ? 1 : 0) - (h(BOMBARDIER_KEYS.steerLeft) ? 1 : 0)
      inp.pitch = 0
      return
    }
    if (p.kind === 'aircraft') {
      // (nothing is written until the player first acts: a take left alone stays on the record)
      if (!this.acted && !this.touch?.active) return
      const K = AIRCRAFT_KEYS
      const st = p.state
      const keysPitch = (h(K.pitchUp) ? 1 : 0) - (h(K.pitchDown) ? 1 : 0)
      const keysRoll = (h(K.rollRight) ? 1 : 0) - (h(K.rollLeft) ? 1 : 0)
      const direct = this.direct || this.rightHeld || keysPitch !== 0 || keysRoll !== 0 || this.touch?.active
      if (!this.touch?.active) {
        inp.pitch = keysPitch
        inp.roll = keysRoll
      }
      inp.yaw = (h(K.yawRight) ? 1 : 0) - (h(K.yawLeft) ? 1 : 0)
      if (h(K.throttleUp)) inp.throttle = Math.min(1, inp.throttle + dt * 0.5)
      if (h(K.throttleDown)) inp.throttle = Math.max(0, inp.throttle - dt * 0.5)
      if (direct) {
        inp.mode = 'direct'
        inp.aimDir = null
        this.aim.init = false
      } else {
        inp.mode = 'aim'
        if (this.lock) {
          if (!this.aim.init) {
            this.aim.yaw = (st.heading ?? 0) * DEG
            this.aim.pitch = (st.pitch ?? 0) * DEG
            this.aim.init = true
          }
          const cp = Math.cos(this.aim.pitch)
          inp.aimDir = [Math.sin(this.aim.yaw) * cp, Math.sin(this.aim.pitch), -Math.cos(this.aim.yaw) * cp]
        } else if (this.pointer.inside) inp.aimDir = this.pointerRay()
      }
    } else {
      // the pointer on the sea lays the main battery (and the torpedoes' bearing): bearing and range from the ship (the ladder adds to the range)
      const cam = this.battle.scene?.camera
      if (cam && (this.pointer.inside || this.lock)) {
        const d = this.pointerRay()
        const s = this.battle.sim.state
        const i = p.unitIndex
        if (d[1] < -1e-4) {
          const t = -cam.position.y / d[1]
          const x = cam.position.x + d[0] * t
          const z = cam.position.z + d[2] * t
          const dx = x - s.pos[3 * i]
          const dz = z - s.pos[3 * i + 2]
          inp.aimAz = ((Math.atan2(dx, -dz) / DEG) + 360) % 360
          inp.aimRange = Math.max(500, Math.hypot(dx, dz) + this.ladder)
        } else {
          inp.aimAz = ((Math.atan2(d[0], -d[2]) / DEG) + 360) % 360
          inp.aimRange = Math.max(500, (inp.aimRange ?? 10000))
        }
      }
      // a held button fires as the turrets come ready
      inp.fireHeld = this.leftHeld && performance.now() - this.leftDownAt > 400
    }
  }

  dispose() {
    this.ac.abort()
    this.touch?.dispose()
    if (document.pointerLockElement === this.app.canvas) document.exitPointerLock?.()
  }
}
