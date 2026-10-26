// DOM HUD: stock, couriers, build menu, selection panel, wave, tier, hints, speed, toasts.
// OWNER: app implementer. Contract: ARCHITECTURE.md §17.1.
// No DOM access at import time.

/** @typedef {import('./game.js').Game} Game */
/** @typedef {import('./input.js').Input} Input */
/** @typedef {import('./overlay.js').Overlay} Overlay */

/**
 * @typedef {Object} UI
 * @property {() => void} update   per frame; rewrites only changed DOM (diff cached strings), heavy panels ~5 Hz
 * @property {(msg:string, kind?:'good'|'bad'|'info') => void} toast
 */

/**
 * Wire the HUD containers from index.html (#stock, #couriers, #tier, #wave, #speed, #hints,
 * #toasts, #selpanel, #buildmenu, #minimap clicks are handled in main.js/input.js).
 * @param {Document} doc
 * @param {Game} game
 * @param {Input} input
 * @param {Overlay} overlay
 * @returns {UI}
 */
export function createUI(doc, game, input, overlay) {
  throw new Error('hearthwood: createUI not implemented')
}
