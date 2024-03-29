/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    exclude: ['example/*', 'node_modules/**/*'],
  },

  build: {
    lib: {
      entry: 'packages/main.ts',
      name: 'echo-ui',
    },
    rollupOptions: {
      output: {
        esModule: true,
      },
      external: ['react', 'react-dom'],
    },
  },
})
