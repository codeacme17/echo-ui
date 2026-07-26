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
const trustedControlSha = assertNonEmpty(
  args['trusted-control-sha'],
  '--trusted-control-sha',
)
const durableIssueNumber = args['durable-issue-number']
  ? Number(args['durable-issue-number'])
  : null
const durableImplementationCommit = args['durable-implementation-commit']
const durablePrHead = args['durable-pr-head']

for (const [name, sha] of [
  ['baseSha', baseSha],
  ['headSha', headSha],
  ['trustedControlSha', trustedControlSha],
]) {
  if (!/^[0-9a-f]{40}$/i.test(sha)) throw new Error(`${name} must be a full Git SHA`)
}

const [checkedOutHead, mergeBase, trustedControlMergeBase] = await Promise.all([
  execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot }),
  execFileAsync('git', ['merge-base', baseSha, headSha], { cwd: repositoryRoot }),
  execFileAsync('git', ['merge-base', baseSha, trustedControlSha], { cwd: repositoryRoot }),
])
if (
  checkedOutHead.stdout.trim() !== headSha ||
  mergeBase.stdout.trim() !== baseSha ||
  trustedControlMergeBase.stdout.trim() !== baseSha
) {
  throw new Error('candidate control-plane validation requires the exact descendant PR head')
}

const durableMode = durableIssueNumber !== null
let run
if (durableMode) {
  if (
    !Number.isInteger(durableIssueNumber) ||
    durableIssueNumber < 1 ||
    ![durableImplementationCommit, durablePrHead].every(
      (value) => value === 'none' || /^[0-9a-f]{40}$/i.test(value ?? ''),
    )
  ) {
    throw new Error('durable candidate metadata is invalid')
  }
  run = {
    runId,
    issueNumber: durableIssueNumber,
    baseSha,
    branch: `codex/issue-${durableIssueNumber}`,
    finishedAt: null,
    implementationCommit:
      durableImplementationCommit === 'none' ? null : durableImplementationCommit,
    headSha: durablePrHead === 'none' ? null : durablePrHead,
  }
} else {
  const runPath = path.join(loopRoot, 'logs', 'runs', runId, 'run.json')
  const runStats = await lstat(runPath)
  if (!runStats.isFile() || runStats.isSymbolicLink()) {
    throw new Error('candidate run metadata must be a regular file')
  }
  run = await readJson(runPath)
}
if (
  run.runId !== runId ||
  run.baseSha !== baseSha ||
  run.branch !== `codex/issue-${run.issueNumber}` ||
  run.finishedAt !== null ||
  (run.implementationCommit !== null &&
    !/^[0-9a-f]{40}$/i.test(run.implementationCommit ?? '')) ||
  (run.headSha !== null && !/^[0-9a-f]{40}$/i.test(run.headSha ?? ''))
) {
  throw new Error('candidate run metadata does not match the protected diff')
}
if (run.implementationCommit) {
  await execFileAsync('git', ['merge-base', '--is-ancestor', run.implementationCommit, headSha], {
    cwd: repositoryRoot,
  })
}
if (run.headSha) {
  await execFileAsync('git', ['merge-base', '--is-ancestor', run.headSha, headSha], {
    cwd: repositoryRoot,
  })
}

const changed = await execFileAsync(
  'git',
  [
    'diff',
    '--name-only',
    '-z',
    '--no-renames',
    '--diff-filter=ACDMRTUXB',
    `${baseSha}...${headSha}`,
  ],
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
const ownerMergedSyncFiles = new Set(['scripts/verify-docs-ui.mjs'])
const changedFiles = changed.stdout
  .split('\0')
  .filter(Boolean)
const protectedFiles = changedFiles.filter((file) => {
    if (file.startsWith('loops/issue-dev-loop/')) {
      return !permittedRunRoots.some((root) => file.startsWith(root))
    }
    const basename = path.basename(file)
    return (
      file === 'loops/_shared' ||
      file.startsWith('loops/_shared/') ||
      file === '.agents' ||
      file.startsWith('.agents/') ||
      file === '.claude' ||
      file.startsWith('.claude/') ||
      file === '.codex' ||
      file.startsWith('.codex/') ||
      file === '.cursor' ||
      file.startsWith('.cursor/') ||
      file === '.github' ||
      file.startsWith('.github/') ||
      file === '.netlify' ||
      file.startsWith('.netlify/') ||
      file === '.openai' ||
      file.startsWith('.openai/') ||
      file === '.vercel' ||
      file.startsWith('.vercel/') ||
      file === 'scripts' ||
      file.startsWith('scripts/') ||
      file === 'patches' ||
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
const violations = []
for (const file of protectedFiles) {
  if (ownerMergedSyncFiles.has(file)) {
    const [trustedEntry, candidateEntry] = await Promise.all([
      execFileAsync('git', ['ls-tree', '-z', trustedControlSha, '--', file], {
        cwd: repositoryRoot,
      }),
      execFileAsync('git', ['ls-tree', '-z', headSha, '--', file], {
        cwd: repositoryRoot,
      }),
    ])
    if (
      trustedEntry.stdout.length > 0 &&
      trustedEntry.stdout === candidateEntry.stdout &&
      trustedEntry.stdout.startsWith('100644 blob ')
    ) {
      continue
    }
  }
  violations.push(file)
}
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
  `${JSON.stringify({
    valid: true,
    runId,
    baseSha,
    headSha,
    trustedControlSha,
    changedFiles: changedFiles.length,
  })}\n`,
)
