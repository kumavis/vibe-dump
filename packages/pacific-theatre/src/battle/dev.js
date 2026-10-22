// Dev-only entry of battle.html (ENGINEERING.md §1, §13 engine): not in the
// build. Two pages in one:
//
//   battle.html?view=kits[&data=./test-data/][&date=1942-06-04][&only=yamato,a6m2]
//       the kits as a contact sheet: every ship and aircraft kit built and lit,
//       side by side, each scaled to its cell, its id beneath it.
//   battle.html?box=test-box&t=10:20&moment=test-dive[&data=./test-data/]
//       the app booted on the data, straight into the box at t (no fly-down),
//       with the moment offered: the engine's way in before integration.
//
// The second uses App (src/app.js) as it is and Battle's own box side of the
// hand-over; see battle/index.js for the calls App will make.

import * as THREE from 'three'
import { dataBase } from '../config.js'

const params = new URLSearchParams(location.search)
const status = (t) => {
  const el = document.getElementById('dev-status')
  if (el) el.textContent = t
}

async function getJSON(url) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`)
  return r.json()
}

async function contactSheet() {
  const { Pipeline } = await import('../render/pipeline.js')
  const { shipGeometry, aircraftGeometry, insigniaAtlas, insigniaRects, shipAsOne } = await import('./kits/index.js')
  const { shipMaterial, aircraftMaterial, setPixelScale } = await import('./scene/materials.js')
  const base = dataBase()
  const [ships, aircraft, weapons] = await Promise.all([getJSON(`${base}kits/ships.json`), getJSON(`${base}kits/aircraft.json`), getJSON(`${base}kits/weapons.json`).catch(() => [])])
  const only = params.get('only') ? new Set(params.get('only').split(',')) : null
  const date = params.get('date') || '1942-06-04'
  const wmap = new Map(weapons.map((w) => [w.id, w]))
  const canvas = document.getElementById('scene')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, logarithmicDepthBuffer: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1))
  const W = innerWidth
  const H = innerHeight
  renderer.setSize(W, H, false)
  const pipeline = new Pipeline(renderer)
  pipeline.setSize(W, H, renderer.getPixelRatio())
  pipeline.setFog(0, 1)
  const sky = new THREE.DataTexture(new Uint8Array([90, 110, 140, 255]), 1, 1)
  sky.needsUpdate = true
  const light = {
    uSunDir: { value: new THREE.Vector3(0.55, 0.62, 0.35).normalize() },
    uSunColor: { value: new THREE.Color(2.4, 2.25, 2.0) },
    uSkyColor: { value: new THREE.Color(0.32, 0.36, 0.42) },
    uGroundColor: { value: new THREE.Color(0.12, 0.11, 0.1) },
    uMoonDir: { value: new THREE.Vector3(0, -1, 0) },
    uMoonColor: { value: new THREE.Color(0, 0, 0) },
    uTime: { value: 0 },
    uSkyMap: { value: sky },
    uPointPos: { value: Array.from({ length: 8 }, () => new THREE.Vector4(0, -1e9, 0, 1)) },
    uPointCol: { value: Array.from({ length: 8 }, () => new THREE.Vector3()) },
    uPointCount: { value: 0 },
  }
  const pu = pipeline.uniforms
  pu.uSunDir.value.copy(light.uSunDir.value)
  pu.uFogColor.value.setRGB(0.4, 0.45, 0.5)
  pu.uExposure.value = 0.6
  pu.uSkyMap.value = sky
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0.05, 0.06, 0.07)
  const S = ships.filter((k) => !only || only.has(k.id))
  const A = aircraft.filter((k) => !only || only.has(k.id))
  const items = [...S.map((k) => ({ kind: 'ship', k })), ...A.map((k) => ({ kind: 'air', k }))]
  const cols = only ? Math.min(Number(params.get('cols') || 2), items.length) : Math.max(1, Math.min(9, Math.ceil(Math.sqrt(items.length * 1.6))))
  const cell = 100
  const rows = Math.ceil(items.length / cols)
  const labels = document.getElementById('kit-labels')
  const mats = []
  const atlas = insigniaAtlas()
  const rects = insigniaRects()
  const placed = []
  items.forEach((it, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    const x = (c - (cols - 1) / 2) * cell
    // (a close sheet stacks its rows in height, seen nearly side-on; the whole sheet in depth, seen from above)
    const z = only ? 0 : (r - (rows - 1) / 2) * cell * 0.62
    const yRow = only ? ((rows - 1) / 2 - r) * cell * (items.some((q) => q.kind === 'air') ? 0.55 : 0.34) : 0
    let mesh
    let len
    if (it.kind === 'ship') {
      const g = shipGeometry(it.k, { colourDate: date, weapons: wmap })
      const geo = shipAsOne(g)
      len = it.k.loa
      const m = shipMaterial(light, len)
      m.uniforms.uMinPx.value = 0
      m.uniforms.uSeaY.value = only ? ((rows - 1) / 2 - r) * cell * (items.some((q) => q.kind === 'air') ? 0.55 : 0.34) : 0
      mats.push(m)
      mesh = new THREE.Mesh(geo, m)
    } else {
      const g = aircraftGeometry(it.k, { colourDate: date })
      const geo = g.body.clone()
      const rect = rects[g.insignia]
      const n = geo.attributes.position.count
      const ins = new Float32Array(n * 4)
      for (let v = 0; v < n; v++) ins.set(rect, v * 4)
      geo.setAttribute('aInsignia', new THREE.BufferAttribute(ins, 4))
      len = Math.max(it.k.span, it.k.length)
      const m = aircraftMaterial(light, len, atlas)
      m.uniforms.uMinPx.value = 0
      m.uniforms.uSeaY.value = -1e9
      mats.push(m)
      mesh = new THREE.Group()
      mesh.add(new THREE.Mesh(geo, m))
      const pm = aircraftMaterial(light, len, atlas)
      pm.uniforms.uMinPx.value = 0
      pm.uniforms.uSeaY.value = -1e9
      mats.push(pm)
      mesh.add(new THREE.Mesh(g.prop, pm))
    }
    const k = (cell * 0.84) / len
    mesh.scale.setScalar(k)
    // ships broadside-on with the bow to the left; aircraft three-quarter from above
    if (it.kind === 'ship') mesh.rotation.y = Math.PI / 2
    else {
      mesh.rotation.y = Math.PI * 0.72
      mesh.rotation.x = 0.35
    }
    mesh.position.set(x, yRow + (it.kind === 'ship' ? 0 : 8), z)
    scene.add(mesh)
    const el = document.createElement('div')
    el.textContent = it.kind === 'ship' ? `${it.k.id} (${it.k.class})` : `${it.k.id}`
    labels.appendChild(el)
    placed.push({ el, p: new THREE.Vector3(x, yRow + (it.kind === 'ship' ? -cell * 0.06 : -cell * 0.1), z + cell * 0.12) })
  })
  // a pale sea plane at the waterline to read the freeboard against
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(cell * cols * 1.2, cell * rows), new THREE.MeshBasicMaterial({ color: 0x0b1620 }))
  sea.rotation.x = -Math.PI / 2
  sea.position.y = -0.3
  if (!only) scene.add(sea)
  const camera = new THREE.PerspectiveCamera(only && items.length <= 4 ? 30 : 34, W / H, 1, 1e5)
  const rowH = only ? cell * (A.length ? 0.55 : 0.34) : cell * 0.62
  const tanH = Math.tan((camera.fov * Math.PI) / 360)
  const dist = Math.max((cell * cols) / (2 * tanH * (W / H)), (rowH * (rows + 0.4)) / (2 * tanH)) * 1.04
  const el = Number(params.get('el') ?? (only ? 0.16 : 0.67))
  camera.position.set(0, dist * Math.sin(el), dist * Math.cos(el))
  camera.lookAt(0, 0, 0)
  camera.updateMatrixWorld()
  setPixelScale(mats, camera, H)
  pipeline.render(scene, camera)
  const v = new THREE.Vector3()
  for (const { el, p } of placed) {
    v.copy(p).project(camera)
    el.style.left = `${((v.x + 1) / 2) * W}px`
    el.style.top = `${((1 - v.y) / 2) * H}px`
  }
  window.__sheet = { ready: true, count: items.length }
  status(`${S.length} ship kits, ${A.length} aircraft kits, colours at ${date}`)
}

async function boxPage() {
  const { bootBox } = await import('./devbox.js')
  await bootBox(params, status)
}

;(params.get('view') === 'kits' ? contactSheet() : boxPage()).catch((err) => {
  console.error(err)
  status(`failed: ${err.message}`)
})
