import assert from 'node:assert/strict'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'

export const docsOutputRoot = resolve(import.meta.dirname, '..', 'docs-nextra', 'out')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
}

const outputFileForRequest = async (requestUrl, basePath) => {
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname)
  const hasExpectedBasePath =
    !basePath || pathname === basePath || pathname.startsWith(`${basePath}/`)
  assert.ok(hasExpectedBasePath, `${pathname} should stay within ${basePath || '/'}`)

  const relativePath = (basePath ? pathname.slice(basePath.length) : pathname).replace(/^\/+/, '')
  let outputFile = resolve(
    docsOutputRoot,
    relativePath && !relativePath.endsWith('/') ? relativePath : `${relativePath}index.html`,
  )

  assert.ok(
    outputFile === docsOutputRoot || outputFile.startsWith(`${docsOutputRoot}${sep}`),
    'Documentation requests must stay within the static output directory.',
  )

  const fileStats = await stat(outputFile)
  if (fileStats.isDirectory()) outputFile = resolve(outputFile, 'index.html')
  return outputFile
}

export const createDocsStaticServer = ({ basePath = '', onAnalyticsScript } = {}) => {
  assert.ok(!basePath || (basePath.startsWith('/') && !basePath.endsWith('/')))

  return createServer(async (request, response) => {
    const pathname = new URL(request.url ?? '/', 'http://localhost').pathname
    if (pathname.endsWith('/_vercel/insights/script.js')) {
      onAnalyticsScript?.()
      response.writeHead(200, { 'Content-Type': contentTypes['.js'] })
      response.end('')
      return
    }

    try {
      const outputFile = await outputFileForRequest(request.url ?? '/', basePath)
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(outputFile)] ?? 'application/octet-stream',
      })
      createReadStream(outputFile).pipe(response)
    } catch {
      response.writeHead(404, { 'Content-Type': contentTypes['.html'] })
      createReadStream(resolve(docsOutputRoot, '404.html')).pipe(response)
    }
  })
}

export const listenOnRandomPort = (server) =>
  new Promise((resolveListen, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolveListen(server.address()))
  })

export const closeStaticServer = (server) =>
  new Promise((resolveClose) => server.close(resolveClose))
