---
name: issue-dev-loop
description: Run one auditable Echo UI issue-development cycle from `codex-ready` issue selection through implementation, independent PR review, verification, owner notification, and owner-only merge. Use when Codex is scheduled to maintain Echo UI, explicitly asked to run the issue loop, or resuming an active loop-created PR. Do not use for releases, direct changes to main, or work without an eligible GitHub issue.
---

# Echo UI issue development loop

Run exactly one bounded issue cycle. Treat [`LOOP.md`](./LOOP.md) as the constitution and [`state.md`](./state.md) as the current durable state.

## Start safely

1. Read `LOOP.md`, `state.md`, and `dependencies.md` completely.
2. Run `node loops/issue-dev-loop/scripts/loopctl.mjs validate`.
3. Run the cheap trigger in `triggers/detect-work.mjs`. Exit without invoking an implementation agent when it reports `hasWork: false`.
4. Refuse to start when another active run or PR already claims the issue.
5. Create a `codex/issue-<number>` branch and an isolated worktree from `dev`.
6. Start the run with `loopctl.mjs start` and freeze the generated `implementation-brief.md` before implementation.

Read [`references/github-operations.md`](./references/github-operations.md) for GitHub mutations and [`references/evidence-policy.md`](./references/evidence-policy.md) before verification or PR publication.

## Implement through `$implement`

For every run that changes product code, explicitly invoke `$implement` with the frozen handoff path. The orchestrator must not implement the issue itself.

Provide `$implement` with:

- the absolute handoff path
- the isolated worktree and current branch
- pre-agreed TDD seams
- required targeted checks and final `pnpm verify`
- an instruction to stop after committing; `$implement` must not push or create a PR

Record the resulting commit SHA and validation summary in the run log.

## Publish a draft PR

Push only the issue branch and create a **draft** PR targeting `dev`. Include the issue, risk assessment, test results, evidence manifest, screenshots, known limitations, run ID, and exact head SHA. Never target `main` from an issue branch.

## Run independent review

After the draft PR exists, spawn the project agent `echo_ui_pr_reviewer` with a fresh context. Give it only the issue snapshot, acceptance criteria, repository instructions, base SHA, head SHA, diff, CI results, and evidence manifest. Do not give it executor conversation history or rationale.

Post the reviewer's findings verbatim as one review plus inline comments. Each finding needs a stable ID, severity, confidence, evidence, and expected resolution. Follow `review/REVIEW.md` and `review/response-policy.md`.

The executor must classify every finding as `accepted`, `rejected`, `needs-human`, `stale`, or `already-fixed`:

- Reinvoke `$implement` for accepted findings, then reply with commit and test evidence.
- Reply to rejected findings with reproducible evidence, never bare disagreement.
- Send disputed P0/P1 findings to `echo_ui_review_adjudicator` or the owner.
- Allow at most two automated repair/review rounds.

## Verify and notify the owner

Run verification appropriate to the change and require `pnpm verify` before the PR is ready for owner review. Collect evidence under the run ID and validate its manifest. Mark the PR ready, request review from `codeacme17`, emit a `pr_ready_for_review` notification, and transition to `awaiting_owner_review`.

The owner is the only actor allowed to approve or merge. Never call `gh pr merge`, enable auto-merge, push to `main`, push to `dev`, dismiss owner feedback, or bypass branch protections. A run becomes `completed` only after observing the owner's merge event.

## Stop conditions

Stop and notify the owner immediately when:

- acceptance criteria are materially ambiguous
- a breaking public API, new production dependency, secret, release, or security decision is required
- the same implementation or review step fails twice
- no fresh-context reviewer is available
- a P0/P1 review dispute remains
- required verification cannot run
- notification delivery for a blocking event fails

Do not manufacture work, rewrite accurate documentation, weaken tests, or silently expand scope to keep a run active.
