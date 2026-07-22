# Issue development loop state

Updated: 2026-07-22

## Configuration

- Owner: `codeacme17`
- Issue label: `codex-ready`
- Claim label: `loop:claimed`
- Development base: `dev`
- Protected release branch: `main`
- Maximum implementation repairs: 2
- Maximum review rounds: 2

## Active runs

None.

## Open loop PRs

None.

## Blockers

- Configure the GitHub authentication used by unattended runs and set its exact login in `automationGitHubLogin`.
- Merge this infrastructure into `dev` before enabling its recurring automation; the PR evidence workflow must exist on the base branch.
- Repair or explicitly rebaseline the existing `tests/docs-cutover.test.ts` README contract failure before any issue PR can satisfy authoritative `pnpm verify`.
- Choose the recurring Codex automation cadence after the infrastructure PR is merged.
- Optionally configure `ECHO_UI_LOOP_OWNER_WEBHOOK_URL` for a push-channel mirror; GitHub mentions remain the canonical baseline channel.

## Follow-ups

- Forward-test the loop on the first low-risk `codex-ready` issue.
- Review notification noise and evidence retention after five runs.

## Learned constraints

- Feature PRs target `dev`; the repository guard only permits `dev` to target `main`.
- The repository requires Node 24 and pnpm 10.
- `pnpm verify` is the authoritative full validation command.
