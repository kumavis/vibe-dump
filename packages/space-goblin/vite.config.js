import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import shared from '../../vite.config.shared.js'

// Two pages ship: the run at /, and the rig turntable at /turntable/. Everything
// else — `base: './'` so the app works under the Pages sub-path, and the output
// directory — comes from the shared config.
export default defineConfig(
  mergeConfig(shared, {
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          turntable: fileURLToPath(new URL('./turntable/index.html', import.meta.url)),
        },
      },
    },
  }),
)
