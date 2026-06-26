import { defineConfig } from 'vite'

// Shared Vite config for every package in the monorepo.
//
// `base: './'` makes each built app reference its assets with relative URLs, so
// an app works no matter what sub-path it ends up under (locally, on GitHub
// Pages at /vibe-dump/<app>/, or in a file:// preview).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
