import React from 'react'

import styled from 'styled-components'

interface SvgButtonProps {
  icon: React.ElementType<React.SVGProps<SVGSVGElement>>
  onClick?: () => void
  width?: number
  height?: number
  fill?: string
}

const SvgButton: React.FC<SvgButtonProps> = ({
  icon: Icon,
  onClick,
  width = 24,
  height = 24,
  fill,
}) => {
  return (
    <Button type="button" onClick={onClick} width={width} height={height}>
      <Icon fill={fill} />
    </Button>
  )
}

export default SvgButton

const Button = styled.button<{
  width: number
  height: number
}>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`
