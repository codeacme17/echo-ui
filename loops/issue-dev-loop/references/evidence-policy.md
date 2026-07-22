# Evidence policy

Evidence proves the acceptance criteria against the exact PR head SHA.

## Always include

- run ID, issue number, base SHA, and head SHA
- commands executed, exit codes, and UTC timestamps
- targeted test results
- final `pnpm verify` result
- independent review verdict and finding IDs
- known limitations or checks that could not run

## UI changes

Capture only scenarios relevant to the issue:

- before and after where an existing behavior changes
- desktop and mobile viewport when responsiveness is in scope
- focus, keyboard, disabled, loading, or error state when affected
- video only when a still image cannot demonstrate the interaction

Use descriptive names such as `02-after-player-mobile-375.webp` under `screen-shots/<run-id>`. Record route, viewport, scenario, commit SHA, and capture time in the screenshot manifest.

## Storage

Commit issue-relevant PNG/WebP screenshots and their metadata under `screen-shots/<run-id>` before owner review. The `issue-dev-loop-evidence.yml` workflow checks out the exact PR head, runs `pnpm verify`, generates `evidence/<run-id>/manifest.json` in the runner, and uploads the manifest, sanitized run log, and screenshots as a GitHub Actions artifact. Download the artifact, then pass its URL to `record-evidence`; never accept an artifact from a different head SHA.

The independent reviewer posts findings and responses to GitHub after the draft PR exists. Save its structured cycle result locally and use `record-review --review-url <github-review-url>` so the review gate is independently bound to the same head SHA. Keep raw local command output, videos, traces, and bulky reports in ignored runtime directories. Never upload secrets, cookies, auth state, user data, or unredacted environment dumps.
