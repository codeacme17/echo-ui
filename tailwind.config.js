/** @type {import('tailwindcss').Config} */
import { theme } from './tailwind-theme'
import { nextui } from '@nextui-org/react'

export default {
  darkMode: ['class'],
  content: [
    './packages/**/*.{js,ts,jsx,tsx}',
    './example/index.html',
    './example/src/**/*.{js,ts,jsx,tsx}',
    './docs/.island/index.html',
    './docs/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: theme,
  plugins: [nextui()],
}
