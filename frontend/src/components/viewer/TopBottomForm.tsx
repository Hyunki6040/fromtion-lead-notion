import { motion } from 'framer-motion'
import LeadForm from './LeadForm'
import { cn } from '../../lib/utils'

interface TopBottomFormProps {
  position: 'top' | 'bottom'
  title?: string
  subtitle?: string
  formConfig: any
  onSubmit: (data: any) => Promise<any>
  isSubmitting?: boolean
  primaryColor?: string
}

/**
 * PRD 디자인 가이드 기준 상단/하단 폼
 * - 배경: 브랜드 컬러 기반 소프트 그라데이션
 */
export default function TopBottomForm({
  position,
  title,
  subtitle,
  formConfig,
  onSubmit,
  isSubmitting,
  primaryColor = '#FF5A1F',
}: TopBottomFormProps) {
  // 브랜드 컬러에서 소프트한 배경 그라데이션 생성
  const generateSoftBackground = (color: string) => {
    // hex 색상을 RGB로 변환
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    // 매우 연한 색상 생성 (alpha 0.08 ~ 0.15)
    const lightColor = `rgba(${r}, ${g}, ${b}, 0.08)`
    const lighterColor = `rgba(${r}, ${g}, ${b}, 0.04)`

    return `linear-gradient(135deg, ${lightColor} 0%, ${lighterColor} 100%)`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative z-30 border-border',
        position === 'top' ? 'border-b' : 'border-t'
      )}
      style={{
        background: generateSoftBackground(primaryColor),
        '--project-primary': primaryColor,
      } as React.CSSProperties}
      data-form-position={position}
    >
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* 타이틀 */}
        {title && (
          <h2 className="text-xl font-semibold text-text-primary text-center mb-2">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-text-secondary text-center mb-6">
            {subtitle}
          </p>
        )}

        {/* 폼 */}
        <LeadForm
          formConfig={formConfig}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          primaryColor={primaryColor}
          compact
        />
      </div>
    </motion.div>
  )
}
