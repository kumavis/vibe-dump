// The world's events as the box's effects pool draws them (TOY.md §2 "Loud
// feedback"): sparks and a flash on a hit, a fireball and a smoke trail on a
// shoot-down, splashes, flak, explosions along a sinking ship, and the
// camera's shake. The particles go straight into EffectsRenderer's two
// families (alpha and additive), in its shader's kinds.

// (the effects shader's particle kinds: src/battle/scene/effects.js draws each its own way)
const K = { smoke: 0, fire: 1, splash: 2, flash: 3, fireball: 4, flak: 5, foam: 7, spark: 8, steam: 9 }

export class ToyFx {
  constructor(scene) {
    this.scene = scene
    this.seed = 1
  }

  r() {
    this.seed = (this.seed * 16807) % 2147483647
    return this.seed / 2147483647
  }

  /** One event (world frame); t: the world's clock the particles are born on. */
  event(e, world) {
    const fx = this.scene.effects
    if (!fx) return
    const c = world.centre
    const t = world.t
    const r = () => this.r()
    const X = (e.x ?? 0) + c.x
    const Z = (e.z ?? 0) + c.z
    const Y = e.y ?? 0
    const A = fx.alpha
    const D = fx.add
    const cam = this.scene.chase
    switch (e.type) {
      case 'hit': {
        const big = e.weapon !== 'bullet'
        for (let k = 0; k < (big ? 10 : 4); k++) D.add({ x: X, y: Y, z: Z, vx: (r() - 0.5) * 40, vy: 8 + r() * 25, vz: (r() - 0.5) * 40, born: t, life: 0.5 + r() * 0.4, s0: big ? 5 : 2.6, s1: 0.8, kind: K.spark, r: 1, g: 0.75, b: 0.35, rise: -12 })
        D.add({ x: X, y: Y, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 0.18, s0: big ? 26 : 7, s1: big ? 40 : 11, kind: K.flash })
        if (big) this.boom(world, X, Y, Z, 0.7)
        return
      }
      case 'shotdown':
      case 'lost': {
        D.add({ x: X, y: Y, z: Z, vx: 0, vy: 2, vz: 0, born: t, life: 1.6, s0: 14, s1: 30, kind: K.fireball, seed: r() })
        for (let k = 0; k < 8; k++) D.add({ x: X, y: Y, z: Z, vx: (r() - 0.5) * 50, vy: (r() - 0.3) * 40, vz: (r() - 0.5) * 50, born: t, life: 0.8 + r() * 0.6, s0: 3, s1: 1, kind: K.spark, r: 1, g: 0.6, b: 0.25, rise: -14 })
        A.add({ x: X, y: Y, z: Z, vx: 0, vy: 1, vz: 0, born: t + 0.2, life: 10, s0: 10, s1: 34, kind: K.smoke, r: 0.12, g: 0.11, b: 0.1, a: 0.8, seed: r() })
        fx.trails.set(e.slot, { next: t, until: t + 30, dark: 0.18 })
        fx.lights.push({ x: X, y: Y + 10, z: Z, r: 300, col: [6, 3, 1], until: t + 0.5 })
        cam.shake(e.type === 'lost' ? 0.9 : 0.3)
        return
      }
      case 'splash':
        A.add({ x: X, y: 0, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 2.2, s0: e.big ? 9 : 6, s1: e.big ? 14 : 9, kind: K.splash, r: 0.95, g: 0.97, b: 1, a: 0.9, seed: r() })
        A.add({ x: X, y: 0, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 12, s0: 6, s1: 18, kind: K.foam, a: 0.7, seed: r() })
        return
      case 'spray':
        A.add({ x: X, y: 0, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 0.9, s0: 1.2, s1: 1.8, kind: K.splash, r: 0.95, g: 0.97, b: 1, a: 0.7, seed: r() })
        return
      case 'bounce':
        if (e.who === 'player') {
          A.add({ x: X, y: 0, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 1.6, s0: 6, s1: 10, kind: K.splash, r: 0.95, g: 0.97, b: 1, a: 0.85, seed: r() })
          cam.shake(0.35)
        }
        return
      case 'hurt':
        cam.shake(0.22)
        D.add({ x: X, y: Y, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 0.15, s0: 4, s1: 6, kind: K.flash })
        return
      case 'flak':
        A.add({ x: X, y: Y, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 3 + r() * 2, s0: 9, s1: 26, kind: K.flak, seed: r() })
        D.add({ x: X, y: Y, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 0.25, s0: 14, s1: 22, kind: K.flash })
        fx.lights.push({ x: X, y: Y, z: Z, r: 200, col: [3, 1.6, 0.6], until: t + 0.15 })
        if (e.near) cam.shake(0.3)
        return
      case 'muzzle':
        D.add({ x: X, y: Y, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 0.2, s0: e.size || 10, s1: (e.size || 10) * 1.5, kind: K.flash })
        A.add({ x: X, y: Y, z: Z, vx: 0, vy: 2, vz: 0, born: t, life: 5, s0: (e.size || 10) * 0.6, s1: (e.size || 10) * 2.4, kind: K.smoke, r: 0.6, g: 0.6, b: 0.6, a: 0.5, seed: r() })
        return
      case 'boom':
        this.boom(world, X, Y, Z, e.size ?? 1)
        cam.shake(0.25)
        return
      case 'shell-splash':
        A.add({ x: X, y: 0, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 3.5, s0: 14, s1: 20, kind: K.splash, r: 0.95, g: 0.97, b: 1, a: 0.9, seed: r() })
        A.add({ x: X, y: 0, z: Z, vx: 0, vy: 0, vz: 0, born: t, life: 15, s0: 10, s1: 28, kind: K.foam, a: 0.7, seed: r() })
        return
      case 'struck':
        this.boom(world, X, Y, Z, e.weapon === 'shell' ? 1 : 0.6)
        return
      case 'sunk':
      case 'carrier-lost': {
        const th = e.th
        const m = th?.model || { L: 120, B: 14 }
        for (let k = 0; k < 6; k++) {
          const u = (r() - 0.5) * m.L * 0.8
          this.boom(world, X + Math.sin(th?.yaw || 0) * u, 6 + r() * 10, Z - Math.cos(th?.yaw || 0) * u, 1.3, t + k * 0.12)
        }
        for (let k = 0; k < 5; k++) A.add({ x: X + (r() - 0.5) * m.L * 0.5, y: 2, z: Z + (r() - 0.5) * m.L * 0.5, vx: 0, vy: 1.5, vz: 0, born: t + k * 0.5, life: 14, s0: 20, s1: 60, kind: K.steam, seed: r() })
        cam.shake(0.8)
        return
      }
      case 'point-out':
        this.boom(world, X, Y, Z, 1.4)
        cam.shake(0.45)
        return
      case 'magazine': {
        for (let k = 0; k < 4; k++) D.add({ x: X + (r() - 0.5) * 30, y: 20 + k * 25, z: Z + (r() - 0.5) * 30, vx: 0, vy: 10, vz: 0, born: t + k * 0.08, life: 3, s0: 50 + k * 10, s1: 110, kind: K.fireball, seed: r() })
        for (let k = 0; k < 6; k++) A.add({ x: X + (r() - 0.5) * 40, y: 60 + k * 20, z: Z + (r() - 0.5) * 40, vx: 0, vy: 6, vz: 0, born: t + 0.3, life: 25, s0: 50, s1: 140, kind: K.smoke, r: 0.1, g: 0.09, b: 0.08, a: 0.85, seed: r() })
        fx.lights.push({ x: X, y: 80, z: Z, r: 1200, col: [12, 6, 2], until: t + 1.5 })
        cam.shake(1.2)
        return
      }
      default:
    }
  }

  boom(world, X, Y, Z, size = 1, born = world.t) {
    const fx = this.scene.effects
    const r = () => this.r()
    const s = 10 + size * 16
    fx.add.add({ x: X, y: Y + s * 0.3, z: Z, vx: 0, vy: 3, vz: 0, born, life: 1.8, s0: s, s1: s * 2, kind: K.fireball, seed: r() })
    fx.alpha.add({ x: X, y: Y + s * 0.5, z: Z, vx: 0, vy: 4, vz: 0, born: born + 0.3, life: 14, s0: s * 0.8, s1: s * 3, kind: K.smoke, r: 0.12, g: 0.11, b: 0.1, a: 0.75, drag: 0.1, seed: r() })
    fx.lights.push({ x: X, y: Y + s, z: Z, r: 400 * size, col: [8, 4, 1.5], until: born + 0.6 })
  }
}
