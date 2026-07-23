# Review response policy

Classify every automated finding as one of:

- `accepted`: valid and in scope
- `rejected`: incorrect, already guaranteed, or outside the issue scope
- `needs-human`: product, API, security, release, or high-severity ambiguity
- `stale`: refers to a superseded head SHA or removed code
- `already-fixed`: current head demonstrably resolves it

Accepted findings return to a new `$implement` invocation that starts after the review was submitted. Reply only after that invocation finishes and the fix is pushed; include commit SHA, commands, results, and evidence links.

Rejected findings require a precise counterclaim and reproducible evidence in the GitHub reply. Do not reply with bare disagreement. An executor cannot unilaterally close a disputed P0 or P1; publish `REJECT_FINDING` from the independent reviewer identity or `OWNER_REJECTED_FINDING` from the owner, include its adjudication marker/URL in the cycle result, and escalate `NEEDS_OWNER` outcomes.

Do not delete review comments. Log classification, response time, response URL, commit, and evidence reference under the run ID.

The final cycle file must match `result.schema.json` and include a unique GitHub review URL for every round. Compute the final publication marker with `review-digest` before GitHub assigns the final URL, insert the returned URL afterward, and verify that the canonical digest is unchanged. `record-review` accepts only chronologically ordered reviews published by the distinct configured reviewer identity, with every round bound to its own immutable head and marker. The last round must match the recorded PR head and carry that canonical publication digest; the recorded result artifact separately keeps a full-content digest. Earlier findings require verified executor-authored response URLs, classification markers, visible evidence, and review→repair→reply ordering; accepted fix commits must be `$implement`-attested ancestors of the reviewed head.
