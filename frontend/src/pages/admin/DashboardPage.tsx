import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FolderKanban, Users, TrendingUp, ExternalLink } from 'lucide-react'
import { projectApi } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { formatRelativeTime } from '../../lib/utils'
import Button from '../../components/ui/Button'
import { Card, CardContent } from '../../components/ui/Card'

interface Project {
  project_id: string
  name: string
  notion_url: string
  public_slug: string
  created_at: string
  lead_count: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  // 통계 계산
  const totalLeads = projects.reduce((sum, p) => sum + p.lead_count, 0)
  const activeProjects = projects.length

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-text-primary">
          안녕하세요, {user?.name || '사용자'}님 👋
        </h1>
        <p className="mt-1 text-text-secondary">
          FORMTION 대시보드에 오신 것을 환영합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-text-muted">활성 프로젝트</p>
              <p className="text-2xl font-bold text-text-primary">{activeProjects}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-text-muted">수집된 리드</p>
              <p className="text-2xl font-bold text-text-primary">{totalLeads}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-muted">평균 전환율</p>
              <p className="text-2xl font-bold text-text-primary">
                {activeProjects > 0 ? Math.round((totalLeads / activeProjects) * 10) / 10 : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 프로젝트 섹션 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">최근 프로젝트</h2>
          <Link to="/admin/projects/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              새 프로젝트
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardContent>
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FolderKanban className="w-12 h-12 mx-auto text-text-muted mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                아직 프로젝트가 없어요
              </h3>
              <p className="text-text-secondary mb-4">
                Notion 콘텐츠로 첫 리드를 수집해보세요.
              </p>
              <Link to="/admin/projects/new">
                <Button leftIcon={<Plus className="w-4 h-4" />}>
                  첫 프로젝트 만들기
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 4).map((project) => (
              <Card key={project.project_id} hover className="cursor-pointer" onClick={() => window.location.href = `/admin/projects/${project.project_id}`}>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="font-medium text-text-primary truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-text-muted mt-1">
                        {formatRelativeTime(project.created_at)} 생성
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className="text-sm font-medium text-primary-600">
                        {project.lead_count}명 수집
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`/v/${project.public_slug}`, '_blank')
                        }}
                        className="p-1.5 text-text-muted hover:text-primary-500 transition-colors"
                        aria-label="미리보기"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {projects.length > 4 && (
          <div className="mt-4 text-center">
            <Link
              to="/admin/projects"
              className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
            >
              모든 프로젝트 보기 →
            </Link>
          </div>
        )}
      </div>

      {/* 빠른 시작 가이드 */}
      {projects.length === 0 && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              🚀 빠른 시작 가이드
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-600">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">Notion 페이지 준비</h3>
                  <p className="text-sm text-text-secondary">
                    공유할 Notion 페이지를 "웹에 게시" 상태로 설정하세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-600">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">수집할 정보 선택</h3>
                  <p className="text-sm text-text-secondary">
                    이메일, 이름, 회사명 등 필요한 항목만 켜세요.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-600">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">링크 공유</h3>
                  <p className="text-sm text-text-secondary">
                    생성된 링크를 SNS, 뉴스레터 등에 공유하면 리드가 쌓입니다.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

