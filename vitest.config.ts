/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['example/*', 'node_modules/**/*'],
  },
})
