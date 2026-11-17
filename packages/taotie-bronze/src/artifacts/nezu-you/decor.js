// Nezu you 饕餮文卣 (90086) — the décor panels (the ridge pass: every surface redrawn in fat, rounded, banded relief).
//
// How it was drawn: photo-31 (head-on at the pivot face) developed onto each register of THIS form
// (.work/ridge-nezu-you/develop.py, develop_strap.py: x = developed mm from the face's centre line, y = arc mm above
// the register's lower edge), both halves averaged after a centring shift, and photo-32 for the parts photo-31 sees
// obliquely. Each register is its own module:
//   belly.js    the two-eyed taotie — banded high plates (horn G with its deep slot, eye disc, cheek / jaw / body bands,
//               outer C-block, the side kui under the end flange) over a ground of raised square spirals
//   friezes.js  neck, lid skirt and foot — rows of the bronze's compact kui (squared head with eye, crest rolled up,
//               body rolling into a G tail, quills, hooked jaw), confronted about the face's axis
//   strap.js    the bail — two sinuous dragons along the strip, a mask between them, real coiled tails
//   lid.js      the lid slope — fat hook bands rolling into coils, a ring-eyed boss
// The earlier tracings (reference/nezu-you/trace/*.json) are kept as a record; nothing imports them now.

import { drawBelly } from './belly.js'
import { drawFrieze, NECK_FRIEZE, SKIRT_FRIEZE, FOOT_FRIEZE } from './friezes.js'
import { drawStrap } from './strap.js'
import { drawLid } from './lid.js'

const panelOf = (kit, size, ppmm, seed) => new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })

export function bellyPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawBelly(kit, p, size, { seed })
  return p.bake()
}
export function neckPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawFrieze(kit, p, size, NECK_FRIEZE, { seed })
  return p.bake()
}
export function skirtPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawFrieze(kit, p, size, SKIRT_FRIEZE, { seed })
  return p.bake()
}
export function footPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawFrieze(kit, p, size, FOOT_FRIEZE, { seed })
  return p.bake()
}
export function lidPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawLid(kit, p, { seed, y1: Math.min(size.height, 76) })
  return p.bake()
}
export function strapPanel(kit, size, { ppmm, seed }) {
  const p = panelOf(kit, size, ppmm, seed)
  drawStrap(kit, p, { seed })
  return p.bake()
}
