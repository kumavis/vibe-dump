import { createMatch } from '/home/user/vibe-dump-wt/world/packages/tails-and-scales/core/index.js'
import { OBJECTIVE_RANGE, } from '/home/user/vibe-dump-wt/world/packages/tails-and-scales/core/rules.js'
import { EDGES } from '/home/user/vibe-dump-wt/world/packages/tails-and-scales/core/match.js'
import { plan, dressSeed } from '/home/user/vibe-dump-wt/world/packages/tails-and-scales/view/dressing/place.js'
for (const [m, t, b] of [['classic', 'classic', 411], ['classic', 'fortified', 4], ['grand', 'fortified', 5], ['powder', 'powder', 3]]) {
  const G = createMatch({ board: b, dice: 0, mission: m, terrain: t, seats: [{ race: 'squirrel', ctrl: 'human' }, { race: 'serpent', ctrl: 'human' }] }, { out: null })
  const t0 = performance.now()
  const p = plan({ seed: dressSeed(G.setup), set: t, W: G.board.W, H: G.board.H, deploy: G.board.deploy, edges: [G.seats[0].edge, G.seats[1].edge], objectives: G.objectives, range: OBJECTIVE_RANGE, chunks: G.terrain.chunks, nav: G.nav })
  const c = {}; for (const k of Object.keys(p)) if (Array.isArray(p[k])) c[k] = p[k].length
  const kinds = {}; for (const d of p.debris) kinds[d.kind] = (kinds[d.kind] || 0) + 1
  console.log(m, t, b, p.day, (performance.now() - t0).toFixed(1) + 'ms', JSON.stringify(c), JSON.stringify(kinds))
}
