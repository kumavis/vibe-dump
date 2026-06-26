import { startStaticServer } from './static-server.mjs'

const root = process.argv[2] ?? 'dist'
const port = Number(process.env.PORT ?? 4173)

const { url } = await startStaticServer(root, port)
console.log(`Serving "${root}" at ${url}`)
console.log('Press Ctrl+C to stop.')
