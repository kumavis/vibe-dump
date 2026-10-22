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

import * as THREE from 'three'
import { AIRCRAFT_KEYS, SHIP_KEYS, HELM_STEPS, TELEGRAPH_LEVELS, matches } from './bindings.js'
import { TouchControls } from './touch.js'

const DEG = Math.PI / 180

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
    this.direct = false
    this.rightHeld = false
    this.leftDownAt = 0
    this.leftHeld = false
    this.ladder = 0
    this.confirmRelease = 0
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

  key(e, down) {
    // (in a moment Enter presses nothing on the page: a focused button would restart the sortie under the player)
    if (this.app.mode === 'moment' && (e.code === 'Enter' || e.code === 'NumpadEnter')) e.preventDefault()
    if (!this.live) return
    const p = this.player
    const code = e.code
    const map = p.kind === 'aircraft' ? AIRCRAFT_KEYS : SHIP_KEYS
    const ours = Object.values(map).some((v) => v.includes(code))
    if (!ours) return
    // Space would scroll the page; Backspace would navigate back; the arrows would scroll
    e.preventDefault()
    e.stopPropagation()
    if (down && e.repeat && !['KeyR', 'KeyF', 'PageUp', 'PageDown'].includes(code)) return
    if (down) this.held.add(code)
    else this.held.delete(code)
    if (!down) {
      if (p.kind === 'aircraft' && matches(map, 'guns', code)) p.input.fireHeld = this.leftHeld
      return
    }
    const inp = p.input
    const hud = this.battle.scene?.hud
    if (matches(map, 'release', code)) {
      const now = performance.now()
      if (now - this.confirmRelease < 3000) {
        this.confirmRelease = 0
        this.battle.release()
      } else {
        this.confirmRelease = now
        hud?.say('Backspace again to release the controls', 3)
      }
      return
    }
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

  move(e) {
    this.pointer.x = e.clientX
    this.pointer.y = e.clientY
    this.pointer.inside = true
    if (!this.live) return
    const p = this.player
    if (this.lock && p.kind === 'aircraft') {
      // in pointer lock the mouse turns an aim direction on a sphere about the aircraft
      this.aim.yaw += e.movementX * 0.0025
      this.aim.pitch = Math.max(-1.5, Math.min(1.5, this.aim.pitch - e.movementY * 0.0025))
    }
    if (this.lock && p.kind === 'ship' && this.battle.scene?.cameras) this.battle.scene.cameras.addLook(e.movementX * 0.002, -e.movementY * 0.002)
  }

  down(e) {
    if (!this.live) return
    const p = this.player
    if (e.button === 2) {
      this.rightHeld = true
      return
    }
    if (e.button !== 0) return
    this.leftHeld = true
    this.leftDownAt = performance.now()
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
    if (p.kind === 'aircraft') p.input.fireHeld = this.held.has('Space')
    else p.input.fireHeld = false
  }

  wheel(e) {
    if (!this.live) return
    const p = this.player
    if (p.kind !== 'ship') return
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
    if (p.kind === 'aircraft') {
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
      // the pointer on the sea lays the main battery: bearing and range from the ship (the ladder adds to the range)
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
