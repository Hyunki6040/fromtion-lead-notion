import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { Toaster } from './components/ui/Toaster'

// 공개 페이지
import LandingPage from './pages/LandingPage'
import GuestProjectPage from './pages/GuestProjectPage'
import GuestPreviewPage from './pages/GuestPreviewPage'

// Admin 페이지
import LoginPage from './pages/admin/LoginPage'
import RegisterPage from './pages/admin/RegisterPage'
import DashboardPage from './pages/admin/DashboardPage'
import ProjectListPage from './pages/admin/ProjectListPage'
import ProjectCreatePage from './pages/admin/ProjectCreatePage'
import ProjectEditPage from './pages/admin/ProjectEditPage'
import LeadListPage from './pages/admin/LeadListPage'
import SavedPage from './pages/admin/SavedPage'

// Viewer 페이지
import ViewerPage from './pages/viewer/ViewerPage'

// 정책 페이지
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import MarketingConsentPage from './pages/MarketingConsentPage'

// 레이아웃
import AdminLayout from './layouts/AdminLayout'

// 보호된 라우트
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// 로그인 상태에서 접근 불가 (로그인/회원가입 페이지용)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* 공개 Viewer 페이지 */}
      <Route path="/v/:slug" element={<ViewerPage />} />

      {/* 랜딩 페이지 (비회원도 접근 가능) */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 비회원 프로젝트 생성/편집 페이지 */}
      <Route path="/create" element={<GuestProjectPage />} />
      
      {/* 비회원 미리보기 페이지 */}
      <Route path="/preview/guest" element={<GuestPreviewPage />} />

      {/* 정책 페이지 */}
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/marketing-consent" element={<MarketingConsentPage />} />

      {/* 인증 페이지 */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        }
      />

      {/* Admin 페이지 */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectListPage />} />
        <Route path="projects/new" element={<ProjectCreatePage />} />
        <Route path="projects/:projectId" element={<ProjectEditPage />} />
        <Route path="projects/:projectId/leads" element={<LeadListPage />} />
        <Route path="saved" element={<SavedPage />} />
      </Route>

      {/* 404 - 홈으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
        <Toaster />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
