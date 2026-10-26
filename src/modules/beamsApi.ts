export interface Beam {
  id: number
  name: string
  description: string
  image_url: string
  video_url: string
  load: number
  deflection: number
  like_count: number
  creator: string
  is_mine: number
  is_liked: number
  created_at: string
  formed_at: string | null
}

export const DEFAULT_IMAGE = '/DefaultImage.png'
export const DEFAULT_VIDEO = '/DefaultVideo.mp4'

export const formatNumber = (value: number): string => value.toLocaleString('ru-RU')
