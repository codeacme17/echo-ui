/** @type {import('tailwindcss').Config} */
import { theme } from './tailwind-theme'

export default {
  darkMode: ['class'],
  content: ['./packages/**/*.{js,ts,jsx,tsx}'],
  theme: theme,
}
