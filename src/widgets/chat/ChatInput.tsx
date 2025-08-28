import React, { useState, useRef, useEffect } from 'react'

import styled from 'styled-components'

import { Send } from '@/assets/icons'
import { flexRowCenter } from '@/shared/styles/mixins'
import { SvgButton } from '@/shared/ui'

interface ChatInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  onFocus?: () => void
}

const LINE_HEIGHT = 16
const MAX_LINES = 4

const ChatInput = ({ value, onChange, onSend, onFocus }: ChatInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    adjustHeight()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 한글 조합 중이면 전송하지 않음
    if (e.nativeEvent.isComposing) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, LINE_HEIGHT * MAX_LINES)
      textareaRef.current.style.height = `${newHeight}px`
      setIsExpanded(newHeight > LINE_HEIGHT) // 1줄 이상이면 expanded
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [])

  return (
    <Wrapper $isExpanded={isExpanded}>
      <StyledInput
        ref={textareaRef}
        placeholder="실시간 채팅달기"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onFocus={onFocus}
        rows={1}
      />
      <SvgButton icon={Send} onClick={onSend} />
    </Wrapper>
  )
}

export default ChatInput

const Wrapper = styled.div<{ $isExpanded: boolean }>`
  ${flexRowCenter}
  gap: 16px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  padding: 10px 14px;
  border-radius: 8px;
  width: 100%;
  height: fit-content;
  align-items: ${({ $isExpanded }) => ($isExpanded ? 'flex-end' : 'center')};
`

const StyledInput = styled.textarea`
  flex: 1;
  width: 100%;
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-10']};
  line-height: 15px;
  overflow-y: auto;
  word-break: break-word;
  white-space: pre-wrap;
`
