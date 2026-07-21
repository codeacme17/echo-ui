/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
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
