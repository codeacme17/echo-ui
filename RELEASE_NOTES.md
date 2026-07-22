# Echo UI 1.1.0 release notes

Echo UI 1.1.0 is the coherent release of the package, build, documentation, React, Tailwind, and audio modernization work completed in issues #76–#87.

## Supported versions

| Contract                  | Verified version or range                  |
| ------------------------- | ------------------------------------------ |
| Runtime                   | Node.js 24 and pnpm 10.22.0                |
| React peers               | React and React DOM `^18.2.0 \|\| ^19.0.0` |
| Installed React consumers | React 18.3.1 and React 19.2.8              |
| Styling                   | Tailwind CSS 3.4.19 and Tailwind CSS 4.3.3 |
| Documentation             | Next.js 16.2.10 and Nextra 4.6.0           |
| Audio                     | Tone.js 15.1.22                            |

## Consumer migration

### React

Applications may remain on React 18 or move to React 19. React and React DOM must use matching versions. They remain peer dependencies and are externalized from Echo UI's ESM and UMD bundles, so consumers provide one React runtime. React 19 callback-ref cleanup is supported without dropping React 18 callback refs.

The production library build intentionally uses the classic JSX runtime with Vite `React` injection while keeping React external. This documented compatibility bridge lets the same compiled artifact run with React 18 and React 19; the artifact audit also verifies that no `react/jsx-runtime` implementation is embedded.

### Tailwind CSS

Tailwind CSS 4 is the recommended path. Import `tailwindcss` and `@nafr/echo-ui/theme.css`, add `@source "../node_modules/@nafr/echo-ui/dist"`, and enable `@tailwindcss/vite`.

Tailwind CSS 3 remains supported. Import the published theme before the three Tailwind layers, scan `node_modules/@nafr/echo-ui/dist/**/*.{js,cjs}`, and import `theme` from `@nafr/echo-ui/tailwind-theme`. When moving from Tailwind 3 to 4, review the changed shadow, outline, border, radius, palette, and transition semantics described in the installation guide.

### Documentation

The documentation application now uses Nextra instead of IslandJS. IslandJS and NextUI packages, build commands, and generated output are no longer part of the repository. The only documentation compatibility bridge is the generated set of legacy documentation redirects from the old component and Hook URLs to their localized Nextra routes.

### Tone.js

Tone.js 15.1.22 replaces Tone 14 throughout the package and examples. Tone is a direct dependency because public Hook declarations expose Tone types, but it is externalized from the ESM and UMD bundles so an application resolves one Tone runtime. Consumers importing Tone directly should use `^15.1.22`. Player restart/stop behavior, analyser return shapes, multichannel meters, envelope/LFO scheduling, and node disposal have all been migrated and browser-tested.

## Published artifact

The package exports the ESM and UMD library entries, declarations, `style.css`, `theme.css`, and the Tailwind 3 theme module. The legacy npm metadata fields `main`/`module`/`types`/`style` mirror those explicit exports. CSS is the only declared side effect. React, React DOM, and Tone stay outside the bundles; all other runtime implementation dependencies are packaged through the bundle.

## Release verification

From a clean checkout on the supported runtime:

```bash
corepack enable
pnpm verify:frozen
```

The frozen gate installs the lockfile and verifies lint, type declarations, unit tests, packed React and Tailwind consumers, the published artifact contract, production library/example/Nextra builds, internal documentation links, and representative browser audio lifecycles.
