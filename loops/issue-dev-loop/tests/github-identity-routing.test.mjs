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

  const fakeGh = path.join(binRoot, 'gh')
  await writeFile(
    fakeGh,
    `#!/bin/sh
if [ "$1 $2 $3 $4" != "api user --jq .login" ]; then
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
node -e 'process.stdout.write(JSON.stringify({args: process.argv.slice(1), config: process.env.GH_CONFIG_DIR, hasGhToken: Boolean(process.env.GH_TOKEN || process.env.GITHUB_TOKEN)}))' -- "$@"
`,
    'utf8',
  )
  await chmod(fakeGit, 0o755)

  return {
    loopRoot,
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
    '-e',
    `process.stdout.write(JSON.stringify({
      config: process.env.GH_CONFIG_DIR,
      hasGhToken: Boolean(process.env.GH_TOKEN || process.env.GITHUB_TOKEN)
    }))`,
  ]
  const { stdout } = await execFileAsync(process.execPath, command, { env: fixture.env })
  assert.deepEqual(JSON.parse(stdout), {
    config: fixture.automationProfile,
    hasGhToken: false,
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
  assert.deepEqual(observed.args, [
    '-c',
    'credential.helper=',
    '-c',
    'credential.helper=!gh auth git-credential',
    'push',
    'origin',
    'codex/issue-123',
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

test('automation identity cannot force-push or push protected branches', async () => {
  const fixture = await createFixture()
  for (const gitArguments of [
    ['push', '--force', 'origin', 'codex/issue-123'],
    ['push', 'origin', 'dev'],
    ['push', 'origin', 'HEAD:main'],
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
      /force-push and protected-branch pushes are prohibited/,
    )
  }
})
