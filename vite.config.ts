import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:8080'
const MINIO_TARGET = process.env.MINIO_TARGET ?? 'http://localhost:9000'

export default defineConfig(({ command, mode, isPreview }) => {
  const isPages = mode === 'pages'
  const isHttpsDev = command === 'serve' && !isPreview && mode === 'https'
  const keyFile = process.env.HTTPS_KEY_FILE
  const certFile = process.env.HTTPS_CERT_FILE
  if (Boolean(keyFile) !== Boolean(certFile)) {
    throw new Error('Укажите одновременно HTTPS_KEY_FILE и HTTPS_CERT_FILE')
  }

  return {
    base: isPages ? '/Beam-deflection-frontend/' : '/',
    plugins: [
      react(),
      isHttpsDev && !keyFile && mkcert({ savePath: '.certs' }),
      VitePWA({
        disable: !isPages && !isHttpsDev,
        registerType: 'autoUpdate',
        devOptions: { enabled: isHttpsDev },
        manifest: {
          id: './',
          name: 'Расчёт прогиба балки',
          short_name: 'Прогиб балки',
          lang: 'ru',
          start_url: './',
          display: 'standalone',
          background_color: '#F4F3EF',
          theme_color: '#F4F3EF',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,jpg,mp4}'],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          navigateFallbackDenylist: [/^\/(api|media)(?:\/|$)/],
        },
      }),
    ],
    server: {
      https: keyFile && certFile ? { key: readFileSync(keyFile), cert: readFileSync(certFile) } : undefined,
      proxy: {
        '/api': { target: API_TARGET, changeOrigin: true },
        '/media': { target: MINIO_TARGET, changeOrigin: true },
      },
      watch: { usePolling: true },
      host: true,
      strictPort: true,
      port: 3000,
    },
  }
})
