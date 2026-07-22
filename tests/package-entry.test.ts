import { execFileSync } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { build } from 'vite'
import { describe, expect, it } from 'vitest'

type PackageManifest = {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  exports: {
    '.': {
      import: string
      require: string
      types: string
    }
    './style.css': string
    './theme.css': string
    './tailwind-theme': {
      import: string
      types: string
    }
  }
  files: string[]
  main: string
  module: string
  peerDependencies: Record<string, string>
  sideEffects: string[]
  style: string
  types: string
}

const packageRoot = resolve(import.meta.dirname, '..')

describe('published package', () => {
  it('develops on React 19 while supporting React 18 and 19 consumers', async () => {
    const [manifest, exampleManifest, nextraManifest] = await Promise.all(
      ['package.json', 'example/package.json', 'docs/package.json'].map(
        async (path) =>
          JSON.parse(await readFile(resolve(packageRoot, path), 'utf8')) as PackageManifest,
      ),
    )

    expect({
      peerReact: manifest.peerDependencies.react,
      peerReactDom: manifest.peerDependencies['react-dom'],
      development: [
        manifest.devDependencies,
        exampleManifest.dependencies,
        nextraManifest.dependencies,
      ].map((dependencies) => ({
        react: dependencies.react,
        reactDom: dependencies['react-dom'],
      })),
      typeDevelopment: [
        manifest.devDependencies,
        exampleManifest.devDependencies,
        nextraManifest.devDependencies,
      ].map((dependencies) => ({
        react: dependencies['@types/react'],
        reactDom: dependencies['@types/react-dom'],
      })),
    }).toEqual({
      peerReact: '^18.2.0 || ^19.0.0',
      peerReactDom: '^18.2.0 || ^19.0.0',
      development: Array(3).fill({ react: '19.2.8', reactDom: '19.2.8' }),
      typeDevelopment: Array(3).fill({ react: '^19.2.17', reactDom: '^19.2.3' }),
    })
  })

  it('publishes runtime, declaration, and style entrypoints', async () => {
    const manifest = JSON.parse(
      await readFile(resolve(packageRoot, 'package.json'), 'utf8'),
    ) as PackageManifest
    const expectedEntries = {
      main: 'dist/echo-ui.umd.cjs',
      module: 'dist/echo-ui.js',
      style: 'dist/echo-ui.css',
      types: 'dist/types/packages/main.d.ts',
    }
    const expectedThemeEntries = {
      tailwindTheme: 'dist/packages/tailwind-theme.js',
      tailwindThemeTypes: 'dist/types/packages/tailwind-theme.d.ts',
      theme: 'dist/theme.css',
    }

    expect({
      entries: {
        main: manifest.main,
        module: manifest.module,
        style: manifest.style,
        types: manifest.types,
      },
      exports: manifest.exports,
      files: manifest.files,
      sideEffects: manifest.sideEffects,
    }).toEqual({
      entries: expectedEntries,
      exports: {
        '.': {
          import: `./${expectedEntries.module}`,
          require: `./${expectedEntries.main}`,
          types: `./${expectedEntries.types}`,
        },
        './style.css': `./${expectedEntries.style}`,
        './theme.css': `./${expectedThemeEntries.theme}`,
        './tailwind-theme': {
          import: `./${expectedThemeEntries.tailwindTheme}`,
          types: `./${expectedThemeEntries.tailwindThemeTypes}`,
        },
      },
      files: ['dist', 'RELEASE_NOTES.md'],
      sideEffects: ['**/*.css'],
    })

    await Promise.all(
      [...Object.values(expectedEntries), ...Object.values(expectedThemeEntries)].map((entry) =>
        access(resolve(packageRoot, entry)),
      ),
    )

    expect(await readFile(resolve(packageRoot, expectedEntries.style), 'utf8')).toContain(
      '--echo-primary',
    )
    expect(await readFile(resolve(packageRoot, expectedThemeEntries.theme), 'utf8')).toContain(
      '@theme inline',
    )
  })

  it('loads representative ESM exports in Node', async () => {
    const echoUi = await import('@nafr/echo-ui')

    expect({
      Button: typeof echoUi.Button,
      buttonMarkup: renderToStaticMarkup(createElement(echoUi.Button, null, 'Play')),
      useFetchAudio: typeof echoUi.useFetchAudio,
    }).toMatchObject({
      Button: 'object',
      buttonMarkup: expect.stringContaining('Play'),
      useFetchAudio: 'function',
    })
  })

  it('loads representative CommonJS exports in Node', () => {
    const output = execFileSync(
      process.execPath,
      [
        '-e',
        "const React = require('react'); const { renderToStaticMarkup } = require('react-dom/server'); const echoUi = require('@nafr/echo-ui'); const buttonMarkup = renderToStaticMarkup(React.createElement(echoUi.Button, null, 'Play')); setImmediate(() => console.log(JSON.stringify({ Button: typeof echoUi.Button, buttonMarkup, useFetchAudio: typeof echoUi.useFetchAudio })))",
      ],
      { cwd: packageRoot, encoding: 'utf8' },
    )
    const exportSummary = JSON.parse(output.trim().split('\n').at(-1)!)

    expect(exportSummary).toMatchObject({
      Button: 'object',
      buttonMarkup: expect.stringContaining('Play'),
      useFetchAudio: 'function',
    })
  })

  it('typechecks a consumer against the published declarations', () => {
    const program = ts.createProgram({
      rootNames: [resolve(packageRoot, 'tests/fixtures/package-consumer.ts')],
      options: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        noEmit: true,
        skipLibCheck: true,
        strict: true,
        target: ts.ScriptTarget.ES2022,
      },
    })
    const errors = ts
      .getPreEmitDiagnostics(program)
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))

    expect(errors).toEqual([])
  })

  it('builds a consumer of the published style entry', async () => {
    const result = await build({
      build: {
        rolldownOptions: {
          input: resolve(packageRoot, 'tests/fixtures/package-style-consumer.js'),
        },
        write: false,
      },
      configFile: false,
      logLevel: 'silent',
      root: packageRoot,
    })
    const outputs = (Array.isArray(result) ? result : [result]).flatMap(
      (buildResult) => buildResult.output,
    )
    const styleAsset = outputs.find(
      (output) => output.type === 'asset' && output.fileName.endsWith('.css'),
    )
    const styleSource =
      styleAsset?.type === 'asset' && typeof styleAsset.source === 'string'
        ? styleAsset.source
        : undefined

    expect(styleSource).toContain('--echo-primary')
  })

  it('keeps the React JSX runtime external to both bundles', async () => {
    const bundles = await Promise.all(
      ['dist/echo-ui.js', 'dist/echo-ui.umd.cjs'].map((entry) =>
        readFile(resolve(packageRoot, entry), 'utf8'),
      ),
    )

    for (const bundle of bundles) {
      expect(bundle.includes('react-jsx-runtime.production.min.js')).toBe(false)
      expect(bundle.includes('react-jsx-runtime.development.js')).toBe(false)
    }
  })

  it('publishes Tone 15 types while using the consumer Tone runtime', async () => {
    const [manifest, exampleManifest, esmBundle, umdBundle] = await Promise.all([
      readFile(resolve(packageRoot, 'package.json'), 'utf8').then(
        (source) => JSON.parse(source) as PackageManifest,
      ),
      readFile(resolve(packageRoot, 'example/package.json'), 'utf8').then(
        (source) => JSON.parse(source) as PackageManifest,
      ),
      readFile(resolve(packageRoot, 'dist/echo-ui.js'), 'utf8'),
      readFile(resolve(packageRoot, 'dist/echo-ui.umd.cjs'), 'utf8'),
    ])

    expect(manifest.dependencies.tone).toBe('^15.1.22')
    expect(exampleManifest.dependencies.tone).toBe('^15.1.22')
    expect(esmBundle).toMatch(/from ["']tone["']/)
    expect(umdBundle).toMatch(/require\(["']tone["']\)/)
    expect(esmBundle).not.toContain('standardized-audio-context')
    expect(umdBundle).not.toContain('standardized-audio-context')
  })
})
