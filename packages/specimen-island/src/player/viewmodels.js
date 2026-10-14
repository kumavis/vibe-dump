import * as THREE from 'three'
import { damp } from '../core/mathx.js'

// First-person weapon models, drawn in their own little scene over the world
// so they never clip into walls. Built from primitives; animated procedurally
// (bob, sway, recoil, reload dip, switch). The scanner and the field camera
// have live screens.

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

// A rugged field camera held at chest height, its back screen tilted up at the
// eye. Raising it (aim) hands over to the DOM viewfinder.
function fieldCamera() {
  const g = new THREE.Group()
  const canvas = document.createElement('canvas')
  canvas.width = 192
  canvas.height = 120
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const body = new THREE.Group()
  body.rotation.x = -0.42
  g.add(body)
  body.add(box(0.14, 0.085, 0.05, MAT.gun, 0, 0, 0))
  body.add(box(0.034, 0.09, 0.064, MAT.glove, 0.058, -0.002, -0.006)) // grip
  body.add(box(0.05, 0.026, 0.044, MAT.gun, -0.012, 0.054, 0.002)) // viewfinder hump
  body.add(box(0.016, 0.009, 0.016, MAT.orange, 0.054, 0.047, -0.004)) // shutter
  body.add(box(0.024, 0.01, 0.024, MAT.steel, 0.026, 0.047, 0.004)) // mode dial
  body.add(box(0.03, 0.012, 0.02, MAT.yellow, -0.04, 0.047, -0.008)) // flash shoe
  body.add(cyl(0.034, 0.08, MAT.steel, -0.012, 0, -0.064, 14)) // lens barrel
  body.add(cyl(0.039, 0.024, MAT.gun, -0.012, 0, -0.1, 14)) // focus ring
  body.add(cyl(0.028, 0.004, MAT.lens, -0.012, 0, -0.113, 14))
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.084, 0.0525), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
  screen.position.set(-0.012, -0.004, 0.0256)
  body.add(screen)
  // right hand on the grip, left hand cradling the lens from below
  body.add(box(0.045, 0.085, 0.065, MAT.glove, 0.082, -0.018, 0.0, 0, 0, 0.15))
  body.add(box(0.06, 0.065, 0.24, MAT.sleeve, 0.1, -0.075, 0.14, 0.5, -0.15, 0))
  body.add(box(0.055, 0.035, 0.075, MAT.glove, -0.016, -0.05, -0.066, 0, 0, -0.1))
  body.add(box(0.06, 0.06, 0.24, MAT.sleeve, -0.04, -0.12, 0.04, 0.9, 0.25, 0))
  g.scale.setScalar(0.8)
  return { g, muzzle: new THREE.Vector3(0, 0, -0.1), hip: new THREE.Vector3(0.11, -0.15, -0.34), ads: new THREE.Vector3(0, -0.06, -0.2), canvas, tex }
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
    this.models = { pistol: pistol(), rifle: tranqRifle(), hunting: huntingRifle(), shotgun: shotgun(), scanner: scanner(), camera: fieldCamera() }
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
    this.camScreenState = ''
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

  // The camera's back screen: live subject and stars, or the last frame shot
  // (info.review is that shot's id, info.snap the canvas holding it).
  drawCameraScreen(info) {
    const key = info.review ? `review${info.review}` : `${info.line1}|${info.stars}|${info.zoom}`
    if (key === this.camScreenState) return
    this.camScreenState = key
    const m = this.models.camera
    const c = m.canvas.getContext('2d')
    const W = m.canvas.width
    const H = m.canvas.height
    c.fillStyle = '#0c0f12'
    c.fillRect(0, 0, W, H)
    if (info.review && info.snap) {
      c.drawImage(info.snap, 0, 0, W, H)
      c.fillStyle = 'rgba(0,0,0,0.55)'
      c.fillRect(0, H - 24, W, 24)
      c.fillStyle = '#ffd36a'
      c.font = 'bold 18px monospace'
      c.fillText(info.stars ? '★'.repeat(info.stars) + '☆'.repeat(3 - info.stars) : '—', 8, H - 6)
    } else {
      c.strokeStyle = 'rgba(255,255,255,0.18)'
      c.lineWidth = 1
      for (const t of [1 / 3, 2 / 3]) {
        c.beginPath()
        c.moveTo(W * t, 0)
        c.lineTo(W * t, H)
        c.moveTo(0, H * t)
        c.lineTo(W, H * t)
        c.stroke()
      }
      c.fillStyle = '#e8f0f4'
      c.font = 'bold 15px monospace'
      c.fillText(info.line1, 8, 22)
      c.fillStyle = '#ffd36a'
      c.font = 'bold 22px monospace'
      c.fillText(info.stars ? '★'.repeat(info.stars) + '☆'.repeat(3 - info.stars) : '', 8, 54)
      c.fillStyle = '#9fb4c0'
      c.font = '14px monospace'
      c.fillText(`${info.zoom}×`, W - 52, H - 10)
      c.fillStyle = '#ff4a3a'
      c.beginPath()
      c.arc(14, H - 15, 5, 0, Math.PI * 2)
      c.fill()
    }
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
