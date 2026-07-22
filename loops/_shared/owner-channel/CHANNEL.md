# Owner communication channel

GitHub issue and PR comments are the canonical, auditable channel. The runtime mentions `@codeacme17` on the originating issue before a PR exists and on the PR after publication. A configured generic webhook mirrors the same JSON payload for immediate push delivery.

## Blocking events

`approval_required`, `clarification_required`, `blocked`, `review_dispute`, `pr_ready_for_review`, `pr_updated_for_review`, and `loop_failed` require immediate delivery and must be sent with `blocking: true`. The runtime enters `waiting_for_owner` even when delivery fails, and it must not choose a default answer after a timeout. A ready PR advances to `awaiting_owner_review` only after SHA-bound evidence validation.

`--dry-run` stages a simulated payload only. It never records `owner_notified`, never pauses the run, and never satisfies a blocking delivery gate.

## Runtime setup

1. Authenticate the unattended executor and fresh reviewer with distinct GitHub identities; set their exact logins as `automationGitHubLogin` and `reviewerGitHubLogin` in `channel.json`.
2. Enable GitHub notifications for mentions and review requests for `codeacme17`.
3. Optionally set `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` to an endpoint that accepts the notification JSON with `Content-Type: application/json`.
4. Never store the webhook URL or credentials in this repository.

Review publications are valid only when authored by `reviewerGitHubLogin`; executor replies must match `automationGitHubLogin`. Those identities must differ from one another and from `ownerGitHubLogin`. Owner decisions are valid only when the author matches `ownerGitHubLogin`. A webhook delivery is an alert, not an approval channel.
