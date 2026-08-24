import { FONT_METRICS } from './metrics.js'

const listeners = new Set()

export const store = {
  font: FONT_METRICS['noto-sans-jp'],
  setFont (font) {
    if (font === this.font) return
    this.font = font
    for (const fn of listeners) fn(font)
  },
  onFont (fn) { listeners.add(fn); return () => listeners.delete(fn) },
}
