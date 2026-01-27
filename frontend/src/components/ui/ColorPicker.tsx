import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface ColorPickerProps {
  label?: string
  value: string
  onChange: (color: string) => void
  error?: string
  helperText?: string
  className?: string
}

/**
 * Color Picker 컴포넌트
 * HTML5 color input을 사용하되, 커스텀 스타일 적용
 */
export default function ColorPicker({
  label,
  value,
  onChange,
  error,
  helperText,
  className,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handlePreviewClick = () => {
    inputRef.current?.click()
  }

  // 미리 정의된 컬러 팔레트 (선택 사항)
  const presetColors = [
    '#FF5A1F', // FORMTION Orange (기본)
    '#E64510', // Orange Deep
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#EC4899', // Pink
    '#6366F1', // Indigo
  ]

  return (
    <div className={cn('w-full', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-3">
        {/* 컬러 미리보기 + Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={handlePreviewClick}
            className={cn(
              'w-12 h-11 rounded-[8px] border-2 transition-all duration-200',
              'hover:ring-2 hover:ring-primary-500/20 hover:border-primary-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              error
                ? 'border-primary-600'
                : 'border-border'
            )}
            style={{ backgroundColor: value }}
            aria-label="컬러 선택"
          >
            {/* 투명 체크보드 패턴 (투명도 표시용) */}
            <div
              className="w-full h-full rounded-[6px]"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
              }}
            >
              <div
                className="w-full h-full rounded-[6px]"
                style={{ backgroundColor: value }}
              />
            </div>
          </button>
          
          {/* 숨겨진 color input */}
          <input
            ref={inputRef}
            type="color"
            value={value}
            onChange={handleColorChange}
            className="absolute opacity-0 w-0 h-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* HEX 값 입력 */}
        <div className="flex-1">
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={(e) => {
              const newValue = e.target.value.replace(/[^0-9A-Fa-f]/g, '')
              if (newValue.length <= 6) {
                onChange('#' + newValue)
              }
            }}
            onBlur={(e) => {
              // 유효성 검사 및 포맷팅
              let color = e.target.value.replace(/^#/, '').toUpperCase()
              if (color.length === 3) {
                // #RGB -> #RRGGBB 변환
                color = color.split('').map(c => c + c).join('')
              }
              if (color.length === 6 && /^[0-9A-F]{6}$/.test(color)) {
                onChange('#' + color)
              } else {
                // 유효하지 않으면 원래 값으로 복원
                e.target.value = value.toUpperCase()
              }
            }}
            className={cn(
              'w-full h-11 px-4 py-3 bg-white border rounded-[8px] text-text-primary',
              'text-base font-mono',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              error
                ? 'border-primary-600 focus:ring-primary-600/20 focus:border-primary-600'
                : 'border-border hover:border-gray-400'
            )}
            placeholder="#FF5A1F"
            maxLength={7}
          />
        </div>
      </div>

      {/* 프리셋 토글 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mt-2 text-xs text-primary-500 hover:text-primary-600 transition-colors"
      >
        {isOpen ? '프리셋 숨기기' : '프리셋 컬러 보기'}
      </button>

      {/* 프리셋 컬러 (선택 사항) */}
      {isOpen && (
        <div className="mt-2 p-3 bg-white border border-border rounded-[8px] shadow-lg">
          <p className="text-xs text-text-muted mb-2">프리셋 컬러</p>
          <div className="flex flex-wrap gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-8 h-8 rounded-lg border-2 transition-all',
                  'hover:scale-110 hover:ring-2 hover:ring-primary-500/20',
                  value.toUpperCase() === color.toUpperCase()
                    ? 'border-primary-500 ring-2 ring-primary-500/20'
                    : 'border-gray-200'
                )}
                style={{ backgroundColor: color }}
                aria-label={`컬러 ${color} 선택`}
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-primary-600 flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  )
}

