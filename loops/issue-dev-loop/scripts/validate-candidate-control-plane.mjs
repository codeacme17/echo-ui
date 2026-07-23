#!/usr/bin/env node

import { lstat } from 'node:fs/promises'
import path from 'node:path'

import { assertNonEmpty, execFileAsync, parseArguments, readJson } from './lib/common.mjs'

const args = parseArguments(process.argv.slice(2))
const loopRoot = path.resolve(assertNonEmpty(args['loop-root'], '--loop-root'))
const repositoryRoot = path.resolve(loopRoot, '..', '..')
const runId = assertNonEmpty(args['run-id'], '--run-id')
const baseSha = assertNonEmpty(args['base-sha'], '--base-sha')
const headSha = assertNonEmpty(args['head-sha'], '--head-sha')

for (const [name, sha] of [
  ['baseSha', baseSha],
  ['headSha', headSha],
]) {
  if (!/^[0-9a-f]{40}$/i.test(sha)) throw new Error(`${name} must be a full Git SHA`)
}

const [checkedOutHead, mergeBase] = await Promise.all([
  execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot }),
  execFileAsync('git', ['merge-base', baseSha, headSha], { cwd: repositoryRoot }),
])
if (checkedOutHead.stdout.trim() !== headSha || mergeBase.stdout.trim() !== baseSha) {
  throw new Error('candidate control-plane validation requires the exact descendant PR head')
}

const runPath = path.join(loopRoot, 'logs', 'runs', runId, 'run.json')
const runStats = await lstat(runPath)
if (!runStats.isFile() || runStats.isSymbolicLink()) {
  throw new Error('candidate run metadata must be a regular file')
}
const run = await readJson(runPath)
if (
  run.runId !== runId ||
  run.baseSha !== baseSha ||
  run.branch !== `codex/issue-${run.issueNumber}` ||
  run.finishedAt !== null ||
  !/^[0-9a-f]{40}$/i.test(run.implementationCommit ?? '') ||
  (run.headSha !== null && !/^[0-9a-f]{40}$/i.test(run.headSha ?? ''))
) {
  throw new Error('candidate run metadata does not match the protected diff')
}
await execFileAsync('git', ['merge-base', '--is-ancestor', run.implementationCommit, headSha], {
  cwd: repositoryRoot,
})
if (run.headSha) {
  await execFileAsync('git', ['merge-base', '--is-ancestor', run.headSha, headSha], {
    cwd: repositoryRoot,
  })
}

const changed = await execFileAsync(
  'git',
  ['diff', '--name-only', '--diff-filter=ACDMRTUXB', `${baseSha}...${headSha}`],
  { cwd: repositoryRoot, maxBuffer: 4 * 1024 * 1024 },
)
const permittedRunRoots = [
  `loops/issue-dev-loop/handoffs/${runId}/`,
  `loops/issue-dev-loop/logs/runs/${runId}/`,
  `loops/issue-dev-loop/evidence/${runId}/`,
  `loops/issue-dev-loop/screen-shots/${runId}/`,
]
const protectedRootFiles = new Set([
  '.cursorrules',
  '.npmrc',
  'AGENTS.md',
  'CLAUDE.md',
  'CODEX.md',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
])
const protectedDeploymentFiles = new Set([
  'amplify.yml',
  'firebase.json',
  'fly.toml',
  'netlify.toml',
  'now.json',
  'railway.json',
  'render.yaml',
  'vercel.json',
])
const changedFiles = changed.stdout
  .split('\n')
  .filter(Boolean)
const violations = changedFiles.filter((file) => {
    if (file.startsWith('loops/issue-dev-loop/')) {
      return !permittedRunRoots.some((root) => file.startsWith(root))
    }
    const basename = path.basename(file)
    return (
      file.startsWith('loops/_shared/') ||
      file.startsWith('.agents/') ||
      file.startsWith('.claude/') ||
      file.startsWith('.codex/') ||
      file.startsWith('.cursor/') ||
      file.startsWith('.github/') ||
      file.startsWith('.netlify/') ||
      file.startsWith('.openai/') ||
      file.startsWith('.vercel/') ||
      file.startsWith('scripts/') ||
      file.startsWith('patches/') ||
      file.split('/').includes('node_modules') ||
      basename === 'package.json' ||
      /^\.?pnpmfile\.[^.]+$/.test(basename) ||
      /^(?:wrangler)(?:\.[^.]+)*\.(?:json|jsonc|toml)$/.test(basename) ||
      protectedDeploymentFiles.has(basename) ||
      protectedRootFiles.has(file) ||
      /^(?:eslint|vite|vitest|playwright|next|postcss|tailwind|webpack|rollup|babel|jest|stylelint)\.config\.[^.]+$/.test(
        basename,
      ) ||
      /^tsconfig(?:\.[^.]+)*\.json$/.test(basename)
    )
  })
for (const file of changedFiles) {
  if (!permittedRunRoots.some((root) => file.startsWith(root))) continue
  try {
    const stats = await lstat(path.join(repositoryRoot, file))
    if (!stats.isFile() || stats.isSymbolicLink()) violations.push(file)
  } catch (error) {
    if (error?.code === 'ENOENT') violations.push(file)
    else throw error
  }
}
if (violations.length > 0) {
  throw new Error(
    `issue branches cannot modify the trusted control or verification plane:\n${violations.join('\n')}`,
  )
}

process.stdout.write(
  `${JSON.stringify({ valid: true, runId, baseSha, headSha, changedFiles: changedFiles.length })}\n`,
)
