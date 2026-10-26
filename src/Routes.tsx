export const ROUTES = {
  FEED: '/beams/feed',
  DRAFT: '/beams/draft',
  TILES: '/beams',
  LOGIN: '/login',
}
export type RouteKeyType = keyof typeof ROUTES
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  FEED: 'Лента',
  DRAFT: 'Добавление',
  TILES: 'Плитка',
  LOGIN: 'Вход',
}
