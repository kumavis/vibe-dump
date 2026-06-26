import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, normalize, extname } from 'node:path'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

// A tiny dependency-free static file server. Used both for the local `preview`
// command and, during the build, for screenshotting the apps with Playwright.
export function startStaticServer(root, port = 0) {
  const server = createServer(async (req, res) => {
    try {
      const url = decodeURIComponent(req.url.split('?')[0])
      // Resolve the request inside `root`, defaulting directories to index.html.
      let filePath = normalize(join(root, url))
      if (!filePath.startsWith(normalize(root))) {
        res.writeHead(403).end('Forbidden')
        return
      }
      let info = await stat(filePath).catch(() => null)
      if (info?.isDirectory()) {
        filePath = join(filePath, 'index.html')
        info = await stat(filePath).catch(() => null)
      }
      if (!info) {
        res.writeHead(404).end('Not found')
        return
      }
      const body = await readFile(filePath)
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' })
      res.end(body)
    } catch (err) {
      res.writeHead(500).end(String(err))
    }
  })

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const { port: actualPort } = server.address()
      resolve({
        server,
        port: actualPort,
        url: `http://127.0.0.1:${actualPort}`,
        close: () => new Promise((r) => server.close(r)),
      })
    })
  })
}
