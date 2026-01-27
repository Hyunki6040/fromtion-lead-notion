import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus, Save, Share2 } from 'lucide-react'
import Button from './ui/Button'
import Modal from './ui/Modal'

interface LoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
  action: 'save' | 'share' | 'general'
}

export default function LoginPromptModal({ isOpen, onClose, action }: LoginPromptModalProps) {
  const navigate = useNavigate()

  const getContent = () => {
    switch (action) {
      case 'save':
        return {
          icon: Save,
          title: '지금 만든 설정, 저장하려면 로그인하세요',
          description: '로그인하면 언제든 다시 편집하고, 들어온 Signal을 확인할 수 있어요.',
        }
      case 'share':
        return {
          icon: Share2,
          title: '공유 링크를 활성화하려면 로그인하세요',
          description: '로그인하면 영구적인 링크가 생성되고, 독자와 연결을 시작할 수 있어요.',
        }
      default:
        return {
          icon: LogIn,
          title: '계속하려면 로그인하세요',
          description: '로그인하면 프로젝트 저장, Signal 관리, CSV 내보내기 등 모든 기능을 이용할 수 있어요.',
        }
    }
  }

  const content = getContent()
  const IconComponent = content.icon

  const handleLogin = () => {
    onClose()
    navigate('/login', { state: { from: window.location.pathname } })
  }

  const handleRegister = () => {
    onClose()
    navigate('/register', { state: { from: window.location.pathname } })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mx-auto mb-6">
            <IconComponent className="w-8 h-8 text-primary-600" />
          </div>

          <h2 className="text-xl font-display font-bold text-text-primary mb-3">
            {content.title}
          </h2>
          
          <p className="text-text-secondary mb-8">
            {content.description}
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              className="w-full"
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              로그인
            </Button>
            
            <Button
              onClick={handleRegister}
              variant="outline"
              className="w-full"
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              무료 회원가입
            </Button>
          </div>

        <p className="mt-6 text-xs text-text-muted">
          가입하면 지금 작업 중인 설정이 자동으로 저장돼요.
        </p>
      </div>
    </Modal>
  )
}

