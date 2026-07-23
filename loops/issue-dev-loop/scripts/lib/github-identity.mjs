import { execFile, spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { access, readdir } from 'node:fs/promises'
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

function gitSubcommand(args) {
  let index = 0
  while (index < args.length && args[index].startsWith('-')) {
    const argument = args[index]
    if (['-C', '--git-dir', '--work-tree', '--namespace'].includes(argument)) {
      index += 2
      continue
    }
    if (
      ['--no-pager', '--paginate', '--literal-pathspecs', '--no-optional-locks'].includes(argument) ||
      ['--git-dir=', '--work-tree=', '--namespace='].some((prefix) =>
        argument.startsWith(prefix),
      )
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
    args.slice(subcommand.index + 1).every((argument) =>
      ['--show-current', '--list', '-l'].includes(argument),
    )
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
    subcommand.name === 'remote' &&
    ['get-url', '-v'].includes(args[subcommand.index + 1])
  ) {
    return
  }
  if (role === 'automation' && subcommand.name === 'fetch') return
  throw new Error(`git command is outside the authenticated ${role} command tree`)
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

function commandAfterGroup(args, groupIndex) {
  let index = groupIndex + 1
  while (index < args.length) {
    const argument = args[index]
    if (['--repo', '-R', '--hostname'].includes(argument)) {
      index += 2
      continue
    }
    if (argument.startsWith('-')) {
      index += 1
      continue
    }
    return argument
  }
  return null
}

function githubGroup(args) {
  const groups = new Set(['api', 'issue', 'pr', 'run', 'repo'])
  const index = args.findIndex((argument) => groups.has(argument))
  return { index, name: index === -1 ? null : args[index] }
}

function githubApiRequest(apiArguments) {
  const explicitMethod =
    argumentValue(apiArguments, ['--method', '-X']) ??
    apiArguments.find((argument) => /^-X[A-Za-z]+$/.test(argument))?.slice(2)
  const hasRequestBody = apiArguments.some(
    (argument) =>
      ['-f', '-F', '--field', '--raw-field', '--input'].includes(argument) ||
      ['--field=', '--raw-field=', '--input='].some((prefix) => argument.startsWith(prefix)),
  )
  const method = (explicitMethod ?? (hasRequestBody ? 'POST' : 'GET')).toUpperCase()
  const endpoint =
    apiArguments.find((argument) => /^\/?(?:graphql|repos\/[^/]+\/[^/]+\/)/.test(argument)) ??
    null
  return {
    endpoint: endpoint?.replace(/^\//, '').split('?')[0] ?? null,
    method,
    mutating: method !== 'GET',
  }
}

function automationApiMutationAllowed({ endpoint, method }) {
  if (!endpoint) return false
  if (
    /^repos\/[^/]+\/[^/]+\/issues\/\d+\/labels(?:\/[^/]+)?$/.test(endpoint) &&
    ['POST', 'DELETE'].includes(method)
  ) {
    return true
  }
  if (
    /^repos\/[^/]+\/[^/]+\/issues\/\d+\/comments$/.test(endpoint) &&
    method === 'POST'
  ) {
    return true
  }
  if (
    /^repos\/[^/]+\/[^/]+\/(?:issues|pulls)\/comments\/\d+$/.test(endpoint) &&
    method === 'PATCH'
  ) {
    return true
  }
  return (
    /^repos\/[^/]+\/[^/]+\/pulls\/\d+\/comments\/\d+\/replies$/.test(endpoint) &&
    method === 'POST'
  )
}

export function assertGitHubCliPolicy(role, args) {
  const group = githubGroup(args)
  const reject = () => {
    throw new Error(`GitHub action is prohibited for the ${role} role`)
  }
  if (!group.name) reject()
  const subcommand = commandAfterGroup(args, group.index)

  if (role === 'reviewer') {
    if (group.name === 'api') {
      const request = githubApiRequest(args.slice(group.index + 1))
      if (request.mutating || request.endpoint === 'graphql') reject()
      return
    }
    if (group.name === 'run' && subcommand === 'view') return
    if (group.name !== 'pr') reject()
    if (['view', 'diff', 'checks'].includes(subcommand)) return
    if (subcommand !== 'review') reject()
    const isComment = args.includes('--comment') || args.includes('-c')
    const isApproval = args.includes('--approve') || args.includes('-a')
    const requestsChanges = args.includes('--request-changes') || args.includes('-r')
    if (!isComment || isApproval || requestsChanges) reject()
    return
  }

  if (group.name === 'issue') {
    if (!['list', 'view', 'comment', 'edit'].includes(subcommand)) reject()
    return
  }
  if (group.name === 'pr') {
    if (
      !['list', 'view', 'create', 'edit', 'comment', 'ready', 'checks', 'diff'].includes(
        subcommand,
      )
    ) {
      reject()
    }
    return
  }
  if (group.name === 'run') {
    if (!['list', 'view', 'download'].includes(subcommand)) reject()
    return
  }
  if (group.name !== 'api') reject()
  const request = githubApiRequest(args.slice(group.index + 1))
  if (request.endpoint === 'graphql') reject()
  if (!request.mutating) return
  if (!automationApiMutationAllowed(request)) reject()
}

export function assertDescendantCommandPolicy({ role, tool, args, allowedPushBranch = null }) {
  if (tool === 'git') {
    assertGitCommandPolicy(role, args, { allowedPushBranch })
    return
  }
  if (tool === 'gh') {
    assertGitHubCliPolicy(role, args)
    return
  }
  throw new Error(`unsupported authenticated tool: ${tool}`)
}

function assertRootCommandPolicy({ role, executable, args, loopRoot, allowedPushBranch }) {
  const command = path.basename(executable)
  if (command === 'git') {
    assertGitCommandPolicy(role, args, { allowedPushBranch })
    return
  }
  if (command === 'gh') {
    assertGitHubCliPolicy(role, args)
    return
  }
  if (role === 'automation' && command.startsWith('node')) {
    const script = args[0] ? path.resolve(args[0]) : null
    const allowedScripts = new Set([
      path.resolve(loopRoot, 'scripts', 'loopctl.mjs'),
      path.resolve(loopRoot, 'triggers', 'detect-work.mjs'),
    ])
    if (script && allowedScripts.has(script)) return
  }
  throw new Error(`${command} is outside the authenticated ${role} command tree`)
}

async function resolveExecutable(name, environment) {
  for (const directory of (environment.PATH ?? '').split(path.delimiter)) {
    if (!directory) continue
    const candidate = path.join(directory, name)
    try {
      await access(candidate, constants.X_OK)
      return candidate
    } catch (error) {
      if (error?.code !== 'ENOENT' && error?.code !== 'EACCES') throw error
    }
  }
  throw new Error(`required executable is unavailable: ${name}`)
}

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`
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
  const executable = assertNonEmpty(command, 'command')
  const resolved = await assertGitHubRoleIdentity({ channel, role, environment })
  const allowedPushBranch = await readActivePushBranch(loopRoot)
  assertRootCommandPolicy({ role, executable, args, loopRoot, allowedPushBranch })
  const [realGit, realGh] = await Promise.all([
    resolveExecutable('git', resolved.routedEnvironment),
    resolveExecutable('gh', resolved.routedEnvironment),
  ])
  const childEnvironment = {
    ...resolved.routedEnvironment,
    GIT_CONFIG_VALUE_1: `!${shellQuote(realGh)} auth git-credential`,
    PATH: `${identityBinDirectory}${path.delimiter}${resolved.routedEnvironment.PATH ?? ''}`,
    ECHO_UI_LOOP_GITHUB_ROLE: role,
    ECHO_UI_LOOP_REAL_GIT: realGit,
    ECHO_UI_LOOP_REAL_GH: realGh,
    ECHO_UI_LOOP_IDENTITY_GATE: commandGatePath,
    ECHO_UI_LOOP_NODE: process.execPath,
    ECHO_UI_LOOP_ALLOWED_PUSH_BRANCH: allowedPushBranch ?? '',
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
