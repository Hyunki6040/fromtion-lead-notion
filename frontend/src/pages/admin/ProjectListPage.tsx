import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ExternalLink, MoreVertical, Trash2, Settings, Users, Pencil, Check, X } from 'lucide-react'
import { projectApi } from '../../lib/api'
import { useToast } from '../../contexts/ToastContext'
import { formatRelativeTime } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card, CardContent } from '../../components/ui/Card'

interface Project {
  project_id: string
  name: string
  notion_url: string
  public_slug: string
  created_at: string
  lead_count: number
}

export default function ProjectListPage() {
  const { addToast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectApi.list()
      setProjects(response.data.projects)
    } catch (error) {
      addToast({ type: 'error', message: '프로젝트를 불러오지 못했습니다.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('정말로 이 프로젝트를 삭제하시겠습니까?\n수집된 리드 데이터도 함께 삭제됩니다.')) {
      return
    }

    try {
      await projectApi.delete(projectId)
      setProjects(projects.filter((p) => p.project_id !== projectId))
      addToast({ type: 'success', message: '프로젝트가 삭제되었습니다.' })
    } catch (error) {
      addToast({ type: 'error', message: '프로젝트 삭제에 실패했습니다.' })
    }
  }

  // 인라인 이름 수정 시작
  const startEditing = (project: Project) => {
    setEditingId(project.project_id)
    setEditingName(project.name)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }

  // 이름 수정 취소
  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  // 이름 저장
  const saveProjectName = async (projectId: string) => {
    if (!editingName.trim()) {
      addToast({ type: 'error', message: '프로젝트 이름을 입력해주세요.' })
      return
    }

    setIsSaving(true)
    try {
      await projectApi.update(projectId, { name: editingName.trim() })
      setProjects(projects.map((p) =>
        p.project_id === projectId ? { ...p, name: editingName.trim() } : p
      ))
      addToast({ type: 'success', message: '프로젝트 이름이 변경되었습니다.' })
      setEditingId(null)
      setEditingName('')
    } catch (error) {
      addToast({ type: 'error', message: '이름 변경에 실패했습니다.' })
    } finally {
      setIsSaving(false)
    }
  }

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent, projectId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveProjectName(projectId)
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  // 검색 필터링
  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.public_slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            프로젝트
          </h1>
          <p className="mt-1 text-text-secondary">
            프로젝트별 리드 수집 현황을 확인하세요
          </p>
        </div>
        <Link to="/admin/projects/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            새 프로젝트
          </Button>
        </Link>
      </div>

      {/* 검색 */}
      <div className="mb-6">
        <Input
          placeholder="프로젝트 이름 또는 슬러그로 검색"
          leftIcon={<Search className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 프로젝트 목록 */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent>
                <div className="animate-pulse flex items-center justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            {searchQuery ? (
              <>
                <Search className="w-12 h-12 mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  검색 결과가 없습니다
                </h3>
                <p className="text-text-secondary">
                  다른 검색어로 시도해보세요.
                </p>
              </>
            ) : (
              <>
                <Plus className="w-12 h-12 mx-auto text-text-muted mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  아직 프로젝트가 없어요
                </h3>
                <p className="text-text-secondary mb-4">
                  Notion 콘텐츠로 첫 리드를 수집해보세요.
                </p>
                <Link to="/admin/projects/new">
                  <Button leftIcon={<Plus className="w-4 h-4" />}>
                    새 프로젝트
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <Card key={project.project_id}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    {editingId === project.project_id ? (
                      // 인라인 수정 모드
                      <div className="flex items-center gap-2">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, project.project_id)}
                          className="flex-1 px-2 py-1 text-sm border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled={isSaving}
                        />
                        <button
                          onClick={() => saveProjectName(project.project_id)}
                          disabled={isSaving}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          title="저장"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={isSaving}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          title="취소"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      // 일반 표시 모드
                      <div className="flex items-center gap-2 group">
                        <Link
                          to={`/admin/projects/${project.project_id}`}
                          className="block"
                        >
                          <h3 className="font-medium text-text-primary truncate hover:text-primary-600 transition-colors">
                            {project.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => startEditing(project)}
                          className="p-1 text-gray-400 hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all"
                          title="이름 수정"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                      <span>/{project.public_slug}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(project.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Link
                      to={`/admin/projects/${project.project_id}/leads`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      {project.lead_count}명
                    </Link>

                    <a
                      href={`/v/${project.public_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-text-muted hover:text-primary-500 transition-colors"
                      title="공유 페이지 열기"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>

                    {/* 더보기 메뉴 */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === project.project_id
                              ? null
                              : project.project_id
                          )
                        }
                        className="p-2 text-text-muted hover:text-text-primary transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {activeDropdown === project.project_id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <Link
                              to={`/admin/projects/${project.project_id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-gray-100 transition-colors"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <Settings className="w-4 h-4" />
                              설정
                            </Link>
                            <button
                              onClick={() => {
                                setActiveDropdown(null)
                                handleDelete(project.project_id)
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              삭제
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


