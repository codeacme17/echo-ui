/** @type {import('tailwindcss').Config} */
import { theme } from '../tailwind-theme.ts'

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './docs/**/*.{md,mdx}',
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
    '../packages/**/*.{js,ts,jsx,tsx}',
  ],
  blocklist: ['container'],
  corePlugins: {
    preflight: false,
  },

  theme: theme,
}
