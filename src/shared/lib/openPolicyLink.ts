export const POLICY_LINKS = {
  terms: 'https://www.notion.so/DEULAK-3186a152bc5c80a98a12fcb7ccd9eecc?source=copy_link',
  privacy: 'https://www.notion.so/3186a152bc5c8059b4c4d8ce70173d8e?source=copy_link',
} as const

export type PolicyKey = keyof typeof POLICY_LINKS

export const openPolicyLink = (key: PolicyKey) => {
  const url = POLICY_LINKS[key]

  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}
