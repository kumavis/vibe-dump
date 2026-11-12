// The shared monorepo config (base: './'), plus one thing: the reference `demo` segment stays
// loadable in dev (?seg=demo) but its audio + telemetry (~0.8 MB) aren't shipped — it isn't in
// the rundown.
import { rm } from 'node:fs/promises'
import { mergeConfig } from 'vite'
import shared from '../../vite.config.shared.js'

const DEV_ONLY = ['audio/demo.mp3', 'tele/demo.bin']

export default mergeConfig(shared, {
  plugins: [{
    name: 'late-cluster:drop-demo-assets',
    apply: 'build',
    async closeBundle() {
      for (const f of DEV_ONLY) await rm(new URL(`./dist/${f}`, import.meta.url), { force: true })
    },
  }],
})
