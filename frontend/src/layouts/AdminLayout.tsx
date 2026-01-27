import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, LogOut, User, Menu, X, ChevronLeft, ChevronRight, ChevronDown, Plus, Bookmark } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../lib/utils'
import { projectApi } from '../lib/api'

interface RecentProject {
  project_id: string
  name: string
  public_slug: string
  visited_at: number
}

// 최근 방문 프로젝트 저장/로드 유틸
const RECENT_PROJECTS_KEY = 'formtion_recent_projects'
const MAX_RECENT_PROJECTS = 5

const getRecentProjects = (): RecentProject[] => {
  try {
    const stored = localStorage.getItem(RECENT_PROJECTS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const addRecentProject = (project: { project_id: string; name: string; public_slug: string }) => {
  const recent = getRecentProjects().filter(p => p.project_id !== project.project_id)
  recent.unshift({ ...project, visited_at: Date.now() })
  localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(recent.slice(0, MAX_RECENT_PROJECTS)))
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(true)
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])

  // /admin/projects/new 경로에서는 기본적으로 사이드바 접힘
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return location.pathname === '/admin/projects/new'
  })

  // 최근 프로젝트 로드
  useEffect(() => {
    setRecentProjects(getRecentProjects())
  }, [location.pathname])

  // 프로젝트 상세 페이지 방문 시 최근 목록에 추가
  useEffect(() => {
    const match = location.pathname.match(/^\/admin\/projects\/([a-f0-9-]+)$/)
    if (match) {
      const projectId = match[1]
      // API에서 프로젝트 정보 가져와서 저장
      projectApi.get(projectId).then(response => {
        const project = response.data
        addRecentProject({
          project_id: project.project_id,
          name: project.name,
          public_slug: project.public_slug,
        })
        setRecentProjects(getRecentProjects())
      }).catch(() => {
        // 에러 무시
      })
    }
  }, [location.pathname])

  // 경로 변경 시 사이드바 상태 업데이트
  useEffect(() => {
    if (location.pathname === '/admin/projects/new') {
      setIsSidebarCollapsed(true)
    } else {
      // 다른 경로로 이동하면 사이드바 펼치기
      setIsSidebarCollapsed(false)
    }
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* 사이드바 (데스크톱) */}
      <aside className={cn(
        "hidden md:fixed md:inset-y-0 md:flex md:flex-col transition-all duration-300",
        isSidebarCollapsed ? "md:w-0" : "md:w-64"
      )}>
        <div className={cn(
          "flex flex-col flex-grow bg-white border-r border-gray-200 transition-all duration-300",
          isSidebarCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        )}>
          {/* 로고 */}
          <div className="flex items-center h-16 px-6 border-b border-gray-100">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-display font-semibold text-lg text-text-primary">
                FORMTION
              </span>
            </Link>
          </div>

          {/* 네비게이션 */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {/* 대시보드 */}
            <Link
              to="/admin"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === '/admin'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              대시보드
            </Link>

            {/* 프로젝트 (아코디언) */}
            <div>
              <button
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname.startsWith('/admin/projects')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                )}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-5 h-5" />
                  프로젝트
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isProjectsOpen ? 'rotate-180' : ''
                  )}
                />
              </button>

              {/* 프로젝트 하위 메뉴 */}
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  isProjectsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                  {/* 전체 보기 */}
                  <Link
                    to="/admin/projects"
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      location.pathname === '/admin/projects'
                        ? 'text-primary-600 bg-primary-50/50'
                        : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
                    )}
                  >
                    전체 보기
                  </Link>

                  {/* 새 프로젝트 */}
                  <Link
                    to="/admin/projects/new"
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      location.pathname === '/admin/projects/new'
                        ? 'text-primary-600 bg-primary-50/50'
                        : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
                    )}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    새 프로젝트
                  </Link>

                  {/* 최근 프로젝트 */}
                  {recentProjects.length > 0 && (
                    <>
                      <div className="px-3 pt-2 pb-1">
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                          최근 열어본
                        </span>
                      </div>
                      {recentProjects.map((project) => (
                        <Link
                          key={project.project_id}
                          to={`/admin/projects/${project.project_id}`}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors truncate',
                            location.pathname === `/admin/projects/${project.project_id}`
                              ? 'text-primary-600 bg-primary-50/50'
                              : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
                          )}
                          title={project.name}
                        >
                          <span className="truncate">{project.name}</span>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 저장 */}
            <Link
              to="/admin/saved"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === '/admin/saved'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              )}
            >
              <Bookmark className="w-5 h-5" />
              저장
            </Link>
          </nav>

          {/* 사용자 정보 */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 text-sm font-medium text-text-secondary hover:bg-gray-100 hover:text-text-primary rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* 모바일 헤더 */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-display font-semibold text-lg text-text-primary">
            FORMTION
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-text-secondary hover:text-text-primary"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-white pt-16 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {/* 대시보드 */}
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors',
                location.pathname === '/admin'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              대시보드
            </Link>

            {/* 프로젝트 (아코디언) */}
            <div>
              <button
                onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-3 rounded-lg text-base font-medium transition-colors',
                  location.pathname.startsWith('/admin/projects')
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                )}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-5 h-5" />
                  프로젝트
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isProjectsOpen ? 'rotate-180' : ''
                  )}
                />
              </button>

              {/* 프로젝트 하위 메뉴 */}
              <div
                className={cn(
                  'overflow-hidden transition-all duration-200',
                  isProjectsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                  <Link
                    to="/admin/projects"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      location.pathname === '/admin/projects'
                        ? 'text-primary-600 bg-primary-50/50'
                        : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
                    )}
                  >
                    전체 보기
                  </Link>

                  <Link
                    to="/admin/projects/new"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      location.pathname === '/admin/projects/new'
                        ? 'text-primary-600 bg-primary-50/50'
                        : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
                    )}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    새 프로젝트
                  </Link>

                  {recentProjects.length > 0 && (
                    <>
                      <div className="px-3 pt-2 pb-1">
                        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                          최근 열어본
                        </span>
                      </div>
                      {recentProjects.map((project) => (
                        <Link
                          key={project.project_id}
                          to={`/admin/projects/${project.project_id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors truncate',
                            location.pathname === `/admin/projects/${project.project_id}`
                              ? 'text-primary-600 bg-primary-50/50'
                              : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
                          )}
                          title={project.name}
                        >
                          <span className="truncate">{project.name}</span>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 저장 */}
            <Link
              to="/admin/saved"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors',
                location.pathname === '/admin/saved'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
              )}
            >
              <Bookmark className="w-5 h-5" />
              저장
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-base font-medium text-text-secondary hover:bg-gray-100 hover:text-text-primary rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              로그아웃
            </button>
          </nav>
        </div>
      )}

      {/* 사이드바 토글 버튼 (데스크톱) */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="hidden md:fixed md:left-0 md:top-1/2 md:-translate-y-1/2 z-50 bg-white border border-gray-200 rounded-r-lg p-2 shadow-md hover:bg-gray-50 transition-colors"
        style={{ left: isSidebarCollapsed ? '0' : '256px' }}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-5 h-5 text-text-secondary" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        )}
      </button>

      {/* 메인 컨텐츠 */}
      <main className={cn(
        "transition-all duration-300",
        isSidebarCollapsed ? "md:pl-0" : "md:pl-64"
      )}>
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}


