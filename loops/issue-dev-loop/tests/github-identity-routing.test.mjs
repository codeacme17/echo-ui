import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const routerPath = path.resolve(testDirectory, '..', 'scripts', 'with-github-identity.mjs')
const routerLauncherPath = path.resolve(testDirectory, '..', 'scripts', 'with-github-identity')
const commandGatePath = path.resolve(testDirectory, '..', 'scripts', 'github-command-gate.mjs')
const credentialHelper = `!'${process.execPath}' '${commandGatePath}' credential`

async function createFixture({ activeRun = true, recordedPr = true } = {}) {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-identity-routing-'))
  const loopRoot = path.join(parent, 'issue-dev-loop')
  const channelRoot = path.join(parent, '_shared', 'owner-channel')
  const binRoot = path.join(parent, 'bin')
  const automationProfile = path.join(parent, 'automation-profile')
  const reviewerProfile = path.join(parent, 'reviewer-profile')
  await Promise.all([
    mkdir(channelRoot, { recursive: true }),
    mkdir(path.join(loopRoot, 'scripts'), { recursive: true }),
    mkdir(path.join(loopRoot, 'logs', 'runs'), { recursive: true }),
    mkdir(path.join(loopRoot, 'evolve', 'requests'), { recursive: true }),
    mkdir(binRoot, { recursive: true }),
    mkdir(automationProfile, { recursive: true }),
    mkdir(reviewerProfile, { recursive: true }),
  ])
  await writeFile(
    path.join(channelRoot, 'channel.json'),
    `${JSON.stringify({
      ownerGitHubLogin: 'owner-user',
      automationGitHubLogin: 'executor-user',
      reviewerGitHubLogin: 'reviewer-user',
      automationGitHubConfigEnvironmentVariable: 'ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR',
      reviewerGitHubConfigEnvironmentVariable: 'ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR',
      stateIssueNumber: 999,
      repository: 'example/repo',
    })}\n`,
    'utf8',
  )
  await writeFile(path.join(automationProfile, 'identity'), 'executor-user\n', 'utf8')
  await writeFile(path.join(reviewerProfile, 'identity'), 'reviewer-user\n', 'utf8')
  if (activeRun) {
    await mkdir(path.join(loopRoot, 'logs', 'runs', 'fixture-run'), { recursive: true })
    await writeFile(
      path.join(loopRoot, 'logs', 'runs', 'fixture-run', 'run.json'),
      `${JSON.stringify({
        runId: 'fixture-run',
        issueNumber: 123,
        status: 'running',
        finishedAt: null,
        branch: 'codex/issue-123',
        prUrl: recordedPr ? 'https://github.com/example/repo/pull/106' : null,
      })}\n`,
      'utf8',
    )
  }
  await writeFile(
    path.join(loopRoot, 'evolve', 'metrics.json'),
    `${JSON.stringify({
      schemaVersion: 1,
      evolveDue: false,
      pendingRequestId: null,
    })}\n`,
    'utf8',
  )
  const loopctlPath = path.join(loopRoot, 'scripts', 'loopctl.mjs')
  await writeFile(
    loopctlPath,
    `import { spawnSync } from 'node:child_process'

if (process.argv[2] === 'spawn') {
  const result = spawnSync(process.argv[3], process.argv.slice(4), {
    env: process.env,
    stdio: 'inherit',
  })
  process.exitCode = result.status ?? 1
} else if (process.argv[2] === 'start') {
  const issueIndex = process.argv.indexOf('--issue')
  const issue = process.argv[issueIndex + 1]
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
if [ "$1 $2 $3 $4" != "api user --jq .login" ]; then
  if [ "$1 $2" = "api user" ]; then
    sed -n '1p' "$GH_CONFIG_DIR/identity"
    exit 0
  fi
  if [ "$1 $2 $4" = "pr review --comment" ]; then
    echo "comment review published"
    exit 0
  fi
  node -e 'process.stdout.write(JSON.stringify({args: process.argv.slice(1)}))' -- "$@"
  exit 0
fi
sed -n '1p' "$GH_CONFIG_DIR/identity"
`,
    'utf8',
  )
  await chmod(fakeGh, 0o755)

  const fakeGit = path.join(binRoot, 'git')
  await writeFile(
    fakeGit,
    `#!/bin/sh
if [ "$1 $2 $3" = "remote get-url origin" ]; then
  echo "https://github.com/example/repo.git"
  exit 0
fi
node -e 'process.stdout.write(JSON.stringify({args: process.argv.slice(1), config: process.env.GH_CONFIG_DIR, hasGhToken: Boolean(process.env.GH_TOKEN || process.env.GITHUB_TOKEN), gitConfig: [process.env.GIT_CONFIG_COUNT, process.env.GIT_CONFIG_KEY_0, process.env.GIT_CONFIG_VALUE_0, process.env.GIT_CONFIG_KEY_1, process.env.GIT_CONFIG_VALUE_1]}))' -- "$@"
`,
    'utf8',
  )
  await chmod(fakeGit, 0o755)
  const impostorGh = path.join(parent, 'gh')
  await writeFile(impostorGh, '#!/bin/sh\nexit 0\n', 'utf8')
  await chmod(impostorGh, 0o755)

  return {
    loopRoot,
    loopctlPath,
    fakeGh,
    fakeGit,
    impostorGh,
    automationProfile,
    reviewerProfile,
    env: {
      ...process.env,
      PATH: `${binRoot}${path.delimiter}${process.env.PATH}`,
      ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR: automationProfile,
      ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR: reviewerProfile,
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
  ]
  const { stdout } = await execFileAsync(process.execPath, command, { env: fixture.env })
  assert.deepEqual(JSON.parse(stdout), {
    config: fixture.automationProfile,
    hasGhToken: false,
    gitConfig: ['2', 'credential.helper', '', 'credential.helper', credentialHelper],
    gitIsolation: [os.devNull, '1'],
    exposesOtherProfiles: false,
    exposesRealTools: false,
    hasExecutionHooks: false,
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
    ['--loop-root', fixture.loopRoot, 'automation', '--', process.execPath, fixture.loopctlPath],
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
  assert.deepEqual(observed.args, ['push', 'origin', 'codex/issue-123'])
  assert.deepEqual(observed.gitConfig, [
    '2',
    'credential.helper',
    '',
    'credential.helper',
    credentialHelper,
  ])
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
      '--comment',
      '--body',
      'PASS',
    ],
    { env: fixture.env },
  )
  assert.equal(stdout.trim(), 'comment review published')
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
    ['automation', ['pr', 'create', '--base', 'main', '--head', 'codex/issue-123', '--draft']],
    ['automation', ['pr', 'create', '--base', 'dev', '--head', 'dev', '--draft']],
    ['automation', ['pr', 'create', '--base', 'dev', '--head', 'codex/issue-123']],
    ['automation', ['pr', 'edit', '106', '--base', 'main']],
    ['automation', ['pr', 'edit', '107', '--title', 'Wrong PR']],
    ['automation', ['pr', 'edit', '106', '--add-reviewer', 'attacker']],
    ['automation', ['pr', 'ready', '107']],
    ['automation', ['pr', 'comment', '107', '--body', 'Wrong PR']],
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
      requestedAt: '2026-07-23T00:00:00.000Z',
    })}\n`,
    'utf8',
  )
  const branch = `codex/evolve-${requestId}`
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
      [process.execPath, fixture.loopctlPath, 'spawn', 'env', 'git', 'push', 'origin', 'main'],
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
      /(outside the authenticated|reviewer identity cannot run git push|automation may push only)/,
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
      /(outside the authenticated|git command is outside)/,
    )
  }
})

test('automation push verifies that origin is the configured repository', async () => {
  const fixture = await createFixture()
  await writeFile(
    fixture.fakeGit,
    `#!/bin/sh
if [ "$1 $2 $3" = "remote get-url origin" ]; then
  echo "https://github.com/attacker/other-repo.git"
  exit 0
fi
exit 0
`,
    'utf8',
  )
  await chmod(fixture.fakeGit, 0o755)

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
    /origin must target the configured repository example\/repo/,
  )
})
