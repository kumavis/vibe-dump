// Input: mouse/keyboard -> camera moves, overlay updates and sim commands.
// OWNER: app implementer. Contract: ARCHITECTURE.md §17.2.
// No DOM access at import time: every DOM touch happens inside createInput's closures,
// and the event targets can be injected (hooks.keyTarget) so Node tests can drive it.

import {
  EDGE_PAN_PX, PAN_SPEED, P_OK, PLACE_REASONS, F_PLAYER, F_BLIGHT, U_COURIER, BF_HALL, BF_PRODUCER,
  BF_DEN, BF_CORE, O_MOVE, O_ATTACK_MOVE, TK_UNIT, MAX_UNITS,
} from './constants.js'
import { BUILDINGS, HOTKEYS, B_W, B_H, B_FLAGS } from './content.js'
import { canPlace, placeBuilding, demolishBuilding, buildingAtTile, setPaused } from './buildings.js'
import { unitsInRect, unitAt } from './units.js'
import { commandGroup, commandAttack, commandHold, commandStop } from './combat.js'

/** @typedef {import('./game.js').Game} Game */
/** @typedef {import('./camera.js').Camera} Camera */
/** @typedef {import('./overlay.js').Overlay} Overlay */

/**
 * @typedef {Object} Input
 * @property {(dtSec:number) => void} update  per-frame: keyboard/edge pan, ghost validity refresh
 * @property {(type:number) => void} beginPlace  enter placement mode for a building type (0 cancels)
 * @property {() => void} cancel   Esc semantics: placement -> attack-move arm -> selection
 * @property {() => void} dispose  remove listeners
 * @property {number[][]} groups   control groups 1..9: arrays of [id, gen, id, gen, ...]
 */

const DRAG_PX = 5
const DOUBLE_MS = 350
const GHOST_REFRESH_FRAMES = 10
const WHEEL_STEP = 1.15
const SPEED_STEPS = [1, 2, 4]

/** Footprint top-left for a building of `type` centred on the cursor (world tile units). */
export function ghostOrigin(type, cx, cy, out) {
  out.x = Math.floor(cx - B_W[type] * 0.5 + 0.5)
  out.y = Math.floor(cy - B_H[type] * 0.5 + 0.5)
  return out
}

/** Next speed from `cur` going up (dir > 0) or down (dir < 0) through 1/2/4. */
export function nextSpeed(cur, dir) {
  let i = SPEED_STEPS.indexOf(cur)
  if (i < 0) i = 0
  i += dir > 0 ? 1 : -1
  if (i < 0) i = 0
  if (i >= SPEED_STEPS.length) i = SPEED_STEPS.length - 1
  return SPEED_STEPS[i]
}

/** Building type bound to a KeyboardEvent.code with no modifier (Digit0..9, letters), or 0. */
export function hotkeyType(code) {
  let k = ''
  if (code.length === 6 && code.startsWith('Digit')) k = code[5]
  else if (code.length === 7 && code.startsWith('Numpad') && code[6] >= '0' && code[6] <= '9') k = code[6]
  else if (code.length === 4 && code.startsWith('Key')) k = code[3].toLowerCase()
  const t = k ? HOTKEYS[k] : undefined
  return t || 0
}

/**
 * Attach listeners to `canvas` (pointer/wheel/contextmenu) and `window` (keys).
 * @param {HTMLCanvasElement} canvas
 * @param {Game} game
 * @param {Camera} camera
 * @param {Overlay} overlay
 * @param {{onSelect?:() => void, onToast?:(msg:string, kind?:string) => void, keyTarget?:any, now?:() => number}} [hooks]
 * @returns {Input}
 */
export function createInput(canvas, game, camera, overlay, hooks = {}) {
  const keyTarget = hooks.keyTarget || (typeof window !== 'undefined' ? window : null)
  const clock = hooks.now || (typeof performance !== 'undefined' ? () => performance.now() : () => Date.now())

  const selCap = overlay.sel.length
  const scratch = new Int32Array(Math.max(selCap, MAX_UNITS))
  const cmdBuf = new Int32Array(selCap)
  let mark = new Uint8Array(0)
  const pt = { x: 0, y: 0 }
  const gpt = { x: 0, y: 0 }

  /** held keys by code */
  const keys = new Set()
  // pointer state (CSS px relative to the canvas)
  let mx = -1, my = -1, mouseIn = false
  let leftDown = false, dragging = false, sx0 = 0, sy0 = 0, wx0 = 0, wy0 = 0, shiftAtDown = false
  let midDown = false, lastMx = 0, lastMy = 0
  let frame = 0
  let lastGhostTx = -9999, lastGhostTy = -9999, lastGhostType = 0
  let lastClickT = -1e9, lastClickType = -1
  let lastRecallT = -1e9, lastRecallGroup = -1
  let lastCursor = ''
  let ctxSeen = game.ctx
  /** @type {number[][]} */
  const groups = []
  for (let i = 0; i < 10; i++) groups.push([])

  const toast = (msg, kind = 'info') => { if (hooks.onToast) hooks.onToast(msg, kind) }
  const selected = () => { if (hooks.onSelect) hooks.onSelect() }

  // ---------------------------------------------------------------- coordinates
  function local(e) {
    let left = 0, top = 0
    if (canvas.getBoundingClientRect) { const r = canvas.getBoundingClientRect(); left = r.left; top = r.top }
    mx = e.clientX - left
    my = e.clientY - top
  }
  function cursorWorld() {
    camera.screenToWorld(mx, my, pt)
    overlay.cursorX = pt.x
    overlay.cursorY = pt.y
    return pt
  }

  // ---------------------------------------------------------------- selection
  function clearSelection() {
    overlay.selCount = 0
    overlay.selBuilding = -1
  }
  function selectBuilding(b) {
    overlay.selCount = 0
    const B = game.ctx.buildings
    if (b >= 0 && B.alive[b]) { overlay.selBuilding = b; overlay.selBuildingGen = B.gen[b] }
    else overlay.selBuilding = -1
    selected()
  }
  /** Replace (or extend, when additive) the unit selection with ids[0..n). */
  function selectUnits(ids, n, additive) {
    const U = game.ctx.units
    overlay.selBuilding = -1
    if (!additive) overlay.selCount = 0
    if (mark.length < U.capacity) mark = new Uint8Array(U.capacity)
    let c = overlay.selCount
    for (let k = 0; k < c; k++) mark[overlay.sel[k]] = 1
    for (let k = 0; k < n && c < selCap; k++) {
      const id = ids[k]
      if (mark[id]) continue
      mark[id] = 1
      overlay.sel[c] = id
      overlay.selGen[c] = U.gen[id]
      c++
    }
    for (let k = 0; k < c; k++) mark[overlay.sel[k]] = 0
    overlay.selCount = c
    selected()
  }
  /** Drop dead / recycled ids from the selection (and a dead selected building). */
  function pruneSelection() {
    const ctx = game.ctx
    const U = ctx.units
    let c = 0
    const n = overlay.selCount
    for (let k = 0; k < n; k++) {
      const id = overlay.sel[k], g = overlay.selGen[k]
      if (U.alive[id] && U.gen[id] === g) { overlay.sel[c] = id; overlay.selGen[c] = g; c++ }
    }
    let changed = c !== n
    overlay.selCount = c
    const b = overlay.selBuilding
    if (b >= 0 && !(ctx.buildings.alive[b] && ctx.buildings.gen[b] === overlay.selBuildingGen)) {
      overlay.selBuilding = -1
      changed = true
    }
    if (changed) selected()
  }
  /** Selected player soldiers into cmdBuf. @returns {number} count */
  function soldiers() {
    const U = game.ctx.units
    let n = 0
    for (let k = 0; k < overlay.selCount; k++) {
      const id = overlay.sel[k]
      if (U.alive[id] && U.gen[id] === overlay.selGen[k] && U.faction[id] === F_PLAYER && U.type[id] !== U_COURIER) cmdBuf[n++] = id
    }
    return n
  }

  // ---------------------------------------------------------------- placement
  function beginPlace(type) {
    if (!(type > 0) || !BUILDINGS[type] || !BUILDINGS[type].buildable) {
      overlay.ghostType = 0
      lastGhostType = 0
      return
    }
    if (overlay.ghostType === type) { overlay.ghostType = 0; lastGhostType = 0; return } // toggle
    overlay.attackMoveArmed = 0
    overlay.ghostType = type
    lastGhostType = 0 // force a canPlace refresh
    refreshGhost(true)
  }
  function refreshGhost(force) {
    const type = overlay.ghostType
    if (!type) return
    const w = cursorWorld()
    ghostOrigin(type, w.x, w.y, gpt)
    if (force || gpt.x !== lastGhostTx || gpt.y !== lastGhostTy || type !== lastGhostType || frame % GHOST_REFRESH_FRAMES === 0) {
      overlay.ghostTx = gpt.x
      overlay.ghostTy = gpt.y
      overlay.ghostReason = canPlace(game.ctx, type, gpt.x, gpt.y)
      lastGhostTx = gpt.x; lastGhostTy = gpt.y; lastGhostType = type
    }
  }
  function tryPlace(keep) {
    const type = overlay.ghostType
    refreshGhost(true)
    const ctx = game.ctx
    const r = canPlace(ctx, type, overlay.ghostTx, overlay.ghostTy)
    if (r !== P_OK) {
      toast(BUILDINGS[type].name + ': ' + PLACE_REASONS[r], 'bad')
      return false
    }
    const id = placeBuilding(ctx, type, overlay.ghostTx, overlay.ghostTy)
    if (id < 0) { toast(BUILDINGS[type].name + ': cannot place', 'bad'); return false }
    if (!keep) { overlay.ghostType = 0; lastGhostType = 0 }
    else refreshGhost(true)
    return true
  }

  // ---------------------------------------------------------------- orders
  function ping(x, y, kind) {
    overlay.pingX = x; overlay.pingY = y; overlay.pingKind = kind; overlay.pingTick = game.ctx.tick
  }
  function rightClick() {
    const ctx = game.ctx
    const w = cursorWorld()
    const n = soldiers()
    if (n > 0) {
      const enemy = unitAt(ctx, w.x, w.y, 0.7, F_BLIGHT)
      if (enemy >= 0) {
        for (let k = 0; k < n; k++) commandAttack(ctx, cmdBuf[k], TK_UNIT, enemy)
        ping(ctx.units.x[enemy], ctx.units.y[enemy], 1)
      } else {
        commandGroup(ctx, cmdBuf, n, Math.floor(w.x), Math.floor(w.y), O_MOVE)
        ping(w.x, w.y, 0)
      }
      return
    }
    const b = overlay.selBuilding
    if (b >= 0 && ctx.buildings.alive[b] && (B_FLAGS[ctx.buildings.type[b]] & BF_HALL)) {
      const world = ctx.world
      const t = world.nearestWalkable(Math.floor(w.x), Math.floor(w.y), 6)
      if (t >= 0) {
        ctx.buildings.rally[b] = t
        ping((t & world.mask) + 0.5, (t >> world.shift) + 0.5, 0)
        toast('Rally point set', 'info')
      }
    }
  }
  function attackMoveClick() {
    const ctx = game.ctx
    const w = cursorWorld()
    const n = soldiers()
    if (n > 0) {
      commandGroup(ctx, cmdBuf, n, Math.floor(w.x), Math.floor(w.y), O_ATTACK_MOVE)
      ping(w.x, w.y, 1)
    }
  }
  function clickSelect(additive) {
    const ctx = game.ctx
    const w = cursorWorld()
    const U = ctx.units
    // soldiers first (small radius), then anything incl. couriers / Blight for inspection
    let u = unitAt(ctx, w.x, w.y, 0.6, F_PLAYER)
    if (u >= 0 && U.type[u] === U_COURIER) {
      const any = unitAt(ctx, w.x, w.y, 0.6, F_BLIGHT)
      if (any >= 0) u = any
    } else if (u < 0) u = unitAt(ctx, w.x, w.y, 0.6, -1)
    if (u >= 0) {
      const t = clock()
      if (t - lastClickT < DOUBLE_MS && lastClickType === U.type[u] && U.faction[u] === F_PLAYER) {
        // double click: every unit of that type on screen
        const hw = camera.viewW * 0.5 / camera.scale, hh = camera.viewH * 0.5 / camera.scale
        const n = unitsInRect(ctx, camera.x - hw, camera.y - hh, camera.x + hw, camera.y + hh, F_PLAYER,
          U.type[u] === U_COURIER, scratch)
        let c = 0
        for (let k = 0; k < n; k++) if (U.type[scratch[k]] === U.type[u]) scratch[c++] = scratch[k]
        selectUnits(scratch, c, additive)
        lastClickT = -1e9
        return
      }
      lastClickT = t
      lastClickType = U.type[u]
      if (additive) {
        // shift-click toggles membership
        for (let k = 0; k < overlay.selCount; k++) {
          if (overlay.sel[k] === u) {
            overlay.sel[k] = overlay.sel[overlay.selCount - 1]
            overlay.selGen[k] = overlay.selGen[overlay.selCount - 1]
            overlay.selCount--
            selected()
            return
          }
        }
      }
      scratch[0] = u
      selectUnits(scratch, 1, additive)
      return
    }
    lastClickT = -1e9
    const b = buildingAtTile(ctx, w.x, w.y)
    if (b >= 0) { selectBuilding(b); return }
    if (!additive) { clearSelection(); selected() }
  }
  function boxSelect(additive) {
    const ctx = game.ctx
    const n = unitsInRect(ctx, overlay.dragX0, overlay.dragY0, overlay.dragX1, overlay.dragY1, F_PLAYER, false, scratch)
    if (n === 0 && additive) return
    selectUnits(scratch, n, additive)
  }

  // ---------------------------------------------------------------- groups
  function assignGroup(g) {
    const U = game.ctx.units
    const arr = []
    for (let k = 0; k < overlay.selCount; k++) {
      const id = overlay.sel[k]
      if (U.alive[id] && U.gen[id] === overlay.selGen[k] && U.faction[id] === F_PLAYER) arr.push(id, overlay.selGen[k])
    }
    groups[g] = arr
    toast('Group ' + g + ': ' + (arr.length >> 1) + ' units', 'info')
  }
  function recallGroup(g) {
    const U = game.ctx.units
    const arr = groups[g]
    let n = 0, sx = 0, sy = 0
    const live = []
    for (let k = 0; k < arr.length; k += 2) {
      const id = arr[k], gen = arr[k + 1]
      if (U.alive[id] && U.gen[id] === gen) { scratch[n++] = id; sx += U.x[id]; sy += U.y[id]; live.push(id, gen) }
    }
    groups[g] = live
    if (n === 0) return
    selectUnits(scratch, n, false)
    const t = clock()
    if (lastRecallGroup === g && t - lastRecallT < DOUBLE_MS * 1.5) camera.centerOn(sx / n, sy / n)
    lastRecallGroup = g
    lastRecallT = t
  }

  // ---------------------------------------------------------------- commands on selection
  function demolishSelected() {
    const ctx = game.ctx
    const b = overlay.selBuilding
    if (b < 0 || !ctx.buildings.alive[b]) return
    const type = ctx.buildings.type[b]
    if (B_FLAGS[type] & BF_CORE) { toast('The Hearth cannot be demolished', 'bad'); return }
    if (demolishBuilding(ctx, b)) {
      toast(BUILDINGS[type].name + ' demolished (50% refund)', 'info')
      overlay.selBuilding = -1
      selected()
    }
  }
  function togglePauseSelected() {
    const ctx = game.ctx
    const b = overlay.selBuilding
    if (b < 0 || !ctx.buildings.alive[b]) return
    if (!(B_FLAGS[ctx.buildings.type[b]] & (BF_PRODUCER | BF_DEN | BF_HALL))) return
    setPaused(ctx, b, !ctx.buildings.paused[b])
    selected()
  }

  function cancel() {
    if (overlay.ghostType) { overlay.ghostType = 0; lastGhostType = 0; return }
    if (overlay.attackMoveArmed) { overlay.attackMoveArmed = 0; return }
    if (overlay.dragActive) { overlay.dragActive = false; leftDown = false; dragging = false; return }
    if (overlay.selCount > 0 || overlay.selBuilding >= 0) { clearSelection(); selected(); return }
    if (api.buildMenuOpen) api.buildMenuOpen = false
  }

  // ---------------------------------------------------------------- listeners
  function onPointerDown(e) {
    local(e)
    mouseIn = true
    if (typeof document !== 'undefined' && document.activeElement && document.activeElement !== document.body &&
      /** @type {any} */ (document.activeElement).blur) /** @type {any} */ (document.activeElement).blur()
    if (e.button === 1) {
      midDown = true; lastMx = mx; lastMy = my
      if (e.preventDefault) e.preventDefault()
    } else if (e.button === 0) {
      if (overlay.ghostType) { tryPlace(!!e.shiftKey); return }
      if (overlay.attackMoveArmed) {
        attackMoveClick()
        if (!e.shiftKey) overlay.attackMoveArmed = 0
        return
      }
      leftDown = true; dragging = false
      sx0 = mx; sy0 = my
      const w = cursorWorld()
      wx0 = w.x; wy0 = w.y
      shiftAtDown = !!e.shiftKey
    } else if (e.button === 2) {
      if (overlay.ghostType) { overlay.ghostType = 0; lastGhostType = 0; return }
      if (overlay.attackMoveArmed) { overlay.attackMoveArmed = 0; return }
      rightClick()
    }
    if (canvas.setPointerCapture && e.pointerId !== undefined) { try { canvas.setPointerCapture(e.pointerId) } catch (_) { /* ignore */ } }
  }
  function onPointerMove(e) {
    local(e)
    mouseIn = true
    if (midDown) {
      camera.panBy(lastMx - mx, lastMy - my)
      lastMx = mx; lastMy = my
    }
    if (leftDown && !dragging) {
      const dx = mx - sx0, dy = my - sy0
      if (dx * dx + dy * dy > DRAG_PX * DRAG_PX) dragging = true
    }
    if (dragging) updateDrag()
  }
  function updateDrag() {
    const w = cursorWorld()
    overlay.dragActive = true
    overlay.dragX0 = wx0; overlay.dragY0 = wy0
    overlay.dragX1 = w.x; overlay.dragY1 = w.y
  }
  function onPointerUp(e) {
    local(e)
    if (e.button === 1) { midDown = false; return }
    if (e.button !== 0 || !leftDown) return
    leftDown = false
    const additive = !!e.shiftKey || shiftAtDown
    if (dragging) {
      updateDrag()
      boxSelect(additive)
      overlay.dragActive = false
      dragging = false
    } else clickSelect(additive)
    if (canvas.releasePointerCapture && e.pointerId !== undefined) { try { canvas.releasePointerCapture(e.pointerId) } catch (_) { /* ignore */ } }
  }
  function onPointerCancel() { leftDown = false; dragging = false; midDown = false; overlay.dragActive = false }
  function onEnter() { mouseIn = true }
  function onLeave() { mouseIn = false }
  function onWheel(e) {
    if (e.preventDefault) e.preventDefault()
    local(e)
    let d = e.deltaY || 0
    if (e.deltaMode === 1) d *= 33
    else if (e.deltaMode === 2) d *= 400
    let steps = d / 100
    if (steps > 1) steps = 1; else if (steps < -1) steps = -1
    if (steps === 0) return
    camera.zoomAt(mx, my, Math.pow(WHEEL_STEP, -steps))
    if (overlay.ghostType) refreshGhost(false)
  }
  function onContext(e) { if (e.preventDefault) e.preventDefault() }

  function onKeyDown(e) {
    const tgt = e.target
    if (tgt && (tgt.tagName === 'INPUT' || tgt.tagName === 'TEXTAREA' || tgt.isContentEditable)) return
    const code = e.code || ''
    keys.add(code)
    const ctrl = !!(e.ctrlKey || e.metaKey), shift = !!e.shiftKey
    let handled = true
    let digit = -1
    if (code.length === 6 && code.startsWith('Digit')) digit = code.charCodeAt(5) - 48
    if (digit >= 1 && digit <= 9 && ctrl) assignGroup(digit)
    else if (digit >= 1 && digit <= 9 && shift) recallGroup(digit)
    else if (code === 'Escape') cancel()
    else if (code === 'Delete' || code === 'Backspace') demolishSelected()
    else if (code === 'Space') { if (!e.repeat) game.togglePause() }
    else if (code === 'Equal' || code === 'NumpadAdd') game.setSpeed(game.paused ? game.speed : nextSpeed(game.speed, 1))
    else if (code === 'Minus' || code === 'NumpadSubtract') game.setSpeed(nextSpeed(game.speed, -1))
    else if (ctrl || e.altKey) handled = false // leave browser shortcuts alone
    else if (code === 'KeyB') api.buildMenuOpen = !api.buildMenuOpen
    else if (code === 'KeyA' && soldiers() > 0) { overlay.attackMoveArmed = 1; overlay.ghostType = 0 }
    else if (code === 'KeyH') { const n = soldiers(); for (let k = 0; k < n; k++) commandHold(game.ctx, cmdBuf[k]) }
    else if (code === 'KeyX') { const n = soldiers(); for (let k = 0; k < n; k++) commandStop(game.ctx, cmdBuf[k]) }
    else if (code === 'KeyP') togglePauseSelected()
    else if (code === 'Backquote') overlay.showGrid = !overlay.showGrid
    else if (code === 'Backslash') overlay.showPaths = !overlay.showPaths
    else {
      const t = hotkeyType(code)
      if (t) beginPlace(t)
      else handled = code.startsWith('Arrow') || code === 'KeyW' || code === 'KeyS' || code === 'KeyD' || code === 'KeyA'
    }
    if (handled && e.preventDefault) e.preventDefault()
  }
  function onKeyUp(e) { keys.delete(e.code || '') }
  function onBlur() { keys.clear(); midDown = false }

  const canvasListeners = [
    ['pointerdown', onPointerDown], ['pointermove', onPointerMove], ['pointerup', onPointerUp],
    ['pointercancel', onPointerCancel], ['pointerenter', onEnter], ['pointerleave', onLeave],
    ['wheel', onWheel], ['contextmenu', onContext],
  ]
  for (const [t, f] of canvasListeners) canvas.addEventListener(t, f, t === 'wheel' ? { passive: false } : undefined)
  if (keyTarget) {
    keyTarget.addEventListener('keydown', onKeyDown)
    keyTarget.addEventListener('keyup', onKeyUp)
    keyTarget.addEventListener('blur', onBlur)
  }

  // ---------------------------------------------------------------- per frame
  function update(dtSec) {
    frame++
    if (game.ctx !== ctxSeen) {
      // context replaced (reset): ids are meaningless now
      ctxSeen = game.ctx
      clearSelection()
      overlay.hoverBuilding = -1
      overlay.hoverUnit = -1
      overlay.pingTick = -1
      for (let i = 0; i < groups.length; i++) groups[i] = []
      selected()
    }
    const dt = dtSec > 0.1 ? 0.1 : dtSec > 0 ? dtSec : 0
    // keyboard pan (A pans only while it is not the attack-move key)
    let px = 0, py = 0
    const aPans = !overlay.attackMoveArmed && soldiersCached() === 0
    if (keys.has('KeyD') || keys.has('ArrowRight')) px += 1
    if ((aPans && keys.has('KeyA')) || keys.has('ArrowLeft')) px -= 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) py += 1
    if (keys.has('KeyW') || keys.has('ArrowUp')) py -= 1
    // edge pan
    if (mouseIn && !midDown && mx >= 0 && my >= 0 && !hooks.noEdgePan) {
      if (mx <= EDGE_PAN_PX) px -= 1; else if (mx >= camera.viewW - EDGE_PAN_PX) px += 1
      if (my <= EDGE_PAN_PX) py -= 1; else if (my >= camera.viewH - EDGE_PAN_PX) py += 1
    }
    if (px || py) {
      const k = (px && py ? Math.SQRT1_2 : 1) * PAN_SPEED * dt
      camera.panBy(px * k, py * k)
    }
    if (mx >= 0) {
      const w = cursorWorld()
      if (dragging) updateDrag()
      const ctx = game.ctx
      if ((frame & 1) === 0) {
        overlay.hoverBuilding = buildingAtTile(ctx, w.x, w.y)
        overlay.hoverUnit = unitAt(ctx, w.x, w.y, 0.5, -1)
      }
      if (overlay.ghostType) refreshGhost(false)
    }
    if (frame % 6 === 0) pruneSelection()
    // cursor feedback
    let cur = 'default'
    if (overlay.ghostType) cur = 'copy'
    else if (overlay.attackMoveArmed) cur = 'crosshair'
    else if (midDown) cur = 'grabbing'
    else if (overlay.hoverUnit >= 0 || overlay.hoverBuilding >= 0) cur = 'pointer'
    if (cur !== lastCursor && canvas.style) { canvas.style.cursor = cur; lastCursor = cur }
  }
  let solCacheFrame = -1, solCache = 0
  function soldiersCached() {
    if (solCacheFrame !== frame) { solCache = overlay.selCount ? soldiers() : 0; solCacheFrame = frame }
    return solCache
  }

  function dispose() {
    for (const [t, f] of canvasListeners) canvas.removeEventListener(t, f)
    if (keyTarget) {
      keyTarget.removeEventListener('keydown', onKeyDown)
      keyTarget.removeEventListener('keyup', onKeyUp)
      keyTarget.removeEventListener('blur', onBlur)
    }
  }

  /**
   * Wire a minimap canvas: click/drag recentres the camera. `toWorld` is the Minimap's
   * contract method; if it is unavailable (stub) a proportional mapping is used.
   */
  function attachMinimap(el, minimap) {
    let down = false
    const p = { x: 0, y: 0 }
    const go = (e) => {
      const r = el.getBoundingClientRect()
      const ox = e.clientX - r.left, oy = e.clientY - r.top
      const cw = el.clientWidth || r.width || 1, ch = el.clientHeight || r.height || 1
      let ok = false
      if (minimap && minimap.toWorld) {
        try { minimap.toWorld(ox, oy, cw, ch, p); ok = p.x === p.x && p.y === p.y } catch (_) { ok = false }
      }
      if (!ok) { p.x = ox / cw * camera.mapW; p.y = oy / ch * camera.mapH }
      camera.centerOn(p.x, p.y)
    }
    const onDown = (e) => {
      if (e.button === 2 && soldiers() > 0) {
        // right-click on the minimap: move order there
        const r = el.getBoundingClientRect()
        const cw = el.clientWidth || r.width || 1, ch = el.clientHeight || r.height || 1
        const tx = (e.clientX - r.left) / cw * camera.mapW, ty = (e.clientY - r.top) / ch * camera.mapH
        commandGroup(game.ctx, cmdBuf, soldiers(), Math.floor(tx), Math.floor(ty), O_MOVE)
        ping(tx, ty, 0)
        return
      }
      if (e.button !== 0) return
      down = true; go(e)
      if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId) } catch (_) { /* ignore */ } }
    }
    const onMove = (e) => { if (down) go(e) }
    const onUp = () => { down = false }
    const onCtx = (e) => e.preventDefault()
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('contextmenu', onCtx)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('contextmenu', onCtx)
    }
  }

  const api = {
    update,
    beginPlace,
    cancel,
    dispose,
    groups,
    attachMinimap,
    /** build menu visibility (KeyB); the UI reads it */
    buildMenuOpen: true,
    selectBuilding,
    selectUnits,
    clearSelection: () => { clearSelection(); selected() },
    demolishSelected,
    togglePauseSelected,
    /** number of selected player soldiers (fresh) */
    soldierCount: soldiers,
    /** currently held key codes (debug) */
    keys,
    get placing() { return overlay.ghostType },
  }
  return api
}
