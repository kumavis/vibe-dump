// GOOD / JUKUGO-LIKE thresholds from the brief (averages over seeds; every seed must deal).
export function verdict(r) {
  if (!r.dealt) return 'error'
  const [d, n] = r.dealt.split('/').map(Number)
  if (d !== n) return 'nodeal'
  const jl = r.stallRate <= 0.02 && r.stuck <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.4 && r.linked <= 0.65
  const good = r.stallRate <= 0.05 && r.stuck <= 0.1 && r.repeatRate <= 0.2 && r.linked >= 0.35 && r.linked <= 0.7
  return jl ? 'JUKUGO' : good ? 'GOOD' : '-'
}
