import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { analyzeRule, drawSpacetime, drawRuleIcon } from './ca.js'
import { layoutGraph, depthColor } from './layout.js'

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------
const container = document.getElementById('graph')
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
container.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x05060b)

// Time runs along +z, so z is up: the camera orbits the basin field like a
// landscape rather than tumbling around an arbitrary axis.
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.5, 200000)
camera.up.set(0, 0, 1)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.autoRotate = true
controls.autoRotateSpeed = 0.5

const sprite = makeDiscTexture()
let graph = null

// ---------------------------------------------------------------------------
// Build the scene objects for one analysed rule
// ---------------------------------------------------------------------------
function buildGraph(a) {
  disposeGraph()

  const { positions, nodeSpacing } = layoutGraph(a)
  const M = a.M
  const maxD = Math.max(1, a.maxDist)

  // Node colour: 1 at the attractor, falling to 0 at the deepest transient.
  const nodeColors = new Float32Array(M * 3)
  for (let v = 0; v < M; v++) {
    const [r, g, b] = depthColor(1 - a.dist[v] / maxD)
    nodeColors[v * 3] = r
    nodeColors[v * 3 + 1] = g
    nodeColors[v * 3 + 2] = b
  }

  const nodeSize = nodeSpacing * 0.5

  const nodeGeo = new THREE.BufferGeometry()
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3))
  const points = new THREE.Points(
    nodeGeo,
    new THREE.PointsMaterial({
      size: nodeSize,
      map: sprite,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
  scene.add(points)

  // Attractor nodes get an additive halo so the rings read as the hot core.
  const cycleIdx = []
  for (let v = 0; v < M; v++) if (a.onCycle[v]) cycleIdx.push(v)
  const glowPos = new Float32Array(cycleIdx.length * 3)
  for (let j = 0; j < cycleIdx.length; j++) {
    const i = cycleIdx[j] * 3
    glowPos[j * 3] = positions[i]
    glowPos[j * 3 + 1] = positions[i + 1]
    glowPos[j * 3 + 2] = positions[i + 2]
  }
  const glowGeo = new THREE.BufferGeometry()
  glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3))
  const glow = new THREE.Points(
    glowGeo,
    new THREE.PointsMaterial({
      size: nodeSize * 3.4,
      map: sprite,
      color: 0xffcf6e,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
  scene.add(glow)

  // Edges, coloured per endpoint. Because colour tracks depth, every edge is a
  // gradient running from cool (source) to hot (target) — direction for free.
  const edges = []
  for (let s = 0; s < M; s++) if (a.succ[s] !== s) edges.push(s)
  const linePos = new Float32Array(edges.length * 6)
  const lineCol = new Float32Array(edges.length * 6)
  for (let e = 0; e < edges.length; e++) {
    const s = edges[e]
    const t = a.succ[s]
    const ring = a.onCycle[s] && a.onCycle[t] // attractor edges burn brighter
    writeEdge(linePos, e * 6, positions, s, t)
    for (const [k, v] of [[0, s], [1, t]]) {
      const boost = ring ? 1.0 : 0.62
      lineCol[e * 6 + k * 3] = nodeColors[v * 3] * boost
      lineCol[e * 6 + k * 3 + 1] = nodeColors[v * 3 + 1] * boost
      lineCol[e * 6 + k * 3 + 2] = nodeColors[v * 3 + 2] * boost
    }
  }
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3))
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3))
  const lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  )
  scene.add(lines)

  // Walkers: sparks riding the edges forward in time. They fall down the trees
  // and then circulate forever once they reach a ring — the dynamics, animated.
  const wCount = Math.min(1400, M)
  const walkFrom = new Int32Array(wCount)
  const walkT = new Float32Array(wCount)
  for (let i = 0; i < wCount; i++) {
    walkFrom[i] = Math.floor((i * M) / wCount)
    walkT[i] = frac(Math.sin(i * 91.7) * 4137.17)
  }
  const walkGeo = new THREE.BufferGeometry()
  walkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(wCount * 3), 3))
  const walkers = new THREE.Points(
    walkGeo,
    new THREE.PointsMaterial({
      size: nodeSize * 1.15,
      map: sprite,
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
  scene.add(walkers)

  graph = { points, glow, lines, walkers, positions, succ: a.succ, walkFrom, walkT, wCount, M, edges, a, nodeSize }
  hlNodes.material.size = nodeSize * 2.4
  seedMark.material.size = nodeSize * 3.2
  setHover(-1)
  updateSeedMark()
  fitCamera(positions, M)
}

function writeEdge(arr, o, pos, s, t) {
  arr[o] = pos[s * 3]
  arr[o + 1] = pos[s * 3 + 1]
  arr[o + 2] = pos[s * 3 + 2]
  arr[o + 3] = pos[t * 3]
  arr[o + 4] = pos[t * 3 + 1]
  arr[o + 5] = pos[t * 3 + 2]
}

function disposeGraph() {
  if (!graph) return
  for (const o of [graph.points, graph.glow, graph.lines, graph.walkers]) {
    scene.remove(o)
    o.geometry.dispose()
    o.material.dispose()
  }
  graph = null
}

function stepWalkers(dt) {
  if (!graph) return
  const { positions, succ, walkFrom, walkT, wCount } = graph
  const arr = graph.walkers.geometry.attributes.position.array
  const speed = 0.85
  for (let i = 0; i < wCount; i++) {
    let t = walkT[i] + dt * speed
    let from = walkFrom[i]
    while (t >= 1) { from = succ[from]; t -= 1 }
    walkFrom[i] = from
    walkT[i] = t
    const to = succ[from]
    const e = t * t * (3 - 2 * t) // ease so sparks linger on the states themselves
    const f = from * 3
    const g = to * 3
    arr[i * 3] = positions[f] + (positions[g] - positions[f]) * e
    arr[i * 3 + 1] = positions[f + 1] + (positions[g + 1] - positions[f + 1]) * e
    arr[i * 3 + 2] = positions[f + 2] + (positions[g + 2] - positions[f + 2]) * e
  }
  graph.walkers.geometry.attributes.position.needsUpdate = true
}

/**
 * Frame the whole field exactly: project every node onto the camera basis and
 * solve for the smallest distance that keeps it inside the frustum. The side
 * panel covers part of the viewport, so its share of the horizontal FOV is
 * withheld from the fit and then panned away — the graph lands in the space
 * actually left over rather than hiding underneath the UI.
 */
function fitCamera(positions, M) {
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  for (let i = 0; i < M; i++) {
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2]
    if (x < minX) minX = x; if (x > maxX) maxX = x
    if (y < minY) minY = y; if (y > maxY) maxY = y
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z
  }
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2

  const dir = new THREE.Vector3(0.35, -0.86, 0.42).normalize() // target -> camera
  const right = new THREE.Vector3().crossVectors(camera.up, dir).normalize()
  const camUp = new THREE.Vector3().crossVectors(dir, right).normalize()

  const panelFrac = innerWidth > 720 ? Math.min(0.45, 352 / innerWidth) : 0
  const tanV = Math.tan((camera.fov * Math.PI) / 360)
  const tanH = tanV * camera.aspect * (1 - panelFrac)

  const p = new THREE.Vector3()
  let d = 1
  for (let i = 0; i < M; i++) {
    p.set(positions[i * 3] - cx, positions[i * 3 + 1] - cy, positions[i * 3 + 2] - cz)
    const along = p.dot(dir)
    const need = Math.max(Math.abs(p.dot(right)) / tanH, Math.abs(p.dot(camUp)) / tanV)
    if (along + need > d) d = along + need
  }
  d *= 1.06

  // Slide the whole view sideways by half the panel's width at this depth.
  const shift = panelFrac * d * tanV * camera.aspect
  const target = new THREE.Vector3(cx, cy, cz).addScaledVector(right, -shift)

  controls.target.copy(target)
  camera.position.copy(target).addScaledVector(dir, d)
  camera.near = Math.max(0.5, d / 900)
  camera.far = d * 12
  camera.updateProjectionMatrix()
  controls.minDistance = d / 60
  controls.maxDistance = d * 6
  controls.update()
}

// ---------------------------------------------------------------------------
// Hover + click picking
// ---------------------------------------------------------------------------
// Hovering resolves to a *source state*: on an edge that's the state the edge
// leaves, on a node the node itself. Either way the thing being described is the
// transition state -> succ[state], so both paths share one code path. The node
// fallback also covers fixed points, whose self-loop edge has zero length and so
// is never drawn or hit.
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
const tip = document.getElementById('tip')

let hovered = -1
let pointerInside = false
let needPick = false
let cursorX = 0
let cursorY = 0
let downX = 0
let downY = 0
let dragging = false

const hlLine = new THREE.LineSegments(
  new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3)),
  new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthTest: false })
)
hlLine.renderOrder = 10
hlLine.visible = false
scene.add(hlLine)

const hlNodes = new THREE.Points(
  new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3)),
  new THREE.PointsMaterial({
    map: sprite, color: 0xffffff, size: 8, transparent: true,
    depthTest: false, depthWrite: false, sizeAttenuation: true,
  })
)
hlNodes.renderOrder = 11
hlNodes.visible = false
scene.add(hlNodes)

// Where the spacetime panel's seed sits in the graph.
const seedMark = new THREE.Points(
  new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3)),
  new THREE.PointsMaterial({
    map: sprite, color: 0x66ccff, size: 10, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, sizeAttenuation: true,
  })
)
seedMark.renderOrder = 9
seedMark.visible = false
scene.add(seedMark)

function updateSeedMark() {
  if (!graph || seed >= graph.M) { seedMark.visible = false; return }
  const p = seedMark.geometry.attributes.position.array
  p[0] = graph.positions[seed * 3]
  p[1] = graph.positions[seed * 3 + 1]
  p[2] = graph.positions[seed * 3 + 2]
  seedMark.geometry.attributes.position.needsUpdate = true
  seedMark.visible = true
}

const canvas = renderer.domElement
canvas.addEventListener('pointermove', (e) => {
  const r = canvas.getBoundingClientRect()
  pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
  pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
  cursorX = e.clientX
  cursorY = e.clientY
  pointerInside = true
  needPick = true
})
canvas.addEventListener('pointerleave', () => { pointerInside = false; needPick = true })
canvas.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; dragging = false })
canvas.addEventListener('pointerup', (e) => {
  // Only a press that didn't orbit counts as a click.
  if (Math.hypot(e.clientX - downX, e.clientY - downY) < 5 && hovered >= 0) setSeed(hovered)
})
controls.addEventListener('start', () => { dragging = true; tip.classList.remove('show') })
controls.addEventListener('end', () => { dragging = false; needPick = true })
controls.addEventListener('change', () => { needPick = true })

function pick() {
  if (!graph || !pointerInside || dragging) { setHover(-1); return }

  // Keep the pick radius a constant number of screen pixels at any zoom.
  const d = camera.position.distanceTo(controls.target)
  const worldPerPixel = (2 * d * Math.tan((camera.fov * Math.PI) / 360)) / canvas.clientHeight
  raycaster.params.Line.threshold = 7 * worldPerPixel
  raycaster.params.Points.threshold = 7 * worldPerPixel
  raycaster.setFromCamera(pointer, camera)

  const onEdge = raycaster.intersectObject(graph.lines, false)
  if (onEdge.length) { setHover(graph.edges[onEdge[0].index >> 1]); return }
  const onNode = raycaster.intersectObject(graph.points, false)
  setHover(onNode.length ? onNode[0].index : -1)
}

function setHover(s) {
  if (s === hovered) { if (s >= 0) placeTip(); return }
  hovered = s
  canvas.style.cursor = s >= 0 ? 'pointer' : 'default'
  if (s < 0) {
    hlLine.visible = false
    hlNodes.visible = false
    tip.classList.remove('show')
    return
  }
  const t = graph.succ[s]
  const P = graph.positions
  const lp = hlLine.geometry.attributes.position.array
  lp[0] = P[s * 3]; lp[1] = P[s * 3 + 1]; lp[2] = P[s * 3 + 2]
  lp[3] = P[t * 3]; lp[4] = P[t * 3 + 1]; lp[5] = P[t * 3 + 2]
  hlLine.geometry.attributes.position.needsUpdate = true
  hlNodes.geometry.attributes.position.array.set(lp)
  hlNodes.geometry.attributes.position.needsUpdate = true
  hlLine.visible = s !== t // a fixed point's self-edge has no length to draw
  hlNodes.visible = true

  renderTip(s, t)
  tip.classList.add('show')
  placeTip()
}

/** One state as a row of cells; cells that differ from `other` get an outline. */
function cellRow(v, other, n) {
  let out = ''
  for (let i = n - 1; i >= 0; i--) {
    const on = (v >> i) & 1
    const changed = (other >> i & 1) !== on
    out += `<i class="${on ? 'on' : ''}${changed ? ' ch' : ''}"></i>`
  }
  return out
}

function stateTags(v) {
  const a = graph.a
  if (a.onCycle[v]) return '<em class="ring">on ring</em>'
  const tags = [`<em>${a.dist[v]} to attractor</em>`]
  if (a.rev[v].length === 0) tags.push('<em class="eden">eden</em>')
  return tags.join('')
}

function renderTip(s, t) {
  const n = graph.a.N
  let changed = 0
  for (let i = 0; i < n; i++) if (((s ^ t) >> i) & 1) changed++
  tip.innerHTML =
    `<div class="tip-head"><span>state transition</span><span>one tick</span></div>` +
    `<div class="tip-row"><div class="tip-cells">${cellRow(s, t, n)}</div><span class="tip-id">#${s}</span></div>` +
    `<div class="tip-arrow">↓ rule ${rule}${s === t ? ' · maps to itself' : ''}</div>` +
    `<div class="tip-row"><div class="tip-cells">${cellRow(t, s, n)}</div><span class="tip-id">#${t}</span></div>` +
    `<div class="tip-tags">${stateTags(s)}${stateTags(t)}` +
    `<em>${changed} of ${n} cells changed</em></div>` +
    `<div class="tip-hint">click to seed the spacetime view</div>`
}

function placeTip() {
  const r = tip.getBoundingClientRect()
  let left = cursorX + 18
  let top = cursorY + 18
  if (left + r.width > innerWidth - 10) left = cursorX - r.width - 18
  if (top + r.height > innerHeight - 10) top = cursorY - r.height - 18
  tip.style.left = `${Math.max(10, left)}px`
  tip.style.top = `${Math.max(10, top)}px`
}

// ---------------------------------------------------------------------------
// Render loop
// ---------------------------------------------------------------------------
let flowOn = true
let autoRotateWanted = true
let last = performance.now()
function animate() {
  requestAnimationFrame(animate)
  const now = performance.now()
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  if (flowOn) stepWalkers(dt)
  // Hold still while a link is being read, or it drifts out from under the cursor.
  controls.autoRotate = autoRotateWanted && hovered < 0
  controls.update()
  if (needPick) { needPick = false; pick() }
  renderer.render(scene, camera)
}
animate()

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------
const els = {
  rule: document.getElementById('rule'),
  prev: document.getElementById('prev'),
  next: document.getElementById('next'),
  random: document.getElementById('random'),
  interesting: document.getElementById('interesting'),
  width: document.getElementById('width'),
  widthval: document.getElementById('widthval'),
  statecount: document.getElementById('statecount'),
  autorotate: document.getElementById('autorotate'),
  flow: document.getElementById('flow'),
  stats: document.getElementById('stats'),
  spacetime: document.getElementById('spacetime'),
  ruleicon: document.getElementById('ruleicon'),
  loading: document.getElementById('loading'),
  seed: document.getElementById('seed'),
  seedbits: document.getElementById('seedbits'),
  seedrandom: document.getElementById('seedrandom'),
  seedfate: document.getElementById('seedfate'),
}

let rule = 110
let N = 9
let seed = 1 << (N >> 1) // the classic single lit cell

const TOUR = [110, 30, 90, 54, 150, 184, 22, 122, 105, 60, 73, 45, 126, 18, 161, 250, 99, 124]
let tourPos = 0

function setStats(a) {
  const rows = [
    ['states', a.M.toLocaleString()],
    ['basins', a.attractors],
    ['longest cycle', a.maxCycle],
    ['fixed points', a.fixedPoints],
    ['deepest tree', a.maxDist],
    ['eden states', a.edenCount],
  ]
  els.stats.innerHTML = rows
    .map(([k, v]) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div></div>`)
    .join('')
}

/** Redraw the spacetime panel and everything that reports the current seed. */
function drawSeed() {
  seed = clamp(seed, 0, (1 << N) - 1)
  els.seed.max = (1 << N) - 1
  els.seed.value = seed

  let bits = ''
  for (let i = N - 1; i >= 0; i--) bits += `<i class="${(seed >> i) & 1 ? 'on' : ''}"></i>`
  els.seedbits.innerHTML = bits

  const { transient, period } = drawSpacetime(els.spacetime, rule, N, seed)
  els.seedfate.textContent = transient === 0
    ? `already on a period-${period} cycle`
    : `falls in after ${transient}, then period ${period}`
  updateSeedMark()
}

function setSeed(s) {
  seed = s
  drawSeed()
}

let timer = null
function update({ rebuild = true } = {}) {
  rule = clamp(parseInt(els.rule.value) || 0, 0, 255)
  els.rule.value = rule
  drawRuleIcon(els.ruleicon, rule)
  drawSeed()
  if (!rebuild) return

  els.loading.classList.add('show')
  clearTimeout(timer)
  timer = setTimeout(() => {
    const a = analyzeRule(rule, N)
    setStats(a)
    buildGraph(a)
    els.loading.classList.remove('show')
  }, 16)
}

function setRule(r) {
  els.rule.value = ((r % 256) + 256) % 256
  update()
}

els.rule.addEventListener('change', () => update())
els.prev.addEventListener('click', () => setRule(rule - 1))
els.next.addEventListener('click', () => setRule(rule + 1))
els.random.addEventListener('click', () => setRule(Math.floor(Math.random() * 256)))
els.interesting.addEventListener('click', () => {
  tourPos = (tourPos + 1) % TOUR.length
  setRule(TOUR[tourPos])
})

// `input` only previews the labels — it must not touch N, or the `change`
// handler below would read the new value as its own previous one.
els.width.addEventListener('input', () => {
  const n = parseInt(els.width.value)
  els.widthval.textContent = n
  els.statecount.textContent = `= ${(1 << n).toLocaleString()} states`
})
els.width.addEventListener('change', () => {
  const prev = N
  N = parseInt(els.width.value)
  // Keep the seed pattern anchored at the same end of the ring when N changes.
  if (N > prev) seed <<= N - prev
  else seed >>= prev - N
  update()
})

els.seed.addEventListener('input', () => setSeed(parseInt(els.seed.value)))
els.seedrandom.addEventListener('click', () => setSeed(Math.floor(Math.random() * (1 << N))))

els.autorotate.addEventListener('change', () => { autoRotateWanted = els.autorotate.checked })
els.flow.addEventListener('change', () => {
  flowOn = els.flow.checked
  if (graph) graph.walkers.visible = flowOn
})

addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return
  if (e.key === 'ArrowRight') setRule(rule + 1)
  else if (e.key === 'ArrowLeft') setRule(rule - 1)
  else if (e.key === 'r' || e.key === 'R') els.random.click()
})

els.width.value = N
els.widthval.textContent = N
els.statecount.textContent = `= ${(1 << N).toLocaleString()} states`
update()

// ---------------------------------------------------------------------------
function frac(x) { return x - Math.floor(x) }
function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)) }

function makeDiscTexture() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.8)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(c)
}
