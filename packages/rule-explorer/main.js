import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { analyzeRule, drawSpacetime, drawRuleIcon } from './ca.js'

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------
const container = document.getElementById('graph')
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
container.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x05060b)
scene.fog = new THREE.FogExp2(0x05060b, 0.0016)

const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 6000)
camera.position.set(0, 0, 320)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.07
controls.autoRotate = true
controls.autoRotateSpeed = 0.55
controls.minDistance = 8
controls.maxDistance = 4000

// Soft circular sprite shared by all point clouds.
const sprite = makeDiscTexture()

// ---------------------------------------------------------------------------
// State graph objects (rebuilt per rule)
// ---------------------------------------------------------------------------
let graph = null // { points, glow, lines, positions, velocities, succ, onCycle, settled, alpha, M }
const tmpColor = new THREE.Color()

function buildGraph(a) {
  disposeGraph()

  const M = a.M
  const positions = new Float32Array(M * 3)
  const velocities = new Float32Array(M * 3)

  // Seed positions on a jittered sphere shell so the sim untangles cleanly.
  const R0 = Math.cbrt(M) * 9 + 20
  for (let i = 0; i < M; i++) {
    // deterministic pseudo-random from index (no Math.random needed for repeatability)
    const u = frac(Math.sin(i * 12.9898) * 43758.5453)
    const v = frac(Math.sin(i * 78.233) * 12345.6789)
    const theta = u * Math.PI * 2
    const phi = Math.acos(2 * v - 1)
    const rr = R0 * (0.55 + 0.45 * frac(Math.sin(i * 3.7) * 9999))
    positions[i * 3] = rr * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = rr * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = rr * Math.cos(phi)
  }

  // Per-node colours: component hue, lightness driven by distance to attractor.
  const nodeColors = new Float32Array(M * 3)
  const maxD = Math.max(1, a.maxDist)
  for (let i = 0; i < M; i++) {
    const hue = frac(a.compOf[i] * 0.61803398875 + 0.06)
    const cycle = a.onCycle[i]
    const t = a.dist[i] / maxD // 0 at attractor, 1 deepest transient
    const light = cycle ? 0.66 : 0.52 - 0.3 * t
    const sat = cycle ? 0.85 : 0.7
    tmpColor.setHSL(hue, sat, Math.max(0.16, light))
    nodeColors[i * 3] = tmpColor.r
    nodeColors[i * 3 + 1] = tmpColor.g
    nodeColors[i * 3 + 2] = tmpColor.b
  }

  // Node cloud.
  const nodeSize = clamp(220 / Math.sqrt(M), 2.2, 9)
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
      alphaTest: 0.04,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
  scene.add(points)

  // Bright additive glow on attractor (cycle) nodes only.
  const cycleIdx = []
  for (let i = 0; i < M; i++) if (a.onCycle[i]) cycleIdx.push(i)
  const glowPos = new Float32Array(cycleIdx.length * 3)
  const glowCol = new Float32Array(cycleIdx.length * 3)
  for (let j = 0; j < cycleIdx.length; j++) {
    const i = cycleIdx[j]
    const hue = frac(a.compOf[i] * 0.61803398875 + 0.06)
    tmpColor.setHSL(hue, 0.9, 0.72)
    glowCol[j * 3] = tmpColor.r
    glowCol[j * 3 + 1] = tmpColor.g
    glowCol[j * 3 + 2] = tmpColor.b
  }
  const glowGeo = new THREE.BufferGeometry()
  glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPos, 3))
  glowGeo.setAttribute('color', new THREE.BufferAttribute(glowCol, 3))
  const glow = new THREE.Points(
    glowGeo,
    new THREE.PointsMaterial({
      size: nodeSize * 2.6,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
  scene.add(glow)

  // Edges s -> succ[s] (skip self-loops, which would be zero-length).
  const edgeList = []
  for (let s = 0; s < M; s++) if (a.succ[s] !== s) edgeList.push(s)
  const linePos = new Float32Array(edgeList.length * 6)
  const lineCol = new Float32Array(edgeList.length * 6)
  for (let e = 0; e < edgeList.length; e++) {
    const s = edgeList[e]
    const t = a.succ[s]
    const both = a.onCycle[s] && a.onCycle[t]
    const hue = frac(a.compOf[s] * 0.61803398875 + 0.06)
    tmpColor.setHSL(hue, both ? 0.9 : 0.6, both ? 0.6 : 0.34)
    for (let k = 0; k < 2; k++) {
      lineCol[e * 6 + k * 3] = tmpColor.r
      lineCol[e * 6 + k * 3 + 1] = tmpColor.g
      lineCol[e * 6 + k * 3 + 2] = tmpColor.b
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
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  )
  scene.add(lines)

  graph = {
    points, glow, lines,
    positions, velocities,
    succ: a.succ, onCycle: a.onCycle, compOf: a.compOf,
    edgeList, cycleIdx,
    M, alpha: 1, settled: false, frames: 0,
    R0,
  }
  syncGeometry()
  fitted = false
}

function disposeGraph() {
  if (!graph) return
  for (const o of [graph.points, graph.glow, graph.lines]) {
    scene.remove(o)
    o.geometry.dispose()
    o.material.dispose()
  }
  graph = null
}

// ---------------------------------------------------------------------------
// 3D force-directed layout (cools down, then freezes)
// ---------------------------------------------------------------------------
function tickLayout() {
  if (!graph || graph.settled) return
  const { positions, velocities, M, succ } = graph
  const alpha = graph.alpha

  const repK = 240 * graph.R0 * 0.04 // repulsion strength scales with graph size
  const springK = 0.035
  const restLen = clamp(graph.R0 * 0.05, 6, 26)
  const gravity = 0.012
  const damping = 0.86
  const maxStep = restLen * 1.2

  // Repulsion (O(M^2)) — only while cooling, so the cost is transient.
  for (let i = 0; i < M; i++) {
    const ix = i * 3
    let fx = 0, fy = 0, fz = 0
    const xi = positions[ix], yi = positions[ix + 1], zi = positions[ix + 2]
    for (let j = i + 1; j < M; j++) {
      const jx = j * 3
      let dx = xi - positions[jx]
      let dy = yi - positions[jx + 1]
      let dz = zi - positions[jx + 2]
      let d2 = dx * dx + dy * dy + dz * dz
      if (d2 < 1e-4) { dx = (i - j) * 1e-3 + 0.01; dy = 0.013; dz = 0.007; d2 = dx * dx + dy * dy + dz * dz }
      const inv = repK / (d2 * Math.sqrt(d2))
      const ax = dx * inv, ay = dy * inv, az = dz * inv
      fx += ax; fy += ay; fz += az
      velocities[jx] -= ax * alpha
      velocities[jx + 1] -= ay * alpha
      velocities[jx + 2] -= az * alpha
    }
    velocities[ix] += fx * alpha
    velocities[ix + 1] += fy * alpha
    velocities[ix + 2] += fz * alpha
  }

  // Springs along directed edges + gentle gravity toward origin.
  for (let s = 0; s < M; s++) {
    const t = succ[s]
    if (t === s) continue
    const sx = s * 3, tx = t * 3
    const dx = positions[tx] - positions[sx]
    const dy = positions[tx + 1] - positions[sx + 1]
    const dz = positions[tx + 2] - positions[sx + 2]
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-4
    const f = (springK * (d - restLen)) / d
    const ax = dx * f * alpha, ay = dy * f * alpha, az = dz * f * alpha
    velocities[sx] += ax; velocities[sx + 1] += ay; velocities[sx + 2] += az
    velocities[tx] -= ax; velocities[tx + 1] -= ay; velocities[tx + 2] -= az
  }

  for (let i = 0; i < M; i++) {
    const ix = i * 3
    velocities[ix] -= positions[ix] * gravity * alpha
    velocities[ix + 1] -= positions[ix + 1] * gravity * alpha
    velocities[ix + 2] -= positions[ix + 2] * gravity * alpha

    velocities[ix] *= damping
    velocities[ix + 1] *= damping
    velocities[ix + 2] *= damping

    let vx = velocities[ix], vy = velocities[ix + 1], vz = velocities[ix + 2]
    const sp = Math.sqrt(vx * vx + vy * vy + vz * vz)
    if (sp > maxStep) { const k = maxStep / sp; vx *= k; vy *= k; vz *= k }
    positions[ix] += vx
    positions[ix + 1] += vy
    positions[ix + 2] += vz
  }

  graph.alpha *= 0.975
  graph.frames++
  if (graph.alpha < 0.02 || graph.frames > 600) graph.settled = true
}

function syncGeometry() {
  if (!graph) return
  const { positions, succ, edgeList, cycleIdx } = graph

  graph.points.geometry.attributes.position.needsUpdate = true

  const glowPos = graph.glow.geometry.attributes.position.array
  for (let j = 0; j < cycleIdx.length; j++) {
    const i = cycleIdx[j] * 3
    glowPos[j * 3] = positions[i]
    glowPos[j * 3 + 1] = positions[i + 1]
    glowPos[j * 3 + 2] = positions[i + 2]
  }
  graph.glow.geometry.attributes.position.needsUpdate = true

  const linePos = graph.lines.geometry.attributes.position.array
  for (let e = 0; e < edgeList.length; e++) {
    const s = edgeList[e] * 3
    const t = succ[edgeList[e]] * 3
    linePos[e * 6] = positions[s]
    linePos[e * 6 + 1] = positions[s + 1]
    linePos[e * 6 + 2] = positions[s + 2]
    linePos[e * 6 + 3] = positions[t]
    linePos[e * 6 + 4] = positions[t + 1]
    linePos[e * 6 + 5] = positions[t + 2]
  }
  graph.lines.geometry.attributes.position.needsUpdate = true
}

let fitted = false
function fitCamera() {
  if (!graph) return
  const { positions, M } = graph
  let r = 1
  for (let i = 0; i < M; i++) {
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2]
    const d = Math.sqrt(x * x + y * y + z * z)
    if (d > r) r = d
  }
  const dist = r / Math.sin((camera.fov * Math.PI) / 180 / 2) * 1.15
  controls.target.set(0, 0, 0)
  const dir = camera.position.clone().normalize()
  camera.position.copy(dir.multiplyScalar(dist))
  camera.updateProjectionMatrix()
}

// ---------------------------------------------------------------------------
// Render loop
// ---------------------------------------------------------------------------
function animate() {
  requestAnimationFrame(animate)
  if (graph && !graph.settled) {
    tickLayout()
    syncGeometry()
    // fit once the layout has roughly taken shape
    if (!fitted && graph.frames > 40) { fitCamera(); fitted = true }
  }
  controls.update()
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
  stats: document.getElementById('stats'),
  spacetime: document.getElementById('spacetime'),
  ruleicon: document.getElementById('ruleicon'),
  loading: document.getElementById('loading'),
}

let rule = 110
let N = 9

// A hand-picked tour of rules with structurally rich / pretty state graphs.
const TOUR = [110, 30, 90, 54, 150, 184, 22, 122, 105, 60, 73, 45, 126, 18, 161, 250, 99, 124]
let tourPos = 0

function setStats(a) {
  const rows = [
    ['states', a.M.toLocaleString()],
    ['attractors', a.attractors],
    ['max cycle', a.maxCycle],
    ['fixed points', a.fixedPoints],
    ['components', a.nComp],
    ['eden states', a.edenCount],
  ]
  els.stats.innerHTML = rows
    .map(([k, v]) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div></div>`)
    .join('')
}

let rebuildTimer = null
function update({ rebuild = true } = {}) {
  rule = clamp(parseInt(els.rule.value) || 0, 0, 255)
  els.rule.value = rule

  drawRuleIcon(els.ruleicon, rule)
  drawSpacetime(els.spacetime, rule)

  if (!rebuild) return
  els.loading.classList.add('show')
  // defer the (potentially heavy) analysis so the loading text can paint
  clearTimeout(rebuildTimer)
  rebuildTimer = setTimeout(() => {
    const a = analyzeRule(rule, N)
    setStats(a)
    els.statecount.textContent = `= ${a.M.toLocaleString()} states`
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
els.random.addEventListener('click', () => setRule(Math.floor(frac(Math.sin(performance.now()) * 9301) * 256)))
els.interesting.addEventListener('click', () => { tourPos = (tourPos + 1) % TOUR.length; setRule(TOUR[tourPos]) })

els.width.addEventListener('input', () => {
  N = parseInt(els.width.value)
  els.widthval.textContent = N
  els.statecount.textContent = `= ${(1 << N).toLocaleString()} states`
})
els.width.addEventListener('change', () => { N = parseInt(els.width.value); update() })

els.autorotate.addEventListener('change', () => { controls.autoRotate = els.autorotate.checked })

addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return
  if (e.key === 'ArrowRight') setRule(rule + 1)
  else if (e.key === 'ArrowLeft') setRule(rule - 1)
  else if (e.key === 'r' || e.key === 'R') els.random.click()
})

// init
els.width.value = N
els.widthval.textContent = N
update()

// ---------------------------------------------------------------------------
// helpers
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
  g.addColorStop(0.35, 'rgba(255,255,255,0.85)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}
