import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { guestStorage } from '../../lib/guestStorage'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const registerSchema = z
  .object({
    name: z.string().min(2, '이름은 2자 이상이어야 합니다.').optional(),
    email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*[0-9])/,
        '비밀번호는 영문과 숫자를 포함해야 합니다.'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const { addToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const hasGuestProject = guestStorage.exists()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const migratedProjectId = await registerUser(data.email, data.password, data.name)
      
      if (migratedProjectId) {
        addToast({ type: 'success', message: '회원가입이 완료되었습니다. 프로젝트가 저장되었습니다!' })
        navigate(`/admin/projects/${migratedProjectId}`)
      } else {
        addToast({ type: 'success', message: '회원가입이 완료되었습니다.' })
        navigate('/admin')
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || '회원가입에 실패했습니다.'
      addToast({ type: 'error', message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        // PRD: 오렌지 소프트 그라데이션 배경
        background: 'linear-gradient(135deg, #FFF1EA 0%, #FFFFFF 50%, #F7F7F8 100%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #FF5A1F 0%, #E64510 100%)',
              }}
            >
              <span className="text-white font-bold text-xl">F</span>
            </div>
          </Link>
          <h1 className="mt-4 text-2xl font-display font-bold text-text-primary">
            FORMTION
          </h1>
          <p className="mt-2 text-text-secondary">
            콘텐츠로 대화를 시작하세요
          </p>
        </div>

        {/* 비회원 프로젝트 안내 */}
        {hasGuestProject && (
          <div 
            className="mb-4 p-4 rounded-xl border"
            style={{
              backgroundColor: '#FFF1EA',
              borderColor: '#FFD4C4',
            }}
          >
            <p className="text-sm" style={{ color: '#E64510' }}>
              <strong>💡 작업 중인 프로젝트가 있습니다!</strong>
              <br />
              가입하면 자동으로 계정에 저장됩니다.
            </p>
          </div>
        )}

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            회원가입
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="이름"
              type="text"
              placeholder="홍길동"
              leftIcon={<User className="w-5 h-5" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="이메일"
              type="email"
              placeholder="email@example.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <Input
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              placeholder="8자 이상, 영문+숫자"
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              error={errors.password?.message}
              required
              {...register('password')}
            />

            <Input
              label="비밀번호 확인"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 다시 입력하세요"
              leftIcon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              required
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              회원가입
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              이미 계정이 있으신가요?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <p className="mt-8 text-center text-sm text-text-muted">
          © 2024 FORMTION. All rights reserved.
        </p>
      </div>
    </div>
  )
}
