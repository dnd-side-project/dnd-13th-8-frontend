import React, { useState, useRef, useEffect } from 'react'

import styled from 'styled-components'

import { Send } from '@/assets/icons'
import { flexRowCenter } from '@/shared/styles/mixins'
import { BottomSheet, SvgButton } from '@/shared/ui'

interface ChatInputProps {
  onSend: (message: string) => void
  openBottomSheetOnFocus?: boolean
}

const ChatInput = ({ onSend, openBottomSheetOnFocus }: ChatInputProps) => {
  const [message, setMessage] = useState('')
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const lineHeight = 16
  const maxLines = 4

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    adjustHeight()
  }

  const handleSend = () => {
    if (message.trim() === '') return

    // TODO: 실제 전송 로직으로 교체
    console.log(message.trim())
    onSend(message.trim())

    setMessage('')
    adjustHeight()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, lineHeight * maxLines)
      textareaRef.current.style.height = `${newHeight}px`
      setIsExpanded(newHeight > lineHeight) // 1줄 이상이면 expanded
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [])

  return (
    <>
      <Wrapper $isExpanded={isExpanded}>
        <StyledInput
          ref={textareaRef}
          placeholder="실시간 채팅달기"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            if (openBottomSheetOnFocus) setIsBottomSheetOpen(true)
          }}
          rows={1}
        />
        <SvgButton icon={Send} onClick={handleSend} />
      </Wrapper>

      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        height="50dvh"
      >
        채팅창 영역
      </BottomSheet>
    </>
  )
}

export default ChatInput

const Wrapper = styled.div<{ $isExpanded: boolean }>`
  ${flexRowCenter}
  gap: 16px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  padding: 10px 14px;
  border-radius: 8px;
  height: fit-content;
  align-items: ${({ $isExpanded }) => ($isExpanded ? 'flex-end' : 'center')};
`

const StyledInput = styled.textarea`
  flex: 1;
  max-width: 267px;
  ${({ theme }) => theme.FONT['body2-normal']};
  color: ${({ theme }) => theme.COLOR['gray-10']};
  line-height: 15px;
  overflow-y: auto;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-y: auto;
`
