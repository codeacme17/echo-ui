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
- Repository trust enabled so project `.codex` agents can load
- A dedicated GitHub issue configured as `stateIssueNumber` for append-only active checkpoints and finalization records

## Optional

- `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` for an immediate JSON webhook mirror
- Browser access for UI verification and screenshot collection

## Identity

Use one dedicated GitHub App or bot identity for executor-created branches, PRs, replies, and durable journal entries, plus a distinct reviewer identity for the fresh-context review publication. Neither may be `codeacme17`; neither may have branch-protection bypass or merge authority. Configure their exact logins and the dedicated state-journal issue number in the shared owner channel before enabling automation.
