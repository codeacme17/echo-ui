const PREFIX = 'Echo UI: '

export const logger = {
  info: (...args: string[]) => console.log(PREFIX, ...args),
  warn: (...args: string[]) => console.warn(PREFIX, ...args),
  error: (...args: string[]) => console.error(PREFIX, ...args),
}
