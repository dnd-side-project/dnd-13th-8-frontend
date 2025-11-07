import React from 'react'

import styled from 'styled-components'

import { flexRowCenter } from '@/shared/styles/mixins'

interface SvgButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  width?: number
  height?: number
  fill?: string
  stroke?: string
  className?: string
}

const SvgButton = ({
  icon: Icon,
  onClick,
  width = 24,
  height = 24,
  fill,
  stroke,
  className,
}: SvgButtonProps) => {
  return (
    <Button type="button" onClick={onClick} $width={width} $height={height} className={className}>
      <Icon fill={fill} stroke={stroke} />
    </Button>
  )
}

export default SvgButton

const Button = styled.button<{
  $width: number
  $height: number
}>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;

  ${flexRowCenter}
`
