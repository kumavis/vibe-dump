// The one place the kit makes a Canvas2D. Relief panels rasterise paths with
// the browser's own antialiaser (it is fast and its coverage is what the EDT
// reads sub-pixel edges from), so anything that wants to run the kit somewhere
// else — a worker, node-canvas in a test — swaps this factory and nothing more.

let factory = (w, h) => {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
  if (typeof document !== 'undefined') {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    return c
  }
  throw new Error('taotie kit: no Canvas2D available — call setCanvasFactory()')
}

export function createCanvas(w, h) {
  return factory(Math.max(1, w | 0), Math.max(1, h | 0))
}

export function setCanvasFactory(fn) {
  factory = fn
}

export function context2d(canvas) {
  return canvas.getContext('2d', { willReadFrequently: true })
}
