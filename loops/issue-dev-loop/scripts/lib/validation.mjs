import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { DEFAULT_LOOP_ROOT, pathExists, readJson } from './common.mjs'

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

export async function validateLoop({ loopRoot = DEFAULT_LOOP_ROOT } = {}) {
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
    'scripts/generate-evidence.mjs',
    'scripts/resolve-run.mjs',
    'scripts/lib/common.mjs',
    'scripts/lib/evidence.mjs',
    'scripts/lib/evolve.mjs',
    'scripts/lib/github.mjs',
    'scripts/lib/notifications.mjs',
    'scripts/lib/owner-gate.mjs',
    'scripts/lib/run-store.mjs',
    'scripts/lib/validation.mjs',
    'logs/index.jsonl',
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
  const channel = await readJson(path.join(sharedChannelRoot, 'channel.json'))
  if (
    typeof channel.ownerGitHubLogin !== 'string' ||
    !Object.hasOwn(channel, 'automationGitHubLogin') ||
    !Array.isArray(channel.immediateTypes)
  ) {
    throw new Error('owner channel is missing identity or immediate notification configuration')
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

  const contract = await readFile(path.join(loopRoot, 'LOOP.md'), 'utf8')
  const skill = await readFile(path.join(loopRoot, 'SKILL.md'), 'utf8')
  for (const phrase of [
    'draft PR targeting `dev`',
    'approve, auto-merge, or merge any PR',
    'Only `observe-owner-merge`',
    'exact reviewed head SHA',
    'No eligible work is a successful no-op',
  ]) {
    if (!contract.includes(phrase)) throw new Error(`LOOP.md is missing invariant: ${phrase}`)
  }
  for (const phrase of [
    '$implement',
    'echo_ui_pr_reviewer',
    'echo_ui_loop_evolver',
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
