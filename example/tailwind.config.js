/** @type {import('tailwindcss').Config} */
import { theme } from '../tailwind-theme.ts'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', '../packages/**/*.{js,ts,jsx,tsx}'],
  theme,
}
