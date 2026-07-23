import { execFile, spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { access, readdir, realpath } from 'node:fs/promises'
import { devNull } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import { assertNonEmpty, readJson, sameGitHubLogin } from './common.mjs'

const execFileAsync = promisify(execFile)
const moduleDirectory = path.dirname(fileURLToPath(import.meta.url))
const identityBinDirectory = path.resolve(moduleDirectory, '..', 'identity-bin')
const commandGatePath = path.resolve(moduleDirectory, '..', 'github-command-gate.mjs')
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

  const routedEnvironment = { ...environment, GH_CONFIG_DIR: configDirectory }
  for (const profileVariable of [
    channel.automationGitHubConfigEnvironmentVariable,
    channel.reviewerGitHubConfigEnvironmentVariable,
  ]) {
    if (profileVariable) delete routedEnvironment[profileVariable]
  }
  for (const name of [
    'GH_TOKEN',
    'GITHUB_TOKEN',
    'GH_ENTERPRISE_TOKEN',
    'GITHUB_ENTERPRISE_TOKEN',
  ]) {
    delete routedEnvironment[name]
  }
  for (const name of Object.keys(routedEnvironment)) {
    if (
      /^GIT_CONFIG_(?:COUNT|KEY_\d+|VALUE_\d+)$/.test(name) ||
      name.startsWith('ECHO_UI_LOOP_REAL_') ||
      [
        'ECHO_UI_LOOP_GITHUB_ROLE',
        'ECHO_UI_LOOP_IDENTITY_GATE',
        'ECHO_UI_LOOP_NODE',
        'ECHO_UI_LOOP_ALLOWED_PUSH_BRANCH',
        'ECHO_UI_LOOP_EXPECTED_REPOSITORY',
      ].includes(name)
    ) {
      delete routedEnvironment[name]
    }
  }
  Object.assign(routedEnvironment, {
    GIT_CONFIG_GLOBAL: devNull,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_COUNT: '2',
    GIT_CONFIG_KEY_0: 'credential.helper',
    GIT_CONFIG_VALUE_0: '',
    GIT_CONFIG_KEY_1: 'credential.helper',
    GIT_CONFIG_VALUE_1: `!${shellQuote(process.execPath)} ${shellQuote(
      commandGatePath,
    )} credential`,
  })
  return { configDirectory, expectedLogin, routedEnvironment }
}

function sameArguments(actual, expected) {
  return (
    actual.length === expected.length &&
    actual.every((argument, index) => argument === expected[index])
  )
}

function gitSubcommand(args) {
  let index = 0
  while (index < args.length && args[index].startsWith('-')) {
    const argument = args[index]
    if (['-C', '--git-dir', '--work-tree', '--namespace'].includes(argument)) {
      index += 2
      continue
    }
    if (
      ['--no-pager', '--paginate', '--literal-pathspecs', '--no-optional-locks'].includes(
        argument,
      ) ||
      ['--git-dir=', '--work-tree=', '--namespace='].some((prefix) => argument.startsWith(prefix))
    ) {
      index += 1
      continue
    }
    return { index, name: null }
  }
  return { index, name: args[index] ?? null }
}

export function assertGitCommandPolicy(role, args, { allowedPushBranch = null } = {}) {
  const subcommand = gitSubcommand(args)
  if (subcommand.name === 'push') {
    if (role === 'reviewer') throw new Error('reviewer identity cannot run git push')
    const branch = args.at(-1)
    const isLoopBranch = /^codex\/issue-\d+$/.test(branch) && branch === allowedPushBranch
    const isAllowedShape =
      subcommand.index === 0 &&
      isLoopBranch &&
      [
        ['push', 'origin', branch],
        ['push', '-u', 'origin', branch],
        ['push', '--set-upstream', 'origin', branch],
      ].some((expected) => sameArguments(args, expected))
    if (!isAllowedShape) {
      throw new Error('GitHub automation may push only one explicit loop branch')
    }
    return
  }

  const readOnly = new Set([
    'rev-parse',
    'status',
    'merge-base',
    'show',
    'diff',
    'log',
    'ls-remote',
  ])
  if (readOnly.has(subcommand.name)) return
  if (
    subcommand.name === 'branch' &&
    args
      .slice(subcommand.index + 1)
      .every((argument) => ['--show-current', '--list', '-l'].includes(argument))
  ) {
    return
  }
  if (
    subcommand.name === 'config' &&
    args.some((argument) =>
      ['--get', '--get-all', '--get-regexp', '--list', '-l', '--show-origin'].includes(argument),
    )
  ) {
    return
  }
  if (
    sameArguments(args.slice(subcommand.index), ['remote', '-v']) ||
    sameArguments(args.slice(subcommand.index), ['remote', 'get-url', 'origin'])
  ) {
    return
  }
  if (role === 'automation' && subcommand.name === 'fetch') return
  throw new Error(`git command is outside the authenticated ${role} command tree`)
}

function commandAfterGroup(args, groupIndex) {
  let index = groupIndex + 1
  while (index < args.length) {
    const argument = args[index]
    if (['--repo', '-R', '--hostname'].includes(argument)) {
      index += 2
      continue
    }
    if (argument.startsWith('-')) {
      return { index: -1, name: null }
    }
    return { index, name: argument }
  }
  return { index: -1, name: null }
}

function githubGroup(args) {
  const groups = new Set(['api', 'issue', 'pr', 'run', 'repo'])
  let index = 0
  while (index < args.length) {
    const argument = args[index]
    if (['--repo', '-R', '--hostname'].includes(argument)) {
      if (!args[index + 1]) return { index: -1, name: null }
      index += 2
      continue
    }
    if (['--repo=', '--hostname='].some((prefix) => argument.startsWith(prefix))) {
      index += 1
      continue
    }
    if (argument.startsWith('-') || !groups.has(argument)) {
      return { index: -1, name: null }
    }
    return { index, name: argument }
  }
  return { index: -1, name: null }
}

function githubApiRequest(apiArguments) {
  const optionsWithValue = new Set([
    '--method',
    '-X',
    '-f',
    '-F',
    '--field',
    '--raw-field',
    '--input',
    '--preview',
    '--hostname',
    '--jq',
    '-q',
    '--template',
    '-t',
    '--cache',
    '--header',
    '-H',
  ])
  const bodyOptions = new Set(['-f', '-F', '--field', '--raw-field', '--input'])
  const booleanOptions = new Set(['--paginate', '--slurp', '--verbose', '--silent', '--include'])
  let explicitMethod = null
  let endpoint = null
  let hasRequestBody = false
  let valid = true

  for (let index = 0; index < apiArguments.length; index += 1) {
    const argument = apiArguments[index]
    if (optionsWithValue.has(argument)) {
      const value = apiArguments[index + 1]
      if (value === undefined) {
        valid = false
        break
      }
      if (argument === '--method' || argument === '-X') explicitMethod = value
      if (bodyOptions.has(argument)) hasRequestBody = true
      index += 1
      continue
    }
    const longOption = [...optionsWithValue].find(
      (name) => name.startsWith('--') && argument.startsWith(`${name}=`),
    )
    if (longOption) {
      const value = argument.slice(longOption.length + 1)
      if (!value) {
        valid = false
        break
      }
      if (longOption === '--method') explicitMethod = value
      if (bodyOptions.has(longOption)) hasRequestBody = true
      continue
    }
    if (/^-X[A-Za-z]+$/.test(argument)) {
      explicitMethod = argument.slice(2)
      continue
    }
    if (/^-[fF].+/.test(argument)) {
      hasRequestBody = true
      continue
    }
    if (
      booleanOptions.has(argument) ||
      [...booleanOptions].some((name) => argument.startsWith(`${name}=`))
    ) {
      continue
    }
    if (argument.startsWith('-') || endpoint !== null) {
      valid = false
      break
    }
    endpoint = argument
  }

  const method = (explicitMethod ?? (hasRequestBody ? 'POST' : 'GET')).toUpperCase()
  return {
    endpoint: valid ? (endpoint?.replace(/^\//, '').split('?')[0] ?? null) : null,
    method,
    mutating: !valid || method !== 'GET',
    valid,
  }
}

function reviewerCommentReviewAllowed(args, commandIndex) {
  let hasComment = false
  let targetCount = 0
  const optionsWithValue = new Set(['--body', '-b', '--body-file', '-F', '--repo', '-R'])

  for (let index = commandIndex + 1; index < args.length; index += 1) {
    const argument = args[index]
    if (
      ['--approve', '--request-changes', '-a', '-r'].some(
        (name) => argument === name || argument.startsWith(`${name}=`),
      )
    ) {
      return false
    }
    if (argument === '--comment' || argument === '-c' || argument === '--comment=true') {
      hasComment = true
      continue
    }
    if (argument.startsWith('--comment=')) return false
    if (optionsWithValue.has(argument)) {
      if (args[index + 1] === undefined) return false
      index += 1
      continue
    }
    const longOption = [...optionsWithValue].find(
      (name) => name.startsWith('--') && argument.startsWith(`${name}=`),
    )
    if (longOption) {
      if (!argument.slice(longOption.length + 1)) return false
      continue
    }
    if (argument.startsWith('-')) return false
    targetCount += 1
    if (targetCount > 1) return false
  }
  return hasComment
}

function automationApiMutationAllowed({ endpoint, method }) {
  if (!endpoint) return false
  if (
    /^repos\/[^/]+\/[^/]+\/issues\/\d+\/labels(?:\/[^/]+)?$/.test(endpoint) &&
    ['POST', 'DELETE'].includes(method)
  ) {
    return true
  }
  if (/^repos\/[^/]+\/[^/]+\/issues\/\d+\/comments$/.test(endpoint) && method === 'POST') {
    return true
  }
  if (
    /^repos\/[^/]+\/[^/]+\/(?:issues|pulls)\/comments\/\d+$/.test(endpoint) &&
    method === 'PATCH'
  ) {
    return true
  }
  return (
    /^repos\/[^/]+\/[^/]+\/pulls\/\d+\/comments\/\d+\/replies$/.test(endpoint) && method === 'POST'
  )
}

function githubRepositoryFlags(args) {
  const repositories = []
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--repo' || argument === '-R') {
      repositories.push(args[index + 1] ?? null)
      index += 1
      continue
    }
    if (argument.startsWith('--repo=')) {
      repositories.push(argument.slice('--repo='.length) || null)
      continue
    }
    if (argument.startsWith('-R') && argument.length > 2) {
      repositories.push(argument.slice(2))
    }
  }
  return repositories
}

function endpointRepository(endpoint) {
  const match = endpoint?.match(/^repos\/([^/]+\/[^/]+)(?:\/|$)/)
  return match?.[1] ?? null
}

function repositoryInScope(actual, expected) {
  return (
    typeof actual === 'string' &&
    typeof expected === 'string' &&
    actual.toLowerCase() === expected.toLowerCase()
  )
}

export function assertGitHubCliPolicy(role, args, { expectedRepository = null } = {}) {
  const reject = () => {
    throw new Error(`GitHub action is prohibited for the ${role} role`)
  }
  if (
    expectedRepository &&
    githubRepositoryFlags(args).some(
      (repository) => !repositoryInScope(repository, expectedRepository),
    )
  ) {
    reject()
  }
  const group = githubGroup(args)
  if (!group.name) reject()
  const subcommand = commandAfterGroup(args, group.index)

  if (role === 'reviewer') {
    if (group.name === 'api') {
      const request = githubApiRequest(args.slice(group.index + 1))
      if (
        !request.valid ||
        request.mutating ||
        request.endpoint === 'graphql' ||
        (expectedRepository &&
          !repositoryInScope(endpointRepository(request.endpoint), expectedRepository))
      ) {
        reject()
      }
      return
    }
    if (group.name === 'run' && subcommand.name === 'view') return
    if (group.name !== 'pr') reject()
    if (['view', 'diff', 'checks'].includes(subcommand.name)) return
    if (subcommand.name !== 'review' || !reviewerCommentReviewAllowed(args, subcommand.index)) {
      reject()
    }
    return
  }

  if (group.name === 'issue') {
    if (!['list', 'view', 'comment', 'edit'].includes(subcommand.name)) reject()
    return
  }
  if (group.name === 'pr') {
    if (
      !['list', 'view', 'create', 'edit', 'comment', 'ready', 'checks', 'diff'].includes(
        subcommand.name,
      )
    ) {
      reject()
    }
    return
  }
  if (group.name === 'run') {
    if (!['list', 'view', 'download'].includes(subcommand.name)) reject()
    return
  }
  if (group.name !== 'api') reject()
  const request = githubApiRequest(args.slice(group.index + 1))
  if (
    !request.valid ||
    request.endpoint === 'graphql' ||
    (expectedRepository &&
      !repositoryInScope(endpointRepository(request.endpoint), expectedRepository))
  ) {
    reject()
  }
  if (!request.mutating) return
  if (!automationApiMutationAllowed(request)) reject()
}

export function assertDescendantCommandPolicy({
  role,
  tool,
  args,
  allowedPushBranch = null,
  expectedRepository = null,
}) {
  if (tool === 'git') {
    assertGitCommandPolicy(role, args, { allowedPushBranch })
    return
  }
  if (tool === 'gh') {
    assertGitHubCliPolicy(role, args, { expectedRepository })
    return
  }
  throw new Error(`unsupported authenticated tool: ${tool}`)
}

function assertRootCommandPolicy({
  role,
  tool,
  args,
  loopRoot,
  allowedPushBranch,
  expectedRepository,
}) {
  if (tool === 'git') {
    assertGitCommandPolicy(role, args, { allowedPushBranch })
    return
  }
  if (tool === 'gh') {
    assertGitHubCliPolicy(role, args, { expectedRepository })
    return
  }
  if (role === 'automation' && tool === 'node') {
    const script = args[0] ? path.resolve(args[0]) : null
    const allowedScripts = new Set([
      path.resolve(loopRoot, 'scripts', 'loopctl.mjs'),
      path.resolve(loopRoot, 'triggers', 'detect-work.mjs'),
    ])
    if (script && allowedScripts.has(script)) return
  }
  throw new Error(`command is outside the authenticated ${role} command tree`)
}

export async function resolveExecutable(name, environment, { skipDirectories = [] } = {}) {
  const skipped = new Set(skipDirectories.map((directory) => path.resolve(directory)))
  for (const directory of (environment.PATH ?? '').split(path.delimiter)) {
    if (!directory) continue
    const absoluteDirectory = path.resolve(directory)
    if (skipped.has(absoluteDirectory)) continue
    const candidate = path.join(absoluteDirectory, name)
    try {
      await access(candidate, constants.X_OK)
      return await realpath(candidate)
    } catch (error) {
      if (error?.code !== 'ENOENT' && error?.code !== 'EACCES') throw error
    }
  }
  throw new Error(`required executable is unavailable: ${name}`)
}

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`
}

async function resolveRequestedExecutable(command, environment) {
  if (!command.includes(path.sep)) return resolveExecutable(command, environment)
  const candidate = path.resolve(command)
  await access(candidate, constants.X_OK)
  return realpath(candidate)
}

async function authenticatedToolForExecutable(executable, { realGit, realGh }) {
  const realNode = await realpath(process.execPath)
  if (executable === realGit) return 'git'
  if (executable === realGh) return 'gh'
  if (executable === realNode) return 'node'
  return null
}

function normalizedRepositoryFromRemote(remoteUrl) {
  const value = remoteUrl.trim().replace(/\.git$/, '')
  for (const pattern of [
    /^https:\/\/github\.com\/([^/]+\/[^/]+)$/i,
    /^git@github\.com:([^/]+\/[^/]+)$/i,
    /^ssh:\/\/git@github\.com\/([^/]+\/[^/]+)$/i,
  ]) {
    const match = value.match(pattern)
    if (match) return match[1].toLowerCase()
  }
  return null
}

export async function assertPushTargetsRepository({ expectedRepository, realGit, environment }) {
  const expected = assertNonEmpty(expectedRepository, 'expectedRepository').toLowerCase()
  const { stdout } = await execFileAsync(realGit, ['remote', 'get-url', 'origin'], {
    env: environment,
    maxBuffer: 1024 * 1024,
  })
  if (normalizedRepositoryFromRemote(stdout) !== expected) {
    throw new Error(`origin must target the configured repository ${expectedRepository}`)
  }
}

async function readActivePushBranch(loopRoot) {
  const runsRoot = path.join(loopRoot, 'logs', 'runs')
  let entries
  try {
    entries = await readdir(runsRoot, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT') return null
    throw error
  }
  const active = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const run = await readJson(path.join(runsRoot, entry.name, 'run.json'))
    if (['running', 'waiting_for_owner', 'awaiting_owner_review'].includes(run.status)) {
      active.push(run.branch)
    }
  }
  if (active.length > 1) throw new Error('multiple active runs cannot authorize a Git push')
  return active[0] ?? null
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
  loopRoot,
  channel,
  role,
  command,
  args = [],
  environment = process.env,
  spawnCommand = spawn,
}) {
  const requestedCommand = assertNonEmpty(command, 'command')
  const resolved = await assertGitHubRoleIdentity({ channel, role, environment })
  const [realGit, realGh] = await Promise.all([
    resolveExecutable('git', resolved.routedEnvironment),
    resolveExecutable('gh', resolved.routedEnvironment),
  ])
  const executable = await resolveRequestedExecutable(requestedCommand, resolved.routedEnvironment)
  const tool = await authenticatedToolForExecutable(executable, { realGit, realGh })
  const allowedPushBranch = await readActivePushBranch(loopRoot)
  assertRootCommandPolicy({
    role,
    tool,
    args,
    loopRoot,
    allowedPushBranch,
    expectedRepository: channel.repository,
  })
  if (tool === 'git' && gitSubcommand(args).name === 'push') {
    await assertPushTargetsRepository({
      expectedRepository: channel.repository,
      realGit,
      environment: resolved.routedEnvironment,
    })
  }
  const childEnvironment = {
    ...resolved.routedEnvironment,
    PATH: `${identityBinDirectory}${path.delimiter}${resolved.routedEnvironment.PATH ?? ''}`,
    ECHO_UI_LOOP_GITHUB_ROLE: role,
    ECHO_UI_LOOP_IDENTITY_GATE: commandGatePath,
    ECHO_UI_LOOP_NODE: process.execPath,
    ECHO_UI_LOOP_ALLOWED_PUSH_BRANCH: allowedPushBranch ?? '',
    ECHO_UI_LOOP_EXPECTED_REPOSITORY: channel.repository,
  }
  const child = spawnCommand(executable, args, {
    env: childEnvironment,
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
