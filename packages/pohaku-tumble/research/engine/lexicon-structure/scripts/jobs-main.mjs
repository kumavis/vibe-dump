// Main matrix: every curve list (3 orders x 8 sizes) + attested-WA (spelling-keyed), pruned to its
// k-core for k = 0 (unpruned), 2, 3, 4; engines stock / fix (/ jukugo5 on 9x8); five grid variants.
const here = new URL('.', import.meta.url).pathname
export const ENGINES = {
  stock: { dealMin: 1 },                          // Jukugo's rules, deal pool lowered to degree >= 1 so it deals
  fix: { dealMin: 2, matchMin: 2, retry: 6 },     // the simple fix
  jukugo5: {},                                    // Jukugo exactly (deal pool degree >= 5)
}
export const GRIDS = {
  '9x8': { cols: 9, rows: 8 },
  '7x6': { cols: 7, rows: 6 },
  '7x6s': { cols: 7, rows: 6, keepSpacing: true },
  '6x4': { cols: 6, rows: 4 },
  '6x4s': { cols: 6, rows: 4, keepSpacing: true },
}
const lists = [['attested', 128, 'attested-WA']]
for (const o of ['realistic', 'random', 'best']) for (const n of [128, 175, 225, 300, 400, 500, 650, 905]) lists.push([o, n, `curve-${o}-${n}`])
const jobs = []
jobs.push({ lex: 'jukugo', lexName: 'jukugo', cfg: { name: 'jukugo-ref', cols: 9, rows: 8, horizontalOnly: false, slab: 1, seeds: 10, ticks: 1500 }, tag: { order: 'jukugo', size: 1649, k: 0, engine: 'jukugo-ref' } })
for (const [order, size, name] of lists) for (const k of [0, 2, 3, 4]) for (const [g, gc] of Object.entries(GRIDS)) for (const [e, ec] of Object.entries(ENGINES)) {
  if (e === 'jukugo5' && g !== '9x8') continue
  jobs.push({ lex: `${here}lex/${name}.k${k}.json`, lexName: `${name}.k${k}`, cfg: { name: e, ...gc, horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500, ...ec }, tag: { order, size, k, engine: e } })
}
export default jobs
