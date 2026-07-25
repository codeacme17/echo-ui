#!/usr/bin/env node

import { spawn } from 'node:child_process'

import { parseReviewPublisherArguments } from './lib/review-publication.mjs'
import { loadTrustedControlPlane } from './lib/trusted-control-plane.mjs'

async function main() {
  if (process.env.ECHO_UI_LOOP_GITHUB_ROLE !== 'reviewer') {
    throw new Error('trusted review publisher requires the reviewer identity')
  }
  let authorization
  try {
    authorization = JSON.parse(process.env.ECHO_UI_LOOP_AUTHORIZATION)
  } catch {
    throw new Error('trusted review publisher has invalid authorization context')
  }
  const request = parseReviewPublisherArguments(process.argv.slice(2), { authorization })
  const trustedControlPlane = await loadTrustedControlPlane()
  const child = spawn(
    trustedControlPlane.executables.gh,
    ['api', request.endpoint, '--method', 'POST', '--input', '-'],
    {
      env: process.env,
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: false,
    },
  )
  child.stdin.end(`${JSON.stringify(request.payload)}\n`)
  await new Promise((resolve, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`trusted review publisher terminated by signal ${signal}`))
        return
      }
      if (code !== 0) {
        reject(new Error(`trusted review publisher exited with status ${code ?? 1}`))
        return
      }
      resolve()
    })
  })
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
