import { motion } from 'framer-motion'
import { Unlock } from 'lucide-react'

interface FloatingCTAProps {
  label: string
  mobileBottomFixed?: boolean
  onClick: () => void
  primaryColor?: string
  isPreview?: boolean
  blurPosition?: number // 블러 시작 위치 (percentage)
}

/**
 * Floating CTA - 화면 하단 가운데에 고정 배치
 * - 작은 자물쇠 해제 아이콘 버튼
 * - 스크롤을 따라오는 fixed position
 * - 배경: 프로젝트 컬러 또는 기본 오렌지 (#FF5A1F)
 */
export default function FloatingCTA({
  label,
  mobileBottomFixed: _mobileBottomFixed = true,
  onClick,
  primaryColor = '#FF5A1F',
  isPreview = false,
  blurPosition: _blurPosition = 50,
}: FloatingCTAProps) {
  // 컬러에서 hover 색상 계산 (약간 어둡게)
  const getDarkerColor = (color: string) => {
    const hex = color.replace('#', '')
    const r = Math.max(0, Math.floor(parseInt(hex.substr(0, 2), 16) * 0.8))
    const g = Math.max(0, Math.floor(parseInt(hex.substr(2, 2), 16) * 0.8))
    const b = Math.max(0, Math.floor(parseInt(hex.substr(4, 2), 16) * 0.8))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  const hoverColor = getDarkerColor(primaryColor)

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${isPreview ? 'sticky' : 'fixed'} left-1/2 ${isPreview ? 'bottom-0' : 'bottom-6'} -translate-x-1/2 z-40 text-white shadow-lg transition-all duration-200 flex items-center justify-center`}
      style={{
        backgroundColor: primaryColor,
        boxShadow: `0 4px 20px ${primaryColor}4D, 0 2px 8px rgba(0, 0, 0, 0.15)`,
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        ...(isPreview ? {
          position: 'sticky',
          bottom: 0,
          marginBottom: 'calc(-56px)'
        } : {})
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverColor
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = primaryColor
      }}
      title={label}
    >
      <Unlock className="w-6 h-6" />
    </motion.button>
  )
}
