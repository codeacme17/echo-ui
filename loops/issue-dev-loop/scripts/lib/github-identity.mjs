import { execFile, spawn } from 'node:child_process'
import { devNull } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { assertNonEmpty, readJson, sameGitHubLogin } from './common.mjs'

const execFileAsync = promisify(execFile)
const roleFields = {
  automation: {
    login: 'automationGitHubLogin',
    environmentVariable: 'automationGitHubConfigEnvironmentVariable',
  },
  reviewer: {
    login: 'reviewerGitHubLogin',
    environmentVariable: 'reviewerGitHubConfigEnvironmentVariable',
  },
}

export function resolveGitHubRoleEnvironment({ channel, role, environment = process.env }) {
  const fields = roleFields[role]
  if (!fields) throw new Error('GitHub role must be automation or reviewer')

  const expectedLogin = assertNonEmpty(channel[fields.login], `channel.${fields.login}`)
  if (sameGitHubLogin(expectedLogin, channel.ownerGitHubLogin)) {
    throw new Error(`GitHub ${role} identity must differ from the owner`)
  }

  const variableName = assertNonEmpty(
    channel[fields.environmentVariable],
    `channel.${fields.environmentVariable}`,
  )
  if (!/^[A-Z][A-Z0-9_]*$/.test(variableName)) {
    throw new Error(`channel.${fields.environmentVariable} must name an environment variable`)
  }

  const configDirectory = assertNonEmpty(environment[variableName], variableName)
  if (!path.isAbsolute(configDirectory)) {
    throw new Error(`${variableName} must contain an absolute directory path`)
  }

  const routedEnvironment = {
    ...environment,
    GH_CONFIG_DIR: configDirectory,
  }
  for (const tokenName of [
    'GH_TOKEN',
    'GITHUB_TOKEN',
    'GH_ENTERPRISE_TOKEN',
    'GITHUB_ENTERPRISE_TOKEN',
  ]) {
    delete routedEnvironment[tokenName]
  }
  for (const name of Object.keys(routedEnvironment)) {
    if (/^GIT_CONFIG_(?:COUNT|KEY_\d+|VALUE_\d+)$/.test(name)) delete routedEnvironment[name]
  }
  Object.assign(routedEnvironment, {
    GIT_CONFIG_GLOBAL: devNull,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_COUNT: '2',
    GIT_CONFIG_KEY_0: 'credential.helper',
    GIT_CONFIG_VALUE_0: '',
    GIT_CONFIG_KEY_1: 'credential.helper',
    GIT_CONFIG_VALUE_1: '!gh auth git-credential',
  })

  return { configDirectory, expectedLogin, routedEnvironment }
}

function sameArguments(actual, expected) {
  return (
    actual.length === expected.length &&
    actual.every((argument, index) => argument === expected[index])
  )
}

function assertGitCommandPolicy(role, args) {
  const pushIndex = args.indexOf('push')
  if (pushIndex === -1) return
  if (role === 'reviewer') throw new Error('reviewer identity cannot run git push')

  const branch = args.at(-1)
  const isLoopBranch = /^codex\/issue-\d+$/.test(branch)
  const isAllowedShape =
    isLoopBranch &&
    [
      ['push', 'origin', branch],
      ['push', '-u', 'origin', branch],
      ['push', '--set-upstream', 'origin', branch],
    ].some((expected) => sameArguments(args, expected))
  if (!isAllowedShape) {
    throw new Error('GitHub automation may push only one explicit loop branch')
  }
}

function argumentValue(args, names) {
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (names.includes(argument)) return args[index + 1] ?? null
    for (const name of names) {
      if (argument.startsWith(`${name}=`)) return argument.slice(name.length + 1)
    }
  }
  return null
}

function assertGitHubCliPolicy(role, args) {
  const reject = () => {
    throw new Error(`GitHub action is prohibited for the ${role} role`)
  }

  const pullRequestIndex = args.indexOf('pr')
  const pullRequestCommand = pullRequestIndex === -1 ? null : args[pullRequestIndex + 1]
  if (pullRequestCommand === 'merge') reject()
  if (pullRequestCommand === 'review') {
    if (role === 'automation') reject()
    const isComment = args.includes('--comment') || args.includes('-c')
    const isApproval = args.includes('--approve') || args.includes('-a')
    const requestsChanges = args.includes('--request-changes') || args.includes('-r')
    if (!isComment || isApproval || requestsChanges) reject()
  }
  const apiIndex = args.indexOf('api')
  if (apiIndex === -1) return
  const apiArguments = args.slice(apiIndex + 1)

  const hasRequestBody = apiArguments.some(
    (argument) =>
      ['-f', '-F', '--field', '--raw-field', '--input'].includes(argument) ||
      ['--field=', '--raw-field=', '--input='].some((prefix) => argument.startsWith(prefix)),
  )
  const method = (
    argumentValue(apiArguments, ['--method', '-X']) ?? (hasRequestBody ? 'POST' : 'GET')
  ).toUpperCase()
  const mutating = method !== 'GET'
  const endpoint = apiArguments.find(
    (argument) => argument === 'graphql' || /^\/?repos\/[^/]+\/[^/]+\//.test(argument),
  )
  if (endpoint === 'graphql') reject()
  if (role === 'reviewer' && mutating) reject()
  if (
    role === 'automation' &&
    mutating &&
    (/\/pulls\/\d+\/merge(?:\?|$)/.test(endpoint ?? '') ||
      /\/pulls\/\d+\/reviews(?:\?|$)/.test(endpoint ?? ''))
  ) {
    reject()
  }
}

export async function assertGitHubRoleIdentity({
  channel,
  role,
  environment = process.env,
  identityCommand = execFileAsync,
}) {
  const resolved = resolveGitHubRoleEnvironment({ channel, role, environment })
  const { stdout } = await identityCommand('gh', ['api', 'user', '--jq', '.login'], {
    env: resolved.routedEnvironment,
    maxBuffer: 1024 * 1024,
  })
  const authenticatedLogin = stdout.trim()
  if (!sameGitHubLogin(authenticatedLogin, resolved.expectedLogin)) {
    throw new Error(
      `GitHub ${role} identity must be ${resolved.expectedLogin}; authenticated as ${
        authenticatedLogin || 'unknown'
      }`,
    )
  }
  return { ...resolved, authenticatedLogin }
}

export async function runWithGitHubRole({
  channel,
  role,
  command,
  args = [],
  environment = process.env,
  spawnCommand = spawn,
}) {
  const executable = assertNonEmpty(command, 'command')
  if (path.basename(executable) === 'git') assertGitCommandPolicy(role, args)
  if (path.basename(executable) === 'gh') assertGitHubCliPolicy(role, args)
  const resolved = await assertGitHubRoleIdentity({ channel, role, environment })
  const child = spawnCommand(executable, args, {
    env: resolved.routedEnvironment,
    stdio: 'inherit',
    shell: false,
  })
  return new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${executable} terminated by signal ${signal}`))
        return
      }
      resolve(code ?? 1)
    })
  })
}

export async function readOwnerChannel(loopRoot) {
  return readJson(path.resolve(loopRoot, '..', '_shared', 'owner-channel', 'channel.json'))
}
