---
name: issue-dev-loop
description: Run one auditable Echo UI issue-development cycle from `codex-ready` issue selection through implementation, independent PR review, verification, owner notification, and owner-only merge. Use when Codex is scheduled to maintain Echo UI, explicitly asked to run the issue loop, or resuming an active loop-created PR. Do not use for releases, direct changes to main, or work without an eligible GitHub issue.
---

# Echo UI issue development loop

Run exactly one bounded issue cycle. Treat [`LOOP.md`](./LOOP.md) as the constitution and [`state.md`](./state.md) as the current durable state.

## Start safely

1. Read `LOOP.md`, `state.md`, and `dependencies.md` completely.
2. Run `node loops/issue-dev-loop/scripts/loopctl.mjs validate`. Scheduled activation additionally requires `validate --activation`, which rejects missing or overlapping owner/executor/reviewer identities.
3. Run `loopctl.mjs reconcile` to rebuild terminal history and discover active runs from the append-only GitHub state journal. For returned `workType: resume`, fetch the recorded branch, create a clean isolated worktree at the returned exact head, and run `restore-checkpoint --run-id <id>` inside that worktree. The restore command rejects the wrong branch, a dirty checkout, or any head other than the durable head. Resume it before selecting a new issue.
4. Run `loopctl.mjs evolve-status`. If `evolveDue` is true, start `echo_ui_loop_evolver` with fresh context; do not silently replace it with product work.
5. Run the cheap trigger in `triggers/detect-work.mjs`. Exit without invoking an implementation agent when it reports `hasWork: false`.
6. Refuse to start when another active run or PR already claims the issue.
7. Create a `codex/issue-<number>` branch and an isolated worktree from `dev`.
8. Start the run with `loopctl.mjs start --issue <number> --title <title> --url <issue-url> --base-sha <full-origin-dev-sha>`.
9. Complete `handoffs/<run-id>/implementation-brief.md`, set `UI evidence required` to `yes` or `no`, then run `loopctl.mjs freeze-brief --run-id <id>` before implementation. Never edit the frozen brief afterward.

After `start`, `freeze-brief`, every `record-implementation`, every `record-pr`, every review/evidence gate, and every pause transition, run `prepare-checkpoint`, publish its exact body to the state-journal issue through the automation identity, and validate it with `record-checkpoint`. The next phase re-fetches that exact automation-authored comment and rejects a missing, edited, stale, or locally forged checkpoint. These compact checkpoints let a verified fresh worktree restore the run, frozen brief, and validated event chain instead of abandoning an already-claimed issue or open PR.

Read [`references/github-operations.md`](./references/github-operations.md) for GitHub mutations and [`references/evidence-policy.md`](./references/evidence-policy.md) before verification or PR publication.

## Implement through `$implement`

For every run that changes product code, explicitly invoke `$implement` with the frozen handoff path. The orchestrator must not implement the issue itself.

Provide `$implement` with:

- the absolute handoff path
- the isolated worktree and current branch
- pre-agreed TDD seams
- required targeted checks and final `pnpm verify`
- an instruction to stop after committing; `$implement` must not push or create a PR

Require `$implement` to write a unique `logs/runs/<run-id>/implementation-result-<sequence>.json` matching `schemas/implementation-result.schema.json`. It records the invocation ID and time range, frozen brief digest, resulting commit SHA, and passed checks including `pnpm verify`. Then run `loopctl.mjs record-implementation --run-id <id> --result <absolute-path>`. Repeated `$implement` repair invocations use new result files and must advance from the previously recorded implementation commit. After that commit, only this run's handoff, log, screenshot, and evidence files may be added before the PR head; `record-pr` rejects every trailing product-code path.

## Publish a draft PR

Push only the issue branch and create a **draft** PR targeting `dev` using `templates/pr-body.md`; preserve its machine-readable run marker and owner-only merge statement. Bind it immediately with `loopctl.mjs record-pr --run-id <id> --pr-url <url> --head-sha <full-sha>`. Include the issue, risk assessment, test results, evidence manifest, screenshots, known limitations, run ID, and exact head SHA. Never target `main` from an issue branch.

## Run independent review

After the draft PR exists, spawn the project agent `echo_ui_pr_reviewer` with a fresh context. Give it only the issue snapshot, acceptance criteria, repository instructions, base SHA, head SHA, diff, CI results, and evidence manifest. Do not give it executor conversation history or rationale.

Publish every round through the separately configured `reviewerGitHubLogin`; the executor identity may not author it. Post findings verbatim as one review plus inline comments. Each finding needs a stable ID, severity, confidence, evidence, and expected resolution. Record the GitHub review URL for each round. Accepted repairs must start after that round was submitted, and executor replies must be posted after the corresponding `$implement` invocation finishes. Follow `review/REVIEW.md` and `review/response-policy.md`.

The executor must classify every finding as `accepted`, `rejected`, `needs-human`, `stale`, or `already-fixed`:

- Reinvoke `$implement` for accepted findings, then reply with commit and test evidence.
- Reply to rejected findings with reproducible evidence, never bare disagreement.
- Send disputed P0/P1 findings to `echo_ui_review_adjudicator` or the owner.
- Allow at most two automated repair/review rounds.

## Verify and notify the owner

Run verification appropriate to the change and require `pnpm verify` before the PR is ready for owner review. Commit sanitized run metadata and relevant `screen-shots` to the issue branch. Wait for the exact-head `Issue dev loop evidence` workflow, download its artifact, and run `loopctl.mjs record-evidence --run-id <id> --manifest <absolute-path> --publication-url <artifact-url>`. After the fresh reviewer and all comment responses are posted, run `loopctl.mjs record-review --run-id <id> --result <absolute-path> --review-url <github-review-url>`. Both gates must name the current PR head. Emit a blocking `pr_ready_for_review` notification, then transition from `waiting_for_owner` to `awaiting_owner_review` with the PR URL and exact head SHA.

The owner is the only actor allowed to approve or merge. Never call `gh pr merge`, enable auto-merge, push to `main`, push to `dev`, dismiss owner feedback, or bypass branch protections. Before any terminal transition, run `prepare-finalization`, publish its exact body to the configured state-journal issue, and validate the returned comment URL with `record-finalization`. A completed run passes the same result and comment URL to `observe-owner-merge`, which queries GitHub and requires both `codeacme17`'s approval and merge at the reviewed head SHA. Future workspaces run `reconcile` to rebuild local history and evolve metrics from those automation-authored journal comments.

For any pause, do not resume from silence or an arbitrary comment. First require a successfully delivered blocking notification. Then verify the owner's GitHub decision with `loopctl.mjs record-owner-response --run-id <id> --response-url <comment-or-review-url>`. A normal comment must include the exact `RESUME <run-id>` token printed in the notification; a `CHANGES_REQUESTED` review is itself an explicit decision. Only then may `loopctl.mjs transition --run-id <id> --status running` continue product work.

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
