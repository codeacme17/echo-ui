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
    'scripts/resolve-run.mjs',
    'scripts/validate-history.mjs',
    'scripts/lib/common.mjs',
    'scripts/lib/evidence.mjs',
    'scripts/lib/evolve.mjs',
    'scripts/lib/finalization-journal.mjs',
    'scripts/lib/active-journal.mjs',
    'scripts/lib/github.mjs',
    'scripts/lib/github-identity.mjs',
    'scripts/lib/issue-claim.mjs',
    'scripts/lib/notifications.mjs',
    'scripts/lib/owner-gate.mjs',
    'scripts/lib/run-store.mjs',
    'scripts/lib/validation.mjs',
    'scripts/with-github-identity.mjs',
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
  const finalizedRunIds = historyLines
    .filter((entry) => entry.event === 'run_finalized')
    .map((entry) => entry.runId)
  if (new Set(finalizedRunIds).size !== finalizedRunIds.length) {
    throw new Error('logs/index.jsonl contains duplicate finalized run IDs')
  }
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
    !Object.hasOwn(channel, 'stateIssueNumber') ||
    channel.repository !== 'codeacme17/echo-ui' ||
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
  const codexConfig = await readFile(
    path.resolve(loopRoot, '..', '..', '.codex', 'config.toml'),
    'utf8',
  )
  for (const role of [
    'echo_ui_pr_reviewer',
    'echo_ui_review_adjudicator',
    'echo_ui_loop_evolver',
  ]) {
    if (!codexConfig.includes(`[agents.${role}]`) || !codexConfig.includes('config_file =')) {
      throw new Error(`Codex role is not registered through config_file: ${role}`)
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
