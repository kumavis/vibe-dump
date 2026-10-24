import * as THREE from 'three'

// Shells in flight: anything a gun throws that goes off where it lands (the
// tank's main gun). Each flies a ballistic arc — gravity, no drag — with a
// hot tracer and a thread of smoke, tests the stretch it covers each frame
// against animals, moving vehicles, everything solid, the ground and the
// water, and goes off through game/blast.js where it stops. So an animal it
// kills is the player's kill, and the gun that fired it (`exclude`) never
// takes its own blast, however close the wall it was fired into.

const _o = new THREE.Vector3()
const _d = new THREE.Vector3()
const _p = new THREE.Vector3()
const _c = new THREE.Vector3()

export class Shells {
  constructor(G) {
    this.G = G
    this.live = []
    this.geo = new THREE.CylinderGeometry(0.07, 0.05, 2.2, 6).rotateX(Math.PI / 2)
    this.mat = new THREE.MeshBasicMaterial({ color: 0xffd38a, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })
  }

  // { from, vel, gravity, life, blast (a BLASTS kind), weapon, exclude }
  fire(o) {
    const mesh = new THREE.Mesh(this.geo, this.mat)
    mesh.position.copy(o.from)
    this.G.scene.add(mesh)
    this.live.push({ blast: o.blast, weapon: o.weapon, exclude: o.exclude || null, gravity: o.gravity ?? 9.8, life: o.life ?? 8, pos: o.from.clone(), vel: o.vel.clone(), mesh })
  }

  update(dt) {
    const G = this.G
    for (let i = this.live.length - 1; i >= 0; i--) {
      const s = this.live[i]
      s.life -= dt
      s.vel.y -= s.gravity * dt
      _o.copy(s.pos)
      _d.copy(s.vel).multiplyScalar(dt)
      const len = _d.length()
      _d.divideScalar(len || 1)
      const t = this.trace(s, _o, _d, len)
      if (t !== null) {
        // just short of whatever it struck, so the fireball sits on its face
        this.burst(s, _p.copy(_o).addScaledVector(_d, Math.max(0, t - 0.25)))
        this.live.splice(i, 1)
        continue
      }
      s.pos.addScaledVector(s.vel, dt)
      s.mesh.position.copy(s.pos)
      s.mesh.lookAt(_p.copy(s.pos).add(s.vel))
      // a thin grey thread behind it, a puff every few metres
      const fx = G.fx?.normal
      if (fx) for (let k = 0; k < 2; k++) {
        _p.copy(_o).addScaledVector(_d, (len * k) / 2)
        fx.emit(_p.x, _p.y, _p.z, (Math.random() - 0.5) * 0.3, 0.2, (Math.random() - 0.5) * 0.3, 0.9, 0.16, 0.72, 0.7, 0.66, -0.2, 0.9)
      }
      if (s.life <= 0) {
        this.G.scene.remove(s.mesh)
        this.live.splice(i, 1)
      }
    }
  }

  // Distance along this frame's stretch to the first thing it meets, or null.
  trace(s, o, d, len) {
    const G = this.G
    let best = null
    const near = (t) => {
      if (t !== null && t !== undefined && t >= 0 && t <= len && (best === null || t < best)) best = t
    }
    near(G.ecology.raycast(o, d, len)?.t ?? null)
    near(G.physics.raycast(o.x, o.y, o.z, d.x, d.y, d.z, len)?.t ?? null)
    // moving vehicles have no colliders (parked ones are boxes above): a
    // sphere round each body
    for (const v of G.vehicles || []) {
      if (v === s.exclude || v.parked) continue
      _c.copy(v.pos)
      _c.y += 1
      const r = Math.max(1.2, v.tune.halfWidth || 0)
      const lx = _c.x - o.x
      const ly = _c.y - o.y
      const lz = _c.z - o.z
      const tc = lx * d.x + ly * d.y + lz * d.z
      const dd = lx * lx + ly * ly + lz * lz - tc * tc
      if (dd < r * r) near(tc - Math.sqrt(r * r - dd))
    }
    // the sea, a river or the lake: where the stretch drops under the surface
    const w0 = G.island.waterAt(o.x, o.z)
    const endY = o.y + d.y * len
    if (o.y >= w0 && endY < G.island.waterAt(o.x + d.x * len, o.z + d.z * len) && d.y < 0) near((o.y - w0) / -d.y)
    return best
  }

  burst(s, at) {
    this.G.scene.remove(s.mesh)
    this.G.blast(at, s.blast, { weapon: s.weapon, exclude: s.exclude, source: 'player' })
  }
}
