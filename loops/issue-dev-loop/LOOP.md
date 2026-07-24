# Echo UI issue development loop contract

Version: 1

This contract is the constitution for automated issue development in Echo UI. When another instruction conflicts with it, stop and ask the owner unless that instruction has higher platform authority.

## Goal

Turn one eligible GitHub issue into a small, verified draft PR, complete an independent review-and-repair cycle, present auditable evidence, and wait for the repository owner to review and merge it.

A run is complete only when all of the following are true:

1. The selected issue had the `codex-ready` label and was not already claimed.
2. The implementation satisfies its frozen acceptance criteria.
3. Required targeted checks and `pnpm verify` passed.
4. Independent review has no unresolved P0/P1 findings.
5. Every automated review comment has an evidence-backed response.
6. Evidence is linked from the PR.
7. The owner, `codeacme17`, reviewed and merged the PR.
8. State and append-only summary history were updated.

## Authority

The loop may:

- read public repository data and eligible issues
- claim one issue using labels and a unique branch
- create an isolated worktree from `dev`
- invoke `$implement` in that worktree
- run repository tests, builds, lint, and browser verification
- commit and push only `codex/issue-<number>` branches
- create and update a draft PR targeting `dev`
- request independent review and post its findings
- respond to review comments with evidence
- notify the owner when the Draft PR has passed every automated gate
- notify the owner and observe owner actions

The separate evolve workflow in [`evolve/EVOLVE.md`](./evolve/EVOLVE.md) may push only the exact `codex/evolve-<pending-request-id>` branch and create its Draft PR to `dev`. That authorization exists only while the matching request file is pending.

The loop must obtain owner confirmation before:

- changing public API compatibility or package exports
- adding or replacing a production dependency
- changing security, privacy, release, or publishing behavior
- expanding materially beyond the issue acceptance criteria
- accepting a disputed P0/P1 review finding

The loop must never:

- approve, auto-merge, or merge any PR
- mark any Draft PR ready for review
- call `gh pr merge` or enable a merge queue for its PR
- push directly to `dev` or `main`
- target `main` from an issue branch
- bypass branch protection or dismiss owner review feedback
- publish a package, tag, release, or deployment
- weaken, delete, or skip a failing test to obtain a green result
- expose secrets, cookies, tokens, private logs, or personal data

## Trigger

Use a combo trigger. Run `triggers/detect-work.mjs` before starting a Codex implementation turn. The preflight queries open `codex-ready` issues, excludes issues with `loop:claimed` or an open matching PR, and selects the highest-priority oldest issue. Every result appends `trigger_checked` to `logs/triggers.jsonl`; if there is no work, record `hasWork: false` and exit without waking an implementation agent.

## Workflow

### 1. Claim and snapshot

Recheck the issue immediately before mutation. `loopctl start` atomically creates the remote `codex/issue-N` branch at the verified base SHA as the cross-worktree reservation, then applies `loop:claimed` and creates the local run. GitHub permits only one creator for a new ref, so a concurrent loser exits before any checkpoint is published. If labeling fails, release the reservation only after verifying it still points to the exact base SHA. If a process crash nevertheless leaves a branch without a resumable checkpoint or open PR, the next trigger returns `claim_recovery`, wakes the loop, and immediately escalates the issue and branch to the owner instead of silently excluding it; never delete or reuse that reservation without explicit owner confirmation. Also reject another active run or open issue branch PR. Capture the issue title/body/labels/URL, base SHA, and acceptance criteria. Use one run ID across logs, handoffs, `screen-shots`, evidence, review comments, notifications, branch metadata, and the PR body.

### 2. Isolate

Create `codex/issue-<number>` from the current `origin/dev` and use an isolated worktree. Never reuse an unclean directory or another run's branch.

### 3. Freeze the implementation brief

Complete the generated handoff with acceptance criteria, scope, TDD seams, required checks, UI evidence, and stop conditions, then run `freeze-brief`. Its SHA-256 digest becomes immutable for the run; later implementation, PR, and CI evidence gates reject a changed handoff. Owner feedback and review repairs are supplemental handoffs linked from new `$implement` results rather than edits to the frozen brief.

### 4. Implement

Explicitly invoke `$implement`. The orchestrator does not write product code. `$implement` owns TDD at agreed seams, implementation, regular typechecking and targeted tests, the final full suite, `$code-review`, and a local commit. It must not push, create a PR, or merge. Every invocation writes a unique schema-validated result with its invocation ID, timestamps, frozen brief digest, passed checks, and a new commit descending from the prior implementation commit (or the frozen base SHA for the first invocation); record it before PR publication or update.

The recorded implementation commit is the product-code boundary. Later commits may contain only the current run's handoff, sanitized logs, screenshots, and evidence. `record-pr` diffs the implementation commit against the proposed head and rejects every other path, so the orchestrator cannot append unrecorded product changes. Issue runs may not modify the loop runtime, owner channel, workflow, package manifests, verification scripts, or verification configuration. Such control-plane work belongs to a dedicated owner-reviewed evolve/bootstrap PR and becomes executable only after installation from a clean owner-merged `dev`.

### 5. Verify before publication

Run relevant checks and `pnpm verify`. For UI behavior, capture before/after screenshots under `screen-shots/<run-id>` at meaningful desktop and mobile viewports and include interaction or accessibility evidence where applicable. Bind `before` to the frozen base and `after` to the latest `$implement` commit; never put the containing commit's not-yet-known hash inside its own files. Commit sanitized screenshots and run metadata to the issue branch. The low-privilege `pull_request` evidence workflow checks out the exact candidate head, resolves its frozen run base, proves that base remains an ancestor of live `dev`, and separately checks out the immutable owner-merged base without persisted credentials. It installs candidate and baseline dependencies with lifecycle scripts disabled into distinct Docker volumes. Candidate `pnpm verify` and the actual frozen owner-merged baseline `pnpm test` run in separate no-network containers that receive no GitHub token and cannot mount any host checkout. Before accepting the artifact, the installed control plane independently rejects any exact-head change to the workflow or trusted control/verification plane. The manifest binds candidate head, workflow-run SHA, frozen owner-merged base SHA, and the live PR base SHA that selected the workflow.

### 6. Create the draft PR

Push the issue branch and create a draft PR targeting `dev`. Immediately bind it to the run with `record-pr`; later evidence and review gates accept only that PR and head. The PR must include the issue, run ID, base/head SHAs, risk, changes, evidence links, screenshots, known limitations, and explicit owner-only merge language. In `Verification`, bind every manifest check to its own result using the exact line `- \`<exact command>\`: passed (exit code 0)`; a summary-level pass statement is not sufficient.

### 7. Independent review

Spawn `echo_ui_pr_reviewer` with fresh context and read-only filesystem access. Provide only durable specifications and review artifacts. Post every round's findings verbatim and record that round's GitHub review URL. For the final round, compute the canonical publication digest before posting; the digest replaces GitHub-assigned review URLs with a fixed placeholder, so the returned URL can be inserted afterward without changing the marker, while the final result file still receives its own full-content digest. The runtime independently verifies each review's author, immutable head SHA, marker, submission time, contents, and exhaustive paginated membership. The executor then classifies and responds to every comment. Accepted findings go back through a `$implement` invocation that starts after the finding review; its evidence-backed reply must be posted after that invocation finishes. Rejected findings require concrete evidence posted after the review. Use `echo_ui_review_adjudicator` or the owner for disputed P0/P1 findings. Allow at most two automated repair/review rounds.

### 8. Owner gate

After exact-head CI and independent review pass, download the CI manifest and record its artifact URL with `record-evidence`; the command downloads the artifact again, byte-compares its manifest, and requires a successful run of the named workflow for the recorded PR/head. Record the fresh review cycle and its GitHub URL separately with `record-review`. Keep the PR in Draft, send `codeacme17` a blocking GitHub notification asking the owner to mark it ready, review, and either merge or request changes, and transition to `awaiting_owner_review`. The transition requires that delivered notification and queries GitHub for an open Draft PR targeting `dev` whose live branch and head SHA match the run. Only the owner may change the Draft to Ready. Do not infer readiness, approval, or consent from timeouts or silence.

### 9. Owner feedback

When the owner requests changes, verify the owner-authored GitHub comment or `CHANGES_REQUESTED` review with `record-owner-response`; ordinary comments must include the notification's exact `RESUME <run-id>` token, and a review must target the run's current exact head. Only after that gate may the run return to `running`. Publish the transition checkpoint, immediately return the unchanged exact PR head to Draft with the phase-gated `gh pr ready --undo`, observe that remote Draft state with `record-pr`, and publish another checkpoint. Only then snapshot comments, create a supplemental handoff, invoke `$implement`, record its new result, push and rebind the still-Draft PR at the new head. Update its body, reverify, rerun a new numbered fresh-review cycle, reply with commit and evidence, and notify the owner that the PR is ready again.

### 10. Complete

Only the remote owner-merge gate permits `completed`. Before a completion record exists, `prepare-finalization` remotely verifies the automation-authored Ready notification, a strictly later owner `ready_for_review` timeline event with no later redraft, and the latest owner review for the exact reviewed head SHA; that latest review must be `APPROVED`, must be strictly after Ready, and must not be superseded by requested changes or dismissal. It also requires a merge performed by `codeacme17`. The command then requires successful canonical `pr_completed` GitHub delivery whose body binds the merge SHA and whose remote timestamp is at or after the merge, and waits for the optional webhook attempt to settle within its bound. The identity router reserves `pr_completed` for the trusted finalization command. The finalization record binds distinct Ready and completion comment URLs/timestamps plus webhook outcome. Failed and blocked records instead bind the latest durable `waiting_for_owner` checkpoint, its digest, the current pause timestamp, and the matching notification's remote timestamp; stale notifications from earlier pauses cannot terminate or suppress the active checkpoint. Only after those prerequisites may the automation identity publish the record to the GitHub state journal. Publication, `observe-owner-merge`, terminal transition, and future reconciliation re-fetch that proof; a failed delivery or crash before publication leaves the active checkpoint resumable instead of suppressing it. Mutable local events are audit records, never authorization. Record merge SHA and timestamp, remove `loop:claimed`, update state, append the run summary, and retain links to published evidence. A closed unmerged PR is `cancelled`, not completed.

## State and history

Keep `state.md` small and deliberate. It may be rewritten and contains only active runs, open PRs, blockers, follow-ups, current hypotheses, and learned constraints.

`logs/index.jsonl` is append-only and contains compact finalized-run summaries plus reconciliation tombstones for rows that lack a durable counterpart; metrics ignore tombstoned rows. A durable record may be restored after its tombstone, but duplicate active finalizations, consecutive tombstones, and conflicting restorations are invalid. `logs/triggers.jsonl` is the append-only record of cheap trigger decisions, including successful no-ops and resumes. The dedicated GitHub state-journal issue is the durable cross-worktree source for active checkpoints, terminal records, and pending/completed evolve sessions. After every durable run phase, publish the exact `prepare-checkpoint` body and validate it with `record-checkpoint`; the next phase re-fetches that automation-authored comment and refuses stale, absent, edited, or locally forged proof. Each compact checkpoint also embeds the digest-bound `$implement` result, evidence manifest, review result, and finalization record referenced by its event chain, when present, so later gates remain resumable. Terminal comments supersede active checkpoints only after finalization reconciliation validates them, including remote owner proof for completion and current-pause proof for failed/blocked runs. `loopctl reconcile` discovers resumable state, excludes local terminal rows without verified remote records, rebuilds evolve request/completion state, and recomputes metrics from verified journal history; it does not write run state into an arbitrary checkout. The orchestrator creates a clean worktree at the recorded exact branch/head, then `restore-checkpoint` verifies both before restoring run files and required small artifacts. A resumable run is returned as `workType: resume` before new issue selection. Commit sanitized `run.json`, pre-publication `events.jsonl`, summaries, and relevant screenshots to the issue branch so they are reviewable in its PR. The exact-head CI manifest and full proof travel in an Actions artifact. Keep raw local command output and large recordings in ignored `raw/` or `test-results/` directories. GitHub journal comments, PR reviews, workflow artifacts, and merge metadata are authoritative; local indexes and metrics are reconstructable caches.

Never log secrets, full environment dumps, cookies, auth headers, private user data, or raw prompts containing sensitive information.

## Budgets and concurrency

- One issue per run.
- One active run per issue.
- Prefer changes below 400 non-generated lines; ask before materially exceeding it.
- At most two implementation repair attempts before owner escalation.
- At most two independent review rounds before owner escalation.
- Never start a second run merely to keep the loop busy.

## Notifications

GitHub issue/PR comments are the canonical communication record. The shared owner channel may mirror notifications to a webhook. The notification runtime automatically transitions blocking events to `waiting_for_owner`; delivery failure is itself a blocker. `pr_ready_for_review` means the still-Draft PR has passed the loop's automated gates; it moves from that pause to `awaiting_owner_review` only after its SHA-bound evidence gates pass, and asks the owner to perform the GitHub Ready transition.

All credential-bearing commands run from an installed, hash-verified control plane outside the issue worktree and outside every unattended-writable root. The scheduler/OS must expose that bundle read/execute-only; mode bits and a co-located manifest are not themselves a trust boundary against the same OS principal. The installed launcher pins and hashes absolute Node, Git, and GitHub CLI executables; treats the worktree loop root only as data; compares its security-critical channel fields with the installed owner channel; and refuses detected tampering or PATH impersonation before loading either GitHub profile. The repository launcher never receives credentials. Activation also requires private credential profiles outside every declared untrusted agent root. `$implement`, reviewers, product tests, and verifier containers receive no profile variables or `GH_CONFIG_DIR`, and their OS sandbox must not be able to read those directories.

A paused run resumes only after successful canonical GitHub delivery and a new, run-bound owner decision. The notification tells the owner to include `RESUME <run-id>` in a normal reply; a GitHub request-changes review is accepted without that token. An unrelated, stale, wrong-author, wrong-target, or pre-delivery comment never unlocks the run.

Notify immediately for `approval_required`, `clarification_required`, `blocked`, `review_dispute`, `pr_ready_for_review`, `pr_updated_for_review`, and `loop_failed`. After the owner marks the PR Ready, approves the exact head, and merges it, emit the non-blocking `pr_completed` GitHub notification (plus the bounded webhook mirror) before recording terminal completion. Routine no-work checks belong in a digest, not an interruption.

## Anti-busywork

Never rewrite accurate documentation, refactor unrelated working code, add tests without meaningful coverage, create cosmetic review comments, or open a PR solely to demonstrate activity. No eligible work is a successful no-op.
