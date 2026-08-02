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
// float); worldY = WORLD_H is the seafloor. Horizontally the world is endless.
const WORLD_H = 7600
// The waterline sits well below the top of the viewport so there is room to see
// the hulls — and to watch a kraken take one apart.
const SURFACE_Y = 155
const METERS = 1.45 // world units -> displayed metres

// ---- Depth zones -------------------------------------------------------
// Seven bands, each with its own light, scenery and residents.
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
]
function waterColor(y) {
  const d = clamp(y, 0, WORLD_H)
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

// ---- Stages ------------------------------------------------------------
// Every evolution is a different animal, not just a bigger worm: `form` picks
// the renderer, `seg`/`space`/`width` set the silhouette, `reach` is how far
// the maw (or the arms) can grab.
const STAGES = [
  { name: 'Larva',           form: 'larva',   biomass: 0,    seg: 9,  space: 1.00, width: 5,  reach: 1.5, color: '#8fe9ff', accent: '#e8fdff' },
  { name: 'Lanternfish',     form: 'lantern', biomass: 35,   seg: 12, space: 1.00, width: 8,  reach: 1.5, color: '#6fd0ff', accent: '#eaff9c' },
  { name: 'Ribbon Eel',      form: 'ribbon',  biomass: 95,   seg: 30, space: 0.80, width: 10, reach: 1.6, color: '#4fb6ff', accent: '#9cffd8' },
  { name: 'Viperfish',       form: 'viper',   biomass: 190,  seg: 18, space: 1.00, width: 13, reach: 1.9, color: '#2f6f9e', accent: '#7dfcff' },
  { name: 'Gulper Eel',      form: 'gulper',  biomass: 330,  seg: 28, space: 0.85, width: 16, reach: 2.3, color: '#3b5580', accent: '#ff9d4d' },
  { name: 'Sea Serpent',     form: 'serpent', biomass: 540,  seg: 38, space: 0.90, width: 20, reach: 1.8, color: '#3f7bff', accent: '#8affd0' },
  { name: 'Bone Shark',      form: 'shark',   biomass: 820,  seg: 18, space: 1.10, width: 25, reach: 1.8, color: '#8d97a6', accent: '#e8f7ff' },
  { name: 'Leviathan',       form: 'whale',   biomass: 1200, seg: 20, space: 1.15, width: 33, reach: 2.1, color: '#5a52d8', accent: '#ff6aa8' },
  { name: 'The Kraken',      form: 'kraken',  biomass: 1750, seg: 18, space: 0.95, width: 42, reach: 3.1, color: '#6a2f9e', accent: '#ff3b6b' },
  { name: 'The Drowned God', form: 'god',     biomass: 2500, seg: 20, space: 1.00, width: 54, reach: 3.5, color: '#3b1150', accent: '#ffd166' },
]
const KRAKEN_STAGE = STAGES.findIndex((s) => s.form === 'kraken')
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
}
function initSpine() {
  player.spine = []
  for (let i = 0; i < MAX_SEG; i++) player.spine.push({ x: player.x, y: player.y + i * 6 })
}
initSpine()

function stage() { return STAGES[player.stageIndex] }
function nextStage() { return STAGES[player.stageIndex + 1] }
function segCount() { return stage().seg }

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
    if (player.stageIndex === KRAKEN_STAGE) queueBanner('THE BOATS ARE PREY NOW', 2.8)
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
  { key: 'tubeworm',    r: 14, tier: 2, speed: 0.06,col: '#e8536b', shape: 'tube',   glow: 0.3,  zone: [6100, 7600] },
  { key: 'yeticrab',    r: 17, tier: 3, speed: 0.5, col: '#f2ead9', shape: 'bug',    glow: 0.15, zone: [5800, 7600] },
  { key: 'magmaeel',    r: 40, tier: 7, speed: 1.6, col: '#ff6a3d', shape: 'eel',    glow: 0.75, zone: [5600, 7600], pred: true, ability: 'shock', aggro: 580, bold: true },
  { key: 'siphonophore',r: 44, tier: 6, speed: 0.3, col: '#7affd8', shape: 'siphon', glow: 0.9,  zone: [4200, 7200], ability: 'sting' },

  // --- the cradle ---
  { key: 'hagfish',     r: 21, tier: 3, speed: 1.0, col: '#8f8674', shape: 'eel',    glow: 0.05, zone: [6300, 7600], ability: 'slime' },
  { key: 'eldersquid',  r: 78, tier: 9, speed: 1.7, col: '#5b2b8a', shape: 'squid',  glow: 0.55, zone: [6500, 7600], pred: true, ability: 'ink', aggro: 860, bold: true },
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
    r: sp.r * rand(0.82, 1.22),
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
  }
}

function spawnCreature(nearPlayer) {
  if (creatures.length >= CREATURE_CAP) return
  const pw = player.headW
  const y = nearPlayer
    ? clamp(player.y + rand(-460, 460), 90, WORLD_H - 40)
    : rand(120, WORLD_H - 40)
  // Only things that live at this depth, biased toward sizes that matter to a
  // creature our size — always something to eat and something to fear.
  const here = SPECIES.filter((s) => y >= s.zone[0] && y <= s.zone[1])
  let pool = here.filter((s) => s.r < pw * 3.6 && s.r > pw * 0.1)
  if (!pool.length) pool = here
  if (!pool.length) pool = SPECIES
  let sp = pool[Math.floor(Math.random() * pool.length)]
  // predators are the spice, not the meal — re-roll half of them
  if (sp.pred && Math.random() < 0.5) sp = pool[Math.floor(Math.random() * pool.length)]

  // Spawn just beyond a screen edge so things drift into view.
  const edge = Math.random() < 0.5 ? -1 : 1
  const x = player.x + edge * window.innerWidth * rand(0.25, 0.66)
  const n = sp.swarm ? Math.ceil(sp.swarm * rand(0.5, 1)) : 1
  for (let i = 0; i < n; i++) {
    if (creatures.length >= CREATURE_CAP) return
    creatures.push(makeCreature(
      sp,
      x + (n > 1 ? rand(-70, 70) : 0),
      clamp(y + (n > 1 ? rand(-50, 50) : 0), sp.zone[0], sp.zone[1])
    ))
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
  shocks.push({ x, y, r: 8, max, a: 1, hit: false, dmg: opts.dmg ?? 22, stun: opts.stun ?? 0.7, col: opts.col || '#9fe8ff' })
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
const motes = []       // marine snow / bioluminescent drift
for (let i = 0; i < 190; i++) {
  motes.push({ x: rand(-2200, 2200), y: rand(0, WORLD_H), r: rand(0.4, 1.9), s: rand(0.2, 0.8), b: rand(0.15, 0.7) })
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
  depthLabel.textContent = zoneAt(player.y).name + ' · ' + Math.round(player.y * METERS) + ' m'
  biomassLabel.textContent = 'biomass ' + Math.floor(player.biomass)
  const fx = []
  if (player.netted) fx.push('NETTED')
  if (player.hooked) fx.push('HOOKED')
  if (player.stun > 0) fx.push('STUNNED')
  if (player.inked > 0.15) fx.push('INKED')
  if (player.slow > 0) fx.push('SLOWED')
  effectLabel.textContent = fx.join(' · ')
  effectLabel.style.opacity = fx.length ? '1' : '0'
}

// ---- Game state --------------------------------------------------------
let interactive = false   // false = attract mode behind the start card
let last = 0
let spawnAcc = 0
let boatAcc = 0
let wander = { t: 0 }

function update(dt) {
  const s = stage()

  // --- steering target: the cursor, or a lazy wander in attract mode ---
  let tx, ty
  if (interactive) {
    tx = player.x + (mouse.x - window.innerWidth / 2)
    ty = cam.y + mouse.y
  } else {
    wander.t += dt
    tx = player.x + Math.cos(wander.t * 0.45) * 300
    ty = START_Y + Math.sin(wander.t * 0.31) * 160
  }

  // --- player movement ---
  const control = player.stun > 0 ? 0 : 1
  const drag = (player.slow > 0 ? 0.5 : 1) * (player.netted ? 0.4 : 1)
  const speed = (3.2 + player.stageIndex * 0.38) * drag
  let dx = tx - player.x
  let dy = ty - player.y
  const dist = Math.hypot(dx, dy) || 1
  const acc = Math.min(dist, speed * 60) * dt
  player.vx += (dx / dist) * acc * 0.9 * control
  player.vy += (dy / dist) * acc * 0.9 * control
  player.vx *= 0.86
  player.vy *= 0.86

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
  player.y = clamp(player.y, SURFACE_Y + 18, WORLD_H - 14)

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
  cam.y = clamp(cam.y, 0, WORLD_H - window.innerHeight)

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
    // Anything much smaller than a mouthful isn't worth a predator's time.
    const noticed = player.headW > c.r * 0.22
    const canEatUs = c.r > player.headW * 1.05
    c.hunting = c.pred && noticed && (canEatUs || c.bold) && dp < c.aggro ? 1 : 0

    if (c.hunting) {
      c.dir = dxp > 0 ? 1 : -1
      c.vy += (dyp / dp) * 0.16
    } else if (!c.pred && !c.sink && player.headW > c.r * 1.3 && dp < 240) {
      // prey scatters from something big
      c.dir = dxp > 0 ? -1 : 1
      c.vy -= (dyp / dp) * 0.14
    }

    // --- abilities ---
    switch (c.ability) {
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
          if (c.windup <= 0) shockRing(c.x, c.y, c.r * 7, { dmg: 18 + c.r * 0.5, stun: 0.6, col: c.key === 'magmaeel' ? '#ffb060' : '#9fe8ff' })
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
            shockRing(c.x, c.y, 660, { dmg: 30, stun: 1.1, col: '#cfe6ff' })
            c.dash = 1.2
            c.dashA = Math.atan2(dyp, dxp)
            c.dashS = 8
          }
        }
        break
    }

    // --- motion ---
    if (c.dash > 0) {
      c.dash -= dt
      c.x += Math.cos(c.dashA) * c.dashS * dt * 60
      c.y += Math.sin(c.dashA) * c.dashS * dt * 60
    } else {
      const sp = c.speed * (c.hunting ? 1.9 : 1) * (0.6 + Math.sin(c.wob) * 0.2)
      c.x += c.dir * sp * dt * 60
      c.vy = c.vy * 0.94 + Math.sin(c.wob * 0.7) * 0.06
      c.y += c.vy * dt * 60
    }
    if (c.sink) c.y += 32 * dt
    c.y = clamp(c.y, c.minY, Math.min(WORLD_H - 18, c.maxY))

    // recycle anything that wanders far off-screen
    if (Math.abs(c.x - player.x) > window.innerWidth * 1.5 || Math.abs(c.y - player.y) > window.innerHeight * 1.6) {
      creatures.splice(i, 1)
      continue
    }

    // --- contact ---
    const d = Math.hypot(c.x - player.x, c.y - player.y)
    if (d < eatR + c.r) {
      const spiky = c.ability === 'spike' && c.puffed > 0.35
      if (c.r < player.headW * 1.05 && !spiky) {
        addBiomass(2 + c.r * 1.15 + c.tier * 5)
        puff(c.x, c.y, c.col)
        player.flash = 1
        player.maw = 1
        // stingers are worth eating, but they get one last shot in
        if (c.ability === 'sting' && player.headW < c.r * 2.6) loseBiomass(8 + c.r * 0.4)
        creatures.splice(i, 1)
        continue
      }
      const dangerous = c.pred || spiky || c.ability === 'sting'
      if (dangerous && player.hurt <= 0 && c.biteCd <= 0) {
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
  if (boatAcc > 6 && boats.length < maxBoats) { boatAcc = 0; spawnBoat() }
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
    if (Math.hypot(h.x - player.x, h.y - player.y) < player.headW + 8 && player.hurt <= 0) {
      loseBiomass(50 + player.stageIndex * 8)
      showBanner('HARPOONED!')
      puff(player.x, player.y, '#ff5a5a')
      cam.shake = Math.max(cam.shake, 0.35)
      harpoons.splice(i, 1)
      continue
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
      shockRing(ch.x, ch.y, 260, { dmg: 60, stun: 0.5, col: '#ffd6a0' })
      puff(ch.x, ch.y, '#ffd6a0')
      ripple(ch.x, ch.y, 200, '#ffd6a0')
      cam.shake = Math.max(cam.shake, 0.6)
      charges.splice(i, 1)
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
    if (!sh.hit && Math.hypot(sh.x - player.x, sh.y - player.y) < sh.r + player.headW) {
      sh.hit = true
      if (player.hurt <= 0) {
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
    if (m.y > WORLD_H) m.y = 0
  }
  for (const b of bubbles) {
    b.y -= b.s * dt
    if (b.y < SURFACE_Y) { b.y = 2400; b.x = player.x + rand(-1400, 1400) }
  }
  for (let i = queuedBanners.length - 1; i >= 0; i--) {
    queuedBanners[i].t -= dt
    if (queuedBanners[i].t <= 0) { showBanner(queuedBanners[i].text); queuedBanners.splice(i, 1) }
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

  // --- background depth gradient ---
  const g = ctx.createLinearGradient(0, 0, 0, vh)
  const top = waterColor(cam.y)
  const bot = waterColor(cam.y + vh)
  g.addColorStop(0, `rgb(${top[0]},${top[1]},${top[2]})`)
  g.addColorStop(1, `rgb(${bot[0]},${bot[1]},${bot[2]})`)
  ctx.fillStyle = g
  ctx.fillRect(-20, -20, vw + 40, vh + 40)

  // sunlight god-rays near the surface
  if (cam.y < 1100) {
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

  // waterline + sky sliver
  const wy = sy(SURFACE_Y)
  if (wy > -280 && wy < vh + 40) {
    const sky = ctx.createLinearGradient(0, wy - 260, 0, wy)
    sky.addColorStop(0, '#060f1e')
    sky.addColorStop(1, '#12405a')
    ctx.fillStyle = sky
    ctx.fillRect(-20, wy - 260, vw + 40, 260)
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

  // shallow water: drifting weed mats
  if (camTop < 1400) {
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
  if (camBot > 5600) {
    drawVents(vw, vh)
    drawEggBeds(vw, vh)
  }

  // seafloor
  const fy = sy(WORLD_H)
  if (fy < vh + 60) {
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
  update(dt)
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
    player.y = clamp(y, SURFACE_Y + 20, WORLD_H - 20)
    player.spine.forEach((p, i) => { p.x = player.x - i * 6; p.y = player.y })
    cam.y = clamp(player.y - window.innerHeight / 2, 0, WORLD_H - window.innerHeight)
    return zoneAt(player.y).name
  },
  boats: () => boats.map((b) => ({ name: b.type.name, dx: Math.round(b.x - player.x), hp: b.hp })),
  creatures: () => creatures.map((c) => ({ key: c.key, r: Math.round(c.r), sx: Math.round(sx(c.x)), sy: Math.round(sy(c.y)) })),
  stages: STAGES.map((s) => s.name),
  zones: ZONES.map((z) => z.name),
}




