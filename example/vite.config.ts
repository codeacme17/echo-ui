import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@nafr/echo-ui': path.resolve(__dirname, '../packages/main.ts'),
    },
  },

  server: {
    port: 1700,
  },
})
