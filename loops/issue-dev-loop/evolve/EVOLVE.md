# Evolve session contract

`finalizeRun` updates `metrics.json` and creates a pending request under `evolve/requests/` after every ten finalized runs or three identical failure fingerprints. Every scheduled trigger must run `loopctl.mjs evolve-status` before selecting issue work. When `evolveDue` is true, spawn `echo_ui_loop_evolver` with fresh context and provide the pending request, loop contract, current state, compact run summaries, notification metrics, owner feedback, revert history, and review data.

The evolve session may propose:

- remove obsolete items from `state.md`
- propose cheaper preflight checks
- improve non-authority-changing scripts and templates
- update dashboards or metrics derived from append-only logs

Every evolve change requires a dedicated `codex/evolve-<request-id>` draft PR targeting `dev`, containing `<!-- issue-dev-loop:evolve-request:<request-id> -->`, and reviewed and merged by the owner. The PR must be created after the request. Push and create it only through `loops/issue-dev-loop/scripts/with-github-identity automation -- ...`; the router reads the pending metrics and request file and authorizes only their exact branch, `--base dev`, and `--draft`. The owner decides when to mark this dedicated evolve PR ready and whether to merge it. In particular, never change the following without explicit owner confirmation:

- goals, completion criteria, authority, or stop conditions
- merge, release, security, privacy, or dependency policy
- verifier strength or required checks
- notification severity or owner-gate behavior

Never optimize by weakening evidence, increasing autonomous authority, deleting unfavorable history, or hiding no-work and failure runs.

After the owner merges the evolve PR, run `loopctl.mjs evolve-complete --request-id <id> --summary <summary> --pr-url <url>`. A pending request is not cleared by silence or an unmerged PR.
