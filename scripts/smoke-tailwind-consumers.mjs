import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join, resolve } from 'node:path'
import { launchBrowser } from './launch-browser.mjs'
import { packLocalPackage } from './pack-local-package.mjs'
import { releaseMatrix } from './release-matrix.mjs'

const packageRoot = resolve(import.meta.dirname, '..')
const consumerRoot = await mkdtemp(join(tmpdir(), 'echo-ui-tailwind-consumers-'))
const servers = []

const consumers = [
  {
    name: 'tailwind-3',
    tailwindVersion: releaseMatrix.tailwind.tested.tailwind3,
    devDependencies: {
      '@vitejs/plugin-react': '6.0.3',
      autoprefixer: '10.5.4',
      postcss: '8.5.21',
      'postcss-import': '15.1.0',
      tailwindcss: releaseMatrix.tailwind.tested.tailwind3,
      vite: '8.1.5',
    },
    files: {
      'postcss.config.js': `export default {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
`,
      'src/index.css': `@import "@nafr/echo-ui/theme.css";
@tailwind base;
@tailwind components;
@tailwind utilities;
`,
      'tailwind.config.js': `import { theme } from '@nafr/echo-ui/tailwind-theme'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nafr/echo-ui/dist/**/*.{js,cjs}',
  ],
  theme,
}
`,
      'vite.config.js': `import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [react()] })
`,
    },
  },
  {
    name: 'tailwind-4',
    tailwindVersion: releaseMatrix.tailwind.tested.tailwind4,
    devDependencies: {
      '@tailwindcss/vite': releaseMatrix.tailwind.tested.tailwind4,
      '@vitejs/plugin-react': '6.0.3',
      tailwindcss: releaseMatrix.tailwind.tested.tailwind4,
      vite: '8.1.5',
    },
    files: {
      'src/index.css': `@import "tailwindcss";
@import "@nafr/echo-ui/theme.css";
@source "../node_modules/@nafr/echo-ui/dist";
`,
      'vite.config.js': `import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [react(), tailwindcss()] })
`,
    },
  },
]

const appSource = `import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  Button,
  Card,
  Checkbox,
  Input,
  Knob,
  Light,
  Radio,
  Switch,
  VuMeter,
} from '@nafr/echo-ui'
import './index.css'

function App() {
  return (
    <main>
      <Button data-testid="button">Button</Button>
      <Input data-testid="input" value={42} />
      <Switch data-testid="switch" toggled>Switch</Switch>
      <Card data-testid="card">Card</Card>
      <Checkbox data-testid="checkbox" checked>Checkbox</Checkbox>
      <Radio data-testid="radio" checked>Radio</Radio>
      <Knob data-testid="knob" value={50} />
      <Light data-testid="light" on />
      <VuMeter data-testid="meter" value={5} hideAxis />
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
`

const startServer = async (directory) => {
  const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
  }
  const server = createServer(async (request, response) => {
    try {
      const pathname = new URL(request.url, 'http://localhost').pathname
      const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1)
      const filePath = join(directory, relativePath)
      response.setHeader(
        'Content-Type',
        contentTypes[extname(filePath)] ?? 'application/octet-stream',
      )
      response.end(await readFile(filePath))
    } catch {
      response.statusCode = 404
      response.end('Not found')
    }
  })
  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen))
  const address = server.address()
  assert.ok(address && typeof address === 'object')
  servers.push(server)
  return `http://127.0.0.1:${address.port}`
}

const readVisualContract = async (page) =>
  page.evaluate(() => {
    const measure = (selector, properties) => {
      const element = document.querySelector(selector)
      if (!element) return null
      const style = getComputedStyle(element)
      return Object.fromEntries(properties.map((property) => [property, style[property]]))
    }

    return {
      button: measure('[data-testid="button"]', [
        'backgroundColor',
        'borderRadius',
        'color',
        'transitionProperty',
      ]),
      card: measure('[data-testid="card"]', [
        'backgroundColor',
        'borderColor',
        'borderRadius',
        'color',
      ]),
      input: measure('[data-testid="input"]', [
        'backgroundColor',
        'borderColor',
        'borderRadius',
        'boxShadow',
        'color',
        'outlineColor',
        'outlineStyle',
        'outlineWidth',
      ]),
      switchButton: measure('[data-testid="switch"] > span:first-child', [
        'backgroundColor',
        'borderRadius',
      ]),
      switchThumb: measure('[data-testid="switch"] > span:first-child > span', [
        'backgroundColor',
        'borderRadius',
        'boxShadow',
      ]),
      checkboxThumb: measure('input[data-testid="checkbox"] + span', [
        'borderRadius',
        'transitionProperty',
      ]),
      radioButton: measure('input[data-testid="radio"]', ['borderRadius']),
      radioThumb: measure('input[data-testid="radio"] + span', [
        'borderRadius',
        'transitionProperty',
      ]),
      knobProgress: measure('[data-testid="knob"] > div > div:first-child', ['borderRadius']),
      knobPointer: measure('[data-testid="knob"] [role="slider"] > div', ['boxShadow']),
      lightGlass: measure('[data-testid="light"] > div', ['borderRadius']),
      meterLow: measure('[data-testid="meter"] [data-active="low"]', ['backgroundColor']),
      meterMedium: measure('[data-testid="meter"] [data-active="medium"]', ['backgroundColor']),
      meterHigh: measure('[data-testid="meter"] [data-active="high"]', ['backgroundColor']),
    }
  })

let browser
try {
  const archivePath = await packLocalPackage(packageRoot, consumerRoot)

  for (const consumer of consumers) {
    const consumerDirectory = join(consumerRoot, consumer.name)
    await mkdir(join(consumerDirectory, 'src'), { recursive: true })
    await writeFile(
      join(consumerDirectory, 'package.json'),
      `${JSON.stringify(
        {
          name: `echo-ui-${consumer.name}-consumer`,
          private: true,
          type: 'module',
          scripts: { build: 'vite build' },
          dependencies: {
            '@nafr/echo-ui': `file:${archivePath}`,
            react: releaseMatrix.react.workspace,
            'react-dom': releaseMatrix.react.workspace,
          },
          devDependencies: consumer.devDependencies,
        },
        null,
        2,
      )}\n`,
    )
    await writeFile(
      join(consumerDirectory, 'index.html'),
      '<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>\n',
    )
    await writeFile(join(consumerDirectory, 'src/main.jsx'), appSource)
    for (const [path, contents] of Object.entries(consumer.files)) {
      await writeFile(join(consumerDirectory, path), contents)
    }

    execFileSync('pnpm', ['install', '--frozen-lockfile=false', '--ignore-scripts'], {
      cwd: consumerDirectory,
      stdio: 'pipe',
    })
    execFileSync('pnpm', ['build'], { cwd: consumerDirectory, stdio: 'pipe' })

    const assets = await readdir(join(consumerDirectory, 'dist/assets'))
    const cssName = assets.find((entry) => entry.endsWith('.css'))
    assert.ok(cssName, `${consumer.name} build did not emit CSS`)
    const css = await readFile(join(consumerDirectory, 'dist/assets', cssName), 'utf8')
    assert.match(css, /--echo-primary:/, `Echo UI tokens are missing from ${consumer.name}`)
    assert.match(
      css,
      /\.bg-button/,
      `Echo UI component utilities are missing from ${consumer.name}`,
    )
    consumer.url = await startServer(join(consumerDirectory, 'dist'))
  }

  browser = await launchBrowser()
  const contracts = {}
  for (const consumer of consumers) {
    const page = await browser.newPage()
    await page.goto(consumer.url)
    await page.locator('[data-testid="card"]').waitFor()
    await page.waitForTimeout(250)
    const light = await readVisualContract(page)
    await page.evaluate(() => document.documentElement.classList.add('dark'))
    await page.waitForTimeout(250)
    const dark = await readVisualContract(page)
    contracts[consumer.name] = { dark, light }
    await page.close()
    console.log(
      `Tailwind CSS ${consumer.tailwindVersion} consumer built the packed Echo UI package.`,
    )
  }

  assert.deepEqual(
    contracts['tailwind-3'],
    contracts['tailwind-4'],
    'Tailwind 3 and Tailwind 4 changed Echo UI computed styles',
  )
  assert.equal(contracts['tailwind-4'].light.button.backgroundColor, 'rgb(211, 211, 211)')
  assert.equal(contracts['tailwind-4'].light.button.borderRadius, '6px')
  assert.match(contracts['tailwind-4'].light.button.transitionProperty, /\bscale\b/)
  assert.equal(contracts['tailwind-4'].light.card.backgroundColor, 'rgb(218, 218, 218)')
  assert.equal(contracts['tailwind-4'].light.card.borderRadius, '8px')
  assert.equal(contracts['tailwind-4'].light.input.backgroundColor, 'rgb(228, 228, 231)')
  assert.equal(contracts['tailwind-4'].light.input.outlineColor, 'rgba(0, 0, 0, 0)')
  assert.equal(contracts['tailwind-4'].light.input.outlineStyle, 'solid')
  assert.equal(contracts['tailwind-4'].light.input.outlineWidth, '2px')
  assert.equal(contracts['tailwind-4'].dark.button.backgroundColor, 'rgb(38, 38, 38)')
  assert.equal(contracts['tailwind-4'].dark.card.backgroundColor, 'rgb(47, 47, 47)')
  assert.equal(contracts['tailwind-4'].dark.input.backgroundColor, 'rgb(42, 42, 42)')
  assert.match(contracts['tailwind-4'].light.checkboxThumb.transitionProperty, /\bscale\b/)
  assert.equal(contracts['tailwind-4'].light.radioButton.borderRadius, '9999px')
  assert.equal(contracts['tailwind-4'].light.radioThumb.borderRadius, '9999px')
  assert.match(contracts['tailwind-4'].light.radioThumb.transitionProperty, /\bscale\b/)
  assert.equal(contracts['tailwind-4'].light.knobProgress.borderRadius, '9999px')
  assert.notEqual(contracts['tailwind-4'].light.knobPointer.boxShadow, 'none')
  assert.equal(contracts['tailwind-4'].light.lightGlass.borderRadius, '9999px')
  assert.equal(contracts['tailwind-4'].light.meterLow.backgroundColor, 'rgb(245, 158, 11)')
  assert.equal(contracts['tailwind-4'].light.meterMedium.backgroundColor, 'rgb(251, 191, 36)')
  assert.equal(contracts['tailwind-4'].light.meterHigh.backgroundColor, 'rgb(253, 230, 138)')
  assert.equal(contracts['tailwind-4'].dark.meterLow.backgroundColor, 'rgb(217, 119, 6)')
  assert.equal(contracts['tailwind-4'].dark.meterMedium.backgroundColor, 'rgb(245, 158, 11)')
  assert.equal(contracts['tailwind-4'].dark.meterHigh.backgroundColor, 'rgb(252, 211, 77)')
} finally {
  await browser?.close()
  await Promise.all(
    servers.map(
      (server) =>
        new Promise((resolveClose, rejectClose) =>
          server.close((error) => (error ? rejectClose(error) : resolveClose())),
        ),
    ),
  )
  await rm(consumerRoot, { force: true, recursive: true })
}
