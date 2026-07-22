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

The orchestrator posts findings verbatim as one GitHub review and inline comments, adding `<!-- issue-dev-loop:<run-id>:<finding-id> -->` for deduplication. It must not downgrade severity or omit findings.

## Completion

Bind every round to a head SHA. A new push invalidates the previous PASS. Allow at most two automated rounds. Unresolved P0/P1 findings block owner-ready status.
