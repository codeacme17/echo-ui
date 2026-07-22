import assert from 'node:assert/strict'
import { createDocsStaticServer } from './docs-static-server.mjs'

const host = process.env.HOST ?? '127.0.0.1'
const port = Number.parseInt(process.env.PORT ?? '1801', 10)
const basePath = process.env.DOCS_BASE_PATH ?? ''

assert.ok(Number.isInteger(port) && port > 0 && port <= 65_535, 'PORT must be a valid port')

const server = createDocsStaticServer({ basePath })

server.listen(port, host, () => {
  console.log(`Echo UI documentation preview: http://${host}:${port}${basePath}`)
})
