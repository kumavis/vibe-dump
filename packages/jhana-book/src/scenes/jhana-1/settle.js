// settle.js — keeping printed (flat) layers honest while a page turns.
//
// The moving leaf is a wedge with no thickness at the spine, so a layer held
// h above its page pokes through the leaf within h / θ of the spine while the
// spread is nearly shut, and paper lying right on the hinge line flickers
// through the closing spread's gutter. So printed layers:
//   • settle onto the paper as the spread closes and lift to their full offset
//     (which keeps them from z-fighting the page) by the time it is half open —
//     late and θ²-soft, so the strip that could show stays far below a pixel;
//   • slide a few millimetres away from the spine while nearly shut, back to
//     meet it (and each other, across the gutter) once open;
//   • hide below 5 % open, where the leaf covers them anyway.
// All of it happens under the leaf: flat paper moving flat is never seen.

export function settle(openness) {
  const u = Math.min(1, Math.max(0, (openness - 0.1) / 0.4))
  return u * u * (3 - 2 * u)
}

const SHIFT = 0.004
const SHUT = 0.05

// A holder on a page frame for one printed layer, `lift` above the paper.
export function printedLayer(paper, page, lift) {
  const holder = paper.place(page, { y: lift })
  holder.userData.lift = lift
  return holder
}

// Pose every printed layer for this openness (no allocation).
export function seat(holders, openness) {
  const k = settle(openness)
  const shift = SHIFT * (1 - k)
  const shown = openness > SHUT
  for (let i = 0; i < holders.length; i++) {
    const h = holders[i]
    h.position.x = h.userData.dir * shift
    h.position.y = h.userData.lift * k
    h.visible = shown
  }
}

// leak — the light that spills from under a page as it starts to lift, 0..1:
// rises over the first fifth of the opening and hands over to frame.reveal
// (which brings the full scene in) by the time the spread is half open.
// Zero when closed, so nothing glows from a shut book.
export function leak(openness) {
  const a = Math.min(1, Math.max(0, (openness - 0.03) / 0.15))
  const b = Math.min(1, Math.max(0, (openness - 0.18) / 0.3))
  return a * a * (3 - 2 * a) * (1 - b * b * (3 - 2 * b))
}
