import { execFile, spawn } from 'node:child_process'
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

  return { configDirectory, expectedLogin, routedEnvironment }
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
  if (path.basename(executable) === 'git' && args[0] === 'push') {
    if (role === 'reviewer') throw new Error('reviewer identity cannot run git push')
    const hasForce = args.some((argument) => argument === '-f' || argument.startsWith('--force'))
    const targetsProtectedBranch = args.some((argument) => {
      const destination = argument.includes(':') ? argument.slice(argument.lastIndexOf(':') + 1) : argument
      return ['dev', 'main', 'refs/heads/dev', 'refs/heads/main'].includes(destination)
    })
    if (hasForce || targetsProtectedBranch) {
      throw new Error('force-push and protected-branch pushes are prohibited')
    }
  }
  const resolved = await assertGitHubRoleIdentity({ channel, role, environment })
  const routedArgs =
    path.basename(executable) === 'git'
      ? [
          '-c',
          'credential.helper=',
          '-c',
          'credential.helper=!gh auth git-credential',
          ...args,
        ]
      : args
  const child = spawnCommand(executable, routedArgs, {
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
