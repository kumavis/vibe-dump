// print selected keys of JSON lines from stdin as TSV: node fmt.mjs key1,key2,...
const ks = process.argv[2].split(',')
console.log(ks.join('\t'))
import('node:readline').then((rl) => rl.createInterface({ input: process.stdin }).on('line', (l) => { try { const r = JSON.parse(l); console.log(ks.map((k) => r[k]).join('\t')) } catch { console.log(l) } }))
