import { ReactNode } from 'react'
import Modal from '../ui/Modal'

interface EntryModalProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  primaryColor?: string
  allowClose?: boolean
}

/**
 * PRD 디자인 가이드 기준 Entry Modal
 * - 오버레이: 반투명 검정 배경 rgba(0, 0, 0, 0.5)
 * - 모달 박스: 배경 #FFFFFF, 둥근 모서리 16px, 그림자 중간 강도
 * - 최대 너비: 500px, 패딩: 32px
 */
export default function EntryModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  primaryColor = '#FF5A1F',
  allowClose = true,
}: EntryModalProps) {
  // 어두운 색상 생성 함수
  const getDarkerColor = (color: string) => {
    const hex = color.replace('#', '')
    const r = Math.max(0, Math.floor(parseInt(hex.substr(0, 2), 16) * 0.8))
    const g = Math.max(0, Math.floor(parseInt(hex.substr(2, 2), 16) * 0.8))
    const b = Math.max(0, Math.floor(parseInt(hex.substr(4, 2), 16) * 0.8))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose || (() => {})}
      showCloseButton={allowClose && !!onClose}
      closeOnOverlayClick={allowClose && !!onClose}
      closeOnEsc={allowClose && !!onClose}
      size="md"
      style={{
        '--project-primary': primaryColor,
      } as React.CSSProperties}
    >
      <div className="text-center mb-6">
        {/* 아이콘 - 브랜드 컬러 그라데이션 */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${getDarkerColor(primaryColor)} 100%)`,
            boxShadow: `0 0 20px ${primaryColor}4D`,
          }}
        >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
        </div>

        {/* 타이틀 */}
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          {title || '전체 내용 보기'}
        </h2>
        <p className="text-text-secondary">
          {subtitle || '이메일 입력하면 바로 열립니다. 이 기기에서는 다음부터 자동으로 열려요.'}
        </p>
      </div>

      {/* 폼 (children) */}
      {children}

      {/* 나중에 할게요 버튼 */}
      {allowClose && onClose && (
        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          나중에 할게요
        </button>
      )}
    </Modal>
  )
}
