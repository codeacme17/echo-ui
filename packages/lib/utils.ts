import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validValue = (value: number, min: number, max: number) => {
  if ((value as number) < min) return min
  if ((value as number) > max) return max
  return value
}

/**
 * Converts any color string to an RGBA string with the specified opacity.
 * @param {string} color - The color string (hex, rgb, rgba, hsl, etc.)
 * @param {number} opacity - The opacity value (0 to 1).
 * @returns {string} - The resulting RGBA color string.
 */
export function convertColorToRGBA(color: string, opacity: number) {
  // Create a temporary element to apply the style and read the computed color
  const dummyElement = document.createElement('div')
  dummyElement.style.display = 'none'
  document.body.appendChild(dummyElement)

  dummyElement.style.color = color
  const computedColor = window.getComputedStyle(dummyElement).color
  document.body.removeChild(dummyElement)

  // Convert the computed color to rgba with the desired opacity
  const rgbaMatch = computedColor.match(/^rgba?\((\d+), (\d+), (\d+)(?:, (\d+))?\)$/)
  if (!rgbaMatch) return color // Fallback to the original color if parsing fails

  const [, r, g, b] = rgbaMatch.map(Number)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
