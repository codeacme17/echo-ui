# Evidence policy

Evidence proves the acceptance criteria against the exact PR head SHA.

## Always include

- run ID, issue number, base SHA, and head SHA
- commands executed, exit codes, and UTC timestamps
- targeted test results
- final `pnpm verify` result
- owner-merged baseline test result from the isolated low-privilege workflow
- independent review verdict and finding IDs in the combined PR evidence (the separately published, exact-head review gate is authoritative)
- known limitations or checks that could not run

## UI changes

Capture only scenarios relevant to the issue:

- before and after where an existing behavior changes
- desktop and mobile viewport when responsiveness is in scope
- focus, keyboard, disabled, loading, or error state when affected
- video only when a still image cannot demonstrate the interaction

Use descriptive names such as `02-after-player-mobile-375.webp` under `screen-shots/<run-id>/<phase>`. Record phase, route, viewport, scenario, source commit SHA, and capture time in the screenshot manifest. `before` must come from the frozen base SHA and `after` from the latest recorded `$implement` commit. CI adds its exact checkout SHA to the generated evidence manifest, avoiding an impossible commit-hash self-reference while still binding captures to code that is an ancestor of that head. Every scenario/route/viewport tuple must have both phases. Captures must be genuine PNG/WebP files of at least 320×200 pixels.

## Storage

Commit issue-relevant PNG/WebP screenshots and their metadata under `screen-shots/<run-id>` before owner review. The low-privilege `issue-dev-loop-evidence.yml` workflow runs on `pull_request`, checks out owner-merged base code and the exact PR head separately with persisted credentials disabled, prepares protected dependencies with lifecycle scripts disabled, and snapshots two independent Docker volumes. Candidate `pnpm verify` and owner-merged baseline `pnpm test` run in no-network containers without GitHub tokens or host-checkout mounts. Only after those containers exit does the host-side base-checkout script generate and upload the manifest, sanitized run log, test logs, and screenshots. Download the artifact, then pass its URL to `record-evidence` from the exact artifact-head worktree; never accept an artifact from a different candidate head, workflow-run SHA, or owner-merged base SHA.

`record-evidence` first executes the installed candidate-control validator against the exact local Git commit, so an artifact cannot be accepted when the PR changed the workflow, loop runtime, package scripts, lockfile, package hooks, or verification configuration. It then queries the GitHub artifact and workflow-run APIs, requires the named low-privilege workflow to conclude successfully for the recorded PR/base/head and workflow-run SHA, downloads the artifact through `gh run download`, and byte-compares its manifest with the supplied file. Failed CI artifacts and locally fabricated manifests are rejected. The independent reviewer posts findings and responses to GitHub after the draft PR exists. Save every round's unique review URL in the structured cycle result and use the final one with `record-review --review-url <github-review-url>`; the runtime binds each round to its author, submission time, exact head, comments, repairs, and replies. The final review marker uses `review-digest`, whose canonical digest excludes only GitHub-assigned review URLs; insert the returned final URL after publication and verify the digest is unchanged. Keep raw local command output, videos, traces, and bulky reports in ignored runtime directories. Never upload secrets, cookies, auth state, user data, or unredacted environment dumps.
