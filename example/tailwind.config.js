import { nextui } from '@nextui-org/theme/plugin'
import { theme } from '../packages/tailwind-theme'

export default {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../packages/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme,
  plugins: [nextui()],
}
