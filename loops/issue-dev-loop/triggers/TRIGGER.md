# Combo trigger

Run the deterministic detector before waking Codex:

```bash
loops/issue-dev-loop/scripts/with-github-identity automation -- node loops/issue-dev-loop/triggers/detect-work.mjs
```

Before the issue detector, run `loopctl.mjs evolve-status` through the same automation wrapper. A pending evolve request is real work and must wake the dedicated fresh-context evolver instead of an issue executor.

The command prints one JSON object. Start a Codex turn only when `hasWork` is `true`; pass the returned issue number and URL to `$issue-dev-loop`.

For a scheduled Codex automation, use [`codex-automation-prompt.md`](./codex-automation-prompt.md). The machine and repository credentials must remain available for local scheduled runs. Use a dedicated worktree for every issue.

An event-driven runner may call the same detector after an issue label webhook. The webhook is only a wake-up hint: selection and idempotency checks still run.
