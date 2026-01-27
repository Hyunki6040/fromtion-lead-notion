import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import Button from '../ui/Button'
import Input from '../ui/Input'

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

const registerSchema = z.object({
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
  name: z.string().optional(),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

interface AuthFormProps {
  mode: 'login' | 'register'
  onModeChange?: (mode: 'login' | 'register') => void
  onSuccess?: () => void
  compact?: boolean
  hookingText?: string
}

export default function AuthForm({
  mode,
  onModeChange,
  onSuccess,
  compact = false,
  hookingText,
}: AuthFormProps) {
  const { login, register: registerUser } = useAuth()
  const { addToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onLoginSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      addToast({ type: 'success', message: '로그인되었습니다.' })
      onSuccess?.()
    } catch (error: any) {
      const message = error.response?.data?.detail || '로그인에 실패했습니다.'
      addToast({ type: 'error', message })
    } finally {
      setIsLoading(false)
    }
  }

  const onRegisterSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      await registerUser(data.email, data.password, data.name)
      addToast({ type: 'success', message: '가입되었습니다.' })
      onSuccess?.()
    } catch (error: any) {
      const message = error.response?.data?.detail || '회원가입에 실패했습니다.'
      addToast({ type: 'error', message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-5'}>
      {hookingText && (
        <p className="text-sm text-text-secondary text-center mb-4">
          {hookingText}
        </p>
      )}

      {mode === 'login' ? (
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <Input
            label={compact ? undefined : '이메일'}
            type="email"
            placeholder="email@example.com"
            leftIcon={<Mail className="w-5 h-5" />}
            error={loginForm.formState.errors.email?.message}
            {...loginForm.register('email')}
          />

          <Input
            label={compact ? undefined : '비밀번호'}
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            leftIcon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={loginForm.formState.errors.password?.message}
            {...loginForm.register('password')}
          />

          <Button type="submit" className="w-full" size={compact ? 'md' : 'lg'} isLoading={isLoading}>
            로그인
          </Button>
        </form>
      ) : (
        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
          <Input
            label={compact ? undefined : '이름 (선택)'}
            type="text"
            placeholder="이름"
            leftIcon={<User className="w-5 h-5" />}
            {...registerForm.register('name')}
          />

          <Input
            label={compact ? undefined : '이메일'}
            type="email"
            placeholder="email@example.com"
            leftIcon={<Mail className="w-5 h-5" />}
            error={registerForm.formState.errors.email?.message}
            {...registerForm.register('email')}
          />

          <Input
            label={compact ? undefined : '비밀번호'}
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호 (8자 이상)"
            leftIcon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
            error={registerForm.formState.errors.password?.message}
            {...registerForm.register('password')}
          />

          <Button type="submit" className="w-full" size={compact ? 'md' : 'lg'} isLoading={isLoading}>
            회원가입
          </Button>
        </form>
      )}

      {onModeChange && (
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            {mode === 'login' ? (
              <>
                아직 계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => onModeChange('register')}
                  className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  회원가입
                </button>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => onModeChange('login')}
                  className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
                >
                  로그인
                </button>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
