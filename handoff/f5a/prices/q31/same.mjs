const [a, b] = process.argv.slice(2)
const A = (await import(a + '/data/schema.js')).RACES, B = (await import(b + '/data/schema.js')).RACES
for (const r of ['insect', 'bird']) for (const k of Object.keys(A[r].units)) {
  const x = { ...A[r].units[k], cost: 0 }, y = { ...B[r].units[k], cost: 0 }
  const d = Object.keys(x).filter((f) => JSON.stringify(x[f]) !== JSON.stringify(y[f]))
  if (d.length) console.log(r, k, d.map((f) => `${f}: ${JSON.stringify(x[f])} vs ${JSON.stringify(y[f])}`).join('; '))
}
console.log('compared')
