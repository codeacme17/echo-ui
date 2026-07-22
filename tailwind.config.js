/** @type {import('tailwindcss').Config} */
import { theme } from './packages/tailwind-theme'

export default {
  darkMode: ['class'],
  content: ['./packages/**/*.{js,ts,jsx,tsx}', './example/src/**/*.{js,ts,jsx,tsx}'],
  theme: theme,
}
