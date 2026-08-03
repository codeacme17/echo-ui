# Review repair handoff 1

- Run ID: `20260724T132107Z-issue-108-743034`
- Issue: https://github.com/codeacme17/echo-ui/issues/108
- Draft PR: https://github.com/codeacme17/echo-ui/pull/111
- Frozen base: `9eea05360a90e46a4c66c2e821e9ad5bd6c71c67`
- Frozen brief digest: `3cfea23d657797a80267c52400c3844b534417a8ecdf26620174af40dbaf0ed6`
- Current Draft head: `c5100509fb33fc68ff36089c92cfb43c2ab22424`
- Prior recorded implementation commit: `4b9818f7c2a77f4dea87c4eceb188bd41facb367`
- Review: https://github.com/codeacme17/echo-ui/pull/111#pullrequestreview-4779373856
- Review submitted: `2026-07-25T14:04:06Z`

PR #111 has been returned to Draft by the owner. Ethandasw classifies all six
round-one findings as `accepted`. There is no disputed P0/P1 finding and no owner
product decision is required for the repairs below.

Read the immutable implementation brief at
`loops/issue-dev-loop/handoffs/20260724T132107Z-issue-108-743034/implementation-brief.md`
before changing code. Preserve every frozen acceptance criterion and stop condition.

## Required repairs

### RVW-1-1-1 — P1 — remove the verifier shim

- Remove `LegacyVerifierBridge` and every hidden sentinel DOM node or import used
  to satisfy the legacy verifier.
- Synchronize root `scripts/verify-docs-ui.mjs` exactly to the owner-merged
  `origin/dev` tree entry. Its required blob is
  `8eef39bca71e2b3c66fb6a97d480298a0e4315a1`; do not hand-edit or diverge from
  that blob.
- Prove the shipped UI has no `[data-legacy-verifier]` element and that the real
  Nextra footer/sidebar behavior satisfies the maintained contract.
- Do not modify any other protected control, workflow, package, or verification
  file.

### RVW-1-1-2 — P1 — restore equivalent live variants

- Restore the Knob Rotation Angle Range example with the equivalent 360°, 270°,
  and 180° controls.
- Replace the fixed Spectrogram EQ3 placeholder with lifecycle-safe interactive
  LOW/MID/HIGH controls and a real audio action matching the preserved Island
  scenario while retaining current Tone.js 15 and accessibility behavior.
- Add interaction coverage for both repaired examples.

### RVW-1-1-3 — P2 — document actual Input data attributes

- Document the runtime-authoritative `data-bilateral` values and semantics. A
  default Input emits `positive`; bilateral direction may emit `positive` or
  `negative`. Do not claim the value is `false` when runtime never emits it.
- Add a runtime-rendered assertion covering the default and bilateral states.

### RVW-1-1-4 — P2 — make group examples interactive

- Back Button, Checkbox, and Radio controlled group previews with local state and
  `onChange`, preserving accessible labels.
- Ensure the adjacent copied source uses the same functional controlled pattern.
- Add interaction tests proving selection changes.

### RVW-1-1-5 — P2 — prevent preview/source drift

- Make the Switch Custom Styling source reproduce its actual preview.
- Make the VU Meter custom-color preview and source target runtime-emitted
  `data-active` values (`none`, `low`, `medium`, or `high`), never `true`.
- Prefer a shared descriptor or another single source of truth for rendering and
  displayed source where practical.
- Add source/render or computed-style assertions that fail on drift.

### RVW-1-1-6 — P2 — bind inventory to every localized route

- Add route-bound or rendered assertions for every component page in English and
  Chinese.
- Verify that each route mounts its expected variant matrix and exposes the
  expected labels/count, rather than testing only the shared data object or a few
  representative routes.

## TDD and verification

Write or strengthen failing tests at each seam before implementation. Run focused
tests during development, then all of the following before committing:

- targeted Vitest tests for component variants, group interactions, runtime data
  attributes, source/preview parity, and bilingual route inventory
- `pnpm lint`
- `pnpm typecheck:docs`
- `pnpm build:docs`
- `pnpm test:docs`
- `pnpm verify`
- `$code-review` against the resulting diff, resolving actionable findings before
  the final commit

Do not weaken, delete, or skip a failing test. Do not add a production dependency,
change package/runtime API, alter release behavior, or expand beyond the frozen
brief. Stop and report if any such decision becomes necessary.

## Commit and result contract

Commit the repair locally on `codex/issue-108` as a descendant of
`c5100509fb33fc68ff36089c92cfb43c2ab22424`. Stage only the repair's product,
documentation, test, and exact allowlisted verifier-sync paths; do not include
restored checkpoint files or unrelated changes.

After committing, write but do not commit:

`loops/issue-dev-loop/logs/runs/20260724T132107Z-issue-108-743034/implementation-result-3.json`

It must match `schemas/implementation-result.schema.json`, use `agent: "$implement"`,
contain a unique invocation ID and ordered UTC timestamps, bind the frozen brief
digest and new 40-character commit SHA, and list every passed check including the
exact `pnpm verify` command.

Stop after the local commit and result file. Do not push, update the PR, post
comments, mark Ready, approve, or merge. Screenshot/evidence rebinding to the new
implementation commit will be handled after `record-implementation`.
