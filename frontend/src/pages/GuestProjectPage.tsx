import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Share2,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeft,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import { isValidNotionUrl, generateSlug } from '../lib/utils'
import { projectApi } from '../lib/api'
import { guestStorage, GuestProjectData, defaultGuestProjectData } from '../lib/guestStorage'
import GuestBanner from '../components/GuestBanner'
import LoginPromptModal from '../components/LoginPromptModal'
import LivePreview from '../components/admin/LivePreview'
import UXConfigSection from '../components/admin/UXConfigSection'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Switch from '../components/ui/Switch'
import Select from '../components/ui/Select'
import ColorPicker from '../components/ui/ColorPicker'
import { Card, CardContent } from '../components/ui/Card'
import { cn } from '../lib/utils'

export default function GuestProjectPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addToast } = useToast()
  const { isAuthenticated } = useAuth()

  const [data, setData] = useState<Omit<GuestProjectData, 'id' | 'created_at' | 'updated_at'>>({
    ...defaultGuestProjectData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginAction, setLoginAction] = useState<'save' | 'share' | 'general'>('general')
  const [previewSlug, setPreviewSlug] = useState(generateSlug())
  const [slugChecking, setSlugChecking] = useState(false)

  // 초기 슬러그 자동 생성 (비회원 신규 진입 시)
  useEffect(() => {
    const existingData = guestStorage.get()
    if (!existingData || !existingData.public_slug) {
      const newSlug = generateSlug()
      setPreviewSlug(newSlug)
      setData((prev) => ({ ...prev, public_slug: prev.public_slug || newSlug }))
    } else {
      setPreviewSlug(existingData.public_slug)
    }
  }, []) // 최초 한 번만

  // 슬러그 랜덤 재생성 함수
  const regenerateSlug = () => {
    const newSlug = generateSlug()
    setPreviewSlug(newSlug)
    setData((prev) => ({ ...prev, public_slug: newSlug }))
  }

  // 설정 패널 섹션 열림/닫힘 상태
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basic: true,
    ux: true,
    blind: false,
    form: false,
    theme: false,
  })

  // 모바일에서 설정 패널 표시 여부
  const [showSettings, setShowSettings] = useState(true)

  // URL에서 notion_url 가져오기 또는 기존 데이터 로드
  useEffect(() => {
    const urlParam = searchParams.get('url')
    const existingData = guestStorage.get()

    if (existingData) {
      setData({
        name: existingData.name,
        notion_url: existingData.notion_url,
        public_slug: existingData.public_slug,
        ux_config: existingData.ux_config,
        blind_config: existingData.blind_config,
        form_config: existingData.form_config,
        theme_config: existingData.theme_config,
      })
      setPreviewSlug(existingData.public_slug)
    } else if (urlParam) {
      const decodedUrl = decodeURIComponent(urlParam)
      setData((prev) => ({ ...prev, notion_url: decodedUrl }))
    }
  }, [searchParams])

  // 로그인 상태면 admin으로 리다이렉트 (URL 파라미터 유지)
  useEffect(() => {
    if (isAuthenticated) {
      const urlParam = searchParams.get('url')
      if (urlParam) {
        navigate(`/admin/projects/new?url=${urlParam}`)
      } else {
        navigate('/admin/projects/new')
      }
    }
  }, [isAuthenticated, navigate, searchParams])

  // 데이터 변경시 로컬 저장
  useEffect(() => {
    if (data.notion_url) {
      guestStorage.save({
        ...data,
        public_slug: data.public_slug || previewSlug,
      })
    }
  }, [data, previewSlug])

  // 슬러그 중복 확인 (debounced)
  const checkSlugAvailability = useCallback(
    async (slug: string) => {
      if (!slug || slug.length < 2) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.public_slug
          return newErrors
        })
        return
      }

      // 슬러그 형식 검증
      if (!/^[a-z0-9-]+$/.test(slug)) {
        setErrors((prev) => ({ ...prev, public_slug: '영문, 숫자, 하이픈만 사용할 수 있습니다.' }))
        return
      }

      setSlugChecking(true)
      try {
        const response = await projectApi.checkSlug(slug)
        if (response.data.available) {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors.public_slug
            return newErrors
          })
        } else {
          setErrors((prev) => ({ ...prev, public_slug: response.data.message || '이미 사용 중인 슬러그입니다.' }))
        }
      } catch (error: any) {
        // API 에러는 무시하고 진행
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.public_slug
          return newErrors
        })
      } finally {
        setSlugChecking(false)
      }
    },
    []
  )

  // 슬러그 변경 시 중복 확인 (debounce)
  useEffect(() => {
    if (!data.public_slug) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.public_slug
        return newErrors
      })
      return
    }

    const timer = setTimeout(() => {
      checkSlugAvailability(data.public_slug)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [data.public_slug, checkSlugAvailability])

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const handleSave = () => {
    setLoginAction('save')
    setShowLoginModal(true)
  }

  const handleShare = () => {
    // 기본 유효성 검사
    if (!data.notion_url) {
      addToast({ type: 'error', message: 'Notion URL을 입력해주세요.' })
      return
    }
    if (!isValidNotionUrl(data.notion_url)) {
      addToast({ type: 'error', message: '올바른 Notion URL을 입력해주세요.' })
      return
    }
    setLoginAction('share')
    setShowLoginModal(true)
  }

  const handlePreview = () => {
    window.open(`/preview/guest`, '_blank')
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/v/${data.public_slug || previewSlug}`
    navigator.clipboard.writeText(link)
    addToast({ type: 'info', message: '링크가 복사되었습니다. 저장하려면 로그인하세요.' })
  }

  return (
    <div className="h-screen bg-surface flex flex-col overflow-hidden">
      {/* 비회원 안내 배너 */}
      <GuestBanner />

      {/* 헤더 */}
      <header className="flex-shrink-0 bg-white border-b border-gray-100 z-40">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="font-display font-bold text-xl text-text-primary hidden sm:block">
                  FORMTION
                </span>
              </Link>
              <span className="text-text-muted hidden md:block">|</span>
              <span className="text-sm text-text-secondary hidden md:block">
                리드 수집 설정
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* 모바일: 설정 패널 토글 */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-gray-100"
                title={showSettings ? '설정 숨기기' : '설정 보기'}
              >
                {showSettings ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
              </button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreview}
                leftIcon={<ExternalLink className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">미리보기</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                leftIcon={<Save className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">저장하기</span>
              </Button>
              <Button
                size="sm"
                onClick={handleShare}
                leftIcon={<Share2 className="w-4 h-4" />}
              >
                공유하기
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠: 좌측 미리보기 + 우측 설정 */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* 좌측: 실시간 미리보기 (60%) */}
        <div
          className={cn(
            'flex-1 lg:flex-[6] overflow-hidden bg-gray-50',
            !showSettings && 'flex-1'
          )}
        >
          <LivePreview
            notionUrl={data.notion_url}
            uxConfig={data.ux_config}
            blindConfig={data.blind_config}
            formConfig={data.form_config}
            themeConfig={data.theme_config}
          />
        </div>

        {/* 우측: 설정 패널 (40%) */}
        <div
          className={cn(
            'lg:flex-[4] w-full lg:w-auto lg:max-w-md border-l border-gray-200 bg-white overflow-y-auto overflow-x-hidden',
            'transition-all duration-300',
            showSettings ? 'block' : 'hidden lg:block'
          )}
        >
          <div className="p-4 space-y-4" style={{ minHeight: '1200px' }}>
            {/* 공유 링크 */}
            <Card>
              <CardContent className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-muted mb-1">공유 링크 (로그인 후 활성화)</p>
                    <p className="text-sm text-text-primary font-mono truncate">
                      /v/{data.public_slug || previewSlug}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 기본 정보 */}
            <SettingsSection
              title="프로젝트 기본 정보"
              isOpen={openSections.basic}
              onToggle={() => toggleSection('basic')}
            >
              <div className="space-y-4">
                <Input
                  label="Notion URL"
                  placeholder="https://notion.so/..."
                  value={data.notion_url}
                  onChange={(e) => setData({ ...data, notion_url: e.target.value })}
                  error={errors.notion_url}
                  required
                />
                <Input
                  label="프로젝트 이름"
                  placeholder="예: 마케팅 템플릿"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  error={errors.name}
                />
                <Input
                  label="공유 링크 슬러그 (선택)"
                  placeholder="영문, 숫자, 하이픈만 사용"
                  value={data.public_slug}
                  onChange={(e) =>
                    setData({
                      ...data,
                      public_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    })
                  }
                  error={errors.public_slug}
                  helperText={
                    slugChecking
                      ? '확인 중...'
                      : errors.public_slug || '자동 생성된 값을 필요에 따라 수정하세요. (영문, 숫자, 하이픈)'
                  }
                  rightIcon={
                    <button
                      type="button"
                      onClick={regenerateSlug}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="새 슬러그 생성"
                    >
                      <RefreshCw className="w-4 h-4 text-text-muted hover:text-text-primary" />
                    </button>
                  }
                />
              </div>
            </SettingsSection>

            {/* UX 패턴 */}
            <SettingsSection
              title="폼을 어디에 보여줄까요?"
              isOpen={openSections.ux}
              onToggle={() => toggleSection('ux')}
            >
              <UXConfigSection
                uxConfig={data.ux_config}
                onUpdate={(updates) =>
                  setData({
                    ...data,
                    ux_config: { ...data.ux_config, ...updates },
                  })
                }
              />
            </SettingsSection>

            {/* 블라인드 설정 */}
            <SettingsSection
              title="어떻게 가릴까요?"
              isOpen={openSections.blind}
              onToggle={() => toggleSection('blind')}
            >
              <div className="space-y-4">
                <Select
                  label="블라인드 방식"
                  options={[
                    { value: 'section-blur', label: '전체 블러' },
                    { value: 'preview-then-blur', label: '프리뷰 + 블러' },
                    { value: 'random-text-highlight', label: '랜덤 텍스트 하이라이트' },
                  ]}
                  value={data.blind_config.method}
                  onChange={(e) =>
                    setData({
                      ...data,
                      blind_config: { ...data.blind_config, method: e.target.value },
                    })
                  }
                />
                {data.blind_config.method === 'random-text-highlight' && (
                  <Input
                    label="가릴 단어 비율 (%)"
                    type="number"
                    placeholder="30"
                    min="0"
                    max="100"
                    value={data.blind_config.text_highlight_ratio?.toString() || '30'}
                    onChange={(e) =>
                      setData({
                        ...data,
                        blind_config: {
                          ...data.blind_config,
                          text_highlight_ratio: parseInt(e.target.value) || 30,
                        },
                      })
                    }
                    helperText="0-100% 사이의 값으로 설정하세요. 높을수록 더 많은 텍스트가 가려집니다."
                  />
                )}
                <Select
                  label="블러 강도"
                  options={[
                    { value: 'light', label: '약함' },
                    { value: 'medium', label: '보통' },
                    { value: 'strong', label: '강함' },
                  ]}
                  value={data.blind_config.intensity}
                  onChange={(e) =>
                    setData({
                      ...data,
                      blind_config: { ...data.blind_config, intensity: e.target.value },
                    })
                  }
                />
                <Select
                  label="블러 시작 위치"
                  options={[
                    { value: 'top', label: '상단 (30%)' },
                    { value: 'middle', label: '중간 (50%)' },
                    { value: 'bottom', label: '하단 (70%)' },
                  ]}
                  value={data.blind_config.preset}
                  onChange={(e) =>
                    setData({
                      ...data,
                      blind_config: { ...data.blind_config, preset: e.target.value },
                    })
                  }
                />
                <Input
                  label="콘텐츠 영역 높이 (px)"
                  type="number"
                  placeholder="600"
                  value={data.blind_config.iframe_height?.toString() || '600'}
                  onChange={(e) =>
                    setData({
                      ...data,
                      blind_config: {
                        ...data.blind_config,
                        iframe_height: parseInt(e.target.value) || 600,
                      },
                    })
                  }
                  helperText="Notion 콘텐츠가 표시될 영역의 높이를 설정합니다"
                />
              </div>
            </SettingsSection>

            {/* 수집 필드 */}
            <SettingsSection
              title="어떤 정보를 수집할까요?"
              isOpen={openSections.form}
              onToggle={() => toggleSection('form')}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-text-primary">이메일</span>
                  <span className="text-xs text-text-muted">필수</span>
                </div>
                <Switch
                  label="이름"
                  checked={data.form_config.fields.name.enabled}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form_config: {
                        ...data.form_config,
                        fields: {
                          ...data.form_config.fields,
                          name: { ...data.form_config.fields.name, enabled: e.target.checked },
                        },
                      },
                    })
                  }
                />
                <Switch
                  label="회사명"
                  checked={data.form_config.fields.company.enabled}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form_config: {
                        ...data.form_config,
                        fields: {
                          ...data.form_config.fields,
                          company: { ...data.form_config.fields.company, enabled: e.target.checked },
                        },
                      },
                    })
                  }
                />
                <Switch
                  label="직무"
                  checked={data.form_config.fields.role.enabled}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form_config: {
                        ...data.form_config,
                        fields: {
                          ...data.form_config.fields,
                          role: { ...data.form_config.fields.role, enabled: e.target.checked },
                        },
                      },
                    })
                  }
                />
                <Switch
                  label="마케팅 수신 동의"
                  checked={data.form_config.consent.marketing.enabled}
                  onChange={(e) =>
                    setData({
                      ...data,
                      form_config: {
                        ...data.form_config,
                        consent: {
                          ...data.form_config.consent,
                          marketing: { ...data.form_config.consent.marketing, enabled: e.target.checked },
                        },
                      },
                    })
                  }
                />
              </div>
            </SettingsSection>

            {/* 테마 */}
            <SettingsSection
              title="테마 설정"
              isOpen={openSections.theme}
              onToggle={() => toggleSection('theme')}
            >
              <div className="space-y-4">
                <ColorPicker
                  label="메인 컬러"
                  value={data.theme_config?.primary_color || '#FF5A1F'}
                  onChange={(color) =>
                    setData({
                      ...data,
                      theme_config: {
                        ...data.theme_config,
                        primary_color: color,
                      },
                    })
                  }
                  helperText="버튼, 링크, 강조 색상에 사용됩니다"
                />
              </div>
            </SettingsSection>

            {/* 공유하기 CTA */}
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <CardContent className="py-4">
                <div className="text-center">
                  <h3 className="font-semibold text-text-primary mb-2">
                    준비됐어요!
                  </h3>
                  <p className="text-sm text-text-secondary mb-4">
                    로그인하면 링크가 저장되고, 언제든 다시 편집할 수 있어요.
                  </p>
                  <Button onClick={handleShare} className="w-full" leftIcon={<Share2 className="w-4 h-4" />}>
                    공유하기 (로그인 필요)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 홈으로 돌아가기 */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>

      {/* 로그인 유도 모달 */}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action={loginAction}
      />
    </div>
  )
}

// 설정 섹션 컴포넌트
interface SettingsSectionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function SettingsSection({ title, isOpen, onToggle, children }: SettingsSectionProps) {
  return (
    <Card>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>
      {isOpen && (
        <CardContent className="pt-0 pb-4">
          {children}
        </CardContent>
      )}
    </Card>
  )
}
