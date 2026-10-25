// node --import ./sim/oracle/register.mjs … installs the resolution hooks.
// run-legacy.mjs registers them itself, so this is only for ad-hoc scripts.
import { register } from 'node:module'
register('./hooks.mjs', import.meta.url)
