import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { packLocalPackage } from './pack-local-package.mjs'

const packageRoot = resolve(import.meta.dirname, '..')
const consumerRoot = await mkdtemp(join(tmpdir(), 'echo-ui-react-consumers-'))
const consumers = [
  {
    reactDomTypesVersion: '18.3.7',
    reactTypesVersion: '18.3.31',
    reactVersion: '18.3.1',
  },
  {
    reactDomTypesVersion: '19.2.3',
    reactTypesVersion: '19.2.17',
    reactVersion: '19.2.8',
  },
]

try {
  const archivePath = await packLocalPackage(packageRoot, consumerRoot)

  for (const { reactDomTypesVersion, reactTypesVersion, reactVersion } of consumers) {
    const consumerDirectory = join(consumerRoot, `react-${reactVersion}`)
    await mkdir(consumerDirectory)
    await writeFile(
      join(consumerDirectory, 'package.json'),
      `${JSON.stringify(
        {
          name: `echo-ui-react-${reactVersion}-consumer`,
          private: true,
          type: 'module',
          dependencies: {
            '@nafr/echo-ui': `file:${archivePath}`,
            react: reactVersion,
            'react-dom': reactVersion,
          },
          devDependencies: {
            '@types/react': reactTypesVersion,
            '@types/react-dom': reactDomTypesVersion,
            jsdom: '29.1.1',
            typescript: '6.0.3',
          },
        },
        null,
        2,
      )}\n`,
    )
    await writeFile(
      join(consumerDirectory, 'consumer.tsx'),
      `import { useRef } from 'react'
import { Button, useFetchAudio } from '@nafr/echo-ui'

export function Consumer() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { pending } = useFetchAudio({ url: '/consumer.wav' })
  return <Button ref={buttonRef}>{pending ? 'Loading' : 'Ready'}</Button>
}
`,
    )
    await writeFile(
      join(consumerDirectory, 'tsconfig.json'),
      `${JSON.stringify(
        {
          compilerOptions: {
            jsx: 'react-jsx',
            module: 'ESNext',
            moduleResolution: 'Bundler',
            noEmit: true,
            skipLibCheck: false,
            strict: true,
            target: 'ES2022',
          },
          include: ['consumer.tsx'],
        },
        null,
        2,
      )}\n`,
    )
    await writeFile(
      join(consumerDirectory, 'render.mjs'),
      `import assert from 'node:assert/strict'
import { act, createElement, StrictMode, version as reactVersion } from 'react'
import { version as reactDomVersion } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { Button, useFetchAudio } from '@nafr/echo-ui'
import { JSDOM } from 'jsdom'

let fetchAudio
let onErrorCalls = 0

function HookConsumer() {
  const { error, pending, fetchAudio: fetchFromHook } = useFetchAudio({
    url: '/consumer-error.wav',
    onError: () => {
      onErrorCalls += 1
    },
  })
  fetchAudio = fetchFromHook
  return createElement('span', null, error ? 'Hook error' : pending ? 'Hook pending' : 'Hook ready')
}

const markup = renderToStaticMarkup(
  createElement(
    StrictMode,
    null,
    createElement(Button, null, 'Echo UI consumer'),
    createElement(HookConsumer),
  ),
)

assert.equal(reactVersion, '${reactVersion}')
assert.equal(reactDomVersion, '${reactVersion}')
assert.match(markup, /Echo UI consumer/)
assert.match(markup, /Hook pending/)

const dom = new JSDOM('<!doctype html><div id="root"></div>', {
  url: 'https://consumer.example',
})
Object.defineProperties(globalThis, {
  document: { configurable: true, value: dom.window.document },
  navigator: { configurable: true, value: dom.window.navigator },
  window: { configurable: true, value: dom.window },
})
globalThis.IS_REACT_ACT_ENVIRONMENT = true
globalThis.fetch = async () => {
  throw new Error('consumer fetch failed')
}

const container = document.querySelector('#root')
const root = createRoot(container)
let refDetachCalls = 0
const supportsRefCleanup = reactVersion.startsWith('19.')
const buttonRef = (element) => {
  if (element && supportsRefCleanup) {
    return () => {
      refDetachCalls += 1
    }
  }
  if (!element) refDetachCalls += 1
}

await act(async () => {
  root.render(
    createElement(
      StrictMode,
      null,
      createElement(Button, { ref: buttonRef }, 'Echo UI client consumer'),
      createElement(HookConsumer),
    ),
  )
})
assert.match(container.innerHTML, /Echo UI client consumer/)

const originalConsoleError = console.error
console.error = () => {}
try {
  await act(async () => {
    await fetchAudio()
  })
} finally {
  console.error = originalConsoleError
}
assert.match(container.innerHTML, /Hook error/)
assert.ok(onErrorCalls >= 1)

await act(async () => {
  root.unmount()
})
assert.ok(refDetachCalls >= 1)

console.log(JSON.stringify({ markup, reactDomVersion, reactVersion }))
`,
    )

    execFileSync(
      'pnpm',
      ['install', '--frozen-lockfile=false', '--ignore-scripts', '--strict-peer-dependencies'],
      { cwd: consumerDirectory, stdio: 'pipe' },
    )
    execFileSync('pnpm', ['exec', 'tsc'], { cwd: consumerDirectory, stdio: 'pipe' })
    const result = JSON.parse(
      execFileSync(process.execPath, ['render.mjs'], {
        cwd: consumerDirectory,
        encoding: 'utf8',
      }).trim(),
    )

    assert.equal(result.reactVersion, reactVersion)
    assert.equal(result.reactDomVersion, reactVersion)
    console.log(`React ${reactVersion} consumer installed and rendered Echo UI.`)
  }
} finally {
  await rm(consumerRoot, { force: true, recursive: true })
}
