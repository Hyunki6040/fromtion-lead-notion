import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Download, RefreshCw } from 'lucide-react'
import { projectApi, leadApi } from '../../lib/api'
import { useToast } from '../../contexts/ToastContext'
import { formatDate } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'

interface Lead {
  lead_id: string
  email: string
  name?: string
  company?: string
  role?: string
  consent_privacy: boolean
  consent_marketing: boolean
  form_location?: string
  created_at: string
}

export default function LeadListPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [project, setProject] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 50

  useEffect(() => {
    loadData()
  }, [projectId, page, searchQuery])

  const loadData = async () => {
    try {
      const [projectRes, leadsRes] = await Promise.all([
        projectApi.get(projectId!),
        leadApi.list(projectId!, { page, limit, search: searchQuery }),
      ])
      setProject(projectRes.data)
      setLeads(leadsRes.data.leads)
      setTotal(leadsRes.data.total)
    } catch (error) {
      addToast({ type: 'error', message: '데이터를 불러오지 못했습니다.' })
      navigate('/admin/projects')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await leadApi.export(projectId!)
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `leads_${project.public_slug}_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      addToast({ type: 'success', message: 'CSV 파일이 다운로드되었습니다.' })
    } catch (error) {
      addToast({ type: 'error', message: '내보내기에 실패했습니다.' })
    } finally {
      setIsExporting(false)
    }
  }

  const totalPages = Math.ceil(total / limit)

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate(`/admin/projects/${projectId}`)}
            className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {project.name}
          </button>
          <h1 className="text-2xl font-display font-bold text-text-primary">
            수집된 리드
          </h1>
          <p className="mt-1 text-text-secondary">
            총 {total}명의 리드가 수집되었습니다
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadData}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            새로고침
          </Button>
          <Button
            onClick={handleExport}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            CSV 내보내기
          </Button>
        </div>
      </div>

      {/* 검색 */}
      <div className="mb-6">
        <Input
          placeholder="이메일, 이름, 회사명으로 검색"
          leftIcon={<Search className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {/* 신호 테이블 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  일시
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  회사
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  직무
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  마케팅 동의
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    {searchQuery ? '검색 결과가 없습니다.' : '아직 리드가 없어요. 링크를 공유하면 여기에 쌓입니다.'}
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.lead_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                      {formatDate(lead.created_at, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {lead.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {lead.company || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {lead.role || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.consent_marketing ? (
                        <span className="text-green-600">O</span>
                      ) : (
                        <span className="text-text-muted">X</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-text-muted">
              {(page - 1) * limit + 1} - {Math.min(page * limit, total)} / {total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}


