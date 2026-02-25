import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import type { DefaultError } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

import { Trash, Plus } from '@/assets/icons'
import overlayUrl from '@/assets/icons/icn_overlay.svg?url'
import { ExpandBtn, TrashBtn } from '@/assets/images'
import { startKakaoLogin } from '@/features/auth'
import { THEME_PROP_ID_OFFSET } from '@/features/customize/constants/customize'
import {
  BACKEND_TO_FRONT_THEME,
  STICKER_THEME_LIST,
} from '@/features/customize/constants/customize'
import { getCurrentThemeImages } from '@/features/customize/lib/customize'
import { useUserSticker, useCdSave } from '@/features/customize/model/useCustomize'
import type {
  StickerThemeType,
  StickerInfoType,
  StickerThemeUpperType,
} from '@/features/customize/types/customize'
import type { CustomizeStepProps } from '@/pages/customize'
import { StepHeader } from '@/pages/customize/ui'
import { useDragScroll } from '@/shared/lib/useDragScroll'
import { flexRowCenter } from '@/shared/styles/mixins'
import { Loading } from '@/shared/ui'
import type { ModalProps } from '@/shared/ui/Modal'

const CustomizeStep2 = ({
  currentStep,
  setCurrentStep,
  setCurrentCdId,
  setModal,
  isEditMode,
  prevTracklist,
  isLogin,
}: CustomizeStepProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cdContainerRef = useRef<HTMLCanvasElement>(null)
  const imageCache = useRef<{ [key: string]: HTMLImageElement | null }>({})
  const themeListRef = useRef<HTMLUListElement>(null)

  const [currentThemeId, setCurrentThemeId] = useState<StickerThemeType>('deulak')
  const [stickers, setStickers] = useState<StickerInfoType[]>([])
  const [selectedSticker, setSelectedSticker] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeMode, setResizeMode] = useState<'move' | 'resize' | null>(null)

  const { uploadSticker, uploadPending } = useUserSticker()
  const { mutate, isPending: savePending } = useCdSave()

  useDragScroll(themeListRef as React.RefObject<HTMLElement>)

  // ===============================
  // 스티커 초기 데이터 세팅
  // ===============================

  // 테마 이미지 URL (Vite glob 결과를 정렬하여 일관된 순서 보장)
  const stickerUrls = useMemo(() => {
    const images = getCurrentThemeImages(currentThemeId) as Record<string, { default: string }>
    const sortedKeys = Object.keys(images).sort()
    return sortedKeys.map((key) => images[key].default)
  }, [currentThemeId])

  // 스티커 리스트 생성
  const stickerList = useMemo(() => {
    return Array.from({ length: stickerUrls.length }, (_, i) => i + 1)
  }, [stickerUrls.length])

  // ===============================
  // 저장 / 모달 관련
  // ===============================

  // 헤더 다음 버튼 클릭
  const onHeaderNextClick = () => {
    if (!isLogin) {
      sessionStorage.setItem(
        'tempCustomizeData',
        JSON.stringify({
          stickers,
          currentStep,
        })
      )
      setModal({
        isOpen: true,
        title: '로그인 후 이용할 수 있어요',
        description: '지금 만든 CD를 저장하려면 로그인이 필요해요',
        ctaType: 'double',
        confirmText: '로그인하기',
        cancelText: '다음에 하기',
        onClose: () => null,
        onCancel: onModalClose,
        onConfirm: () => {
          startKakaoLogin(location.pathname, 'SAVE_CD')
          onModalClose()
        },
      })
      return
    }

    onSaveCd()
  }

  // 모달 close
  const onModalClose = () => {
    setModal({ isOpen: false } as ModalProps)
  }

  // step1으로 랜딩
  const onSessionExpired = () => {
    const moveToStep1 = () => {
      setModal({ isOpen: false } as ModalProps)
      setCurrentStep(1)
    }
    setModal({
      isOpen: true,
      title: '트랙리스트 임시 저장 시간이 만료되었어요',
      description: '이전 페이지로 이동할게요',
      ctaType: 'single',
      confirmText: '확인',
      onClose: moveToStep1,
      onConfirm: moveToStep1,
    })
  }

  // CD 저장
  const onSaveCd = (targetStickers?: StickerInfoType[]) => {
    // 인자가 넘어오면 우선 사용, 없으면 현재 상태 사용
    const finalStickers = targetStickers ?? stickers
    const removeTempData = () => {
      sessionStorage.removeItem('tempBasicInfo')
      sessionStorage.removeItem('tempTracklist')
    }

    const tempBasicInfo = JSON.parse(sessionStorage.getItem('tempBasicInfo') ?? '{}')
    const payload = {
      savePlaylistRequest: {
        name: tempBasicInfo?.name ?? '',
        genre: tempBasicInfo?.genre?.id ?? '',
        isPublic: tempBasicInfo?.isPublic ?? true,
        youTubeVideoInfo: JSON.parse(sessionStorage.getItem('tempTracklist') ?? '[]'),
      },
      saveCdRequest: {
        cdItems: finalStickers.map((s) => ({
          propId: s.propId ?? 0, // 백엔드 스티커 id
          xCoordinate: s.x,
          yCoordinate: s.y,
          zCoordinate: s.z,
          height: s.height,
          width: s.width,
          scale: s.scale,
          angle: s.rotation,
        })),
      },
    }

    mutate(
      {
        payload,
        isEditMode,
        playlistId: isEditMode ? Number(prevTracklist?.playlistId) : null,
      },
      {
        onSuccess: (response) => {
          setCurrentCdId?.(response?.playlistId ?? null)
          setCurrentStep(3)
          removeTempData()
        },
        onError: (error) => {
          console.error('CD 저장 실패:', error)
          onSaveError(error)
        },
      }
    )
  }

  // 저장 시 에러 핸들링
  const onSaveError = (error: AxiosError | DefaultError) => {
    const errorStatus = 'status' in error ? error.status : null
    if (errorStatus === 409) {
      onSessionExpired()
      return
    }
    const errorTitle = `${errorStatus === 500 ? '일시적인 오류로 ' : ''}CD를 저장하지 못했어요`
    setModal({
      isOpen: true,
      title: errorTitle,
      description: '잠시 후 다시 시도해주세요',
      ctaType: 'single',
      confirmText: '확인',
      onClose: onModalClose,
      onConfirm: onModalClose,
    })
  }

  // 새 스티커 추가 시 다음 z 계산
  const getNextZIndex = () => {
    if (stickers.length === 0) return 1
    return Math.max(...stickers.map((s) => s.z)) + 1
  }

  // ===============================
  // 스티커 업로드 / 추가 / 삭제
  // ===============================

  // 스티커 업로드
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const MAX_FILE_SIZE = 1024 * 1024 * 5 // 5MB

    if (file.size > MAX_FILE_SIZE) {
      setModal({
        isOpen: true,
        title: '5MB 이하의 파일만 업로드 가능해요',
        ctaType: 'single',
        confirmText: '확인',
        onClose: () => onModalClose(),
        onConfirm: () => {
          onModalClose()
          return
        },
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // 유저 커스텀 스티커 데이터 전송
    uploadSticker.mutate(
      { theme: 'USER', file },
      {
        onSuccess: (response) => {
          const center = getCDCenter()

          const img = new Image()
          img.onload = () => {
            imageCache.current[response.imageUrl] = img

            const width = 50
            const aspectRatio = img.naturalWidth / img.naturalHeight
            const height = width / aspectRatio

            const newSticker: StickerInfoType = {
              id: uuidv4(),
              propId: response.propId,
              type: 'custom',
              src: response.imageUrl,
              x: center.x - width / 2 + 85,
              y: center.y - height / 2,
              z: getNextZIndex(),
              width,
              height,
              scale: 1,
              rotation: 0,
            }

            setStickers((prev) => {
              const updated = [...prev, newSticker]
              setSelectedSticker(updated.length - 1)
              return updated
            })
          }

          img.src = response.imageUrl
        },
        onError: (error) => {
          console.error(' 저장 실패:', error)
          setModal({
            isOpen: true,
            title: '파일 업로드 중 오류가 발생했어요',
            ctaType: 'single',
            confirmText: '확인',
            onClose: () => onModalClose(),
            onConfirm: () => onModalClose(),
          })
        },
      }
    )
  }

  // 스티커 추가
  const onStickersAddClick = (stickerId: number) => {
    // 스티커 최대 16개 제한
    if (stickers.length >= 16) {
      setModal({
        isOpen: true,
        title: '스티커는 16개까지만 추가할 수 있어요',
        ctaType: 'single',
        confirmText: '확인',
        onClose: () => onModalClose(),
        onConfirm: () => onModalClose(),
      })
      return
    }

    const width = 50
    const height = 50
    const center = getCDCenter()

    const src = stickerUrls[stickerId - 1]
    const type = currentThemeId

    const newSticker: StickerInfoType = {
      id: uuidv4(),
      type,
      propId: stickerId + getThemeOffset(currentThemeId),
      src,
      x: center.x - width / 2 + 85,
      y: center.y - height / 2,
      z: getNextZIndex(),
      width,
      height,
      scale: 1,
      rotation: 0,
    }

    // 스티커 이미지 캐시가 없으면 즉시 로드하여 onload에서 그리기
    if (!imageCache.current[src]) {
      const img = new Image()
      img.onload = () => {
        imageCache.current[src] = img
        drawStickers()
      }
      img.src = src
    }

    const newStickers = [...stickers, newSticker]
    setStickers(newStickers)
    setSelectedSticker(newStickers.length - 1)
  }

  // 스티커 삭제
  const deleteSelectedSticker = () => {
    if (selectedSticker !== null) {
      const updatedStickers = stickers.filter((_, index) => index !== selectedSticker)
      setStickers(updatedStickers)
      setSelectedSticker(null)
    }
  }

  // 스티커 전체 삭제
  const onAllDeleteClick = () => {
    setModal({
      isOpen: true,
      title: '모든 스티커를 삭제할까요?',
      ctaType: 'double',
      confirmText: '삭제하기',
      cancelText: '취소',
      onClose: () => onModalClose(),
      onConfirm: () => {
        setStickers([])
        setSelectedSticker(null)
        onModalClose()
        return
      },
      onCancel: () => onModalClose(),
    })
  }

  // ===============================
  // 사용자 인터랙션
  // ===============================

  // 포인터 이벤트 핸들러 (down)
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) e.preventDefault()

    const { x, y } = getPointerPosition(e.nativeEvent)

    // 클릭한 위치가 원형 cd 내부인지 확인
    const canvas = cdContainerRef.current
    if (canvas) {
      const centerX = canvas.width / 2 / (window.devicePixelRatio || 1)
      const centerY = canvas.height / 2 / (window.devicePixelRatio || 1)
      const radius = canvas.width / 2 / (window.devicePixelRatio || 1) - 5

      const dx = x - centerX
      const dy = y - centerY

      // 원 밖이면 무시
      if (dx * dx + dy * dy > radius * radius) return
    }

    // 선택된 스티커의 버튼들 클릭 확인
    if (selectedSticker !== null) {
      const sticker = stickers[selectedSticker]
      const handles = getStickerHandles(sticker)

      // 삭제 버튼 체크 - 감지 영역을 넓게
      if (Math.hypot(x - handles.delete.x, y - handles.delete.y) < 10) {
        deleteSelectedSticker()
        return
      }

      // 확대 버튼 체크 - 감지 영역을 넓게
      if (Math.hypot(x - handles.resize.x, y - handles.resize.y) < 20) {
        setResizeMode('resize')
        setIsDragging(true)
        return
      }
    }

    // 스티커 클릭 (선택/이동)
    for (let i = stickers.length - 1; i >= 0; i--) {
      const sticker = stickers[i]
      const centerX = sticker.x + (sticker.width * sticker.scale) / 2
      const centerY = sticker.y + (sticker.height * sticker.scale) / 2
      const dx = x - centerX
      const dy = y - centerY
      const angle = -sticker.rotation
      const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
      const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

      // 참고 코드와 동일한 클릭 감지 (원본 크기 기준)
      if (
        localX >= -sticker.width / 2 &&
        localX <= sticker.width / 2 &&
        localY >= -sticker.height / 2 &&
        localY <= sticker.height / 2
      ) {
        // 스티커 클릭 시 최상위로 이동
        if (selectedSticker !== i) {
          const newStickers = [...stickers]
          const clickedSticker = newStickers.splice(i, 1)[0]
          newStickers.push(clickedSticker)
          setStickers(newStickers)
          setSelectedSticker(newStickers.length - 1)
        } else {
          setSelectedSticker(i)
        }

        setResizeMode('move')
        setIsDragging(true)
        setDragOffset({ x: localX, y: localY })
        return
      }
    }

    // 백그라운드 클릭 (스티커 선택 해제)
    setSelectedSticker(null)
  }

  // 스티커 이동 핸들러 (move)
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || selectedSticker === null) return

    if ('touches' in e) e.preventDefault()

    const { x, y } = getPointerPosition(e.nativeEvent)

    const updatedStickers = [...stickers]
    const sticker = updatedStickers[selectedSticker]

    if (resizeMode === 'move') {
      // 이동 - 참고 코드와 동일한 로직
      const newX =
        x -
        (Math.cos(sticker.rotation) * dragOffset.x - Math.sin(sticker.rotation) * dragOffset.y) -
        (sticker.width * sticker.scale) / 2
      const newY =
        y -
        (Math.sin(sticker.rotation) * dragOffset.x + Math.cos(sticker.rotation) * dragOffset.y) -
        (sticker.height * sticker.scale) / 2

      // 자유롭게 이동 (클리핑으로 경계를 넘어가면 자동으로 보이지 않음)
      sticker.x = newX
      sticker.y = newY
    } else if (resizeMode === 'resize') {
      // 정비율 크기조절 - 참고 코드와 동일
      const left = sticker.x
      const top = sticker.y
      const dx = x - left
      const dy = y - top
      const angle = -sticker.rotation
      const localX = dx * Math.cos(angle) - dy * Math.sin(angle)
      const localY = dx * Math.sin(angle) + dy * Math.cos(angle)

      // 정비율 계산
      const ratio = sticker.width / sticker.height
      const newSize = Math.max(20, Math.max(localX, localY))
      sticker.width = newSize
      sticker.height = newSize / ratio
    }

    setStickers(updatedStickers)

    // resize 모드일 때는 Canvas를 즉시 업데이트
    if (resizeMode === 'resize') {
      drawStickers()
    }
  }

  // 포인터 이벤트 핸들러 종료 (up)
  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setResizeMode(null)
    }
  }

  // ===============================
  // 좌표 / 보조 유틸
  // ===============================

  // CD 중앙 좌표 가져오기
  const getCDCenter = () => {
    if (cdContainerRef.current) {
      const rect = cdContainerRef.current.getBoundingClientRect()
      return { x: rect.width / 2, y: rect.height / 2 }
    }
    return { x: 140, y: 140 } // 기본값
  }

  // 스티커 핸들러 좌표 계산
  const getStickerHandles = (sticker: StickerInfoType) => {
    const centerX = sticker.x + (sticker.width * sticker.scale) / 2
    const centerY = sticker.y + (sticker.height * sticker.scale) / 2

    const resize = rotatePoint(sticker.width / 2, sticker.height / 2, sticker.rotation)
    const deleteBtn = rotatePoint(
      sticker.width / 2 / sticker.scale,
      -sticker.height / 2 / sticker.scale,
      sticker.rotation
    )

    return {
      resize: {
        x: centerX + resize.x * sticker.scale,
        y: centerY + resize.y * sticker.scale,
      },
      delete: {
        x: centerX + deleteBtn.x * sticker.scale,
        y: centerY + deleteBtn.y * sticker.scale,
      },
      center: { x: centerX, y: centerY },
    }
  }

  // 회전 보조 함수
  function rotatePoint(x: number, y: number, angle: number) {
    return {
      x: x * Math.cos(angle) - y * Math.sin(angle),
      y: x * Math.sin(angle) + y * Math.cos(angle),
    }
  }

  // 마우스/터치 좌표 추출
  const getPointerPosition = (e: MouseEvent | TouchEvent | PointerEvent) => {
    if (!cdContainerRef.current) return { x: 0, y: 0 }

    const rect = cdContainerRef.current.getBoundingClientRect()
    let clientX: number, clientY: number

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if ('clientX' in e) {
      clientX = e.clientX
      clientY = e.clientY
    } else {
      return { x: 0, y: 0 }
    }

    // 모바일 터치 좌표는 스크롤 보정 없이 boundingClientRect 기준으로 계산
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  // 백엔드에 전송할 스티커별 theme offset 계산
  const getThemeOffset = (theme: StickerThemeType | StickerThemeUpperType) => {
    // 백엔드에서 온 대문자면 변환
    const normalized = (
      theme in BACKEND_TO_FRONT_THEME
        ? BACKEND_TO_FRONT_THEME[theme as StickerThemeUpperType]
        : theme
    ) as StickerThemeType

    return THEME_PROP_ID_OFFSET[normalized as keyof typeof THEME_PROP_ID_OFFSET]
  }

  // ===============================
  // Canvas 렌더링
  // ===============================

  // Canvas에 스티커 그리기
  const drawStickers = (logicalSize = 280) => {
    const canvas = cdContainerRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Canvas 초기화
    ctx.clearRect(0, 0, logicalSize, logicalSize)

    const centerX = logicalSize / 2
    const centerY = logicalSize / 2
    const radius = logicalSize / 2 - 5

    // CD 배경 (원형, 테마의 hologram 그라디언트)
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.clip()

    // Canvas API로 hologram 그라디언트 생성 (모바일 Safari 호환: conic 미지원 시 radial로 폴백)
    let gradient: CanvasGradient
    const hasConic =
      typeof (
        ctx as CanvasRenderingContext2D &
          Partial<{
            createConicGradient: (startAngle: number, x: number, y: number) => CanvasGradient
          }>
      ).createConicGradient === 'function'
    if (hasConic) {
      gradient = (
        ctx as CanvasRenderingContext2D & {
          createConicGradient: (startAngle: number, x: number, y: number) => CanvasGradient
        }
      ).createConicGradient(0, centerX, centerY)
      gradient.addColorStop(0, '#ffffff')
      gradient.addColorStop(68 / 360, '#c2fff4')
      gradient.addColorStop(100 / 360, '#f8fccc')
      gradient.addColorStop(170 / 360, '#c5f3eb')
      gradient.addColorStop(250 / 360, '#ffe2fe')
      gradient.addColorStop(280 / 360, '#c0f9ef')
      gradient.addColorStop(340 / 360, '#fffbe9')
      gradient.addColorStop(1, '#ffffff')
    } else {
      // conic 미지원 브라우저(iOS Safari 등)용 폴백: 웻지 방식으로 색 구간을 나눠 채움
      const stops: Array<{ pos: number; color: string }> = [
        { pos: 0, color: '#ffffff' },
        { pos: 68 / 360, color: '#c2fff4' },
        { pos: 100 / 360, color: '#f8fccc' },
        { pos: 170 / 360, color: '#c5f3eb' },
        { pos: 250 / 360, color: '#ffe2fe' },
        { pos: 280 / 360, color: '#c0f9ef' },
        { pos: 340 / 360, color: '#fffbe9' },
        { pos: 1, color: '#ffffff' },
      ]

      // 배경은 흰색으로 초기 채움
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      // 웻지 채우기
      for (let i = 0; i < stops.length - 1; i++) {
        const startAngle = stops[i].pos * Math.PI * 2
        const endAngle = stops[i + 1].pos * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = stops[i].color
        ctx.fill()
      }
      // 이후 로직에서 동일하게 clip 처리되므로 여기서 return하지 않음
      // gradient 객체는 사용하지 않기 때문에 임시로 radial을 지정해두되, 실제로는 이미 웻지로 채워짐
      const radial = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      radial.addColorStop(0, '#ffffff')
      radial.addColorStop(1, '#ffffff')
      gradient = radial
    }

    ctx.fillStyle = gradient
    ctx.fill()

    // CD 원형 영역을 클리핑하여 스티커가 경계를 넘어가면 보이지 않도록 함
    ctx.clip()

    // 스티커들 그리기
    stickers.forEach((sticker, index) => {
      const cachedImg = imageCache.current[sticker.src]

      if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
        const centerX = sticker.x + (sticker.width * sticker.scale) / 2
        const centerY = sticker.y + (sticker.height * sticker.scale) / 2

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(sticker.rotation)
        ctx.scale(sticker.scale, sticker.scale)

        ctx.drawImage(
          cachedImg,
          -sticker.width / 2,
          -sticker.height / 2,
          sticker.width,
          sticker.height
        )

        // 선택된 스티커 테두리, 삭제&확대 버튼
        if (selectedSticker === index) {
          // 스케일 적용 후에 버튼들을 그리기 (참고 코드와 동일한 방식)
          ctx.strokeStyle = '#40eae2'
          ctx.lineWidth = 1
          ctx.strokeRect(
            -sticker.width / 2 - 2,
            -sticker.height / 2 - 2,
            sticker.width + 4,
            sticker.height + 4
          )

          // 버튼들 그리기 (스케일에 맞춰서 크기 조정)
          const buttons = [
            {
              type: 'trash',
              src: TrashBtn,
              x: sticker.width / 2 - 10,
              y: -sticker.height / 2 - 10,
              fallback: () => {
                // 삭제 버튼 대체 (스케일에 맞춰서 크기 조정)
                ctx.save()
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
                ctx.shadowBlur = 4
                ctx.shadowOffsetX = 1
                ctx.shadowOffsetY = 1

                ctx.fillStyle = '#ef4444'
                ctx.strokeStyle = '#ffffff'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(sticker.width / 2 + 10, -sticker.height / 2 - 10, 10, 0, 2 * Math.PI)
                ctx.fill()
                ctx.stroke()

                ctx.restore()
              },
            },
            {
              type: 'expand',
              src: ExpandBtn,
              x: sticker.width / 2 - 10,
              y: sticker.height / 2 - 10,
              fallback: () => {
                // 확대 버튼 대체 (스케일에 맞춰서 크기 조정)
                ctx.save()
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
                ctx.shadowBlur = 8
                ctx.shadowOffsetX = 2
                ctx.shadowOffsetY = 2

                ctx.fillStyle = '#3b82f6'
                ctx.strokeStyle = '#ffffff'
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.arc(sticker.width / 2 - 10, sticker.height / 2 - 10, 10, 0, 2 * Math.PI)
                ctx.fill()
                ctx.stroke()

                ctx.restore()
              },
            },
          ]

          buttons.forEach((button) => {
            const img = imageCache.current[button.src]
            if (img && img.complete && img.naturalWidth > 0) {
              try {
                // 모든 버튼에 섀도우 효과 적용 (부드럽게)
                ctx.save()
                ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
                ctx.shadowBlur = 4
                ctx.shadowOffsetX = 1
                ctx.shadowOffsetY = 1

                // 스케일에 맞춰서 버튼 크기 조정 (참고 코드와 동일)
                ctx.drawImage(img, button.x, button.y, 20, 20)

                ctx.restore()
              } catch (error) {
                console.error(`${button.type} image draw error:`, error)
                button.fallback()
              }
            } else {
              // 이미지가 없거나 로딩 실패 시 대체 버튼 표시
              button.fallback()
            }
          })
        }

        ctx.restore()
      }
    })

    // 초기 save()에 대한 restore()로 클리핑/상태 복구 (모바일 브라우저 안정성 개선)
    ctx.restore()
  }

  // Canvas 초기화 및 이벤트 리스너 등록
  useEffect(() => {
    const canvas = cdContainerRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // DPR 적용
    const dpr = window.devicePixelRatio || 1
    const logicalSize = 280

    // CSS 크기는 280 유지, 실제 해상도는 DPR 반영
    canvas.style.width = `${logicalSize}px`
    canvas.style.height = `${logicalSize}px`
    canvas.width = logicalSize * dpr
    canvas.height = logicalSize * dpr

    // 좌표계 스케일링
    ctx.scale(dpr, dpr)

    // 초기 그리기
    drawStickers(logicalSize)

    // 모바일 Safari 등에서 터치 스크롤 간섭 방지
    const stopDefault = (ev: TouchEvent) => ev.preventDefault()

    // 수정 모드일 경우 스티커 데이터 화면에 렌더링
    if (isEditMode && prevTracklist?.cdResponse?.cdItems.length) {
      const prevStickers: StickerInfoType[] = prevTracklist.cdResponse.cdItems.map(
        (prevSticker, index) => {
          const scaleFactor = 280 / 285

          // imageUrl이 DEFAULT면 테마에서 이미지 찾아오기
          let src = prevSticker?.imageUrl ?? ''
          if (src === 'DEFAULT') {
            // 타입 오류 방지: item.theme을 StickerThemeType으로 명확히 변환
            const theme = prevSticker.theme as StickerThemeType
            const images = getCurrentThemeImages(theme) as Record<string, { default: string }>
            const sortedKeys = Object.keys(images).sort((a, b) => {
              const numA = parseInt(a.match(/(\d+)\.png$/)?.[1] ?? '0', 10)
              const numB = parseInt(b.match(/(\d+)\.png$/)?.[1] ?? '0', 10)
              return numA - numB
            })

            // propId에서 theme offset 빼고 index 계산
            const themeOffset = getThemeOffset(theme)
            const idx = prevSticker.propId - themeOffset - 1
            src = images[sortedKeys[idx]]?.default ?? ''
          }

          return {
            id: uuidv4(),
            propId: prevSticker?.propId,
            type: prevSticker?.theme as StickerThemeType,
            src,
            x: prevSticker.xCoordinate * scaleFactor,
            y: prevSticker.yCoordinate * scaleFactor,
            z: index + 1,
            width: prevSticker.width * scaleFactor,
            height: prevSticker.height * scaleFactor,
            scale: prevSticker.scale,
            rotation: prevSticker.angle,
          }
        }
      )

      // stickers 세팅 전에 이미지 미리 로드
      let loadedCount = 0
      prevStickers.forEach((sticker) => {
        if (imageCache.current[sticker.src]) {
          loadedCount++
          if (loadedCount === prevStickers.length) {
            setStickers(prevStickers)
          }
          return
        }

        const img = new Image()
        img.onload = () => {
          imageCache.current[sticker.src] = img
          loadedCount++
          if (loadedCount === prevStickers.length) {
            setStickers(prevStickers)
          }
        }
        img.onerror = () => {
          loadedCount++
          if (loadedCount === prevStickers.length) {
            setStickers(prevStickers)
          }
        }
        img.src = sticker.src
      })
    }

    return () => {
      canvas.removeEventListener('touchstart', stopDefault)
      canvas.removeEventListener('touchmove', stopDefault)
      canvas.removeEventListener('touchend', stopDefault)
    }
  }, [])

  // 이미지 미리 로드
  useEffect(() => {
    // 기본 스티커 이미지들 미리 로드 (Vite glob URL 사용)
    stickerUrls.forEach((src) => {
      if (!imageCache.current[src]) {
        const img = new Image()
        img.onload = () => {
          imageCache.current[src] = img
          // 이미지 로딩 완료 후 Canvas 다시 그리기
          if (cdContainerRef.current) {
            drawStickers()
          }
        }
        img.src = src
      }
    })

    // 버튼 이미지들 미리 로드
    const buttonImages = [TrashBtn, ExpandBtn]

    buttonImages.forEach((src) => {
      if (!imageCache.current[src]) {
        const img = new Image()
        img.onload = () => {
          imageCache.current[src] = img
          // 이미지 로딩 완료 후 Canvas 다시 그리기
          if (cdContainerRef.current) {
            drawStickers()
          }
        }
        img.onerror = () => {
          console.error('Failed to load button image:', src)
          // 이미지 로딩 실패 시 null로 설정
          imageCache.current[src] = null
        }
        img.src = src
      }
    })
  }, [currentThemeId, stickerUrls])

  // 비회원이 로그인 후 돌아왔을 때 이전 데이터 복구 및 저장 실행
  useEffect(() => {
    const state = location.state as { action?: string } | null
    const tempCustomizeData = sessionStorage.getItem('tempCustomizeData')

    if (isLogin && state?.action === 'SAVE_CD') {
      // 임시 데이터가 있는지 확인
      const savedData = tempCustomizeData ? JSON.parse(tempCustomizeData) : null
      const savedStickers: StickerInfoType[] = savedData?.stickers || []

      // 중복 실행 방지를 위한 정리
      navigate(location.pathname, { replace: true, state: {} })
      sessionStorage.removeItem('tempCustomizeData')

      // 복구할 스티커가 없는 경우: 즉시 저장 후 종료
      if (savedStickers?.length === 0) {
        onSaveCd([])
        return
      }

      // 복구할 스티커가 있는 경우: 이미지 로드 후 저장
      let loadedCount = 0
      savedStickers.forEach((sticker) => {
        const img = new Image()
        img.onload = () => {
          imageCache.current[sticker.src] = img
          loadedCount++
          if (loadedCount === savedStickers.length) {
            setStickers(savedStickers)
            onSaveCd(savedStickers) // 로드 완료된 데이터로 저장
          }
        }
        img.onerror = () => {
          loadedCount++
          if (loadedCount === savedStickers.length) {
            setStickers(savedStickers)
            onSaveCd(savedStickers)
          }
        }
        img.src = sticker.src
      })
    }
  }, [isLogin])

  // stickers가 변경될 때마다 다시 그리기
  useEffect(() => {
    drawStickers()
  }, [stickers, selectedSticker])

  return (
    <>
      <Loading isLoading={uploadPending || savePending} />
      <Step2Wrap>
        <StepHeader
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isValidate
          onHeaderNextClick={onHeaderNextClick}
        />
        <CdAreaWrap>
          <CdCustomContainer>
            <canvas
              ref={cdContainerRef}
              width={280}
              height={280}
              style={{
                touchAction: 'none',
                WebkitUserSelect: 'none',
                WebkitTouchCallout: 'none',
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            />

            <CdOverlay />
          </CdCustomContainer>
          <AllDeleteBtn type="button" onClick={onAllDeleteClick}>
            <Trash width={24} height={24} />
          </AllDeleteBtn>
        </CdAreaWrap>
        <StickerAreaWrap>
          <ThemeListContainer ref={themeListRef}>
            {STICKER_THEME_LIST.map((theme) => (
              <li key={theme.id}>
                <ThemeButton
                  type="button"
                  $isActive={currentThemeId === theme.id}
                  onClick={() => setCurrentThemeId(theme.id)}
                >
                  {theme.name}
                </ThemeButton>
              </li>
            ))}
          </ThemeListContainer>
          <StickerListContainer>
            <li>
              <StickerButton type="button" onClick={() => fileInputRef.current?.click()}>
                <Plus width={32} height={32} />
              </StickerButton>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={onFileChange}
                hidden
              />
            </li>
            {stickerList.map((id) => (
              <li key={uuidv4()}>
                <StickerButton type="button" onClick={() => onStickersAddClick(id)}>
                  <img src={stickerUrls[id - 1]} alt={`${currentThemeId} 스티커`} />
                </StickerButton>
              </li>
            ))}
          </StickerListContainer>
        </StickerAreaWrap>
      </Step2Wrap>
    </>
  )
}

export default CustomizeStep2

const Step2Wrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
`

const CdAreaWrap = styled.section`
  position: relative;
`

const CdCustomContainer = styled.div`
  position: relative;
  margin: 35px auto;
  width: 280px;
  height: 280px;
  pointer-events: auto;
  touch-action: none;
`

const CdOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: url(${overlayUrl}) no-repeat center/cover;
  mix-blend-mode: multiply;
  pointer-events: none;
`

const AllDeleteBtn = styled.button`
  position: absolute;
  bottom: 15px;
  right: 0;
  ${flexRowCenter}
  width: 44px;
  height: 44px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};
  border-radius: 50%;
`

const StickerAreaWrap = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  margin: 0 -20px;
  width: calc(100% + 40px);
  background-color: ${({ theme }) => theme.COLOR['gray-700']};
`

const ThemeListContainer = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 16px 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`

const ThemeButton = styled.button<{ $isActive: boolean }>`
  ${flexRowCenter}
  padding: 8px 20px;
  height: 36px;
  white-space: nowrap;
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.COLOR['gray-600'] : 'transparent'};
  border-radius: 18px;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.COLOR['primary-normal'] : theme.COLOR['gray-10']};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
`

const StickerListContainer = styled.ul`
  width: 100%;
  height: calc(100% - 152px);
  padding: 0px 20px 34px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, auto));
  gap: 12px 5px;
  justify-content: space-around;
`

const StickerButton = styled.button`
  width: 78px;
  height: 78px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.COLOR['gray-600']};

  & > img {
    width: 56px;
    height: 56px;
    object-fit: contain;
  }
`
