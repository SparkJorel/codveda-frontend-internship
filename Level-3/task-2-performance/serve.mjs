/**
 * A minimal static server used only to audit `before/` and `after/` under
 * identical conditions.
 *
 * The `after/` directory is served with the caching headers a real host
 * would send — immutable for content-hashed assets, revalidated for HTML —
 * so the caching part of the optimisation is actually exercised rather
 * than merely described in a README.
 *
 *   node serve.mjs before 5001
 *   node serve.mjs after  5002
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize, resolve } from 'node:path'

const root = resolve(process.argv[2] ?? 'before')
const port = Number(process.argv[3] ?? 5001)
const withCaching = root.endsWith('after')

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

function cacheHeaders(pathname) {
  if (!withCaching) return {}

  // Fonts and images never change under these names in this build, so they
  // are safe to cache for a year. HTML must revalidate or a deploy would
  // never reach a returning visitor.
  if (/\.(woff2|png|webp|svg|ico)$/.test(pathname)) {
    return { 'Cache-Control': 'public, max-age=31536000, immutable' }
  }
  if (/\.(css|js)$/.test(pathname)) {
    return { 'Cache-Control': 'public, max-age=604800' }
  }
  return { 'Cache-Control': 'no-cache' }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`)
    let pathname = decodeURIComponent(url.pathname)
    if (pathname.endsWith('/')) pathname += 'index.html'

    // normalize() collapses any ../ before it can escape the root.
    const filePath = join(root, normalize(pathname))
    if (!filePath.startsWith(root)) {
      res.writeHead(403).end('Forbidden')
      return
    }

    const info = await stat(filePath)
    if (!info.isFile()) throw new Error('not a file')

    const body = await readFile(filePath)
    res.writeHead(200, {
      'Content-Type': TYPES[extname(filePath)] ?? 'application/octet-stream',
      'Content-Length': body.length,
      ...cacheHeaders(pathname),
    })
    res.end(body)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found')
  }
})

server.listen(port, () => {
  console.log(`serving ${root} on http://localhost:${port}` + (withCaching ? ' (with cache headers)' : ''))
})
