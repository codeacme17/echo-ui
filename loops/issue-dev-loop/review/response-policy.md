# Review response policy

Classify every automated finding as one of:

- `accepted`: valid and in scope
- `rejected`: incorrect, already guaranteed, or outside the issue scope
- `needs-human`: product, API, security, release, or high-severity ambiguity
- `stale`: refers to a superseded head SHA or removed code
- `already-fixed`: current head demonstrably resolves it

Accepted findings return to `$implement`. Reply only after pushing the fix and include commit SHA, commands, results, and evidence links.

Rejected findings require a precise counterclaim and reproducible evidence in the GitHub reply. Do not reply with bare disagreement. An executor cannot unilaterally close a disputed P0 or P1; publish `REJECT_FINDING` from the independent reviewer identity or `OWNER_REJECTED_FINDING` from the owner, include its adjudication marker/URL in the cycle result, and escalate `NEEDS_OWNER` outcomes.

Do not delete review comments. Log classification, response time, response URL, commit, and evidence reference under the run ID.

The final cycle file must match `result.schema.json`. `record-review` accepts only a PASS published by the distinct configured reviewer identity whose last round matches the recorded PR head, whose GitHub review carries the result digest, whose earlier findings all have verified executor-authored response URLs, classification markers and visible evidence, and whose accepted fix commits are ancestors of the reviewed head.
