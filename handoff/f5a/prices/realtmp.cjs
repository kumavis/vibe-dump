// Node's tmpdir() as the real path behind TMPDIR's short /proc/<pid>/fd/9
// (Vite refuses a root reached through it: the html's real path then lies
// outside the root). Chromium still reads the short TMPDIR from the env.
const os = require('node:os'), fs = require('node:fs')
const real = fs.realpathSync(os.tmpdir())
os.tmpdir = () => real
require('node:module').syncBuiltinESMExports()
