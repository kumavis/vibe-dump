// Abyssal Ascent — a deep-ocean creature that evolves into a sea monster by
// eating everything smaller than it, rising from the midnight zone toward the
// surface where the fishing boats wait. Pure canvas 2D, no dependencies.

const canvas = document.getElementById('ocean')
const ctx = canvas.getContext('2d')

let W = 0
let H = 0
function resize() {
  W = canvas.width = Math.floor(window.innerWidth * devicePixelRatio)
  H = canvas.height = Math.floor(window.innerHeight * devicePixelRatio)
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'
}
resize()
window.addEventListener('resize', resize)

// ---- World -------------------------------------------------------------
// A tall vertical column. worldY = 0 is the surface (waterline where boats
// float); worldY = WORLD_H is the seafloor. The camera follows the player.
const WORLD_H = 4200
const SURFACE_Y = 70 // where boat hulls sit
const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const TAU = Math.PI * 2

// depth zone helpers ------------------------------------------------------
function zoneName(y) {
  if (y < 520) return 'Sunlight Zone'
  if (y < 1500) return 'Twilight Zone'
  return 'Midnight Zone'
}
// Background water color at a given world depth.
function waterColor(y) {
  const t = clamp(y / WORLD_H, 0, 1)
  // teal at surface -> deep blue -> near-black abyss
  const top = [26, 96, 120]
  const mid = [8, 30, 70]
  const bot = [1, 3, 9]
  let a, b, k
  if (t < 0.35) { a = top; b = mid; k = t / 0.35 }
  else { a = mid; b = bot; k = (t - 0.35) / 0.65 }
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ]
}

// ---- Stages ------------------------------------------------------------
// Each evolution the creature gets longer, wider, faster to eat, and gains
// new monstrous features.
const STAGES = [
  { name: 'Larva',      biomass: 0,    seg: 8,  width: 5,  color: '#8fe9ff', accent: '#d9fbff' },
  { name: 'Lanternfish', biomass: 45,  seg: 12, width: 9,  color: '#6fd0ff', accent: '#eaff9c' },
  { name: 'Ribbon Eel', biomass: 130,  seg: 20, width: 12, color: '#4fb6ff', accent: '#9cffd8' },
  { name: 'Sea Serpent', biomass: 300, seg: 30, width: 17, color: '#3f7bff', accent: '#8affd0' },
  { name: 'Leviathan',  biomass: 560,  seg: 40, width: 24, color: '#5a52d8', accent: '#ff6aa8' },
  { name: 'The Kraken', biomass: 950, seg: 52, width: 33, color: '#6a2f9e', accent: '#ff3b6b' },
]

// ---- Input -------------------------------------------------------------
const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false }
function setMouse(e) {
  const t = e.touches ? e.touches[0] : e
  mouse.x = t.clientX
  mouse.y = t.clientY
  mouse.active = true
}
window.addEventListener('mousemove', setMouse)
window.addEventListener('touchmove', (e) => { setMouse(e); e.preventDefault() }, { passive: false })
window.addEventListener('touchstart', setMouse, { passive: true })

// ---- Camera ------------------------------------------------------------
const cam = { y: WORLD_H - 700 }

// ---- Player ------------------------------------------------------------
const player = {
  x: 0,
  y: WORLD_H - 620,
  vx: 0,
  vy: 0,
  biomass: 0,
  stageIndex: 0,
  spine: [],
  headW: STAGES[0].width,
  hooked: null,   // reference to hook currently snagging us
  strain: 0,      // struggle progress to snap a line
  flash: 0,       // white eat flash
  hurt: 0,        // red hurt flash
}
function initSpine() {
  player.spine = []
  for (let i = 0; i < STAGES[STAGES.length - 1].seg; i++) {
    player.spine.push({ x: player.x, y: player.y + i * 6 })
  }
}
initSpine()

function stage() { return STAGES[player.stageIndex] }
function nextStage() { return STAGES[player.stageIndex + 1] }

function addBiomass(n) {
  player.biomass += n
  const nx = nextStage()
  if (nx && player.biomass >= nx.biomass) {
    player.stageIndex++
    evolveBanner(STAGES[player.stageIndex].name)
    ripple(player.x, player.y, 90, '#8affff')
  }
}
function loseBiomass(n) {
  player.biomass = Math.max(0, player.biomass - n)
  // de-evolve if we drop below the current stage threshold
  while (player.stageIndex > 0 && player.biomass < STAGES[player.stageIndex].biomass) {
    player.stageIndex--
  }
  player.hurt = 1
}

// active segment count for current stage
function segCount() { return stage().seg }

// ---- Creatures (prey + predators) --------------------------------------
const creatures = []
const CREATURE_CAP = 90

// Palette of little critters. tier roughly = how big/dangerous.
const SPECIES = [
  { key: 'plankton', r: 3,  tier: 0, speed: 0.3, col: '#bff6ff', shape: 'dot', glow: 0.5, minY: 200 },
  { key: 'shrimp',   r: 6,  tier: 1, speed: 0.7, col: '#ff9d7a', shape: 'shrimp', glow: 0.2, minY: 400 },
  { key: 'minnow',   r: 8,  tier: 1, speed: 1.5, col: '#d7f0ff', shape: 'fish', glow: 0.1, minY: 0 },
  { key: 'jelly',    r: 14, tier: 2, speed: 0.35, col: '#c9a5ff', shape: 'jelly', glow: 0.9, minY: 300 },
  { key: 'squid',    r: 16, tier: 2, speed: 1.1, col: '#ff8fc4', shape: 'squid', glow: 0.6, minY: 700 },
  { key: 'fish',     r: 18, tier: 3, speed: 1.3, col: '#9fe0c0', shape: 'fish', glow: 0.1, minY: 100 },
  { key: 'anglerfish', r: 24, tier: 4, speed: 0.9, col: '#5a6b7a', shape: 'angler', glow: 1.0, minY: 1600, pred: true },
  { key: 'shark',    r: 34, tier: 5, speed: 1.7, col: '#7d8a99', shape: 'shark', glow: 0, minY: 0, pred: true },
  { key: 'grouper',  r: 40, tier: 6, speed: 0.8, col: '#8a9d76', shape: 'fish', glow: 0, minY: 900 },
]

function spawnCreature(nearPlayer) {
  if (creatures.length >= CREATURE_CAP) return
  // Bias spawns toward species around the player's current power so there is
  // always something to eat and something to fear.
  const pw = player.headW
  const pool = SPECIES.filter((s) => s.r < pw * 3.2 && s.r > pw * 0.12)
  const sp = (pool.length ? pool : SPECIES)[Math.floor(Math.random() * (pool.length || SPECIES.length))]

  let y
  if (nearPlayer) {
    y = clamp(player.y + rand(-360, 360), sp.minY, WORLD_H - 30)
  } else {
    y = rand(Math.max(sp.minY, 120), WORLD_H - 30)
  }
  // Spawn just inside/beyond a screen edge so prey drift across the view and
  // are actually reachable, then swim toward the player's side.
  const edge = Math.random() < 0.5 ? -1 : 1
  const spawnX = player.x + edge * window.innerWidth * rand(0.2, 0.62)
  creatures.push({
    x: spawnX,
    y,
    r: sp.r * rand(0.8, 1.25),
    baseR: sp.r,
    dir: spawnX > player.x ? -1 : 1,
    speed: sp.speed,
    col: sp.col,
    shape: sp.shape,
    glow: sp.glow,
    tier: sp.tier,
    pred: !!sp.pred,
    sp,
    wob: rand(0, TAU),
    vy: 0,
  })
}
// seed the world — some scattered through the column, plenty around the start
for (let i = 0; i < 40; i++) spawnCreature(false)
for (let i = 0; i < 22; i++) spawnCreature(true)

// ---- Boats + fishing gear ----------------------------------------------
const boats = []
const harpoons = []
function spawnBoat() {
  const fromLeft = Math.random() < 0.5
  boats.push({
    x: player.x + rand(-1, 1) * 400,
    dir: fromLeft ? 1 : -1,
    vx: rand(0.4, 0.9),
    hookDepth: rand(360, 900),
    line: rand(340, 880),
    bob: rand(0, TAU),
    reload: rand(2, 5),
  })
}
for (let i = 0; i < 3; i++) spawnBoat()

// ---- Particles / FX ----------------------------------------------------
const motes = []       // marine snow / bioluminescent drift
for (let i = 0; i < 160; i++) {
  motes.push({ x: rand(-2000, 2000), y: rand(0, WORLD_H), r: rand(0.4, 1.8), s: rand(0.2, 0.8), b: rand(0.15, 0.7) })
}
const ripples = []
function ripple(x, y, r, col) { ripples.push({ x, y, r: 6, max: r, col, a: 1 }) }
const bites = [] // eat puffs
function puff(x, y, col) {
  for (let i = 0; i < 8; i++) {
    bites.push({ x, y, vx: rand(-2, 2), vy: rand(-2, 2), a: 1, col, r: rand(1.5, 3.5) })
  }
}

// ---- Banners -----------------------------------------------------------
const bannerEl = document.getElementById('banner')
let bannerTimer = 0
function showBanner(text) {
  bannerEl.textContent = text
  bannerEl.classList.remove('show')
  void bannerEl.offsetWidth
  bannerEl.classList.add('show')
  bannerTimer = 2.4
}
function evolveBanner(name) { showBanner('EVOLVED · ' + name) }

// ---- HUD ---------------------------------------------------------------
const stageNameEl = document.getElementById('stage-name')
const barFill = document.getElementById('bar-fill')
const depthLabel = document.getElementById('depth-label')
const biomassLabel = document.getElementById('biomass-label')
function updateHUD() {
  const s = stage()
  const nx = nextStage()
  stageNameEl.textContent = s.name
  if (nx) {
    const span = nx.biomass - s.biomass
    const prog = clamp((player.biomass - s.biomass) / span, 0, 1)
    barFill.style.width = (prog * 100).toFixed(1) + '%'
  } else {
    barFill.style.width = '100%'
  }
  depthLabel.textContent = zoneName(player.y)
  biomassLabel.textContent = 'biomass ' + Math.floor(player.biomass)
}

// ---- Game loop ---------------------------------------------------------
let running = false
let last = 0
let spawnAcc = 0
let boatAcc = 0

function update(dt) {
  // --- player movement ---
  const targetWorldX = player.x + (mouse.x - window.innerWidth / 2)
  const targetWorldY = cam.y + mouse.y
  let dx = targetWorldX - player.x
  let dy = targetWorldY - player.y
  const dist = Math.hypot(dx, dy) || 1
  const speed = 3.4 + player.stageIndex * 0.55
  const acc = Math.min(dist, speed * 60) * dt
  player.vx += (dx / dist) * acc * 0.9
  player.vy += (dy / dist) * acc * 0.9
  player.vx *= 0.86
  player.vy *= 0.86

  // being reeled in by a hook
  if (player.hooked) {
    const hk = player.hooked
    const hx = hk.boat.x
    const hy = SURFACE_Y + 24
    const pull = 42 * dt
    const a = Math.atan2(hy - player.y, hx - player.x)
    player.vx += Math.cos(a) * pull
    player.vy += Math.sin(a) * pull
    // struggle: moving hard against the pull builds strain to snap the line.
    const against = -(Math.cos(a) * player.vx + Math.sin(a) * player.vy)
    const strength = 0.25 + player.stageIndex * 0.5 // bigger monsters snap lines
    player.strain += Math.max(0, against) * 0.006 * strength * dt * 60
    if (player.strain >= 1) {
      player.hooked = null
      player.strain = 0
      showBanner('SNAPPED THE LINE')
      ripple(player.x, player.y, 70, '#8affff')
    } else if (player.y < SURFACE_Y + 60) {
      // reeled to the boat — caught. Lose a chunk of biomass, get released.
      player.hooked = null
      player.strain = 0
      loseBiomass(player.biomass * 0.35 + 40)
      showBanner('CAUGHT! · thrown back')
      player.y = SURFACE_Y + 120
      player.vy = 240
      for (let i = 0; i < 3; i++) ripple(player.x + rand(-40, 40), SURFACE_Y + 20, 60, '#cfe9ff')
    }
  }

  player.x += player.vx
  player.y += player.vy
  player.y = clamp(player.y, SURFACE_Y + 18, WORLD_H - 14)

  // --- spine follows head ---
  const spacing = 4 + stage().width * 0.35
  player.spine[0].x = player.x
  player.spine[0].y = player.y
  const n = segCount()
  for (let i = 1; i < n; i++) {
    const a = player.spine[i - 1]
    const b = player.spine[i]
    let ax = b.x - a.x
    let ay = b.y - a.y
    const d = Math.hypot(ax, ay) || 1
    b.x = a.x + (ax / d) * spacing
    b.y = a.y + (ay / d) * spacing
  }
  player.headW = stage().width

  // --- camera ---
  cam.y += (player.y - window.innerHeight * 0.5 - cam.y) * Math.min(1, dt * 3)
  cam.y = clamp(cam.y, 0, WORLD_H - window.innerHeight)

  // --- creatures ---
  spawnAcc += dt
  const wantSpawn = 0.22
  if (spawnAcc > wantSpawn) { spawnAcc = 0; spawnCreature(true) }

  const eatR = player.headW * 1.5
  for (let i = creatures.length - 1; i >= 0; i--) {
    const c = creatures[i]
    c.wob += dt * 3
    // predators chase the player if it's smaller than them
    const canBiteUs = c.pred && c.r > player.headW * 1.1
    if (canBiteUs && Math.abs(c.y - player.y) < 320 && Math.abs(c.x - player.x) < 480) {
      c.dir = player.x > c.x ? 1 : -1
      c.vy += ((player.y - c.y) > 0 ? 1 : -1) * 0.05
    }
    c.x += c.dir * c.speed * (0.6 + Math.sin(c.wob) * 0.2) * dt * 60
    c.vy = (c.vy || 0) * 0.94 + Math.sin(c.wob * 0.7) * 0.06
    c.y = clamp(c.y + c.vy * dt * 60, c.sp.minY, WORLD_H - 20)

    // recycle far-away creatures
    if (Math.abs(c.x - player.x) > window.innerWidth * 1.4 || Math.abs(c.y - player.y) > window.innerHeight * 1.5) {
      creatures.splice(i, 1)
      continue
    }

    const d = Math.hypot(c.x - player.x, c.y - player.y)
    if (d < eatR + c.r) {
      if (c.r < player.headW * 1.05) {
        // eat it
        addBiomass(2 + c.r * 0.9 + c.tier * 3)
        puff(c.x, c.y, c.col)
        player.flash = 1
        creatures.splice(i, 1)
      } else if (c.pred && d < c.r + player.headW * 0.6) {
        // too big — it bites us
        if (player.hurt <= 0) {
          loseBiomass(20 + c.r)
          puff(player.x, player.y, '#ff5a5a')
          player.vx += (player.x - c.x) * 0.4
          player.vy += (player.y - c.y) * 0.4
        }
      }
    }
  }

  // --- boats + hooks ---
  boatAcc += dt
  if (boatAcc > 6 && boats.length < 5) { boatAcc = 0; spawnBoat() }
  for (let i = boats.length - 1; i >= 0; i--) {
    const bt = boats[i]
    bt.x += bt.dir * bt.vx * dt * 60
    bt.bob += dt
    // sway the hook line and let it slowly seek toward the player's depth
    bt.hookDepth += clamp((clamp(player.y - SURFACE_Y, 90, 1150) - bt.hookDepth), -60, 60) * dt * 0.5
    const hookX = bt.x + Math.sin(bt.bob) * 24
    const hookY = SURFACE_Y + 30 + bt.hookDepth
    // snag check
    if (!player.hooked) {
      const hd = Math.hypot(hookX - player.x, hookY - player.y)
      if (hd < player.headW + 18) {
        player.hooked = { boat: bt }
        player.strain = 0
        showBanner('HOOKED! · thrash to break free')
      }
    }
    // recycle boats that drift far
    if (Math.abs(bt.x - player.x) > window.innerWidth * 1.3) { boats.splice(i, 1); continue }

    // harpoons: thrown at big monsters that surface into the sunlight zone
    if (player.stageIndex >= 3 && player.y < 700 && !player.hooked) {
      bt.reload -= dt
      if (bt.reload <= 0) {
        bt.reload = rand(2.5, 4.5)
        const a = Math.atan2(player.y - (SURFACE_Y + 20), player.x - bt.x)
        harpoons.push({ x: bt.x, y: SURFACE_Y + 20, vx: Math.cos(a) * 7.5, vy: Math.sin(a) * 7.5, life: 3, a })
      }
    }
    bt._hookX = hookX
    bt._hookY = hookY
  }

  // harpoons
  for (let i = harpoons.length - 1; i >= 0; i--) {
    const h = harpoons[i]
    h.x += h.vx * dt * 60
    h.y += h.vy * dt * 60
    h.life -= dt
    if (Math.hypot(h.x - player.x, h.y - player.y) < player.headW + 6 && player.hurt <= 0) {
      loseBiomass(60)
      showBanner('HARPOONED!')
      puff(player.x, player.y, '#ff5a5a')
      harpoons.splice(i, 1)
      continue
    }
    if (h.life <= 0 || h.y > WORLD_H) harpoons.splice(i, 1)
  }

  // --- fx timers ---
  if (player.flash > 0) player.flash -= dt * 3
  if (player.hurt > 0) player.hurt -= dt * 1.5
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

  if (bannerTimer > 0) bannerTimer -= dt
  updateHUD()
}

// ---- Rendering ---------------------------------------------------------
const S = () => devicePixelRatio

// convert world coords to screen (screen coords in CSS px, then scaled)
function sx(x) { return (x - player.x + window.innerWidth / 2) }
function sy(y) { return (y - cam.y) }

function draw() {
  const dpr = S()
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const vw = window.innerWidth
  const vh = window.innerHeight

  // --- background depth gradient ---
  const g = ctx.createLinearGradient(0, 0, 0, vh)
  const top = waterColor(cam.y)
  const bot = waterColor(cam.y + vh)
  g.addColorStop(0, `rgb(${top[0]},${top[1]},${top[2]})`)
  g.addColorStop(1, `rgb(${bot[0]},${bot[1]},${bot[2]})`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, vw, vh)

  // sunlight god-rays near the surface
  if (cam.y < 900) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < 6; i++) {
      const rx = ((i * 220 + 80) % (vw + 200)) - 100
      const rg = ctx.createLinearGradient(rx, sy(SURFACE_Y), rx + 60, sy(1000))
      rg.addColorStop(0, 'rgba(120,220,255,0.10)')
      rg.addColorStop(1, 'rgba(120,220,255,0)')
      ctx.fillStyle = rg
      ctx.beginPath()
      ctx.moveTo(rx, sy(SURFACE_Y))
      ctx.lineTo(rx + 40, sy(SURFACE_Y))
      ctx.lineTo(rx + 130, sy(1200))
      ctx.lineTo(rx - 40, sy(1200))
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
  }

  // waterline + sky sliver
  const wy = sy(SURFACE_Y)
  if (wy > -40 && wy < vh + 40) {
    const sky = ctx.createLinearGradient(0, wy - 120, 0, wy)
    sky.addColorStop(0, '#0a1a2e')
    sky.addColorStop(1, '#12405a')
    ctx.fillStyle = sky
    ctx.fillRect(0, wy - 120, vw, 120)
    ctx.strokeStyle = 'rgba(180,240,255,0.35)'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x <= vw; x += 12) {
      ctx.lineTo(x, wy + Math.sin(x * 0.05 + performance.now() * 0.002) * 3)
    }
    ctx.stroke()
  }

  // seafloor
  const fy = sy(WORLD_H)
  if (fy < vh + 60) {
    ctx.fillStyle = '#05060a'
    ctx.fillRect(0, fy - 6, vw, vh)
    ctx.fillStyle = 'rgba(30,40,60,0.6)'
    for (let i = 0; i < vw; i += 40) {
      ctx.beginPath()
      ctx.ellipse(i + ((player.x * 0.3) % 40), fy, 26, 10, 0, 0, TAU)
      ctx.fill()
    }
  }

  // --- marine snow / bioluminescent motes ---
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (const m of motes) {
    const mx = sx(m.x + player.x * 0.6)
    const my = sy(m.y)
    if (my < -10 || my > vh + 10 || mx < -10 || mx > vw + 10) continue
    ctx.fillStyle = `rgba(150,220,255,${m.b})`
    ctx.beginPath()
    ctx.arc(mx, my, m.r, 0, TAU)
    ctx.fill()
  }
  ctx.restore()

  // --- creatures ---
  for (const c of creatures) {
    drawCreature(c)
  }

  // --- boats + lines ---
  for (const bt of boats) {
    drawBoat(bt)
  }
  // harpoons
  for (const h of harpoons) {
    const hx = sx(h.x), hy = sy(h.y)
    ctx.save()
    ctx.translate(hx, hy)
    ctx.rotate(h.a)
    ctx.strokeStyle = '#d7e4ee'
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(8, 0); ctx.stroke()
    ctx.fillStyle = '#f2f7fb'
    ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(2, -4); ctx.lineTo(2, 4); ctx.closePath(); ctx.fill()
    ctx.restore()
  }

  // --- player creature ---
  drawPlayer()

  // --- ripples + puffs ---
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  for (const r of ripples) {
    ctx.strokeStyle = `rgba(140,255,255,${Math.max(0, r.a) * 0.6})`
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(sx(r.x), sy(r.y), r.r, 0, TAU); ctx.stroke()
  }
  for (const b of bites) {
    ctx.fillStyle = hexA(b.col, Math.max(0, b.a))
    ctx.beginPath(); ctx.arc(sx(b.x), sy(b.y), b.r, 0, TAU); ctx.fill()
  }
  ctx.restore()

  // vignette for the abyssal mood
  const vg = ctx.createRadialGradient(vw / 2, vh / 2, vh * 0.35, vw / 2, vh / 2, vh * 0.8)
  vg.addColorStop(0, 'rgba(0,0,0,0)')
  vg.addColorStop(1, 'rgba(0,0,5,0.55)')
  ctx.fillStyle = vg
  ctx.fillRect(0, 0, vw, vh)
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// ---- Player drawing: procedural evolving body --------------------------
function bodyWidth(t, maxW) {
  // t: 0 head -> 1 tail. Widest just behind the head, taper to a point.
  if (t < 0.14) return maxW * (0.55 + (t / 0.14) * 0.45)
  return maxW * Math.pow(1 - (t - 0.14) / 0.86, 0.75)
}

function drawPlayer() {
  const n = segCount()
  const s = stage()
  const maxW = s.width
  const pts = player.spine.slice(0, n)

  // perpendicular offsets to build a filled outline
  const left = [], right = []
  for (let i = 0; i < n; i++) {
    const p = pts[i]
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(n - 1, i + 1)]
    const ang = Math.atan2(b.y - a.y, b.x - a.x)
    const w = bodyWidth(i / (n - 1), maxW)
    const px = Math.cos(ang + Math.PI / 2)
    const py = Math.sin(ang + Math.PI / 2)
    left.push({ x: sx(p.x) + px * w, y: sy(p.y) + py * w })
    right.push({ x: sx(p.x) - px * w, y: sy(p.y) - py * w })
  }

  const headSX = sx(pts[0].x), headSY = sy(pts[0].y)
  const headAng = Math.atan2(pts[0].y - pts[1].y, pts[0].x - pts[1].x)

  // glow aura
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  const aura = ctx.createRadialGradient(headSX, headSY, 0, headSX, headSY, maxW * 6)
  aura.addColorStop(0, hexA(s.accent, 0.28))
  aura.addColorStop(1, hexA(s.accent, 0))
  ctx.fillStyle = aura
  ctx.beginPath(); ctx.arc(headSX, headSY, maxW * 6, 0, TAU); ctx.fill()
  ctx.restore()

  // dorsal spines (serpent+)
  if (player.stageIndex >= 3) {
    ctx.fillStyle = hexA(s.accent, 0.55)
    for (let i = 2; i < n - 2; i += 2) {
      const p = pts[i]
      const a = pts[i - 1], b = pts[i + 1]
      const ang = Math.atan2(b.y - a.y, b.x - a.x)
      const w = bodyWidth(i / (n - 1), maxW)
      const nx = Math.cos(ang - Math.PI / 2), ny = Math.sin(ang - Math.PI / 2)
      const bx = sx(p.x), by = sy(p.y)
      const sp = w * (1.1 + player.stageIndex * 0.25)
      ctx.beginPath()
      ctx.moveTo(bx + nx * w, by + ny * w)
      ctx.lineTo(bx + nx * (w + sp) + Math.cos(ang) * sp * 0.4, by + ny * (w + sp) + Math.sin(ang) * sp * 0.4)
      ctx.lineTo(bx + nx * w + Math.cos(ang) * w, by + ny * w + Math.sin(ang) * w)
      ctx.closePath()
      ctx.fill()
    }
  }

  // tentacles (kraken)
  if (player.stageIndex >= 5) {
    const tailIdx = n - 1
    const tp = pts[tailIdx]
    const tm = performance.now() * 0.004
    for (let k = 0; k < 6; k++) {
      const base = (k / 5 - 0.5)
      ctx.strokeStyle = hexA(s.color, 0.7)
      ctx.lineWidth = maxW * 0.5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(sx(tp.x), sy(tp.y))
      for (let seg = 1; seg <= 5; seg++) {
        const len = seg * maxW * 1.1
        const wob = Math.sin(tm + k + seg * 0.6) * 10
        ctx.lineTo(
          sx(tp.x) - Math.cos(headAng) * len + Math.sin(headAng) * (base * 40 + wob),
          sy(tp.y) - Math.sin(headAng) * len - Math.cos(headAng) * (base * 40 + wob)
        )
      }
      ctx.stroke()
    }
  }

  // body fill
  ctx.beginPath()
  ctx.moveTo(left[0].x, left[0].y)
  for (let i = 1; i < n; i++) ctx.lineTo(left[i].x, left[i].y)
  for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y)
  ctx.closePath()
  const bodyGrad = ctx.createLinearGradient(headSX, headSY, sx(pts[n - 1].x), sy(pts[n - 1].y))
  bodyGrad.addColorStop(0, s.color)
  bodyGrad.addColorStop(1, shade(s.color, -40))
  ctx.fillStyle = bodyGrad
  ctx.fill()
  // rim light
  ctx.strokeStyle = hexA(s.accent, 0.5)
  ctx.lineWidth = 1.5
  ctx.stroke()

  // hurt / eat flashes
  if (player.hurt > 0) { ctx.fillStyle = `rgba(255,60,60,${player.hurt * 0.4})`; ctx.fill() }
  if (player.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${player.flash * 0.3})`; ctx.fill() }

  // pectoral fins (eel+)
  if (player.stageIndex >= 2) {
    const fp = pts[Math.floor(n * 0.18)]
    const ang = headAng
    const nx = Math.cos(ang - Math.PI / 2), ny = Math.sin(ang - Math.PI / 2)
    const fl = maxW * (2 + player.stageIndex * 0.4)
    const finFlap = Math.sin(performance.now() * 0.006) * 0.4
    for (const side of [1, -1]) {
      ctx.fillStyle = hexA(s.accent, 0.35)
      ctx.beginPath()
      const bx = sx(fp.x), by = sy(fp.y)
      ctx.moveTo(bx, by)
      ctx.quadraticCurveTo(
        bx + nx * side * fl, by + ny * side * fl,
        bx - Math.cos(ang) * fl * (1.1 + finFlap), by - Math.sin(ang) * fl * (1.1 + finFlap)
      )
      ctx.closePath()
      ctx.fill()
    }
  }

  // head — snout, eye, and glowing lure
  ctx.save()
  ctx.translate(headSX, headSY)
  ctx.rotate(headAng)
  // eye
  const eyeR = Math.max(2, maxW * 0.35)
  ctx.fillStyle = '#04121c'
  ctx.beginPath(); ctx.arc(maxW * 0.2, -maxW * 0.4, eyeR, 0, TAU); ctx.fill()
  ctx.fillStyle = player.stageIndex >= 4 ? '#ff4d6d' : '#eaffff'
  ctx.beginPath(); ctx.arc(maxW * 0.25, -maxW * 0.45, eyeR * 0.5, 0, TAU); ctx.fill()
  // toothy maw for later stages
  if (player.stageIndex >= 3) {
    ctx.strokeStyle = '#f4ffff'
    ctx.lineWidth = 1
    for (let t = 0; t < 4; t++) {
      const tx = maxW * (0.6 - t * 0.25)
      ctx.beginPath(); ctx.moveTo(tx, maxW * 0.1); ctx.lineTo(tx - 1.5, maxW * 0.5); ctx.stroke()
    }
  }
  // anglerfish-style bioluminescent lure (early stages especially)
  if (player.stageIndex <= 4) {
    const lm = performance.now() * 0.003
    const lx = maxW * (1.4 + player.stageIndex * 0.3)
    const ly = -maxW * (1.2 + Math.sin(lm) * 0.3)
    ctx.strokeStyle = hexA(s.accent, 0.5)
    ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.moveTo(maxW * 0.4, -maxW * 0.4); ctx.quadraticCurveTo(lx * 0.6, ly, lx, ly); ctx.stroke()
    ctx.globalCompositeOperation = 'lighter'
    const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, maxW * 1.6)
    lg.addColorStop(0, hexA(s.accent, 0.9))
    lg.addColorStop(1, hexA(s.accent, 0))
    ctx.fillStyle = lg
    ctx.beginPath(); ctx.arc(lx, ly, maxW * 1.6, 0, TAU); ctx.fill()
  }
  ctx.restore()
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16)
  const r = clamp(((n >> 16) & 255) + amt, 0, 255)
  const g = clamp(((n >> 8) & 255) + amt, 0, 255)
  const b = clamp((n & 255) + amt, 0, 255)
  return `rgb(${r},${g},${b})`
}

// ---- Creature drawing --------------------------------------------------
function drawCreature(c) {
  const x = sx(c.x), y = sy(c.y)
  if (x < -60 || x > window.innerWidth + 60 || y < -60 || y > window.innerHeight + 60) return
  const face = c.dir
  ctx.save()
  ctx.translate(x, y)

  if (c.glow > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, c.r * 3)
    g.addColorStop(0, hexA(c.col, 0.35 * c.glow))
    g.addColorStop(1, hexA(c.col, 0))
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(0, 0, c.r * 3, 0, TAU); ctx.fill()
    ctx.restore()
  }

  ctx.scale(face, 1)
  ctx.fillStyle = c.col

  switch (c.shape) {
    case 'dot':
      ctx.beginPath(); ctx.arc(0, 0, c.r, 0, TAU); ctx.fill()
      break
    case 'shrimp':
      ctx.beginPath(); ctx.ellipse(0, 0, c.r, c.r * 0.55, 0.3, 0, TAU); ctx.fill()
      ctx.strokeStyle = c.col; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(-c.r, 0); ctx.lineTo(-c.r * 1.6, -c.r * 0.4); ctx.stroke()
      break
    case 'jelly': {
      const t = performance.now() * 0.003
      ctx.beginPath(); ctx.ellipse(0, -c.r * 0.2, c.r, c.r * 0.8, 0, Math.PI, 0); ctx.fill()
      ctx.strokeStyle = hexA(c.col, 0.6); ctx.lineWidth = 1.5
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        ctx.moveTo(i * c.r * 0.35, -c.r * 0.1)
        ctx.quadraticCurveTo(i * c.r * 0.35 + Math.sin(t + i) * 4, c.r * 1.2, i * c.r * 0.35, c.r * 1.8)
        ctx.stroke()
      }
      break
    }
    case 'squid':
      ctx.beginPath(); ctx.ellipse(c.r * 0.3, 0, c.r, c.r * 0.6, 0, 0, TAU); ctx.fill()
      ctx.beginPath(); ctx.moveTo(c.r, 0)
      ctx.lineTo(c.r * 1.5, -c.r * 0.3); ctx.lineTo(c.r * 1.5, c.r * 0.3); ctx.closePath(); ctx.fill()
      ctx.strokeStyle = c.col; ctx.lineWidth = 1.5
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath(); ctx.moveTo(-c.r * 0.6, i * 2); ctx.lineTo(-c.r * 1.5, i * 3); ctx.stroke()
      }
      break
    case 'angler': {
      ctx.beginPath(); ctx.arc(0, 0, c.r, 0, TAU); ctx.fill()
      // gaping jaw
      ctx.fillStyle = '#0a0f14'
      ctx.beginPath(); ctx.arc(c.r * 0.6, c.r * 0.2, c.r * 0.55, 0, TAU); ctx.fill()
      ctx.strokeStyle = '#dfe'; ctx.lineWidth = 1
      for (let t = 0; t < 5; t++) { ctx.beginPath(); ctx.moveTo(c.r * 0.3 + t * c.r * 0.15, c.r * 0.5); ctx.lineTo(c.r * 0.3 + t * c.r * 0.15, c.r * 0.1); ctx.stroke() }
      // lure
      const lm = performance.now() * 0.004
      ctx.globalCompositeOperation = 'lighter'
      const g = ctx.createRadialGradient(c.r * 0.8, -c.r * 1.3 + Math.sin(lm) * 3, 0, c.r * 0.8, -c.r * 1.3, c.r)
      g.addColorStop(0, 'rgba(180,255,180,0.9)'); g.addColorStop(1, 'rgba(180,255,180,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(c.r * 0.8, -c.r * 1.3 + Math.sin(lm) * 3, c.r, 0, TAU); ctx.fill()
      break
    }
    case 'shark':
      ctx.beginPath()
      ctx.moveTo(c.r * 1.3, 0)
      ctx.quadraticCurveTo(c.r * 0.2, -c.r * 0.6, -c.r, -c.r * 0.15)
      ctx.lineTo(-c.r * 1.5, -c.r * 0.5)
      ctx.lineTo(-c.r * 1.1, 0)
      ctx.lineTo(-c.r * 1.5, c.r * 0.5)
      ctx.lineTo(-c.r, c.r * 0.15)
      ctx.quadraticCurveTo(c.r * 0.2, c.r * 0.6, c.r * 1.3, 0)
      ctx.closePath(); ctx.fill()
      // dorsal
      ctx.beginPath(); ctx.moveTo(0, -c.r * 0.5); ctx.lineTo(-c.r * 0.2, -c.r * 1.1); ctx.lineTo(-c.r * 0.5, -c.r * 0.5); ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#04121c'
      ctx.beginPath(); ctx.arc(c.r * 0.7, -c.r * 0.1, c.r * 0.12, 0, TAU); ctx.fill()
      break
    case 'fish':
    default:
      ctx.beginPath(); ctx.ellipse(0, 0, c.r, c.r * 0.6, 0, 0, TAU); ctx.fill()
      ctx.beginPath(); ctx.moveTo(-c.r, 0); ctx.lineTo(-c.r * 1.6, -c.r * 0.5); ctx.lineTo(-c.r * 1.6, c.r * 0.5); ctx.closePath(); ctx.fill()
      ctx.fillStyle = '#04121c'
      ctx.beginPath(); ctx.arc(c.r * 0.55, -c.r * 0.1, c.r * 0.13, 0, TAU); ctx.fill()
      break
  }
  ctx.restore()
}

// ---- Boat drawing ------------------------------------------------------
function drawBoat(bt) {
  const bx = sx(bt.x)
  const by = sy(SURFACE_Y)
  // fishing line
  const hx = sx(bt._hookX != null ? bt._hookX : bt.x)
  const hy = sy(bt._hookY != null ? bt._hookY : SURFACE_Y + 200)
  if (player.hooked && player.hooked.boat === bt) {
    // taut line to the caught monster
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'
    ctx.lineWidth = 1.6
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(sx(player.x), sy(player.y)); ctx.stroke()
  } else {
    ctx.strokeStyle = 'rgba(200,230,255,0.28)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx, (by + hy) / 2, hx, hy); ctx.stroke()
    // baited hook glow — looks like tempting prey
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 16)
    g.addColorStop(0, 'rgba(255,240,160,0.8)')
    g.addColorStop(1, 'rgba(255,240,160,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(hx, hy, 16, 0, TAU); ctx.fill()
    ctx.restore()
    ctx.fillStyle = '#ffe6a0'
    ctx.beginPath(); ctx.arc(hx, hy, 3, 0, TAU); ctx.fill()
    ctx.strokeStyle = '#cddae6'
    ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.arc(hx + 2, hy + 4, 3, Math.PI * 0.2, Math.PI * 1.4); ctx.stroke()
  }

  // hull (drawn above the waterline)
  if (by > -40 && by < window.innerHeight + 40) {
    ctx.fillStyle = '#20140c'
    ctx.beginPath()
    ctx.moveTo(bx - 34, by - 6)
    ctx.lineTo(bx + 34, by - 6)
    ctx.lineTo(bx + 24, by + 10)
    ctx.lineTo(bx - 24, by + 10)
    ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#3a2a1a'
    ctx.fillRect(bx - 20, by - 22, 5, 16)
    // little lantern
    ctx.save(); ctx.globalCompositeOperation = 'lighter'
    const lg = ctx.createRadialGradient(bx - 17, by - 24, 0, bx - 17, by - 24, 20)
    lg.addColorStop(0, 'rgba(255,210,120,0.6)'); lg.addColorStop(1, 'rgba(255,210,120,0)')
    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(bx - 17, by - 24, 20, 0, TAU); ctx.fill()
    ctx.restore()
  }
}

// ---- Frame -------------------------------------------------------------
function frame(t) {
  if (!running) return
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
  running = true
  last = performance.now()
  requestAnimationFrame(frame)
})

// draw one idle frame behind the start card so it isn't blank
draw()
