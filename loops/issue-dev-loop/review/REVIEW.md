# Independent PR review contract

Run after a draft PR exists and before requesting owner review.

## Isolation

Spawn `echo_ui_pr_reviewer` without executor conversation history. Give it the issue snapshot, acceptance criteria, repository rules, immutable base/head SHAs, diff, CI results, and evidence manifest. The reviewer must not edit code.

## Output

Return `PASS` or actionable findings. Each finding must include:

- stable run-wide ID `RVW-<cycle>-<round>-<sequence>`
- severity `P0`, `P1`, `P2`, or `P3`
- confidence `high`, `medium`, or `low`
- file and line when applicable
- concrete impact and evidence
- reproduction or failing test when practical
- expected resolution
- reviewed head SHA

Do not emit formatter noise, personal style preferences, speculative concerns, unrelated refactors, or findings already enforced by a passing deterministic check.

## Publication

The fresh reviewer publishes each round verbatim through `reviewerGitHubLogin` as one non-approving GitHub review, adding `<!-- issue-dev-loop:<run-id>:<finding-id> -->` for deduplication and `<!-- issue-dev-loop:<run-id>:review-cycle:<cycle>:round:<round>:head:<sha> -->` to the round body. A body-only round uses the gated `gh pr review --comment --body <body>` command; body files are rejected so the identity gate can validate the marker before publication. Findings with a concrete file and line must be posted in one gated `POST repos/<configured-repo>/pulls/<recorded-pr>/reviews` call whose event is exactly `COMMENT`, commit ID is the durable recorded head, and inline path/line/side/body fields carry the finding markers; arbitrary input files and every other mutating API shape are rejected. Cross-cutting findings remain in the review body. The reviewer identity must differ from the executor and owner.

Before the final round is published, write the complete cycle result with a temporary/unassigned final `reviewUrl` and run the installed `loopctl review-digest --result <path>`. Put its returned `<!-- issue-dev-loop:<run-id>:review-result-sha256:<digest> -->` marker in the final body. After GitHub assigns the review URL, replace the temporary value and rerun `review-digest`; it must be unchanged. This canonical publication digest replaces only review URLs with a fixed placeholder and therefore avoids a URL↔digest cycle. The later recorded full-file digest still protects the final URLs and every other byte. The reviewer must not downgrade severity or omit findings.

After all replies are posted, create one cycle result matching `result.schema.json`. Its `cycle` is the next durable review cycle number, and it contains every round's review URL, every finding, its final classification, response URL, and evidence. Executor replies include both the readable evidence (and accepted fix SHA) plus `<!-- issue-dev-loop:<run-id>:<finding-id>:<classification> -->`. Rejected P0/P1 findings additionally require an independent or owner comment containing `<!-- issue-dev-loop:<run-id>:<finding-id>:adjudication:<verdict> -->`. Run `record-review` with the final GitHub review URL; it paginates every reviewer-authored review on the recorded PR and requires one-to-one membership for the current run/cycle before it verifies replies, identities, timestamps, ancestry, adjudications, and markers. The publication gate rejects skipped or duplicate cycle rounds. Generic events cannot forge this reserved gate.

## Completion

Bind every round to a head SHA. A new push invalidates the previous PASS because `awaiting_owner_review` requires a recorded review for its exact head. Allow at most two automated rounds. Any `needs-human` classification prevents a PASS result; unresolved P0/P1 findings block notification that the Draft is ready for the owner's action.
