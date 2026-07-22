# GitHub operation policy

Read this before mutating issues or pull requests.

Before every GitHub mutation, run `gh api user` and require the exact configured `automationGitHubLogin`. Stop if it is unset, matches `codeacme17`, matches the reviewer, or differs from the authenticated actor. Never use owner credentials for executor actions.

## Selection and claim

1. Select only open issues labeled `codex-ready`.
2. Exclude `loop:claimed`, an existing `codex/issue-<number>` branch, and any open PR that references or closes the issue.
3. Let `loopctl start --base-sha <full-origin-dev-sha>` acquire the local claim, recheck every page of open PRs, apply `loop:claimed`, and capture the authoritative issue; do not add the label manually first.
4. Record the issue snapshot and claim timestamp before implementation. A second active local run for the issue is rejected.
5. Immediately publish and validate an active checkpoint after the claim. Repeat after each durable phase; the next phase refuses to advance without it. On a fresh wake, `reconcile` returns `workType: resume`, branch, and expected head before considering a new issue. Fetch that branch, create its isolated worktree, then run `restore-checkpoint`; restoration blocks on the wrong branch/head.

## Branch and PR

- Refresh `origin/dev` before creating `codex/issue-<number>`.
- Push only the issue branch.
- Create a draft PR with `--base dev`.
- Run `loopctl record-pr` immediately so later evidence, review, notification, and merge observations are bound to that exact PR/head.
- Run `prepare-checkpoint`, publish its exact body on the state-journal issue, and run `record-checkpoint` immediately after binding or rebinding the PR.
- Create the body from `templates/pr-body.md`. `record-pr` rejects a body missing the run marker, issue closure, full base/head SHAs, or owner-only merge statement.
- Include `Closes #<number>` only when the PR fully satisfies the issue.
- Request `codeacme17` only after automated review and verification pass.
- Bind every review to immutable base and head SHAs.

## Evidence artifact

The PR workflow `Issue dev loop evidence` runs only when the branch contains one active loop run. Wait for its exact-head run to complete, then locate and download the artifact:

```text
gh run list --workflow issue-dev-loop-evidence.yml --branch codex/issue-<number>
gh run download <run-database-id> --name issue-dev-loop-<run-id>-<head-sha> --dir loops/issue-dev-loop/evidence/<run-id>
```

Use the artifact URL emitted by `actions/upload-artifact` as `record-evidence --publication-url` and the downloaded artifact manifest as `--manifest`. The runtime downloads it independently, requires the workflow conclusion to be `success`, and byte-compares the manifest. Reject a workflow run whose PR, branch, workflow path, or `headSha` differs from the recorded run.

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

After a blocking notification, verify the reply URL with `record-owner-response`. Normal comments must include `RESUME <run-id>`; a `CHANGES_REQUESTED` review is an explicit response. The runtime requires that the notification was successfully delivered to the same run target before it accepts the reply.

## Durable state journal

For active work, run `loopctl prepare-checkpoint --run-id <id>`, post its exact `body` to the configured `stateIssueNumber` using the automation identity, then validate it with `loopctl record-checkpoint --run-id <id> --result <path> --comment-url <url>`. A checkpoint is SHA-256 bound to the active run, frozen brief, and ordered validated events. Publish one after every state-changing phase; later checkpoints supersede earlier ones.

Before `completed`, `failed`, `blocked`, or `cancelled`, run `loopctl prepare-finalization` with the terminal status and any merge SHA/failure fingerprint. Failed/blocked records bind the delivered automation-authored owner-notification URL; completion binds and remotely rechecks owner approval and merge; cancellation requires the recorded PR to be closed without merge. Post the exact `body` to the configured `stateIssueNumber` using the automation identity, then run `loopctl record-finalization --run-id <id> --result <path> --comment-url <url>`. For completion, pass that result and URL to `observe-owner-merge`. Terminal transitions reject missing, edited, wrong-author, wrong-issue, digest-mismatched, or externally unproven journal entries. Every scheduled wake begins with `loopctl reconcile`, which restores missing local history and recomputes evolve metrics from the append-only journal.
