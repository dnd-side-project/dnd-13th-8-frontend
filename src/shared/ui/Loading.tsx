import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import styled from 'styled-components'

import { useDevice } from '@/shared/hooks/useDevice'
import { flexRowCenter } from '@/shared/styles/mixins'
import Overlay from '@/shared/ui/Overlay'

interface LoadingProps {
  isLoading: boolean
  width?: string
  height?: string
}

const Loading = ({ isLoading, width, height = 'auto' }: LoadingProps) => {
  const deviceType = useDevice()

  const dotVariants: Variants = {
    jump: {
      y: -30,
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    },
  }

  const maxWidth = deviceType === 'mobile' ? 'clamp(320px, 100dvw, 420px)' : '375px'

  return (
    <Overlay isOpen={isLoading} onClose={() => {}} childrenAlign="center">
      <LoadingContainer
        animate="jump"
        transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
        $width={width}
        $maxWidth={maxWidth}
        $height={height}
      >
        <LoadingDot variants={dotVariants} />
        <LoadingDot variants={dotVariants} />
        <LoadingDot variants={dotVariants} />
      </LoadingContainer>
    </Overlay>
  )
}

export default Loading

const LoadingContainer = styled(motion.div)<{
  $width?: string
  $maxWidth?: string
  $height?: string
}>`
  ${flexRowCenter}
  gap: 10px;
  width: ${({ $width, $maxWidth }) => $width || $maxWidth};
  max-width: ${({ $maxWidth }) => $maxWidth};
  height: ${({ $height }) => $height};
  min-height: 100px;
`

const LoadingDot = styled(motion.div)`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.COLOR['primary-normal']};
  will-change: transform;
`
