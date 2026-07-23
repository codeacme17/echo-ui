import { execFile, spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { access, readdir, realpath } from 'node:fs/promises'
import { devNull } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import { assertNonEmpty, parseGitHubTarget, readJson, sameGitHubLogin } from './common.mjs'
import { verifyLatestDurableCheckpoint } from './checkpoint-proof.mjs'
import { readEvents } from './run-store.mjs'

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

const inheritedEnvironmentNames = new Set([
  'CI',
  'COLORTERM',
  'FORCE_COLOR',
  'HOME',
  'HTTPS_PROXY',
  'HTTP_PROXY',
  'LANG',
  'LOGNAME',
  'NO_COLOR',
  'NO_PROXY',
  'PATH',
  'SHELL',
  'SSL_CERT_DIR',
  'SSL_CERT_FILE',
  'TEMP',
  'TERM',
  'TMP',
  'TMPDIR',
  'USER',
  'XDG_RUNTIME_DIR',
  'https_proxy',
  'http_proxy',
  'no_proxy',
])

function safeBaseEnvironment(channel, environment) {
  const safe = {}
  const dynamicNames = new Set([channel.webhookEnvironmentVariable].filter(Boolean))
  for (const [name, value] of Object.entries(environment)) {
    if (inheritedEnvironmentNames.has(name) || dynamicNames.has(name) || name.startsWith('LC_')) {
      safe[name] = value
    }
  }
  return safe
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
    ...safeBaseEnvironment(channel, environment),
    GH_CONFIG_DIR: configDirectory,
  }
  Object.assign(routedEnvironment, {
    GH_PAGER: 'cat',
    GH_PROMPT_DISABLED: '1',
    GIT_CONFIG_GLOBAL: devNull,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_COUNT: '5',
    GIT_CONFIG_KEY_0: 'credential.helper',
    GIT_CONFIG_VALUE_0: '',
    GIT_CONFIG_KEY_1: 'credential.helper',
    GIT_CONFIG_VALUE_1: `!${shellQuote(process.execPath)} ${shellQuote(
      commandGatePath,
    )} credential`,
    GIT_CONFIG_KEY_2: 'core.hooksPath',
    GIT_CONFIG_VALUE_2: devNull,
    GIT_CONFIG_KEY_3: 'core.fsmonitor',
    GIT_CONFIG_VALUE_3: 'false',
    GIT_CONFIG_KEY_4: 'protocol.ext.allow',
    GIT_CONFIG_VALUE_4: 'never',
    GIT_PAGER: 'cat',
    GIT_TERMINAL_PROMPT: '0',
    PAGER: 'cat',
  })
  return { configDirectory, expectedLogin, routedEnvironment }
}

export function hardenedGitArguments(args) {
  const subcommand = gitSubcommand(args)
  if (!['diff', 'show', 'log'].includes(subcommand.name)) return [...args]
  const hardened = [...args]
  hardened.splice(subcommand.index + 1, 0, '--no-ext-diff', '--no-textconv')
  return hardened
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

function authorizedPushBranches(authorization) {
  return new Set([authorization?.issue?.branch, authorization?.evolve?.branch].filter(Boolean))
}

export function assertGitCommandPolicy(role, args, { authorization = null } = {}) {
  const subcommand = gitSubcommand(args)
  if (subcommand.name === 'push') {
    if (role === 'reviewer') throw new Error('reviewer identity cannot run git push')
    const branch = args.at(-1)
    const isLoopBranch = authorizedPushBranches(authorization).has(branch)
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

  if (
    args.some(
      (argument) =>
        ['--ext-diff', '--textconv', '--exec-path'].includes(argument) ||
        ['--ext-diff=', '--textconv=', '--exec-path=', '--output='].some((prefix) =>
          argument.startsWith(prefix),
        ) ||
        argument === '--output',
    )
  ) {
    throw new Error(`git command is outside the authenticated ${role} command tree`)
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
  const fields = []

  for (let index = 0; index < apiArguments.length; index += 1) {
    const argument = apiArguments[index]
    if (optionsWithValue.has(argument)) {
      const value = apiArguments[index + 1]
      if (value === undefined) {
        valid = false
        break
      }
      if (argument === '--method' || argument === '-X') explicitMethod = value
      if (bodyOptions.has(argument)) {
        hasRequestBody = true
        fields.push(value)
      }
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
      if (bodyOptions.has(longOption)) {
        hasRequestBody = true
        fields.push(value)
      }
      continue
    }
    if (/^-X[A-Za-z]+$/.test(argument)) {
      explicitMethod = argument.slice(2)
      continue
    }
    if (/^-[fF].+/.test(argument)) {
      hasRequestBody = true
      fields.push(argument.slice(2))
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
    fields,
  }
}

function parseOptions(args, startIndex, { valueOptions = {}, booleanOptions = {} } = {}) {
  const values = new Map()
  const booleans = new Map()
  const positional = []
  const valueAliases = new Map(Object.entries(valueOptions))
  const booleanAliases = new Map(Object.entries(booleanOptions))
  let valid = true

  for (let index = startIndex; index < args.length; index += 1) {
    const argument = args[index]
    if (valueAliases.has(argument)) {
      const value = args[index + 1]
      if (value === undefined) {
        valid = false
        break
      }
      const name = valueAliases.get(argument)
      values.set(name, [...(values.get(name) ?? []), value])
      index += 1
      continue
    }
    const longValueOption = [...valueAliases].find(
      ([option]) => option.startsWith('--') && argument.startsWith(`${option}=`),
    )
    if (longValueOption) {
      const value = argument.slice(longValueOption[0].length + 1)
      if (!value) {
        valid = false
        break
      }
      const name = longValueOption[1]
      values.set(name, [...(values.get(name) ?? []), value])
      continue
    }
    if (booleanAliases.has(argument)) {
      booleans.set(booleanAliases.get(argument), true)
      continue
    }
    const longBooleanOption = [...booleanAliases].find(
      ([option]) => option.startsWith('--') && argument.startsWith(`${option}=`),
    )
    if (longBooleanOption) {
      const value = argument.slice(longBooleanOption[0].length + 1)
      if (!['true', 'false'].includes(value)) {
        valid = false
        break
      }
      booleans.set(longBooleanOption[1], value === 'true')
      continue
    }
    if (argument.startsWith('-')) {
      valid = false
      break
    }
    positional.push(argument)
  }
  return { booleans, positional, valid, values }
}

function exactlyOne(values, name) {
  const candidates = values.get(name) ?? []
  return candidates.length === 1 ? candidates[0] : null
}

function pullRequestTargetMatches(target, authorization, expectedRepository, repositoryOption) {
  const expectedNumber = authorization?.issue?.prNumber
  if (!Number.isInteger(expectedNumber)) return false
  if (/^\d+$/.test(target)) {
    return (
      Number(target) === expectedNumber &&
      repositoryInScope(repositoryOption, expectedRepository)
    )
  }
  const parsed = parseGitHubTarget(target)
  return (
    parsed?.kind === 'pull' &&
    parsed.number === expectedNumber &&
    repositoryInScope(`${parsed.owner}/${parsed.repo}`, expectedRepository) &&
    (repositoryOption === null || repositoryInScope(repositoryOption, expectedRepository))
  )
}

const repositoryValueOptions = {
  '--repo': 'repository',
  '-R': 'repository',
}

function reviewerCommentReviewAllowed(args, commandIndex, authorization, expectedRepository) {
  const parsed = parseOptions(args, commandIndex + 1, {
    valueOptions: {
      ...repositoryValueOptions,
      '--body': 'body',
      '-b': 'body',
      '--body-file': 'bodyFile',
      '-F': 'bodyFile',
    },
    booleanOptions: { '--comment': 'comment', '-c': 'comment' },
  })
  return (
    parsed.valid &&
    parsed.booleans.get('comment') === true &&
    parsed.positional.length === 1 &&
    pullRequestTargetMatches(
      parsed.positional[0],
      authorization,
      expectedRepository,
      exactlyOne(parsed.values, 'repository'),
    ) &&
    Number(Boolean(exactlyOne(parsed.values, 'body'))) +
      Number(Boolean(exactlyOne(parsed.values, 'bodyFile'))) ===
      1
  )
}

function pullRequestCreateAllowed(args, commandIndex, authorization, expectedRepository) {
  const parsed = parseOptions(args, commandIndex + 1, {
    valueOptions: {
      ...repositoryValueOptions,
      '--base': 'base',
      '-B': 'base',
      '--head': 'head',
      '-H': 'head',
      '--title': 'title',
      '-t': 'title',
      '--body': 'body',
      '-b': 'body',
      '--body-file': 'bodyFile',
      '-F': 'bodyFile',
    },
    booleanOptions: { '--draft': 'draft', '-d': 'draft' },
  })
  if (
    !parsed.valid ||
    parsed.positional.length !== 0 ||
    parsed.booleans.get('draft') !== true ||
    !repositoryInScope(exactlyOne(parsed.values, 'repository'), expectedRepository) ||
    exactlyOne(parsed.values, 'base') !== 'dev' ||
    !exactlyOne(parsed.values, 'title') ||
    Number(Boolean(exactlyOne(parsed.values, 'body'))) +
      Number(Boolean(exactlyOne(parsed.values, 'bodyFile'))) !==
      1
  ) {
    return false
  }
  const head = exactlyOne(parsed.values, 'head')
  if (head === authorization?.issue?.branch && authorization.issue.prNumber === null) {
    return true
  }
  if (head !== authorization?.evolve?.branch) return false
  const body = exactlyOne(parsed.values, 'body')
  return body?.includes(`<!-- issue-dev-loop:evolve-request:${authorization.evolve.requestId} -->`)
}

function pullRequestMutationAllowed(kind, args, commandIndex, authorization, expectedRepository) {
  const valueOptions =
    kind === 'edit'
      ? {
          ...repositoryValueOptions,
          '--title': 'title',
          '-t': 'title',
          '--body': 'body',
          '-b': 'body',
          '--body-file': 'bodyFile',
          '-F': 'bodyFile',
          '--add-reviewer': 'addReviewer',
        }
      : kind === 'comment'
        ? {
            ...repositoryValueOptions,
            '--body': 'body',
            '-b': 'body',
            '--body-file': 'bodyFile',
            '-F': 'bodyFile',
          }
        : repositoryValueOptions
  const parsed = parseOptions(args, commandIndex + 1, { valueOptions })
  if (
    !parsed.valid ||
    parsed.positional.length !== 1 ||
    !pullRequestTargetMatches(
      parsed.positional[0],
      authorization,
      expectedRepository,
      exactlyOne(parsed.values, 'repository'),
    )
  ) {
    return false
  }
  if (kind === 'ready') return parsed.values.size <= 1
  if (kind === 'comment') {
    return (
      Number(Boolean(exactlyOne(parsed.values, 'body'))) +
        Number(Boolean(exactlyOne(parsed.values, 'bodyFile'))) ===
      1
    )
  }
  const reviewers = (parsed.values.get('addReviewer') ?? []).flatMap((value) =>
    value.split(',').map((login) => login.trim()),
  )
  if (reviewers.some((login) => !sameGitHubLogin(login, authorization?.ownerGitHubLogin))) {
    return false
  }
  const editedFields = [...parsed.values.keys()].filter((name) => name !== 'repository')
  return editedFields.length > 0
}

function automationApiMutationAllowed({ endpoint, method, fields }, authorization) {
  if (!endpoint) return false
  const labels = endpoint.match(/^repos\/[^/]+\/[^/]+\/issues\/(\d+)\/labels(?:\/([^/]+))?$/)
  if (labels && Number(labels[1]) === authorization?.issue?.issueNumber) {
    if (method === 'POST') {
      return labels[2] === undefined && sameArguments(fields, ['labels[]=loop:claimed'])
    }
    return method === 'DELETE' && labels[2] === 'loop%3Aclaimed' && fields.length === 0
  }
  const issueComment = endpoint.match(/^repos\/[^/]+\/[^/]+\/issues\/(\d+)\/comments$/)
  const commentTargets = new Set(
    [
      authorization?.issue?.issueNumber,
      authorization?.issue?.prNumber,
      authorization?.stateIssueNumber,
    ].filter(Number.isInteger),
  )
  if (issueComment && method === 'POST' && commentTargets.has(Number(issueComment[1]))) {
    return fields.length === 1 && fields[0].startsWith('body=')
  }
  const reply = endpoint.match(/^repos\/[^/]+\/[^/]+\/pulls\/(\d+)\/comments\/\d+\/replies$/)
  return (
    reply !== null &&
    method === 'POST' &&
    Number(reply[1]) === authorization?.issue?.prNumber &&
    fields.length === 1 &&
    fields[0].startsWith('body=')
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

export function assertGitHubCliPolicy(
  role,
  args,
  { expectedRepository = null, authorization = null } = {},
) {
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
  const readOnlyIdentityRequest = (request) =>
    request.valid && !request.mutating && request.endpoint === 'user' && request.fields.length === 0

  if (role === 'reviewer') {
    if (group.name === 'api') {
      const request = githubApiRequest(args.slice(group.index + 1))
      if (readOnlyIdentityRequest(request)) return
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
    if (
      subcommand.name !== 'review' ||
      !reviewerCommentReviewAllowed(args, subcommand.index, authorization, expectedRepository)
    ) {
      reject()
    }
    return
  }

  if (group.name === 'issue') {
    if (!['list', 'view'].includes(subcommand.name)) reject()
    return
  }
  if (group.name === 'pr') {
    if (['list', 'view', 'checks', 'diff'].includes(subcommand.name)) return
    if (
      subcommand.name === 'create' &&
      pullRequestCreateAllowed(args, subcommand.index, authorization, expectedRepository)
    ) {
      return
    }
    if (
      ['edit', 'comment', 'ready'].includes(subcommand.name) &&
      pullRequestMutationAllowed(
        subcommand.name,
        args,
        subcommand.index,
        authorization,
        expectedRepository,
      )
    ) {
      return
    }
    reject()
    return
  }
  if (group.name === 'run') {
    if (!['list', 'view', 'download'].includes(subcommand.name)) reject()
    return
  }
  if (group.name !== 'api') reject()
  const request = githubApiRequest(args.slice(group.index + 1))
  if (readOnlyIdentityRequest(request)) return
  if (
    !request.valid ||
    request.endpoint === 'graphql' ||
    (expectedRepository &&
      !repositoryInScope(endpointRepository(request.endpoint), expectedRepository))
  ) {
    reject()
  }
  if (!request.mutating) return
  if (!automationApiMutationAllowed(request, authorization)) reject()
}

export function assertDescendantCommandPolicy({ role, tool, args, authorization = null }) {
  if (tool === 'git') {
    assertGitCommandPolicy(role, args, { authorization })
    return
  }
  if (tool === 'gh') {
    assertGitHubCliPolicy(role, args, {
      authorization,
      expectedRepository: authorization?.expectedRepository ?? null,
    })
    return
  }
  throw new Error(`unsupported authenticated tool: ${tool}`)
}

function assertRootCommandPolicy({ role, tool, args, loopRoot, authorization }) {
  if (tool === 'git') {
    assertGitCommandPolicy(role, args, { authorization })
    return
  }
  if (tool === 'gh') {
    assertGitHubCliPolicy(role, args, {
      authorization,
      expectedRepository: authorization?.expectedRepository ?? null,
    })
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

async function readOptionalJson(filePath) {
  try {
    return await readJson(filePath)
  } catch (error) {
    if (error?.code === 'ENOENT') return null
    throw error
  }
}

async function readAuthorizationContext(loopRoot, channel) {
  const runsRoot = path.join(loopRoot, 'logs', 'runs')
  let entries
  try {
    entries = await readdir(runsRoot, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT') entries = []
    else throw error
  }
  const active = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const run = await readJson(path.join(runsRoot, entry.name, 'run.json'))
    if (
      run.finishedAt === null &&
      ['running', 'waiting_for_owner', 'awaiting_owner_review'].includes(run.status)
    ) {
      active.push(run)
    }
  }
  if (active.length > 1) {
    throw new Error('multiple active runs cannot authorize GitHub mutations')
  }
  const run = active[0] ?? null
  const pullTarget = run?.prUrl ? parseGitHubTarget(run.prUrl) : null
  const issue = run
    ? {
        branch: assertNonEmpty(run.branch, 'run.branch'),
        issueNumber: run.issueNumber,
        prNumber: pullTarget?.kind === 'pull' ? pullTarget.number : null,
        runId: assertNonEmpty(run.runId, 'run.runId'),
        status: run.status,
        headSha: run.headSha,
        implementationCommit: run.implementationCommit,
      }
    : null

  const metrics = await readOptionalJson(path.join(loopRoot, 'evolve', 'metrics.json'))
  let evolve = null
  if (metrics?.evolveDue) {
    const requestId = assertNonEmpty(metrics.pendingRequestId, 'metrics.pendingRequestId')
    if (!/^[A-Z0-9-]+$/.test(requestId)) {
      throw new Error('pending evolve request ID cannot authorize a branch')
    }
    const request = await readJson(path.join(loopRoot, 'evolve', 'requests', `${requestId}.json`))
    if (request.requestId !== requestId || request.status !== 'pending') {
      throw new Error('pending evolve authorization does not match its request')
    }
    evolve = { requestId, branch: `codex/evolve-${requestId}` }
  }
  if (issue && evolve) {
    throw new Error('issue and evolve work cannot share one mutation authorization')
  }

  return {
    expectedRepository: assertNonEmpty(channel.repository, 'channel.repository'),
    ownerGitHubLogin: assertNonEmpty(channel.ownerGitHubLogin, 'channel.ownerGitHubLogin'),
    stateIssueNumber: channel.stateIssueNumber,
    issue,
    evolve,
  }
}

function argumentAfter(args, name) {
  const index = args.indexOf(name)
  return index === -1 ? null : (args[index + 1] ?? null)
}

function withRootCommandIntent(authorization, { tool, args, loopRoot }) {
  const script = args[0] ? path.resolve(args[0]) : null
  if (
    tool !== 'node' ||
    script !== path.resolve(loopRoot, 'scripts', 'loopctl.mjs') ||
    args[1] !== 'start' ||
    authorization.issue !== null
  ) {
    return authorization
  }
  const issueNumber = Number(argumentAfter(args, '--issue'))
  const issueUrl = argumentAfter(args, '--url')
  const target = parseGitHubTarget(issueUrl)
  if (
    !Number.isInteger(issueNumber) ||
    issueNumber < 1 ||
    target?.kind !== 'issues' ||
    target.number !== issueNumber ||
    !repositoryInScope(`${target.owner}/${target.repo}`, authorization.expectedRepository)
  ) {
    throw new Error('loopctl start intent must identify one issue in the configured repository')
  }
  return {
    ...authorization,
    issue: {
      branch: `codex/issue-${issueNumber}`,
      issueNumber,
      prNumber: null,
      runId: null,
      status: 'starting',
      headSha: null,
      implementationCommit: null,
    },
  }
}

function activationValidationRequested({ role, tool, args, loopRoot }) {
  return (
    role === 'automation' &&
    tool === 'node' &&
    args.length === 3 &&
    path.resolve(args[0]) === path.resolve(loopRoot, 'scripts', 'loopctl.mjs') &&
    args[1] === 'validate' &&
    args[2] === '--activation'
  )
}

function pullRequestWriteIntent(role, args) {
  const group = githubGroup(args)
  if (group.name !== 'pr') return null
  const command = commandAfterGroup(args, group.index)
  if (role === 'reviewer' && command.name === 'review') {
    return { kind: 'review', commandIndex: command.index }
  }
  if (role === 'automation' && ['create', 'edit', 'comment', 'ready'].includes(command.name)) {
    return { kind: command.name, commandIndex: command.index }
  }
  return null
}

function editRequestsOwnerReview(args, commandIndex) {
  const parsed = parseOptions(args, commandIndex + 1, {
    valueOptions: {
      ...repositoryValueOptions,
      '--title': 'title',
      '-t': 'title',
      '--body': 'body',
      '-b': 'body',
      '--body-file': 'bodyFile',
      '-F': 'bodyFile',
      '--add-reviewer': 'addReviewer',
    },
  })
  return parsed.values.has('addReviewer')
}

function hasExactHeadGate(events, eventType, headSha) {
  return events.some(
    (event) =>
      event.type === eventType &&
      event.status === 'passed' &&
      event.payload?.headSha === headSha,
  )
}

async function preflightPullRequestWrite({
  role,
  args,
  authorization,
  channel,
  loopRoot,
  realGh,
  environment,
}) {
  const intent = pullRequestWriteIntent(role, args)
  if (!intent || authorization.evolve) return
  const runId = authorization.issue?.runId
  if (!runId) throw new Error('pull request write requires an active durable run')
  const events = await readEvents(loopRoot, runId)
  const githubApi = async (endpoint) => {
    const { stdout } = await execFileAsync(realGh, ['api', endpoint], {
      env: environment,
      maxBuffer: 1024 * 1024,
    })
    return JSON.parse(stdout)
  }
  const durable = await verifyLatestDurableCheckpoint({
    loopRoot,
    runId,
    events,
    operation: `GitHub PR ${intent.kind}`,
    githubApi,
  })
  const run = durable.record.run
  if (run.status !== 'running' || run.finishedAt !== null) {
    throw new Error('pull request writes require a running durable run')
  }
  if (intent.kind === 'create') {
    const implementation = events.findLast(
      (event) =>
        event.type === 'implementation_completed' &&
        event.status === 'passed' &&
        event.payload?.commitSha === run.implementationCommit,
    )
    if (run.prUrl !== null || run.headSha !== null || !implementation) {
      throw new Error('draft PR creation requires a durably recorded implementation without a PR')
    }
    return
  }

  if (!Number.isInteger(authorization.issue?.prNumber) || !run.prUrl || !run.headSha) {
    throw new Error('pull request write requires a durably recorded PR and head')
  }
  const [owner, repo] = authorization.expectedRepository.split('/')
  const livePullRequest = await githubApi(
    `repos/${owner}/${repo}/pulls/${authorization.issue.prNumber}`,
  )
  const liveMatchesRecordedState =
    livePullRequest.state === 'open' &&
    livePullRequest.base?.ref === 'dev' &&
    livePullRequest.base?.repo?.full_name?.toLowerCase() ===
      authorization.expectedRepository.toLowerCase() &&
    livePullRequest.head?.ref === run.branch &&
    livePullRequest.head?.repo?.full_name?.toLowerCase() ===
      authorization.expectedRepository.toLowerCase() &&
    livePullRequest.head?.sha === run.headSha &&
    sameGitHubLogin(livePullRequest.user?.login, channel.automationGitHubLogin)
  if (!liveMatchesRecordedState) {
    throw new Error('live pull request does not match the durable recorded head, branch, and base')
  }

  if (intent.kind === 'review') {
    if (livePullRequest.draft !== true) {
      throw new Error('independent review publication requires the recorded Draft PR')
    }
    return
  }
  if (intent.kind === 'ready') {
    if (
      livePullRequest.draft !== true ||
      !hasExactHeadGate(events, 'verification_completed', run.headSha) ||
      !hasExactHeadGate(events, 'review_completed', run.headSha)
    ) {
      throw new Error('PR ready requires exact-head evidence and review in the durable checkpoint')
    }
    return
  }
  if (intent.kind === 'edit' && editRequestsOwnerReview(args, intent.commandIndex)) {
    if (
      livePullRequest.draft !== false ||
      !hasExactHeadGate(events, 'verification_completed', run.headSha) ||
      !hasExactHeadGate(events, 'review_completed', run.headSha)
    ) {
      throw new Error('owner review request requires a ready PR with exact-head evidence and review')
    }
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
  const authorization = withRootCommandIntent(await readAuthorizationContext(loopRoot, channel), {
    tool,
    args,
    loopRoot,
  })
  assertRootCommandPolicy({
    role,
    tool,
    args,
    loopRoot,
    authorization,
  })
  const activationValidation = activationValidationRequested({
    role,
    tool,
    args,
    loopRoot,
  })
  if (activationValidation) {
    await assertGitHubRoleIdentity({
      channel,
      role: 'reviewer',
      environment,
      identityCommand: (_command, identityArgs, options) =>
        execFileAsync(realGh, identityArgs, options),
    })
  }
  if (tool === 'gh') {
    await preflightPullRequestWrite({
      role,
      args,
      authorization,
      channel,
      loopRoot,
      realGh,
      environment: resolved.routedEnvironment,
    })
  }
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
    ECHO_UI_LOOP_AUTHORIZATION: JSON.stringify(authorization),
  }
  let executionArgs = tool === 'git' ? hardenedGitArguments(args) : [...args]
  if (activationValidation) executionArgs = [args[0], 'validate']
  const child = spawnCommand(executable, executionArgs, {
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
