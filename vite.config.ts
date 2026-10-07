import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: process.platform === 'linux' && process.cwd().startsWith('/mnt/'),
      interval: 800,
      ignored: ['**/public/brands/**', '**/public/downloads/**', '**/dist/**', '**/test-results/**'],
    },
  },
  build: { sourcemap: true },
})
