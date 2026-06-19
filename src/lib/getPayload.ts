import { getPayload as getPayloadInstance } from 'payload'
import config from '@payload-config'

/** Cached Payload Local API client for use in Server Components. */
export const getPayloadClient = async () => getPayloadInstance({ config })

/** Resolve a media field (which may be an ID or a populated object) to a URL. */
export const mediaUrl = (
  media: unknown,
  size?: 'thumbnail' | 'card' | 'feature',
): string | null => {
  if (!media || typeof media !== 'object') return null
  const m = media as {
    url?: string | null
    sizes?: Record<string, { url?: string | null }>
  }
  if (size && m.sizes?.[size]?.url) return m.sizes[size]!.url ?? null
  return m.url ?? null
}

export const mediaAlt = (media: unknown): string => {
  if (media && typeof media === 'object' && 'alt' in media) {
    return String((media as { alt?: string }).alt ?? '')
  }
  return ''
}
