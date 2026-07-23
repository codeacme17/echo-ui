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
- `ECHO_UI_LOOP_CONTROL_PLANE` pointing to the installed `issue-dev-loop` control-plane directory outside every repository worktree
- `ECHO_UI_LOOP_TARGET_ROOT` pointing to the active worktree's `loops/issue-dev-loop` directory
- Repository trust enabled so project `.codex` agents can load
- A dedicated GitHub issue configured as `stateIssueNumber` for append-only active checkpoints and finalization records

## Optional

- `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` for an immediate JSON webhook mirror
- Browser access for UI verification and screenshot collection

## Identity

Use `Ethandasw` for executor-created branches, PRs, replies, and durable journal entries, and `Traviinam` for fresh-context review publication. Neither may be `codeacme17`; neither may have branch-protection bypass or merge authority. The executor needs repository write access. The reviewer needs no repository write access.

After this loop is owner-reviewed and merged, update a clean `dev` checkout to the exact `origin/dev` commit and install a new versioned control plane:

```bash
node loops/issue-dev-loop/scripts/install-trusted-control-plane.mjs \
  --target "/absolute/path/outside-the-repository/echo-ui-loop-<dev-sha>"
export ECHO_UI_LOOP_CONTROL_PLANE="/absolute/path/outside-the-repository/echo-ui-loop-<dev-sha>/issue-dev-loop"
export ECHO_UI_LOOP_TARGET_ROOT="$PWD/loops/issue-dev-loop"
```

The installer refuses a dirty checkout, a branch other than `dev`, a commit other than `origin/dev`, an in-repository target, or an existing target. It pins absolute Node/Git/GitHub CLI executables, copies the owner channel and runtime, hashes every installed file, and makes the bundle read-only. Install updates only after an owner-merged loop-control change; never install control code from an issue branch.

Never run `gh auth setup-git` for this loop. Route commands through `"$ECHO_UI_LOOP_CONTROL_PLANE/scripts/with-github-identity" --loop-root "$ECHO_UI_LOOP_TARGET_ROOT" <role> -- ...`. The repository copy is installer source and intentionally refuses credential use. The installed launcher verifies its manifest before selecting an identity, removes Node preload hooks, scopes `GH_CONFIG_DIR` and the Git credential helper to one allowlisted child tree, gates descendant `git`/`gh` calls, and leaves the user's default `gh` account and global Git credential configuration unchanged.
