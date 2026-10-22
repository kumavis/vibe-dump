// The stage (DESIGN §1.1): the renderer, the scene and its lights, the
// labels' overlay, and the frame loop that runs the table: each frame the
// clock advances (view/clock.js: game time at the speed button's pace, or
// near-instant under ?fast), every tween steps, the table's parts update in
// order (effects, figures, flags), the camera rig moves (view/camera.js),
// and the frame is drawn (never under ?fast, a test mode that skips
// drawing and lets game time run effectively instantly, so a whole AI
// battle replays in about a minute: logic is unaffected, every animation
// still resolves, just within a frame).
//
// R7 moved it out of main.js unchanged: the same renderer settings, fog and
// lights, and the frame's steps in the same order.
import * as THREE from 'three'
import { clock, stepTweens } from './clock.js'

export class Stage {
  // `lowfi`: half the pixels and no shadows (?lowfi); `fast`: ?fast
  constructor({ lowfi = false, fast = false } = {}) {
    this.fast = fast
    const renderer = (this.renderer = new THREE.WebGLRenderer({ antialias: true }))
    renderer.setPixelRatio(lowfi ? 0.5 : Math.min(devicePixelRatio, 2))
    renderer.setSize(innerWidth, innerHeight)
    renderer.shadowMap.enabled = !lowfi
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    document.body.prepend(renderer.domElement)

    const scene = (this.scene = new THREE.Scene())
    scene.background = new THREE.Color('#1c1712')
    scene.fog = new THREE.Fog('#1c1712', 70, 140)
    addEventListener('resize', () => renderer.setSize(innerWidth, innerHeight))
    // the floating labels and texts, over the canvas
    this.overlay = document.querySelector('#labels')
  }

  // The sky's and the sun's light (after the camera is made, as always).
  light() {
    const scene = this.scene
    scene.add(new THREE.HemisphereLight('#d6e6ff', '#3b2a1a', 0.85))
    const sun = new THREE.DirectionalLight('#fff0d6', 2.3)
    sun.position.set(-16, 34, 20)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    Object.assign(sun.shadow.camera, { left: -27, right: 27, top: 22, bottom: -22, near: 5, far: 90 })
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.02
    scene.add(sun)
    const fill = new THREE.DirectionalLight('#9fb8ff', 0.35)
    fill.position.set(18, 12, -16)
    scene.add(fill)
  }

  // Run the table: `parts(dt, time)` each frame after the tweens (the
  // effects, the figures, the flags, in that order), then the camera rig
  // moves and draws, jolted by `shake()` (fx's).
  run({ parts, rig, shake }) {
    const timer = new THREE.Clock()
    const frame = () => {
      requestAnimationFrame(frame)
      if (this.fast) clock.speed = 1e4
      const wall = timer.getDelta()
      const raw = Math.min(wall, 0.05)
      // (how much game time a wall second gives, at speed 1: under 1 when
      // frames come slower than 20 a second)
      if (wall > 0) clock.rate += (raw / wall - clock.rate) * 0.05
      const dt = raw * clock.speed * clock.boost
      clock.time += dt
      stepTweens(dt)
      parts(dt, clock.time)
      rig.update(raw)
      rig.render(this.renderer, this.scene, shake(), !this.fast)
    }
    frame()
  }
}
