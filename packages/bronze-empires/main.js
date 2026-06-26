// Bronze Empires — an autonomous top-down RTS between three civilizations.
// All three civs are AI-driven: they harvest, spawn units, fight, sign
// treaties, declare war, and spread culture through wandering poets.
// Pure Canvas 2D, no dependencies.

const canvas = document.getElementById('map')
const ctx = canvas.getContext('2d')

// ---------------------------------------------------------------- config ----
const CIVS = [
  { id: 0, name: 'CRIMSON', color: '#e0473d', glow: '#ff7a6e', dim: '#7a2420' },
  { id: 1, name: 'AZURE',   color: '#4a8fe0', glow: '#7fb6ff', dim: '#244a7a' },
  { id: 2, name: 'VERDANT', color: '#5fc36a', glow: '#9be8a4', dim: '#2a6630' },
]
const MAX_UNITS = 90          // global cap for performance
const SPAWN_COST = 30
const TICK = 1 / 60

// ------------------------------------------------------------------ world ----
let W = 0, H = 0, DPR = 1
const rand = (a, b) => a + Math.random() * (b - a)
const pick = arr => arr[(Math.random() * arr.length) | 0]
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by)

// A simple "water" region: a diagonal river band across the map. Ships live
// here; harvesters and soldiers stay on land. Computed from normalized coords.
function isWater(x, y) {
  const t = (x / W) * 0.6 + (y / H) * 0.4 // diagonal gradient 0..1
  return t > 0.46 && t < 0.58
}

let resources = []   // forests & mines
let units = []
let bases = []
let effects = []     // transient combat / death / ripple visuals
let culture = []     // culture ripple particles from poets
let logItems = []

// diplomacy: relation[a][b] === 'war' | 'peace'; symmetric
const relation = [
  [null, 'war', 'peace'],
  ['war', null, 'war'],
  ['peace', 'war', null],
]
function atWar(a, b) { return relation[a][b] === 'war' }
function setRelation(a, b, r) { relation[a][b] = r; relation[b][a] = r }

// ----------------------------------------------------------------- setup ----
function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2)
  W = window.innerWidth
  H = window.innerHeight
  canvas.width = W * DPR
  canvas.height = H * DPR
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
}
window.addEventListener('resize', resize)
resize()

function buildWorld() {
  // Three bases placed in a balanced triangle, kept clear of the HUD panels
  // (title top-left, scoreboard top-right, chronicle bottom-left) so every
  // keep — including VERDANT — is fully visible, and off the water band.
  const spots = [
    { x: W * 0.13, y: H * 0.32 },  // CRIMSON  — left, below the title
    { x: W * 0.88, y: H * 0.66 },  // AZURE    — right, below the scoreboard
    { x: W * 0.52, y: H * 0.86 },  // VERDANT  — bottom-centre, right of ticker
  ]
  bases = CIVS.map((c, i) => ({
    civ: c.id,
    x: spots[i].x, y: spots[i].y,
    hp: 1000, maxHp: 1000,
    gold: 120, spawnTimer: rand(0, 2),
  }))

  // Resource nodes scattered on land.
  resources = []
  for (let i = 0; i < 26; i++) {
    let x, y, tries = 0
    do { x = rand(70, W - 70); y = rand(70, H - 70); tries++ }
    while (isWater(x, y) && tries < 20)
    resources.push({
      x, y,
      kind: Math.random() < 0.5 ? 'forest' : 'mine',
      amount: rand(140, 320),
    })
  }

  // Starting units so the gallery screenshot is full of life on load.
  units = []
  effects = []
  culture = []
  for (const b of bases) {
    spawnUnit(b.civ, 'worker', b.x, b.y)
    spawnUnit(b.civ, 'worker', b.x, b.y)
    spawnUnit(b.civ, 'worker', b.x, b.y)
    spawnUnit(b.civ, 'soldier', b.x, b.y)
    spawnUnit(b.civ, 'soldier', b.x, b.y)
    spawnUnit(b.civ, 'poet', b.x, b.y)
    spawnUnit(b.civ, 'ship', b.x, b.y)
  }

  logItems = []
  log(`Three empires rise across the realm.`)
}

// ------------------------------------------------------------------ units ----
const STATS = {
  worker:  { hp: 40,  speed: 42, r: 4.5 },
  soldier: { hp: 90,  speed: 38, r: 5.5, dmg: 22, range: 16 },
  ship:    { hp: 120, speed: 34, r: 7,   dmg: 18, range: 22 },
  poet:    { hp: 50,  speed: 30, r: 5 },
}

function spawnUnit(civ, type, x, y) {
  if (units.length >= MAX_UNITS) return null
  const s = STATS[type]
  const u = {
    civ, type,
    x: x + rand(-12, 12), y: y + rand(-12, 12),
    vx: 0, vy: 0,
    hp: s.hp, maxHp: s.hp,
    speed: s.speed, r: s.r,
    target: null, carry: 0, cool: 0,
    wob: rand(0, Math.PI * 2), // phase for cosmetic bob
  }
  units.push(u)
  return u
}

function nearestBase(civ) { return bases.find(b => b.civ === civ) }

function nearestResource(x, y) {
  let best = null, bd = Infinity
  for (const r of resources) {
    if (r.amount <= 0) continue
    const d = dist(x, y, r.x, r.y)
    if (d < bd) { bd = d; best = r }
  }
  return best
}

function nearestEnemy(u, maxD) {
  let best = null, bd = maxD
  for (const o of units) {
    if (o.civ === u.civ || o.hp <= 0) continue
    if (!atWar(u.civ, o.civ)) continue
    // ships only target ships; land units ignore ships (different domains)
    if ((u.type === 'ship') !== (o.type === 'ship')) continue
    const d = dist(u.x, u.y, o.x, o.y)
    if (d < bd) { bd = d; best = o }
  }
  return best
}

// ----------------------------------------------------------- unit behaviour ----
function steerToward(u, tx, ty, dt) {
  const dx = tx - u.x, dy = ty - u.y
  const d = Math.hypot(dx, dy) || 1
  u.x += (dx / d) * u.speed * dt
  u.y += (dy / d) * u.speed * dt
  return d
}

function updateWorker(u, dt) {
  const base = nearestBase(u.civ)
  if (u.carry >= 12) {
    // return to base to deposit
    const d = steerToward(u, base.x, base.y, dt)
    if (d < 26) { base.gold += u.carry; u.carry = 0; u.target = null }
    return
  }
  // find / approach a resource node
  if (!u.target || u.target.amount <= 0) u.target = nearestResource(u.x, u.y)
  if (!u.target) { wander(u, dt); return }
  const d = steerToward(u, u.target.x, u.target.y, dt)
  if (d < 14) {
    const take = Math.min(0.4, u.target.amount)
    u.target.amount -= take
    u.carry += take
  }
}

function updateCombatant(u, dt) {
  const s = STATS[u.type]
  const foe = nearestEnemy(u, u.type === 'ship' ? 240 : 200)
  if (foe) {
    const d = steerToward(u, foe.x, foe.y, dt)
    if (d < s.range && u.cool <= 0) {
      foe.hp -= s.dmg
      u.cool = 0.6
      effects.push({ type: 'hit', x: foe.x, y: foe.y, life: 0.25, max: 0.25 })
      if (foe.hp <= 0) {
        effects.push({ type: 'death', x: foe.x, y: foe.y, life: 0.5, max: 0.5,
          color: CIVS[foe.civ].color })
      }
    }
  } else {
    // patrol toward the nearest enemy base when at war, else guard home
    let dest = null
    for (const b of bases) {
      if (b.civ !== u.civ && atWar(u.civ, b.civ)) { dest = b; break }
    }
    if (dest && u.type === 'soldier') {
      const d = steerToward(u, dest.x, dest.y, dt)
      if (d < 60 && u.cool <= 0) { dest.hp -= s.dmg * 0.5; u.cool = 0.6 }
    } else wander(u, dt)
  }
}

function updateShip(u, dt) {
  // keep ships in / near the water band; bob along it, fight other ships
  updateCombatant(u, dt)
  if (!isWater(u.x, u.y)) {
    // nudge toward the water band center
    const cx = W * 0.5, cy = H * 0.5
    steerToward(u, cx, cy, dt * 0.6)
  }
}

function updatePoet(u, dt) {
  // wander and emit culture ripples; sway nearby enemy units & convert ground
  wander(u, dt)
  u.cool -= dt
  if (u.cool <= 0) {
    u.cool = 0.5
    culture.push({ x: u.x, y: u.y, civ: u.civ, life: 2.2, max: 2.2, r: 0 })
    // sway: nearby low-hp enemy non-soldiers may defect to this culture
    for (const o of units) {
      if (o.civ === u.civ || o.hp <= 0) continue
      if (o.type === 'soldier' || o.type === 'ship') continue
      if (dist(u.x, u.y, o.x, o.y) < 46 && Math.random() < 0.012) {
        const old = CIVS[o.civ].name
        o.civ = u.civ
        o.target = null
        effects.push({ type: 'convert', x: o.x, y: o.y, life: 0.6, max: 0.6,
          color: CIVS[u.civ].glow })
        log(`A poet sways a ${old} soul to ${CIVS[u.civ].name}.`, u.civ)
      }
    }
  }
}

function wander(u, dt) {
  u.wob += dt * 1.4
  const base = nearestBase(u.civ)
  // gentle bias back toward home so units stay on-map and grouped
  const hx = base.x - u.x, hy = base.y - u.y
  const hd = Math.hypot(hx, hy) || 1
  const pull = hd > 280 ? 0.9 : 0.12
  u.x += (Math.cos(u.wob) * (1 - pull) + (hx / hd) * pull) * u.speed * dt
  u.y += (Math.sin(u.wob * 0.8) * (1 - pull) + (hy / hd) * pull) * u.speed * dt
}

// ------------------------------------------------------------------ ticks ----
let diploTimer = 3.5
function update(dt) {
  // unit AI
  for (const u of units) {
    if (u.hp <= 0) continue
    u.cool -= dt
    if (u.type === 'worker') updateWorker(u, dt)
    else if (u.type === 'poet') updatePoet(u, dt)
    else if (u.type === 'ship') updateShip(u, dt)
    else updateCombatant(u, dt)
    // clamp to map
    u.x = Math.max(8, Math.min(W - 8, u.x))
    u.y = Math.max(8, Math.min(H - 8, u.y))
  }
  units = units.filter(u => u.hp > 0)

  // base economy & spawning
  for (const b of bases) {
    if (b.hp <= 0) continue
    b.spawnTimer -= dt
    if (b.spawnTimer <= 0 && b.gold >= SPAWN_COST && units.length < MAX_UNITS) {
      b.gold -= SPAWN_COST
      b.spawnTimer = rand(2.2, 4)
      spawnUnit(b.civ, chooseSpawn(b.civ), b.x, b.y)
    }
    if (b.hp < b.maxHp) b.hp = Math.min(b.maxHp, b.hp + 6 * dt) // slow regen
  }

  // culture ripples grow & fade
  for (const c of culture) { c.life -= dt; c.r += 36 * dt }
  culture = culture.filter(c => c.life > 0)

  // transient effects
  for (const e of effects) e.life -= dt
  effects = effects.filter(e => e.life > 0)

  // diplomacy events
  diploTimer -= dt
  if (diploTimer <= 0) { diploTimer = rand(7, 13); diplomacyTick() }
}

function chooseSpawn(civ) {
  const mine = units.filter(u => u.civ === civ)
  const n = t => mine.filter(u => u.type === t).length
  // maintain an economy first, then military, plus the occasional poet/ship
  if (n('worker') < 4) return 'worker'
  if (n('poet') < 1 && Math.random() < 0.4) return 'poet'
  if (n('ship') < 2 && Math.random() < 0.25) return 'ship'
  if (n('soldier') < 6) return 'soldier'
  return pick(['worker', 'soldier', 'soldier', 'poet'])
}

function diplomacyTick() {
  const a = (Math.random() * 3) | 0
  let b = (a + 1 + ((Math.random() * 2) | 0)) % 3
  if (a === b) b = (b + 1) % 3
  const cur = relation[a][b]
  if (cur === 'war' && Math.random() < 0.55) {
    setRelation(a, b, 'peace')
    log(`${CIVS[a].name} & ${CIVS[b].name} sign a treaty.`, a, b)
  } else if (cur === 'peace' && Math.random() < 0.55) {
    setRelation(a, b, 'war')
    log(`${CIVS[a].name} declares war on ${CIVS[b].name}!`, a)
  } else if (cur === 'peace') {
    log(`${CIVS[a].name} & ${CIVS[b].name} share culture & trade.`, a, b)
  }
}

// --------------------------------------------------------------- rendering ----
function render() {
  // ground
  ctx.fillStyle = '#1a1610'
  ctx.fillRect(0, 0, W, H)
  drawWater()
  drawCultureGround()

  // resource nodes
  for (const r of resources) {
    if (r.amount <= 0) continue
    const sz = 4 + (r.amount / 320) * 7
    if (r.kind === 'forest') {
      ctx.fillStyle = '#3f6b34'
      tri(r.x, r.y - sz, sz)
      ctx.fillStyle = '#5b3a1e'
      ctx.fillRect(r.x - 1, r.y, 2, 5)
    } else {
      ctx.fillStyle = '#8a8f9c'
      ctx.beginPath(); ctx.arc(r.x, r.y, sz * 0.8, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#c9d2e0'
      ctx.beginPath(); ctx.arc(r.x - 1, r.y - 1, sz * 0.32, 0, Math.PI * 2); ctx.fill()
    }
  }

  // culture ripples (poet auras)
  for (const c of culture) {
    const a = (c.life / c.max) * 0.5
    ctx.strokeStyle = hexA(CIVS[c.civ].glow, a)
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.stroke()
  }

  // bases
  for (const b of bases) drawBase(b)

  // units
  for (const u of units) drawUnit(u)

  // effects
  for (const e of effects) drawEffect(e)
}

function drawWater() {
  // render the diagonal river band by sampling a coarse grid (cheap)
  const step = 14
  ctx.save()
  for (let x = 0; x < W; x += step) {
    for (let y = 0; y < H; y += step) {
      if (isWater(x + step / 2, y + step / 2)) {
        const shimmer = 0.12 + 0.06 * Math.sin((x + y) * 0.05 + performance.now() * 0.001)
        ctx.fillStyle = `rgba(40,90,140,${0.5 + shimmer})`
        ctx.fillRect(x, y, step, step)
      }
    }
  }
  ctx.restore()
}

// faint persistent tint of culture-controlled ground near bases
function drawCultureGround() {
  for (const b of bases) {
    if (b.hp <= 0) continue
    const g = ctx.createRadialGradient(b.x, b.y, 10, b.x, b.y, 170)
    g.addColorStop(0, hexA(CIVS[b.civ].color, 0.16))
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath(); ctx.arc(b.x, b.y, 170, 0, Math.PI * 2); ctx.fill()
  }
}

function drawBase(b) {
  const c = CIVS[b.civ]
  if (b.hp <= 0) {
    ctx.fillStyle = '#2a2620'
    ctx.fillRect(b.x - 14, b.y - 14, 28, 28)
    return
  }
  // soft outer glow so every keep (esp. VERDANT) reads on the dark ground
  ctx.save()
  ctx.shadowColor = c.glow
  ctx.shadowBlur = 22
  // outer keep
  ctx.fillStyle = c.dim
  ctx.fillRect(b.x - 18, b.y - 18, 36, 36)
  ctx.restore()
  ctx.strokeStyle = c.color
  ctx.lineWidth = 2.5
  ctx.strokeRect(b.x - 18, b.y - 18, 36, 36)
  // battlements
  ctx.fillStyle = c.color
  for (let i = -1; i <= 1; i++) ctx.fillRect(b.x - 18 + (i + 1) * 12, b.y - 22, 6, 6)
  // banner
  ctx.fillStyle = c.glow
  ctx.fillRect(b.x - 1, b.y - 30, 2, 10)
  tri2(b.x + 1, b.y - 30, 8, c.glow)
  // hp ring
  ctx.strokeStyle = hexA(c.glow, 0.85)
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(b.x, b.y, 26, -Math.PI / 2, -Math.PI / 2 + (b.hp / b.maxHp) * Math.PI * 2)
  ctx.stroke()
}

function drawUnit(u) {
  const c = CIVS[u.civ]
  const bob = Math.sin(u.wob * 4) * 0.6
  ctx.save()
  ctx.translate(u.x, u.y + bob)

  if (u.type === 'soldier') {
    ctx.fillStyle = c.color
    ctx.beginPath(); ctx.arc(0, 0, u.r, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.4
    ctx.beginPath(); ctx.moveTo(u.r, -u.r); ctx.lineTo(u.r + 6, -u.r - 6); ctx.stroke() // sword
  } else if (u.type === 'worker') {
    ctx.fillStyle = c.color
    ctx.fillRect(-u.r, -u.r, u.r * 2, u.r * 2)
    if (u.carry > 0) { ctx.fillStyle = '#ffd86b'; ctx.fillRect(-2, -u.r - 3, 4, 3) }
  } else if (u.type === 'poet') {
    // diamond with a soft halo
    ctx.fillStyle = hexA(c.glow, 0.35)
    ctx.beginPath(); ctx.arc(0, 0, u.r + 4, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.moveTo(0, -u.r - 2); ctx.lineTo(u.r, 0); ctx.lineTo(0, u.r + 2); ctx.lineTo(-u.r, 0)
    ctx.closePath(); ctx.fill()
    ctx.strokeStyle = c.color; ctx.lineWidth = 1.5; ctx.stroke()
  } else if (u.type === 'ship') {
    ctx.fillStyle = c.dim
    ctx.beginPath()
    ctx.moveTo(-u.r, -2); ctx.lineTo(u.r, -2); ctx.lineTo(u.r - 3, 4); ctx.lineTo(-u.r + 3, 4)
    ctx.closePath(); ctx.fill()
    ctx.strokeStyle = c.color; ctx.lineWidth = 1.2; ctx.stroke()
    ctx.fillStyle = '#f3e6c8' // sail
    ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(0, -u.r - 5); ctx.lineTo(u.r - 1, -3); ctx.closePath(); ctx.fill()
  }

  // small hp pip when damaged
  if (u.hp < u.maxHp) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(-u.r, -u.r - 5, u.r * 2, 2)
    ctx.fillStyle = c.glow; ctx.fillRect(-u.r, -u.r - 5, u.r * 2 * (u.hp / u.maxHp), 2)
  }
  ctx.restore()
}

function drawEffect(e) {
  const a = e.life / e.max
  if (e.type === 'hit') {
    ctx.strokeStyle = `rgba(255,230,140,${a})`
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(e.x, e.y, (1 - a) * 10 + 3, 0, Math.PI * 2); ctx.stroke()
  } else if (e.type === 'death') {
    ctx.fillStyle = hexA(e.color, a)
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2
      const d = (1 - a) * 14
      ctx.fillRect(e.x + Math.cos(ang) * d - 1.5, e.y + Math.sin(ang) * d - 1.5, 3, 3)
    }
  } else if (e.type === 'convert') {
    ctx.strokeStyle = hexA(e.color, a)
    ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.arc(e.x, e.y, (1 - a) * 18 + 4, 0, Math.PI * 2); ctx.stroke()
  }
}

// drawing helpers ------------------------------------------------------------
function tri(x, y, s) {
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - s, y + s * 1.4); ctx.lineTo(x + s, y + s * 1.4)
  ctx.closePath(); ctx.fill()
}
function tri2(x, y, s, col) {
  ctx.fillStyle = col
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s, y + 3); ctx.lineTo(x, y + 6)
  ctx.closePath(); ctx.fill()
}
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

// ---------------------------------------------------------------- HUD / log ----
const scoresEl = document.getElementById('scores')
const logEl = document.getElementById('log')

scoresEl.innerHTML = CIVS.map(c => `
  <div class="civ-card" style="border-left-color:${c.color}">
    <div class="civ-dot" style="background:${c.color};color:${c.color}"></div>
    <div class="civ-name" style="color:${c.glow}">${c.name}</div>
    <div class="civ-stats" id="stats-${c.id}"></div>
  </div>`).join('')

function updateHUD() {
  for (const c of CIVS) {
    const b = bases[c.id]
    const mine = units.filter(u => u.civ === c.id)
    const el = document.getElementById('stats-' + c.id)
    if (!el) continue
    el.innerHTML = b.hp > 0
      ? `<span class="gold">${b.gold | 0} ◈</span><br>
         <span class="small">${mine.length} units · ${(b.hp | 0)} hp</span>`
      : `<span class="small">— fallen —</span>`
  }
}

function log(text, ...civIds) {
  let html = text
  for (const id of civIds) {
    const c = CIVS[id]
    html = html.replace(c.name, `<span class="tag" style="color:${c.glow}">${c.name}</span>`)
  }
  logItems.unshift(html)
  if (logItems.length > 5) logItems.pop()
  logEl.innerHTML = logItems
    .map((h, i) => `<li class="${i > 0 ? 'old' : ''}">${h}</li>`)
    .join('')
}

// ------------------------------------------------------------------- loop ----
buildWorld()
updateHUD()

let last = performance.now()
let hudAccum = 0
function frame(now) {
  let dt = (now - last) / 1000
  last = now
  if (dt > 0.05) dt = 0.05 // clamp after tab switch
  update(dt)
  render()
  hudAccum += dt
  if (hudAccum > 0.25) { updateHUD(); hudAccum = 0 }
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)
