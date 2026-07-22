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

The fresh reviewer publishes each round verbatim through `reviewerGitHubLogin` as one non-approving GitHub review, adding `<!-- issue-dev-loop:<run-id>:<finding-id> -->` for deduplication and `<!-- issue-dev-loop:<run-id>:review-round:<round>:head:<sha> -->` to the round body. Findings with a concrete file and line must also be posted as matching inline comments; cross-cutting findings remain in the review body. The reviewer identity must differ from the executor and owner. The final review body must also include `<!-- issue-dev-loop:<run-id>:review-result-sha256:<digest> -->`. It must not downgrade severity or omit findings.

After all replies are posted, create one cycle result matching `result.schema.json`. It contains every round's review URL, every finding, its final classification, response URL, and evidence. Executor replies include both the readable evidence (and accepted fix SHA) plus `<!-- issue-dev-loop:<run-id>:<finding-id>:<classification> -->`. Rejected P0/P1 findings additionally require an independent or owner comment containing `<!-- issue-dev-loop:<run-id>:<finding-id>:adjudication:<verdict> -->`. Run `record-review` with the final GitHub review URL; it queries every recorded review, replies, identities, timestamps, ancestry, adjudications, and markers and binds them to the correct round and current head. Generic events cannot forge this reserved gate.

## Completion

Bind every round to a head SHA. A new push invalidates the previous PASS because `awaiting_owner_review` requires a recorded review for its exact head. Allow at most two automated rounds. Any `needs-human` classification prevents a PASS result; unresolved P0/P1 findings block owner-ready status.
