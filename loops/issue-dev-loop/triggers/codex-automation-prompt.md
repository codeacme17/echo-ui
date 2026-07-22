Use `$issue-dev-loop` in this repository.

First run `node loops/issue-dev-loop/triggers/detect-work.mjs`. If it returns `hasWork: false`, report a quiet no-op and stop. If it returns an issue, execute one bounded issue-dev-loop run for that exact issue. Preserve owner-only review and merge, use `$implement` for product code, use a fresh read-only reviewer after the draft PR, and notify the owner for every blocking event or ready PR.
