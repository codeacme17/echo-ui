# Evolve session contract

Run after every ten finalized runs, or after the same failure pattern appears three times. Use a fresh session and provide the loop contract, current state, compact run summaries, notification metrics, owner feedback, revert history, and review data.

The evolve session may automatically:

- remove obsolete items from `state.md`
- propose cheaper preflight checks
- improve non-authority-changing scripts and templates
- update dashboards or metrics derived from append-only logs

It must create an owner-reviewed PR before changing:

- goals, completion criteria, authority, or stop conditions
- merge, release, security, privacy, or dependency policy
- verifier strength or required checks
- notification severity or owner-gate behavior

Never optimize by weakening evidence, increasing autonomous authority, deleting unfavorable history, or hiding no-work and failure runs.
