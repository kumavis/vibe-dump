import { boot } from './app/app.js'

boot().catch((err) => {
  console.error(err)
  document.documentElement.dataset.ready = 'error'
})
