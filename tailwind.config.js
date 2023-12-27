/** @type {import('tailwindcss').Config} */
import { theme } from './tailwind-theme'

export default {
  darkMode: ['class'],
  content: [
    './example/index.html',
    './docs/.island/index.html',
    './example/src/**/*.{js,ts,jsx,tsx}',
    './packages/**/*.{js,ts,jsx,tsx}',
    './docs/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: theme,
}
