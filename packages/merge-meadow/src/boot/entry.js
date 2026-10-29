// index.html's ONE module script. Static lockdown first, then main by dynamic
// import: whatever chunks Rollup shares, nothing in main's graph evaluates
// before lockdown() has returned (spike S3: a second module script sharing
// @endo failed with "prior harden" once a second entry existed). A failure
// anywhere in boot lands on the error overlay instead of a blank page.
import './lockdown.js'
import { showBootError } from './overlay.js'

import('../../main.js').then((m) => m.booted).catch(showBootError)
