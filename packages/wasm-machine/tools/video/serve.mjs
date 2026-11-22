// Tiny static server for dist/ (capture only). serve(dir) -> { url, close }
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json' }
export function serve(dir) {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
      if (p.endsWith('/')) p += 'index.html'
      const f = path.join(dir, p)
      if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nf') }
      res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' })
      fs.createReadStream(f).pipe(res)
    })
    srv.listen(0, '127.0.0.1', () => resolve({ url: `http://127.0.0.1:${srv.address().port}`, close: () => srv.close() }))
  })
}
