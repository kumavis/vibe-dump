import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { makeRng, hashU32, pick } from './src/rng.js'
import { GOODS } from './src/goods.js'
import { SPECIES } from './src/species.js'
import { buildCharacter } from './src/character.js'
import { generatePersona } from './src/persona.js'
import { buildWorld } from './src/world.js'
import { createEconomy } from './src/economy.js'
import { createBubbles } from './src/bubbles.js'
import { createSim } from './src/sim.js'
import { createUI } from './src/ui.js'

// ---------------------------------------------------------------------------
// The Night Bazaar — assembly and run loop.
// ?seed=N reseeds the whole market (characters, prices, layout dressing).
// ---------------------------------------------------------------------------

const params = new URLSearchParams(location.search)
const SEED = (parseInt(params.get('seed'), 10) || 7) >>> 0

const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.55

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x141028, 0.0085)

const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 220)
camera.position.set(12.5, 7.2, 15.5)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1.3, 0)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.maxPolarAngle = Math.PI * 0.49
controls.minDistance = 3
controls.maxDistance = 46
controls.autoRotate = true
controls.autoRotateSpeed = 0.35

function resize() {
  const w = innerWidth
  const h = innerHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)
resize()

// ---- world ----------------------------------------------------------------
const rng = makeRng(SEED)
const shuffled = [...GOODS.map((g) => g.id)]
for (let i = shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(rng() * (i + 1))
  ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
}
const stallGoods = [
  [shuffled[0]], [shuffled[1]], [shuffled[2]], [shuffled[3]], [shuffled[4]], [shuffled[5]],
  [shuffled[6], shuffled[7]], [shuffled[8], shuffled[9]],
]
const world = buildWorld({ seed: SEED, goods: GOODS, stallGoods })
scene.add(world.group)
// gentle blue-night fill so the crowd never falls to pure black under ACES
scene.add(new THREE.AmbientLight(0x35304e, 1.15))
const moonRim = new THREE.DirectionalLight(0x9db8ff, 0.4)
moonRim.position.set(-18, 14, -10)
scene.add(moonRim)

// ---- cast -----------------------------------------------------------------
const CUSTOMERS = 16
const loadFill = document.getElementById('load-fill')
const loadSub = document.getElementById('load-sub')
const overlay = document.getElementById('loading')

/** cast plan: one vendor per stall, buskers per world spot, then customers */
const plan = []
world.stalls.forEach((stall, i) => {
  plan.push({ id: `v${i}`, role: 'vendor', stall })
})
world.buskerSpots.slice(0, 2).forEach((spot, i) => {
  plan.push({ id: `b${i}`, role: 'busker', buskerSpot: spot })
})
for (let i = 0; i < CUSTOMERS; i++) plan.push({ id: `c${i}`, role: 'customer' })

const actors = []
const hitboxes = []

function buildOne(entry, i) {
  const aSeed = hashU32(SEED * 2654435761 + i * 97 + 13)
  const aRng = makeRng(aSeed)
  const species = pick(aRng, SPECIES)
  const char = buildCharacter({ seed: aSeed ^ 0xbeef, species, role: entry.role })
  const persona = generatePersona(aRng, { species, role: entry.role, goodIds: entry.stall?.goodIds })
  const actor = { ...entry, species, char, persona }
  scene.add(char.group)

  const h = char.appearance.height
  const hit = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.42, h + 0.15, 8),
    new THREE.MeshBasicMaterial(),
  )
  hit.visible = false
  hit.position.y = h / 2
  hit.userData.actor = actor
  char.group.add(hit)
  hitboxes.push(hit)
  actors.push(actor)
}

// staged build so the loading bar moves, then economy + pre-roll, then play
let built = 0
const SUBS = ['raising the stalls…', 'waking the vendors…', 'stitching costumes…', 'rigging skeletons…', 'arguing about prices…', 'counting the float…']
function buildStep() {
  const chunk = 8
  for (let k = 0; k < chunk && built < plan.length; k++, built++) {
    buildOne(plan[built], built)
  }
  loadFill.style.width = `${((built / plan.length) * 88).toFixed(0)}%`
  loadSub.textContent = SUBS[Math.min(SUBS.length - 1, Math.floor((built / plan.length) * SUBS.length))]
  if (built < plan.length) {
    requestAnimationFrame(buildStep)
  } else {
    requestAnimationFrame(finishSetup)
  }
}
requestAnimationFrame(buildStep)

let sim = null
let economy = null
let ui = null
let selected = null

function finishSetup() {
  economy = createEconomy({
    seed: SEED,
    goods: GOODS,
    actors: actors.map((a) => ({
      id: a.id,
      role: a.role,
      goodIds: a.stall?.goodIds,
      attrs: a.persona.attrs,
      wealth: a.persona.wealth,
    })),
  })
  const bubbles = createBubbles(scene)
  ui = createUI({ onDeselect: () => (selected = null) })
  sim = createSim({
    seed: SEED,
    world,
    economy,
    bubbles,
    actors,
    onTicker: (line) => ui.addTicker(line),
  })
  loadSub.textContent = 'letting the market warm up…'
  loadFill.style.width = '96%'
  // pre-roll so first paint is mid-hubbub (FRAMES.md)
  sim.preroll(70)
  loadFill.style.width = '100%'
  overlay.classList.add('done')
  ui.setStats(economy.stats(), `${actors.length} souls`)
  window.bazaar = { sim, economy, world, actors, bubbles, camera } // debug/probe handle
}

// ---- selection ------------------------------------------------------------
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let downAt = null
canvas.addEventListener('pointerdown', (e) => {
  controls.autoRotate = false
  downAt = [e.clientX, e.clientY]
})
canvas.addEventListener('pointerup', (e) => {
  if (!downAt || !sim) return
  const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1])
  downAt = null
  if (moved > 6) return // was a drag
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  const hits = raycaster.intersectObjects(hitboxes, false)
  if (hits.length) {
    selected = hits[0].object.userData.actor
    ui.showActor(selected, economy.actorState(selected.id))
  } else {
    selected = null
    ui.hideActor()
  }
})

// ---- run loop -------------------------------------------------------------
const clock = new THREE.Clock()
let statTimer = 0
const _follow = new THREE.Vector3()

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05)
  const t = clock.elapsedTime

  if (sim) {
    sim.update(t, dt)
    statTimer -= dt
    if (statTimer <= 0) {
      statTimer = 0.7
      ui.setStats(economy.stats(), `${actors.length} souls`)
      if (selected) ui.showActor(selected, economy.actorState(selected.id))
    }
    if (selected) {
      _follow.set(selected.pos.x, selected.char.appearance.height * 0.62, selected.pos.z)
      controls.target.lerp(_follow, Math.min(1, dt * 3))
    }
  }
  world.update(t)
  controls.update()
  renderer.render(scene, camera)
})
