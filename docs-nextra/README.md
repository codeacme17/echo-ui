# Echo UI Nextra documentation

This workspace runs beside the IslandJS documentation while content is migrated incrementally. It currently owns the bilingual landing, introduction, installation, declaration, and about experience. From the repository root:

```bash
pnpm dev:docs:nextra
pnpm build:docs:nextra
```

## Routes

English pages live under `/en/`, and their Chinese counterparts use the same path below `/zh/`. Keeping the route structures aligned lets Nextra's locale switch preserve the current page.

After a build, verify representative routes, localized navigation, page metadata, edit links, and internal assets with:

```bash
pnpm test:docs:nextra
```

The static export targets `https://echoui.dev` at the site root by default. For path-based preview hosting, set an absolute path without a trailing slash before building:

```bash
DOCS_BASE_PATH=/echo-ui pnpm build:docs:nextra
```

`nextra` and `nextra-theme-docs` are intentionally pinned together at 4.6.0. Version 4.6.1 moved the theme to stable Zod 4 without updating its `Layout` validation, causing every page render to fail because `children` is removed before the required schema is parsed.
