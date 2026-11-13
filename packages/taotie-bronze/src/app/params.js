// URL parameters, read once at boot (the verification hooks in KIT.md).

export function readParams(search = location.search) {
  const q = new URLSearchParams(search)
  const num = (k, d) => {
    const v = parseFloat(q.get(k))
    return Number.isFinite(v) ? v : d
  }
  const mode = q.get('mode')
  return {
    a: q.get('a'),
    view: q.get('view'),
    patina: q.get('patina'),
    mode: ['beauty', 'clay', 'silhouette', 'height'].includes(mode) ? mode : 'beauty',
    ui: q.get('ui') !== '0',
    q: Math.min(4, Math.max(0.25, num('q', 1))),
    tab: q.get('tab') === 'atlas' ? 'atlas' : 'vessels',
    motif: q.get('motif'),
    preset: q.get('preset'),
  }
}
