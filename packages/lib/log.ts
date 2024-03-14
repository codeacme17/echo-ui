import { version } from '../../package.json'

const PREFIX = 'Echo UI:'

export const logger = {
  info: (...args: string[]) => console.log(PREFIX, ...args),
  warn: (...args: string[]) => console.warn(PREFIX, ...args),
  error: (...args: string[]) => console.error(PREFIX, ...args),
}

export const logBrand = () => {
  const content = `%c > Echo UI v${version} prod by leyoonafr < `
  window.onload = () => {
    console.log(content, 'background: #ffbe3b; color: #000')
  }
}
