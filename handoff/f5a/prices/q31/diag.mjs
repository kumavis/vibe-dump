// usage: node diag.mjs <dir> <raceA> <raceB> <set> <N>: N battles of random
// lists at the limit (seats alternating); who slays the B race's models, and
// with what, and what B's units slay
const [D, ra, rb, set, N] = process.argv.slice(2)
const core = await import(D + '/core/index.js')
const { RACES } = await import(D + '/data/schema.js')
const { MISSIONS } = await import(D + '/data/mission.js')
const A = core.army, rules = MISSIONS.classic.list
const shorts = (r) => new Set(Object.values(RACES[r].units).map((t) => t.short))
const SA = shorts(ra), SB = shorts(rb)
const lost = {}, dealt = {}, fielded = {}
let score = 0; const why = {}
for (let i = 0; i < N; i++) {
  const lists = [ra, rb].map((r, k) => ({ race: r, ctrl: 'ai', army: A.listText(A.autoList(RACES[r], rules, 7000 + i * 2 + k)) }))
  const seats = i % 2 ? [lists[1], lists[0]] : lists
  for (const [k, n] of [...lists[1].army].entries()) { const u = RACES[rb].units[RACES[rb].roster[k]]; fielded[u.short] = (fielded[u.short] ?? 0) + Number(n) * u.models }
  let lastActor = null
  const G = core.createMatch({ board: 99000 + i, dice: 55000 + i, mission: 'classic', terrain: set, seats }, { onTrace: (l) => {
    let m = /^log \d (.+?) (?:shoot|fight|fire|casts|tries) /.exec(l)
    if (m) lastActor = m[1]
    m = /^log -?\d (?:(.+?) (shoot|fight) (.+?)|(.+?) hits (.+?)): .*— (\d+) slain/.exec(l)
    if (!m) return
    const n = Number(m[6]), tgt = m[3] ?? m[5], how = m[2] ? `${m[1]} ${m[2]}` : `${lastActor} [${m[4]}]`
    const actor = m[1] ?? lastActor
    if (SB.has(tgt) && SA.has(actor)) { lost[tgt] ??= {}; lost[tgt][how] = (lost[tgt][how] ?? 0) + n }
    if (SB.has(actor) && SA.has(tgt)) dealt[how] = (dealt[how] ?? 0) + n
  } })
  const r = G.turn.result, mine = i % 2 ? 0 : 1
  why[r.why + (r.win === mine ? "+" : r.win === -1 ? "=" : "-")] = (why[r.why + (r.win === mine ? "+" : r.win === -1 ? "=" : "-")] ?? 0) + 1
  score += r.win === -1 ? 0.5 : r.win === mine ? 1 : 0
}
console.log(`${rb} score vs ${ra} on ${set}: ${(100 * score / N).toFixed(1)}% of ${N}`, JSON.stringify(why))
for (const [t, by] of Object.entries(lost)) {
  const tot = Object.values(by).reduce((a, b) => a + b, 0)
  console.log(`  ${t}: fielded ${fielded[t]}, slain ${tot} (${(100 * tot / fielded[t]).toFixed(0)}%): ` + Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k} ${v}`).join(', '))
}
console.log('  dealt: ' + Object.entries(dealt).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', '))
