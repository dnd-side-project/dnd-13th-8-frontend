export const getVideoId = (url: string): string => {
  try {
    const parsed = new URL(url)

    return parsed.searchParams.get('v') || ''
  } catch {
    return ''
  }
}
