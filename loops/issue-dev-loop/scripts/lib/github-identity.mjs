import { execFile, spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { access, lstat, readdir, realpath } from 'node:fs/promises'
import { devNull } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

import {
  assertIssueNumber,
  assertNonEmpty,
  paginateGitHubApi,
  parseGitHubTarget,
  readJson,
  sameGitHubLogin,
} from './common.mjs'
import {
  checkpointRecordDigest,
  parseCheckpointRecord,
  validateCheckpointRecord,
  verifyLatestDurableCheckpoint,
} from './checkpoint-proof.mjs'
import { verifyPublishedEvolveRequest } from './evolve.mjs'
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
  'LANG',
  'LOGNAME',
  'NO_COLOR',
  'PATH',
  'SHELL',
  'TEMP',
  'TERM',
  'TMP',
  'TMPDIR',
  'USER',
  'XDG_RUNTIME_DIR',
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

  const repositoryUrl = canonicalRepositoryUrl(
    assertNonEmpty(channel.repository, 'channel.repository'),
  )
  const routedEnvironment = {
    ...safeBaseEnvironment(channel, environment),
    GH_CONFIG_DIR: configDirectory,
  }
  Object.assign(routedEnvironment, {
    GH_PAGER: 'cat',
    GH_PROMPT_DISABLED: '1',
    GIT_CONFIG_GLOBAL: devNull,
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_COUNT: '15',
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
    GIT_CONFIG_KEY_5: `url.${repositoryUrl}.insteadOf`,
    GIT_CONFIG_VALUE_5: repositoryUrl,
    GIT_CONFIG_KEY_6: `url.${repositoryUrl}.pushInsteadOf`,
    GIT_CONFIG_VALUE_6: repositoryUrl,
    GIT_CONFIG_KEY_7: 'http.proxy',
    GIT_CONFIG_VALUE_7: '',
    GIT_CONFIG_KEY_8: 'http.extraHeader',
    GIT_CONFIG_VALUE_8: '',
    GIT_CONFIG_KEY_9: 'http.cookieFile',
    GIT_CONFIG_VALUE_9: devNull,
    GIT_CONFIG_KEY_10: 'http.saveCookies',
    GIT_CONFIG_VALUE_10: 'false',
    GIT_CONFIG_KEY_11: 'http.sslVerify',
    GIT_CONFIG_VALUE_11: 'true',
    GIT_CONFIG_KEY_12: 'http.curloptResolve',
    GIT_CONFIG_VALUE_12: '',
    GIT_CONFIG_KEY_13: 'remote.origin.proxy',
    GIT_CONFIG_VALUE_13: '',
    GIT_CONFIG_KEY_14: 'http.followRedirects',
    GIT_CONFIG_VALUE_14: 'initial',
    GIT_PAGER: 'cat',
    GIT_TERMINAL_PROMPT: '0',
    PAGER: 'cat',
  })
  return { configDirectory, expectedLogin, routedEnvironment }
}

function containsPath(root, target) {
  return target === root || target.startsWith(`${root}${path.sep}`)
}

function repositoryRootForLoop(loopRoot) {
  const loopsRoot = path.dirname(loopRoot)
  return path.basename(loopsRoot) === 'loops' ? path.dirname(loopsRoot) : path.resolve(loopRoot)
}

async function assertPrivateCredentialTree(root) {
  const expectedUid = typeof process.getuid === 'function' ? process.getuid() : null
  const visit = async (target) => {
    const stats = await lstat(target)
    if (stats.isSymbolicLink() || (!stats.isDirectory() && !stats.isFile())) {
      throw new Error(`GitHub credential profile contains an unsafe entry: ${target}`)
    }
    if ((stats.mode & 0o077) !== 0) {
      throw new Error(`GitHub credential profile entries must deny group/other access: ${target}`)
    }
    if (expectedUid !== null && stats.uid !== expectedUid) {
      throw new Error(`GitHub credential profile must be owned by the scheduler user: ${target}`)
    }
    if (stats.isDirectory()) {
      for (const entry of await readdir(target)) await visit(path.join(target, entry))
    }
  }
  await visit(root)
}

export async function assertCredentialProfileIsolation({
  channel,
  configDirectory,
  environment = process.env,
  requiredUntrustedRoots = [],
}) {
  const variableName = assertNonEmpty(
    channel.untrustedRootsEnvironmentVariable,
    'channel.untrustedRootsEnvironmentVariable',
  )
  let configuredRoots
  try {
    configuredRoots = JSON.parse(assertNonEmpty(environment[variableName], variableName))
  } catch {
    throw new Error(`${variableName} must contain a JSON array of absolute untrusted roots`)
  }
  if (
    !Array.isArray(configuredRoots) ||
    configuredRoots.length === 0 ||
    configuredRoots.some((root) => typeof root !== 'string' || !path.isAbsolute(root))
  ) {
    throw new Error(`${variableName} must contain a non-empty JSON array of absolute paths`)
  }
  const lexicalConfigDirectory = path.resolve(configDirectory)
  const configuredProfileStats = await lstat(lexicalConfigDirectory)
  if (configuredProfileStats.isSymbolicLink() || !configuredProfileStats.isDirectory()) {
    throw new Error('GitHub credential profile path must be a real directory, not a symlink')
  }
  const [canonicalConfigDirectory, canonicalRoots, canonicalRequiredRoots] = await Promise.all([
    realpath(lexicalConfigDirectory),
    Promise.all(configuredRoots.map((root) => realpath(root))),
    Promise.all(requiredUntrustedRoots.map((root) => realpath(root))),
  ])
  for (const requiredRoot of canonicalRequiredRoots) {
    if (!canonicalRoots.some((root) => containsPath(root, requiredRoot))) {
      throw new Error(`${variableName} must cover the repository and every untrusted agent root`)
    }
  }
  if (canonicalRoots.some((root) => containsPath(root, canonicalConfigDirectory))) {
    throw new Error('GitHub credential profiles must be outside every untrusted agent root')
  }
  await assertPrivateCredentialTree(canonicalConfigDirectory)
  return canonicalConfigDirectory
}

function canonicalRepositoryUrl(repository) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error('configured repository must be an owner/name pair')
  }
  return `https://github.com/${repository}.git`
}

export function hardenedGitArguments(args, { expectedRepository = null } = {}) {
  const subcommand = gitSubcommand(args)
  const hardened = [...args]
  if (['diff', 'show', 'log'].includes(subcommand.name)) {
    hardened.splice(subcommand.index + 1, 0, '--no-ext-diff', '--no-textconv')
  }
  if (!expectedRepository) return hardened
  const repositoryUrl = canonicalRepositoryUrl(expectedRepository)
  if (subcommand.name === 'push') {
    const lease = args[subcommand.index + 1]
    const deleteRef = args.at(-1)
    const rollback = lease?.match(
      /^--force-with-lease=(refs\/heads\/codex\/issue-[1-9][0-9]*):([0-9a-f]{40})$/,
    )
    if (
      rollback &&
      sameArguments(args, ['push', lease, 'origin', `:${rollback[1]}`])
    ) {
      return ['push', lease, repositoryUrl, deleteRef]
    }
    const branch = args.at(-1)
    return ['push', repositoryUrl, `refs/heads/${branch}:refs/heads/${branch}`]
  }
  if (subcommand.name === 'fetch') {
    const branch = args.at(-1)
    return ['fetch', repositoryUrl, `refs/heads/${branch}:refs/remotes/origin/${branch}`]
  }
  if (subcommand.name === 'ls-remote') {
    return ['ls-remote', '--heads', repositoryUrl, 'refs/heads/codex/issue-*']
  }
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
    const claimBranch = authorization?.issue?.branch
    const claimRollback =
      authorization?.rootIntent === 'start' &&
      authorization?.issue?.status === 'starting' &&
      sameArguments(args, [
        'push',
        `--force-with-lease=refs/heads/${claimBranch}:${authorization?.issue?.baseSha}`,
        'origin',
        `:refs/heads/${claimBranch}`,
      ])
    if (claimRollback) return
    const branch = args.at(-1)
    const isLoopBranch = authorizedPushBranches(authorization).has(branch)
    const isAllowedShape =
      subcommand.index === 0 &&
      isLoopBranch &&
      [['push', 'origin', branch]].some((expected) => sameArguments(args, expected))
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

  const readOnly = new Set(['rev-parse', 'status', 'merge-base', 'show', 'diff', 'log'])
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
  if (
    role === 'automation' &&
    subcommand.index === 0 &&
    sameArguments(args.slice(subcommand.index), [
      'ls-remote',
      '--heads',
      'origin',
      'refs/heads/codex/issue-*',
    ])
  ) {
    return
  }
  if (
    role === 'automation' &&
    subcommand.index === 0 &&
    subcommand.name === 'fetch' &&
    authorizedPushBranches(authorization).has(args.at(-1)) &&
    sameArguments(args.slice(subcommand.index), ['fetch', 'origin', args.at(-1)])
  ) {
    return
  }
  if (
    role === 'automation' &&
    subcommand.index === 0 &&
    sameArguments(args.slice(subcommand.index), ['fetch', 'origin', 'dev'])
  ) {
    return
  }
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
  let usesFileExpansion = false
  let usesInput = false
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
      if (argument === '--input') usesInput = true
      if (bodyOptions.has(argument)) {
        hasRequestBody = true
        fields.push(value)
        if (
          ['-F', '--field'].includes(argument) &&
          (value.startsWith('@') || value.slice(value.indexOf('=') + 1).startsWith('@'))
        ) {
          usesFileExpansion = true
        }
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
      if (longOption === '--input') usesInput = true
      if (bodyOptions.has(longOption)) {
        hasRequestBody = true
        fields.push(value)
        if (
          longOption === '--field' &&
          (value.startsWith('@') || value.slice(value.indexOf('=') + 1).startsWith('@'))
        ) {
          usesFileExpansion = true
        }
      }
      continue
    }
    if (/^-X[A-Za-z]+$/.test(argument)) {
      explicitMethod = argument.slice(2)
      continue
    }
    if (/^-[fF].+/.test(argument)) {
      hasRequestBody = true
      const value = argument.slice(2)
      fields.push(value)
      if (
        argument.startsWith('-F') &&
        (value.startsWith('@') || value.slice(value.indexOf('=') + 1).startsWith('@'))
      ) {
        usesFileExpansion = true
      }
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
    usesFileExpansion,
    usesInput,
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
      Number(target) === expectedNumber && repositoryInScope(repositoryOption, expectedRepository)
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

function parseReviewPublication(body, authorization, { requireCurrentHead = true } = {}) {
  if (typeof body !== 'string') return null
  const matches = [
    ...body.matchAll(
      /<!-- issue-dev-loop:([^:]+):review-cycle:([1-9][0-9]*):round:([12]):head:([0-9a-f]{40}) -->/gi,
    ),
  ]
  if (
    matches.length !== 1 ||
    matches[0][1] !== authorization?.issue?.runId ||
    (requireCurrentHead &&
      matches[0][4].toLowerCase() !== authorization?.issue?.headSha?.toLowerCase())
  ) {
    return null
  }
  return {
    kind: 'cycle',
    cycle: Number(matches[0][2]),
    round: Number(matches[0][3]),
    headSha: matches[0][4].toLowerCase(),
  }
}

function parseAdjudicationPublication(body, authorization) {
  if (typeof body !== 'string') return null
  const matches = [
    ...body.matchAll(
      /<!-- issue-dev-loop:([^:]+):(RVW-[1-9][0-9]*-[12]-[1-9][0-9]*):adjudication:(REJECT_FINDING):head:([0-9a-f]{40}) -->/gi,
    ),
  ]
  if (
    matches.length !== 1 ||
    matches[0][1] !== authorization?.issue?.runId ||
    matches[0][4].toLowerCase() !== authorization?.issue?.headSha?.toLowerCase()
  ) {
    return null
  }
  return {
    kind: 'adjudication',
    findingId: matches[0][2],
    verdict: matches[0][3],
    headSha: matches[0][4].toLowerCase(),
    marker: matches[0][0],
  }
}

function reviewerCommentReview(args, commandIndex, authorization) {
  const parsed = parseOptions(args, commandIndex + 1, {
    valueOptions: {
      ...repositoryValueOptions,
      '--body': 'body',
      '-b': 'body',
    },
    booleanOptions: { '--comment': 'comment', '-c': 'comment' },
  })
  const body = exactlyOne(parsed.values, 'body')
  const cyclePublication = parseReviewPublication(body, authorization)
  const adjudicationPublication = parseAdjudicationPublication(body, authorization)
  return {
    parsed,
    body,
    publication:
      Boolean(cyclePublication) === Boolean(adjudicationPublication)
        ? null
        : (cyclePublication ?? adjudicationPublication),
  }
}

function reviewerCommentReviewAllowed(args, commandIndex, authorization, expectedRepository) {
  const { parsed, body, publication } = reviewerCommentReview(args, commandIndex, authorization)
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
    Boolean(body) &&
    Boolean(publication)
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
    !exactlyOne(parsed.values, 'body')
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
          '--add-reviewer': 'addReviewer',
        }
      : kind === 'comment'
        ? {
            ...repositoryValueOptions,
            '--body': 'body',
            '-b': 'body',
          }
        : repositoryValueOptions
  const parsed = parseOptions(args, commandIndex + 1, {
    valueOptions,
    booleanOptions: kind === 'ready' ? { '--undo': 'undo' } : {},
  })
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
  if (kind === 'ready') {
    return (
      parsed.values.size <= 1 &&
      parsed.booleans.size === 1 &&
      parsed.booleans.get('undo') === true
    )
  }
  if (kind === 'comment') {
    const body = exactlyOne(parsed.values, 'body')
    return Boolean(body) && !reservedAutomationComment(body)
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

function reservedAutomationComment(body) {
  return (
    body.includes('**pr_completed**') ||
    body.includes('<!-- issue-dev-loop:evolve-completion:') ||
    body.includes('<!-- issue-dev-loop:checkpoint:')
  )
}

function checkpointPublicationAllowed(body, authorization) {
  const markers = [
    ...body.matchAll(
      /<!-- issue-dev-loop:checkpoint:([^:]+):sha256:([0-9a-f]{64}) -->/g,
    ),
  ]
  if (markers.length !== 1 || markers[0][1] !== authorization?.issue?.runId) {
    return false
  }
  try {
    const record = validateCheckpointRecord(parseCheckpointRecord(body))
    return (
      record.run.runId === authorization.issue.runId &&
      record.run.issueNumber === authorization.issue.issueNumber &&
      record.run.branch === authorization.issue.branch &&
      checkpointRecordDigest(record) === markers[0][2]
    )
  } catch {
    return false
  }
}

function automationCommentBodyAllowed(body, authorization) {
  if (!reservedAutomationComment(body)) return true
  if (body.includes('<!-- issue-dev-loop:checkpoint:')) {
    return checkpointPublicationAllowed(body, authorization)
  }
  if (body.includes('**pr_completed**')) {
    return authorization?.rootIntent === 'prepare-finalization'
  }
  return authorization?.rootIntent === 'evolve-complete'
}

function automationApiMutationAllowed(
  { endpoint, method, fields, usesFileExpansion, usesInput },
  authorization,
) {
  if (!endpoint || usesInput || usesFileExpansion) return false
  if (
    endpoint.match(/^repos\/[^/]+\/[^/]+\/git\/refs$/) &&
    method === 'POST' &&
    authorization?.rootIntent === 'start' &&
    authorization?.issue?.status === 'starting'
  ) {
    return sameArguments(fields, [
      `ref=refs/heads/${authorization.issue.branch}`,
      `sha=${authorization.issue.baseSha}`,
    ])
  }
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
    const body = fields.length === 1 && fields[0].startsWith('body=') ? fields[0].slice(5) : null
    const checkpointBody = body?.includes('<!-- issue-dev-loop:checkpoint:')
    return (
      Boolean(body) &&
      (!checkpointBody || Number(issueComment[1]) === authorization?.stateIssueNumber) &&
      automationCommentBodyAllowed(body, authorization)
    )
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

function apiField(field) {
  const separator = field.indexOf('=')
  return separator === -1
    ? { name: field, value: '' }
    : { name: field.slice(0, separator), value: field.slice(separator + 1) }
}

function reviewerInlineReviewAllowed(request, authorization, expectedRepository) {
  const match = request.endpoint?.match(/^repos\/([^/]+\/[^/]+)\/pulls\/(\d+)\/reviews$/)
  if (
    request.method !== 'POST' ||
    request.usesInput ||
    request.usesFileExpansion ||
    !match ||
    !repositoryInScope(match[1], expectedRepository) ||
    Number(match[2]) !== authorization?.issue?.prNumber ||
    !authorization?.issue?.runId ||
    !/^[0-9a-f]{40}$/i.test(authorization.issue.headSha ?? '')
  ) {
    return false
  }
  const fields = request.fields.map(apiField)
  const values = (name) => fields.filter((field) => field.name === name).map((field) => field.value)
  const body = values('body')
  const commitIds = values('commit_id')
  const events = values('event')
  const publication = parseReviewPublication(body[0], authorization)
  if (
    body.length !== 1 ||
    commitIds.length !== 1 ||
    events.length !== 1 ||
    commitIds[0] !== authorization.issue.headSha ||
    events[0] !== 'COMMENT' ||
    !publication
  ) {
    return false
  }
  const permittedNames = new Set([
    'body',
    'commit_id',
    'event',
    'comments[][path]',
    'comments[][line]',
    'comments[][side]',
    'comments[][body]',
  ])
  if (fields.some((field) => !permittedNames.has(field.name))) return false
  const paths = values('comments[][path]')
  const lines = values('comments[][line]')
  const sides = values('comments[][side]')
  const comments = values('comments[][body]')
  if (
    paths.length < 1 ||
    paths.length > 50 ||
    lines.length !== paths.length ||
    sides.length !== paths.length ||
    comments.length !== paths.length
  ) {
    return false
  }
  return paths.every(
    (filePath, index) =>
      filePath.length > 0 &&
      !path.isAbsolute(filePath) &&
      !filePath.split(/[\\/]/).includes('..') &&
      /^[1-9][0-9]*$/.test(lines[index]) &&
      ['LEFT', 'RIGHT'].includes(sides[index]) &&
      comments[index].includes(
        `<!-- issue-dev-loop:${authorization.issue.runId}:RVW-${publication.cycle}-${publication.round}-`,
      ),
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

function githubHostnameFlags(args) {
  const hostnames = []
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--hostname') {
      const hostname = args[index + 1]
      if (hostname) hostnames.push(hostname)
      index += 1
      continue
    }
    if (argument.startsWith('--hostname=')) {
      hostnames.push(argument.slice('--hostname='.length))
    }
  }
  return hostnames
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
  if (githubHostnameFlags(args).some((hostname) => hostname.toLowerCase() !== 'github.com')) {
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
      if (reviewerInlineReviewAllowed(request, authorization, expectedRepository)) return
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

function assertRootCommandPolicy({ role, tool, args, loopRoot, trustedLoopRoot, authorization }) {
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
    const targetLoopRoot = argumentAfter(args, '--loop-root')
    const allowedScripts = new Set([
      path.resolve(trustedLoopRoot, 'scripts', 'loopctl.mjs'),
      path.resolve(trustedLoopRoot, 'triggers', 'detect-work.mjs'),
    ])
    if (
      script &&
      allowedScripts.has(script) &&
      targetLoopRoot &&
      path.resolve(targetLoopRoot) === path.resolve(loopRoot)
    ) {
      return
    }
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

async function resolveRequestedExecutable(command, trustedExecutables) {
  const named = {
    git: trustedExecutables.git,
    gh: trustedExecutables.gh,
    node: trustedExecutables.node,
  }
  if (named[command]) return named[command]
  if (!path.isAbsolute(command)) {
    throw new Error('requested executable is not pinned by the trusted control plane')
  }
  const candidate = path.resolve(command)
  await access(candidate, constants.X_OK)
  const resolved = await realpath(candidate)
  if (!Object.values(named).includes(resolved)) {
    throw new Error('requested executable is not pinned by the trusted control plane')
  }
  return resolved
}

async function authenticatedToolForExecutable(
  executable,
  { realGit, realGh, realNode = process.execPath },
) {
  if (executable === realGit) return 'git'
  if (executable === realGh) return 'gh'
  if (executable === realNode) return 'node'
  return null
}

function normalizedRepositoryFromRemote(remoteUrl) {
  const value = remoteUrl.trim().replace(/\.git$/, '')
  const match = value.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)$/i)
  return match?.[1]?.toLowerCase() ?? null
}

export async function assertPushTargetsRepository({ expectedRepository, realGit, environment }) {
  const expected = assertNonEmpty(expectedRepository, 'expectedRepository').toLowerCase()
  const [fetchRemote, pushRemote] = await Promise.all(
    [
      ['remote', 'get-url', 'origin'],
      ['remote', 'get-url', '--push', 'origin'],
    ].map((args) =>
      execFileAsync(realGit, args, {
        env: environment,
        maxBuffer: 1024 * 1024,
      }),
    ),
  )
  if (
    normalizedRepositoryFromRemote(fetchRemote.stdout) !== expected ||
    normalizedRepositoryFromRemote(pushRemote.stdout) !== expected
  ) {
    throw new Error(
      `origin fetch and push URLs must use HTTPS for the configured repository ${expectedRepository}`,
    )
  }
}

export async function assertSafeRemoteGitConfiguration({ realGit, environment }) {
  let stdout = ''
  try {
    const result = await execFileAsync(
      realGit,
      [
        'config',
        '--local',
        '--get-regexp',
        '^(http\\..*(proxy|extraheader|cookiefile|savecookies|curloptresolve|sslverify|followredirects)|remote\\..*\\.(proxy|proxyauthmethod|uploadpack|receivepack)|url\\..*\\.(insteadof|pushinsteadof))$',
      ],
      {
        env: environment,
        maxBuffer: 1024 * 1024,
      },
    )
    stdout = result.stdout
  } catch (error) {
    if (error?.code !== 1) throw error
  }
  if (stdout.trim()) {
    throw new Error(
      'authenticated remote Git rejects repository-local HTTP, proxy, helper, and URL rewrite configuration',
    )
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
      active.push({ directoryName: entry.name, run })
    }
  }
  if (active.length > 1) {
    throw new Error('multiple active runs cannot authorize GitHub mutations')
  }
  const activeEntry = active[0] ?? null
  const run = activeEntry?.run ?? null
  if (run && (run.runId !== activeEntry.directoryName || run.runId !== path.basename(run.runId))) {
    throw new Error('active run ID cannot authorize GitHub mutations')
  }
  const issueNumber = run ? assertIssueNumber(run.issueNumber) : null
  const expectedIssueBranch = issueNumber === null ? null : `codex/issue-${issueNumber}`
  if (run && run.branch !== expectedIssueBranch) {
    throw new Error('active run branch must be derived from its durable issue number')
  }
  const pullTarget = run?.prUrl ? parseGitHubTarget(run.prUrl) : null
  const issue = run
    ? {
        branch: expectedIssueBranch,
        issueNumber,
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

function withRootCommandIntent(authorization, { tool, args, trustedLoopRoot }) {
  const script = args[0] ? path.resolve(args[0]) : null
  const isTrustedLoopctl =
    tool === 'node' &&
    script === path.resolve(trustedLoopRoot, 'scripts', 'loopctl.mjs')
  const withIntent = isTrustedLoopctl
    ? { ...authorization, rootIntent: args[1] ?? null }
    : authorization
  if (
    !isTrustedLoopctl ||
    args[1] !== 'start' ||
    authorization.issue !== null
  ) {
    return withIntent
  }
  const issueNumber = Number(argumentAfter(args, '--issue'))
  const issueUrl = argumentAfter(args, '--url')
  const baseSha = argumentAfter(args, '--base-sha')
  const target = parseGitHubTarget(issueUrl)
  if (
    !Number.isInteger(issueNumber) ||
    issueNumber < 1 ||
    !/^[0-9a-f]{40}$/i.test(baseSha ?? '') ||
    target?.kind !== 'issues' ||
    target.number !== issueNumber ||
    !repositoryInScope(`${target.owner}/${target.repo}`, authorization.expectedRepository)
  ) {
    throw new Error('loopctl start intent must identify one issue in the configured repository')
  }
  return {
    ...withIntent,
    issue: {
      branch: `codex/issue-${issueNumber}`,
      issueNumber,
      prNumber: null,
      runId: null,
      status: 'starting',
      baseSha: baseSha.toLowerCase(),
      headSha: null,
      implementationCommit: null,
    },
  }
}

function activationValidationRequested({ role, tool, args, loopRoot, trustedLoopRoot }) {
  return (
    role === 'automation' &&
    tool === 'node' &&
    path.resolve(args[0]) === path.resolve(trustedLoopRoot, 'scripts', 'loopctl.mjs') &&
    args[1] === 'validate' &&
    args.includes('--activation') &&
    path.resolve(argumentAfter(args, '--loop-root') ?? '') === path.resolve(loopRoot)
  )
}

function pullRequestWriteIntent(role, args, authorization) {
  const group = githubGroup(args)
  if (role === 'reviewer' && group.name === 'api') {
    const request = githubApiRequest(args.slice(group.index + 1))
    if (request.mutating && /\/pulls\/\d+\/reviews$/.test(request.endpoint ?? '')) {
      const body = request.fields.map(apiField).find((field) => field.name === 'body')?.value
      return {
        kind: 'inline-review',
        commandIndex: -1,
        publication: parseReviewPublication(body, authorization),
      }
    }
  }
  if (group.name !== 'pr') return null
  const command = commandAfterGroup(args, group.index)
  if (role === 'reviewer' && command.name === 'review') {
    return {
      kind: 'review',
      commandIndex: command.index,
      publication: reviewerCommentReview(args, command.index, authorization).publication,
    }
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
      '--add-reviewer': 'addReviewer',
    },
  })
  return parsed.values.has('addReviewer')
}

function readyReturnsToDraft(args, commandIndex) {
  const parsed = parseOptions(args, commandIndex + 1, {
    valueOptions: repositoryValueOptions,
    booleanOptions: { '--undo': 'undo' },
  })
  return parsed.booleans.get('undo') === true
}

function hasExactHeadGate(events, eventType, headSha) {
  return events.some(
    (event) =>
      event.type === eventType && event.status === 'passed' && event.payload?.headSha === headSha,
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
  const intent = pullRequestWriteIntent(role, args, authorization)
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
  const githubPaginatedApi = (endpoint) => paginateGitHubApi(githubApi, endpoint)
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

  if (['review', 'inline-review'].includes(intent.kind)) {
    if (
      livePullRequest.draft !== true ||
      !intent.publication
    ) {
      throw new Error('independent review publication requires the recorded Draft PR')
    }
    const publishedReviews = await githubPaginatedApi(
      `repos/${owner}/${repo}/pulls/${authorization.issue.prNumber}/reviews`,
    )
    if (intent.publication.kind === 'adjudication') {
      if (intent.kind !== 'review') {
        throw new Error('adjudication must be a body-only COMMENT review')
      }
      if (
        publishedReviews.some(
          (review) =>
            review.state === 'COMMENTED' &&
            sameGitHubLogin(review.user?.login, channel.reviewerGitHubLogin) &&
            review.body?.includes(intent.publication.marker),
        )
      ) {
        throw new Error(
          `adjudication for ${intent.publication.findingId} is already published`,
        )
      }
      const findingMarker = `<!-- issue-dev-loop:${runId}:${intent.publication.findingId} -->`
      let findingPublished = false
      for (const review of publishedReviews) {
        const reviewPublication = parseReviewPublication(review.body, authorization, {
          requireCurrentHead: false,
        })
        if (
          review.state !== 'COMMENTED' ||
          !sameGitHubLogin(review.user?.login, channel.reviewerGitHubLogin) ||
          review.commit_id !== run.headSha ||
          Number.isNaN(Date.parse(review.submitted_at)) ||
          reviewPublication?.headSha !== run.headSha.toLowerCase()
        ) {
          continue
        }
        if (review.body?.includes(findingMarker)) {
          findingPublished = true
          break
        }
        if (!Number.isInteger(review.id)) continue
        const inlineComments = await githubPaginatedApi(
          `repos/${owner}/${repo}/pulls/${authorization.issue.prNumber}/reviews/${review.id}/comments`,
        )
        if (
          inlineComments.some(
            (comment) =>
              sameGitHubLogin(comment.user?.login, channel.reviewerGitHubLogin) &&
              comment.body?.includes(findingMarker),
          )
        ) {
          findingPublished = true
          break
        }
      }
      if (!findingPublished) {
        throw new Error(
          `adjudication requires an existing reviewer finding at the current head: ${intent.publication.findingId}`,
        )
      }
      return
    }
    const expectedCycle =
      events.filter((event) => event.type === 'review_completed' && event.status === 'passed')
        .length + 1
    if (intent.publication.cycle !== expectedCycle) {
      throw new Error('independent review publication requires the next review cycle')
    }
    const existingRounds = publishedReviews
      .filter(
        (review) =>
          review.state === 'COMMENTED' &&
          sameGitHubLogin(review.user?.login, channel.reviewerGitHubLogin),
      )
      .map((review) =>
        parseReviewPublication(review.body, authorization, { requireCurrentHead: false }),
      )
      .filter((publication) => publication?.cycle === expectedCycle)
      .map((publication) => publication.round)
      .sort((left, right) => left - right)
    if (
      existingRounds.length !== intent.publication.round - 1 ||
      existingRounds.some((round, index) => round !== index + 1)
    ) {
      throw new Error('independent review publication must be the next unique cycle round')
    }
    return
  }
  if (intent.kind === 'ready') {
    if (!readyReturnsToDraft(args, intent.commandIndex)) {
      throw new Error('only the configured owner may mark a Draft PR ready for review')
    }
    const ownerResponse = events.findLast(
      (event) =>
        event.type === 'owner_response_observed' &&
        event.status === 'observed' &&
        sameGitHubLogin(event.payload?.actor, channel.ownerGitHubLogin),
    )
    if (livePullRequest.draft !== false || !ownerResponse) {
      throw new Error('returning a PR to Draft requires a durable verified owner response')
    }
    return
  }
  if (intent.kind === 'edit' && editRequestsOwnerReview(args, intent.commandIndex)) {
    if (
      livePullRequest.draft !== false ||
      !hasExactHeadGate(events, 'verification_completed', run.headSha) ||
      !hasExactHeadGate(events, 'review_completed', run.headSha)
    ) {
      throw new Error(
        'owner review request requires a ready PR with exact-head evidence and review',
      )
    }
  }
}

async function preflightIssueBranchPush({
  args,
  authorization,
  loopRoot,
  realGit,
  realGh,
  environment,
}) {
  if (gitSubcommand(args).name !== 'push' || !authorization.issue?.runId) return
  const runId = authorization.issue.runId
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
    operation: 'Git push',
    githubApi,
  })
  const durableRun = durable.record.run
  if (
    durableRun.runId !== runId ||
    durableRun.issueNumber !== authorization.issue.issueNumber ||
    durableRun.branch !== `codex/issue-${authorization.issue.issueNumber}` ||
    durableRun.branch !== authorization.issue.branch
  ) {
    throw new Error('Git push requires the exact durable issue branch authorization')
  }
  const repositoryRoot = path.resolve(loopRoot, '..', '..')
  const [localBranch, localHead, localStatus] = await Promise.all([
    execFileAsync(realGit, ['branch', '--show-current'], {
      cwd: repositoryRoot,
      env: environment,
    }),
    execFileAsync(realGit, ['rev-parse', 'HEAD'], {
      cwd: repositoryRoot,
      env: environment,
    }),
    execFileAsync(realGit, ['status', '--porcelain'], {
      cwd: repositoryRoot,
      env: environment,
      maxBuffer: 1024 * 1024,
    }),
  ])
  const headSha = localHead.stdout.trim()
  if (
    localBranch.stdout.trim() !== durableRun.branch ||
    !/^[0-9a-f]{40}$/i.test(headSha) ||
    localStatus.stdout.trim()
  ) {
    throw new Error('Git push requires a clean checkout of the exact durable issue branch')
  }
  if (!/^[0-9a-f]{40}$/i.test(durableRun.implementationCommit ?? '')) {
    throw new Error('Git push requires a recorded $implement commit')
  }
  await execFileAsync(
    realGit,
    ['merge-base', '--is-ancestor', durableRun.implementationCommit, headSha],
    { cwd: repositoryRoot, env: environment },
  )
  const trailing = await execFileAsync(
    realGit,
    ['diff', '--name-status', `${durableRun.implementationCommit}..${headSha}`],
    { cwd: repositoryRoot, env: environment, maxBuffer: 1024 * 1024 },
  )
  const permittedPrefixes = [
    `loops/issue-dev-loop/logs/runs/${runId}/`,
    `loops/issue-dev-loop/handoffs/${runId}/`,
    `loops/issue-dev-loop/screen-shots/${runId}/`,
    `loops/issue-dev-loop/evidence/${runId}/`,
  ]
  const unexpected = trailing.stdout
    .split('\n')
    .filter(Boolean)
    .filter((line) => {
      const [status, ...files] = line.split('\t')
      return (
        !['A', 'M'].includes(status) ||
        files.length !== 1 ||
        !permittedPrefixes.some((prefix) => files[0].startsWith(prefix))
      )
    })
  if (unexpected.length > 0) {
    throw new Error(
      `Git push contains unrecorded or unsafe post-$implement changes: ${unexpected.join(', ')}`,
    )
  }
  const latestOwnerResponse = events.findLast(
    (event) => event.type === 'owner_response_observed' && event.status === 'observed',
  )
  if (
    latestOwnerResponse &&
    !events.some(
      (event) =>
        event.type === 'pr_published' &&
        event.status === 'draft' &&
        event.payload?.prUrl === durableRun.prUrl &&
        event.payload?.headSha === durableRun.headSha &&
        Date.parse(event.timestamp) >= Date.parse(latestOwnerResponse.timestamp),
    )
  ) {
    throw new Error('owner-feedback Git push requires the unchanged PR to be redrafted first')
  }
}

async function preflightEvolveMutation({
  role,
  tool,
  args,
  authorization,
  loopRoot,
  realGh,
  environment,
}) {
  if (role !== 'automation' || !authorization.evolve?.requestId) return
  const gitPush = tool === 'git' && gitSubcommand(args).name === 'push'
  const group = tool === 'gh' ? githubGroup(args) : { name: null, index: -1 }
  const command = group.name === 'pr' ? commandAfterGroup(args, group.index) : { name: null }
  if (!gitPush && command.name !== 'create') return
  const githubApi = async (endpoint) => {
    const { stdout } = await execFileAsync(realGh, ['api', endpoint], {
      env: environment,
      maxBuffer: 1024 * 1024,
    })
    return JSON.parse(stdout)
  }
  await verifyPublishedEvolveRequest({
    loopRoot,
    requestId: authorization.evolve.requestId,
    githubApi,
  })
}

export async function assertGitHubRoleIdentity({
  channel,
  role,
  environment = process.env,
  identityCommand = execFileAsync,
  ghExecutable = 'gh',
  enforceCredentialIsolation = false,
  requiredUntrustedRoots = [],
}) {
  let resolved = resolveGitHubRoleEnvironment({ channel, role, environment })
  if (enforceCredentialIsolation) {
    const configDirectory = await assertCredentialProfileIsolation({
      channel,
      configDirectory: resolved.configDirectory,
      environment,
      requiredUntrustedRoots,
    })
    resolved = {
      ...resolved,
      configDirectory,
      routedEnvironment: { ...resolved.routedEnvironment, GH_CONFIG_DIR: configDirectory },
    }
  }
  const { stdout } = await identityCommand(ghExecutable, ['api', 'user', '--jq', '.login'], {
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

async function assertTargetChannelMatchesTrusted(loopRoot, trustedChannel) {
  const targetChannel = await readOwnerChannel(loopRoot)
  for (const field of [
    'schemaVersion',
    'ownerGitHubLogin',
    'automationGitHubLogin',
    'reviewerGitHubLogin',
    'automationGitHubConfigEnvironmentVariable',
    'reviewerGitHubConfigEnvironmentVariable',
    'stateIssueNumber',
    'repository',
    'canonicalChannel',
    'webhookEnvironmentVariable',
    'untrustedRootsEnvironmentVariable',
    'informationalImmediateTypes',
    'immediateTypes',
  ]) {
    if (JSON.stringify(targetChannel[field]) !== JSON.stringify(trustedChannel[field])) {
      throw new Error(`target loop changes trusted owner-channel field: ${field}`)
    }
  }
}

export async function runWithGitHubRole({
  loopRoot,
  channel,
  trustedControlPlane,
  role,
  command,
  args = [],
  environment = process.env,
  spawnCommand = spawn,
}) {
  const requestedCommand = assertNonEmpty(command, 'command')
  if (!trustedControlPlane?.loopRoot || !trustedControlPlane?.executables) {
    throw new Error('authenticated GitHub routing requires an installed trusted control plane')
  }
  await assertTargetChannelMatchesTrusted(loopRoot, channel)
  const { git: realGit, gh: realGh, node: realNode } = trustedControlPlane.executables
  const resolved = await assertGitHubRoleIdentity({
    channel,
    role,
    environment,
    ghExecutable: realGh,
    enforceCredentialIsolation: true,
    requiredUntrustedRoots: [repositoryRootForLoop(loopRoot)],
  })
  const executable = await resolveRequestedExecutable(
    requestedCommand,
    trustedControlPlane.executables,
  )
  const tool = await authenticatedToolForExecutable(executable, {
    realGit,
    realGh,
    realNode,
  })
  const authorization = withRootCommandIntent(await readAuthorizationContext(loopRoot, channel), {
    tool,
    args,
    trustedLoopRoot: trustedControlPlane.loopRoot,
  })
  assertRootCommandPolicy({
    role,
    tool,
    args,
    loopRoot,
    trustedLoopRoot: trustedControlPlane.loopRoot,
    authorization,
  })
  const activationValidation = activationValidationRequested({
    role,
    tool,
    args,
    loopRoot,
    trustedLoopRoot: trustedControlPlane.loopRoot,
  })
  if (activationValidation) {
    await assertGitHubRoleIdentity({
      channel,
      role: 'reviewer',
      environment,
      ghExecutable: realGh,
      identityCommand: (_command, identityArgs, options) =>
        execFileAsync(realGh, identityArgs, options),
      enforceCredentialIsolation: true,
      requiredUntrustedRoots: [repositoryRootForLoop(loopRoot)],
    })
  }
  await preflightEvolveMutation({
    role,
    tool,
    args,
    authorization,
    loopRoot,
    realGh,
    environment: resolved.routedEnvironment,
  })
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
  if (tool === 'git' && ['push', 'fetch', 'ls-remote'].includes(gitSubcommand(args).name)) {
    await preflightIssueBranchPush({
      args,
      authorization,
      loopRoot,
      realGit,
      realGh,
      environment: resolved.routedEnvironment,
    })
    await assertSafeRemoteGitConfiguration({
      realGit,
      environment: resolved.routedEnvironment,
    })
    await assertPushTargetsRepository({
      expectedRepository: channel.repository,
      realGit,
      environment: resolved.routedEnvironment,
    })
  }
  const childEnvironment = {
    ...resolved.routedEnvironment,
    PATH: identityBinDirectory,
    ECHO_UI_LOOP_GITHUB_ROLE: role,
    ECHO_UI_LOOP_IDENTITY_GATE: commandGatePath,
    ECHO_UI_LOOP_NODE: realNode,
    ECHO_UI_LOOP_AUTHORIZATION: JSON.stringify(authorization),
  }
  let executionArgs =
    tool === 'git'
      ? hardenedGitArguments(args, { expectedRepository: channel.repository })
      : [...args]
  if (activationValidation) {
    executionArgs = [args[0], 'validate', '--loop-root', path.resolve(loopRoot)]
  }
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
