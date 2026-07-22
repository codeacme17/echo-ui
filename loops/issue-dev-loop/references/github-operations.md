# GitHub operation policy

Read this before mutating issues or pull requests.

## Selection and claim

1. Select only open issues labeled `codex-ready`.
2. Exclude `loop:claimed`, an existing `codex/issue-<number>` branch, and any open PR that references or closes the issue.
3. Let `loopctl start` acquire the local claim, recheck GitHub immediately, and apply `loop:claimed`; do not add the label manually first.
4. Record the issue snapshot and claim timestamp before implementation. A second active local run for the issue is rejected.

## Branch and PR

- Refresh `origin/dev` before creating `codex/issue-<number>`.
- Push only the issue branch.
- Create a draft PR with `--base dev`.
- Run `loopctl record-pr` immediately so later evidence, review, notification, and merge observations are bound to that exact PR/head.
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
