// Camera: view transform shared by input, render and minimap.
// OWNER: app implementer. render.js and minimap.js depend on the exact fields below;
// keep these fields/methods and their semantics.
//
// Transform (CSS px <-> world tile units):
//   sx = (wx - cam.x) * cam.scale + cam.viewW / 2
//   wx = (sx - cam.viewW / 2) / cam.scale + cam.x
// with cam.scale = TILE * cam.zoom (CSS px per tile). The renderer multiplies by
// cam.dpr for backing-store pixels.
//
// Pure math, no DOM: safe to import (and unit-test) in Node.

import { TILE, ZOOM_MIN, ZOOM_MAX, zoomTier } from './constants.js'

/** Tiles of slack the view may show beyond the map edge (so edge buildings are not under the HUD). */
export const CAMERA_MARGIN = 6

export class Camera {
  /** @param {number} mapW tiles @param {number} mapH tiles */
  constructor(mapW, mapH) {
    this.mapW = mapW
    this.mapH = mapH
    /** view centre, world tile units */
    this.x = mapW / 2
    this.y = mapH / 2
    /** 1 = TILE CSS px per tile */
    this.zoom = 1
    /** viewport CSS size */
    this.viewW = 1
    this.viewH = 1
    /** devicePixelRatio */
    this.dpr = 1
    /** bumped on every change of x/y/zoom/view size (cheap dirty check for consumers) */
    this.version = 0
  }

  /** CSS px per tile */
  get scale() { return TILE * this.zoom }
  /** ZOOM_TIER_* for the current zoom */
  get tier() { return zoomTier(this.zoom) }

  resize(cssW, cssH, dpr) {
    this.viewW = Math.max(1, cssW)
    this.viewH = Math.max(1, cssH)
    this.dpr = dpr || 1
    this.clamp()
  }

  /** @param {{x:number,y:number}} out */
  screenToWorld(sx, sy, out) {
    const s = this.scale
    out.x = (sx - this.viewW * 0.5) / s + this.x
    out.y = (sy - this.viewH * 0.5) / s + this.y
    return out
  }

  /** @param {{x:number,y:number}} out CSS px */
  worldToScreen(wx, wy, out) {
    const s = this.scale
    out.x = (wx - this.x) * s + this.viewW * 0.5
    out.y = (wy - this.y) * s + this.viewH * 0.5
    return out
  }

  /** Visible world rect in tile units (float, unclamped). @param {{x0:number,y0:number,x1:number,y1:number}} out */
  visibleRect(out) {
    const hw = this.viewW * 0.5 / this.scale, hh = this.viewH * 0.5 / this.scale
    out.x0 = this.x - hw; out.y0 = this.y - hh
    out.x1 = this.x + hw; out.y1 = this.y + hh
    return out
  }

  /** Multiply zoom by `factor`, keeping the world point under CSS (sx,sy) fixed. */
  zoomAt(sx, sy, factor) {
    const s0 = this.scale
    const wx = (sx - this.viewW * 0.5) / s0 + this.x
    const wy = (sy - this.viewH * 0.5) / s0 + this.y
    this.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, this.zoom * factor))
    const s1 = this.scale
    this.x = wx - (sx - this.viewW * 0.5) / s1
    this.y = wy - (sy - this.viewH * 0.5) / s1
    this.clamp()
  }

  /** Set an absolute zoom around the view centre. */
  setZoom(z) {
    this.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z))
    this.clamp()
  }

  /** Pan by a CSS-pixel delta (positive dx moves the view right). */
  panBy(dxCss, dyCss) {
    const s = this.scale
    this.x += dxCss / s
    this.y += dyCss / s
    this.clamp()
  }

  centerOn(x, y) { this.x = x; this.y = y; this.clamp() }

  /**
   * Keep the view on the map: the visible rect may overhang each edge by at most
   * CAMERA_MARGIN tiles; when the whole map (plus margins) fits, the map is centred on
   * that axis. NaN positions (bad input) snap back to the map centre.
   */
  clamp() {
    const s = this.scale
    const hw = this.viewW * 0.5 / s, hh = this.viewH * 0.5 / s
    const m = CAMERA_MARGIN
    if (!(this.x === this.x)) this.x = this.mapW * 0.5
    if (!(this.y === this.y)) this.y = this.mapH * 0.5
    if (hw * 2 >= this.mapW + 2 * m) this.x = this.mapW * 0.5
    else {
      const lo = hw - m, hi = this.mapW - hw + m
      if (this.x < lo) this.x = lo; else if (this.x > hi) this.x = hi
    }
    if (hh * 2 >= this.mapH + 2 * m) this.y = this.mapH * 0.5
    else {
      const lo = hh - m, hi = this.mapH - hh + m
      if (this.y < lo) this.y = lo; else if (this.y > hi) this.y = hi
    }
    this.version++
  }
}
