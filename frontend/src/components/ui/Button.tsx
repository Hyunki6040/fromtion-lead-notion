import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // PRD 기준: Radius 14~16px (캡슐 느낌), 오렌지 배경 + 흰 글자
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[14px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    // CSS 변수에서 primary 색상 가져오기 (없으면 기본값 사용)
    const primaryColor = 'var(--project-primary, #FF5A1F)'
    
    const variants = {
      // PRD: 기본 - 프로젝트 컬러 배경 + 흰 글자
      primary: 'text-white shadow-sm hover:shadow-md active:scale-[0.98]',
      // 보조 스타일
      secondary: 'bg-[#F7F7F8] text-[#111111] hover:bg-gray-100 focus:ring-gray-400 border border-[#E9E9EC]',
      // PRD: 보조 - 투명 배경 + 프로젝트 컬러 테두리
      outline: 'border-2 text-[var(--project-primary,#FF5A1F)] hover:bg-[#FFF1EA] active:scale-[0.98]',
      // 고스트 스타일
      ghost: 'text-[#666A73] hover:bg-[#F7F7F8] hover:text-[#111111] focus:ring-gray-400',
      // 위험 스타일
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm active:scale-[0.98]',
    }

    const sizes = {
      sm: 'h-9 px-4 text-sm gap-1.5',
      md: 'h-11 px-5 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
    }

    // primary variant일 때 동적 스타일 적용
    const dynamicStyle = variant === 'primary' ? {
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    } as React.CSSProperties : {}
    
    // hover 색상 계산을 위한 함수
    const getHoverColor = (color: string) => {
      // CSS 변수인 경우 실제 값을 가져오기
      if (color.startsWith('var(')) {
        const varName = color.match(/var\(([^)]+)\)/)?.[1]
        if (varName) {
          const computedColor = getComputedStyle(document.documentElement).getPropertyValue(varName.trim()) || '#FF5A1F'
          color = computedColor.trim() || '#FF5A1F'
        } else {
          color = '#FF5A1F'
        }
      }
      // hex 색상을 어둡게 만들기 (10% 어둡게)
      const num = parseInt(color.replace('#', ''), 16)
      const r = Math.max(0, Math.floor((num >> 16) * 0.9))
      const g = Math.max(0, Math.floor(((num >> 8) & 0x00ff) * 0.9))
      const b = Math.max(0, Math.floor((num & 0x0000ff) * 0.9))
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={dynamicStyle}
        onMouseEnter={(e) => {
          if (variant === 'primary') {
            const computedColor = getComputedStyle(e.currentTarget).getPropertyValue('--project-primary') || 
                                 getComputedStyle(document.documentElement).getPropertyValue('--project-primary') || 
                                 '#FF5A1F'
            e.currentTarget.style.backgroundColor = getHoverColor(computedColor || primaryColor)
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = primaryColor
          }
        }}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
