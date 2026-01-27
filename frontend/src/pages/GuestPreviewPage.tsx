import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'
import { guestStorage } from '../lib/guestStorage'
import GuestBanner from '../components/GuestBanner'
import NotionEmbed from '../components/viewer/NotionEmbed'
import BlurOverlay from '../components/viewer/BlurOverlay'
import TopBottomForm from '../components/viewer/TopBottomForm'
import EntryModal from '../components/viewer/EntryModal'
import LeadForm from '../components/viewer/LeadForm'
import Button from '../components/ui/Button'

export default function GuestPreviewPage() {
  const navigate = useNavigate()
  const [project, setProject] = useState(guestStorage.get())
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const data = guestStorage.get()
    if (!data || !data.notion_url) {
      navigate('/create')
      return
    }
    setProject(data)

    // 진입 모달 표시
    if (data.ux_config?.entry_modal?.enabled) {
      setShowModal(true)
    }
  }, [navigate])

  const handleUnlock = async () => {
    setIsUnlocked(true)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    return { success: true }
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  const { ux_config, blind_config, form_config, notion_url } = project

  return (
    <div className="min-h-screen bg-white">
      {/* 비회원 안내 배너 */}
      <GuestBanner />

      {/* 미리보기 모드 안내 바 */}
      <div className="sticky top-0 z-50 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-4">
              <Link
                to="/create"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                설정으로 돌아가기
              </Link>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-300">
                미리보기 모드 - 실제 리드는 수집되지 않습니다
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/create')}
              leftIcon={<Settings className="w-4 h-4" />}
              className="text-white hover:bg-gray-800"
            >
              설정 변경
            </Button>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Notion 임베드 + 블러 오버레이 */}
        <div 
          className="relative"
          style={{
            overflow: !isUnlocked ? 'hidden' : 'visible',
            height: !isUnlocked ? '100vh' : 'auto',
          }}
        >
          <NotionEmbed 
            url={notion_url} 
            isPreview={true} 
            isLocked={!isUnlocked}
            height={blind_config?.iframe_height || 600}
          />
          {!isUnlocked && (
            <BlurOverlay
              method={(blind_config?.method || 'preview-then-blur') as 'section-blur' | 'preview-then-blur' | 'keyword-blackout' | 'random-text-highlight'}
              intensity={(blind_config?.intensity || 'medium') as 'light' | 'medium' | 'strong'}
              position={blind_config?.position || 30}
              textHighlightRatio={blind_config?.text_highlight_ratio || 30}
            />
          )}
          
          {/* Unlocked 상태: 전체 콘텐츠 안내 */}
          {isUnlocked && notion_url && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Unlocked!
                </h2>
                <p className="text-gray-600 mb-4 text-sm">
                  실제 뷰어에서 이 화면이 표시됩니다.
                </p>
                <a
                  href={notion_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Notion 페이지 보기
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 하단 폼 */}
        {ux_config?.bottom_form?.enabled && !isUnlocked && form_config && (
          <TopBottomForm
            position="bottom"
            title={ux_config.bottom_form.title}
            subtitle={ux_config.bottom_form.subtitle}
            formConfig={form_config}
            onSubmit={handleUnlock}
          />
        )}

        {/* 진입 모달 */}
        <EntryModal
          isOpen={showModal && !isUnlocked}
          onClose={ux_config?.entry_modal?.allow_close !== false ? () => setShowModal(false) : undefined}
          title={ux_config?.entry_modal?.title}
          subtitle={ux_config?.entry_modal?.subtitle}
        >
          {form_config && (
            <LeadForm
              formConfig={form_config}
              onSubmit={handleUnlock}
            />
          )}
        </EntryModal>

        {/* Unlock 토스트 */}
        {showToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            ✓ Done. 흐름 이어갑니다. (미리보기)
          </div>
        )}
      </div>
    </div>
  )
}


