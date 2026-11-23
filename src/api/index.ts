import { Api } from './Api'

export const api = new Api<string>({
  baseURL: '/api',
  securityWorker: (token) => (token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
})

let feedSession: Promise<void> | undefined

export function startBeamFeedSession(): Promise<void> {
  feedSession ??= api.beams.feedSessionCreate().then(() => undefined).catch((error: unknown) => {
    feedSession = undefined
    throw error
  })
  return feedSession
}
