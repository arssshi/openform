import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function normalizeBase(value: string) {
  const path = value.trim()
  if (!path || path === '/') return '/'
  return `/${path.replace(/^\/+|\/+$/g, '')}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const configuredSite = process.env.VITE_SITE_URL || env.VITE_SITE_URL || ''
  const configuredBase = process.env.VITE_BASE_PATH || env.VITE_BASE_PATH || ''
  const base = configuredBase
    ? normalizeBase(configuredBase)
    : configuredSite
      ? normalizeBase(new URL(configuredSite).pathname)
      : '/'

  return {
    base,
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
  }
})
