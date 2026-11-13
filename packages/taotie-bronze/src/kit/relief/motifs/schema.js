// Motif parameter schemas are plain objects so the Motif Atlas can build
// controls without knowing the motif:
//   range: { type: 'range', min, max, step, default, label?, unit? }
//   enum:  { type: 'enum', options: [...], default, label? }
//   bool:  { type: 'bool', default, label? }
//   group: { type: 'group', fields: { … }, label? }   → a nested params object

export function motifDefaults(schema = {}) {
  const out = {}
  for (const [k, s] of Object.entries(schema)) {
    out[k] = s.type === 'group' ? motifDefaults(s.fields) : s.default
  }
  return out
}
