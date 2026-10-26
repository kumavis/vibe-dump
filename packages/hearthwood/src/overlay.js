// UI overlay state shared between input.js (writer) and render.js (reader).
// ARCHITECT-OWNED, fully implemented. Plain mutable object, allocated once.
// Coordinates are WORLD TILE UNITS unless noted. Nothing here is simulation state.

import { MAX_UNITS } from './constants.js'

/**
 * @typedef {Object} Overlay
 * @property {Int32Array} sel          selected unit ids (first selCount entries valid)
 * @property {Uint16Array} selGen      generation of each selected unit at selection time
 * @property {number} selCount
 * @property {number} selBuilding      selected building id or -1
 * @property {number} selBuildingGen
 * @property {number} hoverBuilding    building under cursor or -1
 * @property {number} hoverUnit        unit under cursor or -1
 * @property {number} ghostType        building type being placed, 0 = no ghost
 * @property {number} ghostTx          ghost footprint top-left tile
 * @property {number} ghostTy
 * @property {number} ghostReason      P_* from canPlace (P_OK -> green, else red)
 * @property {boolean} dragActive      selection box visible
 * @property {number} dragX0           drag box corners in world tile units
 * @property {number} dragY0
 * @property {number} dragX1
 * @property {number} dragY1
 * @property {number} attackMoveArmed  1 while the player pressed A and has not clicked yet
 * @property {number} cursorX          cursor in world tile units
 * @property {number} cursorY
 * @property {number} pingX            last right-click order target (world), drawn as a fading marker
 * @property {number} pingY
 * @property {number} pingTick         ctx.tick of the ping (-1 none)
 * @property {number} pingKind         0 move, 1 attack-move
 * @property {boolean} showGrid        debug: draw chunk grid
 * @property {boolean} showPaths       debug: draw selected units' paths
 */

/** @returns {Overlay} */
export function createOverlay(maxSel = MAX_UNITS) {
  return {
    sel: new Int32Array(maxSel),
    selGen: new Uint16Array(maxSel),
    selCount: 0,
    selBuilding: -1,
    selBuildingGen: 0,
    hoverBuilding: -1,
    hoverUnit: -1,
    ghostType: 0,
    ghostTx: 0,
    ghostTy: 0,
    ghostReason: 0,
    dragActive: false,
    dragX0: 0, dragY0: 0, dragX1: 0, dragY1: 0,
    attackMoveArmed: 0,
    cursorX: 0, cursorY: 0,
    pingX: 0, pingY: 0, pingTick: -1, pingKind: 0,
    showGrid: false,
    showPaths: false,
  }
}
