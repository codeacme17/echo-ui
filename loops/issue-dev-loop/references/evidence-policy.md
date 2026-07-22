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

Use descriptive names such as `02-after-player-mobile-375.webp`. Record route, viewport, scenario, commit SHA, and capture time in the screenshot manifest.

## Storage

Raw logs, screenshots, videos, and test reports are runtime artifacts and should not accumulate on `dev`. Upload them to CI artifacts or another configured store, then put stable links in `evidence/<run-id>/manifest.json` and the PR body. Never upload secrets, cookies, auth state, user data, or unredacted environment dumps.
