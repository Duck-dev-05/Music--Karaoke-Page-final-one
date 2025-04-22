export function getDefaultAvatar(): string {
  return "/images/default-avatar.png"
}

export function isValidImageUrl(url: string): boolean {
  if (!url) return false
  return url.match(/\.(jpeg|jpg|gif|png)$/) !== null
}

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return getDefaultAvatar()
  return url.startsWith('http') ? url : `/${url.replace(/^\//, '')}`
} 