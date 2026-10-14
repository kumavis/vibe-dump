import * as THREE from 'three'
import { damp } from '../core/mathx.js'

// First-person weapon models, drawn in their own little scene over the world
// so they never clip into walls. Built from primitives; animated procedurally
// (bob, sway, recoil, reload dip, switch). The scanner has a live screen.

function L(color, extra = {}) {
  return new THREE.MeshLambertMaterial({ color, ...extra })
}
const MAT = {
  gun: L(0x2b2d2f),
  steel: L(0x55585c),
  orange: L(0xd8762a),
  yellow: L(0xd8b030),
  wood: L(0x6b4426),
  glove: L(0x3a3a2a),
  sleeve: L(0x7a7350),
  lens: new THREE.MeshPhongMaterial({ color: 0x3060a0, shininess: 100, specular: 0x88aaff }),
  fletch: L(0xff5a20),
}

function box(w, h, d, mat, x, y, z, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.rotation.set(rx, ry, rz)
  return m
}
function cyl(r, len, mat, x, y, z, seg = 10, r2 = r) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r2, len, seg), mat)
  m.rotation.x = Math.PI / 2
  m.position.set(x, y, z)
  return m
}

function hands(g, gripZ, foreZ, foreX = -0.02) {
  g.add(box(0.05, 0.09, 0.08, MAT.glove, 0.0, -0.06, gripZ, 0.25))
  g.add(box(0.06, 0.07, 0.24, MAT.sleeve, 0.01, -0.1, gripZ + 0.15, 0.35))
  if (foreZ != null) {
    g.add(box(0.06, 0.05, 0.09, MAT.glove, foreX, -0.04, foreZ, 0, 0, 0.2))
    g.add(box(0.07, 0.07, 0.3, MAT.sleeve, foreX - 0.06, -0.1, foreZ + 0.17, 0.25, 0.35, 0))
  }
}

function pistol() {
  const g = new THREE.Group()
  g.add(box(0.035, 0.045, 0.2, MAT.gun, 0, 0.02, -0.06))
  g.add(cyl(0.011, 0.08, MAT.steel, 0, 0.025, -0.19))
  g.add(cyl(0.013, 0.12, MAT.yellow, 0, -0.012, -0.08))
  g.add(box(0.032, 0.1, 0.045, MAT.gun, 0, -0.04, 0.02, 0.25))
  g.add(box(0.036, 0.008, 0.2, MAT.orange, 0, 0.044, -0.06))
  g.add(box(0.006, 0.012, 0.01, MAT.gun, 0, 0.05, -0.15))
  hands(g, 0.02, null)
  return { g, muzzle: new THREE.Vector3(0, 0.025, -0.24), hip: new THREE.Vector3(0.17, -0.17, -0.38), ads: new THREE.Vector3(0, -0.075, -0.3) }
}

function tranqRifle() {
  const g = new THREE.Group()
  g.add(box(0.05, 0.07, 0.34, MAT.gun, 0, 0, -0.05))
  g.add(cyl(0.014, 0.42, MAT.steel, 0, 0.012, -0.42))
  g.add(cyl(0.02, 0.26, MAT.yellow, 0, -0.04, -0.2))
  g.add(box(0.04, 0.1, 0.24, MAT.orange, 0, -0.02, 0.22, 0.12))
  g.add(box(0.035, 0.09, 0.05, MAT.gun, 0, -0.07, 0.05, 0.3))
  g.add(cyl(0.022, 0.2, MAT.gun, 0, 0.07, -0.06))
  g.add(cyl(0.019, 0.01, MAT.lens, 0, 0.07, -0.16))
  const dart = new THREE.Group()
  dart.add(cyl(0.005, 0.06, MAT.steel, 0, 0, 0))
  dart.add(cyl(0.012, 0.02, MAT.fletch, 0, 0, 0.035, 6, 0.004))
  dart.position.set(0.028, 0.02, 0.02)
  g.add(dart)
  hands(g, 0.06, -0.24)
  return { g, muzzle: new THREE.Vector3(0, 0.012, -0.64), hip: new THREE.Vector3(0.16, -0.16, -0.42), ads: new THREE.Vector3(0, -0.07, -0.26), dart }
}

function huntingRifle() {
  const g = new THREE.Group()
  g.add(box(0.045, 0.06, 0.3, MAT.gun, 0, 0, -0.06))
  g.add(cyl(0.012, 0.5, MAT.gun, 0, 0.01, -0.45))
  g.add(box(0.05, 0.06, 0.5, MAT.wood, 0, -0.03, -0.05))
  g.add(box(0.045, 0.11, 0.24, MAT.wood, 0, -0.04, 0.28, 0.15))
  g.add(cyl(0.024, 0.24, MAT.gun, 0, 0.07, -0.06))
  g.add(cyl(0.02, 0.01, MAT.lens, 0, 0.07, -0.18))
  g.add(box(0.04, 0.012, 0.012, MAT.steel, 0.035, 0.02, 0.06))
  hands(g, 0.08, -0.24)
  return { g, muzzle: new THREE.Vector3(0, 0.01, -0.72), hip: new THREE.Vector3(0.16, -0.16, -0.42), ads: new THREE.Vector3(0, -0.07, -0.26) }
}

function shotgun() {
  const g = new THREE.Group()
  g.add(box(0.05, 0.07, 0.26, MAT.gun, 0, 0, -0.02))
  g.add(cyl(0.016, 0.5, MAT.gun, 0, 0.018, -0.4))
  g.add(cyl(0.013, 0.4, MAT.steel, 0, -0.016, -0.34))
  g.add(box(0.05, 0.05, 0.14, MAT.wood, 0, -0.02, -0.3))
  g.add(box(0.045, 0.11, 0.26, MAT.wood, 0, -0.04, 0.24, 0.15))
  g.add(box(0.006, 0.01, 0.01, MAT.steel, 0, 0.04, -0.62))
  hands(g, 0.06, -0.3)
  return { g, muzzle: new THREE.Vector3(0, 0.018, -0.66), hip: new THREE.Vector3(0.16, -0.17, -0.42), ads: new THREE.Vector3(0, -0.06, -0.3), pump: g.children[3] }
}

function scanner() {
  const g = new THREE.Group()
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 160
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  g.add(box(0.15, 0.1, 0.025, MAT.yellow, 0, 0, 0, -0.5))
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.125, 0.078), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
  screen.position.set(0, 0.006, 0.0135)
  screen.rotation.x = -0.5
  g.add(screen)
  g.add(cyl(0.004, 0.08, MAT.gun, 0.06, 0.06, -0.03))
  g.add(box(0.04, 0.05, 0.05, MAT.gun, 0, -0.06, 0.03, 0.2))
  hands(g, 0.04, null)
  return { g, muzzle: new THREE.Vector3(0, 0, -0.1), hip: new THREE.Vector3(0.12, -0.15, -0.32), ads: new THREE.Vector3(0.0, -0.1, -0.26), canvas, tex }
}

export class ViewModels {
  constructor(G) {
    this.G = G
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(58, 1, 0.01, 5)
    this.hemi = new THREE.HemisphereLight(0xffffff, 0x404030, 1.2)
    this.dir = new THREE.DirectionalLight(0xffffff, 1.5)
    this.dir.position.set(0.5, 1, 0.3)
    this.scene.add(this.hemi, this.dir)
    this.root = new THREE.Group()
    this.scene.add(this.root)
    this.models = { pistol: pistol(), rifle: tranqRifle(), hunting: huntingRifle(), shotgun: shotgun(), scanner: scanner() }
    for (const m of Object.values(this.models)) {
      m.g.visible = false
      this.root.add(m.g)
    }
    this.current = null
    this.off = new THREE.Vector3()
    this.rot = new THREE.Euler()
    this.kick = 0
    this.swayX = 0
    this.swayY = 0
    this.lower = 1
    this.reloadDip = 0
    this.screenState = ''
  }

  show(id) {
    if (this.current) this.models[this.current].g.visible = false
    this.current = id
    if (id) this.models[id].g.visible = true
  }

  fire(strength) {
    this.kick = Math.min(1.5, this.kick + strength)
  }

  setAspect(a) {
    this.camera.aspect = a
    this.camera.updateProjectionMatrix()
  }

  // Draw the scanner's screen (throttled to state changes).
  drawScreen(info) {
    const key = JSON.stringify(info)
    if (key === this.screenState) return
    this.screenState = key
    const m = this.models.scanner
    const c = m.canvas.getContext('2d')
    c.fillStyle = '#0a1a14'
    c.fillRect(0, 0, 256, 160)
    c.strokeStyle = '#1f5a40'
    for (let y = 0; y < 160; y += 6) {
      c.beginPath()
      c.moveTo(0, y)
      c.lineTo(256, y)
      c.stroke()
    }
    c.fillStyle = '#6dfcb0'
    c.font = 'bold 20px monospace'
    c.fillText('FIELD SCANNER', 12, 28)
    c.font = '16px monospace'
    c.fillText(info.line1 || 'NO TARGET', 12, 60)
    c.fillStyle = '#a8ffd4'
    c.fillText(info.line2 || '', 12, 84)
    if (info.progress != null) {
      c.strokeStyle = '#6dfcb0'
      c.strokeRect(12, 104, 232, 18)
      c.fillStyle = '#6dfcb0'
      c.fillRect(14, 106, 228 * Math.min(1, info.progress), 14)
    }
    c.fillStyle = '#6dfcb0'
    c.font = '13px monospace'
    c.fillText(info.line3 || '', 12, 146)
    m.tex.needsUpdate = true
  }

  update(dt, s) {
    // s: { id, aim, bob, moving, sprint, look: {dx, dy}, reloading, switching, crouch, light }
    if (s.id !== this.current) this.show(s.id)
    const m = this.current && this.models[this.current]
    if (!m) return
    this.kick = damp(this.kick, 0, 12, dt)
    this.swayX = damp(this.swayX, -s.look.dx * 0.6, 8, dt)
    this.swayY = damp(this.swayY, s.look.dy * 0.6, 8, dt)
    this.lower = damp(this.lower, s.switching || s.hidden ? 1 : 0, 14, dt)
    this.reloadDip = damp(this.reloadDip, s.reloading ? 1 : 0, 8, dt)
    const aim = s.aim
    const base = m.hip.clone().lerp(m.ads, aim)
    const bobK = s.moving * (1 - aim * 0.85) * (s.sprint ? 1.6 : 1)
    this.root.position.set(
      base.x + Math.sin(s.bob) * 0.012 * bobK + this.swayX * 0.02,
      base.y + Math.abs(Math.cos(s.bob)) * 0.01 * bobK - this.lower * 0.35 - this.reloadDip * 0.08 + this.swayY * 0.02 - (s.sprint ? 0.04 : 0),
      base.z + this.kick * 0.05,
    )
    this.root.rotation.set(this.kick * 0.18 - this.reloadDip * 0.6 + (s.sprint ? -0.25 : 0), this.swayX * 0.05 + (s.sprint ? 0.5 : 0), this.reloadDip * 0.35 + this.swayX * 0.05)
    if (m.dart) m.dart.visible = s.loaded
    this.hemi.intensity = 0.4 + s.light * 1.0
    this.dir.intensity = 0.3 + s.light * 1.5
  }

  render(renderer) {
    renderer.clearDepth()
    renderer.render(this.scene, this.camera)
  }
}
