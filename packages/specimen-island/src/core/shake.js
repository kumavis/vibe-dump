import { SHAKE } from '../data/shake.js'

// The one camera shake. It listens for what hurts — the player taking a hit,
// the vehicle they are in taking one — and whichever camera ran this frame
// (the player's eye, a vehicle's seat or chase camera) calls apply() once.

export class CameraShake {
  constructor(events, tune = SHAKE) {
    this.tune = tune
    this.amount = 0
    events.on('player:damaged', ({ amount }) => this.add(amount * tune.perHp.player))
    events.on('vehicle:damaged', ({ vehicle, amount }) => {
      if (vehicle.occupied) this.add(amount * tune.perHp.vehicle)
    })
  }

  add(amount) {
    this.amount = Math.min(this.tune.max, this.amount + amount)
  }

  // Decay, then jitter `cam` for this view. Call after the camera is placed
  // and before its matrices are updated.
  apply(cam, view, dt) {
    this.amount = Math.max(0, this.amount - dt * this.tune.decay)
    const s = this.amount
    if (s <= 0.001) return
    const v = this.tune.views[view]
    const r = () => Math.random() - 0.5
    cam.position.x += r() * v.move * s
    cam.position.y += r() * v.move * s
    cam.position.z += r() * v.move * s
    if (v.turn) {
      cam.rotateX(r() * v.turn * s)
      cam.rotateY(r() * v.turn * s)
    }
    if (v.roll) cam.rotateZ(r() * v.roll * s)
  }
}
