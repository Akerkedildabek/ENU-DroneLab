import type { MaterialGroups } from '../types/lecture'

/** Vite's BASE_URL is needed when the app lives under /ENU-DroneLab/ on Pages. */
export function assetUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  if (/^(data:|javascript:|file:)/i.test(pathOrUrl)) return ''
  const sanitized = pathOrUrl.replace(/^\/+/, '')
  // Reject traversal; content authors should provide paths relative to /public.
  if (sanitized.split('/').includes('..')) return ''
  return `${import.meta.env.BASE_URL}${sanitized}`
}

export function safeExternal(url?: string): string {
  if (!url) return ''
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : ''
  } catch { return '' }
}

export function youtubeEmbed(url: string): string | null {
  try {
    const parsed = new URL(url)
    let id = ''
    if (parsed.hostname === 'youtu.be') id = parsed.pathname.slice(1)
    else if (['www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(parsed.hostname)) {
      id = parsed.pathname.startsWith('/embed/') ? parsed.pathname.split('/')[2] : (parsed.searchParams.get('v') ?? '')
    }
    if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return null
    return `https://www.youtube-nocookie.com/embed/${id}`
  } catch { return null }
}

export function hasMaterials(materials: MaterialGroups) {
  return Object.values(materials).some((group) => Array.isArray(group) && group.length > 0)
}
