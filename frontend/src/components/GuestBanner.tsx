import { Link } from 'react-router-dom'
import { LogIn, X } from 'lucide-react'
import { useState } from 'react'

interface GuestBannerProps {
  onClose?: () => void
}

export default function GuestBanner({ onClose }: GuestBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  return (
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-3">
            <LogIn className="w-4 h-4" />
            <p className="text-sm font-medium">
              지금 만든 설정, 저장하려면{' '}
              <Link 
                to="/login" 
                className="underline font-semibold hover:no-underline"
              >
                로그인
              </Link>
              하세요.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="text-sm font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-colors"
            >
              무료 가입
            </Link>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              aria-label="배너 닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


