import styled from 'styled-components'

import * as ChatEmojis from '@/assets/icons/chat'
import { flexRowCenter } from '@/shared/styles/mixins'
import ScrollCarousel from '@/shared/ui/ScrollCarousel'

interface ChatEmojiCarouselProps {
  onClick?: (value: string) => void
}

const ChatEmojiCarousel = ({ onClick }: ChatEmojiCarouselProps) => {
  const emojis = [
    { icon: ChatEmojis.Smile, label: '안녕하세요', name: 'Smile' },
    { icon: ChatEmojis.SmileyInLove, label: '좋아요', name: 'SmileyInLove' },
    { icon: ChatEmojis.SmileyCool, name: 'SmileyCool' },
    { icon: ChatEmojis.Party, name: 'Party' },
    { icon: ChatEmojis.SmileyDrool, name: 'SmileyDrool' },
    { icon: ChatEmojis.Tears, name: 'Tears' },
    { icon: ChatEmojis.Fire, name: 'Fire' },
    { icon: ChatEmojis.Ghost, name: 'Ghost' },
    { icon: ChatEmojis.Heartbeat, name: 'Heartbeat' },
    { icon: ChatEmojis.Music, name: 'Music' },
  ]

  const handleClick = (name: string, label?: string) => {
    const value = `/${name}/ ${label ?? ''}`
    if (onClick) onClick(value)
  }

  return (
    <CarouselWrapper>
      <ScrollCarousel gap={8}>
        {emojis.map(({ icon: Emoji, label, name }, idx) => (
          <EmojiWrapper key={idx} onClick={() => handleClick(name, label)}>
            <Emoji />
            {label && <Label>{label}</Label>}
          </EmojiWrapper>
        ))}
      </ScrollCarousel>
    </CarouselWrapper>
  )
}

export default ChatEmojiCarousel

const CarouselWrapper = styled.div`
  padding: 16px 0;
`

const EmojiWrapper = styled.div`
  padding: 0 12px;
  height: 34px;
  ${flexRowCenter}
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  border-radius: 99px;
  gap: 6px;
`

const Label = styled.span`
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-10']};
  white-space: nowrap;
`
