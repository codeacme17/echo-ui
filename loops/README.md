# Echo UI engineering loops

This directory contains durable, auditable workflows that Codex can run against Echo UI. A loop is larger than a skill: it owns a contract, compact state, append-only history, triggers, evidence, review policy, and evolution policy.

| Loop | Purpose | Default trigger |
| --- | --- | --- |
| [`issue-dev-loop`](./issue-dev-loop/LOOP.md) | Develop one `codex-ready` issue through an owner-reviewed PR | Cheap preflight, then scheduled Codex run |

## Repository rules

- Treat each loop directory as the canonical source for its own workflow.
- Put repo-discoverable adapters in `.agents/skills`; adapters must point back to the canonical loop rather than duplicate its contract.
- Persist compact state and summary history in Git. Keep raw command logs, screenshots, videos, and generated evidence out of Git and publish them as PR or CI artifacts.
- Never grant a loop authority to approve, auto-merge, or merge a PR.
- Use `pnpm loop:issue-dev:validate` before changing loop infrastructure.
