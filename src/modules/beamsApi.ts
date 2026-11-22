import type { DsBeamResponse } from '../api/Api'
import { BEAMS_MOCK } from './mock'
import { publicAsset } from './deployment'

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

export const DEFAULT_IMAGE = publicAsset('DefaultImage.png')
export const DEFAULT_VIDEO = publicAsset('DefaultVideo.mp4')

export const formatNumber = (value: number): string => value.toLocaleString('ru-RU')

export const mediaUrl = (url?: string): string => (url ? url.replace(/^https?:\/\/[^/]+/, '') : '')

export const toBeam = (beam: DsBeamResponse): Beam => ({
  id: beam.id ?? 0,
  name: beam.name ?? '',
  description: beam.description ?? '',
  image_url: mediaUrl(beam.image_url),
  video_url: mediaUrl(beam.video_url),
  load: beam.load ?? 0,
  deflection: beam.deflection ?? 0,
  like_count: beam.like_count ?? 0,
  creator: beam.creator ?? '',
  is_mine: beam.is_mine ?? 0,
  is_liked: beam.is_liked ?? 0,
  created_at: beam.created_at ?? '',
  formed_at: beam.formed_at ?? null,
})

export const parseNumber = (text: string): number | undefined => {
  const value = Number(text.trim().replace(',', '.'))
  return text.trim() === '' || Number.isNaN(value) ? undefined : value
}

export const getMockBeams = (maxDeflection?: number): Beam[] =>
  maxDeflection === undefined ? BEAMS_MOCK : BEAMS_MOCK.filter((beam) => beam.deflection <= maxDeflection)

export const getMockFeedBeam = (id?: number, next?: boolean): Beam | undefined => {
  if (id === undefined) {
    return BEAMS_MOCK[0]
  }
  const index = BEAMS_MOCK.findIndex((beam) => beam.id === id)
  if (index === -1) {
    return undefined
  }
  return next ? BEAMS_MOCK[(index + 1) % BEAMS_MOCK.length] : BEAMS_MOCK[index]
}
