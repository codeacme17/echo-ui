import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { DEFAULT_LOOP_ROOT, pathExists, readJson, sameGitHubLogin } from './common.mjs'
import { assertGitHubRoleIdentity } from './github-identity.mjs'

async function collectFiles(root, output = []) {
  const entries = await readdir(root, { withFileTypes: true })
  for (const entry of entries) {
    if (['node_modules', '.git'].includes(entry.name)) continue
    const target = path.join(root, entry.name)
    if (entry.isDirectory()) await collectFiles(target, output)
    else output.push(target)
  }
  return output
}

export function validateFinalizationHistory(historyLines) {
  const stateByRunId = new Map()
  for (const entry of historyLines) {
    if (!['run_finalized', 'run_finalization_unverified'].includes(entry.event)) continue
    if (typeof entry.runId !== 'string' || !entry.runId) {
      throw new Error('logs/index.jsonl finalization entry is missing a run ID')
    }
    const prior = stateByRunId.get(entry.runId)
    if (entry.event === 'run_finalization_unverified') {
      if (prior?.state !== 'finalized') {
        throw new Error(
          `logs/index.jsonl run is not currently finalized: ${entry.runId}`,
        )
      }
      stateByRunId.set(entry.runId, { ...prior, state: 'unverified' })
      continue
    }
    const { event: _event, ...record } = entry
    const canonical = JSON.stringify(record)
    if (prior?.state === 'finalized') {
      throw new Error(`logs/index.jsonl run is already finalized: ${entry.runId}`)
    }
    if (prior && prior.canonical !== canonical) {
      throw new Error(
        `logs/index.jsonl restored finalization conflicts with its prior record: ${entry.runId}`,
      )
    }
    stateByRunId.set(entry.runId, { state: 'finalized', canonical })
  }
}

export async function validateLoop({
  loopRoot = DEFAULT_LOOP_ROOT,
  activation = false,
  environment = process.env,
  identityCommand,
} = {}) {
  const required = [
    'SKILL.md',
    'LOOP.md',
    'state.md',
    'dependencies.md',
    'agents/openai.yaml',
    'agents/echo-ui-pr-reviewer.toml',
    'agents/echo-ui-review-adjudicator.toml',
    'agents/echo-ui-loop-evolver.toml',
    'review/REVIEW.md',
    'review/response-policy.md',
    'review/result.schema.json',
    'triggers/TRIGGER.md',
    'evolve/EVOLVE.md',
    'evolve/metrics.json',
    'templates/implementation-brief.md',
    'templates/pr-body.md',
    'schemas/event.schema.json',
    'schemas/run.schema.json',
    'schemas/evidence.schema.json',
    'schemas/finalization-record.schema.json',
    'schemas/checkpoint-record.schema.json',
    'schemas/implementation-result.schema.json',
    'scripts/generate-evidence.mjs',
    'scripts/install-trusted-control-plane.mjs',
    'scripts/verifier.Dockerfile',
    'scripts/resolve-run.mjs',
    'scripts/validate-history.mjs',
    'scripts/validate-candidate-control-plane.mjs',
    'scripts/lib/common.mjs',
    'scripts/lib/evidence.mjs',
    'scripts/lib/evolve.mjs',
    'scripts/lib/finalization-journal.mjs',
    'scripts/lib/active-journal.mjs',
    'scripts/lib/github.mjs',
    'scripts/lib/github-identity.mjs',
    'scripts/lib/trusted-control-plane.mjs',
    'scripts/github-command-gate.mjs',
    'scripts/identity-bin/gh',
    'scripts/identity-bin/git',
    'scripts/lib/issue-claim.mjs',
    'scripts/lib/notifications.mjs',
    'scripts/lib/owner-gate.mjs',
    'scripts/lib/run-store.mjs',
    'scripts/lib/validation.mjs',
    'scripts/with-github-identity.mjs',
    'scripts/with-github-identity',
    'scripts/loopctl.mjs',
    'scripts/runtime.mjs',
    'triggers/detect-work.mjs',
    'logs/index.jsonl',
    'logs/triggers.jsonl',
    'screen-shots/.gitignore',
  ]
  const missing = []
  for (const relative of required) {
    if (!(await pathExists(path.join(loopRoot, relative)))) missing.push(relative)
  }
  if (missing.length > 0) throw new Error(`missing required loop files: ${missing.join(', ')}`)

  const jsonFiles = (await collectFiles(loopRoot)).filter((target) => target.endsWith('.json'))
  const sharedChannelRoot = path.resolve(loopRoot, '..', '_shared', 'owner-channel')
  jsonFiles.push(
    ...(await collectFiles(sharedChannelRoot)).filter((target) => target.endsWith('.json')),
  )
  for (const target of jsonFiles) await readJson(target)
  const historyLines = (await readFile(path.join(loopRoot, 'logs', 'index.jsonl'), 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  if (historyLines[0]?.event !== 'loop_initialized') {
    throw new Error('logs/index.jsonl must start with loop_initialized')
  }
  validateFinalizationHistory(historyLines)
  const triggerLines = (await readFile(path.join(loopRoot, 'logs', 'triggers.jsonl'), 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  if (triggerLines[0]?.event !== 'trigger_log_initialized') {
    throw new Error('logs/triggers.jsonl must start with trigger_log_initialized')
  }
  const channel = await readJson(path.join(sharedChannelRoot, 'channel.json'))
  if (
    typeof channel.ownerGitHubLogin !== 'string' ||
    !Object.hasOwn(channel, 'automationGitHubLogin') ||
    !Object.hasOwn(channel, 'reviewerGitHubLogin') ||
    typeof channel.automationGitHubConfigEnvironmentVariable !== 'string' ||
    typeof channel.reviewerGitHubConfigEnvironmentVariable !== 'string' ||
    typeof channel.untrustedRootsEnvironmentVariable !== 'string' ||
    !Object.hasOwn(channel, 'stateIssueNumber') ||
    channel.repository !== 'codeacme17/echo-ui' ||
    !Array.isArray(channel.informationalImmediateTypes) ||
    !channel.informationalImmediateTypes.includes('pr_completed') ||
    !Array.isArray(channel.immediateTypes)
  ) {
    throw new Error('owner channel is missing identity or immediate notification configuration')
  }
  const configuredIdentities = [
    channel.ownerGitHubLogin,
    channel.automationGitHubLogin,
    channel.reviewerGitHubLogin,
  ]
  if (activation && configuredIdentities.some((login) => typeof login !== 'string' || !login)) {
    throw new Error('activation requires configured owner, automation, and reviewer identities')
  }
  const presentIdentities = configuredIdentities.filter(
    (login) => typeof login === 'string' && login.length > 0,
  )
  if (
    presentIdentities.some((login, index) =>
      presentIdentities.slice(index + 1).some((other) => sameGitHubLogin(login, other)),
    )
  ) {
    throw new Error('owner, automation, and reviewer identities must be distinct')
  }
  if (activation) {
    for (const role of ['automation', 'reviewer']) {
      await assertGitHubRoleIdentity({
        channel,
        role,
        environment,
        enforceCredentialIsolation: true,
        requiredUntrustedRoots: [path.resolve(loopRoot, '..', '..')],
        ...(identityCommand ? { identityCommand } : {}),
      })
    }
  }
  const evidenceWorkflow = path.resolve(
    loopRoot,
    '..',
    '..',
    '.github',
    'workflows',
    'issue-dev-loop-evidence.yml',
  )
  if (!(await pathExists(evidenceWorkflow))) {
    throw new Error('missing .github/workflows/issue-dev-loop-evidence.yml')
  }
  const evidenceWorkflowSource = await readFile(evidenceWorkflow, 'utf8')
  const verificationStep = evidenceWorkflowSource.match(
    /      - name: Run authoritative verification\n([\s\S]*?)(?=\n      - name:)/,
  )?.[1]
  const enforcementStep = evidenceWorkflowSource.match(
    /      - name: Enforce verification result\n([\s\S]*?)(?=\n      - name:|$)/,
  )?.[1]
  if (
    !verificationStep?.includes('pnpm verify') ||
    verificationStep.includes('if:') ||
    !enforcementStep ||
    enforcementStep.includes("steps.run.outputs.has_run == 'true'") ||
    !evidenceWorkflowSource.includes('pull_request:') ||
    evidenceWorkflowSource.includes('pull_request_target:') ||
    !evidenceWorkflowSource.includes('permissions:\n  contents: read') ||
    !evidenceWorkflowSource.includes(
      "github.event.pull_request.head.ref != 'codex/issue-dev-loop'",
    ) ||
    !evidenceWorkflowSource.includes('Check out owner-merged control plane') ||
    !evidenceWorkflowSource.includes('Check out frozen owner-merged baseline') ||
    !evidenceWorkflowSource.includes('ref: ${{ github.event.pull_request.base.sha }}') ||
    !evidenceWorkflowSource.includes('ref: ${{ steps.run.outputs.base_sha }}') ||
    !evidenceWorkflowSource.includes('path: trusted') ||
    (evidenceWorkflowSource.match(/persist-credentials: false/g)?.length ?? 0) < 3 ||
    !evidenceWorkflowSource.includes(
      'trusted/loops/issue-dev-loop/scripts/validate-candidate-control-plane.mjs',
    ) ||
    !evidenceWorkflowSource.includes('verifier.Dockerfile') ||
    !evidenceWorkflowSource.includes('pnpm install --frozen-lockfile --ignore-scripts') ||
    (evidenceWorkflowSource.match(/docker run --rm --network none/g)?.length ?? 0) < 2 ||
    !evidenceWorkflowSource.includes('src=${GITHUB_WORKSPACE}/trusted,dst=/source,readonly') ||
    !evidenceWorkflowSource.includes('pnpm test') ||
    !evidenceWorkflowSource.includes(
      '--trusted-workflow-sha "${{ steps.run.outputs.base_sha }}"',
    ) ||
    !evidenceWorkflowSource.includes(
      '--workflow-base-sha "${{ github.event.pull_request.base.sha }}"',
    ) ||
    !evidenceWorkflowSource.includes(
      '--workflow-run-sha "${{ github.event.pull_request.head.sha }}"',
    ) ||
    !evidenceWorkflowSource.includes('PR_HEAD_REF: ${{ github.event.pull_request.head.ref }}') ||
    !evidenceWorkflowSource.includes('--branch "$PR_HEAD_REF"') ||
    !evidenceWorkflowSource.includes('--baseline-status')
  ) {
    throw new Error(
      'evidence workflow must use a low-privilege isolated PR run plus owner-merged controls and baseline tests',
    )
  }
  const codexConfig = await readFile(
    path.resolve(loopRoot, '..', '..', '.codex', 'config.toml'),
    'utf8',
  )
  const roleRegistrations = {
    echo_ui_pr_reviewer: 'echo-ui-pr-reviewer.toml',
    echo_ui_review_adjudicator: 'echo-ui-review-adjudicator.toml',
    echo_ui_loop_evolver: 'echo-ui-loop-evolver.toml',
  }
  for (const [role, roleFile] of Object.entries(roleRegistrations)) {
    const registration = `config_file = "../loops/issue-dev-loop/agents/${roleFile}"`
    if (!codexConfig.includes(`[agents.${role}]`) || !codexConfig.includes(registration)) {
      throw new Error(`Codex role is not registered through config_file: ${role}`)
    }
  }
  for (const roleFile of [
    'echo-ui-pr-reviewer.toml',
    'echo-ui-review-adjudicator.toml',
  ]) {
    const roleSource = await readFile(
      path.resolve(loopRoot, 'agents', roleFile),
      'utf8',
    )
    if (
      !roleSource.includes('$ECHO_UI_LOOP_CONTROL_PLANE/scripts/with-github-identity') ||
      !roleSource.includes('--loop-root') ||
      !roleSource.includes('$ECHO_UI_LOOP_TARGET_ROOT') ||
      !roleSource.includes('repository launcher')
    ) {
      throw new Error(`${roleFile} must publish only through the installed identity launcher`)
    }
  }

  const contract = await readFile(path.join(loopRoot, 'LOOP.md'), 'utf8')
  const skill = await readFile(path.join(loopRoot, 'SKILL.md'), 'utf8')
  for (const phrase of [
    'draft PR targeting `dev`',
    'approve, auto-merge, or merge any PR',
    'Only the remote owner-merge gate',
    'exact reviewed head SHA',
    'No eligible work is a successful no-op',
  ]) {
    if (!contract.includes(phrase)) throw new Error(`LOOP.md is missing invariant: ${phrase}`)
  }
  for (const phrase of [
    '$implement',
    'echo_ui_pr_reviewer',
    'echo_ui_loop_evolver',
    'record-pr',
    'record-evidence',
    'pnpm verify',
  ]) {
    if (!skill.includes(phrase)) {
      throw new Error(`SKILL.md is missing runtime dependency: ${phrase}`)
    }
  }

  const textualFiles = (await collectFiles(loopRoot)).filter((target) =>
    /\.(?:md|json|ya?ml|toml|mjs)$/.test(target),
  )
  const macUserRootMarker = ['', 'Users', ''].join('/')
  for (const target of textualFiles) {
    const contents = await readFile(target, 'utf8')
    if (contents.includes(macUserRootMarker)) {
      throw new Error(`machine-specific absolute path found in ${path.relative(loopRoot, target)}`)
    }
  }
  return { valid: true, checkedFiles: required.length + jsonFiles.length }
}
