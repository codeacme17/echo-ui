# Echo UI engineering loops

This directory contains durable, auditable workflows that Codex can run against Echo UI. A loop is larger than a skill: it owns a contract, compact state, append-only history, triggers, evidence, review policy, and evolution policy.

| Loop | Purpose | Default trigger |
| --- | --- | --- |
| [`issue-dev-loop`](./issue-dev-loop/LOOP.md) | Develop one `codex-ready` issue through an owner-reviewed PR | Cheap preflight, then scheduled Codex run |

## Repository rules

- Treat each loop directory as the canonical source for its own workflow.
- Put repo-discoverable adapters in `.agents/skills`; adapters must point back to the canonical loop rather than duplicate its contract.
- Persist compact state, sanitized event history, and issue-relevant screenshots in the issue PR. Publish exact-head evidence manifests and verification logs as CI artifacts; keep raw local output and large recordings out of Git.
- Never grant a loop authority to approve, auto-merge, or merge a PR.
- Use `pnpm loop:issue-dev:validate` before changing loop infrastructure.
