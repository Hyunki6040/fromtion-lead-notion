import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Folder, FolderPlus, Trash2, Edit3, Check, X, ExternalLink } from 'lucide-react'
import { bookmarkApi } from '../../lib/api'
import { useToast } from '../../contexts/ToastContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { cn } from '../../lib/utils'

interface BookmarkFolder {
  folder_id: string
  name: string
  description?: string
  order_index: number
  bookmark_count: number
  created_at: string
}

interface BookmarkProject {
  project_id: string
  name: string
  notion_url: string
  public_slug: string
}

interface BookmarkItem {
  bookmark_id: string
  project: BookmarkProject
  folder_id: string | null
  name?: string | null  // 사용자 지정 이름
  memo?: string
  created_at: string
}

export default function SavedPage() {
  const { addToast } = useToast()
  const [folders, setFolders] = useState<BookmarkFolder[]>([])
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null) // null = 전체, 'default' = 기본 폴더
  const [isLoadingFolders, setIsLoadingFolders] = useState(true)
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(true)

  // 폴더 관련 상태
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')

  // 북마크 이름 편집 상태
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(null)
  const [editingBookmarkName, setEditingBookmarkName] = useState('')

  // 초기 로드
  useEffect(() => {
    loadFolders()
    loadBookmarks()
  }, [])

  // 폴더 선택 시 북마크 다시 로드
  useEffect(() => {
    loadBookmarks(selectedFolderId)
  }, [selectedFolderId])

  const loadFolders = async () => {
    setIsLoadingFolders(true)
    try {
      const response = await bookmarkApi.listFolders()
      setFolders(response.data.folders)
    } catch (error) {
      addToast({ type: 'error', message: '폴더 목록을 불러오는데 실패했습니다.' })
    } finally {
      setIsLoadingFolders(false)
    }
  }

  const loadBookmarks = async (folderId?: string | null) => {
    setIsLoadingBookmarks(true)
    try {
      const response = await bookmarkApi.list(folderId === null ? undefined : folderId || undefined)
      setBookmarks(response.data.bookmarks)
    } catch (error) {
      addToast({ type: 'error', message: '북마크 목록을 불러오는데 실패했습니다.' })
    } finally {
      setIsLoadingBookmarks(false)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)
    try {
      await bookmarkApi.createFolder({ name: newFolderName.trim() })
      setNewFolderName('')
      setShowNewFolder(false)
      loadFolders()
      addToast({ type: 'success', message: '폴더가 생성되었습니다.' })
    } catch (error) {
      addToast({ type: 'error', message: '폴더 생성에 실패했습니다.' })
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleUpdateFolder = async (folderId: string) => {
    if (!editingFolderName.trim()) return

    try {
      await bookmarkApi.updateFolder(folderId, { name: editingFolderName.trim() })
      setEditingFolderId(null)
      loadFolders()
      addToast({ type: 'success', message: '폴더 이름이 변경되었습니다.' })
    } catch (error) {
      addToast({ type: 'error', message: '폴더 수정에 실패했습니다.' })
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('폴더를 삭제하시겠습니까? 폴더 내 북마크는 기본 폴더로 이동됩니다.')) return

    try {
      await bookmarkApi.deleteFolder(folderId)
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null)
      }
      loadFolders()
      loadBookmarks(selectedFolderId === folderId ? null : selectedFolderId)
      addToast({ type: 'success', message: '폴더가 삭제되었습니다.' })
    } catch (error) {
      addToast({ type: 'error', message: '폴더 삭제에 실패했습니다.' })
    }
  }

  const handleDeleteBookmark = async (bookmarkId: string) => {
    if (!confirm('저장을 해제하시겠습니까?')) return

    try {
      await bookmarkApi.delete(bookmarkId)
      loadBookmarks(selectedFolderId)
      loadFolders() // 카운트 업데이트
      addToast({ type: 'success', message: '저장이 해제되었습니다.' })
    } catch (error) {
      addToast({ type: 'error', message: '삭제에 실패했습니다.' })
    }
  }

  const handleMoveBookmark = async (bookmarkId: string, newFolderId: string | null) => {
    try {
      await bookmarkApi.update(bookmarkId, { folder_id: newFolderId || undefined })
      loadBookmarks(selectedFolderId)
      loadFolders() // 카운트 업데이트
      addToast({ type: 'success', message: '폴더를 이동했습니다.' })
    } catch (error) {
      addToast({ type: 'error', message: '이동에 실패했습니다.' })
    }
  }

  const handleUpdateBookmarkName = async (bookmarkId: string) => {
    try {
      await bookmarkApi.update(bookmarkId, { name: editingBookmarkName.trim() || undefined })
      setEditingBookmarkId(null)
      setEditingBookmarkName('')
      loadBookmarks(selectedFolderId)
      addToast({ type: 'success', message: '이름이 변경되었습니다.' })
    } catch (error) {
      addToast({ type: 'error', message: '이름 변경에 실패했습니다.' })
    }
  }

  // 북마크 표시 이름 (사용자 지정 이름 또는 프로젝트 이름)
  const getBookmarkDisplayName = (bookmark: BookmarkItem) => {
    return bookmark.name || bookmark.project.name
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Bookmark className="w-6 h-6" />
          저장한 콘텐츠
        </h1>
        <p className="text-text-secondary mt-1">
          북마크한 콘텐츠를 폴더별로 관리하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 사이드바 - 폴더 목록 */}
        <div className="md:col-span-1">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">폴더</h3>
              <button
                onClick={() => setShowNewFolder(true)}
                className="p-1.5 text-text-muted hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                title="새 폴더"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            {/* 새 폴더 생성 */}
            {showNewFolder && (
              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
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
            )}

            {/* 폴더 목록 */}
            <div className="space-y-1">
              {/* 전체 */}
              <button
                onClick={() => setSelectedFolderId(null)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedFolderId === null
                    ? 'bg-primary-50 text-primary-600'
                    : 'hover:bg-gray-50 text-text-primary'
                )}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span>전체</span>
                </div>
              </button>

              {/* 기본 폴더 */}
              <button
                onClick={() => setSelectedFolderId('default')}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedFolderId === 'default'
                    ? 'bg-primary-50 text-primary-600'
                    : 'hover:bg-gray-50 text-text-primary'
                )}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  <span>기본 폴더</span>
                </div>
              </button>

              {/* 사용자 폴더 */}
              {isLoadingFolders ? (
                <div className="py-4 text-center text-text-muted text-sm">
                  로딩 중...
                </div>
              ) : (
                folders.map((folder) => (
                  <div
                    key={folder.folder_id}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                      selectedFolderId === folder.folder_id
                        ? 'bg-primary-50 text-primary-600'
                        : 'hover:bg-gray-50 text-text-primary'
                    )}
                  >
                    {editingFolderId === folder.folder_id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateFolder(folder.folder_id)
                            if (e.key === 'Escape') setEditingFolderId(null)
                          }}
                          className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateFolder(folder.folder_id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingFolderId(null)}
                          className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setSelectedFolderId(folder.folder_id)}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          <Folder className="w-4 h-4" />
                          <span className="truncate">{folder.name}</span>
                          <span className="text-xs text-text-muted">
                            ({folder.bookmark_count})
                          </span>
                        </button>
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingFolderId(folder.folder_id)
                              setEditingFolderName(folder.name)
                            }}
                            className="p-1 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFolder(folder.folder_id)
                            }}
                            className="p-1 text-text-muted hover:text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* 메인 - 북마크 목록 */}
        <div className="md:col-span-3">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">
                {selectedFolderId === null
                  ? '전체'
                  : selectedFolderId === 'default'
                  ? '기본 폴더'
                  : folders.find((f) => f.folder_id === selectedFolderId)?.name || '폴더'}
              </h3>
              <span className="text-sm text-text-muted">
                {bookmarks.length}개 저장됨
              </span>
            </div>

            {isLoadingBookmarks ? (
              <div className="py-12 text-center text-text-muted">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4" />
                로딩 중...
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="py-12 text-center">
                <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-text-muted">저장한 콘텐츠가 없습니다.</p>
                <p className="text-sm text-text-muted mt-1">
                  뷰어 페이지에서 콘텐츠를 저장해보세요.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.bookmark_id}
                    className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      {editingBookmarkId === bookmark.bookmark_id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingBookmarkName}
                            onChange={(e) => setEditingBookmarkName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateBookmarkName(bookmark.bookmark_id)
                              if (e.key === 'Escape') {
                                setEditingBookmarkId(null)
                                setEditingBookmarkName('')
                              }
                            }}
                            placeholder={bookmark.project.name}
                            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateBookmarkName(bookmark.bookmark_id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingBookmarkId(null)
                              setEditingBookmarkName('')
                            }}
                            className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/v/${bookmark.project.public_slug}`}
                              className="font-medium text-text-primary hover:text-primary-500 truncate"
                            >
                              {getBookmarkDisplayName(bookmark)}
                            </Link>
                            <button
                              onClick={() => {
                                setEditingBookmarkId(bookmark.bookmark_id)
                                setEditingBookmarkName(bookmark.name || '')
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-text-primary hover:bg-white rounded transition-all"
                              title="이름 변경"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-sm text-text-muted mt-1 truncate">
                            {bookmark.name ? (
                              <span className="text-xs">원본: {bookmark.project.name} · </span>
                            ) : null}
                            /{bookmark.project.public_slug}
                          </p>
                        </>
                      )}
                    </div>
                    {editingBookmarkId !== bookmark.bookmark_id && (
                      <div className="flex items-center gap-2 ml-4">
                        {/* 폴더 이동 드롭다운 */}
                        <div className="relative group/dropdown">
                          <button
                            className="p-2 text-text-muted hover:text-text-primary hover:bg-white rounded-lg transition-colors"
                            title="폴더 이동"
                          >
                            <Folder className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover/dropdown:block z-10">
                            <button
                              onClick={() => handleMoveBookmark(bookmark.bookmark_id, null)}
                              className={cn(
                                'w-full px-3 py-2 text-sm text-left hover:bg-gray-50',
                                bookmark.folder_id === null && 'text-primary-600 bg-primary-50'
                              )}
                            >
                              기본 폴더
                            </button>
                            {folders.map((folder) => (
                              <button
                                key={folder.folder_id}
                                onClick={() => handleMoveBookmark(bookmark.bookmark_id, folder.folder_id)}
                                className={cn(
                                  'w-full px-3 py-2 text-sm text-left hover:bg-gray-50',
                                  bookmark.folder_id === folder.folder_id && 'text-primary-600 bg-primary-50'
                                )}
                              >
                                {folder.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 외부 링크 */}
                        <a
                          href={`/v/${bookmark.project.public_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-text-muted hover:text-primary-500 hover:bg-white rounded-lg transition-colors"
                          title="새 탭에서 열기"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        {/* 삭제 */}
                        <button
                          onClick={() => handleDeleteBookmark(bookmark.bookmark_id)}
                          className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="저장 해제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
