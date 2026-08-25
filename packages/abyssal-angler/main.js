// ABYSSAL ANGLER — the other end of the line from Abyssal Ascent.
//
// You are the fleet, years before anything rose from the Cradle. Cast into the
// same seven depth zones, steer the hook onto a fish, and reel it into the
// light. A fish heavier than your tackle snaps the line, so the game is a
// ladder: landed value charges the salvage sonar, the sonar finds a better rod
// lost on the seafloor, and each recovered rod reaches one zone deeper and
// holds one tier heavier — hand line to Godhook. At the very bottom, one catch
// is waiting for you as much as you are for it.

// ---------------------------------------------------------------- canvas

const canvas = document.getElementById('ocean')
const ctx = canvas.getContext('2d')

let W = 0
let H = 0
let S = 1 // world-units → css-px vertical scale

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  W = window.innerWidth
  H = window.innerHeight
  canvas.width = Math.round(W * dpr)
  canvas.height = Math.round(H * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  S = H / 950
  makeStars()
}
window.addEventListener('resize', resize)

// ---------------------------------------------------------------- world

// Same seven zones as Abyssal Ascent, same survey. The fleet's charts and the
// kraken's memories disagree only about which way is "progress".
const WORLD_H = 7600
const METERS = 10500 / 7600

const ZONES = [
  { name: 'Sunlight Zone', top: 0 },
  { name: 'Twilight Zone', top: 720 },
  { name: 'Midnight Zone', top: 1950 },
  { name: 'The Abyss',     top: 3250 },
  { name: 'Hadal Trench',  top: 4550 },
  { name: 'Vent Fields',   top: 5800 },
  { name: 'The Cradle',    top: 6850 },
]

function zoneAt(y) {
  let z = ZONES[0]
  for (const c of ZONES) if (y >= c.top) z = c
  return z
}

const fmtM = (y) => Math.round(y * METERS).toLocaleString('en-US').replace(/,/g, ' ') + ' m'
const fmt$ = (v) => '$' + Math.round(v).toLocaleString('en-US')

// ---------------------------------------------------------------- rods

// `depth` is how far the line pays out (world units), `tier` is the heaviest
// fish it can hold without snapping, `sonar` is the landed value needed before
// the salvage sonar finds the NEXT rod on the seafloor.
const RODS = [
  { name: 'Hand Line',       depth: 650,  tier: 2, sink: 300, reel: 480,  boat: 0, line: '#d8c9a8', width: 1,   sonar: 90,       blurb: 'a spool, a hook, and optimism' },
  { name: 'Fiberglass Rod',  depth: 1850, tier: 3, sink: 360, reel: 580,  boat: 0, line: '#bfe3d2', width: 1.2, sonar: 380,      blurb: 'bends double before it gives' },
  { name: 'Deep-Sea Reel',   depth: 3150, tier: 4, sink: 430, reel: 700,  boat: 1, line: '#9fb8d0', width: 1.4, sonar: 1000,     blurb: 'a drum of braided steel' },
  { name: 'Abyssal Winch',   depth: 4450, tier: 5, sink: 510, reel: 840,  boat: 1, line: '#8fa3c0', width: 1.7, sonar: 2400,     blurb: 'bolted straight through the deck' },
  { name: 'Hadal Cable',     depth: 5700, tier: 6, sink: 600, reel: 1000, boat: 2, line: '#a8b6c6', width: 2,   sonar: 5200,     blurb: 'salvaged from a drowned crane' },
  { name: 'Vent-Forged Rig', depth: 6800, tier: 7, sink: 700, reel: 1170, boat: 2, line: '#ffb08a', width: 2.4, sonar: 9000,     blurb: 'still warm to the touch' },
  { name: 'The Godhook',     depth: 7600, tier: 9, sink: 820, reel: 1350, boat: 3, line: '#ff3b6b', width: 2.8, sonar: Infinity, blurb: 'the abyss baited it for you' },
]

// ---------------------------------------------------------------- species

// Cousins of the Abyssal Ascent cast, seen from above for a change. `tier` is
// the rod strength needed to land one; every zone keeps a fish or two that
// out-classes the rod that first reaches it, so there is always a reason to
// come back heavier. `n` is how many swim the world at once.
const SPECIES = [
  // sunlight
  { key: 'sardine',      name: 'Sardine',        band: [60, 700],    r: 7,  tier: 1, value: 6,     speed: 70, col: '#cfe6ff', shape: 'fish',    glow: 0,    n: 10 },
  { key: 'mackerel',     name: 'Mackerel',       band: [80, 700],    r: 10, tier: 1, value: 12,    speed: 65, col: '#9fe0c0', shape: 'fish',    glow: 0,    n: 8 },
  { key: 'puffer',       name: 'Pufferfish',     band: [90, 650],    r: 13, tier: 2, value: 22,    speed: 25, col: '#f2d98a', shape: 'puffer',  glow: 0,    n: 4 },
  { key: 'tuna',         name: 'Tuna',           band: [160, 700],   r: 22, tier: 3, value: 70,    speed: 85, col: '#6f8ba8', shape: 'fish',    glow: 0,    n: 4 },
  { key: 'swordfish',    name: 'Swordfish',      band: [140, 700],   r: 26, tier: 3, value: 95,    speed: 95, col: '#7f93a8', shape: 'needle',  glow: 0,    n: 3 },
  // twilight
  { key: 'lanternfish',  name: 'Lanternfish',    band: [760, 1900],  r: 8,  tier: 1, value: 20,    speed: 45, col: '#8fe9ff', shape: 'fish',    glow: 0.7,  n: 8, lamps: true },
  { key: 'hatchetfish',  name: 'Hatchetfish',    band: [800, 1900],  r: 10, tier: 2, value: 34,    speed: 35, col: '#dfe9f2', shape: 'hatchet', glow: 0.6,  n: 6 },
  { key: 'moonjelly',    name: 'Moon Jelly',     band: [420, 1900],  r: 14, tier: 2, value: 40,    speed: 12, col: '#c9a5ff', shape: 'jelly',   glow: 0.85, n: 6 },
  { key: 'squid',        name: 'Twilight Squid', band: [760, 1900],  r: 15, tier: 3, value: 60,    speed: 50, col: '#ff8fc4', shape: 'squid',   glow: 0.45, n: 5 },
  { key: 'hammerhead',   name: 'Hammerhead',     band: [740, 1850],  r: 30, tier: 4, value: 170,   speed: 75, col: '#8895a3', shape: 'shark',   glow: 0,    n: 3, hammer: true },
  // midnight
  { key: 'bristlemouth', name: 'Bristlemouth',   band: [2000, 3200], r: 6,  tier: 2, value: 50,    speed: 40, col: '#a9c3d6', shape: 'fish',    glow: 0.35, n: 8 },
  { key: 'viperfish',    name: 'Viperfish',      band: [2000, 3200], r: 18, tier: 4, value: 180,   speed: 55, col: '#3a5f80', shape: 'viper',   glow: 0.5,  n: 5 },
  { key: 'anglerfish',   name: 'Anglerfish',     band: [2050, 3200], r: 22, tier: 4, value: 230,   speed: 30, col: '#5a6b7a', shape: 'angler',  glow: 1.0,  n: 4 },
  { key: 'vampsquid',    name: 'Vampire Squid',  band: [2100, 3200], r: 16, tier: 4, value: 200,   speed: 40, col: '#8b2f52', shape: 'squid',   glow: 0.6,  n: 4 },
  { key: 'sixgill',      name: 'Sixgill Shark',  band: [2000, 3150], r: 34, tier: 5, value: 400,   speed: 55, col: '#5c6773', shape: 'shark',   glow: 0,    n: 3 },
  // the abyss
  { key: 'snailfish',    name: 'Snailfish',      band: [3300, 4500], r: 10, tier: 4, value: 250,   speed: 30, col: '#f0d9e6', shape: 'fish',    glow: 0.1,  n: 6 },
  { key: 'dumbo',        name: 'Dumbo Octopus',  band: [3300, 4500], r: 14, tier: 4, value: 280,   speed: 22, col: '#d98fb5', shape: 'octopus', glow: 0.3,  n: 5, ears: true },
  { key: 'isopod',       name: 'Giant Isopod',   band: [3400, 4500], r: 13, tier: 4, value: 300,   speed: 16, col: '#c9b28f', shape: 'bug',     glow: 0,    n: 5 },
  { key: 'sleeper',      name: 'Sleeper Shark',  band: [3300, 4450], r: 38, tier: 5, value: 540,   speed: 42, col: '#4c545e', shape: 'shark',   glow: 0,    n: 3 },
  { key: 'colossal',     name: 'Colossal Squid', band: [3400, 4450], r: 44, tier: 6, value: 950,   speed: 55, col: '#a03a5e', shape: 'squid',   glow: 0.4,  n: 2 },
  // hadal trench
  { key: 'amphipod',     name: 'Amphipod',       band: [4650, 5750], r: 6,  tier: 5, value: 430,   speed: 35, col: '#d8c6a8', shape: 'bug',     glow: 0.1,  n: 7 },
  { key: 'hadalangler',  name: 'Hadal Angler',   band: [4650, 5750], r: 26, tier: 6, value: 900,   speed: 35, col: '#3b2b3f', shape: 'angler',  glow: 1.0,  n: 4 },
  { key: 'bobbit',       name: 'Bobbit Worm',    band: [4700, 5750], r: 24, tier: 6, value: 800,   speed: 12, col: '#9a4a2f', shape: 'worm',    glow: 0.15, n: 4 },
  { key: 'frilled',      name: 'Frilled Shark',  band: [4650, 5700], r: 32, tier: 6, value: 980,   speed: 48, col: '#5a4a55', shape: 'shark',   glow: 0,    n: 3, frill: true },
  { key: 'leviathan',    name: 'Leviathan',      band: [4700, 5700], r: 54, tier: 7, value: 2600,  speed: 60, col: '#5a52d8', shape: 'whale',   glow: 0.2,  n: 1 },
  // vent fields
  { key: 'ventshrimp',   name: 'Vent Shrimp',    band: [5900, 6800], r: 6,  tier: 6, value: 750,   speed: 30, col: '#ffb08a', shape: 'shrimp',  glow: 0.4,  n: 8 },
  { key: 'yeticrab',     name: 'Yeti Crab',      band: [5950, 6800], r: 14, tier: 6, value: 950,   speed: 18, col: '#f2ead9', shape: 'bug',     glow: 0.15, n: 5 },
  { key: 'siphon',       name: 'Siphonophore',   band: [5900, 6750], r: 34, tier: 7, value: 1500,  speed: 10, col: '#7affd8', shape: 'siphon',  glow: 0.9,  n: 3 },
  { key: 'magmaeel',     name: 'Magma Eel',      band: [5900, 6780], r: 30, tier: 7, value: 1700,  speed: 60, col: '#ff6a3d', shape: 'eel',     glow: 0.75, n: 3 },
  // the cradle
  { key: 'hagfish',      name: 'Hagfish',        band: [6950, 7550], r: 16, tier: 7, value: 1600,  speed: 35, col: '#8f8674', shape: 'eel',     glow: 0.05, n: 5 },
  { key: 'eldersquid',   name: 'Elder Squid',    band: [6950, 7500], r: 50, tier: 8, value: 4500,  speed: 55, col: '#5b2b8a', shape: 'squid',   glow: 0.55, n: 2 },
  { key: 'kraken',       name: 'The Kraken',     band: [7280, 7520], r: 64, tier: 9, value: 66666, speed: 25, col: '#6a2f9e', shape: 'kraken',  glow: 0.6,  n: 1, unique: true },
]

const TOTAL_SPECIES = SPECIES.length

// ---------------------------------------------------------------- state

let phase = 'idle' // idle | sinking | struggle | reeling | ended
let rodIndex = 0
let haul = 0
let catches = 0
let sonar = 0
let logbook = new Set()
let seenZones = new Set(['Sunlight Zone'])
let startedAt = 0
let running = false

const boat = { x: 0, targetX: 0 }
const hook = { x: 0, y: 6, vx: 0 }
let catchRef = null // fish or crate currently on the hook
let crate = null    // lost-tackle pickup, when the sonar has found one
let struggleT = 0
let struggleFish = null
let shake = 0
let flash = 0
let krakenPull = 0 // red vignette while the last catch is on the line

const pointer = { x: 0, y: 0 }

let fish = []
let snow = []
let stars = []
let bubbles = []
let splashes = []
let toasts = []

const rod = () => RODS[rodIndex]
const now = () => performance.now() / 1000

function spawnFish() {
  fish = []
  for (const sp of SPECIES) {
    for (let i = 0; i < sp.n; i++) {
      fish.push({
        sp,
        x: Math.random() * W,
        y: sp.band[0] + Math.random() * (sp.band[1] - sp.band[0]),
        vx: (Math.random() < 0.5 ? -1 : 1) * sp.speed * (0.7 + Math.random() * 0.6),
        ph: Math.random() * Math.PI * 2,
        respawnAt: 0,
      })
    }
  }
}

function makeSnow() {
  snow = []
  for (let i = 0; i < 260; i++) {
    snow.push({
      x: Math.random() * (W + 80) - 40,
      y: Math.random() * WORLD_H,
      r: 0.6 + Math.random() * 1.6,
      vy: 6 + Math.random() * 14,
      a: 0.15 + Math.random() * 0.4,
    })
  }
}

function makeStars() {
  stars = []
  for (let i = 0; i < 90; i++) {
    stars.push({
      x: Math.random() * W,
      y: -(20 + Math.random() * 430),
      r: 0.4 + Math.random() * 1.3,
      tw: Math.random() * Math.PI * 2,
    })
  }
}

function reset() {
  phase = 'idle'
  rodIndex = 0
  haul = 0
  catches = 0
  sonar = 0
  logbook = new Set()
  seenZones = new Set(['Sunlight Zone'])
  catchRef = null
  crate = null
  struggleFish = null
  shake = 0
  flash = 0
  krakenPull = 0
  boat.x = boat.targetX = W / 2
  hook.x = boat.x
  hook.y = 6
  spawnFish()
  makeSnow()
  startedAt = now()
  updateHud()
}

// ---------------------------------------------------------------- audio

let AC = null
function audio() {
  if (!AC) {
    try { AC = new (window.AudioContext || window.webkitAudioContext)() } catch { /* silence is fine */ }
  }
  if (AC && AC.state === 'suspended') AC.resume()
  return AC
}

function blip(freq, dur = 0.08, type = 'sine', gain = 0.05, delay = 0, slide = 0) {
  const ac = AC
  if (!ac) return
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur)
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0004, t0 + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

const sfx = {
  cast: () => blip(300, 0.14, 'sine', 0.05, 0, -190),
  land: (tier) => { blip(440 + tier * 40, 0.07, 'triangle', 0.05); blip(620 + tier * 55, 0.1, 'triangle', 0.05, 0.07) },
  snap: () => { blip(190, 0.22, 'sawtooth', 0.06, 0, -130); blip(90, 0.3, 'square', 0.03, 0.05, -40) },
  ping: () => { blip(880, 0.35, 'sine', 0.045); blip(880, 0.3, 'sine', 0.03, 0.45) },
  rod: () => [392, 494, 587, 784].forEach((f, i) => blip(f, 0.12, 'triangle', 0.055, i * 0.09)),
  kraken: () => { blip(55, 1.2, 'sine', 0.12, 0, -18); blip(42, 1.5, 'sine', 0.09, 0.5, -10) },
}

// ---------------------------------------------------------------- hud

const rodNameEl = document.getElementById('rod-name')
const effectEl = document.getElementById('effect-label')
const barFillEl = document.getElementById('bar-fill')
const depthEl = document.getElementById('depth-label')
const haulEl = document.getElementById('haul-label')
const sonarEl = document.getElementById('sonar-label')
const bannerEl = document.getElementById('banner')

let effectTimer = null
function showEffect(text) {
  effectEl.textContent = text
  effectEl.style.opacity = 1
  clearTimeout(effectTimer)
  effectTimer = setTimeout(() => { effectEl.style.opacity = 0 }, 1600)
}

function showBanner(text) {
  bannerEl.textContent = text
  bannerEl.classList.remove('show')
  void bannerEl.offsetWidth // restart the pop animation
  bannerEl.classList.add('show')
}

function addToast(text, col, wx, wy) {
  toasts.push({ text, col, x: wx, y: wy, life: 1.6 })
}

function updateHud() {
  const r = rod()
  rodNameEl.textContent = r.name
  const depthRefY = phase === 'idle' || phase === 'ended' ? 0 : hook.y
  depthEl.textContent = zoneAt(depthRefY).name + ' · ' + fmtM(Math.max(0, depthRefY))
  haulEl.textContent = 'haul ' + fmt$(haul) + ' · ' + catches + ' fish'
  if (crate) {
    barFillEl.style.width = '100%'
    sonarEl.textContent = 'sonar contact! lost tackle at ~' + fmtM(crate.y)
    sonarEl.style.color = '#ffd166'
  } else if (rodIndex >= RODS.length - 1) {
    barFillEl.style.width = '100%'
    sonarEl.textContent = 'sonar quiet — there is nothing better than the Godhook'
    sonarEl.style.color = ''
  } else {
    const pct = Math.min(100, (sonar / r.sonar) * 100)
    barFillEl.style.width = pct + '%'
    sonarEl.textContent = 'salvage sonar · ' + Math.floor(pct) + '% — better tackle is down there somewhere'
    sonarEl.style.color = ''
  }
}

// ---------------------------------------------------------------- gameplay

function castOff() {
  phase = 'sinking'
  hook.x = boat.x
  hook.y = 6
  hook.vx = 0
  splash(boat.x, 1)
  sfx.cast()
}

function startReel() {
  phase = 'reeling'
}

function hookThing(f) {
  const r = rod()
  if (f.sp && f.sp.unique) {
    // the kraken takes the bait — and the Godhook is the only thing that holds
    phase = 'struggle'
    struggleFish = f
    struggleT = 1.5
    shake = 7
    showBanner('IT TAKES THE BAIT')
    sfx.kraken()
    return
  }
  if (f.sp && f.sp.tier > r.tier) {
    phase = 'struggle'
    struggleFish = f
    struggleT = 0.85
    shake = 3
    return
  }
  attach(f)
}

function attach(f) {
  catchRef = f
  phase = 'reeling'
  if (f.crate) addToast('lost tackle hooked!', '#ffd166', hook.x, hook.y)
}

function snapLine() {
  const f = struggleFish
  sfx.snap()
  flash = 0.5
  showEffect('LINE SNAPPED')
  addToast(f.sp.name + ' broke the ' + rod().name, '#ff6a7d', hook.x, hook.y)
  f.vx = (Math.random() < 0.5 ? -1 : 1) * f.sp.speed * 2.2 // bolts for cover
  struggleFish = null
  catchRef = null
  phase = 'reeling'
}

function spawnCrate() {
  const r = rod()
  crate = {
    crate: true,
    x: 60 + Math.random() * Math.max(60, W - 120),
    y: r.depth - (60 + Math.random() * 90),
    vx: (Math.random() < 0.5 ? -1 : 1) * 6,
    ph: Math.random() * Math.PI * 2,
    r: 20,
  }
  showBanner('SONAR CONTACT — LOST TACKLE BELOW')
  sfx.ping()
}

function landCatch() {
  const f = catchRef
  catchRef = null
  phase = 'idle'
  splash(boat.x, 1.4)

  if (!f) { updateHud(); return }

  if (f.crate) {
    crate = null
    rodIndex = Math.min(RODS.length - 1, rodIndex + 1)
    sonar = 0
    const r = rod()
    showBanner('ROD RECOVERED — ' + r.name.toUpperCase())
    showEffect(r.blurb)
    addToast(r.name + ' · reaches ' + fmtM(r.depth), '#ffd166', boat.x, 20)
    sfx.rod()
    updateHud()
    return
  }

  const sp = f.sp
  if (sp.unique) { theEnd(); return }

  haul += sp.value
  catches += 1
  const isNew = !logbook.has(sp.name)
  logbook.add(sp.name)
  addToast((isNew ? 'new! ' : '') + sp.name + ' +' + fmt$(sp.value), isNew ? '#7affd8' : '#cfe9ff', boat.x, 16)
  sfx.land(sp.tier)

  // fish leaves the sea for a while, then another one takes its place
  f.respawnAt = now() + 7 + Math.random() * 8
  f.x = Math.random() * W
  f.y = sp.band[0] + Math.random() * (sp.band[1] - sp.band[0])
  f.vx = (Math.random() < 0.5 ? -1 : 1) * sp.speed * (0.7 + Math.random() * 0.6)
  if (rodIndex < RODS.length - 1) {
    sonar += sp.value
    if (sonar >= rod().sonar && !crate) spawnCrate()
  }
  updateHud()
}

function theEnd() {
  phase = 'ended'
  krakenPull = 0
  const mins = Math.max(1, Math.round((now() - startedAt) / 60))
  document.getElementById('end-stats').textContent =
    'haul ' + fmt$(haul + 66666) + ' · ' + (catches + 1) + ' fish · ' +
    (logbook.size + 1) + ' of ' + TOTAL_SPECIES + ' species · ' + mins + ' min at sea'
  document.getElementById('end-screen').classList.remove('hidden')
}

function splash(x, size) {
  for (let i = 0; i < 14 * size; i++) {
    splashes.push({
      x: x + (Math.random() - 0.5) * 14,
      y: 0,
      vx: (Math.random() - 0.5) * 90 * size,
      vy: -(40 + Math.random() * 110) * size,
      life: 0.5 + Math.random() * 0.35,
    })
  }
}

// ---------------------------------------------------------------- update

function update(dt, t) {
  // boat follows the pointer while the line is stowed
  if (phase === 'idle') boat.targetX = pointer.x
  boat.x += (boat.targetX - boat.x) * Math.min(1, dt * 4)
  boat.x = Math.max(40, Math.min(W - 40, boat.x))

  if (phase === 'sinking') {
    const r = rod()
    hook.y += r.sink * dt
    const want = Math.max(14, Math.min(W - 14, pointer.x))
    hook.vx += (want - hook.x) * 6 * dt
    hook.vx *= Math.pow(0.02, dt) // heavy damping — the line drags
    hook.x += hook.vx * dt * 6
    hook.x = Math.max(10, Math.min(W - 10, hook.x))

    if (Math.random() < dt * 8) {
      bubbles.push({ x: hook.x + (Math.random() - 0.5) * 6, y: hook.y, r: 1 + Math.random() * 2, vy: 30 + Math.random() * 40, life: 1.6 })
    }

    const z = zoneAt(hook.y)
    if (!seenZones.has(z.name)) {
      seenZones.add(z.name)
      showBanner('ENTERING ' + z.name.toUpperCase())
    }

    // did the hook find anything? (fish far below the rod's class won't
    // bite — a sardine has no use for a hook forged for leviathans)
    for (const f of fish) {
      if (f.respawnAt > now()) continue
      if (f.sp.tier < r.tier - 3) continue
      const dx = f.x - hook.x
      const dy = f.y - hook.y
      if (dx * dx + dy * dy < Math.pow(f.sp.r + 10, 2)) { hookThing(f); break }
    }
    if (phase === 'sinking' && crate) {
      const dx = crate.x - hook.x
      const dy = crate.y - hook.y
      if (dx * dx + dy * dy < Math.pow(crate.r + 14, 2)) attach(crate)
    }
    if (phase === 'sinking' && hook.y >= r.depth) {
      showEffect('OUT OF LINE')
      startReel()
    }
  } else if (phase === 'struggle') {
    struggleT -= dt
    hook.x += (Math.random() - 0.5) * 7
    if (struggleFish) {
      struggleFish.x = hook.x + (Math.random() - 0.5) * 5
      struggleFish.y = hook.y + struggleFish.sp.r * 0.5
    }
    if (struggleT <= 0) {
      const f = struggleFish
      if (f.sp.tier > rod().tier) snapLine()
      else { struggleFish = null; attach(f) } // the Godhook holds
    }
  } else if (phase === 'reeling') {
    const r = rod()
    let speed = r.reel
    if (catchRef && catchRef.sp) {
      if (catchRef.sp.unique) { speed *= 0.5; shake = Math.max(shake, 2.5); krakenPull = Math.min(1, krakenPull + dt * 0.4) }
      else if (catchRef.sp.r >= 44) speed *= 0.65
    }
    hook.y -= speed * dt
    hook.x += (boat.x - hook.x) * Math.min(1, dt * 2)
    if (catchRef) {
      catchRef.x = hook.x
      catchRef.y = hook.y + (catchRef.sp ? catchRef.sp.r * 0.55 : 14)
    }
    if (hook.y <= 4) landCatch()
  }

  // everything that is not on your hook goes about its day
  for (const f of fish) {
    if (f === catchRef || f === struggleFish) continue
    if (f.respawnAt > now()) continue
    f.x += f.vx * dt
    f.y += Math.sin(t * 0.9 + f.ph) * dt * 8
    if (f.x < -70) f.x = W + 60
    if (f.x > W + 70) f.x = -60
    if (Math.random() < dt * 0.03) f.vx *= -1
    f.y = Math.max(f.sp.band[0], Math.min(f.sp.band[1], f.y))
  }
  if (crate && !catchRef) {
    crate.x += crate.vx * dt
    if (crate.x < 40 || crate.x > W - 40) crate.vx *= -1
  }

  for (const b of bubbles) { b.y -= b.vy * dt; b.life -= dt }
  bubbles = bubbles.filter((b) => b.life > 0 && b.y > -10)
  for (const s of splashes) { s.x += s.vx * dt; s.vy += 320 * dt; s.y += s.vy * dt; s.life -= dt }
  splashes = splashes.filter((s) => s.life > 0)
  for (const tt of toasts) { tt.y -= 26 * dt; tt.life -= dt }
  toasts = toasts.filter((tt) => tt.life > 0)
  for (const fl of snow) {
    fl.y += fl.vy * dt
    if (fl.y > WORLD_H) fl.y = 0
  }

  shake = Math.max(0, shake - dt * 6)
  flash = Math.max(0, flash - dt * 1.6)
  if (!(catchRef && catchRef.sp && catchRef.sp.unique)) krakenPull = Math.max(0, krakenPull - dt * 0.6)

  if (phase !== 'idle' && phase !== 'ended') updateHud()
}

// ---------------------------------------------------------------- camera + background

let camTop = 0

function camTarget() {
  if (phase === 'idle' || phase === 'ended') return -(H * 0.3) / S
  const t = hook.y - (H * 0.38) / S
  return Math.max(-(H * 0.3) / S, Math.min(WORLD_H + 140 - H / S, t))
}

const sy = (wy) => (wy - camTop) * S
const surfaceAt = (x, t) => Math.sin(x * 0.02 + t * 1.6) * 4 + Math.sin(x * 0.011 - t * 0.9) * 3

const DEPTH_STOPS = [
  [0, [11, 58, 92]],
  [720, [8, 39, 71]],
  [1950, [5, 23, 51]],
  [3250, [3, 11, 31]],
  [4550, [2, 6, 20]],
  [5800, [7, 6, 15]],
  [6850, [11, 4, 16]],
  [7600, [18, 3, 9]],
]

function waterColor(y) {
  y = Math.max(0, Math.min(WORLD_H, y))
  for (let i = 1; i < DEPTH_STOPS.length; i++) {
    if (y <= DEPTH_STOPS[i][0]) {
      const [y0, c0] = DEPTH_STOPS[i - 1]
      const [y1, c1] = DEPTH_STOPS[i]
      const k = (y - y0) / (y1 - y0)
      const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k))
      return 'rgb(' + c.join(',') + ')'
    }
  }
  return 'rgb(18,3,9)'
}

// ---------------------------------------------------------------- drawing

function drawBackground(t) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, waterColor(camTop))
  g.addColorStop(1, waterColor(camTop + H / S))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // night sky, when the surface is in view
  const surfY = sy(0)
  if (surfY > 0) {
    const skyH = Math.min(H, surfY)
    const sg = ctx.createLinearGradient(0, 0, 0, skyH)
    sg.addColorStop(0, '#02030a')
    sg.addColorStop(1, '#0a1626')
    ctx.fillStyle = sg
    ctx.fillRect(0, 0, W, skyH + 2)
    for (const st of stars) {
      const a = 0.4 + 0.5 * Math.abs(Math.sin(t * 0.7 + st.tw))
      const yy = sy(st.y)
      if (yy < surfY) {
        ctx.fillStyle = 'rgba(207,233,255,' + a.toFixed(2) + ')'
        ctx.fillRect(st.x, yy, st.r, st.r)
      }
    }
    // low moon
    const mx = W * 0.78
    const my = sy(-250)
    ctx.save()
    ctx.shadowColor = '#cfe9ff'
    ctx.shadowBlur = 40
    ctx.fillStyle = '#dceaf7'
    ctx.beginPath()
    ctx.arc(mx, my, 26, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(190,205,220,0.5)'
    ctx.beginPath()
    ctx.arc(mx - 8, my - 5, 5, 0, Math.PI * 2)
    ctx.arc(mx + 7, my + 8, 3.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // the waterline itself
    ctx.strokeStyle = 'rgba(180,230,255,0.55)'
    ctx.lineWidth = 1.6
    ctx.beginPath()
    for (let x = 0; x <= W; x += 6) {
      const yy = sy(0) + surfaceAt(x, t)
      x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy)
    }
    ctx.stroke()
  }

  // zone boundaries, charted the fleet's way: a dotted line and a name
  ctx.font = '10px "Segoe UI", system-ui, sans-serif'
  for (const z of ZONES) {
    if (z.top === 0) continue
    const yy = sy(z.top)
    if (yy < -20 || yy > H + 20) continue
    ctx.strokeStyle = 'rgba(140,190,230,0.13)'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 8])
    ctx.beginPath()
    ctx.moveTo(0, yy)
    ctx.lineTo(W, yy)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(140,190,230,0.4)'
    ctx.fillText(z.name.toUpperCase() + ' · ' + fmtM(z.top), 12, yy - 5)
  }

  // marker for the end of your line
  const limY = sy(rod().depth)
  if (rodIndex < RODS.length - 1 && limY > -10 && limY < H + 10) {
    ctx.strokeStyle = 'rgba(255,107,125,0.25)'
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.moveTo(0, limY)
    ctx.lineTo(W, limY)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(255,107,125,0.5)'
    ctx.fillText('END OF LINE — ' + rod().name.toUpperCase(), W - 190, limY - 5)
  }

  // vent glow, when the fields are in view
  if (camTop + H / S > 5700 && camTop < 6900) {
    for (let i = 0; i < 4; i++) {
      const vx = W * (0.15 + i * 0.235)
      const vy = sy(6250 + (i % 2) * 320)
      const pulse = 0.06 + 0.05 * Math.abs(Math.sin(t * 1.3 + i * 2))
      const rg = ctx.createRadialGradient(vx, vy, 4, vx, vy, 180)
      rg.addColorStop(0, 'rgba(255,110,60,' + pulse.toFixed(3) + ')')
      rg.addColorStop(1, 'rgba(255,110,60,0)')
      ctx.fillStyle = rg
      ctx.fillRect(vx - 180, vy - 180, 360, 360)
    }
  }
  // the cradle breathes
  if (camTop + H / S > 6900) {
    const pulse = 0.05 + 0.04 * Math.abs(Math.sin(t * 0.6))
    const rg = ctx.createRadialGradient(W / 2, sy(7600), 30, W / 2, sy(7600), H * 0.9)
    rg.addColorStop(0, 'rgba(255,59,107,' + pulse.toFixed(3) + ')')
    rg.addColorStop(1, 'rgba(255,59,107,0)')
    ctx.fillStyle = rg
    ctx.fillRect(0, 0, W, H)
  }

  // marine snow
  for (const fl of snow) {
    const yy = sy(fl.y)
    if (yy < -4 || yy > H + 4 || fl.y < 0) continue
    ctx.fillStyle = 'rgba(200,225,245,' + fl.a.toFixed(2) + ')'
    ctx.fillRect(fl.x, yy, fl.r, fl.r)
  }
}

function withCreature(f, t, fn) {
  const yy = sy(f.y)
  const r = f.sp ? f.sp.r : f.r
  if (yy < -r * 3 - 40 || yy > H + r * 3 + 40) return
  ctx.save()
  ctx.translate(f.x, yy)
  const dir = f.vx < 0 ? -1 : 1
  fn(dir, yy)
  ctx.restore()
}

function drawCreature(f, t) {
  const sp = f.sp
  withCreature(f, t, (dir) => {
    const r = sp.r
    const col = sp.col
    if (sp.glow > 0) {
      ctx.shadowColor = col
      ctx.shadowBlur = 16 * sp.glow
    }
    ctx.scale(dir, 1)
    ctx.fillStyle = col
    ctx.strokeStyle = col
    const wig = Math.sin(t * 6 + f.ph)

    switch (sp.shape) {
      case 'fish': {
        ctx.beginPath()
        ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(-r * 0.9, 0)
        ctx.lineTo(-r * 1.5, -r * 0.45 + wig * 2)
        ctx.lineTo(-r * 1.5, r * 0.45 + wig * 2)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * 0.5, -r * 0.12, Math.max(1.2, r * 0.12), 0, Math.PI * 2)
        ctx.fill()
        if (sp.lamps) {
          ctx.fillStyle = '#eaff9c'
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath()
            ctx.arc(i * r * 0.4, r * 0.3, 1.3, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        break
      }
      case 'needle': {
        ctx.beginPath()
        ctx.ellipse(0, 0, r, r * 0.26, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.lineWidth = Math.max(1.5, r * 0.09)
        ctx.beginPath()
        ctx.moveTo(r * 0.9, 0)
        ctx.lineTo(r * 1.7, -r * 0.06)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-r * 0.85, 0)
        ctx.lineTo(-r * 1.35, -r * 0.4 + wig * 2)
        ctx.lineTo(-r * 1.35, r * 0.4 + wig * 2)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * 0.55, -r * 0.06, Math.max(1.2, r * 0.09), 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'puffer': {
        ctx.lineWidth = 1.4
        for (let i = 0; i < 11; i++) {
          const a = (i / 11) * Math.PI * 2
          ctx.beginPath()
          ctx.moveTo(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55)
          ctx.lineTo(Math.cos(a) * (r * 0.95 + wig), Math.sin(a) * (r * 0.95 + wig))
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * 0.3, -r * 0.18, r * 0.13, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'hatchet': {
        ctx.beginPath()
        ctx.ellipse(0, 0, r * 0.62, r * 0.92, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#eaff9c'
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath()
          ctx.arc(i * r * 0.3, r * 0.55, 1.4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * 0.22, -r * 0.3, r * 0.18, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'jelly': {
        ctx.globalAlpha = 0.8
        ctx.beginPath()
        ctx.arc(0, 0, r, Math.PI, 0)
        ctx.quadraticCurveTo(r * 0.8, r * 0.35, 0, r * 0.3)
        ctx.quadraticCurveTo(-r * 0.8, r * 0.35, -r, 0)
        ctx.fill()
        ctx.lineWidth = 1.2
        ctx.globalAlpha = 0.6
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath()
          ctx.moveTo(i * r * 0.3, r * 0.3)
          ctx.quadraticCurveTo(i * r * 0.3 + wig * 4, r * 1.1, i * r * 0.25 - wig * 4, r * 1.9)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        break
      }
      case 'squid': {
        ctx.beginPath()
        ctx.moveTo(r * 1.35, 0)
        ctx.quadraticCurveTo(r * 0.4, -r * 0.62, -r * 0.25, -r * 0.4)
        ctx.lineTo(-r * 0.25, r * 0.4)
        ctx.quadraticCurveTo(r * 0.4, r * 0.62, r * 1.35, 0)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(-r * 0.42, 0, r * 0.36, 0, Math.PI * 2)
        ctx.fill()
        ctx.lineWidth = Math.max(1.2, r * 0.09)
        for (let i = -2; i <= 2; i++) {
          ctx.beginPath()
          ctx.moveTo(-r * 0.6, i * r * 0.12)
          ctx.quadraticCurveTo(-r * 1.15, i * r * 0.3 + wig * 3, -r * (1.5 + Math.abs(i) * 0.12), i * r * 0.34 - wig * 3)
          ctx.stroke()
        }
        ctx.shadowBlur = 0
        ctx.fillStyle = '#0a0614'
        ctx.beginPath()
        ctx.arc(-r * 0.42, -r * 0.08, r * 0.12, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'octopus': {
        ctx.beginPath()
        ctx.arc(0, -r * 0.2, r * 0.7, 0, Math.PI * 2)
        ctx.fill()
        if (sp.ears) {
          ctx.beginPath()
          ctx.ellipse(-r * 0.35, -r * 0.85, r * 0.3, r * 0.16, -0.5, 0, Math.PI * 2)
          ctx.ellipse(r * 0.35, -r * 0.85, r * 0.3, r * 0.16, 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.lineWidth = Math.max(1.4, r * 0.12)
        for (let i = 0; i < 6; i++) {
          const ox = (i - 2.5) * r * 0.26
          ctx.beginPath()
          ctx.moveTo(ox, r * 0.28)
          ctx.quadraticCurveTo(ox + wig * 3, r * 0.9, ox - wig * 4, r * 1.25)
          ctx.stroke()
        }
        ctx.shadowBlur = 0
        ctx.fillStyle = '#0a0614'
        ctx.beginPath()
        ctx.arc(-r * 0.22, -r * 0.28, r * 0.1, 0, Math.PI * 2)
        ctx.arc(r * 0.22, -r * 0.28, r * 0.1, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'shark': {
        ctx.beginPath()
        ctx.ellipse(0, 0, r, r * 0.4, 0, 0, Math.PI * 2)
        ctx.fill()
        if (sp.hammer) {
          ctx.fillRect(r * 0.72, -r * 0.34, r * 0.28, r * 0.68)
        }
        ctx.beginPath() // dorsal
        ctx.moveTo(-r * 0.1, -r * 0.3)
        ctx.lineTo(r * 0.2, -r * 0.85)
        ctx.lineTo(r * 0.38, -r * 0.3)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath() // tail
        ctx.moveTo(-r * 0.9, 0)
        ctx.lineTo(-r * 1.4, -r * 0.55 + wig)
        ctx.lineTo(-r * 1.25, r * 0.3)
        ctx.closePath()
        ctx.fill()
        if (sp.frill) {
          ctx.lineWidth = 1.4
          ctx.beginPath()
          for (let i = 0; i < 5; i++) ctx.arc(r * 0.5 - i * 3, r * 0.3, 3.4, 0, Math.PI)
          ctx.stroke()
        }
        ctx.shadowBlur = 0
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * (sp.hammer ? 0.86 : 0.58), -r * 0.12, Math.max(1.4, r * 0.07), 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#04121f'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(r * 0.62, r * 0.16)
        ctx.quadraticCurveTo(r * 0.45, r * 0.26, r * 0.3, r * 0.2)
        ctx.stroke()
        break
      }
      case 'viper': {
        ctx.beginPath()
        ctx.ellipse(0, 0, r, r * 0.3, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath() // gaping jaw
        ctx.moveTo(r * 0.75, -r * 0.1)
        ctx.lineTo(r * 1.25, -r * 0.4)
        ctx.moveTo(r * 0.75, 0.08 * r)
        ctx.lineTo(r * 1.2, r * 0.35)
        ctx.lineWidth = Math.max(1.4, r * 0.1)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(-r * 0.9, 0)
        ctx.lineTo(-r * 1.4, -r * 0.35 + wig * 2)
        ctx.lineTo(-r * 1.4, r * 0.35 + wig * 2)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#7dfcff'
        for (let i = 0; i < 4; i++) {
          ctx.beginPath()
          ctx.arc(-r * 0.6 + i * r * 0.35, r * 0.22, 1.3, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * 0.5, -r * 0.12, r * 0.11, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'angler': {
        ctx.beginPath()
        ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath() // underbite
        ctx.moveTo(r * 0.7, r * 0.15)
        ctx.quadraticCurveTo(r * 0.3, r * 0.75, -r * 0.4, r * 0.5)
        ctx.lineTo(-r * 0.2, r * 0.2)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#e8f7ff'
        for (let i = 0; i < 4; i++) {
          ctx.beginPath()
          ctx.moveTo(r * 0.62 - i * r * 0.22, r * 0.28)
          ctx.lineTo(r * 0.56 - i * r * 0.22, r * 0.5)
          ctx.lineTo(r * 0.5 - i * r * 0.22, r * 0.28)
          ctx.fill()
        }
        // the lure — the only honest light down here
        ctx.strokeStyle = col
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(r * 0.2, -r * 0.7)
        ctx.quadraticCurveTo(r * 0.9, -r * 1.5, r * 1.15, -r * 0.75)
        ctx.stroke()
        ctx.shadowColor = '#eaffff'
        ctx.shadowBlur = 18
        ctx.fillStyle = '#eaffff'
        ctx.beginPath()
        ctx.arc(r * 1.15, -r * 0.7, Math.max(2, r * 0.13), 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * 0.34, -r * 0.2, r * 0.12, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'bug': {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.ellipse(-r * 0.45 + i * r * 0.45, 0, r * 0.36, r * 0.5, 0, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.lineWidth = 1.2
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(-r * 0.4 + i * r * 0.4, r * 0.4)
          ctx.lineTo(-r * 0.5 + i * r * 0.4 + wig, r * 0.85)
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.moveTo(r * 0.7, -r * 0.2)
        ctx.lineTo(r * 1.15, -r * 0.55 + wig)
        ctx.stroke()
        break
      }
      case 'shrimp': {
        ctx.lineWidth = Math.max(1.6, r * 0.4)
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(r, 0)
        ctx.quadraticCurveTo(0, -r * 0.9, -r * 0.9, wig * 0.6)
        ctx.stroke()
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(r * 0.9, -r * 0.2)
        ctx.lineTo(r * 1.9, -r * 0.8)
        ctx.moveTo(r * 0.9, 0)
        ctx.lineTo(r * 2, -r * 0.2)
        ctx.stroke()
        ctx.lineCap = 'butt'
        break
      }
      case 'worm': {
        ctx.lineWidth = Math.max(2.5, r * 0.42)
        ctx.lineCap = 'round'
        ctx.beginPath()
        for (let i = 0; i <= 10; i++) {
          const x = r * 1.3 - i * r * 0.26
          const y = Math.sin(i * 0.9 + t * 5 + f.ph) * r * 0.28
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.lineWidth = 1.6
        ctx.beginPath() // mandibles
        ctx.moveTo(r * 1.3, 0)
        ctx.lineTo(r * 1.75, -r * 0.4)
        ctx.moveTo(r * 1.3, 0)
        ctx.lineTo(r * 1.75, r * 0.4)
        ctx.stroke()
        ctx.lineCap = 'butt'
        break
      }
      case 'eel': {
        ctx.lineWidth = Math.max(2.5, r * 0.3)
        ctx.lineCap = 'round'
        ctx.beginPath()
        for (let i = 0; i <= 12; i++) {
          const x = r * 1.2 - i * r * 0.2
          const y = Math.sin(i * 0.7 + t * 6 + f.ph) * r * 0.3
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * 1.1, 0, Math.max(1.4, r * 0.09), 0, Math.PI * 2)
        ctx.fill()
        ctx.lineCap = 'butt'
        break
      }
      case 'siphon': {
        // a drifting colony — drawn vertically, no facing
        ctx.globalAlpha = 0.85
        for (let i = 0; i < 6; i++) {
          const y = -r + i * r * 0.4
          const x = Math.sin(t * 1.5 + i * 0.9 + f.ph) * r * 0.22
          ctx.beginPath()
          ctx.arc(x, y, r * 0.17 + Math.sin(t * 3 + i) * 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.moveTo(0, -r)
        for (let i = 1; i < 6; i++) ctx.lineTo(Math.sin(t * 1.5 + i * 0.9 + f.ph) * r * 0.22, -r + i * r * 0.4)
        ctx.stroke()
        ctx.globalAlpha = 1
        break
      }
      case 'whale': {
        ctx.beginPath()
        ctx.ellipse(0, 0, r, r * 0.48, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath() // flukes
        ctx.moveTo(-r * 0.95, 0)
        ctx.lineTo(-r * 1.4, -r * 0.4 + wig * 1.5)
        ctx.lineTo(-r * 1.32, 0)
        ctx.lineTo(-r * 1.4, r * 0.4 + wig * 1.5)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.strokeStyle = 'rgba(255,106,168,0.6)' // leviathan wears the old colors
        ctx.lineWidth = 1.4
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          ctx.moveTo(r * 0.5 - i * r * 0.18, r * 0.28)
          ctx.quadraticCurveTo(r * 0.2 - i * r * 0.18, r * 0.5, -r * 0.15 - i * r * 0.18, r * 0.4)
          ctx.stroke()
        }
        ctx.fillStyle = '#04121f'
        ctx.beginPath()
        ctx.arc(r * 0.62, -r * 0.14, r * 0.07, 0, Math.PI * 2)
        ctx.fill()
        break
      }
      case 'kraken': {
        // it was always going to be a kraken
        ctx.beginPath()
        ctx.arc(0, -r * 0.15, r * 0.75, Math.PI * 0.95, Math.PI * 2.05)
        ctx.quadraticCurveTo(r * 0.8, r * 0.45, r * 0.55, r * 0.5)
        ctx.lineTo(-r * 0.55, r * 0.5)
        ctx.quadraticCurveTo(-r * 0.8, r * 0.45, -r * 0.74, -r * 0.12)
        ctx.fill()
        ctx.lineWidth = Math.max(3, r * 0.14)
        ctx.lineCap = 'round'
        for (let i = 0; i < 8; i++) {
          const ox = (i - 3.5) * r * 0.24
          const sway = Math.sin(t * 2.2 + i * 1.1) * r * 0.22
          ctx.beginPath()
          ctx.moveTo(ox, r * 0.42)
          ctx.quadraticCurveTo(ox + sway, r * 1.05, ox - sway * 1.4, r * (1.5 + (i % 3) * 0.16))
          ctx.stroke()
        }
        ctx.lineCap = 'butt'
        ctx.shadowColor = '#ff3b6b'
        ctx.shadowBlur = 22
        ctx.fillStyle = '#ff3b6b'
        ctx.beginPath()
        ctx.arc(-r * 0.3, -r * 0.25, r * 0.11, 0, Math.PI * 2)
        ctx.arc(r * 0.3, -r * 0.25, r * 0.11, 0, Math.PI * 2)
        ctx.fill()
        break
      }
    }
    ctx.shadowBlur = 0
  })
}

function drawCrate(t) {
  if (!crate) return
  const yy = sy(crate.y)
  if (yy < -60 || yy > H + 60) {
    // off-screen: point the way while sinking
    if (phase === 'sinking' && crate.y > hook.y) {
      ctx.fillStyle = 'rgba(255,209,102,0.75)'
      ctx.beginPath()
      ctx.moveTo(crate.x, H - 26)
      ctx.lineTo(crate.x - 7, H - 40)
      ctx.lineTo(crate.x + 7, H - 40)
      ctx.closePath()
      ctx.fill()
    }
    return
  }
  ctx.save()
  ctx.translate(crate.x, yy)
  ctx.rotate(Math.sin(t * 1.2 + crate.ph) * 0.08)
  const pulse = 14 + Math.sin(t * 3) * 6
  ctx.shadowColor = '#ffd166'
  ctx.shadowBlur = pulse
  ctx.fillStyle = '#8a6a30'
  ctx.fillRect(-17, -11, 34, 22)
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#ffd166'
  ctx.lineWidth = 1.6
  ctx.strokeRect(-17, -11, 34, 22)
  ctx.beginPath()
  ctx.moveTo(-17, 0)
  ctx.lineTo(17, 0)
  ctx.stroke()
  // the rod inside, poking out
  ctx.strokeStyle = '#ffe9b0'
  ctx.beginPath()
  ctx.moveTo(8, -11)
  ctx.lineTo(26, -30)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(12, -14, 3.4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

function drawBoat(t) {
  const surf = sy(0)
  if (surf < -80 || surf > H + 120) return
  const bx = boat.x
  const bob = surfaceAt(bx, t) + Math.sin(t * 1.8) * 1.5
  const by = surf + bob
  const kind = rod().boat
  ctx.save()
  ctx.translate(bx, by)
  ctx.rotate(Math.sin(t * 1.1) * 0.02)

  ctx.fillStyle = '#1a2432'
  ctx.strokeStyle = '#3d5068'
  ctx.lineWidth = 1.2

  if (kind === 0) {
    // skiff, with a lantern so the night knows where you are
    const lg = ctx.createRadialGradient(-14, -18, 2, -14, -18, 46)
    lg.addColorStop(0, 'rgba(255,209,102,0.28)')
    lg.addColorStop(1, 'rgba(255,209,102,0)')
    ctx.fillStyle = lg
    ctx.fillRect(-60, -64, 92, 92)
    ctx.fillStyle = '#1a2432'
    ctx.beginPath()
    ctx.moveTo(-30, -4)
    ctx.quadraticCurveTo(0, 12, 30, -4)
    ctx.lineTo(24, -10)
    ctx.lineTo(-24, -10)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#2c3d52'
    ctx.fillRect(-4, -20, 8, 10) // the angler, hunched
    ctx.beginPath()
    ctx.arc(0, -23, 3.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#3d5068'
    ctx.beginPath() // lantern post
    ctx.moveTo(-14, -10)
    ctx.lineTo(-14, -22)
    ctx.stroke()
    ctx.shadowColor = '#ffd166'
    ctx.shadowBlur = 10
    ctx.fillStyle = '#ffd166'
    ctx.fillRect(-16.5, -22, 5, 5)
    ctx.shadowBlur = 0
  } else if (kind === 1) {
    // trawler
    ctx.beginPath()
    ctx.moveTo(-46, -4)
    ctx.quadraticCurveTo(0, 14, 46, -4)
    ctx.lineTo(38, -14)
    ctx.lineTo(-40, -14)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#1d2937'
    ctx.fillRect(-26, -30, 24, 16)
    ctx.fillStyle = '#ffd166'
    ctx.fillRect(-21, -26, 5, 4) // lit window
    ctx.strokeStyle = '#3a4c61'
    ctx.beginPath()
    ctx.moveTo(14, -14)
    ctx.lineTo(30, -34)
    ctx.stroke()
  } else if (kind === 2) {
    // whaler
    ctx.beginPath()
    ctx.moveTo(-60, -4)
    ctx.quadraticCurveTo(0, 15, 60, -4)
    ctx.lineTo(52, -17)
    ctx.lineTo(-54, -17)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#1d2937'
    ctx.fillRect(-40, -35, 30, 18)
    ctx.fillStyle = '#ffd166'
    ctx.fillRect(-34, -30, 5, 4)
    ctx.fillRect(-24, -30, 5, 4)
    ctx.strokeStyle = '#3a4c61'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(20, -17)
    ctx.lineTo(44, -46)
    ctx.lineTo(58, -38)
    ctx.stroke()
  } else {
    // dreadnought — they built it for a reason they don't say out loud
    ctx.fillStyle = '#0d1118'
    ctx.beginPath()
    ctx.moveTo(-80, -4)
    ctx.quadraticCurveTo(0, 17, 80, -4)
    ctx.lineTo(72, -22)
    ctx.lineTo(-74, -22)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#161d29'
    ctx.fillRect(-52, -44, 40, 22)
    ctx.fillRect(-4, -36, 26, 14)
    ctx.fillStyle = '#ff3b6b'
    ctx.beginPath()
    ctx.arc(-32, -48, 2.6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffd166'
    ctx.fillRect(-46, -39, 6, 5)
    ctx.fillRect(-24, -39, 6, 5)
    ctx.strokeStyle = '#3a4c61'
    ctx.lineWidth = 2.4
    ctx.beginPath()
    ctx.moveTo(30, -22)
    ctx.lineTo(58, -58)
    ctx.lineTo(76, -47)
    ctx.stroke()
  }
  // nav light
  ctx.fillStyle = '#7affd8'
  ctx.beginPath()
  ctx.arc(kind === 0 ? 26 : kind * 18 + 30, -12 - kind * 3, 2, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawLineAndHook(t) {
  if (phase === 'idle' || phase === 'ended') return
  const r = rod()
  const surf = sy(0)
  const tipX = boat.x + 24
  const tipY = surf + surfaceAt(boat.x, t) - (18 + r.boat * 8)
  const hx = hook.x + (phase === 'struggle' ? (Math.random() - 0.5) * 5 : 0)
  const hy = sy(hook.y)

  ctx.strokeStyle = r.line
  ctx.globalAlpha = 0.8
  ctx.lineWidth = r.width
  ctx.beginPath()
  ctx.moveTo(tipX, Math.min(tipY, hy - 4))
  const sag = (hx - tipX) * 0.12
  ctx.quadraticCurveTo(tipX + sag, (Math.min(tipY, hy) + hy) / 2, hx, hy - 6)
  ctx.stroke()
  ctx.globalAlpha = 1

  // hook light for the deeper rigs
  if (rodIndex >= 2) {
    const glowR = 60 + rodIndex * 14
    const g = ctx.createRadialGradient(hx, hy, 4, hx, hy, glowR)
    const c = rodIndex >= 6 ? '255,59,107' : '190,230,255'
    g.addColorStop(0, 'rgba(' + c + ',0.16)')
    g.addColorStop(1, 'rgba(' + c + ',0)')
    ctx.fillStyle = g
    ctx.fillRect(hx - glowR, hy - glowR, glowR * 2, glowR * 2)
  }

  // the hook itself: a J with a barb
  ctx.strokeStyle = rodIndex >= 6 ? '#ff9db4' : '#dfe9f2'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(hx, hy - 8)
  ctx.lineTo(hx, hy + 2)
  ctx.arc(hx - 4, hy + 2, 4, 0, Math.PI * 0.9)
  ctx.stroke()
  // bait
  ctx.fillStyle = '#ff8fa0'
  ctx.beginPath()
  ctx.arc(hx, hy + 4, 2.2, 0, Math.PI * 2)
  ctx.fill()
}

function drawParticles(t) {
  for (const b of bubbles) {
    const yy = sy(b.y)
    if (yy < -6 || yy > H + 6) continue
    ctx.strokeStyle = 'rgba(200,235,255,' + (0.3 * Math.min(1, b.life)).toFixed(2) + ')'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(b.x, yy, b.r, 0, Math.PI * 2)
    ctx.stroke()
  }
  for (const s of splashes) {
    const yy = sy(s.y)
    ctx.fillStyle = 'rgba(210,240,255,' + Math.max(0, s.life * 1.4).toFixed(2) + ')'
    ctx.fillRect(s.x, yy, 2, 2)
  }
  ctx.font = 'bold 13px "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const tt of toasts) {
    const yy = sy(tt.y)
    ctx.globalAlpha = Math.max(0, Math.min(1, tt.life))
    ctx.fillStyle = '#01040a'
    ctx.fillText(tt.text, tt.x + 1, yy + 1)
    ctx.fillStyle = tt.col
    ctx.fillText(tt.text, tt.x, yy)
    ctx.globalAlpha = 1
  }
  ctx.textAlign = 'left'
}

function draw(t) {
  ctx.save()
  if (shake > 0.05) ctx.translate((Math.random() - 0.5) * shake * 2, (Math.random() - 0.5) * shake * 2)

  drawBackground(t)
  drawCrate(t)
  for (const f of fish) {
    if (f.respawnAt > now()) continue
    drawCreature(f, t)
  }
  drawLineAndHook(t)
  drawBoat(t)
  drawParticles(t)

  // deep water swallows the light
  const depthK = Math.max(0, Math.min(1, camTop / WORLD_H))
  ctx.fillStyle = 'rgba(0,0,0,' + (depthK * 0.28).toFixed(3) + ')'
  ctx.fillRect(0, 0, W, H)

  if (flash > 0) {
    ctx.fillStyle = 'rgba(255,60,90,' + (flash * 0.25).toFixed(3) + ')'
    ctx.fillRect(0, 0, W, H)
  }
  if (krakenPull > 0) {
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.75)
    g.addColorStop(0, 'rgba(255,59,107,0)')
    g.addColorStop(1, 'rgba(255,59,107,' + (krakenPull * 0.22).toFixed(3) + ')')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }
  ctx.restore()
}

// ---------------------------------------------------------------- input

window.addEventListener('pointermove', (e) => {
  pointer.x = e.clientX
  pointer.y = e.clientY
})

window.addEventListener('pointerdown', (e) => {
  if (!running || e.target.closest('.start-card')) return
  audio()
  pointer.x = e.clientX
  pointer.y = e.clientY
  if (phase === 'idle') castOff()
  else if (phase === 'sinking') { showEffect('REELING IN'); startReel() }
})

// ---------------------------------------------------------------- loop

let last = 0
function frame(ms) {
  const t = ms / 1000
  const dt = Math.min(0.05, last ? t - last : 0.016)
  last = t
  if (running && phase !== 'ended') update(dt, t)
  camTop += (camTarget() - camTop) * Math.min(1, dt * 5)
  draw(t)
  requestAnimationFrame(frame)
}

// ---------------------------------------------------------------- screens

const startScreen = document.getElementById('start-screen')
const endScreen = document.getElementById('end-screen')

document.getElementById('start-btn').addEventListener('click', () => {
  audio()
  startScreen.classList.add('hidden')
  running = true
  reset()
})

document.getElementById('again-btn').addEventListener('click', () => {
  endScreen.classList.add('hidden')
  reset()
})

resize()
boat.x = boat.targetX = W / 2
spawnFish()
makeSnow()
updateHud()
requestAnimationFrame(frame)

// ---------------------------------------------------------------- debug rig
// (same spirit as Abyssal Ascent's: enough handles to poke the game headless)

window.__game = {
  get phase() { return phase },
  get rod() { return rod().name },
  get rodIndex() { return rodIndex },
  get haul() { return haul },
  get catches() { return catches },
  get sonar() { return sonar },
  get crate() { return crate && { x: Math.round(crate.x), y: Math.round(crate.y) } },
  get hook() { return { x: Math.round(hook.x), y: Math.round(hook.y) } },
  get species() { return [...logbook] },
  zones: ZONES.map((z) => z.name),
  rods: RODS.map((r) => r.name),
  start() { document.getElementById('start-btn').click() },
  cast() { if (phase === 'idle') castOff() },
  grantRod() { rodIndex = Math.min(RODS.length - 1, rodIndex + 1); sonar = 0; crate = null; updateHud() },
  fillSonar() { if (rodIndex < RODS.length - 1) { sonar = rod().sonar; if (!crate) spawnCrate(); updateHud() } },
  nearestFish() {
    let best = null
    let bd = Infinity
    for (const f of fish) {
      if (f.respawnAt > now()) continue
      const d = Math.hypot(f.x - hook.x, f.y - hook.y)
      if (d < bd) { bd = d; best = f }
    }
    return best && { key: best.sp.key, x: Math.round(best.x), y: Math.round(best.y), d: Math.round(bd) }
  },
  find(key) {
    const f = fish.find((f) => f.sp.key === key && f.respawnAt <= now())
    return f ? { key, x: Math.round(f.x), y: Math.round(f.y), tier: f.sp.tier } : null
  },
}
