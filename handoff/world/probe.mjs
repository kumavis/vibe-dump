import { createMatch } from '/home/user/vibe-dump-wt/world/packages/tails-and-scales/core/index.js'
import { MISSIONS } from '/home/user/vibe-dump-wt/world/packages/tails-and-scales/data/mission.js'
for (const [m, t, b] of [['classic', 'classic', 411], ['grand', 'open', 7], ['powder', 'powder', 3], ['keg','keg',2]]) {
const G = createMatch({ board: b, dice: 0, mission: m, terrain: t, seats: [{ race: 'squirrel', ctrl: 'human' }, { race: 'serpent', ctrl: 'human' }] }, { out: null })
const kinds = {}
for (const c of G.terrain.chunks) kinds[c.kind] = (kinds[c.kind] || 0) + 1
console.log(m, t, JSON.stringify(kinds), 'range', MISSIONS[m].objectiveRange ?? Object.keys(MISSIONS[m]).join(','))
for (const k of Object.keys(kinds)) { const c = G.terrain.chunks.find((c) => c.kind === k); console.log(' ', k, JSON.stringify({ s: c.shape, nav: c.nav, nk: c.navKind, cov: c.cover, cs: c.coverShape, look: c.look }).slice(0, 260)) }
}
