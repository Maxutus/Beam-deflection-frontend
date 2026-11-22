import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const API_TARGET = process.env.API_TARGET ?? 'http://localhost:8080'
const MINIO_TARGET = process.env.MINIO_TARGET ?? 'http://localhost:9000'

function pagesServiceWorker(): Plugin {
  return {
    name: 'beams-pages-service-worker',
    enforce: 'post',
    apply: 'build',
    generateBundle(_, bundle) {
      const worker = readFileSync(new URL('./scripts/sw.js', import.meta.url), 'utf8')
      const files = new Set(['./index.html', ...Object.keys(bundle).map((file) => `./${file}`)])
      const revision = createHash('sha256').update(worker)

      for (const file of Object.values(bundle)) {
        revision.update(file.type === 'chunk' ? file.code : file.source)
      }

      const publicDirectory = new URL('./public/', import.meta.url)
      for (const file of readdirSync(publicDirectory, { withFileTypes: true })) {
        if (file.isFile() && !file.name.startsWith('.')) {
          files.add(`./${file.name}`)
          revision.update(file.name).update(readFileSync(new URL(file.name, publicDirectory)))
        }
      }

      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: `const REVISION = ${JSON.stringify(revision.digest('hex').slice(0, 16))}\nconst FILES = ${JSON.stringify([...files])}\n${worker}`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const isPages = mode === 'pages'
  const keyFile = process.env.HTTPS_KEY_FILE
  const certFile = process.env.HTTPS_CERT_FILE
  if (Boolean(keyFile) !== Boolean(certFile)) {
    throw new Error('Укажите одновременно HTTPS_KEY_FILE и HTTPS_CERT_FILE')
  }

  return {
    base: isPages ? `/${process.env.PAGES_REPOSITORY ?? 'Beam-deflection-frontend'}/` : '/',
    plugins: [react(), ...(isPages ? [pagesServiceWorker()] : [])],
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
