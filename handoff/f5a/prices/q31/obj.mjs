const D = process.argv[2] + '/'
const core = await import(D + 'core/index.js')
const Q = await import(D + 'core/queries.js')
let raised = 0, tot = 0
for (let b = 1; b <= 20; b++) {
  const G = core.createMatch({ board: 1000 + b, dice: 5, mission: 'classic', terrain: 'fortified', seats: [{ race: 'squirrel', ctrl: 'human' }, { race: 'bird', ctrl: 'human' }] })
  const hs = G.objectives.map((o) => (G.nav.hasHeight ? Q.floorAt?.(G, o.x, o.z) : 0))
  tot += hs.length; raised += hs.filter((h) => h > 0.3).length
  if (b < 4) console.log(b, JSON.stringify(G.objectives), hs)
}
console.log(`raised objectives ${raised} of ${tot}`)
