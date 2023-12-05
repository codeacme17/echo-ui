import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@echo': path.resolve(__dirname, '../src'),
    },
  },

  server: {
    port: 1700,
  },
})
