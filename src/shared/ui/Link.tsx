import styled from 'styled-components'

import { Gallery } from '@/assets/icons'

interface LinkProps {
  variant?: 'large' | 'small'
  data: Info
}

interface Info {
  thumbnail?: string | null
  title: string
}

const Link = ({ variant = 'large', data }: LinkProps) => {
  return (
    <LinkBox $variant={variant}>
      <Thumbnail $thumbnail={data.thumbnail ?? undefined} $variant={variant}>
        {!data.thumbnail && (
          <Gallery width={variant === 'large' ? 24 : 20} height={variant === 'large' ? 24 : 20} />
        )}
      </Thumbnail>
      <span>{data.title}</span>
    </LinkBox>
  )
}

export default Link

const LinkBox = styled.div<{ $variant?: 'large' | 'small' }>`
  display: flex;
  gap: ${(props) => (props.$variant === 'large' ? '10px' : '9px')};

  span {
    color: ${({ theme }) => theme.COLOR['gray-50']};
    ${({ $variant, theme }) =>
    $variant === 'large' ? theme.FONT['body2-normal'] : theme.FONT.caption1};
  }
`

interface ThumbnailProps {
  $thumbnail?: string
  $variant?: 'large' | 'small'
}

const Thumbnail = styled.div<ThumbnailProps>`
  width: ${({ $variant }) => ($variant === 'large' ? '80px' : '70px')};
  height: ${({ $variant }) => ($variant === 'large' ? '45px' : '40px')};
  background-color: ${({ $thumbnail, theme }) =>
    $thumbnail ? 'transparent' : theme.COLOR['gray-600']};
  background-image: ${({ $thumbnail }) => ($thumbnail ? `url(${$thumbnail})` : 'none')};
  background-size: cover;
  background-position: center;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
`
