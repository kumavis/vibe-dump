// The sweep's harness: os.cpus() cut to SWEEP_CPUS entries (default 2), or
// to the number in the sweep's cpus.txt when it is there (read as each
// process starts, so a lane's later runs take a new width), so the checks'
// pools (sim/lib.mjs CPUS) run fewer children beside a Chromium run. The
// pool's width is all it changes.
const os = require('node:os'), fs = require('node:fs')
const all = os.cpus
let n = Math.max(1, Number(process.env.SWEEP_CPUS) || 2)
try { const f = Number(fs.readFileSync(__dirname + '/cpus.txt', 'utf8').trim()); if (f >= 1) n = f } catch {}
os.cpus = () => all().slice(0, n)
require('node:module').syncBuiltinESMExports()
