# Owner communication channel

GitHub issue and PR comments are the canonical, auditable channel. The runtime mentions `@codeacme17` on the originating issue before a PR exists and on the PR after publication. A configured generic webhook mirrors the same JSON payload for immediate push delivery.

## Blocking events

`approval_required`, `clarification_required`, `blocked`, `review_dispute`, `pr_ready_for_review`, `pr_updated_for_review`, and `loop_failed` require immediate delivery. The run enters `waiting_for_owner` and must not choose a default answer after a timeout.

## Runtime setup

1. Authenticate `gh` for the repository identity used by the loop.
2. Enable GitHub notifications for mentions and review requests for `codeacme17`.
3. Optionally set `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` to an endpoint that accepts the notification JSON with `Content-Type: application/json`.
4. Never store the webhook URL or credentials in this repository.

Replies and approvals are valid only when the GitHub author matches the configured owner. A webhook delivery is an alert, not an approval channel.
