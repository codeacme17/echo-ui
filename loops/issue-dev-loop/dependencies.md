# Runtime dependencies

## Required

- Codex with project skills and subagents enabled
- Project agents `echo_ui_pr_reviewer`, `echo_ui_review_adjudicator`, and `echo_ui_loop_evolver`
- `$implement` available for all product-code changes
- `$code-review` available to `$implement` and the independent reviewer
- Node.js 24
- pnpm 10
- Git
- GitHub CLI (`gh`) authenticated for issue, Actions artifact download, branch, PR, review, and comment work
- `ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR` pointing to the executor's dedicated `gh` profile
- `ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR` pointing to the reviewer's dedicated `gh` profile
- Repository trust enabled so project `.codex` agents can load
- A dedicated GitHub issue configured as `stateIssueNumber` for append-only active checkpoints and finalization records

## Optional

- `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` for an immediate JSON webhook mirror
- Browser access for UI verification and screenshot collection

## Identity

Use `Ethandasw` for executor-created branches, PRs, replies, and durable journal entries, and `Traviinam` for fresh-context review publication. Neither may be `codeacme17`; neither may have branch-protection bypass or merge authority. The executor needs repository write access. The reviewer needs no repository write access.

Never run `gh auth setup-git` for this loop. Route commands through `scripts/with-github-identity.mjs`; it scopes `GH_CONFIG_DIR` and the Git credential helper to one allowlisted child tree, gates descendant `git`/`gh` calls, and leaves the user's default `gh` account and global Git credential configuration unchanged.
