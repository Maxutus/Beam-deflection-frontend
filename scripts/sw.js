const CACHE_PREFIX = `beams:${self.registration.scope}:`
const CACHE_NAME = CACHE_PREFIX + REVISION
const INDEX_URL = new URL('./index.html', self.registration.scope).href
const OFFLINE_URLS = new Set(FILES.map((file) => new URL(file, self.registration.scope).href))

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll([...OFFLINE_URLS])))
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map((name) => caches.delete(name)))
    await self.clients.claim()
  })())
})

async function serveRange(response, rangeHeader) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader)
  const data = await response.blob()
  const size = data.size
  const start = match?.[1] ? Number(match[1]) : Math.max(0, size - Number(match?.[2]))
  const end = match?.[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1

  if (!match || (!match[1] && !match[2]) || start >= size || end < start) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } })
  }

  return new Response(data.slice(start, end + 1), {
    status: 206,
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Content-Type': data.type,
    },
  })
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) {
    return
  }

  const url = request.mode === 'navigate' ? INDEX_URL : request.url
  if (!OFFLINE_URLS.has(url)) {
    return
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)
    const response = await cache.match(url)
    if (!response) {
      return fetch(request)
    }

    const range = request.headers.get('Range')
    return range ? serveRange(response, range) : response
  })())
})
