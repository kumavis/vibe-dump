import * as THREE from 'three'

// The island map: a shaded-relief canvas painted once from the heightfield,
// with roads, rivers and discovered places drawn live on top. The same base
// image becomes the pinned survey map inside Ranger Station Alpha.

export function paintRelief(island, size = 512) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const img = ctx.createImageData(size, size)
  const half = island.half
  const k = (half * 2) / size
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const wx = -half + (x + 0.5) * k
      const wz = -half + (y + 0.5) * k
      const h = island.heightAt(wx, wz)
      const depth = island.waterAt(wx, wz) - h
      let r
      let g
      let b
      if (depth > 0) {
        const t = Math.min(1, depth / 14)
        r = 70 - t * 50
        g = 150 - t * 90
        b = 160 - t * 60
      } else {
        const j = island.sample(island.w.jungle, wx, wz)
        const sw = island.sample(island.w.swamp, wx, wz)
        const be = island.sample(island.w.beach, wx, wz)
        const hi = island.sample(island.w.highland, wx, wz)
        const ro = island.sample(island.w.rock, wx, wz)
        r = 150 - j * 80 - sw * 60 + be * 70 + hi * 10 + ro * 20
        g = 160 - j * 50 - sw * 50 + be * 50 - hi * 10 + ro * 0
        b = 90 - j * 40 - sw * 30 + be * 60 + ro * 40
        // hillshade from the north-west
        const hx = island.heightAt(wx + k, wz) - island.heightAt(wx - k, wz)
        const hz = island.heightAt(wx, wz + k) - island.heightAt(wx, wz - k)
        const shade = Math.max(0.55, Math.min(1.35, 1 - (hx + hz) * 0.06))
        r *= shade
        g *= shade
        b *= shade
        // contour every 20 m
        if (Math.floor(h / 20) !== Math.floor(island.heightAt(wx + k, wz) / 20)) {
          r *= 0.82
          g *= 0.82
          b *= 0.82
        }
        if (island.sample(island.road, wx, wz) > 0.45) {
          r = 196
          g = 160
          b = 110
        }
      }
      const i = (y * size + x) * 4
      img.data[i] = r
      img.data[i + 1] = g
      img.data[i + 2] = b
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return c
}

export function reliefTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

const ICONS = { dock: '⚓', station: '⌂', lab: '⚗', tower: '♜', fence: '⚠', relay: '📡', base: '✪' }

// The baseline for a label `w` px wide centred on x at baseline y, stepped up
// a line (`h` px) at a time off any label already in `taken`: vehicles parked
// side by side (the camp's tank and humvee, 8 m apart, are 3 px on the map)
// read as two words, not one smudge.
function stackLabel(taken, x, y, w, h) {
  for (;;) {
    const hit = taken.find((b) => Math.abs(b.x - x) < (b.w + w) / 2 && Math.abs(b.y - y) < h)
    if (!hit) break
    y = hit.y - h // always above the one it hit, so this ends
  }
  taken.push({ x, y, w })
  return y
}

export class MapView {
  constructor(G, el) {
    this.G = G
    this.el = el
    this.canvas = el.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.base = G.reliefCanvas
    this.open = false
  }

  toggle(force) {
    this.open = force ?? !this.open
    this.el.classList.toggle('show', this.open)
    if (this.open) this.draw()
  }

  w2m(x, z) {
    const S = this.canvas.width
    const half = this.G.island.half
    return [((x + half) / (half * 2)) * S, ((z + half) / (half * 2)) * S]
  }

  draw() {
    const G = this.G
    const ctx = this.ctx
    const S = this.canvas.width
    ctx.drawImage(this.base, 0, 0, S, S)
    // discovered places
    ctx.font = '600 15px system-ui, sans-serif'
    ctx.textAlign = 'center'
    for (const p of G.island.pois) {
      if (!G.discovered.has(p.id) && !G.flags.get('mapRevealed')) continue
      const [x, y] = this.w2m(p.x, p.z)
      ctx.fillStyle = 'rgba(20,16,8,0.75)'
      ctx.beginPath()
      ctx.arc(x, y, 11, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f2e6c4'
      ctx.fillText(ICONS[p.icon] || '•', x, y + 5)
      ctx.fillStyle = 'rgba(20,16,8,0.8)'
      const tw = ctx.measureText(p.name).width
      ctx.fillRect(x - tw / 2 - 4, y + 13, tw + 8, 19)
      ctx.fillStyle = '#f2e6c4'
      ctx.fillText(p.name, x, y + 28)
    }
    // tagged animals, and the tyrant once the relay is up
    for (const h of G.ecology.herds) {
      for (const r of h.records) {
        const show = r.tagged || (r.species === 'tyrannosaurus' && G.flags.get('relayFixed'))
        if (!show || r.state === 'dead') continue
        const [x, y] = this.w2m(r.x, r.z)
        ctx.fillStyle = r.species === 'tyrannosaurus' ? '#ff4030' : '#ffd040'
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = '#000'
        ctx.stroke()
        if (r.species === 'tyrannosaurus') {
          ctx.fillStyle = '#ffb0a0'
          ctx.fillText('T-01 “Matron”', x, y - 9)
        }
      }
    }
    // objective markers
    for (const o of G.objectives.active()) {
      const m = G.objectives.marker(o)
      if (!m) continue
      const [x, y] = this.w2m(m.x, m.z)
      ctx.strokeStyle = '#ffe070'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x, y, 16 + Math.sin(performance.now() / 200) * 2, 0, Math.PI * 2)
      ctx.stroke()
    }
    // parked vehicles, so you can find your way back to them
    ctx.font = '700 10px system-ui, sans-serif'
    const labels = []
    for (const v of G.vehicles || []) {
      if (v.occupied) continue
      const [x, y] = this.w2m(v.pos.x, v.pos.z)
      ctx.fillStyle = v.destroyed ? '#ff7a50' : '#bfe8ff'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.fillRect(x - 5, y - 5, 10, 10)
      ctx.strokeRect(x - 5, y - 5, 10, 10)
      const label = v.tune.mapLabel || (v.kind === 'heli' ? 'HELI' : v.kind === 'motorbike' ? 'BIKE' : 'JEEP')
      ctx.fillText(label, x, stackLabel(labels, x, y - 9, ctx.measureText(label).width + 4, 11))
    }
    // the player (or the vehicle they are in)
    const pp = G.vehicle ? G.vehicle.pos : G.player.pos
    const yaw = G.vehicle ? G.vehicle.yaw : G.player.yaw
    const [px, py] = this.w2m(pp.x, pp.z)
    ctx.save()
    ctx.translate(px, py)
    ctx.rotate(-yaw)
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, -12)
    ctx.lineTo(7, 8)
    ctx.lineTo(0, 4)
    ctx.lineTo(-7, 8)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
    // wind
    const w = G.wind
    ctx.save()
    ctx.translate(S - 50, 50)
    ctx.fillStyle = 'rgba(20,16,8,0.7)'
    ctx.beginPath()
    ctx.arc(0, 0, 32, 0, Math.PI * 2)
    ctx.fill()
    ctx.rotate(Math.atan2(w.z, w.x) + Math.PI / 2)
    ctx.strokeStyle = '#bfe8ff'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 18)
    ctx.lineTo(0, -18)
    ctx.lineTo(-7, -9)
    ctx.moveTo(0, -18)
    ctx.lineTo(7, -9)
    ctx.stroke()
    ctx.restore()
    ctx.fillStyle = '#bfe8ff'
    ctx.font = '600 11px system-ui'
    ctx.fillText('WIND', S - 50, 98)
  }
}
