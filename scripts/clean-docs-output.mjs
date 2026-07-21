import { rmSync } from 'node:fs'

rmSync('docs/.island/dist', { recursive: true, force: true })
