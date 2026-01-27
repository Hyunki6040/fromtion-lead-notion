import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark, X, Check, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { bookmarkApi } from '../../lib/api'
import AuthForm from '../auth/AuthForm'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface BookmarkFolder {
  folder_id: string
  name: string
  bookmark_count: number
}

interface FloatingBookmarkProps {
  projectId: string
  projectName?: string
  primaryColor?: string
}

export default function FloatingBookmark({ projectId, projectName = '', primaryColor = '#FF5A1F' }: FloatingBookmarkProps) {
  const { isAuthenticated } = useAuth()
  const { addToast } = useToast()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState<string | null>(null)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [folders, setFolders] = useState<BookmarkFolder[]>([])
  const [isLoadingFolders, setIsLoadingFolders] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 북마크 이름 입력 관련 상태
  const [showNameInput, setShowNameInput] = useState(false)
  const [bookmarkName, setBookmarkName] = useState('')
  const [selectedFolderForSave, setSelectedFolderForSave] = useState<string | null>(null)

  // 북마크 상태 확인
  useEffect(() => {
    if (isAuthenticated && projectId) {
      checkBookmarkStatus()
    }
  }, [isAuthenticated, projectId])

  // 폴더 로드
  useEffect(() => {
    if (isAuthenticated && isExpanded) {
      loadFolders()
    }
  }, [isAuthenticated, isExpanded])

  const checkBookmarkStatus = async () => {
    try {
      const response = await bookmarkApi.check(projectId)
      setIsBookmarked(response.data.is_bookmarked)
      setBookmarkId(response.data.bookmark_id || null)
      setCurrentFolderId(response.data.folder_id || null)
    } catch (error) {
      // 에러 무시
    }
  }

  const loadFolders = async () => {
    setIsLoadingFolders(true)
    try {
      const response = await bookmarkApi.listFolders()
      setFolders(response.data.folders)
    } catch (error) {
      // 에러 무시
    } finally {
      setIsLoadingFolders(false)
    }
  }

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      setShowNewFolder(false)
      setNewFolderName('')
      setShowNameInput(false)
      setBookmarkName('')
    }
  }

  const handleAuthSuccess = () => {
    checkBookmarkStatus()
    loadFolders()
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)
    try {
      const response = await bookmarkApi.createFolder({ name: newFolderName.trim() })
      setFolders([...folders, response.data])
      setNewFolderName('')
      setShowNewFolder(false)
      addToast({ type: 'success', message: '폴더가 생성되었습니다.' })
    } catch (error: any) {
      addToast({ type: 'error', message: '폴더 생성에 실패했습니다.' })
    } finally {
      setIsCreatingFolder(false)
    }
  }

  // 폴더 클릭 시 - 이미 북마크된 경우 폴더 이동, 아니면 이름 입력 화면 표시
  const handleFolderClick = (folderId: string | null) => {
    if (isBookmarked && bookmarkId) {
      // 이미 북마크됨 - 바로 폴더 이동
      handleMoveToFolder(folderId)
    } else {
      // 새 북마크 - 이름 입력 화면 표시
      setSelectedFolderForSave(folderId)
      setBookmarkName(projectName) // 기본값으로 프로젝트 이름 설정
      setShowNameInput(true)
    }
  }

  // 폴더 이동 (이미 북마크된 경우)
  const handleMoveToFolder = async (folderId: string | null) => {
    if (!bookmarkId) return

    setIsSaving(true)
    try {
      await bookmarkApi.update(bookmarkId, { folder_id: folderId || undefined })
      setCurrentFolderId(folderId)
      addToast({ type: 'success', message: '폴더를 이동했습니다.' })
      loadFolders() // 폴더 카운트 업데이트
    } catch (error: any) {
      const message = error.response?.data?.detail || '이동에 실패했습니다.'
      addToast({ type: 'error', message })
    } finally {
      setIsSaving(false)
    }
  }

  // 새 북마크 저장 (이름 포함)
  const handleSaveBookmark = async () => {
    setIsSaving(true)
    try {
      const response = await bookmarkApi.create({
        project_id: projectId,
        folder_id: selectedFolderForSave || undefined,
        name: bookmarkName.trim() || undefined,
      })
      setIsBookmarked(true)
      setBookmarkId(response.data.bookmark_id)
      setCurrentFolderId(selectedFolderForSave)
      setShowNameInput(false)
      setBookmarkName('')
      addToast({ type: 'success', message: '저장되었습니다.' })
      loadFolders() // 폴더 카운트 업데이트
    } catch (error: any) {
      const message = error.response?.data?.detail || '저장에 실패했습니다.'
      addToast({ type: 'error', message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveBookmark = async () => {
    if (!bookmarkId) return

    setIsSaving(true)
    try {
      await bookmarkApi.delete(bookmarkId)
      setIsBookmarked(false)
      setBookmarkId(null)
      setCurrentFolderId(null)
      addToast({ type: 'success', message: '저장이 해제되었습니다.' })
      loadFolders()
    } catch (error) {
      addToast({ type: 'error', message: '삭제에 실패했습니다.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <motion.button
        onClick={handleToggle}
        className="fixed z-[55] flex items-center justify-center rounded-full shadow-lg transition-colors"
        style={{
          right: '16px',
          bottom: '60px', // "Powered by FORMTION" 위
          width: isExpanded ? '48px' : '48px',
          height: isExpanded ? '48px' : '48px',
          backgroundColor: isBookmarked ? primaryColor : 'white',
          border: isBookmarked ? 'none' : '1px solid #e5e7eb',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExpanded ? (
          <X className="w-5 h-5" style={{ color: isBookmarked ? 'white' : '#6b7280' }} />
        ) : (
          <Bookmark
            className="w-5 h-5"
            style={{
              color: isBookmarked ? 'white' : '#6b7280',
              fill: isBookmarked ? 'white' : 'none',
            }}
          />
        )}
      </motion.button>

      {/* 확장 패널 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[54] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            style={{
              right: '16px',
              bottom: '120px', // 버튼 위
              width: 'calc(100vw - 32px)',
              maxWidth: '320px',
              maxHeight: 'calc(100vh - 180px)',
            }}
          >
            {!isAuthenticated ? (
              // 비로그인: 로그인/회원가입 폼
              <div className="p-4">
                <div className="text-center mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Bookmark className="w-6 h-6" style={{ color: primaryColor }} />
                  </div>
                  <h3 className="font-semibold text-text-primary">콘텐츠 저장하기</h3>
                </div>
                <AuthForm
                  mode={authMode}
                  onModeChange={setAuthMode}
                  onSuccess={handleAuthSuccess}
                  compact
                  hookingText="로그인하면 이 콘텐츠를 저장하고 나중에 다시 볼 수 있어요."
                />
              </div>
            ) : showNameInput ? (
              // 이름 입력 화면
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setShowNameInput(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-text-muted" />
                  </button>
                  <h3 className="font-medium text-text-primary">북마크 저장</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-text-secondary mb-1.5">
                      저장 이름
                    </label>
                    <Input
                      placeholder="북마크 이름 (선택사항)"
                      value={bookmarkName}
                      onChange={(e) => setBookmarkName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveBookmark()
                        if (e.key === 'Escape') setShowNameInput(false)
                      }}
                      autoFocus
                    />
                    <p className="text-xs text-text-muted mt-1">
                      비워두면 원본 콘텐츠 이름이 사용됩니다.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowNameInput(false)}
                    >
                      취소
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSaveBookmark}
                      isLoading={isSaving}
                    >
                      저장
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // 로그인됨: 폴더 목록
              <div className="flex flex-col max-h-[400px]">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Bookmark
                      className="w-5 h-5"
                      style={{
                        color: primaryColor,
                        fill: isBookmarked ? primaryColor : 'none',
                      }}
                    />
                    <span className="font-medium text-text-primary">
                      {isBookmarked ? '저장됨' : '저장하기'}
                    </span>
                  </div>
                  {isBookmarked && (
                    <button
                      onClick={handleRemoveBookmark}
                      disabled={isSaving}
                      className="text-xs text-red-500 hover:text-red-600 disabled:opacity-50"
                    >
                      저장 해제
                    </button>
                  )}
                </div>

                {/* 폴더 목록 */}
                <div className="flex-1 overflow-y-auto">
                  {isLoadingFolders ? (
                    <div className="p-4 text-center text-text-muted text-sm">
                      로딩 중...
                    </div>
                  ) : (
                    <div className="p-2">
                      {/* 기본 폴더 */}
                      <button
                        onClick={() => handleFolderClick(null)}
                        disabled={isSaving}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          currentFolderId === null && isBookmarked
                            ? 'bg-primary-50 text-primary-600'
                            : 'hover:bg-gray-50 text-text-primary'
                        }`}
                      >
                        <span>기본 폴더</span>
                        {currentFolderId === null && isBookmarked && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>

                      {/* 사용자 폴더 */}
                      {folders.map((folder) => (
                        <button
                          key={folder.folder_id}
                          onClick={() => handleFolderClick(folder.folder_id)}
                          disabled={isSaving}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            currentFolderId === folder.folder_id
                              ? 'bg-primary-50 text-primary-600'
                              : 'hover:bg-gray-50 text-text-primary'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{folder.name}</span>
                            <span className="text-xs text-text-muted">
                              ({folder.bookmark_count})
                            </span>
                          </div>
                          {currentFolderId === folder.folder_id && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}

                      {/* 새 폴더 생성 */}
                      {showNewFolder ? (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <Input
                            placeholder="폴더 이름"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCreateFolder()
                              if (e.key === 'Escape') setShowNewFolder(false)
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => setShowNewFolder(false)}
                            >
                              취소
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={handleCreateFolder}
                              isLoading={isCreatingFolder}
                              disabled={!newFolderName.trim()}
                            >
                              생성
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowNewFolder(true)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 mt-1 rounded-lg text-sm text-text-muted hover:bg-gray-50 hover:text-text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          새 폴더 만들기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
