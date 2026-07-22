# Owner communication channel

GitHub issue and PR comments are the canonical, auditable channel. The runtime mentions `@codeacme17` on the originating issue before a PR exists and on the PR after publication. A configured generic webhook mirrors the same JSON payload for immediate push delivery.

## Blocking events

`approval_required`, `clarification_required`, `blocked`, `review_dispute`, `pr_ready_for_review`, `pr_updated_for_review`, and `loop_failed` require immediate delivery and must be sent with `blocking: true`. The runtime enters `waiting_for_owner` even when delivery fails, and it must not choose a default answer after a timeout. A ready PR advances to `awaiting_owner_review` only after SHA-bound evidence validation.

`--dry-run` stages a simulated payload only. It never records `owner_notified`, never pauses the run, and never satisfies a blocking delivery gate.

Each blocking GitHub notification prints a unique resume instruction. To continue after answering, include `RESUME <run-id>` in a normal issue/PR comment; submitting a GitHub `CHANGES_REQUESTED` review is also an explicit response. The runtime verifies author, target, timestamp, successful delivery, and response URL before resuming. Silence and unrelated comments never count.

## Runtime setup

1. Authenticate the unattended executor and fresh reviewer with distinct GitHub identities; set their exact logins as `automationGitHubLogin` and `reviewerGitHubLogin` in `channel.json`.
   Run `loopctl validate --activation` before scheduling. Default GitHub mutations verify `gh api user` matches the configured automation identity and refuse owner credentials.
2. Create one dedicated repository issue for the append-only loop state journal and set its number as `stateIssueNumber`. It stores active checkpoints and terminal records. Restrict journal entries to the automation identity; humans may read but should not edit or delete them.
3. Enable GitHub notifications for mentions and review requests for `codeacme17`.
4. Optionally set `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` to an endpoint that accepts the notification JSON with `Content-Type: application/json`.
5. Never store the webhook URL or credentials in this repository.

Review publications are valid only when authored by `reviewerGitHubLogin`; executor replies must match `automationGitHubLogin`. Those identities must differ from one another and from `ownerGitHubLogin`. Owner decisions are valid only when the author matches `ownerGitHubLogin`. A webhook delivery is an alert, not an approval channel.
