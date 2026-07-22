# Runtime dependencies

## Required

- Codex with project skills and subagents enabled
- `$implement` available for all product-code changes
- `$code-review` available to `$implement` and the independent reviewer
- Node.js 24
- pnpm 10
- Git
- GitHub CLI (`gh`) authenticated for issue, branch, PR, review, and comment work
- Repository trust enabled so project `.codex` agents can load

## Optional

- `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` for an immediate JSON webhook mirror
- Browser access for UI verification and screenshot collection

## Identity

Prefer a dedicated GitHub App or bot identity for loop-created PRs so the owner can provide an independent approval. The bot must not have branch-protection bypass or merge authority.
