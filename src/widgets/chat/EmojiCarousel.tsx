import styled from 'styled-components'

import * as ChatEmojis from '@/assets/icons/chat'
import { flexRowCenter } from '@/shared/styles/mixins'
import ScrollCarousel from '@/shared/ui/ScrollCarousel'

const ChatEmojiCarousel = () => {
  const emojis = [
    { icon: ChatEmojis.Smile, label: '안녕하세요' },
    { icon: ChatEmojis.SmileyInLove, label: '좋아요' },
    { icon: ChatEmojis.SmileyCool },
    { icon: ChatEmojis.Party },
    { icon: ChatEmojis.SmileyDrool },
    { icon: ChatEmojis.Tears },
    { icon: ChatEmojis.Fire },
    { icon: ChatEmojis.Ghost },
    { icon: ChatEmojis.Heartbeat },
    { icon: ChatEmojis.Music },
  ]

  return (
    <CarouselWrapper>
      <ScrollCarousel gap={8}>
        {emojis.map(({ icon: Emoji, label }, idx) => (
          <EmojiWrapper key={idx}>
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
