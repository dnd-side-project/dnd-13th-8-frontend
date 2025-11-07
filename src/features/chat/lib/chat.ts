import * as ChatEmojis from '@/assets/icons/chat'

type ChatEmojiKey = keyof typeof ChatEmojis

export const parseMessage = (msg: string) => {
  const match = msg.match(/^\/(\w+)\/(.*)/)
  if (!match) return { Icon: undefined, text: msg }

  const [, iconName, text] = match

  const Icon = (ChatEmojis as Record<ChatEmojiKey, React.FC<React.SVGProps<SVGSVGElement>>>)[
    iconName as ChatEmojiKey
  ]

  return { Icon, text }
}
