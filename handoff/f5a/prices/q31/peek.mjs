const D = process.argv[2] + '/'
const core = await import(D + 'core/index.js')
const lines = []
const G = core.createMatch({ board: 12345, dice: 678, mission: 'classic', terrain: 'classic', seats: [{ race: 'squirrel', ctrl: 'ai', army: '112111' }, { race: 'insect', ctrl: 'ai', army: '112111' }] }, { onTrace: (l) => lines.push(l) })
console.log(G.turn.result, lines.length)
console.log(lines.filter((l) => !/^(act|hash)/.test(l)).slice(0, 120).join('\n'))
