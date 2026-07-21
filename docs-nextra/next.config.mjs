import nextra from 'nextra'

const basePath = process.env.DOCS_BASE_PATH ?? ''

if (basePath && !basePath.startsWith('/')) {
  throw new Error('DOCS_BASE_PATH must be empty or start with a slash.')
}

const withNextra = nextra({
  contentDirBasePath: '/',
  unstable_shouldAddLocaleToLinks: true,
})

export default withNextra({
  assetPrefix: basePath || undefined,
  basePath,
  env: {
    NEXT_PUBLIC_DOCS_BASE_PATH: basePath,
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  transpilePackages: ['@nafr/echo-ui'],
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx',
    },
  },
})
