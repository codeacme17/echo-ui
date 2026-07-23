# Owner communication channel

GitHub issue and PR comments are the canonical, auditable channel. The runtime mentions `@codeacme17` on the originating issue before a PR exists and on the PR after publication. A configured generic webhook mirrors the same JSON payload for immediate push delivery.

## Blocking events

`approval_required`, `clarification_required`, `blocked`, `review_dispute`, `pr_ready_for_review`, `pr_updated_for_review`, and `loop_failed` require immediate delivery and must be sent with `blocking: true`. The runtime enters `waiting_for_owner` even when delivery fails, and it must not choose a default answer after a timeout. A ready PR advances to `awaiting_owner_review` only after SHA-bound evidence validation.

`--dry-run` stages a simulated payload only. It never records `owner_notified`, never pauses the run, and never satisfies a blocking delivery gate.

Each blocking GitHub notification prints a unique resume instruction. To continue after answering, include `RESUME <run-id>` in a normal issue/PR comment; submitting a GitHub `CHANGES_REQUESTED` review is also an explicit response. The runtime verifies author, target, timestamp, successful delivery, and response URL before resuming. Silence and unrelated comments never count.

## Runtime setup

1. Authenticate the unattended executor and fresh reviewer with distinct GitHub identities. Their exact logins and the names of their profile-path environment variables live in `channel.json`. For the current configuration, set `ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR` to the `Ethandasw` `gh` profile directory and `ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR` to the `Traviinam` profile directory in the scheduler environment. The directory names themselves are local details and do not need to match the roles.
2. Run `loops/issue-dev-loop/scripts/with-github-identity automation -- node loops/issue-dev-loop/scripts/loopctl.mjs validate --activation` before scheduling. The launcher independently queries both profiles, then starts structural validation in its sanitized child environment; it rejects missing, overlapping, owner-authenticated, or incorrectly routed identities.
3. Run every executor GitHub command, remote Git command, and GitHub-backed `loopctl` command through the executable shell launcher `loops/issue-dev-loop/scripts/with-github-identity automation -- ...`. Run reviewer publication commands through the same launcher with `reviewer`. The launcher removes Node preload hooks; the router clears token overrides and process hooks, verifies `gh api user`, and gives Git a one-command credential helper without changing global Git or `gh` configuration. A PATH gate applies the role and current-run policy to descendant `git` and `gh` processes too; arbitrary shell, environment, or Node command trees are rejected.
4. Create one dedicated repository issue for the append-only loop state journal and set its number as `stateIssueNumber`. It stores active checkpoints and terminal records. Restrict journal entries to the automation identity; humans may read but should not edit or delete them.
5. Enable GitHub notifications for mentions and review requests for `codeacme17`.
6. Optionally set `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` to an endpoint that accepts the notification JSON with `Content-Type: application/json`.
7. Never store profile paths, webhook URLs, or credentials in this repository.

Review publications are valid only when authored by `reviewerGitHubLogin`; executor replies must match `automationGitHubLogin`. Those identities must differ from one another and from `ownerGitHubLogin`. Owner decisions are valid only when the author matches `ownerGitHubLogin`. A webhook delivery is an alert, not an approval channel.
