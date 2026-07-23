import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { chmod, cp, mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import { checkpointPublicationBody } from '../scripts/lib/checkpoint-proof.mjs'
import {
  prepareEvolveRequestPublication,
  recordEvolveRequestPublication,
} from '../scripts/lib/evolve.mjs'
import { resolveExecutable } from '../scripts/lib/github-identity.mjs'

const execFileAsync = promisify(execFile)
const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryScriptsRoot = path.resolve(testDirectory, '..', 'scripts')
let routerPath
let routerLauncherPath
let credentialHelper

async function fixtureManifestFiles(bundleRoot) {
  const files = []
  const visit = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name)
      if (entry.isDirectory()) await visit(target)
      else if (entry.isFile() && entry.name !== 'trusted-control-plane.json') files.push(target)
    }
  }
  await visit(bundleRoot)
  return Promise.all(
    files.sort().map(async (target) => ({
      path: path.relative(bundleRoot, target),
      sha256: createHash('sha256')
        .update(await readFile(target))
        .digest('hex'),
    })),
  )
}

async function createFixture({
  activeRun = true,
  recordedPr = true,
  readyToMark = false,
  realGit = false,
  liveDraft = true,
  ownerFeedback = false,
} = {}) {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-identity-routing-'))
  const loopRoot = path.join(parent, 'issue-dev-loop')
  const channelRoot = path.join(parent, '_shared', 'owner-channel')
  const trustedBundleRoot = path.join(parent, 'trusted-bundle')
  const trustedLoopRoot = path.join(trustedBundleRoot, 'issue-dev-loop')
  const trustedChannelRoot = path.join(trustedBundleRoot, '_shared', 'owner-channel')
  const binRoot = path.join(parent, 'bin')
  const automationProfile = path.join(parent, 'automation-profile')
  const reviewerProfile = path.join(parent, 'reviewer-profile')
  await Promise.all([
    mkdir(channelRoot, { recursive: true }),
    mkdir(trustedChannelRoot, { recursive: true }),
    mkdir(path.join(loopRoot, 'scripts'), { recursive: true }),
    mkdir(path.join(loopRoot, 'logs', 'runs'), { recursive: true }),
    mkdir(path.join(loopRoot, 'handoffs'), { recursive: true }),
    mkdir(path.join(loopRoot, 'evolve', 'requests'), { recursive: true }),
    mkdir(binRoot, { recursive: true }),
    mkdir(automationProfile, { recursive: true }),
    mkdir(reviewerProfile, { recursive: true }),
    cp(repositoryScriptsRoot, path.join(trustedLoopRoot, 'scripts'), { recursive: true }),
  ])
  const channel = {
    ownerGitHubLogin: 'owner-user',
    automationGitHubLogin: 'executor-user',
    reviewerGitHubLogin: 'reviewer-user',
    automationGitHubConfigEnvironmentVariable: 'ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR',
    reviewerGitHubConfigEnvironmentVariable: 'ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR',
    untrustedRootsEnvironmentVariable: 'ECHO_UI_LOOP_UNTRUSTED_ROOTS',
    informationalImmediateTypes: ['pr_completed'],
    stateIssueNumber: 999,
    repository: 'example/repo',
  }
  await Promise.all([
    writeFile(path.join(channelRoot, 'channel.json'), `${JSON.stringify(channel)}\n`, 'utf8'),
    writeFile(
      path.join(trustedChannelRoot, 'channel.json'),
      `${JSON.stringify(channel)}\n`,
      'utf8',
    ),
  ])
  await writeFile(path.join(automationProfile, 'identity'), 'executor-user\n', 'utf8')
  await writeFile(path.join(reviewerProfile, 'identity'), 'reviewer-user\n', 'utf8')
  await Promise.all([
    chmod(automationProfile, 0o700),
    chmod(reviewerProfile, 0o700),
    chmod(path.join(automationProfile, 'identity'), 0o600),
    chmod(path.join(reviewerProfile, 'identity'), 0o600),
  ])
  if (activeRun) {
    const runRoot = path.join(loopRoot, 'logs', 'runs', 'fixture-run')
    const briefRoot = path.join(loopRoot, 'handoffs', 'fixture-run')
    const baseSha = 'a'.repeat(40)
    const headSha = recordedPr ? 'b'.repeat(40) : null
    const implementationCommit = 'c'.repeat(40)
    const startedAt = '2026-07-23T00:00:00.000Z'
    const briefSource = 'fixture implementation brief\n'
    const run = {
      schemaVersion: 1,
      runId: 'fixture-run',
      issueNumber: 123,
      issueTitle: 'Fixture issue',
      issueUrl: 'https://github.com/example/repo/issues/123',
      baseBranch: 'dev',
      baseSha,
      status: 'running',
      startedAt,
      finishedAt: null,
      branch: 'codex/issue-123',
      prUrl: recordedPr ? 'https://github.com/example/repo/pull/106' : null,
      headSha,
      mergeSha: null,
      issueSnapshot: {
        title: 'Fixture issue',
        body: 'Fixture body',
        labels: ['codex-ready'],
        url: 'https://github.com/example/repo/issues/123',
        capturedAt: startedAt,
      },
      briefDigest: null,
      uiEvidenceRequired: false,
      implementationCommit,
    }
    const events = [
      {
        schemaVersion: 1,
        runId: 'fixture-run',
        type: 'loop_started',
        timestamp: startedAt,
        status: 'running',
        payload: { issueNumber: 123, branch: 'codex/issue-123' },
      },
      {
        schemaVersion: 1,
        runId: 'fixture-run',
        type: 'implementation_completed',
        timestamp: '2026-07-23T00:01:00.000Z',
        status: 'passed',
        payload: { agent: '$implement', commitSha: implementationCommit },
      },
    ]
    if (recordedPr) {
      events.push({
        schemaVersion: 1,
        runId: 'fixture-run',
        type: 'pr_published',
        timestamp: '2026-07-23T00:02:00.000Z',
        status: 'draft',
        payload: {
          prUrl: run.prUrl,
          headSha,
          baseBranch: 'dev',
          branch: run.branch,
        },
      })
    }
    if (readyToMark) {
      events.push(
        {
          schemaVersion: 1,
          runId: 'fixture-run',
          type: 'verification_completed',
          timestamp: '2026-07-23T00:03:00.000Z',
          status: 'passed',
          payload: { headSha, verdict: 'passed' },
        },
        {
          schemaVersion: 1,
          runId: 'fixture-run',
          type: 'review_completed',
          timestamp: '2026-07-23T00:04:00.000Z',
          status: 'passed',
          payload: { headSha, verdict: 'PASS' },
        },
      )
    }
    if (ownerFeedback) {
      events.push({
        schemaVersion: 1,
        runId: 'fixture-run',
        type: 'owner_response_observed',
        timestamp: '2026-07-23T00:04:30.000Z',
        status: 'observed',
        payload: { actor: 'owner-user' },
      })
    }
    const record = {
      schemaVersion: 1,
      kind: 'active-checkpoint',
      run,
      briefSource,
      events: [...events],
      artifacts: [],
      updatedAt: events.at(-1).timestamp,
    }
    const publication = checkpointPublicationBody(record)
    events.push({
      schemaVersion: 1,
      runId: 'fixture-run',
      type: 'checkpoint_published',
      timestamp: '2026-07-23T00:05:00.000Z',
      status: 'published',
      payload: {
        commentUrl: 'https://github.com/example/repo/issues/999#issuecomment-1',
        digest: publication.digest,
        checkpointUpdatedAt: record.updatedAt,
      },
    })
    await Promise.all([mkdir(runRoot, { recursive: true }), mkdir(briefRoot, { recursive: true })])
    await writeFile(path.join(runRoot, 'run.json'), `${JSON.stringify(run)}\n`, 'utf8')
    await writeFile(
      path.join(runRoot, 'events.jsonl'),
      `${events.map((event) => JSON.stringify(event)).join('\n')}\n`,
      'utf8',
    )
    await writeFile(
      path.join(runRoot, 'checkpoint-result.json'),
      `${JSON.stringify(record)}\n`,
      'utf8',
    )
    await writeFile(path.join(briefRoot, 'implementation-brief.md'), briefSource, 'utf8')
    await writeFile(
      path.join(parent, 'checkpoint-comment.json'),
      `${JSON.stringify({
        user: { login: 'executor-user' },
        body: publication.body,
      })}\n`,
      'utf8',
    )
    await writeFile(
      path.join(parent, 'live-pr.json'),
      `${JSON.stringify({
        state: 'open',
        draft: liveDraft,
        user: { login: 'executor-user' },
        base: { ref: 'dev', repo: { full_name: 'example/repo' } },
        head: {
          ref: 'codex/issue-123',
          sha: headSha,
          repo: { full_name: 'example/repo' },
        },
      })}\n`,
      'utf8',
    )
  }
  await writeFile(path.join(parent, 'reviews.json'), '[]\n', 'utf8')
  await writeFile(
    path.join(loopRoot, 'evolve', 'metrics.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      evolveDue: false,
      pendingRequestId: null,
    })}\n`,
    'utf8',
  )
  const loopctlPath = path.join(trustedLoopRoot, 'scripts', 'loopctl.mjs')
  await writeFile(
    loopctlPath,
    `import { spawnSync } from 'node:child_process'

const commandArguments = process.argv.slice(2)
const loopRootIndex = commandArguments.indexOf('--loop-root')
if (loopRootIndex !== -1) commandArguments.splice(loopRootIndex, 2)

if (commandArguments[0] === 'spawn') {
  if (!['git', 'gh'].includes(commandArguments[1])) {
    throw new Error('descendant processes cannot run untrusted executables')
  }
  const result = spawnSync(commandArguments[1], commandArguments.slice(2), {
    env: process.env,
    stdio: 'inherit',
  })
  process.exitCode = result.status ?? 1
} else if (commandArguments[0] === 'start') {
  const issueIndex = commandArguments.indexOf('--issue')
  const issue = commandArguments[issueIndex + 1]
  for (const command of [
    ['api', 'user'],
    ['api', \`repos/example/repo/issues/\${issue}/labels\`, '--method', 'POST', '-f', 'labels[]=loop:claimed']
  ]) {
    const result = spawnSync('gh', command, { env: process.env, stdio: 'inherit' })
    if (result.status !== 0) {
      process.exitCode = result.status ?? 1
      break
    }
  }
} else {
  process.stdout.write(JSON.stringify({
    config: process.env.GH_CONFIG_DIR,
    hasGhToken: Boolean(process.env.GH_TOKEN || process.env.GITHUB_TOKEN),
    gitConfig: [
      process.env.GIT_CONFIG_COUNT,
      process.env.GIT_CONFIG_KEY_0,
      process.env.GIT_CONFIG_VALUE_0,
      process.env.GIT_CONFIG_KEY_1,
      process.env.GIT_CONFIG_VALUE_1
    ],
    gitIsolation: [process.env.GIT_CONFIG_GLOBAL, process.env.GIT_CONFIG_NOSYSTEM],
    exposesOtherProfiles: Boolean(
      process.env.ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR ||
      process.env.ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR
    ),
    exposesRealTools: Boolean(
      process.env.ECHO_UI_LOOP_REAL_GIT ||
      process.env.ECHO_UI_LOOP_REAL_GH
    ),
    hasExecutionHooks: Boolean(
      process.env.NODE_OPTIONS ||
      process.env.NODE_PATH ||
      process.env.GIT_EXTERNAL_DIFF ||
      process.env.GIT_EXEC_PATH ||
      process.env.GIT_SSH_COMMAND ||
      process.env.GH_BROWSER ||
      process.env.BROWSER
    ),
    hasProxyEnvironment: Boolean(
      process.env.HTTP_PROXY ||
      process.env.HTTPS_PROXY ||
      process.env.NO_PROXY ||
      process.env.http_proxy ||
      process.env.https_proxy ||
      process.env.no_proxy
    )
  }))
}
`,
    'utf8',
  )

  const fakeGh = path.join(binRoot, 'gh')
  await writeFile(
    fakeGh,
    `#!/bin/sh
umask 077
parent_dir=\${GH_CONFIG_DIR%/*}
first_line() {
  IFS= read -r line < "$1"
  printf '%s\\n' "$line"
}
if [ "$1 $2 $3 $4" != "api user --jq .login" ]; then
  if [ "$1 $2" = "api user" ]; then
    printf 'probe\\n' >> "$GH_CONFIG_DIR/probes"
    first_line "$GH_CONFIG_DIR/identity"
    exit 0
  fi
  if [ "$1" = "api" ] && [ "$2" = "repos/example/repo/issues/comments/1" ]; then
    first_line "$parent_dir/checkpoint-comment.json"
    exit 0
  fi
  if [ "$1" = "api" ] && [ "$2" = "repos/example/repo/pulls/106" ]; then
    first_line "$parent_dir/live-pr.json"
    exit 0
  fi
  if [ "$1" = "api" ] && [ "$2" = "repos/example/repo/pulls/106/reviews?per_page=100&page=1" ]; then
    first_line "$parent_dir/reviews.json"
    exit 0
  fi
  if [ "$1" = "api" ] && [ "$2" = "repos/example/repo/pulls/106/reviews/400/comments?per_page=100&page=1" ]; then
    printf '[]\\n'
    exit 0
  fi
  if [ "$1" = "api" ] && [ "$2" = "repos/example/repo/issues/comments/2" ]; then
    first_line "$parent_dir/evolve-comment.json"
    exit 0
  fi
  if [ "$1 $2" = "pr review" ]; then
    echo "comment review published"
    exit 0
  fi
  ${JSON.stringify(process.execPath)} -e 'process.stdout.write(JSON.stringify({args: process.argv.slice(1)}))' -- "$@"
  exit 0
fi
printf 'probe\\n' >> "$GH_CONFIG_DIR/probes"
first_line "$GH_CONFIG_DIR/identity"
`,
    'utf8',
  )
  await chmod(fakeGh, 0o755)

  const fakeGit = path.join(binRoot, 'git')
  if (!realGit) {
    await writeFile(
      fakeGit,
      `#!/bin/sh
if [ "$1 $2 $3" = "remote get-url origin" ]; then
  echo "https://github.com/example/repo.git"
  exit 0
fi
if [ "$1 $2 $3 $4" = "remote get-url --push origin" ]; then
  echo "https://github.com/example/repo.git"
  exit 0
fi
if [ "$1 $2 $3" = "config --local --get-regexp" ]; then
  exit 1
fi
if [ "$1 $2" = "branch --show-current" ]; then
  echo "codex/issue-123"
  exit 0
fi
if [ "$1 $2" = "rev-parse HEAD" ]; then
  echo "${'b'.repeat(40)}"
  exit 0
fi
if [ "$1 $2" = "status --porcelain" ]; then
  if [ -f ${JSON.stringify(path.join(parent, 'dirty-git'))} ]; then
    echo " M src/unsafe.ts"
  fi
  exit 0
fi
if [ "$1" = "merge-base" ]; then
  exit 0
fi
if [ "$1 $2" = "diff --name-status" ]; then
  if [ -f ${JSON.stringify(path.join(parent, 'unsafe-trailing-diff'))} ]; then
    printf "M\\tsrc/unsafe.ts\\n"
  fi
  exit 0
fi
${JSON.stringify(process.execPath)} -e 'process.stdout.write(JSON.stringify({args: process.argv.slice(1), config: process.env.GH_CONFIG_DIR, hasGhToken: Boolean(process.env.GH_TOKEN || process.env.GITHUB_TOKEN), gitConfig: Array.from({length: Number(process.env.GIT_CONFIG_COUNT)}, (_, index) => [process.env[\`GIT_CONFIG_KEY_\${index}\`], process.env[\`GIT_CONFIG_VALUE_\${index}\`]]).flat()}))' -- "$@"
`,
      'utf8',
    )
    await chmod(fakeGit, 0o755)
  }
  const impostorGh = path.join(parent, 'gh')
  await writeFile(impostorGh, '#!/bin/sh\nexit 0\n', 'utf8')
  await chmod(impostorGh, 0o755)

  routerPath = path.join(trustedLoopRoot, 'scripts', 'with-github-identity.mjs')
  routerLauncherPath = path.join(trustedLoopRoot, 'scripts', 'with-github-identity')
  const commandGatePath = await realpath(
    path.join(trustedLoopRoot, 'scripts', 'github-command-gate.mjs'),
  )
  credentialHelper = `!'${process.execPath}' '${commandGatePath}' credential`
  const gitExecutable = realGit ? await resolveExecutable('git', process.env) : fakeGit
  const manifest = {
    schemaVersion: 1,
    sourceRepository: 'example/repo',
    sourceCommit: 'a'.repeat(40),
    installedAt: '2026-07-23T00:00:00.000Z',
    bundleRoot: trustedBundleRoot,
    controlPlaneRoot: trustedLoopRoot,
    executables: {
      node: await realpath(process.execPath),
      git: await realpath(gitExecutable),
      gh: await realpath(fakeGh),
    },
    executableDigests: {
      node: createHash('sha256').update(await readFile(process.execPath)).digest('hex'),
      git: createHash('sha256').update(await readFile(gitExecutable)).digest('hex'),
      gh: createHash('sha256').update(await readFile(fakeGh)).digest('hex'),
    },
    files: await fixtureManifestFiles(trustedBundleRoot),
  }
  await writeFile(
    path.join(trustedLoopRoot, 'trusted-control-plane.json'),
    `${JSON.stringify(manifest)}\n`,
    'utf8',
  )
  const [canonicalAutomationProfile, canonicalReviewerProfile] = await Promise.all([
    realpath(automationProfile),
    realpath(reviewerProfile),
  ])

  return {
    loopRoot,
    loopctlPath,
    routerPath,
    routerLauncherPath,
    commandGatePath,
    credentialHelper,
    fakeGh,
    fakeGit,
    impostorGh,
    automationProfile: canonicalAutomationProfile,
    reviewerProfile: canonicalReviewerProfile,
    env: {
      ...process.env,
      PATH: `${binRoot}${path.delimiter}${process.env.PATH}`,
      ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR: canonicalAutomationProfile,
      ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR: canonicalReviewerProfile,
      ECHO_UI_LOOP_UNTRUSTED_ROOTS: JSON.stringify([loopRoot]),
      GH_TOKEN: 'must-not-leak',
      GITHUB_TOKEN: 'must-not-leak',
      NODE_OPTIONS: '',
    },
  }
}

test('automation role selects its dedicated gh profile without leaking token overrides', async () => {
  const fixture = await createFixture()
  const command = [
    routerPath,
    '--loop-root',
    fixture.loopRoot,
    'automation',
    '--',
    process.execPath,
    fixture.loopctlPath,
    '--loop-root',
    fixture.loopRoot,
  ]
  const { stdout } = await execFileAsync(process.execPath, command, { env: fixture.env })
  assert.deepEqual(JSON.parse(stdout), {
    config: fixture.automationProfile,
    hasGhToken: false,
    gitConfig: ['15', 'credential.helper', '', 'credential.helper', credentialHelper],
    gitIsolation: [os.devNull, '1'],
    exposesOtherProfiles: false,
    exposesRealTools: false,
    hasExecutionHooks: false,
    hasProxyEnvironment: false,
  })
})

test('launcher removes Node preload hooks before the authenticated process starts', async () => {
  const fixture = await createFixture()
  const markerPath = path.join(path.dirname(fixture.loopRoot), 'preload-marker')
  const preloadPath = path.join(path.dirname(fixture.loopRoot), 'preload.cjs')
  await writeFile(
    preloadPath,
    `require('node:fs').writeFileSync(${JSON.stringify(markerPath)}, 'executed')\n`,
    'utf8',
  )
  const { stdout } = await execFileAsync(
    routerLauncherPath,
    [
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      process.execPath,
      fixture.loopctlPath,
      '--loop-root',
      fixture.loopRoot,
    ],
    {
      env: {
        ...fixture.env,
        NODE_OPTIONS: `--require=${preloadPath}`,
        GIT_EXTERNAL_DIFF: '/tmp/untrusted-diff',
        GIT_EXEC_PATH: '/tmp/untrusted-git-exec',
        GIT_SSH_COMMAND: '/tmp/untrusted-ssh',
        GH_BROWSER: '/tmp/untrusted-browser',
        BROWSER: '/tmp/untrusted-browser',
      },
    },
  )
  assert.equal(JSON.parse(stdout).hasExecutionHooks, false)
  await assert.rejects(readFile(markerPath, 'utf8'), /ENOENT/)
})

test('authenticated routing ignores caller PATH shims and uses manifest-pinned tools', async () => {
  const fixture = await createFixture()
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      fixture.routerPath,
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      'gh',
      'api',
      'user',
      '--jq',
      '.login',
    ],
    {
      env: {
        ...fixture.env,
        PATH: path.dirname(fixture.impostorGh),
      },
    },
  )
  assert.equal(stdout.trim(), 'executor-user')
})

test('authenticated routing refuses a tampered installed control-plane file', async () => {
  const fixture = await createFixture()
  await writeFile(fixture.commandGatePath, 'tampered\n', 'utf8')
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        fixture.routerPath,
        '--loop-root',
        fixture.loopRoot,
        'automation',
        '--',
        'gh',
        'api',
        'user',
        '--jq',
        '.login',
      ],
      { env: fixture.env },
    ),
    /trusted control plane integrity check failed/,
  )
})

test('authenticated routing refuses a replaced pinned executable', async () => {
  const fixture = await createFixture()
  await writeFile(fixture.fakeGh, '#!/bin/sh\nexit 0\n', 'utf8')
  await chmod(fixture.fakeGh, 0o755)
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        fixture.routerPath,
        '--loop-root',
        fixture.loopRoot,
        'automation',
        '--',
        'gh',
        'api',
        'user',
        '--jq',
        '.login',
      ],
      { env: fixture.env },
    ),
    /trusted control plane gh executable integrity check failed/,
  )
})

test('wrapped activation validates both profiles without exposing their paths to loopctl', async () => {
  const fixture = await createFixture()
  const { stdout } = await execFileAsync(
    routerLauncherPath,
    [
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      process.execPath,
      fixture.loopctlPath,
      'validate',
      '--activation',
      '--loop-root',
      fixture.loopRoot,
    ],
    { env: fixture.env },
  )
  assert.equal(JSON.parse(stdout).exposesOtherProfiles, false)
  assert.match(await readFile(path.join(fixture.automationProfile, 'probes'), 'utf8'), /probe/)
  assert.match(await readFile(path.join(fixture.reviewerProfile, 'probes'), 'utf8'), /probe/)
})

test('reviewer role refuses a profile authenticated as the wrong account', async () => {
  const fixture = await createFixture()
  await writeFile(path.join(fixture.reviewerProfile, 'identity'), 'owner-user\n', 'utf8')
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'reviewer',
        '--',
        process.execPath,
        '-e',
        'process.stdout.write("should-not-run")',
      ],
      { env: fixture.env },
    ),
    /GitHub reviewer identity must be reviewer-user; authenticated as owner-user/,
  )
})

test('automation git command clears global helpers and injects the selected gh credential helper', async () => {
  const fixture = await createFixture()
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      'git',
      'push',
      'origin',
      'codex/issue-123',
    ],
    { env: fixture.env },
  )
  const observed = JSON.parse(stdout)
  assert.equal(observed.config, fixture.automationProfile)
  assert.equal(observed.hasGhToken, false)
  assert.deepEqual(observed.args, [
    'push',
    'https://github.com/example/repo.git',
    'refs/heads/codex/issue-123:refs/heads/codex/issue-123',
  ])
  assert.deepEqual(observed.gitConfig, [
    'credential.helper',
    '',
    'credential.helper',
    credentialHelper,
    'core.hooksPath',
    os.devNull,
    'core.fsmonitor',
    'false',
    'protocol.ext.allow',
    'never',
    'url.https://github.com/example/repo.git.insteadOf',
    'https://github.com/example/repo.git',
    'url.https://github.com/example/repo.git.pushInsteadOf',
    'https://github.com/example/repo.git',
    'http.proxy',
    '',
    'http.extraHeader',
    '',
    'http.cookieFile',
    os.devNull,
    'http.saveCookies',
    'false',
    'http.sslVerify',
    'true',
    'http.curloptResolve',
    '',
    'remote.origin.proxy',
    '',
    'http.followRedirects',
    'initial',
  ])
})

test('automation push rejects dirty or unrecorded post-implement content', async () => {
  for (const marker of ['dirty-git', 'unsafe-trailing-diff']) {
    const fixture = await createFixture()
    await writeFile(path.join(path.dirname(fixture.loopRoot), marker), '1\n', 'utf8')
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          'automation',
          '--',
          'git',
          'push',
          'origin',
          'codex/issue-123',
        ],
        { env: fixture.env },
      ),
      /(clean checkout|unrecorded or unsafe post-\$implement changes)/,
    )
  }
})

test('routed loopctl may perform its exact read-only identity probe', async () => {
  const fixture = await createFixture()
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      process.execPath,
      fixture.loopctlPath,
      'spawn',
      'gh',
      'api',
      'user',
      '--loop-root',
      fixture.loopRoot,
    ],
    { env: fixture.env },
  )
  assert.equal(stdout.trim(), 'executor-user')
})

test('routed loopctl start may claim only its command-line issue', async () => {
  const fixture = await createFixture({ activeRun: false })
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      process.execPath,
      fixture.loopctlPath,
      'start',
      '--issue',
      '123',
      '--url',
      'https://github.com/example/repo/issues/123',
      '--loop-root',
      fixture.loopRoot,
    ],
    { env: fixture.env },
  )
  assert.match(stdout, /executor-user/)
  assert.match(stdout, /issues\/123\/labels/)
})

test('reviewer identity cannot push code', async () => {
  const fixture = await createFixture()
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'reviewer',
        '--',
        'git',
        'push',
        'origin',
        'codex/issue-123',
      ],
      { env: fixture.env },
    ),
    /reviewer identity cannot run git push/,
  )
})

test('automation identity allows only one explicit loop branch push shape', async () => {
  const fixture = await createFixture()
  for (const gitArguments of [
    ['push', '--force', 'origin', 'codex/issue-123'],
    ['push', 'origin', '+codex/issue-123'],
    ['push', '--all', 'origin'],
    ['push', 'origin'],
    ['push', 'origin', 'feature/unrelated'],
    ['push', 'origin', 'codex/issue-124'],
    ['push', 'origin', 'dev'],
    ['push', 'origin', 'HEAD:main'],
    ['-C', '.', 'push', 'origin', 'codex/issue-123'],
  ]) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [routerPath, '--loop-root', fixture.loopRoot, 'automation', '--', 'git', ...gitArguments],
        { env: fixture.env },
      ),
      /automation may push only one explicit loop branch/,
    )
  }
})

test('non-owner roles cannot merge or approve pull requests through gh', async () => {
  const fixture = await createFixture()
  const forbidden = [
    ['automation', ['pr', 'merge', '106']],
    ['automation', ['--repo', 'example/repo', 'pr', 'merge', '106']],
    ['automation', ['pr', 'review', '106', '--approve']],
    [
      'automation',
      ['issue', 'comment', '1', '--repo', 'attacker/other-repo', '--body', 'outside scope'],
    ],
    ['reviewer', ['pr', 'merge', '106']],
    ['reviewer', ['pr', 'view', '106', '--repo=attacker/other-repo']],
    ['reviewer', ['pr', 'review', '106', '--approve']],
    ['reviewer', ['api', '--method', 'POST', 'repos/example/repo/pulls/106/reviews']],
    ['reviewer', ['api', 'repos/example/repo/pulls/106/reviews', '-f', 'event=APPROVE']],
    ['automation', ['api', 'graphql', '-f', 'query=mutation { test }']],
    ['automation', ['api', '--method', 'PUT', 'repos/example/repo/pulls/106/merge']],
    ['automation', ['api', '--method', 'PUT', '/repos/example/repo/pulls/106/merge']],
    ['automation', ['api', 'repos/example/repo/pulls/106/reviews', '-f', 'event=APPROVE']],
    [
      'automation',
      ['api', 'repos/attacker/other-repo/issues/1/comments', '-f', 'body=outside-scope'],
    ],
    [
      'automation',
      [
        'api',
        '--template',
        'repos/example/repo/issues/1/comments',
        'repos/example/repo/pulls/106/reviews',
        '-f',
        'event=APPROVE',
      ],
    ],
  ]
  for (const [role, ghArguments] of forbidden) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [routerPath, '--loop-root', fixture.loopRoot, role, '--', 'gh', ...ghArguments],
        { env: fixture.env },
      ),
      /GitHub action is prohibited for the (automation|reviewer) role/,
    )
  }
})

test('reviewer role may publish only a non-approving comment review', async () => {
  const fixture = await createFixture()
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'reviewer',
      '--',
      'gh',
      'pr',
      'review',
      '106',
      '--repo',
      'example/repo',
      '--comment',
      '--body',
      `PASS\n<!-- issue-dev-loop:fixture-run:review-cycle:1:round:1:head:${'b'.repeat(40)} -->`,
    ],
    { env: fixture.env },
  )
  assert.equal(stdout.trim(), 'comment review published')

  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'reviewer',
        '--',
        'gh',
        'pr',
        'review',
        '106',
        '--repo',
        'example/repo',
        '--comment',
        '--body-file',
        '/tmp/uninspected-review.md',
      ],
      { env: fixture.env },
    ),
    /GitHub action is prohibited for the reviewer role/,
  )
})

test('review publication rejects duplicate or skipped cycle rounds', async () => {
  const fixture = await createFixture()
  await writeFile(
    path.join(path.dirname(fixture.loopRoot), 'reviews.json'),
    `${JSON.stringify([
      {
        id: 400,
        state: 'COMMENTED',
        user: { login: 'reviewer-user' },
        body: `<!-- issue-dev-loop:fixture-run:review-cycle:1:round:1:head:${'a'.repeat(40)} -->`,
      },
    ])}\n`,
    'utf8',
  )
  const publish = (round) =>
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'reviewer',
        '--',
        'gh',
        'pr',
        'review',
        '106',
        '--repo',
        'example/repo',
        '--comment',
        '--body',
        `PASS\n<!-- issue-dev-loop:fixture-run:review-cycle:1:round:${round}:head:${'b'.repeat(40)} -->`,
      ],
      { env: fixture.env },
    )
  await assert.rejects(publish(1), /next unique cycle round/)
  const { stdout } = await publish(2)
  assert.equal(stdout.trim(), 'comment review published')
})

test('reviewer adjudication COMMENT is exact-head, finding-bound, and non-cyclic', async () => {
  const fixture = await createFixture()
  const headSha = 'b'.repeat(40)
  const findingId = 'RVW-1-1-1'
  const originalReview = {
    id: 400,
    commit_id: headSha,
    submitted_at: '2026-07-23T00:06:00.000Z',
    state: 'COMMENTED',
    user: { login: 'reviewer-user' },
    body: [
      `<!-- issue-dev-loop:fixture-run:${findingId} -->`,
      `<!-- issue-dev-loop:fixture-run:review-cycle:1:round:1:head:${headSha} -->`,
    ].join('\n'),
  }
  const reviewsPath = path.join(path.dirname(fixture.loopRoot), 'reviews.json')
  await writeFile(reviewsPath, `${JSON.stringify([originalReview])}\n`, 'utf8')
  const marker = `<!-- issue-dev-loop:fixture-run:${findingId}:adjudication:REJECT_FINDING:head:${headSha} -->`
  const publish = (body = marker) =>
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'reviewer',
        '--',
        'gh',
        'pr',
        'review',
        '106',
        '--repo',
        'example/repo',
        '--comment',
        '--body',
        body,
      ],
      { env: fixture.env },
    )
  const { stdout } = await publish()
  assert.equal(stdout.trim(), 'comment review published')

  await assert.rejects(
    publish(
      `<!-- issue-dev-loop:fixture-run:RVW-1-1-2:adjudication:REJECT_FINDING:head:${headSha} -->`,
    ),
    /existing reviewer finding/,
  )
  await writeFile(
    reviewsPath,
    `${JSON.stringify([
      originalReview,
      {
        id: 401,
        commit_id: headSha,
        submitted_at: '2026-07-23T00:07:00.000Z',
        state: 'COMMENTED',
        user: { login: 'reviewer-user' },
        body: marker,
      },
    ])}\n`,
    'utf8',
  )
  await assert.rejects(publish(), /already published/)
})

test('reviewer may publish exact-head inline comments only as a COMMENT review API request', async () => {
  const fixture = await createFixture()
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'reviewer',
      '--',
      'gh',
      'api',
      'repos/example/repo/pulls/106/reviews',
      '--method',
      'POST',
      '-f',
      `commit_id=${'b'.repeat(40)}`,
      '-f',
      'event=COMMENT',
      '-f',
      `body=<!-- issue-dev-loop:fixture-run:review-cycle:1:round:1:head:${'b'.repeat(40)} -->`,
      '-F',
      'comments[][path]=src/fixture.ts',
      '-F',
      'comments[][line]=10',
      '-F',
      'comments[][side]=RIGHT',
      '-f',
      'comments[][body]=<!-- issue-dev-loop:fixture-run:RVW-1-1-1 --> Finding',
    ],
    { env: fixture.env },
  )
  assert.match(stdout, /pulls\/106\/reviews/)

  for (const unsafe of [
    ['-f', `commit_id=${'b'.repeat(40)}`, '-f', 'event=APPROVE', '-f', 'body=unsafe'],
    ['-f', `commit_id=${'d'.repeat(40)}`, '-f', 'event=COMMENT', '-f', 'body=wrong head'],
    ['--input', '/tmp/unvalidated-review.json'],
    [
      '--hostname',
      'example.invalid',
      '-f',
      `commit_id=${'b'.repeat(40)}`,
      '-f',
      'event=COMMENT',
      '-f',
      `body=<!-- issue-dev-loop:fixture-run:review-cycle:1:round:1:head:${'b'.repeat(40)} -->`,
      '-F',
      'comments[][path]=src/fixture.ts',
      '-F',
      'comments[][line]=10',
      '-F',
      'comments[][side]=RIGHT',
      '-f',
      'comments[][body]=<!-- issue-dev-loop:fixture-run:RVW-1-1-1 --> Finding',
    ],
  ]) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          'reviewer',
          '--',
          'gh',
          'api',
          'repos/example/repo/pulls/106/reviews',
          '--method',
          'POST',
          ...unsafe,
        ],
        { env: fixture.env },
      ),
      /GitHub action is prohibited for the reviewer role/,
    )
  }
})

test('automation PR creation is bound to the active branch, dev, and Draft', async () => {
  const fixture = await createFixture({ recordedPr: false })
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      'gh',
      'pr',
      'create',
      '--repo',
      'example/repo',
      '--base',
      'dev',
      '--head',
      'codex/issue-123',
      '--draft',
      '--title',
      'Fixture PR',
      '--body',
      'Fixture body',
    ],
    { env: fixture.env },
  )
  assert.deepEqual(JSON.parse(stdout).args.slice(0, 2), ['pr', 'create'])
})

test('PR and issue mutations reject unsafe shapes and targets', async () => {
  const fixture = await createFixture()
  const forbidden = [
    [
      'automation',
      [
        'pr',
        'create',
        '--base',
        'dev',
        '--head',
        'codex/issue-123',
        '--draft',
        '--title',
        'Missing repository',
        '--body',
        'Unsafe',
      ],
    ],
    ['automation', ['pr', 'create', '--base', 'main', '--head', 'codex/issue-123', '--draft']],
    ['automation', ['pr', 'create', '--base', 'dev', '--head', 'dev', '--draft']],
    ['automation', ['pr', 'create', '--base', 'dev', '--head', 'codex/issue-123']],
    ['automation', ['pr', 'edit', '106', '--base', 'main']],
    ['automation', ['pr', 'edit', '107', '--title', 'Wrong PR']],
    ['automation', ['pr', 'edit', '106', '--add-reviewer', 'attacker']],
    ['automation', ['pr', 'edit', '106', '--repo', 'example/repo', '--add-label', 'arbitrary']],
    ['automation', ['pr', 'edit', '106', '--repo', 'example/repo', '--add-assignee', 'someone']],
    ['automation', ['pr', 'edit', '106', '--repo', 'example/repo', '--milestone', 'later']],
    ['automation', ['pr', 'edit', '106', '--title', 'Missing repository']],
    ['automation', ['pr', 'ready', '107']],
    ['automation', ['pr', 'comment', '107', '--body', 'Wrong PR']],
    ['automation', ['pr', 'comment', '106', '--body', 'Missing repository']],
    [
      'automation',
      [
        'pr',
        'comment',
        '106',
        '--repo',
        'example/repo',
        '--body',
        '@owner **pr_completed**',
      ],
    ],
    [
      'automation',
      ['pr', 'comment', '106', '--repo', 'example/repo', '--body-file', '/tmp/secret'],
    ],
    ['automation', ['pr', 'edit', '106', '--repo', 'example/repo', '-F', '/tmp/secret']],
    ['reviewer', ['pr', 'review', '106', '--comment', '--body', 'Missing repository']],
    [
      'reviewer',
      [
        'pr',
        'review',
        'https://github.com/attacker/other-repo/pull/106',
        '--comment',
        '--body',
        'Wrong repository',
      ],
    ],
    ['automation', ['issue', 'edit', '123', '--state', 'closed']],
    [
      'automation',
      [
        'api',
        'repos/example/repo/issues/124/labels',
        '--method',
        'POST',
        '-f',
        'labels[]=loop:claimed',
      ],
    ],
    [
      'automation',
      [
        'api',
        'repos/example/repo/issues/123/comments',
        '--method',
        'POST',
        '-F',
        'body=@/tmp/secret',
      ],
    ],
    [
      'automation',
      [
        'api',
        'repos/example/repo/issues/106/comments',
        '--method',
        'POST',
        '-f',
        'body=@owner **pr_completed**',
      ],
    ],
  ]
  for (const [role, ghArguments] of forbidden) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [routerPath, '--loop-root', fixture.loopRoot, role, '--', 'gh', ...ghArguments],
        { env: fixture.env },
      ),
      /GitHub action is prohibited for the (automation|reviewer) role/,
    )
  }
})

test('only the owner may mark a Draft PR ready', async () => {
  for (const readyToMark of [false, true]) {
    const fixture = await createFixture({ readyToMark })
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          'automation',
          '--',
          'gh',
          'pr',
          'ready',
          '106',
          '--repo',
          'example/repo',
        ],
        { env: fixture.env },
      ),
      /GitHub action is prohibited for the automation role/,
    )
  }
})

test('owner feedback durably authorizes returning only the exact recorded PR to Draft', async () => {
  const missingFeedback = await createFixture({ liveDraft: false })
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        missingFeedback.loopRoot,
        'automation',
        '--',
        'gh',
        'pr',
        'ready',
        '106',
        '--repo',
        'example/repo',
        '--undo',
      ],
      { env: missingFeedback.env },
    ),
    /owner response/,
  )

  const fixture = await createFixture({ liveDraft: false, ownerFeedback: true })
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      'gh',
      'pr',
      'ready',
      '106',
      '--repo',
      'example/repo',
      '--undo',
    ],
    { env: fixture.env },
  )
  assert.deepEqual(JSON.parse(stdout).args.slice(0, 2), ['pr', 'ready'])
})

test('owner feedback blocks every new push until the unchanged PR is durably redrafted', async () => {
  const fixture = await createFixture({ liveDraft: false, ownerFeedback: true })
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'automation',
        '--',
        'git',
        'push',
        'origin',
        'codex/issue-123',
      ],
      { env: fixture.env },
    ),
    /redrafted first/,
  )
})

test('PR writes reject forged local authorization and live PR drift', async () => {
  const forged = await createFixture()
  const runPath = path.join(forged.loopRoot, 'logs', 'runs', 'fixture-run', 'run.json')
  const run = JSON.parse(await readFile(runPath, 'utf8'))
  await writeFile(runPath, `${JSON.stringify({ ...run, headSha: 'd'.repeat(40) })}\n`, 'utf8')
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        forged.loopRoot,
        'reviewer',
        '--',
        'gh',
        'pr',
        'review',
        '106',
        '--repo',
        'example/repo',
        '--comment',
        '--body',
        `Forged\n<!-- issue-dev-loop:fixture-run:review-cycle:1:round:1:head:${'d'.repeat(40)} -->`,
      ],
      { env: forged.env },
    ),
    /durable|checkpoint/i,
  )

  const drifted = await createFixture()
  const livePath = path.join(path.dirname(drifted.loopRoot), 'live-pr.json')
  const live = JSON.parse(await readFile(livePath, 'utf8'))
  await writeFile(
    livePath,
    `${JSON.stringify({ ...live, head: { ...live.head, sha: 'e'.repeat(40) } })}\n`,
    'utf8',
  )
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        drifted.loopRoot,
        'reviewer',
        '--',
        'gh',
        'pr',
        'review',
        '106',
        '--repo',
        'example/repo',
        '--comment',
        '--body',
        `Stale\n<!-- issue-dev-loop:fixture-run:review-cycle:1:round:1:head:${'b'.repeat(40)} -->`,
      ],
      { env: drifted.env },
    ),
    /live pull request|recorded head/i,
  )
})

test('pending evolve request authorizes only its exact push and Draft PR branch', async () => {
  const fixture = await createFixture({ activeRun: false })
  const requestId = 'EVL-000010-TEN-FINALIZED-RUNS'
  await writeFile(
    path.join(fixture.loopRoot, 'evolve', 'metrics.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      evolveDue: true,
      pendingRequestId: requestId,
    })}\n`,
    'utf8',
  )
  await writeFile(
    path.join(fixture.loopRoot, 'evolve', 'requests', `${requestId}.json`),
    `${JSON.stringify({
      schemaVersion: 1,
      requestId,
      status: 'pending',
      reason: 'ten_finalized_runs',
      requestedAt: '2026-07-23T00:00:00.000Z',
      finalizedRunCount: 10,
    })}\n`,
    'utf8',
  )
  const branch = `codex/evolve-${requestId}`
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'automation',
        '--',
        'git',
        'push',
        'origin',
        branch,
      ],
      { env: fixture.env },
    ),
    /publicationUrl|durable publication/,
  )
  const prepared = await prepareEvolveRequestPublication({
    loopRoot: fixture.loopRoot,
    requestId,
  })
  const evolveComment = {
    user: { login: 'executor-user' },
    body: prepared.body,
  }
  await writeFile(
    path.join(path.dirname(fixture.loopRoot), 'evolve-comment.json'),
    `${JSON.stringify(evolveComment)}\n`,
    'utf8',
  )
  await recordEvolveRequestPublication({
    loopRoot: fixture.loopRoot,
    requestId,
    commentUrl: 'https://github.com/example/repo/issues/999#issuecomment-2',
    githubApi: async () => evolveComment,
  })
  await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      'git',
      'push',
      'origin',
      branch,
    ],
    { env: fixture.env },
  )
  const { stdout } = await execFileAsync(
    process.execPath,
    [
      routerPath,
      '--loop-root',
      fixture.loopRoot,
      'automation',
      '--',
      'gh',
      'pr',
      'create',
      '--repo',
      'example/repo',
      '--base',
      'dev',
      '--head',
      branch,
      '--draft',
      '--title',
      'Evolve loop',
      '--body',
      `<!-- issue-dev-loop:evolve-request:${requestId} -->`,
    ],
    { env: fixture.env },
  )
  assert.deepEqual(JSON.parse(stdout).args.slice(0, 2), ['pr', 'create'])

  for (const rejectedBranch of ['codex/evolve-EVL-000011-TEN-FINALIZED-RUNS', 'codex/issue-123']) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          'automation',
          '--',
          'git',
          'push',
          'origin',
          rejectedBranch,
        ],
        { env: fixture.env },
      ),
      /automation may push only one explicit loop branch/,
    )
  }
})

test('authenticated command trees reject shell, env, arbitrary node, and descendant push bypasses', async () => {
  const fixture = await createFixture()
  const forbiddenCommands = [
    ['automation', ['env', 'git', 'push', 'origin', 'main']],
    ['automation', ['sh', '-c', 'git push origin main']],
    ['automation', [process.execPath, '-e', 'process.exit(0)']],
    [
      'automation',
      [
        process.execPath,
        fixture.loopctlPath,
        'spawn',
        'env',
        'git',
        'push',
        'origin',
        'main',
        '--loop-root',
        fixture.loopRoot,
      ],
    ],
    ['reviewer', ['env', 'git', 'push', 'origin', 'main']],
  ]
  for (const [role, command] of forbiddenCommands) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [routerPath, '--loop-root', fixture.loopRoot, role, '--', command[0], ...command.slice(1)],
        { env: fixture.env },
      ),
      /(outside the authenticated|not pinned by the trusted control plane|reviewer identity cannot run git push|automation may push only|descendant processes cannot (push|run untrusted executables))/,
    )
  }
})

test('GitHub role allowlists reject alternate merge syntax and unrelated reviewer or admin mutations', async () => {
  const fixture = await createFixture()
  const forbidden = [
    ['reviewer', ['pr', 'comment', '106', '--body', 'not a review']],
    ['reviewer', ['issue', 'comment', '1', '--body', 'not allowed']],
    ['reviewer', ['repo', 'edit', '--enable-issues=false']],
    ['reviewer', ['pr', 'review', '106', '--comment', '--comment=false', '--approve=true']],
    ['automation', ['pr', '--repo', 'example/repo', 'merge', '106']],
    ['automation', ['api', '-XPUT', 'repos/example/repo/pulls/106/merge']],
    ['automation', ['api', '/graphql', '-f', 'query=mutation { test }']],
    ['automation', ['api', '--method', 'DELETE', 'repos/example/repo/branches/dev/protection']],
    ['automation', ['issue', 'edit', '105', '--state', 'closed']],
    ['automation', ['pr', 'create', '--base', 'main', '--head', 'dev']],
  ]
  for (const [role, ghArguments] of forbidden) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [routerPath, '--loop-root', fixture.loopRoot, role, '--', 'gh', ...ghArguments],
        { env: fixture.env },
      ),
      /GitHub action is prohibited for the (automation|reviewer) role/,
    )
  }
})

test('authenticated roots reject executable impersonation and mutating remote syntax', async () => {
  const fixture = await createFixture()
  for (const command of [
    [fixture.impostorGh, 'pr', 'view', '106'],
    ['git', 'remote', '-v', 'set-url', 'origin', 'https://example.invalid/repo.git'],
    ['git', 'diff', '--ext-diff'],
    ['git', 'show', '--textconv', 'HEAD'],
    ['git', 'ls-remote', '--upload-pack=/bin/sh', 'origin'],
    ['git', 'ls-remote', 'https://github.com/example/repo.git'],
    ['git', 'fetch', 'attacker', 'dev'],
    ['git', 'fetch', 'origin', 'feature/unrelated'],
  ]) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          'automation',
          '--',
          command[0],
          ...command.slice(1),
        ],
        { env: fixture.env },
      ),
      /(outside the authenticated|git command is outside|not pinned by the trusted control plane)/,
    )
  }
})

test('authenticated remote Git accepts only exact origin and authorized ref shapes', async () => {
  const fixture = await createFixture()
  const allowed = [
    ['ls-remote', '--heads', 'origin', 'refs/heads/codex/issue-*'],
    ['fetch', 'origin', 'dev'],
    ['fetch', 'origin', 'codex/issue-123'],
  ]
  for (const gitArguments of allowed) {
    const { stdout } = await execFileAsync(
      process.execPath,
      [routerPath, '--loop-root', fixture.loopRoot, 'automation', '--', 'git', ...gitArguments],
      { env: fixture.env },
    )
    const executed = JSON.parse(stdout)
    assert.match(executed.args.join(' '), /https:\/\/github\.com\/example\/repo\.git/)
    assert.doesNotMatch(executed.args.join(' '), /--upload-pack|attacker/)
  }
})

test('authenticated real Git ignores local execution hooks and configured diff helpers', async () => {
  const fixture = await createFixture({ realGit: true })
  const realGit = await resolveExecutable('git', process.env)
  const repository = path.join(path.dirname(fixture.loopRoot), 'repository')
  const hookRoot = path.join(repository, 'hooks')
  const hookMarker = path.join(repository, 'hook-marker')
  const diffMarker = path.join(repository, 'diff-marker')
  const textconvMarker = path.join(repository, 'textconv-marker')
  const fsmonitorMarker = path.join(repository, 'fsmonitor-marker')
  await Promise.all([mkdir(repository, { recursive: true }), mkdir(hookRoot, { recursive: true })])
  await execFileAsync(realGit, ['init', '-q'], { cwd: repository })
  await execFileAsync(realGit, ['config', 'user.name', 'Fixture'], { cwd: repository })
  await execFileAsync(realGit, ['config', 'user.email', 'fixture@example.com'], { cwd: repository })
  await writeFile(path.join(repository, 'sample.probe'), 'before\n', 'utf8')
  await writeFile(path.join(repository, '.gitattributes'), '*.probe diff=probe\n', 'utf8')
  await execFileAsync(realGit, ['add', '.'], { cwd: repository })
  await execFileAsync(realGit, ['commit', '-qm', 'fixture'], { cwd: repository })

  const helper = async (target, marker) => {
    await writeFile(target, `#!/bin/sh\nprintf invoked > ${JSON.stringify(marker)}\n`, 'utf8')
    await chmod(target, 0o755)
  }
  await helper(path.join(hookRoot, 'pre-push'), hookMarker)
  await helper(path.join(repository, 'external-diff'), diffMarker)
  await helper(path.join(repository, 'textconv'), textconvMarker)
  await helper(path.join(repository, 'fsmonitor'), fsmonitorMarker)
  await execFileAsync(realGit, ['config', 'core.hooksPath', hookRoot], { cwd: repository })
  await execFileAsync(
    realGit,
    ['config', 'diff.external', path.join(repository, 'external-diff')],
    {
      cwd: repository,
    },
  )
  await execFileAsync(
    realGit,
    ['config', 'diff.probe.textconv', path.join(repository, 'textconv')],
    { cwd: repository },
  )
  await execFileAsync(realGit, ['config', 'core.fsmonitor', path.join(repository, 'fsmonitor')], {
    cwd: repository,
  })
  await writeFile(path.join(repository, 'sample.probe'), 'after\n', 'utf8')

  const routed = (gitArguments) =>
    execFileAsync(
      process.execPath,
      [routerPath, '--loop-root', fixture.loopRoot, 'automation', '--', realGit, ...gitArguments],
      { cwd: repository, env: fixture.env },
    )
  const { stdout: hooksPath } = await routed(['config', '--get', 'core.hooksPath'])
  assert.equal(hooksPath.trim(), os.devNull)
  await routed(['diff'])
  await execFileAsync(realGit, ['config', '--unset', 'diff.external'], { cwd: repository })
  await routed(['diff'])
  await routed(['status', '--porcelain'])
  for (const marker of [hookMarker, diffMarker, textconvMarker, fsmonitorMarker]) {
    await assert.rejects(readFile(marker, 'utf8'), /ENOENT/)
  }
  await execFileAsync(realGit, ['config', 'http.proxy', 'http://127.0.0.1:9'], {
    cwd: repository,
  })
  await assert.rejects(
    routed(['fetch', 'origin', 'dev']),
    /rejects repository-local HTTP, proxy, helper, and URL rewrite configuration/,
  )
})

test('local run branch forgery cannot authorize a protected branch push', async () => {
  const fixture = await createFixture()
  const runPath = path.join(fixture.loopRoot, 'logs', 'runs', 'fixture-run', 'run.json')
  const run = JSON.parse(await readFile(runPath, 'utf8'))
  await writeFile(runPath, `${JSON.stringify({ ...run, branch: 'dev' })}\n`, 'utf8')
  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'automation',
        '--',
        'git',
        'push',
        'origin',
        'dev',
      ],
      { env: fixture.env },
    ),
    /branch must be derived from its durable issue number/,
  )
})

test('automation push verifies that origin is the configured repository', async () => {
  const fixture = await createFixture()
  await writeFile(
    fixture.fakeGit,
    `#!/bin/sh
if [ "$1 $2" = "branch --show-current" ]; then
  echo "codex/issue-123"
  exit 0
fi
if [ "$1 $2" = "rev-parse HEAD" ]; then
  echo "${'b'.repeat(40)}"
  exit 0
fi
if [ "$1 $2" = "status --porcelain" ] || [ "$1" = "merge-base" ] || [ "$1 $2" = "diff --name-status" ]; then
  exit 0
fi
if [ "$1 $2 $3" = "remote get-url origin" ]; then
  echo "https://github.com/attacker/other-repo.git"
  exit 0
fi
if [ "$1 $2 $3 $4" = "remote get-url --push origin" ]; then
  echo "https://github.com/attacker/other-repo.git"
  exit 0
fi
exit 0
`,
    'utf8',
  )
  await chmod(fixture.fakeGit, 0o755)
  const manifestPath = path.join(
    path.dirname(path.dirname(fixture.routerPath)),
    'trusted-control-plane.json',
  )
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  manifest.executableDigests.git = createHash('sha256')
    .update(await readFile(fixture.fakeGit))
    .digest('hex')
  await writeFile(manifestPath, `${JSON.stringify(manifest)}\n`, 'utf8')

  await assert.rejects(
    execFileAsync(
      process.execPath,
      [
        routerPath,
        '--loop-root',
        fixture.loopRoot,
        'automation',
        '--',
        'git',
        'push',
        'origin',
        'codex/issue-123',
      ],
      { env: fixture.env },
    ),
    /origin fetch and push URLs must use HTTPS for the configured repository example\/repo/,
  )
})
