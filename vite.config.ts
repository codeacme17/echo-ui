import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ command }) => ({
  plugins: [
    react({ jsxRuntime: command === 'build' ? 'classic' : 'automatic' }),
    tailwindcss(),
    {
      name: 'emit-echo-ui-tailwind-theme',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'theme.css',
          source: readFileSync(new URL('./packages/theme.css', import.meta.url), 'utf8'),
        })
      },
    },
  ],

  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
  },

  build: {
    lib: {
      entry: 'packages/vite-entry.ts',
      name: 'echo-ui',
      formats: ['es', 'umd'],
      fileName: 'echo-ui',
      cssFileName: 'echo-ui',
    },
    rolldownOptions: {
      external: ['react', 'react-dom'],
      transform: {
        inject: {
          React: 'react',
        },
      },
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
}))
