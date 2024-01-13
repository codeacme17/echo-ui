import { EnvelopeLimits } from '.'

export const WIDTH = 200
export const HEIGHT = 100

export const LIMITS: EnvelopeLimits & { attack: number; decay: number; release: number } = {
  delay: 1,
  attack: 1,
  hold: 1,
  decay: 1,
  release: 1,
}

export const LINE_COLOR = 'var(--echo-primary)'
export const LINE_WIDTH = 3

export const NODE_COLOR = 'var(--echo-secondary)'
export const NODE_SIZE = 6
