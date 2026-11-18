// A finger may be below the card it is carrying. Prefer the pointed-at
// legal pile, then allow a near miss or meaningful overlap of the lead card.
// Callers supply only legal destinations; an invalid pile never wins a drop.
export function chooseDropTarget(pointer, card, targets) {
  const distance = r => Math.hypot(Math.max(r.left - pointer.x, 0, pointer.x - r.right), Math.max(r.top - pointer.y, 0, pointer.y - r.bottom))
  let best = null, bestScore = -Infinity
  for (const target of targets) {
    const r = target.rect, slot = target.slot || r
    const near = distance(r)
    const width = Math.max(0, Math.min(card.right, slot.right) - Math.max(card.left, slot.left))
    const height = Math.max(0, Math.min(card.bottom, slot.bottom) - Math.max(card.top, slot.top))
    const overlap = width * height / Math.max(1, Math.min(card.width * card.height, slot.width * slot.height))
    if (near > 24 && overlap < .23) continue
    const centerDistance = Math.hypot((card.left + card.right - slot.left - slot.right) / 2, (card.top + card.bottom - slot.top - slot.bottom) / 2)
    const score = (near === 0 ? 1000 : near <= 24 ? 500 - near * 5 : 0) + overlap * 100 - centerDistance * .05
    if (score > bestScore) { best = target; bestScore = score }
  }
  return best
}
