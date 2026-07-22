# Review response policy

Classify every automated finding as one of:

- `accepted`: valid and in scope
- `rejected`: incorrect, already guaranteed, or outside the issue scope
- `needs-human`: product, API, security, release, or high-severity ambiguity
- `stale`: refers to a superseded head SHA or removed code
- `already-fixed`: current head demonstrably resolves it

Accepted findings return to `$implement`. Reply only after pushing the fix and include commit SHA, commands, results, and evidence links.

Rejected findings require a precise counterclaim and reproducible evidence. Do not reply with bare disagreement. An executor cannot unilaterally close a disputed P0 or P1; invoke `echo_ui_review_adjudicator`, then escalate `NEEDS_OWNER` outcomes.

Do not delete review comments. Log classification, response time, response URL, commit, and evidence reference under the run ID.
