import * as THREE from 'three'

/* =========================================================================
 * Saucer Synth
 * A glowing alien flying saucer that is also a playable Web Audio instrument.
 * - The saucer bobs in a stylized alien sky and auto-plays an ambient arpeggio.
 * - Each glowing port on the rim is a note (pentatonic scale -> always pleasant).
 * - Click / hover / drag the ports to trigger tones; visuals react to sound.
 * Audio only starts after a user gesture (browser autoplay policy); before that
 * the visuals still animate so the gallery screenshot looks alive.
 * ========================================================================= */

// ---------------------------------------------------------------------------
// Audio engine
// ---------------------------------------------------------------------------

// C major pentatonic across a couple of octaves -> every note sounds good.
const PENTATONIC = [
  130.81, 146.83, 164.81, 196.0, 220.0, // C3 D3 E3 G3 A3
  261.63, 293.66, 329.63, 392.0, 440.0, // C4 D4 E4 G4 A4
  523.25, 587.33, // C5 D5
]

const Audio = {
  ctx: null,
  master: null,
  reverb: null,
  ready: false,

  // Create the context lazily on first gesture (autoplay policy).
  init() {
    if (this.ctx) return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return // graceful no-op if Web Audio is unavailable
    try {
      this.ctx = new AC()
    } catch (e) {
      return
    }

    this.master = this.ctx.createGain()
    this.master.gain.value = 0.0
    this.master.connect(this.ctx.destination)

    // Cheap algorithmic reverb (convolver with synthesized impulse).
    this.reverb = this.ctx.createConvolver()
    this.reverb.buffer = this._impulse(2.6, 2.4)
    const wet = this.ctx.createGain()
    wet.gain.value = 0.45
    this.reverb.connect(wet)
    wet.connect(this.master)
    this.wetIn = this.reverb

    // Fade the master in once running.
    this.ready = true
    this._resume()
  },

  _resume() {
    if (!this.ctx) return
    const go = () => {
      if (!this.master) return
      const t = this.ctx.currentTime
      this.master.gain.cancelScheduledValues(t)
      this.master.gain.setValueAtTime(this.master.gain.value, t)
      this.master.gain.linearRampToValueAtTime(0.9, t + 1.5)
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(go).catch(() => {})
    } else {
      go()
    }
  },

  // Build a decaying noise impulse response for the reverb.
  _impulse(seconds, decay) {
    const rate = this.ctx.sampleRate
    const len = Math.floor(rate * seconds)
    const buf = this.ctx.createBuffer(2, len, rate)
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
      }
    }
    return buf
  },

  // Play a single note. `timbre` selects the oscillator character.
  note(freq, { timbre = 'sine', gain = 0.5, dur = 1.6 } = {}) {
    if (!this.ready || !this.ctx) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const sub = this.ctx.createOscillator()
    const amp = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    const types = {
      sine: ['sine', 'sine', 0.0],
      bell: ['triangle', 'sine', 0.0],
      glass: ['sine', 'triangle', 7.01],
      pluck: ['sawtooth', 'sine', 0.0],
    }
    const [main, subWave, detune] = types[timbre] || types.sine

    osc.type = main
    osc.frequency.value = freq
    sub.type = subWave
    sub.frequency.value = freq * (detune ? 2 : 0.5) // shimmer or sub-octave
    sub.detune.value = detune

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(freq * 6, t)
    filter.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dur)
    filter.Q.value = 6

    // Soft pluck envelope.
    amp.gain.setValueAtTime(0.0001, t)
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.02)
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur)

    osc.connect(amp)
    sub.connect(amp)
    amp.connect(filter)
    filter.connect(this.master)
    if (this.wetIn) filter.connect(this.wetIn)

    osc.start(t)
    sub.start(t)
    osc.stop(t + dur + 0.1)
    sub.stop(t + dur + 0.1)
  },
}

// ---------------------------------------------------------------------------
// Three.js scene
// ---------------------------------------------------------------------------

const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x0a0420, 0.035)

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
)
camera.position.set(0, 2.2, 9)
camera.lookAt(0, 0.2, 0)

// --- Lighting -------------------------------------------------------------
scene.add(new THREE.AmbientLight(0x3344aa, 0.6))
const keyLight = new THREE.DirectionalLight(0x88aaff, 0.8)
keyLight.position.set(4, 8, 6)
scene.add(keyLight)
const rimLight = new THREE.PointLight(0xff66dd, 1.2, 40)
rimLight.position.set(-6, 3, -4)
scene.add(rimLight)
// Glow light under the saucer that pulses with play.
const coreLight = new THREE.PointLight(0x66ffee, 2.0, 18)
coreLight.position.set(0, -0.5, 0)
scene.add(coreLight)

// --- Alien sky backdrop ---------------------------------------------------
function buildSky() {
  const geo = new THREE.SphereGeometry(60, 32, 32)
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vPos;
      uniform float uTime;
      void main() {
        vec3 p = normalize(vPos);
        float h = p.y * 0.5 + 0.5;
        // Deep violet -> teal gradient sky.
        vec3 top = vec3(0.03, 0.01, 0.12);
        vec3 bot = vec3(0.10, 0.02, 0.20);
        vec3 col = mix(bot, top, h);
        // Slow aurora bands.
        float band = sin(p.x * 3.0 + uTime * 0.3) * sin(p.y * 4.0 - uTime * 0.2);
        col += vec3(0.10, 0.35, 0.30) * smoothstep(0.4, 1.0, band) * 0.5;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })
  return new THREE.Mesh(geo, mat)
}
const sky = buildSky()
scene.add(sky)

// Starfield ----------------------------------------------------------------
function buildStars() {
  const count = 600
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 30 + Math.random() * 25
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.cos(phi)
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({
    color: 0xbfe9ff,
    size: 0.18,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  })
  return new THREE.Points(geo, mat)
}
scene.add(buildStars())

// --- The saucer -----------------------------------------------------------
const saucer = new THREE.Group()
scene.add(saucer)

// Shared resources to keep things light.
const shared = {
  portGeo: new THREE.SphereGeometry(0.16, 20, 20),
  beamGeo: new THREE.CylinderGeometry(0.02, 0.22, 3.2, 12, 1, true),
}

// Metallic hull (two stacked cones make the classic saucer silhouette).
const hullMat = new THREE.MeshStandardMaterial({
  color: 0x9fb4d6,
  metalness: 0.95,
  roughness: 0.25,
  envMapIntensity: 1.0,
})
const bodyTop = new THREE.Mesh(new THREE.SphereGeometry(2.1, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), hullMat)
bodyTop.scale.set(1, 0.42, 1)
bodyTop.position.y = 0.05
saucer.add(bodyTop)

const bodyBottom = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.0, 48, 1, true), hullMat)
bodyBottom.position.y = -0.45
bodyBottom.rotation.x = Math.PI
saucer.add(bodyBottom)

// Rim disc (the widest part, where ports sit).
const rim = new THREE.Mesh(
  new THREE.TorusGeometry(2.55, 0.22, 20, 64),
  new THREE.MeshStandardMaterial({ color: 0x6a78a0, metalness: 0.9, roughness: 0.3 }),
)
rim.rotation.x = Math.PI / 2
saucer.add(rim)

// Glowing dome cockpit on top.
const domeMat = new THREE.MeshPhysicalMaterial({
  color: 0x66ffee,
  emissive: 0x33ddcc,
  emissiveIntensity: 0.8,
  metalness: 0.0,
  roughness: 0.1,
  transmission: 0.6,
  transparent: true,
  opacity: 0.85,
})
const dome = new THREE.Mesh(new THREE.SphereGeometry(0.95, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), domeMat)
dome.position.y = 0.55
saucer.add(dome)

// Pulsing energy rings (ripple outward when notes play).
const rings = []
const ringMatProto = new THREE.MeshBasicMaterial({
  color: 0x66ffee,
  transparent: true,
  opacity: 0.0,
  side: THREE.DoubleSide,
})
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.5, 2.62, 64), ringMatProto.clone())
  ring.rotation.x = Math.PI / 2
  ring.position.y = -0.1
  ring.userData = { phase: i, active: 0 }
  saucer.add(ring)
  rings.push(ring)
}

// --- Playable ports -------------------------------------------------------
// Ring of glowing orbs around the rim; each maps to a pentatonic note + timbre.
const ports = []
const TIMBRES = ['sine', 'bell', 'glass', 'pluck']
const PORT_COUNT = 12
for (let i = 0; i < PORT_COUNT; i++) {
  const angle = (i / PORT_COUNT) * Math.PI * 2
  const hue = i / PORT_COUNT
  const color = new THREE.Color().setHSL((0.5 + hue * 0.4) % 1, 0.9, 0.6)
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.2,
    metalness: 0.2,
    roughness: 0.4,
  })
  const port = new THREE.Mesh(shared.portGeo, mat)
  port.position.set(Math.cos(angle) * 2.55, -0.12, Math.sin(angle) * 2.55)

  // Beam that shoots downward when triggered.
  const beamMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const beam = new THREE.Mesh(shared.beamGeo, beamMat)
  beam.position.set(0, -1.7, 0)
  port.add(beam)

  port.userData = {
    note: PENTATONIC[i % PENTATONIC.length],
    timbre: TIMBRES[i % TIMBRES.length],
    baseColor: color.clone(),
    baseEmissive: 1.2,
    pulse: 0, // 0..1 glow envelope
    beam,
    beamMat,
    angle,
  }
  saucer.add(port)
  ports.push(port)
}

// ---------------------------------------------------------------------------
// Interaction (raycasting)
// ---------------------------------------------------------------------------

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let isPointerDown = false
let lastDragHit = null
let hovered = null

// Trigger a port: play its note + kick the visual envelopes.
function trigger(port, velocity = 0.5) {
  if (!port) return
  Audio.note(port.userData.note, {
    timbre: port.userData.timbre,
    gain: 0.35 + velocity * 0.25,
    dur: 1.4 + Math.random() * 0.6,
  })
  port.userData.pulse = 1
  // Ripple a ring outward.
  const ring = rings.find((r) => r.userData.active <= 0) || rings[0]
  ring.userData.active = 1
  // Flash the core light.
  coreLight.userData = coreLight.userData || {}
  coreLight.userData.flash = 1
}

function updatePointer(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
}

function pick() {
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObjects(ports, false)
  return hits.length ? hits[0].object : null
}

function onDown(e) {
  Audio.init() // first gesture unlocks audio
  isPointerDown = true
  updatePointer(e)
  const hit = pick()
  if (hit) {
    trigger(hit, 0.8)
    lastDragHit = hit
  }
}

function onMove(e) {
  updatePointer(e)
  const hit = pick()

  // Hover highlight (light touch -> soft glow, no constant retrigger).
  if (hit !== hovered) {
    hovered = hit
    canvas.style.cursor = hit ? 'pointer' : 'crosshair'
    if (hit && !isPointerDown) {
      hit.userData.pulse = Math.max(hit.userData.pulse, 0.6)
    }
  }

  // Dragging across ports plays them like a harp.
  if (isPointerDown && hit && hit !== lastDragHit) {
    trigger(hit, 0.6)
    lastDragHit = hit
  }
}

function onUp() {
  isPointerDown = false
  lastDragHit = null
}

canvas.addEventListener('pointerdown', onDown)
window.addEventListener('pointermove', onMove)
window.addEventListener('pointerup', onUp)

// ---------------------------------------------------------------------------
// Auto-demo: an evolving ambient arpeggio so the scene is alive on its own.
// ---------------------------------------------------------------------------

let demoActive = true
let demoTimer = 0
let demoStep = 0
// A wandering pattern of port indices for the arpeggio.
const demoPattern = [0, 3, 6, 9, 2, 7, 11, 4, 8, 1, 5, 10]

function userTookOver() {
  // Once the user interacts, pause the auto-demo for a while, then resume.
  demoActive = false
  clearTimeout(userTookOver._t)
  userTookOver._t = setTimeout(() => {
    demoActive = true
  }, 6000)
}
canvas.addEventListener('pointerdown', userTookOver)

// ---------------------------------------------------------------------------
// Render loop
// ---------------------------------------------------------------------------

const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const dt = clock.getDelta()
  const t = clock.elapsedTime

  // Saucer hover/bob + slow spin.
  saucer.position.y = Math.sin(t * 0.8) * 0.25 + 0.2
  saucer.rotation.y = t * 0.15
  saucer.rotation.z = Math.sin(t * 0.5) * 0.04
  sky.material.uniforms.uTime.value = t

  // Auto-demo arpeggio (drives visuals always; audio when unlocked).
  demoTimer += dt
  const interval = 0.55 + Math.sin(t * 0.2) * 0.2 // tempo breathes
  if (demoActive && demoTimer >= interval) {
    demoTimer = 0
    const idx = demoPattern[demoStep % demoPattern.length]
    trigger(ports[idx], 0.4)
    demoStep++
  }

  // Update each port: glow envelope, scale pop, beam fade.
  for (const port of ports) {
    const u = port.userData
    u.pulse = Math.max(0, u.pulse - dt * 1.8)
    const glow = u.baseEmissive + u.pulse * 3.5
    port.material.emissiveIntensity = glow
    const s = 1 + u.pulse * 0.8
    port.scale.setScalar(s)
    // Idle shimmer so ports twinkle even at rest.
    const shimmer = 0.15 * (0.5 + 0.5 * Math.sin(t * 3 + u.angle * 4))
    port.material.emissiveIntensity += shimmer

    // Beam emit on play.
    const beamOp = u.pulse * 0.5
    u.beamMat.opacity = beamOp
    port.userData.beam.scale.y = 0.4 + u.pulse * 0.8
  }

  // Energy rings ripple outward then fade.
  for (const ring of rings) {
    const ud = ring.userData
    if (ud.active > 0) {
      ud.active = Math.max(0, ud.active - dt * 0.9)
      const grow = (1 - ud.active) * 1.6
      ring.scale.setScalar(1 + grow)
      ring.material.opacity = ud.active * 0.6
    } else {
      ring.material.opacity = 0
    }
  }

  // Core + dome react to overall activity.
  const cd = coreLight.userData || {}
  cd.flash = Math.max(0, (cd.flash || 0) - dt * 2)
  coreLight.userData = cd
  coreLight.intensity = 1.4 + cd.flash * 3 + Math.sin(t * 2) * 0.3
  domeMat.emissiveIntensity = 0.7 + cd.flash * 1.5

  // Gentle camera drift for parallax life.
  camera.position.x = Math.sin(t * 0.18) * 1.2
  camera.position.y = 2.2 + Math.sin(t * 0.25) * 0.3
  camera.lookAt(0, 0.4, 0)

  renderer.render(scene, camera)
}
animate()

// ---------------------------------------------------------------------------
// Resize handling
// ---------------------------------------------------------------------------

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
