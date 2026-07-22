# GitHub operation policy

Read this before mutating issues or pull requests.

## Selection and claim

1. Select only open issues labeled `codex-ready`.
2. Exclude `loop:claimed`, an existing `codex/issue-<number>` branch, and any open PR that references or closes the issue.
3. Recheck immediately before applying `loop:claimed`.
4. Record the issue snapshot and claim timestamp before implementation.

## Branch and PR

- Refresh `origin/dev` before creating `codex/issue-<number>`.
- Push only the issue branch.
- Create a draft PR with `--base dev`.
- Include `Closes #<number>` only when the PR fully satisfies the issue.
- Request `codeacme17` only after automated review and verification pass.
- Bind every review to immutable base and head SHAs.

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
