// Abyssal Ascent — you hatch as a spark in the vent-lit cradle at the bottom of
// the world and eat your way up through seven depth zones until you are the
// thing the fishing fleets tell stories about. Pure canvas 2D, no dependencies.

const canvas = document.getElementById('ocean')
const ctx = canvas.getContext('2d')

function resize() {
  canvas.width = Math.floor(window.innerWidth * devicePixelRatio)
  canvas.height = Math.floor(window.innerHeight * devicePixelRatio)
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'
}
resize()
window.addEventListener('resize', resize)

// ---- Helpers -----------------------------------------------------------
const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const lerp = (a, b, t) => a + (b - a) * t
const TAU = Math.PI * 2
const now = () => performance.now()
// deterministic per-index noise, so scenery stays put as the camera moves
function hash1(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
// Returns hex (not `rgb()`) so the result can be fed straight back into hexA().
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const r = clamp(((n >> 16) & 255) + amt, 0, 255)
  const g = clamp(((n >> 8) & 255) + amt, 0, 255)
  const b = clamp((n & 255) + amt, 0, 255)
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

// ---- World -------------------------------------------------------------
// A tall vertical column. worldY = 0 is the surface (waterline where boats
// float); worldY = WORLD_H is the seafloor. The column keeps going the OTHER
// way too: negative worldY is open air, thinning all the way up to the moon.
// Horizontally the world is endless.
const WORLD_H = 7600
// The waterline sits well below the top of the viewport so there is room to see
// the hulls — and to watch a kraken take one apart.
const SURFACE_Y = 155
// The roof of the world, well past the last wisp of atmosphere.
const SKY_TOP = -10600
const MOON_Y = -9950
// Below the seafloor: the drowned caves and everything under them, sealed
// until something big enough cracks the world open. The core waits at the
// bottom of the bottom.
const WORLD_BOTTOM = 14800
const CORE_Y = 14260
const METERS = 1.45 // world units -> displayed metres

// ---- The arctic --------------------------------------------------------
// Swim far enough east or west and the water turns to ice: different light,
// different residents, bergs where the boats would be.
const ARCTIC_START = 5200
const ARCTIC_FULL = 7800
function arcticness(x) {
  if (realm !== 'ocean') return 0
  return clamp((Math.abs(x) - ARCTIC_START) / (ARCTIC_FULL - ARCTIC_START), 0, 1)
}

// ---- Realms ------------------------------------------------------------
// 'ocean' is the whole story. 'freshwater' is the victory lap: a bottomless
// sweet-water lake with its own cast, unlocked at the very end.
let realm = 'ocean'

// ---- Depth zones -------------------------------------------------------
// Seven bands below the waves, each with its own light, scenery and residents.
const ZONES = [
  { name: 'Sunlight Zone', top: 0 },
  { name: 'Twilight Zone', top: 720 },
  { name: 'Midnight Zone', top: 1950 },
  { name: 'The Abyss',     top: 3250 },
  { name: 'Hadal Trench',  top: 4550 },
  { name: 'Vent Fields',   top: 5800 },
  { name: 'The Cradle',    top: 6850 },
]
// ---- Air zones ---------------------------------------------------------
// Eight more bands above them, from gull country to the lunar approach.
// Ordered by `top` descending; a zone owns every y >= its top.
const AIR_ZONES = [
  { name: 'The Open Air',    top: -950 },
  { name: 'The Storm Layer', top: -2350 },
  { name: 'The Jet Stream',  top: -3750 },
  { name: 'The Stratosphere',top: -5150 },
  { name: 'The Edge of Sky', top: -6550 },
  { name: 'Low Orbit',       top: -7950 },
  { name: 'The Void',        top: -9250 },
  { name: 'Lunar Approach',  top: SKY_TOP },
]
// ---- Under-zones -------------------------------------------------------
// Six more bands beneath the seafloor, down to the heart of the world.
const CORE_ZONES = [
  { name: 'The Drowned Caves', top: 7600 },
  { name: 'The Sunless Sea',   top: 8800 },
  { name: 'Crystal Hollows',   top: 10000 },
  { name: 'The Magma Sea',     top: 11200 },
  { name: 'The Mantle',        top: 12500 },
  { name: 'The Core',          top: 13700 },
]
// The lake tells the same depths by different names.
const FRESH_NAMES = ['The Reed Shallows', 'The Green Deep', 'The Silt Dark',
  'The Drowned Forest', 'The Cold Bottom', 'The Spring Vents', 'The Lakebed Cradle']
function zoneAt(y) {
  if (y < SURFACE_Y - 60) {
    for (const c of AIR_ZONES) if (y >= c.top) return c
    return AIR_ZONES[AIR_ZONES.length - 1]
  }
  if (y >= 7600) {
    let z = CORE_ZONES[0]
    for (const c of CORE_ZONES) if (y >= c.top) z = c
    return z
  }
  let z = ZONES[0], zi = 0
  ZONES.forEach((c, i) => { if (y >= c.top) { z = c; zi = i } })
  if (realm === 'freshwater') return { name: FRESH_NAMES[zi], top: z.top }
  if (arcticness(player.x) > 0.5 && y < 2600) return { name: 'The Frozen Reaches', top: z.top }
  return z
}

// Water colour anchors down the column: bright teal shallows, black abyss,
// then a faint volcanic warmth once the vents start.
const WATER_STOPS = [
  [0,       [34, 132, 158]],
  [420,     [22, 104, 140]],
  [1100,    [12,  62, 108]],
  [2100,    [ 7,  30,  74]],
  [3300,    [ 4,  14,  42]],
  [4600,    [ 2,   7,  22]],
  [5900,    [18,   9,  20]],
  [6900,    [38,  14,  18]],
  [WORLD_H, [15,   4,  10]],
  // beneath the floor: cave black, crystal violet, then heat all the way down
  [8800,    [ 6,   5,  12]],
  [10000,   [16,  10,  34]],
  [11200,   [42,  12,  14]],
  [12500,   [78,  24,  10]],
  [13700,   [128, 48,  14]],
  [WORLD_BOTTOM, [188, 92, 30]],
]
function waterColor(y) {
  const d = clamp(y, 0, WORLD_BOTTOM)
  for (let i = 0; i < WATER_STOPS.length - 1; i++) {
    const [y0, c0] = WATER_STOPS[i]
    const [y1, c1] = WATER_STOPS[i + 1]
    if (d <= y1) {
      const k = (d - y0) / (y1 - y0)
      return [
        Math.round(lerp(c0[0], c1[0], k)),
        Math.round(lerp(c0[1], c1[1], k)),
        Math.round(lerp(c0[2], c1[2], k)),
      ]
    }
  }
  return WATER_STOPS[WATER_STOPS.length - 1][1]
}

// Regional recolouring of the water: icy blue-white toward the poles, murky
// green-brown in the sweet water. Fades out with depth — the deep is the deep.
function tintWater(c, y) {
  let mix = null, k = 0
  const arc = arcticness(player.x)
  if (arc > 0 && y < 2600) {
    mix = [140, 190, 210]
    k = arc * clamp(1 - y / 2600, 0, 1) * 0.55
  } else if (realm === 'freshwater' && y < 4200) {
    mix = [52, 96, 58]
    k = clamp(1 - y / 4200, 0, 1) * 0.6
  }
  if (!mix) return c
  return [
    Math.round(lerp(c[0], mix[0], k)),
    Math.round(lerp(c[1], mix[1], k)),
    Math.round(lerp(c[2], mix[2], k)),
  ]
}

// Sky colour anchors up the column: hazy noon blue at the waterline thinning
// to storm slate, indigo, and finally the near-black of space.
const SKY_STOPS = [
  [SURFACE_Y, [126, 188, 224]],
  [-950,      [ 96, 160, 212]],
  [-2350,     [ 66,  90, 132]],
  [-3750,     [ 46,  58, 108]],
  [-5150,     [ 28,  32,  74]],
  [-6550,     [ 14,  14,  40]],
  [-7950,     [  6,   7,  22]],
  [-9250,     [  3,   3,  13]],
  [SKY_TOP,   [  1,   1,   6]],
]
function skyColor(y) {
  const d = clamp(y, SKY_TOP, SURFACE_Y)
  for (let i = 0; i < SKY_STOPS.length - 1; i++) {
    const [y0, c0] = SKY_STOPS[i]
    const [y1, c1] = SKY_STOPS[i + 1]
    if (d >= y1) {
      const k = (d - y0) / (y1 - y0)
      return [
        Math.round(lerp(c0[0], c1[0], k)),
        Math.round(lerp(c0[1], c1[1], k)),
        Math.round(lerp(c0[2], c1[2], k)),
      ]
    }
  }
  return SKY_STOPS[SKY_STOPS.length - 1][1]
}

// ---- Stages ------------------------------------------------------------
// Every evolution is a different animal, not just a bigger worm: `form` picks
// the renderer, `seg`/`space`/`width` set the silhouette, `reach` is how far
// the maw (or the arms) can grab. From the Ribbon Eel on, every form also
// carries its own `ability` — tap (or click) to use it.
const STAGES = [
  { name: 'Larva',           form: 'larva',   biomass: 0,    seg: 9,  space: 1.00, width: 5,  reach: 1.5, color: '#8fe9ff', accent: '#e8fdff' },
  { name: 'Lanternfish',     form: 'lantern', biomass: 35,   seg: 12, space: 1.00, width: 8,  reach: 1.5, color: '#6fd0ff', accent: '#eaff9c' },
  { name: 'Ribbon Eel',      form: 'ribbon',  biomass: 95,   seg: 30, space: 0.80, width: 10, reach: 1.6, color: '#4fb6ff', accent: '#9cffd8',
    ability: { key: 'dash',    name: 'Slipstream',    cd: 4 } },
  { name: 'Viperfish',       form: 'viper',   biomass: 190,  seg: 18, space: 1.00, width: 13, reach: 1.9, color: '#2f6f9e', accent: '#7dfcff',
    ability: { key: 'lure',    name: 'Beacon Lure',   cd: 9 } },
  { name: 'Gulper Eel',      form: 'gulper',  biomass: 330,  seg: 28, space: 0.85, width: 16, reach: 2.3, color: '#3b5580', accent: '#ff9d4d',
    ability: { key: 'gulp',    name: 'Vortex Gulp',   cd: 8 } },
  { name: 'Sea Serpent',     form: 'serpent', biomass: 540,  seg: 38, space: 0.90, width: 20, reach: 1.8, color: '#3f7bff', accent: '#8affd0',
    ability: { key: 'storm',   name: 'Storm Coil',    cd: 8 } },
  { name: 'Bone Shark',      form: 'shark',   biomass: 820,  seg: 18, space: 1.10, width: 25, reach: 1.8, color: '#8d97a6', accent: '#e8f7ff',
    ability: { key: 'frenzy',  name: 'Bone Frenzy',   cd: 12 } },
  { name: 'Leviathan',       form: 'whale',   biomass: 1200, seg: 20, space: 1.15, width: 33, reach: 2.1, color: '#5a52d8', accent: '#ff6aa8',
    ability: { key: 'sonar',   name: 'Sonar Boom',    cd: 10 } },
  { name: 'The Kraken',      form: 'kraken',  biomass: 1750, seg: 18, space: 0.95, width: 42, reach: 3.1, color: '#6a2f9e', accent: '#ff3b6b',
    ability: { key: 'veil',    name: 'Ink Veil',      cd: 12 } },
  { name: 'The Drowned God', form: 'god',     biomass: 2500, seg: 20, space: 1.00, width: 54, reach: 3.5, color: '#3b1150', accent: '#ffd166',
    ability: { key: 'leap',    name: 'Skyward Lunge', cd: 5 } },
  // --- the sky evolutions: the ocean was only the first half ---
  { name: 'Stormbringer',    form: 'wyrm',    biomass: 3400, seg: 34, space: 0.90, width: 30, reach: 2.2, color: '#3fa8d8', accent: '#eaff70',
    ability: { key: 'gale',    name: 'Gale Burst',    cd: 8 } },
  { name: 'Cloud Devourer',  form: 'skywhale',biomass: 4700, seg: 22, space: 1.15, width: 40, reach: 2.4, color: '#9fc4e8', accent: '#fff2c8',
    ability: { key: 'vacuum',  name: 'Cyclone Maw',   cd: 10 } },
  { name: 'Star Serpent',    form: 'starserp',biomass: 6300, seg: 40, space: 0.90, width: 46, reach: 2.6, color: '#7a5cff', accent: '#ffe9a8',
    ability: { key: 'gravity', name: 'Gravity Well',  cd: 12 } },
  { name: 'The Mooneater',   form: 'mooneater',biomass: 8300, seg: 16, space: 1.05, width: 58, reach: 3.6, color: '#241040', accent: '#9ff2ff',
    ability: { key: 'nova',    name: 'Starfall Nova', cd: 14 } },
  // --- the core evolutions: what grows in the heat under the floor ---
  { name: 'The Magmaw',      form: 'magmaw',  biomass: 11000, seg: 32, space: 0.95, width: 72, reach: 2.4, color: '#7a2414', accent: '#ffb347',
    ability: { key: 'eruption', name: 'Magma Burst',  cd: 10 } },
  { name: 'Obsidian Colossus', form: 'obsidian', biomass: 14500, seg: 18, space: 1.20, width: 88, reach: 2.4, color: '#1c1a24', accent: '#ff5a3c',
    ability: { key: 'quake',   name: 'Seismic Slam',  cd: 12 } },
  { name: 'The Worldeater',  form: 'worldeater', biomass: 19000, seg: 22, space: 1.05, width: 108, reach: 3.4, color: '#3a1208', accent: '#ffd166',
    ability: { key: 'cataclysm', name: 'Cataclysm',   cd: 15 } },
]
const KRAKEN_STAGE = STAGES.findIndex((s) => s.form === 'kraken')
// The Drowned God can hurl itself clear of the water; the stage after it flies.
const BREACH_STAGE = STAGES.findIndex((s) => s.form === 'god')
const FLY_STAGE = STAGES.findIndex((s) => s.form === 'wyrm')
const MOONEATER_STAGE = STAGES.findIndex((s) => s.form === 'mooneater')
const WORLDEATER_STAGE = STAGES.findIndex((s) => s.form === 'worldeater')
const MAX_SEG = Math.max(...STAGES.map((s) => s.seg))

// ---- Input -------------------------------------------------------------
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
function setMouse(e) {
  const t = e.touches ? e.touches[0] : e
  mouse.x = t.clientX
  mouse.y = t.clientY
}
window.addEventListener('mousemove', setMouse)
window.addEventListener('touchmove', (e) => { setMouse(e); e.preventDefault() }, { passive: false })
window.addEventListener('touchstart', setMouse, { passive: true })

// A quick tap (or click) fires the current form's ability. A drag steers, so a
// tap only counts if the pointer barely moved — that keeps swim + ability
// usable one-handed on a phone.
let press = null
window.addEventListener('pointerdown', (e) => {
  if (e.target.closest && e.target.closest('button')) return
  press = { x: e.clientX, y: e.clientY, t: performance.now() }
})
window.addEventListener('pointerup', (e) => {
  if (!press) return
  const moved = Math.hypot(e.clientX - press.x, e.clientY - press.y)
  const held = performance.now() - press.t
  press = null
  if (moved < 14 && held < 350) fireAbility()
})
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') { e.preventDefault(); fireAbility() }
})

// ---- Tilt parallax -----------------------------------------------------
// If the device streams orientation events (no permission prompt — on
// platforms that would require asking, the listener simply never fires and we
// fall back), the background layers lean with the phone. Otherwise they lean
// with the cursor's offset from the centre of the screen.
const tilt = { x: 0, y: 0, hasGyro: false, gx: 0, gy: 0 }
window.addEventListener('deviceorientation', (e) => {
  if (e.gamma == null && e.beta == null) return
  tilt.hasGyro = true
  // gamma: left/right tilt; beta: front/back, re-centred on a comfortable
  // ~40° holding angle so "flat-ish in the hand" reads as neutral.
  tilt.gx = clamp((e.gamma || 0) / 28, -1, 1)
  tilt.gy = clamp(((e.beta || 0) - 40) / 32, -1, 1)
})
function updateTilt(dt) {
  const txT = tilt.hasGyro ? tilt.gx : (mouse.x - window.innerWidth / 2) / (window.innerWidth / 2)
  const tyT = tilt.hasGyro ? tilt.gy : (mouse.y - window.innerHeight / 2) / (window.innerHeight / 2)
  const k = Math.min(1, dt * 4)
  tilt.x += (clamp(txT, -1, 1) - tilt.x) * k
  tilt.y += (clamp(tyT, -1, 1) - tilt.y) * k
}

// ---- Camera ------------------------------------------------------------
// Everything starts down on the cradle floor, in sight of the vent chimneys.
const START_Y = WORLD_H - 430
const cam = { y: START_Y - 400, shake: 0 }

// ---- Player ------------------------------------------------------------
const player = {
  x: 0,
  y: START_Y,
  vx: 0,
  vy: 0,
  biomass: 0,
  stageIndex: 0,
  spine: [],
  headW: STAGES[0].width,
  hooked: null,   // hook currently snagging us
  netted: null,   // trawler net we're tangled in
  strain: 0,      // struggle progress to break free
  flash: 0,       // white eat flash
  hurt: 0,        // red hurt flash + damage i-frames
  slow: 0,        // seconds of sluggishness (ink, slime, net)
  stun: 0,        // seconds of lost control (shocks, sonar)
  inked: 0,       // 0..1 blindness
  biteCd: 0,      // hull-bite cooldown
  clangCd: 0,     // "that hull is too thick" nag cooldown
  maw: 0,         // 0..1 jaw-open animation, kicks on every meal
  abilityCd: 0,   // seconds until the tap ability is ready again
  guard: 0,       // damage immunity from an ability (no red flash)
  lureT: 0,       // beacon lure: prey drifts toward you
  gulpT: 0,       // vortex gulp / cyclone maw: prey is dragged in
  gulpR: 0,       // suction radius for the active gulp
  frenzyT: 0,     // bone frenzy: speed + immunity
  veilT: 0,       // ink veil: predators lose you
  gravT: 0,       // gravity well: everything falls toward you
  launchT: 0,     // skyward lunge: steering yields to the impulse
  airborne: false,// above the waterline last frame (for splash detection)
  breachHinted: 0,// one-time banners: 1 = breach hint shown, 2 = fly shown
}
function initSpine() {
  player.spine = []
  for (let i = 0; i < MAX_SEG; i++) player.spine.push({ x: player.x, y: player.y + i * 6 })
}
initSpine()

function stage() { return STAGES[player.stageIndex] }
function nextStage() { return STAGES[player.stageIndex + 1] }
function segCount() { return stage().seg }

// What a meal is worth depends on who's eating. Prey much smaller than your
// maw is barely a mouthful — the krill that raised the larva mean nothing to
// a shark, so every new form has to hunt where its own prey lives instead of
// grinding the nursery.
function foodValue(c) {
  const rel = clamp(c.r / (player.headW * 0.6), 0, 1)
  const eff = 0.08 + 0.92 * Math.pow(rel, 1.6)
  return (2 + c.r * 1.15 + c.tier * 5 + (c.bonus || 0)) * eff
}

function addBiomass(n) {
  player.biomass += n
  const nx = nextStage()
  if (nx && player.biomass >= nx.biomass) {
    player.stageIndex++
    const s = STAGES[player.stageIndex]
    evolveBanner(s.name)
    ripple(player.x, player.y, 150, s.accent)
    ripple(player.x, player.y, 230, s.color)
    cam.shake = Math.max(cam.shake, 0.5)
    if (s.ability) queueBanner(s.ability.name.toUpperCase() + ' · TAP TO USE', 2.6)
    if (player.stageIndex === KRAKEN_STAGE) queueBanner('THE BOATS ARE PREY NOW', 5.2)
    if (player.stageIndex === BREACH_STAGE) queueBanner('THE SURFACE IS NOT A CEILING · LEAP', 5.2)
    if (player.stageIndex === FLY_STAGE) queueBanner('THE SKY IS YOURS · FLY', 5.2)
    if (player.stageIndex === MOONEATER_STAGE) queueBanner('ONLY ONE THING LEFT TO EAT', 5.2)
    if (player.stageIndex === WORLDEATER_STAGE) queueBanner('THE HEART OF THE WORLD IS WAITING', 5.2)
  }
}
function loseBiomass(n) {
  player.biomass = Math.max(0, player.biomass - n)
  // de-evolve if we drop below the current stage threshold
  while (player.stageIndex > 0 && player.biomass < STAGES[player.stageIndex].biomass) {
    player.stageIndex--
    showBanner('DEVOLVED · ' + stage().name)
  }
  player.hurt = 1
}

// ---- Species -----------------------------------------------------------
// `zone` is the depth band a species lives in, so the cast of characters
// changes completely as you climb. `ability` drives the behaviour switch,
// `pred` + `aggro` decide who hunts you.
const SPECIES = [
  // --- sunlight ---
  { key: 'krill',       r: 3,  tier: 0, speed: 0.5, col: '#ffd5c0', shape: 'dot',    glow: 0.25, zone: [0, 2600], swarm: 6 },
  { key: 'minnow',      r: 7,  tier: 1, speed: 1.7, col: '#d7f0ff', shape: 'fish',   glow: 0.05, zone: [0, 1400], swarm: 4 },
  { key: 'sardine',     r: 9,  tier: 1, speed: 1.9, col: '#cfe6ff', shape: 'fish',   glow: 0.05, zone: [0, 1600], swarm: 5 },
  { key: 'mackerel',    r: 13, tier: 2, speed: 1.9, col: '#9fe0c0', shape: 'fish',   glow: 0,    zone: [0, 1500] },
  { key: 'pufferfish',  r: 15, tier: 2, speed: 0.6, col: '#f2d98a', shape: 'puffer', glow: 0,    zone: [0, 1300], ability: 'spike' },
  { key: 'tuna',        r: 30, tier: 5, speed: 2.2, col: '#6f8ba8', shape: 'fish',   glow: 0,    zone: [0, 1700] },
  { key: 'barracuda',   r: 26, tier: 4, speed: 2.1, col: '#b9c6cf', shape: 'needle', glow: 0,    zone: [0, 1600], pred: true, ability: 'lunge', aggro: 480, bill: 0.5 },
  { key: 'swordfish',   r: 34, tier: 5, speed: 2.4, col: '#7f93a8', shape: 'needle', glow: 0,    zone: [0, 1900], pred: true, ability: 'lunge', aggro: 580, bill: 1.3 },
  { key: 'orca',        r: 52, tier: 7, speed: 2.3, col: '#171b23', shape: 'orca',   glow: 0,    zone: [0, 1700], pred: true, aggro: 760, bold: true, swarm: 2 },

  // --- twilight ---
  { key: 'lanternfish', r: 9,  tier: 1, speed: 1.2, col: '#8fe9ff', shape: 'fish',   glow: 0.7,  zone: [640, 2600], swarm: 4, lamps: true },
  { key: 'hatchetfish', r: 11, tier: 2, speed: 1.0, col: '#dfe9f2', shape: 'hatchet',glow: 0.6,  zone: [820, 3000] },
  { key: 'squid',       r: 18, tier: 3, speed: 1.4, col: '#ff8fc4', shape: 'squid',  glow: 0.45, zone: [600, 3200], ability: 'ink' },
  { key: 'octopus',     r: 24, tier: 4, speed: 0.9, col: '#c4607f', shape: 'octopus',glow: 0.1,  zone: [520, 3400], ability: 'ink' },
  { key: 'jelly',       r: 17, tier: 2, speed: 0.35,col: '#c9a5ff', shape: 'jelly',  glow: 0.85, zone: [200, 3000], ability: 'sting' },
  { key: 'torpedoray',  r: 24, tier: 4, speed: 0.9, col: '#6f7ba8', shape: 'ray',    glow: 0.2,  zone: [400, 3400], ability: 'shock' },
  { key: 'shark',       r: 36, tier: 6, speed: 2.0, col: '#7d8a99', shape: 'shark',  glow: 0,    zone: [0, 3000], pred: true, aggro: 640 },
  { key: 'hammerhead',  r: 40, tier: 6, speed: 2.0, col: '#8895a3', shape: 'shark',  glow: 0,    zone: [260, 2400], pred: true, aggro: 660, hammer: true },

  // --- midnight ---
  { key: 'bristlemouth',r: 5,  tier: 0, speed: 0.9, col: '#a9c3d6', shape: 'dot',    glow: 0.35, zone: [1800, 4600], swarm: 5 },
  { key: 'viperfish',   r: 22, tier: 4, speed: 1.5, col: '#3a5f80', shape: 'viper',  glow: 0.5,  zone: [1900, 4200], pred: true, ability: 'lunge', aggro: 470 },
  { key: 'anglerfish',  r: 28, tier: 5, speed: 0.9, col: '#5a6b7a', shape: 'angler', glow: 1.0,  zone: [1600, 4200], pred: true, ability: 'lure', aggro: 400 },
  { key: 'vampsquid',   r: 20, tier: 4, speed: 1.1, col: '#8b2f52', shape: 'squid',  glow: 0.6,  zone: [2000, 4400], ability: 'ink', cloak: true },
  { key: 'gulpereel',   r: 34, tier: 5, speed: 0.9, col: '#22304a', shape: 'gulper', glow: 0.2,  zone: [2200, 4800], pred: true, aggro: 440 },
  { key: 'sixgill',     r: 46, tier: 7, speed: 1.5, col: '#5c6773', shape: 'shark',  glow: 0,    zone: [1800, 4600], pred: true, aggro: 640 },
  { key: 'spermwhale',  r: 72, tier: 8, speed: 1.9, col: '#4a4a52', shape: 'whale',  glow: 0,    zone: [500, 4600], pred: true, ability: 'sonar', aggro: 950, bold: true },

  // --- abyss ---
  { key: 'dumbo',       r: 16, tier: 3, speed: 0.6, col: '#d98fb5', shape: 'octopus',glow: 0.3,  zone: [3200, 5600], ability: 'ink', ears: true },
  { key: 'isopod',      r: 15, tier: 3, speed: 0.5, col: '#c9b28f', shape: 'bug',    glow: 0,    zone: [3200, 6200] },
  { key: 'snailfish',   r: 11, tier: 2, speed: 0.7, col: '#f0d9e6', shape: 'fish',   glow: 0.1,  zone: [3900, 7000] },
  { key: 'sleepershark',r: 54, tier: 7, speed: 1.2, col: '#4c545e', shape: 'shark',  glow: 0,    zone: [3000, 5800], pred: true, aggro: 600 },
  { key: 'colossal',    r: 62, tier: 8, speed: 1.7, col: '#a03a5e', shape: 'squid',  glow: 0.4,  zone: [3400, 6400], pred: true, ability: 'ink', aggro: 760, bold: true },

  // --- hadal ---
  { key: 'amphipod',    r: 6,  tier: 1, speed: 0.9, col: '#d8c6a8', shape: 'bug',    glow: 0.1,  zone: [4400, 7400], swarm: 6 },
  { key: 'hadalangler', r: 34, tier: 6, speed: 1.0, col: '#3b2b3f', shape: 'angler', glow: 1.0,  zone: [4600, 7000], pred: true, ability: 'lure', aggro: 500 },
  { key: 'bobbitworm',  r: 30, tier: 6, speed: 0.35,col: '#9a4a2f', shape: 'worm',   glow: 0.15, zone: [5000, 7600], pred: true, ability: 'lunge', aggro: 340 },
  { key: 'frilledshark',r: 42, tier: 7, speed: 1.4, col: '#5a4a55', shape: 'shark',  glow: 0,    zone: [4400, 6800], pred: true, aggro: 620, frill: true },

  // --- vents ---
  { key: 'ventshrimp',  r: 5,  tier: 1, speed: 0.8, col: '#ffb08a', shape: 'shrimp', glow: 0.4,  zone: [5600, 7600], swarm: 7 },
  { key: 'tubeworm',    r: 14, tier: 2, speed: 0,   col: '#e8536b', shape: 'tube',   glow: 0.3,  zone: [6100, 7600], sessile: true },
  { key: 'yeticrab',    r: 17, tier: 3, speed: 0.5, col: '#f2ead9', shape: 'bug',    glow: 0.15, zone: [5800, 7600] },
  { key: 'magmaeel',    r: 40, tier: 7, speed: 1.6, col: '#ff6a3d', shape: 'eel',    glow: 0.75, zone: [5600, 7600], pred: true, ability: 'shock', aggro: 580, bold: true },
  { key: 'siphonophore',r: 44, tier: 6, speed: 0.3, col: '#7affd8', shape: 'siphon', glow: 0.9,  zone: [4200, 7200], ability: 'sting' },

  // --- the cradle ---
  { key: 'hagfish',     r: 21, tier: 3, speed: 1.0, col: '#8f8674', shape: 'eel',    glow: 0.05, zone: [6300, 7600], ability: 'slime' },
  { key: 'eldersquid',  r: 78, tier: 9, speed: 1.7, col: '#5b2b8a', shape: 'squid',  glow: 0.55, zone: [6500, 7600], pred: true, ability: 'ink', aggro: 860, bold: true },

  // ======= ABOVE THE WAVES (negative y = altitude) =======
  // --- the open air ---
  { key: 'flyingfish',  r: 9,  tier: 1, speed: 2.2, col: '#bfe8ff', shape: 'fish',   glow: 0,    zone: [-420, 320], swarm: 4 },
  { key: 'seagull',     r: 9,  tier: 1, speed: 1.6, col: '#f2f6fa', shape: 'bird',   glow: 0,    zone: [-880, 60],  swarm: 4 },
  { key: 'pelican',     r: 16, tier: 3, speed: 1.2, col: '#e8dcc8', shape: 'bird',   glow: 0,    zone: [-700, 80],  pouch: true },
  { key: 'albatross',   r: 22, tier: 4, speed: 1.8, col: '#e6edf4', shape: 'bird',   glow: 0,    zone: [-940, -80], span: true },
  { key: 'frigate',     r: 19, tier: 4, speed: 2.2, col: '#2c2f3a', shape: 'bird',   glow: 0,    zone: [-940, -60], pred: true, ability: 'lunge', aggro: 440 },

  // --- the storm layer ---
  { key: 'stormpetrel', r: 8,  tier: 1, speed: 1.9, col: '#9aa8bc', shape: 'bird',   glow: 0,    zone: [-2300, -800], swarm: 5 },
  { key: 'thunderjelly',r: 18, tier: 3, speed: 0.4, col: '#bfd2ff', shape: 'jelly',  glow: 0.8,  zone: [-2300, -900], ability: 'sting' },
  { key: 'lightwisp',   r: 15, tier: 3, speed: 1.0, col: '#cfe8ff', shape: 'wisp',   glow: 0.95, zone: [-2350, -1000], ability: 'shock' },
  { key: 'zeppelin',    r: 36, tier: 8, speed: 0.4, col: '#9c8468', shape: 'zeppelin',glow: 0,   zone: [-2200, -1000], bonus: 300 },
  { key: 'stormroc',    r: 48, tier: 7, speed: 2.0, col: '#3b4254', shape: 'bird',   glow: 0,    zone: [-2350, -900], pred: true, aggro: 720, bold: true, span: true },

  // --- the jet stream ---
  { key: 'skyray',      r: 20, tier: 3, speed: 1.5, col: '#a8c8e8', shape: 'ray',    glow: 0.35, zone: [-3700, -2300] },
  { key: 'propplane',   r: 24, tier: 5, speed: 1.8, col: '#c8b898', shape: 'plane',  glow: 0,    zone: [-3500, -2350], bonus: 90 },
  { key: 'jetfighter',  r: 30, tier: 6, speed: 2.6, col: '#7a8694', shape: 'jet',    glow: 0,    zone: [-3750, -2400], pred: true, ability: 'lunge', aggro: 680 },
  { key: 'cargoplane',  r: 42, tier: 7, speed: 1.4, col: '#8a9088', shape: 'plane',  glow: 0,    zone: [-3700, -2500], bonus: 220, big: true },

  // --- the stratosphere ---
  { key: 'ozonemoth',   r: 12, tier: 2, speed: 0.9, col: '#d8c8ff', shape: 'moth',   glow: 0.6,  zone: [-5100, -3750], swarm: 4 },
  { key: 'balloon',     r: 18, tier: 2, speed: 0.25,col: '#f2e2d0', shape: 'balloon',glow: 0.1,  zone: [-5000, -3800] },
  { key: 'auroraeel',   r: 28, tier: 4, speed: 1.3, col: '#7affc8', shape: 'eel',    glow: 0.9,  zone: [-5150, -3900], ability: 'sting' },
  { key: 'spriteflare', r: 16, tier: 3, speed: 1.1, col: '#ff8a9c', shape: 'wisp',   glow: 1.0,  zone: [-5150, -3800], ability: 'shock' },

  // --- the edge of sky ---
  { key: 'meteorling',  r: 14, tier: 3, speed: 2.4, col: '#ffb060', shape: 'meteor', glow: 0.8,  zone: [-6550, -5150], swarm: 3 },
  { key: 'voidjelly',   r: 22, tier: 3, speed: 0.4, col: '#b08aff', shape: 'jelly',  glow: 0.9,  zone: [-6550, -5200], ability: 'sting' },
  { key: 'satellite',   r: 22, tier: 4, speed: 0.7, col: '#cfd6de', shape: 'satellite',glow: 0.2,zone: [-6550, -5300], bonus: 80 },
  { key: 'edgewyrm',    r: 44, tier: 7, speed: 1.6, col: '#5a3a6e', shape: 'eel',    glow: 0.5,  zone: [-6550, -5200], pred: true, aggro: 640, bold: true },

  // --- low orbit ---
  { key: 'spacejunk',   r: 11, tier: 2, speed: 0.5, col: '#9aa2ac', shape: 'junk',   glow: 0.1,  zone: [-7950, -6550], swarm: 4 },
  { key: 'astronaut',   r: 10, tier: 2, speed: 0.4, col: '#eef2f6', shape: 'astronaut',glow: 0.15,zone: [-7900, -6600] },
  { key: 'commsat',     r: 28, tier: 5, speed: 0.8, col: '#b8c8d8', shape: 'satellite',glow: 0.3, zone: [-7950, -6600], bonus: 120, dish: true },
  { key: 'rocketship',  r: 34, tier: 6, speed: 2.0, col: '#e8e2d8', shape: 'rocket', glow: 0.5,  zone: [-7950, -6550], bonus: 260 },
  { key: 'ufo',         r: 34, tier: 6, speed: 1.6, col: '#8ae8c8', shape: 'ufo',    glow: 0.7,  zone: [-7950, -6600], pred: true, ability: 'lure', aggro: 560 },

  // --- the void ---
  { key: 'starkrill',   r: 5,  tier: 0, speed: 0.7, col: '#fff2c0', shape: 'dot',    glow: 0.85, zone: [-9250, -7950], swarm: 7 },
  { key: 'cometling',   r: 24, tier: 4, speed: 2.2, col: '#a0e8ff', shape: 'comet',  glow: 0.9,  zone: [-9250, -7950] },
  { key: 'nebulajelly', r: 34, tier: 5, speed: 0.35,col: '#e88aff', shape: 'jelly',  glow: 1.0,  zone: [-9250, -8000], ability: 'sting' },
  { key: 'voidwhale',   r: 70, tier: 9, speed: 1.7, col: '#2a2440', shape: 'whale',  glow: 0.4,  zone: [-9250, -7950], pred: true, ability: 'sonar', aggro: 900, bold: true, bonus: 420 },

  // --- lunar approach ---
  { key: 'dustwisp',    r: 8,  tier: 1, speed: 0.8, col: '#d8d2c8', shape: 'wisp',   glow: 0.6,  zone: [SKY_TOP + 200, -9250], swarm: 5 },
  { key: 'moonmoth',    r: 16, tier: 3, speed: 1.0, col: '#f2ecd8', shape: 'moth',   glow: 0.8,  zone: [SKY_TOP + 200, -9250], swarm: 3 },
  { key: 'lunarshard',  r: 30, tier: 6, speed: 1.9, col: '#cfd2e2', shape: 'meteor', glow: 0.7,  zone: [SKY_TOP + 150, -9200], pred: true, ability: 'lunge', aggro: 600 },

  // ======= THE FROZEN REACHES (far east / far west) =======
  { key: 'icefish',     r: 8,  tier: 1, speed: 1.4, col: '#d8f2ff', shape: 'fish',   glow: 0.15, zone: [180, 1500],  swarm: 5, arctic: true },
  { key: 'frostjelly',  r: 18, tier: 3, speed: 0.3, col: '#bfe8ff', shape: 'jelly',  glow: 0.7,  zone: [200, 1900],  ability: 'sting', arctic: true },
  { key: 'penguin',     r: 14, tier: 3, speed: 2.1, col: '#20242c', shape: 'penguin',glow: 0,    zone: [-260, 800],  swarm: 3, arctic: true },
  { key: 'beluga',      r: 34, tier: 5, speed: 1.6, col: '#e8eef2', shape: 'whale',  glow: 0,    zone: [100, 1300],  arctic: true },
  { key: 'walrus',      r: 30, tier: 5, speed: 1.0, col: '#8a6a58', shape: 'whale',  glow: 0,    zone: [60, 700],    arctic: true },
  { key: 'narwhal',     r: 38, tier: 6, speed: 2.0, col: '#c8ccd4', shape: 'needle', glow: 0,    zone: [80, 1500],   pred: true, ability: 'lunge', aggro: 560, bill: 1.6, arctic: true },
  { key: 'greenland',   r: 56, tier: 8, speed: 1.1, col: '#5a625e', shape: 'shark',  glow: 0,    zone: [400, 2600],  pred: true, aggro: 600, arctic: true },
  { key: 'snowpetrel',  r: 9,  tier: 1, speed: 1.8, col: '#f2f6fa', shape: 'bird',   glow: 0,    zone: [-750, 40],   swarm: 4, arctic: true },

  // ======= ALLIES =======
  // They don't get eaten — they get adopted. A joined ally rides your wake
  // and throws itself at whatever swims too close.
  { key: 'remora',      r: 9,  tier: 1, speed: 2.0, col: '#9fb8c8', shape: 'remora', glow: 0,    zone: [200, 3400],  ally: true },
  { key: 'pilotfish',   r: 10, tier: 1, speed: 2.2, col: '#e8d590', shape: 'fish',   glow: 0,    zone: [0, 1700],    ally: true },
  { key: 'skyfinch',    r: 8,  tier: 1, speed: 2.2, col: '#ffd8a8', shape: 'bird',   glow: 0,    zone: [-3600, -300], ally: true },
  { key: 'voidling',    r: 9,  tier: 1, speed: 1.8, col: '#c8a8ff', shape: 'wisp',   glow: 0.8,  zone: [-9200, -6300], ally: true },
  { key: 'cinderling',  r: 10, tier: 1, speed: 1.9, col: '#ff9a5a', shape: 'meteor', glow: 0.7,  zone: [8200, 13600], ally: true },
  { key: 'lakeloach',   r: 9,  tier: 1, speed: 2.0, col: '#b8c878', shape: 'remora', glow: 0,    zone: [150, 2400],  ally: true, fresh: true },

  // ======= BENEATH THE FLOOR (unlocked late) =======
  // --- the drowned caves ---
  { key: 'caveshrimp',  r: 6,  tier: 1, speed: 0.8, col: '#e8dcd0', shape: 'shrimp', glow: 0.2,  zone: [7700, 10000], swarm: 6 },
  { key: 'blindfish',   r: 11, tier: 2, speed: 0.9, col: '#f0e6e0', shape: 'fish',   glow: 0.1,  zone: [7700, 9700],  swarm: 3 },
  { key: 'olm',         r: 18, tier: 3, speed: 1.0, col: '#f2d8ce', shape: 'eel',    glow: 0.1,  zone: [7700, 9800] },
  { key: 'cavelurker',  r: 44, tier: 7, speed: 1.1, col: '#3a3236', shape: 'angler', glow: 0.9,  zone: [7800, 9900],  pred: true, ability: 'lure', aggro: 520 },
  // --- the sunless sea ---
  { key: 'ghostfish',   r: 13, tier: 2, speed: 1.1, col: '#cfe2e8', shape: 'fish',   glow: 0.5,  zone: [8800, 10000], swarm: 4 },
  { key: 'boneserpent', r: 48, tier: 7, speed: 1.5, col: '#d8d2c0', shape: 'eel',    glow: 0.2,  zone: [8850, 10000], pred: true, aggro: 620 },
  // --- crystal hollows ---
  { key: 'gemcrab',     r: 16, tier: 3, speed: 0.5, col: '#a8e8d8', shape: 'bug',    glow: 0.5,  zone: [10000, 11200] },
  { key: 'prismjelly',  r: 20, tier: 3, speed: 0.35,col: '#d8a8ff', shape: 'jelly',  glow: 1.0,  zone: [10000, 11200], ability: 'sting' },
  { key: 'shardgolem',  r: 52, tier: 8, speed: 1.3, col: '#8ac8e2', shape: 'meteor', glow: 0.6,  zone: [10050, 11200], pred: true, ability: 'lunge', aggro: 560 },
  // --- the magma sea ---
  { key: 'emberling',   r: 7,  tier: 1, speed: 1.0, col: '#ffb060', shape: 'dot',    glow: 0.8,  zone: [11200, 12600], swarm: 6 },
  { key: 'lavaslug',    r: 15, tier: 3, speed: 0.4, col: '#e2603a', shape: 'worm',   glow: 0.6,  zone: [11200, 12500] },
  { key: 'magmaray',    r: 30, tier: 5, speed: 1.0, col: '#ff8a4a', shape: 'ray',    glow: 0.6,  zone: [11250, 12500], ability: 'shock' },
  { key: 'obsidianshark', r: 58, tier: 8, speed: 1.8, col: '#241f2c', shape: 'shark', glow: 0.2, zone: [11200, 12600], pred: true, aggro: 680, bold: true },
  // --- the mantle + the core ---
  { key: 'moltengolem', r: 40, tier: 6, speed: 0.9, col: '#c25a2a', shape: 'meteor', glow: 0.7,  zone: [12500, 13900] },
  { key: 'rockwyrm',    r: 66, tier: 9, speed: 1.5, col: '#5a3a28', shape: 'worm',   glow: 0.3,  zone: [12500, 14000], pred: true, aggro: 760, bold: true, bonus: 320 },
  { key: 'coreguardian', r: 50, tier: 8, speed: 1.9, col: '#ffc26a', shape: 'meteor', glow: 0.9, zone: [12900, WORLD_BOTTOM - 100], pred: true, ability: 'lunge', aggro: 640 },

  // ======= THE SWEET WATER (the lake, after everything) =======
  { key: 'fry',         r: 4,  tier: 0, speed: 0.9, col: '#d8e8c0', shape: 'dot',    glow: 0.1,  zone: [200, 1800],  swarm: 7, fresh: true },
  { key: 'bluegill',    r: 9,  tier: 1, speed: 1.5, col: '#a8c8a0', shape: 'fish',   glow: 0,    zone: [150, 1500],  swarm: 4, fresh: true },
  { key: 'carp',        r: 18, tier: 3, speed: 1.2, col: '#c8a860', shape: 'fish',   glow: 0,    zone: [200, 2600],  fresh: true },
  { key: 'crawdad',     r: 12, tier: 2, speed: 0.6, col: '#b04a30', shape: 'bug',    glow: 0,    zone: [1200, 7600], fresh: true },
  { key: 'dragonnymph', r: 14, tier: 3, speed: 1.6, col: '#7a9a4a', shape: 'bug',    glow: 0,    zone: [150, 1000],  fresh: true, ability: 'lunge', pred: true, aggro: 360 },
  { key: 'riverdolphin', r: 34, tier: 5, speed: 2.0, col: '#e2b8c8', shape: 'whale', glow: 0,    zone: [200, 1700],  fresh: true },
  { key: 'snapper',     r: 26, tier: 5, speed: 0.7, col: '#5a6a42', shape: 'turtle', glow: 0,    zone: [100, 1400],  fresh: true, pred: true, aggro: 300 },
  { key: 'pike',        r: 30, tier: 5, speed: 2.2, col: '#8aa858', shape: 'needle', glow: 0,    zone: [150, 1900],  fresh: true, pred: true, ability: 'lunge', aggro: 540, bill: 0.7 },
  { key: 'otter',       r: 22, tier: 4, speed: 2.3, col: '#6a4a32', shape: 'eel',    glow: 0,    zone: [80, 700],    fresh: true, pred: true, ability: 'lunge', aggro: 440 },
  { key: 'sturgeon',    r: 52, tier: 7, speed: 1.3, col: '#7a8288', shape: 'shark',  glow: 0,    zone: [600, 4200],  fresh: true, bonus: 140 },
  { key: 'catfish',     r: 44, tier: 7, speed: 1.2, col: '#4a4238', shape: 'gulper', glow: 0,    zone: [800, 5600],  fresh: true, pred: true, aggro: 560 },
  { key: 'crocodile',   r: 48, tier: 7, speed: 1.9, col: '#5a6e3a', shape: 'needle', glow: 0,    zone: [60, 650],    fresh: true, pred: true, aggro: 660, bold: true, bill: 1.1 },
  { key: 'hippo',       r: 60, tier: 8, speed: 1.4, col: '#9a7a82', shape: 'whale',  glow: 0,    zone: [60, 520],    fresh: true, pred: true, aggro: 500, bold: true, bonus: 220 },
]

// Flotsam from a shattered hull — not a species that spawns naturally, it only
// appears when you take a boat apart.
const FLOTSAM = [
  { key: 'plank',  r: 11, tier: 3, speed: 0.1, col: '#6b4a2c', shape: 'plank',  glow: 0, zone: [0, WORLD_H] },
  { key: 'barrel', r: 14, tier: 4, speed: 0.1, col: '#7c5a34', shape: 'barrel', glow: 0, zone: [0, WORLD_H] },
]

// ---- Creatures ---------------------------------------------------------
const creatures = []
const CREATURE_CAP = 110

function makeCreature(sp, x, y) {
  return {
    x, y,
    // Bounded variance: every species has a stage that fully outgrows it.
    r: sp.r * rand(0.85, 1.15),
    dir: x > player.x ? -1 : 1,
    speed: sp.speed,
    col: sp.col,
    shape: sp.shape,
    glow: sp.glow,
    tier: sp.tier,
    pred: !!sp.pred,
    bold: !!sp.bold,
    ability: sp.ability || null,
    aggro: sp.aggro || 260,
    minY: sp.zone[0],
    maxY: sp.zone[1],
    key: sp.key,
    lamps: !!sp.lamps,
    hammer: !!sp.hammer,
    frill: !!sp.frill,
    ears: !!sp.ears,
    cloak: !!sp.cloak,
    pouch: !!sp.pouch,
    span: !!sp.span,
    dish: !!sp.dish,
    big: !!sp.big,
    bonus: sp.bonus || 0,
    bill: sp.bill || 0,
    wob: rand(0, TAU),
    vy: 0,
    cd: rand(0.5, 3),      // ability cooldown
    windup: 0,             // telegraph before a discharge
    dash: 0,               // seconds left of a lunge
    dashA: 0,
    dashS: 0,
    puffed: 0,             // pufferfish inflation
    hunting: 0,
    biteCd: 0,
    stunT: 0,              // stunned by one of the player's abilities
    hp: sp.r * 1.6,        // chip damage from allies (the player's maw ignores this)
    isAlly: !!sp.ally,
    joined: false,         // an ally that has fallen in behind you
    orbit: rand(0, TAU),   // where in your wake a joined ally rides
    atkCd: rand(0.5, 1.5),
    sessile: !!sp.sessile, // rooted to the floor: tube worms and their kin
  }
}

// How deep the world currently goes: the seafloor is solid until the very
// late game cracks it open.
let worldFloorOpen = false
function floorY() { return worldFloorOpen ? WORLD_BOTTOM : WORLD_H }

function spawnCreature(nearPlayer) {
  if (creatures.length >= CREATURE_CAP) return
  const pw = player.headW
  const y = nearPlayer
    ? clamp(player.y + rand(-460, 460), SKY_TOP + 120, floorY() - 40)
    : rand(120, WORLD_H - 40)
  // Only things that live at this depth — and in this water. The lake keeps
  // its own fish, the poles keep theirs, and the sky belongs to everyone.
  const arc = arcticness(player.x)
  const here = SPECIES.filter((s) => {
    if (y < s.zone[0] || y > s.zone[1]) return false
    const airborneSp = s.zone[1] <= 120  // lives wholly above the waves
    const underworld = s.zone[0] >= 7600 // lives beneath any floor, salt or sweet
    if (!airborneSp && !underworld) {
      if (s.fresh ? realm !== 'freshwater' : realm === 'freshwater' && !s.ally) return false
      if (s.arctic ? arc < 0.3 : arc > 0.75 && s.zone[1] < 2800 && s.zone[0] >= 0) return false
    }
    return true
  })
  let pool = here.filter((s) => s.r < pw * 3.6 && s.r > pw * 0.1)
  if (!pool.length) pool = here
  if (!pool.length) pool = SPECIES
  let sp = pool[Math.floor(Math.random() * pool.length)]
  // predators are the spice, not the meal — re-roll half of them
  if (sp.pred && Math.random() < 0.5) sp = pool[Math.floor(Math.random() * pool.length)]
  // allies are a lucky find, not a school
  if (sp.ally && Math.random() < 0.65) sp = pool[Math.floor(Math.random() * pool.length)]

  // Spawn just beyond a screen edge so things drift into view.
  const edge = Math.random() < 0.5 ? -1 : 1
  const x = player.x + edge * window.innerWidth * rand(0.25, 0.66)
  const n = sp.swarm ? Math.ceil(sp.swarm * rand(0.5, 1)) : 1
  for (let i = 0; i < n; i++) {
    if (creatures.length >= CREATURE_CAP) return
    const c = makeCreature(
      sp,
      x + (n > 1 ? rand(-70, 70) : 0),
      clamp(y + (n > 1 ? rand(-50, 50) : 0), sp.zone[0], sp.zone[1])
    )
    // the sessile take root in the seafloor, right where they sprouted
    if (c.sessile) c.y = WORLD_H - rand(4, 18)
    creatures.push(c)
  }
}
// seed the world — some scattered through the column, plenty around the start
for (let i = 0; i < 46; i++) spawnCreature(false)
for (let i = 0; i < 16; i++) spawnCreature(true)

// ---- Hazards -----------------------------------------------------------
const inkClouds = []   // blinding, slowing ink
const shocks = []      // expanding electric / sonar rings
const slimes = []      // hagfish slime globs
const charges = []     // depth charges sinking from a dreadnought

function inkCloud(x, y, r, col) {
  inkClouds.push({ x, y, r: r * 0.4, max: r, a: 1, col, life: 5, blobs: Array.from({ length: 5 }, () => ({ dx: rand(-1, 1), dy: rand(-1, 1), s: rand(0.5, 1) })) })
}
function shockRing(x, y, max, opts = {}) {
  shocks.push({ x, y, r: 8, max, a: 1, hit: false, foe: !!opts.foe, srcR: opts.srcR || 0, dmg: opts.dmg ?? 22, stun: opts.stun ?? 0.7, col: opts.col || '#9fe8ff' })
}

// A blast the PLAYER owns: stuns / shoves / devours the neighbours instead of
// hurting us. Effects land instantly; the ring is just the light show.
function foeBlast(x, y, radius, opts = {}) {
  shockRing(x, y, radius, { foe: true, col: opts.col || stage().accent })
  for (let i = creatures.length - 1; i >= 0; i--) {
    const c = creatures[i]
    if (c.isAlly) continue
    const d = Math.hypot(c.x - x, c.y - y)
    if (d > radius + c.r) continue
    if (opts.stun) c.stunT = Math.max(c.stunT, opts.stun)
    if (opts.push && !c.sessile) {
      const a = Math.atan2(c.y - y, c.x - x)
      c.dash = 0.4
      c.dashA = a
      c.dashS = opts.push * (1 - d / (radius + c.r + 1)) + 3
    }
    if (opts.dmg) {
      c.hp -= opts.dmg
      if (c.hp <= 0) {
        addBiomass(foodValue(c) * 0.7)
        puff(c.x, c.y, c.col)
        creatures.splice(i, 1)
        continue
      }
    }
    if (opts.devour && c.r < player.headW * 1.05) {
      addBiomass(foodValue(c))
      puff(c.x, c.y, c.col)
      creatures.splice(i, 1)
    }
  }
}

// ---- Allies ------------------------------------------------------------
// Remoras and their stranger cousins. Swim up to one and it falls in behind
// you, orbiting your wake and hurling itself at anything that swims too
// close — until something kills it.
const ALLY_CAP = 6
const ALLY_NAMES = {
  remora: 'a remora', pilotfish: 'a pilot fish', skyfinch: 'a sky finch',
  voidling: 'a voidling', cinderling: 'a cinderling', lakeloach: 'a lake loach',
}
const alliesGreeted = new Set()
function joinedAllies() { return creatures.filter((c) => c.joined).length }

// Returns how many creatures at indices below `i` were removed, so the
// caller's loop index can stay aligned.
function updateAlly(c, i, dp, dxp, dyp, dt) {
  let removedBelow = 0
  if (!c.joined) {
    // free ally: schools idly, drifts toward anything big enough to shadow
    if (dp < 460 && player.headW > c.r && joinedAllies() < ALLY_CAP) {
      c.dir = dxp > 0 ? 1 : -1
      c.x += (dxp / dp) * 55 * dt
      c.y += (dyp / dp) * 55 * dt
    }
    c.x += c.dir * c.speed * 0.5 * dt * 60
    c.y += Math.sin(c.wob) * 0.3
    c.y = clamp(c.y, c.minY, Math.min(floorY() - 18, c.maxY))
    if (dp < player.headW * stage().reach + c.r + 8 && player.headW > c.r && joinedAllies() < ALLY_CAP) {
      c.joined = true
      ripple(c.x, c.y, 60, c.col)
      if (!alliesGreeted.has(c.key)) {
        alliesGreeted.add(c.key)
        showBanner((ALLY_NAMES[c.key] || 'a companion').toUpperCase() + ' JOINS YOU')
      }
    }
    // free allies recycle like anything else
    if (Math.abs(c.x - player.x) > window.innerWidth * 1.5 || Math.abs(c.y - player.y) > window.innerHeight * 1.6) {
      creatures.splice(i, 1)
    }
    return 0
  }

  // joined: ride the wake...
  c.orbit += dt * 1.4
  const R = player.headW * 2.2 + 44
  const slotX = player.x + Math.cos(c.orbit) * R
  const slotY = player.y + Math.sin(c.orbit) * R * 0.7
  c.atkCd -= dt

  if (c.dash > 0) {
    // ...or press an attack
    c.dash -= dt
    c.x += Math.cos(c.dashA) * c.dashS * dt * 60
    c.y += Math.sin(c.dashA) * c.dashS * dt * 60
    for (let j = creatures.length - 1; j >= 0; j--) {
      const t = creatures[j]
      if (t === c || t.isAlly) continue
      if (Math.hypot(t.x - c.x, t.y - c.y) > t.r + c.r) continue
      t.hp -= 11
      c.dash = 0
      c.atkCd = rand(1.2, 2.2)
      puff(t.x, t.y, c.col)
      if (t.hp <= 0) {
        // your pack hunts for you — half rations, delivered
        addBiomass(foodValue(t) * 0.5)
        puff(t.x, t.y, t.col)
        creatures.splice(j, 1)
        if (j < i) removedBelow++
      } else if (t.pred && Math.random() < 0.35) {
        // big things bite back
        c.hp -= 15
        puff(c.x, c.y, '#ff5a5a')
        if (c.hp <= 0) {
          puff(c.x, c.y, c.col)
          creatures.splice(i - removedBelow, 1)
          return removedBelow
        }
      }
      break
    }
  } else {
    // glide back into formation
    c.x += (slotX - c.x) * Math.min(1, dt * 3)
    c.y += (slotY - c.y) * Math.min(1, dt * 3)
    c.dir = Math.cos(c.orbit) > 0 ? 1 : -1
    // pick a fight with the nearest thing worth fighting
    if (c.atkCd <= 0) {
      let best = null, bestD = 340
      for (const t of creatures) {
        if (t === c || t.isAlly || t.sessile) continue
        if (t.r > player.headW * 1.8) continue
        const d = Math.hypot(t.x - c.x, t.y - c.y)
        if (d < bestD) { bestD = d; best = t }
      }
      if (best) {
        c.dash = 0.55
        c.dashA = Math.atan2(best.y - c.y, best.x - c.x)
        c.dashS = 7 + c.speed * 2
        c.dir = Math.cos(c.dashA) > 0 ? 1 : -1
      }
    }
  }
  return removedBelow
}

// ---- The Moon ----------------------------------------------------------
// The last meal. It hangs at the top of the column, drifts to loom over
// whatever climbs that high, and does not want to be eaten.
const MOON = {
  x: 0, y: MOON_Y, r: 270,
  hp: 120, maxHp: 120,
  awake: false, eaten: false,
  lanceCd: 3, shardCd: 7, clangCd: 0,
  bites: [],          // scallops chewed out of the rim: {a, r}
  quarterBanners: 0,  // how many "the moon cracks" thresholds we've announced
}
const moonlances = [] // slow bright bolts the moon throws

function moonRadius() {
  return MOON.r * (0.45 + 0.55 * clamp(MOON.hp / MOON.maxHp, 0, 1))
}

function biteMoon() {
  MOON.hp -= 1
  MOON.bites.push({ a: Math.atan2(player.y - MOON.y, player.x - MOON.x) + rand(-0.25, 0.25), r: rand(30, 70) })
  if (MOON.bites.length > 26) MOON.bites.shift()
  player.flash = 1
  player.maw = 1
  cam.shake = Math.max(cam.shake, 0.4)
  puff(player.x, player.y, '#f2ecd0')
  addBiomass(6)
  // knock loose an edible chunk of crust now and then
  if (Math.random() < 0.4 && creatures.length < CREATURE_CAP) {
    const chunk = makeCreature(MOONCHUNK, player.x + rand(-60, 60), player.y + rand(-40, 40))
    chunk.vy = rand(0.4, 1.2)
    creatures.push(chunk)
  }
  const q = Math.floor((1 - MOON.hp / MOON.maxHp) * 4)
  if (q > MOON.quarterBanners && MOON.hp > 0) {
    MOON.quarterBanners = q
    showBanner(['THE MOON CRACKS', 'THE MOON IS WANING', 'THE MOON IS A CRESCENT'][Math.min(q - 1, 2)])
  }
  if (MOON.hp <= 0 && !MOON.eaten) eatTheMoon()
}

function eatTheMoon() {
  MOON.eaten = true
  worldFloorOpen = true
  cam.shake = 1.6
  for (let k = 0; k < 8; k++) ripple(MOON.x + rand(-200, 200), MOON.y + rand(-200, 200), rand(200, 500), '#fff2c8')
  showBanner('YOU HAVE EATEN THE MOON')
  queueBanner('THE TIDES ANSWER TO YOU NOW', 3.2)
  queueBanner('FAR BELOW, THE SEAFLOOR SPLITS OPEN', 6.4)
  addBiomass(600)
  setTimeout(() => {
    const end = document.getElementById('end-screen')
    if (end) end.classList.remove('hidden')
  }, 3600)
}

const MOONCHUNK = { key: 'moonchunk', r: 16, tier: 5, speed: 0.15, col: '#e8e2c8', shape: 'meteor', glow: 0.5, zone: [SKY_TOP, WORLD_BOTTOM], bonus: 40 }

// ---- The Core ----------------------------------------------------------
// The other last meal. It burns at the bottom of the bottom, past the caves
// the moon's death opened, and it is even less willing than the moon was.
const CORE = {
  x: 0, y: CORE_Y, r: 330,
  hp: 160, maxHp: 160,
  awake: false, eaten: false,
  burstCd: 3, guardCd: 8, clangCd: 0,
  bites: [],
  quarterBanners: 0,
}

function coreRadius() {
  return CORE.r * (0.45 + 0.55 * clamp(CORE.hp / CORE.maxHp, 0, 1))
}

function biteCore() {
  CORE.hp -= 1
  CORE.bites.push({ a: Math.atan2(player.y - CORE.y, player.x - CORE.x) + rand(-0.25, 0.25), r: rand(36, 80) })
  if (CORE.bites.length > 26) CORE.bites.shift()
  player.flash = 1
  player.maw = 1
  cam.shake = Math.max(cam.shake, 0.45)
  puff(player.x, player.y, '#ffcf8a')
  addBiomass(8)
  const q = Math.floor((1 - CORE.hp / CORE.maxHp) * 4)
  if (q > CORE.quarterBanners && CORE.hp > 0) {
    CORE.quarterBanners = q
    showBanner(['THE CORE SHUDDERS', 'THE WORLD SKIPS A HEARTBEAT', 'THE FIRE IS GOING OUT'][Math.min(q - 1, 2)])
  }
  if (CORE.hp <= 0 && !CORE.eaten) eatTheCore()
}

function eatTheCore() {
  CORE.eaten = true
  cam.shake = 2
  for (let k = 0; k < 10; k++) ripple(CORE.x + rand(-260, 260), CORE.y + rand(-260, 260), rand(240, 600), '#ffd166')
  showBanner('YOU HAVE EATEN THE HEART OF THE WORLD')
  queueBanner('AND STILL YOU ARE HUNGRY', 3.4)
  addBiomass(900)
  setTimeout(() => {
    const end = document.getElementById('core-end-screen')
    if (end) end.classList.remove('hidden')
  }, 3800)
}

// The lake at the end of everything.
function enterFreshwater() {
  realm = 'freshwater'
  creatures.length = 0
  boats.length = 0
  player.x = 0
  player.y = 700
  player.vx = 0
  player.vy = 0
  player.spine.forEach((p, i) => { p.x = player.x - i * 6; p.y = player.y })
  cam.y = clamp(player.y - window.innerHeight / 2, SKY_TOP, floorY() - window.innerHeight)
  for (let i = 0; i < 20; i++) spawnCreature(true)
  showBanner('THE SWEET WATER')
  queueBanner('NO SALT · NEW TEETH', 2.8)
}

// ---- Abilities ---------------------------------------------------------
// One tap, one signature move per form. Cooldowns are short enough to be part
// of the swim, long enough to matter.
function fireAbility() {
  if (!interactive || player.abilityCd > 0 || player.stun > 0) return
  const ab = stage().ability
  if (!ab) return
  player.abilityCd = ab.cd
  const aimX = mouse.x - window.innerWidth / 2
  const aimY = mouse.y + cam.y - player.y
  const al = Math.hypot(aimX, aimY) || 1
  switch (ab.key) {
    case 'dash': // Ribbon Eel: a slippery burst toward the cursor
      player.vx += (aimX / al) * 16
      player.vy += (aimY / al) * 16
      player.guard = Math.max(player.guard, 0.5)
      ripple(player.x, player.y, 90, stage().accent)
      break
    case 'lure': // Viperfish: light the lamp; small prey can't help itself
      player.lureT = 4.5
      ripple(player.x, player.y, 130, stage().accent)
      break
    case 'gulp': // Gulper Eel: open the pouch and inhale
      player.gulpT = 1.5
      player.gulpR = 300
      player.maw = 1
      break
    case 'storm': // Sea Serpent: a stunning discharge
      foeBlast(player.x, player.y, 330, { stun: 2.4, col: '#8affd0' })
      break
    case 'frenzy': // Bone Shark: nothing in the water can touch you
      player.frenzyT = 3
      player.guard = Math.max(player.guard, 3)
      ripple(player.x, player.y, 110, '#e8f7ff')
      break
    case 'sonar': // Leviathan: the click that stops a whole shoal
      foeBlast(player.x, player.y, 560, { stun: 2.8, col: '#ff6aa8' })
      cam.shake = Math.max(cam.shake, 0.3)
      break
    case 'veil': // Kraken: vanish into your own night
      inkCloud(player.x, player.y, 300, '#12041c')
      player.veilT = 5
      player.guard = Math.max(player.guard, 1)
      break
    case 'leap': // Drowned God: hurl yourself at the sky
      player.vy -= 24
      player.vx += (aimX / al) * 7
      player.launchT = 0.9
      cam.shake = Math.max(cam.shake, 0.25)
      if (player.y > SURFACE_Y - 60) {
        for (let i = 0; i < 3; i++) ripple(player.x + rand(-40, 40), SURFACE_Y + 10, 90, '#cfe9ff')
      }
      break
    case 'gale': // Stormbringer: one wingbeat, a shockwave of wind
      foeBlast(player.x, player.y, 380, { push: 10, stun: 1.2, col: '#eaff70' })
      player.vy -= 8
      break
    case 'vacuum': // Cloud Devourer: swallow the weather
      player.gulpT = 2.2
      player.gulpR = 460
      player.maw = 1
      break
    case 'gravity': // Star Serpent: everything falls toward you
      player.gravT = 2.6
      ripple(player.x, player.y, 300, stage().accent)
      break
    case 'nova': // The Mooneater: a detonation that feeds you — and cracks moons
      foeBlast(player.x, player.y, 640, { stun: 2, devour: true, col: '#9ff2ff' })
      cam.shake = Math.max(cam.shake, 0.6)
      if (!MOON.eaten && Math.hypot(MOON.x - player.x, MOON.y - player.y) < moonRadius() + 640) {
        for (let i = 0; i < 4; i++) biteMoon()
      }
      break
    case 'eruption': // The Magmaw: cook everything nearby
      foeBlast(player.x, player.y, 480, { stun: 1.5, dmg: 45, col: '#ffb347' })
      cam.shake = Math.max(cam.shake, 0.4)
      break
    case 'quake': // Obsidian Colossus: the water itself becomes a hammer
      foeBlast(player.x, player.y, 560, { stun: 2.8, push: 13, col: '#ff5a3c' })
      cam.shake = Math.max(cam.shake, 0.7)
      break
    case 'cataclysm': // The Worldeater: an ending, applied locally — cracks cores
      foeBlast(player.x, player.y, 740, { stun: 2.2, dmg: 70, devour: true, col: '#ffd166' })
      cam.shake = Math.max(cam.shake, 0.9)
      if (!CORE.eaten && Math.hypot(CORE.x - player.x, CORE.y - player.y) < coreRadius() + 740) {
        for (let i = 0; i < 4; i++) biteCore()
      }
      break
  }
}

// ---- Boats -------------------------------------------------------------
// The fleet upgrades as you do. Small hulls are chewable once you are the
// Kraken; the big ones show up precisely because you got big.
const BOAT_TYPES = [
  { key: 'skiff',       name: 'Skiff',       w: 38,  hp: 3,  biomass: 170,  from: 0, tough: KRAKEN_STAGE,     speed: [0.5, 0.9], gear: 'hook' },
  { key: 'trawler',     name: 'Trawler',     w: 68,  hp: 7,  biomass: 430,  from: 2, tough: KRAKEN_STAGE,     speed: [0.4, 0.7], gear: 'net' },
  { key: 'whaler',      name: 'Whaler',      w: 96,  hp: 12, biomass: 900,  from: 5, tough: KRAKEN_STAGE,     speed: [0.5, 0.8], gear: 'harpoon' },
  { key: 'dreadnought', name: 'Dreadnought', w: 148, hp: 18, biomass: 2100, from: KRAKEN_STAGE, tough: KRAKEN_STAGE + 1, speed: [0.3, 0.6], gear: 'charges' },
]
const boats = []
const harpoons = []

function spawnBoat() {
  const pool = BOAT_TYPES.filter((t) => t.from <= player.stageIndex)
  // Weight toward the biggest hull the fleet can field, but gently — a kraken
  // that only ever meets un-bitable dreadnoughts has nothing to eat.
  let total = 0
  const weights = pool.map((t, i) => {
    const w = Math.pow(i + 1, 1.15)
    total += w
    return w
  })
  let roll = Math.random() * total
  let type = pool[0]
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i]
    if (roll <= 0) { type = pool[i]; break }
  }
  boats.push({
    type,
    x: player.x + rand(-1, 1) * 700,
    dir: Math.random() < 0.5 ? 1 : -1,
    vx: rand(type.speed[0], type.speed[1]),
    hp: type.hp,
    maxHp: type.hp,
    hookDepth: rand(300, 900),
    bob: rand(0, TAU),
    reload: rand(2, 5),
    shake: 0,
    alarm: 0,
    net: type.gear === 'net' ? { depth: rand(220, 520), w: 190, h: 130, torn: 0 } : null,
  })
}
for (let i = 0; i < 3; i++) spawnBoat()

function sinkBoat(bt, i) {
  addBiomass(bt.type.biomass)
  showBanner('DEVOURED THE ' + bt.type.name.toUpperCase())
  cam.shake = 1
  for (let k = 0; k < 5; k++) ripple(bt.x + rand(-60, 60), SURFACE_Y + rand(0, 40), 120, '#cfe9ff')
  // wreckage drifts down and is perfectly edible
  const chunks = 3 + Math.round(bt.type.w / 26)
  for (let k = 0; k < chunks; k++) {
    if (creatures.length >= CREATURE_CAP) break
    const sp = FLOTSAM[Math.floor(Math.random() * FLOTSAM.length)]
    const c = makeCreature(sp, bt.x + rand(-bt.type.w * 0.5, bt.type.w * 0.5), SURFACE_Y + rand(10, 60))
    c.vy = rand(0.6, 1.6)
    c.sink = true
    creatures.push(c)
  }
  for (let k = 0; k < 18; k++) {
    bites.push({ x: bt.x + rand(-bt.type.w * 0.5, bt.type.w * 0.5), y: SURFACE_Y + rand(-20, 30), vx: rand(-4, 4), vy: rand(-5, 1), a: 1, col: '#8a6234', r: rand(2, 5) })
  }
  boats.splice(i, 1)
}

// ---- Particles / FX ----------------------------------------------------
const motes = []       // marine snow below, dust and star-glitter above
for (let i = 0; i < 320; i++) {
  motes.push({ x: rand(-2200, 2200), y: rand(SKY_TOP, WORLD_H), r: rand(0.4, 1.9), s: rand(0.2, 0.8), b: rand(0.15, 0.7) })
}
const bubbles = []     // rising bubbles in the lit water
for (let i = 0; i < 70; i++) {
  bubbles.push({ x: rand(-2200, 2200), y: rand(0, 2400), r: rand(1, 4), s: rand(18, 46) })
}
const ripples = []
function ripple(x, y, r, col) { ripples.push({ x, y, r: 6, max: r, col, a: 1 }) }
const bites = []       // eat puffs / debris specks
function puff(x, y, col) {
  for (let i = 0; i < 9; i++) {
    bites.push({ x, y, vx: rand(-2.4, 2.4), vy: rand(-2.4, 2.4), a: 1, col, r: rand(1.5, 3.5) })
  }
}

// ---- Banners -----------------------------------------------------------
const bannerEl = document.getElementById('banner')
const queuedBanners = []
function showBanner(text) {
  bannerEl.textContent = text
  bannerEl.classList.remove('show')
  void bannerEl.offsetWidth
  bannerEl.classList.add('show')
}
function queueBanner(text, delay) { queuedBanners.push({ text, t: delay }) }
function evolveBanner(name) { showBanner('EVOLVED · ' + name) }

// ---- HUD ---------------------------------------------------------------
const stageNameEl = document.getElementById('stage-name')
const barFill = document.getElementById('bar-fill')
const depthLabel = document.getElementById('depth-label')
const biomassLabel = document.getElementById('biomass-label')
const effectLabel = document.getElementById('effect-label')
const abilityLabel = document.getElementById('ability-label')
function updateHUD() {
  const s = stage()
  const nx = nextStage()
  stageNameEl.textContent = s.name
  if (nx) {
    const span = nx.biomass - s.biomass
    barFill.style.width = (clamp((player.biomass - s.biomass) / span, 0, 1) * 100).toFixed(1) + '%'
  } else {
    barFill.style.width = '100%'
  }
  // below the waterline: depth; above it: altitude
  if (player.y > SURFACE_Y) {
    depthLabel.textContent = zoneAt(player.y).name + ' · ' + Math.round(player.y * METERS) + ' m'
  } else {
    depthLabel.textContent = zoneAt(player.y).name + ' · ↑ ' + Math.round((SURFACE_Y - player.y) * METERS) + ' m'
  }
  biomassLabel.textContent = 'biomass ' + Math.floor(player.biomass)
  const fx = []
  if (player.netted) fx.push('NETTED')
  if (player.hooked) fx.push('HOOKED')
  if (player.stun > 0) fx.push('STUNNED')
  if (player.inked > 0.15) fx.push('INKED')
  if (player.slow > 0) fx.push('SLOWED')
  if (player.veilT > 0) fx.push('VEILED')
  if (player.frenzyT > 0) fx.push('FRENZY')
  effectLabel.textContent = fx.join(' · ')
  effectLabel.style.opacity = fx.length ? '1' : '0'
  if (s.ability) {
    if (player.abilityCd > 0) {
      abilityLabel.textContent = s.ability.name + ' · ' + Math.ceil(player.abilityCd) + 's'
      abilityLabel.classList.remove('ready')
    } else {
      abilityLabel.textContent = s.ability.name + ' · tap'
      abilityLabel.classList.add('ready')
    }
  } else {
    abilityLabel.textContent = 'evolve to earn an ability'
    abilityLabel.classList.remove('ready')
  }
}

// ---- Game state --------------------------------------------------------
let interactive = false   // false = frozen behind the start card
let last = 0
let spawnAcc = 0
let boatAcc = 0

function update(dt) {
  const s = stage()

  // --- steering target: the cursor ---
  const tx = player.x + (mouse.x - window.innerWidth / 2)
  const ty = cam.y + mouse.y

  // --- player movement ---
  // Three regimes: swimming (full control), flying (full control, a little
  // faster), and breaching (ballistic — you steer a little, gravity decides).
  const inWater = player.y > SURFACE_Y
  const canFly = player.stageIndex >= FLY_STAGE
  const ballistic = !inWater && !canFly
  const control = (player.stun > 0 ? 0 : 1) * (ballistic ? 0.25 : 1) * (player.launchT > 0 ? 0.1 : 1)
  const drag = (player.slow > 0 ? 0.5 : 1) * (player.netted ? 0.4 : 1)
  const speed = (3.2 + player.stageIndex * 0.38) * drag
    * (player.frenzyT > 0 ? 1.6 : 1)
    * (!inWater && canFly ? 1.15 : 1)
  let dx = tx - player.x
  let dy = ty - player.y
  const dist = Math.hypot(dx, dy) || 1
  const acc = Math.min(dist, speed * 60) * dt
  player.vx += (dx / dist) * acc * 0.9 * control
  player.vy += (dy / dist) * acc * 0.9 * control
  if (ballistic) {
    // out of the water without wings: an arc, then the sea takes you back
    player.vx *= 0.988
    player.vy *= 0.988
    player.vy += 14 * dt
  } else if (player.launchT > 0) {
    // mid-lunge: keep the momentum, water resistance be damned
    player.vx *= 0.97
    player.vy *= 0.97
  } else {
    player.vx *= 0.86
    player.vy *= 0.86
  }
  if (player.launchT > 0) player.launchT -= dt

  // being reeled in by a hook
  if (player.hooked) {
    const hk = player.hooked
    const a = Math.atan2(SURFACE_Y + 24 - player.y, hk.x - player.x)
    const pull = 42 * dt
    player.vx += Math.cos(a) * pull
    player.vy += Math.sin(a) * pull
    // struggle: moving hard against the pull builds strain to snap the line
    const against = -(Math.cos(a) * player.vx + Math.sin(a) * player.vy)
    const strength = 0.25 + player.stageIndex * 0.34
    player.strain += Math.max(0, against) * 0.006 * strength * dt * 60
    if (player.strain >= 1) {
      player.hooked = null
      player.strain = 0
      showBanner('SNAPPED THE LINE')
      ripple(player.x, player.y, 70, '#8affff')
    } else if (player.y < SURFACE_Y + 60) {
      // reeled to the boat — caught. Lose a chunk of biomass, get thrown back.
      player.hooked = null
      player.strain = 0
      loseBiomass(player.biomass * 0.3 + 40)
      showBanner('CAUGHT! · thrown back')
      player.y = SURFACE_Y + 130
      player.vy = 240
      for (let i = 0; i < 3; i++) ripple(player.x + rand(-40, 40), SURFACE_Y + 20, 60, '#cfe9ff')
    }
  }

  // tangled in a trawl net — heavy, dragged, and slowly winched upward
  if (player.netted) {
    const bt = player.netted
    if (!boats.includes(bt) || (bt.net && bt.net.torn > 0)) {
      player.netted = null
      player.strain = 0
    } else {
      player.vy -= 16 * dt
      const effort = Math.hypot(player.vx, player.vy)
      player.strain += effort * 0.004 * (0.4 + player.stageIndex * 0.3) * dt * 60
      player.slow = Math.max(player.slow, 0.2)
      if (player.strain >= 1) {
        player.netted = null
        player.strain = 0
        bt.net.torn = 9
        showBanner('TORE THROUGH THE NET')
        puff(player.x, player.y, '#dfe9f2')
      }
    }
  }

  player.x += player.vx
  player.y += player.vy
  // The ceiling depends on what you've become: sea creatures stop at the
  // waterline, the Drowned God can leap a few hundred metres clear of it, and
  // the winged forms own the whole column up to the roof of the sky.
  if (canFly) {
    player.y = clamp(player.y, SKY_TOP + 80, floorY() - 14)
  } else if (player.stageIndex >= BREACH_STAGE) {
    player.y = clamp(player.y, SURFACE_Y - 1500, floorY() - 14)
  } else {
    player.y = clamp(player.y, SURFACE_Y + 18, floorY() - 14)
  }
  // splash when crossing the waterline with any real speed
  const airborneNow = player.y <= SURFACE_Y
  if (airborneNow !== player.airborne && Math.abs(player.vy) > 2.5) {
    for (let i = 0; i < 3; i++) ripple(player.x + rand(-30, 30), SURFACE_Y + 8, 70 + player.headW * 2, '#cfe9ff')
    puff(player.x, SURFACE_Y, '#dff2ff')
    if (airborneNow && player.breachHinted === 0 && !canFly) {
      player.breachHinted = 1
      showBanner('THE AIR TASTES OF LIGHTNING · SOMETHING WAITS ABOVE')
    }
    if (airborneNow && canFly && player.breachHinted < 2) {
      player.breachHinted = 2
      showBanner('WINGS HOLD · THE CLIMB BEGINS')
    }
  }
  player.airborne = airborneNow

  // --- spine follows head ---
  const spacing = (4 + s.width * 0.35) * s.space
  player.spine[0].x = player.x
  player.spine[0].y = player.y
  const n = segCount()
  // Fall back to the previous segment's heading when two points land on top of
  // each other — otherwise the chain has no direction to unfold along and the
  // whole body stays collapsed in a knot.
  const heading = Math.atan2(player.vy, player.vx)
  let backX = -Math.cos(heading)
  let backY = -Math.sin(heading)
  for (let i = 1; i < n; i++) {
    const a = player.spine[i - 1]
    const b = player.spine[i]
    let ax = b.x - a.x
    let ay = b.y - a.y
    const d = Math.hypot(ax, ay)
    if (d < 0.01) { ax = backX; ay = backY } else { ax /= d; ay /= d }
    b.x = a.x + ax * spacing
    b.y = a.y + ay * spacing
    backX = ax
    backY = ay
  }
  player.headW = s.width

  // --- camera ---
  cam.y += (player.y - window.innerHeight * 0.5 - cam.y) * Math.min(1, dt * 3)
  cam.y = clamp(cam.y, SKY_TOP, floorY() - window.innerHeight)

  // --- creatures ---
  spawnAcc += dt
  if (spawnAcc > 0.24) { spawnAcc = 0; spawnCreature(true) }

  const eatR = player.headW * s.reach
  for (let i = creatures.length - 1; i >= 0; i--) {
    const c = creatures[i]
    c.wob += dt * 3
    c.cd -= dt
    c.biteCd -= dt
    const dxp = player.x - c.x
    const dyp = player.y - c.y
    const dp = Math.hypot(dxp, dyp) || 1

    // --- allies live by their own rules: they join, ride, and fight ---
    if (c.isAlly) {
      i -= updateAlly(c, i, dp, dxp, dyp, dt)
      continue
    }
    // Anything much smaller than a mouthful isn't worth a predator's time —
    // and nothing hunts what it can't see through a kraken's ink veil.
    const noticed = player.headW > c.r * 0.22 && player.veilT <= 0
    const canEatUs = c.r > player.headW * 1.3
    c.hunting = c.pred && noticed && (canEatUs || c.bold) && dp < c.aggro && c.stunT <= 0 ? 1 : 0

    // --- the player's ability fields acting on this creature ---
    if (player.lureT > 0 && !c.pred && c.r < player.headW && dp < 460 && dp > 10) {
      c.x += (dxp / dp) * 110 * dt
      c.y += (dyp / dp) * 110 * dt
    }
    if (player.gulpT > 0 && c.r < player.headW * 1.05 && dp < player.gulpR && dp > 6) {
      const pull = 340 * (1 - dp / player.gulpR) + 80
      c.x += (dxp / dp) * pull * dt
      c.y += (dyp / dp) * pull * dt
    }
    if (player.gravT > 0 && dp < 640 && dp > 10) {
      c.x += (dxp / dp) * 200 * dt
      c.y += (dyp / dp) * 200 * dt
      if (c.r < player.headW * 1.4) c.stunT = Math.max(c.stunT, 0.4)
    }

    if (c.stunT > 0) {
      c.stunT -= dt
      c.dash = 0
      c.windup = 0
    }

    if (c.hunting) {
      c.dir = dxp > 0 ? 1 : -1
      c.vy += (dyp / dp) * 0.16
    } else if (!c.pred && !c.sink && player.headW > c.r * 1.3 && dp < 240) {
      // prey scatters from something big
      c.dir = dxp > 0 ? -1 : 1
      c.vy -= (dyp / dp) * 0.14
    }

    // --- abilities ---
    switch (c.stunT > 0 ? null : c.ability) {
      case 'ink':
        // octopus / squid: blind the hunter and jet away
        if (dp < 230 && c.cd <= 0 && player.headW > c.r * 0.5) {
          c.cd = rand(4, 7)
          inkCloud(c.x, c.y, c.r * 5.5, c.cloak ? '#2a0a1a' : '#07030a')
          c.dash = 0.55
          c.dashA = Math.atan2(-dyp, -dxp)
          c.dashS = 7 + c.speed * 2
        }
        break
      case 'shock':
        // torpedo ray / magma eel: wind up, then discharge a ring
        if (dp < 280 && c.cd <= 0) { c.cd = rand(3.5, 6); c.windup = 0.75 }
        if (c.windup > 0) {
          c.windup -= dt
          if (c.windup <= 0) shockRing(c.x, c.y, c.r * 7, { dmg: 18 + c.r * 0.5, stun: 0.6, srcR: c.r, col: c.key === 'magmaeel' ? '#ffb060' : '#9fe8ff' })
        }
        break
      case 'spike':
        // pufferfish: inflate when crowded, and become inedible
        c.puffed = clamp(c.puffed + (dp < c.r * 7 ? dt * 3 : -dt * 1.6), 0, 1)
        break
      case 'lure':
        // anglerfish: the light is not a friend — it reels you in
        if (dp < 360 && dp > eatR + c.r && player.headW < c.r * 1.4) {
          player.vx += (-dxp / dp) * 26 * dt
          player.vy += (-dyp / dp) * 26 * dt
        }
        break
      case 'lunge':
        if (dp < c.aggro && c.cd <= 0 && noticed) {
          c.cd = rand(2.2, 4.2)
          c.dash = 0.5
          c.dashA = Math.atan2(dyp, dxp)
          c.dashS = 9 + c.speed * 2.5
          c.dir = dxp > 0 ? 1 : -1
        }
        break
      case 'slime':
        if (dp < 320 && c.cd <= 0) {
          c.cd = rand(2, 4)
          slimes.push({ x: c.x, y: c.y, r: c.r * 2.4, a: 1 })
        }
        break
      case 'sonar':
        // sperm whale: a stunning click, then it comes straight at you
        if (dp < 560 && c.cd <= 0) { c.cd = rand(7, 10); c.windup = 1.1 }
        if (c.windup > 0) {
          c.windup -= dt
          if (c.windup <= 0) {
            shockRing(c.x, c.y, 660, { dmg: 30, stun: 1.1, srcR: c.r, col: '#cfe6ff' })
            c.dash = 1.2
            c.dashA = Math.atan2(dyp, dxp)
            c.dashS = 8
          }
        }
        break
    }

    // --- motion --- (the sessile grip their rock and stay put)
    if (!c.sessile) {
      if (c.dash > 0) {
        c.dash -= dt
        c.x += Math.cos(c.dashA) * c.dashS * dt * 60
        c.y += Math.sin(c.dashA) * c.dashS * dt * 60
      } else {
        const sp = c.speed * (c.hunting ? 1.9 : 1) * (0.6 + Math.sin(c.wob) * 0.2) * (c.stunT > 0 ? 0.12 : 1)
        c.x += c.dir * sp * dt * 60
        c.vy = c.vy * 0.94 + Math.sin(c.wob * 0.7) * 0.06
        c.y += c.vy * dt * 60
      }
      if (c.sink) c.y += 32 * dt
      c.y = clamp(c.y, c.minY, Math.min(floorY() - 18, c.maxY))
    }

    // recycle anything that wanders far off-screen
    if (Math.abs(c.x - player.x) > window.innerWidth * 1.5 || Math.abs(c.y - player.y) > window.innerHeight * 1.6) {
      creatures.splice(i, 1)
      continue
    }

    // --- contact ---
    const d = Math.hypot(c.x - player.x, c.y - player.y)
    if (d < eatR + c.r) {
      // even a puffer's spines stop mattering to a big enough mouth
      const spiky = c.ability === 'spike' && c.puffed > 0.35 && player.headW < c.r * 2.2
      if (c.r < player.headW * 1.05 && !spiky) {
        addBiomass(foodValue(c))
        puff(c.x, c.y, c.col)
        player.flash = 1
        player.maw = 1
        // stingers are worth eating, but they get one last shot in
        if (c.ability === 'sting' && player.headW < c.r * 2.6 && player.guard <= 0) loseBiomass(8 + c.r * 0.4)
        creatures.splice(i, 1)
        continue
      }
      // every hunter has a stage that simply outgrows its teeth: too big to
      // swallow yet (up to 1.3× your width) means too small to hurt you
      const dangerous = (c.pred || spiky || c.ability === 'sting') && c.stunT <= 0 && c.r > player.headW * 1.3
      if (dangerous && player.hurt <= 0 && player.guard <= 0 && c.biteCd <= 0) {
        c.biteCd = 0.9
        loseBiomass(spiky ? 12 + c.r * 0.4 : c.ability === 'sting' ? 9 + c.r * 0.3 : 14 + c.r * 0.55)
        puff(player.x, player.y, '#ff5a5a')
        const kick = spiky ? 0.5 : 0.35
        player.vx += (player.x - c.x) * kick
        player.vy += (player.y - c.y) * kick
        cam.shake = Math.max(cam.shake, 0.3)
      }
    }
  }

  // --- boats + their gear ---
  boatAcc += dt
  const maxBoats = 3 + Math.floor(player.stageIndex / 3)
  // no fleet on the lake, and nobody fishes the pack ice
  if (boatAcc > 6 && boats.length < maxBoats && realm === 'ocean' && arcticness(player.x) < 0.5) { boatAcc = 0; spawnBoat() }
  player.biteCd -= dt
  player.clangCd -= dt

  for (let i = boats.length - 1; i >= 0; i--) {
    const bt = boats[i]
    const T = bt.type
    const dxb = player.x - bt.x
    // a kraken in the shallows sends the whole fleet running
    const scary = player.stageIndex >= KRAKEN_STAGE && player.y < 620 && Math.abs(dxb) < 640
    bt.alarm = clamp(bt.alarm + (scary ? dt * 2 : -dt), 0, 1)
    if (scary && Math.abs(dxb) < 420) bt.dir = dxb > 0 ? -1 : 1
    bt.x += bt.dir * bt.vx * (1 + bt.alarm * 1.8) * dt * 60
    bt.bob += dt
    bt.shake = Math.max(0, bt.shake - dt * 3)
    if (bt.net) bt.net.torn = Math.max(0, bt.net.torn - dt)

    // baited hook line — the small boats' whole trade
    if (T.gear === 'hook' || T.gear === 'net') {
      bt.hookDepth += clamp(clamp(player.y - SURFACE_Y, 90, 1250) - bt.hookDepth, -60, 60) * dt * 0.5
      bt._hookX = bt.x + Math.sin(bt.bob) * 24
      bt._hookY = SURFACE_Y + 30 + bt.hookDepth
      if (!player.hooked && !player.netted && player.stageIndex < KRAKEN_STAGE) {
        const hd = Math.hypot(bt._hookX - player.x, bt._hookY - player.y)
        if (hd < player.headW + 18) {
          player.hooked = bt
          player.strain = 0
          showBanner('HOOKED! · thrash to break free')
        }
      }
    }

    // trawl net dragged behind the boat
    if (bt.net && bt.net.torn <= 0) {
      const nx = bt.x - bt.dir * (T.w * 0.55 + bt.net.w * 0.5)
      const ny = SURFACE_Y + bt.net.depth
      bt._netX = nx
      bt._netY = ny
      bt.net.depth += clamp(clamp(player.y - SURFACE_Y, 120, 900) - bt.net.depth, -50, 50) * dt * 0.4
      if (!player.netted && !player.hooked &&
          Math.abs(player.x - nx) < bt.net.w * 0.5 &&
          Math.abs(player.y - ny) < bt.net.h * 0.5) {
        if (player.stageIndex >= KRAKEN_STAGE) {
          bt.net.torn = 9
          showBanner('SHREDDED THE NET')
          puff(nx, ny, '#dfe9f2')
        } else {
          player.netted = bt
          player.strain = 0
          showBanner('NETTED! · thrash to tear free')
        }
      }
    }

    // harpoon cannons — whalers and dreadnoughts shoot at anything big
    if ((T.gear === 'harpoon' || T.gear === 'charges') && player.stageIndex >= 3 && player.y < 900) {
      bt.reload -= dt
      if (bt.reload <= 0) {
        bt.reload = T.gear === 'harpoon' ? rand(2.4, 4) : rand(3.5, 5.5)
        const volley = T.gear === 'harpoon' ? 2 : 1
        for (let k = 0; k < volley; k++) {
          const a = Math.atan2(player.y - (SURFACE_Y + 16), player.x - bt.x) + rand(-0.08, 0.08)
          harpoons.push({ x: bt.x, y: SURFACE_Y + 16, vx: Math.cos(a) * 8, vy: Math.sin(a) * 8, life: 3.4, a })
        }
      }
    }

    // depth charges — the dreadnought's answer to a monster it can't hook
    if (T.gear === 'charges' && player.y < 1900) {
      bt.chargeCd = (bt.chargeCd || rand(1, 3)) - dt
      if (bt.chargeCd <= 0) {
        bt.chargeCd = rand(2.6, 4.4)
        charges.push({ x: bt.x + rand(-T.w * 0.3, T.w * 0.3), y: SURFACE_Y + 20, vy: 62, fuse: 4.5 })
      }
    }

    // --- the kraken's turn: take the hull apart ---
    if (player.stageIndex >= KRAKEN_STAGE) {
      const hullHalf = T.w * 0.5 + player.headW * 0.9
      if (Math.abs(dxb) < hullHalf && player.y < SURFACE_Y + 130 + player.headW && player.biteCd <= 0) {
        player.biteCd = 0.42
        if (player.stageIndex >= T.tough) {
          bt.hp -= 1 + (player.stageIndex - T.tough) * 1.5
          bt.shake = 1
          player.flash = 1
          player.maw = 1
          puff(bt.x + rand(-20, 20), SURFACE_Y + 6, '#8a6234')
          ripple(bt.x, SURFACE_Y + 10, 80, '#cfe9ff')
          cam.shake = Math.max(cam.shake, 0.25)
          if (bt.hp <= 0) { sinkBoat(bt, i); continue }
        } else if (player.clangCd <= 0) {
          player.clangCd = 5
          showBanner("THE " + T.name.toUpperCase() + "'S HULL HOLDS · GROW")
          puff(bt.x, SURFACE_Y + 6, '#9fb4c4')
        }
      }
    }

    // recycle boats that drift far away
    if (Math.abs(bt.x - player.x) > window.innerWidth * 1.6) { boats.splice(i, 1); continue }
  }

  // harpoons
  for (let i = harpoons.length - 1; i >= 0; i--) {
    const h = harpoons[i]
    h.x += h.vx * dt * 60
    h.y += h.vy * dt * 60
    h.life -= dt
    if (Math.hypot(h.x - player.x, h.y - player.y) < player.headW + 8) {
      if (player.headW > 55) {
        // steel snaps on a hide this old
        puff(h.x, h.y, '#cdd8e2')
        harpoons.splice(i, 1)
        continue
      }
      if (player.hurt <= 0 && player.guard <= 0) {
        loseBiomass(50 + player.stageIndex * 8)
        showBanner('HARPOONED!')
        puff(player.x, player.y, '#ff5a5a')
        cam.shake = Math.max(cam.shake, 0.35)
        harpoons.splice(i, 1)
        continue
      }
    }
    if (h.life <= 0 || h.y > WORLD_H) harpoons.splice(i, 1)
  }

  // depth charges
  for (let i = charges.length - 1; i >= 0; i--) {
    const ch = charges[i]
    ch.y += ch.vy * dt
    ch.fuse -= dt
    const near = Math.hypot(ch.x - player.x, ch.y - player.y) < 80 + player.headW
    if (ch.fuse <= 0 || near || ch.y > WORLD_H - 20) {
      shockRing(ch.x, ch.y, 260, { dmg: 60, stun: 0.5, srcR: 45, col: '#ffd6a0' })
      puff(ch.x, ch.y, '#ffd6a0')
      ripple(ch.x, ch.y, 200, '#ffd6a0')
      cam.shake = Math.max(cam.shake, 0.6)
      charges.splice(i, 1)
    }
  }

  // --- the moon ---
  if (!MOON.eaten) {
    // it looms: once you're in the high dark it drifts to hang over you
    if (player.y < -7000) {
      MOON.x += (player.x - MOON.x) * Math.min(1, dt * 0.3)
      MOON.awake = true
    }
    const mr = moonRadius()
    const dm = Math.hypot(MOON.x - player.x, MOON.y - player.y)
    if (MOON.awake && player.y < -8600 && dm < 1600) {
      // lunar lances, in volleys of three
      MOON.lanceCd -= dt
      if (MOON.lanceCd <= 0) {
        MOON.lanceCd = rand(2.6, 4.2)
        for (let k = -1; k <= 1; k++) {
          const a = Math.atan2(player.y - MOON.y, player.x - MOON.x) + k * 0.16
          moonlances.push({ x: MOON.x + Math.cos(a) * mr, y: MOON.y + Math.sin(a) * mr, vx: Math.cos(a) * 5.4, vy: Math.sin(a) * 5.4, life: 4 })
        }
      }
      // and shard guardians, called off the crust
      MOON.shardCd -= dt
      if (MOON.shardCd <= 0 && creatures.length < CREATURE_CAP - 2) {
        MOON.shardCd = rand(6, 9)
        const shardSp = SPECIES.find((s) => s.key === 'lunarshard')
        for (let k = 0; k < 2; k++) {
          creatures.push(makeCreature(shardSp, MOON.x + rand(-mr, mr), MOON.y + rand(-mr, mr) * 0.6))
        }
      }
    }
    // eating it: press your maw to the crust and bite
    MOON.clangCd -= dt
    if (dm < mr + player.headW * stage().reach && player.biteCd <= 0) {
      player.biteCd = 0.5
      if (player.stageIndex >= MOONEATER_STAGE) {
        biteMoon()
      } else if (MOON.clangCd <= 0) {
        MOON.clangCd = 5
        showBanner("THE MOON'S CRUST HOLDS · GROW")
      }
    }
  }
  for (let i = moonlances.length - 1; i >= 0; i--) {
    const l = moonlances[i]
    l.x += l.vx * dt * 60
    l.y += l.vy * dt * 60
    l.life -= dt
    if (Math.hypot(l.x - player.x, l.y - player.y) < player.headW + 14 && player.hurt <= 0 && player.guard <= 0) {
      loseBiomass(70)
      showBanner('LANCED BY MOONLIGHT!')
      puff(player.x, player.y, '#fff2c8')
      cam.shake = Math.max(cam.shake, 0.4)
      moonlances.splice(i, 1)
      continue
    }
    if (l.life <= 0) moonlances.splice(i, 1)
  }

  // --- the core ---
  if (worldFloorOpen && !CORE.eaten) {
    if (player.y > 12200) {
      CORE.x += (player.x - CORE.x) * Math.min(1, dt * 0.3)
      CORE.awake = true
    }
    const cr = coreRadius()
    const dc = Math.hypot(CORE.x - player.x, CORE.y - player.y)
    if (CORE.awake && player.y > 12800 && dc < 1600) {
      // pulses of heat off the mantle
      CORE.burstCd -= dt
      if (CORE.burstCd <= 0) {
        CORE.burstCd = rand(2.8, 4.4)
        const a = Math.atan2(player.y - CORE.y, player.x - CORE.x)
        const bx = CORE.x + Math.cos(a) * cr
        const by = CORE.y + Math.sin(a) * cr
        shockRing(bx, by, 420, { dmg: 55, stun: 0.8, col: '#ffb347' })
        puff(bx, by, '#ffb347')
      }
      // and guardians shaken loose from the mantle
      CORE.guardCd -= dt
      if (CORE.guardCd <= 0 && creatures.length < CREATURE_CAP - 2) {
        CORE.guardCd = rand(6, 9)
        const guardSp = SPECIES.find((sp) => sp.key === 'coreguardian')
        for (let k = 0; k < 2; k++) {
          creatures.push(makeCreature(guardSp, CORE.x + rand(-cr, cr), CORE.y - rand(cr * 0.4, cr)))
        }
      }
    }
    CORE.clangCd -= dt
    if (dc < cr + player.headW * stage().reach && player.biteCd <= 0) {
      player.biteCd = 0.5
      if (player.stageIndex >= WORLDEATER_STAGE) {
        biteCore()
      } else if (CORE.clangCd <= 0) {
        CORE.clangCd = 5
        showBanner('THE CORE BURNS TOO HOT · GROW')
      }
    }
  }

  // --- hazards ---
  for (let i = inkClouds.length - 1; i >= 0; i--) {
    const k = inkClouds[i]
    k.r += (k.max - k.r) * dt * 1.6
    k.life -= dt
    k.a = clamp(k.life / 2.2, 0, 1)
    if (Math.hypot(k.x - player.x, k.y - player.y) < k.r * 0.9) {
      player.inked = Math.min(1, player.inked + dt * 2.2)
      player.slow = Math.max(player.slow, 0.35)
    }
    if (k.life <= 0) inkClouds.splice(i, 1)
  }
  for (let i = shocks.length - 1; i >= 0; i--) {
    const sh = shocks[i]
    sh.r += (sh.max - sh.r) * dt * 3.2
    sh.a -= dt * 0.85
    // a discharge you've outgrown tickles: skip it entirely
    const outgrown = sh.srcR > 0 && player.headW > sh.srcR * 1.3
    if (!sh.hit && !sh.foe && !outgrown && Math.hypot(sh.x - player.x, sh.y - player.y) < sh.r + player.headW) {
      sh.hit = true
      if (player.hurt <= 0 && player.guard <= 0) {
        player.stun = Math.max(player.stun, sh.stun)
        loseBiomass(sh.dmg)
        puff(player.x, player.y, sh.col)
        cam.shake = Math.max(cam.shake, 0.4)
      }
    }
    if (sh.a <= 0) shocks.splice(i, 1)
  }
  for (let i = slimes.length - 1; i >= 0; i--) {
    const sl = slimes[i]
    sl.a -= dt * 0.25
    if (Math.hypot(sl.x - player.x, sl.y - player.y) < sl.r) player.slow = Math.max(player.slow, 0.4)
    if (sl.a <= 0) slimes.splice(i, 1)
  }

  // --- timers + fx ---
  if (player.flash > 0) player.flash -= dt * 3
  if (player.hurt > 0) player.hurt -= dt * 1.5
  if (player.slow > 0) player.slow -= dt
  if (player.stun > 0) player.stun -= dt
  if (player.inked > 0) player.inked -= dt * 0.45
  if (player.maw > 0) player.maw -= dt * 2.2
  if (player.abilityCd > 0) player.abilityCd -= dt
  if (player.guard > 0) player.guard -= dt
  if (player.lureT > 0) player.lureT -= dt
  if (player.gulpT > 0) player.gulpT -= dt
  if (player.frenzyT > 0) player.frenzyT -= dt
  if (player.veilT > 0) player.veilT -= dt
  if (player.gravT > 0) player.gravT -= dt
  if (cam.shake > 0) cam.shake -= dt * 1.6

  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i]
    r.r += (r.max - r.r) * dt * 3
    r.a -= dt * 0.9
    if (r.a <= 0) ripples.splice(i, 1)
  }
  for (let i = bites.length - 1; i >= 0; i--) {
    const b = bites[i]
    b.x += b.vx; b.y += b.vy; b.vx *= 0.92; b.vy *= 0.92; b.a -= dt * 1.6
    if (b.a <= 0) bites.splice(i, 1)
  }
  for (const m of motes) {
    m.y += m.s * dt * 30
    if (m.y > WORLD_H) m.y = SKY_TOP
  }
  for (const b of bubbles) {
    b.y -= b.s * dt
    if (b.y < SURFACE_Y) { b.y = 2400; b.x = player.x + rand(-1400, 1400) }
  }
  for (let i = queuedBanners.length - 1; i >= 0; i--) {
    queuedBanners[i].t -= dt
    if (queuedBanners[i].t <= 0) { showBanner(queuedBanners[i].text); queuedBanners.splice(i, 1) }
  }

  // crossing into the ice for the first time deserves an announcement
  if (!player.arcticGreeted && arcticness(player.x) > 0.6 && player.y > SURFACE_Y - 200 && player.y < 2600) {
    player.arcticGreeted = true
    showBanner('THE FROZEN REACHES')
  }

  updateHUD()
}

// ---- Rendering ---------------------------------------------------------
// world -> screen (CSS px; the canvas transform applies devicePixelRatio)
function sx(x) { return x - player.x + window.innerWidth / 2 }
function sy(y) { return y - cam.y }
// horizontal projection for parallax scenery
function px(x, p) { return x - player.x * p + window.innerWidth / 2 }

function draw() {
  const dpr = devicePixelRatio
  const vw = window.innerWidth
  const vh = window.innerHeight
  const shk = Math.max(0, cam.shake)
  ctx.setTransform(dpr, 0, 0, dpr, rand(-1, 1) * shk * 10 * dpr, rand(-1, 1) * shk * 10 * dpr)

  // --- background gradient: sky above the waterline, water below ---
  const wy0 = sy(SURFACE_Y)
  if (wy0 > -20) {
    // some sky is visible
    const sTop = skyColor(cam.y)
    const sBot = skyColor(Math.min(SURFACE_Y, cam.y + vh))
    const sg = ctx.createLinearGradient(0, 0, 0, Math.max(1, Math.min(vh, wy0)))
    sg.addColorStop(0, `rgb(${sTop[0]},${sTop[1]},${sTop[2]})`)
    sg.addColorStop(1, `rgb(${sBot[0]},${sBot[1]},${sBot[2]})`)
    ctx.fillStyle = sg
    ctx.fillRect(-20, -20, vw + 40, Math.min(vh, wy0) + 40)
  }
  if (wy0 < vh + 20) {
    // some water is visible
    const from = Math.max(0, wy0)
    const g = ctx.createLinearGradient(0, from, 0, vh)
    const topY = Math.max(SURFACE_Y, cam.y + from)
    const botY = cam.y + vh
    const top = tintWater(waterColor(topY), topY)
    const bot = tintWater(waterColor(botY), botY)
    g.addColorStop(0, `rgb(${top[0]},${top[1]},${top[2]})`)
    g.addColorStop(1, `rgb(${bot[0]},${bot[1]},${bot[2]})`)
    ctx.fillStyle = g
    ctx.fillRect(-20, from - (wy0 < 0 ? 20 : 0), vw + 40, vh - from + 40)
  }

  // --- stars: fade in above the storm layer, blaze in the void ---
  const starA = clamp((-1600 - cam.y) / 2600, 0, 1)
  if (starA > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < 150; i++) {
      const h1 = hash1(i * 3.7), h2 = hash1(i * 9.1 + 4), h3 = hash1(i * 5.3 + 9)
      const par = 0.04 + h3 * 0.08
      const sx_ = ((h1 * (vw + 80) - player.x * par - tilt.x * (26 + h3 * 30)) % (vw + 80) + vw + 80) % (vw + 80) - 40
      const sy_ = ((h2 * (vh + 80) - cam.y * par - tilt.y * (18 + h3 * 22)) % (vh + 80) + vh + 80) % (vh + 80) - 40
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(now() * 0.001 * (0.5 + h3) + i))
      ctx.fillStyle = `rgba(${220 + Math.round(h3 * 35)},${225 + Math.round(h1 * 30)},255,${starA * tw * (0.35 + h3 * 0.5)})`
      ctx.beginPath(); ctx.arc(sx_, sy_, 0.6 + h3 * 1.6, 0, TAU); ctx.fill()
    }
    ctx.restore()
  }

  // --- the sun, low in the sky bands ---
  if (cam.y < SURFACE_Y + 200 && cam.y > -4200) {
    const sunX = vw * 0.76 - tilt.x * 60
    const sunY = vh * 0.14 - tilt.y * 40 - clamp((cam.y + 400) / 6, -80, 200)
    const fade = clamp(1 - (-cam.y - 1800) / 2400, 0, 1)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const sg2 = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 180)
    sg2.addColorStop(0, `rgba(255,244,214,${0.85 * fade})`)
    sg2.addColorStop(0.25, `rgba(255,230,170,${0.35 * fade})`)
    sg2.addColorStop(1, 'rgba(255,220,150,0)')
    ctx.fillStyle = sg2
    ctx.beginPath(); ctx.arc(sunX, sunY, 180, 0, TAU); ctx.fill()
    ctx.restore()
  }

  // --- the moon, seen from far below: a promise on the horizon ---
  if (!MOON.eaten && cam.y < -1400 && sy(MOON.y) < -MOON.r * 2) {
    const prog = clamp((-cam.y - 1400) / 7400, 0, 1)
    const mr = 12 + prog * 54
    const mx = vw * 0.68 - tilt.x * 44
    const my = vh * (0.16 - prog * 0.04) - tilt.y * 30
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 2.4)
    mg.addColorStop(0, `rgba(240,238,220,${0.5 + prog * 0.3})`)
    mg.addColorStop(0.5, 'rgba(220,220,205,0.12)')
    mg.addColorStop(1, 'rgba(220,220,205,0)')
    ctx.fillStyle = mg
    ctx.beginPath(); ctx.arc(mx, my, mr * 2.4, 0, TAU); ctx.fill()
    ctx.restore()
    ctx.fillStyle = `rgba(235,232,215,${0.8 + prog * 0.2})`
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill()
    ctx.fillStyle = 'rgba(180,178,168,0.5)'
    for (let i = 0; i < 5; i++) {
      const h1 = hash1(i * 7.7), h2 = hash1(i * 3.1 + 2)
      ctx.beginPath(); ctx.arc(mx + (h1 - 0.5) * mr * 1.3, my + (h2 - 0.5) * mr * 1.3, mr * (0.08 + h1 * 0.14), 0, TAU); ctx.fill()
    }
  }

  // sunlight god-rays near the surface
  if (cam.y < 1100 && cam.y > -vh) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < 6; i++) {
      const rx = ((i * 220 + 80 - player.x * 0.15) % (vw + 400) + vw + 400) % (vw + 400) - 200
      const rg = ctx.createLinearGradient(rx, sy(SURFACE_Y), rx + 60, sy(1200))
      rg.addColorStop(0, 'rgba(120,220,255,0.11)')
      rg.addColorStop(1, 'rgba(120,220,255,0)')
      ctx.fillStyle = rg
      ctx.beginPath()
      ctx.moveTo(rx, sy(SURFACE_Y))
      ctx.lineTo(rx + 40, sy(SURFACE_Y))
      ctx.lineTo(rx + 140, sy(1400))
      ctx.lineTo(rx - 50, sy(1400))
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  }

  drawScenery(vw, vh)

  // waterline
  const wy = sy(SURFACE_Y)
  if (wy > -280 && wy < vh + 40) {
    ctx.strokeStyle = 'rgba(180,240,255,0.35)'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x <= vw; x += 12) {
      ctx.lineTo(x, wy + Math.sin(x * 0.05 + now() * 0.002) * 3)
    }
    ctx.stroke()
  }

  // --- marine snow + bubbles ---
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (const m of motes) {
    const mx = sx(m.x + player.x * 0.6)
    const my = sy(m.y)
    if (my < -10 || my > vh + 10 || mx < -10 || mx > vw + 10) continue
    ctx.fillStyle = `rgba(150,220,255,${m.b})`
    ctx.beginPath(); ctx.arc(mx, my, m.r, 0, TAU); ctx.fill()
  }
  ctx.restore()
  if (cam.y < 2600) {
    ctx.strokeStyle = 'rgba(200,240,255,0.3)'
    ctx.lineWidth = 1
    for (const b of bubbles) {
      const bx = sx(b.x), by = sy(b.y)
      if (by < -10 || by > vh + 10 || bx < -10 || bx > vw + 10) continue
      ctx.beginPath(); ctx.arc(bx + Math.sin(b.y * 0.03) * 4, by, b.r, 0, TAU); ctx.stroke()
    }
  }

  // --- slime globs ---
  for (const sl of slimes) {
    ctx.fillStyle = `rgba(190,220,180,${sl.a * 0.16})`
    ctx.beginPath(); ctx.arc(sx(sl.x), sy(sl.y), sl.r, 0, TAU); ctx.fill()
  }

  // --- the moon itself, and the heart of the world ---
  drawMoon(vw, vh)
  drawCore(vw, vh)

  // --- creatures ---
  for (const c of creatures) drawCreature(c)

  // --- boats, gear, projectiles ---
  for (const bt of boats) drawBoat(bt)
  for (const h of harpoons) {
    const hx = sx(h.x), hy = sy(h.y)
    ctx.save()
    ctx.translate(hx, hy)
    ctx.rotate(h.a)
    ctx.strokeStyle = '#d7e4ee'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(8, 0); ctx.stroke()
    ctx.fillStyle = '#f2f7fb'
    ctx.beginPath(); ctx.moveTo(9, 0); ctx.lineTo(1, -4.5); ctx.lineTo(1, 4.5); ctx.closePath(); ctx.fill()
    ctx.restore()
  }
  for (const ch of charges) {
    const cx = sx(ch.x), cy = sy(ch.y)
    ctx.fillStyle = '#3d4650'
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - 7, cy - 10, 14, 20, 4) : ctx.rect(cx - 7, cy - 10, 14, 20); ctx.fill()
    ctx.fillStyle = ch.fuse % 0.5 < 0.25 ? '#ff5a3c' : '#5a2418'
    ctx.beginPath(); ctx.arc(cx, cy - 12, 3, 0, TAU); ctx.fill()
  }
  for (const l of moonlances) {
    const lx = sx(l.x), ly = sy(l.y)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 26)
    lg.addColorStop(0, 'rgba(255,246,214,0.95)')
    lg.addColorStop(0.4, 'rgba(240,232,190,0.4)')
    lg.addColorStop(1, 'rgba(240,232,190,0)')
    ctx.fillStyle = lg
    ctx.beginPath(); ctx.arc(lx, ly, 26, 0, TAU); ctx.fill()
    ctx.strokeStyle = 'rgba(255,250,230,0.9)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(lx - l.vx * 5, ly - l.vy * 5)
    ctx.lineTo(lx, ly)
    ctx.stroke()
    ctx.restore()
  }

  // --- the monster ---
  drawPlayer()

  // --- shock rings, ripples, puffs ---
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (const sh of shocks) {
    ctx.strokeStyle = hexA(sh.col, Math.max(0, sh.a) * 0.8)
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.arc(sx(sh.x), sy(sh.y), sh.r, 0, TAU); ctx.stroke()
    ctx.strokeStyle = hexA(sh.col, Math.max(0, sh.a) * 0.35)
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.arc(sx(sh.x), sy(sh.y), sh.r * 0.82, 0, TAU); ctx.stroke()
  }
  for (const r of ripples) {
    ctx.strokeStyle = hexA(r.col, Math.max(0, r.a) * 0.6)
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(sx(r.x), sy(r.y), r.r, 0, TAU); ctx.stroke()
  }
  for (const b of bites) {
    ctx.fillStyle = hexA(b.col, Math.max(0, b.a))
    ctx.beginPath(); ctx.arc(sx(b.x), sy(b.y), b.r, 0, TAU); ctx.fill()
  }
  ctx.restore()

  // --- ink clouds sit on top of everything they swallow ---
  for (const k of inkClouds) {
    const kx = sx(k.x), ky = sy(k.y)
    for (const b of k.blobs) {
      const r = k.r * b.s
      const gg = ctx.createRadialGradient(kx + b.dx * k.r * 0.4, ky + b.dy * k.r * 0.4, 0, kx + b.dx * k.r * 0.4, ky + b.dy * k.r * 0.4, r)
      gg.addColorStop(0, hexA(k.col, 0.92 * k.a))
      gg.addColorStop(0.6, hexA(k.col, 0.6 * k.a))
      gg.addColorStop(1, hexA(k.col, 0))
      ctx.fillStyle = gg
      ctx.beginPath(); ctx.arc(kx + b.dx * k.r * 0.4, ky + b.dy * k.r * 0.4, r, 0, TAU); ctx.fill()
    }
  }

  // --- blinded by ink ---
  if (player.inked > 0.02) {
    const hx = sx(player.x), hy = sy(player.y)
    const ig = ctx.createRadialGradient(hx, hy, 10, hx, hy, Math.max(vw, vh) * 0.6)
    ig.addColorStop(0, `rgba(3,2,6,${player.inked * 0.3})`)
    ig.addColorStop(1, `rgba(3,2,6,${player.inked * 0.92})`)
    ctx.fillStyle = ig
    ctx.fillRect(-20, -20, vw + 40, vh + 40)
  }

  // vignette for the abyssal mood
  const vg = ctx.createRadialGradient(vw / 2, vh / 2, vh * 0.35, vw / 2, vh / 2, vh * 0.85)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,5,0.58)')
  ctx.fillStyle = vg
  ctx.fillRect(-20, -20, vw + 40, vh + 40)
}

// ---- Scenery -----------------------------------------------------------
// Every band of the column gets its own furniture, placed by a hash of the
// column index so it stays put in an endless horizontal world.
function drawScenery(vw, vh) {
  const camTop = cam.y
  const camBot = cam.y + vh

  // ---- air furniture, band by band ----
  if (camTop < SURFACE_Y) {
    if (camTop < 300 && camBot > -2600) drawClouds(vw, vh, -650, 260, 0.30, 1.0)     // fair-weather puffs
    if (camTop < -600 && camBot > -2600) drawStormClouds(vw, vh)                     // the storm layer
    if (camTop < -2100 && camBot > -3900) drawContrails(vw, vh)                      // jet stream
    if (camTop < -3500 && camBot > -5400) drawAurora(vw, vh)                         // stratosphere curtains
    if (camTop < -6300) drawNebulae(vw, vh)                                          // void colour
  }

  // shallow water: drifting weed mats
  if (camTop < 1400 && camBot > 0) {
    const gap = 380
    const par = 0.72
    const k0 = Math.floor((player.x * par - vw) / gap)
    const k1 = Math.ceil((player.x * par + vw) / gap)
    for (let k = k0; k <= k1; k++) {
      const h = hash1(k * 1.9)
      if (h > 0.55) continue
      const wy = 120 + hash1(k * 4.3) * 900
      const y = sy(wy)
      if (y < -60 || y > vh + 60) continue
      const x = px(k * gap + hash1(k * 7.1) * gap * 0.5, par)
      ctx.strokeStyle = 'rgba(30,90,80,0.5)'
      ctx.lineWidth = 3
      for (let b = 0; b < 4; b++) {
        const bx = x + b * 14 - 21
        ctx.beginPath()
        ctx.moveTo(bx, y)
        ctx.quadraticCurveTo(bx + Math.sin(now() * 0.001 + b + k) * 16, y - 34, bx + Math.sin(now() * 0.0013 + b) * 22, y - 70)
        ctx.stroke()
      }
    }
  }

  // abyss + trench: jagged rock, and the odd whale fall
  if (camBot > 2900 && camTop < 6200) {
    drawCrags(3000, 4500, 520, 0.34, 'rgba(4,8,16,0.85)')
    drawCrags(4400, 6100, 420, 0.5, 'rgba(3,5,11,0.9)')
    drawWhaleFalls(vw, vh)
  }

  // vent fields + the cradle: chimneys and egg beds on the floor
  if (camBot > 5600 && camTop < WORLD_H + 200) {
    drawVents(vw, vh)
    drawEggBeds(vw, vh)
  }

  // ice at the edges of the map
  if (camTop < 2600 && camBot > -600) drawArcticIce(vw, vh)

  // lily pads and reeds on the lake
  if (realm === 'freshwater' && camTop < 900 && camBot > 0) drawLilyPads(vw, vh)

  // ---- beneath the floor ----
  if (camBot > WORLD_H - 200) {
    if (camBot > WORLD_H && camTop < 10200) drawCrags(7800, 9800, 460, 0.4, 'rgba(10,7,6,0.9)')
    if (camBot > 9900 && camTop < 11400) drawCrystals(vw, vh)
    if (camBot > 11000) drawMagmaGlow(vw, vh)
  }

  // seafloor — solid until the moon dies, then split by a burning rift
  const fy = sy(WORLD_H)
  if (fy > -80 && fy < vh + 60) {
    if (!worldFloorOpen) {
      ctx.fillStyle = '#080409'
      ctx.fillRect(-20, fy - 6, vw + 40, vh + 40)
      ctx.fillStyle = 'rgba(60,20,24,0.5)'
      for (let i = -1; i < vw / 40 + 1; i++) {
        ctx.beginPath()
        ctx.ellipse(i * 40 + ((player.x * 0.3) % 40), fy, 28, 11, 0, 0, TAU)
        ctx.fill()
      }
      ctx.strokeStyle = 'rgba(255,90,50,0.16)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(-20, fy - 4); ctx.lineTo(vw + 20, fy - 4); ctx.stroke()
    } else {
      // shattered: slabs of old floor with gaps of glowing depth between
      const gap = 260
      const k0 = Math.floor((player.x - vw) / gap)
      const k1 = Math.ceil((player.x + vw) / gap)
      for (let k = k0; k <= k1; k++) {
        const h = hash1(k * 3.7)
        if (h < 0.3) continue // a hole — swim through
        const x = px(k * gap, 1)
        const w = gap * (0.55 + h * 0.4)
        ctx.fillStyle = '#080409'
        ctx.beginPath()
        ctx.moveTo(x - w / 2, fy - 4 + h * 6)
        ctx.lineTo(x + w / 2, fy - 8 + h * 10)
        ctx.lineTo(x + w / 2 - 14, fy + 26)
        ctx.lineTo(x - w / 2 + 10, fy + 30)
        ctx.closePath()
        ctx.fill()
      }
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const rg = ctx.createLinearGradient(0, fy + 26, 0, fy - 90)
      rg.addColorStop(0, 'rgba(255,120,40,0.22)')
      rg.addColorStop(1, 'rgba(255,120,40,0)')
      ctx.fillStyle = rg
      ctx.fillRect(-20, fy - 90, vw + 40, 116)
      ctx.restore()
    }
  }

  // the very bottom: the mantle floor around the core
  const by2 = sy(WORLD_BOTTOM)
  if (by2 < vh + 60) {
    ctx.fillStyle = '#1a0803'
    ctx.fillRect(-20, by2 - 6, vw + 40, vh + 40)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const cg = ctx.createLinearGradient(0, by2, 0, by2 - 220)
    cg.addColorStop(0, 'rgba(255,150,60,0.35)')
    cg.addColorStop(1, 'rgba(255,120,40,0)')
    ctx.fillStyle = cg
    ctx.fillRect(-20, by2 - 220, vw + 40, 226)
    ctx.restore()
  }
}

// crystal hollows: luminous shard clusters growing out of the dark
function drawCrystals(vw, vh) {
  const gap = 340
  const par = 0.85
  const k0 = Math.floor((player.x * par - vw) / gap)
  const k1 = Math.ceil((player.x * par + vw) / gap)
  const t = now() * 0.001
  for (let k = k0; k <= k1; k++) {
    const h = hash1(k * 5.3)
    if (h < 0.35) continue
    const cy = sy(10100 + hash1(k * 2.9) * 1000)
    if (cy < -160 || cy > vh + 160) continue
    const x = px(k * gap + hash1(k * 7.1) * 140, par)
    const pulse = 0.5 + 0.5 * Math.sin(t * (0.8 + h) + k)
    const hue = h > 0.7 ? '168,232,216' : h > 0.5 ? '216,168,255' : '138,200,226'
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(x, cy, 0, x, cy, 90)
    g.addColorStop(0, `rgba(${hue},${0.16 + pulse * 0.1})`)
    g.addColorStop(1, `rgba(${hue},0)`)
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, cy, 90, 0, TAU); ctx.fill()
    ctx.restore()
    ctx.fillStyle = `rgba(${hue},${0.5 + pulse * 0.3})`
    for (let s = 0; s < 3; s++) {
      const sa = (hash1(k + s * 3.1) - 0.5) * 1.2
      const sl = 26 + hash1(k * 2 + s) * 44
      ctx.save()
      ctx.translate(x + (s - 1) * 18, cy + 8)
      ctx.rotate(sa)
      ctx.beginPath()
      ctx.moveTo(0, 0); ctx.lineTo(-7, -sl * 0.3); ctx.lineTo(0, -sl); ctx.lineTo(7, -sl * 0.3)
      ctx.closePath(); ctx.fill()
      ctx.restore()
    }
  }
}

// the magma sea: heat shimmer and rising embers
function drawMagmaGlow(vw, vh) {
  const t = now() * 0.001
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const gap = 420
  const k0 = Math.floor((player.x - vw) / gap)
  const k1 = Math.ceil((player.x + vw) / gap)
  for (let k = k0; k <= k1; k++) {
    const h = hash1(k * 4.9)
    if (h < 0.3) continue
    const gy = sy(11500 + hash1(k * 2.1) * 2600)
    if (gy < -240 || gy > vh + 240) continue
    const x = px(k * gap + hash1(k * 6.3) * 200, 1)
    const g = ctx.createRadialGradient(x, gy, 0, x, gy, 150 + h * 120)
    g.addColorStop(0, `rgba(255,${110 + Math.round(h * 60)},40,${0.10 + 0.06 * Math.sin(t * 2 + k)})`)
    g.addColorStop(1, 'rgba(255,110,40,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, gy, 150 + h * 120, 0, TAU); ctx.fill()
    // embers drifting up
    for (let e = 0; e < 3; e++) {
      const ph = ((t * (14 + e * 6) + hash1(k + e) * 200) % 200)
      ctx.fillStyle = `rgba(255,170,80,${0.5 * (1 - ph / 200)})`
      ctx.beginPath()
      ctx.arc(x + Math.sin(t + e * 2 + k) * 30, gy - ph, 2, 0, TAU)
      ctx.fill()
    }
  }
  ctx.restore()
}

// the frozen reaches: floes on the line, berg keels below it
function drawArcticIce(vw, vh) {
  const gap = 380
  const k0 = Math.floor((player.x - vw) / gap)
  const k1 = Math.ceil((player.x + vw) / gap)
  const wy = sy(SURFACE_Y)
  for (let k = k0; k <= k1; k++) {
    const wx = k * gap + hash1(k * 3.3) * 200
    const a = clamp((Math.abs(wx) - ARCTIC_START) / (ARCTIC_FULL - ARCTIC_START), 0, 1)
    if (a < 0.12 || realm !== 'ocean') continue
    const h = hash1(k * 7.7)
    if (h < 0.25) continue
    const x = px(wx, 1)
    if (x < -300 || x > vw + 300) continue
    const w = 60 + h * 150 + a * 90
    const keel = (30 + h * 120) * a
    // floe cap above the line
    ctx.fillStyle = `rgba(232,244,250,${0.5 + a * 0.4})`
    ctx.beginPath()
    ctx.moveTo(x - w / 2, wy + 2)
    ctx.lineTo(x - w * 0.3, wy - 8 - a * 10 * h)
    ctx.lineTo(x + w * 0.25, wy - 6 - a * 16 * hash1(k * 9.1))
    ctx.lineTo(x + w / 2, wy + 2)
    ctx.closePath()
    ctx.fill()
    // keel below
    ctx.fillStyle = `rgba(190,222,238,${0.22 + a * 0.2})`
    ctx.beginPath()
    ctx.moveTo(x - w / 2, wy + 2)
    ctx.lineTo(x + w / 2, wy + 2)
    ctx.lineTo(x + w * 0.16, wy + keel)
    ctx.lineTo(x - w * 0.22, wy + keel * 0.7)
    ctx.closePath()
    ctx.fill()
  }
}

// the sweet water: lily pads and reed curtains near the light
function drawLilyPads(vw, vh) {
  const wy = sy(SURFACE_Y)
  const t = now() * 0.001
  if (wy > -60 && wy < vh + 60) {
    const gap = 200
    const k0 = Math.floor((player.x - vw) / gap)
    const k1 = Math.ceil((player.x + vw) / gap)
    for (let k = k0; k <= k1; k++) {
      const h = hash1(k * 6.1)
      if (h < 0.4) continue
      const x = px(k * gap + hash1(k * 2.7) * 120, 1)
      const r = 16 + h * 26
      ctx.fillStyle = `rgba(70,120,58,${0.6 + h * 0.3})`
      ctx.beginPath()
      ctx.ellipse(x, wy + 2 + Math.sin(t + k) * 1.5, r, r * 0.32, 0, 0, TAU)
      ctx.fill()
      ctx.fillStyle = 'rgba(30,60,32,0.55)'
      ctx.beginPath()
      ctx.moveTo(x, wy + 2)
      ctx.lineTo(x + r * 0.9, wy - 2)
      ctx.lineTo(x + r * 0.9, wy + 5)
      ctx.closePath()
      ctx.fill()
      if (hash1(k * 9.7) > 0.8) {
        ctx.fillStyle = 'rgba(240,190,220,0.85)'
        ctx.beginPath(); ctx.arc(x - r * 0.4, wy - 3, 4, 0, TAU); ctx.fill()
      }
    }
  }
}

function drawCrags(yFrom, yTo, gap, par, col) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const k0 = Math.floor((player.x * par - vw) / gap)
  const k1 = Math.ceil((player.x * par + vw) / gap)
  ctx.fillStyle = col
  for (let k = k0; k <= k1; k++) {
    const h1 = hash1(k * 1.7)
    const h2 = hash1(k * 3.1 + 5)
    const h3 = hash1(k * 5.3 + 11)
    const y = sy(yFrom + h1 * (yTo - yFrom))
    if (y < -800 || y > vh + 800) continue
    const x = px(k * gap + h2 * gap * 0.6, par)
    if (x < -260 || x > vw + 260) continue
    const w = 70 + h3 * 160
    const hgt = 180 + h2 * 460
    const up = h3 > 0.5 ? -1 : 1
    ctx.beginPath()
    ctx.moveTo(x - w / 2, y)
    ctx.lineTo(x - w * 0.16, y - up * hgt * 0.6)
    ctx.lineTo(x + w * 0.05, y - up * hgt)
    ctx.lineTo(x + w * 0.3, y - up * hgt * 0.48)
    ctx.lineTo(x + w / 2, y)
    ctx.closePath()
    ctx.fill()
  }
}

function drawWhaleFalls(vw, vh) {
  const gap = 1500
  const par = 0.6
  const k0 = Math.floor((player.x * par - vw) / gap)
  const k1 = Math.ceil((player.x * par + vw) / gap)
  for (let k = k0; k <= k1; k++) {
    if (hash1(k * 9.1) < 0.6) continue
    const wy = 3400 + hash1(k * 2.7) * 1000
    const y = sy(wy)
    if (y < -200 || y > vh + 200) continue
    const x = px(k * gap, par)
    const len = 180 + hash1(k * 6.1) * 130
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((hash1(k * 8.3) - 0.5) * 0.5)
    ctx.strokeStyle = 'rgba(180,190,200,0.30)'
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(len / 2, 0); ctx.stroke()
    ctx.lineWidth = 2.5
    for (let i = 0; i < 9; i++) {
      const rx = -len / 2 + 18 + i * (len - 40) / 9
      const rib = 34 * Math.sin((i / 8) * Math.PI) + 8
      ctx.beginPath()
      ctx.moveTo(rx, 0)
      ctx.quadraticCurveTo(rx - 10, rib * 0.7, rx - 4, rib)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(rx, 0)
      ctx.quadraticCurveTo(rx - 10, -rib * 0.7, rx - 4, -rib)
      ctx.stroke()
    }
    // skull
    ctx.fillStyle = 'rgba(190,198,208,0.26)'
    ctx.beginPath(); ctx.ellipse(len / 2 + 16, 0, 30, 13, 0, 0, TAU); ctx.fill()
    ctx.restore()
  }
}

function drawVents(vw, vh) {
  const fy = sy(WORLD_H)
  // chimneys reach ~340px up, and their plumes another 430 above that
  if (fy < -1100 || fy > vh + 380) return
  const gap = 320
  const k0 = Math.floor((player.x - vw) / gap)
  const k1 = Math.ceil((player.x + vw) / gap)
  const t = now() * 0.001
  for (let k = k0; k <= k1; k++) {
    const h = hash1(k * 2.3)
    if (h < 0.35) continue
    const x = px(k * gap + hash1(k * 4.7) * 160, 1)
    const hgt = 90 + h * 250
    const mouth = fy - hgt
    // plume of superheated water
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const pg = ctx.createLinearGradient(x, mouth, x, mouth - 420)
    pg.addColorStop(0, 'rgba(255,140,60,0.34)')
    pg.addColorStop(0.4, 'rgba(255,90,40,0.12)')
    pg.addColorStop(1, 'rgba(120,40,20,0)')
    ctx.fillStyle = pg
    ctx.beginPath()
    ctx.moveTo(x - 12, mouth)
    ctx.quadraticCurveTo(x - 46 + Math.sin(t + k) * 20, mouth - 220, x - 30, mouth - 430)
    ctx.lineTo(x + 34, mouth - 430)
    ctx.quadraticCurveTo(x + 48 + Math.sin(t * 1.3 + k) * 20, mouth - 210, x + 12, mouth)
    ctx.closePath()
    ctx.fill()
    const mg = ctx.createRadialGradient(x, mouth, 0, x, mouth, 70)
    mg.addColorStop(0, 'rgba(255,150,70,0.6)')
    mg.addColorStop(1, 'rgba(255,120,40,0)')
    ctx.fillStyle = mg
    ctx.beginPath(); ctx.arc(x, mouth, 70, 0, TAU); ctx.fill()
    ctx.restore()
    // chimney
    ctx.fillStyle = '#150a0c'
    ctx.beginPath()
    ctx.moveTo(x - 28 - h * 12, fy + 6)
    ctx.lineTo(x - 11, mouth)
    ctx.lineTo(x + 11, mouth)
    ctx.lineTo(x + 28 + h * 12, fy + 6)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,110,50,0.28)'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(x - 11, mouth); ctx.lineTo(x + 11, mouth); ctx.stroke()
  }
}

function drawEggBeds(vw, vh) {
  const fy = sy(WORLD_H)
  if (fy < -300 || fy > vh + 200) return
  const gap = 240
  const k0 = Math.floor((player.x - vw) / gap)
  const k1 = Math.ceil((player.x + vw) / gap)
  const t = now() * 0.0016
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let k = k0; k <= k1; k++) {
    const h = hash1(k * 6.7)
    if (h < 0.45) continue
    const x = px(k * gap + hash1(k * 3.9) * 120, 1)
    for (let e = 0; e < 4; e++) {
      const ex = x + (e - 1.5) * 15 + hash1(k + e) * 8
      const ey = fy - 6 - hash1(k * 2 + e) * 16
      const pulse = 0.45 + 0.35 * Math.sin(t * 2 + k + e)
      const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 22)
      eg.addColorStop(0, `rgba(255,90,140,${0.5 * pulse})`)
      eg.addColorStop(1, 'rgba(255,60,110,0)')
      ctx.fillStyle = eg
      ctx.beginPath(); ctx.arc(ex, ey, 22, 0, TAU); ctx.fill()
      ctx.fillStyle = `rgba(255,190,215,${0.5 * pulse})`
      ctx.beginPath(); ctx.ellipse(ex, ey, 5, 7, 0, 0, TAU); ctx.fill()
    }
  }
  ctx.restore()
}

// ---- Air scenery -------------------------------------------------------
// Tilt-parallax: every layer leans with the device (or the cursor), farther
// layers leaning less. `tp(par)` is the extra screen offset for a layer.
function tpx(par) { return -tilt.x * 60 * (1 - par) }
function tpy(par) { return -tilt.y * 40 * (1 - par) }

// fair-weather cumulus: rows of soft puffs
function drawClouds(vw, vh, midY, spread, par, alpha) {
  const gap = 460
  const k0 = Math.floor((player.x * par - vw) / gap)
  const k1 = Math.ceil((player.x * par + vw) / gap)
  for (let k = k0; k <= k1; k++) {
    const h = hash1(k * 2.9)
    if (h > 0.72) continue
    const cy = sy(midY + (hash1(k * 6.1) - 0.5) * spread * 2) + tpy(par)
    if (cy < -120 || cy > vh + 120) continue
    const x = px(k * gap + hash1(k * 3.7) * gap * 0.6, par) + tpx(par)
    const s = 40 + h * 70
    ctx.fillStyle = `rgba(240,248,255,${(0.16 + h * 0.14) * alpha})`
    for (let b = 0; b < 4; b++) {
      const bh = hash1(k * 5.1 + b * 1.7)
      ctx.beginPath()
      ctx.ellipse(x + (b - 1.5) * s * 0.55, cy + Math.sin(b * 2.1) * s * 0.16, s * (0.5 + bh * 0.4), s * (0.3 + bh * 0.2), 0, 0, TAU)
      ctx.fill()
    }
  }
}

// the storm layer: anvil-dark cloud banks, rain, and lightning that actually
// lights the band up
function drawStormClouds(vw, vh) {
  const par = 0.42
  const gap = 560
  const k0 = Math.floor((player.x * par - vw) / gap)
  const k1 = Math.ceil((player.x * par + vw) / gap)
  const t = now() * 0.001
  for (let k = k0; k <= k1; k++) {
    const h = hash1(k * 4.3)
    if (h < 0.25) continue
    const cy = sy(-1400 + (hash1(k * 7.9) - 0.5) * 900) + tpy(par)
    if (cy < -220 || cy > vh + 260) continue
    const x = px(k * gap + hash1(k * 2.1) * gap * 0.5, par) + tpx(par)
    const s = 80 + h * 110
    // lightning: a per-column strobe with a long dark phase
    const strobe = (t * (0.3 + h * 0.4) + h * 7) % 6
    const lit = strobe < 0.14 ? 1 - strobe / 0.14 : 0
    ctx.fillStyle = `rgba(${34 + lit * 130},${40 + lit * 130},${58 + lit * 120},${0.5 + h * 0.25})`
    for (let b = 0; b < 5; b++) {
      const bh = hash1(k * 9.7 + b * 2.3)
      ctx.beginPath()
      ctx.ellipse(x + (b - 2) * s * 0.5, cy + Math.sin(b * 1.7) * s * 0.2, s * (0.45 + bh * 0.4), s * (0.28 + bh * 0.22), 0, 0, TAU)
      ctx.fill()
    }
    // a jagged bolt during the flash
    if (lit > 0.25) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.strokeStyle = `rgba(220,235,255,${lit * 0.9})`
      ctx.lineWidth = 2.4
      ctx.beginPath()
      let bx = x, byy = cy + s * 0.3
      ctx.moveTo(bx, byy)
      for (let seg = 0; seg < 5; seg++) {
        bx += (hash1(k * 3.3 + seg) - 0.5) * 46
        byy += 34 + hash1(k + seg) * 26
        ctx.lineTo(bx, byy)
      }
      ctx.stroke()
      ctx.restore()
    }
    // rain streaks under the bank
    ctx.strokeStyle = 'rgba(160,190,220,0.14)'
    ctx.lineWidth = 1
    for (let rI = 0; rI < 7; rI++) {
      const rx = x + (rI - 3) * s * 0.26 + ((t * 60) % 20)
      ctx.beginPath()
      ctx.moveTo(rx, cy + s * 0.3)
      ctx.lineTo(rx - 8, cy + s * 0.3 + 60)
      ctx.stroke()
    }
  }
}

// the jet stream: long wind shears and old contrails
function drawContrails(vw, vh) {
  const par = 0.5
  const gap = 700
  const k0 = Math.floor((player.x * par - vw) / gap)
  const k1 = Math.ceil((player.x * par + vw) / gap)
  for (let k = k0; k <= k1; k++) {
    const h = hash1(k * 5.9)
    if (h < 0.3) continue
    const cy = sy(-2350 - hash1(k * 3.1) * 1250) + tpy(par)
    if (cy < -60 || cy > vh + 60) continue
    const x = px(k * gap, par) + tpx(par)
    const len = 240 + h * 320
    const grad = ctx.createLinearGradient(x - len / 2, 0, x + len / 2, 0)
    grad.addColorStop(0, 'rgba(220,235,250,0)')
    grad.addColorStop(0.5, `rgba(220,235,250,${0.10 + h * 0.12})`)
    grad.addColorStop(1, 'rgba(220,235,250,0)')
    ctx.strokeStyle = grad
    ctx.lineWidth = 3 + h * 3
    ctx.beginPath()
    ctx.moveTo(x - len / 2, cy)
    ctx.quadraticCurveTo(x, cy + (hash1(k * 8.3) - 0.5) * 40, x + len / 2, cy - 8)
    ctx.stroke()
  }
}

// stratosphere: aurora curtains, slow and enormous
function drawAurora(vw, vh) {
  const t = now() * 0.0004
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let band = 0; band < 3; band++) {
    const par = 0.25 + band * 0.1
    const baseY = sy(-4100 - band * 380) + tpy(par)
    if (baseY < -400 || baseY > vh + 400) continue
    const col = band === 1 ? '122,255,200' : band === 2 ? '255,138,196' : '138,196,255'
    ctx.beginPath()
    for (let x = -40; x <= vw + 40; x += 26) {
      const wob = Math.sin(x * 0.006 + t * (2 + band) + band * 2) * 60 + Math.sin(x * 0.017 - t * 3) * 24
      x === -40 ? ctx.moveTo(x, baseY + wob) : ctx.lineTo(x, baseY + wob)
    }
    for (let x = vw + 40; x >= -40; x -= 26) {
      const wob = Math.sin(x * 0.006 + t * (2 + band) + band * 2) * 60 + Math.sin(x * 0.017 - t * 3) * 24
      ctx.lineTo(x, baseY + wob + 150 + band * 40)
    }
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, baseY - 60, 0, baseY + 220)
    grad.addColorStop(0, `rgba(${col},0.16)`)
    grad.addColorStop(1, `rgba(${col},0)`)
    ctx.fillStyle = grad
    ctx.fill()
  }
  ctx.restore()
}

// the void: dim nebula blooms behind the stars
function drawNebulae(vw, vh) {
  const par = 0.08
  const gap = 900
  const k0 = Math.floor((player.x * par - vw) / gap)
  const k1 = Math.ceil((player.x * par + vw) / gap)
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let k = k0; k <= k1; k++) {
    const h = hash1(k * 6.7)
    if (h < 0.4) continue
    const ny = sy(-8300 - hash1(k * 2.3) * 1900) + tpy(par)
    if (ny < -400 || ny > vh + 400) continue
    const x = px(k * gap, par) + tpx(par)
    const r = 180 + h * 260
    const cols = [['120,60,180', '40,140,200'], ['200,70,140', '80,60,200'], ['60,160,160', '140,80,200']]
    const [c1, c2] = cols[Math.floor(h * 3) % 3]
    const g1 = ctx.createRadialGradient(x, ny, 0, x, ny, r)
    g1.addColorStop(0, `rgba(${c1},0.10)`)
    g1.addColorStop(1, `rgba(${c1},0)`)
    ctx.fillStyle = g1
    ctx.beginPath(); ctx.arc(x, ny, r, 0, TAU); ctx.fill()
    const g2 = ctx.createRadialGradient(x + r * 0.4, ny + r * 0.2, 0, x + r * 0.4, ny + r * 0.2, r * 0.7)
    g2.addColorStop(0, `rgba(${c2},0.08)`)
    g2.addColorStop(1, `rgba(${c2},0)`)
    ctx.fillStyle = g2
    ctx.beginPath(); ctx.arc(x + r * 0.4, ny + r * 0.2, r * 0.7, 0, TAU); ctx.fill()
  }
  ctx.restore()
}

// ---- The moon (rendered) -----------------------------------------------
function drawMoon(vw, vh) {
  if (MOON.eaten) return
  const mx = sx(MOON.x)
  const my = sy(MOON.y)
  const r = moonRadius()
  if (mx < -r - 200 || mx > vw + r + 200 || my < -r - 200 || my > vh + r + 200) return
  const t = now() * 0.001

  // halo
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const hg = ctx.createRadialGradient(mx, my, r * 0.6, mx, my, r * 2.2)
  hg.addColorStop(0, 'rgba(240,238,215,0.30)')
  hg.addColorStop(1, 'rgba(240,238,215,0)')
  ctx.fillStyle = hg
  ctx.beginPath(); ctx.arc(mx, my, r * 2.2, 0, TAU); ctx.fill()
  ctx.restore()

  // body
  const bg = ctx.createRadialGradient(mx - r * 0.3, my - r * 0.3, r * 0.2, mx, my, r)
  bg.addColorStop(0, '#f2efdc')
  bg.addColorStop(0.7, '#d6d2bc')
  bg.addColorStop(1, '#a8a492')
  ctx.fillStyle = bg
  ctx.beginPath(); ctx.arc(mx, my, r, 0, TAU); ctx.fill()

  // craters
  ctx.fillStyle = 'rgba(150,146,130,0.55)'
  for (let i = 0; i < 12; i++) {
    const h1 = hash1(i * 3.3), h2 = hash1(i * 7.1 + 5), h3 = hash1(i * 5.7 + 11)
    const a = h1 * TAU
    const d = h2 * r * 0.82
    ctx.beginPath()
    ctx.arc(mx + Math.cos(a) * d, my + Math.sin(a) * d, r * (0.05 + h3 * 0.11), 0, TAU)
    ctx.fill()
  }

  // bites already taken: scallops of sky chewed out of the rim
  const bgc = skyColor(MOON.y)
  ctx.fillStyle = `rgb(${bgc[0]},${bgc[1]},${bgc[2]})`
  for (const b of MOON.bites) {
    ctx.beginPath()
    ctx.arc(mx + Math.cos(b.a) * r, my + Math.sin(b.a) * r, b.r, 0, TAU)
    ctx.fill()
  }

  // an awake moon glowers
  if (MOON.awake) {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = `rgba(255,240,190,${0.2 + pulse * 0.25})`
    ctx.lineWidth = 3
    ctx.beginPath(); ctx.arc(mx, my, r + 14 + pulse * 8, 0, TAU); ctx.stroke()
    ctx.restore()
    // two dark hollows turned toward you, like eyes
    const pa = Math.atan2(player.y - MOON.y, player.x - MOON.x)
    ctx.fillStyle = 'rgba(60,56,48,0.85)'
    for (const off of [-0.3, 0.3]) {
      ctx.beginPath()
      ctx.ellipse(mx + Math.cos(pa + off) * r * 0.45, my + Math.sin(pa + off) * r * 0.45, r * 0.09, r * 0.13, pa, 0, TAU)
      ctx.fill()
    }
  }

  // hull-style health bar once it's been bitten
  if (MOON.hp < MOON.maxHp) {
    const f = clamp(MOON.hp / MOON.maxHp, 0, 1)
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(mx - r * 0.7, my - r - 26, r * 1.4, 5)
    ctx.fillStyle = f > 0.5 ? '#e8e2b8' : f > 0.25 ? '#e8c06a' : '#e2604f'
    ctx.fillRect(mx - r * 0.7, my - r - 26, r * 1.4 * f, 5)
  }
}

// ---- The core (rendered) -----------------------------------------------
function drawCore(vw, vh) {
  if (!worldFloorOpen || CORE.eaten) return
  const cx = sx(CORE.x)
  const cy = sy(CORE.y)
  const r = coreRadius()
  if (cx < -r - 260 || cx > vw + r + 260 || cy < -r - 260 || cy > vh + r + 260) return
  const t = now() * 0.001
  const pulse = 0.5 + 0.5 * Math.sin(t * 1.6)

  // furnace halo
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const hg = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 2.6)
  hg.addColorStop(0, `rgba(255,170,70,${0.30 + pulse * 0.12})`)
  hg.addColorStop(0.5, 'rgba(255,120,40,0.10)')
  hg.addColorStop(1, 'rgba(255,120,40,0)')
  ctx.fillStyle = hg
  ctx.beginPath(); ctx.arc(cx, cy, r * 2.6, 0, TAU); ctx.fill()
  ctx.restore()

  // molten body: white heart, orange rind
  const bg = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r)
  bg.addColorStop(0, '#fff2d0')
  bg.addColorStop(0.45, '#ffb347')
  bg.addColorStop(0.8, '#e2662a')
  bg.addColorStop(1, '#8a2f14')
  ctx.fillStyle = bg
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill()

  // slow-crawling crust plates
  ctx.fillStyle = 'rgba(46,16,10,0.6)'
  for (let i = 0; i < 9; i++) {
    const h1 = hash1(i * 4.3), h2 = hash1(i * 8.1 + 3)
    const a = h1 * TAU + t * 0.08
    const d = (0.3 + h2 * 0.6) * r
    ctx.beginPath()
    ctx.ellipse(cx + Math.cos(a) * d, cy + Math.sin(a) * d, r * (0.1 + h1 * 0.16), r * (0.06 + h2 * 0.1), a, 0, TAU)
    ctx.fill()
  }

  // bites: cooled dark scallops out of the rim
  const bgc2 = tintWater(waterColor(CORE.y), CORE.y)
  ctx.fillStyle = `rgb(${bgc2[0]},${bgc2[1]},${bgc2[2]})`
  for (const b of CORE.bites) {
    ctx.beginPath()
    ctx.arc(cx + Math.cos(b.a) * r, cy + Math.sin(b.a) * r, b.r, 0, TAU)
    ctx.fill()
  }

  if (CORE.awake) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = `rgba(255,200,120,${0.25 + pulse * 0.3})`
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.arc(cx, cy, r + 16 + pulse * 10, 0, TAU); ctx.stroke()
    ctx.restore()
  }

  if (CORE.hp < CORE.maxHp) {
    const f = clamp(CORE.hp / CORE.maxHp, 0, 1)
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(cx - r * 0.7, cy - r - 26, r * 1.4, 5)
    ctx.fillStyle = f > 0.5 ? '#ffd166' : f > 0.25 ? '#ff9a4a' : '#e2604f'
    ctx.fillRect(cx - r * 0.7, cy - r - 26, r * 1.4 * f, 5)
  }
}

// ---- The monster: one renderer per evolution ---------------------------
// Every stage gets its own silhouette. `profile` is the half-width down the
// spine (t = 0 at the snout, 1 at the tail tip); `draw` adds the anatomy.

function bell(t, peak, pw) {
  const u = t < peak ? (t / peak) * 0.5 : 0.5 + ((t - peak) / (1 - peak)) * 0.5
  return Math.pow(Math.sin(Math.PI * clamp(u, 0, 1)), pw)
}
const PROFILES = {
  larva:   (t, w) => w * (0.45 + 0.75 * bell(t, 0.20, 0.70)),
  lantern: (t, w) => w * (0.40 + 0.90 * bell(t, 0.34, 0.85)),
  ribbon:  (t, w) => w * (0.38 + 0.70 * bell(t, 0.12, 0.32)),
  viper:   (t, w) => w * (0.40 + 0.85 * bell(t, 0.24, 0.55)),
  gulper:  (t, w) => w * (0.05 + 1.55 * Math.exp(-Math.pow(t / 0.17, 2)) + 0.45 * Math.pow(1 - t, 1.7)),
  serpent: (t, w) => w * (0.45 + 0.80 * bell(t, 0.18, 0.42)),
  shark:   (t, w) => w * (0.34 + 0.95 * bell(t, 0.34, 0.90)),
  whale:   (t, w) => w * (0.42 + 1.00 * bell(t, 0.38, 1.00)),
  kraken:  (t, w) => w * (0.06 + 1.02 * Math.pow(1 - t, 0.55)),
  god:     (t, w) => w * (0.06 + 1.08 * Math.pow(1 - t, 0.48)),
  wyrm:    (t, w) => w * (0.42 + 0.85 * bell(t, 0.16, 0.40)),
  skywhale:(t, w) => w * (0.40 + 1.05 * bell(t, 0.36, 0.95)),
  starserp:(t, w) => w * (0.36 + 0.78 * bell(t, 0.14, 0.36)),
  mooneater:(t, w) => w * (0.22 + 1.05 * bell(t, 0.30, 0.90)),
  magmaw:  (t, w) => w * (0.45 + 0.85 * bell(t, 0.20, 0.50)),
  obsidian:(t, w) => w * (0.38 + 1.00 * bell(t, 0.36, 1.00)),
  worldeater:(t, w) => w * (0.55 + 0.95 * bell(t, 0.42, 1.10)),
}

// perpendicular to a spine segment; `up` is fixed per frame from the heading so
// fins never flicker between sides mid-turn
function norm(ang, up) {
  const a = ang + up * Math.PI / 2
  return [Math.cos(a), Math.sin(a)]
}

function drawPlayer() {
  const s = stage()
  const n = segCount()
  const form = FORMS[s.form]

  // A lateral swim wave, applied for rendering only so the follow-the-leader
  // spine stays honest. Long bodies ripple; blunt ones barely move.
  const pts = player.spine.slice(0, n).map((p) => ({ x: p.x, y: p.y }))
  if (form.swim) {
    const spd = clamp(Math.hypot(player.vx, player.vy) / 6, 0, 1)
    const ph = now() * 0.006 * (0.5 + spd * 1.6)
    for (let i = 1; i < n; i++) {
      const a = player.spine[i - 1]
      const b = player.spine[Math.min(n - 1, i + 1)]
      const ang = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2
      const f = i / (n - 1)
      const off = Math.sin(ph - f * TAU * form.waves) * s.width * form.swim * 1.2 * Math.pow(f, 0.7)
      pts[i].x += Math.cos(ang) * off
      pts[i].y += Math.sin(ang) * off
    }
  }

  const headA = Math.atan2(pts[0].y - pts[1].y, pts[0].x - pts[1].x)
  const mid = []
  for (let i = 0; i < n; i++) {
    const p = pts[i]
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(n - 1, i + 1)]
    mid.push({
      x: sx(p.x),
      y: sy(p.y),
      w: form.profile(i / (n - 1), s.width),
      ang: Math.atan2(b.y - a.y, b.x - a.x),
    })
  }
  const P = {
    n, s, mid, headA,
    maxW: s.width,
    hx: mid[0].x,
    hy: mid[0].y,
    // nose half-width and the fuller body width just behind it — head anatomy
    // hangs off these, so nothing floats in front of a pointed snout
    noseW: mid[0].w,
    bodyW: mid[Math.min(n - 1, Math.max(1, Math.round(n * 0.22)))].w,
    tail: mid[n - 1],
    up: Math.cos(headA) < 0 ? -1 : 1,
    t: now() * 0.001,
  }
  drawAura(P)
  form.draw(P)
  drawStatusFx(P)
}

function drawAura(P) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const r = P.maxW * 6
  const a = ctx.createRadialGradient(P.hx, P.hy, 0, P.hx, P.hy, r)
  a.addColorStop(0, hexA(P.s.accent, 0.26))
  a.addColorStop(1, hexA(P.s.accent, 0))
  ctx.fillStyle = a
  ctx.beginPath(); ctx.arc(P.hx, P.hy, r, 0, TAU); ctx.fill()
  ctx.restore()
}

// Trace the body outline (rounded snout) and leave it as the current path.
function bodyPath(P, from = 0, to = P.n - 1) {
  ctx.beginPath()
  for (let i = from; i <= to; i++) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, 1)
    const x = m.x + nx * m.w, y = m.y + ny * m.w
    i === from ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  for (let i = to; i >= from; i--) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, -1)
    ctx.lineTo(m.x + nx * m.w, m.y + ny * m.w)
  }
  const h = P.mid[from]
  ctx.arc(h.x, h.y, h.w, h.ang - Math.PI / 2, h.ang + Math.PI / 2, true)
  ctx.closePath()
}

function fillBody(P, opts = {}) {
  const s = P.s
  bodyPath(P)
  const grad = ctx.createLinearGradient(P.hx, P.hy, P.tail.x, P.tail.y)
  grad.addColorStop(0, opts.head || s.color)
  grad.addColorStop(1, opts.tailCol || shade(s.color, -42))
  ctx.fillStyle = grad
  ctx.fill()
  if (opts.rim !== false) {
    ctx.strokeStyle = hexA(s.accent, opts.rimA ?? 0.5)
    ctx.lineWidth = opts.rimW ?? 1.5
    ctx.stroke()
  }
  if (player.hurt > 0) { ctx.fillStyle = `rgba(255,60,60,${player.hurt * 0.4})`; ctx.fill() }
  if (player.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${player.flash * 0.28})`; ctx.fill() }
}

// head-local space: +x forward, +y down (mirrored so anatomy never rolls over)
function headSpace(P, fn) {
  ctx.save()
  ctx.translate(P.hx, P.hy)
  ctx.rotate(P.headA)
  ctx.scale(1, P.up)
  fn()
  ctx.restore()
}

function eyeAt(x, y, r, white, pupil) {
  ctx.fillStyle = white
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill()
  ctx.fillStyle = pupil
  ctx.beginPath(); ctx.arc(x + r * 0.22, y - r * 0.1, r * 0.48, 0, TAU); ctx.fill()
}

function photophores(P, from, to, col, side, step = 1) {
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = from; i < to; i += step) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up * side)
    const pulse = 0.35 + 0.65 * Math.abs(Math.sin(P.t * 2 + i * 0.55))
    ctx.fillStyle = hexA(col, 0.75 * pulse)
    ctx.beginPath()
    ctx.arc(m.x + nx * m.w * 0.72, m.y + ny * m.w * 0.72, Math.max(1, m.w * 0.18), 0, TAU)
    ctx.fill()
  }
  ctx.restore()
}

// A pair of fins hanging off the spine at index i.
function finPair(P, i, len, sweep, col, rim) {
  const m = P.mid[i]
  for (const side of [1, -1]) {
    const [nx, ny] = norm(m.ang, side)
    const fx = Math.cos(m.ang), fy = Math.sin(m.ang)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.6, m.y + ny * m.w * 0.6)
    ctx.quadraticCurveTo(
      m.x + nx * len, m.y + ny * len,
      m.x + nx * len * 0.55 + fx * sweep, m.y + ny * len * 0.55 + fy * sweep
    )
    ctx.lineTo(m.x + fx * sweep * 0.4, m.y + fy * sweep * 0.4)
    ctx.closePath()
    ctx.fillStyle = col
    ctx.fill()
    if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = 1; ctx.stroke() }
  }
}

// A tapered, curling limb built from a chain of points.
function limbPts(x, y, ang, len, w, curl, wob, segs = 11) {
  const out = []
  let a = ang, cx = x, cy = y
  for (let i = 0; i <= segs; i++) {
    const f = i / segs
    out.push({ x: cx, y: cy, w: Math.max(0.6, w * Math.pow(1 - f, 0.75)) })
    a += curl / segs + Math.sin(wob + f * 4) * 0.05
    cx += Math.cos(a) * (len / segs)
    cy += Math.sin(a) * (len / segs)
  }
  return out
}

function fillLimb(pts, col, rim, suckers) {
  const N = pts.length
  const sideAng = (i) => {
    const o = pts[Math.max(0, i - 1)], q = pts[Math.min(N - 1, i + 1)]
    return Math.atan2(q.y - o.y, q.x - o.x) + Math.PI / 2
  }
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const p = pts[i], a = sideAng(i)
    const x = p.x + Math.cos(a) * p.w, y = p.y + Math.sin(a) * p.w
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
  }
  for (let i = N - 1; i >= 0; i--) {
    const p = pts[i], a = sideAng(i)
    ctx.lineTo(p.x - Math.cos(a) * p.w, p.y - Math.sin(a) * p.w)
  }
  ctx.closePath()
  ctx.fillStyle = col
  ctx.fill()
  if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = 1; ctx.stroke() }
  if (suckers) {
    ctx.fillStyle = suckers
    for (let i = 1; i < N - 2; i++) {
      const p = pts[i], a = sideAng(i)
      ctx.beginPath()
      ctx.arc(p.x + Math.cos(a) * p.w * 0.45, p.y + Math.sin(a) * p.w * 0.45, Math.max(0.7, p.w * 0.28), 0, TAU)
      ctx.fill()
    }
  }
}

// ---- Stage 1 · Larva ---------------------------------------------------
function drawLarva(P) {
  const s = P.s
  fillBody(P, { head: hexA(s.color, 0.85), tailCol: hexA(s.color, 0.35), rimA: 0.7 })
  // beating flagellum
  ctx.strokeStyle = hexA(s.accent, 0.55)
  ctx.lineWidth = 1.2
  ctx.beginPath()
  const tl = P.tail
  ctx.moveTo(tl.x, tl.y)
  for (let i = 1; i <= 6; i++) {
    const [nx, ny] = norm(tl.ang, 1)
    const d = i * P.maxW * 0.9
    const w = Math.sin(P.t * 9 + i * 0.9) * P.maxW * 0.8
    ctx.lineTo(tl.x + Math.cos(tl.ang) * d + nx * w, tl.y + Math.sin(tl.ang) * d + ny * w)
  }
  ctx.stroke()
  headSpace(P, () => {
    // one enormous eye and a visible gut speck — that's the whole animal
    const b = P.bodyW
    eyeAt(-b * 0.35, -b * 0.3, b * 0.5, '#06161f', s.accent)
    ctx.fillStyle = hexA(s.accent, 0.5)
    ctx.beginPath(); ctx.ellipse(-b * 2.2, 0, b * 0.34, b * 0.22, 0, 0, TAU); ctx.fill()
  })
}

// ---- Stage 2 · Lanternfish ---------------------------------------------
function drawLantern(P) {
  const s = P.s
  const tl = P.tail
  const fx = Math.cos(tl.ang), fy = Math.sin(tl.ang)
  const [ux, uy] = norm(tl.ang, 1)
  // forked tail
  ctx.fillStyle = hexA(s.color, 0.75)
  for (const side of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(tl.x, tl.y)
    ctx.lineTo(tl.x + fx * P.maxW * 1.9 + ux * side * P.maxW * 1.5, tl.y + fy * P.maxW * 1.9 + uy * side * P.maxW * 1.5)
    ctx.lineTo(tl.x + fx * P.maxW * 1.1, tl.y + fy * P.maxW * 1.1)
    ctx.closePath()
    ctx.fill()
  }
  finPair(P, Math.floor(P.n * 0.28), P.maxW * 1.9, P.maxW * 1.2, hexA(s.accent, 0.3))
  fillBody(P)
  // the belly lamps this fish is named for
  photophores(P, 2, P.n - 2, s.accent, -1)
  headSpace(P, () => {
    const b = P.bodyW
    // small under-slung mouth, big eye, and a barbel with a lamp on the end
    ctx.fillStyle = '#08151f'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.5, b * 0.05)
    ctx.quadraticCurveTo(-b * 0.5, b * (0.5 + player.maw * 0.3), -b * 1.2, b * 0.25)
    ctx.quadraticCurveTo(-b * 0.4, b * 0.1, P.noseW * 0.5, b * 0.05)
    ctx.closePath(); ctx.fill()
    eyeAt(-b * 0.7, -b * 0.35, b * 0.3, '#04121c', '#eaffff')
    const lx = b * 1.6, ly = b * (1.3 + Math.sin(P.t * 3) * 0.25)
    ctx.strokeStyle = hexA(s.accent, 0.6)
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(-b * 0.3, b * 0.45)
    ctx.quadraticCurveTo(b * 0.9, b * 1.2, lx, ly)
    ctx.stroke()
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, b * 1.5)
    g.addColorStop(0, hexA(s.accent, 0.9)); g.addColorStop(1, hexA(s.accent, 0))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(lx, ly, b * 1.5, 0, TAU); ctx.fill()
    ctx.restore()
  })
}

// ---- Stage 3 · Ribbon Eel ----------------------------------------------
function drawRibbon(P) {
  const s = P.s
  // one tall wavy frill running the whole ribbon
  ctx.beginPath()
  for (let i = 0; i < P.n; i++) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    const h = m.w + P.maxW * (1.5 + Math.sin(P.t * 3 + i * 0.5) * 0.5)
    const x = m.x + nx * h, y = m.y + ny * h
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
  }
  for (let i = P.n - 1; i >= 0; i--) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    ctx.lineTo(m.x + nx * m.w * 0.4, m.y + ny * m.w * 0.4)
  }
  ctx.closePath()
  ctx.fillStyle = hexA(s.accent, 0.28)
  ctx.fill()
  ctx.strokeStyle = hexA(s.accent, 0.4)
  ctx.lineWidth = 1
  ctx.stroke()
  fillBody(P)
  // soft banding down the ribbon
  ctx.strokeStyle = hexA(s.accent, 0.14)
  ctx.lineWidth = 2
  for (let i = 4; i < P.n - 2; i += 4) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, 1)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w, m.y + ny * m.w)
    ctx.lineTo(m.x - nx * m.w, m.y - ny * m.w)
    ctx.stroke()
  }
  headSpace(P, () => {
    const b = P.bodyW
    // the long gape of a moray, and the flared nostril trumpets
    ctx.fillStyle = '#0a1a24'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.7, 0)
    ctx.quadraticCurveTo(-b * 1.0, -b * (0.5 + player.maw * 0.7), -b * 2.1, -b * 0.2)
    ctx.lineTo(-b * 2.1, b * 0.2)
    ctx.quadraticCurveTo(-b * 1.0, b * (0.5 + player.maw * 0.7), P.noseW * 0.7, 0)
    ctx.closePath(); ctx.fill()
    ctx.strokeStyle = '#eafcff'
    ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const tx = -b * 0.2 - i * b * 0.36
      ctx.beginPath(); ctx.moveTo(tx, -b * 0.35); ctx.lineTo(tx, -b * 0.1); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(tx - b * 0.1, b * 0.35); ctx.lineTo(tx - b * 0.1, b * 0.1); ctx.stroke()
    }
    ctx.fillStyle = hexA(s.accent, 0.8)
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(-b * 0.1, sgn * b * 0.3)
      ctx.quadraticCurveTo(b * 0.9, sgn * b * 1.1, b * 0.5, sgn * b * 1.35)
      ctx.quadraticCurveTo(b * 0.3, sgn * b * 0.8, -b * 0.35, sgn * b * 0.5)
      ctx.closePath()
      ctx.fill()
    }
    eyeAt(-b * 0.75, -b * 0.45, b * 0.24, '#04121c', '#f0ffb0')
  })
}

// ---- Stage 4 · Viperfish -----------------------------------------------
function drawViper(P) {
  const s = P.s
  const tl = P.tail
  const fx = Math.cos(tl.ang), fy = Math.sin(tl.ang)
  const [ux, uy] = norm(tl.ang, 1)
  ctx.fillStyle = hexA(s.color, 0.8)
  ctx.beginPath()
  ctx.moveTo(tl.x, tl.y)
  ctx.lineTo(tl.x + fx * P.maxW * 1.6 + ux * P.maxW * 1.3, tl.y + fy * P.maxW * 1.6 + uy * P.maxW * 1.3)
  ctx.lineTo(tl.x + fx * P.maxW * 2.2, tl.y + fy * P.maxW * 2.2)
  ctx.lineTo(tl.x + fx * P.maxW * 1.6 - ux * P.maxW * 1.3, tl.y + fy * P.maxW * 1.6 - uy * P.maxW * 1.3)
  ctx.closePath()
  ctx.fill()
  finPair(P, Math.floor(P.n * 0.3), P.maxW * 1.6, P.maxW, hexA(s.accent, 0.22))
  fillBody(P)
  photophores(P, 2, P.n - 2, s.accent, -1)
  // the absurd fishing rod: first dorsal ray arched right over the mouth
  const base = P.mid[Math.floor(P.n * 0.16)]
  const [bx, by] = norm(base.ang, P.up)
  const tipX = P.hx + Math.cos(P.headA) * P.maxW * 2.6 + bx * P.maxW * 2.2
  const tipY = P.hy + Math.sin(P.headA) * P.maxW * 2.6 + by * P.maxW * 2.2
  ctx.strokeStyle = hexA(s.accent, 0.6)
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(base.x + bx * base.w, base.y + by * base.w)
  ctx.quadraticCurveTo(base.x + bx * P.maxW * 5, base.y + by * P.maxW * 5, tipX, tipY)
  ctx.stroke()
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const lg = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, P.maxW * 2)
  lg.addColorStop(0, hexA(s.accent, 0.95)); lg.addColorStop(1, hexA(s.accent, 0))
  ctx.fillStyle = lg
  ctx.beginPath(); ctx.arc(tipX, tipY, P.maxW * 2, 0, TAU); ctx.fill()
  ctx.restore()
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.4 + player.maw * 0.9
    ctx.fillStyle = '#0a1620'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.8, 0)
    ctx.quadraticCurveTo(-b * 0.6, -b * open, -b * 1.7, -b * 0.15)
    ctx.lineTo(-b * 1.7, b * 0.15)
    ctx.quadraticCurveTo(-b * 0.6, b * open, P.noseW * 0.8, 0)
    ctx.closePath()
    ctx.fill()
    // needle fangs far too long to fit inside that mouth
    ctx.strokeStyle = '#f6ffff'
    ctx.lineWidth = 1.8
    ctx.lineCap = 'round'
    for (let i = 0; i < 4; i++) {
      const tx = P.noseW * 0.5 - i * b * 0.42
      ctx.beginPath(); ctx.moveTo(tx, -b * open * 0.5); ctx.lineTo(tx - b * 0.1, b * (open * 0.55 + 0.7)); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(tx - b * 0.18, b * open * 0.5); ctx.lineTo(tx - b * 0.28, -b * (open * 0.5 + 0.6)); ctx.stroke()
    }
    ctx.lineCap = 'butt'
    eyeAt(-b * 0.95, -b * 0.5, b * 0.3, '#04121c', '#9dfcff')
  })
}

// ---- Stage 5 · Gulper Eel ----------------------------------------------
function drawGulper(P) {
  const s = P.s
  const tl = P.tail
  // luminous whip-tail tip
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const tg = ctx.createRadialGradient(tl.x, tl.y, 0, tl.x, tl.y, P.maxW * 2.4)
  tg.addColorStop(0, hexA(s.accent, 0.85)); tg.addColorStop(1, hexA(s.accent, 0))
  ctx.fillStyle = tg
  ctx.beginPath(); ctx.arc(tl.x, tl.y, P.maxW * 2.4, 0, TAU); ctx.fill()
  ctx.restore()
  fillBody(P, { head: shade(s.color, 18), rimA: 0.35 })
  // loose skin folds down the pouch
  ctx.strokeStyle = hexA(s.accent, 0.16)
  ctx.lineWidth = 1.5
  for (let i = 1; i < 6; i++) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, 1)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.9, m.y + ny * m.w * 0.9)
    ctx.lineTo(m.x - nx * m.w * 0.9, m.y - ny * m.w * 0.9)
    ctx.stroke()
  }
  headSpace(P, () => {
    const open = 0.4 + player.maw * 0.9
    const jaw = P.maxW * 3.4
    // the mouth is most of the animal
    ctx.fillStyle = '#08111c'
    ctx.beginPath()
    ctx.moveTo(P.maxW * 0.4, 0)
    ctx.quadraticCurveTo(-P.maxW * 0.6, -jaw * open, -P.maxW * 2.4, -jaw * open * 0.55)
    ctx.lineTo(-P.maxW * 2.4, jaw * open * 0.55)
    ctx.quadraticCurveTo(-P.maxW * 0.6, jaw * open, P.maxW * 0.4, 0)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = hexA(s.accent, 0.5)
    ctx.lineWidth = 1.4
    ctx.stroke()
    ctx.strokeStyle = '#e8f4ff'
    ctx.lineWidth = 1
    for (let i = 0; i < 6; i++) {
      const f = i / 5
      ctx.beginPath()
      ctx.moveTo(P.maxW * 0.4 - f * P.maxW * 2.6, -jaw * open * (0.15 + f * 0.35))
      ctx.lineTo(P.maxW * 0.4 - f * P.maxW * 2.6, -jaw * open * (0.05 + f * 0.2))
      ctx.stroke()
    }
    // the eye is tiny and sits right at the snout tip
    eyeAt(P.maxW * 0.55, -P.maxW * 0.45, P.maxW * 0.2, '#050d16', '#ffb066')
  })
}

// ---- Stage 6 · Sea Serpent ---------------------------------------------
function drawSerpent(P) {
  const s = P.s
  // jagged crest the whole length of the coil
  ctx.fillStyle = hexA(s.accent, 0.55)
  for (let i = 1; i < P.n - 1; i++) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    const fx = Math.cos(m.ang), fy = Math.sin(m.ang)
    const h = m.w * (1.5 + Math.sin(i * 0.7) * 0.25)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.9 - fx * m.w * 0.7, m.y + ny * m.w * 0.9 - fy * m.w * 0.7)
    ctx.lineTo(m.x + nx * (m.w + h), m.y + ny * (m.w + h))
    ctx.lineTo(m.x + nx * m.w * 0.9 + fx * m.w * 0.7, m.y + ny * m.w * 0.9 + fy * m.w * 0.7)
    ctx.closePath()
    ctx.fill()
  }
  finPair(P, Math.floor(P.n * 0.14), P.maxW * 3.0, P.maxW * 2, hexA(s.accent, 0.24), hexA(s.accent, 0.35))
  finPair(P, Math.floor(P.n * 0.45), P.maxW * 2.0, P.maxW * 1.4, hexA(s.accent, 0.16))
  // a trailing tail membrane so the coil doesn't just stop
  {
    const tl = P.tail
    const fx = Math.cos(tl.ang), fy = Math.sin(tl.ang)
    const [ux, uy] = norm(tl.ang, P.up)
    ctx.fillStyle = hexA(s.accent, 0.3)
    ctx.beginPath()
    ctx.moveTo(tl.x, tl.y)
    ctx.quadraticCurveTo(tl.x + fx * P.maxW * 1.4 + ux * P.maxW * 1.6, tl.y + fy * P.maxW * 1.4 + uy * P.maxW * 1.6,
      tl.x + fx * P.maxW * 3.2, tl.y + fy * P.maxW * 3.2)
    ctx.quadraticCurveTo(tl.x + fx * P.maxW * 1.4 - ux * P.maxW * 0.9, tl.y + fy * P.maxW * 1.4 - uy * P.maxW * 0.9,
      tl.x, tl.y)
    ctx.closePath()
    ctx.fill()
  }
  fillBody(P)
  // scale rows
  ctx.strokeStyle = hexA(s.accent, 0.12)
  ctx.lineWidth = 1
  for (let i = 3; i < P.n - 2; i += 3) {
    const m = P.mid[i]
    ctx.beginPath()
    ctx.arc(m.x, m.y, m.w * 0.8, m.ang + 0.6, m.ang - 0.6)
    ctx.stroke()
  }
  headSpace(P, () => {
    const open = 0.3 + player.maw * 0.55
    // a pair of pale horns swept back off the skull
    ctx.fillStyle = '#e8f6ff'
    ctx.strokeStyle = hexA(s.accent, 0.6)
    ctx.lineWidth = 1
    for (const sgn of [-1.0, -0.5]) {
      ctx.beginPath()
      ctx.moveTo(-P.bodyW * 0.4, sgn * P.bodyW * 0.5)
      ctx.quadraticCurveTo(-P.bodyW * 2.0, sgn * P.bodyW * 2.2, -P.bodyW * 3.1, sgn * P.bodyW * 2.0)
      ctx.quadraticCurveTo(-P.bodyW * 1.9, sgn * P.bodyW * 1.3, -P.bodyW * 0.75, sgn * P.bodyW * 0.25)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    const b = P.bodyW
    ctx.fillStyle = '#08131f'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.8, 0)
    ctx.quadraticCurveTo(-b * 0.7, -b * open * 1.5, -b * 1.9, -b * 0.2)
    ctx.lineTo(-b * 1.9, b * 0.2)
    ctx.quadraticCurveTo(-b * 0.7, b * open * 1.5, P.noseW * 0.8, 0)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#f2ffff'
    ctx.lineWidth = 1.6
    for (let i = 0; i < 5; i++) {
      const tx = P.noseW * 0.5 - i * b * 0.36
      ctx.beginPath(); ctx.moveTo(tx, -b * open * 1.0); ctx.lineTo(tx - 1.5, -b * open * 0.2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(tx - b * 0.12, b * open * 1.0); ctx.lineTo(tx - b * 0.24, b * open * 0.2); ctx.stroke()
    }
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(-b * 0.75, -b * 0.6, 0, -b * 0.75, -b * 0.6, b * 1.6)
    g.addColorStop(0, hexA(s.accent, 0.8)); g.addColorStop(1, hexA(s.accent, 0))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(-b * 0.75, -b * 0.6, b * 1.6, 0, TAU); ctx.fill()
    ctx.restore()
    eyeAt(-b * 0.75, -b * 0.6, b * 0.3, '#0b0410', '#ff5f86')
  })
}

// ---- Stage 7 · Bone Shark ----------------------------------------------
function drawShark(P) {
  const s = P.s
  const tl = P.tail
  const fx = Math.cos(tl.ang), fy = Math.sin(tl.ang)
  const [ux, uy] = norm(tl.ang, P.up)
  // lunate tail: long upper lobe, short lower
  ctx.fillStyle = shade(s.color, -30)
  ctx.beginPath()
  ctx.moveTo(tl.x, tl.y)
  ctx.quadraticCurveTo(tl.x + fx * P.maxW * 1.2 + ux * P.maxW * 1.4, tl.y + fy * P.maxW * 1.2 + uy * P.maxW * 1.4,
    tl.x + fx * P.maxW * 2.6 + ux * P.maxW * 2.4, tl.y + fy * P.maxW * 2.6 + uy * P.maxW * 2.4)
  ctx.quadraticCurveTo(tl.x + fx * P.maxW * 1.8, tl.y + fy * P.maxW * 1.8, tl.x + fx * P.maxW * 0.9, tl.y + fy * P.maxW * 0.9)
  ctx.quadraticCurveTo(tl.x + fx * P.maxW * 1.9 - ux * P.maxW * 1.1, tl.y + fy * P.maxW * 1.9 - uy * P.maxW * 1.1,
    tl.x + fx * P.maxW * 1.4 - ux * P.maxW * 1.5, tl.y + fy * P.maxW * 1.4 - uy * P.maxW * 1.5)
  ctx.quadraticCurveTo(tl.x + fx * P.maxW * 0.5, tl.y + fy * P.maxW * 0.5, tl.x, tl.y)
  ctx.closePath()
  ctx.fill()
  finPair(P, Math.floor(P.n * 0.28), P.maxW * 3.0, P.maxW * 2.4, hexA(shade(s.color, -14), 0.9), hexA(s.accent, 0.25))
  finPair(P, Math.floor(P.n * 0.6), P.maxW * 1.5, P.maxW * 1.1, hexA(shade(s.color, -24), 0.85))
  fillBody(P, { head: shade(s.color, 10), rimA: 0.16 })
  // tall dorsal
  const d = P.mid[Math.floor(P.n * 0.34)]
  const [dx1, dy1] = norm(d.ang, P.up)
  const dfx = Math.cos(d.ang), dfy = Math.sin(d.ang)
  ctx.fillStyle = shade(s.color, -18)
  ctx.beginPath()
  ctx.moveTo(d.x + dx1 * d.w * 0.8 - dfx * d.w, d.y + dy1 * d.w * 0.8 - dfy * d.w)
  ctx.lineTo(d.x + dx1 * (d.w + P.maxW * 2.3) + dfx * d.w * 0.4, d.y + dy1 * (d.w + P.maxW * 2.3) + dfy * d.w * 0.4)
  ctx.lineTo(d.x + dx1 * d.w * 0.8 + dfx * d.w * 2.2, d.y + dy1 * d.w * 0.8 + dfy * d.w * 2.2)
  ctx.closePath()
  ctx.fill()
  // gill slits and the bone plates it is named for
  ctx.strokeStyle = 'rgba(20,30,40,0.55)'
  ctx.lineWidth = 1.6
  for (let i = 3; i < 8; i++) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.7, m.y + ny * m.w * 0.7)
    ctx.lineTo(m.x - nx * m.w * 0.2, m.y - ny * m.w * 0.2)
    ctx.stroke()
  }
  ctx.strokeStyle = hexA(s.accent, 0.35)
  ctx.lineWidth = 2
  for (let i = 8; i < P.n - 3; i += 2) {
    const m = P.mid[i]
    ctx.beginPath()
    ctx.arc(m.x, m.y, m.w * 0.95, m.ang + 0.7, m.ang - 0.7)
    ctx.stroke()
  }
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.3 + player.maw * 0.6
    // the classic under-slung shark grin, tucked beneath the snout
    ctx.fillStyle = '#0a0f14'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.6, b * 0.1)
    ctx.quadraticCurveTo(-b * 0.6, b * (0.45 + open), -b * 1.9, b * 0.3)
    ctx.quadraticCurveTo(-b * 0.6, b * 0.15, P.noseW * 0.6, b * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#f4ffff'
    for (let i = 0; i < 7; i++) {
      const tx = P.noseW * 0.3 - i * b * 0.3
      const th = b * (0.1 + open * 0.28) * (1 - i * 0.08)
      ctx.beginPath()
      ctx.moveTo(tx, b * 0.18)
      ctx.lineTo(tx - b * 0.09, b * 0.18 + th)
      ctx.lineTo(tx + b * 0.09, b * 0.18 + th * 0.8)
      ctx.closePath()
      ctx.fill()
    }
    eyeAt(-b * 0.7, -b * 0.42, b * 0.2, '#05090d', '#dff3ff')
  })
}

// ---- Stage 8 · Leviathan -----------------------------------------------
function drawWhale(P) {
  const s = P.s
  const tl = P.tail
  const fx = Math.cos(tl.ang), fy = Math.sin(tl.ang)
  const [ux, uy] = norm(tl.ang, 1)
  // broad flukes
  ctx.fillStyle = shade(s.color, -34)
  for (const side of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(tl.x, tl.y)
    ctx.quadraticCurveTo(
      tl.x + fx * P.maxW * 0.9 + ux * side * P.maxW * 1.1, tl.y + fy * P.maxW * 0.9 + uy * side * P.maxW * 1.1,
      tl.x + fx * P.maxW * 1.9 + ux * side * P.maxW * 1.7, tl.y + fy * P.maxW * 1.9 + uy * side * P.maxW * 1.7
    )
    ctx.quadraticCurveTo(
      tl.x + fx * P.maxW * 1.5 + ux * side * P.maxW * 0.4, tl.y + fy * P.maxW * 1.5 + uy * side * P.maxW * 0.4,
      tl.x + fx * P.maxW * 0.5, tl.y + fy * P.maxW * 0.5
    )
    ctx.closePath()
    ctx.fill()
  }
  finPair(P, Math.floor(P.n * 0.3), P.maxW * 3.2, P.maxW * 2.8, hexA(shade(s.color, -20), 0.88))
  // no rim stroke: at this bulk the offset outline self-overlaps on a turn and
  // the stroke would draw creases across the body
  fillBody(P, { head: shade(s.color, 14), rim: false })
  // dorsal hump
  const d = P.mid[Math.floor(P.n * 0.4)]
  const [dx1, dy1] = norm(d.ang, P.up)
  ctx.fillStyle = shade(s.color, -8)
  ctx.beginPath()
  ctx.moveTo(d.x + dx1 * d.w, d.y + dy1 * d.w)
  ctx.quadraticCurveTo(d.x + dx1 * (d.w + P.maxW * 1.2), d.y + dy1 * (d.w + P.maxW * 1.2),
    P.mid[Math.floor(P.n * 0.52)].x + dx1 * d.w * 0.6, P.mid[Math.floor(P.n * 0.52)].y + dy1 * d.w * 0.6)
  ctx.closePath()
  ctx.fill()
  // barnacle crusting and old scars
  for (let i = 2; i < P.n - 4; i += 2) {
    const m = P.mid[i]
    const h = hash1(i * 3.7)
    if (h < 0.5) continue
    const [nx, ny] = norm(m.ang, P.up)
    const bx = m.x + nx * m.w * (h - 0.2), by = m.y + ny * m.w * (h - 0.2)
    ctx.fillStyle = 'rgba(220,225,235,0.35)'
    ctx.beginPath(); ctx.arc(bx, by, m.w * 0.16, 0, TAU); ctx.fill()
    ctx.fillStyle = 'rgba(240,245,255,0.6)'
    ctx.beginPath(); ctx.arc(bx, by, m.w * 0.06, 0, TAU); ctx.fill()
  }
  ctx.strokeStyle = 'rgba(230,240,255,0.22)'
  ctx.lineWidth = 2
  for (let i = 4; i < P.n - 4; i += 5) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, -P.up)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.2, m.y + ny * m.w * 0.2)
    ctx.lineTo(m.x + nx * m.w * 0.9, m.y + ny * m.w * 0.9)
    ctx.stroke()
  }
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.18 + player.maw * 0.55
    // a jaw that runs half the head
    ctx.fillStyle = '#0b0a1a'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.7, b * 0.05)
    ctx.quadraticCurveTo(-b * 0.5, b * (0.3 + open * 1.2), -b * 1.5, b * (0.2 + open * 0.5))
    ctx.quadraticCurveTo(-b * 0.6, b * 0.1, P.noseW * 0.7, b * 0.05)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#eef4ff'
    for (let i = 0; i < 7; i++) {
      const tx = P.noseW * 0.3 - i * b * 0.24
      ctx.beginPath()
      ctx.moveTo(tx, b * 0.12)
      ctx.lineTo(tx - b * 0.07, b * (0.12 + open * 0.55))
      ctx.lineTo(tx + b * 0.07, b * (0.12 + open * 0.45))
      ctx.closePath()
      ctx.fill()
    }
    eyeAt(-b * 0.85, -b * 0.45, b * 0.2, '#0a0512', '#ff6aa8')
  })
}

// ---- Stage 9 · The Kraken (and 10 · The Drowned God) -------------------
// A real cephalopod: mantle behind, arm crown in front, two long clubbed
// feeding tentacles, a beak in the middle of the ring.
function drawCephalopod(P, o) {
  const s = P.s
  const dark = shade(s.color, -46)
  const lit = shade(s.color, 22)
  const rim = hexA(s.accent, 0.45)
  const crownX = P.hx + Math.cos(P.headA) * P.maxW * 0.35
  const crownY = P.hy + Math.sin(P.headA) * P.maxW * 0.35
  const grab = player.maw * 0.5 + (player.flash > 0 ? 0.2 : 0)

  // --- arms: half behind the mantle, half in front, so the crown has depth ---
  const arms = []
  for (let k = 0; k < o.arms; k++) {
    const f = k / (o.arms - 1) - 0.5                       // -0.5 .. 0.5
    const a = P.headA + f * o.spread + Math.sin(P.t * 1.5 + k * 1.3) * 0.09
    const len = P.maxW * o.armLen * (0.78 + 0.4 * (1 - Math.abs(f) * 1.6)) * (1 - grab * 0.25)
    const curl = (f >= 0 ? 1 : -1) * (0.55 + Math.abs(f) * 1.3 + grab * 1.4) + Math.sin(P.t * 1.1 + k * 2.1) * 0.45
    arms.push({ a, len, curl, k, behind: k % 2 === 0 })
  }
  const drawArm = (arm) => {
    const pts = limbPts(crownX, crownY, arm.a, arm.len, P.maxW * o.armW, arm.curl, P.t * 2 + arm.k)
    fillLimb(pts, arm.behind ? dark : s.color, rim, hexA(s.accent, 0.35))
  }
  arms.filter((a) => a.behind).forEach(drawArm)

  // --- mantle ---
  // the two rhomboid fins ride near the pointed tip
  const fm = P.mid[Math.floor(P.n * 0.8)]
  const ffx = Math.cos(fm.ang), ffy = Math.sin(fm.ang)
  ctx.fillStyle = hexA(s.color, 0.75)
  for (const side of [1, -1]) {
    const [nx, ny] = norm(fm.ang, side)
    ctx.beginPath()
    ctx.moveTo(fm.x + nx * fm.w * 0.6 - ffx * P.maxW * 1.4, fm.y + ny * fm.w * 0.6 - ffy * P.maxW * 1.4)
    ctx.quadraticCurveTo(
      fm.x + nx * P.maxW * 1.9, fm.y + ny * P.maxW * 1.9,
      fm.x + nx * P.maxW * 1.0 + ffx * P.maxW * 1.9, fm.y + ny * P.maxW * 1.0 + ffy * P.maxW * 1.9
    )
    ctx.lineTo(fm.x + ffx * P.maxW * 1.7, fm.y + ffy * P.maxW * 1.7)
    ctx.closePath()
    ctx.fill()
  }
  fillBody(P, { head: lit, tailCol: dark, rimA: 0.4 })
  // chromatophore speckle
  for (let i = 2; i < P.n - 1; i++) {
    const m = P.mid[i]
    for (let j = 0; j < 3; j++) {
      const h = hash1(i * 9.7 + j * 3.3)
      const h2 = hash1(i * 4.1 + j * 7.9)
      const [nx, ny] = norm(m.ang, 1)
      const off = (h2 - 0.5) * 1.7 * m.w
      ctx.fillStyle = hexA(s.accent, 0.10 + 0.16 * Math.abs(Math.sin(P.t * 0.8 + i + j)))
      ctx.beginPath()
      ctx.arc(m.x + nx * off, m.y + ny * off, Math.max(1, m.w * (0.06 + h * 0.09)), 0, TAU)
      ctx.fill()
    }
  }

  // --- feeding tentacles: longer, thinner, with a paddle club ---
  for (const side of [-1, 1]) {
    const a = P.headA + side * o.spread * 0.28 + Math.sin(P.t * 1.9 + side) * 0.12
    const len = P.maxW * o.armLen * 1.75 * (1 - grab * 0.3)
    const curl = side * (0.35 + grab * 1.2) + Math.sin(P.t * 1.4 + side * 2) * 0.5
    const pts = limbPts(crownX, crownY, a, len, P.maxW * o.armW * 0.42, curl, P.t * 2.2 + side, 13)
    fillLimb(pts, s.color, rim, null)
    const tip = pts[pts.length - 1]
    const prev = pts[pts.length - 3]
    const ta = Math.atan2(tip.y - prev.y, tip.x - prev.x)
    ctx.save()
    ctx.translate(tip.x, tip.y)
    ctx.rotate(ta)
    ctx.fillStyle = lit
    ctx.beginPath(); ctx.ellipse(-P.maxW * 0.25, 0, P.maxW * 0.55, P.maxW * 0.26, 0, 0, TAU); ctx.fill()
    ctx.fillStyle = hexA(s.accent, 0.5)
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.arc(-P.maxW * 0.6 + i * P.maxW * 0.22, 0, P.maxW * 0.07, 0, TAU); ctx.fill()
    }
    ctx.restore()
  }

  arms.filter((a) => !a.behind).forEach(drawArm)

  // --- head: eyes and beak ---
  headSpace(P, () => {
    const w = P.maxW
    // the eyes sit on the sides of the head, below the mantle
    for (const sgn of [-1, 1]) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const g = ctx.createRadialGradient(w * 0.05, sgn * w * 0.82, 0, w * 0.05, sgn * w * 0.82, w * 1.5)
      g.addColorStop(0, hexA(s.accent, 0.5)); g.addColorStop(1, hexA(s.accent, 0))
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(w * 0.05, sgn * w * 0.82, w * 1.5, 0, TAU); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#f6e9c8'
      ctx.beginPath(); ctx.ellipse(w * 0.05, sgn * w * 0.82, w * 0.46, w * 0.4, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = '#0a0410'
      ctx.beginPath(); ctx.ellipse(w * 0.18, sgn * w * 0.82, w * 0.1, w * 0.28, 0, 0, TAU); ctx.fill()
    }
    if (o.thirdEye) {
      ctx.fillStyle = '#f6e9c8'
      ctx.beginPath(); ctx.ellipse(w * 0.25, 0, w * 0.3, w * 0.26, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = '#0a0410'
      ctx.beginPath(); ctx.ellipse(w * 0.33, 0, w * 0.07, w * 0.19, 0, 0, TAU); ctx.fill()
    }
    // beak in the middle of the arm ring
    const gape = w * (0.28 + player.maw * 0.45)
    ctx.fillStyle = '#14070f'
    ctx.beginPath()
    ctx.moveTo(w * 1.15, -gape * 0.2)
    ctx.lineTo(w * 0.2, -gape)
    ctx.lineTo(w * 0.15, 0)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(w * 1.1, gape * 0.2)
    ctx.lineTo(w * 0.2, gape)
    ctx.lineTo(w * 0.15, 0)
    ctx.closePath()
    ctx.fill()
  })

  if (o.crown) drawGodCrown(P)
}

function drawKraken(P) {
  drawCephalopod(P, { arms: 8, spread: 2.5, armLen: 6.2, armW: 0.30 })
}

function drawGod(P) {
  const s = P.s
  // a slow halo of sigils turning behind the whole thing
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const R = P.maxW * 5.4
  ctx.strokeStyle = hexA(s.accent, 0.22)
  ctx.lineWidth = 2
  for (let i = 0; i < 9; i++) {
    const a0 = P.t * 0.25 + (i / 9) * TAU
    ctx.beginPath(); ctx.arc(P.hx, P.hy, R, a0, a0 + 0.24); ctx.stroke()
    ctx.beginPath(); ctx.arc(P.hx, P.hy, R * 0.78, -a0 * 1.4, -a0 * 1.4 + 0.16); ctx.stroke()
  }
  ctx.restore()
  drawCephalopod(P, { arms: 12, spread: 3.1, armLen: 6.6, armW: 0.26, thirdEye: true, crown: true })
}

function drawGodCrown(P) {
  const s = P.s
  // a mitre of horns rising off the mantle
  const m = P.mid[Math.floor(P.n * 0.24)]
  const [nx, ny] = norm(m.ang, P.up)
  const fx = Math.cos(m.ang), fy = Math.sin(m.ang)
  ctx.fillStyle = hexA(s.accent, 0.8)
  for (let i = -2; i <= 2; i++) {
    const h = P.maxW * (1.5 - Math.abs(i) * 0.3)
    const bx = m.x + fx * i * P.maxW * 0.55, by = m.y + fy * i * P.maxW * 0.55
    ctx.beginPath()
    ctx.moveTo(bx + nx * m.w * 0.8 - fx * P.maxW * 0.2, by + ny * m.w * 0.8 - fy * P.maxW * 0.2)
    ctx.lineTo(bx + nx * (m.w + h), by + ny * (m.w + h))
    ctx.lineTo(bx + nx * m.w * 0.8 + fx * P.maxW * 0.2, by + ny * m.w * 0.8 + fy * P.maxW * 0.2)
    ctx.closePath()
    ctx.fill()
  }
}

// ---- The sky evolutions ------------------------------------------------
// A pair of wings hung off the spine at `at` (fraction down the body): one
// far wing (small, dark) and one near wing (full size) rising from the back,
// swept toward the tail. They beat hard in the air, idle slowly underwater.
function drawWingPair(P, at, len, col, rim) {
  const i0 = Math.floor(P.n * at)
  const i1 = Math.min(P.n - 1, i0 + Math.max(2, Math.floor(P.n * 0.2)))
  const m = P.mid[i0]
  const m2 = P.mid[i1]
  const flying = player.airborne
  const flap = Math.sin(P.t * (flying ? 8 : 2.2)) * (flying ? 0.5 : 0.16)
  const [ux, uy] = norm(m.ang, P.up) // dorsal unit
  const dorsalA = Math.atan2(uy, ux)
  const fx = Math.cos(m.ang), fy = Math.sin(m.ang)
  const wings = [
    { rot: 0.55, s: 0.68, c: hexA(shade(P.s.color, -55), 0.9), far: true },
    { rot: -0.12, s: 1.0, c: col, far: false },
  ]
  for (const w of wings) {
    const a = dorsalA + P.up * (w.rot - flap * (w.far ? 0.7 : 1))
    const reach = len * w.s
    const tipX = m.x + Math.cos(a) * reach - fx * reach * 0.28
    const tipY = m.y + Math.sin(a) * reach - fy * reach * 0.28
    const baseFX = m.x + fx * m.w * 1.1  // leading-edge root, ahead of the anchor
    const baseFY = m.y + fy * m.w * 1.1
    ctx.beginPath()
    ctx.moveTo(baseFX, baseFY)
    ctx.quadraticCurveTo(
      m.x + Math.cos(a) * reach * 0.7 + fx * reach * 0.12,
      m.y + Math.sin(a) * reach * 0.7 + fy * reach * 0.12,
      tipX, tipY
    )
    // trailing edge scallops back to the spine further down the body
    ctx.quadraticCurveTo(
      (tipX + m2.x) / 2 - Math.cos(a) * reach * 0.16,
      (tipY + m2.y) / 2 - Math.sin(a) * reach * 0.16,
      m2.x, m2.y
    )
    ctx.closePath()
    ctx.fillStyle = w.c
    ctx.fill()
    if (!w.far) {
      if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = 1.2; ctx.stroke() }
      // wing fingers fanning from the root to the trailing edge
      ctx.strokeStyle = rim || hexA(P.s.accent, 0.4)
      ctx.lineWidth = 1
      for (let f = 1; f <= 3; f++) {
        const k = f / 4
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(tipX + (m2.x - tipX) * k, tipY + (m2.y - tipY) * k)
        ctx.stroke()
      }
    }
  }
}

// Stage 11 · Stormbringer — the first thing you become that the sky will hold
function drawWyrm(P) {
  const s = P.s
  drawWingPair(P, 0.26, P.maxW * 5.2, hexA(s.color, 0.85), hexA(s.accent, 0.5))
  // storm crest down the spine
  ctx.fillStyle = hexA(s.accent, 0.5)
  for (let i = 2; i < P.n - 2; i += 2) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    const fx = Math.cos(m.ang), fy = Math.sin(m.ang)
    const h = m.w * (1.1 + Math.sin(i * 0.8 + P.t * 3) * 0.2)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.85 - fx * m.w * 0.5, m.y + ny * m.w * 0.85 - fy * m.w * 0.5)
    ctx.lineTo(m.x + nx * (m.w + h), m.y + ny * (m.w + h))
    ctx.lineTo(m.x + nx * m.w * 0.85 + fx * m.w * 0.5, m.y + ny * m.w * 0.85 + fy * m.w * 0.5)
    ctx.closePath()
    ctx.fill()
  }
  // forked tail streamer
  {
    const tl = P.tail
    const fx = Math.cos(tl.ang), fy = Math.sin(tl.ang)
    const [ux, uy] = norm(tl.ang, 1)
    ctx.strokeStyle = hexA(s.accent, 0.6)
    ctx.lineWidth = 2
    for (const sd of [1, -1]) {
      ctx.beginPath()
      ctx.moveTo(tl.x, tl.y)
      ctx.quadraticCurveTo(
        tl.x + fx * P.maxW * 2 + ux * sd * P.maxW * 1.4, tl.y + fy * P.maxW * 2 + uy * sd * P.maxW * 1.4,
        tl.x + fx * P.maxW * 3.6 + ux * sd * P.maxW * 0.8, tl.y + fy * P.maxW * 3.6 + uy * sd * P.maxW * 0.8
      )
      ctx.stroke()
    }
  }
  fillBody(P)
  // static crackle running the body
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.strokeStyle = hexA(s.accent, 0.22 + 0.2 * Math.abs(Math.sin(P.t * 7)))
  ctx.lineWidth = 1.2
  for (let i = 3; i < P.n - 3; i += 5) {
    const m = P.mid[i]
    const h = hash1(i * 3.1 + Math.floor(P.t * 6))
    if (h < 0.72) continue
    const [nx, ny] = norm(m.ang, h > 0.75 ? 1 : -1)
    ctx.beginPath()
    ctx.moveTo(m.x, m.y)
    ctx.lineTo(m.x + nx * m.w * 1.9 + (h - 0.5) * 8, m.y + ny * m.w * 1.9)
    ctx.stroke()
  }
  ctx.restore()
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.3 + player.maw * 0.6
    // swept storm-horns
    ctx.fillStyle = hexA(s.accent, 0.85)
    for (const sgn of [-1.05, -0.55]) {
      ctx.beginPath()
      ctx.moveTo(-b * 0.4, sgn * b * 0.5)
      ctx.quadraticCurveTo(-b * 2.2, sgn * b * 2.0, -b * 3.3, sgn * b * 1.7)
      ctx.quadraticCurveTo(-b * 2.0, sgn * b * 1.2, -b * 0.75, sgn * b * 0.25)
      ctx.closePath()
      ctx.fill()
    }
    ctx.fillStyle = '#0a1420'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.8, 0)
    ctx.quadraticCurveTo(-b * 0.7, -b * open * 1.4, -b * 1.9, -b * 0.2)
    ctx.lineTo(-b * 1.9, b * 0.2)
    ctx.quadraticCurveTo(-b * 0.7, b * open * 1.4, P.noseW * 0.8, 0)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#f2ffff'
    ctx.lineWidth = 1.5
    for (let i = 0; i < 4; i++) {
      const tx = P.noseW * 0.5 - i * b * 0.4
      ctx.beginPath(); ctx.moveTo(tx, -b * open); ctx.lineTo(tx - 1.5, -b * open * 0.2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(tx - b * 0.14, b * open); ctx.lineTo(tx - b * 0.26, b * open * 0.2); ctx.stroke()
    }
    eyeAt(-b * 0.75, -b * 0.55, b * 0.28, '#081018', s.accent)
  })
}

// Stage 12 · Cloud Devourer — a whale that grazes on weather
function drawSkywhale(P) {
  const s = P.s
  // it trails its own cloudbank
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = Math.floor(P.n * 0.5); i < P.n; i += 2) {
    const m = P.mid[i]
    const h = hash1(i * 4.7 + Math.floor(P.t * 2))
    ctx.fillStyle = `rgba(240,248,255,${0.05 + h * 0.06})`
    ctx.beginPath()
    ctx.arc(m.x + (h - 0.5) * m.w, m.y + (hash1(i * 9.1) - 0.5) * m.w * 2, m.w * (0.8 + h), 0, TAU)
    ctx.fill()
  }
  ctx.restore()
  drawWingPair(P, 0.30, P.maxW * 4.6, hexA(shade(s.color, -12), 0.92), hexA(s.accent, 0.4))
  // broad flukes
  const tl = P.tail
  const fx = Math.cos(tl.ang), fy = Math.sin(tl.ang)
  const [ux, uy] = norm(tl.ang, 1)
  ctx.fillStyle = shade(s.color, -30)
  for (const side of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(tl.x, tl.y)
    ctx.quadraticCurveTo(
      tl.x + fx * P.maxW * 0.9 + ux * side * P.maxW * 1.2, tl.y + fy * P.maxW * 0.9 + uy * side * P.maxW * 1.2,
      tl.x + fx * P.maxW * 2.0 + ux * side * P.maxW * 1.8, tl.y + fy * P.maxW * 2.0 + uy * side * P.maxW * 1.8
    )
    ctx.quadraticCurveTo(
      tl.x + fx * P.maxW * 1.5 + ux * side * P.maxW * 0.4, tl.y + fy * P.maxW * 1.5 + uy * side * P.maxW * 0.4,
      tl.x + fx * P.maxW * 0.5, tl.y + fy * P.maxW * 0.5
    )
    ctx.closePath()
    ctx.fill()
  }
  fillBody(P, { head: shade(s.color, 20), rim: false })
  // pale belly grooves
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'
  ctx.lineWidth = 1.6
  for (let i = 2; i < Math.floor(P.n * 0.6); i += 2) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, -P.up)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.35, m.y + ny * m.w * 0.35)
    ctx.lineTo(m.x + nx * m.w * 0.95, m.y + ny * m.w * 0.95)
    ctx.stroke()
  }
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.2 + player.maw * 0.8 + (player.gulpT > 0 ? 0.6 : 0)
    // a cavernous baleen mouth for straining whole flocks
    ctx.fillStyle = '#101625'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.7, -b * 0.05)
    ctx.quadraticCurveTo(-b * 0.4, -b * open, -b * 1.7, b * (0.1 - open * 0.2))
    ctx.quadraticCurveTo(-b * 0.5, b * (0.3 + open * 0.8), P.noseW * 0.7, b * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,248,230,0.7)'
    ctx.lineWidth = 1
    for (let i = 0; i < 8; i++) {
      const tx = P.noseW * 0.4 - i * b * 0.22
      ctx.beginPath()
      ctx.moveTo(tx, -b * open * 0.6)
      ctx.lineTo(tx - b * 0.05, b * (0.1 + open * 0.5))
      ctx.stroke()
    }
    eyeAt(-b * 0.9, -b * 0.4, b * 0.2, '#0a0f18', '#fff2c8')
  })
}

// Stage 13 · Star Serpent — a river of night sky with a mouth on one end
function drawStarserp(P) {
  const s = P.s
  // flowing ribbon fins
  ctx.beginPath()
  for (let i = 0; i < P.n; i++) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    const h = m.w + P.maxW * (1.2 + Math.sin(P.t * 2.4 + i * 0.4) * 0.5)
    const x = m.x + nx * h, y = m.y + ny * h
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
  }
  for (let i = P.n - 1; i >= 0; i--) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    ctx.lineTo(m.x + nx * m.w * 0.3, m.y + ny * m.w * 0.3)
  }
  ctx.closePath()
  ctx.fillStyle = hexA(s.color, 0.22)
  ctx.fill()
  fillBody(P, { head: shade(s.color, 26), tailCol: shade(s.color, -50), rimA: 0.55 })
  // a body full of stars
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 1; i < P.n - 1; i++) {
    const m = P.mid[i]
    for (let j = 0; j < 2; j++) {
      const h = hash1(i * 7.3 + j * 13.1)
      const h2 = hash1(i * 3.9 + j * 5.7)
      const [nx, ny] = norm(m.ang, 1)
      const off = (h2 - 0.5) * 1.5 * m.w
      const tw = 0.3 + 0.7 * Math.abs(Math.sin(P.t * (1 + h) * 2 + i + j * 3))
      ctx.fillStyle = `rgba(255,${230 + Math.round(h * 25)},${170 + Math.round(h2 * 60)},${tw * 0.8})`
      ctx.beginPath()
      ctx.arc(m.x + nx * off, m.y + ny * off, Math.max(0.8, m.w * (0.06 + h * 0.1)), 0, TAU)
      ctx.fill()
    }
  }
  // trailing stardust
  const tl = P.tail
  for (let i = 1; i <= 6; i++) {
    const h = hash1(i * 5.1 + Math.floor(P.t * 4))
    ctx.fillStyle = `rgba(255,233,168,${0.5 - i * 0.07})`
    ctx.beginPath()
    ctx.arc(tl.x + Math.cos(tl.ang) * i * P.maxW * 0.8 + (h - 0.5) * 10, tl.y + Math.sin(tl.ang) * i * P.maxW * 0.8 + (hash1(i * 9.7) - 0.5) * 12, Math.max(0.8, 3 - i * 0.4), 0, TAU)
    ctx.fill()
  }
  ctx.restore()
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.3 + player.maw * 0.6
    // antlers of light
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = hexA(s.accent, 0.8)
    ctx.lineWidth = 2
    for (const sgn of [-1, -0.55]) {
      ctx.beginPath()
      ctx.moveTo(-b * 0.4, sgn * b * 0.5)
      ctx.quadraticCurveTo(-b * 1.8, sgn * b * 2.4, -b * 3.0, sgn * b * 2.2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-b * 1.6, sgn * b * 1.7)
      ctx.lineTo(-b * 2.2, sgn * b * 2.8)
      ctx.stroke()
    }
    ctx.restore()
    ctx.fillStyle = '#0c0818'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.8, 0)
    ctx.quadraticCurveTo(-b * 0.7, -b * open * 1.3, -b * 1.8, -b * 0.2)
    ctx.lineTo(-b * 1.8, b * 0.2)
    ctx.quadraticCurveTo(-b * 0.7, b * open * 1.3, P.noseW * 0.8, 0)
    ctx.closePath()
    ctx.fill()
    eyeAt(-b * 0.7, -b * 0.5, b * 0.3, '#080414', s.accent)
  })
}

// Stage 14 · The Mooneater — not another kraken: a vast void-manta, a wing
// of night with a furnace of starlight for a mouth
function drawMooneater(P) {
  const s = P.s
  // orbiting star-sigil halo
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const R = P.maxW * 5.2
  ctx.strokeStyle = hexA(s.accent, 0.28)
  ctx.lineWidth = 2
  for (let i = 0; i < 11; i++) {
    const a0 = P.t * 0.3 + (i / 11) * TAU
    ctx.beginPath(); ctx.arc(P.hx, P.hy, R, a0, a0 + 0.2); ctx.stroke()
    ctx.beginPath(); ctx.arc(P.hx, P.hy, R * 0.74, -a0 * 1.3, -a0 * 1.3 + 0.14); ctx.stroke()
  }
  for (let i = 0; i < 5; i++) {
    const a = P.t * 0.5 + (i / 5) * TAU
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(P.t * 3 + i * 2))
    ctx.fillStyle = `rgba(255,240,200,${tw * 0.7})`
    ctx.beginPath(); ctx.arc(P.hx + Math.cos(a) * R * 0.88, P.hy + Math.sin(a) * R * 0.88, 2.5, 0, TAU); ctx.fill()
  }
  ctx.restore()

  // the great wing-fins, one to each side of the disc, beating slow
  const wm = P.mid[Math.floor(P.n * 0.34)]
  const wm2 = P.mid[Math.min(P.n - 1, Math.floor(P.n * 0.62))]
  const flap = Math.sin(P.t * (player.airborne ? 5 : 2)) * 0.35
  const wfx = Math.cos(wm.ang), wfy = Math.sin(wm.ang)
  for (const side of [1, -1]) {
    const [nx, ny] = norm(wm.ang, side)
    const span = P.maxW * (3.9 + flap * side * 0.9)
    const tipX = wm.x + nx * span - wfx * span * 0.35
    const tipY = wm.y + ny * span - wfy * span * 0.35
    ctx.beginPath()
    ctx.moveTo(wm.x + wfx * wm.w * 0.9, wm.y + wfy * wm.w * 0.9)
    ctx.quadraticCurveTo(wm.x + nx * span * 0.75 + wfx * span * 0.2, wm.y + ny * span * 0.75 + wfy * span * 0.2, tipX, tipY)
    ctx.quadraticCurveTo((tipX + wm2.x) / 2 - wfx * span * 0.15, (tipY + wm2.y) / 2 - wfy * span * 0.15, wm2.x, wm2.y)
    ctx.closePath()
    ctx.fillStyle = side === 1 ? hexA(shade(s.color, 26), 0.92) : hexA(shade(s.color, -34), 0.9)
    ctx.fill()
    ctx.strokeStyle = hexA(s.accent, 0.35)
    ctx.lineWidth = 1.2
    ctx.stroke()
  }

  fillBody(P, { head: shade(s.color, 30), tailCol: shade(s.color, -40), rimA: 0.45 })

  // a hide full of constellations
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 1; i < P.n - 1; i++) {
    const m = P.mid[i]
    for (let j = 0; j < 2; j++) {
      const h = hash1(i * 6.7 + j * 11.3)
      const h2 = hash1(i * 3.1 + j * 7.7)
      const [nx, ny] = norm(m.ang, 1)
      const off = (h2 - 0.5) * 1.5 * m.w
      const tw = 0.3 + 0.7 * Math.abs(Math.sin(P.t * (1 + h) * 2 + i * 2 + j))
      ctx.fillStyle = `rgba(190,240,255,${tw * 0.7})`
      ctx.beginPath()
      ctx.arc(m.x + nx * off, m.y + ny * off, Math.max(0.8, m.w * (0.05 + h * 0.08)), 0, TAU)
      ctx.fill()
    }
  }
  // twin tail streamers
  const tl = P.tail
  ctx.strokeStyle = hexA(s.accent, 0.55)
  ctx.lineWidth = 2
  for (const sd of [1, -1]) {
    const [ux, uy] = norm(tl.ang, sd)
    ctx.beginPath()
    ctx.moveTo(tl.x, tl.y)
    ctx.quadraticCurveTo(
      tl.x + Math.cos(tl.ang) * P.maxW * 2.4 + ux * P.maxW * (0.8 + Math.sin(P.t * 2 + sd) * 0.4),
      tl.y + Math.sin(tl.ang) * P.maxW * 2.4 + uy * P.maxW * (0.8 + Math.sin(P.t * 2 + sd) * 0.4),
      tl.x + Math.cos(tl.ang) * P.maxW * 4.6, tl.y + Math.sin(tl.ang) * P.maxW * 4.6
    )
    ctx.stroke()
  }
  ctx.restore()

  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.35 + player.maw * 0.65
    // cephalic horns curling forward around the maw
    ctx.fillStyle = hexA(shade(s.color, 40), 0.95)
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(b * 0.15, sgn * b * 0.55)
      ctx.quadraticCurveTo(b * 1.15, sgn * b * 0.85, b * 1.45, sgn * b * 0.3)
      ctx.quadraticCurveTo(b * 1.0, sgn * b * 0.45, b * 0.35, sgn * b * 0.28)
      ctx.closePath()
      ctx.fill()
    }
    // the maw: a slot of swallowed starlight
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(b * 0.75, 0, 0, b * 0.75, 0, b * 1.1)
    g.addColorStop(0, hexA(s.accent, 0.75))
    g.addColorStop(1, hexA(s.accent, 0))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(b * 0.75, 0, b * 1.1, 0, TAU); ctx.fill()
    ctx.restore()
    ctx.fillStyle = '#05030c'
    ctx.beginPath()
    ctx.ellipse(b * 0.75, 0, b * 0.5, b * open * 0.55, 0, 0, TAU)
    ctx.fill()
    ctx.fillStyle = hexA(s.accent, 0.9)
    for (let i = 0; i < 5; i++) {
      const ta = (i / 5) * TAU + P.t * 0.6
      ctx.beginPath()
      ctx.arc(b * 0.75 + Math.cos(ta) * b * 0.34, Math.sin(ta) * b * open * 0.36, b * 0.05, 0, TAU)
      ctx.fill()
    }
    // eyes wide apart on the leading edge, and the third above the maw
    for (const sgn of [-1, 1]) eyeAt(-b * 0.1, sgn * b * 0.72, b * 0.2, '#f6e9c8', '#0a0410')
    eyeAt(b * 0.2, -b * 0.16, b * 0.13, '#f6e9c8', '#0a0410')
  })
}

// Stage 15 · The Magmaw — a serpent of cooling stone with a lit furnace inside
function drawMagmaw(P) {
  const s = P.s
  fillBody(P, { head: shade(s.color, 14), tailCol: shade(s.color, -40), rimA: 0.2 })
  // molten seams glowing between the plates
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 2; i < P.n - 1; i += 2) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, 1)
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(P.t * 2 + i * 0.7))
    ctx.strokeStyle = hexA(s.accent, 0.5 * pulse)
    ctx.lineWidth = 2.4
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.85, m.y + ny * m.w * 0.85)
    ctx.lineTo(m.x - nx * m.w * 0.85, m.y - ny * m.w * 0.85)
    ctx.stroke()
  }
  ctx.restore()
  // basalt plates riding the back
  ctx.fillStyle = shade(s.color, -46)
  for (let i = 1; i < P.n - 2; i += 2) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    const fx = Math.cos(m.ang), fy = Math.sin(m.ang)
    const h = m.w * (0.8 + hash1(i * 3.7) * 0.5)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.8 - fx * m.w * 0.8, m.y + ny * m.w * 0.8 - fy * m.w * 0.8)
    ctx.lineTo(m.x + nx * (m.w + h), m.y + ny * (m.w + h))
    ctx.lineTo(m.x + nx * m.w * 0.8 + fx * m.w * 0.8, m.y + ny * m.w * 0.8 + fy * m.w * 0.8)
    ctx.closePath()
    ctx.fill()
  }
  // embers shed in the wake
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 5; i++) {
    const f = ((P.t * 0.6 + i * 0.2) % 1)
    const m = P.mid[Math.min(P.n - 1, Math.floor(P.n * (0.5 + f * 0.5)))]
    ctx.fillStyle = `rgba(255,179,71,${(1 - f) * 0.6})`
    ctx.beginPath()
    ctx.arc(m.x + (hash1(i * 7.7) - 0.5) * m.w * 2, m.y + (hash1(i * 3.1) - 0.5) * m.w * 2 - f * 20, 2.4, 0, TAU)
    ctx.fill()
  }
  ctx.restore()
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.35 + player.maw * 0.7
    // furnace glow spilling out of the jaw
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(-b * 0.4, 0, 0, -b * 0.4, 0, b * 1.6)
    g.addColorStop(0, hexA(s.accent, 0.7 * (0.5 + open * 0.5)))
    g.addColorStop(1, hexA(s.accent, 0))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(-b * 0.4, 0, b * 1.6, 0, TAU); ctx.fill()
    ctx.restore()
    ctx.fillStyle = '#180804'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.85, 0)
    ctx.quadraticCurveTo(-b * 0.6, -b * open * 1.3, -b * 1.9, -b * 0.25)
    ctx.lineTo(-b * 1.9, b * 0.25)
    ctx.quadraticCurveTo(-b * 0.6, b * open * 1.3, P.noseW * 0.85, 0)
    ctx.closePath()
    ctx.fill()
    // jagged basalt teeth
    ctx.fillStyle = '#4a3a34'
    for (let i = 0; i < 5; i++) {
      const tx = P.noseW * 0.5 - i * b * 0.4
      ctx.beginPath()
      ctx.moveTo(tx, -b * open)
      ctx.lineTo(tx - b * 0.1, -b * open * 0.2)
      ctx.lineTo(tx - b * 0.2, -b * open * 0.9)
      ctx.closePath(); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(tx - b * 0.1, b * open)
      ctx.lineTo(tx - b * 0.2, b * open * 0.2)
      ctx.lineTo(tx - b * 0.3, b * open * 0.9)
      ctx.closePath(); ctx.fill()
    }
    eyeAt(-b * 0.7, -b * 0.55, b * 0.24, '#1c0a06', s.accent)
  })
}

// Stage 16 · Obsidian Colossus — volcanic glass with a grudge
function drawObsidian(P) {
  const s = P.s
  fillBody(P, { head: shade(s.color, 16), tailCol: shade(s.color, -20), rim: false })
  // shard rows: angular glass fins down the back and flanks
  for (const side of [P.up, -P.up]) {
    for (let i = 1; i < P.n - 2; i += 2) {
      const m = P.mid[i]
      const [nx, ny] = norm(m.ang, side)
      const fx = Math.cos(m.ang), fy = Math.sin(m.ang)
      const h = m.w * (side === P.up ? 1.3 : 0.5) * (0.7 + hash1(i * 5.1) * 0.6)
      ctx.fillStyle = hexA(shade(s.color, 30), 0.95)
      ctx.beginPath()
      ctx.moveTo(m.x + nx * m.w * 0.85 - fx * m.w * 0.55, m.y + ny * m.w * 0.85 - fy * m.w * 0.55)
      ctx.lineTo(m.x + nx * (m.w + h) - fx * m.w * 0.1, m.y + ny * (m.w + h) - fy * m.w * 0.1)
      ctx.lineTo(m.x + nx * m.w * 0.85 + fx * m.w * 0.45, m.y + ny * m.w * 0.85 + fy * m.w * 0.45)
      ctx.closePath()
      ctx.fill()
      // hot fracture line up each shard
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.strokeStyle = hexA(s.accent, 0.4 * (0.5 + 0.5 * Math.sin(P.t * 2.4 + i)))
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(m.x + nx * m.w * 0.9, m.y + ny * m.w * 0.9)
      ctx.lineTo(m.x + nx * (m.w + h * 0.85), m.y + ny * (m.w + h * 0.85))
      ctx.stroke()
      ctx.restore()
    }
  }
  // glassy glints along the hull
  ctx.strokeStyle = 'rgba(220,230,255,0.16)'
  ctx.lineWidth = 1.4
  for (let i = 3; i < P.n - 3; i += 3) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, -P.up)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.2, m.y + ny * m.w * 0.2)
    ctx.lineTo(m.x + nx * m.w * 0.8, m.y + ny * m.w * 0.8)
    ctx.stroke()
  }
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.25 + player.maw * 0.6
    // an underslung jaw of chisel teeth
    ctx.fillStyle = '#0c0a12'
    ctx.beginPath()
    ctx.moveTo(P.noseW * 0.7, b * 0.1)
    ctx.quadraticCurveTo(-b * 0.5, b * (0.5 + open), -b * 1.8, b * 0.3)
    ctx.quadraticCurveTo(-b * 0.6, b * 0.12, P.noseW * 0.7, b * 0.1)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#cfd6e2'
    for (let i = 0; i < 6; i++) {
      const tx = P.noseW * 0.4 - i * b * 0.32
      const th = b * (0.14 + open * 0.3) * (1 - i * 0.08)
      ctx.beginPath()
      ctx.moveTo(tx, b * 0.16)
      ctx.lineTo(tx - b * 0.12, b * 0.16 + th)
      ctx.lineTo(tx + b * 0.06, b * 0.16 + th * 0.75)
      ctx.closePath()
      ctx.fill()
    }
    // a single furnace eye behind a glass brow
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(-b * 0.6, -b * 0.42, 0, -b * 0.6, -b * 0.42, b * 0.9)
    g.addColorStop(0, hexA(s.accent, 0.8))
    g.addColorStop(1, hexA(s.accent, 0))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(-b * 0.6, -b * 0.42, b * 0.9, 0, TAU); ctx.fill()
    ctx.restore()
    eyeAt(-b * 0.6, -b * 0.42, b * 0.22, '#2a0c06', s.accent)
  })
}

// Stage 17 · The Worldeater — at this point, mostly mouth
function drawWorldeater(P) {
  const s = P.s
  // a ring of orbiting rubble — pieces of everything already eaten
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const R = P.maxW * 4.4
  for (let i = 0; i < 9; i++) {
    const a = P.t * 0.4 + (i / 9) * TAU
    const rr = R * (0.85 + hash1(i * 3.3) * 0.3)
    ctx.fillStyle = `rgba(255,209,102,${0.25 + 0.2 * Math.abs(Math.sin(P.t * 2 + i))})`
    ctx.beginPath()
    ctx.arc(P.hx + Math.cos(a) * rr, P.hy + Math.sin(a) * rr * 0.8, 2 + hash1(i * 7.1) * 3.5, 0, TAU)
    ctx.fill()
  }
  ctx.restore()
  ctx.fillStyle = 'rgba(80,50,30,0.8)'
  for (let i = 0; i < 6; i++) {
    const a = P.t * 0.4 + (i / 6) * TAU + 0.4
    ctx.beginPath()
    ctx.arc(P.hx + Math.cos(a) * R * 0.95, P.hy + Math.sin(a) * R * 0.78, 4 + hash1(i * 5.7) * 5, 0, TAU)
    ctx.fill()
  }

  fillBody(P, { head: shade(s.color, 24), tailCol: shade(s.color, -30), rim: false })
  // ridge spines marching down the whole hull
  ctx.fillStyle = hexA(s.accent, 0.7)
  for (let i = 1; i < P.n - 1; i += 2) {
    const m = P.mid[i]
    const [nx, ny] = norm(m.ang, P.up)
    const fx = Math.cos(m.ang), fy = Math.sin(m.ang)
    const h = m.w * (0.5 + hash1(i * 2.9) * 0.35)
    ctx.beginPath()
    ctx.moveTo(m.x + nx * m.w * 0.9 - fx * m.w * 0.4, m.y + ny * m.w * 0.9 - fy * m.w * 0.4)
    ctx.lineTo(m.x + nx * (m.w + h), m.y + ny * (m.w + h))
    ctx.lineTo(m.x + nx * m.w * 0.9 + fx * m.w * 0.4, m.y + ny * m.w * 0.9 + fy * m.w * 0.4)
    ctx.closePath()
    ctx.fill()
  }
  // deep molten furrows across the flank
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (let i = 3; i < P.n - 2; i += 3) {
    const m = P.mid[i]
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(P.t * 1.6 + i))
    ctx.strokeStyle = hexA(s.accent, 0.35 * pulse)
    ctx.lineWidth = 2.6
    ctx.beginPath()
    ctx.arc(m.x, m.y, m.w * 0.85, m.ang + 0.8, m.ang - 0.8)
    ctx.stroke()
  }
  ctx.restore()
  headSpace(P, () => {
    const b = P.bodyW
    const open = 0.4 + player.maw * 0.6
    // the gullet: a radial glow you could lose a moon in
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(b * 0.5, 0, 0, b * 0.5, 0, b * 1.9)
    g.addColorStop(0, hexA(s.accent, 0.85))
    g.addColorStop(0.4, hexA('#ff7a3c', 0.35))
    g.addColorStop(1, 'rgba(255,120,60,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(b * 0.5, 0, b * 1.9, 0, TAU); ctx.fill()
    ctx.restore()
    // jaws split wide top and bottom
    ctx.fillStyle = '#120602'
    for (const sgn of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(b * 1.3, sgn * b * 0.08)
      ctx.quadraticCurveTo(b * 0.5, sgn * b * open * 1.15, -b * 1.1, sgn * b * open * 0.85)
      ctx.quadraticCurveTo(-b * 0.2, sgn * b * 0.16, b * 1.3, sgn * b * 0.08)
      ctx.closePath()
      ctx.fill()
    }
    // row upon row of teeth
    ctx.fillStyle = '#ffe9c8'
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 6; i++) {
        const tx = b * (1.0 - i * 0.36 - row * 0.16)
        for (const sgn of [-1, 1]) {
          const ty = sgn * b * open * (0.5 + i * 0.06 + row * 0.24)
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(tx - b * 0.09, ty - sgn * b * (0.3 - row * 0.08))
          ctx.lineTo(tx - b * 0.18, ty)
          ctx.closePath()
          ctx.fill()
        }
      }
    }
    // a cluster of small hot eyes, all fixed on the next meal
    for (const [ex, ey] of [[-0.35, -0.6], [-0.6, -0.45], [-0.5, -0.75], [-0.35, 0.6], [-0.6, 0.45]]) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const eg = ctx.createRadialGradient(b * ex, b * ey, 0, b * ex, b * ey, b * 0.22)
      eg.addColorStop(0, hexA(s.accent, 0.95))
      eg.addColorStop(1, hexA(s.accent, 0))
      ctx.fillStyle = eg
      ctx.beginPath(); ctx.arc(b * ex, b * ey, b * 0.22, 0, TAU); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#1c0a04'
      ctx.beginPath(); ctx.arc(b * ex, b * ey, b * 0.07, 0, TAU); ctx.fill()
    }
  })
}

// `swim`/`waves` set the lateral undulation: eels thrash, whales barely flex.
const FORMS = {
  larva:   { profile: PROFILES.larva,   draw: drawLarva,   swim: 0.55, waves: 1.2 },
  lantern: { profile: PROFILES.lantern, draw: drawLantern, swim: 0.16, waves: 1.0 },
  ribbon:  { profile: PROFILES.ribbon,  draw: drawRibbon,  swim: 0.80, waves: 2.2 },
  viper:   { profile: PROFILES.viper,   draw: drawViper,   swim: 0.28, waves: 1.2 },
  gulper:  { profile: PROFILES.gulper,  draw: drawGulper,  swim: 0.65, waves: 1.8 },
  serpent: { profile: PROFILES.serpent, draw: drawSerpent, swim: 0.70, waves: 2.4 },
  shark:   { profile: PROFILES.shark,   draw: drawShark,   swim: 0.14, waves: 0.9 },
  whale:   { profile: PROFILES.whale,   draw: drawWhale,   swim: 0.10, waves: 0.8 },
  kraken:  { profile: PROFILES.kraken,  draw: drawKraken,  swim: 0.07, waves: 0.7 },
  god:     { profile: PROFILES.god,     draw: drawGod,     swim: 0.07, waves: 0.7 },
  wyrm:    { profile: PROFILES.wyrm,    draw: drawWyrm,    swim: 0.55, waves: 2.0 },
  skywhale:{ profile: PROFILES.skywhale,draw: drawSkywhale,swim: 0.10, waves: 0.8 },
  starserp:{ profile: PROFILES.starserp,draw: drawStarserp,swim: 0.70, waves: 2.6 },
  mooneater:{ profile: PROFILES.mooneater, draw: drawMooneater, swim: 0.09, waves: 0.8 },
  magmaw:  { profile: PROFILES.magmaw,  draw: drawMagmaw,  swim: 0.50, waves: 1.8 },
  obsidian:{ profile: PROFILES.obsidian,draw: drawObsidian,swim: 0.08, waves: 0.7 },
  worldeater:{ profile: PROFILES.worldeater, draw: drawWorldeater, swim: 0.06, waves: 0.6 },
}

// ---- Status effects drawn over the monster -----------------------------
function drawStatusFx(P) {
  if ((player.hooked || player.netted) && player.strain > 0.02) {
    ctx.strokeStyle = 'rgba(255,240,160,0.85)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(P.hx, P.hy, P.maxW * 2.4 + 12, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(player.strain, 0, 1))
    ctx.stroke()
  }
  if (player.netted) {
    ctx.strokeStyle = 'rgba(220,240,255,0.5)'
    ctx.lineWidth = 1
    const r = P.maxW * 2.6
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath(); ctx.moveTo(P.hx + i * r / 3, P.hy - r); ctx.lineTo(P.hx + i * r / 3, P.hy + r); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(P.hx - r, P.hy + i * r / 3); ctx.lineTo(P.hx + r, P.hy + i * r / 3); ctx.stroke()
    }
  }
  if (player.stun > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = 'rgba(180,230,255,0.9)'
    ctx.lineWidth = 1.6
    for (let i = 0; i < 6; i++) {
      const a = now() * 0.02 + i * 1.05
      const r1 = P.maxW * 1.5
      const r2 = P.maxW * (2.2 + Math.sin(now() * 0.03 + i) * 0.5)
      ctx.beginPath()
      ctx.moveTo(P.hx + Math.cos(a) * r1, P.hy + Math.sin(a) * r1)
      ctx.lineTo(P.hx + Math.cos(a + 0.45) * r2, P.hy + Math.sin(a + 0.45) * r2)
      ctx.stroke()
    }
    ctx.restore()
  }
}

// ---- Creature drawing --------------------------------------------------
function drawCreature(c) {
  const x = sx(c.x), y = sy(c.y)
  const pad = c.r * 4 + 70
  if (x < -pad || x > window.innerWidth + pad || y < -pad || y > window.innerHeight + pad) return
  const t = now() * 0.001
  const r = c.r

  ctx.save()
  ctx.translate(x, y)

  if (c.glow > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 3)
    g.addColorStop(0, hexA(c.col, 0.35 * c.glow))
    g.addColorStop(1, hexA(c.col, 0))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(0, 0, r * 3, 0, TAU); ctx.fill()
    ctx.restore()
  }
  // a creature winding up a discharge crackles first
  if (c.windup > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = c.key === 'magmaeel' ? 'rgba(255,180,90,0.9)' : 'rgba(160,230,255,0.9)'
    ctx.lineWidth = 1.4
    for (let i = 0; i < 5; i++) {
      const a = t * 20 + i * 1.3
      ctx.beginPath()
      ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
      ctx.lineTo(Math.cos(a + 0.5) * r * (1.7 + Math.sin(t * 30 + i) * 0.3), Math.sin(a + 0.5) * r * 1.7)
      ctx.stroke()
    }
    ctx.restore()
  }

  ctx.scale(c.dir, 1)
  ctx.fillStyle = c.col

  switch (c.shape) {
    case 'dot':
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill()
      ctx.strokeStyle = hexA(c.col, 0.4); ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(0, 0, r * 1.8, 0, TAU); ctx.stroke()
      break

    case 'shrimp':
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.55, 0.3, 0, TAU); ctx.fill()
      ctx.strokeStyle = c.col; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(-r * 1.7, -r * 0.45); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(r * 0.7, r * 0.2); ctx.lineTo(r * 1.5, r * 0.5); ctx.stroke()
      break

    case 'jelly': {
      ctx.beginPath(); ctx.ellipse(0, -r * 0.2, r, r * 0.8, 0, Math.PI, 0); ctx.fill()
      ctx.strokeStyle = hexA(c.col, 0.6); ctx.lineWidth = 1.5
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        ctx.moveTo(i * r * 0.35, -r * 0.1)
        ctx.quadraticCurveTo(i * r * 0.35 + Math.sin(t * 3 + i) * 5, r * 1.4, i * r * 0.35, r * 2.2)
        ctx.stroke()
      }
      break
    }

    case 'squid': {
      // mantle points backward, arms lead
      ctx.beginPath()
      ctx.moveTo(r * 0.7, 0)
      ctx.quadraticCurveTo(-r * 0.2, -r * 0.62, -r * 1.5, 0)
      ctx.quadraticCurveTo(-r * 0.2, r * 0.62, r * 0.7, 0)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = hexA(c.col, 0.6)
      ctx.beginPath()
      ctx.moveTo(-r * 0.9, -r * 0.3); ctx.lineTo(-r * 1.9, -r * 0.75); ctx.lineTo(-r * 1.2, 0)
      ctx.lineTo(-r * 1.9, r * 0.75); ctx.lineTo(-r * 0.9, r * 0.3); ctx.closePath(); ctx.fill()
      ctx.strokeStyle = c.col; ctx.lineWidth = Math.max(1.2, r * 0.09)
      ctx.lineCap = 'round'
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath()
        ctx.moveTo(r * 0.6, i * r * 0.11)
        ctx.quadraticCurveTo(r * 1.3, i * r * 0.22 + Math.sin(t * 2.5 + i) * r * 0.2, r * 1.9, i * r * 0.4 + Math.sin(t * 2 + i) * r * 0.3)
        ctx.stroke()
      }
      ctx.fillStyle = '#f4e6c4'
      ctx.beginPath(); ctx.ellipse(r * 0.45, -r * 0.3, r * 0.19, r * 0.16, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = '#100612'
      ctx.beginPath(); ctx.arc(r * 0.5, -r * 0.3, r * 0.08, 0, TAU); ctx.fill()
      break
    }

    case 'octopus': {
      ctx.beginPath(); ctx.ellipse(-r * 0.1, -r * 0.15, r * 0.95, r * 0.85, 0, 0, TAU); ctx.fill()
      if (c.ears) {
        ctx.fillStyle = hexA(c.col, 0.7)
        for (const sgn of [-1, 1]) {
          ctx.beginPath()
          ctx.moveTo(-r * 0.5, -r * 0.5)
          ctx.quadraticCurveTo(-r * 1.5, sgn * r * 1.3 - r * 0.4, -r * 0.2, sgn * r * 0.2 - r * 0.5)
          ctx.closePath(); ctx.fill()
        }
        ctx.fillStyle = c.col
      }
      ctx.strokeStyle = c.col
      ctx.lineWidth = Math.max(1.4, r * 0.16)
      ctx.lineCap = 'round'
      for (let i = 0; i < 6; i++) {
        const f = i / 5 - 0.5
        ctx.beginPath()
        ctx.moveTo(r * 0.1, r * 0.5)
        ctx.quadraticCurveTo(
          r * (0.5 + f * 0.9), r * 1.3 + Math.sin(t * 2 + i) * r * 0.2,
          r * (0.9 + f * 1.7), r * (1.1 + Math.sin(t * 1.7 + i * 1.4) * 0.4)
        )
        ctx.stroke()
      }
      ctx.fillStyle = '#f6ecd4'
      for (const sgn of [-1, 1]) {
        ctx.beginPath(); ctx.ellipse(r * 0.35, -r * 0.35 + sgn * r * 0.28, r * 0.22, r * 0.16, 0, 0, TAU); ctx.fill()
      }
      ctx.fillStyle = '#150713'
      for (const sgn of [-1, 1]) {
        ctx.beginPath(); ctx.ellipse(r * 0.4, -r * 0.35 + sgn * r * 0.28, r * 0.07, r * 0.1, 0, 0, TAU); ctx.fill()
      }
      break
    }

    case 'angler': {
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill()
      ctx.fillStyle = '#0a0f14'
      ctx.beginPath(); ctx.arc(r * 0.6, r * 0.2, r * 0.55, 0, TAU); ctx.fill()
      ctx.strokeStyle = '#dff'; ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(r * 0.3 + i * r * 0.15, r * 0.55)
        ctx.lineTo(r * 0.3 + i * r * 0.15, r * 0.05)
        ctx.stroke()
      }
      const ly = -r * 1.35 + Math.sin(t * 4) * 3
      ctx.strokeStyle = hexA(c.col, 0.7); ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.moveTo(-r * 0.1, -r * 0.8); ctx.quadraticCurveTo(r * 0.6, -r * 1.6, r * 0.8, ly); ctx.stroke()
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const g = ctx.createRadialGradient(r * 0.8, ly, 0, r * 0.8, ly, r * 1.1)
      g.addColorStop(0, 'rgba(190,255,200,0.95)'); g.addColorStop(1, 'rgba(150,255,180,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(r * 0.8, ly, r * 1.1, 0, TAU); ctx.fill()
      ctx.restore()
      break
    }

    case 'shark': {
      const headW = c.hammer ? r * 0.85 : r * 0.55
      ctx.beginPath()
      ctx.moveTo(r * 1.35, 0)
      ctx.quadraticCurveTo(r * 0.2, -r * 0.6, -r, -r * 0.15)
      ctx.lineTo(-r * 1.55, -r * 0.55)
      ctx.lineTo(-r * 1.15, 0)
      ctx.lineTo(-r * 1.55, r * 0.55)
      ctx.lineTo(-r, r * 0.15)
      ctx.quadraticCurveTo(r * 0.2, r * 0.6, r * 1.35, 0)
      ctx.closePath(); ctx.fill()
      if (c.hammer) {
        ctx.beginPath()
        ctx.ellipse(r * 1.15, 0, r * 0.22, headW, 0, 0, TAU)
        ctx.fill()
      }
      ctx.beginPath()
      ctx.moveTo(0, -r * 0.5); ctx.lineTo(-r * 0.25, -r * 1.15); ctx.lineTo(-r * 0.55, -r * 0.5)
      ctx.closePath(); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(r * 0.2, r * 0.4); ctx.lineTo(r * 0.1, r * 1.1); ctx.lineTo(-r * 0.35, r * 0.45)
      ctx.closePath(); ctx.fill()
      ctx.strokeStyle = 'rgba(10,16,22,0.5)'; ctx.lineWidth = 1.4
      for (let i = 0; i < (c.frill ? 6 : 5); i++) {
        const gx = r * (0.55 - i * 0.13)
        ctx.beginPath(); ctx.moveTo(gx, -r * 0.28); ctx.lineTo(gx - r * 0.05, r * 0.3); ctx.stroke()
      }
      ctx.fillStyle = '#04121c'
      ctx.beginPath(); ctx.arc(r * (c.hammer ? 1.15 : 0.8), -r * (c.hammer ? 0.72 : 0.12), r * 0.12, 0, TAU); ctx.fill()
      ctx.strokeStyle = '#eef'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(r * 1.25, r * 0.06); ctx.lineTo(r * 0.55, r * 0.3); ctx.stroke()
      break
    }

    case 'puffer': {
      const p = c.puffed || 0
      const rr = r * (1 + p * 0.55)
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-rr, 0); ctx.lineTo(-rr * 1.6, -rr * 0.5); ctx.lineTo(-rr * 1.6, rr * 0.5)
      ctx.closePath(); ctx.fill()
      if (p > 0.05) {
        ctx.strokeStyle = '#fff8dc'
        ctx.lineWidth = 1.6
        for (let i = 0; i < 14; i++) {
          const a = (i / 14) * TAU
          ctx.beginPath()
          ctx.moveTo(Math.cos(a) * rr * 0.9, Math.sin(a) * rr * 0.9)
          ctx.lineTo(Math.cos(a) * rr * (1 + p * 0.55), Math.sin(a) * rr * (1 + p * 0.55))
          ctx.stroke()
        }
      }
      ctx.fillStyle = '#04121c'
      ctx.beginPath(); ctx.arc(rr * 0.55, -rr * 0.2, rr * 0.14, 0, TAU); ctx.fill()
      break
    }

    case 'needle': {
      const bill = r * (c.bill || 0.6)
      ctx.beginPath()
      ctx.moveTo(r * 1.2 + bill, 0)
      ctx.quadraticCurveTo(r * 0.4, -r * 0.34, -r * 1.1, -r * 0.16)
      ctx.lineTo(-r * 1.6, -r * 0.5)
      ctx.lineTo(-r * 1.25, 0)
      ctx.lineTo(-r * 1.6, r * 0.5)
      ctx.lineTo(-r * 1.1, r * 0.16)
      ctx.quadraticCurveTo(r * 0.4, r * 0.34, r * 1.2 + bill, 0)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = hexA(c.col, 0.65)
      ctx.beginPath()
      ctx.moveTo(-r * 0.1, -r * 0.28); ctx.lineTo(-r * 0.4, -r * 0.95); ctx.lineTo(-r * 0.7, -r * 0.28)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#04121c'
      ctx.beginPath(); ctx.arc(r * 0.75, -r * 0.1, r * 0.11, 0, TAU); ctx.fill()
      break
    }

    case 'orca': {
      ctx.beginPath()
      ctx.moveTo(r * 1.25, 0)
      ctx.quadraticCurveTo(r * 0.2, -r * 0.62, -r * 1.0, -r * 0.2)
      ctx.lineTo(-r * 1.6, -r * 0.62)
      ctx.lineTo(-r * 1.2, 0)
      ctx.lineTo(-r * 1.6, r * 0.62)
      ctx.lineTo(-r * 1.0, r * 0.2)
      ctx.quadraticCurveTo(r * 0.2, r * 0.66, r * 1.25, 0)
      ctx.closePath(); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-r * 0.05, -r * 0.55); ctx.lineTo(-r * 0.35, -r * 1.45); ctx.lineTo(-r * 0.7, -r * 0.5)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#f2f7fb'
      ctx.beginPath(); ctx.ellipse(r * 0.72, -r * 0.28, r * 0.22, r * 0.12, -0.3, 0, TAU); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(r * 0.9, r * 0.22)
      ctx.quadraticCurveTo(-r * 0.2, r * 0.62, -r * 0.95, r * 0.18)
      ctx.quadraticCurveTo(-r * 0.2, r * 0.34, r * 0.9, r * 0.22)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#04070c'
      ctx.beginPath(); ctx.arc(r * 0.85, -r * 0.08, r * 0.09, 0, TAU); ctx.fill()
      break
    }

    case 'ray': {
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.72, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = hexA(c.col, 0.75)
      ctx.beginPath()
      ctx.moveTo(-r * 0.7, 0); ctx.lineTo(-r * 2.1, -r * 0.16); ctx.lineTo(-r * 2.1, r * 0.16)
      ctx.closePath(); ctx.fill()
      ctx.strokeStyle = hexA('#9fe8ff', 0.5); ctx.lineWidth = 1
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.ellipse(0, 0, r * (0.4 + i * 0.22 + 0.4), r * (0.3 + i * 0.16 + 0.3), 0, 0, TAU); ctx.stroke()
      }
      ctx.fillStyle = '#04121c'
      for (const sgn of [-1, 1]) {
        ctx.beginPath(); ctx.arc(r * 0.5, sgn * r * 0.22, r * 0.1, 0, TAU); ctx.fill()
      }
      break
    }

    case 'viper': {
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.4, 0, 0, TAU); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-r * 0.9, 0); ctx.lineTo(-r * 1.7, -r * 0.5); ctx.lineTo(-r * 1.7, r * 0.5)
      ctx.closePath(); ctx.fill()
      ctx.strokeStyle = '#f6ffff'; ctx.lineWidth = 1.3
      for (let i = 0; i < 4; i++) {
        const tx = r * (0.85 - i * 0.22)
        ctx.beginPath(); ctx.moveTo(tx, -r * 0.14); ctx.lineTo(tx - r * 0.05, r * 0.62); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(tx - r * 0.1, r * 0.14); ctx.lineTo(tx - r * 0.16, -r * 0.6); ctx.stroke()
      }
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const ly = -r * 1.5 + Math.sin(t * 3) * 3
      ctx.strokeStyle = hexA(c.col, 0.6); ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(-r * 0.3, -r * 0.35); ctx.quadraticCurveTo(r * 0.6, -r * 1.5, r * 1.1, ly); ctx.stroke()
      const g = ctx.createRadialGradient(r * 1.1, ly, 0, r * 1.1, ly, r)
      g.addColorStop(0, 'rgba(160,240,255,0.9)'); g.addColorStop(1, 'rgba(160,240,255,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(r * 1.1, ly, r, 0, TAU); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#cfefff'
      ctx.beginPath(); ctx.arc(r * 0.62, -r * 0.16, r * 0.11, 0, TAU); ctx.fill()
      break
    }

    case 'gulper': {
      ctx.beginPath()
      ctx.moveTo(r * 0.9, 0)
      ctx.quadraticCurveTo(-r * 0.2, -r * 1.0, -r * 0.9, -r * 0.25)
      ctx.quadraticCurveTo(-r * 1.6, 0, -r * 2.3, r * 0.1)
      ctx.quadraticCurveTo(-r * 1.5, r * 0.25, -r * 0.9, r * 0.25)
      ctx.quadraticCurveTo(-r * 0.2, r * 1.0, r * 0.9, 0)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#080d16'
      ctx.beginPath()
      ctx.moveTo(r * 0.85, 0)
      ctx.quadraticCurveTo(-r * 0.1, -r * 0.7, -r * 0.75, -r * 0.15)
      ctx.quadraticCurveTo(-r * 0.1, r * 0.7, r * 0.85, 0)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#cfe6ff'
      ctx.beginPath(); ctx.arc(r * 0.72, -r * 0.22, r * 0.1, 0, TAU); ctx.fill()
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const g = ctx.createRadialGradient(-r * 2.3, r * 0.1, 0, -r * 2.3, r * 0.1, r * 0.9)
      g.addColorStop(0, 'rgba(255,140,190,0.85)'); g.addColorStop(1, 'rgba(255,140,190,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(-r * 2.3, r * 0.1, r * 0.9, 0, TAU); ctx.fill()
      ctx.restore()
      break
    }

    case 'whale': {
      ctx.beginPath()
      ctx.moveTo(r * 1.25, -r * 0.28)
      ctx.quadraticCurveTo(r * 1.4, r * 0.42, r * 0.85, r * 0.44)
      ctx.lineTo(-r * 0.9, r * 0.36)
      ctx.lineTo(-r * 1.5, r * 0.12)
      ctx.lineTo(-r * 1.35, -r * 0.1)
      ctx.quadraticCurveTo(-r * 0.4, -r * 0.5, r * 1.25, -r * 0.28)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = hexA(c.col, 0.85)
      ctx.beginPath()
      ctx.moveTo(-r * 1.35, 0)
      ctx.quadraticCurveTo(-r * 1.9, -r * 0.55, -r * 2.2, -r * 0.42)
      ctx.quadraticCurveTo(-r * 1.75, 0, -r * 2.2, r * 0.42)
      ctx.quadraticCurveTo(-r * 1.9, r * 0.55, -r * 1.35, 0)
      ctx.closePath(); ctx.fill()
      ctx.strokeStyle = 'rgba(20,20,26,0.6)'; ctx.lineWidth = 1.6
      ctx.beginPath(); ctx.moveTo(r * 1.15, r * 0.3); ctx.lineTo(-r * 0.2, r * 0.3); ctx.stroke()
      ctx.fillStyle = '#f0f2f6'
      for (let i = 0; i < 5; i++) {
        ctx.beginPath(); ctx.arc(r * (0.85 - i * 0.22), r * 0.34, r * 0.045, 0, TAU); ctx.fill()
      }
      ctx.fillStyle = '#08080c'
      ctx.beginPath(); ctx.arc(r * 0.72, -r * 0.06, r * 0.06, 0, TAU); ctx.fill()
      break
    }

    case 'bug': {
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.68, 0, 0, TAU); ctx.fill()
      ctx.strokeStyle = shade(c.col, -60); ctx.lineWidth = 1
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath(); ctx.moveTo(i * r * 0.32, -r * 0.6); ctx.lineTo(i * r * 0.32, r * 0.6); ctx.stroke()
      }
      ctx.strokeStyle = c.col; ctx.lineWidth = 1.4
      for (let i = -2; i <= 2; i++) {
        const wig = Math.sin(t * 5 + i) * r * 0.12
        ctx.beginPath(); ctx.moveTo(i * r * 0.32, r * 0.55); ctx.lineTo(i * r * 0.38, r * 1.15 + wig); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(i * r * 0.32, -r * 0.55); ctx.lineTo(i * r * 0.38, -r * 1.15 - wig); ctx.stroke()
      }
      ctx.beginPath(); ctx.moveTo(r * 0.9, -r * 0.2); ctx.lineTo(r * 1.6, -r * 0.5); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(r * 0.9, r * 0.2); ctx.lineTo(r * 1.6, r * 0.5); ctx.stroke()
      break
    }

    case 'worm': {
      ctx.strokeStyle = c.col
      ctx.lineWidth = r * 0.5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(r * 0.4, 0)
      for (let i = 1; i <= 7; i++) {
        ctx.lineTo(r * 0.4 - i * r * 0.42, Math.sin(t * 3 + i * 0.8) * r * 0.35)
      }
      ctx.stroke()
      // four hooked mandibles, sprung open
      ctx.strokeStyle = shade(c.col, 40); ctx.lineWidth = Math.max(1.4, r * 0.13)
      ctx.lineCap = 'round'
      for (const sgn of [-1, 1]) {
        for (const spread of [0.55, 1.15]) {
          ctx.beginPath()
          ctx.moveTo(r * 0.45, sgn * r * 0.14)
          ctx.quadraticCurveTo(r * 1.3, sgn * r * 0.4 * spread, r * 1.75, sgn * r * 1.1 * spread)
          ctx.stroke()
        }
      }
      ctx.lineCap = 'butt'
      ctx.fillStyle = '#ffd9b0'
      ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.2, r * 0.1, 0, TAU); ctx.fill()
      break
    }

    case 'tube': {
      ctx.fillStyle = '#d8d2c4'
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-r * 0.28, -r * 0.2, r * 0.56, r * 2, r * 0.2) : ctx.rect(-r * 0.28, -r * 0.2, r * 0.56, r * 2); ctx.fill()
      ctx.fillStyle = c.col
      ctx.beginPath(); ctx.ellipse(0, -r * 0.45, r * 0.42, r * 0.62, Math.sin(t * 1.5) * 0.14, 0, TAU); ctx.fill()
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const g = ctx.createRadialGradient(0, -r * 0.5, 0, 0, -r * 0.5, r * 1.4)
      g.addColorStop(0, hexA(c.col, 0.5)); g.addColorStop(1, hexA(c.col, 0))
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(0, -r * 0.5, r * 1.4, 0, TAU); ctx.fill()
      ctx.restore()
      break
    }

    case 'siphon': {
      // a colony: a chain of bells trailing a curtain of stinging threads
      ctx.strokeStyle = hexA(c.col, 0.35)
      ctx.lineWidth = 1
      for (let i = 0; i < 7; i++) {
        const bx = -i * r * 0.3
        const by = Math.sin(t * 1.4 + i * 0.6) * r * 0.2
        ctx.fillStyle = hexA(c.col, 0.55 - i * 0.05)
        ctx.beginPath(); ctx.ellipse(bx, by, r * (0.3 - i * 0.02), r * (0.22 - i * 0.015), 0, 0, TAU); ctx.fill()
      }
      for (let i = 0; i < 9; i++) {
        const bx = -i * r * 0.22
        ctx.beginPath()
        ctx.moveTo(bx, r * 0.1)
        ctx.quadraticCurveTo(bx + Math.sin(t * 2 + i) * r * 0.3, r * 1.2, bx + Math.sin(t * 1.3 + i) * r * 0.5, r * 2.4)
        ctx.stroke()
      }
      break
    }

    case 'eel': {
      ctx.strokeStyle = c.col
      ctx.lineWidth = r * 0.42
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(r * 1.1, 0)
      for (let i = 1; i <= 9; i++) {
        ctx.lineTo(r * 1.1 - i * r * 0.36, Math.sin(t * 4 + i * 0.7) * r * (0.1 + i * 0.06))
      }
      ctx.stroke()
      ctx.strokeStyle = hexA(shade(c.col, 60), 0.5)
      ctx.lineWidth = r * 0.12
      ctx.beginPath()
      ctx.moveTo(r * 1.0, -r * 0.16)
      for (let i = 1; i <= 9; i++) {
        ctx.lineTo(r * 1.0 - i * r * 0.36, Math.sin(t * 4 + i * 0.7) * r * (0.1 + i * 0.06) - r * 0.2)
      }
      ctx.stroke()
      ctx.fillStyle = '#0b0508'
      ctx.beginPath(); ctx.arc(r * 1.0, -r * 0.12, r * 0.1, 0, TAU); ctx.fill()
      break
    }

    case 'hatchet': {
      ctx.beginPath()
      ctx.moveTo(r * 0.8, -r * 0.5)
      ctx.quadraticCurveTo(r * 0.2, r * 1.1, -r * 0.5, r * 0.5)
      ctx.quadraticCurveTo(-r * 0.9, -r * 0.2, -r * 0.2, -r * 0.8)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = hexA(c.col, 0.6)
      ctx.beginPath(); ctx.moveTo(-r * 0.5, 0); ctx.lineTo(-r * 1.4, -r * 0.4); ctx.lineTo(-r * 1.4, r * 0.4); ctx.closePath(); ctx.fill()
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(150,255,220,${0.4 + 0.4 * Math.abs(Math.sin(t * 2 + i))})`
        ctx.beginPath(); ctx.arc(r * (0.4 - i * 0.25), r * 0.66, r * 0.1, 0, TAU); ctx.fill()
      }
      ctx.restore()
      ctx.fillStyle = '#0a141c'
      ctx.beginPath(); ctx.arc(r * 0.3, -r * 0.36, r * 0.22, 0, TAU); ctx.fill()
      break
    }

    case 'plank': {
      ctx.save()
      ctx.rotate(Math.sin(t + c.wob) * 0.4)
      ctx.fillStyle = c.col
      ctx.fillRect(-r * 1.4, -r * 0.3, r * 2.8, r * 0.6)
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1
      ctx.strokeRect(-r * 1.4, -r * 0.3, r * 2.8, r * 0.6)
      ctx.restore()
      break
    }

    case 'barrel': {
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.8, r, 0, 0, TAU); ctx.fill()
      ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(-r * 0.8, -r * 0.4); ctx.lineTo(r * 0.8, -r * 0.4); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-r * 0.8, r * 0.4); ctx.lineTo(r * 0.8, r * 0.4); ctx.stroke()
      break
    }

    case 'bird': {
      // body + two beating wings; span birds glide stiff-armed
      const flap = c.span ? Math.sin(t * 3 + c.wob) * 0.25 : Math.sin(t * 9 + c.wob)
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.42, 0, 0, TAU); ctx.fill()
      // tail
      ctx.beginPath()
      ctx.moveTo(-r * 0.8, 0); ctx.lineTo(-r * 1.5, -r * 0.25); ctx.lineTo(-r * 1.5, r * 0.25)
      ctx.closePath(); ctx.fill()
      // wings
      const wspan = r * (c.span ? 2.6 : 1.7)
      ctx.fillStyle = hexA(c.col, 0.9)
      ctx.beginPath()
      ctx.moveTo(-r * 0.1, -r * 0.15)
      ctx.quadraticCurveTo(r * 0.2 - wspan * 0.3, -wspan * (0.55 + flap * 0.4), -wspan * 0.55, -wspan * (0.8 + flap * 0.5))
      ctx.quadraticCurveTo(-r * 0.5, -wspan * 0.3, -r * 0.4, 0)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = hexA(shade(c.col, -40), 0.8)
      ctx.beginPath()
      ctx.moveTo(-r * 0.1, r * 0.05)
      ctx.quadraticCurveTo(r * 0.1 - wspan * 0.2, wspan * (0.4 - flap * 0.3), -wspan * 0.4, wspan * (0.6 - flap * 0.4))
      ctx.quadraticCurveTo(-r * 0.5, wspan * 0.24, -r * 0.4, r * 0.1)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = c.col
      // head + beak (pelicans get the pouch)
      ctx.beginPath(); ctx.arc(r * 0.9, -r * 0.18, r * 0.3, 0, TAU); ctx.fill()
      ctx.fillStyle = c.pouch ? '#e8a860' : '#e8b840'
      ctx.beginPath()
      ctx.moveTo(r * 1.1, -r * 0.28)
      ctx.lineTo(r * (c.pouch ? 1.9 : 1.55), c.pouch ? r * 0.1 : -r * 0.12)
      ctx.lineTo(r * 1.05, c.pouch ? r * 0.22 : -r * 0.02)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#101418'
      ctx.beginPath(); ctx.arc(r * 0.95, -r * 0.26, r * 0.07, 0, TAU); ctx.fill()
      break
    }

    case 'wisp': {
      // ball lightning with a will: a flickering core and stray arcs
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.4)
      g.addColorStop(0, hexA(c.col, 0.9))
      g.addColorStop(0.5, hexA(c.col, 0.35))
      g.addColorStop(1, hexA(c.col, 0))
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(0, 0, r * 1.4, 0, TAU); ctx.fill()
      ctx.strokeStyle = hexA(c.col, 0.8)
      ctx.lineWidth = 1.3
      for (let i = 0; i < 4; i++) {
        const a = t * 6 + i * 1.7 + c.wob
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * r * 0.4, Math.sin(a) * r * 0.4)
        ctx.lineTo(Math.cos(a + 0.6) * r * (1.1 + Math.sin(t * 11 + i) * 0.3), Math.sin(a + 0.6) * r * 1.1)
        ctx.stroke()
      }
      ctx.restore()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath(); ctx.arc(0, 0, r * 0.28, 0, TAU); ctx.fill()
      break
    }

    case 'moth': {
      const flap = Math.abs(Math.sin(t * 7 + c.wob))
      ctx.fillStyle = hexA(c.col, 0.85)
      for (const sgn of [-1, 1]) {
        ctx.beginPath()
        ctx.ellipse(-r * 0.1, sgn * r * (0.35 + flap * 0.4), r * 0.85, r * (0.5 + flap * 0.25), sgn * 0.5, 0, TAU)
        ctx.fill()
      }
      ctx.fillStyle = shade(c.col, -50)
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.55, r * 0.2, 0, 0, TAU); ctx.fill()
      ctx.strokeStyle = hexA(c.col, 0.7); ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(r * 0.5, 0); ctx.lineTo(r * 0.9, -r * 0.3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(r * 0.5, 0); ctx.lineTo(r * 0.9, r * 0.1); ctx.stroke()
      break
    }

    case 'balloon': {
      // weather balloon: envelope, line, and a little instrument box
      ctx.beginPath(); ctx.ellipse(0, -r * 0.4, r * 0.85, r, 0, 0, TAU); ctx.fill()
      ctx.strokeStyle = hexA(shade(c.col, -60), 0.7); ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, -r * 1.4); ctx.quadraticCurveTo(r * 0.5, -r * 0.4, 0, r * 0.6); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, -r * 1.4); ctx.quadraticCurveTo(-r * 0.5, -r * 0.4, 0, r * 0.6); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, r * 0.6); ctx.lineTo(0, r * 1.3); ctx.stroke()
      ctx.fillStyle = '#c8b088'
      ctx.fillRect(-r * 0.25, r * 1.3, r * 0.5, r * 0.4)
      break
    }

    case 'plane': {
      // prop / cargo plane: tube fuselage, straight wing, tailplane
      const big = c.big
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.3, r * 0.34, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = hexA(shade(c.col, -30), 0.95)
      ctx.beginPath()
      ctx.moveTo(r * 0.25, -r * 0.1)
      ctx.lineTo(-r * (big ? 0.6 : 0.45), -r * (big ? 1.15 : 0.9))
      ctx.lineTo(-r * (big ? 0.95 : 0.75), -r * (big ? 1.1 : 0.85))
      ctx.lineTo(-r * 0.25, -r * 0.05)
      ctx.closePath(); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-r * 1.05, -r * 0.1); ctx.lineTo(-r * 1.45, -r * 0.75); ctx.lineTo(-r * 1.35, -r * 0.05)
      ctx.closePath(); ctx.fill()
      // windows / cockpit
      ctx.fillStyle = '#9fd0e0'
      ctx.beginPath(); ctx.ellipse(r * 0.95, -r * 0.1, r * 0.2, r * 0.12, 0, 0, TAU); ctx.fill()
      // spinning prop blur
      ctx.strokeStyle = hexA('#dfe8f0', 0.5)
      ctx.lineWidth = 1.6
      ctx.beginPath(); ctx.ellipse(r * 1.32, 0, r * 0.08, r * 0.55 * Math.abs(Math.sin(t * 14 + c.wob)) + r * 0.1, 0, 0, TAU); ctx.stroke()
      break
    }

    case 'jet': {
      // fighter: dart silhouette, canted tail, afterburner
      ctx.beginPath()
      ctx.moveTo(r * 1.5, 0)
      ctx.lineTo(r * 0.2, -r * 0.3)
      ctx.lineTo(-r * 0.5, -r * 0.95)
      ctx.lineTo(-r * 0.9, -r * 0.25)
      ctx.lineTo(-r * 1.3, -r * 0.7)
      ctx.lineTo(-r * 1.2, 0)
      ctx.lineTo(-r * 0.9, r * 0.2)
      ctx.lineTo(-r * 0.4, r * 0.75)
      ctx.lineTo(r * 0.25, r * 0.25)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#9fd0e0'
      ctx.beginPath(); ctx.ellipse(r * 0.85, -r * 0.08, r * 0.28, r * 0.12, -0.1, 0, TAU); ctx.fill()
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const flame = 0.6 + Math.abs(Math.sin(t * 20 + c.wob)) * 0.4
      const g = ctx.createRadialGradient(-r * 1.25, 0, 0, -r * 1.25, 0, r * flame)
      g.addColorStop(0, 'rgba(180,220,255,0.9)')
      g.addColorStop(0.4, 'rgba(255,160,80,0.5)')
      g.addColorStop(1, 'rgba(255,120,40,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(-r * 1.25, 0, r * flame, 0, TAU); ctx.fill()
      ctx.restore()
      break
    }

    case 'zeppelin': {
      // a fat envelope with fins and a gondola
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.7, r * 0.62, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = hexA(shade(c.col, -40), 0.9)
      ctx.beginPath()
      ctx.moveTo(-r * 1.5, -r * 0.2); ctx.lineTo(-r * 2.15, -r * 0.6); ctx.lineTo(-r * 1.85, 0)
      ctx.lineTo(-r * 2.15, r * 0.6); ctx.lineTo(-r * 1.5, r * 0.2)
      ctx.closePath(); ctx.fill()
      ctx.strokeStyle = hexA(shade(c.col, -50), 0.6); ctx.lineWidth = 1
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath(); ctx.ellipse(i * r * 0.55, 0, r * 0.28, r * 0.6, 0, -Math.PI * 0.42, Math.PI * 0.42); ctx.stroke()
      }
      ctx.fillStyle = '#4a4238'
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-r * 0.45, r * 0.55, r * 0.9, r * 0.3, r * 0.1) : ctx.rect(-r * 0.45, r * 0.55, r * 0.9, r * 0.3); ctx.fill()
      ctx.fillStyle = '#ffd890'
      for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(-r * 0.25 + i * r * 0.25, r * 0.7, r * 0.05, 0, TAU); ctx.fill()
      }
      break
    }

    case 'satellite': {
      // bus + solar wings (+ a dish on the big ones)
      ctx.save()
      ctx.rotate(Math.sin(t * 0.4 + c.wob) * 0.5)
      ctx.fillStyle = c.col
      ctx.fillRect(-r * 0.4, -r * 0.4, r * 0.8, r * 0.8)
      ctx.fillStyle = '#3a5a9e'
      for (const sgn of [-1, 1]) {
        ctx.fillRect(sgn * r * 0.5 - (sgn < 0 ? r * 1.2 : 0), -r * 0.3, r * 1.2, r * 0.6)
      }
      ctx.strokeStyle = 'rgba(220,235,255,0.5)'
      ctx.lineWidth = 1
      for (const sgn of [-1, 1]) {
        for (let i = 1; i < 4; i++) {
          const xx = sgn * (r * 0.5 + i * r * 0.3)
          ctx.beginPath(); ctx.moveTo(xx, -r * 0.3); ctx.lineTo(xx, r * 0.3); ctx.stroke()
        }
      }
      if (c.dish) {
        ctx.fillStyle = '#e8eef4'
        ctx.beginPath(); ctx.ellipse(0, -r * 0.75, r * 0.5, r * 0.28, 0, Math.PI, 0); ctx.fill()
        ctx.strokeStyle = '#e8eef4'
        ctx.beginPath(); ctx.moveTo(0, -r * 0.75); ctx.lineTo(0, -r * 1.1); ctx.stroke()
      }
      // blinking beacon
      ctx.fillStyle = (t * 2 + c.wob) % 1 < 0.5 ? '#ff5a5a' : '#5aff8a'
      ctx.beginPath(); ctx.arc(0, r * 0.5, r * 0.08, 0, TAU); ctx.fill()
      ctx.restore()
      break
    }

    case 'junk': {
      ctx.save()
      ctx.rotate(t * (0.4 + hash1(c.wob) * 0.5) + c.wob)
      ctx.fillStyle = c.col
      ctx.fillRect(-r * 0.8, -r * 0.3, r * 1.6, r * 0.6)
      ctx.fillStyle = hexA(shade(c.col, -50), 0.9)
      ctx.fillRect(-r * 0.2, -r * 0.7, r * 0.5, r * 0.5)
      ctx.strokeStyle = hexA(shade(c.col, 40), 0.6); ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(r * 0.8, 0); ctx.lineTo(r * 1.3, -r * 0.4); ctx.stroke()
      ctx.restore()
      break
    }

    case 'astronaut': {
      ctx.save()
      ctx.rotate(Math.sin(t * 0.6 + c.wob) * 0.6)
      // backpack, suit, helmet
      ctx.fillStyle = '#c8ccd4'
      ctx.fillRect(-r * 0.9, -r * 0.5, r * 0.45, r * 1.0)
      ctx.fillStyle = c.col
      ctx.beginPath(); ctx.ellipse(0, r * 0.15, r * 0.5, r * 0.65, 0, 0, TAU); ctx.fill()
      // flailing limbs
      ctx.strokeStyle = c.col; ctx.lineWidth = r * 0.24; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(-r * 0.1, r * 0.5); ctx.lineTo(-r * 0.5 + Math.sin(t * 3) * r * 0.2, r * 1.15); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(r * 0.15, r * 0.5); ctx.lineTo(r * 0.55, r * 1.1 + Math.cos(t * 3.4) * r * 0.2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-r * 0.2, -r * 0.1); ctx.lineTo(-r * 0.85 + Math.sin(t * 2.7) * r * 0.2, -r * 0.5); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(r * 0.3, -r * 0.1); ctx.lineTo(r * 0.9, -r * 0.35 + Math.sin(t * 3.1) * r * 0.25); ctx.stroke()
      ctx.lineCap = 'butt'
      ctx.beginPath(); ctx.arc(0, -r * 0.55, r * 0.42, 0, TAU); ctx.fillStyle = '#eef2f6'; ctx.fill()
      ctx.fillStyle = '#2a3038'
      ctx.beginPath(); ctx.arc(r * 0.08, -r * 0.55, r * 0.3, 0, TAU); ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.beginPath(); ctx.arc(r * 0.16, -r * 0.65, r * 0.09, 0, TAU); ctx.fill()
      ctx.restore()
      break
    }

    case 'ufo': {
      // saucer, dome, and a probing abduction beam
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const bg2 = ctx.createLinearGradient(0, 0, 0, r * 3)
      bg2.addColorStop(0, hexA(c.col, 0.30))
      bg2.addColorStop(1, hexA(c.col, 0))
      ctx.fillStyle = bg2
      ctx.beginPath()
      ctx.moveTo(-r * 0.5, r * 0.2); ctx.lineTo(-r * 1.4, r * 3); ctx.lineTo(r * 1.4, r * 3); ctx.lineTo(r * 0.5, r * 0.2)
      ctx.closePath(); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#aeb8c4'
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.3, r * 0.4, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = hexA(c.col, 0.75)
      ctx.beginPath(); ctx.ellipse(0, -r * 0.3, r * 0.55, r * 0.42, 0, Math.PI, 0); ctx.fill()
      for (let i = -2; i <= 2; i++) {
        ctx.fillStyle = (t * 3 + i) % 5 < 1 ? '#fff8c0' : hexA(c.col, 0.8)
        ctx.beginPath(); ctx.arc(i * r * 0.5, r * 0.12, r * 0.09, 0, TAU); ctx.fill()
      }
      break
    }

    case 'meteor': {
      // a tumbling chunk with a hot tail
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const tg = ctx.createLinearGradient(0, 0, -r * 3.4, 0)
      tg.addColorStop(0, hexA(c.col, 0.55))
      tg.addColorStop(1, hexA(c.col, 0))
      ctx.fillStyle = tg
      ctx.beginPath()
      ctx.moveTo(0, -r * 0.5); ctx.lineTo(-r * 3.4, 0); ctx.lineTo(0, r * 0.5)
      ctx.closePath(); ctx.fill()
      ctx.restore()
      ctx.save()
      ctx.rotate(t * 1.5 + c.wob)
      ctx.fillStyle = c.col
      ctx.beginPath()
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU
        const rr = r * (0.72 + hash1(c.wob * 10 + i) * 0.4)
        i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = hexA(shade(c.col, -70), 0.8)
      ctx.beginPath(); ctx.arc(r * 0.2, -r * 0.15, r * 0.2, 0, TAU); ctx.fill()
      ctx.beginPath(); ctx.arc(-r * 0.25, r * 0.2, r * 0.14, 0, TAU); ctx.fill()
      ctx.restore()
      break
    }

    case 'comet': {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const tg = ctx.createLinearGradient(0, 0, -r * 5, 0)
      tg.addColorStop(0, hexA(c.col, 0.7))
      tg.addColorStop(1, hexA(c.col, 0))
      ctx.fillStyle = tg
      ctx.beginPath()
      ctx.moveTo(r * 0.3, -r * 0.55)
      ctx.quadraticCurveTo(-r * 2, -r * 1.1, -r * 5, -r * 0.2)
      ctx.lineTo(-r * 5, r * 0.2)
      ctx.quadraticCurveTo(-r * 2, r * 1.1, r * 0.3, r * 0.55)
      ctx.closePath(); ctx.fill()
      const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.3)
      cg.addColorStop(0, 'rgba(255,255,255,0.95)')
      cg.addColorStop(0.4, hexA(c.col, 0.6))
      cg.addColorStop(1, hexA(c.col, 0))
      ctx.fillStyle = cg
      ctx.beginPath(); ctx.arc(0, 0, r * 1.3, 0, TAU); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#e8f6ff'
      ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, TAU); ctx.fill()
      break
    }

    case 'rocket': {
      // climbing hard, riding a plume
      ctx.beginPath()
      ctx.moveTo(r * 1.6, 0)
      ctx.quadraticCurveTo(r * 0.9, -r * 0.5, -r * 0.6, -r * 0.45)
      ctx.lineTo(-r * 1.1, -r * 0.45)
      ctx.lineTo(-r * 1.1, r * 0.45)
      ctx.lineTo(-r * 0.6, r * 0.45)
      ctx.quadraticCurveTo(r * 0.9, r * 0.5, r * 1.6, 0)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#c84a3a'
      ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.45); ctx.lineTo(-r * 1.35, -r * 0.95); ctx.lineTo(-r * 1.1, -r * 0.3); ctx.closePath(); ctx.fill()
      ctx.beginPath(); ctx.moveTo(-r * 0.6, r * 0.45); ctx.lineTo(-r * 1.35, r * 0.95); ctx.lineTo(-r * 1.1, r * 0.3); ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#5a88b8'
      ctx.beginPath(); ctx.arc(r * 0.7, 0, r * 0.2, 0, TAU); ctx.fill()
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const flame = 1 + Math.abs(Math.sin(t * 18 + c.wob)) * 0.5
      const fg = ctx.createRadialGradient(-r * 1.3, 0, 0, -r * 1.3, 0, r * flame * 1.3)
      fg.addColorStop(0, 'rgba(255,240,200,0.95)')
      fg.addColorStop(0.35, 'rgba(255,170,80,0.6)')
      fg.addColorStop(1, 'rgba(255,120,40,0)')
      ctx.fillStyle = fg
      ctx.beginPath(); ctx.arc(-r * 1.3, 0, r * flame * 1.3, 0, TAU); ctx.fill()
      ctx.restore()
      break
    }

    case 'remora': {
      // slender hanger-on with the sucker stripe on its crown
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.2, r * 0.4, 0, 0, TAU); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-r * 1.1, 0); ctx.lineTo(-r * 1.7, -r * 0.35); ctx.lineTo(-r * 1.7, r * 0.35)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = shade(c.col, 50)
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-r * 0.2, -r * 0.5, r * 1.0, r * 0.22, r * 0.1) : ctx.rect(-r * 0.2, -r * 0.5, r * 1.0, r * 0.22); ctx.fill()
      ctx.strokeStyle = shade(c.col, -50); ctx.lineWidth = 1
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(i * r * 0.22, -r * 0.48); ctx.lineTo(i * r * 0.22, -r * 0.3); ctx.stroke()
      }
      ctx.fillStyle = '#0a141c'
      ctx.beginPath(); ctx.arc(r * 0.75, -r * 0.08, r * 0.11, 0, TAU); ctx.fill()
      break
    }

    case 'penguin': {
      // a flying bird after all — it just flies underwater
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.55, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = '#eef2f6'
      ctx.beginPath(); ctx.ellipse(r * 0.1, r * 0.16, r * 0.85, r * 0.32, 0, 0, TAU); ctx.fill()
      ctx.fillStyle = c.col
      const flip = Math.sin(t * 8 + c.wob) * 0.5
      ctx.beginPath()
      ctx.moveTo(-r * 0.1, -r * 0.3)
      ctx.quadraticCurveTo(-r * 0.4, -r * (0.9 + flip * 0.4), -r * 0.9, -r * (0.7 + flip * 0.5))
      ctx.quadraticCurveTo(-r * 0.5, -r * 0.3, -r * 0.1, -r * 0.2)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#e8a840'
      ctx.beginPath()
      ctx.moveTo(r * 1.05, -r * 0.1); ctx.lineTo(r * 1.5, 0); ctx.lineTo(r * 1.05, r * 0.1)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#0a0f14'
      ctx.beginPath(); ctx.arc(r * 0.8, -r * 0.2, r * 0.09, 0, TAU); ctx.fill()
      break
    }

    case 'turtle': {
      // snapper: a keeled shell and a beak with opinions
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.62, 0, 0, TAU); ctx.fill()
      ctx.strokeStyle = shade(c.col, -50); ctx.lineWidth = 1.4
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.ellipse(0, 0, r * (0.75 - Math.abs(i) * 0.22), r * (0.48 - Math.abs(i) * 0.14), 0, 0, TAU); ctx.stroke()
      }
      // keel spikes
      ctx.fillStyle = shade(c.col, -30)
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        ctx.moveTo(i * r * 0.32 - r * 0.1, -r * 0.5)
        ctx.lineTo(i * r * 0.32, -r * 0.82)
        ctx.lineTo(i * r * 0.32 + r * 0.1, -r * 0.5)
        ctx.closePath(); ctx.fill()
      }
      // flippers
      ctx.fillStyle = shade(c.col, 20)
      ctx.beginPath(); ctx.ellipse(r * 0.3, r * 0.6, r * 0.34, r * 0.14, 0.5 + Math.sin(t * 3 + c.wob) * 0.2, 0, TAU); ctx.fill()
      ctx.beginPath(); ctx.ellipse(-r * 0.5, r * 0.55, r * 0.3, r * 0.12, -0.4, 0, TAU); ctx.fill()
      // head + hooked beak
      ctx.fillStyle = shade(c.col, 34)
      ctx.beginPath(); ctx.arc(r * 1.15, -r * 0.05, r * 0.32, 0, TAU); ctx.fill()
      ctx.fillStyle = '#2a2418'
      ctx.beginPath()
      ctx.moveTo(r * 1.4, -r * 0.18); ctx.lineTo(r * 1.62, r * 0.05); ctx.lineTo(r * 1.34, r * 0.1)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#0a0f0a'
      ctx.beginPath(); ctx.arc(r * 1.14, -r * 0.16, r * 0.08, 0, TAU); ctx.fill()
      break
    }

    case 'fish':
    default: {
      ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.6, 0, 0, TAU); ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-r, 0); ctx.lineTo(-r * 1.6, -r * 0.5); ctx.lineTo(-r * 1.6, r * 0.5)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = hexA(c.col, 0.7)
      ctx.beginPath(); ctx.moveTo(0, -r * 0.5); ctx.lineTo(-r * 0.25, -r * 1.0); ctx.lineTo(-r * 0.55, -r * 0.4); ctx.closePath(); ctx.fill()
      if (c.lamps) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        for (let i = 0; i < 4; i++) {
          ctx.fillStyle = `rgba(160,240,255,${0.4 + 0.5 * Math.abs(Math.sin(t * 2.5 + i))})`
          ctx.beginPath(); ctx.arc(r * (0.4 - i * 0.35), r * 0.45, r * 0.11, 0, TAU); ctx.fill()
        }
        ctx.restore()
      }
      ctx.fillStyle = '#04121c'
      ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.1, r * 0.13, 0, TAU); ctx.fill()
      break
    }
  }
  ctx.restore()

  // a joined ally wears your colours
  if (c.joined) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2)
    g.addColorStop(0, hexA(stage().accent, 0.22))
    g.addColorStop(1, hexA(stage().accent, 0))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, y, r * 2, 0, TAU); ctx.fill()
    ctx.restore()
  }

  // a stunned creature sparks and drifts
  if (c.stunT > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = 'rgba(200,240,255,0.8)'
    ctx.lineWidth = 1.2
    for (let i = 0; i < 4; i++) {
      const a = now() * 0.02 + i * 1.6
      ctx.beginPath()
      ctx.moveTo(x + Math.cos(a) * r * 1.1, y + Math.sin(a) * r * 1.1)
      ctx.lineTo(x + Math.cos(a + 0.4) * r * 1.6, y + Math.sin(a + 0.4) * r * 1.6)
      ctx.stroke()
    }
    ctx.restore()
  }

  // a hunting predator gets a red glint so you can read the threat
  if (c.hunting) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2)
    g.addColorStop(0, 'rgba(255,60,60,0.28)')
    g.addColorStop(1, 'rgba(255,60,60,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, TAU); ctx.fill()
    ctx.restore()
  }
}

// ---- Boat drawing ------------------------------------------------------
function drawBoat(bt) {
  const T = bt.type
  const bx = sx(bt.x) + (bt.shake > 0 ? rand(-1, 1) * bt.shake * 6 : 0)
  const by = sy(SURFACE_Y) + Math.sin(bt.bob * 1.4) * 3
  const vh = window.innerHeight

  // --- gear below the waterline ---
  if (bt._hookX != null) {
    const hx = sx(bt._hookX), hy = sy(bt._hookY)
    if (player.hooked === bt) {
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'
      ctx.lineWidth = 1.6
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(sx(player.x), sy(player.y)); ctx.stroke()
    } else {
      ctx.strokeStyle = 'rgba(200,230,255,0.28)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx, (by + hy) / 2, hx, hy); ctx.stroke()
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 18)
      g.addColorStop(0, 'rgba(255,240,160,0.8)'); g.addColorStop(1, 'rgba(255,240,160,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(hx, hy, 18, 0, TAU); ctx.fill()
      ctx.restore()
      ctx.fillStyle = '#ffe6a0'
      ctx.beginPath(); ctx.arc(hx, hy, 3, 0, TAU); ctx.fill()
      ctx.strokeStyle = '#cddae6'
      ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(hx + 2, hy + 4, 3, Math.PI * 0.2, Math.PI * 1.4); ctx.stroke()
    }
  }
  if (bt.net && bt.net.torn <= 0 && bt._netX != null) {
    const nx = sx(bt._netX), ny = sy(bt._netY)
    const hw = bt.net.w / 2, hh = bt.net.h / 2
    ctx.strokeStyle = 'rgba(190,220,240,0.22)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(nx - hw * 0.6, ny - hh); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(nx + hw * 0.6, ny - hh); ctx.stroke()
    ctx.strokeStyle = 'rgba(200,230,250,0.3)'
    for (let i = 0; i <= 6; i++) {
      ctx.beginPath(); ctx.moveTo(nx - hw + (i * bt.net.w) / 6, ny - hh); ctx.lineTo(nx - hw + (i * bt.net.w) / 6, ny + hh); ctx.stroke()
    }
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(nx - hw, ny - hh + (i * bt.net.h) / 4); ctx.lineTo(nx + hw, ny - hh + (i * bt.net.h) / 4); ctx.stroke()
    }
  }
  // dreadnought searchlight
  if (T.gear === 'charges') {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createLinearGradient(bx, by, bx, by + 900)
    g.addColorStop(0, 'rgba(210,240,255,0.16)')
    g.addColorStop(1, 'rgba(210,240,255,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(bx - 16, by)
    ctx.lineTo(bx - 200, by + 900)
    ctx.lineTo(bx + 200, by + 900)
    ctx.lineTo(bx + 16, by)
    ctx.closePath(); ctx.fill()
    ctx.restore()
  }

  if (by < -120 || by > vh + 80) return

  // --- hull ---
  ctx.save()
  ctx.translate(bx, by)
  const w = T.w
  switch (T.key) {
    case 'skiff':
      ctx.fillStyle = '#20140c'
      ctx.beginPath()
      ctx.moveTo(-w * 0.5, -6); ctx.lineTo(w * 0.5, -6); ctx.lineTo(w * 0.36, 10); ctx.lineTo(-w * 0.36, 10)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#3a2a1a'
      ctx.fillRect(-w * 0.3, -26, 4, 20)
      lantern(-w * 0.28, -28)
      break
    case 'trawler':
      ctx.fillStyle = '#1c2a30'
      ctx.beginPath()
      ctx.moveTo(-w * 0.5, -10); ctx.lineTo(w * 0.5, -10); ctx.lineTo(w * 0.38, 12); ctx.lineTo(-w * 0.4, 12)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#33474f'
      ctx.fillRect(-w * 0.1, -30, w * 0.34, 20)
      ctx.fillStyle = '#8fd0e0'
      ctx.fillRect(-w * 0.04, -26, w * 0.1, 8)
      // net crane over the stern
      ctx.strokeStyle = '#55636b'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(-w * 0.3, -10); ctx.lineTo(-w * 0.44, -34); ctx.lineTo(-w * 0.62, -22); ctx.stroke()
      lantern(w * 0.3, -16)
      break
    case 'whaler':
      ctx.fillStyle = '#2b2320'
      ctx.beginPath()
      ctx.moveTo(-w * 0.5, -12); ctx.lineTo(w * 0.52, -12); ctx.lineTo(w * 0.4, 14); ctx.lineTo(-w * 0.42, 14)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#463a33'
      ctx.fillRect(-w * 0.18, -34, w * 0.3, 22)
      ctx.fillStyle = '#8a2c22'
      ctx.fillRect(-w * 0.02, -48, 7, 14)
      // harpoon cannon on the bow
      ctx.strokeStyle = '#7e8790'; ctx.lineWidth = 4
      ctx.beginPath(); ctx.moveTo(w * 0.3, -16); ctx.lineTo(w * 0.55, -24); ctx.stroke()
      ctx.fillStyle = '#5c666e'
      ctx.beginPath(); ctx.arc(w * 0.3, -14, 5, 0, TAU); ctx.fill()
      lantern(-w * 0.34, -20)
      break
    case 'dreadnought':
      ctx.fillStyle = '#39414a'
      ctx.beginPath()
      ctx.moveTo(-w * 0.5, -16); ctx.lineTo(w * 0.54, -16); ctx.lineTo(w * 0.42, 16); ctx.lineTo(-w * 0.44, 16)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#4b5560'
      ctx.fillRect(-w * 0.2, -44, w * 0.34, 28)
      ctx.fillStyle = '#2b333b'
      ctx.fillRect(-w * 0.06, -62, 10, 18)
      ctx.strokeStyle = '#6d7883'; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(w * 0.08, -44); ctx.lineTo(w * 0.14, -74); ctx.stroke()
      // turrets
      ctx.fillStyle = '#59636d'
      for (const tx of [-w * 0.34, w * 0.3]) {
        ctx.beginPath(); ctx.arc(tx, -20, 9, Math.PI, 0); ctx.fill()
        ctx.strokeStyle = '#7c8791'; ctx.lineWidth = 3
        ctx.beginPath(); ctx.moveTo(tx, -24); ctx.lineTo(tx + (tx < 0 ? -18 : 18), -32); ctx.stroke()
      }
      lantern(w * 0.44, -22)
      break
  }
  // damage: smoke and a hull bar once you've started chewing
  if (bt.hp < bt.maxHp) {
    const f = clamp(bt.hp / bt.maxHp, 0, 1)
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(-w * 0.35, -T.w * 0.55 - 16, w * 0.7, 4)
    ctx.fillStyle = f > 0.5 ? '#8fe08f' : f > 0.25 ? '#e8d06a' : '#e2604f'
    ctx.fillRect(-w * 0.35, -T.w * 0.55 - 16, w * 0.7 * f, 4)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < 3; i++) {
      const p = (now() * 0.0004 + i * 0.33) % 1
      ctx.fillStyle = `rgba(120,110,105,${(1 - p) * 0.4 * (1 - f)})`
      ctx.beginPath(); ctx.arc(rand(-w * 0.2, w * 0.2), -20 - p * 70, 6 + p * 22, 0, TAU); ctx.fill()
    }
    ctx.restore()
  }
  if (bt.alarm > 0.1) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(now() * 0.008))
    const g = ctx.createRadialGradient(0, -T.w * 0.4, 0, 0, -T.w * 0.4, 40)
    g.addColorStop(0, `rgba(255,60,50,${bt.alarm * pulse * 0.75})`)
    g.addColorStop(1, 'rgba(255,60,50,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(0, -T.w * 0.4, 40, 0, TAU); ctx.fill()
    ctx.restore()
  }
  ctx.restore()

  function lantern(lx, ly) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 24)
    g.addColorStop(0, 'rgba(255,210,120,0.65)'); g.addColorStop(1, 'rgba(255,210,120,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(lx, ly, 24, 0, TAU); ctx.fill()
    ctx.restore()
  }
}

// ---- Frame -------------------------------------------------------------
function frame(t) {
  const dt = Math.min(0.05, (t - last) / 1000) || 0.016
  last = t
  // The world holds its breath behind the start card: nothing moves, nothing
  // hunts, until "rise from the vents" hands over the controls.
  updateTilt(dt)
  if (interactive) update(dt)
  draw()
  requestAnimationFrame(frame)
}

// ---- Start -------------------------------------------------------------
const startScreen = document.getElementById('start-screen')
document.getElementById('start-btn').addEventListener('click', () => {
  startScreen.classList.add('hidden')
  interactive = true
  mouse.x = window.innerWidth / 2
  mouse.y = window.innerHeight / 2
})
document.getElementById('continue-btn').addEventListener('click', () => {
  document.getElementById('end-screen').classList.add('hidden')
})
document.getElementById('restart-btn').addEventListener('click', () => {
  location.reload()
})
document.getElementById('fresh-btn').addEventListener('click', () => {
  document.getElementById('core-end-screen').classList.add('hidden')
  enterFreshwater()
})
document.getElementById('core-stay-btn').addEventListener('click', () => {
  document.getElementById('core-end-screen').classList.add('hidden')
})
document.getElementById('core-restart-btn').addEventListener('click', () => {
  location.reload()
})

// The scene runs from the first frame so the deep is already alive behind the
// start card; clicking start just hands over the controls.
last = performance.now()
requestAnimationFrame(frame)

// Jump straight to a form or a depth — handy for looking at the later monsters
// and the deeper zones without eating your way there: `abyss.evolve(8)`.
window.abyss = {
  evolve(i) {
    player.stageIndex = clamp(Math.floor(i), 0, STAGES.length - 1)
    player.biomass = STAGES[player.stageIndex].biomass
    return STAGES[player.stageIndex].name
  },
  dive(y) {
    player.y = clamp(y, SKY_TOP + 100, floorY() - 20)
    player.spine.forEach((p, i) => { p.x = player.x - i * 6; p.y = player.y })
    cam.y = clamp(player.y - window.innerHeight / 2, SKY_TOP, floorY() - window.innerHeight)
    return zoneAt(player.y).name
  },
  swim(x) {
    player.x = x
    player.spine.forEach((p, i) => { p.x = player.x - i * 6 })
    return zoneAt(player.y).name
  },
  ability: () => fireAbility(),
  moon: () => ({ hp: MOON.hp, dx: Math.round(MOON.x - player.x), dy: Math.round(MOON.y - player.y), awake: MOON.awake, eaten: MOON.eaten }),
  core: () => ({ hp: CORE.hp, dx: Math.round(CORE.x - player.x), dy: Math.round(CORE.y - player.y), awake: CORE.awake, eaten: CORE.eaten, open: worldFloorOpen }),
  openFloor() { worldFloorOpen = true; MOON.eaten = true; return 'the seafloor splits' },
  fresh: () => { enterFreshwater(); return realm },
  allies: () => creatures.filter((c) => c.isAlly).map((c) => ({ key: c.key, joined: c.joined, hp: Math.round(c.hp) })),
  boats: () => boats.map((b) => ({ name: b.type.name, dx: Math.round(b.x - player.x), hp: b.hp })),
  creatures: () => creatures.map((c) => ({ key: c.key, r: Math.round(c.r), sx: Math.round(sx(c.x)), sy: Math.round(sy(c.y)) })),
  stages: STAGES.map((s) => s.name),
  zones: ZONES.map((z) => z.name).concat(AIR_ZONES.map((z) => z.name)).concat(CORE_ZONES.map((z) => z.name)),
}




