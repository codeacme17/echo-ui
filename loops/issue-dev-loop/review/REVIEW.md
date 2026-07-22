# Independent PR review contract

Run after a draft PR exists and before requesting owner review.

## Isolation

Spawn `echo_ui_pr_reviewer` without executor conversation history. Give it the issue snapshot, acceptance criteria, repository rules, immutable base/head SHAs, diff, CI results, and evidence manifest. The reviewer must not edit code.

## Output

Return `PASS` or actionable findings. Each finding must include:

- stable ID `RVW-<round>-<sequence>`
- severity `P0`, `P1`, `P2`, or `P3`
- confidence `high`, `medium`, or `low`
- file and line when applicable
- concrete impact and evidence
- reproduction or failing test when practical
- expected resolution
- reviewed head SHA

Do not emit formatter noise, personal style preferences, speculative concerns, unrelated refactors, or findings already enforced by a passing deterministic check.

## Publication

The orchestrator posts findings verbatim as one non-approving GitHub review and inline comments, adding `<!-- issue-dev-loop:<run-id>:<finding-id> -->` for deduplication. The review body must include `<!-- issue-dev-loop:<run-id>:review-result-sha256:<digest> -->`. It must not downgrade severity or omit findings.

After all replies are posted, create one cycle result matching `result.schema.json`. It contains every round, every finding, its final classification, response URL, and evidence. Each reply includes `<!-- issue-dev-loop:<run-id>:<finding-id>:<classification> -->`. Run `record-review` with the GitHub review URL; it queries the review and replies, verifies their automation identity and markers, and binds them to the current head. Generic events cannot forge this reserved gate.

## Completion

Bind every round to a head SHA. A new push invalidates the previous PASS because `awaiting_owner_review` requires a recorded review for its exact head. Allow at most two automated rounds. Any `needs-human` classification prevents a PASS result; unresolved P0/P1 findings block owner-ready status.
