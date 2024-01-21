import * as d3 from 'd3'
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

export const halfRange = (min: number, max: number) => {
  return (max - Math.abs(min)) / 2
}

export const fixTo = (n: number, fix: number = 2) => {
  return Number(n.toFixed(fix))
}

export const formatTime = (seconds: number) => {
  const pad = (num: number) => (num < 10 ? '0' + num : num.toString())
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return pad(minutes) + ':' + pad(remainingSeconds)
}

type ScaleType = d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number> | null

/**
 *  Returns a valid scaled value for a given scale and data point.
 */
export const validScaledNaN = (scale: ScaleType, data: number, specify: number) => {
  let v = scale!(data)
  if (Number.isNaN(v)) v = specify
  return v
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
