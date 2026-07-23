import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { chmod, mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const testDirectory = path.dirname(fileURLToPath(import.meta.url))
const routerPath = path.resolve(
  testDirectory,
  '..',
  'scripts',
  'with-github-identity.mjs',
)

async function createFixture() {
  const parent = await mkdtemp(path.join(os.tmpdir(), 'echo-ui-identity-routing-'))
  const loopRoot = path.join(parent, 'issue-dev-loop')
  const channelRoot = path.join(parent, '_shared', 'owner-channel')
  const binRoot = path.join(parent, 'bin')
  const automationProfile = path.join(parent, 'automation-profile')
  const reviewerProfile = path.join(parent, 'reviewer-profile')
  await Promise.all([
    mkdir(channelRoot, { recursive: true }),
    mkdir(path.join(loopRoot, 'scripts'), { recursive: true }),
    mkdir(path.join(loopRoot, 'logs', 'runs', 'fixture-run'), { recursive: true }),
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
      automationGitHubConfigEnvironmentVariable:
        'ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR',
      reviewerGitHubConfigEnvironmentVariable: 'ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR',
    })}\n`,
    'utf8',
  )
  await writeFile(path.join(automationProfile, 'identity'), 'executor-user\n', 'utf8')
  await writeFile(path.join(reviewerProfile, 'identity'), 'reviewer-user\n', 'utf8')
  await writeFile(
    path.join(loopRoot, 'logs', 'runs', 'fixture-run', 'run.json'),
    `${JSON.stringify({
      runId: 'fixture-run',
      status: 'running',
      branch: 'codex/issue-123',
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
    gitIsolation: [process.env.GIT_CONFIG_GLOBAL, process.env.GIT_CONFIG_NOSYSTEM]
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
  if [ "$1 $2 $4" = "pr review --comment" ]; then
    echo "comment review published"
    exit 0
  fi
  echo "unexpected gh arguments" >&2
  exit 90
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
node -e 'process.stdout.write(JSON.stringify({args: process.argv.slice(1), config: process.env.GH_CONFIG_DIR, hasGhToken: Boolean(process.env.GH_TOKEN || process.env.GITHUB_TOKEN), gitConfig: [process.env.GIT_CONFIG_COUNT, process.env.GIT_CONFIG_KEY_0, process.env.GIT_CONFIG_VALUE_0, process.env.GIT_CONFIG_KEY_1, process.env.GIT_CONFIG_VALUE_1]}))' -- "$@"
`,
    'utf8',
  )
  await chmod(fakeGit, 0o755)

  return {
    loopRoot,
    loopctlPath,
    fakeGh,
    automationProfile,
    reviewerProfile,
    env: {
      ...process.env,
      PATH: `${binRoot}${path.delimiter}${process.env.PATH}`,
      ECHO_UI_LOOP_AUTOMATION_GH_CONFIG_DIR: automationProfile,
      ECHO_UI_LOOP_REVIEWER_GH_CONFIG_DIR: reviewerProfile,
      GH_TOKEN: 'must-not-leak',
      GITHUB_TOKEN: 'must-not-leak',
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
    gitConfig: [
      '2',
      'credential.helper',
      '',
      'credential.helper',
      `!'${fixture.fakeGh}' auth git-credential`,
    ],
    gitIsolation: [os.devNull, '1'],
  })
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
    `!'${fixture.fakeGh}' auth git-credential`,
  ])
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
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          'automation',
          '--',
          'git',
          ...gitArguments,
        ],
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
    ['reviewer', ['pr', 'merge', '106']],
    ['reviewer', ['pr', 'review', '106', '--approve']],
    ['reviewer', ['api', '--method', 'POST', 'repos/example/repo/pulls/106/reviews']],
    ['reviewer', ['api', 'repos/example/repo/pulls/106/reviews', '-f', 'event=APPROVE']],
    ['automation', ['api', 'graphql', '-f', 'query=mutation { test }']],
    ['automation', ['api', '--method', 'PUT', 'repos/example/repo/pulls/106/merge']],
    ['automation', ['api', '--method', 'PUT', '/repos/example/repo/pulls/106/merge']],
    ['automation', ['api', 'repos/example/repo/pulls/106/reviews', '-f', 'event=APPROVE']],
  ]
  for (const [role, ghArguments] of forbidden) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          role,
          '--',
          'gh',
          ...ghArguments,
        ],
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
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          role,
          '--',
          command[0],
          ...command.slice(1),
        ],
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
    ['automation', ['pr', '--repo', 'example/repo', 'merge', '106']],
    ['automation', ['api', '-XPUT', 'repos/example/repo/pulls/106/merge']],
    ['automation', ['api', '/graphql', '-f', 'query=mutation { test }']],
    [
      'automation',
      ['api', '--method', 'DELETE', 'repos/example/repo/branches/dev/protection'],
    ],
  ]
  for (const [role, ghArguments] of forbidden) {
    await assert.rejects(
      execFileAsync(
        process.execPath,
        [
          routerPath,
          '--loop-root',
          fixture.loopRoot,
          role,
          '--',
          'gh',
          ...ghArguments,
        ],
        { env: fixture.env },
      ),
      /GitHub action is prohibited for the (automation|reviewer) role/,
    )
  }
})
