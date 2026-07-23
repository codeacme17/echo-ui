# GitHub operation policy

Read this before mutating issues or pull requests.

Run every executor GitHub command through:

```text
"$ECHO_UI_LOOP_CONTROL_PLANE/scripts/with-github-identity" --loop-root "$ECHO_UI_LOOP_TARGET_ROOT" automation -- <command> [args...]
```

`ECHO_UI_LOOP_CONTROL_PLANE` must name the versioned installation created from a clean owner-merged `dev`; `ECHO_UI_LOOP_TARGET_ROOT` names the active worktree's `loops/issue-dev-loop`. Operational `loopctl` and trigger commands must use the scripts inside the installed root and pass `--loop-root "$ECHO_UI_LOOP_TARGET_ROOT"`. The repository launcher intentionally refuses credentials.

Run every reviewer publication command through the installed wrapper with role `reviewer`. Before reading either profile, it verifies every installed file, pins absolute Node/Git/`gh` executables, compares the target's security-critical owner-channel values to its trusted copy, removes token environment overrides, runs `gh api user`, and refuses an unexpected or owner identity. For Git, it clears global credential helpers and injects `gh auth git-credential` for the entire trusted child tree. Descendant `git` and `gh` processes pass through a role gate; arbitrary `sh`, `env`, Node scripts, caller PATH shims, and issue-worktree router changes are not authenticated. Never use owner credentials for executor or reviewer actions, never run raw remote `gh`/`git push` commands, and never call `gh auth setup-git`.

Publish reviewer output only as a non-approving comment review:

```text
"$ECHO_UI_LOOP_CONTROL_PLANE/scripts/with-github-identity" --loop-root "$ECHO_UI_LOOP_TARGET_ROOT" reviewer -- gh pr review <number> --repo codeacme17/echo-ui --comment --body <review-body>
```

The shell launcher removes Node preload hooks before starting the router. The router then builds a strict child environment, rejects reviewer pushes and every reviewer mutation except a comment-only review on the recorded PR, and rejects approvals, change requests, merges, executor-authored reviews, GraphQL, and administration APIs. Reviewer publication requires the next run/cycle/round marker; the gate paginates existing reviews and rejects duplicates, skipped rounds, body files, or an omitted reviewer publication. A reviewer API write is permitted only for one exact-head `event=COMMENT` review with validated inline fields. Authenticated Git disables worktree hooks, fsmonitor, external diff, textconv, proxy environment variables, repository-local HTTP/proxy/cookie/header/SSL/URL rewrites, and the `ext` transport. Remote Git is restricted to exact origin push/fetch/issue-branch discovery shapes and executes against a canonical configured-repository HTTPS URL. Automation API mutations are limited to the current issue's exact claim label, the current issue/PR or journal comments, and current-PR review-comment replies. PR creation requires the durably authorized issue or published evolve request branch, explicit `--repo codeacme17/echo-ui`, `--base dev`, and `--draft`; later PR writes require the same explicit repository (or full configured PR URL), the exact durable checkpoint, the recorded live PR branch/base/head, and the phase-specific Draft/evidence/review gates. `pr edit` is limited to title/body updates and requesting `codeacme17`. Issue pushes derive `codex/issue-<number>` from the durable checkpoint and reject local branch overrides; evolve pushes require the automation-authored request publication. Every other push shape is rejected.

## Selection and claim

1. Select only open issues labeled `codex-ready`.
2. Exclude `loop:claimed`, an existing `codex/issue-<number>` branch, and any open PR that references or closes the issue.
3. Let `loopctl start --base-sha <full-origin-dev-sha>` acquire the local claim, recheck every page of open PRs, apply `loop:claimed`, and capture the authoritative issue; do not add the label manually first.
4. Record the issue snapshot and claim timestamp before implementation. A second active local run for the issue is rejected.
5. Immediately publish and validate an active checkpoint after the claim. Repeat after each durable phase; the next phase re-fetches the exact state-journal comment and refuses to advance on local-only proof. On a fresh wake, `reconcile` returns `workType: resume`, branch, and expected head before considering a new issue. Fetch that branch, create a clean isolated worktree at the exact head, then run `restore-checkpoint`; restoration blocks on the wrong branch, head, or dirty state.

## Branch and PR

- Refresh `origin/dev` before creating `codex/issue-<number>`.
- Push only the issue branch.
- Create a draft PR with `--repo codeacme17/echo-ui --base dev`.
- Run `loopctl record-pr` immediately so later evidence, review, notification, and merge observations are bound to that exact Draft PR/head. After owner feedback, return the unchanged head to Draft and record/checkpoint that observation before any repair.
- Run `prepare-checkpoint`, publish its exact body on the state-journal issue, and run `record-checkpoint` immediately after binding or rebinding the PR.
- Create the body from `templates/pr-body.md`. Initial `record-pr` rejects a body missing the run marker, issue closure, full base/head SHAs, or owner-only merge statement. After a repair push, rebind the new live head first, checkpoint it, then update the body through the exact-head router; the owner-ready gate still requires the visible final head SHA.
- Include `Closes #<number>` only when the PR fully satisfies the issue.
- Request `codeacme17` only after automated review and verification pass.
- Bind every review to immutable base and head SHAs.

## Evidence artifact

The low-privilege `pull_request` workflow `Issue dev loop evidence` runs only when the branch contains one active issue run. Both checkouts disable persisted credentials. A base-checkout container-preparation step installs the protected lockfile with lifecycle scripts disabled and creates two independent Docker volumes before candidate code runs. Candidate `pnpm verify` and owner-merged baseline `pnpm test` run with `--network none`, no inherited GitHub token, and no mount of either host checkout. The base-checkout generator remains outside those containers and binds the manifest to candidate head, workflow-run SHA, and owner-merged base SHA. The installed control plane later rejects the artifact unless its own exact-head diff check proves that the PR did not change the loop plane, owner channel, workflow, verification scripts, package manifests, lock/workspace files, package hooks, or verification configuration. Wait for that exact-head run to complete, then locate and download the artifact:

```text
"$ECHO_UI_LOOP_CONTROL_PLANE/scripts/with-github-identity" --loop-root "$ECHO_UI_LOOP_TARGET_ROOT" automation -- gh run list --workflow issue-dev-loop-evidence.yml --branch codex/issue-<number>
"$ECHO_UI_LOOP_CONTROL_PLANE/scripts/with-github-identity" --loop-root "$ECHO_UI_LOOP_TARGET_ROOT" automation -- gh run download <run-database-id> --name issue-dev-loop-<run-id>-<head-sha> --dir "$ECHO_UI_LOOP_TARGET_ROOT/evidence/<run-id>"
```

Push only through the installed `with-github-identity ... automation -- git push ...` route. The wrapper rejects reviewer pushes, force pushes, and explicit pushes to `dev` or `main`.

Use the artifact URL emitted by `actions/upload-artifact` as `record-evidence --publication-url` and the downloaded artifact manifest as `--manifest`. From a worktree whose `HEAD` is the artifact's exact candidate head, the installed runtime first validates the protected diff, then independently downloads the artifact, requires a successful low-privilege `pull_request` run of the named unchanged workflow, validates workflow-run SHA and owner-merged base SHA, and byte-compares the manifest. Reject a run whose PR, base, branch, candidate head, workflow path, or manifest digests differ from the recorded run.

## Prohibited commands

Never run:

```text
gh pr merge
git push origin dev
git push origin main
git push --force origin dev
git push --force origin main
```

Do not enable auto-merge, dismiss owner reviews, resolve disputed owner comments, or modify branch-protection settings.

## Communication

Use the originating issue for pre-PR questions and the PR for post-publication questions. Mention `@codeacme17`, include the notification ID and run ID, and link the exact evidence or decision needed. Only decisions from the configured owner identity satisfy an owner gate.

After a blocking notification, verify the reply URL with `record-owner-response`. Normal comments must include `RESUME <run-id>`; a `CHANGES_REQUESTED` review is an explicit response only when its `commit_id` is the run's current head. The runtime requires that the notification was successfully delivered to the same run target before it accepts the reply.

## Durable state journal

For active work, run `loopctl prepare-checkpoint --run-id <id>`, post its exact `body` to the configured `stateIssueNumber` using the automation identity, then validate it with `loopctl record-checkpoint --run-id <id> --result <path> --comment-url <url>`. A checkpoint is SHA-256 bound to the active run, frozen brief, ordered validated events, and the small local result/manifest artifacts required by later gates. Restore verifies every embedded artifact digest before recreating it. Publish one after every state-changing phase; later checkpoints supersede earlier ones.

Before `completed`, `failed`, `blocked`, or `cancelled`, run `loopctl prepare-finalization` with the terminal status and any merge SHA/failure fingerprint. Failed/blocked records bind the delivered automation-authored owner-notification URL; completion binds and remotely rechecks owner approval and merge; cancellation requires the recorded PR to be closed without merge. Post the exact `body` to the configured `stateIssueNumber` using the automation identity, then run `loopctl record-finalization --run-id <id> --result <path> --comment-url <url>`. For completion, pass that result and URL to `observe-owner-merge`. Terminal transitions reject missing, edited, wrong-author, wrong-issue, digest-mismatched, or externally unproven journal entries. Every scheduled wake begins with `loopctl reconcile`, which restores missing local history and recomputes evolve metrics from the append-only journal.
