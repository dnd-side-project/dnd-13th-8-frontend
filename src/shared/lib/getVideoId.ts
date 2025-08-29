export const getVideoId = (url: string): string => {
  try {
    const parsed = new URL(url)
    let videoId = ''

    // youtu.be/VIDEO_ID
    if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1)
    }
    // www.youtube.com/watch?v=VIDEO_ID OR music.youtube.com/watch?v=VIDEO_ID
    else if (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com' ||
      parsed.hostname === 'music.youtube.com'
    ) {
      videoId = parsed.searchParams.get('v') || ''
    }

    return videoId
  } catch {
    return ''
  }
}
