# CI repair handoff 1

- Run ID: `20260724T132107Z-issue-108-743034`
- Draft PR: https://github.com/codeacme17/echo-ui/pull/111
- Failed workflow run: https://github.com/codeacme17/echo-ui/actions/runs/30122020412
- Reviewed candidate head: `8ddb38818164f6b0b0d77b236c0dd3fb6cf2a626`
- Frozen base: `9eea05360a90e46a4c66c2e821e9ad5bd6c71c67`
- Prior implementation commit: `b15cded4fb9fa319bb35e56a70a4401cbf1d0e33`

## Failure classification

The low-privilege evidence workflow failed before candidate tests:

1. `validate-candidate-control-plane.mjs` rejected changes to the protected
   verification plane:
   - `scripts/capture-docs-evidence.mjs`
   - `scripts/create-docs-redirects.mjs`
   - `scripts/verify-docs-ui.mjs`
   - `scripts/verify-nextra-output.mjs`
2. `generate-evidence.mjs` rejected the screenshot metadata because every
   `(scenario, route, viewport)` tuple must contain both a `before` and an `after`
   phase.

These are accepted CI findings. They do not authorize weakening the frozen issue
acceptance criteria or modifying the loop/control/workflow/package plane.

## Required repair

1. Restore every file under root `scripts/` to the frozen-base version. The final
   exact-head diff must contain no root `scripts/` changes.
2. Preserve the equivalent deterministic Island comparison in allowed product/test
   paths such as `tests/`, `docs/visual-baselines/`, and documentation components.
   `pnpm verify` must continue to execute the maintained contract through the
   existing test command without changing package manifests or verification config.
3. Preserve root `/` → `/en/` behavior without modifying
   `scripts/create-docs-redirects.mjs`. Use an allowed documentation application
   implementation and add allowed tests that prove both runtime and exported
   behavior available from the unchanged build pipeline.
4. Reorganize committed screenshots under:
   - `screen-shots/20260724T132107Z-issue-108-743034/before/`
   - `screen-shots/20260724T132107Z-issue-108-743034/after/`
5. Add or update the screenshot metadata consumed by the existing evidence
   generator. Every entry must contain `name`, `scenario`, `route`, `viewport`,
   `phase`, `capturedAt`, and the correct `sourceSha`. Every scenario/route/viewport
   key must have one meaningful frozen-base before image and one exact
   implementation after image. Do not treat historical migration previews as
   acceptance pairs.
6. Keep the PR Draft. Do not push, update/create a PR, mark Ready, approve, or
   merge.

## Required checks

- Targeted tests for the parity contract, example frame, route inventory, root
  redirect, and screenshot metadata.
- `pnpm lint`
- `pnpm typecheck:docs`
- `pnpm build:docs`
- `pnpm test:docs`
- `pnpm verify`
- After the repair commit exists, run the trusted candidate-control validator
  against frozen base and the new exact HEAD; it must report no protected paths.

## Result contract

Commit the repair locally as a descendant of the current branch. Write, but do not
commit,
`loops/issue-dev-loop/logs/runs/20260724T132107Z-issue-108-743034/implementation-result-2.json`
matching `schemas/implementation-result.schema.json`. Bind it to the original frozen
brief digest `3cfea23d657797a80267c52400c3844b534417a8ecdf26620174af40dbaf0ed6`,
the new repair commit, and every passed check including `pnpm verify`.

Stop after the local commit and result file.
