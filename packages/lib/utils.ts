import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validValue = (value: number, min: number, max: number) => {
  if (value < min) return min
  if (value > max) return max
  return value
}
