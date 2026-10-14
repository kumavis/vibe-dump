// PLACEHOLDER — replaced by the ship-art work. Every hull draws as the Striker.
import { drawShip } from './art.js'

export function drawShipModel(ctx, x, y, model, paint, opts = {}) {
  drawShip(ctx, x, y, paint, opts)
}

export function drawDrone(ctx, x, y, paint, t) {
  ctx.fillStyle = paint.main
  ctx.beginPath()
  ctx.arc(x, y, 7, 0, Math.PI * 2)
  ctx.fill()
}
