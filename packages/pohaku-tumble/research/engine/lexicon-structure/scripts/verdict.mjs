// verdict.mjs — GOOD / JUKUGO-LIKE as defined in the task, applied to one simx output row.
export function allDealt(r) { const [a, b] = r.dealt.split('/').map(Number); return a === b && b > 0 }
export function good(r) { return allDealt(r) && r.stallRate <= 0.05 && r.stuck <= 0.10 && r.repeatRate <= 0.20 && r.linked >= 0.35 && r.linked <= 0.70 }
export function jlike(r) { return allDealt(r) && r.stallRate <= 0.02 && r.stuck <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.40 && r.linked <= 0.65 }
export function verdict(r) { return jlike(r) ? 'JL' : good(r) ? 'GOOD' : allDealt(r) ? '-' : 'nodeal' }
// What fails GOOD, as a short string (for reading tables)
export function why(r) {
  if (!allDealt(r)) return 'deal'
  const f = []
  if (r.stallRate > 0.05) f.push('stall')
  if (r.stuck > 0.10) f.push('stuck')
  if (r.repeatRate > 0.20) f.push('rep')
  if (r.linked < 0.35) f.push('lnk<')
  if (r.linked > 0.70) f.push('lnk>')
  return f.join(',')
}
