# Echo UI issue development loop

This is the loop package's internal agent runbook, retained alongside the contract. It is not a registered top-level Codex skill and must be read by repository path.

Run exactly one bounded issue cycle. Treat [`LOOP.md`](./LOOP.md) as the constitution and [`state.md`](./state.md) as the current durable state.

## Start safely

1. Read `LOOP.md`, `state.md`, and `dependencies.md` completely.
2. Require absolute `ECHO_UI_LOOP_CONTROL_PLANE` and `ECHO_UI_LOOP_TARGET_ROOT` values from the scheduler. Run activation through `"$ECHO_UI_LOOP_CONTROL_PLANE/scripts/with-github-identity" --loop-root "$ECHO_UI_LOOP_TARGET_ROOT" automation -- node "$ECHO_UI_LOOP_CONTROL_PLANE/scripts/loopctl.mjs" validate --activation --loop-root "$ECHO_UI_LOOP_TARGET_ROOT"`. The installed launcher verifies its hash manifest, probes both configured profiles, and attempts full validation first. It may fall back for an older target only after excluding durably finalized runs, matching the worktree to an automation-authored remote active checkpoint, proving the clean event-derived branch and head without index concealment, and proving the issue diff did not modify the protected control or verification plane except for an allowlisted verifier entry exactly matching the installed owner-merged source commit. A one-use in-memory router capability then checks stable target state, owner channel, JSON history, and a conservatively parsed low-privilege evidence workflow before rechecking the exact clean worktree. Activation, detection, and restore share the same event-derived head resolver. There is no standalone reduced validator, and callers and the public validation API cannot request this mode.
3. Read [`references/github-operations.md`](./references/github-operations.md). Run every operational `loopctl`, executor GitHub command, remote Git command, trigger, and reviewer publication through the installed control plane with the explicit target root. Never use the credential-refusing repository launcher, invoke the `.mjs` router directly, install control code from an issue branch, or alter global `gh` or Git credential configuration.
4. Run `loopctl.mjs reconcile` through the automation wrapper to rebuild verified terminal history, pending/completed evolve state, and active runs from the append-only GitHub state journal. It tombstones local terminal-cache rows with no durable counterpart before recomputing metrics. For returned `workType: resume`, fetch the recorded branch through the wrapper, create a clean isolated worktree at the returned exact head, and run `restore-checkpoint --run-id <id>` inside that worktree. The restore command rejects the wrong branch, a dirty checkout, or any head other than the durable head. Resume it before selecting a new issue.
5. Run `loopctl.mjs evolve-status`. If `evolveDue` is true, start `echo_ui_loop_evolver` with fresh context; do not silently replace it with product work.
6. Run the installed `triggers/detect-work.mjs` through the automation wrapper with `--loop-root "$ECHO_UI_LOOP_TARGET_ROOT"`. The detector paginates every open issue and PR page. Exit without invoking an implementation agent when it reports `hasWork: false`. If it returns `workType: claim_recovery`, a remote claim branch exists without a resumable checkpoint or open PR: immediately notify the owner through the scheduled task and canonical owner channel, include the issue and branch, do not invoke `$implement`, and do not delete or reuse the branch without explicit owner confirmation.
7. Refuse to start when another active run or PR already claims the issue.
8. Create a `codex/issue-<number>` branch and an isolated worktree from `dev`.
9. Start the run with `loopctl.mjs start --issue <number> --title <title> --url <issue-url> --base-sha <full-origin-dev-sha>`.
10. Complete `handoffs/<run-id>/implementation-brief.md`, set `UI evidence required` to `yes` or `no`, then run `loopctl.mjs freeze-brief --run-id <id>` before implementation. Never edit the frozen brief afterward.

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

Push only the issue branch and create a **draft** PR targeting `dev` using `templates/pr-body.md`; preserve its machine-readable run marker and owner-only merge statement. Bind it immediately with `loopctl.mjs record-pr --run-id <id> --pr-url <url> --head-sha <full-sha>`. Include the issue, risk assessment, test results, evidence manifest, screenshots, known limitations, run ID, and exact head SHA. For UI work, render at least one representative before/after pair directly in the PR with Markdown images whose `raw.githubusercontent.com` URLs are pinned to that exact head; an index or manifest link alone is insufficient. Never target `main` from an issue branch.

## Run independent review

After the draft PR exists, spawn the project agent `echo_ui_pr_reviewer` with a fresh context. Give it only the issue snapshot, acceptance criteria, repository instructions, base SHA, head SHA, diff, CI results, and evidence manifest. Do not give it executor conversation history or rationale.

Publish every round through the installed wrapper with role `reviewer`; the executor identity may not author it. Every PR write must include `--repo codeacme17/echo-ui` (or use the full configured PR URL). Use `gh pr review --comment --body <body>` for a body-only review and include the exact run/cycle/round/head marker; the gate rejects body files, skipped rounds, duplicates, and publications outside the next durable cycle. When file/line findings require inline comments, use the installed `publish-review.mjs` command through the reviewer wrapper. Give it the recorded PR number and head, cycle and round, inline body text, and one canonical JSON object per comment; the trusted publisher validates every field and submits one exact-head `COMMENT` review. Do not construct nested `gh api` fields directly. Post findings verbatim as one review plus inline comments. Each finding needs a run-wide stable ID, severity, confidence, evidence, expected resolution, and the published GitHub inline comment ID or `null` for a body-only finding. Record the GitHub review URL for each round. Accepted repairs must start after that round was submitted, and executor replies must be posted through the automation wrapper after the corresponding `$implement` invocation finishes. One executor response comment may resolve only one finding. Follow `review/REVIEW.md` and `review/response-policy.md`.

The executor must classify every finding as `accepted`, `rejected`, `needs-human`, `stale`, or `already-fixed`:

- Reinvoke `$implement` for accepted findings, then reply with commit and test evidence.
- Reply to rejected findings with reproducible evidence, never bare disagreement.
- Send disputed P0/P1 findings to `echo_ui_review_adjudicator` or the owner.
- Allow at most two automated repair/review rounds.

## Verify and notify the owner

Run verification appropriate to the change and require `pnpm verify` before the PR is ready for owner review. Commit sanitized run metadata and relevant `screen-shots` to the issue branch. An old active run may synchronize an explicitly allowlisted verifier file only when its Git tree entry exactly matches the live owner-merged PR base; do not hand-edit that file or synchronize any other protected path. Wait for the low-privilege `pull_request` evidence workflow: it prepares candidate and frozen-baseline dependencies with lifecycle scripts disabled and runs candidate `pnpm verify` plus the actual frozen owner-merged `pnpm test` in separate no-network Docker volumes with no GitHub token or host-checkout mount. The live owner-merged control plane validates any allowlisted synchronization, while the frozen base remains the product baseline. The generator binds candidate head, workflow-run SHA, frozen owner-merged base SHA, and live workflow base SHA. Download its artifact and run `loopctl.mjs record-evidence --run-id <id> --manifest <absolute-path> --publication-url <artifact-url>` from the exact artifact-head worktree; the installed control plane revalidates the protected diff locally before querying GitHub.

Before publishing the final review round, write the complete cycle result with an unassigned final `reviewUrl`, then run `loopctl.mjs review-digest --result <absolute-path>`. Add the returned marker to the final review body, publish the non-approving review, replace the unassigned URL with GitHub's actual review URL, and confirm `review-digest` is unchanged. After all responses are posted, run `loopctl.mjs record-review --run-id <id> --result <absolute-path> --review-url <github-review-url>`. The publication digest deliberately canonicalizes GitHub-assigned review URLs while the stored full-file digest still protects the final artifact. Both evidence and review gates must name the current PR head. Keep the PR Draft, emit a blocking `pr_ready_for_review` notification asking `codeacme17` to mark it Ready and review it, then transition from `waiting_for_owner` to `awaiting_owner_review` with the PR URL and exact head SHA.

The owner is the only actor allowed to mark a Draft PR Ready, approve it, or merge it. Never call non-`--undo` `gh pr ready`, `gh pr merge`, enable auto-merge, push to `main`, push to `dev`, dismiss owner feedback, or bypass branch protections. Before any terminal transition, run `prepare-finalization`. For completion, that command paginates the PR timeline and reviews, requires a Ready transition authored by `codeacme17` strictly after the remotely verified Ready-notification comment with no later redraft, and requires the latest exact-head owner review to be a strictly later `APPROVED` decision before the owner merge. It delivers the informational `pr_completed` GitHub notification with the merge SHA after the remote merge timestamp, waits for the bounded webhook attempt to settle, and binds distinct notification URLs/timestamps into the record. For `failed` or `blocked`, publish a checkpoint after the blocking notification and pause; the terminal record must bind that exact `waiting_for_owner` checkpoint, its digest, current pause, and the matching notification timestamp. Raw executor comments cannot use the reserved `pr_completed` marker. If canonical GitHub delivery fails, no terminal record is created. Only then publish the exact body to the configured state-journal issue and pass its result/comment URL to `observe-owner-merge`; that command revalidates the remote record, appends the local notification/owner audit events, and finalizes. Future workspaces run `reconcile` to revalidate the same notification, pause or Ready, approval, and merge proof before rebuilding local history or suppressing an active checkpoint.

## Publish a control-plane bootstrap

Keep bootstrap work isolated from active issue/evolve state on a `codex/bootstrap-*` branch based on the exact current `origin/dev`. After the clean, non-merge, control-plane-only head passes `pnpm verify`, run the installed `loopctl.mjs prepare-bootstrap-authorization` with a unique `BST-*` ID, branch, full base/head SHAs, and purpose. Ask `codeacme17` to post the returned body unchanged on the configured state-journal issue. Set `ECHO_UI_LOOP_BOOTSTRAP_AUTHORIZATION_URL` to that owner comment URL, then route the exact `git push origin <branch>` and `gh pr create --repo codeacme17/echo-ui --base dev --head <branch> --draft ...` through the installed automation identity. The Draft PR body must contain `<!-- issue-dev-loop:bootstrap-authorization:<id>:head:<head-sha> -->`. The router re-fetches the owner comment and rejects expired authorization, identity/repository drift, product paths, deletions, renames, merges, dirty state, stale `dev`, remote ref drift, another head, or another branch. Never use owner credentials to push bootstrap code.

For any pause, do not resume from silence or an arbitrary comment. First require a successfully delivered blocking notification. Then verify the owner's GitHub decision with `loopctl.mjs record-owner-response --run-id <id> --response-url <comment-or-review-url>`. A normal comment must include the exact `RESUME <run-id>` token printed in the notification; a `CHANGES_REQUESTED` review is itself an explicit decision and must be submitted against the run's current exact head SHA. Only then may `loopctl.mjs transition --run-id <id> --status running` continue. Before any repair work or new push, publish that transition's checkpoint, run the unchanged exact PR through `gh pr ready --undo --repo codeacme17/echo-ui`, observe the same head as Draft with `record-pr`, and publish another checkpoint. `$implement` repair attestations and later PR rebinds are rejected unless this durable redraft happened after the current owner response.

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
