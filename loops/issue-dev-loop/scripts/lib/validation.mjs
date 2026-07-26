import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { DEFAULT_LOOP_ROOT, pathExists, readJson, sameGitHubLogin } from './common.mjs'
import {
  assertGitHubRoleIdentity,
  consumeHistoricalValidationCapability,
} from './github-identity.mjs'

const unsupportedYamlCharacters =
  /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u2028\u2029]/u

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
        throw new Error(`logs/index.jsonl run is not currently finalized: ${entry.runId}`)
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

function activeYamlLines(source) {
  return source
    .split(/\r\n|[\r\n]/)
    .map((line) => line.replace(/\s+$/, ''))
    .filter((line) => line.trim() && !line.trimStart().startsWith('#'))
}

function yamlMapping(line) {
  const match = line.match(
    /^(\s*)(?:(["'])([^"']+)\2|([A-Za-z_][A-Za-z0-9_-]*))\s*:(.*)$/,
  )
  if (!match) return null
  return {
    indent: match[1].length,
    key: match[3] ?? match[4],
    lineIndent: match[1].length,
    quoted: Boolean(match[2]),
    value: match[5].replace(/\s+#.*$/, '').trim(),
  }
}

function yamlSequenceMapping(line) {
  const match = line.match(
    /^(\s*)-\s+(?:(["'])([^"']+)\2|([A-Za-z_][A-Za-z0-9_-]*))\s*:(.*)$/,
  )
  if (!match) return null
  return {
    indent: match[1].length + 2,
    key: match[3] ?? match[4],
    lineIndent: match[1].length,
    quoted: Boolean(match[2]),
    value: match[5].replace(/\s+#.*$/, '').trim(),
  }
}

function conservativeYamlBlock(
  lines,
  { rejectFlowValues = true, rejectPermissionKeys = true } = {},
) {
  let scalarParentIndent = null
  for (const line of lines) {
    const lineIndent = line.match(/^\s*/)?.[0].length ?? 0
    if (scalarParentIndent !== null && lineIndent > scalarParentIndent) continue
    scalarParentIndent = null

    const mapping = yamlMapping(line) ?? yamlSequenceMapping(line)
    if (
      !mapping ||
      mapping.quoted ||
      (rejectPermissionKeys && mapping.key === 'permissions') ||
      (rejectFlowValues && /^[{[]/.test(mapping.value)) ||
      /^[!&*]/.test(mapping.value)
    ) {
      return false
    }
    if (/^[>|][+-]?(?:[1-9])?$/.test(mapping.value)) {
      scalarParentIndent = mapping.lineIndent
    }
  }
  return true
}

export function historicalWorkflowIsLowPrivilege(source) {
  if (unsupportedYamlCharacters.test(source)) return false
  const lines = activeYamlLines(source)
  if (
    lines.some(
      (line) =>
        line.includes('\t') ||
        /^\s*<<\s*:/.test(line) ||
        /^\s*[?:]\s/.test(line) ||
        /^(?:---|\.\.\.)\s*(?:#.*)?$/.test(line),
    )
  ) {
    return false
  }
  if (
    !conservativeYamlBlock(lines, {
      rejectFlowValues: false,
      rejectPermissionKeys: false,
    })
  ) {
    return false
  }
  const mappings = lines.map((line, index) => ({
    index,
    mapping: yamlMapping(line),
  }))
  if (
    mappings.some(({ mapping }) => mapping?.quoted) ||
    mappings.some(
      ({ mapping }) =>
        mapping &&
        (mapping.key === 'pull_request_target' ||
          (mapping.key === 'permissions' && mapping.indent > 0)),
    )
  ) {
    return false
  }
  const topLevelMappings = mappings.filter(({ mapping }) => mapping?.indent === 0)
  const topLevelKeys = topLevelMappings.map(({ mapping }) => mapping.key)
  if (new Set(topLevelKeys).size !== topLevelKeys.length) return false

  const blockLines = ({ index }) => {
    const endOffset = lines.slice(index + 1).findIndex((line) => /^\S/.test(line))
    return endOffset === -1
      ? lines.slice(index + 1)
      : lines.slice(index + 1, index + 1 + endOffset)
  }

  const onEntries = topLevelMappings.filter(({ mapping }) => mapping.key === 'on')
  if (onEntries.length !== 1 || onEntries[0].mapping.value) return false
  const triggerBlock = blockLines(onEntries[0])
  const triggerBoundaryLines = triggerBlock.filter(
    (line) => (line.match(/^\s*/)?.[0].length ?? 0) <= 2,
  )
  const triggerMappings = triggerBoundaryLines
    .map(yamlMapping)
    .filter((mapping) => mapping?.indent === 2)
  if (
    triggerBoundaryLines.length !== 1 ||
    triggerMappings.length !== 1 ||
    triggerMappings[0].key !== 'pull_request' ||
    triggerMappings[0].value
  ) {
    return false
  }

  const permissionEntries = topLevelMappings.filter(
    ({ mapping }) => mapping.key === 'permissions',
  )
  if (permissionEntries.length !== 1 || permissionEntries[0].mapping.value) return false
  const permissionLines = blockLines(permissionEntries[0])
  const permissions = new Map()
  for (const line of permissionLines) {
    const mapping = yamlMapping(line)
    if (
      !mapping ||
      mapping.indent !== 2 ||
      !['read', 'none'].includes(mapping.value) ||
      permissions.has(mapping.key)
    ) {
      return false
    }
    permissions.set(mapping.key, mapping.value)
  }
  if (permissions.get('contents') !== 'read') return false

  const jobsEntries = topLevelMappings.filter(({ mapping }) => mapping.key === 'jobs')
  if (jobsEntries.length !== 1 || jobsEntries[0].mapping.value) return false
  const jobsBlock = blockLines(jobsEntries[0])
  if (!conservativeYamlBlock(jobsBlock)) return false
  const jobDeclarations = jobsBlock.filter(
    (line) => (line.match(/^\s*/)?.[0].length ?? 0) <= 2,
  )
  return (
    jobDeclarations.length > 0 &&
    jobDeclarations.every((line) => {
      const mapping = yamlMapping(line)
      return mapping?.indent === 2 && !mapping.value
    })
  )
}

async function validateLoopMode({
  loopRoot = DEFAULT_LOOP_ROOT,
  activation = false,
  targetCompatibility = false,
  environment = process.env,
  identityCommand,
} = {}) {
  const targetRequired = [
    'SKILL.md',
    'LOOP.md',
    'state.md',
    'dependencies.md',
    'evolve/metrics.json',
    'logs/index.jsonl',
    'logs/triggers.jsonl',
    'screen-shots/.gitignore',
  ]
  const controlPlaneRequired = [
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
    'scripts/lib/bootstrap-authorization.mjs',
    'scripts/lib/evidence.mjs',
    'scripts/lib/evolve.mjs',
    'scripts/lib/finalization-journal.mjs',
    'scripts/lib/active-journal.mjs',
    'scripts/lib/github.mjs',
    'scripts/lib/github-identity.mjs',
    'scripts/lib/review-publication.mjs',
    'scripts/lib/trusted-control-plane.mjs',
    'scripts/github-command-gate.mjs',
    'scripts/publish-review.mjs',
    'scripts/identity-bin/gh',
    'scripts/identity-bin/git',
    'scripts/lib/issue-claim.mjs',
    'scripts/lib/lifecycle-status.mjs',
    'scripts/lib/notifications.mjs',
    'scripts/lib/owner-gate.mjs',
    'scripts/lib/run-store.mjs',
    'scripts/lib/validation.mjs',
    'scripts/with-github-identity.mjs',
    'scripts/with-github-identity',
    'scripts/loopctl.mjs',
    'scripts/runtime.mjs',
    'triggers/detect-work.mjs',
  ]
  const required = targetCompatibility
    ? targetRequired
    : [...targetRequired, ...controlPlaneRequired]
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
  if (!historicalWorkflowIsLowPrivilege(evidenceWorkflowSource)) {
    throw new Error(
      'historical target evidence workflow must remain a low-privilege pull_request workflow',
    )
  }
  const verificationStep = evidenceWorkflowSource.match(
    /      - name: Run authoritative verification\n([\s\S]*?)(?=\n      - name:)/,
  )?.[1]
  const enforcementStep = evidenceWorkflowSource.match(
    /      - name: Enforce verification result\n([\s\S]*?)(?=\n      - name:|$)/,
  )?.[1]
  if (
    (!targetCompatibility && !verificationStep?.includes('pnpm verify')) ||
    (!targetCompatibility &&
      (verificationStep.includes('if:') ||
        !enforcementStep ||
        enforcementStep.includes("steps.run.outputs.has_run == 'true'") ||
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
          'control/loops/issue-dev-loop/scripts/validate-candidate-control-plane.mjs',
        ) ||
        !evidenceWorkflowSource.includes(
          '--trusted-control-sha "${{ github.event.pull_request.base.sha }}"',
        ) ||
        !evidenceWorkflowSource.includes(
          '--file control/loops/issue-dev-loop/scripts/verifier.Dockerfile control/loops/issue-dev-loop/scripts',
        ) ||
        !evidenceWorkflowSource.includes(
          'node control/loops/issue-dev-loop/scripts/generate-evidence.mjs',
        ) ||
        !evidenceWorkflowSource.includes('pnpm install --frozen-lockfile --ignore-scripts') ||
        (evidenceWorkflowSource.match(/docker run --rm --network none/g)?.length ?? 0) < 2 ||
        !evidenceWorkflowSource.includes('src=${GITHUB_WORKSPACE}/trusted,dst=/source,readonly') ||
        !evidenceWorkflowSource.includes('pnpm test') ||
        !evidenceWorkflowSource.includes(
          'git config --global --add safe.directory /work; pnpm verify',
        ) ||
        !evidenceWorkflowSource.includes(
          'git config --global --add safe.directory /work; pnpm test',
        ) ||
        !evidenceWorkflowSource.includes(
          '--trusted-workflow-sha "${{ steps.run.outputs.base_sha }}"',
        ) ||
        !evidenceWorkflowSource.includes(
          '--workflow-base-sha "${{ github.event.pull_request.base.sha }}"',
        ) ||
        !evidenceWorkflowSource.includes(
          '--workflow-run-sha "${{ github.event.pull_request.head.sha }}"',
        ) ||
        !evidenceWorkflowSource.includes(
          'PR_HEAD_REF: ${{ github.event.pull_request.head.ref }}',
        ) ||
        !evidenceWorkflowSource.includes('--branch "$PR_HEAD_REF"') ||
        !evidenceWorkflowSource.includes('--baseline-status')))
  ) {
    throw new Error(
      'evidence workflow must use a low-privilege isolated PR run plus owner-merged controls and baseline tests',
    )
  }
  if (!targetCompatibility) {
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
    for (const roleFile of ['echo-ui-pr-reviewer.toml', 'echo-ui-review-adjudicator.toml']) {
      const roleSource = await readFile(path.resolve(loopRoot, 'agents', roleFile), 'utf8')
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

export function validateLoop(options = {}) {
  const { historicalCapability, ...validatedOptions } = options
  if (historicalCapability) {
    consumeHistoricalValidationCapability(historicalCapability)
    return validateLoopMode({
      ...validatedOptions,
      activation: false,
      targetCompatibility: true,
    })
  }
  return validateLoopMode({ ...validatedOptions, targetCompatibility: false })
}
